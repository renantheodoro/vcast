<template>
  <div
    id="chat"
    ref="chat"
    class="view no-pad-t no-pad-b"
    :class="{'without-footer': !$route.meta.chat_menu, 'fullscreen': landscape, 'keyboardVisible' : keyboardVisible, 'android': isAndroid, 'ios': isIos}"
  >
    <!-- broadcastssão ao vivo -->
    <div ref="videoContainer" class="liveCard" :style="{height: proportion + 'px'}">
      <div class="liveImage">
        <div id="videoBroadcastContainer" class="media">
          <loader v-show="is_waiting" size="small" color="white" />

          <div id="player_container" class="fill-size">
            <!-- video tag -->
          </div>

          <div v-show="!is_waiting && !is_live" class="absolute fill-size flex-center center-align">
            <strong class="big color-white">Transmissão finalizada</strong>
          </div>

          <div
            v-show="!is_waiting && is_live"
            @click="togglePlayContainer"
            id="play-container"
            class="fill-size"
            :class="{'bg':show_controls}"
          >
            <div
              v-if="show_controls && is_paused"
              @click.stop="playPauseBroadcast"
              class="play"
              :class="{'visible': is_paused}"
            >
              <icon-play />
              <!-- <i v-else class="material-icons">pause</i> -->
            </div>
            <div
              v-if="show_controls && !is_paused"
              @click.stop="playPauseBroadcast"
              class="play"
              :class="{'visible': is_paused}"
            >
              <icon-pause />
            </div>
          </div>
        </div>
      </div>

      <div v-if="is_live" class="liveSignal pulse">ao vivo</div>

      <div v-if="is_live && watchers != null" class="liveWatchers">
        <i class="material-icons">remove_red_eye</i>
        <strong>{{watchers}}</strong>
      </div>

      <div v-show="!is_waiting && is_live && show_controls" class="liveButtons right-align">
        <a @click="fullscreen">
          <icon-expand v-show="!landscape" />
          <icon-minimize v-show="landscape" />
        </a>

        <a v-if="chat_avaiable && !landscape" id="btn-block-chat" @click.prevent="toggle_chat">
          <icon-baloon :blocked="chat_blocked" size="25px" color="#fff"></icon-baloon>
        </a>
      </div>
    </div>

    <!-- Listagem do chat -->
    <!-- <div id="chat-list" class="view-internal" :class="{'blocked': chat_blocked}"> -->

    <div
      id="chat-list"
      ref="chatList"
      class="view-internal container"
      v-scroll="on_scroll_up"
      v-touch:swipe.bottom="on_scroll_up"
      v-show="!landscape && chat_avaiable !== false"
    >
      <div
        v-if="chat_avaiable == true && !chat_blocked && loader_messages"
        id="loader-messages"
        class="center-align"
      >
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </div>

      <message
        v-if="chat_avaiable && chat_blocked != true"
        :key="index"
        v-for="(message, index) in $chat.messages"
        :id="message.CodChatMessage"
        :ref="'message-' + message.CodChatMessage"
        :type="$login.get_data('userName') == message.NickName"
      >
        <!-- :type="$chat.check_sender(message.NickName)" -->
        <div class="message-content">
          <span v-if="message.NickName" class="message-title">{{message.NickName}}</span>
          <span v-else-if="message.NameUserOrigin" class="message-title">{{message.NameUserOrigin}}</span>
          <p class="message-text">{{message.Message}}</p>
        </div>

        <div class="message-action">
          <div class="left">
            <div class="message-info">
              <!-- <a @click="count_like(message.CodChatMessage)">Curtir</a> -->
              <span>{{$helpers.get_time(message.DateLastModify)}}</span>
            </div>
          </div>
          <div class="right right-align">
            <!-- <div class="message-like-count blue">
              <icon-like-filled/>
              <span class="likes">{{message_props.likes}}</span>
            </div>-->

            <div
              v-if="$chat.check_sender(message.NickName || message.NameUserOrigin)"
              class="message-status"
            >
              <icon-status :status="$chat.get_message_status(message.ChatStatus)" />
            </div>
          </div>
        </div>
      </message>

      <!-- Caso não tenha mensagens -->
      <warning
        v-if="chat_avaiable && !chat_blocked && !$chat.messages.length"
        :squareMinVersion="true"
      >
        <h2>
          Não há mensagens
          <br />por enquanto
        </h2>
      </warning>

      <div
        v-if="chat_avaiable && chat_blocked"
        class="absolute x-y-0 fill-size flex-center flex-column pad-space-lateral"
      >
        <icon-baloon :blocked="chat_blocked" size="81px" color="#CBCBCB" />
        <h2 class="mgn-top-default">
          <strong class="color-grey-light-4">Chat bloqueado</strong>
        </h2>
      </div>

      <div v-if="chat_avaiable == null" class="fill-size flex-center absolute x-y-0">
        <loader size="small" />
      </div>
    </div>

    <div
      v-if="!landscape && chat_avaiable == false"
      id="chat-unavaiable"
      class="fill-size flex-center flex-column pad-space-lateral"
    >
      <icon-baloon :blocked="true" size="81px" color="#CBCBCB" />
      <h2 class="mgn-top-default">
        <strong class="color-grey-light-4">Chat indisponível</strong>
      </h2>
    </div>

    <Footer v-if="!landscape" id="chat-menu" ref="chatMenu">
      <div class="container">
        <form @submit.prevent="send">
          <chat-textarea
            id="textarea-chat"
            ref="textarea-chat"
            placeholder="Envie um comentário"
            v-model.trim="current_message"
          />
          <!-- @onFocusIn="ajustView(true)"
          @onFocusOut="ajustView(false)"-->
          <!-- @onFocusIn="$hel≈pers.ensureVisible($event)" -->
          <button-send>
            <icon-send />
          </button-send>
        </form>
      </div>
    </Footer>
  </div>
</template>

<script>
import Warning from "@/views/smartphone/Warning";

import ButtonFloating from "@/components/buttons/ButtonFloating";
import ButtonSend from "@/components/buttons/ButtonSend";

import IconBaloon from "@/components/icons/IconBaloon";
import IconCloseCircle from "@/components/icons/IconCloseCircle";
import IconUserPlus from "@/components/icons/IconUserPlus";
import IconGroup from "@/components/icons/IconGroup";
import IconSend from "@/components/icons/IconSend";
import IconUser from "@/components/icons/IconUser";
import IconExpand from "@/components/icons/IconExpand";
import IconMinimize from "@/components/icons/IconMinimize";
import IconPlay from "@/components/icons/IconPlay";
import IconPause from "@/components/icons/IconPause";

import ChatTextarea from "@/components/forms/ChatTextarea";

import Media from "@/components/elements/Media";
import Video from "@/components/elements/Video";
import Preloader from "@/components/elements/Preloader";
import Loader from "@/components/elements/Loader";
import Message from "@/components/elements/Message";
import Footer from "@/modules/Footer";

import IconLikeFilled from "@/components/icons/IconLikeFilled";
import IconStatus from "@/components/icons/IconStatus";
import IconClap from "@/components/icons/IconClap";
import IconDislike from "@/components/icons/IconDislike";

import IconLikeLeaked from "@/components/icons/IconLikeLeaked";

//service
import ChatListService from "@/mixins/chat-list";

// import VDPlayer from "@/assets/js/vdplayer.js";

// console.log("VDPlayer", VDPlayer);

export default {
  name: "ChatList",

  mixins: [ChatListService],

  components: {
    Warning,
    ButtonFloating,
    ButtonSend,
    IconBaloon,
    IconCloseCircle,
    IconUserPlus,
    IconGroup,
    IconUser,
    IconExpand,
    IconMinimize,
    IconPlay,
    IconPause,
    ChatTextarea,
    Media,
    Video,
    Preloader,
    Loader,
    Message,
    Footer,
    IconStatus,
    IconSend
    // IconClap,
    // IconDislike,
    // IconLikeLeaked
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/chat.scss";
</style>

