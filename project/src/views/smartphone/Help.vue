<template>
  <div id="help" class="view viewSideslide">
    <div class="container">
      <div class="row no-mgn-b">
        <div class="close">
          <button-icon @action="$covers.hide_sidesection('help')">
            <icon-close />
          </button-icon>
        </div>
      </div>

      <div class="row">
        <p>Olá! Precisa de ajuda?</p>
        <p>
          Entre em contato com o nosso
          Help Desk da Voxel Digital
        </p>
        <p>
          <strong>Telefone:</strong> +55 (11) 3038-4045 ou envie um
          <strong>e-mail</strong> para helpdesk@voxeldigital.com.br
        </p>
        <p>Atendimento das 9:00 às 18:00</p>
        <div id="squares">
          <square color="#03468e" size="45px" bottom="110px" right="0px" />
          <square color="rgba(142, 142, 142, 0.8)" size="45px" bottom="90px" left="0px" />
          <square color="rgba(14, 30, 100, 0.7)" size="45px" bottom="45px" left="0px" />
          <square color="rgba(3, 70, 142, 0.9)" size="45px" bottom="0px" left="45px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonIcon from "@/components/buttons/ButtonIcon";
import IconClose from "@/components/icons/IconClose";
import Square from "@/components/elements/Square";
export default {
  name: "Help",
  components: {
    Square,
    ButtonIcon,
    IconClose
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/smartphone/views/help.scss";
</style>
