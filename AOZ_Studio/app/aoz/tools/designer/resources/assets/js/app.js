function clickProcedure( procName, id )
{
	if( window.application && window.application.aoz )
	{
		window.application.aoz.runProcedure( procName, { EVENT$: 'onclick', INDEX$: id } );
	}
}
