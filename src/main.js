import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createI18n } from 'vue-i18n'
import t from './i18n/pt-BR.json'
t.locale = navigator.language.split('-')[0]
const i18n = createI18n(t)
const app = createApp(App);
app.use(i18n)
app.mount('#app')