<template>
  <div id="login" class="view full">
    <div class="center-view fill-size">
      <!-- <div class="square-wrapper">
        <div class="square-row">
          <square color="rgba(14, 30, 100, 0.7)" right="0px" size="40px" />
        </div>
        <div class="square-row">
          <square color="#3764ac" right="40px" size="40px" />
        </div>
        <div class="square-row">
          <square color="rgba(142, 142, 142, 0.7)" left="0px" size="40px" />
        </div>
      </div>-->

      <div class="container">
        <div id="logo-login-area" class="row center-align">
          <logo color="grey" :size="188" />
        </div>

        <div id="login-form">
          <div class="form-smart">
            <form
              @submit.prevent="check_authenticate('login');"
              class="step-input login-step"
              :class="{'login-input-active': login_step}"
            >
              <input-field
                v-model="user.Login.value"
                id="input-userFunctionCode"
                label="E-mail"
                type="email"
                :tooltip="user.Login.message"
                :invalid="user.Login.invalid"
                @onFocusOut="clear_error('Login');"
              />
              <div class="row">
                <button-action type="submit">Continuar</button-action>
              </div>

              <div class="row">
                <div id="call-action" class="row no-pad-r no-pad-l left-align">
                  <span @click.stop>Não possui conta?</span>
                </div>
                <button-action
                  type="button"
                  color="grey"
                  @action="$covers.show_sideslide('register');"
                >Cadastre-se</button-action>
              </div>
            </form>

            <form
              @submit.prevent="check_authenticate('password');"
              class="step-input pass-step"
              :class="{'login-input-active': !login_step}"
            >
              <input-field
                v-model="user.Pass.value"
                id="input-Password"
                type="password"
                label="Senha"
                :tooltip="user.Pass.message"
                :invalid="user.Pass.invalid"
                @onFocusOut="clear_error('Pass');"
                @keydown.tab.prevent
              />
              <!-- @keyup.enter="check_authenticate('password')" -->
              <!-- @keyup.tab="back_step" -->
              <div class="row">
                <button-action type="submit">Entrar</button-action>
              </div>

              <div class="row">
                <div class="no-pad-r no-pad-l col s3 left-align">
                  <a @click.prevent="back_step">
                    <i class="material-icons">keyboard_backspace</i>
                  </a>
                </div>
                <div class="no-pad-r no-pad-l col s9 right-align">
                  <a @click.prevent="forgot_password">Esqueceu a senha?</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="login-footer"></div>

      <!-- <div class="square-wrapper">
        <div class="square-row">
          <square color="rgba(3, 70, 142, 0.9)" right="40px" size="40px" />
        </div>
        <div class="square-row">
          <square color="#3764ac" right="0px" size="40px" />
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Logo from "@/components/elements/Logo";
import BoxContent from "@/components/elements/BoxContent";
import Square from "@/components/elements/Square";
import InputField from "@/components/forms/InputField";
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";
import IconAngleLeft from "@/components/icons/IconAngleLeft";

import Sideslide from "@/modules/Sideslide";

export default {
  name: "Login",

  data() {
    return {
      tokenApi: null,

      login_step: true,

      user: {
        Login: {
          // value: "00010011",
          value: "",
          message: "",
          invalid: false
        },

        Pass: {
          // value: "voxel123",
          value: "",
          message: "",
          invalid: false
        }
      },

      // geolocation: {
      //   latitude: null,
      //   longitude: null,
      //   accuracy: null
      // },
      // response_status: false,
      // response_interval: null,

      loader_status: false,

      options: {
        email: "",
        phone: ""
      }
    };
  },

  methods: {
    next_step() {
      this.login_step = false;
    },

    back_step() {
      this.login_step = true;
    },

    check_authenticate(input) {
      const self = this;

      if (input == "login") {
        if (self.validate_email()) return self.next_step();
      }

      if (input == "password") {
        if (self.validate_password())
          self.$login.authenticate(self.user.Login.value, self.user.Pass.value);
      }
    },

    validate_email() {
      var invalid = false;
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.user.Login.value == "") invalid = true;
      if (!re.test(this.user.Login.value)) invalid = true;
      if (
        this.user.Login.value.indexOf("@bradesco.com.br") == -1 &&
        this.user.Login.value.indexOf("@voxeldigital.com.br") == -1
      )
        invalid = true;

      if (invalid) {
        this.user.Login.invalid = true;
        this.user.Login.message = "E-mail inválido";

        return false;
      } else {
        this.user.Login.invalid = false;
        return true;
      }
    },

    validate_password() {
      if (this.user.Pass.value.length < 6) {
        this.user.Pass.invalid = true;
        this.user.Pass.message = "Sua senha deve ter pelo menos 6 dígitos";

        return false;
      } else {
        this.user.Pass.invalid = false;
      }

      var re = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
      if (!re.test(this.user.Pass.value)) {
        this.user.Pass.invalid = true;
        this.user.Pass.message = "Sua senha deve conter letras e números";

        return false;
      } else {
        this.user.Pass.invalid = false;
      }

      return true;
    },

    response_message(text) {
      clearInterval(this.response_interval);
      this.response = text;
      this.response_status = true;

      this.response_interval = setTimeout(() => {
        this.response_status = false;
      }, 5000);
    },

    clear_error(prop) {
      this.user[prop].invalid = false;
    },

    // recuperar senha
    forgot_password() {
      const self = this;
      this.$loader.show();

      this.$connection.get_data("tokenApi", tokenApi => {
        self.tokenApi = tokenApi;

        self.$apiRequest
          .invoke("UserForgotType", self.user.Login.value, self.tokenApi)
          .then(response => {
            if (!response) {
              self.$logger.warn(
                "Usuário inválido para recuperação de senha.",
                response
              );
              self.$loader.hide();
              self.$messages.alert({
                header: "Esqueci a senha",
                message:
                  "Nenhum usuário foi encontrado para recuperação de senha.",

                buttons: [
                  {
                    text: "OK",
                    cssClass: "grey-button",
                    role: "cancel"
                  }
                ]
              });
              return;
            }

            self.$logger.log(
              "Tipos de recuperação de senha encontrados:",
              response
            );

            self.options.phone = response.phone;

            let email = response.email;

            let emailChars = email.split("");

            let total = 0;

            for (let i = 0, l = emailChars.length; i < l; i++) {
              const elem = emailChars[i];
              if (elem == "*") total++;
            }

            email =
              email.substr(0, email.indexOf("*")) +
              "***" +
              email.substr(email.indexOf("*") + total, email.length);

            self.options.email = email;

            self.$loader.hide();

            self.$messages.alert({
              header: "Esqueci a senha",
              message: "Selecione uma das opções cadastradas para contato",

              buttons: [
                {
                  text: self.options.email,
                  cssClass: "grey-button",
                  handler: () => {
                    self.choose_option("email");
                  }
                },
                {
                  text: self.options.phone,
                  cssClass: "grey-button",
                  handler: () => {
                    self.choose_option("phone");
                  }
                }
              ]
            });
          })
          .catch(err => {
            self.$logger.warn(
              "Não foi possível requisitar recuperação de senha.",
              err
            );

            self.$messages.alert({
              header: "Esqueci a senha",
              message: "Código funcional inválido: " + self.user.Login.value,
              buttons: [
                {
                  text: "OK",
                  cssClass: "btn-full",
                  role: "cancel"
                  // handler: data => {
                  //   self.choose_option(option);
                  // }
                }
              ]
            });

            self.$loader.hide();
          });
      });
    },

    choose_option(option) {
      const self = this;

      self.$loader.show();

      self.$apiRequest
        .invoke(
          "UserForgotRequest",
          self.user.Login.value,
          option,
          self.tokenApi
        )
        .then(response => {
          if (!response) {
            self.$logger.warn(
              "E-mail de recuperação não requisitado.",
              response
            );
            return;
          }

          self.$logger.log(
            "E-mail de recuperação de senha requisitado com sucesso!"
          );

          self.$loader.hide();

          self.$messages.alert({
            header: "Esqueci a senha",
            message: undefined,
            inputs: [
              {
                type: "text",
                placeholder: "Informe o código de verificação"
              },
              {
                type: "password",
                placeholder: "Digite a senha nova senha"
              },
              {
                type: "password",
                placeholder: "Confirme sua senha"
              }
            ],
            buttons: [
              {
                text: "OK",
                cssClass: "btn-full",
                handler: data => {
                  self.confirm_update_password(data, option);
                }
              }
            ]
          });
        })
        .catch(err => {
          self.$logger.error("Erro ao requisitar código de recuperação.", err);
          self.$loader.hide();
        });
    },

    confirm_update_password(data, option) {
      const self = this;

      let cod = data[0];
      let pass1 = data[1];
      let pass2 = data[2];

      if (pass1 != pass2) {
        self.$messages.alert({
          header: "Esqueci a senha",
          message: "Senhas diferentes.",
          buttons: [
            {
              text: "Voltar",
              cssClass: "btn-full",
              handler: data => {
                self.choose_option(option);
              }
            }
          ]
        });
        return;
      }

      self.$loader.show();

      self.$apiRequest
        .invoke(
          "UserForgotCommit",
          self.user.Login.value,
          cod,
          pass1,
          self.tokenApi
        )
        .then(response => {
          if (!response) {
            self.$logger.warn("Não foi possível atualizar a senha", response);

            self.$messages.alert({
              header: "Esqueci a senha",
              message:
                "Não foi possível redefinir a senha para usuário " +
                self.user.Login.value,
              buttons: [
                {
                  text: "OK",
                  role: "cancel",
                  cssClass: "btn-full"
                  // handler: data => {
                  //   self.choose_option(option);
                  // }
                }
              ]
            });

            return;
          }

          self.$logger.log("Senha redefinida com sucesso!", response);

          self.$messages.alert({
            header: "Esqueci a senha",
            message: "Sua senha foi redefinida com sucesso!",
            buttons: [
              {
                text: "OK",
                role: "cancel",
                cssClass: "btn-full"
                // handler: data => {
                //   self.choose_option(option);
                // }
              }
            ]
          });

          self.$loader.hide();
        })
        .catch(err => {
          self.$logger.error("Erro ao atualizar a senha", err);
          self.$loader.hide();
        });
    }

    // getLocation() {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(this.getPosition);
    //   }
    // },

    // getPosition(position) {
    //   this.geolocation.latitude = position.coords.latitude;
    //   this.geolocation.longitude = position.coords.longitude;
    //   this.geolocation.accuracy = position.coords.accuracy;
    // }
  },

  created() {
    if (this.$login.userLogin) {
      this.user.Login.value = this.$login.userLogin;
      return;
    }

    let login = localStorage.getItem("UserInfo");

    if (login && login != null && login != "undefined") {
      login = JSON.parse(localStorage.getItem("UserInfo")).login || null;
    }

    if (login) {
      this.user.Login.value = login;
    }
  },

  mounted() {
    const self = this;

    if (self.user.Login.value == "") {
      self.$loader.hide();
    }
    else {
      setTimeout(function () {
        self.next_step();

        setTimeout(function () {
          self.$loader.hide();
        }, 500);
      }, 500);
    }

    if (process.env.VUE_APP_DEV == "false") {
      StatusBar.show();
      screen.orientation.lock("portrait");
    }
  },

  components: {
    Logo,
    BoxContent,
    InputField,
    ButtonAction,
    ButtonIcon,
    IconAngleLeft,
    Square,
    Sideslide
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/login.scss";
</style>
