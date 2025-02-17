class DebugEvents
{
    constructor()
    {
        //
        // Branchement du debugger sur le SDK de l'éditeur
        //
        this.callbacks = {};        
        this.socket = new WebSocket( "ws://localhost:1974" );
        var self = this;
        this.socket.onopen = function( e )
        {
            console.info( "[open] Connection established" );
			self.connected = true;
        };

        this.socket.onmessage = function( event )
        {
            console.log( `[message] Data received from server: ${ event.data }` );
            var message = JSON.parse( event.data );
            var callback = self.callbacks[ message.callbackId ];
            if ( callback && callback.callback )
			{
				callback.callback( message, callback.extra );
			}
			self.callbacks[ message.callbackId ] = undefined;
        };

        this.socket.onclose = function( event )
        {
            if( event.wasClean )
            {
                console.info(`[close] Connection closed cleanly, code=${ event.code } reason=${ event.reason }`);
            }
            else
            {
                console.warn( '[close] Connection died' );
				self.connected = false;
            }
        };

        this.socket.onerror = function( error )
        {
            console.error( `[error] ${ error.message }` );
			self.connected = false;
        };
    }
	isConnected()
	{
		return this.connected;
	}
	sendMessage( message, callback, extra )
	{
		if ( this.connected )
		{
            var callbackId = 'cb' + Math.random() * 100000 + ( new Date().getTime() );
            this.callbacks[ callbackId ] = 
            {
                callback: callback,
                extra: extra
            }
            message.callbackId = callbackId;
			this.socket.send( JSON.stringify( message ) );
		}
	}
}