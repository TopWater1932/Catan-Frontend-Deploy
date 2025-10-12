from Board import Board
from Tile import Tile
from Node import Node
from Path import Path
from Player import Player

import random

class Game:
    def __init__(self, board, players, current_turn=0, longest_road_holder=None, largest_army_holder=None):
        self.board = board
        self.players = players
        self.current_turn = current_turn
        self.longest_road_holder = longest_road_holder
        self.largest_army_holder = largest_army_holder

    
    def setup(self):
        '''Set up the initial game state, including board configuration and player order.'''
    
        board = Board()
        # Add tiles
        available_tiles = {
            "Forest": 4,
            "Hills": 3,
            "Mountains": 3,
            "Fields": 4,
            "Pasture": 4,
            "Desert": 1 
        }
        available_numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

        Tiles = self.setupTiles(available_tiles, available_numbers)

        #Add Nodes
        

        #create dictorionaries that store stup information about the tiles, nodes, and paths

    def setupTiles(self, available_tiles, available_numbers):
        '''
        Helper function to setup tiles with random values and numbers based on the function input 
        '''
        total_tiles = sum(available_tiles.values())
        tileList = []
        if(total_tiles != len(available_numbers) + 1):
            raise ValueError("Number of tiles does not match number of available numbers + 1 for desert, please add " + total_tiles - (len(available_numbers) + 1) + " more tiles")

        for count in range(total_tiles):
            terrain = random.choice(list(available_tiles.keys()))

            if(terrain == "Desert"):
                num = None
            else:
                num = random.choice(available_numbers)
                available_numbers.remove(num)

            tile = Tile(0, 0, terrain, None, num)
            tileList.append(tile)
            available_tiles[terrain] -= 1
            if(available_tiles[terrain] == 0):
                del available_tiles[terrain]
    
        return tileList
    def setupNodes(self, board_hex_height: int, board_hex_width : int, initial_offset: int):
        node_matrix = []
        board_node_height = board_hex_height + 1
        board_node_width = board_hex_width * 2 + 1
        offset = initial_offset
        if(board_node_height % 2 != 0):
            raise ValueError("Board node height should be an even number")

        for i in range(2):
            for y in range(int(board_node_height/2)):
                node_row = []
                node_row = self.setup_node_row(board_node_width, offset)
                node_matrix.append(node_row)
                if i == 0 and y != int(board_node_height/2) - 1: 
                    offset -= 1
                elif i == 1 and y != int(board_node_height/2) - 1:
                    offset += 1

                else:
                    pass
                

        return node_matrix

    def setup_node_row(self, row_length, initial_offset):
        '''
        Helper Function to format node row with appropriate buffers

        RETURNS
        list representing the row of nodes
        '''

        #first half
        offset = initial_offset
        node_row = []
        for x in range(1, row_length):
            print(f"X-OFFSET: {offset}")
            if x < row_length//2:
                #fill spot with buffer
                if(offset > 0):
                    node_row.append(None)
                else: 
                    node_row.append(Node())
                offset -= 1
            #center
            elif x == row_length//2 + 1:
                node_row.append(Node())
                offset += 1
            #second half
            elif x > row_length//2 + 1:
                if 0 < offset <= initial_offset:
                    node_row.append(None)
                else:
                    node_row.append(Node())
                offset += 1
        return node_row

    def nextTurn(self):
        self.current_turn = (self.current_turn + 1) % len(self.players)

game = Game(None, [Player("Alice", "red")])
available_tiles = {
            "Forest": 4,
            "Hills": 3,
            "Mountains": 3,
            "Fields": 4,
            "Pasture": 4,
            "Desert": 1 
        }
available_numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

tiles = game.setupTiles(available_tiles=available_tiles, available_numbers=available_numbers)

for tile in tiles:
    print(tile.terrain_type, tile.number_token)

node_matrix = game.setupNodes(5, 5, 2)