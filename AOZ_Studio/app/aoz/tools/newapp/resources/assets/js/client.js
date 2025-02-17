//
// Check if the AOZ application has been opened in the AOZ Viewer
// and add a key listener to disable the keybindings of Atom
//
if( window.parent && window.parent.atom )
{
	window.addEventListener( 'keydown', function( event )
	{
		event.stopPropagation();
	}, true );

	window.addEventListener( 'keyup', function( event )
	{
		event.stopPropagation();
	}, true );

	window.addEventListener( 'keypress', function( event )
	{
		event.stopPropagation();
	}, true );

}

var Client = function()
{
	this.config =
	{
		template: 0,
	};

	this.IMAGES_FILTERS =
	[
		{ name: "Images", extensions: [ 'jpg', 'jpeg', 'png', 'bmp', 'gif' ] },
		{ name: "Jpeg Images", extensions: [ 'jpg', 'jpeg' ] },
		{ name: "PNG Images", extensions: [ 'png' ] },
		{ name: "BMP Images", extensions: [ 'bmp' ] },
		{ name: "GIF Images", extensions: [ 'gif' ] }
	];

	this.VIDEOS_FILTERS =
	[
		{ name: "Videos", extensions: [ 'mp4', 'mpeg4', 'ogv', 'avi', 'webm' ] },
		{ name: "Mpeg4 Videos", extensions: [ 'mp4', 'mpeg4' ] },
		{ name: "OGG Vorbis Videos", extensions: [ 'ogv' ] },
		{ name: "AVI Videos", extensions: [ 'avi' ] },
		{ name: "WEBM Videos", extensions: [ 'webm' ] }
	];

	this.AUDIO_FILTERS =
	[
		{ name: "Audios", extensions: [ 'mp3', 'wav', 'ogg' ] },
		{ name: "MP3 Audios", extensions: [ 'mp3' ] },
		{ name: "OGG Vorbis Audios", extensions: [ 'ogg' ] },
		{ name: "WAV Audios", extensions: [ 'wav' ] }
	];

	this.error = "";
	this.atom = undefined;
	this.manifest = "";
	this.aozcode = "";
	this.appTitle = "main";

	if( window.parent && window.parent.atom )
	{
		this.atom = window.parent.atom;
	}

	//
	// Get the locale language
	//
	this.getLang = function()
	{
		if( this.atom && this.atom.lang )
		{
			application.vars.LANG$ = this.atom.lang;
		}
		else
		{
			application.vars.LANG$ = navigator.language;
		}
	};

	//
	// Get the value of the "Startup" option
	//
	this.onStartup = function()
	{
		if( this.atom && this.atom.systemAPI )
		{
			var path = window.application.vars.COMMON_PATH$ + this.atom.sep + 'app' + this.atom.sep + 'startup';
			if( this.atom.systemAPI.fileExists( path ) )
			{
				window.application.vars.V_STARTUP$ = 'checked';
			}
			else
			{
				window.application.vars.V_STARTUP$ = '';
			}
		}
	};

	//
	// Set the value of the "Startup" option
	//
	this.setStartup = function(obj )
	{
		if( this.atom && this.atom.systemAPI )
		{
			if( obj )
			{
				var path = window.application.vars.COMMON_PATH$ + this.atom.sep + 'app' + this.atom.sep + 'startup';
				if( obj.checked )
				{
					window.application.vars.V_STARTUP$ = 'checked';
					this.atom.systemAPI.saveFile( path, 'ok' );
				}
				else
				{
					window.application.vars.V_STARTUP$ = '';
					if( this.atom.systemAPI.fileExists( path ) )
					{
						this.atom.systemAPI.deleteFile( path );
					}
				}
			}
		}
	};

	this.close = function()
	{
		if( this.atom )
		{
			var self = this;
			setTimeout( function()
			{
				self.atom.closeAOZViewer();
			}, 1000 );
		}
	};

	//
	// Folder selector Dialog
	//
	this.openDirectoriesDialog = function( title, path )
	{
		if( this.atom && this.atom.systemAPI )
		{
			if( path == undefined || path == '' )
			{
				path = application.vars.MYAOZPATH$;
			}
			var response = this.atom.systemAPI.openDirectoriesDialog(
			{
				title : title,
				defaultPath : path,
				properties :
				[
					 'openDirectory',
					 'createDirectory',
					 'promptToCreate'
				]
			} );
			application.vars.RESPONSE$ = encodeURI(response);
		}
		else
		{
			application.vars.RESPONSE$ = "error";
		}
		return response;
	};

	//
	// Files Dialog for Open
	//
	this.openFileDialog = function( title, path, filters )
	{
		if( this.atom && this.atom.systemAPI )
		{
			if( path == undefined || path == '' )
			{
				path = application.vars.MYAOZPATH$;
			}

			var response = this.atom.systemAPI.openFileDialog(
			{
				title: title,
				defaultPath: path,
				filters: filters
			} );
			application.vars.RESPONSE$ = response;
			return response;
		}
		else
		{
			application.vars.RESPONSE$ = "error";
			return "error";
		}
	};

	//
	// Files Dialog for Save
	//
	this.saveFileDialog = function( title, path, filters )
	{
		if( this.atom && this.atom.systemAPI )
		{
			if( path == undefined || path == '' )
			{
				path = application.vars.MYAOZPATH$;
			}

			var response = this.atom.systemAPI.saveFileDialog(
			{
				title: title,
				defaultPath: path,
				filters: filters
			} );
			application.vars.RESPONSE$ = response;
		}
		else
		{
			application.vars.RESPONSE$ = "error";
		}
	};

	//
	// Get the configured AOZ paths
	//
	this.getAOZPath = function()
	{
		if( this.atom && this.atom.aozConfig )
		{
			window.application.vars.TEMPPATH$ = this.atom.aozConfig.installInformation.aozPath.strReplace( "\\", "/" ) + '/tools/newapp';
			window.application.vars.MYAOZPATH$ = this.atom.aozConfig.installInformation.documentsPath.strReplace( "\\", "/" );
			window.application.vars.DEMOS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Demos";
			window.application.vars.GAMES_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Games";
			window.application.vars.TUTORIALS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Tutorials";
			window.application.vars.APPS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Utilities and Others";
			window.application.vars.COMMON_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" );
		}
	};
	//
	// Copy the template to the destination
	//
	this.copyProject = function( srcPath, destPath )
	{
		window.application.vars.REQERROR$ = "";
		window.application.vars.RESPONSE$ = "";
		window.application.vars.REQUEST$ = "";

		if( !this.atom.systemAPI.copyDirectory( decodeURI( destPath ), srcPath, { recursive: true } ) )
		{
			window.application.vars.REQERROR$ = "yes";
			window.application.vars.RESPONSE$ = "error";
			window.application.vars.REQUEST$ = "";
		}
	};

	//
	// Opens the new project in the editor
	//
	this.openProject = function( destPath )
	{
		window.application.vars.REQERROR$ = "";
		window.application.vars.RESPONSE$ = "";
		window.application.vars.REQUEST$ = "";
		if( !this.atom.systemAPI.openAOZProject( decodeURI( destPath ) ) )
		{
			window.application.vars.REQERROR$ = "yes";
			window.application.vars.RESPONSE$ = "error";
			window.application.vars.REQUEST$ = "";
		}
		else
		{
			window.application.vars.REQUEST$ = "close_app";
		}
	};

	//
	// Init the properties of the new project
	//
	this.initProperties = function()
	{
		if( Editor && Editor.initProperties )
		{
			Editor.initProperties();
		}
	};

	//
	// Show the current page of properties
	//
	this.showProperties = function()
	{
		if( Editor && Editor.showProperties )
		{
			Editor.showProperties();
		}
	};

	//
	// Validate the properties
	//
	this.valideProperties = function()
	{
		if( Editor && Editor.valideProperties )
		{
			Editor.valideProperties();
		}
	};

	//
	// Create the project
	//
	this.createProject = function()
	{
		if( Editor && Editor.createProject )
		{
			Editor.createProject();
		}
	};

	this.closeEditor = function()
	{
		if( Editor && Editor.closeEditor )
		{
			Editor.closeEditor();
		}
	};
}

var client = new Client();

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
}
