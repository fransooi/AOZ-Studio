function unityInit( args )
{
    _unity_ext.init( args );
}

function unityGameObject( options )
{
    _unity_ext.updateGameObject( options );
}

function unitySetCamera( cameraName )
{
    _unity_ext.setCamera( cameraName );
}

function unityGameObjectInfos( name )
{
    _unity_ext.getGameObjectInfos( name );
}

function unityGameObjectX( name )
{
    if( _unity_ext._gameObjects[ name ] )
    {
        return _unity_ext._gameObjects[ name ].position.x;
    }
    return 0.0;
}

function unityGameObjectY( name )
{
    if( _unity_ext._gameObjects[ name ] )
    {
        return _unity_ext._gameObjects[ name ].position.y;
    }
    return 0.0;
}

function unityGameObjectZ( name )
{
    if( _unity_ext._gameObjects[ name ] )
    {
        return _unity_ext._gameObjects[ name ].position.z;
    }
    return 0.0;
}

function unitySetScene( name )
{
   _unity_ext.setScene( name );
}