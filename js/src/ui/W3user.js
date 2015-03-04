
define( [ "ui/YoursComplete" ], function() {

	$.fn.w3user = function( options ) {

		return this.yoursComplete( $.extend( {
		
			textKey: "ucn",
			valueKey: "uid",

			localMatch: "contains",

			ajaxOptions: {
				dataProxy: function( value ) {
				
					return $.ajax( {
						url: "/service/w3user?lang=eng&scope=all&key=" + value + "&keytype="
					} );
				},

		       		enterforce: true,

				dataFilter: function( data ) {
					
					var res = [];

					data = JSON.parse( data );

					if ( data && (data = data[ "id" ]) ) {
						res = data;
					}

					return res;
				}
			},

			formatter: function( item, index, query, settings ) {
				
				var 
				  value = item[ settings.valueKey ],
				  text = item[ settings.textKey ] || value;

				return "<li data-index=" + index + " class='user'>" +
						"<div class='avatar'><img class='fade out' onload='this.classList.remove(\"out\")' src='http://w3.huawei.com/w3lab/rest/yellowpage/face/" + value.replace( /^[^\d]{1}/, "" ) + "/120'></div>" +
						"<div class='info'><p class='dept' title='" + item[ "dept" ] + "'>" + item[ "dept" ] + "</p><p class='username' title=''>" + text.replace( query, "<span class='" + settings.class4highlight + "'>" + query + "</span>" ) + "</div>" +
					"</li>";
			}
		}, options || {} ) );
	};
} );

