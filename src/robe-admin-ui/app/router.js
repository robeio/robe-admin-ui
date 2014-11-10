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
        }
    }).on('routeload', function (View, routeArguments) {
        View.render();
    }).init();

    var href = window.location.href;
    if (href.indexOf("#/Workspace", href.length - "#/Workspace".length) == -1) {
        $('#body').html('');
        window.location.href = "#/Workspace";
    }

    return Router;

});