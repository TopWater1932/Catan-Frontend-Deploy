import { Coordinates } from '../ts-contracts/interfaces';

function initialiseTileGrid(initX: number, initY: number, hexRadius: number, sideLength: number): Coordinates[] {
    let rows: number[] = [];
    let cols: number[] = [];

    const hexHeight = Math.sqrt((hexRadius ** 2) - ((hexRadius / 2) ** 2));

    // Vertical spacing (y-coordinates)
    for (let i = 0; i < (2 * sideLength - 1); i++) {
        rows.push(initY + (hexRadius + hexRadius / 2) * i);
    }

    // Horizontal spacing (x-coordinates)
    for (let j = 0; j < (4 * sideLength - 3); j++) {
        cols.push(initX + hexHeight * j);
    }

    let coords: Coordinates[] = [];

    // First half of the grid (top half including the middle row)
    for (const [i, y] of rows.entries()) {
        if (i >= sideLength) {
            break;
        }

        let isTileCoord: boolean = true;
        let tileCounter: number = 0;
        const numberOfTiles: number = i + sideLength;
        const startIndex: number = sideLength - 1 - i;

        for (const [j, x] of cols.entries()) {
            if (j >= startIndex) {
                if (isTileCoord) {
                    coords.push({ 'x': x, 'y': y });
                    tileCounter++;
                }

                isTileCoord = !isTileCoord;
            }

            if (tileCounter >= numberOfTiles) {
                break;
            }
        }
    }

    // Second half of the grid (bottom half, excluding the middle row already done)
    for (const [i, y] of rows.entries()) {
        if (i < sideLength) {
            continue;
        }

        let isTileCoord: boolean = true;
        let tileCounter: number = 0;
        const numberOfTiles: number = 3 * sideLength - 2 - i;
        const startIndex: number = 1 + i - sideLength;

        for (const [j, x] of cols.entries()) {
            if (j >= startIndex) {
                if (isTileCoord === true) {
                    coords.push({ 'x': x, 'y': y });
                    tileCounter++;
                }

                if (tileCounter >= numberOfTiles) {
                    break;
                }

                isTileCoord = !isTileCoord;
            }
        }
    }

    return coords;
}

export default initialiseTileGrid;