import { Coordinates, PortsMap, Vertex } from '../ts-contracts/interfaces';
import Tile from '../classes/Tile.tsx'

function generatePortCoords(ports: PortsMap, verticesMasterArray: Vertex[], tilesMasterArray: Tile[]): void {
    // The original function modifies the `ports` object in place (void return type).
    const pointInBoard: Coordinates = { 'x': tilesMasterArray[0].x, 'y': tilesMasterArray[0].y };

    // h is the fixed distance from the midpoint of the edge to the port's center
    const h = 27;
    let a: number;
    let b: number;
    let p1: Vertex;
    let p2: Vertex;
    let p1Index: number;
    let p2Index: number;
    let point3A: Coordinates;
    let point3B: Coordinates;
    let distanceToA: number;
    let distanceToB: number;

    for (const portID in ports) {

        p1Index = verticesMasterArray.findIndex(vertex => vertex.id === ports[portID].vert[0]);
        p2Index = verticesMasterArray.findIndex(vertex => vertex.id === ports[portID].vert[1]);

        if (p1Index === -1 || p2Index === -1) {
            // Should not happen if data is correctly structured
            console.error(`Vertex not found for port ${portID}`);
            continue;
        }

        p1 = verticesMasterArray[p1Index];
        p2 = verticesMasterArray[p2Index];

        a=(h*(p1.y-p2.y))/Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
        b=(h*(p2.x-p1.x))/Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);

        point3A = {'x':((p1.x+p2.x)/2+a),'y':((p1.y+p2.y)/2+b)}
        point3B = {'x':((p1.x+p2.x)/2-a),'y':((p1.y+p2.y)/2-b)}

        distanceToA = Math.sqrt((point3A.x-pointInBoard.x)**2+(point3A.y-pointInBoard.y)**2);
        distanceToB = Math.sqrt((point3B.x-pointInBoard.x)**2+(point3B.y-pointInBoard.y)**2);

        // Add coordinates 
        (distanceToA>distanceToB ? ports[portID].x=point3A.x : ports[portID].x=point3B.x);
        (distanceToA>distanceToB ? ports[portID].y=point3A.y : ports[portID].y=point3B.y);
    }
}

export default generatePortCoords;