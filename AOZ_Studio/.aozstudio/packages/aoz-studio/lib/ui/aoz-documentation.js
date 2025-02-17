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
const PANELS = require( './panels' );

// Constructor
var AOZDocs = function( panels )
{
	this.userPath = '';
	this.fontChanged = false;
	this.userInformation = {};
	this.panels = panels;
	this.panel = this.panels.createPanel(
		{
			id: 'docs_screen',
			title: 'Documentation',
			width: 1024,
			height: 640
		}
	);
	
	this.panel.module = this;

	this.iframe = document.createElement( 'iframe' );
	this.iframe.width = this.panel.width - 2;
	this.iframe.height = this.panel.height - 32;
	this.iframe.setAttribute( 'frameborder', 0 );
	this.iframe.setAttribute( 'style', 'position: relative; width: ' + this.iframe.width + 'px; height: ' + this.iframe.height + 'px;' );
	this.panel.appendChild( this.iframe );
	
	this.panel.btnMaximize.module = this;
	this.panel.btnMaximize.addEventListener( 'click', function( event )
	{
		if( !this.module.maximized )
		{
			this.module.maximized = true;
			var width = window.innerWidth;
			var height = window.innerHeight;
			this.module.resize( width, height );
			this.style.display = 'none';
			this.module.panel.btnMinimize.style.display = 'block';
		}
	}, false );
	
	this.panel.btnMinimize.module = this;
	this.panel.btnMinimize.addEventListener( 'click', function( event )
	{
		if( this.module.maximized )
		{
			this.module.maximized = false;
			var width = ( window.innerWidth / 100) * 75;
			var height = ( ( window.innerHeight / 100) * 75 ) + 40;
			this.module.resizeTo( width, height );
			this.style.display = 'none';
			this.module.panel.btnMaximize.style.display = 'block';
		}
	}, false );	
	
};

/**
	Show the Documentation Panel
*/
AOZDocs.prototype.show = function( args )
{

	var width = ( window.innerWidth / 100) * 75;
	var height = ( ( window.innerHeight / 100) * 75 ) + 40;
	this.panel.btnMaximize.style.display = 'block';
	this.panel.btnMinimize.style.display = 'none';
	this.maximized = false;
	this.resizeTo( width, height );
	
	this.iframe.src = '../../../docs/index.html?word=test';
	this.panels.showPanel( this.panel );
}

AOZDocs.prototype.resize = function()
{
	var width = ( window.innerWidth / 100) * 75;
	var height = ( ( window.innerHeight / 100) * 75 ) + 40;
	if( this.maximized )
	{
		width = window.innerWidth;
		height = window.innerHeight;
	}

	this.resizeTo( width, height );
}

AOZDocs.prototype.resizeTo = function( width, height )
{
	this.panel.width = width;
	this.panel.height = height;
	this.panel.style.width = width + 'px';
	this.panel.style.height = height + 'px';
	
	this.iframe.width = width - 2;
	this.iframe.height = height - 32;
	this.iframe.style.width = this.iframe.width + 'px';
	this.iframe.style.height = this.iframe.height + 'px';
	
	if( !this.maximized )
	{
		var lf = ( window.innerWidth - this.panel.width ) / 2;
		var tp = ( window.innerHeight - this.panel.height ) / 2;
		
		this.panel.style.left = lf + 'px';
		this.panel.style.top = tp + 'px';
	}
	else
	{
		this.panel.style.left = '0px';
		this.panel.style.top = '0px';
	}
}

module.exports = AOZDocs;	