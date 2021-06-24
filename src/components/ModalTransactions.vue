<template>
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
            {{ title }}
          </h4>
        </div>
        <div class="modal-body">
          <table
            class="table table-sm table-bordered table-striped table-light"
          >
            <thead>
              <th>{{ $t("common.id") }}</th>
              <th>{{ $t("common.date") }}</th>
              <th>{{ $t("common.description") }}</th>
              <th>{{ $t("transactions.value") }}</th>
              <th>{{ $t("transactions.paid") }}</th>
              <th>{{ $t("common.actions") }}</th>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{ transaction.id }}</td>
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
                  <button
                    class="btn btn-warning"
                    v-on:click="editTransaction(transaction)"
                  >
                    <i class="fa fa-edit"></i>
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
import Helpers from "../Helpers";
import { Modal } from "bootstrap";
let self = null;
export default {
  data() {
    return {
      account: null,
      transactions: [],
      title: "",
      $modal: null,
    };
  },
  mounted() {
    self = this;
    this.$modal = new Modal(document.getElementById("transactionsModal"));
  },
  methods: {
    closeModal() {
      this.$modal.hide();
    },
    formatMoney(value) {
      return this.$parent.formatMoney(value);
    },
    editTransaction(transaction) {
      this.$parent.$options.components.ModalTransaction.setTransaction(
        this.account,
        transaction
      );
      this.$parent.$options.components.ModalTransaction.show();
    },
    deleteTransaction(transaction) {
      const self = this;
      if (!confirm(this.$t("transactions.confirmation_text", transaction))) {
        return;
      }
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "DELETE",
        headers: this.$root.headers,
        mode: "cors",
      })
        .then((response) => response.json())
        .then(() => {
          self.closeModal();
          self.$root.login();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    payTransaction(transaction, $event) {
      const self = this;
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "PUT",
        headers: this.$root.headers,
        mode: "cors",
        body: JSON.stringify({ paid: $event.target.checked }),
      })
        .then((response) => response.json())
        .then(() => {
          self.$root.login();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
  setAccount(account, year, month) {
    self.account = account;
    self.transactions = account
      .getTransactionsAt(year, month)
      .sort(function(a, b) {
        return a.date - b.date;
      });

    const { dateInit, dateEnd } = Helpers.getPeriod(year, month);
    self.title = `${self.$t("transactions.title")} - ${account.id}/${
      account.description
    }; ${self.$d(dateInit, "short")} - ${self.$d(dateEnd, "short")}`;
  },
  setInvoice(account, invoice) {
    self.account = account;
    self.invoice = invoice;
    self.transactions = invoice.transactions.sort(function(a, b) {
      return a.date - b.date;
    });
    self.title = `${self.$t("transactions.title")} - ${account.id}/${
      account.description
    } - ${invoice.id}/${invoice.description} - ${self.$d(
      invoice.debit_date,
      "short"
    )}`;
  },
  hide() {
    self.$modal.hide();
  },
  show() {
    self.$modal.show();
  },
};
</script>
<style scoped></style>
