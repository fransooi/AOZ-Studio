var SettingsDisplay = function( settings )
{
	this.settings = settings;
	this.panel = document.createElement( 'div' );
	this.panel.setAttribute( 'class', 'cat-panel' );
	
	this.item =
	{
		id: -1,
		icon: atom.IMAGES.ICON_DISPLAY,
		title: atom.aozLang.getTerm( 'settings:display' ),
		disabled: false
	};
	
	this.fontChanged = false;
};

SettingsDisplay.prototype.install = function()
{
	var self = this;
	this.panel.splash = this.settings.panels.createCheckbox(
		{
			id: 'splash',
			label: atom.aozLang.getTerm( 'settings:show-splash' ) //'Show the splash screen when opening AOZ Studio',
		}
	);
	this.panel.appendChild( this.panel.splash );
	
	this.panel.projects = this.settings.panels.createCheckbox(
		{
			id: 'projects',
			label: atom.aozLang.getTerm( 'settings:show-projects' )//'Show the projects panel',
		}
	);
	this.panel.appendChild( this.panel.projects );

	this.panel.transpiler = this.settings.panels.createCheckbox(
		{
			id: 'transpiler',
			label: atom.aozLang.getTerm( 'settings:hide-transpiler' )//'Hide the Transpiler if compilation is successful.',
		}
	);
	this.panel.appendChild( this.panel.transpiler );

	this.panel.viewerFP = this.settings.panels.createCheckbox(
		{
			id: 'viewerfp',
			label: atom.aozLang.getTerm( 'settings:aoz-viewer-fullscreen' )//'Show AOZ Viewer in fullpage',
		}
	);
	this.panel.appendChild( this.panel.viewerFP );
	
	this.panel.showDoc = this.settings.panels.createCheckbox(
		{
			id: 'showdoc',
			label: atom.aozLang.getTerm( 'settings:show-doc-at-startup' )//'Show AOZ Viewer in fullpage',
		}
	);
	this.panel.appendChild( this.panel.showDoc );

	this.panel.fontList = this.settings.panels.createCombobox(
		{
			id: 'fontList',
			label: atom.aozLang.getTerm( 'settings:editor-font' )//'Editor Font',
		}
	);
	
	this.panel.fontList.label.style.height = '24px';
	this.panel.fontList.input.style.height = '24px';
	this.panel.fontList.input.style.width = '70%';
	
	this.panel.fontList.fontSize = document.createElement( 'select' );
	this.panel.fontList.fontSize.setAttribute( 'id', 'fld_fontSize' );
	this.panel.fontList.appendChild( this.panel.fontList.fontSize );
	
	this.panel.fontList.fontSize.add( new Option( '8', 8 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '9', 9 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '10', 10 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '12', 12 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '14', 14 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '15', 15 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '16 (default)', 16 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '18', 18 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '20', 20 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '24', 24 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '28', 28 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '32', 32 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '36', 36 ), undefined );
	this.panel.fontList.fontSize.add( new Option( '40', 40 ), undefined );
	this.panel.appendChild( this.panel.fontList );
	var options = [
		new Option( "IBM Plex Mono (default)", "IBM Plex Mono" ),
		new Option( "Overpass Mono", "Overpass Mono" ),
		new Option( "Oxygen Mono", "Oxygen Mono" ),
		new Option( "PT Mono", "PT Mono" ),
		new Option( "Space Mono", "Space Mono" ),
		new Option( "Ubuntu Mono", "Ubuntu Mono" ),
		new Option( "A500 Mono", "Amiga Topaz" ),
        new Option( "Courier New", "Courier New")		
	];

	for( var f = 0; f < options.length; f++ )
	{
		this.panel.fontList.input.add( options[ f ], undefined );
	}
	
	this.panel.fontList.input.module = this;
	this.panel.fontList.input.addEventListener( 'change', function( event )
	{
		var font = this.value;
		var size = self.panel.fontList.fontSize.value;
		self.panel.textCode.style.fontFamily = font;
		self.panel.textCode.style.fontSize = size + 'px';
		self.panel.textCode.style.lineHeight = '' + ( size * 1.5 ) + 'px';
		self.fontChanged = true;
	}, false );
	
	this.panel.fontList.fontSize.addEventListener( 'change', function( event )
	{
		var font = self.panel.fontList.input.value;
		var size = this.value;
		self.panel.textCode.style.fontFamily = font;
		self.panel.textCode.style.fontSize = size + 'px';
		self.panel.textCode.style.lineHeight = '' + ( size * 1.5 ) + 'px';
		self.fontChanged = true;
	}, false );

	this.panel.textCode = document.createElement( 'div' );
	this.panel.textCode.setAttribute( 'id', 'textCode' );
	this.panel.textCode.setAttribute( 'class', 'atom-workspace font-preview' );
	this.panel.textCode.innerHTML = '<span class="syntax--comment">// Code example</span><br>';
	this.panel.textCode.innerHTML += '<span class="syntax--keyword syntax--control syntax--aoz">#manifest: </span>';
	this.panel.textCode.innerHTML += '<span class="syntax--string syntax--quoted syntax--double syntax--aoz">"aoz"</span><br>';
	this.panel.textCode.innerHTML += '<span class="syntax--keyword syntax--control syntax--aoz">#fullScreen: </span>';
	this.panel.textCode.innerHTML += '<span class="syntax--string syntax--language syntax--aoz">True</span><br>';
	this.panel.textCode.innerHTML += 'Screen Open 0, 320, 200, 32, Lowres : Curs Off : Flash Off : Cls 0<br>';
	this.panel.textCode.innerHTML += 'Wait Vbl';

	this.panel.appendChild( this.panel.textCode );
	
	this.fontChanged = false;
	this.panel.splash.input.checked = atom.aozConfig.aoz_settings.showSplash;
	this.panel.projects.input.checked = atom.aozConfig.aoz_settings.showProjects;
	this.panel.transpiler.input.checked = atom.aozConfig.aoz_settings.hideTranspiler;
	this.panel.viewerFP.input.checked = atom.aozConfig.aoz_settings.viewerFullPage;
	this.panel.showDoc.input.checked = atom.aozConfig.aoz_settings.showDoc;	
	this.panel.splash.input.checked = atom.aozConfig.aoz_settings.showSplash;
	
	for( i = 0; i < this.panel.fontList.input.options.length; i++ )
	{
		if( this.panel.fontList.input.options[ i ].value == atom.aozConfig.aoz_settings.fontName )
		{
			this.panel.fontList.input.selectedIndex = i;
			break;
		}
	}
	
	for( i = 0; i < this.panel.fontList.fontSize.options.length; i++ )
	{
		if( this.panel.fontList.fontSize.options[ i ].value == atom.aozConfig.aoz_settings.fontSize )
		{
			this.panel.fontList.fontSize.selectedIndex = i;
			break;
		}
	}
	
	var font = this.panel.fontList.input.value;
	var size = this.panel.fontList.fontSize.value;
	this.panel.textCode.style.fontFamily = font;
	this.panel.textCode.style.fontSize = size + 'px';
	this.panel.textCode.style.lineHeight = 'normal';	

	var newSize = size / 15.0; 							// BJF
	atom.config.set('editor.lineHeight',newSize+'%');	// BJF - adjust font-height for editor.

}; // install

SettingsDisplay.prototype.validation = function()
{
	var font = this.panel.fontList.input.value;
	var size = this.panel.fontList.fontSize.value;
	
	atom.aozConfig.aoz_settings.showSplash = this.panel.splash.input.checked;
	atom.aozConfig.aoz_settings.showProjects = this.panel.projects.input.checked;
	atom.aozConfig.aoz_settings.hideTranspiler = this.panel.transpiler.input.checked;
	atom.aozConfig.aoz_settings.viewerFullPage = this.panel.viewerFP.input.checked;
	atom.aozConfig.aoz_settings.showDoc = this.panel.showDoc.input.checked;	
	atom.aozConfig.aoz_settings.fontEditor = atom.aozConfig.aoz_settings.fontEditor;
	atom.aozConfig.aoz_settings.fontName = atom.aozConfig.aoz_settings.fontName;
	atom.aozConfig.aoz_settings.fontSize = atom.aozConfig.aoz_settings.fontSize;
	
	if( this.fontChanged )
	{
		var css = document.createElement( 'style' );
		css.innerHTML = 'atom-workspace { --editor-font-size: ' + size + 'px; --editor-font-family: "' + font + '"; --editor-line-height: "normal";}';

		var newSize = size / 15.0; 							// BJF
		atom.config.set('editor.lineHeight',newSize+'%');	// BJF adjust font height for editor.

		document.body.appendChild( css );		
		
		atom.aozConfig.aoz_settings.fontEditor = css.innerHTML;
		atom.aozConfig.aoz_settings.fontName = this.panel.fontList.input.value;
		atom.aozConfig.aoz_settings.fontSize = this.panel.fontList.fontSize.value;
	}	
	if( !atom.aozConfig.aoz_settings.showProjects )
	{
		atom.workspace.paneContainers.left.element.style.display = 'none';
	}
	else
	{
		atom.workspace.paneContainers.left.element.style.display = 'flex';
	}
	
	if( atom.aozConfig.aoz_settings.hideTranspiler )
	{
		var elm = document.getElementById( 'console_panel' );
		elm.style.display = 'none';
		elm.module.opened = false;
		atom.workspace.paneContainers.left.paneContainer.element.setAttribute( 'style', 'height: 100%' );
		atom.workspace.paneContainers.center.paneContainer.element.childNodes[ 0 ].setAttribute( 'style', 'height: 100%' );		
	}
	else
	{
		var elm = document.getElementById( 'console_panel' );
		elm.style.display = 'block';
		elm.module.opened = true;
		atom.workspace.paneContainers.left.paneContainer.element.setAttribute( 'style', 'height: ' + ( window.innerHeight - 220 ) + 'px' );
		atom.workspace.paneContainers.center.paneContainer.element.childNodes[ 0 ].setAttribute( 'style', 'height: ' + ( window.innerHeight - 268 ) + 'px' );
	}
}
module.exports = SettingsDisplay;
