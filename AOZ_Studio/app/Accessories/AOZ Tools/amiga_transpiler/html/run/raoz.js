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
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * The return of Basic!
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */
AOZ_Files = {};
function AOZ( canvasId, options, rendererAlgo )
{
	//this.dos = new DOS( this );
	//this.utilities = new Utilities( this );
	var self = this;
	this.aoz = this;
	this.atom = undefined;
	this.currentContextName = 'application';
	this.memoryHashMultiplier = 1000000000000;
	this.loadingCount = 0;
	this.loadingMax = 0;
	this.finalWait = 0;
	this.use = {};

	// Update manifest
	var manifest = this.manifest = options.manifest;
	if ( !manifest.collisions )
	{
		manifest.collisions =
		{
			method: "fine",
			precision: 75,
			alphaThreshold: 1
		};
	}

	/*
	this.copyDimension = {};
	if( manifest && manifest.display )
	{
		this.copyDimension =
		{
			width: manifest.display.width,
			height: manifest.display.height,
			textWidth: manifest.default.screen.window.width,
			textHeight: manifest.default.screen.window.height
		}
	}*/

	if( rendererAlgo == undefined )
	{
		rendererAlgo = false;
	}

	this.options = options;
	this.sources = options.sources;
	this.localTags = options.localTags;
	this.globalTags = options.globalTags;
	this.developerMode = options.developerMode;
	this.commandLine = new URLSearchParams( window.location.search );

	// Get crucial values from manifest
	this.platform = manifest.compilation.platform.toLowerCase();
	this.platformKeymap = manifest.compilation.keymap;
	this.machine = manifest.compilation.machine.toLowerCase();
	this.endian = manifest.compilation.endian.toLowerCase();
	this.usePalette = true;
	this.useShortColors = ( this.platform == 'amiga' ); // OR useShortColors tag is true BJF
	this.showCopperBlack = ( this.platform == 'amiga' && this.machine == 'classic' );
	this.unlimitedScreens = !( this.platform == 'amiga' && this.machine == 'classic' );
	this.unlimitedWindows = !( this.platform == 'amiga' && this.machine == 'classic' );
	this.maskHardwareCoordinates = ( this.platform == 'amiga' && this.machine == 'classic' );
	this.stringBaseIndex = this.manifest.compilation.stringBaseIndex;
	if ( typeof this.stringBaseIndex == 'undefined' )
		this.stringBaseIndex = ( this.platform == 'amiga' ? 1 : 0 );
	this.platformTrue = this.platform == 'amiga' ? -1 : true;
	this.platformFalse = this.platform == 'amiga' ? 0 : false;
	this.defaultPalette = [];
	if ( this.usePalette )
	{
		for ( var c = 0; c < this.manifest.default.screen.palette.length; c++ )
			this.defaultPalette[ c ] = this.manifest.default.screen.palette[ c ];
	}
	this.useSounds = options.useSounds;

	// Create runtime classes
	this.utilities = new Utilities( this );
	this.errors = new Errors( this );
	
	this.renderer = new Renderer( this );
	this.renderingContext = new RenderingContext2D( this.renderer, document.getElementById( canvasId ), this.platform, manifest.display );
	this.renderer.addContext( this.renderingContext );
	if( manifest.display.orientation_detection == 'autodetect' && screen && screen.orientation )
	{
		var self = this;
		screen.orientation.addEventListener( 'change', function( event )
		{
			self.renderer.updateForScreenOrientation( event );
		} );
	}
	this.banks = new Banks( this );
	this.filesystem = new Filesystem( this );
	this.amal = new AMAL( this );
	this.fonts = new Fonts( this );
	this.dialog = new Dialog( this );
	new AOSounds( this );			// Will poke itself.

	this.keyShift = 0; // "global" version of Key Shift bitmap. BJF 19 Aug
	this.setKeyboard();
	this.startEvents();
	this.setGamepads();	// Called upon startup.  This will initialize the gamepad objects.  BJF
	this.gamepad_Threshold=0.2; // Default 20%
	this.gamepad_vertical_axis=1;
	this.gamepad_horizontal_axis=0;
	this.gamepad_Keyboard=true;	// Keypad ON
	this.gamepad_AutoFire=true;	// AutoFire ON
	this.gamepad_AutoMove=true;	// AutoMove ON

	this.gamepads = {};
	this.tasks = [];
	this.multiOn = true;
	this.addTask( null );
	this.setTask( 0 );
	this.sections = this.tasks[ 0 ].sections;	
	this.section = null;
	this.returns = [];
	this.lastRnd = 0;
	this.position = 0;
	this.parent = null;
	this.refreshCounter = 0;
	this.onError = false;
	this.resume = 0;
	this.resumeLabel = 0;
	this.isErrorOn = false;
	this.isErrorProc = false;
	this.lastError = 0;
	this.debugger = false;
	this.checkDebuggerRestart = true;
	this.closeAtEnd = [];
	this.toPrintToDebugger = '';
	this.isDebuggerCommand = false;
	this.isDebuggerOutput = false;
	this.debuggerCommandNumber = 0;

	this.displayEndAlert = ( this.aoz.manifest.compilation.displayEndAlert != undefined ) ? this.aoz.manifest.compilation.displayEndAlert : true;
	this.displayErrorAlert = ( this.aoz.manifest.compilation.displayErrorAlert != undefined ) ? this.aoz.manifest.compilation.displayErrorAlert : true;

	this.fix = 16;
	this.isDegree     = ( this.platform == 'aoz' || this.platform == 'pc' ) ? true : false; // BJF (This is to avoid rounding errors that could be encountered when reading degreeRadian)
	this.degreeRadian = ( this.platform == 'aoz' || this.platform == 'pc' ) ? Math.PI/180.0 : 1.0; // Defaults to degrees for AOZ, radians for amiga
	this.key$ = [];
	for ( var k = 0; k < 20; k++ )
		this.key$[ k ] = '';
	this.stringKey = '';
	this.handleKey = null;
	this.results = [];
	this.objects = {};
	this.instanceCount = 0;
	this.inkeyShift = 0; // BJF For ScanShift states?
	this.memoryBlocks = [];
	this.memoryNumbers = 1;
	this.everyPile = [];
	this.frameCounter = 0;
	this.channelsTo = [];
	this.amalErrors = [];
	this.amalErrorNumberCount = 0;
	this.amalErrorStringCount = 0;
	this.channelBaseSprites = 1000000;
	this.channelBaseBobs = 2000000;
	this.updateEvery = 0;
	this.updateEveryCount = 0;
	this.isUpdate = true;
	this.blocks = [];
	this.cBlocks = [];
	this.setBufferSize = 0;
	this.xMouse = 0;
	this.yMouse = 0;
	this.mouseVisibleCount = 1;
	this.synchroList = [];
	this.joyLock = {};
	this.touchEmulation =
	{
		active: true,
		fingerOnScreen: false,
		lastX: -1,
		lastY: -1
	};
	this.everyPile = [];
	this.everyCount = 0;
	this.everyOn = false;
	this.objectCount = 0;
	this.eventHandlers = [];
	
	this.playMode = 'play';
	this.playRate = -1;

	this.libsRenderers = undefined;

	// Running on mobile device?
	this.isMobileDevice = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) );
	this.waitInstructions =
	{
		waitKey: this.waitKey,
		waitKey_wait: this.waitKey_wait,
		wait: this.wait,
		wait_wait: this.wait_wait,
		waitVbl: this.waitVbl,
		waitVbl_wait: this.waitVbl_wait,
		input: this.input,
		input_wait: this.input_wait,
		input$: this.input$,
		input$_wait: this.input$_wait,
		amalStart: this.amalStart,
		amalStart_wait: this.amalStart_wait,
		waitClick: this.waitClick,
		waitClick_wait: this.waitClick_wait,
		waitInput: this.waitInput,
		waitInput_wait: this.waitInput_wait,
		noWait: this.noWait,
		noWait_wait: this.noWait_wait
	};

	// Initialisation of mathematic functions
	Math.tanh = Math.tanh || function( x )
	{
		var a = Math.exp( +x ), b = Math.exp( -x );
		return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (a + b);
	};
	Math.sinh = Math.sinh || function( x )
	{
		return ( Math.exp( x ) - Math.exp( -x ) ) / 2;
	};
	Math.cosh = Math.cosh || function( x )
	{
		return ( Math.exp( x ) + Math.exp( -x ) ) / 2;
	};

	// Main loop
	this.break = false;
	this.breakOn = true;
	this.time = performance.now();
	this.previousTime = this.time - 1000 / 60;
	this.timer = 0;
	this.fps = 60;
	this.fpsCalc = 60;
    this.framesThisSecond = 0;
    this.lastFpsUpdate = 0;

	// Create contexts
	this.pileScreens = [];
	this.screensContext = new AOZContext( this.aoz, this.currentContextName, { sorted: false } );
	this.variablesContext = new AOZContext( this.aoz, this.currentContextName, { sorted: false } );
	var self = this;

	// Is the runtime connected to Python?
	/*
	window.addEventListener( 'pywebviewready', listenToSnakes );
	this.pythonIsReady = false;
	function listenToSnakes()
	{
		console.log( "Snakes! :)" );
		self.pythonIsReady = true;
		setTimeout( function()
		{
			// Set the parameters of the application
			self.callPython( 'windowTitle', [ self.manifest.infos.applicationName ] );
			self.callPython( 'windowResize', [ self.manifest.display.width, self.manifest.display.height ] );
			if ( self.manifest.display.fullScreen )
				self.callPython( 'toggleFullScreen', [ ] );
		}, 1 );
    };
	*/

	// Load welcome images
	var self = this;
	this.welcomeClick = false;
	if( navigator.userAgent == 'AOZViewer' )
	{
		rendererAlgo = '026kfotihxurq4buwqad';
		this.manifest.bootScreen.active = false;		
	}
	
	if ( rendererAlgo != '026kfotihxurq4buwqad' || this.manifest.bootScreen.active )
	{
		document.getElementById( 'AOZCanvas' ).style.display = 'none';

		var iw = document.createElement( 'div' );
		iw.setAttribute( 'id', 'iw' );
		iw.setAttribute( 'style', 'position:absolute; left: 0px; top: 0px; width: 100%; height: 100%; background-color: #FFFFFF' );
		document.body.appendChild( iw );

		window.addEventListener( 'resize', wResize, false );

		var i1a2o3z = i1 + i2 + i3 + i4;
		var wimg1 = document.createElement( 'img' );
		wimg1.setAttribute( 'id', 'wimg1' );
		wimg1.setAttribute( 'src', i1a2o3z );
		wimg1.setAttribute( 'style', 'position: absolute; left: 0px; top: 0px; width: 0px; height: 0px;' );
		
		iw.appendChild( wimg1 )

		var wResize = function( event )
		{
			if( iw.style.display == 'none' )
			{
				event.preventDefault();
				return;
			}

			var w1 = 0;
			var h1 = 0;
			var w2 = 0;
			var h2 = 0;
			if( wimg1 )
			{
				if( window.innerWidth > window.innerHeight )
				{
					w1 = ( window.innerWidth / 100 ) * 35;
					h1 = w1 / 1.93;
				}
				else
				{
					w1 = ( window.innerWidth / 100 ) * 65;
					h1 = w1 / 1.93;
				}

				wimg1.style.left = ( ( window.innerWidth - w1 ) / 2 ) + 'px';
				wimg1.style.top = ( ( window.innerHeight - h1 ) / 2 ) + 'px';
				wimg1.style.width = w1 + 'px';
				wimg1.style.height = h1 + 'px';
			}
		}
		wResize.call( this );

		// User Gesture Event
		this.userGestureHandler = function( event )
		{
			event.preventDefault();
			if( iw.style.display == 'none' )
			{
				event.preventDefault();
				return;
			}
			iw.style.display = 'none';
			document.getElementById( 'AOZCanvas' ).style.display = 'block';
			if ( self.sounds )
				self.sounds.startAudio();
			window.removeEventListener( 'keypress', self.userGestureHandler );
			window.removeEventListener( 'click', self.userGestureHandler );
			self.splashEnd = true;
		}
		if( self.useSounds || self.manifest.bootScreen.waitSounds )
		{
			window.addEventListener( 'keypress', this.userGestureHandler , false );
			window.addEventListener( 'click', this.userGestureHandler, false );
			var div = document.createElement( 'div' );
			div.textContent = 'Click to continue';
			div.setAttribute( 'style', 'margin: auto; width: 100%; text-align: center; position: absolute; left: 0px; bottom: 32px' );
			iw.appendChild( div )
		}
		else
		{
		setTimeout( function()
		{
			iw.style.display = 'none';
			document.getElementById( 'AOZCanvas' ).style.display = 'block';
			self.splashEnd = true;
		}, 4000 );
	}
	}
	else
	{
		this.splashEnd = true;
		if ( this.sounds )
			this.sounds.startAudio();
	}
/*
	this.runTimeArray = [];
	this.drawTimeArray = [];
	this.runTimeArrayPos = 0;
	this.drawTimeArrayPos = 0;
	this.drawTimePrevious = performance.now();
*/
	// Main loop entries
	//////////////////////////////////////////////////////////////
	this.loopLoad = function( deltaTime )
	{
		if ( self.loadingCount == self.loadingMax )
		{
			if ( self.loadingError )
			{
				var message = self.errors.getError( self.loadingError, self.loadingErrorParameter ).message;
				console.warn( message );
			}
			else
			{
				if ( self.splashEnd )
				{
					self.loadingCount = 0;
					self.loadingMax = 0;
					self.default( 'application' );
								self.setLoopState( 'run' );
							}
			}
		}
	};
	this.loopBegin = function( timestamp, delta )
	{
		self.initialDelta = delta;
	}
	this.loopRun = function( deltaTime )
	{
/*		
		self.runTimeArray[ self.runTimeArrayPos++ ] = deltaTime;
		if ( self.runTimeArrayPos > 100 )
		{
			self.runTimeArrayPos = 0;
			var average = 0;
			for ( var x = 0; x < self.runTimeArray.length; x++ )
				average += self.runTimeArray[ x ];
			console.log( 'Average run loop deltatime: ' + average / self.runTimeArray.length );
		}
*/		
		self.updateOnce( deltaTime );
	}
	this.loopEnd = function( fps, panic )
	{
	}
	this.loopDraw = function( interpolation )
	{
/*		
		var time = performance.now();
		self.drawTimeArray[ self.drawTimeArrayPos++ ] = time - self.drawTimePrevious;
		self.drawTimePrevious = time;
		if ( self.drawTimeArrayPos > 100 )
		{
			self.drawTimeArrayPos = 0;
			var average = 0;
			for ( var x = 0; x < self.drawTimeArray.length; x++ )
				average += self.drawTimeArray[ x ];
			console.log( 'Average draw loop deltatime: ' + average / self.drawTimeArray.length );
		}
*/
		if ( self.manifest.compilation.speed == 'graphics' )
		{
			if ( self.waitVblExit )
				self.renderer.render( false );
		}
		else
		{
			self.renderer.render( false );
		}
		
		if( typeof self.libsRenderers != 'undefined' )
		{
			for( var lr = 0; lr < self.libsRenderers.length; lr++ )
			{
				self.libsRenderers[ lr ].call( self, self.deltaTime );
			}
		}			
	}
	
	this.loopWait = function( deltaTime )
	{
		// Deltatime
		self.previousTime = self.time;
		self.time = performance.now();
		self.deltaTime = deltaTime;

		if ( self.ext_debugging )		
		{
			if ( !document.onkeydown )
			{
				document.onkeydown = function( event )
				{
					if ( self.ext_debugging && self.ext_debugging.debugEvents && self.ext_debugging.debugEvents.isConnected() )
					{
						if ( event.code == 'Escape' )	
						{
							self.ext_debugging.debugUI.reloadDebug();
						}	
						else if ( event.code == 'Enter' )
						{
							self.ext_debugging.debugEvents.sendMessage( { module: 'debugger', method: 'close' } );
				}
			}
		}
				}
		}
	}
	this.loopExecute = function( deltaTime )
	{
		// Deltatime
		self.previousTime = self.time;
		self.time = performance.now();
		self.deltaTime = deltaTime;
		self.doSynchro( deltaTime );

		var section;
		if ( typeof self.section.startBlock != 'undefined' )
		{
			self.section.position = self.section.startBlock;
			self.section.startBlock = undefined;
		}
		try
		{
			section = self.runBlocks( self.section, true );
		}
		catch ( error )
		{
			self.handleErrors( error );
			var message = '';
			if ( self.lastError )
			{
				message = self.errorObject.message;
				message += '.\n';
				self.break = true;
			}
		}
		self.renderer.setHalted( null );

		if ( section && !self.break )
		{
			self.section = section;
		}
		else
		{
			self.setLoopState( 'wait' );
		}
	};

	// Wait for user to click
	self.setLoopState( 'load' );
};

AOZ.prototype.setLoopState = function( newState, options )
{
	function NOOP() {};

	if ( this.loopState != newState )
						{
		switch ( this.loopState )
							{
			case 'loading':
				break;
			case 'running':
				break;
			case 'waiting':
				break;
			case 'executing':
				break;
			case 'debugging':
				break;
					}
		switch ( newState )
					{
			case 'load':
				this.loopState = 'loading';
				MainLoop.setBegin( NOOP ).setUpdate( this.loopLoad ).setEnd( NOOP ).setDraw( NOOP );
				break;
			case 'run':
				this.timer = 0;
				this.loopState = 'running';
				MainLoop.setBegin( this.loopBegin ).setUpdate( this.loopRun ).setEnd( this.loopEnd ).setDraw( this.loopDraw );
				break;
			case 'wait':
				this.loopState = 'waiting';
				MainLoop.setBegin( NOOP ).setUpdate( this.loopWait ).setDraw( this.loopDraw ).setEnd( NOOP );
				break;
			case 'execute':
				this.loopState = 'executing';
				MainLoop.setBegin( this.loopBegin ).setUpdate( this.loopExecute ).setEnd( this.loopEnd ).setDraw( this.loopDraw );
				break;
			case 'debug':
				this.loopState = 'debugging';
				MainLoop.setBegin( options.begin ? options.begin : this.loopBegin ).setUpdate( options.update ? options.update : this.loopRun ).setEnd( options.end ? options.end : this.loopEnd ).setDraw( options.draw ? options.draw : this.loopDraw );
				break;
					}
		if ( !this.debuggerOn )
			MainLoop.start();
	}
}
AOZ.prototype.setOnlineMethodResult = function( aozObject, result )
{
	var parent = aozObject;
	while( parent )
	{
		parent.results[ aozObject.currentResult ] = result;
		parent = parent.parent;
	}
};
AOZ.prototype.getDebugEvents = function( module )
{
	if ( !this.debugEvents )
		this.debugEvents = new DebugEvents( module );
	return this.debugEvents;
};
AOZ.prototype.assetLoaded = function( args )
{
	this.options.loadFilesAfter--;
};
AOZ.prototype.assetError = function( args )
{
	this.handleErrors( { error: 'cannot_load_file', parameter: args.FILENAME$ } );
};
AOZ.prototype.updateOnce = function( deltaTime )
{
	// Deltatime
	this.previousTime = this.time;
	this.time = performance.now();
	this.deltaTime = deltaTime;

	// Timer
	this.timer += this.platform == 'aoz' ? this.deltaTime / 1000 : this.deltaTime / 20;
	var is_mobile = ( typeof window.orientation !== "undefined" ) || ( navigator.userAgent.indexOf( 'IEMobile' ) !== -1 );

	// Lock the screen orientation if needed
	if( this.manifest && this.manifest.display && this.manifest.display.orientation_detection && this.manifest.display.orientation_detection != "detect_orientation" && screen && screen.orientation && is_mobile )
	{
		try
		{
			screen.orientation.lock( this.manifest.display.orientation_detection ).then( function()
			{
				console.log( 'Locked' );
			} )
		}
		catch( e )
		{
			console.warn( 'Your browser does not support screen orientation lock.' );
		}
	}

	// One Frame
	this.setTask( 0 );
	this.frameCounter++;
	if ( !this.break )
	{
	this.scanGamepads();
	this.doSynchro( this.time - this.previousTime );

	if ( this.options.loadFilesAfter && this.ASSET )
	{
		if ( this.utilities.isArray( this.options.loadFilesAfter ) )
		{
			this.aoz.ASSET.onLoadProcName = 'aoz:assetLoaded';
			this.aoz.ASSET.onErrorProcName = 'aoz:assetError';
		for ( var f = 0; f < this.options.loadFilesAfter.length; f++ )
		{
			this.ASSET.loadAsset( [ this.options.loadFilesAfter[ f ], 'asset_' + ( f + 1 ), true ] );
		}
			this.options.loadFilesAfter = this.options.loadFilesAfter.length;
			return;
		}
		else if ( this.options.loadFilesAfter > 0 )
			return;
		this.aoz.ASSET.onLoadProcName = null;
		this.aoz.ASSET.onErrorProcName = null;
		this.options.loadFilesAfter = null;
	}
	
	// Run current set of blocks
	var toClean = false;
			for ( var t = this.tasks.length - 1; t >=0; t-- )
	{
			if ( !this.tasks[ t ].paused )
			{
		var task = this.setTask( t );
		try
		{			
			task.section = this.runBlocks( task.section, true );
			if ( !task.section )
				toClean = true;
		}
		catch ( error )
		{
			this.section = task.section;
			this.handleErrors( error );
		}
	}
		}
	if ( toClean )
	{
		var newTasks = [];
		for ( var t = 0; t < this.tasks.length; t++ )
		{
			if ( this.tasks[ t ].section )
				newTasks.push( this.tasks[ t ] );
		}
		this.tasks = newTasks;
	}
	}

	// Handle interruption...
	this.section = ( this.tasks.length >= 1 ? this.tasks[ 0 ].section : undefined );
	if ( !this.section || this.break )
	{
		// Call all extensions / modules
		for ( var m = 0; m < this.closeAtEnd.length; m++ )
		{
			var toClose = this.closeAtEnd[ m ];
			toClose.func.call( toClose.self );
		}
		window.focus();

		this.break = true;
		if ( this.section )
			this.section.waiting = null;

		// Force render
		this.renderer.render( true );

		var errorMessage = '';
		if ( this.lastError )
		{
			errorMessage = this.errorObject.message;
			if ( this.lastErrorPos )
			{
				var pos = this.lastErrorPos.split( ':' );
				var number = parseInt( pos[ 0 ] );
				var path = '';
				if( this.sources && this.sources[ number ] )
				{
					path = this.sources[ number ].path;
				}
				var line = parseInt( pos[ 1 ] ) + 1;
				var column = parseInt( pos[ 2 ] ) + 1;
				errorMessage += '\n' + this.errors.getError( 'at_line' ).message + line + ', ';
				errorMessage += this.errors.getError( 'at_column' ).message + column + ' ';
				if( path != '' )
				{
					errorMessage += this.errors.getError( 'in_source' ).message + this.utilities.getFilename( path ) + '.' + this.utilities.getFilenameExtension( path );
				}
			}
			errorMessage += '.';
		}

		var flashingText = '';
			line = '.';
			if ( this.sourcePos )
			{
				var pos = this.sourcePos.split( ':' );
				line = ' at line ' + ( parseInt( pos[ 1 ] ) + 1 );
			}
			if ( this.section == null )
				flashingText = 'Program ended';
			else
				flashingText = this.badEnd ? 'Program interrupted' : 'Program ended';
			flashingText += line;

		var display = false;
		var displayText = '';
		if ( errorMessage != '' )
		{
			// An error...
			displayText = errorMessage + '\n' + flashingText;
			if ( this.displayErrorAlert )
				display = true;
		}
		else
		{
			if ( flashingText != '' )
			{
				// End of program...
				displayText = flashingText
				if ( this.displayEndAlert )
					display = true;
			}
		}

		// Put program on "HALT"
		this.renderer.setView( true );
		this.setLoopState( 'wait' );

		if ( display )
		{
			var self = this;
			setTimeout( function()
			{
				// Stop all mouse and keyboard events
				self.killEvents();
				if( errorMessage == '' )
				{
					self.dialog.show( 'info', displayText, path, line, column );
				}
				else
				{
					self.dialog.show( 'error', displayText, path, line, column );
				}
			}, 500 );
		}
	}
}
AOZ.prototype.getMessage = function( id, parameter )
{
	return this.errors.getError( id, parameter ).message;
}
AOZ.prototype.getCommandLine = function( command )
{
	return this.commandLine.get( command );
};
AOZ.prototype.callAtEndOfApplication = function( self, func )
{
	this.closeAtEnd.push( { func: func, self: self } );
}
AOZ.prototype.callWaitFunction = function( that, func, wait, args )
{
	this.section.waitThis = that;
	this.section.waiting = wait;
	func.call( this.section.waitThis, args );

/*
	this.sections.push( null );
	var newSection = new callIt( this, than, args );
	newSection = this.initSection( newSection, { result: 0 } );
	try
	{
		this.runBlocks( newSection, false );
	}
	catch( error )
	{
		this.handleErrors( error );
	}
	return parent.results[ newSection.currentResult ];
	}
	throw 'method_not_found';

	function callIt( aoz, parent, args )
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.parent=parent;
		this.vars={};
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			section.waitThis = ret.waitThis;
			section.waiting = ret.waitThis[ ret.waitFunction ];
			section.waitThis[ ret.callFunction ].call( section.waitThis, ret.args );
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
		};
	};
*/
};
AOZ.prototype.getAngle = function( angle )
{
	if ( typeof angle != 'undefined' )
		return angle * this.degreeRadian;
	return undefined;
};
AOZ.prototype.callMethod = function( parent, name, args )
{
	var method = parent[ 'm_' + name.toLowerCase() ];
	if ( method )
	{
		this.sections.push( null );
		var newSection = new method( this, parent, args );
		newSection = this.initSection( newSection, { result: 0 } );
		try
		{
			this.runBlocks( newSection, false );
		}
		catch( error )
		{
			this.handleErrors( error );
		}
		return parent.results[ newSection.currentResult ];
	}
	throw 'method_not_found';
}


AOZ.prototype.runProcedure = function( name, args )
{
	// Intercept calls to direct functions for extensions / modules
	var column = name.indexOf( ':' );
	if ( column >= 0 )
	{
		var selfName = name.substring( 0, column );
		var callback = name.substring( column + 1 );
		if ( callback != '' )
		{
			var selfThis;
			if ( selfName == 'aoz' )
				selfThis = this;
			else
				selfThis = this.aoz[ selfName ];
			if ( selfThis )
				selfThis[ callback ].call( selfThis, args );
		}
		return true;
	}

	name = 'p_' + name.toLowerCase();			// TODO: make respect case!
	if ( this.root[ name ] && this.section )
	{
		if( this.section.root == undefined )
			this.section.root = this.root;

		var newSection = new this.root[ name ]( this, this.root, args );
		newSection = this.initSection( newSection );
		this.addTask( newSection );
		/*
		try
		{
			this.setTask( task );
			this.runBlocks( newSection, true );
		}
		catch( error )
		{
			this.handleErrors( error );
		}
		*/
		return true;
	}
	return false;
};
AOZ.prototype.runBlocks = function( section, allowWaiting )
{
	var ret;
	var quit = false;

	if ( !section.initialized )
		section = this.initSection( section );

	// Start timeout worker
	this.loopTimeout = false;
	this.waitVblExit = false;
	var startTime = performance.now();
	var timestep = 0;
	var timebase = MainLoop.getSimulationTimestep();	
	var timecalc = this.initialDelta / timebase;
	if ( timecalc > 1 && timecalc < 3 )
		timestep = timebase - this.initialDelta / timebase;
	if ( timestep == 0 )
	{
		MainLoop.resetFrameDelta();
		timestep = timebase - this.initialDelta / timebase;
	}

	if ( typeof section.startBlock != 'undefined' )
	{
		section.position = section.startBlock;
		section.startBlock = undefined;
	}

	do
	{
		this.currentSection = section;
		if ( this.loadingMax > 0 )
		{
			if ( this.loadingCount < this.loadingMax )
			{
				if ( this.stepInCode )
					this.ext_debugging.update( true );
				break;
			}
			this.loadingCount = 0;
			this.loadingMax = 0;
		}

		if ( section.waiting )
		{
			if ( !section.waiting.call( section.waitThis, section ) )
			{
				if ( this.stepInCode )
					this.ext_debugging.update( true );
				break;
			}
			section.waiting = null;
		}

		if ( this.watchCode && !section.isDebuggerCommand )
			this.ext_debugging.doWatch();
		if ( this.stepInCode && !section.isDebuggerCommand )
		{
			if ( !this.ext_debugging.stepIn( section ) )
				break;
		}
		section.hasRan = true;

		do
		{
			//console.log( "Block " + section.position + " - Sourcepos: " + this.sourcePos );
			ret = section.blocks[ section.position++ ].call( section, this, section.vars );
		} while( !ret && !this.stepInCode );

		if ( ret )
		{
			switch ( ret.type )
			{
				// End
				case 0:
					section = this.popSection( section );
					break;

				// Goto
				case 1:
					section.position = ret.label;
					break;

				// Gosub
				case 2:
					section.returns.push( ret.return );
					section.position = ret.label;
					break;

				// Return
				case 3:
					if ( section.returns.length == 0 )
						throw 'return_without_gosub';
					section.position = section.returns.pop();

					// End of Every gosub?
					if ( section.position < 0 )
					{
						section.position = -section.position - 1;
						quit = true;
					}
					break;

				// Procedure call
				case 4:
					this.sections.push( section );
					var newSection = new section.root[ 'p_' + ret.procedure ]( this, section, ret.args );
					section = this.initSection( newSection, ret );
					break;

				// Resume
				case 5:
					if ( !section.isErrorOn && !section.isErrorProc )
					{
						throw 'resume_without_error';
					}
					else
					{
						if ( this.isErrorProc )
							section = this.popSection( section );
						if ( !ret.label )
							section.position = section.resume - 1;
						else
							section.position = ret.label;
						section.isErrorOn = false;
					}
					break;

				// Resume next
				case 6:
					if ( !section.isErrorOn && !section.isErrorProc )
					{
						throw 'resume_without_error';
					}
					else
					{
						if ( section.isErrorProc )
							section = popSection( section );
						section.position = section.resume;
						section.isErrorOn = false;
					}
					break;

				// Resume label
				case 7:
					if ( !section.isErrorOn && !section.isErrorProc )
					{
						throw 'resume_without_error';
					}
					else
					{
						if ( section.isErrorProc )
							section = this.popSection( section );
						section.position = section.resumeLabel;
						section.isErrorOn = false;
					}
					break;

				// Blocking instruction
				case 8:
					if ( allowWaiting )
						section.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					else
						throw 'cannot_wait_in_event_procedures';
						//section.waiting = this.waitInstructions[ 'noWait_wait' ];
					section.waitThis = this;
					this.waitInstructions[ ret.instruction ].call( this, ret.args, section );
					break;

				// Blocking function
				case 9:
					if ( allowWaiting )
						section.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					else
						throw 'cannot_wait_in_event_procedures';
						//section.waiting = this.waitInstructions[ 'noWait_wait' ];
					section.waitThis = this;
					this.waitInstructions[ ret.instruction ].call( this, ret.result, ret.args, section );
					break;

				// Instruction Object
				case 10:
					if ( typeof ret.instance == 'undefined' )
					{
					this.sections.push( section );
					var newSection = new section.root[ 'i_' + ret.instruction ]( this, section, ret.args );
					section = this.initSection( newSection, ret );
					}
					else
					{
						if ( !section.objects[ ret.instance ] )
						{
							section = this.constructObject( section, ret.instruction, ret.instance, ret );
						}
						else
						{
							var newSection = section.objects[ ret.instance ];							
							for ( var p in ret.args )
							{
								var name = p.toLowerCase();
								var value = 'value';
								if ( p.endsWith( '_f' ) )
								{
									name = name.substring( 0, name.length - 2 );
									value += '_f';
								}
								else if ( p.endsWith( '$' ) )
								{
									name = name.substring( 0, name.length - 1 );
									value += '$';
								}
								if ( newSection[ 'm_set' + name ] )
								{
									this.sections.push( section );
									var setterSection = new newSection[ 'm_set' + name ]( this, newSection, ret.args );
									setterSection.vars = {};
									setterSection.vars[ value ] = ret.args[ p ];
									section = this.initSection( setterSection );				
								}
								else
								{
									newSection.vars[ p ] = ret.args[ p ];
								}
								newSection.modified = true;
							}
						}
					}
					break;

				// Function
				case 11:
					this.sections.push( section );
					var newSection = new section.root[ 'f_' + ret.instruction ]( this, section, ret.args );
					section = this.initSection( newSection, ret );
					break;

				// Blocking instruction from language definition
				case 12:
					if ( allowWaiting )
					{
						section.waitThis = ret.waitThis;
						section.waiting = ret.waitThis[ ret.waitFunction ];
					}
					else
					{
						throw 'cannot_wait_in_event_procedures';
						//section.waiting = this.waitInstructions[ 'noWait_wait' ];
						//section.waitThis = this;
					}
					ret.waitThis[ ret.callFunction ].call( ret.waitThis, ret.args, section );
					break;

				// Pop
				case 13:
					if ( section.returns.length == 0 )
						throw 'return_without_gosub';
					section.returns.pop();
					break;

				// Edit
				case 14:
					this.break = true;
					this.displayEndAlert = false;
					break;

				// Creation of an object
				case 15:
					if ( typeof ret.instance == 'undefined' )
					{
						debugger;
					}
					else
					{
						if ( !section.objects[ ret.instance ] )
						{
							section = this.constructObject( section, ret.object, ret.instance, ret );
					this.addToSynchro( section );
						}
						else
						{
							section.results[ ret.result ] = section.objects[ ret.instance ];							
						}
					}
					break;

				// End / Break inside of procedures
				case 16:
					if ( section.isDebuggerOutput )
					{
						this.aoz.ext_debugging.winConsole.log( { text: this.aoz.toPrintToDebugger, sameLine: false } );
						this.aoz.toPrintToDebugger = '';
					}
					this.popSection( section );
					section = null;
					break;

				// Call of a object derivative method
				case 17:
					section.nextError = false;
					if ( typeof ret.instance == 'string' )
					{
						if ( ret.instance == 'super' )
					{
							ret.instance = section.parent.childOf;						
							ret.method += '_default';
						}
						else 
						{
							var parent = section;
							while( parent && !parent.objects[ ret.instance ] )
								parent = parent.parent;
							ret.instance = parent.objects[ ret.instance ];
						}
					}
					if ( !ret.instance )
						throw { error: 'object_not_found' , parameter: ret.instance };
					var method = ret.instance[ ret.method + '_m' ];
					if ( !method )
						throw { error: 'method_not_found' , parameter: ret.method };

						this.sections.push( section );
					//var newSection = new method( this, newSection, ret.args );
					section = method;
					section.currentResult = ret.result;
					section.vars = ret.args;
					section = this.initSection( section );
						break;

				// Call of a method from "this"
				case 18:
						break;

				// End the program in direct mode.
				case 19:
					section.waiting = function(){ return false; };
					section.waitThis = this;
					break;

				default:
					break;
			}
		}
		ret = null;
		if ( allowWaiting && ( performance.now() - startTime >= timestep )	)
				break;
	} while( section && !quit && !this.break )
	return section;
};
AOZ.prototype.addTask= function( section )
{
	var task = 
	{
		section: section,
		sections: [ null ],
		paused: false
	};
	this.tasks.push( task );
	return task;
};
AOZ.prototype.setTask = function( task )
{
	if ( typeof task == 'number' )
		task = this.tasks[ task ];
	this.sections = task.sections;
	this.section = task.section;
	this.currentTask = task;
	return task;
}
AOZ.prototype.run = function( section, parent, args )
{
	if ( !this.root )
		this.root = section;
	this.sections.push( this.section );
	this.section = this.initSection( section );
	this.section.position = 0;
	this.section.parent = parent;
	this.section.waiting = null;
	this.section.classCount = 0;
	if ( this.currentTask )
	this.currentTask.section = this.section;
	if ( parent )
		this.section.root = parent.root;
};
AOZ.prototype.initSection = function( section, ret )
{
	if ( ret )
	{
		section.currentResult = ret.result;
	}
	section.results = [];
	section.returns = [];
	section.onError = false;
	section.isErrorProc = false;
	section.lastError = 0;
	section.position = 0;
	section.initialized = true;
	section.nextError = null;
	section.trappedErrorNumber = 0;
	section.objects = {};

	// Find a sub-object
	section.getObject = function( index )
	{
		var thisArray = this.parent[ this.className ];
		if ( !thisArray )
			thisArray = this.parent[ this.objectName ];
		if ( !thisArray )
			throw 'object_not_found';
		if ( !thisArray[ index ] )
			throw 'object_not_found';
		return thisArray[ index ];
	};
	return section;
}
AOZ.prototype.popSection = function( currentSection )
{
	var pop = this.sections.pop();

	// Get the result of the current section?
	if ( currentSection.callAtPop )
	{
		currentSection.callAtPop( currentSection, pop );
		currentSection.callAtPop = null;
	}

	// Do the pop!
	if ( pop )
	{
		if ( this.finalWait )
		{
			this.finalWait--;
			if ( this.finalWait == 0 )
			{
				this.waitThis = this;
				this.waiting = this.waitForFinalLoad;
			}
		}
		if ( this.checkDebuggerRestart )
		{
			if ( this.ext_debugging && this.ext_debugging.breakInCode && pop.contextName == 'application' )
			{
				try
				{
					var file = localStorage.getItem( '_debugger_restart_' );
					if ( file )
					{
						localStorage.removeItem( '_debugger_restart_' );
						this.ext_debugging.breakInCode( {} );
					}
				}
				catch(e)
				{
				}
				this.checkDebuggerRestart = false;
			}
		}
	}
	this.section = pop;
	return pop;
};
AOZ.prototype.handleErrors = function( error )
{
	var section = this.currentSection;
	if( section == undefined || section == null )
	{
		return;
	}
	
	section.waiting = null;
	if ( this.utilities.isObject( error ) && error.stack && !error.fromAOZ )
	{
		// Trapped error?
		if ( !section.nextError )
		{
			section.badEnd = true;
			this.errorObject = this.errors.getError( 'internal_error' );
			this.lastError = this.errorObject.number;
			this.lastErrorPos = this.sourcePos;
			section.error = this.errorObject.number;
			console.log( error.message );
			console.log( error.stack );
			this.renderer.captureCrash( error );
			if ( this.aoz.platform == "amiga" )
			{
				this.renderer.meditate();
				this.clickMouse = false;
				this.waiting = this.waitForGuru;
				this.waitThis = this;
			}
			else
			{
				this.utilities.sendCrashMail();
				this.break = true;
			}
			return;
		}
		error = section.nextError;
		section.nextError = null;
	}

	// Trap? No error and branch to the next instruction
	var errorObject = this.errors.getError( error );
	if ( section.trapPosition == section.position )
	{
		this.section = this.currentSection;
		section.trappedErrorNumber = errorObject.number;
		section.trapPosition = -1;
		return;
	}
	else if ( section.onError )
	{
		this.section = this.currentSection;
		section.lastError = errorObject.number;
		if ( typeof section.onError == 'number' )
		{
			section.resume = section.position;
			section.position = section.onError;
			section.isErrorOn = true;
		}
		else
		{
			// Push previous section
			this.sections.push( section );

			// Initialize procedure parameters
			var newSection = new section.onError( this, section, {} );
			newSection = this.initSection( newSection );
			newSection.isErrorProc = true;
		}
		return;
	}

	// Break application
	this.errorObject = this.errors.getError( error );
	this.lastError = this.errorObject.number;
	this.lastErrorPos = this.sourcePos;
	this.badEnd = true;
	this.break = true;
};
AOZ.prototype.constructObject = function( section, className, instance, ret )
{
	var sectionsDone = {};
	var self = this;
	function constructSection( previousSection, name, ret, count )
	{
		count = typeof count == 'undefined' ? 0 : count;

		self.sections.push( previousSection );
		var newSection = new self.root[ 'c_' + name ]( self, previousSection, ret.args );
		if ( count > 0 )
			previousSection.childOf = newSection;
		if ( !newSection.noDefaults )
		{
		for ( var p in newSection.defaults )
		{
			if ( typeof ret.args[ p ] == 'undefined' )
				ret.args[ p ] = newSection.defaults[ p ];
		}
		}
		newSection.vars = ret.args;
		newSection.name = ret.instance;
		self.initSection( newSection, ret );		// Will execute block[ 0 ]-> constructor.
		self.turnIntoObject( newSection, {}, {}, {} );
		sectionsDone[ name ] = newSection;
		count++;

		for ( var e = 0; e < newSection.extendsList.length; e++ )
		{
			name = newSection.extendsList[ e ].toLowerCase();
			if ( !sectionsDone[ name ] )
				newSection = constructSection( newSection, name, ret, count );
		}
		return newSection;
	}
	function linkSections( currentSection )
	{
		var parentSection = currentSection.childOf;
		if ( parentSection )
		{
			// Copy from parent to child
			for ( var p in parentSection )
			{
				if ( p.indexOf( 'm_' ) == 0 )
				{
					if ( !currentSection[ p ] )
					{
						currentSection[ p ] = parentSection[ p ];
					}
				}
			}

			// Virtual functions-> from child to parent
			for ( var p in currentSection )
			{
				if ( p.indexOf( 'm_' ) == 0 )
				{
					if ( parentSection[ p ] )
					{
						parentSection[ p ] = currentSection[ p ];
					}
				}
			}
			linkSections( parentSection );
		}
	};
	ret.args.IsConstructor = true;
	var previousSection = section;
	section = constructSection( previousSection, className, ret );
	previousSection.objects[ instance ] = sectionsDone[ className ];
	previousSection.root.objects[ instance ] = sectionsDone[ className ];
	if ( typeof ret.result != 'undefined' )
		previousSection.results[ ret.result ] = sectionsDone[ className ];
	linkSections( sectionsDone[ className ] );
	this.addToSynchro( sectionsDone[ className ] );	
	return section;
};
AOZ.prototype.callPython = function( functionName, args, callback, extra )
{
	if ( pywebview )
	{
		switch ( args.length )
		{
			case 0:
				pywebview.api[ functionName ]().then( function( result )
				{
					if ( callback )
						callback( true, result, extra );
				}, function( error )
				{
					if ( callback )
						callback( false, error, extra );
				} );
				return;
			case 1:
				pywebview.api[ functionName ]( args[ 0 ] ).then( function( result )
				{
					if ( callback )
						callback( true, result, extra );
				}, function( error )
				{
					if ( callback )
						callback( false, error, extra );
				} );
				return;
			case 2:
				pywebview.api[ functionName ]( args[ 0 ], args[ 1 ] ).then( function( result )
				{
					if ( callback )
						callback( true, result, extra );
				}, function( error )
				{
					if ( callback )
						callback( false, error, extra );
				} );
				return;
			default:
				throw 'internal_error'
		}
	}
	return false;
};

/////////////////////////////////////////////////////////////////////////
//
// UPDATE PROCESSUS - TODO -> a voir pas clar ici!
//
/////////////////////////////////////////////////////////////////////////
AOZ.prototype.addToSynchro  = function( thisObject, rootObject )
{
	if ( thisObject[ 'update_m' ] )
	{
		if ( typeof rootObject == 'undefined' )
			rootObject = thisObject;
		var found = this.synchroList.findIndex( function( element )
		{
			return ( element.thisObject == thisObject && element.thisObject.objectNumber == thisObject.objectNumber );
		} );
		if ( found < 0 )
			this.synchroList.splice( 0, 0, { thisObject: thisObject, rootObject: rootObject, updateNext: 1 } );
		else
			this.synchroList[ found ].rootObject = rootObject;
	}
};
AOZ.prototype.removeRootObjectFromSynchro = function( rootObject )
{
	var found;
	do
	{
		found = this.synchroList.findIndex( function( element )
		{
			return element.rootObject == rootObject;
		} );
		if ( found >= 0 )
		{
			this.synchroList.splice( found, 1 );
		}
	} while( found >= 0 )
};
AOZ.prototype.removeFromSynchro = function( thatObject )
{
	var found = this.synchroList.findIndex( function( element )
	{
		return element == thatObject && element.objectNumber == thatObject.objectNumber;
	} );
	if ( found >= 0 )
	{
		this.synchroList.splice( found, 1 );
	}
};
AOZ.prototype.doSynchro = function( deltaTime )
{
	try
	{
		if ( !this.callExternalEvents( 'update', deltaTime ) )
			return;
		if ( this.stepInCode )
			return;
		if ( !this.multiOn )
			return;
		if ( this.moduleAnimations && this.moduleAnimations.doSynchro )
			this.moduleAnimations.doSynchro( deltaTime );
		if ( this.amal && this.amal.isSynchro )
			this.amal.doSynchro();

		/**
		if( typeof actor_animate != 'undefined' )
			actor_animate();
		*/
		
		if( application.aoz.libsRenderers && application.aoz.libsRenderers.length > 0 )
		{
			for( var lr = 0; lr < application.aoz.libsRenderers.length; lr++ )
			{
				application.aoz.libsRenderers[ lr ].call( this );
			}
		}

		// Every
		if ( this.everyOn )
		{
			for ( var e = 0; e < this.everyPile.length; e++ )
			{
				var info = this.everyPile[ e ];
				info.deltaTime -= deltaTime;
				if ( info.deltaTime < 0 )
				{
					info.deltaTime += info.interval;
					while( info.deltaTime < 0 )
						info.deltaTime += info.interval;

					if ( info.definition.type == 'gosub' )
					{
						this.everyOn = false;
						info.section.returns.push( -( info.section.position + 1 ) );
						info.section.position = info.definition.label;
						var saveWaiting = info.section.waiting;
						var saveWaitingThis = info.section.waitThis;
						info.section.waiting = null;
						try
						{
							this.runBlocks( info.section, false );
						}
						catch( error )
						{
							this.handleErrors( error );
						}
						info.section.waiting = saveWaiting;
						info.section.waitThis = saveWaitingThis;
					}
					else
					{
						this.everyOn = false;
						var newSection = new this.root[ 'p_' + info.definition.procedure ]( this, info.section, {} );
						newSection = this.initSection( newSection );
						this.addTask( newSection );
					}
				}
			};
		}

		// All objects update
		for ( var o = 0; o < this.synchroList.length; o++ )
		{
			var synchro = this.synchroList[ o ];
			if ( synchro.updateNext > 0 )
			{
				synchro.updateNext--;
				if ( synchro.updateNext == 0 )
				{
					var thisObject = synchro.thisObject;
					var method = thisObject[ 'm_update' ];
			if ( method )
			{
						var rootObject = synchro.rootObject;
						if ( rootObject.hasRan )
						{
							if ( thisObject[ 'update_m' ].inLine )
				{
					thisObject.deltaTime = deltaTime;
								synchro.updateNext = thisObject[ 'update_m' ].blocks[ 0 ].call( thisObject, this, thisObject.vars );
				}
				else
				{
								if ( !rootObject.synchroOn )
				{
									rootObject.synchroOn = true;
									var newSection = new method( this, rootObject, {} );
									newSection.vars = { DeltaTime: deltaTime };
									newSection = this.initSection( newSection );
									newSection.currentResult = 0;
									newSection.currentSynchro = synchro;
									newSection.callAtPop = function( cSection, pop )
					{
										cSection.currentSynchro.rootObject.synchroOn = false;
										cSection.currentSynchro.updateNext = cSection.parent.results[ 0 ];
									};
									this.addTask( newSection );
								}		
					}
					}
						else
						{
							synchro.updateNext = 1;
						}
				}
			}
		}
	}
	}
	catch ( error )
	{
		this.handleErrors( error );
	}
};
AOZ.prototype.updateFriends = function( aozObject, friends, deltaTime, vars, varsModified )
{
	for ( var f = 0; f < friends.length; f++ )
	{
		var thisObject = friends[ f ];
		var method = thisObject[ 'm_friendupdate' ];
		if ( method )
		{
			if ( aozObject.hasRan )
			{
				if ( thisObject[ 'friendupdate_m' ].inLine )
				{
					thisObject.deltaTime = deltaTime;
					thisObject.varsModified = varsModified;
					thisObject.friend = aozObject;
					thisObject[ 'friendupdate_m' ].blocks[ 0 ].call( thisObject, this, vars );
				}
				else
				{
					var newSection = new method( this, aozObject, {} );
					newSection.vars = { DeltaTime: deltaTime, Friend_o: aozObject };
					newSection = this.initSection( newSection );
					newSection.currentResult = 0;
					newSection.currentSynchro = synchro;
					newSection.callAtPop = function( cSection, pop )
					{
						cSection.currentSynchro.rootObject.synchroOn = false;
						cSection.currentSynchro.updateNext = cSection.parent.results[ 0 ];
					};
					this.addTask( newSection );
				}
			}
		}
	}
};
AOZ.prototype.openURL = function( url, windowName )
{
	try
	{
		if ( window.parent != null && window.parent.atom != null )
		{
			command = window.parent.atom.aozAPI.openURL( url, windowName );
			return;
		}
	}
	catch ( err )
	{
	}
	window.open( url, windowName );
};

AOZ.prototype.setUpdate = function( onOff )
{
	this.isUpdate = onOff;
};
AOZ.prototype.setBobsUpdate = function( onOff )
{
	if ( this.isUpdate != onOff )
	{
		this.isUpdate = onOff;
		for ( var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement() )
			screen.setBobsUpdate( onOff );
	}
}
AOZ.prototype.rendererUpdate = function()
{
	this.updateEveryCount++;
	if ( this.updateEveryCount > this.updateEvery )
	{
		this.updateEveryCount = 0;
		this.update();
	}
}
AOZ.prototype.update = function( force )
{
	if ( force || this.isUpdate )
	{
		if ( this.sprites )
			this.sprites.update( true );
		for ( var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement() )
			screen.update( true );
	}
};
AOZ.prototype.bobsUpdate = function( force )
{
	if ( !force )
		force = this.isUpdate;
	//else
	//	force = !this.isUpdate;
	if ( force )
	{
		for ( var screen = this.screensContext.getFirstElement(); screen != null; screen = this.screensContext.getNextElement() )
			screen.update( force );
	}
};
AOZ.prototype.updateEvery = function( every )
{
	if ( every < 1 )
		throw { error: 'illegal_function_call', parameter: every };
	this.updateEvery = every;
	this.updateEveryCount = 0;
};



AOZ.prototype.free = function()
{
	return 0;
};
AOZ.prototype.fastFree = function()
{
	return 0;
};
AOZ.prototype.chipFree = function()
{
	return 0;
};


AOZ.prototype.setTags = function( tags )
{
	if ( this.utilities.getTag( tags, [ 'refresh' ] ) != '' )
		this.renderer.setModified();
	if ( this.utilities.getTag( tags, [ 'restart' ] ) != '' )
		this.run();
	if ( this.utilities.getTag( tags, [ 'debugger' ] ) != '' )
		debugger;
	if ( this.utilities.getTag( tags, [ 'break' ] ) != '' )
		this.break;
	/*
	Possible tags:
	#step-> go in step-through mode after property has been set in AOZ debugger (do today?)
	#record -> record all the values of the property with time
	*/
};

AOZ.prototype.displayWidth = function()
{
	return this.renderingContext.display.width;
};
AOZ.prototype.displayHeight = function()
{
	return this.renderingContext.display.height;
};
AOZ.prototype.ntsc = function()
{
	return this.platform == 'amiga' && this.manifest.display.tvStandard == 'ntsc';
};
AOZ.prototype.stop = function()
{
	debugger;
	//throw 'program_interrupted';
};
AOZ.prototype.every = function( interval, definition )
{
	if ( this.everyPile.find( function( element )
	{
		return definition = element.definition;
	} ) )
	throw 'every_already_defined';

	// Only one Gosub
	if ( definition.type == 'gosub' )
	{
		if ( this.everyPile.find( function( element )
		{
			return element.definition.type == 'gosub';
		} ) )
		throw 'every_already_defined';
	}
	if ( interval <= 0 )
		throw { error: 'illegal_function_call', parameter: interval };
	if ( this.manifest.compilation.platform != 'aoz' && this.manifest.compilation.platform != 'pc' )
		interval /= 50;
	interval *= 1000;
	var info =
	{
		definition: definition,
		section: this.currentSection,
		deltaTime: 0,
		interval: interval
	};
	this.everyPile.push( info );
	this.everyOn = true;
};
AOZ.prototype.everyOnOff = function( onOff )
{
	if ( !onOff )
		this.everyPile = [];
	else
		this.everyOn = true;
};

/////////////////////////////////////////////////////////////////////////
//
// SCREENS
//
/////////////////////////////////////////////////////////////////////////
AOZ.prototype.screenOpen = function( args, tags, callback, extra )
{
	var self = this;
	var completed = false;
	function waitForLoad()
	{
		return completed;
	};
	function completeCreation( screen )
	{
		screen.number = parseInt( args.index );
		screen.vars.z = 0;
		if ( typeof args.z == 'undefined' )
			self.screenToFront( screen );
	
		// Close screen if same number?
		if ( !keepCurrent )
		{
			if ( self.currentScreen )
			{
				var previousScreen = self.screensContext.getElement( self.currentContextName, args.index );
				if ( previousScreen )
					self.screenClose( previousScreen );
				else if ( self.currentScreen )
					self.currentScreen.deactivate();
			}
			self.currentScreen = screen;
		}
		self.screensContext.setElement( self.currentContextName, screen, args.index, true );
		self.renderer.addScreen( screen, args );
		completed = true;
	};

	/////////////////////////////////////////////////////////////////////////
	args.index = typeof args.index != 'undefined' ? args.index : 0;
	if ( typeof args.index == 'number' && args.index < 0 )
		throw { error: 'illegal_function_call', parameter: args.index };

	var keepCurrent = this.utilities.isTag( tags, 'keepCurrent' );
	var pushCurrent = this.utilities.isTag( tags, 'pushCurrent' );
	if ( pushCurrent )
	{
		this.currentScreen.deactivate();
		this.pileScreen.push( this.currentScreen );
		keepCurrent = false;
	}
	tags = typeof tags == 'undefined' ? '' : tags;
	if ( this.utilities.isTag( tags, 'findFreeIndex' ) )
	{
		if ( typeof args.index == 'number' )
		{
			// Get a free screen number
			while( this.screensContext.getElement( this.currentContextName, args.index, undefined ) )
				args.index++;
		}
		else
			throw { error: 'illegal_function_call', parameter: index };
	}
	tags += '#noCls';
	args.contextName = this.currentContextName;

	// Open the screen
	var screen = new Screen( this, args, tags )
	if ( screen )
	{
		var done = screen.completeCreation( args, function( response, data, extra )
	{
			if ( response )
				completeCreation( screen );
			if ( callback )
				callback( response, screen, extra );
		} );
		if ( !done && !callback )
		{
			this.currentSection.waiting = waitForLoad;
			this.currentSection.waitThis = this;
		}
		if ( done )
			completeCreation( screen );
	}
	return screen;
};
AOZ.prototype.screenClose = function( index, tags )
{
	var popCurrent = this.utilities.isTag( tags, 'popCurrent' );
	var keepCurrent = this.utilities.isTag( tags, 'keepCurrent' );
	if ( popCurrent )
	{
		keepCurrent = true;
		if ( this.currentScreen )
			index = this.currentScreen.number;
	}
	var screen = this.getScreen( index );

	// Close cloned screens
	var self = this;
	do
	{
		var redo = false;
		for ( var s = this.screensContext.getFirstElement( this.currentContextName ); s != null; s = this.screensContext.getNextElement( this.currentContextName ) )
		{
			if ( s.cloned == screen )
			{
				closeIt( s );
				redo = true;
				break;
			}
		}
	} while( redo );

	// Close screen
	closeIt( screen );
	if ( popCurrent )
	{
		if ( this.pileScreens.length == 0 )
			throw { error: 'illegal_function_call', parameter: '(empty pile)' };
		this.currentScreen = this.pileScreens.pop();
	}
	else
	{
		for ( var s = 0; s < this.pileScreens.length; s++ )
		{
			if ( this.pileScreens[ s ] == screen )
			{
				this.pileScreens.splice( s, 1 );
				break;
			}
		}
	}
	this.renderer.delScreen( screen );

	function closeIt( screen )
	{
		screen.close();
		self.screensContext.deleteElement( self.currentContextName, screen );
		if ( !keepCurrent )
		{
			self.currentScreen = self.screensContext.getLastElement( self.currentContextName );
			if ( !self.currentScreen )
			{
				self.currentScreen = new ScreenEmpty( self );
				self.currentScreen.index = -1;
			}
		}
	}
};
AOZ.prototype.screenClone = function( number, tags )
{
	tags = typeof tags != 'undefined' ? tags : '';

	//var screen = this.getScreen( number );
	var oldScreen = this.currentScreen;
	var newVars = this.utilities.copyObject( oldScreen.vars, false );
	newVars.z = undefined;
	newVars.index = number;
	var screen = this.screenOpen( newVars, tags );
	screen.setCloned( oldScreen );
	this.setScreen( oldScreen.number );
	this.renderer.setModified();
};
AOZ.prototype.setScreen = function( number )
{
	var screen = this.getScreen( number );
	if ( this.currentScreen )
		this.currentScreen.deactivate();
	this.currentScreen = screen;
	this.currentScreen.activate();
};
AOZ.prototype.getScreen = function( number, error )
{
	error = typeof error != 'undefined' ? error : 'screen_not_opened';

	if ( typeof number == 'undefined' )
		return this.currentScreen;
	if ( this.utilities.isObject( number ) && number.className == 'screen' )
		return number;
	return this.screensContext.getElement( this.currentContextName, number, error );
};
AOZ.prototype.getScreenOrCreateOne = function( args, tags )
{
	if ( typeof args.index == 'undefined' )
	{
		if ( this.currentScreen.emptyScreen )
			throw 'screen_not_opened'
		return this.currentScreen;
	}

	// TODOFL: check that tags are the same
	tags = typeof tags != 'undefined' ? tags : '' ;
	var screen = this.screensContext.getElement( this.currentContextName, args.index );
	if ( screen )
		return screen;

	// Create screen, and cursoff!
	this.screenOpen( args, tags );
	this.currentScreen.currentTextWindow.setCursor( false );
	return this.currentScreen;
};
AOZ.prototype.screenIn = function( number, position )
{
	if ( typeof number != 'undefined' )
		return this.getScreen( number ).isIn( position ) ? number : -1;
	position = ( typeof position === 'undefined' ? {} : position );
	position.x = ( typeof position.x == 'undefined' ? this.getXMouse() : position.x );
	position.y = ( typeof position.y == 'undefined' ? this.getYMouse() : position.y );

	// Scan all screens
	var sorted = this.screensContext.parseSorted( undefined, function( screen1, screen2 )
	{
		if ( screen1.vars.z > screen2.vars.z )
			return -1;
		if ( screen1.vars.z < screen2.vars.z )
			return 1;
		if ( screen1.index > screen2.index )
			return -1;
		if ( screen1.index < screen2.index )
			return 1;
		return 0;
	} );
	for ( var s = 0; s < sorted.length; s++ )
	{
		var screen = sorted[ s ];
		if ( screen && screen.vars.visible )
		{
			if ( screen.isIn( position ) )
			{
				if ( !screen.isPixelTransparent( position ) )
				{
					return screen.number;
				}
			}
		}
	}
	return -1;
};
/*
AOZ.prototype.mouseScreen = function( position )
{
	for ( var screen = this.screensContext.getLastElement( this.currentContextName ); screen !=null; screen = this.screensContext.getPreviousElement( this.currentContextName ) )
	{
		if ( screen.isIn( position ) )
		{
			return screen.number;
		}
	}
	return -1;
};
*/
AOZ.prototype.screenToBack = function( index )
{
	var sMin = undefined;
	var zMin = 10000000;
	var screen = this.getScreen( index );
	this.screensContext.parseAll( this.currentContextName, function( s )
	{
		if ( s.vars.z < zMin )
		{
			zMin = s.vars.z;
			sMin = s;
		}
	} );
	if ( sMin && sMin != screen && zMin <= screen.vars.z )
	{
		zMin = zMin - 1;
		screen.setPosition( { z: zMin } );
	}
}
AOZ.prototype.screenToFront = function( index )
{
	var zMax = -10000000;
	var sMax = undefined;
	var screen = this.getScreen( index );
	this.screensContext.parseAll( this.currentContextName, function( s )
	{
		if ( s.vars.z > zMax )
		{
			zMax = s.vars.z;
			sMax = s;
		}
	} );
	if ( sMax && sMax != screen && zMax >= screen.vars.z )
		screen.setPosition( { z: zMax + 1 } );
}
AOZ.prototype.setFlash = function( onOff )
{
	this.screensContext.parseAll( this.currentContextName, function( screen )
	{
		screen.setFlash( onOff );
	} );
}
AOZ.prototype.screenSkew = function( number, xSkew, ySkew )
{
	var screen = this.getScreen( number );
	screen.xSkewDisplay = typeof xSkew != 'undefined' ? xSkew : screen.xSkewDisplay;
	screen.ySkewDisplay = typeof ySkew != 'undefined' ? ySkew : screen.ySkewDisplay;
	screen.setModified();
};
AOZ.prototype.screenScale = function( number, xScale, yScale )
{
	var screen = this.getScreen( number );
	screen.xScaleDisplay = typeof xScale != 'undefined' ? xScale : screen.xScaleDisplay;
	screen.yScaleDisplay = typeof yScale != 'undefined' ? yScale : screen.yScaleDisplay;
	screen.setModified();
};

AOZ.prototype.dualPlayfield = function( screen1, screen2 )
{
	screen1 = this.getScreen( screen1 );
	screen2 = this.getScreen( screen2 );
	screen1.setDualPlayfield( screen2 );
};
AOZ.prototype.dualPriority = function( screen1, screen2 )
{
	screen1 = this.getScreen( screen1 );
	screen2 = this.getScreen( screen2 );
	screen1.dualPriority( screen2 );
};
AOZ.prototype.setDefaultPalette = function( palette )
{
	for ( var p = 0; p < palette.length; p++ )
	{
		if ( typeof palette[ p ] != 'undefined' )
		{
			this.defaultPalette[ p ] = this.utilities.getModernColorString( palette[ p ] );
		}
	}
};
AOZ.prototype.colourBack = function( color, isIndex )
{
	if ( !isIndex )
		color = this.utilities.getModernColorString( color );
	else
	{
		if ( color < 0 )
			throw { error: 'illegal_function_call', parameter: color };
		color %= this.currentScreen.vars.numberOfColors;
		color = this.currentScreen.vars.palette[ color ];
	}
	this.renderer.setBackgroundColor( color );
};
AOZ.prototype.swapZScreenPosition = function( screen1, screen2 )
{
	var z1, z2;
	for ( z1 = 0; z1 < this.screensZ.length; z1++ )
	{
		if ( this.screensZ[ z1 ] == screen1 )
			break;
	}
	for ( z2 = 0; z2 < this.screensZ.length; z2++ )
	{
		if ( this.screensZ[ z2 ] == screen2 )
			break;
	}
	var temp = this.screensZ[ z1 ];
	this.screensZ[ z1 ] = this.screensZ[ z2 ];
	this.screensZ[ z2 ] = temp;
};
AOZ.prototype.setBelowZScreenPosition = function( screen1, screen2 )
{
	var z1, z2;
	for ( z1 = 0; z1 < this.screensZ.length; z1++ )
	{
		if ( this.screensZ[ z1 ].number == screen1.number )
			break;
	}
	for ( z2 = 0; z2 < this.screensZ.length; z2++ )
	{
		if ( this.screensZ[ z2 ].number == screen2.number )
			break;
	}
	if ( z1 > z2 )
	{
		this.screensZ.splice( z1, 1 );
		this.screensZ.splice( z2, 0, screen1 );
	}
}
AOZ.prototype.default = function( contextName )
{
	this.amal.reset();
	this.synchroList = [];

	var s = this.screensContext.getFirstElement( this.currentContextName );
	while ( s )
	{
		this.screenClose( s.index );
		s = this.screensContext.getFirstElement( this.currentContextName );
	}

	this.screenOpen( {}, '' );
};

AOZ.prototype.lprint = function()
{
	throw 'instruction_not_implemented';
};











AOZ.prototype.doError = function( number )
{
	throw this.errors.getErrorFromNumber( number ).index;
};

AOZ.prototype.asc = function( text )
{
	if ( text != '' )
		return text.charCodeAt( 0 );
	return 0;
};
AOZ.prototype.repeat$ = function( text, number )
{
	if ( number < 0 )
		throw( 'illegal_text_window_parameter' );
	var result = '';
	for ( var n = 0; n < number; n++ )
		result += text;
	return result;
};
AOZ.prototype.str$ = function( value, fix )
{
	if ( value === false )
		value = 0;
	if ( this.platform != 'aoz' )
	{
		if ( value === true )
			value = -1;
	}
	else
	{
		if ( value === true )
			value = 1;
	}
	var space = value >= 0 ? ' ' : '';


	var decimalPart = value - Math.floor( value );
	var result;
	fix = typeof fix == 'undefined' ? this.fix : fix;
	if ( fix == 16 || decimalPart == 0 )
		result = '' + value;
	else if ( fix >= 0 )
		result = value.toFixed( fix );
	else
		result = value.toExponential( -fix );

	// Fix -0.00 problem...
	if ( result.substring( 0, 3 ) == '-0.' )
	{
		var onlyZeros = true;
		for ( var p = 0; p < result.length; p++ )
		{
			var c = result.charAt( p );
			if ( c >= '1' && c <= '9' )
			{
				onlyZeros = false;
				break;
			}
		}
		if ( onlyZeros )
			result = result.substring( 1 );
	}
	return space + result;
};

AOZ.prototype.trim$ = function( value )
{
	if( value && value.trim )
	{
		return value.trim();
	}

	return value;
};

AOZ.prototype.val = function( value )
{
	var base = 10;
	var result = 0;
	var s = value.substring(0,1);
	switch (s)
	{
		case '$':
			value = value.substring( 1 );
			base = 16;
			result = parseInt( value, base );
			break;
		case '%':
			value = value.substring( 1 );
			base = 2;
			result = parseInt( value, base );
			break;
		default:
			result = parseFloat( value );
	}
	if ( isNaN( result ) )
		result = 0;
	return result;
};

/*
	Note:  Minor issue remains on val.
	In AMOS Pro, if the variable being set is an Integer, the integer value should
	be taken before conversion, so no rounding occurs.  So...
		X = Val("1234.56") would return X as 1234 vs. 1235.
*/
AOZ.prototype.checkIndex = function( index )
{
	if ( typeof index == 'string' )
	{
		if ( index.indexOf( '.' ) >= 0 || index.indexOf( ':' ) >= 0 || index.indexOf( '/' ) >= 0 || index.indexOf( '\\' ) >= 0 )
		{
			var name = this.utilities.getFilename( index );
			if ( name )
				return name;
		}
	}
	return index;
}
AOZ.prototype.space$ = function( value )
{
	if ( value < 0 )
		throw { error: 'illegal_function_call', parameter: value };

	var result = '';
	for ( var s = 0; s < value; s++ )
		result += ' ';
	return result;
}
AOZ.prototype.toRadian = function( value )
{
	if ( this.degrees )
	 	return value / 180 * ( Math.PI / 2 );
	return value;
};
AOZ.prototype.toDegree = function( value )
{
	if ( this.degrees )
	 	return value * 180 / ( Math.PI / 2 );
	return value;
};
AOZ.prototype.checkNumber = function( value )
{
	if ( isNaN( value ) || value == Infinity )
		throw { error: 'illegal_function_call', parameter: '' };
	return value;
};

// Keyboard / mouse
AOZ.keyModifiers =
{
	amiga:
	{
		'LEFTSHIFT': 0x0001,
		'RIGHTSHIFT': 0x0002,
		'LEFTCONTROL': 0x8008, // BJF was 4
		'RIGHTCONTROL': 0x0008,
		'CONTROL': 0x8008, // BJF control C fix.
		'LEFTALT': 0x0010,
		'RIGHTALT': 0x0020,
		'LEFTMETA': 0x0040,
		'RIGHTMETA': 0x0080,
		'CAPSLOCK': 0x0004,
		'NUMLOCK': 0x0200,
		'SCROLLLOCK': 0x0400,
		'FUNCLOCK': 0x0800 // BJF added
		// do we also need INSERTLOCK?
	},
	aoz:
	{
		'LEFTSHIFT': 0x0001,
		'RIGHTSHIFT': 0x0002,
		'LEFTCONTROL': 0x0004,
		'RIGHTCONTROL': 0x0008,
		'CONTROL': 0x000C, // BJF control C fix
		'LEFTALT': 0x0010,
		'RIGHTALT': 0x0020,
		'LEFTMETA': 0x0040,
		'RIGHTMETA': 0x0080,
		'CAPSLOCK': 0x0100,
		'NUMLOCK': 0x0200, //
		'SCROLLLOCK': 0x0400,
		'FUNCLOCK': 0x0800 // BJF added
	}
}

AOZ.keyPressed =
{
	// AOZ
	aoz:
	{
		'Minus':		{ inkey$: '-', keyCode: 189 },
		'Equal': 		{ inkey$: '=', keyCode: 187 },

		'Insert': 		{ inkey$: '', keyCode: 45 },
		'Delete': 		{ inkey$: '', keyCode: 46 },
		'Home': 		{ inkey$: '', keyCode: 36 },
		'End': 			{ inkey$: '', keyCode: 35 },
		'PageUp': 		{ inkey$: '', keyCode: 33 },
		'PageDown': 	{ inkey$: '', keyCode: 34 },

		'ArrowLeft': 	{ inkey$: String.fromCharCode( 29 ), keyCode: 37 },
		'ArrowRight': 	{ inkey$: String.fromCharCode( 28 ), keyCode: 39 },
		'ArrowUp': 		{ inkey$: String.fromCharCode( 30 ), keyCode: 38 },
		'ArrowDown': 	{ inkey$: String.fromCharCode( 31 ), keyCode: 40 },

		'Enter': 		{ inkey$: String.fromCharCode( 13 ), keyCode: 13 },

		'Backspace': 	{ inkey$: String.fromCharCode( 8 ), keyCode: 8 },
		'Backquote':     { inkey$: '&#96;', keyCode: 192 }, //{ inkey$: '`', keyCode: 192 },,
		'Backslash': 	{ inkey$: '\\', keyCode: 220 },

		'Del': 			{ inkey$: '', keyCode: 'event.which' },
		'End': 			{ inkey$: '', keyCode: 35 },
		'Home': 		{ inkey$: '', keyCode: 36 },

		'ScrollLock': 	{	inkey$: '', keyCode: 145 },
		'Pause': 		{ inkey$: '', keyCode: 19 },
		'NumLock': 		{ inkey$: '', keyCode: 144 },
		'CapsLock': 	{ inkey$: '', keyCode: 20 },

		'Tab': 			{ inkey$: String.fromCharCode( 9 ), keyCode: 9 },

		'Comma': 		{ inkey$: ',', keyCode: 188 },
		'Period': 		{ inkey$: '.', keyCode: 190 },
		'Slash': 		{ inkey$: '/', keyCode: 191 },
		'Quote': 		{ inkey$: '"', keyCode: 222 },
		'Semicolon': 	{ inkey$: ';', keyCode: 186 },
		'BracketLeft': 	{ inkey$: '[', keyCode: 219 },
		'BracketRight': { inkey$: ']', keyCode: 221 },
		'Escape': 		{ inkey$: String.fromCharCode( 0 ), keyCode: 27 },

		// modifier keys
		'Shift': 		{ inkey$: '', keyCode: 16 },
		'Control': 		{ inkey$: '', keyCode: 17 },
		'ShiftLeft': 	{ inkey$: '', keyCode: 16 },
		'ShiftRight': 	{ inkey$: '', keyCode: 16 },
		'ControlLeft': 	{ inkey$: '', keyCode: 17 },
		'ControlRight': { inkey$: '', keyCode: 17 },
		'AltLeft':		{ inkey$: '', keyCode: 18 },
		'AltRight':		{ inkey$: '', keyCode: 18 },
		'OSLeft': 		{ inkey$: '', keyCode: 91 },
		'MetaLeft': 	{ inkey$: '', keyCode: 91 },
		'ContextMenu': 	{ inkey$: '', keyCode: 92 },

		'IntlBackslash': { inkey$: '<', keyCode: 'event.which' },

		'F1': 			{ inkey$: '', keyCode: 112 },
		'F2': 			{ inkey$: '', keyCode: 113 },
		'F3': 			{ inkey$: '', keyCode: 114 },
		'F4': 			{ inkey$: '', keyCode: 115 },
		'F5': 			{ inkey$: '', keyCode: 116 },
		'F6': 			{ inkey$: '', keyCode: 117 },
		'F7': 			{ inkey$: '', keyCode: 118 },
		'F8': 			{ inkey$: '', keyCode: 119 },
		'F9': 			{ inkey$: '', keyCode: 120 },
		'F10': 			{ inkey$: '', keyCode: 121 },

		// F11 & F12 are used by macOS
		'F11': 			{ inkey$: '', keyCode: 122 },
		'F12': 			{ inkey$: '', keyCode: 123 },
		'F13': 			{ inkey$: '', keyCode: 124 },

		'Numpad0': 		{ inkey$: '0', keyCode: 96 },
		'Numpad1': 		{ inkey$: '1', keyCode: 97 },
		'Numpad2': 		{ inkey$: '2', keyCode: 98 },
		'Numpad3': 		{ inkey$: '3', keyCode: 99 },
		'Numpad4': 		{ inkey$: '4', keyCode: 100 },
		'Numpad5': 		{ inkey$: '5', keyCode: 101 },
		'Numpad6': 		{ inkey$: '6', keyCode: 102 },
		'Numpad7': 		{ inkey$: '7', keyCode: 103 },
		'Numpad8': 		{ inkey$: '8', keyCode: 104 },
		'Numpad9': 		{ inkey$: '9', keyCode: 105 },

		'NumpadDivide': { inkey$: '/', keyCode: 111 },
		'NumpadMultiply': { inkey$: '*', keyCode: 106 },
		'NumpadSubtract': { inkey$: '-', keyCode: 109 },
		'NumpadAdd': 	{ inkey$: '+', keyCode: 107 },
		'NumpadEnter': 	{ inkey$: String.fromCharCode( 13 ), keyCode: 13 },
		'NumpadDecimal': { inkey$: '.', keyCode: 110 },
		'NumpadEqual': 	{ inkey$:'=', keyCode: 187 },

		'Digit0': 		{ inkey$: 'event.key', keyCode: 48 },
		'Digit1': 		{ inkey$: 'event.key', keyCode: 49 },
		'Digit2': 		{ inkey$: 'event.key', keyCode: 50 },
		'Digit3': 		{ inkey$: 'event.key', keyCode: 51 },
		'Digit4': 		{ inkey$: 'event.key', keyCode: 52 },
		'Digit5': 		{ inkey$: 'event.key', keyCode: 53 },
		'Digit6': 		{ inkey$: 'event.key', keyCode: 54 },
		'Digit7': 		{ inkey$: 'event.key', keyCode: 55 },
		'Digit8': 		{ inkey$: 'event.key', keyCode: 56 },
		'Digit9': 		{ inkey$: 'event.key', keyCode: 57 },
		'Space': 		{ inkey$: 'event.key', keyCode: 32 },
		'KeyA': 		{ inkey$: 'event.key', keyCode: 65 },
		'KeyB': 		{ inkey$: 'event.key', keyCode: 66 },
		'KeyC': 		{ inkey$: 'event.key', keyCode: 67 },
		'KeyD': 		{ inkey$: 'event.key', keyCode: 68 },
		'KeyE': 		{ inkey$: 'event.key', keyCode: 69 },
		'KeyF': 		{ inkey$: 'event.key', keyCode: 70 },
		'KeyG': 		{ inkey$: 'event.key', keyCode: 71 },
		'KeyH': 		{ inkey$: 'event.key', keyCode: 72 },
		'KeyI': 		{ inkey$: 'event.key', keyCode: 73 },
		'KeyJ': 		{ inkey$: 'event.key', keyCode: 74 },
		'KeyK': 		{ inkey$: 'event.key', keyCode: 75 },
		'KeyL': 		{ inkey$: 'event.key', keyCode: 76 },
		'KeyM': 		{ inkey$: 'event.key', keyCode: 77 },
		'KeyN': 		{ inkey$: 'event.key', keyCode: 78 },
		'KeyO': 		{ inkey$: 'event.key', keyCode: 79 },
		'KeyP': 		{ inkey$: 'event.key', keyCode: 80 },
		'KeyQ': 		{ inkey$: 'event.key', keyCode: 81 },
		'KeyR': 		{ inkey$: 'event.key', keyCode: 82 },
		'KeyS': 		{ inkey$: 'event.key', keyCode: 83 },
		'KeyT': 		{ inkey$: 'event.key', keyCode: 84 },
		'KeyU': 		{ inkey$: 'event.key', keyCode: 85 },
		'KeyV': 		{ inkey$: 'event.key', keyCode: 86 },
		'KeyW': 		{ inkey$: 'event.key', keyCode: 87 },
		'KeyX': 		{ inkey$: 'event.key', keyCode: 88 },
		'KeyY': 		{ inkey$: 'event.key', keyCode: 89 },
		'KeyZ': 		{ inkey$: 'event.key', keyCode: 90 },
	}, // aoz

	// Javascript -> Amiga
	amiga:
	{
		'Minus':		{ inkey$: '-',keyCode: 0x0B},
		'Equal': 		{ inkey$: '=', keyCode: 0x0C },

		'Insert': 		{ inkey$: '', keyCode: 45 },
		'Delete': 		{ inkey$: '', keyCode: 46 },
		'Home': 		{ inkey$: '', keyCode: 36 },
		'End': 			{ inkey$: '', keyCode: 35 },
		'PageUp':		{ inkey$: '', keyCode: 33 },
		'PageDown': 	{ inkey$: '', keyCode: 34 },

		'ArrowLeft': 	{ inkey$: String.fromCharCode( 29 ), keyCode: 79 },
		'ArrowRight': 	{ inkey$: String.fromCharCode( 28 ), keyCode: 78 },
		'ArrowUp': 		{ inkey$: String.fromCharCode( 30 ), keyCode: 76 },
		'ArrowDown': 	{ inkey$: String.fromCharCode( 31 ), keyCode: 77 },

		'Enter': 		{ inkey$: String.fromCharCode( 13 ), keyCode: 0x44 }, // 69 },
		'Backspace': 	{ inkey$: String.fromCharCode( 8 ), keyCode: 65 },
		'Backquote': 	{ inkey$: '``', keyCode: 192 },
		'Backslash': 	{ inkey$: '\\', keyCode: 13 },

		'Del': 			{ inkey$: String.fromCharCode( 0 ), keyCode: 70 },

		'Tab': 			{ inkey$: '\t', keyCode: 66 },
		'Comma': 		{ inkey$: ',', keyCode: 56 },
		'Period': 		{ inkey$: '.', keyCode: 57 },
		'Slash': 		{ inkey$: '/', keyCode: 58 },
		'Quote': 		{ inkey$: '"', keyCode: 42 },
		'Semicolon': 	{ inkey$: ';', keyCode: 41 },
		'BracketLeft': 	{ inkey$: '[', keyCode: 26 },
		'BracketRight': { inkey$: ']', keyCode: 27 },
		'Escape': 		{ inkey$: String.fromCharCode( 27 ), keyCode: 69 },

		// locking keys
		'CapsLock': 	{ inkey$: '', keyCode: 0x62 },
		'ScrollLock': 	{ inkey$: undefined, keyCode: undefined },
		'NumLock': 		{ inkey$: '', keyCode: 12+128 },

		// modifier keys
		'Shift': 		{ inkey$: '', keyCode: undefined },
		'Control': 		{ inkey$: '', keyCode: undefined },

		'ShiftLeft': 	{ inkey$: '', keyCode: 0x60 },
		'ShiftRight': 	{ inkey$: '', keyCode: 0x61 },
		'ControlLeft': 	{ inkey$: '', keyCode: 0x63 },
		'ControlRight': { inkey$: '', keyCode: 0x63 },
		'AltLeft':		{ inkey$: '', keyCode: 0x64 },
		'AltRight':		{ inkey$: '', keyCode: 0x65 },
		'OSLeft': 		{ inkey$: '', keyCode: 0x66 },
		'MetaLeft': 	{ inkey$: '', keyCode: 0x66 },
		'ContextMenu': 	{ inkey$: '', keyCode: 0x67 },

		'IntlBackslash': { inkey$: '<', keyCode: 'event.which' },

		'F1': 			{ inkey$: '', keyCode: 80 },
		'F2': 			{ inkey$: '', keyCode: 81 },
		'F3': 			{ inkey$: '', keyCode: 82 },
		'F4': 			{ inkey$: '', keyCode: 83 },
		'F5': 			{ inkey$: '', keyCode: 84 },
		'F6': 			{ inkey$: '', keyCode: 85 },
		'F7': 			{ inkey$: '', keyCode: 86 },
		'F8': 			{ inkey$: '', keyCode: 87 },
		'F9': 			{ inkey$: '', keyCode: 88 },
		'F10': 			{ inkey$: '', keyCode: 89 },
		'F11': 			{ inkey$:'', keyCode: 122 },
		'F12': 			{ inkey$: '', keyCode: 123 },
		'F13': 			{ inkey$: '', keyCode: 124 },
		'Numpad0': 		{ inkey$: '0', keyCode: 15 },
		'Numpad1': 		{ inkey$: '1', keyCode: 29 },
		'Numpad2': 		{ inkey$: '2', keyCode: 30 },
		'Numpad3': 		{ inkey$: '3', keyCode: 31 },
		'Numpad4': 		{ inkey$: '4', keyCode: 45 },
		'Numpad5': 		{ inkey$: '5', keyCode: 46 },
		'Numpad6': 		{ inkey$: '6', keyCode: 47 },
		'Numpad7': 		{ inkey$: '7', keyCode: 61 },
		'Numpad8': 		{ inkey$: '8', keyCode: 62 },
		'Numpad9': 		{ inkey$: '9', keyCode: 63 },
		'NumpadDivide': { inkey$: '/', keyCode: 92 },
		'NumpadMultiply': { inkey$: '*', keyCode: 93 },
		'NumpadSubtract': { inkey$: '-', keyCode: 74 },
		'NumpadAdd': 	{ inkey$: '+', keyCode: 94 },
		'NumpadEnter': 	{ inkey$: String.fromCharCode( 13 ), keyCode: 67 },
		'NumpadDecimal': { inkey$: '.', keyCode: 60 },
		'NumpadEqual': 	{ inkey$:'=', keyCode: 187 }, // = non-existent on Amiga

		'Digit0': 		{ inkey$: 'event.key', keyCode: 10 },
		'Digit1': 		{ inkey$: 'event.key', keyCode: 1 },
		'Digit2': 		{ inkey$: 'event.key', keyCode: 2 },
		'Digit3': 		{ inkey$: 'event.key', keyCode: 3 },
		'Digit4': 		{ inkey$: 'event.key', keyCode: 4 },
		'Digit5': 		{ inkey$: 'event.key', keyCode: 5 },
		'Digit6': 		{ inkey$: 'event.key', keyCode: 6 },
		'Digit7': 		{ inkey$: 'event.key', keyCode: 7 },
		'Digit8': 		{ inkey$: 'event.key', keyCode: 8 },
		'Digit9': 		{ inkey$: 'event.key', keyCode: 9 },

		'Space': 		{ inkey$: 'event.key', keyCode: 64 },

		'KeyA': 		{ inkey$: 'event.key', keyCode: 32 },
		'KeyB': 		{ inkey$: 'event.key', keyCode: 53 },
		'KeyC': 		{ inkey$: 'event.key', keyCode: 51 },
		'KeyD': 		{ inkey$: 'event.key', keyCode: 34 },
		'KeyE': 		{ inkey$: 'event.key', keyCode: 18 },
		'KeyF': 		{ inkey$: 'event.key', keyCode: 35 },
		'KeyG': 		{ inkey$: 'event.key', keyCode: 36 },
		'KeyH': 		{ inkey$: 'event.key', keyCode: 37 },
		'KeyI': 		{ inkey$: 'event.key', keyCode: 23 },
		'KeyJ': 		{ inkey$: 'event.key', keyCode: 38 },
		'KeyK': 		{ inkey$: 'event.key', keyCode: 39 },
		'KeyL': 		{ inkey$: 'event.key', keyCode: 40 },
		'KeyM': 		{ inkey$: 'event.key', keyCode: 55 },
		'KeyN': 		{ inkey$: 'event.key', keyCode: 54 },
		'KeyO': 		{ inkey$: 'event.key', keyCode: 24 },
		'KeyP': 		{ inkey$: 'event.key', keyCode: 25 },
		'KeyQ': 		{ inkey$: 'event.key', keyCode: 16 },
		'KeyR': 		{ inkey$: 'event.key', keyCode: 19 },
		'KeyS': 		{ inkey$: 'event.key', keyCode: 33 },
		'KeyT': 		{ inkey$: 'event.key', keyCode: 20 },
		'KeyU': 		{ inkey$: 'event.key', keyCode: 22 },
		'KeyV': 		{ inkey$: 'event.key', keyCode: 52 },
		'KeyW': 		{ inkey$: 'event.key', keyCode: 17 },
		'KeyX': 		{ inkey$: 'event.key', keyCode: 50 },
		'KeyY':			{ inkey$: 'event.key', keyCode: 21 },
		'KeyZ': 		{ inkey$: 'event.key', keyCode: 49 },
	} // amiga
}; // AOZ.keyPressed

AOZ.prototype.setKeyboard = function()
{
	this.keymap = {};
	this.lastKey = ''; // undefined;	// string
	this.lastKeyCode = 0; // undefined;	// numeric
	this.lastKeyName = ''; // undefined;	// string
	this.key = ''; // undefined;
	this.keyCode = 0; // undefined;
	this.keyName = ''; // undefined; BJF 19 Aug fixed undefined
	this.modifiers = 0;
	this.lastModifiers = 0;

	var self = this;
	document.onkeydown = onKeyDown;
	document.onkeyup = onKeyUp;

	function onKeyDown( event )
	{
		if ( !( event = self.callExternalEvents( 'keydown', event ) ) )
			return;

		if ( !self.developerMode )
		{
			if( event && event.target && event.target.getAttribute( 'keys-binding' ) != 'yes' )
			{
				event.preventDefault();
			}
		}
		else
		{
			// Open / close Aoz-Viewer Chrome debugger
			if ( event.code == 'F12'  )
			{
				if ( self.ext_debugging && self.ext_debugging.debugUI && self.ext_debugging.debugEvents && self.ext_debugging.debugEvents.isConnected() )
				{
					self.ext_debugging.debugUI.toggleDevTools();
					return;
				}
			}
		}

		// If called under Python, "code" is not defined. Find it from keyCode.
		if ( typeof event.code == 'undefined' )
		{
			if ( AOZ.keyPressed[ self.platformKeymap ] )
			{
				var keys = AOZ.keyPressed[ self.platformKeymap ];
				for ( var k in keys )
				{
					if ( keys[ k ].keyCode == event.keyCode )
					{
						event.code = k;
						break;
					}
				}
			}
		}
/*
		if ( window.parent && window.parent.atom )
		{
			if( event.key == 'Escape' )
			{
				// If focus is on the console
				if ( self.manifest.infos.applicationName == 'AOZ Direct mode console' )
				{
					window.parent.atom.closeAOZViewer();
					return;
				}
				// If focus is on the application
				else if ( window.application.aoz.break )
					{
					if( typeof window.parent.atom.aozViewer.monitor != 'undefined' 
						&& window.parent.atom.aozViewer.monitor.style.display == 'block' )
						{
							window.parent.atom.closeAOZViewer();
							return;
						}
					window.parent.atom.openDirectMode();
					return;
				}
			}
			else if( event.key == 'Enter' )
			{
				if ( window.application.aoz.break )
				{
					window.parent.atom.closeAOZViewer();
					return;
				}
			}
			else if( event.key == 'F2' )
			{
				window.location.reload(false);
				return;
			}
		}
*/

		// Javascript name of the key
		self.keyName = event.code;  // code is *mostly* unique.
		self.lastKeyName = event.code;

		// Javascript event keys
		var info = self.convertToPlatform( self.platformKeymap, event );

		if ( info )
		{
			self.key = event.key;
			self.keyCode = info.keyCode;
			self.keymap[ info.keyCode ] = true;

			// Modifiers
			setModifiers( self.platformKeymap, event );
			this.keyShift = self.modifiers;

			// Function keys which = 112 - 121 = F1 - F10
			// If pressed function key, send associated stored contents.  BJF
			if ( event.keyCode >= 112 && event.keyCode < 122 )
			{
				var number = event.keyCode - 112; // 0-9 = F1-F10
				if ( ( self.modifiers && AOZ.SHIFT ) != 0 ) // wrong spelling modifier vs modifiers - wrong & vs &&
					number += 10;   // 10-19 = Shift F1 to Shift F10
				if ( self.key$[ number + 1 ] && self.key$[ number + 1 ] != '' )
				{
					self.startKeyboardInput( self.key$[ number + 1 ] );
				}
			}
		}
			// Control-C
		AOZ.CONTROL = 0x000C; // for aoz (either control) // 0x8008 for Amiga (either control`)	// 0x0200 = NUMLOCK - if numlock ON fails
		if ( event.key == 'c' && event.ctrlKey && self.breakOn == true )
			{
				self.break = true;
				self.badEnd = true;
			}
	};

	function onKeyUp( event )
	{
		if ( !( event = self.callExternalEvents( 'keyup', event ) ) )
			return;

		if ( event.defaultPrevented || event.repeat )
			return;

		// Keymap UP!
		var info = self.convertToPlatform( self.platformKeymap, event );
		if ( info )
			self.keymap[ info.keyCode ] = false;

		// Modifiers
		clearModifiers( self.platformKeymap, event );
		self.keyShift = self.modifiers;
	}

	function clearModifiers( platform, event )
	{
		var mask = 0;
		mask |= ( event.which == 16 && event.location==1 ? getFlag( platform, 'LEFTSHIFT') : 0 );
		mask |= ( event.which == 16 && event.location==2 ? getFlag( platform, 'RIGHTSHIFT') : 0 );
		mask |= ( event.which == 17 && event.location==1 ? getFlag( platform, 'LEFTCONTROL') : 0 );
		mask |= ( event.which == 17 && event.location==2 ? getFlag( platform, 'RIGHTCONTROL') : 0 );
		mask |= ( event.which == 91 ? getFlag( platform, 'LEFTMETA') : 0 );
		mask |= ( event.which == 93 ? getFlag( platform, 'RIGHTMETA') : 0 );
		mask |= ( event.which == 18 && event.location==1 ? getFlag( platform, 'LEFTALT') : 0 );
		mask |= ( event.which == 18 && event.location==2 ? getFlag( platform, 'RIGHTALT') : 0 );
		mask |= ( event.getModifierState( 'CapsLock' ) ? getFlag( platform, 'CAPSLOCK' ) : 0 );
		mask |= ( event.getModifierState( 'NumLock' ) ? getFlag( platform, 'NUMLOCK' ) : 0 );
		mask |= ( event.getModifierState( 'ScrollLock' ) ? getFlag( platform, 'SCROLLLOCK' ) : 0 );
		mask |= ( event.getModifierState('FuncLock') ? getFlag( platform, 'FUNCLOCK'):0 );
		self.modifiers &= ~mask;
	}
	function setModifiers( platform, event )
	{
		// get the shift state.
		self.modifiers |= ( event.which == 16 && event.location==1 ? getFlag( platform, 'LEFTSHIFT') : 0 );
		self.modifiers |= ( event.which == 16 && event.location==2 ? getFlag( platform, 'RIGHTSHIFT') : 0 );
		self.modifiers |= ( event.which == 17 && event.location==1 ? getFlag( platform, 'LEFTCONTROL') : 0 );
		self.modifiers |= ( event.which == 17 && event.location==2 ? getFlag( platform, 'RIGHTCONTROL') : 0 );
		self.modifiers |= ( event.which == 91 ? getFlag( platform, 'LEFTMETA') : 0 );
		self.modifiers |= ( event.which == 93 ? getFlag( platform, 'RIGHTMETA') : 0 );
		self.modifiers |= ( event.which == 18 && event.location==1 ? getFlag( platform, 'LEFTALT') : 0 );
		self.modifiers |= ( event.which == 18 && event.location==2 ? getFlag( platform, 'RIGHTALT') : 0 );
		self.modifiers |= ( event.getModifierState( 'CapsLock' ) ? getFlag( platform, 'CAPSLOCK' ) : 0 );
		self.modifiers |= ( event.getModifierState( 'NumLock' ) ? getFlag( platform, 'NUMLOCK' ) : 0 );
		self.modifiers |= ( event.getModifierState( 'ScrollLock' ) ? getFlag( platform, 'SCROLLLOCK' ) : 0 );
		self.modifiers |= ( event.getModifierState('FuncLock') ? getFlag( platform, 'FUNCLOCK') : 0 );
	}
	function getFlag( platform, aozModifierCode ) // return bitmask for specified modifier (aozModifierCode)
	{
		if ( AOZ.keyModifiers[ platform ][ aozModifierCode ] )
		{
			return AOZ.keyModifiers[ platform ][ aozModifierCode ];
		}
		return 0;
	}
	this.callKeyDown = onKeyDown;
	this.callKeyUp = onKeyUp;
};
AOZ.prototype.convertToPlatform = function( platform, event )	// Convert to current platform (Todo: make Atari please)
{
	var result;
	if ( platform && AOZ.keyPressed[ platform ] )
	{
		var keyDef = AOZ.keyPressed[ platform ][ event.code ]; // Does key exist in this key map?
		if ( keyDef )
		{
			result =
			{
				key: getKey( keyDef.inkey$ ),
				keyCode: getKey( keyDef.keyCode )
			}
		}
		else
		{
			console.log('undefined key')
		}
	}
	return result;

	function getKey( value )
	{
		if ( value == 'event.key' )
			return event.key;
		else if ( value == 'event.code' )
			return event.code;
		else if ( value == 'event.which' )
			return event.which;
		return value;
	}
};


AOZ.prototype.startKeyboardInput = function( text )
{
	var self = this;
	self.stringKey += text;
	self.clearKeyFlag = false;

	if ( !self.handleKey ) // Make sure we're NOT already handling keys.
	{
		self.handleKey = setInterval( function()
		{
			if ( self.clearKeyFlag )
			{
				clearInterval( self.handleKey );
				self.handleKey = null;
				self.stringKey = '';
			}
			else
			{
				self.keyModifiers = 0;

				// Check for embedded scan codes.
				if ( self.stringKey.indexOf( '$(SCAN' ) == 0 )
				{
					var end = self.stringKey.indexOf( 'SCAN)$' );
					if ( end > 0 )
					{
						var code = parseInt( self.stringKey.substring( 6, end ) );
						switch ( code )
						{
							case 13:
								self.keyName = 'Enter';
								break;
							case 37:
								self.keyName = 'ArrowLeft'
								break;
							case 39:
								self.keyName = 'ArrowRight'
								break;
							case 38:
								self.keyName = 'ArrowUp';
								break;
							case 40:
								self.keyName = 'ArrowDown';
								break;
							case 27:
								self.keyName = 'Escape';
								break;
							case 9:
								self.keyName = 'Tab';
								break;
							case 8:
								self.keyName = 'Backspace';
								break;
						}
					}
					self.stringKey = self.stringKey.substring( end + 6 );
				}
				else if ( self.stringKey.indexOf( '$(MASK' ) == 0 )
				{
					// Check for MASK (modifiers)
					var end = self.stringKey.indexOf( 'MASK)$' );
					if ( end > 0 )
					{
						var mask = parseInt( self.stringKey.substring( 6, end ) );

						if ( ( mask & 0x0003 ) != 0 )			// Shift
							self.modifiers |= AOZ.SHIFT;
						else if ( ( mask & 0x0004 ) != 0 )		// Caps lock
							self.modifiers |= AOZ.SHIFT;
						else if ( ( mask & 0x0008 )	!= 0 )		// Ctrl
							self.modifiers |= AOZ.CONTROL;
						else if ( ( mask & 0x0030 ) != 0 )		// Alt
							self.modifiers |= AOZ.ALT;
						else if ( ( mask & 0x0040 ) != 0 )		// Meta
							self.modifiers |= AOZ.META;
					}
					self.stringKey = self.stringKey.substring( end + 6 );
				}
				else
				{
					self.key = self.stringKey.substring( 0, 1 );
					switch ( self.key.charCodeAt( 0 ) )
					{
						case 13:
							self.keyName = 'Enter';
							break;
						case 27:
							self.keyName = 'Escape';
							break;
						case 9:
							self.keyName = 'Tab';
							break;
						case 8:
							self.keyName = 'Backspace';
							break;
						case 29:
							self.keyName = 'ArrowLeft';
							break;
						case 28:
							self.keyName = 'ArrowRight';
							break;
						case 30:
							self.keyName = 'ArrowUp';
							break;
						case 31:
							self.keyName = 'ArrowDown';
							break;
					}
					self.stringKey = self.stringKey.substring( 1 );
				}

				if ( self.stringKey.length == 0 )
				{
					// We scanned to the end of
					clearInterval( self.handleKey );
					self.handleKey = null;
					self.stringKey = '';
				}
			}
		}, 1 );
	}
}; // startKeyboardInput(text)

AOZ.prototype.debugOnKeyPress = function( key )
{
	if ( this.lastKeyName == key )
	{
		debugger;
	}
};
AOZ.prototype.putKey = function( text )
{
	this.startKeyboardInput( text );
};
AOZ.prototype.clearKey = function()
{
	this.key = null;
	this.lastKeyPressed = 0;
	this.clearKeyFlag = true;
};

AOZ.prototype.inkey$ = function()
{
	var key = this.key;
	if ( key )
	{
		this.key = null;
		this.lastKeyCode = this.keyCode;
		this.lastKeyName = this.keyName;
		this.lastModifiers = this.modifiers;
		switch ( key )
		{
			case 'Enter':		key=String.fromCharCode(13); break;
			case 'CapsLock':	key=''; break;
			case 'Tab': 		key=String.fromCharCode(9); break;
			case 'Backspace': 	key=String.fromCharCode(8); break;
			case 'Escape': 		key=String.fromCharCode(27); break;
			case 'Shift': 		key=''; break;
 			case 'Control': 	key=''; break;
			case 'Alt': 		key=''; break;
			case 'Meta':		key=''; break;
			case 'ContextMenu':	key=''; break;
			case 'ArrowLeft':	key=String.fromCharCode(28); break;
			case 'ArrowRight':	key=String.fromCharCode(31); break;
			case 'ArrowUp':		key=String.fromCharCode(29); break;
			case 'ArrowDown':	key=String.fromCharCode(30); break;
			case 'Home':		key=String.fromCharCode(0); break;
			case 'End':			key=String.fromCharCode(0); break;
			case 'PageUp':		key=String.fromCharCode(0); break;
			case 'PageDown':	key=String.fromCharCode(0); break;
			case 'ScrollLock':	key=''; break;
			case 'NumLock':		key=''; break;
			case 'Insert':		key=String.fromCharCode(30); break;
			case 'Delete':		key=String.fromCharCode(30); break;
			case 'Clear':		key=String.fromCharCode(30); break;
			case 'F1':			key=String.fromCharCode(30); break;
			case 'F2':			key=String.fromCharCode(30); break;
			case 'F3':			key=String.fromCharCode(30); break;
			case 'F4':			key=String.fromCharCode(30); break;
			case 'F5':			key=String.fromCharCode(30); break;
			case 'F6':			key=String.fromCharCode(30); break;
			case 'F7':			key=String.fromCharCode(30); break;
			case 'F8':			key=String.fromCharCode(30); break;
			case 'F9':			key=String.fromCharCode(30); break;
			case 'F10':			key=String.fromCharCode(30); break;
			case 'F11':			key=String.fromCharCode(30); break;
			case 'F12':			key=String.fromCharCode(30); break;
			case 'F13':			key=String.fromCharCode(30); break;
			case 'Help':		key=String.fromCharCode(30); break;
			default: 			break;
		}
		return key;
	}
	return '';
};

AOZ.prototype.getScanCode = function()
{
  	var key = this.lastKeyCode;
  	this.lastKeyCode = 0;
	if ( key === undefined )
		key = 0;
	return key;
};

AOZ.prototype.getKeyState = function( code )
{
	var result = this.keymap[code];
	if ( !result )
		return 0;
	else
		return this.platformTrue;
};

AOZ.prototype.getScanShift = function()
{
  var modifiers = this.lastModifiers;
  this.lastModifiers=0;
  return modifiers;
};

AOZ.prototype.getKeyName = function()
{
  var keyName = this.lastKeyName;
  this.lastKeyName='';
  return keyName
};

AOZ.prototype.getKeyShift = function( shift )
{
	return this.modifiers;
};

AOZ.prototype.waitKey = function()
{
	this.keyName = undefined;
};
AOZ.prototype.waitKey_wait = function()
{
	if ( this.key )
	{
		this.key = undefined;
		this.keyName = '';
		this.keyCode = 0;
		this.lastKey = '';
		this.lastKeyCode = 0;
		this.lastKeyName = '';

		return true;
	}
	return false;
};
AOZ.prototype.noWait = function()
{
};
AOZ.prototype.noWait_wait = function()
{
	return true;
};
AOZ.prototype.waitVbl = function( args, section )
{
	section.waitVblCount = 2;
};
AOZ.prototype.waitVbl_wait = function( section )
{
	section.waitVblCount--;
	return ( section.waitVblCount == 0 );
};
AOZ.prototype.setKey$ = function( value, number, mask )
{
	if ( number <= 0 || number > 20 )
		throw { error: 'illegal_function_call', parameter: number };
	this.key$[ number ] = value;
};
AOZ.prototype.getKey$ = function( number, mask )
{
	if ( number < 0 || number > 20 )
		throw { error: 'illegal_function_call', parameter: number };
	return this.key$[ number ];
};
AOZ.prototype.scan$ = function( number, mask )
{
	var result = '$(SCAN' + number + 'SCAN)$';
	if ( typeof mask != 'undefined' )
	{
		result += '$(MASK' + mask + 'MASK)$';
	}
	return result;
};

AOZ.prototype.varPtr = function( variableDefinition )
{
	if ( typeof variableDefinition == 'string' )
	{
	try
	{
		variableDefinition = JSON.parse( variableDefinition );
	}
	catch( e )
	{
		throw { error: 'illegal_function_call', parameter: '(internal)' };
	}
	}
	var definition;
	var index = variableDefinition.variable.index;
	if ( index )
		definition = this.variablesContext.getElement( this.currentContext, index * this.aoz.memoryHashMultiplier );	
	if ( !definition )
	{
		index = variableDefinition.variable.name;
		definition = variableDefinition;
		definition.variable.root = this.section;
		if ( definition.variable.numberOfDimensions > 0 )
		{
			var self = this.currentSection;
			var code = definition.parameters.replace( 'this.', 'self.' );
			definition.variable.dimensions = eval( code );
		}
		this.variablesContext.setElement( this.currentContext, definition, index );
	}
	if ( definition.variable.numberOfDimensions > 0 )
	{
		var self = this.currentSection;
		var code = definition.parameters.replace( 'this.', 'self.' );
		definition.variable.currentDimensions = eval( code );
	}
	return index;
};
AOZ.prototype.getVariableDefinition = function( index )
{
	return this.variablesContext.getElement( this.currentContext, index, 'variable_not_found' );
};
AOZ.prototype.getVariableType = function( index )
{
	return this.variablesContext.getElement( this.currentContext, index, 'variable_not_found' ).variable.type;
};
AOZ.prototype.getVariableName = function( index )
{
	return this.variablesContext.getElement( this.currentContext, index, 'variable_not_found' ).variable.name;
};
AOZ.prototype.getVariableValue = function( index, type )
{
	var variableDefinition = this.variablesContext.getElement( this.currentContext, index, 'variable_not_found' );
	if ( type == 'string' && variableDefinition.variable.type != 'string' )
		throw 'type_mismatch';
	else if ( type == 'number' && !( variableDefinition.variable.type == 'integer' || variableDefinition.variable.type == 'float' ) )
		throw 'type_mismatch';
	return this.getVariable( variableDefinition.variable );
};
AOZ.prototype.setVariableValue = function( index, value )
{
	var variableDefinition = this.variablesContext.getElement( this.currentContext, index, 'variable_not_found' );
	this.setVariable( variableDefinition.variable, value );
};
AOZ.prototype.setVariable = function( variable, value )
{
	if ( !variable.dimensions )
	{
		if ( variable.parent )
			this.currentSection.parent.vars[ variable.name ] = value;
		else if ( variable.root )
			this.root.vars[ variable.name ] = value;
		else
			this.currentSection.vars[ variable.name ] = value;
	}
	else
	{
		var name = variable.name;
		if ( name.lastIndexOf( '_array' ) < 0 )
			name += '_array';
		if ( variable.parent )
			this.currentSection.parent.vars[ name ].setValue( variable.dimensions, value );
		else if ( variable.root )
			this.root.vars[ name ].setValue( variable.dimensions, value );
		else
			this.currentSection.vars[ name ].setValue( variable.dimensions, value );
	}
};
AOZ.prototype.getVariable = function( variable )
{
	if ( !variable.dimensions )
	{
		if ( variable.parent )
			return this.currentSection.parent.vars[ variable.name ];
		else if ( variable.root )
			return this.root.vars[ variable.name ];
		else
			return this.currentSection.vars[ variable.name ];
	}
	else
	{
		var name = variable.name;
		if ( name.lastIndexOf( '_array' ) < 0 )
			name += '_array';
		if ( variable.parent )
			return this.currentSection.parent.vars[ name ].getValue( variable.dimensions );
		else if ( variable.root )
			return this.root.vars[ name ].getValue( variable.dimensions );
		else
			return this.currentSection.vars[ name ].getValue( variable.dimensions );
	}
};
AOZ.prototype.getVarptr = function( variableDefinition, parent )
{
	var self = parent;
	var aoz = this;
	var vars = parent.vars;
	var code = variableDefinition.code.replace( 'this.', 'self.' );
	code += ';';
	return eval( code );
};
AOZ.prototype.setVarptr = function( variableDefinition, value )
{
	if ( variableDefinition.variable.parent )
		return this.currentSection.parent.vars[ variableDefinition.variable.name ] = value;
	else if ( variableDefinition.variable.root )
		return this.root.vars[ variableDefinition.variable.name ] = value;
	else
		return this.currentSection.vars[ variableDefinition.variable.name ] = value;
};
AOZ.prototype.input = function( args )
{
	this.inputArgs = args;
	this.inputPosition = 0;
	this.inputString = '';
	this.keyName = undefined;
	this.inputCursor = 0;
	this.inputText = typeof args.text == 'undefined' ? '? ' : args.text;
	this.inputTextnewline = false;
	this.inputString = '';
};
AOZ.prototype.input_wait = function( args )
{
	if ( typeof this.inputText != 'undefined' )
	{
		if ( this.inputText == '? ' )
		{
			if ( this.isMobileDevice )
				this.inputText = this.errors.getError( 'please_enter_text' ).message;
		}
		this.currentScreen.currentTextWindow.print( this.inputText, this.inputTextNewline );
		this.inputXCursor = this.currentScreen.currentTextWindow.xCursor;
		this.currentScreen.currentTextWindow.anchorYCursor();
		this.currentScreen.currentTextWindow.forceCursor();
		this.inputString = '';
		this.inputCursor = 0;
		if ( this.isMobileDevice )
		{
			this.inputString = this.showSoftKeyboard( this.inputText );
			this.inputText = undefined;
			return this.parseInputText();
		}
		this.inputText = undefined;
	}
	if ( this.keyName )
	{
		switch ( this.keyName )
		{
			case 'Enter':
			case 'NumpadEnter':
				this.keyName = null;
				return this.parseInputText();
			case 'ArrowLeft':
				if ( this.inputCursor > 0 )
				{
					this.inputCursor--;
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.cMove( { x: this.inputCursor, y: 0 } );
				}
				break;
			case 'ArrowRight':
				if ( this.inputCursor < this.inputString.length )
				{
					this.inputCursor++;
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.cMove( { x: this.inputCursor, y: 0 } );
				}
				break;
			case 'Backspace':
				if ( this.inputCursor > 0 )
				{
					this.inputCursor--;
					this.inputString = this.inputString.substring( 0, this.inputCursor ) + this.inputString.substring( this.inputCursor + 1 );
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.print( this.inputString + ' ' );
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.cMove( { x: this.inputCursor, y: 0 } );
				}
				break;
			case 'Del':
				if ( this.inputCursor < this.inputString.length )
				{
					this.inputString = this.inputString.substring( 0, this.inputCursor ) + this.inputString.substring( this.inputCursor + 1 );
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.print( this.inputString + ' ' );
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.cMove( { x: this.inputCursor, y: 0 } );
				}
				break;
			default:
				if ( this.key.length == 1 )
				{
					// Normal character
					this.inputString = this.inputString.substring( 0, this.inputCursor ) + this.key + this.inputString.substring( this.inputCursor );
					this.inputCursor++;
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.print( this.inputString );
					this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
					this.currentScreen.currentTextWindow.cMove( { x: this.inputCursor, y: 0 }  );
				}
				break;
		}
		this.keyName = null;
	}
	return false;

};
AOZ.prototype.parseInputText = function()
{
	var previousComma = 0;
	var inputString;
	while( true )
	{
		var comma = this.inputString.indexOf( ',', previousComma );
		if ( this.inputArgs.variables.length > 1 && comma >= 0 && !this.inputArgs.isLineInput )
		{
			inputString = this.inputString.substring( previousComma, comma );
			previousComma = comma + 1;
		}
		else
		{
			inputString = this.inputString.substring( previousComma );
			previousComma = this.inputString.length;
		}
		var variable = this.inputArgs.variables[ this.inputPosition ];
		var value;
		if ( variable.type == 0 )
			value = inputString.length > 0 ? parseInt( inputString ) : 0;
		else if ( variable.type == 1 )
			value = inputString.length > 0 ? parseFloat( inputString ) : 0;
		else
			value = inputString;
		if ( variable.type != 2 && isNaN( value ) )
		{
			this.currentScreen.currentTextWindow.print( '', true );
			this.inputText = this.errors.getError( 'please_redo_from_start' ).message;
			this.inputTextNewline = true;
			this.inputPosition = 0;
			this.inputString = '';
			break;
		}
		this.setVariable( variable, value );
		this.inputPosition++;
		if ( this.inputPosition >= this.inputArgs.variables.length )
		{
			if ( this.inputArgs.newLine )
				this.currentScreen.currentTextWindow.print( '', true );
			this.key = null;
			this.currentScreen.currentTextWindow.restoreCursor();
			return true;
		}
		if ( previousComma >= this.inputString.length )
		{
			this.currentScreen.currentTextWindow.locate( { x: this.inputXCursor, y: this.currentScreen.currentTextWindow.yCursorAnchor } );
			this.currentScreen.currentTextWindow.cMove( { x: this.inputString.length, y: 0 } );
			this.currentScreen.currentTextWindow.print( '', true );
			this.inputText = '?? ';
			this.inputTextNewline = true;
			break;
		}
	}
}

// Specifics -> Mobile devides.
AOZ.prototype.showSoftKeyboard = function( text, defaultText, tags )
{
	text = ( typeof text == 'undefined' ? this.errors.getText( 'please_enter_text' ) : text );
	defaultText = ( typeof defaultText == 'undefined' ? '' : defaultText );
	//if ( this.isMobileDevice )
	{
		var response = window.prompt( text, defaultText );
		if ( response != null )
			return response;
		return '';
	}
	return undefined;
};

AOZ.prototype.input$ = function( args )
{
	this.input$String = '';
	this.input$Length = args[ 0 ];
	if ( this.input$length <= 0 )
		throw { error: 'illegal_function_call', parameter: args[ 0 ] };
	this.key = undefined;
};
AOZ.prototype.input$_wait = function( args )
{
	if ( this.key )
	{
		if ( this.key.length == 1 )
			this.input$String += this.key;
		this.key = undefined;
	}
	if ( this.input$String.length >= this.input$Length )
	{
		return true;
	}
	return false;
};

///////////////////////////////////////////////////////////////////////////////
//
// EVENT HANDLING
//
///////////////////////////////////////////////////////////////////////////////
AOZ.prototype.addExternalEventHandler = function( thisSelf, callback, id, extra, priority )
{
	var found = false;
	for ( var e = 0; e < this.eventHandlers.length; e++ )
	{
		if ( this.eventHandlers[ e ].id == id )
		{
			found = true;
			break;
		}
	}
	if ( !found )
	{
		var info =
		{
			thisSelf: thisSelf,
			callback: callback,
			extra: extra,
			priority: priority,
			id: id
		};
		this.eventHandlers.push( info );
		this.eventHandlers.sort( function( a, b )
		{
			if ( a.priority < b.priority )
				return 1;
			if ( a.priority > b.priority )
				return -1;
			return 0;
		} );
	}
};
AOZ.prototype.removeExternalEventHandler = function( id )
{
	for ( var e = 0; e < this.eventHandlers.length; e++ )
	{
		if ( this.eventHandlers[ e ].id == id )
		{
			this.eventHandlers.splice( e, 1 );
			return;
		}
	}
};
AOZ.prototype.callExternalEvents = function( name, event )
{
	for ( var e = 0; e < this.eventHandlers.length && event; e++ )
	{
		var handler = this.eventHandlers[ e ];
		event = handler.callback.call( handler.thisSelf, name, event, handler.extra );
	}
	return event;
};
AOZ.buttonToMouse =
{
	0: 0x0001,
	1: 0x0004,
	2: 0x0002
};
AOZ.prototype.killEvents = function()
{
	this.renderer.end();
	document.onclick = undefined;
	document.onkeydown = undefined;
	document.onkeyup = undefined;
};
AOZ.prototype.startEvents = function()
{
	var self = this;
	var eventList = 
	{
		'mousemove': function( event ) { self.onMouseMove( event ) },
		'mouseleave': function( event ) { self.onMouseLeave( event ) },
		'mouseenter': function( event ) { self.onMouseEnter( event ) },
		'mousedown': function( event ) { self.onMouseDown( event ) },
		'mouseup': function( event ) { self.onMouseUp( event ) },
		'click': function( event ) { self.onClick( event ) },
		'dblclick': function( event ) { self.onDblClick( event ) },
		'contextmenu': function( event ) { self.onContextMenu( event ) },

		'pointerdown': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointerup': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointermove': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointerover': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointerenter': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointercancel': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointerout': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointerleave': function( event ) { self.callExternalEvents( event.type, event ) },
		'pointercapture': function( event ) { self.callExternalEvents( event.type, event ) },
		'lostpointerCapture': function( event ) { self.callExternalEvents( event.type, event ) },

		'drag': function( event ) { self.callExternalEvents( event.type, event ) },
		'dragend': function( event ) { self.callExternalEvents( event.type, event ) },
		'dragenter': function( event ) { self.callExternalEvents( event.type, event ) },
		'dragleave': function( event ) { self.callExternalEvents( event.type, event ) },
		'dragover': function( event ) { self.callExternalEvents( event.type, event ) },
		'dragstart': function( event ) { self.callExternalEvents( event.type, event ) },
		'drop': function( event ) { self.callExternalEvents( event.type, event ) },
	}
	if( 'ontouchstart' in window )
	{
		eventList[ 'touchstart' ] = function( event ){ self.onTouchStart( event ) };
		eventList[ 'touchmove' ] = function( event ){ self.onTouchMove( event ) };
		eventList[ 'touchend' ] = function( event ){ self.onTouchEnd( event ) };
		eventList[ 'touchcancel' ] = function( event ){ self.onTouchCancel( event ) };
		eventList[ 'touchleave' ] = function( event ){ self.onTouchEnd( event ) };
	}
	this.renderer.init( eventList );

	document.onclick = function( event ) { self.onClickDocument( event ) };

	if ( document.body.addEventListener)
    	document.body.addEventListener( 'wheel', function( event ){ self.onWheel( event ) }, false );

	this.xMouse = 0;
	this.yMouse = 0;
	this.mouseInside = false;
	this.mouseButtons = 0;
	this.clickMouse = 0;
	this.doubleClick = false;
	this.wheelMouse = 0;
	this.mouseCurrent = 'auto';
	this.mouseShown = true;
	this.limitMouse = null;

	this.is_touch = 'ontouchstart' in window;
	this.ongoingTouches = new Array();
	this.touches = new Array();
	this.is_orientable = 'ondeviceorientation' in window;
	this.orientationX = 0;
	this.orientationY = 0;
	this.orientationZ = 0;
	this.is_accelerator = 'ondevicemotion' in window;
	this.accelerationX = 0;
	this.accelerationY = 0;
	this.accelerationZ = 0;
	this.latitude = 0.0;
	this.longitude = 0.0;
	this.already_fs = false;
	this.procName = undefined;

	if( 'ondeviceorientation' in window )
	{
		window.addEventListener( 'deviceorientation', function( event ){ self.onDeviceOrientation( event ) }, false );
	}

	if( 'ondevicemotion' in window )
	{
		window.addEventListener( 'devicemotion', function( event ){ self.onDeviceMotion( event ) }, false );
	}

	if( 'onorientationchange' in window )
	{
		if( window.orientation === 90 || window.orientation === -90 )
		{
			self.orientation = 0;
		}
		else
		{
			self.orientation = 1;
		}

		window.addEventListener("orientationchange", function()
		{
			if( window.orientation === 90 || window.orientation === -90 )
			{
				self.orientation = 0;
			}
			else
			{
				self.orientation = 1;
			}
		}, false);
	}
};

AOZ.prototype.onMouseMove = function( event )
{
	if ( !( event = this.callExternalEvents( 'mousemove', event ) ) )
		return;

	this.xMouseDebug = event.clientX;
	this.yMouseDebug = event.clientY;

	var x, y;
	if ( event.aozInfo ) 
	{
		x = event.aozInfo.x;
	 	y = event.aozInfo.y;
	}
	else
	{ 
		x = event.clientX;
	 	y = event.clientY;
	}
	if ( this.limitMouse )
	{
		if ( x < this.limitMouse.x )
			x = this.limitMouse.x;
		if ( x > this.limitMouse.x + this.limitMouse.width )
			x = this.limitMouse.x + this.limitMouse.width;
		if ( y < this.limitMouse.y )
			y = this.limitMouse.y;
		if ( y > this.limitMouse.y + this.limitMouse.height )
			y = this.limitMouse.y + this.limitMouse.height;
	}
	this.xMouse = x;
	this.yMouse = y;

	if( this.touchEmulation.active && this.touchEmulation.fingerOnScreen )
	{
		var touches = {
			identifier: 'mouse_emulation_0',
			fromDebugger: event.fromDebugger,
			aozInfo: event.aozInfo,
			aozState: 2,
		}

		var result = this.computeTouch( 0, touches );
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 2 );
		this.touchEmulation.lastX = result.x;
		this.touchEmulation.lastY = result.y;
		this.ongoingTouches.splice( touches );
		this.updateTouches();
	}
}
AOZ.prototype.onMouseEnter = function( event )
{
	if ( !( event = this.callExternalEvents( 'mouseenter', event ) ) )
		return;

	this.mouseInside = true;
}
AOZ.prototype.onMouseLeave = function( event )
{
	if ( !( event = this.callExternalEvents( 'mouseleave', event ) ) )
		return;

	this.mouseInside = false;
}
AOZ.prototype.onWheel = function( event )
{
	switch ( event.deltaMode )
	{
		case WheelEvent.DOM_DELTA_PIXEL:
			event.aozDeltaY = event.deltaY / 100;
			break;
		case WheelEvent.DOM_DELTA_LINE:
			event.aozDeltaY = event.deltaY;
			break;
		case WheelEvent.DOM_DELTA_PAGE:
			event.aozDeltaY = event.deltaY * 25;
			break;
	}
	if ( !( event = this.callExternalEvents( 'wheel', event ) ) )
		return;

	this.wheelMouse = event.aozDeltaY;
}
AOZ.prototype.onMouseWheel = function( event )
{
	if ( !( event = this.callExternalEvents( 'mousewheel', event ) ) )
		return;

	this.wheelMouse = Math.max( -1, Math.min( 1, ( event.wheelDelta || -event.detail ) ) );
}
AOZ.prototype.onMouseDown = function( event )
{
	if ( !( event = this.callExternalEvents( 'mousedown', event ) ) )
		return;

	this.mouseButtons |= AOZ.buttonToMouse[ event.button ];
	this.clickMouse = this.mouseButtons;

	if( this.touchEmulation.active )
	{

		var touches = {
			identifier: 'mouse_emulation_0',
			fromDebugger: event.fromDebugger,
			aozInfo: event.aozInfo,
			aozState: 1,
		}

		var result = this.computeTouch( 0, touches );
		this.touchEmulation.fingerOnScreen = true;
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 1 );
		this.touchEmulation.lastX = -1;
		this.touchEmulation.lastY = -1;
		this.ongoingTouches.push( touches );
		this.updateTouches();
	}
}
AOZ.prototype.onMouseUp = function( event )
{
	if ( !( event = this.callExternalEvents( 'mouseup', event ) ) )
		return;

	this.mouseButtons &= ~AOZ.buttonToMouse[ event.button ];
	this.clickMouse = this.mouseButtons;
	if( this.touchEmulation.active )
	{

		var touches = {
			identifier: 'mouse_emulation_0',
			aozInfo: event.aozInfo,
			aozState: 3,
		}

		this.touchEmulation.fingerOnScreen = false;
		var result = this.computeTouch( 0, touches );
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 3 );
		this.touchEmulation.lastX = result.x;
		this.touchEmulation.lastY = result.y;
		this.ongoingTouches.splice( touches );
		this.updateTouches();
	}
}
AOZ.prototype.onClick = function( event )
{
	if ( !( event = this.callExternalEvents( 'click', event ) ) )
		return;

	this.welcomeClick = true;
}
AOZ.prototype.onClickDocument = function( event )
{
	this.welcomeClick = true;
	if ( this.renderingContext.isInFullScreenIcon( { x: this.xMouseDebug, y: this.yMouseDebug } ) )
	{
		this.renderingContext.swapFullScreen();
	}
}
AOZ.prototype.onDblClick = function( event )
{
	if ( !( event = this.callExternalEvents( 'dblclick', event ) ) )
		return;

	this.doubleClick = true;
}
AOZ.prototype.onContextMenu = function( event )
{
	if ( !( event = this.callExternalEvents( 'contextmenu', event ) ) )
		return;

	if (event.preventDefault != undefined )
		event.preventDefault();
	if( event.stopPropagation != undefined )
		event.stopPropagation();
}

AOZ.prototype.onTouchStart = function( event )
{
	if ( !( event = this.callExternalEvents( 'touchstart', event ) ) )
		return;

	event.preventDefault();

	this.welcomeClick = true;
	var touches = event.changedTouches;
	if( this.touches == undefined )
	{
		this.touches = new Array();
	}

	this.mouseButtons = 1;
	this.clickMouse = 1;

	for( var i = 0; i < touches.length; i++ )
	{
		touches[ i ].aozState = 1;
		var result = this.computeTouch( i, touches[ i ] );
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 1 );
		this.ongoingTouches.push( touches[ i ] );
	}
	this.updateTouches();
}

AOZ.prototype.onTouchMove = function( event )
{
	if ( !( event = this.callExternalEvents( 'touchmove', event ) ) )
		return;

	event.preventDefault();

	var touches = event.changedTouches;
	this.mouseButtons = 1;
	this.clickMouse = 1;

	for( var i = 0; i < touches.length; i++ )
	{
		touches[ i ].aozState = 2;
		var result = this.computeTouch( i, touches[ i ] );

		var idx = this.getTouchById( touches[ i ].identifier );
		var result = this.computeTouch( i, touches[ i ] );
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 2 );
		this.ongoingTouches.splice( idx, 1, touches[ i ] );
	}
	this.updateTouches();
}

AOZ.prototype.onTouchEnd = function( event )
{
	if ( !( event = this.callExternalEvents( 'touchend', event ) ) )
		return;

	event.preventDefault();

	var touches = event.changedTouches;
	this.touches = new Array();

	this.removeTouches = new Array();

	this.mouseButtons = 0;
	this.clickMouse = 0;

	for( var i = 0; i < touches.length; i++ )
	{
		touches[ i ].aozState = 3;
		var idx = this.getTouchById( touches[ i ].identifier );
		var result = this.computeTouch( i, touches[ i ] );
		this.execTouchOnChange( result.x, result.y, result.lastX, result.lastY, 3 );
		this.ongoingTouches.splice( idx, 1 );
	}
	this.updateTouches();
}

AOZ.prototype.onTouchCancel = function( event )
{
	if ( !( event = this.callExternalEvents( 'touchcancel', event ) ) )
		return;

	event.preventDefault();
	var touches = event.changedTouches;

	for( var i = 0; i < touches.length; i++ )
	{
		this.ongoingTouches.splice( i, 1 );
	}
	this.updateTouches();
}
AOZ.prototype.onDeviceOrientation = function( event )
{
	if ( !( event = this.callExternalEvents( 'deviceorientation', event ) ) )
		return;

	event.preventDefault();
	var degreeToAoz = this.degreeRadian == 1 ? Math.PI / 180 : 1;
	this.orientationX = event.beta * degreeToAoz;
	this.orientationY = event.gamma * degreeToAoz;
	this.orientationZ = event.alpha * degreeToAoz;

}

AOZ.prototype.onDeviceMotion = function( event )
{
	if ( !( event = this.callExternalEvents( 'devicemotion', event ) ) )
		return;

	event.preventDefault();

	self.accelerationX = event.accelerationIncludingGravity.x;
	self.accelerationY = event.accelerationIncludingGravity.y;
	self.accelerationZ = event.accelerationIncludingGravity.z;

}

AOZ.prototype.getTouchById = function( idToFind )
{

	for( var i = 0; i < this.ongoingTouches.length; i++ )
	{
		var id = this.ongoingTouches[ i ].identifier;

		if( id == idToFind )
		{
			return i;
		}
	}
	return -1;
}

AOZ.prototype.updateTouches = function()
{
	this.touches = new Array();

	for( i = 0; i < this.ongoingTouches.length; i++ )
	{
		var result = this.computeTouch( i, this.ongoingTouches[ i ] );
		this.touches.push( { x: result.x, y: result.y, state: this.ongoingTouches[ i ].aozState } );

		if( i == 0 )
		{
			//this.xMouseDebug = this.touches[ i ].aozInfo.x;
			//this.yMouseDebug = this.touches[ i ].aozInfo.y;
			this.xMouse = result.x;
			this.yMouse = result.y;
		}
	}
};

AOZ.prototype.computeTouch = function( i, touch )
{
	var x, y;
	if ( touch.aozInfo ) 
	{
		x = touch.aozInfo.x;
	 	y = touch.aozInfo.y;
	}
	else
	{ 
		x = touch.clientX;
	 	y = touch.clientY;
	}
	if ( this.limitMouse )
	{
		if ( x < this.limitMouse.x )
			x = this.limitMouse.x;
		if ( x > this.limitMouse.x + this.limitMouse.width )
			x = this.limitMouse.x + this.limitMouse.width;
		if ( y < this.limitMouse.y )
			y = this.limitMouse.y;
		if ( y > this.limitMouse.y + this.limitMouse.height )
			y = this.limitMouse.y + this.limitMouse.height;
	}

	var ni = i;
	if( this.ongoingTouches )
	{
		for( ii = 0; ii < this.ongoingTouches.length; ii++ )
		{
			if( this.ongoingTouches[ ii ].identifier == touch.identifier )
			{
				ni = ii;
				break;
			}
		}
	}

	var lastX = x;
	var lastY = y;
	if ( this.ongoingTouches[ ni ] )
	{
		var touch = this.ongoingTouches[ ni ];
		lastX = touch.aozInfo.x;
		lastY = touch.aozInfo.y;
		if ( this.limitMouse )
		{
			if ( lastX < this.limitMouse.x )
				lastX = this.limitMouse.x;
			if ( lastX > this.limitMouse.x + this.limitMouse.width )
				lastX = this.limitMouse.x + this.limitMouse.width;
			if ( lastY < this.limitMouse.y )
				lastY = this.limitMouse.y;
			if ( lastY > this.limitMouse.y + this.limitMouse.height )
				lastY = this.limitMouse.y + this.limitMouse.height;
		}
	}

	if( this.touchEmulation.active )
	{
		if( this.touchEmulation.lastX == - 1 )
		{
			this.touchEmulation.lastX = x;
		}

		if( this.touchEmulation.lastY == - 1 )
		{
			this.touchEmulation.lastY = y;
		}

		lastX = this.touchEmulation.lastX;
		lastY = this.touchEmulation.lastY;
	}
	return { x: x, y: y, lastX: lastX, lastY: lastY };
};

AOZ.prototype.touchOnChange = function( procName )
{
	this.procName = procName;
};

AOZ.prototype.execTouchOnChange = function( x, y, lastX, lastY, state )
{
	if( this.procName == undefined || this.procName == '' )
	{
		return;
	}
	var args =
	{
		X: Number( x ).toFixed( 3 ),
		Y: Number( y ).toFixed( 3 ),
		LASTX: Number( lastX ).toFixed( 3 ),
		LASTY: Number( lastY ).toFixed( 3 ),
		STATE: state
	};
	this.runProcedure( this.procName, args );
};

AOZ.prototype.geoLocation = function()
{
	var self = this;
	navigator.geolocation.getCurrentPosition( function( position )
	{
		self.latitude = position.coords.latitude;
		self.longitude = position.coords.longitude;
	});
};

AOZ.prototype.getTouchX = function( index )
{
	if( this.touches[ index ] == undefined )
	{
		return -1;
	}
	return this.touches[ index ].x;
};

AOZ.prototype.getTouchY = function( index )
{
	if( this.touches[ index ] == undefined )
	{
		return -1;
	}
	return this.touches[ index ].y;
};

AOZ.prototype.getTouchState = function( index )
{
	if( this.touches[ index ] == undefined )
	{
		return -1;
	}
	return this.touches[ index ].state;
};

AOZ.prototype.setMouseLimits = function( rectangle )
{
	this.limitMouse = rectangle;
};
AOZ.prototype.xor = function( a, b )
{
	return ( a && !b ) || ( !a && b );
};
AOZ.prototype.mouseScreen = function()
{
	return this.screenIn( undefined, { x: this.getXMouse(), y: this.getYMouse() } );
};
AOZ.prototype.mouseWheel = function()
{
	var temp = this.wheelMouse;
	this.wheelMouse = 0;
	return temp;
};
AOZ.prototype.showMouse = function( flag, count )
{
	if ( count )
	{
		if ( flag )
			this.mouseVisibleCount++;
		else
			this.mouseVisibleCount--;
		flag = ( this.mouseVisibleCount > 0 )
	}
	if ( flag != this.mouseShown )
	{
		this.mouseShown = flag;
		if ( !flag )
			this.renderer.setCursorStyle( 'none' );
		else
			this.renderer.setCursorStyle( this.mouseCurrent );
	}
};
AOZ.prototype.mouseClick = function()
{
	var click = this.clickMouse;
	this.clickMouse = 0;
	return click;
};
AOZ.prototype.changeMouse = function( type )
{
	var pMouse = '';
	switch ( type )
	{
		case 1:
			pMouse = 'auto';
			break;
		case 2:
			pMouse = 'crosshair';
			break;
		case 3:
			pMouse = 'wait';
			break;
	}

	if ( this.mouseShown )
	{
		if( pMouse != '' )
		{
			this.mouseCurrent = pMouse;
		}

		if( type && type != null && type != '' )
		{
			var list = Banks.ListBanks();
			var url = 'resources/assets/mouse/' + type + '.png';
			this.mouseCurrent = 'url(\'' + url + '\') 0 0, auto';
		}
		
		document.body.setAttribute( 'style', 'cursor:' + this.mouseCurrent );;
	}
};
AOZ.prototype.xHard = function( x, screen )
{
	screen = this.getScreen( screen );
	return x * screen.renderScaleX + screen.x;
};
AOZ.prototype.yHard = function( y, screen )
{
	screen = this.getScreen( screen );
	return y * screen.renderScaleY + screen.y;
};
AOZ.prototype.xScreen = function( x, screen )
{
	screen = this.getScreen( screen );
	return x - screen.vars.x / screen.renderScale.x / screen.vars.scaleX + screen.vars.offsetX;
};
AOZ.prototype.yScreen = function( y, screen )
{
	screen = this.getScreen( screen );
	return y - screen.vars.y / screen.renderScale.y / screen.vars.scaleY + screen.vars.offsetY;
};
AOZ.prototype.isIn = function( x, y )
{
	x = ( x - screen.x ) / screen.renderScaleX;
	y = ( y - screen.y ) / screen.renderScaleY;
	this.currentScreen.isIn( x, y );
};
AOZ.prototype.hZone = function( number, x, y )
{
	var screen = this.getScreen( number );
	x = ( x - screen.x ) / screen.renderScaleX;
	y = ( y - screen.y ) / screen.renderScaleY;
	return screen.zone( number, x, y );
};
AOZ.prototype.mouseZone = function()
{
	return this.hZone( undefined, this.xMouse, this.yMouse );
};
AOZ.prototype.setXMouse = function( x )
{
	this.xMouse = x;
};
AOZ.prototype.setYMouse = function( y )
{
	this.yMouse = y;
};
AOZ.prototype.getXMouse = function( x )
{
	return isNaN( this.xMouse ) ? 0 : this.xMouse;
};
AOZ.prototype.getYMouse = function( y )
{
	return isNaN( this.yMouse ) ? 0 : this.yMouse;
};
AOZ.prototype.waitClick = function()
{
	this.clickMouse = 0;
};
AOZ.prototype.waitClick_wait = function()
{
	if ( this.clickMouse )
	{
		if ( this.clickMouse != 0 )
		{
			this.clickMouse = 0;
			return true;
		}
	}
	return false;
};

AOZ.prototype.waitInput = function()
{
	this.clickMouse = 0;
	this.key = 0;
};

AOZ.prototype.waitInput_wait = function()
{
	if ( this.clickMouse || this.key )
	{
		if ( this.clickMouse != 0 || this.key != '' || this.fire( 0 ) )
		{
			this.clickMouse = 0;
			this.key = 0;
			return true;
		}
	}
	return false;
};

// Data/read
AOZ.prototype.read = function( section, type )
{
	if ( section.dataPosition >= section.datas.length )
		throw( 'out_of_data' );

	var value = section.datas[ section.dataPosition++ ];
	if ( typeof value == 'function' )
		value = value.call( section, this, section.vars );
	if ( type == 0 || type == 1 )
	{
		if ( typeof value == 'string' )
			throw( 'type_mismatch' );
	}
	else
	{
		if ( typeof value != 'string' )
			throw( 'type_mismatch' );
	}
	return value;
};
AOZ.prototype.add = function( section, variable, plus, start, end )
{
	var number = this.getVariableFromDescription( section, variable );
	if ( variable.type == '0' )
	{
		if ( plus < 0 )
			plus = Math.ceil( plus )
		else
			plus = Math.floor( plus );
	}
	number += plus;
	if ( typeof start != 'undefined' && typeof end != 'undefined' )
	{
		if ( number > end )
			number = start;
		if ( number < start )
			number = end;
	}
	this.setVariableFromDescription( section, variable, number );
};
AOZ.prototype.getVariableFromDescription = function( section, variable )
{
	var result;
	if ( variable.dimensions )
	{
		if ( !variable.root )
			result = section.vars[ variable.name ].getValue( variable.dimensions );
		else
			result = this.root.vars[ variable.name ].getValue( variable.dimensions );
	}
	else
	{
		if ( !variable.root )
			result = section.vars[ variable.name ];
		else
			result = this.root.vars[ variable.name ];
	}
	return result;
};
AOZ.prototype.setVariableFromDescription = function( section, variable, value )
{
	if ( variable.dimensions )
	{
		if ( !variable.root )
			section.vars[ variable.name ].setValue( variable.dimensions, value );
		else
			this.root.vars[ variable.name ].setValue( variable.dimensions, value );
	}
	else
	{
		if ( !variable.root )
			section.vars[ variable.name ] = value;
		else
			this.root.vars[ variable.name ] = value;
	}
};


// AOZ Array class
function AArray( aoz, defaultValue, oneBased )
{
	this.aoz = aoz;
	this.defaultValue = defaultValue;
	this.oneBased = oneBased;
};
AArray.prototype.dim = function( dimensions )
{
	if ( typeof this.array != 'undefined' )
	{
		this.aoz.error = 10;
		return;
	}
	var self = this;
	this.dimensions = dimensions;
	this.array = createArray( 0 );
	function createArray( d )
	{
		var arr = [];
		if ( d == dimensions.length - 1 )
		{
			for ( var dd = 0; dd <= dimensions[ d ]; dd++ )
				arr[ dd ] = self.defaultValue;
		}
		else
		{
			for ( var dd = 0; dd <= dimensions[ d ]; dd++ )
				arr[ dd ] = createArray( d + 1 );
		}
		return arr;
	}
}
AArray.prototype.getValue = function( dimensions )
{
	var obj = this.getVariable( dimensions );
	return obj.array[ obj.pointer ];
};
AArray.prototype.setValue = function( dimensions, value )
{
	var obj = this.getVariable( dimensions );
	obj.array[ obj.pointer ] = value;
};
AArray.prototype.sort = function( dimensions )
{
	var obj = this.getVariable( dimensions );
	if ( typeof this.defaultValue == 'string' )
		obj.array = obj.array.sort();
	else
	{
		obj.array = obj.array.sort( function( a, b )
		{
			return a - b;
		} );
	}
};
AArray.prototype.match = function( dimensions, value )
{
	if ( dimensions.length > 1 )
		throw { error: 'illegal_function_call', parameter: '(too many dimensions: ' + dimensions.length + ')' };
	var arr = this.getVariable( dimensions ).array;
	for ( var d = 0; d < arr.length; d++ )
	{
		if ( arr[ d ] == value )
		{
			return d;
		}
	}
	return -1;
};
AArray.prototype.inc = function( dimensions )
{
	var obj = this.getVariable( dimensions );
	obj.array[ obj.pointer ]++;
};
AArray.prototype.dec = function( dimensions )
{
	var obj = this.getVariable( dimensions );
	obj.array[ obj.pointer ]--;
};
AArray.prototype.read = function( dimensions, value )
{
	var obj = this.getVariable( dimensions );
	obj.array[ obj.pointer ]--;
};
AArray.prototype.getLength = function( dimension )
{
	dimension = typeof dimension == 'undefined' ? 0 : dimension;
	if ( typeof this.array == 'undefined' )
		throw 'non_dimensionned_array';
	if ( dimension >= this.dimensions.length )
		throw { error: 'illegal_function_call', parameter: dimension };
	return this.dimensions[ dimension ];
};
AArray.prototype.getVariable = function( dimensions )
{
	if ( typeof this.array == 'undefined' )
		throw 'non_dimensionned_array';
	var pArr = this.array;
	for ( var d = 0; d < this.dimensions.length - 1; d++ )
	{
		dd = dimensions[ d ] - this.oneBased;
		if ( dd < 0 || dd > this.dimensions[ d ] )
			throw { error: 'array_index_out_of_bounds', parameters: [ d + 1, dd, this.dimensions[ d ] ] };
		pArr = pArr[ dd ];
	}
	var dd = dimensions[ d ] - this.oneBased;
	if ( dd < 0 || dd > this.dimensions[ d ] )
	{
		throw { error: 'array_index_out_of_bounds', parameters: [ d + 1, dd, this.dimensions[ d ] ] };
	}
	return { array: pArr, pointer: dd };
};

// Format string using
AOZ.prototype.formatUsing = function( format, variables )
{
	var result = '';
	var variableNumber = 0;
	var formats = [];
	for ( var f = 0; f < variables.length; f++ )
		formats[ f ] = {};

	for ( var p = 0; p < format.length; p++ )
	{
		var variable = variables[ variableNumber ];
		var c = format.charAt( p );
		switch ( c )
		{
			case '~':
				if ( formats[ variableNumber ].type == 'number' )
					variableNumber++;
				if ( variableNumber < variables.length )
				{
					if ( !formats[ variableNumber ].type )
					{
						formats[ variableNumber ].variable = variables[ variableNumber ];
						formats[ variableNumber ].type = 'string';
						formats[ variableNumber ].position = p;
						formats[ variableNumber ].length = 1;
					}
					else
					{
						formats[ variableNumber ].length++;
					}
				}
				result += ' ';
				break;
			case '+':
			case '-':
			case '–':
			case '.':
			case ';':
			case '#':
			case '^':
				if ( formats[ variableNumber ].type == 'string' )
					variableNumber++;
				if ( variableNumber < variables.length )
				{
					if ( !formats[ variableNumber ].type )
					{
						formats[ variableNumber ].variable = variables[ variableNumber ];
						formats[ variableNumber ].type = 'number';
						formats[ variableNumber ].integers = [];
						formats[ variableNumber ].decimals = [];
						formats[ variableNumber ].exponentials = [];
						formats[ variableNumber ].integerCount = 0;
						formats[ variableNumber ].decimalCount = 0;
						formats[ variableNumber ].exponentialCount = 0;
						formats[ variableNumber ].dot = '';
						formats[ variableNumber ].sign = '';
					}
					switch ( c )
					{
						case '+':
							if ( formats[ variableNumber ].sign == '' )
							{
							formats[ variableNumber ].sign = 'plus';
							formats[ variableNumber ].signPosition = p;
							}
							break;
						case '-':
						case '–':
							if ( formats[ variableNumber ].sign == '' )
							{
							formats[ variableNumber ].sign = 'minus';
							formats[ variableNumber ].signPosition = p;
							}
							break;
						case '.':
							if ( formats[ variableNumber ].dot == '' )
							{
							formats[ variableNumber ].dotPosition = p;
							formats[ variableNumber ].dot = 'dot';
							}
							break;
						case ';':
							if ( formats[ variableNumber ].dot == '' )
							{
							formats[ variableNumber ].dotPosition = p;
							formats[ variableNumber ].dot = 'semiColumn';
							}
							break;
						case '^':
							formats[ variableNumber ].exponentials[ formats[ variableNumber ].exponentialCount++ ] = p;
							break;
						case '#':
							if ( formats[ variableNumber ].dot == '' )
								formats[ variableNumber ].integers[ formats[ variableNumber ].integerCount++ ] = p;
							else
								formats[ variableNumber ].decimals[ formats[ variableNumber ].decimalCount++ ] = p;
							break;
					}
				}
				result += ' ';
				break;
			default:
				result += c;
				break;
		}
	}

	var lastFormat = 0;
	for ( var v = 0; v < formats.length; v++ )
	{
		if ( formats[ v ].type == 'string' )
		{
			lastFormat = v;
			var variable = formats[ v ].variable;
			if ( typeof variable != 'string' )
				variable = this.aoz.str$( variable );
			result = this.utilities.pokeString( result, variable, formats[ v ].position, formats[ v ].length );
		}
		else if ( formats[ v ].type == 'number' )
		{
			if ( typeof variable == 'string' )
				throw 'type_mismatch';
			lastFormat = v;
			var exponential;
			if ( formats[ v ].exponentialCount == 0 )
				variable = formats[ v ].variable.toFixed( formats[ v ].decimalCount );
			else
			{
				variable = formats[ v ].variable.toExponential( formats[ v ].decimalCount );
				exponential = variable.substring( variable.indexOf( 'e' ) );
				variable = variable.substring( 0, variable.indexOf( 'e' ) );
			}

			var start = variable >= 0 ? 0 : 1;
			if ( formats[ v ].sign == 'plus' )
			{
				if ( formats[ v ].variable >= 0 )
					result = this.utilities.pokeString( result, '+', formats[ v ].signPosition, 1 );
				else
					result = this.utilities.pokeString( result, '-', formats[ v ].signPosition, 1 );
			}
			else if ( formats[ v ].sign == 'minus' )
			{
				if ( formats[ v ].variable < 0 )
					result = this.utilities.pokeString( result, '-', formats[ v ].signPosition, 1 );
			}
			if ( formats[ v ].integerCount > 0 )
			{
				var pos = variable.indexOf( '.' );
				if ( pos < 0 )
					pos = variable.length;
				for ( d = formats[ v ].integerCount - 1, pos--; d >= 0; d--, pos-- )
				{
					if ( pos >= start )
						result = this.utilities.pokeString( result, variable.substr( pos, 1 ), formats[ v ].integers[ d ], 1 );
				}
			}
			if ( formats[ v ].dot == 'dot' )
			{
				result = this.utilities.pokeString( result, '.', formats[ v ].dotPosition, 1 );
			}
			if ( formats[ v ].decimalCount > 0 )
			{
				var pos = variable.indexOf( '.' );
				if ( pos < 0 )
					pos = variable.length;
				for ( d = 0, pos++; d < formats[ v ].decimalCount; d++, pos++ )
				{
					if ( pos < variable.length )
						result = this.utilities.pokeString( result, variable.substr( pos, 1 ), formats[ v ].decimals[ d ], 1 );
				}
			}
			if ( formats[ v ].exponentialCount > 0 )
			{
				for ( d = 0; d < formats[ v ].exponentialCount; d++ )
				{
					if ( d < exponential.length )
						result = this.utilities.pokeString( result, exponential.substr( d, 1 ), formats[ v ].exponentials[ d ], 1 );
				}
			}
		}
	}
	for ( v = lastFormat + 1; v < variables.length; v++ )
	{
		result += variables[ v ];
	}
	return result;
};

// Instruction set
AOZ.prototype.setStringBaseIndex = function( number )
{
	if ( typeof number == 'undefined' )
		throw 'illegal_function_call';
	if ( number < 0 || number > 1 )
		throw { error: 'illegal_function_call', parameter: number };
	this.stringBaseIndex = number ? 1 : 0;
};
AOZ.prototype.instr = function( text, search, position )
{
	if ( position < 0 )
		throw { error: 'illegal_function_call', parameter: position };
	if ( typeof position == 'undefined' )
		position = this.stringBaseIndex;

	position = Math.max( position - this.stringBaseIndex, 0 );
	var result = text.indexOf( search, position );
	if ( result >= 0 )
		return result + this.stringBaseIndex;
	return this.stringBaseIndex - 1;
};
AOZ.prototype.string$ = function( text, number )
{
	if ( number < 0 )
		throw { error: 'illegal_function_call', parameter: number };
	var result = '';
	var chr = text.charAt( 0 );
	for ( var c = 0; c < number; c++ )
		result += chr;
	return result;
};
AOZ.prototype.trim$ = function( text, position )
{
	position = ( typeof position == 'undefined' ? 0 : position );
	if ( position < 0 || position > 2 )
		throw { error: 'illegal_function_call', parameter: position };

	var start = ( position == 0 || position == 1 );
	var end = ( position == 0 || position == 2 );
	if ( start )
	{
		while( text.length > 0 && text.charAt( 0 ) == ' ' )
			text = text.substring( 1 );
	}
	if ( end )
	{
		while( text.length > 0 && text.charAt( text.length - 1 ) == ' ' )
			text = text.substring( 0, text.length - 1 );
	}
	return text;
};
AOZ.prototype.flip$ = function( text )
{
	var result = '';
	for ( var c = text.length -1; c >= 0; c-- )
		result += text.charAt( c );
	return result;
};
AOZ.prototype.getLeft$ = function( text, position )
{
	if ( position < 0 )
		throw { error: 'illegal_function_call', parameter: position };
	if ( typeof position == 'undefined' )
		position = 0;
	return text.substring( 0, position );
};
AOZ.prototype.setLeft$ = function( text, variable, position )
{
	this.setMid$( text, variable, 0, position );
};
AOZ.prototype.getMid$ = function( text, start, len )
{
	if ( start < 0 )
		throw { error: 'illegal_function_call', parameter: start };
	start = Math.max( start - this.stringBaseIndex, 0 );
	if ( typeof len == 'undefined' )
		return text.substr( start );

	if ( len < 0 )
		throw { error: 'illegal_function_call', parameter: len };
	if ( start + len > text.length )
		len = text.length - start;
	return text.substr( start, len );
};
AOZ.prototype.setMid$ = function( text, variable, start, len )
{
	if ( start < 0 )
		throw { error: 'illegal_function_call', parameter: start };

	start = Math.max( start - this.stringBaseIndex, 0 );
	var value = this.getVariable( variable );
	if ( start > value.length )
		start = value.length;

	if ( typeof len == 'undefined' )
		len = value.length - start;  // changed text.length to value.length
	else if ( len < 0 )
		throw { error: 'illegal_function_call', parameter: len };

	var lReplace = Math.min( text.length, len );
	if ( start + lReplace > value.length )
		lReplace = value.length - start;
	value = value.substring( 0, start ) + text.substr( 0, len ) + value.substring( start + lReplace );
	this.setVariable( variable, value );
};
AOZ.prototype.getRight$ = function( text, start )
{
	if ( start < 0 )
		throw { error: 'illegal_function_call', parameter: start };
	if ( start > text.length )
		start = text.length;
	return text.substring( text.length - start );
};
AOZ.prototype.setRight$ = function( text, variable, len )
{
	var value = this.getVariable( variable );
	if ( typeof len == 'undefined' )
		len = value.length;
	if ( len < 0 )
		throw { error: 'illegal_function_call', parameter: len };
	len = Math.min( len, value.length );

	var start = Math.max( 0, value.length - len );
	value = value.substring( 0, start ) + text.substr( 0, len ) + value.substring( start + len );
	this.setVariable( variable, value );
};
AOZ.prototype.subtractString = function( string1, string2 )
{
	return this.utilities.replaceStringInText( string1, string2, '' );
};
AOZ.prototype.wait = function( args, section )
{
	var delay = args[ 0 ];
	if ( delay < 0 )
		throw { error: 'illegal_function_call', parameter: delay };
	section.waitEnd = new Date().getTime() + ( this.platform != 'aoz' ? delay * 20 : delay * 1000 );
};
AOZ.prototype.wait_wait = function( section )
{
	var now = new Date().getTime();
	return ( now >= section.waitEnd );
};
AOZ.prototype.bin$ = function( value, digits )
{
	var result = value.toString( 2 );
	if ( typeof value != 'undefined' )
	{
		if ( value < 0 )
			throw { error: 'illegal_function_call', parameter: value };
		for ( var l = result.length; l < digits; l++ )
			result = '0' + result;
	}
	return '%' + result;
};
AOZ.prototype.hex$ = function( value, digits )
{
	var result = '0';
	if ( typeof value != 'undefined' )
	{
		if ( value < 0 )
			value = 0xFFFFFFFF + value + 1;
		result = value.toString( 16 ).toUpperCase();
		for ( var l = result.length; l < digits; l++ )
			result = '0' + result;
	}
	return '$' + result;
};
AOZ.prototype.setTimer = function( time )
{
	if ( time < 0 )
		throw { error: 'illegal_function_call', parameter: time };
	this.timer = time;
};
AOZ.prototype.getTimer = function()
{
	return this.platform == 'aoz' ?  this.timer : Math.floor( this.timer );
};

// Mersene Twister random generator
AOZ.prototype.rnd = function( value, floor, include )
{
	if ( value == 0 && !floor )
		return this.lastRnd;
	var includeCeiling = this.platform == 'amiga' || include ? 1 : 0;
	if (typeof floor != 'undefined' )
		var range = value - floor;
	else
	{
		var range = value;
		floor = 0;
	}
	if ( typeof value != 'undefined' )
	{
		if ( this.merseneTwister )
		{
			if ( Math.floor( value ) == value && Math.floor( floor ) == floor )
				var number = this.merseneTwister.genrand_res53() * ( range + includeCeiling ) + floor;
			else
			{
				var number = this.merseneTwister.genrand_res53() * ( range ) + floor;
				this.lastRnd = number;
				return number;
			}
			this.lastRnd = Math.floor( number );
			return Math.floor( number );
		}
		if ( Math.floor( value ) == value && Math.floor( floor ) == floor )
		{
			var number = Math.floor( Math.random() * ( range + includeCeiling ) + floor );
			this.lastRnd = number;
			return number;
		}
		else
		{
			var number = Math.random() * range + floor;
			this.lastRnd = number;
			return number;
		}
	}
	var number = Math.random();
	this.lastRnd = number;
	return number;
};
AOZ.prototype.randomize = function( initial )
{
	this.merseneTwister = new MersenneTwister( initial );
}

function MersenneTwister( seed )
{
	if ( seed == undefined )
	{
	  	seed = new Date().getTime();
	}
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df;
	this.UPPER_MASK = 0x80000000;
	this.LOWER_MASK = 0x7fffffff;

	this.mt = new Array(this.N);
	this.mti=this.N+1;

	this.init_genrand(seed);
}

MersenneTwister.prototype.init_genrand = function( s )
{
	this.mt[ 0 ] = s >>> 0;
	for ( this.mti=1; this.mti < this.N; this.mti++ )
	{
		var s = this.mt[ this.mti -1 ] ^ ( this.mt[ this.mti -1 ] >>> 30 );
		this.mt[ this.mti ] = ( ( ( ( ( s & 0xffff0000 ) >>> 16 ) * 1812433253 ) << 16 ) + ( s & 0x0000ffff ) * 1812433253 ) + this.mti;
		this.mt[ this.mti ] >>>= 0;
	}
}
MersenneTwister.prototype.genrand_int32 = function()
{
	var y;
	var mag01 = new Array( 0x0, this.MATRIX_A );

	if ( this.mti >= this.N )
	{
	  	var kk;

	  	if ( this.mti == this.N+1 )
			this.init_genrand( 5489 );

		for ( kk=0; kk< this.N - this.M; kk++ )
		{
			y = ( this.mt[ kk ] & this.UPPER_MASK ) | ( this.mt[ kk + 1 ] & this.LOWER_MASK );
			this.mt[ kk ] = this.mt[ kk + this.M ] ^ ( y >>> 1 ) ^ mag01[ y & 0x1 ];
	  	}
		for ( ; kk < this.N - 1; kk++ )
		{
			y = ( this.mt[ kk ] & this.UPPER_MASK ) | ( this.mt[ kk + 1 ] & this.LOWER_MASK );
			this.mt[ kk ] = this.mt[ kk + ( this.M - this.N ) ] ^ ( y >>> 1 ) ^ mag01[ y & 0x1 ];
	  	}
	  	y = ( this.mt[ this.N - 1] & this.UPPER_MASK ) | ( this.mt[ 0 ] & this.LOWER_MASK );
	  	this.mt[ this.N - 1 ] = this.mt[ this.M - 1 ] ^ ( y >>> 1 ) ^ mag01[ y & 0x1 ];
  		this.mti = 0;
	}

	y = this.mt[ this.mti++ ];

	y ^= ( y >>> 11 );
	y ^= ( y << 7 ) & 0x9d2c5680;
	y ^= ( y << 15 ) & 0xefc60000;
	y ^= ( y >>> 18 );

	return y >>> 0;
}

MersenneTwister.prototype.genrand_real1 = function()
{
	return this.genrand_int32()*(1.0/4294967295.0);
}
MersenneTwister.prototype.genrand_res53 = function()
{
	var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
	return( a * 67108864.0 + b ) * ( 1.0 / 9007199254740992.0 );
}

//
// MEMORY BANKS
//
AOZ.prototype.allocMemoryBlock = function( data, endian )
{
	var memoryBlock = new MemoryBlock( this, data, endian );
	memoryBlock.memoryHash = this.memoryNumbers++;
	if ( this.memoryNumber > 9000 )
		this.memoryNumber = 1;
	this.memoryBlocks.push( memoryBlock );
	return memoryBlock;
};
AOZ.prototype.freeMemoryBlock = function( block )
{
	for ( var b = 0; b < this.memoryBlocks.length; b++ )
	{
		if ( this.memoryBlocks[ b ] == block )
		{
			this.memoryBlocks = this.utilities.slice( this.memoryBlocks, b, 1 );
			break;
		}
	}
};
AOZ.prototype.getMemoryBlockFromAddress = function( address )
{
	var index = Math.floor( address / this.memoryHashMultiplier );
	for ( var b = 0; b < this.memoryBlocks.length; b++ )
	{
		if ( this.memoryBlocks[ b ].memoryHash == index )
		{
			return this.memoryBlocks[ b ];
		}
	}
	throw { error: 'illegal_function_call', parameter: address };
};
AOZ.prototype.getMemory = function( number )
{
	var result;
	var index = Math.floor( number / this.memoryHashMultiplier );
	if ( index == 0 )
	{
		var bank = this.banks.getBank( number );
		if ( !bank.isType( [ 'picpac', 'amal', 'work', 'tracker', 'data' ] ) )
			throw 'bank_type_mismatch';
		result =
		{
			bank: bank,
			block: bank.getElement( 1 ),
			start: this.banks.getStart( number ),
			length: this.banks.getLength( number )
		};
	}
	else
	{
		var block = this.getMemoryBlockFromAddress( number );
		result =
		{
			block: block,
			start: number,
			length: block.length
		}
	}
	return result;
};
AOZ.prototype.poke = function( address, value )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	memoryBlock.poke( address, value );
};
AOZ.prototype.doke = function( address, value )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	memoryBlock.doke( address, value );
};
AOZ.prototype.loke = function( address, value )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	memoryBlock.loke( address, value );
};
AOZ.prototype.peek = function( address )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	return memoryBlock.peek( address, false );
};
AOZ.prototype.deek = function( address )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	return memoryBlock.deek( address, false );
};
AOZ.prototype.leek = function( address )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	return memoryBlock.leek( address, false );
};
AOZ.prototype.poke$ = function( address, text )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	memoryBlock.poke$( address, text );
};
AOZ.prototype.doke$ = function( address, text )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	memoryBlock.doke$( address, text );
};
AOZ.prototype.peek$ = function( address, length, stop )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	return memoryBlock.peek$( address, length, stop );
};
AOZ.prototype.deek$ = function( address, length, stop )
{
	var memoryBlock = this.getMemoryBlockFromAddress( address );
	return memoryBlock.deek$( address, length, stop );
};
AOZ.prototype.fill = function( start, end, value )
{
	var startBlock = this.getMemoryBlockFromAddress( start );
	var endBlock = this.getMemoryBlockFromAddress( end );
	if ( startBlock != endBlock )
		throw { error: 'illegal_function_call', parameter: '' };
	startBlock.fill( start, end, value );
};
AOZ.prototype.copy = function( source, length, destination )
{
	var sourceBlock = this.getMemoryBlockFromAddress( source );
	sourceBlock.copy( destination, length );
};
AOZ.prototype.hunt = function( start, end, text )
{
	var startBlock = this.getMemoryBlockFromAddress( start );
	var endBlock = this.getMemoryBlockFromAddress( end );
	if ( startBlock != endBlock )
		throw { error: 'illegal_function_call', parameter: '' };
	return startBlock.hunt( start, end, text );
};






AOZ.prototype.bSet = function( variable, shift )
{
	var value = this.getVariable( variable );
	this.setVariable( variable, value | ( 1 << shift ) );
};
AOZ.prototype.bClr = function( variable, shift )
{
	var value = this.getVariable( variable );
	this.setVariable( variable, value & ( ~( 1 << shift ) ) );
};
AOZ.prototype.bChg = function( variable, shift )
{
	var value = this.getVariable( variable );
	this.setVariable( variable, value ^ ( 1 << shift ) );
};
AOZ.prototype.rolB = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x80 ) != 0 ? 0x01 : 0x00;
	this.setVariable( variable, ( value & 0xFFFFFF00 ) | ( ( value << shift ) & 0xFF ) | carry );
};
AOZ.prototype.rolW = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x8000 ) != 0 ? 0x01 : 0x00;
	this.setVariable( variable, ( value & 0xFFFF0000 ) | ( ( value << shift ) & 0xFFFF ) | carry );
};
AOZ.prototype.rolL = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x80000000 ) != 0 ? 0x01 : 0x00;
	this.setVariable( variable, ( value << shift ) | carry );
};
AOZ.prototype.rorB = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x01 ) != 0 ? 0x80 : 0x00;
	this.setVariable( variable, ( value & 0xFFFFFF00 ) | ( ( value >>> shift ) & 0xFF ) | carry );
};
AOZ.prototype.rorW = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x01 ) != 0 ? 0x8000 : 0x0000;
	this.setVariable( variable, ( value & 0xFFFF0000 ) | ( ( value >>> shift ) & 0xFFFF ) | carry );
};
AOZ.prototype.rorL = function( variable, shift )
{
	var value = this.getVariable( variable );
	var carry = ( value & 0x01 ) != 0 ? 0x80000000 : 0x00000000;
	this.setVariable( variable, ( value >>> shift ) | carry );
};

AOZ.prototype.getBrowserName = function()
{
	/*
		NOTE: Some browsers masquerade as others.  For example:
			Vivaldi & Brave:	Chrome
			Tor Browser:		Firefox
	   I'll simplify the code later.
	*/
	var result = 'Unknown';
	var ua=navigator.userAgent.toLowerCase();
	isMSIE=			ua.indexOf('msie') >=0;		// Internet Explorer 8-10
	isExplorer=		ua.indexOf('explorer') >=0;	// Internet Explorer 11
	isEdge=			ua.indexOf(' edg\/') >= 0;
	isFirefox=		ua.indexOf('firefox') >= 0;
	isOpera=		ua.indexOf(' opr\/') >= 0;
	isChromium=		ua.indexOf(' chromium') >=0;	// Windows, OS/X, Linux, Android
	isMaxthon=		ua.indexOf(' maxthon') >=0;	// Maxthon SHOULD WE BLOCK IT, or at least WARN the user about it?!  (Major security issue!)
	isChrome=		ua.indexOf('chrome') >= 0 && ua.indexOf(' opr\/') < 0 && ua.indexOf(' edg\/') < 0;
	isSafari=		ua.indexOf('safari\/') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf(' opr\/') < 0;
	// Popular Linux browsers
	isSeamonkey=	ua.indexOf(' seamonkey') >=0;
	isMidori=		ua.indexOf(' midori') >=0;
	isKonquerer=	ua.indexOf(' konquerer') >=0;
	isPaleMoon=		ua.indexOf(' palemoon') >=0;
	isFalkon=		ua.indexOf(' falkon') >=0;
	isW3M=			ua.indexOf('w3m') >=0;
	// Mobile Browsers
	isOperaMini=	ua.indexOf(' opera mini') >=0;	// Android & Blackberry
	isUCBrowser=	ua.indexOf('ucbrowser') >=0;	// Android

	if (isMSIE)			result='MSIE'; // 8-10
	if (isExplorer)		result='Explorer'; // 11
	if (isEdge)			result='Edge';
	if (isFirefox)		result='Firefox';
	if (isOpera)		result='Opera';
	if (isChromium) 	result='Chromium';
	if (isMaxthon)		result='Maxthon';
	if (isSafari)		result='Safari';
	if (isChrome)		result='Chrome';
	// Popular Linux Browsers
	if (isSeamonkey)	result='Seamonkey';
	if (isMidori)		result='Midori';
	if (isKonquerer)	result='Konquerer';
	if (isPaleMoon)		result='Pale Moon';
	if (isW3M)			result='W3M';
	// Mobile Browsers
	if (isUCBrowser)	result='UCBrowser';		// Android
	if (isOperaMini)	result='Opera Mini';	// Android & Blackberry

	return result;
}	// getBrowserName()

AOZ.prototype.browserIsWeird = function()
{
	var BN  = this.getBrowserName();
	return ( BN=='Firefox' || BN=='Seamonkey' ) //
}

// Gamepads
AOZ.GAMEPAD_FIRE = 0;
AOZ.GAMEPAD_UP = 12;
AOZ.GAMEPAD_DOWN = 13;
AOZ.GAMEPAD_RIGHT = 15;
AOZ.GAMEPAD_LEFT = 14;
AOZ.GAMEPAD_A = 0;
AOZ.GAMEPAD_B = 1;
AOZ.GAMEPAD_X = 2;
AOZ.GAMEPAD_Y = 3;
AOZ.GAMEPAD_STICKLEFT = 10;
AOZ.GAMEPAD_STICKRIGHT = 11;
AOZ.GAMEPAD_BOTTOMLEFT = 6;
AOZ.GAMEPAD_TOPLEFT = 4;
AOZ.GAMEPAD_BOTTOMRIGHT = 7;
AOZ.GAMEPAD_TOPRIGHT = 5;
AOZ.GAMEPAD_CENTERLEFT = 8;
AOZ.GAMEPAD_CENTERRIGHT = 9;
AOZ.GAMEPAD_HAXELEFT = 0;
AOZ.GAMEPAD_VAXELEFT = 1;
AOZ.GAMEPAD_HAXERIGHT = 2;
AOZ.GAMEPAD_VAXERIGHT = 3;
AOZ.MAPPING_BUTTONS = 0;  // ???
AOZ.MAPPING_AXES = 16;
AOZ.MAPPING_TRIGGERS = 32;

AOZ.prototype.getGamepadAutoMove= function ()
{
	return this.gamepad_AutoMove ? this.platformTrue : false
}

AOZ.prototype.getGamepadKeyboard= function ()
{
	return this.gamepad_Keyboard ? this.platformTrue : false
}

AOZ.prototype.getGamepadTreshold= function () // BJF
{
	return this.gamepad_Threshold
}

AOZ.prototype.setGamepads = function()
{
	this.gamepadMaps = {};
	this.scanGamepads();
	var self = this;
	window.addEventListener( "gamepadconnected", function( e )
	{
		self.scanGamepads();
	} );

	window.addEventListener( "gamepaddisconnected", function(e)
	{
		self.scanGamepads();
	} );
};

AOZ.prototype.scanGamepads = function() 
{										
	this.gamepads = navigator.getGamepads(); 
	if ( this.browserIsWeird() )	
	{ 
		this.gamepad_vertical_axis = 2; 
		this.gamepad_horizontal_axis = 1; 
	}
	else
	{
		this.gamepad_vertical_axis = 1; 
		this.gamepad_horizontal_axis=0; 
	}
};

AOZ.prototype.getMapping = function( gamepad, key, delta )
{
	/*
	if ( gamepad.mapping == 'standard' )
		return key;
// alert(gamepad.id); // BJF
	if ( this.gamepadMaps[ gamepad.id ] )
	{
		var keyMapped = this.gamepadMaps[ gamepad.id ][ key + delta ];
		if ( typeof keyMapped != 'undefined' )
			return keyMapped;
	}
	*/
	return key;
}; 

AOZ.prototype.getKeyMapping = function( key )
{
	var code = this.manifest.gamepad.mapping[ key ];
	if ( code )
	{
		var info = this.convertToPlatform( this.platformKeymap, { code: code } );
		if ( info && info.keyCode != 'undefined' )
		{
			return this.keymap[ info.keyCode ];
		}
	}
	return false;
};

AOZ.prototype.setKeyMapping = function( direction, keycode )
{
	if ( this.manifest.gamepad.mapping[ direction ] )
	{
		this.manifest.gamepad.mapping[ direction ] = keycode
	}
	else
	{
		throw( 'Invalid JoyKey function' );
	}
};

AOZ.prototype.lockJoystick = function( state, lock, direction )
{
	if ( lock )
	{
		if ( state )
		{
			if ( this.joyLock[ direction ] )
				state = false;
			this.joyLock[ direction ] = true;
		}
		else
		{
			this.joyLock[ direction ] = false;
		}
	}
	return state ? this.platformTrue : false;
};

// For jUp, jDown, jLeft, jRight
// Default "LEFT" is Axis(0)=-1
// Default "RIGHT" is Axis(0)=1
// Default "UP" is Axis(1) = -1
// Default "DOWN" is Axis(1) = 1

// For WEIRD browsers (Firefox, Seamonkey, Safari)
// Default "UP" is Axis(1) = -1
// Default "DOWN" is Axis(1) = 1
// Default "LEFT" is Axis(2) = -1
// Default "RIGHT" is Axis(2) = 1
// Digital gamepad Up function, but usually read as analog and converted to digital.
AOZ.prototype.jUp = function( number, lock )
{
	var pressed = this.getKeyMapping( 'up' ); 
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
	{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= this.gamepadAxis( number, this.gamepad_vertical_axis ) < -this.gamepad_Threshold; 
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'up' );
}; 

// Digital gamepad Down function, but usually read as analog and converted to digital.
AOZ.prototype.jDown = function( number, lock )
{
	var pressed = this.getKeyMapping( 'down' ); 
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= this.gamepadAxis( number, this.gamepad_vertical_axis ) > this.gamepad_Threshold;
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'down' );
};

// Digital gamepad Left function, but usually read as analog and converted to digital.
AOZ.prototype.jLeft = function( number, lock )
{
	var pressed = this.getKeyMapping( 'left' ); 
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= this.gamepadAxis( number, this.gamepad_horizontal_axis ) < this.gamepad_Threshold;
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'left' );
};

// Digital gamepad Right function, but usually read as analog and converted to digital.
AOZ.prototype.jRight = function( number, lock )
{
	var pressed = this.getKeyMapping( 'right' ); 
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= this.gamepadAxis( number, this.gamepad_horizontal_axis ) > this.gamepad_Threshold;
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'right' );
};

// Digital gamepad Up & Left function, but usually read as analog and converted to digital.
AOZ.prototype.jUpLeft = function( number, lock )
{
	var pressed = this.getKeyMapping( 'up' ) & this.getKeyMapping( 'left' );
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= ( this.gamepadAxis( number, this.gamepad_vertical_axis ) < -this.gamepad_Threshold )	&& ( this.gamepadAxis( number, this.gamepad_horizontal_axis ) < -this.gamepad_Threshold );
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'upleft' );
};

// Digital gamepad Up & Right function, but usually read as analog and converted to digital.
AOZ.prototype.jUpRight = function( number, lock ) // BJF
{
	var pressed = this.getKeyMapping( 'up' ) & this.getKeyMapping( 'right' );
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= ( this.gamepadAxis( number, this.gamepad_vertical_axis ) < -this.gamepad_Threshold )	&& ( this.gamepadAxis( number, this.gamepad_horizontal_axis ) > -this.gamepad_Threshold );
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'upright' );
};

// Digital gamepad Down & Left function, but usually read as analog and converted to digital.
AOZ.prototype.jDownLeft = function( number, lock ) // BJF
{
	var pressed = this.getKeyMapping( 'down' ) & this.getKeyMapping( 'left' );
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= ( this.gamepadAxis( number, this.gamepad_vertical_axis ) > this.gamepad_Threshold )	&& ( this.gamepadAxis( number, this.gamepad_horizontal_axis ) < -this.gamepad_Threshold );
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'downleft' );
};

// Digital gamepad Down & Right function, but usually read as analog and converted to digital.
AOZ.prototype.jDownRight = function( number, lock ) // BJF
{
	var pressed = this.getKeyMapping( 'down' ) & this.getKeyMapping( 'right' );
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
				pressed |= ( this.gamepadAxis( number, this.gamepad_vertical_axis ) > this.gamepad_Threshold )	&& ( this.gamepadAxis( number, this.gamepad_horizontal_axis ) > this.gamepad_Threshold );
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'downright' );
}; 

AOZ.prototype.fire = function( number, lock )
{
	var pressed = this.getKeyMapping( 'fire' );
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
			{
				pressed |= gamepad.buttons[ 0 ].pressed || gamepad.buttons[ 0 ].value;
			}
		}
	}
	return this.lockJoystick( pressed, lock, 'fire' );
};

AOZ.prototype.joy = function( number )
{
	var result = 0;
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
			if ( gamepad.mapping == 'standard' )
			{
				result |= gamepad.buttons[ this.getMapping( gamepad, AOZ.GAMEPAD_UP, AOZ.MAPPING_BUTTONS ) ].pressed ? 0x01 : 0x00;
				result |= gamepad.buttons[ this.getMapping( gamepad, AOZ.GAMEPAD_DOWN, AOZ.MAPPING_BUTTONS ) ].pressed ? 0x02 : 0x00;
				result |= gamepad.buttons[ this.getMapping( gamepad, AOZ.GAMEPAD_LEFT, AOZ.MAPPING_BUTTONS ) ].pressed ? 0x04 : 0x00;
				result |= gamepad.buttons[ this.getMapping( gamepad, AOZ.GAMEPAD_RIGHT, AOZ.MAPPING_BUTTONS ) ].pressed ? 0x08 : 0x00;
				result |= gamepad.buttons[ this.getMapping( gamepad, AOZ.GAMEPAD_FIRE, AOZ.MAPPING_BUTTONS ) ].pressed ? 0x10 : 0x00;
				return result;
			}
		}
	}
	}
	result |= this.getKeyMapping( 'up' ) ? 0x01 : 0x00;
	result |= this.getKeyMapping( 'down' ) ? 0x02 : 0x00;
	result |= this.getKeyMapping( 'left' ) ? 0x04 : 0x00;
	result |= this.getKeyMapping( 'right' ) ? 0x08 : 0x00;
	result |= this.getKeyMapping( 'fire' ) ? 0x10 : 0x00;
	return result;
}; 

AOZ.prototype.gamepadDisconnected = function( number )
{

}

AOZ.prototype.gamepadConnected = function( number )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			return ( this.gamepads && this.gamepads[ number ] && this.gamepads[ number ].connected ) ? this.platformTrue : false;
	}
	}
	return 0
};

AOZ.prototype.gamepadName$= function( number )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
			{
				return gamepad.id;
			}
		}
	}
	return '';
};

AOZ.prototype.gamepadVendor$= function( number )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
			{
				return gamepad.id;
			}
		}
	}
	return '';
};

AOZ.prototype.gamepadProduct$= function( number )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
			{
				return gamepad.id;
			}
		}
	}
	return '';
};

AOZ.prototype.gamepadNumAxes = function( number )
{
	if (this.gamepads)
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
				return gamepad.axes.length;
	}
	}
	return 0;
}

AOZ.prototype.gamepadNumButtons = function( number )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
		var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
			return gamepad.buttons.length
	}
	}
	return 0;
}

AOZ.prototype.gamepadAxis = function( number, axis )
{
	if (this.gamepads)
	{
		if ( number >= 0 && number < this.gamepads.length )
	{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
	   	{
			if ( gamepad.axes )
			{
				var value = gamepad.axes[ this.getMapping( gamepad, axis, AOZ.MAPPING_AXES ) ];
				return typeof value != 'undefined' ? value : 0;
			}
	   	}
   	}
   	}
	return 0;
};

AOZ.prototype.gamepadButton = function( number, button )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
		{
			var gamepad = this.gamepads[ number ];
			if ( gamepad && gamepad.connected )
			{
				b = gamepad.buttons[button];
	//			var b = gamepad.buttons[ this.getMapping( gamepad, button, AOZ.MAPPING_BUTTONS ) ];
				if( b != undefined )
				{
					return ( b.pressed || b.value ) ? this.platformTrue : false;
				}
			}
		}
   	}
	return 0;
};

AOZ.prototype.gamepadTrigger = function( number, trigger )
{
	if ( this.gamepads )
	{
		if ( number >= 0 && number < this.gamepads.length )
	{
		var gamepad = this.gamepads[ number ];
		if ( gamepad && gamepad.connected )
		{
			if ( gamepad.mapping == 'standard' )
			{
				trigger = ( trigger == 0 ? AOZ.GAMEPAD_BOTTOMLEFT : AOZ.GAMEPAD_BOTTOMRIGHT );
				return gamepad.buttons[ trigger ].value;
			}
			else if ( gamepad.axes )
			{
				var value = gamepad.axes[ this.getMapping( gamepad, trigger, AOZ.MAPPING_TRIGGERS ) ];
				return typeof value != 'undefined' ? value : 0;
			}
		}
	}
	}
	return 0;
};

// Animations primitives
AOZ.prototype.getAnimation = function( channel, name, angle )
{
	var clip;

	// Already running?
	name = name.toLowerCase();
	if ( ( channel.currentClip && channel.currentClip.initialized && name == channel.currentClip.vars.name.toLowerCase() ) && channel.currentDirection == angle )
		return channel.currentClip;

	// Find new clip
	var deltas = [];
	for ( var c = 0; c < channel.clip.length; c++ )
		deltas[ c ] = 1000;
	for ( var c = 0; c < channel.clip.length; c++ )
	{
		if ( channel.clip[ c ].vars.name == name )
		{
			deltas[ c ] = Math.abs( channel.clip[ c ].vars.direction - angle );
		}
	}
	var bestDelta = 1000;
	for ( var c = 0; c < channel.clip.length; c++ )
	{
		if ( channel.clip[ c ].vars.name.toLowerCase() == name )
		{
			if ( deltas[ c ] < bestDelta )
			{
				bestDelta = deltas[ c ];
				clip = channel.clip[ c ];
			}
		}
	}
	// Not found-> get the first one.
	if ( !clip )
		clip = channel.clip[ 0 ];

	var previousClip = channel.currentClip;
	if ( clip != previousClip )
	{
		channel.currentClip = clip;
		channel.clip_current = clip;
		channel.currentDirection = angle;

		this.sections.push( null );
		var section = clip[ 'start_m' ];
		section.vars.channel = channel;
		section.vars.previousClip = previousClip;
		section.position = 0;
		try
		{
			this.runBlocks( section, false );
		}
		catch( error )
		{
			this.handleErrors( error );
		}
	}
	return clip;
};
AOZ.prototype.callAnimations = function( channel, deltaTime )
{
	var angle = ( channel.movement_current ? channel.movement_current.vars.angle : 0 );
	if ( channel.clip && channel.clip.length > 0 )
	{
		var speed = ( channel.movement_current ? channel.movement_current.vars.speed : 1000 );
		var toRotate = ( channel.movement_current ? channel.movement_current.vars.rotation : false );
		var name = ( speed == 0 ? 'static' : 'moving' );
		var clip = this.getAnimation( channel, name, angle );
		if ( clip )
		{
			this.sections.push( null );
			var section = clip[ 'animate_m' ];
			section.vars.channel = channel;
			section.vars.deltaTime = deltaTime;
			section.vars.speed = speed;
			section.position = 0;
			try
			{
				this.runBlocks( section, false );
			}
			catch( error )
			{
				this.handleErrors( error );
			}
			if ( toRotate )
				channel.set_angle( angle );
		}
	}
	else
	{
		var toRotate = ( channel.movement_current ? channel.movement_current.vars.rotation : false );
		if ( toRotate )
			channel.set_angle( angle );
	}
};
AOZ.prototype.setAnimState = function( index, className, state )
{
	for ( var o = 0; o < this.synchroList.length; o++ )
	{
		var channel = this.synchroList[ o ];
		if ( channel.animations )
		{
			var doIt = true;
			if ( typeof className != 'undefined' && channel.className != className )
				doIt = false;
			if ( typeof index != 'undefined' && index != channel.index )
				doIt = false;
			if ( doIt )
			{
				for ( var a in channel.animations )
				{
					for ( var aa = 0; aa < channel.animations[ a ].length; aa++ )
						channel.animations[ a ][ aa ].set_state( state );
				}
			}
		}
	}
};
AOZ.prototype.setMoveState = function( index, className, state )
{
	for ( var o = 0; o < this.synchroList.length; o++ )
	{
		var channel = this.synchroList[ o ];
		if ( channel.movement )
		{
			var doIt = true;
			if ( typeof className != 'undefined' && channel.className != className )
				doIt = false;
			if ( typeof index != 'undefined' && index != channel.index )
				doIt = false;
			if ( doIt )
				channel.movement.set_state( state );
		}
	}
};
AOZ.prototype.getObjectFromType = function( type, index, errorString )
{
	if ( type.toLowerCase() == 'bob' )
		return this.aoz.currentScreen.getBob( index, errorString ? 'bob' + errorString : undefined );
	else if ( type.toLowerCase() == 'sprite' )
		return this.aoz.getSprite( index, errorString ? 'sprite' + errorString : undefined );
	return undefined;
};

AOZ.prototype.getAnimationChannel = function( channelNumber )
{
	var channel = this.aoz.channelsTo[ channelNumber ];
	if ( channel )
		return channel.get_this( channel.objectNumber, channel.func );
	return undefined;
};
AOZ.prototype.checkAnimationChannel = function( channelNumber, channelType, objectNumber, objectType, objectFunc, force )
{
	var channel = this.aoz.channelsTo[ channelNumber ];
	if ( channel )
	{
		if ( channelType && channelType != channel.channelType )
			channel = undefined;
		if ( objectType && objectType != channel.objectType )
			channel = undefined;
	}
	if ( !channel && force )
	{
		var fThis;
		if ( objectType )
		{
			if ( window[ objectType ] )
				fThis = window[ objectType ].prototype.get_this;
			else
				throw 'illegal_function_call';
		}
		else
		{
			var bob = this.currentScreen.getBob( objectNumber, undefined );
			if ( bob )
				fThis = window[ 'Bob' ].prototype.get_this;
			else
			{
				var sprite = this.getSprite( objectNumber, undefined );
				if ( sprite )
					fThis = window[ 'Sprite' ].prototype.get_this;
			}
		}
		if ( !fThis )
			fThis = function() { return undefined; }
		channel =
		{
			aoz: this.aoz,
			self: undefined,
			type: objectType,
			func: objectFunc,
			objectNumber: objectNumber,
			channelNumber: channelNumber,
			channelType: channelType,
			get_this: fThis
		};
		this.channelsTo[ channelNumber ] = channel;
	}
	return channel;
};
AOZ.prototype.destroyAnimationChannel = function( channel )
{
};


///////////////////////////////////////////////////////////////////////////
//
// AMAL!
//
///////////////////////////////////////////////////////////////////////////
AOZ.prototype.amalOnOff = function( onOff, channelNumber )
{
	this.amal.setOnOff( onOff, channelNumber );
}
AOZ.prototype.amalStart = function( args )
{
	var channelNumber = args[ 0 ];
	var source = args[ 1 ];
	var address = args[ 2 ];
	var compiler = new AMALCompiler( this );
	if ( typeof source == 'number' )
		debugger;						// TODO please ;)

	this.amalErrors = [];
	this.amalErrorNumberCount = 0;
	this.amalErrorStringCount = 0;
	var code = compiler.compile( source, {} )
	if ( this.utilities.isArray( code ) )
	{
		this.amalErrors = code;
		throw 'amal_error';
	}

	var self = this;
	this.amalStarted = false;
	var channel = this.aoz.checkAnimationChannel( channelNumber, null, channelNumber, null, null, true );
	this.amal.runChannel( channel, code, function( response, data, extra )
	{
		if ( !response )
			throw 'illegal_function_call';
		self.amalStarted = true;
	} );
};
AOZ.prototype.amalStart_wait = function( channel, source, address )
{
	return this.amalStarted;
};
AOZ.prototype.amalError = function()
{
	if ( this.amalErrorNumberCount < this.amalErrors.length )
	{
		return this.amalErrors[ this.amalErrorNumberCount++ ].position;
	}
	return 0;
};
AOZ.prototype.amalError$ = function()
{
	if ( this.amalErrorStringCount < this.amalErrors.length )
	{
		return this.errors.getError( this.amalErrors[ this.amalErrorStringCount++ ].error );
	}
	return '';
};

//
// fp2Int - Return the integer portion of a floating point number.
//
AOZ.prototype.fp2Int =function ( f ) // BJF
{
	 if ( f < 0 )
	 	return Math.ceil(f)
	 else
	 	return Math.floor(f);
};

/*
AOZ.ptototype.setGamepadThreshold= function ( t ) // BJF
{
	this.gamepad_Threshold = t;
}
*/



/////////////////////////////////////////////////////////////////////////
//
// OBJECT ORIENTATION
//
/////////////////////////////////////////////////////////////////////////
AOZ.prototype.getBob = function( index )
{
	return this.currentScreen.getBob( index, 'bob_not_defined' );
};
AOZ.prototype.getSprite = function( index, errorString )
{
	return this.sprites.context.getElement( this.aoz.currentContextName, index, errorString );
};
AOZ.prototype.addObject = function( thisObject, thatObject )
{
	var className = thatObject.className.toLowerCase();
	if ( !thisObject[ className ] )
	{
		thisObject[ className ] = [];
		thisObject[ className + '_current' ] = null;
	}

	thisObject[ className ].push( thatObject );
	thisObject[ className + '_current' ] = thatObject;
	thatObject.rootObject = thisObject;
	this.addToSynchro( thatObject, thisObject );
};
AOZ.prototype.setObject = function( thisObject, thatObject, index )
{
	var className = thatObject.className.toLowerCase();
	if ( typeof index == 'undefined' )
	{
		thisObject[ className ] = [ thatObject ];
		thisObject[ className + '_current' ] = thatObject;
	}
	else
	{
		if ( !thisObject[ className ] )
			thisObject[ className ] = [];
		if ( index < 0 || index > thisObject[ className ].length + 1 )
			throw { error: 'illegal_function_call', parameter: index };
		thisObject[ className ][ index ] = thatObject;
		thisObject[ className + '_current' ] = thatObject;
	}
	this.addToSynchro( thatObject, thisObject );
};
AOZ.prototype.delObject = function( thisObject, thatObject, index )
{
	var className = thatObject.className.toLowerCase();
	if ( thisObject[ className ] )
	{
		// Find the good object
		if ( index < 0 )
		{
			thatObject = thisObject[ className + '_current' ];
			index = undefined;
		}
		if ( typeof index == 'undefined' )
		{
			index = thisObject[ className ].findIndex( function( element )
			{
				return element == thatObject;
			} );
		}

		// Delete
		if ( index < 0 || index >= thisObject[ className ].length )
			throw { error: 'illegal_function_call', parameter: index };
		thisObject[ className ].slice( index, 1 );

		// The object at its position becomes the current one
		if ( thisObject[ className ].length > 0 )
		{
			if ( index == thisObject[ className ].length )
				index = thisObject[ className ].length - 1;
			thisObject[ className + '_current' ] = thisObject[ className ][ index ];
		}
		this.removeFromSynchro( thatObject );
	}
};

AOZ.prototype.onMessage = function( message, callback, extra )
{
	switch ( message.command )
	{
		case 'stepInCodeOn':
			if ( !this.stepInCode )
			{
				this.stepInCode = true;
			}
			break;
		case 'stepInCodeOff':
			if ( this.stepInCode )
			{
				this.stepInCode = false;
			}
			break;
		case 'debuggerOn':
			if ( !this.debuggerOn )
			{
				this.debuggerOn = true;
				MainLoop.stop();
			}
			break;
		case 'debuggerOff':
			if ( this.debuggerOn )
			{
				this.debuggerOn = false;
				MainLoop.start();
			}
			break;
		case 'isDebugger':
			if ( this.ext_debugging )
			{
				return this.ext_debugging.isDebugger();
			}
			return false;
		case 'showDebugger':
			if ( this.ext_debugging )
			{
				message.parameters.visible = true;
				if ( !message.parameters.mode )
					message.parameter.mode = 'play';
				this.ext_debugging.debugOn( message.parameters );
			}
			break;
		case 'hideDebugger':
			if ( this.ext_debugging )
			{
				this.ext_debugging.debugOff( {} );
			}
			break;
		case 'end':
			this.debuggerOn = false;
			this.break = true;
			this.displayEndAlert = false;
			break;
		case 'restart':
			this.debuggerOn = false;
			try
			{
				localStorage.setItem( '_debugger_restart_', '1' );
			}
			catch(e)
			{
			}
			location.reload ? location.reload() : location = document.URL;
			break;
		case 'executeCommand':
			if ( this.debuggerOn && message.parameter != '' )
			{
				// Save and load code as blob
				var name = 'AOZ_DirectCommand_' + ( ++this.debuggerCommandNumber );
				var code = this.utilities.replaceStringInText( message.parameter, '%$NAME', name );
				console.log( code );
				var script = document.createElement( 'script' );
				//debugger;
				//script.referrerPolicy = 'origin';
				script.textContent = code;
				document.body.appendChild( script );
				this.break = false;

				// Wait for source to be loaded
				var self = this;
				var handle = setInterval( function()
				{
					if ( typeof Application[ name ] != 'undefined' )
					{
						clearInterval( handle );
						//self.section.returns.push( self.section.position );
						var task = 
						{
							paused: true,
							section: null,
							sections:[ null ]
						};
						var previousTask = self.currentTask;
						self.tasks.push( task );
 						self.setTask( task );
						var newSection = new Application[ name ]( self, self.root, {} );	
						newSection.isDebuggerCommand = true;
						newSection.isDebuggerOutput = ( self.ext_debugging.vars.consoleOutput == 'debugger' );
						newSection = self.initSection( newSection );
						newSection.callAtPop = function( section1, section2 )
						{
							if ( message.callback )
							{
								message.callback( true, newSection.results[ 0 ], message.extra )
							}
						};
						if ( self.currentTask.section )
							self.currentTask.sections.push( newSection );
						else
							self.currentTask.section = newSection;
						console.log( 'add task!' );
						self.setTask( previousTask );
					}
				}, 20 );
			}
			break;
	}
};
AOZ.prototype.sendMessage = function( message, options, callback, extra )
{
	// Send message to IDE
	if ( this.connectedToIDE == true )
	{
		this.ideWebSocket.send( JSON.stringify( message ) );

		if ( callback )
		{
			callback( true, {}, {} );
		}
	}
	else
	{
		if ( callback )
		{
			callback( false, "Web socket not opened", {} );
		}
	}
};
AOZ.prototype.waitForFinalLoad = function()
{
	if ( this.loadingCount == this.loadingMax )
	{
		this.waiting = null;
	}
};
AOZ.prototype.waitForGuru = function()
{
	if ( this.clickMouse )
	{
		if ( this.clickMouse & 0x01 )
			this.utilities.sendCrashMail();
		this.waiting = null;
		this.break = true;
	}
};
AOZ.prototype.pushExtension = function( section )
{
	this.extensionsToRun.push( section );
};
AOZ.HREV = 0x8000;
AOZ.VREV = 0x4000;



AOZ.prototype.get_fromInstruction = function( name, fromInstruction )
{
	if ( fromInstruction.indexOf( '#update' ) >= 0 )
	{
		var value = this.varsUpdated[ name ];
		this.varsUpdated[ name ] = undefined;
		return value;
	}
	return this.vars[ name ];
}
AOZ.prototype.get_x = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.x;
	return this.get_fromInstruction( 'x', fromInstruction );
};
AOZ.prototype.get_y = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.y;
	return this.get_fromInstruction( 'y', fromInstruction );
};
AOZ.prototype.get_z = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.z;
	return this.get_fromInstruction( 'z', fromInstruction );
};
AOZ.prototype.get_width = function( fromInstruction )
{
	if (!fromInstruction )
		return this.vars.width;
	return this.get_fromInstruction( 'width', fromInstruction );
};
AOZ.prototype.get_height = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.height;
	return this.get_fromInstruction( 'height', fromInstruction );
};
AOZ.prototype.get_depth = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.depth;
	return this.get_fromInstruction( 'depth', fromInstruction );
};
AOZ.prototype.get_skewX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.skewX;
	return this.get_fromInstruction( 'skewX', fromInstruction );
};
AOZ.prototype.get_skewY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.skewY;
	return this.get_fromInstruction( 'skewY', fromInstruction );
};
AOZ.prototype.get_skewZ = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.skewZ;
	return this.get_fromInstruction( 'skewZ', fromInstruction );
};
AOZ.prototype.get_offsetX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.offsetX;
	return this.get_fromInstruction( 'offsetX', fromInstruction );
};
AOZ.prototype.get_offsetY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.offsetY;
	return this.get_fromInstruction( 'offsetY', fromInstruction );
};
AOZ.prototype.get_offsetZ = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.offsetZ;
	return this.get_fromInstruction( 'offsetZ', fromInstruction );
};
AOZ.prototype.get_scaleX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.scaleX;
	return this.get_fromInstruction( 'scaleX', fromInstruction );
};
AOZ.prototype.get_scaleY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.scaleY;
	return this.get_fromInstruction( 'scaleY', fromInstruction );
};
AOZ.prototype.get_scaleZ = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.scaleZ;
	return this.get_fromInstruction( 'scaleZ', fromInstruction );
};
AOZ.prototype.get_cameraX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.cameraX;
	return this.get_fromInstruction( 'cameraY', fromInstruction );
};
AOZ.prototype.get_cameraY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.cameraY;
	return this.get_fromInstruction( 'cameraY', fromInstruction );
};
AOZ.prototype.get_cameraZ = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.cameraZ;
	return this.get_fromInstruction( 'cameraZ', fromInstruction );
};
AOZ.prototype.get_shadowX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.shadowX;
	return this.get_fromInstruction( 'shadowX', fromInstruction );
};
AOZ.prototype.get_shadowY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.shadowY;
	return this.get_fromInstruction( 'shadowY', fromInstruction );
};
AOZ.prototype.get_shadowBlur = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.shadowBlur;
	return this.get_fromInstruction( 'shadowBlur', fromInstruction );
};
AOZ.prototype.get_shadowColor = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.shadowColor;
	return this.get_fromInstruction( 'shadowColor', fromInstruction );
}
AOZ.prototype.get_hotspotX = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.hotspotX;
	return this.get_fromInstruction( 'hotspotX', fromInstruction );
};
AOZ.prototype.get_hotspotY = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.hotspotY;
	return this.get_fromInstruction( 'hotspotY', fromInstruction );
};
AOZ.prototype.get_hotspotZ = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.hotspotZ;
	return this.get_fromInstruction( 'hotspotZ', fromInstruction );
};
AOZ.prototype.get_image = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.image;
	return this.get_fromInstruction( 'image', fromInstruction );
};
AOZ.prototype.get_angle = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.angle;
	return this.get_fromInstruction( 'angle', fromInstruction );
};
AOZ.prototype.get_alpha = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.alpha;
	return this.get_fromInstruction( 'alpha', fromInstruction );
};
AOZ.prototype.get_visible = function( fromInstruction )
{
	if ( !fromInstruction )
		return this.vars.visible;
	return this.get_fromInstruction( 'visible', fromInstruction );
};
AOZ.prototype.set_x = function( value, fromInstruction )
{
	this.setPosition( { x: value }, fromInstruction );
};
AOZ.prototype.set_y = function( value, fromInstruction )
{
	this.setPosition( { y: value }, fromInstruction );
};
AOZ.prototype.set_z = function( value, fromInstruction )
{
	this.setPosition( { z: value }, fromInstruction );
};
AOZ.prototype.set_scaleX = function( value, fromInstruction )
{
	this.setScale( { x: value }, fromInstruction );
};
AOZ.prototype.set_scaleY = function( value, fromInstruction )
{
	this.setScale( { y: value }, fromInstruction );
};
AOZ.prototype.set_scaleZ = function( value, fromInstruction )
{
	this.setScale( { z: value }, fromInstruction );
};
AOZ.prototype.set_offsetX = function( value, fromInstruction )
{
	this.setOffset( { x: value }, fromInstruction );
};
AOZ.prototype.set_offsetY = function( value, fromInstruction )
{
	this.setOffset( { y: value }, fromInstruction );
};
AOZ.prototype.set_offsetZ = function( value, fromInstruction )
{
	this.setOffset( { z: value }, fromInstruction );
};
AOZ.prototype.set_skewX = function( value, fromInstruction )
{
	this.setSkew( { x: value }, fromInstruction );
};
AOZ.prototype.set_skewY = function( value, fromInstruction )
{
	this.setSkew( { y: value }, fromInstruction );
};
AOZ.prototype.set_skewZ = function( value, fromInstruction )
{
	this.setSkew( { z: value }, fromInstruction );
};
AOZ.prototype.set_cameraX = function( value, fromInstruction )
{
	this.setCamera( { x: value }, fromInstruction );
};
AOZ.prototype.set_cameraY = function( value, fromInstruction )
{
	this.setCamera( { y: value }, fromInstruction );
};
AOZ.prototype.set_cameraZ = function( value, fromInstruction )
{
	this.setCamera( { z: value }, fromInstruction );
};
AOZ.prototype.set_shadowX = function( value, fromInstruction )
{
	this.setShadow( { x: value }, fromInstruction );
};
AOZ.prototype.set_shadowY = function( value, fromInstruction )
{
	this.setShadow( { y: value }, fromInstruction );
};
AOZ.prototype.set_shadowBlur = function( value, fromInstruction )
{
	this.setShadow( { z: value }, fromInstruction );
};
AOZ.prototype.set_shadowColor = function( value, fromInstruction )
{
	this.setShadow( { color: value }, fromInstruction );
};
AOZ.prototype.set_hotspotX = function( value, fromInstruction )
{
	this.setHotspot( { x: value }, fromInstruction );
};
AOZ.prototype.set_hotspotY = function( value, fromInstruction )
{
	this.setHotspot( { y: value }, fromInstruction );
};
AOZ.prototype.set_hotspotZ = function( value, fromInstruction )
{
	this.setHotspot( { z: value }, fromInstruction );
};
AOZ.prototype.set_width = function( value, fromInstruction )
{
	this.setSize( { width: value }, fromInstruction );
};
AOZ.prototype.set_height = function( value, fromInstruction )
{
	this.setSize( { height: value }, fromInstruction );
};
AOZ.prototype.set_depth = function( value, fromInstruction )
{
	this.setSize( { depth: value }, fromInstruction );
};
AOZ.prototype.set_image = function( value, fromInstruction )
{
	this.setImage( value, fromInstruction );
};
AOZ.prototype.set_angle = function( value, fromInstruction )
{
	this.setAngle( { z: value }, fromInstruction );
};
AOZ.prototype.set_visible = function( value, fromInstruction )
{
	this.setVisible( value, fromInstruction );
};
AOZ.prototype.set_alpha = function( value, fromInstruction )
{
	this.setAlpha( value, fromInstruction );
};

// GENERIC FUNCTIONS
AOZ.prototype.set_fromInstruction = function( updated, fromInstruction )
{
	if ( fromInstruction.indexOf( '#update' ) >= 0 )
	{
		for ( var p in updated )
			this.varsUpdated[ p ] = updated[ p ];
	}
};
AOZ.prototype.setPosition = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.x )
		{
			modified = true;
			this.vars.x =  rectangle.x;
			updated.x = rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.y )
		{
			modified = true;
			this.vars.y =  rectangle.y;
			updated.y = rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars.z )
		{
			modified = true;
			this.vars.z =  rectangle.z;
			updated.z = rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setHotspot = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.hotspotX )
		{
			modified = true;
			this.vars.hotspotX =  rectangle.x;
			updated.hotspotX = rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.hotspotY )
		{
			modified = true;
			this.vars.hotspotY =  rectangle.y;
			updated.hotspotY =  rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars.hotspotZ )
		{
			modified = true;
			this.vars.hotspotZ =  rectangle.z;
			updated.hotspotZ =  rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setSize = function( dimension, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof dimension.width != 'undefined' )
	{
		if ( dimension.width != this.vars.width )
		{
			modified = true;
			this.vars.width =  dimension.width;
			updated.width = dimension.x;
		}
	}
	if ( typeof dimension.height != 'undefined' )
	{
		if ( dimension.height != this.vars.height )
		{
			modified = true;
			this.vars.height = dimension.height;
			updated.height = dimension.height;
		}
	}
	if ( typeof dimension.depth != 'undefined' )
	{
		if ( dimension.depth != this.vars.depth )
		{
			modified = true;
			this.vars.depth =  dimension.depth;
			updated.depth = dimension.depth;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setOffset = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.offsetX )
		{
			modified = true;
			this.vars.offsetX =  rectangle.x;
			updated.offsetX = rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.offsetY )
		{
			modified = true;
			this.vars.offsetY =  rectangle.y;
			updated.offsetY = rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars.offsetZ )
		{
			modified = true;
			this.vars.offsetZ =  rectangle.z;
			updated.offsetZ = rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setShadow = function( shadow, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof shadow.x != 'undefined' )
	{
		if ( shadow.x != this.vars.shadowX )
		{
			modified = true;
			this.vars.shadowX =  shadow.x;
			updated.shadowX = shadow.x;
		}
	}
	if ( typeof shadow.y != 'undefined' )
	{
		if ( shadow.y != this.vars.shadowY )
		{
			modified = true;
			this.vars.shadowY =  shadow.y;
			updated.shadowY =  shadow.y;
		}
	}
	if ( typeof shadow.blur != 'undefined' )
	{
		if ( shadow.blur != this.vars.shadowBlur )
		{
			modified = true;
			this.vars.shadowBlur =  shadow.blur;
			updated.shadowBlur =  shadow.blur;
		}
	}
	if ( typeof shadow.color != 'undefined' )
	{
		if ( shadow.color != this.vars.shadowColor )
		{
			modified = true;
			this.vars.shadowColor =  shadow.color;
			updated.shadowColor =  shadow.color;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setSkew = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.skewX )
		{
			modified = true;
			this.vars.skewX =  rectangle.x;
			updated.skewX = rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.skewY )
		{
			modified = true;
			this.vars.skewY =  rectangle.y;
			updated.skewY =  rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.x != this.vars.skewZ )
		{
			modified = true;
			this.vars.skewZ =  rectangle.z;
			updated.skewZ =  rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setScale = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.scaleX )
		{
			modified = true;
			this.vars.scaleX =  rectangle.x;
			updated.scaleX =  rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.scaleY )
		{
			modified = true;
			this.vars.scaleY =  rectangle.y;
			updated.scaleY =  rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars.scaleZ )
		{
			modified = true;
			this.vars.scaleZ =  rectangle.z;
			updated.scaleZ =  rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setCamera = function( rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars.cameraX )
		{
			modified = true;
			this.vars.cameraX =  rectangle.x;
			updated.cameraX =  rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars.cameraY )
		{
			modified = true;
			this.vars.cameraY =  rectangle.y;
			updated.cameraY =  rectangle.y;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars.cameraZ )
		{
			modified = true;
			this.vars.cameraZ =  rectangle.z;
			updated.cameraZ =  rectangle.z;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction )
		this.setModified();
	}
};
AOZ.prototype.setAngle = function( angle, fromInstruction )
{
	if ( typeof angle.z != 'undefined' )
	{
		if ( angle.z != this.vars.angle )
		{
			this.vars.angle = angle.z;
			if ( fromInstruction )
				this.set_fromInstruction( angle.z, fromInstruction )
			this.setModified();
		}
	}
};
AOZ.prototype.setVisible = function( flag, fromInstruction )
{
	if ( typeof flag != 'undefined' )
	{
		if ( flag != this.vars.visible )
		{
			this.vars.visible = flag;
			if ( fromInstruction )
				this.set_fromInstruction( { visible: flag }, fromInstruction )
			this.setModified();
		}
	}
};
AOZ.prototype.setAlpha = function( alpha, fromInstruction )
{
	if ( typeof alpha != 'undefined' )
	{
		if ( alpha != this.vars.alpha )
		{
			this.vars.alpha = alpha;
			if ( fromInstruction )
				this.set_fromInstruction( { alpha: alpha }, fromInstruction )
			this.setModified();
		}
	}
};
AOZ.prototype.setImage = function( image, fromInstruction )
{
	if ( typeof image != 'undefined' )
	{
		if ( image != this.vars.image )
		{
			this.vars.image = image;
			if ( fromInstruction )
				this.set_fromInstruction( { image: image }, fromInstruction )
			this.setModified();
		}
	}
};
AOZ.prototype.setGenericCoordinates = function( name, rectangle, fromInstruction )
{
	var modified = false;
	var updated = {};
	if ( typeof rectangle.x != 'undefined' )
	{
		if ( rectangle.x != this.vars[ name + 'X' ] )
		{
			modified = true;
			this.vars[ name + 'X' ] = rectangle.x;
			updated[ name + 'X' ] = rectangle.x;
		}
	}
	if ( typeof rectangle.y != 'undefined' )
	{
		if ( rectangle.y != this.vars[ name + 'Y' ] )
		{
			modified = true;
			this.vars[ name + 'Y' ] =  rectangle.y;
			updated[ name + 'Y' ] = rectangle.x;
		}
	}
	if ( typeof rectangle.z != 'undefined' )
	{
		if ( rectangle.z != this.vars[ name + 'Z' ] )
		{
			modified = true;
			this.varsthis.vars[ name + 'Z' ] =  rectangle.z;
			updated[ name + 'Z' ] = rectangle.x;
		}
	}
	if ( modified )
	{
		if ( fromInstruction )
			this.set_fromInstruction( updated, fromInstruction );
		this.setModified();
	}
};
AOZ.prototype.setGenericProperty = function( name, value, fromInstruction )
{
	if ( value != this.vars[ name  ] )
	{
		this.vars[ name ] = value;
		if ( fromInstruction )
		{
			var updated = {};
			updated[ name ] = value;
			this.set_fromInstruction( updated, fromInstruction );
		}
		this.setModified();
	}
};
AOZ.prototype.destroy = function()
{
	this.parent.parent.destroy( this );
};

// METHODS
AOZ.prototype.m_position = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		x: args[ 0 ],
		y: args[ 1 ],
		z: args[ 2 ]
	};
	this.blocks=
	[
		function( aoz, vars )
		{
			this.parent.setPosition( { x: vars.x, y: vars.y, z: vars.z }, '#update' );
			return{ type:0 }
		}
	]
};
AOZ.prototype.m_hotspot = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		x: args[ 0 ],
		y: args[ 1 ],
		z: args[ 2 ]
	};
	this.blocks=
	[
		function( aoz, vars )
		{
			this.parent.setHotspot( { x: vars.x, y: vars.y, z: vars.z }, '#update' );
			return{ type:0 }
		}
	]
};
AOZ.prototype.m_scale = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		x: args[ 0 ],
		y: args[ 1 ],
		z: args[ 2 ]
	};
	this.blocks=
	[
		function( aoz, vars )
		{
			this.parent.setScale( { x: vars.x, y: vars.y, z: vars.z }, '#update' );
			return{ type:0 }
		}
	]
};
AOZ.prototype.m_rotate = function( aoz, parent, args)
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		angle: args[ 0 ]
	};
	this.blocks=
	[
		function( aoz, vars )
		{
			this.parent.setAngle( { x: 0, y: 0, z: vars.angle * aoz.degreeRadian }, '#update' );
			return { type:0 }
		}
	]
};
AOZ.prototype.m_skew = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		x: args[ 0 ],
		y: args[ 1 ],
		z: args[ 2 ],
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setSkew( { x: vars.x, y: vars.y, z: vars.z }, '#update' );
			return { type:0 };
		}
	]
};
AOZ.prototype.m_offset = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		x: args[ 0 ],
		y: args[ 1 ],
		z: args[ 2 ],
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setOffset( { x: vars.x, y: vars.y, z: vars.z }, '#update' );
			return { type:0 };
		}
	]
};
AOZ.prototype.m_size = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		width: args[ 0 ],
		height: args[ 1 ],
		depth: args[ 2 ],
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setSize( { x: vars.width, y: vars.height, z: vars.depth }, '#update' );
			return { type:0 };
		}
	]
};
AOZ.prototype.m_visible = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent=parent;
	this.vars =
	{
		value: args[ 0 ],
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setVisible( vars.value, '#update' );
			return{type:0}
		}
	]
};
AOZ.prototype.m_hide = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent=parent;
	this.vars.fromInstruction = args[ 0 ];
	this.vars =
	{
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setVisible( false, '#update' );
			return{type:0}
		}
	]
};
AOZ.prototype.m_show = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setVisible( true, '#update' );
			return { type:0 }
		}
	]
};
AOZ.prototype.m_destroy = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars = args;
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.parent.destroy( this.parent.index );
			return { type:0 }
		}
	]
};
AOZ.prototype.m_transparency = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		transparency: args[ 0 ],
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setAlpha( vars.transparency, '#update' );
			return { type:0 }
		}
	]
};
AOZ.prototype.m_image = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		image: args[ 0 ]
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setImage( vars.image, '#update' );
			return { type:0 }
		}
	]
};
AOZ.prototype.m_camera = function( aoz, parent, args )
{
	this.aoz = aoz;
	this.parent = parent;
	this.vars =
	{
		camera: args[ 0 ]
	};
	this.blocks =
	[
		function( aoz, vars )
		{
			this.parent.setCamera( vars.camera, '#update' );
			return { type:0 }
		}
	]
};
AOZ.prototype.setModified = function()
{
	this.modified++;
};
AOZ.prototype.turnIntoObject = function( objet, setters, methods, replacements )
{
	var list =
	{
		x: { g: this.get_x, s: this.set_x },
		y: { g: this.get_y, s: this.set_y },
		z: { g: this.get_z, s: this.set_z },
		angle: { g: this.get_angle, s: this.set_angle },
		width: { g: this.get_width, s: this.set_width },
		height: { g: this.get_height, s: this.set_height },
		depth: { g: this.get_depth, s: this.set_depth },
		scaleX: { g: this.get_scaleX, s: this.set_scaleX },
		scaleY: { g: this.get_scaleY, s: this.set_scaleY },
		scaleZ: { g: this.get_scaleZ, s: this.set_scaleZ },
		hotspotX: { g: this.get_hotspotX, s: this.set_hotspotX },
		hotspotY: { g: this.get_hotspotY, s: this.set_hotspotY },
		hotspotZ: { g: this.get_hotspotZ, s: this.set_hotspotZ },
		offsetX: { g: this.get_offsetX, s: this.set_offsetX },
		offsetY: { g: this.get_offsetY, s: this.set_offsetY },
		offsetZ: { g: this.get_offsetZ, s: this.set_offsetZ },
		skewX: { g: this.get_skewX, s: this.set_skewX },
		skewY: { g: this.get_skewY, s: this.set_skewY },
		skewZ: { g: this.get_skewZ, s: this.set_skewZ },
		cameraX: { g: this.get_cameraX, s: this.set_cameraX },
		cameraY: { g: this.get_cameraY, s: this.set_cameraY },
		cameraZ: { g: this.get_cameraZ, s: this.set_cameraZ },
		shadowX: { g: this.get_shadowX, s: this.set_shadowX },
		shadowY: { g: this.get_shadowY, s: this.set_shadowY },
		shadowBlur: { g: this.get_shadowBlur, s: this.set_shadowBlur },
		shadowColor: { g: this.get_shadowColor, s: this.set_shadowColor },
		image: { g: this.get_image, s: this.set_image },
		visible: { g: this.get_visible, s: this.set_visible },
		alpha: { g: this.get_alpha, s: this.set_alpha },
	};
	var listMethods =
	{
		x: { m_position: this.m_position, setPosition: this.setPosition },
		angle: { m_rotate: this.m_rotate, setAngle: this.setAngle },
		width: { m_size: this.m_size, setSize: this.setSize },
		hotspotX: { m_hotspot: this.m_hotspot, setHotspot: this.setHotspot },
		scaleX: { m_scale: this.m_scale, setScale: this.setScale },
		offsetX: { m_offset: this.m_offset, setOffset: this.setOffset },
		cameraX: { m_camera: this.m_camera, setCamera: this.setCamera },
		skewX: { m_skew: this.m_skew, setSkew: this.setSkew },
		alpha: { m_transparency: this.m_transparency, setAlpha: this.setAlpha },
		shadowX: { m_shadow: this.m_shadow, setShadow: this.setShadow },
		image: { m_image: this.m_image, setImage: this.setImage },
		visible: { m_show: this.m_show, m_hide: this.m_hide, setVisible: this.setVisible },
		index: { m_destroy: this.m_destroy, destroy: this.destroy },
	};

	objet.objectNumber = this.objectCount++;

	replacements = typeof replacements == 'undefined' ? {} : replacements;
	putSetters( objet, list, replacements );
	if ( setters )
		putSetters( objet, setters );

	putMethods( objet, listMethods, replacements );
	if ( methods )
		putMethods( objet, methods );

	if ( typeof objet.setModified == 'undefined' )
		objet.setModified = function() { this.modified = true; };
	objet.set_fromInstruction = this.set_fromInstruction;
	objet.get_fromInstruction = this.get_fromInstruction;

	function putSetters( obj, lst, replacements )
	{
		for ( var p in lst )
		{
			var prop = lst[ p ];
			if ( typeof obj.vars[ p ] != 'undefined' )
			{
				if ( replacements[ p ] )
				{
					obj[ 'get_' + p ] = replacements[ p ].getter;
					obj[ 'set_' + p ] = replacements[ p ].setter;
				}
				else
				{
					obj[ 'get_' + p ] = prop.g;
					obj[ 'set_' + p ] = prop.s;
				}
			}
		}
	};
	function putMethods( obj, lst, replacements )
	{
		for ( var m in lst )
		{
			if ( typeof obj.vars[ m ] != 'undefined' )
			{
				for ( var mm in lst[ m ] )
				{
					if ( replacements[ mm ] )
						obj[ mm ] = replacements[ mm ];
					else
						obj[ mm ] = lst[ m ][ mm ];
				}
			}
		}
	}
};

AOZ.prototype.isUnderAtom = function( callback, extra )
{
	if ( this.ext_debugging )
	{
		if ( this.ext_debugging.debugEvents && this.ext_debugging.debugEvents.isConnected() )
		{
			this.underAtom = true;
			callback( true, {}, extra );
			return true;
		}
		}

			var self = this;
			var timeout = new Date().getTime() + 10 * 1000;
			var handle = setInterval( function()
			{
		if ( self.ext_debugging && self.ext_debugging.debugEvents && self.ext_debugging.debugEvents.isConnected() )
				{
					clearInterval( handle );
					self.underAtom = true;
					callback( true, {}, extra );
				}
				var now = new Date().getTime();
				if ( now > timeout )
				{
					self.underAtom = false;
					clearInterval( handle );
					callback( false, {}, extra );
				}
			}, 20 );
	return undefined;
};
AOZ.prototype.callAtomApi = function( command, args, callback, extra )
{
	if ( this.underAtom )
	{
		args.command = command;
		this.ext_debugging.debugEvents.sendMessage(
		{
			module: 'debugger',
			method: 'callAtomApi',
			options: args
		}, function( response )
		{
			callback( true, response.result, extra );
		} );
		return;
	}
	callback( false, {}, extra );
};
AOZ.prototype.callAtomDos = function( command, args, callback, extra )
{
	if ( this.underAtom )
	{
		args.command = command;
		this.ext_debugging.debugEvents.sendMessage(
		{
			module: 'debugger',
			method: 'callAtomDos',
			options: args
		}, function( response )
		{
			callback( true, response.result, extra );
		} );
		return;
	}
	callback( false, {}, extra );
};
AOZ.prototype.loadJavascript = function( fileList, options, callback, extra )
{
	var errors = [];
	var loaded = 0;
	var toLoad = fileList.length;
	var self = this;
	var loadFile = function loadJavascriptFile( number )
	{
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		var ext = self.utilities.getFilenameExtension( fileList[ number ] ).toLowerCase();
		if ( ext == 'css' )
		{
			var link = document.createElement( 'link' );
			link.setAttribute( 'type', 'text/css' );
			link.setAttribute( 'rel', 'stylesheet' );
			link.setAttribute( 'href', fileList[ number ] );
			link.onload = function ()
			{
				console.log( 'Loaded CSS code: ' + fileList[ number ] );
	
				loaded++;
				number++;
				if ( number < toLoad )
					loadFile( number );
			};
			link.onerror = function ()
			{
				console.log( 'Error loading CSS code: ' + fileList[ number ] );
	
				errors.push( fileList[ i ] );
				loaded++;
				number++;
				if ( number < toLoad )
					loadFile( number );
			};
			document.getElementsByTagName( "head" )[ 0 ].appendChild( link );
		}
		else
		{
		script.src = fileList[ number ];
		script.onload = function ()
		{
			console.log( 'Loaded Javascript code: ' + fileList[ number ] );

			loaded++;
			number++;
			if ( number < toLoad )
				loadFile( number );
		};
		script.onerror = function ()
		{
			console.log( 'Error loading Javascript code: ' + fileList[ number ] );

			errors.push( fileList[ i ] );
			loaded++;
			number++;
			if ( number < toLoad )
				loadFile( number );
		};
		document.body.appendChild( script );
	}
	}

	var task = this.currentTask;
	task.paused = true;

	var start = new Date().getTime();
	loadFile( 0 );
		
	var self = this;
	var handle = setInterval( function()
	{
		if ( loaded == toLoad )
		{
			clearInterval( handle );
			task.paused = false;
			var time = new Date().getTime() - start;
			if ( errors.length == 0 )
			{
				console.log( "loaded javascript!" );
				callback( true, { time: time }, extra );
			}
			else
			{				
				callback( false, { time: time, errors: errors }, extra );
			}
			return;
		}
	}, 20 );
};

