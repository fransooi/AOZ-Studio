const PANELS = require( './panels' );

// Constructor
var AOZDialog = function( panels )
{
	this.panels = panels;
	this.callback = undefined;
	this.keepMask = false;
	this.panel = this.panels.createPanel(
		{
			id: 'dialog_panel',
			title: '',
			width: 500,
			height: 300
		}
	);
	var self = this;
	setTimeout( function()
	{
		self.panel.width = self.panel.style.width;
		self.panel.height = self.panel.style.height;		
		self.panel.classList.add( 'aoz-dialog' );
	}, 1000 );

	var image_error = document.createElement( 'img' );
	image_error.setAttribute( 'class', 'error_image' );
	image_error.setAttribute( 'style', 'display: none' );
	image_error.setAttribute( 'src', atom.IMAGES.IMAGE_ERROR );
	this.panel.appendChild( image_error );
	this.panel.image_error = image_error;
	
	var image_askConfirm = document.createElement( 'img' );
	image_askConfirm.setAttribute( 'class', 'askconfirm_image' );	
	image_askConfirm.setAttribute( 'style', 'display: none' );
	image_askConfirm.setAttribute( 'src', atom.IMAGES.IMAGE_ASKCONFIRM );
	this.panel.appendChild( image_askConfirm );
	this.panel.image_askConfirm = image_askConfirm;
	
	var image_alert = document.createElement( 'img' );
	image_alert.setAttribute( 'class', 'alert_image' );
	image_alert.setAttribute( 'style', 'display: none' );
	image_alert.setAttribute( 'src', atom.IMAGES.IMAGE_ALERT );
	this.panel.appendChild( image_alert );
	this.panel.image_alert = image_alert;

	var image_info = document.createElement( 'img' );
	image_info.setAttribute( 'class', 'alert_image' );
	image_info.setAttribute( 'style', 'display: none' );
	image_info.setAttribute( 'src', atom.ICONS.ICON_INFO );
	this.panel.appendChild( image_info );
	this.panel.image_info = image_info;
	
	var icon = document.createElement( 'img' );
	icon.setAttribute( 'class', 'icon' );	
	icon.setAttribute( 'style', 'display: none' );
	this.panel.appendChild( icon );
	this.panel.icon = icon;
	
	var btnOK = document.createElement( 'button' );
	btnOK.setAttribute( 'class', 'aoz-button right' );
	btnOK.setAttribute( 'style', 'display: none;' );	
	btnOK.innerHTML = atom.aozLang.getTerm( 'dialog:label-ok' );
	this.panel.appendChild( btnOK );
	this.panel.buttonOK = btnOK;
	this.panel.buttonOK.addEventListener( 'click', function()
	{
		if( self.callback )
		{
			self.callback( true );
			self.callback = undefined;
		}
		self.panels.destroyPanel( self.panel );
		
		if( self.keepMask != undefined && self.keepMask == true )
		{
			self.panels.mask.style.display = 'block';
		}
		self.keepMask = false;
	}, false );

	var btnCancel = document.createElement( 'button' );
	btnCancel.setAttribute( 'class', 'aoz-button left' );
	btnCancel.setAttribute( 'style', 'display: none;' );	
	btnCancel.innerHTML = atom.aozLang.getTerm( 'dialog:label-cancel' );
	this.panel.appendChild( btnCancel );
	this.panel.buttonCancel = btnCancel;
	this.panel.buttonCancel.addEventListener( 'click', function()
	{
		if( self.callback )
		{
			self.callback( false );
			self.callback = undefined;
		}
		self.panels.destroyPanel( self.panel );

		if( self.keepMask != undefined && self.keepMask == true )
		{
			self.panels.mask.style.display = 'block';
		}
		self.keepMask = false;
	}, false );

	var msg = document.createElement( 'div' );
	msg.setAttribute( 'class', 'aoz-dialog-message' );
	msg.innerHTML = '';
	this.panel.appendChild( msg );
	this.panel.module = this;
	this.panel.message = msg;
	window.addEventListener( 'resize', function( event )
	{
		self.resize();
	}, false );
};

AOZDialog.prototype.showDialog = function( message, type, icon, keepMask, callback )
{
	this.callback = callback;
	this.keepMask = keepMask;
	if( type == undefined || type == '' )
	{
		type = 'info';
	}
	
	if( type != 'alert' && type != 'confirm' && type != 'aozStoreCopy' && type != 'info' )
	{
		type = 'info';
	}

	this.panel.image_alert.style.display = 'none';
	this.panel.image_askConfirm.style.display = 'none';
	this.panel.image_error.style.display = 'none';
	this.panel.icon.style.display = 'none';
	this.panel.buttonOK.setAttribute( 'class', 'aoz-button right' );
	this.panel.classList.remove( 'error' );	
	
	switch( type )
	{
		case 'alert':
			this.panel.buttonCancel.style.display = 'none';
			this.panel.buttonOK.setAttribute( 'class', 'aoz-button center' );
			this.panel.buttonOK.style.display = 'block';
			this.panel.image_alert.style.display = 'block';
			break;

		case 'info':
			this.panel.buttonCancel.style.display = 'none';
			this.panel.buttonOK.setAttribute( 'class', 'aoz-button center' );
			this.panel.buttonOK.style.display = 'block';
			this.panel.image_info.style.display = 'block';
			break;
			
		case 'confirm':
		case 'aozStoreCopy':
			this.panel.buttonCancel.style.display = 'block';
			this.panel.buttonOK.setAttribute( 'class', 'aoz-button right' );
			this.panel.buttonOK.style.display = 'block';
			this.panel.image_askConfirm.style.display = 'block';
			break;
	};
	
	if( icon != undefined && icon > 0 && icon < 5 )
	{
		if( icon == 1 )
		{
			this.panel.icon.setAttribute( 'src', atom.IMAGES.ICON_INFO );
		}
		
		if( icon == 2 )
		{
			this.panel.icon.setAttribute( 'src', atom.IMAGES.IMAGE_ERROR );
			this.panel.image_alert.style.display = 'none';			
			this.panel.image_askConfirm.style.display = 'none';			
			this.panel.image_error.style.display = 'block';
			this.panel.classList.add( 'error' );
		}		

		if( icon == 3 )
		{
			this.panel.icon.setAttribute( 'src', atom.IMAGES.IMAGE_ASKCONFIRM );
		}
		
		if( icon == 4 )
		{
			this.panel.icon.setAttribute( 'src', atom.IMAGES.IMAGE_CHEST_OPEN );
		}
		
		this.panel.image_alert.style.display = 'none';
		this.panel.image_askConfirm.style.display = 'none';
		this.panel.image_error.style.display = 'none';
	
		this.panel.icon.style.display = 'block';
		this.panel.message.setAttribute( 'class', 'aoz-dialog-message with-icon' );
		
		if( icon == 4 )
		{
			this.panel.message.setAttribute( 'class', 'aoz-dialog-message aoz-store-copy' );
		}
	}
	else
	{
		this.panel.icon.style.display = 'none';
		this.panel.message.setAttribute( 'class', 'aoz-dialog-message without-icon' );		
	}
	
	this.panel.message.style.display = 'block';
	this.panel.message.innerHTML = '';
	if( message == undefined )
	{
		message = 'No message';
	}
	
	this.panel.message.innerHTML = message;
	this.maximized = false;
	this.resize();
	this.panels.showPanel( this.panel );
}

AOZDialog.prototype.resize = function()
{
	var lf = ( window.innerWidth - this.panel.width ) / 2;
	var tp = ( window.innerHeight - this.panel.height ) / 2;
	
	this.panel.style.left = lf + 'px';
	this.panel.style.top = tp + 'px';
}

module.exports = AOZDialog;
