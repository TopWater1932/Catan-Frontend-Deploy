class Path:
    def __init__(self, id, connectedNodes, owner=None):
<<<<<<< HEAD:app/Path.py
=======
        self.id = id
>>>>>>> origin/main:backend/app/Path.py
        self.connectedNodes = connectedNodes  # List of two nodes that the path connects
        self.owner = owner  # Player who owns the path, None if unowned, None represents unbuilt path
        self.id = id

    def build(self, player):
        if self.owner is None:
            self.owner = player
            return True
<<<<<<< HEAD:app/Path.py
        return False
    
    

        
=======
        return False
>>>>>>> origin/main:backend/app/Path.py
