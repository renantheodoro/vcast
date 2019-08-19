<template>
  <footer :id="id" :class="footerClass">
    <slot />
  </footer>
</template>

<script>
export default {
  name: "Footer",

  props: {
    id: String,
    footerClass: {
      type: String,
      required: false
    }
  }
};
</script>