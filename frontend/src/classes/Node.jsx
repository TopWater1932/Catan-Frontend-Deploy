import Structure from './Structure.tsx';

export default class Node {
    constructor(idNode,row,occupiedBy=null,isBuildable=true,buildingType=null,neighborNodes=[],xCoord,yCoord) {
        this.idNode = idNode;
        this.row = row;
        this.occupiedBy = occupiedBy;
        this.isBuildable = isBuildable;
        this.buildingType = buildingType;
        this.neighborNodes = neighborNodes;
        this.xCoord = xCoord;
        this.yCoord = yCoord;
    }

    buildSettlement(playerID) {
        if (this.isBuildable) {
            this.buildingType = 'settlement';
            new Structure(`${playerID}-${this.idNode}-struc`,this.idNode,this.buildingType);
            this.occupiedBy = playerID;
            this.isBuildable = false;
            return true;
        } else {
            return false;
        }
    }
}