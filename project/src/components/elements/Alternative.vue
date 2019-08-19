<template>
  <button class="alternative" @click.stop="emit">
    <slot name="alternative_props" :alternative_props="alternative_props"/>
  </button>
</template>

<script>
export default {
  name: "Alternative",

  props: {
    text: String,
    right: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  data() {
    return {
      alternative_props: {
        text: this.text,
        right: this.right
      }
    };
  },

  methods: {
    emit() {
      this.$emit("action");
    }
  }
};
</script>

<style lang="scss">
</style>
