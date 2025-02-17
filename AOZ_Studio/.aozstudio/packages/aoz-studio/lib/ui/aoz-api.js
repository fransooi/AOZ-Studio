//
// API Interface for running applications
//
const FS = require( 'fs' );
const REMOTE = require('electron').remote;
const AOZIO = require( './../aoz-io' );
const UTILITIES = require( './../transpiler/utilities' );
const AOZConfig = require( './../aoz-config' );
const ELECTRON = require('electron');
const PATH = require( 'path' );
var HJSON = require( 'hjson' );
var dirSep = PATH.sep;
const CHILD_PROCESS = require( 'child_process' );

var ATOMApi = function()
{
	this.contents = [];
	this.commands = 
	{
		'play_video': 
		{
			execute: this.playVideo,
			parameters: [ { type: 'string', defaultValue: '' } ]
		}
	};
};

//
// Proposition de tag pour la doc technique interne a nous. Il faut y penser maintenant et pas 
// quand on sera 100. ;)
//
/**apide
@name:displayAOZDriveAlert
@class:ATOMApi
@type:callback ( flat  / callback or both )
@description:Displays an alert box allowing the choice of files during an automatic asset load operation with conflicts.
@param:array:list:An array of %class%FileInfo"% objects
@param:function:callback:A function to call when the user has done the choice.
@param:object:extra:An object containing data or not. 
@callbackparam:boolean,string:response: TRUE or object with "response" boolean and "data" as object indicating a positive response. 
False or undefined indicating a problem, error report in data.
@callbackparam:object:data:If positive response, object can contain anything, if negative, a string with the error id (ex "file_not_found" or { error: 'file_not_found, parameter: "file" } )
@callbackparam:object:extra:An object containing data or not, the one received upon entry.
- Obligation to return everything intact (all values in must get back out), possibility to add on the way up or down new data through the API only. 
- Data can be protected by SSH key.
- If undefined on the way up or down, can be created. Forbidden if already existing.
@content:
Pas grand chose a dire de plus en fait. :)

C'etait une proposition de tags pour notre API.
apide*/
ATOMApi.prototype.displayAOZDriveAlert = function( args, callback, extra )
{	
	var message = "Conflict in file name in AOZ Drives.\n \
	This box should display the list of files and allow the user to pick the good one.\n \
	For the moment, it cancels the transpilation (clean the drive for the demos if before ;) \n \
	Routine to implement in aoz-api.js, 'displayAOZDriveAlert'\n \
	Merci Baptiste! :) ";

	atom.aozDialog.showDialog( message, 'alert', 0, false, function( )
	{
		callback( false, null, extra );
	} );
};
ATOMApi.prototype.getCurrentTokenInfo = function( options, callback, extra )
{
	var lineTokens = [];
	if ( options.keyword )
	{
		line = options.keyword;
		xCursor = 0;
	}
	else
	{
		// Get the current lines
		var textEditor = atom.workspace.getActiveTextEditor();
		if( textEditor == undefined )
		{
			return "";
		}
		var bufferPosition = textEditor.getCursorBufferPositions()[ 0 ];
		var line = textEditor.lineTextForBufferRow( bufferPosition.row );
		var xCursor = bufferPosition.column;
	}

	// Go to the left two words, or find column
	var count = 3;
	while( xCursor > 0 )
	{
		c = line.charAt( xCursor - 1 ).toLowerCase();
		if ( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) || c == ' ' || c == '_' || c == '$' || c == '#' )
		{
			if ( c == ' ' )
			{
				count--;
				lineTokens = this.getLineTokens( line, xCursor, lineTokens );
				if ( count == 0 ) 
					break;
			}
			xCursor--;
		}
		else
		{
			break;
		}
	}
	if ( line.charAt( xCursor ) == ' ' )
		xCursor++;
	lineTokens = this.getLineTokens( line, xCursor, lineTokens );
	//console.log( lineTokens );

	if( lineTokens.length > 0 )
	{
		var ln = lineTokens[ 0 ].text;
		//console.log( ln );
		if( ln != undefined && ln != '' )
		{
			if( ln.substring( 0, 1 ) == '$' )
			{
				//console.log( 'couleur' );
				atom.commands.dispatch( extra, 'color-picker:open' );
				return ln;
			}
		}
	}
	
	// Find the token or command in the line
	var info = this.findLineToken( lineTokens );
	if ( !info )
		return '';
	if ( info.command )
		return '';
	
	// Replace ~~~ with ```	in content
	// Add spaces at the end of every line
	if ( info.page.content )
	{
		for ( var l = 0; l < info.page.content.length; l++ )
		{			
			var line = info.page.content[ l ].text;
			for ( var p = line.length - 1; p > 0; p-- )
			{
				var c = line.charCodeAt( p );
				if ( c != 13 && c != 10 )
				{
					line = line.substring( 0, p + 1 ) + ' ' + line.substring( p + 1 );
					break;
				}
			}
			info.page.content[ l ].text = UTILITIES.replaceStringInText( line, '~~~', "'''" );
		}
	}

	// Extract JSON portions
	var newInfo = {};
	newInfo.command = UTILITIES.copyObject( info.page );
	newInfo.chapter = {};
	for ( var p in info.chapter )
	{
		if ( p != 'pages' )
			newInfo.chapter[ p ] = info.chapter[ p ];
	}

	// Extract all the strings in the good language
	lang = typeof options.lang == 'undefined' ? 'en' : options.lang.toLowerCase();
	newInfo.chapter = copyLang( newInfo.chapter, lang );
	newInfo.command = copyLang( newInfo.command, lang );
	return JSON.stringify( newInfo );

	function copyLang( chapter, language, result )
	{
		var result = {};		
		for ( var p in chapter )
	{
			var prop = copyProp( chapter[ p ], language );
			if ( typeof prop != 'undefined' )
				result[ p ] = prop;
		}
		return result;
	}
	function copyProp( prop, language )
	{		
		var result;
		if ( UTILITIES.isObject( prop ) )
		{
			if ( prop.lang )
			{
				if ( prop.lang == language )
				{
					result = {};
					for ( var pp in prop )
						result[ pp ] = prop[ pp ];
					return result;
				}
				return undefined;
			}
			result = {};
			for ( var pp in prop )
			{
				var prop2 = copyProp( prop[ pp ], pp, language );
				if ( typeof prop2 != 'undefined' )
					result[ pp ] = prop2;
			}
		}
		else if ( UTILITIES.isArray( prop ) )
		{
			result = [];
			for ( var i = 0; i < prop.length; i++ )
			{
				var prop2 = copyProp( prop[ i ], language );
				if ( prop2 )
					result.push( prop2 );						
			}
	}
		else
		{
			result = prop;
		}
		return result;
	};
};
ATOMApi.prototype.getToken = function( args )
{
	var lineTokens = this.getLineTokens( args.keyword, 0, [] );
	var info = this.findLineToken( lineTokens );
	if ( !info || ( info && !info.chapter ) || ( info && !info.page ) )
		return '';
	return info.page.name;
};
ATOMApi.prototype.getTokenList = function( options )
{
	options = typeof options == 'undefined' ? {} : options;
	options.chapter = typeof options.chapter == 'undefined' ? '' : options.chapter;
	
	// Load JSON if not already loaded
	if ( !this.guideMap )
		this.guideMap = loadHJSON( atom.aozConfig.installInformation.commonPath + dirSep + '.aozstudio' + dirSep  + 'packages' + dirSep + 'aoz-studio' + dirSep + 'data' + dirSep + 'guidemap_f5.json' );
	if ( !this.guideMap )
		return undefined;

	// List instructions and functions.
	var result = '';
	var page, chapter;
	var number = 1;
	var duplicated = {};
	var alreadyDone = {};
	for ( var c in this.guideMap.chapters )
	{
		chapter = this.guideMap.chapters[ c ];
		if ( UTILITIES.isObject( chapter ) )
		{
			if ( options.chapter == '' || ( options.chapter != '' && chapter.name.toLowerCase().indexOf( options.chapter.toLowerCase() ) >= 0 ) )
			{
				if ( !options.csv )
				{
					result += '-----------------------------------------------------------------------------------------\n';
					result += 'Chapter: ' + chapter.name + '\n';
					result += '-----------------------------------------------------------------------------------------\n';
				}
				else
				{
					result += '"","",""\n'
					result += '"","Chapter","' + chapter.name + '"\n';
				}
				for ( var p in chapter.pages )
				{
					page = chapter.pages[ p ];
					var pageName = page.name.trim();
					if ( page.return && page.return.length > 0 )
					{
						pageName = '=' + pageName;
						if ( !alreadyDone[ pageName ] )
						{
							alreadyDone[ pageName ] = number;
	
						if ( options.functions )
						{
							if ( !options.csv )
							{
								if ( options.numbers )
									result += number++ + ' - ';
									result += 'Function: ' + pageName + '\n';
							}
							else
							{
									result += number++ + ',"Function","' + pageName + '"\n';
							}
						}
					}
					else
					{
							duplicated[ pageName ] = alreadyDone[ pageName ];
						}
					}
					else
					{
						if ( !alreadyDone[ pageName ] )
						{
							alreadyDone[ pageName ] = number;
							
						if ( options.instructions )
						{
							if ( !options.csv )
							{
								if ( options.numbers )
									result += number++ + ' - ';
									result += 'Instruction: ' + pageName + '\n';
							}
							else
							{
									result += number++ + ',"Instruction","' + pageName + '"\n';
							}
						}
					}
						else
						{
							duplicated[ pageName ] = alreadyDone[ pageName ];
						}
					}
				}
			}
		}
	}
	if ( options.duplicated )
	{
		if ( !options.csv )
		{
			result += '-----------------------------------------------------------------------------------------\n';
			result += '-----------------------------------------------------------------------------------------\n';
			result += '-----------------------------------------------------------------------------------------\n';
			result += 'Duplicated instructions and functions\n';
			result += '-----------------------------------------------------------------------------------------\n';
			result += '-----------------------------------------------------------------------------------------\n';
			result += '-----------------------------------------------------------------------------------------\n';
				}
		else
		{
			result += '"","",""\n'
			result += '"","",""\n'
			result += '"","Duplicated","instructions and functions"\n';
		}
		for ( var d in duplicated )
		{
			if ( !options.csv )
			{
				result += duplicated[ d ] + ' - ' + d + '\n';
			}
			else
			{
				result += duplicated[ d ] + ',"","' + d + '"\n';
			}
		}
	}
	result += '\n';
	return result;
};
ATOMApi.prototype.findToken = function( args )
{
	var lineTokens = this.getLineTokens( args.keyword, 0, [] );
	var result = this.findLineToken( lineTokens );
	if ( !result )
		result = '';
	return result;
};
ATOMApi.prototype.findLineToken = function( lineTokens )
{
	// Load JSON if not already loaded
	if ( !this.guideMap )
		this.guideMap = atom.AOZIO.loadHJSON( atom.aozConfig.installInformation.commonPath + dirSep + '.aozstudio' + dirSep  + 'packages' + dirSep + 'aoz-studio' + dirSep + 'data' + dirSep + 'guidemap_f5.json' );
	if ( !this.guideMap )
		return undefined;
	
	// Sort tokens in inverse length order
	var tempTokens = [];
	for ( var t = 0; t < lineTokens.length; t++ )
	{
		var found = false;
		var tk = lineTokens[ t ];
		for ( var tt = 0; tt < tempTokens.length; tt++ )
		{
			if ( tk.text.length > tempTokens[ tt ].text.length )
			{
				tempTokens.splice( tt, 0, tk );
				found = true;
				break;
			}
		}
		if ( !found )
			tempTokens.push( tk );
	}
	lineTokens = tempTokens;

	// Find instruction in JSON
	var page, chapter;
	var found = false;
	var token; 
	for ( var lt = 0; lt < lineTokens.length && !found; lt++ )
	{
		token = lineTokens[ lt ];
		for ( var c in this.guideMap.chapters )
		{
			chapter = this.guideMap.chapters[ c ];
			if ( UTILITIES.isObject( chapter ) )
			{
				for ( var p in chapter.pages )
				{
					page = chapter.pages[ p ];
					if ( page.name.toLowerCase() == token.textReal.toLowerCase() )
					{
						found = true;
						break;
					}
				}
				if ( found )
					break;
			}
		}
	}
	if ( !found )
		return undefined;
	return { chapter: chapter, page: page };
}
ATOMApi.prototype.getLineTokens = function( line, position, lineTokens )
{
		var lineText = '';
		var linePlus = '';
		var lineReal = '';
		var linePlusReal = '';
		this.module = null;
		var quit = false;
		var pp;
		do
		{
			for ( pp = position; pp < line.length && !quit; pp++ )
			{
				c = line.charAt( pp ).toLowerCase();
				if ( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) || c == ' ' || c == '_' || c == '$' || c == '#' || c == '@' )
				{
					if ( c == ' ' )
					{
						lineTokens.push( { text: lineText, textReal: lineReal, position: pp } );
						linePlus += '_';
						linePlusReal += ' ';
					}
					else
					{
						lineText += linePlus + c;
						lineReal += linePlusReal + line.charAt( pp );
						linePlus = '';
						linePlusReal = '';
					}
				}
				else
				{
					pp--;
					quit = true;
				}
			}
			if ( linePlus == '' )
			{
				lineTokens.push( { text: lineText, textReal: lineReal, position: pp } );
			}
		} while ( pp < line.length && !quit )
		return lineTokens;
}
ATOMApi.prototype.playVideo = function( path )
{
	if ( path != "" )
	{
		if ( !PATH.isAbsolute( path ) ) 
			path = AOZConfig.installInformation.aozPath + dirSep + path;
		if ( FS.existsSync( path ) )
		{
			debugger;
		}
	}
	return "";
}
ATOMApi.prototype.copyText = function( args )
{
	ELECTRON.clipboard.writeText( args.text );
}
ATOMApi.prototype.insertTextAtCursor = function( args )
{
	var editor = atom.workspace.getActiveTextEditor();
	if ( editor )
	{
		var currentPosition = editor.getCursorBufferPosition();
		editor.setCursorBufferPosition( currentPosition );
		editor.insertText( args.text );
		editor.setCursorBufferPosition( currentPosition );
	}
}
ATOMApi.prototype.openURL = function( args )
{
	require( "shell" ).openExternal( args.url );
}
ATOMApi.prototype.getCursorPosition = function( args )
{
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return 0;
	var pos = textEditor.getCursorBufferPosition();
	return pos[ args.axe ];
}
ATOMApi.prototype.getWord = function( args )
{
	var x = args.x;
	var y = args.y;

	// Get the current lines
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return '';

	var line = textEditor.lineTextForBufferRow( y );

	// Go to the left two words, or find column
	while( x > 0 )
	{
		c = line.charAt( x - 1 );
		if ( c == ':' || c == ' ' || c == '\t' || c == '(' )
			break;
		x--;
	}

	// Isolate token
	var pp;
	var word = '';
	do
	{
		c = line.charAt( pp ).toLowerCase();
		if ( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) || c == '_' || c == '$' || c == '#' || c == '@' )
			word += c;
		else if ( c == ' ' )
			break;
	} while ( pp < line.length )
	return word;
}
ATOMApi.prototype.getLine = function( args )
{
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return '';
	return textEditor.lineTextForBufferRow( args.y );
}
ATOMApi.prototype.getText = function()
{
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return '';
	return textEditor.getText();
}
ATOMApi.prototype.moveCaret = function( args )
{
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return;
	var position = textEditor.getCursorBufferPosition();
	if ( args.dx )
		position[ 0 ] += args.dx;
	if ( args.dy )
		position[ 1 ] += args.dy;
	textEditor.setCursorBufferPosition( position, { autoscroll: true } );
}
ATOMApi.prototype.setCaretPosition = function( args )
{
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return;
	var position = textEditor.getCursorBufferPosition();
	if ( typeof args.x == 'undefined' )
		args.x = position[ 0 ];
	if ( typeof y == 'undefined' )
		args.y = position[ 1 ];
	textEditor.setCursorBufferPosition( args, { autoscroll: true } );
}
ATOMApi.prototype.getInstallationPath = function( args )
{
	if ( AOZConfig.installInformation.runPaths[ args.id ] )
		return AOZConfig.installInformation.runPaths[ args.id ];
	return '';
}
ATOMApi.prototype.saveToUserConfig = function(  args )
{
	AOZConfig.aoz_settings[ args.identifier ] = args.data;
}
ATOMApi.prototype.loadUserConfig = function( args )
{
	var userPath = REMOTE.app.getPath( 'documents' );
	var data = AOZIO.loadHJSON(  userPath + dirSep + '.aozstudio' + dirSep + 'user.hjson' );
	if ( data )
	{
		return data[ args.identifier ];
	}
	return undefined;
}
ATOMApi.prototype.getCurrentApplicationPath = function()
{
	// Get the current lines
	var textEditor = atom.workspace.getActiveTextEditor();
	if( textEditor == undefined )
		return '';
	return textEditor.getPath();	
}
ATOMApi.prototype.loadExample = function( args )
{
	var path = args.path;
	var options = args.options;
	var pos = path.toLowerCase().indexOf( ':' );
	if ( pos > 0 )
	{
		var drive = this.getInstallationPath( { id: path.substring( 0, pos ).toLowerCase() } );
		if ( drive )
		{
			path = drive + dirSep + path.substring( pos + 1 );
		}
	}			
	path = PATH.normalize( path );
	var test = UTILITIES.getFileExtension().toLowerCase();
	if ( !test || ( test && text.toLowerCase() != 'aoz' ) )
	{
		var name = atom.AOZIO.getProjectAOZFilename( path );
		path = PATH.normalize( path + '/' + name );
	}
	atom.AOZIO.openFile( path, function( error )
	{
		if( error != 'no' )
		{
			return;
		}		
		atom.workspace.open( path );
	} );
	return;
}

ATOMApi.prototype.resizePanel = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;		
	}
	domPanel.style.width = args.width + 'px';
	domPanel.style.height = args.height + 'px';
	domPanel.width = args.width;
	domPanel.height = args.height;
}
ATOMApi.prototype.dragPanelStart = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	console.log( 'Start Dragging!' );
	domPanel.aoz_dragging = true;
	var aoz_xDrag = atom.aoz_xMouse;
	var aoz_yDrag = atom.aoz_yMouse;
	var handle = setInterval( function()
	{
		if ( domPanel.aoz_dragging )
		{
			var deltaX = atom.aoz_xMouse - aoz_xDrag;
			var deltaY = atom.aoz_yMouse - aoz_yDrag;
			console.log( deltaX, deltaY );
			if ( deltaX != 0 || deltaY != 0 )
			{
				var xx = parseInt( domPanel.style.left );
				var yy = parseInt( domPanel.style.top );
				domPanel.style.left = ( xx + deltaX ) + 'px';
				domPanel.style.top = ( yy + deltaY ) + 'px';
				aoz_xDrag = atom.aoz_xMouse;
				aoz_yDrag = atom.aoz_yMouse;
			}	
		}
		else
		{
			clearInterval( handle );
		}
	}, 100 );
}
ATOMApi.prototype.dragPanel = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}

	console.log( 'End Dragging!' );
	if ( domPanel.aoz_dragging )
	{
		var deltaX = atom.aoz_xMouse - domPanel.aoz_xDrag;
		var deltaY = atom.aoz_yMouse - domPanel.aoz_yDrag;
		//console.log( "deltaX: " + deltaX + " - deltaY: " + deltaY );
		if ( deltaX != 0 || deltaY != 0 )
		{
			var xx = parseInt( domPanel.style.left );
			var yy = parseInt( domPanel.style.top );
			domPanel.style.left = ( xx + deltaX ) + 'px';
			domPanel.style.top = ( yy + deltaY ) + 'px';
			domPanel.aoz_xDrag = atom.aoz_xMouse;
			domPanel.aoz_yDrag = atom.aoz_yMouse;
			//console.log( "Dragging: " + ( xx + deltaX ) + " / " + ( yy + deltaY ) );
		}
	}
}
ATOMApi.prototype.dragPanelEnd = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	domPanel.aoz_dragging = false;
}
ATOMApi.prototype.movePanel = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;		
	}
	if ( UTILITIES.isTag( tags, "relative" ) )
	{
		var xx = parseInt( domPanel.style.left );
		var yy = parseInt( domPanel.style.top );
		args.x = xx + args.x;
		args.y = yy + args.y;
	}
	domPanel.style.left = args.x + 'px';
	domPanel.style.top = args.y + 'px';
}
ATOMApi.prototype.hidePanel = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}

	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	domPanel.style.display = 'none';
}
ATOMApi.prototype.destroyPanel = function( args )
{
	if( args.panelId == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	var domPanel = document.getElementById( args.panelId );
	if( domPanel == undefined )
	{
		console.error( "Panel " + args.panelId + " not found" );
		return;
	}
	// Store coordinates of panel for next time...
	atom.aozRequester.panelCoordinates[ args.panelId ] = { x: parseInt( domPanel.style.left ), y: parseInt( domPanel.style.top ) };
	atom.aozRequester.destroyPanel( args.panelId );
}

ATOMApi.prototype.openDocChapter = function( args )
{
	atom.docTree.openChapterF5( args.chapter );
}

ATOMApi.prototype.launchCompanionServer = function( options, callback, extra )
{
	callback( true, {}, extra );
	return;
/*
	debugger;
	if ( !atom.companion )
	{
		var path = AOZConfig.installInformation.runPaths[ 'companion' ];
		var dir = PATH.dirname( path );
		var file = PATH.basename( path );	
		function pipe( response, data, extra )
		{
			if ( response == 'stdout' )
			{
				console.log( data );
				if ( data.indexOf( 'Waiting for connection...' ) >= 0 )
		{
					atom.companion = true;
					callback( true, {}, extra );
				}
			}	
			else 
			{
				console.error( data );
				atom.companion = false;
				callback( false, {}, extra );
			}	
		}
		atom.aozStudioView.execFile( file, dir, function( response, data, extra )
			{
			atom.companion = false;
		}, { nowait: true, pipeCallback: pipe } );
		return;
	}
				callback( true, {}, extra );
			return;
*/
/*
	if ( !atom.companion )
	{
		var path = AOZConfig.installInformation.runPaths[ 'companion' ];
		var dir = PATH.dirname( path );
		var file = PATH.basename( path );
		try
			{
			var self = this;
			var child = EXEC.execFile( file, { cwd: dir }, function ( msg, stdout, stderr )
			{
				if ( callback )
					callback( true, { stdout: stdout, stderr: stderr }, extra );
			} );
			child.stdout.on( 'data', function( pipe )
			{
				console.log( pipe );
				if ( callback )
					callback( true, pipe, extra );
			} );
			child.stderr.on( 'data', function ( pipe )
			{
				console.log( pipe );
				if ( callback )
					callback( false, pipe, extra );
			} );
		}
		catch ( e )
		{
			if ( callback )
				callback( false, e, extra );
			return false;
		}
		return true;
	}
*/
}

module.exports = ATOMApi;
