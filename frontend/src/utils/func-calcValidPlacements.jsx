function calcValidPlacements(structuresGrid) {
    let unOccupied = structuresGrid.filter(vertex => vertex.player==='empty' && vertex.structure==='empty');
    
    return unOccupied;
}

export default calcValidPlacements