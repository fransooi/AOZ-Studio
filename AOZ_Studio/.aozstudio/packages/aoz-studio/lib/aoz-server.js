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
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ WebSocket server
 *
 * Interfaces with the machine
 *
 * @author FL (Francois Lionet)
 * @date first push on 23/09/2020
 */

var UTILITIES = require( './transpiler/utilities' );

// Web socket server for communication with the AOZ runtime
var WSSERVER = require( './ws-server.js' );
var wsServer = new WSSERVER();

// Start the web socket server to communicate with the aoz runtime
var wsOpen = false;
var wsConnected = false;
var params = { port: 6503 };
var messageHandlers = {};
var selfAOZ, handleMessage;

function initServer( selfaoz, hMessage )
{
    selfAOZ = selfaoz;
    handleMessage = hMessage;

    wsServer.start( params );
    wsServer.on( 'messageReceived', function( message )
    {
        wsOpen = true;    

        var error = undefined;
        if ( typeof message != 'string' )
        {
            handleMessage.call( selfAOZ, { command: 'print', text: "Message received from application." } );
            handleMessage.call( selfAOZ, { command: 'print', text: "    - type: " + message.type } );
            handleMessage.call( selfAOZ, { command: 'print', text: "    - command: " + message.command } );
    
            if ( messageHandlers[ message.type ] )
            {
                var types = messageHandlers[ message.type ];
                if ( types[ message.command ] )
                {
                    var command = types[ message.command ];
                    message = command.callback.call( command.self, message );
                }
            }
        }
        else
        {
            switch ( message )
            {
                case 'AOZ-Calling!':
                    handleMessage.call( selfAOZ, { command: 'print', text: "Connected to application!" } );
                    this.sendMessage( 'Hello Aozeee! :)' );
                    wsConnected = true;
                    message = undefined;
                    break;
                default:
                    break;
            }
        }
    
        // Error catching...
        var error;
        if ( typeof message != 'undefined' )
        {
            if ( typeof message != 'string' )
                error = 'IDE ERROR: unknown message type received from application';
            else
                error = 'IDE WARNING: unknown message received';
        }
        if ( error )
        {
            handleMessage.call( selfAOZ, { command: 'print', text: error } );
            console.log( error, message );
            debugger;
        }    
    });
    wsServer.on( 'connection', function( message )
    {
        wsOpen = true;
    });
    wsServer.on( 'close', function( message )
    {
        wsOpen = false;
        wsConnected = false;
    });
    wsServer.on( 'error', function( message )
    {
        wsOpen = false;
        wsConnected = false;
    });
}
module.exports.initServer = initServer;

// Send a message back to the application
function sendMessage( message, options, extra )
{
    console.log( 'Sent message to application: ', message );
    if ( wsOpen )
    {
        wsServer.sendMessage( message, options, function ( response, message, extra )
        {
        } , extra );
    }
}
module.exports.sendMessage = sendMessage;

// Add / remove message handlers
function addMessageHandler( type, command, self, callback )
{
    if ( !messageHandlers[ type ] )
        messageHandlers[ type ] = {};
    messageHandlers[ type ][ command ] =
    {
        self: self,
        callback: callback
    }
}
module.exports.addMessageHandler = addMessageHandler;

function removeMessageHandler( type, command )
{
    if ( type && command )
    {
        if ( messageHandlers[ type ] && messageHandlers[ type ][ command ] )
        {
            messageHandlers[ type ] = UTILITIES.cleanObject( messageHandlers[ type ], command, false );
            return true;
        }
    }
    else if ( type )
    {
        if ( messageHandlers[ type ] )
        {
            messageHandlers = UTILITIES.cleanObject( messageHandlers, type, false );
            return true;
        }
    }
    return false;
}
module.exports.removeMessageHandler = removeMessageHandler;

/*
case 'filesystem':
    message = AOZFILESYSTEM.handleMessage( message );
    switch ( message.command )
    {
        case 'rename':
            message = undefined;
            break;
        case 'share':
            message = undefined;
            break;
        case 'unshare':
            message = undefined;
            break;
        case 'setpermission':
            message = undefined;
            break;
        case 'create':
            message = undefined;
            break;
        case 'add':
            message = undefined;
            break;
        case 'destroy':
            message = undefined;
            break;
        case 'setproperties':
            message = undefined;
            break;
        case 'getproperties':
            message = undefined;
            break;
        default:
            break;
    }
    break;

    
	handleKeyStream( message )
	{
		switch ( message.command )
		{
			case 'start':
				if ( !KeyStream.on )
				{
					window.onkeydown = keyDown;
					window.onkeyup = keyUp;

					KeyStream =
					{
						on: true,
						paused: false,
						history: [],
						keymap: {},
						extra: message.extra
					};
				}
				message = undefined;
				break;
			case 'stop':
				if ( !KeyStream.on )
				{
					window.onkeydown = null;
					window.onkeyup = null;

					KeyStream.on = false;
				}
				message = undefined;
				break;
			case 'pause':
				if ( !KeyStream.on )
				{
					KeyStream.paused = true;
				}
				message = undefined;
				break;
			case 'resume':
				if ( !KeyStream.on )
				{
					KeyStream.paused = false;
				}
				message = undefined;
				break;
			default:
				break;
		}
		return message;

		function keyUp( event )
		{
			KeyStream.keymap( event.key ) = false;
			if ( !KeyStream.paused )
			{
				var response =
				{
					type: 'response',
					command: 'key_stream',
					id: message.id,
					response: 'keyUp',
					parameters: [ buildKeyParameters( event ) ],
					extra: KeyStream.extra
				};
				this.sendMessage( response );
			}
		}
		function keyDown( event )
		{
			KeyStream.keymap( event.key ) = true;
			if ( !KeyStream.paused )
			{
				var response =
				{
					type: 'response',
					command: 'key_stream',
					id: message.id,
					response: 'keyDown',
					parameters: [ buildKeyParameters( event ) ],
					extra: KeyStream.extra
				};
				this.sendMessage( response );
			}
		}
		function buildKeyParameter( event )
		{
			var result =
			{
				key$: event.key,
				code$: event.code,
				which: event.which,
				control: event.metaKey,
				shift: event.shiftKey,
				alt: event.altKey,
				meta: event.altKey,
				capLock: event.getModifierState( 'CapsLock' ),
				numLock: event.getModifierState( 'NumLock' ),
				scrollLock: event.getModifierState( 'ScrollLock' )
			};
			return result;
		}
	}

*/