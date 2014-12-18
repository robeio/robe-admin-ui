var admin = admin || {};
var AdminApp;

define(['router'], function () {

    var initialize = function () {
        AdminApp = {
            backendURL: "",
            lang: "",
            langs: [],
            getBackendURL: function () {
                return this.backendURL;
            },
            getLang: function () {
                return this.lang;
            },
            getLangs: function () {
                return this.langs;
            }
        };

        $.getJSON("./config.json", function (response) {
            AdminApp.backendURL = response.backendURL;
            AdminApp.lang = response.lang.default;
            for (var key in response.lang) {
                //TODO change to another good way
                if (key != "default") {
                    AdminApp.langs.push({text: response.lang[key], value: key});
                }
            }

        });

    };

    return {
        initialize: initialize
    };
});





