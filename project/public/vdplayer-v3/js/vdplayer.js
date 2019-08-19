

var VDPlayer = {

    Version                 : '1.0.0.0',
    BroadcastId             : null,
    UserId                  : null,
    CustomerId              : null,
    Controls                : false,
    SessionId               : null,
    Ip                      : null,    
    UserAgent               : null,
    Token                   : null,
    ContainerId             : null,
    ShowInitialLoading      : true,
    Mute                    : true,
    EndedCallback           : null,
    StartedCallback         : null,
    BroadcastInfo           : null,
    PlayerId                : null,
    LogDebug                : null,
    BroadcastSessionId      : null,
    Player                  : null,
    IsMuted                 : false,
    Started                 : false,
    Ended                   : false,
    CurrentPosition         : 0,
    PreviousPosition        : 0,
    BytesTransferred        : 0,
    PreviousCue             : null,
    InWaitingOrError        : false,
    Attempts                : 0,    
    TimeIntervalReconnect   : 3000,
    TimeIntervalProgress    : 30000,
    LastEvent               : null,
    ReconnectCounter        : 0,
    EventOrder              : 0,
    EventOrderRef           : 0,
    PlayerEvents            : { play: 1, progress: 2, pause: 3, seek: 4, buffering: 5, stop: 6, muteOn: 7, muteOff: 8, fullScreenOn: 9, fullScreenOff: 10, reconnection: 11, bitrateChange: 12 },
    BroadcastStates         : { live: 1, suspended: 2, ended: 3, ondemand: 4 },
    ApiUrl                  : "https://vdplayer.st.voxeldigital.com.br/api/",
    Poster                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY2BgYAAAAAQAAVzN/2kAAAAASUVORK5CYII=",
    TProgress               : null,
    TReconnect              : null,

    Initialize: async function (broadcastId, userId, customerId, controls, sessionId, ip, userAgent, token, containerId, showInitialLoading, mute, endedCallback, startedCallback = null) {
        this.BroadcastId            = broadcastId;
        this.UserId                 = userId;
        this.CustomerId             = customerId;
        this.Controls               = controls;
        this.SessionId              = sessionId;
        this.Ip                     = ip;
        this.UserAgent              = userAgent;
        this.Token                  = token;
        this.ContainerId            = containerId;
        this.ShowInitialLoading     = showInitialLoading;
        this.Mute                   = mute;    
        this.PlayerId               = this.ContainerId + '-video';
        this.EndedCallback          = endedCallback;
        this.StartedCallback        = startedCallback;
                
        this.BroadcastInfo = await this.GetBroadcastInfo();

        if (this.BroadcastInfo === null) return;

        if (this.BroadcastInfo.status === this.BroadcastStates.live || this.BroadcastInfo.status === this.BroadcastStates.ondemand) {

            this.BroadcastSessionId = await this.CreateBroadcastSession();

            if (this.BroadcastSessionId === null) return;

            var manifest = await this.GetManifest();

            if (manifest === null) return;

            this.Destroy();
            this.CreateTagVideo();            
            this.Build(manifest);            
            this.Progress();
            this.Reconnect();
        }
    },

    GetBroadcastInfo: async function () {
        const data = await axios({
            method: "get",
            url: this.ApiUrl + "broadcasts/" + this.BroadcastId + "/info",
            headers: {
                Authorization: this.Token,
                CustomerId: this.CustomerId
            }
        })
            .then(response => {
                return response.data;
            })
            .catch(error => {
                console.error("Não foi possível carregar as informações da media.");
                return null;
            });

        return data;
    },

    CreateBroadcastSession: async function () {
        const data = await axios({
            method: "post",
            url: this.ApiUrl + "instances",
            data: {
                CustomerId: this.CustomerId,
                BroadcastId: this.BroadcastId,
                UserId: this.UserId,
                SessionId: this.SessionId,
                userIp: this.Ip,
                UserAgent: this.UserAgent
            },
            headers: {
                Authorization: this.Token,
                CustomerId: this.CustomerId
            }
        })
            .then(response => {
                return response.data.broadcastSessionId;
            })
            .catch(error => {
                console.error("Não foi possível iniciar uma sessão.");
                return null;
            });

        return data;
    },

    GetManifest: async function () {
        const data = await axios({
            method: "get",
            url: this.ApiUrl + "broadcasts/" + this.BroadcastId + "/url",
            headers: {
                Authorization: this.Token,
                CustomerId: this.CustomerId
            }
        })
            .then(response => {
                return response.data[0].stream;
            })
            .catch(error => {
                console.error("Não foi possível carregar a url da media.");
                return null;
            });

        return data;
    },

    GetMediaStatus: async function () {
        const data = await axios({
            method: "get",
            url: this.ApiUrl + "broadcasts/" + this.BroadcastId + "/status",
            headers: {
                Authorization: this.Token,
                CustomerId: this.CustomerId
            }
        })
            .then(response => {
                return response.data.status;
            })
            .catch(error => {
                console.error("Não foi possível carregar o status da media.");
                return null;
            });
        return data;
    },

    Destroy: function () {
        if (this.Player != null) { this.Player.dispose(); }
        
        this.Player = null;
        this.Started = false;

        clearTimeout(this.TProgress);
        clearTimeout(this.TReconnect); 
    },

    Play: function () {
        this.Player.play();
    },

    Pause: function () {
        this.Player.pause();
    },

    FullScreen: function () {
        this.Player.requestFullscreen();
    },

    Stop: function () {
        this.Player.stop();
    },

    GetTimeRange: function () {

        var played      = this.Player.played();
        var timeRange   = [];
        var watchClient = 0;

        for (var i = 0; i < played.length; i++) {
            var start = played.start(i);
            var end = played.end(i);

            watchClient += end - start;
            timeRange.push({ start, end });
        }

        return {
            timeRange: timeRange,
            watchClient: Math.round(watchClient)
        };
    },

    SendEvent: function (playerEvent, position, bitrate, BytesTransferred, callback = null) {

        var range = this.GetTimeRange();
        /*
        console.log({
            Callback: callback,
            BroadcastSessionId: this.BroadcastSessionId,
            LastEvent: this.LastEvent,
            playerEvent: playerEvent,
            position: position,
            bitrate: bitrate,
            BytesTransferred: BytesTransferred,
            clientTime: range.watchClient,
            range: range.timeRange,
            eventOrder: this.EventOrder,
            eventOrderRef: this.EventOrderRef,
            reconnectCount: this.ReconnectCounter
        });
        */
        axios({
            method: "post",
            url: this.ApiUrl + "events",
            data: {
                instanceId: this.BroadcastSessionId,
                position: position,
                eventId: playerEvent,
                p2PBytes: 0,
                httpBytes: 0,
                bitrate: bitrate === null ? null : bitrate.bitrate,
                width: bitrate === null ? null : bitrate.width,
                height: bitrate === null ? null : bitrate.height,
                BytesTransferred: BytesTransferred,
                clientTime: range.watchClient,
                eventOrder: this.EventOrder,
                eventOrderRef: this.EventOrderRef,
                reconnectCount: this.ReconnectCounter,
                intervals: range.timeRange.length === 0 ? null : range.timeRange
            },
            headers: {
                Authorization: this.Token,
                CustomerId: this.CustomerId
            }
        })
            .then(response => {
                if (callback) {
                    callback();
                }
            })
            .catch(error => {
                if (callback) {
                    callback();
                }
            });

        switch (playerEvent) {
            case this.PlayerEvents.play:
            case this.PlayerEvents.pause:
            case this.PlayerEvents.seek:
            case this.PlayerEvents.buffering:
            case this.PlayerEvents.stop:
            case this.PlayerEvents.bitrateChange:
                this.EventOrderRef = this.EventOrder;
                break;
        }

        this.LastEvent = playerEvent;
        this.EventOrder++;
        if (playerEvent === this.PlayerEvents.reconnection) { this.ReconnectCounter++; }
    },

    Progress: function () {
        if (this.Started && !this.Ended) {
            this.SendEvent(this.PlayerEvents.progress, this.CurrentPosition, null, this.BytesTransferred);
        }

        if (this.Ended) { return; }

        this.TProgress = setTimeout(
            function () {
                this.Progress();
            }.bind(this),
            this.TimeIntervalProgress
        );
    },

    CreateTagVideo : function(){
        var tag = document.createElement("VIDEO");
        
        tag.classList.add('video-js');
        tag.classList.add('vjs-default-skin');
        tag.classList.add('vjs-big-play-centered');
        
        tag.setAttribute('id', this.PlayerId);

        document.getElementById(this.ContainerId).appendChild(tag);
    },

    Reconnect: async function () {
        var forceReconnect  = false;
        var state           = this.BroadcastInfo.status;

        if (!this.InWaitingOrError) {
            this.Attempts = 0;
        } else {
            if (this.Attempts >= 4) { forceReconnect = true; }

            this.Attempts++;

            state = await this.GetMediaStatus();
        }

        if (state === this.BroadcastStates.ended) {

            this.Ended = true;
            this.SendEvent(this.PlayerEvents.stop, this.CurrentPosition, null, this.BytesTransferred);

            if (this.BroadcastInfo.status === this.BroadcastStates.live) {
                this.EndedCallback();
            }

            return;
        }

        if (forceReconnect) {
            this.Attempts = 0;
            var manifest = await this.GetManifest();
            if (manifest !== null) {
                this.SendEvent(this.PlayerEvents.reconnection, this.CurrentPosition, null, this.BytesTransferred);
                this.Build(manifest);
            }
        }

        this.TReconnect = setTimeout(
            function () {
                this.Reconnect();
            }.bind(this),
            this.TimeIntervalReconnect
        );
    },

    LoadingComponent: function (visible) {

        if (visible) {            
            this.Player.addClass("vjs-waiting");
        } else {
            this.Player.removeClass("vjs-waiting");
        }

    },

    Build: function (manifest) {

        var _this = this;

        var source = {
            src: manifest,
            type: "application/x-mpegURL"
        };

        if (_this.Player != null) {
            _this.Player.src(source);
            return;
        }

        _this.Player = videojs(_this.PlayerId, {
            sources: source,
            controls: this.Controls,
            autoplay: true,
            playsinline: true,
            errorDisplay: false,
            poster: this.Poster,
            fluid : true
        });

        _this.Player.on("loadeddata", function (e) {
            try {
                var segmentMetadataTrack = _this.Player.textTracks_[0];

                if (segmentMetadataTrack === null) return;

                var scope = _this;

                segmentMetadataTrack.on("cuechange", function () {

                    var activeCue = segmentMetadataTrack.activeCues[0];

                    if (activeCue) {
                        if (scope.PreviousCue === null || scope.PreviousCue.playlist !== activeCue.value.playlist) {
                            var bitrate = {
                                width: activeCue.value.resolution === undefined ? null : activeCue.value.resolution.width,
                                height: activeCue.value.resolution === undefined ? null : activeCue.value.resolution.height,
                                bitrate: activeCue.value.bandwidth === undefined ? null : activeCue.value.bandwidth
                            };

                            scope.SendEvent(scope.PlayerEvents.bitrateChange, scope.CurrentPosition, bitrate, scope.BytesTransferred);
                        }
                        scope.PreviousCue = activeCue.value;
                    }
                });
            } catch (error) {}           
        });

        _this.Player.on("ready", function (e) {

            document.getElementById(_this.PlayerId + '_html5_api').setAttribute('poster', _this.Poster);
            
            if(_this.Mute) { this.volume(0); }
            
            var promise = this.play();
            if (promise !== undefined) {
                promise
                .then(function () {
                    //console.log('autoplay permitido');
                })
                .catch(function (error) {
                    //console.log('autoplay não permitido');
                });
            }
        });

        _this.Player.on("playing", function (e) {
            
            _this.InWaitingOrError  = false;
            
            if (_this.LastEvent == _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.CurrentPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(_this.PlayerEvents.play, _this.CurrentPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(_this.PlayerEvents.play, _this.CurrentPosition, null, _this.BytesTransferred);
            }
        });

        _this.Player.on("waiting", function (e) {

            _this.InWaitingOrError = true;

            if(!_this.Started){ _this.LoadingComponent(_this.ShowInitialLoading); }

            if (_this.LastEvent == _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.PreviousPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(_this.PlayerEvents.buffering, _this.PreviousPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(_this.PlayerEvents.buffering, _this.PreviousPosition, null, _this.BytesTransferred);
            }
        });

        _this.Player.on("seeked", function (e) {
            
            if (_this.BroadcastInfo.status === _this.PlayerEvents.live) { return; }

            if (_this.LastEvent == _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.PreviousPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(_this.PlayerEvents.seek, _this.CurrentPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(_this.PlayerEvents.seek, _this.CurrentPosition, null, _this.BytesTransferred);
            }

        });

        _this.Player.on("ended", function (e) {

            if (_this.LastEvent == _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.CurrentPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(_this.PlayerEvents.stop, _this.CurrentPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(_this.PlayerEvents.stop, _this.CurrentPosition, null, _this.BytesTransferred);
            }

            _this.Ended = true;
        });

        _this.Player.on("timeupdate", function (e) {            
            
            if(!_this.Started){
                _this.Started = true;
                if(_this.StartedCallback){ _this.StartedCallback(_this.BroadcastSessionId); }                
            }
                        
            _this.PreviousPosition  = _this.CurrentPosition;
            _this.CurrentPosition   = this.currentTime();
            _this.BytesTransferred  = this.tech({ IWillNotUseThisInPlugins: true }).hls.stats.mediaBytesTransferred;
        });

        _this.Player.on("pause", function (e) {

            if (this.player().scrubbing()) return;

            if (_this.LastEvent == _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.CurrentPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(_this.PlayerEvents.pause, _this.CurrentPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(_this.PlayerEvents.pause, _this.CurrentPosition, null, _this.BytesTransferred);
            }

        });

        _this.Player.on("volumechange", function (e) {

            if (this.muted() !== _this.IsMuted || (!this.muted() && this.volume() === 0)) {
                _this.IsMuted = this.volume() === 0 ? true : this.muted();
                var event = _this.PlayerEvents.muteOn;

                if (_this.IsMuted) {
                    event = _this.PlayerEvents.muteOff;
                }

                if (_this.LastEvent == _this.PlayerEvents.progress) {
                    _this.SendEvent(_this.PlayerEvents.progress, _this.CurrentPosition, null, _this.BytesTransferred, function () {
                        _this.SendEvent(event, _this.CurrentPosition, null, _this.BytesTransferred);
                    });
                } else {
                    _this.SendEvent(event, _this.CurrentPosition, null, _this.BytesTransferred);
                }
            }

        });

        _this.Player.on("fullscreenchange", function (e) {

            var event = _this.PlayerEvents.fullScreenOn;

            if (!this.isFullscreen()) {
                event = _this.PlayerEvents.fullScreenOff;
            }

            if (_this.LastEvent === _this.PlayerEvents.progress) {
                _this.SendEvent(_this.PlayerEvents.progress, _this.CurrentPosition, null, _this.BytesTransferred, function () {
                    _this.SendEvent(event, _this.CurrentPosition, null, _this.BytesTransferred);
                });
            } else {
                _this.SendEvent(event, _this.CurrentPosition, null, _this.BytesTransferred);
            }

        });

        _this.Player.on("error", function (e) {
            _this.InWaitingOrError = true;
        });

        _this.Player.hlsQualitySelector();
        _this.Player.play();
    }
};