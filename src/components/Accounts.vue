<template>
  <ListYears />
  <TableAccounts />
  <ModalTransactions />
  <button v-on:click="addAccount()"></button>
  <ModalAccount />
</template>

<script>
import { Modal } from "bootstrap";
import ListYears from "./ListYears.vue";
import TableAccounts from "./TableAccounts.vue";
import ModalTransactions from "./ModalTransactions.vue";
import ModalAccount from "./ModalAccount.vue";
export default {
  name: "Accounts",
  components: {
    ListYears,
    ModalTransactions,
    TableAccounts,
    ModalAccount,
  },
  props: {
    accounts: [],
    headers: null,
  },
  data: () => {
    return {
      transactions: [],
      modaltitle: "",
      actual: {
        year: new Date().getUTCFullYear(),
        month: 5,
      },
      now: {
        year: new Date().getUTCFullYear(),
      },
      $modal: null,
      $accountModal: null,
    };
  },
  mounted() {
    this.$modal = new Modal(document.getElementById("transactionsModal"));
    this.$accountModal = new Modal(document.getElementById("accountsModal"));
  },
  methods: {
    formatMoney(value) {
      const strValue = this.$n(value, "currency");
      const classe = value < 0 ? "negative" : "positive";
      return '<font class="' + classe + '">' + strValue + "</font>";
    },
    addAccount() {
      this.$accountModal.show();
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
