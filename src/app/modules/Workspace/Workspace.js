define([
    'text!./Workspace.html',
    'modules/Login/Login',
    'kendo/kendo.fx.min',
    'kendo/kendo.progressbar.min',
    'kendo/kendo.button.min',
    'kendo/kendo.window.min',
    'kendo/kendo.panelbar.min',
    'robe/view/RobeView'
], function (view, LoginView) {

    var WorkspaceView = require('robe/view/RobeView').define("WorkspaceView", view, "container");

    WorkspaceView.render = function () {
        kendo.destroy($('#body'));
        $('#body').html('');
        $('#body').append(view);
        WorkspaceView.initialize();
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
//        Welcome page created again.Why did we give blank html content ??
//        $("#container").html("");

        $("#logout").click(function () {
            $.cookie.destroy("auth-token");
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
                title: "Yardım",
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
            showDialog(null, "Giriş");
            kendo.destroy($('#dialogMessage'));
            $('#dialogMessage').html('');
            LoginView.parentPage = me;
            LoginView.render();
        };
    };

    WorkspaceView.loadMenu = function () {
        $.ajax({
            type: "GET",
            url: AdminApp.getBackendURL() + "menu/user",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                WorkspaceView.addIcons(response[0]);
                $('#menu').kendoPanelBar({
                    dataSource: response[0].items,
                    select: function (e) {
                        var items = $(e.item).attr("class");
                        var arr = items.split(' ');
                        var selection = "k-";
                        for (var i = 0; i < arr.length; i++) {
                            var css = arr[i];
                            if (css.indexOf("command:") == 0) {
                                selection = css.substring(8);
                                var ul = $(e.item).children("ul");
                                if (ul.children("li").length > 1) {
                                    break;
                                }
                                $('#lblContainerTitle').text($(e.item).find("span").text());
                                WorkspaceView.openMenuItem(selection);
                                break;
                            }
                        }

                    }
                });
                $('#menu').find("span").find("span").remove();

            }
        });
    };

    WorkspaceView.previousItem = "";

    WorkspaceView.openMenuItem = function (menuitem) {

        if (menuitem.indexOf("k-") == 0)
            return;
        if (WorkspaceView.previousItem == menuitem)
            return;
        else
            WorkspaceView.previousItem = menuitem;
        try {
            kendo.destroy($('#container'));
            $('#container').html('');
            window.location.href = '#/' + menuitem;
        } catch (e) {
            console.error(menuitem + " JS: " + e);
        }
        kendo.fx($("#container")).fade("in").play();
    };

    WorkspaceView.addIcons = function (menu) {
        if (menu.hasOwnProperty("items")) {
            for (var i = 0; i < menu.items.length; i++) {
                WorkspaceView.addIcons(menu.items[i]);
            }
        }
        menu.imageUrl = "./icon/menu/" + menu.cssClass.substring(8) + ".png";
    };


    return WorkspaceView;
});