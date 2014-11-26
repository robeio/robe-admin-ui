define([
    'text!./ForgotPassword.html',
    'kendo/kendo.button.min',
    'robe/view/RobeView'
], function(view) {

    var ForgotPassword = require('robe/view/RobeView').define({
        name: "ForgotPassword",
        html: view,
        containerId: "dialogMessage",

        initialize: function() {
            var me = this;
            $('#btnForgotPassword').kendoButton({
                click: function(token) {
                    if ($("#forgotEmail").val() == "" || $("#forgotEmail").val() == null) {
                        $("#messageFromServer").text("Lütfen e-posta adresinizi yazınız...");
                    } else {
                        $.ajax({
                            type: "POST",
                            url: AdminApp.getBackendURL() + "authentication/forgotpassword/" + $("#forgotEmail").val(),
                            dataType: "text",
                            success: function(response) {
                                console.log("Success : " + response);
                            },
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log("Error : " + errorThrown);
                            }
                        });
                    }
                },
                imageUrl: "./icon/checkmark.png"
            });
        }
    });

    return ForgotPassword;
});