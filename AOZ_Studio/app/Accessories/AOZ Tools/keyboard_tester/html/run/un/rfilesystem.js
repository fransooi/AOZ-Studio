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
		INSERT_DRIVESTOADD
	];

	var self = this;
	this.fileSystems = {};
	var count = 0;
	for ( var f = 0; f < list.length; f++ )
	{
		if ( window[ list[ f ].className ] )
			count++;
	}
	var nfs = count;
		for ( var f = 0; f < list.length; f++ )
		{
			var info = list[ f ];
			if ( window[ info.className ] )
			{
				window[ info.className ].isActive( aoz, function( response, data, extra )
				{
					if ( response )
					{
					var system = new window[ extra.className ]( self.aoz, self.noCase );
					self.fileSystems[ extra.token ] = system;
						self.fileSystems[ extra.token ].className = extra.className;

							var sself = self;
					system.getDriveList( { noErrors: true }, function( response, data, current )
							{
								//console.log( 'Filesystem: ' + ff + ', response: ' + response );
								if ( response )
								{
									for ( var d = 0; d < data.length; d++ )
									{
								sself.driveToFilesystem[ data[ d ].toLowerCase() ] = system;
									}
								}
						system.initialized = true;

						count--;
						if ( count == 0 )
								{
									// Add the Resource Drive folders
									for ( var rd = 0; rd < drivesToAdd.length; rd++ )
									{
										var dr = drivesToAdd[ rd ];
										for ( var fff in sself.driveToFilesystem )
										{
											if ( dr.className == sself.driveToFilesystem[ fff ].className )
											{
												sself.driveToFilesystem[ dr.token ] = sself.driveToFilesystem[ fff ];
												break;
											}
										}
									}
							sself.initialized = true;
												}
					}, system );

											}
			}, info );
												}
											}
}
Filesystem.prototype.isInitialized = function()
{
	for ( var f in this.fileSystems )
	{
		if ( !this.fileSystems[ f ].initialized )
			return false;
										}
	return true;
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
			if ( !result.fileSystem.initialized )
			{
				if ( !options.noErrors )
					throw { error: 'filesystem_initializing', parameter: result.fileSystem.token };
				result.error = 'filesystem_initializing';
			} 
			else
			{
			result.drive = drive;
			if ( result.fileSystem.replaceDrive )
				result.path = this.aoz.utilities.cleanPath( result.fileSystem.replaceDrive + '/' + path );
			else
				result.path = this.aoz.utilities.cleanPath( result.drive + ':' + path );
			result.filename = this.aoz.utilities.getFilename( result.path );
			result.extension = this.aoz.utilities.getFilenameExtension( result.path );
			result.dir = this.aoz.utilities.getDir( result.path );
		}
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
Filesystem.prototype.getDescriptor = function( path, options, callback, extra )
{
	var pathDescriptor;
	if ( !path )
		path = this.currentPath;
	if ( typeof path != 'string' )
	{
		if ( callback )
			callback( true, path, path );
		return path;
	}
	var pathDescriptor = this.getFile( path, options );
	if ( pathDescriptor.error )
	{
		if ( !callback )
			throw { error: pathDescriptor.error };
		var self = this;
		var timeout = new Date().getTime() + 2 * 1000;
		var handle = setInterval( function()
		{
			descriptor = self.getFile( path, { noErrors: true } );
			if ( !descriptor.error )
			{
				clearInterval( handle );
				callback( true, descriptor, descriptor );
				return;
			}
			var now = new Date().getTime();
			if ( now > timeout )
			{
				clearInterval( handle );
				callback( false, {}, null );
			}
		}, 20 );
		return null;
	}
	if ( callback )
		callback( true, pathDescriptor, pathDescriptor );
	return pathDescriptor;
};

Filesystem.prototype.saveFile = function( descriptor, source, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.write( result.path, source, options, callback, extra );
		}
	} );
};

Filesystem.prototype.loadFile = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
	// TODOFL: integrate into filesystems
			if ( options.responseType == 'image' && ( result.fileSystem.className == 'Filesystem_HTTP' || result.fileSystem.className == 'Filesystem_HTTPS' ) )
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
				image.src = result.path;
	}
	else if ( options.responseType == 'image' )
	{
		options.responseType = 'binary';
				result.fileSystem.read( result.path, options, function( response, data, extra )
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
				result.fileSystem.read( result.path, options, callback, extra );
	}
		}
	} );
};

Filesystem.prototype.saveBinary = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			var memoryBlock = self.aoz.getMemoryBlockFromAddress( options.start );
	if ( options.end )
		arrayBuffer = memoryBlock.extractArrayBuffer( options.start, options.end + 1 );
	else
		arrayBuffer = memoryBlock.extractArrayBuffer( options.start, options.length );
	if ( arrayBuffer )
	{
				self.saveFile( result, arrayBuffer, { encoding: null }, callback, extra );
		return;
	}
		}
	} );
};

Filesystem.prototype.saveBank = function( index, descriptor, tags, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			var bank = self.aoz.banks.getBank( index );
			bank.save( result, tags, function( response, data, extra )
	{
		callback( response, data, extra );
	}, extra );
		}
	} );
};
Filesystem.prototype.loadBinary = function( descriptor, start, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.read( result.path, { binary: true }, function( response, data, extra )
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
		}
	} );
};

Filesystem.prototype.fileLength = function( descriptor, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.stat( result.path, options, callback, extra );
		}
	} );
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
Filesystem.prototype.dir = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			var filter = self.getFilter( result.path );
			var path = result.path;
			if ( filter )
			{
				options.filters = [ filter.filter ];
				path = filter.path;
			}
			result.fileSystem.dir( path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.dirFirst = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			self.nextDescriptor = result;
			var filter = self.getFilter( result.path );
			var path = result.path;
	if ( filter )
	{
		options.filters = [ filter.filter ];
		path = filter.path;
	}
			return result.fileSystem.dirFirst( path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.dirNext = function( options, callback, extra )
{
	if ( !this.nextDescriptor )
		throw { error: 'illegal_function_call', parameter: '(Call Dir First$ first!)' };

	var self = this;
	var result = this.nextDescriptor.fileSystem.dirNext( {}, function( response, data, extra )
	{
		if ( response )
		{
			if ( !data )
				self.nextDescriptor = null;
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
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.mkDir( descriptor.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.exist = function( path, options, callback, extra )
{
	this.getDescriptor( path, { noErrors: true }, function( response, result, extra )
	{
		if ( response )
			result.fileSystem.exist( result.path, options, callback, extra );
		else
			callback( false, {}, extra );
	} );
};
Filesystem.prototype.rename = function( srcDescriptor, destPath, options, callback, extra )
{
	var self = this;
	this.getDescriptor( srcDescriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.rename( result.path, destPath, options, callback, extra );
		}
	} );
};
Filesystem.prototype.kill = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.kill( result.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.dFree = function( descriptor, options, callback, extra )
{
	var self = this;
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.dFree( result.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.stat = function( descriptor, options, callback, extra )
{
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.stat( result.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.discInfo = function( descriptor, options, callback, extra )
{
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.discInfo( result.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.chDir = function( descriptor, options, callback, extra )
{
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.chDir( result.path, options, callback, extra );
		}
	} );
};
Filesystem.prototype.openFileRequester = function( descriptor, options, callback, extra )
{
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.openFileRequester( result.drive + ':' + result.dir, options, function( response2, result, extra  )
	{
		callback( response2, result, extra );
	}, extra );
		}
	} );
	return '';
};
Filesystem.prototype.openFolderRequester = function( descriptor, options, callback, extra )
{
	this.getDescriptor( descriptor, { noErrors: true }, function( response, result, extra )	
	{
		if ( response )
		{
			result.fileSystem.openFolderRequester( result.drive + ':' + result.dir, options, function( response2, result, extra  )
	{
		callback( response2, result, extra );
	}, extra );
		}
	} );
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
