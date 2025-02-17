/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Transpiler
 *
 * The return of simplicity!
 *
 * @author FL (Francois Lionet)
 * @date first push on 22/12/2018
 */
var version = '14.03';
var manifestVersion = 9;
var manifestVersionExtension = 1;
var manifestVersionModule = 1;
var manifestVersionTranspiler = 1;

var HJSON = require( 'hjson' );
var PATH = require("path");
var FS = require( 'fs' );
var EXEC = require( 'child_process');
var HTTP = require( 'http' );
var SI = require( 'systeminformation' )
var READINIFILE = require( 'read-ini-file' );
var BTOA = require( 'btoa' );
var ATOB = require( 'atob' );
var MKDIRP = require( 'mkdirp' );
var CHOKIDAR = require( 'chokidar' );
var WebSocket = require( 'ws' );
var WebSocketServer = WebSocket.Server;

var messages = require( './messages' );
var utilities = require( './utilities' );
var compiler = require( './compiler' );
var banks = require( './banks' );
var filesystem = require( './filesystem' );
var importer = require( './importer' );
var INFO = require( './information' );
var us = require( './en' ) ;
var fr = require( './fr' ) ;

const { verifyApp, authenticateToken, checkSerial, authenticate } = require( './licenceChecker.js' );

var timeStartOfCompilation;
var rootOptions = 0;
var nodeOptions = false;
module.exports.rootOptions = rootOptions;

var iAjOkZ = ''
var defaultServerPort = 1976;

var defaultTags =
{
	appTitle: 			{ name: 'appTitle', value: "My AOZ Application", domain: 'manifest.display.appTitle', type: 'string', doc: 'doctag_manifest' },
	manifest: 			{ name: 'manifest', value: "aoz", domain: 'options.manifestType', type: 'string', doc: 'doctag_manifest' },
	platform: 			{ name: 'platform', value: "aoz", domain: 'manifest.compilation.platform', type: 'string', allowed: [ 'pc', 'aoz', 'amiga' ], doc: 'doctag_platform' },
	keymap: 			{ name: 'keymap', value: "aoz", domain: 'manifest.compilation.keymap', type: 'string', allowed: [ 'aoz', 'amiga' ], doc: 'doctag_keymap' },
	machine: 			{ name: 'machine', value: "modern", domain: 'manifest.compilation.machine', type: 'string', allowed: [ 'modern', 'classic' ], doc: 'doctag_machine' },
	syntax: 			{ name: 'syntax', value: "enhanced", domain: 'manifest.compilation.syntax', type: 'string', allowed: [ 'enhanced', 'strict' ], doc: 'doctag_syntax' },
	endian: 			{ name: 'endian', value: "little", domain: 'manifest.compilation.endian', type: 'string', allowed: [ 'little', 'big' ], doc: 'doctag_endian' },
	useLocalTabs:		{ name: 'useLocalTabs', value: true, domain: 'manifest.useLocalTabs', type: 'bool', doc: 'doctag_uselocaltabstodo' },
	localFonts:			{ name: 'localFonts', value: true, domain: 'manifest.fonts.local', type: 'bool', doc: 'doctag_downloadFonts' },
	googleFont:			{ name: 'googleFont', value: [], domain: 'manifest.fonts.google', type: 'string', doc: 'doctag_googleFont' },
	amigaFont:			{ name: 'amigaFont', value: [], domain: 'manifest.fonts.amiga', type: 'string', doc: 'doctag_amigaFont' },
	splashScreen:		{ name: 'splashScreen', value: false, domain: 'manifest.bootScreen.active', type: 'bool', doc: 'doctag_splashscreen' },
	splashWaitSounds:	{ name: 'splashWaitSounds', value: false, domain: 'manifest.bootScreen.waitSounds', type: 'bool', doc: 'doctag_waitsplashsounds' },
	rainbowMode:		{ name: 'rainbowMode', value: 'slow', domain: 'manifest.rainbows.mode', type: 'string', allowed: [ 'slow', 'fast' ], doc: 'doctag_rainbowmode' },
	basicRemarks: 		{ name: 'basicRemarks', value: true, domain: 'manifest.compilation.basicRemarks', type: 'bool', doc: 'doctag_basicremarks' },
	tabWidth: 			{ name: 'tabWidth', value: 4, domain: 'manifest.compilation.tabWidth', type: 'number', allowed: [ { min: 0, max: 64 } ], doc: 'doctag_tabwidth' },
	speed: 				{ name: 'speed', value: "fast", domain: 'manifest.compilation.speed', type: 'string', allowed: [ 'safe', 'fair', 'graphics',  'fast', 'free' ], doc: 'doctag_speed' },
	displayEndAlert:	{ name: 'displayEndAlert', value: true, domain: 'manifest.compilation.displayEndAlert', type: 'bool', doc: 'doctag_displayEndAlert' },
	displayErrorAlert:	{ name: 'displayErrorAlert', value: true, domain: 'manifest.compilation.displayErrorAlert', type: 'bool', doc: 'doctag_displayErrorAlert' },
	stringBaseIndex:	{ name: 'stringBaseIndex', value: 1, domain: 'manifest.compilation.stringBaseIndex', type: 'number', allowed:[ { min: 0, max: 2 } ], doc: 'doctag_stringBaseIndex' },
	noWarning: 			{ name: 'noWarning', value: [], domain: 'manifest.compilation.noWarning', type: 'string', allowed:
							[
								'font_not_found',
								'garbage_found_in_folder',
								'font_not_supported',
								'file_at_root_of_filesystem',
								'screen_not_multiple_of_font_size',
								'missing_folder',
								'missing_resources_folder',
								'creating_directory',
								'cannot_set_permissions',
								'illegal_bank_element_filename',
								'file_to_include',
								'copying_file_to_filesystem',
								'variable_not_declared',
								'duplicate_error_message',
								'instruction_not_implemented',
								'should_wait',
								'out_of_unique_identifiers',
							], doc: 'doctag_nowarning' },

	renderer: 			{ name: 'renderer', value: "canvas", domain: 'manifest.display.renderer', type: 'string', allowed: [ 'canvas', 'three' ], doc: 'doctag_renderer' },
	tvStandard: 		{ name: 'tvStandard', value: "pal", domain: 'manifest.display.tvStandard', type: 'string', allowed: [ 'pal', 'ntsc' ], doc: 'doctag_tvStandard' },
	refreshRate: 		{ name: 'refreshRate', value: 60, domain: 'manifest.display.refreshRate', type: 'number', allowed: [ { min: 1, max: 120 } ], doc: 'doctag_refreshRate' },
	displayWidth: 		{ name: 'displayWidth', value: 1280, domain: 'manifest.display.width', type: 'number', allowed: [ { min: 16, max: 4000 } ], doc: 'doctag_displayWidth'  },
	displayHeight: 		{ name: 'displayHeight', value: 720, domain: 'manifest.display.height', type: 'number', allowed: [ { min: 16, max: 4000 } ], doc: 'doctag_displayHeight'  },
	forceFullScreen: 	{ name: 'forceFullScreen', value: false, domain: 'manifest.display.fullScreen', type: 'bool', doc: 'doctag_fullScreen' },
	fullScreenIcon: 	{ name: 'fullScreenIcon', value: false, domain: 'manifest.display.fullScreenIcon', type: 'bool', doc: 'doctag_fullScreenIcon' },
	fullScreen: 		{ name: 'fullScreen', value: false, domain: 'manifest.display.fullScreen', type: 'bool', doc: 'doctag_fullScreen' },
	fullPage: 			{ name: 'fullPage', value: false, domain: 'manifest.display.fullPage', type: 'bool', doc: 'doctag_fullPage' },
	smoothing: 			{ name: 'smoothing', value: false, domain: 'manifest.display.smoothing', type: 'bool', doc: 'doctag_smoothing' },
	keepProportions:	{ name: 'keepProportions', value: true, domain: 'manifest.display.keepProportions', type: 'bool', doc: 'doctag_keepProportions' },
	fps: 				{ name: 'fps', value: false, domain: 'manifest.display.fps', type: 'bool', doc: 'doctag_fps' },
	pixelPerfect:		{ name: 'pixelPerfect', value: false, domain: 'manifest.display.pixelPerfect', type: 'bool', doc: 'doctag_manifest' },
	useHardwareCoordinates:		{ name: 'useHardwareCoordinates', value: true, domain: 'manifest.display.useHardwareCoordinates', type: 'bool', doc: 'doctag_manifest' },
	includePath:		{ name: 'includePaths', value: [], domain: 'manifest,compilation.includePaths', type: 'string', doc: 'doctag_includePaths' },

	developperMode:	 	{ name: 'developperMode', value: false, domain: 'options.developperMode', type: 'bool', doc: 'doctag_developperMode' },
	forceSplash: 		{ name: 'forceSplash', value: false, domain: 'options.forceSplash', type: 'bool', doc: 'doctag_forceSplash' },
	gotoDirectMode:	 	{ name: 'gotoDirectMode', value: false, domain: 'options.gotoDirectMode', type: 'bool', doc: 'doctag_gotoDirectMode' },
	saveLastBuild:	 	{ name: 'saveLastBuild', value: false, domain: 'options.saveLastBuild', type: 'bool', doc: 'doctag_saveLastBuild' },
	fromIDE:	 		{ name: 'fromIDE', value: false, domain: 'options.fromIDE', type: 'bool', doc: 'doctag_fromIDE' },
	rebuild:			{ name: 'rebuild', value: [], domain: 'options.rebuild', type: 'string', doc: 'doctag_forcetranspile' },
	build:				{ name: 'build', value: [], domain: 'options.build', type: 'string', doc: 'doctag_forcebuild' },
	copyDriveFiles:		{ name: 'copyDriveFiles', value: true, domain: 'options.copyDriveFiles', type: 'bool', doc: 'doctag_copydrivefiles' },
	excludeFromBuild:	{ name: 'excludeFromBuild', value: false, domain: 'options.excludeFromBuild', type: 'bool', doc: 'doctag_excludefrombuild' },
	clean: 				{ name: 'clean', value: false, domain: 'options.clean', type: 'bool', doc: 'doctag_clean' },
	sendCrashReport:	{ name: 'sendCrashReport', value: false, domain: 'options.sendCrashReport', type: 'bool', doc: 'doctag_sencCrashreport' },
	accessory: 			{ name: 'accessory', value: false, domain: 'options.accessory', type: 'bool', doc: 'doctag_accessory' },
	export:				{ name: 'export', value: {}, domain: 'options.compilation.export', type: 'string', allowed: [ 'html', 'htmldemo', 'windows', 'macos', 'linux', 'android', 'ios', 'node' ], doc: 'doctag_export' },
	saveTo:				{ name: 'saveTo', value: undefined, domain: 'options.destinationPath', type: 'path', doc: 'doctag_destinationpath' },
	logTo:				{ name: 'logTo', value: '', domain: 'options.logPath', type: 'path', doc: 'doctag_lotTo' },
	log:				{ name: 'log', value: false, domain: 'options.logOn', type: 'bool', doc: 'doctag_log' },
	needServer:			{ name: 'needServer', value: false, domain: 'options.needServer', type: 'bool', doc: 'doctag_needserver' },
	useSounds:			{ name: 'useSounds', value: false, domain: 'options.useSounds', type: 'bool', doc: 'doctag_usesounds' },
	checkForNextLoops:	{ name: 'checkForNextLoops', value: false, domain: 'options.checkForNextLoops', type: 'bool', doc: 'doctag_checkfornextLoops' },
	insertIntoHead:		{ name: 'insertIntoHead', value: [], domain: 'options.insertIntoHead', type: 'string', doc: 'doctag_insertintohead' },
	insertIntoBody:		{ name: 'insertIntoBody', value: [], domain: 'options.insertIntoBody', type: 'string', doc: 'doctag_insertintobody' },
	insertIntoStyle:	{ name: 'insertIntoStyle', value: [], domain: 'options.insertIntoStyle', type: 'string', doc: 'doctag_insertintostyle' },
	define:				{ name: 'define', value: {}, domain: 'options.preprocVariables', type: 'string', doc: 'doctag_preprocvariables' },
	includeSource:		{ name: 'includeSource', value: true, domain: 'options.includeSource', type: 'bool', doc: 'doctag_includesource' },
	caseSensitive:		{ name: 'caseSensitive', value: false, domain: 'options.caseSensitive', type: 'bool', doc: 'doctag_caseVariables' },
	useSource:			{ name: 'useSource', value: "", domain: 'options.useSource', type: 'string', doc: 'doctag_usesource' },
	autoTranslateTranspiler: 	{ name: 'autoTranslateTranspiler', value: '', domain: 'options.autoTranslateTranspiler', type: 'bool', doc: 'doctag_autoTranslateTranspiler' },
	debugging: 			{ name: 'debugging', value: false, domain: 'options.debugging', type: 'bool', doc: 'doctag_debugging' },
	noDebugging: 		{ name: 'noDebugging', value: false, domain: 'options.noDebugging', type: 'bool', doc: 'doctag_nodebugging' },
	verbose: 			{ name: 'verbose', value: 0, domain: 'options.verbose', type: 'number', allowed: [ { min: 0, max: 7 } ], doc: 'doctag_verbose' },
	indent: 			{ name: 'indent', value: false, domain: 'options.indent', type: 'bool', doc: 'doctag_indent' },
	port: 				{ name: 'port', value: defaultServerPort, domain: 'options.serverPort', type: 'number', doc: 'doctag_serverPort' },
	
	useAssetsResources:	{ name: 'useAssetsResources', value: true, domain: 'manifest.compilation.useAssetsResources', type: 'bool', doc: 'doctag_manifest' },
};
var initialTags = {};
var debugging = false;
var lastInformation = null;
var lastOptions = null;
var initOptions;
var fileLoader_run;
var fileLoader_fonts;
var fileLoader_drive;
var inPath = './in.json';
var outPath = './out.json';
var warmInitDone = false;
var watchers = {};

// Get main path
var transpilerPath = PATH.dirname( process.execPath ); // Pour exe
if ( transpilerPath.indexOf( 'AOZ_Studio' ) < 0 )
	transpilerPath = utilities.cleanPath( __dirname ); // Pour nodejs

// Get command line arguments
messages.init( transpilerPath );
messages.setOptions( {} );
messages.print( messages.VERBOSE_MESSAGES, 'title', version );

initialTags = utilities.copyObject( defaultTags );
var arguments = getArguments();
if ( arguments.error )
{
	messages.pushError( { compilerError: 'command_not_supported', parameter: command } );
	theEnd( {}, false, );
}

if ( arguments.options.mode == 'command' )
{
	handleCommandMode();
}
else if ( arguments.options.mode == 'convert' )
{
	rootOptions = getRootOptions();

	options = utilities.copyObject( rootOptions );		
	timeStartOfCompilation = new Date().getTime();
	loadSystemInformation( options );
	messages.setOptions( options );

	// Do the conversion...
	options.sourcePath = arguments.sourcePath;
	options.destinationPath = initialTags.saveTo.value;
	if ( !options.destinationPath )
		options.destinationPath = utilities.getDirectoryFromPath( options.sourcePath ) + '/' + utilities.getFilename( options.sourcePath );
	else if ( utilities.getDirectoryFromPath( options.sourcePath ) == options.destinationPath )
		options.destinationPath += '/aoz';
	else
		options.destinationPath += '/' + utilities.getFilename( options.sourcePath );

	importer.convertAMOS( options.destinationPath, options.sourcePath, options, function( response, data, extra )
	{
		theEnd( options, response );
	} );
}
else if ( arguments.options.mode == 'watch' )
{
	var path = utilities.cleanPath( arguments.sourcePath );
	if ( !FS.existsSync( path ) )
	{
		messages.pushError( { compilerError: 'directory_not_found', parameter: path } );
		theEnd( {}, false, );	
	}
	if ( !FS.statSync( path ).isDirectory() )
	{
		messages.pushError( { compilerError: 'directory_not_found', parameter: path } );
	theEnd( {}, false, );
	}
	watchers[ path ] = new Watcher( path, arguments );
	console.log( 'Watching!' )
}
else if ( arguments.options.mode == 'server' )
{
	rootOptions = getRootOptions();
	rootOptions.fromIDE = initialTags.fromIDE.value;
	rootOptions.saveLastBuild = initialTags.saveLastBuild.value;
	server = new AozServer( rootOptions, arguments );

}
else if ( arguments.options.mode == 'transpilecommand' )
{
	// Set options
	rootOptions = getRootOptions();
	rootOptions.fromIDE = initialTags.fromIDE.value;
	rootOptions.saveLastBuild = initialTags.saveLastBuild.value;

	try
	{
		var command =  arguments.sourcePath;
		if ( command.substring( 0, 6 ) == '[atob]' )
			command = ATOB( command.substring( 6 ) );
		//command = '__cdebug 2 : Cube "lucie"';
		var options = utilities.loadJSON( rootOptions.dataPath + '/lastbuild_options.json', { noError: true } );
		if ( options )
		{
			var information = new INFO.Information( options );
			for ( var p in options.information )
				information[ p ] = options.information[ p ];
			options.information = information;
	
			var modules = utilities.loadJSON( options.dataPath + '/modules.json', { noError: true } );
			var extensions = utilities.loadJSON( options.dataPath + '/extensions.json', { noError: true } );
			for ( var m in options.modules )
			{
				modules[ m ].inUse = options.modules[ m ];
				//if ( modules[ m ].inUse )
				//	console.log( 'Module in use: ' + modules[ m ].shortName );
			}
			for ( var e in options.extensions )
			{
				extensions[ e ].inUse = options.extensions[ e ];
				//if ( extensions[ e ].inUse )
				//	console.log( 'Module in use: ' + extensions[ e ].shortName );
			}
			options.modules = modules;
			options.extensions = extensions;
			
			options.baseOptions = options;
			fileLoader_run = new utilities.FileLoader( rootOptions.runtimePath, '', { version: version, recursive: true, loadFiles: false } );
			fileLoader_fonts = new utilities.FileLoader( rootOptions.fontPath, '', { version: version, recursive: true, loadFiles: false } );
			//fileLoader_drive = new utilities.FileLoader( rootOptions.drivePath, '', { version: version, recursive: true, loadFiles: false, excludes: [ '*[/html/]*' ] } );
			fileLoader_modules = new utilities.FileLoader( rootOptions.modulesDestinationPath, '', { version: version, recursive: true, loadFiles: false } );
			fileLoader_extensions = new utilities.FileLoader( rootOptions.extensionsDestinationPath, '', { version: version, recursive: true, loadFiles: false } );
			options.fileLoader_drive = fileLoader_drive;
			options.fileLoader_extensions = fileLoader_extensions;
			options.fileLoader_modules = fileLoader_modules;
			options.fileLoader_run = fileLoader_run;

			transpileCommand( command, { lastOptions: options, lastInformation: options.information }, function( response, code, extra )
			{
				if ( response )
				{
					console.log( 'CODE[[[' + code + ']]]' );
					if ( options.saveLastBuild )
						saveLastBuild( options );
				}
				theEnd( options, response );
			}, {} );
		}
	}
	catch( error )
	{
		console.error( error );
	}
}
else if ( arguments.sourcePath.length > 0 )
{
	// Set options
	//messages.print( messages.VERBOSE_MESSAGES, 'warminit', version );
	rootOptions = getRootOptions();
	rootOptions.fromIDE = initialTags.fromIDE.value;
	rootOptions.saveLastBuild = initialTags.saveLastBuild.value;

	var iAjOkZ = '';
	var symbol = 'abcdefghijklmnopqrstuvwxyz0123456789';
	for( var i = 0; i < 20; i++ )
	{
		var a = Math.floor( Math.random() * symbol.length );
		var c = symbol.substring( a - 1, a );
		iAjOkZ += c;
	}		
	rootOptions.iAjOkZ = iAjOkZ;

	// Time stamp
	timeStartOfCompilation = new Date().getTime();	
	loadSystemInformation( rootOptions );

	var OK = true;
	if ( loadTranspilerManifest( rootOptions ) )
	{
		messages.setOptions( rootOptions );
	
		// Pre-Load all runtime sources
		fileLoader_run = new utilities.FileLoader( rootOptions.runtimePath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_fonts = new utilities.FileLoader( rootOptions.fontPath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_drive = new utilities.FileLoader( rootOptions.drivePath, '', { version: version, recursive: true, loadFiles: false, excludes: [ '*[/html/]*' ] } );
		OK &= !fileLoader_run.getErrors();

		// Compile the language modules and the extensions
		rootOptions.gotoDirectMode = false;
		rootOptions.developperMode = false;
		OK = true;
		OK &= compileModules( rootOptions );
		OK &= compileExtensions( rootOptions );
		if ( !OK )
			messages.printErrors();

		// Load the compile modules and extensions
		fileLoader_modules = new utilities.FileLoader( rootOptions.modulesDestinationPath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_extensions = new utilities.FileLoader( rootOptions.extensionsDestinationPath, '', { version: version, recursive: true, loadFiles: false } );
	}

	if ( OK )
	{
		// Apply the commands
		options = utilities.copyObject( rootOptions );		
		options.doCompile = true;
		options.sourcePath = utilities.cleanPath( arguments.sourcePath );
		options.destinationPath = undefined;
		options.specialFolders = undefined;
		options.gotoDirectMode = initialTags.gotoDirectMode.value;

		validateAOZ( options );
	}
}

function validateAOZ( options )
{
	options.licenceType = 'AOZF';
	
	verifyApp( options.transpilerPath, function( response )
	{
		if( response.stasus === 'ok' )
		{
			if( response.version !== version )
			{
				console.error( 'The Transpiler\'s version is not valid!' );
				process.exit( 1 );
			}
		}
	}, function( error )
	{
		console.error( 'The Transpiler could not be verified!' );
		process.exit( 1 );	
	} );

	if( options.token && options.token.trim() != '')
	{
		console.log( 'Checking your account...' );
		authenticateToken( options.transpilerPath, options.token, function( response )
		{
			if( response.status == 'ok' )
			{
				console.log( 'Account found.' );
				if( options.serial && options.serial != '' )
				{
					console.log( 'Get the licence...' );
					checkSerial( options.transpilerPath, options.token, options.serial, response.sid, function( res )
					{
						var licenceTypes = {
							'AOZE':  'Education',
							'AOZF':  'Free',
							'AOZ1':  'Starter',
							'AOZ12': 'Gold',
							'AOZ24': 'Silver',
							'AOZI':  'VIP Edition'
						}
						if( res.status == 'ok' )
						{
							console.log( 'Licence "' + licenceTypes[ res.type ] + '" found.' ); 
							options.licenceType = res.type;
						}
						else
						{
							console.log( 'Invalid licence. Licence "FREE" used.' ); 
							options.licenceType = 'AOZF';
						}
						aoz( options );
					}, function( err )
					{
						console.log( 'Licence error! Licence "FREE" used.' ); 
						options.licenceType = 'AOZF';						
						aoz( options );
					} )
				}
				else
				{
					console.log( 'No licence. Licence "FREE" used.' ); 
					options.licenceType = 'AOZF';						
					aoz( options );
				}
			}
			else
			{
				console.log( 'Account not found. Licence "FREE" used.' );
				options.licenceType = 'AOZF';
				aoz( options );
			}
		}, function( error )
		{
			console.log( 'Account error! Licence "FREE" used.' );			
			options.licenceType = 'AOZF';
			aoz( options );
		} );
	}
	else
	{
		console.log( 'No account. Licence "FREE" used.' );			
		options.licenceType = 'AOZF';
		aoz( options );
	}
}

function Watcher( path, callback, extra )
{
	this.timeout = 2000;

	// First -> Init!
	if ( !warmInitDone )
	{
		console.log( 'warminit!' );
		warmInitDone = warmInit( { tags: { developperMode: initialTags.developperMode.value } } );
		if ( !warmInitDone )
		{
			messages.pushError( { compilerError: 'command_not_supported', parameter: command } );
			return;
		}
	}
	this.path = path;

	// Put a watcher on the directory
	this.watcher = CHOKIDAR.watch( this.path, 
	{
		ignored: function( path, stats )
		{
			path = utilities.cleanPath( path );
			if ( path.toLowerCase().indexOf( '/html' ) >= 0 )
				returnIndex = false;
			else				
				returnindex = true;
		},
		persistent: true
	} );

	this.transpilerBusy = false;
	var self = this;
	function changed()
	{
		if ( !self.transpilerBusy )
		{
			if ( self.handle )
			{
				clearTimeout( self.handle );
				self.handle = null;
			}
			self.handle = setTimeout( function()
			{
				self.doTranspile( function( response, parameter, extra )
				{
					self.transpilerBusy = false;
				} );
			}, self.timeout );
		}
	}
	this.watcher.on( 'add', changed );
	this.watcher.on( 'change', changed )
	this.watcher.on( 'unlink', changed );

	this.doTranspile = function( callback, extra )
	{	
		// Apply the commands
		var options = utilities.copyObject( rootOptions );		
		options.doCompile = true;
		options.sourcePath = this.path;
		options.destinationPath = undefined;
		options.specialFolders = undefined;
		this.logErrors = [];
		this.logWarnings = [];
	
		var self = this;
		options.callback = function( response, message, extra )
		{
			// Handle transpiler messages
			if ( response == 'running' )
			{
				if ( message.type == 'error' || message.type == 'compiler_error' )
				{
					message.type = 'error';
					self.logErrors.push( message );
				}
				else if ( message.type == 'warning' )
				{
					self.logWarnings.push( message );
				}
			}					
			else if ( response == 'success' )
			{
				self.transpilerBusy = false;
				self.lastTranspilationOK = true;
				self.indentation = message.indentation;
				if ( callback )
				{
					callback( true, { indentation: message.indentation }, extra );
				}
			}
			else if ( response == 'failure' )
			{
				self.transpilerBusy = false;
				self.lastTranspilationOK = false;
				self.indentation = undefined;
				if ( callback )
				{
					callback( false, 
					{
						indentation: self.indentation,
						logWarnings: self.logWarnings,
						logErrors: self.logErrors
					}, extra );
				}
			}
		}
		this.transpilerBusy = true;
		validateAOZ( options );
	}	
}

function AozServer( options, arguments )
{
	this.port = initialTags.port.value;

	// Open server
	this.server = new WebSocketServer( { port: this.port } );
	var self = this;
	this.server.on( 'open', function( e )
	{
		console.log( "Aoz Server Listening on port " + self.port + '.' );
		self.connected = true;
		self.timeLastPing = new Date().getTime();
	} );

	this.server.on( 'message', function( event )
	{
		console.log( `[message] Data received from server: ${ event.data }` );
		this.handleMessage( event.data );
	} );

	this.server.on( 'close', function( event )
	{
		if( event.wasClean )
		{
			console.info(`[close] Connection closed cleanly, code=${ event.code } reason=${ event.reason }`);
			Process.exit();
		}
		else
		{
			console.warn( '[close] Connection died' );
			self.connected = false;
		}
	} );

	this.server.on( 'error', function( error )
	{
		console.error( `[error] ${ error.message }` );
		self.callback = null;
		self.connected = false;
	} );

	this.sendMessage = function( message )
	{
		if ( this.isConnected )
		{
			message = JSON.stringify( message );
			this.server.send( message );
		}
	};

	this.handleMessage = function( message )
	{
		try
		{
			message = JSON.parse( message );
		}
		catch( e )
		{
			message = null;
		}
		if ( message )
		{
			switch ( message.command )
			{
				case 'ping':
					var message = 
					{ 
						responseTo: 'ping',
						response: true, 
						data: {}
					}
					self.sendMessage( message );
					this.lastPingTime = new Date().getTime();
					break;
				case 'init':
					console.log( 'init!' );
					transpilerPath = message.parameter.transpilerPath;
					drivePath = message.parameter.transpilerPath;
					applicationsPath = message.parameter.applicationsPath
					initOptions = message.parameter;
					var message = 
					{ 
						responseTo: 'init',
						response: true, 
						data: { version: version, port: this.transpilerPort }					
					}
					self.sendMessage( message );
					break;

				case 'warmInit':
					console.log( 'Warm-init.' );
					var info = warmInit( message.parameter );
					self.sendMessage( 
					{ 
						responseTo: 'warminit', 
						response: info.OK, 
						data: 
						{ 
							logErrors: info.errors, 
							logWarnings: [] 
						}, extra: null 
					} );
					warmInitDone = true;
					break;

				case 'transpile':
					console.log( 'Transpilation!' );
					if ( warmInitDone )
					{
						var logWarnings = [];
						var logErrors = [];
						transpile( message.parameter, function( response, message, extra )
						{
							// Handle transpiler messages
							if ( response == 'running' )
							{
								if ( message.type == 'error' || message.type == 'compiler_error' )
								{
									message.type = 'error';
									logErrors.push( message );
								}
								else if ( message.type == 'warning' )
								{
									logWarnings.push( message );
								}
							}					
							else if ( response == 'success' || response == 'failure' )
							{
								var message = 
								{
									responseTo: 'transpile', 
									response: response, 
									data: 
									{ 
										indentation: response == 'success' ? message.indentation : [],
										logWarnings: logWarnings, 
										logErrors: logErrors 
									}, 
									extra: extra 
								};
								self.sendMessage( message );
							}
						}, message.extra );
					}
					break;

				case 'transpileCommand':
					console.log( 'Transpile Command.' );
					if ( warmInitDone )
					{
						transpileCommand( message.parameter.value, message.parameter.options, function( response, code, extra )
						{
							var message = 
							{
								responseTo: 'transpileCommand', 
								response: response, 
								data: code,
								extra: extra 
							};
							self.sendMessage( message );
						}, message.extra );
					}
					break;
		
				case 'convert':
					console.log( 'convert!' );
					convert( message.parameter, function( response, message, extra )
					{
						if ( response == 'success' || response == 'failure' )
						{
							sendMessage
							( 
								{ 
									responseTo: 'convert', 
									response: response, 
									parameter: message, 
									extra: extra 
								} 
							);
						}
					}, message.extra );
					break;		
			}
		};
	}
	this.handleCheckPing = setInterval( function()
	{
		var now = new Date().getTime();
		if ( now >= self.timeLastPing + 10 * 1000 )
		{
			// Suicide!
			exit_app();
		}
	}, 1000 );
}

function getArguments()
{
	var error = false;
	var quit = false;
	var count = 0;
	var options = {};
	var sourcePath = '';
	var sourcePathOriginal = '';
	var destinationPath = '';
	for ( var a = 2; ( a < process.argv.length ) && !quit && !error; a++ )
	{
		var done = false;
		var command = process.argv[ a ].toLowerCase();

		if( command.substring( 0, 7 ) == '--path=' )
		{
			options.transpilerPath = command.substring( 7, command.length );
			command = "--none";
		}

		if( command.substring( 0, 8 ) == '--token=' )
		{
			options.token = command.substring( 8, command.length );
			command = "--none";
		}

		if( command.substring( 0, 9 ) == '--serial=' )
		{
			options.serial = command.substring( 9, command.length );
			command = "--none";
		}

		if( command != '--none' )
		{
		if ( command.charAt( 0 ) == '-' && command.charAt( 1 ) != '-' )
		{
			command = command.substring( 1 );
			for ( var t in initialTags )
			{
				var tag = initialTags[ t ];
				if ( t.toLowerCase() == command )
				{
					switch ( tag.type )
					{
						case 'string':
							var value = utilities.getString( process.argv[ ++a ].toLowerCase() );
							var OK = true;
							if ( tag.allowed )
							{
								OK = false;
								for ( var aa = 0; aa < tag.allowed.length; aa++ )
								{
									if ( tag.allowed[ aa ] == value )
									{
										OK = true;
										break;
									}
								}
							}
							if ( OK )
							{
								if ( utilities.isArray( tag.value ) )
								{
									if ( !tag.value.find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
									{
										tag.value.push( value );
										tag.updated = true;
									}
								}
								else
								{
									tag.value = value;
									tag.updated = true;
								}
							}
							else
							{
								error = true;
							}
							break;

						case 'bool':
							var value = true;
							if ( a + 1 < process.argv.length )
							{
								param = process.argv[ a + 1 ].toLowerCase();
								if ( param.charAt( 0 ) != '-' )
								{
									switch ( param )
									{
										case '1':
										case 'true':
											value = true;
											a++;
											break;
										case '0':
										case 'false':
											a++;
											value = false;
											break;
										default:
											break;
									}
								}
								tag.value = value;
								tag.updated = true;
							}
							break;

						case 'number':
							var value = parseInt( process.argv[ ++a ].toLowerCase() );
							if ( isNaN( value ) )
								error = true;
							else
							{
								var OK = true;
								if ( tag.allowed )
								{
									OK = false;
									for ( var aa = 0; aa < tag.allowed.length; aa++ )
									{
										if ( value >= tag.allowed[ aa ].min && value < tag.allowed[ aa ].max )
										{
											OK = true;
											break;
										}
									}
								}
								if ( OK )
								{
									if ( utilities.isArray( tag.value ) )
									{
										if ( tag.value.indexOf( value ) < 0 )
										{
											tag.value.push( value );
											tag.updated = true;
										}
									}
									else
									{
										tag.value = value;
										tag.updated = true;
									}
								}
								else
								{
									error = true;
								}
							}
							break;

						case 'path':
							value = utilities.cleanPath( utilities.getString( process.argv[ ++a ] ) );
							if ( utilities.isArray( tag.value ) )
							{
								if ( !tag.value.find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
								{
									tag.value.push( value );
									tag.updated = true;
								}
							}
							else
							{
								tag.value = value;
								tag.updated = true;
							}
							break;

					}
					done = true;
					break;
				}
				if ( done || error )
					break;
			}
		}
		if ( !done && !error )
		{
			switch ( command = process.argv[ a ].toLowerCase() )
			{
				case '-h':
				case '-help':
				case '--help':
					messages.print( messages.VERBOSE_MESSAGES, 'help', version );
					exit_app();
					break;

				case '--convert':
					error = ( count++ != 0 );
					options.mode = 'convert';
					count++;
					break;

				case '--watch':
					error = ( count++ != 0 );
					options.mode = 'watch';
					count++;
					break;
				
				case '--command':
					error = ( count++ != 0 );
					options.mode = 'command';
					count++;
					break;
				
				case '--transpile':
					error = ( count++ != 0 );
					options.mode = 'transpile';
					count++;
					break;

				case '--server':
					error = ( count++ != 0 );
					options.mode = 'server';
					count++;
					break;
	
					case '--none':
						error = ( count++ != 0 );
						count++;
						break;

					case '--transpilecommand':
					error = ( count++ != 0 );
					options.mode = 'transpilecommand';
					count++;
					break;
	
					case '':
				case ' ':
					break;

				default:
					if ( command.charAt( 0 ) == '-' )
					{
						messages.pushError( { compilerError: 'command_not_supported', parameter: command } );
						error = true;
					}
					else
					{
						sourcePathOriginal = process.argv[ a ];
						sourcePath = utilities.cleanPath( sourcePathOriginal );
						quit = true;
					}
					break;
			}
		}
	}
	}
	return { options: options, sourcePath: sourcePath, sourcePathOriginal: sourcePathOriginal, error: error };
};

function warmInit( warmOptions )
{
	// Set options
	messages.print( messages.VERBOSE_MESSAGES, 'warminit', version );
	rootOptions = getRootOptions();

	var iAjOkZ = '';
	var symbol = 'abcdefghijklmnopqrstuvwxyz0123456789';
	for( var i = 0; i < 20; i++ )
	{
		var a = Math.floor( Math.random() * symbol.length );
		var c = symbol.substring( a - 1, a );
		iAjOkZ += c;
	}		
	rootOptions.iAjOkZ = iAjOkZ;

	var OK = true;
	timeStartOfCompilation = new Date().getTime();	
	loadSystemInformation( rootOptions );
	if ( loadTranspilerManifest( rootOptions ) )
	{
		messages.setOptions( rootOptions );

		// Pre-Load all runtime sources
		fileLoader_run = new utilities.FileLoader( rootOptions.runtimePath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_fonts = new utilities.FileLoader( rootOptions.fontPath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_drive = new utilities.FileLoader( rootOptions.drivePath, '', { version: version, recursive: true, loadFiles: false, excludes: [ '*[/html/]*' ] } );
		OK &= !fileLoader_run.getErrors();
		if ( !OK )
			return { OK: OK, errors: [ 'File error, please re-install Aoz Studio\n' ] };

		// Compile the language modules and the extensions
		rootOptions.gotoDirectMode = false;
		rootOptions.developperMode = ( typeof warmOptions.tags.developerMode != 'undefined' ? warmOptions.tags.developerMode : rootOptions.developerMode );
		OK = true;
		OK &= compileModules( rootOptions );
		OK &= compileExtensions( rootOptions );
		if ( !OK )
			errors = messages.printErrors();

		// Load the compile modules and extensions
		fileLoader_modules = new utilities.FileLoader( rootOptions.modulesDestinationPath, '', { version: version, recursive: true, loadFiles: false } );
		fileLoader_extensions = new utilities.FileLoader( rootOptions.extensionsDestinationPath, '', { version: version, recursive: true, loadFiles: false } );

		if ( !OK )
			messages.print( messages.VERBOSE_MESSAGES, 'warminit_error', version );
		else 
			messages.print( messages.VERBOSE_MESSAGES, 'warminit_ok', version );

		return { OK: OK, errors: messages.getErrors() };
	}
	return { OK: false, errors: messages.getErrors() };
};

// Transpilation in command mode
function transpile( transpileOptions, callback, extra )
{
	initialTags = utilities.copyObject( defaultTags );
	var options = getTranspileOptions( transpileOptions, callback, extra );
	if ( options )
	{
		validateAOZ( options );
		return null;
	}
	return 'Cannot compile';
};
function convert( transpileOptions, callback, extra )
{
	initialTags = utilities.copyObject( defaultTags );
	var options = getTranspileOptions( transpileOptions, callback, extra );
	if ( options )
	{
		// Set options
		timeStartOfCompilation = new Date().getTime();
		loadSystemInformation( options );
		messages.setOptions( options );

		// Do the conversion...
		if ( !options.destinationPath )
			options.destinationPath = options.applicationsPath + '/' + utilities.getFilename( options.sourcePath );
		if ( utilities.getDirectoryFromPath( options.sourcePath ) == options.destinationPath )
			options.destinationPath += '/aoz';

		importer.convertAMOS( options.destinationPath, options.sourcePath, options, function( response, data, extra )
		{
			theEnd( options, response );
		} );
	}
	return false;
};

function transpileCommand( command$, options, callback, extra )
{
	try
	{
		while( true )
		{
			// Load source and scans for basic tags
			var information = typeof options.lastInformation != 'undefined' ? options.lastInformation : lastInformation;			
			var options = typeof options.lastOptions != 'undefined' ? options.lastOptions : lastOptions;
			if ( options && information )
			{
				if ( !information.loadCommand( command$, options ) )
					break;
				if ( !information.scanForTags( initialTags, options, { caseSensitive: false, replaceWith: ' ' } ) )
				{
					break;
				}
				utilities.applyTags( options.manifest, 'manifest', initialTags );
				utilities.applyTags( options, 'options', initialTags );
				//options.baseManifest = utilities.copyObject( options.manifest );

				messages.setOptions( options );

				// Create the FileSaver/Loader objects
				options.fileSaver = new utilities.FileSaver( options.destinationPath, '', { version: version, dataPath: options.dataPath } );
				options.fileLoader = new utilities.FileLoader( options.sourcePath, '', { version: version, recursive: true } );
				options.baseOptions = options;
				options.contextName = 'application';
				options.isExtension = false;

				// Restore modules parent
				for ( var m in options.modules )
					restoreModule( options.modules[ m ] );

				messages.init();
				var info = compiler.compileCommand( information, options );

				options.fileSaver.close();
				options.fileLoader.close();

				// Return code to insert in the application
				callback( true, info.code, extra );
				return;
			}
		}
	}
	catch( e )
	{
	}
	callback( false, '', extra );
};
	
function getTranspileOptions( transpileOptions, callback, extra )
{
	var options;
	while( true )
	{
		// Default options
		options = utilities.copyObject( rootOptions );
		options.callback = callback;
		options.callbackExtra = extra;

		// Apply the commands
		options.doCompile = true;
		options.originalSourcePath = transpileOptions.buildPath;
		options.sourcePath = utilities.cleanPath( transpileOptions.sourcePath );
		options.destinationPath = utilities.cleanPath( transpileOptions.destinationPath );
		options.specialFolders = typeof transpileOptions.specialFolders != 'undefined' ? utilities.cleanPath( transpileOptions.specialFolders ) : {};

		// Poke the compilation tags
		for ( var nodeTagName in transpileOptions.tags )
		{
			var done = false;
			for ( var t in initialTags )
			{
				var tag = initialTags[ t ];
				if ( t == nodeTagName )
				{
					switch ( tag.type )
					{
						case 'string':
							var value = transpileOptions.tags[ nodeTagName ];
							var OK = true;
							if ( tag.allowed )
							{
								OK = false;
								for ( var aa = 0; aa < tag.allowed.length; aa++ )
								{
									if ( tag.allowed[ aa ] == value )
									{
										OK = true;
										break;
									}
								}
							}
							if ( OK )
							{
								if ( utilities.isArray( tag.value ) )
								{
									for ( var v = 0; v < value.length; v++ )
									{
										if ( !tag.value.find( function( element ) { return element.toLowerCase() == value[ v ].toLowerCase(); } ) )
										{
											tag.value.push( value[ v ] );
											tag.updated = true;
										}	
									}
								}
								else
								{
									tag.value = value;
									tag.updated = true;
								}
							}
							break;

						case 'bool':
							tag.value = transpileOptions.tags[ nodeTagName ];
							tag.updated = true;
							break;

						case 'number':
							var value = transpileOptions.tags[ nodeTagName ];
							var OK = true;
							if ( tag.allowed )
							{
								OK = false;
								for ( var aa = 0; aa < tag.allowed.length; aa++ )
								{
									if ( value >= tag.allowed[ aa ].min && value < tag.allowed[ aa ].max )
									{
										OK = true;
										break;
									}
								}
							}
							if ( OK )
							{
								if ( utilities.isArray( tag.value ) )
								{
									if ( tag.value.indexOf( value ) < 0 )
									{
										tag.value.push( value );
										tag.updated = true;
									}
								}
								else
								{
									tag.value = value;
									tag.updated = true;
								}
							}
							break;

						case 'path':
							value = utilities.cleanPath( transpileOptions.tags[ nodeTagName ] );
							if ( utilities.isArray( tag.value ) )
							{
								if ( !tag.value.find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
								{
									tag.value.push( value );
									tag.updated = true;
								}
							}
							else
							{
								tag.value = value;
								tag.updated = true;
							}
							break;

					}
					done = true;
					break;
				}
				if ( done )
					break;
			}
		}
		utilities.applyTags( options, 'options', initialTags );
		utilities.applyTags( options.manifestTranspiler, 'manifestTranspiler', initialTags );
		return options;
	};
};

function getRootOptions( callback, extra )
{
	var newOptions =
	{
		aozPath: '',
		currentPath: '',
		sourcePath: '',
		destinationPath: '',
		fullScreen: false,
		fullPage: false,
		version: version,
		externalFiles: true,
		includeSource: true,
		addSourceReference: true,
		executable: false,
		logOn: false,
		doCompile: true,
		doWatch: false,
		doExtract: false,
		extensions: {},
		modules: {},
		clean: false,
		copyDriveFiles: true,
		developperMode: false,
		fromIDE: false,
		forceSplash: false,
		gotoDirectMode: false,
		saveLastBuild: false,
		debugging: false,
		noDebugging: false,
		serverPort: 1976,
		caseSensitive: false,
		debug_addWatch: false,
		autoTranslateTranspiler: false,
		accessory: false,
		rebuild: [],
		build: [],
		excludeFromBuild: false,
		verbose: messages.VERBOSE_DEFAULT,
		indent: false,
		basicRemarks: true,
		tabWidth: 4,
		outputToJSON: true,
		outputToConsole: true,
		logTo: '',
		banks: {},
		filesToAddToFilesystem: {},
		sendCrashReport: false,
		systemInformation: {},
		specialFolders: {},
		useSource: '',
		fonts:
		{
			amigaList: '',
			googleList: '',
			google: '',
			amiga: '',
			families: '',
			faces: '',
		},
		fileSystemTree: '',
		needServer: false,
		useSounds: false,
		needFiles: {},
		loadFilesAfter: {},
		checkForNextLoops: false,
		addOnPaths: {},
		addOnFolders: {},
		insertIntoHead: [],
		insertIntoBody: [],
		insertIntoStyle: [],
		noBanks: {},
		preprocVariables: {},
		callback: callback,
		callbackExtra: extra,
		localTags: {},
		globalTags: {},
		token: '',
		serial: '',
		transpilerPath: '.'
	};

	// Called from node or on command line?
	newOptions.initOptions = initOptions;
	newOptions.currentPath = transpilerPath;
	newOptions.jsonPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/transpilermanifest.hjson' ) );
	newOptions.aozPath = utilities.cleanPath( PATH.resolve( newOptions.currentPath, './..' ) );
	
	/*
	// Read the aoz.hjson file from the vscode directory
	var json;
	try
	{
		var file = utilities.loadIfExist( newOptions.jsonPath, { encoding: 'utf8' } );
		json = HJSON.parse( file );
	}
	catch( e )
	{ }
	if ( !json )
	{
		if ( newOptions.fromNode )
		{
			return null;
		}
		else
		{
			messages.setOptions( newOptions );
			messages.print( messages.VERBOSE_ERRORS, 'cannot_load_ini', path );
			process.exit( 1 );
		}
	}
	*/

	newOptions.transpilerManifestPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/transpilermanifest.hjson' ) );
	newOptions.runtimePath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/runtime' ) );
	newOptions.libraryPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/runtime/run' ) );
	newOptions.modulesPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/languages' ) );
	newOptions.modulesDestinationPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/build/languages' ) );
	newOptions.extensionsPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/extensions' ) );
	newOptions.extensionsDestinationPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/build/extensions' ) );
	newOptions.templatesPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/templates' ) );
	newOptions.fontPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/fonts' ) );
	newOptions.defaultPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/default' ) );
	newOptions.dataPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/build' ) );
	newOptions.utilitiesPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/utilities/windows' ) );

	if( process.platform == 'darwin' )
	{
		newOptions.utilitiesPath = utilities.cleanPath( PATH.join( newOptions.aozPath, '/utilities/mac' ) );
	}

	newOptions.logPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/compilation.log' ) );
	newOptions.systemInformationPath = utilities.cleanPath( PATH.join( newOptions.currentPath, '/systemInformation.json' ) );

	if ( initOptions )
	{
		newOptions.applicationsPath = initOptions.applicationsPath;
		newOptions.drivePath = initOptions.drivePath;
		newOptions.isCommandMode = true;
	}
	else
	{
		// Replaced by real value upon connexion
		newOptions.applicationsPath = "c:\\users\\francois\\Documents\\My Aoz Applications";
		newOptions.drivePath = "c:\\Aoz_Studio\\Aoz_Studio\\app\\Drives";
	}
	utilities.createDirectories( newOptions.dataPath );
	for ( var a = 2;  a < process.argv.length; a++ )
	{
		var command = process.argv[ a ].toLowerCase();

		if( command.substring( 0, 7 ) == '--path=' )
		{
			newOptions.transpilerPath = command.substring( 7, command.length );
			command = "--none";
		}

		if( command.substring( 0, 8 ) == '--token=' )
		{
			newOptions.token = command.substring( 8, command.length );
			command = "--none";
		}

		if( command.substring( 0, 9 ) == '--serial=' )
		{
			newOptions.serial = command.substring( 9, command.length );
			command = "--none";
		}
	}

	return newOptions;
};
function loadTranspilerManifest( options )
{
	// Load the transpiler manifest
	var json = utilities.loadIfExist( options.transpilerManifestPath, { encoding: 'utf8' } );
	if ( !json )
	{
		messages.pushError( { compilerError: 'transpiler_manifest_not_found', parameter: options.transpilerManifestPath } );
		return false;	
	}

	var manifest;
	try
	{
		if ( json )
		{
			json = utilities.fixJson( json );
			manifest = HJSON.parse( json );
		}
	}
	catch( e )
	{
		messages.pushError( { compilerError: 'illegal_transpiler_manifest', parameter: options.transpilerManifestPath } );
		return false;
	}

	// Compatible version of the manifest?
	if ( !manifest.version || manifest.version < manifestVersionTranspiler )
	{
		messages.pushError( { compilerError: 'bad_version_of_transpiler_manifest', parameter: "version found: " + manifest.version + ", should be later than: " + manifestVersion } );
		return false;
	}

	// Poke the path into the options
	options.manifestTranspiler = manifest;
	if ( manifest.directories.modules )
		options.modulesPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.modules ) );
	if ( manifest.directories.modulesObj )
		options.modulesDestinationPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.modulesObj ) );
	if ( manifest.directories.extensions )
		options.extensionsPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.extensions ) );
	if ( manifest.directories.extensionsObj )
		options.extensionsDestinationPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.extensionsObj ) );
	if ( manifest.directories.runtime )
		options.runtimePath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.runtime ) );
	if ( manifest.directories.templates )
		options.templatesPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.templates ) );
	if ( manifest.directories.fonts )
		options.fontPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.fonts ) );
	if ( manifest.directories.utilities )
		options.utilitiesPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.utilities ) );
	if ( manifest.directories.log )
		options.logPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.log ) );
	if ( manifest.directories.data )
		options.dataPath = utilities.cleanPath( PATH.resolve( options.currentPath, manifest.directories.data ) );
		
	MKDIRP.sync( options.dataPath );
	MKDIRP.sync( options.modulesDestinationPath );
	MKDIRP.sync( options.extensionsDestinationPath );
	return manifest;
};

function aoz( options )
{
	var logCode = "options.originalSourcePath: " + options.originalSourcePath + "\r\n";
	if( options.originalSourcePath )
	{
		options.sourcePath = options.originalSourcePath;
	}

	messages.setOptions( options );
	messages.clearErrors();
	//messages.print( messages.VERBOSE_MESSAGES, 'title', version );

	options.iAjOkZ = 'iAjOkZ';
	if( options.licenceType && options.licenceType == 'AOZF' )
	{
		options.iAjOkZ = '';
	var symbol = 'abcdefghijklmnopqrstuvwxyz0123456789';
	for( var i = 0; i < 20; i++ )
	{
		var a = Math.floor( Math.random() * symbol.length );
		var c = symbol.substring( a - 1, a );
			options.iAjOkZ += c;
		}
	}	

	// Developper mode
	if ( options.developperMode )
		messages.print( messages.VERBOSE_MESSAGES, 'developper_mode', 'ON' );

	// Auto translation system
	messages.set_autoTranslate( options.autoTranslateTranspiler );

	// Time stamp
	timeStartOfCompilation = new Date().getTime();
	try
	{
		// Check that the source directory exists
		if ( !options.sourcePath || ( options.sourcePath && !FS.existsSync( options.sourcePath ) ) )
		{
			messages.pushError( { compilerError: 'application_does_not_exist', parameter: options.sourcePath } );
			throw {};
		}

		// Convert a .AMOS file first?
		//var extension = utilities.getFileExtension( options.sourcePath ).toLowerCase();
		var extension = PATH.extname( options.sourcePath ).toLowerCase();
		logCode += "extension: " + extension + "\r\n";		
		if ( extension == '.amos' )
		{
			var path = options.destinationPath;
			if ( !path )
				path = options.applicationsPath + '/' + utilities.getFilename( options.sourcePathOriginal );
			if ( importer.convertAMOS( path, options.sourcePath, options ) )
				throw {};
			options.sourcePath = path;
			theEnd( options, true );
			return 0;
		}


		// Check the presence of main.aoz
		options.manifest = loadManifest( options, false );
		if ( extension != '.aoz' )
		{
			if ( options.manifest && options.manifest.infos.start )
				options.currentSourceFilename = options.manifest.infos.start;
			else
				options.currentSourceFilename = 'main.aoz';

			options.currentSourcePath = options.sourcePath + '/' + options.currentSourceFilename;
			if ( !options.destinationPath )
				options.destinationPath = options.sourcePath + '/html';
		}
		else
		{
			options.currentSourceFilename = utilities.getFilenameAndExtension( options.sourcePath );
			options.currentSourcePath = options.sourcePath;
			options.sourcePath = utilities.getDirectoryFromPath( options.currentSourcePath );
			if ( !options.destinationPath )
				options.destinationPath = options.sourcePath + '/html';
		}

		logCode += 'options.currentSourceFilename: ' + options.currentSourceFilename + "\r\n";
		logCode += 'options.currentSourcePath: ' + options.currentSourcePath + "\r\n";
		logCode += 'options.destinationPath: ' + options.destinationPath + "\r\n";
		
		if ( !FS.existsSync( options.currentSourcePath ) )
		{
			messages.pushError( { compilerError: 'cannot_load_file', parameter: options.currentSourcePath } );
			throw {};
		}
		options.objPath = options.destinationPath;
		initialTags[ 'saveTo' ].value = options.destinationPath;

		// Load source and scans for basic tags
		var information = new INFO.Information( options );
		if ( options.gotoDirectMode )
			options.addSourceAtStart = '\nConsole On True, Prompt$ = "Aoz> ", Output$ = "application"\n';
		if ( !information.loadSource( options.currentSourcePath, options ) )
		{
			theEnd( options, false, {} );
			exit_app();
		}
		if ( !information.scanForTags( initialTags, options, { caseSensitive: false, replaceWith: ' ' } ) )
			throw {};

		// Load the manifest
		if ( !options.manifest )
		{
			// Load the manifest
			options.manifest = loadManifest( options, true, initialTags[ 'manifest' ].value, initialTags[ 'fullScreen' ].value || initialTags[ 'fullPage' ].value );
			if ( !options.manifest )
				throw {};
		}
		utilities.applyTags( options.manifest, 'manifest', initialTags );
		utilities.applyTags( options, 'options', initialTags );
		options.baseManifest = utilities.copyObject( options.manifest );
		messages.setOptions( options );

		// If developer mode, reload all runtime.
		if ( options.developperMode )
		{
			messages.print( messages.VERBOSE_MESSAGES, 'reloading_sources' );
			fileLoader_run.loadAllFiles();
		}

		// Depending on the type of the manifest
		if ( options.baseManifest.versionModule )
		{
			if ( !compileModules( rootOptions, [ options.manifest.infos.name ], [], fileLoader_modules ) )
				throw {};
		}
		else if ( options.baseManifest.versionExtension )
		{
			if ( !compileExtensions( rootOptions, [ options.manifest.infos.name ], [], fileLoader_extensions ) )
				throw {};
		}
		else
		{
			// Reload Runtime code in developper mode
			if ( options.developperMode )
				fileLoader_run.loadAllFiles();
				
			compileModules( rootOptions, options.rebuild, options.build, fileLoader_modules );
			if ( messages.isErrors() )
				throw {};

			compileExtensions( rootOptions, options.rebuild, options.build, fileLoader_extensions );
			if ( messages.isErrors() )
				throw {};
			linkClasses( rootOptions );

			messages.setOptions( options );

			options.modules = utilities.copyObject( rootOptions.modules );
			options.extensions = utilities.copyObject( rootOptions.extensions );

			// Initialization of compiler
			var error = !compiler.init( information, options );
			error |= !banks.init( information, options );
			error |= !filesystem.init( information, options );
			if ( error )
				throw {};

			// Compilation!
			if ( options.doCompile )
			{
				if ( compile( information ) )
					throw {};
			}
		}

		// Store information for direct mode
		lastInformation = information;

		// Start a server?
		var wait_for_end = false;

		// All OK!
		lastOptions = options;

		var handle = setInterval( function()
		{
			if ( !wait_for_end )
			{
				clearInterval( handle );
				if ( options.indent && options.fromIDE )
				{
					var indentation = JSON.stringify( information.indentation );
					console.log( 'INDENT{{{' + indentation + '}}}' );
				}
				if ( options.saveLastBuild )
					saveLastBuild( options );
				theEnd( options, true );
			}
		}, 20 );
	}
	catch( e )
	{
		theEnd( options, false, e );
		return 1;
	}

	return 0;
};
module.exports.aoz = aoz;

function saveLastBuild( options )
{
	options.information.options = null;
	options.information.lines = null;
	options.information.currentInstructionInfo = null;
	options.information.code = '';
	options.information.indentation = [];
	options.information.inExpressionFlags = [];
	options.information.lastOperand = null;
	options.information.lastOperator = null;
	options.information.lineDebug = '';
	options.information.lineDebugFull = '';
	options.information.result = '';
	options.fileLoader = null;
	options.fileLoader_drive = null;
	options.fileLoader_extensions = null;
	options.fileLoader_modules = null;
	options.fileLoader_run = null;
	options.fileLoader_fonts = null;
	options.fileSaver = null;
	options.baseOptions = null;
	options.information.anchors = {};
	options.information.section = {};
	cleanSectionJSON( options.information.rootSection );
	options.information.rootSection.anchors = {};
	options.information.rootSection.blockPlus = [];
	options.information.rootSection.blocks = [];
	options.information.rootSection.debuggerBlocks = [];
	options.information.rootSection.classCount = 0;
	options.appFilesystemTreeFlat = null;
	options.driveTreeFlat = null;

	var extensions = options.extensions;
	var modules = options.modules;
	options.extensions = {};
	options.modules = {};
	for ( var e in extensions )
		options.extensions[ e ] = extensions[ e ].inUse;
	for ( var m in modules )
		options.modules[ m ] = modules[ m ].inUse;
	utilities.saveJSON( options.dataPath + '/lastbuild_options.json', options );
};

// End of compilation
function theEnd( options, response, error )
{
	if ( !response )
	{
		messages.printErrors();
		if ( error != 'halt' )
		{
			if ( utilities.isObject( error ) )
			{
				if ( error.stack )
				{
					messages.print( messages.VERBOSE_ERRORS, error.message );
					messages.print( messages.VERBOSE_ERRORS, error.stack );
				}
				else if ( error.error )
				{
					messages.compilerError( error.error, 'aoz-x64.exe', error.parameter );
				}
			}
			else if ( typeof error == 'string' && error != '' )
			{
				messages.print( messages.VERBOSE_ERRORS, error );
			}
		}
	}
	else
	{
		// Print error and warnings...
		messages.printErrors();
		messages.printWarnings();
	}

	var handle = setInterval( function()
	{
		if ( utilities.numberOfFilesOpen == 0 )
		{
			clearInterval( handle );
			if ( !response )
			{
				messages.print( messages.VERBOSE_ERRORS, 'compilation_failed' );
				messages.close();
				if ( options.callback )
					options.callback( 'failure', null, options.callbackExtra );
			}
			else
			{
				var deltaTime = ( new Date().getTime() - timeStartOfCompilation ) / 1000;
				messages.print( messages.VERBOSE_MESSAGES, 'compilation_success', deltaTime.toString() );
				messages.close();
				if ( options.callback )
					options.callback( 'success', { indentation: lastInformation ? lastInformation.indentation : [] }, options.callbackExtra );
			}
		}
	}, 10 );
};
function exit_app()
{
	process.exit(1);
}

// Compilation!
function compile( information )
{
	var options = information.options;
	try
	{
		// Check version of current compiled version
		var clean = options.clean;
		if ( !clean )
		{
			var path = options.destinationPath + '/run/transpiler-version';
			var currentVersion = utilities.loadIfExist( path, { encoding: 'utf8' } )
			if ( currentVersion )
			{
				if ( currentVersion != options.version )
					clean = true;
			}
			else
				clean = true;
		}

		// Clean directory?
		if ( clean )
			utilities.deleteDirectory( options.destinationPath, { recursive: true, catch: false, onlyFiles: false, onlyDirectories: false, keepRoot: true } );

		messages.print( messages.VERBOSE_MESSAGES, 'compiling', options.currentSourcePath );

		options.baseOptions = options;
		options.contextName = 'application';
		options.isExtension = false;

		// Restore modules parent
		for ( var m in options.modules )
			restoreModule( options.modules[ m ] );

		// Create the directories and FileSaver/Loader objects
		utilities.createDirectories( options.destinationPath );
		utilities.createDirectories( options.destinationPath + PATH.sep + 'run' );
		utilities.createDirectories( options.destinationPath + PATH.sep + 'resources' + PATH.sep + 'filesystem' );
		options.fileSaver = new utilities.FileSaver( options.destinationPath, '', { version: version, dataPath: options.dataPath, recursive: true, loadFiles: true } );
		options.fileLoader = new utilities.FileLoader( options.sourcePath, '', { version: version, dataPath: options.dataPath, recursive: true } );
		options.fileLoader_run = fileLoader_run;
		options.fileLoader_extensions = fileLoader_extensions;
		options.fileLoader_modules = fileLoader_modules;
		options.fileLoader_fonts = fileLoader_fonts;
		options.fileLoader_drive = fileLoader_drive;

		var info = compiler.compile( information, options );
		options.applicationCode = info.code;
		if ( !options.indent )
		{
			banks.compileBanks( options );				
			banks.compileFonts( options, options.manifest.default.screen.window.font );

			// Add the files of the modules and extensions
			for ( var e in options.extensions )
			{
				var extension = options.extensions[ e ];
				if ( extension.inUse )
				{
					for ( var f in extension.filesToAddToFilesystem )
						options.filesToAddToFilesystem[ f ] = extension.filesToAddToFilesystem[ f ];
				}
			}
			for ( var e in options.modules )
			{
				var module = options.modules[ e ];
				if ( module.inUse )
				{
					for ( var f in module.filesToAddToFilesystem )
						options.filesToAddToFilesystem[ f ] = module.filesToAddToFilesystem[ f ];
				}
			}
			filesystem.compileFilesystem( options );

			copyResources( options );
			generateIndex( options );
		}
		options.fileLoader.close();
		options.fileSaver.close();
	}
	catch( e )
	{
		throw e;
	}
	return 0;
}

// Reset the modules before compilation
function restoreModule( module )
{
	for ( var i in module.instructions )
	{
		var instruction = module.instructions[ i ];
		for ( var v = 0; v < instruction.variants.length; v++ )
		{
			instruction.variants[ v ].parent = instruction;
		}
	}
	for ( var f in module.functions )
	{
		var func = module.functions[ f ];
		for ( var v = 0; v < func.variants.length; v++ )
		{
			func.variants[ v ].parent = func;
		}
	}
}

// Compilation of extensions...
function compileExtensions( options, rebuild, build, fileLoaderToUpdate )
{
	var built = false;
	function buildIt( name, toTranspile )
	{
		try
		{
			var path = options.extensionsPath + '/' + name + '/manifest.hjson';
			if ( FS.existsSync( path ) )
			{
				var extensionPath = utilities.getDirectoryFromPath( path );
				var subPath = extensionPath.substring( 1 + options.extensionsPath.length );
				var shortName = subPath.substring( subPath.lastIndexOf( '/' ) + 1 );
				var moduleName = 'ext_' + subPath;
				var destinationPath = options.extensionsDestinationPath + '/' + subPath;

				// Check files...
				if ( !toTranspile )
				{
					var fileLoader = new utilities.FileLoader( extensionPath, '_extension', { version: version, dataPath: options.dataPath, recursive: true } );
					toTranspile = fileLoader.isDirectoryDifferent( extensionPath, { recursive: true } );
					fileLoader.close();
				}

				// Not to transpile-> load data directly
				var extensionDefinition;
				if ( !toTranspile )
				{
					toTranspile = true;
					var path = PATH.resolve( destinationPath + '/extension.hjson' );
					if ( FS.existsSync( path ) )
					{
						extensionDefinition = utilities.loadHJSON( path );
						if ( extensionDefinition )
						{
							options.extensions[ moduleName ] = extensionDefinition;
							messages.print( messages.VERBOSE_MESSAGES, 'skipping_extension', shortName );
							toTranspile = false;
						}
					}
				}
				
				if ( toTranspile )
				{
					messages.print( messages.VERBOSE_MESSAGES, 'compiling_extension', shortName );

					newOptions = utilities.copyObject( options );
					newOptions.sourcePath = extensionPath;
					newOptions.destinationPath = destinationPath;
					newOptions.destinationPathLocal = PATH.relative( extensionPath, destinationPath );
					newOptions.objPath = destinationPath;
					newOptions.moduleName = moduleName;
					newOptions.shortName = shortName;
					newOptions.extensionName = shortName;
					newOptions.filesToAddToFilesystem = {};

					// Clean directory as a precaution
					utilities.deleteDirectory( newOptions.destinationPath, { recursive: true, catch: false, onlyFiles: false, onlyDirectories: false, keepRoot: true } );

					// Transpile!
					newOptions.isExtension = true;
					newOptions.fileLoader = new utilities.FileLoader( newOptions.sourcePath, '', { version: version, recursive: true } );

					// Load manifest
					newOptions.manifest = loadManifest( newOptions );
					newOptions.manifest.bootScreen =
					{
						active: false,
						waitSounds: false,
						clickSounds: false
					};
					newOptions.baseManifest = options.manifest;
					if ( !newOptions.manifest )
						return false;
					if ( !newOptions.manifest.versionExtension || newOptions.manifest.versionExtension < manifestVersionExtension )
					{
						messages.pushError( { compilerError: "illegal_extension_manifest", parameter: newOptions.sourcePath } );
						return false;
					}

					// Get the entry point
					if ( newOptions.manifest.infos.start )
						newOptions.currentSourceFilename = newOptions.manifest.infos.start;
					else
						newOptions.currentSourceFilename = 'main.aoz';
					newOptions.currentSourcePath = newOptions.sourcePath + '/' + newOptions.currentSourceFilename;

					// Load source and scans for basic tags
					var information = new INFO.Information( newOptions );
					if ( !information.loadSource( newOptions.currentSourcePath ) )
						return false;
					newOptions.localTags = utilities.copyObject( information.localTags );
					newOptions.globalTags = utilities.copyObject( information.globalTags );
					var newTags = utilities.copyObject( initialTags );
					if ( !information.scanForTags( newTags, newOptions, { caseSensitive: false, replaceWith: ' ' } ) )
						return false;
					utilities.applyTags( newOptions, 'options', newTags );
					//utilities.applyTags( newOptions.manifest, 'manifest', newTags );
					newOptions.debugging = false;
					messages.setOptions( newOptions );

					// Exclude from build?
					if ( newOptions.excludeFromBuild )
						return true;

					utilities.createDirectories( newOptions.destinationPath );
					utilities.createDirectories( newOptions.destinationPath + '/run' );
					utilities.createDirectories( newOptions.destinationPath + '/resources/filesystem' );
					newOptions.fileSaver = new utilities.FileSaver( newOptions.objPath, '', { version: version, dataPath: options.dataPath, recursive: true, loadFiles: true } );
					newOptions.fileLoader_run = fileLoader_run;
					newOptions.fileLoader_fonts = fileLoader_fonts;
					newOptions.fileLoader_drive = fileLoader_drive;

					var error = !compiler.init( information, newOptions );
					error |= !banks.init( information, newOptions );
					error |= !filesystem.init( information, newOptions );
					if ( error )
						throw {};

					var info = compiler.compileModule( information, newOptions );
					if ( info.code.length > 0 )
						newOptions.fileSaver.saveUTF8( newOptions.destinationPath + '/run/object.js', info.code );

					banks.compileBanks( newOptions, options );
					banks.compileFonts( newOptions );
					filesystem.compileFilesystem( newOptions, options );
					
					// Remove the anchors
					var section = info.section;
					cleanSectionJSON( section );
					extensionDefinition =
					{
						name: newOptions.moduleName,
						shortName: newOptions.shortName,
						version: version,
						instructions: section.instructions,
						functions: section.functions,
						methods: section.methods,
						objects: section.objects,
						objectName: newOptions.manifest.infos.object,
						codeInLine: section.codeInLine,
						codeInLineReturn: section.codeInLineReturn,
						syntax: section.syntax,
						tags: info.tags,
						banks: newOptions.banks,
						fileSystemTree: newOptions.fileSystemTree,
						fonts: utilities.copyObject( newOptions.fonts ),
						needServer: newOptions.needServer,
						useSounds: newOptions.useSounds || newOptions.manifest.bootScreen.waitSounds,
						needFiles: newOptions.needFiles,
						loadFilesAfter: newOptions.loadFilesAfter,
						addOnPaths: newOptions.addOnPaths,
						addOnFolders: newOptions.addOnFolders,
						insertIntoHead: newOptions.insertIntoHead,
						insertIntoBody: newOptions.insertIntoBody,
						insertIntoStyle: newOptions.insertIntoStyle,
						noBanks: newOptions.noBanks,
						needModules: info.needModules,
						needExtensions: info.needExtensions,
						forceInclude: newOptions.manifest.compilation.forceInclude,
						objPath: PATH.relative( options.currentPath, newOptions.destinationPath ),
						destinationPath: newOptions.destinationPath,
						filesToAddToFilesystem: newOptions.addToFilesystem ? newOptions.addToFilesystem : {},
						manifest: newOptions.manifest,
						localTags: newOptions.localTags,
						globalTags: newOptions.globalTags,
						sourcePath: newOptions.sourcePath
					};
					var extensionJson = HJSON.stringify( extensionDefinition );
					newOptions.fileSaver.saveUTF8( newOptions.destinationPath + '/extension.hjson', extensionJson );
					options.extensions[ newOptions.moduleName ] = extensionDefinition;

					// Print warnings
					messages.printWarnings();
					messages.clearWarnings();

					// Update fileLoader?
					if ( fileLoaderToUpdate )
						fileLoaderToUpdate.updateDirectory( newOptions.fileSaver );

					// Close file saver...
					newOptions.fileSaver.close();
					newOptions.fileLoader.close();

					built = true;
				}
				extensionDefinition.objectSourcePath = destinationPath + '/run/object.js';
				if ( !FS.existsSync( extensionDefinition.objectSourcePath ) )
					extensionDefinition.objectSourcePath = '';
				return true;
			}
		}
		catch( e )
		{
		}
		return false;
	}

	var OK = true;
	if ( !build && !rebuild )
	{
		var path = options.dataPath + '/extensions.json';
		if ( FS.existsSync( path ) )
		{
			options.extensions = utilities.loadJSON( path, { noError: true } );
			for ( var e in options.extensions  )
			{
				if ( options.extensions[ e ].version != version )
				{
					rebuild = [ 'extensions' ];
					break;
				}
			}
		}
		else
		{
			rebuild = [ 'extensions' ];
		}
	}
	if ( rebuild )
	{
		for ( var n = 0; n < rebuild.length; n++ )
		{
			var name = rebuild[ n ];
			if ( name.toLowerCase() == 'extensions' )
			{
				// Scan the whole folder-> last folder before manifest
				var tree = utilities.getDirectory( options.extensionsPath, { recursive: true, filters: [ '*.hjson' ] } );
				var files = utilities.getFileArrayFromTree( tree );
				for ( var f = 0; f < files.length; f++ )
				{
					var parent = files[ f ].parent;
					if ( parent )
						OK &= buildIt( parent.name, true );
				}
			}
			else
				OK &= buildIt( name, true )
		}
	}
	if ( build )
	{
		for ( var n = 0; n < build.length; n++ )
		{
			var name = build[ n ];
			if ( name.toLowerCase() == 'extensions' )
			{
				// Scan the whole folder-> last folder before manifest
				var tree = utilities.getDirectory( options.extensionsPath, { recursive: true, filters: [ '*.hjson' ] } );
				var files = utilities.getFileArrayFromTree( tree );
				for ( var f = 0; f < files.length; f++ )
				{
					var parent = files[ f ].parent;
					if ( parent )
						OK &= buildIt( parent.name, false );
				}
				break;
			}
			else
				OK &= buildIt( name, f )
		}
	}

	// Save the whole module json for quick loading
	if ( built )	
		utilities.saveJSON( options.dataPath + '/extensions.json', options.extensions );
	
	return OK;
}
function linkClasses( options )
{
	function findClass( cName )
	{
		var classe = null;
		for ( var m in options.modules )	
		{
			var module = options.modules[ m ];
			if ( module.objects[ cName ] )
			{
				classe = module.objects[ cName ];
				break;
			}
		}
		if ( !classe )
		{
			for ( var m in options.modules )	
			{
				var module = options.modules[ m ];
				if ( module.objects[ cName ] )
				{
					classe = module.objects[ cName ];
					break;
				}
			}
		}
		return classe;
	}

	var extendClasses = {};
	var friendClasses = {};
	for ( var c in options.modules )
	{
		var module = options.modules[ c ];
		for ( var c in module.objects )
		{
			var klass = module.objects[ c ];
			for ( var v = 0; v < klass.variants.length; v++ )
			{
				 var variant = klass.variants[ v ];
				 for ( var e = 0; e < variant.extendsList.length; e++ )
				 {
					 var ext = variant.extendsList[ e ];
					 if ( !extendClasses[ ext ] )
						 extendClasses[ ext ] = {}
					 extendClasses[ ext ][ klass.name ] = true;
				 }
				 for ( var e = 0; e < variant.friendsList.length; e++ )
				 {
					 var ext = variant.friendsList[ e ];
					 if ( !friendClasses[ ext ] )
						 friendClasses[ ext ] = {}
					 friendClasses[ ext ][ klass.name ] = true;
				 }
			 }
		}
	}
	for ( var c in options.extensions )
	{
		var extension = options.extensions[ c ];
		for ( var c in extension.objects )
		{
			var klass = extension.objects[ c ];
			for ( var v = 0; v < klass.variants.length; v++ )
			{
				var variant = klass.variants[ v ];
				for ( var e = 0; e < variant.extendsList.length; e++ )
				{
					var ext = variant.extendsList[ e ];
					if ( !extendClasses[ ext ] )
						extendClasses[ ext ] = {}
					extendClasses[ ext ][ klass.name ] = true;
				}
				for ( var e = 0; e < variant.friendsList.length; e++ )
				{
					var ext = variant.friendsList[ e ];
					if ( !friendClasses[ ext ] )
						friendClasses[ ext ] = {}
					friendClasses[ ext ][ klass.name ] = true;
				}
			}
		}
	}

	for ( var c in extendClasses )
	{
		var cName = utilities.replaceSpacesByUnderscores( c ).toLowerCase();	
		var classe = findClass( cName );
		if ( classe )
		{
			for ( var v = 0 ; v < classe.variants.length; v++ )
			{
				var variant = classe.variants[ v ];
				for ( var cc in extendClasses[ c ] )
					variant.extendedBy.push( cc );
			}
		}
	}
	for ( var c in friendClasses )
	{
		var cName = utilities.replaceSpacesByUnderscores( c ).toLowerCase();	
		var classe = findClass( cName );
		if ( classe )
		{
			for ( var v = 0 ; v < classe.variants.length; v++ )
			{
				var variant = classe.variants[ v ];
				for ( var cc in friendClasses[ c ] )
					variant.friendWith.push( cc );
			}
		}
	}
}
// Compilation of the language folder
function compileModules( options, rebuild, build, fileLoaderToUpdate )
{
	var built = false;
	function buildIt( name, toTranspile )
	{
		try
		{
			var path = options.modulesPath + '/v1_0/' + name + '/manifest.hjson';
			if ( FS.existsSync( path ) )
			{
				var modulePath = utilities.getDirectoryFromPath( path );
				var subPath = modulePath.substring( 1 + options.modulesPath.length );
				var shortName = subPath.substring( subPath.lastIndexOf( '/' ) + 1 );
				var moduleName = utilities.replaceCharsByChar( subPath, [ ' ', '/', '\\', '-', '+', '.', '>', '<' ], '_' ).toLowerCase();
				var destinationPath = options.modulesDestinationPath + '/' + subPath;

				// Should it be transpiled?
				if ( !toTranspile )
				{
					var fileLoader = new utilities.FileLoader( modulePath, '_module', { version: version, dataPath: options.dataPath, recursive: true } );
					toTranspile = fileLoader.isDirectoryDifferent( modulePath, { recursive: true } );
					fileLoader.close();
				}

				// Not to transpile-> load data directly
				var moduleDefinition;
				if ( !toTranspile )
				{
					toTranspile = true;
					var path = PATH.resolve( destinationPath + '/module.hjson' );
					if ( FS.existsSync( path ) )
					{
						moduleDefinition = utilities.loadHJSON( path );
						if ( moduleDefinition )
						{
							options.modules[ moduleName ] = moduleDefinition;
							messages.print( messages.VERBOSE_MESSAGES, 'skipping_module', shortName );
							toTranspile = false;
						}
					}
				}

				// Perform transpilation
				if ( toTranspile )
				{
					messages.print( messages.VERBOSE_MESSAGES, 'compiling_module', shortName );

					var newOptions = utilities.copyObject( options );
					newOptions.sourcePath = modulePath;
					newOptions.destinationPath = destinationPath;
					newOptions.destinationPathLocal = PATH.relative( modulePath, destinationPath );
					newOptions.objPath = destinationPath;
					newOptions.moduleName = moduleName;
					newOptions.shortName = shortName;
					newOptions.filesToAddToFilesystem = {};

					// Clean directory as a precaution
					utilities.deleteDirectory( newOptions.destinationPath, { recursive: true, catch: false, onlyFiles: false, onlyDirectories: false, keepRoot: true } );

					// Transpile!
					newOptions.isModule = true;
					newOptions.fileLoader = new utilities.FileLoader( newOptions.sourcePath, '', { version: version, recursive: true } );

					// Load manifest
					newOptions.manifest = loadManifest( newOptions );
					newOptions.manifest.bootScreen =
					{
						active: false,
						waitSounds: false,
						clickSounds: false
					};

					newOptions.baseManifest = options.manifest;
					if ( !newOptions.manifest )
						return false;
					if ( !newOptions.manifest.versionModule || newOptions.manifest.versionModule < manifestVersionModule )
					{
						messages.pushError( { compilerError: "illegal_module_manifest", parameter: newOptions.sourcePath } );
						return false;
					}

					// Get the entry point
					if ( newOptions.manifest.infos.start )
						newOptions.currentSourceFilename = newOptions.manifest.infos.start;
					else
						newOptions.currentSourceFilename = 'main.aoz';
					newOptions.currentSourcePath = newOptions.sourcePath + '/' + newOptions.currentSourceFilename;

					// Load source and scans for basic tags
					var information = new INFO.Information( newOptions );
					if ( !information.loadSource( newOptions.currentSourcePath ) )
						return false;
					newOptions.localTags = utilities.copyObject( information.localTags );
					newOptions.globalTags = utilities.copyObject( information.globalTags );
					var newTags = utilities.copyObject( initialTags );
					if ( !information.scanForTags( newTags, newOptions, { caseSensitive: false, replaceWith: ' ' } ) )
						return false;
					utilities.applyTags( newOptions, 'options', newTags );
					//utilities.applyTags( newOptions.manifest, 'manifest', newTags );
					newOptions.debugging = false;

					messages.setOptions( newOptions );

					// Exclude from build?
					if ( newOptions.excludeFromBuild )
						return true;

					utilities.createDirectories( newOptions.destinationPath );
					utilities.createDirectories( newOptions.destinationPath + '/run' );
					utilities.createDirectories( newOptions.destinationPath + '/resources/filesystem' );
					newOptions.fileSaver = new utilities.FileSaver( newOptions.destinationPath, '', { version: version, dataPath: options.dataPath, recursive: true, loadFiles: true } );
					newOptions.fileLoader_run = fileLoader_run;
					newOptions.fileLoader_fonts = fileLoader_fonts;
					newOptions.fileLoader_drive = fileLoader_drive;

					var error = !compiler.init( information, newOptions );
					error |= !banks.init( information, newOptions );
					error |= !filesystem.init( information, newOptions );
					if ( error )
						throw {};

					var info = compiler.compileModule( information, newOptions );
					if ( info.code.length > 0 )
						newOptions.fileSaver.saveUTF8( newOptions.destinationPath + '/run/object.js', info.code );

					banks.compileBanks( newOptions, options );
					banks.compileFonts( newOptions );
					filesystem.compileFilesystem( newOptions, options );

					// Remove the anchors
					var section = info.section;
					cleanSectionJSON( section );
					moduleDefinition =
					{
						name: newOptions.moduleName,
						shortName: newOptions.shortName,
						version: version,
						instructions: section.instructions,
						functions: section.functions,
						methods: section.methods,
						objects: section.objects,
						objectName: newOptions.manifest.infos.object,
						codeInLine: section.codeInLine,
						codeInLineReturn: section.codeInLineReturn,
						syntax: section.syntax,
						tags: info.tags,
						banks: newOptions.banks,
						fileSystemTree: newOptions.fileSystemTree,
						fonts: utilities.copyObject( newOptions.fonts ),
						needServer: newOptions.needServer,
						useSounds: newOptions.useSounds || newOptions.manifest.bootScreen.waitSounds,
						needFiles: newOptions.needFiles,
						loadFilesAfter: newOptions.loadFilesAfter,
						addOnPaths: newOptions.addOnPaths,
						addOnFolders: newOptions.addOnFolders,
						insertIntoHead: newOptions.insertIntoHead,
						insertIntoBody: newOptions.insertIntoBody,
						insertIntoStyle: newOptions.insertIntoStyle,
						noBanks: newOptions.noBanks,
						needModules: info.needModules,
						needExtensions: info.needExtensions,
						forceInclude: newOptions.manifest.compilation.forceInclude,
						objPath: PATH.relative( options.currentPath, newOptions.destinationPath ),
						destinationPath: newOptions.destinationPath,
						filesToAddToFilesystem: newOptions.addToFilesystem ? newOptions.addToFilesystem : {},
						manifest: newOptions.manifest,
						localTags: newOptions.localTags,
						globalTags: newOptions.globalTags,
						sourcePath: newOptions.sourcePath
					};
					var moduleJson = HJSON.stringify( moduleDefinition );
					newOptions.fileSaver.saveUTF8( newOptions.destinationPath + '/module.hjson', moduleJson );
					options.modules[ newOptions.moduleName ] = moduleDefinition;

					// Print warnings
					messages.printWarnings();
					messages.clearWarnings();

					// Update fileLoader
					if ( fileLoaderToUpdate )
						fileLoaderToUpdate.updateDirectory( newOptions.fileSaver );

					// Close files
					newOptions.fileSaver.close();
					newOptions.fileLoader.close();

					built = true;
				}
				moduleDefinition.objectSourcePath = destinationPath + '/run/object.js';
				if ( !FS.existsSync( moduleDefinition.objectSourcePath ) )
					moduleDefinition.objectSourcePath = '';				
				return true;
			}
		}
		catch( e )
		{
		}	
		return false;
	}

	var OK = true;
	if ( !build && !rebuild )
	{
		var path = options.dataPath + '/modules.json';
		if ( FS.existsSync( path ) )
		{
			options.modules = utilities.loadJSON( path, { noError: true } );
			for ( var m in options.modules  )
			{
				if ( options.modules[ m ].version != version )
				{
					rebuild = [ 'modules' ];
					break;
				}
			}
		}
		else
		{
			rebuild = [ 'modules' ];
		}
	}
	if ( rebuild )
	{
		for ( var n = 0; n < rebuild.length; n++ )
		{
			var name = rebuild[ n ];
			if ( name.toLowerCase() == 'modules' )
			{
				// Scan the whole folder-> last folder before manifest
				var tree = utilities.getDirectory( options.modulesPath, { recursive: true, filters: [ '*.hjson' ] } );
				var files = utilities.getFileArrayFromTree( tree );
				for ( var f = 0; f < files.length; f++ )
				{
					var parent = files[ f ].parent;
					if ( parent )
						OK &= buildIt( parent.name, true );
				}
				break;
			}
			else
			{
				OK &= buildIt( name, true )
		}
	}
	}
	if ( build )
	{
		for ( var n = 0; n < build.length; n++ )
		{
			var name = build[ n ];
			if ( name.toLowerCase() == 'modules' )
			{
				// Scan the whole folder-> last folder before manifest
				var tree = utilities.getDirectory( options.modulesPath, { recursive: true, filters: [ '*.hjson' ] } );
				var files = utilities.getFileArrayFromTree( tree );				
				for ( var f = 0; f < files.length; f++ )
				{
					var parent = files[ f ].parent;
					if ( parent )
					{
						OK &= buildIt( parent.name, false );
				}
				}
				break;
			}
			else
			{
				OK &= buildIt( name, false )
			}
		}
	}

	// Save the whole module json for quick loading
	if ( built )	
		utilities.saveJSON( options.dataPath + '/modules.json', options.modules );
	
	return OK;
}
function cleanSectionJSON( section )
{
	for ( var i in section.procedures )
	{
		var procedure = section.procedures[ i ];
		procedure.anchors = {};
		procedure.parentSection = {};
		for ( var v = 0; v < procedure.variants.length; v++ )
		{
			procedure.variants[ v ].anchors = {};
			procedure.variants[ v ].parent = null;
			procedure.variants[ v ].parentSection = null;
		}
	}
	for ( var i in section.instructions )
	{
		var instruction = section.instructions[ i ];
		instruction.anchors = {};
		instruction.parentSection = {};
		for ( var v = 0; v < instruction.variants.length; v++ )
		{
			instruction.variants[ v ].anchors = {};
			instruction.variants[ v ].parent = null;
			instruction.variants[ v ].parentSection = null;
		}
	}
	for ( var f in section.functions )
	{
		var func = section.functions[ f ];
		func.anchors = {};
		func.parentSection = {};
		for ( var v = 0; v < func.variants.length; v++ )
		{
			func.variants[ v ].anchors = {};
			func.variants[ v ].parent = null;
			func.variants[ v ].parentSection = null;
		}
	}
	for ( var o in section.objects )
	{
		var obj = section.objects[ o ];
		obj.anchors = {};
		obj.parentSection = {};
		for ( var v = 0; v < obj.variants.length; v++ )
		{
			var variant = obj.variants[ v ];
			variant.anchors = {};
			variant.parent = null;
			variant.parentSection = null;

			for ( m in variant.methods )
			{
				var method = variant.methods[ m ];
				method.anchors = {};
				method.parentSection = method.parentSection.prefix + method.parentSection.name;
				for ( var vv = 0; vv < method.variants.length; vv++ )
				{
					var subVariant = method.variants[ vv ];
					subVariant.anchors = {};
					subVariant.parent = null;
					subVariant.parentSection = subVariant.parentSection.prefix + subVariant.parentSection.name;
				}
			}
		}
	}
}

function loadSystemInformation( options )
{
	options.systemInformation = {};
	/*
	try
	{
		var json = utilities.loadIfExist( options.systemInformationPath, { encoding: 'utf8' } );
		if ( json )
		{
			var data;
			try
			{
				data = JSON.parse( json );
			}
			catch( e ) {}
			options.systemInformation = data.data;
			if ( data.version == version )
				return;
		}
		utilities.numberOfFilesOpen++;
		messages.print( messages.VERBOSE_DEV1, 'updating_system_information', options.systemInformationPath );
		SI.getStaticData( function( data )
		{
			// Save for next time...
			var saveData =
			{
				version: version,
				data: data
			};
			utilities.saveUTF8( options.systemInformationPath, JSON.stringify( saveData ) );
			utilities.numberOfFilesOpen--;
		} );
	}
	catch( e )
	{}
	*/
}

//
// Load the manifest
//
function loadManifest( options, mandatory, defaultType, param )
{
	var path;
	var path2;
	switch ( defaultType )
	{
		case 'aoz':
			if ( param )
				path = options.templatesPath + '/manifest-AOZ-Fullpage.hjson';
			else
				path = options.templatesPath + '/manifest-AOZ.hjson';
			break;
		case 'amiga':
			if ( param )
				path = options.templatesPath + '/manifest-1200-PAL-Fullpage.hjson';
			else
				path = options.templatesPath + '/manifest-1200-PAL.hjson';
			break;
		case 'path':
			path = path.resolve( options.currentPath, param );
			path2 = path.resolve( options.currentPath, '/resources', param );
			break;
			/*
		case 'module':
		case 'extension':
			path = path.resolve( options.sourcePath, '/manifest.hjson' );
			break;
			*/
		default:
			if ( defaultType )
			{
				messages.pushError( { compilerError: 'manifest_not_found', parameter: defaultType } );
				return false;
			}
		else
		{
				var info = utilities.getFileInfo( options.sourcePath );
				if ( info.isDirectory )
				{
					path = info.path + '/manifest.hjson';
					path2 = info.path + '/resources/manifest.hjson';
				}
				else
				{
					var slash = info.path.lastIndexOf( '/' );
					path = info.path.substring( 0, slash ) + '/manifest.hjson';
					path2 = info.path.substring( 0, slash ) + '/resources/manifest.hjson';
				}
			}
			break;
	}
	if ( mandatory && !path )
		throw 'internal_error';

	var json = utilities.loadIfExist( path, { encoding: 'utf8' } );
	if ( !json )
	{
		if ( path2 )
		{
			path = path2;
			json = utilities.loadIfExist( path, { encoding: 'utf8' } );
		}
		if ( !json )
		{
			if ( mandatory )
				messages.pushError( { compilerError: 'manifest_not_found', parameter: path } );
			return false;
		}
	}

	var manifest;
	try
	{
		if ( json )
		{
			json = utilities.fixJson( json );
			manifest = HJSON.parse( json );
		}
	}
	catch( e )
	{
		messages.pushError( { compilerError: 'illegal_manifest', parameters: [ path, e ] } );
		return false;
	}
	messages.print( messages.VERBOSE_DEV1, 'manifest_loaded', path );

	// Compatible version of the manifest?
	if ( !manifest.version || manifest.version < manifestVersion )
	{
		messages.pushError( { compilerError: 'bad_version_of_manifest', parameter: "version found: " + manifest.version + ", should be later than: " + manifestVersion } );
		return false;
	}

	// Poke the new values...
	//////////////////////////////////////////////////////////////////
	if ( manifest.display )
	{
		if ( typeof manifest.display.renderer == 'undefined' )
			manifest.display.renderer = 'canvas';
	}
	if ( !manifest.compilation.includePaths )
		manifest.compilation.includePaths = [];
	return manifest;
};

//
// Copy various resources
//
function copyResources( options )
{
	messages.print( messages.VERBOSE_DEV1, 'copying_resources' );

	var path = options.destinationPath + '/run/resources';
	options.fileSaver.createDirectories( path );

	// The cursor
	var cursorPath = options.manifest.default.screen.window.cursorImage ? options.manifest.default.screen.window.cursorImage : 'resources/cursor.png';
	if ( !utilities.isAbsolutePath( cursorPath ) )
		cursorPath = options.aozPath + '/' + cursorPath;
	cursorPath = PATH.resolve( cursorPath );	
	options.fileSaver.copyAndUnlockImage( path + '/cursor.js', cursorPath, { fileLoader: options.fileLoader_run } );

	// The images for the full-screen button
	if ( options.manifest.display.fullScreenIcon )
	{
		var fullScreenPath = options.manifest.display.fullScreenIconImage;
		if ( !utilities.isAbsolutePath( fullScreenPath ) )
			fullScreenPath = options.aozPath + '/' + fullScreenPath;
		fullScreenPath = PATH.resolve( fullScreenPath );

		var smallScreenPath = options.manifest.display.smallScreenIconImage;
		if ( !utilities.isAbsolutePath( smallScreenPath ) )
			smallScreenPath = options.aozPath + '/' + smallScreenPath;
		smallScreenPath = PATH.resolve( smallScreenPath );

		options.fileSaver.copyAndUnlockImage( path + '/full_screen.js', fullScreenPath, { fileLoader: options.fileLoader_run } );
		options.fileSaver.copyAndUnlockImage( path + '/small_screen.js', smallScreenPath, { fileLoader: options.fileLoader_run } );
	}

	// Copy the filesystem files of the extensions if external
	if ( options.externalFiles )
	{
		var destinationDirectory = options.destinationPath + '/resources/filesystem';
		options.fileSaver.createDirectories( destinationDirectory );
		for ( var e in options.extensions )
		{
			var extension = options.extensions[ e ];
			if ( extension.inUse )
			{
				var sourceDirectory = extension.destinationPath + '/resources/filesystem';
				options.fileSaver.copyDirectory( destinationDirectory, sourceDirectory, { recursive: false, fileLoader: options.fileLoader_extensions } );
			}
		}
		for ( var e in options.modules )
		{
			var module = options.modules[ e ];
			if ( module.inUse )
			{
				var sourceDirectory = module.destinationPath + '/resources/filesystem';
				options.fileSaver.copyDirectory( destinationDirectory, sourceDirectory, { recursive: false, fileLoader: options.fileLoader_modules } );
			}
		}
	}

	// Copy extension resources
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse )
		{
			var sourceDirectory = extension.destinationPath + '/resources';
			var files = options.fileLoader_extensions.findDirectoryFiles( sourceDirectory, { recursive: false, directories: true } );
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				if ( file.name != 'filesystem' && file.name != 'fonts' )
				{
					var destinationDirectory = options.destinationPath + '/resources/' + extension.name;
					options.fileSaver.createDirectories( destinationDirectory );
					options.fileSaver.copyDirectory( destinationDirectory, sourceDirectory, { recursive: true, fileLoader: options.fileLoader_extensions,  } );
				}
			}
		}
	}

	// Copy modules resources
	for ( var e in options.modules )
	{
		var module = options.modules[ e ];
		if ( module.inUse )
		{
			var sourceDirectory = module.destinationPath + '/resources';
			var files = options.fileLoader_modules.findDirectoryFiles( sourceDirectory, { recursive: false, directories: true } );
			for ( var f = 0; f < files.length; f++ )
			{
				var file = files[ f ];
				if ( file.name != 'filesystem' && file.name != 'fonts' )
				{
					var destinationDirectory = options.destinationPath + '/resources/' + module.name;
					options.fileSaver.createDirectories( destinationDirectory );
					options.fileSaver.copyDirectory( destinationDirectory, sourceDirectory, { recursive: true, fileLoader: options.fileLoader_modules  } );
				}
			}
		}
	}
};

//
// Generate index.html file
//
function generateIndex( options )
{
	messages.print( messages.VERBOSE_DEV1, 'generating_index' );

	// Load the proper index.html file
	var indexPath = options.runtimePath + '/index';
	if ( options.manifest.display.fullScreen || options.manifest.display.fullPage )
		indexPath += '_fullscreen';
	indexPath += '.html';
	var index = options.fileLoader_run.getFile( indexPath );
	if ( !index )
	{
		messages.pushError( { error: 'cannot_load_runtime_index', parameter: indexPath } );
		return false;
	}

	// Replace width and height
	index = utilities.replaceStringInText( index, 'CANVASWIDTH', '' + options.manifest.display.width );
	index = utilities.replaceStringInText( index, 'CANVASHEIGHT', '' + options.manifest.display.height );
	index = utilities.replaceStringInText( index, 'APPLICATIONNAME', '' + options.manifest.infos.applicationName );

	// Color of body
	var bodyBackgroundColor = options.manifest.display.bodyBackgroundColor;
	if ( !bodyBackgroundColor )
		bodyBackgroundColor = options.manifest.display.backgroundColor
	index = utilities.replaceStringInText( index, 'BODYCOLOR', '' + bodyBackgroundColor );

	// Image in the back
	var bodyBackgroundImage = '';
	/*
	if ( options.manifest.display.fullScreen || options.manifest.display.fullPage )
	{
		var bodyImagePath = options.manifest.display.bodyBackgroundImage;
		if ( bodyImagePath )
		{
			if ( !utilities.isAbsolutePath( bodyImagePath ) )
				bodyImagePath = options.currentPath + '/' + bodyImagePath;
			bodyImagePath = PATH.resolve( bodyImagePath );
			var imageName = utilities.getFilename( bodyImagePath ) + '.' + utilities.getFileExtension( bodyImagePath );
			var dPath = options.destinationPath + '/run/resources/' + imageName;
			options.fileSaver.copyFile( dPath, bodyImagePath, { fileLoader: options.fileLoader_run } );
			bodyBackgroundImage = '\t\t<div id="bg">\n\t\t\t<img src="./run/resources/' + imageName + '" alt="">\n\t\t</div>\n';
		}
	}
	*/
	index = utilities.replaceStringInText( index, 'BODYIMAGE', bodyBackgroundImage );
	
	// Get flags from extensions
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse )
		{
			for ( var p in extension.addOnFolders )
				options.addOnFolders[ p ] = true;
			for ( var p in extension.addOnPaths )
				options.addOnPaths[ p ] = true;
			for ( var p in extension.needFiles )
				options.needFiles[ p ] = true;
			for ( var p in extension.loadFilesAfter )
				options.loadFilesAfter[ p ] = true;
			options.insertIntoHead = options.insertIntoHead.concat( extension.insertIntoHead );
			options.insertIntoBody = options.insertIntoBody.concat( extension.insertIntoBody );
			options.insertIntoStyle = options.insertIntoStyle.concat( extension.insertIntoStyle );
			options.needServer |= extension.needServer;
			options.useSounds |= extension.useSounds;
			options.baseManifest.bootScreen.waitSounds |= extension.useSounds;
		}
	}

	// Copy flags from modules
	for ( var m in options.modules )
	{
		var module = options.modules[ m ];
		if ( module.inUse )
		{
			for ( var p in module.addOnFolders )
				options.addOnFolders[ p ] = true;
			for ( var p in module.addOnPaths )
				options.addOnPaths[ p ] = true;
			for ( var p in module.needFiles )
				options.needFiles[ p ] = true;
			for ( var p in module.loadFilesAfter )
				options.loadFilesAfter[ p ] = true;
			options.insertIntoHead = options.insertIntoHead.concat( module.insertIntoHead );
			options.insertIntoBody = options.insertIntoBody.concat( module.insertIntoBody );
			options.insertIntoStyle = options.insertIntoStyle.concat( module.insertIntoStyle );
			options.needServer |= module.needServer;
			options.useSounds |= module.useSounds;
			options.baseManifest.bootScreen.waitSounds |= module.useSounds;
		}
	}

	// Copy runtime files and insert them into index.html
	var indexFiles = '';
	var fileLast = '';
	var opts =
	{
		filters: [ '*.js', '*.map' ],
		toCallback:
		[
			{ filter: 'rerrors.js', callback: cbErrors, extra: options, encoding: 'utf8' },
			{ filter: 'raoz.js', callback: cbAOZ, extra: options, encoding: 'utf8'  },
			{ filter: 'rfilesystem_application.js', callback: cbFileSystem_Application, extra: options, encoding: 'utf8' },
			{ filter: 'rfilesystem.js', callback: cbFileSystem, extra: options, encoding: 'utf8' },
			{ filter: 'rbanks.js', callback: cbBanks, extra: options, encoding: 'utf8' },
			{ filter: 'rfonts.js', callback: cbFonts, extra: options, encoding: 'utf8' },
			{ filter: 'rscreen.js', callback: cbScreens, extra: options, encoding: 'utf8' },
			{ filter: 'renderer_*.js', callback: cbRenderer, extra: options, encoding: 'utf8' },
			{ filter: '*.js', callback: cbFile, extra: options, encoding: 'utf8' },
			{ filter: '*.map', callback: cbMap, extra: options, encoding: 'utf8' }
		],
		fileLoader: options.fileLoader_run
	}
	options.fileSaver.copyDirectory( options.destinationPath + '/run', options.libraryPath, opts );

	// Insert extension code
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse && extension.objectSourcePath )
		{
			options.fileSaver.copyFile( options.destinationPath + '/run/' + extension.name + '.js', extension.objectSourcePath, { fileLoader: options.fileLoader_extensions } );
			indexFiles += '\t\t<script src="./run/' + extension.name + '.js"></script>\n';
		}
	}

	// Insert modules code
	for ( var m in options.modules )
	{
		var module = options.modules[ m ];
		if ( module.inUse && module.objectSourcePath )
		{
			options.fileSaver.copyFile( options.destinationPath + '/run/' + module.name + '.js', module.objectSourcePath, { fileLoader: options.fileLoader_modules } );
			indexFiles += '\t\t<script src="./run/' + module.name + '.js"></script>\n';
		}
	}

	// Insert the add-ons
	var bodyPlus = '';
	for ( var name in options.addOnFolders )
	{
		var sourcePath = options.runtimePath + '/' + name;
		options.fileSaver.copyDirectory( options.destinationPath + '/run/' + name, sourcePath, { recursive: true, fileLoader: options.fileLoader_run } );
	}
	for ( var a in options.addOnPaths )
	{
		var sourcePath = options.runtimePath + '/' + a;
		var name = utilities.getFilenameAndExtension( sourcePath );
		options.fileSaver.copyFile( options.destinationPath + '/run/' + name, sourcePath, { fileLoader: options.fileLoader_run } );
		indexFiles += '\t\t<script src="./run/' + name + '"></script>\n';
	}
	for ( var name in options.needFiles )
	{
		var fileName = utilities.getFilenameAndExtension( name );
		var ext = utilities.getFileExtension( name );

		if ( name.toLowerCase().indexOf( 'http://' ) == 0 || name.toLowerCase().indexOf( 'https://' ) == 0 )
		{
			if ( ext.toLowerCase() == 'js' )
				indexFiles += '\t\t<script src="' + name + '"></script>\n';
			if ( ext.toLowerCase() == 'css' )
				indexFiles += '\t\t<link href="' + name + '" rel="stylesheet"></link>\n';
		}
		else
		{
			var sPath = PATH.join( options.runtimePath,  '/' + name );
			var dir = '';
			if ( name.length > fileName.length )
				dir = name.substring( 0, name.length - fileName.length - 1 );
			var dPath = PATH.join( options.destinationPath, '/run/' + dir );
			options.fileSaver.createDirectories( dPath );
			options.fileSaver.copyFile( PATH.join( dPath + '/' + fileName ), sPath, { fileLoader: options.fileLoader_run } );

			if ( ext.toLowerCase() == 'js' )
			{
				indexFiles += '\t\t<script src="./run/' + dir + '/' + fileName + '"></script>\n';
				var info = getMap( name, undefined, options );
				if ( info.source )
					utilities.saveUTF8( info.path, info.source );
			}
			if ( ext.toLowerCase() == 'css' )
				indexFiles += '\t\t<link href="./run/' + dir + '/' + fileName + '" rel="stylesheet"></link>\n';
		}
	}
	var loadFilesAfter = [];
	for ( var name in options.loadFilesAfter )
	{
		var fileName = utilities.getFilenameAndExtension( name );
		var ext = utilities.getFileExtension( name );

		if ( name.toLowerCase().indexOf( 'http://' ) == 0 || name.toLowerCase().indexOf( 'https://' ) == 0 )
		{
			if ( ext.toLowerCase() == 'js' )
				indexFiles += '\t\t<script src="' + name + '"></script>\n';
			if ( ext.toLowerCase() == 'css' )
				indexFiles += '\t\t<link href="' + name + '" rel="stylesheet"></link>\n';
		}
		else
		{
			var sPath = PATH.join( options.runtimePath,  '/' + name );
			var dir = '';
			if ( name.length > fileName.length )
				dir = name.substring( 0, name.length - fileName.length - 1 );
			var dPath = PATH.join( options.destinationPath, '/run/' + dir );
			options.fileSaver.createDirectories( dPath );
			options.fileSaver.copyFile( PATH.join( dPath + '/' + fileName ), sPath, { fileLoader: options.fileLoader_run } );
			loadFilesAfter.push( './run/' + dir + '/' + fileName );
		}
	}

	// Put the list of Javascript files
	indexFiles += fileLast;
	indexFiles += '\t\t<script src="./run/application.js"></script>\n';
	index = utilities.replaceStringInText( index, 'INSERTFILES', indexFiles );

	// Insert into HTML head
	var insert = '';
	for ( var p = 0; p< options.insertIntoHead.length; p++ )
		insert += options.insertIntoHead[ p ] + '\n\t\t';
	index = utilities.replaceStringInText( index, 'INSERT_INTO_HEAD', insert );

	// Insert into HTML body
	insert = '';
	for ( var p = 0; p< options.insertIntoBody.length; p++ )
		insert += options.insertIntoBody[ p ] + '\n\t\t';
	index = utilities.replaceStringInText( index, 'INSERT_INTO_BODY', insert );

	// Insert into HTML CSS STYLE
	insert = '';
	for ( var p = 0; p< options.insertIntoStyle.length; p++ )
		insert += options.insertIntoStyle[ p ] + '\n\t\t';
	index = utilities.replaceStringInText( index, 'INSERT_INTO_STYLE', insert );

	// Check fonts in extensions
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse && extension.fonts.families != '' )
		{
			var start = 0;			
			while ( start < extension.fonts.families.length )
			{
				var end = extension.fonts.families.indexOf( '|', start );
				if ( end < 0 )
					end = extension.fonts.families.length;

				var family = extension.fonts.families.substring( start, end );
				if ( options.fonts.families.indexOf( family ) < 0 )
				{
					var startFace = extension.fonts.faces.indexOf( family );
					startFace = extension.fonts.faces.lastIndexOf( '@font-face', startFace );
					var endFace = extension.fonts.faces.indexOf( '}', startFace );
					var face = extension.fonts.faces.substring( startFace, endFace + 1 );
					var info = banks.importGoogleFont( face, options );
					options.fonts.families += ( options.fonts.families.length > 0 ? '|' : '' ) + info.families;
					options.fonts.faces += info.faces;		
				}
				start = end + 1;
			}
			// Copy fonts into the application directory from the extension build directory
			var fontPath = PATH.join( options.currentPath, extension.objPath, 'resources/fonts/google' );
			var include = options.manifest.fonts.include ? options.manifest.fonts.include : [ '*.woff', '*.woff2' ];
			var opts = { filters: include, fileLoader: options.fileLoader_extensions };
			options.fileSaver.copyDirectory( options.destinationPath + '/resources/fonts/google', fontPath, opts );
		}
	}
	index = utilities.replaceStringInText( index, 'INSERT_GOOGLEFONTS_FACES', options.fonts.faces  );
	var css = options.fonts.families;
	css += ( css.length > 0 ? ',' : '' ) + 'sans-serif;';
	index = utilities.replaceStringInText( index, 'INSERT_GOOGLEFONTS_CSS', 'font-family: ' + css );

	// Save index.html
	if ( !options.needServer )
		options.fileSaver.saveUTF8( options.destinationPath + '/index.html', index );
	else
	{
		options.fileSaver.saveUTF8( options.destinationPath + '/index.html', index );
//		baseOptions.fileSaver.copyFile( baseOptions.destinationPath + '/index.html', baseOptions.runtimePath + '/index_server.html', baseOptions );
	}

	// Overwrite splash screen?
	if ( options.forceSplash )
		options.baseManifest.bootScreen.active = true;
	else 
	{
		if ( options.baseManifest.bootScreen.waitSounds && options.useSounds )
			options.baseManifest.bootScreen.active = true;
		else if ( !options.baseManifest.bootScreen.active )
		 	messages.pushError( { compilerWarning: 'should_wait' } );
	}

	// Put the final manifest into application
	var manifestJson = JSON.stringify( options.baseManifest );
	var code = utilities.replaceStringInText( options.applicationCode, 'MANIFEST', BTOA( manifestJson ) );
	code = utilities.replaceStringInText( code, 'USESOUNDS', options.useSounds ? 'true' : 'false' );
	code = utilities.replaceStringInText( code, 'LOADFILESAFTER', BTOA( JSON.stringify( loadFilesAfter ) ) );

	// Put local tags as base64 into the application
	var localTags = {};
	var globalTags = {};
	for ( var e in options.modules )
	{
		var module = options.modules[ e ];
		if ( module.inUse )
		{
			for ( var p in module.localTags )
				localTags[ p ] = module.localTags[ p ];
			for ( var p in module.globalTags )
				globalTags[ p ] = module.globalTags[ p ];
		}
	}
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse )
		{
			for ( var p in extension.localTags )
				localTags[ p ] = extension.localTags[ p ];
			for ( var p in extension.globalTags )
				globalTags[ p ] = extension.globalTags[ p ];
		}
	}
	code = utilities.replaceStringInText( code, 'LOCALTAGS', BTOA( JSON.stringify( localTags ) ) );
	code = utilities.replaceStringInText( code, 'GLOBALTAGS', BTOA( JSON.stringify( globalTags ) ) );
	options.fileSaver.saveUTF8( options.destinationPath + '/run/application.js', code );

	// Write transpiler version
	options.fileSaver.saveUTF8( options.destinationPath + '/run/transpiler-version', '' + options.version );

	// No error
	return true;

	function cbErrors( response, data, opts )
	{
		var errors = data.source;

		// Gather all error lists
		var lists = messages.getErrorList();
		for ( var e in opts.modules )
		{
			var module = opts.modules[ e ];
			if ( module.inUse && module.manifest.compilation.errors )
			{
				addErrorLists( module.manifest.compilation.errors )
			}
		}
		for ( var e in opts.extensions )
		{
			var extension = opts.extensions[ e ];
			if ( extension.inUse && extension.manifest.compilation.errors )
			{
				addErrorLists( extension.manifest.compilation.errors )
			}
		}

		// Create code
		var code = 'List of errors\n\tthis.errors=\n\t{\n';
		for ( var language in lists )
		{
			var list = lists[ language ];
			code += '\t\t' + language + ':\n\t\t[\n';
			for ( var l = 0; l < list.length; l++ )
			{
				var pos = list[ l ].indexOf( ':' );
				if ( pos >= 0 )
				{
					var start = pos + 1;
					while( list[ l ].charCodeAt( start ) <= 32 )
						start++;
					code += '\t\t\t"' + list[ l ].substring( 0, pos + 1 ) + list[ l ].substring( start ) + '"';
				}
				else
				{
					code += '\t\t\t""';
				}
				if ( l < list.length - 1 )
					code += ',';
				code += '\n';
			}
			code += '\t\t],\n';
		}
		code += '\t};'
		errors = utilities.replaceStringInText( errors, '<ERRORS-INSERT>', code );
		indexFiles += '\t\t<script src="' + './run/rerrors.js"></script>\n';
		return errors;

		function addErrorLists( newLists )
		{
			for ( var language in newLists )
			{
				var newList = newLists[ language ];
				var foundList = lists[ language.toLowerCase() ];
				if ( !foundList )
				{
					lists[ language.toLowerCase() ] = newList;
				}
				else
				{
					for ( var e = 0; e < newList.length; e++ )
					{
						var index = newList[ e ].indexOf( ':' );
						if ( index > 0 )
						{
							index = newList[ e ].substring( 0, index + 1 );
							var found = foundList.find( function( element )
							{
								return element.indexOf( index ) == 0;
							} );
							if ( found )
								messages.pushError( { compilerWarning: 'duplicate_error_message', parameter: index } );
							else
								foundList.push( newList[ e ] );
						}
						else
						{
							messages.pushError( { compilerError: 'illegal_error_message', parameter: index } );
						}
					}
				}
			}
		}
	};
	function cbAOZ( response, data, opts )
	{
		var code = utilities.replaceStringInText( data.source, '@key@', '' + opts.iAjOkZ );
		fileLast += '\t\t<script src="' + './run/raoz.js"></script>\n';
		return code;
	};
	function cbScreens( response, data, opts )
	{
		var insert = '';
		for ( var e in opts.extensions )
		{
			var extension = opts.extensions[ e ];
			if ( extension.inUse )
			{
				insert += 'this.bobsContext.addContext("' + extension.name + '");\n';
			}
		}
		for ( var e in opts.modules )
		{
			var module = opts.modules[ e ];
			if ( module.inUse )
			{
				insert += 'this.bobsContext.addContext("' + module.name + '");\n';
			}
		}
		code = utilities.replaceStringInText( data.source, 'INSERT_EXTENSIONCONTEXT', insert );
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return code;
	};
	function cbBanks( response, data, opts )
	{
		// Explore the banks
		var code = '';
		var preCodeTodo = {};
		var preCodeTodoQuick = {};
		for ( var e in opts.extensions )
		{
			var extension = opts.extensions[ e ];
			if ( extension.inUse )
			{
				for ( var b in extension.banks )
				{
					var bank = extension.banks[ b ];
					if ( bank.type != '__assets__' )
					{
						preCodeTodo[ b ] = true;
						preCodeTodoQuick[ extension.name ] = true;
						code += getBank( extension.banks[ b ], b, e );
					}
					else
					{
						var destPath = opts.destinationPath + '/resources/' + bank.name;
						options.fileSaver.createDirectories( destPath );
						options.fileSaver.copyDirectory( destPath, bank.path, { fileLoader: options.fileLoader, recursive: true } );
					}
				}
			}
		}
		for ( var e in opts.modules )
		{
			var module = opts.modules[ e ];
			if ( module.inUse )
			{
				for ( var b in module.banks )
				{
					var bank = module.banks[ b ];
					if ( bank.type != '__assets__' )
					{
						preCodeTodo[ b ] = true;
						preCodeTodoQuick[ module.name ] = true;
						code += getBank( bank, b, e );
					}
					else
					{
						var destPath = opts.destinationPath + '/resources/' + bank.name;
						options.fileSaver.createDirectories( destPath );
						options.fileSaver.copyDirectory( destPath, bank.path, { fileLoader: options.fileLoader, recursive: true } );
					}
				}
			}
		}

		// Create default image, icon, sounds bank.
		var paletteString = '';
		for ( var c = 0; c < opts.manifest.default.screen.palette.length; c++ )
			paletteString += '"' + opts.manifest.default.screen.palette[ c ] + '",';
		for ( var b in opts.banks )
		{
			preCodeTodo[ b ] = true;
			preCodeTodoQuick[ 'application' ] = true;
			code += getBank( opts.banks[ b ], b, 'application' );
		}

		// Add an empty image bank
		if ( !opts.banks[ 1 ] )
		{
			code += '\tthis.banks[ 1 ][ "application" ] = new ImageBank( this.aoz, [], [], [ ' + paletteString + ' ], { hotSpots: [], alpha: false, masks: "", domain: "images", type: "images" } );\n';
			preCodeTodo[ 1 ] = true;
			preCodeTodoQuick[ 'application' ] = true;
		}
		if ( !opts.banks[ 2 ] )
		{
			code += '\tthis.banks[ 2 ][ "application" ] = new TDBank( this.aoz, [], [], { domain: "3D", type: "3D" } );\n';
			preCodeTodo[ 2 ] = true;
			preCodeTodoQuick[ 'application' ] = true;
		}

		// Generates header code
		var preCode = '';
		for ( var b in preCodeTodo )
			preCode += '\tthis.banks[ ' + b + ' ] = {};\n';
		for ( var b in preCodeTodoQuick )
			preCode += '\tthis.quickBanks[ "' + b + '" ] = {};\n';

		// Inserts
		var source = utilities.replaceStringInText( data.source, 'INSERT_CODE', preCode + code );
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return source;

		function getBank( bank, number, domain )
		{
			if ( bank.type == '__assets__' )
				return "";
			if ( bank.type == 'samples' && domain == 'application' )
			{
				if ( !isInUse( 'sounds' ) )
					return "";
			}
			switch ( bank.type )
			{
				case 'images':
				case 'icons':
					return "\tthis.banks[ " + number + " ][ '" + domain + "' ] = new ImageBank( this.aoz, [" + bank.code + "], [" + bank.types + "], [ " + bank.palette + " ], { hotSpots: [" + bank.hotSpots + "], masks: '" + JSON.stringify( bank.masks ) + "', alpha: " + bank.alpha + ", domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
				case 'samples':
					return "\tthis.banks[ " + number + " ][ '" + domain + "' ] = new SampleBank( this.aoz, [" + bank.code + "], [" + bank.types + "], { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
				case '3D':
					return "\tthis.banks[ " + number + " ][ '" + domain + "' ] = new TDBank( this.aoz, [" + bank.code + "], [" + bank.types + "], { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
				default:
					return "\tthis.banks[ " + number + " ][ '" + domain + "' ] = new DataBank( this.aoz, [" + bank.code + "], 0, { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
			}
		}
		function isInUse( name )
		{
			for ( var m in opts.modules )
			{
				if ( ( opts.modules[ m ].inUse || opts.modules[ m ].forceInclude ) && opts.modules[ m ].shortName == name )
					return true;
			}
			for ( var e in opts.extensions )
			{
				if ( ( opts.extensions[ e ].inUse || opts.extensions[ e ].forceInclude ) && opts.extensions[ e ].shortName == name )
					return true;
			}
			return false;
		}
	};
	function cbFileSystem_Application( response, data, opts )
	{
		var code = opts.fileSystemTree;
		/* TODO!
		for ( var e in baseOptions.extensions )
		{
			var extension = baseOptions.extensions[ e ];
			if ( extension.inUse )
				code += extension.fileSystemTree;
		}
		*/
		code = utilities.removeLastComma( code );
		source = utilities.replaceStringInText( data.source, 'INSERT_EXTERNALFILES', opts.externalFiles );
		source = utilities.replaceStringInText( source, 'INSERT_TREE', code );
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return source;
	};
	function cbFileSystem( response, data, opts )
	{
		var code = '';
		for ( var name in opts.filesToAddToFilesystem )
		{
			if ( name == 'application' )
			{
				var file = opts.filesToAddToFilesystem[ name ];
				var infos = utilities.splitPath( file.cleanPath );
				code += "{ className: 'Filesystem_Application', token: '" + infos.drive.toLowerCase() + "' },\n";
			}
		}
		source = utilities.replaceStringInText( data.source, 'INSERT_DRIVESTOADD', code );
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return source;
	};
	function cbFonts( response, data, opts )
	{
		var windowFont = opts.manifest.default.screen.window.font;
		var code = '\tthis.setWindowFont( "' + windowFont.name + '","' + windowFont.type + '",'  + windowFont.height + ',"' + ( windowFont.weight ? windowFont.weight : 'normal' ) + '","' + ( windowFont.italic ? windowFont.italic : 'normal' ) + '","' + ( windowFont.stretch ? windowFont.stretch : 'normal' ) + '","' + ( windowFont.tags ? + windowFont.tags : '' ) + '","application");\n';
 		code += '\tthis.getFonts([' + utilities.removeLastComma( opts.fonts.googleList ) + '],[' + utilities.removeLastComma( opts.fonts.amigaList ) + '],"application");\n';
		for ( var e in opts.extensions )
		{
			var extension = opts.extensions[ e ];
			if ( extension.inUse )
			{
				code += '\tthis.getFonts([' + utilities.removeLastComma( extension.fonts.googleList ) + '],[' + utilities.removeLastComma( extension.fonts.amigaList ) + '],"' + e + '")\n';
			}
		}
		var source = utilities.replaceStringInText( data.source, 'INSERT_CODE', code );
		source = utilities.replaceStringInText( source, 'INSERT_GOOGLEFONTS', opts.fonts.google );
		source = utilities.replaceStringInText( source, 'INSERT_AMIGAFONTS', opts.fonts.amiga );
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return source;
	};
	function cbRenderer( response, data, opts )
	{
		var name = utilities.getFilename( data.path );
		var pos = name.indexOf( '_' );
		name = name.substring( pos + 1 );
		if ( name != opts.manifest.display.renderer )
		{
			return null;
		}
		pos = data.source.indexOf( '//#' );
		while ( pos >= 0 )
		{
			var end = utilities.findEndOfLine( data.source, pos );
			var line = data.source.substring( pos, end );
			if ( utilities.isTag( line, [ 'need_javascript_file' ] ) )
			{
				var file =  utilities.getTagParameter( line, 'need_javascript_file' );
				opts.needFiles[ file ] = true;
			}
			pos = data.source.indexOf( '//#', end );
		}
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return data.source;
	};
	function cbFile( response, data, extra )
	{
		indexFiles += '\t\t<script src="' + './run/' + utilities.getFilename( data.path ) + '.js"></script>\n';
		return data.source;
	};
	function cbMap( response, data, extra )
	{
		var map = getMap( data.destinationPath, data.source, options );
		return map.source;
	};
};
function getMap( path, source, options )
{
	var result = {};
	if ( options.developperMode )
	{
		if ( !source )
		{
			var sPath = options.runtimePath + '/' + path + '.map';
			source = utilities.loadIfExist( sPath, { encoding: 'utf8' } );
			if ( !source )
				messages.print( messages.VERBOSE_DEV2, 'map_not_found', sPath );
			result.path = './' + path + '.map';
		}
		else
		{
			result.path = PATH.relative( options.destinationPath + '/run', path );
		}
		if ( source )
		{
			try
			{
				json = JSON.parse( source );
			}
			catch ( e ) {}
			if ( json )
			{
				for ( var p = 0; p < json.sources.length; p++ )
				{
					var filename = utilities.getFilenameAndExtension( json.sources[ p ] );
					json.sources[ p ] = path + '/' + filename;
				}
				result.source = JSON.stringify( json );	
			}
		}
	}
	return result;
}
