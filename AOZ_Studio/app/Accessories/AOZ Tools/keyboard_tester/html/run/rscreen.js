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
 * True Color Screens Class
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

 function Screen( aoz, args, tags, callback, extra )
 {
	 this.aoz = aoz;
	 this.contextName = args.contextName;
	 this.utilities = aoz.utilities;
	 this.banks = aoz.banks;
	 this.className = 'screen';

	 var noTextWindow = aoz.utilities.isTag( tags, 'noTextWindow' );
	 var noCls = aoz.utilities.isTag( tags, 'noCls' );
	 this.dimension = {};
	 this.dimension.width = typeof args.width != 'undefined' ? args.width : this.aoz.manifest.default.screen.width;
	 this.dimension.height = typeof args.height != 'undefined' ? args.height : this.aoz.manifest.default.screen.height;
	 this.dimension.depth = typeof args.depth != 'undefined' ? args.depth : 0;
	 if ( this.aoz.maskHardwareCoordinates )
		 this.dimension.width &= 0xFFFFFFF0;
	 if ( this.dimension.width <= 0 || this.dimension.height <= 0 )
	 throw { error: 'illegal_function_call', parameters: [ this.dimension.width, this.dimension.height ] };
	 if ( !this.aoz.unlimitedScreens )
	 {
		 if ( this.dimension.width >= 1024 || this.dimension.height >= 1024 )
		 throw { error: 'illegal_function_call', parameters: [ this.dimension.width, this.dimension.height ] };
	 }

	 this.vars =
	 {
		 x: typeof args.x != 'undefined' ? args.x : this.aoz.manifest.default.screen.x,
		 y: typeof args.y != 'undefined' ? args.y : this.aoz.manifest.default.screen.y,
		 z: typeof args.z != 'undefined' ? args.z : 0,
		 width: typeof args.displayWidth != 'undefined' ? args.displayWidth : this.dimension.width,
		 height: typeof args.displayHeight != 'undefined' ? args.displayHeight : this.dimension.height,
		 depth: typeof args.displayDepth != 'undefined' ? args.displayDepth : this.dimension.depth,
		 offsetX: typeof args.offsetX != 'undefined' ? args.offsetX : 0,
		 offsetY: typeof args.offsetY != 'undefined' ? args.offsetY : 0,
		 offsetZ: typeof args.offsetZ != 'undefined' ? args.offsetZ : 0,
		 scaleX: typeof args.scaleX != 'undefined' ? args.scaleX : 1,
		 scaleY: typeof args.scaleY != 'undefined' ? args.scaleY : 1,
		 scaleZ: typeof args.scaleZ != 'undefined' ? args.scaleZ : 1,
		 hotspotX: typeof args.hotspotX != 'undefined' ? args.hotspotX : 0,
		 hotspotY: typeof args.hotspotY != 'undefined' ? args.hotspotY : 0,
		 hotspotZ: typeof args.hotspotZ != 'undefined' ? args.hotspotZ : 0,
		 skewX: typeof args.skewX != 'undefined' ? args.skewX : 0,
		 skewY: typeof args.skewY != 'undefined' ? args.skewY : 0,
		 skewZ: typeof args.skewZ != 'undefined' ? args.skewZ : 0,
		 angle: typeof args.angle != 'undefined' ? args.angle : 0,
		 alpha: typeof args.alpha != 'undefined' ? args.alpha : 1,
		 visible: typeof args.visible != 'undefined' ? args.visible : true,
		 pixelMode: typeof args.pixelMode != 'undefined' ? args.pixelMode : this.aoz.manifest.default.screen.pixelMode,
		 numberOfColors: typeof args.numberOfColors != 'undefined' ? args.numberOfColors : this.aoz.manifest.default.screen.numberOfColors,
		 palette: this.utilities.copyArray( typeof args.palette != 'undefined' ? args.palette : this.aoz.manifest.default.screen.palette ),
		 modified: 0,
		 alwaysOnTop: typeof args.alwaysOnTop == 'undefined' ? false : args.alwaysOnTop,
		 filters: new this.aoz.utilities.DrawFilters( aoz, this )
	 };
	 this.scale =
	 {
		 x: typeof this.aoz.manifest.display.screenScale != 'undefined' ? aoz.manifest.display.screenScale : 1,
		 y: typeof this.aoz.manifest.display.screenScale != 'undefined' ? aoz.manifest.display.screenScale : 1,
		 z: 1
	 };
	 if ( args.displayScale )
	 {
		 this.scale.x = args.displayScale;
		 this.scale.y = args.displayScale;
	 }
	 if ( this.aoz.maskHardwareCoordinates )
		 this.vars.x &= 0xFFFFFFF0;
	 this.vars.pixelMode != 'undefined' ? this.vars.pixelMode : '';
	 if ( typeof this.vars.pixelMode == 'number' )
	 {
		 var pixelString = '';
		 if ( ( this.vars.pixelMode & 1 ) != 0 )
			 pixelString += 'hires';
		 if ( ( this.vars.pixelMode & 2 ) != 0 )
			 pixelString += ' laced';
		 if ( ( this.vars.pixelMode & 4 ) != 0 )
			 pixelString += ' hbm';
		 if ( ( this.vars.pixelMode & 8 ) != 0 )
			 pixelString += ' 3d';
		 this.vars.pixelMode = pixelString;
	 }
	 this.renderScale =
	 {
		 x: ( this.vars.pixelMode.indexOf( 'hires' ) >= 0 ? 0.5 : 1 ),
		 y: ( this.vars.pixelMode.indexOf( 'laced' ) >= 0 ? 0.5 : 1 ),
		 z: 1
	 }
	 this.clip = undefined;
	 if ( args.clip )
		 this.clip = this.utilities.getZone( args.clip, this.dimension, this.scale );
	 this.drawFilters = new this.aoz.utilities.DrawFilters( aoz, this );
	 this.borderFilters = new this.aoz.utilities.DrawFilters( aoz, this );
	 
	 // Create canvas
	 this.varsUpdated = this.aoz.utilities.copyObject( this.vars, false );
	 this.canvas = document.createElement( 'canvas' );
	 this.canvas.width = this.dimension.width * this.scale.x;
	 this.canvas.height = this.dimension.height * this.scale.y;
	 this.context = this.canvas.getContext( '2d' );

	 // Colors
	 if ( this.aoz.usePalette )
		 this.alphas = [];
	 else
		 this.alphas = {};
	 for ( var c = 0; c < Math.max( this.vars.numberOfColors, this.vars.palette.length ); c++ )
	 {
		 var colorString = '#000000';
		 if ( this.vars.palette[ c ] )
		 {
			 if ( typeof this.vars.palette[ c ] == 'string' )
				 colorString = this.vars.palette[ c ];
			 else
				 colorString = this.utilities.getModernColorString( this.vars.palette[ c ], this.aoz.useShortColors );
		 }
		 this.vars.palette[ c ] = colorString.toUpperCase();
		 if ( this.aoz.usePalette )
			 this.alphas[ c ] = 1;
		 else
			 this.alphas[ colorString ] = 1;
	 }

	 // Amiga specific
	 this.halfBrightMode = false;
	 this.hamMode = false;
	 if ( this.aoz.platform == 'amiga' )
	 {
		 if (   this.vars.numberOfColors != 2 && this.vars.numberOfColors != 4
			 && this.vars.numberOfColors != 8 && this.vars.numberOfColors != 16
			 && this.vars.numberOfColors != 16 && this.vars.numberOfColors != 32
			 && this.vars.numberOfColors != 64 && this.vars.numberOfColors != 128
			 && this.vars.numberOfColors != 256 && this.vars.numberOfColors != 4096 )
			 throw { error: 'illegal_function_call', parameter: this.vars.numberOfColors };
	 }
	 if ( this.aoz.platform == 'amiga' && this.vars.numberOfColors == 64 || this.vars.pixelMode.indexOf( 'hbm' ) >= 0 )
	 {
		 this.halfBrightMode = true;
		 for ( var p = 0; p < 32; p++ )
		 {
			 this.setHalfBrightColor( p );
		 }
		 this.vars.numberOfColors = 32;
	 }
	 if ( this.vars.numberOfColors == 4096 )
	 {
		 this.vars.numberOfColors = 64;
		 this.hamMode = true;
	 }

	 // Graphical operations
	 this.shadowX = 0;
	 this.shadowY = 0;
	 this.shadowBlur = 0;
	 this.shadowColor = null;
	 this.textShadowX = 0;
	 this.textShadowY = 0;
	 this.textShadowBlur = 0;
	 this.textShadowColor = null;
	 this.pattern = 0;
	 this.patternScale = 1;
	 this.borderPattern = 0;
	 this.borderPatternScale = 1;
	 this.gradient = null;
	 this.borderGradient = null;
	 this.paintBorder = false;
	 this.borderFirst = false;
	 this.ink = 2;
	 this.fillInk = 0;
	 this.borderInk = 0;
	 this.shade = 1;
	 this.inverse = false;
	 this.cloned = null;
	 this.linePattern = [];
	 this.dashOffset = 0;
	 this.lineWidth = ( this.scale.x + this.scale.y ) / 2;
	 this.lineCap = 'square';
	 this.lineJoin = 'miter';
	 this.grPosition = { x: 0, y: 0, z: 0 };
	 this.dualPlayfieldFront = false;
	 this.dualPlayfieldBack = false;
	 this.font = null;
	 this.imageRendering = 'pixelated';
	 this.textMode = 'fill';
	 this.drawingHandle = null;
	 this.drawingCount = 0;
	 this.onlyInk = false;
	 this.xor = false;
	 this.screenBlend = 'source-over';
	 this.reverseImages = false;
	 // Set Line Style
	 this.context.lineWidth = this.lineWidth;
	 this.context.lineCap = this.lineCap;

	 // Bob context
	 this.bobsContext = new AOZContext( this.aoz, this.contextName, { sorted: true } );
	 this.bobsContext.addContext("ext_browser");
this.bobsContext.addContext("ext_net");
this.bobsContext.addContext("ext_tween");
this.bobsContext.addContext("v1_0_asset");
this.bobsContext.addContext("v1_0_collisions");
this.bobsContext.addContext("v1_0_colours");
this.bobsContext.addContext("v1_0_graphics");
this.bobsContext.addContext("v1_0_keyboard_and_mouse");
this.bobsContext.addContext("v1_0_rainbows");
this.bobsContext.addContext("v1_0_screens");
this.bobsContext.addContext("v1_0_sprites");
this.bobsContext.addContext("v1_0_strings");
this.bobsContext.addContext("v1_0_td");
this.bobsContext.addContext("v1_0_textwindows");
this.bobsContext.addContext("v1_0_three_d");
this.bobsContext.addContext("v1_0_time");

	 this.bobsToUpdate = false;
	 this.bobsUpdateOn = true;
	 this.bobsPriorityOn = false;
	 this.bobsPriorityReverseOn = false;

	 // Default window
	 this.windows = {};
	 this.windowsZ = [];
	 this.zones = [];
	 this.scrolls = [];
	 this.transparentColors = [];
	 this.maxZones = 0;
	 if ( !noTextWindow )
		 this.windOpen( 'default', null, args );

	 if ( !noCls )
		 this.cls( 0, { x: 0, y: 0, width: this.vars.width, height: this.vars.height } );

	 // Set first font on the list
	 this.font = this.aoz.fonts.firstFont;
	 this.fontHeight  = this.aoz.fonts.firstFontHeight;
	 this.previousFont = this.font;

	 // Turn class into a real AOZ Object
	 this.aoz.turnIntoObject( this, {}, {},
	 {
		 setHotspot: this.setHotspot,
		 setPosition: this.setPosition,
		 setSize: this.setSize
	 } );

	 // Set all parameters "officially". TODO: remove all above code... Process can be automatic for any objects ;)
	 this.setOffset( { x: this.vars.offsetX, y: this.vars.offsetY, z: this.vars.offsetZ }, '#update' );
	 this.setScale( { x: this.vars.scaleX, y: this.vars.scaleY, z: this.vars.scaleZ }, '#update' );
	 this.setHotspot( { x: this.vars.hotspotX, y: this.vars.hotspotY, z: this.vars.hotspotZ },  '#update' );
	 this.setPosition( { x: this.vars.x, y: this.vars.y, z: this.vars.z },  '#update' );
	 this.setSize( { width: this.vars.width, height: this.vars.height, depth: this.vars.depth },  '#update' );
	 this.setAlpha( typeof args.alpha != 'undefined' ? args.alpha : 1,  '#update' );
	 this.setAngle( { z: typeof args.angle != 'undefined' ? args.angle : 0 },  '#update' );
	 this.setVisible( typeof args.visible != 'undefined' ? args.visible : true, '#update' );

	return this;
};
Screen.prototype.completeCreation = function( args, callback, extra )
{
	if ( this.vars.pixelMode.indexOf( '3d' ) >= 0 )
	{
		if ( this.aoz.three_d )
	 	{
			//this.aoz.renderingContext.setBackgroundColor();
			this.setTransparent( [ 0 ], true );
			//this.cls( 0 );
			this.screen3D = new this.aoz.three_d.Screen3D( this.aoz, this, args );
			args.setCurrent = true;
			if ( typeof args.sceneID != 'undefined' )
				return this.screen3D.loadScene( args.sceneID, args, callback, extra );
			else
			{
				return this.screen3D.createDefaultScene( args, callback, extra );
			}
	 	}
	}
	callback( false, this, extra );
	return true;
}
 Screen.prototype.close = function()
 {
	for ( var w = 0; w < this.windowsZ.length; w++ )
		this.windowsZ[ w ].close();
	if ( this.screen3D )
		this.screen3D.close();
	this.deactivate();
 };
 Screen.prototype.get_this = function( index, mode )
 {
	 mode = ( typeof mode == 'undefined' ? '' : mode );
	 var self = this.aoz.getScreen( index, null );
	 if ( self )
	 {
		 switch ( mode.toLowerCase() )
		 {
			 case 'size':
				 return {
					 self: self,
					 get_x: self.get_width,
					 get_y: self.get_height,
					 set_x: self.set_width,
					 set_y: self.set_height,
					 set_image: function(){},
					 get_image: function(){}
				 };
			 case 'offset':
				 return {
					 self: self,
					 get_x: self.get_offsetX,
					 get_y: self.get_offsetY,
					 set_x: self.set_offsetX,
					 set_y: self.set_offsetY,
					 set_image: function(){},
					 get_image: function(){}
				 };
			 case 'scale':
				 return {
					 self: self,
					 get_x: function ( fromInstruction ) { var v = this.get_scaleX( fromInstruction ); return ( typeof v == 'undefined' ? v : v * 100 ); },
					 get_y: function ( fromInstruction ) { var v = this.get_scaleY( fromInstruction ); return ( typeof v == 'undefined' ? v : v * 100 ); },
					 set_x: function ( value, fromInstruction ) { this.set_scaleX( value / 100, fromInstruction ); },
					 set_y: function ( value, fromInstruction ) { this.set_scaleY( value / 100, fromInstruction ); },
					 set_image: function(){},
					 get_image: function(){}
				 };
			 case 'skew':
				 return {
					 self: self,
					 get_x: self.get_skewX,
					 get_y: self.get_skewY,
					 set_x: self.set_skewX,
					 set_y: self.set_skewY,
					 set_image: function(){},
					 get_image: function(){}
				 };
			 case 'display':
			 default:
				 return {
					 self: self,
					 get_x: self.get_x,
					 get_y: self.get_y,
					 set_x: self.set_x,
					 set_y: self.set_y,
					 set_image: function(){},
					 get_image: function(){}
				 };
			 }
	 }
	 return undefined;
 }
 Screen.prototype.setTags = function( tags )
 {
	 if ( this.utilities.getTag( tags, [ 'refresh' ] ) != '' )
		 this.setModified();
 };
 Screen.prototype.setModified = function()
 {
	 this.modified++;
	 this.aoz.renderer.setModified();
 };
 Screen.prototype.setAlwaysOnTop = function( onOff )
 {
	 this.alwaysOnTop = onOff;
 };
 Screen.prototype.resize = function( dimension )
 {
	 var width = typeof dimension.width == 'undefined' ? this.dimension.width : dimension.width;
	 var height = typeof dimension.height == 'undefined' ? this.dimension.height : dimension.height;
	 if ( width != this.dimension.width || height != this.dimension.height )
	 {
		 this.dimension.width = dimension.width;
		 this.dimension.height = dimension.height;
		 this.canvas.width = this.dimension.width * this.scale.x;
		 this.canvas.height = this.dimension.height * this.scale.y;
		 this.currentTextWindow.resize();
	 }
	 this.modified++;
	 this.aoz.renderer.setModified();
 };


 //////////////////////////////////////////////////////////////////////
 // Control
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.startDrawing = function()
 {
	 this.context.filter = 'none';
	 this.drawingCount++;
	 if ( this.drawingCount == 1 )
	 {
		 if ( this.currentTextWindow )
			 this.currentTextWindow.cursorOff();
		 if ( this.clip )
		 {
			 this.context.save();
			 path = new Path2D();
			 path.rect( this.clip.x, this.clip.y, this.clip.width, this.clip.height );
			 this.context.clip( path );
		 }
	 }
 };
 Screen.prototype.beginDrawing = function()
 {
	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 this.context.globalAlpha = this.getColorAlpha(this.getInk());
	 this.context.globalCompositeOperation = this.getCompositeOperation();
	 if ( this.shadowColor )
		 this.drawShadowOn();
 };
 Screen.prototype.endDrawing = function( noCursor )
 {
	this.context.filter = 'none';
	 this.drawingCount--;
	 if ( this.drawingCount == 0 )
	 {		 
		 if ( this.clip )
			 this.context.restore();
		 if ( !noCursor && this.currentTextWindow )
			 this.currentTextWindow.cursorOn();
		 this.setModified();
	 }
 };
 Screen.prototype.clipOff = function()
 {
		 this.clip = null;
 };
 Screen.prototype.setClip = function( rectangle, coords )
 {
	 if ( coords )
	 {
		 rectangle.width = coords.x2 - rectangle.x;
		 rectangle.height = coords.y2 - rectangle.y;
		 if ( rectangle.width < 0 )
		 {
			 rectangle.x ++;
			 rectangle.width --;
		 }
		 else
			 rectangle.width ++;
		 if ( rectangle.height < 0 )
		 {
			 rectangle.y ++;
			 rectangle.height --;
		 }
		 else
			 rectangle.height ++;
	 }
	 else
	 {
		 if ( rectangle.width < 0 )
			 rectangle.x ++;
		 if ( rectangle.height < 0 )
			 rectangle.y ++;
	 }
	 this.clip = this.utilities.getZone( rectangle, this.dimension, this.scale );
	 this.setModified();
 };
 Screen.prototype.setDualPlayfield = function( screen )
 {
	 if ( this.dualPlayfield || screen.dualPlayfield )
		 throw 'cant_set_dual_playfield';
	 if ( this.vars.pixelMode != screen.vars.pixelMode )
		 throw 'cant_set_dual_playfield';

	 this.dualPlayfieldFront = true;
	 screen.dualPlayfieldBack = true;
	 this.setTransparent( this.aoz.usePalette ? [ 0 ] : [ '#000000' ], true );
	 screen.vars.x = this.vars.x;
	 screen.vars.y = this.vars.y;
	 this.vars.z = screen.vars.z + 0.1;

	 this.setModified();
	 screen.setModified();
 };
 Screen.prototype.setDualPriority = function( screen )
 {
	 var isGood = this.dualPlayfieldFront || this.dualPlayfieldBack || screen.dualPlayfieldFront || screen.dualPlayfieldBack;
	 if ( !isGood )
		 throw 'screen_not_in_dual_playfield';
	 if ( !this.dualPlayfieldFront )
	 {
		 this.dualPlayfieldBack = false;
		 this.dualPlayfieldFront = true;
		 screen.dualPlayfieldBack = true;
		 screen.dualPlayfieldFront = false;
		 this.setTransparent( this.aoz.usePalette ? 0 : '#000000', true );
		 screen.setTransparent( this.aoz.usePalette ? 0 : '#000000', false );
		 this.aoz.moveBefore( this.aoz.currentContextName, this, screen );
		 screen.setModified();
		 this.setModified();
	 }
 };
 Screen.prototype.setCenter = function( inX, inY )
 {
	 this.isCenteredX = inX ? true : false;
	 this.isCenteredY = inY ? true : false;
	 this.setModified();
 };
 Screen.prototype.setHotspot = function( position, fromInstruction )
 {
	 var hotspotX = this.vars.hotspotX;
	 var hotspotY = this.vars.hotspotY;
	 if ( position.x == 'mask' )
	 {
		 switch ( ( position.y & 0x70 ) >> 4 )
		 {
			 case 0:
				 hotspotX = 0;
				 break;
			 case 1:
				 hotspotX = this.dimension.width / 2;
				 break;
			 case 2:
				 hotspotX = this.dimension.width;
				 break;
		 }
		 switch ( position.y & 0x07 )
		 {
			 case 0:
				 hotspotY = 0;
				 break;
			 case 1:
				 hotspotY = this.dimension.height / 2;
				 break;
			 case 2:
				 hotspotY = this.dimension.height;
				 break;
		 }
	 }
	 else
	 {
		 if ( typeof position.x != 'undefined' )
			 hotspotX = position.x;
		 if ( typeof position.y != 'undefined' )
			 hotspotY = position.y;
	 }
	 this.aoz.setHotspot.call( this, { x: hotspotX, y: hotspotY, z: position.z }, fromInstruction );
 };
 Screen.prototype.setPosition = function( position, fromInstruction )
 {
	 if ( fromInstruction )
	 {
		 switch ( fromInstruction )
		 {
			 case 'display':
				 break;
			 case 'offset':
				 this.setOffset( position, fromInstruction );
				 return;
			 case 'size':
				 this.setSize( { width: position.x, height: position.y }, fromInstruction );
				 return;
			 default:
				 break;
		 }
	 }
	 if ( position.x && this.aoz.maskHardwareCoordinates )
		 position.x &= 0xFFFFFFF0;
	 this.aoz.setPosition.call( this, position, fromInstruction );
 };
 Screen.prototype.setSize = function( dimension, fromInstruction )
 {
	 if ( dimension.width )
	 {
		 if ( this.aoz.maskHardwareCoordinates )
			 dimension.width &= 0xFFFFFFF0;
	 }
	 if ( dimension.width && dimension.width < 0 )
		 throw { error: 'illegal_function_call', parameter: dimension.width };
	 if ( dimension.height && dimension.height < 0 )
		 throw { error: 'illegal_function_call', parameter: dimension.height };

	 this.aoz.setSize.call( this, dimension, fromInstruction );
 };
 Screen.prototype.deactivate = function()
 {
	 //this.currentTextWindow.deactivate();
 };
 Screen.prototype.activate = function()
 {
	 //this.currentTextWindow.activate( true );
 };
 Screen.prototype.setCloned = function( screen )
 {
	 this.cloned = screen;
	 this.canvas = screen.canvas;
	 this.context = screen.context;
	 clearInterval( this.windows[ 0 ].cursorHandle );
 };
 Screen.prototype.xScreen = function( x )
 {
	 return x - this.vars.x / this.renderScale.x / this.vars.scaleX + this.vars.offsetX;
 }
 Screen.prototype.yScreen = function( y )
 {
	 return y - this.vars.y / this.renderScale.y / this.vars.scaleY + this.vars.offsetY;
 }

 //////////////////////////////////////////////////////////////////////
 // Zones
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.reserveZone = function( number )
 {
	 if ( typeof number != undefined )
	 {
		 if ( number < 0 )
			 throw { error: 'illegal_function_call', parameter: number };
		 this.maxZones = number;
	 }
	 else
	 {
		 this.zones = [];
		 this.maxZones = 0;
	 }
 };
 Screen.prototype.setZone = function( number, rectangle )
 {
	 if ( number <= 0 || number > this.maxZones )
		 throw { error: 'illegal_function_call', parameter: number };
	 rectangle.width = typeof rectangle.width == 'undefined' ? rectangle.x2 - rectangle.x + 1 : rectangle.width;
	 rectangle.height = typeof rectangle.height == 'undefined' ? rectangle.y2 - rectangle.y + 1 : rectangle.height;
	 this.zones[ number ] = this.utilities.getZone( rectangle, this.dimension, { x: 1, y: 1, z: 1 } );
	 this.zones[ number ].enable = true;
 };
 Screen.prototype.zone = function( number, position )
 {
	 var screen = this.aoz.getScreen( number );
	 if ( screen.vars.visible )
	 {
	 for ( var z = 1; z < screen.zones.length; z++ )
	 {
		 if ( screen.zones[ z ] )
		 {
			 var zone = screen.zones[ z ];
			 if( zone.enable == undefined || zone.enable == true )
			 {
				 if ( position.x >= zone.x && position.x < zone.x + zone.width && position.y >= zone.y && position.y < zone.y + zone.height )
				 {
					 return z;
				 }
			 }
		 }
	 }
	 }
	 return 0;
 };
 Screen.prototype.zoneEnable = function( number, value )
 {
	 if ( typeof number != 'undefined' )
	 {
		 if ( number < 1 || number > this.maxZones )
		 {
			 throw { error: 'illegal_function_call', parameter: number  };
		 }

		 if( this.zones && this.zones[ number ] )
		 {
			 this.zones[ number ].enable = value;
		 }
	 }
 };

 Screen.prototype.isZoneEnabled = function( number )
 {
	 if ( typeof number != 'undefined' )
	 {
		 if ( number < 1 || number > this.maxZones )
		 {
			 throw { error: 'illegal_function_call', parameter: number };
		 }

		 if( this.zones && this.zones[ number ] )
		 {
			 return this.zones[ number ].enable;
		 }

		 return true;
	 }

	 return true;
 };
 Screen.prototype.zonesLength = function()
 {
	 return this.maxZones;
 };
 Screen.prototype.resetZone = function( number, position )
 {
	 if ( typeof number != 'undefined' )
	 {
		 if ( number < 1 || number > this.maxZones )
			 throw { error: 'illegal_function_call', parameter: number };
		 this.zones[ number ] = null;
	 }
	 else
	 {
		 this.zones = [];
	 }
 };
 Screen.prototype.isIn = function( position )
 {
	 if ( this.vars.visible )
	 {
		 var x = Math.floor( ( position.x - this.vars.x ) / this.renderScale.x );
		 var y = Math.floor( ( position.y - this.vars.y ) / this.renderScale.y );
		 return ( x >= 0 && x < this.vars.width ) && ( y >= 0 && y < this.vars.height );
	 }
	 return false;
 };
 Screen.prototype.hZone2 = function( position )
 {
	 position.x = ( position.x - this.vars.x ) / this.renderScale.x;
	 position.y = ( position.y - this.vars.y ) / this.renderScale.y;
	 return this.zone( undefined, position );
 };

 //////////////////////////////////////////////////////////////////////
 // Colors
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.setHalfBrightColor = function( p )
 {
	 if ( this.halfBrightMode )
	 {
		 var c = this.vars.palette[ p ];
		 var r = ( ( c & 0xF00 ) >> 1 ) & 0xF00;
		 var g = ( ( c & 0x0F0 ) >> 1 ) & 0x0F0;
		 var b = ( ( c & 0x00F ) >> 1 ) & 0x00F;
		 this.vars.palette[ p + 32 ] = r | g | b;
		 this.setModified();
	 }
 };
 Screen.prototype.getPalette = function( index, mask )
 {
	 var screen = this.aoz.getScreen( index );
	 var b = 1;
	 for ( var c = 0; c < screen.vars.palette.length; c++ )
	 {
		 if ( typeof mask != 'undefined' )
		 {
			 if ( ( mask & b ) != 0 )
			 {
				 this.vars.palette[ c ] = screen.vars.palette[ c ];
			 }
			 b = b << 1;
		 }
		 else
		 {
			 this.vars.palette[ c ] = screen.vars.palette[ c ];
		 }
	 }
 };
 Screen.prototype.fade = function( args )
 {
 };
 Screen.prototype.setPalette = function( palette, tags )
 {
	 var remap = true;
	 if ( tags && this.utilities.getTag( tags, [ 'noremap' ] ) )
		 remap = false;
	 var oldPalette = this.utilities.copyArray( this.vars.palette )
	 for ( var p = 0; p < palette.length; p++ )
	 {
		 if ( typeof palette[ p ] != 'undefined' )
		 {
			 if ( typeof palette[ p ] == 'string' )
				 this.vars.palette[ p ] = palette[ p ];
			 else
				 this.vars.palette[ p ] = this.utilities.getModernColorString( palette[ p ], this.aoz.useShortColors );
			 if ( this.halfBrightMode && p < 32 )
				 this.setHalfBrightColor( p );
		 }
	 }
	 if ( remap )
	 {
		 var sourceColors = [];
		 var destinationColors = [];
		 for ( var c = 0; c < this.vars.palette.length; c++ )
		 {
			 if ( oldPalette[ c ] != this.vars.palette[ c ] )
			 {
				 sourceColors.push( this.utilities.getRGBAStringColors( oldPalette[ c ] ) );
				 destinationColors.push( this.utilities.getRGBAStringColors( this.vars.palette[ c ] ) );
			 }
		 }
		 if ( sourceColors.length != 0 )
		 {
			 var zone = this.utilities.getZone( {}, this.dimension, this.scale )
			 this.startDrawing();
			 this.utilities.remapBlock( this.context, sourceColors, destinationColors, zone );
			 this.endDrawing();
		 }
	 }
	 this.setModified();
 };
 Screen.prototype.setColour = function( number, color )
 {
	 if ( this.aoz.usePalette )
	 {
		 if ( number < 0 )
			 throw { error: 'illegal_function_call', parameter: number };
		 number = number % this.vars.numberOfColors;
		 this.vars.palette[ number ] = this.utilities.getModernColorString( color, this.aoz.useShortColors );
		 if ( this.halfBrightMode && number < 32 )
			 this.setHalfBrightColor( number );
		 this.setModified();
	 }
 };
 Screen.prototype.getColour = function( number )
 {
	 if ( !this.aoz.usePalette )
		 throw 'function_not_available_in_true_color_mode';
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };

	 number = number % this.vars.numberOfColors;
	 var color = this.vars.palette[ number ];
	 if ( this.aoz.useShortColors )
		 return parseInt( '0x' + color.substr( 1, 1 ) + color.substr( 3, 1 ) + color.substr( 5, 1 ) );
	 return parseInt( '0x' + color.substr( 1, 2 ) + color.substr( 3, 2 ) + color.substr( 5, 2 ) );
 };
 Screen.prototype.getColorAlpha = function( color )
 {
	 if ( this.aoz.usePalette )
		 return this.alphas[ color % this.vars.numberOfColors ];

	 color = this.getColorString( color );
	 return typeof this.alphas[ color ] == 'undefined' ? 1.0 : this.alphas[ color ];
 };
 Screen.prototype.getColorString = function( color )
 {
	 // True color?
	 if ( !this.aoz.usePalette )
	 {
		 if ( typeof color == 'number' )
			 color = color.toString( 16 );
		 if ( color.charAt( 0 ) == '#' )
			 color = color.substring( 1 );
		 while ( color.length < 6 )
			 color = '0' + color;
		 return ( '#' + color ).toUpperCase();
	 }

	 // Palette index...
	 color = color % this.vars.numberOfColors;
	 if ( this.dualPlayfieldBack )
		 color += 8;
	 if ( this.shade != 1 )
		 return this.utilities.adjustColor( this.vars.palette[ color ], this.shade );
	 return this.vars.palette[ color ];
 };
 Screen.prototype.setTransparent = function( colors, trueFalse, noremap )
 {
	 var sourceColors = [];
	 var destinationColors = [];
	 var alphas = [];
	 if ( colors.length == 0 && !trueFalse )
	 {
		 for ( var c = 0; c < this.alphas.length; c++ )
		 {
			 if ( this.alphas[ c ] == 0 )
				 colors.push( c );
		 }
	 }
	 for ( var c = 0; c < colors.length; c++ )
	 {
		 sourceColors[ c ] = this.aoz.utilities.getRGBAStringColors( this.vars.palette[ colors[ c ] % this.vars.numberOfColors ] );
		 if ( trueFalse )
		 {
			 alphas[ c ] = 0;
			 destinationColors[ c ] = sourceColors[ c ];
			 destinationColors[ c ].a = 0;
		 }
		 else
		 {
			 alphas[ c ] = 0;
			 destinationColors[ c ] = sourceColors[ c ];
			 destinationColors[ c ].a = 255;
		 }
	 }
	 this.setColorAlpha( colors, alphas );
	 if ( !noremap )
		 this.utilities.remapBlock( this.context, sourceColors, destinationColors, { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height } );
	 this.setModified();
 };
 Screen.prototype.setColorAlpha = function( colors, alphas )
 {
	 if ( this.aoz.usePalette )
	 {
		 for ( var c = 0; c < colors.length; c++ )
		 {
			 if ( colors[ c ] < 0 || alphas[ c ] < 0 || alphas[ c ] > 1 )
				 throw { error: 'illegal_function_call', parameter: alphas[ c ] };
			 this.alphas[ colors[ c ] % this.vars.numberOfColors ] = alphas[ c ];
		 }
	 }
	 else
	 {
		 for ( var c = 0; c < colors.length; c++ )
		 {
			 var color = this.getColorString( colors[ c ] );
			 if ( alphas[ c ] < 0 || alphas[ c ] > 1 )
				 throw { error: 'illegal_function_call', parameter: alphas[ c ] };
			 this.alphas[ color ] = alphas[ c ];
		 }
	 }
	 this.setModified();
 };
 Screen.prototype.isTransparentColor = function( color )
 {
	 if ( this.aoz.usePalette )
	 {
		 if ( color < 0 )
			 throw { error: 'illegal_function_call', parameter: color };
		 return this.alphas[ color % this.vars.numberOfColors ] == 0;
	 }
	 color = this.getModernColorString( color, false );
	 if ( typeof this.alphas[ color ] != 'undefined' && typeof this.alphas[ color ] > 0 )
		 return false;
	 return true;
 };
 Screen.prototype.remap = function( colorsSource, colorsDestination, rectangle )
 {
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale )

	 // Check colors
	 var rgbaSource = [], rgbaDestination = [];
	 for ( var c = 0; c < colorsSource.length; c++ )
	 {
		 var a = ( Math.floor( this.getColorAlpha( colorsSource[ c ] ) * 255 ) ).toString( 16 );
		 a += a.length < 2 ? ' ' : '';
		 rgbaSource.push( this.utilities.getRGBAStringColors( this.getColorString( colorsSource[ c ] ) + a ) );
		 if ( this.dualPlayfieldBack && colorsSource[ c ] == 0 )
		 {
			 rgbaDestination.push( this.utilities.getRGBAStringColors( '#00000000' ) );
		 }
		 else
		 {
			 a = ( Math.floor( this.getColorAlpha( colorsDestination[ c ] ) * 255 ) ).toString( 16 );
			 a += a.length < 2 ? ' ' : '';
			 rgbaDestination.push( this.utilities.getRGBAStringColors( this.getColorString( colorsSource[ c ] ) + a ) );
		 }
	 }
	 this.startDrawing();
	 this.utilities.remapBlock( this.context, rgbaSource, rgbaDestination, zone );
	 this.endDrawing();
 };
 Screen.prototype.findColorIndex = function( r, g, b )
 {
	 for ( var p = 0; p < this.vars.palette.length; p++ )
	 {
		 var rgb = this.utilities.getRGBAStringColors( this.vars.palette[ p ] );
		 if ( rgb.r == r && rgb.g == g && rgb.b == b )
		 {
			 return p;
		 }
	 }
	 return -1;
 };
 Screen.prototype.ink$ = function( value )
 {
	 return String.fromCharCode( 27 ) + 'IN' + value + '\r';
 };
 Screen.prototype.setFont$ = function( value )
 {
	 return String.fromCharCode( 27 ) + 'SF' + value + '\r';
 };
 Screen.prototype.setItalic$ = function( value )
 {
	 return String.fromCharCode( 27 ) + 'IT' + ( value ? 1 : 0 ) + '\r';
 };
 Screen.prototype.setBold$ = function( value )
 {
	 return String.fromCharCode( 27 ) + 'BO' + ( value ? 1 : 0 ) + '\r';
 };
 Screen.prototype.setFontSize$ = function( value )
 {
	 return String.fromCharCode( 27 ) + 'SS' + value + '\r';
 };
 Screen.prototype.setImage$ = function( name, path )
 {
	 return String.fromCharCode( 27 ) + 'I1' + name + '\r' + String.fromCharCode( 27 ) + 'I2' + path + '\r'
 };
 Screen.prototype.setLink$ = function( name, path )
 {
	 return String.fromCharCode( 27 ) + 'L1' + name + '\r' + String.fromCharCode( 27 ) + 'L2' + path + '\r'
 };

 //////////////////////////////////////////////////////////////////////
 // Block transfer
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.cls = function( color, rectangle, coords )
 {
	 if ( this.aoz.platform == 'aoz' )
		 color = typeof color == 'undefined' ? 0 : color;
	 else
		 color = typeof color == 'undefined' ? 1 : color;
	 if ( coords )
	 {
		 rectangle.width = coords.x2 - rectangle.x;
		 rectangle.height = coords.y2 - rectangle.y;
	 }
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );
	 if ( zone.width < 0 )
		 zone.x += this.scale.x;
	 if ( zone.height < 0 )
		 zone.y += this.scale.y;
	 this.startDrawing();
	 if ( this.isTransparentColor( color ) )
	 {
		 this.context.clearRect( zone.x, zone.y, zone.width, zone.height );
	 }
	 else
	 {
		 this.context.globalAlpha = this.getColorAlpha( color );
		 this.context.fillStyle = this.getColorString( color );
		 this.context.fillRect( zone.x, zone.y, zone.width, zone.height );
	 }
	 this.currentTextWindow.home();
	 this.endDrawing();
 };
 Screen.prototype.pasteImage2 = function( bankName, number, position, dimension, angle, skew, alpha, tags, contextName )
 {
	 position.x = typeof position.x != 'undefined' ? position.x : 0.0;
	 position.y = typeof position.y != 'undefined' ? position.y : 0.0;
	 var image = this.banks.getImage( bankName, number, this.aoz.currentContextName );

	 dimension.width = typeof dimension.width != 'undefined' ? dimension.width : image.width;
	 dimension.height = typeof dimension.height != 'undefined' ? dimension.height : image.height;
	 var scale =
	 {
		 x: dimension.width / image.width,
		 y: dimension.height / image.height
	 };
	 angle = !isNaN( angle ) ? angle : 0;
	 this.paste( bankName, number, position, scale, angle, skew, alpha, tags, contextName );
	 this.setModified();
 };
 Screen.prototype.pasteImage = function( bankName, number, x, y, scaleX, scaleY, angle, skewX, skewY, alpha, tags, contextName )
 {
	 x = typeof x != 'undefined' ? x : 0.0;
	 y = typeof y != 'undefined' ? y : 0.0;
	 scaleX = scaleX ? scaleX : 1.0;
	 scaleY = scaleY ? scaleY : scaleX;
	 angle = !isNaN( angle ) ? angle : 0;
	 this.paste( bankName, number, { x: x, y: y }, { x: scaleX, y: scaleY }, angle, { x: skewX, y: skewY }, alpha, tags, contextName );
	 this.setModified();
 };
 Screen.prototype.pasteCanvas = function( canvas, rectangle )
 {
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 this.context.imageSmoothingEnabled= false;
	 this.context.drawImage( canvas, 0, 0, canvas.width, canvas.height, zone.x, zone.y, zone.width, zone.height );
	 this.endDrawing();
 };
 Screen.prototype.paste = function( bankName, number, position, scale, angle, skew, alpha, tags )
 {
	 var x = typeof position.x != 'undefined' ? position.x : 0.0;
	 var y = typeof position.y != 'undefined' ? position.y : 0.0;
	 var scaleX = 1.0;
	 var scaleY = 1.0;
	 if ( scale )
	 {
		 scaleX *= typeof scale.x != 'undefined' ? scale.x : 1.0;
		 scaleY *= typeof scale.y != 'undefined' ? scale.y : scaleX;
	 }
	 angle = !isNaN( angle ) ? angle : 0;
	 alpha = typeof alpha != 'undefined' ? alpha : 1.0;

	 var hRev = false;
	 var vRev = false;
	 if ( typeof number == 'number' )
	 {
		 hRev = ( number & 0x8000 ) != 0;
		 vRev = ( number & 0x4000 ) != 0;
		 number &= 0x3FFF;
	 }

	 var image = this.banks.getImage( bankName, number, this.aoz.currentContextName );
	 if ( image )
	 {
		 var canvas = image.getCanvas( hRev, vRev );
		 this.startDrawing();
		 this.context.save();
		 this.context.imageSmoothingEnabled= false;
		 this.context.globalAlpha = alpha;
		 this.context.filter = this.drawFilters.getFilterString();

		 if ( angle == 0 && skew.x == 0 && skew.y == 0 )
			 this.context.drawImage( canvas, ( x - image.hotSpotX * scaleX ) * this.scale.x, ( y - image.hotSpotY * scaleY ) * this.scale.y, image.width * scaleX * this.scale.x, image.height * scaleY * this.scale.y );
		 else
		 {
			 this.context.translate( x * this.scale.x, y * this.scale.y );
			 this.context.rotate( angle );
			 this.context.transform( scaleX, skew.y * scaleY, skew.x * scaleX, scaleY, 0, 0 )
			 this.context.translate( -image.hotSpotX, -image.hotSpotY );
			 this.context.drawImage( canvas, 0, 0, image.width, image.height, 0, 0, image.width * this.scale.x, image.height * this.scale.y );
		 }
		 this.context.restore();
		 this.endDrawing();
	 }
 };
 Screen.prototype.screenCopy = function( destination, rectangleSource, rectangleDestination, mode )
 {
	 destination.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 if ( typeof rectangleSource == 'undefined' && typeof rectangleDestination == 'undefined' )
	 {
		 destination.context.imageSmoothingEnabled= false;
		 destination.context.drawImage( this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, destination.canvas.width, destination.canvas.height );
	 }
	 else
	 {
		 rectangleDestination.width = typeof rectangleDestination.width == 'undefined' ? rectangleSource.width : rectangleDestination.width;
		 rectangleDestination.height = typeof rectangleDestination.height == 'undefined' ? rectangleSource.height : rectangleDestination.height;
		 var szone = this.utilities.getZone( rectangleSource, this.dimension, this.scale );
		 var dzone = this.utilities.getZone( rectangleDestination, destination.dimension, destination.scale );

		 this.context.imageSmoothingEnabled= false;
		 destination.context.imageSmoothingEnabled= false;
		 destination.context.drawImage( this.canvas, szone.x, szone.y, szone.width, szone.height, dzone.x, dzone.y, dzone.width, dzone.height );
	 }
	 destination.endDrawing();
 };
 Screen.prototype.screenProject = function( destination, x1, y1, x2, y2, dx1, dy1, dx2, dy2, dx3, dy3, dx4, dy4 )
 {
	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 this.context.scale( 1 / this.vars.scaleX, 1 / this.vars.scaleY );
	 if ( this != destination )
	 {
		 destination.startDrawing();
		 destination.context.scale( 1 / destination.vars.scaleX, 1 / destination.vars.scaleY );
	 }
	 x1 = typeof x1 == 'undefined' ? 0 : x1 * this.vars.scaleX;
	 y1 = typeof y1 == 'undefined' ? 0 : y1 * this.vars.scaleY;
	 x2 = typeof x2 == 'undefined' ? this.vars.width * this.vars.scaleX : x2 * this.vars.scaleX;
	 y2 = typeof y2 == 'undefined' ? this.vars.height * this.vars.scaleY : y2 * this.vars.scaleY;
	 dx1 = typeof dx1 == 'undefined' ? 0 : dx1 * destination.vars.scaleX;
	 dy1 = typeof dy1 == 'undefined' ? 0 : dy1 * destination.vars.scaleY;
	 dx2 = typeof dx2 == 'undefined' ? destination.vars.width * destination.vars.scaleX : dx2 * destination.vars.scaleX;
	 dy2 = typeof dy2 == 'undefined' ? 0 : dy2 * destination.vars.scaleY;
	 dx3 = typeof dx3 == 'undefined' ? destination.vars.width * destination.vars.scaleX : dx3 * destination.vars.scaleX;
	 dy3 = typeof dy3 == 'undefined' ? destination.vars.height * destination.vars.scaleY : dy3 * destination.vars.scaleY;
	 dx4 = typeof dx4 == 'undefined' ? 0 : dx4 * destination.vars.scaleX;
	 dy4 = typeof dy4 == 'undefined' ? destination.vars.height * destination.vars.scaleY : dy4 * destination.vars.scaleY;
	 var deltaDX1 = dx4 - dx1;
	 var deltaDY1 = dy4 - dy1;
	 var deltaDX2 = dx3 - dx2;
	 var deltaDY2 = dy3 - dy2;
	 var thickness = Math.max( 1, Math.max( this.utilities.getDistance( {x1:dx4,y1:dy4,x2:dx1,y2:dy1})/(y2-y1), this.utilities.getDistance( {x1:dx3,y1:dy3,x2:dx2,y2:dy2})/(y2-y1) ) * 2 );
	 var canvasLine = document.createElement( 'canvas' );
	 canvasLine.width = x2 - x1;
	 canvasLine.height = this.vars.scaleY * thickness;
	 var contextLine = canvasLine.getContext( '2d' );
	 contextLine.imageSmoothingEnabled= false;
	 var canvas = document.createElement( 'canvas' );
	 canvas.width = this.dimension.width * this.vars.scaleX;
	 canvas.height = this.dimension.height * this.vars.scaleY;
	 var context = canvas.getContext( '2d' );
	 context.drawImage( this.canvas, 0, 0 );

	 destination.context.imageSmoothingEnabled= false;

	 for ( var yy1 = y1; yy1 < y2; yy1 += this.vars.scaleY )
	 {
		 contextLine.drawImage( canvas, x1, yy1, x2 - x1, this.vars.scaleY, 0, 0, x2 - x1, this.vars.scaleY * thickness );
		 // Do copy
		 var done = ( yy1 - y1 ) / ( y2 - y1 );
		 var dXX1 = dx1 + deltaDX1 * done;
		 var dYY1 = dy1 + deltaDY1 * done;
		 var dXX2 = dx2 + deltaDX2 * done;
		 var dYY2 = dy2 + deltaDY2 * done;
		 var dx = dXX2 - dXX1;
		 var dy = dYY2 - dYY1;

		 var angle = Math.atan2( dy, dx );
		 var distance = Math.hypot( dx, dy );
		 destination.context.save();
		 destination.context.translate( dXX1, dYY1 );
		 destination.context.rotate( angle );
		 destination.context.drawImage( canvasLine, 0, 0, x2 - x1, this.scale.y, 0, 0, distance, destination.vars.scaleY * ( destination.vars.scaleY / this.vars.scaleY ) * thickness );
		 destination.context.restore();
		 contextLine.clearRect(0,0,canvas.width,canvas.height);
	 }
	 this.context.scale( this.vars.scaleX, this.vars.scaleY );
	 if ( this != destination )
	 {
		 destination.context.scale( destination.vars.scaleX, destination.vars.scaleY );
		 destination.endDrawing();
	 }
	 this.endDrawing();
 };
 Screen.prototype.defScroll = function( number, rectangle, displacement )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 if ( !this.aoz.unlimitedScreens && number > 16 )
		 throw { error: 'illegal_function_call', parameter: number };
	 rectangle.width = typeof rectangle.width == 'undefined' ? rectangle.x2 - rectangle.x + 1 : rectangle.width;
	 rectangle.height = typeof rectangle.height == 'undefined' ? rectangle.y2 - rectangle.y + 1 : rectangle.height;
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );
	 this.scrolls[ number ] =
	 {
		 zone: zone,
		 dx: displacement.x * this.vars.scaleX,
		 dy: displacement.y * this.vars.scaleY
	 }
 };
 Screen.prototype.scroll = function( number )
 {
	 var self = this;

	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 if ( !this.aoz.unlimitedScreen && number > 16 )
		 throw { error: 'illegal_function_call', parameter: number };
	 if ( !this.scrolls[ number ] )
		 throw 'scrolling_not_defined';
	 var scroll = this.scrolls[ number ];
	 this.startDrawing();
	 this.context.imageSmoothingEnabled= false;
	 this.context.globalAlpha = 1;
	 /*
	 if ( this.dualPlayfieldFront )
	 {
		 var canvas = document.createElement( 'canvas' );
		 canvas.width = scroll.zone.width;
		 canvas.height = scroll.zone.height;
		 var context = canvas.getContext( '2d' );
		 context.imageSmoothingEnabled= false;
		 context.drawImage( this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, 0, 0, scroll.zone.width, scroll.zone.height );
		 context.globalAlpha = 1;
		 context.fillStyle = this.getColorString( 0 );
		 context.fillRect( scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height );
		 this.context.drawImage( canvas, 0, 0, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height );
	 }
	 else
	 */
	 {
		 this.setClip( { x: scroll.zone.x, y: scroll.zone.y, width: scroll.zone.width, height: scroll.zone.height } );
		 this.context.drawImage( this.canvas, scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.zone.height, scroll.zone.x + scroll.dx, scroll.zone.y + scroll.dy, scroll.zone.width, scroll.zone.height );
		 this.clipOff();
		 clear( this.context );
	 }
	 this.endDrawing();

	 function clear( ct )
	 {
		 ct.globalAlpha = self.getColorAlpha( 0 );
		 ct.fillStyle = self.getColorString( 0 );
		 if ( scroll.dx < 0 )
			 ct.fillRect( scroll.zone.x + scroll.zone.width + scroll.dx, scroll.zone.y, -scroll.zone.dx, scroll.zone.height );
		 else if ( scroll.dx > 0 )
			 ct.fillRect( scroll.zone.x, scroll.zone.y, scroll.zone.dx, scroll.zone.height );
		 if ( scroll.dy < 0 )
			 ct.fillRect( scroll.zone.x, scroll.zone.y + scroll.zone.height + scroll.dy, scroll.zone.width, -scroll.dy );
		 else if ( scroll.dy > 0 )
			 ct.fillRect( scroll.zone.x, scroll.zone.y, scroll.zone.width, scroll.dy );
	 }
 };
 Screen.prototype.getImage = function( bankName, index, rectangle, tags, contextName )
 {
	 if ( typeof rectangle.width == 'undefined' && typeof rectangle.height == 'undefined')
	 {
		 rectangle.width = rectangle.x2 - rectangle.x + 1;
		 rectangle.height = rectangle.y2 - rectangle.y + 1;
	 }
	 if ( rectangle.width <= 0 || rectangle.height <= 0 )
		 throw  {error:'illegal_function_call', parameters:['Width/Height ',rectangle.width,rectangle.height]};
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );
	 var canvas = document.createElement( 'canvas' );
	 canvas.width = zone.width;
	 canvas.height = zone.height;
	 var context = canvas.getContext( '2d' );
	 context.imageSmoothingEnabled= false;
	 this.startDrawing();
	 context.drawImage( this.canvas, Math.floor(zone.x), Math.floor(zone.y), zone.width, zone.height, 0, 0, zone.width, zone.height );
	 this.endDrawing();

	 // Proper resize of canvas
	 if ( rectangle.width < zone.width || rectangle.height < zone.height )
		 this.utilities.resample_canvas( canvas, rectangle.width, rectangle.height, true );

	 var remap = true;//( this.aoz.platform == 'amiga' );
	 if ( this.utilities.getTag( tags, [ 'opaque' ] ) != '' )
		 remap = false;

	 // If there is transparent colors in the screen-> no remap
	 /*for ( var c = 0; c < this.vars.palette.length; c++ )
	 {
		 if ( this.isTransparentColor( c ) )
		 {
			 remap = false;
			 break;
		 }
	 }
	 */
	 var rgbtag = this.utilities.getTagParameter( tags, 'rgbtrans' );
	 if ( rgbtag )
	 {
		 var rgb$ = this.utilities.getModernColorString( rgbtag, this.aoz.useShortColors );
		 rgbtag = this.utilities.getRGBAStringColors( rgb$ );
		 rgb.r = rgbtag.r;
		 rgb.g = rgbtag.g;
		 rgb.b = rgbtag.b;
		 remap = true;
	 }
	 var colortag = this.utilities.getTagParameter( tags, 'colortrans' );
	 if ( colortag )
	 {
		 if ( colortag >= 0 && colortag < this.vars.palette.length )
		 {
			 rgb = this.utilities.getRGBAStringColors( this.vars.palette[ colortag ] );
			 remap = true;
		 }
	 }
	 if ( remap && bankName != 'icons' )
	 {
		 var rgb = this.utilities.getRGBAStringColors( this.vars.palette[ 0 ] );
		 this.utilities.remapBlock( context, [ rgb ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: canvas.width, height: canvas.height } );
	 }
	 contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 this.banks.insertImage( bankName, index, undefined, tags, contextName, undefined, canvas );
 };
 Screen.prototype.getImagePalette = function( bankName, mask, contextName )
 {
	 var self = this;
	 contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 var palette = this.banks.getImagePalette( bankName, contextName );
	 for ( var p = 0; p < Math.min( this.vars.numberOfColors, palette.length ); p++ )
	 {
		 if ( typeof palette[ p ] != 'undefined' )
		 {
			 if ( typeof mask == 'undefined' )
				 pokeColor( p, palette[ p ] );
			 else if ( ( p & mask ) != 0 )
				 pokeColor( p, palette[ p ] );
		 }
	 }
	 function pokeColor( number, color )
	 {
		 self.vars.palette[ number ] = color;
		 if ( number < 16 && self.vars.numberOfColors <= 16 )
			 self.vars.palette[ number + 16 ] = color;
	 }
 };



 //////////////////////////////////////////////////////////////////////
 // Drawing
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.setLineDash = function( pattern )
 {
	 var lineDash = [];
	 for ( dash = 0; dash < 9; dash++ )
	 {
	 	if ( pattern[ dash ] != undefined )
		 	lineDash[ dash ] = pattern[ dash ];	
	 }
	 this.linePattern = lineDash;
 };
Screen.prototype.lineDashOffset = function( number )
 {
	 this.context.lineDashOffset = number;
 };
 Screen.prototype.setLine = function( pattern )
 {
	 this.linePattern = [];
	 if ( pattern == 0 )
		 return;
	 var b = 0x8000;
	 var on = true;
	 var previousCount = 0;
	 var delta = 1 * this.scale.x;
	 for ( var count = 0; count < 16; count++ )
	 {
		 if ( ( pattern & b ) == 0 && on )
		 {
			 this.linePattern.push( ( count - previousCount ) * delta );
			 previousCount = count;
			 on = false;
		 }
		 else if ( ( pattern & b ) != 0 && !on )
		 {
			 this.linePattern.push( ( count - previousCount ) * delta );
			 previousCount = count;
			 on = true;
		 }
		 b = b >> 1;
	 }
 };
 Screen.prototype.drawShadow = function( shadow, fromInstruction )
 {
	 this.shadowX = typeof shadow.x != 'undefined' ? shadow.x : this.shadowX;
	 this.shadowY = typeof shadow.y != 'undefined' ? shadow.y : this.shadowY;
	 this.shadowBlur = typeof shadow.blur != 'undefined' ? shadow.blur : this.shadowBlur;
	 this.shadowColor = typeof shadow.color != 'undefined' ? shadow.color : this.shadowColor;
 };
 Screen.prototype.drawShadowOn = function ()
 {
	 this.context.shadowOffsetX = this.shadowX;
	 this.context.shadowOffsetY = this.shadowY;
	 this.context.shadowBlur = this.shadowBlur;
	 this.context.shadowColor = this.utilities.getModernRGBAString( this.shadowColor );
 };
 Screen.prototype.noShadow = function ()
 {
	 this.context.shadowOffsetX = 0;
	 this.context.shadowOffsetY = 0;
	 this.context.shadowBlur = 0;
	 this.context.shadowColor = null;
 };
 Screen.prototype.setLineWidth = function( width )
 {
	 if ( width <= 0 )
		 width = 1;
	 this.lineWidth = typeof width != 'undefined' ? width * ( this.scale.x + this.scale.y ) / 2 : ( this.scale.x + this.scale.y ) / 2;
	 this.context.lineWidth = this.lineWidth;
 };
 Screen.prototype.setLineCap = function( cap )
 {
	 if ( cap == 'round' || cap == 'butt' || cap == 'square' )
		 this.lineCap = cap;
	 if ( typeof cap == 'undefined')
		 this.lineCap = 'butt';
	 this.context.lineCap = this.lineCap;
 };
 Screen.prototype.setLineJoin = function( join )
 {
	 if ( join == 'round' || join == 'bevel' || join == 'miter' )
		 this.lineJoin = join;
	 if ( typeof join == 'undefined')
		 this.lineJoin = 'miter';
	 this.context.lineJoin = this.lineJoin;
 };
 Screen.prototype.setBorderFirst = function ( onOff )
 {
	this.borderFirst = onOff;
 };
 Screen.prototype.setInk = function( color, fillInk, borderInk )
 {
	 if ( typeof color != 'undefined' )
	 	 this.ink = Math.abs( color ) % this.vars.numberOfColors;
	 if ( typeof fillInk != 'undefined' )
		 this.fillInk = fillInk;
	 if ( typeof borderInk != 'undefined' )
		 this.borderInk = borderInk;
 };
 Screen.prototype.setPattern = function( pattern, scale, control )
 {
	 control = typeof control == 'undefined' ? 1 : control;
	 scale = typeof scale != 'undefined' ? Math.max( scale, 0.01 ) : 1.0001;
	 if ( pattern > 34 && control == 1 )
		 throw { error: 'illegal_function_call', parameter: pattern };
	 if ( typeof pattern == 'string')
	 	 this.pattern = control * this.banks.getImage( 'images', pattern, this.aoz.currentContextName ).index;
	 else
	 	 this.pattern = control * pattern;
	 this.patternScale = scale;
 };
 Screen.prototype.setBorderPattern = function( pattern, scale, control )
 {
	 control = typeof control == 'undefined' ? 1 : control;
	 scale = typeof scale != 'undefined' ? Math.max( scale, 0.01 ) : 1.0001;
	 if ( pattern > 34 && control == 1 )
		 throw { error: 'illegal_function_call', parameter: pattern };
	 if ( typeof pattern == 'string')
	 	 this.borderPattern = control * this.banks.getImage( 'images', pattern, this.aoz.currentContextName ).index;
	 else
	 	 this.borderPattern = control * pattern;
	 this.borderPatternScale = scale;
 };
 Screen.prototype.setPaint = function( onOff )
 {
	 this.paintBorder = onOff;
 };
 Screen.prototype.setWriting = function( style )
 {
	 this.onlyInk = !( ( style & 0x01 ) != 0 );
	 this.xor = ( style & 0x02 ) != 0;
	 this.inverse = ( style & 0x04 ) != 0;
 };
 Screen.prototype.getInk = function()
 {
	 return this.inverse ? this.fillInk : this.ink;
 };
 Screen.prototype.getFillInk = function()
 {
	 return this.inverse ? this.ink : this.fillInk;
 };
 Screen.prototype.getBorderInk = function()
 {
	 return this.borderInk;
 };
 Screen.prototype.getCompositeOperation = function()
 {
	 return this.xor ? 'difference' : 'source-over';
 };
 Screen.prototype.setBlend = function( blend )
 {
	 blend = typeof blend == 'undefined' ? 0 : blend;
	 if ( blend < 0 || blend > 25 )
		 throw { error: 'illegal_function_call', parameters:[ 'blend value out of range 0 - 25 (',blend,')' ]};
	 this.screenBlend = Blends[ blend ];
 };
 Blends = 
 [
	'source-over',		// 0
	'source-in',		// 1
	'source-out',		// 2
	'source-atop',		// 3
	'destination-over', // 4
	'destination-in',	// 5
	'destination-out',	// 6
	'destination-atop',	// 7
	'lighter',			// 8
	'copy',				// 9
	'xor',				// 10
	'multiply',			// 11
	'screen',			// 12
	'overlay',			// 13
	'darken',			// 14
	'lighten',			// 15
	'color-dodge',		// 16
	'color-burn',		// 17
	'hard-light',		// 18
	'soft-light',		// 19
	'difference',		// 20
	'exclusion',		// 21
	'hue',				// 22
	'saturation',		// 23
	'color',			// 24
	'luminosity'		// 25
 ]
 Screen.prototype.setShade = function( intensity )
 {
	 intensity = typeof intensity == 'undefined' ? 1 : intensity / 100;
	 if ( intensity < 0 || intensity > 255 )
		 throw { error: 'illegal_function_call', parameters:['intensity value out of range 0 - 25500 (',intensity * 100,')'] };
	 this.shade = intensity;
 };
 Screen.prototype.getPixelBlock = function( x, y, width, height )
 {
	 var pixels = this.context.getImageData( x, y, width, height );
	 return { pixels: pixels, width: width, height: height };
 };
 Screen.prototype.putPixelBlock = function( block, x, y )
 {
	 this.context.putImageData( block.pixels, x, y );
 };

 Screen.prototype.plot = function( position, color )
 {
	 var color = typeof color != 'undefined' ? color : this.getInk();
	 x = typeof position.x != 'undefined' ? position.x + 0.5 : Math.floor( this.grPosition.x ) + 0.5;
	 y = typeof position.y != 'undefined' ? position.y + 0.5 : Math.floor( this.grPosition.y ) + 0.5;

	 if ( !this.isTransparentColor( color ) )
	 {
		 this.beginDrawing();
		 this.context.fillStyle = this.getColorString( color );
		 this.context.fillRect( x * this.scale.x - this.scale.x / 2, y * this.scale.y - this.scale.y / 2, this.scale.x, this.scale.y );
		 if ( this.shadowColor )
			 this.noShadow();
		 this.endDrawing();
	 }
	 this.grPosition = position;
 };

 Screen.prototype.draw = function( coords )
 {
	 coords.x1 = typeof coords.x1 != 'undefined' ? coords.x1 : this.grPosition.x;
	 coords.y1 = typeof coords.y1 != 'undefined' ? coords.y1 : this.grPosition.y;
	 coords.x2 = typeof coords.x2 != 'undefined' ? coords.x2 : coords.x1;
	 coords.y2 = typeof coords.y2 != 'undefined' ? coords.y2 : coords.y1;
	 var fixedCoords = this.utilities.fixCoords( coords, this.scale );
	 this.beginDrawing();
	 if (this.pattern == 0)
		 this.context.strokeStyle = this.getColorString(this.getInk());
	 else
		 this.context.strokeStyle = this.createPattern(this.pattern,this.patternScale);
	 this.context.setLineDash(this.linePattern);
	 this.context.beginPath();
	 this.context.moveTo( fixedCoords.x1, fixedCoords.y1 );
	 this.context.lineTo( fixedCoords.x2, fixedCoords.y2 );
	 this.context.stroke();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = Math.floor( fixedCoords.x2 );
	 this.grPosition.y = Math.floor( fixedCoords.y2 );
 };
 Screen.prototype.polyline = function( coords, fill )
 {
	 var x = typeof coords[ 0 ] != 'undefined' ? coords[ 0 ] : this.grPosition.x;
	 var y = typeof coords[ 1 ] != 'undefined' ? coords[ 1 ] : this.grPosition.y;
	 this.beginDrawing();
	 this.context.beginPath();
	 this.context.moveTo( ( x ) * this.scale.x, ( y ) * this.scale.y );
	 for ( var c = 2; c < coords.length; c += 2 )
	 {
		 x = typeof coords[ c ] != 'undefined' ? coords[ c ] : x;
		 y = typeof coords[ c + 1 ] != 'undefined' ? coords[ c + 1 ] : y;
		 this.context.lineTo( ( x ) * this.scale.x, ( y ) * this.scale.y );
	 }
	 if ( fill )
	 {
	 	 this.context.closePath();
	 	 this.fillIt();
		 this.grPosition.x = coords[ 0 ];
		 this.grPosition.y = coords[ 1 ];
	 }
	 else
	 {
	 	 this.lineIt();
		 this.grPosition.x = x;
		 this.grPosition.y = y;
	 }
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();	 
 };
 Screen.prototype.curve = function( coords, points, radius )
 {
	 coords.x1 = typeof coords.x1 != 'undefined' ? coords.x1 : this.grPosition.x;
	 coords.y1 = typeof coords.y1 != 'undefined' ? coords.y1 : this.grPosition.y;
	 if ( !radius && ( typeof coords.x2 == 'undefined' || typeof coords.y2 == 'undefined' ) )
		 throw 'syntax_error';
	 var fixedCoords = this.utilities.fixCoords( coords, this.scale );
	 if ( typeof points.px1 == 'undefined' || typeof points.py1 == 'undefined' )
		 throw 'syntax_error';
	 this.beginDrawing();
	 if (this.pattern == 0)
		 this.context.strokeStyle = this.getColorString(this.getInk());
	 else
		 this.context.strokeStyle = this.createPattern(this.pattern,this.patternScale);
	 this.context.setLineDash(this.linePattern);
	 this.context.beginPath();
	 this.context.moveTo( fixedCoords.x1, fixedCoords.y1 );
	 if ( typeof points.px2 == 'undefined' && typeof points.py2 == 'undefined' )
		 this.context.quadraticCurveTo( points.px1,  points.py1, fixedCoords.x2, fixedCoords.y2 );
	 else
	 {
		 if ( typeof points.px2 == 'undefined' || typeof points.py2 == 'undefined' )
			 throw 'syntax_error';
		 if ( radius )
		 {
			 this.context.arcTo( points.px1,  points.py1,  points.px2,  points.py2, radius );
			 this.context.lineTo( points.px2,  points.py2 );
		 }
		 else
			 this.context.bezierCurveTo( points.px1,  points.py1,  points.px2,  points.py2, fixedCoords.x2, fixedCoords.y2 );
	 }
	 if ( this.shadowColor )
		 this.drawShadowOn();
	 if ( this.pattern == 0 )
		 this.context.strokeStyle = this.getColorString( this.getInk() );
	 else
		this.context.strokeStyle = this.createPattern( this.pattern, this.patternScale );
	 this.context.stroke();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = Math.floor( coords.x2 );
	 this.grPosition.y = Math.floor( coords.y2 );
 };
 Screen.prototype.grLocate = function( position )
 {
	 this.grPosition.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 this.grPosition.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
 };
 Screen.prototype.isPixelTransparent = function( position )
 {
	 position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	 if ( position.x < 0 || position.x > this.dimension.width || position.y < 0 || position.y > this.dimension.height )
		 return false;
	 var pixel = this.context.getImageData( position.x * this.scale.x, position.y * this.scale.y, 1, 1 );
	 return ( pixel.data[ 3 ] == 0 );
 };
 Screen.prototype.point = function( position, rgb )
 {
	 position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	 if ( position.x < 0 || position.x > this.dimension.width || position.y < 0 || position.y > this.dimension.height )
		 return -1;
	 var pixel = this.context.getImageData( position.x * this.scale.x, position.y * this.scale.y, 1, 1 );
	 if (rgb == 1)
		 return this.utilities.getAOZRGB( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ] );
	 if (rgb == 2)
		 return this.utilities.getRGBA( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ], pixel.data[ 3 ] );
	 if ( this.aoz.usePalette )
		 return this.findColorIndex( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ] );
	 return this.utilities.getRGBAString( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ], pixel.data[ 3 ] );
 };
 Screen.prototype.paint = function( position, mode, color, border )
 {
	 position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	 mode = typeof mode != 'undefined' ? mode : 0;
	 color = typeof color != 'undefined' ? color : this.getInk();
	 var borderColor = 'undefined';
	 if ( typeof border != 'undefined' )
	 	borderColor = this.getColour( border );
	 if ( mode == 1 && typeof border == 'undefined' )
	 	borderColor = this.getColour( this.getBorderInk() );
	 var x = position.x;
	 var y = position.y;
	 var pixel = this.context.getImageData( position.x * this.scale.x, position.y * this.scale.y, 1, 1 );
	 var startColor = this.utilities.getAOZRGB( pixel.data[ 0 ], pixel.data[ 1 ], pixel.data[ 2 ] );
	 if ( mode == 1 && startColor == borderColor )
	 	return;
	 var edgePixel = 0;
	 var edge = 0;
	 var found = 0;
	 var n = x;
	 do
	 	{
			n += 1;
			edgePixel = this.context.getImageData( n * this.scale.x, position.y * this.scale.y, 1, 1 );
			edge = this.utilities.getAOZRGB( edgePixel.data[ 0 ], edgePixel.data[ 1 ], edgePixel.data[ 2 ] );
			if ( mode == 0 )
			{
				if ( edge != startColor )
					found = 1;
			}
			else
			{
				if ( edge == borderColor )
					found = 1;
			}
		}
	while ( found == 0 && n < this.dimension.width );
	x = n - 1;
	var startX = x;
	var startY = y
	var finished = false;
	var self = this;
	var top = 0;
	var bot = 0;
	var lef = 0;
	var rgt = 0;
	var scanVars = {x:x,y:y,nextScan:0,count:0,abort:0,done:0,pixel:pixel,startColor:startColor,mode:mode,border:borderColor};
	this.beginDrawing();
	if ( this.pattern == 0 )
   		this.context.fillStyle = this.getColorString( color );
    else
   		this.context.fillStyle = this.createPattern( this.pattern, this.patternScale );
	this.context.beginPath();
	this.context.moveTo( startX + 0.5, startY + 0.5 );
	do
	{
		scanVars.done = 0;
		lef = scanVars.x == 0 ? 1 : 0;
		rgt = scanVars.x == this.dimension.width - 1 ? 1 : 0;
		top = scanVars.y == 0 ? 1 : 0;
		bot = scanVars.y == this.dimension.height - 1 ? 1 : 0;
		switch ( scanVars.nextScan )
		{
			case 0:
				if ( scanVars.done == 0 && !rgt && !bot )
					scan({x:1, y:1, next:3})
				if ( scanVars.done == 0 && !bot )
					scan({x:0, y:1, next:0})
				if ( scanVars.done == 0 && !bot && !lef )
					scan({x:-1, y:1, next:0})
				if ( scanVars.done == 0 )
				{
					scanVars.nextScan = 1;
					scanVars.abort += 1;
				}
				break;
			case 1:
				if ( scanVars.done == 0 && !lef && !bot )
					scan({x:-1, y:1,next:0})
				if ( scanVars.done == 0 && !lef )
					scan({x:-1, y:0,next:1})
				if ( scanVars.done == 0  && !lef && !top)
					scan({x:-1, y:-1,next:1})
				if ( scanVars.done == 0 )
				{
					scanVars.nextScan = 2;
					scanVars.abort += 1;
				}
				break;
			case 2:
				if ( scanVars.done == 0  && !lef && !top)
					scan({x:-1, y:-1,next:1})
				if ( scanVars.done == 0  && !top )
					scan({x:0, y:-1,next:2})
				if ( scanVars.done == 0  && !top && !rgt )
					scan({x:1, y:-1,next:2})
				if ( scanVars.done == 0 )
				{
					scanVars.nextScan = 3;
					scanVars.abort += 1;
				}
				break;
			case 3:
				if ( scanVars.done == 0  && !top && !rgt )
					scan({x:1, y:-1,next:2})
				if ( scanVars.done == 0 && !rgt )
					scan({x:1, y:0,next:3})
				if ( scanVars.done == 0 && !rgt && !bot )
					scan({x:1, y:1,next:3})
				if ( scanVars.done == 0 )
				{
					scanVars.nextScan = 0;
					scanVars.abort += 1;
				}
				break;
		}
		this.context.lineTo( scanVars.x * this.scale.x + 0.5, scanVars.y * this.scale.y + 0.5 );
		if ((scanVars.count > 1 && scanVars.x == startX && scanVars.y == startY) || scanVars.abort > 3 || scanVars.count > 100000)
			finished = true;
	}
	while ( finished == false );
	this.context.closePath();
	this.context.imageSmoothingEnabled = false;
	this.context.fill();
	this.endDrawing();
	function scan ( args )
    {
		scanPixel = self.context.getImageData( scanVars.x + args.x, scanVars.y + args.y, 1, 1 );
		newScan = self.utilities.getAOZRGB( scanPixel.data[ 0 ], scanPixel.data[ 1 ], scanPixel.data[ 2 ] );
		if ( newScan == scanVars.startColor && scanVars.mode == 0 || newScan != scanVars.border && scanVars.mode != 0 )
		{
			scanVars.x += args.x;
			scanVars.y += args.y;
			scanVars.nextScan = args.next;
			scanVars.count += 1;
			scanVars.abort = 0;
			scanVars.done = 1;
		}
    };
 };
 Screen.prototype.particle = function( particle )
 {
	if ( particle.x === undefined || particle.y === undefined || particle.size === undefined )
		throw 'syntax_error';
	particle.color = typeof particle.color !='undefined' ? particle.color : this.getInk();
	particle.alpha = typeof particle.alpha !='undefined' ? particle.alpha : this.getColorAlpha(particle.color);
	this.context.globalAlpha = particle.alpha;
	this.context.fillStyle = this.getColorString(particle.color);	
	this.context.fillStyle = '#ffffff';
	this.context.fillRect( particle.x + 0.5, particle.y + 0.5, particle.size, particle.size );
 };
 Screen.prototype.bar = function( rectangle )
 {
	 this.box( rectangle, true );
 }; 
 Screen.prototype.box = function( rectangle, fill, coords )
 {
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 if ( coords )
	 {
		 if ( typeof coords.x2 == 'undefined' || typeof coords.y2 == 'undefined' )
		 	throw 'syntax_error';
		 rectangle.width = coords.x2 - rectangle.x;
		 rectangle.height = coords.y2 - rectangle.y;
	 }
	 else
	 {
		 rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
		 rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : rectangle.width;
	 }
	 if ( fill )
	 {
		 if ( rectangle.width < 0 )
			 rectangle.x ++;
		 else if ( rectangle.width > 0 && coords )
			 rectangle.width ++;
		 if ( rectangle.height < 0 )
			 rectangle.y ++;
		 else if ( rectangle.height > 0 && coords )
			 rectangle.height ++;
	 }
	 else if ( !coords )
	 {
		 if ( rectangle.width < 0 )
			 rectangle.width ++;
		 else if ( rectangle.width > 0 )
			 rectangle.width --;
		 if ( rectangle.height < 0 )
			 rectangle.height ++;
		 else if ( rectangle.height > 0 )
			 rectangle.height --;
	 }
	 if ( rectangle.width == 0 && rectangle.height == 0 && this.lineWidth == 1 )
	 {
		 this.plot( { x:rectangle.x, y:rectangle.y } );
		 return;
	 }
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale, !fill );
	 this.beginDrawing();	 
	 this.utilities.setPixelated( this.canvas, true );
	 this.context.beginPath();
	 this.context.rect( zone.x, zone.y, zone.width, zone.height );
	 if ( fill )
	 	this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.disc = function( rectangle )
 {
	 rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
	 rectangle.height = rectangle.width;
	 this.ellipse( rectangle, 0, 2 * Math.PI, 0, false, true );
 };
 Screen.prototype.circle = function( rectangle, fill )
 {
	 rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : 100;
	 rectangle.height = rectangle.width;
	 if ( this.vars.pixelMode.indexOf( 'hires' ) >= 0 && this.aoz.platform == 'amiga')
		 rectangle.width *= 2;
	 this.ellipse( rectangle, 0, 2 * Math.PI, 0, false, fill );
 };
 Screen.prototype.ellipse = function( rectangle, angle1, angle2, rotation, counterclockwise, fill )
 {
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 rectangle.width = typeof rectangle.width == 'undefined' ? 100 : rectangle.width;
	 rectangle.height = typeof rectangle.height == 'undefined' ? rectangle.width / 1.5 : rectangle.height;
	 var zone = this.utilities.getZone( rectangle, { width:rectangle.width, height:rectangle.height }, this.scale, true );
	 angle1 = isNaN( angle1 ) ? 0 : angle1;
	 angle2 = isNaN( angle2 ) ? 2 * Math.PI : angle2;
	 rotation = isNaN( rotation ) ? 0 : rotation;
	 counterclockwise = typeof counterclockwise == 'undefined' ? 0 : counterclockwise;
	 this.beginDrawing();
	 this.context.beginPath();
	 this.context.ellipse( zone.x, zone.y, zone.width, zone.height, rotation, angle1,  angle2, counterclockwise );
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.segment = function( rectangle, radius, angle1, angle2, rotation, counterclockwise, fill )
 {
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 var zone = this.utilities.getZone( rectangle, { width: 100, height: 100 }, this.scale, true );
	 var ratio = zone.width / zone.height;
	 angle1 = isNaN( angle1 ) ? 0 : angle1;
	 angle2 = isNaN( angle2 ) ? 2 * Math.PI : angle2;
	 rotation = isNaN( rotation ) ? 0 : rotation;
	 counterclockwise = typeof counterclockwise == 'undefined' ? 0 : counterclockwise;
	 this.beginDrawing();
	 this.context.beginPath();
	 this.context.ellipse( zone.x, zone.y, zone.width, zone.height, rotation, angle1,  angle2, counterclockwise );
	 this.context.ellipse( zone.x, zone.y, radius * this.scale.x, radius / ratio * this.scale.y, rotation, angle2,  angle1, !counterclockwise );
	 this.context.closePath()
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.shape = function( rectangle, sides, rotation, fill )
 {
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 rectangle.width = typeof rectangle.width == 'undefined' ? 100 : rectangle.width;
	 rectangle.height = typeof rectangle.height == 'undefined' ? rectangle.width : rectangle.height;
	 sides = typeof sides != 'undefined' ? sides : 3;
	 rotation = isNaN( rotation ) ? 0 : rotation;
	 var zone = this.utilities.getZone( rectangle, { width:rectangle.width, height:rectangle.height }, this.scale, true );
	 var a = 2 * Math.PI / sides;
	 var x, y;
	 this.beginDrawing();
	 this.context.beginPath();
	 if ( zone.width == zone.height )
	 {
		 for ( var c = 0; c < 2 * Math.PI + 0.01; c += a )
		 {
			 x = zone.width * Math.cos( c + rotation ) + zone.x;
			 y = zone.height * Math.sin( c + rotation ) + zone.y;
			 this.context.lineTo( x, y );
		 }
	 }
	 else
	 {
		 var posX, posY;
		 for (var c = a; c < 2 * Math.PI + 0.01; c += a) 
		 {
			 posX = zone.width * Math.cos( c ) + zone.x;
			 posY = zone.height * Math.sin( c ) + zone.y;
		  	 x = ( Math.cos( rotation ) * (posX - zone.x )) - (Math.sin( rotation ) * (posY - zone.y)) + zone.x;
		 	 y = ( Math.sin( rotation ) * (posX - zone.x )) + (Math.cos( rotation ) * (posY - zone.y)) + zone.y;
			 this.context.lineTo(x, y);
		 }
	 }
	 this.context.closePath();
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.squircle = function( rectangle, radius, fill, coords, corners )
 {
	 corners = typeof corners == 'undefined' ? 15 : corners;
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 radius = typeof radius != 'undefined' ? radius : 10;
	 if ( coords )
	 {
		 if ( typeof coords.x2 == 'undefined' || typeof coords.y2 == 'undefined' )
			 throw 'syntax_error';
		 rectangle.width = coords.x2 - rectangle.x;
		 rectangle.height = coords.y2 - rectangle.y;
	 }
	 if ( fill )
	 {
		 if ( rectangle.width < 0 )
			 rectangle.x ++;
		 else if ( rectangle.width > 0 && coords )
			 rectangle.width ++;
		 if ( rectangle.height < 0 )
			 rectangle.y ++;
		 else if ( rectangle.height > 0 && coords )
			 rectangle.height ++;
	 }
	 else if ( !coords )
	 {
		 if ( rectangle.width < 0 )
			 rectangle.width ++;
		 else if ( rectangle.width > 0 )
			 rectangle.width --;
		 if ( rectangle.height < 0 )
			 rectangle.height ++;
		 else if ( rectangle.height > 0 )
			 rectangle.height --;
	 }
	 if ( rectangle.width == 0 && rectangle.height == 0 )
	 {
		 this.plot( { x:rectangle.x, y:rectangle.y } );
		 return;
	 }
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale, !fill );
	 var x1 = zone.x + radius;
	 var y1 = zone.y + radius;
	 var x2 = x1 + zone.width - 2 * radius;
	 var y2 = y1 + zone.height - 2 * radius;
	 this.beginDrawing();
	 this.context.beginPath();
	 if ( corners & 2 )
		 this.context.arc( x2, y2, radius, 0, Math.PI / 2);
	 else
	 	 this.context.moveTo( zone.x + zone.width, zone.y + zone.height );
	 if ( corners & 1 )
	 	this.context.arc( x1, y2, radius, Math.PI / 2, Math.PI);
	 else
	 	this.context.lineTo( zone.x, zone.y + zone.height );
	 if ( corners & 8 )
		 this.context.arc( x1, y1, radius, Math.PI, Math.PI * 1.5);
	 else
	 	this.context.lineTo( zone.x, zone.y);
	 if ( corners & 4 )
	 	this.context.arc( x2, y1, radius, Math.PI * 1.5, Math.PI * 2);
	 else
	 	this.context.lineTo( zone.x + zone.width, zone.y );
	 this.context.closePath();
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();	
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.triangle = function ( vertices, angle, fill )
 {
	 vertices.x1 = typeof vertices.x1 != 'undefined' ? vertices.x1 : this.grPosition.x;
	 vertices.y1 = typeof vertices.y1 != 'undefined' ? vertices.y1 : this.grPosition.y;
	 if ( typeof vertices.x2 == 'undefined' || typeof vertices.y2 == 'undefined' || typeof vertices.x3 == 'undefined' || typeof vertices.y3 == 'undefined' )
	 	 throw 'syntax_error';
	 angle = isNaN( angle ) ? 0 : angle;
	 var cx = ( vertices.x1 + vertices.x2 + vertices.x3 ) / 3;
	 var cy = ( vertices.y1 + vertices.y2 + vertices.y3 ) / 3;
	 var vertex1 = angle == 0 ? { x:vertices.x1, y:vertices.y1 } : this.utilities.rotatePoint( {x:vertices.x1, y:vertices.y1 }, { x:cx, y:cy }, angle );
	 var vertex2 = angle == 0 ? { x:vertices.x2, y:vertices.y2 } : this.utilities.rotatePoint( {x:vertices.x2, y:vertices.y2 }, { x:cx, y:cy }, angle );
	 var vertex3 = angle == 0 ? { x:vertices.x3, y:vertices.y3 } : this.utilities.rotatePoint( {x:vertices.x3, y:vertices.y3 }, { x:cx, y:cy }, angle );
	 this.beginDrawing();
	 this.context.beginPath();
	 this.context.moveTo( vertex1.x * this.scale.x, vertex1.y * this.scale.y );
	 this.context.lineTo( vertex2.x * this.scale.x, vertex2.y * this.scale.y );
	 this.context.lineTo( vertex3.x * this.scale.x, vertex3.y * this.scale.y );
	 this.context.closePath();
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.endDrawing();	
	 this.grPosition.x = cx;
	 this.grPosition.y = cy;
 };
 Screen.prototype.star = function( rectangle, points, rotation, fill )
 {
	 rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : this.grPosition.x;
	 rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : this.grPosition.y;
	 points = points < 2 ? 2 : points;
	 points = typeof points != 'undefined' ? Math.floor(points) : 5;
	 rotation = isNaN( rotation ) ? 0 : rotation;
	 var zone = this.utilities.getZone( rectangle, { width:100, height: ( rectangle.width ) / 3 }, this.scale, true );
	 var a = Math.PI / points;
	 var x, y;
	 this.beginDrawing();
	 this.context.beginPath();
	 for ( var c = 0; c < 2 * Math.PI-0.0001; c += a * 2 )
	 {
		 x = zone.x + zone.height * Math.cos( c + rotation );
		 y = zone.y + zone.height * Math.sin( c + rotation );
		 this.context.lineTo( x, y );
		 x = zone.x + zone.width * Math.cos( c + a + rotation );
		 y = zone.y + zone.width * Math.sin( c + a + rotation );
		 this.context.lineTo( x, y );
	 }
	 this.context.closePath();
	 if ( fill )
		 this.fillIt();
	 else
		 this.lineIt();
	 this.endDrawing();
	 if ( this.shadowColor )
		 this.noShadow();
	 this.grPosition.x = rectangle.x;
	 this.grPosition.y = rectangle.y;
 };
 Screen.prototype.polygon = function( coords )
 {
	this.polyline( coords, true )
 };
 Screen.prototype.fillIt = function()
 {
	 var self = this;
	 if ( this.borderFirst == true )
	 {
	  	 drawBorder();
		 this.context.globalAlpha = this.getColorAlpha(this.getInk());
	 }
	 if ( this.pattern == 0 )
		 this.context.fillStyle = this.getColorString(this.getInk());
	 else
		 this.context.fillStyle = this.createPattern(this.pattern, this.patternScale );
	 this.context.fill();
	 if ( this.borderFirst == false )
		 drawBorder();
	 function drawBorder ()
	 {
		if ( self.paintBorder )
		{
			self.context.filter = self.borderFilters.getFilterString();
			self.noShadow();
			self.context.setLineDash(self.linePattern);
			if (self.borderGradient)
				self.context.strokeStyle = self.borderGradient;
			else if (self.borderPattern)
			{
				self.context.strokeStyle = self.createPattern(self.borderPattern, self.borderPatternScale );
			}
			else
			{
				self.context.strokeStyle = self.getColorString(self.getBorderInk());
				self.context.globalAlpha = self.getColorAlpha(self.getBorderInk());
			}
			self.context.stroke();
			self.context.filter = 'none';
		}
	 };
 };
 Screen.prototype.lineIt = function()
 {
	 if (this.pattern == 0)
		 this.context.strokeStyle = this.getColorString(this.getInk());
	 else
		 this.context.strokeStyle = this.createPattern( this.pattern, this.patternScale );
	 this.context.setLineDash(this.linePattern);
	 this.context.stroke();
 };
 Screen.prototype.createPattern = function( pattern, scale )
 {
	 // Create a little canvas
	 if (pattern == 1000)
		 return this.gradient;
	 if ( pattern < 0 )
	 {
		var image = this.banks.getImage( 'images', - pattern, this.aoz.currentContextName );
		var canvas = image.getCanvas( 0, 0 );
		var patternCanvas = document.createElement( 'canvas' );
	 	patternCanvas.width = Math.min( image.width * scale * this.scale.x, this.vars.width * this.vars.scaleX ) ;
		patternCanvas.height = Math.min( image.height * scale * this.scale.y, this.vars.height * this.vars.scaleY );
		var context = canvas.getContext( '2d' );
		var patternContext = patternCanvas.getContext( '2d' );
		if ( image )
		{
			patternContext.imageSmoothingEnabled = false;
			patternContext.drawImage( canvas, 0, 0, image.width, image.height, 0, 0, image.width * scale * this.scale.x, image.height * scale * this.scale.y );
		}
		return this.context.createPattern( patternCanvas, 'repeat' );
	 }
	 if ( scale == 1.0001 )
	 	scale = this.platform != 'amiga' ? 4 : 1;
	 var canvas = document.createElement( 'canvas' );
	 canvas.width = 8 * this.scale.x;
	 canvas.height = 8 * this.scale.y;
	 var context = canvas.getContext( '2d' );
	 var imageData = context.getImageData( 0, 0, canvas.width, canvas.height  );
	 var colorBack = this.utilities.getRGBAStringColors( this.getColorString( this.getFillInk() ) );
	 var colorInk = this.utilities.getRGBAStringColors( this.getColorString( this.getInk() ) );
	 var alphaBack = this.getColorAlpha( this.getFillInk() );
	 var alphaInk = this.getColorAlpha( this.getInk() );
	 var source = Patterns[ pattern ];
	 for ( var y = 0; y < 8; y++ )
	 {
		 for ( yy = 0; yy < this.scale.y; yy++ )
		 {
			 for ( var x = 0; x < 8; x++ )
			 {
				 var mask = 0x80 >> x;
				 for ( xx = 0; xx < this.scale.x; xx++ )
				 {
					 var offset = ( y * this.scale.y + yy ) * 32 * this.scale.x + ( x * this.scale.x + xx ) * 4;
					 if ( ( source[ y ] & mask ) == 0 )
					 {
						 imageData.data[ offset ] = colorInk.r;
						 imageData.data[ offset + 1 ] = colorInk.g;
						 imageData.data[ offset + 2 ] = colorInk.b;
						 imageData.data[ offset + 3 ] = alphaBack * 255;
					 }
					 else
					 {
						 imageData.data[ offset ] = colorBack.r;
						 imageData.data[ offset + 1 ] = colorBack.g;
						 imageData.data[ offset + 2 ] = colorBack.b;
						 imageData.data[ offset + 3 ] = alphaInk * 255;
					 }
				 }
			 }
		 }
	 }
	 context.putImageData( imageData, 0, 0 );
	 var patternCanvas = document.createElement( 'canvas' );
	 patternCanvas.width = Math.min( canvas.width * scale * this.scale.x, this.vars.width * this.vars.scaleX ) ;
	 patternCanvas.height = Math.min( canvas.height * scale * this.scale.y, this.vars.height * this.vars.scaleY );
	 var patternContext = patternCanvas.getContext( '2d' );
	 patternContext.imageSmoothingEnabled = false;
	 patternContext.drawImage( canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width * scale * this.scale.x, canvas.height * scale * this.scale.y );
	 // Create the pattern
	 return this.context.createPattern( patternCanvas, 'repeat' );
 };
 Patterns =
 [
	 [ 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ],         //  0
	 [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  1
	 [ 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA ],         //  2
	 [ 0xFF, 0xFF, 0xEF, 0xD7, 0xFF, 0xFF, 0xFE, 0x7D ],         //  3
	 [ 0xFD, 0xFD, 0x55, 0xAF, 0xDF, 0xDF, 0x55, 0xFA ],         //  4
	 [ 0xBF, 0x7F, 0xFF, 0xF7, 0xFB, 0xFD, 0xFF, 0xDF ],         //  5
	 [ 0x99, 0x39, 0x27, 0xE7, 0x7E, 0x72, 0xF3, 0x9F ],         //  6
	 [ 0xFF, 0xFF, 0xFB, 0xFF, 0xFF, 0xFF, 0x7F, 0xFF ],         //  7
	 [ 0x07, 0x93, 0x39, 0x70, 0xE0, 0xC9, 0x9C, 0x0E ],         //  8
	 [ 0xDE, 0xC0, 0xF3, 0x7B, 0x01, 0xFA, 0xF9, 0xFD ],         //  9
	 [ 0xF7, 0xFF, 0x55, 0xFF, 0xF7, 0xFF, 0x77, 0xFF ],         //  10
	 [ 0x88, 0x67, 0x07, 0x07, 0x88, 0x76, 0x70, 0x70 ],         //  11
	 [ 0x7F, 0x7F, 0xBE, 0xC1, 0xF7, 0xF7, 0xEB, 0x1C ],         //  12
	 [ 0x7E, 0xBD, 0xDB, 0xE7, 0xF9, 0xFE, 0x7F, 0x7F ],         //  13
	 [ 0x0F, 0x0F, 0x0F, 0x0F, 0xF0, 0xF0, 0xF0, 0xF0 ],         //  14
	 [ 0xF7, 0xE3, 0xC1, 0x80, 0x00, 0x80, 0xC1, 0xE3 ],         //  15
	 [ 0xEE, 0xDD, 0xBB, 0x00, 0x77, 0xBB, 0xDD, 0x00 ],         //  16
	 [ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  17
	 [ 0xBD, 0x7E, 0x7E, 0xBD, 0xDB, 0xE7, 0xE7, 0xDB ],         //  18
	 [ 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  19
	 [ 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  20
	 [ 0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  21
	 [ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  22
	 [ 0x7C, 0xF8, 0xF1, 0xE3, 0xC7, 0x8F, 0x1F, 0x3E ],         //  23
	 [ 0xFE, 0xFD, 0xFB, 0xF7, 0xEF, 0xDF, 0xBF, 0x7F ],         //  24
	 [ 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  25
	 [ 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF ],         //  26
	 [ 0x00, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F ],         //  27
	 [ 0xFF, 0xBB, 0xFF, 0xEE, 0xFF, 0xBB, 0xFF, 0xEE ],         //  28
	 [ 0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA, 0xFF, 0xAA ],         //  29
	 [ 0x77, 0xAA, 0xDD, 0xAA, 0x77, 0xAA, 0xDD, 0xAA ],         //  30
	 [ 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA ],         //  31
	 [ 0x55, 0x22, 0x55, 0x88, 0x55, 0x22, 0x55, 0x88 ],         //  32
	 [ 0x55, 0x00, 0x55, 0x00, 0x55, 0x00, 0x55, 0x00 ],         //  33
	 [ 0x11, 0x00, 0x44, 0x00, 0x11, 0x00, 0x44, 0x00 ]          //  34
 ]
Screen.prototype.setGradient = function( args, color, type )
{	
	var colorArray = color.split(',');
	var colorElements = colorArray.length / 2;
	var stopPoint = 0;
	var stopColor = '';
	if (colorArray.length % 2 != 0)
		throw { error: 'illegal_function_call', parameters:[ 'Invalid Color String' ]};
	if (typeof args.r1 != 'undefined' && typeof args.r2 != 'undefined')
	{
		if ( type == 0 )
			this.gradient = this.context.createRadialGradient(args.x1, args.y1, args.r1, args.x2, args.y2, args.r2);
		else
			this.borderGradient = this.context.createRadialGradient(args.x1, args.y1, args.r1, args.x2, args.y2, args.r2);
	}
	else if (typeof args.angle != 'undefined')
	{
		if ( type == 0 )
			this.gradient = this.context.createConicGradient(args.angle, args.x1, args.y1);
		else
			this.borderGradient = this.context.createConicGradient(args.angle, args.x1, args.y1);
	}
	else
	{
		if ( type == 0 )
			this.gradient = this.context.createLinearGradient(args.x1, args.y1, args.x2, args.y2);
		else
			this.borderGradient = this.context.createLinearGradient(args.x1, args.y1, args.x2, args.y2);
	}
	for ( var c = 0; c < colorElements; c += 1 )
	{
		stopPoint = parseFloat( colorArray[ c * 2 ] ) / 100;
		stopColor = colorArray[ c * 2 + 1 ];
		if ( stopPoint < 0 || stopPoint > 1 )
			throw {error:'illegal_function_call',parameters:['Stop Point out of range 0 to 100']};
		if ( stopColor.substring(0,1) == '$' )
			stopColor = '#' + stopColor.substring(1);
		if ( type == 0 )
 			this.gradient.addColorStop( stopPoint, stopColor );
		else
			this.borderGradient.addColorStop( stopPoint, stopColor );
	}
	if ( type == 0 )
 		this.pattern = 1000;
};
//////////////////////////////////////////////////////////////////////
// Filters
//////////////////////////////////////////////////////////////////////

// Global screen filters
Screen.prototype.setFilter = function( args )
{
	this.vars.filters.setFilter( args );
	this.setModified();
};
Screen.prototype.delFilter = function( args )
{
	this.vars.filters.delFilter( args );
	this.setModified();
};
Screen.prototype.getFilter = function( args )
{
	return this.vars.filters.getFilter( args );
};
Screen.prototype.getFilterString = function()
{
	return this.vars.filters.getFilterString();
};

// Drawing filters
Screen.prototype.addDrawFilter = function( args )
{
	this.drawFilters.setFilter( args );
};
Screen.prototype.delDrawFilter = function( args )
{
	this.drawFilters.delFilter( args );
};
Screen.prototype.getDrawFilter = function( args )
{
	return this.drawFilters.getFilter( args );
};
Screen.prototype.getDrawFilterString = function()
{
	return this.drawFilters.getFilterString();
};
// Border filters
Screen.prototype.addBorderFilter = function( args )
{
	this.borderFilters.setFilter( args );
};
Screen.prototype.delBorderFilter = function( args )
{
	this.borderFilters.delFilter( args );
};
Screen.prototype.getBorderFilter = function( args )
{
	return this.borderFilters.getFilter( args );
};
Screen.prototype.getBorderFilterString = function()
{
	return this.borderFilters.getFilterString();
};
// Bob filters
Screen.prototype.addBobFilter = function( args )
{
	if ( typeof args.index == 'undefined' )
	{
		this.bobsContext.parseAll( undefined, function( bob )
		{
			bob.setFilter( args );
		} );
		this.bobsToUpdate = true;
		this.setModified();
	}
	else
	{
		this.getBob( args.index, 'bob_not_defined' ).setFilter( args );
		this.bobsToUpdate = true;
		this.setModified();
	}
};
Screen.prototype.delBobFilter = function( args )
{
	if ( typeof args.index == 'undefined' )
	{
		this.bobsContext.parseAll( undefined, function( bob )
		{
			bob.delFilter( args );
		} );
		this.bobsToUpdate = true;
		this.setModified();
	}
	else
 {
		this.getBob( args.index, 'bob_not_defined' ).delFilter( args );
		this.bobsToUpdate = true;
		this.setModified();
	}
};
Screen.prototype.getBobFilter = function( args )
{
	this.getBob( args.index, 'bob_not_defined' ).getFilter( args );
};
Screen.prototype.getBobFilterString = function()
{
	return this.getBob( args.index, 'bob_not_defined' ).getFilterString();
};

 //////////////////////////////////////////////////////////////////////
 // Icons
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.getIconPalette = function( mask, contextName )
 {
	 var self = this;
	 contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 var palette = this.banks.getIconPalette( contextName );
	 for ( var p = 0; p < Math.min( this.vars.numberOfColors, palette.length ); p++ )
	 {
		 if ( typeof palette[ p ] != 'undefined' )
		 {
			 if ( typeof mask == 'undefined' )
				 pokeColor( p, palette[ p ] );
			 else if ( ( p & mask ) != 0 )
				 pokeColor( p, palette[ p ] );
		 }
	 }
	 function pokeColor( number, color )
	 {
		 self.vars.palette[ number ] = color;
		 if ( number < 16 && self.vars.numberOfColors <= 16 )
			 self.vars.palette[ number + 16 ] = color;
	 }
 };
 Screen.prototype.getIcon = function( index, rectangle, tags, contextName )
 {
	 var zone = this.utilities.getZone( rectangle, this.dimension, this.scale );

	 var canvas = document.createElement( 'canvas' );
	 canvas.width = rectangle.width;
	 canvas.height = rectangle.height;
	 var context = canvas.getContext( '2d' );
	 context.imageSmoothingEnabled= false;
	 this.startDrawing();
	 context.drawImage( this.canvas, zone.x, zone.y, zone.width, zone.height, 0, 0, canvas.width, canvas.height );
	 this.endDrawing();

	 contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 this.banks.insertIcon( index, undefined, tags, contextName, undefined, canvas );
 };
 Screen.prototype.update = function( force )
 {
	this.bobsUpdate( force );
	//this.update3D( force );
 };


 //////////////////////////////////////////////////////////////////////
 // Bobs
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.getBob = function( index, errorMessage )
 {
	 return this.bobsContext.getElement( this.aoz.currentContextName, index, errorMessage );
 };
 Screen.prototype.getNumberOfBobs = function()
 {
	 return this.bobsContext.getNumberOfElements( this.aoz.currentContextName );
 };
 Screen.prototype.getHighestBobIndex = function()
 {
	 return this.bobsContext.getHighestElementIndex( this.aoz.currentContextName );
 };
 Screen.prototype.getLowestBobIndex = function()
 {
	 return this.bobsContext.getLowestElementIndex( this.aoz.currentContextName );
 };
 Screen.prototype.bob = function( index, position, image, contextName )
 {
	contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 var bob = this.bobsContext.getElement( contextName, index );
	 if ( !bob )
	 {
		 bob = new Bob( this.aoz, this, contextName );
		 this.bobsContext.setElement( contextName, bob, index );
		 bob.set( position, image, '#update' );
		 this.aoz.renderer.addBob( bob, {} );
	 }
	 else
	 {
	 bob.set( position, image, '#update' );
	 }
	 this.setModified();
	 this.bobsToUpdate = true;
	 return bob;
 };
 Screen.prototype.bobDestroy = function( index, fromInstruction )
 {
	 var self = this;
	 if ( typeof index == 'undefined' )
	 {
		 this.bobsContext.parseAll( undefined, function( bob )
		 {
			 self.aoz.removeRootObjectFromSynchro( bob );
			 self.aoz.renderer.delBob( bob );
		 } );
		 this.bobsContext.deleteRange( this.aoz.currentContextName );
	 }
	 else
	 {
		 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index );
		 if ( bob )
		 {
		 this.aoz.removeRootObjectFromSynchro( bob );
		 this.bobsContext.deleteElement( this.aoz.currentContextName, index );
		 this.aoz.renderer.delBob( bob );
		 this.bobsToUpdate = true;
		 this.setModified();
		}
	 }
 };
 Screen.prototype.bobShadowOff = function( index, fromInstruction )
 {
	 if ( typeof index == 'undefined' )
	 {
		 this.bobsContext.parseAll( undefined, function( bob )
		 {
			// bob.setShadow({x:0,y:0});
			bob.setShadow({color:null});
		 } );
	 }
	 else
	 {
		 // this.aoz.currentScreen.bobShadow(index,{x:0,y:0});
		 this.aoz.currentScreen.bobShadow(index,{color:null});
		 this.bobsToUpdate = true;
		 this.setModified();
	 }
 };
 Screen.prototype.bobsUpdate = function( force )
 {
	 if ( force || ( this.bobsUpdateOn && this.bobsToUpdate ) )
	 {
		 this.bobsToUpdate = false;

		 var done = false;
		 for ( var bob = this.bobsContext.getFirstElement( this.aoz.currentContextName ); bob != null; bob = this.bobsContext.getNextElement( this.aoz.currentContextName ) )
			 done |= bob.update( { force: force } );
		 if ( done )
		 {
			 this.sortBobsPriority();
			 this.setModified();
		 }
	 }
 };
 Screen.prototype.updateBank = function( newBank, newBankIndex )
 {
	 var update = false;
	 this.bobsContext.parseAll( this.aoz.currentContextName, function( bob )
	 {
		 update |= bob.updateBank( newBank, newBankIndex, this.aoz.currentContextName );
	 } );
	 return update;
 };
 Screen.prototype.setBobsUpdate = function( yes_no )
 {
	 this.bobsUpdateOn = yes_no;
 };
 Screen.prototype.xBob = function( index, fromInstruction )
 {
	 return this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' ).get_x( fromInstruction );
 };
 Screen.prototype.yBob = function( index, fromInstruction )
 {
	 return this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' ).get_y( fromInstruction );
 };
 Screen.prototype.iBob = function( index, fromInstruction )
 {
	 return this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' ).get_image( fromInstruction );
 };
 Screen.prototype.isBob = function( index, fromInstruction )
 {
	 return this.bobsContext.getElement( this.aoz.currentContextName, index ) != null;
 };
 Screen.prototype.limitBob = function( index, rectangle, fromInstruction )
 {
	 if ( rectangle )
	 {
		
		if ( typeof rectangle.x1 != 'undefined' && typeof rectangle.x2 != 'undefined' )
		{
			rectangle.width = rectangle.x2 - rectangle.x1 + 1;
			rectangle.x = rectangle.x1;
		}
		else
		{
			rectangle.x1 = rectangle.x;
			rectangle.x2 = rectangle.width + rectangle.x1 - 1; 
		}
		if ( typeof rectangle.y1 != 'undefined' && typeof rectangle.y2 != 'undefined' )
		{
			rectangle.height = rectangle.y2 - rectangle.y1 + 1;
			rectangle.y = rectangle.y1;
		}
		else
		{
			rectangle.y1 = rectangle.y;
			rectangle.y2 = rectangle.height + rectangle.y1 - 1; 
		}
	 }
	 if ( typeof index != 'undefined' )
	 {
		 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
		 bob.setLimits( rectangle, fromInstruction );
		 bob.set( bob.positionDisplay, bob.imageObject.index, '#update' );
	 }
	 else
	 {
		 this.bobsContext.parseAll( this.aoz.currentContextName, function( bob )
		 {
			 if ( rectangle )
			 {
				 bob.setLimits( rectangle, fromInstruction );
				 bob.set( bob.positionDisplay, bob.imageObject.index, '#update' );
			 }
			 else
			 {
				 bob.setLimits( null, fromInstruction );
			 }
		 } );
	 }
	 this.setModified();
	 this.bobsToUpdate = true;
 };
 Screen.prototype.clipBob = function( index, args, fromInstruction )
 {
	 if ( args )
	 {
		 args.height = typeof args.height != 'undefined' ? args.height : args.width;
		 if ( typeof args.x1 != 'undefined' && typeof args.x2 != 'undefined' )
		 	{
	 		 args.width = args.x2 - args.x1 + 1;
			 args.x = args.x1;
			}
		 else
			 args.x1 = args.x;
		 if ( typeof args.y1 != 'undefined' && typeof args.y2 != 'undefined' )
			{
			 args.height = args.y2 - args.y1 + 1;
			 args.y = args.y1;
			}
		 else
			 args.y1 = args.y;
	 }
	 if ( typeof index != 'undefined' )
	 {
		 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
		 bob.setClipping( args, fromInstruction );
		 bob.set( bob.positionDisplay, bob.imageObject.index, '#update' );
	 }
	 else
	 {
		 this.bobsContext.parseAll( this.aoz.currentContextName, function( bob )
		 {
			 if ( args )
			 {
				 bob.setClipping( args, fromInstruction );
				 bob.set( bob.positionDisplay, bob.imageObject.index, '#update' );
			 }
			 else
			 {
				 bob.setClipping( null, fromInstruction );
			 }
		 } );
	 }
	 this.setModified();
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobCamera = function( index, position, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setCamera( position, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobShadow = function( index, shadow, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setShadow( shadow, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobAlpha = function( index, alpha, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setAlpha( Math.max(alpha, 0 ), fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobScale = function( index, scale, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setScale( scale, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobSkew = function( index, skew, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setSkew( skew, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobRotate = function( index, angle, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setAngle( { x:0, y: 0, z: angle }, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.bobVisible = function( index, show_hide, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 bob.setVisible( show_hide, fromInstruction );
	 this.bobsToUpdate = true;
 };
 Screen.prototype.setBobsPriority = function( on_off, fromInstruction )
 {
	 this.bobsPriorityOn = on_off;
	 this.bobsToUpdate = true;
	 this.setModified();
 };
 Screen.prototype.setBobsPriorityReverse = function( on_off, fromInstruction )
 {
	 this.bobsPriorityReverseOn  = on_off;
	 this.bobsToUpdate = true;
	 this.setModified();
 };
 Screen.prototype.sortBobsPriority = function()
 {
	 if ( this.bobsPriorityOn )
	 {
		 if ( this.bobsPriorityReverseOn )
		 {
			 this.bobsContext.sort( this.aoz.currentContextName, function( b1, b2 )
			 {
				 if ( b1.vars.y == b2.vars.y )
					 return 0;
				 return ( b1.vars.y > b2.vars.y ) ? -1 : 1;
			 } );
		 }
		 else
		 {
			 this.bobsContext.sort( this.aoz.currentContextName, function( b1, b2 )
			 {
				 if ( b1.vars.y == b2.vars.y )
					 return 0;
				 return ( b1.vars.y < b2.vars.y ) ? -1 : 1;
			 } );
		 }
	 }
 };
 Screen.prototype.putBob = function( index, fromInstruction )
 {
	 var bob = this.bobsContext.getElement( this.aoz.currentContextName, index, 'bob_not_defined' );
	 this.startDrawing();
	 if ( bob.clipping )
	 {
		 this.context.save();
		 path = new Path2D();
		 switch ( bob.clipping.style )
		{								
			case 'rectangle':										
				path.rect( bob.clipping.x1 * this.scale.x,
				bob.clipping.y1 * this.scale.y,
				bob.clipping.width * this.scale.x,
				bob.clipping.height * this.scale.y );
				break;
			case 'round':
				path.ellipse ( bob.clipping.x1 * this.scale.x,
				bob.clipping.y1 * this.scale.y,
				bob.clipping.width * this.scale.x / 2,
				bob.clipping.height * this.scale.y  / 2,
				bob.clipping.angle, 0, 2 * Math.PI );
				break;
			case 'shape':
				var a = 2 * Math.PI / bob.clipping.sides;
				var x, posX, y, posY;
				var cx = bob.clipping.x1 * this.scale.x;
				var cy = bob.clipping.y1 * this.scale.y;
				for ( var c = a; c < 2 * Math.PI + 0.01; c += a )
				{
					posX = bob.clipping.width / 2 * this.scale.x * Math.cos( c ) + cx;
					posY = bob.clipping.height / 2 * this.scale.y * Math.sin( c ) + cy;
					x = (Math.cos(bob.clipping.angle ) * (posX - cx )) - (Math.sin(bob.clipping.angle ) * (posY - cy)) + cx;
					y = (Math.sin(bob.clipping.angle  ) * (posX - cx )) + (Math.cos(bob.clipping.angle ) * (posY - cy)) + cy;									
					path.lineTo( x, y );
				}
				path.closePath();
				break;
		}			
		this.context.clip( path );
	 }
	 this.paste( 'images', bob.vars.image, { x: bob.vars.x, y: bob.vars.y, z: bob.vars.z }, { x: bob.vars.scaleX, y: bob.vars.scaleY, z: bob.vars.scaleZ }, bob.vars.angle, { x: bob.vars.skewX, y:bob.vars.skewY}, bob.vars.alpha );
	 if ( bob.clipping )
		 this.context.restore();
	 this.endDrawing();
 };

 //////////////////////////////////////////////////////////////////////
 // Windows
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.setWindow = function( number )
 {
	 if ( number < 0 )
		 throw 'illegal_text_window_parameter';
	 if ( !this.windows[ number ] )
		 throw 'text_window_not_opened';

	 if ( this.currentTextWindow.number != number )
	 {
		 this.currentTextWindow.deactivate();
		 for ( var z = 0; z < this.windowsZ.length; z++ )
		 {
			 if ( this.windowsZ[ z ].number == number )
			 {
				 this.windowsZ.splice( z, 1 );
				 break;
			 }
		 }
		 this.currentTextWindow = this.windows[ number ];
		 this.windowsZ.push( this.currentTextWindow );
		 this.currentTextWindow.activate();
	 }
 };
 Screen.prototype.windOpen = function( number, rectangle, args, tags )
 {
	 if ( number == 'default' )
		 number = 0;
	 else
	 {
		 if ( number <= 0 )
			 throw 'illegal_text_window_parameter';
	 }
	 if ( !this.aoz.unlimitedWindows && number >= 16 )
		 throw 'illegal_text_window_parameter';

	 if ( this.windows[ number ] )
		 throw 'text_window_already_opened';

	 this.startDrawing();
	 var windowDefinition = this.utilities.copyObject( this.aoz.manifest.default.screen.window );
	 if ( !rectangle )
	 {
		 windowDefinition.width = undefined;
		 rectangle = {};
	 }
	 if ( typeof rectangle.x != 'undefined' )
		 windowDefinition.x = rectangle.x;
	 if ( typeof rectangle.y != 'undefined' )
		 windowDefinition.y = rectangle.y;
	 if ( typeof rectangle.width != 'undefined' )
		 windowDefinition.width = rectangle.width;
	 if ( typeof rectangle.height != 'undefined' )
		 windowDefinition.height = rectangle.height;
	 if ( typeof args.lines != 'undefined' )
		 windowDefinition.height = args.lines;
	 if ( typeof args.border != 'undefined' )
		 windowDefinition.border = args.border;
	 if ( typeof args.windowFont != 'undefined' )
		 windowDefinition.forceFont = args.windowFont;
	 windowDefinition.noAndX = args.noAndX;

	 if ( this.currentTextWindow )
		 this.currentTextWindow.deactivate();

	 this.currentTextWindow = new TextWindow( this.aoz, this, this.contextName, windowDefinition, this.windows[ 0 ], tags );
	 this.windows[ number ] = this.currentTextWindow;
	 this.currentTextWindow.number = number;
	 this.windowsZ.push( this.currentTextWindow );
	 this.endDrawing( true );

	 return this.currentTextWindow;
 };
 Screen.prototype.windClose = function()
 {
	 if ( this.currentTextWindow == this.windows[ 0 ] )
		 throw 'text_window_0_cant_be_closed';

	 this.startDrawing();
	 this.currentTextWindow.close();
	 this.windows[ this.currentTextWindow.number ] = null;
	 this.windowsZ.pop();
	 for ( var z = 0; z < this.windowsZ.length; z++ )
		 this.windowsZ[ z ].restore();
	 this.currentTextWindow = this.windowsZ[ this.windowsZ.length - 1 ];
	 this.currentTextWindow.activate( true );
	 this.endDrawing();
 };
 Screen.prototype.restoreWindows = function()
 {
	 this.startDrawing();
	 for ( var z = 0; z < this.windowsZ.length - 1; z++ )
	 {
		 this.windowsZ[ z ].restore();
	 }
	 this.endDrawing();
 };
 Screen.prototype.setFlash = function( onOff )
 {
	 this.startDrawing();
	 for ( var z = 0; z < this.windowsZ.length; z++ )
	 {
		 this.windowsZ[ z ].setFlash( onOff );
	 }
	 this.endDrawing();
 };




 //////////////////////////////////////////////////////////////////////
 // Blocks
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.getBlock = function( number, rectangle, mask )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 rectangle.width = typeof rectangle.width == 'undefined' ? rectangle.x2 - rectangle.x + 1 : rectangle.width;
	 rectangle.height = typeof rectangle.height == 'undefined' ? rectangle.y2 - rectangle.y + 1 : rectangle.height;
	 if ( rectangle.width <= 0 || rectangle.height <= 0 )
		 throw { error: 'illegal_function_call', parameter : 'Bad Dimension' };
	 this.aoz.blocks[ number ] = this.doGetBlock( rectangle, mask );
 };
 Screen.prototype.getCBlock = function( number, rectangle, mask )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 this.aoz.cBlocks[ number ] = this.doGetBlock( rectangle, mask );
 };
 Screen.prototype.putBlock = function( number, position, bitPlanes, bitMode )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 var block = this.aoz.blocks[ number ];
	 if ( !block )
		 throw 'block_not_defined';
	 this.doPutBlock( block, position, bitPlanes, bitMode );
 };
 Screen.prototype.putCBlock = function( number, position, bitPlanes, bitMode )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 var block = this.aoz.cBlocks[ number ];
	 if ( !block )
		 throw 'block_not_defined';
	 this.doPutBlock( block, position, bitPlanes, bitMode );
 };
 Screen.prototype.delBlock = function( number )
 {
	 this.aoz.blocks = this.doDelBlock( this.aoz.blocks, number );
 };
 Screen.prototype.revBlock = function( number, hRev, vRev )
 {
	 if ( number < 0 )
		 throw { error: 'illegal_function_call', parameter: number };
	 var block = this.aoz.blocks[ number ];
	 if ( !block )
		 throw 'block_not_defined';
	 block.hRev = typeof hRev != 'undefined' ? hRev : block.hRev;
	 block.vRev = typeof vRev != 'undefined' ? vRev : block.vRev;
 };
 Screen.prototype.delCBlock = function( number )
 {
	 this.aoz.cBlocks = this.doDelBlock( this.aoz.cBlocks, number );
 };
 Screen.prototype.doGetBlock = function( rectangle, mask )
 {
	 rectangle = this.utilities.checkRectangle( rectangle, this.grPosition, this.dimension );
	 var block =
	 {
		 rectangle: rectangle,
		 alpha: 1.0,
		 canvas: document.createElement( 'canvas' ),
		 hRev: 0,
		 vRev: 0
	 }
	 block.canvas.width = rectangle.width * this.scale.x;
	 block.canvas.height = rectangle.height * this.scale.y;
	 this.currentTextWindow.cursorOff();
	 var context = block.canvas.getContext( '2d' );
	 context.drawImage( this.canvas, rectangle.x * this.scale.x, rectangle.y * this.scale.y, block.canvas.width, block.canvas.height, 0, 0, block.canvas.width, block.canvas.height );
	 this.currentTextWindow.cursorOn();

	 if ( typeof mask != 'undefined' && mask != 0 )
	 {
		 this.utilities.remapBlock( context, [ { r: 0, g: 0, b: 0, a: 255 } ], [ { r: 0, g: 0, b: 0, b: 0 } ], { x: 0, y: 0, width: block.canvas.width, height: block.canvas.height } );
	 }
	 return block;
 };
 Screen.prototype.doSetBlockAlpha = function( block, alpha )
 {
	 block.alpha = alpha / 255.0;
 };
 Screen.prototype.doPutBlock = function( block, position, bitPlanes, bitMode )
 {
	 position = this.utilities.checkRectangle( position, this.grPosition );
	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 this.context.globalAlpha = block.alpha;
	 var canvas = block.canvas;
	 if ( block.hRev || block.vRev )
		 canvas = this.aoz.utilities.flipCanvas( canvas, block.hRev, block.vRev );
	 this.context.drawImage( canvas, position.x * this.scale.x, position.y * this.scale.y );
	 this.endDrawing();
 };
 Screen.prototype.doDelBlock = function( blocks, number )
 {
	 if ( typeof number == 'undefined' )
		 return [];
	 else
	 {
		 if ( number < 0 )
			 throw { error: 'illegal_function_call', parameter: number };
		 if ( !blocks[ number ] )
			 throw 'block_not_defined';

		 var dest = [];
		 for ( var b = 0; b < blocks.length; b++ )
		 {
			 if ( b != number )
				 dest[ b ] = blocks[ b ];
		 }
		 return dest;
	 }
 };

 //////////////////////////////////////////////////////////////////////
 // Fonts
 //////////////////////////////////////////////////////////////////////
 Screen.prototype.setFont = function( args, section, callback, extra, contextName )
 {
	 var self = this;
	 this.font_loaded = false;
	 this.font_error = null;
	 var reference = args[ 0 ] ? args[ 0 ] : this.previousFont;
	 var height = typeof args[ 1 ] != 'undefined' ? args[ 1 ] : 16;
	 var weight = args[ 2 ];
	 var italic = args[ 3 ];
	 var stretch = args[ 4 ];
	 contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;
	 this.aoz.fonts.getFont( reference, height, weight, italic, stretch, '', contextName, function( response, font, extra )
	 {
		 if ( response )
		 {
			 self.font = font;
			 self.previousFont = font;
			 self.fontHeight  = height;
			 self.fontWeight = weight;
			 self.fontItalic = italic;
			 self.fontStretch = stretch;
			 if ( callback )
				 callback( true, font, extra );
		 }
		 else
		 {
			 console.warn( 'Cannot load font ' + reference , extra );
			 if ( callback )
			 	callback( true, self.font, extra );			 
			/**
			 if ( callback )
				 callback( false, 'cannot_load_font', extra );
			 else
				 self.font_error = 'cannot_load_font';
			 */
		 }
		 self.font_loaded = true;
	 }, extra );
 };
 Screen.prototype.textShadowOn = function()
 {
	 this.context.shadowOffsetX = this.textShadowX;
	 this.context.shadowOffsetY = this.textShadowY;
	 this.context.shadowBlur = this.textShadowBlur;
	 this.context.shadowColor = this.utilities.getModernRGBAString( this.textShadowColor );
 };
 Screen.prototype.setTextMode = function( mode )
 {
	 mode = typeof mode != 'undefined' ? mode.toLowerCase() : 'fill';
	 if ( mode == 'fill' || mode == 'outline' || mode == 'border' )
		 this.textMode = mode;
 };
 Screen.prototype.setFont_wait = function()
 {
	 if ( this.font_error )
		 throw this.font_error;
	 return this.font_loaded;
 };
 Screen.prototype.textLength = function( text )
 {
	 if ( this.font )
		 return this.aoz.fonts.getTextLength( text, this.font, this.fontHeight );
	 throw 'font_not_available';
 };
 Screen.prototype.textShadow = function( shadow, fromInstruction )
 {
	 if ( typeof shadow.x != 'undefined' )
	 {
		 if ( shadow.x != this.textShadowX )
			 this.textShadowX =  shadow.x;
	 }
	 if ( typeof shadow.y != 'undefined' )
	 {
		 if ( shadow.y != this.textShadowY )
			 this.textShadowY =  shadow.y;
	 }
	 if ( typeof shadow.blur != 'undefined' )
	 {
		 if ( shadow.blur != this.textShadowBlur )
			 this.textShadowBlur =  shadow.blur;
	 }
	 if ( typeof shadow.color != 'undefined' )
	 {
		 if ( shadow.color != this.textShadowColor )
			 this.textShadowColor =  shadow.color;
	 }
 };

 Screen.prototype.text = function( position, text, align, maxwidth )
 {

	 if ( text === undefined && position === undefined ) // Handle Text with no parameters (like Print) BJF
	 {
		 this.aoz.currentScreen.grPosition.y = this.aoz.currentScreen.grPosition.y + this.aoz.currentScreen.fontHeight;
		 this.aoz.currentScreen.grPosition.x = 0;
		 return;
	 }

	 if ( !this.font )
		 throw 'font_not_available';

	 position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	 text = typeof text != 'undefined' ? text : '';
	 maxwidth = typeof maxwidth != 'undefined' ? maxwidth : this.textLength( text );
	 var textAlign = "left";
	 var textBaseLine = "alphabetic";
	 var direction = "inherit";
	 if ( align )
	 {
		 var temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'left', 'center', 'centre', 'right', 'start', 'end' ] ) ) != '' )
			 textAlign = temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom' ] ) ) != '' )
			 textBaseLine = temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'ltr', 'rtl', 'inherit' ] ) ) != '' )
			 direction = temp;
	 }
	 textAlign = textAlign == 'centre' ? 'center': textAlign;
	 var x = position.x;
	 var y = position.y;
	 var width = Math.min( this.textLength( text ), maxwidth );
	 var height = this.fontHeight;
	 var baseLine = this.aoz.fonts.getBaseLine( this.font, this.fontHeight );
	 var drawWidth = width * this.scale.x;
	 var self = this;
	 switch ( textAlign )
	 {
		 case 'left':
		 case 'start':
			 break;
		 case 'center' || 'centre':
			 x -= width / 2;
			 break;
		 case 'right':
		 case 'end':
			 x -= width;
			 break;
	 }
	 switch ( textBaseLine )
	 {
		 case 'top':
		 case 'hanging':
			 break;
		 case 'middle':
			 y -= height / 2;
			 break;
		 case 'alphabetic':
		 case 'ideographic':
			 y -= baseLine;
			 break;
		 case 'bottom':
			 y -= this.fontHeight;
			 break;
	 }
	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();
	 this.context.globalCompositeOperation = this.getCompositeOperation();
	 if ( !this.onlyInk )
	 {
		 var zone = this.utilities.getZone( { x: x, y: y, width: width, height: height }, this.dimension, this.scale );
			 this.context.fillStyle = this.getColorString( this.getFillInk() );
		 this.context.globalAlpha = this.getColorAlpha( this.getFillInk() );
		 this.context.fillRect( zone.x, zone.y, zone.width, zone.height );
	 }
	 var color = this.getColorString( this.getInk() );
	 var alpha = this.getColorAlpha( this.getInk() );
	 y += this.fontHeight / 60;
	 if ( this.font.fontInformation.type == 'amiga' )
	 {
		 this.context.imageSmoothingEnabled = false;
		 // TODO: set scale X and Y
		 this.aoz.fonts.drawAmigaText( this.context, this.scale.x, x * this.scale.x, y * this.scale.y, text, this.font, this.fontHeight, 'left', 'top', direction, color, alpha )
	 }
	 else if ( this.font.fontInformation.type == 'google' )
	 {
		 this.context.textAlign = 'left';
		 this.context.textBaseline = 'top';
		 this.context.direction = direction;
		 if ( this.pattern == 1000 )
		 	this.context.fillStyle = this.gradient;
		 else if ( this.pattern != 0 )
		 	this.context.fillStyle = this.createPattern(this.pattern, this.patternScale);
		 else
		 	this.context.fillStyle = color;
		 this.context.globalAlpha = alpha;
		 this.context.filter = this.drawFilters.getFilterString();
		 this.context.font = this.utilities.getFontString( this.font.fontInformation.name, this.fontHeight * this.scale.x, this.fontWeight, this.fontItalic );
		 if( this.textMode == 'border' && this.textShadowColor )
		 {
			 this.textShadowOn();
			 drawBorder();
			 this.context.fillText( text, x * this.scale.x, y * this.scale.y, drawWidth );
			 this.noShadow();
		 }
		 else if ( this.textMode != 'border' && this.textShadowColor )
		 	  this.textShadowOn();
		 if ( this.borderFirst == true )
			 drawBorder();
		 if ( this.textMode == 'fill' || this.textMode == 'border' )
			 this.context.fillText( text, x * this.scale.x, y * this.scale.y, drawWidth );
		 if ( this.borderFirst == false && this.textMode == 'border')
		 {
			drawBorder();
		 }
		 else if ( this.textMode == 'outline' )
		 {
			 this.context.setLineDash(this.linePattern);
			 this.context.strokeStyle = color;
			 this.context.strokeText( text, x * this.scale.x, y * this.scale.y, drawWidth );
		 }
		 this.noShadow();
	 }
	 this.endDrawing();
	 this.grPosition.x = x + drawWidth;
	 this.grPosition.y = position.y;
	 function drawBorder()
	 {
		 if ( self.textMode == 'border' )
		 {
			self.context.filter = 'none';
			self.context.filter = self.borderFilters.getFilterString();
			self.context.setLineDash(self.linePattern);
			if (self.borderGradient)
				self.context.strokeStyle = self.borderGradient;
			else if (self.borderPattern)
				self.context.strokeStyle = self.createPattern(self.borderPattern, self.borderPatternScale );
			else
			{
				self.context.strokeStyle = self.getColorString(self.getBorderInk());
				self.context.globalAlpha = self.getColorAlpha(self.getBorderInk());
			}
			self.context.strokeText( text, x * self.scale.x, y * self.scale.y, drawWidth );
			self.context.filter = 'none';
			self.context.filter = self.drawFilters.getFilterString();
		}
	 };
 };

 Screen.prototype.getTextHeight = function( text, width )
 {
	 var layer = document.createElement( 'div' );
	 layer.setAttribute( 'style', 'width: ' + width + 'px;' );
	 layer.style.font =  this.context.font;
	 layer.innerHTML = text;
	 document.body.appendChild( layer );
	 var result = layer.offsetHeight;
	 document.body.removeChild( layer );
	 return result;
 }

 Screen.prototype.animateText = function( onClick, options )
 {
	 var self = this;
	 if ( this.formatTextZones )
	 {
		 options = typeof options == 'undefined' ? {} : options;
		 options.windowName = typeof options.windowName == 'undefined' ? '_blank' : options.windowName;
		 function drawZone( z, active )
		 {
			 var zone = self.formatTextZones[ z ];
			 if ( zone )
			 {
				 self.startDrawing();
				 this.context.filter = this.drawFilters.getFilterString();

				 // Clear zone background
				 self.context.fillStyle = self.getColorString( 0 );
				 self.context.globalAlpha = self.getColorAlpha( zone.alpha );
				 this.noShadow();
				 this.context.fillRect( zone.x, zone.y, zone.width, zone.height );
				 this.textShadowOn();

				 // Draw text
				 var saveInk = self.getInk();
				 var saveFont = self.font.fontInformation.name;
				 var saveFontHeight = self.fontHeight;
				 var escapeChar = String.fromCharCode( 27 );
				 var text = escapeChar + 'IN' + zone.ink + '\r' + escapeChar + 'SF' + zone.fontName + '\r' + escapeChar + 'SS' + zone.fontHeight + '\r';
				 if ( active )
					 text += escapeChar + 'UN1\r' + zone.text + escapeChar + 'UN0\r';
				 else
					 text += zone.text;
				 text += escapeChar + 'IN' + saveInk + '\r' + escapeChar + 'SF' + saveFont + '\r' + escapeChar + 'SS' + saveFontHeight + '\r';
				 self.formatText( [ text, zone.x, zone.y, 100000, 100000, '#nozones' ] );
				 self.endDrawing();
			 }
		 }
		 this.previousZone = -1;
		 this.mouseZone = -1;
		 this.previousMouse = -1;
		 if ( this.formatTextZones.length > 0 )
		 {
			 this.animTextState = 'on';
			 this.animTextHandle = setInterval( function()
			 {
				 if ( self.animTextState == 'on' )
				 {
					 var currentZone = -1;
					 var x = ( self.aoz.xMouse - self.position.x ) / self.renderScale.x / self.displayScale.x + self.offset.x;
					 var y = ( self.aoz.yMouse - self.position.y ) / self.renderScale.y / self.displayScale.y + self.offset.y;
					 for ( var z = 0; z < self.formatTextZones.length; z++ )
					 {
						 var zone = self.formatTextZones[ z ];
						 if ( x >= zone.x && x < zone.x + zone.width && y >= zone.y && y < zone.y + zone.height )
						 {
							 currentZone = z;
							 break;
						 }
					 }
					 if ( currentZone != self.previousZone )
					 {
						 if ( self.previousZone >= 0 )
						 {
							 drawZone( self.previousZone, false );
							 self.previousZone = -1;
						 }
						 if ( currentZone >= 0 )
						 {
							 drawZone( currentZone, true );
						 }
						 self.previousZone = currentZone;
					 }
					 var mouse = ( self.aoz.mouseButtons & 1 );
					 if ( mouse != self.previousMouse )
					 {
						 self.previousMouse = mouse;
						 if ( mouse )
							 self.mouseZone = currentZone;
						 else
						 {
							 if ( currentZone >= 0 && self.mouseZone == currentZone )
							 {
								 var zone = self.formatTextZones[ currentZone ];
								 if ( zone.link )
								 {
									 if ( typeof onClick == 'undefined' )
										 self.aoz.openURL( zone.link, options.windowName );
									 else
										 self.aoz.runProcedure( onClick, { LINK$: zone.link, TEXT$: zone.text } );
								 }
							 }
						 }
					 }
				 }
			 }, 20 );
		 }
	 }
 };
 Screen.prototype.stopAnimateText = function( state )
 {
	 if ( this.animTextHandle )
	 {
		 clearInterval( this.animTextHandle );
		 this.animTextHandle = undefined;
	 }
 };
 Screen.prototype.setAnimateTextState = function( state )
 {
	 this.animTextState = state;
	 if ( state == 'off' )
		 this.stopAnimateText();
 };
 Screen.prototype.formatText = function( args )
 {
	 if ( !this.font )
		 throw 'font_not_available';

	 args = args[ 0 ];
	 var text = args.text;
	 var position = { x: args.x, y: args.y };
	 var dimension = { width: args.width, height: args.height };
	 var align = args.tags;
	 var codeFont = args.codeFont;
	 var codeFontHeight = args.codeFontHeight;
	 var clipRectangle = args.clip;
	 var contextName = typeof args.contextName == 'undefined' ? 'application' : args.contextName; 
	var callback = args.callback;
	var extra = args.extra;

	 var self = this;
	 var color = this.getColorString( this.getInk() );
	 var alpha = this.getColorAlpha( this.getInk() );
	 var zoneNumber = -1;
	 var zoneX1, zoneY1;
	 var spaceWidth = self.aoz.fonts.getTextLength( " ", this.font, this.fontHeight );
	 var loadImagesList = [];
	 var imagesToLoad = 0;
	 var imagesLoaded = 0;
	 var underscore = false;
	 var listCount = 0;
	 var linkName, linkZoneX, linkZoneY;
	 var noZones = false;
	 var textFont = this.font.fontInformation.name;
	 var textFontHeight = this.fontHeight;
	 codeFont = typeof codeFont == 'undefined' ? textFont : codeFont;
	 codeFontHeight = typeof codeFontHeight == 'undefined' ? textFontHeight : codeFontHeight;
	 this.formatTextImages = {};

	 this.startDrawing();
	 this.context.filter = this.drawFilters.getFilterString();

	 // Formatting functions
	 function fillIt( text, x, y, test )
	 {
		 var width = self.aoz.fonts.getTextLength( text, self.font, self.fontHeight );
		 if ( !test )
		 {
			 if ( self.font.fontInformation.type == 'amiga' )
			 {
				 self.context.imageSmoothingEnabled = false;
				 self.aoz.fonts.drawAmigaText( self.context, self.scale.x, x, y, text, self.font, self.fontHeight, 'left', 'alphabetic', 'inherit', color, alpha )
			 }
			 else if ( self.font.fontInformation.type == 'google' )
			 {
				 self.context.fillText( text, x * self.scale.x, y * self.scale.y );
			 }
			 if ( underscore )
			 {
				 self.context.strokeStyle = self.context.fillStyle;
				 self.context.lineWidth =  ( self.scale.x + self.scale.y ) / 1.5;
				 self.context.setLineDash( self.linePattern );
				 self.context.beginPath();
				 self.context.moveTo( x * self.scale.x, ( y + self.fontHeight - 2 ) * self.scale.y );
				 self.context.lineTo( ( x + width ) * self.scale.x, ( y + self.fontHeight - 2 ) * self.scale.y );
				 self.context.stroke();
			 }
		 }
		 return x + width;
	 };
	 function pokeFont()
	 {
		 if ( self.font.fontInformation.type == 'google' )
			 self.context.font = self.utilities.getFontString( self.font.fontInformation.name, self.fontHeight * self.scale.x, self.fontWeight, self.fontItalic );
		 spaceWidth = self.aoz.fonts.getTextLength( " ", self.font, self.fontHeight );
	 }
	 function doInk( parameter, x, y, test )
	 {
		 if ( !test )
		 {
			 color = self.getColorString( parameter );
			 self.context.fillStyle = color;
		 }
	 }
	 function doAlpha( parameter, x, y, test )
	 {
		 if ( !test )
		 {
			 alpha = self.getColorAlpha( parameter );
			 self.context.globalAlpha = alpha;
		 }
	 }
	 function doItalic( parameter, x, y, test )
	 {
		 self.setFont( [ self.font, self.fontHeight, self.fontWeight, parameter ? 'italic' : 'normal' ], undefined, undefined, undefined, contextName );
		 pokeFont();
	 }
	 function doBold( parameter, x, y, test )
	 {
		 self.setFont( [ self.font, self.fontHeight, parameter ? 'bold' : 'normal', self.fontItalic ], undefined, undefined, undefined, contextName );
		 pokeFont();
	 }
	 function doSetFont( parameter, x, y, test )
	 {
		 self.setFont( [ parameter, self.fontHeight, self.fontWeight, self.fontItalic ], undefined, undefined, undefined, contextName );
		 pokeFont();
	 }
	 function doSetFontSize( parameter, x, y, test )
	 {
		 self.setFont( [ self.font, parameter, self.fontWeight, self.fontItalic ], undefined, undefined, undefined, contextName );
		 pokeFont();
	 }
	 function doZone1( parameter, x, y, test )
	 {
		 if ( !test && typeof x != 'undefined' && typeof y != 'undefined' )
		 {
			 zoneNumber = parameter;
			 zoneX1 = x;
			 zoneY1 = y;
		 }
	 }
	 function doZone2( parameter, x, y, test )
	 {
		 if ( !test && typeof x != 'undefined' && typeof y != 'undefined' )
		 {
			 if ( zoneNumber >= 0 )
			 {
				 self.setZone( zoneNumber, { x: zoneX1, y: zoneY1, width: x - zoneX1, height: self.fontHeight } );
				 zoneNumber = -1;
			 }
		 }
	 }
	 function doLink1( name, x, y, test )
	 {
		 linkName = name;
		 linkZoneX = x;
		 linkZoneY = y;
	 }
	 function doLink2( path, x, y, test )
	 {
		 var width = fillIt( linkName, x, y, test ) - x;
		 if ( !test && !noZones )
		 {
			 self.formatTextZones[ self.formatTextZonesCount++ ] =
			 {
				 link: path,
				 text: linkName,
				 x: linkZoneX,
				 y: linkZoneY,
				 width: width,
				 height: self.fontHeight,
				 ink: self.ink + 1,
				 fontHeight: self.fontHeight,
				 fontName: self.font.fontInformation.name
			 };
		 }
		 return { width: width };
	 }
	 function doImage1( name, x, y, test )
	 {
		 linkName = name;
	 }
	 function doImage2( path, x, y, test )
	 {
		 if ( !test )
		 {
			 if ( self.formatTextImages && self.formatTextImages[ path ] )
			 {
				 var image = self.formatTextImages[ path ];
				 self.pasteCanvas( image, { x: position.x, y: y, width: image.width, height: image.height } );
				 return { width: image.width, height: image.height };
			 }
			 self.context.strokeStyle = self.context.fillStyle;
			 self.context.lineWidth =  ( self.scale.x + self.scale.y ) / 1.5;
			 self.context.strokeRect( x, y, 128, 128 );
		 }
		 return { width: 128, height: 128 };
	 }
	 function doUnderscore( parameter, x, y, test )
	 {
		 underscore = parameter;
	 }
	 function doLine( parameter, x, y, test )
	 {
		 if ( !test )
		 {
			 self.context.strokeStyle = self.context.fillStyle;
			 self.context.lineWidth =  ( self.scale.x + self.scale.y ) / 1.5;
			 self.context.setLineDash( self.linePattern );

			 self.context.beginPath();
			 self.context.moveTo( 0, ( y + self.fontHeight / 2 ) * self.scale.y );
			 self.context.lineTo( dimension.width * self.scale.x, ( y + self.fontHeight / 2 ) * self.scale.y );
			 self.context.stroke();
		 }
		 return { width: dimension.width, height: self.fontHeight };
	 }
	 function spaceY( parameter, x, y, test )
	 {
		 return { width: 0, height: self.fontHeight };
	 }
	 function doBullet( parameter, x, y, test )
	 {
		 var paint = self.paint;
		 self.paint = true;
		 var ray = self.fontHeight / 6;
		 if ( !test )
			 self.ellipse( { x: position.x + 16, y: y + self.fontHeight / 2 , width: ray, height: ray } );
		 self.paint = paint;
		 return { width: 32, height: 0 };
	 }
	 function doList( parameter, x, y, test )
	 {
		 if ( parameter == 1 )
			 self.listCount = 1;
		 var width = fillIt( self.listCount++ + '.', x, y, test );
		 return { width: width, height: 0 };
	 }
	 var jumpTable =
	 {
		 'IN': doInk,
		 'IT': doItalic,
		 'BO': doBold,
		 'SF': doSetFont,
		 'SS': doSetFontSize,
		 'SA': doAlpha,
		 'Z1': doZone1,
		 'Z2': doZone2,
		 'I1': doImage1,
		 'I2': doImage2,
		 'K1': doLink1,
		 'K2': doLink2,
		 'BU': doBullet,
		 'LN': doLine,
		 'LI': doList,
		 'UN': doUnderscore,
		 'SY': spaceY,
	 };

	 position.x = typeof position.x != 'undefined' ? position.x : this.grPosition.x;
	 position.y = typeof position.y != 'undefined' ? position.y : this.grPosition.y;
	 if ( dimension.width <= 0 || dimension.height <= 0 )
		 throw { error: 'illegal_function_call', parameters: [ dimension.width, dimension.height ]  };

	 var textAlign = "left";
	 var textBaseLine = "alphabetic";
	 var direction = "inherit";
	 var interline = 0;//this.fontHeight / 4;
	 var isHTML = false;
	 var isMD = false;
	 var animate = false;
	 var resetAnimate = false;
	 var waiting = false;
	 if ( align )
	 {
		 var temp;
		 if ( this.utilities.isTag( align, 'waiting' ) )
			 waiting = true;
		 if ( ( temp = this.utilities.getTag( align, [ 'left', 'center', 'right', 'start', 'end' ] ) ) != '' )
			 textAlign = temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom' ] ) ) != '' )
			 textBaseLine = temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'ltr', 'rtl', 'inherit' ] ) ) != '' )
			 direction = temp;
		 if ( ( temp = this.utilities.getTag( align, [ 'html' ] ) ) != '' )
			 isHTML = true;
		 if ( ( temp = this.utilities.getTag( align, [ 'md' ] ) ) != '' )
			 isMD = true;
		 if ( ( temp = this.utilities.getTag( align, [ 'nozones' ] ) ) != '' )
			 noZones = true;
		 if ( ( temp = this.utilities.getTag( align, [ 'animate' ] ) ) != '' )
			 animate = true;
		 if ( ( temp = this.utilities.getTag( align, [ 'resetanimate' ] ) ) != '' )
			 resetAnimate = true;
		 if ( this.utilities.isTag( align, [ 'interline' ] ) )
		 {
			 interline = this.utilities.getTagParameter( align, 'interline' );
		 }
	 }
	 if ( animate || resetAnimate )
	 {
		 if ( !this.formatTextZones || resetAnimate )
		 {
			 this.formatTextZones = [];
			 this.formatTextZonesCount = 0;
		 }
	 }

	 // Cut in lines
	 var lines;
	 if ( isMD )
		 lines = convertMD( text );
	 else if ( isHTML )
		 lines = convertHTML( text );
	 else
	 {
		 lines = [];

		 var currentPosition = 0;
		 var cr = text.indexOf( '\n' );
		 while( cr >= 0 )
		 {
			 var line = text.substring( currentPosition, cr );
			 currentPosition = cr + 1;
			 if ( text.charAt( currentPosition ) == '\r' )
				 currentPosition++;							// We never know! :)
			 lines.push( line );
			 cr = text.indexOf( '\n', currentPosition );
		 }
		 if ( currentPosition < text.length )
			 lines.push( text.substring( currentPosition ) );
	 }

	 // Load eventual images
	 this.formatTextDone = false;
	 if ( loadImagesList.length )
	 {
		this.endDrawing();
		if ( waiting )
		{
			this.aoz.currentSection.waitThis = self;
			this.aoz.currentSection.waiting = self.formatTextWait;
		}
		 for ( var i = 0; i < loadImagesList.length; i++ )
		 {
			 var path = loadImagesList[ i ];
			 if ( self.formatTextImages && self.formatTextImages[ path ] )
				 continue;

			 imagesToLoad++;
			 var descriptor = self.aoz.filesystem.getFile( path );
			 self.aoz.filesystem.loadFile( descriptor, { responseType: 'binary' }, function( response, arrayBuffer, extra )
			 {
				 if ( response )
				 {
					 var blob = new Blob( [ arrayBuffer ], { type: 'image/png' } );
					 var urlCreator = window.URL || window.webkitURL;
					 var imageUrl = urlCreator.createObjectURL( blob );
					 var image = new Image();
					 image.onload = function()
					 {
						 self.formatTextImages[ extra ] = this;
						 imagesLoaded++;
						 if ( imagesLoaded == imagesToLoad )
						 {
							self.startDrawing()
							 var height = displayLines();
							 self.endDrawing();
							 self.formatTextDone = true;
							 self.formatTextResult = height;
							if ( callback )
								callback( true, height, extra );
						 }
					 }
					 image.src = imageUrl;
				 }
			 }, path );
		 }
		 return 0;
	 }
	 else
	 {
		height = displayLines();
			 this.formatTextResult = height;
			 this.formatTextDone = true;
		if ( callback )
			callback( true, height, extra );
	 }
	 return height;

	 // Display each lines...
	 function displayLines()
	 {
		 var height = 0;
		 for ( var l = 0; l < lines.length; l++ )
			 height += format( lines[ l ], position.x, position.y + height, dimension.width, dimension.height, textAlign, textBaseLine );
		 return height;
	 }
	 function format( text, x, y, w, h, align, baseLine )
	 {
		 spl = interline;
		 align = typeof align == 'undefined' ? 'left' : align;
		 baseLine = typeof baseLine == 'undefined' ? 'left' : baseLine;

		 var split_lines = function( mw, text )
		 {
			 var words = [];
			 var escape = text.indexOf( String.fromCharCode( 27 ) );
			 while ( escape >= 0 )
			 {
				 if ( escape > 0 )
				 {
					 words = words.concat( text.substring( 0, escape ).split( ' ' ) );
					 text = text.substring( escape );
				 }
				 var cr = text.indexOf( String.fromCharCode( 13 ) );
				 words.push( text.substring( 0, cr + 1 ) );
				 text = text.substring( cr + 1 );
				 escape = text.indexOf( String.fromCharCode( 27 ) );
			 }
			 if ( text.length > 0 )
				 words = words.concat( text.split(' ') );

			 var new_line = '';
			 var lines = [];
			 var width = 0;
			 for ( var i = 0; i < words.length; ++i )
			 {
				 var word = words[ i ];

				 var position = 0;
				 while( position < word.length )
				 {
					 var cCode = word.charCodeAt( position++ );
					 if ( cCode == 27 )
					 {
						 var func = jumpTable[ word.substr( position, 2 ) ];
						 if ( func )
						 {
							 var end = word.indexOf( '\r', position );
							 if ( end >= 0 )
							 {
								 position--;
								 word = word.substring( 0, position ) + word.substring( end + 1 );
							 }
						 }
					 }
				 }
				 var wordWidth = self.aoz.fonts.getTextLength( word, self.font, self.fontHeight );
				 width += wordWidth + spaceWidth;

				 if ( width < mw + spaceWidth && words[ i ] != '<br>' )
				 {
					 new_line += words[ i ] + " ";
				 }
				 else
				 {
					 lines.push( new_line );
					 if( words[ i ] != '<br>' )
					 {
						 new_line = words[ i ] + " ";
					 }
					 else
					 {
						 new_line = "";
					 }
					 width = wordWidth + spaceWidth;
				 }
			 }
			 lines.push( new_line );
			 return lines;
		 }

		 var ly = y;
		 var lyStart = ly;
		 var lines = split_lines( w, text );
		 var both = lines.length * ( self.fontHeight + spl );
		 if ( typeof dimension.height != 'undefined' )
		 {
			 self.context.textAlign = 'left';
			 self.context.textBaseline = 'top';
			 self.context.direction = 'inherit';
			 self.context.fillStyle = color;
			 self.context.globalAlpha = alpha;
			 self.context.font = self.utilities.getFontString( self.font.fontInformation.name, self.fontHeight * self.scale.x, self.fontWeight, self.fontItalic );

			 // Clip context
			 var clipPath;
			 if ( clipRectangle )
			 {
				 self.context.save();
				 clipPath = new Path2D();
				 clipPath.rect( clipRectangle.x, clipRectangle.y, clipRectangle.width, clipRectangle.height );
				 self.context.clip( clipPath );
			 }
			 else if ( both > h )
			 {
				 self.context.save();
				 clipPath = new Path2D();
				 clipPath.rect( x, y, w, h );
				 self.context.clip( clipPath );
			 }

			 if ( baseLine == 'middle' )
				 ly = ( h - both ) / 2 + y + spl*lines.length;
			 if ( baseLine == 'bottom' )
				 ly = y + h - both;
			 if ( align == 'center' )
			 {
				 for ( var j = 0; j < lines.length; j++ )
				 {
					 var lx = x + w / 2 - textWidth( lines[ j ] ) / 2;
					 ly += fillText( lines[ j ], lx, ly );
				 }
			 }
			 else if ( align == 'right' )
			 {
				 for ( var j = 0; j < lines.length; j++ )
				 {
					 var lx = x + w - textWidth( lines[ j ] );
					 ly += fillText( lines[ j ], lx, ly );
				 }
			 }
			 else	// left
			 {
				 for ( var j = 0; j < lines.length; j++ )
				 {
					 ly += fillText( lines[ j ], x, ly );
				 }
			 }

			 // Restore clipping
			 if ( clipPath )
				 self.context.restore();

			 return ly - lyStart;
		 }
		 return both;

		 function textWidth( text )
		 {
			 var position = 0;
			 var line = '';
			 var width = 0;
			 while( position < text.length )
			 {
				 var c = text.charAt( position );
				 var cCode = text.charCodeAt( position++ );
				 if ( cCode >= 32 )
					 line += c;
				 else if ( cCode == 27 )
				 {
					 var func = jumpTable[ text.substr( position, 2 ) ];
					 if ( func )
					 {
						 var end = text.indexOf( '\r', position );
						 if ( end >= 0 )
						 {
							 var parameter;
							 if ( end > position + 2 )
							 {
								 parameter = parseInt( text.substring( position + 2, end ) );
								 if ( isNaN( parameter ) )
								 {
									 parameter = text.substring( position + 2, end );
								 }
							 }
							 position = end + 1;
							 if ( line != '' )
							 {
								 width += fillIt( line, 0, 0, true );
								 line = '';
							 }
							 var info = func( parameter, x, y, true );
							 if ( info )
							 {
								 if ( info.width )
									 width += info.width;
							 }
							 continue;
						 }
					 }
				 }
			 }
			 if ( line != '' )
				 width += fillIt( line, 0, 0, true );
			 return width;
		 };
		 function fillText( text, x, y )
		 {
			 var yStart = y;
			 var position = 0;
			 var line = '';
			 while( position < text.length )
			 {
				 var c = text.charAt( position );
				 var cCode = text.charCodeAt( position++ );
				 if ( cCode >= 32 )
					 line += c;
				 else if ( cCode == 27 )
				 {
					 var func = jumpTable[ text.substr( position, 2 ) ];
					 if ( func )
					 {
						 var end = text.indexOf( '\r', position );
						 if ( end >= 0 )
						 {
							 var parameter;
							 if ( end > position + 2 )
							 {
								 parameter = parseInt( text.substring( position + 2, end ) );
								 if ( isNaN( parameter ) )
								 {
									 parameter = text.substring( position + 2, end );
								 }
							 }
							 position = end + 1;
							 if ( line != '' )
							 {
								 x = fillIt( line, x, y );
								 line = '';
							 }
							 var info = func( parameter, x, y );
							 if ( info )
							 {
								 if ( info.width )
									 x += info.width;
								 if ( info.height )
									 y += info.height;
							 }
 							 if ( text.charAt( position ) == ' ' )
								position++;
							 continue;
						 }
					 }
				 }
			 }
			 if ( line != '' )
			 {
				 fillIt( line, x, y );
				 return y + self.fontHeight + spl - yStart;
			 }
			 return y - yStart;
		 }
	 }
	 function convertHTML( text )
	 {
		 return text;
	 }
	 function convertMD( text )
	 {
		 var lines = [];
		 var headerZoom = 3;
		 var isBold = false;
		 var isItalic = false;
		 var lineStart = 0;
		 var endOfLine = undefined;
		 var escapeChar = String.fromCharCode( 27 );
		 var codeMode = false;
		 var previousCode = 0;

		 while ( true )
		 {
			 var result = '';
			 var position = 0;
			 var quit = false;
			 var lf = text.indexOf( '\n', lineStart + position );
			 while( lineStart + position < text.length && !quit )
			 {
				 var c = text.charAt( lineStart + position );
				 var cCode = text.charCodeAt( lineStart + position );
				 if ( codeMode )
				 {
					 switch ( cCode )
					 {
						 case 39:		// "'"
							 var start = position;
							 while( lineStart + position < text.length && text.charAt( lineStart + position ) == "'" )
								 position++;
							 if ( position - start >= 3 )
							 {
								 codeMode = false;
								 result += escapeChar + 'SF' + textFont + '\r' + escapeChar + 'SS'+ + textFontHeight + '\r';
								 quit = true;
							 }
							 break;
						 case 9:
							 for ( var t = 0; t < 4; t++ )
								 result += String.fromCharCode( 160 );
							 break;
						 case 32:
							 result += String.fromCharCode( 160 );
							 break;
						 case 13:
							 break;
						 case 10:
							 quit = true;
							 break;
						 default:
							 result += c;
							 break;
					 }
				 }
				 else
				 {
					 switch ( cCode )
					 {
						 case 35: 			// '#'
							 if ( position == 0 )
							 {
								 while( text.charAt( lineStart + position ) == '#' )
									 position++;
								 var n = 7 - position;
								 result += escapeChar + 'SY' + self.fontHeight * ( n * headerZoom / 6 ) + '\r'
								 result += escapeChar + 'SS' + self.fontHeight * ( n * headerZoom / 6 ) + '\r' + escapeChar + 'BO1\r';
								 endOfLine = escapeChar + 'SY' + self.fontHeight * ( n * headerZoom / 6 ) + '\r';
								 endOfLine += escapeChar + 'SS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
								 while( text.charAt( lineStart + position ) == ' ' )
									 position++;
								 continue;
							 }
							 result += c;
							 break;
						 case 60: 			// '<':
							 var pos = text.indexOf( '<br>', lineStart );
							 if ( pos < 0 )
								 pos = text.indexOf( '<BR>', lineStart );
							 if ( lf < 0 || ( lf > 0 && pos < lf ) )
							 {
								 quit = true;
								 break;
							 }
							 result += c;
							 break;
						 case 64:			// '=':
						 case 45:			// '-':
						 case 150:			// '–':
						 case 43:			// '+':
						 case 42: 			// '*':
							 // List?
							 if ( position == 0 && lineStart + 1 < text.length && text.charAt( lineStart + 1 ) == ' ' )
							 {
								 if ( endOfLine )
									 result += endOfLine;
								 endOfLine = undefined;
								 lines.push( result );
								 result = escapeChar + 'SY' + self.fontHeight / 2 + '\r' + escapeChar + 'BU\r';
								 position++;
								 break;
							 }
							 else if ( cCode == 64 || cCode == 45 )
							 {
								 var start = position;
								 while( text.charCodeAt( lineStart + position ) == cCode )
									 position++;
								 if ( cCode == 45 && position - start >= 3 )
								 {
									 result += escapeChar + 'LN\r';
									 quit = true;
									 break;
								 }
								 break;
							 }
							 result = c;
							 break;
						 case 95: 			// '_':
							 var n = 0;
							 while( position + n < text.length && text.charCodeAt( lineStart + position + n ) == cCode )
								 n++;
							 if ( n == 1 || n == 3 )
							 {
								 isItalic = !isItalic;
								 result += escapeChar + 'IT' + ( isItalic ? '1' : '0' ) + '\r';
								 position += n - 1;
								 break;
							 }
							 if ( n == 2 || n == 3 )
							 {
								 isBold = !isBold;
								 result += escapeChar + 'BO' + ( isBold ? '1' : '0' ) + '\r';
								 position += n - 1;
								 break;
							 }
							 result += c;
							 break;
						 case 49:
							 if ( position == 0 && lineStart + 1 < text.length && text.charAt( lineStart + 1 ) == '.' )
								 listCount = 1;
						 case 48:
						 case 50:
						 case 51:
						 case 52:
						 case 53:
						 case 54:
						 case 55:
						 case 56:
						 case 57:
							 if ( position == 0 && lineStart + 1 < text.length && text.charAt( position + 1 ) == '.' )
							 {
								 result += escapeChar + 'LI' + listCount + '\r';
								 listCount++;
								 break;
							 }
							 result += c;
							 break;
						 case 39:		// "'"
							 if ( position == 0 )
							 {
								 var start = position;
								 while( lineStart + position < text.length && text.charAt( lineStart + position ) == "'" )
									 position++;
								 if ( position - start >= 3 )
								 {
									 codeMode = true;
									 result += escapeChar + 'SY\r' + escapeChar + 'SF' + codeFont + '\r' + escapeChar + 'SS'+ + codeFontHeight + '\r';
									 if ( endOfLine )
										 result += endOfLine;
									 endOfLine = undefined;
									 lines.push( result );
									 result = '';
									 quit = true;
									 break;
								 }
							 }
							 result += "'";
							 break;
						 case 33:		// '!'
							 if( text.indexOf( '[', lineStart + position ) == lineStart + position + 1 )
							 {
								 var end = text.indexOf( ']', lineStart + position )
								 if ( lf < 0 || ( lf > 0 && end < lf ) )
								 {
									 var r = escapeChar + 'I1' + text.substring( lineStart + position + 2, end ) + '\r';
									 position = end - lineStart;
									 var link = '';
									 if ( text.charAt( lineStart + position + 1 ) == '(' )
									 {
										 end = text.indexOf( ')', lineStart + position );
										 if ( lf < 0 || ( lf > 0 && end < lf ) )
										 {
											 link = text.substring( lineStart + position + 2, end ).trim();
											 loadImagesList.push( link );
											 position = end - lineStart;
										 }
									 }
									 r += escapeChar + 'I2' + link + '\r';
									 if ( endOfLine )
										 result += endOfLine;
									 endOfLine = undefined;
									 if ( result.length )
										 lines.push( result );
									 result = r;
									 quit = true;
									 break;
								 }
							 }
							 result += c;
							 break;
						 case 91:		// '['
							 var end = text.indexOf( ']', lineStart + position )
							 if ( lf < 0 || ( lf > 0 && end < lf ) )
							 {
								 var tempResult = escapeChar + 'K1' + text.substring( lineStart + position + 1, end ) + '\r';
								 var tempPosition = end - lineStart;
								 if( text.indexOf( '(', lineStart + tempPosition ) == lineStart + tempPosition + 1 )
							 {
								 var link = '';
									 end = text.indexOf( ')', lineStart + tempPosition );
									 if ( lf < 0 || ( lf > 0 && end < lf ) )
									 {
										 link = text.substring( lineStart + position + 2, end ).trim();
										 position = end - lineStart;
									 }
									 result += tempResult + escapeChar + 'K2' + link + '\r';
									 break;
								 }
							 }
							 result += c;
							 break;
						 case 10:
							 if ( position == 0 || ( position == 1 && previousCode == 13 ) )
							 {
								 result += escapeChar + 'SY\r'
								 quit = true;
							 }
							 else
							 {
								 lineStart += position + 1;
								 lf = text.indexOf( '\n', lineStart );
								 position = -1;
							 }
							 break;
						 case 13:
							 break;
						 default:
							 if ( position == 0 )
							 {
								 if ( lf >= 0 && text.indexOf( '==', lf ) == lf + 1 )
								 {
									 result += escapeChar + 'FS' + self.fontHeight * headerZoom + '\r' + escapeChar + 'BO1\r';
									 endOfLine = escapeChar + 'FS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
								 }
								 if ( lf >= 0 && text.indexOf( '--', lf ) == lf + 1 )
								 {
									 result += escapeChar + 'FS' + self.fontHeight * headerZoom * ( 5 / 6 ) + '\r' + escapeChar + 'BO1\r';
									 endOfLine = escapeChar + 'FS' + self.fontHeight + '\r' + escapeChar + 'BO0\r';
								 }
							 }
							 result += c;
							 break;
					 }
					 previousCode = cCode;
				 }
				 position++;
			 }
			 if ( endOfLine )
				 result += endOfLine;
			 lines.push( result );

			 if ( lf < 0 )
				 break;
			 lineStart = lf + 1;
		 }
		 return lines;
	 }
 }
 Screen.prototype.formatTextWait = function()
 {
	 return this.formatTextDone;
 };

 Screen.prototype.textBase = function()
 {
	 return this.aoz.fonts.getBaseLine( this.font, this.fontHeight );
 };

 // EMPTY SCREEN TO CATCH ALL ERRORS
 function ScreenEmpty()
 {
	 this.emptyScreen = true;
	 for ( var s in Screen.prototype )
	 {
		 this[ s ] = function()
		 {
			 throw 'screen_not_opened';
		 };
	 }
	 this.deactivate = function() {};
 };


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

