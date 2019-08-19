import Vue from 'vue';


export default new Vue({
    data() {
        return {
            lockid:0
        }
    },

    methods: {
        set: function(key, value) {
            window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key, value) {
            value = value || '{}';
            return JSON.parse($window.localStorage[key] || value);
        },
        del: function(key) {
            localStorage.removeItem(key);
        }

    },

    created() {
        if(!this.get('lockid', 0))
            this.set('lockid', generateUUID());
        //

        this.lockid = this.get('lockid');
    }
});


function generateUUID() { 
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); 
    }
    return 'xxxx-yxxx-4xxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}