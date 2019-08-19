<template>
  <div id="about" class="container row">
    <div id="version">
      <p>
        <strong>Versão atual:</strong>
      </p>v2.1.5
    </div>
    <div id="update">
      <p>
        <strong>Atualizado em:</strong>
      </p>15/07/2019
    </div>
    <div id="terms">
      <p>
        <strong>Termos de Uso</strong>
      </p>Termos de uso aqui
    </div>
    <div id="copyright" class="column">
      <icon-voxel color="color" size="normal" />
      <div>Copyright © Voxel Digital - Todos os direitos reservados</div>
    </div>
    <div id="squares">
      <square color="#3764ac" bottom="160px" left="0px" />
      <square color="rgba(14, 30, 100, 0.8)" bottom="80px" right="0px" />
      <square color="rgba(95, 95, 95, 0.7)" bottom="0px" right="80px" />
    </div>
  </div>
</template>

<script>
import IconVoxel from "@/components/icons/IconVoxel";
import Square from "@/components/elements/Square";

export default {
  name: "About",
  components: {
    IconVoxel,
    Square
  }
};
</script>

<style lang="scss">
</style>
