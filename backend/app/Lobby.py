import asyncio

class Lobby:
    def __init__(self,name):
        self.name=name
        self.maxPlayers=4
        self.connections = []

    # Add new websocket connection to the connections list for this lobby
    async def addToLobby(self,ws):
        self.connections.append(ws)

        message = "Connection successfully added to lobby. Please provide player info."
        await ws.send_json({
                'actionType':'message',
                'msg':message
            })

    # Handle users disconnecting
    async def disconnected(self,ws,lobbies,player):
        self.connections.remove(ws)

        if len(self.connections) > 0:
            await self.broadcast(f'{player} has left the game.')

        else:
            await self.lobby_timer(lobbies,30)


    # Broadcast a message to all players
    async def broadcast(self,message):
        for player in self.connections:
            await player.send_json({
                'actionType':'message',
                'msg':message
            })


    # Close the lobby 30secs after all users have left
    async def lobby_timer(self,lobbies,time):
        while len(self.connections) == 0 and time > 0:
            print(f'Lobby will close in: {time}seconds')
            await asyncio.sleep(1)
            time -= 1

            if time <= 0:
                del lobbies[self.name]
                print(f'Lobby {self.name} removed from lobby list.')

    # Send board state
    async def update_board_state(self,board):
        for player in self.connections:
            await player.send_json({
                'actionType':'updateBoardState',
                'data':board
            })