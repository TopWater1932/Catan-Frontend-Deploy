function createCardArray(id,resourceState,devCardState) {

    let resNum = 0;
    let devNum = 0;

    for (let resource in resourceState[id]) {
        resNum += resourceState[id][resource];
    }

    for (let devCard in devCardState[id]) {
        devNum += devCardState[id][devCard];
    }
    
    let resCardsArr = new Array(resNum).fill("R");
    
    let devCardsArr = new Array(devNum).fill("D");

    return resCardsArr.concat(devCardsArr)
}

export default createCardArray