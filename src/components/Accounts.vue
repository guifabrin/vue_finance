<template>
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="year in years()" :key="year">
      <a
        class="nav-link"
        :class="actual.year == year ? 'active' : ''"
        aria-current="page"
        v-on:click="actual.year = year"
        >{{ year }}</a
      >
    </li>
  </ul>
  <div class="table-responsive">
    <table class="table table-sm table-bordered table-striped table-light">
      <thead>
        <tr>
          <th>{{ $t("common.description") }}</th>
          <th
            :class="
              now.year == actual.year && month == actual.month
                ? 'table-active'
                : ''
            "
            v-for="month in months"
            :key="month"
          >
            {{ $t("common.months." + month) }} {{ $t("common.money_type") }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="account in accounts" :key="account.id">
          <th>
            {{ account.description }}<br />
            <button
              class="btn btn-primary"
              v-if="account.automated"
              v-on:click="syncAccount(account, $event)"
            >
              <i class="fa fa-sync"></i>
            </button>
            <!-- <button class="btn btn-warning">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-danger"><i class="fa fa-trash"></i></button>
            <button class="btn btn-info"><i class="fa fa-upload"></i></button>
            <a class="btn btn-secondary" v-if="account.is_credit_card">
              <i class="fas fa-receipt"></i>
            </a> -->
          </th>
          <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
          <td
            :class="
              now.year == actual.year && month == actual.month
                ? 'table-active'
                : ''
            "
            v-for="month in months"
            :key="month"
          >
            <button
              class="btn btn-link"
              v-if="account.is_credit_card"
              v-for="invoice in account.getInvoicesAt(actual.year, month)"
              :key="invoice.id"
              v-on:click="viewTransactionsAtInvoice(invoice)"
            >
              <div v-html="formatMoney(invoice.value)">
              </div>
            </button>
            <button
              class="btn btn-link"
              v-if="
                !account.is_credit_card &&
                  account.getTransactionsAt(actual.year, month).length
              "
              v-on:click="viewTransactionsAt(account, actual.year, month)"
            >
              <div class="paid" v-html="formatMoney(account.getPaidAt(actual.year, month))">
              </div>
              <div
                class="non"
                v-if="
                  account.getTransactionsAt(actual.year, month).length &&
                    account.getNonPaidAt(actual.year, month) != 0
                "
                v-html="formatMoney(account.getNonPaidAt(actual.year, month))"
              >
              </div>
              <div
                class="sum"
                v-if="
                  account.getSumAt(actual.year, month) !=
                    account.getPaidAt(actual.year, month)
                "
               v-html="formatMoney(account.getSumAt(actual.year, month))">
              </div>
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th>{{ $t("accounts.totals_paid") }}:</th>
          <th
            :class="
              now.year == actual.year && month == actual.month
                ? 'table-active'
                : ''
            "
            class="text-right"
            v-for="month in months"
            :key="month"
            v-html="formatMoney(sumPaid(month))"
          >
          </th>
        </tr>
        <tr>
          <th>{{ $t("accounts.totals_not_paid") }}:</th>
          <th
            :class="
              now.year == actual.year && month == actual.month
                ? 'table-active'
                : ''
            "
            class="text-right"
            v-for="month in months"
            :key="month"
            v-html="formatMoney(sumNonPaid(month))"
          >
          </th>
        </tr>
        <tr>
          <th>{{ $t("accounts.totals") }}:</th>
          <th
            :class="
              now.year == actual.year && month == actual.month
                ? 'table-active'
                : ''
            "
            class="text-right"
            v-for="month in months"
            :key="month"
            v-html="formatMoney(sumNonPaid(month) + sumPaid(month))"
          >
          </th>
        </tr>
      </tfoot>
    </table>
  </div>

  <div
    class="modal fade"
    id="transactionsModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="transactionsModalLabel"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn btn-danger"
            data-dismiss="modal"
            aria-label="Close"
            v-on:click="closeModal($modal)"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="transactionsModalLabel">
            {{ modaltitle }}
          </h4>
        </div>
        <div class="modal-body">
          <table
            class="table table-sm table-bordered table-striped table-light"
          >
            <thead>
              <th>{{ $t("common.date") }}</th>
              <th>{{ $t("common.description") }}</th>
              <th>{{ $t("transactions.value") }}</th>
              <th>{{ $t("transactions.paid") }}</th>
              <th>{{ $t("common.actions") }}</th>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ $d(transaction.date, "short") }}</td>
                <td>{{ transaction.description }}</td>
                <td v-html="formatMoney(transaction.value)"></td>
                <td>
                  <input
                    type="checkbox"
                    :checked="transaction.paid || transaction.invoice"
                    :disabled="transaction.invoice != null"
                    v-on:click="payTransaction(transaction, $event)"
                  />
                </td>
                <td>
                  <button
                    class="btn btn-danger"
                    v-on:click="deleteTransaction(transaction)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
export default {
  name: "Accounts",
  props: {
    accounts: [],
    headers: null,
  },
  data: () => {
    return {
      transactions: [],
      modaltitle: "",
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      actual: {
        year: new Date().getUTCFullYear(),
        month: 5,
      },
      now: {
        year: new Date().getUTCFullYear(),
      },
      $modal: null,
    };
  },
  mounted() {
    this.$modal = new Modal(document.getElementById("transactionsModal"));
  },
  methods: {
    closeModal($modal) {
      $modal.hide();
    },
    years() {
      const years = [];
      const yearDiff = this.now.year - this.actual.year;
      let j = 10 - yearDiff;
      if (j <= 0) {
        j = 1;
      }
      for (let i = this.actual.year - j; i <= this.actual.year; i++) {
        years.push(i);
      }
      if (this.actual.year < this.now.year) {
        for (let i = this.actual.year + 1; i <= this.now.year; i++) {
          years.push(i);
        }
      }
      return years;
    },
    sumPaid(month) {
      return this.accounts
        .map((account) => account.getPaidAt(this.actual.year, month))
        .reduce((a, b) => a + b, 0);
    },
    sumNonPaid(month) {
      return this.accounts
        .map((account) => account.getNonPaidAt(this.actual.year, month))
        .reduce((a, b) => a + b, 0);
    },
    viewTransactionsAt(account, year, month) {
      this.$modal.hide();
      this.oldAccount = account.id;
      this.oldYear = year;
      this.oldMonth = month;
      this.oldInvoice = null;
      this.transactions = account
        .getTransactionsAt(year, month)
        .sort(function(a, b) {
          return a.date - b.date;
        });
      this.modaltitle = account.description + " " + month + "/" + year;
      this.$modal.show();
    },
    viewTransactionsAtInvoice(invoice) {
      this.$modal.hide();
      this.oldYear = null;
      this.oldMonth = null;
      this.oldInvoice = invoice.id;
      this.oldAccount = invoice.account.id;
      this.transactions = invoice.transactions;
      this.$modal.show();
      this.modaltitle =
        invoice.description +
        " " +
        invoice.debit_date.getUTCMonth() +
        "/" +
        invoice.debit_date.getUTCFullYear();
    },
    deleteTransaction(transaction) {
      if (!confirm("Tem certeza?")) {
        return;
      }
      const self = this;
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "DELETE",
        headers: this.headers,
        mode: "cors",
      })
        .then((response) => response.json())
        .then(() => {
          self.$parent.login();
          if (self.oldInvoice) {
            self.viewTransactionsAt(
              self.accounts
                .filter((acc) => acc.id == self.oldAccount)[0]
                .invoices.filter((inv) => inv.id == self.oldInvoice)[0]
            );
          } else {
            self.viewTransactionsAt(
              self.accounts.filter((acc) => acc.id == self.oldAccount)[0],
              self.oldYear,
              self.oldMonth
            );
          }
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    payTransaction(transaction, $event) {
      const self = this;
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "PUT",
        headers: this.headers,
        mode: "cors",
        body: JSON.stringify({ paid: $event.target.checked }),
      })
        .then((response) => response.json())
        .then(() => {
          self.$parent.login();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    syncAccount(account, $event) {
      const self = this;
      let isafe ='';
      if (account.automated_body){
        isafe = prompt("isafe")
        if (isafe.length!=6){
          return;
        }
      }
      $event.target.classList.add("spin");
      fetch("http://localhost:8888/api/v1/automated/" + account.id, {
        method: "POST",
        headers: this.headers,
        mode: "cors",
        body: isafe,
      })
        .then(() => {
          self.$parent.login();
          $event.target.classList.remove("spin");
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    formatMoney(value){
      const strValue = this.$n(value, 'currency')
      const classe = value< 0?'negative': 'positive'
      return '<font class="'+classe+'">'+strValue+'</font>'
    }
  },
};
</script>

<style>
.negative {
  color: #bf0606;
}
.positive {
  color: #0e4a0e;
}
@import url("https://use.fontawesome.com/releases/v5.0.13/css/all.css");

table.table td {
  text-align: right;
}

table.table td div {
  text-align: right;
}
table.table td .btn,
table.table th .btn {
  padding: 1px 6px;
  float: right;
}
button.spin i,
i.spin {
  animation-name: spin;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  /* transform: rotate(3deg); */
  /* transform: rotate(0.3rad);/ */
  /* transform: rotate(3grad); */
  /* transform: rotate(.03turn);  */
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
