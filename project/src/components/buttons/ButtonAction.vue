<template>
  <button
    :type="type"
    @click.stop="emit($event)"
    @keyup="$emit('keyup', $event)"
    @keydown="$emit('keydown', $event)"
    class="button-action"
    :class="[color, {'full': full}, {'waves-effect': !disable}, {'waves-light' : color == 'blue'}]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: "ButtonAction",

  props: {
    color: {
      type: String,
      default: "blue"
    },
    full: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: "",
      required: false
    },
    disable: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  methods: {
    emit() {
      this.$emit("action");
    }
  }
};
</script>

