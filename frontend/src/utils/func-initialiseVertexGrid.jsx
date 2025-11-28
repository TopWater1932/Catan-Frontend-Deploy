function initialiseVertexGrid(tilesMasterArray,tileRadius) {

    let coords = [];
    const pi = Math.PI;
    const cos30 = Math.cos(30*(pi/180));
    
    const northTileArray = tilesMasterArray.slice(0,12);

    for (const [i,tile] of northTileArray.entries()) {
        let pointArr;
        
        if (i===0 || i===3 || i===7) {
            pointArr = [
                {'x': tile.x-cos30*tileRadius, 'y': tile.y-tileRadius/2},
                {'x': tile.x, 'y': tile.y-tileRadius},
                {'x': tile.x+cos30*tileRadius, 'y': tile.y-tileRadius/2}
            ];
        } else {
            pointArr = [
                {'x': tile.x, 'y': tile.y-tileRadius},
                {'x': tile.x+cos30*tileRadius, 'y': tile.y-tileRadius/2}
            ];
        }
        
        coords.push(...pointArr);

    }

    const southTileArray = tilesMasterArray.slice(7);

    for (const [i,tile] of southTileArray.entries()) {
        let pointArr;
        
        if (i===0 || i===5 || i===9) {
            pointArr = [
                {'x': tile.x-cos30*tileRadius, 'y': tile.y+tileRadius/2},
                {'x': tile.x, 'y': tile.y+tileRadius},
                {'x': tile.x+cos30*tileRadius, 'y': tile.y+tileRadius/2}
            ];
        } else {
            pointArr = [
                {'x': tile.x, 'y': tile.y+tileRadius},
                {'x': tile.x+cos30*tileRadius, 'y': tile.y+tileRadius/2}
            ];
        }
        
        coords.push(...pointArr);
    }

    return coords
}



export default initialiseVertexGrid