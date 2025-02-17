application.editorSDK =
{
	socket: undefined,
	socketCB: undefined,
	connected: false,
	busy: function( value )
	{
		application.root.vars.SDK_BUSY = value;
	},

	init: function()
	{
		application.root.vars.SDK_BUSY = true;
		if( application.editorSDK.isLocalHost( document.location.href ) )
		{
			application.root.vars.SDK_BUSY = false;
			application.aoz.currentScreen.cls(0);
			application.aoz.currentScreen.currentTextWindow.print( "WARNING! Programs that use system functions (such as writing to the hard disk)", true );
 			application.aoz.currentScreen.currentTextWindow.print( "can only be run locally and not from a server.",true );
			application.aoz.currentScreen.currentTextWindow.print( "",true );
			application.aoz.currentScreen.currentTextWindow.print( "This program cannot be run and has stopped.",true );
			application.aoz.renderer.setHalted( null );
			application.aoz.break = true;
			return;
		}

		if( application.editorSDK.socket == undefined )
		{
			application.editorSDK.socket = new WebSocket( "ws://localhost:1974" );

			// Connection opens
			application.editorSDK.socket.onopen = function( event )
			{
				application.root.vars.SDK_BUSY = false;
				application.editorSDK.connected = true;
			};

			// Knock Knock!
			application.editorSDK.socket.onmessage = function( event )
			{
				var json = JSON.parse( event.data );
				if( application.editorSDK.socketCB )
				{
					application.editorSDK.socketCB( json );
				}
			}

			// Connection closed.
			application.editorSDK.socket.onclose = function( event )
			{
				application.editorSDK.connected = false;

				// Firstly, check the reason.
				if( event.code != 1000 )
				{
				   // Error code 1000 means that the connection was closed normally.
				   // Try to reconnect.
				   if( !navigator.onLine )
				   {
					  	application.root.vars.SDK_BUSY = false;
			  			application.aoz.currentScreen.cls(0);
			  			application.aoz.currentScreen.currentTextWindow.print( "WARNING! The program needs to access the system, but cannot.", true );
			  			application.aoz.currentScreen.currentTextWindow.print( "",true );
			  			application.aoz.currentScreen.currentTextWindow.print( "This program has stopped.",true );
			  			application.aoz.renderer.setHalted( null );
			  			application.aoz.break = true;
				   }
				}
			 }

			 application.editorSDK.socket.onerror = function( event )
			 {
				console.log( event.data );
				application.root.vars.SDK_BUSY = false;
				application.aoz.currentScreen.cls(0);
				application.aoz.currentScreen.currentTextWindow.print( "WARNING! The program needs to access the system, but cannot.", true );
				application.aoz.currentScreen.currentTextWindow.print( "",true );
				application.aoz.currentScreen.currentTextWindow.print( "This program has stopped.",true );
				application.aoz.renderer.setHalted( null );
				application.aoz.break = true;
				application.editorSDK.connected = false;
			 }
		}
	},

	callRequest: function( module, method, options, cb )
	{
		var message =
		{
			module: module,
			method: method,
			options: options
		};

		application.editorSDK.socketCB = cb;
		if( application.editorSDK.socket )
		{
			application.editorSDK.socket.send( JSON.stringify( message ) );
		}
	},

	isLocalHost: function( url )
	{
	  return url.indexOf( 'localhost' ) !== -1 || url.indexOf( '127.0.0.1' ) !== -1;
  	},

	inEditor: function()
	{
		return application.editorSDK.connected;
  	}

};

application.editorSDK.init();
