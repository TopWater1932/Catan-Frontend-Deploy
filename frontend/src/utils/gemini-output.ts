// utils.zip/utils/func-calcValidPlacements.ts
import { Vertex } from '../ts-contracts/interfaces';

function calcValidPlacements(structuresGrid: Vertex[]): Vertex[] {
    // A valid placement is any vertex that is 'empty' for both player and structure.
    let unOccupied: Vertex[] = structuresGrid.filter(vertex => vertex.player === 'empty' && vertex.structure === 'empty');

    return unOccupied;
}

export default calcValidPlacements;

// utils.zip/utils/func-assignVertices.ts
import { Coordinates, PortsMap, Vertex } from '../ts-contracts/interfaces';

function assignVertices(vertexGrid: Coordinates[], ports: PortsMap, vertexID: string[]): Vertex[] {

    const verticesMasterArray: Vertex[] = vertexGrid.map((coord, i) => ({
        id: vertexID[i],
        ...coord, // Includes x and y
        'player': 'empty',
        'structure': 'empty',
        'port': 'none'
    }));

    let masterArrayIndex: number;

    for (const portID in ports) {
        if (!ports.hasOwnProperty(portID)) continue;

        for (const portVertexID of ports[portID].vert) {
            masterArrayIndex = verticesMasterArray.findIndex(vert => vert.id === portVertexID);

            if (masterArrayIndex !== -1) {
                verticesMasterArray[masterArrayIndex].port = portID;
            } else {
                console.warn(`Vertex ID ${portVertexID} for port ${portID} not found in master array.`);
            }
        }
    }

    return verticesMasterArray;
}

export default assignVertices;

// utils.zip/utils/func-generatePortCoords.ts
import { Coordinates, PortsMap, Vertex, Tile } from '../ts-contracts/interfaces';

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
        if (!ports.hasOwnProperty(portID)) continue;

        p1Index = verticesMasterArray.findIndex(vertex => vertex.id === ports[portID].vert[0]);
        p2Index = verticesMasterArray.findIndex(vertex => vertex.id === ports[portID].vert[1]);

        if (p1Index === -1 || p2Index === -1) {
            // Should not happen if data is correctly structured
            console.error(`Vertex not found for port ${portID}`);
            continue;
        }

        p1 = verticesMasterArray[p1Index];
        p2 = verticesMasterArray[p2Index];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx ** 2 + dy ** 2);

        // a and b are components of the normal vector scaled by h
        // Normal vector: (p1.y - p2.y) / dist, (p2.x - p1.x) / dist
        if (dist === 0) {
            console.error(`Vertices for port ${portID} are identical.`);
            continue;
        }

        a = (h * (p1.y - p2.y)) / dist;
        b = (h * (p2.x - p1.x)) / dist;

        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        // Point3A and Point3B are the two points at distance 'h' along the normal from the midpoint
        point3A = { 'x': (midX + a), 'y': (midY + b) };
        point3B = { 'x': (midX - a), 'y': (midY - b) };

        // Determine which point is further from the reference point (tilesMasterArray[0])
        distanceToA = Math.sqrt((point3A.x - pointInBoard.x) ** 2 + (point3A.y - pointInBoard.y) ** 2);
        distanceToB = Math.sqrt((point3B.x - pointInBoard.x) ** 2 + (point3B.y - pointInBoard.y) ** 2);

        // Assign the coordinates of the point that is *further* away (assumed to be outside the board)
        ports[portID].x = (distanceToA > distanceToB ? point3A.x : point3B.x);
        ports[portID].y = (distanceToA > distanceToB ? point3A.y : point3B.y);
    }
}

export default generatePortCoords;

export interface Coordinates {
    x: number;
    y: number;
}

export interface Tile extends Coordinates {
    // Assuming a Tile might have other properties like id, resource, etc.
}

export interface Vertex extends Coordinates {
    id: string;
    player: 'empty' | string; // Assuming 'empty' or a player ID/name string
    structure: 'empty' | string; // Assuming 'empty' or a structure type string
    port: 'none' | string; // Assuming 'none' or a port ID string
}

export interface Port {
  reqNumIn: number;
  reqTypeIn: string;
  vert: string[];
  text: string;
}

export interface PortsMap {
    [portID: string]: Port;
}

export interface StageSize {
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
}

export interface ResourcesMap {
    [resource: string]: number;
}

export interface DevCardsMap {
    [card: string]: number;
}

// These are placeholders for the existing useFetch types for completeness
export interface useFetchArgs {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    info?: Record<string, any>;
    setServerMsgs: React.Dispatch<React.SetStateAction<string[]>>;
}

export type useFetchReturns = [
    any | null, // data
    boolean, // loading
    Error | null, // error
    () => Promise<void> // fetchCallback
];