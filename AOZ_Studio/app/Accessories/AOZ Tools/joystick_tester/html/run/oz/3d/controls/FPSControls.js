class AOZFPSControls
{
	constructor( view )
	{
		this.view = view;
		this.camera = this.view.camera;
		this.domElement = this.view.renderer.domElement;
		this.raycaster = new THREE.Raycaster();
		this.precision = 100;
		
		this.onMouse = undefined;
		
		this.mouse = new THREE.Vector2();
		this.keys = 
		{
			UP: 'keyw',
			BOTTOM: 'keys',
			LEFT: 'keya',
			RIGHT: 'keyd',
			JUMP: 'space'
		};
		this.enableRotate = true;
		this.speedRotate = 0.05;
		this.moveSpeed = 0.05;
		
		this.keyStates = {};
		
		var self = this;
		window.addEventListener( 'keydown', function( event )
		{
			event.preventDefault();
			self.keyStates[ event.code.trim().toLowerCase() ] = true;
		}, false );

		window.addEventListener( 'keyup', function( event )
		{
			event.preventDefault();
			self.keyStates[ event.code.trim().toLowerCase() ] = false;
		}, false );
		
		this.domElement.addEventListener( 'mousedown', ( event ) => {
			self.keyStates[ 'mouse_button' ] = event.button;
		} );

		this.domElement.addEventListener( 'mouseup', ( event ) => {
			self.keyStates[ 'mouse_button' ] = false;
		} );
		
		this.domElement.addEventListener( 'mousemove', ( event ) => {
			self.mouse.x = event.clientX;
			self.mouse.y = event.clientY;
		} );
			
	}
	
	update( delta )	
	{
		if( this.view.onMouse )
		{
			this.raycaster.setFromCamera( this.mouse, this.camera );
			var intersects = this.raycaster.intersectObjects( this.view.scene.children );
			var selectedObject = undefined;
			for( var i = 0; i < intersects.length; i++ ) { 
				if( intersects[ i ].visible )
				{
					selectedObject = intersects[ i ].object;
					break;
				}					
			}
			
			if( selectedObject )
			{
				var ev = 'mousemove';
				
				if( this.keyStates[ 'mouse_button' ] )
				{
					ev = 'mousedown';
				}
				
				application.aoz.runProcedure( this.onMouse, { EVENT$: ev, BUTTON: this.keyStates[ 'mouse_button'], X: this.mouse.x, Y: this.mouse.y, VIEW: isNaN( this.view.Index ) ? -1 : this.view.Index, VIEW$: '' + this.view.Index, SCENE: isNaN( this.view.sceneIndex ) ? -1 : this.view.sceneIndex, SCENE$: '' + this.view.sceneIndex, CAMERA: isNaN( this.view.cameraIndex ) ? -1 : this.view.cameraIndex, CAMERA$: '' + this.view.cameraIndex, OBJECT: isNaN( selectedObject.index ) ? -1 : selectedObject, OBJECT$: '' + selectedObject.index, GROUP$: selectedObject.group } );
			}
		}
		
		var mx = ( this.precision / this.domElement.clientWidth ) * this.mouse.x;
		var my =  ( this.precision / this.domElement.clientHeight ) * this.mouse.y;
		if( mx < ( this.precision / 2 ) - ( this.precision / 20 ) )
		{
			this.camera.rotation.y += ( 1.0 - ( mx / this.precision ) ) * this.speedRotate;
		}

		if( mx > ( this.precision / 2 ) + ( this.precision / 20 ) )
		{
			this.camera.rotation.y += ( ( 0.25 - ( mx / this.precision ) ) ) * this.speedRotate;
		}

		if ( this.keyStates[ this.keys.UP ] )
		{
			var direction = new THREE.Vector3;
			this.camera.getWorldDirection( direction );
			this.camera.position.addScaledVector( direction, this.moveSpeed );
		}

		if ( this.keyStates[ this.keys.BOTTOM ] )
		{
			var direction = new THREE.Vector3;
			this.camera.getWorldDirection( direction );
			this.camera.position.addScaledVector( direction, -this.moveSpeed );			
		}

		if ( this.keyStates[ this.keys.LEFT ] )
		{
			this.camera.translateOnAxis( this.camera.position, this.moveSpeed );				
		}

		if ( this.keyStates[ this.keys.RIGHT ] )
		{
			this.camera.position.x += delta;			
		}
		
		if ( this.keyStates[ this.keys.JUMP ] )
		{
		}

	}
	
	applyParameters( params )
	{
		if( params.length > 0 )
		{
			for( var i = 0; i < params.length; i++ )
			{
				var p = params[ i ].split( "=" );
				
				if( p.length == 2 )
				{
					switch( p[ 0 ].trim().toLowerCase() )
					{
						case 'speedrotate':
							this.speedRotate = parseFloat( p[ 1 ].trim() );
							break;
						
						case 'keyup':
						case 'keytop':
							this.keys.UP = p[ 1 ].trim().toLowerCase();
							break;

						case 'keydown':
						case 'keybottom':
							this.keys.BOTTOM = p[ 1 ].trim().toLowerCase();
							break;
							
						case 'keyleft':
							this.keys.LEFT = p[ 1 ].trim().toLowerCase();
							break;

						case 'keyright':
							this.keys.RIGHT = p[ 1 ].trim().toLowerCase();
							break;
							
						case 'keyjump':
							this.keys.JUMP = p[ 1 ].trim().toLowerCase();
							break;
						case 'precision':
							this.precision = parseFloat( p[ 1 ].trim() );
							if( this.precision < 100 )
							{
								this.precision = 100;
							}
					}

				}
			}
		}

	}
}
