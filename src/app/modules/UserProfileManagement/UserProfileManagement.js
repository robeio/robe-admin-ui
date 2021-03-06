define([
    'text!./UserProfileManagement.html',
    'lib/cryptojs/core-min',
    'lib/cryptojs/enc-base64-min',
    'lib/cryptojs/sha256',
    'kendo/kendo.grid.min',
    'kendo/kendo.window.min',
    'kendo/kendo.button.min',
    'kendo/kendo.dropdownlist.min',
    'kendo/kendo.upload.min',
    'robe/view/RobeView'
], function (view) {

    var UserProfileManagementView = require('robe/view/RobeView').define({
        name: "UserProfileManagementView",
        html: view,
        containerId: "container",

        initialize: function () {

            i18n.init("UserProfileManagement");
            var me = this;

            var panelError = $("#panelError");
            var panelHeader = $("#panelHeader");
            $.ajax({
                type: "GET",
                url: AdminApp.getBackendURL() + "users/profile",
                contentType: "application/json",
                success: function (response) {
                    $("#emailAddress").val(response.email);
                    $("#firstAndLastName").val(response.name + " " + response.surname);
                    me.data = response;
                },
                error: function (e) {

                }
            });

            var goodColor = "#66cc66";
            var badColor = "#ff6666";

            $("#newPassword").focusout(function () {
                if (validatePassword()) {
                    $("#newPassword").css("background-color", goodColor);
                } else {
                    $("#newPassword").css("background-color", badColor);
                }

            });

            $("#reNewPassword").keyup(function () {
                if (validatePassword() && isMatch()) {
                    $("#newPassword").css("background-color", goodColor);
                    $("#reNewPassword").css("background-color", goodColor);
                } else {
                    $("#newPassword").css("background-color", badColor);
                    $("#reNewPassword").css("background-color", badColor);
                }
            });


            function validatePassword() {
                var error = "";
                var isValid = true;

                var newPassword = $("#newPassword");
                var message = $("#confirmMessage");

                if ((newPassword.val().length < 4) || (newPassword.val.length > 15)) {
                    error += "Şifreniz en az 4 en fazla 15 karakter uzunluğunda olmalı.".i18n() + "<br/>";
                    message.innerHTML = error;
                    isValid = false;
                }
                // Accepts Only Alphanumeric Chars
                if (!(newPassword.val().match(/^.*(?=.*[a-zA-Z])(?=.*\d).*$/i))) {
                    error += "Şifrenizde en az bir adet rakam ve bir adet harf olmalıdır".i18n() + "<br/>";
                    message.innerHTML = error;
                    isValid = false;
                }

                if (!(newPassword.val().match(/^\S*$/))) {
                    error += "Şifrenizde boşluk olamaz".i18n() + "<br/>";
                    message.innerHTML = error;

                    isValid = false;
                }
                panelHeader.attr("class", "k-header");
                panelError.attr("class", "k-block k-error-colored");
                panelError.html(error);
                return isValid;
            }

            function isMatch() {
                var newPassword = $("#newPassword");
                var reNewPassword = $("#reNewPassword");
                var matchMessage = $("#matchMessage");
                if (newPassword.val() != reNewPassword.val()) {
                    panelError.text("Şifreleriniz eşleşmiyor.");
                    panelError.attr("class", "k-block k-error-colored");
                    panelHeader.attr("class", "k-header");
                    return false;
                }
                panelError.attr("class", "hiddenDiv");
                panelHeader.attr("class", "hiddenDiv");
                matchMessage.text("");
                return true;
            }

            $("#savePassword").kendoButton({
                icon: 'tick',
                click: function () {

                    if (validatePassword() && isMatch()) {
                        $.ajax({
                            type: "POST",
                            url: AdminApp.getBackendURL() + "users/updatePassword",
                            data: {
                                newPassword: CryptoJS.SHA256($("#newPassword").val()).toString(),
                                oldPassword: CryptoJS.SHA256($("#oldPassword").val()).toString()
                            },
                            success: function (response) {
                                showToast("success", "Şifreniz Başarılı Bir Şekilde Güncellendi");
                                $("#oldPassword").val("");
                                $("#newPassword").val("");
                                $("#reNewPassword").val("");

                                $("#newPassword").css("background-color", "white");
                                $("#reNewPassword").css("background-color", "white");
                            },
                            error: function (e) {
                                showToast("error", "Hata: Şifre Güncellenemedi !");
                                $("#oldPassword").val("");
                                $("#newPassword").val("");
                                $("#reNewPassword").val("");

                                $("#newPassword").css("background-color", "white");
                                $("#reNewPassword").css("background-color", "white");
                            }
                        });
                    } else {
                        showToast("error", "Hata: Şifreler Uyumsuz ve Hatalı !");
                    }
                }
            });
            i18n.translate();
        }
    });

    return UserProfileManagementView;
});