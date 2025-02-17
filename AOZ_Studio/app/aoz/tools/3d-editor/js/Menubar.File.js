import * as THREE from 'three';

import { zipSync, strToU8 } from 'three/addons/libs/fflate.module.js';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

function MenubarFile( editor ) {

	const config = editor.config;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );
	this.editor = editor;
	var self = this;
	
	// New

	let option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	option.onClick( function () {
		self.editor.common.newScene();
	} );
	options.add( option );

	options.add( new UIHorizontalRule() );
	// Load 3D Scene
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/load' ) );
	option.onClick( function () {
		self.editor.common.loadScene();
	} );
	options.add( option );

	// Save 3D Scene
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	option.onClick( function () {
		self.editor.common.saveScene();
	} );
	options.add( option );

	options.add( new UIHorizontalRule() );

	// Import
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	option.onClick( function () {
		self.editor.common.importFiles();
	} );
	options.add( option );
	return container;

}

export { MenubarFile };
