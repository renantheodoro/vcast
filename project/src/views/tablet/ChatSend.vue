<template>
  <div id="chat-send" class="view-internal">
    <div id="close" class="close">
      <button-icon
        @action="$router.push({
          name: 'listagem-mensagens',
          params: { broadcast: broadcast, scroll_down: true }
        })"
      >
        <icon-close/>
      </button-icon>
    </div>
    <div class="container">
      <div class="block-send">
        <strong>Participante</strong>
        <p>{{$chat.get_sender().Name}}</p>
      </div>
      <div class="block-send">
        <strong>Mensagem</strong>
        <textarea v-model="current_message" placeholder="Digite sua mensagem aqui"></textarea>
      </div>

      <button-send @action="send">
        <icon-send/>
      </button-send>
    </div>
  </div>
</template>

<script>
import ButtonIcon from "@/components/buttons/ButtonIcon";
import ButtonSend from "@/components/buttons/ButtonSend";
import IconSend from "@/components/icons/IconSend";
import IconClose from "@/components/icons/IconClose";

import ChatSendService from "@/mixins/chat-send";

export default {
  name: "ChatSend",

  mixins: [ChatSendService],

  components: { ButtonIcon, ButtonSend, IconSend, IconClose }
};
</script>