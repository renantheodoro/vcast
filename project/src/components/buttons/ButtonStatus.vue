<template>
  <a id="button-status" ref="button-status" class="button-status" @click.stop="emit">
    <slot/>
  </a>
</template>

<script>
export default {
  name: "ButtonStatus",

  props: {
    status: Boolean
  },

  methods: {
    emit() {
      if (this.status) this.$emit("action");
    }
  },

  watch: {
    status(new_status) {
      if (new_status) {
        document.getElementById("button-status").classList.add("able");
        document.getElementById("button-status").classList.add("waves-effect");
        document.getElementById("button-status").classList.add("waves-light");
      } else {
        document.getElementById("button-status").classList.remove("able");
        document
          .getElementById("button-status")
          .classList.remove("waves-effect");
        document
          .getElementById("button-status")
          .classList.remove("waves-light");
      }
    }
  }
};
</script>

