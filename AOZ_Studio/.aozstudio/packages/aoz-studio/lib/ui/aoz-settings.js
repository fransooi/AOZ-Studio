/**

	Settings Panels for AOZ Studio
	Since: v0.9.9.4-Test
	
	Coded by Baptiste Bideaux
	Date: 07-28-2020

*/

const FONTLIST = require( 'font-list' );
const FS = require( 'fs' );
const HJSON = require( 'hjson' );
const REMOTE = require('electron').remote;
const PATH = require( 'path' );
const PANELS = require( './panels' );
const SettingsLicence = require( './settings/licence' );
const SettingsDisplay = require( './settings/display' );
const SettingsRelease = require( './settings/release' );
const SettingsMisc = require( './settings/misc' );

var dirSep = PATH.sep;

// Constructor
var AOZSettings = function( panels, aozConfig )
{
	this.userPath = '';
	this.fontChanged = false;
	AOZConfig = aozConfig;
	this.panels = panels;
	this.panel = this.panels.createPanel(
		{
			id: 'settings_screen',
			title: atom.aozLang.getTerm( 'aoz-studio:settings' ),
			width: 1024,
			height: 512
		}
	);
	this.panel.module = this;
	
	this.categoriesPanel = document.createElement( 'div' );
	this.categoriesPanel.setAttribute( 'id', 'categories_panel' );
	this.currentItem = 0;
	
	// List of the categories
	this.items = new Array(
		new SettingsRelease( this ),
		new SettingsLicence( this ),
		new SettingsDisplay( this ),
		new SettingsMisc( this )
	);

	for( i = 0; i < this.items.length; i++ )
	{
		if( this.items[ i ].item )
		{
			this.items[ i ].item.id = i;
			var item = this.createItem( this.items[ i ].item );
			this.categoriesPanel.appendChild( item );
		}
	}
	this.panel.appendChild( this.categoriesPanel );

	this.mainPanels = new Array();
	for( p = 0; p < this.items.length; p++ )
	{
		if( this.items[ p ].panel )
		{
			this.panel.appendChild( this.items[ p ].panel );
			this.mainPanels.push( this.items[ p ].panel );
		}
		
		if( this.items[ p ].install )
		{
			this.items[ p ].install();
		}
	}

	this.buttonsPanel = document.createElement( 'div' );
	this.buttonsPanel.setAttribute( 'class', 'buttons-panel' );
	
	var buttonOK = document.createElement( 'button' );
	buttonOK.setAttribute( 'class', 'aoz-button setting-button' );
	buttonOK.setAttribute( 'id', 'sett-btnOK' );
 	buttonOK.innerHTML = atom.aozLang.getTerm( 'dialog:label-ok' );
	buttonOK.module = this;
	buttonOK.addEventListener( 'click', function( event )
	{
		event.preventDefault();
		this.module.validation();
	}, false );
	this.buttonsPanel.appendChild( buttonOK );
	
	var buttonCancel = document.createElement( 'button' );
	buttonCancel.setAttribute( 'class', 'aoz-button setting-button' );
	buttonCancel.setAttribute( 'id', 'sett-btnCancel' );	
 	buttonCancel.innerHTML = atom.aozLang.getTerm( 'dialog:label-cancel' );;
	buttonCancel.module = this;
	buttonCancel.addEventListener( 'click', function( event )
	{

		if( atom.aozConfig.aoz_settings.releaseNotesAtStartup == true )
		{
			atom.aozConfig.aoz_settings.releaseNotesAtStartup = false;	
			atom.AOZIO.saveHJSON( atom.aozConfig.aoz_settings, atom.userConfigPath + dirSep + 'user.hjson' );
			atom.aozStudioView.new_file();
		}		
		this.module.panels.destroyPanel( this.module.panel );
	}, false );


	this.buttonsPanel.appendChild( buttonCancel );
	this.panel.appendChild( this.buttonsPanel );
};

/**
	Valid & Save the settings values
*/
AOZSettings.prototype.validation = function()
{
	var dirSep = PATH.sep;
	for( p = 0; p < this.items.length; p++ )
	{
		if( this.items[ p ].validation )
		{
			this.items[ p ].validation();
		}
	}

	if( atom.aozConfig.aoz_settings.releaseNotesAtStartup == true )
	{
		atom.aozConfig.aoz_settings.releaseNotesAtStartup = false;	
		atom.aozStudioView.new_file();
	}		
	atom.AOZIO.saveHJSON( atom.aozConfig.aoz_settings, atom.userConfigPath + dirSep + 'user.hjson' );	
	this.panels.destroyPanel( this.panel );
}

/**
	Create and return an DOM element for the Categories panel
*/
AOZSettings.prototype.createItem = function( item )
{
	var itemElem = document.createElement( 'div' );
	itemElem.setAttribute( 'id', 'item_' + item.id );
	itemElem.setAttribute( 'class', 'cat-item' );
	itemElem.itemId = item.id;
	itemElem.module = this;
	
	var img = document.createElement( 'img' );
	img.width = 40;
	img.height = 40;
	img.src = item.icon;
	img.setAttribute( 'class', 'item-image' );
	itemElem.appendChild( img );
	
	var title = document.createElement( 'span' );
	title.setAttribute( 'id', 'item_title_' + item.id );
	title.setAttribute( 'class', 'item-title' );

	if( item.disabled == undefined || item.disabled == false )
	{
		title.classList.remove( 'selected' );
	}	
	else
	{
		title.classList.add( 'selected' );
	}
	title.innerHTML = item.title;
	itemElem.appendChild( title );

	if( item.disabled == undefined || item.disabled == false )
	{
		itemElem.addEventListener( 'click', function( event )
		{
			this.module.currentItem = this.itemId;
			this.module.categoryChange();
		}, false );
	}	
	return itemElem;
}

/**
	Change the category
*/
AOZSettings.prototype.categoryChange = function()
{
	for( i = 0; i < this.items.length; i++ )
	{
		var item = document.getElementById( 'item_' + this.items[ i ].item.id );
		if( i != this.currentItem )
		{
			item.classList.remove( 'selected' );
		}
		else
		{
			item.classList.add( 'selected' );
		}
		
		var item = document.getElementById( 'item_title_' + this.items[ i ].item.id );
		
		if( this.items[ i ].item.disabled == undefined || this.items[ i ].item.disabled == false )
		{
			item.classList.remove( 'disabled' );
		}
		else
		{
			item.classList.add( 'disabled' );
		}
		this.mainPanels[ i ].style.display = 'none';
		//item.style.display = 'none';
	}
		
	this.mainPanels[ this.currentItem ].style.display = 'block';
	if( this.items[ this.currentItem ].beforeShow )
	{
		this.items[ this.currentItem ].beforeShow();
	}
	
}
	
/**
	Show the Settings Panel
*/
AOZSettings.prototype.show = function( userPath, panel )
{
	if( panel != undefined )
	{
		this.currentItem = panel; 
	}
	this.panels.showPanel( this.panel );
	this.categoryChange();
};

AOZSettings.prototype.resize = function()
{
	var lf = ( window.innerWidth - 1024 ) / 2
	var tp = ( window.innerHeight - 640 ) / 2
	this.panel.style.left = lf + 'px';
	this.panel.style.top = tp + 'px';
}

module.exports = AOZSettings;
