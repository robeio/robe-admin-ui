   define([
       'kendo/kendo.data.min', 'robe/Validations'
   ], function() {
       var SystemLanguageModel = kendo.data.Model.define({
           id: "oid",
           fields: {
               oid: {
                   editable: false,
                   nullable: true
               },
               lastUpdated: {
                   editable: false,
                   nullable: true
               },
               code: {
                   editable: true,
                   nullable: false
               },
               name: {
                   editable: true,
                   nullable: false
               }
           }
       });
       return SystemLanguageModel;
   });