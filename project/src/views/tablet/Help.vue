<template>
  <div id="text">
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
      <square color="#3764ac" bottom="160px" left="0px"/>
      <square color="rgba(14, 30, 100, 0.8)" bottom="80px" right="0px"/>
      <square color="rgba(95, 95, 95, 0.7)" bottom="0px" right="80px"/>
    </div>
  </div>
</template>

<script>
import Square from "@/components/elements/Square";
export default {
  name: "Help",
  components: {
    Square
  }
};
</script>

<style lang="scss">
</style>
