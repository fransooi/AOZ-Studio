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
 * Various utilities
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */
function Utilities( aoz )
{
	this.aoz = aoz;
}

Utilities.prototype.getBrowserLanguage = function()
{
	lang = window.navigator.languages ? window.navigator.languages[0] : null;
	lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;

	let shortLang = lang;
	if (shortLang.indexOf('-') !== -1)
		shortLang = shortLang.split('-')[0];

	if (shortLang.indexOf('_') !== -1)
		shortLang = shortLang.split('_')[0];

	return shortLang.toLowerCase();
};
Utilities.prototype.getUniqueIdentifier = function( root )
{
	root = typeof root != 'undefined' ? root : 'ID_';
	root += Math.random() * 10000000 + '-' + new Date().now;
	return root;
}
// Make the system thread-safe, for the moment one identifier per root.
Utilities.prototype.getUniqueIdentifierOnce = function( root )
{
	if ( this.uniqueIdentifiersOnce[ root ] )
	{
		return this.uniqueIdentifiersOnce[ root ];
	}
	var identifier = this.getUniqueIdentifier( root );
	this.uniqueIdentifiersOnce[ root ] = identifier;
	return identifier;
}
Utilities.prototype.resetUniqueIdentifierOnce = function( root )
{
	if ( this.uniqueIdentifiersOnce[ root ] )
	{
		this.uniqueIdentifiersOnce = this.cleanObject( this.uniqueIdentifiersOnce, this.uniqueIdentifiersOnce[ root ] );
		return true;
	}
	return false;
}
Utilities.prototype.sendCrashMail = function()
{
	if ( this.aoz.crashInfo )
	{
		var body = '\r\n\r\n';
		body += 'application: ' + this.aoz.manifest.infos.applicationName + '\r\n';
		body += 'date: ' + this.getFormattedDate() + '\r\n';
		body += 'source position: ' + this.aoz.sourcePos + '\r\n';
		body += 'message: ' + this.aoz.crash.error.message + '\r\n';
		body += 'stack: ' + this.aoz.crash.error.stack + '\r\n';
		body += '\r\n\r\n\r\n\r\n';

		var subject = 'AOZ Studio Runtime Crash Report';
		this.sendMail( 'crash@aoz.studio', subject, body );
	}
};

var i4 = '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';

Utilities.prototype.sendMail = function( to, subject, body )
{
	var message = encodeURI( "mailto:" + to + "?subject=" + subject + "&body=" + body )
    window.open( message );
};
Utilities.prototype.getFormattedDate = function()
{
    var date = new Date();

    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();

    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;
    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;

    var str = day + '/' + month + '/' + date.getFullYear() + "-" + hour + ":" + min + ":" + sec;

    return str;
};

Utilities.prototype.intersectRect = function( rect1, rect2 )
{
	var r1right = rect1.x + rect1.width;
	var r2right = rect2.x + rect2.width;
	var r1bottom = rect1.y + rect1.height;
	var r2bottom = rect2.y + rect2.height;
	if ( !( rect2.x > r1right || r2right < rect1.x || rect2.y > r1bottom || r2bottom < rect1.y ) )
	{
		var x1 = Math.max( rect1.x, rect2.x );
		var x2 = Math.min( r1right, r2right );
		var y1 = Math.max( rect1.y, rect2.y );
		var y2 = Math.min( r1bottom, r2bottom );
		return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
	}
	return false;
};
Utilities.prototype.joinRect = function( rect1, rect2 )
{
	var x1 = Math.min( rect1.x, rect2.x );
	var y1 = Math.min( rect1.y, rect2.y );
	var x2 = Math.max( rect1.x + rect1.width, rect2.x + rect2.width );
	var y2 = Math.max( rect1.y + rect1.height, rect2.y + rect2.height );
	return {
		x: x1,
		y: y1,
		width: x2 - x1,
		height: y2 - y1
	};
};
Utilities.prototype.pointInRect = function( x, y, rectangle )
{
	return ( x >= rectangle.x && x < rectangle.x + rectangle.width && y >= rectangle.y && y < rectangle.y + rectangle.height );
};
Utilities.prototype.rotate = function( x, y, cx, cy, angle )
{
	var cos = Math.cos( angle );
	var sin = Math.sin( angle );
	var nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
	var ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
	return { x: nx, y: ny };
};
Utilities.prototype.rotatePoint = function( point, center, angle )
{
	var cos = Math.cos( angle );
	var sin = Math.sin( angle );
	point.x = ( cos * ( point.x - center.x ) ) - ( sin * ( point.y - center.y ) ) + center.x;
	point.y = ( cos * ( point.y - center.y ) ) + ( sin * ( point.x - center.x ) ) + center.y;
};
Utilities.prototype.rotateCollisionRectangle = function( rectangle, center, angle )
{
	var cos = Math.cos( angle );
	var sin = Math.sin( angle );
	var x1 = ( cos * ( rectangle.x1 - center.x ) ) - ( sin * ( rectangle.y1 - center.y ) ) + center.x;
	var y1 =  ( cos * ( rectangle.y1 - center.y ) ) + ( sin * ( rectangle.x1 - center.x ) ) + center.y;
	var x2 = ( cos * ( rectangle.x2 - center.x ) ) - ( sin * ( rectangle.y1 - center.y ) ) + center.x;
	var y2 =  ( cos * ( rectangle.y1 - center.y ) ) + ( sin * ( rectangle.x2 - center.x ) ) + center.y;
	var x3 = ( cos * ( rectangle.x2 - center.x ) ) - ( sin * ( rectangle.y2 - center.y ) ) + center.x;
	var y3 =  ( cos * ( rectangle.y2 - center.y ) ) + ( sin * ( rectangle.x2 - center.x ) ) + center.y;
	var x4 = ( cos * ( rectangle.x1 - center.x ) ) - ( sin * ( rectangle.y2 - center.y ) ) + center.x;
	var y4 =  ( cos * ( rectangle.y2 - center.y ) ) + ( sin * ( rectangle.x1 - center.x ) ) + center.y;
	rectangle.x1 = Math.min( x1, Math.min( x2, Math.min( x3, x4 ) ) );
	rectangle.x2 = Math.max( x1, Math.max( x2, Math.max( x3, x4 ) ) );
	rectangle.y1 = Math.min( y1, Math.min( y2, Math.min( y3, y4 ) ) );
	rectangle.y2 = Math.max( y1, Math.max( y2, Math.max( y3, y4 ) ) );
};

Utilities.prototype.slice = function( arr, position, length )
{
	var result = [];
	length = typeof length != 'undefined' ? length : 1;
	for ( var p = 0; p < arr.length; p++ )
	{
		if ( p < position || p >= position + length )
		{
			result.push( arr[ p ] );
		}
	}
	return result;
};

Utilities.prototype.trimString = function( str, position )
{
	var start = 0;
	position = typeof position == 'undefined' ? { left: true, right: true } : position;
	if ( position.left )
	{
		while( start < str.length && ( str.charCodeAt( start ) == 32 || str.charCodeAt( start ) == 9 || str.charCodeAt( start ) == 10 || str.charCodeAt( start ) == 13 ) )
			start++;
	}
	var end = str.length;
	if ( position.right )
	{
		while( end > 0 && ( str.charCodeAt( end - 1 ) == 32 || str.charCodeAt( end - 1 ) == 9 || str.charCodeAt( end - 1 ) == 10 || str.charCodeAt( end - 1 ) == 13 ) )
			end--;
	}
	if ( end > start )
		return str.substring( start, end );
	return '';
}

Utilities.AOZTEMP_position;
Utilities.AOZTEMPRETURN_end_position;
Utilities.prototype.extractFromString = function( text, start, type, throwError, options )
{
	Utilities.AOZTEMP_position = start;
	switch ( type )
	{
		case 'string':
			var result = this.extractString( text, Utilities.AOZTEMP_position, options );
			if ( !result && throwError )
				throw { error: throwError, parameter: text };
			return result;
		case 'word':
			var result = this.extractWord( text, Utilities.AOZTEMP_position, options );
			if ( !result && throwError )
				throw { error: throwError, parameter: text };
			return result;
		case 'integer':
			var result = this.extractNumber( text, Utilities.AOZTEMP_position, options );
			if ( result.type != type && throwError )
				throw { error: throwError, parameter: text };
			return result.integer;
		case 'float':
			var result = this.extractNumber( text, Utilities.AOZTEMP_position, options );
			if ( result.type != type && throwError )
				throw { error: throwError, parameter: text };
			return result.float;
		case 'character':
			return this.extractCharacter( text, Utilities.AOZTEMP_position, options );
		default:
			throw 'internal_error';
	}
};
Utilities.prototype.getFromString = function( text, start, type, options )
{
	var savePosition = Utilities.AOZTEMP_position;
	Utilities.AOZTEMP_position = start;
	switch ( type )
	{
		case 'string':
			result = this.extractString( text, Utilities.AOZTEMP_position, options );
			break;
		case 'word':
			var result = this.extractWord( text, Utilities.AOZTEMP_position, options );
			break;
		case 'integer':
			result = this.extractNumber( text, Utilities.AOZTEMP_position, options ).integer;
			break
		case 'float':
			result = this.extractNumber( text, Utilities.AOZTEMP_position, options ).float;
			break;
		case 'character':
			result = this.extractCharacter( text, Utilities.AOZTEMP_position, options );
			break;
		default:
			throw 'internal_error';
	}
	Utilities.AOZTEMP_position = savePosition;
	return result;
};
Utilities.prototype.skipTheSpaces = function( text, start )
{
	Utilities.AOZTEMP_position = start;
	while ( ( text.charAt( start ) == ' ' || text.charAt( start ) == '\t' ) && start < text.length )
		start++;
	Utilities.AOZTEMP_position = start;
	Utilities.AOZTEMPRETURN_end_position = Utilities.AOZTEMP_position;
};
Utilities.prototype.extractCharacter = function( text, start )
{
	this.skipTheSpaces( text, start );

	var result = undefined;
	if ( Utilities.AOZTEMP_position < text.length )
		result = text.charAt( Utilities.AOZTEMP_position++ );

	Utilities.AOZTEMPRETURN_end_position = Utilities.AOZTEMP_position;
	return result;
};
Utilities.prototype.extractString = function( text, start )
{
	this.skipTheSpaces( text, start );

	var result = undefined;
	var quote = text.charAt( Utilities.AOZTEMP_position );
	if ( quote == '"' || quote == "'" )
	{
		result = '';
		Utilities.AOZTEMP_position++;
		while( Utilities.AOZTEMP_position < text.length )
		{
			var c = text.charAt( Utilities.AOZTEMP_position++ );
			if ( c == quote )
				break;
			result += c;
		}
	}
	Utilities.AOZTEMPRETURN_end_position = Utilities.AOZTEMP_position;
	return result;
};
Utilities.prototype.extractWord = function( text, start, options )
{
	var result = '';
	var plus = 0;
	options = typeof options == 'undefined' ? {} : options;
	while( start < text.length )
	{
		var c = text.charAt( Utilities.AOZTEMP_position++ );
		if ( this.getCharacterType( c ) != 'letter' )
		{
			if ( options.acceptedCharacters )
			{
				if ( options.acceptedCharacters.indexOf( c ) < 0 )
				{
					plus = -1;
					break;
			}
			}
			else
			{
				plus = -1;
				break;
			}
		}
		result += c;
	}
	Utilities.AOZTEMP_position += plus;
	Utilities.AOZTEMPRETURN_end_position = Utilities.AOZTEMP_position;
	return result;
};
Utilities.prototype.extractNumber = function( line, start )
{
	this.skipTheSpaces( line, start );

	var result =
	{
		text: "",
		float: NaN,
		integer: NaN,
		type: 'nan',
		endPosition: 0
	}
	var c = line.charAt( Utilities.AOZTEMP_position );
	if ( c == '-' || c == '–' )
	{
		Utilities.AOZTEMP_position++;
		result.text += '-';
		c = line.charAt( Utilities.AOZTEMP_position );
	}
	if ( this.getCharacterType( c ) == 'number' )
	{
		Utilities.AOZTEMP_position++;
		result.text += c;
		result.type = 'integer';
		while( Utilities.AOZTEMP_position < line.length )
		{
			c = line.charAt( Utilities.AOZTEMP_position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			result.text += c;
			if ( c == '.' )
				result.type = 'float';
			Utilities.AOZTEMP_position++;
		}
		if ( result.type == 'float' )
		{
			result.float = parseFloat( result.text );
			result.integer = this.aoz.fp2Int( result.float ); // BJF
		}
		else
		{
			result.integer = parseInt( result.text );
			result.float = result.integer;
		}
	}
	result.endPosition = Utilities.AOZTEMP_position;

	Utilities.AOZTEMPRETURN_end_position = Utilities.AOZTEMP_position;
	return result;
}; // extractNumber(line,start)

Utilities.prototype.getFontString = function( name, height, weight, italic )
{
	var font = '';
	if ( italic && italic != 'normal' )
		font += italic + ' ';
	if ( typeof weight != 'undefined' )
		font += weight + ' ';
	font += height + 'px ' + name;
	return font;
};

Utilities.prototype.getFontStringHeight = function( fontString )
{
	var height = 10;
	var pos = fontString.indexOf( 'px' );
	if ( pos >= 0 )
		height = parseInt( fontString.substring( 0, pos ) );
	return height;
};


Utilities.prototype.getAOZRGB = function( r, g, b, short )
{
	if ( !short )
		return ( ( r & 0xFF ) << 16 ) | ( ( g & 0xFF ) << 8 ) | ( b & 0xFF );
	return ( ( r & 0xF ) << 8 ) | ( ( g & 0xF ) << 4 ) | ( b & 0xF );
};
Utilities.prototype.getRGBA = function( r, g, b, a, short )
{
	a = ( typeof a == 'undefined' ? 255 : a );
	if ( !short )
		return  Math.abs( ( ( r & 0xFF ) << 24 ) | ( ( g & 0xFF ) << 16 ) | ( ( b & 0xFF ) << 8 ) | ( a & 0xFF ) );
	return ( ( r & 0xF ) << 12 ) | ( ( g & 0xF ) << 8 ) | ( ( b & 0xF ) << 4 ) | ( a & 0xF );
};
Utilities.prototype.getRGBAColors = function( rgba, short )
{
	var result;

	if ( !short )
	{
		result =
		{
			r: ( rgba >> 24 ) & 0xFF,
			g: ( rgba >> 16 ) & 0xFF,
			b: ( rgba  >> 8 ) & 0xFF,
			a: ( rgba & 0xFF )
		};
	}
	else
	{
		result =
		{
			r: ( rgba >> 12 ) & 0xF,
			g: ( rgba >> 8 ) & 0xF,
			b: ( rgba >> 4  ) & 0xF,
			a: ( rgba & 0xF )
		};
	}
	return result;
};
Utilities.prototype.getRGBColors = function( rgb, short )
{
	var result;

	if ( !short )
	{
		result =
		{
			r: ( rgb >> 16 ) & 0xFF,
			g: ( rgb >> 8  ) & 0xFF,
			b: ( rgb       ) & 0xFF,
		};
	}
	else
	{
		result =
		{
			r: ( rgb >> 8 ) & 0xF,
			g: ( rgb >> 4 ) & 0xF,
			b: ( rgb      ) & 0xF,
		};
	}
	return result;
}; // getRBGColors

Utilities.prototype.getRGBAStringColors = function( rgbaString )
{
	var result = {};
	result.r = parseInt( rgbaString.substr( 1, 2 ), 16 );
	result.g = parseInt( rgbaString.substr( 3, 2 ), 16 );
	result.b = parseInt( rgbaString.substr( 5, 2 ), 16 );
	result.a = 255;
	if ( rgbaString.length == 9 )
		result.a = parseInt( rgbaString.substr( 7, 2 ), 16 );
	return result;
};
Utilities.prototype.getRGBAString = function( r, g, b, a )
{
	var rr = r.toString( 16 );
		if ( rr.length < 2 ) rr = '0' + rr;
	var gg = g.toString( 16 );
		if ( gg.length < 2 ) gg = '0' + gg;
	var bb = b.toString( 16 );
		if ( bb.length < 2 ) bb = '0' + bb;
	var aa = '';
	if ( typeof a != 'undefined')
	{
		aa = a.toString( 16 );
		if ( aa.length < 2 ) aa = '0' + aa;
	}
	return ( '#' + rr + gg + bb + aa ).toUpperCase();
}
Utilities.prototype.getModernColorString = function( color, short = false )
{
	var colorString = color.toString( 16 );
	if ( short )
	{
		while ( colorString.length < 3 )
			colorString = '0' + colorString;
		colorString = colorString.substr( 0, 1 ) + '0' + colorString.substr( 1, 1 ) + '0' + colorString.substr( 2, 1 ) + '0';
	}
	else
	{
		while ( colorString.length < 6 )
			colorString = '0' + colorString;
	}
	return ( '#' + colorString ).toUpperCase();
};
Utilities.prototype.getModernRGBAString = function( color, short = false )
{
	var colorString = color.toString( 16 );
	if ( short )
	{
		while ( colorString.length < 4 )
			colorString = '0' + colorString;
		colorString = colorString.substr( 0, 1 ) + '0' + colorString.substr( 1, 1 ) + '0' + colorString.substr( 2, 1 ) + '0' + colorString.substr( 3, 1 ) + '0';
	}
	else
	{
		while ( colorString.length < 8 )
			colorString = '0' + colorString;
	}
	return ( '#' + colorString ).toUpperCase();
};
Utilities.javascriptColors =
{
	'aliceblue': 0xF0F8FF,
	'antiquewhite': 0xFAEBD7,
	'aqua': 0x00FFFF,
	'aquamarine': 0x7FFFD4,
	'azure': 0xF0FFFF,
	'beige': 0xF5F5DC,
	'bisque': 0xFFE4C4,
	'black': 0x000000,
	'blanchedalmond': 0xFFEBCD,
	'blue': 0x0000FF,
	'blueviolet': 0x8A2BE2,
	'brown': 0xA52A2A,
	'burlywood': 0xDEB887,
	'cadetblue': 0x5F9EA0,
	'chartreuse': 0x7FFF00,
	'chocolate': 0xD2691E,
	'coral': 0xFF7F50,
	'cornflowerblue': 0x6495ED,
	'cornsilk': 0xFFF8DC,
	'crimson': 0xDC143C,
	'cyan': 0x00FFFF,
	'darkblue': 0x00008B,
	'darkcyan': 0x008B8B,
	'darkgoldenrod': 0xB8860B,
	'darkgray': 0xA9A9A9,
	'darkgrey': 0xA9A9A9,
	'darkgreen': 0x006400,
	'darkkhaki': 0xBDB76B,
	'darkmagenta': 0x8B008B,
	'darkolivegreen': 0x556B2F,
	'darkorange': 0xFF8C00,
	'darkorchid': 0x9932CC,
	'darkred': 0x8B0000,
	'darksalmon': 0xE9967A,
	'darkseagreen': 0x8FBC8F,
	'darkslateblue': 0x483D8B,
	'darkslategray': 0x2F4F4F,
	'darkslategrey': 0x2F4F4F,
	'darkturquoise': 0x00CED1,
	'darkviolet': 0x9400D3,
	'deeppink': 0xFF1493,
	'deepskyblue': 0x00BFFF,
	'dimgray': 0x696969,
	'dimgrey': 0x696969,
	'dodgerblue': 0x1E90FF,
	'firebrick': 0xB22222,
	'floralwhite': 0xFFFAF0,
	'forestgreen': 0x228B22,
	'fuchsia': 0xFF00FF,
	'gainsboro': 0xDCDCDC,
	'ghostwhite': 0xF8F8FF,
	'gold': 0xFFD700,
	'goldenrod': 0xDAA520,
	'gray': 0x808080,
	'grey': 0x808080,
	'green': 0x008000,
	'greenyellow': 0xADFF2F,
	'honeydew': 0xF0FFF0,
	'hotpink': 0xFF69B4,
	'indianred': 0xCD5C5C,
	'indigo': 0x4B0082,
	'ivory': 0xFFFFF0,
	'khaki': 0xF0E68C,
	'lavender': 0xE6E6FA,
	'lavenderblush': 0xFFF0F5,
	'lawngreen': 0x7CFC00,
	'lemonchiffon': 0xFFFACD,
	'lightblue': 0xADD8E6,
	'lightcoral': 0xF08080,
	'lightcyan': 0xE0FFFF,
	'lightgoldenrodyellow': 0xFAFAD2,
	'lightgray': 0xD3D3D3,
	'lightgrey': 0xD3D3D3,
	'lightgreen': 0x90EE90,
	'lightpink': 0xFFB6C1,
	'lightsalmon': 0xFFA07A,
	'lightseagreen': 0x20B2AA,
	'lightskyblue': 0x87CEFA,
	'lightslategray': 0x778899,
	'lightslategrey': 0x778899,
	'lightsteelblue': 0xB0C4DE,
	'lightyellow': 0xFFFFE0,
	'lime': 0x00FF00,
	'limegreen': 0x32CD32,
	'linen': 0xFAF0E6,
	'magenta': 0xFF00FF,
	'maroon': 0x800000,
	'mediumaquamarine': 0x66CDAA,
	'mediumblue': 0x0000CD,
	'mediumorchid': 0xBA55D3,
	'mediumpurple': 0x9370DB,
	'mediumseagreen': 0x3CB371,
	'mediumslateblue': 0x7B68EE,
	'mediumspringGreen': 0x00FA9A,
	'mediumturquoise': 0x48D1CC,
	'mediumvioletRed': 0xC71585,
	'midnightblue': 0x191970,
	'mintcream': 0xF5FFFA,
	'mistyrose': 0xFFE4E1,
	'moccasin': 0xFFE4B5,
	'navajowhite': 0xFFDEAD,
	'navy': 0x000080,
	'oldlace': 0xFDF5E6,
	'olive': 0x808000,
	'olivedrab': 0x6B8E23,
	'orange': 0xFFA500,
	'orangered': 0xFF4500,
	'orchid': 0xDA70D6,
	'palegoldenrod': 0xEEE8AA,
	'palegreen': 0x98FB98,
	'paleturquoise': 0xAFEEEE,
	'palevioletred': 0xDB7093,
	'papayawhip': 0xFFEFD5,
	'peachpuff': 0xFFDAB9,
	'peru': 0xCD853F,
	'pink': 0xFFC0CB,
	'plum': 0xDDA0DD,
	'powderblue': 0xB0E0E6,
	'purple': 0x800080,
	'rebeccapurple': 0x663399,
	'red': 0xFF0000,
	'rosybrown': 0xBC8F8F,
	'royalblue': 0x4169E1,
	'saddlebrown': 0x8B4513,
	'salmon': 0xFA8072,
	'sandybrown': 0xF4A460,
	'seagreen': 0x2E8B57,
	'seashell': 0xFFF5EE,
	'sienna': 0xA0522D,
	'silver': 0xC0C0C0,
	'skyblue': 0x87CEEB,
	'slateblue': 0x6A5ACD,
	'slategray': 0x708090,
	'slategrey': 0x708090,
	'snow': 0xFFFAFA,
	'springgreen': 0x00FF7F,
	'steelblue': 0x4682B4,
	'tan': 0xD2B48C,
	'teal': 0x008080,
	'thistle': 0xD8BFD8,
	'tomato': 0xFF6347,
	'turquoise': 0x40E0D0,
	'violet': 0xEE82EE,
	'wheat': 0xF5DEB3,
	'white': 0xFFFFFF,
	'whitesmoke': 0xF5F5F5,
	'yellow': 0xFFFF00,
	'yellowgreen': 0x9ACD32,
};

// GRAPHIC FILTERS
//////////////////////////////////////////////////////////////////////////////
Utilities.prototype.DrawFilters = function( aoz, that )
{
	var mmax = 0x10000000;
	var mmin = -mmax;
	this.aoz = aoz;
	this.thatObject = that;
	this.filters = {};
	this.filterString = 'none';
	this.filterList =
	{
		'blur': [ { minimum: 0, maximum: mmax, prefix: '(', unit: 'px) ' } ],
		'brightness': [ { minimum: 0, maximum: mmax, prefix: '(', unit: '%) ' } ],
		'contrast': [ { minimum: 0, maximum: mmax, prefix: '(', unit: '%) ' } ],
		'grayscale': [ { minimum: 0, maximum: 100, prefix: '(', unit: '%) ' } ],
		'hue-rotate':[ { minimum: mmin, maximum: mmax, prefix: '(', unit: 'deg) ' } ],
		'invert': [ { minimum: 0, maximum: 100, prefix: '(', unit: '%) ' } ],
		'opacity': [ { minimum: 0, maximum: 100, prefix: '(', unit: '%) ' } ],
		'saturate': [ { minimum: 0, maximum: mmax, prefix: '(', unit: '%) ' } ],
		'sepia': [ { minimum: 0, maximum: 100, prefix: '(', unit: '%) ' } ],
		'drop-shadow': [ { minimum: mmin, maximum: mmax, prefix: '(', unit: 'px ' }, { minimum: mmin, maximum: mmax, prefix: '', unit: 'px ' }, { minimum: 0, maximum: mmax, prefix: '', unit: 'px ' }, { minimum: mmin, maximum: mmax, prefix: '#', unit: ') ' } ]
	};

	this.getFilterDefinition = function( name )
	{
		var name = name.toLowerCase();
		if ( this.filterList[ name ] )
			return this.filterList[ name ];
		throw { error: 'filter_not_defined', parameter: name };
	}
	this.setFilter = function( args )
		{
		var parameters = typeof args.parameters == 'string' ? [ args.parameters ] : args.parameters;
		var definition = this.aoz.utilities.copyArray( this.getFilterDefinition( args.name ) );
		var values = [];
		var valueStrings = [];
		for ( var p = 0; p < parameters.length && p < definition.length; p++ )
		{
			var value = args.parameters[ p ];
			var valueString;
			if ( definition[ p ].prefix.substring( 0, 1 ) == '#' )
			{
				valueString = this.aoz.utilities.getModernColorString( value );
				definition[ p ].prefix = ' ';
			}
			else
			{
				value = Math.max( definition[ p ].minimum, Math.min( definition[ p ].maximum, value ) );
				valueString = definition[ p ].prefix + value + definition[ p ].unit;
		}
			values.push( value );
			valueStrings.push( valueString );
	}
		this.filters[ args.name.toLowerCase() ] =
	{
			values: values,
			valueStrings: valueStrings,
			definition: definition
		};
	}
	this.getFilterString = function( parent2Filters, parent1Filters )
	{
		var self = this;
		var values = {};

		// Merge optional filters
		if ( parent1Filters )
			mergeIt( parent1Filters );

		// Merge main filters
		if ( parent2Filters )
			mergeIt( parent2Filters );

		// Create string
		var filterString = '';
		for ( var f in values )
		{
			filterString += f;
			for ( var p = 0; p < values[ f ].length; p++ )
	{
				var def = this.filterList[ f ][ p ];
				filterString += ( def.prefix + values[ f ][ p ] + def.unit );
			}	
		}

		// Add missing local filters
		for ( var f in this.filters )
		{
			if ( !values[ f ] )
			{
				filterString += f;
				for ( var p = 0; p < this.filters[ f ].valueStrings.length; p++ )
					filterString += this.filters[ f ].valueStrings[ p ];
			}
		}
		return filterString = '' ? 'none' : filterString;

		function mergeIt( parentFilters )
	{
		for ( var f in parentFilters.filters )
		{
				if ( f != 'drop-shadow' )
				{
			var parentFilter = parentFilters.filters[ f ];
					var def = parentFilter.definition;
					if ( self.filters[ f ] )
					{
						values[ f ] = ( !values[ f ] ? [] : values[ f ] );
						for ( var p = 0; p < parentFilter.values.length; p++ )
						{
							var value = parentFilter.values[ p ] + self.filters[ f ].values[ p ];
							values[ f ][ p ] =  Math.max( def[ p ].minimum, Math.min( def[ p ].maximum, value ) );
			}
		}
					else
		{
						if ( !values[ f ] )
							values[ f ] = parentFilter.values;
						else
			{
							values[ f ] = ( !values[ f ] ? [] : values[ f ] );
							for ( var p = 0; p < parentFilter.values.length; p++ )
								values[ f ][ p ] =  Math.max( def[ p ].minimum, Math.min( def[ p ].maximum, parentFilter.values[ p ] ) );
						}						
					}
				}
			}
		}
	};
	this.delFilter = function( args )
	{
		if ( !args || !args.name )
		{
			this.filters = {};
		}
		else
		{
			this.filters = this.aoz.utilities.cleanObject( this.filters, this.getFilterDefinition( args.name ) );
		}
	};
};

Utilities.prototype.adjustColor = function( color, intensity )
{
	var rgb = this.getRGBAStringColors(color);
	rgb.r = ( rgb.r * intensity ) > 255 ? 255 : rgb.r * intensity;
	rgb.g = ( rgb.g * intensity ) > 255 ? 255 : rgb.g * intensity;
	rgb.b = ( rgb.b * intensity ) > 255 ? 255 : rgb.b * intensity;
	return this.getModernColorString(this.getAOZRGB( rgb.r, rgb.g, rgb.b ));
};
Utilities.prototype.getJavascriptColor = function( colorName, short = false )
{
	if ( Utilities.javascriptColors[ colorName.toLowerCase() ] )
		return Utilities.javascriptColors[ colorName.toLowerCase() ];
	throw 'color_not_found';
};


Utilities.prototype.pokeString = function( str, replacement, position, length  )
{
	var result = str.substring( 0, position );
	if ( length < replacement.length )
	{
		result += replacement.substr( 0, length );
	}
	else
	{
		result += replacement;
		result += str.substr( position + replacement.length, length - replacement.length );
	}
	result += str.substring( position + length );
	return result;
};
Utilities.prototype.cleanPath = function( path )
{
	if ( typeof path == 'undefined' )
	{
		return path;
	}

	var pos = 0;
	while( ( pos = path.indexOf( '\\', pos ) )  >= 0 )
		path = path.substring( 0, pos ) + '/' + path.substring( pos + 1 );
	if ( path.charAt( path.length - 1 ) == '/' )
		path = path.substring( 0, path.length - 1 );
	return path;
};
Utilities.prototype.getFilename = function( path )
{
	var posPoint = path.lastIndexOf( '.' );
	if ( posPoint < 0 )
		posPoint = path.length;

	var posSlash1 = path.lastIndexOf( '/' );
	var posSlash2 = path.lastIndexOf( '\\' );
	if ( posSlash1 >= 0 && posSlash2 >= 0 )
		posSlash1 = Math.max( posSlash1, posSlash2 ) + 1;
	else if ( posSlash1 < 0 && posSlash2 < 0 )
		posSlash1 = 0;
	else if ( posSlash1 < 0 )
		posSlash1 = posSlash2 + 1;
	else
		posSlash1++;

	return path.substring( posSlash1, posPoint );
};
Utilities.prototype.getFilenameExtension = function( path )
{
	var posPoint = path.lastIndexOf( '.' );
	if ( posPoint < 0 )
		return '';
	return path.substring( posPoint + 1 );
};
Utilities.prototype.getFilenameAndExtension = function( path )
{
	var posSlash1 = path.lastIndexOf( '/' );
	var posSlash2 = path.lastIndexOf( '\\' );
	if ( posSlash1 >= 0 && posSlash2 >= 0 )
		posSlash1 = Math.max( posSlash1, posSlash2 ) + 1;
	else if ( posSlash1 < 0 && posSlash2 < 0 )
		posSlash1 = 0;
	else if ( posSlash1 < 0 )
		posSlash1 = posSlash2 + 1;
	else
		posSlash1++;

	return path.substring( posSlash1 );
};
Utilities.prototype.getDir = function( path )
{
	var colon = path.indexOf( ':' );
	if ( colon >= 0 )
		path = path.substring( colon + 1 );
	var posSlash1 = path.lastIndexOf( '/' );
	var posSlash2 = path.lastIndexOf( '\\' );
	if ( posSlash1 >= 0 && posSlash2 >= 0 )
		posSlash1 = Math.max( posSlash1, posSlash2 );
	else if ( posSlash1 < 0 && posSlash2 < 0 )
		posSlash1 = 0;
	else if ( posSlash1 < 0 )
		posSlash1 = posSlash2;
	return path.substring( 0, posSlash1 );
};
Utilities.prototype.getDirectoryFromPath = function( path )
{
	var filename = this.getFilenameAndExtension( path );
	path = path.substring( 0, path.length - filename.length );
	if ( path.charAt( path.length - 1 ) == '/' )
		path = path.substring( 0, path.length - 1 );
	return path;
};

Utilities.prototype.convertStringToArrayBuffer = function( str )
{
	var lookup = window.base64Lookup;
	if ( !lookup )
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		lookup = new Uint8Array(256);
		for ( var i = 0; i < chars.length; i++ )
		{
			lookup[ chars.charCodeAt( i ) ] = i;
		}
		window.base64Lookup = lookup;
	}

	var bufferLength = str.length * 0.75, len = str.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
	if ( str[ str.length - 1 ] === "=")
	{
		bufferLength--;
		if ( str[ str.length - 2 ] === "=")
		{
			bufferLength--;
		}
	}

	var arraybuffer = new ArrayBuffer( bufferLength ),
	bytes = new Uint8Array( arraybuffer );

	for ( i = 0; i < len; i += 4 )
	{
		encoded1 = lookup[str.charCodeAt(i)];
		encoded2 = lookup[str.charCodeAt(i+1)];
		encoded3 = lookup[str.charCodeAt(i+2)];
		encoded4 = lookup[str.charCodeAt(i+3)];

		bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
		bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
		bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
	}
	return arraybuffer;
};
Utilities.prototype.convertArrayBufferToString = function( arrayBuffer )
{
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var bytes = new Uint8Array( arrayBuffer ), i, len = bytes.length, base64 = "";

	for (i = 0; i < len; i+=3)
	{
		base64 += chars[bytes[i] >> 2];
		base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
		base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
		base64 += chars[bytes[i + 2] & 63];
	}

	if ((len % 3) === 2)
	{
		base64 = base64.substring(0, base64.length - 1) + "=";
	}
	else if (len % 3 === 1)
	{
		base64 = base64.substring(0, base64.length - 2) + "==";
	}
	return base64;
};
Utilities.prototype.loadArraybuffer = function( path, options, callback, extra )
{
	var self = this;
	fetch( path )
  		.then( response => response.text() )
  		.then( ( data ) => {
			var arrayBuffer = self.convertStringToArrayBuffer( data );
			callback( true, arrayBuffer, extra );
		} )
		.catch( function( error )
		{
			callback( false, null, extra );
		} );
}
Utilities.prototype.replaceStringInText = function( text, mark, replacement, number )
{
	number = ( typeof number == 'undefined' ? 100000000 : number );
	if ( replacement.indexOf( mark ) >= 0 )
		number = 1;
	var pos = text.indexOf( mark );
	while( pos >= 0 && number > 0 )
	{
		text = text.substring( 0, pos ) + replacement + text.substring( pos + mark.length );
		pos = text.indexOf( mark );
		number--;
	}
	return text;
};
Utilities.prototype.loadScript = function( scripts, options, callback, extra )
{
	options = typeof options != 'undefined' ? options : {};
	timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
	if ( typeof scripts == 'string' )
		scripts = [ scripts ];


	var loaded = 0;
	var toLoad = scripts.length;
	var handle = setTimeout( onTimeout, timeout );
	for ( var s = 0; s < scripts.length; s++ )
	{
		var path = scripts[ s ];

		var element = document.createElement( 'script' );
		element.onload = onLoad;
		element.onError = onError;					// Not on all browsers
		element.src = path;
		document.head.appendChild( element ); 		// Adds to the document
		scripts[ s ] = element;
		function onLoad()
		{
			loaded++;
			if ( loaded == toLoad )
			{
				clearTimeout( handle );
				if ( callback )
					callback( true, scripts, extra );
			}
		};
		function onError()
		{
			clearTimeout( handle );
			if ( callback )
				callback( false, scripts, extra );
		};
		function onTimeout()
		{
			if ( callback )
				callback( false, scripts, extra );
		};
	}
};
Utilities.prototype.loadPng = function( path, options, callback, extra )
{
	var image = new Image();
	image.onload = function()
	{
		callback( true, this, extra );
	};
	image.src = path;
};
Utilities.prototype.loadImages = function( images, options, callback, extra )
{
	options = typeof options != 'undefined' ? options : {};
	timeout = typeof options.timeout != 'undefined' ? options.timeout : 1000 * 10;
	if ( typeof images == 'string' )
		images = [ images ];

	var loaded = 0;
	var toLoad = images.length;
	var loadedImages = {};
	for ( var s = 0; s < images.length; s++ )
	{
		var path = images[ s ];

		var i = new Image();
		i.__name = this.getFilename( path );
		i.onload = function()
		{
			loaded++;
			loadedImages[ this.__name ] = this;
			if ( loaded == toLoad )
			{
				clearTimeout( handle );
				if ( callback )
					callback( true, loadedImages, extra );
			}
		};
		i.onerror = function()
		{
			clearTimeout( handle );
			if ( callback )
				callback( false, null, { error: 'load_error' } );
		};
		i.src = path;
	}
	var handle = setTimeout( onTimeout, timeout );
	function onTimeout()
	{
		if ( callback )
			callback( false, null, { error: 'timeout' } );
	};
};
Utilities.prototype.convertObjectToArray = function( obj, options )
{
	var	result = [];
	for ( var d = 0; d < obj.length; d++ )
	{
		result.push( obj[ d ] );
	}
	if ( options )
	{
		if ( options.sort == 'up' )
		{
			result.sort( function( a, b )
			{
				return ( a < b ) ? 1 : -1;
			} );
		}
		else if ( options.sort == 'down' )
		{
			result.sort( function( a, b )
			{
				return ( a > b ) ? 1 : -1;
			} );
		}
	}
	return result;
};

Utilities.prototype.copyArray = function ( arr )
{
	var result = [];
	for ( var i = 0; i < arr.length; i++ )
		result[ i ] = arr[ i ];
	return result;
};
Utilities.prototype.copyObject = function ( obj, recursive )
{
	recursive = ( typeof recursive == 'undefined' ? true : false );
	var result = {};
	for ( var i in obj )
	{
		if ( recursive && this.isObject( obj[ i ] ) )
			result[ i ] = this.copyObject( obj[ i ] );
		else
		result[ i ] = obj[ i ];
	}
	return result;
};
Utilities.prototype.mergeObjectIntoNewObject = function ( destination, source )
{
	var result = {};
	for ( var i in destination )
		result[ i ] = destination[ i ];
	for ( var i in source )
		result[ i ] = source[ i ];
	return result;
};
Utilities.prototype.getPropertyCase = function ( obj, prop, noCase )
{
	if ( typeof prop != 'string' )
		return obj[ prop ];
	if ( noCase )
	{
		prop = prop.toLowerCase();
		for ( p in obj )
		{
			if ( p.toLowerCase() == prop )
			{
				return obj[ p ];
			}
		}
	}
	return obj[ prop ];
};
Utilities.prototype.findPropertyWithProp = function ( obj, propName, prop, noCase )
{
	if ( noCase )
		prop = prop.toLowerCase();
	for ( p in obj )
	{
		if ( obj[ p ] )
		{
			var found = obj[ p ][ propName ];
			if ( noCase )
				found = found.toLowerCase();
			if ( found == prop )
				return obj[ p ];
		}
	}
	return obj[ prop ];
};
Utilities.prototype.cleanArray = function ( arr, exclude )
{
	var newArray = [];
	for ( var i = 0; i < arr.length; i++ )
	{
		if ( arr[ i ] != exclude )
			newArray.push( arr[ i ] );
	}
	return newArray;
};
Utilities.prototype.cleanObject = function ( obj, exclude, noCase )
{
	var temp = {};
	if ( typeof exclude == 'string' )
	{
		if ( noCase )
		{
			for ( var key in obj )
			{
				if ( typeof key != 'string' || key.toLowerCase() != exclude.toLowerCase() )
					temp[ key ] = obj[ key ];
			}
		}
		else
		{
			for ( var key in obj )
			{
				if ( key != exclude )
					temp[ key ] = obj[ key ];
			}
		}
	}
	else
	{
		for ( var key in obj )
		{
			if ( obj[ key ] && obj[ key ] != exclude )
				temp[ key ] = obj[ key ];
		}
	}
	return temp;
};
Utilities.prototype.isObject = function( item )
{
    return typeof item != 'undefined' ? (typeof item === "object" && !Array.isArray(item) && item !== null) : false;
};
Utilities.prototype.isArray = function( item )
{
    return typeof item != 'undefined' ? item.constructor == Array : false;
};
Utilities.prototype.getTag = function( text, tags )
{
	if ( text && tags )
	{
		text = text.toLowerCase();
		if ( typeof tags == 'string' )
		{
			if ( text.indexOf( '#' + tags.toLowerCase() ) >= 0 )
			{
				return tags;
			}
		}
		else
		{
			for ( var t = 0; t < tags.length; t++ )
			{
				if ( text.indexOf( '#' + tags[ t ].toLowerCase() ) >= 0 )
				{
					return tags[ t ];
				}
			}
		}
	}
	return '';
};

Utilities.prototype.isTag = function( text, tags )
{
	if ( text && tags )
	{
		text = text.toLowerCase();
		tags = ( this.isArray( tags ) ? tags : [ tags ] );
		for ( var t = 0; t < tags.length; t++ )
		{
			if ( text.indexOf( '#' + tags[ t ].toLowerCase() ) >= 0 )
			{
				return true;
			}
		}
	}
	return false;
};
Utilities.prototype.getTagParameter = function( text, tag )
{
	if ( text && tag )
	{
		text = text.toLowerCase();
		var start = text.indexOf( '#' + tag.toLowerCase() );
		if ( start >= 0 )
		{
			start += tag.length + 1;
			if ( text.charAt( start ) == ':' )
			{
				start++;
				var end = text.indexOf( ',', start );
				if ( end < 0 ) end = text.length;
				var param = text.substring( start, end );
				if ( param.charAt( 0 ) == '"' || param.charAt( 0 ) == "'" )
					return text.substring( start + 1, end - 1 );
				var number = this.val( param );
				if ( !isNaN( number ) )
					return number;
				return param;
			}
		}
	}
	return undefined;
};

Utilities.prototype.val = function( value ) // made this just like one in raoz BJF
{
	var base = 10;
	var result = 0;
	var s = value.substring(0,1);
	switch (s)
	{
		case '$':
			value = value.substring( 1 );
			base = 16;
			result = parseInt( value, base );
			break;
		case '%':
			value = value.substring( 1 );
			base = 2;
			result = parseInt( value, base );
			break;
		default:
			result = parseFloat( value );
	}
	if ( isNaN( result ) )
		result = 0;
	return result;
/*
	var base = 10;
	if ( value.substring( 0, 1 ) == '$' )
	{
		value = value.substring( 1 );
		base = 16;
	}
	if ( value.substring( 0, 1 ) == '%' )
	{
		value = value.substring( 1 );
		base = 2;
	}
	return parseInt( value, base ); // Int??? BJF
	*/
};

Utilities.prototype.skipSpaces = function( line )
{
	var position = 0;
	while ( ( line.charAt( position ) == ' ' || line.charAt( position ) == '\t' ) && position < line.length )
		position++;
	return line.substring( position );
};
Utilities.prototype.flattenObject = function( objet )
{
	var result = [];
	for ( var i in objet )
		result.push( objet[ i ] );
	return result;
};
function fireEvent( el, etype )
{
  	if ( el.fireEvent )
	{
    	( el.fireEvent( 'on' + etype ) );
  	}
	else
	{
    	var evObj = document.createEvent( 'Events' );
    	evObj.initEvent( etype, true, false );
    	el.dispatchEvent( evObj );
  	}
}

Utilities.prototype.getDistance = function( coords )
{
	var xDiff = coords.x1 - coords.x2;
	var yDiff = coords.y1 - coords.y2;
	return Math.sqrt( xDiff * xDiff + yDiff * yDiff );
};

Utilities.prototype.getAngle = function( coords )
{
	var angle = Math.atan2( -( coords.y2 - coords.y1 ), coords.x2 - coords.x1) / this.aoz.degreeRadian;
	if ( angle <= 0)
		angle = Math.abs( angle);
	else
		angle = Math.PI * 2 / this.aoz.degreeRadian - angle;
	return angle;
};
Utilities.prototype.getRotatedPoint = function( pivotX, pivotY, cornerX, cornerY, angle )
{
	var x, y, distance, diffX, diffY;
	diffX = cornerX - pivotX;
	diffY = cornerY - pivotY;
	distance = Math.sqrt( diffX * diffX + diffY * diffY );
	angle += Math.atan2( diffY, diffX );
	x = pivotX + distance * Math.cos( angle );
	y = pivotY + distance * Math.sin( angle );
	return { x:x, y:y };
};

Utilities.prototype.getRotatedBoxPoints = function( x, y, width, height, rotation )
{
	var x1 = x - ( width / 2 ), y1 = y - ( height / 2 ), x2 = x + ( width / 2 ), y2 = y - ( height / 2 );
	var x3 = x + ( width / 2 ), y3 = y + ( height / 2 ), x4 = x - ( width / 2 ), y4 = y + ( height / 2 );

	var c = this.getRotatedPoint( x, y, x1, y1, rotation );
	x1 = c.x; y1 = c.y;

	c = this.getRotatedPoint( x, y, x2, y2, rotation );
	x2 = c.x; y2 = c.y;

	c = this.getRotatedPoint( x, y, x3, y3, rotation );
	x3 = c.x; y3 = c.y;

	c = this.getRotatedPoint( x, y, x4, y4, rotation );
	x4 = c.x; y4 = c.y;

	return [ { x: x1, y: y1 }, { x: x2, y: y2 }, { x: x3, y: y3 }, { x: x4, y: y4 }, { x: x1, y: y1 } ];
};

///////////////////////////////////////////////////////////////////////////////
//
// Properties
//
///////////////////////////////////////////////////////////////////////////////
Utilities.prototype.getPropertyFromPath = function( root, path, throwError )
{
	var localPath = path;
	var localRoot = root;
	if ( !root )
	{
		if ( throwError )
			throw { error: throwError, parameter: 'path: "' + path + '"' };
		return undefined;
	}
	var dot = localPath.indexOf( '.' );
	while ( dot >= 0 )
	{
		var index = -1;
		var subpath = localPath.substring( 0, dot );
		var start = subpath.indexOf( '[' );
		if ( start >= 0 )
		{
			var end = subpath.indexOf( ']', start );
			if ( end >= 0 )
			{
				index = parseInt( subpath.substring( start + 1, end ) );
				subpath = subpath.substring( 0, start );
			}
		}
		localRoot = localRoot[ subpath ];
		if ( index >= 0 )
			localRoot = localRoot[ index ];
		localPath = localPath.substring( dot + 1 );
		if ( typeof localRoot == 'undefined' )
		{
			if ( throwError )
				throw { error: throwError, parameter: address };
			return undefined;
		}
		dot = localPath.indexOf( '.' );
	}

	var value, index, name;
	var start = localPath.indexOf( '[' );
	if ( start >= 0 )
	{
		var end = localPath.indexOf( ']', start );
		if ( end >= 0 )
		{
			index = parseInt( localPath.substring( start + 1, end ) );
			name = localPath.substring( 0, start );
			localRoot = localRoot[ name ];
			value = localRoot[ index ];
		}
	}
	else
	{
		name = localPath;
		index = undefined;
		value = localRoot[ localPath ];
	}
	return { root: root, localRoot: localRoot, path: path, localPath: localPath, name: name, index: index, value: value };
};
Utilities.prototype.getProperty = function( root, path, type, throwError, defaultValue )
{
	if ( !path )
	{
		if ( throwError )
			throw { error: throwError, parameter: type };
		return undefined;
	}
	if ( typeof defaultValue != 'undefined' )
		throwError = undefined;
	var property = this.getPropertyFromPath( root, path, throwError );
	if ( typeof property == 'undefined' )
		value = defaultValue;
	else
		value = property.value;
	return this.checkAndReturnValueOfType( value, type, throwError );
};
Utilities.prototype.setProperty = function( root, path, value, throwError )
{
	var property = this.getPropertyFromPath( root, path );
	if ( !property )
	{
		if ( throwError )
			throw throwError;
		return;
	}
	if ( value == '[]' )
		value = [];
	if ( value == '{}' )
		value = {};
	if ( typeof property.index != 'undefined' )
		property.localRoot[ property.index ] = value;
	else
		property.localRoot[ property.name ] = value;
};
Utilities.prototype.getPropertyType = function( root, path, throwError )
{
	var property = this.getPropertyFromPath( root, path, throwError );
	if ( property && property.value )
	{
		if ( typeof property.value == 'string' )
		{
			return 'string';
		}
		else if ( this.aoz.utilities.isObject( property.value ) )
		{
			return 'object';
		}
		else if ( this.aoz.utilities.isArray( property.value ) )
		{
			return 'array';
		}
		else
		{
			return 'number';
		}
	}
	if ( throwError )
		throw { error: throwError, parameter: type };
	return '';
};
Utilities.prototype.checkAndReturnValueOfType = function( value, type, throwError )
{
	switch ( type )
	{
		case 'string':
			if ( typeof value == 'string' )
				return value;
			break;
		case 'number':
			if ( typeof value == 'number' || typeof value == 'boolean' )
				return value;
			break;
		case 'array':
			if ( this.aoz.utilities.isArray( value ) )
				return value;
			break;
		case 'object':
			if ( !this.aoz.utilities.isObject( value ) )
				return value;
			break;
		default:
			break;
	}
	if ( throwError )
		throw { error: throwError, parameter: type };
	return undefined;
};


// Memory block class
function MemoryBlock( aoz, buffer, endian )
{
	this.aoz = aoz;
	if ( typeof buffer == 'number' )
		buffer = new ArrayBuffer( buffer );
	this.buffer = buffer;
	this.bufferView = new Uint8Array( buffer );
	this.length = this.bufferView.byteLength;
	this.endian = typeof endian != 'undefined' ? endian : 'big';
	this.isMemoryBlock = true;
};
MemoryBlock.prototype.setLength = function( newLength )
{
	if ( newLength != this.length )
	{
		if ( newLength < 0 )
			throw { error: 'illegal_function_call', parameter: newLength };

		var currentBufferView = this.bufferView;
		this.buffer = new ArrayBuffer( newLength );
		this.bufferView = new Uint8Array( this.buffer );
		var l = Math.min( newLength, this.length );
		for ( var p = 0; p < l; p++ )
			this.bufferView[ p ] = currentBufferView[ p ];
		this.length = newLength;
		return true;
	}
	return false;
};
MemoryBlock.prototype.extractString = function( address, length )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( length < 0 )
		throw { error: 'illegal_function_call', parameter: length };
	if ( address + length > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: length  };
	var result = '';
	for ( var l = 0; l < length; l++ )
	{
		var c = this.bufferView[ address + l ];
		if ( c == 0 )
			break;
		if ( c < 32 )
			c = ' ';
		result += String.fromCharCode( c );
	}
	return result;
};
MemoryBlock.prototype.extractArrayBuffer = function( start, end )
{
	start = start - Math.floor( start / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	end = end - Math.floor( end / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: length };
	var buffer = new ArrayBuffer( length );
	var view = new Uint8Array( buffer );
	for ( var l = 0; l < length; l++ )
	{
		view[ l ] = this.bufferView[ start + l ];
	}
	return buffer;
};
MemoryBlock.prototype.extractArrayBufferLength = function( start, length )
{
	start = start - Math.floor( start / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( length < 0 || start + length > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: length };
	var buffer = new ArrayBuffer( length );
	var view = new Uint8Array( buffer );
	for ( var l = 0; l < length; l++ )
	{
		view[ l ] = this.bufferView[ start + l ];
	}
	return buffer;
};
MemoryBlock.prototype.peek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	var v = this.bufferView[ address ];
	if ( signed && v >= 0x80 )
		return -( 0x100 - v );
	return v;
};
MemoryBlock.prototype.deek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + 2 > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 8 | this.bufferView[ address + 1 ] & 0xFF;
	}
	else
	{
		v = ( this.bufferView[ address + 1 ] & 0xFF ) << 8 | this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x8000 )
		return -( 0x10000 - v );
	return v;
};
MemoryBlock.prototype.leek = function( address, signed )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + 4 > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	var v;
	if ( this.endian == 'big' )
	{
		v = ( this.bufferView[ address ] & 0xFF ) << 24 | ( this.bufferView[ address + 1 ] & 0xFF ) << 16 | ( this.bufferView[ address + 2 ] & 0xFF ) << 8 | this.bufferView[ address + 3 ] & 0xFf;
	}
	else
	{
		v = ( this.bufferView[ address + 3 ] & 0xFF ) << 24 | ( this.bufferView[ address + 2 ] & 0xFF ) << 16 | ( this.bufferView[ address + 1 ] & 0xFF ) << 8 | this.bufferView[ address ] & 0xFF;
	}
	if ( signed && v >= 0x80000000 )
		return -( 0x100000000 - v );
	return v;
};
MemoryBlock.prototype.poke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFF;
	if ( address >= this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	this.bufferView[ address ] = value;
};
MemoryBlock.prototype.doke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFFFF;
	if ( address + 2 > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 8 ) & 0xFF;
		this.bufferView[ address + 1 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value >> 8 ) & 0xFF;
	}
};
MemoryBlock.prototype.loke = function( address, value )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	value &= 0xFFFFFFFF;
	if ( address + 4 > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	if ( this.endian == 'big' )
	{
		this.bufferView[ address ] = ( value >> 24 ) & 0xFF;
		this.bufferView[ address + 1 ] = ( value >> 16 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 3 ] = value & 0xFF;
	}
	else
	{
		this.bufferView[ address ] = value & 0xFF;
		this.bufferView[ address + 1 ] = ( value  >> 8 ) & 0xFF;
		this.bufferView[ address + 2 ] = ( value  >> 16 ) & 0xFF;
		this.bufferView[ address + 3 ] = ( value  >> 24 ) & 0xFF;
	}
};
MemoryBlock.prototype.pokeArrayBuffer = function( address, buffer )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var view = new Uint8Array( buffer );
	if ( address + view.length > this.bufferView.length )
		throw { error: 'illegal_function_call', parameter: address };
	for ( var b = 0; b < view.length; b++ )
		this.bufferView[ address + b ] = view[ b ];
};
MemoryBlock.prototype.poke$ = function( address, text )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	if ( address + text.length > this.bufferView.byteLength )
		throw { error: 'illegal_function_call', parameter: address };
	for ( var p = 0; p < text.length; p++ )
		this.bufferView[ address + p ] = text.charCodeAt( p ) & 0xFF;
};
MemoryBlock.prototype.peek$ = function( address, length, stop )
{
	address = address - Math.floor( address / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var text = '';
	for ( var p = 0; p < length; p++ )
	{
		var c = String.fromCharCode( this.bufferView[ address + p ] );
		if ( c == stop )
			break;
		if ( address + p > this.bufferView.byteLength )
			throw { error: 'illegal_function_call', parameter: address };
		text += c;
	}
	return text;
};
MemoryBlock.prototype.fill = function( start, end, value )
{
	start = start - Math.floor( start / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	end = end - Math.floor( end / this.aoz.memoryHashMultiplier ) * this.aoz.memoryHashMultiplier;
	var length = end - start;
	if ( length < 0 || start + length > this.bufferView.byteLength )
		throw { error: 'illegal_function_call', parameter: length  };

	for ( var p = 0; p <= length - 4; p += 4 )
		this.loke( start + p, value );
	for ( ; p < length; p++ )
	{
		if ( this.endian == 'big' )
		{
			this.poke( start + p, ( value & 0xFF000000 ) >> 24 );
			value = value << 8;
		}
		else
		{
			this.poke( start + p, value & 0xFF );
			value = value >> 8;
		}
	}
};
MemoryBlock.prototype.copyTo = function( sourceAddress, destinationBlock, destinationAddress, length )
{
	if ( sourceAdress + length > this.bufferView.byteLength || destinationAddress + length > destinationBlock.bufferView.byteLength )
		throw { error: 'illegal_function_call', parameter: length };
	if ( destinationBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = 0; p < length; p++ )
			destinationBlock.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.copyFrom = function( destinationAddress, sourceBlock, sourceAddress, length )
{
	if ( destinationAddress + length > this.bufferView.byteLength || sourceAddress + length > sourceBlock.bufferView.byteLength )
		throw { error: 'illegal_function_call', parameter: length };
	if ( sourceBlock == this )
	{
		if ( destinationAddress < sourceAddress )
		{
			for ( var p = 0; p < length; p++ )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
		else
		{
			for ( var p = length - 1; p >= 0; p-- )
				this.bufferView[ destinationAddress + p ] = this.bufferView[ sourceAddress + p ];
		}
	}
	else
	{
		for ( var p = 0; p < length; p++ )
			this.bufferView[ destinationAddress + p ] = sourceBlock.bufferView[ sourceAddress + p ];
	}
};
MemoryBlock.prototype.copyArray = function( address, sourceArray, type, length )
{
	length = typeof length == 'undefined' ? sourceArray.length : length;
	switch ( type )
	{
		default:
		case 'byte':
			for ( var p = 0; p < length; p++ )
			{
				if ( typeof sourceArray[ p ] == 'string' )
					this.poke( address + p, sourceArray[ p ].charCodeAt( 0 ) );
				else
					this.poke( address + p, sourceArray[ p ] );
			}
			break;
		case 'word':	// TODO
			debugger;
			for ( var p = 0; p < length; p++ )
			{
				if ( typeof sourceArray[ p ] == 'string' )
					this.poke( address + p * 2, sourceArray[ p ].charCodeAt( 0 ) );
				else
					this.poke( address + p, sourceArray[ p ] );
			}
			break;
		case 'dword':	// TODO
			debugger;
			for ( var p = 0; p < length; p++ )
				this.loke( address + p * 4, sourceArray[ p ] );
			break;
	}
};
MemoryBlock.prototype.hunt = function( start, end, text )
{
	var length = end - start;
	if ( length < 0 )
		throw { error: 'illegal_function_call', parameter: length };
	if ( start + text.length > this.bufferView.byteLength )
		return 0;
	for ( var i = 0; i < length - text.length; i++ )
	{
		for ( var j = 0; j < text.length; j++ )
		{
			if ( this.bufferView[ start + i + j ] != text.charCodeAt( j ) & 0xFF )
				break;
		}
		if ( j == text.length )
			return this.memoryHash * this.aoz.memoryHashMultiplier + i;
	}
	return 0;
};
MemoryBlock.prototype.getBlobUrl = function( mimeType )
{
	mimeType = typeof mimeType == 'undefined' ? 'txt/plain' : mimeType;
	var blob = new Blob( [ this.bufferView ], { type: mimeType } );
	var urlCreator = window.URL || window.webkitURL;
	return urlCreator.createObjectURL( blob );
};
Utilities.prototype.getCharacterType = function( c )
{
	if ( c >= '0' && c <= '9' )
		type = 'number';
	else if ( c == ' ' || c == "\t" )
		type = 'space';
	else if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' )
		type = 'letter';
	else if ( c == '"' || c == "'"  )
		type = 'quote';
	else if ( c == ':' )
		type = 'column';
	else if ( c == ';' )
		type = 'semicolumn';
	else if ( c == '-' || c == '–' )
		type = 'minus';
	else if ( c == '(' || c == ')' )
		type = 'bracket';
	else
		type = 'other';
	return type;
};

// Fix coordinates

Utilities.prototype.fixCoords = function( coords, scale )
{
	scale = typeof scale == 'undefined' ? { x: 1, y: 1, z: 1 } : scale;
	coords.x1 += 0.5;
	coords.x2 += 0.5;
	coords.y1 += 0.5;
	coords.y2 += 0.5;
	return { x1: coords.x1 * scale.x, y1: coords.y1 * scale.y, x2: coords.x2 * scale.x, y2: coords.y2 * scale.y };
};
Utilities.prototype.getZone = function( rectangle, vars, scale, centerPixel )
{
	rectangle = typeof rectangle == 'undefined' ? {} : rectangle;
	scale = typeof scale == 'undefined' ? { x: 1, y: 1, z: 1 } : scale;
	if ( centerPixel )
	{
		x = typeof rectangle.x == 'undefined' ? 0.5 : rectangle.x + 0.5;
		y = typeof rectangle.y == 'undefined' ? 0.5 : rectangle.y + 0.5;
	}
	else
	{
		x = typeof rectangle.x == 'undefined' ? 0 : rectangle.x;
		y = typeof rectangle.y == 'undefined' ? 0 : rectangle.y;
	}
	rectangle.width = isNaN( rectangle.width )  ? vars.width : rectangle.width;
	rectangle.height = isNaN( rectangle.height ) ? vars.height : rectangle.height;
	return { x: x * scale.x, y: y * scale.y, width: rectangle.width * scale.x, height: rectangle.height * scale.y };
};
Utilities.prototype.checkRectangle = function( rectangle, vars, dimension )
{
	rectangle.x = typeof rectangle.x != 'undefined' ? rectangle.x : vars.x;
	rectangle.y = typeof rectangle.y != 'undefined' ? rectangle.y : vars.y;
	if ( dimension )
	{
		if ( typeof rectangle.width == 'undefined' || typeof rectangle.height == 'undefined' )
			throw { error: 'illegal_function_call', parameter: '' };
		if ( rectangle.x + rectangle.width > dimension.width )
			rectangle.width = dimension.width - rectangle.x;
		if ( rectangle.y + rectangle.height > dimension.height )
			rectangle.height = dimension.height - rectangle.y;
		if ( rectangle.width <= 0 || rectangle.height <= 0 )
			throw { error: 'illegal_function_call', parameters: [ rectangle.width, rectangle.height ] };
	}
	return rectangle;
};
Utilities.prototype.makeTransparentImage = function( image )
{
	var canvas = document.createElement( 'canvas' );
	canvas.width = image.width;
	canvas.height = image.height;
	var context = canvas.getContext( '2d' );
	context.drawImage( image, 0, 0 );
	if( this.aoz.manifest.platform == 'amiga' )
	{
		this.remapBlock( context, [ { r: 0, g: 0, b: 0 } ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: image.width, height: image.height } );
	}
	return canvas;
};
Utilities.prototype.flipCanvas = function( canvas, horizontal, vertical )
{
	var flipCanvas = document.createElement( 'canvas' );
	flipCanvas.width = canvas.width;
	flipCanvas.height = canvas.height;
	var flipContext = flipCanvas.getContext( '2d' );
	flipContext.translate( horizontal ? canvas.width : 0, vertical ? canvas.height : 0 );
	flipContext.scale( horizontal ? -1 : 1, vertical ? -1 : 1 );
	flipContext.drawImage( canvas, 0, 0 );
	//flipContext.fillStyle = this.backgroundColor;
	//flipContext.fillRect( 0, 0, canvas.width, canvas.height );
	return flipCanvas;
};
Utilities.prototype.remapBlock = function( context, rgbaSource, rgbaDestination, coordinates )
{
	// Do the remapping
	if ( coordinates.width > 0 && coordinates.height > 0 )
	{
		var imageData = context.getImageData( coordinates.x, coordinates.y, coordinates.width, coordinates.height );

		var data = imageData.data;
		if ( rgbaSource.length == 1 )
		{
			rgbaSource = rgbaSource[ 0 ];
			rgbaDestination = rgbaDestination[ 0 ];
			var alpha = typeof rgbaDestination.a != 'undefined';
			for ( var p = 0; p < data.length; p += 4 )
			{
				if ( data[ p ] == rgbaSource.r && data[ p + 1 ] == rgbaSource.g && data[ p + 2 ] == rgbaSource.b )
				{
					data[ p ] = rgbaDestination.r;
					data[ p + 1 ] = rgbaDestination.g;
					data[ p + 2 ] = rgbaDestination.b;
					if ( alpha )
						data[ p + 3 ] = rgbaDestination.a;
				}
			}
		}
		else
		{
			for ( var p = 0; p < data.length; p += 4 )
			{
				for ( var c = 0; c < rgbaSource.length; c++ )
				{
					var source = rgbaSource[ c ];
					if ( data[ p ] == source.r && data[ p + 1 ] == source.g && data[ p + 2 ] == source.b )
					{
						var destination = rgbaDestination[ c ];
						data[ p ] = destination.r;
						data[ p + 1 ] = destination.g;
						data[ p + 2 ] = destination.b;
						if ( typeof destination.a != 'undefined' )
							data[ p + 3 ] = destination.a;
					}
				}
			}
		}
		context.putImageData( imageData, coordinates.x, coordinates.y );
	}
};
/**
 * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
 *
 * @param {HtmlElement} canvas
 * @param {int} width
 * @param {int} height
 * @param {boolean} resize_canvas if true, canvas will be resized. Optional.
 */
Utilities.prototype.resample_canvas = function(canvas, width, height, resize_canvas)
{
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }
    //clear and resize canvas
    if (resize_canvas === true) {
        canvas.width = width;
        canvas.height = height;
    } else {
        ctx.clearRect(0, 0, width_source, height_source);
    }

    //draw
    ctx.putImageData(img2, 0, 0);
}
Utilities.prototype.loadUnlockedImages = function( pathArray, options, callback, extra )
{
	var error = false;
	var images ={};
	var count = pathArray.length;
	for ( var p = 0; p < pathArray.length; p++ )
	{
		var path = pathArray[ p ];
		var name = this.getFilename( path );
		this.loadUnlockedImage( path, options, function( response, data, extra )
		{
			images[ extra ] = data;
			if ( !response )
				error |= true;
			count--;
			if ( count == 0 )
				callback( !error, images, extra );
		}, name );
	}
};
Utilities.prototype.loadUnlockedImage = function( path, options, callback, extra )
{
	var self = this;
	options = options ? options : {};
	var name = this.getFilename( path );
	var extension = this.getFilenameExtension( path );
	path = path.substring( 0, path.length - ( name.length + extension.length + 1 ) );
	var type = options.type;
	if ( !type )
	{
	switch ( extension.toLowerCase() )
	{
		case 'svg':
			type = 'image/svg+xml';
			extension = 'js';
			break;
		case 'gif':
				type = 'image/gif';
			extension = 'js';
			break;
		case 'jpg':
		case 'jpeg':
				type = 'image/jpeg';
			extension = 'js';
			break;
			default:
		case 'png':
				type = 'image/png';
			extension = 'js';
			break;
		}
	}
	if ( AOZ_Files[ 'image_' + name ] )
	{
		loadIt( AOZ_Files[ 'image_' + name ] );
	}
	else
	{
		this.loadScript( path + name + '.' + extension, options, function( response, data, extra )
		{
			if ( response )
			{
				loadIt( AOZ_Files[ 'image_' + name ] );
			}
			else
			{
				callback( false, null, extra );
			}
		}, extra );
	}
	function loadIt( base64 )
	{
		var arrayBuffer = self.convertStringToArrayBuffer( base64 );
		var blob = new Blob( [ arrayBuffer ], { type: type } );
		var urlCreator = window.URL || window.webkitURL;
		var imageUrl = urlCreator.createObjectURL( blob );
		var image = new Image();
		image.onload = function()
		{
			if ( extra )
			{
				extra.url = imageUrl;
				extra.type = type;
			}
			callback( image, this, extra );
		};
		image.src = imageUrl;
	}
};

Utilities.prototype.loadUnlockedSound = function( path, options, callback, extra )
{
	var self = this;
	var name = 'sound_' + this.getFilename( path );
	if ( AOZ_Files[ name ] )
	{
		loadIt( AOZ_Files[ name ] );
		if ( !options.keepSource )
			AOZ_Files[ name ] = null;
	}
	else
	{
		this.aoz.loadingMax++;
		this.loadScript( path, options, function( response, data, extra )
		{
			self.aoz.loadingCount++;
			if ( response )
			{
				var source = AOZ_Files[ name ];
				if ( source )
				{
					var pos = source.indexOf( 'base64,' );
					var buffer = self.aoz.utilities.convertStringToArrayBuffer( source.substring( pos + 7 ) );
					callback( true, buffer, extra );
					if ( !options.keepSource )
						AOZ_Files[ name ] = null;
				}
				else
				{
					callback( false, null, extra );
				}
			}
			else
			{
				callback( false, null, extra );
			}
		}, extra );
	}
};

Utilities.prototype.loadUnlockedBankElement = function( path, options, callback, extra )
{
	var self = this;
	var name = 'bank_' + this.getFilename( path );
	if ( AOZ_Files[ name ] )
	{
		callback( true, AOZ_Files[ name ] );
		//if ( !options.keepSource )
		//	AOZ_Files[ name ] = null;
	}
	else
	{
		this.loadScript( path, options, function( response, data, name2 )
		{
			if ( response )
			{
				/*
				debugger;
				if ( AOZ_Files[ 'bank_10' ] && AOZ_Files[ 'bank_11' ] )
				{
					if ( AOZ_Files[ 'bank_10' ] == AOZ_Files[ 'bank_11' ] )
					{
						var merde = 1;
					}
				}
				*/
				var arrayBuffer = self.convertStringToArrayBuffer( AOZ_Files[ name2 ] );
				//if ( !options.keepSource )
				//	AOZ_Files[ name2 ] = null;
				callback( true, arrayBuffer, extra );
			}
			else
			{
				callback( false, null, extra );
			}
		}, name );
	}
};

Utilities.prototype.findEndOfLine = function( text, pos )
{
	if ( pos >= text.length )
		return pos;

	var p1 = text.indexOf( '\r\n', pos );
	var p2 = text.indexOf( '\n', pos );
	if ( p1 >= 0 && p2 >= 0 )
	{
		if ( p2 == p1 + 1 )
			return p1;
		if ( p2 < p1 )
			return p2;
		return p1;
	}
	if ( p1 >= 0 )
		return p1;
	if ( p2 >= 0 )
		return p2;
	return text.length;
};
Utilities.prototype.findNextLine = function( text, pos )
{
	if ( pos >= text.length )
		return 0;

	if ( text.indexOf( '\r\n', pos ) == pos )
		return pos + 2;
	return pos + 1;
};
Utilities.prototype.findStartOfLine = function( text, pos )
{
	while( text.charCodeAt( pos ) != 10 && pos > 0 )
		pos--;
	if ( pos > 0 )
	{
		pos++;
		return pos;
	}
	return -1;
};

Utilities.prototype.setPixelated = function( canvas, pixelated )
{
	var context = canvas.getContext( '2d' );
	context.imageSmoothingEnabled = pixelated;
	if( context.mozImageSmoothingEnabled != undefined )	context.mozImageSmoothingEnabled = pixelated; // deprecated
	if( context.webkitImageSmoothingEnabled != undefined ) context.webkitImageSmoothingEnabled = pixelated;
	if( context.msImageSmoothingEnabled != undefined ) context.msImageSmoothingEnabled = pixelated;
	canvas.imageRendering = pixelated ? 'pixelated' : 'smooth';
};

Utilities.prototype.getBase64Image = function( img, justData )
{
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL( "image/png" );

	if( justData === true )
	{
		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}
	else
	{
		return dataURL;
	}
}

////////////////////////////////////////////////////////////////////////////
//
// Context management: aoz-3 here we come -> will drive everything!
//
////////////////////////////////////////////////////////////////////////////
function AOZContext( aoz, domain, options )
{
	this.aoz = aoz;
	this.options = options;
	this.domain = domain;
	this.contexts = {};
	this.list = {};
	this.listNames = {};
	this.listSorted = [];
	this.listSortedInContext = {};
	this.numberOfElements = 0;
	this.numberOfElementsInContext = {};
	if ( domain )
		this.addContext( domain );
};
AOZContext.prototype.addContext = function( contextName )
{
	if ( !this.contexts[ contextName ] )
	{
		this.numberOfElementsInContext[ contextName ] = 0;
		if ( this.options.sorted )
			this.listSortedInContext[ contextName ] = [];
		this.contexts[ contextName ] = true;
	}
};
AOZContext.prototype.reset = function( contextName )
{
	if ( contextName )
	{
		var temp = {};
		var count = 0;
		for ( var i in this.list )
		{
			if ( this.list[ i ].contextName != contextName )
			{
				temp[ i ] = this.list[ i ];
				count++;
			}
		}
		this.list = temp;
		this.numberOfElements = count;

		temp = {};
		count = 0;
		for ( var i in this.listNames )
		{
			if ( this.listNames[ i ].contextName != contextName )
			{
				temp[ i ] = this.listNames[ i ];
				count++;
			}
		}
		this.listNames = temp;

		this.numberOfElementsInContext[ contextName ] = 0;

		if ( this.options.sorted )
		{
			var temp = [];
			for ( var i = 0; i < this.listSorted.length; i++ )
			{
				if ( this.listSorted[ i ].contextName != contextName )
					temp.push( this.list[ i ] );
			}
			this.listSorted = temp;
			this.listSortedInContext[ contextName ] = [];
		}
	}
	else
	{
		this.list = {};
		this.listNames = {};
		this.numberOfElements = 0;
		for ( var name in this.contexts )
		{
			this.numberOfElementsInContext[ name ] = 0;
			if ( this.options.sorted )
				this.listSortedInContext[ name ] = [];
		}
	}
};
AOZContext.prototype.getElementInfosFromFilename = function( contextName, filename, type, index, indexMap )
{
	var newIndex, name;
	var firstDot = filename.indexOf( '.' );
	if ( firstDot >= 0 )
	{
		newIndex = parseInt( filename.substring( 0, firstDot ) );
		if ( !isNaN( newIndex ) )
		{
			var lastDot = filename.lastIndexOf( '.' );
			if ( lastDot >= firstDot )
			{
				name = filename.substring( firstDot + 1, lastDot );
				index = newIndex;
			}
		}
		else
		{
			newIndex = undefined;
		}
	}
	if ( typeof name == 'undefined' )
	{
		if ( firstDot >= 0 )
			name = filename.substring( 0, firstDot );
		else
			name = filename;
	}
	if ( typeof newIndex == 'undefined' )
	{
		if ( typeof index == 'undefined' )
			index = this.getFreeIndex( contextName, indexMap )
	}
	return { name: name, index: index };
};
AOZContext.prototype.getFreeIndex = function( contextName, indexMap )
{
	contextName = contextName ? contextName : this.domain;
	for ( var index = 1; index < 1000000; index++ )
	{
		if ( !this.list[ contextName + ':' + index ] )
		{
			if ( indexMap && !indexMap[ index ] )
			{
				indexMap[ index ] = true;
				return index;
			}
		}
	}
	return -1;
};
AOZContext.prototype.getElement = function( contextName, index, errorString )
{
	if ( typeof index == 'number' )
	{
		if ( index < 0 )
			throw { error: 'illegal_function_call', parameter: index };

		contextName = contextName ? contextName : this.domain;
		var contextIndex = contextName + ':' + index;
		if ( this.list[ contextIndex ] )
			return this.list[ contextIndex ];
	}
	else
	{
		contextName = contextName ? contextName : this.domain;
		var contextIndex = contextName + ':' + index;
		if ( this.listNames[ contextIndex ] )
			return this.listNames[ contextIndex ];
	}
	if ( errorString )
		throw errorString;
	return null;
};
AOZContext.prototype.getProperty = function( contextName, index, propertyName, errorString )
{
	var element = this.getElement( contextName, index, errorString );
	if ( element )
		return element[ propertyName ];
	return undefined;
};
AOZContext.prototype.setProperty = function( contextName, index, propertyName, value, errorString )
{
	var element = this.getElement( contextName, index, errorString );
	if ( element )
		element[ propertyName ] = value;
	return element;
};
AOZContext.prototype.setRangeProperties = function( contextName, first, last, propertyName, value, errorString )
{
	first = typeof first == 'undefined' ? 0 : first;
	if ( typeof last == 'undefined' )
	{
		if ( first == 0 )
		{
			this.reset( contextName );
			return;
		}
		last = this.getNumberOfElements( contextName );
	}
	if ( typeof first == 'number' && typeof last == 'number' )
	{
		if ( last < first )
			throw { error: 'illegal_function_call', parameter: '' };

		for ( var count = first; count < last; count++ )
		{
			var element = this.getElement( contextName, index, errorString );
			if ( element )
				element[ propertyName ] = value;
		}
		return;
	}
	throw 'type_mismatch';

};
AOZContext.prototype.setElement = function( contextName, element, index, replace = true, errorString = 'internal_error' )
{
	if ( typeof index == 'number' && index < 0 )
		throw { error: 'illegal_function_call', parameter: index };

	contextName = contextName ? contextName : this.domain;
	if ( typeof index == 'undefined' )
		index = this.getLastIndex( contextName );
	var contextIndex = contextName + ':' + index;
	var contextIndexName;
	if ( element.name )
		contextIndexName = contextName + ':' + element.name;
	else if ( typeof index == 'string' )
	{
		element.name = index;
		contextIndexName = contextName + ':' + index;
	}
	else
	{
		element.name = 'item_' + Math.random() * 1000000;
		contextIndexName = contextName + ':' + element.name;
	}
	if ( this.list[ contextIndex ] )
	{
		if ( !replace )
		{
			if ( errorString && errorString != '' ) throw errorString;
			console.log( 'AOZContext:setElement failed.' );
			return -1;
		}
		this.deleteElement( contextName, index );
	}

	// Insert data into element
	element.index = index;
	element.indexIsNumber = ( typeof index == 'number' );
	element.contextIndex = contextIndex;
	element.contextIndexName = contextIndexName;
	element.contextName = contextName;
	this.list[ contextIndex ] = element;
	this.listNames[ contextIndexName ] = element;
	this.numberOfElements++;
	this.numberOfElementsInContext[ contextName ]++;

	// Position in sorted list
	if ( this.options.sorted )
	{
		element.indexSorted = this.listSorted.length;
		this.listSorted.push( element );
		element.indexSortedInContext = this.listSortedInContext[ contextName ].length;
		this.listSortedInContext[ contextName ].push( element );
	}
	return index;
};
AOZContext.prototype.addElement = function( contextName, element, errorString = 'internal_error' )
{
	var index = this.numberOfElementsInContext[ contextName ];
	this.setElement( contextName, element, this.numberOfElementsInContext[ contextName ], false, errorString );
	return index;
};
AOZContext.prototype.deleteElement = function( contextName, index, errorString )
{
	if ( typeof index == 'number' && index < 0 )
		throw { error: 'illegal_function_call', parameter: index };
	contextName = contextName ? contextName : this.domain;
	var contextIndex, contextIndexName;

	if ( this.aoz.utilities.isObject( index ) )
	{
		var found;
		for ( var e in this.list )
		{
			if ( this.list[ e ] == index )
				found = this.list[ e ];
		}
		if ( found )
		{
			contextIndex = contextName + ':' + found.index;
			contextIndexName = contextName + ':' + this.list[ contextIndex ].name;
		}
		else
		{
			if ( errorString ) throw errorString;
			return;
		}
	}
	else if ( typeof index == 'string' )
	{
		contextIndexName = contextName + ':' + index;
		if ( !this.listNames[ contextIndexName ] )
		{
			if ( errorString ) throw errorString;
			return;
		}
		contextIndex = contextName + ':' + this.listNames[ contextIndexName ].index;
	}
	else
	{
		contextIndex = contextName + ':' + index;
		if ( !this.list[ contextIndex ] )
		{
			if ( errorString ) throw errorString;
			return;
		}
		contextIndexName = contextName + ':' + this.list[ contextIndex ].name;
	}
	var element = this.list[ contextIndex ];
	if ( !element )
	{
		if ( errorString ) throw errorString;
		return;
	}
	this.list = this.aoz.utilities.cleanObject( this.list, contextIndex );
	this.listNames = this.aoz.utilities.cleanObject( this.listNames, contextIndexName );

	if ( this.options.sorted )
	{
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
		for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
	this.numberOfElements--;
	this.numberOfElementsInContext[ contextName ]--;
};
AOZContext.prototype.deleteRange = function( contextName, first, last )
{
	first = typeof first == 'undefined' ? 0 : first;
	if ( typeof last == 'undefined' )
	{
		if ( typeof first == 'number' && first == 0 )
		{
			this.reset( contextName );
			return;
		}
		last = this.getNumberOfElements();
	}
	if ( typeof first == 'number' && typeof last == 'number' )
	{
		if ( last < first )
			throw { error: 'illegal_function_call', parameter: '' };

		for ( var count = first; count < last; count++ )
			this.deleteElement( contextName, count );
		return;
	}
	throw 'type_mismatch';
};
AOZContext.prototype.isAny = function( contextName )
{
	if ( contextName )
		return this.numberOfElementsInContext[ contextName ] > 0;
	return this.numberOfElements > 0;
};
AOZContext.prototype.getNumberOfElements = function( contextName )
{
	if ( contextName )
		return this.numberOfElementsInContext[ contextName ];
	return this.numberOfElements;
};
AOZContext.prototype.getHighestElementIndex = function( contextName )
{
	var higher = -1;
	for ( var i in this.list )
	{
		if ( this.list[ i ].indexIsNumber )
		{
			higher = Math.max( higher, this.list[ i ].index );
		}
	}
	return higher >= 0 ? higher : undefined;
};
AOZContext.prototype.getLowestElementIndex = function( contextName )
{
	var lower = 999999999;
	for ( var i in this.list )
	{
		if ( this.list[ i ].indexIsNumber )
		{
			lower = Math.min( lower, this.list[ i ].index );
		}
	}
	return lower != 999999999 ? lower : undefined;
};
AOZContext.prototype.getFirstElement = function( contextName )
{
	if ( this.options.sorted )
	{
		var element = null;
		if ( contextName && this.listSortedInContext[ contextName ].length > 0 )
		{
			element = this.listSortedInContext[ contextName ][ 0 ];
			this.firstIndex = element ? element.indexSortedInContext : undefined;
		}
		else if ( this.listSorted.length > 0 )
		{
			element = this.listSorted[ 0 ];
			this.firstIndex = element ? element.indexSorted : undefined;
		}
		return element;
	}
	else
	{
		this.flatList = this.aoz.utilities.flattenObject( this.list );
		this.firstIndex = 0;
		return this.flatList[ this.firstIndex ];
	}
};
AOZContext.prototype.getLastElement = function( contextName )
{
	if ( this.options.sorted )
	{
		var element = null;
		if ( contextName && this.listSortedInContext[ contextName ].length > 0 )
		{
			element = this.listSortedInContext[ contextName ][ this.listSortedInContext[ contextName ].length - 1 ];
			this.lastIndex = element ? element.indexSortedInContext : undefined;
		}
		else if ( this.listSorted.length > 0 )
		{
			element = this.listSorted[ this.listSorted.length - 1 ];
			this.lastIndex = element ? this.indexSorted : undefined;
		}
		return element;
	}
	else
	{
		this.flatList = this.aoz.utilities.flattenObject( this.list );
		this.lastIndex = this.flatList.length - 1;
		return this.flatList[ this.lastIndex ];
	}
};
AOZContext.prototype.getNextElement = function( contextName )
{
	if ( typeof this.firstIndex == 'undefined' )
		return null;

	if ( this.options.sorted )
	{
		if ( contextName && this.firstIndex < this.listSortedInContext[ contextName ].length - 1 )
			return this.listSortedInContext[ contextName ][ ++this.firstIndex ];
		else if ( this.firstIndex < this.listSorted.length - 1 )
			return this.listSorted[ ++this.firstIndex ];
	}
	else if ( this.firstIndex < this.flatList.length - 1 )
	{
		return this.flatList[ ++this.firstIndex ];
	}
	this.firstIndex = undefined;
	return null;
};
AOZContext.prototype.getPreviousElement = function( contextName )
{
	if ( !this.lastIndex )
		return null;

	if ( this.lastIndex > 0 )
	{
		if ( this.options.sorted )
		{
			if ( contextName )
				return this.listSortedInContext[ contextName ][ --this.lastIndex ];
			else
				return this.listSorted[ --this.lastIndex ];
		}
		else
		{
			return this.flatList[ --this.lastIndex ];
		}
	}
	this.lastIndex = undefined;
	return null;
};
AOZContext.prototype.sort = function( contextName, sortFunction )
{
	if ( typeof sortFunction == 'undefined' )
		sortFunction = sortIndex;
	if ( contextName )
	{
		this.listSortedInContext[ contextName ].sort( sortFunction );
		for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
	}
	this.listSorted.sort( sortFunction );
	for ( var i = 0; i < this.listSorted.length; i++ )
		this.listSorted[ i ].indexSorted = i;

	function sortIndex( a, b )
	{
		if ( a.indexIsNumber && b.indexIsNumber )
		{
			if ( a.index < b.index ) return -1;
			if ( a.index > b.index ) return 1;
			return 0;
		}
		return 0;
	}
};
AOZContext.prototype.parseSorted = function( contextName, sortFunction, callback, extra )
{
	if ( typeof sortFunction == 'undefined' )
		sortFunction = sortIndex;

	var sorted = [];
	for ( var i in this.list )
		sorted.push( this.list[ i ] );
	sorted.sort( sortFunction );
	if ( callback )
	{
	for ( var i = 0; i < sorted.length; i++ )
		callback( sorted[ i ], extra );
	}
	return sorted;

	function sortIndex( a, b )
	{
		if ( a.indexIsNumber && b.indexIsNumber )
		{
			if ( a.index < b.index ) return -1;
			if ( a.index > b.index ) return 1;
			return 0;
		}
		return 0;
	}
};
AOZContext.prototype.parseAll = function( contextName, callback, extra )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{
			for ( var index = 0; index < this.listSortedInContext[ contextName ].length; index++ )
				callback( this.listSortedInContext[ contextName ][ index ], extra );
		}
		else
		{
			for ( var index = 0; index < this.listSorted.length; index++ )
				callback( this.listSorted[ index ], extra );
		}
	}
	else
	{
		for ( var index in this.list )
			callback( this.list[ index ], extra );
	}
};
AOZContext.prototype.moveToStart = function( contextName, element )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{
			this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
			this.listSortedInContext[ contextName ].unshift( element );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSorted.unshift( element );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveToEnd = function( contextName, element )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{
			this.listSortedInContext[ contextName ].splice( element.indexSortedInContext, 1 );
			this.listSortedInContext[ contextName ].push( element );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted.splice( element.indexSorted, 1 );
		this.listSorted.push( element );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveAfter = function( contextName, source, destination )
{
	if ( this.options.sorted )
	{
		if ( contextName )
		{
			this.listSortedInContext[ contextName ].splice( source.indexSortedInContext, 1 );
			if ( source.indexSortedInContext < destination.indexSortedInContext )
				this.listSortedInContext[ contextName ].splice( destination.indexSortedInContext, 0, source );
			else
				this.listSortedInContext[ contextName ].splice( destination.indexSortedInContext + 1, 0, source );
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
				this.listSortedInContext[ contextName ][ i ].indexSortedInContext = i;
		}
		this.listSorted[ contextName ].splice( source.indexSorted, 1 );
		if ( source.indexSorted < destination.indexSorted )
			this.listSorted[ contextName ].splice( destination.indexSorted, 0, source );
		else
			this.listSorted[ contextName ].splice( destination.indexSorted + 1, 0, source );
		for ( var i = 0; i < this.listSorted.length; i++ )
			this.listSorted[ i ].indexSorted = i;
	}
};
AOZContext.prototype.moveBefore = function( contextName, source, destination )
{
	if ( this.options.sorted )
	{
		var result = [];
		if ( contextName )
		{
			for ( var i = 0; i < this.listSortedInContext[ contextName ].length; i++ )
			{
				var element = this.listSortedInContext[ contextName ][ i ];
				if ( element == destination )
				{
					source.indexSortedInContext = result.length;
					result.push( source );
					destination.indexSortedInContext = result.length;
					result.push( destination );
				}
				else if ( element != source )
				{
					element.indexSortedInContext = result.length;
					result.push( source );
				}
			}
			this.listSortedInContext[ contextName ] = result;
			result = [];
		}
		for ( var i = 0; i < this.listSorted.length; i++ )
		{
			var element = this.listSorted[ i ];
			if ( element == destination )
			{
				source.indexSorted = result.length;
				result.push( source );
				destination.indexSorted = result.length;
				result.push( destination );
			}
			else if ( element != source )
			{
				element.indexSorted = result.length;
				result.push( source );
			}
		}
		this.listSorted = result;
	}
};

// Line parser
LineParser = function ( aoz, line, mode )
{
	this.aoz = aoz;
	this.line = line;
	this.position = 0;
	this.mode = mode;
	this.endOfLine = false;
};
/*
LineParser.prototype.extractNextWord = function( throwError )
{
	var result =
	{
		type: 'undefined',
		value: undefined
	};

	this.skipSpaces();
	if ( this.endOfLine )
		return result;
	do
	{
		var c = this.extractNextChar();
		if ( this.endOfLine )
		{
			this.endOfLine = false;
			return result;
		}

		switch ( c )
		{
			if ( mode == 'md' )
			{
				if ( c == 32 || c == 9 && result != '' )
					break;
			}
			else if ( mode == 'STOSanim' )
			{
				if ( c == '"' || c == "'" )
				{
					result.type = 'string';
					result.value = this.aoz.utilities.extract( this.line, this.position - 1 );
					this.position += this.aoz.utilities.extractString( this.line, this.position - 1, { toGet: 'parsedlength' } );
				}
				else if ( c == ',' || c == '(' || c == ')' )
				{
					result.type = 'separator';
					result.value = c;
				}
				else if ( c >= "0" || c <= "9" || c == '-' || c == '–' )
				{
					result.type = this.aoz.utilities.extractNumber( this.line, this.position - 1, { toGet: 'type' } );
					result.value = this.aoz.utilities.extractNumber( this.line, this.position - 1, { toGet: 'value' } );
					this.position += this.aoz.utilities.extractString( this.line, this.position - 1, { toGet: 'parsedlength' } );
				}
				else if ( throwError )
				{
					throw throwError;
				}
			}
			result += c;
		}
	} while( true );
	return result;
};
*/
LineParser.prototype.extractNextChar = function()
{
	if ( this.position.length < this.line.length )
		return this.line.charAt( this.position++ );
	this.endOfLine = true;
	return '';
};
LineParser.prototype.get = function( type )
{
	return this.aoz.utilities.extractFromString( this.line, this.position, type );
};
LineParser.prototype.extract = function( type, throwError, options )
{
	var result = this.aoz.utilities.extractFromString( this.line, this.position, type, throwError, options );
	this.position = Utilities.AOZTEMPRETURN_end_position;
	this.endOfLine = ( this.position >= this.line.length );
	return result;
};
LineParser.prototype.getToEndOfLine = function()
{
	if ( this.position.length < this.line.length )
		return this.line.substring( this.position );
	return '';
};
LineParser.prototype.skipSpaces = function()
{
	this.aoz.utilities.skipTheSpaces( this.line, this.position );
	this.position = Utilities.AOZTEMPRETURN_end_position;
	this.endOfLine = ( this.position >= this.line.length );
}
