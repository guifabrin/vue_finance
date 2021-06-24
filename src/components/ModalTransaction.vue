<template>
  <div
    class="modal fade"
    id="transactionModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="transactionModalLabel"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="btn btn-danger"
            data-dismiss="modal"
            aria-label="Close"
            v-on:click="closeModal()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" id="transactionModalLabel">
            {{ title }}
          </h4>
        </div>
        <div class="modal-body">
          <form class="col-md-12">
            <div class="mb-3">
              <label for="inputDescription" class="form-label">
                {{ $t("common.date") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="inputDescription"
                v-model="description"
              />
            </div>
            <div class="mb-3">
              <label for="inputDate" class="form-label">
                {{ $t("common.date") }}
              </label>
              <input
                type="date"
                class="form-control"
                id="inputDate"
                v-model="str_date"
              />
            </div>
            <div class="mb-3" v-if="account && account.is_credit_card">
              <label for="selectInvoice" class="form-label">
                {{ $t("transactions.invoice") }}
              </label>
              <select
                class="form-control"
                id="selectInvoice"
                v-model="invoice_id"
              >
                <!-- eslint-disable vue/require-v-for-key -->
                <option
                  v-for="invoice in account.invoices"
                  v-bind:value="invoice.id"
                >
                  {{ invoice.id }}/{{ invoice.description }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="inputValue" class="form-label">
                {{ $t("transactions.value") }}
              </label>
              <input
                type="number"
                class="form-control"
                id="inputValue"
                v-model="value"
              />
            </div>
            <div class="mb-3">
              <label for="inputCheckbox" class="form-label">
                {{ $t("transactions.paid") }}
              </label>
              <br />
              <input type="checkbox" id="inputCheckbox" v-model="paid" />
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="saveTransaction"
            >
              <i class="fas fa-save" />
              {{ $t("common.save") }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Modal } from "bootstrap";
let self = null;
export default {
  data() {
    return {
      account: null,
      description: "",
      invoice_id: null,
      paid: false,
      str_date: null,
      title: "",
      transaction: null,
      value: 0,
    };
  },
  mounted() {
    self = this;
    this.$modal = new Modal(document.getElementById("transactionModal"));
  },
  methods: {
    closeModal() {
      this.$modal.hide();
      this.account = null;
      this.description = "";
      this.invoice_id = null;
      this.paid = false;
      this.transaction = null;
      this.value = 0;
    },
    saveTransaction() {
      fetch(
        "http://localhost:8888/api/v1/transactions/" +
          (this.transaction ? this.transaction.id : ""),
        {
          method: this.transaction ? "PUT" : "POST",
          headers: this.$root.headers,
          mode: "cors",
          body: JSON.stringify({
            account_id: this.account.id,
            description: this.description,
            invoice_id: this.invoice_id,
            paid: this.paid ? 1 : 0,
            str_date: this.str_date,
            value: parseFloat(this.value),
          }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          self.closeModal();
          self.$root.login();
          self.$parent.$options.components.ModalTransactions.hide();
          self.description = "";
          self.invoice_id = null;
          self.paid = false;
          self.str_date = new Date();
          self.transaction = null;
          self.value = 0;
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
  setTransaction(account, transaction) {
    const date = transaction ? transaction.date : new Date();
    const int_month = date.getMonth();
    const month = (int_month > 9 ? "" : "0") + (int_month + 1);
    self.account = account;
    self.description = transaction ? transaction.description : "";
    self.invoice_id =
      transaction && transaction.invoice ? transaction.invoice.id : null;
    self.paid = transaction ? (transaction.paid == 1 ? true : false) : false;
    self.str_date = date.getFullYear() + "-" + month + "-" + date.getDate();
    self.transaction = transaction;
    self.value = transaction ? transaction.value : 0;
    self.title = transaction
      ? `${self.$t("common.edit")} ${self.$t("transactions.transaction")} ${
          transaction.id
        }/${transaction.description} - ${account.id}/${account.description}`
      : `${self.$t("common.add")} ${self.$t("transactions.transaction")} - ${
          account.id
        }/${account.description}`;
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
