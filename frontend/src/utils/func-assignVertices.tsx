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
        for (const portVertexID of ports[portID].vert) {
            masterArrayIndex = verticesMasterArray.findIndex(vert => vert.id === portVertexID);

            if (masterArrayIndex !== -1) {
                verticesMasterArray[masterArrayIndex].port = portID;
            } else {
                console.warn(`Node ID ${portVertexID} for port ${portID} not found in master array.`);
            }
        }
    }

    return verticesMasterArray;
}

export default assignVertices;