import Vue from 'vue';

export default new Vue({
    methods: {
        // alert component
        alert(config) {
            config.mode = "md";
            return this.$ionic.alertController.create(config).then(a => a.present());
        },

        // toast component
        toast(message, status) {
            M.toast({
                html: message,
                classes: 'rounded ' + status
            })
        }
    }
});