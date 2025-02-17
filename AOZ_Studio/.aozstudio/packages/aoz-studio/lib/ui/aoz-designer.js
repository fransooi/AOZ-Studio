const AOZConfig = require( './../aoz-config' );
const PATH = require( 'path' );

var AOZDesigner = function( panels )
{

	this.title = '';
	this.maximized = false;
	this.panels = panels;
	this.resizable = true;
	var self = this;

	this.panel = this.panels.createPanel(
		{
			id: 'aozdesigner_panel',
			title: 'AOZ Designer',
			onClose: function( event )
			{
				return window.atom.aozDesigner.client.onClose();
			},
			width: ( window.innerWidth / 100 ) * 85,
			height: ( ( window.innerHeight / 100 ) * 85 ) + 40
		}
	);
	this.panel.module = this;

	this.iframe = document.createElement( 'iframe' );
	this.iframe.width = this.panel.width - 2;
	this.iframe.height = this.panel.height - 40;
	this.iframe.setAttribute( 'frameborder', 0 );
	this.iframe.setAttribute( 'style', 'position: relative; width: ' + this.iframe.width + 'px; height: ' + this.iframe.height + 'px;' );

	this.iframe.module = this;
	this.panel.appendChild( this.iframe );

};

AOZDesigner.prototype.show = function(  )
{
	var self = this;
	var dirSep = PATH.sep;
	var path = PATH.resolve( AOZConfig.installInformation.aozPath + dirSep + 'tools' + dirSep + 'designer' + dirSep + 'html' + dirSep + 'index.html' );

	setTimeout( function() { self.iframe.src = path }, 100 );

	this.panels.showPanel( this.panel );
	self.resize();
}

AOZDesigner.prototype.close = function(  )
{
	this.panels.destroyPanel( this.panel );
}

AOZDesigner.prototype.resize = function()
{
	var width = ( window.innerWidth / 100) * 85;
	var height = ( ( window.innerHeight / 100) * 85 ) + 40;
	var ratio = width / height;
	this.resizable = true;

	if( this.maximized )
	{
		width = window.innerWidth;
		height = window.innerHeight;
		this.resizable = false;
	}

	this.resizeTo( width, height );

}

AOZDesigner.prototype.resizeTo = function( width, height )
{

	this.panel.width = width;
	this.panel.height = height;
	this.panel.style.width = width + 'px';
	this.panel.style.height = height + 'px';

	this.iframe.width = width - 2;
	this.iframe.height = height - 40;
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

module.exports = AOZDesigner;
