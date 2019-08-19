

var VDPlayer = {

    Version                 : '1.0.0.3',
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
    reconnectCallback       : null,
    AutoPlayCallback        : null,
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
    InSeeking               : false,
    Attempts                : 0,    
    TimeIntervalReconnect   : 3500,
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

    Initialize: async function (broadcastId, userId, customerId, controls, sessionId, ip, userAgent, token, containerId, showInitialLoading, mute, endedCallback, startedCallback, reconnectCallback, autoPlayCallback) {
        
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
        this.reconnectCallback      = reconnectCallback;                
        this.AutoPlayCallback       = autoPlayCallback;
        this.BroadcastInfo          = await this.GetBroadcastInfo();

        if (this.BroadcastInfo !== null) {
            
            if (this.BroadcastInfo.status === this.BroadcastStates.live || this.BroadcastInfo.status === this.BroadcastStates.ondemand) {
                
                this.BroadcastSessionId = await this.CreateBroadcastSession();

                if(this.BroadcastSessionId !== null){

                    var manifest = await this.GetManifest();

                    if(manifest !== null){
                        this.Destroy();
                        this.CreateTagVideo();
                        this.Build(manifest);
                        this.Progress();
                        this.Reconnect();
                    }
                }else{
                    console.log("Não foi possível criar uma sessão");   
                }
            }else{
                console.log("Transmissão indisponível.");
            }
        }else{
            console.log("Informações da transmissão não encontradas.");
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
                Authorization   : this.Token,
                CustomerId      : this.CustomerId
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
        
        this.Dispose();        
        this.Player = null;
        this.Started = false;

        clearTimeout(this.TProgress);
        clearTimeout(this.TReconnect); 
    },

    Dispose: function(){
        if (this.Player != null) { 
            this.Player.dispose();
            this.Player = null;             
        }
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

    GetTimeRange: function () {

        var timeRange   = [];
        var watchClient = 0;

        if(this.Player){
            var played  = this.Player.played();           
    
            for (var i = 0; i < played.length; i++) {
                var start = played.start(i);
                var end = played.end(i);
    
                watchClient += end - start;
                timeRange.push({ start, end });
            }  
        }

        return {
            timeRange: timeRange,
            watchClient: Math.round(watchClient)
        }; 
        
    },

    SendEventDecision : function(playerEvent, currentPosition, previousPosition, bitrate, bytesTransferred){

        if(playerEvent === this.PlayerEvents.progress || playerEvent === this.PlayerEvents.bitrate){
            this.SendEvent(playerEvent, currentPosition, bitrate, bytesTransferred);
        }
        else{

            var _this = this;

            if (_this.LastEvent == _this.PlayerEvents.progress) {

                if(playerEvent === _this.PlayerEvents.seek){
                    this.SendEvent(_this.PlayerEvents.progress, previousPosition, bitrate, bytesTransferred, function () {                   
                        _this.SendEvent(playerEvent, currentPosition, bitrate, bytesTransferred);
                    });
                }                
                else if(playerEvent === _this.PlayerEvents.buffering){
                    _this.SendEvent(_this.PlayerEvents.progress, previousPosition, bitrate, bytesTransferred, function () {                   
                        _this.SendEvent(playerEvent, previousPosition, bitrate, bytesTransferred);
                    });
                }
                else{
                    _this.SendEvent(_this.PlayerEvents.progress, currentPosition, bitrate, bytesTransferred, function () {                   
                        _this.SendEvent(playerEvent, currentPosition, bitrate, bytesTransferred);
                    });
                }    

            } else {
                
                if(playerEvent === this.PlayerEvents.buffering){
                    _this.SendEvent(playerEvent, previousPosition, bitrate, bytesTransferred);                    
                }else{
                    _this.SendEvent(playerEvent, currentPosition, bitrate, bytesTransferred);
                }
            }

        }
    },

    SendEvent: function (playerEvent, position, bitrate, bytesTransferred, callback = null) {

        var range = this.GetTimeRange();
        /*
        console.log({
            Callback: callback,
            BroadcastSessionId: this.BroadcastSessionId,
            LastEvent: this.LastEvent,
            playerEvent: playerEvent,
            position: position,
            bitrate: bitrate,
            BytesTransferred: bytesTransferred,
            clientTime: range.watchClient,
            range: range.timeRange,
            eventOrder: this.EventOrder,
            eventOrderRef: this.EventOrderRef,
            reconnectCount: this.ReconnectCounter
        });
        */
        axios({
            method: "post",
            url: this.ApiUrl + "events?" + playerEvent,
            data: {
                instanceId          : this.BroadcastSessionId,
                position            : position,
                eventId             : playerEvent,
                p2PBytes            : 0,
                httpBytes           : 0,
                bitrate             : bitrate === null ? null : bitrate.bitrate,
                width               : bitrate === null ? null : bitrate.width,
                height              : bitrate === null ? null : bitrate.height,
                BytesTransferred    : bytesTransferred,
                clientTime          : range.watchClient,
                eventOrder          : this.EventOrder,
                eventOrderRef       : this.EventOrderRef,
                reconnectCount      : this.ReconnectCounter,
                intervals           : range.timeRange.length === 0 ? null : range.timeRange
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
            this.SendEventDecision(this.PlayerEvents.progress, this.CurrentPosition, this.PreviousPosition, null, this.BytesTransferred);
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
            
            this.Attempts++;
            
            if (this.Attempts >= 4) { forceReconnect = true; }            

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
            this.Attempts   = 0;
            this.Started    = false;
            this.SendEvent(this.PlayerEvents.reconnection, this.CurrentPosition, null, this.BytesTransferred);
            this.Dispose();            
            
            try {
                this.reconnectCallback();    
            } catch (error) {}

            var manifest = await this.GetManifest();
            if (manifest !== null) {
                this.CreateTagVideo();            
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

        videojs.options.hls.overrideNative      = true;
        videojs.options.html5.nativeAudioTracks = false;
        videojs.options.html5.nativeVideoTracks = false;

        _this.Player = videojs(_this.PlayerId, {
            controls        : this.Controls,
            autoplay        : true,
            playsinline     : true,
            errorDisplay    : false,
            poster          : this.Poster,
            fluid           : true,
            sources:  {
                src: manifest,
                type: "application/x-mpegURL"
            }
        });

        _this.Player.on("loadeddata", function (e) {
            try {
                var segmentMetadataTrack = _this.Player.textTracks_[0];

                if (segmentMetadataTrack === null) return;

                var __this = _this;

                segmentMetadataTrack.on("cuechange", function () {                    

                    var activeCue = segmentMetadataTrack.activeCues[0];

                    if (activeCue) {
                        if (__this.PreviousCue === null || __this.PreviousCue.playlist !== activeCue.value.playlist) {
                            var bitrate = {
                                width: activeCue.value.resolution === undefined ? null : activeCue.value.resolution.width,
                                height: activeCue.value.resolution === undefined ? null : activeCue.value.resolution.height,
                                bitrate: activeCue.value.bandwidth === undefined ? null : activeCue.value.bandwidth
                            };

                            __this.SendEventDecision(__this.PlayerEvents.bitrateChange, __this.CurrentPosition, __this.PreviousPosition, bitrate, __this.BytesTransferred);
                        }
                        __this.PreviousCue = activeCue.value;
                    }
                });
            } catch (error) {}           
        });

        _this.Player.on("ready", function (e) {

            //Isso força um poster em mobile, caso o mesmo não seja carregado pelo dispositivo.
            document.getElementById(_this.PlayerId + '_html5_api').setAttribute('poster', _this.Poster);
            
            if(_this.Mute) { this.volume(0); }
            
            var promise = this.play();
            if (promise !== undefined) {
                promise
                .then(function () {
                    _this.AutoPlayCallback(true);
                })
                .catch(function (error) {                    
                    _this.AutoPlayCallback(false);
                });
            }
        });

        _this.Player.on("canplay", function (e) {
            if(!_this.Started && _this.StartedCallback){
                _this.StartedCallback(_this.BroadcastSessionId); 
            }
            _this.Started = true;            
        });

        _this.Player.on("playing", function (e) {
            _this.InSeeking         = false;    
            _this.InWaitingOrError  = false;            
            _this.SendEventDecision(_this.PlayerEvents.play, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);
        });

        _this.Player.on("waiting", function (e) {

            _this.InWaitingOrError = true;
            //força o aparecimento do loading em caso de freeze em vários devices diferentes.
            _this.LoadingComponent(true);

            if(!_this.Started){ 
                _this.LoadingComponent(_this.ShowInitialLoading); 
            }

            _this.SendEventDecision(_this.PlayerEvents.buffering, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);
        });

        _this.Player.on("seeking", function (e) {
            if (this.scrubbing()) return;
            _this.InSeeking = true;
        });

        _this.Player.on("seeked", function (e) {
            if (_this.BroadcastInfo.status === _this.PlayerEvents.live) { return; }
            _this.SendEventDecision(_this.PlayerEvents.seek, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);
        });

        _this.Player.on("ended", function (e) {
            _this.SendEventDecision(_this.PlayerEvents.stop, _this.CurrentPosition, null, _this.BytesTransferred);
            _this.Ended = true;
        });

        _this.Player.on("timeupdate", function (e) {
            _this.PreviousPosition  = _this.CurrentPosition;
            _this.CurrentPosition   = this.currentTime();
            try {
                _this.BytesTransferred  = this.tech({ IWillNotUseThisInPlugins: true }).hls.stats.mediaBytesTransferred;
            } catch (error) {}
        });

        _this.Player.on("pause", function (e) {
            _this.SendEventDecision(_this.PlayerEvents.pause, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);
        });

        _this.Player.on("volumechange", function (e) {

            if (this.muted() !== _this.IsMuted || (!this.muted() && this.volume() === 0)) {
                _this.IsMuted = this.volume() === 0 ? true : this.muted();
                var event = _this.PlayerEvents.muteOn;

                if (_this.IsMuted) {
                    event = _this.PlayerEvents.muteOff;
                }
                _this.SendEventDecision(event, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);
            }

        });

        _this.Player.on("fullscreenchange", function (e) {

            var event = _this.PlayerEvents.fullScreenOn;

            if (!this.isFullscreen()) {
                event = _this.PlayerEvents.fullScreenOff;
            }

            _this.SendEventDecision(event, _this.CurrentPosition, _this.PreviousPosition, null, _this.BytesTransferred);

        });

        _this.Player.on("error", function (e) {
            _this.InWaitingOrError = true;
        });

        _this.Player.hlsQualitySelector();
        _this.Player.play();
    }
};