from Player import Player
from enum import Enum
from utils.TerrainType import TerrainType
from utils.Color import Color
from utils.Buildings import Buildings
from utils.DevCards import DevCards


class Bot(Player):
    def __init__(self, id, name='', color=''):
        super().__init__(id,name,color)
        self.isBot = True
        self.game = None


    # def __getattribute__(self, name):
    #     return super().__getattribute__(name)

    # def __setattr__(self, name, value):
    #     super().__setattr__(name, value)

    def __getstate__(self):
        botState = self.__dict__.copy()
        botState.pop('game',None)
        return botState