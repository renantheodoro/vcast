<template>
  <iframe
    :src="videoLink"
    ref="videoBroadcast"
    frameborder="0"
    allowfullscreen="true"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
  ></iframe>
</template>

<script>
export default {
  name: "Video",

  props: {
    src: String
  },

  data() {
    return {
      videoLink: this.src
    };
  }

};
</script>

<style lang="scss">
</style>
