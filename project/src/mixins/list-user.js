export default {
  data() {
    return {
      participants: [],
      subscribers: [],
      new_subscribers: [],
      unsubscribers: [],
      broadcast: null,
      list_avaiable: null,
      range_total: 5,
      range_index: 0,
      filter: {
        value: "",
        invalid: false,
        message: ""
      },
      filter_interval: null,
      load_status: true
    };
  },

  created() {
    this.$loader.show();
    this.check_list_mode();
  },

  watch: {
    $route(to, from) {
      this.check_list_mode();
    }
  },

  methods: {
    check_list_mode() {
      this.list_avaiable = false;

      if (this.$route.meta.select_single) {
        // modo de inscrição dentro da transmissão

        this.broadcast = this.$broadcasts.get_broadcast();

        this.get_subscribers(() => {
          this.configure_list(this.subscribers);
        });
      } else if (this.$route.meta.selection_mode) {
        // modo de inscrição fora da transmissão

        this.broadcast = this.$broadcasts.get_broadcast();
        this.get_subscribers(() => {
          // busca usuários cadastrados no tablet
          this.update_users();
        });
      } else {
        // modo de listagem apenas

        this.update_users();
      }
    },

    configure_list(itens) {
      const self = this;

      if (itens.length) {
        itens.forEach(item => {
          item.checked = false;
        });

        self.participants = _.concat(self.participants, itens);
      } else {
        // self.participants = [
        //   {
        //     ApplicationId: 4,
        //     ApplicationName: "DSS",
        //     ApplicationUserId: 6,
        //     ApplicationUserStatusId: null,
        //     AutenticationConnectionString: null,
        //     AutenticationId: 0,
        //     AutenticationName: null,
        //     AutoLogin: false,
        //     CustomerId: 0,
        //     Email: null,
        //     Enabled: false,
        //     HashExpiracao: null,
        //     HashReset: null,
        //     LastAccess: "2019-05-07T01:26:46.24",
        //     Login: "123123",
        //     Password: null,
        //     Phone: null,
        //     Released: false,
        //     SpotId: null,
        //     SpotName: null,
        //     Status: "Liberado",
        //     UserData: {},
        //     UserName: "Armando"
        //   }
        // ];
        self.$loader.hide();
        // self.check_loader_status(itens)
        self.$nextTick(() => {
          self.scroll_down();
        });
        return self.$logger.log("Nenhum usuário carregado");
      }

      // pega as imagens correspondentes
      // self.get_user_images(self.participants, response => {
      //   if (self.subscribers.length) {
      self.check_participants_subscribers(self.participants, response => {
        self.list_avaiable = true;
        self.$loader.hide();

        // self.check_loader_status(itens)

        // if (self.load_status) {
        self.$nextTick(() => {
          self.scroll_down();
        });
        // }
      });

      //   } else {
      //     self.list_avaiable = true;
      //     self.$loader.hide();
      //   }
      // });
    },

    scroll_down() {
      /*
      //NÃO SERVE PARA NADA
      let list = this.$refs["list-view"].$el;

      if (list.scrollHeight > 670) {
        // list.scrollTop = list.scrollHeight
      }
      */
    },

    clear_error() {
      this.filter.invalid = false;
      this.filter.message = "";
    },

    filter_users() {
      this.load_status = false;

      if (this.filter.value.length < 3 && this.filter.value != "") {
        this.filter.invalid = true;
        this.filter.message = "Digite pelo menos 3 caracteres";
        return;
      }

      if (this.filter.value == "") {
        this.reset_view();
      }

      this.clear_error();
      this.update_users();
    },

    reset_view() {
      this.participants = [];
      this.range_index = 0;
      this.filter.value = "";
      this.filter.invalid = false;
      this.filter.message = "";
      this.load_status = true;
    },

    clear_filter() {
      this.reset_view();
      this.update_users();
      this.load_status = false;
    },

    check_loader_status(itens) {
      if (!itens) itens = this.participants;

      if (itens.length < this.range_total) {
        this.load_status = false;
        return;
      }
    },

    update_users() {
      let self = this;

      self.$loader.show();

      let range = self.range_index * self.range_total + "-" + (self.range_index + 1) * self.range_total;

      if (this.filter.value != "") {
        this.participants = [];
      }

      self.$apiRequest
        .invoke("GetUsers", "items=" + range, this.filter.value)
        .then(response => {
          if (!response) {
            return self.$logger.error("Nenhum usuário recebido", response);
          }

          const users = response.Data;

          self.$logger.log("Usuários carregados na lista:", users);

          self.check_loader_status(users);

          self.range_index++;

          self.configure_list(users);
          self.$loader.hide();
        })
        .catch(err => {
          self.$logger.error("Erro ao buscar usuários", err);
          self.$messages.toast("Erro ao buscar usuários", "error");
          self.$router.push({
            name: "home"
          });
        });
    },

    select_all(value) {
      if (!value) return this.deselect_all();

      for (let index = 0, l = this.participants.length; index < l; index++) {
        const participant = this.participants[index];
        this.select_participant(participant, index, false);
      }
    },

    deselect_all() {
      for (let index = 0, l = this.participants.length; index < l; index++) {
        const participant = this.participants[index];
        this.select_participant(participant, index, true);
      }

      // console.log(this.participants);
    },

    get_subscribers(callback) {
      let self = this;

      if (!self.broadcast)
        return this.$router.push({
          name: "home"
        });

      const broadcastId = self.broadcast.CodTransmissaoAoVivo;
      // const broadcastId = self.broadcast.CodTransmissao;

      self.$apiRequest
        .invoke("GetBroadcastsUsers", broadcastId, "0-100")
        .then(response => {
          let users = [];
          if (response) {
            users = response;
            self.$logger.log("Inscritos carregados:", users);
          } else {
            self.$logger.log("Nenhum inscrito recebido", response);
          }

          if (users.length) self.subscribers = users;
          else {
            self.$logger.log("Nenhum inscrito registrado", response);
          }

          callback();
        })
        .catch(err => {
          self.$logger.error("Erro ao buscar inscritos", err);
        });
    },

    check_participants_subscribers(participants, callback) {
      if (participants.length) {
        // let subscribers_ids = this.subscribers.map(item => item.Id);

        let subscribers_ids = [];

        for (let index = 0; index < this.subscribers.length; index++) {
          const element = this.subscribers[index];
          subscribers_ids.push(element.Id);
        }

        // participants.forEach(item => {
        //     if (subscribers_ids.indexOf(item.ApplicationUserId) != -1) {
        //         item.checked = true;
        //     }
        // });

        for (let index = 0; index < participants.length; index++) {
          const element = participants[index];
          if (subscribers_ids.indexOf(element.ApplicationUserId) != -1) {
            element.checked = true;
          }
        }

        // let new_subscribers_ids = this.new_subscribers.map(item => item.Id);

        let new_subscribers_ids = [];

        for (let index = 0; index < this.new_subscribers.length; index++) {
          const element = this.new_subscribers[index];
          new_subscribers_ids.push(element.ApplicationUserId);
        }

        // participants.forEach(item => {
        //     if (new_subscribers_ids.indexOf(item.ApplicationUserId) != -1) {
        //         item.checked = true;
        //     }
        // });
        for (let index = 0; index < participants.length; index++) {
          const element = participants[index];

          if (new_subscribers_ids.indexOf(element.ApplicationUserId) != -1) {
            element.checked = true;
          }
        }

        // let unsubscribers_ids = this.unsubscribers.map(item => item.Id);

        let unsubscribers_ids = [];

        for (let index = 0; index < this.unsubscribers.length; index++) {
          const element = this.unsubscribers[index];
          unsubscribers_ids.push(element.ApplicationUserId);
        }

        // participants.forEach(item => {
        //     if (unsubscribers_ids.indexOf(item.ApplicationUserId) != -1) {
        //         item.checked = false;
        //     }
        // });

        for (let index = 0; index < participants.length; index++) {
          const element = participants[index];
          if (unsubscribers_ids.indexOf(element.ApplicationUserId) != -1) {
            element.checked = false;
          }
        }

        callback(true);
      } else {
        this.$messages.error("Nenhum usuário foi recebido para verificação de inscrição");
        callback(false);
      }
    },

    confirm_action() {
      this.$messages.alert({
        header: "Confirmar funcionário(s)",
        message: "Você tem certeza que deseja confirmar este(s) funcionário(s) na transmissão?",
        buttons: [{
            text: "Não",
            role: "cancel",
            cssClass: "secondary"
          },
          {
            text: "Sim",
            handler: () => {
              this.confirm_subscribers(this.new_subscribers, this.unsubscribers, response => {
                if (response) this.reset_selection_mode();
              });
            }
          }
        ]
      });
    },

    select_user(user, index, status) {
      if (this.$route.meta.selection_mode) this.select_participant(user, index, status);
      else if (this.$route.meta.select_single) {
        this.$chat.save_sender(user);
        this.$router.push({
          name: "enviar-mensagem",
          params: {
            broadcast: this.broadcast
          }
        });
      } else
        this.$router.push({
          name: "usuario",
          params: {
            user: user,
            broadcast: this.broadcast
          }
        });
    },

    select_participant(participant, index, status) {
      let participantId;

      if (participant.ApplicationUserId) {
        participantId = participant.ApplicationUserId;
      } else if (participant.Id) {
        participantId = participant.Id;
      }

      // pega os ids dos participantes já inscritos
      const subscribers_ids = this.subscribers.map(item => item.Id);

      // pega os ids dos participantes que são novos inscritos
      const new_subscribers_ids = this.new_subscribers.map(item => item.ApplicationUserId);

      // verifica se o participante está sendo selecionado
      if (status) {
        participant.checked = false;

        // verifica se usuario era inscrito anteriormente
        if (subscribers_ids.indexOf(participantId) > -1) {
          // adiciona na lista de usuarios inscritos a serem desinscritos
          this.unsubscribers.push(participant);
          // this.$messages.log("DESINSCREVEU USUÁRIO");
        }

        // verifica se usuario havia sido selecionado como novo inscrito
        if (new_subscribers_ids.indexOf(participantId) > -1) {
          // remove da lista de novos inscritos
          this.new_subscribers.splice(new_subscribers_ids.indexOf(participantId), 1);
          // this.$messages.log("CANCELOU INSCRIÇÃO");
        }
      } else {
        participant.checked = true;

        // verifica se usuario é um novo inscrito
        if (new_subscribers_ids.indexOf(participantId) == -1 && subscribers_ids.indexOf(participantId) == -1) {
          // adiciona na lista de novos inscritos
          this.new_subscribers.push(participant);
          // this.$messages.log("INSCREVEU USUÁRIO");
        }

        // verifica se usuario já era um inscrito e está sendo selecionado novamente
        if (subscribers_ids.indexOf(participantId) > -1) {
          // não faz nada
          // this.$messages.log("CANCELOU DESINSCRIÇÃO");
        }
      }
    },

    reset_selection_mode() {
      const self = this;
      self.$loader.show();
      self.unsubscribers = [];
      self.new_subscribers = [];
      self.subscribers = [];

      if (self.$route.meta.select_single) {
        self.$router.push({
          name: "listagem-mensagens",
          params: {
            broadcast: self.$broadcasts.get_broadcast()
          }
        });
      }
    },

    confirm_subscribers(new_subscribers, unsubscribers, callback) {
      this.$loader.show();

      const self = this;

      if (!self.broadcast)
        return this.$router.push({
          name: "home"
        });

      const broadcastId = this.broadcast.CodTransmissaoAoVivo;

      self.subscribe_users(new_subscribers, broadcastId, response => {
        self.unsubscribe_users(unsubscribers, broadcastId, response => {
          self.$messages.toast("Participantes atualizados com sucesso!", "success");
          self.$logger.log("Participantes atualizados com sucesso!");
          callback(true);
          self.$loader.hide();
        });
      });
    },

    subscribe_users(new_subscribers, broadcastId, callback) {
      const self = this;
      if (new_subscribers.length) {
        new_subscribers.forEach(item => {
          self.$apiRequest
            .invoke("BroadcastSubscribe", broadcastId, item.ApplicationUserId)
            .then(response => {
              self.$logger.log("Usuário inscrito com sucesso:", response);
            })
            .catch(err => {
              self.$logger.error("Erro ao inscrever usuário: " + item, err);
            });
        });

        callback(true);
      } else {
        self.$logger.log("Nenhum participante recebido para ser inscrito");
        callback(false);
      }
    },

    unsubscribe_users(unsubscribers, broadcastId, callback) {
      const self = this;
      if (unsubscribers.length) {
        unsubscribers.forEach(item => {
          self.$apiRequest
            .invoke("BroadcastUnsubscribe", broadcastId, item.ApplicationUserId)
            .then(response => {
              self.$logger.log("Usuário desinscrito com sucesso!", response);
            })
            .catch(err => {
              self.$logger.error("Erro ao desinscrever usuário: " + item, err);
            });
        });

        callback(true);
      } else {
        self.$logger.log("Nenhum participante recebido para ser desinscrito");
        callback(false);
      }
    }


  },

  computed: {
    button_status() {
      if (this.new_subscribers.length > 0 || this.unsubscribers.length > 0) return true;
      else return false;
    }
  },

  watch: {
    list_avaiable(newval) {
      const self = this;
      if (newval) {
        this.$nextTick(function () {
          // const listView = document.getElementById('list-view')
          const listView = self.$refs["list-view"].$el;

          listView.onscroll = () => {
            if (listView.scrollTop >= listView.scrollHeight - listView.offsetHeight) {
              self.update_users();
            }
          };
        });
      }
    }
  },

  mounted() {
    // this.$channel.$on("updateChannel", channel => {
    //     console.log("--- on updateChannel in list-user.js")
    //     if (!this.$route.meta.selection_mode) this.update_users();
    // })
  }
};