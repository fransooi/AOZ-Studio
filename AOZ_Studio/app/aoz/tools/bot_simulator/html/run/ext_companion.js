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
// The Companion Extension
// By Francois Lionet
// Version 1.00
// 09/10/2021
// (c) AOZ Studio 2019-2021
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_companion( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIENvbXBhbmlvbiBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxLjAwIiwiZGF0ZSI6IjA5LzEwLzIwMjEiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDE5LTIwMjEiLCJzdGFydCI6ImNvbXBhbmlvbi5hb3oiLCJuYW1lIjoiY29tcGFuaW9uIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6WyJjb21wYW5pb25fc2VydmVyX25vdF9ydW5uaW5nOiBQbGVhc2UgbGF1bmNoIHRoZSBBb3ogQ29tcGFuaW9uIHNlcnZlciAocHl0aG9uKSBmaXJzdCIsImNvbXBhbmlvbl9ub3RfY29ubmVjdGVkOiBBb3ogQ29tcGFuaW9uIHNlcnZlciBub3QgY29ubmVjdGVkIiwiY29tcGFuaW9uX0FQSV9ub3Rfb3BlbjogQVBJIG5vdCBvcGVuIG9uIENvbXBhbmlvbiBzZXJ2ZXIgKG5hbWU6ICUxKSIsImNvbXBhbmlvbl9BUElfYWxyZWFkeV9vcGVuOiBBUEkgYWxyZWFkeSBvcGVuIG9uIENvbXBhbmlvbiBzZXJ2ZXIgKG5hbWU6ICUxKSJdLCJmciI6WyJjb21wYW5pb25fc2VydmVyX25vdF9ydW5uaW5nOiBWZXVpbGxleiBsYW5jZXIgbGUgc2VydmVyIEFveiBDb21wYW5pb24gKHB5dGhvbikgZW4gcHJlbWllci4iLCJjb21wYW5pb25fbm90X2Nvbm5lY3RlZDogTGUgc2VydmVyIEFveiBuJ2VzdCBwYXMgY29ubmVjdGUiLCJjb21wYW5pb25fQVBJX25vdF9vcGVuOiBBUEkgbm9uIG91dmVydGUgc3VyIGxlIHNlcnZldXIgQW96IChub206ICUxKSIsImNvbXBhbmlvbl9BUElfYWxyZWFkeV9vcGVuOiBBUEkgZGVqYSBvdXZlcnRlIHN1ciBsZSBzZXJ2ZXVyIEFveiAobmFtZTogJTEpIl19LCJpbmNsdWRlUGF0aHMiOltdfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_companion';
	this.aoz[ "extension" + "Companion"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/companion/companion.aoz
		aoz.sourcePos="0:31:0";
		// Javascript
		this.error = undefined;
		this.status = 'disconnected';
		this.magic = '...';
		this.waiting = false;
		this.messageIds = 0;
		this.onErrorProc = null;
		this.onResponseProc = null;
		this.openAPIs = {};
		this.callbacks = {};
		this.callbackCounter = 0;
		this.url = "ws://localhost:8765";
		this.debugEvents = this.aoz.getDebugEvents( this );
		var self = this;
		this.connect = function( args, extra )
		{
			if ( this.status == 'connected' )
				throw { error: 'companion_already_connected' }
			extra = ( typeof extra == 'undefined' ? {} : extra );
			this.onResponseProc = args.onResponse;
			this.onErrorProc = args.onError;
			var self = this;
			this.launchServer( args, function( response, data, extra )
			{
				if ( !response )
				{
					self.error = { error: 'companion_server_not_running' };
					if ( self.errorCallback )
					{
						var callback = self.callbacks[ self.errorCallback ];
						if ( callback )
						{
							self.errorCallback = null;
							self.callbacks[ self.errorCallback ] = null;
							callback( false, 'companion_server_not_running', '' );
						}
					}
				}
				else
				{
					self.connectExtra = extra;
					self.webSocket = new aoz.ext_websocket.WebSocket( self.aoz, self.url );
					self.webSocket.addCallback( 'onopen', self, self.onOpen );
					self.webSocket.addCallback( 'onmessage', self, self.onMessage );
					self.webSocket.addCallback( 'onerror', self, self.onError );
					self.webSocket.addCallback( 'onclose', self, self.onClose );
				}
			}, extra );
		};
		this.launchServer = function( args, callback, extra )
		{
			var self = this;
			var handle = setInterval( function()
			{
				if ( self.debugEvents.isConnected() )
			{
					clearInterval( handle );
					var message = 
				{
						module: 'companion',
						method: 'launchCompanionServer',
						options: { lang: 'python' }
					};
					self.debugEvents.sendMessage( message, function( response, data )
					{
						if ( response )
							self.serverRunning = true;
							callback( response, data, extra );
					} );
				}
			} );
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
		this.sendMessage = function( message, extra )
				{
			message.id = this.messageIds++;
			message.extra = typeof extra == 'undefined' ? '{}' : extra;
			message.handle = this.handle;
			this.error = undefined;
			this.waiting = true;
			console.log( 'Sending message: ', message );
			console.log( message.parameters );
			console.log( message.extra );
			this.webSocket.sendMessage( JSON.stringify( message ) );
		}
		this.registerCallback = function( name, callback )
		{
			var id = name + '_' + this.callbackCounter++;
			this.callbacks[ id ] = callback; 
			return id;
		}
		this.callProc = function( name, response, parameter )
		{
			if ( parameter && parameter.callback )
			{
				var callback = this.callbacks[ parameter.callback ];
				if ( callback )
			{
					this.callbacks[ parameter.callback ] = null;
					callback( true, parameter.result, parameter );
				}
			}
			else if ( name && name != '' )
			{
				if ( parameter )
					parameter = parameter.result;
				parameter = typeof parameter == 'undefined' ? '' : parameter;
				this.aoz.runProcedure( name, { response$: response, parameter$: parameter } );
			}
		}
		this.onOpen = function()
		{
			var message = { command: 'connect', parameters: { name: 'aoz', magic: self.magic } };
			this.sendMessage( message, this.connectExtra );
		};
		this.onMessage = function( timeStamp, event )
			{
			var message;
			try
		{
				message = JSON.parse( event.data );
			}
			catch ( e )
			{
			}
			if ( message )
			{
				if ( !message.response )
				{
					if ( this.onErrorProc && this.onErrorProc != '' )
						this.aoz.runProcedure( this.onErrorProc, { error$: message.error, parameter$: message.parameter } );
					if ( message.extra.callback )
					{
						var callback = this.callbacks[ message.extra.callback ];
						if ( callback )
					{
							this.callbacks[ message.extra.callback ] = null;
							callback( false, { error: message.error, parameter: message.parameter }, message.extra );
						}
					}
		}
					else
		{
					switch ( message.responseTo )
					{
						case 'connect':
							this.handle = message.handle;
							this.sendMessage( { command: 'security', parameters: { key: message.key } } , message.extra );
							break;
						case 'security':
							this.status = 'connected';
							this.callProc( this.onResponseProc, "connected", message.extra );
							this.waiting = false;
							break;
						case 'disconnect':
							this.status = 'disconnected';
							this.callProc( this.onResponseProc, "disconnected", { } );
							this.waiting = false;
					break;
				case 'openAPI':
							this.openAPIs[ message.extra.api ].open = true;
						this.callProc( this.onResponseProc, 'api_opened', message.extra );
							this.waiting = false;
					break;
				case 'closeAPI':
							this.openAPIs[ message.extra.api ].open = false;
					this.callProc( this.onResponseProc, 'api_closed', message.extra );
							this.waiting = false;
					break;
				case 'callAPI':
						this.result = message.result;
							message.extra.result = message.result;
							this.callProc( this.onResponseProc, 'api_call', message.extra );
					this.waiting = false;
					break;
			}
		}
			}
		}
		this.onError = function( response, data, extra )
		{
			debugger;
			this.waiting = false;
			if ( this.onErrorProc )
				this.aoz.runProcedure( this.onErrorProc, { error$: response, parameter$: data } );
			else
				this.error = 'companion_server_not_running';
			if ( this.errorCallback )
			{
				var callback = this.callbacks[ this.errorCallback ];
				if ( callback )
				{
					this.errorCallback = null;
					this.callbacks[ this.errorCallback ] = null;
					callback( false, data, '' );
				}
			}
		}
		this.onClose = function()
		{
			debugger;
		};
		this.disconnect = function( index )
		{
			if ( this.status == 'connected' )
			{
				this.sendMessage( { command: 'disconnect' }, { } );
			}
		};
		this.openAPI = function( args )
		{
			args.name = args.name.toLowerCase();
			if ( this.status != 'connected' )
				throw { error: 'companion_not_connected' }
			var api = this.openAPIs[ args.name ];
			if ( api )
				throw { error: 'companion_API_already_open' }
			this.openAPIs[ args.name ] =
			{
				name: args.name,
				open: false
			};
			this.sendMessage( { command: 'openAPI', parameters: { name: args.name } }, { api: args.name } );
		};
		this.closeAPI = function( args )
		{
			args.name = args.name.toLowerCase();
			if ( this.status != 'connected' )
				throw { error: 'companion_not_connected' };
			if ( !this.openAPIs[ args.name ] )
				throw { error: 'companion_API_not_open', parameter: args.name };
			this.sendMessage( { command: 'closeAPI', parameters: { name: args.name } }, { api: args.name } );
		};
		this.callAPI = function( args )
		{
			args.name = args.name.toLowerCase();
			if ( this.status != 'connected' )
				throw { error: 'companion_not_connected' };
			if ( !this.openAPIs[ args.name ] )
				throw { error: 'companion_API_not_open', parameter: args.index };
			this.sendMessage( { command: 'callAPI', parameters: { name: args.name, command: args.command } }, { api: args.name } );
		};
		this.directConnect = function( name, callback, extra )
		{
			extra = typeof extra == 'undefined' ? {} : extra;
			extra.callback = this.registerCallback( name, callback );
			extra.api = name;
			this.errorCallback = extra.callback;
			this.errorParameter = name;
			if ( this.status != 'connected' )
			{
				this.connect( { onResponse: this.onResponseProc, onError: this.onErrorProc }, extra );
			}
			else
			{
				callback( true, {}, extra );
			}
		};
		this.directOpenAPI = function( apiName, callback, extra )
		{
			if ( this.status != 'connected' )
				throw { error: 'companion_not_connected' };
			extra = typeof extra == 'undefined' ? {} : extra;
			extra.callback = this.registerCallback( apiName, callback );
			extra.api = apiName;
			if ( !this.openAPIs[ apiName ] )
			{
				this.openAPIs[ apiName ] =
				{
					name: apiName,
					open: false
				};
				this.sendMessage( { command: 'openAPI', parameters: { name: apiName } }, extra );			
			}
			else
			{
				callback( true, {}, extra );
			}
		};
		this.directCloseAPI = function( name, callback, extra )
		{
			if ( this.status == 'connected' )
			{
				if ( this.openAPIs[ name ] )
				{
					extra = typeof extra == 'undefined' ? {} : extra;
					extra.callback = this.registerCallback( name, callback );
					extra.api = name;
					this.sendMessage( { command: 'closeAPI', parameters: { name: name } }, extra );
				}
			}
		};
		this.directCallAPI = function( apiName, command, callback, extra )
		{
			if ( this.status != 'connected' )
				throw { error: 'companion_not_connected' };
			if ( !this.openAPIs[ apiName ] )
				throw { error: 'companion_API_not_open', parameter: apiName };
			extra = typeof extra == 'undefined' ? {} : extra;
			extra.callback = this.registerCallback( apiName, callback );
			extra.api = apiName;
			this.sendMessage( { command: 'callAPI', parameters: { name: apiName, command: command } }, extra );
		};
		this.closeAtEnd = function()
		{
			if ( this.status == 'connected' )
				this.sendMessage( { command: 'disconnect' } );
		}
		this.aoz.callAtEndOfApplication( this, this.closeAtEnd );
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
