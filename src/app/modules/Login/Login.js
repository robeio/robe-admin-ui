define([
    'text!./Login.html',
    'kendo/kendo.button.min',
    'lib/zebra_cookie',
    'lib/cryptojs/core-min',
    'lib/cryptojs/enc-base64-min',
    'lib/cryptojs/sha256',
    'robe/view/RobeView',
    'modules/ForgotPassword/ForgotPassword'
], function(view) {

    var LoginView = require('robe/view/RobeView').define({
        name: "LoginView",
        html: view,
        containerId: "dialogMessage",
        parentPage: null,
        initialize: function() {
            var token = $.cookie.read("auth-token");
            $('#loginError').hide();
            var me = this;

            $('#login-button').kendoButton({
                click: function(token) {
                    $.ajax({
                        type: "POST",
                        url: AdminApp.getBackendURL() + "authentication/login",
                        data: JSON.stringify({
                            username: $("#username").val(),
                            password: CryptoJS.SHA256($("#password").val()).toString()
                        }),
                        contentType: "application/json; charset=utf-8",
                        success: function(response) {
                            $.cookie.write("userEmail", $("#username").val());
                            $(document.body).unbind("keydown");
                            me.parentPage.loadMenu();
                            $('#dialog').data("kendoWindow").close();
                            $("#active-user-name").html($("#username").val());
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown);
                        },
                        statusCode: {
                            401: function() {
                                $('#loginError').show();
                            },
                            422: function(xhr) {
                                var errors = JSON.parse(xhr.responseText);
                                var msg = "";
                                $.each(errors, function(index, error) {
                                    msg += "<br> <b>" + error.name + ":</b> " + error.message;
                                });
                                robe.App.instance.showDialog(msg);
                            }
                        }
                    });
                },
                imageUrl: "./icon/checkmark.png"
            });
            $(document.body).keydown(function(e) {
                if (e.keyCode == 13) {
                    $("#login-button")[0].focus();
                }
            });

            $("#forgotPassword").click(function() {
                kendo.destroy($('#dialogMessage'));
                $('#dialogMessage').html('');
                var ForgotPassword = require('modules/ForgotPassword/ForgotPassword');
                ForgotPassword.render();
            });
            $('#dialog').data("kendoWindow").setOptions({
                width: 420
            });

        }
    });

    return LoginView;
});