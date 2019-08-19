<template>
  <carousel id="list-broadcast" class="carousel" :nav="false" :dots="false" :margin="10">
    <div :key="item.id" v-for="item in list" :class="itemClass">
      <slot name="item" :item="item" />
    </div>
  </carousel>
</template>

<script>
import Carousel from "vue-owl-carousel";

export default {
  name: "ListBroadcast",

  props: {
    dataList: Array,
    itemClass: String
  },

  data() {
    return {
      list: this.dataList
    };
  },

  //   mounted() {
  //     M.Carousel.init(
  //       document.querySelectorAll(".carousel"),
  //       {
  //         dist: 0,
  //         shift: 0,
  //         padding: 20,
  //         noWrap: true
  //       },
  //       true,
  //       true,
  //       4
  //     );
  //   }

  components: { Carousel }
};
</script>
