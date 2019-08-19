<template>
  <div id="menu" class="view viewSideslide">
    <div class="row"></div>

    <div id="menu-header" class="item-content">
      <div class="item-before">
        <icon-user />
      </div>

      <div class="item-text">
        <div class="item-inner">
          <span class="middle">{{$login.userName}}</span>
          <strong class="small">{{$login.userLogin}}</strong>
        </div>
      </div>
    </div>

    <div class="row">
      <ul class="simple-list">
        <li class="list-item">
          <a @click.prevent="$covers.show_sidesection('privacity')" class="waves-effect">Privacidade</a>
        </li>
        <li class="list-item">
          <a @click.prevent="$covers.show_sidesection('about')" class="waves-effect">Sobre</a>
        </li>
        <li class="list-item">
          <a @click.prevent="$covers.show_sidesection('help')" class="waves-effect">Ajuda</a>
        </li>
        <li class="list-item">
          <a @click.prevent="$login.confirm_logout" class="waves-effect">
            <i class="material-icons rotate">exit_to_app</i>
            <span>Sair</span>
          </a>
        </li>
      </ul>
    </div>

    <div id="menu-footer">
      <div class="row left-align">
        <div class="col s6 right-align">
          <small>versão 2.0.0</small>
          <br />
          <small class="uppercase">{{getLockid()}}</small>
        </div>
      </div>
      <div class="row no-mgn-b">
        <div class="col s6">
          <icon-vcast />
        </div>

        <div class="col s6 right-align">
          <logo :size="105" color="grey" />
        </div>
      </div>
    </div>

    <!-- <square color="#03468e" size="45px" top="0px" right="0px" />
    <square color="rgba(142, 142, 142, 0.8)" size="45px" bottom="200px" left="0px" />
    <square color="rgba(14, 30, 100, 0.7)" size="45px" bottom="150px" right="45px" />
    <square color="rgba(3, 70, 142, 0.9)" size="45px" bottom="105px" right="0px" />-->
  </div>
</template>

<script>
import Logo from "@/components/elements/Logo";
import IconVcast from "@/components/icons/IconVCast";
import Square from "@/components/elements/Square";
import IconUser from "@/components/icons/IconUser";

export default {
  name: "Menu",

  methods: {
    getLockid() {
      return localStorage.getItem("lockid");
    }
  },

  components: {
    Logo,
    IconVcast,
    Square,
    IconUser
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/menu.scss";
</style>
