from enum import Enum
from utils.TerrainType import TerrainType

class Player:
    def __init__(self, id, name='', color='',
        resource_cards=None,
        development_cards={"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
        buildings={"roads":15,"settlements":5,"cities":4},
        victory_points=0,
        roads = [],
        built_structures = [],
        ports = ['4-1'], # Default 4:1 port
        connected = True
        ):

        self.id = id
        self.name = name
        self.color = color
        self.resource_cards = {TerrainType.FOREST.value:0,TerrainType.HILLS.value:0,TerrainType.MOUNTAINS.value:0,TerrainType.FIELDS.value:0,TerrainType.PASTURE.value:0}
        self.development_cards = development_cards
        self.victory_points = victory_points
        self.buildings = buildings
        self.ports = ports
        self.connected = connected
        self.roads = roads
        self.built_structures = built_structures  
        self.longest_road_length = 0
        self.has_longest_road = False


    def __getattribute__(self, name):
        return super().__getattribute__(name)

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
    
    def giveResource(self, resource_type, amount):
        if resource_type in self.resource_cards:
            self.resource_cards[resource_type] += amount
        else:
            print(f"[ERROR] Resource type {resource_type} not recognized.")
            return False
        return True

    def findRoadBuildCandidates(self):
        road_candidates = set()
        for node in self.buildings:
            for path in node.paths:
                if path.owner is None:
                    road_candidates.add(path)
        
        return list(road_candidates)

    def findSettlementBuildCandidates(self):
        settlement_candidates = set()
        for road in self.roads:
            for node in road.connectedNodes:
                if node.occupiedBY is None and node.isBuildable:
                    settlement_candidates.add(node.id)
        return list(settlement_candidates)
    
    def findCityUpgradeCandidates(self):
        city_candidates = set()
        for node in self.buildings:
            if node.buildingType == "SETTLEMENT":
                city_candidates.add(node.id)
        return list(city_candidates)
    
    def takeResource(self, resource_type, amount):

        """
        optional helper function for trading, returns true if taken, false if not enough
        """
        amount = int(amount)
        if self.resource_cards.get(resource_type, 0) < amount:
            return False
        self.resource_cards[resource_type] -= amount
        return True

        
    
class Colour(Enum):
    RED = "Red"
    BLUE = "Blue"
    WHITE = "White"
    ORANGE = "Orange"
    GREEN = "Green"
