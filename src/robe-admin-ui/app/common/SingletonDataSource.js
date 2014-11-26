define([
    'robe/core/Singleton',
    'kendo/kendo.data.min'
], function(Singleton,DataSource) {
    var SingletonDataSource = Singleton.define({
        initialize: function() {
            this.data = new kendo.data.DataSource(this.parameters);
            this.data.bind("error", this.requestError);
            this.data.bind("requestEnd", this.requestEnd);
        },

        read: function() {
            this.data.read();
        },

        requestError: function(e) {
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

        requestEnd: function(e) {
            var response = e.response;
            var type = e.type;
            var message = "";
            if (type === "update") {
                message = "Başarı ile güncellendi";
            } else if (type === "destroy") {
                message = "Başarı ile silindi";
            } else if (type === "create") {
                message = "Başarı ile oluşturuldu";
            }
            if (message != "")
                showToast("success", message);
        }
    });
    return SingletonDataSource;
});