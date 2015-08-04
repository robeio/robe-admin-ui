define([
    'text!./CronManagement.html',
    'kendo/kendo.window.min',
    'kendo/kendo.multiselect.min',
    'robe/view/RobeView'
], function (view) {

    var CronManagementView = require('robe/view/RobeView').define({
        name: "CronManagementView",
        html: view,
        containerId: "container",
        render: function (selection) {
            CronManagementView.initialize(selection);
        },

        initialize: function (selection) {
            var detailsTemplate = kendo.template(view);
            $('#cron-management').kendoWindow({
                title: "Cron Detayı".i18n(),
                actions: [],
                modal: true,
                visible: false,
                width: 300,
                height: 540
            });


            var wnd = $('#cron-management').data("kendoWindow");
            wnd.content(detailsTemplate(selection));
            wnd.center().open();

            var secondsData = [];
            var minutesData = [];
            var hoursData = [];
            var daysData = [];
            var monthsData = [];
            var daysOfWeek = [
                {
                    name: "?",
                    value: -1
                },
                {
                    name: "Pazartesi".i18n(),
                    value: 2
                },
                {
                    name: "Salı".i18n(),
                    value: 3
                },
                {
                    name: "Çarşamba".i18n(),
                    value: 4
                },
                {
                    name: "Perşembe".i18n(),
                    value: 5
                },
                {
                    name: "Cuma".i18n(),
                    value: 6
                },
                {
                    name: "Cumartesi".i18n(),
                    value: 7
                },
                {
                    name: "Pazar".i18n(),
                    value: 1
                }
            ];

            //Fill seconds data
            secondsData.push({name: "Her Saniye".i18n(), value: -1});
            for (var i = 0; i < 60; i++) {
                secondsData.push({name: i, value: i});
            }

            //Fill minutes data
            minutesData.push({name: "Her Dakika".i18n(), value: -1});
            for (var i = 0; i < 60; i++) {
                minutesData.push({name: i, value: i});
            }

            //Fill hours data
            hoursData.push({name: "Her Saat".i18n(), value: -1});
            for (var i = 0; i < 24; i++) {
                hoursData.push({name: i, value: i});
            }


            //Fill hours data
            daysData.push({name: "?", value: -2});
            daysData.push({name: "Her Gün".i18n(), value: -1});
            for (var i = 1; i < 32; i++) {
                daysData.push({name: i, value: i});
            }

            //Fill hours data
            monthsData.push({name: "Her Ay".i18n(), value: -1});
            for (var i = 0; i < 13; i++) {
                monthsData.push({name: i, value: i});
            }

            $("#second").kendoMultiSelect({
                dataSource: secondsData,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange
            });

            $("#minute").kendoMultiSelect({
                dataSource: minutesData,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange
            });

            $("#hour").kendoMultiSelect({
                dataSource: hoursData,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange
            });

            $("#day").kendoMultiSelect({
                dataSource: daysData,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange
            });

            $("#month").kendoMultiSelect({
                dataSource: monthsData,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange
            });

            $("#dayOfWeek").kendoMultiSelect({
                dataSource: daysOfWeek,
                dataTextField: 'name',
                dataValueField: 'value',
                change: onChange,
                enable: false
            });

            $("#enableDaysOfWeek").change(function () {

                if (this.checked) {
                    $("#dayOfWeek").data("kendoMultiSelect").enable(true);
                    $("#day").data("kendoMultiSelect").value(-2);
                    $("#day").data("kendoMultiSelect").enable(false);

                } else {
                    $("#dayOfWeek").data("kendoMultiSelect").enable(false);
                    $("#day").data("kendoMultiSelect").value("");
                    $("#day").data("kendoMultiSelect").enable(true);
                    $("#dayOfWeek").data("kendoMultiSelect").value("");
                }

                onChange();
            });

            function shortObject(item) {
                var sortArray = item.value().sort(function (a, b) {
                    return a - b
                });
                var array = $.map(sortArray, function (value) {
                    return [value];
                });

                item.value(array);
            }

            $("#cron-cancel").bind("click", function (ev) {
                wnd.close();
            });

            $("#cron-update").bind("click", function (ev) {
                //TODO verinin düzgün olmasını kontrol et
                var JobCron = $('[name=cron]');
                JobCron.val($("#cron").val());
                JobCron.change();
                wnd.close();
            });

            function getCronStringValue(id, acceptEmpty) {

                var multiSelect = $("#" + id).data("kendoMultiSelect");
                var selectValue = multiSelect.value();
                if (selectValue != "") {
                    if (selectValue.reverse()[0] < 0) {
                        multiSelect.value(selectValue[0]);
                        return (selectValue[0] == -1 ? "* " : "? ");
                    } else {
                        if ((selectValue.indexOf(-1) > -1) || (selectValue.indexOf(-2) > -1)) {
                            multiSelect.value(selectValue[0]);
                            return selectValue[0] + " ";
                        } else {
                            shortObject(multiSelect);
                            return multiSelect.value() + " ";
                        }
                    }
                } else {
                    if (typeof(acceptEmpty) === 'undefined') acceptEmpty = true;
                    if (acceptEmpty) {
                        return "* ";
                    }
                    return "?";
                }
            }

            function onChange(e) {
                var cronString = "";
                //TODO tekrar kontrol edilmeli
                cronString += getCronStringValue("second");
                cronString += getCronStringValue("minute");
                cronString += getCronStringValue("hour");
                cronString += getCronStringValue("day");
                cronString += getCronStringValue("month");
                cronString += getCronStringValue("dayOfWeek", false);
                //cronString += "? ";
                $("#cron").val(cronString);

            }

            setDefaultValues(selection);

            function setDefaultvalue(value, select) {
                if (!value) {
                    return;
                }
                if (value.indexOf("*") != -1 || value.indexOf("?") != -1) {

                    if (select == "day") {
                        if (value == "*") {
                            $("#" + select).data("kendoMultiSelect").value(-1);
                        } else {
                            $("#" + select).data("kendoMultiSelect").value(-2);
                        }
                    } else {
                        $("#" + select).data("kendoMultiSelect").value(-1);
                    }

                } else {
                    $("#" + select).data("kendoMultiSelect").value(value);
                }
            }

            function setDefaultValues(exCron) {
                var allValues = exCron.split(" ");
                var secondValues = allValues[0].split(",");
                var minuteValues = allValues[1].split(",");
                var hourValues = allValues[2].split(",");
                var dayValues = allValues[3].split(",");
                var monthValues = allValues[4].split(",");
                var dayOfWeekValues;
                if (allValues[5]) {
                    dayOfWeekValues = allValues[5].split(",");
                    $('#enableDaysOfWeek').prop('checked', true);
                    $('#enableDaysOfWeek').trigger("change");
                } else {
                    dayOfWeekValues = "";
                }

                console.log(dayOfWeekValues)
                setDefaultvalue(secondValues, "second");
                setDefaultvalue(minuteValues, "minute");
                setDefaultvalue(hourValues, "hour");
                setDefaultvalue(dayValues, "day");
                setDefaultvalue(monthValues, "month");
                setDefaultvalue(dayOfWeekValues, "dayOfWeek");

                onChange();

            }

            i18n.translate();

        }
    });

    return CronManagementView;
});