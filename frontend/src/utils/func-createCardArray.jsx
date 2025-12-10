function createCardArray(resources,devCards) {

    let resNum = 0;
    let devNum = 0;

    for (let resource in resources) {
        resNum += resources[resource];
    }

    for (let devCard in devCards) {
        devNum += devCards[devCard];
    }
    
    let resCardsArr = new Array(resNum).fill("R");
    
    let devCardsArr = new Array(devNum).fill("D");

    return resCardsArr.concat(devCardsArr)
}

export default createCardArray