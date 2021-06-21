<template>
  <Accounts v-if="logged" v-bind:accounts="accounts"/>
  <div v-if="!logged">
    <input type="email" v-model="email">
    <input type="password" v-model="password">
    <button v-on:click="login">Login</button>
  </div>
</template>

<script>
let base64 = require("base-64");
import Account from './models/Account.js'
import Accounts from './components/Accounts.vue'

export default {
  name: 'App',
  components: {
    Accounts
  },
  data: () =>{
    return {
      logged : false,
      email:'',
      passsword:'',
      accounts: null
    }
  },
  methods: {
    login: function () {
      const auth = base64.encode(this.email + ":" + this.password)
      let headers = new Headers();
      headers.append(
        "Authorization",
        "Basic " + auth
      );
      fetch('http://localhost:8888/api/v1/accounts', {
        method: "GET",
        headers: headers,
        mode: 'cors',
      })
        .then((response) => response.json())
        .then((json) => {
          if (json.message){
            console.log("error");
            this.logged  = false
          } else {
            this.accounts = [];
            for (const objJson of json){
              this.accounts.push(new Account(objJson))
            }
            this.logged  = true
            window.location.hash = auth;
          }
        })
        .catch((ex) => {
          console.log("error", ex);
          this.logged  = false
      });
    },
  },
  mounted(){
    if (window.location.hash){
      [this.email, this.password] = base64.decode(window.location.hash.substring(1)).split(':');
      this.login()
    }
  }
}
</script>

<style>
* {
  border-radius: 0 !important;
}
</style>
