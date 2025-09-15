from enum import Enum

class Player:
    def __init__(self, name, colour, resource_cards={}, development_cards={}, victory_points=0, buildings={}):
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

    
class Colour(Enum):
    RED = "Red"
    BLUE = "Blue"
    WHITE = "White"
    ORANGE = "Orange"
    GREEN = "Green"
