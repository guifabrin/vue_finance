<template>
  <div
    class="modal fade"
    id="accountsModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="accountsModalLabel"
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
          <h4 class="modal-title" id="accountsModalLabel">
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
                aria-describedby="emailHelp"
                v-model="description"
              />
              <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="inputCheckbox" class="form-label"
                >Is Credit Card</label
              >
              <input
                type="checkbox"
                id="inputCheckbox"
                v-model="is_credit_card"
              />
            </div>
            <button
              type="button"
              class="btn btn-primary"
              v-on:click="addAccount"
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
export default {
  data() {
    return {
      description: "",
      is_credit_card: false,
      $modal: this.$parent.$accountModal,
    };
  },
  computed: {
    account() {
      return this.$parent.account;
    },
    modaltitle() {
      return "";
    },
  },
  methods: {
    closeModal($modal) {
      $modal.hide();
    },
    formatMoney(value) {
      return this.$parent.formatMoney(value);
    },
    addAccount() {
      const self = this;
      fetch(
        "http://localhost:8888/api/v1/accounts/" +
          (this.account ? this.account.id : ""),
        {
          method: this.account ? "PUT" : "POST",
          headers: this.$parent.headers,
          mode: "cors",
          body: JSON.stringify({
            description: this.description,
            is_credit_card: this.is_credit_card,
          }),
        }
      )
        .then((response) => response.json())
        .then(() => {
          self.$parent.$parent.login();
          self.$parent.$accountModal.hide();
          self.description = "";
          self.is_credit_card = "";
        })
        .catch((ex) => {
          console.log("error", ex);
        });
    },
  },
};
</script>
<style scoped></style>
