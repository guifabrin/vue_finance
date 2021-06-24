<template>
  <div
    class="modal fade"
    id="transactionModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="transactionModalLabel"
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
          <h4 class="modal-title" id="transactionModalLabel">
            {{ modaltitle }}
          </h4>
        </div>
        <div class="modal-body">
          <form class="col-md-3">
            <div class="mb-3">
              <label for="inputDescription" class="form-label"
                >Description</label
              >
              <input
                type="text"
                class="form-control"
                id="inputDescription"
                aria-describedby="descriptionHelp"
                v-model="description"
              />
              <div id="descriptionHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="inputDate" class="form-label">Date</label>
              <input
                type="date"
                class="form-control"
                id="inputDate"
                aria-describedby="dateHelp"
                v-model="strdate"
              />
              <div id="dateHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3" v-if="account && account.is_credit_card">
              <label for="selectInvoice" class="form-label">Invoice</label>
              <select
                class="form-control"
                id="selectInvoice"
                aria-describedby="invoiceHelp"
                v-model="invoice_id"
              >
                <!-- eslint-disable vue/require-v-for-key -->
                <option
                  v-for="invoice in account.invoices"
                  v-bind:value="invoice.id"
                >
                  {{ invoice.description }}
                </option>
              </select>
              <div id="invoiceHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="inputValue" class="form-label">Value</label>
              <input
                type="number"
                class="form-control"
                id="inputValue"
                aria-describedby="valueHelp"
                v-model="value"
              />
              <div id="valueHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="inputCheckbox" class="form-label">Is paid</label>
              <input type="checkbox" id="inputCheckbox" v-model="paid" />
            </div>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="addTransaction"
            >
              <i class="fas fa-door-open" />
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let self = "";
export default {
  data() {
    return {
      description: this.account ? this.account.description : "",
      paid: this.account ? this.account.is_credit_card : false,
      $modal: this.$parent.$transactionModal,
      transaction: null,
      invoice_id: null,
      strdate: null,
      value: 0,
      account: null,
    };
  },
  computed: {
    modaltitle() {
      return "";
    },
  },
  mounted() {
    self = this;
  },
  methods: {
    closeModal($modal) {
      this.transaction = null;
      this.paid = false;
      this.description = "";
      this.invoice_id = null;
      this.value = 0;
      this.account = null;
      $modal.hide();
    },
    addTransaction() {
      fetch(
        "http://localhost:8888/api/v1/transactions/" +
          (this.transaction ? this.transaction.id : ""),
        {
          method: this.transaction ? "PUT" : "POST",
          headers: this.$parent.headers,
          mode: "cors",
          body: JSON.stringify({
            paid: this.paid ? 1 : 0,
            description: this.description,
            invoice_id: this.invoice_id,
            value: parseFloat(this.value),
            strdate: this.strdate,
            account_id: this.account.id,
          }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          self.$parent.$parent.login();
          self.$parent.$transactionModal.hide();
          self.transaction = null;
          self.paid = false;
          self.description = "";
          self.invoice_id = null;
          self.value = 0;
          self.strdate = new Date();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
  acctransaction(account, transaction) {
    self.description = transaction ? transaction.description : "";
    self.invoice_id = transaction ? transaction.invoice.id : null;
    const date = transaction ? transaction.date : new Date();
    self.strdate =
      date.getFullYear() +
      "-" +
      (date.getMonth() > 9 ? "" : "0") +
      (date.getMonth() + 1) +
      "-" +
      date.getDate();
    self.value = transaction ? transaction.value : 0;
    self.paid = transaction ? (transaction.paid == 1 ? true : false) : false;
    self.transaction = transaction;
    self.account = account;
  },
};
</script>
<style scoped></style>
