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
 * Error messages
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 25/01/2018
 */

function Errors( aoz )
{
	this.aoz = aoz;
	this.language = 'en';	//this.aoz.utilities.getBrowserLanguage();

	// <ERRORS-INSERT>
};
Errors.prototype.getText = function( id, param )
{
	return this.getError( id, param );
};
Errors.prototype.getError = function( error, param )
{
	var self = this;
	var paramType = typeof param != 'undefined' ? typeof param : '';

	if ( typeof error == 'string' )
	{
		error =
		{
			error: error,
			parameter: paramType == 'string' ? param : undefined,
			parameters: paramType != 'string' ? param : undefined,
		};
	}

	// First in browser language
	if ( !error.stack )
	{
		var id = error.error + ':';
		var result = getError( this.errors[ this.language ], error );
		if ( result )
			return result;

		// Then in English
		if ( this.language != 'en' )
		{
			result = getError( this.errors[ 'en' ], error );
			if ( result )
				return result;
		}

		// Then any language (TODO: keep?)
		for ( var l in this.errors )
		{
			if ( l != this.language && l != 'en' )
			{
				result = getError( this.errors[ l ], error );
				if ( result )
					return result;
			}
		}
	}

	// Then just the message...
	return { number: -1, index: '', message: 'Message identifier not found ' + error.error };

	function getError( errorList, error )
	{
		if ( errorList )
		{
			var number = errorList.findIndex( function( element )
			{
				return element.indexOf( id ) == 0;
			})
			if ( number >= 0 )
			{
				var message = errorList[ number ].substring( id.length );
				if ( typeof error.parameter != 'undefined' )
					message = self.aoz.utilities.replaceStringInText( message, '%1', '' + error.parameter );
				else if ( error.parameters )
				{
					for ( var p = 0; p < error.parameters.length; p++ )
						message = self.aoz.utilities.replaceStringInText( message, '%P' + ( p + 1 ), '' + error.parameters[ p ] );
				}
					
				// Clean the remaining %
				for ( var n = 0; n < 5; n++ )
					message = self.aoz.utilities.replaceStringInText( message, '%P' + n, '' );
				return { number: number, index: id.substring( 0, id.length - 1 ), message: message };
			}
		}
		return undefined;
	}
};
Errors.prototype.getErrorFromNumber = function( number )
{
	var self = this;

	// Browser language
	var result = getError( this.errors[ this.language ], number )
	if ( result )
		return result;

	// English!
	if ( this.language != 'en' )
	{
		result = getError( this.errors[ 'en' ], number )
		if ( result )
			return result;
	}

	// Any language (TODO: keep?)
	for ( var l in this.errors )
	{
		if ( l != this.language && l != 'en' )
		{
			result = getError( this.errors[ l ], number );
			if ( result )
				return result;
		}
	}
	return { number: number, message: 'Message not found ' + number, index: '' };

	function getError( list, num )
	{
		if ( num < list.length )
		{
			var message = list[ num ];
			var pos = message.indexOf( ':' );
			if ( pos >= 0 )
			{
				return { number: num, message: message.substring( pos + 1 ), index: message.substring( 0, pos ) };
			}
		}
		return undefined;
	}
};
