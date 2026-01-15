export default class Tile {
    // Explicitly define property types
    public id: string;
    public resource: string;
    public number: number;
    public robber: boolean;
    public x: number;
    public y: number;

    constructor(id: string, resource: string, number: number, robber: boolean, x: number, y: number) {
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