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
 * Renderer - to be improved and expanded...
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function Renderer( aoz, options )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;
	this.options = options ? options : {};
	this.contexts = [];
};
Renderer.prototype.addContext = function( renderingContext )
{
	this.contexts = this.aoz.utilities.cleanArray( this.contexts, renderingContext );
	this.contexts.push( renderingContext );
};
Renderer.prototype.removeContext = function( renderingContext )
{
	this.contexts = this.aoz.utilities.cleanArray( this.contexts, renderingContext );
};
Renderer.prototype.isFullScreen = function()
{
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	return full_screen_element != null;
};
Renderer.prototype.init = function( eventList )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].init( eventList );
};
Renderer.prototype.end = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].end();
};
Renderer.prototype.setModified = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setModified();
};
Renderer.prototype.resize = function( force, width, height )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].resize( force, width, height );
};
Renderer.prototype.setDisplayArea = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setDisplayArea();
};
Renderer.prototype.setFilter = function( args )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setFilter( args );
};
Renderer.prototype.delFilter = function( args )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].delFilter( args );
};
Renderer.prototype.updateForScreenOrientation = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].updateForScreenOrientation();
}
Renderer.prototype.setCursorStyle = function( style )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setCursorStyle( style );
}
Renderer.prototype.setHalted = function( halted )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setHalted( halted );
}
Renderer.prototype.imageLoaded = function( image, infos )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].imageLoaded( image, infos );
}
Renderer.prototype.newImage = function( image, infos )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].newImage( image, infos );
}
Renderer.prototype.addScreen = function( screen, options )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].addScreen( screen, options );
}
Renderer.prototype.delScreen = function( screen )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].delScreen( screen );
}
Renderer.prototype.addBob = function( bob, options )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].addBob( bob, options );
}
Renderer.prototype.delBob = function( bob )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].delBob( bob );
}
Renderer.prototype.addSprite = function( sprite, options )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].addSprite( sprite, options );
}
Renderer.prototype.delSprite = function( sprite )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].delSprite( sprite );
}
Renderer.prototype.captureCrash = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].captureCrash();
}
Renderer.prototype.setBackgroundColor = function( color )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setBackgroundColor( color );
};
Renderer.prototype.setModified = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setModified();
}
Renderer.prototype.swapFullScreen = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].swapFullScreen();
}
Renderer.prototype.meditate = function( error )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].meditate( error );
};
Renderer.prototype.drawGuruMeditation = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].drawGuruMeditation();
};
Renderer.prototype.setDoubleBuffer = function( onOff )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setDoubleBuffer( onOff );
};
Renderer.prototype.autoback = function( mode )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].autoback( mode );
};
Renderer.prototype.screenSwap = function()
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].screenSwap();
};
Renderer.prototype.setView = function( onOff )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].setView( onOff );
};
Renderer.prototype.view = function( onOff )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].view( onOff );
};
Renderer.prototype.render = function( force )
{
	for ( var c = 0; c < this.contexts.length; c++ )
		this.contexts[ c ].render( force );
};







 