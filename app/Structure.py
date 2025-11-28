from abc import ABC, abstractmethod

class Structure(ABC):
    def __init__(self, name, requirements, point_value):
        self.name = name
        self.requirements = requirements  # Dictionary of required resources
        self.point_value = point_value  # Victory points provided by the structure

    @abstractmethod
    def build(self, player):
        pass

class isUpgradable(ABC): #Upgrade interface
    @abstractmethod
    def upgrade(self, player):
        pass