<template>
  <header v-if="!landscape" id="header" :class="{'none': $route.meta.chat_list}">
    <slot/>
  </header>
</template>

<script>
export default {
  name: "Header",

  computed: {
    landscape() {
      if(process.env.VUE_APP_MODE == "false") {
        if (screen.orientation.type.indexOf('landscape') > -1) return true
        else return false 
      } else return false
    }
  }
};
</script>

<style lang="scss">
#header {
  .logo {
    width: 124px;
  }
}
</style>
