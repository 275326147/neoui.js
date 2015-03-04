
define( function() {
        
        "use strict";

        var 
        
        defaults = {
                idKey: "id",
                parentKey: "parentid",
                roots: [ "-1" ],
                expand: false,

                columnOptions: {
                        /** See Column Options: http://10.66.228.136:7000/#datagrid */

                        formatter: function( row, cell, value, column, dataContext, $G ) {
                                
                                var 
                                html = "",
                                indent = dataContext[ "_indent_" ] || 0,
                                hasChild = ($G.getData().getItems()[ row + 1 ] || {})[ "_indent_" ] > indent;

                                html += "<span class='item' style='text-indent: " + (+dataContext[ "_indent_" ] * 15) + "px;'>";

                                if ( hasChild ) {
                                        if ( dataContext[ "_expand_" ] ) {
                                                html += "<i class='icon collapse'></i>";
                                        } else {
                                                html += "<i class='icon expand'></i>";
                                        }
                                }

                                return html += value + "</span>";
                        }
                }
        },

        Treecolumn = function( $G, settings ) {
                
                var
                /** Shortcuts */
                idKey = settings.idKey,
                parentKey = settings.parentKey,
                roots = settings.roots,
                dataView = $G.getData(),

                toggle = function( items, from, indent ) {
                        
                        for ( var i = from, length = items.length; i < length; ++i ) {
                                
                                var item = items[ i ];

                                if ( +item[ "_indent_" ] === indent ) {
                                        item[ "_expand_" ]  = !item[ "_expand_" ];
                                } else {
                                        break;
                                }
                        }
                };
                
                dataView.setFilterArgs( { treeField: settings.columnOptions.field } );

                dataView.setDataFilter( function( data ) {
                        return orderTree( data, idKey, parentKey, 0, roots, settings.expand );
                } );

                $G.onClick.subscribe( function( e, args ) {
                        
                        var 
                        self = $( e.target ),
                        dataView = args.grid.getData(),
                        item = dataView.getItem( args.row ),
                        indent = item[ "_indent_" ];

                        if ( item && self.is( ".icon.expand, .icon.collapse" ) ) {
                                
                                item[ "_expand_" ] = !item[ "_expand_" ];

                                toggle( dataView.getItems(), item[ "_length_" ] + 1, (+item[ "_indent_" ] || 0) + 1 );

                                dataView.updateItem( item[ dataView.getIdProperty() ], item );

                                e.stopImmediatePropagation();
                        }
                } );
        };

	function orderTree( data, idKey, parentKey, level, roots, expand ) {

	        var res = [];
	
                for ( var i = 0; i < data.length; ++i ) {
                        
                        var item = data[ i ];

                        if ( roots.indexOf( item[ parentKey ] ) > -1 ) {

                                item[ "_indent_" ] = level;
                                item[ "_expand_" ] = expand;
                                item[ "_length_" ] = res.length;

                                res.push( item );

                                res = res.concat( orderTree( data, idKey, parentKey, level + 1, [ item[ idKey ] ], expand ) );
                        }
                }

                return res;
	}

        return function( $G, options ) {

                var settings = $.extend( true, {}, defaults, options );

                new Treecolumn( $G, $.extend( {}, true, defaults, options ) );

                return settings.columnOptions;
        };
} );
