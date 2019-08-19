<template>
  <button @click.stop="emit">
    <slot/>
  </button>
</template>

<script>
import Icon from "@/components/elements/Icon";

export default {
  name: "ButtonIcon",

  props: {},

  methods: {
    emit() {
      this.$emit("action");
    }
  },

  components: {
    Icon
  }
};
</script>

<style lang="scss">
</style>
