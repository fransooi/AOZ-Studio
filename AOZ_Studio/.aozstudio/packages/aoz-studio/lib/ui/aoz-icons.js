const PATH = require( 'path' );
const AOZIO = require( '../aoz-io' );
const HJSON = require( 'hjson' ); 
var AOZIcons = new Object();

AOZIcons.AOZConfig = undefined;
AOZIcons.count = 0;
AOZIcons.accessories = {};

AOZIcons.deleteProjectPath = function( searchPath )
{
	var elms = document.getElementsByClassName( 'icon' );
	for( var e = 0; e < elms.length; e++ )
	{
		var elm = elms[ e ];
		var path = elm.dataset.path;
		for( c = 0; c < elm.classList.length; c++ )
		{
			if( elm.classList[ c ] == 'icon-file-directory' )
			{
				if( path == searchPath )
				{
					document.body.removeChild( elm );
				}
			}
		}			
	}
	AOZIcons.updateProjectIcons();
};

AOZIcons.updateProjectIcons = function( aozConfig )
{
	AOZIcons.count++;
	if( AOZIcons.tm )
	{
		clearTimeout( AOZIcons.tm );
	}

	if( aozConfig != undefined )
	{
		AOZIcons.AOZConfig = aozConfig;
	}
	
	var dirSep = PATH.sep;
	var elms = document.getElementsByClassName( 'icon' );
	var aozPath = atom.aozConfig.installInformation.aozPath.substring( 0, atom.aozConfig.installInformation.aozPath.length - 4 );
	var rootPath = atom.aozConfig.installInformation.rootPath;
	for( var e = 0; e < elms.length; e++ )
	{
		var elm = elms[ e ];
		var remove = false;
		var path = elm.dataset.path;

		var c = 0;
		var isDirectory = false;
		var isSelected = false;
		for( c = 0; c < elm.classList.length; c++ )
		{
			if( elm.classList[ c ] == 'icon-file-directory' )
			{
				isDirectory = true;
			}

			if( elm.classList[ c ] == 'selected' )
			{
				isSelected = true;
			}
		}
		var icon = atom.ICONS.ICON_UNKNOWN;

		var fontWeight = 'normal';
		var fontColor = '#FFFFFF';
		if( path != undefined && elm.icon == undefined )
		{
			if( isDirectory )
			{
				icon = atom.ICONS.ICON_FOLDER;

				// My AOZ Application
				if( path == atom.aozConfig.installInformation.documentsPath )
				{
					icon = atom.ICONS.ICON_MYAOZ_FOLDER;
//					elm.setAttribute( 'data-name', 'My AOZ Applications' );
					elm.innerHTML = 'My AOZ Applications';
				}

				// Manual
				if( path == aozPath + dirSep + 'Manuals' )
				{
					icon = atom.ICONS.ICON_MANUAL_FOLDER;
				}
				
				// AOZ Inspirations
				if( path == atom.aozConfig.installInformation.documentsPath + dirSep + 'AOZ Inspirations' )
				{
					icon = atom.ICONS.ICON_PROJECT;
				}
				
				// AOZ Store
				if( path == aozPath + dirSep + 'AOZ Store' )
				{
					icon = atom.ICONS.ICON_AOZ_STORE_FOLDER;
				}				

				// Demos
				if( path == aozPath + dirSep + 'AOZ Store' + dirSep + 'Demos' || path == atom.aozConfig.installInformation.documentsPath + dirSep + 'AOZ Inspirations' + dirSep + 'Demos' )
				{
					icon = atom.ICONS.ICON_DEMOS_FOLDER;
				}

				// Games
				if( path == aozPath + dirSep + 'AOZ Store' + dirSep + 'Games' || path == atom.aozConfig.installInformation.documentsPath + dirSep + 'AOZ Inspirations' + dirSep + 'Games' )
				{
					icon = atom.ICONS.ICON_GAMES_FOLDER;
				}

				// Accessories
				if( path == aozPath + dirSep + 'Accessories' )
				{
					icon = atom.ICONS.ICON_TOOLS_FOLDER;
				}

				// Tools & Utilities
				if( path == aozPath + dirSep + 'AOZ Store' + dirSep + 'Utilities and Others' || path == atom.aozConfig.installInformation.documentsPath + dirSep + 'AOZ Inspirations' + dirSep + 'Utilities and Others' )
				{
					icon = atom.ICONS.ICON_AOZ_UTILS_FOLDER;
				}
				
				// Tutorials
				if( path == aozPath + dirSep + 'AOZ Store' + dirSep + 'Tutorials' || path == atom.aozConfig.installInformation.documentsPath + dirSep + 'AOZ Inspirations' + dirSep + 'Tutorials' )
				{
					icon = atom.ICONS.ICON_TUTORIALS_FOLDER;
				}

				// AOZ Resources Drive
				if( path == aozPath + dirSep + 'Drives' )
				{
					icon = atom.ICONS.ICON_AOZ_DRIVE_FOLDER;
				}

				// Resources Folder
				if( PATH.basename( path ).toLowerCase() == 'resources' )
				{
					icon = atom.ICONS.ICON_RESOURCES;
				}
				
				// 2.icons Folder
				if( PATH.basename( path ).toLowerCase() == '2.icons' )
				{
					icon = atom.ICONS.ICON_ICONS;
				}

				elm.path = path;

				// 1.images folder
				if( PATH.basename( path ).toLowerCase() == '1.images' || PATH.basename( path ).toLowerCase() == 'images' )
				{
					elm.innerHTML = "Images";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
								root: this.path,
								extensions: [ '.jpg', '.jpeg', '.iff', '.ilbm', '.png', '.gif', '.bmp' ],
								createDir:false
						} );
					}, false );
					*/
					icon = atom.ICONS.ICON_IMAGES;
				}
				
				// 2.icons Folder
				if( PATH.basename( path ).toLowerCase() == '2.icons' )
				{
					elm.innerHTML = "Icons";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
							root: this.path,
							extensions: [ '.jpg', '.jpeg', '.iff', '.ilbm', '.png', '.gif', '.bmp' ],
							createDir:false
						} );
					}, false );	
					*/
					icon = atom.ICONS.ICON_ICONS;
				}

				// 3.musics folder
				if( PATH.basename( path ).toLowerCase() == '3.musics' )
				{
					elm.innerHTML = "Musics";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
								root: this.path,
								extensions: [ '.mp3', '.ogg', '.wav' ],
								createDir:false
						} );
					}, false );
					*/
					icon = atom.ICONS.ICON_MUSICS;
				}

				// 5.samples folder
				if( PATH.basename( path ).toLowerCase() == '5.samples' )
				{
					elm.innerHTML = "Sounds";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
								root: this.path,
								extensions: [ '.mp3', '.ogg', '.wav' ],
								createDir:false
						} );
					}, false );
					*/
					icon = atom.ICONS.ICON_SOUNDS;
				}
				
				// filesystem
				if( PATH.basename( path ).toLowerCase() == 'filesystem' )
				{
					elm.innerHTML = "Filesystem";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
								root: this.path,
								createDir:true
						} );
					}, false );	
					*/				
					icon = atom.ICONS.ICON_FS;
				}

				// assets folder
				if( PATH.basename( path ).toLowerCase() == 'assets' )
				{
					elm.innerHTML = "Assets";
					/**
					elm.addEventListener( 'dblclick', function( event )
					{
						event.stopPropagation();
						atom.resourcesPanel.show( 
						{
								root: this.path,
								createDir:true
						} );
					}, false );	
					*/			
					icon = atom.ICONS.ICON_ASSETS;
				}
				
				// appicon folder
				if( PATH.basename( path ).toLowerCase() == 'appicon' )
				{
					remove = true;
				}								
			}
			else
			{
				icon = atom.ICONS.ICON_UNKNOWN;
				var name = PATH.basename( path );
				var ext = AOZIO.getFileExtension( path );
				if( ext != undefined )
				{
					switch( ext.toLowerCase() )
					{
						case 'aoz':
							icon = atom.ICONS.ICON_AOZ_FILE;
							fontWeight = 'bold';
							fontColor = '#fdb82b';
							break

						case 'aozip':
							icon = atom.ICONS.ICON_AOZIP;
							break

						case 'amos':
							icon = atom.ICONS.ICON_AMOS;
							break
						
						case 'aozacclnk':
							icon = atom.ICONS.ICON_AOZ_ACCLNK;
							if( AOZIcons.accessories == undefined || AOZIcons.accessories[ name ] == undefined )
							{
								var json = atom.AOZIO.loadIfExist( path, 'utf8' );
								if ( json )
								{
									var lnk;
									try
									{
										lnk = HJSON.parse( json );
										console.log( lnk );
									}
									catch( e ) {
										console.error( e );
									}
									
									if( lnk )
									{
										AOZIcons.accessories[ name ] = lnk;
									}
								}
							}
							
							if( AOZIcons.accessories[ name ] != undefined )
							{
								if( AOZIcons.accessories[ name ].infos && AOZIcons.accessories[ name ].infos.icon && AOZIcons.accessories[ name ].icon != '' )
								{
									icon = ( atom.aozConfig.installInformation.aozPath + atom.sep + 'utilities' + atom.sep + 'accicons' + atom.sep + AOZIcons.accessories[ name ].infos.icon ).strReplace( atom.sep, atom.sep + atom.sep + atom.sep + atom.sep );
								}
								elm.innerHTML = AOZIcons.accessories[ name ].infos.name;
								if( AOZIcons.accessories[ name ].infos.description  && AOZIcons.accessories[ name ].infos.description != '' )
								{
									elm.setAttribute( 'title', AOZIcons.accessories[ name ].infos.description );
									elm.setAttribute( 'alt', AOZIcons.accessories[ name ].infos.description );
								}
								else
								{
									elm.setAttribute( 'title', AOZIcons.accessories[ name ].infos.name );
									elm.setAttribute( 'alt', AOZIcons.accessories[ name ].infos.name );									
								}
							}
							
							break
						
						case 'aoz3d':
							icon = atom.ICONS.ICON_AOZ_3D;
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

					var css = document.createElement( 'style' );
					css.innerHTML = 'span.icon-file-' + ext + '::before { content: \'\'; }';
					document.body.appendChild( css );
				}
			}

			if( remove )
			{
				if( elm.parentNode && elm.parentNode.parentNode && elm.parentNode.parentNode.parentNode  )
				{
					elm.parentNode.parentNode.parentNode.removeChild( elm.parentNode.parentNode );
				}
			}
			else
			{
				elm.setAttribute( 'style', 'background-image: url(\'' + icon + '\'); font-weight:' + fontWeight + '; color:' + fontColor + '; background-repeat: no-repeat; background-size: contain; padding-top:4px; padding-bottom: 4px;' );
				elm.icon = icon;
			}
		}

		if( isSelected )
		{
			var eParent = elm.parentNode;
			if( eParent )
			{
				eParent.setAttribute( 'style', 'background-color: #556173;' );
			}
		}
	}

};

AOZIcons.installHandlers = function( aozConfig )
{
	if( aozConfig != undefined )
	{
		AOZIcons.AOZConfig = aozConfig;
	}
	
	atom.workspace.paneContainers.center.paneContainer.element.addEventListener( 'click', function( event )
	{
		event.preventDefault();
		AOZIcons.updateProjectIcons( aozConfig );
	}, false );

	atom.workspace.paneContainers.left.paneContainer.element.addEventListener( 'click', function( event )
	{
		event.preventDefault();
		AOZIcons.updateProjectIcons( aozConfig );
	}, false );

	atom.project.onDidChangePaths( function( paths )
	{
		AOZIcons.updateProjectIcons( aozConfig );
	} );

};

module.exports = AOZIcons;