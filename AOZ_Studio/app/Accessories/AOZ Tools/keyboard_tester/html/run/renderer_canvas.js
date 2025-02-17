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
* And in the file license.pdf.                                                 *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * Canvas rendering context
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function RenderingContext2D( renderer, canvas, platform, display )
{
	this.renderer = renderer;
	this.aoz = renderer.aoz;
	this.filters = new this.aoz.utilities.DrawFilters( this.aoz, renderer );
	this.canvas = canvas;
	this.context = canvas.getContext( '2d' );
	this.platform = platform;
	this.width = canvas.width;
	this.height = canvas.height;
	this.display = display;
	this.resetDisplay = true;
	this.redrawBars = true;
	this.halted = false;
	this.viewOn = true;
	this.doubleBuffer = false;

	// Load the full screen icons
	var self = this;
	if ( this.display.fullScreenIcon )
	{
		self.aoz.utilities.loadUnlockedImages(
		[
			'./run/resources/full_screen.png',
			'./run/resources/small_screen.png',
		], {}, function ( response, images, extra )
		{
			if ( response )
				self.fullScreenIcons = images;
			else
				self.aoz.loadingError = 'file_not_found';
		} );
	}	
	return this;
}
RenderingContext2D.prototype.init = function( eventList )
{
	var self = this;
	if ( eventList )
	{
		this.eventList = eventList;
		for ( var e in eventList )
		{
			this.canvas.addEventListener( e, function( event )
			{
				if ( typeof event.touches != 'undefined' )
				{
					for ( var t = 0; t < event.touches.length; t++ )
					{
						event.touches[ t ].aozInfo = self.getCoordinatesFromEvent( event.touches[ t ] );		
					}
				}
				if ( typeof event.changedTouches != 'undefined' )
				{
					for ( var t = 0; t < event.changedTouches.length; t++ )
					{
						event.changedTouches[ t ].aozInfo = self.getCoordinatesFromEvent( event.changedTouches[ t ] );		
					}
				}
				if ( typeof event.targetTouches != 'undefined' )
				{
					for ( var t = 0; t < event.targetTouches.length; t++ )
					{
						event.targetTouches[ t ].aozInfo = self.getCoordinatesFromEvent( event.targetTouches[ t ] );		
					}
				}
				else
				{
				event.aozInfo = self.getCoordinatesFromEvent( event );
				}				
				eventList[ event.type ]( event );
			}, false );
		}

		this.doResize = function() 
		{ 
			var width, height;
			//if ( this.display.fullScreen || this.display.fullPage )
			{
				if ( !self.canvas.parentElement || self.canvas.parentElement === document.body ) 
				{
					width = window.innerWidth;
					height = window.innerHeight;
				}
				else 
				{
						width = self.canvas.parentElement.clientWidth;
						height = self.canvas.parentElement.clientHeight;
					}
				}
				self.resize( true, width, height );
		};
		window.addEventListener( "resize", this.doResize );
	}
	this.doResize();
	this.blackAtFirst = true;
	setTimeout( function()
	{
		self.blackAtFirst = false;
	}, 250 );
};
RenderingContext2D.prototype.end = function()
{
	if ( this.eventList )
	{
		for ( var e in this.eventList )
			this.canvas.removeEventListener( e, this.eventList[ e ] );
		//window.removeEventListener( 'resize', this.doResize )
	}
};
RenderingContext2D.prototype.resize = function( force, width, height )
{
	if( force || width != this.width || height != this.height )
	{
		this.width = width;
		this.height = height;

		this.canvas.width = width;
		this.canvas.height = height;
		this.fullScreenIconRatio = width / this.display.width;
		this.redrawBars = true;
		this.resetDisplay = true;
		this.forceOnce = true
		this.setDisplayArea();
	}
};
RenderingContext2D.prototype.setDisplayArea = function()
{
	this.scaleX = typeof this.display.scaleX != 'undefined' ? this.display.scaleX : 1;
	this.scaleY = typeof this.display.scaleY != 'undefined' ? this.display.scaleY : 1;
	this.background = typeof this.display.background != 'undefined' ? this.display.background : 'color';
	this.backgroundColor = typeof this.display.backgroundColor != 'undefined' ? this.display.backgroundColor : '#000000';
	
	// Display FPS?
	if ( this.display.fps )
	{
		var height = this.aoz.utilities.getFontStringHeight( this.display.fpsFont );
		this.fpsRectX = this.display.fpsX;
		this.fpsRectY = this.display.fpsY;
		this.fpsRectWidth = this.context.measureText( 'XXX FPS' ).width;
		this.fpsRectHeight = height;
	}

	// Drawing area
	this.xLeftDraw = 0;
	this.yTopDraw = 0;
	this.widthDraw = this.width;
	this.heightDraw = this.height;

	this.doClip = false;
	if ( this.display.fullPage || this.display.fullScreen )
	{
		if ( this.display.keepProportions )
		{
			var originalRatio = this.display.width / this.display.height;
			var w = this.heightDraw * originalRatio;
			var h = this.widthDraw / originalRatio;
			if ( h <= this.heightDraw )
			{
				this.widthDraw = h * originalRatio;
				this.heightDraw = h;
			}
			else
			{
				this.widthDraw = w;
				this.heightDraw = w / originalRatio;
			}
			this.doClip = true;
		}
	}
	this.xLeftDraw = ( this.width - this.widthDraw ) / 2;
	this.yTopDraw = ( this.height - this.heightDraw ) / 2;

	switch( this.platform )
	{
		case 'amiga':
			this.hardLeftX = 110;
			this.hardWidth = 342;
			switch( this.tvStandard )
			{
				default:
				case 'pal':
					this.hardTopY = 30;
					this.hardHeight = 311 - this.hardTopY;
					break;
				case 'ntsc':
					this.hardTopY = 30;
					this.hardHeight = 261 - this.hardTopY;
					break;
			}
			break;
		default:
			this.hardLeftX = 0;
			this.hardTopY = 0;
			this.hardWidth = this.display.width;
			this.hardHeight = this.display.height;
			break;
	}	
	this.xRatioDisplay = this.widthDraw / this.hardWidth;
	this.yRatioDisplay = this.heightDraw / this.hardHeight;
};
// Drawing filters
RenderingContext2D.prototype.setFilter = function( args )
{
	this.filters.setFilter( args );
};
RenderingContext2D.prototype.delFilter = function( args )
{
	this.filters.delFilter( args );
};
RenderingContext2D.prototype.getFilter = function( args )
{
	return this.filters.getFilter( args );
};
RenderingContext2D.prototype.getFilterString = function()
{
	return this.filters.getFilterString();
};
RenderingContext2D.prototype.updateForScreenOrientation = function()
{
/**
	console.log( this );
	console.log( event );
	if( window.orientation == 0 || this.aoz.orientation == "landscape" )
	{

		this.canvas.width = this.aoz.copyDimension.height;
		this.canvas.height = this.aoz.copyDimension.width;

		this.aoz.currentScreen.canvas.width = this.aoz.copyDimension.height;
		this.aoz.currentScreen.canvas.height = this.aoz.copyDimension.width;
		this.aoz.currentScreen.dimension.width = this.aoz.copyDimension.height;
		this.aoz.currentScreen.dimension.height = this.aoz.copyDimension.width;
		this.aoz.currentScreen.vars.width = this.aoz.copyDimension.height;
		this.aoz.currentScreen.vars.height = this.aoz.copyDimension.width;
		this.aoz.currentScreen.currentTextWindow.width = this.aoz.copyDimension.textHeight;
		this.aoz.currentScreen.currentTextWindow.height = this.aoz.copyDimension.textWidth;
		this.aoz.currentScreen.varsUpdated.width = this.aoz.copyDimension.height;
		this.aoz.currentScreen.varsUpdated.height = this.aoz.copyDimension.width;
	}
	else
	{
		this.canvas.width = this.aoz.copyDimension.width;
		this.canvas.height = this.aoz.copyDimension.height;

		this.aoz.currentScreen.canvas.width = this.aoz.copyDimension.width;
		this.aoz.currentScreen.canvas.height = this.aoz.copyDimension.height;
		this.aoz.currentScreen.dimension.width = this.aoz.copyDimension.width;
		this.aoz.currentScreen.dimension.height = this.aoz.copyDimension.height;
		this.aoz.currentScreen.vars.width = this.aoz.copyDimension.width;
		this.aoz.currentScreen.vars.height = this.aoz.copyDimension.height;
		this.aoz.currentScreen.currentTextWindow.width = this.aoz.copyDimension.textWidth;
		this.aoz.currentScreen.currentTextWindow.height = this.aoz.copyDimension.textHeight;
		this.aoz.currentScreen.varsUpdated.width = this.aoz.copyDimension.width;
		this.aoz.currentScreen.varsUpdated.height = this.aoz.copyDimension.height;
	}

	this.canvas.setAttribute( 'style', 'position: absolute; left:0px; top: 0px; width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px' );
	this.aoz.currentScreen.fontHeight = this.aoz.currentScreen.canvas.width / this.aoz.currentScreen.currentTextWindow.width;
	//this.fullScreenIconRatio = this.width / this.manifest.display.width;
	this.redrawBars = true;
	this.resetDisplay = true;
	this.forceOnce = true;
*/
}
RenderingContext2D.prototype.getCoordinatesFromEvent = function( event, offsetLeft, offsetTop )
{
	var info = 
	{
		renderingContext: this
	};
	if ( typeof event.clientX != 'undefined' )
	{
		offsetLeft = typeof offsetLeft == 'undefined' ? this.canvas.offsetLeft : offsetLeft;
		offsetTop = typeof offsetTop == 'undefined' ? this.canvas.offsetTop : offsetTop;
		info.x = ( event.clientX - ( offsetLeft + this.xLeftDraw ) ) / this.xRatioDisplay + this.hardLeftX;
		info.y = ( event.clientY - ( offsetTop + this.yTopDraw ) ) / this.yRatioDisplay + this.hardTopY;
	}
	return info;
}
RenderingContext2D.prototype.getDocumentCoordPercentages = function( x, y, screen )
{
	if ( screen )
	{
		var xDrawScreen, yDrawScreen;
		if ( screen.isCenteredX )
			xDrawScreen = this.xLeftDraw + this.widthDraw / 2 - screen.dimension.width * screen.scale.x - this.hardLeftX * this.xRatioDisplay;
		else
			xDrawScreen = ( screen.vars.x - this.hardLeftX ) * this.xRatioDisplay  + this.xLeftDraw;
		if ( screen.isCenteredY )
			yDrawScreen = this.yTopDraw + this.heightDraw / 2 - screen.dimension.height * screen.scale.y - this.hardTopY * this.yRatioDisplay;
		else
			yDrawScreen = ( screen.vars.y - this.hardTopY ) * this.yRatioDisplay + this.yTopDraw;
		var xScaleScreen = screen.vars.scaleX * screen.renderScale.x * this.xRatioDisplay / screen.scale.x;
		var yScaleScreen = screen.vars.scaleY * screen.renderScale.y * this.yRatioDisplay / screen.scale.y;
		var deltaX = screen.vars.hotspotX * this.xRatioDisplay * screen.vars.scaleX;
		var deltaY = screen.vars.hotspotY * this.yRatioDisplay * screen.vars.scaleY;

		return {
			x: ( ( x * screen.renderScale.x * xScaleScreen * screen.scale.x + xDrawScreen - deltaX ) / this.width ) * 100,
			y: ( ( y * screen.renderScale.y * yScaleScreen * screen.scale.y + yDrawScreen - deltaY ) / this.height ) * 100
		};
	}
	return {
		x: ( ( ( x - this.hardLeftX ) * this.xRatioDisplay + this.xLeftDraw ) / this.width ) * 100,
		y: ( ( ( y - this.hardTopY ) * this.yRatioDisplay + this.yTopDraw ) / this.height ) * 100
	};
}
RenderingContext2D.prototype.getDocumentSizePercentages = function( width, height, screen )
{
	if ( screen )
	{
		var xScaleScreen = screen.vars.scaleX * screen.renderScale.x * this.xRatioDisplay;
		var yScaleScreen = screen.vars.scaleY * screen.renderScale.y * this.yRatioDisplay;
		return {
			width: width * xScaleScreen / this.width * 100,
			height: height * yScaleScreen / this.height * 100
		};
	}
	return {
		width: width * this.xRatioDisplay / this.width * 100,
		height: height * this.yRatioDisplay / this.height * 100
	};

}
RenderingContext2D.prototype.setCursorStyle = function( style )
{
	this.canvas.style.cursor = style;
}
RenderingContext2D.prototype.setHalted = function( halted )
{
	this.halted = halted;
}
RenderingContext2D.prototype.imageLoaded = function( image, infos )
{
}
RenderingContext2D.prototype.newImage = function( image, infos )
{
}
RenderingContext2D.prototype.addScreen = function( screen, options )
{
}
RenderingContext2D.prototype.delScreen = function( screen )
{
}
RenderingContext2D.prototype.addBob = function( bob, options )
{
}
RenderingContext2D.prototype.delBob = function( bob )
{
}
RenderingContext2D.prototype.addSprite = function( sprite, options )
{
}
RenderingContext2D.prototype.delSprite = function( sprite )
{
}
RenderingContext2D.prototype.captureCrash = function()
{
}
RenderingContext2D.prototype.setBackgroundColor = function( color )
{
	if ( typeof color == 'undefined' )
		this.display.background = 'transparent';
	else
	{
		this.display.background = 'color';
		this.display.backgroundColor = color;
	}
	this.resetDisplay = true;
	this.modified = true;
};
RenderingContext2D.prototype.setModified = function()
{
	this.modified = true;
}
RenderingContext2D.prototype.isInFullScreenIcon = function( position )
{
	if ( this.fullScreenIconOn )
	{
		if ( position.x >= this.fullScreenIconX && position.x < this.fullScreenIconX + this.fullScreenIconWidth
		  && position.y >= this.fullScreenIconY && position.y < this.fullScreenIconY + this.fullScreenIconHeight )
		  	return true;
	}
	return false;
};
RenderingContext2D.prototype.swapFullScreen = function()
{
	if ( document.fullscreenEnabled )
	{
		if ( this.fullScreenIconOn == 'full_screen' )
			this.canvas.requestFullscreen();
		else
			document.exitFullscreen();
	}
}
RenderingContext2D.prototype.meditate = function( reneringContext, error )
{
	var meditations1 =
	[
		'BAAAAAAD',
		'BAADF00D',
		'BADDCAFE',
		'8BADF00D',
		'1BADB002',
		'ABADBABE',
		'DEAD2BAD',
		'DEADBAAD',
		'DEADBABE',
		'DEADBEAF',
		'DEADC0DE',
	];
	var meditations2 =
	[
		'CODECACA',
		'CODEBAAD',
		'B16B00B5',
		'B105F00D',
		'BEEFBABE',
		'CAFEBABE',
		'CAFED00D',
		'DABBAD00',
		'DAEBA000',
		'FACEFEED',
		'FBADBEEF',
		'FEE1DEAD',
		'FEEDBABE',
		'FEEDC0DE'
	];

	this.guruMeditation =
	{
		sx: this.canvas.width,
		sy: 160,
		borderOn: false
	}
	this.guruMeditation.sLine = this.guruMeditation.sy / 20,
	this.guruMeditation.fontHeight = this.guruMeditation.sy / 6,
	this.guruMeditation.sxBorder = this.guruMeditation.sx / 40;
	this.guruMeditation.syBorder = this.guruMeditation.sy / 8;
	this.guruMeditation.yText1 = this.guruMeditation.sy / 2 - this.guruMeditation.fontHeight;
	this.guruMeditation.yText2 = this.guruMeditation.sy / 2 + this.guruMeditation.fontHeight;
	this.guruMeditation.guru1 = meditations1[ Math.floor( Math.random() * meditations1.length ) ];
	this.guruMeditation.guru2 = meditations2[ Math.floor( Math.random() * meditations2.length ) ];

	// Shift image down
	this.context.drawImage( this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, this.guruMeditation.sy, this.canvas.width, this.canvas.height - this.guruMeditation.sy );
	this.guruMeditation.borderOn = true;
	this.drawGuruMeditation();

	// Draw meditation
	var self = this;
	this.guruMeditation.handle = setInterval( function()
	{
		self.guruMeditation.borderOn = !self.guruMeditation.borderOn;
		self.drawGuruMeditation();
	}, 1000 );
};
RenderingContext2D.prototype.drawGuruMeditation = function()
{
	this.context.fillStyle = '#000000';
	this.context.globalAlpha = 1;
	this.context.fillRect( 0, 0, this.guruMeditation.sx, this.guruMeditation.sy );

	if ( this.guruMeditation.borderOn )
	{
		this.context.strokeStyle = '#FF0000';
		this.context.setLineDash( [] );
		this.context.lineWidth =  this.guruMeditation.sLine;
		this.context.strokeRect( this.guruMeditation.sxBorder, this.guruMeditation.syBorder, this.guruMeditation.sx - this.guruMeditation.sxBorder * 2, this.guruMeditation.sy - this.guruMeditation.syBorder * 2 );
	}

	this.context.textAlign = "center";
	this.context.textBaseline = "middle";
	this.context.fillStyle = '#FF0000';
	this.context.font = this.guruMeditation.fontHeight + 'px Arial';
	var text = 'Software Failure. Press left mouse button to continue.';
	if ( this.aoz.crashInfo )
		text = 'Software Failure. Press left mouse button to send a report.';
	this.context.fillText( text, this.guruMeditation.sx / 2, this.guruMeditation.yText1 );
	this.context.fillText( 'Magician Meditation #' + this.guruMeditation.guru1 + '.' + this.guruMeditation.guru2, this.guruMeditation.sx / 2, this.guruMeditation.yText2 );
};

RenderingContext2D.prototype.setDoubleBuffer = function()
{
	this.doubleBuffer = true;
};
RenderingContext2D.prototype.autoback = function( mode )
{
	if ( mode == 0 )
		this.viewOn = false;
	else
		this.viewOn = true;
};
RenderingContext2D.prototype.screenSwap = function()
{
	if ( !this.doubleBuffer )
		throw { error: 'illegal_function_call', parameter: '(double buffer not set)' };
	if ( !this.viewOn )
		this.render( true );
};
RenderingContext2D.prototype.setView = function( onOff )
{
	this.viewOn = onOff;
};
RenderingContext2D.prototype.view = function( onOff )
{
	this.viewOn = true;
	this.render( true );
};
RenderingContext2D.prototype.clearDisplay = function()
{
	// Reset display
	if ( this.display.background == 'transparent' )
	{
		if ( this.resetDisplay )
			this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
		else
			this.context.clearRect( this.xLeftDraw, this.yTopDraw, this.widthDraw, this.heightDraw );
	}
	else
	{
		this.context.fillStyle = this.display.backgroundColor;
		if ( this.resetDisplay )
			this.context.fillRect( 0, 0, this.width, this.height );
		else
			this.context.fillRect( this.xLeftDraw, this.yTopDraw, this.widthDraw, this.heightDraw );				
	}
	this.resetDisplay = false;
}
RenderingContext2D.prototype.render = function( force, isDebugger )
{	
	if ( this.blackAtFirst )
		return;
	
	force = typeof force == 'undefined' ? false : true;
	force |= this.forceOnce;
	this.forceOnce = false;
	this.isDebugger = isDebugger;
	
	var self = this;
	if ( !this.aoz.crash && !this.rendering && ( force || ( this.modified && this.viewOn ) ) )
	{
		this.rendering = true;
		
		this.context.save();
		this.context.globalAlpha = 1.0;
		this.context.filter = this.filters.getFilterString();
		this.aoz.utilities.setPixelated( this.canvas, this.display.smoothing );
		var screensToDraw = [];
		
		this.setDisplayArea();
		this.clearDisplay();

		// If full screen, clip!
		if ( this.doClip )
		{
			path = new Path2D();
			path.rect( this.xLeftDraw, this.yTopDraw, this.widthDraw, this.heightDraw );
			this.context.clip( path );
		}

		// Rainbows in back
		if ( this.aoz.moduleRainbows && this.aoz.moduleRainbows.context )
		{
			for ( var rainbow = this.aoz.moduleRainbows.context.getFirstElement( this.aoz.currentContextName ); rainbow != null; rainbow = this.aoz.moduleRainbows.context.getNextElement( this.aoz.currentContextName ) )
			{
				if ( rainbow.toBack )
				{
					rainbow.render( this.context, 
					{
						width: this.width,
						height: this.height,
						xLeftDraw: this.xLeftDraw,
						yTopDraw: this.yTopDraw, 
						xRatioDisplay: this.xRatioDisplay,
						yRatioDisplay: this.yRatioDisplay,
						hardLeftX: this.hardLeftX,
						hardTopY: this.hardTopY
					} );
				}
			}
		}

		// Draw screens
		var alwaysOnTops = false;
		if ( this.aoz.screensContext.isAny() )
		{
			// Update the bobs and sprites
			this.aoz.rendererUpdate();
			this.aoz.screensContext.parseSorted( undefined, function( screen1, screen2 )
			{				
				if ( screen1.alwaysOnTop )
				{
					alwaysOnTops = true;
					return 1;
				}
				if ( screen2.alwaysOnTop )
				{
					alwaysOnTops = true;
					return -1;
				}
				if ( screen1.vars.z < screen2.vars.z )
					return -1;
				if ( screen1.vars.z > screen2.vars.z )
					return 1;
				if ( screen1.index < screen2.index )
					return -1;
				if ( screen1.index > screen2.index )
					return 1;
				return 0;
			},
			function( screen )
			{
				if ( !screen.alwaysOnTop )
					self.drawScreen( screen );
				else
					screensToDraw.push( screen );
			} );
		};

		// Rainbows in front
		if ( this.aoz.moduleRainbows && this.aoz.moduleRainbows.context )
		{
			for ( var rainbow = this.aoz.moduleRainbows.context.getFirstElement( this.aoz.currentContextName ); rainbow != null; rainbow = this.aoz.moduleRainbows.context.getNextElement( this.aoz.currentContextName ) )
			{
				if ( rainbow.toFront )
				{
					rainbow.render( this.context, 
					{
						width: this.width,
						height: this.height,
						xLeftDraw: this.xLeftDraw,
						yTopDraw: this.yTopDraw, 
						xRatioDisplay: this.xRatioDisplay,
						yRatioDisplay: this.yRatioDisplay,
						hardLeftX: this.hardLeftX,
						hardTopY: this.hardTopY
					} );
				}
			}
		}

		// Draw sprites
		if ( this.aoz.sprites )
		{
			this.aoz.sprites.context.parseAll( undefined, function( sprite )
			{
				if ( sprite.vars.visible && sprite.canvas )
				{
					if ( sprite.canvas )
					{
						self.context.save();
						self.context.globalAlpha = sprite.vars.alpha;
						self.context.filter = sprite.vars.filters.getFilterString( sprite.vars.filters, self.filters );
						//if ( !sprite.vars.shadowX == 0 || !sprite.vars.shadowY == 0 )
						if ( sprite.vars.shadowColor != null )
						{
							self.context.shadowOffsetX = sprite.vars.shadowX;
							self.context.shadowOffsetY = sprite.vars.shadowY;
							self.context.shadowBlur = sprite.vars.shadowBlur;
							self.context.shadowColor = self.aoz.utilities.getModernRGBAString( sprite.vars.shadowColor );
						}
						var xDraw = ( sprite.positionDisplay.x - self.hardLeftX ) * self.xRatioDisplay + self.xLeftDraw;
						var yDraw = ( sprite.positionDisplay.y - self.hardTopY ) * self.yRatioDisplay + self.yTopDraw;
						if ( sprite.angleDisplay.z == 0 && sprite.skewDisplay.x == 0 && sprite.skewDisplay.y == 0 && sprite.scaleDisplay.x == 1 && sprite.scaleDisplay.y == 1 )
						{
							var deltaX = sprite.hotSpot.x * sprite.scaleDisplay.x * self.xRatioDisplay;
							var deltaY = sprite.hotSpot.y * sprite.scaleDisplay.y * self.yRatioDisplay;
							var width = sprite.imageObject.width * sprite.scaleDisplay.x * self.xRatioDisplay;
							var height = sprite.imageObject.height * sprite.scaleDisplay.y * self.yRatioDisplay;
							self.context.drawImage( sprite.canvas, 0, 0, sprite.canvas.width, sprite.canvas.height, xDraw - deltaX, yDraw - deltaY, width, height );
						}
						else
						{

							self.context.translate( xDraw, yDraw );
							self.context.rotate( sprite.angleDisplay.z );
							self.context.transform( sprite.scaleDisplay.x * self.xRatioDisplay, sprite.skewDisplay.y * sprite.scaleDisplay.y * self.yRatioDisplay, sprite.skewDisplay.x * sprite.scaleDisplay.x * self.xRatioDisplay, sprite.scaleDisplay.y * self.yRatioDisplay, 0, 0 );
							self.context.translate( -sprite.hotSpot.x, -sprite.hotSpot.y );
							self.context.drawImage( sprite.canvas, 0, 0 );
						 }
						 self.context.restore();
					}
				}
			} );
		}

		// Screen always on top
		for ( var s = 0; s < screensToDraw.length; s++ )
			this.drawScreen( screensToDraw[ s ] );

		// All done!
		this.context.restore();
	}

	this.context.filter = 'none';
	if ( this.halted )
	{
		var heightFont = Math.floor( this.width * 0.015 );
		var text = this.halted;
		var x1 = 0;
		var y1 = this.height - heightFont;
		var x2 =  this.width;
		var y2 = this.height * 0.85;
		var xText = ( x1 + x2 ) / 2;
		var yText = ( y1 + y2 ) / 2;

		this.context.fillStyle = this.display.backgroundColor;
		this.context.fillRect( x1, y1, x2 - x1, y2 - y1 );
		this.context.fillStyle = "#E0E0E0";
		this.context.font = heightFont + 'px Verdana';
		this.context.textBaseline = 'middle';
		this.context.textAlign = 'center';
		this.context.fillText( text, xText, yText );
	}
	if ( !this.aoz.crash )
	{
		// Display FPS?
		if ( this.display.fps )
		{
			var text = this.aoz.errors.getErrorFromNumber( 202 ).message;
			text = this.aoz.utilities.replaceStringInText( text, '%1', '' + Math.floor( MainLoop.getFPS() + 0.5 ) );
			this.context.globalAlpha = 0.75;
			this.context.fillStyle = this.backgroundColor;
			this.context.fillRect( this.fpsRectX, this.fpsRectY, this.fpsRectWidth, this.fpsRectHeight );
			this.context.fillStyle = this.display.fpsColor;
			this.context.font = this.display.fpsFont;
			this.context.textBaseline = 'top';
			this.context.textAlign = 'left';
			this.context.fillText( text, this.fpsRectX, this.fpsRectY );
		}

		// Display Full Screen Icons?
		if ( this.aoz.manifest.display.fullScreenIcon && this.fullScreenIcons )
		{
			if ( this.renderer.isFullScreen() )
				this.fullScreenIconOn = 'small_screen';
			else
				this.fullScreenIconOn = 'full_screen';
			var image = this.fullScreenIcons[ this.fullScreenIconOn ];
			this.fullScreenIconX = this.aoz.manifest.display.fullScreenIconX >= 0 ? this.aoz.manifest.display.fullScreenIconX * this.fullScreenIconRatio : this.width + this.aoz.manifest.display.fullScreenIconX  * this.fullScreenIconRatio;
			this.fullScreenIconY = this.aoz.manifest.display.fullScreenIconY >= 0 ? this.aoz.manifest.display.fullScreenIconY * this.fullScreenIconRatio : this.height + this.aoz.manifest.display.fullScreenIconY * this.fullScreenIconRatio;
			this.fullScreenIconWidth = image.width * this.fullScreenIconRatio;
			this.fullScreenIconHeight = image.height * this.fullScreenIconRatio;
			this.context.fillStyle = this.aoz.manifest.display.backgroundColor;
			this.context.fillRect( this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
			this.context.drawImage( image, this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
		}
	}

	// The end!
	this.modified = false;
	this.rendering = false;
};
RenderingContext2D.prototype.drawScreen = function( screen )
{
	if ( screen.vars.visible )
	{
		var xDrawScreen;
		var yDrawScreen;
		var offsetX = screen.vars.offsetX * screen.scale.x;
		var offsetY = screen.vars.offsetY * screen.scale.y;
		if ( screen.isCenteredX )
			xDrawScreen = this.xLeftDraw + this.widthDraw / 2 - screen.dimension.width * screen.scale.x - this.hardLeftX * this.xRatioDisplay;
		else
			xDrawScreen = ( screen.vars.x - this.hardLeftX ) * this.xRatioDisplay  + this.xLeftDraw;
		if ( screen.isCenteredY )
			yDrawScreen = this.yTopDraw + this.heightDraw / 2 - screen.dimension.height * screen.scale.y - this.hardTopY * this.yRatioDisplay;
		else
			yDrawScreen = ( screen.vars.y - this.hardTopY ) * this.yRatioDisplay + this.yTopDraw;

		var xScaleScreen = screen.vars.scaleX * screen.renderScale.x * this.xRatioDisplay ;
		var yScaleScreen = screen.vars.scaleY * screen.renderScale.y * this.yRatioDisplay ;
		var width = screen.vars.width * screen.scale.x;
		var height = screen.vars.height * screen.scale.y;
		var widthDrawScreen = width * xScaleScreen / screen.scale.x;
		var heightDrawScreen = height * yScaleScreen / screen.scale.y;
		var deltaX = 0;
		var deltaY = 0;
		var self = this;

		this.context.globalAlpha = screen.vars.alpha;
		this.context.filter = 'none';	// This line is 100% necessary, filters aren't cleared if there are no filters in current screen.
		this.context.filter = screen.vars.filters.getFilterString( this.filters );
		this.context.globalCompositeOperation = screen.screenBlend;
		if ( screen.vars.angle == 0 && screen.vars.skewX == 0 && screen.vars.skewY == 0 && screen.vars.offsetX == 0 && screen.vars.offsetY == 0)
		{
			deltaX = screen.vars.hotspotX * xScaleScreen;
			deltaY = screen.vars.hotspotY * yScaleScreen;
			if ( screen.screen3D )
			{
				var info1 = this.getDocumentCoordPercentages( 0, 0, screen );
				var info2 = this.getDocumentSizePercentages( screen.vars.width, screen.vars.height, screen );
				screen.screen3D.canvas.style.left = ( this.width * info1.x ) / 100 + 'px';
				screen.screen3D.canvas.style.top = ( this.height * info1.y ) / 100 + 'px';
				screen.screen3D.canvas.style.width = ( this.width * info2.width ) / 100 + 'px';
				screen.screen3D.canvas.style.height = ( this.height * info2.height ) / 100 + 'px';
				if ( this.isDebugger )
					this.context.drawImage( screen.screen3D.canvas, 0, 0, screen.screen3D.canvas.width, screen.screen3D.canvas.height, xDrawScreen - deltaX, yDrawScreen - deltaY, widthDrawScreen, heightDrawScreen );
				else
				this.context.clearRect( xDrawScreen - deltaX, yDrawScreen - deltaY, widthDrawScreen + 1, heightDrawScreen + 1 );
			}
			this.context.drawImage( screen.canvas, offsetX, offsetY, width, height, xDrawScreen - deltaX, yDrawScreen - deltaY, widthDrawScreen, heightDrawScreen );

			// Bobs!
			if ( screen.bobsContext.isAny() )
			{
				// Clip the canvas
				this.context.save();
				path = new Path2D();
				path.rect( xDrawScreen - deltaX - offsetX, yDrawScreen - deltaY - offsetY, widthDrawScreen - Math.abs( offsetX ), heightDrawScreen - Math.abs( offsetY ) );
				this.context.clip( path );

				// Go through all the bobs...
				screen.bobsContext.parseAll( undefined, function( bob )
				{
					if ( bob.vars.visible && bob.canvas )
					{
						var canvas = bob.canvas;
						var xScale = xScaleScreen * bob.scaleDisplay.x;
						var yScale = yScaleScreen * bob.scaleDisplay.y;
						var xBob = bob.positionDisplay.x * xScaleScreen + xDrawScreen - deltaX;
						var yBob = bob.positionDisplay.y * yScaleScreen + yDrawScreen - deltaY;

						self.context.save();
						if ( bob.clipping )
						{
							path = new Path2D();
							switch ( bob.clipping.style )
							{								
								case 'rectangle':										
									path.rect( bob.clipping.x1 * xScaleScreen + xDrawScreen,
									bob.clipping.y1 * yScaleScreen + yDrawScreen,
									bob.clipping.width * xScaleScreen,
									bob.clipping.height * yScaleScreen );
									break;
								case 'round':
									path.ellipse ( bob.clipping.x1 * xScaleScreen + xDrawScreen,
									bob.clipping.y1 * yScaleScreen + yDrawScreen,
									bob.clipping.width * xScaleScreen / 2,
									bob.clipping.height * yScaleScreen / 2,
									bob.clipping.angle, 0, 2 * Math.PI );
									break;
								case 'shape':
									var a = 2 * Math.PI / bob.clipping.sides;
									var x, posX, y, posY;
									var cx = bob.clipping.x1 * xScaleScreen + xDrawScreen;
									var cy = bob.clipping.y1 * yScaleScreen + yDrawScreen;
									for ( var c = a; c < 2 * Math.PI + 0.01; c += a )
									{
										posX = bob.clipping.width / 2 * xScaleScreen * Math.cos( c ) + cx;
		 								posY = bob.clipping.height / 2 * yScaleScreen * Math.sin( c ) + cy;
										x = (Math.cos(bob.clipping.angle ) * (posX - cx )) - (Math.sin(bob.clipping.angle ) * (posY - cy)) + cx;
										y = (Math.sin(bob.clipping.angle  ) * (posX - cx )) + (Math.cos(bob.clipping.angle ) * (posY - cy)) + cy;									
										path.lineTo( x, y );
									}
									path.closePath();
									break;
							}							
							self.context.clip( path );
						}
						self.context.filter = bob.vars.filters.getFilterString( screen.vars.filters, self.filters );
						self.context.globalAlpha = bob.vars.alpha * screen.vars.alpha;
						self.context.shadowOffsetX = bob.vars.shadowX;
						self.context.shadowOffsetY = bob.vars.shadowY;
						if ( bob.vars.shadowColor != null )
						{
							self.context.shadowBlur = bob.vars.shadowBlur;
							self.context.shadowColor = bob.aoz.utilities.getModernRGBAString( bob.vars.shadowColor );
						}
						if ( bob.angleDisplay.z == 0 && bob.skewDisplay.x == 0 && bob.skewDisplay.y == 0 && bob.scaleDisplay.x == 1 && bob.scaleDisplay.y == 1 )
						{
							self.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, xBob - bob.hotSpot.x * xScale, yBob - bob.hotSpot.y * yScale, xScale * canvas.width, yScale * canvas.height );
						}
						else
						{
							self.context.translate( xBob, yBob );
							self.context.rotate( bob.angleDisplay.z );
							self.context.transform( xScale, bob.skewDisplay.y * yScale, bob.skewDisplay.x * xScale, yScale, 0, 0);
							self.context.translate( -bob.hotSpot.x, -bob.hotSpot.y );
							self.context.drawImage( canvas, 0, 0 );
						}	
							self.context.restore();
					}
				} );
				this.context.restore();
			}
			
			// Rainbows?
			if ( self.aoz.moduleRainbows && self.aoz.moduleRainbows.context )
			{
				for ( var rainbow = self.aoz.moduleRainbows.context.getFirstElement( self.aoz.currentContextName ); rainbow != null; rainbow = self.aoz.moduleRainbows.context.getNextElement( this.aoz.currentContextName ) )
				{
					for ( var r = 0; r < rainbow.screensIn.length; r++ )
					{
						if ( rainbow.screensIn[ r ] == screen )
						{
							rainbow.render( self.context, 
							{
								width: screen.canvas.width,
								height: screen.canvas.height,
								xLeftDraw: xDrawScreen,
								yTopDraw: yDrawScreen, 
								xRatioDisplay: xScaleScreen,
								yRatioDisplay: yScaleScreen,
								hardLeftX: 0,
								hardTopY: 0,
								clip: { x: xDrawScreen - deltaX - offsetX, y: yDrawScreen - deltaY - offsetY, width: widthDrawScreen - Math.abs( offsetX ), height: heightDrawScreen - Math.abs( offsetY ) }
							} );
						}
					}
				}
			}
		}
		else
		{
			this.context.save();
			this.context.translate( xDrawScreen, yDrawScreen );
			this.context.rotate( screen.vars.angle );
			this.context.transform( xScaleScreen / screen.scale.x, screen.vars.skewY, screen.vars.skewX, yScaleScreen / screen.scale.y, 0, 0 );
			this.context.translate( -screen.vars.hotspotX * screen.scale.x, -screen.vars.hotspotY * screen.scale.y );
			this.context.drawImage( screen.canvas, offsetX, offsetY, width, height, 0, 0, width, height );

			// Bobs!
			if ( screen.bobsContext.isAny() )
			{
				// Clip the canvas
				
				path = new Path2D();
				path.rect( Math.max(-offsetX, 0),Math.max( -offsetY,0), screen.dimension.width * screen.scale.x - Math.abs( offsetX ), screen.dimension.height * screen.scale.y - Math.abs( offsetY ) );
				this.context.clip( path );

				// Go through all the bobs...
				screen.bobsContext.parseAll( undefined, function( bob )
				{
					if ( bob.vars.visible && bob.canvas )
					{
						var canvas = bob.canvas;
						var xBob =  bob.positionDisplay.x * screen.scale.x - offsetX;
						var yBob =  bob.positionDisplay.y * screen.scale.y - offsetY;
						self.context.save();
						if ( bob.clipping )
						{
							path = new Path2D();
							switch ( bob.clipping.style )
							{								
								case 'rectangle':										
									path.rect( bob.clipping.x1 * screen.scale.x,
									bob.clipping.y1 * screen.scale.y,
									bob.clipping.width * screen.scale.x,
									bob.clipping.height * screen.scale.y );
									break;
								case 'round':
									path.ellipse ( bob.clipping.x1 * screen.scale.x,
									bob.clipping.y1 * screen.scale.y,
									bob.clipping.width * screen.scale.x / 2,
									bob.clipping.height * screen.scale.y / 2,
									bob.clipping.angle, 0, 2 * Math.PI );
									break;
								case 'shape':
									var a = 2 * Math.PI / bob.clipping.sides;
									var x, posX, y, posY;
									var cx = bob.clipping.x1 * screen.scale.x;
									var cy = bob.clipping.y1 * screen.scale.y;
									for ( var c = a; c < 2 * Math.PI + 0.01; c += a )
									{
										posX = bob.clipping.width / 2 * screen.scale.x * Math.cos( c ) + cx;
		 								posY = bob.clipping.height / 2 * screen.scale.y * Math.sin( c ) + cy;
										x = (Math.cos(bob.clipping.angle ) * (posX - cx )) - (Math.sin(bob.clipping.angle ) * (posY - cy)) + cx;
										y = (Math.sin(bob.clipping.angle  ) * (posX - cx )) + (Math.cos(bob.clipping.angle ) * (posY - cy)) + cy;									
										path.lineTo( x, y );
									}
									path.closePath();
									break;
							}
							self.context.clip( path );
						}
						filter = bob.vars.filters.getFilterString( screen.vars.filters, self.filters );
						self.context.filter = filter;
						self.context.globalAlpha = bob.vars.alpha * screen.vars.alpha;
						self.context.shadowOffsetX = bob.vars.shadowX;
						self.context.shadowOffsetY = bob.vars.shadowY;
						if ( !bob.vars.shadowX == 0 || !bob.vars.shadowY == 0 )
						{
							self.context.shadowBlur = bob.vars.shadowBlur;
							self.context.shadowColor = bob.aoz.utilities.getModernRGBAString( bob.vars.shadowColor );
						}
						if ( bob.angleDisplay.z == 0 && bob.skewDisplay.x == 0 && bob.skewDisplay.y == 0 && bob.scaleDisplay.x == 1 && bob.scaleDisplay.y == 1 )
						{
							self.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, xBob - bob.hotSpot.x * bob.scaleDisplay.x * screen.scale.x,  yBob - bob.hotSpot.y * bob.scaleDisplay.y * screen.scale.y, canvas.width * bob.scaleDisplay.x * screen.scale.x, canvas.height * bob.scaleDisplay.y * screen.scale.y );
						}
						else
						{
							self.context.translate( xBob, yBob );
							self.context.rotate( bob.angleDisplay.z );
							self.context.transform( bob.scaleDisplay.x * screen.scale.x, bob.skewDisplay.y * bob.scaleDisplay.y * screen.scale.y , bob.skewDisplay.x * bob.scaleDisplay.x * screen.scale.x, bob.scaleDisplay.y * screen.scale.y, 0, 0 );
							self.context.translate( -bob.hotSpot.x * screen.scale.x, -bob.hotSpot.y * screen.scale.y );
							self.context.drawImage( canvas, 0, 0 );
						}
						self.context.restore();
					}
				} );
			}
			this.context.restore();
		}
	}
};




