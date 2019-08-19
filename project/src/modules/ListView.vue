<template>
  <ul
    id="list-view"
    :class="[{'list-padding-bottom': newUser}, {'selection-mode': $route.meta.selection_mode}]"
  >
    <li
      class="item-content"
      :class="{'stripped': stripped}"
      :key="index"
      v-for="(item, index) in dataList"
    >
      <slot
        v-if="item.ApplicationUserId"
        name="list_item"
        :id="item.ApplicationUserId"
        :item="item"
        :index="index"
      />
      <slot v-else-if="item.Id" name="list_item" :id="item.Id" :item="item" :index="index" />
      <slot v-else name="list_item" :item="item" :index="index" />
    </li>

    <li v-if="newUser == true" class="item-content" :class="{'stripped': stripped}">
      <router-link
        :to="{name: 'adicionar-participante', params: { broadcast: this.$parent._data.broadcast }}"
        class="item-link waves-effect bigger"
      >
        <strong class="bigger">CADASTRAR NOVO FUNCIONÁRIO</strong>
        <icon-menu-user color="black" />
      </router-link>
    </li>

    <!-- <li v-if="loaderStatus" class="item-content center-align" :class="{'stripped': stripped}">
      <a
        ref="button-load"
        class="full-btn center-align waves-effect"
        @click.prevent="$emit('loadMore')"
      >CARREGAR MAIS</a>
    </li>-->

    <slot name="button" />
    <!-- <slot name="button-load"/> -->

    <div v-if="!dataList.length && !$loader.status" class="center-align">
      <slot name="error">Não foram encontrados usuários.</slot>
    </div>
  </ul>
</template>

<script>
import IconMenuUser from "@/components/icons/IconMenuUser";
export default {
  name: "ListView",

  props: {
    dataList: Array,

    avatar: {
      type: Boolean,
      required: false,
      default: false
    },

    valign: {
      type: Boolean,
      required: false,
      default: false
    },

    stripped: {
      type: Boolean,
      required: false,
      default: false
    },

    newUser: {
      type: Boolean,
      required: false,
      default: false
    },

    loaderStatus: Boolean
  },

  components: {
    IconMenuUser
  }
};
</script>