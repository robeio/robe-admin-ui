define([
    'text!./QuartzJobManagement.html',
    './CronManagement',
    './QuartzJobDataSource',
    './TriggerModel',
    'kendo/kendo.grid.min',
    'robe/view/RobeView',
    'kendo/kendo.multiselect.min',

], function (view, CronManagement, QuartzJobDataSource, TriggerModel) {

    var QuartzJobManagement = require('robe/view/RobeView').define({
        name: "QuartzJobManagement",
        html: view,
        containerId: "container",

        initialize: function () {

            i18n.init("QuartzJobManagement");
            var currentRow;
            $("#gridJobs").kendoGrid({
                dataSource: QuartzJobDataSource.get(),
                sortable: true,
                pageable: {
                    refresh: true
                },
                autoBind: false,
                detailInit: detailInit,
                dataBound: function () {
                    // TODO change another good way .first()
                    this.expandRow(this.tbody.find("tr.k-master-row"));
                },
                columns: [
                    {
                        field: "oid",
                        title: "OID",
                        hidden: true
                    },
                    {
                        field: "name",
                        title: "İsim".i18n(),
                        width: 150
                    },
                    {
                        field: "jobClass",
                        title: "İş Sınıfı".i18n()
                    },
                    {
                        field: "description",
                        title: "Açıklama".i18n()
                    },
                    {
                        command: [
                            {
                                name: "add",
                                text: "",
                                className: "grid-command-iconfix",
                                imageClass: "k-icon k-si-plus",
                                click: addTrigger
                            }
                        ],
                        width: "50px"
                    }
                ]
            });

            function detailInit(e) {

                $("<div id='" + e.data.oid + "' class='gridTriggers'/>").appendTo(e.detailCell).kendoGrid({
                    dataSource: {
                        transport: {
                            read: {
                                type: "GET",
                                url: AdminApp.getBackendURL() + "triggers",
                                dataType: "json",
                                contentType: "application/json"
                            },
                            update: {
                                type: "PUT",
                                url: function (options) {
                                    return AdminApp.getBackendURL() + "triggers/" + options.oid;
                                },
                                dataType: "json",
                                contentType: "application/json",
                                complete: function () {
                                    showToast("success", "Başarı ile güncellendi".i18n());
                                }
                            },
                            create: {
                                type: "POST",
                                url: AdminApp.getBackendURL() + "triggers",
                                dataType: "json",
                                contentType: "application/json",
                                complete: function () {
                                    showToast("success", "Başarı ile oluşturuldu".i18n());
                                }
                            },
                            destroy: {
                                type: "DELETE",
                                url: function (options) {
                                    return AdminApp.getBackendURL() + "triggers/" + options.oid;
                                },
                                dataType: "json",
                                contentType: "application/json",
                                complete: function () {
                                    showToast("success", "Başarı ile silindi".i18n());
                                }
                            },
                            parameterMap: function (options, operation) {
                                if (operation !== "read") {
                                    return kendo.stringify(options);
                                }
                            }
                        },
                        schema: {
                            model: TriggerModel
                        },
                        filter: {
                            field: "jobOid",
                            operator: "eq",
                            value: e.data.oid
                        },
                        serverPaging: false,
                        serverFiltering: false,
                        serverSorting: false
                    },
                    editable: {
                        mode: "popup",
                        window: {
                            title: "Kayıt".i18n()
                        },
                        confirmation: "Silmek istediğinizden emin misiniz?".i18n(),
                        confirmDelete: "Yes"
                    },
                    edit: OnEdit,
                    serverFiltering: false,
                    columns: [
                        {
                            field: "type",
                            title: "Tip".i18n(),
                            editor: typeDropdownEditor,
                            template: getTypeText
                        },
                        {
                            field: "cron",
                            title: "Cron".i18n()
                        }, {
                            field: "name",
                            title: "İsim".i18n()
                        }, {
                            field: "group",
                            title: "Grup".i18n()
                        }, {
                            field: "startTime",
                            title: "Başlangıç Tarihi".i18n(),
                            editor: startTimeEditor,
                            template: "#=data.startTime==-1?data.startTime:kendo.toString(new Date(data.startTime),'dd/MM/yyyy HH:mm:ss')#"
                        }, {
                            field: "endTime",
                            title: "Bitiş Tarihi".i18n(),
                            editor: endTimeEditor,
                            template: "#=(data.endTime==-1 || !(data.endTime))?data.endTime:kendo.toString(new Date(data.endTime),'dd/MM/yyyy HH:mm:ss')#"
                        },
                        {
                            field: "repeatCount",
                            title: "Tekrar Sayısı".i18n(),
                            editor: numberEditor
                        },
                        {
                            field: "repeatInterval",
                            title: "Tekrar Sıklığı".i18n(),
                            editor: numberEditor
                        },
                        {
                            field: "active",
                            title: "Aktif?".i18n(),
                            template: "<span class='" + "#=(data.active)?'k-icon k-i-tick':'k-icon k-i-cancel'#'/>",
                            width: 70
                        },
                        {
                            command: [
                                {
                                    name: "run",
                                    text: "",
                                    imageClass: "k-icon k-i-arrow-e",
                                    className: "grid-command-iconfix",
                                    click: fire
                                },
                                {
                                    name: "stop",
                                    text: "",
                                    className: "grid-command-iconfix",
                                    imageClass: "k-icon k-i-seek-e",
                                    click: stop
                                },
                                {
                                    name: "edit",
                                    text: {
                                        edit: "",
                                        update: "Güncelle".i18n(),
                                        cancel: "İptal".i18n()
                                    },
                                    className: "grid-command-iconfix"
                                },
                                {
                                    name: "destroy",
                                    text: "",
                                    className: "grid-command-iconfix"
                                }
                            ],
                            title: "&nbsp;",
                            width: "140px"
                        }
                    ]
                });
            }

            var getTypeText = function (value) {
                for (var key in data) {
                    var obj = data[key];
                    if (data.hasOwnProperty(key)) {
                        if (obj.value == value.type) {
                            return obj.text;
                        }
                    }

                }
                return data[value.type];
            };

            function OnEdit(e) {

                if (e.model.isNew()) {
                    e.model.jobOid = currentRow;
                    e.model.startTime = -1;
                    e.model.endTime = -1;
                    e.container.find("input[name=startTime]").val(-1);
                    e.container.find("input[name=endTime]").val(-1);
                }
                e.container.find("input[name=active]").hide();
                e.container.find("label[for=active]").hide();

                var input = e.container.find("input[name=cron]");
                if (e.model.type != "CRON") {
                    input.attr('readonly', true);
                    e.model.cron = "";
                    input.val("");
                } else {
                    if (!input.val()) {
                        e.model.cron = "* * * * * ?";
                        input.val("* * * * * ?");
                    }

                }
                input.focus(function () {
                    if (!input.attr("readonly")) {
                        CronManagement.render(input.val());
                    }

                });
            }

            function numberEditor(container, options) {
                $('<input data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoNumericTextBox({
                        min: 0,
                        format: '#'
                    });
            }

            function endTimeEditor(container, options) {
                var field = options.field;

                var value = (options.model.endTime == -1 || !(options.model.endTime)) ? "" : new Date(options.model.startTime);

                $('<input data-text-field="' + field + '" data-value-field="' + field + '"/>')
                    .appendTo(container)
                    .kendoDatePicker({
                        format: "dd/MM/yyyy HH:mm:ss",
                        culture: 'tr-TR',
                        value: value,
                        change: function (e) {
                            if (this.value()) {
                                options.model.set('endTime', this.value().getTime());
                            } else {
                                options.model.set('endTime', -1);
                            }

                        },
                        open: function () {
                            if (this.value()) {
                                options.model.set('endTime', this.value().getTime());
                            } else {
                                options.model.set('endTime', -1);
                            }
                        }
                    });
            };

            function startTimeEditor(container, options) {
                var field = options.field;
                var value = (options.model.startTime == -1 || !(options.model.startTime)) ? "" : new Date(options.model.startTime);

                $('<input data-text-field="' + field + '" data-value-field="' + field + '"/>')
                    .appendTo(container)
                    .kendoDatePicker({
                        format: "dd/MM/yyyy HH:mm:ss",
                        culture: 'tr-TR',
                        value: value,
                        open: function () {
                            if (this.value()) {
                                options.model.set('startTime', this.value().getTime());
                            } else {
                                options.model.set('startTime', -1);
                            }
                        },
                        change: function (e) {
                            if (this.value()) {
                                options.model.set('startTime', this.value().getTime());
                            } else {
                                options.model.set('startTime', -1);
                            }
                        }
                    });
            };
            var data = [
                {text: "Temel".i18n(), value: "SIMPLE"},
                {text: "Cron".i18n(), value: "CRON"},
                {text: "Uygulama Açıldığında".i18n(), value: "ON_APP_START"},
                {text: "Uygulama Durdurulduğunda".i18n(), value: "ON_APP_STOP"}
            ];


            function typeDropdownEditor(container, options) {
                $('<input name="type" required data-required-msg="Lütfen Seçiniz" data-value-primitive=true  data-value-field="value" data-text-field="text"  data-bind="value:' + options.field + '"/>')
                    .appendTo(container)
                    .kendoDropDownList({
                        autoBind: false,
                        dataTextField: "text",
                        dataValueField: "value",
                        optionLabel: "<Seçiniz>",
                        dataSource: data,
                        change: function () {
                            if (this.value() != "CRON") {
                                options.model.set("cron", "");
                                $('[name="cron"]').prop('readonly', true);
                            } else {
                                options.model.set("cron", "* * * * * ?");
                                $('[name="cron"]').prop('readonly', "");
                            }
                            options.model.set("type", this.value());
                        }
                    });

            }

            function fire(e) {
                e.preventDefault();

                $.ajax({
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "triggers/run",
                    dataType: "json",
                    data: kendo.stringify(this.dataItem($(e.currentTarget).closest("tr"))),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        QuartzJobDataSource.read(true);
                    }
                });
            }

            function stop(e) {

                e.preventDefault();
                $.ajax({
                    type: "PUT",
                    url: AdminApp.getBackendURL() + "triggers/stop",
                    dataType: "json",
                    data: kendo.stringify(this.dataItem($(e.currentTarget).closest("tr"))),
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        QuartzJobDataSource.read();
                    }
                });
            }

            function addTrigger(e) {

                e.preventDefault();

                var currentRowItem = $(e.currentTarget).closest("tr");
                var gridJobs = $("#gridJobs").data("kendoGrid");
                var dataItem = this.dataItem(currentRowItem);
                currentRow = dataItem.oid;
                gridJobs.expandRow(currentRowItem);

                var grid = $('#' + currentRow).data("kendoGrid");

                if ($(currentRowItem).find(".k-icon").hasClass("k-minus")) {
                    gridJobs.collapseRow(this);
                } else {
                    gridJobs.expandRow(this);
                }
                grid.addRow();
            }

            i18n.translate();
        }
    });

    return QuartzJobManagement;
});