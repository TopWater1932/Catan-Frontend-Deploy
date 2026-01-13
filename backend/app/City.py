from utils.TerrainType import TerrainType
from Structure import Structure

class City(Structure):
    name = 'City'
    requirements = {
        TerrainType.MOUNTAINS.value: 3,
        TerrainType.FIELDS.value: 2
    }
    point_value = 2