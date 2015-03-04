
define( [ "ui/Dropdown", "ui/Peek" ], function() {

	return function( container ) {

		var data = [ { 
			value: "AD", 
			text: "Andorra" 
		}, { 
			value: "AZ", 
			text: "Azerbaijan" 
		}, { 
			value: "AW", 
			text: "Aruba" 
		}, { 
			value: "BI", 
			text: "Bulgaria" 
		}, { 
			value: "BS", 
			text: "Bahamas" 
		}, { 
			value: "CH", 
			text: "Switzerland" 
		}, { 
			value: "CK", 
			text: "Cook Island" 
		}, { 
			value: "CL", 
			text: "Chile" 
		}, { 
			value: "CN", 
			text: "China" 
		}, { 
			value: "CM", 
			text: "Cambodia" 
		}, { 
			value: "AE", 
			text: "United Arab Emirates" 
		}, { 
			value: "AF", 
			text: "Afghanistan" 
		}, { 
			value: "AG", 
			text: "Antigua and Barbuda" 
		}, { 
			value: "AO", 
			text: "Angola" 
		} ];
	
		container
		.find( ".dropdown[name=normal]" )
		.dropdown( {
			data: data,
                        autoWidth: true
		} );

		container
                .find( ".dropdown[name=hover]" )
                .dropdown( { 
                        type: "hover",
                        nothing: "Hover Me",
                        data: data,
                        autoWidth: true
                } );

                container
                .find( ".dropdown[name=multiple]" )
                .dropdown( {
                        nothing: "Multiple Select",
                        data: data,
                        multiple: true
                } );

                container
                .find( ".dropdown[name=format]" )
                .dropdown( {
                        nothing: "Custom Format",
                        data: [ { id: "g00212197", name: "Guojiping" }, { id: "hwx183014", name: "Hechangyan" }, { id: "zwx181386", name: "Zhouruiwen" }, { id: "twx199212", name: "Tianze" }, { id: "swx179140", name: "Shuqian" }, { id: "lwx230477", name: "Lijiahong" }, { id: "xwx229999", name: "Xuhongwei" }, { id: "zwx181386", name: "Zhoumeiling" } ],
                        textKey: "name",
                        valueKey: "id",
                        formatter: function( item, settings ) {

		                var 
		                value = item[ settings.valueKey ],
		                text = item[ settings.textKey ];
                        
			        return "<li style='padding: 10px 0px;' item-value=" + value + " title='" + text + "'>" +
			                        "<div style='display: inline-block; float: left;'><img class='avatar fade out' alt='" + text + "' src='http://w3.huawei.com/w3lab/rest/yellowpage/face/" +
			                        value.substr(1) +
			                        "/120' onload='this.classList.remove( \"out\" );' ></div>" + 
			                        "<div style='display: inline-block;'>" + text + "</div>" +
			                "</li>";
                        }
                } );

                $( document.body ).peek( { offset: -60 } );
	};
} );
