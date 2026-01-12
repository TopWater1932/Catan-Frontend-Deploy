import {
    ResourcesMap,
    DevCardsMap,
    PlayerStrucMap
} from '../ts-contracts/interfaces';

export default class Player {
    // Explicitly define property types
    public id: string;
    public name: string;
    public color: string;
    public activeTurn: boolean;
    public resources: ResourcesMap;
    public devCards: DevCardsMap;
    public structures: PlayerStrucMap;
    public vps: number;
    public ports: string[]; // List of port types/IDs owned

    constructor(
        id: string,
        name: string,
        color: string,
        activeTurn: boolean = false,
        resources: ResourcesMap,
        devCards: DevCardsMap,
        structures: PlayerStrucMap,
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