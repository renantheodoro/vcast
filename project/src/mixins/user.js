export default {
  data() {
    return {
      form_status: false,
      broadcast: null,
      user: {
        UserId: "",
        UserName: {
          value: "",
          message: "",
          invalid: false
        },
        Login: {
          value: "",
          message: "",
          invalid: false,
          mask: "##########"
        },
        UserData: {
          juncao: {
            value: "",
            message: "",
            invalid: false
          },
          cargo: {
            value: "",
            message: "",
            invalid: false
          }
        }
      }
    };
  },

  created() {
    this.$loader.show();
    const current_user = this.$route.params.user;

    if (current_user) {
      // User Id
      if (current_user.ApplicationUserId) {
        this.user.UserId = current_user.ApplicationUserId;
      } else {
        this.user.UserId = current_user.Id;
      }

      // User Name
      if (current_user.UserName) {
        this.user.UserName.value = current_user.UserName;
      }

      // User Login
      if (current_user.Login) {
        this.user.Login.value = current_user.Login;
      }

      // User Data Juncao
      if (current_user.UserData.juncao) {
        this.user.UserData.juncao.value = current_user.UserData.juncao;
      }

      // User Data Cargo
      if (current_user.UserData.cargo) {
        this.user.UserData.cargo.value = current_user.UserData.cargo;
      }
    }

    if (this.$route.params.broadcast) {
      this.broadcast = this.$route.params.broadcast;
    }

    this.form_status = true;
    this.$loader.hide();
  },

  methods: {
    clear_error(prop) {
      if (prop == "name") {
        this.user.UserName.invalid = false;
        return;
      }
      if (prop == "login") {
        this.user.Login.invalid = false;
        return;
      }
      if (prop == "juncao") {
        this.user.UserData.juncao.invalid = false;
        return;
      }
      if (prop == "cargo") {
        this.user.UserData.cargo.invalid = false;
        return;
      }
    },

    validate(mode) {
      let errors = 0;
      if (!this.validate_function_code()) errors++;

      if (!this.validate_name()) errors++;

      if (!this.validate_junction()) errors++;

      if (!this.validate_office()) errors++;

      if (errors == 0) this.confirm_action(mode);
    },

    validate_function_code() {
      if (this.user.Login.value.length < 6) {
        this.user.Login.invalid = true;
        this.user.Login.message = "Código funcional deve ter pelo menos 6 dígitos";

        return false;
      } else {
        this.user.Login.invalid = false;
        return true;
      }
    },

    validate_name() {
      if (this.user.UserName.value == "") {
        this.user.UserName.invalid = true;
        this.user.UserName.message = "Nome inválido";

        return false;
      } else {
        this.user.UserName.invalid = false;
        return true;
      }
    },

    validate_junction() {
      if (this.user.UserData.juncao.value == "") {
        this.user.UserData.juncao.invalid = true;
        this.user.UserData.juncao.message = "Junção inválida";

        return false;
      } else {
        this.user.UserData.juncao.invalid = false;
        return true;
      }
    },

    validate_office() {
      if (this.user.UserData.cargo.value == "") {
        this.user.UserData.cargo.invalid = true;
        this.user.UserData.cargo.message = "Cargo inválido";

        return false;
      } else {
        this.user.UserData.cargo.invalid = false;
        return true;
      }
    },

    confirm_action(text) {
      const actionText = text;

      this.$messages.alert({
        header: actionText + " funcionário",
        message: "Você tem certeza que deseja " + actionText.toLowerCase() + " este funcionário?",
        buttons: [{
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
              this.update_user();
            }
          }
        ]
      });
    },

    delete_action() {
      this.$messages.alert({
        header: "Excluir funcionário",
        message: "Você tem certeza que deseja excluir este funcionário?",
        buttons: [{
            text: "Não",
            cssClass: "secondary"
          },
          {
            text: "Sim",
            handler: () => {
              this.delete_user();
            }
          }
        ]
      });
    },

    update_user() {
      const self = this;

      self.$loader.show();

      let userExtras = {
        juncao: self.user.UserData.juncao.value,
        cargo: self.user.UserData.cargo.value
      };

      let userData = {
        Name: self.user.UserName.value,
        Login: self.user.Login.value,
        Extras: userExtras
      };

      if (self.user.UserId != null) {
        userData.Id = self.user.UserId;
      }

      let form = new FormData();
      form.append("Data", JSON.stringify(userData));

      if (this.$refs["user-image"].get_image() != "") {
        form.append("Image", this.$refs["user-image"].get_image());
      }

      let ConnectionId = self.$connection.connId;

      const headers = {
        ConnectionId: ConnectionId
      };

      if (userData.Id) {
        self.axios
          .put(self.$helpers.get_api_url() + "appuser/user", form, {
            headers: headers
          })
          .then(response => {
            if (!response) {
              return self.$logger.error("Erro ao atualizar de usuário", self.user, form);
            }

            self.$logger.log("Usuário atualizado:", response.data);
            self.$messages.toast("Usuário atualizado com sucesso!", "success");
            // self.$router.back();
            self.$loader.hide();
          })
          .catch(err => {
            self.$logger.error("Erro ao atualizar de usuário", self.user, form);
            self.$messages.toast("Erro ao atualizar de usuário", "error");
            self.$loader.hide();
          });
      } else {
        self.axios
          .post(self.$helpers.get_api_url() + "appuser/user", form, {
            headers: headers
          })
          .then(response => {
            if (!response) {
              return self.$logger.error("Erro ao registrar de usuário", self.user, form);
            }

            self.$logger.log("Usuário registrado:", response.data);
            self.$messages.toast("Usuário registrado com sucesso!", "success");
            // self.$router.back();
            self.$loader.hide();
          })
          .catch(err => {
            self.$logger.error("Erro ao registrar de usuário", self.user, form, err);
            self.$messages.toast("Erro ao registrar de usuário", "error");
            self.$loader.hide();
          });
      }
    },

    delete_user() {
      const self = this;
      self.$loader.show();

      let userId;

      if (self.user.UserId != null) {
        userId = self.user.UserId;
      }

      self.$apiRequest
        .invoke("UserDelete", userId)
        .then(response => {
          if (!response) {
            self.$messages.toast("Erro ao deletar usuário", "error");
            return self.$logger.error("Erro ao deletar de usuário", self.user, response);
          }

          self.$logger.log("Usuário removido com sucesso", self.user, response);
          self.$messages.toast("Usuário removido com sucesso", "success");
          self.$loader.hide();
          // self.$router.back();
          self.back_user();
        })
        .catch(err => {
          self.$messages.toast("Erro ao deletar usuário", "error");
          self.$logger.error("Usuário removido com sucesso", self.user, err);
          self.$loader.hide();
        });
    },

    subscribe_user(userId) {
      const self = this;
      const broadcastId = self.broadcast.CodTransmissaoAoVivo;

      self.$apiRequest
        .invoke("BroadcastSubscribe", broadcastId, userId)
        .then(response => {
          self.$logger.log("Usuário inscrito", self.user, form, response);
          self.$loader.hide();
        })
        .catch(err => {
          self.$logger.error("Erro ao inscrever usuário", self.user, form, err);
          self.$loader.hide();
        });
    },

    // get_user_image(user, callback) {
    //   const self = this;

    //   const apiUrl =
    //     self.$helpers.get_api_url() + "ApplicationUser/getUserImage/";
    //   const headers = {
    //     ConnectionId: self.connId,
    //     "cache-control": "no-cache"
    //   };

    //   self.axios
    //     .get(apiUrl + user.ApplicationUserId + ".png", {
    //       headers: headers
    //     })
    //     .then(response => {
    //       self.$logger.log("Imagem encontrada:", response.data);
    //       if (callback) callback(response.data);
    //     })
    //     .catch(err => {
    //       self.$logger.error("Erro ao carregar foto do usuário", err);
    //       if (callback) callback(false);
    //     });
    // },

    back_user() {
      if (this.$route.meta.main_menu) this.$router.back();
      else
        this.$router.push({
          name: "inscrever-participante",
          params: {
            broadcast: this.broadcast
          }
        });
    }
  },

  mounted() {
    // volta pra home caso o canal seja atualizado
    // this.$channel.$on("updateChannel", channel => {
    //     this.$router.push({
    //         name: "home"
    //     });
    // })
  }
};