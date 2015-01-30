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
        containerId: "dialogMessage",
        parentPage: null,
        initialize: function () {

            i18n.init("Login");

            var token = $.cookie("auth-token");
            $('#loginError').hide();
            var me = this;

            $('#login-button').kendoButton({
                click: function (token) {

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
                        success: function (response,textStatus, request) {

                            $(document.body).unbind("keydown");
                            var domain = response.domain;
                            var params = domain.split(';')

                            var path = "";

                            for(var i in params){
                                var param = params[i];
                                if(param.indexOf("path") == 0) {
                                    path = param.split("=")[1];
                                }
                                if(param.indexOf("domain") == 0) {
                                    domain = param.split("=")[1];
                                }
                            }
                            $.cookie("domain",domain +";" + path);
                            $('#dialog').data("kendoWindow").close();
                            $("#active-user-name").html($("#username").val());
                            me.parentPage.loadMenu();
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


            $("#forgotPassword").click(function () {
                kendo.destroy($('#dialogMessage'));
                $('#dialogMessage').html('');
                var ForgotPassword = require('modules/ForgotPassword/ForgotPassword');
                ForgotPassword.render();
            });
            $('#dialog').data("kendoWindow").setOptions({
                width: 420
            });

            $("#language").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: AdminApp.getLangs(),
                height: 100,
                width: 40,
                value: i18n.lang()
            }).closest(".k-widget").width(80);

            i18n.translate();

        }


    });

    return LoginView;
});