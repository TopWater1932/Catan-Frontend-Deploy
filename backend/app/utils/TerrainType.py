from enum import Enum

class TerrainType(Enum):
    HILLS = "brick"
    FOREST = "wood"
    MOUNTAINS = "ore"
    FIELDS = "wheat"
    PASTURE = "sheep"
    DESERT = None