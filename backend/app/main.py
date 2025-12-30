from Game import Game
from Player import Player
from fastapi import FastAPI, WebSocket, WebSocketDisconnect,HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Lobby import Lobby
# from utils.triage_action import admin_action

import json
import requests


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

    message = f"Lobby '{name}' has been created. You may now join. Lobby will close in {timeStale/60}mins if nobody has joined."
    lobbyList = list(lobbies.keys())

    background_tasks.add_task(lobbies[name].lobby_timer,lobbies,timeStale)

    return json.dumps({
        'actionCategory':'admin',
        'actionType':'msg',
        'msg':message,
    })


connNum = 0

# Create websocket connection, add it to a lobby and triage ongoing requests from frontend.
@app.websocket('/ws/')
async def wsEndpoint(websocket: WebSocket):
    await websocket.accept()
    lobby_name = websocket.query_params.get("lobby_name")

    global connNum
    try:
        if lobby_name in lobbies.keys():
            lobby = lobbies[lobby_name]
            playerID = f'p{connNum}'
            await lobby.addToLobby(websocket,playerID)
            connNum += 1
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

            # Undertake websocket admin actions.
            if data['actionCategory'] == 'admin':
                if data['actionType'] == 'join':
                    playerObj = lobby.connections[playerID][1]
                    playerObj.name = data['name']
                    playerObj.colour = data['color']

                    playerList = lobby.getPlayerList()
                    await lobby.broadcast('join',f'{playerObj.name} has joined the game.',data=playerList)

            # Undertake actions to do with the game.
            elif data['actionCategory'] == 'game':
                if data['actionType'] == 'initialise':

                    # Create a new game instance and intialise it. Only do it once, otherwise provide the same info.
                    if lobby.game == False:
                        game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])
                        game.setup()
                        lobby.game = game
                        intialisedPackage = game.board
                        await lobby.send_gamestate(intialisedPackage,'all','initialise')
                    else:
                        await websocket.send_gamestate(game,'me','initialise',me=websocket)

            
            # Insert logic on what to do with data when received

    except WebSocketDisconnect:
        await lobby.disconnected(websocket,lobbies,name)