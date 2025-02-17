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
 * Files
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 28/02/2018
 */
function Files( aoz )
{
	this.aoz = aoz;
	this.utilities.aoz.utilities.aoz
	this.manifest = aoz.manifest;
};

var i1 = 'data:image/png;base64,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';
