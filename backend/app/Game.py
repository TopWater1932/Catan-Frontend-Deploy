from Board import Board
from Tile import Tile
from Node import Node
from Path import Path
from Player import Player
from Tile import TerrainType
from BoardSetUp import BoardSetUp

import random

class Game:
    def __init__(self, board, players, current_turn=0, longest_road_holder=None, largest_army_holder=None):
        self.board = board
        self.players = players
        self.current_turn = current_turn
        self.longest_road_holder = longest_road_holder
        self.largest_army_holder = largest_army_holder
    
    
    def setup(self):
        '''
        Set up the initial game state, including board configuration and player order.
        
        RETURNS
        - board: Board object containing tiles, nodes and paths 
        - tiles: list of Tile objects 
        - nodes: 3D list of node objects 
        - paths: list of Path objects 
        '''
        # Add tiles
        available_tiles = {
            TerrainType.FOREST.name: 4,
            TerrainType.HILLS.name: 3,
            TerrainType.MOUNTAINS.name: 3,
            TerrainType.FIELDS.name: 4,
            TerrainType.PASTURE.name: 4,
            TerrainType.DESERT.name: 1 
        }
        available_numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
        resource_dictionary = {
            TerrainType.FOREST.name: TerrainType.FOREST.value,
            TerrainType.HILLS.name: TerrainType.HILLS.value,
            TerrainType.MOUNTAINS.name: TerrainType.MOUNTAINS.value,
            TerrainType.FIELDS.name: TerrainType.FIELDS.value,
            TerrainType.PASTURE.name: TerrainType.PASTURE.value,
            TerrainType.DESERT.name: TerrainType.DESERT.value
        }

        Tiles = BoardSetUp.setupTiles(available_tiles=available_tiles, available_numbers=available_numbers, resource_dictionary=resource_dictionary)
        Nodes = BoardSetUp.setupNodes(board_hex_height=5, board_hex_width=5, initial_offset=2)
        Paths = BoardSetUp.setup_paths(Nodes)

        BoardSetUp.findAllHexNodes(Nodes, Tiles)

        updated_board = Board(tiles=Tiles, nodes=Nodes, paths=Paths)

        self.board = updated_board
    
    def nextTurn(self):
            self.current_turn = (self.current_turn + 1) % len(self.players)

    def assign_resources(self, dice_roll):
        print(f"Assigning resources for dice roll: {dice_roll}")
        for player in self.players:
            # Logic to assign resources based on dice_roll and board state
            player.giveResource('wood', 1)  # Example: give 1 wood to the player
        

# game = Game(None, [{'name':'Alice', 'color':'red'}, {'name':'Bob', 'color':'blue'}, {'name':'Rob', 'color':'green'}, {'name':'Sherry', 'color':'white'}])


# tiles, nodes, paths = game.setup()
# node = paths[1]

# for prop_name, prop_value in vars(node).items():
#     print(f"{prop_name}: {type(prop_value)}")

# for tile in tiles:
#     print(f"ID: {tile.id}, RESOURCE {tile.resource}, Tile Type: {tile.terrain_type}, NUMBER: {tile.number_token}")
# for node_row in nodes:
#     print("------------------------------------------------------------------")
#     for node in node_row:
#         if node is None:
#             print("Buf", end=" | ")
#         else:
#             print(f"{node.id}", end = " | ")

#     print("")
# print("------------------------------------------------------------------")
# print(f"{paths[0].connectedNodes}")

# for hex in tiles:
#     print(f"Hex ID: {hex.id} has associated nodes: {[node.id for node in hex.associated_nodes]}")