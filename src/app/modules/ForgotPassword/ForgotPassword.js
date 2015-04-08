define([
    'text!./ForgotPassword.html',
    'kendo/kendo.button.min',
    'robe/view/RobeView',
    'modules/Login/Login'
], function (view) {

    var ForgotPassword = require('robe/view/RobeView').define({
        name: "ForgotPassword",
        html: view,
        containerId: "dialogLogin",

        initialize: function () {
            $('#btnForgotPassword').kendoButton({
                click: function (token) {
                    if ($("#forgotEmail").val() == "" || $("#forgotEmail").val() == null) {
                        $("#messageFromServer").text("Lütfen e-posta adresinizi yazınız...");
                    } else {
                        $.ajax({
                            type: "POST",
                            url: AdminApp.getBackendURL() + "authentication/forgotpassword/" + $("#forgotEmail").val(),
                            dataType: "text",
                            success: function (response) {
                                console.log("Success : " + response);
                                showToast("success","Şifreniz mail adresinize başarılı bir şekilde gönderildi");

                                kendo.destroy($('#dialogLogin'));
                                $('#dialogLogin').html('');
                                var LoginView = require('modules/Login/Login');
                                LoginView.render();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log("Error : " + errorThrown);
                            }
                        });
                    }
                },
                imageUrl: "./icon/checkmark.png"
            });

            $('#dialog').data("kendoWindow").setOptions({
                width: 302
            });


            $('#btnReturnLogin').kendoButton({
                click: function () {
                    kendo.destroy($('#dialogLogin'));
                    $('#dialogLogin').html('');
                    var LoginView = require('modules/Login/Login');
                    LoginView.render();
                },
                imageUrl: "./icon/close-32x32.png"
            });
        }
    });

    return ForgotPassword;
});