<template>
  <div class="square" :style="style"></div>
</template>

<script>
export default {
  name: "Square",

  props: {
    top: {
      type: String,
      default: "auto"
    },

    right: {
      type: String,
      default: "auto"
    },

    bottom: {
      type: String,
      default: "auto"
    },

    left: {
      type: String,
      default: "auto"
    },

    size: {
      type: String,
      default: "80px"
    },

    color: {
      type: String
    }
  },

  computed: {
    style() {
      return {
        top: this.top,
        left: this.left,
        right: this.right,
        bottom: this.bottom,
        width: this.size,
        height: this.size,
        backgroundColor: this.color
      };
    }
  }
};
</script>

<style lang="scss">
</style>
