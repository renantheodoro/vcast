import Vue from 'vue';

const jwtDecode = require('jwt-decode');

export default new Vue({
    data() {
        return {
            loginSuccess: false,
            isLogout: false,
            userName: "",
            userLogin: null,
            userPassword: null,

            connId: null,

            // interval keep session
            session_interval: null,

            // tokens
            accessToken: null,
            refreshToken: null
        }
    },

    methods: {
        authenticate(login, pass, callback) {

            if (!this.$connection.status_internet || !this.$connection.server_connected) return;

            const self = this;

            self.$loader.show();

            let loginData = null;
            let passData = null;

            if (!login) {
                if (self.userLogin) loginData = self.userLogin
                else return callback(false)
            } else loginData = login

            if (!loginData) return callback(false)

            if (!pass) {
                if (self.userPassword) passData = self.userPassword
                else return callback(false)
            } else passData = pass

            if (!passData) return callback(false)

            let tokenApi = self.$connection.tokenApi;

            const form = new FormData();
            form.append("Login", loginData);
            form.append("Password", passData);
            form.append("System", "Smartphone");

            // var dataa = {
            //     Login: '00010011',
            //     Password: 'voxel123',
            //     System: 'Smartphone'
            // }

            self.axios
                .post(
                    self.$helpers.get_api_url() + "appuser/login", form, {
                        headers: {
                            Authorization: tokenApi
                        }
                    }
                )
                .then(response => {
                    // console.log("Login Response", response);

                    if (!response) {
                        self.$logger.warn("Usuário ou senha inválido.", response);
                        self.$loader.hide();

                        self.$messages.alert({
                            header: "Acesso negado",

                            message: "Usuário ou senha inválido.",

                            buttons: [{
                                role: "cancel",
                                text: "OK",
                                cssClass: "btn-full"
                            }]
                        });
                        return;
                    }

                    // recupera dados do usuário
                    self.accessToken = response.data.accessToken;
                    self.refreshToken = response.data.refreshToken;
                    const decoded = jwtDecode(self.accessToken);

                    localStorage.setItem("UserInfo", JSON.stringify(decoded))

                    // localStorage.setItem("userLogin", loginData)

                    // salvando codigos
                    self.saveSession()

                    // guardando dados do usuario
                    self.userLogin = loginData
                    self.userPassword = passData
                    self.userName = decoded.name

                    self.registerToken(res => {
                        // atualizando status de login

                        self.loginSuccess = true;

                        self.$logger.log(
                            "Login efetuado com sucesso! Usuário:",
                            self.userLogin
                        );

                        self.$emit('loginSuccess')

                        if (callback) callback(res)
                    })

                })
                .catch(err => {
                    let response;

                    switch (err.response.data) {
                        case "not-found":
                            response = "Usuário e/ou senha incorretos"
                            break;
                        case "register-pending":
                            response = "Usuário pendente de aprovação"
                            break;
                        case "register-rejected":
                        case "unauthorized":
                            response = "Acesso não autorizado"
                            break;

                        default:
                            response = "Erro desconhecido"
                    }

                    self.$logger.warn(response, err.response.data, err.response.data, err.response.status);

                    self.$loader.hide();

                    self.$messages.alert({
                        header: "Acesso negado",

                        message: response,

                        buttons: [{
                            role: "cancel",
                            text: "OK",
                            cssClass: "btn-full"
                        }]
                    });

                    self.$emit('loginFail')
                });
        },

        registerToken(callback) {
            if (!this.$connection.status_internet || !this.$connection.server_connected) return;

            const self = this;

            let accessToken;
            let refreshToken;

            accessToken = this.accessToken || this.getSession()[0]

            refreshToken = this.refreshToken || this.getSession()[1]

            if (!accessToken || !refreshToken) return callback(false)

            ;

            // registra a aplicação
            self.$apiRequest.invoke('Register', accessToken, refreshToken, 'Smartphone').then(connId => {

                if (connId == "") {
                    self.$logger.warn("Erro ao registrar aplicação.", "connId:", connId);
                    if (callback) callback(false)
                    return;
                    // self.$emit('loginFail')
                }

                self.connId = connId
                self.$connection.connId = connId;

                self.$logger.log("Aplicação registrada com sucesso!", "connId:", connId);

                self.$connection.connected();

                // start refresh
                self.refresh();

                if (callback) callback(true)
            }).catch(err => {
                self.$logger.warn("Erro ao registrar aplicação.", err);

                if (callback) callback(false)
                self.$emit('loginFail')
            })
        },

        refresh(callback) {
            const self = this;

            clearInterval(self.session_interval);

            // let seconds = 10
            let seconds = 60

            const refreshToken = self.refreshToken || this.getSession()[1];

            if (!refreshToken) return;

            self.$logger.log("Refreshing Token...", refreshToken);

            self.$apiRequest.invoke('RefreshToken', refreshToken, 'Smartphone').then(response => {
                // console.log('RefreshToken response:', response)

                if (!response) {
                    self.$emit("loginFail");
                    if (callback) return callback(false)
                }

                self.$logger.log("Refresh Token com sucesso!", response);

                self.accessToken = response.accessToken;
                self.refreshToken = response.refreshToken;

                self.saveSession();

                self.session_interval = setTimeout(() => {
                    self.refresh();
                }, seconds * 1000)

                if (callback) return callback(true)
            });
        },

        saveSession() {
            sessionStorage.setItem("accessToken", this.accessToken)
            sessionStorage.setItem("refreshToken", this.refreshToken)
        },

        getSession() {
            return [this.accessToken, this.refreshToken] || [JSON.parse(sessionStorage.getItem("accessToken")), JSON.parse(sessionStorage.getItem("refreshToken"))]
            // return this.connId || JSON.parse(sessionStorage.getItem("connId"))
        },

        confirm_logout() {
            this.$messages.alert({
                header: "Sair",

                message: "Tem certeza que quer sair?",

                buttons: [{
                        role: "cancel",
                        text: "Cancelar",
                    },
                    {
                        text: "OK",
                        handler: () => {
                            this.$covers.hide_sideslide()
                            this.logout()
                        }
                    }
                ]
            });
        },

        clearLocalStorage() {
            localStorage.setItem("UserInfo", null)
            localStorage.setItem("BroadcastsSubscriptions", null)
            localStorage.setItem("Broadcasts", null)
        },

        resetSession() {
            const self = this;

            self.$loader.show();

            // reset data
            self.loginSuccess = false
            self.userName = ""
            self.userLogin = null
            self.userPassword = null
            
            // reset localstorage
            self.clearLocalStorage()

            self.accessToken = null
            self.refreshToken = null

            // reset sessionStorage
            self.saveSession()

            clearInterval(self.session_interval);

            // BROADCAST OUT
            if (self.$broadcasts.get_broadcast()) {
                self.$apiRequest.invoke("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
                self.$logger.log("BroadcastOut", self.$broadcasts.current_broadcast.CodTransmissao);
                self.$broadcasts.set_broadcast(null)
            }
        },

        logout() {
            const self = this
            self.resetSession();
            self.$emit("logout")

            // self.isLogout = true;

            // self.$apiRequest.stop().then(() => {
            //     self.loginSuccess = false
            //     self.isLogout = false
            //     clearInterval(self.session_interval);
            //     self.$logger.log("Logout efetuado com sucesso.")
            //     self.$emit("logout")
            // })
        },

        getStatus() {
            return this.loginSuccess
        },

        get_data(key) {
            return this[key]
        },

        set_data(key, value) {
            this[key] = value
        }
    }
})