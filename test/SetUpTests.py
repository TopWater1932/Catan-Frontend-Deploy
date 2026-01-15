from .app import Game
import unittest

import random

class TestSetup(unittest.TestCase):

    def test_setupTiles(self):
        game = Game(None, [Game.Player("Alice", "red")])
        available_tiles = {
            "Forest": 1,
            "Hills": 1, 
            "Desert": 1
        }
        self.assertEqual(len(game.setupTiles()), 3)
        