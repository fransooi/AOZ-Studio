application.editorSDK =
{
	busy: function( value )
	{
		application.root.vars.SDK_BUSY = value;
	},

	inEditor: function()
	{
		if( window.parent && window.parent.atom && window.parent.atom.editorSDK )
		{
			return true;
		}
		else
		{
			return false;
		}
	}
};
