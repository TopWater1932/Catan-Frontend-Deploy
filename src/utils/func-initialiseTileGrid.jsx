function initialiseTileGrid(initX,initY,hexRadius,sideLength) {
    let rows = [];
    let cols = [];

    const hexHeight = Math.sqrt((hexRadius**2)-((hexRadius/2)**2));

    for (let i=0; i<(2*sideLength-1); i++) {
        rows.push(initY+(hexRadius+hexRadius/2)*i);
    }
    
    for (let j=0; j<(4*sideLength-3); j++) {
        cols.push(initX+hexHeight*j);
    }

    let coords = [];

    for (const [i,y] of rows.entries()) {
        

        if (i>=sideLength) {
            break;
        }

        let isTileCoord = true;
        let tileCounter= 0;

        for (const [j,x] of cols.entries()) {
            let numberOfTiles = i+sideLength;
            let startIndex = sideLength-1-i;
            
            if (j>=startIndex) {
                if (isTileCoord) {
                    coords.push({'x':x,'y':y})
                    tileCounter++;
                }

                isTileCoord = !isTileCoord;
            }

            if (tileCounter >= numberOfTiles) {
                break;
            }
        }
    }

    for (const [i,y] of rows.entries()) {

        if (i<sideLength) {
            continue;
        }

        let isTileCoord = true;
        let tileCounter= 0;

        for (const [j,x] of cols.entries()) {
            let numberOfTiles = 3*sideLength-2-i;
            let startIndex = 1+i-sideLength;
            
            if (j>=startIndex) {
                if (isTileCoord===true) {
                    coords.push({'x':x,'y':y})
                    tileCounter++;
                }

                if (tileCounter >= numberOfTiles) {
                    break;
                }

                isTileCoord = !isTileCoord;
            }
        }
    }

    return coords
    
}

export default initialiseTileGrid