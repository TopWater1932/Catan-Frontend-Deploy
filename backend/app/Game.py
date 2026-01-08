from platform import node
from Board import Board
from Tile import Tile
from Node import Node
from Path import Path
from Player import Player
from Tile import TerrainType
from BoardSetUp import BoardSetUp
from Dice import Dice
from colorama import init, Fore, Style

import random

class Game:
    def __init__(self, board, players, current_turn=0, longest_road_holder=None, largest_army_holder=None):
        self.board = None
        self.players = players
        self.total_turns = 0
        self.current_turn = current_turn
        self.longest_road_holder = longest_road_holder
        self.largest_army_holder = largest_army_holder
        self.setup_phase = True

    
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
        return Tiles, Nodes, Paths
    
    def nextTurn(self):
            self.current_turn = (self.current_turn + 1) % len(self.players)
            self.total_turns += 1

    def assign_resources(self, dice_roll):
        print(f"Assigning resources for dice roll: {dice_roll}")
        for player in self.players:
            # Logic to assign resources based on dice_roll and board state
            player.giveResource('wood', 1)  # Example: give 1 wood to the player
        

# game = Game(None, [{'name':'Alice', 'color':'red'}, {'name':'Bob', 'color':'blue'}, {'name':'Rob', 'color':'green'}, {'name':'Sherry', 'color':'white'}])

    
    def buildSettlement(self, nodeID:str, player:Player=None):
        '''
        Function to handle building a settlement at a given node for a player
        '''
        node = self.findNodeByID(nodeID)
    
        if player is None:
            player = self.players[self.current_turn]
        if node is None:
           return False
        if player.buildings['settlements'] <= 0:
            print("Player " + player.name + " has no settlements left to build.")
            return False
        if node.build(player, "SETTLEMENT"):
            player.built_structures.append(node)
            player.buildings['settlements'] -= 1
            return True
        else:
            print("Failed to build settlment on node " + node.id)
            return False
    
    def buildRoad(self, pathID:str, player:Player=None):
        '''
        Function to handle building a road at a given path for a player
        '''
        if player is None:
             player = self.players[self.current_turn]
        path = None
        for p in self.board.paths:
            if p.id == pathID:
                path = p
                break
        if path is None:
            return False
    
        if path.build(player):
            player.roads.append(path)
            return True
        print("Failed to build road on path " + path.id)
        return False
    
    def setupBuildSettlement(self, nodeID:str, player:Player=None):
        '''
        Funtion to build settlements for game setup

        NOTE
        only to be called during setup phase of game
        '''
        node = self.findNodeByID(nodeID)
        if player is None:
             player = self.players[self.current_turn]
        if node is None:
            print("Node not found during setup phase")
            return False
        elif not self.setup_phase:
            print("Not in setup phase, cannot build settlement using setupBuildSettlement")
            return False
        
        if self.buildSettlement(nodeID, player):
            for tile in self.board.tiles:   
                if tile.resource != TerrainType.DESERT.value and node in tile.associated_nodes:
                    print(f"Giving 1 {tile.resource} to player {player.name} for settlement at node {nodeID} during setup phase")
                    player.giveResource(tile.resource, 1)
            return True
        else:
            print("Failed to build settlement during setup phase")
            return False

    def findNodeByID(self, nodeID:str):
        for row in self.board.nodes:
            for node in row:
                if node is not None and node.id == nodeID:
                    return node
        print("Node with ID " + nodeID + " not found.")
        return None
    def nextSetupTurn(self):
        '''
        Function to handle the next turn during the setup phase of the game

        RETURNS
        - bool: True if there are more setup turns remaining, False if setup phase is complete
        '''
        self.total_turns += 1

        if self.total_turns == len(self.players) * 2:
            self.setup_phase = False
            self.current_turn = 0
            self.total_turns = 0
            return False
        elif self.total_turns < len(self.players):
            self.current_turn = self.total_turns
        else:
            self.current_turn = len(self.players) * 2 - 1 - self.total_turns
        
        return True


#game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])
game = Game(None, players=[Player(0, "Amy", "red"), Player(1, "Ben", "blue")])

tiles, nodes, paths = game.setup()
node = paths[1]

'''
game.setupBuildSettlement("N33", game.players[1])
print(game.players[1].resource_cards)
print(f"Node is occupied by {game.board.nodes[3][3].occupiedBy.name} and now isBuildeable = {game.board.nodes[3][3].isBuildable}")
print(f"Surrounding nodes {game.board.nodes[4][3].isBuildable}")
'''

'''

for i in range(4):
    print(f"current player turn: {game.players[game.current_turn].name}")
    node = input("Enter nodeID: ")
    game.setupBuildSettlement(node)
    for player in game.players:
        print(f"Player {player.name} Resources: {player.resource_cards}")
    game.nextSetupTurn()
    for node_row in nodes:
        print("------------------------------------------------------------------")
        for node in node_row:
            if node is None:
                print("Buf", end=" | ")
            elif node.occupiedBy is not None:
                print(Fore.RED + f"{node.id}({node.occupiedBy.name[0]})" + Style.RESET_ALL, end = " | ")
            else:
                print(f"{node.id}", end = " | ")

        print("")
    print("------------------------------------------------------------------")

    print(f"Current turn: {game.current_turn}, Total turns: {game.total_turns}, Setup phase: {game.setup_phase}")
'''
'''
for prop_name, prop_value in vars(node).items():
    print(f"{prop_name}: {type(prop_value)}")

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
print(f"{paths[0].connectedNodes}")

for hex in tiles:
    print(f"Hex ID: {hex.id} has associated nodes: {[node.id for node in hex.associated_nodes]}")


'''

