define(['robe/core/Class'], function (Class) {
    var Singleton = Class.define({
        data: null,
        initialize: function () {
            console.warn("Child class must implement function.");
        },
        read: function () {

        },
        get: function (read) {
            if (typeof(read) === 'undefined') read = true;

            if (this.data == null) {
                console.log("Initializing " + this.name);
                this.initialize();
            }
            if (read) {
                this.read();
            }

            return this.data;
        }
    });
    return Singleton;
});