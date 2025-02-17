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
// The WebSocket Extension
// By Francois Lionet
// Version 1
// 01/06/2020
// (c) AOZ Studio 2020 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_websocket( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFdlYlNvY2tldCBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxIiwiZGF0ZSI6IjAxLzA2LzIwMjAiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDIwIC0gT3BlbiBTb3VyY2UiLCJzdGFydCI6IndlYnNvY2tldC5hb3oiLCJuYW1lIjoid2Vic29ja2V0In0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6WyJ3ZWJzb2NrZXRfY2hhbm5lbF9ub3RfZGVmaW5lZDpcdFx0XHRcdFdlYlNvY2tldCBjaGFubmVsIG5vdCBkZWZpbmVkICglMSkiLCJ3ZWJzb2NrZXRfZXJyb3I6IFx0XHRcdFx0XHRcdFx0V2ViU29ja2V0IGVycm9yOiAlMSIsIndlYnNvY2tldF9jb25uZXhpb25fZGllZDpcdFx0XHRcdFx0V2ViU29ja2V0IGNvbm5leGlvbiBkaWVkICglMSkiLCJ3ZWJzb2NrZXRfaW5jb3JyZWN0X3VybDogXHRcdFx0XHRcdFdlYlNvY2tldCBVUkxzIG11c3QgYmVnaW4gd2l0aCB3czovLyJdLCJmciI6WyJ3ZWJzb2NrZXRfY2hhbm5lbF9ub3RfZGVmaW5lZDpcdFx0XHRcdFdlYlNvY2tldCBjaGFubmVsIG5vdCBkZWZpbmVkICglMSkiLCJ3ZWJzb2NrZXRfZXJyb3I6IFx0XHRcdFx0XHRcdFx0V2ViU29ja2V0IGVycm9yOiAlMSIsIndlYnNvY2tldF9jb25uZXhpb25fZGllZDpcdFx0XHRcdFx0V2ViU29ja2V0IGNvbm5leGlvbiBkaWVkICglMSkiLCJ3ZWJzb2NrZXRfaW5jb3JyZWN0X3VybDogXHRcdFx0XHRcdFdlYlNvY2tldCBVUkxzIG11c3QgYmVnaW4gd2l0aCB3czovLyJdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_websocket';
	this.aoz[ "extension" + "Websocket"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/websocket/websocket.aoz
		aoz.sourcePos="0:38:0";
		// Javascript
		this.context = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: false } );
		this.WebSocket = function( aoz, url, protocol, tags )
		{
			this.aoz = aoz;
			this.url = url;
			this.protocol = protocol;
			this.tags = tags;
			this.newMessages = [];
			this.newErrors = [];
			this.error = undefined;
			this.connected = false;
			this.displayErrors = true;
			this.maximumMessageLength = 2 * 1012;
			this.logInEvents = [];
			this.logOutEvents = [];
			this.logInEventsON = true;
			this.logOutEventsON = true;
			this.logEventsMax = 100;
			this.callbacks =
			{
				onopen: [],
				onmessage: [],
				onclose: [],
				onerror: [],
			}
			if ( url.substring( 0, 5 ).toLowerCase() != 'ws://' && url.substring( 0, 6 ).toLowerCase() != 'wss://' )
				throw { error: "websocket_incorrect_url", parameter: url };
			var self = this;
			this.webSocket = new WebSocket( url, protocol );
			this.webSocket.aoz = this.aoz;
			this.webSocket.addEventListener( 'open', function( event )
			{
				console.log( 'Websocket open: ', event );
				self.connected = true;
				self.logInEvent( event );
				self.logOutEvent( event );
				self.callCallbacks( 'onopen', true, event );
			} );
			this.webSocket.onclose = function( event )
			{
				console.log( 'Websocket closed: ', event );
				self.connected = false;
				if ( !self.theEnd )
				{
					if ( !event.wasClean )
					{
						var newError = { error: 'websocket_connexion_died', parameter: event.reason + ' (code returned: ' + event.code + ')' };
						self.newErrors.push( newError );
						if ( self.displayErrors )
							self.aoz.popupError = newError;
						self.callCallbacks( 'onclose', false, { error: newError, event: event } );
					}
					else
					{
						self.callCallbacks( 'onclose', true, { event: event } );
					}
					self.logInEvent( event );
					self.logOutEvent( event );
				}
			};
			this.webSocket.onerror = function( event )
			{
				console.log( 'Websocket error: ', event );
				if ( !self.theEnd )
				{
					var newError = { error: 'websocket_error', parameter: event.message + ' (code returned: ' + event.code + ')' };
					self.newErrors.push( newError );
					if ( self.displayErrors )
						self.aoz.popupError = newError;
					self.logInEvent( event );
					self.logOutEvent( event );
					self.callCallbacks( 'onerror', false, { error: newError, event: event } );
				}
			};
			this.webSocket.onmessage = function( event )
			{
				console.log( 'Websocket received: ' + event.data, event );
				var timeStamp = new Date().getTime();
				self.newMessages.push( event );
				self.logInEvent( event );
				self.callCallbacks( 'onmessage', timeStamp, event );
			}
			this.aoz.callAtEndOfApplication( this, function()
			{
				this.theEnd = true;
				this.webSocket.close();
			} );
		};
		this.WebSocket.prototype.close = function()
		{
			this.webSocket.close();
		}
		this.WebSocket.prototype.sendMessage = function( message, throwError, tags )
		{
			if ( typeof message != 'string' )
			{
				message = 'json:' + JSON.stringify( message );
			}
			this.webSocket.send( message );
			this.logOutEvent( message );
		};
		this.WebSocket.prototype.addCallback = function( type, yourself, callback, extra )
		{
			if ( typeof this.callbacks[ type ] != 'undefined' )
			{
				var identifier = this.aoz.utilities.getUniqueIdentifier( 'websocket' );
				this.callbacks[ type ].push( { identifier: identifier, self: yourself, callback: callback, extra: extra } );
				return identifier;
			}
			return null;
		};
		this.WebSocket.prototype.removeCallback = function( identifier )
		{
			for ( var c in this.callbacks )
			{
				for ( var cc = 0; cc < this.callbacks.length; cc++ )
				{
					if ( this.callbacks[ cc ].identifier )
					{
						this.callbacks = this.utilities.cleanObject( this.callbacks, this.callbacks[ cc ] );
					}
					return true;
				}
			}
			return false;
		};
		this.WebSocket.prototype.callCallbacks = function( type, response, data )
		{
			if ( this.callbacks[ type ] )
			{
				var callbacks = this.callbacks[ type ];
				for ( var cc = 0; cc < callbacks.length; cc++ )
				{
					callbacks[ cc ].callback.call( callbacks[ cc ].self, response, data, callbacks[ cc ].extra );
				}
			}
		};
		this.WebSocket.prototype.logOutEvent = function( event )
		{
			if ( this.logOutEventsON )
			{
				var time = new Date().getTime();
				this.pushToLog( { event: event, timeStamp: time }, this.logOutEvents );
			}
		};
		this.WebSocket.prototype.logInEvent = function( event )
		{
			if ( this.logInEventsON )
			{
				var time = new Date().getTime();
				this.pushToLog( { event: event, timeStamp: time }, this.logInEvents );
			}
		};
		this.WebSocket.prototype.pushToLog = function( message, log )
		{
			if ( log.length == this.logEventsMax )
				{
				for ( var l = 0; l <= this.logEventsMax - 1; l++ )
					log[ l ] = log[ l + 1 ];		
				log[ this.logEventsMax - 1 ] = message;
				}
			else
			{
				log.push( message );
			}
		};
		this.WebSocket.prototype.isConnected = function()
		{
			return this.connected;
		};
		this.WebSocket.prototype.isMessage = function( tags )
		{
			return this.newMessages.length != 0;
		};
		this.WebSocket.prototype.getMessage = function( tags )
		{
			if ( this.newMessages.length )
			{
				var event = this.newMessages.pop();
				return event.data;
			}
			return undefined;
		};
		this.WebSocket.prototype.isError = function( tags )
		{
			return this.newErrors.length != 0;
		};
		this.WebSocket.prototype.getError = function( tags )
		{
			if ( this.newErrors.length )
			{
				var event = this.newErrors.pop();
				return event.message;
			}
			return undefined;
		};
		   this.wait = function()
		{
			if ( this.load_done )
			{
				if ( this.error )
					throw this.error;
				this.aoz.waiting = null;
			}
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
