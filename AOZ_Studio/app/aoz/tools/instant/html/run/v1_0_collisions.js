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
// The Look at that! Collision Instructions
// By Francois Lionet
// Version 0.99
// 30/01/2020
// (c) AOZ Studio 2019-2020
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function v1_0_collisions( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIExvb2sgYXQgdGhhdCEgQ29sbGlzaW9uIEluc3RydWN0aW9ucyIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDAuOTkiLCJkYXRlIjoiMzAvMDEvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTktMjAyMCIsInN0YXJ0IjoiY29sbGlzaW9ucy5hb3oiLCJuYW1lIjoiY29sbGlzaW9ucyJ9LCJjb21waWxhdGlvbiI6eyJub1dhcm5pbmciOlsiaW5zdHJ1Y3Rpb25fbm90X2ltcGxlbWVudGVkIl0sImVycm9ycyI6eyJlbiI6W10sImZyIjpbXX0sImRpc3BsYXlFbmRBbGVydCI6ZmFsc2UsInVzZUFzc2V0c1Jlc291cmNlcyI6ZmFsc2V9LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJlcnJvcnMiOnt9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_collisions';
	this.aoz[ "module" + "Collisions" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/collisions/collisions.aoz
		aoz.sourcePos="0:42:0";
		// Javascript
			this.aoz.collisions = this;					// TODO: remove
			this.aoz.moduleCollisions = this;
			this.collisionList = {};
			this.response = new SAT.Response();
			this.setCollide = function( type, index, list )
			{
				var channel = index;
				if ( !this.aoz.utilities.isObject( index ) )
					channel = this.aoz.getObjectFromType( type, index, "_not_defined" );
				channel.collisionCategories = list;
			};
			this.setCollideWith = function( type, index, list )
			{
				var channel = index;
				if ( !this.aoz.utilities.isObject( index ) )
					channel = this.aoz.getObjectFromType( type, index, "_not_defined" );
				channel.collisionWith = {};
				for ( var c = 0; c < list.length; c++ )
					channel.collisionWith[ list[ c ] ] = true;
			};
			this.isToCollide = function( channel1, channel2 )
			{
				if ( channel1.collisionCategories )
				{
					if ( channel2.collisionWith )
					{
						for ( var c = 0; c < channel1.collisionCategories.length; c++ )
						{
							if ( channel2.collisionWith[ channel1.collisionCategories[ c ] ] )
								return true;
						}
					}
					return false;
				}
				return true;
			};
			this.spriteCol = function( index, from, to )
			{
				var sprite = this.aoz.sprites.get( index, this.aoz.currentContextName );
				if ( sprite )
				{
					sprite.updateCollisionData( true );								// IDEA: a callback
					from = typeof from == 'undefined' ? 0 : from;
					to = typeof to == 'undefined' ? this.aoz.sprites.getHighestIndex() : to;
					if ( from < 0 || to < 0 || from > to )
						throw { error: 'illegal_function_call', parameters: [ from, to ] };
					this.collisionList = {};
					var collision = false;
					for ( var s = from; s <= to; s++ )
					{
						var testSprite = this.aoz.sprites.get( s );
						if ( testSprite && testSprite != sprite && this.isToCollide( sprite, testSprite ) )
						{
							testSprite.updateCollisionData( true );			// IDEA: transmit the other so it can go faster
							if ( this.isColliding( sprite, testSprite ) )
							{
								this.collisionList[ s ] = true;
								collision = true;
							}
						}
					}
					return collision;
				}
				return false;
			};
			this.spriteBobCol = function( spriteIndex, screen, from, to )
			{
				var sprite = this.aoz.sprites.get( spriteIndex, this.aoz.currentContextName );
				if ( sprite )
				{
					sprite.updateCollisionData( true );
					from = typeof from == 'undefined' ? 0 : from;
					to = typeof to == 'undefined' ? screen.getHighestBobIndex() : to;
					if ( from < 0 || to < 0 || from > to )
						throw { error: 'illegal_function_call', parameters: [ from, to ] };
					this.collisionList = {};
					var collision = false;
					for ( var b = from; b <= to; b++ )
					{
						var bob = screen.getBob( b );
						if ( bob && this.isToCollide( sprite, bob ) )
						{
							bob.updateCollisionData( true );
							if ( this.isColliding( sprite, bob ) )
							{
								this.collisionList[ b ] = true;
								collision = true;
							}
						}
					}
					return collision;
				}
				return false;
			};
			this.bobSpriteCol = function( bobIndex, screen, from, to )
			{
				var bob = screen.getBob( bobIndex );
				if ( bob )
				{
					bob.updateCollisionData( true );
					from = typeof from == 'undefined' ? 0 : from;
					to = typeof to == 'undefined' ? this.aoz.sprites.getHighestIndex() : to;
					if ( from < 0 || to < 0 || from > to )
						throw { error: 'illegal_function_call', parameters: [ from, to ] };
					this.collisionList = {};
					var collision = false;
					for ( var s = from; s <= to; s++ )
					{
						var sprite = this.aoz.sprites.get( s );
						if ( sprite && this.isToCollide( bob, sprite ))
						{
							sprite.updateCollisionData( true );
							if ( this.isColliding( bob, sprite ) )
							{
								this.collisionList[ s ] = true;
								collision = true;
							}
						}
					}
					return collision;
				}
				return false;
			};
			this.bobCol = function( bobIndex, screen, from, to )
			{
				var bob = screen.getBob( bobIndex );
				if ( bob )
				{
					bob.updateCollisionData( true );
						this.collisionList = {};
					var collision = false;
					if ( typeof from != 'undefined' && typeof to != 'undefined' )
					{
						if ( from < 0 || to < 0 || from > to )
							throw { error: 'illegal_function_call', parameters: [ from, to ] };
						for ( var b = from; b <= to; b++ )
						{
							var testBob = screen.getBob( b );
							if ( testBob && testBob != bob && this.isToCollide( bob, testBob ) )
							{
								testBob.updateCollisionData( true );
								if ( this.isColliding( bob, testBob ) )
								{
									this.collisionList[ b ] = true;
									collision = true;
								}
							}
						}
						return collision;
					}
					else
					{
						var self = this;
						screen.bobsContext.parseAll( 'application', function( testBob )
						{
							if ( testBob != bob && self.isToCollide( bob, testBob ) )
							{
								testBob.updateCollisionData( true );
								if ( self.isColliding( bob, testBob ) )
								{
									self.collisionList[ testBob.index ] = true;
									collision = true;
								}
							}
						} );
						return collision;
					}
				}
				return false;
			};
			this.col = function( number )
			{
				if ( number < 0 )
				{
					for ( var c in this.collisionList )
						return c;
					return 0;
				}
				return this.collisionList[ number ] == true;
			};
			this.pointInBob = function( screen, index, point )
			{
				return this.pointInObject( point, screen.getBob( index ) );
			};
			this.pointInSprite = function( index, point )
			{
				return this.pointInObject( point, this.aoz.getSprite( index ) );
			};
			this.pointInObject = function( point, obj )
			{
				if ( obj.imageObject )
				{
					obj.updateCollisionData( true );
					var collisions = obj.collisions;
					var mask = obj.imageObject.getCollisionMask();
					var polygons = this.getPolygons( mask, obj.index, collisions.method, collisions.scaleX, collisions.scaleY );
					this.response.clear();
					for ( var p = 0; p < polygons.length; p++ )
					{
						var polygon = polygons[ p ];
						polygon.pos.x = collisions.x;
						polygon.pos.y = collisions.y;
						if ( collisions.method == 'fine' || collisions.method == 'box' )
						{
							polygon.setAngle( collisions.angle );
							if ( SAT.pointInPolygon( point, polygon ) )
								return true;
						}
						else
						{
							if ( SAT.pointInCircle( point, polygon ) )
								return true;
						}
					}
				}
				return false;
			};
			this.isColliding = function( object1, object2 )
			{
				var self = this;
				var collisions1 = object1.collisions;
				var collisions2 = object2.collisions;
				var colliding = ( collisions1.rectangle.x2 > collisions2.rectangle.x1 && collisions1.rectangle.x1 <= collisions2.rectangle.x2
							   && collisions1.rectangle.y2 > collisions2.rectangle.y1 && collisions1.rectangle.y1 <= collisions2.rectangle.y2 );
				if ( collisions1.method && collisions2.method )
				{
					var mask1 = object1.imageObject.getCollisionMask();
					var mask2 = object2.imageObject.getCollisionMask();
					var polygons1 = this.getPolygons( mask1, object1.index, collisions1.method, collisions1.scaleX, collisions1.scaleY );
					var polygons2 = this.getPolygons( mask2, object2.index, collisions2.method, collisions2.scaleX, collisions2.scaleY );
					this.response.clear();
					var colliding = false;
					for ( var m1 = 0; m1 < polygons1.length && !colliding; m1++ )
					{
						var polygon1 = polygons1[ m1 ];
						for ( var m2 = 0; m2 < polygons2.length && !colliding; m2++ )
						{
							var polygon2 = polygons2[ m2 ];
							if ( collisions1.method == 'fine' || collisions1.method == 'box' )
							{
								polygon1.pos.x = collisions1.x;
								polygon1.pos.y = collisions1.y;
								polygon1.setAngle( collisions1.angle );
								if ( collisions2.method == 'fine' || collisions2.method == 'box' )
								{
									polygon2.pos.x = collisions2.x;
									polygon2.pos.y = collisions2.y;
									polygon2.setAngle( collisions2.angle );
									colliding = SAT.testPolygonPolygon( polygon1, polygon2, this.response );
								}
								else
								{
									polygon2.pos.x = collisions2.xCoord;
									polygon2.pos.y = collisions2.yCoord;
									colliding = SAT.testPolygonCircle( polygon1, polygon2, this.response );
								}
							}
							else
							{
								polygon1.pos.x = collisions1.xCoord;
								polygon1.pos.y = collisions1.yCoord;
								if ( collisions2.method == 'fine' || collisions2.method == 'box' )
								{
									polygon2.pos.x = collisions2.x;
									polygon2.pos.y = collisions2.y;
									polygon2.setAngle( -collisions2.angle );
									colliding = SAT.testCirclePolygon( polygon1, polygon2, this.response );
								}
								else
								{
									polygon2.pos.x = collisions2.xCoord;
									polygon2.pos.y = collisions2.yCoord;
									colliding = SAT.testCircleCircle( polygon1, polygon2, this.response );
								}
							}
						}
					}
				}
				return colliding;
			};
			this.getPolygons = function( msk, index, method, scaleX, scaleY )
			{
				if ( !msk.allPolygons )
					msk.allPolygons = {};
				var id = method + '-' + index + '-'+ scaleX + '-' + scaleY;
				if ( msk.allPolygons[ id ] )
					return msk.allPolygons[ id ];
				var polygons = [];
				msk.allPolygons[ id ] = polygons;
				switch ( method )
				{
					case 'fine':
					case 'hull':
						for ( var h = 0; h < msk.hulls.length; h++ )
						{
							var hull = msk.hulls[ h ];
							if ( hull.points )
							{
								var vectors = [];
								for ( var v = 0; v < hull.points.length; v++ )
									vectors.push( new SAT.Vector( hull.points[ v ].x * scaleX, hull.points[ v ].y * scaleY ) );
								var polygon = new SAT.Polygon( new SAT.Vector( msk.imageObject.hotSpotX, msk.imageObject.hotSpotY ), [ ] );
								polygon.setPoints( vectors );
								polygons.push( polygon );
							}
						}
						break;
					case 'circle':
						var diameter = ( msk.imageObject.width + msk.imageObject.height ) / 2;
						var scale = ( scaleX + scaleY ) / 2;
						msk.hulls =
						[
							{
								x: 0,
								y: 0,
								width: msk.imageObject.width * scale,
								height: msk.imageObject.height * scale,
							}
						];
						polygons.push( new SAT.Circle( new SAT.Vector(), diameter / 2 * scale ) );
						break;
					case 'box':
						msk.hulls =
						[
							{
								x: 0,
								y: 0,
								width: msk.imageObject.width,
								height: msk.imageObject.height,
							}
						]
						polygons.push( new SAT.Box( new SAT.Vector( msk.imageObject.hotSpotX, msk.imageOBject.hotSpotY ), msk.imageObject.width, msk.imageObject.height ).toPolygon() );
						break;
					default:
						return;
				}
				msk.method = method;
				return polygons;
			};
			this.drawMask = function( screen, bob, msk, position, scale, options )
			{
				screen.setInk( options.ink );
				screen.setLineWidth( options.lineWidth );
				scale = ( typeof scale == 'undefined' ? { x: 1, y: 1 } : scale );
				var col = bob.collisions;
				if ( col )
				{
					var screen = this.aoz.getScreen( screen, null );
					var polygons = this.getPolygons( msk, bob.index, col.method, col.scaleX, col.scaleY );
					if ( col.method == 'fine' || col.method == 'box' || col.method == 'hull' )
					{
						position = ( typeof position == 'undefined' ? { x: col.x , y: col.y  } : position );
						for ( var h = 0; h < polygons.length; h++ )
						{
							var polygon = polygons[ h ];
							polygon.setAngle( col.angle );
							polygon.pos.x = position.x;
							polygon.pos.y = position.y;
							for ( var p = 0; p < polygon.calcPoints.length - 1; p++ )
							{
								var point1 = polygon.calcPoints[ p ];
								var point2 = polygon.calcPoints[ p + 1 ];
								screen.draw( { x1: polygon.pos.x + point1.x * scale.x, y1: polygon.pos.y + point1.y * scale.y, x2: polygon.pos.x + point2.x * scale.x, y2: polygon.pos.y + point2.y * scale.y } );
								if ( options.getHandleInk )
								{
									var rectangle = { x: polygon.pos.x + point1.x * scale.x - 6, y: polygon.pos.y + point1.y * scale.y - 6, width: 12, height: 12 };
									inkHandle = options.getHandleInk( polygon, p, rectangle );
									screen.setInk( inkHandle );
									screen.bar( rectangle )
									screen.setInk( options.ink );
								}
							}
							screen.draw( { x1: polygon.pos.x + point2.x * scale.x, y1: polygon.pos.y + point2.y * scale.y, x2: polygon.pos.x + polygon.calcPoints[ 0 ].x * scale.x, y2: polygon.pos.y + polygon.calcPoints[ 0 ].y * scale.y } );
						}
					}
					else
					{
						position = ( typeof position == 'undefined' ? { x: col.xCoord * scale.x, y: col.yCoord * scale.y } : position );
						var polygon = polygons[ 0 ];
						var ray = ( col.width + col.height ) / 2;
						polygon.pos.x = position.x;
						polygon.pos.y = position.y;
						screen.circle( { x: polygon.pos.x * scale.x, y: polygon.pos.y * scale.y, width: ( ray / 2 ) * scale.x, height: ray / 2 * scale.y } );
					}
				}
			};
			this.newImage = function( imageObject )
			{
				var canvas = imageObject.getCanvas();
				var context = canvas.getContext( '2d' );
				var hulls = [];
				var pixels = context.getImageData( 0, 0, canvas.width, canvas.height ).data;
				var precision = 100; 		//( typeof imageObject.collisionMaskPrecision == 'undefined' ? 50 : imageObject.collisionMaskPrecision );
				var pixelStepX = 1;			//Math.max( 1, Math.floor( canvas.width / precision ) );
				var pixelStepY = 1;			//Math.max( 1, Math.floor( canvas.height / precision ) );
				var convexHull, offsetRectangle;
				function testPoint( x, y )
				{
					return ( pixels[ ( offsetRectangle + y * canvas.width + x ) * 4 + 3 ] >= imageObject.collisionMaskAlphaThreshold );
				};
				function scanRectangle( x, y )
				{
					var xStepRectangles = Math.floor( canvas.width / xScanRectangles );
					var yStepRectangles = Math.floor( canvas.height / yScanRectangles );
					if ( !convexHull )
						convexHull = new ConvexHullGrahamScan();
					var notEmpty = false;
					offsetRectangle = ( y * yStepRectangles * canvas.width + x * xStepRectangles ) * 4;
					{
						for ( var yy = 0; yy < yStepRectangles; yy += pixelStepY )
						{
							var offsetView = offsetRectangle + yy * canvas.width * 4;
							var previousXX = -1;
							for ( var xx = 0; xx < xStepRectangles; xx += pixelStepX )
							{
								if ( pixels[ offsetView + xx * 4 + 3 ] >= imageObject.collisionMaskAlphaThreshold )
								{
									if ( previousXX < 0 )
										convexHull.addPoint( x * xStepRectangles + xx, y * yStepRectangles + yy );
									previousXX = xx;
									notEmpty = true;
								}
								else
								{
									if ( previousXX >= 0 )
										convexHull.addPoint( x * xStepRectangles + previousXX, y * yStepRectangles + yy );
									previousXX = -1;
								}
							}
							if ( previousXX >= 0 )
								convexHull.addPoint( x * xStepRectangles + previousXX, y * yStepRectangles + yy );
						}
					}
					if ( notEmpty )
					{
						var points = convexHull.getHull();
						if ( points )
						{
							if ( points.length == 2 )
							{
								convexHull.addPoint( x * xStepRectangles + previousXX, y * yStepRectangles + yy );
							}
							if ( points.length >= 3 )
						{
							hulls.push(
							{
								x: x * xStepRectangles,
								y: y * yStepRectangles,
								width: xStepRectangles,
								height: yStepRectangles,
								points: points
							} );
							}
							convexHull = null;
						}
					}
				}
				if ( imageObject.collisionMaskMethod == 'fine' && ( imageObject.width < 8 && imageObject.height < 8 ) )
					imageObject.collisionMaskMethod = 'hull';
				if ( imageObject.collisionMaskMethod == 'fine' )
				{
					xScanRectangles = Math.max( 1, Math.floor( imageObject.width / imageObject.collisionMaskPrecision ) );
					yScanRectangles = Math.max( 1, Math.floor( imageObject.height / imageObject.collisionMaskPrecision ) );
					for ( var y = 0; y < yScanRectangles; y++ )
					{
						for ( var x = 0; x < xScanRectangles; x++ )
						{
							scanRectangle( x, y );
						}
					}
					return hulls;
				}
				else if ( imageObject.collisionMaskMethod == 'hull' )
				{
					xScanRectangles = 1;
					yScanRectangles = 1;
					scanRectangle( 0, 0 );
					return hulls;
				}
				return null;
			}
			// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
