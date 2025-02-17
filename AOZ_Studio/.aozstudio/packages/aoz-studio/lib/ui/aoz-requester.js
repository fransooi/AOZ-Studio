const PATH = require( 'path' );
const FS = require( 'fs' );
const MKDIRP = require( 'mkdirp' );
const REMOTE = require('electron').remote;
const HJSON = require( 'hjson' );

var AOZRequester = function( panels )
{
	this.title = '';
	this.maximized = false;
	this.panels = panels;
	this.resizable = false;
	var self = this;
	this.topY = 0;
	this.lastFilePath = "";
	this.lastFolderPath = "";
	this.panelCoordinates = {};
	
	this.panel = this.panels.createPanel(
		{
			id: 'aozrequester_panel',
			title: 'AOZ Requester',
			onClose: function( event )
			{
				self.onClose( event );
			},
			width: 900,
			height: 560
		}
	);
	this.panel.module = this;

	this.iframe = document.createElement( 'iframe' );
	this.iframe.width = this.panel.width - 2;
	this.iframe.height = this.panel.height - 32;
	this.iframe.setAttribute( 'frameborder', 0 );
	this.iframe.setAttribute( 'style', 'position: relative; width: ' + this.iframe.width + 'px; height: ' + this.iframe.height + 'px;' );
	
	this.iframe.module = this;
	this.panel.appendChild( this.iframe );
	this.panel.style.display = 'none';

	// Keyword help panel
	this.helpPanel = this.panels.createPanel( 
		{
		id: 'aoz_help',
			onClose: function( event )
			{
				self.onClose( event );
			},
			width: 480,
			height: 270,
	} );
	this.helpPanel.module = this;
	this.helpIframe = document.createElement( 'iframe' );
	this.helpIframe.setAttribute( 'id', 'help_iframe' );
	this.helpIframe.width = this.helpPanel.width;
	this.helpIframe.height = this.helpPanel.height;
	this.helpIframe.setAttribute( 'frameborder', 0 );
	this.helpIframe.setAttribute( 'style', 'position: relative; width: ' + this.helpIframe.width + 'px; height: ' + this.helpIframe.height + 'px;' );
	this.helpIframe.module = this;
	this.helpPanel.appendChild( this.helpIframe );

	this.helpPanel.imgClose = document.createElement( 'img')
	this.helpPanel.imgClose.src =  atom.IMAGES.ICON_CLOSE_PANEL;
	this.helpPanel.imgClose.setAttribute( 'style', 'position:absolute; left: -34px; top: 0px; cursor: pointer; border: none; width: 34px' );
	this.helpPanel.appendChild( this.helpPanel.imgClose );
	var self = this;
	this.helpPanel.imgClose.addEventListener( 'click', function( event )
	{
		self.panels.destroyPanel( self.helpPanel );		
	}, false );
	
	this.helpPanel.style.display = 'none';
	
	// AOZ Link panel
	this.aozLinkPanel = this.panels.createPanel( 
		{
		id: 'aoz_link',
			onClose: function( event )
			{
				self.onClose( event );
			},
			width: 500,
			height: 400,
	} );
	this.aozLinkPanel.module = this;

	this.aozLinkPanel.iframe = document.createElement( 'iframe' );
	this.aozLinkPanel.iframe.width = this.panel.width - 2;
	this.aozLinkPanel.iframe.height = this.panel.height - 32;
	this.aozLinkPanel.iframe.setAttribute( 'frameborder', 0 );
	this.aozLinkPanel.iframe.setAttribute( 'style', 'position: relative; width: ' + this.iframe.width + 'px; height: ' + this.iframe.height + 'px;' );
	this.aozLinkPanel.iframe.module = this;
	this.aozLinkPanel.appendChild( this.aozLinkPanel.iframe );


};

AOZRequester.prototype.showNewFileDialog = function()
{
	var dirSep = PATH.sep;
	setTimeout( this.loadURL( atom.aozConfig.installInformation.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'tools' + dirSep + 'newapp' + dirSep + 'html' + dirSep + 'index.html' ), 500 );
	
	if( this.panel.titleElement != undefined )
	{
		this.panel.titleElement.innerHTML = atom.aozLang.getTerm( 'aoz-studio:new-file' );
	}
	else
	{
		this.panel.titleElement.innerHTML = 'AOZ Requester';
	}
	
	this.panels.showPanel( this.panel );

	var self = this;

	setTimeout( function()
	{
		self.iframe.contentWindow.focus();
		self.resize();
	}, 500 )
};

AOZRequester.prototype.showAOZLinkPanel = function()
{
	var dirSep = PATH.sep;
	var self = this
	setTimeout( function()
	{
		self.aozLinkPanel.iframe.src = atom.aozConfig.installInformation.commonPath + dirSep + 'app' + dirSep + 'aoz' + dirSep + 'tools' + dirSep + 'AOZ Link' + dirSep + 'html' + dirSep + 'index.html';
	}, 500 );

	this.aozLinkPanel.setAttribute( 'style', 'box-shadow: white 0px 0px 15px;' );
	this.panels.showPanel( this.aozLinkPanel );

	var self = this;

	setTimeout( function()
	{
		self.aozLinkPanel.iframe.contentWindow.focus();
		self.aozLinkPanel.iframe.setAttribute( 'style', 'width: 500px; height: 400px' );
		self.resize();		
	}, 500 )
};

AOZRequester.prototype.showLoadFileDialog = function( cb )
{
	var dirSep = PATH.sep;
	atom.AOZIO.showOpenDialog(
		{
			title: atom.aozLang.getTerm( 'aoz-studio:load-file' ),
			filters: 
			[
				{ name: atom.aozLang.getTerm( 'file-filter:aoz' ), extensions: [ 'aoz' ] },
				{ name: atom.aozLang.getTerm( 'file-filter:aozip' ), extensions: [ 'aozip' ] },
				{ name: atom.aozLang.getTerm( 'file-filter:amos' ), extensions: [ 'amos' ] },
				{ name: atom.aozLang.getTerm( 'file-filter:image' ), extensions: [ 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'bmp' ] },
				{ name: atom.aozLang.getTerm( 'file-filter:document' ), extensions: [ 'txt', 'md', 'pdf' ] },
				{ name: atom.aozLang.getTerm( 'file-filter:others' ), extensions: [ 'js', 'json', 'css', 'html', 'htm', 'xml', 'ini', 'cson', 'cfg', 'hjson' ] }
			]
		},
		cb
	);
};

AOZRequester.prototype.showSaveFileDialog = function()
{
	var dirSep = PATH.sep;
	var editor = atom.workspace.getActiveTextEditor();
	if( editor )
	{
		atom.AOZIO.showSaveDialog(
			{
				title: atom.aozLang.getTerm( 'aoz-studio:save-as' ),
				defaultPath: editor.getPath(),
				filters: 
				[
					{ name: "AOZ Program", extensions: [ 'aoz' ] },
					{ name: "AOZ Package", extensions: [ 'aozip' ] },
					{ name: "Document file", extensions: [ 'txt', 'md', 'pdf' ] },
					{ name: "Other file", extensions: [ 'js', 'json', 'css', 'html', 'htm', 'xml', 'ini', 'cson', 'cfg', 'hjson' ] }					
				]
			},
			function( path )
			{
				path = PATH.normalize( path );
				if( path != undefined )
				{
					var ext = atom.AOZIO.getFileExtension( path );
					if( ext.toLowerCase() != 'aozip' )
					{
						editor.saveAs( path );
					}
					else
					{
						setTimeout( function()
						{
							atom.waitmessagePanel.show( atom.aozLang.getTerm( 'waitmessage:save-aozip' ) );						
						}, 500 );

						atom.AOZipUtils.savePackage( PATH.normalize( PATH.dirname( editor.getPath() ) ), function( err )
						{
							setTimeout( function()
							{
								atom.panels.destroyPanel( atom.waitmessagePanel.panel );
							}, 1500 );								
						} );
					}
				}
			}
		);
	}
};

AOZRequester.prototype.showKeywordHelp = function()
{
	var dirSep = PATH.sep;
	var path = 'file://' + atom.aozConfig.installInformation.aozPath + dirSep + 'tools' + dirSep + 'instant' + dirSep + 'html' + dirSep + 'index.html';
	this.panels.showPanel( this.helpPanel );
	this.panels.mask.style.display = 'none';
	this.helpPanel.style.zIndex = "10";
	var coordinates = this.panelCoordinates[ 'aoz_help' ];
	if ( coordinates )
	{
		this.helpPanel.style.left = coordinates.x + 'px';
		this.helpPanel.style.top = coordinates.y + 'px';
	}
	else
	{
		var parent = this.helpPanel.parentNode;
		this.helpPanel.style.left = ( parent.offsetWidth - this.helpPanel.width ) + 'px';
		this.helpPanel.style.top = ( parent.offsetHeight - this.helpPanel.height ) + 'px';
	}
	setTimeout( function() { self.helpIframe.src = path }, 100 );	

	var self = this;
	setTimeout( function()
	{
		self.helpIframe.contentWindow.focus();
		self.resize();
	}, 500 )
};

AOZRequester.prototype.onClose = function( event )
{
	this.iframe.src = "about:blank";
};

AOZRequester.prototype.closePanel = function()
{
	this.iframe.src = "about:blank";
	this.panels.destroyPanel( this.panel );	
};

AOZRequester.prototype.destroyPanel = function( panelId )
{
	var panel, iFrame;
	switch ( panelId.toLowerCase() )
	{
		case 'aoz_help':
			iFrame = this.helpIframe;
			panel = this.helpPanel;
			break;
		case 'aozrequester_panel':
			iFrame = this.iFrame;
			panel = this.panel;
			break;
	}
	if ( iFrame )
	{
		iFrame.src = "about:blank";
		this.panels.destroyPanel( panel );
	}
};
	
AOZRequester.prototype.resize = function()
{
	var elm = document.getElementById( 'aozrequester_panel' );
	var elm2 = document.getElementById( 'aoz_help' );
	if( elm || elm2 )
	{
		var self = this;
		setTimeout( function()
		{
			self.resize();
		}, 500 );
	}
};

AOZRequester.prototype.loadURL = function( url )
{
	this.iframe.src = url;
};

AOZRequester.prototype.showDirectoriesDialog = function( title, callback )
{
	var dirSep= PATH.sep;
	if( this.lastFolderPath == "" )
	{
		this.lastFolderPath = atom.aozConfig.installInformation.documentsPath + dirSep + 'My AOZ Applications';
	}
	
	var path = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), { title: title, defaultPath: this.lastFolderPath, properties: [ 'openDirectory', 'createDirectory', 'promptToCreate' ] } );
	
	if( path != null )
	{
		if( callback )
		{
			this.lastFolderPath = path[ 0 ];
			callback( path[ 0 ] );
		}
	}
	else
	{
		if( callback )
		{
			callback( "-1" );
		}
	}
};

AOZRequester.prototype.showOpenDialog = function( title, filters, callback )
{
	var dirSep= PATH.sep;
	if( this.lastFilePath == "" )
	{
		this.lastFilePath = atom.aozConfig.installInformation.documentsPath + dirSep + 'My AOZ Applications';
	}
	
	var path = REMOTE.dialog.showOpenDialogSync( REMOTE.getCurrentWindow(), { title: title, defaultPath: this.lastFilePath, properties: [ 'openFile' ], filters:  filters } );
	
	if( path != null )
	{
		if( callback )
		{
			this.lastFilePath = path[ 0 ];
			callback( path[ 0 ] );
		}
	}
	else
	{
		if( callback )
		{
			callback( "-1" );
		}
	}
};

module.exports = AOZRequester;