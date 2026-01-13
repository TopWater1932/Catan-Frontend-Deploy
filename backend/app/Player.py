from enum import Enum
from utils.TerrainType import TerrainType
from utils.Color import Color
from utils.Buildings import Buildings
from utils.DevCards import DevCards


class Player:
    def __init__(self, id, name='', color=''):

        self.id = id
        self.name = name
        self.color = color
        self.resource_cards = {
            TerrainType.FOREST.value:0,
            TerrainType.HILLS.value:0,
            TerrainType.MOUNTAINS.value:0,
            TerrainType.FIELDS.value:0,
            TerrainType.PASTURE.value:0
        }
        self.development_cards = {
            DevCards.KNIGHT.value:0,
            DevCards.VP.value:0,
            DevCards.ROAD_BUILDING.value:0,
            DevCards.YEAR_OF_PLENTY.value:0,
            DevCards.MONOPOLY.value:0,
            DevCards.KNIGHTS_PLAYED.value:0
        }
        self.buildings = {
            Buildings.ROADS.value:15,
            Buildings.SETTLEMENTS.value:5,
            Buildings.CITIES.value:4
        }
        self.victory_points = 0
        self.ports = ['4-1']
        self.connected = True
        self.roads = []
        self.built_structures = []
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
            if node.buildingType == Buildings.SETTLEMENTS.value:
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

        