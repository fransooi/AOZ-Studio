var Publisher = function()
{
	this.settings =
	{
		applicationid: ''
	};

	this.getSettings = function()
	{
		if( client.atom )
		{
			var editor = client.atom.workspace.getActiveTextEditor();
			if( editor )
			{
				if( editor.projectPath )
				{
					application.vars.PRG_PATH$ = editor.projectPath;
					var parts = application.vars.PRG_PATH$.split( '\\' );
					application.vars.PRG_PATH$ = '';
					for( var r = 0; r < parts.length - 1; r++ )
					{
						if( application.vars.PRG_PATH$ != "" )
						{
							application.vars.PRG_PATH$ += "/";
						}
						application.vars.PRG_PATH$ = application.vars.PRG_PATH$ + parts[ r ];
					}
					console.log( application.vars.PRG_PATH$ );
				}
				else
				{
					application.vars.PRG_PATH$ = client.atom.systemAPI.getDirectoryFromPath( editor.getPath() );
				}

				if( client.atom.systemAPI.fileExists( application.vars.PRG_PATH$ + client.atom.sep + "settings" + client.atom.sep + "publish.hjson" ) )
				{
					var file = application.vars.PRG_PATH$ + client.atom.sep + "settings" + client.atom.sep + "publish.hjson";
					var hjson = client.atom.systemAPI.loadHJSON( file );
					if( hjson && this.parseSettings( hjson ) )
					{
						application.vars.RESULT = 1;
					}
					else
					{
						application.vars.RESULT = -1;
					}
				}
				else
				{
					application.vars.RESULT = 1;
				}
			}
		}
	};

	this.parseSettings = function( hjson )
	{
		this.settings =
		{
			applicationid: '',
		};

		// Convertion for Old settings
		if( hjson.applicationid )
		{
			this.settings.applicationid = hjson.applicationid;
			application.vars.APP_ID$ = hjson.applicationid;
			return true;
		}
		return false;
	};

	this.prepareApplicationForPublish = function()
	{

		if( client.atom )
		{
			client.atom.aozStudioView.prepareApplicationForPublish( application.vars.PRG_PATH$, function ( response, message, extra )
			{
				if( response )
				{
					application.vars.ZIP_PATH$ = message.zipPath;
					application.vars.RESULT = 1;
				}
				else
				{
					application.vars.ERR_TXT$ = application.vars.ERR_ETAPE2$;
					application.vars.RESULT = -1
				}
			} );
		}
	};

	this.publishPackagedApplication = function()
	{
		if( client.atom )
		{
			client.atom.aozStudioView.publishPackagedApplication( application.vars.ZIP_PATH$, application.vars.PRG_PATH$, function ( response, message, extra )
			{
				if( response )
				{
					application.vars.APP_ID$ = message.applicationid;
					application.vars.URL$ = message.url;
					navigator.clipboard.writeText( message.url );
					application.vars.RESULT = 1;
				}
				else
				{
					application.vars.ERR_TXT$ = application.vars.ERR_ETAPE2$;
					application.vars.RESULT = -1
				}
			} );
		}
	};

	this.openURLInBrowser = function()
	{
		if( client.atom )
		{
			client.atom.systemAPI.openURLInBrowser( application.vars.URL$ );
		}
	}
}

var publisher = new Publisher();
