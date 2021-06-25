<template>
  <button
    v-on:click="addAccount()"
    class="btn btn-primary"
    style="float:right;"
  >
    <i class="fas fa-plus" />
  </button>
  <ListYears />
  <TableAccounts />
  <ModalTransactions />
  <ModalAccount />
  <ModalTransaction />
</template>

<script>
import ListYears from "./ListYears.vue";
import TableAccounts from "./TableAccounts.vue";
import ModalTransactions from "./ModalTransactions.vue";
import ModalAccount from "./ModalAccount.vue";
import ModalTransaction from "./ModalTransaction.vue";
const now = new Date();
export default {
  name: "Accounts",
  components: {
    ListYears,
    ModalTransactions,
    TableAccounts,
    ModalAccount,
    ModalTransaction,
  },
  props: {
    accounts: [],
  },
  data: () => {
    return {
      actual: {
        year: now.getUTCFullYear(),
        month: now.getMonth(),
      },
      now: {
        year: now.getUTCFullYear(),
      },
      $accountModal: null,
      $transactionModal: null,
      $transactionsModal: null,
    };
  },
  methods: {
    formatMoney(value) {
      const strValue = this.$n(value, "currency");
      const classe = Math.round(value) < 0 ? "negative" : "positive";
      return '<font class="' + classe + '">' + strValue + "</font>";
    },
    addAccount() {
      this.$options.components.ModalAccount.setAccount();
      this.$options.components.ModalAccount.show();
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
body.dark .negative {
  color: #f33c3c;
}
body.dark .positive {
  color: #29a929;
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
