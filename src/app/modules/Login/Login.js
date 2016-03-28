define([
    'text!./Login.html',
    'kendo/kendo.button.min',
    'lib/jquery.cookie',
    'lib/cryptojs/core-min',
    'lib/cryptojs/enc-base64-min',
    'lib/cryptojs/sha256',
    'robe/view/RobeView',
    'modules/ForgotPassword/ForgotPassword',
    'kendo/kendo.dropdownlist.min'
], function (view) {

    var LoginView = require('robe/view/RobeView').define({
        name: "LoginView",
        html: view,
        containerId: "dialogLogin",
        parentPage: null,
        callback: null,
        initialize: function () {

            if ($.cookie("auth-token")) {
                if ($.cookie("domain")) {
                    var domainPath = $.cookie("domain").split(';');
                    if (domainPath.length >= 2) {
                        $.removeCookie("auth-token", {domain: domainPath[0], path: domainPath[1]});
                    }
                }
            }
            i18n.init("Login");

            $('#loginError').hide();
            var me = this;

            $('#login-button').kendoButton({
                click: function () {
                    $.cookie("lang", $("#language").val());
                    $.cookie("userEmail", $("#username").val());

                    $.ajax({
                        type: "POST",
                        url: AdminApp.getBackendURL() + "authentication/login",
                        data: JSON.stringify({
                            username: $("#username").val(),
                            password: CryptoJS.SHA256($("#password").val()).toString()
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function (response, textStatus, request) {

                            $(document.body).unbind("keydown");
                            var domain = response.domain;
                            var params = domain.split(';');

                            var path = "";

                            for (var i in params) {
                                var param = params[i];
                                if (param.indexOf("path") == 0) {
                                    path = param.split("=")[1];
                                }
                                if (param.indexOf("domain") == 0) {
                                    domain = param.split("=")[1];
                                }
                            }

                            $.cookie("domain", domain + ";" + path);
                            $('#dialogLogin').hide();
                            $("#active-user-name").html($("#username").val());

                            if ($("#rememberme").prop('checked') == true) {
                                $.cookie('rememberme', $("#username").val());
                            } else {
                                $.removeCookie('rememberme');
                            }

                            me.parentPage.loadMenu(me.callback);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                        },
                        statusCode: {
                            401: function () {
                                $('#loginError').show();
                            },
                            422: function (xhr) {
                                var errors = JSON.parse(xhr.responseText);
                                var msg = "";
                                $.each(errors, function (index, error) {
                                    msg += "<br> <b>" + error.name + ":</b> " + error.message;
                                });
                                robe.App.instance.showDialog(msg);

                            }
                        }
                    });
                },
                imageUrl: "./icon/checkmark.png"
            });
            $(document.body).keydown(function (e) {
                if (e.keyCode == 13) {
                    $("#login-button")[0].focus();
                }
            });

            $("#forgotPassword").click(function (ev) {
                ev.preventDefault();
                kendo.destroy($('#dialogLogin'));
                $('#dialogLogin').html('');
                var ForgotPassword = require('modules/ForgotPassword/ForgotPassword');
                ForgotPassword.render();
            });

            $("#language").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: AdminApp.getLangs(),
                height: 100,
                value: i18n.lang()
            }).closest(".k-widget");

            i18n.translate();
            if ($.cookie("rememberme") !== undefined) {
                $("#username").val($.cookie('rememberme'));
                $("#rememberme").prop('checked', true)
            }


        }


    });

    return LoginView;
});