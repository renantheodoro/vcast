<template>
  <div id="points">
    <ul class="collection">
      <li class="collection-item avatar">
        <!-- <i class="material-icons circle red">play_arrow</i> -->
        <icon-points/>
        <span class="title">1234 pts</span>
      </li>
    </ul>
  </div>
</template>

<script>
import IconPoints from "@/components/icons/IconPoints";
export default {
  name: "Points",

components:{
  IconPoints
}
};
</script>