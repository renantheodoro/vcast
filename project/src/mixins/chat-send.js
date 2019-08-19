export default {
  data() {
    return {
      broadcast: null,
      current_message: ""
    };
  },

  created() {
    if (this.$broadcasts.get_broadcast()) this.broadcast = this.$broadcasts.get_broadcast();
    else
      this.$router.push({
        name: "home"
      });
  },

  methods: {
    confirm_action() {
      // const actionText = text;
      const self = this;

      self.$messages.alert({
        header: "Enviar mensagem",
        message: "Você tem certeza que deseja enviar esta mensagem?",
        buttons: [
          {
            text: "Não",
            // role: "cancel",
            cssClass: "secondary",
            handler: () => {
              self.$logger.log("Você cancelou");
            }
          },
          {
            text: "Sim",
            handler: () => {
              self.send();
            }
          }
        ]
      });
    },

    send() {
      const self = this;
      const sender = this.$chat.get_sender();

      // self.$loader.show();

      let tempId = Math.round(Math.random() * 10000000);

      // IMPRIMIR A MSG COM RELOGIO
      let messageSended = {
        ChatStatus: -1, // -1 significa relogio
        CodChatMessage: tempId,
        DateLastModify: self.$helpers.get_current_time(),
        // Date: self.$helpers.get_current_time(),
        Message: self.current_message,
        NickName: sender.Name
      };

      // salvando mensagem na lista
      self.$chat.send_message(messageSended, tempId);

      self.$router.push({
        name: "listagem-mensagens",
        params: {
          broadcast: this.$broadcasts.get_broadcast()
        }
      });
    }
  }
};
