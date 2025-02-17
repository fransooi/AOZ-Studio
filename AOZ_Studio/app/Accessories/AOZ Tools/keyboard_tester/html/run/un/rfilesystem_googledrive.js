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

function Filesystem_GoogleDrive( aoz )
{
	this.aoz = aoz;
}
Filesystem_GoogleDrive.isActive = function( aoz, callback, extra )
{
	if ( callback )
		callback( false, {}, extra );
	return false;
};
Filesystem_GoogleDrive.prototype.filterErrors = function( response, data, extra )
{
};
Filesystem_GoogleDrive.prototype.getDriveList = function( options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.open = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.close = function( file, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.exist = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.read = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.write = function( path, data, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.mkDir = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.stat = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.dFree = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.discInfo = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.chMod = function( path, mode, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.openRequester = function( title, path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.dirFirst = function( path, options, callback, extra )
{
};
Filesystem_GoogleDrive.prototype.dirNext = function( options, callback, extra )
{
};
