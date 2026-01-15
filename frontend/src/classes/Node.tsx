// import Structure from './Structure';

export default class Node {
    // Explicitly define property types
    public idNode: string;
    public occupiedBy: string | null;
    public isBuildable: boolean;
    public buildingType: 'settlement' | 'city' | null;
    public paths: string[];
    public portType: string | null;
    public xCoord: number;
    public yCoord: number;

    constructor(
        idNode: string,
        occupiedBy: string | null = null,
        isBuildable: boolean = true,
        buildingType: 'settlement' | 'city' | null = null,
        paths: string[] = [],
        portType: string | null,
        xCoord: number,
        yCoord: number
    ) {
        this.idNode = idNode;
        this.occupiedBy = occupiedBy;
        this.isBuildable = isBuildable;
        this.buildingType = buildingType;
        this.paths = paths;
        this.portType = portType
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    /**
     * Builds a 'settlement' structure on the node.
     * @param playerID - The ID of the player building the settlement.
     * @returns boolean - true if settlement was built, false otherwise.
     */
    // buildSettlement(playerID: string): boolean {
    //     if (this.isBuildable) {
    //         this.buildingType = 'settlement';
    //         // Note: Creating the Structure object here but not storing it anywhere in Node or returning it.
    //         new Structure(`${playerID}-${this.idNode}-struc`, this.idNode, this.buildingType);
    //         this.occupiedBy = playerID;
    //         this.isBuildable = false;
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}