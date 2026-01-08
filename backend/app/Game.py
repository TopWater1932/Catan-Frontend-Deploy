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
            
    def _normalize_trade_list(self, items):
        if items is None:
            return []
        out = []
        for it in items:
            if it is None:
                continue
            if isinstance(it, (list, tuple)) and len(it) == 2:
                res, amt = it
                amt = int(amt)
                if amt <= 0:
                    return None
                out.append((res, amt))
            else:
                return None
        return out

    def _player_has_resources(self, player, items):
        for res, amt in items:
            if player.resource_cards.get(res, 0) < amt:
                return False
        return True

    def _transfer_resources(self, from_player, to_player, items):
        for res, amt in items:
            from_player.resource_cards[res] = from_player.resource_cards.get(res, 0) - amt
            to_player.resource_cards[res] = to_player.resource_cards.get(res, 0) + amt

    def domestic_trade(self, player1, player2, offer, request):
        offer_list = self._normalize_trade_list(offer)
        request_list = self._normalize_trade_list(request)

        if offer_list is None or request_list is None:
            return False, "Invalid trade format."
        if player1 is player2:
            return False, "Cannot trade with self."
        if len(offer_list) == 0 and len(request_list) == 0:
            return False, "Empty trade."

        if not self._player_has_resources(player1, offer_list):
            return False, f"{player1.name} lacks resources to offer."
        if not self._player_has_resources(player2, request_list):
            return False, f"{player2.name} lacks resources to give requested items."

        self._transfer_resources(player1, player2, offer_list)
        self._transfer_resources(player2, player1, request_list)
        return True, "Trade executed."
    def player_port_ownership(self, player):
        owned = {}

        if self.board is None or self.board.nodes is None:
            return owned

        for row in self.board.nodes:
            for node in row:
                if node is None:
                    continue

                port = getattr(node, "port_type", None)
                if not port:
                    continue

                if getattr(node, "occupiedBy", None) is player:
                    owned[port] = True

        return owned

    def valid_trade_rates(self, player):
        ports = self.player_port_ownership(player)

        any_rate = 4
        if ports.get("3:1", False):
            any_rate = 3

        rates = {"ANY": any_rate}

        for port_type, owned in ports.items():
            if owned and port_type != "3:1":
                rates[port_type] = 2

        return rates

    def maritime_trade(self, player, give_resource, give_amount, get_resource, get_amount=1):
        give_amount = int(give_amount)
        get_amount = int(get_amount)

        if give_amount <= 0 or get_amount <= 0:
            return False, "Trade amounts must be positive."
        if give_resource == get_resource:
            return False, "Cannot trade a resource for itself."

        rates = self.valid_trade_rates(player)
        required_rate = rates.get(give_resource, rates["ANY"])

        if give_amount != required_rate * get_amount:
            return False, f"Invalid maritime trade ratio. Required {required_rate}:1 for {give_resource}."

        if player.resource_cards.get(give_resource, 0) < give_amount:
            return False, f"{player.name} lacks enough {give_resource}."

        player.resource_cards[give_resource] = player.resource_cards.get(give_resource, 0) - give_amount
        player.resource_cards[get_resource] = player.resource_cards.get(get_resource, 0) + get_amount

        return True, "Maritime trade executed."

    def assign_resources(self, dice_roll):
        print(f"Assigning resources for dice roll: {dice_roll}")
        for player in self.players:
            # Logic to assign resources based on dice_roll and board state
            player.giveResource('wood', 1)  # Example: give 1 wood to the player
        

    # Longest Road
    

    def _node_blocks_player(self, node, player):

        occ = getattr(node, "occupiedBy", None)
        return (occ is not None) and (occ is not player)

    def _player_owned_paths(self, player):
        """Return list of Path objects owned by player"""
        if self.board is None:
            return []
        return [p for p in self.board.paths if getattr(p, "owner", None) is player]

    def _build_road_adjacency(self, player):
        """
        Build adjacency list from the player's owned roads:
          adj[node_id] - list of (neighbor_node, path_id)
        """
        owned_paths = self._player_owned_paths(player)
        adj = {}
        nodes_by_id = {}

        for path in owned_paths:
            a, b = path.connectedNodes
            nodes_by_id[a.id] = a
            nodes_by_id[b.id] = b

            adj.setdefault(a.id, []).append((b, path.id))
            adj.setdefault(b.id, []).append((a, path.id))

        return adj, nodes_by_id

    def longest_road_length(self, player):
        """
        compute longest road length for player, (max number of edges in a valid continuous road, without reuisng any segment
        """
        adj, nodes_by_id = self._build_road_adjacency(player)
        if not adj:
            return 0

        def dfs(current_node_id, used_paths):
            # If we are trying to cont from a blocked node - must stop.
            current_node = nodes_by_id[current_node_id]
            if self._node_blocks_player(current_node, player) and len(used_paths) > 0:
                return 0

            best = 0
            for nbr_node, path_id in adj.get(current_node_id, []):
                if path_id in used_paths:
                    continue

                used_paths.add(path_id)
                candidate = 1 + dfs(nbr_node.id, used_paths)
                used_paths.remove(path_id)

                if candidate > best:
                    best = candidate

            return best

        overall_best = 0
        for start_node_id in adj.keys():
            length = dfs(start_node_id, set())
            if length > overall_best:
                overall_best = length

        return overall_best

    def update_player_longest_road(self, player):
        """recompute and store player.longest_road_length."""
        player.longest_road_length = self.longest_road_length(player)
        return player.longest_road_length

    def update_longest_road_holder(self):
        """
        dfetermine who holds Longest Road and update  add 2 VP accordingly.
        rules:
        -must be >= 5 to claim
        -ties do NOT change holder
        -if a new player strictly exceeds, they take 
        """
        # Compute lengths
        best_len = 0
        best_players = []

        for p in self.players:
            length = self.update_player_longest_road(p)
            if length > best_len:
                best_len = length
                best_players = [p]
            elif length == best_len and length != 0:
                best_players.append(p)
        # Decide new holder
        new_holder = None
        if best_len >= 5 and len(best_players) == 1:
            new_holder = best_players[0]

        old_holder = self.longest_road_holder
        # If tied or nobody qualifies, keep current holder 
        if new_holder is None:
            return old_holder
        # If no change, nothing to do
        if new_holder is old_holder:
            return old_holder
        # Remove award and VP from old holder
        if old_holder is not None:
            old_holder.has_longest_road = False
            old_holder.victory_points -= 2
        # Give awared and Vp to new holder
        new_holder.has_longest_road = True
        new_holder.victory_points += 2
        self.longest_road_holder = new_holder

        return new_holder

    def build_road(self, path, player):
        """
        Use this to build roads, will make sure this always stays updated and works
        """
        ok = path.build(player)
        if ok:
            self.update_longest_road_holder()
        return ok


# game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])

    
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
'''
game = Game(None, players=[Player(0, "Amy", "red"), Player(1, "Ben", "blue")])

tiles, nodes, paths = game.setup()
node = paths[1]

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

# for hex in tiles:
#     print(f"Hex ID: {hex.id} has associated nodes: {[node.id for node in hex.associated_nodes]}")









#  TEST BLOCK FOR TRADING::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
'''
if __name__ == "__main__":
    # create 2 players
    p1 = Player(1, "Thelonius", "Red", resource_cards={"WOOD": 2, "BRICK": 0, "SHEEP": 0, "WHEAT": 0, "ORE": 0})
    p2 = Player(2, "Art", "Blue", resource_cards={"WOOD": 0, "BRICK": 1, "SHEEP": 0, "WHEAT": 0, "ORE": 0})

    # create game with an empty board 
    game = Game(board=Board(), players=[p1, p2])

    print("p1 keys:", list(p1.resource_cards.keys()))
    print("p2 keys:", list(p2.resource_cards.keys()))

    #  test domestic trade: p1 gives 2 wood for 1 brick
    ok, msg = game.domestic_trade(p1, p2, offer=[["WOOD", 2]], request=[["BRICK", 1]])
    print("domestic_trade:", ok, msg)
    print("After trade p1:", p1.resource_cards)
    print("After trade p2:", p2.resource_cards)

    # test maritime trade DEFAULT 4:1 no ports 
    p1.resource_cards["WOOD"] = 4
    ok, msg = game.maritime_trade(p1, give_resource="WOOD", give_amount=4, get_resource="BRICK", get_amount=1)
    print("maritime_trade 4:1:", ok, msg)
    print("After maritime p1:", p1.resource_cards)

    # test port logic: give p1 a WOOD port by placing settlement on a port node
    n = Node(id=999, port_type="WOOD")
    n.occupiedBy = p1  # simulate built settlement/city on port
    game.board.nodes = [[n]]

    print("ports owned by p1:", game.player_port_ownership(p1))
    print("rates for p1:", game.valid_trade_rates(p1))
    # test that it fails when they dont have enough wood
    p1.resource_cards["WOOD"] = 0
    ok, msg = game.maritime_trade(p1, "WOOD", 2, "BRICK", 1)
    print(ok, msg)

    # Now 2:1 should work
    p1.resource_cards["WOOD"] = 2
    ok, msg = game.maritime_trade(p1, "WOOD", 2, "BRICK", 1)
    print("maritime_trade 2:1 (WOOD port):", ok, msg)
    print("After 2:1 maritime p1:", p1.resource_cards)

    #  TEST BLOCK FOR LONGEST ROAD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    print("\n LONGEST ROAD TEST ")

    # Make a new game and setup full board
    p1 = Player("p1", "Miles", "Red")
    p2 = Player("p2", "Duke", "Blue")
    game = Game(board=None, players=[p1, p2])
    game.setup()

  
    def find_path_chain(paths, target_len=5):
        # adjacency: node_id  list of path objects touching it
        adj = {}
        for path in paths:
            a, b = path.connectedNodes
            adj.setdefault(a.id, []).append(path)
            adj.setdefault(b.id, []).append(path)

        # DFS over edges to find a chain of length target_len
        def dfs(current_node, used_path_ids, chain):
            if len(chain) == target_len:
                return chain

            for path in adj.get(current_node.id, []):
                if path.id in used_path_ids:
                    continue
                # move to the other endpoint
                a, b = path.connectedNodes
                nxt = b if a.id == current_node.id else a

                used_path_ids.add(path.id)
                chain.append(path)
                res = dfs(nxt, used_path_ids, chain)
                if res is not None:
                    return res
                chain.pop()
                used_path_ids.remove(path.id)

            return None
        # Try starting from each node endpoint we see
        seen_nodes = {}
        for path in paths:
            a, b = path.connectedNodes
            seen_nodes[a.id] = a
            seen_nodes[b.id] = b

        for node in seen_nodes.values():
            res = dfs(node, set(), [])
            if res is not None:
                return res

        return None

    chain = find_path_chain(game.board.paths, target_len=5)
    if chain is None:
        print("[FAIL] coulnt find a connected chain of 5 paths on board")
    else:
        print("[OK] found chain of 5 path")
        print([p.id for p in chain])

        # build the roads for p1 using the Game wrapper (important! has to be done like this pls or i think stuff breaks)
        start_vp = p1.victory_points
        for path in chain:
            ok = game.build_road(path, p1)
            if not ok:
                print("[FAIL] Could not build path:", path.id)

        print("p1.longest_road_length =", getattr(p1, "longest_road_length", None))
        print("longest_road_holder =", getattr(game.longest_road_holder, "name", None))
        print("p1 victory points:", start_vp, "->", p1.victory_points,)

        # Extra check should be at least 5
        if p1.longest_road_length >= 5 and game.longest_road_holder is p1 and p1.victory_points == start_vp + 2:
            print("[PASS] Longest road award works.")
        else:
            print("[WARN] smthn broken.")

'''