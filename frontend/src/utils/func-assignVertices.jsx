function assignVertices(vertexGrid,ports,vertexID) {

    const verticesMasterArray = vertexGrid.map((coord,i) => ({
        id: vertexID[i],
        ...coord,
        'player':'empty',
        'structure':'empty',
        'port':'none'
    }));

    let masterArrayIndex;

    for (const portID in ports) {
        for (const portVertexID of ports[portID].vert) {
            masterArrayIndex = verticesMasterArray.findIndex(vert => vert.id===portVertexID);
            verticesMasterArray[masterArrayIndex].port = portID;
        }
    }
    
    return verticesMasterArray
}

export default assignVertices