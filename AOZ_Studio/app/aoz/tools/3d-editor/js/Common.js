import * as THREE from 'three';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

function Common( editor )
{
    this.editor = editor;
    var self = this;

    // Files inputs
	this.form = document.createElement( 'form' );
	this.form.style.display = 'none';
	document.body.appendChild( this.form );

	this.fileInput = document.createElement( 'input' );
	this.fileInput.multiple = true;
	this.fileInput.type = 'file';
	this.fileInput.setAttribute( 'accept', '.aoz3d,.obj,.dae,.drc,.glb,.gltf,.stl,.ply,.json' );
	this.fileInput.addEventListener( 'change', function () {
		self.editor.loader.loadFiles( self.fileInput.files );
		self.form.reset();
	} );
	this.form.appendChild( this.fileInput );

	this.fileInput2 = document.createElement( 'input' );
	this.fileInput2.multiple = false;
	this.fileInput2.type = 'file';
	this.fileInput2.setAttribute( 'accept', '.aoz3d' );
	this.fileInput2.addEventListener( 'change', function () {
		self.editor.clear( false );
		self.editor.loader.loadFiles( self.fileInput2.files );
		self.form.reset();
	} );
	this.form.appendChild( this.fileInput2 );

    this.link = document.createElement( 'a' );    
}

Common.prototype.newScene = function()
{
    if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) )
    {

        self.editor.clear();
    }
}

Common.prototype.loadScene = function()
{
    this.fileInput2.click();
}

Common.prototype.importFiles = function()
{
    this.fileInput.click();
}

Common.prototype.saveScene = function()
{
    let output = editor.scene.toJSON();
    if( output && editor.scene.aozEvents )
    {
        output.object.aozEvents = editor.scene.aozEvents;
    }

    try
    {
        output = JSON.stringify( output, null, '\t' );
        output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );
    }
    catch ( e )
    {
        output = JSON.stringify( output );
    }
    this.saveString( output, 'scene.aoz3d' );
}

Common.prototype.save = function( blob, filename ) {
    if ( this.link.href ) {

        URL.revokeObjectURL( this.link.href );
    }
    this.link.href = URL.createObjectURL( blob );
    this.link.download = filename || 'data.json';
    this.link.dispatchEvent( new MouseEvent( 'click' ) );
}

Common.prototype.saveArrayBuffer = function( buffer, filename ) 
{
    this.save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}

Common.prototype.saveString = function( text, filename )
{
    this.save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

Common.prototype.getAnimations = function( scene )
{
	const animations = [];
	scene.traverse( function( object )
    {
		animations.push( ... object.animations );
	} );

	return animations;
}

Common.prototype.addOthographicCamera = function()
{
    const aspect = this.editor.camera.aspect;
    const camera = new THREE.OrthographicCamera( - aspect, aspect );
    camera.name = 'OrthographicCamera';

    this.editor.execute( new AddObjectCommand( this.editor, camera ) );    
}

Common.prototype.addPerspectiveCamera = function()
{
    const camera = new THREE.PerspectiveCamera();
    camera.name = 'PerspectiveCamera';

    this.editor.execute( new AddObjectCommand( this.editor, camera ) );    
}

Common.prototype.addAmbientLight = function()
{
    const color = 0x222222;

    const light = new THREE.AmbientLight( color );
    light.name = 'AmbientLight';

    this.editor.execute( new AddObjectCommand( this.editor, light ) );    
}

Common.prototype.addDirectionalLight = function()
{
    const color = 0xffffff;
    const intensity = 1;

    const light = new THREE.DirectionalLight( color, intensity );
    light.name = 'DirectionalLight';
    light.target.name = 'DirectionalLight Target';

    light.position.set( 5, 10, 7.5 );

    this.editor.execute( new AddObjectCommand( this.editor, light ) );    
}

Common.prototype.addGroup = function()
{
    const mesh = new THREE.Group();
    mesh.name = 'Group';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addBox = function()
{
    const geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
    mesh.name = 'Box';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addSphere = function()
{
    const geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
    mesh.name = 'Sphere';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addPlane = function()
{
    const geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial();
    const mesh = new THREE.Mesh( geometry, material );
    mesh.name = 'Plane';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addRing = function()
{
    const geometry = new THREE.RingGeometry( 0.5, 1, 8, 1, 0, Math.PI * 2 );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
    mesh.name = 'Ring';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addSprite = function()
{
    const sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
    sprite.name = 'Sprite';

    this.editor.execute( new AddObjectCommand( this.editor, sprite ) );   
}

Common.prototype.addDodecahedron = function()
{
    const geometry = new THREE.DodecahedronGeometry( 1, 0 );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
    mesh.name = 'Dodecahedron';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );    
}

Common.prototype.addCylinder = function()
{
    const geometry = new THREE.CylinderGeometry( 1, 1, 1, 8, 1, false, 0, Math.PI * 2 );
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
    mesh.name = 'Cylinder';

    this.editor.execute( new AddObjectCommand( this.editor, mesh ) );
}

export { Common };