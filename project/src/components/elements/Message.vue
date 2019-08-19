<template>
  <div class="message-row" :class="messageStyle">
    <div :id="'message-' + id" ref="message" class="message">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",

  props: {
    id: [String, Number],
    type: Boolean
  },

  computed: {
    messageStyle() {
      if (this.type) return "sent";
      else return "received";
    }
  }
};
</script>
