/*@****************************************************************************
*
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
*
****************************************************************************@*/
//
// The Rainbow Instructions
// By Francois Lionet
// Version 0.99
// 04/11/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_rainbows( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFJhaW5ib3cgSW5zdHJ1Y3Rpb25zIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0IiwidmVyc2lvbiI6IlZlcnNpb24gMC45OSIsImRhdGUiOiIwNC8xMS8yMDE5IiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAxOSIsInN0YXJ0IjoicmFpbmJvd3MuYW96IiwibmFtZSI6InJhaW5ib3dzIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6W10sImZyIjpbXX0sImluY2x1ZGVQYXRocyI6W119LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJlcnJvcnMiOnt9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_rainbows';
	this.aoz[ "module" + "Rainbows" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/rainbows/rainbows.aoz
		aoz.sourcePos="0:41:0";
		// Javascript
		this.banks = this.aoz.banks;
		this.utilities = this.aoz.utilities;
		this.aoz.moduleRainbows = this;
		this.context = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: true } );
		this.Rainbow = function( aoz, name, ink, height, red$, green$, blue$, alpha$, calculation$ )
		{
			this.aoz = aoz;
			this.name = name;
			this.vars =
			{
				type: 'linear',
				x: 0,
				y: undefined,
				z: 0,
				width: this.aoz.renderingContext.width,
				height: undefined,
				depth: 0,
				offsetX: 0,
				offsetY: 0,
				offsetZ: 0,
				hotspotX: 0,
				hotspotY: 0,
				hotspotZ: 0,
				angle: 0,
				circle1X: 0,
				circle1Y: 0,
				circle1Ray: 0,
				circle2X: 0,
				circle2Y: 0,
				circle2Ray: 960,
				apperture: 360 * this.aoz.degreeRadian,
				calculation: typeof calculation$ != 'undefined' ? calculation$ : 'default',
				ink: 0
			}
			this.aoz.turnIntoObject( this, {}, {},
			{
			} )
			this.screensIn = [];
			this.toFront = true;
			this.toBack = false;
			red$ = typeof red$ == 'undefined' ? '' : red$;
			green$ = typeof green$ == 'undefined' ? '' : green$;
			blue$ = typeof blue$ == 'undefined' ? '' : blue$;
			alpha$ = typeof alpha$ == 'undefined' ? '' : alpha$;
			this.calculate( red$, green$, blue$, alpha$, height );
		}
		this.Rainbow.prototype.setPosition = function( position, fromInstruction )
		{
			this.aoz.setPosition( position, fromInstruction );
		};
		this.Rainbow.prototype.setSize = function( dimension, fromInstruction )
		{
			if ( dimension.height < 0 )
				throw { error: 'illegal_function_call', parameter: dimension.height };
			this.aoz.setSize( position, fromInstruction );
		};
		this.Rainbow.prototype.setOffset = function( position, fromInstruction )
		{
			if ( typeof position.y != 'undefined' )
				position.y = position.y % this.bufferHeight;
			this.aoz.setOffset( position, fromInstruction );
		};
		this.Rainbow.prototype.getOffset = function( fromInstruction )
		{
			if ( !fromInstruction )
				return this.offset;
			return this.get_fromInstruction( 'offset', fromInstruction );
		};
		this.Rainbow.prototype.getPosition = function( fromInstruction )
		{
			if ( !fromInstruction )
				return this.position;
			return this.get_fromInstruction( 'y', fromInstruction );
		};
		this.Rainbow.prototype.getSize = function( fromInstruction )
		{
			if ( !fromInstruction )
				return this.height;
			return this.get_fromInstruction( 'height', fromInstruction );
		};
		this.Rainbow.prototype.setType = function( type )
		{
			this.vars.type = type;
		};
		this.Rainbow.prototype.getType = function()
		{
			return this.vars.type;
		};
		this.Rainbow.prototype.getGradientString = function( args )
		{
			offset = typeof args.offset == 'undefined' ? this.vars.offsetY : args.offset;
			height = typeof args.height == 'undefined' ? this.vars.height : args.height;
			offset = typeof offset == 'undefined' ? 0 : offset;
			height = typeof height == 'undefined' ? this.redBuffer.length : height;
			return this.addColorStops( null, offset, height, args.noAlpha );
		};
		this.Rainbow.prototype.render = function( context, info )
		{
			var self = this;
			var xDraw = ( this.vars.x - info.hardLeftX ) * info.xRatioDisplay + info.xLeftDraw;
			var yDraw = ( this.vars.y - info.hardTopY ) * info.yRatioDisplay + info.yTopDraw;
			var widthDraw = this.vars.width * info.xRatioDisplay;
			var heightDraw = this.vars.height * info.yRatioDisplay;
			context.save();
			if ( info.clip )
			{
				var path = new Path2D();
				path.rect( info.clip.x, info.clip.y, info.clip.width, info.clip.height );
				context.clip( path );
			}
			if ( this.vars.type == "amiga" )
			{
				if ( typeof this.vars.y != 'undefined' && typeof this.vars.height != 'undefined' )
				{
					var gradient = context.createLinearGradient( xDraw, yDraw, xDraw, yDraw + heightDraw );
					this.addColorStops( gradient, this.vars.offsetY, this.vars.height );
					context.fillStyle = gradient;
					context.fillRect( 0, yDraw, info.width, heightDraw );
				}
			}
			else if ( this.vars.type == "linear" )
			{
				if ( typeof this.vars.y != 'undefined' && typeof this.vars.height != 'undefined' )
				{
					var rotated1 = this.aoz.utilities.getRotatedPoint( xDraw, yDraw, xDraw, yDraw - heightDraw / 2, this.vars.angle * this.aoz.degreeRadian );
					var rotated2 = this.aoz.utilities.getRotatedPoint( xDraw, yDraw, xDraw, yDraw + heightDraw / 2, this.vars.angle * this.aoz.degreeRadian );
					var gradient = context.createLinearGradient( rotated1.x, rotated1.y, rotated2.x, rotated2.y );
					this.addColorStops( gradient, this.vars.offsetY, this.vars.height );
					context.fillStyle = gradient;
					var rotated = this.aoz.utilities.getRotatedBoxPoints( xDraw, yDraw, widthDraw, heightDraw, this.vars.angle * this.aoz.degreeRadian );
					context.beginPath();
					context.moveTo( rotated[ 0 ].x, rotated[ 0 ].y );
					context.lineTo( rotated[ 1 ].x, rotated[ 1 ].y );
					context.lineTo( rotated[ 2 ].x, rotated[ 2 ].y );
					context.lineTo( rotated[ 3 ].x, rotated[ 3 ].y );
					context.lineTo( rotated[ 0 ].x, rotated[ 0 ].y );
					context.closePath();
					context.fill();
				}
			}
			else if ( this.vars.type == "radial" )
			{
				if ( typeof this.vars.x != 'undefined' && typeof this.vars.y != 'undefined' )
				{
					var rotated1 = this.aoz.utilities.getRotatedPoint( xDraw, yDraw, xDraw + this.vars.circle1X * info.xRatioDisplay, yDraw + this.vars.circle1Y * info.yRatioDisplay, this.vars.angle * this.aoz.degreeRadian ) ;
					var rotated2 = this.aoz.utilities.getRotatedPoint( xDraw, yDraw, xDraw + this.vars.circle2X * info.xRatioDisplay, yDraw + this.vars.circle2Y * info.yRatioDisplay, this.vars.angle * this.aoz.degreeRadian ) ;
					var gradient = context.createRadialGradient( rotated1.x, rotated1.y, this.vars.circle1Ray * info.xRatioDisplay, rotated2.x, rotated2.y, this.vars.circle2Ray * info.xRatioDisplay );
					this.addColorStops( gradient, this.vars.offsetY + this.vars.circle1Ray, this.vars.circle2Ray - this.vars.circle1Ray );
					context.fillStyle = gradient;
					context.beginPath();
					context.ellipse( xDraw, yDraw, this.vars.circle1Ray * info.xRatioDisplay, this.vars.circle1Ray * info.xRatioDisplay, this.vars.angle * this.aoz.degreeRadian, -this.vars.apperture * this.aoz.degreeRadian, this.vars.apperture * this.aoz.degreeRadian, false );
					context.ellipse( xDraw, yDraw, this.vars.circle2Ray * info.xRatioDisplay, this.vars.circle2Ray * info.xRatioDisplay, this.vars.angle * this.aoz.degreeRadian, this.vars.apperture * this.aoz.degreeRadian, -this.vars.apperture * this.aoz.degreeRadian, true );
					context.closePath();
					context.fill();
				}
			}
			else if ( this.vars.type == "conic" )
			{
				if ( typeof this.vars.x != 'undefined' && typeof this.vars.y != 'undefined' )
				{
					if ( context.createConicGradient )
					{
						var gradient = context.createConicGradient( this.vars.angle * this.aoz.degreeRadian, xDraw, yDraw );
						this.addColorStops( gradient, this.vars.offsetY + this.vars.circle1Ray, this.vars.circle2Ray - this.vars.circle1Ray );
						context.fillStyle = gradient;
						context.beginPath();
						context.ellipse( xDraw, yDraw, this.vars.circle1Ray * info.xRatioDisplay, this.vars.circle1Ray * info.xRatioDisplay, this.vars.angle * this.aoz.degreeRadian, -this.vars.apperture * this.aoz.degreeRadian, this.vars.apperture * this.aoz.degreeRadian, false );
						context.ellipse( xDraw, yDraw, this.vars.circle2Ray * info.xRatioDisplay, this.vars.circle2Ray * info.xRatioDisplay, this.vars.angle * this.aoz.degreeRadian, this.vars.apperture * this.aoz.degreeRadian, -this.vars.apperture * this.aoz.degreeRadian, true );
						context.closePath();
						context.fill();
					}
				}
			}
				context.restore();
		};
		this.Rainbow.prototype.addColorStops = function( gradient, position, height, noAlpha )
		{
			var text = '';
			var length = this.redBuffer.length;
			if ( position >= 0 )
				position = position % length;
			else
				position = length + ( position % length );
			position = Math.max( 0, Math.min( this.redBuffer.length - 1, position ) );
			var countY = 0;
			var deltaR = 0, deltaG = 0, deltaB = 0, deltaA = 0;
			var oldR = 0, oldG = 0, oldB = 0, oldA = 0;
			var first = true;
			for ( var y = 0; y < height; y++ )
			{
				var r = this.redBuffer[ position ];
				var g = this.greenBuffer[ position ];
				var b = this.blueBuffer[ position ];
				var a = this.alphaBuffer[ position ];
				if ( typeof r == 'undefined' || typeof g == 'undefined' || typeof b == 'undefined' || typeof a == 'undefined' )
					debugger;
				if ( this.aoz.useShortColors )
				{
					r &= 15; r = ( r << 4 ) | r;
					g &= 15; g = ( g << 4 ) | g;
					b &= 15; b = ( b << 4 ) | b;
				}
				var todo = first;
				if ( r != oldR )
				{
					if ( Math.sign( r - oldR ) != Math.sign( deltaR ) )
						todo = true;
					oldR = r;
					deltaR = r - oldR;
				}
				if ( g != oldR )
				{
					if ( Math.sign( g - oldG ) != Math.sign( deltaR ) )
						todo = true;
					oldG = g;
					deltaG = g - oldG;
				}
				if ( b != oldB )
				{
					if ( Math.sign( b - oldB ) != Math.sign( deltaR ) )
						todo = true;
					oldB = b;
					deltaB = b - oldB;
				}
				if ( a != oldA )
				{
					if ( Math.sign( a - oldA ) != Math.sign( deltaA ) )
						todo = true;
					oldA = a;
					deltaA = a - oldA;
				}
				first = false;
				if ( todo )
				{
					if ( gradient )
					{
						if ( !( typeof r == 'undefined' || typeof g == 'undefined' || typeof b == 'undefined' || typeof a == 'undefined' ) )
						{
						try
						{
							gradient.addColorStop( y / height, this.aoz.utilities.getRGBAString( r, g, b, a ) );
						}
						catch( e )
						{
							debugger;
						}
					}
					else
					{
							return '';                        
						}
					}
					else
					{
						text += this.aoz.str$( ( y / height ) * 100, 2 ).substring( 1 ) + ',' + this.aoz.utilities.getRGBAString( r, g, b, noAlpha ? undefined : a ) + ',';
					}
				}
				if ( ++position >= length )
					position = 0;
			}
			if ( gradient )
				gradient.addColorStop( 1, this.aoz.utilities.getRGBAString( r, g, b, a ) );
			else
				text += y / height + ',' + this.aoz.utilities.getRGBAString( r, g, b, noAlpha ? undefined : a );
			return text;
		};
		this.Rainbow.prototype.setModified = function()
		{
			this.modified++;
			this.aoz.renderingContext.setModified();
		};
		this.Rainbow.prototype.update = function()
		{
			if ( this.modified )
			{
				this.modified = 0;
				this.redraw();
			}
		};
		this.Rainbow.prototype.redraw = function()
		{
		};
		this.Rainbow.prototype.calculate = function( red$, green$, blue$, alpha$, height )
		{
			var self = this;
			if ( height < 0 )
				throw { error: 'illegal_function_call', parameter: height };
			var red = interpret( red$ );
			var green = interpret( green$ );
			var blue = interpret( blue$ );
			var alpha = interpret( alpha$ );
			this.redBuffer = calculate( red );
			this.greenBuffer = calculate( green );
			this.blueBuffer = calculate( blue );
			if ( alpha != '' )
				this.alphaBuffer = calculate( alpha, 255 );
			else
			{
				var a = 255;
				for ( var p = 0; p < this.redBuffer.length; p++ )
				{
					var r = this.redBuffer[ p ];
					var g = this.redBuffer[ g ];
					var b = this.redBuffer[ b ];
					var luminance = ( 0.2126 * r + 0.7152 * g + 0.0722 * b )
				}
			}
			var self = this;
			function interpret( string$ )
			{
				var definition = [];
				if ( string$ != '' )
				{
					var destination = 0;
					var info = new Information( self.aoz, string$ );
					var c = info.getNextChar();
					do
					{
						if ( info.eol || c != '(' )
							throw 'syntax_error_in_rainbow_string';
						var lines = info.getNumber();
						c = info.getNextChar();
						if ( info.eol || c != ',' )
							throw 'syntax_error_in_rainbow_string';
						var delta = info.getNumber();
						c = info.getNextChar();
						if ( info.eol || c != ',' )
							throw 'syntax_error_in_rainbow_string';
						var count = info.getNumber();
						c = info.getNextChar();
						if ( c != ')' )
							throw 'syntax_error_in_rainbow_string';
						definition[ destination ] =
						{
							lines: lines,
							delta: delta,
							count: count
						};
						destination++;
						c = info.getNextChar();
					} while( !info.eol );
				}
				else
				{
					definition.push( { lines: 1000, delta: 0, count: 1000 } );
				}
				return definition;
			};
			function calculate( definition, color )
			{
				var lineBuffer = [];
				var line, count;
				var position = 0;
				var line = 0;
				var angle = 0;
				color = typeof color == 'undefined' ? 0 : color;
				do
				{
					for ( var count = 0; count < definition[ position ].count && line < height; count++ )
					{
						for ( l = 0; l < definition[ position ].lines && line < height; l++ )
							lineBuffer[ line++ ] = color;
						switch ( self.vars.calculation )
						{
							case 'cosine':
								angle += definition[ position ].delta / 256 * Math.PI * 2;
								color =  128 + Math.floor( 127 * Math.cos( angle ) );       //definition[ position ].delta;
								break;
							case 'sine':
								angle += definition[ position ].delta / 256 * Math.PI * 2;
								color =  128 + Math.floor( 127 * Math.sin( angle ) );       //definition[ position ].delta;
								break;
							default:
								color += definition[ position ].delta;
								color &= 255;
								break;
						}
					}
					position++;
					if ( position >= definition.length )
						position = 0;
				} while( line < height );
				return lineBuffer;
			};
		};
		this.Rainbow.prototype.setRain = function( y, color )
		{
			var rgb = this.aoz.utilities.getRGBColors( color, this.aoz.useShortColors );
			if ( y < 0 )
				throw { error: 'illegal_function_call', parameter: y };
			y = y % this.redBuffer.length;
			this.redBuffer[ y ] = rgb.r;
			this.greenBuffer[ y ] = rgb.g;
			this.blueBuffer[ y ] = rgb.b;
			this.setModified();
		};
		this.Rainbow.prototype.getRain = function( y )
		{
			if ( y < 0 )
				throw { error: 'illegal_function_call', parameter: y };
			y = y % this.redBuffer.length;
			return this.aoz.utilities.getRGBA( this.redBuffer[ y ], this.greenBuffer[ y ], this.blueBuffer[ y ], 0, this.aoz.useShortColors );
		};
		this.Rainbow.prototype.setRender = function( args )
		{
			if ( typeof args.screen != 'undefined' )
			{
				var screen = args.screen;
				if ( !this.aoz.utilities.isObject( screen ) )
					screen = this.aoz.getScreen( screen );
				var found = false;
				for ( var s = 0; s < this.screensIn.length; s++ )
				{
					if ( this.screensIn[ s ] == this )
					{
						found = true;
						break;
					}
				}
				if ( !found )
					this.screensIn.push( screen );
				this.toBack = false;
				this.toFront = false;
			}
			else if ( args.back )
			{
				this.toBack = true;
				this.toFront = false;
				this.screensIn = [];
			}
			else
			{
				this.toBack = false;
				this.toFront = true;
				this.screensIn = [];
			}
		}
		this.RainbowNew = function( aoz, name, args )
		{
			this.aoz = aoz;
			this.name = name;
			this.vars = 
			{
				type: 'linear',
				x: 0,
				y: undefined,
				z: 0,
				width: this.aoz.renderingContext.width,
				height: undefined,
				depth: 0,
				offsetX: 0,
				offsetY: 0,
				offsetZ: 0,
				hotspotX: 0,
				hotspotY: 0,
				hotspotZ: 0,
				angle: 0,
				circle1X: 0,
				circle1Y: 0,
				circle1Ray: 0,
				circle2X: 0,
				circle2Y: 0,
				circle2Ray: 960,
				apperture: 360 * this.aoz.degreeRadian,
				ink: 0
			}
			this.aoz.turnIntoObject( this, {}, {}, 
			{
			} )
			this.screensIn = [];
			this.toFront = true;
			this.toBack = false;
			this.calculate( args );
			this.args = args;
			for ( var p in this.aoz.moduleRainbows.Rainbow.prototype )
			{
				if ( typeof this.aoz.moduleRainbows.RainbowNew.prototype[ p ] == 'undefined' )
					this.aoz.moduleRainbows.RainbowNew.prototype[ p ] = this.aoz.moduleRainbows.Rainbow.prototype[ p ];
			}
		}
		this.RainbowNew.prototype.calculate = function( args, duration )
		{
			var self = this;
			var rgbStart, rgbEnd;        
			var height = args.height;
			if ( height < 0 )
				throw { error: 'illegal_function_call', parameter: height };
			function makeTween( color, arrayToFill, duration )
			{
				var repeat = undefined;
				var plusOffset = 0;
				if ( duration < arrayToFill.length )
				{
					repeat = Math.floor( arrayToFill.length / duration );
					plusOffset = duration;
				}
				var offsetPosition = 0;
				var previousPosition = 0;
				var argsTween =
				{
					group: 'manual',
					in: rgbStart[ color ],
					out: rgbEnd[ color ],
					easing: args.easing,
					inOut: args.inOut,
					duration: duration,
					yoyo: true,
					repeat: repeat,
					deleleAtEnd: true,
					onUpdate: function( value, elapsed )
					{
						var position = offsetPosition + Math.floor( elapsed * duration );
						var newPosition = position;
						if ( position < arrayToFill.length )
							arrayToFill[ position ] = Math.floor( value.value );
						while ( --position >= previousPosition )
						{
							if ( position < arrayToFill.length )
								arrayToFill[ position ] = Math.floor( value.value );
						}
						previousPosition = newPosition;
						console.log( 'position: ' + position );
					},
					onRepeat: function( value, elapsed )
					{
						offsetPosition += plusOffset;
					}
				}
				return self.aoz.ext_tween.tween( self.name + '_' + color, argsTween );            
			}
			this.redBuffer = new Array( height );
			this.greenBuffer = new Array( height );
			this.blueBuffer = new Array( height );
			this.alphaBuffer = new Array( height );
			if ( args.alpha )
			{
				rgbStart = this.aoz.utilities.getRGBAColors( args.colorStart );
				rgbEnd = this.aoz.utilities.getRGBAColors( args.colorEnd );
			}
			else
			{
				rgbStart = this.aoz.utilities.getRGBColors( args.colorStart );
				rgbEnd = this.aoz.utilities.getRGBColors( args.colorEnd );
				rgbStart.a = 255;
				rgbEnd.a = 255;
			}
			var redDuration = Math.floor( Math.max( height * args.redSpeed ) );
			var greenDuration = Math.floor( Math.max( height * args.blueSpeed ) );
			var blueDuration = Math.floor( Math.max( height * args.greenSpeed ) );
			var alphaDuration = Math.floor( Math.max( height * args.alphaSpeed ) );
			var tweenRed = makeTween( 'r', this.redBuffer, redDuration );
			this.aoz.ext_tween.update( tweenRed, height );
			this.aoz.ext_tween.deleteTween( tweenRed );
			var tweenGreen = makeTween( 'g', this.greenBuffer, greenDuration );
			this.aoz.ext_tween.update( tweenGreen, height );
			this.aoz.ext_tween.deleteTween( tweenGreen );
			var tweenBlue = makeTween( 'b', this.blueBuffer, blueDuration );
			this.aoz.ext_tween.update( tweenBlue, height );
			this.aoz.ext_tween.deleteTween( tweenBlue );
			var tweenAlpha = makeTween( 'a', this.alphaBuffer, alphaDuration );
			this.aoz.ext_tween.update( tweenAlpha, height );
			this.aoz.ext_tween.deleteTween( tweenAlpha );
		};
		function Information( aoz, line )
		{
			this.aoz = aoz;
			this.position = 0;
			this.line = line;
			this.eol = false;
		};
		Information.prototype.getNumber = function()
		{
			this.skipSpaces();
			if ( this.eol )
				return;
			this.text = '';
			this.type = 'empty';
			var c = this.line.charAt( this.position );
			if ( c == '-' )
			{
				this.position++;
				this.skipSpaces();
				if ( this.eol )
					return;
				this.text += '-';
				c = this.line.charAt( this.position );
			}
			if ( this.aoz.utilities.getCharacterType( c ) == 'number' )
			{
				this.text += c;
				this.position++;
				while( this.position < this.line.length )
				{
					c = this.line.charAt( this.position );
					if ( !( c >= '0' && c <= '9' ) )
						break;
					this.text += c;
					this.position++;
				}
				var value = parseInt( this.text );
				if ( isNaN( value ) )
					return undefined;
				return value;
			}
		};
		Information.prototype.skipSpaces = function()
		{
			this.eol = false;
			while( this.position < this.line.length && ( this.line.charCodeAt( this.position ) == 32 || this.line.charCodeAt( this.position ) == 9 ) )
				this.position++;
			if ( this.position >= this.line.length )
				this.eol = true;
		};
		Information.prototype.getNextChar = function()
		{
			this.skipSpaces();
			var c = this.line[ this.position++ ];
			if ( this.position.length > this.line.length )
				this.eol = true;
			return c;
		};
		this.setRainbow = function( index, ink, height, red$, green$, blue$, alpha$, calculation$ )
		{
			var rainbow = new this.Rainbow( this.aoz, 'rainbow_' + index, ink, height, red$, green$, blue$, alpha$, calculation$ );
			this.context.setElement( this.aoz.currentContextName, rainbow, index, true );
		};
		this.setNewRainbow = function( index, args )
		{
			var rainbow = new this.RainbowNew( this.aoz, 'rainbow_' + index, args );
			this.context.setElement( this.aoz.currentContextName, rainbow, index, true );
		};
		this.setRender = function( args )
		{
			var rainbow = this.context.getElement( this.aoz.currentContextName, args.index, 'rainbow_not_defined' );
			rainbow.setRender( args );
		};
		this.deleteRainbow = function( index )
		{
			this.context.deleteElement( this.aoz.currentContextName, index, 'rainbow_not_defined' );
		};
		this.getGradientString = function( args )
		{
			return this.context.getElement( this.aoz.currentContextName, args.index, 'rainbow_not_defined' ).getGradientString( args );
		};
		this.getRainbow = function( index, errors )
		{
			return this.context.getElement( this.aoz.currentContextName, index, errors ? 'rainbow_not_defined' : undefined );
		};
		this.setRain = function( color, index, y )
		{
			this.context.getElement( this.aoz.currentContextName, index, 'rainbow_not_defined' ).setRain( y, color );
		};
		this.getRain = function( index, y )
		{
			return this.context.getElement( this.aoz.currentContextName, index, 'rainbow_not_defined' ).getRain( y );
		};
		this.setDisplay = function( args )
		{
			var r = this.aoz.moduleRainbows.context.getElement( this.aoz.currentContextName, args.index, 'rainbow_not_defined' );
			r.setPosition( { x: args.x, y: args.y } );
			r.setOffset( { y: args.offset } );
			r.setSize( { width: args.width, height: args.height } );
			r.setAngle( { z: args.angle } );
			if ( args.type == 'radial' || args.type == 'conic' )
			{
				r.vars.circle1X = typeof args.circle1X != 'undefined' ? args.circle1X : r.vars.circle1X;
				r.vars.circle1Y = typeof args.circle1Y != 'undefined' ? args.circle1Y : r.vars.circle1Y;
				r.vars.circle2X = typeof args.circle2X != 'undefined' ? args.circle2X : r.vars.circle2X;
				r.vars.circle2Y = typeof args.circle2Y != 'undefined' ? args.circle2Y : r.vars.circle2Y;
				r.vars.circle1Ray = typeof args.circle1Ray != 'undefined' ? args.circle1Ray : r.vars.circle1Ray;
				r.vars.circle2Ray = typeof args.circle2Ray != 'undefined' ? args.circle2Ray : r.vars.circle2Ray;
				r.vars.apperture = typeof args.apperture != 'undefined' ? args.apperture : r.vars.apperture;
			}
			r.setType( args.type );
		}
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
