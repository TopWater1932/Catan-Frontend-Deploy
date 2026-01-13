from Settlement import Settlement
from City import City
from utils.Buildings import Buildings

class Node:
    def __init__(self, id, occupiedBy=None, isBuildable=True, building=None, paths=None, port_type=None):
        self.id = id
        self.occupiedBy = occupiedBy
        self.isBuildable = isBuildable
        self.building = building
        self.paths = paths or []
        self.port_type = port_type

    def __getstate__(self):
        nodeState = self.__dict__.copy()

        nodeState['paths'] = [path.id for path in  nodeState['paths']]
        return nodeState
        
    def updateNeighbors(self):
        for path in self.paths:
            for node in path.connectedNodes:
                if node != self:
                    node.isBuildable = False

    def build(self, player, building):
        if self.occupiedBy is None and self.isBuildable:
            self.occupiedBy = player
            self.isBuildable = False
            self.building = building
            self.updateNeighbors()
            return True
        return False
    def upgrade(self, player, upgradeBuildingType):
        if self.occupiedBy == player:
                upgradedBuilding = self.building.upgrade(upgradeBuildingType)
                if upgradedBuilding:
                    player.victory_points += upgradedBuilding.point_value - self.building.point_value
                    self.building = upgradedBuilding
                    return True
                
    def upgradeToCity(self,player):
        if self.occupiedBy == player:
            self.building = Buildings.CITIES.value
            player.victory_points += 1
            return True
        return False
    
    def getPathIDs(self):
        pathIDs = []
        for path in self.paths:
            pathIDs.append(path.id)
        return pathIDs