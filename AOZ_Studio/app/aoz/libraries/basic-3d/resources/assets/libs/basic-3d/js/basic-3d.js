var basic_3d_enable = true;

function init_3d( keep_canvas )
{
	if( application.aoz.libsRenderers == undefined )
	{
		application.aoz.libsRenderers = new Array();
	}

	application.aoz.libsRenderers.push( function()
	{
		animate_3d();
	}
	);

	if( keep_canvas == undefined )
	{
		keep_canvas = true;
	}

	if( THREE )
	{
		application.aozCanvas = document.querySelector( '#AOZCanvas' );
		document.body.removeChild( application.aozCanvas );

		application.aozCanvas.style.position = "absolute";
		application.aozCanvas.style.top = "0px";

		application.canvas3D = document.createElement( 'canvas' );
		application.canvas3D.width = application.aoz.manifest.display.width;
		application.canvas3D.height = application.aoz.manifest.display.height;
		application.canvas3D.setAttribute( 'style', 'position: absolute; width: ' + window.innerWidth + 'px; height: ' + window.innerHeight + 'px; left: 0px; top: 0px; ' );

		application.scene = new THREE.Scene();
		application.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
		application.camera.position.z = 5;

		application.object3D =
		{
			camera: application.camera,
			scene: application.scene
		};

		application.scene.add( application.camera );
		application.renderer = new THREE.WebGLRenderer( { canvas: application.canvas3D, antialias: application.aoz.manifest.display.smoothing } );
		application.renderer.setSize( window.innerWidth, window.innerHeight );

		if( keep_canvas )
		{
			application.aoz.renderer.setBackgroundColor( undefined );
			document.body.appendChild( application.renderer.domElement );
			document.body.appendChild( application.aozCanvas );
		}

		window.addEventListener( 'resize', function( event )
		{
			event.preventDefault();
			application.camera.aspect = window.innerWidth / window.innerHeight;
    		application.camera.updateProjectionMatrix();
			application.renderer.setSize( window.innerWidth, window.innerHeight );
		}, false );

		application.aoz.currentScreen.setTransparent( [ 0 ], true );
		application.aoz.renderer.background = 'transparent';

		//animate_3d();
	}
	else
	{
		throw "3D engine not found.";
	}
}

function stop_3d()
{
	if( basic_3d_enable )
	{
		basic_3d_enable = false;
		application.renderer.domElement.style.display = 'none';
	}
}

function restart_3d()
{
	if( !basic_3d_enable )
	{
		application.renderer.domElement.style.display = 'block';
		basic_3d_enable = true;
	}
}


function set_background_3d( image )
{
	if( THREE )
	{
		if( application.scene )
		{
			application.scene.background = new THREE.TextureLoader().load( image );
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function animate_3d()
{
	if( basic_3d_enable )
	{
		application.renderer.render( application.scene, application.camera );
		//requestAnimationFrame( animate_3d );
	}
}

function loadTexture( image )
{
	return new THREE.TextureLoader().load( image );
}

function get3DObject( name )
{
	switch( name.toLowerCase() )
	{
		case 'camera':
			return application.camera;
			break;

		case 'scene':
				return application.scene;
				break;
		default:
			return application.object3D[ name ];
			break;
	}
}

function copy_3d( objSrc, objTarget )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( objSrc );
				if( obj )
				{
					var target = obj.clone( true );
					target.name = objTarget;
					application.object3D[ objTarget ] = target;
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function group_3d( name )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var group = new THREE.Group();
			group.name = name;
			application.object3D[ name ] = group;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function add_to_3d( objName, parentName )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( objName );
				if( obj )
				{
					var _parent = get3DObject( parentName );
					if( _parent )
					{
						if( _parent.isScene || _parent.isGroup )
						{
							_parent.add( obj );
						}
						else
						{
							throw "3D parent is not a 3D Scene or 3D group.";
						}
					}
					else
					{
						throw "3D parent not found.";
					}
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function object_3d_visible( name, _visible )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( objName );
				if( obj )
				{
					obj.visible = _visible;
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

/**
	Primitives
*/
function box_3d( name, texture, w, h, d )
{
	if( THREE )
	{
		if( application.scene )
		{
			var geometry = new THREE.BoxGeometry( w, h, d );
			var tex = loadTexture( texture );
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex, side: THREE.DoubleSide, transparent: true } );

			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = name;
			application.object3D[ name ] = mesh;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function sphere_3d( name, texture, radius )
{
	if( THREE )
	{
		if( application.scene )
		{
			var geometry = new THREE.SphereGeometry( radius, 32, 16 );
			var tex = loadTexture( texture );
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex, side: THREE.DoubleSide, transparent: true } );

			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = name;
			application.object3D[ name ] = mesh;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function cone_3d( name, texture, radius, height )
{
	if( THREE )
	{
		if( application.scene )
		{
			var geometry = new THREE.ConeGeometry( radius, height, 32 );
			var tex = loadTexture( texture );
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex, side: THREE.DoubleSide, transparent: true } );

			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = name;
			application.object3D[ name ] = mesh;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function plane_3d( name, texture, width, height, cols, rows )
{
	if( THREE )
	{
		if( application.scene )
		{
			var geometry = new THREE.PlaneGeometry( width, height );
			var tex = loadTexture( texture );
			tex.wrapS = THREE.RepeatWrapping;
			tex.wrapT = THREE.RepeatWrapping;
			tex.repeat.set( cols, rows );

			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex, side: THREE.DoubleSide, transparent: true } );

			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = name;
			application.object3D[ name ] = mesh;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function cylinder_3d( name, texture, radiusTop, radiusBottom, height, filled )
{
	if( THREE )
	{
		if( application.scene )
		{
			var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, 16, 1, !filled );
			var tex = loadTexture( texture );
			var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: tex, side: THREE.DoubleSide, transparent: true } );

			if( application.object3D == undefined )
			{
				application.object3D = {};
			}

			var mesh = new THREE.Mesh( geometry, material );
			mesh.name = name;
			application.object3D[ name ] = mesh;
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

/**
	MOVE, ROTATE & SCALE
*/
function move_3d( name, x, y, z, fixed )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( name );
				if( obj )
				{
					if( fixed )
					{
						obj.position.x = x;
						obj.position.y = y;
						obj.position.z = z;
					}
					else
					{
						obj.position.x += x;
						obj.position.y += y;
						obj.position.z += z;
					}
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function foreward_3d( name, speed )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( name );
				if( obj )
				{
					obj.translateZ( speed );
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function backward_3d( name, speed )
{

	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( name );
				if( obj )
				{
					obj.translateZ( -speed );
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function rotate_3d( name, x, y, z, fixed )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( name );
				if( obj )
				{
					if( fixed )
					{
						obj.rotation.x = x;
						obj.rotation.y = y;
						obj.rotation.z = z;
					}
					else
					{
						obj.rotation.x += x;
						obj.rotation.y += y;
						obj.rotation.z += z;
					}
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}

function scale_3d( name, x, y, z, fixed )
{
	if( THREE )
	{
		if( application.scene )
		{
			if( application.object3D )
			{
				var obj = get3DObject( name );
				if( obj )
				{
					if( fixed )
					{
						obj.scale.x = x;
						obj.scale.y = y;
						obj.scale.z = z;
					}
					else
					{
						obj.scale.x += x;
						obj.scale.y += y;
						obj.scale.z += z;
					}
				}
				else
				{
					throw "3D object not found.";
				}
			}
			else
			{
				throw "3D object not found.";
			}
		}
		else
		{
			throw "3D engine not initialized.";
		}
	}
	else
	{
		throw "3D engine not found.";
	}
}
