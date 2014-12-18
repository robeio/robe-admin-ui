define([
    'text!./Workspace.html',
    'modules/Login/Login',
    'robe/widget/sidemenu/SideMenu',
    'kendo/kendo.fx.min',
    'kendo/kendo.progressbar.min',
    'kendo/kendo.button.min',
    'kendo/kendo.window.min',
    'kendo/kendo.panelbar.min',
    'lib/bootstrap/bootstrap.min',
    'robe/view/RobeView',
], function (view, LoginView, SideMenu) {

    var WorkspaceView = require('robe/view/RobeView').define("WorkspaceView", view, "container");

    WorkspaceView.render = function () {

        kendo.destroy($('#body'));
        $('#body').html('');
        $('#body').append(view);
        WorkspaceView.initialize();
        i18n.init("Workspace");
    };

    WorkspaceView.initialize = function () {

        $(document).ajaxError(function (event, request, settings) {
            var response;
            $("#btnDialogClose").css('display', '');
            $('#dialogMessage').html('');
            try {
                if (request.status == 401) {
                    loadLogin();
                    $('#loginError').show();
                    $("#btnDialogClose").css('display', 'none');
                }
                else {
                    response = JSON.parse(request.responseText);
                    if ($.isArray(response)) {
                        response = response[0];
                    }
                    showDialog("Hata Detayı : " + response.value, "Hata : " + response.name);
                }
            }
            catch (err) {
                console.log("Unparsable response data :" + request.responseText);
                showDialog(request.responseText, request.statusText);

            }
        });

        $("#btnDialogClose").kendoButton({
            icon: "close",
            click: onCloseClick
        });

        $("#btnDialogClose").css('display', 'none');

        function onCloseClick(e) {
            $('#dialog').data("kendoWindow").close();
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
            $.cookie.destroy("auth-token");
            $.cookie.destroy("lang");
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

        if ($.cookie.read("auth-token") == null) {
            loadLogin();
        } else {
            $("#active-user-name").html($.cookie.read("userEmail"));
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
            $.cookie.write("lang", code);
            location.reload();
        });

        for (var key in  AdminApp.getLangs()) {
            var value = AdminApp.getLangs()[key];
            var code = value.value;
            var text = value.text;
            $('#user-menu').prepend('<li><a href="#" id="language-' + code + '" code="' + code + '">' + text + '</a></li>');
        }
        $('#language-' + $.cookie.read("lang")).addClass("li-active");
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
                $('#language-' + $.cookie.read("lang")).addClass("li-active");
                i18n.init("Workspace");
                i18n.translate();

            }
        });
    };


    return WorkspaceView;
});
