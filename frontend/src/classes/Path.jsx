import Structure from './Structure.jsx';

export default class Path {
    constructor(idPath,connectedNodes=[],isBuildable=true,owner=null) {
        this.idPath = idPath;
        this.connectedNodes = connectedNodes;
        this.isBuildable = isBuildable;
        this.owner = owner;
    }

    buildStructure(playerID) {
        if (this.owner === null) {
            new Structure(`${playerID}-${this.idPath}-road`,this.idPath,'road');
            this.owner = playerID;
            this.isBuildable = false;
            return true;
        } else {
            return false;
        }
    }
}