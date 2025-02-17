/*@****************************************************************************
*
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
*
****************************************************************************@*/
//
// The Sound Instructions
// By Francois Lionet
// Version 0.99
// 24/10/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_sounds( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFNvdW5kIEluc3RydWN0aW9ucyIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDAuOTkiLCJkYXRlIjoiMjQvMTAvMjAxOSIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTkiLCJzdGFydCI6InNvdW5kcy5hb3oiLCJuYW1lIjoic291bmRzIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6W10sImZyIjpbXX0sImluY2x1ZGVQYXRocyI6W119LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJlcnJvcnMiOnt9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_sounds';
	this.aoz[ "module" + "Sounds" ]=this;
	this.aoz.finalWait++;
		this.aoz.useSounds=true;


this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:34:0";
		// Javascript
		this.aoz.moduleSounds = this;
		this.banks = this.aoz.banks;
		this.soundBank = this.banks.soundBank;
		this.utilities = this.aoz.utilities;
		this.play_done = false;
		this.samLoop = function( onOff, voices )
		{
			if ( typeof voices == 'undefined' )
				this.aoz.sounds.samLoop( onOff );
			else
				this.aoz.sounds.callVoices( 'samLoop', voices, onOff );
		};
		this.play = function( args )
		{
			this.play_done = true;
			this.aoz.sounds.callVoices( 'play', args.voices, [ args.index, { rate: args.rate, type: args.type, loop: args.loop, frequency: args.frequency } ] );
		};
		this.playNote = function( args )
		{
			this.play_done = false;
			var args2 = args.slice( 1 )
			var options = args2[ 1 ];
			options.duration = typeof options.duration == 'undefined' ? 0 : options.duration;
			if ( options.duration > 0 )
			{
			if ( this.aoz.platform == 'amiga' )         // If Amiga, time in 1/50th of seconds
				options.duration /= 50;
				var self = this;
					options.callback = function( response, data, extra )
					{
						if ( response == 'end' )
							self.play_done = true;
					};
				}
				else
				{
				this.play_done = true;
			}
			this.aoz.sounds.callVoices( 'playNote', args[ 0 ], args2 );
		};
		this.play_wait = function()
		{
			return this.play_done;
		};
		this.setWave = function( index, buffer )
		{
			var self = this;
			if ( buffer && typeof buffer != 'string' )
			{
				if ( !buffer.dimensions )
				throw { error: 'syntax_error' };
				buffer = this.aoz.getVarptr( buffer )[ buffer.name ];
			}
			this.aoz.sounds.addWave( index, undefined, buffer )
		};
		this.delWave = function( index )
		{
			this.aoz.sounds.delWave( index );
		};
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
