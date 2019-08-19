import Vue from "vue";

export default new Vue({
  data() {
    return {
      channel: null,
      channel_selected: null,
      channels: []
    };
  },

  watch: {
    current_channel(new_current_channel) {
      this.$channel.register_storage_channel(new_current_channel);
    }
  },

  methods: {
    /* Busca canais */
    load_channels() {
      let self = this;

      self.$apiRequest
        .invoke("GetChannels")
        .then(data => {
          if (data.length) self.channels = data;
          self.$logger.log("Canais carregados:", self.channels);
          //self.$loader.hide();
          self.$emit("updateListChannel", this.channels);
        })
        .catch(err => {
          self.$logger.error("Erro ao carregar os canais.", err);
        });
    },

    /* Abre modal de confirmação de troca de canal */
    confirm_action() {
      this.$messages.alert({
        header: "Canal",
        message: "Você tem certeza que deseja gerenciar este canal no app?",
        buttons: [
          {
            text: "Não",
            // role: "cancel",
            cssClass: "secondary",
            handler: () => {
              this.$messages.log("Você cancelou");
            }
          },
          {
            text: "Sim",
            handler: () => {
              this.update_channel();
            }
          }
        ]
      });
    },

    /* Guarda canal selecionado */
    save_channel(channel) {
      this.channel_selected = channel;
    },

    /* Atualiza para o canal selecionado */
    update_channel() {
      if (!this.channel_selected) return this.$covers.hide_sideslide();

      this.channel = this.channel_selected;

      // this.channel.IP = '192.168.133.181';

      this.register_storage_channel(this.channel);
      this.$covers.hide_sideslide();

      this.$emit("updateChannel", this.channel);
      this.$logger.log("Canal atualizado!", this.channel);
    },

    /* Retorna canal atual */
    get_current_channel() {
      let current = localStorage.getItem("current_channel");
      if (current && current != null && current != "" && current != "undefined") {
        this.channel = JSON.parse(current);
        return this.channel;
      } else return this.channel;
    },

    /* Retorna lista de canais */
    get_list_channels() {
      return this.channels;
    },

    /* Registra canal selecionado no localStorage */
    register_storage_channel(channel) {
      localStorage.setItem("current_channel", JSON.stringify(channel));
    }
  }
});
