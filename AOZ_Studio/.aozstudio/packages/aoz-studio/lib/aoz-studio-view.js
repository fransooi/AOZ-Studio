const { CompositeDisposable, Emitter } = require( 'atom' );
const { remote, BrowserWindow } = require( 'electron' );
//const marked = require( 'marked');
const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );
const EXEC = require( 'child_process' );
const JSZIP = require( 'jszip' );
const REMOTE = require( 'electron' ).remote;
const app = require( 'electron' ).app;
const AOZSERVER = require( './aoz-server.js' );
const HJSON = require( 'hjson' );
const LIVESERVER = require( 'live-server' );
const FROMENTRIES = require( 'object.fromentries' );
const REQUEST = require( 'request' );

const PANELS = require( './ui/panels' );
//const SPLASH = require( './ui/splash' );
const AOZVIEWER = require( './ui/aoz-viewer' );
const AOZSETTINGS = require( './ui/aoz-settings' );
const AOZDESIGNER = require( './ui/aoz-designer' );
const AOZDOCS = require( './ui/aoz-documentation' );
const WAITMESSAGEPANEL = require( './ui/waitmessage-panel' );
const CONSOLEPANEL = require( './ui/console-panel' );
const AOZDIALOG = require( './ui/aoz-dialog' );
const AOZIO = require( './aoz-io' );
const AOZConfig = require( './aoz-config' );
const AOZAccessories = require( './ui/aoz-accessories' );
const AOZRequester = require( './ui/aoz-requester' );
const AOZDocTree = require( './ui/doc/aoz-doctree' );
const AOZThemeManager = require( './ui/aoz-theme-manager' );
const AOZUpdater = require( './updater/aoz-updater' );
const AOZMarkdownReader = require( './aoz-md-reader' );
// Used to ftp application files to ftp server
var FtpDeploy = require( 'ftp-deploy' );
const { substring } = require( 'hjson/lib/hjson-version' );
const ATOMApi = require( './ui/aoz-api' );
const AOZCert = require( './aoz-cert.js' );
const AOZSearchbar = require( './ui/searchbar/aoz-searchbar' );
const AOZIcons = require( './ui/aoz-icons' );
const AOZNotifier = require( './ui/notifier/aoz-notifier' );
const PS = require( 'ps-node' );
const PROCESSWINDOWS = require( 'node-process-windows' );
const SystemAPI = require( './system-api' );
const AOZToolBar = require( './ui/tool-bar/lib/tool-bar' );
const AOZLang = require( './lang/lib/aoz-lang' );
//const AOZTutor = require( './aoz-tutor/lib/aoz-tutor' );
const UTILITIES = require( './transpiler/utilities' );
const TRANSPILER = require( './transpiler/transpiler' );
const EDITOR_SDK = require( './sdk/editor_sdk.js' );
const AOZipUtils = require( './utils/aozip.utils.js' );
const AMOSUtils = require( './utils/amos.utils.js' );
const AOZ3DEditor = require( './ui/aoz-3d-editor' );
const { PassThrough } = require('stream');

const removeFilePart = dirname => PATH.parse(dirname).dir;


var dirSep = PATH.sep;
var packagePath, atomPath;
var errorPosition = 0;
var warningPosition = 0;
var lastError = null;
var errorScanDirection = 0;
var lastBuildPath = '';
var buildMessages = {};
var busy = false;
var subscriptions = null;
var installInformation, userInformation, guideMap;
var serverON = false;
var tvBlocked = false;
var deploying = false;
var wsOpen = false;
var wsConnected = false;
var tasksToHandle = undefined;
var tasksToHandlePile = [];
var servingPath;

// Phil - Temp variables - not required when sending params with IDE Send Command
var publishApplicationPath = '';
var publishApplicationZip = '';

var thumbsUpURLs =
[
	'https://media.giphy.com/media/9Ai5dIk8xvBm0/giphy.gif',
	'https://media.giphy.com/media/NQSZ1MVGLKuGibvJzv/giphy.gif',
	'https://media.giphy.com/media/3o7TKw10v2AxVMe1SU/giphy.gif',
	'https://media.giphy.com/media/1RtKPYwJJYlyw/giphy.gif',
	'https://media.giphy.com/media/U1VCIChfyEJV2dolBV/giphy.gif',
	'https://media.giphy.com/media/d3MLEZoYiWR0J2TK/giphy.gif',
	'https://media.giphy.com/media/l0MYKDrj6SXHz8YYU/giphy.gif',
];
var thumbsDownURLs =
[
	'https://media.giphy.com/media/M11UVCRrc0LUk/giphy.gif',
	'https://media.giphy.com/media/j4rPM934CLIvC/giphy.gif',
	'https://media.giphy.com/media/3XEgV9kfwLy1i/giphy.gif',
	'https://media.giphy.com/media/uprwwjptZW4Za/giphy.gif',
	'https://media.giphy.com/media/l378BaFZ8AUJ20NvW/giphy.gif',
	'https://media.giphy.com/media/3oz8xA07HKwLlpPUkM/giphy.gif',
	'https://media.giphy.com/media/xT9IgqbbD03Vx9y4wg/giphy.gif',
];
var publishingURLs =
[
	'https://media.giphy.com/media/3o7buijTqhjxjbEqjK/giphy.gif',
	'https://media.giphy.com/media/3ov9k1173PdfJWRsoE/giphy.gif',
	'https://media.giphy.com/media/xTk9ZYl3z6MYq6XmXm/giphy.gif',
	'https://media.giphy.com/media/7JTm7ELtTh9iiFu9ec/giphy.gif',
	'https://media.giphy.com/media/8PEbUBEwxktyNeqVZ4/giphy.gif',
	'https://media.giphy.com/media/xUPGcrbOuHlfX29kNq/giphy.gif',
	'https://media.giphy.com/media/3oxHQe7XqxizC9e5by/giphy.gif',
];
var buttonToMouse =
{
	0: 0x0001,
	1: 0x0004,
	2: 0x0002
};

var appsToRecompile =
[
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' + PATH.sep + 'newapp' + PATH.sep + 'main.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' + PATH.sep + 'AOZ Link' + PATH.sep + 'AOZ Link.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' + PATH.sep + 'designer' + PATH.sep + 'main.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' + PATH.sep + 'bot_simulator' + PATH.sep + 'bot_simulator.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'Accessories' + PATH.sep + 'AOZ Tools' + PATH.sep + 'fontviewer' + PATH.sep + 'main.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'Accessories' + PATH.sep + 'AOZ Tools' + PATH.sep + 'keyboard_tester' + PATH.sep + 'keyboard.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'Accessories' + PATH.sep + 'AOZ Tools' + PATH.sep + 'joystick_tester' + PATH.sep + 'joystick.aoz',
	'%COMMONPATH%' + PATH.sep + 'app' + PATH.sep + 'Accessories' + PATH.sep + 'AOZ Tools' + PATH.sep + 'ascii_viewer' + PATH.sep + 'ascii-viewer.aoz'
];
var KeyStream;
var thisSelf;

var panels = new PANELS();

var consolePanel = undefined;
var aozviewer = undefined;
var aoz_settings_panel = undefined;
var aoz_docs = undefined;
var waitmessagePanel = undefined;
var aozRequester = undefined;
var aozDesigner = undefined;

module.exports = class AOZView
{
	constructor()
	{
		atom.currentWindow = REMOTE.getCurrentWindow();
		atom.systemAPI = SystemAPI;
		atom.editorSDK = EDITOR_SDK;
		atom.AOZipUtils = AOZipUtils;
		atom.AMOSUtils = AMOSUtils;
		atom.debug = false;
		atom.transpileMode = 2; 				// 1=server, 2=executable
		//atom.aozTutor = new AOZTutor();
		atom.AOZ3DEditor = AOZ3DEditor;
		atom.panels = panels;
		
		atom.currentModule = undefined;
		process.on( 'unhandledRejection', function( error, promise )
        {
			if( atom.currentModule != undefined && atom.currentModule.handle != undefined )
			{
				atom.currentModule.handle();
			}
        } );

		// Path separator
		atom.sep = PATH.sep;
		var self = this;
		AOZConfig.initApplication();
		atom.aozConfig = AOZConfig;

		atom.themeManager = new AOZThemeManager();
		atom.themeManager.updateTheme();

		atom.aozLang = new AOZLang();
	
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.displayCustom = function()
			{
				alert( atom.aozLang.getTerm( 'customizer:message' ) );
				process.exit( 1 );
			}
			atom.spriteCustomizer.updateCustomization();
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			process.exit( 1 );			
		}

		if( atom.aozConfig.aoz_settings.developperMode )
		{
			document.title = "[DEVELOPER MODE] " + document.title;
		}
		
		atom.aozToolBar = new AOZToolBar(); 
		atom.searchBar = new AOZSearchbar();
		atom.panels = panels;

		atom.waitmessagePanel = waitmessagePanel;

		var rootPath = REMOTE.app.getAppPath();
		var dirSep = PATH.sep;
		var test = rootPath.indexOf( '.app' + dirSep + 'Contents' );
		if( test == -1 )
		{
			// Windows
			rootPath = PATH.normalize( rootPath + dirSep + '..' + dirSep + '..' + dirSep + '..' + dirSep + '..' + dirSep + '..' );
		}
		else
		{
			// Mac OS
			rootPath = PATH.normalize( rootPath + dirSep + '..' + dirSep + '..' + dirSep + '..' + dirSep + '..' + dirSep + '..' + dirSep + '..' );
		}

		if( FS.existsSync( rootPath + dirSep + 'aoz' + dirSep + 'IDE' + dirSep + '.atom' + dirSep + 'storage' + dirSep + 'application.json' ) )
		{
			FS.unlinkSync( rootPath + dirSep + 'aoz' + dirSep + 'IDE' + dirSep + '.atom' + dirSep + 'storage' + dirSep + 'application.json' );
		}

		var win = REMOTE.getCurrentWindow();
		win.onbeforeunload = (e) =>
		{
			e.returnValue = false;
			TRANSPILER.clean();
			if( process.platform == "win32" )
			{
				atom.editorSDK.shell.shellExecute( { cmd: 'taskkill /F /IM transpiler.exe' } );
				atom.editorSDK.shell.shellExecute( { cmd: 'taskkill /F /IM aozstudio.exe' } );
			}

			if( process.platform == "darwin" )
			{
				atom.editorSDK.shell.shellExecute( { cmd: 'killall transpiler' } );
				atom.editorSDK.shell.shellExecute( { cmd: 'killall aozstudio' } );
			}

			if( process.platform == "linux" )
			{
				atom.editorSDK.shell.shellExecute( { cmd: 'killall -9 transpiler' } );
				atom.editorSDK.shell.shellExecute( { cmd: 'killall -9 aozstudio' } );
			}
		};
		
		// Initialize AOZ Transpiler
		atom.transpilerVersion = 0;
		atom.TRANSPILER = TRANSPILER;
		setTimeout( function()
		{
			TRANSPILER.init( {}, function( response, data, extra )
			{				
				if ( response )		
				{
					atom.transpilerVersion = data.version;
					TRANSPILER.warmInit( {}, function( response, data, extra ) 
					{
						if ( !response )
						{
							alert( 'Error while warm-initializing transpiler ' + data );
						}
					} )
				}
				else
				{
					alert( 'Error while initializing transpiler ' + data );
				}
			} );	
		}, 5000 );
		
		var css = document.createElement( 'style' )
		css.innerHTML += 'ul .background-message .centered { display: none; }';
		css.innerHTML += '.item-views {	position: absolute; top: 0px; height: calc(100% - 31px); left: 0px; right: 0px; }';		
		document.body.appendChild( css );		
		
		AOZIcons.installHandlers();
		atom.aozDialog = new AOZDIALOG( panels );
		consolePanel = new CONSOLEPANEL( panels );
		consolePanel.module = this;
		aozviewer = new AOZVIEWER( panels );
		aoz_settings_panel = undefined;
		aoz_docs = new AOZDOCS( panels );
		waitmessagePanel = new WAITMESSAGEPANEL( panels );
		aozDesigner = new AOZDESIGNER( panels );
		aozRequester = new AOZRequester( panels );

		atom.AOZIO = AOZIO;
		atom.waitmessagePanel = waitmessagePanel;
		atom.aozStudioView = this;
		atom.aozRequester = aozRequester;
		atom.panels = panels;
		atom.transpilerBusy = false;
		atom.aozAPI = new ATOMApi( this );
		atom.aozViewer = aozviewer;
		atom.aozDesigner = aozDesigner;
		atom.docTree = new AOZDocTree();
		atom.aozUpdater = new AOZUpdater();
		atom.aozNotifier = new AOZNotifier();

		atom.lastCursorPos = undefined;
		atom.colorPickerAlreadyOpen = false;
		atom.aozLang.updateMenus();

		atom.alert = function( message, keepMask, callback )
		{
			atom.aozToolBar.closePopups();
			if( atom.aozViewer.panel.style.display == 'block' )
			{
				window.alert( message );
			}
			else
			{
				atom.aozDialog.showDialog( message, 'alert', 0, keepMask, callback );
			}
		};

		atom.nalert = function( message, keepMask, callback )
		{
			atom.aozToolBar.closePopups();
			atom.aozDialog.showDialog( message, 'alert', undefined, keepMask, callback );
		};

		atom.warn = function( message, keepMask, callback )
		{
			atom.aozToolBar.closePopups();
			atom.aozDialog.showDialog( message, 'alert', 2, keepMask, callback );
		};

		atom.confirm = function( message, keepMask, callback )
		{
			atom.aozToolBar.closePopups();
			atom.aozDialog.showDialog( message, 'confirm', 3, keepMask, callback );
		};

		aoz_settings_panel = new AOZSETTINGS( panels, atom.aozConfig );
		atom.aozSettingsPanel = aoz_settings_panel;
		atom.project.onDidChangeFiles( events => {
			atom.aozToolBar.closePopups();
			atom.aozConfig.savePaths();
		});

		atom.commands.onWillDispatch( function( event )
		{
			atom.aozToolBar.closePopups();
			atom.aozConfig.savePaths();
			atom.aozConfig.updateFiles();
			if( event.type == 'tree-view:remove' )
			{
				var path = event.target.dataset;
				var message = "";
				if( event.target.classList.contains( 'icon-file-directory' ) )
				{
					message = atom.aozLang.getTerm( 'dialog:folder' ) + ' \n"' + path.name + '"\n';
				}
				else
				{
					message = atom.aozLang.getTerm( 'dialog:folder' ) + ' \n"' + path.name + '"\n';
				}

				atom.confirm( message  + ' ' + atom.aozLang.getTerm( 'dialog:prompt-delete' ), false, function (response )
				{
					if( response )
					{
						if( event.target && event.target.dataset != undefined && event.target.dataset.path != undefined )
						{
							if( atom.AOZIO.isDirectory( event.target.dataset.path ) )
							{
								atom.AOZIO.deleteDirectory( event.target.dataset.path, { recursive: true, keepRoot: false } );
							}
							else
							{
								atom.AOZIO.deleteFile( event.target.dataset.path );
							}
						}
					}
				} );

				atom.aozConfig.savePaths();
				atom.aozConfig.updateFiles();
				event.stopPropagation();
				if( atom && atom.aozConfig )
				{
					setTimeout( function()
					{
						AOZIcons.updateProjectIcons( atom.aozConfig );
					}, 1000 );
				}
				return;
			}

			if( event.type == 'tree-view:reveal-active-file' || event.type == 'core:confirm' )
			{
				event.preventDefault();
				setTimeout( function()
				{
					AOZIcons.updateProjectIcons( atom.aozConfig );
					atom.aozConfig.savePaths();
					atom.aozConfig.updateFiles();
				}, 100 );
				return;
			}
		}
		);

		// Create HTML
		this.elements = {};
		this.rootElement = document.createElement( 'div' );
		this.rootElement.classList.add( 'aoz-studio' );
		this.rootElement.setAttribute( 'width', '100%');
		this.rootElement.setAttribute( 'height', '100%');
		this.rootElement.setAttribute( 'style', 'width:100%; overflow:auto;');

		this.warnErrorStatus = document.createElement( 'div' );
		this.warnErrorStatus.setAttribute( 'class', 'warn_error' );
		this.warnErrorStatus.addEventListener( 'click', function( event )
		{
			event.preventDefault();
			atom.aozStudioView.showMessagesList();
		}, false );
		
		this.warnErrorStatus.innerHTML = '<img src="' + atom.ICONS.WARN_STATUS_ICON + '"></img> 0, <img src="' + atom.ICONS.ERROR_STATUS_ICON + '"></img> 0';
		var staElm = document.querySelector( '.status-bar-left' );
		staElm.insertBefore( this.warnErrorStatus, document.querySelector( 'status-bar-file' ) ); 

		this.buildStatus = document.createElement( 'div' );
		this.buildStatus.setAttribute( 'class', 'warn_error' );
		this.buildStatus.innerHTML = '<img src="' + atom.ICONS.BUILD_STATUS_ICON + '">' + atom.aozLang.getTerm( 'transpiler:build-language' ) + '</img>';
		staElm.insertBefore( this.buildStatus, this.warnErrorStatus );		

		atom.transpilerProcess = "prepare";
		this.handleTranspilerBusy();

		// Transpiler messages
		this.message = consolePanel.message;
		document.body.appendChild( consolePanel.panel );

		if( !atom.aozConfig.aoz_settings.autoupdate )
		{
			atom.aozUpdater = new AOZUpdater();
		}

		var self = this;
		window.addEventListener( 'resize', function( event )
		{
			atom.aozToolBar.closePopups();
			self.updateElements();
		}, false );

		// Get the coordinates of the mouse and make it available to anyone...
		atom.aoz_xMouse = 0;
		atom.aoz_yMouse = 0;
		atom.aoz_mouseKeys = 0;
		window.addEventListener( 'mousemove', function( event )
		{
			atom.aoz_xMouse = event.clientX;
			atom.aoz_yMouse = event.clientY;
		}, false );
		window.addEventListener( 'mousedown', function( event )
		{
			atom.aoz_mouseKeys |= buttonToMouse[ event.button ];
		}, false );
		window.addEventListener( 'mouseup', function( event )
		{
			atom.aoz_mouseKeys &= ~buttonToMouse[ event.button ];
		}, false );

		// Subscriptions
		subscriptions = new CompositeDisposable();
		var thisSelf = this;
	    subscriptions.add
		(
			atom.commands.add( 'atom-workspace', { 'aoz-studio:toggle': () => this.toggle() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:new-file': () => this.new_file() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:load-file': () => this.load_file() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:save-file': () => this.save_file() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aozip-package': () => this.save_aozip() } ),			
			atom.commands.add( 'atom-workspace', { 'aoz-studio:update-theme': () => atom.themeManager.updateTheme() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:update-ide': () => this.updateIDE() } ),
			// Run Browser
			atom.commands.add( 'atom-workspace', { 'aoz-studio:run-browser': () => this.buildCurrentApplication( { output: true, runIn: 'browser', tags: {  } } ) } ),
			// Run AOZ Viewer
			atom.commands.add( 'atom-workspace', { 'aoz-studio:run-atom': () => this.buildCurrentApplication( { output: true, runIn: 'atom', tags: { forceFullScreen: true, debugging: true } } ) } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:run-atom-devtools': () => this.buildCurrentApplication( { output: true, runIn: 'atom-devtools', tags: { forceFullScreen: true, debugging: true } } ) } ),
			// Run AOZ Debugger
			atom.commands.add( 'atom-workspace', { 'aoz-studio:run-debugger': () => this.buildCurrentApplication( { output: true, runIn: 'debugger', tags: { forceFullScreen: true, debugging: true } } ) } ),
			// 3D Scene Editor
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-3d-editor': () => this.show3DEditor() } ),	
			// TEST
			atom.commands.add( 'atom-workspace', { 'aoz-studio:test': () => this.buildCurrentApplication( { output: true, runIn: 'test', tags: { forceFullScreen: true } } ) } ),
			// Direct Mode
			atom.commands.add( 'atom-workspace', { 'aoz-studio:direct-mode': () => this.buildCurrentApplication( { output: true, runIn: 'atom', tags: { forceFullScreen: true, debugging: true, gotoDirectMode: true } } ) } ),
			// INDENT
			atom.commands.add( 'atom-workspace', { 'aoz-studio:indent': () => this.indentCurrentApplication( {} ) } ),

			atom.commands.add( 'atom-workspace', { 'aoz-studio:help': () => this.help() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:pressEscape': () => this.pressEscape() } ),

			atom.workspace.observeTextEditors( function( editor )
			{
				atom.aozToolBar.closePopups();
				if( editor )
				{
					editor.onDidDestroy( function()
					{
						setTimeout( function()
						{
							atom.aozConfig.updateFiles();
						}, 100 );
					} );

					editor.onDidChangeTitle( function()
					{
						setTimeout( function()
						{
							atom.aozConfig.updateFiles();
						}, 100 );
					} );
				}
			} ),

			atom.workspace.onDidChangeActiveTextEditor( function( editor )
			{
				atom.aozToolBar.closePopups();
				if ( editor )
				{
					if( editor.element && editor.buffer && editor.buffer.file && editor.buffer.file != null )
					{
						if( PATH.extname( editor.getPath() ) != '.aozacclnk' )
						{
							if( editor.projectPath == undefined || editor.projectPath == '' )
							{	
								if( PATH.extname( editor.getPath() ).toLowerCase() != '.aoz' && PATH.extname( editor.getPath() ).toLowerCase() != '.aozip' && PATH.extname( editor.getPath() ).toLowerCase() != '.amos' )
								{
									editor.projectPath = SystemAPI.getAOZFilename( PATH.dirname( editor.buffer.file.path ), 0, true );
								}
								else
								{
									editor.projectPath = editor.getPath();
								}
							}
						}
						
						editor.element.addEventListener( 'click', function( event )
						{
							if( atom.lastCursorPos == undefined )
							{
								atom.lastCursorPos = editor.getCursorScreenPosition();
								atom.colorPickerAlreadyOpen = false
							}


							if( atom.lastCursorPos.row != editor.getCursorScreenPosition().row || atom.lastCursorPos.column != editor.getCursorScreenPosition().column )
							{
								atom.lastCursorPos = editor.getCursorScreenPosition();
								atom.colorPickerAlreadyOpen = false
							}

							if( !atom.colorPickerAlreadyOpen )
							{
								atom.aozAPI.getCurrentTokenInfo( {},undefined, editor.element );
								atom.colorPickerAlreadyOpen = true;
							}

						}, false );
						
						if( atom.lineError )
						{
							self.showLineWithMessage( atom.lineError.message );
						}
					}
				}
			} ),

			atom.workspace.observeActiveTextEditor( function( editor )
			{
				atom.aozToolBar.closePopups();
				atom.lastCursorPos = undefined;
				if ( editor )
				{
					if( editor.element && atom.treeView && atom.treeView.element && atom.workspace.getCenter() && atom.workspace.getCenter().paneContainer && atom.workspace.getCenter().paneContainer.element )
					{
						//editor.element.style.height = atom.workspace.getCenter().paneContainer.element.clientHeight - 24 + 'px';
						//atom.treeView.element.style.height = atom.workspace.getCenter().paneContainer.element.clientHeight - 24 + 'px';
					}

					var path = editor.getPath();		// TODO-> project path... will not work if split on windows.
					if( !FS.existsSync( path ) )
					{
						// Close the editor
						setTimeout( function()
						{
							editor.destroy();
						}, 500 );
						return;
					}

					setTimeout( function()
					{
						var css = document.createElement( 'style' );
						css.innerHTML = '.tab-bar .tab.active .title.icon { background-size: 14px 14px; text-transform: none; background-position-y: 76%; }';
						document.body.appendChild( css );
					}, 1500 );

					if ( PATH.extname( path ).toLowerCase() == ".aoz" )
					{
						var paths = path.split( PATH.sep );
						var fileAOZ = paths[ paths.length - 1 ];
						if( paths )
						{
							path = '';

							for( var p = 0; p < paths.length - 1; p++ )
							{
								path = path + paths[ p ];
								if( p < paths.length - 2 )
								{
									path = path + PATH.sep;
								}
							}
						}

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

						var aozShopPath = atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'AOZ Store';
						if( path.indexOf( aozShopPath ) == 0 )
						{
							// Close the editor
							setTimeout( function()
							{
								editor.destroy();
							}, 500 );

							var sourcePath = path.strReplace( aozShopPath, '' );
							var targetPath = atom.userPath + PATH.sep + 'AOZ Inspirations' + sourcePath;

							if( FS.existsSync( targetPath ) && FS.existsSync( targetPath + PATH.sep + fileAOZ ) )
							{
									panels.destroyPanel( waitmessagePanel.panel );
									atom.workspace.open( targetPath + PATH.sep + fileAOZ );
									return;
							}

							atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:copy-message' ), 'aozStoreCopy', 4, false, function( response )
							{
								if( response )
								{
									waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:copy' ) );
									var sourcePath = path.strReplace( aozShopPath, '' );
									var targetPath = atom.userPath + PATH.sep + 'AOZ Inspirations' + sourcePath;

									if( FS.existsSync( targetPath ) && FS.existsSync( targetPath + PATH.sep + fileAOZ ) )
									{
											panels.destroyPanel( waitmessagePanel.panel );
											atom.workspace.open( targetPath + PATH.sep + fileAOZ );
											return;
									}

									atom.AOZIO.copyDirectory(
										targetPath,
										path,
										{ recursive: true },
										function()
										{
											panels.destroyPanel( waitmessagePanel.panel );
											atom.workspace.open( targetPath + PATH.sep + fileAOZ );
										}
									);
								}
							}
							);
							return;
						}
					}

/**
					if( PATH.extname( path ).toLowerCase() == ".aozip" || PATH.extname( path ).toLowerCase() == ".amos" )
					{

						// Close the editor
						setTimeout(function()
						{
							editor.destroy();
						}, 500 );

						if( atom.spriteCustomizer )
						{
							atom.spriteCustomizer.updateCustomization();
							if( atom.spriteCustomizer.spriteCustom == 255 )
							{
								return;
							}
						}
						else
						{
							alert( atom.aozLang.getTerm( 'customizer:message' ) );
							return;
						}

						var impMessage = '';
						if( PATH.extname( path ).toLowerCase() == ".aozip" )
						{
							impMessage = 'import:aozip';
						}

						if( PATH.extname( path ).toLowerCase() == ".amos" )
						{
							impMessage = 'import:amos';
						}

						atom.confirm( atom.aozLang.getTerm( impMessage ), false, function ( response )
						{
							if( response )
							{
								atom.AOZIO.openFile( path, function( error, destPath )
								{
									if( error != 'no' )
									{
										return;
									}
									console.log( destPath );
									setTimeout( function()
									{
										atom.workspace.open( destPath );
									}, 1500 );
								} );
							}
						} );
						return;
					}
*/
					if ( PATH.extname( path ).toLowerCase() == ".pdf" )
					{
						atom.workspace.open( path );
					}

					if ( PATH.extname( path ).toLowerCase() == ".aozacclnk" )
					{
						setTimeout( function()
						{
							waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:accessory' ) );
							// Close the editor
							setTimeout( function()
							{
								editor.destroy();
							}, 100 );
						}, 500 );

						AOZAccessories.openAccessory( path );
						setTimeout( function()
						{
							panels.destroyPanel( waitmessagePanel.panel );
						}, 1500 );
						return;						

					}

					setTimeout( function()
					{
						AOZIcons.updateProjectIcons( atom.aozConfig );
						atom.aozConfig.updateFiles();
					}, 500 );
				}
			} ),
			//atom.commands.add( 'atom-workspace', { 'aoz-studio:help-instruction': () => this.helpOnKeyword() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:search-selection': () => this.searchSelectionInDoc() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-documentation': () => this.openDocumentation() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-site': () => this.openAOZWebSite() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:release-notes': () => this.showReleaseNotes() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-licence': () => this.showLicence() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:view-licence': () => this.showLicence() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-link': () => this.runAOZLink( 'run' ) } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:publish': () => this.runPublish( 'run' ) } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-designer': () => this.showDesigner() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:aoz-store': () => this.showAOZStore() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:accessories': () => AOZAccessories.showPopup() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:settings': () => this.showSettings() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:console': () => this.toggleConsole() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:restart': () => this.restartAOZ() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:recompile-all': () => this.recompileAll() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:about': () => this.aboutAOZ() } ),
			atom.commands.add( 'atom-workspace', { 'aoz-studio:copy': () => this.copySelection() } )			
		);

		atom.keymaps.add( '/key/for/these/keymaps', {
		  "body":
		  {
			"escape": "aoz-studio:close-panel",
			"ctrl-shift-d": "aoz-studio:update-doc"
		  }
		} );

		atom.contextMenu.add({ '.aoz-message-console': [ { 'label': 'Copy', 'command': 'aoz-studio:copy' }  ] } );

		if( process.platform == 'win32' || process.platform == 'linux'  )
		{
			atom.keymaps.add( '/key/for/these/keymaps',
			{
				"body":
				{
					"ctrl-space": "aoz-studio:close-aozviewer"
				}
			} );
		}

		if( process.platform == 'darwin' )
		{
			atom.keymaps.add( '/key/for/these/keymaps',
			{
				"body":
				{
					"cmd-space": "aoz-studio:close-aozviewer",
					"cmd-shift-d": "aoz-studio:update-doc"					
				}
			} );
		}

		window.addEventListener( 'aoz-studio:close-aozviewer', ( event ) => {

			event.preventDefault();
			if( atom.aozNotifier.layer2.style.display == 'block' )
			{
				atom.aozNotifier.close();
				atom.closeAOZViewer();
				return;
			}

		} );


		window.addEventListener( 'aoz-studio:close-panel', ( event ) => {

			event.preventDefault();
			if( atom.aozNotifier.layer2.style.display == 'block' )
			{
				atom.aozViewer.openDirectMode();
				return;
			}

			if( atom.docTree.panel.opened == true )
			{
				atom.docTree.panel.toggleOpen();
				return;
			}
		} );
		
		window.addEventListener( 'aoz-studio:update-doc', ( event ) => {

			event.preventDefault();
			atom.docTree.loadGuidemap();
		} );
		
		var self = this;
		if( FS.existsSync( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/build' ) )
		{
			FS.rmdirSync( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/build', { recursive: true } )
		}		


		// Disable x-frame-options to play external websites
		var win = remote.getCurrentWindow();
		win.webContents.session.webRequest.onHeadersReceived( ( details, callback ) =>
		{
			callback( { responseHeaders: FROMENTRIES( Object.entries( details.responseHeaders ).filter( header => !/x-frame-options/i.test( header[ 0 ] ) ) ) } );
		} );

		// close already open panes
		this.closeLocalPanes();
		this.toggleConsole();
		this.updateElements();

		this.warmInit();

		setTimeout( function()
		{
			AOZIcons.updateProjectIcons( atom.aozConfig );
			if( document.querySelector( '.tree-view' ) )
			{
				document.querySelector( '.tree-view' ).scrollLeft = 0;
			}
		}, 4000 );

		try
		{
			AOZSERVER.initServer( this, this.handleMessage );
			this.handleWebSocketMessages();
		}
		catch( e )
		{
			REMOTE.dialog.showErrorBox( "AOZ Studio", atom.aozLang.getTerm( 'aoz-studio:already-started' ) );
			process.exit( 1 );
		}
		
		var dragDiv = document.createElement( 'div' );
		dragDiv.setAttribute( 'style', 'position: absolute; width: 240px; height: 240px; top: 0px; left: 0px; border: 2px #FFFFFF solid; background-color: #222222' );
		dragDiv.addEventListener( 'drop', function( event )
		{
			event.preventDefault();
			if( event.dataTransfer.items )
			{
				// Use DataTransferItemList interface to access the file(s)
				for( var i = 0; i < event.dataTransfer.items.length; i++ )
				{
					// If dropped items aren't files, reject them
					if( event.dataTransfer.items[i].kind === 'file' )
					{
						var file = event.dataTransfer.items[ i ].getAsFile();
						console.log( '... file[' + i + '].name = ' + file.name );
					}
				}
			}
			else
			{
				// Use DataTransfer interface to access the file(s)
				for( var i = 0; i < event.dataTransfer.files.length; i++ )
				{
					console.log( '... file[' + i + '].name = ' + event.dataTransfer.files[ i ].name );
				}
			}
			debugger;
			console.log( event );
		}, false );

		console.clear();
	}

	copySelection( event )
	{
		console.log( 'copy' );
		var text = document.getSelection().toString();
		navigator.clipboard.writeText( text ).then( function()
		{
			console.log( 'Async: Copying to clipboard was successful!' );
		}, function( err )
		{
			console.error( 'Async: Could not copy text: ', err );
		} );
	}

	showLicence()
	{
		atom.aozToolBar.closePopups();
		atom.workspace.open( atom.aozConfig.installInformation.rootPath + PATH.sep + 'LICENCE.TXT' );
	}
	// AOZ VIWER Commands
	fullScreenAOZViewer()
	{
		if( atom.aozViewer.win && atom.aozViewer.win.webContents )
		{
			atom.aozViewer.win.fullScreen = !atom.aozViewer.win.fullScreen;			
		}
	}

	devToolsAOZViewer()
	{
		if( atom.aozViewer.win && atom.aozViewer.win.webContents )
		{
			atom.aozViewer.win.webContents.toggleDevTools();			
		}
	}

	stopAOZViewer()
	{
		if( atom.aozViewer.win )
		{
			atom.aozViewer.win.close();			
		}
	}
	
	reloadAOZViewer()
	{
		if( atom.aozViewer.win && atom.aozViewer.win.webContents )
		{
			atom.aozViewer.win.reload();			
		}
	}

	updateIDE()
	{
		atom.alert( atom.aozLang.getTerm( 'updater:activated' ), false, function( r )
			{
				if( atom.aozUpdater == undefined )
				{
					atom.aozUpdater = new AOZUpdater();
				}
				else
				{
					atom.aozUpdater.checkUpdate();
				}
			}
		);
	}

	sendMessage( message, options, extra )
	{
		if ( wsOpen )
		{
			wsServer.sendMessage( message, options, function ( response, message, extra )
			{
			} , extra );
		}
	}

	handleWebSocketMessages()
	{
		var self = this;

		AOZSERVER.addMessageHandler( 'command', 'get_list_of_tasks', self, function( message )
		{
			var response =
			{
				type: 'response',
				command: 'get_list_of_tasks',		// Todo, put in an array of commands to secure same command names everywhere, and command syntax check both sides..
				id: message.id,
				response: typeof tasksToHandle != 'undefined',
				parameters: tasksToHandle,
				extra: null
			};
			AOZSERVER.sendMessage( response );
			tasksToHandle = undefined;
		} );

		AOZSERVER.addMessageHandler( 'command', 'prepare_application_for_publish', self, function( message )
		{
			var publishMessage = message;

			if( publishApplicationPath == '' )
			{
				var editor = atom.workspace.getActiveTextEditor();
				if( editor )
				{
					if( editor.projectPath )
					{
						publishApplicationPath = PATH.dirname( editor.projectPath );
					}
					else
					{
						publishApplicationPath = PATH.dirname( editor.getPath() );
					}
				}
			}

			if( !FS.existsSync( publishApplicationPath + "/settings" ) )
			{
				FS.mkdirSync( publishApplicationPath + "/settings" );
			}

			this.prepareApplicationForPublish( publishApplicationPath, function ( response, message, extra )
			{
				var messageResponse;

				if ( response )
				{
					publishApplicationZip = message.zipPath;

					messageResponse =
					{
						type: 'response',
						command: 'prepare_application_for_publish',
						id: publishMessage.id,
						response: response,
						parameters: [ message.zipPath ],
						extra: null
					};
				}
				else
				{
					messageResponse =
					{
						type: 'response',
						command: 'prepare_application_for_publish',
						id: publishMessage.id,
						response: response,
						parameters: [ '' ],
						extra: null
					};
				}
				AOZSERVER.sendMessage( messageResponse );
			});
		} );

		AOZSERVER.addMessageHandler( 'command', 'publish_packaged_application', self, function( message )
		{
			var publishMessage = message;
			this.publishPackagedApplication( publishApplicationZip, publishApplicationPath, function ( response, message, extra )
			{
				var messageResponse;

				if ( response )
				{
					messageResponse =
					{
						type: 'response',
						command: 'publish_packaged_application',
						id: publishMessage.id,
						response: response,
						parameters: [ message.url ],
						extra: null
					};
					atom.clipboard.write( message.url );
				}
				else
				{
					messageResponse =
					{
						type: 'response',
						command: 'publish_packaged_application',
						id: publishMessage.id,
						response: response,
						parameters: [ '' ],
						extra: null
					};
				}
				AOZSERVER.sendMessage( messageResponse );
			});
		} );

		AOZSERVER.addMessageHandler( 'command', 'open_url_in_browser', self, function( message )
		{
			var messageParam = JSON.parse(message.parameters[0]);

			var commandLine;
			if ( process.platform == 'win32' )
				commandLine = "explorer" + ' "' + messageParam.url + '?forced=' + Date.now() + '"';
			else if ( process.platform == 'darwin' )
				commandLine = 'open "' + messageParam.url + '?forced=' + Date.now() + '"';
			else if ( process.platform == 'linux' )
				commandLine = '"' + atom.aozConfig.installInformation.aozPath + dirSep +  'runbrowserlinux.sh" "' + messageParam.url + '?forced=' + Date.now() + '"';

			self.execCommand( commandLine, atom.aozConfig.installInformation.aozPath, function( response, data, extra )
			{
				if ( !response || ( data && data.stderr != '' ) )
				{
					atom.beep;
					REMOTE.dialog.showErrorBox( 'AOZ Studio', atom.aozLang.getTerm( 'dialog:browser-error' ) );
				}
			}, { output: false } );
		} );

		AOZSERVER.addMessageHandler( 'command', 'end_accessory', self, function( message )
		{
			self.resetTV();
		} );

		AOZSERVER.addMessageHandler( 'command', 'aozAPI', self, function( message )
		{
			if ( atom.aozAPI[ message.parameters.command ] )
			{
				message.result = atom.aozAPI[ message.parameters.command ]( message.parameters )
				AOZSERVER.sendMessage( message );
			}
		} );

  	}

	aboutAOZ()
	{
	}

	restartAOZ()
	{
		atom.reload();
  	}

	toggleConsole()
	{
		atom.aozToolBar.closePopups();
		if( consolePanel.opened )
		{
			consolePanel.panel.style.display = 'none';
			consolePanel.opened = false;

			var css = document.createElement( 'style' );
			css.innerHTML = '.left, div.tree-view, atom-text-editor .gutter-container, atom-text-editor atom-text-editor-minimap, div.scroll-view { height: 100%; }';
			document.body.appendChild( css );

		}
		else
		{
			consolePanel.panel.style.display = 'block';
			consolePanel.opened = true;
		
			var css = document.createElement( 'style' );
			css.innerHTML = '.left { height: ' + ( window.innerHeight - 278 ) + 'px;} div.tree-view, atom-text-editor .gutter-container, atom-text-editor atom-text-editor-minimap, div.scroll-view { height: ' + ( window.innerHeight - 302 ) + 'px; }';
			document.body.appendChild( css );
		}
	}

	showConsole( visible )
	{
		atom.aozToolBar.closePopups();
		if ( visible != consolePanel.opened )
			this.toggleConsole();
	}

	openDirectMode( callback )
	{
		atom.aozToolBar.closePopups();
		atom.isDirectMode = true;
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.updateCustomization();
			if( atom.spriteCustomizer.spriteCustom == 255 )
			{
				return;
			}
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			return;
		}

		var path;
		waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:direct-mode' ) );
		if ( !callback )
		{
			// Compiles the current application so that the banks are available in direct mode.
			var editor = atom.workspace.getActiveTextEditor();
			if( editor )
			{
				path = editor.getPath();
			}
		}
		if ( !path )
		{
			// No current application-> empty code
			path = atom.aozConfig.installInformation.aozPath + dirSep + 'tools' + dirSep + 'workshop' + dirSep + 'workshop.aoz';
		}

		var self = this;
		setTimeout( function()
		{
			self.buildPath( path, { tags: { useSource: '// Direct', forceFullScreen: true, displayEndAlert: false, gotoDirectMode: true } }, function( response, data, extra )
			{
				if ( response == 'success' )
				{
					panels.destroyPanel( waitmessagePanel.panel );
					aozviewer.title = 'AOZ Direct Mode';
					var url = 'http://' + atom.aozConfig.installInformation.hostAddress + ':' + atom.aozConfig.installInformation.port + '/index.html';
					self.openHTML( path, url, 'directMode', { fileURL: true } )
							//aozviewer.show( url, false, '', true, true );
				}
				else if ( response == 'failure' )
				{
					if ( callback )
						callback.call( self, false, null, {} );
				}
			} );
		}, 1000 );
	}

	openDocumentation()
	{
		if( atom.docTree.win == undefined )
		{
			atom.docTree.open();
		}

		/**
		if( atom.docTree.panel.opened == false )
		{
			atom.docTree.panel.toggleOpen();
		}
		*/
	}
	
	buildForAmiga()
	{
		TRANSPILER.amigaTranspiler();
	}
	
	runAOZLink( mode )
	{
		if( atom.transpilerBusy )
		{
			atom.aozDialog.showDialog( atom.aozLang.getTerm( 'transpiler:busy-error' ), 'info', 1 );
			return;			
		}
	
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.updateCustomization();
			if( atom.spriteCustomizer.spriteCustom == 255 )
			{
				return;
			}
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			return;
		}

		var editor = atom.workspace.getActiveTextEditor();
		if( editor == undefined || ( editor.getText().length == 0 ) || editor.projectPath == undefined )
		{
			return;
		}

		var dirSep = PATH.sep;
		// store the current application path
		publishApplicationPath = cleanPath( getDirectoryString( editor.projectPath ) );
		atom.aozRequester.showAOZLinkPanel();
		return;
		
	}
	
	runPublish( mode )
	{
	
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.updateCustomization();
			if( atom.spriteCustomizer.spriteCustom == 255 )
			{
				return;
			}
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			return;
		}

		atom.nalert( atom.aozLang.getTerm( 'aoz-studio:in-dev' ) );
		return;
	}
	
	showDesigner()
	{
		var editor = atom.workspace.getActiveTextEditor();
		if ( editor == undefined )
		{
			return;
		}

		if( editor )
		{
			var path = editor.getPath();
			var ext = PATH.extname( path );
			if ( ext.toLowerCase() != '.aoz' )
			{
				atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:not-aoz-file' ), 'alert', 2 );
				return;
			}

			atom.aozDesigner.show();
		}
	}
	
	showAOZStore()
	{
	
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.updateCustomization();
			if( atom.spriteCustomizer.spriteCustom == 255 )
			{
				return;
			}
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			return;
		}

		atom.nalert( atom.aozLang.getTerm( 'aoz-studio:in-dev' ) );
		return;
	}
	
	show3DEditor()
	{
		var editor = atom.workspace.getActiveTextEditor();
		if ( editor == undefined )
		{
			return;
		}

		var path = editor.getPath();
		atom.AOZ3DEditor.show( path );
	}

	destroy()
  	{
		this.closeLocalPanes();
		this.stopServer();
		window.onmousedown = null;
    	this.rootElement.remove();
    	subscriptions.dispose();
  	}

  	getTitle()
  	{

		remote.getCurrentWindow().setTitle( atom.appName + ' ' + atom.appVersion );
    	return atom.appName + ' ' + atom.appVersion;
  	}

  	getDefaultLocation()
  	{
    	return 'right';
  	}

  	getAllowedLocations()
  	{
    	return [ 'left', 'right', 'bottom' ];
  	}

  	getURI()
  	{
    	return 'atom://aoz-studio'
  	}

  	serialize()
  	{
    	return
		{
      		deserializer: 'aoz-studio/AOZView'
    	};
  	}

  	getElement()
  	{
    	return this.rootElement;
	}

	showReleaseNotes()
	{
		this.showSettings( 0 );
	}

	showAccountLicence()
	{
		this.showSettings( 1 );
	}

	showSettings( panel )
	{
		aoz_settings_panel.show( atom.userConfigPath, panel );
	}


	new_file( name )
	{
		atom.aozRequester.showNewFileDialog();
		return;
	}

	load_file( path )
	{
		atom.aozRequester.showLoadFileDialog( function( path )
		{
			if( path )
			{
				if( PATH.extname( path ).toLowerCase() == '.aozip' || PATH.extname( path ).toLowerCase() == '.amos' )
				{
					setTimeout( function()
					{
						atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:import-app' ) );						
					}, 500 );
				}

				atom.AOZIO.openFile( path, function( error, destPath )
				{
					panels.destroyPanel( waitmessagePanel.panel );
					if ( error != 'no' )
					{
						console.error( error );
						REMOTE.dialog.showErrorBox( "AOZ Studio",  atom.aozLang.getTerm( 'dialog:error-read-file' ) );
						return;
					}

					if( PATH.extname( path ).toLowerCase() == '.aozip' || PATH.extname( path ).toLowerCase() == '.amos' )
					{
						atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:app-file-extract' ), 'info', 1 );
						if( destPath )
						{
							atom.workspace.open( destPath ); 
						}
					}
				} );				
			}


		} );
		return;
	}

	addProjectFolder( path )
	{
		AOZIO.addProjectFolder( path );
	}

	save_file()
	{
		if( atom.workspace.getActiveTextEditor() == undefined )
		{
			return;
		}

		var appPath = AOZIO.cleanPath( atom.workspace.getActiveTextEditor().getPath() );
		if ( PATH.extname( appPath ).toLowerCase() != '.aoz' )
		{
			REMOTE.dialog.showErrorBox( "AOZ Studio",  atom.aozLang.getTerm( 'dialog:not-aoz-file' ) );
			return;
		}
		atom.aozRequester.showSaveFileDialog()
		return;
	}
	
	save_aozip()
	{
		var editor = atom.workspace.getActiveTextEditor();
		if( atom.workspace.getActiveTextEditor() == undefined )
		{
			return;
		}

		var appPath = editor.projectPath;
		if( appPath == undefined )
		{
			REMOTE.dialog.showErrorBox( "AOZ Studio",  atom.aozLang.getTerm( 'dialog:not-aoz-file' ) );
			return;
		}
		waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:save-aozip' ) );
		setTimeout( function()
		{
			atom.AOZipUtils.savePackage( PATH.dirname( appPath ), function( error )
			{
				panels.destroyPanel( waitmessagePanel.panel );
				if( error != "" )
				{
					console.log( error );
					REMOTE.dialog.showErrorBox( "AOZ Studio",  atom.aozLang.getTerm( 'dialog:error-read-file' ) );
					return;
				}
				atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:aozip-file-info' ), 'info', 1 );
				return;				
			} );
		}, 1500 );
		return;		
	}

	toggle()
	{
    	atom.workspace.toggle( 'atom://aoz-studio' );
	}

	removeSpecials(str)
	{
		var lower = str.toLowerCase();
		var upper = str.toUpperCase();

		var res = "";
		for(var i=0; i<lower.length; ++i) {
			if(lower[i] != upper[i] || lower[i].trim() === '')
				res += str[i];
		}
		return res;
	}

	publishPackagedApplication( zipPath, applicationPath, callback, error )
	{
		var editor = atom.workspace.getActiveTextEditor();
		var path = editor.projectPath;
		if( editor )
		{
			if( editor.projectPath != undefined && editor.projectPath != '' )
			{
				path = editor.projectPath;
			}
			else
			{
				path = applicationPath + dirSep + editor.getTitle();
			}
		}
		applicationPath = PATH.dirname( path );

		if (!FS.existsSync( zipPath ) || !FS.existsSync( applicationPath ))
		{
			callback.call( self, false, null, {} );
		}
		else
		{
			var self = this;
			var settingsPath = PATH.join( applicationPath + dirSep + 'settings' + dirSep + 'publish.hjson' );

			// Get the application settings
			var json = AOZIO.loadIfExist( settingsPath, 'utf8' );

			var publishSettings =
			{
				applicationid: '',
				url: ''
			}

			if ( json )
			{
				try
				{
					publishSettings = HJSON.parse( json );
				}
				catch( e ) {
					console.error( err );
				}
			}

			if ( publishSettings )
			{
				var formData = {
					applicationid: publishSettings.applicationid,
					zip_file: FS.createReadStream( zipPath )
				};
				// Send the zip file to the server
				REQUEST.post(
				{
					url: atom.aozConfig.installInformation.publishApi,
					formData: formData
				},
				function optionalCallback(err, httpResponse, body) {

					deploying = false;

					// Delete the zip file
					try
					{
						FS.unlinkSync( zipPath );
					} catch(e)
					{
						console.error( e );
					}

					var apiResponse;
					try
					{
						apiResponse = JSON.parse(body);
					}
					catch( e )
					{
						console.error( e );
					}

					if (err || !apiResponse)
					{
						if ( callback )
						{
							callback.call( self, false, null, {} );
						}
					}
					else
					{
						// Get the server response and update the application settings
						publishSettings.url = apiResponse.url;
						publishSettings.applicationid = apiResponse.applicationid;

						json = HJSON.stringify( publishSettings );
						try
						{
							FS.writeFileSync( settingsPath, json, { encoding: 'utf8' } );
						}
						catch ( err )
						{
							console.log( atom.aozLang.getTerm( 'aoz-studio:settings-save-error' ) );
						}

						if ( callback )
						{
							callback.call( self, true, publishSettings, {} );
						}
					}
				});
			}
			else
			{
				if ( callback )
				{
					callback.call( self, false, null, {} );
				}
			}
		}
	}

	prepareApplicationForPublish( applicationPath, callback, error )
	{
		atom.transpilerProcess = "build";
		var self = this;
		if( atom.lineError )
		{
			atom.lineError = undefined;
			if( atom.elm )
			{
				atom.elm.setAttribute( 'class', 'line' );
				atom.elm = undefined;
			}
		}
		document.querySelectorAll( '.line' ).forEach( function( elm ) { elm.setAttribute( 'class', 'line' ); } );
		atom.aozStudioView.warnErrorStatus.style.display = 'none';
		consolePanel.message.innerHTML = '';
		if( buildMessages )
		{
			buildMessages.warnings = [];
			buildMessages.errors = [];
		}
		
		self.updateWarnErrorStatus();
		
		var editor = atom.workspace.getActiveTextEditor();
		var path = editor.projectPath;
		if( editor )
		{
			if( editor.projectPath != undefined && editor.projectPath != '' )
			{
				path = editor.projectPath;
			}
			else
			{
				path = applicationPath + dirSep + editor.getTitle();
			}
			
			var ext = PATH.extname( path );
			if ( ext.toLowerCase() != '.aoz' && options.runIn && options.runIn != 'accessory' )
			{
				atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:not-aoz-file' ), 'alert', 2 );
				return;
			}
		}			

		var self = this;

		if (!FS.existsSync( path ))
		{
			callback.call( self, false, null, {} );
		}
		else
		{
			self.buildPath( path, { tags: { noDebugging: true, forceFullScreen: true, displayEndAlert: false }, handleErrors: true }, function( response, data, extra )
			{
				if ( response == 'success' )
				{
					var appPath = PATH.dirname( path );
					var zipSource = appPath + '/html';
					var zipPath = appPath + '/settings/publish.zip';
					var settingsPath = appPath + '/settings';

					// Check if the application settings folder exist
					if (!FS.existsSync( settingsPath ))
					{
						FS.mkdirSync( settingsPath );
					}
					else
					{
						if ( FS.existsSync( zipPath ))
						{
							try
							{
								FS.unlinkSync( zipPath );
							} catch(e) {
								console.log( atom.aozLang.getTerm( 'aoz-studio:delete-error-publish' ) );
							}
						}
					}

					// Zip up the html folder
					var zip = new JSZIP();
					var tree = getDirectory( zipSource, { recursive: true, includeHtmlFolder: true } );
					var dejaErr = false;

					if ( tree )
					{
						zipIt( tree );
						zip.generateAsync( { type: "nodebuffer" } )
						.then(function (content)
						{
							FS.writeFile(zipPath, content, function (err)
							{
								if (err)
								{
									if (!dejaErr)
									{
										dejaErr = true;
										deploying = false;

										if ( callback )
										{
											callback.call( self, false, null, {} );
										}
									}
								}
								else
								{
									if ( callback )
									{
										callback.call( self, true, { zipPath }, {} );
									}
								}
							} );
						});
					}
					function zipIt( tree )
					{
						for ( var f in tree )
						{
							var file = tree[ f ];
							if ( file.isDirectory )
							{
								var localPath = file.path.substring( zipSource.length + 1 );
								zip.folder( localPath );
								zipIt( file.files );
							}
							else
							{
								var localPath = file.path.substring( zipSource.length + 1 );
								zip.file( localPath, FS.readFileSync( file.path ), { createFolders: true } );
							}
						}
					}
				}
				else if ( response == 'failure' )
				{
					self.updateWarnErrorStatus();
					self.showMessagesList();
					if ( callback )
					{
						callback.call( self, false, null, {} );
					}
				
				}
			} );
		}
	}

	// Clean the current AOZ of the MS Word symbols.
	cleanAOZCode( editor )
	{
		if( editor == undefined || editor.getText().length == 0 )
		{
			return;
		}

		var codText =  editor.getText().strReplace( "`", "'" );
		codText =  codText.strReplace( "’", "'" );

		codText =  codText.strReplace( "|'", "`" );
		codText =  codText.strReplace( "|''", "’" );

		if( codText != editor.getText() )
		{
			editor.setText( codText );
		}
	}

	buildCurrentApplication( options, callback, extra )
	{

		if( atom.transpilerBusy )
		{
			atom.aozDialog.showDialog( atom.aozLang.getTerm( 'transpiler:busy-error' ), 'info', 1 );
			return;			
		}
		
		atom.transpilerProcess = "build";
		var self = this;
		atom.sourcePath = undefined;
		console.clear();
		consolePanel.message.innerHTML = '';
		if( buildMessages )
		{
			buildMessages.warnings = [];
			buildMessages.errors = [];
		}
		
		self.updateWarnErrorStatus();
		
		if( atom.lineError )
		{
			atom.lineError = undefined;
			if( atom.elm )
			{
				atom.elm.setAttribute( 'class', 'line' );
				atom.elm = undefined;
			}
			document.querySelectorAll( '.line' ).forEach( function( elm ) { elm.setAttribute( 'class', 'line' ); } );			
		}
		atom.aozStudioView.warnErrorStatus.style.display = 'none';
		
		atom.aozToolBar.closePopups();
	
		if( atom.spriteCustomizer )
		{
			atom.spriteCustomizer.updateCustomization();
			if( atom.spriteCustomizer.spriteCustom == 255 )
			{
				return;
			}
		}
		else
		{
			alert( atom.aozLang.getTerm( 'customizer:message' ) );
			return;
		}

		var editor = atom.workspace.getActiveTextEditor();	
		if( editor == undefined || ( editor.getText().length == 0 ) )
		{
			return;
		}

		setTimeout( function()
		{
			var arr = Array.from( editor.component.lineComponentsByScreenLineId );
			if( arr )
			{
				for( var l = 0; l < arr.length; l++ )
				{
					var elm = arr[ l ][ 1 ].element;
					elm.setAttribute( 'class', 'line' );
					elm.setAttribute( 'alt', '' );
					elm.setAttribute( 'title', '' );
				}
			}
		}, 1000 );

		this.cleanAOZCode( editor );

		var self = this;
		var path = editor.getPath();
		if( editor && PATH.extname( path ).toLowerCase() != '.aoz' )
		{		
			if( editor.projectPath != undefined && editor.projectPath != '' )
			{
				path = editor.projectPath;
			}
			else
			{
				path = editor.getPath();
			}
			
			var ext = PATH.extname( path );
			if ( ext.toLowerCase() != '.aoz' && options.runIn && options.runIn != 'accessory' )
			{
				atom.aozDialog.showDialog( atom.aozLang.getTerm( 'dialog:not-aoz-file' ), 'alert', 2 );
				return;
			}
		}
		else
		{
			atom.transpiler_isAOZFile = true;
			atom.transpiler_AOZFilename = editor.getTitle();
		}

		const deleteFolderRecursive = function (directoryPath) {
			if (FS.existsSync(directoryPath)) {
				FS.readdirSync(directoryPath).forEach((file, index) => {
					const curPath = PATH.join(directoryPath, file);
					if (FS.lstatSync(curPath).isDirectory()) {
						// recurse
						deleteFolderRecursive(curPath);
					} else {
						// delete file
						FS.unlinkSync(curPath);
					}
				});
				FS.rmdirSync(directoryPath);
			}
		};
		// Supprime les dossiers principaux du dossier HTML ( s'il existe )
		if( FS.existsSync( PATH.dirname( path ) + '/html' ) )
		{
			if( FS.existsSync( PATH.dirname( path ) + '/html/resources' ) )
			{
				deleteFolderRecursive( PATH.dirname( path ) + '/html/resources' );
			}

			if( FS.existsSync( PATH.dirname( path ) + '/html/run' ) )
			{
				deleteFolderRecursive( PATH.dirname( path ) + '/html/run' );
			}
		}

		//
		// Load manifest.hjson if exists
		//
		var manifest = undefined;
		if( FS.existsSync( PATH.dirname( path ) + '/resources/manifest.hjson' ) )
		{
			manifest = AOZIO.loadHJSON( PATH.dirname( path ) + '/resources/manifest.hjson' );
			options.manifest = manifest;
		}

		if( manifest )
		{
			if( manifest.compilation && manifest.compilation.actions )
			{
				if( manifest.compilation.actions.beforeCompilation )
				{
					self.executeManifestAction( manifest.compilation.actions.beforeCompilation, function( error, message )
					{
						if( error )
						{
							console.error( message );
						}
					} );
				}
			}
		}

		var buildPath = cleanPath( getDirectoryString( path ) );
		atom.sourcePath = buildPath;

		self.checkAppIcons( buildPath );

		if( options.runIn != undefined && options.runIn != 'none' )
		{
			waitmessagePanel.show();
			/**
			if( !consolePanel.opened )
			{
				self.toggleConsole();
			}
			*/
		}

		try
		{
			var self = this;
			this.getPathToTranspile( {}, function( response, path, extra )
			{
				if ( response )
				{
					self.stopServer();

					warningPosition = 0;
					errorPosition = 0;
					lastError = null;
					buildMessages.warnings = [];
					buildMessages.errors = [];
					options.handleErrors = true;
					self.handleMessage( { command: 'compile_start' } );
					setTimeout( function()
					{
						transpileIt();
					}, 500 );
					return;

					function transpileIt()
					{
						
						if( atom.spriteCustomizer )
						{
							atom.spriteCustomizer.updateCustomization();
							if( atom.spriteCustomizer.spriteCustom == 255 )
							{
								return;
							}
						}
						else
						{
							alert( atom.aozLang.getTerm( 'customizer:message' ) );
							return;
						}

						var buildPath = cleanPath( path );
						self.buildPath( buildPath, options, function( response, message, extra )
						{
							if( atom.transpilerCancelled )
							{
								return;
							}								

							if( options.runIn != undefined && options.runIn != 'none' )
							{
								panels.destroyPanel( waitmessagePanel.panel );
							}
							
							if ( response == 'success' )
							{
								self.updateWarnErrorStatus();
								self.showMessagesList();
								if( atom.aozConfig.aoz_settings.hideTranspiler )
								{
									if( consolePanel.opened )
									{
										self.toggleConsole();
									}
								}

								if( options.manifest )
								{
									if( options.manifest.compilation && options.manifest.compilation.actions )
									{
										if( options.manifest.compilation.actions.afterCompilation )
										{
											self.executeManifestAction( options.manifest.compilation.actions.afterCompilation, function( error, message )
											{
												if( error )
												{
													console.error( message );
												}
											} );
										}
									}
								}

								if( options.runIn.substring( 0, 4 ) == 'atom' )
									aozviewer.title = 'AOZ Viewer';
								else if ( options.runIn == 'debugger' )
									aozviewer.title = 'AOZ Debugger';

								// Run!
								if ( options.runIn != 'test' && options.runIn != 'publish' )
								{
									self.runCurrentApplication( options );
									if ( options.runIn != 'tv' && options.runIn != 'tv-force' )
									{
										setTimeout( function()
										{
											self.handleMessage( { command: 'compile_end' } );
										}, 750 );
									}
								}
								else if ( options.runIn == 'test' )
								{
									setTimeout( function()
									{
										self.handleMessage( { command: 'thumbs_up' } );
										setTimeout( function()
										{
											self.handleMessage( { command: 'compile_end' } );
										}, 1000 );
									}, 750 );
								}
								else if ( options.runIn == 'publish' )
								{
									setTimeout( function()
									{
										self.handleMessage( { command: 'thumbs_up' } );
										setTimeout( function()
										{
											self.handleMessage( { command: 'publishing' } );
										}, 1000 );
									}, 100 );
								}

								if ( callback )
								{
									callback.call( self, true, message, extra );
								}
							}
							else if ( response == 'failure' )
							{
								self.updateWarnErrorStatus();
								self.showMessagesList();
								if ( options.runIn == 'test' )
								{
									setTimeout( function()
									{
										self.handleMessage( { command: 'thumbs_down' } );
										setTimeout( function()
										{
											self.handleMessage( { command: 'compile_end' } );
										}, 1000 );
									}, 750 );
								}
								// Point to first error
								self.gotoNextError();

								// A callback?
								if ( callback )
								{
									callback.call( self, false, message, extra );
								}
							}
						} );
					}
				}
				atom.beep();
				return false;
			} );
		}
		catch( e )
		{
			console.error( e );
			if ( callback )
			{
				callback.call( self, false, null, extra );
			}
		}
		return false;
	}

	//
	// Exécute une des actions configurées dans le manifest
	//
	executeManifestAction( action, cb )
	{
		if( action && action[ process.platform ] && action[ process.platform ] != '' )
		{
			var part = action[ process.platform ].split( ':' );
			if( part && part.length > 1 )
			{
				var data = part[ 1 ];
				for( var r = 2; r < part.length; r++)
				{
					data = data + ':' + part[ r ];
				}

				console.log( 'Execute command: ' + data );
				switch( part[ 0 ].toLowerCase() )
				{
					case 'shell':
						atom.editorSDK.shell.shellExecute( { cmd: data }, function( event, error, message )
						{
							if( error )
							{
								if( cb )
								{
									cb.call( this, true, message );
								};
							}
						} );
						break;
					
					case 'viewer':
						atom.aozViewer.executeProgram( data );
						break;
				}
			}
		}
		if( cb )
		{
			cb.call( this, false, '' );
		}
	}
	
	updateWarnErrorStatus()
	{
		if( buildMessages )
		{
			var nbw = ( buildMessages.warnings != undefined ) ? buildMessages.warnings.length : 0;
			var nbe = ( buildMessages.errors != undefined ) ? buildMessages.errors.length : 0;
			atom.aozStudioView.warnErrorStatus.innerHTML = '<img src="' + atom.ICONS.WARN_STATUS_ICON + '"></img> ' + nbw + ' <img src="' + atom.ICONS.ERROR_STATUS_ICON + '"></img> ' + nbe;
			atom.aozStudioView.warnErrorStatus.style.display = 'inline-block';
		}
	}
	
	showMessagesList()
	{
		consolePanel.message.innerHTML = '';
		consolePanel.opened = false;
		if( buildMessages )
		{

			if( buildMessages.warnings )
			{
				for( var m = 0; m < buildMessages.warnings.length; m++ )
				{
					consolePanel.showMessage( buildMessages.warnings[ m ] );
				}
			}

			if( buildMessages.errors )
			{
				for( var m = 0; m < buildMessages.errors.length; m++ )
				{
					consolePanel.showMessage( buildMessages.errors[ m ] );
				}
				atom.aozStudioView.toggleConsole();

			}
		}
	}
	
	indentCurrentApplication( options, callback, extra )
	{
		this.buildCurrentApplication( { output: true, runIn: 'indent', tags: { indent: true } }, function( response, message, extra )
		{
			if ( response )
			{
				// data.indentation contient le tableau...
				var editor = atom.workspace.getActiveTextEditor();
				if ( editor )
				{
					var start = 0;
					var end = message.indentation.length;
					var range = editor.getSelectedBufferRange();
					if ( range.start.row != range.end.row )
					{
						start = range.start.row;
						end = range.end.row;
					}
					end = Math.min( end, editor.getLineCount() );
					for ( var l = start; l < end; l++ )
					{
						editor.setIndentationForBufferRow( l, message.indentation[ l ], { preserveLeadingWhitespace: false } );
					}
				}
			}
		} );
		return false;
	}


	//
	// Check & copy the app icons
	//
	checkAppIcons( path )
	{
		var dirSep = PATH.sep;

		// Check first if it is an extension
		var isApplication = true;
		var manifestPath = path + dirSep + 'manifest.hjson';
		if ( FS.existsSync( manifestPath ) )
		{
			var manifest = UTILITIES.loadHJSON( manifestPath, { noErrors: true } );
			if ( manifest && ( manifest.versionModule || manifest.versionExtension ) )
			{
				isApplication = true;
			}
		}
		if ( !isApplication )
		{
		if( FS.existsSync( path + dirSep + 'resources' ) )
		{
			if( !FS.existsSync( path + dirSep + 'resources' + dirSep + 'appicon' ) )
			{
				MKDIRP.sync( path + dirSep + 'resources' + dirSep + 'appicon' );
				copyDirectory( path + dirSep + 'resources' + dirSep + 'appicon', atom.aozConfig.installInformation.aozPath + dirSep + 'templates' + dirSep + 'resources' + dirSep + 'appicon', { recursive: true } );
			}
		}
		else
		{
			MKDIRP.sync( path + dirSep + 'resources' );
			copyDirectory( path + dirSep + 'resources', atom.aozConfig.installInformation.aozPath + dirSep + 'templates' + dirSep + 'resources', { recursive: true } );
		}

		setTimeout( function()
		{
			AOZIcons.updateProjectIcons();
		}, 100 );
	}
	}

	warmInit()
	{
		if ( atom.transpileMode == 1 )
		{
			var self = this;
			var handle = setInterval( function()
			{
				if ( atom.transpilerVersion != 0 )
				{
					clearInterval( handle );

					atom.transpilerBusy = true;
					atom.transpilerBreak = false;
					waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:initializing-transpiler' ) );
					var transpilerOptions =
					{
						tags: 
						{
							developperMode: atom.aozConfig.aoz_settings.developperMode
						}
					}
					if( buildMessages )
					{
						buildMessages.warnings = [];
						buildMessages.errors = [];
					}
			
					TRANSPILER.warmInit( transpilerOptions, function( OK, message, extra )
					{
						atom.transpilerBusy = false;
						atom.transpilerBreak = false;
						panels.destroyPanel( waitmessagePanel.panel );
			
						if ( !OK )			
						{	
							atom.aozNotifier.show( atom.ICONS.ICON_ERROR, atom.aozLang.getTerm( 'transpiler:initialization-error' ) );	
							buildMessages.errors = message.logErrors;
							self.updateWarnErrorStatus();
							self.showMessagesList();
						}	
					} );
				}
			}, 100 );
		}
		return true;
	}

	buildPath( path, options, callback, extra )
	{
		var self = this;
				
		atom.aozToolBar.closePopups();
		consolePanel.message.innerHTML = '';
		if( buildMessages )
		{
			buildMessages.warnings = [];
			buildMessages.errors = [];
		}
		
		self.updateWarnErrorStatus();

		try
		{
			if ( !atom.transpilerBusy )
			{
				//console.clear();
				atom.transpilerBusy = true;
				atom.transpilerBreak = false;

				var buildPath = cleanPath( path );
				lastBuildPath = buildPath;

				// Check if apps icon exists.
				self.checkAppIcons( getDirectoryString( buildPath ) );
				var transpilerOptions =
				{
					sourcePath: getDirectoryString( buildPath ),
					specialFolders: atom.aozConfig.installInformation.paths,
					buildPath: buildPath,
					tags: {}
				}
				for ( var o in options.tags )
					transpilerOptions.tags[ o ] = options.tags[ o ];
				transpilerOptions.tags[ 'developperMode' ] = atom.aozConfig.aoz_settings.developperMode;
				TRANSPILER.transpile( transpilerOptions, function( response, message, extra )
				{
					// Handle transpiler messages
					if ( response == 'success' )
					{
						(new AOZCert).include( path, ( certificate_error ) => {
							atom.transpilerBusy = false;
							if ( certificate_error ) {
								console.log( 'certificate_error', certificate_error );
								message.logErrors.push({
									column:   1,
									line:     1,
									path:     path,
									response: 'failure',
									text:     certificate_error,
									type:     'error'
								});
								buildMessages.errors = message.logErrors;
								response = 'failure';
							}
							buildMessages.warnings = message.logWarnings;
							self.updateWarnErrorStatus();
							self.showMessagesList();
							callback.call(self, response, message, extra);
							if ( message )
								self.handleMessage( { command: ( message.type ) ? message.type : 'print', text: message.text } );
						})
					}
					else if ( response == 'failure' )
					{
						atom.transpilerBusy = false;
						buildMessages.errors = message.logErrors;
						buildMessages.warnings = message.logWarnings;
						self.updateWarnErrorStatus();
						self.showMessagesList();
						callback.call( self, response, message, extra );
						if ( message )
							self.handleMessage( { command: ( message.type ) ? message.type : 'print', text: message.text } );
					}
				}, extra );
				return true;
			}
		}
		catch( e )
		{
			atom.transpilerBusy = false;
			self.handleMessage( { command:'error', text: atom.aozLang.getTerm( 'transpiler:internal-error' ) } );
			return;
		}
		this.handleMessage( { command:'error', text: atom.aozLang.getTerm( 'transpiler:busy-error' ) } );
		return false;
	}

	printTranspilerVersion( options, callback, extra )
	{
		this.handleMessage( { command: 'clear' } );
		this.handleMessage( { command: 'print', text: ' ' } );
		this.handleMessage( { command: 'print', text: 'AOZ Transpiler (c) 2020-2021 AOZ Studio' } );
		this.handleMessage( { command: 'print', text: 'By Francois Lionet and Baptiste Bideaux' } );
		this.handleMessage( { command: 'print', text: '' } );
		this.handleMessage( { command: 'print', text: 'Special thanks to Phil, Brian, Dave, Dale, Thierry and all the others' } );
		this.handleMessage( { command: 'print', text: '' } );
		this.handleMessage( { command: 'print', text: 'Web: http://aoz.studio' } );
		this.handleMessage( { command: 'print', text: 'Join us on Discord: https://discord.gg/EVyjggp' } );
		this.handleMessage( { command: 'print', text: ' ' } );
		this.handleMessage( { command: 'print', text: 'Transpiler version: ' + atom.transpilerVersion } );
		this.handleMessage( { command: 'print', text: ' ' } );
	}

	runCurrentApplication( options )
	{
		var self = this;
		if ( serverON )
		{
			LIVESERVER.shutdown();
			serverON = false;
		}

		this.getPathToTranspile( {}, function( response, path, extra )
		{
			setTimeout( function()
			{
				AOZIcons.updateProjectIcons();
			}, 100 );

			if ( response )
			{
				//
				// Custom Execution
				//
				if( options.manifest && options.manifest.compilation && options.manifest.compilation.actions && options.manifest.compilation.actions.execution )
				{
					var mode = 'debug';
					if( options.runIn.substring( 0, 4 ) != 'atom' )
					{
						mode = 'release';
					}

					if( options.manifest.compilation.actions.execution[ mode ] )
					{
						self.executeManifestAction( options.manifest.compilation.actions.execution[ mode ], function( error, message )
						{
							if( error )
							{
								console.error( error, message );
							}
						} );
					}
					else
					{
						var buildPath = removeFilePart( AOZIO.cleanPath( path ) );
						var appPath = buildPath + dirSep + 'html' + dirSep + 'index.html';
						if ( FS.existsSync( appPath ) )
						{
							appPath = PATH.relative( atom.aozConfig.installInformation.applicationsPath, appPath );
							appPath = 'http://' + atom.aozConfig.installInformation.hostAddress + ':' + atom.aozConfig.installInformation.port + '/' + PATH.basename( appPath );
							self.openHTML( path, appPath, options.runIn, { } )
						}
						else
						{
							atom.beep;
						}						
					}
				}
				else
				{
					var buildPath = removeFilePart( AOZIO.cleanPath( path ) );
					var appPath = buildPath + dirSep + 'html' + dirSep + 'index.html';
					if ( FS.existsSync( appPath ) )
					{
						appPath = PATH.relative( atom.aozConfig.installInformation.applicationsPath, appPath );
						appPath = 'http://' + atom.aozConfig.installInformation.hostAddress + ':' + atom.aozConfig.installInformation.port + '/' + PATH.basename( appPath );
						self.openHTML( path, appPath, options.runIn, { } )
					}
					else
					{
						atom.beep;
					}
				}
			}
		} );
		return true;
	}
	
	pressEscape()
	{
		var self = this;
		if( atom.transpilerBusy )
		{
			atom.transpilerBusy = false;
			atom.transpilerProcess = "";
			atom.transpilerBreak = true;
			panels.destroyPanel( waitmessagePanel.panel );			
			setTimeout( function()
			{
				self.handleMessage( { command: 'compile_cancel' } );
			}, 1000 );			
		}
	}

	gotoPreviousError()
	{
		if( atom.elm )
		{
			atom.elm.setAttribute( 'class', 'line' );
		}

		if( buildMessages == undefined || buildMessages.errors == undefined )
		{
			return;
		}
		if ( lastBuildPath != '' )
		{
			// Erase previous error
			if ( lastError )
			{
				lastError.hilight = false;
				this.handleMessage( lastError );
				lastError = null;
			}

			// Navigate to new error
			var message;
			if ( errorPosition > 0 )
			{
				if ( errorScanDirection == 1 )
					errorPosition--;
				message = buildMessages.errors[ errorPosition ];
			}
			else if ( warningPosition > 0 )
			{
				if ( errorScanDirection == 1 )
					warningPosition--;
				message = buildMessages.warnings[ warningPosition ];
			}

			if ( message )
			{
				// Display new error
				var newError =
				{
					command: 'replace',
					type: message.type,
					text: message.text,
					hilight: true
				};
				this.handleMessage( newError );
				lastError = newError;
				atom.lineError =
				{
					command: 'replace',
					type: message.type,
					text: message.text,
					hilight: true,
					message: message
				};
				if( atom.sourcePath )
				{
					// this test was kept if any case may keep separated paths, but I think we should remove this and use only message.path
					let path = message.path
					if( path.substring(0, 1) !== '/' && ![':/', ':\\'].includes(path.substring(1, 3)))
					{
						path = atom.sourcePath + PATH.sep + message.path;
					}
					atom.workspace.open( path );
				}
				this.showLineWithMessage( message );
			}
			errorScanDirection = -1;
		}
		else
		{
			atom.beep();
		}
	}

	gotoNextError()
	{
		if( atom.elm )
		{
			atom.elm.setAttribute( 'class', 'line' );

		}

		if( buildMessages == undefined || buildMessages.errors == undefined )
		{
			return;
		}

		if ( lastBuildPath != '' )
		{
			// Erase previous error
			if ( lastError )
			{
				lastError.hilight = false;
				this.handleMessage( lastError );
				lastError = null;
			}

			// Navigate to new error
			var message;
			if ( errorPosition < buildMessages.errors.length )
			{
				if ( errorScanDirection == -1 )
					errorPosition++;
				message = buildMessages.errors[ errorPosition ];
			}
			else if ( warningPosition < buildMessages.warnings.length )
			{
				if ( errorScanDirection == -1 )
					warningPosition++;
				message = buildMessages.warnings[ warningPosition ];
			}
			
			if ( message )
			{
				// Display new error
				var newError =
				{
					command: 'replace',
					type: message.type,
					text: message.text,
					hilight: true
				};
				this.handleMessage( newError );
				lastError = newError;
				atom.lineError =
				{
					command: 'replace',
					type: message.type,
					text: message.text,
					hilight: true,
					message: message
				};

				if( atom.sourcePath )
				{
					// this test was kept if any case may keep separated paths, but I think we should remove this and use only message.path
					let path = message.path
					if( path.substring(0, 1) !== '/' && ![':/', ':\\'].includes(path.substring(1, 3)))
					{
						path = atom.sourcePath + PATH.sep + message.path;
					}
					atom.workspace.open( path );
				}
				this.showLineWithMessage( message );
			}
			errorScanDirection = 1;
		}
		else
		{
			atom.beep();
		}
	}

	showLineWithMessage( message )
	{
		if( atom.elm )
		{
			atom.elm.setAttribute( 'class', 'line' );
		}
	
		var textEditor = atom.workspace.getActiveTextEditor();
		if( textEditor )
		{
			
			if( message && message.path )
			{
				if( textEditor.buffer.file.path.strReplace( "\\", "/" ) != message.path.strReplace( "\\", "/" ) )
				{
					if( textEditor.buffer.file.path.strReplace( "\\", "/" ) != ( atom.sourcePath + PATH.sep + message.path ).strReplace( "\\", "/" ) )
					{
						return;
					}
				}					

				var screenPosition = textEditor.screenPositionForBufferPosition( [ message.line - 1, message.column ] );
				//textEditor.setCursorBufferPosition( { row: ( message.line - 1 ), column: message.column }, { autoscroll: true } );
				textEditor.scrollToBufferPosition( { row: ( message.line - 1 ), column: message.column }, { center: true } );
				var arr = Array.from( textEditor.component.lineComponentsByScreenLineId );
				var startRow = textEditor.displayLayer.screenLineBuilder.requestedStartScreenRow;
						
				setTimeout( function()
				{
					atom.elm = textEditor.component.element.querySelector( 'div.lines' ).querySelector( 'div[data-screen-row="' + ( message.line - 1 ) + '"]' );
							
					if( atom.elm != undefined )
					{
						atom.elm.addEventListener( "click", function( event )
						{
							event.preventDefault();
							if( atom.elm != undefined )
							{
								atom.elm.setAttribute( 'style', '' );
								atom.elm.setAttribute( 'alt', '' );
								atom.elm.setAttribute( 'class', 'line' );
							}
						}, false );

						if( message.type == 'warning' )
						{
							atom.elm.setAttribute( 'class', 'line warn_line' );
						}
						else
						{
							atom.elm.setAttribute( 'class', 'line error_line' );
						}
						atom.elm.setAttribute( 'alt', message.text );
						atom.elm.setAttribute( 'title', message.text );
					}
				}, 100 );
			}
		}
	}

	openHTML( path, url, runIn, options, args, internal )
	{
		var self = this;
		options = typeof options == 'undefined' ? {} : options;

		setTimeout( function()
		{
			AOZIcons.updateProjectIcons();
		}, 100 );
		if( internal != undefined && internal == true )
		{
			url = path;
		}

		var pathFile = path;

		if( args == undefined )
		{
			args = '';
		}

		// Close the panes with files related to the server
		this.closeLocalPanes( url );

		if ( typeof url == 'undefined' )
		{
			url = 'http://' + atom.aozConfig.installInformation.hostAddress + ':' + atom.aozConfig.installInformation.port + '/index.html';
		}

		// Check parameters
		if ( path )
		{
			if ( PATH.extname( path ).toLowerCase() == '.aoz' )
				path = getDirectoryString( path );

			if ( PATH.basename( path ).toLowerCase() != 'html' )
				path = PATH.resolve( path, './html' );
			this.startServer( path, url );
		}

		// Message
		var messages =
		{
			'atom': atom.aozLang.getTerm( 'waitmessage:opening-app' ),
			'accessory': atom.aozLang.getTerm( 'waitmessage:accessory' ),
			'browser': atom.aozLang.getTerm( 'waitmessage:opening-app-browser' ),
		};
		var text = messages[ runIn ];
		if ( typeof text != 'undefined' )
		{
		this.handleMessage(
		{
			command: 'print',
			text: typeof text == 'undefined' ? atom.aozLang.getTerm( 'transpiler:function-error' ) : text,
		} );
		}

		// Open in good position
		runIn = typeof runIn != 'undefined' ? runIn : 'atom';
		switch( runIn )
		{
			case 'atom':
			case 'atom-devtools':
			case 'directMode':
				if ( options.fileURL )
				{
					pathFile = path + dirSep + 'index.html';
					aozviewer.show( pathFile + '?forced=' + Date.now() + args, atom.aozConfig.aoz_settings.viewerFullPage, url, pathFile, runIn == 'atom-devtools' );
				}
				else if( aozviewer.title == undefined || aozviewer.title == '' || aozviewer.title == 'AOZ Viewer' )
				{
					var editor = atom.workspace.getActiveTextEditor();
					if( editor )
					{
						var parts = pathFile.split( PATH.basename( editor.projectPath ) );
						//var parts = 
						pathFile = 'file://' + parts[ 0 ] + 'html' + dirSep + 'index.html';
					}
					aozviewer.show( pathFile + '?forced=' + Date.now() + args, atom.aozConfig.aoz_settings.viewerFullPage, url, pathFile, runIn == 'atom-devtools'  );
				}
				else
				{
					aozviewer.show( url + '?forced=' + Date.now() + args, atom.aozConfig.aoz_settings.viewerFullPage, url, url, runIn == 'atom-devtools'  );
				}
				return true; 		// Todo, check better with callbacks!
				break;

			case 'debugger':
				aozviewer.showDebugger( cleanPath( atom.aozConfig.installInformation.debuggerPath + '/html/index.html' ), url );
				break;

			case 'accessory':
				var promise = ( atom.workspace.open( url + '?forced=' + Date.now() + args ) );
				promise.then( ( val ) => {
					val.view.urlbar.context.setAttribute( 'style', 'display: none' );
				} )
				return true;
				break;

			case 'browser':
				url += '?forced=' + Date.now() + args;
				require("shell").openExternal( url );
				return true;   		// Todo, check better with callbacks!
				break;
		}
		return false;
	};

	resetTV( options )
	{
		this.handleMessage( { command: 'reset' } );
	};

	searchSelectionInDoc()
	{
		debugger;
		var editor = atom.workspace.getActiveTextEditor();
		var token = atom.aozAPI.getCurrentTokenInfo( {} );
		if( token )
		{
			token = JSON.parse( token );
			atom.docTree.open( token.command.name );
		}
		else
		{
			if( editor )
			{
				atom.docTree.open( editor.getLastSelection().getText() );
			}
		}
	};

	helpOnKeyword()
	{
		aozRequester.showKeywordHelp();
	}

	openAOZWebSite()
	{
		require( "shell" ).openExternal( "https://www.aoz.studio" );
	}

	recompileAll_shortCut()
	{
		if( atom.transpilerBusy )
		{
			atom.aozDialog.showDialog( atom.aozLang.getTerm( 'transpiler:busy-error' ), 'info', 1 );
			return;			
		}
		
		if( atom.aozConfig.installInformation.developperMode )
		{
			recompileAll( function( error )
			{
				console.warn( error );
			} );
		}
	}

	handleTranspilerBusy()
	{
		if ( !atom.transpilerBusy )
		{
			this.buildStatus.style.display = 'none';
			this.warnErrorStatus.style.display = 'inline-block';
		}
		else
		{
			this.warnErrorStatus.style.display = 'none';
			switch( atom.transpilerProcess )
			{
				case 'prepare':
					this.buildStatus.innerHTML = '<img src="' + atom.ICONS.BUILD_STATUS_ICON + '">' + atom.aozLang.getTerm( 'transpiler:build-language' ) + '</img>';
					break;

				case 'build':
					this.buildStatus.innerHTML = '<img src="' + atom.ICONS.BUILD_STATUS_ICON + '">' + atom.aozLang.getTerm( 'transpiler:build-program' ) + '</img>';
					break;
			}
			atom.transpilerProcess = "";
			this.buildStatus.style.display = 'inline-block';
		}
		
		var self = this;
		setTimeout( function()
		{
			self.handleTranspilerBusy();
		}, 100 );
	}

	recompileAll( callback )
	{
		
		atom.transpilerProcess = "prepare";
		document.body.classList.add( 'busy-cursor' );

		this.handleMessage( { command: 'print', text: atom.aozLang.getTerm( 'aoz-studio:recompile-all-ide' ) } );

		atom.aozConfig.aoz_settings.transpilerVersion = atom.transpilerVersion;
		waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:recompile-all' ) );

		// First, compile all modules and extensions with workshop.
		var self = this;
		var logErrors = [];
		setTimeout( function()
		{
			self.handleMessage( { command: 'compile_start' } );

			var count = -1;
			var transpiling = 10;
			var error = false;
			var toTranspile = undefined;

			// Explore the list of things to transpile, leaving 1/2 second betweeen each.
			var handle = setInterval( function()
			{
				if ( toTranspile )
				{
					atom.transpiler_isAOZFile = undefined;
					atom.transpiler_AOZFilename = undefined;
					
					if( PATH.extname( toTranspile ).toLowerCase() == '.aoz' )
					{
						atom.transpiler_isAOZFile = true;
						atom.transpiler_AOZFilename = PATH.basename( toTranspile );					
					}
					
					var tags =
					{
						clean: true,
						rebuild: count == 0 ? [ "extensions", "modules" ] : undefined,
						forceFullScreen: true,
						displayEndAlert: false
					};
					self.buildPath( toTranspile, { tags: tags }, function( response, data, extra )
					{
						if ( response == 'failure' )
						{
							error = true;
							logErrors = logErrors.concat( data.logErrors );
						}
					}, tags );
					toTranspile = undefined;
				}
				else
				{
					if ( !atom.transpilerBusy )
					{
						transpiling++;
						if ( transpiling > 5 )
						{
							count++;
							if ( count < appsToRecompile.length )
							{
								toTranspile = PATH.resolve( appsToRecompile[ count ].strReplace( "%COMMONPATH%", atom.aozConfig.installInformation.commonPath ) );
								transpiling = 0;
							}
							else
							{
								self.handleMessage( { command: 'compile_end' } );
								document.body.classList.remove( 'busy-cursor' );
								clearInterval( handle );
								panels.destroyPanel( waitmessagePanel.panel );

								if ( error )
								{
									buildMessages.errors = logErrors;
									buildMessages.warnings = [];
									self.updateWarnErrorStatus();
									self.showMessagesList();		
									if ( callback )
									{
										callback( false );
									}
								}
								else
								{
									AOZIO.saveHJSON( atom.aozConfig.aoz_settings, atom.userConfigPath + dirSep + 'user.hjson' );
									if ( callback )
									{
										callback( true );
									}
								}
							}
						}
					}
				}
			}, 100 );
		}, 1000 );
	}

	runTV( tags )
	{
		return;
	}

	runTVWithTask( task, callback, extra )
	{
		return;
	}

	showElement( name )
	{

		for ( var e in this.elements )
		{
			this.elements[ e ].visible = ( e == name );
		}
		this.updateElements( true );
	}

	updateElements( force )
	{
		var width = this.rootElement.offsetWidth;
		if ( width == 0 )
			width = 426;
		var height = Math.floor( width * 9 / 16 );
		if ( force || width != this.oldElementWidth )
		{
			this.oldElementWidth = height;
			for ( var e in this.elements )
			{
				var element = this.elements[ e ];
				var visible = element.visible ? 'block' : 'none';
				var style = "position:relative; display:" + visible + "; width: " + width + "px; height: " + height + "px;";
				element.element.setAttribute( "style", style );
				element.element.setAttribute( 'width', width + 'px' );
				element.element.setAttribute( 'height', height + 'px' );
			}
		}
		
		AOZIcons.updateProjectIcons( atom.aozConfig );
		
		if( !consolePanel.opened )
		{
			var css = document.createElement( 'style' );
			css.innerHTML = '.left, div.tool-panel.tree-view, atom-text-editor .gutter-container, atom-text-editor atom-text-editor-minimap, div.scroll-view { height: 100%; }';
			document.body.appendChild( css );

		}
		else
		{
			var css = document.createElement( 'style' );
			css.innerHTML = '.left { height: ' + ( window.innerHeight - 278 ) + 'px;} .tool-panel.tree-view, atom-text-editor .gutter-container, atom-text-editor atom-text-editor-minimap, div.scroll-view { height: ' + ( window.innerHeight - 302 ) + 'px; }';
			document.body.appendChild( css );
		}
	}

	handleMessage( message )
	{
		// Execute command
		var styleBase = getStyle( message );
		var styleString = getStyleString( styleBase );
		switch ( message.command )
		{
			case 'clear':
				this.message.innerHTML = '';
				this.message.scrollTop = this.message.scrollHeight;
				break;

			case 'waiting_start':
				this.message.innerHTML = '';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( 'waiting' );
				break;

			case 'waiting_end':
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( this.logo );
				break;

			case 'compile_start':
				atom.transpilerCancelled = false;
				this.message.innerHTML = '';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( 'busy' );
				break;

			case 'thumbs_up':
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( 'thumbsUp' );
				break;

			case 'publishing':
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( 'publishing' );
				break;

			case 'thumbs_down':
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( 'thumbsDown' );
				break;
			
			case 'compile_cancel':
				atom.transpilerCancelled = true;
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( this.logo );
				
				this.updateWarnErrorStatus();
				if ( buildMessages && buildMessages.errors && buildMessages.errors.length > 0 )
				{
					this.showMessagesList();
					this.gotoNextError();
				}				
				break;
				
			case 'compile_end':
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				if ( !tvBlocked )
					//this.showElement( this.logo );
				
				this.updateWarnErrorStatus();
				if ( buildMessages && buildMessages.errors && buildMessages.errors.length > 0 )
				{
					this.showMessagesList();
					this.gotoNextError();
				}				
				break;

			case 'reset':
				this.elements.application.element.setAttribute( 'src', "about:blank" );
				this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '"></span><br />';
				this.message.scrollTop = this.message.scrollHeight;
				tvBlocked = false;
				//this.showElement( this.logo );
				break;

			case 'print':
			case 'error':
			case 'warning':
			case 'compiler_error':
				var msg = 
				{
					type: ( message.type ) ? message.type : 'info',
					text: message.text 
				}	
				consolePanel.showMessage( msg );
				//this.message.innerHTML = this.message.innerHTML + '<span style="' + styleString + '">' + message.text + '</span><br />';
				//this.message.scrollTop = this.message.scrollHeight;
				break;

			case 'link':
				var msg = 
				{
					type: 'info',
					text: '<a href="' + message.text + '" target="_blank">' + message.text + '</a>' 
				}
				consolePanel.showMessage( msg );
				
//				this.message.innerHTML = this.message.innerHTML + '<a href="' + message.text + '" target="_blank">' + message.text + '</a><br />';
//				this.message.scrollTop = this.message.scrollHeight;
				break;

			case 'replace':
				var start = this.message.innerHTML.lastIndexOf( message.text );
				if ( start >= 0 )
				{
					start = this.message.innerHTML.lastIndexOf( '<span', start );
					var end = this.message.innerHTML.indexOf( '</span>', start );
					if ( end >= 0 )
					{
						end += 7;
						this.message.innerHTML = this.message.innerHTML.substring( 0, start ) + '<span style="' + styleString + '">' + message.text + '</span>' + this.message.innerHTML.substring( end );
					}
				}
				break;

			case 'run':
				atom.workspace.open( message.url );
				//this.elements.application.element.setAttribute( 'src', message.url );
				//this.showElement( 'application' );
				break;
		}

		function getStyle( message )
		{
			var defaultStyles =
			{
				default:
				{
					'width': '100%',
					'color': '#FFFFFF',
					'background-color': 'transparent'
				},
				compiler_error:
				{
					'width': '100%',
					'color': '#CC0000',
					'background-color': 'transparent'
				},
				compiler_warning:
				{
					'width': '100%',
					'color': '#CCCC00',
					'background-color': 'transparent'
				},
				error:
				{
					'width': '100%',
					'color': '#FF0000',
					'background-color': 'transparent'
				},
				warning:
				{
					'width': '100%',
					'color': '#FFFF00',
					'background-color': 'transparent'
				},
				warning_hilight:
				{
					'width': '100%',
					'color': '#FFFFFF',
					'background-color': 'rgba(255, 255, 0, 0.5)'
				},
				error_hilight:
				{
					'width': '100%',
					'color': '#FFFFFF',
					'background-color': 'rgba(255, 0, 0, 0.5)'
				}
			};

			var result = defaultStyles[ 'default' ];
			var type = message.type;
			if ( type )
			{
				if ( message.hilight )
					type += '_hilight';
				if ( defaultStyles[ type ] )
				{
					for ( var s in defaultStyles[ type ] )
					{
						result[ s ] = defaultStyles[ type ][ s ];
					}
				}
			}
			if ( message.style )
			{
				for ( var s in style )
				{
					result[ s ] = style[ s ];
				}
			}
			return result;
		}

		function getStyleString( styleDef )
		{
			var styleString = '';
			for ( var s in styleDef )
			{
				styleString += s + ':' + styleDef[ s ] + '; ';
			}
			return styleString;
		}
	}

	execCommand( command, path, callback, options, extra )
	{
		var self = this;
		try
		{
			var child = EXEC.exec( command, { cwd: path }, function ( msg, stdout, stderr )
			{
				if ( callback )
					callback.call( self, true, { stdout: stdout, stderr: stderr }, extra );
			} );
			child.stdout.on( 'data', function( pipe )
			{
				doPipe( pipe, 'stdout' );
			} );
			child.stderr.on( 'data', function ( pipe )
			{
				doPipe( pipe, 'stderr' );
			} );
			function doPipe( pipe, outputType )
			{
				var type;
				var line = '';
				var paragraph = [];
				for ( var p = 0; p < pipe.length; p++ )
				{
					var c = pipe.charAt( p );
					line += c;
					if ( c == '\n' )
					{
						type = 'default';
						paragraph.push( { text: line, type: type } );
						line = '';
					}
				}
				if ( options.output && paragraph.length )
					self.handleMessage( { command: 'print', text: paragraph } );
			}
		}
		catch ( e )
		{
			if ( callback )
				callback.call( self, false, e, extra );
			return false;
		}
		return true;
	}

	execFile( command, path, callback, options, extra )
	{
		try
		{
			var self = this;
			var child = EXEC.execFile( command, { cwd: path }, function ( msg, stdout, stderr )
			{
				if ( callback )
					callback.call( self, true, { stdout: stdout, stderr: stderr }, extra );
			} );
			child.stdout.on( 'data', function( pipe )
			{
				doPipe( pipe, 'stdout' );
				if ( options.pipeCallback )
					options.pipeCallback( 'stdout', pipe, extra );
			} );
			child.stderr.on( 'data', function ( pipe )
			{
				doPipe( pipe, 'stderr' );
				if ( options.pipeCallback )
					options.pipeCallback( 'stderr', pipe, extra );
			} );
			function doPipe( pipe, outputType )
			{
				var type;
				var line = '';
				var paragraph = [];
				for ( var p = 0; p < pipe.length; p++ )
				{
					var c = pipe.charAt( p );
					line += c;
					if ( c == '\n' )
					{
						type = 'default';
						paragraph.push( { text: line, type: type } );
						line = '';
					}
				}
				if ( options.output && paragraph.length )
					self.handleMessage( { command: 'print', text: paragraph } );
			}
		}
		catch ( e )
		{
			if ( callback )
				callback.call( self, false, e, extra );
			return false;
		}
		return true;
	}

	closeLocalPanes()
	{
		var url = atom.aozConfig.installInformation.hostAddress + ':' + atom.aozConfig.installInformation.port;
		var panes = atom.workspace.getPanes();
		for ( var e = 0; e < panes.length; e++ )
		{
			var pane = panes[ e ];
			var items = pane.getItems();
			for ( var i = 0; i < items.length; i++ )
			{
				var item = items[ i ];
				if ( item.browserPlus && item.url.indexOf( url ) >= 0 )
				{
					item.destroy();
					return true;
				}
			}
		}
		return false;
	}

	getPathToTranspile( options, callback, extra )
	{
		var textEditor = atom.workspace.getActiveTextEditor();
		if ( textEditor )
		{
			if( textEditor.projectPath == undefined || textEditor.projectPath == '' )
			{							
				textEditor.projectPath = SystemAPI.getAOZFilename( PATH.dirname( textEditor.buffer.file.path ), 0, true );
			}
			
			var path = textEditor.projectPath;
			var ext = PATH.extname( path );
			var self = this;
			if ( ext.toLowerCase() == '.aoz' )
			{
				if ( textEditor.isModified() )
				{
					textEditor.save().then( function( textEditor )
					{
						callback.call( self, true, path, extra );
					} ), function( error )
					{
						callback.call( self, false, error, extra );
					};
					return;
				}
				callback.call( self, true, path, extra );
				return;
			}
			else
			{
				// Tries to find ONE main.aoz to transpile...
				var foundEditor;
				var editors = atom.workspace.getTextEditors();
				for ( var e = 0; e < editors.length; e++ )
				{
					var editor = editors[ e ];
					var path = editor.getPath();
					var filename = PATH.basename( path );
					if ( filename.toLowerCase() == 'main.aoz' )
					{
						if ( foundEditor )
						{
							foundEditor = null;
							break;
						}
						foundEditor = editor;
					}
				}
				if ( foundEditor )
				{
					callback.call( self, true, foundEditor.getPath(), extra );
					return;
				}
			}
			callback.call( self, false, null, extra );
		}
	}

	startServer( path, url )
	{
		if ( serverON )
		{
			if ( path != servingPath )
			{
				LIVESERVER.shutdown();
				serverON = false;
			}
		}
		var params =
		{
			port: atom.aozConfig.installInformation.port, 		// Set the server port. Defaults to 8080.
			root: path, 									// Set rootElement directory that's being served. Defaults to cwd.
			host: atom.aozConfig.installInformation.hostAddress, 			// Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
			open: false, 									// When false, it won't load your browser by default.
			wait: 5000, 									// Waits for all changes, before reloading. Defaults to 0 sec.
			logLevel: 1, 									// 0 = errors only, 1 = some, 2 = lots
		};
		this.handleMessage( { command: 'print', text: 'Starting HTTP server on: ' + path + '...' } );
		LIVESERVER.start( params );
		servingPath = path;
		serverON = true;
	}

	stopServer()
	{
		if ( serverON )
		{
			this.handleMessage( { command: 'print', text: 'Halting HTTP server...' } );
			LIVESERVER.shutdown();
			serverON = false;
		}
	}
};

function replaceArguments( args )
{
	if ( args && args != '' )
	{
		var start = args.indexOf( '#' );
		while ( start >= 0 )
		{
			var end = args.indexOf( '#', start + 1 );
			if ( end > start )
			{
				var replace = '';
				var macro = args.substring( start + 1, end );
				switch ( macro )
				{
					case "filePath":
						break;
					case "applicationPath":
						var textEditor = atom.workspace.getActiveTextEditor();
						if ( textEditor )
							replace = textEditor.getPath();
						else
						{
							atom.beep();
							return null;
						}
						break;
					case "aozPath":
						replace = atom.aozConfig.installInformation.aozPath;
						break;
					case "utilities":
						replace = atom.aozConfig.installInformation.runPaths[ 'utilities and others' ];
						break;
					case "transpilerPath":
						replace = atom.aozConfig.installInformation.transpilerPath;
						break;
					case "transpilerVersion":
						replace = atom.transpilerVersion;
						break;
					case "userName":
						replace = atom.aozConfig.aoz_settings.name;
						break;
					case "developperMode":
						replace = atom.aozConfig.aoz_settings.developperMode;
						break;
					case "userNick":
						replace = atom.aozConfig.aoz_settings.pseudo;
						break;
				}
				args = args.substring( 0, start ) + replace + args.substring( end + 1 );
			}
			start = args.indexOf( '#' );
		}
		return args;
	}
	return '';
};




// Utilities
/////////////////////////////////////////////////////////////////////////////////////
function loadIfExist( path, encoding )
{
	return AOZIO.loadIfExist( path, encoding );
};

function getInformations()
{
	return atom.aozConfig.getInformation();
};

function saveJSON( obj, path )
{
	AOZIO.saveJSON( obj, path );
};

function saveHJSON( obj, path )
{
	AOZIO.saveHJSON( obj, path );
};

function deleteDirectory( destinationPath, options, tree, count )
{
	return AOZIO.deleteDirectory( destinationPath, options, tree, count );
};

function openLoadDialog( filters )
{
    var files = REMOTE.dialog.showOpenDialog( REMOTE.getCurrentWindow(), { filters: filters, properties: [ 'openFile' ] } );
    if( files && files.length )
	{
        return files[ 0 ];
    }
    return null;
};

function openSaveDialog( title, path, filters )
{
	path = path.split( "\\\\" ).join( "\\" );
    var path = REMOTE.dialog.showSaveDialog( REMOTE.getCurrentWindow(), { title: title, defaultPath: path, filters: filters, properties: [ 'openFile' ] } );
    return path;
};

function copyDirectory( destination, source, options )
{
	AOZIO.copyDirectory( destination, source, options );
};

function getDirectoryString( path )
{
	return AOZIO.getDirectoryString( path );
};

function cleanPath( path )
{
	return AOZIO.cleanPath( path );
};

function getFileUri( str )
{
    return AOZIO.getFileUri( str );
};

function getDirectory( path, options )
{
	return AOZIO.getDirectory( path, options );
};

function convertArrayBufferToString( arraybuffer )
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var bytes = new Uint8Array( arraybuffer ),
	i, len = bytes.length, base64 = "";

	for (i = 0; i < len; i+=3)
	{
		base64 += chars[bytes[i] >> 2];
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if ((len % 3) === 2)
	{
		base64 = base64.substring(0, base64.length - 1) + "=";
	}
	else if (len % 3 === 1)
	{
		base64 = base64.substring(0, base64.length - 2) + "==";
	}
	return base64;
};

function deleteEmptyFiles( tree )
{
	AOZIO.deleteEmptyFiles( tree )
};
