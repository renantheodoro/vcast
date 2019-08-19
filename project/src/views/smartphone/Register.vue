<template>
  <div id="cadastro" class="view without-footer viewSideslide">
    <form id="form" @submit.prevent="validate" class="container">
      <div class="row">
        <!-- <input-field
          v-model.trim="user.Login.value"
          id="input-userCode"
          type="tel"
          label="Código funcional (somente números)"
          :mask="user.Login.mask"
          :invalid="user.Login.invalid"
          :tooltip="user.Login.message"
          @keyup.enter="validate"
          tabindex="0"
        />-->

        <input-field
          v-model.trim="user.UserName.value"
          id="input-name"
          label="Nome"
          :invalid="user.UserName.invalid"
          :tooltip="user.UserName.message"
          @onFocusOut="clear_error('name')"
          @keyup.enter="validate"
          tabindex="0"
        />

        <input-field
          v-model.trim="user.UserData.juncao.value"
          id="input-juncao"
          type="number"
          label="Junção (4 dígitos)"
          :mask="user.UserData.juncao.mask"
          :invalid="user.UserData.juncao.invalid"
          :tooltip="user.UserData.juncao.message"
          @onFocusOut="clear_error('juncao')"
          @keyup.enter="validate"
          tabindex="0"
        />

        <input-field
          v-model.trim="user.Email.value"
          id="input-email"
          type="email"
          label="E-mail"
          :invalid="user.Email.invalid"
          :tooltip="user.Email.message"
          @onFocusOut="clear_error('email')"
          @keyup.enter="validate"
          tabindex="0"
        />

        <input-field
          v-model.trim="user.Phone.value"
          id="input-phone"
          type="tel"
          label="Celular"
          :mask="user.Phone.mask"
          :invalid="user.Phone.invalid"
          :tooltip="user.Phone.message"
          @onFocusOut="clear_error('phone')"
          @keyup.enter="validate"
          tabindex="0"
        />

        <input-field
          v-model.trim="user.Password.value"
          id="input-password"
          type="password"
          label="Senha"
          :invalid="user.Password.invalid"
          :tooltip="user.Password.message"
          @onFocusOut="clear_error('password')"
          @keyup.enter="validate"
          tabindex="0"
        />

        <input-field
          v-model.trim="user.ConfirmPassword.value"
          id="input-password_confirm"
          type="password"
          label="Confirmação da senha"
          :invalid="user.ConfirmPassword.invalid"
          :tooltip="user.ConfirmPassword.message"
          @onFocusOut="clear_error('confirm_password')"
          @keyup.enter="validate"
          tabindex="0"
        />
      </div>
      <div class="row">
        <button-action type="submit">Cadastre-se</button-action>
      </div>
    </form>

    <div id="form-footer" class="row">
      <logo color="grey" :size="105" />
      <square color="rgba(14, 30, 100, 0.7)" bottom="45px" right="0" size="45px" />
      <square color="#3764ac" bottom="0" right="45px" size="45px" />
    </div>
  </div>
</template>

<script>
import Logo from "@/components/elements/Logo";
import InputField from "@/components/forms/InputField";
import ButtonAction from "@/components/buttons/ButtonAction";
import Square from "@/components/elements/Square";

import $ from "jquery";

export default {
  name: "Register",

  data() {
    return {
      user: {
        // UserId: "",

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

        Email: {
          value: "",
          message: "",
          invalid: false
        },

        Password: {
          value: "",
          message: "",
          invalid: false
        },

        ConfirmPassword: {
          value: "",
          message: "",
          invalid: false
        },

        Phone: {
          value: "",
          message: "",
          invalid: false,
          mask: "(##) #####-####"
        },

        UserData: {
          juncao: {
            value: "",
            message: "",
            invalid: false,
            mask: "####"
          }
          // cargo: {
          //   value: "",
          //   message: "",
          //   invalid: false
          // }
        }
      }
    };
  },

  methods: {
    clear_error(prop) {
      if (prop == "login") {
        this.user.Login.invalid = false;
        return;
      }

      if (prop == "name") {
        this.user.UserName.invalid = false;
        return;
      }

      if (prop == "juncao") {
        this.user.UserData.juncao.invalid = false;
        return;
      }

      if (prop == "email") {
        this.user.Email.invalid = false;
        return;
      }

      if (prop == "phone") {
        this.user.Phone.invalid = false;
        return;
      }

      if (prop == "password") {
        this.user.Password.invalid = false;
        return;
      }

      if (prop == "confirm_password") {
        this.user.ConfirmPassword.invalid = false;
        return;
      }

      // if (prop == "cargo") {
      //   this.user.UserData.cargo.invalid = false;
      //   return;
      // }
    },

    search_user_data() {
      // request
      //   .search_data(this.user.Login.value)
      //   .then(response => {
      //     if (response.email) {
      //       this.email.value = response.email;
      //     }
      //     if (response.extras.juncao) {
      //       this.juncao.value = response.extras.juncao;
      //     }
      //     if (response.name) {
      //       this.name.value = response.name;
      //     }
      //     if (response.phone) {
      //       this.phone.value = response.phone;
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },

    validate() {
      // ping
      const self = this;

      var errors = 0;
      // if (!this.validate_function_code()) errors++;

      if (!this.validate_name()) errors++;

      if (!this.validate_juncao()) errors++;

      if (!this.validate_email()) errors++;

      if (!this.validate_phone()) errors++;

      if (!this.validate_password()) errors++;

      if (errors == 0) this.confirm_register();
    },

    validate_function_code() {
      if (this.user.Login.value.length < 6) {
        this.user.Login.invalid = true;
        this.user.Login.message =
          "Código funcional deve ter pelo menos 6 dígitos";

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

    validate_juncao() {
      if (this.user.UserData.juncao.value == "") {
        this.user.UserData.juncao.invalid = true;
        this.user.UserData.juncao.message = "Junção inválida";

        return false;
      } else {
        this.user.UserData.juncao.invalid = false;
        return true;
      }
    },

    validate_email() {
      var invalid = false;
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (this.user.Email.value == "") invalid = true;
      if (!re.test(this.user.Email.value)) invalid = true;
      if (
        this.user.Email.value.indexOf("@bradesco.com.br") == -1 &&
        this.user.Email.value.indexOf("@voxeldigital.com.br") == -1
      )
        invalid = true;

      if (invalid) {
        this.user.Email.invalid = true;
        this.user.Email.message = "E-mail inválido";

        return false;
      } else {
        this.user.Email.invalid = false;
        return true;
      }
    },

    validate_phone() {
      var phone = this.user.Phone.value.replace("(", "");
      phone = phone.replace(")", "");
      phone = phone.replace("-", "");
      phone = phone.replace(" ", "");

      if (phone == "" || phone.length < 10) {
        this.user.Phone.invalid = true;
        this.user.Phone.message = "Número inválido";

        return false;
      } else {
        this.user.Phone.invalid = false;
        return true;
      }
    },

    validate_password() {
      if (this.user.Password.value.length < 6) {
        this.user.Password.invalid = true;
        this.user.Password.message = "Sua senha deve ter pelo menos 6 dígitos";

        return false;
      } else {
        this.user.Password.invalid = false;
      }

      if (this.user.Password.value == this.user.Login.value) {
        this.user.Password.invalid = true;
        this.user.Password.message = "Sua senha não pode ser a sua funcional";

        return false;
      } else {
        this.user.Password.invalid = false;
      }

      var re = /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
      if (!re.test(this.user.Password.value)) {
        this.user.Password.invalid = true;
        this.user.Password.message = "Sua senha deve conter letras e números";

        return false;
      } else {
        this.user.Password.invalid = false;
      }

      if (this.user.Password.value != this.user.ConfirmPassword.value) {
        this.user.Password.invalid = true;
        this.user.ConfirmPassword.invalid = true;
        this.user.Password.message = "Senhas não conferem";

        return false;
      } else {
        this.user.Password.invalid = false;
        this.user.ConfirmPassword.invalid = false;
      }

      return true;
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
      this.$messages.alert({
        header: "Criar nova conta",
        message:
          "Você tem certeza que deseja " +
          actionText.toLowerCase() +
          " este funcionário?",
        buttons: [
          {
            text: "Não",
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

    confirm_register() {
      const self = this;

      this.user.Phone.value = this.user.Phone.value.replace("(", "");
      this.user.Phone.value = this.user.Phone.value.replace(")", "");
      this.user.Phone.value = this.user.Phone.value.replace("-", "");
      this.user.Phone.value = this.user.Phone.value.replace(" ", "");

      self.$loader.show();

      let userData = {
        Name: self.user.UserName.value,
        Phone: self.user.Phone.value,
        Email: self.user.Email.value,
        Password: self.user.Password.value,
        Login: self.user.Login.value,
        Extras: {
          juncao: self.user.UserData.juncao.value
        }
      };

      // let form = new FormData();
      // form.append("Data", JSON.stringify(userData));

      var form = new FormData();
      if (typeof form.set !== "undefined") {
        form.set("Data", JSON.stringify(userData));
      } else {
        form.append("Data", JSON.stringify(userData));
      }

      let tokenAtual = self.$connection.tokenApi;

      const headers = {
        Authorization: tokenAtual
      };

      self.axios
        .post(self.$helpers.get_api_url() + "appuser/user", form, {
          headers: headers,
          timeout: 1000
        })
        .then(response => {
          if (!response) {
            self.responseValidade(response);
            // return self.$logger.error(
            //   "Erro ao registrar usuário",
            //   self.user,
            //   form
            // );
            return;
          }

          self.$logger.log("Usuário registrado:", response.data);

          // self.$messages.toast("Usuário registrado com sucesso!", "success");
          self.$loader.hide();

          self.reset_form();

          self.$messages.alert({
            header: "Cadastro efetuado com sucesso!",
            message: "Seus dados passarão agora por uma análise de aprovação.",

            buttons: [
              {
                cssClass: "btn-full",
                text: "Concluir",
                role: "cancel"
              }
            ]
          });
        })
        .catch(err => {
          self.responseValidade(err);
        });
    },

    responseValidade(res) {
      const self = this;

      self.$logger.error("Erro ao registrar usuário", res);

      self.$messages.toast("Erro ao registrar usuário", "error");

      self.$loader.hide();

      if (res.response) {
        if (res.response.status == 409) {
          self.$messages.alert({
            header: "Erro ao cadastrar",
            message: "Já existe um cadastro com esses dados.",

            buttons: [
              {
                text: "OK",
                cssClass: "btn-full",
                role: "cancel"
              }
            ]
          });
          return;
        }
      }

      self.$messages.alert({
        header: "Erro ao cadastrar",
        message:
          "Ocorreu um erro no seu cadastro. Tente novamente ou entre em contato com o suporte.",

        buttons: [
          {
            text: "Concluir",
            cssClass: "btn-full",
            role: "cancel"
          }
        ]
      });
    },

    reset_form() {
      this.user = {
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

        Email: {
          value: "",
          message: "",
          invalid: false
        },

        Password: {
          value: "",
          message: "",
          invalid: false
        },

        ConfirmPassword: {
          value: "",
          message: "",
          invalid: false
        },

        Phone: {
          value: "",
          message: "",
          invalid: false,
          mask: "(##) #####-####"
        },

        UserData: {
          juncao: {
            value: "",
            message: "",
            invalid: false,
            mask: "####"
          }
          // cargo: {
          //   value: "",
          //   message: "",
          //   invalid: false
          // }
        }
      };

      document.getElementById("form").reset();

      M.updateTextFields();

      this.$covers.hide_sideslide();
    }
  },

  created() {
    this.$covers.$on("shownSideslide", view => {
      if (view == "register") this.reset_form();
    });
  },

  components: {
    Logo,
    InputField,
    ButtonAction,
    Square
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/register.scss";
</style>
