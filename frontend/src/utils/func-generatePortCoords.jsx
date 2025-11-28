function generatePortCoords(ports,verticesMasterArray,tilesMasterArray) {
    const pointInBoard = {'x':tilesMasterArray[0].x,'y':tilesMasterArray[0].y};

    const h = 27;
    let a;
    let b;
    let p1;
    let p2;
    let p1Index;
    let p2Index;
    let point3A;
    let point3B;

    let distanceToA;
    let distanceToB;

    // const pi = Math.PI;
    // const sin60 = Math.sin(60*(pi/180));

    for (const portID in ports) {
        p1Index = verticesMasterArray.findIndex(vertex => vertex.id===ports[portID].vert[0]);
        p2Index = verticesMasterArray.findIndex(vertex => vertex.id===ports[portID].vert[1]);
        p1 = verticesMasterArray[p1Index];
        p2 = verticesMasterArray[p2Index];

        a=(h*(p1.y-p2.y))/Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);
        b=(h*(p2.x-p1.x))/Math.sqrt((p2.x-p1.x)**2+(p2.y-p1.y)**2);

        point3A = {'x':((p1.x+p2.x)/2+a),'y':((p1.y+p2.y)/2+b)}
        point3B = {'x':((p1.x+p2.x)/2-a),'y':((p1.y+p2.y)/2-b)}

        distanceToA = Math.sqrt((point3A.x-pointInBoard.x)**2+(point3A.y-pointInBoard.y)**2);
        distanceToB = Math.sqrt((point3B.x-pointInBoard.x)**2+(point3B.y-pointInBoard.y)**2);

        (distanceToA>distanceToB ? ports[portID].x=point3A.x : ports[portID].x=point3B.x);
        (distanceToA>distanceToB ? ports[portID].y=point3A.y : ports[portID].y=point3B.y);
    }
}

export default generatePortCoords