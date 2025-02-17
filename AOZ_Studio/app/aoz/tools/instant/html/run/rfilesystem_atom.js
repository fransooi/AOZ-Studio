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
function Filesystem_Atom( aoz )
{
	this.aoz = aoz;
}
Filesystem_Atom.isActive = function( aoz, callback, extra )
{
	result = false;
	try
	{
		result =  window.parent != null && window.parent.atom != null;
	}
	catch( err )
	{		
	}
	if ( callback )
		callback( result, {}, extra );		
	return result;
};
Filesystem_Atom.prototype.filterErrors = function( response, data, extra )
{
	if ( response )
		extra.callback( true, data, extra.extra );
	else
	{
		if ( !extra.noErrors )
		{
			if ( data && data.stack )
			{
				if ( extra.aoz.utilities.isObject( data ) )
					data.fromAOZ = true;
				extra.aoz.handleErrors.call( extra.aoz, data );
			}
		}
		extra.callback( false, data, extra.extra );
	}
};
Filesystem_Atom.prototype.getDriveList = function( options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.getDriveList( options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.dFree = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.dFree( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.open = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.open( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.close = function( file, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.close( file, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.exist = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.exist( path, options, callback, extra );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.bufferToArrayBuffer = function( data )
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
Filesystem_Atom.prototype.bufferToString = function( data )
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
Filesystem_Atom.prototype.bufferToUTF8 = function( data )
{
	if ( data )
	{
		var buffer = new ArrayBuffer( data.length );
		var view = new Uint8Array( buffer );
		for ( var p = 0; p < data.length; p++ )
			view[ p ] = data[ p ];
		return new TextDecoder().decode( view );
	}
	return undefined;
};

Filesystem_Atom.prototype.read = function( path, options, callback, extra )
{
	var self = this;
	if( window.parent && window.parent.atom )
	{
		try
		{
			var result = window.parent.atom.fileSystem.read( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: convertData, extra: { extra: extra, options: options } } );
			return this.bufferToArrayBuffer( result );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;

	function convertData( response, data, extra )
	{
		if ( response )
		{
			if ( extra.options.responseType == 'text' )
				data = self.bufferToString( data );
			else if ( extra.options.responseType == 'utf-8' )
				data = self.bufferToUTF8( data );
			else
				data = self.bufferToArrayBuffer( data );
			callback( true, data, extra.extra );
			return;
		}
		callback( false, data, extra.extra );
	}
};
Filesystem_Atom.prototype.write = function( path, data, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.write( path, data, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.mkDir = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.mkDir( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.kill = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.kill( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.rename( oldPath, newPath, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.copy( srcPath, destPath, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.discInfo = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.discInfo( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
			var toto = 1;
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.stat = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.stat( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.chMod = function( path, mode, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.chMod( path, mode, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.chDir = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.chDir( path, options, callback, extra );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.openFileRequester = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		var self = this;
		try
		{
			return window.parent.atom.fileSystem.openFileRequester( path, options, function( response, data, extra )
			{
				if ( response )
					extra.callback( true, data, extra );
				else
					self.filterErrors( false, data, extra );
			},  { options: options, aoz: this.aoz, callback: callback, extra: extra, noErrors: false } );
		}
		catch( err )
		{
			console.log( err );
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.openFolderRequester = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		var self = this;
		try
		{			
			return window.parent.atom.fileSystem.openFolderRequester( path, options, function( response, data, extra )
			{
				if ( response )
					extra.callback( true, data[ 0 ], extra );
				else
					self.filterErrors( false, data, );
			},  { options: options, aoz: this.aoz, callback: callback, extra: extra, noErrors: false } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.dirFirst = function( path, options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.dirFirst( path, options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_Atom.prototype.dirNext = function( options, callback, extra )
{
	if( window.parent && window.parent.atom )
	{
		try
		{
			return window.parent.atom.fileSystem.dirNext( options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
		}
		catch( err )
		{
			debugger;
		}
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
