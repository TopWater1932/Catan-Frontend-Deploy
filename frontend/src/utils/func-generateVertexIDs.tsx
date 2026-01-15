function generateVertexIDs(vertexGrid: any[]): string[] { // Using any[] because vertexGrid is just an array of objects
    const numOfVertices: number = vertexGrid.length;
    let ids: string[] = [];

    for (let i = 0; i < numOfVertices; i++) {
        ids.push(`V${i}`);
    }

    return ids;
}

export default generateVertexIDs;