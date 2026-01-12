import Structure from './Structure';

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
            new Structure(`${playerID}-${this.idPath}-road`, this.idPath, 'road');
            this.owner = playerID;
            this.isBuildable = false;
            return true;
        } else {
            return false;
        }
    }
}