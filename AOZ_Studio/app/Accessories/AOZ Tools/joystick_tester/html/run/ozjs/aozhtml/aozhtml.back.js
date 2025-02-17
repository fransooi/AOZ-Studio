String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}
	return newStr;
};

var aozhtml_module = undefined;

function aozhtml_initialize( module )
{
	aozhtml_module = module;

	var elm = document.createElement( 'div' );
	elm.setAttribute( 'id', 'aoz_html_content' );
	elm.setAttribute( 'width', '100%' );
	document.body.appendChild( elm );

	aozhtml_module.elmOptions = {};
	var self = aozhtml_module;
	
	//document.onkeydown = undefined;
	//document.onkeyup = undefined;

	window.addEventListener( 'resize', function( event )
	{
		aozhtml_resize( event );
	}, false );
};

function aozhtml_resize( event )
{
};

function aozhtml_htmlElementAttribute( index, attributeName, asType )
{
	if( index == undefined || index == '' )
	{
		throw "html_element_index_missing";
	}

	value = null;

	if( attributeName == undefined || attributeName == '' )
	{
		throw "attribute_name_missing";
	}

	var elm = document.getElementById( index );
	if( elm == undefined )
	{
		throw "html_element_not_found";
	}
	
	if( attributeName.toLowerCase() == 'content' && elm.innerHTML != undefined )
	{
		value = elm.innerHTML;
		asType = 'string';
	}

	if( attributeName.toLowerCase() == 'value' && elm.value != undefined )
	{
		value = elm.value;
	}

	if( attributeName.toLowerCase() == 'checked' && elm.checked != undefined )
	{
		value = elm.checked;
	}

	if( value == null )
	{
		if( !elm.hasAttribute( attributeName.toLowerCase() ) )
		{
			throw "attribute_not_found";
		}

		value = elm.getAttribute( attributeName.toLowerCase() );
	}

	if( asType == 'string' )
	{
		return '' + value;
	}
	else
	{
		if( asType == 'int' )
		{
			if( value == 'yes' || value == 'true' || value == true )
			{
				return true;
			}

			if( value == 'no' || value == 'false' || value == false )
			{
				return false;
			}

			value = parseInt( value );
			if( isNaN( value ) )
			{
				throw "attribute_value_is_not_a_number"
			}
		}

		if( asType == 'float' )
		{
			value = parseFloat( value );
			if( isNaN( value ) )
			{
				throw "attribute_value_is_not_a_float"
			}
		}
		return value;
	}
}

function aozhtml_showHTML( index, insertImages, _args )
{
	if( index == undefined || ( isNaN( index ) && index == '' ) )
	{
		throw "html_index_missing";
	}

	var html = undefined;
	if( application.aoz.ASSET && application.aoz.ASSET.arrHTML )
	{
		if( application.aoz.ASSET.arrHTML[ 'html_' + index ] == undefined )
		{
			throw "html_index_not_found";
		}
		html = application.aoz.ASSET.arrHTML[ 'html_' + index ];
	}
	else
	{
		if( application.aoz.ASSET.arrHTML[ 'html_' + index ] == undefined )
		{
			throw "html_index_not_found";
		}
	}

	var elm = document.getElementById( 'aoz_html_content' );
	if( elm == undefined )
	{
		elm = document.createElement( 'div' );
		elm.setAttribute( 'id', 'aoz_html_content' );
		elm.setAttribute( 'width', '100%' );
		document.body.appendChild( elm );
	}
	html = aozhtml_insertResources( html, insertImages, _args );
	elm.innerHTML = html;

	if( document.getElementById( 'AOZCanvas' ) != undefined )
	{
		document.getElementById( 'AOZCanvas' ).style.display = 'none';
	}
};

function aozhtml_htmlElement( options )
{
	var self = aozhtml_module;
	if( options == undefined )
	{
		throw "html_element_options_missing";
	}

	var elm = document.getElementById( options.index );
	if( elm == undefined )
	{
		throw "html_element_not_found";
	}

	var param = self.elmOptions[ 'elm_' + options.index ];
	if( param == undefined )
	{
		param =
		{
			index: options.index,
			focus: true,
			visible: true,
			enable: true,
			className: '',
			content: '',
			style: '',
			checked: false,
			value: '',
			events:
			{
				onFocus: undefined,
				onBlur: undefined,
				onClick: undefined,
				onDoubleClick: undefined,
				onMouseDown: undefined,
				onMouseUp: undefined,
				onMouseMove: undefined,
				onMouseEnter: undefined,
				onMouseOver: undefined,
				onMouseOut: undefined,
				onKeyPress: undefined,
				onKeyDown: undefined,
				onKeyUp: undefined
			},
			position: '',
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1
		};
	}
	var self  = self;

	//
	// Focus & Blur
	//
	if( options.onFocus != undefined && options.onFocus != '' )
	{
		if( param.onFocus && param.onFocus != options.onFocus )
		{
			if( param.events && param.events.onFocus )
			{
				elm.removeEventListener( 'focus', param.events.onFocus );
			}
		}

		param.events.onFocus = function( event )
		{
			application.aoz.runProcedure( options.onFocus, { EVENT$: event.type, INDEX$: options.index } );
		}
		elm.addEventListener( 'focus', param.events.onFocus, false );
	}

	if( options.onBlur != undefined && options.onBlur != '' )
	{
		if( param.onBlur && param.onBlur != options.onBlur )
		{
			if( param.events && param.events.onBlur )
			{
				elm.removeEventListener( 'blur', param.events.onBlur );
			}
		}

		param.events.onBlur = function( event )
		{
			application.aoz.runProcedure( options.onBlur, { EVENT$: event.type, INDEX$: options.index } );
		}
		elm.addEventListener( 'blur', param.events.onBlur, false );
	}

	//
	// Mouse Events
	//
	if( options.onClick != undefined && options.onClick != '' )
	{
		if( param.onClick && param.onClick != options.onClick )
		{
			if( param.events && param.events.onClick )
			{
				elm.removeEventListener( 'click', param.events.onClick );
			}
		}

		param.events.onClick = function( event )
		{
			application.aoz.runProcedure( options.onClick, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'click', param.events.onClick, false );
	}

	if( options.onDoubleClick != undefined && options.onDoubleClick != '' )
	{
		if( param.onDoubleClick && param.onDoubleClick != options.onDoubleClick )
		{
			if( param.events && param.events.onDoubleClick )
			{
				elm.removeEventListener( 'dblclick', param.events.onDoubleClick );
			}
		}

		param.events.onDoubleClick = function( event )
		{
			application.aoz.runProcedure( options.onDoubleClick, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'dblclick', param.events.onDoubleClick, false );
	}

	if( options.onMouseDown != undefined && options.onMouseDown != '' )
	{
		if( param.onMouseDown && param.onMouseDown != options.onMouseDown )
		{
			if( param.events && param.events.onMouseDown )
			{
				elm.removeEventListener( 'mousedown', param.events.onMouseDown );
			}
		}

		param.events.onMouseDown = function( event )
		{
			application.aoz.runProcedure( options.onMouseDown, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mousedown', param.events.onMouseDown, false );
	}

	if( options.onMouseUp != undefined && options.onMouseUp != '' )
	{
		if( param.onMouseUp && param.onMouseUp != options.onMouseUp )
		{
			if( param.events && param.events.onMouseUp )
			{
				elm.removeEventListener( 'mouseup', param.events.onMouseUp );
			}
		}

		param.events.onMouseUp = function( event )
		{
			application.aoz.runProcedure( options.onMouseUp, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mouseup', param.events.onMouseUp, false );
	}

	if( options.onMouseMove != undefined && options.onMouseMove != '' )
	{
		if( param.onMouseMove && param.onMouseMove != options.onMouseMove )
		{
			if( param.events && param.events.onMouseMove )
			{
				elm.removeEventListener( 'mousemove', param.events.onMouseMove );
			}
		}

		param.events.onMouseMove = function( event )
		{
			application.aoz.runProcedure( options.onMouseMove, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mousemove', param.events.onMouseMove, false );
	}

	if( options.onMouseOver != undefined && options.onMouseOver != '' )
	{
		if( param.onMouseOver && param.onMouseOver != options.onMouseOver )
		{
			if( param.events && param.events.onMouseOver )
			{
				elm.removeEventListener( 'mouseover', param.events.onMouseOver );
			}
		}

		param.events.onMouseOver = function( event )
		{
			application.aoz.runProcedure( options.onMouseOver, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mouseover', param.events.onMouseOver, false );
	}

	if( options.onMouseEnter != undefined && options.onMouseEnter != '' )
	{
		if( param.onMouseEnter && param.onMouseEnter != options.onMouseEnter )
		{
			if( param.events && param.events.onMouseEnter )
			{
				elm.removeEventListener( 'mouseenter', param.events.onMouseEnter );
			}
		}

		param.events.onMouseEnter = function( event )
		{
			application.aoz.runProcedure( options.onMouseEnter, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mouseenter', param.events.onMouseEnter, false );
	}

	if( options.onMouseOut != undefined && options.onMouseOut != '' )
	{
		if( param.onMouseOut && param.onMouseOut != options.onMouseOut )
		{
			if( param.events && param.events.onMouseOut )
			{
				elm.removeEventListener( 'mouseout', param.events.onMouseOut );
			}
		}

		param.events.onMouseOut = function( event )
		{
			application.aoz.runProcedure( options.onMouseOut, { EVENT$: event.type, INDEX$: options.index, X: event.clientX, Y: event.clientY, PAGEX: event.pageX, PAGEY: event.pageY, SCREENX: event.screenX, SCREENY: event.screenY, OFFSETX: event.offsetX, OFFSETY: event.offsetY, BUTTON: event.button, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'mouseout', param.events.onMouseOut, false );
	}

	//
	// Keyboard Events
	//
	if( options.onKeyPress != undefined && options.onKeyPress != '' )
	{
		if( param.onKeyPress && param.onKeyPress != options.onKeyPress )
		{
			if( param.events && param.events.onKeyPress )
			{
				elm.removeEventListener( 'keypress', param.events.onKeyPress );
			}
		}

		param.events.onKeyPress = function( event )
		{
			application.aoz.runProcedure( options.onKeyPress, { EVENT$: event.type, INDEX$: options.index, KEY$: event.key, KEYCODE: event.keyCode, REPEAT: event.repeat, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'keypress', param.events.onKeyPress, false );
	}

	if( options.onKeyDown != undefined && options.onKeyDown != '' )
	{
		if( param.onKeyDown && param.onKeyDown != options.onKeyDown )
		{
			if( param.events && param.events.onKeyDown )
			{
				elm.removeEventListener( 'keydown', param.events.onKeyDown );
			}
		}

		param.events.onKeyDown = function( event )
		{
			application.aoz.runProcedure( options.onKeyDown, { EVENT$: event.type, INDEX$: options.index, KEY$: event.key, KEYCODE: event.keyCode, REPEAT: event.repeat, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'keydown', param.events.onKeyDown, false );
	}

	if( options.onKeyUp != undefined && options.onKeyUp != '' )
	{
		if( param.onKeyUp && param.onKeyUp != options.onKeyUp )
		{
			if( param.events && param.events.onKeyUp )
			{
				elm.removeEventListener( 'keyup', param.events.onKeyUp );
			}
		}

		param.events.onKeyUp = function( event )
		{
			application.aoz.runProcedure( options.onKeyUp, { EVENT$: event.type, INDEX$: options.index, KEY$: event.key, KEYCODE: event.keyCode, REPEAT: event.repeat, ALTKEY: event.altKey, CTRLKEY: event.ctrlKey, SHIFTKEY: event.shiftKey, METAKEY: event.metaKey } );
		}
		elm.addEventListener( 'keyup', param.events.onKeyUp, false );
	}

	//
	// Attributes & style
	//
	if( param.source != options.source )
	{
		elm.setAttribute( 'src', options.source );
		param.source = options.source;
	}

	if( param.focus != options.focus )
	{
		if( options.focus === true )
		{
			elm.focus();
		}
		param.focus = options.focus;
	}

	if( param.className != options.className )
	{
		elm.setAttribute( 'class', options.className );
		param.className = options.className;
	}

	if( param.content != options.content )
	{
		elm.innerHTML = options.content;
		if( elm.scrollTop )
		{
			elm.scrollTop = 0;
		}
		param.content = options.content;
	}

	if( param.value != options.value )
	{
		elm.value = ( !isNaN( options.value ) ) ? options.value : options.value.strReplace( '\\\\', '\\' );
		param.value = options.value;
	}

	if( param.style != options.style )
	{
		elm.setAttribute( 'style', options.style );
		param.style = options.style;
	}

	if( param.visible != options.visible  )
	{

		if( options.visible == true )
		{
			if( elm.hasAttribute( 'data-display' ) )
			{
				elm.style.display = elm.getAttribute( 'data-display' );
			}
			else
			{
				elm.style.display = 'block';
			}
		}
		else
		{
			elm.setAttribute( 'data-display', elm.style.display );	
			elm.style.display = 'none';
		}
		param.visible = options.visible;
	}

	if( param.enable != options.enable )
	{

		if( options.enable == true )
		{
			if( elm.hasAttribute( 'disabled' ) )
			{
				elm.removeAttribute( 'disabled' );
			}
		}
		else
		{
			elm.setAttribute( 'disabled', '' );
		}
		param.enable = options.enable;
	}

	if( param.checked != options.checked && options.checked != -255 )
	{
		if( elm.checked != undefined )
		{
			elm.checked = options.checked;
		}
		param.checked = options.checked;
	}

	//
	// Position et taille
	//
	if( param.position != options.position && options.position != '' )
	{
		elm.style.position = options.position;
		param.position = options.position;
	}

	if( param.left != options.left && options.left != -1001.01 )
	{
		elm.style.left = options.left + 'px';
		param.left = options.left;
	}

	if( param.top != options.top && options.top != -1001.01 )
	{
		elm.style.top = options.top + 'px';
		param.top = options.top;
	}
	
	if( param.right != options.right && options.right != -1001.01 )
	{
		elm.style.right = options.right + 'px';
		param.right = options.right;
	}

	if( param.bottom != options.bottom && options.bottom != -1001.01 )
	{
		elm.style.bottom = options.bottom + 'px';
		param.bottom = options.bottom;
	}

	if( param.zIndex != options.zIndex && options.zIndex != -0.1 )
	{
		elm.style.zIndex = options.zIndex;
		param.zIndex = options.zIndex;
	}

	if( param.width != options.width && options.width != -1 )
	{
		elm.style.width = options.width + 'px';
		param.width = options.width;
	}

	if( param.height != options.height && options.height != -1 )
	{
		elm.style.height = options.height + 'px';
		param.height = options.height;
	}

	// Animation
	var anim = false;
	var animPosition = false;
	if( param.startX != options.startX && options.startX != -100101 )
	{
		param.startX = options.startX;
		if(options.startY == -100101 ) param.startY = elm.getBoundingClientRect().top;
		anim = true;
		animPosition = true;
	}
	else
	{
		param.startX = elm.getBoundingClientRect().left;
	}
	
	if( param.startY != options.startY && options.startY != -100101 )
	{
		param.startY = options.startY;
		if(options.startX == -100101 ) param.startX = elm.getBoundingClientRect().left;
		anim = true;
		animPosition = true;
	}
	else
	{
		param.startY = elm.getBoundingClientRect().top;
	}

	if( param.endX != options.endX && options.endX != -100101 )
	{
		param.endX = options.endX;
		if(options.endY == -100101 ) param.endY = elm.getBoundingClientRect().top;
		anim = true;
		animPosition = true;
	}
	else
	{
		param.endX = elm.getBoundingClientRect().left;
	}	

	if( param.endY != options.endY && options.endY != -100101 )
	{
		param.endY = options.endY;
		if(options.endX == -100101 ) param.endX = elm.getBoundingClientRect().left;
		anim = true;
		animPosition = true;
	}
	else
	{
		param.endY = elm.getBoundingClientRect().top;
	}

	if( anim )
	{
		var keyId = "anim_" + Date.now();
		var keyframe = "@keyframes " + keyId + " {\r\n";
		keyframe += "from { \r\n";

		if( animPosition )
		{
			keyframe += "transform: translate( " + param.startX + "px, " + param.startY + "px ); \r\n";
		}

		keyframe += " }\r\n"

		keyframe += "to { \r\n";

		if( animPosition )
		{
			keyframe += "transform: translate( " + param.endX + "px, " + param.endY + "px ); \r\n";
		}

		keyframe += " }\r\n";		
		keyframe += " }\r\n";	

		keyframe += '#' + elm.getAttribute( 'id' ) + ".anim {\r\n";
		keyframe += "animation-name: " + keyId + ";\r\n";
		keyframe += "animation-duration: " + (options.duration/1000) + "s;\r\n";
		keyframe += "}\r\n";

		var domStyle = document.createElement( 'style' );
		domStyle.innerHTML = keyframe;
		document.body.appendChild( domStyle ); 

		if( elm )
		{
			setTimeout( function()
			{
				elm.classList.add('anim' );
			}, 100 );
		}

	}

	
	self.elmOptions[ 'elm_' + options.index ] = param;
};

function aozhtml_htmlCode( index, insertImages, _args )
{
	if( index == undefined || ( isNaN( index ) && index == '' ) )
	{
		throw "html_index_missing";
	}

	var html = undefined;
	if( application.aoz.ASSET && application.aoz.ASSET.arrHTML )
	{
		if( application.aoz.ASSET.arrHTML[ 'html_' + index ] == undefined )
		{
			throw "html_index_not_found";
		}
		html = application.aoz.ASSET.arrHTML[ 'html_' + index ];
	}
	else
	{
		if( application.aoz.ASSET.arrHTML[ 'html_' + index ] == undefined )
		{
			throw "html_index_not_found";
		}
	}

	html = aozhtml_insertResources( html, insertImages, _args );

	return html;
};

function aozhtml_JSExecute( jsCode )
{
	var x = Function( jsCode );
	x.call( this );
};

function aozhtml_insertResources( html, insertImages, _args )
{

	var lines = html.split( "\r\n" );
	var code = '';
	var do_list = false;
	for(var l = 0; l < lines.length; l++ )
	{
		var line = lines[ l ].trim();
		if( do_list )
		{
			line = aozhtml_insertList( line );
			do_list = false;
		}

		if( line.substring( 0, 5 ).toLowerCase() == '#list' )
		{
			do_list = true;
			line = '';
		}
		
		if( line.substring( 0, 8 ).toLowerCase() == '#endlist' )
		{
			do_list = false;
			line = '';
		}

		if( line != '' )
		{

			//while( line.indexOf( 'procedure:') != -1 )
			//{
				if( line.indexOf( 'procedure:') != -1 )
				{
					line = aozhtml_insertProcedure( line, line.indexOf( 'procedure:' ) );
				}
			//}			

			if( code != '' )
			{
				code = code + "\r\n";
			}
			code = code + line;
		}
	}


	//
	// Replace tags by variables
	//
	if( application.vars )
	{
		for( var i in application.vars )
		{
			code = code.strReplace( "%" + i + "%", application.vars[ i ] );
		}
	}
	
	if( application.root.vars )
	{
		for( var i in application.root.vars )
		{
			code = code.strReplace( "%" + i + "%", application.root.vars[ i ] );
		}	
	}

	if( _args && _args.trim() != '' )
	{
		var _arg = _args.split( ',' );
		if( _arg )
		{
			var na = 1;
			for( var a = 0; a < _arg.length; a++ )
			{
				code = code.strReplace( '%arg' + na + '%', _arg[ a ] );
				na++;
			}
		}
	}
	else
	{
		for( var na = 0; na < 10; na ++ )
		{
			code = code.strReplace( '%arg' + na + '%', '' );
		}
	}

	if( insertImages )
	{
		var list = Banks.ListBanks();
		if( list && list.images )
		{
			for( var i = 0; i< list.images.length; i++ )
			{
				if( list.images[ i ] && list.images[ i ].item && list.images[ i ].item.canvas )
				{
					code = code.strReplace( "images:" + list.images[ i ].name, application.aoz.banks.utilities.getBase64Image(list.images[ i ].item.canvas ) );
				}
			}		
		}
	}

	return code;
}

function aozhtml_insertProcedure( line, index )
{
	var name = "";
	var args = "";
	var step = 0;
	var endInt = index;

	for( var r = ( index + 10 ); r < line.length; r++ )
	{
		var c = line.substring( r, r + 1 );
		if( c == ']' )
		{
			args = args + " }";
			endInt = r; 
			break;
		}

		if( c == "[" )
		{
			c = "{ ";
			step = 1;
		}

		if( c != "" )
		{
			if( step == 0 )
			{
				name = name + c;
			}
			
			if( step == 1 )
			{
				args = args + c;
			}			
		}
	}

	line = line.substring( 0, index ) + "javascript:application.aoz.runProcedure( '" + name + "', " + args + " );" + line.substring( endInt + 1, line.length );
	console.log( line );
	return line;
}

function aozhtml_insertList( line )
{
	var list = '';

	// Uses a HTML Component
	if( line.substring( 0, 4 ).toLowerCase() == 'com:' )
	{
		var part = line.split( ':' );

		// Get HTML code of the component
		var html_com = aozhtml_htmlCode( part[ 1 ] );
		var endList = false;
		if( part.length > 2 )
		{
			for( var v = 1; v < 255; v++ )
			{
				if( endList ) break;
				var nline = html_com;
				// Apply the properties to the component
				for( var p = 2; p < part.length; p++ )
				{
					var property = part[ p ].strReplace( "*", "");
					if( application.root.vars[ property + '_array' ] && application.root.vars[ property + '_array' ].array )
					{
						if( application.root.vars[ property + '_array' ].array[ v ] == undefined )
						{
							endList = true;
							break;
						}

						if( part[ p ].substring( 0, 1 ) == '*' && application.root.vars[ property + '_array' ].array[ v ] == '' )
						{
							endList = true;
							break;
						}

						nline = nline.strReplace( "%" + ( p - 1 ) + "%", application.root.vars[ property + '_array' ].array[ v ] );
					}
				}
				if( !endList )
				{
					list = list + "\r\n" + nline;
				}
			}
		}
	}
	return list;
}
