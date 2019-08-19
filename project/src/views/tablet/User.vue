<template>
  <div id="user" class="view">
    <div class="close">
      <button-icon v-if="$route.params.user || $route.params.broadcast" @action="back_user">
        <icon-close />
      </button-icon>
    </div>

    <form v-if="form_status" id="user-info" class="container">
      <div class="row center-align photo">
        <user-image ref="user-image" :userId="user.UserId" />
      </div>

      <div class="row">
        <input-field
          v-model.trim="user.Login.value"
          id="input-user_code"
          label="Código Funcional (somente números)"
          :mask="user.Login.mask"
          :invalid="user.Login.invalid"
          :value="user.Login.value"
          :tooltip="user.Login.message"
          @onFocusOut="clear_error('login')"
        />
      </div>

      <div class="row">
        <input-field
          v-model.trim="user.UserName.value"
          id="input-user_name"
          label="Nome"
          :invalid="user.UserName.invalid"
          :value="user.UserName.value"
          :tooltip="user.UserName.message"
          @onFocusOut="clear_error('name')"
        />
      </div>

      <div class="row">
        <input-field
          v-model.trim="user.UserData.juncao.value"
          id="input-user_junction"
          label="Junção"
          :invalid="user.UserData.juncao.invalid"
          :value="user.UserData.juncao.value"
          :tooltip="user.UserData.juncao.message"
          @onFocusOut="clear_error('juncao')"
        />
      </div>

      <div class="row">
        <input-field
          v-model.trim="user.UserData.cargo.value"
          id="input-user_office"
          label="Cargo"
          :invalid="user.UserData.cargo.invalid"
          :value="user.UserData.cargo.value"
          :tooltip="user.UserData.cargo.message"
          @onFocusOut="clear_error('cargo')"
        />
      </div>

      <div class="row center-align">
        <div v-if="$route.params.user" id="editUser" class="row">
          <div class="col s4 left-align">
            <button-action @action="validate('Salvar')">Salvar</button-action>
          </div>
          <div class="col s8 right-align">
            <button-icon @action="delete_action">
              <icon-trash />
            </button-icon>
          </div>
        </div>

        <div v-else id="newUser">
          <button-action @action="validate('Adicionar')">Adicionar</button-action>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Media from "@/components/elements/Media";

import UserImage from "@/components/elements/UserImage";

import IconCamera from "@/components/icons/IconCamera";
import IconTrash from "@/components/icons/IconTrash";
import IconClose from "@/components/icons/IconClose";

import InputField from "@/components/forms/InputField";

import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";

// service
import UserServices from "@/mixins/user";

export default {
  name: "User",

  mixins: [UserServices],

  components: {
    Media,
    UserImage,
    InputField,
    ButtonAction,
    ButtonIcon,
    IconClose,
    IconTrash
  }
};
</script>