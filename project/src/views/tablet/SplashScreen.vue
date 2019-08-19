<template>
  <div id="splashscreen">
    <div id="footerVersion" class="column">
      <div id="powered">
        Powered by
        <icon-voxel color="pb"/>
      </div>
      <br>
      <div id="version">versão 2.0.0</div>
    </div>
  </div>
</template>

<script>
import IconVoxel from "@/components/icons/IconVoxel";

export default {
  name: "SplashScreen",

  components: {
    IconVoxel
  }
};
</script>

<style lang="scss" scoped>
// #header {
//   display: none !important;
// }
</style>

