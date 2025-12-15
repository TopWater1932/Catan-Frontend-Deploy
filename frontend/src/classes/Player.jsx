export default class Player {
    constructor(id,name,color,activeTurn=false,resources,devCards,structures,vps=0,ports=[]) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.activeTurn = activeTurn;
        this.resources = resources;
        this.devCards = devCards;
        this.structures = structures;
        this.vps = vps;
        this.ports = ports;  // ADD 4-1 PORT FOR ALL PLAYERS BY DEFAULT
    }

    setActiveTurn(bool) {
        this.activeTurn = bool
    }
}

