var AOZBodies = 
{
	Platform: function( actorParams, bob, module )
	{
		actorParams.HotspotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		actorParams.HotspotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;
		bob.imageObject.hotSpotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		bob.imageObject.hotSpotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;				
		module.aoz.currentScreen.setModified();
		module.aoz.currentScreen.bobsToUpdate = true;
		bob.update( { force: true } );
		bob.toUpdateCollisions = true;
		
		var obj = 
		{
			module: module,
			actorParams: actorParams,
			bob: bob,
			body: module.Bodies.rectangle( actorParams.X, actorParams.Y, bob.imageObject.width * actorParams.ScaleX , bob.imageObject.height * actorParams.ScaleY ),
			update: function()
			{
				
				this.body.visible = this.bob.vars.visible;
				this.body.opacity = this.bob.vars.alpha;
				this.body.isSleeping = !this.actorParams.Enable;
				this.bob.vars.x = this.body.position.x;
				this.bob.vars.y = this.body.position.y;
				this.bob.vars.angle = this.body.angle;
				if( module.physicWireframe )
				{
					AOZBodies.drawVertices( this.bob, this.body );
				}
			}
		}
		
		obj.body.isStatic = true;			
			
		if( actorParams.PhysicParams != undefined && actorParams.PhysicParams != '' )
		{
			obj.body = AOZBodies.applyParams( obj );
		}
		return obj;
	},

	Ball: function( actorParams, bob, module )
	{
		actorParams.HotspotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		actorParams.HotspotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;
		bob.imageObject.hotSpotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		bob.imageObject.hotSpotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;				
		module.aoz.currentScreen.setModified();
		module.aoz.currentScreen.bobsToUpdate = true;
		bob.update( { force: true } );
		bob.toUpdateCollisions = true;
		
		var obj = 
		{
			module: module,
			actorParams: actorParams,
			bob: bob,
			body: module.Bodies.circle( actorParams.X, actorParams.Y, ( bob.imageObject.width / 2 ) * actorParams.ScaleX ),
			update: function()
			{
				
				this.body.visible = this.bob.vars.visible;
				this.body.opacity = this.bob.vars.alpha;
				this.bob.vars.angle = this.body.angle;
				this.body.isSleeping = !this.actorParams.Enable;
				this.bob.vars.x = this.body.position.x;
				this.bob.vars.y = this.body.position.y;				
				if( module.physicWireframe )
				{
					AOZBodies.drawVertices( this.bob, this.body );
				}
			}
		}
	
		obj.body.restitution = 1;
		obj.body.frictionAir = 0.001;
		
		if( actorParams.PhysicParams != undefined && actorParams.PhysicParams != '' )
		{
			obj.body = AOZBodies.applyParams( obj );
		}
		return obj;		
	},

	AABB: function( actorParams, bob, module )
	{

		actorParams.HotspotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		actorParams.HotspotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;
		bob.imageObject.hotSpotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		bob.imageObject.hotSpotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;				
		module.aoz.currentScreen.setModified();
		module.aoz.currentScreen.bobsToUpdate = true;
		bob.update( { force: true } );
		bob.toUpdateCollisions = true;

		var obj = 
		{
			module: module,
			actorParams: actorParams,
			bob: bob,
			body: module.Bodies.rectangle( actorParams.X, actorParams.Y, bob.imageObject.width * actorParams.ScaleX , bob.imageObject.height * actorParams.ScaleY ),
			update: function()
			{
				this.body.visible = this.bob.vars.visible;
				this.body.opacity = this.bob.vars.alpha;
				this.body.isSleeping = !this.actorParams.Enable;
				this.bob.vars.x = this.body.position.x;
				this.bob.vars.y = this.body.position.y;
				this.bob.vars.angle = this.body.angle;
				if( module.physicWireframe )
				{
					AOZBodies.drawVertices( this.bob, this.body );
				}
			}
		}

		obj.body.restitution=-0.001;			
			
		if( actorParams.PhysicParams != undefined && actorParams.PhysicParams != '' )
		{
			obj.body = AOZBodies.applyParams( obj );
		}
		return obj;
	},

	Rectangle: function( actorParams, bob, module )
	{
	
		var obj = 
		{
			module: module,
			actorParams: actorParams,
			bob: bob,
			body: module.Bodies.rectangle( actorParams.X, actorParams.Y, bob.imageObject.width * actorParams.ScaleX , bob.imageObject.height * actorParams.ScaleY ),
			update: function()
			{
				this.body.visible = this.bob.vars.visible;
				this.body.opacity = this.bob.vars.alpha;
				this.bob.vars.angle = this.body.angle;
				this.body.isSleeping = !this.actorParams.Enable;
				this.bob.vars.x = this.body.position.x;
				this.bob.vars.y = this.body.position.y;				
				if( module.physicWireframe )
				{
					AOZBodies.drawVertices( this.bob, this.body );
				}
			}
		}
		
		if( actorParams.PhysicParams != undefined && actorParams.PhysicParams != '' )
		{
			obj.body = AOZBodies.applyParams( obj );
		}
		return obj;
	},

	Circle: function( actorParams, bob, module )
	{
		actorParams.HotspotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		actorParams.HotspotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;
		bob.imageObject.hotSpotX = ( bob.imageObject.width * actorParams.ScaleX ) / 2;
		bob.imageObject.hotSpotY = ( bob.imageObject.height * actorParams.ScaleY ) / 2;				
		module.aoz.currentScreen.setModified();
		module.aoz.currentScreen.bobsToUpdate = true;
		bob.update( { force: true } );
		bob.toUpdateCollisions = true;
		
		var obj = 
		{
			module: module,
			actorParams: actorParams,
			bob: bob,
			body: module.Bodies.circle( actorParams.X, actorParams.Y, ( bob.imageObject.width / 2 ) * actorParams.ScaleX ),
			update: function()
			{
				this.body.visible = this.bob.vars.visible;
				this.body.opacity = this.bob.vars.alpha;
				this.bob.vars.angle = this.body.angle;
				this.body.isSleeping = !this.actorParams.Enable;
				this.bob.vars.x = this.body.position.x;
				this.bob.vars.y = this.body.position.y;				
				if( module.physicWireframe )
				{
					AOZBodies.drawVertices( this.bob, this.body );
				}
			}
		}
		
		if( actorParams.PhysicParams != undefined && actorParams.PhysicParams != '' )
		{
			obj.body = AOZBodies.applyParams( obj );
		}
		return obj;		
	},

	drawVertices: function( bob, body )
	{
		var canvas = bob.imageObject.canvas;
		var ctx = canvas.getContext( '2d' );
		ctx.beginPath();
		var v1 = body.vertices[ 0 ];
		ctx.moveTo( v1.x - ( ( bob.vars.x - bob.imageObject.hotSpotX ) ), v1.y - ( ( bob.vars.y - bob.imageObject.hotSpotY ) ) );
		
		for( var v = 1; v < body.vertices.length; v++ )
		{
			ctx.strokeStyle = "#FF0000";
			var v2 = body.vertices[ v ];
			ctx.lineTo( v2.x - ( ( bob.vars.x - bob.imageObject.hotSpotX ) ), v2.y - ( ( bob.vars.y - bob.imageObject.hotSpotY ) ) );
		}
		v1 = body.vertices[ 0 ];
		ctx.lineTo( v1.x - ( ( bob.vars.x - bob.imageObject.hotSpotX ) ), v1.y - ( ( bob.vars.y - bob.imageObject.hotSpotY ) ) );

		ctx.closePath();
		ctx.stroke();

		bob.imageObject.canvas = canvas;
	},
	
	applyParams: function( obj )
	{
		var param = obj.actorParams.PhysicParams.trim().split( "," );
		var body = obj.body;
		var bob = obj.bob;
		if( param )
		{
			param.forEach(  p =>
			{
				var part = p.split( "=" );

				if( part && part.length == 2 )
				{
					switch( part[ 0 ].trim().toLowerCase() )
					{
						
						case 'points':
							var points = [];
							var coords = part[ 1 ].split( ";" );
							if( coords && coords.length > 0 )
							{
								body.vertices = undefined;
								for( var c = 0; c < coords.length; c++ )
								{
									var pt = coords[ c ].split( ":" );
									if( pt && pt.length > 0 )
									{
										var px = ( bob.vars.x + parseFloat( pt[ 0 ].trim() ) ) - bob.hotSpot.x;
										var py = ( bob.vars.y + parseFloat( pt[ 1 ].trim() ) ) - bob.hotSpot.y;
										points.push( { x: px, y: py } );
									}
								}
								body.vertices = Matter.Vertices.create( points, body );
							}
							break;
							
						case 'angle':
							Body.setAngle( body, parseFloat( part[ 1 ] ) * ( Math.PI / 180 ) );
							break;
							
						case 'density':
							Body.setDensity( body, parseFloat( part[ 1 ] ) ); 
							break;
							
						case 'forcex':
							body.force.x =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'forcey':
							body.force.y =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'frictionx':
							body.friction.x =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'frictiony':
							body.friction.y =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'frictionair':
							body.frictionAir =  parseFloat( part[ 1 ] ); 
							break;	
							
						case 'frictionstatic':
							body.frictionStatic =  parseFloat( part[ 1 ] ); 
							break;	
							
						case 'inertia':
							body.inertia =  parseFloat( part[ 1 ] ); 
							break;	
							
						case 'inverseinertia':
							body.inverseInertia =  parseFloat( part[ 1 ] ); 
							break;	
							
						case 'inversemass':
							body.inverseMass =  parseFloat( part[ 1 ] ); 
							break;	
							
						case 'issensor':
							body.isSensor =  part[ 1 ].trim().toLowerCase() == 'true'; 
							break;
							
						case 'issleeping':
							body.isSleeping =  part[ 1 ].trim().toLowerCase() == 'true'; 
							break;	
							
						case 'isstatic':
							body.isStatic =  part[ 1 ].trim().toLowerCase() == 'true'; 
							break;
							
						case 'mass':
							body.mass =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'restitution':
							body.restitution =  parseFloat( part[ 1 ] ); 
							break;	

						case 'sleepthreshold':
							body.sleepThreshold =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'slop':
							body.slop =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'speed':
							body.speed =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'timescale':
							body.timescale =  parseFloat( part[ 1 ] ); 
							break;
							
						case 'velocity':
							body.velocity =  parseFloat( part[ 1 ] ); 
							break;							
							
					}
				}
			} );
		}
	return body;
	}
}