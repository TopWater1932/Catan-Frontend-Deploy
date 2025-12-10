export default class Tile {
    constructor(id,resource,number,x,y) {
        this.id = id;
        this.resource = resource;
        this.number = number;
        this.robber = false;
        this.x = x;
        this.y = y;
    }

    // toggleRobber() {
    //     this.robber = !this.robber;
    //     console.log(this.robber)
    // }
}

