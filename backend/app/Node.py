class Node:
    def __init__(self, id, occupiedBy=None, isBuildable=True, buildingType=None, paths=[]):
        # self.next = None
        self.id = id
        self.paths = []

    def __getstate__(self):
        nodeState = self.__dict__.copy()

        nodeState['paths'] = [path.id for path in  nodeState['paths']]
        return nodeState
        
    def updateNeighbors(self):
        for path in self.paths:
            for node in path.connectedNodes:
                if node != self:
                    node.isBuildable = False

    def build(self, player, buildingType):
        if self.occupiedBy is None and self.isBuildable:
            self.occupiedBy = player
            self.buildingType = buildingType
            self.updateNeighbors()
            return True
        return False
    