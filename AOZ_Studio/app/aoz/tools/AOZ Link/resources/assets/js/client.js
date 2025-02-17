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

		if( application.aoz.ASSET && application.aoz.ASSET.arrJSON && application.aoz.ASSET.arrJSON[ 'json_locale'] && application.aoz.ASSET.arrJSON[ 'json_locale'].terms )
		{
			var json = application.aoz.ASSET.arrJSON[ 'json_locale'].terms[ application.vars.LANG$ ];
			if( json == undefined )
			{
				json = application.aoz.ASSET.arrJSON[ 'json_locale'].terms[ 'default' ];
				if( json == undefined )
				{
					return;
				}
			}
			for( var r = 0; r < json.length; r++ )
			{
				var term = json[ r ];
				application.vars[ term.f ] = term.v;
			}
		}
		else
		{
			return;
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
			window.application.vars.TEMPPATH$ = this.atom.aozConfig.installInformation.templatesPath.strReplace( "\\", "/" );
			window.application.vars.MYAOZPATH$ = this.atom.aozConfig.installInformation.documentsPath.strReplace( "\\", "/" ) + this.atom.sep + "My AOZ Applications";
			window.application.vars.DEMOS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Demos";
			window.application.vars.GAMES_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Games";
			window.application.vars.TUTORIALS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Tutorials";
			window.application.vars.APPS_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" ) + this.atom.sep + 'app' + this.atom.sep + 'AOZ Store' + this.atom.sep + "Utilities and Others";
			window.application.vars.COMMON_PATH$ = this.atom.aozConfig.installInformation.commonPath.strReplace( "\\", "/" );
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
