import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "clipboard/dist/clipboard.min.js";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

createApp(App).use(router).use(VueToast).mount("#app");
