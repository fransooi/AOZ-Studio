const FS = require('fs');
const PATH = require( 'path' );

class AOZLang
{
    terms = undefined;
    lang = undefined;

    constructor()
    {
        if( atom.aozConfig && atom.aozConfig.aoz_settings && atom.aozConfig.aoz_settings.lang )
        {
            this.lang = atom.aozConfig.aoz_settings.lang;
        }
        else
        {
            this.lang = this.getOSLang();
        }
        this.setLang( this.lang );
    }

    getOSLang()
    {
		return navigator.language;
    }

    getTerm( index )
    {
        if( this.terms && this.terms[ index ] )
        {
            return this.terms[ index ];
        }
        else
        {
            return "*" + index;
        }
    }

    setLang( lang )
    {
        if( lang == undefined || lang == '' )
        {
            lang = this.getOSLang();
        }

        if( lang )
        {
            lang = lang.substring( 0, 2 );
        }
        
        if( !FS.existsSync( atom.aozConfig.installInformation.packagePath  + PATH.sep + 'lang' + PATH.sep + 'locale' + PATH.sep + lang + '.json' ) )
        {
            lang = 'en';
        }

        try
        {
            var self = this;
            var json = atom.systemAPI.loadJSON( atom.aozConfig.installInformation.packagePath  + PATH.sep + 'lang' + PATH.sep + 'locale' + PATH.sep + lang + '.json' );
            this.terms = json.terms;
        }
        catch( err )
        {
            console.warn( err );
            lang = 'en';
            this.setLang( lang );
        }
    }

    updateMenus()
    {
        var txt = "";
        if( atom.packages && atom.packages.contextMenuManager && atom.packages.contextMenuManager.itemSets )
        {
            for( var m = 0; m < atom.packages.contextMenuManager.itemSets.length; m++ )
            {
                if( atom.packages.contextMenuManager.itemSets[ m ].items )
                {
                    for( var mm = 0; mm < atom.packages.contextMenuManager.itemSets[ m ].items.length; mm++ )
                    {
                        if( atom.packages.contextMenuManager.itemSets[ m ].items[ mm ].command )
                        {
                            txt = txt + "\"" + atom.packages.contextMenuManager.itemSets[ m ].items[ mm ].command + "\": \"" + atom.packages.contextMenuManager.itemSets[ m ].items[ mm ].label + "\"\r\n";
                            atom.packages.contextMenuManager.itemSets[ m ].items[ mm ].label = this.getTerm( atom.packages.contextMenuManager.itemSets[ m ].items[ mm ].command );
                        }
                    }
                }
            }
        }
    }
}
module.exports = AOZLang;