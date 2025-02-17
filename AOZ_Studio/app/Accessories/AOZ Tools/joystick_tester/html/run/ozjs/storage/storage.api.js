function writeLocalStorage( name, strValue, numValue )
{
    storage_write( 0, name, strValue, numValue );
} 

function writeSessionStorage( name, strValue, numValue )
{
    storage_write( 1, name, strValue, numValue );
}

function readLocalStorage( name )
{
    return storage_read( 0, name );
} 

function readSessionStorage( name )
{
    return storage_read( 1, name );
}

function localExists( name )
{
    return storage_exists( 0, name );
} 

function sessionExists( name )
{
    return storage_exists( 1, name );
} 

function deleteLocalStorage( name )
{
    storage_delete( 0, name );
} 

function deleteSessionStorage( name )
{
    storage_delete( 1, name );
}

function clearLocalStorage()
{
    storage_clear( 0 );
} 

function clearSessionStorage()
{
    storage_clear( 1 );
}