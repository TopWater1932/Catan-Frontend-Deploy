from Game import Game
from Player import Player
from utils.WS_Conn_Health_Manager import WS_Conn_Health_Manager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect,HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Lobby import Lobby

import json
import requests
import asyncio


app = FastAPI()

origins = [
    "http://localhost:5173",  # Allow Vite development server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Hashmap containing all lobbies
lobbies = {}

class LobbyName(BaseModel):
    name: str


# Initial post when using "Create Lobby" button on options page
@app.post("/lobbies")
def createLobby(data: LobbyName, background_tasks:BackgroundTasks):
    name = data.name

    if name in lobbies:
        raise HTTPException(status_code=400, detail="Lobby name already exists.")
    
    if len(lobbies) >= 5:
        raise HTTPException(status_code=400, detail="Too many active lobbies. Please try again later.")

    lobbies[name] = Lobby(name)
    timeStale = 240

    message = f"Lobby '{name}' has been created. You may now join. Lobby will close in {timeStale//60}mins if nobody has joined."
    lobbyList = list(lobbies.keys())

    background_tasks.add_task(lobbies[name].lobby_timer,lobbies,timeStale)

    return json.dumps({
        'actionCategory':'admin',
        'actionType':'msg',
        'msg':message,
    })


# Create websocket connection, add it to a lobby and triage ongoing requests from frontend.
@app.websocket('/ws/')
async def wsEndpoint(websocket: WebSocket):
    await websocket.accept()
    lobby_name = websocket.query_params.get("lobby_name")

    websocket_health_manager = WS_Conn_Health_Manager(websocket).start_heartbeat()

    try:
        if lobby_name in lobbies.keys():
            lobby = lobbies[lobby_name]
            
        else:
            message = f'{lobby_name} is not an existing lobby.'
            await websocket.send_json({
                'actionCategory':'admin',
                'actionType':'message',
                'msg':message
            })
            await websocket.close(code=1000)
            return
    
        
        # Wait to receive data
        while True:
            data = await websocket.receive_json()
            print(data)

            # Undertake websocket admin actions.
            if data['actionCategory'] == 'admin':                                               
                if data['actionType'] == 'join':

                    # Joining BEFORE game has begun
                    if lobby.game == False:

                        playerID = await lobby.addToLobby(websocket,data)

                        playerNameList = lobby.getPlayerNameList()
                        await lobby.broadcast('player-joined',f'{data['name']} has joined the game.',data=playerNameList)
                    
                    # Joining AFTER the game has begun
                    else:
                        playerID = data['player_id']

                        rejoining_player = next((p for p in lobby.game.players if p.id == playerID), None)

                        if rejoining_player:
                            await lobby.reconnectToLobby(websocket,playerID,rejoining_player)

                            playerNameList = lobby.getPlayerNameList()
                            await lobby.broadcast('player-joined',f'{data['name']} has joined the game.',data=playerNameList)

                        else:
                            message = (
                                f'The game at {lobby_name} has already begun. Joining mid-way is not permitted.'
                            )
                            await websocket.send_json({
                                'actionCategory': 'admin',
                                'actionType': 'message',
                                'msg': message
                            })
                            await websocket.close(code=1000)
                            return

                
                elif data['actionType'] == 'pong':
                    # Keep alive pong response from client
                    print(f'Received pong from {playerID}')
                    await websocket_health_manager.reset_timeout()

            # Undertake actions to do with the game.
            elif data['actionCategory'] == 'game':
                if data['actionType'] == 'initialise':

                    # Create a new game instance and intialise it. Only do it once, otherwise provide the same info.
                    if lobby.game == False:
                        playerList = lobby.getPlayerList()
                        game = Game(None, playerList)
                        game.setup()
                        lobby.game = game
                        intialisedPackage = game
                        await lobby.send_gamestate(intialisedPackage,'all','initialised')
                    else:
                        gameState = lobby.game
                        await lobby.send_gamestate(gameState,'me','initialised',me=websocket)
                
                elif data['actionType'] == 'roll-dice':
                    result = data['data']
                    if result == 7:
                        # IMPORTANT: CHECK IF ANY PLAYER HAS MORE THAN 7 CARDS.

                        await lobby.send_gamestate(None,'me','move-robber',me=websocket)
                    else:
                        game.assign_resources(result)
                        
                        # Send updated player states to all players
                        await lobby.send_gamestate(game.players,'all','player-state')

                elif data['actionType'] == 'move-robber':
                    tile_id = data['data']
                    game.board.move_robber(tile_id)

                    await lobby.send_gamestate(game.board.tiles,'all','tile-state')

                    selected_tile = next((tile for tile in game.board.tiles if tile.id == tile_id), None)

                    if selected_tile is None:
                        print("Error: Selected tile not found.")

                    associated_player_ids = selected_tile.findAssociatedPlayers()

                    if len(associated_player_ids) > 0:
                        await lobby.send_gamestate(associated_player_ids,'me','steal-from',me=websocket)

                elif data['actionType'] == 'steal-from':
                    steal_from_ID = data['data']['from']
                    give_to_ID = data['data']['to']
                    game.steal(steal_from_ID, give_to_ID)


                    await lobby.send_gamestate(game.players,'all','player-state')





                    # Implement logic to steal a card from the target player

                elif data['actionType'] == 'end-turn':
                    lobby.game.nextTurn()
                    await lobby.send_gamestate(lobby.game, 'all', 'new-turn')

                elif data['actionCategory'] == 'build-settlement':
                    nodeID = data['data']['nodeID']
                    node = lobby.game.findNodeByID(nodeID)
                    if lobby.game.setup_phase:
                        success = lobby.game.setupBuildSettlement(nodeID)
                        #send back buildable paths for setup phase
                        await lobby.send(data=node.getPathIDs(),actionType='buildable-paths',recipient='me', me=websocket)
                    else:
                        success = lobby.game.buildSettlement(nodeID)

                    if success:
                        await lobby.send_gamestate(lobby.game.players,'all','player-state')
                    else:
                        #[TODO] handle failed build
                        pass
                        
                elif data['actionCategory'] == 'build-road':
                    pathID = data['data']['pathID']

                    success = lobby.game.buildRoad(pathID)
                    if lobby.game.setup_phase:
                        lobby.game.nextSetupTurn()
                        if lobby.game.setup_phase == False:
                            #setup phase over
                            await lobby.send_gamestate(lobby.game,'all','setup-complete')
                    if success:
                        await lobby.send_gamestate(lobby.game.players,'all','player-state')
                    else:
                        #[TODO] handle failed build
                        pass

                    
    

            
            # Insert logic on what to do with data when received

    except WebSocketDisconnect:
        player = next((p[1] for p in lobby.connections.values() if p[1].id == playerID), None)

        if player:
            await lobby.disconnected(lobbies,playerID,player.name)