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
// The IDE Extension
// By Francois Lionet and Phil Bell
// Version 1
// 22/05/2020
// (c) AOZ Studio 2020 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function ext_IDE( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIElERSBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQgYW5kIFBoaWwgQmVsbCIsInZlcnNpb24iOiJWZXJzaW9uIDEiLCJkYXRlIjoiMjIvMDUvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMjAgLSBPcGVuIFNvdXJjZSIsInN0YXJ0IjoiSURFLmFveiIsIm5hbWUiOiJpZGUifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbIm5vdF9ydW5uaW5nX2luX2lkZTogXHRcdFx0XHRZb3VyIGFwcGxpY2F0aW9uIGlzIG5vdCBydW5uaW5nIHVuZGVyIHRoZSBBT1ogRWRpdG9yIl0sImZyIjpbIm5vdF9ydW5uaW5nX2luX2lkZTogXHRcdFx0XHRWb3RyZSBhcHBsaWNhdGlvbiBuJ2VzdCBwYXMgZW4gdHJhaW4gZGUgZm9uY3Rpb25uZXIgc291cyBBT1ogU3R1ZGlvIl19LCJiYXNpY1JlbWFya3MiOmZhbHNlLCJkaXNwbGF5RW5kQWxlcnQiOmZhbHNlLCJ1c2VBc3NldHNSZXNvdXJjZXMiOmZhbHNlfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_IDE';
	this.aoz[ "extension" + "IDE"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/IDE/IDE.aoz
		aoz.sourcePos="0:40:0";
		// Javascript
			this.aoz.IDE = this;
			this.state = 'disconnected';
			this.webSocketToReconnectTo = undefined;
			this.webSocket = new FakeSocket();
			this.newMessages = [];
			this.currentCommand = undefined;
			this.currentResponse = undefined;
			this.currentPropertyBase = undefined;
			this.currentCommands = [];
			this.currentResponses = [];
			this.currentProperties = [];
			this.connect = function( tags, throwError )
			{
				var parts = window.document.location.hostname;
				var hostname = window.document.location.hostname;
				if( parts != undefined && parts != "" )
				{
					var parts = window.document.location.hostname.split( ":" );
					if( parts.length > 0 )
					{
						hostname = parts[ 0 ];
					}
				}
				if( hostname == '' )
				{
					hostname ='127.0.0.1';
				}
				console.log( hostname );	
				if ( this.webSocket && !this.webSocket.aoz )
				{
					this.webSocket = new this.aoz.ext_websocket.WebSocket( this.aoz, "ws://" + hostname + ":6503", "json" );
					this.webSocket.addCallback( 'onopen', this, this.onOpen );
					this.webSocket.addCallback( 'onmessage', this, this.onMessage );
					this.webSocket.addCallback( 'onerror', this, this.onError );
					this.webSocket.addCallback( 'onclose', this, this.onClose );
				}
				else
				{
					if ( throwError )
						throw throwError;
					return null;
				}
				return this.webSocket;
			};
			this.onOpen = function()
			{
				this.authenticated = false;
				this.webSocket.sendMessage( "AOZ-Calling!" );
				this.state = 'waitingforinitialreply';
			}
			this.onMessage = function( timeStamp, message )
			{
				switch ( this.state )
				{
					case 'disconnected':
						break;
					case 'reconnecting':
						break;
					case 'authenticating':
						break;
					case 'waitingforinitialreply':
						if ( message.data == 'Hello Aozeee! :)' )
							this.state = 'connected';
						break;
					case 'waitingforidentification':
						break;
					case 'connected':
						this.newMessages.push( message );
						break;
					default:
						break;
				}
			};
			this.onError = function( stillConnected, message, extra )
			{
				if ( !stillConnected )
				{
					this.state = 'reconnecting';
					this.webSocketToReconnectTo = this.webSocket;
					this.webSocket = new FakeReconnectingSocket();
				}
			};
			this.onClose = function( becauseOfError, message, extra )
			{
				this.connected = false;
			};
			this.disconnect = function( tags, throwError )
			{
				if ( this.state != 'disconnected' )
				{
					this.webSocket.close();
					this.webSocket = new FakeSocket();
					this.state = 'disconnected';
				}
				else
				{
					if ( throwError )
						throw throwError;
				}
			};
			this.sendCommand = function( command, param, throwError, extra )
			{
				param = ( typeof param === 'undefined' ? [] : param );
				param = ( typeof param === 'string' ? [ param ] : param );
				var message =
				{
					type: 'command',
					command: command,
					parameters: param,
					extra: extra
				};
				this.webSocket.sendMessage
				(
					message,
					throwError
				);
			};
			this.nextCommand = function( filter, throwError )
			{
				if ( !this.listOfCommands )
				{
					var commands = [];
					for ( var m = 0; m < this.newMessages.length; m++ )
					{
						var message = this.newMessages[ m ];
						if ( !filter || filter == message.command )
						{
							commands.push( message );
							message.toDestroy = true;
						}
					}
					this.listOfCommands =
					{
						commands: commands,
						position: 0
					}
					var temp = [];
					for ( var m = 0; m < this.newMessages.length; m++ )
					{
						var message = this.newMessages[ m ];
						if ( !message.toDestroy )
							temp.push( message );
					}
					this.newMessages = temp;
				}
				var info = this.listOfCommands;
				if ( info.position < info.commands.length )
				{
					this.currentCommand = info.commands[ info.position ];
					this.currentProperties.push( this.currentProperty );
					this.currentPropertyRoot = info.commands[ info.position ];
					info.position++;
					return true;
				}
				this.listOfCommands = undefined;
				return false;
			};
			this.nextResponse = function( filter, throwError )
			{
				if ( !this.listOfResponses )
				{
					var responses = [];
					for ( var m = 0; m < this.newMessages.length; m++ )
					{
						var message = this.newMessages[ m ].data;
						try
						{
							if ( message.substring( 0, 5 ) == 'json:' )
								message = message.substring( 5 );
							message = JSON.parse( message );
						}
						catch( e )
						{
							message =
							{
								type: 'error',
								command: 'error',
								parameters: '',
								extra: ''
							};
						}
						if ( !filter || filter == message.command )
						{
							responses.push( message );
							message.toDestroy = true;
						}
					}
					this.listOfResponses =
					{
						responses: responses,
						position: 0
					}
					var temp = [];
					for ( var m = 0; m < this.newMessages.length; m++ )
					{
						var message = this.newMessages[ m ];
						if ( !message.toDestroy )
							temp.push( message );
					}
					this.newMessages = temp;
				}
				var info = this.listOfResponses;
				if ( info.position < info.responses.length )
				{
					this.currentResponse = info.responses[ info.position ];
					this.currentPropertiesRoot = info.responses[ info.position ]
					info.position++;
					return true;
				}
				this.listOfResponses = undefined;
				return false;
			};
			this.copyText = function( text )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.copyText( text );
				}
			}
			this.movePanel = function( panel, x, y, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.movePanel( panel, x, y, tags );
				}
			}
			this.resizePanel = function( panel, width, height, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.resizePaenl( panel, width, height, tags );
				}
			}
			this.setPanelTitle = function( panel, title, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.setPanelTitle( panel, title, tags );
				}
			}
			this.destroyPanel = function( panel )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.destroyPanel( panel );
				}
			}
			this.dragPanelStart = function( panel, x, y, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.dragPanelStart( panel, x, y, tags );
				}
			}
			this.dragPanel = function( panel, x, y, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.dragPanel( panel, x, y, tags );
				}
			}
			this.dragPanelEnd = function( panel, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.dragPanelEnd( panel, tags );
				}
			}
			this.openDocChapter = function( chapter, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.openDocChapter( chapter, tags );
				}
			}
			this.insertText = function( text, tags )
			{
				if( window.parent && window.parent.atom )
				{
					window.parent.atom.aozAPI.insertTextAtCursor( text, tags );
				}
			}
			var internalError = function() { throw 'internal_error'; };
			var notOpened = function() { throw 'IDE_websocket_not_opened'; };
			var reconnecting = function() { throw 'IDE_websocket_reconnecting'; };
			function FakeSocket() {};
			FakeSocket.prototype.open = internalError;
			FakeSocket.prototype.close = notOpened;
			FakeSocket.prototype.sendMessage = notOpened;
			FakeSocket.prototype.isMessage = notOpened;
			FakeSocket.prototype.getMessage = notOpened;
			FakeSocket.prototype.forgetMessage = notOpened;
			FakeSocket.prototype.isError = notOpened;
			FakeSocket.prototype.getError = notOpened;
			FakeSocket.prototype.forgetError = notOpened;
			FakeSocket.prototype.isResponse = notOpened;
			FakeSocket.prototype.getResponse = notOpened;
			FakeSocket.prototype.forgetResponse = notOpened;
			FakeSocket.prototype.isTask = notOpened;
			FakeSocket.prototype.getTask = notOpened;
			FakeSocket.prototype.nextTask = notOpened;
			function FakeReconnectingSocket() {};
			FakeReconnectingSocket.prototype.open = internalError;
			FakeReconnectingSocket.prototype.close = reconnecting;
			FakeReconnectingSocket.prototype.sendMessage = reconnecting;
			FakeReconnectingSocket.prototype.isMessage = reconnecting;
			FakeReconnectingSocket.prototype.getMessage = reconnecting;
			FakeReconnectingSocket.prototype.forgetMessage = reconnecting;
			FakeReconnectingSocket.prototype.isError = reconnecting;
			FakeReconnectingSocket.prototype.getError = reconnecting;
			FakeReconnectingSocket.prototype.forgetError = reconnecting;
			FakeReconnectingSocket.prototype.isResponse = reconnecting;
			FakeReconnectingSocket.prototype.getResponse = reconnecting;
			FakeReconnectingSocket.prototype.forgetResponse = reconnecting;
			FakeReconnectingSocket.prototype.isTask = reconnecting;
			FakeReconnectingSocket.prototype.getTask = reconnecting;
			FakeReconnectingSocket.prototype.nextTask = reconnecting;
			// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
