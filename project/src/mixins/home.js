export default {
    data() {
        return {
            current_channel: null,
            broadcasts: [],
            broadcast_live: null,
            broadcasts_new: [],
            broadcasts_avaiable: null,
            already_updating: false,
            show_play: false
        };
    },

    created() {
        const self = this;
        if (process.env.VUE_APP_MODE == "tablet") {
            self.current_channel = self.$channel.get_current_channel();
        }
    },

    methods: {
        getBroadcasts() {
            const self = this

            if (this.already_updating) return
            else this.already_updating = true

            // self.$loader.show();
            self.$logger.log("Atualizando transmissões...");

            self.update_broadcasts().then(resolve => {
                self.$logger.log("Transmissões foram atualizadas.");
                self.$loader.hide();
            });
        },

        update_broadcasts() {
            return new Promise(resolve => {
                const self = this;

                // resetando transmissões
                self.broadcast_live = null;
                self.broadcasts = [];
                self.broadcasts_new = [];
                self.broadcasts_avaiable = null;

                if (process.env.VUE_APP_MODE == 'tablet') {
                    this.get_tablet_broadcasts(() => {
                        resolve()
                    })
                    return
                }

                if (process.env.VUE_APP_MODE == 'smartphone') {
                    this.get_smartphone_broadcasts(() => {
                        resolve()
                    })
                    return
                }

            });
        },

        get_tablet_broadcasts(callback) {
            const self = this;

            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let endDate = year + "-" + 12 + "-" + 31 + "T" + 23 + ":" + 59 + ":" + 59;

            self.$apiRequest
                .invoke("GetBroadcasts", self.current_channel.CodCanal, endDate, 0, 100)
                .then(data => {
                    self.broadcasts = data || [];
                    self.prepare_broadcasts(data, () => {
                        callback();
                    })
                })
                .catch(error => {
                    self.response_error(error, () => {
                        callback();
                    })
                });
        },

        get_smartphone_broadcasts(callback) {
            const self = this;
            
            const broadcastsLocal = JSON.parse(localStorage.getItem("Broadcasts")) || []
            
            // busca do local
            if (broadcastsLocal.length) {
                self.broadcasts = broadcastsLocal
                self.prepare_broadcasts(broadcastsLocal, () => {
                    callback();
                })
            }
            // se tiver conexão, tenta buscar da api
            if (!this.$connection.status_internet  || !this.$connection.server_connected) return;

            self.$apiRequest
                .invoke("GetBroadcastsList")
                .then(data => {
                    var obj = data || [];

                    // jeff: camel case bug fix
                    for (var i = 0; i < obj.length; i++) {

                        var a = obj[i];
                        for (var key in a) {
                            var temp;
                            if (a.hasOwnProperty(key)) {
                                temp = a[key];
                                delete a[key];
                                a[key.charAt(0).toUpperCase() + key.substring(1)] = temp;
                            }
                        }
                        obj[i] = a;

                    }

                    localStorage.setItem("Broadcasts", JSON.stringify(obj))

                    self.broadcasts = obj;

                    self.prepare_broadcasts(data, () => {
                        callback();
                    })
                })
                .catch(error => {
                    self.response_error(error, () => {
                        callback();
                    })
                });
        },

        prepare_broadcasts(data, callback) {
            const self = this;

            if (!self.broadcasts || !self.broadcasts.length) {
                self.broadcasts_avaiable = true;
                self.already_updating = false
                self.$logger.warn("Nenhuma transmissão carregada", data)
                return callback();
            }

            // verificando se transmissão está ao vivo
            if (self.broadcasts.length) {
                for (
                    let index = 0, l = self.broadcasts.length; index < l; index++
                ) {
                    const element = self.broadcasts[index];

                    if (
                        element.DataInicioSinalizada != null &&
                        element.DataTerminoSinalizada == null
                    ) {
                        self.broadcast_live = element;
                        self.$logger.log("Transmissão ao vivo:", element)
                        break;
                    }
                }
            }

            // filtrando transmissoes futuras
            let broadcasts_new = [];

            for (let i = 0, l = self.broadcasts.length; i < l; i++) {
                const element = self.broadcasts[i];

                // transmissões futuras
                if (
                    element.DataInicioSinalizada == null &&
                    element.DataTerminoSinalizada == null
                ) {
                    broadcasts_new.push(element);
                    self.$logger.log("Transmissão futura:", element)
                }

            }

            self.broadcasts_new = broadcasts_new

            self.broadcasts_avaiable = true;
            self.already_updating = false

            self.$logger.log('Lista de transmissões atualizadas:', self.broadcasts)

            callback()
        },

        response_error(error, callback) {
            const self = this;

            self.$logger.error(
                "Não foi possível carregar as Transmissões",
                error
            );

            self.broadcasts_avaiable = true;
            self.already_updating = false
            self.$messages.toast(
                "Não foi possível carregar as Transmissões",
                "error"
            );

            callback()
        }
    },

    mounted() {
        const self = this;

        if (process.env.VUE_APP_DEV == "false") {
            try {
                StatusBar.show();
            } catch (err) {
                console.log(err)
            }

            screen.orientation.lock("portrait");
        }

        self.getBroadcasts()

        // self.$connection.$on("internetStatus", status => {
        self.$connection.$on('connected', () => {
            if (self.$route.name == "home")
                self.getBroadcasts();
        });

        // é chamado quando uma ou mais transmissões for atualizada
        self.$apiRequest.on("UpdateBroadcasts", response => {
            if (self.$route.name != "home") return;

            self.$logger.log("Transmissões foram chamadas para seres atualizadas.", response);
            if (self.$login.loginSuccess) {
                self.getBroadcasts()
            } else {
                self.$logger.log("Não foi encontrado login para atualizar transmissões.");
            }
        });

        self.current_channel = self.$channel.get_current_channel();

        self.$channel.$on("updateChannel", channel => {
            self.$logger.log("Canal atualizado.", channel);

            this.$router.push({
                name: "home"
            });

            if (self.current_channel == channel) {
                return;
            }

            self.current_channel = channel;
            // self.getBroadcasts()
        });

        // BROADCAST OUT
        // if (self.$broadcasts.get_broadcast()) {
        //     self.$apiRequest.invoke("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
        //     self.$logger.log("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
        //     self.$broadcasts.set_broadcast(null)
        // }

        // on login
        // self.$login.$on('loginSuccess', () => {
        //     self.getBroadcasts()
        // })
    }
};