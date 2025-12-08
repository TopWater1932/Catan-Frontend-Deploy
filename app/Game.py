from Board import Board
from Tile import Tile
from Node import Node
from Path import Path
from Player import Player
from Tile import TerrainType

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

        Tiles = self.setupTiles(available_tiles, available_numbers, resource_dictionary=resource_dictionary)
        #Add Nodes
        return Tiles
        

        #create dictorionaries that store stup information about the tiles, nodes, and paths

    def setupTiles(self, available_tiles, available_numbers, resource_dictionary):
        '''
        Helper function to setup tiles with random values and numbers based on the function input 
        '''
        total_tiles = sum(available_tiles.values())
        tileList = []
        if(total_tiles != len(available_numbers) + 1):
            raise ValueError("Number of tiles does not match number of available numbers + 1 for desert, please add " + total_tiles - (len(available_numbers) + 1) + " more tiles")

        for i in range(total_tiles):
            terrain = random.choice(list(available_tiles.keys()))

            if(terrain == "DESERT"):
                num = None
            else:
                num = random.choice(available_numbers)
                available_numbers.remove(num)
            resource = resource_dictionary.get(terrain)
            tile = Tile(id=str(i), x=0, y=0, terrain_type=terrain, resource=resource, number_token=num) #currently does not record x, y coordinates
            tileList.append(tile)
            available_tiles[terrain] -= 1
            if(available_tiles[terrain] == 0):
                del available_tiles[terrain]
    
        return tileList
    
    def setupNodes(self, board_hex_height: int, board_hex_width : int, initial_offset: int):
        '''
        Helper function to setup nodes in a matric format based on the board dimensions
        
        PARAMETERS
        - board_hex_height(int): total height of board in hexes
        - board_hex_width(int): total width of board in hexes
        - initial_offset(int): initial node offset to center the board and create buffer nodes 

        RETURNS
        node_matrix: 3D list representing the board's nodes with buffers as None
     '''
        node_matrix = []
        board_node_height = board_hex_height + 1
        board_node_width = board_hex_width * 2 + 1
        offset = initial_offset
        #TODO create function to validate board dimensinos and calculate initial offset
        row_num = 0
        if(board_node_height % 2 != 0):
            raise ValueError("Board node height should be an even number")

        for i in range(2): #split loop into 2 halves
            for y in range(int(board_node_height/2)):
                node_row = []
                node_row = self.setup_node_row(board_node_width, offset, row_num)
                node_matrix.append(node_row)
                if i == 0 and y != int(board_node_height/2) - 1: 
                    offset -= 1
                elif i == 1 and y != int(board_node_height/2) - 1:
                    offset += 1
                else:
                    pass
                row_num += 1

        return node_matrix

    def setup_node_row(self, row_length, initial_offset, row_number=0):
        '''
        Helper Function to format node row with appropriate buffers
        PARAMETERS
        - row_length: 
        RETURNS
        list representing the row of nodes
        '''
        offset = initial_offset
        node_row = []
        for x in range(row_length):
            id = f"N{row_number}{x}"
            #first half
            if x < row_length//2:
                #fill spot with buffer
                if(offset > 0):
                    node_row.append(None)
                else: 
                    node_row.append(Node(str(id))) 
                offset -= 1
            #center
            elif x == row_length//2 :
                node_row.append(Node(str(id))) 
                offset += 1
            #second half
            elif x > row_length//2:
                if 0 < offset <= initial_offset:
                    node_row.append(None)
                else:
                    node_row.append(Node(str(id)))
                offset += 1
        return node_row

    def setup_paths(self, node_matrix:list):
        '''
        Helper function to setup paths between nodes in the node matrix
        PARAMETERS
        - node_matrix: 2D list representing the board's nodes with buffers as None
        RETURNS
        list of all paths created
        '''
        path_list = []
       
        for y in range(len(node_matrix)):
            previous_node = None
            offset = 0
            if y >= len(node_matrix)//2:
                offset = 1
                
            for x in range(len(node_matrix[0])):
                #pass buffer nodes
                current_node = node_matrix[y][x]
                if current_node == None:
                    offset += 1
                    previous_node = None
                    continue
                
                #connect current node the node before in the row
                if previous_node != None:
                    path = self.save_and_create_path(previous_node, current_node)
                    path_list.append(path)

                #connect the nodes to it's vertical associate in the row below
                if ((x + offset) % 2 == 0) and y != len(node_matrix) - 1:
                    #check if the node below is a buffer
                    if (node_matrix[y+1][x]) is None:
                        continue

                    node1 = current_node
                    node2 = node_matrix[y+1][x]

                    path = self.save_and_create_path(node1, node2)
                    path_list.append(path)

                previous_node = current_node
        return path_list

    def save_and_create_path(self, node1, node2) -> Path:
        '''
        Helper function to create path object containing two nodes and then save the path to each node's path list

        PARAMETERS
        - node1: first node object
        - nodde2: seccond node object

        RETURNS
        newly created path object 
        '''
        id = f"P{node1.id}{node2.id}"
        path = Path(id=id, connectedNodes=(node1, node2))
        node1.paths.append(path)
        node2.paths.append(path)

        return path
        

    def findAssociatedNodes(self, all_nodes):
        pass
        "TODO: implement this function"

    def findAllHexNodes(self, all_nodes, all_hexes):
        "TODO: find ratio of nodes to hexes"
        current_hex = 0
        for y, row in enumerate(all_nodes):
            x = 0
            while x < len(all_nodes[0]):
                current_node = all_nodes[y][x]
                if current_node is None:
                    x += 1
                    continue 
                #check if associated nodes go out of bounds
                elif y + 1 >= len(all_nodes) or x + 2 >= len(all_nodes[0]):
                    x += 1
                    continue
                else:
                    associated_nodes = []
                    for i in range(2):
                        for j in range(3):
                            node_to_add = all_nodes[y+i][x+j]
                            associated_nodes.append(node_to_add)
                    if not None in associated_nodes:
                        all_hexes[current_hex].associated_nodes = associated_nodes
                        current_hex += 1
                        x += 2
                    else:
                        x += 1
        return all_hexes

    
    def nextTurn(self):
            self.current_turn = (self.current_turn + 1) % len(self.players)

game = Game(None, [Player("Alice", "red")])

tiles = game.setup()
nodes = game.setupNodes(5, 5, 2)
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
paths = game.setup_paths(nodes)
print(f"Total Paths: {len(paths)}")

hexes = game.findAllHexNodes(nodes, tiles)

for hex in hexes:
    print(f"Hex ID: {hex.id} has associated nodes: {[node.id for node in hex.associated_nodes]}")


