from Structure import Structure
from Structure import isUpgradable
from utils.TerrainType import TerrainType
from City import City

class Settlement(Structure, isUpgradable):
    name = 'Settlement'
    requirements = {
        TerrainType.HILLS.value: 1,
        TerrainType.FOREST.value: 1,
        TerrainType.FIELDS.value: 1,
        TerrainType.PASTURE.value: 1
    }
    point_value = 1

    def upgrade(self, building_type):
        if building_type == "City":
            return City()
        else:
            print(f"[ERROR] Cannot upgrade Settlement to {building_type}.")
            return None
        
        
