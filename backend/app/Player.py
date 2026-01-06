from enum import Enum

class Player:
    def __init__(self,id, name, colour, resource_cards={}, development_cards={}, buildings={}, victory_points=0):
        self.id = id
        self.name = name
        self.colour = colour
        self.resource_cards = resource_cards
        self.development_cards = development_cards
        self.victory_points = victory_points
        self.buildings = buildings

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
