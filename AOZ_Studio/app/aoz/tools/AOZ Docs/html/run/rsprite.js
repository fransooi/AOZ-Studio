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
 * Sprite bank and sprites
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 29/01/2020
 */
function Sprite( aoz, parent, tags )
{
	this.aoz = aoz;
	this.parent = aoz;
	this.tags = tags;

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
		modified: 0,
		cameraX: 0,
		cameraY: 0,
		cameraZ: 0,
		shadowX: 0,
		shadowY: 0,
		shadowBlur: 0,
		shadowColor: 0,
		hRev: false,
		vRev: false,
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

	this.modifiedCollsions = 0;
	this.collisions =
	{
		rectangle: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 },
		rectangleClamp: { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 }
	};
	this.aoz.turnIntoObject( this, {}, {},
	{
		setSize: this.setSize,
		setImage: this.setImage
	} );
}
Sprite.prototype.get_this = function( index, mode )
{
	mode = ( typeof mode == 'undefined' ? '' : mode );
	var self = this.aoz.getSprite( index, null );
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

Sprite.prototype.setModified = function()
{
	this.vars.modified++;
	this.modifiedCollisions = -1;
	this.aoz.renderer.setModified();
};
Sprite.prototype.setImage = function( image, fromInstruction )
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
		this.bank = this.aoz.banks.getBank( this.bankIndex, this.aoz.currentContextName, 'images' );
		this.bankIndex = this.bank.index;
		this.bankReserveNumber = this.bank.reserveNumber;
		this.imageObject = this.bank.getElement( image );
		this.aoz.setImage.call( this, image, fromInstruction );
		this.aoz.setSize.call( this, { width: this.imageObject.width, height: this.imageObject.height }, fromInstruction );
	}
};
Sprite.prototype.set = function( position, image, fromInstruction )
{
	if ( typeof image != 'undefined' )
	{
		this.setImage( image, fromInstruction );
	}
	if ( typeof position.x != 'undefined' )
	{
		position.x = this.limits ? Math.max( this.limits.x, Math.min( this.vars.x, this.limits.x + this.limits.width ) ) : position.x;
	}
	if ( typeof position.y != 'undefined' )
	{
		position.y = this.limits ? Math.max( this.limits.y, Math.min( this.vars.y, this.limits.y + this.limits.height ) ) : position.y;
	}
	this.setPosition( position, fromInstruction );
};
Sprite.prototype.updateBank = function( newBank, newBankIndex, contextName )
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
Sprite.prototype.destroy = function( options )
{
	this.parent.destroy( this.index );
};
Sprite.prototype.update = function( options )
{
	if ( this.vars.modified || options.force )
	{
		this.vars.modified = 0;
		if ( this.imageObject )
		{
			this.positionDisplay.x = this.vars.x;
			this.positionDisplay.y = this.vars.y;
			this.positionDisplay.z = this.vars.z;
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
Sprite.prototype.setClipping = function( rectangle, options )
{
	if ( rectangle )
	{
		rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
		rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
		rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
		rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
	}
	this.clipping = rectangle;
	this.setModified();
};
Sprite.prototype.setLimits = function( rectangle, options )
{
	if ( rectangle )
	{
		rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : 0;
		rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : 0;
		rectangle.width = typeof rectangle.width != 'undefined' ? rectangle.width : this.parent.width;
		rectangle.height = typeof rectangle.height != 'undefined' ? rectangle.height : this.parent.height;
		if ( this.aoz.platform == 'amiga' )
			rectangle.width &= 0xFFFFFFF0;
	}
	this.limits = rectangle;
	this.clipping = rectangle;
	this.setModified();
};
Sprite.prototype.setSize = function( dimension, fromInstruction )
{
	if ( typeof dimension.width != 'undefined' )
		dimension.width *= this.vars.scaleX;
	if ( typeof dimension.height != 'undefined' )
		dimension.height *= this.vars.scaleY;
	if ( typeof dimension.depth != 'undefined' )
		dimension.depth *= this.vars.scaleZ;
	this.aoz.setSize.call( this, dimension, fromInstruction );
};
Sprite.prototype.updateCollisionData = function( active )
{
	if ( this.vars.modified != this.modifiedCollisions )
	{
		this.modifiedCollisions = this.vars.modified;
		var collisions = this.collisions;
		if ( this.imageObject && typeof this.aoz.renderingContext.hardLeftX != 'undefined' )
		{
			if ( active )
				collisions.active = true;
			collisions.renderScaleX = 1;
			collisions.renderScaleY = 1;
			collisions.scaleX = Math.abs( this.vars.scaleX );
			collisions.scaleY = Math.abs( this.vars.scaleY );
			collisions.angle = this.vars.angle;
			collisions.width = this.imageObject.width * collisions.scaleX;
			collisions.height = this.imageObject.height * collisions.scaleY;
			collisions.method = this.aoz.manifest.collisions.method;
			collisions.precision = this.aoz.manifest.collisions.precision;
			collisions.alphaThreeshold = this.aoz.manifest.collisions.alphaThreeshold;
			if ( this.vars.scaleX > 0 )
				collisions.hotSpotX = this.imageObject.hotSpotX * collisions.scaleX;
			else
				collisions.hotSpotX = collisions.width - this.imageObject.hotSpotX * collisions.scaleX;
			if ( this.vars.scaleY > 0 )
				collisions.hotSpotY = this.imageObject.hotSpotY * collisions.scaleY;
			else
				collisions.hotSpotY = collisions.height - this.imageObject.hotSpotY * collisions.scaleY;
			collisions.x = this.vars.x - collisions.hotSpotX - this.aoz.renderingContext.hardLeftX;
			collisions.y = this.vars.y - collisions.hotSpotY - this.aoz.renderingContext.hardTopY;
			collisions.xCoord = this.vars.x - this.aoz.renderingContext.hardLeftX;
			collisions.yCoord = this.vars.y - this.aoz.renderingContext.hardTopY;

			collisions.rectangle = { x1: collisions.x, y1: collisions.y, x2: collisions.x + collisions.width, y2: collisions.y + collisions.height };
		}
		else
		{
			collisions.rectangle = { x1: 10000000, y1: 10000000, x2: -10000000, y2: -10000000 };
		}
	}
};
//////////////////////////////////////////////////////////////////////
// Filters
//////////////////////////////////////////////////////////////////////
Sprite.prototype.setFilter = function( args )
{
	this.vars.filters.setFilter( args );
};
Sprite.prototype.delFilter = function( args )
{
	this.vars.filters.delFilter( args );
};
Sprite.prototype.getFilter = function( args )
{
	return this.vars.filters.getFilter( args );
};
Sprite.prototype.getFilterString = function()
{
	return this.vars.filters.getFilterString();
};
