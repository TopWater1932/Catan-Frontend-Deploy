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
        return Tiles, Nodes, Paths
    
    def nextTurn(self):
            self.current_turn = (self.current_turn + 1) % len(self.players)
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

# game = Game(None, [{'name':'Alice', 'colour':'red'}, {'name':'Bob', 'colour':'blue'}, {'name':'Rob', 'colour':'green'}, {'name':'Sherry', 'colour':'white'}])


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









#  TEST BLOCK FOR TRADING::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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
