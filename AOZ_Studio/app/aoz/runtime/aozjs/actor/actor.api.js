function Actor( properties )
{
	set_actor( properties );
}

function Actor_Alpha( index )
{
	return actor_getValue( index, "alpha" );
}

function Actor_Angle( index )
{
	return actor_getValue( index, "angle" );
}

function Actor_Anim( index )
{
	return actor_getValue( index, "anim" );
}

function Actor_Anim_Frame( index )
{
	return actor_getValue( index, "frame" );
}

function Actor_Col( options )
{
	return actor_col( options );
}

function Actor_Del( index )
{
	return actor_delete( index );
}

function Actor_Exists( index )
{
	return actor_getValue( index, "exists" );
}

function Actor_Group( index )
{
	return actor_getValue( index, "group" );
}

function Actor_Height( index )
{
	return actor_getValue( index, "height" );
}

function Actor_Image( index )
{
	return actor_getValue( index, "image" );
}

function Actor_IsEnable( index )
{
	return actor_getValue( index, "enable" );
}

function Actor_IsHRev( index )
{
	return actor_getValue( index, "hrev" );
}

function Actor_IsVisible( index )
{
	return actor_getValue( index, "visible" );
}

function Actor_IsVRev( index )
{
	return actor_getValue( index, "vrev" );
}

function Actor_Reset( index )
{
	actor_reset( index );
}

function Actor_ScaleX( index )
{
	return actor_getValue( index, "scalex" );
}

function Actor_ScaleY( index )
{
	return actor_getValue( index, "scaley" );
}

function Actor_SkewX( index )
{
	return actor_getValue( index, "skewx" );
}

function Actor_SkewY( index )
{
	return actor_getValue( index, "skewy" );
}

function Actor_Width( index )
{
	return actor_getValue( index, "width" );
}

function Actor_X( index )
{
	return actor_getValue( index, "x" );
}

function Actor_Y( index )
{
	return actor_getValue( index, "y" );
}

function Actor_Z( index )
{
	return actor_getValue( index, "z" );
}

function Actor_UserData( index )
{
	return actor_getValue( index, "userdata" );
}

function Mouse_On_Actor( )
{
	return actor_module.mouseOnActor;
}

function Reset_Actor( index )
{
	actor_reset( index );
}

function Set_Gravity( options )
{
	actor_setGravity( options );	
}

function Show_Physic_Bodies()
{
	actor_module.physicWireframe = true;	
}

function Hide_Physic_Bodies()
{
	actor_module.physicWireframe = false;	
}

function Actor_animation( options )
{
	actor_animation( options );
}

function Actor_behavior( options )
{
	actor_behavior( options );
}
