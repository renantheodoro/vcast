import Vue from "vue";

export default new Vue({
  data() {
    return {
      broadcast: null,
      sender: {
        Name: ""
      },
      messages: [],
      messages_sent: [],
      spot: null,
      searching: false
    };
  },

  mounted() {
    if (this.$broadcasts.current_broadcast) {
      this.broadcast = this.$broadcasts.current_broadcast;
    }

    // buscando spot
    this.spot = this.$connection.spot;
  },

  methods: {
    update_spot(spot) {
      if (spot) this.spot = spot;
    },

    save_sender(sender) {
      if (sender) {

        if (sender.SmartphoneUserName) {
          this.sender.Name = sender.SmartphoneUserName
          return
        }

        let name;
        if (sender.UserName) name = sender.UserName;
        else if (sender.Name) name = sender.Name;

        this.sender.Name = name + " - " + this.spot.Name;
      } else {
        this.sender.Name = this.spot.Name;
      }

      this.$emit("updateSender", this.sender);
    },

    check_sender(name) {
      if (name == null) return false;

      if (this.spot) {
        if (name.indexOf(this.spot.Name) < 0) {
          return false;
        }
        // mensagem recebida
        else {
          return true; // mensagem enviada
        }
      }

      let messageSended = false
      let currentName = this.$login.get_data('userName');

      if (currentName.indexOf(name) > -1) messageSended = true

      return messageSended

    },

    get_sender() {
      return this.sender;
    },

    send_message(messageSended, oldId) {
      // guarda mensagem a ser enviada
      this.messages_sent.push(messageSended);

      // adiciona as mensagens enviadas na lista de mensagem
      this.append_messages(this.messages_sent);

      // registra mensagens enviadas no localStorage
      this.register_sent_messages();

      this.$logger.log("Mensagem registrada no localStorage", messageSended);

      this.send_message_request(messageSended, oldId)
    },

    send_message_request(messageSended, oldId, callback) {
      if (!this.$connection.status_internet || !this.$connection.server_connected) {
        if (callback) callback()
        return;
      }

      const self = this;
      const broadcastId = this.$broadcasts.current_broadcast.CodTransmissao

      // envia mensagem
      this.$apiRequest
        .invoke("SendChatMessage", broadcastId, messageSended.NickName, messageSended.Message)
        .then(response => {
          // SE NÃO VOLTAR RESPONSE 0 IMPRIMIR A MENSAGEM COM 1 CHECK
          if (!response) {
            return self.$logger.error("Mensagem não enviada:", response);
          } else {
            self.$logger.log("Mensagem enviada!", response);

            // atualizando o codigo da mensagem enviada
            self.update_message_code(oldId, response);
            // self.$loader.hide();

            if (callback) callback(true)
          }
        })
        .catch(err => {
          self.$logger.error("Erro ao enviar mensagem.", err);
          if (callback) callback(false)
          // self.$loader.hide();
        });
    },

    update_messages(lastCodChatMessage = null, total = 10, lastDate = null, callback) {

      if (!this.$connection.status_internet || !this.$connection.server_connected) return callback(false)

      if (this.searching) return;
      else this.searching = true

      const self = this;

      if (!this.$broadcasts.current_broadcast) return;

      // console.log('CodTransmissao', self.$broadcasts.current_broadcast.CodTransmissao)
      // console.log('lastCodChatMessage', lastCodChatMessage || 0)
      // console.log('total', total)
      // console.log('lastDate', self.$helpers.format_chat_date(lastDate))

      if (lastDate) lastDate = self.$helpers.format_chat_date(lastDate)
      else lastDate = self.$helpers.format_chat_date(new Date())

      this.$apiRequest
        .invoke("GetChatMessages", self.$broadcasts.current_broadcast.CodTransmissao, lastCodChatMessage || 0, total, lastDate)
        .then(response => {
          // console.log("Mensagens recebidas na requisição (sem tratamento):", response);

          if (!response || response == undefined) {
            self.$logger.warn("Mensagens não foram recebidas:", response);

            // configura mensagens
            self.config_local_messages(response, () => {
              self.$logger.log("Mensagens atualizadas com sucesso.", self.messages);
              self.$emit("updateMessages", self.messages, response.GetChatMessagesResult.Object);
              if (callback) callback();
              self.searching = false
            })

            return
          }

          // configura mensagens requisitadas
          self.config_request_messages(response, msg => {
            // configura mensagens do localStorage
            self.config_local_messages(response, () => {
              self.searching = false
              self.$logger.log("Mensagens atualizadas com sucesso!", self.messages);
              self.$emit("updateMessages", self.messages, response.GetChatMessagesResult.Object);
              if (callback) callback(msg);
            })
          })

        })
        .catch(err => {
          self.$logger.error("Erro ao carregar lista de mensagens", err);
          self.$loader.hide();
          self.searching = false
        });
    },

    config_request_messages(response, callback) {
      const self = this
      if (response.GetChatMessagesResult.Object) {
        if (!response.GetChatMessagesResult.Object.ChatMessages.length) {
          self.$logger.log("Sem mensagens para carregar.");
          if (callback) callback("sem mensagens");
          self.$emit('nomsg')
        } else {
          self.$logger.log("Mensagens carregadas", response.GetChatMessagesResult.Object.ChatMessages);

          for (let i = 0, l = response.GetChatMessagesResult.Object.ChatMessages.length; i < l; i++) {
            response.GetChatMessagesResult.Object.ChatMessages[i].ChatStatus = 1;
          }

          self.append_messages(response.GetChatMessagesResult.Object.ChatMessages);

          if (callback) callback();
        }
      } else {
        self.$logger.log("Sem mensagens para carregar.");
        if (callback) callback("sem mensagens");
        self.$emit('nomsg')
      }
    },

    config_local_messages(response, callback) {
      const self = this
      // mensagens gravadas no localStorage
      self.get_local_messages(() => {
        // ordena mensagens
        self.order_messages(() => {
          callback()
        })
      })
    },

    get_local_messages(callback) {
      const self = this;

      const broadcastId = this.$broadcasts.current_broadcast.CodTransmissao;
      const userId = JSON.parse(localStorage.getItem("UserInfo")).userid;

      if (process.env.VUE_APP_MODE == "smartphone") {
        // se tiver mensagens gravadas no localstorage
        if (self.messages_sent.length) self.append_messages(self.messages_sent);
        else if (localStorage.getItem("login-" + userId + "-messages_sent-" + broadcastId)) {
          self.messages_sent = JSON.parse(localStorage.getItem("login-" + userId + "-messages_sent-" + broadcastId));
          self.append_messages(self.messages_sent);
        }
      } else {
        // se tiver mensagens gravadas no localstorage
        if (self.messages_sent.length) self.append_messages(self.messages_sent);
        else if (localStorage.getItem("messages_sent-" + broadcastId)) {
          self.messages_sent = JSON.parse(localStorage.getItem("messages_sent-" + broadcastId));
          self.append_messages(self.messages_sent);
        }
      }

      if (callback) callback()
    },

    trySendLocalMessages() {
      const self = this;

      if (self.messages_sent.length) {
        for (let index = 0, length = self.messages_sent.length; index < length; index++) {
          const msg = self.messages_sent[index];

          if (msg.ChatStatus == -1) {
            self.send_message_request(msg, msg.CodChatMessage, response => {
              if (response) {
                // self.messages_sent.splice(index, 1)
                self.register_sent_messages();
              }
            })
          }
        }
      }
    },

    order_messages(callback) {
      const self = this
      // ordena as mensagens por data em ordem crescente
      if (self.messages.length) self.messages = _.orderBy(self.messages, ["DateLastModify"], ["asc"]);
      if (callback) callback()
    },

    get_chat_status(callback) {
      const self = this;

      self.$apiRequest
        .invoke("GetChatStatus", self.$broadcasts.current_broadcast.CodTransmissao)
        .then(status => {
          if (callback && status) {
            self.$logger.log("Status do chat atualizado:", status.GetChatInfoResult.ChatReleased);
            callback(status.GetChatInfoResult.ChatReleased);
          } else {
            self.$logger.warn("Status do chat com problema:", status.GetChatInfoResult.ChatReleased);
          }
        })
        .catch(err => {
          self.$logger.error("Erro ao atualizar o status do Chat", err);
        });
    },

    get_message_status(status) {
      switch (status) {
        case 0:
          // 1 check
          return "sent";
          break;

        case 1:
        case 2:
          // 2 check
          return "delivered";
          break;

        case 3:
        case 4:
          // 2 check colorido(aprovado)
          return "delivered"; // temporario
          // return "read";
          break;

        default:
          // relógio
          return "not-sent";
      }
    },

    update_message_code(oldId, newId) {
      this.messages.forEach(item => {
        if (item.CodChatMessage == oldId) {
          item.CodChatMessage = newId;
          item.ChatStatus = 0;
          return;
        }
      });

      this.messages_sent.forEach((item, index) => {
        if (item.CodChatMessage == newId) {
          // item.CodChatMessage = newId;
          item.ChatStatus = 0;
          this.register_sent_messages();
          return;
        }
      });
    },

    update_messages_status(code, status, messageReceived = null) {
      const self = this;

       ;

      // status 0:
      // 1 check
      // "sent";

      // status 1:
      // status 2:
      // 2 check
      // "delivered";

      // status 3:
      // status 4:
      // 2 check colorido(aprovado)

      // status -1
      // relógio
      // "not-sent";

      // atualiza o status
      for (let index = 0; index < self.messages.length; index++) {
        const item = self.messages[index];
        if (item.CodChatMessage == code) {
          item.ChatStatus = status;
          break;
        }
      }

      // self.messages.forEach(item => {
      //   if (item.CodChatMessage == code) {
      //     item.ChatStatus = status;
      //     return;
      //   }
      // });

      // verifica se mensagem foi enviada (2 checks)
      if (status > 0) {
        for (let index = 0; index < self.messages_sent.length; index++) {
          const item = self.messages_sent[index];

          if (item.CodChatMessage == code) {
            item.ChatStatus = status;

            // remove das mensagens locais

            self.messages_sent.splice(index, 1);
            // self.register_sent_messages();
          }

        }

        self.register_sent_messages();

        // self.update_messages();

        // const messageSent = self.messages_sent.filter((item, index) => {
        //   if (item.CodChatMessage == code) {
        //     self.messages_sent.splice(index, 1);
        //     self.register_sent_messages();
        //     return true;
        //   }
        //   return false;
        // });

        // if (!self.messages_sent.length) {
        //   if (messageReceived) {
        //     self.append_messages([messageReceived]);
        //   }
        // }

      } else {
        self.messages_sent.forEach(item => {
          if (item.CodChatMessage == code) {
            item.ChatStatus = status;
            self.register_sent_messages();
            return;
          }
        });
      }
    },

    register_sent_messages() {
      // if (!this.broadcast) return this.$router.push({ name: "home" });

      const broadcastId = this.$broadcasts.current_broadcast.CodTransmissao;
      const userId = JSON.parse(localStorage.getItem("UserInfo")).userid;

      if (process.env.VUE_APP_MODE == "smartphone")
        localStorage.setItem("login-" + userId + "-messages_sent-" + broadcastId, JSON.stringify(this.messages_sent));
      else
        localStorage.setItem("messages_sent-" + broadcastId, JSON.stringify(this.messages_sent));

    },

    append_messages(messagesReceived) {
      if (messagesReceived.length) {
        for (let i = 0; i < messagesReceived.length; i++) {
          const received = messagesReceived[i];
          var exist = false;

          for (let j = 0; j < this.messages.length; j++) {
            const message = this.messages[j];

            if (message.CodChatMessage == received.CodChatMessage) {
              exist = true;
              break;
            }
          }

          if (!exist) {
            this.messages.push(received);
          }
          //
        }
      }
    },

    get_data(key, callback) {
      this.$emit("getData", key, response => {
        callback(response);
      });
    },

    clear_messages() {
      this.messages = [];
    }
  }
});