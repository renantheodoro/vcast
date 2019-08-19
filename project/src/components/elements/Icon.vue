<template>
  <span>
    <i class="material-icons">{{name}}</i>
  </span>
</template>

<script>
export default {
  name: "Icon",

  props: {
    type: String,
    name: String
  },

  mounted() {}
};
</script>