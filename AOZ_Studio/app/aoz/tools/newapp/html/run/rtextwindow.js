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
 * Text Windows
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function TextWindow( aoz, screen, contextName, definition, defaultWindow, tags )
{
	this.aoz = aoz;
	this.screen = screen;
	this.utilities = aoz.utilities;
	this.contextName = contextName;

	// Get the actual width and height
	if ( definition.height )
		this.height = Math.floor( definition.height );
	else
		this.height = this.aoz.manifest.default.screen.window.height;

	// Get the original fontWidth and fontHeight out of the manifest
	if ( !defaultWindow )
	{
		if ( !definition.forceFont )
		{
			this.font = this.aoz.fonts.windowFonts[ contextName ];
			this.fontHeight = this.aoz.manifest.default.screen.height / this.height;
			this.fontWidth =  this.aoz.manifest.default.screen.width / this.aoz.manifest.default.screen.window.width;
			if ( aoz.platform != 'amiga' )
			{
				this.fontHeight *= ( screen.vars.height / this.aoz.manifest.default.screen.height );
				this.fontWidth = this.fontHeight / 1.8;	//( screen.vars.width / this.aoz.manifest.default.screen.width );
			}
			this.fontString = this.utilities.getFontString( this.font.fontInformation.name, this.fontHeight * screen.scale.y, definition.font.weight, definition.font.italic, definition.font.stretch );
		}
		else
		{
			// Assign a Google Font to the screen...
			// The font MUST be loaded otherwise-> crash!
			var self = this;
			this.aoz.loadingMax++;
			this.aoz.fonts.getFont( definition.forceFont.name, definition.forceFont.height * screen.scale.y, definition.forceFont.weight, definition.forceFont.italic, definition.forceFont.stretch, '', definition.forceFont.context, function( response, data, extra )
			{
				self.aoz.loadingCount++;
				self.font = data;
			} );
			this.fontHeight = definition.forceFont.heightChar;
			this.height = Math.floor( screen.vars.height / this.fontHeight );
			this.fontWidth = definition.forceFont.widthChar;	//( screen.vars.width / this.aoz.manifest.default.screen.width );
			this.fontString = this.utilities.getFontString( definition.forceFont.name, definition.forceFont.height * screen.scale.y, definition.font.weight, definition.font.italic, definition.font.stretch );
		}
	}
	else
	{
		this.fontHeight = defaultWindow.fontHeight;
		this.fontWidth = defaultWindow.fontWidth;
		this.font = defaultWindow.font;
		this.fontString = defaultWindow.fontString;
	}
	// Width
	if ( definition.width )
		this.width = Math.floor( definition.width );
	else
		this.width = Math.floor( screen.vars.width / this.fontWidth );

	// Coordinates.
	this.x = typeof definition.x != 'undefined' ? definition.x : 0;
	this.y = typeof definition.y != 'undefined' ? definition.y : 0;

	// Height
	if ( this.y + this.height * this.fontHeight > this.screen.vars.height )
		this.height = Math.floor( ( this.screen.vars.height - this.y ) / this.fontHeight );

	this.border = typeof definition.border != 'undefined' ? definition.border : 0;
	this.lineWidth = this.border == 0 ? this.width : this.width - 2;
	this.lineHeight = this.border == 0 ? this.height : this.height - 2;
	if ( this.width <= 0 )
		throw 'text_window_too_small';
	if ( this.height <= 0 )
		throw 'text_window_too_small';
	if ( !definition.noAndX )
		this.x = this.x & 0xFFFFFFF0;
	if ( this.border )
		this.x += this.fontWidth;
	if ( this.x < 0 || this.x + this.width * this.fontWidth > this.screen.vars.width )
		throw 'text_window_too_large';
	if ( this.y < 0 || this.y + this.height * this.fontHeight > this.screen.vars.height )
		throw 'text_window_too_large';
	if ( this.border < 0 || this.border > 15 )
		throw { error: 'illegal_text_window_parameter', parameter: this.border };
	this.xInside = 0;
	this.yInside = 0;
	if ( this.border )
	{
		this.xInside = 1;
		this.yInside = 1;
	}

	// Other properties
	this.pen = typeof definition.pen != 'undefined' ? ( definition.pen % 32 ): 2;
	this.paper = typeof definition.paper != 'undefined' ? ( definition.paper % 32 ) : 1;
	this.writing = TextWindow.FLAG_NORMAL;
	this.oldPaper = -1;
	this.oldPen = -1;
	this.oldWriting = -1;
	this.xCursor = 0;
	this.yCursor = 0;
	this.cursorColors = { r: 0, g: 0, b: 0, a: 0 };
	this.focus = true;
	this.scrollOn = true;
	this.tab = 4;
	this.borderPaper = 1;
	this.borderPen = 2;
	this.shadeIntensity = 1;
	this.underlineWidth = 2;
	this.titleTop = '';
	this.titleBottom = '';
	this.memoryX = 0;
	this.memoryY = 0;
	this.activated = true;
	this.flashOn = true;
	
	// Cursor
	this.cursorCanvas = document.createElement( 'canvas' );
	this.cursorCanvas.width = Math.max( Math.floor( this.fontWidth * this.screen.scale.x ), 1 );
	this.cursorCanvas.height = Math.max( Math.floor( this.fontHeight * this.screen.scale.y + 1 ), 1 );
	this.cursorContext = this.cursorCanvas.getContext( '2d' );

	this.cursorActive = this.aoz.manifest.default.screen.window.cursorOn;
	this.cursorCount = 1;
	this.cursorFlashCount = -1;
	this.cursorFlash = this.aoz.manifest.default.screen.window.cursorColors;
	var self = this;
	this.aoz.loadingMax++;
	this.utilities.loadUnlockedImage( './run/resources/cursor.js', { type: 'image/png' }, function( response, image, extra )
	{
		self.aoz.loadingCount++;
		if ( response )
		{
			self.cursorImage = image;
			self.cursorImageCanvas = document.createElement( 'canvas' );
			self.cursorImageCanvas.width = image.width;
			self.cursorImageCanvas.height = image.height;
			self.cursorImageContext = self.cursorImageCanvas.getContext( '2d' );
		}
	} );
		
	// Cursor animation
	var self = this;
	this.cursorHandle = setInterval( function()
	{
		if ( self.activated && self.cursorImage )
		{
			// Boot: save behind the cursor first
			if ( self.cursorFlashCount < 0 )
			{
				var x = ( self.x + ( self.xInside + self.xCursor ) * self.fontWidth ) * self.screen.scale.x;
				var y = ( self.y + ( self.yInside + self.yCursor ) * self.fontHeight ) * self.screen.scale.y;
				self.cursorContext.drawImage( self.screen.canvas, x, y, self.cursorCanvas.width, self.cursorCanvas.height, 0, 0, self.cursorCanvas.width, self.cursorCanvas.height );
			}

			// Cycle through animation
			if ( self.flashOn )
			{
				self.cursorFlashCount++;
				if ( self.cursorFlashCount >= self.cursorFlash.length )
					self.cursorFlashCount = 0;

				// Remap image of cursor to new color
				self.cursorColors = self.cursorFlash[ self.cursorFlashCount ];
				self.remapCursor( [ self.cursorColors ] );
			}
			self.cursorDraw();
		}
	}, 40 );

	// Clear
	this.clw();

	// Flashing cursor
};

TextWindow.prototype.remapCursor = function( rgb )
{
	this.cursorImageContext.clearRect( 0, 0, this.cursorImageContext.width, this.cursorImageContext.height );
	this.cursorImageContext.drawImage( this.cursorImage, 0, 0 );
	this.utilities.remapBlock( this.cursorImageContext, [ { r: 255, g: 255, b: 255 } ], rgb, { x: 0, y: 0, width: this.cursorImageCanvas.width, height: this.cursorImageCanvas.height } );
};
TextWindow.prototype.getRectangle = function()
{
	var x = ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x;
	var y = ( this.y + this.yInside * this.fontHeight ) * this.screen.scale.y;
	var width = this.lineWidth * this.fontWidth * this.screen.scale.x;
	var height = this.lineHeight * this.fontHeight * this.screen.scale.y;
	return { x: x, y: y, width: width, height: height };
};
TextWindow.prototype.resize = function()
{
	this.width = Math.floor( this.screen.dimension.width / this.fontWidth );
	this.height = Math.floor( this.screen.dimension.height / this.fontHeight );
	this.lineWidth = this.border == 0 ? this.width : this.width - 2;
	this.lineHeight = this.border == 0 ? this.height : this.height - 2;
	if ( this.width <= 0 )
		throw 'text_window_too_small';
	if ( this.height <= 0 )
		throw 'text_window_too_small';
	this.x = this.x & 0xFFFFFFF0;
	if ( this.border )
		this.x += this.fontWidth;
	if ( this.x < 0 || this.x + this.width * this.fontWidth > this.screen.dimension.width )
		throw 'text_window_too_large';
	if ( this.y < 0 || this.y + this.height * this.fontHeight > this.screen.dimension.height )
		throw 'text_window_too_large';
	if ( this.border < 0 || this.border > 15 )
		throw { error: 'illegal_text_window_parameter', parameter: this.border };
	this.xInside = 0;
	this.yInside = 0;
	if ( this.border )
	{
		this.xInside = 1;
		this.yInside = 1;
	}

	// Reset text save buffer
	//this.lines = [];
	//this.linesData = [];
	this.clw( undefined, true );
};
// Writing flags
TextWindow.FLAG_UNDER = 0x0001;
TextWindow.FLAG_BOLD = 0x0002;
TextWindow.FLAG_ITALIC = 0x0004;
TextWindow.FLAG_SHADE = 0x0008;
TextWindow.FLAG_INVERSE = 0x0010;
TextWindow.FLAG_REPLACE = 0x0020;
TextWindow.FLAG_OR = 0x0040;
TextWindow.FLAG_XOR = 0x0080;
TextWindow.FLAG_AND = 0x0100;
TextWindow.FLAG_IGNORE = 0x0200;
TextWindow.FLAG_NORMAL = 0x0400;
TextWindow.FLAG_ONLYPAPER = 0x0800;
TextWindow.FLAG_ONLYPEN = 0x1000;
TextWindow.FLAG_SHADOW = 0x2000;
TextWindow.FLAG_OUTLINE = 0x4000;
TextWindow.MASK_WRITING1 = ( TextWindow.FLAG_REPLACE | TextWindow.FLAG_OR | TextWindow.FLAG_XOR | TextWindow.FLAG_XOR | TextWindow.FLAG_AND );
TextWindow.MASK_WRITING2 = ( TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPAPER | TextWindow.FLAG_ONLYPEN | TextWindow.FLAG_SHADOW );
TextWindow.MASK_WRITING = 0x0000FFFF0000;
TextWindow.SHIFT_WRITING = 16;
TextWindow.MASK_PEN = 0x00000000FF00;
TextWindow.SHIFT_PEN = 8;
TextWindow.MASK_PAPER = 0x0000000000FF;
TextWindow.SHIFT_PAPER = 0;
TextWindow.prototype.getLineData = function( paper, pen, writing )
{
	return ( writing & TextWindow.MASK_WRITING ) << TextWindow.SHIFT_WRITING | ( pen & TextWindow.MASK_PEN ) << TextWindow.SHIFT_PEN | ( paper & TextWindow.MASK_PAPER ) << TextWindow.SHIFT_PAPER;
};
TextWindow.prototype.getPaperFromData = function( data )
{
	return ( paper & TextWindow.MASK_PAPER ) >> SHIFT_PAPER;
};
TextWindow.prototype.getPenFromData = function( data )
{
	return ( paper & TextWindow.MASK_PEN ) >> TextWindow.SHIFT_PEN;
};
TextWindow.prototype.getPaperFromData = function( data )
{
	return ( paper & TextWindow.MASK_WRITING ) >> TextWindow.SHIFT_WRITING;
};
TextWindow.prototype.forceCursor = function()
{
	this.cursorActiveSave = this.cursorActive;
	this.cursorActive = true;
	this.flashOn = true;
};
TextWindow.prototype.restoreCursor = function()
{
	this.cursorActive = this.cursorActiveSave;
};
TextWindow.prototype.setFlash = function( onOff )
{
	this.flashOn = onOff;
};
TextWindow.prototype.cursorOff = function( force )
{
	if ( !force )
		this.cursorCount--;
	else
		this.cursorCount = 0;
	if ( this.cursorCount == 0 && this.cursorActive && this.activated )
	{
		var x = ( this.x + ( this.xInside + this.xCursor ) * this.fontWidth ) * this.screen.scale.x;
		var y = ( this.y + ( this.yInside + this.yCursor ) * this.fontHeight ) * this.screen.scale.y;
		this.screen.context.drawImage( this.cursorCanvas, x, y );
		this.screen.setModified();
	}
};
TextWindow.prototype.cursorOn = function( force )
{
	if ( !force )
		this.cursorCount++;
	else
		this.cursorCount = 1;
	if ( this.cursorCount == 1 && this.cursorActive && this.activated )
	{
		var x = ( this.x + ( this.xInside + this.xCursor ) * this.fontWidth ) * this.screen.scale.x;
		var y = ( this.y + ( this.yInside + this.yCursor ) * this.fontHeight ) * this.screen.scale.y;
		this.cursorContext.drawImage( this.screen.canvas, x, y, this.cursorCanvas.width, this.cursorCanvas.height, 0, 0, this.cursorCanvas.width, this.cursorCanvas.height );
	}
};
TextWindow.prototype.getScreenCoordinates = function( x, y )
{
	return { x: this.x + ( this.xInside + x ) * this.fontWidth, y: this.y + ( this.yInside + y ) * this.fontHeight };
};
TextWindow.prototype.cursorDraw = function()
{
	if ( this.cursorCount == 1 && this.cursorActive && this.activated && this.cursorImageCanvas )
	{
		var x = ( this.x + ( this.xInside + this.xCursor ) * this.fontWidth ) * this.screen.scale.x;
		var y = ( this.y + ( this.yInside + this.yCursor ) * this.fontHeight ) * this.screen.scale.y;
		this.screen.context.drawImage( this.cursorCanvas, x, y );
		this.screen.context.drawImage( this.cursorImageCanvas, 0, 0, this.cursorImageCanvas.width, this.cursorImageCanvas.height, x, y, this.fontWidth * this.screen.scale.x, this.fontHeight * this.screen.scale.y );
		this.screen.setModified();
	}
};
TextWindow.prototype.setCursPen = function( pen )
{
	this.cursorOff();
	this.cursPen = pen % this.screen.vars.numberOfColors;
	var colors = this.utilities.getRGBAStringColors( this.screen.getColorString( this.cursPen ) );
	this.cursorColors = colors;
	this.remapCursor( [ colors ] )
	this.cursorOn();
};
TextWindow.prototype.setCurs = function( array )
{
	this.cursorOff();
	var canvas = document.createElement( 'canvas' );
	canvas.width = 8;
	canvas.height = 8;
	var context = canvas.getContext( '2d' );
	context.fillStyle = '#FFFFFF';
	for ( var y = 0; y < array.length; y++ )
	{
		var line = array[ y ];
		if ( line )
		{
			var mask = 0x80;
			for ( var x = 0; x < 8; x++ )
			{
				if ( ( line & mask ) != 0 )
				{
					context.fillRect( x, y, 1, 1 );
				}
				mask >>= 1;
			}
		}
	}

	this.cursorImage = canvas;
	this.cursorImageCanvas = document.createElement( 'canvas' );
	this.cursorImageCanvas.width = canvas.width;
	this.cursorImageCanvas.height = canvas.height;
	this.cursorImageContext = this.cursorImageCanvas.getContext( '2d' );
	this.remapCursor( [ this.cursorColors ] )
	this.cursorOn();
};
TextWindow.prototype.close = function()
{
	if ( this.cursorHandle )
	{
	clearInterval( this.cursorHandle );
		this.cursorHandle = null;
	}
};
TextWindow.prototype.clw = function( paper, noFill )
{
	// Reset the save buffers
	if ( this.lines )
	{
		var line = ' '.repeat( this.lineWidth );
		this.lines = [].fill( line, 0, this.lineHeight );
		var linesData = [].fill( this.defaultLineData, 0, this.lineWidth );
		this.linesData = [].fill( linesData, 0, this.lineHeight );
	}

	// Cursor on top left
	this.xCursor = 0;
	this.yCursor = 0;
	this.yCursorAnchor = 0;

	if ( !noFill )
	{
		this.cursorOff();
		if ( typeof paper != 'undefined' )
			this.paper = paper;
		this.screen.context.fillStyle = this.screen.getColorString( this.paper );
		this.screen.context.fillRect( ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x, ( this.y + this.yInside * this.fontHeight ) * this.screen.scale.y, this.lineWidth * this.fontWidth * this.screen.scale.x, this.lineHeight * this.fontHeight * this.screen.scale.y );
		this.drawBorders();
		this.cursorOn();
	}
	this.screen.setModified();
};
TextWindow.prototype.windSave = function()
{
	this.cursorOff();
	var x = ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x;
	var y = ( this.y + this.yInside * this.fontHeight ) * this.screen.scale.y;
	var width = this.lineWidth * this.fontWidth * this.screen.scale.x;
	var height = this.lineHeight * this.fontHeight * this.screen.scale.y;
	this.saveCanvas = this.screen.getPixelBlock( x, y, width, height );
	this.cursorOn();
};
TextWindow.prototype.restore = function()
{
	this.cursorOff();
	if ( this.saveCanvas )
	{
		var width = this.lineWidth * this.fontWidth * this.screen.scale.x;
		var height = this.lineHeight * this.fontHeight * this.screen.scale.y;
		if ( this.saveCanvas.width == width && this.saveCanvas.height == height )
		{
			var x = ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x;
			var y = ( this.y + this.yInside * this.fontHeight ) * this.screen.scale.y;
			this.screen.putPixelBlock( this.saveCanvas, x, y )
		}
		else
		{
			this.restoreText();
		}
	}
	else
	{
		this.restoreText();
	}
	this.drawBorders();
	this.cursorOn();
	this.screen.setModified();
};
TextWindow.prototype.windon = function()
{
	return this.number;
};
TextWindow.prototype.setRectangle = function( rectangle, options )
{
	options = typeof options == 'undefined' ? {} : options;

	var x = rectangle.x + ( this.border ? this.fontWidth : 0 );
	var y = rectangle.y + ( this.border ? this.fontHeight : 0 );
	var width = rectangle.width;
	var height = rectangle.height;
	var lineWidth = ( this.border ? width - 2 : width );
	var lineHeight = ( this.border ? height - 2 : height );
	if ( !options.noMaskX )
		x &= 0xFFFFFFF0;
	if ( x < 0 || y < 0 || width <= 0 || height <= 0 || lineWidth <= 0  || lineHeight <= 0 )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_small';
	}
	if ( x + width * this.fontWidth > this.screen.dimension.width || y + height * this.fontHeight > this.screen.dimension.height )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_large';
	}
	if ( options.check )
		return true;

	this.cursorOff();
	this.screen.restoreWindows();
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.lineWidth = lineWidth;
	this.lineHeight = lineHeight;
	this.restore();
	this.cursorOn();
	return true;
}
TextWindow.prototype.windMove = function( position, options )
{
	options = typeof options == 'undefined' ? {} : options;
	if ( this.number == 0 )
		throw { error: 'illegal_text_window_parameter', parameter: this.number };

	var x = typeof position.x != 'undefined' ? position.x : this.x;
	var y = typeof position.y != 'undefined' ? position.y : this.y;
	if ( !options.noMaskX )
		x &= 0xFFFFFFF0;
	if ( this.border )
		x += this.fontWidth;
	if ( this.x == x && this.y == y )
		return false;

	if ( x < 0 || x + this.width * this.fontWidth > this.screen.dimension.width )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_large';
	}
	if ( y < 0 || y + this.height * this.fontHeight > this.screen.dimension.height )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_large';
	}
	if ( options.check )
		return true;

	this.cursorOff();
	this.screen.restoreWindows();
	this.x = x;
	this.y = y;
	this.restore();
	this.cursorOn();
	return true;
};
TextWindow.prototype.windSize = function( dimension, options )
{
	options = typeof options == 'undefined' ?  {} : options;
	dimension.width = typeof dimension.width != 'undefined' ? dimension.width : this.width;
	dimension.height = typeof dimension.height != 'undefined' ? dimension.height : this.height;

	if ( dimension.width == this.width && dimension.height == this.height )
		return false;

	if ( dimension.width <= 0 || dimension.height <= 0 )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_small';
	}
	if ( this.x + dimension.width * this.fontWidth > this.screen.dimension.width
		|| this.y + dimension.height * this.fontHeight > this.screen.dimension.height )
	{
		if ( options.check )
			return false;
		throw 'text_window_too_large';
	}
	if ( options.check )
		return true;

	this.cursorOff();
	this.screen.restoreWindows();

	this.width = dimension.width;
	this.height = dimension.height;
	var oldLineWidth = this.lineWidth;
	var oldLineHeight = this.lineHeight;
	this.lineWidth = this.border == 0 ? this.width : this.width - 2;
	this.lineHeight = this.border == 0 ? this.height : this.height - 2;
	if ( this.lines )
	{
		var line, lineData;
		if ( this.lineWidth > oldLineWidth )
		{
			line += ' '.repeat( this.lineWidth - oldLineWidth );
			lineData = [].fill( this.lineWidth - oldLineWidth );
			for ( var l = 0; l < Math.min( oldLineHeight, this.lineHeight ); l++ )
			{
				this.lines[ l ] = this.lines[ l ] + line;
				this.linesData[ l ] = this.linesData[ l ].concat( lineData );
			}
		}
		else if ( this.lineWidth < oldLineWidth )
		{
			for ( var l = 0; l < Math.min( oldLineHeight, this.lineHeight ); l++ )
			{
				this.lines[ l ] = this.lines[ l ].substring( 0, this.lineWidth );
				this.linesData[ l ].length -= ( oldLineWidth - this.lineWidth );
			}
		}
		if ( this.lineHeight > oldLineHeight )
		{
			line += ' '.repeat( this.lineWidth );
			lineData = [].fill( this.lineWidth );
			for ( var l = oldLineHeight; l < this.lineHeight; l++ )
			{
				this.lines[ l ] = line;
				this.linesData[ l ] = lineData;
			}
		}
		else if ( this.lineHeight < oldLineHeight )
		{
			this.lines.length = this.lineHeight;
			this.linesData.length = this.lineHeight;
		}
	}

	if ( this.xCursor > this.lineWidth )
		this.xCursor = this.lineWidth - 1;
	if ( this.yCursor > this.lineHeight )
		this.yCursor = this.lineHeight -1;

	this.restore();
	this.cursorOn();
	this.screen.setModified();
	return true;
};
TextWindow.prototype.setTitleTop = function( title )
{
	this.titleTop = title;
	this.drawBorders();
};
TextWindow.prototype.setTitleBottom = function( title )
{
	this.titleBottom = title;
	this.drawBorders();
};
TextWindow.prototype.setBorder = function( border, paper, pen )
{
	if ( border < 0 || border > 15 )
		throw { error: 'illegal_text_window_parameter', parameter: border };
	this.border = border;
	if ( typeof paper != 'undefined' )
	{
		if ( !this.aoz.usePalette )
			this.borderPaper = paper;
		else
		{
			if ( paper < 0 )
				throw { error: 'illegal_text_window_parameter', parameter: paper };
			this.borderPaper = paper % this.screen.vars.numberOfColors;
		}
	}
	if ( typeof pen != 'undefined' )
	{
		if ( !this.aoz.usePalette )
			this.borderPen = pen;
		else
		{
			if ( pen < 0 )
				throw { error: 'illegal_text_window_parameter', parameter: pen };
			this.borderPen = pen % this.screen.vars.numberOfColors;
		}
	}
	this.drawBorders();
};
TextWindow.prototype.activate = function( noRestore )
{
	this.activated = true;
	if ( !noRestore )
		this.restore();
	this.cursorOn();
};
TextWindow.prototype.deactivate = function()
{
	this.cursorOff();
	this.activated = false;
};
TextWindow.prototype.home = function()
{
	this.cursorOff();
	this.xCursor = 0;
	this.yCursor = 0;
	this.cursorOn();
};
TextWindow.prototype.xText = function( x )
{
	return Math.floor( ( x - this.xInside * this.fontWidth ) / this.fontWidth );
}
TextWindow.prototype.yText = function( y )
{
	return Math.floor( ( y - this.yInside * this.fontHeight ) / this.fontHeight );
}
TextWindow.prototype.setPen = function( pen )
{
	if ( !this.aoz.usePalette )
		this.pen = pen;
	else
	{
		if ( pen < 0 )
			throw { error: 'illegal_text_window_parameter', parameter: pen };
		this.pen = pen % this.screen.vars.numberOfColors;
	}
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setPaper = function( paper )
{
	if ( !this.aoz.usePalette )
		this.paper = paper;
	else
	{
		if ( paper < 0 )
			throw { error: 'illegal_text_window_parameter', parameter: paper };
		this.paper = paper % this.screen.vars.numberOfColors;
	}
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setWriting = function( mode1, mode2 )
{
	mode1 = typeof mode1 == 'undefined' ? 0 : mode1;
	mode2 = typeof mode2 == 'undefined' ? 0 : mode2;
	if ( mode1 < 0 || mode1 > 4 )
		throw { error: 'illegal_text_window_parameter', parameter: mode1 };
	if ( mode2 < 0 || mode2 > 3 )
		throw { error: 'illegal_text_window_parameter', parameter: mode2 };

	var modes1 = [ TextWindow.FLAG_REPLACE, TextWindow.FLAG_OR, TextWindow.FLAG_XOR, TextWindow.FLAG_AND, TextWindow.FLAG_IGNORE ];
	var modes2 = [ TextWindow.FLAG_NORMAL, TextWindow.FLAG_ONLYPAPER, TextWindow.FLAG_ONLYPEN, TextWindow.FLAG_SHADOW];
	this.writing = ( this.writing & ~( TextWindow.MASK_WRITING1 | TextWindow.MASK_WRITING2 ) ) | modes1[ mode1 ] | modes2[ mode2 ];
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setText = function( mode )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_UNDER ) | ( ( mode & 0x0001 ) != 0 ? TextWindow.FLAG_UNDER : 0 );
	this.writing = ( this.writing & ~TextWindow.FLAG_BOLD ) | ( ( mode & 0x0002 ) != 0 ? TextWindow.FLAG_BOLD : 0 );
	this.writing = ( this.writing & ~TextWindow.FLAG_ITALIC ) | ( ( mode & 0x0004 ) != 0 ? TextWindow.FLAG_ITALIC : 0 );
	this.writing = ( this.writing & ~TextWindow.FLAG_SHADE ) | ( ( mode & 0x0008 ) != 0 ? TextWindow.FLAG_SHADE : 0 );
	this.writing = ( this.writing & ~TextWindow.FLAG_INVERSE ) | ( ( mode & 0x0010 ) != 0 ? TextWindow.FLAG_INVERSE : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.getTextStyles = function( mode )
{
	var result = ( this.writing & TextWindow.FLAG_UNDER ) != 0 ? 0x0001 : 0;
	result |= ( this.writing & TextWindow.FLAG_BOLD ) != 0 ? 0x0002 : 0;
	result |= ( this.writing & TextWindow.FLAG_ITALIC ) != 0 ? 0x0004 : 0;
	return result;
};
TextWindow.prototype.setItalic = function( onOff )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_ITALIC ) | ( onOff ? TextWindow.FLAG_ITALIC : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setBold = function( onOff )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_BOLD ) | ( onOff ? TextWindow.FLAG_BOLD : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setInverse = function( onOff )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_INVERSE ) | ( onOff ? TextWindow.FLAG_INVERSE : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setUnder = function( onOff, width)
{
	width = typeof width != 'undefined' ? width : 2;
	this.underlineWidth = width < 0 ? 0 : width;
	this.writing = ( this.writing & ~TextWindow.FLAG_UNDER ) | ( onOff ? TextWindow.FLAG_UNDER : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setShade = function( onOff, intensity )
{
	intensity = typeof intensity != 'undefined' ? intensity : 50;
	this.shadeIntensity = intensity < 0 ? 0 : intensity / 100;
	this.writing = ( this.writing & ~TextWindow.FLAG_SHADE ) | ( onOff ? TextWindow.FLAG_SHADE : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setShadow = function( onOff )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_SHADOW ) | ( onOff ? TextWindow.FLAG_SHADOW : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setOutline = function( onOff )
{
	this.writing = ( this.writing & ~TextWindow.FLAG_OUTLINE ) | ( onOff ? TextWindow.FLAG_OUTLINE : 0 );
	this.currentLineData = this.getLineData( this.paper, this.pen, this.writing );
};
TextWindow.prototype.setScroll = function( onOff )
{
	this.scrollOn = onOff;
};
TextWindow.prototype.setCursor = function( onOff )
{
	this.cursorOff();
	this.cursorActive = onOff;
	this.cursorOn();
};
TextWindow.prototype.cursorUp = function()
{
	this.cMove( { y: -1 } );
};
TextWindow.prototype.cursorDown = function()
{
	this.cMove( { y: 1 } );
};
TextWindow.prototype.cursorLeft = function()
{
	this.cMove( { x: -1 } );
};
TextWindow.prototype.cursorRight = function()
{
	this.cMove( { x: 1 } );
};
TextWindow.prototype.cursorMove = function( distance )
{
	this.cMove( distance );
};
TextWindow.prototype.xGraphic = function( x )
{
	x = ( typeof x == 'undefined' ? this.xCursor : x );
	if ( x < 0 || x >= this.lineWidth )
		throw { error: 'illegal_text_window_parameter', parameter: x };
	return ( this.xInside + x ) * this.fontWidth;
};
TextWindow.prototype.yGraphic = function( y )
{
	y = ( typeof y == 'undefined' ? this.yCursor : y );
	if ( y < 0 || y >= this.lineHeight )
		throw { error: 'illegal_text_window_parameter', parameter: y };
	return ( this.yInside + y ) * this.fontHeight;
};
TextWindow.prototype.cLine = function( width )
{
	var x;
	if ( typeof width != 'undefined' )
	{
		x = this.xCursor;
		if ( width + this.xCursor > this.lineWidth )
			width = this.lineWidth - this.xCursor;
	}
	else
	{
		x = 0;
		width = this.lineWidth;
	}

	if ( width > 0 )
	{
		this.cursorOff();
		var space = ' '.repeat( width );
		var xSave = this.xCursor;
		this.xCursor = x;
		this.printLine( space, this.paper, this.pen, this.writing, false, false );
		this.xCursor = xSave;
		this.cursorOn();
	}
};
TextWindow.prototype.setTab = function( value )
{
	if ( value < 0 )
		throw { error: 'illegal_text_window_parameter', parameter: value };
	else
		this.tab = value;
};
TextWindow.prototype.locate = function( position )
{
	this.cursorOff();
	if ( typeof position.x != 'undefined' )
	{
		position.x = Math.floor( position.x );
		if ( position.x < 0 || position.x >= this.lineWidth )
			throw { error: 'illegal_text_window_parameter', parameter: position.x };
		this.xCursor =position. x;
	}
	if ( typeof position.y != 'undefined' )
	{
		position.y = Math.floor( position.y );
		if ( position.y < 0 || position.y >= this.lineHeight )
			throw { error: 'illegal_text_window_parameter', parameter: position.y };
		this.yCursor = position.y;
	}
	this.cursorOn();
};
TextWindow.prototype.anchorYCursor = function( y )
{
	this.yCursorAnchor = typeof y != 'undefined' ? y : this.yCursor;
};
TextWindow.prototype.cMove = function( displacement )
{
	this.cursorOff();
	if ( typeof displacement.x != 'undefined' )
	{
		displacement.x = this.aoz.fp2Int( displacement.x );
		while( displacement.x > 0 )
		{
			displacement.x--;
			this.xCursor += 1;
			if ( this.xCursor >= this.lineWidth )
			{
				this.xCursor = 0;
				this.yCursor++;
				if ( this.yCursor >= this.lineHeight - 1 )
					this.scroll( { x: 0, y: -1 }, true );
			}
		}
		while( displacement.x < 0 )
		{
			displacement.x++;
			this.xCursor--;
			if ( this.xCursor < 0 )
			{
				this.xCursor = this.lineWidth - 1;
				this.yCursor--;
				if ( this.yCursor < 0 )
					this.scroll( { x: 0, y: 1 }, true );
			}
		}
	}
	if ( typeof displacement.y != 'undefined' )
	{
		displacement.y = this.aoz.fp2Int( displacement.y );
		while( displacement.y > 0 )
		{
			this.yCursor++;
			if ( this.yCursor >= this.lineHeight )
				this.scroll( { x: 0, y: -1 }, true );
			displacement.y--;
		}
		while( displacement.y < 0 )
		{
			this.yCursor--;
			if ( this.yCursor < 0 )
				this.scroll( { x: 0, y: 1 }, true );
			displacement.y++;
		}
	}
	this.cursorOn();
};
TextWindow.prototype.scroll = function( displacement, moveCursor, position, size )
{
	this.cursorOff();

	position = typeof position != 'undefined' ? position : {};
	size = typeof size != 'undefined' ? size : {};
	var xScroll = typeof position.x == 'undefined' ? 0 : position.x;
	var yScroll = typeof position.y == 'undefined' ? 0 : position.y;
	var sxScroll = typeof size.width == 'undefined' ? this.lineWidth : size.width;
	var syScroll = typeof size.height == 'undefined' ? this.lineHeight : size.height;
	var width = ( sxScroll * this.fontWidth ) * this.screen.scale.x;
	var height = ( syScroll * this.fontHeight ) * this.screen.scale.y;
	var dx = displacement.x;
	var dy = displacement.y;

	// Clip and paste with scrolling
	this.screen.context.save();
	var xClip = ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x;
	var yClip = ( this.y + this.yInside * this.fontHeight ) * this.screen.scale.y;
	var widthClip = this.lineWidth * this.fontWidth * this.screen.scale.x;
	var heightClip = this.lineHeight * this.fontHeight * this.screen.scale.y;
	this.screen.context.beginPath();
	this.screen.context.moveTo( xClip, yClip );
	this.screen.context.lineTo( xClip + widthClip, yClip );
	this.screen.context.lineTo( xClip + widthClip, yClip + heightClip );
	this.screen.context.lineTo( xClip, yClip + heightClip );
	this.screen.context.lineTo( xClip, yClip );
	this.screen.context.clip();

	var sourceX = ( this.x + ( this.xInside + xScroll + ( dx < 0 ? -dx : 0 ) ) * this.fontWidth ) * this.screen.scale.x;
	var sourceY = ( this.y + ( this.yInside + yScroll + ( dy < 0 ? -dy : 0 ) ) * this.fontHeight ) * this.screen.scale.y;
	var destX = ( this.x + ( this.xInside + xScroll + ( dx > 0 ? dx : 0 ) ) * this.fontWidth ) * this.screen.scale.x;
	var destY = ( this.y + ( this.yInside + yScroll + ( dy > 0 ? dy : 0 ) ) * this.fontHeight ) * this.screen.scale.y;
	this.screen.context.imageSmoothingEnabled = false;
	this.screen.context.drawImage( this.screen.canvas, sourceX, sourceY, width, height, destX, destY, width, height );

	// Fill the new areas
	var x = ( this.x + ( this.xInside + xScroll ) * this.fontWidth ) * this.screen.scale.x;
	var y = ( this.y + ( this.yInside + yScroll ) * this.fontHeight ) * this.screen.scale.x;
	this.screen.context.fillStyle = this.screen.getColorString( this.paper );
	if ( dx < 0 )
	{
		var fWidth = -dx * this.fontWidth * this.screen.scale.x;
		this.screen.context.fillRect( x + width - fWidth, y, fWidth, height );
	}
	if ( dx > 0 )
	{
		var fWidth = dx * this.fontWidth * this.screen.scale.x;
		this.screen.context.fillRect( x, y, fWidth, height );
	}
	if ( dy < 0 )
	{
		var fHeight = -dy * this.fontHeight * this.screen.scale.y;
		this.screen.context.fillRect( x, y + height - fHeight, width, fHeight );
	}
	if ( dy > 0 )
	{
		var fHeight = dy * this.fontHeight * this.screen.scale.y;
		this.screen.context.fillRect( x, y, width, fHeight );
	}
	this.screen.context.restore();
	this.screen.setModified();

	// Scroll the save buffers
	if ( this.lines )
	{
		var addLine;
		var addLineData;
		if ( dx )
		{
			addLine = ' '.repeat( Math.abs( dx ) );
			addData = [].fill( this.currentLineData, 0, Math.abs( dx ) );
		}
		if ( dx < 0 )
		{
			for ( var l = yScroll; l < yScroll + syScroll; l++ )
			{
				this.lines[ l ] = this.lines[ l ].substring( 0, xScroll ) + this.lines[ l ].substr( xScroll - dx, sxScroll + dx ) + addLine + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].slice( 0, xScroll ) + this.linesData[ l ].slice( xScroll - dx, sxScroll + dx ) + addLineData + this.linesData.substring( xScroll + sxScroll );
			}
		}
		if ( dx > 0 )
		{
			for ( var l = yScroll; l < yScroll + syScroll; l++ )
			{
				this.lines[ l ] = this.lines[ l ].substring( 0, xScroll ) + addLine + this.lines[ l ].substr( xScroll, sxScroll - dx ) + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].substring( 0, xScroll ) + addLineData + this.linesData[ l ].substr( xScroll, sxScroll - dx ) + this.linesData[ l ].substring( xScroll + sxScroll );
			}
		}
		if ( dy )
		{
			addLine = ' '.repeat( Math.abs( sxScroll ) );
			addData = [].fill( this.currentLineData, 0, Math.abs( sxScroll ) );
		}
		if ( dy < 0 )
		{
			for ( var l = yScroll; l < yScroll + syScroll + dy; l++ )
			{
				this.lines[ l ] = this.lines[ l ].substring( 0, xScroll ) + this.lines[ l - dy ].substr( xScroll, sxScroll ) + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].slice( 0, xScroll ) + this.linesData[ l - dy ].slice( xScroll, sxScroll ) + this.linesData[ l ].slice( xScroll + sxScroll );
			}
			for ( l = yScroll + syScroll + dy; l < yScroll + syScroll; l++ )
			{
				this.lines[ l ] = this.lines[ l ].substr( 0, xScroll ) + addLine + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].slice( 0, xScroll ) + addLineData + this.linesData[ l ].substring( xScroll + sxScroll );
			}
		}
		if ( dy > 0 )
		{
			for ( var l = yScroll + syScroll - 1; l >= yScroll + dy; l-- )
			{
				this.lines[ l ] = this.lines[ l ].substring( 0, xScroll ) + this.lines[ l - dy ].substr( xScroll, sxScroll ) + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].slice( 0, xScroll ) + this.linesData[ l - dy ].slice( xScroll, sxScroll ) + this.linesData[ l ].slice( xScroll + sxScroll );
			}
			for ( l = yScroll; l < yScroll + dy; l++ )
			{
				this.lines[ l ] = this.lines[ l ].substr( 0, xScroll ) + addLine + this.lines[ l ].substring( xScroll + sxScroll );
				this.linesData[ l ] = this.linesData[ l ].slice( 0, xScroll ) + addLineData + this.linesData[ l ].slice( xScroll + sxScroll );
			}
		}
	}
	this.yCursorAnchor += dy;

	// Move the cursor
	if ( moveCursor )
	{
		this.xCursor += dx;
		if ( this.xCursor < 0 )
			this.xCursor = 0;
		if ( this.xCursor >= this.lineWidth )
			this.xCursor = this.lineWidth - 1;
		this.yCursor += dy;
		if ( this.yCursor < 0 )
			this.yCursor = 0;
		if ( this.yCursor >= this.lineHeight )
			this.yCursor = this.lineHeight - 1;
	}

	this.cursorOn();
};
TextWindow.prototype.hScroll = function( param )
{
	switch ( param )
	{
		case 1:
			this.scroll( { x: -1, y: 0 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: 1 } );
			break;
		case 2:
			this.scroll( { x: -1 , y: 0 }, false );
			break;
		case 3:
			this.scroll( { x: 1, y: 0 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: 1 } );
			break;
		case 4:
			this.scroll( { x: 1, y: 0 }, false );
			break;
 		default:
			throw { error: 'illegal_text_window_parameter', parameter: param };
	}
};

TextWindow.prototype.vScroll = function( param )
{
	switch ( param )
	{
		case 1: // Scroll down on text below cursor line
 			this.scroll( { x: 0, y: 1 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: this.lineHeight - this.yCursor - 1 } );
			break;
		case 2: // Scroll down from top TO cursor line
			this.scroll( { x: 0, y: 1 }, false, { x: 0, y: 0 }, { width: this.lineWidth, height: this.yCursor } );
			break;
		case 3: // Scroll up from top TO cursor line
			this.scroll( { x: 0, y: -1 }, false, { x: 0, y: 0 }, { width: this.lineWidth, height: this.yCursor + 1 } );
			break;
		case 4: // Scroll up on or below cursor line
			this.scroll( { x: 0, y: -1 }, false, { x: 0, y: this.yCursor }, { width: this.lineWidth, height: this.lineHeight - this.yCursor } ); // BJF corrected mode 4
			break;
		default:
			throw { error: 'illegal_text_window_parameter', parameter: param };
	}
};

TextWindow.prototype.centre = function( text )
{
	var l = this.getPrintLength( text );
	this.cursorOff();
	this.xCursor = Math.floor( this.lineWidth / 2 ) - Math.floor( l / 2 );
	this.print( text, false, true );
	this.cursorOn();
};
TextWindow.prototype.paper$ = function( value )
{
	var escape = String.fromCharCode( 27 );
	if ( !this.aoz.usePalette )
		return escape + 'PA' + value + '\r';
	else
	{
		if ( value < 0 )
			throw { error: 'illegal_text_window_parameter', parameter: value };
		return escape + 'PA' + ( value % this.screen.vars.numberOfColors ) + '\r';
	}
};
TextWindow.prototype.pen$ = function( value )
{
	var escape = String.fromCharCode( 27 );
	if ( !this.aoz.usePalette )
		return escape + 'PE' + value + '\r';
	else
	{
		if ( value < 0 )
			throw { error: 'illegal_text_window_parameter', parameter: value };
		return escape + 'PE' + ( value % this.screen.vars.numberOfColors ) + '\r';
	}
};
TextWindow.prototype.zone$ = function( text, zone )
{
	var escape = String.fromCharCode( 27 );
	return escape + 'Z1' + zone + '\r' + text + escape + 'Z2\r';
};
TextWindow.prototype.border$ = function( text, border )
{
	var escape = String.fromCharCode( 27 );
	return escape + 'B1' + border + '\r' + text + escape + 'B2\r';
};

TextWindow.prototype.at$ = function( position )
{
	var escape = String.fromCharCode( 27 );
	var result = '';
	if ( typeof position.x != 'undefined' )
	{
		position.x = this.aoz.fp2Int( position.x );
		if ( position.x < 0 || position.x >= this.lineWidth )
			throw { error: 'illegal_text_window_parameter', parameter: position.x };
		result += escape + 'MX' + position.x + '\r';
	}
	if ( typeof position.y != 'undefined' )
	{
		position.y = this.aoz.fp2Int( position.y );
		if ( position.y < 0 || position.y >= this.lineHeight )
			throw { error: 'illegal_text_window_parameter', parameter: position.y };
		result += escape + 'MY' + position.y + '\r';
	}
	return result;
};
TextWindow.prototype.move$ = function( displacement )
{
	var escape = String.fromCharCode( 27 );
	var result = '';
	if ( typeof displacement.x != 'undefined' && displacement.x != 0 )
	{
		displacement.x = this.aoz.fp2Int( displacement.x );
		result += escape + 'DX' + displacement.x + '\r';
	}
	if ( typeof displacement.y != 'undefined' && displacement.y != 0 )
	{
		displacement.y = this.aoz.fp2Int( displacement.y );
		result += escape + 'DY' + displacement.y + '\r';
	}
	return result;
};
TextWindow.prototype.printUsing = function( format, variables, newLine )
{
	var result = this.aoz.formatUsing( format, variables );
	this.print( result, false );
	switch ( newLine )
	{
		case ';':
			break;
		case ',':
			this.print( '\t', false );
			break;
		default:
		case '.':
			this.print( '', true );
			break;
	}
};
TextWindow.prototype.print = function( text, newLine, centre )
{
	var self = this;
	var jumpTable =
	{
		'PE': doPen,
		'PA': doPaper,
		'MX': doX,
		'MY': doY,
		'DX': doDX,
		'DY': doDY,
		'Z1': doZone1,
		'Z2': doZone2,
		'B1': doBorder1,
		'B2': doBorder2
	};
	centre = typeof centre == 'undefined' ? false : centre;
	var position = 0;
	var line = '';
	var zoneNumber = -1;
	var borderNumber = -1;
	var zoneX1, zoneY1;
	var escape = String.fromCharCode( 27 );

	// Clean the string and send to console?
	// Find last task
	var section = this.aoz.tasks[ this.aoz.tasks.length - 1 ].section;
	if ( section && section.isDebuggerOutput )
	{
		position = text.indexOf( escape );
		while( position >= 0 )
		{
			var end = text.indexOf( '\r', position );
			if ( end > 0 )
			{
				text = text.substring( 0, position ) + text.substring( end + 1 );
				position = text.indexOf( escape, position );
			}
			else
			{
				break;
			}
		}
		this.aoz.toPrintToDebugger += ( text + ( newLine ? '\n' : '' ) );
		return;
	}

	// Normal screen printing
	this.cursorOff();
	while( position < text.length )
	{
		var cCode = text.charCodeAt( position );
		var c = text.charAt( position++ );
		switch ( cCode )
		{
			// BS
			case 8:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				self.cMove( { x: -1 } );
				line = '';
				break;
			// TAB
			case 9:
				var startX = this.xCursor + line.length;
				var newX = Math.floor( ( startX + this.tab ) / this.tab ) * this.tab;
				for ( var x = startX; x < newX; x++ )
					line += ' ';
				continue;
			// LF
			case 10:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				self.cMove( { y: 1 } );
				line = '';
				break;
			// FF
			case 12:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				this.xCursor = 0;
				this.yCursor = 0;
				line = '';
				break;
			// CR
			case 13:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				this.xCursor = 0;
				line = '';
				break;
			// Command
			case 27:
				var func = jumpTable[ text.substr( position, 2 ) ];
				if ( func )
				{
					var end = text.indexOf( '\r', position );
					if ( end >= 0 )
					{
						var parameter;
						if ( end > position + 2 )
							parameter = parseInt( text.substring( position + 2, end ) );
						position = end + 1;
						if ( line != '' )
						{
							self.printLine( line, self.paper, self.pen, self.writing, true );
							line = '';
						}
						func( parameter );
						continue;
					}
				}
				break;
			// Right
			case 28:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				line = '';
				self.cMove( { x: 1 } );
				break;
			// Left
			case 29:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				line = '';
				self.cMove( { x: -1 } );
				break;
			// Up
			case 30:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				line = '';
				self.cMove( { y: -1 } );
				break;
			// Down
			case 31:
				this.printLine( line, this.paper, this.pen, this.writing, true );
				line = '';
				self.cMove( { y: 1 } );
				break;
			// Any other character-> print
			default:
				line += c;
				if ( this.xCursor + line.length >= this.lineWidth )
				{
					this.printLine( line, this.paper, this.pen, this.writing, true );
					line = '';
				}
				break;
		}
	}
	this.printLine( line, this.paper, this.pen, this.writing, true );
	if ( newLine )
	{
		this.xCursor = 0;
		this.yCursor++;
		if ( this.yCursor >= this.lineHeight )
		{
			if ( this.scrollOn )
				this.scroll( { x: 0, y: -1 }, true );
			else
				this.yCursor = 0;
		}
	}
	this.cursorOn();

	// Formatting functions
	function doPaper( parameter )
	{
		self.setPaper( parameter );
	}
	function doPen( parameter )
	{
		self.setPen( parameter );
	}
	function doX( parameter )
	{
		self.locate( { x: parameter } );
	}
	function doY( parameter )
	{
		self.locate( { y: parameter } );
	}
	function doDX( parameter )
	{
		self.cMove( { x: parameter } );
	}
	function doDY( parameter )
	{
		self.cMove( { y: parameter } );
	}
	function doZone1( parameter )
	{
		zoneNumber = parameter;
		zoneX1 = self.xCursor;
		zoneY1 = self.yCursor;
	}
	function doZone2( parameter )
	{
		if ( zoneNumber >= 0 )
		{
			var x1 = zoneX1 * self.fontWidth;
			var y1 = zoneY1 * self.fontHeight;
			var x2 = self.xCursor * self.fontWidth;
			var y2 = ( self.yCursor + 1 ) * self.fontHeight;
			self.screen.setZone( zoneNumber, { x: x1, y: y1, width: x2 - x1, height: y2 - y1 } );
			zoneNumber = -1;
		}
	}
	function doBorder1( parameter )
	{
		borderNumber = parameter;
		borderX1 = self.xCursor;
		borderY1 = self.yCursor;
	}
	function doBorder2( parameter )
	{
		if ( borderNumber >= 0 )
		{
			self.drawBorders( borderNumber, { x: borderX1, y: borderY1 }, { width: self.xCursor - borderX1, height: self.yCursor - borderY1 + 1 }, self.paper, self.pen, false );
			borderNumber = -1;
		}
	}
};
TextWindow.prototype.getPrintLength = function( text )
{
	var position = 0;
	var count = 0;
	while( position < text.length )
	{
		var c = text.charCodeAt( position++ );
		if ( c == 27 )
		{
			var end = text.indexOf( '\r', position )
			if ( end >= 0 )
			{
				position = end + 1;
			}
		}
		else if ( c >= 32 )
			count++;
	}
	return count;
};

TextWindow.prototype.drawBorders = function( border, position, size, paper, pen, drawTitle )
{
	border = typeof border != 'undefined' ? border : this.border;
	if ( border == 0 )
		return;

	position = typeof position == 'undefined' ? {} : position;
	size = typeof size == 'undefined' ? {} : size;

	var xStart = typeof position.x != 'undefined' ? position.x : 0;
	var yStart = typeof position.y != 'undefined' ? position.y : 0;
	var width = typeof size.width != 'undefined' ? size.width : this.lineWidth;
	var height = typeof size.height != 'undefined' ? size.height : this.lineHeight;
	pen = typeof pen != 'undefined' ? pen : this.borderPen;
	paper = typeof paper != 'undefined' ? paper : this.borderPaper;
	drawTitle = typeof drawTitle != 'undefined' ? drawTitle : true;

	this.cursorOff();
	var positions =
	[
		// Top left
		{
			x: - 1,
			y: - 1,
			width: 1,
			height: 1
		},
		// Top center
		{
			x: 0,
			y: - 1,
			width: width,
			height: 1
		},
		// Top right
		{
			x: width,
			y: -1,
			width: 1,
			height: 1
		},
		// Center left
		{
			x: -1,
			y: 0,
			width: 1,
			height: height
		},
		// Center right
		{
			x: width,
			y: 0,
			width: 1,
			height: height
		},
		// Bottom left
		{
			x: -1,
			y: height,
			width: 1,
			height: 1
		},
		// Bottom center
		{
			x: 0,
			y: height,
			width: width,
			height: 1
		},
		// Bottom right
		{
			x: width,
			y: height,
			width: 1,
			height: 1
		}
	]
	for ( var position = 0; position < 8; position++ )
	{
		var data = positions[ position ];
		var canvas = this.createBorderCharacter( border, position, paper, pen, this.writing );
		for ( var y = 0; y < data.height; y++ )
		{
			var yText = yStart + data.y + y;
			if ( !drawTitle )
			{
				if ( yText < 0 )
					yText = this.lineHeight + yText;
				if ( yText > this.lineHeight )
					yText = yText - this.lineHeight;
			}
			for ( var x = 0; x < data.width; x++ )
			{
				var xText = xStart + data.x + x;
				if ( !drawTitle )
				{
					if ( xText < 0 )
						xText = this.lineWidth + xText;
					if ( xText > this.lineWidth )
						xText = xText - this.lineWidth;
				}
				var xGraphic = ( this.x + ( xText + this.xInside ) * this.fontWidth ) * this.screen.scale.x;
				var yGraphic = ( this.y + ( yText + this.yInside ) * this.fontHeight ) * this.screen.scale.y;
				this.screen.context.drawImage( canvas, xGraphic, yGraphic, this.fontWidth * this.screen.scale.x, this.fontHeight * this.screen.scale.y );
			}
		}
	}

	// Draw the titles
	var self = this;
	if ( drawTitle )
	{
		if ( this.titleTop != '' )
			printIt( this.titleTop, -1 );
		if ( this.titleBottom != '' )
			printIt( this.titleBottom, this.lineHeight );
	}
	this.cursorOn();
	this.screen.setModified();

	function printIt( title, y )
	{
		if ( self.border > 0 )
		{
			if ( title.length > self.lineWidth )
				title = title.substring( self.lineWidth );
			var xSave = self.xCursor;
			var ySave = self.yCursor;
			self.xCursor = Math.floor( self.lineWidth / 2 ) - Math.floor( title.length / 2 );
			self.yCursor = y;
			self.printLine( title, self.borderPaper, self.borderPen, self.writing, false, true );
			self.xCursor = xSave;
			self.yCursor = ySave;
		}
	}
};
TextWindow.prototype.restoreText = function()
{
	var paper, pen, writing;
	if ( !this.lines )
		return;

	this.cursorOff();

	var xSaveCursor = this.xCursor;
	var ySaveCursor = this.yCursor;
	for ( var l = 0; l < this.lineHeight; l++ )
	{
		var dataLine = this.linesData[ l];
		var data = dataLine[ 0 ];
		for ( var x = 0; x < this.lineWidth; x++ )
		{
			if ( this.dataLine[ x ] != data )
				break;
		}
		if ( x < this.lineWidth )
		{
			var paper = this.getPaperFromData( data );
			var pen = this.getPenFromData( data );
			var writing = this.getWritingFromData( data );
			this.printLine( this.lines[ l ], paper, pen, writing, false, false );
		}
		else
		{
			for ( x = 0; x < this.lineWidth; x++ )
			{
				var paper = this.getPaperFromData( dataLine[ x ] );
				var pen = this.getPenFromData( dataLine[ x ] );
				var writing = this.getWritingFromData( dataLine[ x ] );
				this.printLine( this.lines[ l ].charAt( x ), paper, pen, writing, false, false );
			}
		}
	}
	this.xCursor = xSaveCursor;
	this.yCursor = ySaveCursor;

	// Draw the border
	this.drawBorders();
	this.cursorOn();
	this.screen.setModified();
};
TextWindow.prototype.createBorderCharacter = function( border, position, paper, pen, writing )
{
	var canvas = document.createElement( 'canvas' );
	canvas.width = 8;
	canvas.height = 8;
	var context = canvas.getContext( '2d' );
	var source = Borders[ border * 8 + position ];
	for ( var y = 0; y < 8; y++ )
	{
		for ( var x = 0; x < 8; x++ )
		{
			var mask = 0x80 >> x;
			if ( ( source[ y ] & mask ) == 0 )
			{
				context.fillStyle = this.screen.getColorString( paper );
			}
			else
			{
				context.fillStyle = this.screen.getColorString( pen );
			}
			context.fillRect( x, y, 1, 1 );
		}
	}
	return canvas;
};
TextWindow.prototype.clearLine = function( line, paper, pen )
{
	this.cursorOff();
	var colorPaper = this.screen.getColorString( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? paper : pen );
	var paperAlpha = this.screen.getColorAlpha( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? paper : pen );
	var x = ( this.x + this.xInside * this.fontWidth ) * this.screen.scale.x;
	var y = ( this.y + ( this.yInside + line ) * this.fontHeight ) * this.screen.scale.y;
	var width = this.fontWidth * this.lineWidth * this.screen.scale.x;
	var height = this.fontHeight;
	var saveAlpha = this.screen.context.globalAlpha;
	this.screen.context.fillStyle = colorPaper;
	this.screen.context.globalAlpha = paperAlpha;
	this.screen.context.fillRect( x, y, width, height );
	this.screen.context.globalAlpha = saveAlpha;
	this.cursorOn();
};
TextWindow.prototype.printLine = function( line, paper, pen, writing, updatePosition, inTitle )
{
	if ( line == '' || !this.font )
		return;

	var self = this;
	var colorPaper = this.screen.getColorString( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? paper : pen );
	var colorPen = this.screen.getColorString( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? pen : paper );
	var paperAlpha = this.screen.getColorAlpha( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? paper : pen );
	var inkAlpha = this.screen.getColorAlpha( ( this.writing & TextWindow.FLAG_INVERSE ) == 0 ? pen : paper );
	var saveAlpha = this.screen.context.globalAlpha;
	if ( ( writing & TextWindow.FLAG_SHADE ) != 0 )
	{
		if ( ( writing & TextWindow.FLAG_INVERSE ) !=0 )
			colorPaper = this.utilities.adjustColor( colorPaper , this.shadeIntensity );
		else
			colorPen = this.utilities.adjustColor( colorPen , this.shadeIntensity );
	}

	var context = this.screen.context;
	var fontWidth = this.fontWidth * this.screen.scale.x;
	var fontHeight = this.fontHeight * this.screen.scale.y;
	var x = Math.floor( this.x + ( this.xInside + this.xCursor ) * fontWidth );
	var y = Math.floor( this.y + ( this.yInside + this.yCursor ) * fontHeight );
	var width = line.length * fontWidth;
	var height = fontHeight;
	context.globalCompositeOperation = 'source-over';
	if ( ( writing & ( TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPAPER ) ) != 0 )
	{
		context.fillStyle = colorPaper;
		context.globalAlpha = paperAlpha;
		context.fillRect( x, y, width, height );
	}
	context.globalAlpha = inkAlpha;
	if ( ( writing & TextWindow.FLAG_UNDER ) != 0 )
	{
		var temp = context.lineWidth;
		context.lineWidth = this.underlineWidth;
		context.strokeStyle = colorPen;
		context.beginPath();
		var yUnder = y + height - ( 1 - Math.max( this.underlineWidth / 2, 0.5 ) ) * this.screen.scale.x;
		context.moveTo( x, yUnder );
		context.lineTo( x + width, yUnder );
		context.stroke();
		context.lineWidth = temp;
	}

	if ( this.font.fontInformation.type == 'google' )
	{
		if ( ( writing & ( TextWindow.FLAG_NORMAL | TextWindow.FLAG_ONLYPEN ) ) != 0 )
		{
			context.font = this.fontString;
			context.textAlign = 'center';
			context.textBaseline = 'top';
			context.fillStyle = colorPen;
			context.imageSmoothingEnabled = true;
			this.screen.canvas.imageRendering = 'auto';

			var w = width;
			var h = height;
			var disp = 0;
			if ( ( writing & TextWindow.FLAG_ITALIC ) != 0 )
			{
				context.moveTo( x + fontWidth / 3, y );
				context.transform( 1, 0, -0.2, 1, 0, 0 );
				disp = fontHeight / 5;
				w += disp;
			}
			if ( ( writing & TextWindow.FLAG_BOLD ) != 0 )
			{
				if ( ( writing & TextWindow.FLAG_OUTLINE ) != 0 )
				{
					context.strokeStyle = colorPen;
					strokeThisText( line, x + disp - 1, y, width );
					strokeThisText( line, x + disp - 1, y, width );
					strokeThisText( line, x + disp + 1, y, width );
				}
				else
				{
					fillThisText( line, x + disp - 1, y, width );
					fillThisText( line, x + disp + 1, y, width );
				}
			}
			if ( ( writing & TextWindow.FLAG_SHADOW ) != 0 )
			{
				context.shadowOffsetX = 3;
				context.shadowOffsetY = 3;
				context.shadowBlur = 5;
				context.shadowColor = '#000000b0';
			}
			if ( ( writing & TextWindow.FLAG_OUTLINE ) != 0 )
			{
				if ( ( writing & TextWindow.FLAG_BOLD ) != 0 )
				{
					context.fillStyle = colorPaper;
					fillThisText( line, x + disp, y, width );
				}
				else
				{
					context.strokeStyle = colorPen;
					strokeThisText( line, x + disp, y, width );
				}
			}
			else
				fillThisText( line, x + disp, y, width );
			this.screen.noShadow();
		}
	}
	else if ( this.font.fontInformation.type == 'amiga' )
	{
		this.aoz.fonts.drawAmigaText( this.screen.context, this.screen.scale.x, x, y, line, this.font, this.fontHeight, 'left', 'top', '', colorPen, 1, this.fontWidth );
	}
	context.globalAlpha = saveAlpha;

	// Poke in save buffers
	if ( !inTitle && this.lines )
	{
		var data = this.getLineData( paper, pen, writing );
		var lineData = [].fill( data, 0, line.length );
		this.lines[ this.yCursor ] = this.lines[ this.yCursor ].substring( 0, this.xCursor ) + line + this.lines[ this.yCursor ].substring( this.xCursor + line.length );
		this.linesData[ this.yCursor ] = this.linesData[ this.yCursor ].splice( 0, this.xCursor ) + lineData + this.linesData[ this.yCursor ].splice( this.xCursor + line.length );
	}

	// Update position
	if ( updatePosition )
	{
		this.xCursor += line.length;
		if ( this.xCursor >= this.lineWidth )
		{
			this.xCursor = 0;
			this.yCursor++;
			if ( this.yCursor >= this.lineHeight )
			{
				if ( this.scrollOn )
					this.scroll( { x: 0, y: -1 }, true );
				else
					this.yCursor = 0;
			}
		}
	}

	// Update display
	this.screen.setModified();
	return;

	function fillThisText( text, xx, yy, w )
	{		
		xx += fontWidth / 2;
		for ( var c = 0; c < text.length; c++ )
		{
			self.screen.context.fillText( text.substr( c, 1 ), xx, yy, w );
			xx += fontWidth;
		}
	}
	function strokeThisText( text, xx, yy, w )
	{		
		xx += fontWidth / 2;
		for ( var c = 0; c < text.length; c++ )
		{
			self.screen.context.fillText( text.substr( c, 1 ), xx, yy, w );
			xx += fontWidth;
		}
	}
}

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

Borders =
[
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],        // Border  0
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  1
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0xFF, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0 ],        // Border  2
	[ 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],
	[ 0xFF, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03 ],
	[ 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0 ],
	[ 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03 ],
	[ 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xC0, 0xFF ],
	[ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF ],
	[ 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0x03, 0xFF ],
	[ 0x00, 0x7F, 0x7F, 0x60, 0x6F, 0x6F, 0x6C, 0x6C ],        // Border  3
	[ 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00 ],
	[ 0x00, 0xFE, 0xFE, 0x06, 0xF6, 0xF6, 0x36, 0x36 ],
	[ 0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C, 0x6C ],
	[ 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36, 0x36 ],
	[ 0x6C, 0x6C, 0x6F, 0x6F, 0x60, 0x7F, 0x7F, 0x00 ],
	[ 0x00, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00 ],
	[ 0x36, 0x36, 0xF6, 0xF6, 0x06, 0xFE, 0xFE, 0x00 ],
	[ 0x00, 0x7F, 0x40, 0x57, 0x40, 0x57, 0x54, 0x54 ],        // Border  4
	[ 0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00, 0x00 ],
	[ 0x00, 0xFE, 0x02, 0xEA, 0x02, 0xEA, 0x2A, 0x2A ],
	[ 0x44, 0x54, 0x54, 0x44, 0x44, 0x54, 0x54, 0x44 ],
	[ 0x22, 0x2A, 0x2A, 0x22, 0x22, 0x2A, 0x2A, 0x22 ],
	[ 0x54, 0x54, 0x57, 0x40, 0x57, 0x40, 0x7F, 0x00 ],
	[ 0x00, 0x00, 0xFF, 0x00, 0x66, 0x00, 0xFF, 0x00 ],
	[ 0x2A, 0x2A, 0xEA, 0x02, 0xEA, 0x02, 0xFE, 0x00 ],
	[ 0x00, 0x00, 0x3F, 0x7F, 0x7F, 0x78, 0x70, 0x70 ],        // Border  5
	[ 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0xFC, 0xFE, 0xFE, 0x1E, 0x0E, 0x0E ],
	[ 0x70, 0x70, 0x70, 0x70, 0x70, 0x70, 0x70, 0x70 ],
	[ 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E, 0x0E ],
	[ 0x70, 0x70, 0x70, 0x78, 0x7F, 0x7F, 0x3F, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00 ],
	[ 0x0E, 0x0E, 0x0E, 0x1E, 0xFE, 0xFE, 0xFC, 0x00 ],
	[ 0x00, 0x7F, 0x40, 0x5F, 0x5F, 0x58, 0x58, 0x58 ],        // Border  6
	[ 0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00 ],
	[ 0x00, 0xFE, 0x02, 0xFA, 0xFA, 0x1A, 0x1A, 0x1A ],
	[ 0x58, 0x58, 0x58, 0x58, 0x58, 0x58, 0x58, 0x58 ],
	[ 0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A, 0x1A ],
	[ 0x58, 0x58, 0x58, 0x5F, 0x5F, 0x40, 0x7F, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0xFF, 0x00 ],
	[ 0x1A, 0x1A, 0x1A, 0xFA, 0xFA, 0x02, 0xFE, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  7
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  8
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  9
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  10
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  11
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  12
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  13
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  14
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0x0F, 0x18, 0x18, 0x18, 0x18 ],        // Border  15
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xF0, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18, 0x18 ],
	[ 0x18, 0x18, 0x18, 0x0F, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x00, 0x00, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00 ],
	[ 0x18, 0x18, 0x18, 0xF0, 0x00, 0x00, 0x00, 0x00 ]
];
