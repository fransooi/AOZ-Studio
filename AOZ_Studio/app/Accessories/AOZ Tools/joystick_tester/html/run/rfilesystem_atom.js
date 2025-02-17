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
	aoz.isUnderAtom( callback, extra );
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
	var self = this;
	this.aoz.callAtomDos( 'getDriveList', { }, function( response, data, extra )
	{
		if ( response )
		{
			data.push( 'tutorials' );
			data.push( 'documentation' );
			data.push( 'accessories' );
			data.push( 'games' );
			data.push( 'demos' );
			data.push( 'utilities and others' );
			data.push( 'documents' );			
		}
		self.filterErrors( response, data, extra );
	}, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.dFree = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'dFree', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.open = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'open', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.close = function( file, options, callback, extra )
{
	this.aoz.callAtomDos( 'close', { file: file, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.exist = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'exist', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
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

	this.aoz.callAtomDos( 'read', { path: path, options: options }, function( response, result, extra )
	{
		if ( response )
			callback( true, this.bufferToArrayBuffer( result ), extra );
		else
			callback( false, 'disc_error', extra );
	}, { options: options, aoz: this.aoz, callback: convertData, extra: { extra: extra, options: options } } );
};
Filesystem_Atom.prototype.write = function( path, data, options, callback, extra )
{
	this.aoz.callAtomDos( 'write', { path: path, data: data, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.mkDir = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'mkDir', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.kill = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'kill', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
	this.aoz.callAtomDos( 'rename', { oldPath: oldPath, newPath: newPath, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
	this.aoz.callAtomDos( 'copy', { srcPath: srcPath, destPath: destPath, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.discInfo = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'discInfo', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.stat = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'stat', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.chMod = function( path, mode, options, callback, extra )
{
	this.aoz.callAtomDos( 'chMod', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.chDir = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'chDir', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.openFileRequester = function( path, options, callback, extra )
{
		var self = this;
	this.aoz.callAtomDos( 'openFileRequester', { path: path, options: options }, function( response, result, extra )
			{
				if ( response )
			extra.callback( true, result, extra );
				else
			self.filterErrors( false, result );
	}, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.openFolderRequester = function( path, options, callback, extra )
{
		var self = this;
	this.aoz.callAtomDos( 'openFolderRequester', { path: path, options: options }, function( response, result, extra )
			{
				if ( response )
			extra.callback( true, result[ 0 ], extra );
				else
			self.filterErrors( false, result );
	}, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.dir = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'dir', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.dirFirst = function( path, options, callback, extra )
{
	this.aoz.callAtomDos( 'dirFirst', { path: path, options: options }, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
Filesystem_Atom.prototype.dirNext = function( options, callback, extra )
{
	this.aoz.callAtomDos( 'dirNext', options, this.filterErrors, { options: options, aoz: this.aoz, callback: callback, extra: extra } );
};
