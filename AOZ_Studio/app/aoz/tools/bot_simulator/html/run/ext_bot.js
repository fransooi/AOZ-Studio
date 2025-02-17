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
// The Bot Extension
// By Francois Lionet
// Version 1.00
// 08/09/2022
// (c) AOZ Studio 2019-2022
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_bot( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIEJvdCBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxLjAwIiwiZGF0ZSI6IjA4LzA5LzIwMjIiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDE5LTIwMjIiLCJzdGFydCI6ImJvdC5hb3oiLCJuYW1lIjoiYm90In0sImZvbnRzIjp7Imxpc3RGb250cyI6IlBDIiwiYW1pZ2EiOltdLCJnb29nbGUiOlsiUm9ib3RvIl19LCJjb21waWxhdGlvbiI6eyJub1dhcm5pbmciOltdLCJlcnJvcnMiOnsiZW4iOlsiaWxsZWdhbF9wYXJhbWV0ZXI6IElsbGVnYWwgcGFyYW1ldGVyICglMSkiLCJiYWRfbWFnaWM6IElsbGVnYWwgY29ubmVjdGlvbiBjb2RlICglMSkiLCJjb25uZWN0aW9uX25vdF9vcGVuOiBDb25uZWN0aW9uIG5vdCBvcGVuZWQiLCJhcGlfYWxyZWFkeV9vcGVuOiBBUEkgYWxyZWFkeSBvcGVuIiwiYXBpX25vdF9vcGVuZWQ6IEFQSSBub3Qgb3BlbmVkIiwiYXBpX25vdF9kZWZpbmVkOiBBUEkgbm90IGRlZmluZWQiLCJ1bmtub3duX2NvbW1hbmQ6IFVua25vd24gY29tbWFuZCIsInNlcnZlcl9jcmFzaDogQ29tcGFuaW9uIHNlcnZlciBjcmFzaCIsImN5YmVycGlfbm90X2Nvbm5lY3RlZDogQm90IG5vdCBjb25uZWN0ZWQiLCJtYm90X25vdF9jb25uZWN0ZWQ6IEJvdCBub3QgY29ubmVjdGVkIiwiYm90X2Rpc3BsYXlfYWxyZWFkeV9leGlzdHM6IEJvdCBkaXNwbGF5IGFscmVhZHkgZXhpc3RzIl0sImZyIjpbImlsbGVnYWxfcGFyYW1ldGVyOiBQYXJhbWV0cmUgaWxsZWdhbCAoJTEpIiwiYmFkX21hZ2ljOiBQYXJhbWV0cmUgZGUgY29ubmVjdGlvbiBpbGxlZ2FsICglMSkiLCJjb25uZWN0aW9uX25vdF9vcGVuOiBDb25uZWN0aW9uIG5vbiBvdXZlcnRlIiwiYXBpX2FscmVhZHlfb3BlbjogQVBJIGRlamEgb3V2ZXJ0ZSIsImFwaV9ub3RfZGVmaW5lZDogQVBJIG5vbiBkZWZpbmllIiwiYXBpX25vdF9vcGVuZWQ6IEwnQVBJIG4nZXN0IHBhcyBvdXZlcnRlICglMSkiLCJ1bmtub3duX2NvbW1hbmQ6IENvbW1hbmRlIGluY29ubnVlIiwic2VydmVyX2NyYXNoOiBDcmFzaCBDb21wYW5pb24gc2VydmVyIiwiY3liZXJwaV9ub3RfY29ubmVjdGVkOiBCb3Qgbm9uIGNvbm5lY3RlIiwibWJvdF9ub3RfY29ubmVjdGVkOiBNQm90IG5vbiBjb25uZWN0ZSIsImJvdF9kaXNwbGF5X2FscmVhZHlfZXhpc3RzOiBDZXQgYWZmaWNoYWdlIGV4aXN0ZSBkZWphIl19LCJpbmNsdWRlUGF0aHMiOltdfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_bot';
	this.aoz[ "extension" + "Bot"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/bot/bot.aoz
		aoz.sourcePos="0:32:0";
		// Javascript
		this.error = undefined;
		this.status = { mbot: 'disconnected', cyberpi: 'disconnected' };
		this.waiting = false;
		this.botDisplay = null;
		this.bots = [];
		this.connect = function( args )
		{
			var self = this;
			if ( this.bots[ args.index ] )
				bot = this.bots[ args.index ];
			else 
			{
			var bot = 
			{
				status: 'disconnected',
				screenOnly: args.screenOnly,
				interpreter: null,
				}
			this.bots[ args.index ] = bot;
			this.waiting = false;
			}
			if ( !args.screenOnly )
			{
				this.waiting = true;
				bot.screenOnly = false;
			this.aoz.extensionCompanion.directConnect( 'aoz', function( response, data, extra )
			{
				if ( response )
				{
					var count = args.names.length;
					for ( var n = 0; n < args.names.length; n++ )
					{
						var name = args.names[ n ];
						if ( self.status[ name ] != 'connected' )
						{
							self.aoz.extensionCompanion.directOpenAPI( name, function( response, data, extra ) 
							{
								count--;
								if ( count == 0 )
									{
									self.waiting = false;
										bot.status = 'connected';
									}
							}, { toOpen: name } )
						}
						else
						{
							count--;
							if ( count == 0 )
								self.waiting = false;
						}
					}
				}
				else
				{
					self.error = 'companion_server_not_running';
						bot.screenOnly = true;
				}
			}, {} );
			}
		};
		this.isConnected = function( index )
		{
			var bot = this.bots[ index ];
			if ( bot )
				return !bot.screenOnly;
			return false;
		}
		this.idle = function( index )
		{
			var bot = this.bots[ index ];
			if ( bot )
			{
				var idle = true;
				if ( !bot.screenOnly )
					idle &= ( !bot.executing );
				if ( bot.interpreter )
					idle &= ( !bot.interpreting );
				return idle;
			}
			return false;
		}
		this.callAPI = function( args )
		{
			var bot = this.bots[ args.name ];
			if ( !bot )
				throw { error: 'bot_not_connected', parameter: index };
			var command = args.command1 + ' ';
			var commandText = 'Bot ' + args.command1 + ' '; 
			if ( args.command2 && args.command2 != '' )
			{
				command += args.command2 + ' ';
				commandText += args.command2 + '';
			}
			if ( args.type == 'function' )
			{
				command += '(';
				commandText += '(';
			}
			commandText += ' "' + args.name + '", ';
			var isArg = false;
			if ( typeof args.p1 != 'undefined' )
			{
				isArg = true;
				command += args.p1 + ' ';
				if ( typeof args.p1 == 'string' )
					commandText += ' "' + args.p1 + '",';
				else
					commandText += ' ' + args.p1 + ',';
			}
			if ( typeof args.p2 != 'undefined' )
			{
				isArg = true;
				command += args.p2 + ' ';
				if ( typeof args.p2 == 'string' )
					commandText += ' "' + args.p2 + '",';
				else
					commandText += ' ' + args.p2 + ',';
			}
			if ( typeof args.p3 != 'undefined' )
			{
				isArg = true;
				command += args.p3 + ' ';
				if ( typeof args.p3 == 'string' )
					commandText += ' "' + args.p3 + '",';
				else
					commandText += ' ' + args.p3 + ',';
			}
			if ( typeof args.p4 != 'undefined' )
			{
				isArg = true;
				command += args.p4;
				if ( typeof args.p4 == 'string' )
					commandText += ' "' + args.p4 + '",';
				else
					commandText += ' ' + args.p4 + ',';
			}
			if ( isArg )
				commandText = commandText.substring( 0, commandText.length - 1 );
			if ( args.type == 'function' )
			{
				command += ')';
				commandText += ')';
			}
			if ( !bot.screenOnly )
			{
				if ( bot.status != 'connected' )
					throw { error: 'bot_not_connected' }
				this.waiting = true;
			var self = this;
				bot.executing = true;
			this.aoz.extensionCompanion.directCallAPI( args.name, command, function( response, data, extra )
			{
					bot.executing = false;
				if ( response )
					self.result = data;
				else
					self.error = { error: data.error, parameter: data.parameter };
				self.waiting = false;
			}, {} );
			}
			if ( bot.interpreter )
			{
				args.commandText = commandText;
				var result = bot.interpreter( bot, args );
				if ( !bot.screenOnly )
					this.result = result;
			}
		};
		this.disconnect = function( args )
		{
			var count = args.indexes.length;
			for ( var n = 0; n < args.indexes.length; n++ )
			{
				var index = args.indexes[ n ];
				var bot = this.bots[ index ];
				if ( bot && bot.status == 'connected' )
				{
					this.aoz.extensionCompanion.directCloseAPI( name, function( response, data, extra )
					{
						bot.status = 'disconnected';
						count--;
						if ( count == 0 )
							self.bots[ extra.index ] = null;
					}, { index: index, toClose: name } );
				}
			}
		};
		this.wait = function()
		{
			if ( error = this.error )
			{
				this.waiting = false;
				this.error = null;
				throw error;
			}
			return !this.waiting;
		}
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
