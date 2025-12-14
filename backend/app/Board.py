from Tile import Tile
from Node import Node
from Path import Path

class Board:
    def __init__(self, tiles=[], nodes=[], paths=[]):
        self.tiles = tiles  # List of Tile objects
        self.nodes = nodes  # List of Node objects
        self.paths = paths  # List of Path objects
