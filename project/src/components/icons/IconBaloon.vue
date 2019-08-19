<template>
  <div id="icon-baloon" :style="{width: size, height: size}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 75">
      <path
        fill="none"
        fill-rule="evenodd"
        :stroke="color"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
        d="M59.51 54.537H35.482L16.715 72.405l.576-17.868h-3.554c-6.009 0-10.88-4.87-10.88-10.88V13.451c0-6.009 4.871-10.88 10.88-10.88h45.774c6.009 0 10.88 4.871 10.88 10.88v30.206c0 6.01-4.871 10.88-10.88 10.88z"
      ></path>
    </svg>

    <div v-if="blocked" class="line" :style="lineStyle"></div>
  </div>
</template>

<script>
export default {
  name: "IconBalloon",

  props: {
    color: {
      type: String,
      required: false,
      default: "#fff"
    },

    size: {
      type: String,
      required: false,
      default: "50px"
    },

    blocked: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  computed: {
    lineStyle() {
      let style = {
        backgroundColor: this.color,
        height: "calc(" + this.size + " + 45%)",
        top: "calc(75% - " + this.size + ")"
      };

      return style;
    }
  }
};
</script>

<style lang="scss">
#icon-baloon {
  position: relative;

  svg {
    width: 100%;
  }

  .line {
    width: 5%;
    transform: rotate(45deg);
    position: absolute;

    left: 50%;
    border-radius: 20px;
  }
}
</style>
