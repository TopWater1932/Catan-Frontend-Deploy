from enum import Enum

class TerrainType(Enum):
    HILLS = "BRICK"
    FOREST = "LUMBER"
    MOUNTAINS = "ORE"
    FIELDS = "GRAIN"
    PASTURE = "WOOL"
    DESERT = None