<template>
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="year in years()" :key="year">
      <a
        class="nav-link"
        :class="actual.year == year ? 'active' : ''"
        href="#"
        aria-current="page"
        v-on:click="actual.year = year"
        >{{ year }}</a
      >
    </li>
  </ul>
  <div class="table-responsive">
    <table class="table table-sm table-bordered table-striped">
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
            {{ account.description }}
            <button class="btn btn-warning btn-iframe" href="#">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-danger"><i class="fa fa-trash"></i></button>
            <button class="btn btn-info"><i class="fa fa-upload"></i></button>
            <a class="btn btn-secondary" href="#" v-if="account.is_credit_card">
              <i class="fas fa-receipt"></i>
            </a>
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
              href="#"
              v-if="account.is_credit_card"
              v-for="invoice in account.getInvoicesAt(actual.year, month)"
              :key="invoice.id"
              v-on:click="viewTransactionsAtInvoice(invoice)"
            >
              <div>
                {{$n(invoice.value, 'currency')}}
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
              <div class="paid">
                {{ $n(account.getPaidAt(actual.year, month), "currency") }}
              </div>
              <div
                class="non"
                v-if="
                  account.getTransactionsAt(actual.year, month).length &&
                    account.getNonPaidAt(actual.year, month) != 0
                "
              >
                {{ $n(account.getNonPaidAt(actual.year, month), "currency") }}
              </div>
              <div
                class="sum"
                v-if="
                  account.getSumAt(actual.year, month) !=
                    account.getPaidAt(actual.year, month)
                "
              >
                {{ $n(account.getSumAt(actual.year, month), "currency") }}
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
          >
            {{ $n(sumPaid(month), 'currency') }}
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
          >
            {{ $n(sumNonPaid(month), 'currency') }}
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
          >
            {{ $n(sumNonPaid(month) + sumPaid(month), 'currency') }}
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
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="transactionsModalLabel">New message</h4>
        </div>
        <div class="modal-body">
          <table class="table table-sm table-bordered table-striped">
            <thead>
              <th>{{ $t("common.date") }}</th>
              <th>{{ $t("common.description") }}</th>
              <th>{{ $t("transactions.value") }}</th>
              <th>{{ $t("transactions.paid") }}</th>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ $d(transaction.date, "short") }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ $n(transaction.value, "currency") }}</td>
                <td>
                  <input
                    type="checkbox"
                    :checked="transaction.paid || transaction.invoice"
                    :disabled="transaction.invoice != null"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary">Send message</button>
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
  },
  data: () => {
    return {
      transactions: [],
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      actual: {
        year: new Date().getUTCFullYear(),
        month: 5,
      },
      now: {
        year: new Date().getUTCFullYear(),
      },
    };
  },
  methods: {
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
          .reduce((a, b) => a + b, 0)
      ;
    },
    sumNonPaid(month) {
      
      return         this.accounts
          .map((account) => account.getNonPaidAt(this.actual.year, month))
          .reduce((a, b) => a + b, 0)
      ;
    },
    viewTransactionsAt(account, year, month) {
      this.transactions = account.getTransactionsAt(year, month);
      new Modal(document.getElementById("transactionsModal")).show();
    },
    viewTransactionsAtInvoice(invoice) {
      this.transactions = invoice.transactions;
      new Modal(document.getElementById("transactionsModal")).show();
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
</style>
