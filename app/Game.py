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

        # Board presets
        available_tiles = {
            "wood": 4,
            "brick": 3,
            "ore": 3,
            "wheat": 4,
            "sheep": 4,
            "desert": 1 
        }
        available_numbers = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]
        nodeRows = [7,9,11,11,9,7] # Index corresponds to row number, 0-indexed. Each integer is the number of nodes in each row.
        rowNumberOffsets = [8,10,11,11,10,8] # Difference in node IDs between connected nodes in adjacent rows.

        # Setup board
        tiles = self.setupTiles(available_tiles=available_tiles, available_numbers=available_numbers)
        nodes, paths = self.setupNodesPaths(nodeRows=nodeRows, rowNumberOffsets=rowNumberOffsets).values()
        # board = Board(tiles=tiles, nodes=nodes, paths=paths)

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
            'tiles':tiles,
            'nodes':nodes,
            'paths':paths,
            'players':playerList,
            'turn': playerList[self.current_turn].id
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
    
    def setupNodesPaths(self,nodeRows,rowNumberOffsets): # Assumes symmetrical hexagonal board with odd number of rows that increases and decreases in width 1 tile at a time.
        
        nodeDict = {}
        nodeList = []
        pathList = []
        nodeCounter = 1

        for n,row in enumerate(nodeRows[:len(nodeRows)//2]):  # Top half of board only
            for i in range(row):
                if i == row-1:                                                                                              # Last node in row
                    neighbors = [nodeCounter+rowNumberOffsets[n]]
                elif (i+1) % 2 != 0:                                                                                        # Odd number nodes in each row
                    neighbors = [nodeCounter+1, nodeCounter+rowNumberOffsets[n]]
                elif (i+1) % 2 == 0:                                                                                        # Even number nodes in each row
                    neighbors = [nodeCounter+1]
                
                node = Node(id=nodeCounter, row=n, neighborNodes=neighbors)
                nodeDict[f'ID{nodeCounter}'] = node

                for neighborNum in node.neighbors:
                    path = Path(id=f'{node.id}_{neighborNum}', connectedNodes=[node.id, neighborNum])
                    pathList.append(path)

                nodeCounter += 1
                

        rowsInTopHalf = len(nodeRows)//2
        for n,row in enumerate(nodeRows[len(nodeRows)//2:]):  # Bottom half of board only
            for i in range(row):
                rowIndex = n + rowsInTopHalf
                if i == row-1:                                                                                              # Last node in row
                    neighbors = [nodeCounter-rowNumberOffsets[rowIndex]]
                elif (i+1) % 2 != 0:                                                                                        # Odd number nodes in each row
                    neighbors = [nodeCounter+1, nodeCounter-rowNumberOffsets[rowIndex]]
                elif (i+1) % 2 == 0:                                                                                        # Even number nodes in each row
                    neighbors = [nodeCounter+1]
                
                node = Node(id=nodeCounter, row=rowIndex, neighborNodes=neighbors)
                nodeDict[f'ID{nodeCounter}'] = node

                for neighborNum in node.neighbors:
                    if node.row == 3 and neighborNum < nodeCounter:  # Avoid duplicating vertical paths between the two board halves
                        continue
                    else:
                        path = Path(id=f'{node.id}_{neighborNum}', connectedNodes=[node.id, neighborNum])
                    pathList.append(path)

                nodeCounter += 1

        for node in nodeDict.values():                                                                                               # Clean up neighbor references that are out of bounds
            for nb in node.neighbors:
                nodeKey = f'ID{nb}'
                neighborNode = nodeDict.get(nodeKey)

                if node.id not in neighborNode.neighbors:
                    neighborNode.neighbors.append(node.id)

            nodeList.append(node)

        return {'nodes':nodeList, 'paths':pathList}

    def nextTurn(self,playerList):
        self.current_turn = (self.current_turn + 1) % len(playerList)


# ############# Print for checking initialised board setup #############

# for node in nodes:
#     print("Node ID:", node.id, "Row:", node.row, "Neighbors:", node.neighbors)
# print("Total Nodes:", len(nodes))

# for path in paths:
#     print("Path ID:", path.id, "connectedNodes:", path.connectedNodes)
# print("Total Paths:", len(paths))


# for tile in tiles:
#     print(tile.terrain_type, tile.number_token)

game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])
initialisePackage = game.setup()