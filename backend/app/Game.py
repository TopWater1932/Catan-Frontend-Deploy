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
        # Add tiles, nodes, paths as needed
        available_tiles = {
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

    def setupTiles(self, available_tiles, available_numbers):
        total_tiles = sum(available_tiles.values())
        tileList = []
        if(total_tiles != len(available_numbers) + 1):
            raise ValueError("Number of tiles does not match number of available numbers + 1 for desert, please add " + total_tiles - (len(available_numbers) + 1) + " more tiles")

        for count in range(total_tiles):
            
            terrain = random.choice(list(available_tiles.keys()))

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