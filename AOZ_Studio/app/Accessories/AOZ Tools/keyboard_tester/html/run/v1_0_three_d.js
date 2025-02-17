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
// The Three D Module
// By Francois Lionet & Baptiste Bideaux
// Version 1
// 19/09/2022
// (c) AOZ Studio 2022 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_three_d( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFRocmVlIEQgTW9kdWxlIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0ICYgQmFwdGlzdGUgQmlkZWF1eCIsInZlcnNpb24iOiJWZXJzaW9uIDEiLCJkYXRlIjoiMTkvMDkvMjAyMiIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMjIgLSBPcGVuIFNvdXJjZSIsInN0YXJ0IjoidGhyZWVfZC5hb3oiLCJuYW1lIjoiVGhyZWVfRCJ9LCJjb21waWxhdGlvbiI6eyJub1dhcm5pbmciOltdLCJlcnJvcnMiOnsiZW4iOltdLCJmciI6W119LCJpbmNsdWRlUGF0aHMiOltdfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_three_d';
	this.aoz[ "module" + "Three_d" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/three_d/three_d.aoz
		aoz.sourcePos="0:81:0";
		// Javascript
		this.aoz.three_d = this;
		this.numberOfStockLights = 5;
		this.Scene = function( screen3D, name, args, callback, extra )
		{
			this.screen3D = screen3D;
			this.aoz = screen3D.aoz;
			this.objects = {};
			this.bodies = {};
			this.joints = {};
			this.modified = false;
			this.args = {};
			this.stockLights = {};
			var self = this;
			function finishScene()
			{
				self.scene.name = name;
				self.currentCamera = self.camera( 'DefaultCamera', { type: '__scene__', far: 10000, position: { x: 0, y: 50, z: 50 } } );
				self.currentCamera.lookAt( new THREE.Vector3() );
				self.defaultCamera = self.currentCamera;
				self.setScene( args );
				self.modified = true;
				if ( typeof args.gravity != 'undefined' )
				{
					self.gravity = args.gravity;
					self.world = new CANNON.World( { gravity: new CANNON.Vec3( 0, -self.gravity, 0 ) } );
					if ( args.helpers || args.helperPhysics )
						self.cannonDebugger = new CannonDebugger( self.scene, self.world, { color: 0xFFFF00 } );
					if ( args.helpers || args.helperGround )
					{
						self.groundBody = new CANNON.Body( { type: CANNON.Body.STATIC, shape: new CANNON.Plane() } );
						self.groundBody.quaternion.setFromEuler( -Math.PI / 2, 0, 0 );
						self.groundBody.name = 'groundbody';
						self.addBody( self.groundBody );
					}
				}
			};
			if ( args.path )
			{
				this.aoz.filesystem.loadFile( args.path, { responseType: 'binary' }, function( response, data, extra )
				{
					if ( response )
					{
						var loader;
						switch ( type )
						{
							case 'gltf':
							case 'glb':
								loader = new THREE.GLTFLoader();
								break;
							case 'obj':
								loader = new THREE.OBJLoader();
								break;
							case 'fbx':
								loader = new THREE.FBXLoader();
								break;
							case 'dae':
								loader = new THREE.ColladaLoader();
								break;
							case 'aoz3d':
								loader = new THREE.ObjectLoader();
								break;
							default:
								loader = new this.tdLoader();
								break;					
						}
						loader.parse( data, args.path, function( model )
						{
							switch ( type )
							{
								case 'aoz3d':
									self.scene = model;
									var json = JSON.parse( data );
									self.aozData = json.object.aozEvents;							
									break;
								case 'glb':
								case 'gltf':
								case 'dae':
									self.scene = model.scene;
									break;
								case 'obj':
								case 'fbx':
									if ( model.scene )
										self.scene = model.scene;
									else
									{
										var group = new THREE.Group();
										if( model.children )
										{
											for( var c = 0; c < model.children.length; c++ )
												group.add( model.children[ c ] );
										}
										else
											group.add( model );
										self.scene = group;
									}
									if( model.animations )
									{
										self.animations = model.animations;
										self.mixer = undefined;
									}
									break;
								default:
									self.scene = model;
									break;
							}
							finishScene();
						}, function( error )
						{
						} );
					}
				}, extra );
			}
			else
			{
				var bank = this.aoz.banks.getBank( undefined, this.aoz.currentContextName, '3D' );
				var element = bank.getElement( name, 'scene', true );
				if ( element )
				{
					element.loadElement( {}, function( response, element, extra )
					{
						if ( response )
						{
							self.scene = element.data;
							finishScene();
						}
					} );
				}
				else
				{
					this.scene = new THREE.Scene();
					light = new THREE.DirectionalLight( 0xffffff , 2 );
					light.position.set( 1000, 1000, 500 );
					light.target.position.set( 0, 0, 0 );
					light.castShadow = true;
					var d = 100;
					light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  500, 1600 );
					light.shadow.mapSize.width = light.shadow.mapSize.height = 4096;
					light.name = 'Spot';
					this.addObject( light );
					this.createStockLights();
					this.screen3D.renderer.shadowMap.enabled = true;
					if ( args.helpers || args.helperAxis )
					{
						var axis = new THREE.AxesHelper( 50 );
						axis.name = 'Axis';
						this.addObject( axis );
					}
					if ( args.helpers || args.helperGrid )
					{
						var grid = new THREE.GridHelper( 50, 50 );
						grid.name = 'Grid';
						this.addObject( grid );
					}
					args.skyType = typeof args.skyType == 'undefined' ? 'color' : args.skyType;
					args.skyColor = typeof args.skyColor == 'undefined' ? 0x636493 : args.skyColor;
					args.ambientColor = typeof args.ambientColor == 'undefined' ? 0xE5FFED : args.ambientColor;
					finishScene();
				}
			}
		};
		this.Scene.prototype.createStockLights = function( args )
		{
			var light;
			var count = 0;
			var types = [ 'point', 'ambient', 'directional', 'hemispheric', 'rectangular', 'spot' ];
			for ( var t = 0; t < types.length; t++ )
			{
				var type = types[ t ];
				for ( var l = 0; l < this.aoz.three_d.numberOfStockLights; l++ )
				{
					switch ( type )
					{
						default:
						case 'point':
							light = new THREE.PointLight( 0xFFFFFF, 1, 0, 0 );
							break;
						case 'ambient':
							light = new THREE.AmbientLight( 0x000000 );
							break;
						case 'directional':
							light = new THREE.DirectionalLight( 0x000000, 1 );
							break;
						case 'hemispheric':
							light = new THREE.HemisphereLight( 0x000000, 0x000000 );
							break;
						case 'rectangular':
							break;
						case 'spot':
							light = new THREE.SpotLight( 0x000000, 1, 0, 0, 0, 0 );
							break;
					}
					light.visible = false;
					light.name = ':stock:' + count++;
					if ( !this.stockLights[ type ] )
						this.stockLights[ type ] = [];
					this.stockLights[ type ].push( light );
					this.addObject( light );
				}
			}
		};
		this.Scene.prototype.setScene = function( args )
		{
			if ( typeof args.ambientColor !=- 'undefined' || typeof args.ambientIntensity !=- 'undefined' )
			{
				if ( !this.ambientLight )
				{
					args.ambientColor = typeof args.ambientColor != 'undefined' ? args.ambientColor : 0x3D4143;
					args.ambientIntensity = typeof args.ambientIntensity != 'undefined' ? args.ambientIntensity : 1;
					this.ambientLight = new THREE.AmbientLight( args.ambientColor, args.ambientIntensity );
					this.ambientLight.name = 'AmbientLight'; 
					this.addObject( this.ambientLight );
				}
				this.ambientLight.color.setHex( args.ambientColor );
				this.ambientLight.intensity = args.ambientIntensity;
			}
			if ( typeof args.skyType != 'undefined' )
			{
				if ( this.args.skyType && this.args.skyType != args.skyType )
					throw { error: 'cannot_change_basis_properties', parameter: args.skyType };
				switch ( args.skyType.toLowerCase() )
				{
					case 'material':
						if ( typeof args.material != 'undefined' )
						{
							var material = this.screen3D.materials[ args.sky ];
							if ( !material )
								throw { error: 'texture_not_defined', parameter: args.sky };
							if ( !this.backgroundMesh )
							{
								this.backgroundMaterial = material;
								this.backgroundGeometry = new THREE.IcosahedronGeometry( 3000, 2 );
								this.backgroundMesh = new THREE.Mesh( this.backgroundGeometry, this.backgroundMaterial );
								this.backgroundMesh.geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( 15 * this.aoz.degreeRadian ) );
								this.backgroundMesh.name = 'Sky';
								this.addObject( this.backgroundMesh );	
							}
							else
							{
								this.backgroundMesh.material = material;
							}
							this.backgroundMesh.updateMatrix();
						}
						break;
					case 'rainbow':
						args.skyRed = typeof args.skyRed != 'undefined' ? args.skyRed : this.args.skyRed;
						args.skyGreen = typeof args.skyGreen != 'undefined' ? args.skyGreen : this.args.skyGreen;
						args.skyBlue = typeof args.skyBlue != 'undefined' ? args.skyBlue : this.args.skyBlue;
						args.skyWidth = typeof args.skyWidth != 'undefined' ? args.skyWidth : this.args.skyWidth;
						args.skyHeight = typeof args.skyHeight != 'undefined' ? args.skyHeight : this.args.skyHeight;
						if ( args.skyWidth != this.args.skyWidth || args.skyHeight != this.args.skyHeight
							|| args.skyRed != this.args.skyRed || args.skyGreen != this.args.skyGreen || args.skyBlue != args.skyBlue )
						{
							if ( !this.backgroundMesh )
							{
								args.skyWidth = typeof args.skyWidth != 'undefined' ? args.skyWidth : 1920;
								args.skyHeight = typeof args.skyHeight != 'undefined' ? args.skyHeight : 1024;
								this.backgroundGeometry = new THREE.IcosahedronGeometry( 3000, 2 );
								this.backgroundTexture = this.screen3D.texture( 'Sky', { type: 'rainbow', red: args.skyRed, green: args.skyGreen, blue: args.skyBlue, width: args.skyWidth, height: args.skyHeight } );
								this.backgroundMaterial = this.screen3D.material( 'Sky', { type: 'basic', texture: this.backgroundTexture, side: 1, depthWrite: false } );
								this.backgroundMesh = new THREE.Mesh( this.backgroundGeometry, this.backgroundMaterial );
								this.backgroundMesh.name = 'Sky';
								this.addObject( this.backgroundMesh );	
							}
							else
							{
								this.screen3D.texture( 'Sky', { type: 'rainbow', red: args.skyRed, green: args.skyGreen, blue: args.skyBlue, width: args.skyWidth, height: args.skyHeight } );
							}
							this.backgroundMesh.updateMatrix();
						}
						break;
					case 'image':
						if ( typeof args.sky != 'undefined' && args.sky != this.args.sky )
						{
							if ( !this.backgroundMesh )
							{
								this.backgroundGeometry = new THREE.IcosahedronGeometry( 3000, 2 );
								this.backgroundTexture = this.screen3D.texture( 'Sky', { type: 'image', image: args.sky, wrapping: 1 } );
								this.backgroundMaterial = this.screen3D.material( 'Sky', { type: 'standard', texture: this.backgroundTexture, side: 1, depthWrite: false } );
								this.backgroundMesh = new THREE.Mesh( this.backgroundGeometry, this.backgroundMaterial );
								this.backgroundMesh.name = 'Sky';
								this.addObject( this.backgroundMesh );	
							}
							else
							{
								var imageObject = this.aoz.banks.getImage( 'images', args.sky );
								var canvas = imageObject.getCanvas();
								this.backgroundTexture.image = canvas;
								this.backgroundTexture.needUpdate = true;
							}
							this.backgroundMesh.updateMatrix();
						}
						break;
					case 'cube':
						if ( typeof args.sky != 'undefined' && args.sky != this.args.sky )
						{
							if ( !this.backgroundMesh )
							{
								this.backgroundGeometry = new THREE.IcosahedronGeometry( 3000, 2 );
								this.backgroundTexture = this.screen3D.texture( 'Sky', { type: 'cube', image: args.sky } );
								this.backgroundMaterial = this.screen3D.material( 'Sky', { type: 'basic', texture: this.backgroundTexture, side: 1, depthWrite: false } );
								this.backgroundMesh = new THREE.Mesh( this.backgroundGeometry, this.backgroundMaterial );
								this.backgroundMesh.geometry.applyMatrix4( new THREE.Matrix4().makeRotationZ( 15 * this.aoz.degreeRadian ) );
								this.backgroundMesh.name = 'Sky';
								this.addObject( this.backgroundMesh );	
							}
							else
							{
								this.screen3D.texture( 'Sky', { type: 'cube', image: args.sky } )
							}
							this.backgroundMesh.updateMatrix();
						}
						break;
					case '360':
						if ( typeof args.sky != 'undefined' && args.sky != this.args.sky )
						{
							if ( !this.backgroundTexture )
							{
								var self = this;
								this.aoz.loadingMax++;
								this.screen3D.texture( args.sky, { type: '360' }, function( response, texture, extra )
								{
									self.aoz.loadingCount++;
									if ( response )
									{
										self.backgroundTexture = texture;
										self.scene.background = texture;
									}
								} );							
							}
						}
						break;
					default:
					case 'color':
						if ( typeof args.skyColor != 'undefined' && args.skyColor != this.args.skyColor )
						{
							if ( !this.backgroundMesh )
							{
								this.backgroundGeometry = new THREE.IcosahedronGeometry( 3000, 2 );
								this.backgroundMaterial = this.screen3D.material( 'Sky', { type: 'standard', color: args.skyColor, side: 1, depthWrite: false } );
								this.backgroundMesh = new THREE.Mesh( this.backgroundGeometry, this.backgroundMaterial );
								this.backgroundMesh.name = 'Sky';
								this.addObject( this.backgroundMesh );	
							}
							else
							{
								this.screen3D.material( 'Sky', { color: skyColor } );
							}
							this.backgroundMesh.updateMatrix();
						}
						break;
				}
			}
			for ( var p in args )
				this.args[ p ] = args[ p ];
		};
		this.Scene.prototype.setCamera = function( index )
		{
			var camera = this.getCamera( index );
			this.currentCamera = camera;
		};
		this.Scene.prototype.render = function( renderer, deltaTime )
		{
			this.modified = false;
			if ( this.world )
			{
				this.world.fixedStep();
				  if ( this.cannonDebugger )
					this.cannonDebugger.update();
			}
			renderer.render( this.scene, this.currentCamera );	
		};
		this.Scene.prototype.getObjectType = function( obj )
		{
			var type = 'mesh:';
			if ( obj.isMesh )
				type = 'mesh:';
			if ( obj.isGroup )
				type = 'mesh:';
			if ( obj.isLine )
				type = 'line:';
			if ( obj.isPlane )
				type = 'plane:';
			if ( obj.isCamera )
				type = 'camera:';
			if ( obj.isLight )
				type = 'light:';
			return type;
		};
		this.Scene.prototype.addObject = function( obj )
		{
			var type = this.getObjectType( obj );	
			if ( this.objects[ type + obj.name.toLowerCase() ] )
			{
				if ( this.scene.getObjectById( obj.id ) )
					throw 'object_already_added';
				this.scene.add( obj );
				return obj;
			}
			this.objects[ type + obj.name.toLowerCase() ] = obj;
			this.scene.add( obj );
			return obj;
		};
		this.Scene.prototype.addBody = function( body )
		{
			if ( this.bodies[ body.name.toLowerCase() ] )
				throw { error: 'body_already_added', parameter: body.name };
			this.bodies[ body.name.toLowerCase() ] = body;
			this.world.addBody( body );
			return body;
		};
		this.Scene.prototype.finishProperties = function( tdObject, type, updateList, functionList, args )
		{
			var update = false;
			var toUpdate = updateList[ type ];
			for ( var p = 0; p < toUpdate.length; p++ )
			{
				var pos, value;
				var prop = toUpdate[ p ];
				if ( ( pos = prop.indexOf( '(angle)' ) ) >= 0 )
				{
					prop = prop.substring( 0, pos );
					value = aoz.getAngle( args[ prop ] );
				}
				else if ( ( pos = prop.indexOf( '(function)' ) ) >= 0 )
				{
					prop = prop.substring( 0, pos );
					if ( typeof args[ prop ] != 'undefined' )
						functionList[ prop ]( args[ prop ] );
					value = undefined;
					update |= true;
				}
				else
				{
					value = args[ prop ];
				}
				if ( typeof value != 'undefined' )
				{
					tdObject[ prop ] = value;
					update |= true;
				}
			}
			return update;
		}
		this.Scene.prototype.setMaterial = function( mesh, material )
		{
			mesh.traverse( function( m )
			{
				m.material = material;
			} );
		};
		this.Scene.prototype.meshCut = function( index, args )
		{
			var destMesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( destMesh )
				throw { error: 'mesh_already_defined', parameter: index };
			var sourceMesh = this.objects[ 'mesh:' + args.from.toLowerCase() ];
			if ( !sourceMesh )
				throw { error: 'mesh_not_defined', parameter: args.from };		
			var mesh = sourceMesh.getObjectByName( args.name );
			if ( !mesh )
				throw { error: 'mesh_not_defined', parameter: args.name };
			var parent = mesh.parent;
			parent.remove( mesh );
			parent.updateMatrix();
			mesh = mesh.clone();
			mesh.updateMatrix();
			var bank = this.aoz.banks.getBank( undefined, this.aoz.currentContextName, '3D' );
			var element = new TDElement( this.aoz, bank,
			{
				name: index,
				mesh: mesh,
				type: 'mesh'
			} );
			bank.add( index );
			bank.setElement( index, element );
			return mesh;
		};
		this.Scene.prototype.addMesh = function( name )
		{
			var mesh = this.objects[ 'mesh:' + name.toLowerCase() ];
			if ( !mesh )
				throw 'mesh_not_defined';
			if ( !this.scene.getObjectById( mesh.id ) )
			{
				this.scene.add( mesh );
				if ( this.world )
				{
					var body = this.bodies[ name.toLowerCase() ];
					if ( body )
						this.world.addRigidBody( body );
				}
			}
			else
				throw { error: 'mesh_already_defined', parameter: name };
		};
		this.Scene.prototype.removeMesh = function( name )
		{
			var mesh = this.objects[ 'mesh:' + name.toLowerCase() ];
			if ( !mesh )
				throw 'mesh_not_defined';
			if ( this.scene.getObjectById( mesh.id ) )
			{
				this.scene.remove( mesh );
				if ( this.world )
				{
					var body = this.bodies[ name.toLowerCase() ];
					if ( body )
						this.world.removeRigidBody( body );
				}
			}
			else
				throw { error: 'mesh_not_in_scene', parameter: name };
		};
		this.Scene.prototype.deleteMesh = function( name )
		{
			var mesh = this.objects[ 'mesh:' + name.toLowerCase() ];
			if ( !mesh )
				throw 'mesh_not_defined';
			this.objects[ 'mesh:' + name.toLowerCase() ] = null;
			if ( this.scene.getObjectById( mesh.id ) )
			{
				this.scene.remove( mesh );
				if ( this.world )
				{
					var body = this.bodies[ name.toLowerCase() ];
					if ( body )
					{
						this.world.removeRigidBody( body );
						this.bodies[ name.toLowerCase() ] = null;
					}
				}
			}
		};
		this.Scene.prototype.showMesh = function( name, visible )
		{
			var mesh = this.objects[ 'mesh:' + name.toLowerCase() ];
			if ( !mesh )
				throw 'mesh_not_defined';
			mesh.visible = visible;
		};
		this.Scene.prototype.camera = function( index, args, callback, extra )
		{
			var self = this;
			var camera = this.objects[ 'camera:' + index.toLowerCase() ];
			if ( !camera )
			{
				args.position = typeof args.position == 'undefined' ? {} : args.position;
				args.position.x = typeof args.position.x == 'undefined' ? 0 : args.position.x;
				args.position.y = typeof args.position.y == 'undefined' ? 20 : args.position.y;
				args.position.z = typeof args.position.z == 'undefined' ? 50 : args.position.z;
				args.rotation = typeof args.rotation == 'undefined' ? {} : args.rotation;
				args.rotation.x = typeof args.rotation.x == 'undefined' ? 0 : args.rotation.x;
				args.rotation.y = typeof args.rotation.y == 'undefined' ? 0 : args.rotation.y;
				args.rotation.z = typeof args.rotation.z == 'undefined' ? 0 : args.rotation.z;
				args.fov = typeof args.fov == 'undefined' ? 50 : args.fov;
				args.near = typeof args.near == 'undefined' ? 0.01 : args.near;
				args.far = typeof args.far == 'undefined' ? 2000 : args.far;
				args.left = typeof args.left == 'undefined' ? 0 : args.left;
				args.right = typeof args.right == 'undefined' ? 1920 : args.right;
				args.top = typeof args.top == 'undefined' ? 0 : args.top;
				args.bottom = typeof args.bottom == 'undefined' ? 1080 : args.bottom;
				args.eyesep = typeof args.eyesep == 'undefined' ? 0.064 : args.eyesep;
				args.aspect = typeof args.aspect == 'undefined' ? this.screen3D.canvas.width / this.screen3D.canvas.height : args.aspect;
				if ( index.toLowerCase() == 'defaultcamera' && args.type != '__scene__' )
				{
					camera = this.defaultCamera;
				}
				else
				{
					args.type = typeof args.type == 'undefined' ? 'perspective' : args.type;
					switch ( args.type.toLowerCase() )
					{
						default:
						case 'perspective':
							camera = new THREE.PerspectiveCamera( args.fov, args.aspect, args.near, args.far );						
							camera.name = index;
							this.addObject( camera );		
							break;
						case 'orthographic':
							camera = new THREE.OrthographicCamera( args.left, args.right, args.top, args.bottom, args.near, args.far );
							camera.name = index;
							this.addObject( camera );		
							break;
					}
				}
			}
			var update = this.finishObject( camera, args );
			if ( update )
			{
				camera.updateMatrix();
				this.modified = true;
			}
			return camera;
		};
		this.Scene.prototype.light = function( index, args, callback, extra )
		{
			var self = this;
			var light = this.objects[ 'light:' + index.toLowerCase() ];
			if ( !light )
			{
				args.type = typeof args.type == 'undefined' ? 'point' : args.type,
				args.position = typeof args.position == 'undefined' ? {} : args.position;
				args.position.x = typeof args.position.x == 'undefined' ? 0 : args.position.x;
				args.position.y = typeof args.position.y == 'undefined' ? 20 : args.position.y;
				args.position.z = typeof args.position.z == 'undefined' ? 50 : args.position.z;
				args.rotation = typeof args.rotation == 'undefined' ? {} : args.rotation;
				args.rotation.x = typeof args.rotation.x == 'undefined' ? 0 : args.rotation.x;
				args.rotation.y = typeof args.rotation.y == 'undefined' ? 0 : args.rotation.y;
				args.rotation.z = typeof args.rotation.z == 'undefined' ? 0 : args.rotation.z;
				args.intensity = typeof args.intensity == 'undefined' ? 1 : args.intensity;
				args.distance = typeof args.distance == 'undefined' ? 0 : args.distance;
				args.color = typeof args.color == 'undefined' ? 1 : args.color;
				args.decay = typeof args.decay == 'undefined' ? 1 : args.decay;
				args.castShadows = typeof args.castShadows == 'undefined' ? false : args.castShadows;
				args.targetX = typeof args.targetX == 'undefined' ? 0 : args.targetX;
				args.targetY = typeof args.targetY == 'undefined' ? 0 : args.targetY;
				args.targetZ = typeof args.targetZ == 'undefined' ? 0 : args.targetZ;
				args.skyColor = typeof args.skyColor == 'undefined' ? 0 : args.skyColor;
				args.groundColor = typeof args.groundColor == 'undefined' ? 0 : args.groundColor;
				args.width = typeof args.width == 'undefined' ? 10 : args.width;
				args.height = typeof args.height == 'undefined' ? 10 : args.height;
				args.penumbra = typeof args.penumbra == 'undefined' ? 0 : args.penumbra;
				args.type = args.type.toLowerCase();
				var types = [ 'point', 'ambient', 'directional', 'hemispheric', 'rectangular', 'spot' ];
				if ( !types.find( function( element )
				{
					return ( element == args.type );
				} ) )
				{
					throw { error: 'illegal_function_call', parameter: args.type };
				}
				var stock = this.stockLights[ args.type.toLowerCase() ];
				if ( stock.length > 0 )
				{
					light = stock.pop();
					this.objects[ 'light:' + light.name ] = null;
					light.visible = true;
					light.name = index;
					this.objects[ 'light:' + index ] = light;
				}
			}
			var updateList =
			{
				point: [ 'intensity', 'distance', 'decay', 'castShadows(function)' ],
				ambient: [ ],
				directional: [ 'intensity' ],
				hemispheric: [ 'skyColor', 'groundColor' ],
				rectangular: [ 'intensity', 'width', 'height' ],
				spot: [ 'intensity', 'distance', 'angle(angle)', 'penumbra', 'decay' ]
			};
			var functionList =
			{
				castShadows: function( value )
				{
					light.castShadow = value;
					if ( value )
					{
						light.castShadow = true;
						var d = 100;
						light.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d, 500, 1600 );
						light.shadow.mapSize.width = light.shadow.mapSize.height = 4096;
					}
				}
			}
			if ( this.finishObject( light, args ) )
			{
				light.updateMatrix();
				this.modified = true;
			}
			if ( this.finishProperties( light, args.type, updateList, functionList, args ) )
			{
				this.modified = true;
			}
			return light;
		};
		this.Scene.prototype.mesh = function( index, args, callback, extra )
		{
			var self = this;
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
			{
				var mesh = this.scene.getObjectByName( '' + index );
				if ( mesh )
					this.objects[ 'mesh:' + index.toLowerCase() ] = mesh;
				else
				{
					args.position.x = typeof args.position.x == 'undefined' ? 0 : args.position.x;
					args.position.y = typeof args.position.y == 'undefined' ? 0 : args.position.y;
					args.position.z = typeof args.position.z == 'undefined' ? 0 : args.position.z;
					args.scale.x = typeof args.scale.x == 'undefined' ? 1 : args.scale.x;
					args.scale.y = typeof args.scale.y == 'undefined' ? 1 : args.scale.y;
					args.scale.z = typeof args.scale.z == 'undefined' ? 1 : args.scale.z;
					args.rotation.x = typeof args.rotation.x == 'undefined' ? 0 : args.rotation.x;
					args.rotation.y = typeof args.rotation.y == 'undefined' ? 0 : args.rotation.y;
					args.rotation.z = typeof args.rotation.z == 'undefined' ? 0 : args.rotation.z;
					var element = this.aoz.banks.get3DElement( '3D', index, this.aoz.currentContextName );
					this.aoz.loadingMax++;
					var tdElement = element.loadObject( {}, function( response, tdElement, extra )
					{
						var mesh;
						self.aoz.loadingCount++;
						if ( response )
						{
							var mesh = tdElement.data.clone();
							mesh.name = index;
							if ( typeof args.material != 'undefined' || typeof args.image != 'undefined' || typeof color != 'undefined' )
								self.setMaterial( mesh, self.material( index, args ) );
							mesh = self.finishCreateObject( index, undefined, args, mesh );						
							mesh.updateMatrix();
							self.modified = true;
							if ( callback )
								callback ( true, mesh, extra );
							return;
						}
						callback( false, tdElement, extra );
					} );
					if ( !tdElement )
						return false;
					var mesh = tdElement.data.clone();
					mesh.name = index;
					if ( typeof args.material != 'undefined' || typeof args.image != 'undefined' || typeof color != 'undefined' )
						this.setMaterial( mesh, this.material( index, args ) );
					mesh = this.finishCreateObject( index, undefined, args, mesh );
					mesh.updateMatrix();
					this.modified = true;
					return mesh;				
				}
			}
			var update = this.finishObject( mesh, args );
			if ( update )
			{
				mesh.updateMatrix();
				this.modified = true;
			}
			return mesh;
		};
		this.Scene.prototype.lines = function( index, args, callback, extra )
		{
			var self = this;
			var line = this.objects[ 'line:' + index.toLowerCase() ];
			if ( !line )
			{
				args.position.x = typeof args.position.x == 'undefined' ? 0 : args.position.x;
				args.position.y = typeof args.position.y == 'undefined' ? 0 : args.position.y;
				args.position.z = typeof args.position.z == 'undefined' ? 0 : args.position.z;
				args.scale.x = typeof args.scale.x == 'undefined' ? 1 : args.scale.x;
				args.scale.y = typeof args.scale.y == 'undefined' ? 1 : args.scale.y;
				args.scale.z = typeof args.scale.z == 'undefined' ? 1 : args.scale.z;
				args.rotation.x = typeof args.rotation.x == 'undefined' ? 0 : args.rotation.x;
				args.rotation.y = typeof args.rotation.y == 'undefined' ? 0 : args.rotation.y;
				args.rotation.z = typeof args.rotation.z == 'undefined' ? 0 : args.rotation.z;
				args.color = typeof args.color == 'undefined' ? 0xFFFFFF : args.color;
				args.loop = typeof args.loop == 'undefined' ? false : args.loop;
				var points = [];
				var l = Math.min( Math.min( args.pointsX.length, args.pointsY.length ), args.pointsZ.length );
				for ( var i = 0; i < l; i ++ )
					points.push( new THREE.Vector3( args.pointsX[ i ], args.pointsY[ i ], args.pointsZ[ i ] ) );
				var colors = [];
				if ( args.colors )
				{
					l = Math.min( l, args.colors.length );
					var rgb = this.aoz.utilities.getRGBColors( args.colors[ i ] );
					colors.push( rgb.r / 256, rgb.g / 256, rgb.b / 256 );
				}
				else
				{
					var rgb = this.aoz.utilities.getRGBColors( args.color );
					for ( var i = 0; i < l; i++ )
						colors.push( rgb.r / 256, rgb.g / 256, rgb.b / 256 );
				}
				var geometry = new THREE.BufferGeometry().setFromPoints( points );
				geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
				geometry.computeBoundingSphere();
				var material;
				if ( typeof args.material != 'undefined' || typeof args.image != 'undefined' || typeof color != 'undefined' )
				{
					args.vertexColors = true;
					this.setMaterial( line, this.material( index, args ) );
				}
				else
					material = new THREE.LineBasicMaterial( { color: args.color } );
				if ( args.loop )
					line = new THREE.LineLoop( geometry, material );
				else
					line = new THREE.Line( geometry, material );
				line.name = index;
				this.addObject( line );
			}
			var update = this.finishObject( line, args );
			if ( update )
			{
				line.updateMatrix();
				this.modified = true;
			}
			return line;
		};
		this.Scene.prototype.copyArgs = function( obj, args )
		{
			if ( !obj.aozArgs )
				obj.aozArgs = {};
			for ( var p in args )
			{
				if ( typeof args[ p ] != 'undefined' )
					 obj.aozArgs[ p ] = args[ p ];
			}
		};
		this.Scene.prototype.finishCreateObject = function( index, geometry, args, shape )
		{
			var self = this;
			args.position.x = typeof args.position.x == 'undefined' ? 0 : args.position.x;
			args.position.y = typeof args.position.y == 'undefined' ? 0 : args.position.y;
			args.position.z = typeof args.position.z == 'undefined' ? 0 : args.position.z;
			args.scale.x = typeof args.scale.x == 'undefined' ? 1 : args.scale.x;
			args.scale.y = typeof args.scale.y == 'undefined' ? 1 : args.scale.y;
			args.scale.z = typeof args.scale.z == 'undefined' ? 1 : args.scale.z;
			args.rotation.x = typeof args.rotation.x == 'undefined' ? 0 : args.rotation.x;
			args.rotation.y = typeof args.rotation.y == 'undefined' ? 0 : args.rotation.y;
			args.rotation.z = typeof args.rotation.z == 'undefined' ? 0 : args.rotation.z;
			var mesh;
			var parent = args.parent;
			args.parent = null;
			if ( geometry )
			{
				var material = this.screen3D.material( index, args );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = '' + index;
			}
			else
			{
				mesh = shape;
			}
			mesh.castShadow = typeof args.castShadow == 'undefined' ? false : args.castShadow;
			mesh.receiveShadow = typeof args.receiveShadow == 'undefined' ? false : args.receiveShadow;
			mesh.position.x = args.position.x;
			mesh.position.y = args.position.y;
			mesh.position.z = args.position.z;
			mesh.rotation.x = args.rotation.x;
			mesh.rotation.y = args.rotation.y;
			mesh.rotation.z = args.rotation.z;
			mesh.scale.x = args.scale.x;
			mesh.scale.y = args.scale.y;
			mesh.scale.z = args.scale.z;
			if ( parent )
				parent.attach( mesh );
			else
				this.addObject( mesh );		
			this.copyArgs( mesh, args );
			return mesh;
		}
		this.Scene.prototype.finishObject = function( index, args )
		{
			var update = false;
			var obj, body;
			if ( typeof index == 'string' )
			{
				obj = this.objects[ 'mesh:' + index.toLowerCase() ];
				body = this.bodies[ index.toLowerCase() ];
			}
			else 
			{
				obj = index;
			}
			if ( body )
			{
			}
			else
			{
				if ( args.position )
				{
					if ( typeof args.position.x != 'undefined' ) { obj.position.x = args.position.x; update = true; }
					if ( typeof args.position.y != 'undefined' ) { obj.position.y = args.position.y; update = true; }
					if ( typeof args.position.z != 'undefined' ) { obj.position.z = args.position.z; update = true; }
				}
				if ( args.rotation )
				{
					if ( typeof args.rotation.x != 'undefined' ) { obj.rotation.x = args.rotation.x; update = true; }
					if ( typeof args.rotation.y != 'undefined' ) { obj.rotation.y = args.rotation.y; update = true; }
					if ( typeof args.rotation.z != 'undefined' ) { obj.rotation.z = args.rotation.z; update = true; }
				}
				if ( args.scale )
				{
					if ( typeof args.scale.x != 'undefined' ) { obj.scale.x = args.scale.x; update = true; }
					if ( typeof args.scale.y != 'undefined' ) { obj.scale.y = args.scale.y; update = true; }
					if ( typeof args.scale.z != 'undefined' ) { obj.scale.z = args.scale.z; update = true; }
				}
			}
			if ( typeof args.visible != 'undefined' ) { obj.visible = args.visible; update = true; }
			this.copyArgs( obj, args );
			return update;
		};
		this.Scene.prototype.finishRigidBody = function( friend, args )
		{
			var body;
			var index = friend.name;
			var mesh = friend.object3D;
			args.scale = typeof args.scale == 'undefined' ? { x: 1, y: 1, z: 1 } : args.scale;
			args.mass = typeof args.mass == 'undefined' ? 0 : args.mass;
			switch ( friend.className )
			{
				default:			
				case 'cube':
					var halfExtents = new CANNON.Vec3( friend.vars.Width_f * args.scale.x / 2, friend.vars.Height_f * args.scale.y / 2, friend.vars.Depth_f * args.scale.z / 2 )
					body = new CANNON.Body( { mass: args.mass, shape: new CANNON.Box( halfExtents ) } );
					body.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
					break;
				case 'sphere':
					body = new CANNON.Body( { mass: args.mass, shape: new CANNON.Sphere( friend.vars.Radius_f * args.scale.x ) } );
					body.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
					break;
				case 'cylinder':
					var shape = new CANNON.Cylinder( friend.vars.RadiusTop_f, friend.vars.RadiusBottom_f,  friend.vars.Height_f, 12 );
					body = this.createRigidBody( { mass: args.mass, shape: shape } );
					break;
				case 'plane':
					var halfExtents = new CANNON.Vec3( friend.vars.Width_f * args.scale.x / 2, friend.vars.Height_f * args.scale.y / 2, 1 );
					body = new CANNON.Body( { mass: args.mass, shape: new CANNON.Box( halfExtents ) } );
					body.position.set( mesh.position.x, mesh.position.y, mesh.position.z );
					break;
					break;
			}
			if ( body )
			{
				body.name = index;
				this.addBody( body );
			}
			return body;
		}
		this.Scene.prototype.cube = function( index, args, callback, extra )
		{
			var self = this;
			var cube = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !cube )
			{
				args.dimensions.x = typeof args.dimensions.x == 'undefined' ? 1 : args.dimensions.x;
				args.dimensions.y = typeof args.dimensions.y == 'undefined' ? 1 : args.dimensions.y;
				args.dimensions.z = typeof args.dimensions.z == 'undefined' ? 1 : args.dimensions.z;
				var geometry = new THREE.BoxGeometry( args.dimensions.x, args.dimensions.y, args.dimensions.z );
				cube = this.finishCreateObject( index, geometry, args, 'box' );
				this.modified = true;
				return cube;
			}
			var update = this.finishObject( cube, args );
			if ( update )
			{
				cube.updateMatrix();
				this.modified = true;
			}
			return cube;
		}
		this.Scene.prototype.sphere = function( index, args )
		{
			var sphere = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !sphere )
			{
				args.radius = typeof args.radius == 'undefined' ? 1: args.radius;
				var geometry = new THREE.SphereGeometry( args.radius, 32, 16 );
				sphere = this.finishCreateObject( index, geometry, args, 'sphere' );
				this.modified = true;
				return sphere;
			}
			var update = this.finishObject( sphere, args );
			if ( update )
			{
				sphere.updateMatrix();
				this.modified = true;
			}
			return sphere;
		}
		this.Scene.prototype.cone = function( index, args )
		{
			var cone = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !cone )
			{
				args.radius = typeof args.radius == 'undefined' ? 1: args.radius;
				args.height = typeof args.height == 'undefined' ? 1: args.height;
				var geometry = new THREE.ConeGeometry( args.radius, args.height, 32 );
				cone = this.finishCreateObject( index, geometry, args, 'cylinder' );
				this.modified = true;
				return cone;
			}
			var update = this.finishObject( cone, args );
			if ( update )
			{
				cone.updateMatrix();
				this.modified = true;
			}
			return cone;
		}
		this.Scene.prototype.plane = function( index, args )
		{
			var plane = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !plane )
			{
				args.width = typeof args.width == 'undefined' ? 1 : args.width;
				args.height = typeof args.height == 'undefined' ? 1 : args.height;
				var geometry = new THREE.PlaneGeometry( args.width, args.height );
				plane = this.finishCreateObject( index, geometry, args, 'plane' );
				this.modified = true;
				return plane;
			}
			var update = this.finishObject( plane, args );
			if ( update )
			{
				plane.updateMatrix();
				this.modified = true;
			}
			return plane;
		}
		this.Scene.prototype.cylinder = function( index, args )
		{
			var cylinder = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !cylinder )
			{
				args.radiusTop = typeof args.radiusTop == 'undefined' ? 1 : args.radiusTop;
				args.radiusBottom = typeof args.radiusBottom == 'undefined' ? 1 : args.radiusBottom;
				args.height = typeof args.height == 'undefined' ? 1 : args.height;
				args.radius = args.radiusTop;
				var geometry = new THREE.CylinderGeometry( args.radiusTop, args.radiusBottom, args.height, 16, 1, !args.filled );
				cylinder = this.finishCreateObject( index, geometry, args, 'cylinder' );
				this.modified = true;
				return cylinder;
			}
			var update = this.finishObject( cylinder, args );
			if ( update )
			{
				cylinder.updateMatrix();
				this.modified = true;
			}
			return cylinder;
		};
		this.Scene.prototype.meshX = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.position.x;
		};
		this.Scene.prototype.meshY = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.position.y;
		};
		this.Scene.prototype.meshZ = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.position.z;
		};
		this.Scene.prototype.getMeshSize = function( obj )
		{
			if ( obj instanceof THREE.Object3D )
			{
				var minX = obj.position.x, minY = obj.position.y, minZ = obj.position.z;
				var maxX = minX, maxY = minY, maxZ = minZ;
				obj.traverse ( function( mesh )
				{
					if ( mesh instanceof THREE.Mesh )
					{
						mesh.geometry.computeBoundingBox();
						var bBox = mesh.geometry.boundingBox;
						minX = Math.min ( minX, bBox.min.x );
						minY = Math.min ( minY, bBox.min.y );
						minZ = Math.min ( minZ, bBox.min.z );
						maxX = Math.max ( maxX, bBox.max.x );
						maxY = Math.max ( maxY, bBox.max.y );
						maxZ = Math.max ( maxZ, bBox.max.z );
					}
				});
				return { width: ( maxX - minX ) * obj.scale.x, height: ( maxY - minY ) * obj.scale.y, depth: ( maxZ - minZ ) * obj.scale.z };
			}
			return { width: 0, height: 0, depth: 0 };
		};
		this.Scene.prototype.meshWidth = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			var size = this.getMeshSize( mesh );
			return size.width;
		};
		this.Scene.prototype.meshHeight = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			var size = this.getMeshSize( mesh );
			return size.height;
		};
		this.Scene.prototype.meshDepth = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			var size = this.getMeshSize( mesh );
			return size.depth;
		};
		this.Scene.prototype.meshAngleX = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.getWorldQuaternion().x;
		};
		this.Scene.prototype.meshAngleY = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.getWorldQuaternion().y;
		};
		this.Scene.prototype.meshAngleZ = function( index )
		{
			var mesh = this.objects[ 'mesh:' + index.toLowerCase() ];
			if ( !mesh )
				throw { error: 'object_not_defined', parameter: index };
			return mesh.getWorldQuaternion().z;
		};
		this.Scene.prototype.getCamera = function( index )
		{
			var camera;
			if ( typeof index == 'undefined' )
				camera = this.currentCamera;
			if ( !camera )
			{
				camera = this.objects[ 'camera:' + index.toLowerCase() ];
				if ( !camera )
				{
					camera = this.scene.getObjectByName( '' + index );
					if ( camera )
						this.objects[ 'camera:' + index.toLowerCase() ] = camera;
					else
						throw { error: 'object_not_defined', parameter: index };
				}
			}
			return camera;
		}
		this.Screen3D = function( aoz, screen, args )
		{
			this.aoz = aoz;
			this.screen = screen;
			this.currentScene = null;
			this.scenes = {};
			this.textures = {};
			this.materials = {};
			this.wrapping = 
			[
				THREE.RepeatWrapping,
				THREE.MirroredRepeatWrapping,
				THREE.ClampToEdgeWrapping
			];
			this.mapping = 
			[
				THREE.UVMapping,
				THREE.CubeReflectionMapping,
				THREE.CubeRefractionMapping,
				THREE.EquirectangularReflectionMapping,
				THREE.EquirectangularRefractionMapping,
				THREE.CubeUVReflectionMapping,
			];
			var aozCanvas = document.querySelector( '#AOZCanvas' );
			this.canvas = document.createElement( 'canvas' );
			this.canvas.width = screen.vars.width;
			this.canvas.height = screen.vars.height;
			this.canvas.style.position = "absolute";
			this.canvas.style.top = "0px";
			this.canvas.style.left = "0px";
			this.canvas.style.zIndex = "-1";
			this.renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: application.aoz.manifest.display.smoothing, alpha: false } );
			this.renderer.setSize( screen.vars.width, screen.vars.height );
			aozCanvas.style.zIndex = "100";
			document.body.appendChild( this.renderer.domElement );
			this.aoz.addExternalEventHandler( this, this.eventCallback, '3d-' + screen.index, {}, 99 );		
		};
		this.Screen3D.prototype.loadScene = function( index, args, callback, extra )
		{
			if ( this.scenes[ index ] )
				throw { error: 'scene_already_defined', parameter: index };
			var self = this;
			var scene = new this.aoz.three_d.Scene( this, index, args, function( response, scene, extra )
			{
				if ( response )
				{
					this.scenes[ index ] = scene;
					if ( args.setCurrent )
						this.currentScene = scene;
				}
				callback ( response, scene, extra );
			}, extra );
			if ( scene.scene )
			{
				this.scenes[ index ] = scene;
				if ( args.setCurrent )
					this.currentScene = scene;
				return scene;			
			}
			return null;
		};
		this.Screen3D.prototype.createDefaultScene = function( args, callback, extra )
		{
			return this.scene( 'Scene', args, callback, extra );
		};
		this.Screen3D.prototype.scene = function( index, args, callback, extra )
		{
			var scene = this.scenes[ index ];
			if ( !scene )
			{
				scene = new this.aoz.three_d.Scene( this, index, args, function( response, scene, extra )
				{
					self.scenes[ index ] = scene;
					scene.setScene( args );
					if ( args.setCurrent )
						self.currentScene = scene;
					callback ( response, scene, extra );
				}, extra );
				if ( scene.scene )
				{
					this.scenes[ index ] = scene;
					scene.setScene( args );
					if ( args.setCurrent )
						this.currentScene = scene;
					return scene;
				}
				return null;
			}
			scene.setScene( args );
			return null;
		};
		this.Screen3D.prototype.setCurrentScene = function( index )
		{
			var scene = this.scenes[ index ];
			if ( !scene )
				throw { error: 'scene_not_defined', parameter: index };
			this.currentScene = scene;
			scene.modified = true;
		};
		this.Screen3D.prototype.close = function()
		{
			this.aoz.removeExternalEventHandler( '3d-' + screen.index );
		};
		this.Screen3D.prototype.update = function( force, deltaTime )
		{
			if ( this.currentScene && ( this.currentScene.modified || force || this.currentScene.world ) )
			{
				this.currentScene.render( this.renderer, deltaTime );
			}
		};
		this.Screen3D.prototype.eventCallback = function( type, event, extra )
		{
			if ( type == 'update' )
				this.update( true, event );		// event = deltaTime for update messages (from Aoz)
			else
			{
				var newEvent;
				switch ( type )
				{
					case 'keydown':
					case 'keyup':
					case 'keypress':
						newEvent = new KeyboardEvent( type, 
						{
							key: event.key,
							code: event.code,
							location: event.location,
							repeat: event.repeat,
							isComposing: event.isComposing,
							charCode: event.charCode,
							keyCode: event.keyCode,
							which: event.which,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							altKey: event.altKey,
							metaKey: event.metaKey
						} );
						break;
					case 'drag':
					case 'dragend':
					case 'dragenter':
					case 'dragleave':
					case 'dragover':
					case 'dragstart':
					case 'drop':
						newEvent = new DragEvent( type, 
						{
							screenX: event.screenX,
							screenY: event.screenY,
							clientX: event.clientX,
							clientY: event.clientY,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							altKey: event.altKey,
							metaKey: event.metaKey,
							button: event.button,
							buttons: event.buttons,
							movementX: event.movementX,
							movementY: event.movementY
						} );
						break;
					case 'wheel':
						newEvent = new WheelEvent( type, 
						{
							deltaX: event.deltaX,
							deltaY: event.deltaY,
							deltaZ: event.deltaZ,
							deltaMode: event.deltaMode
						} );
						break;
					case 'pointerover':
					case 'pointerenter':
					case 'pointercancel':
					case 'pointerout':
					case 'pointerleave':
					case 'pointercapture':
					case 'lostpointerCapture':
					case 'pointerup':
					case 'pointerdown':
					case 'pointermove':
						newEvent = new PointerEvent( type, 
						{
							pointerId: event.pointerId,
							width: event.width,
							height: event.height,
							pressure: event.pressure,
							tangentialPressure: event.tangentialPressure,
							tiltX: event.tiltX,
							tiltY: event.tiltY,
							twist: event.twist,
							pointerType: event.pointerType,
							isPrimary: event.isPrimary,
							screenX: event.screenX,
							screenY: event.screenY,
							clientX: event.clientX,
							clientY: event.clientY,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							altKey: event.altKey,
							metaKey: event.metaKey,
							button: event.button,
							buttons: event.buttons,
							movementX: event.movementX,
							movementY: event.movementY
						} );
						break;
					case 'mouseenter':
					case 'mouseleave':
					case 'mousemove':
					case 'mousedown':
					case 'mouseup':
					case 'mouseout':
					case 'click':
					case 'dblclick':
						newEvent = new MouseEvent( type, 
						{
							screenX: event.screenX,
							screenY: event.screenY,
							clientX: event.clientX,
							clientY: event.clientY,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							altKey: event.altKey,
							metaKey: event.metaKey,
							button: event.button,
							buttons: event.buttons,
							movementX: event.movementX,
							movementY: event.movementY
						} );
						break;
				}
				if ( newEvent )
					this.renderer.domElement.dispatchEvent( newEvent );
			}
			return event;
		};
		this.Screen3D.prototype.gradCanvas = function( color ) 
		{
			var c = document.createElement( "canvas" );
			var ct = c.getContext( "2d" );
			var size = 1024;
			c.width = 16; 
			c.height = size;
			var gradient = ct.createLinearGradient( 0, 0, 0, size );
			var i = color[ 0 ].length;
			while( i-- )
			{
				gradient.addColorStop( color[ 0 ][ i ],color[ 1 ][ i ] ); 
			}
			ct.fillStyle = gradient;
			ct.fillRect( 0, 0, 16, size );
			return c;
		};
		this.Screen3D.prototype.basicCanvas = function( color ) 
		{
			var canvas = document.createElement( 'canvas' );
			canvas.width = canvas.height = 64;
			var context = canvas.getContext( '2d' );
			context.fillStyle = this.aoz.utilities.getModernColorString( color );
			context.fillRect( 0, 0, 64, 64 );
			context.fillStyle = "rgba(0,0,0,0.2)";
			context.fillRect( 0, 0, 32, 32 );
			context.fillRect( 32, 32, 32, 32 );
			return canvas;
		};
		this.Screen3D.prototype.getTexture = function( index )
		{
			var texture = index;
			if ( typeof index == 'string' )
			{
				texture = this.textures[ index ];
				if ( !texture )
					throw { error: 'texture_not_defined', parameter: index };
			}
			return texture;
		}
		this.Screen3D.prototype.getCanvas = function( args )
			{
				var canvas;
				if ( typeof args.type == 'string' )
				{
					switch ( args.type )
					{
						default:
						case 'color':
							args.color = typeof args.color == 'undefined' ? 0xFFFFFF : args.color;
						canvas = this.basicCanvas( args.color );
							break;
						case 'rainbow':
							args.width = typeof args.width == 'undefined' ? 256 : args.width;
							args.height = typeof args.height == 'undefined' ? 256 : args.height;
							canvas = document.createElement( 'canvas' );
							canvas.width = args.width;
							canvas.height = args.height;					
							var context = canvas.getContext( '2d' );
						var rainbow = new this.aoz.moduleRainbows.Rainbow( this.aoz, 'Sky', 0, args.height, args.red, args.green, args.blue );
							rainbow.setType( 'amiga' );
							rainbow.setPosition( { x: 0, y: 0 } );
							rainbow.setOffset( { y: 0 } );
							rainbow.setSize( { width: args.width, height: args.height } );
							rainbow.render( context, 
							{
								width: args.width,
								height: args.height,
								xLeftDraw: 0,
								yTopDraw: 0, 
								xRatioDisplay: 1,
								yRatioDisplay: 1,
								hardLeftX: 0,
								hardTopY: 0
							} );
							break;				
						case 'cube':
						var bank = this.aoz.banks.getBank( undefined, this.aoz.currentContextName, 'images' );
							canvas = [];
							canvas.push( bank.getElement( args.image + '-px' ).getCanvas() );
							canvas.push( bank.getElement( args.image + '-nx' ).getCanvas() );
							canvas.push( bank.getElement( args.image + '-py' ).getCanvas() );
							canvas.push( bank.getElement( args.image + '-ny' ).getCanvas() );
							canvas.push( bank.getElement( args.image + '-pz' ).getCanvas() );
							canvas.push( bank.getElement( args.image + '-nz' ).getCanvas() );
							break;
						case 'image':
						var bank = this.aoz.banks.getBank( undefined, this.aoz.currentContextName, 'images' );
							var imageObject = bank.getElement( args.image );
							canvas = imageObject.getCanvas();
							break;
					}
				}
				else 
				{
					canvas = args.image;
				}
				return canvas;
		}
		this.Screen3D.prototype.finishTexture = function( index, args, load )
		{
			var texture = this.getTexture( index );
			var self = this;
			if ( !load )
			{
				if ( typeof args.wrapS != 'undefined' )
				{
					if ( args.wrapS < 0 || args.wrapS > 2 )
						throw { error: 'illegal_function_call', parameter: args.wrapS };
						texture.wrapS = this.wrapping[ args.wrapS ];
					texture.needsUpdate = true;				
				}
				if ( typeof args.wrapT != 'undefined' )
				{
					if ( args.wrapT < 0 || args.wrapT > 2 )
						throw { error: 'illegal_function_call', parameter: args.wrapT };
						texture.wrapT = this.wrapping[ args.wrapT ];
					texture.needsUpdate = true;				
				}
				if ( typeof args.mapping != 'undefined' )
				{
					if ( args.mapping < 0 || args.mapping > 5 )
						throw { error: 'illegal_function_call', parameter: args.mapping };
						texture.mapping = this.mapping[ args.mapping ];
					texture.needsUpdate = true;				
				}
				if ( typeof args.repeatX != 'undefined' )
				{
					if ( args.repeatX < 1 )
							throw { error: 'illegal_function_call', parameter: args.repeatX };
					texture.repeat.x = args.repeatX;
					texture.needsUpdate = true;				
				}
				if ( typeof args.repeatY != 'undefined' )
				{
					if ( args.repeatY < 1 )
							throw { error: 'illegal_function_call', parameter: args.repeatY };
					texture.repeat.y = args.repeatY;
					texture.needsUpdate = true;				
				}
				texture.aozArgs = typeof texture.aozArgs == 'undefined' ? { type: args.type } : texture.aozArgs;
				switch( texture.aozArgs.type  )		
				{
					default:
					case 'color':
						if ( typeof args.color != 'undefined' && args.image != texture.aozArgs.color )
						{
								texture.canvas = this.getCanvas( args );
							texture.aozArgs.color = args.color;
							texture.needsUpdate = true;				
						}
						break;
					case 'image':
					case 'cube':
						if ( typeof args.image != 'undefined' && args.image != texture.aozArgs.image )
						{
							texture.canvas = this.getCanvas( args );
							texture.aozArgs.image = args.image;
							texture.needsUpdate = true;				
						}
						break;
					case 'rainbow':
						args.width = typeof args.width == 'undefined' ? texture.aozArgs.width : args.width;
						args.height = typeof args.height == 'undefined' ? texture.aozArgs.height : args.height;
						args.red = typeof args.red == 'undefined' ? texture.aozArgs.red : args.red;
						args.green = typeof args.green == 'undefined' ? texture.aozArgs.green : args.green;
						args.blue = typeof args.blue == 'undefined' ? texture.aozArgs.blue : args.blue;
						if ( args.width != texture.aozArgs.width || args.height != texture.aozArgs.height || args.red != texture.aozArgs.red || args.blue != texture.aozArgs.blue || args.blue != texture.aozArgs.blue )
						{
								texture.canvas = this.getCanvas( args );
							texture.aozArgs.width = args.width;
							texture.aozArgs.height = args.height;
							texture.aozArgs.red = args.red;
							texture.aozArgs.green = args.green;
							texture.aozArgs.blue = args.blue;
							texture.needsUpdate = true;				
						}
						break;
				}
			}
			else
			{
				var self = this;
				function getWrap( wrap )
				{
					for ( var w = 0; w < self.wrapping.length; w++ )
					{
						if ( wrap == self.wrapping[ w ] )
							break;
					}
					return w;
				}
				function getMap( map )
				{
					for ( var m = 0; m < self.mapping.length; m++ )
					{
						if ( map == self.mapping[ m ] )
							break;
					}
					return m;
				}
				args.wrapS = getWrap( texture.wrapS );
				args.wrapT = getWrap( texture.wrapT );
				args.mapping = getMap( texture.mapping );
				args.repeatX = texture.repeat.x;
				args.repeatY = texture.repeat.y;
			}
			texture.aozArgs = self.aoz.utilities.copyObject( args );
		};
		this.Screen3D.prototype.texture = function( index, args, callback, extra )
		{
			var texture = this.textures[ index ];
			if ( !texture )
			{
				args.type = typeof args.type == 'undefined' ? 'color' : args.type;
				args.wrapS = typeof args.wrapS == 'undefined' ? 0 : args.wrapS;
				args.wrapT = typeof args.wrapT == 'undefined' ? 0 : args.wrapT;
				if ( args.wrapS < 0 || args.wrapS > 2 || args.wrapT < 0 || args.wrapT > 2 )
					throw { error: 'illegal_function_call', parameter: args.wrapS };
				args.mapping = typeof args.mapping == 'undefined' ? 0 : args.mapping;
				if ( args.mapping < 0 || args.mapping > 5 )
					throw { error: 'illegal_function_call', parameter: args.mapping };
				args.repeatX = typeof args.repeatX == 'undefined' ? 1 : args.repeatX;		
				args.repeatY = typeof args.repeatY == 'undefined' ? 1 : args.repeatY;		
				var bank = this.aoz.banks.getBank( undefined, undefined, '3D' );
				var element = bank.getElement( index, 'texture', true );
				if ( element )
				{
					var self = this;
					this.aoz.loadingMax++;
					element.loadTexture( {}, function( response, tex, extra )
					{
						var mesh;					
						self.aoz.loadingCount++;
						if ( response )
						{
							tex.name = index;
							self.textures[ index ] = tex;
							if ( args.type == '360' )
								tex.mapping =  THREE.EquirectangularReflectionMapping;						
							self.finishTexture( tex, args, true );
							self.modified = true;
							if ( callback )
								callback ( true, tex, extra );
							return;
						}
						callback( false, tex, extra );
					} );
					return;
				}
				var canvas = this.getCanvas( args );
				texture = new THREE.CanvasTexture( canvas, this.mapping[ args.mapping ], this.wrapping[ args.wrapS ], this.wrapping[ args.wrapT ] );
				texture.name = index;
				this.textures[ index ] = texture;
				this.finishTexture( texture, args );
				return texture;
			}
			this.finishTexture( texture, args );
			return texture;
		};
		this.Screen3D.prototype.textureSet = function( property, index, value )
		{
			var texture = this.textures[ index ];
			if ( !texture )
				throw { error: 'texture_not_defined', parameter: index };
			if ( typeof texture[ property ] != 'undefined' )
			{
				texture[ property ] = value;
				return;
			}
			throw { error: 'property_not_defined', parameter: property };
		};
		this.Screen3D.prototype.textureGet = function( property, index )
		{
			var texture = this.textures[ index ];
			if ( !texture )
				throw { error: 'texture_not_defined', parameter: index };
			if ( typeof texture[ property ] != 'undefined' )
			{
				return texture[ property ];
			}
			throw { error: 'property_not_defined', parameter: property };
		};
		this.Screen3D.prototype.material = function( index, args )
		{
			var sides = 
			[
				THREE.FrontSide, 
				THREE.BackSide, 
				THREE.DoubleSide, 
			];
			var material = this.materials[ index ];
			if ( !material )
			{
				var texture;
				if ( typeof args.texture != 'undefined' )
				{
					if ( typeof args.texture == 'string' )
					{
						texture = this.textures[ args.texture ];
						if ( !texture )
							throw { error: 'texture_not_defined', parameter: args.texture };
					}
					else
					{
						texture = args.texture;
					}
				}
				else
				{
					var saveType = args.type;
					if ( typeof args.image != 'undefined' )
						args.type = 'image';
					else
						args.type = 'color';
					texture = this.texture( index, args );
					args.type = saveType;
				}
				args.side = typeof args.side == 'undefined' ? 2 : args.side;
				if ( args.side < 0 || args.side > 2 )
					throw { error: 'illegal_function_call', parameter: args.side };
				args.wireframe = typeof args.wireframe == 'undefined' ? false : args.wireframe;
				args.emissive = typeof args.emissive == 'undefined' ? 0x0000000 : args.emissive,
				args.flatShading = typeof args.flatShading == 'undefined' ? false : args.flatShading;
				args.color = typeof args.color == 'undefined' ? 0xFFFFFFFF : args.color;
				args.fog = typeof args.fog == 'undefined' ? true : args.fog;
				args.transparent = typeof args.transparent == 'undefined' ? true : args.transparent;
				args.depthWrite = typeof args.depthWrite == 'undefined' ? true : args.depthWrite;
				switch ( args.type )
				{
					case 'toon':
						material = new THREE.MeshToonMaterial( 
						{
							depthWrite: args.depthWrite,
							wireframe: args.wireframe,
							emissive: args.emissive,
							flatShading: args.flatShading,
							color: args.color,
							fog: args.fog,
							map: texture, 
							side: sides[ args.side ], 
							transparent: args.transparent
						} );
						break;
					case 'lambert':
						material = new THREE.MeshLambertMaterial( 
						{
							depthWrite: args.depthWrite,
							wireframe: args.wireframe,
							emissive: args.emissive,
							reflectivity: typeof args.reflectivity == 'undefined' ? 1 : args.reflectivity,
							flatShading: args.flatShading,
							color: args.color,
							fog: args.fog,
							map: texture, 
							side: sides[ args.side ], 
							transparent: args.transparent
						} );
						break;
					case 'phong':
						material = new THREE.MeshPhongMaterial( 
						{
							depthWrite: args.depthWrite,
							wireframe: args.wireframe,
							emissive: args.emissive,
							reflectivity: typeof args.reflectivity == 'undefined' ? 1 : args.reflectivity,
							shininess: typeof args.shininess == 'undefined' ? 30 : args.shininess,
							specular:  typeof args.specular == 'undefined' ? 0x111111 : args.specular,
							flatShading: args.flatShading,
							color: args.color,
							fog: args.fog,
							map: texture, 
							side: sides[ args.side ], 
							transparent: args.transparent
						} );
						break;
					case 'basic':
						material = new THREE.MeshBasicMaterial( 
						{
							depthWrite: args.depthWrite,
							map: texture, 
							wireframe: args.wireframe,
							emissive: args.emissive,
							reflectivity: typeof args.reflectivity == 'undefined' ? 1 : args.reflectivity,
							color: args.color,
							fog: args.fog,
							side: sides[ args.side ], 
							transparent: args.transparent
						} );
						break;
					default: 
						material = new THREE.MeshStandardMaterial( 
						{
							depthWrite: args.depthWrite,
							wireframe: args.wireframe,
							emissive: args.emissive,
							metalness: typeof args.metalness == 'undefined' ? 0.5 : args.metalness,
							roughness: typeof args.roughness == 'undefined' ? 0 : args.roughness,
							flatShading: args.flatShading,
							color: args.color, 
							fog: args.fog,
							map: texture, 
							side: sides[ args.side ],
							transparent: args.transparent,
						} );
						break;
				}
				material.name = index;
				material.aozArgs = args;
				this.materials[ index ] = material;
				return material;
			}
			args.side = typeof args.side == 'undefined' ? material.aozArgs.side : args.side;
			args.wireframe = typeof args.wireframe == 'undefined' ? material.aozArgs.wireframe : args.wireframe;
			args.emissive = typeof args.emissive == 'undefined' ? material.aozArgs.emissive : args.emissive,
			args.flatShading = typeof args.flatShading == 'undefined' ? material.aozArgs.flatShading : args.flatShading;
			args.color = typeof args.color == 'undefined' ? material.aozArgs.color : args.color;
			args.fog = typeof args.fog == 'undefined' ? material.aozArgs.fog : args.fog;
			args.transparent = typeof args.transparent == 'undefined' ? material.aozArgs.transparent : args.transparent;
			args.depthWrite = typeof args.depthWrite == 'undefined' ? material.aozArgs.depthWrite : args.depthWrite;
			material.side = sides[ args.side ];
			material.wireframe = sides[ args.wireframe ];
			material.transparent = args.transparent;
			material.fog = args.fog;
			material.emissive = args.emissive;
			material.depthWrite = args.depthWrite;
			material.flatShading = args.flatShading;
			if ( args.texture != 'undefined' && args.texture != material.aozArgs.texture )
			{
				texture = this.textures[ args.texture ];
				if ( !texture )
					throw { error: 'texture_not_defined', parameter: args.texture };
				material.map = texture;
			}
			switch ( material.aozArgs.type )
			{
				case 'toon':
					break;
				case 'basic':
				case 'lambert':
					args.reflectivity = typeof args.reflectivity == 'undefined' ? material.aozArgs.reflexivity : args.reflectivity,
					material.reflexivity = args.reflexivity;
					break;
				case 'phong':
					args.reflectivity = typeof args.reflectivity == 'undefined' ? material.aozArgs.reflexivity : args.reflectivity,
					args.shininess = typeof args.shininess == 'undefined' ? material.aozArgs.shininess : args.shininess,
					args.specular = typeof args.specular == 'undefined' ? material.aozArgs.specular : args.specular,
					material.reflexivity = args.reflexivity;
					material.shininess = args.shininess;
					material.specular = args.specular;
					break;
				default: 
					args.metalness = typeof args.metalness == 'undefined' ? material.aozArgs.metalness : args.metalness,
					args.roughness = typeof args.roughness == 'undefined' ? material.aozArgs.roughness : args.roughness,
					material.metalness = args.metalness;
					material.roughness = args.roughness;
					break;
			}
			for ( var p in args )
				material.aozArgs[ p ] = args[ p ];
		};
		this.Screen3D.prototype.materialSet = function( property, index, value, noTest )
		{
			if ( index == 'all' )
			{
				for ( var m in this.materials )
				{
					if ( noTest ||typeof this.materials[ m ][ property ] != 'undefined' )
						this.materials[ m ][ property ] = value;
					else
						throw { error: 'property_not_defined', parameter: property };
				}
			}
			else
			{
			var material = this.materials[ index ];
			if ( !material )
				throw { error: 'material_not_defined', parameter: index };
				if ( noTest || typeof material[ property ] != 'undefined' )
				{
					material[ property ] = value;
					return;
				}
				throw { error: 'property_not_defined', parameter: property };
			}
		};
		this.Screen3D.prototype.materialGet = function( property, index )
		{
			var material = this.materials[ index ];
			if ( !material )
				throw { error: 'material_not_defined', parameter: index };
			if ( typeof material[ property ] != 'undefined' )
			{
				return material[ property ];
			}
			throw { error: 'property_not_defined', parameter: property };
		};
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.c_movement=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="movement";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.defaults={
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2069:4";
			// Javascript
			console.log( "youpi!" )
			// End Javascript
			return{type:0}
			return{type:0}
		};
		this.m_friendupdate=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2073:4";
				// Javascript
				return 0;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.friendupdate_m=new this.m_friendupdate(aoz,this,{});
	};
	this.c_physics=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="physics";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.noDefaults=true;
		this.defaults={
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2421:4";
			return{type:0}
			return{type:0}
		};
		this.m_friendupdate=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2424:4";
				// Javascript
				return 0;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.friendupdate_m=new this.m_friendupdate(aoz,this,{});
	};
	this.c_tdobject=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="tdobject";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.noDefaults=true;
		this.defaults={
			X_f:0,
			Y_f:0,
			Z_f:0,
			AngleX_f:0,
			AngleY_f:0,
			AngleZ_f:0,
			ScaleX_f:1,
			ScaleY_f:1,
			ScaleZ_f:1,
			Scale_f:1,
			Visible:this.aoz.platformTrue,
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2626:4";
			// Javascript
			for ( var p in this.defaults )
			{
				if ( typeof vars[ p ] == 'undefined' )
					vars[ p ] = this.defaults[ p ];
			}
			this.updateList = 
			{
				X_f: function(args,v){args.position.x=v;},
				Y_f: function(args,v){args.position.y=v;},
				Z_f: function(args,v){args.position.z=v;},
				Position_c: function(args,v)
				{
					if (v.className!='vector')
						throw { error:'illegal_function_call', parameter: v.className };
					args.position.x=v.vars.X_f,
					args.position.y=v.vars.Y_f,
					args.position.z=v.vars.Z_f
				},
				Width_f: function(args,v){args.dimensions.x=v;},
				Height_f: function(args,v){args.dimensions.y=v;},
				Depth_f: function(args,v){args.dimensions.z=v;},
				AngleX_f: function(args,v){args.rotation.x=this.aoz.getAngle(v);},
				AngleY_f: function(args,v){args.rotation.y=this.aoz.getAngle(v);},
				AngleZ_f: function(args,v){args.rotation.z=this.aoz.getAngle(v);},
				Scale_f: function(args,v){args.scale={x:v,y:v,z:v};},
				ScaleX_f: function(args,v){args.scale.x=v;},
				ScaleY_f: function(args,v){args.scale.y=v;},
				ScaleZ_f: function(args,v){args.scale.z=v;},
				Movement: function(args,v)
				{
					if ( this.vars.Movement )
					{
						aoz.destroyFriend( this, this.vars.Movement );
					}
					this.vars.Movement = v;
					this.friends.push( v );
				},
				Physics: function(args,v)
				{
					if ( this.vars.Physics )
					{
						aoz.destroyFriend( this, this.vars.Physics );
					}
					this.vars.Physics = v;
					this.friends.push(v);
				},
				Joint: function(args,v)
				{
					if ( this.vars.Joint )
					{
						aoz.destroyFriend( this, this.vars.Joint );
					}
					this.vars.Joint = v;
					this.friends.push(v);
				}
			};
			this.updateArgs = 
			{
				position: {},
				rotation: {},
				dimensions: {},
				scale: {}
			};
			// End Javascript
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
			return{type:0}
		};
		this.m_attach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2698:4";
				// Javascript
				var aObject = aoz.getObject( vars.ToObject$ );
				if ( aObject.object3D.getObjectById( this.object3D.id ) )
					throw { error: 'object_already_children', parameter: aObject.object3D.name };
				aObject.object3D.attach( this.object3D );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_detach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2706:4";
				// Javascript
				if ( !this.object3D.parent )
					throw { error: 'object_no_parent', parameter: this.object3D.name };
				this.object3D.parent( this.object3D );		
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_position=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2713:4";
				// Javascript
				var aObject = aoz.getObject( vars.At );
				this.object3D.position.copy( aObject.object3D.position );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_rotation=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2719:4";
				// Javascript
				var aObject = aoz.getObject( vars.index );
				this.object3D.quaternion.copy( aObject.object3D.quaternion );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_lookat=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2725:4";
				// Javascript
				if ( vars.At$ )
				{
					var aObject = aoz.getObject( vars.At$ );
					this.object3D.lookAt( aObject.object3D.position );
				}
				else
				{
					this.object3D.lookAt( vars.X_f, vars.Y_f, vars.Z_f );
				}
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_update=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2739:4";
				// Javascript
				if ( !this.object3D )
					return 1;
				if ( this.varsModified )
				{
					if ( !this.args )
					{
						this.args = {};
						for ( var i in this.updateArgs )
							this.args[ i ] = this.updateArgs[ i ];
					}
					this.modified = false;
					for ( var variable in this.varsModified )
					{
						this.updateList[ variable ].call( this, this.args, this.varsModified[ variable ] );
						this.vars[ variable ] = this.varsModified[ variable ];
						this.modified = true;
					}
					this.varsModifiedFriends = this.varsModified;
					this.varsModified = null;			
				}
				if ( this.friends.length )
					this.aoz.updateFriends( this, this.friends, this.deltaTime );
				this.argsModified = this.args;
				this.args = null;
				return 1;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.attach_m=new this.m_attach(aoz,this,{});
		this.detach_m=new this.m_detach(aoz,this,{});
		this.set_position_m=new this.m_set_position(aoz,this,{});
		this.set_rotation_m=new this.m_set_rotation(aoz,this,{});
		this.lookat_m=new this.m_lookat(aoz,this,{});
		this.update_m=new this.m_update(aoz,this,{});
	};
	this.c_mesh=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="mesh";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=["TDObject"];
		this.noDefaults=true;
		this.defaults={
			Color:0xFFFFFF,
			RepeatX:1,
			RepeatY:1,
			CollisionGroup:1,
			CollisionMask:0xFFFFFFFF,
			CastShadow:false,
			ReceiveShadow:false,
			X_f:0,
			Y_f:0,
			Z_f:0,
			AngleX_f:0,
			AngleY_f:0,
			AngleZ_f:0,
			ScaleX_f:1,
			ScaleY_f:1,
			ScaleZ_f:1,
			Scale_f:1,
			Visible:this.aoz.platformTrue,
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2778:4";
			// Javascript
			this.updateList.Image = function(args,v){args.image=v;};
			this.updateList.Texture = function(args,v){args.texture=v;};
			this.updateList.Material = function(args,v){args.material=v;};
			this.updateList.Visible = function(args,v){args.visible=v;};
			this.updateList.Color =  function(args,v){args.color=v;};
			this.updateList.RepeatX = function(args,v){args.repeatX=v;};
			this.updateList.RepeatY = function(args,v){args.repeatY=v;};
			this.updateList.CastShadow = function(args,v){args.castShadows=v;};
			this.updateList.ReceiveShadow = function(args,v){args.receiveShadows=v;};
			var self = this;
			if ( this.className == 'mesh' )
			{
				var result = aoz.currentScreen.screen3D.currentScene.mesh( this.name,
				{
					parent: vars.Parent,
					position: { x: vars.X_f, y: vars.Y_f, z: vars.Z_f },
					rotation: { x: aoz.getAngle(vars.AngleX_f), y: aoz.getAngle(vars.AngleY_f), z: aoz.getAngle(vars.AngleZ_f) },
					scale: typeof vars.Scale_f != 'undefined' ? { x: vars.Scale_f, y: vars.Scale_f, z: vars.Scale_f } : { x: vars.ScaleX_f, y: vars.ScaleY_f, z: vars.ScaleZ_f },
					image: vars.Image,
					texture: vars.Texture, 
					material: vars.Material,
					visible: vars.Visible,
					color: vars.Color, 
					repeatX: vars.RepeatX,
					repeatY: vars.RepeatY,
					collisionGroup: vars.CollisionGroup, 
					collisionMask: vars.CollisionMask,
					castShadow: vars.CastShadow,
					receiveShadow: vars.ReceiveShadow,
				}, function( response, data, extra )
				{
					if ( response )
					{
						self.mesh = data;
						self.object3D = data;
					}
				} );
				return result == false;
			}
			return false;
			// End Javascript
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
			return{type:0}
		};
		this.m_update=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2826:4";
				// Javascript
				this.childOf.update_m.blocks[ 0 ].call( this, aoz, vars );
				if ( this.modified && this.argsModified )
				{
					aoz.currentScreen.screen3D.currentScene.mesh( this.name, this.argsModified );
					this.modified = false;
				}
				return 1;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_attach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2698:4";
				// Javascript
				var aObject = aoz.getObject( vars.ToObject$ );
				if ( aObject.object3D.getObjectById( this.object3D.id ) )
					throw { error: 'object_already_children', parameter: aObject.object3D.name };
				aObject.object3D.attach( this.object3D );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_detach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2706:4";
				// Javascript
				if ( !this.object3D.parent )
					throw { error: 'object_no_parent', parameter: this.object3D.name };
				this.object3D.parent( this.object3D );		
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_position=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2713:4";
				// Javascript
				var aObject = aoz.getObject( vars.At );
				this.object3D.position.copy( aObject.object3D.position );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_rotation=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2719:4";
				// Javascript
				var aObject = aoz.getObject( vars.index );
				this.object3D.quaternion.copy( aObject.object3D.quaternion );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_lookat=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2725:4";
				// Javascript
				if ( vars.At$ )
				{
					var aObject = aoz.getObject( vars.At$ );
					this.object3D.lookAt( aObject.object3D.position );
				}
				else
				{
					this.object3D.lookAt( vars.X_f, vars.Y_f, vars.Z_f );
				}
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.update_m=new this.m_update(aoz,this,{});
		this.attach_m=new this.m_attach(aoz,this,{});
		this.detach_m=new this.m_detach(aoz,this,{});
		this.set_position_m=new this.m_set_position(aoz,this,{});
		this.set_rotation_m=new this.m_set_rotation(aoz,this,{});
		this.lookat_m=new this.m_lookat(aoz,this,{});
	};
	this.aoz.run(this,0,null);
};
