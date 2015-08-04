define([
    'lib/requirejs-router/router.min'
], function (Router) {

    Router.registerRoutes({
        Workspace: {
            path: '/Workspace',
            moduleId: 'modules/Workspace/Workspace'
        },
        Login: {
            path: '/Login',
            moduleId: 'modules/Login/Login'
        },
        ForgotPassword: {
            path: '/ForgotPassword',
            moduleId: 'modules/ForgotPassword/ForgotPassword'
        },
        UserManagement: {
            path: '/UserManagement',
            moduleId: 'modules/UserManagement/UserManagement'
        },
        RoleManagement: {
            path: '/RoleManagement',
            moduleId: 'modules/RoleManagement/RoleManagement'
        },
        MenuManagement: {
            path: '/MenuManagement',
            moduleId: 'modules/MenuManagement/MenuManagement'
        },
        PermissionManagement: {
            path: '/PermissionManagement',
            moduleId: 'modules/PermissionManagement/PermissionManagement'
        },
        Dashboard: {
            path: '/Dashboard',
            moduleId: 'modules/Dashboard/Dashboard'
        },
        MailTemplateManagement: {
            path: '/MailTemplateManagement',
            moduleId: 'modules/MailTemplateManagement/MailTemplateManagement'
        },
        QuartzJobManagement: {
            path: '/QuartzJobManagement',
            moduleId: 'modules/QuartzJobManagement/QuartzJobManagement'
        },
        UserProfileManagement: {
            path: '/UserProfileManagement',
            moduleId: 'modules/UserProfileManagement/UserProfileManagement'
        },
        SystemParameter: {
            path: '/SystemParameter',
            moduleId: 'modules/SystemParameterManagement/SystemParameterManagement'
        }
    }).on('routeload', function (View, routeArguments) {
        var href = window.location.href;
        var path = href.substring(href.indexOf(".html") + 5, href.length);
        var isWorkspace = ( path == "#/Workspace");
        if (!isWorkspace && $('#container').length == 0) {
            var route = this.routes.Workspace;
            require([route.moduleId], function (module) {

                var callback = function () {
                    var selected = $("[href='" + window.location.hash + "']");
                    if (selected.length != 0) {
                        $(selected[0]).click();
                    }
                };
                module.callback = callback;
                module.render();
            });
        } else {
            View.render();
        }
    }).init({
        fireInitialStateChange: true
    });

    var href = window.location.href;
    if (href.indexOf("index.html", href.length - "index.html".length) != -1) {
        $('#body').html('');
        window.location.href = "#/Workspace";
    }
    return Router;


});