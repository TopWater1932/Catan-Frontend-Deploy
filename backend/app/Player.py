from enum import Enum
from Tile import TerrainType

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

    def __getattribute__(self, name):
        return super().__getattribute__(name)

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
    
    def giveResource(self, resource_type, amount):
        if resource_type in self.resource_cards:
            self.resource_cards[resource_type] += amount
        else:
            print(f"[ERROR] Resource type {resource_type} not recognized.")

    def findRoadBuildCandidates(self):
        road_candidates = set()
        for node in self.buildings:
            for path in node.paths:
                if path.owner is None:
                    road_candidates.add(path)

        return list(road_candidates)
    
class Colour(Enum):
    RED = "Red"
    BLUE = "Blue"
    WHITE = "White"
    ORANGE = "Orange"
    GREEN = "Green"
