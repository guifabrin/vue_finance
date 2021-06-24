<template>
  <div class="table-responsive">
    <table class="table table-sm table-bordered table-striped table-light">
      <thead>
        <tr>
          <th>{{ $t("common.id") }}</th>
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
            {{ account.id }}
          </th>
          <th>
            {{ account.description }}<br />
            <button
              class="btn btn-primary"
              v-if="account.automated"
              v-on:click="syncAccount(account, $event)"
            >
              <i class="fa fa-sync"></i>
            </button>
            <button class="btn btn-danger" v-on:click="deleteAccount(account)">
              <i class="fa fa-trash"></i>
            </button>
            <button class="btn btn-warning" v-on:click="editAccount(account)">
              <i class="fa fa-edit"></i>
            </button>
            <button class="btn btn-info" v-on:click="addTransaction(account)">
              <i class="fa fa-plus"></i>
            </button>
            <!-- 
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
                  account.getTransactionsBefore(actual.year, month).length
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
                  account.getTransactionsBefore(actual.year, month).length &&
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
          <th colspan="2">{{ $t("accounts.totals_paid") }}:</th>
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
          <th colspan="2">{{ $t("accounts.totals_not_paid") }}:</th>
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
          <th colspan="2">{{ $t("accounts.totals") }}:</th>
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
</template>
<script>
export default {
  computed: {
    accounts() {
      return this.$root.accounts;
    },
    now() {
      return this.$parent.now;
    },
    actual() {
      return this.$parent.actual;
    },
  },
  data() {
    return {
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    };
  },
  methods: {
    formatMoney(value) {
      return this.$parent.formatMoney(value);
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
      this.$parent.$options.components.ModalTransaction.hide();
      this.oldAccount = account.id;
      this.oldYear = year;
      this.oldMonth = month;
      this.oldInvoice = null;
      this.$parent.$options.components.ModalTransactions.setAccount(
        account,
        year,
        month
      );
      this.$parent.$options.components.ModalTransactions.show();
    },
    viewTransactionsAtInvoice(invoice) {
      this.$parent.$options.components.ModalTransaction.hide();
      this.oldYear = null;
      this.oldMonth = null;
      this.oldInvoice = invoice.id;
      this.oldAccount = invoice.account.id;
      this.$parent.$options.components.ModalTransactions.setInvoice(
        invoice.account,
        invoice
      );
      this.$parent.$options.components.ModalTransactions.show();
    },
    deleteAccount(account) {
      const self = this;
      if (!confirm(this.$t("accounts.confirmation_text", account))) {
        return;
      }
      fetch("http://localhost:8888/api/v1/accounts/" + account.id, {
        method: "delete",
        headers: this.$root.headers,
        mode: "cors",
      })
        .then(() => {
          self.$parent.$parent.login();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
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
        headers: this.$root.headers,
        mode: "cors",
        body: isafe,
      })
        .then(() => {
          self.$parent.$parent.login();
          $event.target.classList.remove("spin");
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    editAccount(account) {
      this.$parent.$options.components.ModalAccount.setAccount(account);
      this.$parent.$options.components.ModalAccount.show();
    },
    addTransaction(account) {
      this.$parent.$options.components.ModalTransaction.setTransaction(account);
      this.$parent.$options.components.ModalTransaction.show();
    },
  },
};
</script>
<style scoped></style>
