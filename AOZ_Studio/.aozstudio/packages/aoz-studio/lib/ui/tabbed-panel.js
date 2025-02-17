const { remote } = require( 'electron' );
const { BrowserWindow } = require( 'electron' ).remote;
const FROMENTRIES = require( 'object.fromentries' );
const EXEC = require( 'child_process' );
const { CompositeDisposable } = require( 'atom' );
const { shell } = require('electron')
var TabbedPanel = function( options )
{
	this.url = options.url;
	var subscriptions = new CompositeDisposable();
	
	this.title = options.title;
	this.opened = false;
	this.px = window.innerWidth;
	this.anim = 0;

	this.hideIcon = options.hideIcon;
	this.icon = options.icon;

	var w = Math.round( window.innerWidth / 100 ) * 80;
	var h = Math.round( window.innerHeight / 100 ) * 70;

	this.width = 80;
	this.height = 70;
	this.top = 0;
	
	if( options.width )
	{
		this.width = options.width;
	}
	
	if( options.height )
	{
		this.height = options.height;
	}

	if( options.top )
	{
		this.top = options.top;
	}

	var self = this;

	this.win = document.createElement( 'div' );
	this.win.setAttribute( 'id', 'tab_panel_' + options.id );
	this.win.setAttribute( 'style', 'position: absolute; left: ' + ( this.px ) + 'px; top: ' + ( Math.round( ( window.innerHeight - h ) / 2 ) ) + 'px; width: ' + w + 'px; height: ' + h + 'px; display: block; background-color: #333333; border: 2px #8b9cd5 solid; z-index: 5000' );  
	
	this.win.hide = function()
	{
		this.style.display = 'none';
	}

	this.win.show = function()
	{
		this.style.display = 'block';
	}
	
	document.body.appendChild( this.win );	
	
	this.webview = document.createElement( 'webview' );
	this.webview.setAttribute( "class", "native-key-bindings" );
	this.webview.setAttribute( "style", "position: absolute; left: 0px; top: 0px; width: 100%; height: 100%;" );
	this.webview.setAttribute( "plugins", "on" );
	this.webview.setAttribute( "disablewebsecurity", "on" );
	this.webview.setAttribute( "allowfileaccessfromfiles", "on" );
	this.webview.setAttribute( "allowpointerlock", "on" );
	this.webview.setAttribute( "src", this.url );
	this.webview.addEventListener( 'new-window', async( e ) => 
		{
		  const protocol = require( 'url' ).parse( e.url ).protocol
		  if( protocol === 'http:' || protocol === 'https:' )
		  {
			await shell.openExternal( e.url );
		  }
		}
	)

	this.win.appendChild( this.webview );	
	
	this.tab = document.createElement( 'img' );
	this.tab.setAttribute( 'id', 'icon_tab_' + options.id );
	this.tab.setAttribute( 'src', this.icon );
	this.tab.setAttribute( 'style', 'position: absolute; left: -34px; top: 0px; width: 34px; height: 47px; z-index: 5000' );
	
	subscriptions.add( atom.tooltips.add( this.tab, { title: this.title } ) );
	this.tab.addEventListener( 'click', function( event )
	{
		event.preventDefault();
		self.toggleOpen()
	}, false );	
	this.win.appendChild( this.tab );
	
	var top = remote.getCurrentWindow();
	top.on( 'resize', () =>
		{
			self.updatePanel();
		}
	);

	top.on( 'move', () =>
		{
			self.updatePanel();
		}
	);

	window.addEventListener( 'resize', function( event )
	{
		self.updatePanel();
	}, false );

	this.updatePanel();
};

TabbedPanel.prototype.toggleOpen = function()
{
	if( this.opened )
	{
		this.tab.setAttribute( 'src', this.icon );
		this.opened = false;
	}
	else
	{
		this.tab.setAttribute( 'src', atom.IMAGES.ICON_CLOSE_PANEL );		
		this.opened = true;
		//this.notifIcon( this.icon );
	}
	this.anim = 1;
	this.updatePanel();	
};

TabbedPanel.prototype.updatePanel = function()
{
	if( this.tm )
	{
		clearTimeout( this.tm );
		this.tm = undefined;
	}
	
	var w = Math.round( window.innerWidth / 100 ) * this.width;
	var h = Math.round( window.innerHeight / 100 ) * this.height;

	if( !this.opened )
	{
		if( this.hideIcon )
		{
			this.tab.style.display = 'none';
		}
		else
		{
			this.tab.style.display = 'block';
		}
		
		if( this.anim == 0 )
		{	
			this.px = window.innerWidth;
			//this.win.hide();
		}
		else
		{
			this.px = this.px + 128;
			if( this.px > window.innerWidth )
			{
				this.px = window.innerWidth;
				this.anim = 0;
			}
		}
	}

	if( this.opened )
	{
		this.tab.style.display = 'block';
		if( this.anim == 0 )
		{	
			this.px = window.innerWidth - w;
		}
		else
		{
			this.win.show();
			this.px = this.px - 128;
			if( this.px < ( window.innerWidth - w ) )
			{
				this.px = window.innerWidth - w;
				this.anim = 0;
			}
		}
	}
	
	this.win.style.left = ( this.px ) + 'px'
	this.win.style.top = Math.round( ( window.innerHeight - h ) / 2 )  + 'px';
	this.win.style.width = w + 'px';
	this.win.style.height = h + 'px';
	
	var self = this;
	if( this.anim == 1 )
	{
		this.tm = setTimeout( function()
		{
			self.updatePanel();
		}, 50 );
	}
};

TabbedPanel.prototype.notifIcon = function( icon )
{
	this.tab.setAttribute( 'src', icon );
};

module.exports = TabbedPanel;
