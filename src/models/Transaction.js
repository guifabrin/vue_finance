export default class Transaction {
    constructor(objJson = {}, account, invoice = null) {
        this.account = account;
        this.invoice = invoice;
        for (const key in objJson) {
            switch (key) {
                case 'date':
                    this[key] = new Date(objJson[key]);
                    break;
                default:
                    this[key] = objJson[key];
                    break;
            }
        }
    }
}