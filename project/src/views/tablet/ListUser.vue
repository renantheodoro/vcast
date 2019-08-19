<template>
  <div id="list-user" class="view no-scroll">
    <div v-if="list_avaiable" class="row no-mgn-b pad-space-lateral no-pad-b flex-v-center">
      <div id="list-header" class="col s11 no-pad-l no-pad-r">
        <input-field
          v-model.trim="filter.value"
          id="input-filter"
          placeholder="Buscar funcionário"
          :tooltip="filter.message"
          :invalid="filter.invalid"
          :value="filter.value"
          @onFocusOut="clear_error()"
          @keyup.enter="filter_users"
        />
      </div>
      <div class="col s1 no-pad-l no-pad-r right-align flex-right flex-v-center">
        <a @click.prevent="filter_users" class="right-align flex-right flex-v-center">
          <i class="material-icons color-blue-primary">search</i>
        </a>
      </div>
    </div>
    <div v-if="list_avaiable" class="row no-mgn-b pad-space-lateral no-pad-t">
      <div class="col s4 left-align no-pad-l">
        <button-action :full="false" @action="clear_filter">
          <strong>Limpar filtro</strong>
        </button-action>
      </div>
      <div class="col s8"></div>
      <!--<div class="item-content">
         <div class="item-text">
          <div class="item-inner">
            <button-action :full="false" @action="clear_filter">
              <strong>Limpar filtro</strong>
            </button-action>
          </div> 
          <div v-if="$route.meta.selection_mode" class="item-after">
            <Option
              id="select-radio-all"
              ref="select-radio-all"
              type="checkbox"
              name="checkbox-all"
              @on-change="select_all($event)"
            />
          </div>
        </div>
      </div>-->
    </div>

    <list-view
      v-if="list_avaiable"
      ref="list-view"
      :dataList="participants"
      :valign="true"
      :avatar="true"
      :stripped="true"
      :newUser="$route.meta.new_subscribe_mode"
      :loaderStatus="load_status"
    >
      <!-- @loadMore="update_users" -->
      <template v-slot:list_item="{id: id, item: participant, index: index}">
        <a
          :id="'list-user-' + id"
          @click="select_user(participant, index, participant.checked)"
          class="item-link"
          :class="{'waves-effect': true}"
        >
          <!-- :class="{'waves-effect': $route.meta.selection_mode}" -->
          <div class="item-before">
            <!-- <media
              :src="'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'"
            />-->
            <media
              type="user"
              :bordered="true"
              :src="$helpers.get_api_url() + 'appuser/image/' + id + '.png'"
            />
          </div>

          <div class="item-text">
            <div class="item-inner">
              <strong v-if="participant.UserName" class="bigger">{{participant.UserName}}</strong>
              <strong v-else-if="participant.Name" class="bigger">{{participant.Name}}</strong>
              <span v-if="participant.UserData">{{participant.UserData.juncao}}</span>
            </div>

            <div v-if="$route.meta.selection_mode" class="item-after">
              <Option
                :id="'select-checkbox-' + id"
                :ref="'select-checkbox-' + id"
                type="checkbox"
                name="checkbox"
                :checked="participant.checked"
                @on-change="select_participant(participant, index, participant.checked)"
              />
            </div>
          </div>
        </a>
      </template>

      <template #button>
        <button-status
          ref="button-status"
          v-if="$route.meta.selection_mode"
          @action="confirm_action"
          :status="button_status"
        >SALVAR</button-status>
      </template>

      <!-- <template #button-load>
        <button-status
          v-if="load_status && !$loader.status"
          ref="button-load"
          @action="update_users"
          :status="true"
        >CARREGAR MAIS</button-status>
      </template>-->
    </list-view>

    <warning v-else-if="list_avaiable == false">
      <h2>Nenhum funcionário encontrado</h2>
    </warning>
  </div>
</template>

<script>
// temporario
const $ = require("jquery");

import ListView from "@/modules/ListView";
import Media from "@/components/elements/Media";
import InputField from "@/components/forms/InputField";
import Option from "@/components/forms/Option";
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonStatus from "@/components/buttons/ButtonStatus";
import ButtonIcon from "@/components/buttons/ButtonIcon";
import Warning from "@/views/tablet/Warning";

// service
import ListUserServices from "@/mixins/list-user";

export default {
  name: "ListUser",

  mixins: [ListUserServices],

  components: {
    ListView,
    Media,
    Option,
    InputField,
    ButtonAction,
    ButtonStatus,
    ButtonIcon,
    Warning
  }
};
</script>