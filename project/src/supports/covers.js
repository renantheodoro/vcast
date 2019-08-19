import Vue from "vue";

const M = require("materialize-css");

export default new Vue({
  data() {
    return {
      sidenavInstance: null
    };
  },

  methods: {
    hide_sidenav() {
      const M = require("materialize-css");
      const slide = document.getElementById("slide-out");

      if (!slide) return;

      const sidenavInstance = M.Sidenav.getInstance(slide);

      sidenavInstance.close();
    },

    show_sideslide(view) {
      this.$emit("shownSideslide", view);
      this.hide_sidenav();
    },

    show_sidesection(view) {
      this.$emit("shownSideSection", view);
      this.hide_sidenav();
    },

    hide_sidesection(view) {
      this.$emit("closeSideSection", view);
      this.hide_sidenav();
    },

    hide_sideslide() {
      this.$emit("hiddenSideslide");
    },

    hide_splashscreen() {
      if (process.env.VUE_APP_DEV == "false") {
        if (navigator.splashscreen) {
          navigator.splashscreen.hide();
        }
      }
    },

    onDeviceReady() {
      // Hide splash Screen
      setTimeout(function () {
        navigator.splashscreen.hide();
      }, 2000);
    }
  }
});