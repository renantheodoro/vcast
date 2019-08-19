<template>
  <div v-if="mask" class="input-field" :class="{'with-tooltip': tooltip || tooltip == ''}">
    <input
      :id="input_id"
      :ref="input_id"
      :type="input_type"
      :value="input_value"
      :placeholder="input_placeholder"
      :class="[input_class, {'error': invalid}]"
      :disabled="input_disable"
      :label="input_label"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
      @keydown="$emit('keydown', $event)"
      @focusin="focusIn($event)"
      @focusout="focusOut($event)"
      v-mask="mask"
      :tabIndex="tabindex"
    />
    <label v-if="input_label" :for="input_id" :class="{'active': label_active}">{{input_label}}</label>
    <span v-if="invalid" class="helper-text">{{tooltip}}</span>
    <a
      v-if="type == 'password'"
      @click.stop="show_password"
      class="show-password"
      :class="{'show_active': show_active}"
    >
      <i class="material-icons">remove_red_eye</i>
    </a>
  </div>

  <div v-else class="input-field" :class="{'with-tooltip': tooltip || tooltip == ''}">
    <input
      :id="input_id"
      :ref="input_id"
      :type="input_type"
      :value="input_value"
      :placeholder="input_placeholder"
      :class="[input_class, {'error': invalid}]"
      :disabled="input_disable"
      :label="input_label"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
      @focusin="focusIn"
      @focusout="focusOut"
      :tabIndex="tabindex"
    />
    <label v-if="input_label" :for="input_id" :class="{'active': label_active}">{{input_label}}</label>
    <span v-if="invalid" class="helper-text">{{tooltip}}</span>
    <a
      v-if="type == 'password'"
      @click.stop="show_password"
      class="show-password"
      :class="{'show_active': show_active}"
    >
      <i class="material-icons">remove_red_eye</i>
    </a>
  </div>
</template>

<script>
export default {
  name: "InputField",

  data() {
    return {
      input_id: this.id,
      input_label: this.label || "",
      input_class: this.inputClass,
      input_placeholder: this.placeholder,
      input_value: this.value,
      input_type: this.type,
      input_disable: this.disabled,
      label_active: false,
      show_active: false
    };
  },

  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: "text"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    invalid: {
      type: Boolean,
      default: false,
      required: false
    },
    mask: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    tabindex: {
      type: String,
      required: false,
      default: "-1"
    },
    tooltip: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    inputClass: String,
    label: {
      type: [String, Boolean],
      required: false,
      default: false
    },
    placeholder: String,
    value: {
      type: [Object, String, Number, Boolean],
      default: null
    }
  },

  watch: {
    value() {
      this.input_value = this.value;
      // this.check_label_active();
    }
  },

  methods: {
    check_label_active() {
      if (this.value && this.value != "") this.label_active = true;
      else this.label_active = false;
    },

    show_password() {
      this.show_active = !this.show_active;

      if (this.show_active) {
        this.input_type = "text";
      } else this.input_type = "password";
    },

    focusIn(event) {
      this.$emit("onFocusIn", event);
      this.$helpers.ensureVisible(event);
    },

    focusOut(event) {
      this.$emit("onFocusOut", event);
      this.$helpers.ensureVisible(event);
    }
  },
  mounted() {
    this.check_label_active();
    M.updateTextFields();
  }
};
</script>