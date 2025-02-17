var actor_module = undefined;
var act_start = undefined;
var act_start_down = Date.now();

navigator.getMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

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

/**
 * Retourne la positionX/Y du hotspot 
 * @param {*} actor 
 */
function getHotspot( actor )
{
	if( actor_module == undefined )
	{
		return;
	}

	if( actor )
	{
		var pos = 
		{
			x: actor.HotspotX,
			y: actor.HotspotY
		}
		
		var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
		var bob = actor_module.aoz.currentScreen.getBob( actor.Id );
		if( bob == undefined || bob == null )
		{
			return;
		}

		if( actor.Hotspot && actor.Hotspot.trim() != '' && bob.imageObject )
		{
			switch( actor.Hotspot.trim().toLowerCase() )
			{
				
					case 'none':
						actor.HotspotX = ( actor.HotspotX == -1001) ? 0 : actor.HotspotX;
						actor.HotspotY = ( actor.HotspotY == -1001) ? 0 : actor.HotspotY;
						break;
					case 'top-left':
					case 'left-top':
					case '$00':
						actor.HotspotX = 0;
						actor.HotspotY = 0;
						break;
		
					case 'top-middle':
					case 'middle-top':
					case '$10':
						actor.HotspotX = bob.imageObject.width / 2;
						actor.HotspotY = 0;
						break;	
						
					case 'top-right':
					case 'right-top':
					case '$20':
						actor.HotspotX = bob.imageObject.width;
						actor.HotspotY = 0;
						break;
		
					case 'left':
					case '$01':
						actor.HotspotX = 0;
						actor.HotspotY = bob.imageObject.height / 2;
						break;
		
					case 'middle':
					case '$11':
						actor.HotspotX = bob.imageObject.width / 2;
						actor.HotspotY = bob.imageObject.height / 2;
						break;	
						
					case 'right':
					case '$21':
						actor.HotspotX = bob.imageObject.width;
						actor.HotspotY = bob.imageObject.height / 2;
						break;
		
					case 'bottom-left':
					case 'left-bottom':
					case '$20':
						actor.HotspotX = 0;
						actor.HotspotY = bob.imageObject.height;
						break;
		
					case 'bottom-middle':
					case 'middle-bottom':
					case '$21':
						actor.HotspotX = bob.imageObject.width / 2;
						actor.HotspotY = bob.imageObject.height;
						break;	
						
					case 'bottom-right':
					case 'right-bottom':
					case '$22':
						actor.HotspotX = bob.imageObject.width;
						actor.HotspotY = bob.imageObject.height;
						break;
			}
		}
	}
	actor.updated = false;
	pos.x = actor.HotspotX;
	pos.y = actor.HotspotY;
	return pos;
}

function copyActorImage( actor, imageName )
{
	var self = actor_module;
	if( self == undefined )
	{
		return;
	}

	if( imageName )
	{

		var bank = application.aoz.banks.getBank( undefined, undefined, 'images' );
		var imageSrc = undefined;
		var imageCopy = undefined;
		try
		{
			imageSrc = bank.getElement( imageName, application.aoz.currentContextName, undefined );
		}
		catch( e )
		{
			imageSrc = undefined;
		}
		
		if( imageSrc == undefined || imageSrc.canvas == undefined || imageSrc.canvas.width == 0 || imageSrc.canvas.width == 0 )
		{
			return;
		}

		try
		{
			imageCopy = bank.getElement( actor.Id + '_img', application.aoz.currentContextName, undefined );
		}
		catch( e )
		{
			imageCopy = undefined;
		}

		if ( imageCopy == undefined )
		{
			bank.add( actor.Id + '_img' );
			var canvas = document.createElement( 'canvas' );
			canvas.width = imageSrc.with;
			canvas.height = imageSrc.height;
			bank.setElement( actor.Id + '_img', canvas );
		}

		var w = imageSrc.width;
		var h = imageSrc.height;
		imageCopy = bank.getElement( actor.Id + '_img' );
		imageCopy.width = w;
		imageCopy.height = h;
		imageCopy.canvas.width = w;
		imageCopy.canvas.height = h;
		var ctx = imageCopy.canvas.getContext( '2d' );
		if( application.aoz.manifest.display.smoothing )
		{
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
		}
		ctx.clearRect( 0, 0, w, h );
		ctx.drawImage( imageSrc.canvas, 0, 0, w, h );
		
		var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
		var bob = actor_module.aoz.currentScreen.getBob( actor.Id );
		if( bob == undefined || bob == null )
		{
			return;
		}		

		var pos = getHotspot( actor );
		imageCopy.hotSpotX = actor.HotspotX; 
		imageCopy.hotSpotY = actor.HotspotY; 

		//bob.set( {x: actor.X, y: actor.Y }, actor.Id + '_img', '#update' );
		bob.imageObject = imageCopy;
		bob.vars.hRev = actor.HRev;
		bob.vars.vRev = actor.VRev;	
		self.aoz.currentScreen.setModified();
		self.aoz.currentScreen.bobsToUpdate = true;
		bob.vars.modified = true;
		bob.updateCollisionData();
		bob.toUpdateCollisions = true;
		bob.update( { force: true } );
	}
	actor.updated = false;
};

function getActorEvent( type, actor, params )
{
	var options = 
	{
		EVENT$: type,
		INDEX: ( !isNaN( actor.Id ) ) ? actor.Id : -1,
		INDEX$: ( isNaN( actor.Id ) ) ? actor.Id : '',
		X: actor.Y,
		Y: actor.Y,
		Z: actor.Z,
		IMAGE: ( !isNaN( actor.Image ) ) ? actor.Image : -1,
		IMAGE$: ( isNaN( actor.Image ) ) ? actor.Image : '',
		ANIM$: ( actor.Anim != "-255" ) ? actor.Anim : "",
		FRAME: ( actor.currentAnimFrame ) ? actor.currentAnimFrame : 0,
		TOTALFRAMES: ( actor.currentAnimation && actor.currentAnimation.frames ) ? actor.currentAnimation.frames.length : 0,
		GROUP$: ( actor.Group ) ? actor.Group : "",
		VISIBLE: actor.Visible,
		ENABLE: actor.Enable,
		USERDATA$: ( actor.userData != '-1001.1' ) ? actor.userData : ''
	};

	if( params )
	{
		for( var key in params )
		{
			options[ key ] = params[ key ];
		}
	}
	return options;
};

function actor_mouseevent( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	var memActor = undefined;
	if( self.mouseActor.actor && ( event.type == 'mousemove' || event.type == 'touchmove' ) )
	{
		memActor = self.mouseActor.actor;
	}
	
	var tm = 500;
	if( event.type == 'mousedown' || event.type == 'touchstart' )
	{
		self.mouseDelay = Date.now();
		self.lastButtonDown = ( event.type == 'touchstart' ) ? 1 : event.buttons;
	}

	if( event.type == 'mouseup' || event.type == 'touchend')
	{
		if( self.mouseDelay )
		{
			tm = Date.now() - self.mouseDelay;
		}
	}
	
	self.mouseActor.actor = actor_getActorMouse();
	if( self.mouseActor.actor )
	{
		var btn = ( self.lastButtonDown ) ? self.lastButtonDown : event.buttons;
		if( event.type == 'mousemove' )
		{
			btn = event.buttons;
		}

		var options =
		{
			EVENT$: ( event.type != 'click' ) ? event.type : 'mouseclick',
			INDEX: ( isNaN( self.mouseActor.actor.Id ) )? -1 : self.mouseActor.actor.Id,
			INDEX$: "" + self.mouseActor.actor.Id,
			BUTTON: btn,
			X: self.aoz.getXMouse(),
			Y: self.aoz.getYMouse(),
			LOCAL_X: self.aoz.getXMouse() - self.mouseActor.actor.X,
			LOCAL_Y: self.aoz.getYMouse() - self.mouseActor.actor.Y
		};

		options = getActorEvent( options.EVENT$, self.mouseActor.actor, options );

		self.keys[ "mouseleft" ] = false;
		self.keys[ "mouseright" ] = false;
		self.keys[ "mousemiddle" ] = false;
		
		btn = event.buttons;
		if( btn == 1 || event.type == 'touchstart' ) self.keys[ "mouseleft" ] = true;
		if( btn == 2 ) self.keys[ "mouseright" ] = true;
		if( btn == 4 ) self.keys[ "mousemiddle" ] = true;

		if( self.mouseActor.actor.OnMouse && self.mouseActor.actor.OnMouse.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouse, options, self.mouseActor.actor );
		}

		switch( event.type )
		{
			case 'mousedblclick':
				if( self.mouseActor.actor.OnMouseDblClick && self.mouseActor.actor.OnMouseDblClick.trim() != '' )
				{
					event.stopPropagation();
					application.aoz.runProcedure( self.mouseActor.actor.OnMouseDblClick, options, self.mouseActor.actor );
				}
				break;

			case 'mousedown':
			case 'touchstart':
				if( self.mouseActor.actor.OnMouseDown && self.mouseActor.actor.OnMouseDown.trim() != '' )
				{
					event.stopPropagation();
					application.aoz.runProcedure( self.mouseActor.actor.OnMouseDown, options, self.mouseActor.actor );
				}				
				break;

			case 'mouseup':
			case 'touchend':
				if( tm > 500 && self.mouseActor.actor.OnMouseUp && self.mouseActor.actor.OnMouseUp.trim() != '' )
				{
					event.stopPropagation();
					self.lastButtonDown = undefined;
					application.aoz.runProcedure( self.mouseActor.actor.OnMouseUp, options, self.mouseActor.actor );
					return;
				}			
				if( tm < 500 && self.mouseActor.actor.OnMouseClick && self.mouseActor.actor.OnMouseClick.trim() != '' )
				{
					event.stopPropagation();
					options.EVENT$ = "mouseclick";
					self.lastButtonDown = undefined;
					application.aoz.runProcedure( self.mouseActor.actor.OnMouseClick, options, self.mouseActor.actor );
				}				

				break;

			case 'mousemove':
			case 'touchmove':
				if( memActor )
				{
					if( memActor.Id == self.mouseActor.actor.Id )
					{
						return;
					}
					else
					{
						if( memActor.OnMouseExit && memActor.OnMouseExit.trim() != '' )
						{
							event.stopPropagation();
							options.EVENT$ = 'mousexit';
							application.aoz.runProcedure( memActor.OnMouseExit, options, self.mouseActor.actor );
						}
		
						if( self.mouseActor.actor.OnMouseEnter && self.mouseActor.actor.OnMouseEnter.trim() != '' )
						{
							event.stopPropagation();
							options.EVENT$ = 'mouseenter';
							application.aoz.runProcedure( self.mouseActor.actor.OnMouseEnter, options,self.mouseActor.actor )
						}
					}
				}
				else
				{
					if( self.mouseActor.actor.OnMouseEnter && self.mouseActor.actor.OnMouseEnter.trim() != '' )
					{
						event.stopPropagation();
						options.EVENT$ = 'mouseenter';
						application.aoz.runProcedure( self.mouseActor.actor.OnMouseEnter, options,self.mouseActor.actor )
					}
				}
				break;
			}
	}
	else
	{
		if( memActor )
		{
			var btn = ( self.lastButtonDown ) ? self.lastButtonDown : event.buttons;
			var options =
			{
				EVENT$: event.type,
				INDEX: ( isNaN( memActor.Id ) )? -1 : memActor.Id,
				INDEX$: "" + memActor.Id,
				BUTTON: btn,
				X: self.aoz.getXMouse(),
				Y: self.aoz.getYMouse(),
				LOCAL_X: self.aoz.getXMouse() - memActor.X,
				LOCAL_Y: self.aoz.getYMouse() - memActor.Y
			};	

			if( memActor.OnMouse && memActor.OnMouse.trim() != '' )
			{
				application.aoz.runProcedure( memActor.OnMouse, options, memActor );
			}

			if( memActor.OnMouseExit && memActor.OnMouseExit.trim() != '' )
			{
				event.stopPropagation();
				options.EVENT$ = 'mouseexit';
				application.aoz.runProcedure( memActor.OnMouseExit, options, memActor )
			}			
		}		
	}
};

function actor_keyevent( event, actor, type )
{
	var options =
	{
		EVENT$: type,
		INDEX: ( isNaN( actor.Id ) )? -1 : Id,
		INDEX$: "" + actor.Id,
		KEYCODE$: event.key,
		CHARCODE$: event.charCode,
		ALT: event.altKey,
		SHIFT: event.shiftKey,
		CTRL: event.ctrlKey,
		META: event.metaKey		
	};
	options = getActorEvent( options.EVENT$, actor, options );
	return options;
};

function actor_applykey( event, type )
{
	var self = actor_module;
	if( self == undefined || self == null || self.bobParams == undefined || self.bobParams == null )
	{
		return;
	}
	
	for( var b = self.childrens.length - 1; b > -1 ; b-- )
	{
		var param =  self.bobParams[ self.childrens[ b ] ];
		if( param && param.Visible && param.Enable )
		{
			if( type == 'keypress' && param.OnKeyPress && param.OnKeyPress.trim() != '' )
			{
				var options = actor_keyevent( event, param, type );
				application.aoz.runProcedure( param.OnKeyPress, options, param );
			}

			if( type == 'keydown' && param.OnKeyDown && param.OnKeyDown.trim() != '' )
			{
				var options = actor_keyevent( event, param, type );
				application.aoz.runProcedure( param.OnKeyDown, options, param );
			}

			if( type == 'keyup' && param.OnKeyUp && param.OnKeyUp.trim() != '' )
			{
				var options = actor_keyevent( event, param, type );
				application.aoz.runProcedure( param.OnKeyUp, options, param );
			}					
		}
	}
};

function actor_initialize( module )
{
	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	requestAnimationFrame( actor_animate );

	module.utilities = application.aoz.utilities;
	module.banks = application.aoz.banks;
	module.keys = {};
	module.evtKeys = {};
	module.gamepads = {};
	module.tmDelay = 0;
	module.childrens = new Array();
	module.mouseOnActor = false;
	module.mouseDelay = Date.now();
	
	// Create JS
	module.stage = undefined;
	module.canvas = undefined;
	createjs.RelativePlugin.install();
	createjs.MotionGuidePlugin.install();
	createjs.RotationPlugin.install();

	module.canvas = document.createElement( 'canvas' );
	module.canvas.setAttribute( 'id', 'cjsCanvas' );
	module.canvas.width = module.aoz.manifest.default.screen.width;
	module.canvas.height = module.aoz.manifest.default.screen.height;
	module.canvas.setAttribute( 'style', 'position: absolute; left: 0px; top: 0px; display: block; width: ' + module.aoz.currentScreen.dimension.width + "px; height: " +
	module.aoz.currentScreen.dimension.height + "px" );
	module.bobParams = {};
	module.createjs = createjs;
	
	module.stage = new module.createjs.Stage( "cjsCanvas" );
	module.createjs.Ticker.interval = 1;
	module.createjs.Ticker.timingMode = module.createjs.Ticker.RAF_SYNCHED;
	module.createjs.Ticker.framerate = 60;
	module.createjs.Ticker.init();

	// Physic 2D
	module.physicEnable = false;
	module.physicWireframe = false;
	
	Matter.use('matter-springs');
	Matter.use('matter-collision-events');
	
	module.Engine = Matter.Engine;
	module.Render = Matter.Render;
	module.Runner = Matter.Runner;
	module.Bodies = Matter.Bodies;
	module.Composite = Matter.Composite;
	module.World = Matter.World;
    module.Composites = Matter.Composites;
    module.Common = Matter.Common;
    module.MouseConstraint = Matter.MouseConstraint;
    module.Mouse = Matter.Mouse;
	module.Events = Matter.Events;
	module.Body = Matter.Body;
	
	module.physicEngine = module.Engine.create();
	module.physicRender = module.Render.create(
	{
		element: document.getElementById( 'AOZCanvas' ),
		engine: module.physicEngine,
		options: 
		{
			width: document.getElementById( 'AOZCanvas' ).width,
			height: document.getElementById( 'AOZCanvas' ).height,
			enabled: true,
			pixelRatio: 1,
			showCollisions: true
		}
	} );

	module.Render.lookAt( module.physicRender,
	{
        min: { x: 0, y: 0 },
        max: { x: document.getElementById( 'AOZCanvas' ).width, y: document.getElementById( 'AOZCanvas' ).height }
    } );
	module.physicRunner = undefined;
	
	module.mouse = module.Mouse.create( module.physicRender.canvas );
    module.mouseConstraint = module.MouseConstraint.create( module.physicEngine,
	{
		mouse: module.mouse,
        constraint:
		{
			stiffness: 0.2,
            render:
			{
				visible: false
            }
        }
    } );

	module.mouseActor =
	{
		actor: undefined
	};

	module.tmHandle = undefined;
	var stage = new createjs.Stage("c");
	module.tmMouseOnActor = undefined;
	module.mouseOnActor = false;
	module.paused = false;

	actor_module = module;

	window.addEventListener( "gamepadconnected", function( e )
	{
		var self = actor_module;
		if( self == undefined || self == null )
		{
			return;
		}
		
		if ( !self.paused )
			actor_gamepadHandler( e, true );
	}, false );

	window.addEventListener( "gamepaddisconnected", function( e )
	{
		var self = actor_module; 
		if( self == undefined || self == null )
		{
			return;
		}
		
		if ( !self.paused )
			actor_gamepadHandler( e, false );
	}, false );

	window.addEventListener( 'keypress', function( event )
	{
		var self = actor_module;
		if( self == undefined || self == null )
		{
			return;
		}
		
		actor_applykey( event, 'keypress' );
		if( event != undefined && event.code != undefined )
		{	
			if ( !self.paused )
				self.keys[ event.code.toLowerCase() ] = event;
				
		}
	}, true );

	window.addEventListener( 'keydown', function( event )
	{
		var self = actor_module;
		if( self == undefined || self == null )
		{
			return;
		}

		actor_applykey( event, 'keydown' );	
		if( event != undefined && event.code != undefined )
		{	
			if ( !self.paused )
				self.keys[ event.code.toLowerCase() ] = event;

		}
	}, true );

	window.addEventListener( 'keyup', function( event )
	{
		var self = actor_module;
		if( self == undefined || self == null )
		{
			return;
		}

		actor_applykey( event, 'keyup' );		
		if( event != undefined && event.code != undefined )
		{
			if ( !self.paused )
				self.keys[ event.code.toLowerCase() ] = false;
		}
	}, true );

	window.addEventListener( 'dblclick', function( event )
	{
		actor_mouseevent( event );
	}, false );

	window.addEventListener( 'click', function( event )
	{
		actor_mouseevent( event );
	}, false );

	window.addEventListener( 'mousedown', function( event )
	{
		actor_mouseevent( event );
	}, false );

	window.addEventListener( 'mouseup', function( event )
	{
		actor_mouseevent( event );
	}, false );

	window.addEventListener( 'mousemove', function( event )
	{
		actor_mouseevent( event );
	}, false );

	if( 'ontouchstart' in window )
	{
		window.addEventListener( 'touchstart', function( event )
		{
			actor_mouseevent( event );
		}, false );

		window.addEventListener( 'touchmove', function( event )
		{
			actor_mouseevent( event );
		}, false );

		window.addEventListener( 'touchend', function( event )
		{
			actor_mouseevent( event );
		}, false );
	}
};

function actor_gamepadHandler( event, connecting )
{
	var gamepad = event.gamepad;
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( connecting )
	{
		self.gamepads[ gamepad.index ] = gamepad;
	}
	else
	{
		delete self.gamepads[ gamepad.index ];
	}
};

function actor_pauseAnimations( onOff )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( onOff != self.paused )
	{
		self.createjs.Ticker.paused = onOff;
		self.paused = onOff;
		self.aoz.screensContext.parseAll( undefined, function( screen )
		{
			screen.bobsContext.parseAll( undefined, function( bob )
			{
				if ( bob.tween )
					bob.tween.timeScale = ( onOff ? 0 : 1 );
			} );
		} );
	}
};

function actor_animate( timestamp )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		requestAnimationFrame( actor_animate );
		return;
	}

	if( self.aoz && self.aoz.break )
	{
		actor_pauseAnimations( true );		
		return;
	}

	if( self.childrens != undefined && self.childrens.length > 0 )
	{
		for( var ac = 0; ac < self.childrens.length; ac++ )
		{
			if ( !self.paused )
				actor_keyLoop( ac );
		}
	}
	requestAnimationFrame( actor_animate );
};
	
function actor_activePhysic2D()
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( self.aoz && self.aoz.break )
	{
		return;
	}

	if( !self.physicEnable )
	{
	
		self.physicEnable = true;
		self.Render.run( self.physicRender );	
		
		self.physicRunner = self.Runner.create();
		self.Runner.run( self.physicRunner, self.physicEngine );
		
		self.Events.on( self.physicEngine.world, 'afterAdd', function( event )
		{
		} );

		self.Events.on( self.physicEngine, 'beforeUpdate', function( event )
		{
		} );

		self.Events.on( self.physicEngine, 'collisionStart', function( event )
		{
			var pairs = event.pairs;
			// change object colours to show those starting a collision
			for( var i = 0; i < pairs.length; i++ )
			{
				var pair = pairs[ i ];
				pair.bodyA.render.fillStyle = '#333';
				pair.bodyB.render.fillStyle = '#333';
			}
		} );
		
		self.Events.on( self.physicEngine, 'collisionActive', function( event )
		{
			var pairs = event.pairs;
			// change object colours to show those starting a collision
			for( var i = 0; i < pairs.length; i++ )
			{
				var pair = pairs[ i ];
				pair.bodyA.render.fillStyle = '#333';
				pair.bodyB.render.fillStyle = '#333';
			}
		} );
		
		self.Events.on( self.physicEngine, 'collisionEnd', function( event )
		{
			var pairs = event.pairs;

			// change object colours to show those starting a collision
			for( var i = 0; i < pairs.length; i++ )
			{
				var pair = pairs[ i ];
				pair.bodyA.render.fillStyle = '#222';
				pair.bodyB.render.fillStyle = '#222';
			}
		} );

		self.physicRender.mouse = self.mouse;

		// an example of using mouse events on a mouse
		self.Events.on( self.mouseConstraint, 'mousedown', function( event )
		{
			var mousePosition = event.mouse.position;
			console.log( 'mousedown at ' + mousePosition.x + ' ' + mousePosition.y );
		});

		// an example of using mouse events on a mouse
		self.Events.on( self.mouseConstraint, 'mouseup', function( event )
		{
			var mousePosition = event.mouse.position;
			console.log( 'mouseup at ' + mousePosition.x + ' ' + mousePosition.y );
		} );

		// an example of using mouse events on a mouse
		self.Events.on( self.mouseConstraint, 'startdrag', function( event )
		{
			console.log( 'startdrag', event );
		} );

		// an example of using mouse events on a mouse
		self.Events.on( self.mouseConstraint, 'enddrag', function( event )
		{
			console.log( 'enddrag', event );
		} );			
	}
};

function actor_setGravity( options )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	self.physicEngine.world.gravity = { x: options.x, y: options.y };
};

function actor_getActorMouse()
{
	var actor = undefined;
	var self = actor_module;
	self.mouseOnActor = false;
	if( self == undefined || self == null )
	{
		return;
	}
	
	var cx = self.aoz.getXMouse();
	var cy = self.aoz.getYMouse();	
	
	for( var b = self.childrens.length - 1; b > -1 ; b-- )
	{
		var param =  self.bobParams[ self.childrens[ b ] ];
		if( param && param.Visible && param.Enable )
		{
			var bob2 = self.aoz.currentScreen.getBob( param.Id );
			
			if( bob2 != undefined && bob2 != null ){
				var bobZone = 
				{
					x: bob2.vars.x - ( param.HotspotX * param.ScaleX ),
					y: bob2.vars.y - ( param.HotspotY * param.ScaleY ),
					width: bob2.imageObject.width * param.ScaleX,
					height: bob2.imageObject.height * param.ScaleY
				}

				if( cx > ( bobZone.x - 1 ) && cx < ( bobZone.x + bobZone.width ) && cy > ( bobZone.y - 1 ) && cy < ( bobZone.y + bobZone.height ) )
				{
					actor = self.bobParams[ self.childrens[ b ] ];
					self.mouseOnActor = true;
					break;
				}
			}
		}
	}
	return actor;
};

function generateTextImage( actor, callback )
{
	if( actor == undefined || actor.FontName == undefined || actor.FontName.trim() == '' || actor.Text == undefined )
	{
		return;
	}

	if( actor.Image && actor.memImage == undefined )
	{
		actor.memImage = actor.Image;
	}
	
	var actImage = undefined;
	var bank = application.aoz.banks.getBank( undefined, undefined, 'images' );

	if( actor.memImage )
	{
		try
		{
			actImage = bank.getElement( actor.memImage, application.aoz.currentContextName, undefined );
		}
		catch( e )
		{
			throw "image_not_found";
		}
	}	

	var name = ( isNaN( actor.FontName ) ) ? actor.FontName.toLowerCase() : actor.FontName;
	if( name == '-255.0001' )
	{
		name = 'fnt_default';
	}
	const getCharacterPos = function( numAscii, img )
	{
		var point =
		{
			x: 0, y: 0
		}

		var fontWidth = img.width / 16;
		var fontHeight = img.height / 14;

		var numCols = 16;//Math.round( img.width / 96 );
		numAscii = numAscii - 32;
		point.y = ( numAscii < numCols ) ? 0 : Math.floor( numAscii / numCols );
		point.x = numAscii - ( point.y * numCols );
		point.y = point.y * fontHeight;
		point.x = point.x * fontWidth;		
		return point;
	}

	var img = undefined;
	try
	{
		img = bank.getElement( name, application.aoz.currentContextName, undefined );
	}
	catch( err )
	{
		throw "image_font_not_found";
	}

	img = img.canvas;
	var size = actor.FontSize;
	var fontWidth = img.width / 16;
	var fontHeight = img.height / 14;
	if( size == undefined || size == -1 )
	{
		size = 100;
	}
	else
	{
		size = ( 100 / fontWidth ) * size;
	}

	var canvas = document.createElement( 'canvas' );
	var lines = actor.Text.split( '|' );
	var lastWidth = 0;
	if( lines )
	{
		for( var l = 0; l < lines.length; l++ )
		{
			lines[ l ] = lines[ l ].strReplace( '(c)', '©' );
			lines[ l ] = lines[ l ].strReplace( '(r)', '®️' );
			lines[ l ] = lines[ l ].strReplace( '(tm)', '™' );

			if( lines[ l ].trim().length > lastWidth )
			{
				lastWidth = lines[ l ].trim().length;
			}
		}
		canvas.width = ( lastWidth *  fontWidth ) + ( actor.FontSpacing * lastWidth );
		canvas.height = lines.length * fontHeight;
		var ctx = canvas.getContext( '2d' );
		if( application.aoz.manifest.display.smoothing )
		{
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
		}
		else
		{
			ctx.imageSmoothingEnabled = false;
		}	
		var tx=0;
		var ty=0;
		for( var l = 0; l < lines.length; l++ )
		{
			for( var t = 0; t < lines[ l ].trim().length; t++ )
			{
				var c = lines[ l ].charCodeAt( t );
				var point = getCharacterPos( c, img );
				ctx.drawImage( img, point.x, point.y, fontWidth, fontHeight, tx, ty, fontWidth, fontHeight );
				tx = tx + ( fontWidth + actor.FontSpacing );
			}
			ty = ty + fontHeight;
		}

		var finalCanvas = undefined;
		if( actImage == undefined || actImage == null)
		{
			finalCanvas = document.createElement( 'canvas' );
			finalCanvas.width = ( canvas.width / 100 ) * size;
			finalCanvas.height = ( canvas.height / 100 ) * size;
			var finalCtx = finalCanvas.getContext( '2d' );
			finalCtx.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, ( canvas.width / 100 ) * size,( canvas.height / 100 ) * size  );
	}
		else
		{
			if( actImage )
			{
				finalCanvas = document.createElement( 'canvas' );
				finalCanvas.width = actImage.canvas.width;
				finalCanvas.height = actImage.canvas.height;
				var finalCtx = finalCanvas.getContext( '2d' );
				finalCtx.drawImage( actImage.canvas, 0, 0 );
				var cx = ( finalCanvas.width - ( ( canvas.width / 100 ) * size ) ) / 2;
				var cy = ( finalCanvas.height - ( ( canvas.height / 100 ) * size ) ) / 2;
				finalCtx.drawImage( canvas, 0, 0, canvas.width, canvas.height, cx, cy, ( canvas.width / 100 ) * size,( canvas.height / 100 ) * size  );
			}
			else
			{
				finalCanvas = document.createElement( 'canvas' );
				finalCanvas.width = ( canvas.width / 100 ) * size;
				finalCanvas.height = ( canvas.height / 100 ) * size;
				var finalCtx = finalCanvas.getContext( '2d' );
				finalCtx.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, ( canvas.width / 100 ) * size,( canvas.height / 100 ) * size  );
			}
		}

		var image = undefined;
		try
		{
			image = bank.getElement( actor.Id + '_txt', application.aoz.currentContextName, undefined );
		}
		catch( e )
		{
			image = undefined;
		}
		
		if ( image == undefined )
		{
			bank.add( actor.Id + '_txt' );
			bank.setElement( actor.Id + '_txt', finalCanvas );
		}
		else
		{
			bank.setElement( actor.Id + '_txt', finalCanvas );	
		}
	}

	if( callback )
	{
		callback();
	}
};

function extract_video_image( videoName )
{

	var video;
	if( videoName.toLowerCase() == '@webcam' )
	{
		if( application.aoz.webcam_video == undefined )
		{
			application.aoz.webcam_video = document.createElement( 'video' );
			navigator.getMedia(
				{
					video: true,
					audio: false
				},
				function( stream )
				{
					if ( navigator.mozGetUserMedia )
					{
						application.aoz.webcam_video.mozSrcObject = stream;
					}
					else
					{
						var vendorURL = window.URL || window.webkitURL;
						application.aoz.webcam_video.srcObject = stream;
					}
				},
				function( err )
				{
					console.log("An error occured! " + err);
				}
			);
		}
		store_video_image( application.aoz.webcam_video, videoName );
		video = application.aoz.webcam_video;
	}
	else
	{
		if( application.aoz.ASSET == undefined || application.aoz.ASSET.arrVideos == undefined || application.aoz.ASSET.arrVideos[ 'video_' + videoName ] == undefined )
		{
			throw "video_not_found";
		}		
		video = application.aoz.ASSET.arrVideos[ "video_" + videoName ];
		store_video_image( video, videoName );
	}

	return video;
};

function store_video_image( video, videoName )
{
	if( video )
	{
		var bank = application.aoz.banks.getBank( undefined, undefined, 'images' );
		var image = undefined;
		try
		{
			image = bank.getElement( videoName + '_img', application.aoz.currentContextName, undefined );
		}
		catch( e )
		{
			image = undefined;
		}

		if ( image == undefined )
		{
			bank.add( videoName + '_img' );
			var canvas = document.createElement( 'canvas' );
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			bank.setElement( videoName + '_img', canvas );
		}

		var w = video.videoWidth;
		var h = video.videoHeight;
		image = bank.getElement( videoName+ '_img' );
		image.width = w;
		image.height = h;
		image.canvas.width = w;
		image.canvas.height = h;
		var ctx = image.canvas.getContext( '2d' );
		ctx.drawImage( video, 0, 0, w, h );
	}
}

function set_actor( args )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( args == undefined )
	{
		self.load_error = true;
		self.load_done = true;
		throw "arguments_missing";
	}

	if( args.Id == undefined ||  ( isNaN( args.Id ) && args.Id == "" ) ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "argument_Id_missing";
	}
	var actName = ( !isNaN( args.Id ) ) ? 'act_' + args.Id : args.Id;
	
	var bobParam = self.bobParams[ actName ];
	if( bobParam == undefined || bobParam == null )
	{
		bobParam = 
		{
			updated: true
		};
		args.updated = true;
	}

	bobParam.Id = args.Id;
	bobParam.updated = true;
	args.updated = true;

	if( args.behavior != undefined && args.behavior != '-255' )
	{
		if( bobParam.behaviors != undefined )
		{
			args.behaviors = bobParam.behaviors;
		}
		else
		{
			args.behaviors = {};
		}

		var ba = args.behavior.split( "+" );
		for( var b = 0; b < ba.length; b++ )
		{
			var parts = ba[ b ].toLowerCase().split( ':' );
			if( parts )
			{
				if( actor_behaviors == undefined || actor_behaviors[ parts[ 0 ] ] == undefined )
				{
					throw "actor_behavior_not_found";
				}

				var behaviorObj = new actor_behaviors[ parts[ 0 ] ]();
				if( parts.length > 1 )
				{
					if( behaviorObj.parameters == undefined || behaviorObj.parameters.public == undefined )
					{
						throw "no_parameters_in_actor_behavior";
					}
					var params = parts[ 1 ].split( ',' );
					for( var p=0; p < params.length; p++ )
					{
						var param = params[ p ].split( '=' );
						if( param.length != 2 )
						{
							throw "actor_behavior_wrong_parameter";
						}

						if( isNaN( param[ 1 ] ) )
						{
							behaviorObj.parameters.public[ param[ 0 ] ] = "" + param[ 1 ];
						}
						else
						{
							if( param[ 1 ].indexOf( '.' ) > -1 )
							{
								behaviorObj.parameters.public[ param[ 0 ] ] = parseFloat( param[ 1 ] );
							}
							else
							{
								behaviorObj.parameters.public[ param[ 0 ] ] = parseInt( param[ 1 ] );
							}
						}

					}
				}

				if( behaviorObj.parameters != undefined && behaviorObj.parameters.public != undefined && behaviorObj.parameters.public.controls != undefined )
				{
					var ctrls = behaviorObj.parameters.public.controls.split( ";" );
					if( ctrls )
					{
						for( var c = 0; c < ctrls.length; c++ )
						{
							if( args.Controls != '' )
							{
								args.Controls += ";";
							}
							args.Controls += ctrls[ c ] + ":behavior=" + parts[ 0 ];
						}
					}
				}
				if( behaviorObj.initProc )
				{
					var options =
					{
						BEHAVIOR$: parts[ 0 ],
						INDEX: !isNaN( bobParam.Id ) ? bobParam.Id : -1,
						INDEX$: '' + bobParam.Id
					};
					options = getActorEvent( options.EVENT$, self.mouseActor.actor, options );
					application.aoz.runProcedure( behaviorObj.initProc, options, bobParam );
				}
				args.behaviors[ parts[ 0 ] ] = behaviorObj;
			}
		}
		bobParam.updated = true;
		args.updated = true;
		self.bobParams[ actName ] = args;
	}
	else
	{
		if( bobParam.behaviors )
		{
			args.behaviors = bobParam.behaviors;
		}
	}
	
	if( args.Image == undefined || args.Image == '' )
	{
		if( bobParam.Image )
		{
			args.Image = bobParam.Image;
		}
	}
	else
	{
		if( args.Image != bobParam.Image )
		{
			bobParam.Image = args.Image;
			bobParam.memImage = undefined;
			bobParam.updated = true;
			args.updated = true;
		}	
	}
	
	if( args.SpriteSheet == undefined || args.SpriteSheet == '' )
	{
		if( bobParam.SpriteSheet )
		{
			args.SpriteSheet = bobParam.SpriteSheet;
			args.sprite = true;
		}
	}
	else
	{
		bobParam.SpriteSheet = args.SpriteSheet;
		args.sprite = true;
		bobParam.updated = true;
		args.updated = true;

	}

	args.currentAnimFrame = bobParam.currentAnimFrame;
	args.currentAnimation = bobParam.currentAnimation;
	args.animDirection = bobParam.animDirection;
	args.animPlaying = bobParam.animPlaying;
	args.animTempo = bobParam.animTempo;

	if( bobParam.Anim != args.Anim && args.Anim != "-255" && args.Anim != -255 )
	{
		bobParam.Anim = args.Anim;
		bobParam.memImage = undefined;
		bobParam.updated = true;
		args.updated = true;


		if( args.Anim == undefined || args.Anim == ""  ) 
		{
			self.load_error = true;
			self.load_done = true;
			throw "animation_name_not_defined";
		}
	
		if( bobParam.SpriteSheet == undefined || bobParam.SpriteSheet == "" )
		{
			if ( self.animations == undefined || self.animations[ args.Anim ] == undefined )
			{
				self.load_error = true;
				self.load_done = true;
				throw "animation_not_found";		 
			}
			else
			{
				bobParam.currentAnimation = self.animations[ args.Anim ];
				bobParam.currentAnimFrame = 0;
				bobParam.animDirection = 0;
				bobParam.animTempo = 0;
				bobParam.animPlaying = true;
			}
		}
	}
	
	if( args.animPlay != -255 )
	{
		bobParam.animPlay = args.animPlay;
	}
	else
	{
		if( bobParam.animPlay == undefined )
		{
			bobParam.animPlay = true;
		}
	}

	bobParam.animPlaying = ( args.animPlay != -255 ) ? args.animPlay : bobParam.animPlay;
	if( bobParam.animPlaying )
	{
		if( bobParam.currentAnimation )
		{
			if( bobParam.currentAnimFrame != undefined )
			{
				var frame = bobParam.currentAnimation.frames[ bobParam.currentAnimFrame ];
				args.Image = frame.index;
			}
		}
	}

	args.animPlay = bobParam.animPlay;
	args.currentAnimation = bobParam.currentAnimation;
	args.currentAnimFrame = bobParam.currentAnimFrame;
	args.animDirection = bobParam.animDirection;
	args.animTempo = bobParam.animTempo;
	args.animPlaying = bobParam.animPlaying;	

	if( args.Video == undefined || args.Video == '' )
	{
		if( bobParam.Video )
		{
			args.Video = bobParam.Video;
		}
	}
	else
	{
		if( bobParam.Video == undefined || bobParam.Video == '' || args.Video != bobParam.Video  )
		{
			bobParam.Video = args.Video;
		}
		else
		{
			bobParam.Video = args.Video;
			if( bobParam.videoObj )
			{
				bobParam.videoObj.currentTime = 0.0;
				bobParam.videoObj.pause();
			}
		}
		bobParam.videoObj = extract_video_image( bobParam.Video );
		bobParam.updated = true;
		args.updated = true;


		setTimeout( function()
		{
			if( bobParam.videoObj )
			{
				bobParam.videoObj.pause;
				bobParam.videoObj.currentTime = 0;
			}
		}, 100	);
		bobParam.Image = args.Video + '_img';
		bobParam.memImage = undefined;
		args.Image = bobParam.Image;
	}
	
	if( args.VideoPlay == -1001 )
	{
		if( bobParam.VideoPlay != undefined )
		{
			args.VideoPlay =  bobParam.VideoPlay;
		}
		else
		{
			args.VideoPlay = true;
			bobParam.VideoPlay = true;
		}
	}
	else
	{
		bobParam.VideoPlay = args.VideoPlay;
		if( bobParam.videoObj )
		{
			if( bobParam.VideoPlay )
			{
				bobParam.videoObj.play();
			}
			else
			{
				bobParam.videoObj.pause();
			}
		}
	}

	if( args.VideoLoop == -1001 )
	{
		if( bobParam.VideoLoop != undefined )
		{
			args.VideoLoop =  bobParam.VideoLoop;
		}
		else
		{
			args.VideoLoop = true;
			bobParam.VideoLoop = true;
		}
	}
	else
	{
		bobParam.VideoLoop = args.VideoLoop;
	}

	if( bobParam.videoObj )
	{
		bobParam.videoObj.loop = bobParam.VideoLoop;
	}

	bobParam.fontDoUpdate = false;

	if( bobParam.FontName != args.FontName && args.FontName != 'fnt_default' )
	{
		bobParam.FontName = args.FontName;
		bobParam.fontDoUpdate = true;
	}
	else
	{
		if( bobParam.FontName )
		{
			args.FontName = bobParam.FontName;
		}
		else
		{
			args.FontName = 'fnt_default';
			bobParam.FontName = 'fnt_default';
		}
	}
	
	if( bobParam.FontSize != args.FontSize && args.FontSize != -1 )
	{
		bobParam.FontSize = args.FontSize;
		bobParam.fontDoUpdate = true;
	}
	else
	{
		if( bobParam.FontSize )
		{
			args.FontSize = bobParam.FontSize;
		}
		else
		{
			args.FontSize = -1;
			bobParam.FontSize = -1;
		}
	}
	
	if( bobParam.FontSpacing != args.FontSpacing && args.FontSpacing != -1001 )
	{
		bobParam.FontSpacing = args.FontSpacing;
		bobParam.fontDoUpdate = true;
	}
	else
	{
		if( bobParam.FontSpacing )
		{
			args.FontSpacing = bobParam.FontSpacing;
		}
		else
		{
			args.FontSpacing = 0;
			bobParam.FontSpacing = 0;
		}
	}

	if( bobParam.Text != args.Text && args.Text != '-255.0001' )
	{
		bobParam.Text = args.Text;
		//args.Image = undefined;
		bobParam.memImage = undefined;
		bobParam.fontDoUpdate = true;
	}
	else
	{
		if( bobParam.Text )
		{
			args.Text = bobParam.Text;
		}
		else
		{
			args.Text = '-255.0001';
			bobParam.Text = '-255.0001';
		}
	}
	var bob =undefined;
	if( ( args.Image == undefined || args.Image == '' ) && ( args.SpriteSheet == undefined || args.SpriteSheet == '' ) )
	{
		if( bobParam.Text != '-255.0001' )
		{
			if( bobParam.fontDoUpdate )
			{
				generateTextImage( bobParam, function()
				{
					bobParam.fontDoUpdate = false;
					//args.Image = args.Id + '_txt';
					args.Anim = '';
					args.SpriteSheet = '';
					args.Video = '';
					bob = self.aoz.currentScreen.bob( args.Id, { x: undefined, y: undefined }, args.Id + '_txt' ); //args.Image );
					var pos = getHotspot( args );
					bob.imageObject.hotSpotX = pos.x;
					bob.imageObject.hotSpotY = pos.y;
				} );
			}
		}
		else
		{
			if( bobParam.Anim == undefined && bobParam.Anim != '' )
			{
				self.load_error = true;
				self.load_done = true;
				throw "no_image_or_spritesheet_defined";
			}
		}
	}
	else
	{
		if( bobParam.fontDoUpdate && bobParam.Text != '-255.0001' )
		{
			generateTextImage( bobParam, function()
			{
				bobParam.fontDoUpdate = false;
				//args.Image = args.Id + '_txt';
				args.Anim = '';
				args.SpriteSheet = '';
				args.Video = '';
				bob = self.aoz.currentScreen.bob( args.Id, { x: undefined, y: undefined }, args.Id + '_txt' ); //args.Image );
				var pos = getHotspot( args );
				bob.imageObject.hotSpotX = pos.x;
				bob.imageObject.hotSpotY = pos.y;
			} );
		}		
	}

	if( bob == undefined )
	{
		bob = self.aoz.currentScreen.bob( args.Id, { x: undefined, y: undefined }, args.Image );
	}

	var display = self.stage.getChildByName( args.Id );
	if( display == undefined || display == null )
	{
		if( args.Image != undefined && args.Image != '' )
		{
			display = new createjs.Bitmap();
			display.image = bob.imageObject.canvas;
		}
		else
		{
			display = new createjs.DisplayObject();
			display.useTicks = true;
		}
		args.sprite = false;
		display.name = args.Id;

		self.stage.addChild( display );
	}

	if( args.SpriteSheet && self.aoz.ASSET.arrSpriteSheet && self.aoz.ASSET.arrSpriteSheet[ "spr_" + args.SpriteSheet ] )
	{
		display = new createjs.Sprite( self.aoz.ASSET.arrSpriteSheet[ "spr_" + args.SpriteSheet ] );
		args.display = display;
		args.display.spriteSheet.framerate = self.aoz.ASSET.arrSpriteSheet[ "spr_" + args.SpriteSheet ].realFramerate;
		args.currentFrame = 0;
		args.tmAnim = Date.now();
		args.sprite = true;
		bobParam.updated = true;
		args.updated = true;
	}
	else
	{
		if( bobParam.SpriteSheet )
		{
			args.SpriteSheet = bobParam.SpriteSheet;
		}
	}
	
	if( args.Anim != undefined && args.Anim != '' && args.Anim != '-255' )
	{
		args.currentFrame = 0;
		args.tmAnim = Date.now();				
		if( args.SpriteSheet != undefined && args.SpriteSheet != '' )
		{
			bob = actor_getAnimationFrame( args );
			args.HotspotX = bob.imageObject.hotSpotX;
			args.HotspotY = bob.imageObject.hotSpotY;
			args.Hotspot= undefined;
			bobParam.updated = true;
			args.updated = true;
					
		}			
	}
	else
	{
		if( bobParam.Anim )
		{
			args.Anim = bobParam.Anim;
		}
	}
	
	bob.Index = args.Id;
	args.display = display;
	
	if( args.X == undefined || args.X == -1001 )
	{
		if( bobParam.X )
		{
			args.X = bobParam.X;
		}
		else
		{
			args.X = bob.vars.x;
		}
	}

	if( args.Y == undefined || args.Y == -1001 )
	{
		if( bobParam.Y )
		{
			args.Y = bobParam.Y;
		}
		else
		{
			args.Y = bob.vars.y;
		}
	}
	
	if( args.Z == undefined || args.Z == -1001 )
	{
		if( bobParam.Z )
		{
			args.Z = bobParam.Z;
		}
		else
		{
			args.Z = bob.vars.z;
		}
	}
	else
	{
		bob.vars.z = args.Z;
		if( self.aoz.currentScreen.bobsContext && self.aoz.currentScreen.bobsContext.listSorted )
		{
			self.aoz.currentScreen.bobsContext.listSorted.sort( function( a, b )
			{
				if( a.vars.z < b.vars.z )
				{
					return -1;
				}
				
				if( a.vars.z > b.vars.z )
				{
					return 1;
				}
				
				if( a.vars.z == b.vars.z )
				{
					return 0;
				}
			} );			
		}	
	}

	if( args.StartX == undefined || args.StartX == -1001 )
	{
		if( bobParam.StartX )
		{
			args.StartX = bobParam.StartX;
		}
		else
		{
			args.StartX = args.X;
		}
	}
	else
	{
		args.X = args.StartX;
	}

	if( args.StartY == undefined || args.StartY == -1001 )
	{
		if( bobParam.StartY )
		{
			args.StartY = bobParam.StartY;
		}
		else
		{
			args.StartY = args.Y;
		}
	}
	else
	{
		args.Y = args.StartY;
	}
	
	if( args.EndX == undefined || args.EndX == -1001 )
	{
		if( bobParam.EndX )
		{
			args.EndX = bobParam.EndX;
		}
		else
		{
			args.EndX = args.X;
		}
	}

	if( args.EndY == undefined || args.EndY == -1001 )
	{
		if( bobParam.EndY )
		{
			args.EndY = bobParam.EndY;
		}
		else
		{
			args.EndY = args.Y;
		}
	}
	
	if( args.Visible == -1001 )
	{
		if( bobParam.Visible != undefined )
		{
			args.Visible =  bobParam.Visible;
		}
		else
		{
			args.Visible = true;
			bobParam.Visible = true;
		}
	}
	else
	{
		bobParam.Visible = args.Visible;
	}
	bob.vars.visible = bobParam.Visible;

	if( args.Collision == -1001 )
	{
		if( bobParam.Collision != undefined )
		{
			args.Collision =  bobParam.Collision;
		}
		else
		{
			args.Collision = true;
			bobParam.Collision = true;
		}
	}
	else
	{
		bobParam.Collision = args.Collision;
	}

	if( args.Alpha == undefined || args.Alpha == -0.001 )
	{
		args.Alpha = bobParam.Alpha || bob.vars.alpha || 1.0;
	}
	else
	{
		bobParam.Alpha = args.Alpha;
		args.StartAlpha = args.Alpha;
	}
	
	if( args.StartAlpha == undefined || args.StartAlpha == -0.001 )
	{
		args.StartAlpha = args.Alpha || bobParam.StartAlpha || bobParam.Alpha || bob.vars.alpha || 1.0;
	}
	else
	{
		bobParam.StartAlpha = args.StartAlpha;
		args.Alpha = args.StartAlpha;
	}

	if( args.EndAlpha == undefined || args.EndAlpha == -0.001 )
	{
		args.EndAlpha = args.StartAlpha || args.Alpha || bobParam.EndAlpha || bobParam.StartAlpha || bobParam.Alpha || bob.vars.alpha || 1.0;
	}
	else
	{
		bobParam.EndAlpha = args.EndAlpha;
	}

	if( args.Angle == undefined || args.Angle == -1001 )
	{
		args.Angle = bobParam.Angle || 0.0;
	}
	else
	{
		bobParam.Angle = args.Angle;
		args.StartAngle = args.Angle;
		bob.vars.angle = args.Angle * ( Math.PI / 180 );
	}
	
	if( args.StartAngle == undefined || args.StartAngle == -1001 )
	{
		args.StartAngle = args.Alpha || bobParam.StartAngle || bobParam.Angle || ( bob.vars.angle * ( 180 / Math.PI ) ) || 0.0;
	}
	else
	{
		bobParam.StartAngle = args.StartAngle;
		bobParam.Angle = args.StartAngle;
		bob.vars.angle = args.StartAngle * ( Math.PI / 180 );
	}
	
	if( args.EndAngle == undefined || args.EndAngle == -1001 )
	{
		args.EndAngle = args.StartAngle || args.Angle || bobParam.EndAngle || bobParam.StartAngle || bobParam.Angle || ( bob.vars.angle * ( 180 / Math.PI ) ) || 0.0;
	}
	else
	{
		bobParam.EndAngle = args.EndAngle;
	}

	if( args.Scale == undefined || args.Scale == -0.001 )
	{
		args.Scale = bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.Scale = args.Scale;
		args.ScaleX = args.Scale;
		args.ScaleY = args.Scale;
	}
	
	if( args.StartScale == undefined || args.StartScale == -0.001 )
	{
		args.StartScale = args.Scale || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.StartScale = args.StartScale;
		bobParam.Scale = args.StartScale;
		args.StartScaleX = args.StartScale;
		args.StartScaleY = args.StartScale;
		args.ScaleX = args.StartScale;
		args.ScaleY = args.StartScale;		
	}
	
	if( args.EndScale == undefined || args.EndScale == -0.001 )
	{
		args.EndScale = args.StartScale || args.Scale || bobParam.EndScale || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.EndScale = args.EndScale;
		args.EndScaleX = args.EndScale;
		args.EndScaleY = args.EndScale;
	}

	if( args.ScaleX == undefined || args.ScaleX == -0.001 )
	{
		args.ScaleX = bobParam.ScaleX || bobParam.StartScaleX || bobParam.Scale || bobParam.StartScale || 1.0;
	}
	else
	{
		bobParam.ScaleX = args.ScaleX;
		args.StartScaleX = args.ScaleX;
	}
	
	if( args.StartScaleX == undefined || args.StartScaleX == -0.001 )
	{
		args.StartScaleX = args.ScaleX || bobParam.StartScaleX || bobParam.ScaleX || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.StartScaleX = args.StartScaleX;
		args.ScaleX = args.StartScaleX;
	}
	
	if( args.EndScaleX == undefined || args.EndScaleX == -0.001 )
	{
		args.EndScaleX = args.StartScaleX || args.ScaleX || bobParam.EndScaleX || bobParam.StartScaleX || bobParam.EndScale || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.EndScaleX = args.EndScaleX;
	}
	
	if( args.ScaleY == undefined || args.ScaleY == -0.001 )
	{
		args.ScaleY = bobParam.ScaleY || bobParam.Scale || 1.0;			
	}
	else
	{
		bobParam.ScaleY = args.ScaleY;
		args.StartScaleY = args.ScaleY;
	}
	
	if( args.StartScaleY == undefined || args.StartScaleY == -0.001 )
	{
		args.StartScaleY = args.ScaleY || bobParam.StartScaleY || bobParam.ScaleY || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.StartScaleY = args.StartScaleY;
		args.ScaleY = args.StartScaleY;
	}
	
	if( args.EndScaleY == undefined || args.EndScaleY == -0.001 )
	{
		args.EndScaleY = args.StartScaleY || args.ScaleY || bobParam.EndScaleY || bobParam.StartScaleY || bobParam.ScaleY || bobParam.EndScale || bobParam.StartScale || bobParam.Scale || 1.0;
	}
	else
	{
		bobParam.EndScaleY = args.EndScaleY;
	}
	
	if( args.SkewX == undefined || args.SkewX == -1001 )
	{
		args.SkewX = bobParam.SkewX || 0;
	}
	else
	{
		bobParam.SkewX = args.SkewX;
		args.StartSkewX = args.SkewX;
	}
	
	if( args.StartSkewX != undefined && args.StartSkewX == -1001 )
	{
		args.StartSkewX = args.SkewX || bobParam.StartSkewX || bobParam.SkewX || 0;
	}
	else
	{
		bobParam.StartSkewX = args.StartSkewX;
		args.SkewX = args.StartSkewX;
	}
	
	if( args.EndSkewX == undefined || args.EndSkewX == -1001 )
	{
		args.EndSkewX = args.StartSkewX || args.SkewX || bobParam.EndSkewX || bobParam.StartSkewX || bobParam.SkewX  || 0;
	}
	else
	{
		bobParam.EndSkewX = args.EndSkewX;
	}
	
	if( args.SkewY == undefined || args.SkewY == -1001 )
	{
		args.SkewY = bobParam.SkewY || 0;
	}
	else
	{
		bobParam.SkewY = args.SkewY;
		args.StartSkewY = args.SkewY;
	}
	
	if( args.StartSkewY != undefined && args.StartSkewY == -1001 )
	{
		args.StartSkewY = args.SkewY || bobParam.StartSkewY || bobParam.SkewY || 0;
	}
	else
	{
		bobParam.StartSkewY = args.StartSkewY;
		args.SkewY = args.StartSkewY;
	}
	
	if( args.EndSkewY == undefined || args.EndSkewY == -1001 )
	{
		args.EndSkewY = args.StartSkewY || args.SkewY || bobParam.EndSkewY || bobParam.StartSkewY || bobParam.SkewY || 0;
	}
	else
	{
		bobParam.EndSkewY = args.EndSkewY;
	}

	if( args.Duration == undefined || args.Duration == -1001 )
	{
		if( bobParam.Duration )
		{
			args.Duration = bobParam.Duration;
		}
		else
		{
			args.Duration = 1000;
		}
	}
	
	if( args.Transition == undefined || args.Transition == '' )
	{
		if( bobParam.Transition )
		{
			args.Transition = bobParam.Transition;
		}
		else
		{
			args.Transition = 'linear';
		}
	}

	if( args.LoopAnim == -1001 )
	{
		if( bobParam.LoopAnim )
		{
			args.LoopAnim = bobParam.LoopAnim;
		}
		else
		{
			args.LoopAnim = false;
			bobParam.LoopAnim = false;
		}
	}
	else
	{
		bobParam.LoopAnim = args.LoopAnim;
	}
	
	if( args.Enable == -1001 )
	{
		if( bobParam.Enable )
		{
			args.Enable = bobParam.Enable;
		}
		else
		{
			args.Enable = true;
			bobParam.Enable = true;
		}
	}
	else
	{
		bobParam.Enable = args.Enable;
	}
	bob.vars.enable = bobParam.Enable;

	if( args.Group == undefined || args.Group == '' )
	{
		if( bobParam.Group )
		{
			args.Group = bobParam.Group
		}
		else
		{
			args.Group = "";
		}
	}

	if( args.LoopMove == -1001 )
	{
		if( bobParam.LoopMove )
		{
			args.LoopMove = bobParam.LoopMove;
		}
		else
		{
			args.LoopMove = false;
			bobParam.LoopMove = false;
		}
	}

	if( args.HRev == undefined || args.HRev == -255 )
	{
		if( bobParam.HRev )
		{
			args.HRev = bobParam.HRev;
			
		}
		else
		{
			args.HRev = false;
		}
	}

	if( args.VRev == undefined || args.VRev == -255 )
	{
		if( bobParam.VRev )
		{
			args.VRev = bobParam.VRev;
		}
		else
		{
			args.VRev = false;
		}
	}

	if( args.ActionMove == undefined || args.ActionMove == '' )
	{
		if( bobParam.ActionMove )
		{
			args.ActionMove = bobParam.ActionMove;
		}
		else
		{
			args.ActionMove = 'play';
		}
	}
	
	//args.hasLimits = false;
	if( bobParam.hasLimits)
	{
		args.hasLimits = bobParam.hasLimits;
	}

	if( bobParam.X1 && bobParam.X1 != args.X1 && args.X1 != -1001 )
	{
		bobParam.X1 = args.X1;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.X1 == undefined )
		{
			bobParam.X1 = -1001;
		}
		args.X1 = bobParam.X1;
	}
	
	if( bobParam.Y1 && bobParam.Y1 != args.Y1 && args.Y1 != -1001 )
	{
		bobParam.Y1 = args.Y1;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.Y1 == undefined )
		{
			bobParam.Y1 = -1001;
		}
		args.Y1 = bobParam.Y1;
	}

	if( bobParam.Y1 && bobParam.Y1 != args.Y1alias && args.Y1alias != -1001 )
	{
		bobParam.Y1 = args.Y1alias;
		args.Y1 = args.Y1alias;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.Y1 == undefined )
		{
			bobParam.Y1 = -1001;
		}
		args.Y1alias = bobParam.Y1;
		args.Y1 = bobParam.Y1;
	}
	
	if( bobParam.X2 && bobParam.X2 != args.X2 && args.X2 != -1001 )
	{
		bobParam.X2 = args.X2;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.X2 == undefined )
		{
			bobParam.X2 = -1001;
		}
		args.X2 = bobParam.X2;
	}

	if( bobParam.Y2 && bobParam.Y2 != args.Y2 && args.Y2 != -1001 )
	{
		bobParam.Y2 = args.Y2;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.Y2 == undefined )
		{
			bobParam.Y2 = -1001;
		}
		args.Y2 = bobParam.Y2;
	}

	if( bobParam.Y2 && bobParam.Y2 != args.Y2alias && args.Y2alias != -1001 )
	{
		bobParam.Y2 = args.Y2alias;
		args.Y2 = args.Y2alias;
		bobParam.hasLimits = true;
		args.hasLimits = true;
	}
	else
	{
		if( bobParam.Y2 == undefined )
		{
			bobParam.Y2 = -1001;
		}
		args.Y2alias = bobParam.Y2;
		args.Y2 = bobParam.Y2;
	}
	
	args.limits = 
	{
		x1: args.X1,
		y1: args.Y1,
		x2: args.X2,
		y2:args.Y2
	};

	bobParam.limits = 
	{
		x1: bobParam.X1,
		y1: bobParam.Y1,
		x2: bobParam.X2,
		y2: bobParam.Y2
	};
	
	if( args.Hotspot == undefined || args.Hotspot == '' || args.Hotspot == 'none' )
	{
		if( bobParam.Hotspot )
		{
			args.Hotspot = bobParam.Hotspot;
		}
	}

	if( bobParam.Body )
	{
		Body.setPosition( bobParam.Body.body, { x: args.X, y: args.Y } );
		bobParam.Body.body.render.sprite.xScale = args.ScaleX;
		bobParam.Body.body.render.sprite.yScale = args.ScaleY;
		bobParam.Body.body.opacity = args.Alpha;
		bobParam.Body.body.isSleeping = !args.Enable;
		bobParam.Body.body.visible = args.Visible;
		bobParam.Body.body.angle = args.Angle * ( Math.PI / 180 );
	}
	else
	{
		bob.vars.x = args.X;
		bob.vars.y = args.Y;
		bob.vars.z = args.Z;
		bob.vars.scaleX = args.ScaleX;
		bob.vars.scaleY = args.ScaleY;
		bob.vars.skewX = args.SkewX;
		bob.vars.skewY = args.SkewY;
		bob.vars.alpha = args.Alpha;
		bob.vars.enable = args.Enable;
		bob.vars.visible = args.Visible;
		bob.vars.angle = args.Angle * ( Math.PI / 180 );
	}
	
	bob.vars.hRev = args.HRev;
	bob.vars.vRev = args.VRev;
	
	display.x = bob.vars.x;
	display.y = bob.vars.y;
	display.alpha = bob.vars.alpha;
	display.scaleX = bob.vars.scaleX;
	display.scaleY = bob.vars.scaleY;
	display.rotation = args.Angle;
	display.skewX = bob.vars.skewX;
	display.skewY = bob.vars.skewY;
	display.name = args.Id;
	if( bob.imageObject )
	{
		display.regX = bob.imageObject.hotSpotX;
		display.regY = bob.imageObject.hotSpotY;
	}
	display.visible = args.Visible;

	bob.vars.visible = args.Visible;
	
	if( !args.sprite && bob.imageObject )
	{
		display.regX = bob.imageObject.hotSpotX;
		display.regY = bob.imageObject.hotSpotY;
	}
	
	if( args.LookAt == undefined || args.LookAt == '' )
	{
		if( bobParam.LookAt )
		{
			args.LookAt = bobParam.LookAt;
		}
		else
		{
			args.LookAt = '';
		}
	}

	if( args.LookAt != undefined && args.LookAt != '' )
	{
		if( args.LookAt.toLowerCase().trim() == 'mouse' )
		{
			args.lookAtObject =
			{
				object: 'mouse'
			};
		}
		else
		{
			var v = args.LookAt.split( "," );
			if( Array.isArray( v ) && v.length == 2 )
			{
				if( !isNaN( v[ 0 ] ) && !isNaN( v[ 1 ] ) )
				{
					args.lookAtObject =
					{
						object: 'point',
						x : parseFloat( v[ 0 ].trim() ),
						y: parseFloat( v[ 1 ].trim() )
					};
				}
			}
			else
			{
				args.lookAtObject =
				{
					object: 'actor',
					name : args.LookAt.trim()
				};
			}
		}
	}
	
	if( args.Auto != undefined && args.Auto != '' )
	{
		
		if( args.Controls != undefined && args.Auto.toLowerCase() == "reset" )
		{

			var ctrls = args.Controls.split( ";" );
			var newP = '';
			for( r = 0; r < ctrls.length; r++ )
			{
				if( args.Controls.indexOf( "auto:" ) < 0 )
				{
					if( newP != '' )
					{
						newP = newP = ";";
					}
					newP = newP + ctrls[ r ];
				}
			}
			args.Controls = newP;
			if( newP != '' )
			{
				args.Controls = args.Controls + ";"
			}
			args.Controls = args.Controls + "auto:" + args.Auto;					
		}
		else
		{
			if( bobParam.Controls )
			{
			
				var ctrls = bobParam.Controls.split( ";" );
				var newP = '';
				for( r = 0; r < ctrls.length; r++ )
				{
					if( bobParam.Controls.indexOf( "auto:" ) < 0 )
					{
						if( newP != '' )
						{
							newP = newP = ";";
						}
						newP = newP + ctrls[ r ];
					}
				}
				bobParam.Controls = newP;
				if( newP != '' )
				{
					args.Controls = bobParam.Controls + ";"
				}
				
				if( args.Auto.toLowerCase() != "reset" )
				{
					args.Controls = args.Controls + "auto:" + args.Auto;
				}
			}
			else
			{
				if( args.Auto.toLowerCase() != "reset" )
				{
					args.Controls = "auto:" + args.Auto;
				}
			}
		}
	}

	if( args.OnMouse == undefined || args.OnMouse == '' ) 
	{
		args.OnMouse = ( bobParam.OnMouse ) ? bobParam.OnMouse : '';
	}
	
	if( args.OnMouseClick == undefined || args.OnMouseClick == '' ) 
	{
		args.OnMouseClick = ( bobParam.OnMouseClick ) ? bobParam.OnMouseClick : '';
	}
	
	if( args.OnMouseDblClick == undefined || args.OnMouseDblClick == '' ) 
	{
		args.OnMouseDblClick = ( bobParam.OnMouseDblClick ) ? bobParam.OnMouseDblClick : '';
	}

	if( args.OnMouseDown == undefined || args.OnMouseDown == '' ) 
	{
		args.OnMouseDown = ( bobParam.OnMouseDown ) ? bobParam.OnMouseDown : '';
	}
	
	if( args.OnMouseUp == undefined || args.OnMouseUp == '' ) 
	{
		args.OnMouseUp = ( bobParam.OnMouseUp ) ? bobParam.OnMouseUp : '';
	}
	
	if( args.OnMouseEnter == undefined || args.OnMouseEnter == '' ) 
	{
		args.OnMouseEnter = ( bobParam.OnMouseEnter ) ? bobParam.OnMouseEnter : '';
	}
	
	if( args.OnMouseExit == undefined || args.OnMouseExit == '' ) 
	{
		args.OnMouseExit = ( bobParam.OnMouseExit ) ? bobParam.OnMouseExit : '';
	}
	
	if( args.OnKeyPress == undefined || args.OnKeyPress == '' ) 
	{
		args.OnKeyPress = ( bobParam.OnKeyPress ) ? bobParam.OnKeyPress : '';
	}
	
	if( args.OnKeyDown == undefined || args.OnKeyDown == '' ) 
	{
		args.OnKeyDown = ( bobParam.OnKeyDown ) ? bobParam.OnKeyDown : '';
	}
	
	if( args.OnKeyUp == undefined || args.OnKeyUp == '' ) 
	{
		args.OnKeyUp = ( bobParam.OnKeyUp ) ? bobParam.OnKeyUp : '';
	}

	if( args.OnLimit == undefined || args.OnLimit == '' ) 
	{
		args.OnLimit = ( bobParam.OnLimit ) ? bobParam.OnLimit : '';
	}

	if( args.Controls == undefined || args.Controls == '' )
	{
		args.Controls = ( bobParam.Controls ) ? bobParam.Controls : '';
	}

	if( args.Controls && args.Controls != '' )
	{
		var json = undefined;

		try
		{
			if( args.Controls.toLowerCase() != 'reset' )
			{
				var controls = args.Controls.split( ";" );
				json = { controls : [] };
				
				for( c = 0; c < controls.length; c++ )
				{
					var ctrl = controls[ c ].toLowerCase().split( ":" );
					if( ctrl.length > 0 )
					{
						if( ctrl[ 0 ].trim() == 'joystick' )
						{
							ctrl[ 0 ] = 'joystick0';
						}
					
						if( ctrl[ 0 ].trim() == 'mouse' )
						{
							self.keys[ 'mouse' ] = true;
						}

						if( ctrl[ 0 ].trim() == 'auto' )
						{
							self.keys[ 'auto' ] = true;
						}

						json[ ctrl[ 0 ].trim() ] = {};
						json.controls.push( ctrl[ 0 ].trim() );

						if( ctrl[ 1 ] != undefined )
						{
							var params = ctrl[ 1 ].split( "," );
							if( params.length > 0 )
							{
								for( p = 0; p < params.length; p++ )
								{
									var param = params[ p ].split( "=" );
									if( param.length > 0 )
									{
										json[ ctrl[ 0 ].trim() ][ param[ 0 ].trim() ] = param[ 1 ].trim();
									}
								}
							}
						}

						if( ctrl[ 0 ].trim() == 'mouse' )
						{
							if( json[ 'mouse' ].honly == undefined )
							{
								json[ 'mouse' ].honly = 'false';
							}

							if( json[ 'mouse' ].vonly == undefined )
							{
								json[ 'mouse' ].vonly = 'false';
							}
						}

						if( ctrl[ 0 ].trim().substring( 0, 8 ) == 'keyboard' )
						{
							if( json[ 'arrowdown' ] == undefined )
							{
								json.controls.push( 'arrowdown' );
								json[ 'arrowdown' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'arrowdown' ].offsety = json[ ctrl[ 0 ].trim() ][ 'offsety' ];
								}
								else
								{
									json[ 'arrowdown' ].offsety = 8;
								}
							}

							if( json[ 'keys' ] == undefined )
							{
								json.controls.push( 'keys' );
								json[ 'keys' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'keys' ].offsety = json[ ctrl[ 0 ].trim() ][ 'offsety' ];
								}
								else
								{
									json[ 'keys' ].offsety = 8;
								}
							}

							if( json[ 'arrowup' ] == undefined )
							{
								json.controls.push( 'arrowup' );
								json[ 'arrowup' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'arrowup' ].offsety = ( json[ ctrl[ 0 ].trim() ][ 'offsety' ] * -1 );
								}
								else
								{
									json[ 'arrowup' ].offsety = -8;
								}
							}

							if( json[ 'keyw' ] == undefined )
							{
								json.controls.push( 'keyw' );
								json[ 'keyw' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'keyw' ].offsety = ( json[ ctrl[ 0 ].trim() ][ 'offsety' ] * -1 );
								}
								else
								{
									json[ 'keyw' ].offsety = -8;
								}
							}

							if( json[ 'arrowright' ] == undefined )
							{
								json.controls.push( 'arrowright' );
								json[ 'arrowright' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'arrowright' ].offsetx = json[ ctrl[ 0 ].trim() ][ 'offsetx' ];
								}
								else
								{
									json[ 'arrowright' ].offsetx = 8;
								}
							}

							if( json[ 'keyd' ] == undefined )
							{
								json.controls.push( 'keyd' );
								json[ 'keyd' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'keyd' ].offsetx = json[ ctrl[ 0 ].trim() ][ 'offsetx' ];
								}
								else
								{
									json[ 'keyd' ].offsetx = 8;
								}
							}

							if( json[ 'arrowleft' ] == undefined )
							{
								json.controls.push( 'arrowleft' );
								json[ 'arrowleft' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'arrowleft' ].offsetx = ( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] * -1 );
								}
								else
								{
									json[ 'arrowleft' ].offsetx = -8;
								}
							}

							if( json[ 'keya' ] == undefined )
							{
								json.controls.push( 'keya' );
								json[ 'keya' ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'keya' ].offsetx = ( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] * -1 );
								}
								else
								{
									json[ 'keya' ].offsetx = -8;
								}
							}
						}

						if( ctrl[ 0 ].trim().substring( 0, 8 ) == 'joystick' )
						{
							if( json[ 'joydown' + ctrl[ 0 ].trim().substring( 8 ) ] == undefined )
								{
								json.controls.push( 'joydown' + ctrl[ 0 ].trim().substring( 8 ) );
								json[ 'joydown' + ctrl[ 0 ].trim().substring( 8 ) ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'joydown' + ctrl[ 0 ].trim().substring( 8 ) ].offsety = json[ ctrl[ 0 ].trim() ][ 'offsety' ];
								}
								else
								{
									json[ 'joydown' + ctrl[ 0 ].trim().substring( 8 ) ].offsety = 8;

								}

							}

							if( json[ 'joyup' + ctrl[ 0 ].trim().substring( 8 ) ] == undefined )
							{
								json.controls.push( 'joyup' + ctrl[ 0 ].trim().substring( 8 ) );
								json[ 'joyup' + ctrl[ 0 ].trim().substring( 8 ) ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsety' ] )
								{
									json[ 'joyup' + ctrl[ 0 ].trim().substring( 8 ) ].offsety = "" + ( parseFloat( json[ ctrl[ 0 ].trim() ][ 'offsety' ] ) * -1 );
								}
								else
								{
									json[ 'joyup' + ctrl[ 0 ].trim().substring( 8 ) ].offsety = -8;
								}
							}

							if( json[ 'joyright' + ctrl[ 0 ].trim().substring( 8 ) ] == undefined )
							{
								json.controls.push( 'joyright' + ctrl[ 0 ].trim().substring( 8 ) );
								json[ 'joyright' + ctrl[ 0 ].trim().substring( 8 ) ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'joyright' + ctrl[ 0 ].trim().substring( 8 ) ].offsetx = json[ ctrl[ 0 ].trim() ][ 'offsetx' ];
								}
								else
								{
									json[ 'joyright' + ctrl[ 0 ].trim().substring( 8 ) ].offsetx = 8;
								}
							}

							if( json[ 'joyleft' + ctrl[ 0 ].trim().substring( 8 ) ] == undefined )
							{
								json.controls.push( 'joyleft' + ctrl[ 0 ].trim().substring( 8 ) );
								json[ 'joyleft' + ctrl[ 0 ].trim().substring( 8 ) ] = {};
								if( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] )
								{
									json[ 'joyleft' + ctrl[ 0 ].trim().substring( 8 ) ].offsetx = "" + ( parseFloat( json[ ctrl[ 0 ].trim() ][ 'offsetx' ] ) * -1 );
								}
								else
								{
									json[ 'joyleft' + ctrl[ 0 ].trim().substring( 8 ) ].offsetx= -8;
								}
							}
						}
					}
				}

				if( json[ 'none' ] == undefined )
				{
					json.controls.push( 'none' );
					json[ 'none' ] = 
					{
						offsetx: 0
					};
				}
			}
			args.controler = json;
		}
		catch( e )
		{
			self.load_error = true;
			self.load_done = true;
			throw "sprite_controlers_error";
		}
	}

	if( args.Physic != undefined && args.Physic != '' )
	{
		args.Body = undefined;
		switch( args.Physic.trim().toLowerCase() )
		{
			case 'platform':
				args.Body = AOZBodies.Platform( args, bob, self ); 
				break;
			case 'aabb':
				args.Body = AOZBodies.AABB( args, bob, self ); 
				break;
			case 'ball':
				args.Body = AOZBodies.Ball( args, bob, self ); 
				break;	
			case 'aabb':
				args.Body = AOZBodies.Rectangle( args, bob, self ); 
				break;					
		}
		
		if( args.Body )
		{
			self.World.add( self.physicEngine.world, [ args.Body.body ] );
			self.actor_activePhysic2D();
		}
	
	}
	else
	{
		if( bobParam.Physic != undefined && bobParam.Physic != '' )
		{
			args.Physic = bobParam.Physic;
		}
	}
	
	if( args.OnChange == undefined || args.OnChange == '' )
	{
		if( bobParam.OnChange ) args.OnChange = bobParam.OnChange;
	}
	
	if( args.OnCollision == undefined || args.OnCollision == '' )
	{
		if( bobParam.OnCollision ) args.OnCollision = bobParam.OnCollision;
	}
	else
	{
		bobParam.OnCollision = args.OnCollision;
	}

	if( args.OnAnimChange == undefined || args.OnAnimChange == '' )
	{
		if( bobParam.OnAnimChange ) args.OnAnimChange = bobParam.OnAnimChange;
	}
	
	if( args.StartX != args.EndX || args.StartY != args.EndY || args.StartAlpha != args.EndAlpha || args.StartScaleX != args.EndScaleX || args.StartScaleY != args.EndScaleY || args.StartSkewX != args.EndSkewX || args.StartSkewY != args.EndSkewY || args.StartAngle != args.EndAngle )
	{
	
		if( args.lookAtObject && args.lookAtObject.object )
		{
			args.tween = createjs.Tween.get( display, { loop: args.LoopMove, override: true } )
			.to( { x: args.EndX, y: args.EndY, alpha: args.EndAlpha, scaleX: args.EndScaleX, scaleY: args.EndScaleY, skewX: args.EndSkewX, skewY: args.EndSkewY }, args.Duration, createjs.Ease[ args.Transition ] );
		}
		else
		{
			args.tween = createjs.Tween.get( args.display, { loop: args.LoopMove, override: true } )
			.to( { x: args.EndX, y: args.EndY, alpha: args.EndAlpha, scaleX: args.EndScaleX, scaleY: args.EndScaleY, skewX: args.EndSkewX, skewY: args.EndSkewY, rotation: args.EndAngle, rotationDir: 0 }, args.Duration, createjs.Ease[ args.Transition ] );
		}

		bob.tween = args.tween;
		args.tween.currentPosition = 0;
		
		args.tween.addEventListener( "change", function( event )
		{
			if( args.tween == undefined || args.tween == null )
			{
				return;
			}
			args.tween.currentPosition++; 
	
			if( bobParam.Body )
			{
				self.Body.setPosition( bobParam.Body.body, { x: event.target.target.x, y: event.target.target.y } );
				bobParam.Body.body.render.sprite.xScale = event.target.target.scaleX;
				bobParam.Body.body.render.sprite.yScale = event.target.target.scaleY;
				bobParam.Body.body.opacity = event.target.target.alpha;
				bobParam.Body.body.isSleeping = !args.Enable;
				bobParam.Body.body.visible = args.Visible;
				self.Body.setAngle( bobParam.Body.body, event.target.target.rotation * ( Math.PI / 180 ) );
			}
			else
			{
				bob.vars.x = event.target.target.x;
				bob.vars.y = event.target.target.y;
				bob.vars.angle = event.target.target.rotation * ( Math.PI / 180 );
				bob.vars.alpha = event.target.target.alpha;
				bob.vars.scaleX = event.target.target.scaleX;
				bob.vars.scaleY = event.target.target.scaleY;
				bob.vars.skewX = event.target.target.skewX;
				bob.vars.skewY = event.target.target.skewY;
				
				bob.vars.visible = args.Visible;
			}
			
			if( args.OnChange && args.OnChange != "" )
			{
				var options =
				{
					EVENT$: "onchange",
					INDEX: !isNaN( args.Id ) ? args.Id : -1,
					INDEX$: '' + args.Id,
					X: bob.vars.x,
					Y: bob.vars.y,
					ALPHA: bob.vars.alpha,
					ANGLE: ( event.target.target.rotation ),
					SCALEX: bob.vars.scaleX,
					SCALEY: bob.vars.scaleY,
					HREV: bob.vars.hRev,
					VREV: bob.vars.vRev,
					SKEWX: bob.vars.skewX,
					SKEWY: bob.vars.skewY
				}
				options = getActorEvent( options.EVENT$, args, options );
				application.aoz.runProcedure( args.OnChange, options , args );
			}
		}, false );

		args.tween.addEventListener( "complete", function( event )
		{
			if( args.tween == undefined || args.tween == null )
			{
				return;
			}			
			args.tween.currentPosition = 0;
				
			if( bobParam.Body )
			{
				self.Body.setPosition( bobParam.Body.body, { x: args.EndX, y: args.EndY } );
				bobParam.Body.body.render.sprite.xScale = args.EndScaleX;
				bobParam.Body.body.render.sprite.yScale = args.EndScaleY;
				bobParam.Body.body.opacity = args.EndAlpha;
				bobParam.Body.body.isSleeping = !args.Enable;
				bobParam.Body.body.visible = args.Visible;
				self.Body.setAngle( bobParam.Body.body, args.EndAngle * ( Math.PI / 180 ) );
			}
			else
			{				
				bob.vars.x = args.EndX;
				bob.vars.y = args.EndY;
				bob.vars.angle = args.EndAngle * ( Math.PI / 180 );
				bob.vars.alpha = args.EndAlpha;
				bob.vars.scaleX = args.EndScaleX;
				bob.vars.scaleY = args.EndScaleY;
				bob.vars.skewX = args.EndSkewX;
				bob.vars.skewY = args.EndSkewY;
				bob.vars.visible = args.Visible;				
			}
			args.X = args.EndX;
			args.Y = args.EndY;
			args.StartX = args.EndX;
			args.StartY = args.EndY;
			args.Scale = args.EndScale;
			args.StartScale = args.EndScale;
			args.ScaleX = args.EndScaleX;				
			args.StartScaleX = args.EndScaleX;				
			args.ScaleY = args.EndScaleY;				
			args.StartScaleY = args.EndScaleY;				
			args.SkewX = args.EndSkewX;				
			args.StartSkewX = args.EndSkewX;				
			args.SkewY = args.EndSkewY;				
			args.StartSkewY = args.EndSkewY;				
			args.Alpha = args.EndAlpha;
			args.StartAlpha = args.EndAlpha;				
			createjs.Tween.removeTweens( event.target.target );
			args.tween = undefined; 
			self.bobParams[ actName ] = args;
			
			if( args.OnChange && args.OnChange != "" )
			{
				var options =
				{
					EVENT$: "oncomplete", 
					INDEX: !isNaN( args.Id ) ? args.Id : -1,
					INDEX$: '' + args.Id,
					X: bob.vars.x,
					Y: bob.vars.y,
					ALPHA: bob.vars.alpha,
					ANGLE: ( args.EndAngle ),
					SCALEX: bob.vars.scaleX,
					SCALEY: bob.vars.scaleY,
					HREV: bob.vars.hRev,
					VREV: bob.vars.vRev,
					SKEWX: bob.vars.skewX,
					SKEWY: bob.vars.skewY	
				}
				options = getActorEvent( options.EVENT$, args, options );				
				application.aoz.runProcedure( args.OnChange, options, args );
			}
		}, false );
	}

	if( args.tween )
	{
		switch( args.ActionMove.toLowerCase() )
		{
			case 'play':
				args.tween.setPaused( false );
				break;

			case 'pause':
				args.tween.setPaused( true );
				break;
		};
	}
	
	if( args.currentFrame == undefined )
	{
		args.currentFrame = 0;
		args.tmAnim = -1;
	}
	
	if( bobParam.userData != args.userData && args.userData != '-1001.0' )
	{
		bobParam.userData = args.userData;
	}
	else
	{
		if( bobParam.userData == undefined )
		{
			bobParam.userData = '';
		}
	}

	if( self.bobParams[ actName ] == undefined || self.bobParams[ actName ] == null || self.bobParams[ actName ] == '' )
	{
		self.bobParams[ actName ] = {};
	}
	
	bob.vars.visible = args.Visible;
	args.updated = true;
	self.bobParams[ actName ] = args;
	bobParam.updated = false;
	bobParam = self.bobParams[ actName ];
	copyActorImage( bobParam, bobParam.Image );
	bob.vars.enable = false;
	if( self.childrens == undefined )
	{
		self.childrens = new Array();
	}
	
	if( !self.childrens.includes( actName ) )
	{
		self.childrens.push( actName );
	}

}

function actor_keyLoop( ac )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	var index = self.childrens[ ac ];
	if( index == undefined )
	{
		return;
	}

	if( index.indexOf( "act_" ) != -1 )
	{
		index = parseInt( index.substring( 4 ) );
	}

	var actName = ( !isNaN( index ) ) ? 'act_' + index : index;
	var bob2Param = self.bobParams[ actName ];
	if( bob2Param == undefined || bob2Param.display == undefined )
	{
		return;
	}

	bob2Param.updated = true;
	var bob2 = self.aoz.currentScreen.getBob( index );
	if( bob2 == undefined || bob2 == null )
	{
		return;
	}
	
	bob2.vars.visible = bob2Param.Visible;
	bob2.vars.enable = bob2Param.Enable;

	/**
	 * BEHAVIORS
	 */
	if( bob2Param.behaviors && bob2Param.Enable )
	{
		for( var b in bob2Param.behaviors )
		{
			var behavior = bob2Param.behaviors[ b ];
			if( behavior != undefined )
			{
				if( behavior.auto != undefined )
				{
					behavior.auto( bob2Param )
				}
			}

			if( behavior != undefined && behavior.state != undefined && behavior.state == 1 )
			{
				if( behavior.render != undefined )
				{
					behavior.render( bob2Param );
				}
		   
				if( behavior.procedure != undefined && behavior.procedure != '' )
				{
					var options =
					{
						EVENT$: 'onbehavior',
						CONTROL$: behavior.key,
						BEHAVIOR$: b,
						STATE: behavior.state,
						INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
						INDEX$: '' + bob2.Index	
					}
					options = getActorEvent( options.EVENT$, bob2Param, options );					
					application.aoz.runProcedure( behavior.procedure, options, bob2Param );
				}
			}
			bob2Param.behaviors[ b ] = behavior;
			bob2Param.updated = true;
			self.bobParams[ actName ] = bob2Param;
		}
	}

	/**
	 * ANIMATION hors spritesheet
	 */
	if( !bob2Param.sprite && ( bob2Param.spriteSheet == undefined || bob2Param.spriteSheet == '' ) && bob2Param.animPlaying && bob2Param.Enable && bob2Param.Visible )
	{
		if( bob2Param.currentAnimation )
		{
			if( bob2Param.currentAnimFrame != undefined )
			{
				var frame = bob2Param.currentAnimation.frames[ bob2Param.currentAnimFrame ];
				if( frame && Date.now() - bob2Param.animTempo >= frame.delay )
				{
					bob2Param.updated = false;

					if( bob2Param.animDirection == 0 )
					{
						bob2Param.currentAnimFrame++;
						if( bob2Param.currentAnimFrame == bob2Param.currentAnimation.frames.length )
						{
							if( bob2Param.OnAnimChange != undefined && bob2Param.OnAnimChange != '' )
							{
								var options =
								{
									EVENT$: 'onanimcomplete',
									INDEX: isNaN( index ) ? -1 : index,
									INDEX$: '' + index,
									ANIM$: bob2Param.Anim,
									FRAME: bob2Param.currentAnimFrame,
									TOTALFRAMES: bob2Param.currentAnimation.frames.length
								};
								options = getActorEvent( options.EVENT$, bob2Param, options );								
								application.aoz.runProcedure( bob2Param.OnAnimChange, options, bob2Param );							
							}

							if( bob2Param.currentAnimation.loop )
							{
								bob2Param.currentAnimFrame = 0;
								bob2Param.animDirection = 0;
							}

							if( bob2Param.currentAnimation.reverse )
							{
								bob2Param.currentAnimFrame = bob2Param.currentAnimation.frames.length - 1;
								bob2Param.animDirection = 1;
							}
						}
					}

					if( bob2Param.animDirection == 1 )
					{
						bob2Param.currentAnimFrame--;
						if( bob2Param.currentAnimFrame == -1 )
						{
							bob2Param.currentAnimFrame = 0;
							bob2Param.animDirection = 0;
						}						
					}

					if( bob2Param.OnAnimChange != undefined && bob2Param.OnAnimChange != '' )
					{
						var options =
						{
							EVENT$: 'onanimchange',
							INDEX: isNaN( index ) ? -1 : index,
							INDEX$: '' + index,
							ANIM$: bob2Param.Anim,
							FRAME: bob2Param.currentAnimFrame,
							TOTALFRAMES: bob2Param.currentAnimation.frames.length
						};
						options = getActorEvent( options.EVENT$, bob2Param, options );						
						application.aoz.runProcedure( bob2Param.OnAnimChange, options, bob2Param );							
					}

					bob2Param.animTempo = Date.now();
					bob2Param.Image = frame.index;

					bob2 = self.aoz.currentScreen.bob( index, { x: bob2Param.X, y: bob2Param.Y }, frame.index );
				}
				self.bobParams[ actName ] = bob2Param;
			}
		}
	}
	
	var noControls = true;
	self.aoz.currentScreen.setModified();
	self.aoz.currentScreen.bobsToUpdate = true;
	bob2.vars.modified = true;
	bob2.updateCollisionData();
	bob2.toUpdateCollisions = true;
	bob2.update( { force: true } );	
	bob2Param.updated = false;

	if( bob2Param.OnCollision && bob2Param.OnCollision != "" && bob2Param.Collision && bob2.vars.visible && bob2.vars.alpha > 0 && bob2Param.Enable )
	{
		for( var c = 0; c < self.childrens.length; c++ )
		{
			var testParam = self.bobParams[ self.childrens[ c ] ];
			var testBob = undefined;
			if( testParam )
			{
				testBob = self.aoz.currentScreen.getBob( testParam.Id );
			}
			
			if( testBob && testParam && testParam.Id && bob2.index != testParam.Id && testParam.Collision && testParam.Visible && testParam.Enable && testBob.vars.alpha > 0 )
			{
				if( testBob )
				{
					var coll = actor_col( { index: bob2.Index, index2: testBob.Index, image: '', group: '' } );					

					if ( coll )
					{
						var options =
						{
							EVENT$: 'oncollision',
							INDEX1: !isNaN( bob2.Index ) ? bob2.Index : -1,
							INDEX1$: '' + bob2.Index,
							ACTOR1: !isNaN( bob2.Index ) ? bob2.Index : -1,
							ACTOR1$: '' + bob2.Index,
							INDEX2: !isNaN( testBob.Index ) ? testBob.Index : -1,
							INDEX2$: '' + testBob.Index,
							ACTOR2: !isNaN( testBob.Index ) ? testBob.Index : -1,
							ACTOR2$: '' + testBob.Index,							
							IMAGE: !isNaN( testBob.vars.image ) ? testBob.vars.image : -1,
							IMAGE$: '' + testBob.vars.image,
							GROUP1$: bob2Param.Group,
							GROUP2$: testParam.Group,
							ANIM1$: bob2Param.Anim,
							ANIM2$: testParam.Anim
						};
						options = getActorEvent( options.EVENT$, bob2Param, options );						
						application.aoz.runProcedure( bob2Param.OnCollision, options, bob2Param );
					}
				}
			}
		}
	}
	if( self.actorMouse )
	{ 
		self.mouseOnActor = true;		
	}
	else
	{
		self.mouseOnActor = false;		
	}
	
	if( bob2Param.lookAtObject && bob2Param.lookAtObject.object && bob2Param.Enable )
	{
		var ax = ( bob2.vars.x - bob2.imageObject.hotSpotX ) + ( bob2.vars.width / 2 );
		var ay = ( bob2.vars.y - bob2.imageObject.hotSpotY );
		var bx = ( bob2.vars.x - bob2.imageObject.hotSpotX ) + ( bob2.vars.width / 2 )
		var by = ( bob2.vars.y - bob2.imageObject.hotSpotY ) + ( bob2.vars.height / 2 )
		var cx = 0;
		var cy = 0;
		switch( bob2Param.lookAtObject.object.toLowerCase() )
		{
			case 'mouse':
				cx = self.aoz.getXMouse();
				cy = self.aoz.getYMouse();
				break;

			case 'actor':
				var objBob = self.aoz.currentScreen.getBob( bob2Param.lookAtObject.name );
				if( objBob )
				{
					cx = objBob.vars.x;
					cy = objBob.vars.y;
				}
				break;

			case 'point':
				cx = bob2Param.lookAtObject.x;
				cy = bob2Param.lookAtObject.y;
				break;
		}

		var radians = Math.atan2( cx - bx, cy - by);
		var degree = ( radians * ( 180 / Math.PI ) * -1 ) + 90;
		if( bob2Param.Body )
		{
			self.Body.setAngle( bob2Param.Body.body, degree * ( Math.PI / 180 ) );
			bob2Param.Angle = bob2Param.Body.body.angle;
			bob2Param.StartAngle = bob2Param.Body.body.angle;
			bob2Param.EndAngle = bob2Param.Body.body.angle;				
		}
		else
		{
			bob2.vars.angle = degree * ( Math.PI / 180 );
			bob2Param.Angle = bob2.vars.angle;
			bob2Param.StartAngle = bob2.vars.angle;
			bob2Param.EndAngle = bob2.vars.angle;
		}

		if( bob2Param.tween )
		{
			bob2Param.tween.target.rotation = bob2.vars.angle;
		}
	}

	if( bob2Param.Video != undefined && bob2Param.Video != '' )
	{
		bob2Param.updated = true;
		bob2Param.videoObj = extract_video_image( bob2Param.Video );
		if( bob2Param.videoObj == undefined )
		{
			throw "video_not_found";
		}
		if( bob2Param.VideoPlay )
		{
			bob2Param.videoObj.play();
		}
		else
		{
			bob2Param.videoObj.pause();
		}

		if( bob2Param.VideoLoop )
		{
			bob2Param.videoObj.loop = bob2Param.VideoLoop;
		}		
	}

	if( bob2Param.sprite && bob2Param.Enable && !self.paused && bob2Param.display )
	{

		if( bob2Param.tmAnim != -1 && bob2Param.Anim != undefined  && bob2Param.display.spriteSheet && bob2Param.display.spriteSheet._data && bob2Param.display.spriteSheet._data[ bob2Param.Anim ] )
		{
			var delay = ( Date.now() - bob2Param.tmAnim );
			if( delay >= ( 1000 / bob2Param.display.spriteSheet.framerate ) )
			{
				bob2Param.tmAnim = Date.now();
				bob2Param.currentFrame++;
				bob2Param.updated = true;
			}

			if( bob2Param.currentFrame > ( bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length - 1 ) )
			{
				if( bob2Param.OnAnimChange && bob2Param.OnAnimChange != "" )
				{
					var options =
					{
						EVENT$: 'onanimcomplete',
						INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
						INDEX$: '' + bob2.Index,
						ANIM$: bob2Param.Anim,
						FRAME: bob2Param.currentFrame,
						TOTALFRAMES: bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length
					};
					options = getActorEvent( options.EVENT$, bob2Param, options );					
					application.aoz.runProcedure( bob2Param.OnAnimChange, options, bob2Param );
				}

				if( bob2Param.LoopAnim )
				{
					bob2Param.currentFrame = 0;
				}
				else
				{
					bob2Param.tmAnim = -1;
				}
			}
			else
			{
				actor_getAnimationFrame( bob2Param );	
				bob2Param.updated = true;

				if( bob2Param.OnAnimChange && bob2Param.OnAnimChange != "" )
				{
					var options =
					{
						EVENT$: 'onanimchange',
						INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
						INDEX$: '' + bob2.Index,
						ANIM$: bob2Param.Anim,
						FRAME: bob2Param.currentFrame,
						TOTALFRAMES: bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length
					};
					options = getActorEvent( options.EVENT$, bob2Param, options );	
					application.aoz.runProcedure( bob2Param.OnAnimChange, options, bob2Param );
				}				
			}
			self.bobParams[ actName ] = bob2Param;
		}
		
	}

	var gamepads = navigator.getGamepads ? navigator.getGamepads() : ( navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [] );
	if( gamepads )
	{
		for( var i = 0; i < gamepads.length; i++ ) {
			self.keys[ 'joystick' + i ] = false;
			var gp = gamepads[ i ];
			if( gp )
			{
				for( b = 0; b < gp.buttons.length; b++ )
				{
					if( b == 0 )
					{
						self.keys[ 'joyup' + i ] = gp.buttons[ b ].pressed;
					}

					if( b == 1 )
					{
						self.keys[ 'joyright' + i ] = gp.buttons[ b ].pressed;
					}

					if( b == 2 )
					{
						self.keys[ 'joydown' + i ] = gp.buttons[ b ].pressed;
					}

					if( b == 3 )
					{
						self.keys[ 'joyleft' + i ] = gp.buttons[ b ].pressed;
					}

					self.keys[ 'joybutton' + i + '(' + b + ')' ] = gp.buttons[ b ] .pressed;
					if( gp.buttons[ b ].pressed && self.keys[ 'joy' + i ] == false )
					{
						self.keys[ 'joystick' + i ] = true;
					}
				}

				for( a = 0; a < gp.axes.length; a++ )
				{
					if( a == 0 )
					{
						self.keys[ 'joyleft' + i ] = Math.round( gp.axes[ a ] ) < -0.5;
						if( self.keys[ 'joyleft' + i ] && self.keys[ 'joy' + i ] == false )
						{
							self.keys[ 'joystick' + i ] = true;
						}
					}

					if( a == 0 )
					{
						self.keys[ 'joyright' + i ] = Math.round( gp.axes[ a ] ) > 0.5 ;
						if( self.keys[ 'joyright' + i ] && self.keys[ 'joy' + i ] == false )
						{
							self.keys[ 'joystick' + i ] = true;
						}
					}

					if( a == 1 )
					{
						self.keys[ 'joydown' + i ] = Math.round( gp.axes[ a ] ) > 0.5;
						if( self.keys[ 'joydown' + i ] && self.keys[ 'joy' + i ] == false )
						{
							self.keys[ 'joystick' + i ] = true;
						}
					}

					if( a == 1 )
					{
						self.keys[ 'joyup' + i ] = Math.round( gp.axes[ a ] ) < -0.5;
						if( self.keys[ 'joyup' + i ] && self.keys[ 'joy' + i ] == false )
						{
							self.keys[ 'joystick' + i ] = true;
						}
					}
					self.keys[ 'joyaxes' + i+ '(' + a + ')' ] = gp.axes[ a ].toFixed(4);
				}
			}
		}
	}

	if( bob2Param.controler && bob2Param.controler.controls && bob2Param.Enable && !self.paused )
	{
		self.keys[ 'none' ] = true;
		for( c = 0; c < bob2Param.controler.controls.length; c++ )
		{
			if( bob2Param.controler.controls[ c ] )
			{
				if( bob2Param.controler.controls[ c ] == 'auto' || bob2Param.controler.controls[ c ] == 'mouse' )
				{
					self.keys[ bob2Param.controler.controls[ c ] ] = true;
					if( bob2Param.controler.controls[ c ] == 'mouse' )
					{
						if( bob2Param.controler[ 'mouse' ] == undefined )
						{
							 bob2Param.controler[ 'mouse' ] = 
							 {
								honly: 'false',
								vonly: 'false'
							 };
						}
					}
				}

				if( self.keys[ bob2Param.controler.controls[ c ] ] )
				{
					var key = bob2Param.controler[ bob2Param.controler.controls[ c ] ];
					if( bob2Param.controler.controls[ c ] != 'none' )
					{
						noControls = false;
						self.keys[ 'none' ] = false;
					}
					
					if( key )
					{	
						if( key.behavior != undefined && key.behavior != '' )
						{
							if( bob2Param.behaviors == undefined || bob2Param.behaviors[ key.behavior ] == undefined )
							{
								throw "behavior_not_found";
							}
							var behavior = bob2Param.behaviors[ key.behavior ];
							if( behavior != undefined && behavior.state != undefined && behavior.state == 0 )
							{
								behavior.state = 1;
								behavior.key = bob2Param.controler.controls[ c ];
							}
							bob2Param.behaviors[ key.behavior ] = behavior;
							self.bobParams[ actName ] = bob2Param;
						}

						if( key.honly != undefined && key.honly == 'true' )
						{
							key.vonly = 'false';
							if( key[ 'offsety' ] != undefined )
							{
								key[ 'offsety' ]  = 0;
							}
						}
						
						if( key.vonly != undefined && key.vonly == 'true' )
						{
							key.honly = 'false';
							if( key[ 'offsetx' ] != undefined )
							{
								key[ 'offsetx' ]  = 0;
							}								
						}
						
						if( key.image && key.image != '' )
						{
							if( bob2Param.Anim )
							{
								bob2Param.Anim="-255";
								bobParam.currentAnimation = undefined;
								bobParam.currentAnimFrame = 0;
								bobParam.animDirection = 0;
								bobParam.animTempo = 0;
								bobParam.animPlaying = false;
							}
							bob2.set( {}, key.image );
							bob2Param.sprite = false;
							self.bobParams[ actName ] = bob2Param;
						}

						if( key.anim != undefined && key.anim.trim() != '' && key.anim != bob2Param.Anim )
						{
							if( self.animations && self.animations[ key.anim ] )
							{
								bob2Param.Anim = key.anim;
								bob2Param.currentAnimation = self.animations[ key.anim ];
								bob2Param.currentAnimFrame = 0;
								bob2Param.animDirection = 0;
								bob2Param.animTempo = 0;
								bob2Param.animPlaying = true;	
								bob2Param.sprite = false;
							}
							else
							{
								if( bob2Param.SpriteSheet && bob2Param.SpriteSheet.trim() != '' && bob2Param.display && bob2Param.display.spriteSheet && bob2Param.display.spriteSheet._data[ key.anim ] )
								{
									bob2Param.Anim = key.anim;
									bob2Param.currentAnimation = bob2Param.display.spriteSheet._data[ key.anim ];
									bob2Param.currentAnimFrame = 0;
									bob2Param.animDirection = 0;
									bob2Param.animTempo = 0;
									bob2Param.animPlaying = true;	

									bob2Param.currentFrame = 0;
									bob2Param.tmAnim = Date.now();
									bob2Param.sprite = true;
								}
								else
								{
									self.bobParams[ actName ] = bob2Param;
									self.load_error = true;
									self.load_done = true;
									throw "animation_not_found";		 
								}
							}
						}
						
						if( bob2Param.controler.controls[ c ] == 'mouse' )
						{

							if( key.honly && key.honly.toLowerCase() == 'false' )
							{
								if( bob2Param.Body )
								{
									bob2Param.Body.body.position.y = self.aoz.fp2Int( self.aoz.getYMouse() );
								}
								else
								{
									bob2.vars.y = self.aoz.fp2Int( self.aoz.getYMouse() );
									bob2Param.Y = bob2.vars.y;
									bob2Param.StartY = bob2.vars.y;
									bob2Param.EndY = bob2.vars.y;									
								}
							}	
							else
							{
								if( bob2Param.Body )
								{
									bob2Param.Body.body.position.x = self.aoz.fp2Int( self.aoz.getXMouse() );
								}
								else
								{								
									bob2.vars.x = self.aoz.fp2Int( self.aoz.getXMouse() );
									bob2Param.X = bob2.vars.x;
									bob2Param.StartX = bob2.vars.x;
									bob2Param.EndX = bob2.vars.x;
								}
							}

							if( key.vonly && key.vonly.toLowerCase() == 'false' )
							{
								if( bob2Param.Body )
								{
									bob2Param.Body.body.position.x = self.aoz.fp2Int( self.aoz.getXMouse() );
								}
								else
								{								
									bob2.vars.x = self.aoz.fp2Int( self.aoz.getXMouse() );
									bob2Param.X = bob2.vars.x;
									bob2Param.StartX = bob2.vars.x;
									bob2Param.EndX = bob2.vars.x;
								}
							}
							else
							{
								if( bob2Param.Body )
								{
									bob2Param.Body.body.position.y = self.aoz.fp2Int( self.aoz.getYMouse() );
								}
								else
								{								
									bob2.vars.y = self.aoz.fp2Int( self.aoz.getYMouse() );
									bob2Param.Y = bob2.vars.y;
									bob2Param.StartY = bob2.vars.y;
									bob2Param.EndY = bob2.vars.y;									
								}
							}
						}
						
						if( key.offsetx )
						{
							if( bob2Param.Body )
							{
								bob2Param.Body.body.position.x += parseFloat( key.offsetx );
							}
							else
							{							
								bob2.vars.x = bob2.vars.x + parseFloat( key.offsetx );
								bob2Param.X = bob2.vars.x;
								bob2Param.StartX = bob2.vars.x;
								bob2Param.EndX = bob2.vars.x;
							}
						}

						if( key.offsety )
						{
							if( bob2Param.Body )
							{
								bob2Param.Body.body.position.y += parseFloat( key.offsety );
							}
							else
							{							
								bob2.vars.y = bob2.vars.y + parseFloat( key.offsety );
								bob2Param.Y = bob2.vars.y;
								bob2Param.StartY = bob2.vars.y;
								bob2Param.EndY = bob2.vars.y;								
							}
						}

						if( key.angle )
						{
							if( bob2Param.Body )
							{
								bob2Param.Body.body.angle += ( parseFloat( key.angle ) * ( Math.PI / 180 ) );
							}
							else
							{							
								bob2.vars.angle = bob2.vars.angle + ( parseFloat( key.angle ) * ( Math.PI / 180 ) );
							}
						}

						if( key.forward )
						{
							if( bob2Param.Body )
							{
								bob2Param.Body.body.position.x += Math.cos( bob2Param.Body.body.angle ) * parseFloat( key.forward );
								bob2Param.Body.body.position.y += Math.sin( bob2Param.Body.body.angle ) * parseFloat( key.forward );
							}
							else
							{							
								bob2.vars.x = bob2.vars.x + Math.cos( bob2.vars.angle ) * parseFloat( key.forward );
								bob2.vars.y = bob2.vars.y + Math.sin( bob2.vars.angle ) * parseFloat( key.forward );
								bob2Param.X = bob2.vars.x;
								bob2Param.StartX = bob2.vars.x;
								bob2Param.EndX = bob2.vars.x;
								bob2Param.Y = bob2.vars.y;
								bob2Param.StartY = bob2.vars.y;
								bob2Param.EndY = bob2.vars.y;								
							}
						}

						if( key.backward )
						{
							if( bob2Param.Body )
							{
								bob2Param.Body.body.position.x += Math.cos( bob2Param.Body.body.angle ) * ( -1 * parseFloat( key.backward ) );
								bob2Param.Body.body.position.y += Math.sin( bob2Param.Body.body.angle ) * ( -1 * parseFloat( key.backward ) );
							}
							else
							{							
								bob2.vars.x = bob2.vars.x + Math.cos( bob2.vars.angle ) * ( -1 * parseFloat( key.backward ) );
								bob2.vars.y = bob2.vars.y + Math.sin( bob2.vars.angle ) * ( -1 * parseFloat( key.backward ) );
								bob2Param.X = bob2.vars.x;
								bob2Param.StartX = bob2.vars.x;
								bob2Param.EndX = bob2.vars.x;
								bob2Param.Y = bob2.vars.y;
								bob2Param.StartY = bob2.vars.y;
								bob2Param.EndY = bob2.vars.y;								
							}							
						}
						
						if( key.hrev != undefined )
						{
							if( key.hrev == 'true' && ( bob2Param.HRev == undefined || bob2Param.HRev == false ) )
							{
								bob2Param.HRev = true;
							}

							if( key.hrev == 'false' && bob2Param.HRev )
							{
								bob2Param.HRev = false;
							}
						}

						if( key.vrev != undefined )
						{
							if( key.vrev == 'true' && ( bob2Param.VRev == undefined || bob2Param.VRev == false ) )
							{
								bob2Param.VRev = true;
							}

							if( key.vrev == 'false' && bob2Param.VRev )
							{
								bob2Param.VRev = false;
							}
						}
					}

					if( bob2Param.OnControl && bob2Param.OnControl != "" && self.keys[ bob2Param.controler.controls[ c ] ] != undefined && self.keys[ bob2Param.controler.controls[ c ] ] != false )
					{
						if( bob2Param.lastControl != bob2Param.controler.controls[ c ] )
						{
							var event = self.keys[ bob2Param.controler.controls[ c ] ];
							if( event != undefined )
							{
								var options =
								{
									EVENT$: "oncontrol",
									CONTROL$: bob2Param.controler.controls[ c ],
									INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
									INDEX$: '' + bob2.Index,
									BUTTON: ( event.button ) ? event.button : -1,
									ALTKEY: ( event.altKey ) ? event.altKey : -1,
									CTRLKEY: ( event.ctrlKey ) ? event.ctrlKey : -1,
									SHIFTKEY: ( event.shiftKey ) ? event.shiftKey : -1,
									METAKEY: ( event.metaKey ) ? event.metaKey : -1,
									MOUSEX: self.aoz.fp2Int( self.aoz.getXMouse() ),
									MOUSEY: self.aoz.fp2Int( self.aoz.getYMouse() )
								};
								options = getActorEvent( options.EVENT$, bob2Param, options );								
								application.aoz.runProcedure( bob2Param.OnControl, options, bob2Param );	
							}
							bob2Param.lastControl = bob2Param.controler.controls[ c ];
						}
					}
				}
			}
		}
	}
	
	bob2.vars.hRev = bob2Param.HRev;
	bob2.vars.vRev = bob2Param.VRev;
	bob2.vars.visible = bob2Param.Visible;
	if( bob2Param.Body )
	{
		bob2Param.X = bob2Param.Body.body.position.x;
		bob2Param.Y = bob2Param.Body.body.position.y;
		bob2Param.Angle = bob2Param.Body.body.angle * ( 180 / Math.PI );
		
		if( bob2Param.display != undefined )
		{
			bob2Param.display.x = bob2Param.Body.body.position.x;
			bob2Param.display.y = bob2Param.Body.body.position.x;
			bob2Param.display.alpha = bob2Param.Body.body.opacity;
			bob2Param.display.scaleX = bob2Param.Body.body.render.sprite.xScale;
			bob2Param.display.scaleY = bob2Param.Body.body.render.sprite.yScale;
			bob2Param.display.skewX = bob2.vars.skewX;
			bob2Param.display.skewY = bob2.vars.skewY;
			bob2Param.display.rotation = bob2Param.Body.body.angle * ( 180 / Math.PI );
			bob2Param.display.visible = bob2Param.Body.body.visible;
		}
	
	}
	else
	{
		bob2Param.X = bob2.vars.x;
		bob2Param.Y = bob2.vars.y;
		bob2Param.Angle = bob2.vars.angle * ( 180 / Math.PI );
		
		if( bob2Param.display != undefined )
		{
			bob2Param.display.x = bob2.vars.x;
			bob2Param.display.y = bob2.vars.y;
			bob2Param.display.alpha = bob2.vars.alpha;
			bob2Param.display.scaleX = bob2.vars.scaleX;
			bob2Param.display.scaleY = bob2.vars.scaleY;
			bob2Param.display.skewX = bob2.vars.skewX;
			bob2Param.display.skewY = bob2.vars.skewY;
			bob2Param.display.rotation = bob2.vars.angle * ( 180 / Math.PI );
			bob2Param.display.visible = bob2.vars.visible;
		}
	}
	var hx = 0;
	var hy = 0;

	if( bob2.imageObject )
	{
		var hx = ( bob2.imageObject.hotSpotX / bob2.vars.scaleX );
		var hy = ( bob2.imageObject.hotSpotY / bob2.vars.scaleY );
	}

	if( bob2Param.hasLimits && bob2Param.Enable )
	{
		if( bob2Param.limits.x1 != undefined && bob2Param.limits.x1 != -1001 && bob2.vars.x < ( bob2Param.limits.x1 + hx ) )
		{
			bob2Param.X = bob2Param.limits.x1 + hx;
			bob2.vars.x = bob2Param.limits.x1 + hx;
			
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if( bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				var options =
				{
					EVENT$: 'onlimit',
					LIMIT$: 'left',
					INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
					INDEX$: '' + bob2.Index
				};
				options = getActorEvent( options.EVENT$, bob2Param, options );				
				application.aoz.runProcedure( bob2Param.OnLimit, options,bob2Param );
			}

		}

		if( bob2Param.limits.x2 != undefined &&  bob2Param.limits.x2 != -1001 && bob2.vars.x > bob2Param.limits.x2 -  hx  )
		{
			bob2Param.X = bob2Param.limits.x2 - hx;
			bob2.vars.x = bob2Param.limits.x2 - hx;

			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}
			if(  bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				var options =
				{
					EVENT$: 'onlimit',
					LIMIT$: 'right',
					INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
					INDEX$: '' + bob2.Index
				};
				options = getActorEvent( options.EVENT$, bob2Param, options );				
				application.aoz.runProcedure( bob2Param.OnLimit, options,bob2Param );
			}

		}

		if( bob2Param.limits.y1 != undefined && bob2Param.limits.y1 != -1001 && bob2.vars.y < bob2Param.limits.y1 + hy )
		{
			bob2Param.Y = bob2Param.limits.y1 + hy;
			bob2.vars.y = bob2Param.limits.y1 + hy;
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if(  bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				var options =
				{
					EVENT$: 'onlimit',
					LIMIT$: 'top',
					INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
					INDEX$: '' + bob2.Index
				};
				options = getActorEvent( options.EVENT$, bob2Param, options );				
				application.aoz.runProcedure( bob2Param.OnLimit, options,bob2Param );
			}

		}

		if( bob2Param.limits.y2 != undefined &&  bob2Param.limits.y2 != -1001 && bob2.vars.y > ( bob2Param.limits.y2 - hy ) )
		{
			bob2Param.Y = bob2Param.limits.y2 - hy;
			bob2.vars.y = bob2Param.limits.y2 - hy;
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if( bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				var options =
				{
					EVENT$: 'onlimit',
					LIMIT$: 'bottom',
					INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
					INDEX$: '' + bob2.Index
				};
				options = getActorEvent( options.EVENT$, bob2Param, options );				
				application.aoz.runProcedure( bob2Param.OnLimit, options,bob2Param );
			}
		}
	}

	copyActorImage(bob2Param, bob2Param.Image );
	self.bobParams[ actName ] = bob2Param;

	if( bob2Param.OnChange && bob2Param.OnChange != "" && bob2Param.Enable )
	{
		var options =
		{
			EVENT$: "onchange",
			INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index,
			INDEX$: '' + bob2.Index,
			X: bob2.vars.x,
			Y: bob2.vars.y,
			ALPHA: bob2.vars.alpha,
			ANGLE: ( bob2.vars.angle * ( 180 / Math.PI ) ),
			SCALEX: bob2.vars.scaleX,
			SCALEY: bob2.vars.scaleY,
			HREV: bob2.vars.hRev,
			VREV: bob2.vars.vRev,
			SKEWX: bob2.vars.skewX,
			SKEWY: bob2.vars.skewY
		};
		options = getActorEvent( options.EVENT$, bob2Param, options );				
		application.aoz.runProcedure( bob2Param.OnChange, options,bob2Param );		
	}
	
	if( bob2Param.Body && bob2Param.Body.update )
	{
		bob2Param.Body.update();
	}
}

function actor_col( options )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}

	var id1 = ( options.index ) ? options.index : '';
	var id2 = ( options.index2 ) ? options.index2 : '';
	var img2 = ( options.image ) ? options.image : '';
	var grp2 = ( options.group ) ? options.group : '';

	var bob1 = self.aoz.currentScreen.getBob( id1 );
	var actName = ( !isNaN( id1 ) ) ? 'act_' + id1 : id1;	
	var testParam1 = self.bobParams[ actName ];

	if( id2 != undefined && id2 != '' )
	{
		var bob2 = self.aoz.currentScreen.getBob( id2 );
		var actName = ( !isNaN( id2 ) ) ? 'act_' + id2 : id2;
		var testParam2 = self.bobParams[ actName ];

		if( bob1 && bob2 && bob1.vars.enable && bob2.vars.enable && bob1.vars.visible && bob2.vars.visible && bob1.vars.alpha > 0 && bob2.vars.alpha > 0 && testParam1.Collision && testParam2.Collision )
		{
			//bob1.updateCollisionData( true );
			//bob2.updateCollisionData( true );
			
			self.aoz.moduleCollisions.collisionList = {}
			if( self.aoz.moduleCollisions.isColliding( bob1, bob2 ) )
			{
				self.aoz.moduleCollisions.collisionList[ bob2.index ] = true;
				return true;
			}
		}
		return false;	

	}
	else
	{
		if( img2 != undefined && img2 != '' )
		{
			for( var c = 0; c < self.childrens.length; c++ )
			{
				var id2 = self.childrens[ c ];
				var actName = ( !isNaN( id2 ) ) ? 'act_' + id2 : id2;
				var testParam2 = self.bobParams[ actName ];
				if( testParam2 && testParam2.Id )
				{	
					var bob2 = self.aoz.currentScreen.getBob( testParam2.Id );
					if( testParam2.Image == img2 )
					{
						if ( bob1 && bob2 && bob2 != bob1 && bob1.vars.enable && bob2.vars.enable && bob1.vars.visible && bob2.vars.visible && bob1.vars.alpha > 0 && bob2.vars.alpha > 0 && testParam1.Collision && testParam2.Collision )
						{
							self.aoz.moduleCollisions.collisionList = {}
							if( self.aoz.moduleCollisions.isColliding( bob1, bob2 ) )
							{
								self.aoz.moduleCollisions.collisionList[ bob2.index ] = true;
								return true;
							}								
						}
					}
				}
			}
		}
		else
		{
			if( grp2 != undefined && grp2 != '' )
			{
				for( var c = 0; c < self.childrens.length; c++ )
				{
					var id2 = self.childrens[ c ];
					var actName = ( !isNaN( id2 ) ) ? 'act_' + id2 : id2;
					var testParam2 = self.bobParams[ actName ];
					if( testParam2 && testParam2.Id )
					{	
						var bob2 = self.aoz.currentScreen.getBob( testParam2.Id );
						if( testParam2.Group.toLowerCase() == grp2.toLowerCase() )
						{
							if ( bob1 && bob2 && bob2 != bob1 && bob1.vars.enable && bob2.vars.enable && bob1.vars.visible && bob2.vars.visible && bob1.vars.alpha > 0 && bob2.vars.alpha > 0 && testParam1.Collision && testParam2.Collision )
							{
								self.aoz.moduleCollisions.collisionList = {}
								if( self.aoz.moduleCollisions.isColliding( bob1, bob2 ) )
								{
									self.aoz.moduleCollisions.collisionList[ bob2.index ] = true;
									return true;
								}								
							}
						}
					}
				}
			}			
		}
		return false;
	}

	return false;
}

function actor_reset( index )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( index == -255 || index == "*" )
	{
		if( self.childrens )
		{
			for( var c = 0; c < self.childrens.length; c++ )
			{
				index = self.bobParams[ self.childrens[ c ] ];
				if( self.bobParams[ self.childrens[ c ] ] != undefined )
				{
					index = self.bobParams[ self.childrens[ c ] ].Id;
					if( self.bobParams[ self.childrens[ c ] ].display != undefined )
					{
						self.bobParams[ self.childrens[ c ] ].display.gotoAndStop();
						self.stage.removeChild( self.bobParams[ self.childrens[ c ] ].display );
						delete self.bobParams[ self.childrens[ c ] ].display;
					}
					delete self.bobParams[ self.childrens[ c ] ];
				}
				
				var bob = self.aoz.currentScreen.getBob( index );
				if( bob != undefined )
				{
					bob.imageObject = undefined;
					bob.vars.x = 0;
					bob.vars.y = 0;
					bob.vars.z = 0;
					bob.vars.scaleX = 1.0;
					bob.vars.scaleY = 1.0;
					bob.vars.angle = 0.0;
					bob.vars.skewX = 0.0;
					bob.vars.skewY = 0.0;
					bob.vars.alpha = 1.0;
					bob.vars.visible = true;
					bob.vars.enable = true;
				}
			}
		}
		self.childrens = new Array();
		self.load_done = true;
		return;
	}
	
	var actName = ( !isNaN( index ) ) ? 'act_' + index : index;	
	if( self.bobParams[ actName ] != undefined )
	{
		if( self.bobParams[ actName ].videoObj != undefined )
		{
			self.bobParams[ actName ].videoObj.pause();
			self.bobParams[ actName ].videoObj.currentTime = 0;
		}
		
		if( self.bobParams[ actName ].display != undefined )
		{
			self.bobParams[ actName ].display.gotoAndStop();
			self.stage.removeChild( self.bobParams[ actName ].display );
			delete self.bobParams[ actName ].display;
		}
		delete self.bobParams[ actName ];
	}
	
	var bob = self.aoz.currentScreen.getBob( index );
	if( bob != undefined )
	{
		bob.imageObject = undefined;
		bob.vars.x = 0;
		bob.vars.y = 0;
		bob.vars.z = 0;
		bob.vars.scaleX = 1.0;
		bob.vars.scaleY = 1.0;
		bob.vars.angle = 0.0;
		bob.vars.skewX = 0.0;
		bob.vars.skewY = 0.0;
		bob.vars.alpha = 1.0;
		bob.vars.visible = true;
		bob.vars.enable = true;
	}
}

function actor_delete( index )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( index == undefined ) index = "*";
	
	if( index == -255 || index == "*" || ( isNaN( index ) && index.toLowerCase() == "all" ) )
	{
		if( self.childrens )
		{
			for( var c = 0; c < self.childrens.length; c++ )
			{
				index = self.bobParams[ self.childrens[ c ] ];
				if( self.bobParams[ self.childrens[ c ] ] != undefined )
				{
					if( self.bobParams[ self.childrens[ c ] ].tween )
					{
						self.bobParams[ self.childrens[ c ] ].tween = undefined;
					}
					
					index = self.bobParams[ self.childrens[ c ] ].Id;
					actor_delete( index );
				}
			}
		}
		self.childrens = new Array();
		self.load_done = true;
		return;
	}

	var groupOk = false;
	if( self.childrens )
	{
		for( var c = 0; c < self.childrens.length; c++ )
		{
			if( index.trim && self.bobParams[ self.childrens[ c ] ] && self.bobParams[ self.childrens[ c ] ].Group && self.bobParams[ self.childrens[ c ] ].Group.trim().toLowerCase() == index.trim().toLowerCase() )
			{
				groupOK = true;
				if( self.bobParams[ self.childrens[ c ] ].tween )
				{
					delete self.bobParams[ self.childrens[ c ] ].tween;
				}
				var index2 = self.childrens[ c ];
				delete self.childrens[ c ];
				actor_delete( self.bobParams[ index2 ].Id );
			}
		}
	}

	if( groupOk )
	{
		self.load_done = true;
		return;
	}

	var actName = ( !isNaN( index ) ) ? 'act_' + index : index;		
	if( self.bobParams[ actName ] != undefined )
	{
		self.bobParams[ actName ].doDelete = true;
		//self.bobParams[ actName ].Visible = false;
		//self.bobParams[ actName ].Enable = false;
		
		if( self.bobParams[ actName ].tween )
		{
			delete self.bobParams[ actName ].tween;// = undefined;
		}

		if( self.bobParams[ actName ].display != undefined )
		{
			self.stage.removeChild( self.bobParams[ actName ].display );
			delete self.bobParams[ actName ].display;// = undefined;
		}
		delete self.bobParams[ actName ];// = undefined;
	}
	
	var bob = self.aoz.currentScreen.getBob( index );
	if( bob == null || bob == undefined )
	{
		var pos = self.childrens.indexOf( index );
		if( pos > -1 )
		{
			delete self.childrens[ pos ];
		}
		return;		
		//throw "actor_not_found";
	}
	
	var contextName = 'application';
	var contextIndex = contextName + ':' + bob.Index;
	var contextIndexName = contextName + ':' + self.aoz.currentScreen.bobsContext.list[ contextIndex ].name;

	if( bob != undefined )
	{
		for( var n = 0; n < self.aoz.currentScreen.bobsContext.listSorted.length; n++ )
		{
			if( self.aoz.currentScreen.bobsContext.listSorted[ n ].Index == bob.Index )
			{
				self.aoz.currentScreen.bobsContext.list[ contextIndex ].indexSorted = n;
			}
		}

		for( var n = 0; n < self.aoz.currentScreen.bobsContext.listSortedInContext[ contextName ].length; n++ )
		{
			if( self.aoz.currentScreen.bobsContext.listSortedInContext[ contextName ][ n ].Index == bob.Index )
			{
				self.aoz.currentScreen.bobsContext.list[ contextIndex ].indexSortedInContext = n;
			}
		}
		self.aoz.currentScreen.bobDestroy( index );
	}
	var pos = self.childrens.indexOf( index );
	delete self.childrens[ pos ];// = undefined;
}

function actor_getValue( index, key )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	var actName = ( !isNaN( index ) ) ? 'act_' + index : index;	
	var bobParam = self.bobParams[ actName ];
	var bob = self.aoz.currentScreen.getBob( index );
	if( bobParam == undefined || bob == undefined )
	{
		return false;
	}
	
	switch( key.toLowerCase() )
	{
		case 'x':
			return bob.vars.x;
			break;
		case 'y':
			return bob.vars.y;
			break;
		case 'z':
			return bob.vars.z;
			break;
		case 'scalex':
			return bob.vars.scaleX;
			break;
		case 'scaley':
			return bob.vars.scaleY;
			break;
		case 'skewx':
			return bob.vars.skewX;
			break;
		case 'skewy':
			return bob.vars.skewY;
			break;
		case 'angle':
			if( bobParam.tween )
			{
				return bobParam.tween.target.rotation;
			}
			else
			{
				return bobParam.Angle;
			}
			break;
		case 'alpha':
			return bob.vars.alpha;
			break;
		case 'anim':
			return bobParam.Anim;
			break;
		case 'frame':
			if( bobParam.currentAnimation )
			{
				if( bobParam.currentAnimFrame != undefined )
				{		
					return bobParam.currentAnimFrame;
				}
			}	
			return bobParam.currentFrame;
			break;
		case 'hrev':
			return bob.vars.hRev;
			break;
		case 'vrev':
			return bob.vars.vRev;
			break;
		case 'width':
			if( bob.imageObject )
			{
				return bob.imageObject.width * bob.vars.scaleX;
			}
			return 0;
			break;
		case 'height':
			if( bob.imageObject )
			{
				return bob.imageObject.height * bob.vars.scaleY;
			}
			return 0;
			break;
		case 'image':
			return bobParam.Image;
			break;
		case 'visible':
			return bobParam.Visible;
			break;
		case 'enable':
			return bobParam.Enable;
			break;
		case 'exists':
			return true;
			break;
		case 'group':
			return bobParam.Group;
			break;
		case 'userdata':
			return ( bobParam.userData && bobParam.userData != '-1001.0' ) ? bobParam.userData : '';
			break;								
	}
	return -1;
}

function actor_getAnimationFrame( bobParam )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	var frame = 0;
	var bob = self.aoz.currentScreen.getBob( bobParam.Id );

	frame = bobParam.display.spriteSheet._frames[ bobParam.display.spriteSheet._data[ bobParam.Anim ].frames[ bobParam.currentFrame ] ];
	var canvas = document.createElement( 'canvas' );
	canvas.sprite = true;
	canvas.width = frame.rect.width;
	canvas.height = frame.rect.height;
	var ctximg = canvas.getContext( '2d' );
	
	ctximg.drawImage( frame.image, frame.rect.x, frame.rect.y, frame.rect.width, frame.rect.height, 0, 0, frame.rect.width, frame.rect.height );
	self.aoz.banks.insertImage( 'images', 'spr_createjs_' + bobParam.Id, undefined, undefined, self.aoz.currentContextName, undefined, canvas, { x: frame.regX, y: frame.regY } );					

	if( bob == undefined )
	{
		bob = self.aoz.currentScreen.bob( bobParam.Id, { x: bobParam.X, y: bobParam.Y }, 'spr_createjs_' + bobParam.Id );
	}

	if( bob.imageObject )
	{
		bob.imageObject.canvas = canvas;
		bob.imageObject.hotSpotX = frame.regX;
		bob.imageObject.hotSpotY = frame.regY;
	}
	else
	{
		var bank =  self.banks.getBank( 1, self.aoz.currentContextName, 'images' )
		bob.imageObject = bank.getElement( 'spr_createjs_' + bobParam.Id );
		bob.imageObject.hotSpotX = frame.regX;
		bob.imageObject.hotSpotY = frame.regY;			
	}	

/**
	bob.updateCollisionData();
	bob.toUpdateCollisions = true;
	bob.update( { force: true } );	
*/
	return bob;
}

function actor_animation( args )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( args == undefined )
	{
		self.load_error = true;
		self.load_done = true;
		throw "arguments_missing";
	}

	if( args.animation == undefined || args.animation == ""  ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "animation_name_not_defined";
	}

	if( args.sequence == undefined || args.sequence == ""  ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "animation_sequence_not_defined";
	}

	if( self.animations == undefined )
	{
		self.animations = {};
	}

	//
	// Sequence$="1:2,2:2,3:2,4:2,5:2,6:2,7:2,8:2,9:2,L"
	// Chaque itération: <N° ou nom de l'image>[:<délai avant image suivante>]
	// Dernière itération: E pour fin, L pour rejouer indéfiniment, R pour reverse
	//
	var anim = 
	{
		frames: [],
		loop: false,
		reverse: false
	};

	if( self.animations[ args.animation ] )
	{
		anim = self.animations[ args.animation ];
	}

	if( args.loopMove != anim.loop && args.loopMove != -1001 )
	{
		anim.loop = args.loopMove;
	}

	if( args.reverseMove != anim.reverse && args.reverseMove != -1001 )
	{
		anim.reverse = args.reverseMove;
	}

	anim.frames = [];
	var iterations = args.sequence.split( "," );
	if( iterations )
	{
		for( var i=0; i < iterations.length; i++ )
		{
			var frame = 
			{
				index: -1,
				delay: 100
			};

			var parts = iterations[ i ].split( ":" );
			if( parts.length > 2 )
			{
				self.load_error = true;
				self.load_done = true;				
				throw "animation_sequence_error";
			}

			switch( parts[ 0 ].toLowerCase().trim() )
			{
				case 'e':
					anim.loop = false;
					anim.reverse = false;
					break;
				
				case 'l':
					anim.loop = true;
					anim.reverse = false;
					break;					

				case 'r':
					anim.loop = false;
					anim.reverse = true;
					break;					

				default:
				{
					var frame = 
					{
						index: ( isNaN( parts[ 0 ].trim() ) ) ? parts[ 0 ].trim() : parseInt( parts[ 0 ].trim() ),
						delay: ( parts[ 1 ] != undefined && parts[ 1 ].trim() && !isNaN( parts[ 1 ].trim() ) ) ? parseInt( parts[ 1 ].trim() ) * 100 : 100
					};
			
					anim.frames.push( frame );
					break;
				}
			}
		}
		self.animations[ args.animation ] = anim;
	}
}

function actor_play( args )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( args == undefined )
	{
		self.load_error = true;
		self.load_done = true;
		throw "arguments_missing";
	}

	if( args.Id== undefined ||  ( isNaN( args.Id ) && args.Id == "" ) ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "argument_Id_missing";
	}

	if( args.animation == undefined || args.animation == ""  ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "animation_name_not_defined";
	}

	var actName = ( !isNaN( args.Id ) ) ? 'act_' + args.Id : args.Id;
	
	var bobParam = self.bobParams[ actName ];
	if( bobParam == undefined || bobParam == null )
	{
		self.load_error = true;
		self.load_done = true;
		throw "actor_not_found";
	}

	if( self.animations == undefined || self.animations[ args.animation ] == undefined )
	{
		self.load_error = true;
		self.load_done = true;
		throw "animation_not_found";		 
	}

	bobParam.currentAnimation = self.animations[ args.animation ];
	bobParam.currentAnimFrame = 0;
	bobParam.animDirection = 0;
	bobParam.animTempo = 0;
	bobParam.animPlaying = true;
	self.bobParams[ actName ] = bobParam;	
}

function actor_stop( args )
{
	var self = actor_module;
	if( self == undefined || self == null )
	{
		return;
	}
	
	if( args == undefined )
	{
		self.load_error = true;
		self.load_done = true;
		throw "arguments_missing";
	}

	if( args.Id== undefined ||  ( isNaN( args.Id ) && args.Id == "" ) ) 
	{
		self.load_error = true;
		self.load_done = true;
		throw "argument_Id_missing";
	}
	var actName = ( !isNaN( args.Id ) ) ? 'act_' + args.Id : args.Id;
	
	var bobParam = self.bobParams[ actName ];
	if( bobParam == undefined || bobParam == null )
	{
		self.load_error = true;
		self.load_done = true;
		throw "actor_not_found";
	}

	bobParam.currentAnimation = undefined;
	bobParam.currentAnimFrame = 0;
	bobParam.animDirection = 0;
	bobParam.animTempo = 0;
	bobParam.animPlaying = false;
	self.bobParams[ actName ] = bobParam;	
}

function actor_behavior( options )
{
	if( options.name == undefined || options.name == '' )
	{
		throw "behavior_name_not_defined";
	}

	if( actor_behaviors  )
	{
		var behavior = function()
		{
			this.state = 1;
			this.key = undefined;
			this.initProc = options.initProc,
			this.onRender = options.renderProc;
			this.parameters =
			{
				public: 
				{
					controls: options.controls
				}
			};
	
			this.render = function( actor )
			{
				var self = this;
				if( self.onRender && self.state == 1 )
				{
					var options2 =
					{
						BEHAVIOR$: options.name,
						STATE: self.state,
						INDEX$: actor.Id,
						KEY$: self.key
					};
					options2 = getActorEvent( options2.EVENT$, actor, options2 );				
					application.aoz.runProcedure( self.onRender, options2, actor );
				}
/**
				var actName = ( !isNaN( actor.Id ) ) ? 'act_' + actor.Id : actor.Id;
				actor_module.bobParams[ actName ] = actor;
				var bob = application.aoz.currentScreen.getBob( actor.Id );
				bob.updateCollisionData();
				bob.toUpdateCollisions = true;
				bob.update( { force: true } );	
*/			
			}			
		};

		actor_behaviors[ options.name ] = behavior;
	}
}
