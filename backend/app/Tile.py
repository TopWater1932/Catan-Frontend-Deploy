from Node import Node
from utils.TerrainType import TerrainType
class Tile:
    def __init__(self, id, x, y, terrain_type, resource, number_token, has_robber=False, associated_nodes=[]):
        self.id = id
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.resource = resource
        self.has_robber = has_robber
        self.number_token = number_token
        self.associated_nodes = []

    def __getstate__(self):
        tileState = self.__dict__.copy()

        tileState['associated_nodes'] = [node.id for node in tileState['associated_nodes']]
        return tileState

    def giveResourcetoPlayers(self):
        for node in self.associated_nodes:
            if node.occupiedBy != None:
                if node.building == "SETTLEMENT":
                    amount = 1
                elif node.building == "CITY":
                    amount = 2
                player = node.occupiedBy
                success = player.giveResource(self.resource, amount)
                if not success:
                    print(f"[ERROR] Failed to give resource {self.resource} to player {player.name}")
        

    def findAssociatedPlayers(self,player_turn_id):
        playerIDs = set()
        for node in self.associated_nodes:
            if node.occupiedBy is not None:
                playerIDs.add(node.occupiedBy)
        
        playerIDs = set(id for id in playerIDs if id != player_turn_id)

        return list(playerIDs)

