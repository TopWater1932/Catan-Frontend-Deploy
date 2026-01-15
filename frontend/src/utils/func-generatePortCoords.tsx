import { Coordinates, PortsMap } from '../ts-contracts/interfaces';
import Tile from '../classes/Tile'
import Node from '../classes/Node'

function generatePortCoords(ports: PortsMap, nodeMasterArray: Node[], tilesMasterArray: Tile[]): void {
    // The original function modifies the `ports` object in place (void return type).
    const pointInBoard: Coordinates = { 'x': tilesMasterArray[0].x, 'y': tilesMasterArray[0].y };

    // h is the fixed distance from the midpoint of the edge to the port's center
    const h = 27;
    let a: number;
    let b: number;
    let p1: Node;
    let p2: Node;
    let p1Index: number;
    let p2Index: number;
    let point3A: Coordinates;
    let point3B: Coordinates;
    let distanceToA: number;
    let distanceToB: number;

    for (const portID in ports) {

        p1Index = nodeMasterArray.findIndex(node => node.idNode === ports[portID].vert[0]);
        p2Index = nodeMasterArray.findIndex(node => node.idNode === ports[portID].vert[1]);

        if (p1Index === -1 || p2Index === -1) {
            // Should not happen if data is correctly structured
            console.error(`Vertex not found for port ${portID}`);
            continue;
        }

        p1 = nodeMasterArray[p1Index];
        p2 = nodeMasterArray[p2Index];

        a=(h*(p1.yCoord-p2.yCoord))/Math.sqrt((p2.xCoord-p1.xCoord)**2+(p2.yCoord-p1.yCoord)**2);
        b=(h*(p2.xCoord-p1.xCoord))/Math.sqrt((p2.xCoord-p1.xCoord)**2+(p2.yCoord-p1.yCoord)**2);

        point3A = {'x':((p1.xCoord+p2.xCoord)/2+a),'y':((p1.yCoord+p2.yCoord)/2+b)}
        point3B = {'x':((p1.xCoord+p2.xCoord)/2-a),'y':((p1.yCoord+p2.yCoord)/2-b)}

        distanceToA = Math.sqrt((point3A.x-pointInBoard.x)**2+(point3A.y-pointInBoard.y)**2);
        distanceToB = Math.sqrt((point3B.x-pointInBoard.x)**2+(point3B.y-pointInBoard.y)**2);

        // Add coordinates 
        (distanceToA>distanceToB ? ports[portID].x=point3A.x : ports[portID].x=point3B.x);
        (distanceToA>distanceToB ? ports[portID].y=point3A.y : ports[portID].y=point3B.y);
    }
}

export default generatePortCoords;