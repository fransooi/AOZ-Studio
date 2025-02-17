const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );
const REMOTE = require('electron').remote;
const HJSON = require( 'hjson' );
const AOZIO = require( './aoz-io' );
const AOZIcons = require( './ui/aoz-icons' );
var AOZConfig = new Object();

AOZConfig.installInformation = {};
AOZConfig.aoz_settings = {};
AOZConfig.error = false;

const getAppDirectory = () => {
	switch (process.platform) {
	  case 'darwin':
		return process.execPath.substring(
		  0,
		  process.execPath.indexOf('.app') + 4
		);
	  case 'linux':
	  case 'win32':
		return PATH.join(process.execPath, '..');
	}
};

AOZConfig.initApplication = function()
{
	var dirSep = PATH.sep;
	
	atom.commonPath = '';
	atom.rootPath = PATH.join( getAppDirectory(), '..' ); 
	atom.distPath = PATH.join( getAppDirectory(), '..', 'AOZ_Studio');
	atom.commonPath = atom.distPath;
	atom.userPath = PATH.join( getAppDirectory(), '..', 'my_aoz_applications' );
	atom.userConfigPath = atom.commonPath + dirSep + '.aozstudio';

	if( !FS.existsSync( atom.userPath ) )
	{
		MKDIRP( atom.userPath );
	}
	AOZConfig.getInformation();
	AOZConfig.clearMenus();
	AOZConfig.installCSS();
	AOZConfig.installFolders();
	AOZConfig.openFiles();
	AOZConfig.master = false;
	
	if( !AOZConfig.aoz_settings.showProjects )
	{
		atom.workspace.paneContainers.left.element.style.display = 'none';
	}

	atom.workspace.paneContainers.right.element.style.display = 'none';
	AOZConfig.savePaths();

	// Si pas de connexion, on affiche le panneau LICENCE
	if( AOZConfig.aoz_settings.token == undefined )
	{
		setTimeout( function()
		{
			atom.aozStudioView.showAccountLicence();
		}, 1000 );
	}
};

AOZConfig.installFolders = function()
{
	var dirSep = PATH.sep;

	if( !FS.existsSync( atom.userPath ) || !AOZIO.isDirectory( atom.userPath ) )
	{
		MKDIRP( atom.userPath );
	}

	if( !FS.existsSync( atom.userPath + dirSep + 'AOZ Inspirations' ) || !AOZIO.isDirectory( atom.userPath + dirSep + 'AOZ Inspirations' ) )
	{
		MKDIRP( atom.userPath + dirSep + 'AOZ Inspirations' );
	}

	if( !FS.existsSync( atom.userPath + dirSep + 'MyFirstApplication' ) || !AOZIO.isDirectory( atom.userPath + dirSep + 'MyFirstApplication' ) )
	{
		AOZIO.copyDirectory( atom.userPath + dirSep + 'MyFirstApplication', AOZConfig.installInformation.aozPath + dirSep + 'templates' + dirSep + 'empty_application_pc', { recursive: true } );
	}
	AOZConfig.installDefaultFolders();

	setTimeout( function()
	{
		AOZIcons.updateProjectIcons( atom.aozConfig );
	}, 4000 );
};

AOZConfig.installDefaultFolders = function()
{
	// Pour Amiga
	atom.amigaPath = atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'transpiler' + PATH.sep + 'amiga' + PATH.sep + 'hd-emu';
		
	var dirSep = PATH.sep;
	AOZConfig.addProjectFolder( atom.userPath );
	//AOZConfig.addProjectFolder( atom.commonPath + dirSep + 'app' + dirSep + 'Manuals' );
	AOZConfig.addProjectFolder( atom.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' );
	//AOZConfig.addProjectFolder( atom.commonPath + dirSep + 'app' + dirSep + 'Accessories' );
	AOZConfig.addProjectFolder( atom.commonPath + dirSep + 'app' + dirSep + 'Drives' );

	var elms = document.getElementsByClassName( 'icon-file-directory' );
	if( elms )
	{
		setTimeout( function()
		{
			if( atom && atom.commands && elms[ 0 ] )
			{
				atom.commands.dispatch( elms[ 0 ], 'tree-view:collapse-all' );
			}
		}, 1000 );
	}
	AOZConfig.savePaths();
};

AOZConfig.savePaths = function( count )
{
	if( count == undefined )
	{
		count = 0;
	}
	
	try
	{
		var dirSep = PATH.sep;
		var paths = atom.project.rootDirectories;
		var data = "";
		if( paths )
		{
			for( var p = 0; p < paths.length; p++ )
			{
				if( p > 0 )
				{
					data = data + ";"
				}

				data += paths[ p ].realPath;
			}

			FS.writeFileSync( atom.userConfigPath + dirSep + 'paths.cfg', data, ( err ) =>
			{
				if( err )
				{
					count++;
					if( count < 5 )
					{
						setTimeout( function()
						{
							AOZConfig.savePaths( count );
						}, 2000 );
					}
				}
			} );
			return;
		}
	}
	catch( e )
	{
		count++;
		if( count < 5 )
		{
			setTimeout( function()
			{
				AOZConfig.savePaths( count );
			}, 2000 );
		}
	}

};

AOZConfig.getInformation = function()
{
	var dirSep = PATH.sep;
	var packagePath = atom.commonPath + dirSep + '.aozstudio' + dirSep + 'packages' + dirSep + 'aoz-studio' + dirSep + 'lib';

	var rootPath = PATH.normalize( getAppDirectory() + dirSep + '..' );
	
	// **********************************
	//      Chargement de aoz.hjson
	// **********************************
	var jsonPath = atom.userConfigPath + dirSep + 'aoz.hjson';
	var info;
	var json = AOZIO.loadIfExist( jsonPath, 'utf8' );
	if ( json )
	{
		try
		{
			info = HJSON.parse( json );
		}
		catch( e )
		{
		}
	}

	// Check if root path is identical.
	var pApi = 'http://app.aoz.studio:4402/api/v1/publish';
	var hAddress = '';
	var port = '';
	
	if ( info && info.rootPath != rootPath )
	{
		pApi = info.publishApi;
		hAddress = info.hAddress;
		port = info.port;
		info = undefined;
	}
	
	if ( !info )
	{
		// Installer put the default config
		info =
		{
			rootPath: rootPath,
			version: atom.appVersion,
			guideMapPath: '',
			jsonPath: jsonPath,
			packagePath: packagePath,
			aozPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz',
			commonPath: atom.commonPath,
			templatesPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'templates',
			userInformationPath: atom.userPath,
			logPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'logs',
			applicationsPath: atom.commonPath + dirSep + 'app' + dirSep + 'Applications',
			documentsPath: atom.userPath,
			drivePath: atom.commonPath + dirSep + 'app' + dirSep + 'Drives',
			accessoriesPath: atom.commonPath + dirSep + 'app' + dirSep + 'Accessories',
			transpilerMode: 1,
			transpilerPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'transpiler',
			hostAddress: hAddress,
			port: port,
			publishApi: pApi
		}
	}

	info =
	{
		rootPath: rootPath,
		version: atom.appVersion,
		guideMapPath: '',
		jsonPath: jsonPath,
		packagePath: packagePath,
		aozPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz',
		commonPath: atom.commonPath,
		templatesPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'templates',
		userInformationPath: atom.userPath,
		logPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'logs',
		applicationsPath: atom.commonPath + dirSep + 'app' + dirSep + 'Applications',
		documentsPath: atom.userPath,
		drivePath: atom.commonPath + dirSep + 'app' + dirSep + 'Drives',
		accessoriesPath: atom.commonPath + dirSep + 'app' + dirSep + 'Accessories',
		transpilerPath: atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'transpiler',
		transpilerMode: 1,
		hostAddress: hAddress,
		port: port,
		publishApi: pApi
	}

	info.guideMapPath = PATH.normalize( atom.commonPath + dirSep + '.aozstudio' + dirSep + 'packages' + dirSep + 'aoz-studio' + dirSep + 'data' );

		if ( process.platform == 'win32' )
		{
			info.hostAddress = 'localhost';
			info.port = '6502';
			info.transpilerPath = PATH.normalize( info.aozPath + '\\transpiler\\aoz.js' ); 
		}
		else if ( process.platform == 'linux' )
		{
			info.hostAddress = 'localhost';
			info.port = '6502';
			info.transpilerPath = PATH.normalize( info.aozPath + '/transpiler/aoz.js' ); 
		}
		else if ( process.platform == 'darwin' )
		{
			info.hostAddress = 'localhost';
			info.port = '8080';
			info.transpilerPath = PATH.normalize( info.aozPath + '/transpiler/aoz.js' ); 
		}

		info.commonPath = atom.commonPath;
		info.logPath = atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'logs';
		info.packagePath = info.commonPath + dirSep + '.aozstudio' + dirSep + 'packages' + dirSep + 'aoz-studio' + dirSep + 'lib';
		info.themesPath = info.commonPath + PATH.sep + '.aozstudio' + dirSep + 'themes';
		info.debuggerPath = info.commonPath + PATH.sep + 'app' + dirSep + 'aoz' + dirSep + 'tools' + dirSep + 'AOZDebugger';
		info.updateUrl = 'http://www.aoz-studio.online/update';

		// TODOBB: attention je fais un lien vers l'AOZ Store
		info.instructions = info.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' + dirSep + 'Tutorials' + dirSep + 'Instructions';

	// Add runtime-based properties
	info.runPaths =
	{
		'companion': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'tools' + dirSep + 'companion' ),
		'tutorials': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' + dirSep + 'Tutorials' ),
		'games': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' + dirSep + 'games' ),
		'demos': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' + dirSep + 'demos' ),
		'utilities and others': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + 'AOZ Store' + dirSep + 'utilities and others' ),
		'accessories': PATH.normalize( atom.commonPath + dirSep + 'app' + dirSep + '/Accessories' ),
		'documentation': PATH.normalize( atom.commonPath + dirSep + 'app'  + dirSep + '/Manuals' ),
		'documents': atom.userPath,
		'python': "C:\\Users\\User\\AppData\\Local\\Programs\\Python\\Python310\\python.exe"
	}
	
	AOZConfig.installInformation = info;
	AOZIO.saveHJSON( AOZConfig.installInformation, atom.userConfigPath + dirSep + 'aoz.hjson' );

	// load / create user information
	var json = AOZIO.loadIfExist( atom.userConfigPath + dirSep + 'user.hjson', 'utf8' );
	if ( json )
	{
		var info;
		try
		{
			info = HJSON.parse( json );
		}
		catch( e ) {}
		if ( info )
		{
			if( typeof info.hideTranspiler == 'undefined' )
			{
				info.hideTranspiler = true;
			}

			if( typeof info.currentFile == 'undefined' )
			{
				info.currentFile = "";
			}

			if( typeof info.filesOpened == 'undefined' )
			{
				info.filesOpened = "";
			}

			if( typeof info.id == 'undefined' )
			{
				info.id = "";
			}

			if( typeof info.lang == 'undefined')
			{
				info.lang = navigator.language; 
			}

			if( typeof info.autocomplete == 'undefined' )
			{
				info.autocomplete = true;
			}

			var css = document.createElement( 'style' );
			if( !info.autocomplete )
			{
				css.innerHTML = ".autocomplete-plus { display: none }";
				atom.config.settings[ 'autocomplete-plus' ] =
				{
					enableAutoActivation: false
				};
				atom.packages.activePackages["autocomplete-plus"].deactivate();				
			}
			else
			{
				css.innerHTML = ".autocomplete-plus { display: block }";
				atom.config.settings[ 'autocomplete-plus' ] =
				{
					enableAutoActivation: true
				};
				atom.packages.activePackages["autocomplete-plus"].activate();				
			}
			document.body.appendChild( css );

			if( typeof info.discord == 'undefined' )
			{
				info.discord = true;
			}

			if( typeof info.autosave == 'undefined' )
			{
				info.autosave = true;
			}

			if( typeof info.autoupdate == 'undefined' )
			{
				info.autoupdate = true;
			}

			if( typeof info.releaseNotesAtStartup == 'undefined' )
			{
				info.releaseNotesAtStartup = true;
			}
			
			if( typeof info.searchengine == 'undefined' )
			{
				info.searchengine = "ecosia";
			}
			if ( typeof info.windowPositions == 'undefined' )
			{
				info.windowPositions = {};
			}
			if( info.fontName == 'Roboto' )
			{
				info.fontName = 'IBM Plex Mono';
				info.fontSize = 16;
				info.fontEditor = "atom-workspace {   --editor-font-size: " + info.fontSize + "px; --editor-font-family: \"" + info.fontName + "\"; --editor-line-height: 1.5;",
				AOZIO.saveHJSON( info, atom.userConfigPath + dirSep + 'user.hjson' );
			}
			
			AOZConfig.installInformation.developperMode = info.developperMode;

			// Check that the path of the opened files still exist to avoid error messages at opening.
			var files = info.filesOpened.split( ';' );
			var newFiles = '';
			for ( var f = 0; f < files.length; f++ )
			{
				if ( FS.existsSync( files[ f ] ) )
					newFiles += files[ f ] + ';';
			}
			info.filesOpened = newFiles;
		}
		
		AOZConfig.aoz_settings = info;
		AOZConfig.installCSS();
	}
	else
	{
		var fontName = 'IBM Plex Mono';
		var fontSize = 16;

		// Create the user.hjson file...
		AOZConfig.aoz_settings =
		{
			lastWelcomeIssue: 0,
			welcomeMode: 'next',
			transpilerVersion: '0.0.0',
			developperMode: false,

			// Paths values
			myAppsPath: '',

			// Display values
			showSplash: true,
			showProjects: true,
			showDoc: true,
			hideTranspiler: true,
			viewerFullPage: false,
			autocomplete: true,
			fontEditor: "atom-workspace {   --editor-font-size: " + fontSize + "px; --editor-font-family: \"" + fontName + "\"; --editor-line-height: 1.5;",
			fontName: fontName,
			fontSize: fontSize,
			currentFile: "",
			filesOpened: "",
			autosave: true,
			autoupdate: true,
			releaseNotesAtStartup: false,
			searchengine: "ecosia",
			windowPositions: {}
		};
	}
	return true
};

AOZConfig.installCSS = function()
{
	var css = document.createElement( 'style' );
	css.innerHTML = '.right .close-icon { display: none }';
	css.innerHTML += 'span.icon-file-directory::before { content: \'\'; }';
	css.innerHTML += 'span.icon-file-text::before { content: \'\'; }';
	css.innerHTML += 'span.icon-file-media::before { content: \'\'; }';
	css.innerHTML += '.tree-view .list_item { color: #FFFFFF; font-weight: normal; background: transparent }';
	css.innerHTML += '.tree-view .selected::before { font-weight: bold; background-color: #3b4658 }';
	css.innerHTML += '.tree-view:focus .selected::before { font-weight: bold; background-color: #556173 }';
	css.innerHTML += 'li.file span { font-weight: normal; color: #FFFFFF; }';
	css.innerHTML += 'li.directory span { font-weight: normal; color: #FFFFFF; }';
	css.innerHTML += 'li.selected span.selected { font-weight: bold; color: #FFFFFF; }';
	css.innerHTML += 'div.list-item{ color: #FFFFFF; background: transparent; }';
	css.innerHTML += 'div.list-item::before{ color: #FFFFFF; background: transparent; }';
	css.innerHTML += 'li.list-item{ color: #FFFFFF; background: transparent; }';
	css.innerHTML += 'li.selected::before{ color: #FFFFFF; background: #556173; }';
	css.innerHTML += 'li.entry.file.list-item.selected::before{ color: #FFFFFF; background: #556173; }';
	css.innerHTML += AOZConfig.aoz_settings.fontEditor;
	document.body.appendChild( css );

	AOZConfig.loadCSS( atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'fonts' + PATH.sep + 'ide' + PATH.sep + 'ibm plex mono' + PATH.sep + 'font.definition' );
	AOZConfig.loadCSS( atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'fonts' + PATH.sep + 'ide' + PATH.sep + 'overpass mono' + PATH.sep + 'font.definition' );
	AOZConfig.loadCSS( atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'fonts' + PATH.sep + 'ide' + PATH.sep + 'roboto mono' + PATH.sep + 'font.definition' );
};

AOZConfig.loadCSS = function( path )
{
	var css = document.createElement( 'style' )
	var data = AOZIO.loadIfExist( path, 'utf8' );
	if( process.platform == 'win32' )
	{
		data = data.strReplace( '%GOOGLE_FONTS%', ( atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'fonts' + PATH.sep + 'google' ).strReplace( PATH.sep, PATH.sep + PATH.sep ) );
	}
	
	if( process.platform == 'darwin' )
	{
		data = data.strReplace( '%GOOGLE_FONTS%', atom.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'fonts' + PATH.sep + 'google' );
	}
	
	css.innerHTML = data;
	document.body.appendChild( css );
};

AOZConfig.clearMenus = function()
{		

	if( process.platform == 'win32' )
	{
		atom.menu.template = new Array
		(
			atom.menu.template[ 0 ],
			atom.menu.template[ 1 ],
			atom.menu.template[ 2 ],
			atom.menu.template[ 3 ],
			atom.menu.template[ 4 ],
			atom.menu.template[ 5 ]
		);
	}

	if( process.platform == 'darwin' )
	{
		atom.menu.template = new Array
		(
			atom.menu.template[ 0 ],
			atom.menu.template[ 1 ],
			atom.menu.template[ 2 ],
			atom.menu.template[ 3 ],
			atom.menu.template[ 4 ],
			atom.menu.template[ 5 ],
			atom.menu.template[ 6 ]
		);
	}

	delete atom.commands.selectorBasedListenersByCommandName[ "application:show-settings" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "application:show-preferences" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:open" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:change-themes" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:check-for-package-updates" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:core" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:editor" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:install-packages-and-themes" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:show-keybindings" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:system" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:uninstall-packages" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:uninstall-themes" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:view-installed-packages" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "settings-view:view-installed-themes" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "status-bar:toggle" ];
	delete atom.commands.selectorBasedListenersByCommandName[ "tool-bar:toggle" ];

	if( atom.workspace && atom.workspace.packageManager && atom.workspace.packageManager.contextMenuManager && atom.workspace.packageManager.contextMenuManager.itemSets )
	{
		for( var i = 0; i < atom.workspace.packageManager.contextMenuManager.itemSets.length; i++ )
		{
			if( atom.workspace.packageManager.contextMenuManager.itemSets[ i ].selector == ".tool-bar" )
			{
				atom.workspace.packageManager.contextMenuManager.itemSets[ i ].selector = "none";
			}
		}
	}

};

AOZConfig.updateProjectFolder = function( oldPath, newPath )
{
	if( !FS.existsSync( oldPath ) && FS.existsSync( newPath ) )
	{
		if ( atom.project.contains( oldPath ) )
			atom.project.removePath( oldPath );
		AOZConfig.addProjectFolder( newPath );
	}
};

AOZConfig.addProjectFolder = function( path, save )
{
	if( path == atom.commonPath + dirSep + 'app' + dirSep + 'Accessories' )
	{
		return;
	}

	if( path == atom.commonPath + dirSep + 'app' + dirSep + 'Drives' )
	{
		return;
	}
	
	var dirSep = PATH.sep;
	if( FS.existsSync( path ) && !atom.project.contains( path ) )
	{
		var ok = true;
		var paths = atom.project.getPaths();

		if( paths )
		{
			for( var p = 0; p < paths.length; p++ )
			{
				if(  path.substr( 0, paths[ p ].length ) == paths[ p ] )
				{
					ok = false;
				}
			}
		}

		if( ok )
		{
			atom.project.addPath( path );
		}
	}

	if( save == undefined || save == true )
	{
		AOZConfig.savePaths();
	}
	
	if( atom && atom.aozConfig )
	{
		setTimeout( function()
		{
			AOZIcons.updateProjectIcons( atom.aozConfig );
		}, 1000 );
	}	
};

AOZConfig.openFiles = function()
{
	var dirSep = PATH.sep;
	var editors = atom.workspace.getTextEditors();
	if( editors )
	{
		for( var e = 0; e < editors.length; e++ )
		{
			editors[ e ].destroy();
		}
	}


	if( AOZConfig.aoz_settings.filesOpened != '' )
	{
		var paths = AOZConfig.aoz_settings.filesOpened.split( ";" );
		for( var p = 0; p < paths.length; p++ )
		{
			if( FS.existsSync( paths[ p ] ) )
			{
				if( paths[ p ] != AOZConfig.aoz_settings.currentFile )
				{
					atom.workspace.open( paths[ p ] );
				}
			}
		}
	}
	else
	{
		setTimeout( function()
		{
			var editors = atom.workspace.getTextEditors();
			if( editors == undefined || editors.length == 0 )
			{
				atom.workspace.open( 'MyFirstApplication' + dirSep + 'main.aoz',
				{
					location: 'left'
				} ).then( function( textEditor )
				{
					textEditor.component.element.focus();
				} );
			}
		}, 3000 );
	}
	
	var editor = atom.workspace.getActiveTextEditor();
	if( editor)
	{
		editor.component.element.focus();
	}
	
	if( AOZConfig.aoz_settings.currentFile != '' )
	{
		if( FS.existsSync( AOZConfig.aoz_settings.currentFile ) )
		{
			atom.workspace.open( AOZConfig.aoz_settings.currentFile );
		}
	}

};

AOZConfig.updateFiles = function()
{
	var dirSep = PATH.sep;
	var editor = atom.workspace.getActiveTextEditor();
	AOZConfig.aoz_settings.currentFile = "";
	AOZConfig.aoz_settings.filesOpened = "";
	if( editor && editor.getPath() && PATH.extname( editor.getPath() ) != '.aozacclnk' && editor.getPath().substring( 0,4 ) != 'http' )
	{
		AOZConfig.aoz_settings.currentFile = editor.getPath();
	}

	var editors = atom.workspace.getTextEditors();
	if( editors )
	{
		for( var e = 0; e < editors.length; e++ )
		{
			ext = PATH.extname( editors[ e ].getPath() );
			if( ext != '.aozacclnk' && editors[ e ].getPath() && editors[ e ].getPath().substring( 0,4 ) != 'http' )
			{
				AOZConfig.aoz_settings.filesOpened = AOZConfig.aoz_settings.filesOpened + editors[ e ].buffer.file.path + ";";
			}
		}
	}
	AOZIO.saveHJSON( AOZConfig.aoz_settings, atom.userConfigPath + dirSep + 'user.hjson' );
}

module.exports = AOZConfig;

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
