const ELECTRON = require( 'electron' );
const REMOTE = ELECTRON.remote;
const DIALOG = REMOTE.dialog;

function openFileDialog( options, cb, bySocket )
{
    var files = DIALOG.showOpenDialogSync( REMOTE.getCurrentWindow(), options.options );
    if( bySocket )
    {
        cb(	
        {
            error: false,
            event: 'onselect',
            files: files
        } );        
    }
    else
    {
        return files;
    }
}
exports.openFileDialog = openFileDialog;

function saveFileDialog( options, cb, bySocket )
{
    var files = DIALOG.showSaveDialogSync( REMOTE.getCurrentWindow(), options.options );
    if( bySocket )
    {
        cb(	
        {
            error: false,
            event: 'onselect',
            files: files
        } );        
    }
    else
    {
        return files;
    }
}
exports.saveFileDialog = saveFileDialog;

function openDirectoryDialog( options, cb, bySocket )
{
    var files = DIALOG.showOpenDialogSync( REMOTE.getCurrentWindow(), options.options );
    if( bySocket )
    {
        cb(	
        {
            error: false,
            event: 'onselect',
            files: files
        } );        
    }
    else
    {
        return files;
    }
}
exports.openDirectoryDialog = openDirectoryDialog;