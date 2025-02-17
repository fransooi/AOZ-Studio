function Show_HTML( index, insertImages, _args )
{
	aozhtml_showHTML( index, insertImages, _args );
}

function HTML_Element( properties )
{
	aozhtml_htmlElement( properties );
}

function HTML_Element_Attribute( index, attribute, asType )
{
	return aozhtml_htmlElementAttribute( index, attribute, asType );
}

function HTML_Code( index, insertImages, _args )
{
	return aozhtml_htmlCode( index, insertImages, _args )
}

function JS_Execute( jsCode )
{
	aozhtml_JSExecute( jsCode );
}
