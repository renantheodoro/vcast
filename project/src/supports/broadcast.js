import Vue from 'vue';

export default new Vue({
    data() {
        return {
            // transmissão atual selecionada
            current_broadcast: null
        }
    },

    methods: {
        set_broadcast(broadcast) {
            this.current_broadcast = broadcast;
            this.$emit("updatebroadcast", broadcast)
        },

        get_broadcast() {
            return this.current_broadcast || null
        }
    }
});