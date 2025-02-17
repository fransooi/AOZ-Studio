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
// The JSON Extension
// By Francois Lionet
// Version 1
// 20/05/2020
// (c) AOZ Studio 2020 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_json( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIEpTT04gRXh0ZW5zaW9uIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0IiwidmVyc2lvbiI6IlZlcnNpb24gMSIsImRhdGUiOiIyMC8wNS8yMDIwIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAyMCAtIE9wZW4gU291cmNlIiwic3RhcnQiOiJqc29uLmFveiIsIm5hbWUiOiJqc29uIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6WyJJREVfd2Vic29ja2V0X25vdF9vcGVuZWQ6IFx0XHRcdFdlYnNvY2tldCBjb25uZWN0aW9uIHRvIHRoZSBJREUgaXMgbm90IG9wZW5lZCIsIklERV93ZWJzb2NrZXRfcmVjb25uZWN0aW5nOiBcdFx0V2Vic29ja2V0IGlzIHJlY29ubmVjdGluZyJdLCJmciI6WyJJREVfd2Vic29ja2V0X25vdF9vcGVuZWQ6IFx0XHRcdExhIGNvbm5leGlvbiBhdSBzZXJ2ZXVyIFdlYlNvY2tldCBkZSBsJ0lERSBuJ2VzdCBwYXMgZXRhYmxpZSIsIklERV93ZWJzb2NrZXRfcmVjb25uZWN0aW5nOiBcdFx0V2Vic29ja2V0IGVuIHJlY29ubmVjdGlvbiJdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_json';
	this.aoz[ "extension" + "Json"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:37:0";
		// Javascript
		this.aoz.JSON = this;
		this.context = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: false } );
		function AJSON( aoz, tags )
		{
			this.aoz = aoz;
			this.root = {};
		};
		AJSON.prototype.load = function( path, tags )
		{
			var self = this;
			self.aoz.JSON.load_done = false;
			self.aoz.JSON.error = null;
			this.aoz.filesystem.loadFile( path, { responseType: 'text' }, function( response, data, extra )
			{
				if ( response )
				{
					self.root = undefined;
					try
					{
						self.root = JSON.parse( data );
					}
					catch( e )
					{
						self.aoz.JSON.error = 'incorrect_json_format';
					}
				}
				else
					self.error = data;
				self.aoz.JSON.load_done = true;
			} );
		};
		AJSON.prototype.save = function( path, throwError, tags )
		{
			var self = this;
			self.aoz.JSON.load_done = false;
			self.aoz.JSON.error = null;
			var descriptor = this.getFile( path, { mustExist: false } );
			if ( !descriptor.error )
			{
				var jsonString = this.stringify( throwError );
				if ( jsonString )
				{
					this.aoz.fileSystem.saveFile( descriptor, jsonString, {}, function( response, data, extra )
					{
						if ( !response )
							 self.aoz.JSON.error = throwError;
						self.aoz.JSON.load_done = true;
					}, extra );
				}
				else
				{
					self.aoz.JSON.load_done = true;
				}
			}
		};
		AJSON.prototype.parse = function( string$, throwError )
		{
			this.root = undefined;
			try
			{
				this.root = JSON.parse( string$ );
			}
			catch( e )
			{
				this.aoz.throwError( throwError, string$, false );
			}
			return true;
		};
		AJSON.prototype.stringify = function( throwError )
		{
			var result;
			try
			{
				result = JSON.stringify( this.root );
			}
			catch( e )
			{
				this.aoz.throwError( throwError, '' + e, undefined );
			}
			return result;
		};
		AJSON.prototype.getProperty = function( path, type, defaultValue, throwError )
		{
			if ( typeof defaultValue != 'undefined' )
				throwError = undefined;
			var value = this.aoz.utilities.getProperty( this.root, path, type, throwError, defaultValue );
			if ( typeof value == 'undefined' )
				return defaultValue;
			return value;
		};
		AJSON.prototype.setProperty = function( path, value, throwError )
		{
			this.aoz.utilities.setProperty( this.root, path, value, throwError );
		}
		AJSON.prototype.reset = function()
		{
			this.root = {};
		}
		   this.wait = function()
		{
			if ( this.load_done )
			{
				if ( this.error )
					throw this.error;
				return true;
			}
			return false;
		};
		this.open = function( index, tags )
		{
			var ajson = new AJSON( this.aoz, 'json_' + index, tags );
			this.context.setElement( this.aoz.currentContextName, ajson, index, true );
		}
		this.load = function( args )
		{
			var index = args[ 0 ];
			var path = args[ 1 ];
			this.context.getElement(this.aoz.currentContextName,index,'json_channel_not_defined').load( path );
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
