var Editor = new Object();

Editor.fields = 
[
	'F_TITLE$',
	'F_PATH$',
];

Editor.values = 
[
	'V_TITLE$',
	'V_PATH$',
];

Editor.initProperties = function()
{
	application.vars.F_TITLE$ = "Project Title";
	application.vars.V_TITLE$ = "My Application";	
	application.vars.F_PATH$ = "Destination folder";
	application.vars.V_PATH$ = window.application.vars.MYAOZPATH$;	

	if( application.vars.LANG$ == 'fr' )
	{
		application.vars.F_TITLE$ = "Titre du projet";
	}
	
	if( application.vars.LANG$ == 'fr' )
	{
		application.vars.V_TITLE$ = "Mon Application";
		application.vars.F_PATH$ = "Dossier de destination";		
	}
};

Editor.showProperties = function()
{
	if( application.vars.CURPAGE == 0 )
	{
		document.getElementById( 'btnPath' ).addEventListener( 'click', function( event )
		{
			var path = client.openDirectoriesDialog( application.vars.F_PATH$, document.getElementById( 'V_PATH$' ).value );
			path = application.vars.RESPONSE$;
			if( path && path != '' && path != '-1' && path != 'error' )
			{
				document.getElementById( 'V_PATH$' ).value = decodeURI(path);
			}
		}, false );			
	}
};

Editor.valideProperties = function( nochange )
{
	for( var v = 0; v < Editor.values.length; v++ )
	{
		if( document.getElementById( Editor.values[ v ] ) )
		{
			switch( Editor.values[ v ] )
			{
				default:
					application.vars[ Editor.values[ v ] ] = document.getElementById( Editor.values[ v ] ).value;
					break;
			}			
		}
	}
	
	if( nochange == undefined || !nochange )
	{
		application.vars.REQUEST$ = "change_page";
	}	
};

Editor.createProject = function()
{
	Editor.valideProperties( true );
	if( client )
	{
		
		if( application.vars.V_TITLE$ == '' )
		{
			client.atom.systemAPI.messageBox( application.vars.TERM_CREATE$, window.application.vars.PROJECT_WITHOUT_TITLE$, "error" );
			return;			
		}
		
		var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
		var srcPath = window.application.vars.COPYSOURCE$;
		if( srcPath && srcPath == "" )
		{
			window.application.vars.REQERROR$ = "yes";
			window.application.vars.RESPONSE$ = "error";
			window.application.vars.REQUEST$ = "";		
		}
		
		if( client.atom.systemAPI.directoryExists( destPath ) )
		{
			client.atom.systemAPI.messageBox( application.vars.TERM_CREATE$, window.application.vars.PROJECT_ALREADY_EXIST$, "error" );
			return;
		}
		
		if( !client.atom.systemAPI.isDirectory( path ) )
		{
			client.atom.systemAPI.createDirectory( destPath, function( error )
			{
				if( error == "" )
				{
					if( !client.atom.systemAPI.copyDirectory( decodeURI( destPath ), srcPath, { recursive: true } ) )
					{
						window.application.vars.REQERROR$ = "yes";
						window.application.vars.RESPONSE$ = "error";
						window.application.vars.REQUEST$ = "";
					}
					else
					{
						Editor.cleanProject();
					}
				}
			} );
		}
		else
		{
			if( !client.atom.systemAPI.copyDirectory( decodeURI( destPath ), srcPath, { recursive: true } ) )
			{
				window.application.vars.REQERROR$ = "yes";
				window.application.vars.RESPONSE$ = "error";
				window.application.vars.REQUEST$ = "";
			}
			else
			{
				Editor.cleanProject();
			}
		}
	}
};

Editor.cleanProject = function()
{
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{
		if( client.atom.systemAPI.deleteDirectory( decodeURI( destPath ) + "/edit" ) )
		{
			Editor.applyProperties();
		}
	}	
};

Editor.applyProperties = function()
{
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{

		client.atom.systemAPI.rename( destPath + "/main.aoz" , destPath + "/" + application.vars.V_TITLE$ + ".aoz", {}, function( err, error, extra )
		{
			client.openProject( destPath );				
		} );
	}
};

Editor.closeEditor = function()
{
	for( var f = 0; f < Editor.fields.length; f++ )
	{	
		if( application.vars[ Editor.fields[ f ] ] )
		{
			delete application.vars[ Editor.fields[ f ] ];
		}
	}

	for( var v = 0; v < Editor.values.length; v++ )
	{
		if( application.vars[ Editor.values[ v ] ] )
		{		
			delete application.vars[ Editor.values[ v ] ];
		}
	}
		
	application.vars.CUR_CAT = -1;
	application.vars.CTX$ = '';
	application.vars.JSON_ID = -1;
	application.vars.REQUEST$ = "update_categories";	
};

application.vars.REQUEST$ = "load_pages";

