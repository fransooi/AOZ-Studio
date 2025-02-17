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
 * File system HTTPS : Internet is just a drive, yet secure! ;)
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 14/03/2021
 */

function Filesystem_HTTPS( aoz )
{
	this.aoz = aoz;
}
Filesystem_HTTPS.isActive = function( aoz, callback, extra )
{
	var result = true;
	if ( callback )
		callback( result, {}, extra );		
	return result;
};
Filesystem_HTTPS.prototype.filterErrors = function( response, data, extra )
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
Filesystem_HTTPS.prototype.getDriveList = function( options, callback, extra )
{
	var drives = [ 'http', 'https'];
	if ( callback )
		callback( true, drives, extra );
	return drives;
};
Filesystem_HTTPS.prototype.dFree = function( path, options, callback, extra )
{
	var size = 0;
	if ( callback )
		callback( true, size, extra );
	return size;
};
Filesystem_HTTPS.prototype.discInfo = function( options, callback, extra )
{
	var result = 'https:0';
	if ( callback )
		callback( true, result, extra );
	return result;
};
Filesystem_HTTPS.prototype.open = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.close = function( file, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.exist = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.bufferToArrayBuffer = function( data )
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
Filesystem_HTTPS.prototype.bufferToString = function( data )
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
Filesystem_HTTPS.prototype.bufferToUTF8 = function( data )
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
Filesystem_HTTPS.prototype.read = function( path, options, callback, extra )
{
	var self = this;
	try
	{
		var xhr = new XMLHttpRequest();
		xhr.open( 'GET', path, true );
		xhr.responseType = 'arraybuffer';

		xhr.onload = function( event )
		{
			var data = xhr.response;
			if( data && xhr.status < 400 )
			{
				if ( options.responseType == 'text' )
					data = self.bufferToString( data )
				else if ( options.responseType == 'utf-8' )
					data = self.bufferToUTF8( data )
				callback( true, data, extra );
			}
		}
		xhr.send();
	}
	catch( err )
	{
	}
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.write = function( path, data, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.mkDir = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.kill = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.stat = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.chMod = function( path, mode, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.chDir = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.openFileRequester = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.openFolderRequester = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.dirFirst = function( path, options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
Filesystem_HTTPS.prototype.dirNext = function( options, callback, extra )
{
	if ( !options.noErrors )
		throw 'disc_error';
	return undefined;
};
