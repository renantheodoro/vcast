import Vue from "vue";
import App from "./App.vue";

// Libs
import VueRouter from "vue-router";
import "@ionic/core/css/core.css";
import "@ionic/core/css/ionic.bundle.css";
import Ionic from "@ionic/vue";
import "material-icons/iconfont/material-icons.scss";
import * as signalR from "@aspnet/signalr";
import axios from "axios";
import VueAxios from "vue-axios";
import VueMask from "v-mask";
import Vue2TouchEvents from "vue2-touch-events";
import vuescroll from "vue-scroll";
import VueScroller from "vue-scroller";

// routes
const Routes = require("./views/" + process.env.VUE_APP_MODE + "/routes").default;

// Router definition
const router = new VueRouter({
  // mode: 'history',
  // linkActiveClass: "active",
  routes: Routes
});

/* LIBS imports */
const M = require("materialize-css");
var _ = require("lodash");

// Usages
Vue.use(VueRouter);
Vue.use(Ionic);
Vue.use(VueAxios, axios);
Vue.use(VueMask);
Vue.use(Vue2TouchEvents);
Vue.use(vuescroll);
Vue.use(VueScroller);

// Supports
Vue.prototype.$logger = require("./supports/logger").default;
Vue.prototype.$connection = require("./supports/connection").default;
Vue.prototype.$channel = require("./supports/channel").default;
Vue.prototype.$chat = require("./supports/chat").default;
Vue.prototype.$broadcasts = require("./supports/broadcast").default;
Vue.prototype.$helpers = require("./supports/helpers").default;
Vue.prototype.$loader = require("./supports/loader").default;
Vue.prototype.$messages = require("./supports/messages").default;
Vue.prototype.$covers = require("./supports/covers").default;
Vue.prototype.$login = require("./supports/login").default;

/* URL API */

const URLApi = process.env.VUE_APP_API_URL;
// const URLApi = "https://192.168.133.163/vCast.WebApi/"

Vue.prototype.$helpers.URL_API = URLApi;

// API definition
Vue.prototype.$apiRequest = new signalR.HubConnectionBuilder().withUrl(URLApi + "appRoom").build();
/* ---------------- */

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.path.indexOf("/chat") > -1)) {
    if (!to.params.broadcast) {
      next({
        name: "home"
      });
    } else {
      next();
    }
  } else {
    VDPlayer.Destroy();
    if(Vue.prototype.$broadcasts.current_broadcast) {
      Vue.prototype.$apiRequest.invoke("BroadcastOut", Vue.prototype.$broadcasts.current_broadcast.CodTransmissao);
      Vue.prototype.$logger.log("BroadcastOut", Vue.prototype.$broadcasts.current_broadcast.CodTransmissao);
    }
    next();
  }
});

/* Verificação por rota de login */
if (process.env.VUE_APP_MODE == "smartphone") {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      const authenticated = Vue.prototype.$login.getStatus();

      if (!authenticated) {
        next({
          name: "login"
        });

        return;
      }

      next();
    } else {
      next();
    }
  });
}

Vue.config.productionTip = false;

// Start
const app = new Vue({
  router,
  render: createEle => createEle(App)
});

app.$mount("#app");