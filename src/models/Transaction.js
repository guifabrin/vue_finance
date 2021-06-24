export default class Transaction {
    constructor(objJson = {}, account, invoice = null) {
        this.account = account;
        this.invoice = invoice;
        for (const key in objJson) {
            switch (key) {
                case 'date':
                    {
                        const [yyyy, mm, dd] = objJson[key].split('-')
                        this[key] = new Date(yyyy, mm - 1, dd)
                    }
                    break;
                default:
                    this[key] = objJson[key];
                    break;
            }
        }
        this.acc_id = this.account.id
        this.acc_description = this.account.description
    }
}