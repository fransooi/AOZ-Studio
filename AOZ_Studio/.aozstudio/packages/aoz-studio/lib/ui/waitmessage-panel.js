const PANELS = require( './panels' );

// Constructor
var WaitMessagePanel = function( panels )
{
	this.panels = panels;
	this.panel = this.panels.createPanel(
		{
			id: 'waitmessage_panel',
			title: '',
			width: 400,
			height: 96
		}
	);
	this.panel.classList.add( 'wait_panel' );
	
	var elm = document.createElement( 'div' );
	elm.setAttribute( 'id', 'transpiler_message' );
	elm.setAttribute( 'style', '' );
	elm.innerHTML = '';
	this.panel.appendChild( elm );
	this.panel.module = this;
	this.panel.titleElm = elm;
	
	this.btn = document.createElement( 'button' );
	this.btn.setAttribute( 'id', 'transpiler_cancel' );
	this.btn.setAttribute( 'style', 'position: absolute; bottom: 4px; right: 4px; width: 104px; height: 28px; background-color: var(--primary-dark-bg-orange); color: #000000; text-transform: uppercase; font-size: 14px; font-weight: bold; border: none; border-radius: 6px;' )
	var self = this;

	this.btn.addEventListener( 'click', function( event )
	{
		event.preventDefault();
		atom.transpilerCancelled = true;
		atom.aozStudioView.pressEscape();
		atom.panels.destroyPanel( self.panel );
	}, false );
	
	this.btn.innerHTML = atom.aozLang.getTerm( 'core:undo' );

	this.panel.appendChild( this.btn );
	
};

WaitMessagePanel.prototype.updateProgress = function( percentage )
{
	this.panel.titleElm.innerHTML = '';
	var title = atom.aozLang.getTerm( 'waitmessage:patience' );
	this.panel.titleElm.innerHTML = title + '<br><img src="' + atom.IMAGES.WAIT_ANIM + '" class="wait_anim"></img>';	
}

WaitMessagePanel.prototype.show = function( title )
{
	this.panel.titleElm.innerHTML = '';
	if( atom.transpilerProcess != "build" )
	{
		if( this.btn )
		{
			this.btn.style.display = 'none';
		}
	}
	else
	{
		if( this.btn )
		{
			this.btn.style.display = 'block';
		}
	}
	
	if( title == undefined || title == '' )
	{
		title =  atom.aozLang.getTerm( 'waitmessage:build-run' );
	}
	
	this.panel.titleElm.innerHTML = title + '<br><img src="' + atom.IMAGES.WAIT_ANIM + '" class="wait_anim"></img>';
	this.maximized = false;
	this.resize();
	this.panels.showPanel( this.panel );
}

WaitMessagePanel.prototype.resize = function()
{
	var lf = ( window.innerWidth - this.panel.width ) / 2;
	var tp = ( window.innerHeight - this.panel.height ) / 2;
	
	this.panel.style.left = lf + 'px';
	this.panel.style.top = tp + 'px';
}

module.exports = WaitMessagePanel;
