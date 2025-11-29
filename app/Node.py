class Node:
    def __init__(self, id, occupiedBy=None, isBuildable=False, buildingType=None, paths=[]):
        self.next = None
        self.id = id
        self.paths = []
        