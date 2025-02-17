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

function Renderer( aoz, canvasId, options )
{
	this.aoz = aoz;
	this.manifest = aoz.manifest;

	this.modified = true;
	this.doubleBuffer = false;
	this.viewOn = true;

	options = options ? options : {};

	var name = this.manifest.display.renderer ? this.manifest.display.renderer : 'canvas';
	this.current = new window[ 'Renderer_' + name ]( aoz, canvasId, this, options );
	if ( !this.current )
	{
		debugger;
	}

	// Deported functions
	var renderer = this.current;
	this.init = function() { renderer.init(); }
	this.setScreenDisplay = function() { renderer.setScreenDisplay(); }
	this.render = function( force, interpolation  ) { renderer.render( force, interpolation ); }
	this.isFullScreen = function() { return renderer.isFullScreen(); }
	this.isInFullScreenIcon = function( position ) { return renderer.isInFullScreenIcon( position ); }
	this.swapFullScreen = function() { renderer.swapFullScreen(); };
	this.meditate = function( error ) { renderer.meditate( error ); };
	this.setFilter = function( args ) { renderer.setFilter( args ); };
	this.delFilter = function( args ) { renderer.delFilter( args ); }	
	this.getFilter = function( args ) { return renderer.getFilter( args ); }
	this.getFilterString = function() {	return this.renderer.getFilterString(); };
	this.updateForScreenOrientation = function() { renderer.updateForScreenOrientation(); };
	this.setHalted = function() { renderer.setHalted(); };
	this.getCoordinatesFromEvent = function( event ) { return renderer.getCoordinatesFromEvent( event ) };
	this.setCursorStyle = function( style )	{ renderer.setCursorStyle( style ) };
	this.getHardLeftX = function() { return renderer.getHardLeftX(); };
	this.getHardTopY = function() { return renderer.getHardTopY(); };
	this.getWidth = function() { return renderer.getWidth(); };
	this.getHeight = function() { return renderer.getHeight(); };
	this.imageLoaded = function( image, infos ) { renderer.imageLoaded( image, infos ) };	
	this.newImage = function( image ) { renderer.newImage( image ) };	
	this.addScreen = function( screen, options ) { renderer.addScreen( screen, options ); };
	this.delScreen = function( screen ) { renderer.delScreen( screen ); };
	this.addBob = function( bob, options ) { renderer.addBob( bob, options ); };
	this.delBob = function( bob ) { renderer.delBob( bob ); };
	this.addSprite = function( sprite, options ) { renderer.addSprite( sprite, options ); };
	this.delSprite = function( sprite ) { renderer.delSprite( sprite ); };
	this.captureCrash = function() { renderer.captureCrash(); };
	this.setBackgroundColor = function( color ) { renderer.setBackgroundColor( color ); };
};

// AMOS Compatibility
Renderer.prototype.setDoubleBuffer = function()
{
	this.doubleBuffer = true;
};
Renderer.prototype.autoback = function( mode )
{
	if ( mode == 0 )
		this.viewOn = false;
	else
		this.viewOn = true;
};
Renderer.prototype.screenSwap = function()
{
	if ( !this.doubleBuffer )
		throw { error: 'illegal_function_call', parameter: '(double buffer not set)' };
	if ( !this.viewOn )
		this.render( true );
};
Renderer.prototype.setModified = function()
{
	this.modified = true;
};
Renderer.prototype.setView = function( onOff )
{
	this.viewOn = onOff;
};
Renderer.prototype.view = function( onOff )
{
	this.viewOn = true;
	this.render( true );
};



 