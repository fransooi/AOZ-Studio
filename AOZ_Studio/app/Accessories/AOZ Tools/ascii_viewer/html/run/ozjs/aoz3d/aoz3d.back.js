var _td_module = undefined;
var _DEFAULT_CAMERA = undefined;

function _td_init_3d( module )
{
    _td_module = module;
    _td_module.basic_3d_enable = true;
    _td_module.initialized_3d = false;
    _td_module.screens_3d_arr = {};
    _td_module.DEFAULT_CAMERA = undefined;

	if( _td_module.initialized_3d )
	{
		return;
	}

	if( THREE == undefined )
	{
		throw "3d_engine_threejs_not_found";
	}

    _DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.01, 1000 );
    _DEFAULT_CAMERA.name = 'Camera';
    _DEFAULT_CAMERA.position.set( 0, 5, 10 );
    _DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

	if( application.aoz.libsRenderers == undefined )
	{
		application.aoz.libsRenderers = new Array();
	}

	application.aozCanvas = document.querySelector( '#AOZCanvas' );
	document.body.removeChild( application.aozCanvas );

	application.aozCanvas.style.position = "absolute";
	application.aozCanvas.style.top = "0px";

    var self = _td_module;
	window.addEventListener( 'resize', function( event )
	{
		event.preventDefault();
		if( self.screens_3d_arr )
		{
			for( var v in self.screens_3d_arr )
			{
				var screen = self.screens_3d_arr[ v ];
				if( screen )
				{
					screen.resize( event );
				}
			}
		}
	}, false );

    window.addEventListener( 'keydown', function( event )
    {
        event.preventDefault();
		if( self.screens_3d_arr )
		{
			for( var v in self.screens_3d_arr )
			{
				var screen = self.screens_3d_arr[ v ];
				if( screen && screen.scene && screen.scene.aozEvents )
                {
                    if( screen.scene.aozEvents.OnKeyDown )
				    {
					    application.aoz.runProcedure( screen.scene.aozEvents.OnKeyDown, { EVENT$: 'OnKeyDown', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, KEY$: event.code, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
				    }
                }
			}
		}
    }, false );

    window.addEventListener( 'keyup', function( event )
    {
        event.preventDefault();
		if( self.screens_3d_arr )
		{
			for( var v in self.screens_3d_arr )
			{
				var screen = self.screens_3d_arr[ v ];
				if( screen && screen.scene && screen.scene.aozEvents )
                {
                    if( screen.scene.aozEvents.OnKeyDown )
				    {
					    application.aoz.runProcedure( screen.scene.aozEvents.OnKeyDown, { EVENT$: 'OnKeyUp', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, KEY$: event.code, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
				    }
                }
			}
		}
    }, false );

	_td_module.initialized_3d = true;
	_td_start_3d();        
}

function _td_screen3dOpen( screenId, scene_id, x, y, w, h, effect )
{
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	if( scene_id == undefined || scene_id == null || scene_id.trim() == '' )
	{
		throw "3d_scene_id_not_defined";
	}

	if( application.aoz.ASSET == undefined || application.aoz.ASSET.arrScenes == undefined || application.aoz.ASSET.arrScenes[ 'scene_' + scene_id ] == undefined )
	{
		throw "3d_scene_not_found";
	}

	if( x == undefined ) x = 0;
	if( y == undefined ) y = 0;
	if( w == undefined ) w = application.aoz.manifest.display.width;
	if( h == undefined ) h = application.aoz.manifest.display.height;

	var canvas3D = document.createElement( 'canvas' );
	canvas3D.setAttribute( 'id', screenId );
	canvas3D.width = w;
	canvas3D.height = h;
	canvas3D.setAttribute( 'style', 'position:absolute; left:' + x + 'px; top: ' + y + 'px;' );
	var renderer = new THREE.WebGLRenderer( { canvas: canvas3D, antialias: application.aoz.manifest.display.smoothing } );
	renderer.setSize( w, h );

	var canvas2D = undefined;
	//renderer.setBackgroundColor( undefined );
	application.aoz.screenOpen(
	{
		index: screenId,
		width: w,
		height: h,
		numberOfColors: 65000,
		pixelMode: 0,
	}, undefined );

	application.aoz.setScreen( screenId );
	application.aoz.currentScreen.setTransparent( [ 0 ], true );
	renderer.background = 'transparent';

	canvas2D = document.createElement( 'canvas' );
	canvas2D.setAttribute( 'id', 'gui_' + screenId );
	canvas2D.width = w;
	canvas2D.height = h;
	canvas2D.setAttribute( 'style', 'position:absolute; left:' + x + 'px; top: ' + y + 'px; pointer-events: none;' );

	document.body.appendChild( renderer.domElement );
	document.body.appendChild( canvas2D );

	if( application.aoz.ASSET && application.aoz.ASSET.arrScenes[ 'scene_' + scene_id ] )
	{
		var scene = application.aoz.ASSET.arrScenes[ 'scene_' + scene_id ];
		var scene2 = scene.clone( new THREE.Scene );
		scene2.name = 'scene_' + screenId;
        scene2.children = scene.children;
        scene2.aozEvents = scene.aozEvents;
		if( scene2.aozEvents )
		{
			if( scene2.aozEvents.OnUpdate )
			{
				application.aoz.libsRenderers.push( function()
				{
					if( basic_3d_enable )
					{
						application.aoz.runProcedure( scene2.aozEvents.OnUpdate, { EVENT$: 'OnUpdate', SCREEN_ID$: screenId, SCENE_ID$: scene2.name } )
					}
				} );
			}

			if( scene2.aozEvents.OnMouseDown )
			{
                renderer.domElement.addEventListener( 'mousedown', function( event )
                {
                    event.preventDefault();                    
					if( basic_3d_enable )
					{
                        var mouse = new THREE.Vector2();
                        mouse.x = ( event.clientX / this.innerWidth ) * 2 - 1;
                        mouse.y = ( event.clientY / this.innerHeight ) * 2 - 1;
                        var raycaster = new THREE.Raycaster();
                        var screen = this.screen;
                        var objMouse = undefined;
                        raycaster.setFromCamera( mouse, screen.camera );
                        var intersects = raycaster.intersectObjects( screen.scene.children );
                        if( intersects.length > 0 ) 
                        {
                            objMouse = intersects[ 0 ].object;
                        }

                        if( objMouse )
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseDown', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: objMouse.name, BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                        else
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseDown', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: "", BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                    }
                 
                }, false)
            } 

			if( scene2.aozEvents.OnMouseUp )
			{
                renderer.domElement.addEventListener( 'mouseup', function( event )
                {
                    event.preventDefault();                    
					if( basic_3d_enable )
					{
                        var mouse = new THREE.Vector2();
                        mouse.x = ( event.clientX / this.innerWidth ) * 2 - 1;
                        mouse.y = ( event.clientY / this.innerHeight ) * 2 - 1;
                        var raycaster = new THREE.Raycaster();
                        var screen = this.screen;
                        var objMouse = undefined;
                        raycaster.setFromCamera( mouse, screen.camera );
                        var intersects = raycaster.intersectObjects( screen.scene.children );
                        if( intersects.length > 0 ) 
                        {
                            objMouse = intersects[ 0 ].object;
                        }

                        if( objMouse )
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseUp', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: objMouse.name, BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                        else
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseUp', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: "", BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                    }
                 
                }, false)
            } 

			if( scene2.aozEvents.OnMouseMove )
			{
                renderer.domElement.addEventListener( 'mousemove', function( event )
                {
                    event.preventDefault();
					if( basic_3d_enable )
					{
                        var mouse = new THREE.Vector2();
                        mouse.x = ( event.clientX / this.innerWidth ) * 2 - 1;
                        mouse.y = ( event.clientY / this.innerHeight ) * 2 - 1;
                        var raycaster = new THREE.Raycaster();
                        var screen = this.screen;
                        var objMouse = undefined;
                        raycaster.setFromCamera( mouse, screen.camera );
                        var intersects = raycaster.intersectObjects( screen.scene.children );
                        if( intersects.length > 0 ) 
                        {
                            objMouse = intersects[ 0 ].object;
                        }

                        if( objMouse )
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseMove', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: objMouse.name, BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                        else
                        {
                            application.aoz.runProcedure( scene2.aozEvents.OnMouseDown, { EVENT$: 'OnMouseMove', SCREEN_ID$: screen.id, SCENE_ID$: screen.scene.name, OBJECT_ID$: "", BUTTON: event.button, CTRL_KEY: event.ctrlKey, ALT_KEY: event.altKey, SHIFT_KEY: event.shiftKey, META_KEY: event.metaKey } );
                        }
                    }
                 
                }, false)
            }                                    
		}
	}
	else
	{
		throw "3d_scene_not_found";
	}
    var effectObj = undefined;
    if( effect )
    {
        switch( effect.toLowerCase() )
        {
            case 'stereo':
                effectObj = new StereoEffect( renderer );
                effectObj.setSize( w, h );
                break;
            
            case 'anaglyph':
                effectObj = new AnaglyphEffect( renderer );
                effectObj.setSize( w, h );
                break;  

            case 'ascii':
                effectObj = new AsciiEffect( renderer, ' .:-+*=%@#', { invert: true } );
				effectObj.setSize( window.innerWidth, window.innerHeight );
				effectObj.domElement.style.color = 'white';
				effectObj.domElement.style.backgroundColor = 'black';
                break;                                
        }
    }
	var screen =
	{
		id: screenId,
		x: x,
		y: y,
		w: w,
		h: h,
		sceneId: scene2.name,
		renderer: renderer,
		gui: canvas2D,
		scene: scene2,
		camera: _DEFAULT_CAMERA.clone(),
		resize: function( event )
		{
			var pcx = ( 100 / application.aoz.manifest.display.width ) * this.x;
			var pcy = ( 100 / application.aoz.manifest.display.height ) * this.y;
			var pcw = ( 100/ application.aoz.manifest.display.width ) * this.w;
			var pch = ( 100/ application.aoz.manifest.display.height ) * this.h;
            var ratio = this.w / this.h;

			var nx = ( window.innerWidth / 100 ) * pcx;
			var ny = ( window.innerHeight / 100 ) * pcy;
			var nw = ( window.innerWidth / 100 ) * pcw;
			var nh = ( window.innerHeight / 100 ) * pch;
            nh = nw / ratio;

			this.renderer.domElement.style.left = nx + 'px';
			this.renderer.domElement.style.top = ny + 'px';
			this.renderer.domElement.style.width = nw + 'px';
			this.renderer.domElement.style.height = nh + 'px';
			if( this.camera )
			{
				this.camera.aspect = nw / nh;
    			this.camera.updateProjectionMatrix();
			}
			this.gui.style.left = nx + 'px';
			this.gui.style.top = ny + 'px';
			this.gui.style.width = nw + 'px';
			this.gui.style.height = nh + 'px';

            this.renderer.setSize( nw, nh );
            if( this.effect )
            {
                this.effect( nw, nh );
            }
			_td_update3DScreen( this.id );
		}
	};

	_td_module.screens_3d_arr[ screenId ] = screen;
	application.aoz.setScreen( screenId );
    screen.renderer.domElement.screen = screen;
    screen.resize();
}

function _td_stop_3d()
{
	if( _td_module.basic_3d_enable )
	{
		_td_module.basic_3d_enable = false;
	}
}

function _td_start_3d()
{
	if( !_td_module.basic_3d_enable )
	{
		_td_module.basic_3d_enable = true;
	}
}

function _td_update3DScreen( screenId )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}

	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( self.basic_3d_enable )
	{
		if( screen.scene == undefined )
		{
			throw "3d_screen_scene_not_defined";
		}

		if( screen.camera == undefined )
		{
			throw "3d_screen_camera_not_defined";
		}
        
        if( screen.effect )
        {
            screen.effect.render( screen.scene, screen.camera );
        }
        else
        {
		    screen.renderer.render( screen.scene, screen.camera );
        }
	}

	var screenCanvas = application.aoz.currentScreen.canvas;
	var screenGUI = document.getElementById( 'gui_' + screen.id );
	if( screenGUI )
	{
		var ctx = screenGUI.getContext( '2d' );
		ctx.drawImage( screenCanvas, 0, 0, screenCanvas.width, screenCanvas.height, 0, 0, screenGUI.width, screenGUI.height );
	}
}

function _td_set_background_3d( image )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ application.aoz.currentScreen.index ] )
	{
		screen = self.screens_3d_arr[ application.aoz.currentScreen.index ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		screen.scene.background = _td_loadTexture( image );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_loadTexture( image, repeatX, repeatY )
{
	var list = Banks.ListBanks();
	var code = undefined;
	if( repeatX == undefined )
	{
		repeatX = 1;
	}

	if( repeatY == undefined )
	{
		repeatY = 1;
	}

	if( list && list.images )
	{
		for( var i = 0; i < list.images.length; i++ )
		{
			if( list.images[ i ] && list.images[ i ].item && list.images[ i ].item.canvas && list.images[ i ].name == image )
			{
				code = application.aoz.banks.utilities.getBase64Image( list.images[ i ].item.canvas );
			}
		}
	}

	if( code )
	{
		var tex = new THREE.TextureLoader().load( code );
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.repeat.set( repeatX, repeatY );
		tex.needsUpdate = true;
	}
	else
	{
		throw "texture_image_not_found";
	}

}

function _td_copy_3d( objSrc, objTarget )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( objSrc );
		if( obj )
		{
			var target = obj.clone( true );
			target.name = objTarget;
			screen.scene.add( target );
			self.screens_3d_arr[ screenId ].scene = screen.scene;
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3b_object_not_found";
		}
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_group_3d( parentName, objName )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var group = new THREE.Group();
		group.name = objName;
        _td_add_to_3d( parentName, group );
		_td_update3DScreen( screenId );
	}
	else
	{
		throw "3D engine not initialized.";
	}
}

function _td_add_to_3d( parentName, obj )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		if( obj )
		{
			var _parent = undefined;
			if( parentName.toLowerCase() == 'scene' )
			{
				_parent = screen.scene;
			}
			else
			{
				_parent = screen.scene.getObjectByName( parentName );
			}

			if( _parent )
			{
				if( _parent.isScene || _parent.isGroup )
				{
					_parent.add( obj );
					self.screens_3d_arr[ screenId ].scene = screen.scene;
					_td_update3DScreen( screenId );
				}
				else
				{
					throw "3d_parent_must_be_a_3D_scene_or_a_3d_group";
				}
			}
			else
			{
				throw "3d_parent_not_found";
			}
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_scene_not_found";
	}

}

function _td_object_3d_visible( name, _visible )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( objName );
		if( obj )
		{
			obj.visible = _visible;
			self.screens_3d_arr[ screenId ].scene = screen.scene;
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

/**
	Primitives
*/
function _td_box_3d( objName, parentName, texture, w, h, d, color, repeatX, repeatY )
{   
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var geometry = new THREE.BoxGeometry( w, h, d );
		var tex = undefined;
		var material = undefined;
		if( color == undefined )
		{
			color = 0xFFFFFF;
		}
		if( texture )
		{
			tex = _td_loadTexture( texture, repeatX, repeatY );
		}

		var material = new THREE.MeshStandardMaterial( { color: color, map: tex, side: THREE.DoubleSide, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = objName;
		_td_add_to_3d( parentName, mesh );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_sphere_3d( objName, parentName, texture, radius, color, repeatX, repeatY )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var geometry = new THREE.SphereGeometry( radius, 32, 16 );
		var tex = undefined;
		var material = undefined;
		if( color == undefined )
		{
			color = 0xFFFFFF;
		}
		if( texture )
		{
			tex = _td_loadTexture( texture, repeatX, repeatY );
		}

		var material = new THREE.MeshStandardMaterial( { color: color, map: tex, side: THREE.DoubleSide, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = objName;
		_td_add_to_3d( parentName, mesh );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_cone_3d( objName, parentName, texture, radius, height, color, repeatX, repeatY )
{
    var self = _td_module;
	if( !_initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var geometry = new THREE.ConeGeometry( radius, height, 32 );
		var tex = undefined;
		var material = undefined;
		if( color == undefined )
		{
			color = 0xFFFFFF;
		}
		if( texture )
		{
			tex = _td_loadTexture( texture, repeatX, repeatY );
		}

		var material = new THREE.MeshStandardMaterial( { color: color, map: tex, side: THREE.DoubleSide, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = objName;
		_td_add_to_3d( parentName, mesh );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_plane_3d( objName, parentName, texture, width, height, color, repeatX, repeatY )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var geometry = new THREE.PlaneGeometry( width, height );
		var tex = undefined;
		var material = undefined;
		if( color == undefined )
		{
			color = 0xFFFFFF;
		}
		if( texture )
		{
			tex = _td_loadTexture( texture, repeatX, repeatY );
		}

		var material = new THREE.MeshStandardMaterial( { color: color, map: tex, side: THREE.DoubleSide, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = objName;
		_td_add_to_3d( parentName, mesh );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

function _td_cylinder_3d( objName, parentName, texture, radiusTop, radiusBottom, height, filled, color, repeatX, repeatY )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, 16, 1, !filled );
		var tex = undefined;
		var material = undefined;
		if( color == undefined )
		{
			color = 0xFFFFFF;
		}
		if( texture )
		{
			tex = _td_loadTexture( texture, repeatX, repeatY );
		}

		var material = new THREE.MeshStandardMaterial( { color: color, map: tex, side: THREE.DoubleSide, transparent: true } );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = objName;
		_td_add_to_3d( parentName, mesh );
	}
	else
	{
		throw "3d_scene_not_found";
	}
}

/**
	MOVE, ROTATE & SCALE
*/
function _td_move_3d( name, x, y, z )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( name );
		if( obj )
		{
			if( x!= -0.1010 ) obj.position.x = x;
			if( y!= -0.1010 ) obj.position.y = y;
			if( z!= -0.1010 ) obj.position.z = z;
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3b_object_not_found";
		}
	}
	else
	{
		throw "3d_screen_not_found";
	}
}

function _td_foreward_3d( name, speed )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( name );
		if( obj )
		{
			obj.translateZ( speed );
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_screen_not_found";
	}
}

function _td_backward_3d( name, speed )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( name );
		if( obj )
		{
			obj.translateZ( -speed );
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_screen_not_found";
	}
}

function _td_rotate_3d( name, x, y, z, fixed )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( name );
		if( obj )
		{
			if( x!= -0.1010 ) obj.rotation.x = x;
			if( y!= -0.1010 ) obj.rotation.y = y;
			if( z!= -0.1010 ) obj.rotation.z = z;
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_screen_not_found";
	}
}

function _td_scale_3d( name, x, y, z, fixed )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
		var obj = screen.scene.getObjectByName( name );
		if( obj )
		{
			if( x!= -0.1010 ) obj.scale.x = x;
			if( y!= -0.1010 ) obj.scale.y = y;
			if( z!= -0.1010 ) obj.scale.z = z;
			_td_update3DScreen( screenId );
		}
		else
		{
			throw "3d_object_not_found";
		}
	}
	else
	{
		throw "3d_screen_not_found";
	}
}

function _td_delete_3d( name, _parent )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
        var objParent = screen.scene;
        if( name.toLowerCase() != 'scene' )
        {
            objParent = screen.scene.getObjectByName( _parent );
        }

        if( objParent == undefined )
        {
            throw "3d_parent_object_not_found";
        }

        var objChild = objParent.getObjectByName( name );
        if( objChild )
        {
            objParent.remove( objChild );
        }
        else
        {
            throw "3d_object_not_found";
        }
    }   
}

function _td_set_3d_camera( camera )
{
    var self = _td_module;
	if( !self.initialized_3d )
	{
		throw "3d_engine_not_initialized";
	}
	var screenId = application.aoz.currentScreen.index;
	if( screenId == undefined || screenId == null || screenId.trim() == '' )
	{
		throw "3d_screen_id_not_defined";
	}

	var screen = undefined;
	if( self.screens_3d_arr && self.screens_3d_arr[ screenId ] )
	{
		screen = self.screens_3d_arr[ screenId ];
	}
	else
	{
		throw "3d_screen_not_found";
	}

	if( screen.scene )
	{
        var cam = screen.scene.getObjectByName( camera );
        if( cam  && ( cam.type == 'PerspectiveCamera' || cam.type == 'OrthographicCamera' ) )
        {
            screen.camera = cam;
            self.screens_3d_arr[ screenId ] = screen;            
        }
        else
        {
            throw "3d_camera_not_found";            
        }
    } 
    else
    {
        throw "3d_scene_not_found";        
    }  
}
