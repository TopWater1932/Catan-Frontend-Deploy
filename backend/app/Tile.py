from enum import Enum

class Tile:
    def __init__(self,id, x, y, terrain_type, resource, number_token, has_robber=False, associated_nodes=[]):
        self.id = id
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.resource = resource
        self.number_token = number_token

        if self.terrain_type == TerrainType.DESERT.value:
            self.has_robber = True


    def findAssociatedNodes(self, all_nodes):
        pass
        "TODO: implement this function"

    def setAssociatedNodes(self, associated_nodes):
        self.associated_nodes = associated_nodes
        "TODO: implement this function"

    def giveResoucetoPlayers(self):
        pass


class TerrainType(Enum):
    BRICK = "brick"
    WOOD = "wood"
    ORE = "ore"
    WHEAT = "wheat"
    SHEEP = "sheep"
    DESERT = "desert"
    