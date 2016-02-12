define([
    'robe/core/Singleton',
    'kendo/kendo.data.min'
], function (Singleton, DataSource) {
    var SingletonDataSource = Singleton.define({
        initialize: function () {

            var transport = this.parameters.transport;

            /**
             * TODO setting default cache false for internet explorer cache problem.
             */

            if (transport.read) {
                transport.read.cache = false;
            }

            if (transport.destroy) {
                transport.destroy.cache = false;
            }

            if (transport.update) {
                transport.update.cache = false;
            }

            if (transport.create) {
                transport.create.cache = false;
            }

            this.data = new kendo.data.DataSource(this.parameters);
            this.data.bind("error", this.requestError);
            this.data.bind("requestEnd", this.requestEnd);
            this.data.bind("requestStart", this.requestStart);
        },

        read: function () {
            this.data.read();
        },

        requestError: function (e) {
            var response = e.response;
            var type = e.type;
            var message = "";
            if (type === "update") {
                message = 'Güncelleme sırasında bir hata oluştu.';
            } else if (type === "destroy") {
                message = "Silme sırasında bir hata oluştu.";
            } else if (type === "read") {
                message = "Veriler getirilirken bir hata oluştu.";
            } else if (type === "create") {
                message = "Oluşturulma sırasında bir hata oluştu.";
            }
            if (message != "")
                showToast("error", message);
        },

        requestEnd: function (e) {
            kendo.ui.progress($("#body"), false);
            var response = e.response;
            var type = e.type;
            var message = "";
            if (type === "update") {
                message = "Başarı ile güncellendi";
                this.read();
            } else if (type === "destroy") {
                message = "Başarı ile silindi";
                this.read();
            } else if (type === "create") {
                message = "Başarı ile oluşturuldu";
                this.read();
            }
            if (message != "")
                showToast("success", message);
        },

        requestStart: function (e) {
            kendo.ui.progress($("#body"), true);
        }
    });
    return SingletonDataSource;
});