String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}
	return newStr;
};

var dbquery_module = undefined;

function dbquery_initialize( module )
{
    module.recordSet = {};
	module.load_done = true;
	module.sync = false;
	module.results = {};

	module.service =
	{
		url: application.aoz.manifest.database.url,
		security: application.aoz.manifest.database.security
	};

	module.setConfig = function( options )
	{
		if( options )
		{
			this.service.url = ( options.URL && options.URL.trim() != '' ) ? options.URL : 'localhost';
			this.service.security = options.Security;
		}
	};

	module.query = function( options )
	{
		if( options == undefined )
		{
			throw "query_parameters_missing";
		}

		if( options.id == undefined || options.id == '' )
		{
			options.id = "default_result";
		}

		if( this.aoz.manifest.database.enable )
		{
			this.recordSet = {};
			if( options.Query == undefined || options.Query.trim() == '' )
			{
				throw 'db_query_missing';
			}

			if( options.sync )
			{
				this.sync = true;
				this.load_done = false;
				this.load_error = undefined;
			}
			else
			{
				this.sync = false;
			}

			var data = 'q=' + options.Query.trim().toLowerCase();

			if( options.Values == undefined || options.Values.trim() == '' )
			{
				options.Values = '';
			}

			var v = options.Values.split( "|" );
			if( v )
			{
				var cp = v.length;
				data += "&cp=" + cp;

				if( application.aoz.manifest.database && application.aoz.manifest.database.varName )
				{
					data += "&varName=1";
					for( var i = 0; i < cp; i++ )
					{
						data += "&" + v[ i ].trim().toLowerCase() + "=" + encodeURIComponent( application.root.vars[ v[ i ].trim() ] );
					}					
				}
				else
				{
					data += "&varName=0";
					for( var i = 0; i < cp; i++ )
					{
						data += "&p" + ( i + 1 ) + "=" + encodeURIComponent( v[ i ].trim() );
					}
				}
			}

			var xhr = new XMLHttpRequest();
			var url = ( this.service.security ) ? "https://" : "http://";
			url +=  this.service.url;
			this.load_done = false;

			xhr.open( 'POST', url, true );
			xhr.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );

			var self = this;

			xhr.onreadystatechange = function()
			{
				if( this.readyState == 4 )
				{
					console.log( this.responseText );
					var json = JSON.parse( this.responseText );

					if( this.status == 200 )
					{

						if( json.type && json.type == 'error' )
						{
							if( self.sync )
							{
								//self.load_error = json.message;
								self.load_done = true;
							}
							if( options.OnError != undefined && options.OnError != ''  )
							{
								self.aoz.runProcedure( options.OnError, { EVENT$: 'onerror', ID$: options.id, QUERY$: options.query, MESSAGE$: json.message } );
							}
						}
						else
						{
							if( self.sync )
							{
								//self.load_error = '';
								self.load_done = true;
							}							

							self.generateRecordSet( options.id, json );
							if( options.OnResult != undefined && options.OnResult != ''  )
							{
								self.aoz.runProcedure( options.OnResult, { EVENT$: 'onload', ID$: options.id, QUERY$: options.query, RESPONSE$: this.responseText } );
							}

						}
					}
					else
					{
						if( self.sync )
						{
							//self.load_error = json.message;
							self.load_done = true;
						}
						if( options.OnError != undefined && options.OnError != ''  )
						{
							self.aoz.runProcedure( options.OnError, { EVENT$: 'onerror', ID$: options.id, QUERY$: options.query, MESSAGE$: json.message } );
						}
						
					}
				}
			}
			xhr.send( data );
		}
	};

	module.generateRecordSet = function( id, json )
	{
		if( json != undefined )
		{
			this.results[ id ] =
			{
				row: 0,
				numRows: ( json.rows != undefined ) ? json.rows.length : 0,
				rows: ( json.rows != undefined ) ? json.rows : [],
				numCols: ( json.cols != undefined ) ? json.cols.length : 0,
				cols: ( json.cols != undefined ) ? json.cols : []
			}
		}
		else
		{
			this.results[ id ] =
			{
				row: 0,
				numRows: 0,
				rows: [],
				numCols: 0,
				cols: []
			}
		}
	};

	module.getInfo = function( id, info )
	{
		if( id == undefined || id == "" )
		{
			id = "default_result";
		}

		if( this.results == undefined || this.results[ id ] == undefined || this.results[ id ][ info ] == undefined )
		{
			throw 'recordset_info_not_found';			
		}

		return this.results[ id ][ info ];
	}

	module.getColName = function( id, col )
	{
		if( id == undefined || id == "" )
		{
			id = "default_result";
		}
		
		if( col == -1 )
		{
			throw "numCol_argument_missing";
		}

		if( this.results == undefined || this.results[ id ] == undefined || this.results[ id ].cols == undefined || this.results[ id ].cols[ col ] == undefined )
		{
			throw 'recordset_column_not_found';			
		}

		return this.results[ id ].cols[ col ].name;		
	};

	module.getColType = function( id, col )
	{
		if( id == undefined || id == "" )
		{
			id = "default_result";
		}

		if( col == -1 )
		{
			throw "numCol_argument_missing";
		}

		if( this.results == undefined || this.results[ id ] == undefined || this.results[ id ].cols == undefined || this.results[ id ].cols[ col ] || this.results[ id ].cols[ col ].type == undefined )
		{
			throw 'recordset_column_not_found';			
		}

		return this.results[ id ].cols[ col ].type;			
	};

	module.getValue = function( id, col, type )
	{
		if( id == undefined || id == "" )
		{
			id = "default_result";
		}
		
		if( col == "" )
		{
			throw "ColName$_argument_missing";			
		}

		var c = -1;
		if( this.results == undefined || this.results[ id ] == undefined || this.results[ id ].cols == undefined || this.results[ id ].cols[ col ] )
		{
			throw 'recordset_column_not_found';
		}

		for( var i = 0; i < this.results[ id ].cols.length; i++)
		{
			if( this.results[ id ].cols[ i ].name.toLowerCase() == col.toLowerCase() )
			{
				c = i;
				break;
			}
		}

		if( this.results[ id ].cols[ c ].type != type )
		{
			throw "column_type_is_" + this.results[ id ].cols[ c ].type;
		}

		if( this.results[ id ] == undefined || this.results[ id ].rows == undefined )
		{
			throw 'recordset_rows_not_found';
		}
		var value = this.results[ id ].rows[ this.results[ id ].row ][ this.results[ id ].cols[ c ].name ];
		return value;
	};

	module.load_wait = function()
    {
        if ( this.load_error )
        {
            var error = this.load_error;
            this.load_error = null;
            throw error;
        }

        return this.load_done;
    };

    dbquery_module = module;
}
