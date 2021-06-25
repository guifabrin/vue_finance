<template>
  <div
    class="modal fade"
    id="invoicesModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="invoicesModalLabel"
  >
    <div class="modal-dialog modal-xl" role="document">
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
          <h4 class="modal-title" id="invoicesModalLabel">
            {{ title }}
          </h4>
        </div>
        <div class="modal-body">
          <table
            class="table table-sm table-bordered table-striped"
            :class="!$root.light ? 'table-light' : 'table-dark'"
          >
            <thead>
              <th>{{ $t("common.id") }}</th>
              <th>{{ $t("common.debit_date") }}</th>
              <th>{{ $t("common.date_init") }}</th>
              <th>{{ $t("common.date_end") }}</th>
              <th>{{ $t("common.description") }}</th>
              <th>{{ $t("transactions.value") }}</th>
              <th>{{ $t("common.actions") }}</th>
            </thead>
            <tbody>
              <tr v-for="invoice in invoices" :key="invoice.id">
                <td>{{ invoice.id }}</td>
                <td>{{ $d(invoice.debit_date, "short") }}</td>
                <td>{{ $d(invoice.date_init, "short") }}</td>
                <td>{{ $d(invoice.date_end, "short") }}</td>
                <td>{{ invoice.description }}</td>
                <td v-html="formatMoney(invoice.value)"></td>
                <td>
                  <button
                    class="btn btn-danger"
                    v-on:click="deleteInvoice(invoice)"
                  >
                    <i class="fa fa-trash"></i>
                  </button>
                  <button
                    class="btn btn-info"
                    v-on:click="addTransaction(invoice)"
                  >
                    <i class="fa fa-plus"></i>
                  </button>
                  <button
                    class="btn btn-warning"
                    v-on:click="editInvoice(invoice)"
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
import { Modal } from "bootstrap";
let self = null;
export default {
  data() {
    return {
      account: null,
      invoices: [],
      title: "",
      $modal: null,
    };
  },
  mounted() {
    self = this;
    this.$modal = new Modal(document.getElementById("invoicesModal"));
  },
  methods: {
    closeModal() {
      this.$modal.hide();
    },
    formatMoney(value) {
      return this.$parent.formatMoney(value);
    },
    editInvoice() {
      /*this.$parent.$options.components.ModalTransaction.setTransaction(
        this.account,
        transaction
      );
      this.$parent.$options.components.ModalTransaction.show();*/
    },
    deleteInvoice() {
      /*const self = this;
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
        });*/
    },
    addTransaction(invoice) {
      this.$parent.$options.components.ModalTransaction.setTransaction(
        invoice.account,
        invoice
      );
      this.$parent.$options.components.ModalTransaction.show();
    },
  },
  setAccount(account) {
    self.account = account;
    self.invoices = account.invoices;
    self.title = `${self.$t("invoices.title")} - ${account.id}/${
      account.description
    }`;
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
