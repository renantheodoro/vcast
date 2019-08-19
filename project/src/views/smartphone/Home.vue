<template>
  <div id="home" class="view no-pad-t">
    <!-- Transmissão ao vivo -->
    <router-link
      v-if="broadcast_live"
      id="broadcastsLive"
      class="liveCard"
      :to="{ name: 'transmissao', params: { broadcast: broadcast_live }}"
    >
      <div class="degrade"></div>
      <div class="liveImage">
        <media
          @loaded="show_play = true"
          :src="$helpers.get_api_url() + 'broadcast/image/' + broadcast_live.ImagemHorizontal"
        />
      </div>

      <div v-if="show_play" class="play visible">
        <icon-play />
      </div>

      <div class="liveSignal pulse">ao vivo</div>
      <div class="liveText">
        <div class="liveTitle">{{broadcast_live.Titulo}}</div>
        <div
          v-if="broadcast_live.Descricao"
          class="liveSubtitle"
        >{{$helpers.get_resume(broadcast_live.Descricao, 90)}}</div>

        <div
          class="liveDate"
        >{{$helpers.get_date(broadcast_live.DataInicio)}} às {{$helpers.get_time(broadcast_live.DataInicio)}}</div>
      </div>
    </router-link>

    <!-- Lista de transmissões (futuras) -->
    <div
      v-if="broadcasts_new.length"
      id="broadcastsList"
      :class="{'mgn-top-default':!broadcast_live}"
    >
      <div class="container">
        <div class="listTitle">Próximas Transmissões</div>
      </div>
      <list-broadcast :dataList="broadcasts_new">
        <template v-slot:item="{item}">
          <div :id="'broadcast-' + item.CodTransmissaoAoVivo" class="card">
            <router-link :to="{ name: 'transmissao', params: { broadcast: item }}">
              <div class="card-image">
                <media :src="$helpers.get_api_url() + 'broadcast/image/' + item.ImagemVertical" />
              </div>
              <div class="card-name">
                <p>{{item.Titulo}}</p>
              </div>
              <div v-if="item.Descricao" class="card-subtitle">
                <p>{{$helpers.get_resume(item.Descricao, 30)}}</p>
              </div>
              <div
                class="card-date"
              >{{$helpers.get_date(item.DataInicio)}} às {{$helpers.get_time(item.DataInicio)}}</div>
            </router-link>
          </div>
        </template>
      </list-broadcast>
    </div>

    <!-- Caso tiver transmissão ao vivo e nenhuma transmissão futura -->
    <div v-else-if="!broadcasts_new.length && broadcast_live != null" class="broadcastOndemand">
      <square color="rgba(14, 30, 100, 0.7)" size="45px" top="0" left="45px" />
      <square color="rgba(142, 142, 142, 0.7)" size="45px" top="45px" left="0px" />
      <square color="rgba(14, 30, 100, 0.8)" size="45px" bottom="45px" right="0px" />
      <square color="#3764ac" size="45px" bottom="0px" right="0px" />
      <square color="rgba(14, 30, 100, 0.8)" size="45px" bottom="0px" left="90px" />

      <icon-ondemand />Em breve transmissões
      <strong>on demand</strong>
    </div>

    <!-- Caso não tenha transmissões -->
    <warning v-else-if="broadcasts_avaiable">
      <h2>
        Não há transmissões
        <br />disponíveis
      </h2>
    </warning>
  </div>
</template>

<script>
import Warning from "@/views/smartphone/Warning";
import ListBroadcast from "@/modules/ListBroadcast";
import Media from "@/components/elements/Media";
import Square from "@/components/elements/Square";
import IconExclamation from "@/components/icons/IconExclamation";
import IconOndemand from "@/components/icons/IconOndemand";
import IconPlay from "@/components/icons/IconPlay";

import broadcastsService from "@/mixins/home";

export default {
  name: "Home",

  mixins: [broadcastsService],

  components: {
    Warning,
    ListBroadcast,
    Media,
    IconExclamation,
    IconOndemand,
    Square,
    IconPlay
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/home.scss";
</style>

