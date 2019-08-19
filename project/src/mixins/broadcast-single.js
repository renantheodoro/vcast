export default {
    data() {
        return {
            broadcast: null,
            subscribers: [],
            subscribed: false,
            subscriptionChecked: false
        }
    },

    created() {
        if (this.$route.params.broadcast)
            this.$broadcasts.set_broadcast(this.$route.params.broadcast)
        else this.$router.push({
            name: "home"
        });

        this.broadcast = this.$broadcasts.get_broadcast()
    },

    methods: {
        watchBroadcast() {
            if (!this.$connection.status_internet || !this.$connection.server_connected) return;

            const self = this
            self.subscribe(() => {
                self.$router.push({
                    name: 'listagem-mensagens',
                    params: {
                        broadcast: broadcast
                    }
                })
            }, false)
        },

        subscribe(callback, toast = true) {
            if (!this.$connection.status_internet  || !this.$connection.server_connected) return;

            if (this.subscribed) return this.unsubscribe()

            const self = this;

            self.subscriptionChecked = false

            const broadcastId = this.$broadcasts.current_broadcast.CodTransmissaoAoVivo;

            self.$apiRequest.invoke('BroadcastSubscribeUser', broadcastId).then(response => {
                if (!response) {
                    self.subscriptionChecked = true
                    self.$logger.warn('Falha na inscrição de usuário', response)
                    return;
                }

                if (toast)
                    self.$messages.toast("Você se inscreveu com sucesso!", "success")

                self.$logger.log('Usuário inscrito com sucesso!', response)

                self.subscribed = true
                self.subscriptionChecked = true;

                if (callback) callback()

                self.$loader.hide()
            }).catch(err => {
                self.$logger.error('Falha na inscrição de usuário', err)
                self.subscriptionChecked = true;
                self.$messages.toast("Não foi possível se inscrever nesta transmissão.", "error")
                self.$loader.hide()
            })
        },

        unsubscribe() {
            if (!this.$connection.status_internet  || !this.$connection.server_connected) return;

            const self = this;
            const broadcastId = this.$broadcasts.current_broadcast.CodTransmissaoAoVivo;

            self.subscriptionChecked = false

            self.$apiRequest.invoke("BroadcastUnsubscribeUser", broadcastId).then(response => {
                if (!response) {
                    self.$loader.hide()
                    self.$logger.warn('Falha na desinscrição de usuário', response)
                    return;
                }

                self.$messages.toast("Você se desinscreveu com sucesso!", "success")

                self.$logger.log('Usuário desinscrito com sucesso!', response)

                self.subscribed = false

                self.subscriptionChecked = true

                // if (callback) callback()

                self.$loader.hide()
            }).catch(err => {
                self.$logger.error('Falha no cancelamento de inscrição de usuário', err)
                self.$messages.toast("Não foi possível se inscrever nesta transmissão.", "error")
                self.subscriptionChecked = true
                self.$loader.hide()
            })
        },

        checkUserSubscription() {

            if (!this.$connection.status_internet || !this.$connection.server_connected) {
                this.subscriptionChecked = true
                return;
            }

            if (this.is_broadcast_live) {
                this.subscriptionChecked = true
                return;
            }

            this.subscriptionChecked = false;

            const broadcastId = this.$broadcasts.current_broadcast.CodTransmissaoAoVivo;
            const userId = JSON.parse(localStorage.getItem("UserInfo")).userid;

            const self = this;

            self.$apiRequest.invoke("CheckUserSubscription", broadcastId, userId).then(response => {
                self.$logger.log("Checagem de inscrição", response);

                self.subscribed = response > 0;

                self.subscriptionChecked = true
            }).catch(err => {
                self.$logger.warn("Erro ao checar inscrição", err)
                self.subscriptionChecked = true
            })
        }
    },

    computed: {
        is_broadcast_live() {
            if (this.$broadcasts.get_broadcast() != null) {
                if (
                    this.$broadcasts.current_broadcast.DataInicioSinalizada != null &&
                    this.$broadcasts.current_broadcast.DataTerminoSinalizada == null
                )
                    return true;
                else return false;
            } else return false;
        },
    },

    mounted() {
        const self = this;

        self.checkUserSubscription();

        if (process.env.VUE_APP_DEV == "false") {
            try {
                StatusBar.show();
            } catch (err) {
                console.log(err)
            }

            screen.orientation.lock("portrait");
        }

        // this.$connection.$on("internetStatus", status => {
        this.$connection.$on('connected', status => {
            if (status) self.checkUserSubscription()
        })

        this.$broadcasts.$on('updatebroadcast', broadcast => {
            this.broadcast = broadcast
        })

        self.$login.$on('loginSuccess', () => {
            self.$broadcasts.$on('updatebroadcast', broadcast => {
                self.broadcast = broadcast
            })
        })
    }
}