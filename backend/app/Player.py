from enum import Enum

class Player:
    def __init__(self, id, name='', colour='',
        resource_cards={"wood":0,"brick":0,"wheat":0,"sheep":0,"ore":0},
        development_cards={"knight":0,"victoryPoint":0,"roadBuilding":0,"yearOfPlenty":0,"monopoly":0,"knightsPlayed":0},
        buildings={"roads":15,"settlements":5,"cities":4},
        victory_points=0,
        ports = ['4-1'], # Default 4:1 port
        connected = True
        ):

        self.id = id
        self.name = name
        self.colour = colour
        self.resource_cards = resource_cards
        self.development_cards = development_cards
        self.victory_points = victory_points
        self.buildings = buildings
        self.ports = ports
        self.connected = connected

    def __getattribute__(self, name):
        return super().__getattribute__(name)

    def __setattr__(self, name, value):
        super().__setattr__(name, value)
    
    def giveResource(self, resource_type, amount):
        amount = int(amount)
        self.resource_cards[resource_type] = self.resource_cards.get(resource_type, 0) + amount

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
