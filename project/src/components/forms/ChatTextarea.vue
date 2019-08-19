<template>
  <div class="chat-textarea input-field">
    <!-- <input
      :id="text_id"
      type="text"
      :ref="text_id"
      :value="text_value"
      :placeholder="text_placeholder"
      class="chat-input"
    >-->
    <textarea
      :id="text_id"
      :ref="text_id"
      :value="text_value"
      :placeholder="text_placeholder"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
      @keydown="$emit('keydown', $event)"
      @focusin="focusIn($event)"
      @focusout="focusOut($event)"
      class="chat-input"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "ChatTextarea",

  data() {
    return {
      text_id: this.id,
      text_placeholder: this.placeholder,
      text_value: this.value
    };
  },

  props: {
    id: {
      type: String,
      required: true
    },
    placeholder: String,
    value: {
      type: [Object, String, Number, Boolean],
      default: null
    }
  },

  methods: {
    focusIn(event) {
      this.$emit('onFocusIn', event); 
      this.$helpers.ensureVisible(event)
    },

    focusOut(event) {
      this.$emit('onFocusOut', event); 
      this.$helpers.ensureVisible(event)
    }
  }
};
</script>