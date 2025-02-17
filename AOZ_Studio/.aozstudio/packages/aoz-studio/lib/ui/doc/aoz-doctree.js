const { Tab, TreeView, TreeViewItem } = require( '../aoz-ui' );

const FS = require( 'fs' );
const HJSON = require( 'hjson' );
const REMOTE = require('electron').remote;
const PATH = require( 'path' );
const TabbedPanel = require( '../tabbed-panel' );
const docSorting = require( './aoz-doc-sorting' );

const BrowserWindow = REMOTE.BrowserWindow;

/**
	Documentation Treeview
*/
class DocTree
{
	constructor()
	{
		var self = this;
		this.win = undefined;
		/**
		this.panel = new TabbedPanel(
			{
				id: 'help',
				title: 'Documentation',
				icon: atom.IMAGES.ICON_HELP,
				url : 'about:blank',
				resizable: true,
				width: 80,
				height: 80,
				top: 150,
				hideIcon: true
			}
		); 
		this.panel.win.innerHTML = '';
		this.panel.win.appendChild( this.panel.tab );
		
		this.data = []

		this.itemViews = document.getElementsByClassName( 'item-views' );
		this.itemView = undefined;
		this.tree = undefined;
		this.iframe = document.createElement( 'iframe' );
		this.iframe.setAttribute( 'class', 'help_frame' );

		var self = this;
		this.loadGuidemap();
		*/

	};

	open( search )
	{
		atom.workspace.element.blur();
		atom.workspace.element.blur();

		if( this.win == undefined )
		{
			this.win = new BrowserWindow( 
			{ 
				parent: atom.currentWindow,
				title: 'AOZ Studio Documentation',
				resizable: true,
				moveable: true,
				show: false,
				icon: atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'icons' + PATH.sep + 'user_guide.png',
				webPreferences:
				{
					devTools: true,
					webSecurity: false,
					allowRunningInsecureContent: true			
				}
			} );
			this.win.removeMenu();
			this.webToolsOn = false;
		}
		else
		{
			this.win.restore();
		}

		var self = this;
		var url = "https://doc.aoz.studio?forced=" + Date.now() + "&lang=en"/** + atom.aozLang.lang*/;
		if( search )
		{
			url = url + '&search=' + search;
		}
		var panes = document.querySelectorAll( '.pane' );
		for( var p = 0; p < panes.length; p++ )
		{
			panes[ p ].setAttribute( 'style', 'cursor: wait' );
		}
		atom.workspace.element.setAttribute( 'style', 'cursor: wait' );

		setTimeout(() => {

			this.win.loadURL( url, { userAgent: 'AOZViewer', extraHeaders: 'pragma: no-cache\n' } );
		});

		this.win.once( 'ready-to-show', () => {
			self.win.show();
			self.win.setTitle( 'AOZ Studio Documentation' );

			var panes = document.querySelectorAll( '.pane' );
			for( var p = 0; p < panes.length; p++ )
			{
				panes[ p ].setAttribute( 'style', 'cursor: normal' );
			}			
			atom.workspace.element.setAttribute( 'style', 'cursor: normal' );

			atom.aozToolBar.updateItems();		
		} );
	
		this.win.once( 'close', ( event ) => {
			event.preventDefault();
			self.win = undefined;
			atom.aozToolBar.updateItems();		
		} );		
	}

	loadGuidemap()
	{
		this.data =
		[
			/**
			{
				name: 'AOZ Studio Introduction Guide',
				path: atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'guide' + PATH.sep + 'en' + PATH.sep + 'intro.html',
				title: 'AOZ Studio Introduction Guide',
				type: 'item',
				ext: 'guide',
				icon: atom.ICONS.ICON_PDF
			},
			{
				name: 'AOZ Studio User Guide',
				path: atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'guide' + PATH.sep + 'en' + PATH.sep + 'guide.html',
				title: 'AOZ Studio User Guide',
				type: 'item',
				ext: 'guide',
				icon: atom.ICONS.ICON_PDF
			},
			{
				name: 'Introduction à AOZ Studio',
				path: atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'guide' + PATH.sep + 'fr' + PATH.sep + 'intro.html',
				title: 'Introduction à AOZ Studio',
				type: 'item',
				ext: 'guide',
				icon: atom.ICONS.ICON_PDF_FR
			},
			{
				name: 'AOZ Studio Guide de l\'utilisateur',
				path: atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'guide' + PATH.sep + 'fr' + PATH.sep + 'guide.html',
				title: 'AOZ Studio Guide de l\'utilisateur',
				type: 'item',
				ext: 'guide',
				icon: atom.ICONS.ICON_PDF_FR
			}
			*/			
		];
		
		var self = this;
		if( this.itemViews )
		{
			this.itemView = this.itemViews[ 3 ];
			var map = {};
			var sorting = docSorting.sorting;
			var list = [];
			var xobj = new XMLHttpRequest();
			xobj.overrideMimeType( "application/json" );
			xobj.open( 'GET', atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'guidemap.json', true );
			xobj.onreadystatechange = function ()
			{
				if( xobj.readyState == 4 && xobj.status == "200" )
				{
					map = JSON.parse( xobj.responseText );
					sorting = docSorting.validChapters( map );
					for( var c = 0; c < map.chapters.length; c++ )
					{
						if( map.chapters[ c ] != undefined && map.chapters[ c ] != null )
						{
							var chap =
							{
								name: ( map.chapters[ c ].name ) ? map.chapters[ c ].name : 'no name',
								path: ( map.chapters[ c ].name ) ? map.chapters[ c ].name : 'no name',
								title: ( map.chapters[ c ].name ) ? map.chapters[ c ].name : 'no name',
								descriptions:  ( map.chapters[ c ].descriptions ) ? map.chapters[ c ].descriptions : [],
								type: 'group',
								icon: atom.ICONS.SPELLBOOK,
								childrens :
								[
									{
										name: 'Introduction',
										title: ( map.chapters[ c ].name ) ? map.chapters[ c ].name : 'no name',
										descriptions:  ( map.chapters[ c ].descriptions ) ? map.chapters[ c ].descriptions : [],
										path: 'chapter',
										type: 'item',
										data: map.chapters[ c ],
										id: ( map.chapters[ c ].id ) ? map.chapters[ c ].id : 'no id',
										icon: atom.ICONS.POTION
									}
								]
							};

							if( map.chapters[ c ].pages )
							{
								for( var p = 0; p < map.chapters[ c ].pages.length; p++ )
								{
									if( map.chapters[ c ].pages[ p ] )
									{
										var icon = atom.ICONS.INSTRUCTION;

										if( map.chapters[ c ].pages[ p ].return && map.chapters[ c ].pages[ p ].return.length > 0  )
										{
											icon = atom.ICONS.FUNCTION;
										}

										var page =
										{
											name: ( map.chapters[ c ].pages[ p ].name ) ? map.chapters[ c ].pages[ p ].name : 'no name',
											title: ( map.chapters[ c ].pages[ p ].name ) ? map.chapters[ c ].pages[ p ].name : 'no name',
											descriptions:  ( map.chapters[ c ].pages[ p ].descriptions ) ? map.chapters[ c ].pages[ p ].descriptions : [],
											chapter: ( map.chapters[ c ].name ) ? map.chapters[ c ].name : 'no name',
											path: 'page',
											type: 'item',
											data: map.chapters[ c ].pages[ p ],
											icon: icon
										}
										
										if( page.name != 'no name' )
										{
											chap.childrens.push( page );
										}
									}
								}
							}
							
							//if( chap.name != 'no name' )
							//{
								list.push( chap );
							//}
						}
					}

					for( var c = 0; c < sorting.length; c++ )
					{
						if( sorting[ c ].chapter != undefined )
						{
							var chap = list[ sorting[ c ].chapter ];
							if( chap != undefined && chap.name != undefined )
							{
								chap.name = sorting[ c ].name;
								self.data.push( chap );
							}
						}
					}
					
					if( self.tree == undefined )
					{	
						self.tree = new TreeView( self.data, true );
						self.panel.win.appendChild( self.tree.element );
						self.panel.win.appendChild( self.iframe );
						self.tree.update();
						self.openDoc( self.data[ 0 ] );
						self.tree.onSelectItem = function( data )
						{
							/**
								Méthode appelée lors de la sélection d'un élément
							*/
						};

						self.tree.onOpenItem = function( data )
						{
							/**
								Méthode appelée lors de l'ouverture d'un élément
							*/
							if( data.ext && data.ext == 'guide' )
							{
								self.iframe.src = data.path;
							}
							else
							{
								self.openDoc( data );
							}
						};
					}
					else
					{
						self.tree.data = self.data;
						self.tree.update();
						self.openDoc( self.data[ 0 ] );						
					}

				}
			};
			xobj.send( null );
		}
		
	};

	/**
		Close documentation panel
	*/
	close( event )
	{
	};

	/**
		Open the documentation for a chapter or API
	*/
	openDoc( idata )
	{
		var html = '';
		if( idata.ext && idata.ext == 'guide' )
		{
			this.iframe.src = idata.path;
			return
		}

		var data = idata.data;
		if( idata.path == 'chapter' )
		{
			html = atom.AOZIO.loadIfExist( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'template' + PATH.sep + 'chapter.html', 'utf-8' );

			var api = '';
			if( data.pages != undefined && data.pages != null && data.pages.length > 0 )
			{
				api = '<br /><span class="keyw">Keywords:</span><ul>';
				for( var a = 0; a < data.pages.length; a++ )
				{
					api += '<li onclick="openAPI(\'' + data.pages[ a ].name + '\')">' + data.pages[ a ].name + '</li>';
				}
				api += '</ul>';
			}
			html = html.strReplace( '%api%', api ); 
		}

		if( idata.path == 'page' )
		{
			html = atom.AOZIO.loadIfExist( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'template' + PATH.sep + 'page.html', 'utf-8' );

			// Add parameters part
			var params = '';
			if( data.parameters != undefined && data.parameters != null && data.parameters.length > 0 )
			{
				for ( var pr = 0; pr < data.parameters.length; pr++ )
				{
					if( data.parameters[ pr ].name != undefined && data.parameters[ pr ].name != null && data.parameters[ pr ].name != '' )
					{
						if( data.parameters[ pr ].name.substr( 0, 1 ) == '*' )
						{
							params += '<p class="doc"><span class="optional">' + data.parameters[ pr ].name.substr( 1, 1000 ) + ' = ' + data.parameters[ pr ].type + '</span><br />' + data.parameters[ pr ].text + '</p>';
						}
						else
						{
							params += '<p class="doc"><span>' + data.parameters[ pr ].name + ' = <' + data.parameters[ pr ].type + '></span><br />' + data.parameters[ pr ].text + '</p>';
						}
					}
				}
			}
			html = html.strReplace( '%parameters%', params );

			var htmlContent = '';
			if( data.content != undefined && data.content != null && data.content != '' )
			{
				var lines = data.content.split( "|" );
				htmlContent = "<p>";
				if( lines )
				{
					var startCode = false;
					for( var l = 0; l < lines.length; l++ )
					{
						var line = lines[ l ];
						if( line.substring( 0, 3 ).toLowerCase() == '~~~' )
						{
							startCode = ( !startCode );
							line = '';
							if( startCode )
							{
								htmlContent = htmlContent + '<ul class="doc_code">';
							}
							else
							{
								htmlContent = htmlContent + '</ul>';
							}
						}

						if( line.substring( 0, 2 ).toLowerCase() == '![' )
						{
							var parts = line.split( "/" );
							var src = "";
							if( parts.length > 2 )
							{
								src = atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'assets' + PATH.sep + 'images' + PATH.sep + parts[ parts.length - 2 ] + PATH.sep + parts[ parts.length - 1 ].substring( 0 , parts[ parts.length - 1 ].length - 1 );
							}
							else
							{
								src = atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'assets' + PATH.sep + 'images' + PATH.sep + parts[ parts.length - 1 ].substring( 0 , parts[ parts.length - 1 ].length - 1 );
							}
							line = '<br /><br /><img class="img_doc" src="' + src + '" /><br />';
						}

						if( line != '' )
						{
							if( startCode )
							{
								htmlContent = htmlContent + '<li class="ex_code_line">' + line + '</li>';
							}
							else
							{
								htmlContent = htmlContent + line;
							}
						}

					}
				}
				htmlContent = htmlContent + '</p>';
			}
			html = html.strReplace( '%content%', htmlContent );

			// Add see also part
			var seealso = '<br /><span class="keyw">See also:</span><ul>';
			seealso += '<li onclick="openChapter(\'' + idata.chapter + '\')">' + idata.chapter + '</li>';
			if( data.seealso != undefined && data.seealso != null && data.seealso.length > 0 )
			{
				for( var a = 0; a < data.seealso.length; a++ )
				{
					if( data.seealso[ a ].name != undefined && data.seealso[ a ].name != null && data.seealso[ a ].name != '' )
					{
						seealso += '<li onclick="openAPI(\'' + data.seealso[ a ].name + '\')">' + data.seealso[ a ].name + '</li>';
					}
				}
			}
			seealso += '</ul>';
			html = html.strReplace( '%seealso%', seealso );
		}

		html = html.strReplace( '%title%', idata.title );
		var deprecated = '';
		if( data && data.deprecated != undefined && data.deprecated != null && data.deprecated.text )
		{
			html = html.strReplace( '%deprecated%', '<div class="deprecated">' + data.deprecated.text + '</div>' );
		}
		else
		{
			html = html.strReplace( '%deprecated%', deprecated );
		}
		
		var AOZCOMP = 'display:none';
		var AMOSCOMP = 'display:none';
		var STOSCOMP = 'display:none';
		var NOTIMP = 'display:none';		
		if( data && data.compatible != undefined && data.compatible != null && data.compatible != '' )
		{
			var test = data.compatible.split( ',' );
			if( test )
			{
				for( var t = 0; t < test.length; t++ )
				{
					if( test[ t ].trim().toLowerCase() == 'all' )
					{
						AOZCOMP = 'display:inline-block';
						AMOSCOMP = 'display:inline-block';
						STOSCOMP = 'display:inline-block';
					}
					
					if( test[ t ].trim().toLowerCase() == 'aoz' )
					{
						AOZCOMP = 'display:inline-block';
					}
					
					if( test[ t ].trim().toLowerCase() == 'amos' )
					{
						AMOSCOMP = 'display:inline-block';
					}
					
					if( test[ t ].trim().toLowerCase() == 'stos' )
					{
						STOSCOMP = 'display:inline-block';
					}
					
					if( test[ t ].trim().toLowerCase() == 'notimplemented' )
					{
						NOTIMP = 'display:inline-block';
					}					
				}
			}
		}
		else
		{
			AOZCOMP = 'display:inline-block';
			AMOSCOMP = 'display:none';
			STOSCOMP = 'display:none';
			NOTIMP = 'display:none';
		}
		html = html.strReplace( '%AOZCOMP%', AOZCOMP );
		html = html.strReplace( '%AMOSCOMP%', AMOSCOMP );
		html = html.strReplace( '%STOSCOMP%', STOSCOMP );
		html = html.strReplace( '%NOTIMP%', NOTIMP );
		
		var description = '';
		if( data && data.descriptions_file != undefined && data.descriptions_file != null && data.descriptions_file.length > 0 )
		{
			for( var d = 0; d < data.descriptions_file.length; d++ )
			{
				description += data.descriptions_file[ d ].text;
			}
		}
		else
		{
			if( data && data.descriptions != undefined && data.descriptions != null && data.descriptions.length > 0 )
			{
				for( var d = 0; d < data.descriptions.length; d++ )
				{
					description += data.descriptions[ d ].text;
				}
			}
		}
		html = html.strReplace( '%description%', description + '<br />' );
		var file = 'cache_' + Date.now() + '.html';
		if( !FS.existsSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' ) || !FS.statSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' ).isDirectory() )
		{
			atom.AOZIO.createDirectory( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' );
		}
		FS.writeFileSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' + PATH.sep + file, html );

		var self = this;
		setTimeout( function()
		{		
			self.iframe.src = atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' + PATH.sep + file + '?=f' + Date.now();
		}, 1000 );
		
	}

	openChapter( chapter, returnData )
	{

		if( this.data && this.data.length > 0 )
		{
			for( var d = 0; d < this.data.length; d++ )
			{
				if( this.data[ d ].title.toLowerCase() == chapter.toLowerCase() )
				{
					if( returnData != undefined && returnData == true )
				{
						return this.data[ d ].childrens[ 0 ];
					}
					else
					{
						this.openDoc( this.data[ d ].childrens[ 0 ] );
						if( this.panel.opened == false )
						{
							this.panel.toggleOpen();
						}
						return;
				}
				}
			}
		}

		return null;

	};

	openAPI( api, returnData )
	{

		if( this.data && this.data.length > 0 )
		{
			for( var d = 0; d < this.data.length; d++ )
			{
				if( this.data[ d ].childrens != undefined && this.data[ d ].childrens.length > 0 )
				{
					for( var c = 0; c < this.data[ d ].childrens.length; c++ )
					{
						if( this.data[ d ].childrens[ c ].title.toLowerCase() == api.toLowerCase() )
						{
							if( returnData != undefined && returnData == true )
							{
								return this.openDoc( this.data[ d ].childrens[ c ] );
							}
							else
							{
								this.openDoc( this.data[ d ].childrens[ c ] );
								if( this.panel.opened == false )
								{
									this.panel.toggleOpen();
								}
								return;
							}
						}
					}
				}
			}
		}
		return null;

	};

	searchDoc( search )
	{
		console.log( search );
		if( search == undefined || search == null || search == '' )
		{
			return false;
		}
		var results = '<br /><span class="keyw">Results:</span><ul>';
		var nbRes = 0;
		var lastURL = '';
		var lastType = 0;
		var founds = new Array();
		var words = search.split( " " );

		if( words && words.length > 0 )
		{
			for( var w = 0; w < words.length; w++ )
			{
				if( this.data && this.data.length > 0 )
				{
					for( var d = 0; d < this.data.length; d++ )
					{
						// Recherche dans le titre du chapitre
						var tit = this.data[ d ].title.trim().toLowerCase().split( " " );
						if( tit.includes( words[ w ].trim().toLowerCase() ) )
						{
							if( !founds.includes( this.data[ d ].title.trim().toLowerCase() ) )
							{
								nbRes++;
								results += '<li onclick="openChapter(\'' + this.data[ d ].title + '\')">' + this.data[ d ].title + '</li>';
								founds.push( this.data[ d ].title.trim().toLowerCase() );
								lastURL = this.data[ d ].title;
								lastType = 1;
							}

						}

						// Recherche dans les mots-clés du chapitre
						if( this.data[ d ].keywords && this.data[ d ].keywords.length > 0 && this.data[ d ].keywords[ 0 ].text )
						{
							var kw = this.data[ d ].keywords[ 0 ].text.split( ',' );
							if( kw.includes( words[ w ].trim().toLowerCase() ) )
							{
								if( !founds.includes( this.data[ d ].title.trim().toLowerCase() ) )
								{
									nbRes++;
									results += '<li onclick="openChapter(\'' + this.data[ d ].title + '\')">' + this.data[ d ].title + '</li>';
									founds.push( this.data[ d ].title.trim().toLowerCase() );
									lastURL = this.data[ d ].title;
									lastType = 1;									
								}									
							}
						}

						// Recherche dans les noms des APIs
						if( this.data[ d ].childrens != undefined && this.data[ d ].childrens.length > 0 )
						{
							for( var c = 0; c < this.data[ d ].childrens.length; c++ )
							{
								var tit = this.data[ d ].childrens[ c ].title.toLowerCase().split( " " );
								if( tit.includes( words[ w ].trim().toLowerCase() ) )
								{
									if( !founds.includes( this.data[ d ].childrens[ c ].title.trim().toLowerCase() ) )
									{	nbRes++;
										if( this.data[ d ].childrens[ c ].descriptions && this.data[ d ].childrens[ c ].descriptions.length > 0 )
										{
											results += '<li onclick="openAPI(\'' + this.data[ d ].childrens[ c ].title + '\')">' + this.data[ d ].childrens[ c ].title + '<br><i style="color: #888888; font-size: 2vw;">' + this.data[ d ].childrens[ c ].descriptions[ 0 ].text + '</i></li>';
										}
										else
										{
											results += '<li onclick="openAPI(\'' + this.data[ d ].childrens[ c ].title + '\')">' + this.data[ d ].childrens[ c ].title + '</li>';											
										}
										
										founds.push( this.data[ d ].childrens[ c ].title.trim().toLowerCase() );
										lastURL = this.data[ d ].childrens[ c ].title;
										lastType = 2;										
									}
								}
								
								// Recherche dans les mots clés des APIs
								if( this.data[ d ].childrens[ c ].data && this.data[ d ].childrens[ c ].data.keywords && this.data[ d ].childrens[ c ].data.keywords.length > 0 && this.data[ d ].childrens[ c ].data.keywords[ 0 ].text )
								{
									var kw = this.data[ d ].childrens[ c ].data.keywords[ 0 ].text.split( ',' );
									if( kw.includes( words[ w ].toLowerCase() ) )
									{
										if( !founds.includes( this.data[ d ].childrens[ c ].title.trim().toLowerCase() ) )
										{	nbRes++;
											if( this.data[ d ].childrens[ c ].descriptions && this.data[ d ].childrens[ c ].descriptions.length > 0 )
											{
												results += '<li onclick="openAPI(\'' + this.data[ d ].childrens[ c ].title + '\')">' + this.data[ d ].childrens[ c ].title + '<br><i style="color: #888888; font-size: 2vw;">' + this.data[ d ].childrens[ c ].descriptions[ 0 ].text + '</i></li>';
											}
											else
											{
												results += '<li onclick="openAPI(\'' + this.data[ d ].childrens[ c ].title + '\')">' + this.data[ d ].childrens[ c ].title + '</li>';											
											}
											founds.push( this.data[ d ].childrens[ c ].title.trim().toLowerCase() );
											lastURL = this.data[ d ].childrens[ c ].title;
											lastType = 2;											
										}
									}
								}								
							}
						}
					}
				}
			}
			
			if( nbRes == 1 )
			{
				if( lastType == 1 )
				{
					this.openChapter( lastURL );
					return true;
				}

				if( lastType == 2 )
				{
					this.openAPI( lastURL );
					return true;
				}
			}
				
		}
		results += '</ul>';

		var html = atom.AOZIO.loadIfExist( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'template' + PATH.sep + 'search.html', 'utf-8' );

		html = html.strReplace( '%nbres%', nbRes );
		if( nbRes == 0 )
		{
			results = '';
		}
		html = html.strReplace( '%results%', results );
		var file = 'cache_' + Date.now() + '.html';
		
		if( !FS.existsSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' ) || FS.lstatSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' ).isFile() )
		{
			atom.AOZIO.createDirectory( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' );
		}		
		FS.writeFileSync( atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' + PATH.sep + file, html );

		var self = this;
		setTimeout( function()
		{		
			self.iframe.src = atom.aozConfig.installInformation.aozPath + PATH.sep + 'docs' + PATH.sep + 'cache' + PATH.sep + file + '?=f' + Date.now();
		}, 1000 );
		
		if( nbRes > 0 )
		{
			if( this.panel.opened == false )
			{
				this.panel.toggleOpen();
			}
			return true;
		}

		if( this.panel.opened == false )
		{
			this.panel.toggleOpen();
		}
		return false;
	};
	
};

module.exports = DocTree;
