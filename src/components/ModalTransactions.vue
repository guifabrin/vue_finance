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
            {{ modaltitle }}
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
export default {
  computed: {
    transactions() {
      return this.$parent.transactions;
    },
    modaltitle() {
      return this.$parent.modaltitle;
    },
  },
  methods: {
    closeModal($modal) {
      $modal.hide();
    },
    formatMoney(value) {
      return this.$parent.formatMoney(value);
    },
    editTransaction(transaction) {
      this.$parent.addTransaction(this.$parent.account, transaction);
    },
    deleteTransaction(transaction) {
      if (!confirm("Tem certeza?")) {
        return;
      }
      const self = this;
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "DELETE",
        headers: this.$parent.headers,
        mode: "cors",
      })
        .then((response) => response.json())
        .then(() => {
          self.$parent.$parent.login();
          if (self.oldInvoice) {
            self.$parent.viewTransactionsAt(
              self.$parent.accounts
                .filter((acc) => acc.id == self.oldAccount)[0]
                .invoices.filter((inv) => inv.id == self.oldInvoice)[0]
            );
          } else {
            self.$parent.viewTransactionsAt(
              self.$parent.accounts.filter(
                (acc) => acc.id == self.oldAccount
              )[0],
              self.oldYear,
              self.oldMonth
            );
          }
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
    payTransaction(transaction, $event) {
      const self = this;
      fetch("http://localhost:8888/api/v1/transactions/" + transaction.id, {
        method: "PUT",
        headers: this.$parent.headers,
        mode: "cors",
        body: JSON.stringify({ paid: $event.target.checked }),
      })
        .then((response) => response.json())
        .then(() => {
          self.$parent.$parent.login();
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
};
</script>
<style scoped></style>
