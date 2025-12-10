class Node:
    def __init__(self, id, occupiedBy=None, isBuildable=True, buildingType=None, leftPath=None, rightPath=None, verticalPath=None):
        self.id = id

    def build(self, player, buildingType):
        if self.isBuildable is True:
            self.occupiedBy = player
            self.buildingType = buildingType
            self.isBuildable = False
            return True
        return False