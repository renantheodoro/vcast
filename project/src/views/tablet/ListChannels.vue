<template>
  <div id="channels">
    <div class="container">
      <div class="row">
        <list-view v-if="channels.length" :dataList="channels" :valign="true">
          <template v-slot:list_item="{item: channel, index: index}">
            <Option
              :id="'select-radio-' + channel.CodPlayer"
              :ref="'select-radio-' + channel.CodPlayer"
              type="radio"
              name="channel-option"
              :value="channel.CodPlayer"
              @on-change="$channel.save_channel(channel)"
            >{{channel.NomeCanal}}</Option>
          </template>

          <template #error>Canais não encontrados</template>
        </list-view>
      </div>

      <div class="row">
        <button-action @action="$channel.confirm_action()">Confirmar</button-action>
      </div>
    </div>
  </div>
</template> 

<script>
import ListView from "@/modules/ListView";
import ButtonAction from "@/components/buttons/ButtonAction";
import Option from "@/components/forms/Option";

export default {
  name: "ListChannels",

  data() {
    return {
      channels: [],
      current_channel: null
    };
  },
  created() {
    const self = this;

    self.$channel.$on("updateListChannel", channels => {
      self.channels = channels;
    });
  },

  mounted() {
    const self = this;
    self.$channel.load_channels();
  },

  components: {
    ListView,
    ButtonAction,
    Option
  }
};
</script>