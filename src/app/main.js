// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    urlArgs: "v=1",
    paths: {
        lib: '../lib',
        text: '../lib/requirejs/text',
        kendo: '../lib/kendoui/js',
        robe: '../lib/robe',
        common: './common'
    },
    shim: {
        'lib/jquery/jquery.min': {
            exports: '$'
        },
        'lib/jquery.cookie': {
            deps: ['lib/jquery/jquery.min']
        },
        'lib/underscore/underscore': {
            exports: '_'
        },
        'lib/cryptojs/enc-base64-min': {
            deps: ['lib/cryptojs/core-min']
        },
        'lib/cryptojs/sha256': {
            deps: ['lib/cryptojs/enc-base64-min']
        },
        'router': {
            deps: ['lib/jquery/jquery.min']
        },
        'lib/requirejs-router/router.min': {
            exports: 'Router'
        },
        'lib/alertmessage/jquery.toastmessage': {
            deps: ["lib/jquery/jquery.min"]
        },
        'robe/AlertDialog': {
            deps: ['lib/alertmessage/jquery.toastmessage']
        }
    }
});

// Load our app module and pass it to our definition function
// TODO console.min.js load before for all ?
define([
    'AdminUIApp',
    'lib/jquery/jquery.min',
    'lib/jquery.cookie',
    'robe/AlertDialog',
    'lib/underscore/underscore',
    'lib/support/console.min',
    "lib/lang/lang"
], function (App) {
    App.initialize();
});