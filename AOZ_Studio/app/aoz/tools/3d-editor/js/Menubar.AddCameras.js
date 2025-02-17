import * as THREE from 'three';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';

function MenubarAddCameras( editor ) {

	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/add/cameras' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );
	this.editor = editor;
	var self = this;

	// OrthographicCamera

	let option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/add/orthographiccamera' ) );
	option.onClick( function () {
		self.editor.common.addOrthographicCamera();
	} );
	options.add( option );

	// PerspectiveCamera

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/add/perspectivecamera' ) );
	option.onClick( function () {
		self.editor.common.addPerspectiveCamera();
	} );
	options.add( option );

	return container;

}

export { MenubarAddCameras };
