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
	'F_ICON_DIALOG$',
	'F_ORIENTATION$',
	'F_AUTODETECT$',
	'F_LANDSCAPE$',
	'F_PORTRAIT$'
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
	'V_ORIENTATION$',
	'V_TEXTWINDOW_WIDTH',
	'V_TEXTWINDOW_HEIGHT'
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
	application.vars.F_ICON_DIALOG$ = "Choose an icon for your application.";
	application.vars.F_ORIENTATION$ = "Screen orientation";
	application.vars.F_AUTODETECT$ = "Autodetect";
	application.vars.F_LANDSCAPE$ = "Landscape";
	application.vars.F_PORTRAIT$ = "Portrait";

	application.vars.F_UNITY$ = "You will create an AOZ project that will use Unity®.<br><br>Avant de continuer, assurez-vous d'avoir installé Unity sur votre machine. You can download the free version of the editor <a href='javascript:Editor.goUnity();'><b>HERE</b></a>.";
	application.vars.INIT_TITLE$ = "PREPARING UNITY"
	application.vars.PROGRESS_TITLE$ = "CREATING OF THE UNITY PROJECT"

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
		application.vars.F_ICON_DIALOG$ = "Sélectionner l'icône de votre application.";
		application.vars.F_ORIENTATION$ = "Orientation de l'écran";
		application.vars.F_AUTODETECT$ = "Auto-détection";
		application.vars.F_LANDSCAPE$ = "Paysage";
		application.vars.F_PORTRAIT$ = "Portrait";

		application.vars.F_UNITY$ = "Vous allez créer un projet AOZ qui utilisera Unity®.<br><br>Avant de continuer, assurez-vous d'avoir installé Unity sur votre machine. Vous pouvez télécharger la version gratuite de l'éditeur <a href='javascript:Editor.goUnity();'><b>ICI</b></a>.";
		application.vars.INIT_TITLE$ = "PREPARATION DE UNITY"
		application.vars.PROGRESS_TITLE$ = "CREATION DU PROJET UNITY"

	}

	application.vars.V_TITLE$ = "My Application";
	application.vars.V_PATH$ = window.application.vars.MYAOZPATH$;
	application.vars.V_VERSION$ = "1.0.0";
	application.vars.V_AUTHOR$ = "";
	application.vars.V_DATE$ = "";
	application.vars.V_COPYRIGHT$ = "Copyright (c) " + new Date().getFullYear() + " My Company";
	application.vars.V_ICON$ = "";
	application.vars.V_RESOLUTION$ = "1920x1080";
	application.vars.V_WIDTH = 1920;
	application.vars.V_HEIGHT = 1080;
	application.vars.V_FPS$ = '';
	application.vars.V_KEEP_RATIO$ = 'checked';
	application.vars.V_SMOOTH_ON$ = 'checked';
	application.vars.V_FONT_HEIGHT = 24;
	application.vars.V_ASSETS_FOLDER$ = 'checked';
	application.vars.V_ORIENTATION$ = 'landscape';
	application.vars.V_TEXTWINDOW_WIDTH = 80;
	application.vars.V_TEXTWINDOW_HEIGHT = 25;

	if( application.vars.LANG$ == 'fr' )
	{
		application.vars.V_TITLE$ = "Mon Application";
		application.vars.V_COPYRIGHT$ = "Copyright (c) " + new Date().getFullYear() + " Ma Compagnie";
	}
};

//
// Open URL for Unity
//
Editor.goUnity = function()
{
	window.open( 'https://unity.com/', 'new' );
};

Editor.showProperties = function()
{
	if( application.vars.CURPAGE == 1 )
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

	if( application.vars.CURPAGE == 2 )
	{
		document.getElementById( 'V_RESOLUTION$' ).value = application.vars.V_RESOLUTION$;
		document.getElementById( 'V_ORIENTATION$' ).value = application.vars.V_ORIENTATION$;
	}

	if( application.vars.CURPAGE == 3 )
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

		if( !client.atom.systemAPI.isDirectory( destPath ) )
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
						document.getElementById( 'infos' ).style.display = 'none';
						document.getElementById( 'progress' ).style.display = 'block';
						document.getElementById( 'bar' ).style.width = '0%';

						setTimeout( function()
						{
							client.atom.editorSDK.shell.shellExecute(
								{
									cmd: '"' + client.atom.unityPath + '" -batchmode -noUpm -logfile - "tmp" -createProject "' + decodeURI( destPath ) + '/unity" -quit'
								}, function( event, error, message )
								{
									console.log( event );
									if( event == 'onerror' )
									{
										console.warn( message );
										window.application.vars.REQERROR$ = "yes";
										window.application.vars.RESPONSE$ = "error";
										window.application.vars.REQUEST$ = "";
									}

									if( event == 'onstderr' )
									{
										console.warn( message );
										Editor.cleanProject();
									}

									if( event == 'stdout' )
									{
										console.log( message );
										Editor.cleanProject();
									}
								}, false );
						}, 1000 );
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
				document.getElementById( 'infos' ).style.display = 'none';
				document.getElementById( 'progress' ).style.display = 'block';
				document.getElementById( 'bar' ).style.width = '50%';

				setTimeout( function()
				{
					client.atom.editorSDK.shell.shellExecute(
						{
							cmd: '"' + client.atom.unityPath + '" -batchmode -noUpm -logfile - "tmp" -createProject "' + decodeURI( destPath ) + '/unity" -quit'
						}, function( event, error, message )
						{
							console.log( event );
							if( event == "onerror" )
							{
								console.warn( message );
								window.application.vars.REQERROR$ = "yes";
								window.application.vars.RESPONSE$ = "error";
								window.application.vars.REQUEST$ = "";
							}

							if( event == 'onstderr' )
							{
								console.warn( message );
								Editor.cleanProject();
							}

							if( event == 'stdout' )
							{
								console.log( message );
								Editor.cleanProject();
							}
						}, false );
				}, 1000 );

			}
		}
	}
};

Editor.cleanProject = function()
{
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{
		debugger;
		if( client.atom.systemAPI.copyDirectory( destPath + '/unity/Assets', application.vars.TEMPPATH$ + '/data/unity_project/Assets', { recursive: true } ) )
		{
			if( client.atom.systemAPI.deleteDirectory( decodeURI( destPath ) + "/edit" ) )
			{
				Editor.applyProperties();
			}
		}
	}
};

Editor.applyProperties = function()
{
	console.log( 'applyProperties');
	debugger;
	var destPath = window.application.vars.V_PATH$ + client.atom.sep + application.vars.V_TITLE$;
	if( client )
	{

		var manifest = client.atom.systemAPI.loadFile( destPath + "/resources/manifest.hjson" );
		var unitySettings = client.atom.systemAPI.loadFile( destPath + "/unity/ProjectSettings/ProjectSettings.asset" );

		if( application.vars.V_ORIENTATION$ == 'portrait' )
		{
			var mh = application.vars.V_HEIGHT;
			application.vars.V_HEIGHT = application.vars.V_WIDTH;
			application.vars.V_WIDTH = mh;

			var mh = application.vars.V_TEXTWINDOW_HEIGHT;
			application.vars.V_TEXTWINDOW_HEIGHT = application.vars.V_TEXTWINDOW_WIDTH;
			application.vars.V_TEXTWINDOW_WIDTH = mh;
		}

		application.vars.V_FONT_HEIGHT = application.vars.V_WIDTH / application.vars.V_TEXTWINDOW_WIDTH;

		var mContent = manifest.toString();
		var uContent = unitySettings.toString();
		uContent = uContent.strReplace( "  companyName: DefaultCompany", "  companyName: " + application.vars.V_COPYRIGHT$ );
		uContent = uContent.strReplace( "  productName: unity", "  productName: " + application.vars.V_TITLE$ );
		uContent = uContent.strReplace( ": 1920", ": " + application.vars.V_WIDTH );
		uContent = uContent.strReplace( ": 1080", ": " + application.vars.V_HEIGHT );
		uContent = uContent.strReplace( ": 960", ": " + application.vars.V_WIDTH );
		uContent = uContent.strReplace( ": 600", ": " + application.vars.V_HEIGHT );

		for( var i = 0; i < Editor.values.length; i++ )
		{
			var value = application.vars[ Editor.values[ i ] ];

			switch( Editor.values[ i ] )
			{
				case 'V_FPS$':
				case 'V_KEEP_RATIO$':
				case 'V_SMOOTH_ON$':
				case 'V_ASSETS_FOLDER$':
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

			mContent = mContent.strReplace( "%" + Editor.values[ i ] + "%", value );
			uContent = uContent.strReplace( "%" + Editor.values[ i ] + "%", value );
		}

		client.atom.systemAPI.saveFile( destPath + "/resources/manifest.hjson", mContent, 'utf8', function( error )
		{
			if( error == "" )
			{
				client.atom.systemAPI.rename( destPath + "/main.aoz" , destPath + "/" + application.vars.V_TITLE$ + ".aoz", {}, function( err, error, extra )
				{
					client.atom.systemAPI.saveFile( destPath + "/unity/ProjectSettings/ProjectSettings.asset", uContent, 'utf8', function( error )
					{
						if( error == "" )
						{
							client.openProject( destPath );
							client.atom.editorSDK.shell.shellExecute(
							{
								cmd: '"' + client.atom.unityPath + '" -noUpm -logfile - "tmp" -projectPath "' + decodeURI( destPath ) + '/unity" -executeMethod WebGLBuilder.Build'
							}, function( event, error, message )
								{
									if( error )
									{
										window.application.vars.REQERROR$ = "yes";
										window.application.vars.RESPONSE$ = "error";
										window.application.vars.REQUEST$ = "";
									}

									if( event == 'onstderr' )
									{
										console.error( message );
									}

									if( event == 'stdout' )
									{
										console.log( message );
									}
								}, false );
							client.atom.closeAOZViewer();
						}
					} );
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

Editor.changeResolution = function( value )
{
	var parts = value.split( "x" );
	document.getElementById( 'V_WIDTH' ).value = parts[ 0 ];
	document.getElementById( 'V_HEIGHT' ).value = parts[ 1 ];
};

application.vars.REQUEST$ = "load_pages";
