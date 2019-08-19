import Vue from 'vue';

export default new Vue({
    data() {
        return {
            // config api
            tokenApi: "apikey 88D736D0-4D4B-337D-A2FC-517892F95DC3",
            tokenPlayer: "aa84db9c-8644-495d-b8b2-1aa38ed1415c",
            spot: null,
            connId: null,
            serial: null,

            status_internet: null,

            // se api foi conectada
            server_connected: null,
            render_components: null,

            // timeout de reconexão
            connection_interval: null,
            connecting: false,
            connection_times: 0
        }
    },

    created() {
        const self = this;

        self.isOnline(status =>  self.status_internet = status);

        // eventos de conexao com internet
        window.addEventListener("online", this.handleConnectionChange);
        window.addEventListener("offline", this.handleConnectionChange);
    },

    // computed: {
    //     status_internet() {
    //         return navigator.onLine || null;
    //     }
    // },

    methods: {
        handleConnectionChange(event) {
            if (event.type == "offline") {
                this.status_internet = false;
            }

            if (event.type == "online") {
                this.status_internet = true;
                // console.log("on handleConnectionChange, verifyConnection")
                this.verifyConnection();
            }

            this.$emit("internetStatus", this.status_internet)
        },

        // isOnline(callback) {
        //     var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHttp');

        //     xhr.onload = ) =>{
        //         callback(true)
        //     }

        //     xhr.onerror = function () {
        //         callback(false)
        //     }

        // },

        isOnline(callback) {
            // if (process.env.VUE_APP_DEV == "false") {
            if (window.device) {

                if(window.device.platform == "iOS") {
                    return callback(navigator.onLine)
                }

                if(window.device.platform == "Android") {
                    internet.getStatus(status => {
                        switch (status) {
                            case internet.CONNECTED:
                                callback(true);
                                break;
                            case internet.DISCONNECTED:
                                callback(false);
                        }
                    });
                }

                
            } else {
                callback(navigator.onLine)
            }
        },

        // updateInternetStatus() {
        //      ;
        //     this.status_internet = navigator.onLine;
        //     console.log("navigator.onLine", navigator.onLine)
        //     console.log("this.status_internet", this.status_internet)
        // },

        connected() {
            this.$emit("connected");
        },

        disconnected() {
            this.$emit("disconnected");
        },

        /* Inicia a conexão com a api */
        connectApp() {
            let self = this;

            if (this.$apiRequest.connectionState == 1) return;

            if (!this.status_internet) {
                self.verifyConnection();
                return;
            }

            if (self.server_connected) {
                self.refreshAutomatic();
                return;
            }

            self.connecting = true;

            self.$logger.log("Conectando-se com o servidor...");

            self.$apiRequest
                .start()
                .then(() => {
                    self.server_connected = true; // mensagem de erro de conexao com o servidor
                    clearTimeout(self.connection_interval);
                    self.connecting = false;
                    self.connection_times = 0;

                    self.$logger.log("Conexão com servidor iniciada com sucesso.");

                    // tenta login automatico
                    // self.loginAutomatic();

                    // refresh token
                    if (self.$login.loginSuccess) self.refreshAutomatic();
                })
                .catch(error => {
                    // fecha a splashscreen
                    self.server_connected = false;
                    self.connecting = false;
                    clearInterval(self.$login.session_timeout);

                    self.$logger.error("Falha na conexão com o servidor.", error);

                    self.$loader.hide();

                    self.verifyConnection();
                });
        },

        refreshAutomatic() {
            const self = this;

            if (self.$login.loginSuccess) {
                self.$login.registerToken(() => {
                    self.$logger.log("Reconexão com o servidor realizada com suceso!")
                })
            } else {
                self.$logger.warn("Falha de reconexão com o servidor")
                self.render_components = false;
                self.$router.push({
                    name: "login"
                });
            }
        },

        verifyConnection() {
            const self = this;

            if (self.connecting) return;

            // self.updateInternetStatus();

            this.isOnline(status => {
                self.status_internet = status

                if (status) {
                    self.$logger.log("Com internet.")
                    self.connectionInterval()
                    
                } else {
                    self.$logger.warn("Sem internet.");
                    self.server_connected = false;
                    self.connectionInterval()
                }
            })
        },

        connectionInterval() {
            const self = this;
            clearInterval(self.connection_interval);

            self.connection_interval = setInterval(() => {
                self.$logger.log("Tentativa de reconexão...");
                self.connectApp();
            }, 5000);
        }
    }
})