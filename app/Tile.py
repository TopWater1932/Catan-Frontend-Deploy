from enum import Enum

class Tile:
    def __init__(self, x, y, terrain_type, resource, number_token, has_robber=False, associated_nodes=[]):
        self.x = x
        self.y = y
        self.terrain_type = terrain_type
        self.resource = resource
        self.number_token = number_token


    def findAssociatedNodes(self, all_nodes):
        pass
        "TODO: implement this function"

    def setAssociatedNodes(self, associated_nodes):
        self.associated_nodes = associated_nodes
        "TODO: implement this function"

    def giveResoucetoPlayers(self):
        pass


class TerrainType(Enum):
    HILLS = "Hills"
    FOREST = "Forest"
    MOUNTAINS = "Mountains"
    FIELDS = "Fields"
    PASTURE = "Pasture"
    DESERT = "Desert"
    