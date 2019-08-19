<template>
  <div id="sideslide" :class="{'active': visible}">
    <slot
      :props="{
        title,
        channel_status, 
        privacity_status,
        help_status,
        about_status,
        register_status,
        menu_status,
        close
      }"
    />
  </div>
</template>

<script>
export default {
  name: "Sideslide",

  props: {
    current_channel: {
      type: [Object, Boolean],
      default: true,
      required: false
    }
  },

  data() {
    return {
      visible: false,
      channel_status: false,
      privacity_status: false,
      help_status: false,
      about_status: false,
      register_status: false,
      menu_status: false,
      return_to_menu: false,
      loader: false
    };
  },

  created() {
    if (!this.current_channel) {
      this.open("channel");
    }
  },

  methods: {
    open(view) {
      this.visible = true;

      if(view != 'register') 
        this.menu_status = true;
      else 
        this.openSection(view)
      
      this.$forceUpdate();
    },

    openSection(section) {
      this[section + "_status"] = true;
      this.menu_status = false;
    },

    closeSection(section) {
      this.menu_status = true;

      this.channel_status = false;
      this.privacity_status = false;
      this.help_status = false;
      this.about_status = false;
      this.register_status = false;
    },

    close() {
      this.visible = false;
      this.channel_status = false;
      this.privacity_status = false;
      this.help_status = false;
      this.about_status = false;
      this.register_status = false;
    }
  },

  mounted() {
    const self = this;

    self.$covers.$on("shownSideslide", view => {
      self.open(view);
    });

    self.$covers.$on("shownSideSection", view => {
      self.openSection(view);
    });

    self.$covers.$on("closeSideSection", view => {
      self.closeSection(view);
    });

    self.$covers.$on("hiddenSideslide", () => {
      self.return_to_menu = false;
      self.close();
    });

    self.$login.$on('loginSuccess', () => {
      self.return_to_menu = false;
      self.close();
    })
  },

  computed: {
    title() {
      const self = this;

      if (self.channel_status) return "Canais";
      if (self.privacity_status) return "Política de privacidade";
      if (self.help_status) return "Ajuda";
      if (self.about_status) return "Sobre";
      if (self.register_status) return "Cadastre-se";
      if (self.menu_status) return "Menu";
    }
  }
};
</script>

<style lang="scss">
</style>