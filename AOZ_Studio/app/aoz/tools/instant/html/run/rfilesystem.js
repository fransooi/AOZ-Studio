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

function Filesystem( aoz )
{
	this.aoz = aoz;
	this.currentPath = 'application:';
	this.assigns = {};
	this.noCase = true;
	if ( this.aoz.manifest.filesystem && this.aoz.manifest.filesystem.caseSensitive )
		this.noCase = !this.aoz.manifest.filesystem.caseSensitive;

	this.driveToFilesystem = {};
	var list =
	[
		{ className: 'Filesystem_Application', token: 'application' },
		{ className: 'Filesystem_Atom', token: 'atom' },
		//{ className: 'Filesystem_GoogleDrive', token: 'googledrive' },
		//{ className: 'Filesystem_Server', token: 'server' },
		//{ className: 'Filesystem_Python', token: 'python' },
		{ className: 'Filesystem_HTTP', token: 'http' },
		{ className: 'Filesystem_HTTPS', token: 'https' },
	];
	var drivesToAdd =
	[
		
	];

	var self = this;
	this.fileSystems = {};
	this.aoz.loadingMax++;
	var count = 0;
	for ( var f = 0; f < list.length; f++ )
	{
		if ( window[ list[ f ].className ] )
			count++;
	}
	setTimeout( function()
	{
		for ( var f = 0; f < list.length; f++ )
		{
			var info = list[ f ];
			if ( window[ info.className ] )
			{
				window[ info.className ].isActive( aoz, function( response, data, extra )
				{
					if ( response )
					{
						self.fileSystems[ extra.token ] = new window[ extra.className ]( self.aoz, self.noCase );
						self.fileSystems[ extra.token ].className = extra.className;
					}

					count--;
					if ( count == 0 )
					{
						// Make the drives / file system table
						var count2 = 0;
						for ( var ff in self.fileSystems )
							count2++;
						for ( var ff in self.fileSystems )
						{
							self.fileSystems[ ff ].getDriveList( { noErrors: true }, function( response, data, extra )
							{
								//console.log( 'Filesystem: ' + ff + ', response: ' + response );
								if ( response )
								{
									for ( var d = 0; d < data.length; d++ )
									{
										self.driveToFilesystem[ data[ d ].toLowerCase() ] = self.fileSystems[ ff ];
									}
								}
								count2--;
								if ( count2 == 0 )
								{
									// Add the Resource Drive folders
									for ( var rd = 0; rd < drivesToAdd.length; rd++ )
									{
										var dr = drivesToAdd[ rd ];
										for ( var fff in self.driveToFilesystem )
										{
											if ( dr.className == self.driveToFilesystem[ fff ].className )
											{
												self.driveToFilesystem[ dr.token ] = self.driveToFilesystem[ fff ];
												break;
											}
										}
									}
									// If under ATOM, add the default AOZ folders
									try
									{
										if ( window.parent != null && window.parent.atom != null )
										{
											var found = false;
											for ( var fff in self.driveToFilesystem )
											{
												if ( self.driveToFilesystem[ fff ].className == 'Filesystem_Atom' )
												{
													found = true;
													break;
												}
											}
											setDrive( 'tutorials' );
											setDrive( 'documentation' );
											setDrive( 'accessories' );
											setDrive( 'games' );
											setDrive( 'demos' );
											setDrive( 'utilities and others' );
											setDrive( 'documents' );
											function setDrive( token )
											{
												var path = window.parent.atom.aozAPI.getInstallationPath( token );
												if ( path )
												{
													var fs = new window[ 'Filesystem_Atom' ]( self.aoz, self.noCase );
													fs.className = 'Filesystem_Atom';
													fs.replaceDrive = path;
													self.driveToFilesystem[ token ] = fs;
												}
											}
										}
									}
									catch ( err )
									{
									}
									self.aoz.loadingCount++;
								}
							}, f );
						}
					}
				}, info );
			}
		}
	}, 1 );
}
Filesystem.prototype.getFile = function( path, options )
{
	path = typeof path == 'undefined' ? this.currentPath : path;

	options = typeof options == 'undefined' ? {} : options;
	var result =
	{
		fileSystem: null,
		path: '',
		drive: '',
		dir: '',
		filename: '',
		extension: '',
		error: false
	};
	if ( options.asset )
	{
		if( this.aoz.manifest.compilation.useAssetsResources != undefined && this.aoz.manifest.compilation.useAssetsResources == false )
		{
			result.path = path;
		}
		else
		{
			result.path = 'resources/assets/' + path;
		}
		result.extension = this.aoz.utilities.getFilenameExtension( path );
		return result;
	}

	// Extract drive
	var drive = '';
	path = this.aoz.utilities.replaceStringInText( path, '\\', '/' );
	while( true )
	{
		var column = path.indexOf( ':' );
		if ( column >= 0 )
		{
			drive = path.substring( 0, column );
			path = path.substring( column + 1 );
			var temp;
			if ( ( temp = this.aoz.utilities.getPropertyCase( this.assigns, drive, this.noCase ) ) )
				result.drive = temp;
		}
		else
		{
			if ( path.indexOf( '/' ) == 0 )
			{
				drive = 'application';
			}
			else
			{
				if ( this.currentPath.indexOf( ':' ) > 0 )
				{
					path = this.currentPath + path;
					if ( path == '' )
						break;
					continue;

				}
			}
		}
		break;
	};

	// Assign filesystem
	if ( drive.toLowerCase() == 'assets' )
	{
		result.fileSystem = this.fileSystem( 'http' );
	}
	else
	{
		if ( this.driveToFilesystem[ drive.toLowerCase() ] )
		{
			result.fileSystem = this.driveToFilesystem[ drive.toLowerCase() ];
			result.drive = drive;
			if ( result.fileSystem.replaceDrive )
				result.path = this.aoz.utilities.cleanPath( result.fileSystem.replaceDrive + '/' + path );
			else
				result.path = this.aoz.utilities.cleanPath( result.drive + ':' + path );
			result.filename = this.aoz.utilities.getFilename( result.path );
			result.extension = this.aoz.utilities.getFilenameExtension( result.path );
			result.dir = this.aoz.utilities.getDir( result.path );
		}
		else
		{
			if ( !options.noErrors )
				throw 'filesystem_not_supported';
			result.error = 'filesystem_not_supported';
		}
	}
	return result;
};
Filesystem.prototype.getDescriptor = function( descriptor )
{
	if ( !descriptor )
		descriptor = this.getFile( this.currentPath );
	if ( typeof descriptor == 'string' )
		descriptor = this.getFile( descriptor );
	return descriptor;
};

Filesystem.prototype.saveFile = function( descriptor, source, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	descriptor.fileSystem.write( descriptor.path, source, options, callback, extra );
};

Filesystem.prototype.loadFile = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	// TODOFL: integrate into filesystems
	if ( options.responseType == 'image' && ( descriptor.fileSystem.className == 'Filesystem_HTTP' || descriptor.fileSystem.className == 'Filesystem_HTTPS' ) )
	{
		var image = new Image();
		image.onload = function()
		{
			callback( true, this, extra )
		}
		image.onerror = function()
		{
			callback( false, { }, extra )
		}
		image.src = descriptor.path;
	}
	else if ( options.responseType == 'image' )
	{
		options.responseType = 'binary';
		descriptor.fileSystem.read( descriptor.path, options, function( response, data, extra )
		{
			var blob = new Blob( [ data ], { type: 'image/png' } );
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL( blob );
			var image = new Image();
			image.onload = function()
			{
				callback( true, this, extra )
			}
			image.onerror = function()
			{
				callback( false, { }, extra )
			}
			image.src = imageUrl;
		}, extra );
	}
	else
	{
		descriptor.fileSystem.read( descriptor.path, options, callback, extra );
	}
};

Filesystem.prototype.saveBinary = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	var memoryBlock = this.aoz.getMemoryBlockFromAddress( options.start );
	if ( options.end )
		arrayBuffer = memoryBlock.extractArrayBuffer( options.start, options.end + 1 );
	else
		arrayBuffer = memoryBlock.extractArrayBuffer( options.start, options.length );
	if ( arrayBuffer )
	{
		this.saveFile( descriptor, arrayBuffer, { encoding: null }, callback, extra );
		return;
	}
};

Filesystem.prototype.saveBank = function( index, descriptor, tags, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	var bank = this.aoz.banks.getBank( index );
	bank.save( descriptor, tags, function( response, data, extra )
	{
		callback( response, data, extra );
	}, extra );
};
Filesystem.prototype.loadBinary = function( descriptor, start, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );

	var self = this;
	descriptor.fileSystem.read( descriptor.path, { binary: true }, function( response, data, extra )
	{
		if ( response )
		{
			var info = self.aoz.getMemory( start );
			try
			{
				info.block.pokeArrayBuffer( info.start, data );
			}
			catch( error )
			{
				callback( false, error, extra );
				return;
			}
			callback( true, info, extra );
		}
		else
		{
			callback( false, 'cannot_load_file', extra );
		}
	}, extra );
};

Filesystem.prototype.fileLength = function( descriptor, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.stat( descriptor.path, options, callback, extra );
};
Filesystem.prototype.getFilter = function( path )
{
	var result = undefined;
	var filename = this.aoz.utilities.getFilenameAndExtension( path );
	if ( filename )
	{
		if ( filename.indexOf( '*' ) >= 0 || filename.indexOf( '?' ) >= 0 )
		{
			result =
			{
				filter: filename,
				path: path.substring( 0, path.length - ( filename.length ) )
			}
		}
	}
	return result;
};
Filesystem.prototype.dirFirst = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	this.nextDescriptor = descriptor;
	var filter = this.getFilter( descriptor.path );
	var path = descriptor.path;
	if ( filter )
	{
		options.filters = [ filter.filter ];
		path = filter.path;
	}
	return descriptor.fileSystem.dirFirst( path, options, callback, extra );
};
Filesystem.prototype.dirNext = function( options, callback, extra )
{
	if ( !this.nextDescriptor )
		throw { error: 'illegal_function_call', parameter: '(Call Dir First$ first!)' };

	var result = this.nextDescriptor.fileSystem.dirNext( {}, function( response, data, extra )
	{
		if ( response )
		{
			if ( !data )
				this.nextDescriptor = null;
			callback( true, data, extra );
		}
		else
		{
			callback( false, data, extra );
		}
	}, extra );
	return result;
};
Filesystem.prototype.driveFirst = function( options, callback, extra )
{
	//descriptor = this.getDescriptor( descriptor );
	//this.nextDescriptor = descriptor;
	if ( !callback )
		throw 'illegal_function_call';

	this.driveList = [];
	var count = 0;
	for ( var f in this.fileSystems )
		count++;
	var self = this;
	for ( var f in this.fileSystems )
	{
		this.fileSystems[ f ].getDriveList( { noErrors: true }, function( response, data, extra )
		{
			if ( response )
			{
				for ( var d = 0; d < data.length; d++ )
				{
					self.driveList.push( data[ d ] );
				}
			}
			count--;
			if ( count == 0 )
			{
				self.nextDrive = 0;
				return self.driveNext( options, callback, extra );
			}
		}, f );
	}
};
Filesystem.prototype.driveNext = function( options, callback, extra )
{
	if ( !this.driveList )
		throw { error: 'illegal_function_call', parameter: 'Call Drive First$ first!)' };

	var result = '';
	if ( this.nextDrive < this.driveList.length )
	{
		result = this.driveList[ this.nextDrive++ ];
	}
	else
	{
		this.driveList = null;
	}

	if ( callback )
		callback( true, result, extra );
	return result;
};
Filesystem.prototype.mkDir = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.mkDir( descriptor.path, options, callback, extra );
};
Filesystem.prototype.exist = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.exist( descriptor.path, options, callback, extra );
};
Filesystem.prototype.rename = function( srcDescriptor, destPath, options, callback, extra )
{
	srcDescriptor = this.getDescriptor( srcDescriptor );
	return srcDescriptor.fileSystem.rename( srcDescriptor.path, destPath, options, callback, extra );
};
Filesystem.prototype.kill = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.kill( descriptor.path, options, callback, extra );
};
Filesystem.prototype.dFree = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.dFree( descriptor.path, options, callback, extra );
};
Filesystem.prototype.stat = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.stat( descriptor.path, options, callback, extra );
};
Filesystem.prototype.discInfo = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.discInfo( descriptor.path, options, callback, extra );
};
Filesystem.prototype.chDir = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	return descriptor.fileSystem.chDir( descriptor.path, options, callback, extra );
};
Filesystem.prototype.openFileRequester = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	descriptor.fileSystem.openFileRequester( descriptor.drive + ':' + descriptor.dir, options, function( response2, result, extra  )
	{
		callback( response2, result, extra );
	}, extra );
	return '';
};
Filesystem.prototype.openFolderRequester = function( descriptor, options, callback, extra )
{
	descriptor = this.getDescriptor( descriptor );
	descriptor.fileSystem.openFolderRequester( descriptor.drive + ':' + descriptor.dir, options, function( response2, result, extra  )
	{
		callback( response2, result, extra );
	}, extra );
	return '';
};


Filesystem.prototype.setDir$ = function( path, callback, extra )
{
	path = this.aoz.utilities.replaceStringInText( path, '\\', '/' );
	var end = path.charAt( path.length - 1 );
	if ( path != '' && end != ':' && end != '/' )
		path += '/';
	this.getFile( path, { mustExist: true, onlyDirectory: true } );		// Genrates errors...
	this.currentPath = path;
	if ( callback )
		callback( true, {}, extra );
};
Filesystem.prototype.getDir$ = function( callback, extra )
{
	var result = this.currentPath;
	if ( callback )
		callback( true, result, extra );
	return result;
};
Filesystem.prototype.assign = function( from, to, callback, extra )
{
	if ( from.charAt( from.length - 1 ) == ':' )
		from = from.substring( 0, from.length - 1 );
	if ( to.charAt( to.length - 1 ) == ':' )
		to = to.substring( 0, to.length - 1 );
	if ( !Filesystem.files[ to ] )
		throw 'drive_not_found';
	this.assigns[ from ] = to;
	if ( callback )
		callback( true, {}, extra );
};
Filesystem.prototype.parent = function( callback, extra )
{
	var pos = this.currentPath.lastIndexOf( '/' );
	if ( pos >= 0 )
	{
		pos = this.currentPath.lastIndexOf( '/', pos - 1 );
		if ( pos < 0 )
		{
			pos = this.currentPath.indexOf( ':' );
			if ( pos < 0 )
				pos = 0;
		}
		this.currentPath = this.currentPath.substring( 0, pos + 1 );
	}
	if ( callback )
		callback( true, {}, extra );
};
