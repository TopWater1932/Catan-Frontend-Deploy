import asyncio
import jsonpickle as jp
from Player import Player

class Lobby:
    def __init__(self,name):
        self.name=name
        self.maxPlayers=4
        self.connections = {}
        self.game = False

    def getPlayerList(self):
        playerNameList = []
        for conn in self.connections.values():
            playerNameList.append({'name':conn[1].name,'color':conn[1].colour})
        return playerNameList


    # Add new websocket connection to the connections list for this lobby
    async def addToLobby(self,ws,playerID):
        if len(self.connections) < self.maxPlayers:
            newPlayer = Player(playerID,f'Anonymous Villager {playerID}')
            self.connections[playerID] = [ws,newPlayer]

            message = "You were successfully added to lobby."
            playerNameList = self.getPlayerList()
            await ws.send_json({
                    'actionCategory':'admin',
                    'actionType':'connected',
                    'msg':message,
                    'playerList': playerNameList
                })
        else:
            message = "Sorry, this lobby already has 4 players. You have not been added."
            await ws.send_json({
                    'actionCategory':'admin',
                    'actionType':'message',
                    'msg':message
                })
            await ws.close(code=1000)

    # Handle users disconnecting
    async def disconnected(self,lobbies,playerID,playerName):
        del self.connections[playerID]

        if len(self.connections) > 0:
            await self.broadcast(f'{playerName} has left the game.')

        else:
            await self.lobby_timer(lobbies,30)


    # Broadcast a message to all players
    async def broadcast(self,actionType,message,data=None):
        for conn in self.connections:
            await self.connections[conn][0].send_json({
                'actionCategory':'admin',
                'actionType':actionType,
                'msg':message,
                'data':data
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
    async def send_gamestate(self,data,to,actionType,**kwargs):
        json_data = {
            'actionCategory': 'game',
            'actionType': actionType,
            'data': data
        }

        json_package = jp.encode(json_data)

        if to == 'all':
            for player in self.connections:
                await player.send_json(json_package)

        elif to == 'me':
            await kwargs['me'].send_json(json_package)

        elif to == 'others':
            for player in self.connections:
                if player is not kwargs['me']:
                    await player.send_json(json_package)