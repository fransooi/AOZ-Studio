'use babel';

import setFontSize from './fonts/set-font-size';
import toggleClassName from './helper/toggle-class-name';
import './colors';
import './fonts';
import './tab-bar';
import './user-interface';

const PATH = require( 'path' );
const PANELS = require( '../../aoz-studio/lib/ui/panels' );
const SPLASH = require( '../../aoz-studio/lib/ui/splash' );
const AOZVERSION = require('../../aoz-studio/lib/aoz-version.js' );
const AOZIcons = require( '../../aoz-studio/lib/ui/aoz-icons' );
const AOZConfig = require( '../../aoz-studio/lib/aoz-config' );
const AOZThemeManager = require( '../../aoz-studio/lib/ui/aoz-theme-manager' );
const { execSync } = require( 'child_process' );

var splash = undefined;
var panels = undefined;

atom.workspace.element.style.visibility = 'hidden';
const classNames = {
    // Fonts
    'amu-paint-cursor': atom.config.get('atom-material-ui.colors.paintCursor'),

    // Tabs settings
    'amu-compact-tab-bar': atom.config.get('atom-material-ui.tabs.compactTabs'),
    'amu-no-tab-min-width': atom.config.get('atom-material-ui.tabs.noTabMinWidth'),
    'amu-tinted-tab-bar': atom.config.get('atom-material-ui.tabs.tintedTabBar'),
    'amu-stretched-tabs': atom.config.get('atom-material-ui.tabs.stretchedTabs'),

    // General UI settings
    'amu-use-animations': atom.config.get('atom-material-ui.ui.useAnimations'),
    'amu-panel-contrast': atom.config.get('atom-material-ui.ui.panelContrast'),
    'amu-panel-shadows': atom.config.get('atom-material-ui.ui.panelShadows'),
};

export default {
    activate() {
		document.title = "AOZ Studio";
        var cmdInstance = '';
		var numInstance = 0;
		if( process.platform == "win32" )
		{
			cmdInstance =  'tasklist';
		}
		
		if (process.platform == "darwin" )
		{
			cmdInstance = "ps -ax |grep aozstudio"
		}

		if( cmdInstance != '')
		{
			var result = execSync( cmdInstance );
			if( result )
			{
				if( process.platform == 'win32' )
				{
					var lines = result.toString().split( "\r\n" );
					for( var l = 0; l < lines.length; l++ )
					{
						if( lines[ l ].substring( 0, 13 ) == 'aozstudio.exe' )
						{
							numInstance++;
						}
					}
				}
				
				if( process.platform == 'darwin' )
				{
				}

				if( numInstance > 5 )
				{
					alert( "An other instance of AOZ Studio is opens." );
					atom.close();
					return;
				}
			}
		}
		atom.sep = PATH.sep;
		AOZVERSION.init();
		
		panels = new PANELS();
		splash = new SPLASH( panels );
		splash.show();
		document.title = 'Loading...';
		console.clear();
		
		setTimeout( function()
		{
			splash.checkIDELoaded();

			Object.keys(classNames).forEach(className => (
				toggleClassName(className, classNames[className])),
			);

			setFontSize(atom.config.get('atom-material-ui.fonts.fontSize'));
		}, 3000 );
		
    },

    deactivate() {
        // Reset all the things!
        Object.keys(classNames).forEach(className => toggleClassName(className, false));
        setFontSize(null);
    },
};
