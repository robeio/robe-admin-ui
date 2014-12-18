(function () {
    var langMap = {};
    var i18n = {};
    var root = this;
    root.i18n = root.i18n || i18n;

    function isDefaultLanguage() {
        return getLang() == AdminApp.getLang();
    }

    var current = {
        currentView: "",
        getCurrentView: function () {
            return this.currentView;
        }
    };

    function getLang() {
        var lng = $.cookie.read("lang");
        return (lng && lng != 'undefined') ? lng : AdminApp.getLang();
    }

    function init(view) {
        current.currentView = view;
        console.log("view changing to:" + view);
        console.log("lang:" + getLang());

        if (isDefaultLanguage()) {
            return;
        }
        //TODO read from cache ?
        //if (!langMap[view]) {
        var path = './app/modules/' + view + '/' + getLang() + '.json';
        langMap[view] = loadLangJson(path);
        //}
    }

    function loadLangJson(url) {
        var data = null;
        $.ajax({
            dataType: "json",
            url: url,
            cache: true,
            async: false,
            success: function (response) {
                data = response;
            },
            error: function (response) {
                console.warn(response);
            }
        });

        return data;
    }


    function translate() {

        //TODO each only cookie language ?
        $("*[lang]").each(function () {
            var element = $(this);
            if (element.children().length > 0) {
                return;
            }
            //var attrLang = element.attr("lang");
            //TODO check if has cookie language ? (attrLang==getLang()) ?
            var innerHtml = element.html();
            element.html(innerHtml.i18n());
            element.attr("lang", getLang());


        });
    }


    String.prototype.i18n = function () {

        if (isDefaultLanguage()) {
            return this.toString();
        }
        if (!current.getCurrentView()) {
            init("Workspace");
        }
        if (!(langMap[current.getCurrentView()]) || langMap[current.getCurrentView()][this] == 'undefined' || langMap[current.getCurrentView()][this] == null) {
            console.log("did not find translate key in your json file.Key:" + this.toString() + " current view: " + current.getCurrentView());
            return this.toString();
        }

        return langMap[current.getCurrentView()][this];
    };

    i18n.init = init;
    i18n.translate = translate;
    i18n.lang = getLang;
})();