<template>
  <div ref="fixed-action-btn" class="fixed-action-btn">
    <slot/>
    <div id="overlay"></div>
  </div>
</template>

<script>

export default {
  name: "ButtonFloating",

  mounted() {
    M.FloatingActionButton.init(this.$refs["fixed-action-btn"], {
      hoverEnabled: false
    });
  },
};
</script>

<style lang="scss">
</style>
