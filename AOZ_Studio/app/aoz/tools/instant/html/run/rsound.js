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
 * AOZ Runtime Sound primitives
 *
 * Using p5 library (see copyright notice)
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 06/07/1963
 */

function AOSounds( aoz )
{
	this.aoz = aoz;
	this.aoz.sounds = this;
	this.aoz.banks = aoz.banks;
	this.utilities = aoz.utilities;
	this.manifest = aoz.manifest;
	this.initialized = false;
	this.isLoaded = false;
	this.waves = [];
	this.enveloppes = [];
	this.sfx = {};
	this.notesNotation = 'en';
	this.idCount = 0;
	this.soundPoolSize = typeof this.aoz.manifest.sounds.soundPoolSize == 'undefined' ? 32 : this.aoz.manifest.sounds.soundPoolSize;

	this.notesToFrequencies =
	[
		{ names: { en: 'A0', 		lat: 'La-1', 			midi: 'A-1' }, 			freq: 27.5 },		// 0
		{ names: { en: 'A#0,Bb0', 	lat: 'La-1#', 			midi: 'A#-1,Bb-1' }, 	freq: 29.1353 },
		{ names: { en: 'B0', 		lat: 'Si-1', 			midi: 'B-1' }, 			freq: 30.8677 },

		{ names: { en: 'C1', 		lat: 'Do0', 			midi: 'C0' }, 			freq: 32.7032 },	// 3
		{ names: { en: 'C#1,Db1', 	lat: 'Do0#,Ré0b,Re0b', 	midi: 'C#0,Db0' }, 		freq: 34.6479 },
		{ names: { en: 'D1', 		lat: 'Ré0,Re0',			midi: 'D0' }, 			freq: 36.7081 },
		{ names: { en: 'D#1,Eb1', 	lat: 'Ré0#,Re0#,Mi0b', 	midi: 'D#0,Eb0' },		freq: 38.8909 },
		{ names: { en: 'E1', 		lat: 'Mi0', 			midi: 'E0' }, 			freq: 41.2035 },
		{ names: { en: 'F1', 		lat: 'Fa0', 			midi: 'F0' }, 			freq: 43.6536 },
		{ names: { en: 'F#1,Gb1',	lat: 'Fa0#', 			midi: 'F#0,Gb0' }, 		freq: 46.2393 },
		{ names: { en: 'G1', 		lat: 'Sol0', 			midi: 'G0' }, 			freq: 48.9995 },
		{ names: { en: 'G#1,Hb1', 	lat: 'Sol0#,La0b', 		midi: 'G#0,Hb0' }, 		freq: 51.9130 },
		{ names: { en: 'A1', 		lat: 'La0', 			midi: 'A0' }, 			freq: 55 },
		{ names: { en: 'A#1,Bb1', 	lat: 'La0#,Si0b', 		midi: 'A#0' }, 			freq: 58.2705 },
		{ names: { en: 'B1', 		lat: 'Si0', 			midi: 'B0' }, 			freq: 61.7354 },

		{ names: { en: 'C2', 		lat: 'Do1', 			midi: 'C1' }, 			freq: 65.4064 },	// 15
		{ names: { en: 'C#2,Db2', 	lat: 'Do1#,Ré1b,Re1b', 	midi: 'C#1,Db1' }, 		freq: 69.2957 },
		{ names: { en: 'D2', 		lat: 'Ré1,Re1',			midi: 'D1' }, 			freq: 73.4162 },
		{ names: { en: 'D#2,Eb2', 	lat: 'Ré1#,Re1#,Mi1b', 	midi: 'D#1,Eb1' },		freq: 77.7817 },
		{ names: { en: 'E2', 		lat: 'Mi1', 			midi: 'E1' }, 			freq: 82.4069 },
		{ names: { en: 'F2', 		lat: 'Fa1', 			midi: 'F1' }, 			freq: 87.3071 },
		{ names: { en: 'F#2,Gb2',	lat: 'Fa1#', 			midi: 'F#1,Gb1' }, 		freq: 92.4986 },
		{ names: { en: 'G2', 		lat: 'Sol1', 			midi: 'G1' }, 			freq: 97.9989 },
		{ names: { en: 'G#2,Hb2', 	lat: 'Sol1#,La1b', 		midi: 'G#1,Hb1' }, 		freq: 103.826 },
		{ names: { en: 'A2', 		lat: 'La1', 			midi: 'A1' }, 			freq: 110 },
		{ names: { en: 'A#2,Bb2', 	lat: 'La1#,Si1b', 		midi: 'A#1' }, 			freq: 116.541 },
		{ names: { en: 'B2', 		lat: 'Si1', 			midi: 'B1' }, 			freq: 123.471 },

		{ names: { en: 'C3', 		lat: 'Do2', 			midi: 'C2' }, 			freq: 130.813 },	// 27
		{ names: { en: 'C#3,Db3', 	lat: 'Do2#,Ré2b,Re2b', 	midi: 'C#2,Db2' }, 		freq: 138.591 },
		{ names: { en: 'D3', 		lat: 'Ré2,Re2',			midi: 'D2' }, 			freq: 146.832 },
		{ names: { en: 'D#3,Eb3', 	lat: 'Ré2#,Re2#,Mi2b', 	midi: 'D#2,Eb2' },		freq: 155.563 },
		{ names: { en: 'E3', 		lat: 'Mi2', 			midi: 'E2' }, 			freq: 164.814 },
		{ names: { en: 'F3', 		lat: 'Fa2', 			midi: 'F2' }, 			freq: 174.614 },
		{ names: { en: 'F#3,Gb3',	lat: 'Fa2#', 			midi: 'F#2,Gb2' }, 		freq: 184.997 },
		{ names: { en: 'G3', 		lat: 'Sol2', 			midi: 'G2' }, 			freq: 195.998 },
		{ names: { en: 'G#3,Hb3', 	lat: 'Sol2#,La2b', 		midi: 'G#2,Hb2' }, 		freq: 207.652 },
		{ names: { en: 'A3', 		lat: 'La2', 			midi: 'A2' }, 			freq: 220 },
		{ names: { en: 'A#3,Bb3', 	lat: 'La2#,Si2b', 		midi: 'A#2' }, 			freq: 233.082 },
		{ names: { en: 'B3', 		lat: 'Si2', 			midi: 'B2' }, 			freq: 246.942 },

		{ names: { en: 'C4', 		lat: 'Do3', 			midi: 'C3' }, 			freq: 261.626 },	// 39
		{ names: { en: 'C#4,Db4', 	lat: 'Do3#,Ré3b,Re3b', 	midi: 'C#3,Db3' }, 		freq: 277.183 },
		{ names: { en: 'D4', 		lat: 'Ré3,Re3',			midi: 'D3' }, 			freq: 293.665 },
		{ names: { en: 'D#4,Eb4', 	lat: 'Ré3#,Re3#,Mi3b', 	midi: 'D#3,Eb3' },		freq: 311.127 },
		{ names: { en: 'E4', 		lat: 'Mi3', 			midi: 'E3' }, 			freq: 329.628 },
		{ names: { en: 'F4', 		lat: 'Fa3', 			midi: 'F3' }, 			freq: 349.228 },
		{ names: { en: 'F#4,Gb4',	lat: 'Fa3#', 			midi: 'F#3,Gb3' }, 		freq: 369.994 },
		{ names: { en: 'G4', 		lat: 'Sol3', 			midi: 'G3' }, 			freq: 391.995 },
		{ names: { en: 'G#4,Hb4', 	lat: 'Sol3#,La3b', 		midi: 'G#3,Hb3' }, 		freq: 415.305 },
		{ names: { en: 'A4', 		lat: 'La3', 			midi: 'A3' }, 			freq: 440 },
		{ names: { en: 'A#4,Bb4', 	lat: 'La3#,Si3b', 		midi: 'A#3' }, 			freq: 466.164 },
		{ names: { en: 'B4', 		lat: 'Si3', 			midi: 'B3' }, 			freq: 493.883 },

		{ names: { en: 'C5', 		lat: 'Do4', 			midi: 'C4' }, 			freq: 523.251 },	// 51
		{ names: { en: 'C#5,Db5', 	lat: 'Do4#,Ré4b,Re4b', 	midi: 'C#4,Db4' }, 		freq: 554.365 },
		{ names: { en: 'D5', 		lat: 'Ré4,Re4',			midi: 'D4' }, 			freq: 587.33 },
		{ names: { en: 'D#5,Eb5', 	lat: 'Ré4#,Re4#,Mi4b', 	midi: 'D#4,Eb4' },		freq: 622.254 },
		{ names: { en: 'E5', 		lat: 'Mi4', 			midi: 'E4' }, 			freq: 659.255 },
		{ names: { en: 'F5', 		lat: 'Fa4', 			midi: 'F4' }, 			freq: 698.456 },
		{ names: { en: 'F#5,Gb5',	lat: 'Fa4#', 			midi: 'F#4,Gb4' }, 		freq: 739.989 },
		{ names: { en: 'G5', 		lat: 'Sol4', 			midi: 'G4' }, 			freq: 783.991 },
		{ names: { en: 'G#5,Hb5', 	lat: 'Sol4#,La4b', 		midi: 'G#4,Hb4' }, 		freq: 830.609 },
		{ names: { en: 'A5', 		lat: 'La4', 			midi: 'A4' }, 			freq: 880 },
		{ names: { en: 'A#5,Bb5', 	lat: 'La4#,Si4b', 		midi: 'A#4' }, 			freq: 932.328 },
		{ names: { en: 'B5', 		lat: 'Si4', 			midi: 'B4' }, 			freq: 987.767 },

		{ names: { en: 'C6', 		lat: 'Do5', 			midi: 'C5' }, 			freq: 1046.5 },		// 63
		{ names: { en: 'C#6,Db6', 	lat: 'Do5#,Ré5b,Re5b', 	midi: 'C#5,Db5' }, 		freq: 1108.73 },
		{ names: { en: 'D6', 		lat: 'Ré5,Re5',			midi: 'D5' }, 			freq: 1174.66 },
		{ names: { en: 'D#6,Eb6', 	lat: 'Ré5#,Re5#,Mi5b', 	midi: 'D#5,Eb5' },		freq: 1244.51 },
		{ names: { en: 'E6', 		lat: 'Mi5', 			midi: 'E5' }, 			freq: 1318.51 },
		{ names: { en: 'F6', 		lat: 'Fa5', 			midi: 'F5' }, 			freq: 1396.91 },
		{ names: { en: 'F#6,Gb6',	lat: 'Fa5#', 			midi: 'F#5,Gb5' }, 		freq: 1479.98 },
		{ names: { en: 'G6', 		lat: 'Sol5', 			midi: 'G5' }, 			freq: 1567.98 },
		{ names: { en: 'G#6,Hb6', 	lat: 'Sol5#,La5b', 		midi: 'G#5,Hb5' }, 		freq: 1661.22 },
		{ names: { en: 'A6', 		lat: 'La5', 			midi: 'A5' }, 			freq: 1760 },
		{ names: { en: 'A#6,Bb6', 	lat: 'La5#,Si5b', 		midi: 'A#5' }, 			freq: 1864.66 },
		{ names: { en: 'B6', 		lat: 'Si5', 			midi: 'B5' }, 			freq: 1975.53 },

		{ names: { en: 'C7', 		lat: 'Do6', 			midi: 'C6' }, 			freq: 2093 },		// 75
		{ names: { en: 'C#7,Db7', 	lat: 'Do6#,Ré6b,Re6b', 	midi: 'C#6,Db6' }, 		freq: 2217.46 },
		{ names: { en: 'D7', 		lat: 'Ré6,Re6',			midi: 'D6' }, 			freq: 2349.32 },
		{ names: { en: 'D#7,Eb7', 	lat: 'Ré6#,Re6#,Mi6b', 	midi: 'D#6,Eb6' },		freq: 2489.02 },
		{ names: { en: 'E7', 		lat: 'Mi6', 			midi: 'E6' }, 			freq: 2637.02 },
		{ names: { en: 'F7', 		lat: 'Fa6', 			midi: 'F6' }, 			freq: 2793.83 },
		{ names: { en: 'F#7,Gb7',	lat: 'Fa6#', 			midi: 'F#6,Gb6' }, 		freq: 2959.96 },
		{ names: { en: 'G7', 		lat: 'Sol6', 			midi: 'G6' }, 			freq: 3135.96 },
		{ names: { en: 'G#7,Hb7', 	lat: 'Sol6#,La6b', 		midi: 'G#6,Hb6' }, 		freq: 3322.44 },
		{ names: { en: 'A7', 		lat: 'La6', 			midi: 'A6' }, 			freq: 3520 },
		{ names: { en: 'A#7,Bb7', 	lat: 'La6#,Si6b', 		midi: 'A#6' }, 			freq: 3729.31  },
		{ names: { en: 'B7', 		lat: 'Si6', 			midi: 'B6' }, 			freq: 3951.07  },

		{ names: { en: 'C8', 		lat: 'Do7', 			midi: 'C7' }, 			freq: 4186.01 },	// 87
		{ names: { en: 'C#8,Db8', 	lat: 'Do7#,Ré7b,Re7b', 	midi: 'C#7,Db7' }, 		freq: 4434.92 },
		{ names: { en: 'D8', 		lat: 'Ré7,Re7',			midi: 'D7' }, 			freq: 4698.64 },
		{ names: { en: 'D#8,Eb8', 	lat: 'Ré7#,Re7#,Mi7b', 	midi: 'D#7,Eb7' },		freq: 4978.04 },
		{ names: { en: 'E8', 		lat: 'Mi7', 			midi: 'E7' }, 			freq: 5274.04 },
		{ names: { en: 'F8', 		lat: 'Fa7', 			midi: 'F7' }, 			freq: 5587.66 },
		{ names: { en: 'F#8,Gb8',	lat: 'Fa7#', 			midi: 'F#7,Gb7' }, 		freq: 5919.92 },
		{ names: { en: 'G8', 		lat: 'Sol7', 			midi: 'G7' }, 			freq: 6271.92 },
		{ names: { en: 'G#8,Hb8', 	lat: 'Sol7#,La7b', 		midi: 'G#7Hb7' }, 		freq: 6644.88 },
		{ names: { en: 'A8', 		lat: 'La7', 			midi: 'A7' }, 			freq: 7040 },
		{ names: { en: 'A#8,Bb8', 	lat: 'La7#,Si7b', 		midi: 'A#7' }, 			freq: 7458.62  },
		{ names: { en: 'B8', 		lat: 'Si7', 			midi: 'B7' }, 			freq: 7902.14  },
																										// 99
	];

	// Setup context
	var AudioContext = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContext();
	this.gainNode = new GainNode( this.audioContext );
	this.gainNode.connect( this.audioContext.destination );
	this.destinationNode = this.gainNode;

	// Create white buffer
	this.noiseBuffers = {};
	this.noiseBuffers[ 'white' ] = this.createAudioBuffer( 2, 2, function( position )
	{
		return Math.random() * 2 - 1;
	} );

	// Create pink noise buffer
	var b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
	this.noiseBuffers[ 'pink' ] = this.createAudioBuffer( 2, 2, function( position )
	{
		var white = Math.random() * 2 - 1;
		b0 = 0.99886 * b0 + white * 0.0555179;
		b1 = 0.99332 * b1 + white * 0.0750759;
		b2 = 0.96900 * b2 + white * 0.1538520;
		b3 = 0.86650 * b3 + white * 0.3104856;
		b4 = 0.55000 * b4 + white * 0.5329522;
		b5 = -0.7616 * b5 - white * 0.0168980;
		var result = ( b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362 ) * 0.11;
		b6 = white * 0.115926;
		return result;
    } );

	// Create brown noise buffer
	var lastOut = 0.0;
	this.noiseBuffers[ 'brown' ] = this.createAudioBuffer( 2, 2, function( position )
	{
		var white = Math.random() * 2 - 1;
		lastOut = ( lastOut + ( 0.02 * white ) ) / 1.02;
		return lastOut * 3.5;
	} );

	this.aoz.banks.loadAllBanks( 'samples' );
	this.isLoaded = true;

	this.voices = [];
	this.voicesOn = [];
	this.numberOfLoops = 1;
	this.envelopes = 
	{
		_default: 
		{
			shape: [ { duration: 0.1, level: 1 }, { duration: 0.5, level: 0.8 }, { duration: 0.001, level: 0 } ]
		}
	};
	this.vars =
	{
		volume: typeof this.aoz.manifest.sounds.volume == 'undefined' ? ( this.aoz.platform == 'amiga' ? 64 : 1 ) : this.aoz.manifest.sounds.volume,
		muted: false
	};

	this.filters = [];
	this.waves = {};
	this.mainAmplitude = undefined;

	// Amiga mode...
	if ( this.aoz.manifest.sounds.mode == 'amiga' )
	{
		this.numberOfVoices = 4;
		this.voices[ 0 ] = new AOVoice( this.aoz, 0, {} );
		this.voices[ 0 ].setPan( -1 );
		this.voices[ 1 ] = new AOVoice( this.aoz, 1, {} );
		this.voices[ 1 ].setPan( 1 );
		this.voices[ 2 ] = new AOVoice( this.aoz, 2, {} );
		this.voices[ 2 ].setPan( -1 );
		this.voices[ 3 ] = new AOVoice( this.aoz, 3, {} );
		this.voices[ 3 ].setPan( 1 );
		this.amigaToPCVolume = 1 / 64;
		
	}
	else
	{
		this.numberOfVoices = 32;
		for ( var n = 0; n < this.numberOfVoices; n++ )
		{
			this.voices[ n ] = new AOVoice( this.aoz, n, {} );
			this.voicesOn[ n ] = true;
			this.filters[ n ] = {};
		}
		this.amigaToPCVolume = 1;
	}
	this.gainNode.gain.value = this.vars.volume * this.aoz.sounds.amigaToPCVolume;
}
AOSounds.prototype.startAudio = function()
{
	// This accomplishes the iOS specific requirement
	var buffer = this.audioContext.createBuffer( 1, 1, this.audioContext.sampleRate );
	var source = this.audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect( this.audioContext.destination );
	source.start( 0 );

	// Resume the audio context
	this.audioContext.resume();
}
AOSounds.prototype.createAudioBuffer = function( duration, numberOfChannels, callback )
{
	var numberOfFrames = this.audioContext.sampleRate * duration;
	var buffer = this.audioContext.createBuffer( numberOfChannels, numberOfFrames, this.audioContext.sampleRate );
  	for ( var channel = 0; channel < numberOfChannels; channel++) 
	{    
    	var data = buffer.getChannelData( channel );
    	for ( var i = 0; i < numberOfFrames; i++) 
		{
	      	data[ i ] = callback( i );
    	}
  	}
	return buffer;
};
AOSounds.prototype.loadSound = function( buffer, callback, extra )
{
	this.audioContext.decodeAudioData( buffer, function( buffer )
	{
		callback( true, buffer, extra );
	},
	function( error )
	{
		callback( false, buffer, extra );
	} );
};
AOSounds.prototype.getFrequency = function( voice, number )
{	
	if ( typeof voice == 'undefined' )
	{
		if ( !this.analyserNode )
		{
			this.analyserNode = new AnalyserNode( this.audioContext );
			this.gainNode.connect( this.analyserNode );
			this.analyserNode.connect( this.audioContext.destination );
			this.analyserData = new Uint8Array( this.analyserNode.frequencyBinCount );
		}
		this.analyserNode.getByteTimeDomainData( this.analyserData );
		if ( number < 0 || number >= this.analyserNode.frequencyBinCount )
			throw { error: 'illegal_function_call', parameter: number };
		return ( this.analyserData[ number ] - 128 ) / 128;
	}
	else
	{
		if ( voice < 0 || voice > this.numberOfVoices )
			throw { error: 'illegal_function_call', parameter: voice };
		return this.voices[ voice ].getFrequency( number );
	}
}
AOSounds.prototype.getVuMeter = function( voice, options )
{	
	if ( typeof voice == 'undefined' )
	{
		if ( !this.analyserNode )
		{
			this.analyserNode = new AnalyserNode( this.audioContext );
			this.gainNode.connect( this.analyserNode );
			this.analyserNode.connect( this.audioContext.destination );
			this.analyserData = new Uint8Array( this.analyserNode.frequencyBinCount );
		}
		this.analyserNode.getByteTimeDomainData( this.analyserData );
		var value = 0;
		for ( v = 0; v < this.analyserNode.frequencyBinCount; v++ )
			value = Math.max( Math.abs( 128 - this.analyserData[ v ] ) / 128 );
		return value;
	}
	else
	{
		if ( voice < 0 || voice > this.numberOfVoices )
			throw { error: 'illegal_function_call', parameter: voice };
		return this.voices[ voice ].getVuMeter();
	}
};
AOSounds.prototype.removeFilter = function( voice, type )
{
	if ( !AOFilter.prototype.checkType( type ) )
		throw { error: 'illegal_function_call', parameter: this.vars.type };
	type = ( typeof type != 'undefined' ? type.toLowerCase() : undefined );
	
	if ( typeof voice == 'undefined' )
	{
		for ( var v = 0; v < this.numberOfVoices; v++ )
		{			
			if ( type )
				this.filters[ v ][ type ] = undefined;
			else
				this.filters[ v ] = {};
		}
	}
	else
	{
		if ( voice < 0 || voice > this.numberOfVoices )
			throw { error: 'illegal_function_call', parameter: voice };
		this.voices[ voice ].removeFilter( type );
	}
};
AOSounds.prototype.addFilter = function( voice, type, options )
{	
	if ( !AOFilter.prototype.checkType( type ) )
		throw { error: 'illegal_function_call', parameter: this.vars.type };

	type = type.toLowerCase();	
	options.type = type;
	if ( typeof voice == 'undefined' )
	{
		for ( var v = 0; v < this.numberOfVoices; v++ )
		{			
			this.filters[ type ] = new AOFilter( this.aoz, options );
		}
	}
	else
	{
		if ( voice < 0 || voice > this.numberOfVoices )
			throw { error: 'illegal_function_call', parameter: voice };
		this.voices[ voice ].addFilter( type, options );
	}
};


AOSounds.prototype.setEnvelope = function( index, phase, duration, level )
{
	if ( index < 0 || index >= this.numberOfVoices || phase < 0 )
		throw { error: 'illegal_function_call', parameter: number };
	if ( !this.enveloppes[ index ] )
		this.enveloppes[ index ] = { shape: [] };
	this.enveloppes[ index ].shape[ phase ] = { duration: duration * 1000, level: level };
};


AOSounds.prototype.callVoices = function( functionName, number, args )
{
	function callIt( voice )
	{
		switch( args.length )
		{
			case 0:                        
				return voice[ functionName ]();
			case 1:                        
				return voice[ functionName ]( args[ 0 ] );
			case 2:                        
				return voice[ functionName ]( args[ 0 ], args[ 1 ] );
			case 3:                        
				return voice[ functionName ]( args[ 0 ], args[ 1 ], args[ 2 ] );
			case 4:                        
				return voice[ functionName ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ] );
			case 5:                        
				return voice[ functionName ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ] );
			case 6:                        
				return voice[ functionName ]( args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ], args[ 4 ], args[ 5 ] );
		}
	};
	if ( this.aoz.platform == 'amiga' )
	{
		number = typeof number == 'undefined' ? 0x0000000F : number;
		if ( number == 0 )
			number = 0x0000000F;
		for ( var v = 0; v < 4; v++ )
		{
			var mask = ( 1 << v );
			if ( ( number & mask ) != 0 )
			{
				result = callIt( this.voices[ v ] );                    
			}
		}
		return result;
	}
	else
	{
		if ( number == -1 )
		{
			for ( var n = 0; n < this.voices.length; n++ )
				callIt( this.voices[ n ] );
			return 0;
		}
		if ( typeof number == 'undefined' && this.voicesOn[ 1 ] )
			return callIt( this.voices[ 1 ] );
		if ( number < 0 || number > this.voices.length )
			throw { error: 'illegal_function_call', parameter: number };
		return callIt( this.voices[ number ] );
	}
};
AOSounds.prototype.getNoteFrequency = function( note )
{
	var freq;
	if ( typeof note == 'number' )
		freq = this.notesToFrequencies[ note ];
	else
	{
		for ( var f = 0; f < this.notesToFrequencies.length; f++ )
		{
			var ff = this.notesToFrequencies[ f ];
			var str = ff.names[ this.notesNotation ].toLowerCase();
			var position = 0, comma;
			if ( str )
			{
				note = note.toLowerCase();
				var comma = str.indexOf( ',' );
				if ( comma < 0 )
					comma = str.length;
				do
				{
					if ( note == str.substring( position, comma ) )
					{
						freq = ff;
						break;
					}
					position = comma + 1;
					comma = str.indexOf( ',', position );	
				} while( comma >= 0 )
			}
		}
	}
	//if ( this.aoz.platform == 'amiga' )
	//	freq.freq /= 2.8;
	return freq ? freq : { names: { en: 'A4', lat: 'La3', midi: 'A3' },	freq: 440 };
};
AOSounds.prototype.addSfx = function( index, audio )
{
	this.sfx[ 'sfx_' + index ] = audio;
};
AOSounds.prototype.delSfx = function( index )
{
	if ( this.sfx[ 'sfx_' + index ] )
	{
		this.sfx = this.aoz.utilities.cleanObject( this.sfx, this.sfx[ 'sfx_' + index ] );
	}
};
AOSounds.prototype.addWave = function( index, sampleRate, buffer )
{
	var audioCtx = this.audioContext;
	sampleRate = ( typeof sampleRate == 'undefined' ? 44100 : sampleRate );	
	var audio;
	if ( typeof buffer == 'string' )
	{
		if ( this.aoz.platform == 'amiga' )
		{
			if ( buffer.length != 256 )
				throw { error: '256_characters_for_a_wave' };
			len = sampleRate;
			audio = audioCtx.createBuffer( 2, len, sampleRate );
			var p, c;
			var step = 5.9;
			var audioBuffer0 = audio.getChannelData( 0 );
			var audioBuffer1 = audio.getChannelData( 1 );
			for ( p = 0, c= 0; p < len; p++ )
			{			
				var value = buffer.charCodeAt( Math.floor( c ) );
				if ( value > 128 )
					value -= 256;
				audioBuffer0[ p ] = value / 128;
				audioBuffer1[ p ] = value / 128;
				c += step;
				if ( c >= buffer.length )
					c -= buffer.length;
			}
		}
		else
		{
			len = Math.max( buffer.length, sampleRate );
			audio = audioCtx.createBuffer( 2, len, sampleRate );
			var p, c;
			var audioBuffer0 = audio.getChannelData( 0 );
			var audioBuffer1 = audio.getChannelData( 1 );
			for ( p = 0, c= 0; p < len; p++ )
			{			
				var value = buffer.charCodeAt( c++ );
				if ( value > 128 )
					value -= 256;
				audioBuffer0[ p ] = value / 128;
				audioBuffer1[ p ] = value / 128;
				if ( c >= buffer.length )
					c = 0;
			}	
		}
	}
	else
	{
		if ( this.aoz.utilities.isObject( buffer ) && buffer.dimensions )
		{
			if ( buffer.dimensions.length == 1 )
			{
				audio = audioCtx.createBuffer( 1, buffer.dimensions[ 0 ], sampleRate );
				var audioBuffer = audio.getChannelData( 0 );
				for ( var p = 0; p < buffer.dimensions[ 0 ]; p++ )
					audioBuffer[ p ] = buffer.getValue( [ p ] );
			}
			else if ( buffer.dimensions.length == 2 )
			{
				audio = audioCtx.createBuffer( 2, buffer.dimensions[ 1 ], sampleRate );
				var audioBuffer = audio.getChannelData( 0 );
				for ( var p = 0; p < buffer.dimensions[ 1 ]; p++ )
					audioBuffer[ p ] = buffer.getValue( [ 0, p ] );
				audioBuffer = audio.getChannelData( 1 );
				for ( var p = 0; p < buffer.dimensions[ 1 ]; p++ )
					audioBuffer[ p ] = buffer.getValue( [ 1, p ] );	
			}
		}
	}
	this.waves[ 'wave_' + index ] = audio;
}
AOSounds.prototype.delWave = function( index )
{
	if ( !this.waves[ 'wave_' + index ] )
		throw { error: 'wave_not_defined', parameter: index };
	this.waves = this.aoz.utilities.cleanObject( this.waves, this.waves[ 'wave_' + index ] );
};
AOSounds.prototype.setVolume = function( volume, voices )
{
	if ( volume * this.aoz.sounds.amigaToPCVolume < 0 || volume * this.aoz.sounds.amigaToPCVolume > 1 )
		throw { error: 'illegal_function_call', parameter: volume };
	if ( !voices )
	{
		this.vars.volume = volume;
		this.gainNode.gain.value = ( this.vars.muted ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume );
	}
	else
	{
		this.callVoices( 'setVolume', voices, [ volume ] );
	}
};
AOSounds.prototype.samLoop = function( onOff, voices )
{	
	if ( !voices )
	{
		for ( var v = 0; v < this.voices.length; v++ )
			this.voices[ v ].samLoop( onOff );
	}
	else
	{
		this.callVoices( 'samLoop', voices, [ onOff ] );
	}
};
AOSounds.prototype.setVoices = function( onOff, voice )
{
	if ( typeof voice == 'undefined' )
	{
		for ( var v = 0; v < this.numberOfVoices; v++ )
		{
			var mask = ( 1 << v );
			this.voices[ v ].mute( ( onOff & mask ) == 0 );
		}
	}
	else
	{		
		if ( voice < 0 || voice > this.numberOfVoices )
			throw { error: 'illegal_function_call', parameter: voice };
		this.voices[ voice ].mute( !onOff );
	}
};
AOSounds.prototype.mute = function( onOff, voices )
{
	if ( typeof voices == 'undefined' )
	{
		this.vars.muted = onOff;
		this.gainNode.gain.value = ( this.vars.muted ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume );	
	}
	else
	{		
		this.callVoices( 'mute', voices, [ onOff ] );
	}
};

//
// AOZ SOUND RENDERER
//
// Generic sound class
//
function AOVoice( aoz, index, options )
{
	this.aoz = aoz;
	this.sounds = aoz.sounds;
	this.utilities = aoz.utilities;
	this.banks = aoz.banks;
	this.className = 'aovoice';
	this.number = name;
	this.index = index;
	this.type = undefined;
	this.samLoopOn = false;

	options = typeof options == 'undefined' ? {} : options;
	this.vars = 
	{
		x: typeof options.x != 'undefined' ? options.x : 0,
		y: typeof options.y != 'undefined' ? options.y : 0,
		z: typeof options.z != 'undefined' ? options.z : 0,
		angleX: typeof options.angleX != 'undefined' ? options.angleX : 0,
		angleY: typeof options.angleY != 'undefined' ? options.angleY : 0,
		angleZ: typeof options.angleZ != 'undefined' ? options.angleZ : 0,
		volume: typeof options.volume != 'undefined' ? options.volume : ( this.aoz.platform == 'amiga' ? 64 : 1 ),
		rate: typeof options.rate != 'undefined' ? options.rate : 1.0,
		pan: typeof options.pan != 'undefined' ? options.pan : 0.0,
		muted: typeof options.muted != 'undefined' ? options.muted : false,
	};
	this.aoSounds = [];
	this.aoFilters = [];
	
	return this;
};
AOVoice.prototype.getFrequency = function( number )
{ 
	if ( !this.analyserNode )
	{
		this.analyserNode = new AnalyserNode( this.sounds.audioContext );
		this.analyserData = new Uint8Array( this.analyserNode.frequencyBinCount );
		this.analyserNode.connect( this.sounds.gainNode );
		for ( var s = 0; s < this.aoSounds.length; s++ )
			this.connect( this.aoSounds[ s ].outputNode );
	}
	this.analyserNode.getByteTimeDomainData( this.analyserData );
	if ( number < 0 || number >= this.analyserNode.frequencyBinCount )
		throw { error: 'illegal_function_call', parameter: number };
	return ( this.analyserData[ number ] - 128 ) / 128;
};
AOVoice.prototype.getVuMeter = function( options )
{ 
	if ( !this.analyserNode )
	{
		this.analyserNode = new AnalyserNode( this.sounds.audioContext );
		this.analyserData = new Uint8Array( this.analyserNode.frequencyBinCount );
		this.analyserNode.connect( this.sounds.gainNode );
		for ( var s = 0; s < this.aoSounds.length; s++ )
			this.connect( this.aoSounds[ s ].outputNode );
	}
	this.analyserNode.getByteTimeDomainData( this.analyserData );
	var value = 0;
	for ( v = 0; v < this.analyserNode.frequencyBinCount; v++ )
		value = Math.max( Math.abs( 128 - this.analyserData[ v ] ) / 128 );
	return value;
};
AOVoice.prototype.connect = function( sound )
{	
	for ( var f in this.aoFilters )
	{
		if ( this.aoFilters[ f ] )
		{
			sound.outputNode.connect( this.aoFilters[ f ].outputNode );
			sound = this.aoFilters[ f ];
		}
	}
	if ( this.analyserNode )
		sound.outputNode.connect( this.analyserNode );
	else
		sound.outputNode.connect( this.sounds.gainNode );
};
AOVoice.prototype.setType = function( args )
{	
	if ( args.type != 'square' && args.type != 'sine' && args.type != 'triangle' && args.type != 'sawtooth' 
		&& args.type != 'white' && args.type != 'brown' && args.type != 'pink' 
		&& args.type != 'sound' && args.type != 'wave' && args.type != 'sfx' )
		throw { error: 'illegal_function_call', parameter: type };
	this.type = args.type;
	this.index = args.index;
};
AOVoice.prototype.onEvent = function( response, data, extra )
{	
	if ( response == 'end' )
	{
		var newSounds = [];
		for ( var s = 0; s < this.aoSounds.length; s++ )	
		{
			if ( this.aoSounds[ s ] != data )
				newSounds.push( this.aoSounds[ s ] );
		}
		this.aoSounds = newSounds;
		if ( this.callback )
			this.callback( response, data, this.extra );
	}
	else if ( response == 'start' )
	{
		this.aoSounds.push( data );
	}
};
AOVoice.prototype.playNote = function( note, options )
{	
	note = ( typeof note == 'undefined' ? 48 : note );
	options = typeof options != 'undefined' ? options : {};
	options.frequency = this.aoz.sounds.getNoteFrequency( note ).freq;
	options.rate = options.frequency / 440;
	if ( !options.rate )
	{
		options.rate = 1;
		options.frequency = 440;
	}
	return this.play( options.index, options );
};
AOVoice.prototype.play = function( index, options )
{	
	options = typeof options != 'undefined' ? options : {};
	options.type = ( typeof options.type == 'undefined' ? this.type : options.type.toLowerCase() );
	options.loop = ( typeof options.loop == 'undefined' ? ( this.samLoopOn ? -1 : 1 ) : options.loop );
	index = typeof index == 'undefined' ? this.index : index;
	this.callback = options.callback;
	this.extra = options.extra;

	var buffer, sound;
	if ( options.type == 'wave' ) 
	{
		buffer = this.sounds.waves[ 'wave_' + index ];
		if ( !buffer )
			throw { error: 'wave_not_defined', parameter: '' + index };
		sound = new AOSound( this.aoz, this, buffer, { type: options.type, volume: this.vars.volume, pan: this.vars.pan } );
	}
	else if ( options.type == 'sfx' ) 
	{
		buffer = this.sounds.sfx[ 'sfx_' + index ];
		if ( !buffer )
			throw { error: 'sfx_not_defined', parameter: '' + index };
		sound = new AOSound( this.aoz, this, buffer, { type: options.type, volume: this.vars.volume, pan: this.vars.pan } );
	}
	else if ( options.type == 'sound' ) 
	{
		buffer = this.aoz.banks.getSound( index, options.contextName );
		sound = new AOSound( this.aoz, this, buffer, { type: options.type, volume: this.vars.volume, pan: this.vars.pan } );
		sound.index = index;
	}
	else if ( options.type == 'white' || options.type == 'brown' || options.type == 'pink' )
		sound = new AONoise( this.aoz, this, { type: options.type, volume: this.vars.volume, pan: this.vars.pan } );
	else
		sound = new AOSynth( this.aoz, this, { type: options.type, volume: this.vars.volume, pan: this.vars.pan } );
	sound.play( options );
};
AOVoice.prototype.loop = function( index, numberOfTimes, options )
{	
	options = typeof options != 'undefined' ? options : {};
	options.loop = numberOfTimes;
	this.play( index, options );
};
AOVoice.prototype.mute = function( onOff )
{	
	this.vars.muted = onOff;
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].mute( onOff );
};
AOVoice.prototype.jump = function( cueStart, duration )
{	
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].jump( cueStart, duration );
};
AOVoice.prototype.stop = function( index )
{
	if ( !index )
	{
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].stop( true );
	}
	else
	{
		for ( var s = 0; s < this.aoSounds.length; s++ )
		{
			if ( this.aoSounds[ s ].index == index )
				this.aoSounds[ s ].stop( true );
		}
	}
};
AOVoice.prototype.pause = function( after )
{
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].pause( after );
};
AOVoice.prototype.setPan = function( pan )
{
	this.vars.pan = pan;
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s].setPan( pan );
};
AOVoice.prototype.setVolume = function( volume, rampTime, timeFromNow )
{
	this.vars.volume = volume;
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].setVolume( volume, rampTime, timeFromNow );
};
AOVoice.prototype.setRate = function( rate )
{
	this.vars.rate = rate;
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.aoSounds[ s ].setRate( rate );
};
AOVoice.prototype.samLoop = function( onOff )
{
	this.samLoopOn = onOff;
};
AOVoice.prototype.addFilter = function( type, options )
{
	debugger;
	if ( !this.aoFilters[ type ] )
		this.aoFilters[ type ] = new AOFilter( this.aoz, type );
	this.aoFilters[ type ].setOptions( options );
	for ( var s = 0; s < this.aoSounds.length; s++ )
		this.connect( this.aoSounds[ s ].outputNode );
};
AOVoice.prototype.removeFilter = function( type )
{
	debugger;
	if ( this.aoFilters[ type ] )
	{
		this.aoFilters[ type ] = null;
		for ( var s = 0; s < this.aoSounds.length; s++ )
			this.connect( this.aoSounds[ s ].outputNode );
	}
};

//
// ONE SOUND
//
function AOSound( aoz, voice, audioBuffer, options )
{
	this.aoz = aoz;
	this.sounds = aoz.sounds;
	this.className = 'aosound';
	this.voice = voice;
	this.audioBuffer = audioBuffer;

	options = typeof options == 'undefined' ? {} : options;
	this.vars = 
	{
		volume: typeof options.volume != 'undefined' ? options.volume : ( this.aoz.platform == 'amiga' ? 64 : 1 ),
		rate: typeof options.rate != 'undefined' ? options.rate : 1.0,
		pan: typeof options.pan != 'undefined' ? options.pan : 0.0,
		numberOfLoops: typeof options.numberOfLoops != 'undefined' ? options.numberOfLoops : 1.0,
		muted: typeof options.muted != 'undefined' ? options.muted : false,
		autoplay: typeof options.autoplay != 'undefined' ? options.autoplay : false,
	};
	this.loopCounter = 0;

	this.sourceNode = new AudioBufferSourceNode( this.sounds.audioContext, { buffer: this.audioBuffer, loop: false } );
	this.pannerNode = new StereoPannerNode( this.sounds.audioContext, { pan: this.vars.pan } );
	this.gainNode = new GainNode( this.sounds.audioContext, { gain: this.vars.muted ? 0 : this.vars.volume * this.sounds.amigaToPCVolume } )
	this.sourceNode.connect( this.pannerNode );
	this.pannerNode.connect( this.gainNode );
	this.outputNode = this.gainNode;
	this.enveloppe = new AOEnveloppe( aoz, this, this.vars.volume );
	this.voice.connect( this );
	if ( this.vars.autoplay )
		this.play( options );

	return this;
};
AOSound.prototype.play = function( options )
{
	options = typeof options == 'undefined' ? {} : options;
	if ( options.frequency )
		options.rate = options.frequency / 440;
	else
		options.rate = typeof options.rate != 'undefined' ? options.rate : this.vars.rate;
	options.volume = typeof options.volume != 'undefined' ? options.volume : this.vars.volume;
	options.pan = typeof options.pan != 'undefined' ? options.pan : this.vars.pan;
	options.loop = typeof options.loop != 'undefined' ? options.loop : 1;
	this.stop();
	this.setPan( options.pan );
	this.setVolume( options.volume );
	this.vars.rate = options.rate;
	this.sourceNode.playbackRate.value = options.rate;
	this.loopCounter = options.loop;

	// Find duration of sound
	var duration = options.duration;
	if ( !duration || duration < 0 )
		duration = this.audioBuffer.duration / this.vars.rate;
	this.start( duration * 1000 );	
	return true;
};
AOSound.prototype.start = function( duration )
{
	this.enveloppe.start( duration );
};
AOSound.prototype.stop = function( force )
{
	this.enveloppe.stop( force );
};
AOSound.prototype.onEvent = function( response )
{
	if ( response == 'end' )
	{
		if ( this.playing )
		{
			this.sourceNode.stop();
			this.playing = false;
			this.loopCounter--;
			if ( this.loopCounter == 0 )
				this.voice.onEvent( 'end', this );
			else
			{
				this.sourceNode = new AudioBufferSourceNode( this.sounds.audioContext, { buffer: this.audioBuffer, loop: false } );
				this.sourceNode.connect( this.pannerNode );
				this.sourceNode.playbackRate.value = this.vars.rate;
				this.start( ( this.audioBuffer.duration / this.vars.rate ) * 1000 );	
			}
		}
	}
	else if ( response == 'start' )
	{
		if ( !this.playing )
		{
			this.sourceNode.start();
			this.playing = true;
			this.voice.onEvent( 'start', this );
		}
	}	
};
AOSound.prototype.setPan = function( pan )
{
	this.vars.pan = pan;
	this.pannerNode.pan.value = pan;
};
AOSound.prototype.mute = function( onOff )
{
	this.vars.muted = onOff;
	this.enveloppe.setVolume( onOff ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume ); 
};
AOSound.prototype.setVolume = function( volume, rampTime, timeFromNow )
{
	this.vars.volume = volume;
	this.enveloppe.setVolume( this.vars.muted ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume ); 
};
AOSound.prototype.setFrequency = function( frequency )
{
	this.vars.frequency = frequency;
	this.sourceNode.playbackRate.value = frequency / 440;
};
AOSound.prototype.jump = function( cueTime, duration )
{
};
AOSound.prototype.pause = function( cueTime, duration )
{
};
AOSound.prototype.isPlaying = function()
{
	return this.playing;
};
AOSound.prototype.isLoaded = function()
{
	return true;
};
AOSound.prototype.isPaused = function()
{
	return false;
};
AOSound.prototype.isLooping = function()
{
	return false;
};

//
// ONE SYNTHETIZER
//
function AOSynth( aoz, voice, options )
{
	this.aoz = aoz;
	this.sounds = this.aoz.sounds;
	this.voice = voice;
	this.className = 'aosynth';

	options = typeof options == 'undefined' ? {} : options;
	options.type = typeof options.type != 'undefined' ? options.type.toLowerCase() : 'square';
	if ( options.type != 'square' && options.type != 'sine' && options.type != 'triangle' && options.type != 'sawtooth' )
		options.type = 'square';

	this.vars = 
	{
		type: options.type,
		frequency: typeof options.frequency != 'undefined' ? options.frequency : 440,
		pan: typeof options.pan != 'undefined' ? options.pan : 0.0,
		muted: typeof options.muted != 'undefined' ? options.muted : false,
		volume: typeof options.volume != 'undefined' ? options.volume : ( this.aoz.platform == 'amiga' ? 64 : 1 ),
	};
	this.loopCounter = 0;

	this.oscillatorNode = new OscillatorNode( this.sounds.audioContext, { type: this.vars.type, frequency: this.vars.frequency } );
	this.pannerNode = new StereoPannerNode( this.sounds.audioContext, { pan: this.vars.pan } );
	this.gainNode = new GainNode( this.sounds.audioContext, { gain: this.vars.muted ? 0 : this.vars.volume * this.sounds.amigaToPCVolume } );
	this.oscillatorNode.connect( this.pannerNode );
	this.pannerNode.connect( this.gainNode );
	this.outputNode = this.gainNode;
	this.enveloppe = new AOEnveloppe( aoz, this, this.vars.volume );
	this.voice.connect( this );

	return this;
};
AOSynth.prototype.play = function( options )
{
	options = typeof options == 'undefined' ? {} : options;
	options.frequency = typeof options.frequency != 'undefined' ? options.frequency : this.vars.frequency;
	options.volume = typeof options.volume != 'undefined' ? options.volume : this.vars.volume;
	options.pan = typeof options.pan != 'undefined' ? options.pan : this.vars.pan;
	this.loopCounter = typeof options.loop == 'undefined' ? 1 : ( typeof options.loop <= 0 ? 0 : options.loop );

	this.stop();
	this.setPan( options.pan );
	this.setVolume( options.volume );
	this.oscillatorNode.frequency.value = options.frequency;
	this.start( typeof options.duration != 'undefined' ? options.duration * 1000 : undefined );	
	return true;
};
AOSynth.prototype.start = function( duration )
{
	this.enveloppe.start( duration );
};
AOSynth.prototype.stop = function( force )
{
	this.enveloppe.stop( force );
};
AOSynth.prototype.onEvent = function( response )
{
	if ( response == 'end' )
	{
		if ( this.playing )
		{
			this.oscillatorNode.stop();
			this.playing = false;
			this.voice.onEvent( 'end', this );
		}
	}
	else if ( response == 'start' )
	{
		if ( !this.playing )
		{
			this.oscillatorNode.start();
			this.playing = true;
			this.voice.onEvent( 'start', this );
		}
	}	
};
AOSynth.prototype.setPan = function( pan )
{
	this.vars.pan = pan;
	this.pannerNode.pan.value = pan;
};
AOSynth.prototype.mute = function( onOff )
{
	this.vars.muted = onOff;
	this.enveloppe.setVolume( onOff ? this.vars.volume * this.aoz.sounds.amigaToPCVolume : 0 ); 
};
AOSynth.prototype.setVolume = function( volume, rampTime, timeFromNow )
{
	this.vars.volume = volume;
	this.enveloppe.setVolume( this.vars.muted ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume ); 
};
AOSynth.prototype.setFrequency = function( frequency )
{
	this.vars.frequency = frequency;
	this.oscillatorNode.frequency.value = frequency;
};
AOSynth.prototype.jump = function( cueTime, duration )
{
};
AOSynth.prototype.pause = function( cueTime, duration )
{
};
AOSynth.prototype.isPlaying = function()
{
	return this.playing;
};
AOSynth.prototype.isLoaded = function()
{
	return true;
};
AOSynth.prototype.isPaused = function()
{
	return false;
};
AOSynth.prototype.isLooping = function()
{
	return false;
};


//
// ONE NOISE GENERATOR
//
function AONoise( aoz, voice, options )
{
	this.aoz = aoz;
	this.sounds = this.aoz.sounds;
	this.voice = voice;
	this.className = 'aonoise';

	options = typeof options == 'undefined' ? {} : options;
	options.type = typeof options.type != 'undefined' ? options.type.toLowerCase() : 'square';
	if ( options.type != 'white' && options.type != 'brown' && options.type != 'pink' )
		options.type = 'white';

	this.vars = 
	{
		type: options.type,
		frequency: typeof options.frequency != 'undefined' ? options.frequency : 440,
		pan: typeof options.pan != 'undefined' ? options.pan : 0.0,
		muted: typeof options.muted != 'undefined' ? options.muted : false,
		volume: typeof options.volume != 'undefined' ? options.volume : ( this.aoz.platform == 'amiga' ? 64 : 1 ),
	};
	this.loopCounter = 0;

	this.sourceNode = new AudioBufferSourceNode( this.sounds.audioContext, { buffer: this.sounds.noiseBuffers[ options.type ], loop: true } );
	this.pannerNode = new StereoPannerNode( this.sounds.audioContext, { pan: this.vars.pan } );
	this.gainNode = new GainNode( this.sounds.audioContext, { gain: this.vars.muted ? 0 : this.vars.volume * this.sounds.amigaToPCVolume } )
	this.sourceNode.connect( this.pannerNode );
	this.pannerNode.connect( this.gainNode );
	this.outputNode = this.gainNode;
	this.enveloppe = new AOEnveloppe( aoz, this, this.vars.volume );
	this.voice.connect( this );

	return this;
};
AONoise.prototype.play = function( options )
{
	options = typeof options == 'undefined' ? {} : options;
	options.frequency = typeof options.frequency != 'undefined' ? options.frequency : this.vars.frequency;
	options.volume = typeof options.volume != 'undefined' ? options.volume : this.vars.volume;
	options.pan = typeof options.pan != 'undefined' ? options.pan : this.vars.pan;
	options.duration = typeof options.duration != 'undefined' ? options.duration : 1;

	this.stop();
	this.setPan( options.pan );
	this.setVolume( options.volume );
	this.sourceNode.playbackRate.value = options.frequency / 440;
	this.start( options.duration );	
	return true;
};
AONoise.prototype.start = function( duration )
{
	this.enveloppe.start( duration );
};
AONoise.prototype.stop = function( force )
{
	this.enveloppe.stop( force );
};
AONoise.prototype.onEvent = function( response )
{
	if ( response == 'end' )
	{
		if ( this.playing )
		{
			this.sourceNode.stop();
			this.playing = false;
			this.voice.onEvent( 'end', this );
		}
	}
	else if ( response == 'start' )
	{
		if ( !this.playing )
		{
			this.sourceNode.start();
			this.playing = true;
			this.voice.onEvent( 'start', this );
		}
	}	
};
AONoise.prototype.setPan = function( pan )
{
	this.vars.pan = pan;
	this.pannerNode.pan.value = pan;
};
AONoise.prototype.mute = function( onOff )
{
	this.vars.muted = onOff;
	this.enveloppe.setVolume( onOff ? this.vars.volume * this.aoz.sounds.amigaToPCVolume : 0 ); 
};
AONoise.prototype.setVolume = function( volume, rampTime, timeFromNow )
{
	this.vars.volume = volume;
	this.enveloppe.setVolume( this.vars.muted ? 0 : this.vars.volume * this.aoz.sounds.amigaToPCVolume ); 
};
AONoise.prototype.setFrequency = function( frequency )
{
	this.vars.frequency = frequency;
	this.sourceNode.frequency.value = frequency / 440;
};
AONoise.prototype.jump = function( cueTime, duration )
{
};
AONoise.prototype.pause = function( cueTime, duration )
{
};
AONoise.prototype.isPlaying = function()
{
	return this.playing;
};
AONoise.prototype.isLoaded = function()
{
	return true;
};
AONoise.prototype.isPaused = function()
{
	return false;
};
AONoise.prototype.isLooping = function()
{
	return false;
};

//
// ENVELOPPES
//
function AOEnveloppe( aoz, sound, volume )
{
	this.aoz = aoz;
	this.sounds = aoz.sounds;
	this.sound = sound;
	this.volume = volume;
	this.level = 0;
	//this.shape = [ { level: 1, duration: 0 }, { level: 0.8, duration: 100 }, { level: 0.8, duration: 1000 }, { level: 0, duration: 500 } ];
}
AOEnveloppe.prototype.setADSR = function( attack, attackDuration, decay, decayDuration, sustain, sustainDuration, release, releaseDuration )
{
	this.stop();
};
AOEnveloppe.prototype.setVolume = function( volume )
{
	this.volume = volume;
	this.sound.gainNode.gain.value = this.volume * this.level;
};
AOEnveloppe.prototype.stop = function( force )
{
	var done = force;
	if ( this.handleInterval )
	{
		clearInterval( this.handleInterval );
		this.handleInterval = null;
		done = true;
	}
	if ( this.handleTimeout )
	{
		clearTimeout( this.handleTimeout );
		this.handleTimeout = null;
		done = true;
	}
	if ( done )
		this.sound.onEvent( 'end' );
};
AOEnveloppe.prototype.start = function( playDuration )
{
	var self = this;
	if ( this.sounds.enveloppes[ this.sound.voice.index ] )
	{
		var shape = this.sounds.enveloppes[ this.sound.voice.index ].shape;
		if ( shape.length >= 1 )
		{
			var step = -1;
			this.level = 0;
			var duration = 0;
			this.sound.gainNode.gain.value = this.volume * this.level;
			this.handleInterval = setInterval( function()
			{
				duration--;
				if ( duration <= 0 )
				{
					do
					{
						step++;
						if ( step >= shape.length )
						{
							self.stop();
							return;
						}
						if ( shape[ step ].duration == 0 )	
						{
							self.level = shape[ step ].level;
							self.sound.gainNode.gain.value = self.volume * self.level;
							continue;
						}
						else 
						{
							duration = shape[ step ].duration / 50;
							deltaPlus = ( shape[ step ].level - self.level ) / duration;
							break;
						}
					} while( true );
				}
				self.level = Math.max( 0, self.level + deltaPlus );
				self.sound.gainNode.gain.value = self.volume * self.level;
			}, 20 );
		}
	}
	else
	{
		this.level = 1;
		this.sound.gainNode.gain.value = this.volume * this.level;
	}
	if ( playDuration )
	{
		this.handleTimeout = setTimeout( function()
		{
			self.stop();
		}, Math.max( 20, playDuration ) );
	}
	this.sound.onEvent( 'start' );
}


//
// ONE FILTER
//
function AOFilter( aoz, type )
{
	this.aoz = aoz;
	this.sounds = this.aoz.sounds;
	this.className = 'aofilter';
	this.vars = { type: type };
	switch ( type )
	{
		case 'reverb':
			this.outputNode = new ConvolverNode( this.sounds.audioContext, { disableNormalization: false } );
			break;
		case 'lowpass':
		case 'highpass':
		case 'bandpass':
		case 'lowshelf':
		case 'highshelf':
		case 'peaking':
		case 'notch':
		case 'allpass':
			break;
		case 'distort':		
			this.outputNode = new WaveShaperNode( this.sounds.audioContext );	
			break;														
		default:
			throw { error: 'illegal_function_call', parameter: this.vars.type };		
	}
};
AOFilter.prototype.setOptions = function( options )
{
	switch ( this.vars.type )
	{
		case 'reverb':
			this.vars.seconds = typeof options.seconds == 'undefined' ? 1 : options.seconds;
			this.vars.decay = typeof options.decayRate == 'undefined' ? 0.2 : options.decay;
			this.vars.reverse = typeof options.reverse == 'undefined' ? false : options.reverse;
		
			var rate = this.sounds.audioContext.sampleRate;
			var length = rate * this.vars.seconds;
			var decay = this.vars.decay;
			var buffer = this.sounds.audioContext.createBuffer( 2, length, rate );
			var bufferL = buffer.getChannelData( 0 );
			var bufferR = buffer.getChannelData( 1 );
		
			var n, i;	
			for ( i = 0; i < length; i++ ) 
			{
				n = this.vars.reverse ? length - i : i;
				bufferL[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - n / length, decay );
				bufferR[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - n / length, decay );
			}
			this.outputNode.buffer = buffer;
			break;
		case 'distort':
			this.vars.amount = ( typeof options.amount == 'undefined' ? 50 : options.amount );
			var k = this.vars.amount;
			var n_samples = 44100;
			var curve = new Float32Array( n_samples );
			var deg = Math.PI / 180;
			var i = 0;
			var x;
		  	for ( ; i < n_samples; ++i ) 
			{
				x = i * 2 / n_samples - 1;
				curve[ i ] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
		  	}
		  	this.outputNode.curve = curve;
			break;
	}
};
AOFilter.types = 
[
	'reverb',
	'lowpass',
	'highpass',
	'bandpass',
	'lowshelf',
	'highshelf',
	'peaking',
	'notch',
	'allpass',
	'distort'
];
AOFilter.prototype.checkType = function( type )
{
	for ( var t = 0; t < AOFilter.types.length; t++ )
	{
		if ( type.toLowerCase() == AOFilter.types[ t ] )
			return true;
	}
	return false;
};

