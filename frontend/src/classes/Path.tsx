import Structure from './Structure';

export default class Path {
    // Explicitly define property types
    public idPath: string;
    public owner: string | null;
    public connectedNodes: string[];
    public p1xCoord: number;
    public p1yCoord: number;
    public p2xCoord: number;
    public p2yCoord: number;

    constructor(
        idPath: string,
        owner: string | null = null,
        connectedNodes: string[] = [],
        p1xCoord: number,
        p1yCoord: number,
        p2xCoord: number,
        p2yCoord: number
    ) {
        this.idPath = idPath;
        this.owner = owner;
        this.connectedNodes = connectedNodes;
        this.p1xCoord = p1xCoord
        this.p1yCoord = p1yCoord
        this.p2xCoord = p2xCoord
        this.p2yCoord = p2yCoord
    }

    /**
     * Builds a 'road' structure on the path.
     * @param playerID - The ID of the player building the structure.
     * @returns boolean - true if structure was built, false otherwise.
     */
    // buildStructure(playerID: string): boolean {
    //     if (this.owner === null) {
    //         // Note: Creating the Structure object here but not storing it anywhere in Path or returning it.
    //         new Structure(`${playerID}-${this.idPath}-road`, this.idPath, 'road');
    //         this.owner = playerID;
    //         this.isBuildable = false;
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}