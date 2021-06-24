<template>
  <ListYears />
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
              <div v-html="formatMoney(invoice.value)"></div>
            </button>
            <button
              class="btn btn-link"
              v-if="
                !account.is_credit_card &&
                  account.getTransactionsAt(actual.year, month).length
              "
              v-on:click="viewTransactionsAt(account, actual.year, month)"
            >
              <div
                class="paid"
                v-html="formatMoney(account.getPaidAt(actual.year, month))"
              ></div>
              <div
                class="non"
                v-if="
                  account.getTransactionsAt(actual.year, month).length &&
                    account.getNonPaidAt(actual.year, month) != 0
                "
                v-html="formatMoney(account.getNonPaidAt(actual.year, month))"
              ></div>
              <div
                class="sum"
                v-if="
                  account.getSumAt(actual.year, month) !=
                    account.getPaidAt(actual.year, month)
                "
                v-html="formatMoney(account.getSumAt(actual.year, month))"
              ></div>
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
          ></th>
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
          ></th>
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
          ></th>
        </tr>
      </tfoot>
    </table>
  </div>
  <ModalTransactions />
</template>

<script>
import { Modal } from "bootstrap";
import ListYears from "./ListYears.vue";
import ModalTransactions from "./ModalTransactions.vue";
export default {
  name: "Accounts",
  components: {
    ListYears,
    ModalTransactions,
  },
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
    syncAccount(account, $event) {
      const self = this;
      let isafe = "";
      if (account.automated_body) {
        isafe = prompt("isafe");
        if (isafe.length != 6) {
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
    formatMoney(value) {
      const strValue = this.$n(value, "currency");
      const classe = value < 0 ? "negative" : "positive";
      return '<font class="' + classe + '">' + strValue + "</font>";
    },
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
