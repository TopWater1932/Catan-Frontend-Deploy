import { Vertex } from '../ts-contracts/interfaces';

function calcValidPlacements(structuresGrid: Vertex[]): Vertex[] {
    // A valid placement is any vertex that is 'empty' for both player and structure.
    let unOccupied: Vertex[] = structuresGrid.filter(vertex => vertex.player === 'empty' && vertex.structure === 'empty');

    return unOccupied;
}

export default calcValidPlacements;