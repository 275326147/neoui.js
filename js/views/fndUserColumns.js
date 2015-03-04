
define( [ "slick/editors/Text", 
	"slick/editors/Select", 
	"slick/editors/Dialog", 
	"slick/editors/Textarea"
	/** "slick/editors/Calendar" */ ], function( Text, Select, Dialog, Textarea ) {

        var w3Formatter = function( row, cell, value, column, dataContext ) {
        
                var html = "";

                if ( value ) {
                        
                        html += "<img class='avatar fade out' alt='" + value + "' src='http://w3.huawei.com/w3lab/rest/yellowpage/face/" +

                                (/\w{1,}\s(\w{1,})/g.exec( value ) || {})[ 1 ] + 
                                        
                                "/120' onload='this.classList.remove( \"out\" );' >" + value;
                }

                return html;
        };

        return function() {
        
                return [ {
                        id: "idx",
                        name: "#",
                        field: "rr",
                        width: 40,
                        resizable: false
                }, {
                        id: "w3_account",
                        name: "W3 Account",
                        field: "w3_account",
                        editor: Text,
                        filter: true,
                        width: 100,
                        frozen: true,
                        enableCopy: true,
                        sortable: true,
                        formatter: w3Formatter,
                        validator: function( value, item, column ) {
                                
                                var result = { valid: true };

                                if ( !value ) {
                                        
                                        result.valid = false;
                                }

                                return result;
                        }
                }, {
                        id: "enable_flag",
                        name: "Enable Flag",
                        field: "enable_flag",
                        filter: true,
                        width: 107,
                        editor: Select,
                        editorArgs: { items: [ { value: "N", label: "No" }, { value: "Y", label: "Yes" } ] },
                        sortable: true,
                        cssClass: "center",
                        formatter: function( row, cell, value, column, dataContext ) {
                        
                                var html = "<i class='icon error' style='color: #F44336;'></i>";

                                if ( value === "Y" ) {
                                        html = "<i class='icon success' style='color: #0F9D58;'></i>";
                                }

                                return html;
                        }
                }, {
                        id: "last_update_date",
                        name: "Last Update Date",
                        field: "last_update_date",
                        filter: true,
                        width: 123,
                        sortable: true
                }, {
                        id: "lname",
                        name: "Long Name",
                        field: "lname",
                        filter: true,
                        enableCopy: true,
                        width: 100,
                        editor: Textarea,
                        editorArgs: { max: 100 },
                        sortable: true,

                        formatter: w3Formatter
                }, {
                        id: "email",
                        name: "Email",
                        field: "email",
                        editor: Dialog,
                        filter: true,
                        width: 150,
                        sortable: true,
                        editorArgs: {
                                
                                ajaxOptions: {
                                
                                        serviceName: "queryPorject",
                                        moduleName: "gridElement_publicfind",
                                        params: {
                                                "entityId": 0,
                                                "popUpProgramName": "mrCreateCustomer"
                                        }
                                },

                                title: "Dialog",

                                onOk: function( item ) {
                                        
                                        this.val( (item || {})[ "customer" ] );
                                },

                                columns: [ {
                                        id: "customer",
                                        field: "customer",
                                        name: "Customer",
                                        filter: true,
                                        sortable: true,
                                        width: 225
                                }, {
                                        id: "customercode",
                                        field: "customercode",
                                        name: "Customer Code",
                                        filter: true,
                                        width: 225,
                                        sortable: true
                                }, {
                                        id: "customerid",
                                        field: "customerid",
                                        name: "Customer ID",
                                        filter: true,
                                        width: 223,
                                        sortable: true
                                } ]
                        }
                }, {
                        id: "employee_number",
                        name: "Employee Name",
                        field: "employee_number",
                        filter: true,
                        width: 150,
                        sortable: true
                }, {
                        id: "creation_date",
                        name: "Creation Date",
                        field: "creation_date",
                        filter: true,
                        //editor: Calendar,
                        width: 150,
                        sortable: true
                }, {
                        id: "created_by",
                        name: "Create BY",
                        field: "created_by",
                        filter: true,
                        width: 150,
                        formatter: w3Formatter,
                        sortable: true
                }, {
                        id: "old_user_id",
                        name: "Old User ID",
                        field: "old_user_id",
                        filter: true,
                        width: 150,
                        sortable: true
                }, {
                        id: "fname",
                        name: "Full Name",
                        field: "fname",
                        editor: Text,
                        filter: true,
                        width: 150,
                        sortable: true
                } ];
        };
} );
