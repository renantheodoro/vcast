<template>
  <div :id="box_id" class="box-content" :class="{'no-mgn': no_mgn}">
    <slot/>
  </div>
</template>

<script>
export default {
  name: "BoxContent",

  props: {
    id: String,
    no_mgn: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      box_id: this.id
    };
  }
};
</script>

<style lang="scss">
#app {
  .box-content {
    width: 100%;
    max-width: 260px;
    background-image: linear-gradient(118deg, $blue-primary, $blue-secondary);
    text-align: center;
    padding: 25px;
    margin: 0 auto 10%;

    &.no-mgn {
      margin-bottom: 0;
    }

    @media (max-height: 479px) {
      margin-top: 10%;
    }

    @include flex(center, center, column);

    .text {
      @include font($gilroy, $big);
      color: $white;
      margin-bottom: 20px;

      &.big {
        @include font($gilroy, $biggest);
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .input-field {
      // height: 30px;
      text-align: left;

      input {
        background: $white !important;
        @include font($gilroy, $normal, 600);
        color: #111111;
        text-align: left;
        border-bottom: none !important;
        padding: 10px !important;
        // width: 100%;
        // height: 100%;

        &[type="password"] {
          padding-right: 30px;
        }

        &::placeholder {
          @include font($gilroy, $middle, 600);
          color: #111111;
          opacity: 0.6;
        }

        &:focus {
          border-bottom: none !important;
          box-shadow: 0 !important;
        }
      }

      .helper-text {
        color: $white !important;
      }

      .show-password {
        top: 5px;
        right: 5px;
      }
    }

    .text-response {
      margin-top: 20px;
    }

    .divider {
      width: 100%;
      background-color: $white;
      margin: 20px 0;
    }
  }
}
</style>
