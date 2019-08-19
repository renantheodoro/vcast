<template>
  <div
    id="chat"
    ref="chat"
    class="view"
    :class="{'without-footer': !$route.meta.chat_menu}"
    v-touch:swipe.top="on_scroll_up"
  >
    <router-view ref="router" />

    <!-- Listagem do chat -->
    <div
      v-if="$route.meta.chat_list"
      id="chat-list"
      class="view-internal"
      v-scroll="on_scroll_up"
      v-touch:swipe.bottom="on_scroll_up"
    >
      <div
        id="loader-messages"
        class="center-align"
        v-if="loader_messages && !$loader.status"
      >
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
      </div>

      <div v-if="$chat.messages.length" ref="list-container" id="chat-scroll" class="container">
        <!-- <message
        :key="index"
        v-for="(message, index) in messages"
        :type="'received'"
        :id="message.CodChatMessage"
        :title="message.NickName"
        :text="message.Message"
        :date="message.Date"
        :likes="164"
        >-->
        <message
          :key="index"
          v-for="(message, index) in $chat.messages"
          :id="message.CodChatMessage"
          :ref="'message-' + message.CodChatMessage"
          :type="$chat.check_sender(message.NickName)"
        >
          <div class="message-content">
            <span v-if="message.NickName" class="message-title">{{message.NickName}}</span>
            <span
              v-else-if="message.NameUserOrigin"
              class="message-title"
            >{{message.NameUserOrigin}}</span>
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
      </div>

      <!-- Caso não tenha mensagens -->
      <warning v-else>
        <h2>
          Não há mensagens
          <br />por enquanto
        </h2>
      </warning>
    </div>

    <Footer v-if="$route.meta.chat_menu" id="chat-menu">
      <div class="container">
        <button-floating v-if="chat_avaiable">
          <a class="btn-floating">
            <icon-baloon />
            <icon-close-circle />
          </a>

          <ul>
            <li @click.prevent="subscribe_participant">
              <a class="btn-floating">
                <icon-user-plus type="grey" />
              </a>
              <div class="tooltip">inscrever funcionário</div>
            </li>
            <li @click.prevent="send_group">
              <a class="btn-floating">
                <icon-group type="grey" />
              </a>
              <div class="tooltip">pergunta coletiva</div>
            </li>
            <li @click.prevent="send_single">
              <a class="btn-floating">
                <icon-user type="grey" />
              </a>
              <div class="tooltip">pergunta individual</div>
            </li>
          </ul>
        </button-floating>

        <div v-else-if="!$loader.status || !chat_avaiable" class="row center-align no-mgn-b">
          <strong>Chat indisponível</strong>
        </div>
      </div>
    </Footer>
  </div>
</template>

<script>
import Warning from "@/views/tablet/Warning";

import ButtonFloating from "@/components/buttons/ButtonFloating";

import IconBaloon from "@/components/icons/IconBaloon";
import IconCloseCircle from "@/components/icons/IconCloseCircle";
import IconUserPlus from "@/components/icons/IconUserPlus";
import IconGroup from "@/components/icons/IconGroup";
import IconUser from "@/components/icons/IconUser";

import Preloader from "@/components/elements/Preloader";
import Message from "@/components/elements/Message";
import Footer from "@/modules/Footer";

import IconLikeFilled from "@/components/icons/IconLikeFilled";
import IconStatus from "@/components/icons/IconStatus";
import IconClap from "@/components/icons/IconClap";
import IconDislike from "@/components/icons/IconDislike";

import IconLikeLeaked from "@/components/icons/IconLikeLeaked";

//service
import ChatListService from "@/mixins/chat-list";

export default {
  name: "ChatList",

  mixins: [ChatListService],

  components: {
    Warning,
    ButtonFloating,
    IconBaloon,
    IconCloseCircle,
    IconUserPlus,
    IconGroup,
    IconUser,
    Preloader,
    Message,
    Footer,
    IconStatus
    // IconClap,
    // IconDislike,
    // IconLikeLeaked
  }
};
</script>

<style lang="scss">
</style>
