from enum import Enum
from Tile import TerrainType

class Player:
<<<<<<< Updated upstream
    def __init__(self, id, name='', color='',
        resource_cards={"wood":0,"brick":0,"wheat":0,"sheep":0,"ore":0},
        development_cards={"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
        buildings={"roads":15,"settlements":5,"cities":4},
        victory_points=0,
        ports = ['4-1'], # Default 4:1 port
        connected = True
        ):

        self.id = id
        self.name = name
        self.color = color
        self.resource_cards = resource_cards
        self.development_cards = development_cards
        self.victory_points = victory_points
        self.buildings = buildings
        self.ports = ports
        self.connected = connected
=======
    def __init__(self,id, name, colour, resource_cards={}, development_cards={}, buildings=[], roads=[], victory_points=0):
        self.id = id
        self.name = name
        self.colour = colour
        self.resource_cards = {
            TerrainType.FOREST.value: 0,
            TerrainType.HILLS.value: 0,
            TerrainType.MOUNTAINS.value: 0,
            TerrainType.FIELDS.value: 0,
            TerrainType.PASTURE.value: 0
        }
        self.development_cards = development_cards
        self.victory_points = victory_points
        self.buildings = buildings
        self.roads = roads
>>>>>>> Stashed changes

    def __getattribute__(self, name):
        return super().__getattribute__(name)

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
    
    def giveResource(self, resource_type, amount):
        if resource_type in self.resource_cards:
            self.resource_cards[resource_type] += amount
        else:
            print("[ERROR] Resource type not recognized.")
    def findRoadBuildCandidates(self):
        for node in self.buildings

    
class Color(Enum):
    RED = "Red"
    BLUE = "Blue"
    WHITE = "White"
    ORANGE = "Orange"
    GREEN = "Green"
