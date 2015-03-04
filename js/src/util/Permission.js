
define( [ "self/common/util/Storage" ], function( Storage ) {

	function applyPermission( mapping, eles ) {
	
		for ( var i = eles.length; --i >=0 ; ) {
			
			var ele = eles.eq( i ), key = ele.attr( "data-permission" );
			key in mapping && (mapping[ key ] ? ele.css( "display", "" ) : ele.remove() );
		}
	}
	
	return function( modelName, context, callback ) {

	        if ( "function" === typeof context ) {
	                
	                callback = context;
	                context = document;
	        }

	        context = context || document;

		var 
		  cacheKey = "Permission/" + wpf_current_roleid + "/" + (location.hash.split( "/!" )[ 2 ] || window.pathname),
		  eles = $( context ).find( "[data-permission]" ).css( "display", "none" ),
		  mapping = Storage.get( cacheKey );

		return $.when( mapping 
			|| $.ajax( wpf_context_path + "/webengine/huawei/" + modelName ).done( function( data ) {

				var model = $( data ).find( ".wpfhidden" );

				mapping = {};

				for ( var i = eles.length; --i >= 0; ) {
					
					var key = eles.eq( i ).attr( "data-permission" );

					if ( key ) {
						mapping[ key ] = !!model.find( "input[name=" + key + "]" ).length;
					}
				}

				Storage.set( cacheKey, mapping );
			} ) )
		.done( function() {
			callback instanceof Function && callback( mapping );

			applyPermission( mapping, eles );
		} );
	};
} );

