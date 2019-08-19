import Vue from 'vue';

export default new Vue({

    data() {
        return {
            status: false,
            loader_message: null
        }
    },

    methods: {
        // abre loader
        show() {
            this.status = true
            this.$emit('shown', this.status)
        },

        // fecha loader
        hide() {
            this.status = false
            this.$emit('hidden', this.status)
        }
    }
})