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
* And in the file license.pdf.                                                 *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * Canvas renderer
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */
//#need_javascript_file:"threejs/build/three.min.js"

function Renderer_three( aoz, canvasId, root, options )
{
	this.aoz = aoz;
	this.root = root;
	this.manifest = aoz.manifest;
	this.utilities = aoz.utilities;
	this.banks = aoz.banks;

	this.filters = new aoz.utilities.DrawFilters( aoz, this );
	this.scaleX = typeof this.manifest.display.scaleX != 'undefined' ? this.manifest.display.scaleX : 1;
	this.scaleY = typeof this.manifest.display.scaleY != 'undefined' ? this.manifest.display.scaleY : 1;
	this.background = typeof this.manifest.display.background != 'undefined' ? this.manifest.display.background : 'color';
	this.backgroundColor = typeof this.manifest.display.backgroundColor != 'undefined' ? this.manifest.display.backgroundColor : '#000000';
	this.redrawBars = true;
	this.xLeftDraw = 0;
	this.yTopDraw = 0;
	this.halted = false;
	if ( this.aoz.platform != 'amiga' )
	{
	this.displayWidth = this.manifest.display.width;
	this.displayHeight = this.manifest.display.height;
	}
	else
	{
		this.displayWidth = 342;
		this.displayHeight = 281 - ( this.manifest.display.tvStandard == 'pal' ? 0 : 50 );
	}
	this.setScreenDisplay();

	this.canvas = document.getElementById( canvasId );
	this.context = this.canvas.getContext( '2d' );
	this.filters = new aoz.utilities.DrawFilters( aoz, this );
	var width = this.canvas.width;
	var height = this.canvas.height;
	if ( this.manifest.display.fullScreen || this.manifest.display.fullPage )
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}
	this.width = width;
	this.height = height;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.canvas.style.display = 'none';	

	var self = this;
	function handleWindowResize() 
	{
        self.height = window.innerHeight;
        self.width = window.innerWidth;

        self.renderer.setSize( self.width, self.height );
        self.camera.aspect = self.width / self.height;
        self.camera.updateProjectionMatrix();
    }
	if( THREE )
	{
		this.displayWidth += 2;
		this.displayHeight += 2;
		this.scene = new THREE.Scene();
		this.camera = new THREE.OrthographicCamera( this.displayWidth / -2, this.displayWidth / 2, this.displayHeight / 2, this.displayHeight / -2, 0, 10000 );
		//this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
        //this.camera.position.x = this.manifest.display.width / 2;
        //this.camera.position.y = this.manifest.display.height / 2;
		this.camera.position.z = 1000;		
        this.camera.lookAt( this.scene.position );		
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.autoClear = true;
		this.renderer.localClippingEnabled = true;
		this.renderer.setClearAlpha( 1 );
		document.body.appendChild( this.renderer.domElement );
		window.addEventListener( 'resize', handleWindowResize );
		this.spriteGroup = new THREE.Group();
		this.scene.add( this.spriteGroup );
		this.spriteGroup.position.x = -this.displayWidth / 2;
		this.spriteGroup.position.y = this.displayHeight / 2;
	
		this.eulerTemp = new THREE.Euler();
	}
	else
	{
		throw "3D engine not found.";
	}
};
Renderer_three.prototype.init = function()
{
};
Renderer_three.prototype.setScreenDisplay = function()
{
	var hardTopY = 0, hardHeight = 0;
	if ( this.aoz.platform == 'amiga' )
	{
		switch( this.manifest.display.tvStandard )
		{
			case 'pal':
				hardTopY = 30;
				hardHeight = 311 - hardTopY;
				break;
			default:
			case 'ntsc':
				hardTopY = 30;
				hardHeight = 261 - hardTopY;
				break;
		}
	}
	else if ( this.platform == 'atari' )
	{

	}

	switch( this.aoz.platform )
	{
		default:
		case 'atari':
			break;
		case 'amiga':
			this.hardLeftX = 110;
			this.hardTopY = hardTopY;
			this.hardWidth = 342;
			this.hardHeight = hardHeight;
			break;

		case 'aoz':
		case 'pc':
			this.hardLeftX = 0;
			this.hardTopY = 0;
			this.hardWidth = this.widthDraw / this.scaleX;
			this.hardHeight = this.heightDraw / this.scaleY;
			break;
	}
};
Renderer_three.prototype.render = function( force, interpolation  )
{
	var self = this;
	if ( this.blackAtFirst )
		return;

	force = typeof force == 'undefined' ? false : true;
	force |= this.forceOnce;
	this.forceOnce = false;
	if ( !this.aoz.crash && !this.rendering && ( force || ( this.root.modified && this.root.viewOn ) ) )
	{
		this.aoz.rendererUpdate();
		
		var screenZ = 0;
		var self = this;
		this.aoz.screensContext.parseSorted( undefined, function( screen1, screen2 )
		{
			if ( screen1.alwaysOnTop )
			{
				alwaysOnTops = true;
				return 1;
			}
			if ( screen2.alwaysOnTop )
			{
				alwaysOnTops = true;
				return -1;
			}
			if ( screen1.vars.z < screen2.vars.z )
				return -1;
			if ( screen1.vars.z > screen2.vars.z )
				return 1;
			if ( screen1.index < screen2.index )
				return -1;
			if ( screen1.index > screen2.index )
				return 1;
			return 0;
		},
		function( screen )
		{
			screen.material.visible = screen.vars.visible;
			if ( screen.vars.visible )
			{
				screen.mesh.position.x = screen.dimension.width / 2 - screen.vars.hotspotX;
				screen.mesh.position.y = -( screen.dimension.height / 2 - screen.vars.hotspotY );
				var xScreen = screen.vars.x - self.hardLeftX - self.displayWidth / 2;
				var yScreen = -screen.vars.y + self.hardTopY + self.displayHeight / 2;
				screen.clippingPlaneX1.setComponents( 1, 0, 0, -xScreen );
				screen.clippingPlaneX2.setComponents( -1, 0, 0, xScreen + screen.vars.width );
				screen.clippingPlaneY1.setComponents( 0, -1, 0, yScreen );
				screen.clippingPlaneY2.setComponents( 0, 1, 0, -yScreen + screen.vars.height );
				screen.material.clippingPlanes = [ screen.clippingPlaneX1, screen.clippingPlaneX2, screen.clippingPlaneY1, screen.clippingPlaneY2 ];
				screen.group.position.x = xScreen - screen.vars.offsetX;
				screen.group.position.y = yScreen + screen.vars.offsetY;
				screen.group.position.z = screenZ;
				screen.group.scale.x = screen.vars.scaleX;
				screen.group.scale.y = screen.vars.scaleY;
				screen.euler.z = -screen.vars.angle;
				screen.group.rotation.copy( screen.euler );
				screen.material.opacity = screen.vars.alpha;
				if ( screen.modified )
				{
					screen.modified = 0;
				}
				screen.material.map.needsUpdate = true;

				var bobZ = 0.1;
				screen.bobsContext.parseAll( undefined, function( bob )
				{
					bob.mesh.visible = bob.vars.visible;
					if ( bob.vars.visible )
					{
						bob.mesh.material = bob.imageObject.material;
						bob.mesh.position.x = bob.vars.width / 2 - bob.imageObject.hotSpotX;
						bob.mesh.position.y = -( bob.vars.height / 2 - bob.imageObject.hotSpotY );
						bob.mesh.material.clippingPlanes = [ screen.clippingPlaneX1, screen.clippingPlaneX2, screen.clippingPlaneY1, screen.clippingPlaneY2 ];
						bob.group.position.x = bob.vars.x;
						bob.group.position.y = -bob.vars.y;
						bob.group.position.z = bobZ;
						bob.group.scale.x = bob.vars.scaleX;
						bob.group.scale.y = bob.vars.scaleY;
						bob.euler.z = -bob.vars.angle;
						bob.group.rotation.copy( bob.euler );
						bob.material.opacity = bob.vars.alpha * screen.vars.alpha;
	
						bobZ += 0.01;
					}
				} );
				screenZ += 50;
			}
		} );

		// Draw sprites
		if ( this.aoz.sprites )
		{
			var spriteZ = 900;
			this.aoz.sprites.context.parseAll( undefined, function( sprite )
			{
				sprite.mesh.visible = sprite.vars.visible;
				if ( sprite.vars.visible )
				{
					sprite.mesh.material = sprite.imageObject.material;
					sprite.mesh.position.x = sprite.vars.width / 2 - sprite.imageObject.hotSpotX;
					sprite.mesh.position.y = -( sprite.vars.height / 2 - sprite.imageObject.hotSpotY );
					sprite.group.position.x = sprite.vars.x;
					sprite.group.position.y = -sprite.vars.y;
					sprite.group.position.z = spriteZ;
					sprite.group.scale.x = sprite.vars.scaleX;
					sprite.group.scale.y = sprite.vars.scaleY;
					sprite.euler.z = -sprite.vars.angle;
					sprite.group.rotation.copy( sprite.euler );
					sprite.material.opacity = sprite.vars.alpha;

					spriteZ += 0.01;
				}
			} );
		}

		this.renderer.render( this.scene, this.camera );
	}
	// The end!
	this.root.modified = false;
	this.rendering = false;
};
Renderer_three.prototype.isFullScreen = function()
{
	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	return full_screen_element != null;
};
Renderer_three.prototype.isInFullScreenIcon = function( position)
{
	if ( this.fullScreenIconOn )
	{
		if ( position.x >= this.fullScreenIconX && position.x < this.fullScreenIconX + this.fullScreenIconWidth
		  && position.y >= this.fullScreenIconY && position.y < this.fullScreenIconY + this.fullScreenIconHeight )
		  return this.fullScreenIconOn;

		return false;
	}
};
Renderer_three.prototype.swapFullScreen = function()
{
	if ( document.fullscreenEnabled )
	{
		if ( this.fullScreenIconOn == 'full_screen' )
			this.canvas.requestFullscreen();
		else
			document.exitFullscreen();
	}
}
Renderer_three.prototype.meditate = function( error )
{
};

// Drawing filters
Renderer_three.prototype.setFilter = function( args )
{
	this.filters.setFilter( args );
};
Renderer_three.prototype.delFilter = function( args )
{
	this.filters.delFilter( args );
};
Renderer_three.prototype.getFilter = function( args )
{
	return this.filters.getFilter( args );
};
Renderer_three.prototype.getFilterString = function()
{
	return this.filters.getFilterString();
};

Renderer_three.prototype.updateForScreenOrientation = function()
{
}
Renderer_three.prototype.getCoordinatesFromEvent = function( event )
{
	var info = {};
	info.x = event.clientX - this.canvas.offsetLeft + this.hardLeftX;
	info.y = event.clientY - this.canvas.offsetTop + this.hardTopY;

	return info;
}
Renderer_three.prototype.setCursorStyle = function( style )
{
	this.canvas.style.cursor = style;
}
Renderer_three.prototype.getHardLeftX = function()
{
	return this.getHardLeftX;
}
Renderer_three.prototype.getHardTopY = function()
{
	return this.getHardTopY;
}
Renderer_three.prototype.setHalted = function( halted )
{
	this.halted = halted;
}
Renderer_three.prototype.getWidth = function()
{
	return this.width;
}
Renderer_three.prototype.setHeight = function( halted )
{
	return this.height;
}
Renderer_three.prototype.newImage = function( image, infos )
{
	image.texture = new THREE.CanvasTexture( image.canvas );
	image.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: image.texture, side: THREE.DoubleSide } );
	image.material.transparent = true;
}
Renderer_three.prototype.imageLoaded = function( image, infos )
{
	image.texture = new THREE.TextureLoader().load( infos.url );
	image.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: image.texture, side: THREE.DoubleSide } );
	image.material.transparent = true;
}
Renderer_three.prototype.addScreen = function( screen, options )
{
	screen.texture = new THREE.CanvasTexture( screen.canvas );
	screen.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: screen.texture, side: THREE.DoubleSide } );
	var geometry = new THREE.PlaneGeometry( screen.vars.width, screen.vars.height );
	screen.mesh = new THREE.Mesh( geometry, screen.material );
	screen.euler = new THREE.Euler( 0, 0, 0 );
	screen.group = new THREE.Group();
	screen.group.add( screen.mesh );
	screen.bobGroup = new THREE.Group();
	screen.mesh.add( screen.bobGroup );
	screen.material.transparent = true;
	this.scene.add( screen.group );
	screen.bobGroup.position.x = -screen.vars.width / 2;
	screen.bobGroup.position.y = screen.vars.height / 2;
	screen.clippingPlaneX1 = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );
	screen.clippingPlaneY1 = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );
	screen.clippingPlaneX2 = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );
	screen.clippingPlaneY2 = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );
}
Renderer_three.prototype.delScreen = function( screen, options )
{
	this.scene.remove( screen.group );
}
Renderer_three.prototype.addBob = function( bob, options )
{	
	var geometry = new THREE.PlaneGeometry( bob.vars.width, bob.vars.height );
	bob.material = bob.imageObject.material.clone();
	bob.mesh = new THREE.Mesh( geometry, bob.material );
	bob.euler = new THREE.Euler( 0, 0, 0 );
	bob.group = new THREE.Group();
	bob.group.add( bob.mesh );
	bob.screen.bobGroup.add( bob.group );	
}
Renderer_three.prototype.delBob = function( bob, options )
{
	bob.screen.bobGroup.remove( bob.group );
}
Renderer_three.prototype.addSprite = function( sprite, options )
{
	var geometry = new THREE.PlaneGeometry( sprite.vars.width, sprite.vars.height );
	sprite.material = sprite.imageObject.material.clone();
	sprite.mesh = new THREE.Mesh( geometry, sprite.material );
	sprite.euler = new THREE.Euler( 0, 0, 0 );
	sprite.group = new THREE.Group();
	sprite.group.add( sprite.mesh );
	this.spriteGroup.add( sprite.group );	
}
Renderer_three.prototype.delSprite = function( sprite, options )
{
	this.spriteGroup.remove( sprite.group );
}
Renderer_three.prototype.captureCrash = function()
{
}
Renderer_three.prototype.setBackgroundColor = function( color )
{
};
