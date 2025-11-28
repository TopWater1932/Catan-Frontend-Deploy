function generateVertexIDs(vertexGrid) {
    const numOfVertices = vertexGrid.length
    let ids = [];

    for (let i=0; i<numOfVertices; i++) {
        ids.push(`V${i}`)
    }

    return ids;
}

export default generateVertexIDs