<template>
  <div class="preloader-wrapper active" :class="size">
    <div class="spinner-layer" :class="'layer-' + color">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div>
      <div class="gap-patch">
        <div class="circle"></div>
      </div>
      <div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loader",

  props: {
    size: {
      type: String,
      default: "",
      required: false
    },
    color: {
      type: String,
      default: "blue",
      required: false
    }
  }
};
</script>