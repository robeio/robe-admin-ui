define(['robe/core/Class'], function(Class) {
    var RobeView = Class.define({
        name: null,
        containerId: null,
        html: null,
        show: function(preAction, postAction) {
            if (preAction) {
                preAction();
            }

            var me = this;

            $("#" + this.containerId).load(this.htmlPath, function() {
                me.initialize();
                if (postAction) {
                    postAction();
                }
            });
        },

        render: function(containerId) {
            if ((containerId !== undefined) && (containerId !== null)) {
                $('#' + containerId).append(html);
                this.initialize();
            } else if ((this.containerId !== undefined) && (this.containerId !== null)) {
                $('#' + this.containerId).append(this.html);
                this.initialize();
            }
        },

        initialize: function() {
            console.warn(this.name + " initialize run");
        }

    });
    return RobeView;
});