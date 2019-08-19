export default {
  data() {
    return {
      chat_avaiable: null,
      chat_blocked: null,
      broadcast: null,
      loader_messages: false,
      // videoLink: null,
      current_message: '',
      watchers: null,
      landscape: false,
      is_live: false,
      is_waiting: true,
      is_paused: false,
      is_finished: false,
      show_controls: false,
      show_controls_interval: null,
      keyboardVisible: false,
      isAndroid: false,
      isIos: false,
      windowHeight: 0
    };
  },

  methods: {
    initPlayer() {
      const self = this;
      const broadcastId = this.$broadcasts.current_broadcast.CodTransmissao

      if (process.env.VUE_APP_MODE == "smartphone") {

        VDPlayer.Initialize(
          broadcastId, // transmissao
          3134737, // usuario WCS
          437, // cliente WCS
          false, // controls
          'Mobile', // sessionId
          '127.0.0.1', // 
          'useragent',
          '82210B50-AAF2-4BCD-9B76-D2C2EC65889E', // token Bradesco
          'player_container', //
          false, // loading inicial
          false, // mute
          () => {
            self.is_live = false;
            self.$logger.log("Transmissão encerrada.", self.$transmission.current_broadcast.CodTransmissaoAoVivo);
          },
          data => {
            self.is_waiting = false
            self.is_live = true
            self.$logger.log("Transmissão ativa:", data);
          }, () => {
            self.is_waiting = true;
            self.$logger.log("Transmissão pausada.");
          },
          success => {
            if (!success) {
              VDPlayer.Play();
              self.$logger.log("Autoplay manual realizado.")
            } else self.$logger.log("Autoplay automático realizado.")

            self.is_waiting = false
            self.is_live = true
          }
        );

      }

    },

    onResume() {
      this.$logger.log("Aplicação em foreground.")
      // VDPlayer.Play();
      // this.is_paused = false;
      // this.closeControls()

      this.broadcastIn();

      this.initPlayer()
    },

    onPause() {
      this.$logger.log("Aplicação em background.")
      // VDPlayer.Pause();
      // this.show_controls = true;
      // this.is_paused = true;

      this.broadcastOut();

      this.is_live = false,
      this.is_waiting = true,
      this.is_paused = false,
      this.is_finished = false,
      this.show_controls = false,
      this.show_controls_interval = null

      VDPlayer.Destroy();
    },

    togglePlayContainer() {
      const self = this;
      clearTimeout(self.show_controls_interval)
      self.show_controls = !self.show_controls
      if (self.is_paused) return;
      self.closeControls()
    },

    closeControls() {
      const self = this;
      self.show_controls_interval = setTimeout(() => {
        if (self.is_paused) return;
        self.show_controls = false
      }, 4000)
    },

    playPauseBroadcast() {
      if (!this.is_live) return

      if (this.is_paused) {
        VDPlayer.Play();
        this.closeControls()
      } else VDPlayer.Pause();

      this.is_paused = !this.is_paused
    },
    
    initChat(callback) {
      const self = this;

      self.chat_avaiable = null
      self.chat_blocked = null

      let current_broadcast = self.$broadcasts.get_broadcast();

      if (current_broadcast) {
        self.broadcast = current_broadcast;
        self.$chat.clear_messages();
      } else {
        this.$router.push({
          name: "home"
        });
        self.$chat.clear_messages();
        return;
      }

      // se tiver internet
      if (self.$connection.status_internet) {
        self.broadcastIn();
        
        // pegando o status do chat
        self.$chat.get_chat_status(status => {
          if (status) {
            self.configure_chat(() => {
              self.chat_avaiable = true;
              self.$nextTick(() => {
                self.chatMaxHeight();
                self.scroll_down();
              })
            })
          } else self.chat_avaiable = false;

          self.$logger.log("Status do chat:", status)

          // if (self.chat_blocked == null) self.chat_blocked = false

          self.$loader.hide();
        });
      }

      // registrando WebHook para liberar/bloquear o chat
      self.$apiRequest.on("UpdateChatStatus", status => {
        self.$logger.log("Recebendo atualização do Status do Chat.", status);
        if (self.broadcast.CodTransmissao == status.mediaId) {
          self.chat_avaiable = status.ChatReleased == 1;
          self.$nextTick(() => {
            self.chatMaxHeight()
          })
        }
      });

      self.$chat.$on("nomsg", () => {
        self.loader_messages = false;
      })

      // atualização de mensagens on emit
      self.$chat.$on("updateMessages", (messages, new_messages) => {
        // console.log("updateMessages", messages, new_messages)

        if (!new_messages) {
          self.loader_messages = false;
        }

        self.chat_avaiable = true;

        if (!messages.length) return;

        // setTimeout(() => {
        self.$nextTick(() => {
          self.chatMaxHeight();
          if (self.scroll_verify()) self.scroll_down();
          self.loader_messages = false;
        })

        self.$chat.trySendLocalMessages();
        // }, 100);
      });

      // quando o status da mensagem do chat mudar
      self.$apiRequest.on("UpdateChatMessageStatus", response => {
        self.$logger.log("Status da mensagem atualizado!", response);
        self.$chat.update_messages_status(response.CodChatMessage, response.ChatStatus, response);
      });

      // quando a mensagem for recebida pelo moderador
      self.$apiRequest.on("UpdateChatMessage", response => {
        self.$logger.log("Mensagem recebida pelo moderador!", response);

        setTimeout(() => {
          // atualiza o status da mensagem
          self.$chat.update_messages_status(response.CodChatMessage, response.ChatStatus);

          let DateLastModify = self.$chat.messages.length ? self.get_last_message().DateLastModify : new Date();

          // atualiza a lista de mensagens
          self.$chat.update_messages(null, 10, DateLastModify, () => {
            self.loader_messages = false;
          });
        }, 300);
      });

      // if (process.env.VUE_APP_MODE == 'smartphone') {
      //   // GET Link broadcast
      //   if (self.broadcast != null) {
      //     self.$apiRequest.invoke("GetBroadcastsVideoLink", self.broadcast.CodTransmissao).then(url => {
      //       self.$logger.log("Link de transmissão:", url);
      //       self.videoLink = url
      //     });
      //   }
      // }
    },

    broadcastIn() {
      const self = this;
      
      // BROADCAST IN
      if (self.$broadcasts.current_broadcast != null) {
        self.$apiRequest.invoke("BroadcastIn", self.$broadcasts.current_broadcast.CodTransmissao);
        self.$logger.log("BroadcastIn", self.$broadcasts.current_broadcast.CodTransmissao);
      }

    },

    broadcastOut() {
      const self = this;

      // BROADCAST OUT
      if (self.$broadcasts.get_broadcast()) {
          self.$apiRequest.invoke("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
          self.$logger.log("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
      }
    },

    configure_chat(callback) {
      const self = this;

      // update messages
      // self.$chat.messages = []
      // self.$chat.messages_sent = []

      self.$chat.update_messages(0, 10, null, msg => {
        if (msg == "sem mensagens") return;
        self.loader_messages = false;
        if (callback) callback()
      });

    },

    toggle_chat() {
      this.chat_blocked = !this.chat_blocked
      if (!this.chat_blocked) this.scroll_down()
    },

    get_last_message() {
      return this.$chat.messages[this.$chat.messages.length - 1];
    },

    scroll_verify() {
      if (process.env.VUE_APP_MODE == 'tablet')
        if (!this.$route.meta.chat_list) return;

      if (this.chat_blocked) return false;

      if (!this.$chat.messages.length) return;

      // let container = document.getElementById("chat-list");
      let container = this.$refs['chatList'];

      let lastMessageObj = this.get_last_message();

      // let lastMessageEle = document.getElementById("message-" + lastMessageObj.CodChatMessage);
      let lastMessageEle = this.$refs["message-" + lastMessageObj.CodChatMessage];

      // console.log("status", this.chat_avaiable)
      // console.log("lastMessageEle", lastMessageEle)

      return (container != null && (container.scrollTop >= container.scrollHeight - container.offsetHeight - (lastMessageEle.offsetHeight * 2)))
    },

    on_scroll_up(eve, position) {
      const self = this;

      if (self.loader_messages) return;
      if (!self.$chat.messages.length) return;

      if (position.scrollTop == 0) {
        self.loader_messages = true;

        let messageReferenceId = self.$chat.messages[0].CodChatMessage;

        self.$chat.update_messages(messageReferenceId, 10, null, message => {
          // sem mensagens
          if (message == "sem mensagens") {
            self.loader_messages = false;
            return;
          } else {
            self.$nextTick(() => {
              self.scroll_with_reference(messageReferenceId);
              self.loader_messages = false;
            });
          }
        });
      } else {
        self.loader_messages = false;
      }
    },

    scroll_with_reference(referenceId = null) {
      if (process.env.VUE_APP_MODE == 'tablet')
        if (!this.$route.meta.chat_list) return;

      if (!this.$chat.messages.length) return;

      let container = document.getElementById('chat-list')

      // this.$nextTick(() => {
      let messageRender = document.getElementById("message-" + referenceId);

      if (!messageRender) return

      container.scrollTop = messageRender.offsetTop - 25;
      // });
    },

    scroll_down() {
      if (process.env.VUE_APP_MODE == 'tablet')
        if (!this.$route.meta.chat_list) return;

      if (!this.$chat.messages.length) return;

      this.$nextTick(() => {
        let container = document.getElementById("chat-list");
        container.scrollTop = container.scrollHeight
      })

    },

    send_single() {
      this.$router.push({
        name: "selecionar-participante",
        params: {
          broadcast: this.broadcast
        }
      });
    },

    send_group() {
      this.$chat.save_sender();
      this.$router.push({
        name: "enviar-mensagem",
        params: {
          broadcast: this.broadcast
        }
      });
    },

    subscribe_participant() {
      this.$router.push({
        name: "inscrever-participante",
        params: {
          broadcast: this.broadcast
        }
      });
    },

    add_participant() {
      this.$router.push({
        name: "adicionar-participante",
        params: {
          broadcast: this.broadcast
        }
      });
    },

    // smartphone
    send() {
      if (!this.chat_avaiable) return
      if (this.current_message == "") return
      if (this.chat_blocked) return

      const self = this;

      let sender = {
        SmartphoneUserName: ""
      }

      sender.SmartphoneUserName = this.$login.userName;

      this.$chat.save_sender(sender);

      let tempId = Math.round(Math.random() * 10000000);

      // IMPRIMIR A MSG COM RELOGIO
      let messageSended = {
        ChatStatus: -1, // -1 significa relogio
        CodChatMessage: tempId,
        DateLastModify: self.$helpers.get_current_time(),
        Message: self.current_message,
        NickName: sender.SmartphoneUserName
      };

      self.current_message = '';
      document.getElementById('textarea-chat').value = ""

      // salvando mensagem na lista
      self.$chat.send_message(messageSended, tempId);

      self.scroll_down()
    },

    update_watchers(response) {
      if (response == null || response == undefined) {
        this.$logger.warn('Falha no carregamento de espectadores:', response)
        return
      }
      this.watchers = response
      this.$logger.log('Quantidade de espectadores no momento:', response)
    },

    updateOrientation(orientation) {
      const self = this;

      self.keyboardVisible = false

      if (self.getOrientation().indexOf('portrait') > -1) {
        // remove viewport cover
        // document.getElementsByTagName('meta').viewport.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=no')

        self.landscape = false

        if (StatusBar) {
          StatusBar.show();
        }

        let time = 200

        if (window.device) {
          if (window.device.platform == "Android") {
            time = 1000
          }
        }

        setTimeout(() => {
          self.keyboardVisible = false
          self.scroll_down()
        }, time)

      } else {
        // add viewport cover
        // document.getElementsByTagName('meta').viewport.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=no,viewport-fit=cover')

        self.landscape = true

        self.keyboardVisible = false

        if (StatusBar) {
          StatusBar.hide();
        }
      }
    },

    fullscreen() {
      // if(!this.is_live) return
      // VDPlayer.FullScreen()

      this.landscape = false

      if (this.getOrientation().indexOf('portrait') > -1) {
        screen.orientation.unlock("portrait");
        screen.orientation.lock("landscape-primary");
        setTimeout(() => {
          screen.orientation.lock("landscape");
          // screen.orientation.unlock("landscape"); 
        }, 300)
      } else {
        screen.orientation.unlock("landscape");
        screen.orientation.lock("portrait-primary");
        setTimeout(() => {
          screen.orientation.unlock("portrait-primary");
        }, 200)
      }
    },

    getOrientation() {
      return screen.orientation.type
    },

    chatMaxHeight() {
      const chatList = document.getElementById("chat-list");

      let chatMenuHeight = 60;

      // let style = 'max-height: calc(100% - ' + (this.proportion || 0) + 'px - ' + chatMenuHeight + 'px)';
      let style = 'max-height: calc(100% - ' + (this.proportion || 0) + 'px)';

      if (window.device || process.env.VUE_APP_DEV == "false") {
        if (window.device.platform == "iOS")
          style = '--safe-area-inset-bottom: env(safe-area-inset-bottom); max-height: calc(100% - ' + (this.proportion || 0) + 'px - ' + chatMenuHeight + 'px - var(--safe-area-inset-bottom))';
      }

      chatList.style = style;
    },

    ajustView(visible) {
      if (window.device) {
        if (window.device.platform == "Android") {
          if (this.landscape == false)
            if (visible)
              this.keyboardVisible = true
          else
            this.keyboardVisible = false
        }
      }
    },
  },

  created() {
    if (process.env.VUE_APP_DEV == "true") return;

    if (window.device) {
      if (window.device.platform == "Android") {
        this.isAndroid = true
      }

      if (window.device.platform == "iOS") {
        this.isIos = true
      }
    }
  },

  computed: {
    proportion() {
      return window.innerWidth / 16 * 9 || 210
    }
  },

  mounted() {
    const self = this;

    if(window.device || process.env.VUE_APP_DEV == "false") {
      if(window.device.platform == "iOS"){
        document.addEventListener("resume", this.onResume, false);
        document.addEventListener("pause", this.onPause, false);
      }
    }

    self.$nextTick(() => {
      self.initPlayer();
      self.initChat();

      self.windowHeight = window.innerHeight;

      // ajuste na view
      window.addEventListener('resize', e => {
        let currentHeight = e.srcElement.innerHeight;

        // console.log("anterior:", self.windowHeight)
        // console.log("atual:", currentHeight)

        // abriu
        if (self.windowHeight > currentHeight)
          self.ajustView(true)
        else
          // fechou
          self.ajustView(false)

        self.windowHeight = currentHeight;
      });

    })

    // self.$connection.$on("internetStatus", status => {
    //   if (self.$apiRequest.connectionState != 1) return;
    //   if (self.$route.path.indexOf("chat") == -1) return
    //   if (!status) return;

    //   // console.log("--- INTERNET ON   trySendLocalMessages")

    //   self.$chat.trySendLocalMessages();
    // })

    self.$connection.$on('connected', status => {
      if (self.$route.path.indexOf("chat") == -1) return

      // console.log("---   chat update messages")

      self.$chat.update_messages(0, 10, null, msg => {
        if (msg == "sem mensagens") return;
        self.loader_messages = false;
      });
    })

    self.$apiRequest.invoke("WatchingBroadcastTotal", self.$broadcasts.current_broadcast.CodTransmissao).then(response => {
      self.update_watchers(response)
    }).catch(err => {
      self.$logger.error('Erro no carregamento de espectadores', err)
    })

    self.$apiRequest.on("UpdateWatchingBroadcastTotal", response => {
      self.update_watchers(response)
    })

    // buscando spot
    let spot = self.$connection.spot
    self.$chat.update_spot(spot);

    if (process.env.VUE_APP_DEV == "false") {
      try {
        StatusBar.show();
      } catch (err) {
        console.error(err)
      }

      // Assinatura de redimensionamento
      screen.orientation.unlock("portrait");

      window.addEventListener("orientationchange", function () {
        self.updateOrientation()
      });
    }
    }
  
};