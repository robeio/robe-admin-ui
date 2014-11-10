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

            var me = this;
            $.ajax({
                type: "GET",
                url: AdminApp.getBackendURL() + "user/profile",
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
                    error += "Şifreniz en az 4 en fazla 15 karakter uzunluğunda olmalı.<br/>";
                    message.innerHTML = error;
                    isValid = false;
                }
                // Accepts Only Alphanumeric Chars
                if (!(newPassword.val().match(/^.*(?=.*[a-zA-Z])(?=.*\d).*$/i))) {
                    error += "Şifrenizde en az bir adet rakam ve bir adet harf olmalıdır<br/>";
                    message.innerHTML = error;

                    isValid = false;
                }

                if (!(newPassword.val().match(/^\S*$/))) {
                    error += "Şifrenizde boşluk olamaz.<br/>";
                    message.innerHTML = error;

                    isValid = false;
                }
                message.html(error);
                return isValid;
            }

            function isMatch() {
                var newPassword = $("#newPassword");
                var reNewPassword = $("#reNewPassword");
                var matchMessage = $("#matchMessage");
                if (newPassword.val() != reNewPassword.val()) {
                    matchMessage.text("Şifreleriniz eşleşmiyor.");
                    return false;
                }
                matchMessage.text("");
                return true;
            }

            $("#savePassword").kendoButton({
                icon: 'tick',
                click: function () {

                    if (validatePassword() && isMatch()) {
                        $.ajax({
                            type: "POST",
                            url: AdminApp.getBackendURL() + "user/updatePassword",
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
        }
    });

    return UserProfileManagementView;
});