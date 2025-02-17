const express = require("express");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const REMOTE = require('electron').remote;
var EventEmitter = require('events').EventEmitter;

var webSocket = null;
var self;

var WSServer = function()
{
    self = this;
    EventEmitter.call(this);
};

WSServer.prototype = Object.create( EventEmitter.prototype );

wss.on("connection", ws =>
{
    webSocket = ws;
    ws.on("message", msg =>
    {
		if ( msg.substring( 0, 5 ) == 'json:' )
		{
			msg = JSON.parse( msg.substring( 5 ) );
		}
       	self.emit( 'messageReceived', msg );
    });

    ws.on('close', function( reasonCode, description )
    {
        self.emit('closed');
    });
});

WSServer.prototype.sendMessage = function( message, options, callback, extra )
{
    if ( webSocket != null )
    {
		if ( typeof message != 'string' )
		{
			message = 'json:' + JSON.stringify( message );
		}
        webSocket.send( message );
        if ( callback )
        {
            callback( true, {}, {} );
        }
    }
    else
    {
        if ( callback )
        {
            callback( false, "Web socket not opened", {} )
        }
    }
};

WSServer.prototype.start = function( params )
{
	server.listen( params.port, () =>
	{
		//console.log(`WS Server running on port: ${params.port}`);
	});

};

WSServer.prototype.shutdown = function()
{
    if ( server )
    {
        server.close();
    }
};

module.exports = WSServer;
