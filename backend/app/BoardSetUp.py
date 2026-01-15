import random
from Tile import Tile
from Node import Node
from Path import Path

class BoardSetUp:
    '''
    Class containing helper functions to setup the game board
    '''
    @staticmethod
    def setupTiles(available_tiles, available_numbers, resource_dictionary):
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
                robber = True
            else:
                num = random.choice(available_numbers)
                available_numbers.remove(num)
                robber = False
            resource = resource_dictionary.get(terrain)
            tile = Tile(id=f'T{i}', x=0, y=0, terrain_type=terrain, resource=resource, number_token=num, has_robber=robber) #currently does not record x, y coordinates
            tileList.append(tile)
            available_tiles[terrain] -= 1
            if(available_tiles[terrain] == 0):
                del available_tiles[terrain]
    
        return tileList
    
    @staticmethod
    def setupNodes(board_hex_height: int, board_hex_width : int, initial_offset: int):
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
                node_row = BoardSetUp.setup_node_row(board_node_width, offset, row_num)
                node_matrix.append(node_row)
                if i == 0 and y != int(board_node_height/2) - 1: 
                    offset -= 1
                elif i == 1 and y != int(board_node_height/2) - 1:
                    offset += 1
                else:
                    pass
                row_num += 1

        return node_matrix
    
    @staticmethod
    def setup_node_row(row_length, initial_offset, row_number=0):
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

    @staticmethod
    def setup_paths(node_matrix:list):
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
                    path = BoardSetUp.save_and_create_path(previous_node, current_node)
                    path_list.append(path)

                #connect the nodes to it's vertical associate in the row below
                if ((x + offset) % 2 == 0) and y != len(node_matrix) - 1:
                    #check if the node below is a buffer
                    if (node_matrix[y+1][x]) is None:
                        continue

                    node1 = current_node
                    node2 = node_matrix[y+1][x]

                    path = BoardSetUp.save_and_create_path(node1, node2)
                    path_list.append(path)

                previous_node = current_node
        return path_list

    @staticmethod
    def save_and_create_path(node1, node2) -> Path:
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

    @staticmethod
    def findAllHexNodes(all_nodes, all_hexes):
        '''
        Helper function to find and assign all associated nodes to each hex tile
        
        PARAMETERS
        - all_nodes: 3D list representing the board's nodes with buffers as None
        - all_hexes: list of all hex tile objects
        '''
        
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
