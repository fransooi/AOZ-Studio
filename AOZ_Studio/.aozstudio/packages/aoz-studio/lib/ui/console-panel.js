const PATH = require( 'path' );
const PANELS = require( './panels' );

// Constructor
var ConsolePanel = function( panels )
{
	this.module = undefined;
	this.opened = true;
	this.panels = new PANELS();
	this.panel = panels.createPanel(
	{
		id: 'console_panel',
		title: 'AOZ Messages ( Ctrl+Shift+C to show/hide this panel )',
		closeButton: false,
		width: window.innerWidth,
		height: 190
	}
	);
	
	this.panel.addEventListener( 'click', function( event )
	{
		this.style.zIndex = 200;
		
		var elm = document.getElementById( 'aozviewer_panel' );
		if( elm )
		{
			elm.module.maskFocus.style.display = 'block';
			elm.style.zIndex = 100;
		}

	}, false );
	
	this.panel.module = this;
	this.panel.setAttribute( 'style', '' );
	this.panel.setAttribute( 'class', 'aoz-console-panel');
	
	this.message = document.createElement( 'div' );
	this.message.setAttribute( 'id', 'console_message' );
	this.message.classList.add( 'message' );
	
	this.message.setAttribute( 'class', 'aoz-message-console');
	this.message.classList.add( 'vertical-scrollbar' );
	this.message.module = this;
	this.message.addEventListener( 'click', function( event )
	{
		this.module.panel.style.zIndex = 200;
		
		var elm = document.getElementById( 'aozviewer_panel' );
		if( elm )
		{
			elm.module.maskFocus.style.display = 'block';
			elm.style.zIndex = 100;
		}

	}, false );
	
	this.message.addEventListener( 'DOMNodeInserted', function( event )
	{
		this.scrollTop = this.scrollHeight;
	}, false );	
	
	var img1 = this.panels.createImage(
		{
			image: atom.IMAGES.PANEL_ICON_CLOSE
		}
	);
	img1.setAttribute( 'class', 'aoz-icon-panel aoz-icon-panel-close' );
	img1.module = this;
	img1.title = "Close the panel";
	img1.alt = "Close the panel";
	
	img1.addEventListener( 'click', function( event )
	{
	//	this.module.panel.style.display = 'none';
	//	this.module.opened = false;
		if( this.module.opened )
		{
			atom.aozStudioView.toggleConsole();
		}

		//atom.workspace.paneContainers.left.paneContainer.element.setAttribute( 'style', 'height: 100%' );
		//atom.workspace.paneContainers.center.paneContainer.element.childNodes[ 0 ].setAttribute( 'style', 'height: 100%' );		
	}, false );
	this.panel.appendChild( img1 );
	this.panel.appendChild( this.message );
/**
	var img2 = this.panels.createImage(
		{
			image: atom.IMAGES.PANEL_ICON_PREV_ERROR
		}
	);
	img2.setAttribute( 'class', 'aoz-icon-panel aoz-icon-prev-error' );

	img2.module = this;
	img2.title = "Previous error";
	img2.alt = "Previous error";
	
	img2.addEventListener( 'click', function( event )
	{
		atom.aozStudioView.gotoPreviousError()
	}, false );
	this.panel.appendChild( img2 );
	
	var img3 = this.panels.createImage(
		{
			image: atom.IMAGES.PANEL_ICON_NEXT_ERROR
		}
	);
	img3.setAttribute( 'class', 'aoz-icon-panel aoz-icon-next-error' );
	img3.module = this;
	img3.title = "Next error";
	img3.alt = "Next error";
	
	img3.addEventListener( 'click', function( event )
	{
		atom.aozStudioView.gotoNextError()
		
	}, false );
	this.panel.appendChild( img3 );
*/
	this.panel.appendChild( this.message );

};

ConsolePanel.prototype.resize = function( event )
{
}

ConsolePanel.prototype.show = function( module )
{
	this.module = module;
	this.panels.showPanel( this.panel, false );
	
	//atom.workspace.paneContainers.left.paneContainer.element.setAttribute( 'style', 'bottom: 190px' );
	//atom.workspace.paneContainers.center.paneContainer.element.childNodes[ 0 ].setAttribute( 'style', 'bottom: 190px' );		
}

ConsolePanel.prototype.showMessage = function( message )
{
	if( message == undefined || message.text == undefined )
	{
		return;
	}

	var color = '#AAAAAA';
	var img = atom.ICONS.INFO_STATUS_ICON;
	if( message.type == 'warning' )
	{
		color = '#FFFF00';
		img = atom.ICONS.WARN_STATUS_ICON;
	}
	
	if( message.type == 'error' )
	{
		color = '#FF0000';
		img = atom.ICONS.ERROR_STATUS_ICON;
	}
	
	var line = document.createElement( 'div' );
	line.setAttribute( 'style', 'color: ' + color + '; cursor: pointer;' );
	if( message.type != 'info' )
	{
		line.addEventListener( 'click', function( event )
		{
			event.preventDefault();
			if( message.opts && message.opts.sourcepath )
			{
				atom.workspace.open( message.opts.sourcePath + PATH.sep + message.path );
			}
			atom.aozStudioView.showLineWithMessage( message );
		}, false) ;
	}
	
	line.innerHTML = '<img src="' + img + '" style="width: 14px; height:14px; vertical-align: middle;"></img> ' + message.text;
		
	this.message.appendChild( line );
}

ConsolePanel.prototype.resize = function()
{
	return;
}

module.exports = ConsolePanel;
