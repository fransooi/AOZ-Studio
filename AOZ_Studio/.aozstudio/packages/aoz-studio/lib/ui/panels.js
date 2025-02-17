const { dialog } = require('electron').remote;
var self;

var Panels = function()
{
	this.panel = undefined;

	var elm = document.getElementById( 'aoz-panels-mask' );
	if( elm == undefined )
	{
		this.mask = document.createElement( 'div' );
		this.mask.setAttribute( 'id', 'aoz-panels-mask' );
		this.mask.setAttribute( 'width', '100%' );
		this.mask.setAttribute( 'height', '100%' );
		document.body.appendChild( this.mask );
	}
	else
	{
		this.mask = elm;
	}

    self = this;
	window.addEventListener( 'resize', function( event )
	{
		self.resize();
	}, false);
};

Panels.prototype.createPanel = function( options )
{
	if( options == undefined )
	{
		return false;
	}
	else
	{
		var isTitle = ( options.title && options.title.length > 0 );
		var width = options.width || 640;
		var height = options.height || 400;
		if ( isTitle )
			height += 32;
		var panel = document.createElement( 'div' );
		panel.parent = this;
		panel.width = width;
		panel.height = height;
		panel.setAttribute( 'id', options.id || 'noname_panel' );
		panel.id = options.id || 'noname_panel';
		var lf = ( window.innerWidth - panel.width ) / 2;
		var tp = ( window.innerHeight - panel.height ) / 2;
		var css = 'display: none; ';
		css += 'position: absolute;';
		css += 'width: ' + panel.width + 'px; ';
		css += 'height: ' + panel.height + 'px; ';
		css += 'left: ' + lf + 'px; ';
		css += 'top: ' + tp + 'px; ';
		panel.setAttribute( 'style', css );
		panel.setAttribute( 'class', 'aoz-panel' );

		if( options.title && options.title.length > 0 )
		{
			var title = this.createTitle( options );
			panel.titleElement = title;
			panel.appendChild( title );

			if( options.closeButton == undefined || options.closeButton )
			{
				var img = this.createImage(
					{
						image: atom.IMAGES.PANEL_ICON_CLOSE
					}
				);
				img.setAttribute( 'class', 'aoz-icon-panel aoz-icon-panel-close' );
				img.panel = panel;
				img.options = options;
				if( options.onClose )
				{
					img.addEventListener( 'click', function( event )
						{
							var elm = document.getElementById( 'dialog_panel' );
							if( elm && elm.style.display != 'none' )
							{
								return;
							}
							// Phil Bell - added ability to cancel closing the panel
							var result = this.options.onClose();
							if (result !== false) {
								this.panel.parent.destroyPanel( this.panel );
							}
						}
					);
				}
				else
				{
					img.addEventListener( 'click', function( event )
						{
							var elm = document.getElementById( 'dialog_panel' );
							if( elm && elm.style.display != 'none' )
							{
								return;
							}
							this.panel.parent.destroyPanel( this.panel );
						}
					);
				}
				panel.appendChild( img );
				panel.btnClose = img;
			}

			var img = this.createImage(
				{
					image: atom.IMAGES.PANEL_ICON_MAXIMIZE
				}
			);
			img.setAttribute( 'class', 'aoz-icon-panel aoz-icon-panel-maximize' );
			panel.btnMaximize = img;
			img.panel = panel;
			panel.appendChild( img );

			var img = this.createImage(
				{
					image: atom.IMAGES.PANEL_ICON_MINIMIZE
				}
			);
			img.setAttribute( 'class', 'aoz-icon-panel aoz-icon-panel-minimize' );
			panel.btnMinimize = img;

			img.panel = panel;
			panel.appendChild( img );

		}

		return panel;
	}
};
Panels.prototype.createHelpPanel = function( options )
{
	var panel = document.createElement( 'div' );
	panel.parent = this;
	panel.width = options.width;
	panel.height = options.height;
	panel.id = 'aoz_help';
	panel.setAttribute( 'id', panel.id );
	var lf = ( window.innerWidth - panel.width ) / 2;
	var tp = ( window.innerHeight - panel.height ) / 2;
	var css = 'position: absolute; ';
	css += 'display: none; ';
	css += 'width: ' + panel.width + 'px; ';
	css += 'height: ' + panel.height + 'px; ';
	css += 'left: ' + lf + 'px; ';
	css += 'top: ' + tp + 'px; ';
	panel.setAttribute( 'style', css );
	return panel;
}
Panels.prototype.createRow = function( options )
{
	if( options == undefined )
	{
		options = {};
	}
	var row = document.createElement( 'div' );
	row.setAttribute( 'width', '100%' );
	row.setAttribute( 'height', options.height || 40 );

	row.setAttribute( 'id', options.id || '' );
	row.setAttribute( 'class', 'aoz-panel-row' );
	return row;
}

Panels.prototype.createTitle = function( options )
{
	if( options == undefined )
	{
		return undefined;
	}

	var row = this.createRow();
	row.setAttribute( 'id', options.id + '_title' );
	row.setAttribute( 'class', 'aoz-panel-title' );
	row.innerHTML = options.title;
	return row;
};

Panels.prototype.createImage = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var img = document.createElement( 'img' );
	img.src = options.image;
	return img;
}

Panels.prototype.createInputText = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var row = this.createRow( options );

	row.label = document.createElement( 'div' );
	row.label.setAttribute( 'id', 'label_' + options.id );
	row.label.setAttribute( 'style', 'position: relative; display:inline-block; width: 20%; height: 40px; left: 0px;' );
	row.label.innerHTML = options.label;
	row.appendChild( row.label );

	row.input = document.createElement( 'input' );
	row.input.setAttribute( 'id', 'fld_' + options.id );
	row.input.setAttribute( 'name', 'fld_' + options.id );
	row.input.setAttribute( 'type', 'text' );
	row.input.setAttribute( 'value', '' );
	row.input.setAttribute( 'class', 'native-key-bindings' );
	row.input.setAttribute( 'style', 'position: relative; display:inline-block; width: 80%; height: 40px; color: #000000; padding: 8px; text-align: left' );
	row.appendChild( row.input );

	return row;
}

Panels.prototype.createRowSeparator = function()
{

	var row = this.createRow( { id: 'separator' } );
	row.setAttribute( 'style', 'height: 40px;' );
	return row;
}

Panels.prototype.createInputPassword = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var row = this.createRow( options );

	row.label = document.createElement( 'div' );
	row.label.setAttribute( 'id', 'label_' + options.id );
	row.label.setAttribute( 'style', 'position: relative; display:inline-block; width: 20%; height: 40px; left: 0px;' );
	row.label.innerHTML = options.label;
	row.appendChild( row.label );

	row.input = document.createElement( 'input' );
	row.input.setAttribute( 'id', 'fld_' + options.id );
	row.input.setAttribute( 'name', 'fld_' + options.id );
	row.input.setAttribute( 'type', 'password' );
	row.input.setAttribute( 'value', '' );
	row.input.setAttribute( 'class', 'native-key-bindings' );
	row.input.setAttribute( 'style', 'position: relative; display:inline-block; width: 80%; height: 40px; color: #000000; padding: 8px; text-align: left' );
	row.appendChild( row.input );

	return row;
}

Panels.prototype.createInputImage = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var row = this.createRow( options );

	row.label = document.createElement( 'div' );
	row.label.setAttribute( 'id', 'label_' + options.id );
	row.label.setAttribute( 'style', 'position: relative; display:inline-block; width: 20%; height: 40px; left: 0px;' );
	row.label.innerHTML = options.label;
	row.appendChild( row.label );

	row.input = document.createElement( 'input' );
	row.input.setAttribute( 'id', 'fld_' + options.id );
	row.input.setAttribute( 'name', 'fld_' + options.id );
	row.input.setAttribute( 'type', 'text' );
	row.input.setAttribute( 'value', '' );
	row.input.setAttribute( 'class', 'native-key-bindings' );
	row.input.setAttribute( 'style', 'position: relative; display:inline-block; width: 95%; height: 40px; color: #000000; padding: 8px; text-align: left' );
	row.appendChild( row.input );

	row.image = this.createImage( options );
	row.image.setAttribute( 'id', 'img_' + options.id );
	row.appendChild( row.image );

	return row;
}

Panels.prototype.createCheckbox = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var row = this.createRow( options );

	row.input = document.createElement( 'input' );
	row.input.setAttribute( 'id', 'fld_' + options.id );
	row.input.setAttribute( 'name', 'fld_' + options.id );
	row.input.setAttribute( 'type', 'checkbox' );
	row.input.setAttribute( 'style', 'position: relative; display:inline-block; width: 16px; height: 16px;' );
	row.appendChild( row.input );

	row.label = document.createElement( 'label' );
	row.label.setAttribute( 'id', 'label_' + options.id );
	row.label.setAttribute( 'for', 'fld_' + options.id );
	row.label.setAttribute( 'style', 'position: relative; display:inline-block; height: 40px; left: 8px; top: -2px;' );
	row.label.innerHTML = options.label;
	row.appendChild( row.label );

	return row;
}

Panels.prototype.createCombobox = function( options )
{
	if( options == undefined )
	{
		return false;
	}

	var row = this.createRow( options );

	row.label = document.createElement( 'div' );
	row.label.setAttribute( 'id', 'label_' + options.id );
	row.label.setAttribute( 'style', 'position: relative; display:inline-block; width: 20%; height: 40px; left: 0px;' );
	row.label.innerHTML = options.label;
	row.appendChild( row.label );

	row.input = document.createElement( 'select' );
	row.input.setAttribute( 'id', 'fld_' + options.id );
	row.input.setAttribute( 'name', 'fld_' + options.id );
	row.input.setAttribute( 'value', '' );
	row.input.setAttribute( 'style', 'position: relative; display:inline-block; width: 80%; height: 40px; color: #000000;' );
	row.appendChild( row.input );

	return row;
}

Panels.prototype.showPanel = function( panel, center )
{
	if( panel == undefined)
	{
		return
	}

	document.body.appendChild( panel );

	if( center == undefined || center )
	{
		var lf = ( window.innerWidth - panel.width ) / 2;
		var tp = ( window.innerHeight - panel.height ) / 2;
		panel.style.left = lf + 'px';
		panel.style.top = tp + 'px';
		panel.style.display = 'block';
	}

	this.mask.style.display = 'block';
	this.panel = panel;

//	console.log( 'showPanel ->' );
//	console.log( this.panel );

};

Panels.prototype.destroyPanel = function( panel )
{
	this.mask.style.display = 'none';
	if( panel == undefined)
	{
		return
	}

	var elm = document.getElementById( panel.id );
	if( elm != undefined )
	{
		document.body.removeChild( panel );
//		panel.style.display = 'none';
	}
};

Panels.prototype.resizePanel = function( panel, width, height )
{
	if( panel == undefined )
		return;
	var result = { width: panel.width, height: panel.height };
	if ( typeof width != 'undefined' )
	{
		panel.width = width;
		panel.style.width = width + 'px;';
	}
	if ( typeof height != 'undefined' )
	{
		panel.style.height = height + 'px;';
		panel.height = height;
	}
	return result;
};

Panels.prototype.setPanelPosition = function( panel, x, y )
{
	if( panel == undefined )
		return;
	if ( typeof x != 'undefined' )
		panel.style.left = x + 'px;';
	if ( typeof y != 'undefined' )
		panel.style.top = y + 'px;';
};

Panels.prototype.setPanelTitle = function( panel, title )
{
	if( panel == undefined )
		return;
	var title = this.createTitle( { id: panel.id } );
	panel.titleElement = title;
	panel.appendChild( title );
};

Panels.prototype.resize = function( event )
{
	if( this.panel == undefined )
	{
		return;
	}

	if( this.panel.module && this.panel.module.resize != undefined )
	{
		this.panel.module.resize();
	}
}

module.exports = Panels;
