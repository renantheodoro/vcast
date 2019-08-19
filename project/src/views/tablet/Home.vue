<template>
  <div id="home" class="view">
    <!-- Transmissão ao vivo -->
    <router-link
      v-if="broadcasts_avaiable && broadcast_live != null"
      id="broadcastsLive"
      class="liveCard"
      :to="{ name: 'transmissao', params: { broadcast: broadcast_live }}"
    >
      <div class="degrade"></div>
      <div class="liveImage">
        <media
          :src="$helpers.get_api_url() + 'broadcast/image/' + broadcast_live.ImagemHorizontal"
        />
      </div>

      <div class="liveSignal pulse">ao vivo</div>
      <div class="liveText">
        <div class="liveTitle">{{broadcast_live.Titulo}}</div>
        <div v-if="broadcast_live.Subtitulo" class="liveSubtitle">{{broadcast_live.Subtitulo}}</div>
        <div
          class="liveDate"
        >{{$helpers.get_date(broadcast_live.DataInicio)}} às {{$helpers.get_time(broadcast_live.DataInicio)}}</div>
      </div>
    </router-link>

    <!-- Lista de transmissões (futuras) -->
    <div v-if="broadcasts_avaiable && broadcasts_new.length" id="broadcastsList">
      <div class="listTitle">Próximas Transmissões</div>
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
              <div v-if="item.Subtitulo" class="card-subtitle">
                <p>{{item.Subtitulo}}</p>
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
    <div
      v-else-if="!broadcasts_new.length && broadcast_live != null && !$loader.status"
      class="broadcastOndemand"
    >
      <square color="rgba(14, 30, 100, 0.7)" top="338px" left="0px" />
      <square color="#3764ac" top="417px" left="0px" />
      <square color="rgba(95, 95, 95, 0.7)" bottom="0px" right="0px" />
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
import Warning from "@/views/tablet/Warning";
import ListBroadcast from "@/modules/ListBroadcast";
import Media from "@/components/elements/Media";
import Square from "@/components/elements/Square";
import IconExclamation from "@/components/icons/IconExclamation";
import IconOndemand from "@/components/icons/IconOndemand";

import BroadcastsService from "@/mixins/home";

export default {
  name: "Home",

  mixins: [BroadcastsService],

  components: {
    Warning,
    ListBroadcast,
    Media,
    IconExclamation,
    IconOndemand,
    Square
  }
};
</script>
