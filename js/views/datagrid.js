
define( [ "views/fndUserColumns", 
        "slick/paging/Paging",
	"slick/plugins/Checkboxcolumn",
	"slick/plugins/Radiocolumn",
	"slick/plugins/Actionbar",
	"slick/plugins/Treecolumn",
        "slick/core/Grid",
        "ui/Peek" ], function( fndUserColumns, Paging, Checkboxcolumn, Radiocolumn, Actionbar, Treecolumn ) {

        var 
        treeGrid = function( dom ) {
        
                var
                $G, dataView = new Slick.Data.DataView( "line_id" ), columns;

                $G = new Slick.Grid( dom, dataView, [], {
                        editable: true,

                        /** Enable keybord navigation */
                        enableCellNavigation: true,

                        /** Fast keybord navigation */
                        asyncEditorLoading: true,

                        syncColumnCellResize: true,

                        /** Filter bar */
                        enableHeaderRow: true,

                        forceFitColumns: true
                } );

                columns = [ {
                        id: "line_id",
                        name: "Line ID",
                        field: "line_id",
                        width: 120,
                        filter: true
                }, Treecolumn( $G, {
                        idKey: "line_id",
                        parentKey: "parent_line_id",
                        roots: [ 0 ],
                        expand: true,
                        columnOptions: {
                                id: "model_name",
                                name: "Model Name",
                                field: "model_name",
                                filter: true,
                                resizable: true
                        }
                } ), {
                        id: "line_source",
                        name: "Line Source",
                        field: "line_source",
                        resizable: true,
                        filter: true
                }, {
                        id: "item_desc",
                        name: "Item Description",
                        field: "item_desc",
                        resizable: true,
                        filter: true
                } ];

                $G.setColumns( columns );

                Paging( $G, dataView, {
                
                        pagingInfo: {
                                pageSize: 50,
                                pageNum: 0,

                                sizes: [ 50, 100, 500, 1000, 5000 ]
                        },

                        switcher: false,

                        fastQuery: true,

                        ajaxOptions: {
                        
                                serviceName: "iss.config.dashboard.QuerySiteCfgLineTreeList",
                                moduleName: "gridElement_issCfgDashboardSiteCfgLineTreeList",
                                params: {
                                        MRDefaltAddress_cfgLine: "DC00000000049889",
                                        entityId: "1330",
                                        p_user_id: "1268339",
                                        l_deliveryDimension: "ADC",
                                        l_is_page: "Y",
                                        l_parentSiteId: "40371567",
                                        l_phySiteId: "6220753",
                                        l_projectCode: "5516689",
                                        l_projectId: "250305",
                                        l_projectName: "Tsel non-wireless 2012",
                                        l_sourceSiteId: "undefined"
                                }
                        }
                } );
                
                Actionbar( $G, $G.getContainerNode().previousElementSibling, {
                        
                        lab: {
                                options: {
                                        key: "neoscm.datagrid.treeGrid"
                                },
                                enable: true,
                                selector: "button[name=lab]"
                        },

                        filter: {
                                enable: true,
                                selector: "button[name=filter]"
                        },

                        fullscreen: {
                                enable: true,
                                selector: "button[name=fullscreen]"
                        }
                } );

                $G.init();
        };
        
        return function( container ) {

                var 
                $G, dataView = new Slick.Data.DataView( "user_id" ), 

                columns = fndUserColumns();

                container
                .delegate( "img.preview", "click", function() {
                
                        var 
                        self = $( this ),
                        img = self
                                .attr( "tabindex", 1 )
                                .focus()
                                .clone()
                                .css( { 
                                        "position": "absolute",
                                        "top": document.body.scrollTop + screen.availHeight / 2 - 30,
                                        "left": "50%",
                                        "transition": ".3s",
                                        "opacity": 0,
                                        "z-index": 999,
                                        "box-shadow": "0 1px 24px rgba(0, 0, 0, 1.24)",
                                        "-webkit-transform": "translateX(-50%) translateY(-50%) scale(0.2)",
                                        "-moz-transform": "translateX(-50%) translateY(-50%) scale(0.2)",
                                        "transform": "translateX(-50%) translateY(-50%) scale(0.2)"
                                } )
                                .appendTo( document.body ),
                        overlay = $( "<div class='ui overlay show' />" ).appendTo( document.body );

                        setTimeout( function() {
                                
                                img.css( {
                                        "opacity": 1,
                                        "-webkit-transform": "translateX(-50%) translateY(-50%) scale(1)",
                                        "-moz-transform": "translateX(-50%) translateY(-50%) scale(1)",
                                        "transform": "translateX(-50%) translateY(-50%) scale(1)"
                                } );
                        } );

                        $( this ).on( "focusout", function() {
                                
                                img.css( {
                                        "opacity": 0,
                                        "-webkit-transform": "translateX(-50%) translateY(-50%) scale(0.2)",
                                        "-moz-transform": "translateX(-50%) translateY(-50%) scale(0.2)",
                                        "transform": "translateX(-50%) translateY(-50%) scale(0.2)"
                                } );

                                setTimeout( function() { 
                                        img.remove(); 
                                        overlay.removeClass();
                                }, 300 );
                        } );
                } )
                .delegate( "a.goto", "click", function( e ) {
                        
                        e.stopPropagation();
                        e.preventDefault();

                        $( document.body ).animate( {
                                "scrollTop": container.find( this.getAttribute( "href" ) ).offset().top - 80
                        } );
                } );

                $G = new Slick.Grid( container.find( "#testGrid" ), dataView, [], {
                        editable: true,

                        /** Enable keybord navigation */
                        enableCellNavigation: true,

                        /** Fast keybord navigation */
                        asyncEditorLoading: true,

                        syncColumnCellResize: true,

                        /** Filter bar */
                        enableHeaderRow: true
                } );

                window.G = $G;

                columns.unshift( Checkboxcolumn( $G ) );
                columns.unshift( Radiocolumn( $G ) );

                $G.setColumns( columns );

                Paging( $G, dataView, {
                
                        pagingInfo: {
                                pageSize: 500,
                                pageNum: 0,

                                sizes: [ 50, 100, 500, 1000, 5000 ]
                        },

                        fastQuery: true,

                        ajaxOptions: {
                        
                                serviceName: "fnd.user.CreateUser",
                                moduleName: "gridElement_userQuery",
                                params: {
                                        "entityId": "0",
                                        "popUpProgramName": "mrCreateCustomer"
                                }
                        }
                } );
                
                Actionbar( $G, $G.getContainerNode().previousElementSibling, {
                        
                        lab: {
                                options: {
                                        key: "neoscm.datagrid.demo"
                                },
                                enable: true,
                                selector: "button[name=lab]"
                        },

                        add: {
                                enable: true,
                                selector: "button[name=add]"
                        },

                        del: {
                                enable: true,
                                selector: "button[name=delete]"
                        },

                        save: {
                                enable: true,
                                selector: "button[name=save]"
                        },

                        filter: {
                                enable: true,
                                selector: "button[name=filter]"
                        },

                        fullscreen: {
                                enable: true,
                                selector: "button[name=fullscreen]"
                        },

                        genius: {
                                enable: true,
                                selector: "button[name=genius]"
                        }
                } );

                $G.init();

                treeGrid( container.find( "#treeGrid" ) );
        
                $( document.body ).peek( { offset: -60 } );
        };
} );
