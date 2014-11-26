define([
    'text!./Dashboard.html',
    'robe/view/metrics/Grid',
    'robe/view/metrics/ProgressBarGroup',
    'kendo/kendo.button.min',
    'kendo/kendo.dropdownlist.min',
    'robe/view/RobeView'
], function(view,Grid,ProgressBarGroup) {

    var Dashboard = require('robe/view/RobeView').define({
        name: "Dashboard",
        html: view,
        containerId: "container",
        initialize: function() {
            $("#btnHeapDump").kendoButton({
                click: function(e) {
                    e.preventDefault();
                    window.open(AdminApp.getBackendURL() + "system/heapdump");
                    return false;
                }
            });
            this.downloadMetricData();
        },

        downloadMetricData: function () {
            var me = this;
            $.ajax({
                contentType : "application/json",
                url : AdminApp.getBackendURL() + "../admin/metrics",
                success : function(data) {
                    me.parseMetricsJson(data);
                },
                error : function(xhr, ajaxOptions, thrownError) {
                    //alert("Error - " + xhr.status + "Message: " + thrownError);
                    metricsWatcher.initGraphs();
                },
                async : false
            });
        },

        parseMetricsJson: function(json){
            var meters = json['meters'];
            // RESPONSE
            var totalRequests = [
                "2xx",meters['io.dropwizard.jetty.MutableServletContextHandler.2xx-responses'],
                "3xx",meters['io.dropwizard.jetty.MutableServletContextHandler.3xx-responses'],
                "4xx",meters['io.dropwizard.jetty.MutableServletContextHandler.4xx-responses'],
                "5xx",meters['io.dropwizard.jetty.MutableServletContextHandler.5xx-responses']
            ];
            var metricList = [
                '1 min','m1_rate',
                '5 min','m5_rate',
                '15 min','m15_rate',
                'Mean','mean_rate'
            ];
            ProgressBarGroup.define().render('totalReq', 'Total', totalRequests,'count',1);
            var MutableServletContextHandler200 = meters['io.dropwizard.jetty.MutableServletContextHandler.2xx-responses'];
            Grid.define().render('2xxReq', '2xx-response (events/second)',metricList, MutableServletContextHandler200);
            var MutableServletContextHandler400 = meters['io.dropwizard.jetty.MutableServletContextHandler.4xx-responses'];
            Grid.define().render('4xxReq', '4xx-response (events/second)',metricList, MutableServletContextHandler400);
            var MutableServletContextHandler500 = meters['io.dropwizard.jetty.MutableServletContextHandler.5xx-responses'];
            Grid.define().render('5xxReq', '5xx-response (events/second)',metricList, MutableServletContextHandler500);



            //LOGS
            var appenderData = [
                "Debug",meters['ch.qos.logback.core.Appender.debug'],
                "Info",meters['ch.qos.logback.core.Appender.info'],
                "Warn",meters['ch.qos.logback.core.Appender.warn'],
                "Error",meters['ch.qos.logback.core.Appender.error']
            ];
            ProgressBarGroup.define().render('logbackLogs', 'Logback', appenderData,'count',1);


            var gauges = json['gauges'];
            //VM

            var unusedTotal = gauges["jvm.memory.total.max"]['value'] - gauges["jvm.memory.total.used"]['value'];
            var totalData = [
                "Used",gauges["jvm.memory.total.used"],
                "Free",{'value':unusedTotal}
            ];
            ProgressBarGroup.define().render('totalMem', 'Total (MB)', totalData,'value',1024*1024);

            var unusedHeap = gauges["jvm.memory.heap.max"]['value'] - gauges["jvm.memory.heap.used"]['value'];
            var heapData = [
                "Used",gauges["jvm.memory.heap.used"],
                "Free",{'value':unusedHeap}
            ];
            ProgressBarGroup.define().render('heapMem', 'Heap (MB)', heapData,'value',1024*1024);

            if(gauges["jvm.memory.non-heap.max"]['value']<0){
                gauges["jvm.memory.non-heap.max"]['value'] = gauges["jvm.memory.non-heap.used"]['value'];
            }
            var unusednonHeap = gauges["jvm.memory.non-heap.max"]['value'] - gauges["jvm.memory.non-heap.used"]['value'];
            var nonheapData = [
                "Used",gauges["jvm.memory.non-heap.used"],
                "Free",{'value':unusednonHeap}
            ];
            ProgressBarGroup.define().render('nonheapMem', 'Non-Heap (MB)', nonheapData,'value',1024*1024);

            var poolData = [
                "Eden",gauges["jvm.memory.pools.PS-Eden-Space.usage"],
                "Old",gauges["jvm.memory.pools.PS-Old-Gen.usage"],
                "Perm",gauges["jvm.memory.pools.PS-Perm-Gen.usage"],
                "Survior",gauges["jvm.memory.pools.PS-Survivor-Space.usage"]
            ];
            ProgressBarGroup.define().render('poolMem', 'Pool Status (%)', poolData,'value',0.01,100);

            var jvm = gauges;
            metricList = [
                "Runnable","jvm.threads.runnable.count",
                "New","jvm.threads.new.count",
                "Timed-W","jvm.threads.timed_waiting.count",
                "Waiting","jvm.threads.waiting.count",
                "Blocked","jvm.threads.blocked.count",
                "Terminated","jvm.threads.terminated.count"
            ];
            jvm.count = jvm["jvm.threads.count"]['value'];

            Grid.define().render('threads', 'Threads (count)',metricList, jvm,"value",0);



            // SERVICES
            metricList = [
                "Max", "max",
                "Min", "min",
                "Mean", "mean"];
            var serviceList = ["io.robe.auth.tokenbased.TokenBasedAuthenticator.gets","io.robe.admin.resources.AuthResource.login"];
            var serviceNameList = ["TokenBasedAuthenticator.gets","AuthResource.login"];

            var timers = json['timers'];
            for(var i = 0 ; i < serviceList.length; i++){
                var data = timers[serviceList[i]];
                Grid.define().render('service' + (i+1), serviceNameList[i] + ' (Sec)',metricList, data);
            }

        }

    });

    return Dashboard;
});