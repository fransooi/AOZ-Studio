const PATH = require( 'path' );
const AOZIcons = require( './aoz-icons' );
const AOZIO = require( '../aoz-io' );

class Tab
{
	constructor( title, close_icon, close_handler )
	{
		if( close_icon == undefined )
		{
			close_icon = false;
		}
		
		this.closeHandler = close_handler;
		this.element = document.createElement( 'li' );
		this.element.setAttribute( 'is', 'tabs-tab' );
		this.element.setAttribute( 'class', 'tab sortable' );
		this.element.setAttribute( 'data-type', 'TreeView' );
		this.element.setAttribute( 'style', '' );
		this.closeIcon = close_icon;
		this.setTitle( title );
	};
	
	setTitle( title )
	{
		var elmTitle = document.createElement( 'div' );
		elmTitle.setAttribute( 'class', 'title' );
		elmTitle.innerHTML = title;
		this.element.appendChild( elmTitle );
		
		if( this.closeIcon )
		{
			var elmClose = document.createElement( 'div' );
			elmClose.setAttribute( 'class', 'close-icon' );
			if( this.closeHandler )
			{
				var self = this;
				elmClose.addEventListener( 'mousedown', function( event )
				{
					self.closeHandler( event );
				}, false );
			}
			this.element.appendChild( elmClose );
		}
	};
	
	addEventListener( event, callback, capture )
	{
	};
};

class TreeView
{
	constructor( data, readonly )
	{
	
		this.readyOnly = ( readonly != undefined ) ? readonly : true;
		var ok = -1;
		if( atom.contextMenu.itemSets )
		{
			for( var i = 0; i < atom.contextMenu.itemSets.length; i++ )
			{
				var item = atom.contextMenu.itemSets[ i ];
				if( item.selector == '.aoz-treeview' )
				{
					ok = i;
					break;
				}
			}
		};
		
		this.onSelectItem = function( data )
		{
			console.log( data );
		};
		
		this.onOpenItem = function( data )
		{
			console.log( data );
			atom.workspace.open( item.data.path );			
		};
		
		if( ok == -1 )
		{
			atom.contextMenu.add(
			{
				".aoz-treeview": 
				[
					{
						label: "Properties",
						command: 'aoz-treeview:project-props',
						visible: ( this.readOnly == true )
					},
					{
						label: "Open",
						command: 'aoz-treeview:open',
						visible: ( this.readOnly == true )
					},
					{
						label: "New Folder",
						command: 'aoz-treeview:new-folder',
						visible: ( this.readOnly == true )
					},				
					{
						label: "New File",
						visible: ( this.readOnly == true ),
						submenu: 
						[
							{
								label: 'New empty file',
								command: 'aoz-treeview:empty-file'
							},
							{
								label: 'Import a file',
								command: 'aoz-treeview:import-file'
							}					  
						]
					},
					{
						label: 'Show in Explorer',
						command: 'aoz-treeview: show-explorer',
						visible: ( this.readOnly == true )
					},
					{
						type: 'separator',
						visible: ( this.readOnly == true )
					},
					{
						label: "Rename",
						command: 'aoz-treeview:rename',
						visible: ( this.readOnly == true )
					},
					{
						label: "Delete",
						command: 'aoz-treeview:delete',
						visible: ( this.readOnly == true )
					},
					{
						label: "Duplicate",
						command: 'aoz-treeview:duplicate',
						visible: ( this.readOnly == true )
					},					
					{
						label: "Cut",
						command: 'aoz-treeview:cut',
						visible: ( this.readOnly == true )
					},
					{
						label: "Copy",
						command: 'aoz-treeview:copy',
						visible: ( this.readOnly == true )
					},
					{
						label: "Paste",
						command: 'aoz-treeview:cut',
						visible: ( this.readOnly == true )
					}					
				]
			} );
		}

		this.element = document.createElement( 'div' );
		this.element.setAttribute( 'class', 'tool-panel tree-view' );
		this.root = document.createElement( 'ul' );
		this.root.setAttribute( 'id', '#root' );
		this.root.setAttribute( 'style', 'margin-left: -24px' );
		this.element.appendChild( this.root );
		
		this.selectedItem = undefined;
		
		if( data == undefined )
		{
			this.data = [];
		}
		else
		{
			this.data = data;
		}
	};
	
	selectItem( item )
	{
		if( this.selectedItem != undefined )
		{
			this.selectedItem.title.classList.remove( 'item-selected' );
		}
		
		this.selectedItem = item;
		this.selectedItem.title.classList.add( 'item-selected' );
		this.onSelectItem( item.data );
	};

	openItem( item )
	{
		this.onOpenItem( item.data )		
	};
	
	setVisible( visible )
	{
		this.element.style.display = ( visible ) ? 'block' : 'none';
	};

	update()
	{
		this.element.innerHTML = '';
		this.element.appendChild( this.root );
		this.root.innerHTML = '';
		if( this.data )
		{
			for( var r = 0; r < this.data.length; r++ )
			{
				var itm = new TreeViewItem( this, this.root, this.data[ r ] ).element;
				if( itm != undefined )
				{
					this.root.appendChild( itm );
				}
			}
		}
		var toggler = document.getElementsByClassName("caret");
		var i;

		for( i = 0; i < toggler.length; i++ )
		{
			toggler[ i ].addEventListener( "click" , function() {
				this.parentElement.querySelector( ".nested" ).classList.toggle( "active" );
				this.classList.toggle( "caret-down" );
			} );
		}		
	};
};

class TreeViewItem
{
	constructor( treeview, parent, data, child )
	{
		if( data == undefined )
		{
			return undefined;
		}

		if( child == undefined )
		{
			child = false;
		}

		this.data = data;

		this.element = document.createElement( 'li' );
		this.element.setAttribute( 'data-name' , data.name );
		this.element.setAttribute( 'data-path' , data.path );
		this.element.setAttribute( 'is', ( data.type == 'group' ) ? 'group' : 'item' );
		this.list = undefined;

		var iconStyle = 'position:relative; font-weight:normal; color:#FFFFFF; background-repeat: no-repeat; background-size: contain; background-position: 8px 0px;padding-top: 4px; padding-bottom: 4px; padding-left: 24px; overflow: hidden; white-space: pre; text-overflow: ellipsis;';

		var	icon = ( data.icon ) ? data.icon : AOZIcons.ICON_UNKNOWN;		
		if( data.icon == undefined )
		{
			var ext = AOZIO.getFileExtension( data.path );
			if( ext != undefined )
			{
				switch( ext.toLowerCase() )
				{
					case 'aoz':
						icon = atom.ICONS.ICON_AOZ;
						iconStyle += 'font-weight: bold; color: #fdb82b';
						break

					case 'aozip':
						icon = atom.ICONS.ICON_AOZIP;
						break

					case 'amos':
						icon = atom.ICONS.ICON_AMOS;
						break

					case 'js':
						icon = atom.ICONS.ICON_JS;
						break

					case 'json':
					case 'hjson':
						icon = atom.ICONS.ICON_JSON;
						break

					case 'xml':
						icon = atom.ICONS.ICON_XML;
						break

					case 'html':
					case 'htm':
					case 'xhtml':
						icon = atom.ICONS.ICON_HTML;
						break

					case 'txt':
						icon = atom.ICONS.ICON_TXT;
						break

					case 'jpg':
					case 'jpeg':
					case 'gif':
					case 'bmp':
					case 'png':
						icon = atom.ICONS.ICON_IMAGE;
						break

					case 'wav':
					case 'ogg':
					case 'mp3':
						icon = atom.ICONS.ICON_AUDIO;
						break

					case 'avi':
					case 'mp4':
					case 'webm':
					case 'ogv':
					case 'mpeg':
					case 'wmv':
						icon = atom.ICONS.ICON_VIDEO;
						break

					case 'mod':
						icon = atom.ICONS.ICON_MOD;
						break

					case 'xm':
						icon = atom.ICONS.ICON_XM;
						break

					case 'pdf':
						icon = atom.ICONS.ICON_PDF;
						break
				}
			}
		}
		
		this.title = document.createElement( 'div' );
		this.title.setAttribute( 'title', data.name );
		this.title.setAttribute( 'alt', data.name );
		this.title.innerHTML = data.name;
		this.element.appendChild( this.title );
		
		if( data.type == 'group' )
		{
			icon = ( data.icon ) ? data.icon : atom.ICONS.ICON_FOLDER;
			this.title.setAttribute( 'class', 'caret aoz-treeview' );
			this.title.setAttribute( 'style', 'background-image:url(\'' + icon + '\'); ' + iconStyle + '; left: ' + ( ( child ) ? '-16px' : '-8px' ) + ';' );
			this.list = document.createElement( 'ul' ); 
			this.list.setAttribute( 'class', 'nested' );
			this.element.appendChild( this.list );
			
			if( data.childrens )
			{
				for( var r = 0; r < data.childrens.length; r++ )
				{
					this.list.appendChild( new TreeViewItem( treeview, this.list, data.childrens[ r ], true ).element );
				}
			}			
		}
		else
		{
			this.title.setAttribute( 'class', 'aoz-treeview' );
			this.title.setAttribute( 'style', 'background-image:url(\'' + icon + '\'); ' + iconStyle + '; padding-left: 33px; top:3px; left: -8px; background-position: 0px 0px' );			
		}
		this.treeview = treeview;
		var self = this;
		this.title.addEventListener( 'mousedown', function( event )
		{
			console.log( data );
			self.treeview.selectItem( self, data );
		} , false );
		
		this.title.addEventListener( 'click', function( event )
		{
			if( self.data.type != 'group' )
			{
				self.treeview.selectItem( self );
				self.treeview.openItem( self );
			}
		} , false );		
		parent.appendChild( this.element );
	}
}	

module.exports.Tab = Tab;
module.exports.TreeView = TreeView;
module.exports.TreeViewItem = TreeViewItem;