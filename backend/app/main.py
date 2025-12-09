from Game import Game
from Player import Player
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel



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

@app.post("/init-inputs")
async def handleInitInputs():
    # Process initialization inputs here
    return {"message": "Initialisation inputs received."}


@app.get("/initialise")
async def initialise():
    initialised = False

    # Create a new game instance and intialise it. Only do it once, otherwise provide the same info.
    if initialised == False:
        game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])
        initialisePackage = game.setup()

        initialised = True

    return initialisePackage