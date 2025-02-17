var actor_module = undefined;
var act_start = undefined;

navigator.getMedia = ( navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

function actor_mouseevent( event, actor, type )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	var options =
	{
		EVENT$: type,
		INDEX: ( isNaN( actor.Id ) )? -1 : actor.Id,
		INDEX$: "" + actor.Id,
		BUTTON: event.button,
		X: self.aoz.getXMouse(),
		Y: self.aoz.getYMouse(),
		LOCAL_X: self.aoz.getXMouse() - actor.X,
		LOCAL_Y: self.aoz.getYMouse() - actor.Y
	};

	return options;
};

function actor_mousedblclick( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	self.mouseActor.actor = actor_getActorMouse();
	if( self.mouseActor.actor )
	{
		var options = actor_mouseevent( event, self.mouseActor.actor, 'mousedblclick' );
		if( self.mouseActor.actor.OnMouseDblClick && self.mouseActor.actor.OnMouseDblClick.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouseDblClick, options );
		}

		if( self.mouseActor.actor.OnMouse && self.mouseActor.actor.OnMouse.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouse, options );
		}		
	}
};

function actor_mouseclick( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	self.mouseActor.actor = actor_getActorMouse();
	if( self.mouseActor.actor )
	{
		var options = actor_mouseevent( event, self.mouseActor.actor, 'mouseclick' );
		if( self.mouseActor.actor.OnMouseClick && self.mouseActor.actor.OnMouseClick.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouseClick, options )
		}

		if( self.mouseActor.actor.OnMouse && self.mouseActor.actor.OnMouse.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouse, options );
		}	
	}
};

function actor_mousedown( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	self.mouseActor.actor = actor_getActorMouse();
	if( self.mouseActor.actor )
	{
		var options = actor_mouseevent( event, self.mouseActor.actor, 'mousedown' );
		if( self.mouseActor.actor.OnMouseDown && self.mouseActor.actor.OnMouseDown.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouseDown, options )
		}
	}
};

function actor_mouseup( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	self.mouseActor.actor = actor_getActorMouse();
	if( self.mouseActor.actor )
	{
		var options = actor_mouseevent( event, self.mouseActor.actor, 'mouseup' );
		if( self.mouseActor.actor.OnMouseUp && self.mouseActor.actor.OnMouseUp.trim() != '' )
		{
			application.aoz.runProcedure( self.mouseActor.actor.OnMouseUp, options )
		}
	}
};

function actor_mousemove( event )
{
	var self = actor_module; 
	if( self == undefined || self == null )
	{
		return;
	}
	
	if ( self.paused )
		return;

	var memActor = undefined;
	if( self.mouseActor.actor )
	{
		memActor = self.mouseActor.actor;
	}
	self.mouseActor.actor = actor_getActorMouse();

	if( self.mouseActor.actor )
	{
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
					var options = actor_mouseevent( event, memActor, 'mouseexit' );
					application.aoz.runProcedure( memActor.OnMouseExit, options )
					if( memActor.OnMouse && memActor.OnMouse.trim() != '' )
					{
						application.aoz.runProcedure( memActor.OnMouse, options )
					}
				}

				if( self.mouseActor.actor.OnMouseEnter && self.mouseActor.actor.OnMouseEnter.trim() != '' )
				{
					var options = actor_mouseevent( event, self.mouseActor.actor, 'mouseenter' );
					application.aoz.runProcedure( self.mouseActor.actor.OnMouseEnter, options )
					if(self.mouseActor.OnMouse && self.mouseActor.OnMouse.trim() != '' )
					{
						application.aoz.runProcedure( self.mouseActor.OnMouse, options )
					}
				}
			}
		}
		else
		{
			if( self.mouseActor.actor.OnMouseEnter && self.mouseActor.actor.OnMouseEnter.trim() != '' )
			{
				var options = actor_mouseevent( event, self.mouseActor.actor, 'mouseenter' );
				application.aoz.runProcedure( self.mouseActor.actor.OnMouseEnter, options )
				if(self.mouseActor.OnMouse && self.mouseActor.OnMouse.trim() != '' )
				{
					application.aoz.runProcedure( self.mouseActor.OnMouse, options )
				}
			}
		}
	}
	else
	{
		if( memActor )
		{
			if( memActor.OnMouseExit && memActor.OnMouseExit.trim() != '' )
			{
				var options = actor_mouseevent( event, memActor, 'mouseexit' );
				application.aoz.runProcedure( memActor.OnMouseExit, options )
				if( memActor.OnMouse && memActor.OnMouse.trim() != '' )
				{
					application.aoz.runProcedure( memActor.OnMouse, options )
				}
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
				application.aoz.runProcedure( param.OnKeyPress, options );
			}

			if( type == 'keydown' && param.OnKeyDown && param.OnKeyDown.trim() != '' )
			{
				var options = actor_keyevent( event, param, type );
				application.aoz.runProcedure( param.OnKeyDown, options );
			}

			if( type == 'keyup' && param.OnKeyUp && param.OnKeyUp.trim() != '' )
			{
				var options = actor_keyevent( event, param, type );
				application.aoz.runProcedure( param.OnKeyUp, options );
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
		actor_mousedblclick( event );
	}, false );

	window.addEventListener( 'click', function( event )
	{
		actor_mouseclick( event );
	}, false );

	window.addEventListener( 'mousedown', function( event )
	{
		actor_mousedown( event );
	}, false );

	window.addEventListener( 'mouseup', function( event )
	{
		actor_mouseup( event );
	}, false );

	window.addEventListener( 'mousemove', function( event )
	{
		actor_mousemove( event );		
	}, false );

	if( 'ontouchstart' in window )
	{
		window.addEventListener( 'touchstart', function( event )
		{
			actor_mousedown( event );
		}, false );

		window.addEventListener( 'touchmove', function( event )
		{
			actor_mousemove( event );					
		}, false );

		window.addEventListener( 'touchend', function( event )
		{
			actor_mouseup( event );
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
					x: bob2.vars.x - bob2.imageObject.hotSpotX,
					y: bob2.vars.y - bob2.imageObject.hotSpotY,
					width: bob2.imageObject.width * bob2.vars.scaleX,
					height: bob2.imageObject.height * bob2.vars.scaleY
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
						var vendorURL = wiIndow.URL || window.webkitURL;
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
		bobParam = {};
	}
	bobParam.Id = args.Id;
	
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
		}	
	}
	
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
		setTimeout( function()
		{
			if( bobParam.videoObj )
			{
				bobParam.videoObj.pause;
				bobParam.videoObj.currentTime = 0;
			}
		}, 100	);
		bobParam.Image = args.Video + '_img';
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

	if( args.SpriteSheet == undefined || args.SpriteSheet == '' )
	{
		if( bobParam.SpriteSheet )
		{
			args.SpriteSheet = bobParam.SpriteSheet;
			args.sprite = true;
		}
	}

	if( ( args.Image == undefined || args.Image == '' ) && ( args.SpriteSheet == undefined || args.SpriteSheet == '' ) )
	{
		self.load_error = true;
		self.load_done = true;
		throw "no_image_or_spritesheet_defined";
	}

	var bob = self.aoz.currentScreen.bob( args.Id, { x: undefined, y: undefined }, args.Image );

	self.aoz.currentScreen.setModified();
	self.aoz.currentScreen.bobsToUpdate = true;
	bob.update( { force: true } );
	bob.toUpdateCollisions = true;
	
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
	}
	else
	{
		if( bobParam.SpriteSheet )
		{
			args.SpriteSheet = bobParam.SpriteSheet;
		}
	}
	
	if( args.Anim != undefined && args.Anim != '' )
	{
		args.currentFrame = 0;
		args.tmAnim = Date.now();				
		if( args.SpriteSheet != undefined && args.SpriteSheet != '' )
		{
			bob = actor_getAnimationFrame( args );
			args.HotspotX = bob.imageObject.hotSpotX;
			args.HotspotY = bob.imageObject.hotSpotY;
			args.Hotspot= undefined;				
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
		if( bobParam.Alpha )
		{
			args.Alpha = bobParam.Alpha;
		}
		else
		{
			args.Alpha = bob.vars.alpha;
		}
	}
	
	if( args.StartAlpha == undefined || args.StartAlpha == -0.001 )
	{
		if( bobParam.StartAlpha )
		{
			args.StartAlpha = bobParam.StartAlpha;
		}
		else
		{
			if( args.Alpha ) 
			{
				args.StartAlpha = args.Alpha;
			}
			else
			{
				args.StartAlpha = bob.vars.alpha;
			}
		}
	}
	else
	{
		args.Alpha = args.StartAlpha;
	}

	if( args.EndAlpha == undefined || args.EndAlpha == -0.001 )
	{
		if( bobParam.EndAlpha )
		{
			args.EndAlpha = bobParam.EndAlpha;
		}
		else
		{
			if( args.Alpha ) 
			{
				args.EndAlpha = args.Alpha;
			}
			else
			{
				args.EndAlpha = bob.vars.alpha;
			}
		}
	}

	if( args.Angle == undefined || args.Angle == -1001 )
	{
		if( bobParam.Angle )
		{
			args.Angle = bobParam.Angle;
		}
		else
		{
			args.Angle =  bob.vars.angle; 
		}
	}
	else
	{
		bobParam.Angle = args.Angle;
		if( bobParam.Body )
		{
			self.Body.setAngle( bobParam.Body.body, args.Angle * ( Math.PI / 180 ) );
		}
		else
		{
			bob.vars.angle = args.Angle * ( Math.PI / 180 );
		}
	}
	
	if( args.StartAngle == undefined || args.StartAngle == -1001 )
	{
		if( bobParam.StartAngle )
		{
			args.StartAngle = bobParam.StartAngle;
		}
		else
		{
			if( args.Angle )
			{
				args.StartAngle = args.Angle;
			}
			else
			{
				args.StartAngle = bob.vars.angle * ( 180 / Math.PI );  
			}
		}
	}
	else
	{
		args.Angle = args.StartAngle;
	}
	
	if( args.EndAngle == undefined || args.EndAngle == -1001 )
	{
		if( bobParam.EndAngle )
		{
			args.EndAngle = bobParam.EndAngle;
		}
		else
		{
			if( args.Angle )
			{
				args.EndAngle = args.Angle;
			}
			else
			{
				args.EndAngle = bob.vars.angle * ( 180 / Math.PI ); 
			}
		}
	}

	if( args.Scale == undefined || args.Scale == -0.001 )
	{
		if( bobParam.Scale )
		{
			args.Scale = bobParam.Scale;
		}
		else
		{
			args.Scale = 1.0;
		}
	}
	
	if( args.StartScale == undefined || args.StartScale == -0.001 )
	{
		if( bobParam.StartScale )
		{
			args.StartScale = bobParam.StartScale;
		}
		else
		{
			if( args.Scale )
			{
				args.StartScale = args.Scale;
			}
			else
			{
				args.StartScale = 1.0;
			}
		}
	}
	else
	{
		args.Scale = args.StartScale;
	}
	
	if( args.EndScale == undefined || args.EndScale == -0.001 )
	{
		if( args.Scale )
		{
			args.EndScale = args.Scale;			
		}
		else
		{
			if( bobParam.EndScale )
			{
				args.EndScale = bobParam.EndScale;
			}
			else
			{
				args.EndScale = 1.0;
			}
		}
	}
	
	if( args.ScaleX == undefined || args.ScaleX == -0.001 )
	{
		if( args.Scale )
		{
			args.ScaleX = args.Scale;			
		}
		else
		{
			if( bobParam.ScaleX )
			{
				args.ScaleX = bobParam.ScaleX;
			}
			else
			{
				args.ScaleX = 1.0;
			}
		}
	}
	
	if( args.StartScaleX == undefined || args.StartScaleX == -0.001 )
	{
		if( bobParam.StartScaleX )
		{
			args.StartScaleX = bobParam.StartScaleX;
		}
		else
		{
			if( args.ScaleX )
			{
				args.StartScaleX = args.ScaleX;
			}
			else
			{
				if( args.Scale )
				{
					args.StartScaleX = args.Scale;
				}
				else
				{
					args.StartScaleX = bob.vars.scaleX;
				} 
			}
		}
	}
	else
	{
		args.ScaleX = args.StartScaleX;
	}
	
	if( args.EndScaleX == undefined || args.EndScaleX == -0.001 )
	{
		if( bobParam.EndScaleX )
		{
			args.EndScaleX = bobParam.EndScaleX;
		}
		else
		{
			if( args.ScaleX )
			{
				args.EndScaleX = args.ScaleX;
			}
			else
			{
				if( args.Scale )
				{
					args.EndScaleX = args.Scale;
				}
				else
				{
					args.EndScaleX = bob.vars.scaleX;
				} 
			}
		}
	}

	if( args.ScaleY == undefined || args.ScaleY == -0.001 )
	{
		if( args.Scale )
		{
			args.ScaleY = args.Scale;			
		}
		else
		{
			if( bobParam.ScaleY )
			{
				args.ScaleY = bobParam.ScaleY;
			}
			else
			{
				args.ScaleY = 1.0;
			}
		}
	}
	
	if( args.StartScaleY == undefined || args.StartScaleY == -0.001 )
	{
		if( bobParam.StartScaleY )
		{
			args.StartScaleY = bobParam.StartScaleY;
		}
		else
		{
			if( args.ScaleY )
			{
				args.StartScaleY = args.ScaleY;
			}
			else
			{
				if( args.Scale )
				{
					args.StartScaleY = args.Scale;
				}
				else
				{
					args.StartScaleY = bob.vars.scaleY;
				} 
			}
		}
	}
	else
	{
		args.ScaleY = args.StartScaleY;
	}
	
	if( args.EndScaleY == undefined || args.EndScaleY == -0.001 )
	{
		if( bobParam.EndScaleY )
		{
			args.EndScaleY = bobParam.EndScaleY;
		}
		else
		{
			if( args.ScaleY )
			{
				args.EndScaleY = args.ScaleY;
			}
			else
			{
				if( args.Scale )
				{
					args.EndScaleY = args.Scale;
				}
				else
				{
					args.EndScaleY = bob.vars.scaleY;
				} 
			}
		}
	}
	
	if( args.SkewX == undefined || args.SkewX == -1001 )
	{
		if( bobParam.SkewX != undefined && bobParam.SkewX != -1001 )
		{
			args.SkewX = bobParam.SkewX;
		}
		else
		{
			args.SkewX = bob.vars.skewX;
		}
	}
	
	if( args.StartSkewX != undefined && args.StartSkewX != -1001 )
	{
		args.StartSkewX = bobParam.StartSkewX;
	}
	else
	{
		if( args.SkewX != undefined && args.SkewX != -1001 )
		{
			args.StartSkewX = args.SkewX;
		}
		else
		{
			args.StartSkewX = bob.vars.skewX;
		}
	}
	
	if( args.EndSkewX == undefined || args.EndSkewX == -1001 )
	{
		if( bobParam.EndSkewX != undefined && bobParam.EndSkewX != -1001 )
		{
			args.EndSkewX = bobParam.EndSkewX;
		}
		else
		{
			if( args.SkewX != undefined && args.SkewX != -1001 )
			{
				args.EndSkewX = args.SkewX;
			}
			else
			{
				args.EndSkewX = bob.vars.skewX;
			}
		}
	}
	
	if( args.SkewY == undefined || args.SkewY == -1001 )
	{
		if( bobParam.SkewY != undefined && bobParam.SkewY != -1001 )
		{
			args.SkewY = bobParam.SkewY;
		}
		else
		{
			args.SkewY = bob.vars.skewY;
		}
	}

	if( args.StartSkewY != undefined && args.StartSkewY != -1001 )
	{
		args.StartSkewY = bobParam.StartSkewY;
	}
	else
	{
		if( args.SkewY != undefined && args.SkewY != -1001 )
		{
			args.StartSkewY = args.SkewY;
		}
		else
		{
			args.StartSkewY = bob.vars.skewY;
		}
	}
	
	if( args.EndSkewY == undefined || args.EndSkewY == -1001 )
	{
		if( bobParam.EndSkewY != undefined && bobParam.SkewX != -1001 )
		{
			args.EndSkewY = bobParam.EndSkewY;
		}
		else
		{
			if( args.SkewY )
			{
				args.EndSkewY = args.SkewY;
			}
			else
			{
				args.EndSkewY = bob.vars.skewY;
			}
		}
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
	
	args.hasLimits = false;
	
	if( args.X1 != undefined && args.X1 != -1001 )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}
		args.limits.x1 = args.X1;
		args.hasLimits = true;
	}

	if( args.Y1 != undefined && args.Y1 != -1001  )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}			
		args.limits.y1 = args.Y1;
		args.hasLimits = true;
	}
	
	if( args.aliasY1 != undefined && args.aliasY1 != -1001  )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}			
		args.limits.y1 = args.aliasY1;
		args.hasLimits = true;
	}
	
	if( args.X2 != undefined && args.X2 != -1001  )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}
		args.limits.x2 = args.X2;
		args.hasLimits = true;
	}

	if( args.Y2 != undefined && args.Y2 != -1001  )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}
		args.limits.y2 = args.Y2;
		args.hasLimits = true;
	}

	if( args.aliasY2 != undefined && args.aliasY2 != -1001  )
	{
		if( args.limits == undefined )
		{
			args.limits =
			{
				x1: undefined,
				y1: undefined,
				x2: undefined,
				y2: undefined
			};			
		}			
		args.limits.y2 = args.aliasY2;
		args.hasLimits = true;
	}
	
	if( args.limits == undefined )
	{
		if( bobParam.limits )
		{
			args.limits = bobParam.limits;
			args.hasLimits = true;
		}
	}

	//bob.limits = args.limits;
	
	if( args.Hotspot == undefined || args.Hotspot == '' || args.Hotspot == 'none' )
	{
		if( bobParam.Hotspot )
		{
			args.Hotspot = bobParam.Hotspot;
		}
	}
	
	if( args.Hotspot != undefined && args.Hotspot != '' )
	{
		switch( args.Hotspot.trim().toLowerCase() )
		{
				
			case 'none':
			case 'top-left':
			case '$00':
				args.HotspotX = 0;
				args.HotspotY = 0;
				break;

			case 'top-middle':
			case '$10':
				args.HotspotX = bob.imageObject.width / 2;
				args.HotspotY = 0;
				break;	
				
			case 'top-right':
			case '$20':
				args.HotspotX = bob.imageObject.width;
				args.HotspotY = 0;
				break;

			case 'left':
			case '$01':
				args.HotspotX = 0;
				args.HotspotY = bob.imageObject.height / 2;
				break;

			case 'middle':
			case '$11':
				args.HotspotX = bob.imageObject.width / 2;
				args.HotspotY = bob.imageObject.height / 2;
				break;	
				
			case 'right':
			case '$21':
				args.HotspotX = bob.imageObject.width;
				args.HotspotY = bob.imageObject.height / 2;
				break;

			case 'bottom-left':
			case '$20':
				args.HotspotX = 0;
				args.HotspotY = bob.imageObject.height;
				break;

			case 'bottom-middle':
			case '$21':
				args.HotspotX = bob.imageObject.width / 2;
				args.HotspotY = bob.imageObject.height;
				break;	
				
			case 'bottom-right':
			case '$22':
				args.HotspotX = bob.imageObject.width;
				args.HotspotY = bob.imageObject.height;
				break;					
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
	
	if( bob.imageObject )
	{
		bob.imageObject.hotSpotX = args.HotspotX;
		bob.imageObject.hotSpotY = args.HotspotY;
		bob.vars.hotspotX = args.HotspotX;
		bob.vars.hotspotY = args.HotspotY;		
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
	display.regX = bob.vars.hotspotX;
	display.regY = bob.vars.hotspotY;
	display.visible = args.Visible;

	bob.vars.visible = args.Visible;
	self.aoz.currentScreen.setModified();
	self.aoz.currentScreen.bobsToUpdate = true;
	bob.update( { force: true } );
	bob.toUpdateCollisions = true;
			
	if( !args.sprite )
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
			self.aoz.currentScreen.setModified();
			self.aoz.currentScreen.bobsToUpdate = true;
			bob.update( { force: true } );
			bob.toUpdateCollisions = true;
			
			if( args.OnChange && args.OnChange != "" )
			{
				self.aoz.runProcedure( args.OnChange, { EVENT$: "onchange", INDEX: !isNaN( args.Id ) ? args.Id : -1, INDEX$: '' + args.Id, X: bob.vars.x, Y: bob.vars.y, ALPHA: bob.vars.alpha, ANGLE: ( event.target.target.rotation ), SCALEX: bob.vars.scaleX, SCALEY: bob.vars.scaleY, HREV: bob.vars.hRev, VREV: bob.vars.vRev, SKEWX: bob.vars.skewX, SKEWY: bob.vars.skewY  } );
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

			self.aoz.currentScreen.setModified();
			self.aoz.currentScreen.bobsToUpdate = true;
			bob.toUpdateCollisions = true;
			bob.update( { force: true } );
			
			if( args.OnChange && args.OnChange != "" )
			{
				self.aoz.runProcedure( args.OnChange, { EVENT$: "oncomplete", INDEX: !isNaN( args.Id ) ? args.Id : -1, INDEX$: '' + args.Id, X: bob.vars.x, Y: bob.vars.y, ALPHA: bob.vars.alpha, ANGLE: ( args.EndAngle ), SCALEX: bob.vars.scaleX, SCALEY: bob.vars.scaleY, HREV: bob.vars.hRev, VREV: bob.vars.vRev, SKEWX: bob.vars.skewX, SKEWY: bob.vars.skewY  } );
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
	
	if( self.bobParams[ actName ] == undefined || self.bobParams[ actName ] == null || self.bobParams[ actName ] == '' )
	{
		self.bobParams[ actName ] = {};
	}

	self.bobParams[ actName ] = args;
	
	if( self.childrens == undefined )
	{
		self.childrens = new Array();
	}
	
	if( !self.childrens.includes( actName ) )
	{
		self.childrens.push( actName );
	}

	bob.vars.visible = args.Visible;
	self.aoz.currentScreen.setModified();
	self.aoz.currentScreen.bobsToUpdate = true;
	bob.updateCollisionData();
	bob.toUpdateCollisions = true;
	bob.update( { force: true } );

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

	if( bob2Param.doDelete )
	{
		actor_delete( index );
		return;
	}

	var bob2 = self.aoz.currentScreen.getBob( index );
	if( bob2 == undefined || bob2 == null )
	{
		return;
	}
	bob2.vars.visible = bob2Param.Visible;
	bob2.vars.enable = bob2Param.Enable;

	if( bob2Param.HotspotX )
	{
		bob2.imageObject.hotSpotX = bob2Param.HotspotX;
	}

	if( bob2Param.HotspotY )
	{
		bob2.imageObject.hotSpotY = bob2Param.HotspotY;
	}
	
	var noControls = true;
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
						self.aoz.runProcedure( bob2Param.OnCollision, { EVENT$: 'oncollision', INDEX1: !isNaN( bob2.Index ) ? bob2.Index : -1, INDEX1$: '' + bob2.Index, INDEX2: !isNaN( testBob.Index ) ? testBob.Index : -1, INDEX2$: '' + testBob.Index, IMAGE: !isNaN( testBob.vars.image ) ? testBob.vars.image : -1 , IMAGE$: '' + testBob.vars.image, GROUP1$: bob2Param.Group, GROUP2$: testParam.Group, ANIM1$: bob2Param.Anim, ANIM2$: testParam.Anim  } );
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
			}

			if( bob2Param.currentFrame > ( bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length - 1 ) )
			{
				if( bob2Param.OnAnimChange && bob2Param.OnAnimChange != "" )
				{
					self.aoz.runProcedure( bob2Param.OnAnimChange, { EVENT$: 'onanimcomplete', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index, ANIM$: bob2Param.Anim, FRAME: bob2Param.currentFrame, TOTALFRAMES: bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length } );
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

				if( bob2Param.OnAnimChange && bob2Param.OnAnimChange != "" )
				{
					self.aoz.runProcedure( bob2Param.OnAnimChange, { EVENT$: 'onanimchange', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index, ANIM$: bob2Param.Anim, FRAME: bob2Param.currentFrame, TOTALFRAMES: bob2Param.display.spriteSheet._data[ bob2Param.Anim ].frames.length } );
				}				
			}
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
	
	if( bob2Param.Id == 'magic' )
	{
		console.log( "Actor enabled: " + bob2Param.Enable );
		console.log( "bob enabled: " + bob2.vars.enable );
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
								bob2Param.Anim = undefined;
								bob2Param.tmAnim = -1;
								bob2Param.display.currentFrame = 0;
							}
							bob2.set( {}, key.image );
							bob2Param.sprite = false;
						}

						if( key.anim != undefined && key.anim != '' && key.anim != bob2Param.Anim && bob2Param.sprite )
						{
							bob2Param.Anim = key.anim;
							bob2Param.tmAnim = Date.now();
							bob2Param.display.currentFrame = 0;
							bob2Param.currentFrame = 0;
							bob2 = actor_getAnimationFrame( bob2Param );			
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
								self.aoz.runProcedure( bob2Param.OnControl, { EVENT$: "oncontrol", CONTROL$: bob2Param.controler.controls[ c ], INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index, BUTTON: ( event.button ) ? event.button : -1, ALTKEY: ( event.altKey ) ? event.altKey : -1, CTRLKEY: ( event.ctrlKey ) ? event.ctrlKey : -1, SHIFTKEY: ( event.shiftKey ) ? event.shiftKey : -1, METAKEY: ( event.metaKey ) ? event.metaKey : -1, MOUSEX: self.aoz.fp2Int( self.aoz.getXMouse() ), MOUSEY: self.aoz.fp2Int( self.aoz.getYMouse() ) } );	
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
	
	var hx = ( bob2.imageObject.hotSpotX / bob2.vars.scaleX );
	var hy = ( bob2.imageObject.hotSpotY / bob2.vars.scaleY );
	
	if( bob2Param.hasLimits && bob2Param.Enable )
	{
		if( bob2Param.limits.x1 != undefined &&  bob2Param.limits.x1 != -1001 && bob2.vars.x < ( bob2Param.limits.x1 + hx ) )
		{
			if( bob2Param.Body )
			{
				bob2Param.Body.body.position.x = bob2Param.limits.x1 + hx;
			}
			else
			{
				bob2.vars.x = bob2Param.limits.x1 + hx;
			}
			
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if( bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				self.aoz.runProcedure( bob2Param.OnLimit, { EVENT$: 'onlimit', LIMIT$: 'left', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index } );
			}

		}

		if( bob2Param.limits.x2 != undefined &&  bob2Param.limits.x2 != -1001 && bob2.vars.x > ( ( bob2Param.limits.x2 - ( bob2.imageObject.width * bob2.vars.scaleX ) + hx  ) ) )
		{
			if( bob2Param.Body )
			{
				bob2Param.Body.body.position.x = ( bob2Param.limits.x2 - ( bob2.imageObject.width * bob2.vars.scaleX ) ) + hx;
			}
			else
			{
				bob2.vars.x = ( bob2Param.limits.x2 - ( bob2.imageObject.width * bob2.vars.scaleX ) ) + hx;
			}
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}
			if(  bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				self.aoz.runProcedure( bob2Param.OnLimit, { EVENT$: 'onlimit', LIMIT$: 'right', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index } );
			}

		}

		if( bob2Param.limits.y1 != undefined &&  bob2Param.limits.y1 != -1001 && bob2.vars.y < bob2Param.limits.y1 - hy )
		{
			if( bob2Param.Body )
			{
				bob2Param.Body.body.position.y = bob2Param.limits.y1 - hy;
			}
			else
			{
				bob2.vars.y = bob2Param.limits.y1 - hy;
			}
			
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if(  bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				self.aoz.runProcedure( bob2Param.OnLimit, { EVENT$: 'onlimit', LIMIT$: 'top', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index } );
			}

		}

		if( bob2Param.limits.y2 != undefined &&  bob2Param.limits.y2 != -1001 && bob2.vars.y > ( ( bob2Param.limits.y2 - ( bob2.imageObject.height * bob2.vars.scaleY ) ) + hy ) )
		{
			if( bob2Param.Body )
			{
				bob2Param.Body.body.position.y = ( ( bob2Param.limits.y2 - ( bob2.imageObject.height * bob2.vars.scaleY ) ) + hy );
			}
			else
			{
				bob2.vars.y = ( ( bob2Param.limits.y2 - ( bob2.imageObject.height * bob2.vars.scaleY ) ) + hy );
			}
			
			if( bob2Param.tween )
			{
				bob2Param.tween.paused = true;
				bob2Param.tween = undefined;
			}

			if( bob2Param.OnLimit && bob2Param.OnLimit != "" )
			{
				self.aoz.runProcedure( bob2Param.OnLimit, { EVENT$: 'onlimit', LIMIT$: 'bottom', INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index } );
			}
		}
	}

	if( bob2Param.OnChange && bob2Param.OnChange != "" && bob2Param.Enable )
	{
		self.aoz.runProcedure( bob2Param.OnChange, { EVENT$: "onchange", INDEX: isNaN( bob2.Index ) ? -1 : bob2.Index, INDEX$: '' + bob2.Index, X: bob2.vars.x, Y: bob2.vars.y, ALPHA: bob2.vars.alpha, ANGLE: ( bob2.vars.angle * ( 180 / Math.PI ) ), SCALEX: bob2.vars.scaleX, SCALEY: bob2.vars.scaleY, HREV: bob2.vars.hRev, VREV: bob2.vars.vRev, SKEWX: bob2.vars.skewX, SKEWY: bob2.vars.skewY } );
	}
	
	if( bob2Param.Body && bob2Param.Body.update )
	{
		bob2Param.Body.update();
	}
	
	self.bobParams[ actName ] = bob2Param;
	self.aoz.currentScreen.setModified();
	self.aoz.currentScreen.bobsToUpdate = true;
	bob2.vars.modified = true;
	bob2.updateCollisionData();
	bob2.toUpdateCollisions = true;
	bob2.update( { force: true } );	
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
			bob1.updateCollisionData( true );
			bob2.updateCollisionData( true );
			
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
					if( bob2.vars.image == img2 )
					{
						if ( bob1 && bob2 && bob2 != bob1 && bob1.vars.enable && bob2.vars.enable && bob1.vars.visible && bob2.vars.visible && bob1.vars.alpha > 0 && bob2.vars.alpha > 0 && testParam1.Collision && testParam2.Collision )
						{
							bob1.updateCollisionData( true );
							bob2.updateCollisionData( true );
							
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
						if( testParam.Group.toLowerCase() == grp2.toLowerCase() )
						{
							if ( bob1 && bob2 && bob2 != bob1 && bob1.vars.enable && bob2.vars.enable && bob1.vars.visible && bob2.vars.visible && bob1.vars.alpha > 0 && bob2.vars.alpha > 0 && testParam1.Collision && testParam2.Collision )
							{
								bob1.updateCollisionData( true );
								bob2.updateCollisionData( true );
								
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
	
	var actName = ( !isNaN( index ) ) ? 'act_' + index : index;		
	if( self.bobParams[ actName ] != undefined )
	{
		
		self.bobParams[ actName ].doDelete = true;
		self.bobParams[ actName].Visible = false;
		self.bobParams[ actName ].Enable = false;
		
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
	if( bob != undefined )
	{
		
		bob.vars.visible = false;
		bob.vars.enable = false;
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
	
	var frame = bobParam.display.spriteSheet._frames[ bobParam.display.spriteSheet._data[ bobParam.Anim ].frames[ bobParam.currentFrame ] ];
	var canvas = document.createElement( 'canvas' );
	canvas.sprite = true;
	canvas.width = frame.rect.width;
	canvas.height = frame.rect.height;
	var ctximg = canvas.getContext( '2d' );
	
	ctximg.drawImage( frame.image, frame.rect.x, frame.rect.y, frame.rect.width, frame.rect.height, 0, 0, frame.rect.width, frame.rect.height );

	self.aoz.banks.insertImage( 'images', 'spr_createjs_' + bobParam.Id, undefined, undefined, self.aoz.currentContextName, undefined, canvas, { x: frame.regX, y: frame.regY } );					
	
	var bob = self.aoz.currentScreen.getBob( bobParam.Id );
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


	bob.updateCollisionData();
	bob.toUpdateCollisions = true;
	bob.update( { force: true } );	

	return bob;
}


