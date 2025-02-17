const FS = require( 'fs' );
const PATH = require( 'path' );

class AOZToolBar
{
	blinkItem = undefined;

	constructor()
	{
		var encodedPath = atom.aozConfig.installInformation.packagePath + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles';
		if( process.platform == 'win32' )
		{
			encodedPath = encodedPath.strReplace( PATH.sep, PATH.sep + PATH.sep );
		}
		
		if( process.platform == 'darwin' )
		{
			encodedPath = encodedPath;
		}
		
		if( FS.existsSync( atom.aozConfig.installInformation.packagePath + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'base.css' ) )
		{
			FS.readFile( atom.aozConfig.installInformation.packagePath + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'base.css', 'utf8', function( err, data )
			{
				
				if( data )
				{
					data = data.strReplace( "%PATH%", encodedPath );
					var style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );
					style.innerHTML = data;
					document.body.appendChild( style );
				}
					
			} );
		}

		if( FS.existsSync( atom.aozConfig.installInformation.packagePath + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'font-awesome' + PATH.sep + 'font-awesome.css' ) )
		{
			FS.readFile( atom.aozConfig.installInformation.packagePath + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'font-awesome' + PATH.sep + 'font-awesome.css', 'utf8', function( err, data )
			{
				
				if( data )
				{
					data = data.strReplace( "%PATH%", encodedPath );
					var style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );
					style.innerHTML = data;
					document.body.appendChild( style );
				}
					
			} );
		}

		if( FS.existsSync( atom.aozConfig.installInformation.packagePath  + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'iconsets.css' ) )
		{
			FS.readFile( atom.aozConfig.installInformation.packagePath  + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'styles' + PATH.sep + 'iconsets.css', 'utf8', function( err, data )
			{
				
				if( data )
				{
					data = data.strReplace( "%PATH%", encodedPath );
					var style = document.createElement( 'style' );
					style.setAttribute( 'type', 'text/css' );
					style.innerHTML = data;
					document.body.appendChild( style );
				}
					
			} );
		}

		this.element = document.createElement( 'div' );
		this.element.setAttribute( 'class', 'tool-bar-aoz tool-bar tool-bar-top tool-bar-horizontal' );
		
		var self = this;
		self.config = atom.systemAPI.loadJSON( atom.aozConfig.installInformation.packagePath  + PATH.sep + 'ui' + PATH.sep + 'tool-bar' + PATH.sep + 'config.json' );

		self.setVisible( 'aoz-studio:account', false );

		var toolpanel = document.querySelector( '.header' );
		if( toolpanel )
		{
			toolpanel.innerHTML = '';
			toolpanel.appendChild( this.element );
		}
		

	}
	
	updateItems()
	{
		var self = this;
		self.element.innerHTML = '';

		var elms = document.getElementsByClassName( 'tool-popup' );
		if( elms )
		{
			for( var i = 0; i < elms.length; i++ )
			{
				document.body.removeChild( elms[ i ] );
			}
		}	

		if( self.config )
		{
			for( var i = 0; i < self.config.length; i++ )
			{
				var item = undefined;
				if( self.config[ i ].visible == undefined )
				{
					self.config[ i ].visible = true;				
				}

				if( self.config[ i ].enable == undefined )
				{
					self.config[ i ].enable = true;				
				}

				if(  self.config[ i ].visible )
				{
					if( self.config[ i ].type != 'spacer' )
					{
						item = document.createElement( 'button' );
						if( !self.config[ i ].enable )
						{
							item.setAttribute( 'disabled', '' );
						}

						if( self.config[ i ].callback && self.config[ i ].callback != "" )
						{
							if( self.config[ i ].callbackType && self.config[ i ].callbackType == 'js' )
							{
								item.callback = self.config[ i ].callback;
								item.addEventListener( 'click', function( event )
								{
									eval( this.callback );
								}, false );
							}
							else
							{
								item.setAttribute( 'data-command', self.config[ i ].callback );
								item.addEventListener( 'click', function( event )
								{
									atom.commands.dispatch( this, this.getAttribute( 'data-command' ) );
								}, false );
							}
							self.config[ i ].DOMElement = item;						
						}
						else
						{
							item.setAttribute( 'data-command', self.config[ i ].callback );
							item.addEventListener( 'click', function( event )
							{
								var elm = document.getElementById( this.getAttribute( 'data-user') );
								if( elm )
								{
									var b = this.getBoundingClientRect();
									elm.style.display = 'block';
									elm.style.left = ( b.x || b.left ) + 'px';
									setTimeout( function()
									{
										elm.style.display = 'none';									
									}, 6000 );
								}
									
							}, false );
						}
						item.setAttribute( 'class', 'tool-bar-item ' + self.config[ i ].type + ' ' + self.config[ i ].iconset + ' ' + self.config[ i ].iconset + '-' + self.config[ i ].icon );
						item.setAttribute( 'alt', atom.aozLang.getTerm( self.config[ i ].tooltip ) );
						item.setAttribute( 'title', atom.aozLang.getTerm( self.config[ i ].tooltip ) );

						if( self.config[ i ].group && self.config[ i ].group.length > 0 )
						{
							item.setAttribute( 'data-user', 'popup_' + i );
							var popup = document.createElement( 'div' );
							popup.setAttribute( 'id', 'popup_' + i );
							popup.setAttribute( 'class', 'tool-popup' );
							var ph = 0;
							for( var ii = 0; ii < self.config[ i ].group.length; ii++ )
							{
								if( self.config[ i ].group[ ii ].visible == undefined )
								{
									self.config[ i ].group[ ii ].visible = true;				
								}
				
								if( self.config[ i ].group[ ii ].enable == undefined )
								{
									self.config[ i ].group[ ii ].enable = true;				
								}

								if( self.config[ i ].group[ ii ].visible )
								{
									var item2 = document.createElement( 'button' );
									if( !self.config[ i ].group[ ii ].enable )
									{
										item2.setAttribute( 'disabled', '' );
									}									
									item2.parentItem = item;
									var subItem = self.config[ i ].group[ ii ];
									item2.subItem = subItem;
									if( subItem.callbackType && subItem.callbackType == 'js' )
									{
										item2.addEventListener( 'click', function( event )
										{
											eval( this.subItem.callback );
										}, false );
									}
									else
									{
										item2.setAttribute( 'data-command', subItem.callback );
										item2.addEventListener( 'click', function( event )
										{
											atom.commands.dispatch( this.parentItem, this.getAttribute( 'data-command' ) );
										}, false );
									}
									item2.setAttribute( 'class', 'tool-bar-item ' + subItem.type + ' ' + subItem.iconset + ' ' + subItem.iconset + '-' + subItem.icon );
									item2.setAttribute( 'alt', atom.aozLang.getTerm( subItem.tooltip ) );
									item2.setAttribute( 'title', atom.aozLang.getTerm( subItem.tooltip ) );
									self.config[ i ].group[ ii ].DOMElement = item2;	
									popup.appendChild( item2 );
									ph++;
								}
							}
							popup.setAttribute( 'style', 'height: ' + ( ph * 48 ) + 'px' )
							document.body.appendChild( popup );
						}
					}
					else
					{
						item = document.createElement( 'hr' );
						item.setAttribute( 'class', 'aoz-tool-bar-spacer' );
					}

					self.element.appendChild( item );						
					
				}
			}
		}

		if( atom && atom.searchBar )
		{
			self.element.appendChild( atom.searchBar.input );
		}				
	}

	setVisible( command, value )
	{
		var items = this.findCommand( command );
		if( items && items.length > 0 )
		{
			for( var i = 0; i < items.length; i++ )
			{
				items[ i ].visible = value;
			}
		}
		this.updateItems();		
	}

	setEnable( command, value )
	{
		var items = this.findCommand( command );
		if( items && items.length > 0 )
		{
			for( var i = 0; i < items.length; i++ )
			{
				items[ i ].enable = value;
			}
		}
		this.updateItems();
	}

	findCommand( command )
	{
		var items = [];
		var self = this;
		if( self.config )
		{
			for( var i = 0; i < self.config.length; i++ )
			{
				var item = undefined;
				if( self.config[ i ].visible == undefined )
				{
					self.config[ i ].visible = true;				
				}

				if( self.config[ i ].enable == undefined )
				{
					self.config[ i ].enable = true;				
				}

				if( self.config[ i ].callback == command )
				{
					items.push( self.config[ i ] );
				}

				if( self.config[ i ].group && self.config[ i ].group.length > 0 )
				{
					for( var ii = 0; ii < self.config[ i ].group.length; ii++ )
					{
						if( self.config[ i ].group[ ii ].visible == undefined )
						{
							self.config[ i ].group[ ii ].visible = true;				
						}
		
						if( self.config[ i ].group[ ii ].enable == undefined )
						{
							self.config[ i ].group[ ii ].enable = true;				
						}
		
						if( self.config[ i ].group[ ii ].callback == command )
						{
							items.push( self.config[ i ].group[ ii ] );
						}
					}					
				}
			}
		}
		return items;		
	}

	closePopups()
	{
		var elms = document.getElementsByClassName( 'tool-popup' );
		if( elms )
		{
			for( var i = 0; i < elms.length; i++ )
			{
				elms[ i ].style.display = 'none';
			}
		}
	}

	blinkOn( command )
	{
		this.blinkOff();

		if( atom && atom.aozTutor && atom.aozTutor.isActive() )
		{
			var elm = this.findCommand( command );
			if( elm  && elm[ 0 ] && elm[ 0 ].DOMElement )
			{
				var cls = elm[ 0 ].DOMElement.getAttribute( 'class' );
				this.blinkItem = 
				{
					item: elm[ 0 ].DOMElement,
					cls: cls
				};

				elm[ 0 ].DOMElement.setAttribute( 'class', cls + ' blink' );
				return elm[ 0 ];
			}
		}
		return null;
	};

	blinkOff()
	{
		if( this.blinkItem && this.blinkItem.item && this.blinkItem.cls )
		{
			this.blinkItem.item.setAttribute( 'class', this.blinkItem.cls );
			this.blinkItem = undefined;
		}
	};
}
module.exports = AOZToolBar;