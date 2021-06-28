<template>
  <div
    class="modal fade"
    id="invoiceModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="invoiceModalLabel"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div
        class="modal-content"
        :class="!$root.light ? 'bg-light' : 'bg-dark text-light'"
      >
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
          <h4 class="modal-title" id="invoiceModalLabel">
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
                {{ $t("invoices.debit_date") }}
              </label>
              <input
                type="date"
                class="form-control"
                id="inputDate"
                v-model="str_debit_date"
              />
            </div>
            <div class="mb-3">
              <label for="inputDate" class="form-label">
                {{ $t("invoices.date_init") }}
              </label>
              <input
                type="date"
                class="form-control"
                id="inputDate"
                v-model="str_date_init"
              />
            </div>
            <div class="mb-3">
              <label for="inputDate" class="form-label">
                {{ $t("invoices.date_end") }}
              </label>
              <input
                type="date"
                class="form-control"
                id="inputDate"
                v-model="str_date_end"
              />
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="saveInvoice"
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
import Helpers from "../Helpers";
let self = null;
export default {
  data() {
    return {
      account: null,
      description: "",
      str_debit_date: null,
      str_date_init: null,
      str_date_end: null,
      title: "",
      invoice: null,
    };
  },
  mounted() {
    self = this;
    this.$modal = new Modal(document.getElementById("invoiceModal"));
  },
  methods: {
    closeModal() {
      this.$modal.hide();
      this.account = null;
      this.description = "";
      this.invoice = null;
      this.str_debit_date = null;
      this.str_date_init = null;
      this.str_date_end = null;
    },
    saveInvoice() {
      fetch(
        "http://localhost:8888/api/v1/invoices/" +
          (this.invoice ? this.invoice.id : ""),
        {
          method: this.invoice ? "PUT" : "POST",
          headers: this.$root.headers,
          mode: "cors",
          body: JSON.stringify({
            account_id: this.account.id,
            description: this.description,
            str_debit_date: this.str_debit_date,
            str_date_init: this.str_date_init,
            str_date_end: this.str_date_end,
          }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          self.closeModal();
          self.$root.fetchAcc();
          self.$parent.$options.components.ModalInvoices.hide();
          self.account = null;
          self.description = "";
          self.invoice = null;
          self.str_debit_date = null;
          self.str_date_init = null;
          self.str_date_end = null;
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
  setInvoice(account, invoice) {
    const debit_date = invoice ? invoice.debit_date : new Date();
    const date_init = invoice ? invoice.date_init : new Date();
    const date_end = invoice ? invoice.date_end : new Date();
    const int_debit_date_month = debit_date.getMonth() + 1;
    const debit_date_month = Helpers.padZeroLeft(int_debit_date_month);
    const int_date_init_month = date_init.getMonth() + 1;
    const date_init_month = Helpers.padZeroLeft(int_date_init_month);
    const int_date_end_month = date_end.getMonth() + 1;
    const date_end_month = Helpers.padZeroLeft(int_date_end_month);
    self.account = account;
    self.description = invoice ? invoice.description : "";
    self.title = invoice
      ? `${self.$t("common.edit")} ${self.$t("invoices.invoice")} ${
          invoice.id
        }/${invoice.description} - ${account.id}/${account.description}`
      : `${self.$t("common.add")} ${self.$t("invoices.invoice")} - ${
          account.id
        }/${account.description}`;
    self.str_debit_date =
      debit_date.getFullYear() +
      "-" +
      debit_date_month +
      "-" +
      Helpers.padZeroLeft(debit_date.getDate());
    self.str_date_init =
      date_init.getFullYear() +
      "-" +
      date_init_month +
      "-" +
      Helpers.padZeroLeft(date_init.getDate());
    self.str_date_end =
      date_end.getFullYear() +
      "-" +
      date_end_month +
      "-" +
      Helpers.padZeroLeft(date_end.getDate());
    self.invoice = invoice;
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
