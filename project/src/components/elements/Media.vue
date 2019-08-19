<template>
  <div v-if="type == 'clapperboard'" class="media" :class="{'bordered': bordered}">
    <icon-clapperboard v-if="image_error"/>
    <img
      ref="media-img"
      v-else
      :src="image_path_updated"
      @error="error_image_load"
      @load="close_loader"
    >
    <loader v-if="loader" size="small" />
  </div>

  <div v-else-if="type == 'user'" class="media" :class="{'bordered': bordered}">
    <icon-user v-if="image_error"/>
    <img
      ref="media-img"
      v-else
      :src="image_path_updated"
      @load="close_loader"
      @error="error_image_load"
    >
    <loader v-if="loader" size="small" />
  </div>

  <div v-else-if="type == 'camera'" class="media" :class="{'bordered': bordered}">
    <icon-camera v-if="image_error"/>
    <img
      ref="image"
      v-else
      :src="image_path_updated"
      @load="close_loader"
      @error="error_image_load"
    >
    <loader v-if="loader" size="small" />
  </div>
</template>

<script>
import IconClapperboard from "@/components/icons/IconClapperboard";
import IconUser from "@/components/icons/IconUser";
import IconCamera from "@/components/icons/IconCamera";

import Loader from "@/components/elements/Loader";

export default {
  name: "Media",

  props: {
    src: {
      type: [String, Object]
    },
    type: {
      type: String,
      required: false,
      default: "clapperboard"
    },
    bordered: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      image_error: false,
      prefix: "data:image/jpeg;base64,",
      // prefix: "",
      image_path: "",
      loader: true
    };
  },

  created() {
    // if (this.src == null) this.error_image_load();
    if (this.src != "") this.check_image();
    else this.error_image_load();
  },

  watch: {
    src(new_src) {
      if (new_src != "") this.check_image();
      else this.error_image_load();
    }

    // image_path(new_path) {
    // }
  },

  computed: {
    image_path_updated() {
      return this.image_path;
    }
  },

  methods: {
    error_image_load() {
      this.image_error = true;
      this.close_loader();
    },

    close_loader() {
      this.$emit("loaded");
      this.loader = false;
    },

    check_image() {
      const self = this;

      let path = self.src;

      if (!path || path == "" || path == undefined || path == null)
        return self.error_image_load();

      if (path.indexOf("file://") > -1) {
        path = path.replace("file://", "");
        // path = self.prefix + path;
      }

      if (self.isBase64(path)) {
        self.image_path = self.prefix + path;
        self.image_error = false;
        self.$forceUpdate();
        return;
      }

      self.image_path = path;
      self.image_error = false;
      self.$forceUpdate();
    },

    isBase64(str) {
      if (str === "" || str.trim() === "") {
        return false;
      }
      try {
        return btoa(atob(str)) == str;
      } catch (err) {
        return false;
      }
    },

    convertToBase64(str) {
      if (str === "" || str.trim() === "") {
        return false;
      }
      try {
        return btoa(str);
      } catch (err) {
        return false;
      }
    },

    get_path() {
      // if (path.indexOf(this.prefix) != -1) {
      return this.image_path;
      // } else {
      // return this.image_path.replace(this.prefix, "");
      // }
    },

    status() {
      if (this.image_error) return false;
      else return true;
    }
  },

  components: { IconClapperboard, IconUser, IconCamera, Loader }
};
</script>
