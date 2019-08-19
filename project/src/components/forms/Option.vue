<template>
  <label class="option">
    <input
      :id="option_id"
      :ref="option_id"
      :type="type"
      :name="option_name"
      :value="option_value"
      :checked="checked"
      class="radio-check filled-in"
      @change="change"
    >
    <span>
      <slot/>
    </span>
  </label>
</template>

<script>
export default {
  name: "Option",

  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    value: {
      type: [String, Number],
      required: false
    },
    checked: {
      type: Boolean,
      default: false,
      required: false
    },
    classname: {
      type: String,
      default: "",
      required: false
    }
  },

  data() {
    return {
      option_id: this.id,
      option_type: this.type,
      option_name: this.name,
      option_value: this.value,
      option_checked: this.checked,
      option_class: this.classname
    };
  },

  watch: {
    option_checked(vewval) {
      this.choose(vewval);
    }
  },

  methods: {
    change(event) {
      this.$emit("on-change", event.target.checked);
    },

    choose(val) {
      if (val) this.select();
      else this.deselect();
    },

    select() {
      this.$refs[this.option_id].checked = true;
    },

    deselect() {
      this.$refs[this.option_id].checked = false;
    },

    verify_seletion(value) {
      if (!value) {
        if (this.option_checked) this.select();
        else this.deselect();
        return;
      }

      if (this.option_value == value) {
        this.select();
      } else {
        this.deselect();
      }
    }
  },

  mounted() {
    if (this.$channel.get_current_channel()) {
      if (this.option_name == "channel-option") {
        this.verify_seletion(this.$channel.get_current_channel().CodPlayer);
      } else {
        this.verify_seletion();
      }
    }

    // this.$channel.$on("updateChannel", channel => {
    //   this.verify_seletion(channel.CodPlayer);
    // });
  }
};
</script>

