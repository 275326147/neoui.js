
define( [ "ui/Peek", "ui/NTree" ], function() {
        
        return function( container ) {

                container
                .find( ".ui.ntree:first" ).ntree( {
                        service: {
                                serviceName: "help.online.faq.tree.QuerySaas",
                                moduleName: "catalog"
                        },

                        parentKey: "a03_parent_id",
                        textKey: "a03_name",
                        valueKey: "a03_id",
                        rootIds: [ "C000000000481935" ]
                } );

                /**
                container
                .find( ".ui.ntree:first" ).ntree( {
                        service: {
                                serviceName: "fnd.liuwei.tests.QueryUserTests",
                                moduleName: "gridElement_testliuweis"
                        },

                        parentKey: "trees_parent",
                        textKey: "trees_textkey",
                        valueKey: "id",
                        rootIds: [ "10" ]
                } );
                */

                container
                .find( ".ui.ntree:last" ).ntree( {
                        service: {
                                serviceName: "dmd.procurementplan.monitor.TreeQuery",
                                moduleName: "ztree_procurementPlanZtree",
                                params: 
                                { "Purchase_number":"","projectid":"","customer_number":"","boq_no":"","FromDate_firstCRD":"","ToDate_firstCRD":"","batchcode":"","caCode":"","plantypename":"7","shipCompanyNo":"","status":"","planNo":"","customerId":"","repofficeid":"","countrySymbol":"","sql":"1=1","usernumber":"","boq_header_id":"","contract_no":"","catree":"","errormessage":"","project_name":"","plist":"","esource":"","FromDate_firstRPD":"","ToDate_firstRPD":"","validStatus":"Valid" }
                        },

                        parentKey: "parentid",
                        textKey: "nodename",
                        valueKey: "vid",
                        rootIds: [ "-1" ],

                        filter: {
                                "0": function( item ) {
                                        return item.nodename !== "ShowAll";
                                }
                        },

                        closeSameLevel: true
                } );

                $( document.body ).peek( { offset: -60 } );
        };
} );
