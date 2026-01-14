import Node from '../classes/Node'

function calcValidPlacements(structuresGrid: Node[]): Node[] {
    // A valid placement is any vertex that is 'empty' for both player and structure.
    let unOccupied: Node[] = structuresGrid.filter(node => node.occupiedBy === null && node.buildingType === null);

    return unOccupied;
}

export default calcValidPlacements;