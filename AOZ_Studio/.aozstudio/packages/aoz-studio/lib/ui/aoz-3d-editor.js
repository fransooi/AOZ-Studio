const AOZConfig = require( './../aoz-config' );
const PATH = require( 'path' );
const FS = require( 'fs' );
const ELECTRON = require( 'electron' );
const REMOTE = ELECTRON.remote;
const BrowserWindow = REMOTE.BrowserWindow;
const liveServer = require("live-server");

var AOZ3DEditor = 
{
    win: undefined,
    server: liveServer,
    show: function( path )
    {
        var self = this;
        if( this.win == undefined )
        {
            var params = {
                port: 7654, // Set the server port. Defaults to 8080.
                host: "127.0.0.1", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
                root: atom.aozConfig.installInformation.commonPath + "/app/aoz/tools/3d-editor", // Set root directory that's being served. Defaults to cwd.
                open: false, // When false, it won't load your browser by default.
                file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
                wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
                logLevel: 2 // 0 = errors only, 1 = some, 2 = lots
            };
            this.server.start( params );

            this.win = new BrowserWindow( 
            { 
                parent: atom.currentWindow,
                title: 'AOZ 3D Scene Editor',
                resizable: true,
                moveable: true,
                width: 800,
                height: 600,
                show: true,
                icon: atom.aozConfig.installInformation.commonPath + '/app/aoz/utilities/accicons/3d-editor.png',
                webPreferences:
                {
                    devTools: true,
                    webSecurity: false,
                    allowRunningInsecureContent: true			
                }
            } );

            this.win.on( 'close', function( e )
            {
                e.preventDefault();
                self.server.shutdown();
                self.win = undefined;
            } );
        
            this.win.removeMenu();
            this.win.loadURL ( 'http://127.0.0.1:7654?path=' + encodeURI( path ), { userAgent: 'AOZViewer' } );            
        }

    }
};
module.exports = AOZ3DEditor;