import asyncio
import jsonpickle as jp
from Player import Player
from uuid import uuid4

class Lobby:
    def __init__(self,name):
        self.name=name
        self.maxPlayers=4
        self.connections = {}
        self.game = False
        self.lobbytimer_running = False

    def getPlayerList(self):
        playerList = []
        for conn in self.connections.values():
            playerList.append(conn[1])
        return playerList

    def getPlayerNameList(self):
        playerNameList = []
        for conn in self.connections.values():
            playerNameList.append({'name':conn[1].name,'color':conn[1].color})
        return playerNameList
    
    async def sendInfoOnConnect(self,ws,message,playerObj):
        playerNameList = self.getPlayerNameList()
        gameIsInit = False if self.game == False else True

        await ws.send_json({
                'actionCategory':'admin',
                'actionType':'connected',
                'msg':message,
                'playerList': playerNameList,
                'lobbyName': self.name,
                'player_id': playerObj.id,
                'playerName': playerObj.name,
                'playerColor': playerObj.color,
                'gameInit': gameIsInit
            })


    # Add new websocket connection to the connections list for this lobby
    async def addToLobby(self,ws,data):
        inputError = False
        playerID = str(uuid4())

        playerNameList = self.getPlayerNameList()

        if len(self.connections) >= self.maxPlayers:
            inputError = True
            message = "Sorry, this lobby already has 4 players. You have not been added."

        elif any(data['color'] in player['color'] for player in playerNameList):
            inputError = True
            message = f"Color '{data['color'].capitalize()}' has already been taken."

        elif any(data['name'] in player['name'] for player in playerNameList):
            inputError = True
            message = f"The name '{data['name']}' has already been taken."
        
        if inputError:
            await ws.send_json({
                    'actionCategory':'admin',
                    'actionType':'message',
                    'msg':message
                })
            await ws.close(code=1000)
            return
        
        newPlayer = Player(playerID,data['name'],data['color'])
        self.connections[playerID] = [ws,newPlayer]

        message = "You were successfully added to lobby."
        await self.sendInfoOnConnect(ws,message,newPlayer)
        
        return playerID

    
    # Handle reconnecting users. Use only after game initialised.
    async def reconnectToLobby(self,ws,playerID,rejoiningPlayer):
        rejoiningPlayer.connected = True
        self.connections[playerID] = [ws, rejoiningPlayer]

        message = "You were successfully reconnected to lobby."
        await self.sendInfoOnConnect(ws,message,rejoiningPlayer)
        return True

    # Handle users disconnecting
    async def disconnected(self,lobbies,playerID,playerName):
        self.connections.pop(playerID,None)

        # Disconnecting after game has begun
        if self.game != False:
            disconn_player = next((p for p in self.game.players if p.id == playerID),None)
            if disconn_player:
                disconn_player.connected = False

        if len(self.connections) > 0:
            await self.broadcast('disconnected',f'{playerName} has left the game.',data=self.getPlayerNameList())

        elif len(self.connections) <=0 and not self.lobbytimer_running:
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
        self.lobbytimer_running = True
        
        try:
            while len(self.connections) == 0 and time > 0:
                print(f'Lobby will close in: {time}seconds')
                await asyncio.sleep(1)
                time -= 1

                if time <= 0:
                    del lobbies[self.name]
                    print(f'Lobby {self.name} removed from lobby list.')
        finally:
            self.lobbytimer_running = False

    # Serialize python object to JSON and send
    async def send_gamestate(self,data,to,actionType,**kwargs):
        json_data = {
            'actionCategory':'game',
            'actionType':actionType,
            'data':data
        }

        json_package = jp.encode(json_data,make_refs=False)

        if to == 'all':
            for player in self.connections.values():
                await player[0].send_text(json_package)

        elif to == 'me':
            await kwargs['me'].send_text(json_package)

        elif to == 'others':
            for player in self.connections.values():
                if player[0] is not kwargs['me']:
                    await player[0].send_text(json_package)

    # Generic send function
    async def send(self,data,to,actionCategory,actionType,**kwargs):
        json_data = {
            'actionCategory':actionCategory,
            'actionType':actionType,
            'data':data
        }
        json_package = jp.encode(json_data,make_refs=False)

        if to == 'all':
            for player in self.connections.values():
                await player[0].send_text(json_package)

        elif to == 'me':
            await kwargs['me'].send_text(json_package)

        elif to == 'others':
            for player in self.connections.values():
                if player[0] is not kwargs['me']:
                    await player[0].send_text(json_package)
    