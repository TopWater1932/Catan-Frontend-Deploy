export default class Dice {
    // Explicitly define property types
    numbers: number[]; // Array of possible dice outcomes (e.g., [1, 2, 3, 4, 5, 6])
    isRollable: boolean;
    playerPosition: string; // Player ID

    constructor(numbers: number[], isRollable: boolean = true, playerPosition: string) {
        this.numbers = numbers;
        this.isRollable = isRollable;
        this.playerPosition = playerPosition;
    }

    /**
     * Attempts to roll the dice.
     * @returns boolean - true if the roll was successful (i.e., dice was rollable).
     */
    rollDice(): boolean {
        if (this.isRollable) {
            this.isRollable = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Prepares the dice for the next player's turn.
     * @param nextPlayerID - The ID of the player whose turn is next.
     */
    nextTurn(nextPlayerID: string): void {
        this.isRollable = true;
        this.playerPosition = nextPlayerID;
    }
}