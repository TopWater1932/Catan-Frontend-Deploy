# from Game import Game
# from Player import Player
from fastapi import FastAPI, WebSocket, WebSocketDisconnect,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from Lobby import Lobby
# from utils.triage_action import admin_action


app = FastAPI()

origins = [
    "http://localhost:5173",  # Allow your Vite development server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.post("/init-inputs")
# async def handleInitInputs():
#     # Process initialization inputs here
#     return {"message": "Initialisation inputs received."}


# @app.get("/initialise")
# async def initialise():
#     initialised = False

#     # Create a new game instance and intialise it. Only do it once, otherwise provide the same info.
#     if initialised == False:
#         game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])
#         initialisePackage = game.setup()

#         initialised = True

#     return initialisePackage

# ********************** WebSocket Lobby **********************



# Hashmap containing all lobbies
lobbies = {}

class CreateLobbyData(BaseModel):
    name: str

# Initial post when using "Create Lobby" button on options page
@app.post("/lobbies")
def createLobby(data: CreateLobbyData):
    name = data.name

    if name in lobbies:
        raise HTTPException(status_code=400, detail="Lobby name already exists.")
    
    if len(lobbies) >= 5:
        raise HTTPException(status_code=400, detail="Too many active lobbies. Please try again later.")

    lobbies[name] = Lobby(name)

    message = f"Lobby '{name}' has been created. You may now join."
    lobbyList = list(lobbies.keys())


    return {'msg':message,'lobbyList':lobbyList}



# class JoinLobbyData(BaseModel):
#     lob_name: str
#     player_id: str
#     player_name: str

# Create websocket connection, add it to a lobby and triage ongoing requests from frontend.
@app.websocket('/ws/')
async def wsEndpoint(websocket: WebSocket):
    await websocket.accept()
    lobby_name = websocket.query_params.get("lobby_name")

    try:
        if lobby_name in lobbies.keys():
            lobby = lobbies[lobby_name]
            await lobby.addToLobby(websocket)
            name = 'Anonymous Villager'
        else:
            message = f'{lobby_name} is not an existing lobby.'
            await websocket.send_json({
                'actionType':'message',
                'msg':message
            })
            await websocket.close(code=1000)
            return

        while True:
            data = await websocket.receive_json()

            if data['actionCategory'] == 'admin':
                if data['actionType'] == 'join':
                    name = data['name']
                    await lobby.broadcast(f'{name} has joined the game.')
            
            # Insert logic on what to do with data when received

    except WebSocketDisconnect:
        await lobby.disconnected(websocket,lobbies,name)



    