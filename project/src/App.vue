<template>
  <div id="app">
    <preloader />
    <router-view />
  </div>
</template>

<script>
const basePath = process.env.VUE_APP_MODE; // tablet ou smartphone
const Base = require("@/views/" + basePath + "/Base.vue").default;
import Preloader from "@/components/elements/Preloader";

export default {
  name: "app",

  components: { Base, Preloader },

  methods: {
    onDeviceReady() {
      navigator.splashscreen.hide();
    }
  },

  mounted() {
    this.$nextTick(() => {
      document.addEventListener("deviceready", this.onDeviceReady, false);
    });
  }
};
</script>
