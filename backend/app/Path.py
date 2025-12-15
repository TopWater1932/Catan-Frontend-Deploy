class Path:
    def __init__(self, id, connectedNodes, owner=None):
        self.connectedNodes = connectedNodes  # Tuple of two nodes that the path connects
        self.owner = owner  # Player who owns the path, None if unowned, None represents unbuilt path
        self.id = id

    def build(self, player):
        if self.owner is None:
            self.owner = player
            return True
        return False
    
    

        
