export default class Structure {
    constructor(idStruc,positionID,type) {
        if (type !== 'settlement' && type !== 'road') {
            throw new Error("Invalid structure type. Must be 'settlement' or 'road'.");
        }

        this.idStruc = idStruc;
        this.positionID = positionID;
        this.type = type; // 'settlement' or 'city'
    }

    upgrade() {
        if (this.type === 'settlement') {
            this.type = 'city';
            return true;
        } else {
            return false;
        }
    }
}