export default class Dice {
    constructor(numbers,isRollable=true,playerPosition) {
        this.numbers = numbers; // Array of possible dice outcomes
        this.isRollable = isRollable;
        this.playerPosition = playerPosition; // Current player's ID
    }

    rollDice() {
        if (this.isRollable) {
            this.isRollable = false;
            return true;
        } else {
            return false;
        }
    }

    nextTurn(nextPlayerID) {
        this.isRollable = true;
        this.playerPosition = nextPlayerID;
    }
}