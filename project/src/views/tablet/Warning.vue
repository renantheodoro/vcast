<template>
  <div v-if="!$loader.status" class="warning-section" :class="classes">
    <square color="#3764ac" top="80px" left="0px"/>
    <square color="rgba(14, 30, 100, 0.7)" top="0px" left="80px"/>
    <square color="#0e1e64" top="0px" right="0px"/>
    <square color="rgba(142, 142, 142, 0.7)" top="80px" right="0px"/>
    <square color="rgba(14, 30, 100, 0.8)" bottom="80px" right="0px"/>
    <square color="rgba(95, 95, 95, 0.7)" bottom="0px" right="80px"/>
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
    }
  },

  components: {
    Square,
    IconExclamation
  }
};
</script>