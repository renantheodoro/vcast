<template>
  <button type="submit" class="button-send waves-effect waves-light" @click.stop="$emit('action')">
    <slot/>
  </button>
</template>

<script>
export default {
  name: "ButtonSend"
};
</script>