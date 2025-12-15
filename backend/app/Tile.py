from enum import Enum

class Tile:
    def __init__(self, id, x, y, terrain_type, resource, number_token, has_robber=False, associated_nodes=[]):
        self.id = id
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.resource = resource
        self.number_token = number_token
        self.associated_nodes = []

    def giveResoucetoPlayers(self):
        for node in self.associated_nodes:
            if node.occupiedBy != None:
                if node.buildingType == "SETTLEMENT":
                    amount = 1
                elif node.buildingType == "CITY":
                    amount = 2
                player = node.occupiedBy
                player.giveResource(self.resource, amount)



class TerrainType(Enum):
    HILLS = "BRICK"
    FOREST = "LUMBER"
    MOUNTAINS = "ORE"
    FIELDS = "GRAIN"
    PASTURE = "WOOL"
    DESERT = None
    