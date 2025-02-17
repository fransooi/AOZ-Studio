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
 * Canvas renderer
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function Renderer_canvas( aoz, canvasId, root, options )
{
	this.aoz = aoz;
	this.root = root;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.banks = aoz.banks;

	this.canvas = document.getElementById( canvasId );
	this.context = this.canvas.getContext( '2d' );
	this.filters = new aoz.utilities.DrawFilters( aoz, this );
	var width = this.canvas.width;
	var height = this.canvas.height;
	if ( this.manifest.display.fullScreen || this.manifest.display.fullPage )
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}
	this.width = width;
	this.height = height;

	this.canvas.width = this.width;
	this.canvas.height = this.height;

	this.scaleX = typeof this.manifest.display.scaleX != 'undefined' ? this.manifest.display.scaleX : 1;
	this.scaleY = typeof this.manifest.display.scaleY != 'undefined' ? this.manifest.display.scaleY : 1;
	this.background = typeof this.manifest.display.background != 'undefined' ? this.manifest.display.background : 'color';
	this.backgroundColor = typeof this.manifest.display.backgroundColor != 'undefined' ? this.manifest.display.backgroundColor : '#000000';
	this.redrawBars = true;
	this.xLeftDraw = 0;
	this.yTopDraw = 0;
	this.widthDraw = 320;
	this.heightDraw = 200;
	this.halted = false;

	var self = this;
	this.blackAtFirst = true;
	setTimeout( function()
	{
		self.blackAtFirst = false;
	}, 100 );


	// Display FPS?
	var height = this.utilities.getFontStringHeight( this.manifest.display.fpsFont );
	this.fpsRectX = this.manifest.display.fpsX;
	this.fpsRectY = this.manifest.display.fpsY;
	this.fpsRectWidth = this.context.measureText( 'XXX FPS' ).width;
	this.fpsRectHeight = height;

	this.doResize = doResize;
	window.addEventListener( "resize", doResize );
	doResize( true );

	// Load the full screen icons
	if ( this.manifest.display.fullScreenIcon )
	{
		this.utilities.loadUnlockedImages(
		[
			'./run/resources/full_screen.png',
			'./run/resources/small_screen.png',
		], {}, function ( response, images, extra )
		{
			if ( response )
			{
				self.fullScreenIcons = images;
			}
			else
			{
				self.aoz.loadingError = 'file_not_found';
			}
		} );
	}

	function doResize( force )
	{
		if( force && ( self.manifest.display.fullScreen || self.manifest.display.fullPage ) )
		{

			self.width = window.innerWidth;
			self.height = window.innerHeight;
			self.canvas.width = self.width;
			self.canvas.height = self.height;
			self.fullScreenIconRatio = self.width / self.manifest.display.width;
			self.redrawBars = true;
			self.resetDisplay = true;
		}
		self.forceOnce = true
	}
};
Renderer_canvas.prototype.init = function()
{
};
Renderer_canvas.prototype.setScreenDisplay = function()
{
	var hardTopY = 0, hardHeight = 0;
	if ( this.aoz.platform == 'amiga' )
	{
		switch( this.manifest.display.tvStandard )
		{
			case 'pal':
				hardTopY = 30;
				hardHeight = 311 - hardTopY;
				break;
			default:
			case 'ntsc':
				hardTopY = 30;
				hardHeight = 261 - hardTopY;
				break;
		}
	}
	else if ( this.platform == 'atari' )
	{

	}

	switch( this.aoz.platform )
	{
		default:
		case 'atari':
			break;
		case 'amiga':
			this.hardLeftX = 110;
			this.hardTopY = hardTopY;
			this.hardWidth = 342;
			this.hardHeight = hardHeight;
			break;

		case 'aoz':
		case 'pc':
			this.hardLeftX = 0;
			this.hardTopY = 0;
			this.hardWidth = this.widthDraw / this.scaleX;
			this.hardHeight = this.heightDraw / this.scaleY;
			break;
	}
};
Renderer_canvas.prototype.render = function( force, interpolation  )
{
	var self = this;
	if ( this.blackAtFirst )
		return;

	force = typeof force == 'undefined' ? false : true;
	force |= this.forceOnce;
	this.forceOnce = false;
	if ( !this.aoz.crash && !this.rendering && ( force || ( this.root.modified && this.root.viewOn ) ) )
	{
		this.rendering = true;
		this.context.save();
		this.context.globalAlpha = 1.0;
		this.currentFilter = this.filters.getFilterString();
		this.context.filter = this.currentFilter;
		this.utilities.setPixelated( this.canvas, this.manifest.display.smoothing );

		// Drawing area
		var widthDraw = this.width;
		var heightDraw = this.height;
		var doClip = false;
		if ( this.manifest.display.fullPage || this.manifest.display.fullScreen )
		{
			if ( this.manifest.display.keepProportions )
			{
				var originalRatio = this.manifest.display.width / this.manifest.display.height;
				var w = heightDraw * originalRatio;
				var h = widthDraw / originalRatio;
				if ( h <= heightDraw )
				{
					widthDraw = h * originalRatio;
					heightDraw = h;
				}
				else
				{
					widthDraw = w;
					heightDraw = w / originalRatio;
				}
				doClip = true;
			}
		}

		var xLeftDraw = ( this.width - widthDraw ) / 2;
		var yTopDraw = ( this.height - heightDraw ) / 2;

		this.xLeftDraw = xLeftDraw;
		this.yTopDraw = yTopDraw;
		this.widthDraw = widthDraw;
		this.heightDraw = heightDraw;
		this.setScreenDisplay();

		// Reset display
		if ( this.background == 'transparent' )
		{
			if ( this.resetDisplay )
				this.context.clearRect( 0, 0, this.canvas.width, this.canvas.height );
			else
				this.context.clearRect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
		}
		else
		{
			this.context.fillStyle = this.backgroundColor;
			if ( this.resetDisplay )
				this.context.fillRect( 0, 0, this.canvas.width, this.canvas.height );
			else
				this.context.fillRect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
		}
		this.resetDisplay = false;

		// If full screen, clip!
		if ( doClip )
		{
			path = new Path2D();
			path.rect( xLeftDraw, yTopDraw, widthDraw, heightDraw );
			this.context.clip( path );
		}
		this.xRatioDisplay = widthDraw / this.hardWidth;
		this.yRatioDisplay = heightDraw / this.hardHeight;

		if ( this.aoz.platform == 'aoz' || this.aoz.platform == 'pc' )
		{
			this.xRatioDisplay *= ( widthDraw / this.manifest.display.width );
			this.yRatioDisplay *= ( heightDraw / this.manifest.display.height );
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
						width: this.canvas.width,
						height: this.canvas.height,
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
						width: this.canvas.width,
						height: this.canvas.height,
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
					var canvas = sprite.canvas;
					if ( canvas )
					{
						 self.context.save(); // Saves globalAlpha, shadow vars, transformation matrix, filter - it has to be here! The way it was, filters and shadows were passed to all subsequent sprites
						 self.context.filter = 'none';
						 self.context.globalAlpha = sprite.vars.alpha;
						 filter = sprite.vars.filters.getFilterString( sprite.vars.filters, self.filters );
						if ( filter != self.currentFilter )
						{
							self.context.filter = filter;
							self.currentFilter = filter;
						}
						if ( !sprite.vars.shadowX == 0 || !sprite.vars.shadowY == 0 )
						{
							self.context.shadowOffsetX = sprite.vars.shadowX;
							self.context.shadowOffsetY = sprite.vars.shadowY;
							self.context.shadowBlur = sprite.vars.shadowBlur;
							self.context.shadowColor = self.utilities.getModernRGBAString( sprite.vars.shadowColor );
						}
						var xDraw = ( sprite.positionDisplay.x - self.hardLeftX ) * self.xRatioDisplay + xLeftDraw;
						var yDraw = ( sprite.positionDisplay.y - self.hardTopY ) * self.yRatioDisplay + yTopDraw;
						 if ( sprite.angleDisplay.z == 0 && sprite.skewDisplay.x == 0 && sprite.skewDisplay.y == 0 && sprite.scaleDisplay.x == 1 && sprite.scaleDisplay.y == 1 )
						{
							var deltaX = sprite.hotSpot.x * sprite.scaleDisplay.x * self.xRatioDisplay;
							var deltaY = sprite.hotSpot.y * sprite.scaleDisplay.y * self.yRatioDisplay;
							var width = sprite.imageObject.width * sprite.scaleDisplay.x * self.xRatioDisplay;
							var height = sprite.imageObject.height * sprite.scaleDisplay.y * self.yRatioDisplay;
							self.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, xDraw - deltaX, yDraw - deltaY, width, height );
						}
						else
						{

							self.context.translate( xDraw, yDraw );
							self.context.rotate( sprite.angleDisplay.z );
							self.context.transform( sprite.scaleDisplay.x * self.xRatioDisplay, sprite.skewDisplay.y * sprite.scaleDisplay.y * self.yRatioDisplay, sprite.skewDisplay.x * sprite.scaleDisplay.x * self.xRatioDisplay, sprite.scaleDisplay.y * self.yRatioDisplay, 0, 0 );
							self.context.translate( -sprite.hotSpot.x, -sprite.hotSpot.y );
							self.context.drawImage( canvas, 0, 0 );
						 }
						 self.context.restore();
					}
				}
			} );
		}

		// Screen always on top
		if ( alwaysOnTops )
		{
			this.aoz.screensContext.parseSorted( undefined, function( screen1, screen2 )
			{
				if ( screen1.alwaysOnTop )
					return 1;
				if ( screen2.alwaysOnTop )
					return -1;
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
				if ( screen.alwaysOnTop )
					self.drawScreen( screen );
			} );
		}
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

		this.context.fillStyle = this.manifest.display.backgroundColor;
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
		if ( this.manifest.display.fps )
		{
			var text = this.aoz.errors.getErrorFromNumber( 202 ).message;
			text = this.aoz.utilities.replaceStringInText( text, '%1', '' + Math.floor( MainLoop.getFPS() + 0.5 ) );
			this.context.globalAlpha = 0.75;
			this.context.fillStyle = this.manifest.display.backgroundColor;
			this.context.fillRect( this.fpsRectX, this.fpsRectY, this.fpsRectWidth, this.fpsRectHeight );
			this.context.fillStyle = this.manifest.display.fpsColor;
			this.context.font = this.manifest.display.fpsFont;
			this.context.textBaseline = 'top';
			this.context.textAlign = 'left';
			this.context.fillText( text, this.fpsRectX, this.fpsRectY );
		}

		// Display Full Screen Icons?
		/* TODO!
		if ( this.manifest.display.fullScreenIcon && this.fullScreenIcons )
		{
			if ( this.isFullScreen() )
				this.fullScreenIconOn = 'small_screen';
			else
				this.fullScreenIconOn = 'full_screen';
			var image = this.fullScreenIcons[ this.fullScreenIconOn ];
			this.fullScreenIconX = this.manifest.display.fullScreenIconX >= 0 ? this.manifest.display.fullScreenIconX * this.fullScreenIconRatio : this.width + this.manifest.display.fullScreenIconX  * this.fullScreenIconRatio;
			this.fullScreenIconY = this.manifest.display.fullScreenIconY >= 0 ? this.manifest.display.fullScreenIconY * this.fullScreenIconRatio : this.height + this.manifest.display.fullScreenIconY * this.fullScreenIconRatio;
			this.fullScreenIconWidth = image.width * this.fullScreenIconRatio;
			this.fullScreenIconHeight = image.height * this.fullScreenIconRatio;
			this.context.fillStyle = this.manifest.display.backgroundColor;
			this.context.fillRect( this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
			this.context.drawImage( image, this.fullScreenIconX, this.fullScreenIconY, this.fullScreenIconWidth, this.fullScreenIconHeight );
		}
		*/
	}
	// The end!
	this.root.modified = false;
	this.rendering = false;
};
Renderer_canvas.prototype.drawScreen = function( screen )
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
		var xScaleScreen = screen.vars.scaleX * screen.renderScale.x * this.xRatioDisplay / screen.scale.x;
		var yScaleScreen = screen.vars.scaleY * screen.renderScale.y * this.yRatioDisplay / screen.scale.y;
		var width = screen.vars.width * screen.scale.x;
		var height = screen.vars.height * screen.scale.y;

		var widthDrawScreen = width * xScaleScreen;
		var heightDrawScreen = height * yScaleScreen;

		var deltaX = 0;
		var deltaY = 0;
		this.context.globalAlpha = screen.vars.alpha;
		var filter = screen.vars.filters.getFilterString( this.filters );
		this.context.filter = 'none';
		//if ( filter != this.currentFilter )
		//{
			this.context.filter = filter;
		//	this.currentFilter = filter;
		//}
		this.context.globalCompositeOperation = screen.screenBlend;
		if ( screen.vars.angle == 0 && screen.vars.skewX == 0 && screen.vars.skewY == 0 && screen.vars.offsetX == 0 && screen.vars.offsetY == 0)
		{
			deltaX = screen.vars.hotspotX * this.xRatioDisplay * screen.vars.scaleX;
			deltaY = screen.vars.hotspotY * this.yRatioDisplay * screen.vars.scaleY;
			this.context.drawImage( screen.canvas, offsetX, offsetY, width, height, xDrawScreen - deltaX, yDrawScreen - deltaY, widthDrawScreen, heightDrawScreen );

			// Bobs!
			var self = this;
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
						var xScale = xScaleScreen * bob.scaleDisplay.x * screen.scale.x;
						var yScale = yScaleScreen * bob.scaleDisplay.y * screen.scale.y;
						var xBob = bob.positionDisplay.x * screen.renderScale.x * xScaleScreen * screen.scale.x + xDrawScreen - deltaX;
						var yBob = bob.positionDisplay.y * screen.renderScale.y * yScaleScreen * screen.scale.y + yDrawScreen - deltaY;
						 self.context.save();
						if ( bob.clipping )
						{

							path = new Path2D();
							path.rect( bob.clipping.x * screen.renderScale.x * xScaleScreen * screen.scale.x + xDrawScreen,
									   bob.clipping.y * screen.renderScale.y * yScaleScreen * screen.scale.y + yDrawScreen,
									   bob.clipping.width * screen.renderScale.x * xScaleScreen * screen.scale.x,
									   bob.clipping.height * screen.renderScale.y * yScaleScreen * screen.scale.y );
							self.context.clip( path );
						}
						self.context.filter = bob.vars.filters.getFilterString( screen.vars.filters, self.filters );
						 //if ( filter != self.currentFilter )
						 //{
						 //	self.context.filter = filter;
						 //	self.currentFilter = filter;
						 //}
						self.context.globalAlpha = bob.vars.alpha * screen.vars.alpha;
						if ( !bob.vars.shadowX == 0 || !bob.vars.shadowY == 0 )
						{
							self.context.shadowOffsetX = bob.vars.shadowX;
							self.context.shadowOffsetY = bob.vars.shadowY;
							self.context.shadowBlur = bob.vars.shadowBlur;
							self.context.shadowColor = self.utilities.getModernRGBAString( bob.vars.shadowColor );
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
							//self.context.rotate( 0 );
							//self.context.setTransform( 1, 0, 0, 1, 0, 0 );
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
							rainbow.render( this.context, 
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
			this.context.transform( xScaleScreen, screen.vars.skewX, screen.vars.skewY, yScaleScreen, xDrawScreen, yDrawScreen );
			this.context.rotate( screen.vars.angle );
			this.context.globalAlpha = screen.vars.alpha;
			this.context.translate( -screen.vars.hotspotX * screen.scale.x, -screen.vars.hotspotY * screen.scale.y );
			this.context.drawImage( screen.canvas, offsetX, offsetY, width, height, 0, 0, width, height );

			// Bobs!
			if ( screen.bobsContext.isAny() )
			{
				// Clip the canvas
				this.context.save();
				path = new Path2D();
				path.rect( Math.max(-offsetX, 0),Math.max( -offsetY,0), screen.vars.width - Math.abs( offsetX ), screen.vars.height - Math.abs( offsetY ) );
				this.context.clip( path );

				// Go through all the bobs...
				var self = this;
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
							path.rect( bob.clipping.x * screen.scale.x,
									   bob.clipping.y * screen.scale.y,
									   bob.clipping.width * screen.scale.x,
									   bob.clipping.height * screen.scale.y );
							self.context.clip( path );
						}
						filter = bob.vars.filters.getFilterString( screen.vars.filters, self.filters );
						if ( filter != self.currentFilter )
						{
							self.context.filter = filter;
							self.currentFilter = filter;
						}
						self.context.globalAlpha = bob.vars.alpha * screen.vars.alpha;
						if ( !bob.vars.shadowX == 0 || !bob.vars.shadowY == 0 )
						{
							self.context.shadowOffsetX = bob.vars.shadowX;
							self.context.shadowOffsetY = bob.vars.shadowY;
							self.context.shadowBlur = bob.vars.shadowBlur;
							self.context.shadowColor = self.utilities.getModernRGBAString( bob.vars.shadowColor );
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
							self.context.setTransform( 1, 0, 0, 1, 0, 0 );
						}
						self.context.restore();
					}
				} );

				// Restore canvas
				this.context.restore();
			}
			this.context.setTransform( 1, 0, 0, 1, 0, 0 );
		}
	}
};
Renderer_canvas.prototype.isFullScreen = function()
{
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	return full_screen_element != null;
};
Renderer_canvas.prototype.isInFullScreenIcon = function( position)
{
	if ( this.fullScreenIconOn )
	{
		if ( position.x >= this.fullScreenIconX && position.x < this.fullScreenIconX + this.fullScreenIconWidth
		  && position.y >= this.fullScreenIconY && position.y < this.fullScreenIconY + this.fullScreenIconHeight )
		  return this.fullScreenIconOn;

		return false;
	}
};
Renderer_canvas.prototype.swapFullScreen = function()
{
	if ( document.fullscreenEnabled )
	{
		if ( this.fullScreenIconOn == 'full_screen' )
			this.canvas.requestFullscreen();
		else
			document.exitFullscreen();
	}
}
Renderer_canvas.prototype.meditate = function( error )
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
Renderer_canvas.prototype.drawGuruMeditation = function()
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

// Drawing filters
Renderer_canvas.prototype.setFilter = function( args )
{
	this.filters.setFilter( args );
};
Renderer_canvas.prototype.delFilter = function( args )
{
	this.filters.delFilter( args );
};
Renderer_canvas.prototype.getFilter = function( args )
{
	return this.filters.getFilter( args );
};
Renderer_canvas.prototype.getFilterString = function()
{
	return this.filters.getFilterString();
};

Renderer_canvas.prototype.updateForScreenOrientation = function()
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
Renderer_canvas.prototype.getCoordinatesFromEvent = function( event )
{
	var info = {};
	info.x = ( event.clientX - ( this.canvas.offsetLeft + this.xLeftDraw ) ) / this.xRatioDisplay + this.hardLeftX;
	info.y = ( event.clientY - ( this.canvas.offsetTop + this.yTopDraw ) ) / this.yRatioDisplay + this.hardTopY;

	return info;
}
Renderer_canvas.prototype.setCursorStyle = function( style )
{
	this.canvas.style.cursor = style;
}
Renderer_canvas.prototype.getHardLeftX = function()
{
	return this.hardLeftX;
}
Renderer_canvas.prototype.getHardTopY = function()
{
	return this.hardTopY;
}
Renderer_canvas.prototype.setHalted = function( halted )
{
	this.halted = halted;
}
Renderer_canvas.prototype.getWidth = function()
{
	return this.width;
}
Renderer_canvas.prototype.setHeight = function( halted )
{
	return this.height;
}
Renderer_canvas.prototype.imageLoaded = function( image, infos )
{
}
Renderer_canvas.prototype.newImage = function( image, infos )
{
}
Renderer_canvas.prototype.addScreen = function( screen, options )
{
}
Renderer_canvas.prototype.delScreen = function( screen )
{
}
Renderer_canvas.prototype.addBob = function( bob, options )
{
}
Renderer_canvas.prototype.delBob = function( bob )
{
}
Renderer_canvas.prototype.addSprite = function( sprite, options )
{
}
Renderer_canvas.prototype.delSprite = function( sprite )
{
}
Renderer_canvas.prototype.captureCrash = function()
{
}
Renderer_canvas.prototype.setBackgroundColor = function( color )
{
	if ( typeof color == 'undefined' )
		this.background = 'transparent';
	else
	{
		this.background = 'color';
		this.backgroundColor = color;
	}
	this.resetDisplay = true;
	this.modified = true;
};
