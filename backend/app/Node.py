class Node:
    def __init__(self, id, occupiedBy=None, isBuildable=True, buildingType=None, paths=None, port_type=None):
        self.id = id
        self.occupiedBy = occupiedBy
        self.isBuildable = isBuildable
        self.buildingType = buildingType
        self.paths = paths or []
        self.port_type = port_type

    def __getstate__(self):
        self.paths = [path.id for path in self.paths]
        return self.__dict__
        
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
    