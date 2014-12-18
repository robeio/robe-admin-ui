define([
    'text!./MailTemplateManagement.html',
    './MailTemplateDataSource',
    './SystemLanguageDataSource',
    'kendo/kendo.button.min',
    'kendo/kendo.grid.min',
    'kendo/kendo.editor.min',
    'kendo/kendo.dropdownlist.min',
    'robe/AlertDialog',
    'robe/view/RobeView'
], function (view, MailTemplateDataSource, SystemLanguageDataSource) {

    var MailTemplateManagement = require('robe/view/RobeView').define({
        name: "MailTemplateManagement",
        html: view,
        containerId: "container",
        initialize: function () {

            i18n.init("MailTemplateManagement");
            console.log("meee")

            $("#templateGrid").kendoGrid({
                dataSource: MailTemplateDataSource.get(),
                sortable: true,
                autoBind: false,
                pageable: {
                    refresh: true
                },
                toolbar: [{
                    name: "create",
                    text: "Yeni Template".i18n(),
                    height: 100,
                    width: 100
                }],
                columns: [{
                    field: "lang",
                    title: "Dil".i18n(),
                    editor: userTemplateLanguagePopupEditor

                }, {
                    field: "code",
                    title: "Kod".i18n()
                }, {
                    field: "template",
                    title: "Template".i18n(),
                    editor: userTemplatePopupEditor,
                    hidden: true
                }, {
                    command: [{
                        name: "edit",
                        text: {
                            edit: "",
                            update: "Güncelle".i18n(),
                            cancel: "İptal".i18n()
                        },
                        className: "grid-command-iconfix"
                    }, {
                        name: "destroy",
                        text: "",
                        className: "grid-command-iconfix"
                    }],
                    title: "&nbsp;",
                    width: "80px"
                }],
                editable: {
                    mode: "popup",
                    window: {
                        title: "Kayıt".i18n()
                    },
                    confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                    confirmDelete: "Yes"
                },
                edit: onEdit
            });


            function onEdit(e) {
                var editWindow = this.editable.element.data("kendoWindow");
                editWindow.setOptions({
                    width: 800
                });
                editWindow.center();
                $(".k-edit-buttons").css("width", "780px");
            };

            function userTemplatePopupEditor(container, options) {
                var exampleChangePassword =
                    "<p>Sayın ${name} ${surname} ,</p>" +
                    " <p>Kısa süre önce bir şifre sıfırlama isteği aldık. Şifrenizi sıfırlamak istiyorsanız <a href='${ticketUrl}'>buradan</a> " +
                    "işleminizi gerçekleştirebilirsiniz.</p>";

                var exampleRegister =
                    "<p>Sayın kullanıcı,</p>" +
                    " <p>Kısa süre önce bir kayıt olma isteği aldık. Kayıt olmak istiyorsanız <a href='${ticketUrl}'>buradan</a> " +
                    "işleminizi gerçekleştirebilirsiniz.</p>";
                $('<textarea name="template" required="required" data-required-msg="Template alanı gerekli." style="width: 600px;" data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoEditor({
                        tools: [
                            "insertHtml",
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "justifyLeft",
                            "justifyCenter",
                            "justifyRight",
                            "justifyFull",
                            "insertUnorderedList",
                            "insertOrderedList",
                            "indent",
                            "outdent",
                            "createLink",
                            "unlink",
                            "insertImage",
                            "subscript",
                            "superscript",
                            "createTable",
                            "addRowAbove",
                            "addRowBelow",
                            "addColumnLeft",
                            "addColumnRight",
                            "deleteRow",
                            "deleteColumn",
                            "viewHtml",
                            "formatting",
                            "fontName",
                            "fontSize",
                            "foreColor",
                            "backColor"
                        ],
                        insertHtml: [{
                            text: "Change Password",
                            value: exampleChangePassword
                        }, {
                            text: "Register Form",
                            value: exampleRegister
                        }]
                    });

            };

            function userTemplateLanguagePopupEditor(container, options) {
                $('<input name="lang" required="required" data-required-msg="Dil alanı gerekli." data-text-field="name" data-value-field="code" class="pull-left" style="width: 175px;" data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        optionLabel: "Seçiniz...".i18n(),
                        dataTextField: "name",
                        dataValueField: "code",
                        dataSource: SystemLanguageDataSource.get(),
                        index: 0
                    });
            };

            i18n.translate();
        }
    });

    return MailTemplateManagement;
});