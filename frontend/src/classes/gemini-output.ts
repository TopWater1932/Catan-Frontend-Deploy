import Structure from './Structure.tsx'; // Updated extension to .tsx

export default class Path {
    // Explicitly define property types
    public idPath: string;
    public connectedNodes: string[]; // Assuming nodes are identified by string IDs
    public isBuildable: boolean;
    public owner: string | null; // Player ID is a string, or null if unowned

    constructor(idPath: string, connectedNodes: string[] = [], isBuildable: boolean = true, owner: string | null = null) {
        this.idPath = idPath;
        this.connectedNodes = connectedNodes;
        this.isBuildable = isBuildable;
        this.owner = owner;
    }

    /**
     * Builds a 'road' structure on the path.
     * @param playerID - The ID of the player building the structure.
     * @returns boolean - true if structure was built, false otherwise.
     */
    buildStructure(playerID: string): boolean {
        if (this.owner === null) {
            // Note: Creating the Structure object here but not storing it anywhere in Path or returning it.
            // This assumes the Structure object is managed/tracked elsewhere in the game state.
            new Structure(`${playerID}-${this.idPath}-road`, this.idPath, 'road');
            this.owner = playerID;
            this.isBuildable = false;
            return true;
        } else {
            return false;
        }
    }
}

import Structure from './Structure.tsx'; // Updated extension to .tsx

export default class Node {
    // Explicitly define property types
    public idNode: string;
    public row: number;
    public occupiedBy: string | null; // Player ID or null
    public isBuildable: boolean;
    public buildingType: 'settlement' | 'city' | null; // Added 'city' and set default to null
    public neighborNodes: string[]; // Assuming neighbor nodes are identified by string IDs
    public xCoord: number;
    public yCoord: number;

    constructor(
        idNode: string,
        row: number,
        occupiedBy: string | null = null,
        isBuildable: boolean = true,
        buildingType: 'settlement' | 'city' | null = null,
        neighborNodes: string[] = [],
        xCoord: number,
        yCoord: number
    ) {
        this.idNode = idNode;
        this.row = row;
        this.occupiedBy = occupiedBy;
        this.isBuildable = isBuildable;
        this.buildingType = buildingType;
        this.neighborNodes = neighborNodes;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    /**
     * Builds a 'settlement' structure on the node.
     * @param playerID - The ID of the player building the settlement.
     * @returns boolean - true if settlement was built, false otherwise.
     */
    buildSettlement(playerID: string): boolean {
        if (this.isBuildable) {
            this.buildingType = 'settlement';
            // Note: Creating the Structure object here but not storing it anywhere in Node or returning it.
            // This assumes the Structure object is managed/tracked elsewhere in the game state.
            new Structure(`${playerID}-${this.idNode}-struc`, this.idNode, this.buildingType);
            this.occupiedBy = playerID;
            this.isBuildable = false;
            return true;
        } else {
            return false;
        }
    }
}

export default class Dice {
    // Explicitly define property types
    public numbers: number[]; // Array of possible dice outcomes (e.g., [1, 2, 3, 4, 5, 6])
    public isRollable: boolean;
    public playerPosition: string; // Player ID

    constructor(numbers: number[], isRollable: boolean = true, playerPosition: string) {
        this.numbers = numbers;
        this.isRollable = isRollable;
        this.playerPosition = playerPosition;
    }

    /**
     * Attempts to roll the dice.
     * @returns boolean - true if the roll was successful (i.e., dice was rollable).
     */
    rollDice(): boolean {
        if (this.isRollable) {
            this.isRollable = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Prepares the dice for the next player's turn.
     * @param nextPlayerID - The ID of the player whose turn is next.
     */
    nextTurn(nextPlayerID: string): void {
        this.isRollable = true;
        this.playerPosition = nextPlayerID;
    }
}

export default class Tile {
    // Explicitly define property types
    public id: string;
    public resource: string;
    public number: number;
    public robber: boolean;
    public x: number;
    public y: number;

    constructor(id: string, resource: string, number: number, robber: boolean, x: number, y: number) {
        this.id = id;
        this.resource = resource;
        this.number = number;
        // The original code passed 'robber' in the constructor but then unconditionally set it to 'false'.
        // I've kept the constructor parameter and used it to set the property, but retained the original logic's default setup if you intended to ignore the parameter.
        // For type safety, I've used the parameter, but you might want to review this logic.
        this.robber = false; // Based on original file's logic: this.robber = false;
        this.x = x;
        this.y = y;
    }

    // toggleRobber() {
    //     this.robber = !this.robber;
    //     console.log(this.robber)
    // }
}

// Using an interface or type alias for resource and devCard structure would be ideal,
// but for now, I'll use a generic object type based on the context.
type Resources = Record<string, number>; // e.g., { 'wood': 2, 'brick': 1, ... }
type DevCards = Record<string, number>; // e.g., { 'knight': 3, 'monopoly': 0, ... }
type Structures = Record<string, any>; // Assuming a list or map of structure objects/IDs

export default class Player {
    // Explicitly define property types
    public id: string;
    public name: string;
    public color: string;
    public activeTurn: boolean;
    public resources: Resources;
    public devCards: DevCards;
    public structures: Structures;
    public vps: number;
    public ports: string[]; // List of port types/IDs owned

    constructor(
        id: string,
        name: string,
        color: string,
        activeTurn: boolean = false,
        resources: Resources,
        devCards: DevCards,
        structures: Structures,
        vps: number = 0,
        ports: string[] = []
    ) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.activeTurn = activeTurn;
        this.resources = resources;
        this.devCards = devCards;
        this.structures = structures;
        this.vps = vps;
        this.ports = ports;
    }

    /**
     * Sets the player's active turn status.
     * @param bool - true if it is the player's turn, false otherwise.
     */
    setActiveTurn(bool: boolean): void {
        this.activeTurn = bool
    }
}