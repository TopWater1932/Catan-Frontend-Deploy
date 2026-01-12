import { Coordinates } from '../ts-contracts/interfaces';
import Tile from '../classes/Tile.tsx'

function initialiseVertexGrid(tilesMasterArray: Tile[], tileRadius: number): Coordinates[] {
    let coords: Coordinates[] = [];
    const pi: number = Math.PI;
    const cos30: number = Math.cos(30 * (pi / 180));

    // North tile array - indices 0 to 11 (12 elements)
    const northTileArray: Tile[] = tilesMasterArray.slice(0, 12);

    for (const [i, tile] of northTileArray.entries()) {
        let pointArr: Coordinates[];

        // i===0, 3, 7 correspond to specific tiles (e.g., those on the left edge of the top/middle section)
        // that require 3 vertices to be generated to prevent duplication with previous tiles.
        if (i === 0 || i === 3 || i === 7) {
            pointArr = [
                { 'x': tile.x - cos30 * tileRadius, 'y': tile.y - tileRadius / 2 },
                { 'x': tile.x, 'y': tile.y - tileRadius },
                { 'x': tile.x + cos30 * tileRadius, 'y': tile.y - tileRadius / 2 }
            ];
        } else {
            // The other tiles only need 2 vertices to avoid duplication
            pointArr = [
                { 'x': tile.x, 'y': tile.y - tileRadius },
                { 'x': tile.x + cos30 * tileRadius, 'y': tile.y - tileRadius / 2 }
            ];
        }

        coords.push(...pointArr);
    }

    // South tile array - indices 7 onwards (which includes some overlap with northTileArray's end)
    const southTileArray: Tile[] = tilesMasterArray.slice(7);

    for (const [i, tile] of southTileArray.entries()) {
        let pointArr: Coordinates[];

        // i===0, 5, 9 correspond to specific tiles that require 3 vertices.
        if (i === 0 || i === 5 || i === 9) {
            pointArr = [
                { 'x': tile.x - cos30 * tileRadius, 'y': tile.y + tileRadius / 2 },
                { 'x': tile.x, 'y': tile.y + tileRadius },
                { 'x': tile.x + cos30 * tileRadius, 'y': tile.y + tileRadius / 2 }
            ];
        } else {
            // The other tiles only need 2 vertices to avoid duplication
            pointArr = [
                { 'x': tile.x, 'y': tile.y + tileRadius },
                { 'x': tile.x + cos30 * tileRadius, 'y': tile.y + tileRadius / 2 }
            ];
        }

        coords.push(...pointArr);
    }

    return coords;
}

export default initialiseVertexGrid;