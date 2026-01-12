from Tile import Tile
from Node import Node
from Path import Path

class Board:
    def __init__(self, tiles=[], nodes=[], paths=[]):
        self.tiles = tiles  # List of Tile objects
        self.nodes = nodes  # List of Node objects
        self.paths = paths  # List of Path objects

    def move_robber(self, tile_id):
        # Find the tile with the given ID and move the robber there
        for tile in self.tiles:
            if tile.id == tile_id:
                tile.has_robber = True
            else:
                tile.has_robber = False