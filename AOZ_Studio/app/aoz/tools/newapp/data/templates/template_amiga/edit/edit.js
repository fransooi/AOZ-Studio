var Editor = new Object();

Editor.fields = 
[
	'F_TITLE$',
	'F_PATH$',	
	'F_AUTHOR$',
	'F_VERSION_DATE$',
	'F_COPYRIGHT$',
	'F_ICON$',
	'F_RESOLUTION$',
	'F_FPS$',
	'F_KEEP_RATIO$',
	'F_SMOOTH_ON$',
	'F_ASSETS_FOLDER$',
	'F_TV$',
	'F_LACED$',
	'F_HARDWARE_COORDS$',
	'F_ICON_DIALOG$'
];

Editor.values = 
[
	'V_TITLE$',
	'V_PATH$',
	'V_VERSION$',
	'V_AUTHOR$',
	'V_DATE$',
	'V_COPYRIGHT$',
	'V_ICON$',
	'V_RESOLUTION$',
	'V_WIDTH',
	'V_HEIGHT',
	'V_FPS$',
	'V_KEEP_RATIO$',
	'V_SMOOTH_ON$',
	'V_FONT_HEIGHT',
	'V_ASSETS_FOLDER$',
	'V_TV$',
	'V_LACED$',
	'V_TEXTWINDOW_WIDTH',
	'V_TEXTWINDOW_HEIGHT',
	'V_HARDWARE_COORDS$',
	'V_XHARD',
	'V_YHARD',
	"V_PIXEL_MODE$"
];

Editor.initProperties = function()
{
	application.vars.F_TITLE$ = "Project Title";
	application.vars.F_PATH$ = "Destination folder";	
	application.vars.F_AUTHOR$ = "Authors";
	application.vars.F_COPYRIGHT$ = "Copyright";
	application.vars.F_VERSION_DATE$ = "Version & Date";
	application.vars.F_ICON$ = "Project Icon";
	application.vars.F_RESOLUTION$ = "Resolution";
	application.vars.F_BTN_CHOOSE$ = "...";
	application.vars.F_FPS$ = "Show FPS";
	application.vars.F_KEEP_RATIO$ = "Keep proportions";
	application.vars.F_SMOOTH_ON$ = "Graphics smoothing";
	application.vars.F_ASSETS_FOLDER$ = "Use the Assets folder by default";
	application.vars.F_TV = "Display format"
	application.vars.F_PAL$ = "PAL";
	application.vars.F_NTSC$ = "NTSC";
	application.vars.F_LOWRES$ = "Low resolution";
	application.vars.F_HIRES$ = "High resolution";
	application.vars.F_LACED$ = "Lines Interlaced";
	application.vars.F_HARDWARE_COORDS$ = "Use the Amiga Hardware Screen coordinates";
	application.vars.F_ICON_DIALOG$ = "Choose an icon for your application.";
	
	
	if( application.vars.LANG$ == 'fr' )
	{
		application.vars.F_TITLE$ = "Titre du projet";
		application.vars.F_PATH$ = "Dossier de destination";		
		application.vars.F_AUTHOR$ = "Auteurs";
		application.vars.F_COPYRIGHT$ = "Copyright";
		application.vars.F_VERSION_DATE$ = "Version & Date";
		application.vars.F_ICON$ = "Icône du projet";
		application.vars.F_RESOLUTION$ = "Résolution";
		application.vars.F_BTN_CHOOSE$ = "...";
		application.vars.F_FPS$ = "Afficher le FPS";
		application.vars.F_KEEP_RATIO$ = "Conserver les proportions";
		application.vars.F_SMOOTH_ON$ = "Lisser les graphismes";
		application.vars.F_ASSETS_FOLDER$ = "Utilser le dossier Assets par défaut";
		application.vars.F_TV$ = "Format d'affichage"
		application.vars.F_PAL$ = "PAL";
		application.vars.F_NTSC$ = "NTSC";
		application.vars.F_LOWRES$ = "Basse résolution";
		application.vars.F_HIRES$ = "Haute résolution";
		application.vars.F_LACED$ = "Lignes entrelacées";
		application.vars.F_HARDWARE_COORDS$ = "Utiliser les coordonnées d'écran de l'Amiga";
		application.vars.F_ICON_DIALOG$ = "Sélectionner l'icône de votre application.";		
	}
	
	application.vars.V_TITLE$ = "My Application";
	application.vars.V_PATH$ = window.application.vars.MYAOZPATH$;	
	application.vars.V_VERSION$ = "1.0.0";
	application.vars.V_AUTHOR$ = "";
	application.vars.V_DATE$ = "";
	application.vars.V_COPYRIGHT$ = "Copyright (c) " + new Date().getFullYear() + " My Company";
	application.vars.V_ICON$ = "";
	application.vars.V_RESOLUTION$ = "lowres";
	application.vars.V_WIDTH = 320;
	application.vars.V_HEIGHT = 256;
	application.vars.V_FPS$ = '';
	application.vars.V_KEEP_RATIO$ = 'checked';
	application.vars.V_SMOOTH_ON$ = 'checked';
	application.vars.V_FONT_HEIGHT = 29;
	application.vars.V_ASSETS_FOLDER$ = 'checked';
	application.vars.V_TV$ = "pal";
	application.vars.V_LACED$ = "";
	application.vars.V_TEXTWINDOW_WIDTH = 40;
	application.vars.V_TEXTWINDOW_HEIGHT = 25;
	application.vars.V_HARDWARE_COORDS$ = "checked";		
	application.vars.V_XHARD = 120;
	application.vars.V_YHARD = 42;
	application.vars.V_PIXEL_MODE$ = "";
	
	if( application.vars.LANG$ == 'fr' )
	{
		application.vars.V_TITLE$ = "Mon Application";
		application.vars.V_COPYRIGHT$ = "Copyright (c) " + new Date().getFullYear() + " Ma Compagnie";
	}
};

Editor.showProperties = function()
{
	if( application.vars.CURPAGE == 0 )
	{
		document.getElementById( 'btnPath' ).addEventListener( 'click', function( event )
		{
			var path = client.openDirectoriesDialog( application.vars.F_PATH$, document.getElementById( 'V_PATH$' ).value );
			path = application.vars.RESPONSE$;
			if( path && path != '' && path != '-1' && path != 'error' )
			{
				document.getElementById( 'V_PATH$' ).value = decodeURI(path);
			}
		}, false );			
	}
	
	if( application.vars.CURPAGE == 1 )
	{
		document.getElementById( 'V_RESOLUTION$' ).value = application.vars.V_RESOLUTION$;
		document.getElementById( 'V_TV$' ).value = application.vars.V_TV$;
	}
	
	if( application.vars.CURPAGE == 2 )
	{
		document.getElementById( 'btnIcon' ).addEventListener( 'click', function( event )
		{
			var path = client.openFileDialog( application.vars.F_ICON_DIALOG$, '', client.IMAGES_FILTERS );
			
			if( path && path != '' && path != '-1' && path != 'error' )
			{
				document.getElementById( 'V_ICON$' ).value = path;					
			}
		}, false );
	}
};

Editor.valideProperties = function( nochange )
{
	for( var v = 0; v < Editor.values.length; v++ )
	{
		if( document.getElementById( Editor.values[ v ] ) )
		{
			switch( Editor.values[ v ] )
			{
				case 'V_FPS$':
				case 'V_KEEP_RATIO$':
				case 'V_SMOOTH_ON$':
				case 'V_ASSETS_FOLDER$':
				case 'V_LACED$':
				case 'V_HARDWARE_COORDS$':
					application.vars[ Editor.values[ v ] ] = ( document.getElementById( Editor.values[ v ] ).checked )?'checked':'';
					break;
				
				default:
					application.vars[ Editor.values[ v ] ] = document.getElementById( Editor.values[ v ] ).value;
					break;
			}			
		}
	}
	
	if( nochange == undefined || !nochange )
	{
		application.vars.REQUEST$ = "change_page";
	}	
};

Editor.createProject = function()
{
	Editor.valideProperties( true );
	if( client )
	{
		if( application.vars.V_TITLE$ == '' )
		{
			client.atom.systemAPI.messageBox( application.vars.TERM_CREATE$, window.application.vars.PROJECT_WITHOUT_TITLE$, "error" );
			return;			
		}		

		var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
		var srcPath = window.application.vars.COPYSOURCE$;
		if( srcPath && srcPath == "" )
		{
			window.application.vars.REQERROR$ = "yes";
			window.application.vars.RESPONSE$ = "error";
			window.application.vars.REQUEST$ = "";		
		}
		
		if( client.atom.systemAPI.directoryExists( destPath ) )
		{
			client.atom.systemAPI.messageBox( application.vars.TERM_CREATE$, window.application.vars.PROJECT_ALREADY_EXIST$, "error" );
			return;
		}
		
		if( !client.atom.systemAPI.isDirectory( path ) )
		{
			client.atom.systemAPI.createDirectory( destPath, function( error )
			{
				if( error == "" )
				{
					if( !client.atom.systemAPI.copyDirectory( decodeURI( destPath ), srcPath, { recursive: true } ) )
					{
						window.application.vars.REQERROR$ = "yes";
						window.application.vars.RESPONSE$ = "error";
						window.application.vars.REQUEST$ = "";
					}
					else
					{
						Editor.cleanProject();
					}
				}
			} );
		}
		else
		{
			if( !client.atom.systemAPI.copyDirectory( decodeURI( destPath ), srcPath, { recursive: true } ) )
			{
				window.application.vars.REQERROR$ = "yes";
				window.application.vars.RESPONSE$ = "error";
				window.application.vars.REQUEST$ = "";
			}
			else
			{
				Editor.cleanProject();
			}
		}
	}
};

Editor.cleanProject = function()
{
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{
		if( client.atom.systemAPI.deleteDirectory( decodeURI( destPath ) + "/edit" ) )
		{
			Editor.applyProperties();
		}
	}	
};

Editor.applyProperties = function()
{
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{
		var manifest = client.atom.systemAPI.loadFile( destPath + "/resources/manifest.hjson" );

		application.vars.V_PIXEL_MODE$ = application.vars.V_RESOLUTION$;			

		if( application.vars.V_RESOLUTION$ == 'lowres' )
		{
			application.vars.V_WIDTH = 320;
			application.vars.V_TEXTWINDOW_WIDTH = 40;
		}
		else
		{
			application.vars.V_WIDTH = 640;
			application.vars.V_TEXTWINDOW_WIDTH = 80;
		}
		if( application.vars.V_TV$ == 'pal' )
		{
			application.vars.V_HEIGHT = 256;
			application.vars.V_TEXTWINDOW_HEIGHT = 25;
		}
		else
		{
			application.vars.V_HEIGHT = 200;
			application.vars.V_TEXTWINDOW_HEIGHT = 20;
		}

		if( application.vars.V_LACED$ == 'checked' )
		{
			application.vars.V_HEIGHT = application.vars.V_HEIGHT * 2;
			application.vars.V_TEXTWINDOW_HEIGHT = application.vars.V_TEXTWINDOW_HEIGHT * 2;
			application.vars.V_PIXEL_MODE$ = application.vars.V_RESOLUTION$ + "+laced";			
		}
		
		if( application.vars.V_HARDWARE_COORDS$ == 'checked' )
		{
			application.vars.V_XHARD = 120;
			application.vars.V_YHARD = 42;
		}
		else
		{
			application.vars.V_XHARD = 0;
			application.vars.V_YHARD = 0;
		}
		
		var content = manifest.toString();
		for( var i = 0; i < Editor.values.length; i++ )
		{
			var value = application.vars[ Editor.values[ i ] ];

			switch( Editor.values[ i ] )
			{
				case 'V_FPS$':
				case 'V_KEEP_RATIO$':
				case 'V_SMOOTH_ON$':
				case 'V_ASSETS_FOLDER$':
				case 'V_LACED$':
				case 'V_HARDWARE_COORDS$':				
					if( value == 'checked' )
					{
						value = true;
					}
					else
					{
						value = false;
					}
					break;
			}

			content = content.strReplace( "%" + Editor.values[ i ] + "%", value );
		}

		client.atom.systemAPI.saveFile( destPath + "/resources/manifest.hjson", content, 'utf8', function( error )
		{
			if( error == "" )
			{
				client.atom.systemAPI.rename( destPath + "/main.aoz" , destPath + "/" + application.vars.V_TITLE$ + ".aoz", {}, function( err, error, extra )
				{
					client.openProject( destPath );				
				} );
			}
		} );
	}
};

Editor.closeEditor = function()
{
	for( var f = 0; f < Editor.fields.length; f++ )
	{	
		if( application.vars[ Editor.fields[ f ] ] )
		{
			delete application.vars[ Editor.fields[ f ] ];
		}
	}

	for( var v = 0; v < Editor.values.length; v++ )
	{
		if( application.vars[ Editor.values[ v ] ] )
		{		
			delete application.vars[ Editor.values[ v ] ];
		}
	}
	
	application.vars.CUR_CAT = -1;
	application.vars.CTX$ = '';
	application.vars.JSON_ID = -1;
	application.vars.REQUEST$ = "update_categories";	
};

application.vars.REQUEST$ = "load_pages";

