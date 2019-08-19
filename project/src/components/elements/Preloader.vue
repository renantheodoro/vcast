<template>
  <div v-if="visible" id="preloader-container">
    <loader />
    <br />
    <div v-if="$loader.loader_message != null" class="preloader-text">{{$loader.loader_message}}</div>
  </div>
</template>

<script>
import Loader from "@/components/elements/Loader";

export default {
  name: "Preloader",

  data() {
    return {
      visible: true
    };
  },

  mounted() {
    const self = this;

    self.$loader.$on("shown", status => {
      self.visible = status;
    });

    self.$loader.$on("hidden", status => {
      self.visible = status;
    });
  },

  components: { Loader }
};
</script>

<style lang="scss">
</style>
