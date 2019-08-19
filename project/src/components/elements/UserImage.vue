<template>
  <label @click="open_modal" for="image-file">
    <media ref="user-media" type="camera" :src="current_path" />
    <!-- <input type="file" id="image-file" @change="update_path($event)"> -->
  </label>
</template>

<script>
/* ELEMENTS */
import Media from "@/components/elements/Media";

export default {
  name: "UserImage",

  props: {
    userId: {
      type: [String, Number]
    }
  },

  data() {
    return {
      image_path: "",
      image_file: null
    };
  },

  created() {
    if (this.userId)
      this.image_path =
        this.$helpers.get_api_url() + "appuser/image/" + this.userId + ".png";
    else return (this.image_path = "");
  },

  computed: {
    current_path() {
      return this.image_path;
    }
  },

  methods: {
    get_image() {
      let dataurl = this.image_path;
      let file;

      if (!this.$refs["user-media"].status()) return "";

      if (dataurl.indexOf("http://") > -1) return "";

      if (dataurl && dataurl != "") {
        var bstr = atob(dataurl);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        file = new File([u8arr], "usuario.png", { type: "image/png" });
      } else file = "";

      return file;
    },

    open_modal() {
      this.$messages.alert({
        header: "Enviar foto",
        message: "Escolha qual é o modo de envio de foto.",
        buttons: [
          {
            text: "Galeria",
            // role: "cancel",
            cssClass: "secondary",
            handler: () => {
              this.select_photo("galeria");
            }
          },
          {
            text: "Câmera",
            handler: () => {
              this.select_photo("camera");
            }
          }
        ]
      });
    },

    select_photo(type) {
      const self = this;
      navigator.camera.getPicture(
        imageData => {
          self.image_path = imageData;
        },
        err => {
          self.$logger.error("Erro ao carregar imagem do funcionário.", err);
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          encodingType: Camera.EncodingType.JPEG,
          mediaType: Camera.MediaType.PICTURE,
          correctOrientation: true,
          targetWidth: 250,
          targetHeight: 250,
          allowEdit: false,
          sourceType:
            type == "galeria"
              ? Camera.PictureSourceType.PHOTOLIBRARY
              : Camera.PictureSourceType.CAMERA
        }
      );
    }
  },

  components: {
    Media
  }
};
</script>
