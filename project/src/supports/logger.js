import Vue from 'vue';

import * as vddatadog from '@voxel/vd-datadog/src/index';

export default new Vue({
    data() {
        return {
            console_log_active: process.env.VUE_APP_LOGGER_CONSOLE == "true",
            datadog_log_active: process.env.VUE_APP_LOGGER_DATADOG == "true"
        }
    },

    methods: {
        log(message, ...args) {
            if (this.console_log_active) {
                console.log('[vCast info]', message, ...args);
            }
            if (this.datadog_log_active) {
                vddatadog.log(message, ...args);
            }
        },

        warn(message, ...args) {
            if (this.console_log_active) {
                console.warn('[vCast warn]', message, ...args);
            }
            if (this.datadog_log_active) {
                vddatadog.warning(message, ...args);
            }
        },

        error(message, ...args) {
            if (this.console_log_active) {
                console.error('[vCast error]', message, ...args);
            }
            if (this.datadog_log_active) {
                vddatadog.error(message, ...args);
            }
        },

    },

    created() {
        /* DATA LOGGER */
        if (process.env.VUE_APP_LOGGER_DATADOG == "true" && process.env.VUE_APP_MODE == "tablet") {
            vddatadog.init("vCast", "vCast.Tablet", storage.lockid);
            vddatadog.log("Iniciando aplicação...", "vCast.Tablet");
        }

        if (process.env.VUE_APP_LOGGER_DATADOG == "true" && process.env.VUE_APP_MODE == "smartphone") {
            vddatadog.init("vCast", "vCast.Smartphone", storage.lockid);
            vddatadog.log("Iniciando aplicação...", "vCast.Smartphone");
        }
    }
});