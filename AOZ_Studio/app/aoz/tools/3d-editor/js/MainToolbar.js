import * as THREE from 'three';
import { UIPanel, UIToolItem, UIRow, UIHorizontalRule } from './libs/ui.js';
import { AddObjectCommand } from './commands/AddObjectCommand.js';

function MainToolbar( editor )
{
    const strings = editor.strings;

	const container = new UIPanel();
    container.setId( 'main_toolbar' );
	container.setClass( 'main_toolbar' );
    this.editor = editor;
    var self = this;

    // File Tools
    const new_file = new UIToolItem( 'new_file', strings.getKey( 'menubar/file/new' ), function( event )
    {
        self.editor.common.newScene();
    } );
    container.add( new_file );
    
    const open_file = new UIToolItem( 'open_file', strings.getKey( 'menubar/file/load' ), function( event )
    {
        self.editor.common.loadScene();
    } );
    container.add( open_file ); 

    const save_file = new UIToolItem( 'save_file', strings.getKey( 'menubar/file/export/scene' ), function( event )
    {
        self.editor.common.saveScene();
    } );
    container.add( save_file ); 

    const import_file = new UIToolItem( 'import_file', strings.getKey( 'menubar/file/import' ), function( event )
    {
        self.editor.common.importFiles();
    } );
    container.add( import_file );   

    const sep1 = new UIToolItem( 'separator');
    container.add( sep1 );  

    // Group Tool
    const new_group = new UIToolItem( 'new_group', strings.getKey( 'menubar/add/group' ), function( event )
    {
		self.editor.common.addGroup();
    } );
    container.add( new_group );

    const sep5 = new UIToolItem( 'separator');
    container.add( sep5 );

    // Primitives Tools
    const new_box = new UIToolItem( 'new_box', strings.getKey( 'menubar/add/box' ), function( event )
    {
		self.editor.common.addBox();
    } );
    container.add( new_box );
    
    const new_sphere = new UIToolItem( 'new_sphere', strings.getKey( 'menubar/add/sphere' ), function( event )
    {
		self.editor.common.addSphere();
    } );
    container.add( new_sphere ); 

    const new_plane = new UIToolItem( 'new_plane', strings.getKey( 'menubar/add/plane' ), function( event )
    {
        self.editor.common.addPlane();
    } );
    container.add( new_plane ); 

    const new_cylinder = new UIToolItem( 'new_cylinder', strings.getKey( 'menubar/add/cylinder' ), function( event )
    {
        self.editor.common.addCylinder();
    } );
    container.add( new_cylinder );   
    
    const new_sprite = new UIToolItem( 'new_sprite', strings.getKey( 'menubar/add/sprite' ), function( event )
    {
        self.editor.common.addSprite();
    } );
    container.add( new_sprite ); 
    
    const new_ring = new UIToolItem( 'new_ring', strings.getKey( 'menubar/add/ring' ), function( event )
    {
        self.editor.common.addRing();
    } );
    container.add( new_ring ); 
    
    const new_dodecahedron = new UIToolItem( 'new_dodecahedron', strings.getKey( 'menubar/add/dodecahedron' ), function( event )
    {
        self.editor.common.addDodecahedron();
    } );
    container.add( new_dodecahedron ); 

    const sep2 = new UIToolItem( 'separator');
    container.add( sep2 );
 
    // Lights Tools
    const new_ambient_light = new UIToolItem( 'new_ambient_light', strings.getKey( 'menubar/add/ambientlight' ), function( event )
    {
        self.editor.common.addAmbientLight();
    } );
    container.add( new_ambient_light ); 
    
    const new_direct_light = new UIToolItem( 'new_direct_light', strings.getKey( 'menubar/add/directionallight' ), function( event )
    {
        self.editor.common.addDirectionalLight();
    } );
    container.add( new_direct_light ); 

    const sep3 = new UIToolItem( 'separator');
    container.add( sep3 );    

    // Cameras Tools
    const new_persp_camera = new UIToolItem( 'new_persp_camera', strings.getKey( 'menubar/add/perspectivecamera' ), function( event )
    {
		self.editor.common.addPerspectiveCamera();
    } );
    container.add( new_persp_camera ); 
    
    const new_ortho_camera = new UIToolItem( 'new_ortho_camera', strings.getKey( 'menubar/add/orthographiccamera' ), function( event )
    {
		self.editor.common.addOrthographicCamera();
    } );
    container.add( new_ortho_camera ); 

    const sep4 = new UIToolItem( 'separator');
    container.add( sep4 );  

    return container;    
}
export { MainToolbar };