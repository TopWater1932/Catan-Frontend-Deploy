class Tiles {
    constructor(resource,number) {
        this.resource = resource;
        this.number = number;
        this.robber = false;
    }

    toggleRobber() {
        this.robber = !this.robber;
        console.log(this.robber)
    }
}