
define( function() {

	var 

	sort = function( e, args ) {

		if ( this.isGenius && this.isGenius() ) {
		
			var 

	                field = args.sortCol.field,
			dataView = this.getData();

			dataView.beginUpdate();

			dataView.sort( function( a, b ) {
				var x = a[ field ], y = b[ field ];

				return (x === y ? 0 : (x > y ? 1 : -1));
			}, args.sortAsc );

			dataView.endUpdate();
		}
		else this.getData().onPagingInfoChanged.notify( { doSearch: 1 } );
	};
	
	return function( $G, ajaxOptions, enable ) {
	
		/** All operations in server-side */
		var pager;

		if ( true === enable ) {

			var dataView, request, dom = $( $G.getContainerNode() );

			if ( !ajaxOptions.serviceName ) {
				throw "Service name cann't be null";
			}

			dataView = $G.getData();

			pager = function( pagingInfo, callback, args ) {

				var 

                                VO = { wpf_dup_token: +new Date() + Math.random() },
				
				request = dom.data( "data-request" );
				        
				params = function( args ) {
                                        return typeof args === "function" ? args() : (args || {});
				};

                                $G.setRadioRow && $G.setRadioRow();
				
				args = args || {};

				VO[ ajaxOptions.moduleName || (ajaxOptions.moduleName = "gridElement_kiss") ] 

					= JSON.stringify( $.extend( {}, {
				
						pageVO: $.extend( {}, {
							curPage: +pagingInfo.pageNum - 1,
							incrementalPaging: pagingInfo.incrementalPaging,
							pageSize: +pagingInfo.pageSize,
							totalRows: -1
						}, args.pageVO || {} )
					}, args.result || {} ) );

				/** Keep one ajax instance */
				request && request.abort();

				request = $.ajax( {

					type: "POST",

					beforeSend: function() { 
						/** Show the loading */
						$G.showLoading();
					},

					data: {
						name: ajaxOptions.serviceName,
						params: JSON.stringify( $.extend( {}, VO, params( ajaxOptions.params ), params( args.params ) ) )
					}
				} )

				.fail( function( xhr ) {

                                        $G.getViewportNode().removeClass( "empty" ).addClass( "error" );

                                        if ( xhr.status == 0 && xhr.statusText === "error" ) {
                                                sessionUtil.checkTimeout();
                                        }
				} )
					
				.done( function( data ) {

                                        var newPagingInfo = {};

                                        $G.getViewportNode().removeClass( "empty error" );

					try {
						data = eval( "(" + data + ")" );
						data = data[ "result" ][ ajaxOptions.moduleName ];
						data = JSON.parse( data );

					} catch ( ex ) {
						
						$G.hideLoading();
                                                $G.getViewportNode().addClass( "error" );
                                                return;
					}

					var items = data.result;

					ajaxOptions.dataFilter instanceof Function && (items = ajaxOptions.dataFilter( items ));

					/** Render all rows */
					$G.invalidateAllRows();
					dataView.setItems( items.concat( $G.getAddRows ? $G.getAddRows() : [] ) );

					with ( data.pageVO ) {
						newPagingInfo = { pageNum: curPage - 1, pageSize: pageSize, totalPages: totalPages, totalRows: totalRows };

						if ( pagingInfo.incrementalPaging ) {
						        newPagingInfo.moreRows = moreRows;
						}
					}

                                        callback( newPagingInfo );
					$G.resizeCanvas();
				} )
				
				.always( function() { 
					dom.removeData( "data-request" );
					$G.hideLoading();
				} );

				dom.data( "data-request", request );

				return request;
			};

			/** Register event handler */
			$G.onSort.subscribe( sort );
		} else {
			
			$G.onSort.unsubscribe( sort );
		}

		return pager;
	};
} );


/**
$.ajax( {
        data: {
                name: "iss.config.dashboard.QuerySiteCfgLineTreeList",
                params: JSON.stringify( {
                        MRDefaltAddress_cfgLine: "DC00000000049889",
                        entityId: "1330",
                        p_user_id: "1268339",
                        l_configHeaderId: "",
                        l_configLineId: "",
                        l_contract_no: "",
                        l_deliveryDimension: "ADC",
                        l_is_page: "Y",
                        l_parentSiteId: "40671059",
                        l_phySiteId: "5891283",
                        l_projectCode: "5516689",
                        l_projectId: "250305",
                        l_projectName: "Tsel non-wireless 2012"
                } )
        }
} );
*/
