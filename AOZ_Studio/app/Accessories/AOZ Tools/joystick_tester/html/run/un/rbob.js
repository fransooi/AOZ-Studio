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
 * AOZ - Bob Class
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 10/11/2019
 */

function Bob( aoz, parent, contextName )
{
	this.aoz = aoz;
	this.banks = aoz.banks;
	this.screen = parent;
	this.tags = tags;
	this.className = 'bob';
	this.contextName = typeof contextName == 'undefined' ? this.aoz.currentContextName : contextName;

	this.vars =
	{
		x: 0,
		y: 0,
		z: 0,
		width: 0,
		height: 0,
		depth: 0,
		scaleX: 1,
		scaleY: 1,
		scaleZ: 1,
		skewX: 0,
		skewY: 0,
		skewZ: 0,
		angle: 0,
		image: 0,
		alpha: 1.0,
		visible: true,
		enable: true,
		modified: 0,
		cameraX: 0,
		cameraY: 0,
		cameraZ: 0,
		shadowX: 0,
		shadowY: 0,
		shadowBlur: 0,
		shadowColor: null,
		hRev: false,
		vRev: false,
		actorParams: undefined,
		filters: new this.aoz.utilities.DrawFilters( this.aoz, this )
	};
	this.varsUpdated = this.aoz.utilities.copyObject( this.vars, false );

	this.positionDisplay = {};
	this.dimensionDisplay = {};
	this.scaleDisplay = {};
	this.skewDisplay = {};
	this.angleDisplay = {};
	this.bankIndex = undefined;
	this.bankReserveNumber = -1;
	this.clipping = null;
	this.limits = null;
	this.modifiedCollisions = -1;
	this.collisions =
	{
		rectangle: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 },
		rectangleClamp: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 }
	};
	this.aoz.turnIntoObject( this, {}, {},
	{
		setSize: this.setSize,
		setImage: this.setImage,
		setPosition: this.setPosition
	} );
}
Bob.prototype.get_this = function( index, mode )
{
	mode = ( typeof mode == 'undefined' ? '' : mode );
	var self = this.aoz.currentScreen.getBob( index, undefined, this.aoz.currentContextName );
	if ( self )
	{
		switch ( mode )
		{
			case "size":
				return {
					self: self,
					get_x: self.get_width,
					get_y: self.get_height,
					set_x: self.set_width,
					set_y: self.set_height,
					get_image: self.get_image,
					set_image: self.set_image
				};
			case "scale":
				return {
					self: self,
					get_x: function ( fromInstruction ) { var v = this.get_scaleX( fromInstruction ); return ( typeof v == 'undefined' ? v : v * 100 ); },
					get_y: function ( fromInstruction ) { var v = this.get_scaleY( fromInstruction ); return ( typeof v == 'undefined' ? v : v * 100 ); },
					set_x: function ( value, fromInstruction ) { this.set_scaleX( value / 100, fromInstruction ); },
					set_y: function ( value, fromInstruction ) { this.set_scaleY( value / 100, fromInstruction ); },
					get_image: self.get_image,
					set_image: self.set_image
				};
			case "skew":
				return {
					self: self,
					get_x: self.get_skewX,
					get_y: self.get_skewY,
					set_x: self.set_skewX,
					set_y: self.set_skewY,
					get_image: self.get_image,
					set_image: self.set_image
				};
			case "shadow":
				return {
					self: self,
					get_x: self.get_shadowX,
					get_y: self.get_shadowY,
					set_x: self.set_shadowX,
					set_y: self.set_shadowY,
					get_image: self.get_image,
					set_image: self.set_image
				};
			case "camera":
				return {
					self: self,
					get_x: self.get_cameraX,
					get_y: self.get_cameraY,
					set_x: self.set_cameraX,
					set_y: self.set_cameraY,
					get_image: self.get_image,
					set_image: self.set_image
				};
			default:
				return {
					self: self,
					get_x: self.get_x,
					get_y: self.get_y,
					set_x: self.set_x,
					set_y: self.set_y,
					get_image: self.get_image,
					set_image: self.set_image
				};
		}
	}
	return undefined;
}
Bob.prototype.setImage = function(  image, fromInstruction )
{
	if ( image != this.vars.image )
	{
		if ( typeof image == 'number' )
		{
			this.vars.hRev = ( image & AOZ.HREV ) != 0;
			this.vars.vRev = ( image & AOZ.VREV ) != 0;
			image &= ~( AOZ.HREV | AOZ.VREV );
		}
		else
		{
			this.vars.hRev = false;
			this.vars.vRev = false;
		}
		this.bank = this.aoz.banks.getBank( this.bankIndex, this.contextName, 'images' );
		this.bankIndex = this.bank.index;
		this.bankReserveNumber = this.bank.reserveNumber;
		this.imageObject = this.bank.getElement( image );
		this.aoz.setImage.call( this, image, fromInstruction );
		this.aoz.setSize.call( this, { width: this.imageObject.width, height: this.imageObject.height }, fromInstruction );
		this.setModified();
	}
};
Bob.prototype.setSize = function( dimension, fromInstruction )
{
	if ( typeof dimension.width != 'undefined' )
		dimension.width *= this.vars.scaleX;
	if ( typeof dimension.height != 'undefined' )
		dimension.height *= this.vars.scaleY;
	if ( typeof dimension.depth != 'undefined' )
		dimension.depth *= this.vars.scaleZ;
	this.aoz.setSize.call( this, dimension, fromInstruction );
};
Bob.prototype.set = function( position, image, fromInstruction )
{
	if ( typeof image != 'undefined' )
		this.setImage( image, fromInstruction );
	this.setPosition( position, fromInstruction );
};
Bob.prototype.setPosition = function( position, fromInstruction )
{
	if ( this.limits )
	{
		if ( typeof position.x != 'undefined' && typeof this.limits.width != 'undefined' )
		{
			if ( this.imageObject )
				position.x = Math.max( this.limits.x1 + ( this.imageObject.hotSpotX * this.vars.scaleX ), Math.min( position.x, this.limits.x2 - ( this.vars.width - this.imageObject.hotSpotX ) * this.vars.scaleX ) );
			else
				position.x = Math.max( this.limits.x1, Math.min( position.x, this.limits.x2 ) );
		}
		if ( typeof position.y != 'undefined' && typeof this.limits.height != 'undefined' )
		{
			if ( this.imageObject )
				position.y = Math.max( this.limits.y1 + ( this.imageObject.hotSpotY * this.vars.scaleY ), Math.min( position.y, this.limits.y2 - ( this.vars.height - this.imageObject.hotSpotY ) * this.vars.scaleY ) );
			else
				position.y = Math.max( this.limits.y1, Math.min( position.y, this.limits.y2 ) );
		}
	}
	this.aoz.setPosition.call( this, position, fromInstruction );
};
Bob.prototype.setModified = function()
{
	this.vars.modified++;
	this.modifiedCollisions = -1;
	this.screen.setModified();
};
Bob.prototype.updateBank = function( newBank, newBankIndex, contextName )
{
	if ( this.bankIndex == newBankIndex )
	{
		if ( newBank )
		{
			if ( this.bankReserveNumber != newBank.reserveNumber )
			{
				this.bank = newBank;
				this.bankReserveNumber = newBank.reserveNumber;
				this.imageObject = newBank.getElement( this.vars.image );
				if ( !this.imageObject )
					this.destroy();
				else
					this.setSize( { width: this.imageObject.width, height: this.imageObject.height } );
			}
		}
		else
		{
			this.destroy();
		}
	}
	return true;
};
Bob.prototype.destroy = function( options )
{
	this.screen.destroyBob( this.index );
};
Bob.prototype.update = function( options )
{
	if ( this.vars.modified || options.force )
	{
		this.vars.modified = 0;
		if ( this.imageObject )
		{
			this.positionDisplay.x = this.vars.x - this.vars.cameraX;
			this.positionDisplay.y = this.vars.y - this.vars.cameraY;
			this.dimensionDisplay.width = this.vars.width;
			this.dimensionDisplay.height = this.vars.height;
			this.scaleDisplay.x = this.vars.scaleX;
			this.scaleDisplay.y = this.vars.scaleY;
			this.skewDisplay.x = this.vars.skewX;
			this.skewDisplay.y = this.vars.skewY;
			this.angleDisplay.z = this.vars.angle;
			this.canvas = this.imageObject.getCanvas( this.vars.hRev, this.vars.vRev );
			this.hotSpot = this.imageObject.getHotSpot( this.vars.hRev, this.vars.vRev );
		}
		return true;
	}
	return false;
};
Bob.prototype.setClipping = function( rectangle, options )
{
	if ( rectangle )
	{
		rectangle.sides = rectangle.sides >= 3 || rectangle.sides != 'undefined' ? rectangle.sides : 4;
		rectangle.style = rectangle.style != 'undefined' ? rectangle.style : 'rectangle';
		rectangle.angle = rectangle.angle != 'undefined' ? rectangle.angle : 0;
		if ( this.aoz.platform == 'amiga' && typeof rectangle.width != 'undefined' )
			rectangle.width &= 0xFFFFFFF0;
		this.clipping = rectangle;
	}
	else
	{
		this.clipping = null;
	}
	this.setModified();
};
Bob.prototype.setLimits = function( rectangle, options )
{
	if ( rectangle )
	{
		if ( this.aoz.platform == 'amiga' && typeof rectangle.width != 'undefined' )
			rectangle.width &= 0xFFFFFFF0;
		this.limits = rectangle;
	}
	else
	{
		this.limits = null;
	}
	this.setModified();
};
Bob.prototype.updateCollisionData = function( active )
{
	if ( this.vars.modified != this.modifiedCollisions )
	{
		this.modifiedCollisions = this.modified;
		var collisions = this.collisions;
		if ( this.imageObject )
		{
			if ( active )
				collisions.active = true;
			collisions.renderScaleX = this.screen.renderScale.x;
			collisions.renderScaleY = this.screen.renderScale.y;
			collisions.scaleX = Math.abs( this.vars.scaleX );
			collisions.scaleY = Math.abs( this.vars.scaleY );
			collisions.angle = this.vars.angle;
			collisions.width = this.imageObject.width * collisions.scaleX;
			collisions.height = this.imageObject.height * collisions.scaleY;
			collisions.method = this.aoz.manifest.collisions.method;
			collisions.precision = this.aoz.manifest.collisions.precision;
			if ( this.vars.scaleX > 0 )
				collisions.hotSpotX = this.imageObject.hotSpotX * collisions.scaleX;
			else
				collisions.hotSpotX = collisions.width - this.imageObject.hotSpotX * collisions.scaleX;
			if ( this.vars.scaleY > 0 )
				collisions.hotSpotY = this.imageObject.hotSpotY * collisions.scaleY;
			else
				collisions.hotSpotY = collisions.height - this.imageObject.hotSpotY * collisions.scaleY;
			if ( collisions.angle )
			{
				var rotation = this.aoz.utilities.rotate( collisions.hotSpotX, collisions.hotSpotY, 0, 0, collisions.angle );
				collisions.hotSpotX = rotation.x;
				collisions.hotSpotY = rotation.y;
			}

			if ( this.screen.vars.angle == 0 )
			{
				collisions.xCoord = ( this.screen.vars.x - this.screen.vars.hotspotX - this.aoz.renderingContext.hardLeftX ) + ( this.vars.x - this.screen.vars.offsetX ) * collisions.renderScaleX;
				collisions.yCoord = ( this.screen.vars.y - this.screen.vars.hotspotY - this.aoz.renderingContext.hardTopY ) + ( this.vars.y - this.screen.vars.offsetY ) * collisions.renderScaleY;
				collisions.x = collisions.xCoord - collisions.hotSpotX;
				collisions.y = collisions.yCoord - collisions.hotSpotY;
			}
			else
			{
				var xScreen = this.screen.vars.x - this.screen.vars.hotspotX - this.aoz.renderingContext.hardLeftX;
				var yScreen = this.screen.vars.y - this.screen.vars.hotspotY - this.aoz.renderingContext.hardTopY;
				var rotated = this.aoz.utilities.rotate( ( this.vars.x - this.screen.vars.offsetX - collisions.hotSpotX ) * collisions.renderScaleX, ( this.vars.y - this.screen.vars.offsetY - collisions.hotSpotY ) * collisions.renderScaleY, this.screen.vars.hotspotX, this.screen.vars.hotspotY, this.screen.vars.angle );
				collisions.x = rotated.x + xScreen;
				collisions.y = rotated.y + yScreen;
				rotated = this.aoz.utilities.rotate( ( this.vars.x - this.screen.vars.offsetX ) * collisions.renderScaleX, ( this.vars.y - this.screen.vars.offsetY ) * collisions.renderScaleY, this.screen.vars.hotspotX, this.screen.vars.hotspotY, this.screen.vars.angle );
				collisions.xCoord = rotated.x + xScreen;
				collisions.yCoord = rotated.y + yScreen;
				collisions.angle += this.screen.vars.angle;
			}
			collisions.rectangle = { x1: collisions.x, y1: collisions.y, x2: collisions.x + collisions.width, y2: collisions.y + collisions.height };
		}
		else
		{
			collisions.rectangle = { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 };
		}
		this.toUpdateCollisions = false;
	}
};
//////////////////////////////////////////////////////////////////////
// Filters
//////////////////////////////////////////////////////////////////////
Bob.prototype.setFilter = function( args )
{
	this.vars.filters.setFilter( args );
};
Bob.prototype.delFilter = function( args )
{
	this.vars.filters.delFilter( args );
};
Bob.prototype.getFilter = function( args )
{
	return this.vars.filter.getFilter( args );
};
Bob.prototype.getFilterString = function()
{
	return this.filter.getFilterString();
};
