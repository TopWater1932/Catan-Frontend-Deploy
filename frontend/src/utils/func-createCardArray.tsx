import { ResourcesMap, DevCardsMap } from '../ts-contracts/interfaces';

function createCardArray(resources: ResourcesMap, devCards: DevCardsMap): string[] {
    let resNum: number = 0;
    let devNum: number = 0;

    for (let resource in resources) {
        resNum += resources[resource];
    }

    for (let devCard in devCards) {
        devNum += devCards[devCard];
    }

    let resCardsArr: string[] = new Array(resNum).fill("R");
    let devCardsArr: string[] = new Array(devNum).fill("D");

    return resCardsArr.concat(devCardsArr);
}

export default createCardArray;