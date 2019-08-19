<template>
  <div id="quiz" class="view">
    <div class="row">
      <div class="col s6">
        <span>500</span>
      </div>
      <div class="col s6">
        <points />
      </div>
    </div>

    <div id="quiz-area">
      <div class="row">
        <big>01</big>
      </div>

      <div class="row">
        <h2
          class="quis-question"
        >Quais são as informações principais que devem constar na planilha de orçamento?</h2>
      </div>

      <div class="row">
        <alternative text="receitas e despesas" :right="true">
          <template v-slot:props="{alternative_props}">
            <a>{{props.text}}</a>
          </template>
        </alternative>
      </div>

      <div class="row">
        <alternative text="lucro e prejuízo">
          <template v-slot:props="{alternative_props}">
            <a>{{props.text}}</a>
          </template>
        </alternative>
      </div>
    </div>
  </div>
</template>

<script>
import UserImage from "@/components/elements/UserImage";
import Points from "@/components/elements/Points";
import Alternative from "@/components/elements/Alternative";

import InputField from "@/components/forms/InputField";
import ButtonAction from "@/components/buttons/ButtonAction";

// const participantsService = require("../services/participants.js");

export default {
  name: "User",

  data() {
    return {
      user: {},
      buttonText: "Adicionar"
    };
  },

  methods: {
    confirm_action() {
      this.$messages.alert({
        header: this.buttonText + " funcionário",
        message:
          "Você tem certeza que deseja " +
          this.buttonText.toLowerCase() +
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
              this.updateUser();
            }
          }
        ]
      });
    },

    updateUser() {
      this.$loader.show();

      let user_props = {
        image: this.$refs["user-image"].image_path,
        name: this.$refs["input-name"].$el.firstChild.value,
        junction: this.$refs["input-junction"].$el.firstChild.value,
        office: this.$refs["input-office"].$el.firstChild.value
      };

      M.toast({ html: "Usuário atualizado com sucesso!" });

      // participantsService.default.updateParticipant().then(response => {
      //   this.$messages.log("Participante atualizado com sucesso!");
      //   this.$loader.hide();
      // });
    }
  },

  created() {
    this.$loader.show();
    if (this.$route.params.user) {
      this.user = this.$route.params.user;
      this.buttonText = "Salvar";
    }
    this.$loader.hide();
  },

  components: {
    UserImage,
    Points,
    InputField,
    ButtonAction,
    Alternative
  }
};
</script>

<style lang="scss">
</style>
