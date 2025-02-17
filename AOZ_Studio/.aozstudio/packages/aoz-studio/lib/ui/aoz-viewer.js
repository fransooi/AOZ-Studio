const PATH = require( 'path' );
const ATOMDos = require( './aoz-dos.js' );
const TRANSPILER = require( './../transpiler/transpiler' );
const { resourceUsage } = require('process');
const ELECTRON = require( 'electron' );
const REMOTE = ELECTRON.remote;
const BrowserWindow = REMOTE.BrowserWindow;

var AOZViewer = function( panels )
{
	this.title = '';
	this.maximized = false;
	this.panels = panels;
	this.inspectorOpen = false;
	this.resizable = true;
	var self = this;
	this.url = '';
	this.first = true;
	this.cursorPos = undefined;
	this.history = new Array();
	this.currentHisto = 0;
	this.topY = 0;
	this.monitorHeight = 240;
	this.programStopped = false;
	
	this.panel = this.panels.createPanel(
		{
			id: 'aozviewer_panel',
			title: 'AOZ Viewer',
			onClose: function( event )
			{
				self.onClose( event );
			},
			width: ( window.innerWidth / 100 ) * 75,
			height: ( ( window.innerHeight / 100 ) * 75 ) + 32
		}
	);
	this.panel.module = this;

	this.iframe = document.createElement( 'iframe' );
	this.iframe.width = this.panel.width - 2;
	this.iframe.height = this.panel.height - 32;
	this.iframe.setAttribute( 'frameborder', 0 );
	this.iframe.setAttribute( 'style', 'position: relative; width: ' + this.iframe.width + 'px; height: ' + this.iframe.height + 'px;' );
	
	this.iframe.module = this;
	this.panel.btnMaximize.module = this;
	this.panel.btnMaximize.addEventListener( 'click', function( event )
	{
		var elm = document.getElementById( 'dialog_panel' );
		if( elm && elm.style.display != 'none' )
		{
			return;
		}
		if( !this.module.maximized )
		{
			this.module.maximized = true;
			var width = window.innerWidth;
			var height = window.innerHeight;
			this.module.resizeTo( width, height );
			this.style.display = 'none';
			this.module.panel.btnMinimize.style.display = 'block';
		}
	}, false );
	
	this.panel.btnMinimize.module = this;
	this.panel.btnMinimize.addEventListener( 'click', function( event )
	{
		var elm = document.getElementById( 'dialog_panel' );
		if( elm && elm.style.display != 'none' )
		{
			return;
		}
		if( this.module.maximized )
		{
			this.module.maximized = false;
			var width = ( window.innerWidth / 100 ) * 75;
			var height = ( ( window.innerHeight / 100 ) * 75 ) + 40;
			this.module.resize( width, height );
			this.style.display = 'none';
			this.module.panel.btnMaximize.style.display = 'block';
		}
	}, false );	

	this.panel.addEventListener( 'click', function( event )
	{
		var elm = document.getElementById( 'dialog_panel' );
		if( elm && elm.style.display != 'none' )
		{
			return;
		}
		this.style.zIndex = 200;
		
		var elm = document.getElementById( 'console_panel' );
		if( elm )
		{
			elm.style.zIndex = 100;
		}
		this.module.maskFocus.style.display = 'none';

	}, false );

	this.maskFocus = document.createElement( 'div' );
	this.maskFocus.module = this;
	this.maskFocus.setAttribute( 'id', 'mask_focus' );
	
	this.maskFocus.addEventListener( 'click', function( event )
	{
		var elm = document.getElementById( 'dialog_panel' );
		if( elm && elm.style.display != 'none' )
		{
			return;
		}
		this.module.panel.style.zIndex = 200;
		this.module.iframe.focus();
		
		var elm = document.getElementById( 'console_panel' );
		if( elm )
		{
			elm.style.zIndex = 100;
		}
		this.style.display = 'none';
	}, false );	

	this.panel.appendChild( this.iframe );
	this.panel.appendChild( this.maskFocus );
	
	/**
	
	>>> NEW AOZ CONSOLE ;)
	
	*/
	if( atom.isDirectMode )
	{
		this.createConsoleDebug();
	}

	this.iconControl = document.createElement( 'img' );
	this.iconControl.setAttribute( 'id', 'icon_control' );
	this.iconControl.setAttribute( 'src', atom.IMAGES.ICON_STOP );
	this.iconControl.setAttribute( 'title', 'Stop Program ( Ctrl + C )' );
	this.iconControl.setAttribute( 'alt', 'Stop Program ( Ctrl + C )' );	
	this.panel.appendChild( this.iconControl );

	this.iconControl.addEventListener( 'click', function( event )
	{
		if( self.programStopped == false )
		{
			self.iframe.contentWindow.application.aoz.break = true;
			self.stopProgram();
		}
		else
		{
			self.reloadProgram()				
		}
	}, false );

	var top = REMOTE.getCurrentWindow();
	if( top )
	{
		top.on( 'resize', () =>
			{
				self.resize();
			}
		);

		top.on( 'move', () =>
			{
				self.resize();
			}
		);
	}

	this.directModeIcon = document.createElement( 'img' );
	this.directModeIcon.setAttribute( 'id', 'dm_icon' );
	this.directModeIcon.setAttribute( 'src', atom.IMAGES.ICON_DIRECT_MODE_OFF );
	this.directModeIcon.setAttribute( 'title', '' );
	this.directModeIcon.setAttribute( 'alt', '' );
	this.panel.appendChild( this.directModeIcon );
	
	var self = this;
	this.directModeIcon.addEventListener( 'click', function( event )
	{
		if( self.programStopped )
		{
			if( self.monitor == undefined )
			{
				self.createConsoleDebug();
			}
			self.monitor.style.display = 'block';
			self.inspector.style.display = 'block';		
			atom.openDirectMode();

		}
	}, false );


	atom.openDirectMode = function( force )
	{
		if ( !force )
		{
			if( self.directModeIcon.style.display == 'none' )
			{
				if( self.monitor.style.display == 'none' )
				{
					self.directModeIcon.style.display = 'block';
					return;
				}				
			}
		}
		
		if( self.first )
		{
			self.first = false;
			self.openDirectMode();
		}
		
		/**
		self.monitor.value = "AOZ Direct Mode console.\r\nPlease type any command.\r\n\r\n> ";
		self.monitor.commandPos = self.monitor.value.length - 1;
		*/
		if( self.monitor == undefined )
		{
			self.createConsoleDebug();
		}
		self.inspector.style.display = 'block';
		self.monitor.style.display = 'block';
		self.monitor.focus();		
		var handle = setInterval( function()
		{
			if ( self.monitor.contentWindow && typeof self.monitor.contentWindow.application != 'undefined' && typeof self.monitor.contentWindow.application.vars != 'undefined' )
			{
		self.monitor.contentWindow.application.vars.runConsole = true;
				clearInterval( handle );
			}
		}, 20 );
	}
	
	atom.printLine = function( strText, nextConsoleLine )
	{
		//if( strText.trim() != "" )
		{
			self.monitor.contentWindow.application.vars.PRINTLINE$ = strText;
			if ( nextConsoleLine )
			{
				setTimeout( function()
				{
					self.monitor.contentWindow.application.vars.PRINTLINE$ = '__nextconsoleline__';
				}, 50 );
			}
		}
	}
	
	atom.closeAOZViewer = function()
	{
		self.onClose();
		atom.isDirectMode = false;
		if( this.monitor )
		{
			this.panel.removeChild( this.inspector );			
			this.panel.removeChild( this.monitor );
			this.monitor.src = 'about:blank';
			delete this.monitor;
		}

		var elm = document.getElementById( 'aozrequester_panel' );
		if( elm )
		{
			elm.style.display = 'none';
		}

		elm = document.getElementById( 'aoz_link' );
		if( elm )
		{
			elm.style.display = 'none';
		}

		if( atom.aozNotifier.layer.style.display == 'block' && atom.aozNotifier.fromAOZViewer )
		{
			 atom.aozNotifier.close();
		}
		self.panels.destroyPanel( self.panel );
	}
	
	this.orientation = false;
	this.iconOrient = document.createElement( 'img' );
	this.iconOrient.setAttribute( 'id', 'btnOrient' );
	this.iconOrient.setAttribute( 'src', atom.IMAGES.ICON_ORIENTATION );
	this.iconOrient.addEventListener( 'click', function( event )
	{
		var width = self.manifest.display.width;
		var height = self.manifest.display.height;
		var ratio = width / height;
		
		self.orientation = !self.orientation;
		if( self.orientation )
		{
			width = ( window.innerHeight / 100 ) * 85;
			self.resizeTo( ( width ) / ratio, width );
		}
		else
		{
			width = ( window.innerWidth / 100 ) * 85;
			self.resizeTo( width, width / ratio );
		}

		//self.resize();
		if( self.orientation && self.manifest )
		{
			if( self.manifest.display.height > self.manifest.display.width )
			{
				self.iframe.contentWindow.application.aoz.orientation = "landscape";
			}
			else
			{
				self.iframe.contentWindow.application.aoz.orientation = "portrait";
			}
		}
		else
		{
			if( self.manifest.display.height > self.manifest.display.width )
			{
				self.iframe.contentWindow.application.aoz.orientation = "portrait";
			}
			else
			{
				self.iframe.contentWindow.application.aoz.orientation = "landscape";
			}			
		}
		
		if( self.iframe.contentWindow.application.aoz.renderer )
		{
			self.iframe.contentWindow.application.aoz.renderer.updateForScreenOrientation( null,  );
		}
		
	}, false );
	this.panel.appendChild( this.iconOrient );
	
	this.iconDebug = document.createElement( 'img' );
	this.iconDebug.setAttribute( 'id', 'btnDebug' );
	this.iconDebug.setAttribute( 'src', atom.IMAGES.ICON_DEBUG );
	this.iconDebug.addEventListener( 'click', function( event )
	{
		if ( self.iframe.contentWindow.application.aoz.onMessage( { command: 'isDebugger' } ) )
			self.iframe.contentWindow.application.aoz.onMessage( { command: 'hideDebugger' } );
		else 
			self.iframe.contentWindow.application.aoz.onMessage( { command: 'showDebugger', parameters: { visible: true, mode: 'play' } } );
		//require( 'remote' ).getCurrentWindow().toggleDevTools();
	}, false );	
	this.panel.appendChild( this.iconDebug );
	
	atom.fileSystem = new ATOMDos();
	this.manifest = undefined;
	atom.AOZViewer = this;

};

AOZViewer.prototype.createConsoleDebug = function()
{
	var self = this;
	this.inspector = document.createElement( 'div' );
	this.inspector.setAttribute( 'id', 'inspector_buttons' );
	this.inspector.setAttribute( 'style', 'bottom: ' + ( this.topY + ( this.monitorHeight + 4 ) ) + 'px;' );
	this.inspector.module = this;
	
	var labels = new Array( 'Listbank', 'Listvars', 'Appinfo', 'Reload', 'URL', 'Display', 'Show Zones', 'Hide' );
	for( var b = 0; b < labels.length; b++ )
	{
		var button = document.createElement( 'button' );
		button.setAttribute( 'id', 'button_insp_' + b );
		button.setAttribute( 'class', 'aoz-button inspector_command' );
		button.innerHTML = labels[ b ];
		
		button.addEventListener( 'click', function( event )
		{
			self.executeCommand( this.innerHTML );			
		}, false );
		
		this.inspector.appendChild( button );
	}
	this.panel.appendChild( this.inspector );

	this.monitor = document.createElement( 'iframe' );
	this.monitor.setAttribute( 'id', 'monitor' );
	this.monitor.setAttribute( 'frameborder', '0' );
	this.monitor.setAttribute( 'class', 'native-key-bindings' );
	this.monitor.setAttribute( 'style', 'height: ' + this.monitorHeight + 'px; bottom: ' + this.topY + 'px;' );	
	this.monitor.module = this;
	this.monitor.commandPos = 0;
	this.monitor.keyPressed = false;
	this.monitor.src = 'file:' + PATH.sep + PATH.sep + atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' + PATH.sep + 'console' + PATH.sep + 'html' + PATH.sep + 'index.html';	

	this.monitor.addEventListener( 'keydown', function( event )
	{
		if( this.keyPressed )
		{
			return;
		}
			
		this.keyPressed = true;
		if( event.key == 'Escape' )
		{
			atom.closeAOZViewer();
			return;
		}
/**		
		if( event.key == 'ArrowDown' )
		{
			event.preventDefault();
			if( event.ctrlKey )
			{
				self.topY = self.topY - 16;
				self.inspector.style.bottom = ( self.topY + ( self.monitorHeight + 4 ) ) + 'px';
				self.monitor.style.bottom = self.topY + 'px';
				return;
			}
			else
			{
				if( event.shiftKey )
				{
					if( self.monitorHeight > 120 )
					{
						self.monitorHeight = self.monitorHeight - 4;
						self.monitor.style.height = self.monitorHeight + 'px';
						self.inspector.style.bottom = ( self.topY + ( self.monitorHeight + 4 ) ) + 'px';
					}
				}
				return false;
			}
		}
		
		if( event.key == 'ArrowUp' )
		{
			event.preventDefault();
			if( event.ctrlKey )
			{
				self.topY = self.topY + 16;
				self.inspector.style.bottom = ( self.topY + ( self.monitorHeight + 4 ) ) + 'px';
				self.monitor.style.bottom = self.topY + 'px';
				return;
			}
			else
			{
				if( event.shiftKey )
				{
					if( self.monitorHeight < 400 )
					{
						self.monitorHeight = self.monitorHeight + 4;
						self.monitor.style.height = self.monitorHeight + 'px';
						self.inspector.style.bottom = ( self.topY + ( self.monitorHeight + 4 ) ) + 'px';
					}
				}
				else
				{
					return false;
				}
			}
		}
		
		if( event.key == 'Enter' )
		{
			event.preventDefault();
			var value = this.value.substr( this.commandPos, this.value.length - this.commandPos );
			this.module.executeDirectModeCommand( value );
			this.module.history.push(  value );
			this.module.currentHisto = this.module.history.length;
			return false;
		}
*/
	}, false );

	this.monitor.addEventListener( 'keyup', function( event )
	{
		this.keyPressed = false;
	}, false );
	

	this.panel.appendChild( this.monitor );
};

AOZViewer.prototype.stopProgram = function( obj )
{
	this.programStopped = true;
	this.iconControl.setAttribute( 'src', atom.IMAGES.ICON_PLAY );
	this.iconControl.setAttribute( 'title', 'Restart Program' );
	this.iconControl.setAttribute( 'alt', 'Restart Program' );
	
	var title = '';
	var errorMessage = '';
	var line = 1;
	var column = 1;

	//debugger;
	if( obj && obj.aoz && obj.aoz.manifest && obj.aoz.manifest.compilation && obj.aoz.manifest.compilation.displayEndAlert === true )
	{	
		if( obj && obj.errorObject )
		{
			title = obj.errorObject.message;
			if ( obj.lastErrorPos )
			{
				var pos = obj.lastErrorPos.split( ':' );
				var number = parseInt( pos[ 0 ] );
				line = parseInt( pos[ 1 ] ) + 1;
				column = parseInt( pos[ 2 ] ) + 1;
				errorMessage = obj.errors.getError( 'at_line' ).message + line + ', ';
				errorMessage += obj.errors.getError( 'at_column' ).message + column;
				
				var editor = atom.workspace.getActiveTextEditor();
				if( editor )
				{
					var screenPosition = editor.screenPositionForBufferPosition( [ line - 1, column - 1 ] );
					editor.setCursorScreenPosition( screenPosition, { autoscroll: true } );
					
					var arr = Array.from( editor.component.lineComponentsByScreenLineId );
					var startRow = editor.displayLayer.screenLineBuilder.requestedStartScreenRow;

					setTimeout( function()
					{		
						if( atom.elm )
						{
							atom.elm = editor.component.element.querySelector( 'div.lines' ).querySelector( 'div[data-screen-row="' + ( line - 1 ) + '"]' );
							atom.elm.style.backgroundColor = '#880000';
							atom.elm.setAttribute( 'alt',  title + errorMessage );
							atom.elm.setAttribute( 'title',  title + errorMessage );
						}
					}, 1000 );
				}
				atom.aozNotifier.show( atom.IMAGES.ICON_ERROR, title, errorMessage, undefined, true, true, true ); 				
			}	
		}
		else
		{
			errorMessage = '.';
			if ( obj && obj.sourcePos )
			{
				var pos = obj.sourcePos.split( ':' );
				line = parseInt( pos[ 1 ] ) + 1;
				column = parseInt( pos[ 2 ] ) + 1;
				errorMessage = ' at line ' + line;
			}

			if ( obj && obj.section == null )
				title = 'End of program';
			else
				title = ( obj && obj.badEnd ) ? 'Program interrupted' : 'End of program';
				
					
			atom.aozNotifier.show( atom.IMAGES.ICON_STOP_CODE, '', title + errorMessage, undefined, true, true, true ); 	
		}
			
		this.iconControl.setAttribute( 'src', atom.IMAGES.ICON_PLAY );
		this.iconControl.setAttribute( 'title', 'Reload Program' );
		this.iconControl.setAttribute( 'alt', 'Reload Program' );
		this.directModeIcon.setAttribute( 'src', atom.IMAGES.ICON_DIRECT_MODE_ON );
		this.directModeIcon.setAttribute( 'title', 'Open Direct Mode' );
		this.directModeIcon.setAttribute( 'alt', 'Open Direct Mode' );
	}
	else
	{
		//atom.closeAOZViewer();		
	}		
};

AOZViewer.prototype.reloadProgram = function()
{
	atom.aozNotifier.close();
	this.programStopped = false;
	this.iconControl.setAttribute( 'src', atom.IMAGES.ICON_STOP );
	this.iconControl.setAttribute( 'title', 'Stop Program ( Ctrl + C )' );
	this.iconControl.setAttribute( 'alt', 'Stop Program ( Ctrl + C )' );
	if( this.monitor )	
	{			
		this.monitor.value = "";		
		this.inspector.style.display = 'none';
		this.monitor.style.display = 'none';
	}
	this.directModeIcon.setAttribute( 'src', atom.IMAGES.ICON_DIRECT_MODE_OFF );
	this.directModeIcon.setAttribute( 'title', '' );
	this.directModeIcon.setAttribute( 'alt', '' );			
	this.iframe.contentWindow.focus();			
	this.iframe.contentWindow.location.reload(true);	
};

AOZViewer.prototype.openDirectMode = function()
{
	var self = this;
	atom.aozNotifier.close();
};

AOZViewer.prototype.executeDirectModeCommand = function( value, args )
{
	var self = this;
	if( self.monitor && value == undefined || value.trim() == "" )
	{
		self.monitor.focus();
		return;
	}

	// Tag to recompile everything?
	if ( value.indexOf( '#idetranspileall' ) >= 0 )
	{
		atom.closeAOZViewer();
		setTimeout( function()
		{
			atom.aozStudioView.recompileAll();
		}, 500 );
		return;
	}
	this.directModeCommand = undefined;
	TRANSPILER.transpileCommand( value, { tags: args.tags, specialFolders: AOZConfig.installInformation.paths }, function( response, data, extra )
	{
		if ( args.callback )
		{
			args.callback( response, data, extra );
		}
		else
		{
			if ( response )
			{
				try
				{
					self.directModeCommand = data;
				}
				catch( err )
				{
					atom.printLine( "Security error.", true );
				}
			}
			else
			{
				atom.printLine( data, true );
			}
		}
		//
		//setTimeout( function()
		//{
		//	self.monitor.value = self.monitor.value + "\r\n> ";	
		//	self.monitor.commandPos = self.monitor.value.length - 1;
		//	self.monitor.scrollTop = self.monitor.scrollHeight;
		//	self.monitor.focus();
		//}, 500 );
		//
	} );
};
AOZViewer.prototype.getDirectCommand = function()
{
	var command = this.directModeCommand;
	this.directModeCommand = undefined;
	return command;
};

AOZViewer.prototype.executeCommand = function( value )
{
	if( this.monitor == undefined )
	{
		return;	
	}

	if( value == undefined || value.trim() == "" )
	{
		return;
	}
	
	value = value.trim();
	//var parts = value.toLowerCase().split( " " );
	var messenger = this.monitor;
	var message = "";
	var aoz_vars = 	this.iframe.contentWindow.application.vars;
	var aoz_banks = this.iframe.contentWindow.application.aoz.banks;
	var platform = this.iframe.contentWindow.application.manifest.compilation.platform;
	var breakline = "\r\n";
	
	switch( value.toLowerCase() )
	{
		
		case "help":
		case "?":
			message = breakline + "Inspector commands" + breakline + "help or ?: This help" + breakline;
			message += "appinfo: Program information." + breakline;
			message += "display: Display Information." + breakline;
			message += "listvars: Displays the list of variables." + breakline;
			message += "listbank: Displays the list of banks." + breakline;
			message += "reload: Reload your application." + breakline;
			message += "url: Displays the URL of this application and copy it into the clipboard." + breakline;
			message += "exit: Hide the inspector." + breakline;
			break;
			
		case 'appinfo':
			var infos = this.iframe.contentWindow.application.manifest.infos;
			message = "" + breakline;
			message += "Application name: " + infos.applicationName + breakline;
			message += "Version: " + infos.version + breakline;
			message += "Author: " + infos.author + breakline;
			message += "Copyright: " + infos.copyright + breakline;
			message += "Date: " + infos.date + breakline;
			break;
			
		case 'display':
			var screen = this.iframe.contentWindow.application.manifest.default.screen;
			var display = this.iframe.contentWindow.application.manifest.display;
			message = "" + breakline;
			message += "Width: " + display.width + breakline;
			message += "Height: " + display.height + breakline;
			message += "Screen Width: " + screen.width + breakline;
			message += "Screen Height: " + screen.height + breakline;
			
			if( platform == 'amiga' )
			{
				message += "Number of colors: " + screen.numberOfColors + breakline;
			}
			else
			{
				message += "Number of colors: TrueColor" + breakline;
			}
			
			message += "Height: " + display.height + breakline;
			message += "TV Standard: " + display.tvStandard + breakline;
			message += "Scale X: " + display.scaleX + breakline;
			message += "Scale Y: " + display.scaleY + breakline;
			message += "Keep proportions: " + ( ( display.keepProportions ) ? "True" : "False" ) + breakline;
			break;
		
		case 'listvars':
			for(var b in aoz_vars) { 
				if( aoz_vars.hasOwnProperty( b ) )
				{
					message += this.messageVariable( aoz_vars, b );
				}						
			}
			break;

		case 'listbank':
			message = "" + breakline;
			var banks = aoz_banks.banks;
			if( banks == undefined || banks.length == 0 )
			{
				message += breakline + "No bank." + breakline;
			}
			else{
				for( var b = 0; b < banks.length; b++ ) { 
					if( banks[ b ] != undefined && banks[ b ].application != undefined )
					{
						if( banks[ b ].application.context.numberOfElements > 0 )
						{
							message += banks[ b ].application.index + " - " + banks[ b ].application.domain.toUpperCase() + ": " + banks[ b ].application.context.numberOfElements + " element(s)" + breakline;
						}
					}
				}
			}
			break;
			
		case 'exit':
		case 'edit':
			atom.closeAOZViewer();
			break;
			
		case 'reload':
			this.reloadProgram();
			break;
		
		case 'url':
			message = "" + breakline;
			message += "URL: " + this.url + " ( copied into the clipboard )" + breakline;;
			atom.clipboard.write( this.url );
			break;
		
		case 'application':
			console.log( this.iframe.contentWindow.application );
			break;

		case 'show zones':
			message = "";
			var zones = this.iframe.contentWindow.application.aoz.currentScreen.zones;
			console.log( zones );
			
			if ( zones )
			{
				message = ""
				message += "SCR = Screen : Screen Open 100, Screen Width, Screen Height, 32, Lowres : Screen Hide 100 : Curs Off: Flash Off : Colour 1000, $00FF00 : Colour 1001, $FF0000 : Colour 1002, $000000\r\n";
				var z = 1;
				if ( zones.length )
				{
				zones.forEach( function( zone ) 
				{
					if( zone != undefined )
					{
						if( zone.enable )
						{
							message += "Ink 1000\r\n";
						}
						else
						{
							message += "Ink 1001\r\n";
						}

						message += "Box " + zone.x	 + ", " + zone.y + ", " + zone.width + ", " + zone.height + "\r\n";  
						message += "Box " + ( zone.x + 1 ) + ", " + ( zone.y + 1 ) + ", " + ( zone.width - 2 ) + ", " + ( zone.height - 2 ) + 
						"\r\n";
						message += "Bar " + zone.x	 + ", " + zone.y + ", 24, 24\r\n";  
						message += "Ink 1002 : Text " + ( zone.x + 12 ) + ", " + ( zone.y + 20 ) + ", \""  + z + "\", \"#center\"\r\n";  
						message += "Get Bob \"aoz_zones\", 0, 0, Screen Width, Screen Height\r\n";
						message += "Screen SCR : Colour 1000, $00FF00 : Colour 1001, $FF0000 : Colour 1002, $000000 : Bob \"aoz_bob\", 0, 0, \"aoz_zones\"\r\n";						
					}
					z++;
				} );
					this.executeDirectModeCommand( message );
				}
			}
			message = "";
			break;
		case 'hide':
			this.directModeIcon.style.display = 'block';
			this.monitor.style.display = 'none';
			this.inspector.style.display = 'none';			
			break;
		default:
			message = "";
			break;
			
	}

	if( message != undefined && message.trim() != "" )
	{
		/*
		this.monitor.value = this.monitor.value + message + "> ";
		this.monitor.commandPos = this.monitor.value.length - 1;
		this.panel.style.zIndex = 100;
		this.maskFocus.style.display = 'block';
		this.monitor.scrollTop = this.monitor.scrollHeight;
		*/
		this.monitor.focus();
		atom.printLine( message, true );
	}

};

AOZViewer.prototype.messageVariable = function( aoz_vars, varName )
{
	var breakline = "\r\n";
	var message = "" + breakline;
	
	var varName2 = varName.split( "_array" );
	if ( varName2.length == 2 )
	{
		varName = varName2[ 0 ];
	}
	
	var variable = varName.trim();
	var value = aoz_vars[ variable.toLowerCase() ];
	
	if( value == undefined )
	{
		value = aoz_vars[ variable.toUpperCase() ];
	}

	if( value == undefined )
	{
		value = aoz_vars[ variable.toLowerCase() + "_array" ];
	}
	
	if( value == undefined )
	{
		value = aoz_vars[ variable.toUpperCase() + "_array" ];
	}
	
	if( value == undefined )
	{
		message = "!!! Variable " + variable + " not declared." + breakline;
	}
	else
	{
		if( value.array )
		{
			message = variable + '(';
			for ( var d = 0; d < value.dimensions.length; d++ )
				message += ' ' + value.dimensions[ d ] + ',' ;
			message = message.substring( 0, message.length - 1 ) + ' )' + breakline;

			var dims = [];
			for ( var d = 0; d < value.dimensions.length; d++ )
				dims.push( 0 );
			var text = '';
			if ( value.dimensions.length > 2 )
				message += '...' + breakline;
			else if ( value.dimensions == 1 )
			{
				for ( var n = 0; n <= value.dimensions[ 0 ]; n++ )
				{
					dims[ 0 ] = n;
					text += value.getValue( dims );
					if ( text.length >= 78 )
					{
						text += '...';
						break;
					}
					if ( n < value.dimensions[ 0 ] )
						text += ',';
				}
				message += text;
			}
			else ( value.dimensions == 2 )
			{
				for ( var n1 = 0; n1 <= value.dimensions[ 0 ] && n1 < 10; n1++ )
				{
					for ( var n2 = 0; n2 <= value.dimensions[ 1 ]; n2++ )
				{
						dims[ 0 ] = n1;
						dims[ 1 ] = n2;
						text += value.getValue( dims );
						if ( text.length >= 78 )
						{
							text += '...';
							break;
						}
						if ( n2 < value.dimensions[ 1 ] )
							text += ',';
					}	
					message += text + breakline;
					text = '';
				}
			}
		}
		else
		{
			if( isNaN( value ) )
			{
				message = variable + " = '" + value + "'" + breakline;
			}
			else
			{
				message = variable + " = '" + value + "'" + breakline;
			}
		}
	}
	return message;
};

AOZViewer.prototype.onClose = function( event )
{
	this.iframe.src = "about:blank";
	atom.aozNotifier.close();
	
	var editor = atom.workspace.getActiveTextEditor();
	if( editor && this.cursorPos )
	{
		editor.component.element.focus();
		editor.setCursorBufferPosition( this.cursorPos );
	}
};

AOZViewer.prototype.showDebugger = function( url, applicationUrl )
{	
	atom.workspace.element.blur();
	atom.workspace.element.blur();

	url = url.strReplace( '\\', "/" );
	this.executeProgram( url, { configId: url } );
	return;
}

AOZViewer.prototype.show = function( url, fullPage, httpUrl, configId, openDevTools )
{	

	atom.workspace.element.blur();
	atom.workspace.element.blur();

	if( httpUrl != undefined )
	{
		url = httpUrl;
	}
	url = url.strReplace( '\\', "/" );
	this.executeProgram( url, { configId: configId, openDevTools: openDevTools } );
	return;
	
	var editor = atom.workspace.getActiveTextEditor();
	if( editor )
	{
		editor.element.blur();
		editor.element.disabled = true;
	}

	this.iconOrient.style.display = 'none';
	this.iconDebug.style.display = 'none';
	atom.aozNotifier.close();
	
	this.programStopped = false;
	this.manifest = undefined;
	this.iconControl.setAttribute( 'src', atom.IMAGES.ICON_STOP );
	this.iconControl.setAttribute( 'title', 'Stop Program ( Ctrl + C )' );
	this.iconControl.setAttribute( 'alt', 'Stop Program ( Ctrl + C )' );
	if( this.monitor )
	{				
		this.monitor.value = "";		
		this.inspector.style.display = 'none';
		this.monitor.style.display = 'none';
	}
	this.directModeIcon.setAttribute( 'src', atom.IMAGES.ICON_DIRECT_MODE_OFF );
	this.directModeIcon.setAttribute( 'title', '' );
	this.directModeIcon.setAttribute( 'alt', '' );
	
	this.cursorPos = undefined;
	var editor = atom.workspace.getActiveTextEditor();
	if( editor )
	{
		this.cursorPos = editor.getCursorBufferPosition();
	}
	
	if( httpUrl != undefined )
	{
		this.url = httpUrl;
	}

	if( inspector == undefined )
	{
		inspector = true;
	}

	if( this.title == undefined || this.title == '' )
	{
		this.title = 'AOZ Viewer';
		inspector = true;
	}

	if( this.title != 'AOZ Viewer' && this.title != "AOZ WorkShop" )
	{
		inspector = false;
	}

	if( workshop == undefined )
	{
		workshop = false;
	}

	var width = ( window.innerWidth / 100) * 75;
	var height = ( ( window.innerHeight / 100) * 75 ) + 40;
	if( fullPage )
	{
		width = window.innerWidth;
		height = window.innerHeight;
		this.panel.btnMaximize.style.display = 'none';
		this.panel.btnMinimize.style.display = 'block';
		this.maximized = true;
		this.resizable = false;
	}
	else
	{
		this.panel.btnMaximize.style.display = 'block';
		this.panel.btnMinimize.style.display = 'none';
		this.maximized = false;
		this.resizable = true;
	}
	
	if( this.panel.titleElement != undefined )
	{
		if( this.title != '' )
		{
			this.panel.titleElement.innerHTML = this.title;
			this.title = '';
		}
		else
		{
			this.panel.titleElement.innerHTML = 'AOZ Viewer';
		}
	}
	
	if( this.monitor )
	{
		if( workshop )
		{
			this.inspector.style.display = 'block';
			this.monitor.style.display = 'block';
			this.first = false;
			atom.openDirectMode();	
		}
		else
		{	
			this.inspector.style.display = 'none';
			this.monitor.style.display = 'none';
		}
		
		this.inspectorOpen = false;
		this.inspector.value = '';
		this.monitor.innerHTML = '';
	}

	this.resizeTo( width, height );
	
	setTimeout( this.loadURL( url ), 500 );
	this.panels.showPanel( this.panel );

	var self = this;
	setTimeout( function()
	{
		self.iframe.contentWindow.focus();
		try
		{
			self.iframe.contentWindow.application.aoz.atom = atom;
		}
		catch( e ){}
		
		self.resize();
	}, 500 );

}

AOZViewer.prototype.loadURL = function( url )
{
	this.iframe.src = url;
}

AOZViewer.prototype.setManifest = function( manifest )
{
	this.manifest = manifest;
	this.iconOrient.style.display = 'none';
	
	if( this.manifest )
	{
		if( this.manifest.infos && this.manifest.infos.type && ( this.manifest.infos.type == 'mobile' || this.manifest.infos.type == 'web' ) )
		{
			this.iconOrient.style.display = 'block';
		}
		
		if( this.manifest.display && this.manifest.display.orientation_detection && this.manifest.display.orientation_detection == 'autodetect' )
		{
			this.iconOrient.style.display = 'block';			
		}
	}
	this.orientation = false;
	this.iconDebug.style.display = 'block';

/**	
	if( atom.aozConfig.aoz_settings.developperMode )
	{
		this.iconDebug.style.display = 'block';
	}	
	else
	{
		this.iconDebug.style.display = 'none';
	}
*/
	this.resize();
};

AOZViewer.prototype.resize = function()
{
	
	var width = ( window.innerWidth / 100) * 85;
	var height = ( ( window.innerHeight / 100) * 85 ) + 40;
	var ratio = width / height;
	this.resizable = true;
	
	if( this.manifest )
	{

		if( this.manifest.display.width >= this.manifest.display.height )
		{
			ratio = this.manifest.display.width / this.manifest.display.height;
			width = ( window.innerWidth / 100) * 85;
			height = width / ratio;
		}
		else
		{
			ratio = this.manifest.display.height / this.manifest.display.width; 
			height = ( window.innerHeight / 100) * 85;
			width = height / ratio;
		}

		if( width > window.innerWidth )
		{
			width = ( window.innerWidth / 100 ) * 85;
			height = width / ratio;
		}
		
		if( height > window.innerHeight )
		{
			height = ( window.innerHeight / 100 ) * 85;
			width = height * ratio;
		}

		if( this.orientation )
		{
			var mh = height;
			height = width;
			width = mh;
		}
	}
	
	if( this.maximized )
	{
		width = window.innerWidth;
		height = window.innerHeight;
		this.resizable = false;
	}

	this.resizeTo( width, height );

}

AOZViewer.prototype.resizeTo = function( width, height )
{
	
	this.panel.width = width;
	this.panel.height = height;
	this.panel.style.width = width + 'px';
	this.panel.style.height = height + 'px';
	
	this.iframe.width = width - 2;
	this.iframe.height = height - 32;
	this.iframe.style.width = this.iframe.width + 'px';
	this.iframe.style.height = this.iframe.height + 'px';
	
	if( !this.maximized )
	{
		var lf = ( window.innerWidth - this.panel.width ) / 2;
		var tp = ( window.innerHeight - this.panel.height ) / 2;
		
		this.panel.style.left = lf + 'px';
		this.panel.style.top = tp + 'px';
	}
	else
	{
		this.panel.style.left = '0px';
		this.panel.style.top = '0px';
	}
}
AOZViewer.prototype.toggleDevTools = function()
{
	this.devToolsOn = !this.devToolsOn;
	this.win.webContents.toggleDevTools();
}
AOZViewer.prototype.executeProgram = function( path, options )
{
	var self = this;
	options = typeof options == 'undefined' ? { search: '', hash: '' } : options;

	var configId;
	if( this.win == undefined )
	{
		var x = undefined;
		var y = undefined;
		var width = 800;
		var height = 500;
		
		var devToolsOn = false;
		if ( options.configId )
		{
			configId = '"' + options.configId + '"';
			var info = atom.aozConfig.aoz_settings.windowPositions[ configId ];
			if ( info )
			{
				x = info.x;
				y = info.y;
				width = info.width;
				height = info.height;
				devToolsOn = info.devToolsOn
			}
		}
        this.win = new BrowserWindow( 
		{ 
			parent: atom.currentWindow,
			title: 'AOZ Viewer',
			resizable: true,
			moveable: true,
			x: x,
			y: y,
			width: width,
			height: height,
			show: false,
			icon: atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'icons' + PATH.sep + 'aoz-viewer.png',
			webPreferences:
			{
				devTools: true,
				webSecurity: false,
				allowRunningInsecureContent: true			
			}
		} );
		this.win._aozConfigId = configId;
        this.win.removeMenu();
		this.webToolsOn = false;
		//if ( options.openDevTools )
		//	this.toggleDevTools();
	}
	else
	{
		this.win.restore();
	}

	if( path.indexOf( 'http' ) == 0 )
	{
		setTimeout(() => {
			this.win.loadURL( path, { userAgent: 'AOZViewer', search: options.search, hash: options.hash } );
		});
	}
	else
	{
		this.win.loadFile( path, { search: options.search, hash: options.hash } );
	}

	// ARGH, BB si tu sais comment faire? Les evenements 'moved' et 'resized' ne marchent pas,
	// et getBounds() n'est plus valide dans l'evenement 'close'
	if ( configId )
	{
		this.win._aozHandle = setInterval( function()
		{
			if( self.win )
			{
				try
				{
					var info = self.win.getBounds();
					info.devToolsOn = self.devToolsOn;
					atom.aozConfig.aoz_settings.windowPositions[ self.win._aozConfigId ] = info;
				}
				catch( e ) {}
			}
		}, 500 );
	}

	this.win.once( 'ready-to-show', () => {
		self.win.show();
		self.win.setTitle( 'AOZ Viewer' );
		atom.aozToolBar.updateItems();		
	} );

	this.win.once( 'close', ( event ) => {
		event.preventDefault();
		if( self.win && self.win._aozHandle )
		{
			clearInterval( self.win._aozHandle );		
		}
		self.win = undefined;
		atom.aozToolBar.updateItems();		
	} );	

}

module.exports = AOZViewer;
