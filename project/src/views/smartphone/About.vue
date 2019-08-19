<template>
  <div id="about" class="view viewSideslide">
    <div class="container">
      <div class="row no-mgn-b">
        <div class="close">
          <button-icon @action="$covers.hide_sidesection('help')">
            <icon-close />
          </button-icon>
        </div>
      </div>

      <div class="row">
        <div id="version" class="block-section">
          <p>
            <strong>Versão atual:</strong>
          </p>
          {{version}}
        </div>
        <div id="update" class="block-section">
          <p>
            <strong>Atualizado em:</strong>
          </p>
          {{updated}}
        </div>
        <div id="terms" class="block-section">
          <p>
            <strong>Termos de Uso</strong>
          </p>Termos de uso aqui
        </div>

        <div id="copyright" class="column">
          <icon-voxel color="color" size="small" />
          <div>Copyright © Voxel Digital - Todos os direitos reservados</div>
        </div>

        <div id="squares">
          <!-- <square color="rgba(14, 30, 100, 0.7)" size="45px" top="0px" right="45px" />
          <square color="rgba(3, 70, 142, 0.9)" size="45px" right="0px" top="45px" />-->
          <square color="rgba(142, 142, 142, 0.8)" size="45px" left="0px" bottom="220px" />
          <square color="#03468e" size="45px" right="0px" bottom="110px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconVoxel from "@/components/icons/IconVoxel";
import Square from "@/components/elements/Square";
import ButtonIcon from "@/components/buttons/ButtonIcon";
import IconClose from "@/components/icons/IconClose";

export default {
  name: "About",

  components: {
    IconVoxel,
    Square,
    ButtonIcon,
    IconClose
  },

  computed: {
    version() {
      return "v" + process.env.VUE_APP_VERSION;
    },
    updated() {
      return process.env.VUE_APP_UPDATED;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/about.scss";
</style>
