import Vue from 'vue';

export default new Vue({
    data() {
        return {
            URL_API: '', // vem do main.js
        }
    },

    methods: {
        // retorna url da api
        get_api_url() {
            return this.URL_API;
        },

        // retorna a hora da data
        get_time(date) {
            // console.log('DATE:', date);
            let d = date.substr(11, 5).replace(":", "h");
            // console.log('D', d);
            return d;
        },

        // formata data para chat
        format_chat_date(date) {
            // 2018-07-01 16:29:31.000
            let newDate = new Date(date)

            let y = newDate.getFullYear().toString()
            let m = newDate.getMonth().toString()
            let d = newDate.getDay().toString()

            if (m.length < 2) m = '0' + m
            if (d.length < 2) d = '0' + d

            let h = newDate.getHours().toString()
            let min = newDate.getMinutes().toString()
            let s = newDate.getSeconds().toString()

            if (h.length < 2) h = '0' + h
            if (min.length < 2) min = '0' + min
            if (s.length < 2) s = '0' + s

            return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s + '.000'
        },

        get_resume(text, qtd) {
            if (text.length < qtd) return text
            return text.substr(0, qtd) + "..."
        },

        // retorna a hora atual
        get_current_time() {
            let currentDate = new Date();
            let year = currentDate.getFullYear().toString();
            let month = (currentDate.getMonth() + 1).toString();
            if (month.length < 2) month = "0" + month;
            let day = currentDate.getDate().toString();
            if (day.length < 2) day = "0" + day;

            let hour = currentDate.getHours().toString();
            if (hour.length < 2) hour = "0" + hour;
            let minutes = currentDate.getMinutes().toString();
            if (minutes.length < 2) minutes = "0" + minutes;
            let seconds = currentDate.getSeconds().toString();
            if (seconds.length < 2) seconds = "0" + seconds;
            let milliseconds = currentDate.getMilliseconds().toString();

            const lastDateTime =
                year +
                "-" +
                month +
                "-" +
                day +
                "T" +
                hour +
                ":" +
                minutes +
                ":" +
                seconds +
                "." +
                milliseconds +
                "-03:00";

            return lastDateTime;
        },

        // retorna a data
        get_date(date) {
            date = date.substr(0, 10);
            date = date.split("-");
            date = date[2] + "/" + date[1];
            return date;
        },

        // retorna a duração da transmissão
        get_duration(start, end) {
            let startDate = new Date(start);
            let endDate = new Date(end);
            let hours = parseInt(Math.abs(endDate - startDate) / (1000 * 60 * 60) % 24);
            let minutes = parseInt(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60) % 60);
            let seconds = parseInt(Math.abs(endDate.getTime() - startDate.getTime()) / (1000) % 60);

            let h = (hours < 10 ? "0" + hours : hours);
            let m = (minutes < 10 ? "0" + minutes : minutes);
            let s = (seconds < 10 ? "0" + seconds : seconds);

            return h + ":" + m + ":" + s;
        },

        ensureVisible(e) {
            // console.log("e", e)
            this.$emit("inputFocus", e);

            setTimeout(() => {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 250);
        },

        keyboardVisible() {
            // console.log("keyboardVisible")
            this.$emit("keyboardVisible")
        },

        keyboardHidden() {
            // console.log("keyboardHidden")
            this.$emit("keyboardHidden")
        }
    }
})