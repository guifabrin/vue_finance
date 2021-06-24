import Transaction from './Transaction'
export default class Invoice {
    transactions = [];
    constructor(objJson = {}, account) {
        this.account = account;
        for (const key in objJson) {
            switch (key) {
                case 'debit_date':
                    {
                        const [yyyy, mm, dd] = objJson[key].split('-')
                        this[key] = new Date(yyyy, mm - 1, dd)
                    }
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
        const invoices = this.account.invoices.sort((invoice, invoice1) => invoice1.debit_date - invoice.debit_date).filter(invoice => invoice.debit_date < this.debit_date)
        const ii = invoices[0]
        return this.transactions.map(item => item.value).reduce((a, b) => a + b, 0) + (ii ? ii.value : 0);
    }
}