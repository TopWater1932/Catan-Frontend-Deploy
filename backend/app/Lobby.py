import asyncio
import jsonpickle as jp

class Lobby:
    def __init__(self,name):
        self.name=name
        self.maxPlayers=4
        self.connections = []
        self.game = False

    # Add new websocket connection to the connections list for this lobby
    async def addToLobby(self,ws):
        self.connections.append(ws)

        message = "Connection successfully added to lobby."
        await ws.send_json({
                'actionCategory':'admin',
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
                'actionCategory':'admin',
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

    # Serialize python object to JSON and send
    async def send_gamestate(self,data,to,**kwargs):
        json_package = jp.encode(data)

        if to == 'all':
            for player in self.connections:
                await player.send_json(json_package)

        elif to == 'me':
            await kwargs['me'].send_json(json_package)

        elif to == 'others':
            for player in self.connections:
                if player is not kwargs['me']:
                    await player.send_json(json_package)