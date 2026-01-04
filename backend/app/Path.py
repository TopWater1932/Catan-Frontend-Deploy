class Path:
    def __init__(self, id, connectedNodes, owner=None):
        self.id = id
        self.owner = owner  # Player who owns the path, None if unowned, None represents unbuilt path
        self.connectedNodes = connectedNodes  # Tuple of two nodes that the path connects

    def __getstate__(self):
        pathState = self.__dict__.copy()
        
        pathState['connectedNodes'] = [node.id for node in pathState['connectedNodes']]
        return pathState

    def build(self, player):
        if self.owner is None:
            self.owner = player
            return True
        return False
    
    

        
