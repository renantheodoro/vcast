<template>
  <div v-if="broadcast" id="broadcast" class="view">
    <div class="close">
      <button-icon @action="$router.push({name: 'home'})">
        <icon-close />
      </button-icon>
    </div>

    <div class="container">
      <div id="broadcast-media" class="center-align">
        <media :src="$helpers.get_api_url() + 'broadcast/image/' + broadcast.ImagemVertical" />
      </div>

      <div id="broadcast-info" class="row">
        <div class="col s4 center-align">
          <div class="label">data</div>
          <strong>{{$helpers.get_date(broadcast.DataInicio)}}</strong>
        </div>
        <div class="col s4 center-align">
          <div class="label">hora</div>
          <strong>{{$helpers.get_time(broadcast.DataInicio)}}</strong>
        </div>
        <div class="col s4 center-align">
          <div class="label">duração</div>
          <strong>{{$helpers.get_duration(broadcast.DataInicio, broadcast.DataTermino)}}</strong>
        </div>
      </div>

      <div id="broadcast-buttons" ref="broadcast-buttons" class="row">
        <button-action ref="button-subscribe" v-if="!subscriptionChecked" :full="true">
          <loader size="small" color="white" />
        </button-action>
        <button-action v-else-if="is_broadcast_live" :full="true" @action="watchBroadcast">Assistir</button-action>
        <!-- <button-action ref="button-subscribe" v-else-if="false" :full="true" @action="watchBroadcast">Assistir</button-action> -->
        <button-action
          ref="button-subscribe"
          v-else-if="subscribed"
          :full="true"
          color="white"
          :disable="true"
          @action="unsubscribe"
        >Cancelar inscrição</button-action>
        <button-action v-else ref="button-subscribe" :full="true" @action="subscribe">Inscrever-se</button-action>
      </div>

      <div id="broadcast-text">
        <div class="item-title" v-if="broadcast.Titulo">{{broadcast.Titulo}}</div>
        <div class="item-subtitle" v-if="broadcast.Subtitulo">{{broadcast.Subtitulo}}</div>
        <div class="item-description" v-if="broadcast.Descricao">{{broadcast.Descricao}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Media from "@/components/elements/Media";
import Loader from "@/components/elements/Loader";
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";
import IconClose from "@/components/icons/IconClose";

import Option from "@/components/forms/Option";

// service
import BroadcastService from "@/mixins/broadcast-single";

export default {
  name: "BroadcastSingle",

  mixins: [BroadcastService],

  components: {
    Media,
    Loader,
    ButtonAction,
    ButtonIcon,
    IconClose
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/broadcast.scss";
</style>