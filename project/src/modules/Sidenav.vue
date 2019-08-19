<template>
  <div id="slide-out" class="sidenav">
    <slot :props="{volume_status, error_volume, volume}" />
  </div>
</template>

<script>
export default {
  name: "Sidenav",

  props: {
    token: String,
    ip_channel: String
  },

  data() {
    return {
      volume: 0,
      volume_status: false,
      error_volume: false
    };
  },

  watch: {
    ip_channel(new_ip) {
      this.get_volume();
    }
  },

  created() {
    this.get_volume();
  },

  mounted() {
    const self = this;

    const M = require("materialize-css");

    const options = {
      edge: "right",
      onOpenStart: () => {
        self.get_volume();
      }
    };

    M.Sidenav.init(document.querySelectorAll(".sidenav"), options);
  },

  methods: {
    get_volume() {
      const self = this;

      let channelIP = self.ip_channel;
      // let channelIP = "192.168.133.181"; // teste

      let url = "http://" + channelIP + ":21564/PlayerManager/GetVolume";

      self.volume_status = false;
      self.error_volume = false;

      let body = {
        token: self.token
      };

      self.axios
        .post(url, body, {
          timeout: 7000
        })
        .then(response => {
          if (!response) {
            return self.$logger.error(
              "Erro ao carregar volume do player.",
              response
            );
          }

          self.volume = response.data.GetVolumeResult.Volume;
          self.volume_status = true;

          self.$logger.log(
            "Volume do player carregado!",
            "Volume: " + self.volume
          );
        })
        .catch(err => {
          self.$logger.error("Erro ao carregar volume do player.", err);
          self.error_volume = true;
        });
    },

    update_volume(volume) {
      const self = this;

      let channelIP = self.ip_channel;
      // let channelIP = "192.168.133.181"; // teste

      let url = "http://" + channelIP + ":21564/PlayerManager/SetVolume";

      let body = {
        token: self.token,
        volume: volume
      };

      self.axios
        .post(url, body, {
          timeout: 7000
        })
        .then(response => {
          if (!response) {
            return self.$logger.error(
              "Volume do player não atualizado.",
              response
            );
          }

          self.volume = response.data.SetVolumeResult.Volume;

          self.$logger.log(
            "Volume do player atualizado com sucesso!",
            "Volume: " + self.volume
          );
        })
        .catch(err => {
          self.$logger.error("Erro ao atualizar volume do player.", err);
          self.error_volume = true;
        });
    },

    get_cameras() {
      const self = this;
      return new Promise((resolve, reject) => {
        let channelIP = self.ip_channel;
        // let channelIP = "192.168.133.181"; // teste

        let url = "http://" + channelIP + ":21564/PlayerManager/GetCameras";

        let body = {
          token: self.token
        };

        self.axios
          .post(url, body, {
            timeout: 7000
          })
          .then(response => {
            if (!response) {
              return self.$logger.error("Falha ao buscar câmeras.", response);
            }

            let cameras = response.data.GetCamerasResult.Cameras;
            // console.log("Cameras", cameras);
            resolve(cameras);
          })
          .catch(err => {
            self.$logger.error("Erro ao buscar câmeras.", err);
            self.error_camera = true;
            reject();
          });
      });
    },
    start_camera(name) {
      const self = this;
      return new Promise((resolve, reject) => {
        let channelIP = self.ip_channel;
        let url =
          "http://" + channelIP + ":21564/PlayerManager/StartCameraTest";

        let body = {
          token: self.token,
          cameraName: name
        };

        self.axios
          .post(url, body, {
            timeout: 7000
          })
          .then(response => {
            if (!response) {
              self.$logger.error(
                "Falha ao iniciar teste de câmeras.",
                response
              );
              reject();
            } else {
              resolve();
            }
          })
          .catch(err => {
            self.$logger.error("Erro ao iniciar teste de câmeras.", err);
            reject();
          });
      });
    },
    stop_camera() {
      const self = this;
      return new Promise((resolve, reject) => {
        let channelIP = self.ip_channel;
        let url =
          "http://" + channelIP + ":21564/PlayerManager/FinishCameraTest";

        let body = {
          token: self.token
        };

        self.axios
          .post(url, body, {
            timeout: 7000
          })
          .then(response => {
            if (!response) {
              self.$logger.error(
                "Falha ao finalizar teste de câmeras.",
                response
              );
              reject();
            } else {
              resolve();
            }
          })
          .catch(err => {
            self.$logger.error("Erro ao finalizar teste de câmeras.", err);
            reject();
          });
      });
    }
  }
};
</script>