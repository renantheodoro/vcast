<template>
  <div class="range">
    <strong class="range-title">{{range_title}}</strong>
    <div class="range-row">
      <a
        class="range-button range-minus waves-effect"
        v-longclick="() => changeValue(-1)"
        @click="() => changeValue(-1)"
      >-</a>

      <big class="range-value">{{current_volume}}</big>

      <a
        class="range-button range-plus waves-effect"
        v-longclick="() => changeValue(1)"
        @click="changeValue(1)"
      >+</a>
    </div>
  </div>
</template>

<script>
import ButtonAction from "@/components/buttons/ButtonAction";

import { longClickDirective } from "vue-long-click";

const longClickInstance = longClickDirective({ delay: 400, interval: 50 });

export default {
  name: "Range",

  props: {
    title: String,
    value: {
      type: [String, Number],
      default: 0
    },
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 100
    }
  },

  directives: {
    longclick: longClickInstance
  },

  data() {
    return {
      range_title: this.title,
      range_value: parseInt(this.value),
      range_min: parseInt(this.min),
      range_max: parseInt(this.max),
      valueRefresh: 0,
      refreshInterval: null
    };
  },

  methods: {
    changeValue(amount) {
      this.valueRefresh = this.range_value + amount;
      if (
        this.valueRefresh >= this.range_min &&
        this.valueRefresh <= this.range_max
      ) {
        this.range_value = this.valueRefresh;
      }

      clearTimeout(this.refreshInterval);

      this.refreshInterval = setTimeout(() => {
        this.$parent.update_volume(this.range_value);
      }, 500);
    }
  },

  computed: {
    current_volume() {
      return this.range_value;
    }
  },

  components: {
    ButtonAction
  }
};
</script>

<style lang="scss">
.range-value {
  font-size: 4rem;
  font-weight: bold;
}
</style>
