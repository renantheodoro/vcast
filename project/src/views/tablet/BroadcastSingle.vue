<template>
  <div v-if="broadcast" id="broadcast" class="view">
    <div id="close" class="close">
      <button-icon @action="$router.push({name: 'home'})">
        <icon-close />
      </button-icon>
    </div>

    <div id="broadcast-media" class="center-align">
      <media :src="$helpers.get_api_url() + 'broadcast/image/' + broadcast.ImagemVertical" />
    </div>

    <div id="broadcast-info" class="container">
      <div class="row">
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
    </div>

    <div id="broadcast-buttons" class="row">
      <div v-if="is_broadcast_live" class="col s6 no-pad-l">
        <button-action
          :full="true"
          @action="$router.push({name:'listagem-mensagens', params: {broadcast: broadcast}})"
        >Interagir</button-action>
      </div>

      <div class="col no-pad-r no-pad-l" :class="[is_broadcast_live ? 's6' : 's12']">
        <button-action :full="true" @action="$router.push({name: 'inscrever-usuarios'})">Inscrever</button-action>
      </div>
    </div>

    <div id="broadcast-text" class="row left-align">
      <div class="item-title" v-if="broadcast.Titulo">{{broadcast.Titulo}}</div>
      <div class="item-subtitle" v-if="broadcast.Subtitulo">{{broadcast.Subtitulo}}</div>
      <div class="item-description" v-if="broadcast.Descricao">{{broadcast.Descricao}}</div>
    </div>
  </div>
</template>

<script>
import Media from "@/components/elements/Media";
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";
import IconClose from "@/components/icons/IconClose";

import Option from "@/components/forms/Option";

// service
import broadcastService from "@/mixins/broadcast-single";

export default {
  name: "broadcastSingle",

  mixins: [broadcastService],

  components: {
    Media,
    ButtonAction,
    ButtonIcon,
    IconClose
  }
};
</script>

