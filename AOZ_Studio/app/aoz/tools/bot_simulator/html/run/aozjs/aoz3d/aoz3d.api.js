function _screen_3d_open( options )
{
    if( options.index == undefined || options.index.trim() == '' )
    {
        throw "3d_screen_id_not_defined";
    }

    if( options.sceneId == undefined || options.sceneId.trim() == '' )
    {
        throw "3d_scene_not_defined";
    }

    if( options.x == -1 )
    {
        options.x = 0;
    }

    if( options.y == -1 )
    {
        options.y = 0;
    }

    if( options.width == -1 )
    {
        options.width = application.aoz.manifest.display.width;
    } 

    if( options.height == -1 )
    {
        options.height = application.aoz.manifest.display.height;
    } 

    _td_screen3dOpen( options.index, options.sceneId, options.x, options.y, options.width, options.height, options.effect );   
}

function _start_3d()
{
    _td_start_3d();
}

function _stop_3d()
{
    _td_stop_3d();
}

function _screen_3d_update( screenId )
{
    _td_update3DScreen( screenId );
}

function _set_background_3d( image )
{
    _td_set_background_3d( image );
}

function _copy_3d( source, copy )
{
    _td_copy_3d( source, copy );
}

function _add_3d_group( parent, name )
{
    _td_group_3d( parent, name );
}

function _td_visible( name, visible )
{
    _td_object_3d_visible( name, visible );
}

function _add_3d_box( objName, parentName, image, w, h, d, color, repX, repY )
{
    _td_box_3d( objName, parentName, image, w, h, d, color, repX, repY );
}

function _add_3d_sphere( objName, parentName, image, radius, color, repX, repY )
{
    _td_sphere_3d( objName, parentName, image, radius, color, repX, repY );
}

function _add_3d_cone( objName, parentName, image, radius, height, color, repX, repY )
{
    _td_cone_3d( objName, parentName, image, radius, height, color, repX, repY );
}

function _add_3d_plane( objName, parentName, image, width, height, color, repX, repY )
{
    _td_plane_3d( objName, parentName, image, width, height, color, repX, repY );
}

function _add_3d_plane( objName, parentName, image, radiusTop, radiusBottom, height, filled, color, repX, repY )
{
    _td_cylinder_3d( objName, parentName, image, radiusTop, radiusBottom, height, filled, color, repX, repY )
}

function _move_3d( name, x, y, z )
{
    _td_move_3d( name, x, y, z );
}

function _rotate_3d( name, x, y, z )
{
    _td_rotate_3d( name, x, y, z );
}

function _scale_3d( name, x, y, z )
{
    _td_scale_3d( name, x, y, z );
}

function _backward_3d( name, speed )
{
    _td_backward_3d( name, speed );
}

function _foreward_3d( name, speed )
{
    _td_foreward_3d( name, speed );
}

function _delete_3d( name, _parent )
{
    _td_delete_3d( name, _parent );
}

function _set_3d_camera( camera )
{
    _td_set_3d_camera( camera );
}