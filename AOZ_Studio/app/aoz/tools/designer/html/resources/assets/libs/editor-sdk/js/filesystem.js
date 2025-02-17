application.editorSDK.filesystem = 
{
    readFile: function( fileName )
    {
        application.root.vars.FS_BUFFER$ = '';
        application.root.vars.FS_ERROR = false;        
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        var result =  window.parent.atom.editorSDK.filesystem.readFile( fileName );
        if( result )
        {
            application.root.vars.FS_BUFFER$ = result.toString();
            return;
        }
        application.root.vars.FS_ERROR = true;
        return '';
    },

    writeFile: function( fileName, data )
    {
        application.root.vars.FS_ERROR = false;        
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_ERROR =! window.parent.atom.editorSDK.filesystem.writeFile( fileName, data );
    },

    removeFile: function( fileName )
    {
        application.root.vars.FS_ERROR = false;        
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_ERROR = !window.parent.atom.editorSDK.filesystem.removeFile( fileName )
    },

    renameFile: function( path, newName )
    {
        application.root.vars.FS_ERROR = false;        
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_ERROR = !window.parent.atom.editorSDK.filesystem.renameFile( oldPath, newName );
    },

    copyFile: function( source, path )
    {
        application.root.vars.FS_ERROR = false;        
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_ERROR = !window.parent.atom.editorSDK.filesystem.copyFile( source, path );
    },

    existsFile: function( fileName )
    {
        application.root.vars.FS_EXISTS = false;
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_EXIST = window.parent.atom.editorSDK.filesystem.existsFile( fileName );
    },

    extname: function( fileName )
    {
        application.root.vars.FS_EXT$ = '';
        application.root.vars.FS_ERROR = false;
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        var result = window.parent.atom.editorSDK.filesystem.extname( fileName );
        if( result )
        {
            application.root.vars.FS_EXT$ = result;
            return;
        }
        application.root.vars.FS_ERROR = true;
        return '';         
    },

    canRead: function( fileName )
    {
        application.root.vars.FS_CANREAD = false;
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_CANREAD = window.parent.atom.editorSDK.filesystem.canRead( fileName );
    },                  

    canWrite: function( fileName )
    {
        application.root.vars.FS_CANWRITE = false;
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.FS_CANREAD = window.parent.atom.editorSDK.filesystem.canWrite( fileName );
    }                 
};