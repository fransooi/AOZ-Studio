var _storage_module;

function storage_initialize( module )
{
    _storage_module = module;
}

function storage_write( type, name, strValue, numValue )
{

    if( type == 0 )
    {
        if( strValue != "-1000.001" )
        {
            localStorage.setItem( name, strValue );
            return;
        }

        if( numValue != -1000.001 )
        {
            localStorage.setItem( name, numValue );
            return;
        }        
    }

    if( type == 1 )
    {
        if( strValue != "-1000.001" )
        {
            sessionStorage.setItem( name, strValue );
            return;
        }

        if( numValue != -1000.001 )
        {
            sessionStorage.setItem( name, numValue );
            return;
        }        
    }

}

function storage_read( type, name )
{
    var value;
    if( type == 0 )
    {
        value = localStorage.getItem( name );
        if( value == null )
        {
            throw "value_not_found_in_local_storage";
        }
        return value;
    }

    if( type == 1 )
    {
        value = sessionStorage.getItem( name );
        if( value == null )
        {
            throw "value_not_found_in_session_storage";
        }
        return value;
    }

}

function storage_exists( type, name )
{
    var value;
    if( type == 0 )
    {
        value = localStorage.getItem( name );
        if( value == null )
        {
            return false;
        }
        return true;
    }

    if( type == 1 )
    {
        value = sessionStorage.getItem( name );
        if( value == null )
        {
            return false;
        }
        return true;
    }
}

function storage_delete( type, name )
{
    var value;
    if( type == 0 )
    {
        value = localStorage.getItem( name );
        if( value == null )
        {
            throw "value_not_found_in_local_storage";
        }
        localStorage.removeItem( name );
    }

    if( type == 1 )
    {
        value = sessionStorage.getItem( name );
        if( value == null )
        {
            throw "value_not_found_in_session_storage";
        }
        sessionStorage.removeItem( name );
    }
}

function storage_clear( type )
{
    if( type == 0 )
    {
        localStorage.clear();
    }

    if( type == 1 )
    {
        sessionStorage.clear();
    }
}

