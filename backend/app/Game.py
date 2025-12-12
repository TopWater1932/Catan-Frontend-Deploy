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
        '''Set up the initial game state, including board configuration and player order.'''

        board = Board()
        # Add tiles
        available_tiles = {
<<<<<<< HEAD:app/Game.py
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
=======
            "wood": 4,
            "brick": 3,
            "ore": 3,
            "wheat": 4,
            "sheep": 4,
            "desert": 1 
        }
        available_numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
        

        # Setup players
        playerList = []
        for i, userInput in enumerate(self.players):

            player = Player(
                f'p{i+1}',
                userInput.get('name'),
                userInput.get('colour'),
                {"wood":0,"brick":0,"wheat":0,"sheep":0,"ore":0},
                {"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
                {"roads":15,"settlements":5,"cities":4},
                0
            )
            playerList.append(player)
        
        return {
            'initialPlayers':playerList,
            'turnID': playerList[self.current_turn].id
        }
>>>>>>> origin/main:backend/app/Game.py

        BoardSetUp.findAllHexNodes(Nodes, Tiles)

        #Add Nodes
        return Tiles, Nodes, Paths

<<<<<<< HEAD:app/Game.py
        #create dictorionaries that store setup information about the tiles, nodes, and paths

    
    
    def nextTurn(self):
            self.current_turn = (self.current_turn + 1) % len(self.players)
=======
            if(terrain == "desert"):
                num = None
            else:
                num = random.choice(available_numbers)
                available_numbers.remove(num)

            tile = Tile(f'Tile-{count}',0, 0, terrain, None, num)
            tileList.append(tile)
            available_tiles[terrain] -= 1
            if(available_tiles[terrain] == 0):
                del available_tiles[terrain]
    
        return tileList

    def nextTurn(self,playerList):
        self.current_turn = (self.current_turn + 1) % len(playerList)


# ############# Print for checking initialised board setup #############
>>>>>>> origin/main:backend/app/Game.py

game = Game(None, [Player("Alice", "red")])

tiles, nodes, paths = game.setup()
for tile in tiles:
    print(f"ID: {tile.id}, RESOURCE {tile.resource}, Tile Type: {tile.terrain_type}, NUMBER: {tile.number_token}")
for node_row in nodes:
    print("------------------------------------------------------------------")
    for node in node_row:
        if node is None:
            print("Buf", end=" | ")
        else:
            print(f"{node.id}", end = " | ")

    print("")
print("------------------------------------------------------------------")
print(f"Total Paths: {len(paths)}")

for hex in tiles:
    print(f"Hex ID: {hex.id} has associated nodes: {[node.id for node in hex.associated_nodes]}")


