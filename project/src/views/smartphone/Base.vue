<template>
  <div id="base-smartphone" class="base">
    <!-- cache preloader -->
    <!-- <iframe
      src="http://ah-viz-wcs.voxeldigital.com.br/preloader.html"
      style="position: fixed; z-index: -1; visibility: hidden;"
    ></iframe>-->

    <!-- Aviso sem conexão com o servidor -->
    <!-- <warning v-if="true" classes="warning-full"> -->
    <!-- <i class="material-icons">portable_wifi_off</i> -->
    <!-- <warning v-if="!app_connected && !$loader.status" classes="warning-full">
      <h2>
        Não foi possível
        <br />conectar com o servidor.
      </h2>
      <button-action @action="$connection.verifyConnection">TOQUE PARA TENTAR NOVAMENTE</button-action>
    </warning>-->

    <!-- Aviso sem conexão com o servidor -->
    <div
      v-if="$connection.status_internet == false || $connection.server_connected == false"
      id="connection-warning"
    >
      <h2
        v-if="$connection.status_internet == false && $connection.server_connected == true"
      >Sem conexão com a internet</h2>
      <h2 v-else-if="$connection.server_connected == false">Tentando conectar-se com o servidor...</h2>
    </div>

    <!-- <warning v-if="$connection.status_internet == false && !$loader.status" classes="warning-full">
      <h2>
        Verifique sua conexão
        <br />com a internet.
      </h2>
      <button-action @action="$connection.verifyConnection">TOQUE PARA TENTAR NOVAMENTE</button-action>
    </warning>-->

    <!-- Header -->
    <Header v-if="$connection.render_components && $connection.render_components != null">
      <template v-slot:default="prop">
        <div class="header-filled">
          <div class="container">
            <div class="row no-mgn-b valign-wrapper">
              <div class="col s6 left-align">
                <router-link :to="{name: 'home'}" class="brand-logo left">
                  <logo :size="92" />
                </router-link>
              </div>
              <div class="col s6 right-align">
                <a @click.prevent="$covers.show_sideslide('menu')">
                  <icon-menu size="22px" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Header>

    <router-view />

    <!-- Sideslide (Troca de canais/Informativos) -->
    <Sideslide>
      <template v-slot:default="{props: props}">
        <div id="sideslide-header" class="no-mgn-b">
          <div class="container no-pad-l">
            <div class="row no-mgn-b">
              <div class="col s2 left-align">
                <button-icon @action="props.close">
                  <icon-angle-left />
                </button-icon>
              </div>
              <div class="col s10 center-align">
                <strong>{{props.title}}</strong>
              </div>
              <div class="col s2"></div>
            </div>
          </div>
        </div>

        <div id="sideslide-content">
          <!-- Cadastro -->
          <register v-show="props.register_status" />

          <!-- Menu -->
          <Menu v-show="props.menu_status" />

          <!-- Políticas de privacidade -->
          <privacity v-show="props.privacity_status" />

          <!-- Ajuda -->
          <help v-show="props.help_status" />

          <!-- Sobre -->
          <about v-show="props.about_status" />
        </div>
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
import Warning from "@/views/smartphone/Warning";

// ELEMENTS
// import SplashScreen from "@/views/SplashScreen";
import Logo from "@/components/elements/Logo";
import Square from "@/components/elements/Square";

// BOTÕES
import ButtonAction from "@/components/buttons/ButtonAction";
import ButtonIcon from "@/components/buttons/ButtonIcon";

// ICONES
import IconMenuUser from "@/components/icons/IconMenuUser";
import IconMenu from "@/components/icons/IconMenu";
import IconVoxel from "@/components/icons/IconVoxel";
import IconVcast from "@/components/icons/IconVCast";
import IconAngleLeft from "@/components/icons/IconAngleLeft";

// VIEWS
// const basePath = process.env.VUE_APP_MODE; // tablet ou smartphone
import Privacity from "@/views/smartphone/Privacity";
import Help from "@/views/smartphone/Help";
import About from "@/views/smartphone/About";
import Register from "@/views/smartphone/Register";
import Menu from "@/views/smartphone/Menu";

export default {
  name: "BaseSmartphone",

  created() {
    const self = this;

    // conecta com o servidor
    self.$connection.connectApp();

    self.$apiRequest.onclose(() => {
      self.$logger.warn("Conexão websocket perdida.");

      clearInterval(self.$login.session_timeout);

      self.$connection.server_connected = false;

      // self.$connection.updateInternetStatus();

      self.$connection.verifyConnection();

      self.$connection.disconnected();
    });

    // on login
    self.$login.$on("loginSuccess", () => {
      self.$connection.render_components = true;
      self.$connection.server_connected = true;
      if (self.$router.currentRoute.name == "login") {
        self.$router.push({
          name: "home"
        });
      }
    });

    // on logout
    self.$login.$on("logout", () => {
      self.$connection.render_components = false;
      self.$router.push({
        name: "login"
      });
    });

    // on login fail
    self.$login.$on("loginFail", () => {
      self.$connection.render_components = false;
      self.$router.push({
        name: "login"
      });
    });
  },

  mounted() {
    const self = this;

    // eventos de conexao com internet
    // document.addEventListener(
    //   "online",
    //   this.$connection.handleConnectionChange
    // );

    // document.addEventListener(
    //   "offline",
    //   this.$connection.handleConnectionChange
    // );

    // self.$connection.updateInternetStatus();

    if (process.env.VUE_APP_DEV == "false") {
      self.$covers.hide_splashscreen();

      // eventos de keyboard
      // this.$nextTick(() => {
      //   NativeKeyboard.showMessenger({
      //     onKeyboardDidShow: height => {
      //       this.$helpers.keyboardVisible();
      //     },
      //     onKeyboardDidHide: height => {
      //       this.$helpers.keyboardHidden();
      //     }
      //   });
      // });

      // this.$nextTick(() => {
      //   window.addEventListener(
      //     "native.keyboardshow",
      //     this.$helpers.keyboardVisible
      //   );
      //   window.addEventListener(
      //     "native.keyboardhide",
      //     this.$helpers.keyboardHidden
      //   );
      //   window.addEventListener(
      //     "native.hidekeyboard",
      //     this.$helpers.keyboardHidden
      //   );
      // });

      if (screen) {
        screen.orientation.lock("portrait");
      }

      if (window.device.platform == "Android") {
        //
      }

      if (window.device.platform == "iOS") {
        this.$nextTick(() => {
          const html = document.getElementsByTagName("html")[0];
          const body = document.getElementsByTagName("body")[0];
          const app = document.getElementById("app");
          const base = document.getElementById("base-smartphone");

          let transition = "ease .5s";

          html.style.transition = transition;
          body.style.transition = transition;
          app.style.transition = transition;
          base.style.transition = transition;
        });
      }
    }
  },

  components: {
    // MÚDULOS
    Header,
    Footer,
    ListView,
    Sideslide,
    Warning,
    // ELEMENTS
    Logo,
    Square,
    // BOTÕES
    ButtonAction,
    ButtonIcon,
    // ICONES
    IconVoxel,
    IconMenu,
    IconVcast,
    IconAngleLeft,
    // VIEWS
    Menu,
    Privacity,
    Help,
    Register,
    About
  }
};
</script>
