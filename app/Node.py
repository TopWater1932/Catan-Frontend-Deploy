class Node:
    def __init__(self, occupiedBy=None, isBuildable=False, buildingType=None, leftPath=None, rightPath=None, verticalPath=None):
        self.next = None
        