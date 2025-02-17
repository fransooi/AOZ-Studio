var SettingsMisc = function( settings )
{
	this.settings = settings;
	this.panel = document.createElement( 'div' );
	this.panel.setAttribute( 'class', 'cat-panel' );
	
	this.item =
	{
		id: -1,
		icon: atom.IMAGES.ICON_MISC,
		title: atom.aozLang.getTerm( 'settings:misc' ),//'Miscellaneous',
		disabled: false
	};	
}

SettingsMisc.prototype.install = function()
{
	var self = this;
	this.panel.autocomplete = this.settings.panels.createCheckbox(
		{
			id: 'autocomplete',
			label: atom.aozLang.getTerm( 'settings:auto-completion' )//'Enable code editor auto-completion.',
		}
	);
	this.panel.appendChild( this.panel.autocomplete );

	this.panel.devMode = this.settings.panels.createCheckbox(
		{
			id: 'devMode',
			label: atom.aozLang.getTerm( 'settings:dev-mode' )//'Developer Mode',
		}
	);
	this.panel.appendChild( this.panel.devMode );

	this.panel.autoSave = this.settings.panels.createCheckbox(
		{
			id: 'autoSave',
			label: atom.aozLang.getTerm( 'settings:auto-save' )//'Enable Autosave',
		}
	);
	this.panel.appendChild( this.panel.autoSave );
	
	this.panel.autoUpdate = this.settings.panels.createCheckbox(
		{
			id: 'autoUpdate',
			label: atom.aozLang.getTerm( 'settings:auto-update' )//'Enable automatic update',
		}
	);
	this.panel.appendChild( this.panel.autoUpdate );
	
	this.panel.searchEngineList = this.settings.panels.createCombobox(
		{
			id: 'searchEngineList',
			label: atom.aozLang.getTerm( 'settings:search-engine' )//'Search Engine',
		}
	);
	this.panel.appendChild( this.panel.searchEngineList );
	var options = [
		new Option( "Ecosia (default)", "ecosia" ),
		new Option( "Duck Duck Go", "duckduckgo" ),
		new Option( "Google Search", "google" ),
		new Option( "Microsoft Bing", "bing" ),
		new Option( atom.aozLang.getTerm( 'settings:not-use-search-engine' ), "no-engine" )
	];

	for( var f = 0; f < options.length; f++ )
	{
		this.panel.searchEngineList.input.add( options[ f ], undefined );
	}
	
	this.panel.searchEngineList.input.module = this;

	var divInfoSE = document.createElement( 'div' );
	divInfoSE.setAttribute( 'style', 'position: relative; width: 100%; height: 128px; border: 1px var( --primary-dark-bg-orange ) solid; padding: 8px; color: var( --primary-dark-bg-white )' );
	this.panel.appendChild( divInfoSE );
	
	var textSE = 
	{
		'ecosia': atom.aozLang.getTerm( 'settings:ecosia' ),
		'duckduckgo': atom.aozLang.getTerm( 'settings:duck-duck-go' ),
		'google': atom.aozLang.getTerm( 'settings:google' ),
		'bing': atom.aozLang.getTerm( 'settings:bing' ),
		'no-engine': atom.aozLang.getTerm( 'settings:no-search-engine' ),
	}

	this.panel.searchEngineList.input.addEventListener( 'change', function( event )
	{
		divInfoSE.innerHTML = textSE[ this.value ];
	}, false );

	this.panel.autocomplete.input.checked = atom.aozConfig.aoz_settings.autocomplete;
//	this.panel.discord.input.checked = atom.aozConfig.aoz_settings.discord;	
	this.panel.devMode.input.checked = atom.aozConfig.aoz_settings.developperMode;
	this.panel.autoSave.input.checked = atom.aozConfig.aoz_settings.autosave;
	this.panel.autoUpdate.input.checked = atom.aozConfig.aoz_settings.autoupdate;
	this.panel.searchEngineList.input.value = atom.aozConfig.aoz_settings.searchengine;
}

SettingsMisc.prototype.validation = function()
{
	atom.aozConfig.aoz_settings.autocomplete = this.panel.autocomplete.input.checked;
	// FLTOBP was crashing: atom.aozConfig.aoz_settings.discord = this.panel.discord.input.checked;
	atom.aozConfig.aoz_settings.developperMode = this.panel.devMode.input.checked;
	atom.aozConfig.aoz_settings.autosave = this.panel.autoSave.input.checked;
	atom.aozConfig.aoz_settings.autoupdate = this.panel.autoUpdate.input.checked;
	atom.aozConfig.aoz_settings.searchengine = this.panel.searchEngineList.input.value;
	
	var css = document.createElement( 'style' );
	if( !atom.aozConfig.aoz_settings.autocomplete )
	{
		css.innerHTML = ".autocomplete-plus { display: none }";
		atom.config.settings[ 'autocomplete-plus' ] =
		{
			enableAutoActivation: false
		};
		atom.packages.activePackages["autocomplete-plus"].deactivate();		
	}
	else
	{
		css.innerHTML = ".autocomplete-plus { display: block }";
		atom.config.settings[ 'autocomplete-plus' ] =
		{
			enableAutoActivation: true
		};
		atom.packages.activePackages["autocomplete-plus"].activate();
	}

	atom.config.save();

	if( !atom.aozConfig.aoz_settings.autosave )
	{
		atom.config.settings.autosave.enabled = false;
	}
	else
	{
		atom.config.settings.autosave.enabled = true;
	}
	
	if( atom.aozConfig.aoz_settings.autoupdate )
	{
		atom.aozUpdater.checkUpdate();
	}
}

module.exports = SettingsMisc;
