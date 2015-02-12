define([
    'text!./Workspace.html',
    'modules/Login/Login',
    'robe/widget/sidemenu/SideMenu',
    'text!./ErrorWindow.html',
    'kendo/kendo.fx.min',
    'kendo/kendo.progressbar.min',
    'kendo/kendo.button.min',
    'kendo/kendo.window.min',
    'kendo/kendo.panelbar.min',
    'lib/bootstrap/bootstrap.min',
    'robe/view/RobeView'
], function (view, LoginView, SideMenu, ErrorWindow) {

    var WorkspaceView = require('robe/view/RobeView').define("WorkspaceView", view, "container");

    WorkspaceView.render = function () {
        kendo.destroy($('#body'));
        $('#body').html('');
        $('#body').append(view);
        WorkspaceView.initialize();
        i18n.init("Workspace");
    };

    WorkspaceView.initialize = function () {
        var errorTemplate = kendo.template(ErrorWindow);

        var errorMessageWindow = $("#errorMessage").kendoWindow({
            visible: false,
            modal: true,
            width: "500px"
        }).data("kendoWindow");

        $(document).ajaxError(function (event, request, settings) {
            var response;
            if (request.status == 401) {
                loadLogin();
                $('#loginError').show();
            } else if (request.status == 403) {
                response = {
                    name: "Forbidden", value: "No permission for this request"
                };
                showErrorMessage(response);
            } else {
                try {
                    response = JSON.parse(request.responseText);
                    if ($.isArray(response)) {
                        response = JSON.stringify(response[0]);
                    }
                } catch (err) {
                    console.log(err);
                    console.log("Unparsable response data :" + request.responseText);
                    response = {
                        name: request.statusText, value: request.responseText
                    };

                }
                showErrorMessage(response);

            }
        });

        function showErrorMessage(response) {
            errorMessageWindow.title(response.name);
            errorMessageWindow.content(errorTemplate(response));
            errorMessageWindow.open().center();

            $("#error-window-close-button").click(function (ev) {
                ev.preventDefault();
                errorMessageWindow.close()
            });
        }

        var me = this;
        $("#progressBar").kendoProgressBar({
            min: 0,
            max: 1,
            type: "value",
            showStatus: false,
            animation: {
                duration: 200
            }
        });

        kendo.destroy($("#container"));

        $("#logout").click(function () {
            var domainPath = $.cookie("domain").split(';');
            $.removeCookie("auth-token",{domain: domainPath[0] , path: domainPath[1] });
            $.removeCookie("lang");
            location.reload();
        });

        $("#settings").kendoButton({
            click: onClickSettingsButton
        });

        $('#dialog').kendoWindow({
            actions: {},
            modal: true,
            visible: false,
            minHeight: 100,
            minWidth: 300
        });

        $("#btnContainerHelp").kendoButton({
            click: onShowHelp
        });

        function onShowHelp() {
            var wnd = $("#containerHelpWindow").kendoWindow({
                title: "Yardım".i18n(),
                modal: true,
                visible: false,
                resizable: false,
                width: 500
            }).data("kendoWindow");

            wnd.center().open();
        };

        $(document).ajaxStart(function () {
            showIndicator(true);
        });
        $(document).ajaxStop(function () {
            showIndicator(false);
        });

        if ($.cookie("auth-token") == null) {
            loadLogin();
        } else {
            $("#active-user-name").html($.cookie("userEmail"));
            this.loadMenu();
        }

        function onClickSettingsButton(e) {
            $("#dropdownMenu").toggle("fast");
        };

        function showIndicator(show) {
            if (show)
                $("#progressBar").data("kendoProgressBar").value(0);
            else
                $("#progressBar").data("kendoProgressBar").value(1);
        };

        function showDialog(message, title) {
            if (message != null)
                $('#dialogMessage').html(message);
            if (title == null)
                title = "";
            $('#dialog').data("kendoWindow").setOptions({
                width: 420
            });
            $('#dialog').data("kendoWindow").title(title);
            $('#dialog').data("kendoWindow").open();
            $('#dialog').data("kendoWindow").center();

        };

        function loadLogin() {
            showDialog(null, "Giriş".i18n());
            kendo.destroy($('#dialogMessage'));
            $('#dialogMessage').html('');
            LoginView.parentPage = me;
            LoginView.render();
        };


        $('ul#user-menu').delegate('a', 'click', function () {
            var element = $(this);
            var code = element.attr("code");
            $.cookie("lang", code);
            location.reload();
        });

        for (var key in  AdminApp.getLangs()) {
            var value = AdminApp.getLangs()[key];
            var code = value.value;
            var text = value.text;
            $('#user-menu').prepend('<li><a href="#" lang="' + code + '" id="language-' + code + '" code="' + code + '">' + text + '</a></li>');
        }
        $('#language-' + $.cookie("lang")).addClass("li-active");
        i18n.translate();

    };

    WorkspaceView.loadMenu = function () {
        $.ajax({
            type: "GET",
            url: AdminApp.getBackendURL() + "menu/user",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                console.log(response);
                //ignore root item
                SideMenu.items = response[0].items;
                SideMenu.render();
                $('#lblContainerTitle').text("Hoşgeldiniz".i18n());
                $('#language-' + $.cookie("lang")).addClass("li-active");
                i18n.init("Workspace");
                i18n.translate();

            }
        });
    };


    return WorkspaceView;
});
