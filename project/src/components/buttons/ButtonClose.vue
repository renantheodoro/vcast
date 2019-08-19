<template>
  <button @click.stop="emit">
    <i class="material-icons">close</i>
  </button>
</template>

<script>
export default {
  name: "ButtonClose",

  methods: {
    emit() {
      this.$emit("action");
    }
  }
};
</script>

<style lang="scss">
</style>
