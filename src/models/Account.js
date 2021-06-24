import Transaction from './Transaction'
import Invoice from './Invoice'
import Helpers from '../Helpers';
export default class Account {
    invoices = []
    nonPaidValues = {};
    paidValues = {};
    transactions = [];
    constructor(objJson = {}) {
        for (const key in objJson) {
            switch (key) {
                case 'transactions':
                    for (const objTransaction of objJson['transactions'])
                        this.transactions.push(new Transaction(objTransaction, this))
                    break
                case 'invoices':
                    for (const objInvoice of objJson['invoices'])
                        this.invoices.push(new Invoice(objInvoice, this))
                    break;
                default:
                    this[key] = objJson[key];
                    break;
            }
        }
    }

    getPaidAt(year, month) {
        const { dateEnd } = Helpers.getPeriod(year, month)
        if (this.is_credit_card) {
            return this.invoices.filter(invoice => invoice.debit_date < dateEnd).map(invoice => invoice.value).reduce((a, b) => a + b, 0)
        }
        return this.transactions.filter((transaction) => transaction.date < dateEnd && transaction.paid).map(item => item.value).reduce((a, b) => a + b, 0);
    }

    getNonPaidAt(year, month) {
        if (this.is_credit_card) {
            return 0;
        }
        const { dateEnd } = Helpers.getPeriod(year, month)
        return this.transactions.filter((transaction) => transaction.date < dateEnd && !transaction.paid).map(item => item.value).reduce((a, b) => a + b, 0);
    }

    getSumAt(year, month) {
        if (this.is_credit_card) {
            return this.getPaid(year, month)
        }
        const { dateEnd } = Helpers.getPeriod(year, month)
        return this.transactions.filter((transaction) => transaction.date < dateEnd).map(item => item.value).reduce((a, b) => a + b, 0);
    }

    getInvoicesAt(year, month) {
        const { dateInit, dateEnd } = Helpers.getPeriod(year, month);
        return this.invoices.filter(invoice => invoice.debit_date >= dateInit && invoice.debit_date < dateEnd);
    }

    getTransactionsAt(year, month) {
        const { dateInit, dateEnd } = Helpers.getPeriod(year, month);
        return this.transactions.filter(transaction => transaction.date >= dateInit && transaction.date < dateEnd);
    }
    getTransactionsBefore(year, month) {
        const { dateEnd } = Helpers.getPeriod(year, month);
        return this.transactions.filter(transaction => transaction.date < dateEnd);
    }
}