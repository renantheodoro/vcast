<template>
  <div v-if="!$loader.status" class="warning-section" :class="classes">
    <!-- <square color="rgba(14, 30, 100, 0.7)" size="45px" top="0px" right="0px"/>
    <square color="rgba(142, 142, 142, 0.7)" size="45px" top="45px" right="45px"/>
    <square
      v-if="!squareMinVersion"
      color="rgba(14, 30, 100, 0.7)"
      size="45px"
      top="90px"
      left="45px"
    />
    <square color="#3764ac" size="45px" top="135px" left="0px"/>
    <square
      v-if="!squareMinVersion"
      color="rgba(3, 70, 142, 0.9)"
      size="45px"
      bottom="135px"
      right="0px"
    />
    <square
      v-if="!squareMinVersion"
      color="rgba(55, 100, 172, 0.7)"
      size="45px"
      bottom="90px"
      right="0px"
    />
    <square
      v-if="!squareMinVersion"
      color="rgba(14, 30, 100, 0.8)"
      size="45px"
      bottom="86px"
      left="45px"
    /> -->
    <!-- <square color="rgba(95, 95, 95, 0.7)" size="45px" bottom="0px" left="0px"/> -->
    <icon-exclamation/>
    <slot></slot>
  </div>
</template>

<script>
import Square from "@/components/elements/Square";
import IconExclamation from "@/components/icons/IconExclamation";
export default {
  name: "Warning",

  props: {
    classes: {
      type: String,
      required: false
    },

    squareMinVersion: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  components: {
    Square,
    IconExclamation
  }
};
</script>