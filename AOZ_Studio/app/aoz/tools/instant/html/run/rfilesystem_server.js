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

function Filesystem_Server( aoz )
{
	this.aoz = aoz;
}
Filesystem_Server.isActive = function( aoz, callback, extra )
{
	if ( callback )
		callback( false, {}, extra );
	return false;
};
Filesystem_Server.prototype.filterErrors = function( response, data, extra )
{
};
Filesystem_Server.prototype.getDriveList = function( options, callback, extra )
{
};
Filesystem_Server.prototype.open = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.close = function( file, options, callback, extra )
{
};
Filesystem_Server.prototype.exist = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.read = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.write = function( path, data, options, callback, extra )
{
};
Filesystem_Server.prototype.mkDir = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.rename = function( oldPath, newPath, options, callback, extra )
{
};
Filesystem_Server.prototype.copy = function( srcPath, destPath, options, callback, extra )
{
};
Filesystem_Server.prototype.stat = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.chMod = function( path, mode, options, callback, extra )
{
};
Filesystem_Server.prototype.openRequester = function( title, path, options, callback, extra )
{
};
Filesystem_Server.prototype.dirFirst = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.dirNext = function( options, callback, extra )
{
};
Filesystem_Server.prototype.discInfo = function( path, options, callback, extra )
{
};
Filesystem_Server.prototype.dFree = function( path, options, callback, extra )
{
};