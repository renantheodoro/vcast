<template>
  <div id="base-tablet" class="base">
    <!-- Aviso sem conexão com o servidor -->
    <warning v-if="!app_connected || server_off" classes="warning-full">
      <h2>
        Não foi possível
        <br />conectar com o servidor.
      </h2>
      <button-action @action="touch_reconnect">TOQUE PARA TENTAR NOVAMENTE</button-action>
    </warning>

    <!-- Header -->
    <Header v-if="app_connected && !server_off && current_channel">
      <template v-slot:default="prop">
        <div class="header-filled">
          <div class="container">
            <div class="row no-mgn-b valign-wrapper">
              <div class="col s6 left-align">
                <router-link :to="{name: 'home'}" class="brand-logo left">
                  <logo />
                </router-link>
              </div>
              <div class="col s6 right-align">
                <strong>Comunicação Integrada</strong>
                <div class="valign-wrapper right">
                  <span v-if="status_internet">online</span>
                  <span v-else>offline</span>
                  <div id="circle-status" :class="{'online': status_internet}"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="header-bottom">
          <div class="container">
            <div class="valign-wrapper no-mgn-t no-mgn-b">
              <div class="item-content">
                <a @click.stop="$covers.show_sideslide('channel')" class="item-before">
                  <icon-rotate-arrows />
                </a>
                <div class="item-text">
                  <div class="item-inner">
                    {{current_channel.Nome}}
                    <br />
                    <strong>{{current_channel.NomeCanal}}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Header>

    <router-view v-if="app_connected && !server_off && current_channel" />

    <!-- Footer (menu principal) -->
    <Footer
      id="main-menu"
      v-if="app_connected && !server_off && current_channel && $route.meta.main_menu"
    >
      <div class="container">
        <router-link to="/" class="waves-effect waves-light">
          <icon-home />
        </router-link>
        <router-link :to="{name: 'listagem-usuarios'}" class="waves-effect waves-light">
          <icon-menu-group />
        </router-link>
        <router-link :to="{name: 'usuario'}" class="waves-effect waves-light">
          <icon-menu-user />
        </router-link>
        <!-- <a @click.prevent="$covers.show_sidenav" class="sidenav-trigger waves-effect waves-light"> -->
        <a @click.prevent data-target="slide-out" class="sidenav-trigger waves-effect waves-light">
          <icon-menu />
        </a>
      </div>
    </Footer>

    <!-- Sidenav (Menu) -->
    <Sidenav
      v-if="app_connected  && !server_off && current_channel != null"
      :token="tokenPlayer"
      :ip_channel="current_channel.IP"
      ref="sidenav"
    >
      <template v-slot:default="{props: props}">
        <div class="row"></div>
        <div id="sidenav-content">
          <range v-if="props.volume_status" title="Volume" :value="props.volume" />
          <div v-else class="row center-align">
            <loader v-if="!props.error_volume" size="small" />
            <div v-else>Não foi possível atualizar o volume do player.</div>
          </div>

          <!-- <range title="Brilho"/> -->
        </div>

        <div class="row">
          <ul class="simple-list">
            <li class="list-item" @click.prevent="accessRestrict()">
              <a class="waves-effect">Configurações</a>
            </li>
            <li class="list-item">
              <a
                @click.prevent="$covers.show_sideslide('privacity')"
                class="waves-effect"
              >Privacidade</a>
            </li>
            <li class="list-item">
              <a @click.prevent="$covers.show_sideslide('about')" class="waves-effect">Sobre</a>
            </li>
            <li class="list-item">
              <a @click.prevent="$covers.show_sideslide('help')" class="waves-effect">Ajuda</a>
            </li>
          </ul>
        </div>

        <!-- <div class="row">
      <points/>
        </div>-->

        <div id="sidenav-footer">
          <div id="version">versão 2.1.5</div>

          <div id="powered" class="right-align">
            Powered by
            <icon-voxel color="color" />
            <icon-vcast />
          </div>
        </div>
      </template>
    </Sidenav>

    <!-- Sideslide (Troca de canais/Informativos) -->
    <Sideslide v-if="app_connected && !server_off" :current_channel="current_channel">
      <template v-slot:default="{props: props}">
        <div id="sideslide-header">
          <div class="container">
            <div class="row no-mgn-b">
              <div class="col s2 left-align">
                <button-icon v-if="current_channel != null" @action="props.close">
                  <icon-angle-left />
                </button-icon>
              </div>
              <div class="col s10 center-align">
                <strong>{{props.Titulo}}</strong>
              </div>
              <div class="col s2"></div>
            </div>
          </div>
        </div>

        <!-- Troca de canais -->
        <list-channels v-show="props.channel_status" />

        <!-- Políticas de privacidade -->
        <privacity v-show="props.privacity_status" />

        <!-- Ajuda -->
        <help v-show="props.help_status" />

        <!-- Sobre -->
        <about v-show="props.about_status" />
      </template>
    </Sideslide>
  </div>
</template>

<script>
/* ==== COMPONENTS ==== */

// MÚDULOS
import Header from "@/modules/Header";
import Footer from "@/modules/Footer";
import ListView from "@/modules/ListView";
import Sideslide from "@/modules/Sideslide";
import Sidenav from "@/modules/Sidenav";
import Warning from "@/views/tablet/Warning";

// ELEMENTS
// import SplashScreen from "@/views/SplashScreen";
import Logo from "@/components/elements/Logo";
import Points from "@/components/elements/Points";
import Square from "@/components/elements/Square";
import Loader from "@/components/elements/Loader";

// BOTÕES
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";

// ELEMENTS DE FORMULÁRIO
import Range from "@/components/forms/Range";
import Option from "@/components/forms/Option";

// ICONES
import IconHome from "@/components/icons/IconHome";
import IconMenuGroup from "@/components/icons/IconMenuGroup";
import IconMenuUser from "@/components/icons/IconMenuUser";
import IconMenu from "@/components/icons/IconMenu";
import IconRotateArrows from "@/components/icons/IconRotateArrows";
import IconVoxel from "@/components/icons/IconVoxel";
import IconVcast from "@/components/icons/IconVCast";
import IconAngleLeft from "@/components/icons/IconAngleLeft";

// VIEWS
const basePath = process.env.VUE_APP_MODE; // tablet ou smartphone

const ListChannels = require("@/views/" + basePath + "/ListChannels.vue")
  .default;
const Privacity = require("@/views/" + basePath + "/Privacity.vue").default;
const Help = require("@/views/" + basePath + "/Help.vue").default;
const About = require("@/views/" + basePath + "/About.vue").default;

/* ==== SERVICES ==== */
// import BaseConnections from "@/mixins/base";

export default {
  name: "BaseTablet",

  // mixins: [BaseConnections],

  data() {
    return {
      // config api
      token: "apikey 88D736D0-4D4B-337D-A2FC-517892F95DC3",
      tokenPlayer: "aa84db9c-8644-495d-b8b2-1aa38ed1415c",
      spot: null,
      connId: null,
      serial: null,

      // se api foi conectada
      app_connected: false,

      // conexao com internet
      status_internet: true,

      // conexao com o servidor
      server_off: false,

      // timeout de reconexão
      connection_timeout_interval: null,
      connection_timeout_times: 1,

      // canal atual
      current_channel: null
    };
  },

  methods: {
    /* internet on */
    onOnline() {
      this.status_internet = true;
    },

    /* internet off */
    onOffline() {
      this.status_internet = false;
    },

    /* Inicia a conexão com a api */
    connectApp() {
      let self = this;

      // para o intervalo de reconexão
      if (self.connection_timeout_interval)
        clearTimeout(self.connection_timeout_interval);

      if (self.current_channel) self.$loader.show();

      self.$apiRequest
        .start()
        .then(() => {
          self.registerApp();
          self.server_off = false; // mensagem de erro de conexao com o servidor
          self.clean_timeout_time();
          self.$logger.log("Conexão com servidor iniciada com sucesso.");
        })
        .catch(error => {
          self.reconnection_schedule();

          self.$covers.hide_splashscreen();
          self.$loader.hide();
          self.server_off = true; // mensagem de erro de conexao com o servidor

          self.$logger.error("Falha na inicialização do servidor.", error);
        });
    },

    clean_timeout_time() {
      this.connection_timeout_times = 1;
    },

    reconnection_schedule() {
      const self = this;

      //SE PERDER A CONEXÃO MOSTRA A TELA DE RECONNECT
      if (!this.status_internet) {
        clearTimeout(self.connection_timeout_interval);
        self.app_connected = false;
        self.server_off = true;
        return;
      }

      //TENTAR RECONECTAR
      if (self.connection_timeout_times <= 2) {
        self.$logger.log("Tentanto reconectar-se com o servidor...");
        self.connection_timeout_interval = setTimeout(() => {
          // tenta reconectar apenas 2 vezes
          self.$logger.log(
            "Tentativa de reconexão " + self.connection_timeout_times + " de 2."
          );
          self.connectApp();
          self.connection_timeout_times++;
          clearTimeout(self.connection_timeout_interval);
        }, 5000);
      } else {
        self.$loader.hide();
        self.app_connected = false;
        self.server_off = true;
      }
    },

    touch_reconnect() {
      const self = this;
      self.$loader.show();
      self.clean_timeout_time();
      self.connectApp();
    },

    registerApp() {
      const self = this;

      if (process.env.VUE_APP_DEV == "false") {
        cordova.plugins.deviceInformation.getDeviceInfo(
          result => {
            self.serial = result.serial;
            self.registerAppCallback();
            self.$logger.log("SERIAL recebido:", self.serial);
          },
          err => {
            return self.$logger.error("Erro no recebimento de SERIAL", err);
          }
        );
      } else {
        // self.serial = "NSerie_1";
        //self.serial = "RX2KA00MKLT"; // meu tablet
        self.serial = "RX2KA00LNWN"; // tablet do bazzo
        self.$logger.log("SERIAL recebido:", self.serial);
        self.registerAppCallback();
      }
    },

    registerAppCallback() {
      const self = this;
      // funfact: se fizer qualquer outra chamada sem se registrar o retorno sempre vai ser null
      self.$apiRequest
        .invoke("AppRegister", self.serial, self.token)
        .then(_connId => {
          if (!_connId) {
            self.app_connected = false;
            return self.$logger.error(
              "Falha na inicialização do servidor.",
              ""
            );
          }

          self.$connection.connId = _connId;

          if (_connId) {
            // busca os detalhes do lugar
            self.$logger.log(
              "Aplicação registrada com sucesso!",
              "ID de conexão: ",
              _connId
            );

            self.$loader.hide();
            self.app_connected = true;
            self.updateSpot();
          } else {
            self.$logger.error(
              "Erro no registro da aplicação.",
              "connId: ",
              _connId
            );
            self.$loader.show();
            self.app_connected = false;
          }
        })
        .catch(err => {
          self.$logger.error("Erro no registro da aplicação.", err);
          self.$loader.show();
        });
    },

    /* Atualiza o spot */
    updateSpot() {
      const self = this;

      self.$apiRequest.invoke("GetSpot").then(data => {
        self.spot = data;

        if (self.spot) {
          self.$logger.log("Spot carregado:", self.spot);
        } else {
          self.$logger.error("Erro no carregamento do Spot:", self.spot);
          setTimeout(() => {
            self.$logger.warn("Não foi possível atualizar o Spot.");
            self.$logger.warn("Tentando requisitar Spot novamente...");
            self.updateSpot();
          }, 5000);
        }
      });
    },

    accessRestrict() {
      let $self = this;

      $self.$messages.alert({
        header: "Acesso restrito",
        message: "Digite a senha.",
        inputs: [
          {
            name: "password",
            placeholder: "Senha",
            type: "password"
          }
        ],
        buttons: [
          {
            text: "Ok",
            // role: "cancel",
            cssClass: "secondary",
            handler: data => {
              if (data.password == "voxel!QAZ@WSX") {
                $self.$refs.sidenav.get_cameras().then(cameras => {
                  if (
                    cameras == null ||
                    cameras == undefined ||
                    cameras.length == 0
                  ) {
                    $self.$messages.alert({
                      header: "Nenhuma câmera instalada",
                      message: "Verifique a instalação da câmera.",
                      buttons: [
                        {
                          text: "Ok",
                          cssClass: "secondary",
                          handler: () => {}
                        }
                      ]
                    });
                  } else {
                    $self.showCameras(cameras);
                  }
                });
              }
            }
          },
          {
            text: "Cancelar",
            handler: () => {}
          }
        ]
      });
    },
    showCameras(items) {
      let $self = this;
      let inputs = [];
      for (let index = 0; index < items.length; index++) {
        const element = items[index];
        inputs.push({
          type: "radio",
          label: element,
          value: element,
          checked: false
        });
      }
      $self.$messages.alert({
        header: "Teste de câmera",
        message: "Selecione uma câmera",
        inputs: inputs,
        buttons: [
          {
            text: "Ok",
            cssClass: "secondary",
            handler: data => {
              $self.testCamera(data);
            }
          },
          {
            text: "Cancelar",
            handler: () => {}
          }
        ]
      });
    },
    testCamera(name) {
      let $self = this;
      $self.$refs.sidenav.start_camera(name).then(
        () => {
          $self.$messages.alert({
            header: "Testando câmera",
            message: "Deseja parar o teste da câmera: " + name,
            buttons: [
              {
                text: "Sim",
                handler: data => {
                  $self.$refs.sidenav.stop_camera();
                }
              }
            ]
          });
        },
        () => {}
      );
    }
  },

  created() {
    const self = this;

    self.current_channel = self.$channel.get_current_channel();

    self.$loader.show();

    // get/update data
    self.$connection.$on("getData", (key, callback) => {
      callback(self[key]);
    });

    self.$connection.$on("updateData", (key, value) => {
      self[key] = value;
    });

    self.$channel.$on("updateChannel", channel => {
      self.current_channel = channel;
    });

    // conecta com o servidor
    self.connectApp();

    self.status_internet = navigator.onLine;

    self.$apiRequest.onclose(() => {
      self.$logger.warn("Conexão websocket perdida.");
      self.clean_timeout_time();
      self.reconnection_schedule();
      // self.$loader.hide()
      self.server_off = true; // mensagem de erro de conexao com o servidor
    });

    // eventos de conexao com internet
    document.addEventListener("online", this.onOnline, false);
    document.addEventListener("offline", this.onOffline, false);
  },

  mounted() {
    const self = this;

    // fecha a splashscreen
    self.$covers.hide_splashscreen();

    // Abre seleção de canais caso não haja canal registrado no storage
    if (!self.current_channel) {
      self.$loader.show();
      self.$covers.show_sideslide("channel");
    }

    /* DEFINIÇÕES DE CHAMADAS PASSIVAS DA API */
    // é chamado quando o lugar foi atualizado..
    self.$apiRequest.on("UpdateSpot", response => {
      self.$logger.log("Local atualizado.");
      self.$logger.log("Novo Spot recebido:", response);
      self.updateSpot();
    });

    // para teste
    if (process.env.VUE_APP_DEV == "true") {
      self.status_internet = true;
    }

    // é chamado quando o atualizar a quantidade de dispositivos assistindo a transmissão que este dispositivo esta assistindo..
    // self.$apiRequest.on("UpdateWatchingBroadcastTotal", response => {
    //   console.log("UpdateWatchingBroadcastTotal?:", response);
    // });

    // self.$apiRequest.on("UpdatePlayer", response => {
    //   console.log("--UpdatePlayer?:", response);
    // });

    // self.$apiRequest.on("UpdatePlayerSpot", response => {
    //   console.log("--UpdatePlayerSpot?:", response);
    // });
  },

  components: {
    // MÚDULOS
    Header,
    Footer,
    ListView,
    Sideslide,
    Sidenav,
    Warning,
    // ELEMENTS
    Logo,
    Points,
    Square,
    // BOTÕES
    ButtonAction,
    ButtonIcon,
    // ELEMENTS DE FORMULÁRIO
    Range,
    Option,
    // ICONES
    IconHome,
    IconMenuGroup,
    IconMenuUser,
    IconMenu,
    IconRotateArrows,
    IconVoxel,
    IconVcast,
    IconAngleLeft,
    // VIEWS
    ListChannels,
    Privacity,
    Help,
    About,
    Loader
  }
};
</script>
