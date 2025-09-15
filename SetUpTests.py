import Game

import random
from Game import Game

def test_setupTiles():
    assert hasattr(Game, 'setupTiles'), "Game class should have a method named setupTiles"
    game = Game(None, [Game.Player("Alice", "red")])
    available_tiles = {
        "Forest": 1,
        "Hills": 1, 
        "Desert": 1
    }
    
