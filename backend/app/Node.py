class Node:
    def __init__(self, id, row, occupiedBy=None, isBuildable=True, buildingType=None, neighborNodes=[]):
        self.id = id
        self.row = row
        self.neighbors = neighborNodes

    def build(self, player, buildingType):
        if self.isBuildable is True:
            self.occupiedBy = player
            self.buildingType = buildingType
            self.isBuildable = False
            return True
        return False
    
    
    


