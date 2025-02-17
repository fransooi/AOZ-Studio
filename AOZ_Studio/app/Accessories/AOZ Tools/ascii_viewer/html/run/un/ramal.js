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
 * AMAL
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

function AMAL( aoz )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	this.reset();
}
AMAL.prototype.reset = function()
{
	this.channels = [];
	this.numberOfChannels = 0;
	this.isSynchro = true;
	this.registers =
	{
		'A': 0,
		'B': 0,
		'C': 0,
		'D': 0,
		'E': 0,
		'F': 0,
		'G': 0,
		'H': 0,
		'I': 0,
		'J': 0,
		'K': 0,
		'L': 0,
		'M': 0,
		'N': 0,
		'O': 0,
		'P': 0,
		'Q': 0,
		'R': 0,
		'S': 0,
		'T': 0,
		'U': 0,
		'V': 0,
		'W': 0,
		'X': 0,
		'Y': 0,
		'Z': 0
	};
}
AMAL.prototype.setSynchro = function( onOff )
{
	this.isSynchro = onOff;
}
AMAL.prototype.synchro = function()
{
	if ( !this.isSynchro )
		this.doSynchro();
}
AMAL.prototype.setOnOff = function( onOff, channelNumber )
{
	if ( typeof channelNumber == 'undefined' )
	{
		//if ( !onOff )
		//	this.reset();
		//else
		{
			for ( var c = 0; c < this.channels.length; c++ )
			{
				if ( this.channels[ c ] )
					this.channels[ c ].onOff = onOff;
			}
		}
	}
	else
	{
		if ( channelNumber < 0 )
			throw { error: 'illegal_function_call', parameter: channelNumber };
		if ( !this.channels[ channelNumber ] )
			throw { error: 'channel_not_opened', parameter: channelNumber };
		this.channels[ channelNumber ].onOff = onOff;
	}
};
AMAL.prototype.freeze = function( onOff, channelNumber )
{
	if ( typeof channelNumber == 'undefined' )
	{
		for ( var c = 0; c < this.channels.length; c++ )
		{
			if ( this.channels[ c ] )
				this.channels[ c ].freeze = onOff;
		}
	}
	else
	{
		if ( channelNumber < 0 )
			throw { error: 'illegal_function_call', parameter: channelNumber };
		if ( !this.channels[ channelNumber ] )
			throw { error: 'channel_not_opened', parameter: channelNumber };
		this.channels[ channelNumber ].freeze = onOff;
	}
};
AMAL.prototype.getChannel = function( channelNumber )
{
	if ( channelNumber < 0 )
		throw { error: 'illegal_function_call', parameter: channelNumber };
	return this.channels[ channelNumber ];
};
AMAL.prototype.runChannel = function( channel, code, callback, extra )
{
	var channelNumber = channel.channelNumber;
	if ( channelNumber < 0 )
		throw { error: 'illegal_function_call', parameter: channelNumber };
	if ( this.channels[ channelNumber ] )
	{
		// Same program already running-> restart channel
		if ( code == this.channels[ channelNumber ].code )
		{
			this.channels[ channelNumber ].reset();
			callback( true, null, extra );
			return;
		}
		this.channels[ channelNumber ].destroy();
		this.channels[ channelNumber ] = null;
		this.numberOfChannels--;
	}
	var name = 'AMALChannel' + channelNumber;
	this.callback = callback;
	this.extra = extra;

	this.channels[ channelNumber ] = new AMALChannel( this.aoz, this, code, name, channelNumber, function( response, data, extra )
	{
		if ( response )
		{
			callback( true, null, extra );
		}
		else
		{
			callback( false, null, extra );
		}
	}, extra );
	this.numberOfChannels++;
};
AMAL.prototype.doSynchro = function()
{
	var count = 0;
	for ( var c = 0; c < this.channels.length && count < this.numberOfChannels; c++ )
	{
		var channel = this.channels[ c ];
		if ( channel && channel.onOff )
		{
			if ( channel.amalProgram )
			{
				channel.update();
			}
			count++;
		}
	}
};

var i2 = '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';

AMAL.prototype.setChannelPosition = function( channelNumber, x, y, image )
{
	if ( channelNumber < 0 )
		throw { error: 'illegal_function_call', parameter: channelNumber };
	var channel = this.channels[ channelNumber ];
	if ( channel )
	{
		channel.registers.x = x;
		channel.registers.y = y;
		channel.registers.a = image;
		return true;
	}
	return false;
};
AMAL.prototype.setRegister = function( value, registerNumber, channelNumber )
{
	if ( registerNumber < 0 )
		throw { error: 'illegal_function_call', parameter: registerNumber };
	if ( typeof channelNumber == 'undefined' )
	{
		if ( registerNumber > 25 )
			throw { error: 'illegal_function_call', parameter: registerNumber };
		this.registers[ String.fromCharCode( registerNumber + 65 ) ] = value;
	}
	else
	{
		if ( registerNumber > 10 )
			throw { error: 'illegal_function_call', parameter: registerNumber };
		if ( this.channels[ channelNumber ] == null )
			throw { error: 'channel_not_opened', parameter: channelNumber };
		this.channels[ channelNumber ].registers[ registerNumber ] = value;
	}
};
AMAL.prototype.getRegister = function( registerNumber, channelNumber )
{
	if ( registerNumber < 0 )
		throw { error: 'illegal_function_call', parameter: registerNumber };
	if ( typeof channelNumber == 'undefined' )
	{
		if ( registerNumber > 25 )
			throw { error: 'illegal_function_call', parameter: registerNumber };
		return this.registers[ String.fromCharCode( registerNumber + 65 ) ];
	}
	else
	{
		if ( registerNumber > 10 )
			throw { error: 'illegal_function_call', parameter: registerNumber };
		if ( this.channels[ channelNumber ] == null )
			throw { error: 'channel_not_opened', parameter: channelNumber };
		return this.channels[ channelNumber ].registers[ registerNumber ];
	}
	return 0;
};
AMAL.prototype.isChannelAnimated = function( channelNumber )
{
	if ( channelNumber < 0 )
		throw { error: 'illegal_function_call', parameter: channelNumber };
	if ( this.channels[ channelNumber ] )
		return this.channels[ channelNumber ].animCounter > 0;
	return false;
};
AMAL.prototype.isChannelMoving = function( channelNumber )
{
	if ( channelNumber < 0 )
		throw { error: 'illegal_function_call', parameter: channelNumber };
	if ( this.channels[ channelNumber ] )
		return !this.channels[ channelNumber ].wait;	//this.channels[ channelNumber ].moveCounter > 0;
	return false;
};


function AMALChannel( aoz, amal, code, name, number, callback, extra )
{
	this.aoz = aoz;
	this.amal = amal;
	this.extra = extra;
	this.utilities = amal.utilities;
	this.code = code;
	this.number = number;
	this.activeChannel = null;
	this.waitInstructions =
	{
		move: this.move,
		move_wait: this.move_wait,
	};
	this.reset();

	// Save and load code as blob
	code = this.utilities.replaceStringInText( code, '%$NAME', name );
	this.script = document.createElement( 'script' );
	this.script.textContent = code;
	document.body.appendChild( this.script );

	var self = this;
	var handle = setInterval( function()
	{
		if ( typeof window[ name ] != 'undefined' )
		{
			clearInterval( handle );
			self.amalProgram = new window[ name ]( self.aoz, self );
			self.wait = false;
			self.positionMain = 0;
			callback( true, {}, extra );
		}
	}, 1 );
};
AMALChannel.prototype.reset = function()
{
	this.registers =
	{
		'0': 0,
		'1': 0,
		'2': 0,
		'3': 0,
		'4': 0,
		'5': 0,
		'6': 0,
		'7': 0,
		'8': 0,
		'9': 0,
		'x': 0,
		'y': 0,
		'a': 0
	};
	this.position = 0;
	this.waiting = null;
	this.onOff = false;
	this.freeze = false;
	this.moveCounter = 0;
	this.animCounter = 0;
	this.wait = false;
	this.positionMain = 0;
};
AMALChannel.prototype.destroy = function()
{
	if ( this.script )
		document.body.removeChild( this.script );
};
AMALChannel.prototype.run = function()
{

};
AMALChannel.prototype.update = function()
{
	var toUpdate = 0;
	var info = this.aoz.getAnimationChannel( this.number );	
	if ( info )
	{	
		// Grab the coordinates
		var x = info.get_x.call( info.self, '#update' );
		if ( typeof x != 'undefined' )
			this.registers.x = x;
		var y = info.get_y.call( info.self, '#update' );
		if ( typeof y != 'undefined' )
			this.registers.y = y;
		if ( !this.freeze )
		{
			this.updateBlocks( this.amalProgram, this.amalProgram.blocksAutotest, 0 );
			if ( !this.wait )
				this.positionMain = this.updateBlocks( this.amalProgram, this.amalProgram.blocks, this.positionMain );

			if ( this.moveCounter )
			{
				this.registers.x += this.moveDeltaX;
				this.registers.y += this.moveDeltaY;
				this.moveCounter--;
				toUpdate |= 0b011;
			}
			if ( this.animCounter > 0 )
			{
				this.animCounter--;
				if ( this.animCounter == 0 )
				{
					var stop = false;
					this.animPosition++;
					if ( this.animPosition >= this.animFrames.length )
					{
						this.animPosition = 0;
						if ( this.animRepeatCounter > 0 )
						{
							this.animRepeatCounter--;
							if ( this.animRepeatCounter == 0 )
								stop = true
						}
					}
					if ( !stop )
					{
						this.registers.a = this.animFrames[ this.animPosition ].i;
						this.animCounter = this.animFrames[ this.animPosition ].t;
						toUpdate |= 0b100;
					}
				}
			}
			toUpdate |= this.toUpdate;
			this.toUpdate = 0;
			if ( toUpdate )
			{
				if ( toUpdate & 0b001 )
					info.set_x.call( info.self, this.registers.x );
				if ( toUpdate & 0b010 )
					info.set_y.call( info.self, this.registers.y );
				if ( toUpdate & 0b100 )
					info.set_image.call( info.self, this.registers.a );
			}
		}
	}
};
AMALChannel.prototype.updateBlocks = function( section, blocks, position )
{
	if ( position >= blocks.length )
		return;

	var time = performance.now();
	var quit = false;
	while( !quit )
	{
		while( !quit )
		{
			if ( this.waiting )
			{
				this.waiting.call( this );
				if ( this.waiting )
					break;
			}
			do
			{
				ret = blocks[ position++ ].call( section );
			} while( !ret );

			switch ( ret.type )
			{
				// End!
				case 0:
					if ( blocks == this.amalProgram.blocks )
						this.wait = true;
					quit = true;
					break;

				// Goto
				case 1:
					position = ret.label;
					break;

				// Blocking instruction
				case 2:
					this.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					this.waitInstructions[ ret.instruction ].call( this, ret.args );
					break;

				// Blocking function
				case 3:
					this.waiting = this.waitInstructions[ ret.instruction + '_wait' ];
					this.waitInstructions[ ret.instruction ].call( this, ret.result, ret.args );
					break;

				// Next
				case 4:
					position = ret.label;
					quit = true;
					break;
			}
		}
		if ( quit || this.waiting )
			break;

		// Check time in loop
		if ( performance.now() - time > 1 )
			break;
	}
	return position;
};
AMALChannel.prototype.move = function( args )
{
	if ( args[ 2 ] <= 0 )
		args[ 2 ] = 1;
	this.moveDeltaX = args[ 0 ] / args[ 2 ];
	this.moveDeltaY = args[ 1 ] / args[ 2 ];
	this.moveCounter = args[ 2 ];
};
AMALChannel.prototype.move_wait = function( slopeX, slopeY, steps )
{
	if ( this.moveCounter == 0 )
	{
		this.waiting = null;
	}
};
AMALChannel.prototype.anim = function( repeat, frames )
{
	this.animFrames = frames;
	this.animPosition = 0;
	this.animRepeatCounter = repeat;
	this.registers.a = this.animFrames[ 0 ].i;
	this.animCounter = this.animFrames[ 0 ].t;
};
AMALChannel.prototype.play = function( index )
{
	console.log( 'Play instruction not implemented' );
};
AMALChannel.prototype.direct = function( label )
{
	this.positionMain = label;
	this.wait = false;
	this.waiting = false;
};
AMALChannel.prototype.bobCol = function( number, start, end )
{
	this.collisions = this.aoz.sprites.bobCol( number, this.extra, start, end );
};
AMALChannel.prototype.spriteCol = function()
{
	this.collisions = this.aoz.sprites.spriteCol( number, start, end );
};
AMALChannel.prototype.z = function( mask )
{
	var value = this.aoz.rnd( 65536 );
	if ( typeof mask != 'undefined' )
		value &= mask;
	return value;
};
AMALChannel.prototype.joystick = function( number )
{
};
AMALChannel.prototype.setAMAL = function( number )
{
};
