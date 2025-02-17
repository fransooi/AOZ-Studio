const FS = require( 'fs' );
const PATH = require( 'path' );
const HJSON = require( 'hjson' );
const REMOTE = require( 'electron' ).remote;
const BrowserWindow = REMOTE.BrowserWindow;
const SystemAPI = require( '../system-api.js' );

var AOZAccessories = 
{
    popupOpened: false,
    popupPanel: undefined,
    showPopup: function()
    {
        if( AOZAccessories.popupPanel == undefined )
        {
            AOZAccessories.popupPanel = document.createElement( 'div' );
            AOZAccessories.popupPanel.setAttribute( 'id', 'accPanel' );
                        
            // Load Accessories infos
            AOZAccessories.popupPanel.innerHTML = '';
            var accList = AOZAccessories.getList();

            if( accList && accList.length > 0 )
            {
                for( var l = 0; l < accList.length; l++ )
                {
                    var json = AOZAccessories.getAccessoryInfos( accList[ l ] );
                    if( json )
                    {
                        var img = document.createElement( 'img' );
                        img.setAttribute( 'src', json.infos.icon );
                        img.setAttribute( 'alt', json.infos.name );
                        img.setAttribute( 'title', json.infos.name );
                        img.json = json;
                        img.accFile = accList[ l ];
                        img.addEventListener( 'click', function()
                        {
                            AOZAccessories.openAccessory( this.accFile );
                            AOZAccessories.popupOpened = false;
                            AOZAccessories.popupPanel.style.display = 'none';
                        }, false );
                        AOZAccessories.popupPanel.appendChild( img );
                    }
                }
            }

            document.body.appendChild( AOZAccessories.popupPanel );        
        }

        if( AOZAccessories.popupOpened )
        {
            AOZAccessories.popupOpened = false;
            AOZAccessories.popupPanel.style.display = 'none';
            return;            
        }
        
        AOZAccessories.popupOpened = true;
        AOZAccessories.popupPanel.style.display = 'block';        
    },

    getList: function( path, list )
    {
        if( path == undefined )
        {
            path = atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'Accessories';
        }

        if( list == undefined )
        {
            list = [];
        }

        if( FS.existsSync( path ) )
        {
            var tree = SystemAPI.readDirectory( path, { recursive: true } );
            if( tree )
            {
                for( var t = 0; t < tree.length; t++ )
                {
                    var item = tree[ t ];
                    if( !item.isDirectory )
                    {
                        if( PATH.extname( item.name ).toLowerCase() == '.aozacclnk' )
                        {
                            list.push( path + PATH.sep + item.name );
                        }
                    }
                    else
                    {
                       list = AOZAccessories.getList( path + PATH.sep + item.name, list );
                    }						
                }
            }
        }
        return list;
    },

    openAccessory: function( path )
    {
        var json = AOZAccessories.getAccessoryInfos( path );

		var x = json.infos.width;
		var y = json.infos.height;
		var width = 800;
		var height = 500;
        var configId = '"' + path + '"';
        var info = atom.aozConfig.aoz_settings.windowPositions[ configId ];
        if ( info )
        {
            x = info.x;
            y = info.y;
            width = info.width;
            height = info.height;
        }

        var win = new BrowserWindow( { title: json.infos.name, resizable: true, moveable: true, x: x, y: y, width: width, height: height, show: false, icon: json.infos.icon } );
        win.removeMenu();

        if( json.infos.path.indexOf( 'http' ) == 0 )
        {
            win.loadURL( json.infos.path, { userAgent: 'AOZViewer' } );
        }
        else
        {
            win.loadFile( json.infos.path, { userAgent: 'AOZViewer' }  );
        }

		var handle = setInterval( function()
		{
			atom.aozConfig.aoz_settings.windowPositions[ configId ] = win.getBounds();
		}, 1000 );

        win.once( 'ready-to-show', () => {
            win.show();
            if( win.webContents && win.webContents.application && win.webContents.application.aoz )
            {
                win.webContents.application.atom = atom;
            }
            win.setTitle( json.infos.name );
        } );
        win.once( 'close', ( event ) => {
            clearInterval( handle );		
        } );	

    },

    getAccessoryInfos: function ( path )
    {
        try
        {
            var data = FS.readFileSync( path, 'utf8' );
            if ( data )
            {
                var json = undefined;
                try
                {
                    json = HJSON.parse( data.toString() );

                    if( json )
                    {
                        if( json.infos )
                        {
                            json.infos.path = json.infos.path.strReplace( '#accessories#', atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'Accessories' );
                            json.infos.path = json.infos.path.strReplace( '#tools#', atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'tools' );
                        }

                        if( json.infos.width )
                        {
                            json.infos.width = json.infos.width;
                            if( isNaN( json.infos.width ) ) json.infos.width = 800;
                        }

                        if( json.infos.height )
                        {
                            json.height = json.infos.height;
                            if( isNaN( json.infos.height ) ) json.infos.height = 600;
                        }

                        if( json.infos.icon )
                        {
                            json.infos.icon = atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'utilities' + PATH.sep + 'accicons' + PATH.sep + json.infos.icon;
                        }
                    }
                    return json;
                }
                catch( e ) {
                    console.log( e );
                    return;
                }
           }
        }
        catch( e )
        {
            console.log( e );
        }
    }
}
module.exports = AOZAccessories;