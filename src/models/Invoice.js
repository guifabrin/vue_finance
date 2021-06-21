import Transaction from './Transaction'
export default class Invoice {
    transactions = [];
    constructor(objJson = {}, account) {
        this.account = account;
        for (const key in objJson) {
            switch (key) {
                case 'debit_date':
                    this[key] = new Date(objJson[key]);
                    break;
                case 'transactions':
                    for (const objTransaction of objJson['transactions'])
                        this.transactions.push(new Transaction(objTransaction, this.account, this))
                    break
                default:
                    this[key] = objJson[key];
                    break;
            }
        }
    }

    get value() {
        return this.transactions.map(item => item.value).reduce((a, b) => a + b, 0);
    }
}