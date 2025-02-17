function Set_DB_Service( properties )
{
    dbquery_module.setConfig( properties );
}

function DB_Query( properties )
{
    dbquery_module.query( properties );
}

async function DB_Query_Sync( properties )
{
    properties.sync = false;
    return new Promise( resolve => 
    {
        resolve( dbquery_module.query( properties ) );
    } );
}

function DB_Count_Rows( id )
{
	return dbquery_module.getInfo( id, 'numRows' );
}

function DB_Count_Columns( id )
{
	return dbquery_module.getInfo( id, 'numCols' );
}

function DB_Column_Name( id, index )
{
	return dbquery_module.getColName( id, index );
}

function DB_Column_Type( id, index )
{
	return dbquery_module.getColType( id, index );
}

function DB_Column_StrValue( id, name )
{
	return dbquery_module.getValue( id, name, 'string' );
}

function DB_Column_IntValue( id, name )
{
	return dbquery_module.getValue( id, name, 'integer' );
}

function DB_Column_FloatValue( id, name )
{
	return dbquery_module.getValue( id, name, 'float' );
}

function DB_Next_Row( id )
{
	if( dbquery_module.results == undefined || dbquery_module.results[ id ] == undefined || dbquery_module.results[ id ].rows == undefined || dbquery_module.results[ id ].row == undefined )
	{
		throw 'recordset_rows_not_found';		
	}
	if( dbquery_module.results[ id ].row == ( dbquery_module.results[ id ].rows.length - 1 ) )
	{
		throw "out_of_range_rows";
	}
	dbquery_module.results[ id ].row++;
}

function DB_Goto_Row( id, row )
{
	if( dbquery_module.results == undefined || dbquery_module.results[ id ] == undefined || dbquery_module.results[ id ].rows == undefined || dbquery_module.results[ id ].row == undefined )
	{
		throw 'recordset_rows_not_found';		
	}

	if( row < 0 || row > ( dbquery_module.results[ id ].rows.length - 1 ) )
	{
		throw "out_of_range_rows";
	}
	dbquery_module.results[ id ].row = row;
}
