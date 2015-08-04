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

            var alert = $('#messageFromServer');

            alert.hide();

            $('#btnForgotPassword').kendoButton({
                click: function (token) {

                    console.log(alert.val())
                    if (!$("#forgotEmail").val()) {
                        alert.text("Lütfen e-posta adresinizi yazınız...");
                        alert.show();
                    } else {
                        alert.hide();
                        $.ajax({
                            type: "POST",
                            url: AdminApp.getBackendURL() + "authentication/forgotpassword/" + $("#forgotEmail").val(),
                            dataType: "text",
                            success: function (response) {
                                console.log("Success : " + response);
                                showToast("success", "Şifreniz mail adresinize başarılı bir şekilde gönderildi");
                                alert.text("Mail Adresinize Ticket Gönderilmiştir");
                                alert.removeClass("alert-danger");
                                alert.addClass("alert-success");
                                alert.show();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.log("Error : " + jqXHR);
                                var response = JSON.parse(jqXHR.responseText);
                                alert.text(response.value);
                                alert.removeClass("alert-success");
                                alert.addClass("alert-danger");
                                alert.show();
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