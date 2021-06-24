<template>
  <div
    class="modal fade"
    id="accountsModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="accountsModalLabel"
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
          <h4 class="modal-title" id="accountsModalLabel">
            {{ title }}
          </h4>
        </div>
        <div class="modal-body">
          <form class="col-md-12">
            <div class="mb-3">
              <label for="inputDescription" class="form-label">
                {{ $t("common.description") }}
              </label>
              <input
                type="text"
                class="form-control"
                id="inputDescription"
                v-model="description"
              />
            </div>
            <div class="mb-3">
              <label for="inputCheckbox" class="form-label">
                {{ $t("accounts.is_credit_card") }}
              </label>
              <br />
              <input
                type="checkbox"
                id="inputCheckbox"
                v-model="is_credit_card"
              />
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="saveAccount"
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
let self = null;
import { Modal } from "bootstrap";
export default {
  data() {
    return {
      account: null,
      description: "",
      is_credit_card: false,
      title: "",
      $modal: null,
    };
  },
  mounted() {
    self = this;
    this.$modal = new Modal(document.getElementById("accountsModal"));
  },
  methods: {
    closeModal() {
      this.$modal.hide();
      this.account = null;
      this.description = "";
      this.is_credit_card = false;
    },
    saveAccount() {
      fetch(
        "http://localhost:8888/api/v1/accounts/" +
          (this.account ? this.account.id : ""),
        {
          method: this.account ? "PUT" : "POST",
          headers: this.$root.headers,
          mode: "cors",
          body: JSON.stringify({
            description: this.description,
            is_credit_card: this.is_credit_card,
          }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          self.closeModal();
          self.$root.login();
          self.account = null;
          self.description = "";
          self.is_credit_card = false;
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
  setAccount(account) {
    self.account = account;
    self.description = account ? account.description : "";
    self.is_credit_card = account ? account.is_credit_card : false;
    self.title = account
      ? `${self.$t("common.edit")} ${self.$t("accounts.account")} ${
          account.id
        }/${account.description}`
      : `${self.$t("common.add")} ${self.$t("accounts.account")}`;
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
