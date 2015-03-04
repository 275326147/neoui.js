
define( [ "ui/Dialog", "ui/Peek", "ui/YoursComplete" ], function() {
        
        return function( container ) {
                
                container
                .find( ".ui.dialog" )
                .dialog( {
                        multiple: true,
    			ajaxOptions: {
                                serviceName: "fnd.excelImport.GetTypeID",
                                moduleName: "gridElement_commonDialog",
                                params: {
                                        "display_flag": "GRIDX_SELECT_EMPTYID"
                                }
                        },

                        increment: true,

                        autoComplete: {
                        
                                textKey: "type_name",
                                valueKey: "type_id"
                        },
				
                        title: "Type Name Choice.",

                        onOk: function( items ) {

                                if ( !items ) { return; }

                                var 
                                text = [],
                                values = [];

                                for ( var i = 0, length = items.length; i < length; ++i ) {
                                        text.push( items[ i ][ "type_name" ] );
                                        values.push( items[ i ][ "type_id" ] );
                                }

                                this.val( text.join() ).attr( "data-value", values.join() );
                        },

                        columns: [ {
                                id: "type_name",
                                field: "type_name",
                                name: "Name",
                                filter: true,
                                sortable: true,
                                width: 300
                        }, {
                                
                                id: "type_desc",
                                field: "type_desc",
                                name: "Description",
                                filter: true,
                                sortable: true,
                                width: 300
                        } ],

                        autoSearch: false
                } );

                $( document.body ).peek( { offset: -60 } );
        };
} );
