export default class Structure {
    // Explicitly define property types
    idStruc: string;
    positionID: string;
    type: 'settlement' | 'road' | 'city';

    constructor(idStruc: string, positionID: string, type: 'settlement' | 'road') {

        this.idStruc = idStruc;
        this.positionID = positionID;
        // The type is initially restricted to 'settlement' or 'road', but can be upgraded to 'city'.
        this.type = type;
    }

    // Upgrades a 'settlement' to a 'city'.
    upgrade(): boolean {
        if (this.type === 'settlement') {
            this.type = 'city';
            return true;
        } else {
            return false;
        }
    }
}