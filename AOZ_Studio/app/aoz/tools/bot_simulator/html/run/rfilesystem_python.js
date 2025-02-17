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
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * File system
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 22/12/2018
 */

function Filesystem_Python( aoz )
{
	this.aoz = aoz;
	this.isReady = true;
}
Filesystem_Python.isActive = function( aoz, callback, extra )
{
	var self = this;
	this.handleInterval = setInterval( function()
	{
		if ( aoz.pythonIsReady )
		{
			clearInterval( self.handleInterval );
			clearTimeout( self.handleTimeout );
			callback( true, {}, extra );
		}
	} );
	this.handleTimeout = setTimeout( function()
	{
		clearInterval( self.handleInterval );
		callback( false, {}, extra );
	}, 250 );
};
Filesystem_Python.prototype.filterErrors = function( error, extra )
{
	if ( !extra.noErrors )
	{
		if ( error.stack )
		{
			if ( extra.aoz.utilities.isObject( error ) )
				error.fromAOZ = true;
			extra.aoz.handleErrors.call( extra.aoz, error );
		}
	}
	extra.callback( false, error, extra.extra );
};
Filesystem_Python.prototype.getDriveList = function( options, callback, extra )
{
	var self = this;
	if( pywebview )
	{
		var self = this;
		pywebview.api.getDriveList( options ).then( function( result ) 
		{
			callback( true, result.response, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.discInfo = function( path, options, callback, extra )
{
	var result = '';
	if ( callback )
		callback( true, result, extra );
	return result;
};
Filesystem_Python.prototype.dFree = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.dFree( path, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.open = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.open( path, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.close = function( file, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.close( file, options ).then( function( result ) 
		{
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.exist = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.exist( path, options ).then( function( result ) 
		{
			callback( result.response, {}, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.bufferToArrayBuffer = function( data )
{
	if ( data )
	{
		var buffer = new ArrayBuffer( data.length );
		var view = new Uint8Array( buffer );
		for ( var p = 0; p < data.length; p++ )
		{
			view[ p ] = data[ p ];
		}
		return buffer;
	}
	return undefined;
};
Filesystem_Python.prototype.arrayBufferToBuffer = function( data )
{
	if ( data )
	{
		var result = [];
		var view = new Uint8Array( data );
		for ( var p = 0; p < view.length; p++ )
		{
			result[ p ] = view[ p ];
		}
		return result;
	}
	return undefined;
};
Filesystem_Python.prototype.bufferToString = function( data )
{
	if ( data )
	{
		var result = '';
		for ( var p = 0; p < data.length; p++ )
		{
			result += String.fromCharCode( data[ p ] );
		}
		return result;
	}
	return undefined;
};
Filesystem_Python.prototype.read = function( path, options, callback, extra )
{
	var self = this;
	if( pywebview )
	{
		var self = this;
		pywebview.api.read( path, options ).then( function( message ) 
		{
			if ( message.response )
			{
				if ( options.responseType == 'text' )
					data = self.bufferToString( message.response )
				else
					data = self.bufferToArrayBuffer( message.response );
				callback( true, data, extra );
				return;
			}
			callback( false, 'disc_error', extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.write = function( path, data, options, callback, extra )
{
	if( pywebview )
	{
		debugger;
		var self = this;
		var encoding = options.encoding;
		if ( !encoding )
			encoding = '';
		if ( typeof data != 'string' )
		{
			if ( encoding == 'text' || encoding == 'utf8' )
				data = this.aoz.utilities.convertArrayBufferToString( data )
			else
				data = this.arrayBufferToBuffer( data );
		}
		pywebview.api.write( path, data, encoding ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.mkDir = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.mkDir( path, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.reponse, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.kill = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.kill( path, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.rename( oldPath, newPath, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.copy( srcPath, destPath, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.reponse, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.stat = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.stat( path, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.chMod = function( path, mode, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.chMod( path, mode, options ).then( function( result ) 
		{
			debugger;
			callback( true, result.response, extra );
		}, function( error ) 
		{
			debugger;
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.chDir = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.chDir( path, options ).then( function( result ) 
		{
			callback( true, result.response, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.openFileRequester = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		if ( !options.type )
			options.type = 'load';
		pywebview.api.openFileRequester( options.type, path, options.title, options.filters ).then( function( result ) 
		{
			if ( result.response.length == 0 )
				result = '';
			else
				result = result.response[ 0 ];
			callback( true, result, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.openFolderRequester = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.openFolderRequester( path, options ).then( function( result ) 
		{
			callback( true, result.response, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.dirFirst = function( path, options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.dirFirst( path, options ).then( function( result ) 
		{
			var data = result.response;
			if ( data == '' )
				data = null;
			callback( true, data, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.dirNext = function( options, callback, extra )
{
	if( pywebview )
	{
		var self = this;
		pywebview.api.dirNext( options ).then( function( result ) 
		{
			var data = result.response;
			if ( data == '' )
				data = null;
			callback( true, data, extra );
		}, function( error ) 
		{
			self.filterErrors( error, { aoz: self.aoz, options: options, callback: callback, extra: extra } );
		} );
		return;
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Python.prototype.dir = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
