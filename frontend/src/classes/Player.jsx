export default class Player {
    constructor(id,name,color,activeTurn=false,resources,devCards,structures,vps=0) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.activeTurn = activeTurn;
        this.resources = resources;
        this.devCards = devCards;
        this.structures = structures;
        this.vps = vps;
    }

    setActiveTurn(bool) {
        this.activeTurn = bool
    }

}

