<template>
  <header
    class="navbar sticky-top flex-md-nowrap shadow"
    :class="light ? 'bg-dark navbar-dark' : 'bg-light navbar-light'"
  >
    <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">{{
      $t("app.name")
    }}</a>
    <button
      class="navbar-toggler position-absolute d-md-none collapsed"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-nav">
      <div class="nav-item text-nowrap">
        <a class="nav-link px-3" href="#">{{
          user ? user.name : $t("login.login")
        }}</a>
      </div>
    </div>
  </header>
  <div :class="logged ? 'container-fluid' : 'container'">
    <div class="row" v-if="logged">
      <Sidebar />
      <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <br />
        <Accounts v-bind:accounts="accounts" v-if="page == 'accounts'" />
        <Charts v-bind:accounts="accounts" v-if="page == 'charts'" />
      </div>
    </div>
    <div v-if="!logged">
      <div class="row justify-content-md-center">
        <form class="col-md-4 bg-dark text-white">
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label"
              >Email address</label
            >
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              v-model="email"
            />
            <div id="emailHelp" class="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label"
              >Password</label
            >
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              v-model="password"
            />
          </div>
          <button type="button" class="btn btn-primary" v-on:click="login">
            <i class="fas fa-door-open" />
            Login
          </button>
        </form>
      </div>
    </div>
  </div>
  <loading v-model:active="isLoading" :is-full-page="true" />
</template>

<script>
let base64 = require("base-64");
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import Account from "./models/Account.js";
import Accounts from "./components/Accounts.vue";
import Charts from "./components/Charts.vue";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  components: {
    Accounts,
    Charts,
    Loading,
    Sidebar,
  },
  data: () => {
    return {
      isLoading: false,
      logged: false,
      email: "",
      passsword: "",
      accounts: null,
      headers: null,
      light: false,
      user: null,
      page: "accounts",
    };
  },
  methods: {
    fetchAcc: function() {
      this.isLoading = true;
      fetch("http://localhost:8888/api/v1/accounts", {
        method: "GET",
        headers: this.headers,
        mode: "cors",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message) {
            console.log("error");
          } else {
            this.logged = true;
            this.accounts = [];
            for (const objJson of json) {
              this.accounts.push(new Account(objJson));
            }
          }
          this.isLoading = false;
        })
        .catch((ex) => {
          console.log("error", ex);
          this.logged = false;
          this.isLoading = false;
        });
    },
    fetchUser: function() {
      this.isLoading = true;
      fetch("http://localhost:8888/api/v1/users/" + this.email, {
        method: "GET",
        headers: this.headers,
        mode: "cors",
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message) {
            console.log("error");
            this.logged = false;
          } else {
            this.user = json;
            this.isLoading = false;
            this.fetchAcc();
          }
        })
        .catch((ex) => {
          console.log("error", ex);
          this.logged = false;
          this.isLoading = false;
        });
    },
    login: function() {
      const auth = base64.encode(this.email + ":" + this.password);
      this.headers = new Headers();
      this.headers.append("Authorization", "Basic " + auth);
      this.fetchUser();
    },
  },
  watch: {
    light(old, newer) {
      console.log(old);
      if (newer) {
        document.body.classList.remove("dark");
      } else {
        document.body.classList.add("dark");
      }
    },
  },
};
</script>

<style>
* {
  border-radius: 0 !important;
}
img.logo {
  padding: 50px 0;
  width: 100px;
}
body {
  background-color: #00ff951a !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'%3E%3Cpolygon fill='%23cc0000' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%23aa0000' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%23d6002b' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%23b10022' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%23d9004b' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%23b2003d' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%23d3006c' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%23ac0057' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23c4008c' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%239e0071' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23aa00aa' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23880088' points='943 900 1210 900 971 687'/%3E%3C/svg%3E");
  background-attachment: fixed;
  background-size: cover;
}
body.dark {
  background-color: #1b1d1c !important;
}
</style>

<style scoped>
form {
  padding: 50px;
}
</style>
