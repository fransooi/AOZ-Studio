/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Transpiler
 *
 * Sourcecode handling
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 17/03/2020
 */
var UTILITIES = require( './utilities' );
var FILESYSTEM = require( './filesystem' );
var TOKENS = require( './tokens' );
var MESSAGES = require( './messages' );
var PATH = require( 'path' );
var BTOA = require( 'btoa' );

var undefMark = '#%$undef$%#';
var EXPFLAG_COMPARAISON 					= 0x00000001;
var EXPFLAG_ENDONCOLON 						= 0x00000002;
var EXPFLAG_ENDONSEMICOLON					= 0x00000004;
var EXPFLAG_ENDONCOMMA 						= 0x00000008;
var EXPFLAG_ENDONBRACKET 					= 0x00000010;
var EXPFLAG_ENDONSQUAREBRACKET				= 0x00000020;
var EXPFLAG_ENDONTO	 						= 0x00000040;
var EXPFLAG_ENDONAS	 						= 0x00000080;
var EXPFLAG_ENDONTHEN 						= 0x00000100;
var EXPFLAG_ENDONSTEP 						= 0x00000200;
var EXPFLAG_ENDONPROC 						= 0x00000400;
var EXPFLAG_ENDONGOTO 						= 0x00000800;
var EXPFLAG_ENDONGOSUB 						= 0x00001000;
var EXPFLAG_WANTNUMBER 						= 0x00010000;
var EXPFLAG_WANTSTRING 						= 0x00020000;
var EXPFLAG_SKIPNEXTTOKEN					= 0x00040000;
var EXPFLAG_ENDOFINSTRUCTION				= 0x00080000;
var EXPFLAG_ENDOFPARAMETER					= 0x00100000;
var EXPFLAG_ENDONBOOL						= 0x00200000;
var EXPFLAG_HANDLENEWSYNTAX					= 0x00400000;
var EXPFLAG_WANTNEWOBJECT					= 0x00800000;
var EXPFLAG_ENDONTOKEN						= 0x01000000;
var EXPFLAG_NOERRORS						= 0x02000000;
var EXPFLAG_ENDONDOT						= 0x04000000;
var EXPFLAG_NOTWITHOBJECT					= 0x08000000;
var EXPFLAG_ONEOPERAND						= 0x10000000;

module.exports.EXPFLAG_COMPARAISON 			= EXPFLAG_COMPARAISON;
module.exports.EXPFLAG_ENDONCOLON 			= EXPFLAG_ENDONCOLON;
module.exports.EXPFLAG_ENDONSEMICOLON 		= EXPFLAG_ENDONSEMICOLON;
module.exports.EXPFLAG_ENDONCOMMA 			= EXPFLAG_ENDONCOMMA;
module.exports.EXPFLAG_ENDONBRACKET 		= EXPFLAG_ENDONBRACKET;
module.exports.EXPFLAG_ENDONSQUAREBRACKET 	= EXPFLAG_ENDONSQUAREBRACKET;
module.exports.EXPFLAG_ENDONTO 				= EXPFLAG_ENDONTO;
module.exports.EXPFLAG_ENDONAS 				= EXPFLAG_ENDONAS;
module.exports.EXPFLAG_ENDONTHEN 			= EXPFLAG_ENDONTHEN;
module.exports.EXPFLAG_ENDONSTEP 			= EXPFLAG_ENDONSTEP;
module.exports.EXPFLAG_ENDONPROC 			= EXPFLAG_ENDONPROC;
module.exports.EXPFLAG_ENDONGOTO 			= EXPFLAG_ENDONGOTO;
module.exports.EXPFLAG_ENDONGOSUB 			= EXPFLAG_ENDONGOSUB;
module.exports.EXPFLAG_WANTNUMBER 			= EXPFLAG_WANTNUMBER;
module.exports.EXPFLAG_WANTSTRING 			= EXPFLAG_WANTSTRING;
module.exports.EXPFLAG_SKIPNEXTTOKEN 		= EXPFLAG_SKIPNEXTTOKEN;
module.exports.EXPFLAG_ENDOFINSTRUCTION 	= EXPFLAG_ENDOFINSTRUCTION;
module.exports.EXPFLAG_ENDOFPARAMETER 		= EXPFLAG_ENDOFPARAMETER;
module.exports.EXPFLAG_ENDONBOOL 			= EXPFLAG_ENDONBOOL;
module.exports.EXPFLAG_HANDLENEWSYNTAX		= EXPFLAG_HANDLENEWSYNTAX;
module.exports.EXPFLAG_WANTNEWOBJECT		= EXPFLAG_WANTNEWOBJECT;
module.exports.EXPFLAG_ENDONTOKEN			= EXPFLAG_ENDONTOKEN;
module.exports.EXPFLAG_NOERRORS				= EXPFLAG_NOERRORS;
module.exports.EXPFLAG_ENDONDOT				= EXPFLAG_ENDONDOT;
module.exports.EXPFLAG_NOTWITHOBJECT		= EXPFLAG_NOTWITHOBJECT;
module.exports.EXPFLAG_ONEOPERAND			= EXPFLAG_ONEOPERAND;

var GETVARIABLEFLAG_ASSIGNMENT				= 0x00000001;
var GETVARIABLEFLAG_GLOBAL					= GETVARIABLEFLAG_ASSIGNMENT;
var GETVARIABLEFLAG_NOWARNING				= 0x00000004;
var GETVARIABLEFLAG_SORT					= 0x00000008;
var GETVARIABLEFLAG_MATCH					= 0x00000010;
var GETVARIABLEFLAG_READ					= 0x00000020;
var GETVARIABLEFLAG_INC						= 0x00000040;
var GETVARIABLEFLAG_DEC						= 0x00000080;
var GETVARIABLEFLAG_SETVALUE				= 0x00000200;
var GETVARIABLEFLAG_INPUT					= 0x00000100;
var GETVARIABLEFLAG_GETVALUE				= 0x00000400;
var GETVARIABLEFLAG_NOPARAMETERS			= 0x00000800;
var GETVARIABLEFLAG_ADD						= 0x00001000;
var GETVARIABLEFLAG_VARPTR					= 0x00002000;
var GETVARIABLEFLAG_SHARED					= 0x00004000;
var GETVARIABLEFLAG_NOPARAMETERS2			= 0x00008000;
var GETVARIABLEFLAG_NOCODE					= 0x00010000;
module.exports.GETVARIABLEFLAG_ASSIGNMENT 	= GETVARIABLEFLAG_ASSIGNMENT;
module.exports.GETVARIABLEFLAG_NOWARNING 	= GETVARIABLEFLAG_NOWARNING;
module.exports.GETVARIABLEFLAG_GLOBAL 		= GETVARIABLEFLAG_GLOBAL;
module.exports.GETVARIABLEFLAG_SORT			= GETVARIABLEFLAG_SORT;
module.exports.GETVARIABLEFLAG_MATCH		= GETVARIABLEFLAG_MATCH;
module.exports.GETVARIABLEFLAG_READ			= GETVARIABLEFLAG_READ;
module.exports.GETVARIABLEFLAG_INC			= GETVARIABLEFLAG_INC;
module.exports.GETVARIABLEFLAG_DEC			= GETVARIABLEFLAG_DEC;
module.exports.GETVARIABLEFLAG_INPUT		= GETVARIABLEFLAG_INPUT;
module.exports.GETVARIABLEFLAG_SETVALUE		= GETVARIABLEFLAG_SETVALUE;
module.exports.GETVARIABLEFLAG_GETVALUE		= GETVARIABLEFLAG_GETVALUE;
module.exports.GETVARIABLEFLAG_NOPARAMETERS	= GETVARIABLEFLAG_NOPARAMETERS;
module.exports.GETVARIABLEFLAG_ADD			= GETVARIABLEFLAG_ADD;
module.exports.GETVARIABLEFLAG_VARPTR		= GETVARIABLEFLAG_VARPTR;
module.exports.GETVARIABLEFLAG_SHARED		= GETVARIABLEFLAG_SHARED;
module.exports.GETVARIABLEFLAG_NOCODE		= GETVARIABLEFLAG_NOCODE;
module.exports.undefMark = undefMark;
module.exports.GETVARIABLEFLAG_NOPARAMETERS2= GETVARIABLEFLAG_NOPARAMETERS2;

var token_replacement_char = '_';
var tokenList = [];

function Information( options )
{
	this.options = options;
	this.instructions = {};
	this.functions = {};
	this.methods = {};
	this.objects = {};
	this.anchors = {};
	this.resourcesSubpath = options.resourcesSubpath;
	this.inExpression = 0;
	this.needModules = {};
	this.needExtensions = {};
    this.includePile = [];
    this.includes = [];
	this.inExpressionFlags = [];
	this.pileSources = [];
	this.variablesCount = 0;
	this.tags = {};
	this.startOfExpression = 0;
	this.endOfExpression = 0;
	this.sourcePos = '';
	this.sourceLine = undefined;
	this.fzDebug = false;
	this.currentInstructionInfo = {};
	this.parameterPositions = [];
	this.positionLastBlock = -1;

    // Init the token table
	for ( var t = 0; t < TOKENS.tokenTable.length; t++ )
    {
		var token = TOKENS.tokenTable[ t ];
		var index = UTILITIES.replaceCharByChar( token.token, ' ', token_replacement_char );
        tokenList[ index ] = token;
    }
	
	// Object-oriented : base object reserved variables
	this.objectProperties =
	[
		{ name: 'X', type: '0', code: 'x' },
		{ name: 'Y', type: '0', code: 'y' },
		{ name: 'Z', type: '0', code: 'z' },
		{ name: 'Angle', type: '0', code: 'angle' },
		{ name: 'Image', type: '0', code: 'image' },
		{ name: 'Alpha', type: '0', code: 'alpha' },
		{ name: 'Visible', type: '0', code: 'visible' },
	];

	// Constants
	this.constants =
	{
		'true': { name: 'True', type: '0', code: 'this.aoz.platformTrue' },
		'false': { name: 'False', type: '0', code: 'false' },
		'hires': { name: 'Hires', type: '0', code: '1' },
		'lowres': { name: 'Lowres', type: '0', code: '0' },
		'laced': { name: 'Laced', type: '0', code: '2' },
		'halfbright': { name: 'Halfbright', type: '0', code: '4' },
		//'threed': { name: 'ThreeD', type: '0', code: '8' },
		'pi#': { name: 'PI#', type: '1', code: 'Math.PI' },

		// Keyboard
		'key_up': { name: 'KEY_UP', type: '2', code: '"ArrowUp"' },
		'key_down': { name: 'KEY_DOWN', type: '2', code: '"ArrowDown"' },
		'key_left': { name: 'KEY_LEFT', type: '2', code: '"ArrowLeft"' },
		'key_right': { name: 'KEY_RIGHT', type: '2', code: '"ArrowRight"' },
		'key_space': { name: 'KEY_SPACE', type: '2', code: '"Space"' },
		'key_enter': { name: 'KEY_ENTER', type: '2', code: '"Enter"' },
		'key_escape': { name: 'KEY_ESCAPE', type: '2', code: '"Escape"' },
		'key_lshift': { name: 'KEY_LSHIFT', type: '2', code: '"ShiftLeft"' },
		'key_lctrl': { name: 'KEY_LCTRL', type: '2', code: '"ControlLeft"' },
		'key_lalt': { name: 'KEY_LALT', type: '2', code: '"AltLeft"' },
		'key_lmeta': { name: 'KEY_LMETA', type: '2', code: '"MetaLeft"' },
		'key_rshift': { name: 'KEY_RSHIFT', type: '2', code: '"ShiftRight"' },
		'key_rctrl': { name: 'KEY_RCTRL', type: '2', code: '"ControlRight"' },
		'key_ralt': { name: 'KEY_RALT', type: '2', code: '"AltRight"' },
		'key_rmeta': { name: 'KEY_RMETA', type: '2', code: '"MetaRight"' },
		'key_f1': { name: 'KEY_F1', type: '2', code: '"F1"' },
		'key_f2': { name: 'KEY_F2', type: '2', code: '"F2"' },
		'key_f3': { name: 'KEY_F3', type: '2', code: '"F3"' },
		'key_f4': { name: 'KEY_F4', type: '2', code: '"F4"' },
		'key_f5': { name: 'KEY_F5', type: '2', code: '"F5"' },
		'key_f6': { name: 'KEY_F6', type: '2', code: '"F6"' },
		'key_f7': { name: 'KEY_F7', type: '2', code: '"F7"' },
		'key_f8': { name: 'KEY_F8', type: '2', code: '"F8"' },
		'key_f9': { name: 'KEY_F9', type: '2', code: '"F9"' },
		'key_f10': { name: 'KEY_F10', type: '2', code: '"F10"' },
		'key_f11': { name: 'KEY_F11', type: '2', code: '"F11"' },
		'key_f12': { name: 'KEY_F12', type: '2', code: '"F12"' },
		'key_numpad0': { name: 'KEY_NUMPAD0', type: '2', code: '"Numpad0"' },
		'key_numpad1': { name: 'KEY_NUMPAD1', type: '2', code: '"Numpad1"' },
		'key_numpad2': { name: 'KEY_NUMPAD2', type: '2', code: '"Numpad2"' },
		'key_numpad3': { name: 'KEY_NUMPAD3', type: '2', code: '"Numpad3"' },
		'key_numpad4': { name: 'KEY_NUMPAD4', type: '2', code: '"Numpad4"' },
		'key_numpad5': { name: 'KEY_NUMPAD5', type: '2', code: '"Numpad5"' },
		'key_numpad6': { name: 'KEY_NUMPAD6', type: '2', code: '"Numpad6"' },
		'key_numpad7': { name: 'KEY_NUMPAD7', type: '2', code: '"Numpad7"' },
		'key_numpad8': { name: 'KEY_NUMPAD8', type: '2', code: '"Numpad8"' },
		'key_numpad9': { name: 'KEY_NUMPAD9', type: '2', code: '"Numpad9"' },
		'key_0': { name: 'KEY_0', type: '2', code: '"Digit0"' },
		'key_1': { name: 'KEY_1', type: '2', code: '"Digit1"' },
		'key_2': { name: 'KEY_2', type: '2', code: '"Digit2"' },
		'key_3': { name: 'KEY_3', type: '2', code: '"Digit3"' },
		'key_4': { name: 'KEY_4', type: '2', code: '"Digit4"' },
		'key_5': { name: 'KEY_5', type: '2', code: '"Digit5"' },
		'key_6': { name: 'KEY_6', type: '2', code: '"Digit6"' },
		'key_7': { name: 'KEY_7', type: '2', code: '"Digit7"' },
		'key_8': { name: 'KEY_8', type: '2', code: '"Digit8"' },
		'key_9': { name: 'KEY_9', type: '2', code: '"Digit9"' },
		'key_a': { name: 'KEY_A', type: '2', code: '"KeyA"' },
		'key_b': { name: 'KEY_B', type: '2', code: '"KeyB"' },
		'key_c': { name: 'KEY_C', type: '2', code: '"KeyC"' },
		'key_d': { name: 'KEY_D', type: '2', code: '"KeyD"' },
		'key_e': { name: 'KEY_E', type: '2', code: '"KeyE"' },
		'key_f': { name: 'KEY_F', type: '2', code: '"KeyF"' },
		'key_g': { name: 'KEY_G', type: '2', code: '"KeyG"' },
		'key_h': { name: 'KEY_H', type: '2', code: '"KeyH"' },
		'key_i': { name: 'KEY_I', type: '2', code: '"KeyI"' },
		'key_j': { name: 'KEY_J', type: '2', code: '"KeyJ"' },
		'key_k': { name: 'KEY_K', type: '2', code: '"KeyK"' },
		'key_l': { name: 'KEY_L', type: '2', code: '"KeyL"' },
		'key_m': { name: 'KEY_M', type: '2', code: '"KeyM"' },
		'key_n': { name: 'KEY_N', type: '2', code: '"KeyN"' },
		'key_o': { name: 'KEY_O', type: '2', code: '"KeyO"' },
		'key_p': { name: 'KEY_P', type: '2', code: '"KeyP"' },
		'key_q': { name: 'KEY_Q', type: '2', code: '"KeyQ"' },
		'key_r': { name: 'KEY_R', type: '2', code: '"KeyR"' },
		'key_s': { name: 'KEY_S', type: '2', code: '"KeyS"' },
		'key_t': { name: 'KEY_T', type: '2', code: '"KeyT"' },
		'key_u': { name: 'KEY_U', type: '2', code: '"KeyU"' },
		'key_v': { name: 'KEY_V', type: '2', code: '"KeyV"' },
		'key_w': { name: 'KEY_W', type: '2', code: '"KeyW"' },
		'key_x': { name: 'KEY_X', type: '2', code: '"KeyX"' },
		'key_y': { name: 'KEY_Y', type: '2', code: '"KeyY"' },
		'key_z': { name: 'KEY_Z', type: '2', code: '"KeyZ"' },
		'key_backspace': { name: 'KEY_BACKSPACE', type: '2', code: '"Backspace"' },
		'key_delete': { name: 'KEY_DELETE', type: '2', code: '"Delete"' },
		'key_pageup': { name: 'KEY_PAGEUP', type: '2', code: '"PageUp"' },
		'key_pagedown': { name: 'KEY_PAGEDOWN', type: '2', code: '"PageDown"' },
		'key_pause': { name: 'KEY_PAUSE', type: '2', code: '"Pause"' },
		'key_tab': { name: 'KEY_TAB', type: '2', code: '"Tab"' },
		'key_home': { name: 'KEY_HOME', type: '2', code: '"Home"' },
		'key_printscreen': { name: 'KEY_PRINTSCREEN', type: '2', code: '"PrintScreen"' },
		'key_insert': { name: 'KEY_INSERT', type: '2', code: '"Insert"' },

		// Mouse Buttons
		'mouse_none': { name: 'MOUSE_NONE', type: '0', code: '0' },
		'mouse_left': { name: 'MOUSE_LEFT', type: '0', code: '1' },
		'mouse_right': { name: 'MOUSE_RIGHT', type: '0', code: '2' },
		'mouse_middle': { name: 'MOUSE_MIDDLE', type: '0', code: '4' },
		'mouse_back': { name: 'MOUSE_BACK', type: '0', code: '8' },
		'mouse_forward': { name: 'MOUSE_FORWARD', type: '0', code: '16' }

	};	
};
module.exports.Information = Information;

Information.prototype.setSection = function( section )
{
	this.section = section;
};

Information.prototype.setOptions = function( options )
{
	this.options = options;
};
Information.prototype.pushSource = function( newSource )
{
	this.pileSources.push(
	{
		lines: this.lines,
		linesStart: this.linesStart,
		linesEnd: this.linesEnd,
		currentLine: this.currentLine,
		position: this.position,
		lineStart: this.lineStart,
		lineEnd: this.lineEnd,
		endOfText: this.endOfText,
		endOfLine: this.endOfLine,
		globals: this.section.globals,
		variables: this.section.variables
	} );
	this.lines = this.scanSource( newSource, { path: 'pushed', source: newSource, number: 0 } );
	this.scanAllSources();
	this.resetSource();
};
Information.prototype.popSource = function()
{
	if ( this.pileSources.length == 0 )
		throw 'internal_error';
	var pop = this.pileSources.pop();
	this.currentLine = pop.currentLine;
	this.lines = pop.lines;
	this.linesStart = pop.linesStart;
	this.linesEnd = pop.linesEnd;
	this.position = pop.position;
	this.lineStart = pop.lineStart;
	this.lineEnd = pop.lineEnd;
	this.endOfLine = pop.endOfLine;
	this.endOfText = pop.endOfText;
	this.section.globals = pop.globals;
	this.section.variables = pop.variables;
};
Information.prototype.setPass = function( start, end, blockNumber, section, pass, caseSensitive )
{
	this.endOfText = false;
    this.endOfLine = false;
	this.section = section;
	this.pass = pass;
	this.blockNumber = blockNumber;
	this.positionLastBlock = blockNumber;
	this.isBasic = false;
	this.exitEndlessLoopLine = -1;
	this.exitEndlessLoopCount = 0;
	this.inExpression = 0;
    this.insideTagCount = 0;
	if ( typeof caseSensitive == 'undefined' )
		//debugger;
	this.caseSensitive = caseSensitive;

    this.linesStart = typeof start != 'undefined' ? start : 0;
	this.linesEnd = typeof end != 'undefined' ? end : this.lines.length;
    this.currentLine = this.linesStart;
	this.position = this.lines[ this.linesStart ].start;
	this.lineStart = this.position;
	this.lineEnd = this.lines[ this.linesStart ].end;
    this.endOfLine = false;
    this.endOfText = start >= end;
	this.linesAdded = 0;
	this.addedBlock = 0;
};
Information.prototype.loadSource = function( sourcePath, options )
{
	var self = this;
	this.sourcePath = sourcePath;
	var currentDir = UTILITIES.getDirectoryFromPath( sourcePath );

	// Load the source
	var source;
	if ( options && options.useSource != '' )
	{
		source = options.useSource;
		options.useSource = '';
	}
	else
	{
		source = UTILITIES.loadFile( sourcePath, { encoding: 'utf8' } );
		if ( !source )
			return null;
	}	
	if ( options && options.addSourceAtStart )
	{
		source = options.addSourceAtStart + source;
		options.addSourceAtStart = '';
	}
	source += '\nclapfin\n';

	// Scan the first source
	this.includes = [];
	this.lines = [];

	// Main source
	var firstInclude =
	{
		path: sourcePath,
		source: source,
		number: 0,
		parent: null,
		offsetLines: 0
	};
	this.includes.push( firstInclude );
	this.lines = this.scanSource( source, firstInclude );
	if ( !getIncludes( source, this.lines, this.lines, 0, currentDir ) )
		return false;

	// All ready!
	this.scanAllSources();
	this.resetSource();
	this.localTags = {}; 	//tags.local;
	this.globalTags = {};	//tags.global;

	if ( this.fzDebug )
		MESSAGES.sourceToLog( this.lines );
	return true;

	// Get local tags
	/*
	var tags = getTags( this.localTags );
	if ( !tags )
	{
		MESSAGES.pushError( { compilerError: 'illegal_tag' } );
		return false;
	}
	function getTags( tagArray )
	{
		var localTags = {};
		var globalTags = {};
		do
		{
			var line = self.getCurrentLine();
			if ( UTILITIES.maybeTagInLine( line ) )
			{
				var tag = UTILITIES.getTagInLine( line );
				if ( tag )
				{
					var done = false;
					switch ( tag.name )
					{
						case 'defineLocalTag':
							if (   tag.parameters[ 0 ].type != 'string'
								|| tag.parameters[ 1 ].type != 'string'
								|| tag.parameters[ 3 ].type != 'string' )
								MESSAGES.pushError( { compilerError: 'illegal_tag' } );
							var tagName = tag.parameters[ 0 ].value;
							if ( localTags[ tagName.toLowerCase() ] )
								MESSAGES.pushError( { compilerError: 'local_tag_already_exist' } );
							var tagDefinition =
							{
								name: tag.parameters[ 0 ].value,
								type: tag.parameters[ 1 ].value,
								value: tag.parameters[ 2 ].value,
								doc: tag.parameters[ 3 ].value,
								domain: tag.parameters[ 4 ] ? tag.parameters[ 4 ] : undefined,
							};
							localTags[ tagDefinition.name ] = tagDefinition;
							done = true;
							break;
						case 'defineGlobalTag':
							if (   tag.parameters[ 0 ].type != 'string'
								|| tag.parameters[ 1 ].type != 'string'
								|| tag.parameters[ 3 ].type != 'string' )
								MESSAGES.pushError( { compilerError: 'illegal_tag' } );
							var tagName = tag.parameters[ 0 ].value;
							if ( globalTags[ tagName.toLowerCase() ] )
								MESSAGES.pushError( { compilerError: 'global_tag_already_exist' } );
							var tagDefinition =
							{
								name: tag.parameters[ 0 ].value,
								type: tag.parameters[ 1 ].value,
								value: tag.parameters[ 2 ].value,
								doc: tag.parameters[ 3 ].value,
								domain: tag.parameters[ 4 ] ? tag.parameters[ 4 ] : undefined,
							};
							localTags[ tagDefinition.name ] = tagDefinition;
							done = true;
							break;
						// Todo, will be very cool...
						case 'replaceLocalTagIf':
							break;
						case 'setFalseLocalTag':
							break;
						case 'setTrueLocalTag':
							break;
						case 'isFalseLocalTag':
							break;
						case 'isTrueLocalTag':
							break;
					}
					if ( done )
					{
						self.blankCurrentLine( '' );
					}
				}
			}
			self.nextLine();
		} while( !self.endOfText );
		return { local: localTags, global: globalTags };
	};
	*/

	// Scan for includes
	function getIncludes( source, lines, parentLines, extra, currentDir )
	{
		var parentPath = parentLines[ 0 ].include.path;
		var info = UTILITIES.scanSourceForTexts( source, [ 'include' ], { checkPosition: 'first' } );
		for ( var i = 0; i < info.length; i++ )
		{
			var found = info[ i ];
			var path = UTILITIES.getString( found.text );
			if ( path == '' )
            {
				MESSAGES.pushError( { compilerError: 'syntax_error', file: path } );
				return false;
			}
			var extension = UTILITIES.getFileExtension( path );
            
			if ( extension.toLowerCase() == 'amos' )
            {
				MESSAGES.pushError( { compilerError: 'cannot_include_amos', file: path } );
				return false;
            }
            else
            {
				/**
				var file = FILESYSTEM.getAOZDrivePathIfExists( path, currentDir, options );
				if ( !file )
				{
					MESSAGES.pushError( { compilerError: 'file_not_found', parameter: paths[ f ] }, true );
				}
				var path = file.path;
				var foundIt = self.includes.find( function( element )
                {
					return element.path == path;
                } );
				*/
				var foundIt = false;
				if ( !foundIt )
                {
					var toInclude = UTILITIES.loadFileIfExists( path, { encoding: 'utf8', noError: true } );
					if( !toInclude && currentDir != undefined )
					{
						toInclude = UTILITIES.loadFileIfExists( currentDir + PATH.sep + path, { encoding: 'utf8' } );
					}
					if( !toInclude )
					{
						toInclude = UTILITIES.loadFileIfExists( options.currentPath + '/includes/' + path, { encoding: 'utf8' } );
					}
					if ( !toInclude )
					{
						// Try from the transpiler's path...
						var transPath = UTILITIES.getDirectoryFromPath( options.transpilerManifestPath );						
						var pPath = transPath + '/' + path;
						toInclude = UTILITIES.loadFileIfExists( pPath, { encoding: 'utf8' } );

						// Try from the Aoz path...
						var pPath = transPath + '/../' + path;
						toInclude = UTILITIES.loadFileIfExists( pPath, { encoding: 'utf8' } );
					}
					if ( !toInclude )
					{
						MESSAGES.pushError( { compilerError: 'cannot_load_file', parameter: path }, true );
					}
					
					// Locate the include in parent lines
					var foundLine = -1;
					for ( var l = 0; l < parentLines.length; l++ )
                    {
						var ln = lines[ l ];
						if ( ln.include.path == parentPath )
						{
							if ( found.start >= ln.localStart && found.end - 1 <= ln.localEnd )
							{
								foundLine = l;
								break;
							}
						}
					}
					if ( foundLine < 0 )
					{
						MESSAGES.pushError( { compilerError: 'internal_error', parameter: path } );
						return false;
					}
					lines[ foundLine ].skip = true;
					var include =
					{
						path: path,
						source: toInclude,
						number: self.includes.length,
						parent: self.includes[ self.includes.length - 1 ],
						offsetLines: foundLine
					};
					self.includes.push( include );
					var newLines = self.scanSource( toInclude, include );
					if ( !getIncludes( toInclude, newLines, newLines ) )
					{
						return true;
					}
					parentLines.endIncludeLines = foundLine + newLines.length;
					lines.splice( foundLine, 0, ...newLines );
               }
			}
		}
	return true;
	}
};

Information.prototype.loadCommand = function( source, options )
{
	source += '\nEnd\n';
	this.lines = this.scanSource( source, { path: 'command', source: source, number: 0 } );
	this.scanAllSources();
	this.resetSource();
	return true;
};
Information.prototype.scanAllSources = function()
{
	var previousPath;
	var offsetSource, offsetLines;
	var total = 0;
	for ( var l =  0; l < this.lines.length; l++ )
	{
		var line = this.lines[ l ];
		if ( previousPath != line.include.path )
		{
			offsetSource = total;
			previousPath = line.include.path;
			offsetLines = l;
		}
		line.start = line.localStart + offsetSource;
		line.end = line.localEnd + offsetSource;
		line.offset = offsetSource;
		line.offsetLines = offsetLines;
		total += line.length;
	}
};
Information.prototype.scanSource = function( source, include )
{
	var lines = [];
	var start = 0;
	var count = 0;
	var delta = 0;
	var end = source.indexOf( '\n', start );
	while ( end >= 0 )
	{
		delta = 0;
		if ( end - start > 0 && source.charAt( end - 1 ) == '\r' )			// Compensates CR/LF
			delta = 1;
		var line = { localStart: start, localEnd: end - delta, length: end + 1 - start, localLine: count++, include: include, skip: false };
		if ( this.fzDebug )
			line.text = source.substring( start, end );
		lines.push( line );
		start = end + 1;
		end = source.indexOf( '\n', start );
	};
	lines.push( { localStart: start, localEnd: source.length, length: source.length - start, localLine: count, include: include, skip: false } )
	return lines;
};
Information.prototype.addCodeAtEnd = function( text )
{
	for ( var l = this.lines.length - 1; l >= 0; l-- )
	{
		var line = this.lines[ l ];
		var lineText = line.include.source.substring( line.localStart, line.localEnd );
		if ( lineText.indexOf( 'clapfin' ) >= 0 )
		{
			var include = 
			{
				path: 'aoz',
				source: text + '\n',
				number: this.includes.length,
				parent: this.includes[ this.includes.length - 1 ],
				offsetLines: line.include.offsetLines + 1,
				skip: false 
			}
			var newLine = 
			{ 
				localStart: 0, 
				localEnd: text.length, 
				localLine: 0,
				length: text.length, 
				include: include
			}
			this.includes.push( include );
			this.lines.splice( l, 0, newLine );
			this.scanAllSources();
			break;
		}
	}
};
Information.prototype.resetSource = function()
{
	this.linesStart = 0;
	this.linesEnd = this.lines.length;
	this.currentLine = 0;
	this.position = 0;
	this.endOfLine = false;
	this.endOfText = false;
	this.lineStart = this.lines[ 0 ].start;
	this.lineEnd = this.lines[ 0 ].end;
};
Information.prototype.scanForTags = function( tags, options, tagOptions )
{
	// Put tag names into an array
	var tagNames = [];
	for ( var t in tags )
		tagNames.push( '#' + t );

	// Scan all sources, respecting the order of inclusion...
	var allTags = [];
	for ( var i = 0; i < this.includes.length; i++ )
	{
		var include = this.includes[ i ];
		var foundTags = UTILITIES.scanSourceForTexts( include.source, tagNames, { caseSensitive: tagOptions.caseSensitive, checkEndChars: [ ':' ], checkPosition: 'first' , replaceWith: null } );
		if ( foundTags.length )
		{
			for ( var t = 0; t < foundTags.length; t++ )
			{
				var foundTag = foundTags[ t ];
				foundTag.position = foundTag.start;
				foundTag.include = include;
				var ok = false;
				for ( var tt in tags )
				{
					var ttt = '#' + tt;
					if ( ( tagOptions.caseSensitive && ttt == foundTag.token ) || ( !tagOptions.caseSensitive && ttt.toLowerCase() == foundTag.token.toLowerCase() ) )
					{
						foundTag.tagDefinition = tags[ tt ];
						ok = true;
						break;
					}
				}
				if ( !ok )
					MESSAGES.pushError( { compilerError: 'internal_error', parameter: 'Tag: ' + foundTag.token } );

				// Remove tag from source?
				if ( tagOptions.replaceWith )
				{
					var withWhat = UTILITIES.getRepeatString( tagOptions.replaceWith, foundTag.end - foundTag.start );
					include.source = include.source.substring( 0, foundTag.start ) + withWhat + include.source.substring( foundTag.end );
				}
			}
			allTags.push( ...foundTags );
		}
	}

	// Keep the last-defined of all tags
	var cleanedTags = [];
	for ( var t = 0; t < allTags.length; t++ )
	{
		var tag = allTags[ t ];
		var clean = cleanedTags.find( function( o )
		{
			return ( o.token == tag.token && o.text == tag.text );
		} );
		if ( !clean )
		{
			cleanedTags.push( tag )
		}
		else
		{
			if ( tag.position > clean.position )
			{
				cleanedTags[ tag.token ] = tag;
		}
	}
	}

	// Now finally scan the tags.
	var error = false;
	for ( var t = 0; t < cleanedTags.length; t++ )
	{
		var currentTag = cleanedTags[ t ];

		currentTag.text = UTILITIES.getSourceText( currentTag.text, 0, [ 'letter', 'number', '$', '@', '%', '-' ], [ ' ', ',', '/' ], { skipOpen: [ '"', "'" ], skipClose: [ '"', "'" ] } )

		var tag = currentTag.tagDefinition;
		var value = getParameter( currentTag.text, tag.type, 0 );
		if ( typeof value == 'undefined' )
		{
			error = true;
			break;
		}
		switch ( tag.type )
		{
			case 'string':
				var OK = true;
				if ( tag.allowed )
				{
					OK = false;
					for ( var aa = 0; aa < tag.allowed.length; aa++ )
					{
						if ( tag.allowed[ aa ] == value )
						{
							OK = true;
							break;
						}
					}
				}
				if ( OK )
				{
					if ( UTILITIES.isArray( tag.value ) )
					{
						if ( !tag.value.find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
						{
							tag.value.push( value );
							tag.updated = true;
						}
					}
					else if ( UTILITIES.isObject( tag.value ) )
					{
						if ( !tag.value[ value ] )
							tag.value[ value ] = 0;
						else
							tag.value[ value ]++;
						tag.updated = true;
					}
					else
					{
						tag.value = value;
						tag.updated = true;
					}
				}
				else
				{
					var text = 'Tag: ' + tagName + ', Authorized values: ';
					for ( var v = 0; v < tag.allowed.length; v++ )
						text += tag.allowed[ v ] + ( v < tag.allowed.length - 1 ? ',' : '' );
					MESSAGES.pushError( { compilerError: 'illegal_tag_parameter', parameter: text } );
					error = true;
				}
				break;

			case 'number':
				var OK = true;
				if ( tag.allowed )
				{
					OK = false;
					for ( var aa = 0; aa < tag.allowed.length; aa++ )
					{
						if ( value >= tag.allowed[ aa ].min && value < tag.allowed[ aa ].max )
						{
							OK = true;
							break;
						}
					}
				}
				if ( OK )
				{
					if ( UTILITIES.isArray( tag.value ) )
					{
						if ( tag.value.indexOf( value ) < 0 )
						{
							tag.value.push( value );
							tag.updated = true;
						}
					}
					else if ( UTILITIES.isObject( tag.value ) )
					{
						tag[ value ] = value;
						tag.updated = true;
                        }
					else
					{
						tag.value = value;
						tag.updated = true;
                    }
                }
				else
				{
					var text = 'Tag: ' + tag.name + ', Authorized values: ';
					for ( var v = 0; v < tag.allowed.length; v++ )
						text += tag.allowed[ v ].min + '<= tag <' + tag.allowed[ v ].max + ( v < tag.allowed.length - 1 ? ',' : '' );
					MESSAGES.pushError( { compilerError: 'illegal_tag_parameter', parameter: text } );
					error = true;
	            }
				break;

			case 'bool':
				if ( UTILITIES.isObject( tag.value ) )
				{
					tag[ value ] = value;
					tag.updated = true;
				}
				else
				{
					tag.value = value;
					tag.updated = true;
				}
				break;

			case 'path':
				value = UTILITIES.cleanPath( PATH.resolve( options.currentPath, value ) );
				if ( UTILITIES.isArray( tag.value ) )
				{
					if ( !tag.value.find( function( element ) { return element.toLowerCase() == value.toLowerCase(); } ) )
					{
						tag.value.push( value );
						tag.updated = true;
					}
        		}
				else if ( UTILITIES.isObject( tag.value ) )
				{
					tag[ value ] = value;
					tag.updated = true;
				}
				else
				{
					tag.value = value;
					tag.updated = true;
				}
				break;
		}
		if ( error )
			break;
	}
	return !error;

	function getParameter( text, type, position )
	{
		if ( type == 'string' || type == 'path' )
		{
			if ( UTILITIES.getCharacterType( text.charAt( 0 ) ) != 'quote' )
				MESSAGES.pushError( { compilerError: 'illegal_tag_parameter', parameter: text }, true );
			return UTILITIES.getString( text );
		}
		else if ( type == 'bool' )
		{
			text = text.toLowerCase();
			if ( text == 'true' || text == '1' )
        return true;
			else if ( text == 'false' || text == '0' )
				return false;
	}
		else if ( type == 'number' )
		{
			var number = UTILITIES.getNumber( text );
			if ( number.type == 'integer' )
				return number.integer;
			else if ( number.type == 'float' )
				return number.float;
		}
		MESSAGES.pushError( { compilerError: 'illegal_tag_parameter', parameter: text }, true );
		return undefined;
	};
};

Information.prototype.getSourceListJson = function( withSources )
{
	/*
	var sourceList = [];
	for ( var i = 0; i < this.includes.length; i++ )
	{
		var include = this.includes[ i ];
		sourceList.push(
		{
			path: include.path,
			source: include.source,
			number: include.number,
			parent: include.parent,
			offsetLines: include.offsetLines
		} );	
	}
	*/
	var json = JSON.stringify( this.includes );
	json  = json.replace(/[\u007F-\uFFFF]/g, function( chr ) 
	{
		return " ";
	})	
	return json;
};

Information.prototype.getCurrentLine = function()
{
	if ( !this.endOfText )
	{
		var line = this.lines[ this.currentLine ];
		return line.include.source.substring( line.start - line.offset, line.end - line.offset );
	}
	return '';
};
Information.prototype.setCurrentLine = function( line )
{
    if ( line < this.linesEnd )
    {
        this.currentLine = line;
		this.position = this.lines[ line ].start;
		this.lineStart = this.lines[ line ].start;
		this.lineEnd = this.lines[ line ].end;
        this.endOfText = false;
        this.endOfLine = false;
	}
	var line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
	this.lineDebugFull = this.lineDebug;
};
Information.prototype.nextLine = function( tab )
{
	this.endOfLine = false;
	while ( !this.endOfText )
	{		
		while ( this.currentLine + 1 < this.linesEnd )
		{
			this.currentLine++;
			this.position = this.lines[ this.currentLine ].start;
			this.lineStart = this.lines[ this.currentLine ].start;
			this.lineEnd = this.lines[ this.currentLine ].end;
			if ( this.lineEnd > this.position )
			{
				if ( typeof tab != 'undefined' )
				{
					for ( var l = this.indentation.length; l < this.currentLine - 1; l++ )
						this.indentation.push( tab );
				}
				var line = this.lines[ this.currentLine ];
				this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
				this.lineDebugFull = this.lineDebug;
				return;
			}
		}
		this.endOfText = true;
		this.endOfLine = true;
	}
};
Information.prototype.getNextLinePosition = function()
{
	var position;
	var line = this.currentLine;
	if ( !this.endOfText )
	{
		while ( line + 1 < this.linesEnd )
		{
			position = this.lines[ ++line ].start;
			if ( this.lines[ line ].end > position )
				break;
		}
	}
	return position;
};
Information.prototype.findLineAndColumn = function( position )
{
	var line;
	var position = typeof position  != 'undefined' ? position : this.position;
	for ( var l = 0; l < this.linesEnd; l++ )
	{
		line = this.lines[ l ];
		if ( position >= line.start && position <= line.end )
			break;
	}
	if ( l < this.linesEnd )
	{
		var column = 0;
		for ( p = line.start; p < position; p++ )
		{
			if ( this.charAt( p ) == '\t' )
				column += this.options.tabWidth;
			else
				column++;
		}
		return { line: line.localLine, column: column, include: line.include };
	}
	return { line: -2, column: -1, include: { path: 'Source not found', source: '', number: 0 } };
};
Information.prototype.setPosition = function( position )
{
	var line, info;
	this.position = position;
	this.endOfLine = false;
	if ( position < this.lineStart || position > this.lineEnd )
	{
		for ( line = 0; line < this.linesEnd; line++ )
		{
			info = this.lines[ line ];
			if ( position >= info.start && position <= info.end )
			{
				this.currentLine = line;
				this.lineEnd = info.end;
				this.endOfText = false;
				return;
			}
		}
		this.pushError( 'syntax_error' );
	}
	var line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( position - line.offset, line.end - line.offset );
};
Information.prototype.charAt = function( position )
{
	var line = this.lines[ this.currentLine ];
	return line.include.source.charAt( position - line.offset );
}
Information.prototype.charCodeAt = function( position )
{
	var line = this.lines[ this.currentLine ];
	return line.include.source.charCodeAt( position - line.offset );
}
Information.prototype.substr = function( start, end )
{
	var line = this.lines[ this.currentLine ];
	return line.include.source.substr( start - line.offset, end );
}
Information.prototype.substring = function( start, end )
{
	var line = this.lines[ this.currentLine ];
	if ( typeof end != 'undefined' )
		return line.include.source.substring( start - line.offset, end - line.offset );
	return line.include.source.substring( start - line.offset );
}
Information.prototype.extractLabel = function()
{
	var type = this.checkLabelType();
	if ( type == 'label' || type == 'procedure' )
		this.extractNextWord();
	else if ( type == 'expression' )
		this.compileExpression( EXPFLAG_ENDONCOLON | EXPFLAG_ENDONCOMMA );
	else
		this.throwError( { error: 'syntax_error' } );
	return type;
};
Information.prototype.getVariableInfo = function( text, options )
{
	if ( !options )
		console.log( '*** options null!' );

	var name = UTILITIES.replaceStringInText( text, ' ', '_' );
	var token = name.toLowerCase();
	var tokenCode = name;
	var type, codeInit;
	var oneBased = '0';			// TODO! Corriger~! Pas tout de suite... ;)
	var c = text.substring( text.length - 1 );
	switch ( c )
	{
		case '#':
			type = '1';
			name = name.substring( 0, name.length - 1 ) + '_f';
			token = token.substring( 0, token.length - 1 ) + '_f';
			tokenCode = tokenCode.substring( 0, tokenCode.length - 1 ) + '_f';
			codeInit = 'this.vars.' + tokenCode + '=0.0';
			if ( options.isArray )
			{
				token += '_array';
				tokenCode += '_array';
				codeInit = 'this.vars.' + tokenCode + '=new AArray(this.aoz,0,' + oneBased + ')';
			}
			break;
		case '$':
			type = '2';
			codeInit = 'this.vars.' + tokenCode + '=""';
			if ( options.isArray )
			{
				token += '_array';
				tokenCode += '_array';
				codeInit = 'this.vars.' + tokenCode + '=new AArray(this.aoz,"",' + oneBased + ')';
			}
			break;
		case '@':
			type = '3';
			name = name.substring( 0, name.length - 1 ) + '_c';
			token = token.substring( 0, token.length - 1 ) + '_c';
			tokenCode = tokenCode.substring( 0, tokenCode.length - 1 ) + '_c';
			codeInit = 'this.vars.' + tokenCode + '={}';
			if ( options.isArray )
			{
				token += '_array';
				tokenCode += '_array';
				codeInit = 'this.vars.' + tokenCode + '=new AArray(this.aoz,{},' + oneBased + ')';
			}
			break;
		default:
			type = '0';
			codeInit = 'this.vars.' + tokenCode + '=0';
			if ( options.isArray )
			{
				token += '_array';
				tokenCode += '_array';
				codeInit = 'this.vars.' + tokenCode + '=new AArray(this.aoz,0,' + oneBased + ')';
			}
			break;
	}
	return { name: name, nameReal: text, token: token, tokenCode: tokenCode, type: type, codeInit: codeInit, isParameter: ( options.isParameter ? true : false ) };
};

Information.prototype.newVariable = function( variableInfo, isArray = false )
{
	variable =
	{
		name: variableInfo.name,
		token: variableInfo.token,
		tokenCode: variableInfo.tokenCode,
		codeInit: variableInfo.codeInit,
		nameReal: variableInfo.nameReal,
		nameRealLower: variableInfo.nameReal.toLowerCase(),
		type: variableInfo.type,
		numberType: variableInfo.type,
		isArray: isArray,
		isParameter: variableInfo.isParameter,
		global: false,
		shared: false,
		numberOfDimensions: 0,
		defined: false,
		nonDimensionned: false,
		index: this.variablesCount++
	}
	return variable;
};
Information.prototype.getVariable = function( setGlobalIfNew, flags )
{
	flags = typeof flags == 'undefined' ? 0 : flags;

	var name = this.variableInfo.name;
	var nameReal = this.variableInfo.nameReal;
	var token = this.variableInfo.token;
	var variable = this.section.variables[ token ];
	if ( variable && this.caseSensitive )
	{
		if ( variable.nameReal != name )
			variable = undefined;
	}
	if ( !variable && ( flags & GETVARIABLEFLAG_VARPTR ) != 0 )
	{
		variable = this.section.variables[ token + '_array' ];
		if ( variable && this.caseSensitive )
		{ 
			if ( !this.section.variables[ name + '_array' ] )
				variable = undefined;
		}
	}
	
	if ( !variable )
	{
		// Check variable name for conflict
		var error = this.checkVariableName( this.variableInfo.nameReal );
		if ( error )
			this.throwError( { error: 'variable_name_conflict', parameter: [ error.type, error.name ] }, true );

		// A global variable?
		variable = this.getGlobalVariable( this.variableInfo );
		var isAlreadyGlobal = false;
		if ( this.section.globals[ token ] )
		{
			if ( !this.caseSensitive || name == this.section.globals[ token ].nameReal )
				isAlreadyGlobal = true;
		}
		if ( !variable && ( flags & GETVARIABLEFLAG_SHARED ) != 0 )
		{
			variable = this.getSharedVariable( this.variableInfo );
		}
		if ( !variable )
		{
			if ( this.isArray )
			{
				this.throwError( { error: 'non_dimensionned_array', parameter: name } );
				bad = 1;
			}
			variable = this.newVariable( this.variableInfo );
			variable.global = ( setGlobalIfNew == 1 ? true : isAlreadyGlobal );
			variable.shared = ( setGlobalIfNew == 2 ? true : isAlreadyGlobal );
			if ( setGlobalIfNew )
				this.rootSection.globals[ token ] = variable;
			this.section.variables[ token ] = variable;
		}
		/*else
		{
			if ( !variable.isGlobal )
				this.section.variables[ token ] = variable;
		}
		*/
 	}

	var code;
	var end;
	var error;
	var dims = true;
	var parameters = '';
	while ( !(flags & GETVARIABLEFLAG_NOCODE) )
	{
		if ( !variable.isArray )
		{
			if ( flags & ( GETVARIABLEFLAG_INPUT | GETVARIABLEFLAG_ADD ) )
			{
				code = '{'
				if ( ( variable.global || variable.shared ) && this.section.type != 'main' )
					code += 'root:true,';
				code += 'name:"' + variable.tokenCode + '",type:' + variable.type + '}';
				break;
			}
			if ( ( variable.global || variable.shared ) && this.section.type != 'main' )
				code = 'this.root.vars.' + variable.tokenCode;
			else if ( this.options.directMode )
				code = '(this.parent?this.parent:this.root).vars.' + variable.tokenCode;
			else
				code = 'vars.' + variable.tokenCode;
			this.variableSection = code;
			if ( flags & ( GETVARIABLEFLAG_INC | GETVARIABLEFLAG_DEC ) )
			{
				if ( variable.type == '2' )
				{
					error = { error: 'type_mismatch', parameter: this.getExpressionErrorParameter() };
					break;
				}
				code += ( flags & GETVARIABLEFLAG_DEC ) == 0 ? '++' : '--';
				break;
			}
			if ( flags & ( GETVARIABLEFLAG_SORT | GETVARIABLEFLAG_MATCH ) )
			{
				error = 'syntax_error';
				break;
			}
		}
		else
		{
			if ( flags & ( GETVARIABLEFLAG_INPUT | GETVARIABLEFLAG_ADD ) )
			{
				code = '{';
				if ( ( variable.global || variable.shared ) && this.section.type != 'main' )
					code += 'root:true,';
				code += 'name:"' + variable.tokenCode + '",type:' + variable.type + ',';
			}
			else
			{
				if ( ( variable.global || variable.shared ) && this.section.type != 'main' )
					code = 'this.root.vars.' + variable.tokenCode;
				else
					code = 'vars.' + variable.tokenCode;
				this.variableSection = code;
			}

			var savePosition = this.position;
			this.extractNextWord();
			if ( flags & GETVARIABLEFLAG_SORT )
				code += '.sort(';
			else if ( flags & GETVARIABLEFLAG_MATCH )
				code += '.match(';
			else if ( flags & GETVARIABLEFLAG_INC )
				code += '.inc(';
			else if ( flags & GETVARIABLEFLAG_DEC )
				code += '.dec(';
			else if ( flags & GETVARIABLEFLAG_SETVALUE )
			{
				if ( this.text == '(' )
				code += '.setValue(';
				else
				{
					dims = false;
					this.position = savePosition;
				}
			}
			else if ( flags & GETVARIABLEFLAG_GETVALUE )
			{
				if ( this.text == '(' )
					code += '.getValue(';
				else
				{
					dims = false;
					this.position = savePosition;
				}
			}
			parameters = '[';
			if ( dims )
			{
				if ( flags & GETVARIABLEFLAG_VARPTR )
				{
					this.peekNextWord();
					if ( this.text == ')' )
						flags |= GETVARIABLEFLAG_NOPARAMETERS;
				}
				var undef = false;
				if ( !( flags & GETVARIABLEFLAG_NOPARAMETERS ) )
				{
					if ( variable.numberOfDimensions )
					{
						for ( var d = 0; d < variable.numberOfDimensions; d++ )
						{
							this.compileExpression( ( d == variable.numberOfDimensions - 1 ) ? EXPFLAG_ENDONBRACKET : EXPFLAG_ENDONCOMMA );
							if ( this.numberType == '1' )
							{
								this.result = 'aoz.fp2Int(' + this.result + ')';
							}
							end = this.peekNextWord();
							if ( this.text != ',' && this.text != ')' )
							{
								error = 'syntax_error';
								break;
							}
							if ( this.result != 'undefined' )
							{
								if ( d > 0 )
									parameters += ',';
								parameters += this.result;
							}
							else
							{
								undef = true;
							}
							this.setNextWord( end );
						}
					}
					else
					{
						while( true )
						{
							this.compileExpression( EXPFLAG_ENDONBRACKET | EXPFLAG_ENDONCOMMA );
							if ( this.numberType == '1' )
								this.result = 'aoz.fp2Int(' + this.result + ')';
							parameters += this.result;
							end = this.extractNextWord();
							if ( this.text == ')' )
								break;
							if ( d > 0 )
								parameters += ',';
						}
					}
				}
				else if ( !( flags & GETVARIABLEFLAG_NOPARAMETERS2 ) )
				{
					this.extractNextWord();
					if ( this.text != ')' )
						this.throwError( { error: 'syntax_error' } );
				}
			}
			parameters += ']';
			if ( flags & ( GETVARIABLEFLAG_INC | GETVARIABLEFLAG_DEC ) )
			{
				code += parameters + ')';
			}
			else if ( flags & GETVARIABLEFLAG_INPUT )
			{
				code += 'dimensions:' + parameters + '}';
			}
			else if ( flags & GETVARIABLEFLAG_SORT )
			{
				code += parameters + ')';
			}
			else if ( flags & GETVARIABLEFLAG_MATCH )
			{
				code += parameters + ',';
			}
			else if ( flags & GETVARIABLEFLAG_ADD )
			{
				code += 'dimensions:' + parameters + '}';
			}
			else if ( flags & ( GETVARIABLEFLAG_INC | GETVARIABLEFLAG_DEC ) )
			{
				code += parameters + ')';
			}
			else if ( flags & GETVARIABLEFLAG_GETVALUE )
			{
				if ( dims )
				{
					if ( undef )
						code = code.substring( 0, code.length - '.getValue('.length ) + '.getArray('; 
					code += parameters + ')';
				}
				if ( variable.nonDimensionned )
				{
					if ( variable.nonDimensionned > 1 )
						this.throwError( { error: 'non_dimensionned_array', parameter: variable.name } );
					variable.nonDimensionned++;
				}	
			}
			else if ( flags & GETVARIABLEFLAG_SETVALUE )
			{
				if ( dims )
				code += parameters + ',%VALUE)';
				if ( variable.nonDimensionned )
				{
					if ( variable.nonDimensionned > 1 )
						this.throwError( { error: 'non_dimensionned_array', parameter: variable.name } );
					variable.nonDimensionned++;
				}	
			}
			if ( !variable.code )
				variable.code = code;
		}
		break;
	}
	if ( error )
		this.throwError( error );

	if ( flags & GETVARIABLEFLAG_SETVALUE )
		variable.defined = true;
	if ( ( flags & GETVARIABLEFLAG_SETVALUE ) == 0 && !variable.defined && !variable.isArray || dims == false )
	{
		var warn = true;
		variable.toSetDefault = true;

		var self = this;
		function checkSyntax( syntax )
		{
			for ( var p = 0; p < syntax.length; p++ )
			{
				var vToken = self.getVariableInfo( syntax[ p ].nameReal, {} ).token;
				if ( vToken == token )	
				{
					if ( !self.caseSensitive || syntax[ p ].nameReal == nameReal )
					{
						variable.defined = true;
						variable.toSetDefault = false;
						return false;
					}
				}
			}
			return true;
		};
		function checkVariables( variables )
		{
			if ( variables[ token ] && !variables[ token ].global )
			{
				variable.defined = true;
				variable.toSetDefault = false;
				return false;
			}
			return true;
		};

		if ( this.section.type == 'procedure' )
		{
			if ( this.section.variables[ token ] && !this.section.variables[ token ].global )
				warn = true;
		}
		if ( this.section.type == 'class' ) 
		{
			if ( this.section.variables[ token ] && !this.section.variables[ token ].global )
			{
				variable.defined = true;
				variable.toSetDefault = false;
				warn = false;
			}
			warn = true;
		}
		if ( variable.isParameter )
			warn = false;
		if ( warn )
		{
			var pSection;
			if ( this.section.type == 'procedure' )
				pSection = this.section.parentSection;
			else if ( this.section.type == 'class'  )
				pSection = this.section;
			else if ( this.section.type == 'method' )
				pSection = this.section.parentSection;
			if ( pSection )
			{
				if ( pSection.type == 'main' )
					warn = checkVariables( pSection.variables );
				else
					warn = checkSyntax( pSection.syntax );
			}
			if ( this.section.type == 'method' && !warn )
				variable.global = true;
		}
		if ( warn && ( flags & GETVARIABLEFLAG_NOWARNING ) == 0 )
		{
			if ( variable.type == '3' )
				this.throwError( { error: 'object_variable_not_defined', parameter: variable.name }, true );
			else
				this.warning( 'variable_not_declared', variable.name );
		}
	}
	this.text = variable.name;
	this.returnType = variable.type;
	this.numberType = variable.numberType;
	this.result = code;
	this.variableDefinition = variable;
	return { variable: variable, code: code, parameters: parameters };
};
Information.prototype.assignToVariable = function( variable, flags, expCode )
{	
	var code;
	var exp;
	this.doNotAssign = false;
	if ( !expCode )
	{
		exp = this.compileExpression( EXPFLAG_ENDONCOLON | flags );
		if ( !this.checkTypes( exp.type, variable.variable.type ) )
			this.throwError( { error: 'type_mismatch', parameter: this.getExpressionErrorParameter() } );
		expCode = exp.code;
	}
	if ( this.pass == 1 )
	{
		if ( variable.variable.type == '3' && exp && exp.classDefinition )
			variable.variable.classDefinition = exp.classDefinition;
		if ( !this.doNotAssign )
			code = 'dummy';
	}
	if ( this.pass == 2 )
	{
		if ( !this.doNotAssign )
		{
			if ( variable.variable.type == '0' )
			{
				if ( exp && exp.constant )
				{
					var codeInt = UTILITIES.fp2Int( expCode );
					if ( !isNaN( codeInt ) )
						expCode = codeInt;
				}
				else 
					expCode = 'aoz.fp2Int(' + expCode + ')';
			}		
			if ( variable.variable.isArray )
				code = UTILITIES.replaceStringInText( variable.code, '%VALUE', expCode );
			else
				code = variable.code + '=' + expCode + ';';
		}
	}
	return code;
};
Information.prototype.checkLabelType = function()
{
	var result = 'none';
	var start = this.position;
	this.extractNextWord();
	if ( this.endOfInstruction )
		result = 'none';
	else if ( this.type == 'number' )
	{
		this.peekNextWord();
		result = 'label';
		if ( !this.peekEndOfInstruction )
		{
			if ( this.text != ',' )
				result = 'expression';
		}
		this.position = start;
		this.extractNextWord();
	}
	else if ( this.type == 'variable' )
	{
		if ( this.section.labels[ this.textLower ] && ( !this.caseSensitive || this.section.labels[ this.textLower ].nameReal == this.text ) )
			result = 'label';
		else
			result = 'expression';
	}
	else if ( this.type == 'procedure' || this.type == 'label' )
		result = this.type;
	else
		result = 'expression';
	if ( result == 'number' || result == 'variable' )
	{
		this.extractNextWord();
		if ( !this.endOfInstruction && this.text != ',' )
			result = 'expression';
	}
	if ( result == 'variable' || result == 'expression' )
		this.section.putAllLabels = true;
	this.setPosition( start );
	return result;
}
Information.prototype.compileExpression = function( flags = 0 )
{
	this.numberOfOperators = 0;
	this.numberOfOperands = 0;
	var parameter = false;
	var parameterName;
	var saveWith = this.section.withObject;
	this.expressionObject = null;
	var save004 = this.startOfExpression;
	this.startOfExpression = this.position;
	this.endOfExpression = this.position;
	if ( ( flags & EXPFLAG_HANDLENEWSYNTAX ) != 0 )
	{
		do
		{
			this.extractNextWord( 'checknewsyntax' );
		} while( this.type == 'nextline' );
		parameter = this.parameter;
		parameterName = this.parameterName;
		parameterToken = this.parameterToken;
		flags &= ~EXPFLAG_HANDLENEWSYNTAX;
	}
	var exp = this.getExpression( flags );
	this.result = exp.code;
	this.returnType = exp.type;
	this.constant = exp.constant;
	if ( parameter )
	{
		exp.parameter = true;
		exp.parameterName = parameterName;
		exp.parameterToken = parameterToken;
	}
	var l = Math.min( this.position - this.startOfExpression, 32 );
	exp.source = this.substr( this.startOfExpression, l );
	this.startOfExpression = save004;
	this.section.withObject = saveWith;
	return exp;
};
Information.prototype.getExpression = function( flags )
{
	var self = this;
	var pile = [];
	var code = 'undefined';
	var type = '?';
	var bool = ( flags & EXPFLAG_COMPARAISON ) != 0;
	var end;
	var notConstant = false;
	var error = null;
	var text;
	this.inExpressionFlags[ ++this.inExpression ] = flags;
	try
	{
		var operand = this.getOperand( flags );
		end = operand.end;
		if ( operand.error )
			throw operand.error;
		this.numberOfOperands++;
		pile.push( { operand: operand, operator: { priority: 0 } } );
		if ( !operand.end || operand.embeddedOperator )
		{
			var operator = this.getOperator( flags, operand.embeddedOperator );
			end = operator.end;
			if ( operator.error )
				throw operator.error;
			if ( !operator.end )
			{
				this.numberOfOperators++;
				do
				{
					var quit = false;

					operand = this.getOperand( flags );
					this.numberOfOperand++;
					end = operand.end;
					if ( operand.error )
						throw operand.error;

					var previous = pile[ pile.length - 1 ];
					if ( pile.length > 1 )
					{
						if ( operator.priority <= previous.operator.priority )
						{
							do
							{
								// Get preprevious
								var prePrevious = pile[ pile.length - 2 ];

								// Check types
								var tOperand1 = prePrevious.operand.type;
								var tOperand2 = previous.operand.type;
								var bOperand1 = prePrevious.operand.bool;
								var bOperand2 = previous.operand.bool;
								var tOperator = previous.operator.typeOperands == '?' ? tOperand1 : previous.operator.typeOperands;
								var bOperator = previous.operator.bool;
								if ( previous.operator.code != '%1.%2' )
									checkTheTypes( tOperator, tOperand1, tOperand2 );

								// Output code
								var opCode;
								if ( tOperator == '2' )
								{
									opCode = previous.operator.codeString;
									bool = ( previous.operator.type == '0' );
								}
								else
								{
									if ( !previous.operator.codeComp )
									{
										opCode = previous.operator.code;
										bool = false;
									}
									else
									{
										if ( bOperator )
										{
											opCode = previous.operator.codeComp;
											bool = true;
										}
										else if ( bOperand1 && bOperand2 )
										{
											opCode = previous.operator.codeComp;
											bool = true;
										}
										else if ( bOperand1 )
										{
											opCode = previous.operator.codeComp;
											if ( !previous.operand.done )
												previous.operand.code = '(' + previous.operand.code + ')!=0';
											bool = true;
										}
										else if ( bOperand2 )
										{
											opCode = previous.operator.codeComp;
											if ( !prePrevious.operand.done )
												prePrevious.operand.code = '(' + prePrevious.operand.code + ')!=0';
											bool = true;
										}
										else
										{
											if (  ( flags & EXPFLAG_COMPARAISON ) != 0 && ( !prePrevious.operand.done || !previous.operand.done ) )
											{
												opCode = previous.operator.codeComp;
												bool = true;
											}
											else
											{
												opCode = previous.operator.code;
												bool = previous.operator.bool;
											}
										}
									}
								}
								var t = ( previous.operator.type == '?' ? tOperator : previous.operator.type );
								prePrevious.operand.type = ( t == '3' ? previous.operand.type : t );
								if ( t == 3 )
								{
									text = '';
									if ( prePrevious.operand.code.indexOf( '_skipop_' ) >= 0 )
										text = previous.operand.code + prePrevious.operand.code.substring( prePrevious.operand.code.indexOf( '_skipop_' ) + 8 );
									else if ( previous.operand.code.startsWith( 'this.' ) )
										previous.operand.code = previous.operand.code.substring( 5 );
									if ( previous.operand.code.indexOf( '_skipop_' ) >= 0 )
										text = previous.operand.code + previous.operand.code.substring( previous.operand.code.indexOf( '_skipop_' ) + 8 );
									if ( !text )
									{
										text = UTILITIES.replaceStringInText( opCode, "%1", prePrevious.operand.code );
										text = UTILITIES.replaceStringInText( text, "%2", previous.operand.code );
									}
								}
								else
								{
									text = UTILITIES.replaceStringInText( opCode, "%1", prePrevious.operand.code );
									text = UTILITIES.replaceStringInText( text, "%2", previous.operand.code );
								}
								prePrevious.operand.code = text;
								prePrevious.operand.notConstant = true;
								prePrevious.operand.bool = bool;
								prePrevious.operand.done = true;
								pile.length -= 1;
								if ( previous.operand == operand )
									break;
								previous = pile[ pile.length - 1 ];
							} while ( operator.priority < previous.operator.priority );
							pile.push( { operand: operand, operator: operator } );
						}
						else
						{
							pile.push( { operand: operand, operator: operator } );
						}
					}
					else
					{
						pile.push( { operand: operand, operator: operator } );
					}
					operator = this.getOperator( flags, operand.embeddedOperator );
					if ( operator.error )
						throw operator.error;
				} while( !quit && !operator.end );
			}
			else
			{
				this.inExpression--;
				return { type: operand.type, code: operand.code, bool: bool, error: null, end: operator.end, constant: !operand.notConstant, classDefinition: operand.classDefinition, isArray: operand.isArray };
			}
		}
		if ( pile.length > 0 )
		{
			var last = pile.pop();
			if ( pile.length > 0 )
			{
				var previous;
				while ( pile.length > 0 )
				{
					previous = pile[ pile.length - 1 ];

					// Check types
					var tOperand1 = previous.operand.type;
					var tOperand2 = last.operand.type;
					var bOperand1 = previous.operand.bool;
					var bOperand2 = last.operand.bool;
					var tOperator = last.operator.typeOperands == '?' ? tOperand1 : last.operator.typeOperands;
					var bOperator = last.operator.bool;
					if ( last.operator.code != '%1.%2' )
					checkTheTypes( tOperator, tOperand1, tOperand2 );

					// Output code
					var opCode;
					if ( tOperator == '2' )
					{
						opCode = last.operator.codeString
						bool = false;
					}
					else
					{
						if ( !last.operator.codeComp )
						{
							opCode = last.operator.code;
							bool = false;
						}
						else
						{
							if ( bOperator )
							{
								opCode = last.operator.codeComp;
								bool = true;
							}
							else if ( bOperand1 && bOperand2 )
							{
								opCode = last.operator.codeComp;
								bool = true;
							}
							else if ( bOperand1 )
							{
								opCode = last.operator.codeComp;
								if ( !last.operand.done )
									last.operand.code = '(' + last.operand.code + ')!=0';
								bool = true;
							}
							else if ( bOperand2 )
							{
								opCode = last.operator.codeComp;
								if ( !previous.operand.done )
									previous.operand.code = '(' + previous.operand.code + ')!=0';
								bool = true;
							}
							else
							{
								if ( ( flags & EXPFLAG_COMPARAISON ) != 0 && ( !previous.operand.done || !last.operand.done ) )
								{
									opCode = last.operator.codeComp;
									bool = true;
								}
								else
								{
									opCode = last.operator.code;
									bool = last.operator.bool;
								}
							}
						}
					}
					var t = ( last.operator.type == '?' ? tOperator : last.operator.type );
					previous.operand.type = ( t == '3' ? last.operand.type : t );
					if ( t == 3 )
					{
						text = '';
						if ( previous.operand.code.indexOf( '_skipop_' ) >= 0 )
							text = last.operand.code + previous.operand.code.substring( previous.operand.code.indexOf( '_skipop_' ) + 8 );
						else if ( last.operand.code.startsWith( 'this.' ) )
							last.operand.code = last.operand.code.substring( 5 );
						if ( last.operand.code.indexOf( '_skipop_' ) >= 0 )
							text = previous.operand.code + last.operand.code.substring( last.operand.code.indexOf( '_skipop_' ) + 8 );
						if ( !text )
						{
							text = UTILITIES.replaceStringInText( opCode, "%1", previous.operand.code );
							text = UTILITIES.replaceStringInText( text, "%2", last.operand.code );
						}
					}
					else
					{
						text = UTILITIES.replaceStringInText( opCode, "%1", previous.operand.code );
						text = UTILITIES.replaceStringInText( text, "%2", last.operand.code );
					}
					previous.operand.code = text;
					previous.operand.notConstant = true;
					previous.operand.bool = bool;
					previous.operand.end = last.operand.end;
					previous.operand.done = true;
					last = pile.pop();
				}
				code = previous.operand.code;
				type = previous.operand.type;
				end = previous.operand.end;
				notConstant = previous.operand.notConstant;
				bool = previous.operand.bool;
			}
			else
			{
				code = last.operand.code;
				type = last.operand.type;
				end = last.operand.end;
				notConstant = last.operand.notConstant;
				bool = last.operand.bool;
			}
		}
	}
	catch ( err )
	{
		if ( err == 'halt' )
			throw err;
		if ( ( flags & EXPFLAG_NOERRORS ) == 0 )
		{
			error = err;
			if ( typeof err == 'string' )
			{
				this.throwError( { error: err } );
			}
			else
				throw err;
		}
	}
	this.inExpression--;
	return { type: type, code: code, end: end, bool: bool, error: error, constant: !notConstant };

	function checkTheTypes( tOperator, tOperand1, tOperand2 )
	{
		switch ( tOperator )
		{
			case '0':
			case '1':
				if ( ( tOperand1 != '0' && tOperand1 != '1' ) || ( tOperand2 != '0' && tOperand2 != '1' ) )
					self.throwError( { error: 'type_mismatch', parameter: self.getExpressionErrorParameter() } );
				break;
			case '2':
				if ( tOperand1 != '2' || tOperand2 != '2' )
					self.throwError( { error: 'type_mismatch', parameter: self.getExpressionErrorParameter() } );
				break;
			case '3':
				break;
			default:
				self.throwError( { error: 'type_mismatch', parameter: self.getExpressionErrorParameter() } );
		}
	}
};
Information.prototype.getOperand = function( flags )
{
	var type = '?';
	var notConstant = false;
	var end = 0;
	var code = 'undefined';
	var bool = false;
	var isArray = false;
	var error;
	var start = this.position;
	var embeddedOperator;

	if ( this.endOfLine )
	{
		end = EXPFLAG_ENDOFINSTRUCTION;
	}
	else
	{
		this.type = '';
		var scan = null;
		do
		{
			this.extractNextWord( ( flags & EXPFLAG_WANTNEWOBJECT ) != 0 ? 'wantObjectName' : '', { } );
		} while( this.type == 'nextline' );
		this.endOfExpression = this.position;
		flags &= ~EXPFLAG_WANTNEWOBJECT; 
		if ( this.type == 'bracket' && this.text == ')' )
		{
			if ( ( flags & EXPFLAG_ENDONBRACKET ) == 0 )
				error = 'syntax_error';
			this.setPosition( start );
			end = EXPFLAG_ENDOFINSTRUCTION | EXPFLAG_ENDONBRACKET;
		}
		else if (  this.type == '' && ( this.endOfLine || this.endOfInstruction ) )
		{
			end = EXPFLAG_ENDOFINSTRUCTION;
		}
		else if ( this.type == 'constant' )
		{
			code = this.code;
			type = this.returnType;
			notConstant = false;
		}
		else if ( this.textLower == 'new' )
		{
			return this.getOperand( flags | EXPFLAG_WANTNEWOBJECT );
		}
		else
		{
			switch ( this.type )
			{
				case 'token':
					var token = this.token;
					var good;
					switch ( this.token.token )
					{
						case 'as':
							good = ( flags & EXPFLAG_ENDONAS ) != 0;
							end = EXPFLAG_ENDONAS | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'then':
							good = ( flags & EXPFLAG_ENDONTHEN ) != 0 ;
							end = EXPFLAG_ENDONTHEN | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'else':
						case 'else if':
							good = ( flags & EXPFLAG_ENDONCOLON ) != 0 ;
							end = EXPFLAG_ENDONCOLON | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'to':
							good = ( flags & EXPFLAG_ENDONTO ) != 0 ;
							end = EXPFLAG_ENDONTO | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'step':
							good = ( flags & EXPFLAG_ENDONSTEP ) != 0 ;
							end = EXPFLAG_ENDONSTEP | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'goto':
							good = ( flags & EXPFLAG_ENDONGOTO ) != 0 ;
							end = EXPFLAG_ENDONGOTO | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'gosub':
							good = ( flags & EXPFLAG_ENDONGOSUB ) != 0 ;
							end = EXPFLAG_ENDONGOSUB | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'proc':
							good = ( flags & EXPFLAG_ENDONPROC ) != 0 ;
							end = EXPFLAG_ENDONPROC | EXPFLAG_ENDOFPARAMETER;
							break;
						case 'true':
							good = true;
							code = 'true';
							type = '0';
							notConstant = false;
							bool = true;
							end = EXPFLAG_ENDONBOOL;
							break;
						case 'false':
							good = true;
							code = 'false';
							type = '0';
							notConstant = false;
							bool = true;
							end = EXPFLAG_ENDONBOOL;
							break;
						case 'this@':
							good = true;
							code = 'this.root';
							type = '3';
							notConstant = true;
							bool = false;
							end = EXPFLAG_ENDOFPARAMETER;
							start = this.position;
							break;
	
						default:
							break;
					}
					if ( end )
					{
						if ( !good )
							error = 'syntax_error';
						this.setPosition( start );
						break;
					}

					// Special case for NOT
					if ( this.token.token == 'not' )
					{
						var ope = this.getOperand( flags );
						if ( ope.type != '0' )
							error = 'type_mismatch';
						code = '!(' + ope.code + ')';
						type = ope.type
						notConstant = ope.notConstant;
						break;
					}

					// Must be a function
					var foundSyntax = '';
					var isVariable = false;
					for ( var t = 0; t < token.params.length; t++ )
					{
						if ( token.params[ t ].charAt( 0 ) == 'V' || this.getCharacterType( token.params[ t ].charAt( 0 ) ) == 'number' )
						{
							foundSyntax = token.params[ t ].charAt( 0 );
							if ( foundSyntax == 'V' )
							{
								isVariable = true;
								foundSyntax += token.params[ t ].charAt( 1 );
							}
							break;
						}
					}
					if ( foundSyntax == '' )
						error = 'syntax_error';
					if ( typeof token.compile == 'undefined' )
						error = 'function_not_implemented';
					if ( error )
						break;

					if ( typeof token.compile == 'string' && token.compile.indexOf( '#function' ) == 0 )
					{
						var func = token.compile.substring( 10 );
						code = specialExpCases[ func ].call( this );
						type = this.returnType;
						notConstant = true;
						break;
					}

					// Extract the parameters
					var numberOfParams = -1;
					var parameters = [];
					var positions = [];
					var e = this.peekNextWord();
					if ( this.text == '(' )
					{
						this.setNextWord( e );

						var params = 0;
						while( true )
						{
							positions[ foundSyntax.length ] = this.position;
							this.acceptCommas = true;
							e = this.peekNextWord();

							if ( this.text == ')' )
							{
								// Missing last parameter?
								if ( foundSyntax.charAt( foundSyntax.length - 1 ) == ',' || foundSyntax.charAt( foundSyntax.length - 1 ) == 't')
								{
									foundSyntax += '?';
									parameters[ params++ ] = 'undefined';
								}
								numberOfParams = params;
								this.setNextWord( e );
								break;
							}

							if ( this.text != ')' )
							{
								exp = this.getExpression( EXPFLAG_ENDONBRACKET | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO );
								parameters[ params ] = exp.code;
								foundSyntax += exp.type;
							}
							e = this.peekNextWord();
							if ( this.text == ',' )
							{
								foundSyntax += ','
								this.setNextWord( e );
							}
							else if ( this.textLower == 'to' )
							{
								foundSyntax += 't'
								this.setNextWord( e );
							}
							else if ( this.text == ')' )
							{
								numberOfParams = params;
								this.setNextWord( e );
								break;
							}
							else
							{
								error = 'type_mismatch';
								break;
							}
							params++;
						}
					}

					var found = false;
					for ( var s = 0; s < token.params.length; s++ )
					{
						var syntax = token.params[ s ];

						if ( syntax.charAt( 0 ) == foundSyntax.charAt( 0 ) )
						{
							if ( foundSyntax == syntax )
							{
								found = true;
								break;
							}

							if ( foundSyntax.length == syntax.length )
							{
								var paramNumber = 0;
								for ( var p = 1; p < syntax.length; )
								{
									if ( foundSyntax.charAt( p ) != syntax.charAt( p ) )
									{
										if ( foundSyntax.charAt( p ) == '?' )
										{
											foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
										}
										if ( this.getCharacterType( syntax.charAt( p ) ) == 'letter' )
										{
											syntax = syntax.substring( 0, p ) + String.fromCharCode( syntax.charCodeAt( p ) - 65 + 48 ) + syntax.substring( p + 1 );
											if ( syntax.charAt( p ) != foundSyntax.charAt( p ) )
											{
												error = 'type_mismatch';
											}
										}
										else if ( this.getCharacterType( syntax.charAt( p ) ) == 'number' )
										{
											if ( syntax.charAt( p ) !=  foundSyntax.charAt( p ) )
											{
												if ( syntax.charAt( p ) == '3' && foundSyntax.charAt( p ) == '0' )
												{
													parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*aoz.degreeRadian';
												}
												else
												{
													error = 'type_mismatch';
												}
											}
										}
										else
										{
											if ( syntax.charAt( p ) != '?' )
											{
												error = 'type_mismatch';
											}
										}
									}
									if ( this.getCharacterType( syntax.charAt( p ) ) == 'number' || syntax.charAt( p ) == '?' )
										paramNumber++;
									if ( ++p >= syntax.length )
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
					{
						error = 'syntax_error';
						break;
					}

					// Check types
					var addBracket = '';
					var subCode = token.compile[ s ];
					var tokenType;
					if ( !isVariable )
					{
						tokenType = token.params[ s ].charAt( 0 );
					}
					else
					{
						tokenType = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
						subCode = UTILITIES.replaceStringInText( subCode, '%$PV', 'get' );
						subCode = UTILITIES.replaceStringInText( subCode, '%$PP', '' );
						subCode = UTILITIES.replaceStringInText( subCode, '%$P;', '' );
					}
					type = tokenType;
					var addBracket1 = '';
					var addBracket2 = '';
					if ( !this.checkTypes( tokenType, type ) )
					{
						if ( token.params[ s ].charAt( 0 ) == '3' )
						{
							addBracket1 = '(';
							addBracket2 = '*aoz.degreeRadian)';
						}
						else
						{
							error = 'type_mismatch';
						}
					}

					// A waiting function?
					if ( token.waiting )
					{
						for ( var p = numberOfParams; p >= 0; p-- )
							subCode = UTILITIES.replaceStringInText( subCode, '%$P' + ( p + 1 ), parameters[ p ] );
						subCode = UTILITIES.replaceStringInText( subCode, '%$PN', this.waitingFunctionCount );
						if ( this.pass == 2 )
						{
							this.addLine( subCode );
							this.nextBlock2( true );
						}
						else
						{
							this.nextBlock1( true );
						}
						code = addBracket + 'this.results[' + this.waitingFunctionCount++ + ']';
					}
					else
					{
						// Normal function
						code = addBracket1 + subCode + addBracket2;
						for ( var p = numberOfParams; p >= 0; p-- )
							code = UTILITIES.replaceStringInText( code, '%$P' + ( p + 1 ), parameters[ p ] );
					}
					notConstant = true;
					break;

				case 'procedure':
					var procedureDefinition = this.definition;
					var startPosition = this.position;
					var parameters = [];
					var numberOfParameters = 0;
					var definition = this.section.anchors[ startPosition ];
					var start = this.position;
					if ( !definition )
					{
						// Find parameters
						var e = this.peekNextWord();
						if ( this.text == '[' )
						{
							this.setNextWord( e );
							while( true )
							{
								exp = this.getExpression( EXPFLAG_ENDONSQUAREBRACKET | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO );
								parameters[ numberOfParameters ] = 
								{
									type: exp.type,
									newSyntax: exp.parameter,
									name: exp.parameterName,
									token: exp.parameterToken,
									isArray: exp.isArray,
									separator: undefined,
									list: false,
									startSource: exp.startSource,
									endSource: exp.endSource
								};
								this.extractNextWord();
								if ( this.text != ',' && this.textLower != 'to' )
									break;
								parameters[ numberOfParameters++ ].separator = this.textLower;
							}
							parameters[ numberOfParameters++ ].separator = '%end%';
						}

						// Find variant
						var info = this.findBestVariant( procedureDefinition, parameters, { source: this.substring( start, this.position ) } );
						if ( info )
						{
							info.variant.inUse = true;
							definition = 
							{
								parameters: parameters,
								variant: info.variant,
								positions: info.positions
							};
							this.section.anchors[ startPosition ] = definition;
							this.nextBlock1( true );
						}
					}
					else
					{
						// Pass 2!
						var results = [];
						for ( var r = 0; r < definition.variant.syntax.length; r++ )
							results.push( 'undefined' );
						var e = this.peekNextWord();
						if ( this.text == '[' )
						{
							this.setNextWord( e );
							var ee = this.peekNextWord();
							if ( this.text != ']' )
							{
								this.setNextWord( e );
								for ( var param = 0; param < definition.parameters.length; param++ )
								{
									exp = this.compileExpression( EXPFLAG_ENDONSQUAREBRACKET | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO );
									results[ param ] = exp.code;
									this.extractNextWord();
									if ( this.text != ',' && this.textLower != 'to' )
										break;
								}
							}
							else
							{
								this.setNextWord( ee );
							}
						}

						// Add AOZ sourcecode
						this.addLine( '' );
						var subCode = 'return{type:4,procedure:"' + definition.variant.name + '",';
						subCode += 'result:' + this.waitingFunctionCount + ',args:{';
						subCode += this.getArgumentsCode( definition.variant.syntax, results );
						subCode += '}};';
						this.addLine( subCode );
						this.nextBlock2( true );
						code = 'this.results[' + this.waitingFunctionCount++ + ']';
					}

					// Check types
					type = procedureDefinition.returnType;
					notConstant = true;
					break;

				case 'function':
					var def = this.definition;
					this.peekNextWord();
					var text = this.text; 
					var stopIfEmpty = this.text != '(';
					this.doNotAssign = false;
					var obj = this.handleFunctionMethodOrObject( def,  { module: this.module, stopIfEmpty: stopIfEmpty } );
					code = obj.code;
					type = obj.type;
					definition = obj.definition;
					notConstant = true;
					break;

				case 'class':
					embeddedOperator = true;
				case 'objectMethod':
					var def = this.definition;
					var defName = this.definition.nameReal;
					this.peekNextWord();
					var text = this.text; 
					var stopIfEmpty = this.text != '(';
					this.doNotAssign = false;
					var withObject = null;
					if ( this.section.withObject && this.section.withObject.classDefinition )
					{
						withObject = this.section.withObject.classDefinition;
					}
					var obj = this.handleFunctionMethodOrObject( def,  { object: withObject, module: this.module, stopIfEmpty: stopIfEmpty } );
					if ( obj )
					{
						if ( !this.doNotAssign )
							code = obj.code;
						else 
						{
							if ( obj.objectInstance )
							{
								this.doNotAssign = false;
								if ( this.section.type == 'procedure' )
									code = 'this.aoz.root.objects[' + obj.objectInstance + ']';
								else
									code = 'this.objects[' + obj.objectInstance + ']';
							}
							else
								code = '_skipop_';
						}
						type = obj.type;
						definition = obj.definition;
						notConstant = true;
						if ( obj.type == '3' && !flags.EXPFLAG_NOTWITHOBJECT )
						{
							this.section.withObject = obj;
							this.peekNextWord();
							if ( this.text == '.' )
								this.setNextWord();
							this.property = '';
							this.peekNextWord( 'wantObjectMethodProperty2', { definition: definition.definition, isSuper: false } );		
							var thisDefinition = this.definition;
							var token = '.vars.' + this.property;
							if ( this.type == 'method' )			
							{
								if ( !obj.objectInstance )
									error = 'syntax_error';
								var info = this.handleFunctionMethodOrObject( definition.definition, { object: definition.definition, objectInstance: code, methodName: this.definition.name, type: 'method' } );
								code = info.code + '.' + code;
								type = info.type;
								isArray = false;
								notConstant = true;
							}
							else if ( this.type == 'property' )
							{						
								this.setNextWord();		
								if ( !obj.objectInstance )
								{
									var info = this.handleFunctionMethodOrObject( definition.definition, { object: this.section.withObject, type: 'property', propertyToken: this.variableInfo.token } );
									this.section.withObject = null;	
									code += info.code + '.vars.' + defName + token;
								}
								else
								{
									code += obj.code + token;
									embeddedOperator = true;
								}
								type = this.returnType;
								isArray = false;
								notConstant = true;
								break;
							}
						}
					}
					else
					{
						error = 'syntax_error';
					}
					break;

				// An extra-token?
				case 'extraToken':
					this.extraTokenFunction.call( this );
					break;

				case 'variable':
					if ( this.section.withObject )
					{
						var variableInfo = this.getVariableInfo( this.text, { isArray: false } );
						if ( this.section.withObject.variable )
						{
							if ( !this.section.withObject.variable.classDefinition )
							{
								error = 'variable_should_be_initialized_to_class';
								break;
							}
							definition = this.section.withObject.variable.classDefinition.definition;
						}
						else
						{
							definition = this.section.withObject.definition.definition;
						}
						var withObject = this.section.withObject;
						this.section.withObject = null;
						for ( var v = 0; v < definition.variants.length; v++ )
						{
							var variant = definition.variants[ v ];
							if ( variant.variables[ variableInfo.token ] ) 
							{
								code = 'vars.' + variableInfo.tokenCode;
								type = variableInfo.type;
								isArray = false;
								notConstant = true;
								this.peekNextWord();
								if ( this.text == '(' )
								{
									var info = this.handleFunctionMethodOrObject( definition, { object: withObject, methodName: variableInfo.tokenCode, type: 'property' } );
									if ( !info.objectInstance )
										error = 'syntax_error';
									code = info.code + '.' + code;
								}
								break;
							}
							if ( variant.methods[ variableInfo.token ] )
							{								
								this.section.withObject = null;	
								var noThis = false; //typeof this.section.withObject.objectInstance != 'undefined';
								var info = this.handleFunctionMethodOrObject( definition, { object: withObject, noThis: noThis, methodName: variableInfo.token, type: 'method' } );								
								code = info.code;
								type = info.type;
								isArray = false;
								notConstant = true;
								break;
							}
							error = ' method_property_not_found';
						}
					}
					else
					{
						var info = this.getVariable( 0, GETVARIABLEFLAG_GETVALUE | GETVARIABLEFLAG_VARPTR );
						if ( info.variable.type == '3' )
						{
							this.section.withObject = info;
							//this.section.withObject.variable = 
							embeddedOperator = '.';
						}
						code = info.code;
						type = this.returnType;
						isArray = info.variable.isArray;
						notConstant = true;
					}
					break;

				case 'number':
					type = this.returnType;
					code = this.text;
					break;

				case 'string':
					type = this.returnType;
					code = '"' + this.text + '"';
					break;

				default:
					if ( this.text == '{' || ( this.text == '$' && this.charAt( this.position ) == '{' ) )
					{
						if ( !type )
							type = this.returnType;
						if ( this.text == '$' )
						{
							type = '2';
							this.position++;
						}
						else
						{
							type = '0';
						}
						var subCode = '(';
						var javascript = 1;
						var previous = this.position;
						while ( javascript )
						{
							this.extractNextWord( 'javascript' );
							if ( this.type == 'remark' )
							{
								subCode += this.substring( previous, this.position );
								this.skipRemark();
								previous = this.position;
								continue;
							}
							if ( this.endOfLine )
								break;
							if ( this.text == '{' )
								javascript++;
							else if ( this.text == '}' )
								javascript--;
							if ( javascript > 0 )
							{
								subCode += this.substring( previous, this.position );
								previous = this.position;
							}
						}
						code = subCode + ')';
						notConstant = true;
						break;
					}
					else if ( this.text == '-' || this.text == '–' )
					{
						ope = this.getOperand( flags );
						code = '-' + ope.code;
						type = ope.type;
						notConstant = ope.notConstant;
						break;
					}
					else if ( this.text == '(' )
					{
						exp = this.getExpression( EXPFLAG_ENDONBRACKET | ( flags & EXPFLAG_COMPARAISON ) );
						code = '(' + exp.code + ')';
						type = exp.type;
						var e = this.peekNextWord();
						if ( this.text != ')' )
							error = 'syntax_error';
						this.setNextWord( e );
						notConstant = !exp.constant;
						bool = exp.bool;
						end = 0;
						break;
					}
					else if ( this.text == '$' )
					{
						var text = '';
						for ( ; this.position < this.lineEnd; this.position++ )
						{
							c = this.charAt( this.position ).toUpperCase();
							var ascii = c.charCodeAt( 0 );
							if ( !( ( ascii >= 48 && ascii <= 57 ) || ( ascii >= 65 && ascii <= 70 ) ) )
								break;
							text += c;
						}
						if ( text.length == 0 )
							error = 'syntax_error';
						type = '0';
						code = '0x' + text;
						break;
					}
					else if ( this.text == '!' )
					{
						ope = this.getOperand( EXPFLAG_ENDONTHEN | EXPFLAG_ENDONCOLON | EXPFLAG_COMPARAISON );
						code = '!' + ope.code;
						type = 0;
						notConstant = ope.notConstant;
						break;
					}
					else if ( this.text == '%' )
					{
						var text = '';
						for ( ; this.position < this.lineEnd; this.position++ )
						{
							c = this.charAt( this.position );
							if ( c != '0' && c != '1' )
								break;
							text += c;
						}
						if ( text.length == 0 )
							error = 'syntax_error';
						type = '0';
						code = '0b' + text;
						break;
					}
					else if ( this.text == ',' || this.text == ':' || this.type == 'remark' || this.text == ';' || this.text == ']' )
					{
						this.position--;

						if ( this.text == ',' && ( flags & EXPFLAG_ENDONCOMMA ) == 0 )
							error = 'syntax_error';
						else
						{
							end = EXPFLAG_ENDONCOMMA | EXPFLAG_ENDOFPARAMETER;
							break;
						}

						if ( this.text == ';' && ( flags & EXPFLAG_ENDONSEMICOLON ) == 0 )
							error = 'syntax_error';
						else
						{
							end = EXPFLAG_ENDONSEMICOLON | EXPFLAG_ENDOFPARAMETER;
							break;
						}

						if ( ( this.text == ':' || this.type == 'remark' ) && ( flags & ( EXPFLAG_ENDONCOLON | EXPFLAG_ENDOFINSTRUCTION ) ) == 0 )
							error = 'syntax_error';
						else
						{
							end = EXPFLAG_ENDONCOLON | EXPFLAG_ENDOFPARAMETER | EXPFLAG_ENDOFINSTRUCTION;
							break;
						}

						if ( this.text == ']' && ( flags & EXPFLAG_ENDONSEMICOLON ) == 0 )
							error = 'syntax_error';
						else
						{
							end = EXPFLAG_ENDONSQUAREBRACKET | EXPFLAG_ENDOFPARAMETER;
							break;
						}
					}
					else
					{
						error = 'syntax_error';
					}
					break;
			}
		}
	}
	this.lastOperand = { type: type, code: code, bool: bool, notConstant: notConstant, end: end, error: error, classDefinition: definition, embeddedOperator: embeddedOperator, isArray: isArray };
	return this.lastOperand;
};

Information.prototype.findFriend = function( name, friendsList, parentSection )
{
	var found;
	for ( var f = 0; f < friendsList.length; f++ )
	{
		if ( friendsList[ f ].toLowerCase() == name.toLowerCase() )
			found = true;
	}
	if ( !found )
		return null;
	var definition = this.findClass( parentSection, name );
	return definition;
};

Information.prototype.findClass = function( parentSection, name )
{
	name = name.toLowerCase();
	var foundDefinition;
	if ( parentSection ) 
		foundDefinition = parentSection.objects[ name ];
	if ( !foundDefinition )
	{
		for ( var e in this.options.modules )
		{
			var module = this.options.modules[ e ];
			foundDefinition = module.objects[ name ];
			if ( foundDefinition )
				break;
		}
		if ( !foundDefinition )
		{
			for ( var e in this.options.extensions )
			{
				var extension = this.options.extensions[ e ];
				foundDefinition = extension.objects[ name ];
				if ( foundDefinition )
					break;
			}
		}
	}
	return foundDefinition;
};

Information.prototype.checkExtends = function( definition )
{
	// Check name of extends
	for ( var e = 0; e < definition.extendsList.length; e++ )
	{
		var name = definition.extendsList[ e ];
		var foundDefinition = this.findClass( this.section, name );
		if ( !foundDefinition )
			this.throwError( { error: 'class_not_found', parameter: extendsList[ e ] } );
		foundDefinition.inUse = true;
		foundDefinition.variants[ 0 ].inUse = true;
	}
};

Information.prototype.handleFunctionMethodOrObject = function( objectDefinition, options )
{
	var startPosition = this.position;

	// First pass
	var code = '', subCode = '';
	var definition = this.section.anchors[ startPosition ];
	if ( !definition )
	{
		var parameters = [];
		var numberOfParameters = 0;
		var variableTokenNames = this.variableTokenNames;

		// Accepts both with brackets or not
		var params = false;
		var bracketFound = false;
		this.peekNextWord();
		if ( this.text == '(' )
		{
			bracketFound = true;
			this.setNextWord();
			this.peekNextWord();
			if ( this.text != ')' )
				params = true;
			else 
				this.setNextWord();
		}
		else if ( this.text == ',' && objectDefinition.type == 'class' )
		{
			params = true;
			this.setNextWord();
		}
		var objectInstance;
		if ( objectDefinition.type == 'class' || options.type == 'method' )
		{
			// If first parameter is a string-> name
			end = this.peekNextWord();
			if ( this.type == 'string' )
			{
				objectInstance = this.text;
				this.setPosition( end );
				this.peekNextWord();
				if ( this.text == ',' )
					this.setNextWord();									
				else if ( this.text == ')' )				
				{
					params = false;
					this.setNextWord();
				}
				end = this.position;
			}
		
			// Look for the name of a method or a property
			position = this.position;
			if ( options.type == 'method' )			
			{
				// Find method
				var found = false;
				for ( var v = 0; v < objectDefinition.variants.length; v++ )
				{
					var variant = objectDefinition.variants[ v ];
					if ( variant.methods[ options.methodName ] )
					{
						found = true;
						objectDefinition = variant.methods[ options.methodName ];
						break;
					}
				}
				if ( !found )
					this.throwError( { error: 'method_not_found', parameter: options.methodName }, true );

				if ( !objectInstance )
				{
					var end = this.peekNextWord(); 
					if ( this.type == 'string' )
					{
						objectInstance = this.text;
						this.setPosition( end );
						this.peekNextWord();
						if ( this.text == ',' )
							this.setNextWord();
						else if ( !this.endOfInstruction )
							this.throwError( { error: 'syntax_error', parameter: '' }, true );
					}
				}
				else
					this.setPosition( end );
			}
			else 
			{
				this.setPosition( position );
			}		
			this.checkExtends( objectDefinition );
		}

		var start = this.position;
		if ( params )
		{
			while( true )
			{
				var exp = this.compileExpression( EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONBRACKET | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO | EXPFLAG_ENDONCOLON | EXPFLAG_ENDONSEMICOLON );		
				parameters[ numberOfParameters ] = 
				{
					type: exp.type,
					newSyntax: exp.parameter,
					name: exp.parameterName,
					token: exp.parameterToken,
					isArray: exp.isArray,
					separator: undefined,
					list: false,
					source: exp.source,
				};
				this.extractNextWord();
				var sep = this.textLower;
				if ( sep != ',' && sep != ';' && sep != 'to' )
					break;
				if ( sep == ';' )
				{
					this.peekNextWord();
					if ( this.text == ')' )
					{
						this.setNextWord();
						break;
					}
					if ( this.peekEndOfInstruction )
						break;					
				}
				parameters[ numberOfParameters++ ].separator = sep;
			}
			parameters[ numberOfParameters++ ].separator = '%end%';
		}
		var info = this.findBestVariant( objectDefinition, parameters , { source: this.substring( start, this.position ) } );
		if ( info )
		{
			info.variant.inUse = true;
			var empty = false;
			if ( objectDefinition.type == 'class' )
				empty = ( parameters.length == 0 && !bracketFound );
			if ( options.type == 'property' )
				empty = true;
			if ( !empty && ( !info.variant.codeInlineReturn || info.variant.waiting || objectDefinition.type == 'class' || objectDefinition.type == 'method' ) )
				this.nextBlock1( true );
			var definition =
			{
				parameters: parameters,
				variant: info.variant,
				positions: info.positions,
				tags: info.variant.tags,
				definition: objectDefinition,
				variableTokenNames: variableTokenNames,
				stopIfEmpty: options.stopIfEmpty,
				objectInstance: objectInstance
			}
			this.section.anchors[ startPosition ] = definition;
			return { type: definition.variant.returnType, code: code, definition: definition, objectInstance: objectInstance };
		}
		return null;
	}
	else
	{
		// Pass 2!
		var syntaxParameters = definition.variant.syntax;
		var results = [];
		for ( var r = 0; r < syntaxParameters.length; r++ )
		{
			if ( syntaxParameters[ r ].value != '(list)' )
			results.push( undefMark );
			else
				results.push( [] );
		}

		// Accepts both with brackets or not
		var params = false;
		var bracketFound = false;
		this.peekNextWord();
		if ( this.text == '(' )
		{
			bracketFound = true;
			this.setNextWord();
			this.peekNextWord();
			if ( this.text != ')' )
				params = true;
			else 
				this.setNextWord();
		}
		else if ( this.text == ',' && objectDefinition.type == 'class' )
		{
			params = true;
			this.setNextWord();
		}
		
		var objectInstance = '';
		if ( objectDefinition.type == 'class' || options.type == 'method' )
		{
			// If first parameter is a string-> name
			end = this.peekNextWord();
			if ( this.type == 'string' )
			{
				objectInstance = '"' + this.text + '"';
				this.setPosition( end );
				this.peekNextWord();
				if ( this.text == ',' )
					this.setNextWord();
				else if ( this.text == ')' )
				{
					this.setNextWord();
					params = false;
				}
				end = this.position;
			}

			// Look for the name of a method or a property
			var position = this.position;
			if ( options.type == 'method' )			
			{
				if ( !objectInstance )
				{
					end = this.peekNextWord();
					if ( this.type == 'string' )
					{
						objectInstance = '"' + this.text + '"';
						this.setPosition( end );
						this.peekNextWord();
						if ( this.text == ',' )
							this.setNextWord();
						else if ( !this.endOfInstruction )
							this.throwError( { error: 'syntax_error', parameter: '' }, true );
					}
				}
				else
				{
					this.setPosition( end );
				}
			}
			else 
			{
				this.setPosition( position );
			}
		}
		if ( params )
		{
			for ( var param = 0; param < definition.positions.length; param++ )
			{
				exp = this.compileExpression( EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONBRACKET | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO | EXPFLAG_ENDONCOLON | EXPFLAG_ENDONSEMICOLON );
				var paramFound = definition.positions[ param ];
				if ( UTILITIES.isArray( results[ paramFound ] ) )
					results[ paramFound ].push( exp.code );
				else
					results[ paramFound ] = exp.code;
				this.extractNextWord();
			}
		}

		// Check default values
		var defaults = [];
		for ( var p = 0; p < results.length; p++ )
		{
			if ( results[ p ] == undefMark )
			{
				defaults[ p ] = true;
				switch ( syntaxParameters[ p ].value )
				{
					case '(array)':
						break;

					case '(varptr)':
					case '(index)':
					case '(any)':
						results[ p ] = 'undefined';
						break;
					default:
						results[ p ] = syntaxParameters[ p ].value ;
						break;
				}
			}
		}

		// Add AOZ sourcecode
		var empty = false;
		if ( options.type == 'method' )
		{
			this.addLine( '' );
			if ( !objectInstance )
			{
				if ( options.objectInstance )
					objectInstance = options.objectInstance;
				if ( options.object )
				{
					if ( options.object.objectInstance )
						objectInstance = options.object.objectInstance;
					if ( options.object.code )
						objectInstance = options.object.code;
				}
			}
			if ( !objectInstance )
				this.throwError( { error: 'internal_error ' }, true );

			if ( options.object && options.object.variable && definition.variant.methodInLine )
			{
				var args = this.getArgumentsCode( syntaxParameters, results, defaults );
				code += 'blocks[ 0 ].call(' + options.object.code + ',aoz,{' + args  + '})';
			}
			else
			{
				subCode = 'return{type:17,class:"' + objectDefinition.name + '",instance:' + objectInstance + ',method:"' + options.methodName +'",result:' + this.waitingFunctionCount + ',args:{';
				subCode += this.getArgumentsCode( syntaxParameters, results, defaults );
				subCode += '}};';
				this.addLine( subCode );
				if ( !options.noThis )
					code = 'this.';
				code += 'results[' + this.waitingFunctionCount++ + ']';
			}
		}
		else if ( options.type == 'property' )
		{
			code = '';
			this.doNotAssign = false;
			empty = true;
		}
		else if ( objectDefinition.type == 'class' )
		{
			empty = ( definition.parameters.length == 0 && !bracketFound );
			if ( !empty || ( empty && !options.stopIfEmpty ) )
			{
				this.addLine( '' );
				subCode = 'return{type:15,object:"' + objectDefinition.name + '",';
				if ( objectInstance )
					subCode += 'instance:' + objectInstance + ',';
				else if ( options.objectInstance )
					subCode += 'instance:' + objectInstance + ',';
				else
					subCode += 'instance:"' + objectDefinition.nameReal + '_"+aoz.instanceCount++,';
				subCode += 'result:' + this.waitingFunctionCount + ',args:{';
				subCode += this.getArgumentsCode( syntaxParameters, results, defaults );
				subCode += '}};';
				this.addLine( subCode );
				code = 'this.results[' + this.waitingFunctionCount++ + ']';
			}
			else
				this.doNotAssign = true;
		}
		else if ( !definition.variant.codeInlineReturn )
		{
			this.addLine( '' );
			subCode = 'return{type:11,instruction:"' + objectDefinition.name + '",';
			if ( options.module )
			{
				subCode += 'klass:"' + options.module.name + '",';
				module.inUse = true;
			}
			subCode += 'result:' + this.waitingFunctionCount + ',args:{';
			subCode += this.getArgumentsCode( syntaxParameters, results );
			subCode += '}};';
			this.addLine( subCode );
			code = 'this.results[' + this.waitingFunctionCount++ + ']';
		}
		else
		{
			// Compute parameters and arrays
			var newResults = [];
			for ( var p = 0; p < results.length; p++ )
			{
				var code = '';
				if ( !UTILITIES.isArray( results[ p ] ) )
					newResults[ p ] = results[ p ];
				else
				{
					newResults[ p ] = '[';
					for ( var r = 0; r < results[ p ].length; r++ )
					{
						newResults[ p ] += results[ p ][ r ];
						if ( r < results[ p ].length - 1 )
							newResults[ p ] += ',';
					}
					newResults[ p ] += ']';
				}
			}

			var variableTokenNames = definition.variableTokenNames;
			var variableTokens = definition.definition.variableTokens;		
			if ( definition.variant.codeInline )
			{
				for ( var l = 0; l < definition.variant.codeInline.length; l++ )
				{
					var text = this.setParameters( definition.variant.syntax, definition.variant.codeInline[ l ], newResults );
					if ( variableTokens && variableTokenNames )
					{
						for ( var ll = 0; ll < variableTokens.length; ll++ )
						{
							if ( ll < variableTokenNames.length )
								text = UTILITIES.replaceParameter( text, '%' + variableTokens[ ll ], '"' + variableTokenNames[ ll ] + '"' );
							else
								text = UTILITIES.replaceParameter( text, '%' + variableTokens[ ll ], '""' );
						}	
					}
					this.addLine( text );
				}
			}
			code = this.setParameters( definition.variant.syntax, definition.variant.codeInlineReturn[ 0 ], newResults );
			if ( variableTokens && variableTokenNames )
			{
				for ( var ll = 0; ll < variableTokens.length; ll++ )
				{
					if ( ll < variableTokenNames.length )
						code = UTILITIES.replaceParameter( code, '%' + variableTokens[ ll ], '"' + variableTokenNames[ ll ] + '"' );
					else
						code = UTILITIES.replaceParameter( code, '%' + variableTokens[ ll ], '""' );
				}	
			}
		}
		if ( !empty && ( !definition.variant.codeInlineReturn || definition.variant.waiting || definition.variant.type == 'class' || definition.variant.type == 'method' ) )
			this.nextBlock2();
	}
	// Return code and type
	return { type: definition.variant.returnType, code: code, definition: definition, objectInstance: objectInstance };
}
Information.prototype.getArgumentsCode = function( syntaxParameters, results, defaults )
{
	var code = '';
	for ( var p = 0; p < results.length; p++ )
	{
		var tokenCode = syntaxParameters[ p ].tokenCode;
		if ( !tokenCode )
			throw 'internal_error';

		//if ( name.substring( name.length - 1 ) == '#' )
		//	name = name.substring( 0, name.length - 1 ) + '_f';
		//if ( name.substring( name.length - 1 ) == '@' )
		//	name = name.substring( 0, name.length - 1 ) + '_c';
		if ( typeof defaults == 'undefined' || ( typeof defaults != 'undefined' && !defaults[ p ] ) )
		{
			if ( !UTILITIES.isArray( results[ p ] ) )
				code += tokenCode + ':' + results[ p ];
			else
			{
				code += tokenCode + ':[';
				for ( var r = 0; r < results[ p ].length; r++ )
				{
					code += results[ p ][ r ];
					if ( r < results[ p ].length - 1 )
						code += ',';
				}
				code += ']';
			}
			code += ',';
		}
	}
	if ( code.charAt( code.length - 1 ) == ',' )
		code = code.substring( 0, code.length - 1 );
	return code;
};
/*
Information.prototype.getMethodArgumentsCode = function( syntaxParameters, results )
{
	var code = '';
	for ( var p = 0; p < results.length; p++ )
	{
		if ( !UTILITIES.isArray( results[ p ] ) )
			code += results[ p ];
		else
		{
			code += '[';
			for ( var r = 0; r < results[ p ].length; r++ )
			{
				code += results[ p ][ r ];
				if ( r < results[ p ].length - 1 )
					code += ',';
			}
			code += ']';
		}
		if ( p < results.length - 1 )
			code += ',';
	}
	return code;
};
*/
Information.prototype.findBestVariant = function( functionDefinition, parameters, options )
{
	// Find proper syntax
	var err = '';
	var bestParam = 1000;
	var bestVariant = null;
	var bestPositions = [];
	var param, parameter;

	// Check types of parameter token and parameter
	for ( param = 0; param < parameters.length; param++ )
	{
		parameter = parameters[ param ];
		var tokenType = '0';
		if ( parameter.token )
		{
			if ( parameter.token.substring( parameter.token.length - 1 ) == '$' )
				tokenType = '2';
			else if ( parameter.token.substring( parameter.token.length - 2 ) == '_c' )
				tokenType = '3';
			if ( !this.checkTypes( parameter.type, tokenType ) )
			{
				this.throwError( { error: 'type_mismatch', parameter: parameter.source ? parameter.source : '' } );
			}
		}
	}
	var notFound;
	for ( var v = 0; v < functionDefinition.variants.length; v++ )
	{
		var variant = functionDefinition.variants[ v ];
		var syntaxParameters = variant.syntax;
		err = '';
		var listPosition = 0;
		var syntaxList, syntaxListPosition;
		var positions = [];
		for ( var p = 0; p < syntaxParameters.length; p++ )
		{
			if ( syntaxParameters[ p ].value == '(list)' )
			{
				syntaxList = syntaxParameters[ p ].arrayDefinition;
				syntaxListPosition = p;
				break;
			}
		}
		if ( parameters.length > 0 )
		{
			for ( param = 0; param < parameters.length; param++ )
			{
				parameter = parameters[ param ];
				var parameterFound = param;

				if ( parameter.newSyntax )
				{
					var parameterFound = -1;

					for ( var p = 0; p < syntaxParameters.length; p++ )
					{
						if ( syntaxParameters[ p ].value == '(friendclasses)' )
						{
							debugger;
							p--;
						}
						else if ( syntaxParameters[ p ].value != '(index)' )
						{
							var token = parameter.token;
							if ( syntaxParameters[ p ].type == '1' && token.lastIndexOf( '_f' ) < 0 )
								token += '_f';
							if ( syntaxParameters[ p ].value == '(any)' && parameter.type == '2' )
								token = token.substring( 0, token.length - 1 );
							token += ( syntaxParameters[ p ].value == '(array)' ? '_array' : '' );
							if ( syntaxParameters[ p ].token == token )
							{
								if ( !this.caseSensitive || syntaxParameters[ p ].name == parameter.name )
								{
									parameterFound = p;
									break;
								}
							}
						}						
						else
						{
							var token = parameter.token;
							if ( syntaxParameters[ p ].token == token )
							{
								if ( !this.caseSensitive || syntaxParameters[ p ].name == parameter.name )
								{
									if ( parameter.type != '0' && parameter.type != '2' )
									{
										err = 'type_mismatch';
										break;
									}
									parameterFound = p;
								}
							}
							if ( parameterFound < 0 )
							{
								var tokenString = token;
								var tokenInt = token;
								var pp = token.indexOf( '$' )
								var ppp=  token.indexOf( '_array' );
								if ( pp >= 0 )
									tokenInt = token.substring( 0, pp ) + token.substring( pp + 1 );
								else
								{
									if ( ppp )
										tokenString = token.substring( 0, ppp ) + '$' + token.substring( ppp );
									else
										tokenString = token + '$';
								}
								if ( syntaxParameters[ p ].token == tokenString )
								{
									if ( !this.caseSensitive || syntaxParameters[ p ].name == parameter.name )
									{
										if ( parameter.type != '0' && parameter.type != '2' )
										{
											err = 'type_mismatch';
											break;
										}
										parameterFound = p;
									}
								}
								if ( parameterFound < 0 )
								{
									if ( syntaxParameters[ p ].token == tokenInt )
									{
										if ( !this.caseSensitive || syntaxParameters[ p ].name == parameter.name )
										{
											if ( parameter.type != '0' && parameter.type != '2' )
											{
												err = 'type_mismatch';
												break;
											}
											parameterFound = p;
										}
									}
								}
							}
						}
					}
					notFound = parameter.name;
					if ( parameterFound < 0 )
					{
						err = ( err != '' ? err : 'parameter_not_found' );
						break;
					}
					positions[ param ] = parameterFound;
					if ( syntaxParameters[ parameterFound ].value == '(array)' )
					{
						if ( !parameter.isArray )
						{
							err = 'type_mismatch';
							break;
						}
					}
					if ( !this.checkTypes( syntaxParameters[ parameterFound ].type, parameter.type ) )
					{
						err = 'type_mismatch';
						break;
					}
					if ( parameter.separator != '%end%' && syntaxParameters[ parameterFound ].separator != '%end%' && parameter.separator != syntaxParameters[ parameterFound ].separator  )
					{
						err = 'syntax_error';
						break;
					}
				}
				else
				{
					if ( syntaxList && param > 0 )
					{
						positions[ param ] = syntaxListPosition;
						if ( !this.checkTypes( syntaxList[ listPosition ].type, parameter.type ) )
						{
							err = 'type_mismatch';
							break;
						}
						listPosition++;
						if ( listPosition >= syntaxList.length )
						{
							listPosition = 0;
							var sep = syntaxList.length > 1 ? ';' : ',';
							if ( parameter.separator != '%end%' && parameter.separator != sep )
							{
								err = 'syntax_error';
								break;
							}			
						}
					}
					else 
					{
						if ( param >= syntaxParameters.length )
						{
							err = 'syntax_error';
							break;
						}
						positions[ param ] = param;
						if ( syntaxParameters[ parameterFound ].value == '(array)' )
						{
							if ( !parameter.isArray )
							{
								err = 'type_mismatch';
								break;
							}
						}	
						if ( !this.checkTypes( syntaxParameters[ param ].type, parameter.type ) )
						{
							err = 'type_mismatch';
							break;
						}
						if ( parameter.separator != '%end%' && syntaxParameters[ param ].separator != '%end%' && parameter.separator != syntaxParameters[ param ].separator  )
						{
							err = 'syntax_error';
							break;
						}
					}
				}	
				notFound = parameter.name;
				if ( parameter.separator == '%end%' )
					break;
			}
			if ( err == '' && syntaxParameters.length - param < bestParam )
			{
				bestParam = syntaxParameters.length - param;
				bestVariant = variant;
				bestPositions = positions;
			}
		}
		else
		{
			if ( syntaxParameters.length < bestParam )
			{
				bestParam = syntaxParameters.length;
				bestVariant = variant;
				bestPositions = [];
			}
		}
	}
	if ( !bestVariant )
	{
		var error = err != '' ? err : 'syntax_error';
		if ( error )
			this.throwError( { error: error, parameter: notFound }, true );
		return null;
	}
	return { variant: bestVariant, positions: bestPositions };
};
Information.prototype.getOperator = function( flags, embeddedOperator )
{
	var end = 0;
	var code = '';
	var codeComp;
	var codeString;
	var priority;
	var bool = false;
	var type, typeOperands, error;

	var theStart = this.position;
	this.operator = true;
	var theEnd = this.peekNextWord();
	this.operator = false;
	if ( !this.peekEndOfLine )
	{
		if ( this.type == 'remark' )
		{
			end = EXPFLAG_ENDOFINSTRUCTION;
			theEnd = 0;
		}
		else if ( this.token )
		{
			var good = false;
			switch ( this.token.token )
			{
				case 'as':
					good = ( flags & EXPFLAG_ENDONAS ) != 0;
					end = EXPFLAG_ENDONAS | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'then':
					good = ( flags & EXPFLAG_ENDONTHEN ) != 0 ;
					end = EXPFLAG_ENDONTHEN | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'else':
				case 'else if':
					good = ( flags & EXPFLAG_ENDONCOLON ) != 0 ;
					end = EXPFLAG_ENDONCOLON | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'to':
					good = ( flags & EXPFLAG_ENDONTO ) != 0 ;
					end = EXPFLAG_ENDONTO | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'step':
					good = ( flags & EXPFLAG_ENDONSTEP ) != 0 ;
					end = EXPFLAG_ENDONSTEP | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'goto':
					good = ( flags & EXPFLAG_ENDONGOTO ) != 0 ;
					end = EXPFLAG_ENDONGOTO | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'gosub':
					good = ( flags & EXPFLAG_ENDONGOSUB ) != 0 ;
					end = EXPFLAG_ENDONGOSUB | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'proc':
					good = ( flags & EXPFLAG_ENDONPROC ) != 0 ;
					end = EXPFLAG_ENDONPROC | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					break;
				case 'mod':
					good = true;
					code = '(%1)%(%2)';
					priority = 14;
					type = '0';
					typeOperands = '0';
					break;
				default:
					good = ( flags & EXPFLAG_ENDONTOKEN ) != 0;
					end = EXPFLAG_ENDONTOKEN;
					theEnd = 0;
					break;
			}
			if ( !good )
				error = 'syntax_error';
		}
		else
		{
			switch ( this.textLower )
			{
				case '.':
					if ( ( flags & EXPFLAG_ENDONDOT ) != 0 )
					{
						end = EXPFLAG_ENDONDOT | EXPFLAG_ENDOFPARAMETER;
						theEnd = 0;						
					}
					else
					{
						this.isObjectOriented = true;
						code = '%1.%2';
						priority = 20;
						type = '3';
						typeOperands = '3';
						bool = false;
					}
					break;
				case '&':
					code = '(%1)&(%2)';
					priority = 6
					type = '0';
					typeOperands = '?';
					bool = false;
					break;
				case '&&':
					code = '(%1)&&(%2)';
					priority = 6
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '_and_':
					code = '(%1)&(%2)';
					codeComp = '(%1)&&(%2)';
					priority = 6
					type = '0';
					typeOperands = '?';
					bool = false;
					break;
				case '|':
					code = '(%1)|(%2)';
					priority = 7;
					type = '0';
					typeOperands = '?';
					bool = false;
					break;
				case '||':
					code = '(%1)||(%2)';
					priority = 7;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '_or_':
					code = '(%1)|(%2)';
					codeComp = '(%1)||(%2)';
					priority = 7;
					type = '0';
					typeOperands = '?';
					bool = false;
					break;
				case 'mod':
					code = '(%1)%(%2)';
					priority = 14;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;
				case 'pow':
					code = 'Math.pow(%1,%2)';
					priority = 13.5;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;
				case 'xor':
					code = '(%1)^(%2)';
					codeComp = '(%1)^(%2)';
					priority = 8;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;
				case '=':
					code = '(%1)==(%2)';
					codeComp = '(%1)==(%2)';
					priority = 10;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '=>':
				case '>=':
					code = '(%1)>=(%2)';
					codeComp = '(%1)>=(%2)';
					priority = 11;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '=<':
				case '<=':
					code = '(%1)<=(%2)';
					codeComp = '(%1)<=(%2)';
					priority = 11;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '<':
					code = '(%1)<(%2)';
					codeComp = '(%1)<(%2)';
					priority = 11;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '>':
					code = '(%1)>(%2)';
					codeComp = '(%1)>(%2)';
					priority = 11;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '!=':
				case '<>':
					code = '(%1)!=(%2)';
					codeComp = '(%1)!=(%2)';
					priority = 10;
					type = '0';
					typeOperands = '?';
					bool = true;
					break;
				case '^':
					code = 'Math.pow(%1,%2)';
					priority = 15;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;
				case '-':
				case '–':
					codeString = 'aoz.subtractString(%1,%2)';
					code = '%1-%2';
					priority = 13;
					type = '?';
					typeOperands = '?';
					bool = false;
					break;
				case '+':
					code = '%1+%2';
					priority = 13;
					type = '?';
					typeOperands = '?';
					bool = false;
					break;
				case '*':
					code = '%1*%2';
					priority = 14;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;
				case '/':
					code = 'aoz.checkNumber(%1/%2)';
					priority = 13;
					type = '1';
					typeOperands = '0';
					bool = false;
					break;
				case '<<':
				case '>>':
					code = '%1' + this.text + '%2';
					priority = 16;
					type = '0';
					typeOperands = '0';
					bool = false;
					break;

				case ')':
					if ( ( flags & EXPFLAG_ENDONBRACKET ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONBRACKET;
					theEnd = 0;
					bool = false;
					break;

				case ',':
					if ( ( flags & EXPFLAG_ENDONCOMMA ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONCOMMA | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					bool = false;
					break;

				case ':':
					if ( ( flags & ( EXPFLAG_ENDONCOLON | EXPFLAG_ENDOFINSTRUCTION ) ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONCOLON  | EXPFLAG_ENDOFPARAMETER | EXPFLAG_ENDOFINSTRUCTION;
					theEnd = 0;
					bool = false;
					break;

				case ';':
					if ( ( flags & EXPFLAG_ENDONSEMICOLON ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONSEMICOLON | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					bool = false;
					break;

				case ']':
					if ( ( flags & EXPFLAG_ENDONSQUAREBRACKET ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONSQUAREBRACKET | EXPFLAG_ENDOFPARAMETER;
					theEnd = 0;
					bool = false;
					break;

				default:
					if ( embeddedOperator )
					{
						this.isObjectOriented = true;
						theEnd = theStart;
						code = '%1.%2';
						priority = 20;
						type = '3';
						typeOperands = '3';
						bool = false;
						break;
					}				
					if ( ( flags & EXPFLAG_ENDONTOKEN ) == 0 )
						error = 'syntax_error';
					end = EXPFLAG_ENDONTOKEN;
					theEnd = 0;
					bool = false;
					break;
			}
		}
		if ( theEnd )
			this.setPosition( theEnd );
	}
	else
	{
		end = EXPFLAG_ENDOFINSTRUCTION;
	}
	if ( !codeString )
		codeString = code;
	this.lastOperator = { code: code, codeComp: codeComp, codeString: codeString, bool: bool, type: type, typeOperands: typeOperands, priority: priority, end: end, error: error };
	return this.lastOperator;
};

var specialExpCases = {};
specialExpCases.handleFn = function()
{
	var code = '';
	this.extractNextWord();
	if ( this.type != 'variable' )
		this.throwError( { error: 'syntax_error' }, true );
	var variableInfo = this.getVariableInfo( this.text, {} );
	var func = this.section.defFunctions[ variableInfo.token ];
	if ( !func )
		info.throwError( { error: 'user_function_not_defined', parameter: variableInfo.nameReal }, true );
	code = func.code;
	if ( func.parameters.length > 0 )
	{
		this.extractNextWord();
		if ( this.text != '(' )
			this.throwError( { error: 'syntax_error' }, true );
		for ( var p = 0; p < func.parameters.length; p++ )
		{
			var parameter = func.parameters[ p ];
			var start = this.position;
			var exp = this.compileExpression( EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONBRACKET );
			if ( exp.type != parameter.type )
				this.throwError( { error: 'type_mismatch' }, true );
			var text = this.substring( start, this.position );
			code = UTILITIES.replaceStringInText( code, '%' + p + '%', text );
			this.extractNextWord();
			if ( p == func.parameters.length - 1 )
			{
				if ( this.text != ')' )
					this.throwError( { error: 'syntax_error' }, true );
			}
			else
			{
				if ( this.text != ',' )
					this.throwError( { error: 'syntax_error' }, true );
			}
		}
	}

	var saveAnchors = this.section.anchors;
	var info = this.pushSource( code );
	if ( func.anchors )
		this.section.anchors = func.anchors;
	else
		this.section.anchors = {};
	var result = this.getExpression();
	if ( !func.anchors )
		func.anchors = this.section.anchors;
	this.popSource();
	this.section.anchors = saveAnchors;
	if ( !this.checkTypes( result.type, func.type ) )
		this.throwError( { error: 'type_mismatch', parameter: this.getExpressionErrorParameter() } );
	code = result.code;
	this.returnType = func.type;
	return code;
};
specialExpCases.handleMatch = function()
{
	this.extractNextWord();
	this.waitingFunctionCount = 0;
	this.extractNextWord();
	var code = this.getVariable( 0, GETVARIABLEFLAG_MATCH ).code;
	this.extractNextWord();
	code += this.compileExpression( EXPFLAG_ENDONBRACKET ).code + ')';
	this.extractNextWord();
	this.returnType = '0';
	return code;
};
specialExpCases.handleVarptr = function()
{
	this.extractNextWord();
	if ( this.text != '(' )
		throw 'syntax_error';
	
	this.waitingFunctionCount = 0;
	this.extractNextWord();
	if ( this.type != 'variable' )
		throw 'syntax_error';

	var variable = this.getVariable( 0, GETVARIABLEFLAG_VARPTR );
	this.extractNextWord();
	if ( this.text != ')' )
		throw 'syntax_error';

	variable = UTILITIES.copyObject( variable );
	switch ( variable.variable.type )
	{
		case '0':
			variable.variable.type = 'integer';
			break;
		case '1':				
			variable.variable.type = 'float';
			break;
		case '2':				
			variable.variable.type = 'string';
			break;
		case '3':				
			variable.variable.type = 'class';
			break;
		default:
			throw 'internal_error';
	}
	var code = "aoz.varPtr('" + JSON.stringify( variable ) + "')"
	this.returnType = '0';
	return code;
};


Information.prototype.getSharedVariable = function( variableInfo )
{
	if ( this.section.type != 'main' )
	{
		if ( this.section.variables[ variableInfo.token ] )
		{
			if ( !this.caseSensitive || variableInfo.nameReal == this.section.variables[ variableInfo.token ].nameReal )
				return this.section.variables[ variableInfo.token ];
		}
	}
	if ( this.rootSection.variables[ variableInfo.token ] )
	{
		if ( !this.caseSensitive || variableInfo.nameReal == this.rootSection.variables[ variableInfo.token ].nameReal )
			return this.rootSection.variables[ variableInfo.token ];
	}
	return null;
};
Information.prototype.getGlobalVariable = function( variableInfo )
{
	if ( this.section.type != 'main' )
	{
		if ( this.section.globals[ variableInfo.token ] )
		{
			if ( !this.caseSensitive || variableInfo.nameReal == this.section.globals[ token ].nameReal )
			{
				this.section.globals[ variableInfo.token ].global = true;
				return this.section.globals[ variableInfo.token ];
			}
		}

		if ( this.section.parentSection )
		{
			if ( this.section.type == 'method' || this.section.type == 'procedure' || this.section.type == 'function' || this.section.type == 'instruction' )
			{
				var pSection = this.section.parentSection;
				do
				{
					if ( pSection.globals[ variableInfo.token ] )
					{
						if ( !this.caseSensitive || variableInfo.nameReal == pSection.globals[ token ].nameReal )
						{
							pSection.globals[ variableInfo.token ].global = true;
							return pSection.globals[ variableInfo.token ];
						}
					}
					pSection = pSection.parentSection;
				} while ( pSection )
			}
			if ( this.section.type == 'method' )
			{
				if ( this.section.parentSection.variables[ variableInfo.token ] )
				{
					if ( !this.caseSensitive || variableInfo.nameReal == this.section.parentSection.variables[ token ].nameReal )
					{
						this.section.parentSection.variables[ variableInfo.token ].global = true;
						return this.section.parentSection.variables[ variableInfo.token ];
					}
				}
			}
		}
	}
	if ( this.rootSection.globals[ variableInfo.token ] )
	{
		if ( !this.caseSensitive || variableInfo.nameReal == this.rootSection.globals[ token ].nameReal )
		{
			this.rootSection.globals[ variableInfo.token ] = true;
			return this.rootSection.globals[ variableInfo.token ];
		}
	}
	return null;
};

Information.prototype.getWith = function()
{
	var code = '';
	for ( var w = 0; w < this.section.with.length; w++ )
	{
		var text = this.section.with[ w ];
		if ( w > 0 )
		{
			// If just the name of the class-> current object
			// If not, call to getObject
			if ( text.indexOf( '(' ) < 0 )
			{
				text += '_current';
			}
		}
		code += text;
		if ( w < this.section.with.length - 1 )
			code += '.';
	}
	var doFirst = false;
	if ( code != '' && this.section.withCurrent.length )
	{
		code += '.';
		doFirst = true;
	}
	for ( var w = 0; w < this.section.withCurrent.length; w++ )
	{
		var text = this.section.withCurrent[ w ];
		if ( ( w == 0 && doFirst ) || w > 0 )
		{
			if ( text.indexOf( '(' ) < 0 )
			{
				text += '_current';
			}
		}
		code += text;
		if ( w < this.section.withCurrent.length - 1 )
			code += '.';
	}
	return code;
};
Information.prototype.peekNextWord = function( flags, options )
{
	var savePosition = this.position;
	var saveEndOfLine = this.endOfLine;
	var saveEndOfInstruction = this.endOfInstruction;
	var saveCurrentLine = this.currentLine;

	this.extractNextWord( flags, options );

	this.peekEndOfLine = this.endOfLine;
	this.peekEndOfInstruction = this.endOfInstruction;
	this.peekNextWordEnd = this.position;

	this.currentLine = saveCurrentLine;
	this.endOfLine = saveEndOfLine;
	this.endOfInstruction = saveEndOfInstruction;
	this.position = savePosition;
	line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
	return this.peekNextWordEnd;
};
Information.prototype.extractNextWord = function( scan, options )
{
	var line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
	var result = this.extractNextWord2( scan, options );
	line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
	return result;
};
Information.prototype.checkVariableName = function( name )
{
	var self = this;
	var found;
	var lineTokens = this.getTokensFromText( name );
	found = checkIt( lineTokens[ lineTokens.length - 1 ].text );
	if ( found )
	{
		var type;
		switch ( found.type )
		{
			case 'procedure':
				type = MESSAGES.getMessage( 'la_procedure' );
				break;
			case 'class':
				type = MESSAGES.getMessage( 'l_objet' );
				break;
			case 'instruction':
				type = MESSAGES.getMessage( 'l_instruction' );
				break;
			case 'function':
				type = MESSAGES.getMessage( 'la_fonction' );
				break;
			case 'token':
				type = MESSAGES.getMessage( 'le_token' );
				break;
			case 'method':
				type = MESSAGES.getMessage( 'la_methode' );
				break;
			default:
				type = '???';
				break;
		}
		return { type: type, name: found.nameReal };
	}
	return null;

	function checkIt( text )
	{
		// Object within program itself?
		if ( self.section.objects[ text ] )
			return self.section.objects[ text ];

		// A procedure?
		if ( self.rootSection.procedures[ text ] )
			return self.rootSection.procedures[ text ];

		// Instructions within program itself?
		if ( self.rootSection.instructions[ text ] )
			return self.rootSection.instructions[ text ];

		// Function within program itself?
		if ( self.rootSection.functions[ text ] )
			return self.rootSection.functions[ text ];

		// Object from a module?
		for ( var e in self.options.modules )
		{
			var module = self.options.modules[ e ];
			if ( module.objects[ text ] )
				return module.objects[ text ];
			if ( module.instructions[ text ] )
				return module.instructions[ text ];
			if ( module.functions[ text ] )
				return module.functions[ text ];
		}

		// An object from an extension?
		for ( var e in self.options.extensions )
		{
			var extension = self.options.extensions[ e ];
			if ( extension.objects[ text ] )
				return extension.objects[ text ];
			if ( extension.instructions[ text ] )
				return extension.instructions[ text ];
			if ( extension.functions[ text ]  )
				return extension.functions[ text ];
		}

		// One of the constants?
		if ( self.constants[ text ] )
			return self.constants[ text ];

		// One of the main tokens?
		if ( text == 'ror' || text == 'rol' )
			return { type: 'token', name: text, position: -1 };
		if ( tokenList[ text ] )
			return { type: 'token', name: text, position: -1 };

		return null;
	}
};
Information.prototype.checkObjectName = function( name )
{
	var found;
	if ( this.caseSensitive )
		found = checkIt( name );
	else
		found = checkIt( name.toLowerCase() );
	if ( found )
	{
		var type;
		switch ( found.type )
		{
			case 'procedure':
				type = messages.getMessage( 'la_procedure' );
				break;
			case 'class':
				type = messages.getMessage( 'l_objet' );
				break;
			case 'instruction':
				type = messages.getMessage( 'l_instruction' );
				break;
			case 'function':
				type = messages.getMessage( 'la_fonction' );
				break;
			case 'token':
				type = messages.getMessage( 'le_token' );
				break;
			case 'method':
				type = messages.getMessage( 'la_methode' );
				break;
			default:
				type = '???';
				break;
		}
	}
	this.throwError( { error: 'variable_name_conflict', parameters: [ type, found.nameReal ] }, true );
	return false;

	function checkIt( text )
	{
		// Object within program itself?
		if ( this.section.objects[ text ] )
			return this.section.objects[ text ];

		// A procedure?
		if ( this.rootSection.procedures[ text ] )
			return this.rootSection.procedures[ text ];

		// Instructions within program itself?
		if ( this.rootSection.instructions[ text ] )
			return this.rootSection.instructions[ text ];

		// Function within program itself?
		if ( this.rootSection.functions[ text ] )
			return this.rootSection.functions[ text ];

		// Object from a module?
		for ( var e in this.options.modules )
		{
			var module = this.options.modules[ e ];
			if ( module.objects[ text ] )
				return module.objects[ text ];
			if ( module.instructions[ text ] )
				return module.instructions[ text ];
			if ( module.functions[ text ] )
				return module.functions[ text ];
		}

		// An object from an extension?
		for ( var e in this.options.extensions )
		{
			var extension = this.options.extensions[ e ];
			if ( extension.objects[ text ] )
				return extension.objects[ text ];
			if ( extension.instructions[ text ] )
				return extension.instructions[ text ];
			if ( extension.functions[ text ]  )
				return extension.functions[ text ];
		}

		// One of the constants?
		if ( this.constants[ text ] )
			return this.constants[ text ];

		// One of the main tokens?
		if ( text == 'ror' || text == 'rol' )
			return { type: 'token', name: text, position: -1 };
		if ( tokenList[ text ] )
			return { type: 'token', name: text, position: -1 };

		return null;
	}
};
Information.prototype.extractNextWord2 = function( scan, options )
{
	// Emergency stop in case of loops
	if ( this.exitEndlessLoopLine == this.currentLine )
	{
		this.exitEndlessLoopCount++;
		if ( this.exitEndlessLoopCount > 100000 )
		{
			this.throwError( { error: 'compiler_stuck_in_loop' }, true );
		}
	}
	else
	{
		this.exitEndlessLoopLine = this.currentLine;
		this.exitEndlessLoopCount = 0;
	}

	this.token = null;
	this.module = null;
	this.definition = null;
	this.text = '';
	this.textLower = '';
	this.type = '';
	this.endOfInstruction = false;
	this.positionPrevious = this.position;

	switch ( scan )
	{
		default:
		case 'noGlobalMethods':
			this.skipSpaces();
			if ( this.endOfLine )
			{
				this.endOfInstruction = true;
				return;
			}

			var start = this.position;
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			if ( type == 'quote' )
			{
				this.extractString();
				return;
			}
			else if ( type == 'number' || ( !this.operator && type == 'minus' ) )
			{
				this.extractNumber();
				this.textLower = this.text.toLowerCase();
				return;
			}
			else if ( type == 'letter' )
			{
				var lineTokens = this.getLineTokens();
				this.module = null;

				// NEW?
				if ( lineTokens[ 0 ].text == 'new' )
				{
					this.text = 'new';
					this.textLower = this.text;
					this.type = 'other';
					this.position += 3;
					return;
				}

				// AND or OR?
				if ( lineTokens[ 0 ].text == 'and' )
				{
					this.text = '_and_';
					this.textLower = this.text;
					this.type = 'other';
					this.position += 3;
					return;
				}
				if ( lineTokens[ 0 ].text == 'or' )
				{
					this.text = '_or_';
					this.textLower = this.text;
					this.type = 'other';
					this.position += 2;
					return;
				}

				// A method or property in the current object?
				if ( options && options.scanObject )
				{
					if ( this.checkMethod( lineTokens, options.scanObject.definition ) )
					{
						this.type = 'objectMethod';
						return;
					}
					if ( this.checkProperty( lineTokens, options.scanObject.definition ) )
					{
						this.type = 'objectProperty';
						return;
					}
					this.type = '';
					this.definition = null;
				}

				// Find in all the possible tokens
				var quit = false;
				for ( lt = lineTokens.length - 1; lt >= 0; lt-- )
				{
					var lineTk = lineTokens[ lt ];

					// An extra token?
					if ( options && options.extraTokens )
					{
						// Simple extra token, not in expressions...
						if ( this.inExpression == 0 && this.extraTokens[ lineTk.text ] )
						{
							if ( !this.caseSensitive || lineTk.textReal == this.extraTokens[ lineTk.text ].name )
							{
								this.type = 'extraToken';
								//? lineTk.textReal = lineTk.text;
								this.extraTokenFunction = this.extraTokens[ lineTk.text ].func;
								break;
							}
						}

						// The name of a class 
						var c = this.charAt( lineTk.position );
						if ( c == '.' )
						{
							if ( this.findObject( lineTk.textReal ) )
							{
								this.type = 'objectClass';
								break;
							}
						}
					}

					// Object within program itself?
					var section = this.section;
					do
					{
						if ( section.objects[ lineTk.text ] )
						{
							if ( !this.caseSensitive || lineTk.textReal == section.objects[ lineTk.text ].nameReal )
							{
								this.type = 'class';
								this.definition = section.objects[ lineTk.text ];
								this.currentObject = this.definition;
								quit = true;
							}
							break;
						}

						// A procedure?
						if ( section.procedures[ lineTk.text ] && section.procedures[ lineTk.text ].nameRealLower == lineTk.textRealLower )
						{
							if ( !this.caseSensitive || lineTk.textReal == section.procedures[ lineTk.text ].nameReal )
							{
								this.type = 'procedure';
								this.definition = section.procedures[ lineTk.text ];
								quit = true;
							}
							break;
						}

						// Instructions within program itself?
						if ( section.instructions[ lineTk.text ] && this.inExpression == 0 )
						{
							if ( !this.caseSensitive || lineTk.text == section.instructions[ lineTk.text ].nameReal )
							{
								this.type = 'instruction';
								this.definition = section.instructions[ lineTk.text ];
								quit = true;
							}
							break;
						}

						// Function within program itself?
						if ( this.inExpression > 0 )
						{
							if ( section.functions[ lineTk.text ] )
							{
								if ( !this.caseSensitive || lineTk.textReal == section.functions[ lineTk.text ].nameReal )
								{
									this.type = 'function';
									this.definition = section.functions[ lineTk.text ];
									quit = true;
								}
								break;
							}
						}
						if ( quit )
							break;
						section = section.parentSection;
					} while( section )

					// Object from a module?
					if ( !options || ( options && !options.noObjects ) ) 
					{
						for ( var e in this.options.modules )
						{
							var module = this.options.modules[ e ];
							if ( module.objects[ lineTk.text ] )
							{
								if ( !this.caseSensitive || lineTk.textReal == module.objects[ lineTk.text ].nameReal )
								{
									this.type = 'class';
									this.module = module;
									this.definition = module.objects[ lineTk.text ];
									this.currentObject = this.definition;
									quit = true;
									break;
								}
							}
						}
						if ( quit ) 
							break;
					}

					// An object from an extension?
					for ( var e in this.options.extensions )
					{
						var extension = this.options.extensions[ e ];
						if ( extension.objects[ lineTk.text ] )
						{
							if ( !this.caseSensitive || lineTk.textReal == extension.objects[ lineTk.text ].nameReal )
							{
								this.type = 'class';
								this.module = extension;
								this.definition = extension.objects[ lineTk.text ];
								this.currentObject = this.definition;
								quit = true;
								break;
							}
						}
					}
					if ( quit ) 
						break;

					// Instruction or function from a module?
					for ( var e in this.options.modules )
					{
						var module = this.options.modules[ e ];
						if ( module.instructions[ lineTk.text ]  && this.inExpression == 0 )
						{
							if ( !this.caseSensitive || lineTk.textReal == module.instructions[ lineTk.text ].nameReal )
							{
								this.type = 'instruction';
								this.module = module;
								this.definition = module.instructions[ lineTk.text ];
								quit = true;
								break;
							}
						}
						if ( module.functions[ lineTk.text ]  && this.inExpression > 0 )
						{
							if ( !this.caseSensitive || lineTk.textReal == module.functions[ lineTk.text ].nameReal )
							{
								this.type = 'function';
								this.module = module;
								this.definition = module.functions[ lineTk.text ];
								quit = true;
								break;
							}
						}
					}
					if ( quit )
						break;

					// Instruction or function from an extension?
					for ( var e in this.options.extensions )
					{
						var extension = this.options.extensions[ e ];
						if ( extension.instructions[ lineTk.text ]  && this.inExpression == 0 )
						{
							if ( !this.caseSensitive || lineTk.textReal == extension.instructions[ lineTk.text ].nameReal )
							{
								this.type = 'instruction';
								this.module = extension;
								this.definition = extension.instructions[ lineTk.text ];
								quit = true;
								break;
							}
						}
						if ( extension.functions[ lineTk.text ]  && this.inExpression > 0 )
						{
							if ( !this.caseSensitive || lineTk.textReal == extension.functions[ lineTk.text ].nameReal )
							{
								this.type = 'function';
								this.module = extension;
								this.definition = extension.functions[ lineTk.text ];
								quit = true;
								break;
							}
						}
					}
					if ( quit )
						break;

					// One of the constants?
					if ( this.constants[ lineTk.text ] )
					{						
						if ( !this.caseSensitive || lineTk.textReal == this.constants[ lineTk.text ].name )
						{
							this.type = 'constant';
							this.returnType = this.constants[ lineTk.text ].type;
							this.code = this.constants[ lineTk.text ].code;
							this.token = lineTk.text;
							this.position = lineTk.position;
							break;
						}
					}

					// One of the main tokens?
					if ( lineTk.text == 'ror' || lineTk.text == 'rol' )
					{
						var c = this.substr( this.position + lineTk.length, 2 );
						if ( c == '.b' || c == '.w' || c == '.l' )
						{
							lineTk.text += c;
							lineTk.textReal += c;
							lineTk.position += 2;
						}
					}

					if ( tokenList[ lineTk.text ] )
					{
						if ( !this.caseSensitive || lineTk.textReal == tokenList[ lineTk.text ].name )
						{
							this.type = 'token';
							this.token = tokenList[ lineTk.text ];
							this.position = lineTk.position;
							if ( this.token.token == 'rem' )
							{
								this.type = 'remark';
								this.endOfInstruction = true;
							}
							if ( this.token.token == 'else' )
							{
								this.endOfInstruction = true;
							}
							break;
						}
					}
				}
				if ( this.type != '' )
				{
					this.text = lineTk.textReal;
					this.textLower = this.text.toLowerCase();
					this.position = lineTk.position;
					if ( this.module )
						this.module.inUse = true;
					if ( this.definition )
						this.definition.inUse = true;
					if ( this.type == 'instruction' || this.type == 'function' )
					{
						var saveEOL = this.endOfLine; 
						this.skipSpaces();
						this.variableTokenNames = [];
						var dollar = ( this.type == 'function' ? '$' : '_' );
						if ( this.definition.variableTokens )
						{
							for ( var n = 0; n < this.definition.variableTokens.length; n++ )
							{
								var variableName = '';
								var position = this.position;
								while( position < this.lineEnd )
								{
									var c = this.charAt( position );
									if ( !( ( c >= 'a' && c <= 'z' ) || ( c >= 'A' && c <= 'Z' ) || c == '_' || c == dollar ) )
										break;
									variableName += c;
									position++;
								}
								var pushed = false;
								if ( position < this.lineEnd )
								{
									var p = position;
									while ( this.charAt( p ) == ' ' && p < this.lineEnd )
										p++;
									if ( p < this.lineEnd )
									{
										var c = this.charAt( p );
										if ( c != ',' && c != ':' )
										{
											this.variableTokenNames.push( variableName );
											if ( c != '(' )
											{
												this.position = p - 1;
												pushed = true;
											}
											else
											{
												this.position = p;
											}
										}
									}
								}
								if ( !pushed || this.position >= this.lineEnd )
									break;
								this.skipSpaces();
							}
						}
						this.endOfLine = saveEOL;
					}
					return;
				}

				// A label?
				var lineTk = lineTokens[ 0 ];
				this.position = lineTk.position;
				if ( this.checkLabels && this.charAt( this.position ) == ':' )		// Want a column right after no space
				{
					this.text = lineTk.textReal;
					this.textLower = this.text.toLowerCase();
					this.type = 'label';
					this.position++;
					return;
				}

				// Should be a variable!
				this.isArray = false;
				c = this.peekNextChar();

				// Is it in fact, a call to a procedure? If yes, it should have been detected before.
				if ( c == '[' )
				{
					this.type = 'procedure';
					this.definition = null;
					break;
				}
				if ( c == '(' && !this.noArray )
					this.isArray = true;	
				this.noArray = false;
				this.text = lineTk.textReal;
				this.variableInfo = this.getVariableInfo( this.text, { isArray: this.isArray } );
				this.type = 'variable';
				this.returnType = this.variableInfo.type;
				this.textLower = this.text.toLowerCase();
				return;
			}

			// Any other type
			this.text = c;
			this.type = type;
			this.position++;
			switch ( c )
			{
				case "\\":
					this.type = 'nextline';
					break;
				case "'":
					if ( this.options.basicRemarks )
					{
						this.textLower = c;
							this.type = 'remark';
						this.endOfInstruction = true;
						this.endOfLine = true;
						return this.text;
					}
					break;
				case '/':
						c = this.charAt( this.position );
					if ( c == '/' || c == '*' )
					{
						this.position++;
							this.type = 'remark';
						this.endOfInstruction = true;
						this.text += c;
						this.textLower = this.text;
						return this.text;
					}
					break;
				case ':':
					this.textLower = c;
					this.endOfInstruction = true;
					return;
				case '#':
					this.textLower = '#';
					this.result = this.text;
					this.type = 'tag';
					return this.text;
				case '=':
						c = this.charAt( this.position );
					if ( c == '<' || c == '>' )
					{
						this.position++;
						this.text += c;
						this.textLower = this.text.toLowerCase();
						return this.text;
					}
					if ( c == '%' || c == '$' )
					{
						this.textLower = this.text.toLowerCase();
						return this.text;
					}
					break;
				case '+':
				case '-':
				case '–':
				case '*':
				case '/':
				case '^':
					this.textLower = c;
					this.result = this.text;
					this.type = 'other';
					return this.text;
				case '!':
					c = this.charAt( this.position );
					if ( c == '=' )
					{
						this.position++;
						this.text += c;
						this.textLower = this.text.toLowerCase();
						return this.text;
					}
					break;
				case '<':
					c = this.charAt( this.position );
					if ( c == '<' || c == '>' || c == '=' )
					{
						this.position++;
						this.text += c;
						this.textLower = this.text.toLowerCase();
						return this.text;
					}
					break;
				case '>':
					c = this.charAt( this.position );
					if ( c == '>' || c == '=' )
					{
						this.position++;
						this.text += c;
						this.textLower = this.text.toLowerCase();
						return this.text;
					}
					break;
			}
			this.textLower = this.text.toLowerCase();
			return this.text;

		case 'javascript':
			this.checkEndOfLine();
			if ( this.endOfLine )
			{
				this.endOfInstruction = true;
				return;
			}
			this.text = this.charAt( this.position++ );
			this.type = this.getCharacterType( this.text, scan );
			if ( this.type == 'quote' )
			{
				var start = --this.position;
				this.extractString();
					this.text = this.substring( start, this.position );
				return;
			}
			else if ( this.type == 'tag' || this.type == 'accolade' )
			{
				return;
			}
			else if ( this.text == '/' )
			{
					c = this.charAt( this.position );
				if ( c == '/' || c == '*' )
				{
					this.position++;
					this.type = 'remark';
					this.text += c;
					return;
				}
			}
			for ( ; this.position < this.lineEnd; this.position++ )
			{
					c = this.charAt( this.position );
				if ( this.getCharacterType( c, scan ) != this.type )
					break;
				this.text += c;
			}
			return;

		case 'tagname':
		case 'tagvariable':
			if ( scan == 'tagvariable' )
				this.skipSpaces();
			this.checkEndOfLine();
			if ( this.endOfLine )
			{
				this.endOfInstruction = true;
				return;
			}
				this.text = this.charAt( this.position++ );
			if ( this.getCharacterType( this.text ) != 'letter' && this.text != '$' )
			{
				this.pushError( 'syntax_error' );
				return;
			}
			while ( this.position < this.lineEnd )
			{
				var c = this.charAt( this.position );
				var t = this.getCharacterType( c );
				if ( t != 'letter' && t != 'number' && c != '$' )
					break;
				this.text += c;
				this.position++;
			}
			this.textLower = this.text.toLowerCase();
			break;

		case 'tagparameter':
			this.type = 'other';
			this.skipSpaces();
			if ( this.endOfLine )
			{
				this.endOfInstruction = true;
				return;
			}
			var c = this.charAt( this.position );
			var t = this.getCharacterType( c );
			if ( t == 'quote' )
			{
				this.extractString();
				this.result = this.text;
					this.textLower = this.text.toLowerCase();
			}
			else if ( t == 'number' )
			{
				this.extractNumber();
				this.result = parseInt( this.text );
					this.textLower = this.text.toLowerCase();
				}
				else
				{
					this.text = this.getSourceText( [ 'letter' ], [ ], { } );
					this.textLower = this.text.toLowerCase();
					if ( this.textLower == 'true' || this.textLower == 'false' )
						this.type = 'boolean';
			}
			this.textLower = this.text.toLowerCase();
			break;

		case 'checknewsyntax':
			var position = this.position;
			this.skipSpaces();
			var name = this.getSourceText( [ 'letter', 'number', '#', '$', '@' ], [ '=' ], { notAtFirst: [ 'number' ] } );
				this.skipSpaces();
			if ( this.charAt( this.position ) == '=' )
			{
				this.position++;
				this.parameter = true;
				this.parameterName = name;
				this.parameterToken = this.getVariableInfo( name, {} ).token;
				return;
			}
			this.setPosition( position );
			this.parameter = false;
			break;

		case 'instructionParameter':
			this.skipSpaces();
			var result = 
			{
				newSyntax: false,
				name: '',
				nameReal: '',
				value: undefined,
				token: '',
				tokenCode: '',
				type: '0',
				isArray: false,
				arrayDefinition: undefined
			};

			// A string?
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			if ( type == 'quote' )
			{				
				throw 'syntax_error';
			}
			else
			{
				var isArray = false;
				var text = this.getSourceText( [ 'letter', 'number', '#', '$', '@' ], [ '=', '(' ], { skipOpen: [ '"', "'" ], skipClose: [ '"', "'" ], notAtFirst: [ 'number' ] } ).trim();
				if ( this.charAt( this.position ) == '(' )
				{
					this.position++;
					this.skipSpaces();
					if ( this.charAt( this.position ) != ')' )
						throw 'syntax_error';
					this.position++;
					isArray = true;
					result.value = '(array)';
				}
				var vi = this.getVariableInfo( text, { isArray: isArray } );
				result.name = vi.name;
				result.nameReal = vi.nameReal;
				result.token = vi.token;
				result.tokenCode = vi.tokenCode;
				result.type = vi.type;
				this.skipSpaces();
				if ( this.charAt( this.position ) == '=' )
				{
					result.newSyntax = 'new';

					this.position++;
					this.skipSpaces();
					var savePos = this.position;
					result.value = this.getSourceText( [ 'any' ], [ ',', ' to' ], { skipOpen: [ '(', '"', "'" ], skipClose: [ ')', '"', "'" ] } ).trim(); 
					if ( result.value.toLowerCase() == '(index)' )
						result.type = '?';
					else if ( result.value.toLowerCase() == '(expcode)' )
						result.type = '?';
					else if ( result.value.toLowerCase() == '(any)' )
						result.type = '?';
					else if ( result.value.toLowerCase() == '(array)' )
						result.type = result.type;			// Dummy! ;)
					else if ( result.value.toLowerCase() == '(object)' )
						result.type = '3';
					else if ( result.value.toLowerCase() == '(varptr)' )
						result.type = '?';
					else if ( result.value.substring( 0, 1 ) == '(' )
					{
						result.newSyntax = 'list';
						result.value = '(list)';
						result.arrayDefinition = [];
						this.position = savePos + 1;
						while ( this.position < this.lineEnd )
						{
							var result2 = this.extractNextWord( 'instructionParameter' );
							result.arrayDefinition.push(
							{
								token: result2.token,
								type: result2.type,
								value: result2.value
							} );
							this.peekNextWord();
							if ( this.text != ',' )
							{
								this.position++;
								break;
							}
							this.setNextWord();						
						}
					}
				}
			}
			return result;

		case 'wantObjectName':
			this.skipSpaces();
			var start = this.position;
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			if ( type == 'letter' )
			{
				var quit = false;
				var lineTokens = this.getLineTokens();
				for ( lt = lineTokens.length - 1; lt >= 0 && !quit; lt-- )
				{
					var lineTk = lineTokens[ lt ];

					// Object within program itself?
					if ( this.section.objects[ lineTk.text ] )
					{
						if ( !this.caseSensitive || this.section.objects[ lineTk.text ].nameReal == lineTk.textReal )
						{
						this.type = 'class';
						this.definition = this.section.objects[ lineTk.text ];
						break;
					}
					}

					// Object from a module?
					for ( var e in this.options.modules )
					{
						var module = this.options.modules[ e ];
						if ( module.objects[ lineTk.text ] )
						{
							if ( !this.caseSensitive || module.objects[ lineTk.text ].nameReal == lineTk.textReal )
							{
							this.type = 'class';
							this.module = module;
							this.definition = module.objects[ lineTk.text ];
							quit = true;
							break;
						}
					}
					}
					if ( quit )
						break;

					// An object from an extension?
					for ( var e in this.options.extensions )
					{
						var extension = this.options.extensions[ e ];
						if ( extension.objects[ lineTk.text ] )
						{
							if ( !this.caseSensitive || extension.objects[ lineTk.text ].nameReal == lineTk.textReal )
							{
							this.type = 'class';
							this.module = extension;
							this.definition = extension.functions[ lineTk.text ];
							quit = true;
							break;
						}
						}
					}
				}
				if ( this.type != '' )
				{
					this.text = lineTk.textReal;
					this.textLower = this.text.toLowerCase();
					this.position = lineTk.position;
					if ( this.module )
						this.module.inUse = true;
					this.definition.inUse = true;
					return;
				}
			}
			this.type = 'other';
			this.text = '';
			break;

		case 'wantObjectMethodProperty':
			this.skipSpaces();
			var start = this.position;
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			this.type = '';
			if ( type == 'letter' )
			{
				var quit = false;
				var lineTokens = this.getLineTokens();
				for ( lt = lineTokens.length - 1; lt >= 0 && !quit; lt-- )
				{
					var lineTk = lineTokens[ lt ];

					// Scan extra tokens
					if ( this.extraTokens[ lineTk.text ] )
					{
						if ( !this.caseSensitive || this.extraTokens[ lineTk.text ].name == lineTk.textReal )
						{
							this.type = 'extraToken';
							this.text = lineTk.text;
							this.textLower = this.text.toLowerCase();
							this.extraTokenFunction = this.extraTokens[ lineTk.text ];
							this.position = lineTk.position;
							return;
						}
					}
					// Call an object?
					if ( this.findObject( lineTk.textReal ) )
					{
						this.text = lineTk.textReal;
						this.textLower = this.text.toLowerCase();
						this.position = lineTk.position;
						if ( this.module )
							this.module.inUse = true;
						this.definition.inUse = true;
						return;
					}
					// Call a method?
					var obj = options.currentObject;
					if ( obj )
					{
						if ( typeof obj == 'string' )
							obj = this.findObject( obj );
						if ( obj )
						{
							if ( this.checkMethod( lineTokens, obj ) )
							return;
						}
						// Call a property?
						//if ( this.checkProperty( lineTokens, currentObject ) )
						//	return;
					}
				}
				this.type = 'word';
				this.text = lineTokens[ 0 ].textReal;
				this.textLower = this.text.toLowerCase();
				this.position = lineTokens[ 0 ].position;
				this.returnType = '0';	
				break;
			}
			this.type = 'other';
			this.text = '';
			break;

		case 'wantObjectMethodProperty2':
			this.skipSpaces();
			var start = this.position;
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			this.type = '';
			if ( type == 'letter' )
			{
				var quit = false;
				var lineTokens = this.getLineTokens();
				for ( lt = lineTokens.length - 1; lt >= 0 && !quit; lt-- )
				{
					var lineTk = lineTokens[ lt ];
					var info = this.getVariableInfo( lineTk.text, { isArray: false, isParameter: true } );

					// Method in the current object?
					if ( options.isSuper )
					{					
						if ( options.definition.methods[ lineTk.text ] )	
						{
							this.type = 'method';
							this.definition = options.definition.methods[ lineTk.text ];
							this.currentObject = this.definition;
							this.position = lineTk.position;
							quit = true;
							return;
						}
					}
				}
				quit = this.checkMethod( lineTokens, options.definition );
				if ( quit )
					return;
				
				lineTokens[ 0 ].text = info.token;
				lineTokens[ 0 ].textReal = info.nameReal;
				quit = this.checkProperty( lineTokens, options.definition );
				if ( quit )
					return;
				this.type = 'word';
				this.text = lineTokens[ 0 ].textReal;
				this.textLower = this.text.toLowerCase();
				this.position = lineTokens[ 0 ].position;
				this.returnType = '0';	
				break;
			}
			this.type = 'other';
			this.text = '';
			break;
		
		case 'wantFunctionDesignation':
			this.variableTokens = [];
			this.skipSpaces();
			this.type = 'other';
			this.text = '';
			var c = this.charAt( this.position );
			var type = this.getCharacterType( c );
			if ( type == 'letter' )
			{
				// Get the next word, adding numbers
				for ( ; this.position < this.lineEnd; this.position++ )
				{
					c = this.charAt( this.position );
					var t = this.getCharacterType( c );
					if (  t != 'letter' && t != 'number' && c != '_' && c != ' ' && c != '(' )
						break;
					if ( c == '(' )
					{
						this.position++;
						c = this.charAt( this.position );
						var t = this.getCharacterType( c );
						if ( t != 'letter' )
							this.throwError( { error: 'syntax_error' } );
						var variableToken = '';
						for ( ; this.position < this.lineEnd; this.position++ )
						{
							c = this.charAt( this.position );
							t = this.getCharacterType( c );
							if ( t != 'letter' && t != 'number' && c != '_' && c != '$' )
								break;
							variableToken += c;
						}
						if ( c != ')' )
							this.throwError( { error: 'syntax_error' } );
						this.variableTokens.push( variableToken );
						continue;
					}		
					this.text += c;
					if ( this.text.toLowerCase().lastIndexOf( 'extends ' ) >= 0 )
					{
						this.text = this.text.substring( 0, this.text.length - 8 );
						this.position -= 7;		// as position has not been incremented in the loop...
						for ( var p = this.text.length - 1;  p >= 0; p-- )
						{
							if ( this.text.charAt( p ) != ' ' )
							{
								c = this.text.charAt( p );
								break;
							}
							this.position--;
						}
						break;
					}
				}
				this.returnType = '0';
				if ( c == '#' )
				{
					this.position++;
					this.returnType = '1';
				}
				else if ( c == '$' )
				{
					this.text += '$';
					this.position++;
					this.returnType = '2';
				}
				else if ( c == '@' )
				{
					this.position++;
					this.returnType = '3';
				}
				// Trim the right
				this.text = this.text.trimEnd();
				this.textLower = this.text.toLowerCase();		
				this.type = 'functionDesignation';
			}
			else if ( type == 'quote' )
			{
				var o = this.findLineAndColumn(); //console.log( "Remove quotes at line " + o.line + " - file:" + o.include.path );
				this.text = this.extractString();
				this.returnType = '0';
				var c = this.text.charAt( this.text.length - 1 );
				if ( c == '#' )
				{
					this.returnType = '1';
				}
				else if ( c == '$' )
				{
					this.returnType = '2';
				}
				else if ( c == '@' )
				{
					this.returnType = '3';
				}
				this.type = 'functionDesignation';
			}
			break;

		case 'wantMethod':
			var start = this.position;
			var lineTokens = this.getLineTokens();

			// Set or get property?
			/*
			if ( lineTokens[ 0 ].text == 'set' || lineTokens[ 0 ].text == 'get' )
				{
				this.text = lineTokens[ 0 ].text;
				this.textLower = this.text.toLowerCase();
				this.position = lineTokens[ 0 ].position;
				var lineTokens2 = this.getLineTokens();
				if ( this.checkProperty( this.section, lineTokens2, currentObject ) )
					return;					
				for ( var e in this.options.modules )
				{
					if ( this.checkProperty( this.options.modules[ e ], lineTokens2, currentObject ) )
						return;
				}
				for ( var e in this.options.extensions )
				{
					if ( this.checkProperty( this.options.extensions[ e ], lineTokens2, currentObject ) )
						return;
				}
				}
			*/
			// Call a method?
			if ( this.checkMethod( lineTokens, options.currentObject ) )
				return;
			for ( var e in this.options.modules )
				{
				if ( this.checkMethod( lineTokens, options.currentObject ) )
					return;
				}
			for ( var e in this.options.extensions )
			{
				if ( this.checkMethod( lineTokens, options.currentObject ) )
					return;
			}
			this.position = start;
			this.type = 'other';
			break;
	}
};
Information.prototype.findObject = function( className )
{
	this.module = null;
	var className = this.caseSensitive ? className : className.toLowerCase();

	// Object within program itself?
	for ( var o in this.section.objects )
	{
		for ( var v = 0; v < this.section.objects[ o ].variants.length; v++ )
		{
			var variant = this.section.objects[ o ].variants[ v ];
			var name = this.caseSensitive ? variant.className : variant.className.toLowerCase();
			if ( name == className )
			{
				this.type = 'class';
				this.definition = this.section.objects[ o ];
				this.className = variant.className;							
				return this.definition;
			}
		}
	}

	// Object from a module?
	for ( var e in this.options.modules )
	{
		var module = this.options.modules[ e ];
	for ( var o in module.objects )
	{
			for ( var v = 0; v < module.objects[ o ].variants.length; v++ )
			{
				var variant = module.objects[ o ].variants[ v ];
				var name = this.caseSensitive ? variant.className : variant.className.toLowerCase();
				if ( name == className )
				{
					this.type = 'class';
					this.module = module;
					this.definition = module.objects[ o ];
					this.className = variant.className;
					return this.definition;
				}
			}
		}
	}

	// An object from an extension?
	for ( var e in this.options.extensions )
	{
		var extension = this.options.extensions[ e ];
		for ( var o in extension.objects )
		{
			for ( var v = 0; v < extension.objects[ o ].variants.length; v++ )
			{
				var variant = extension.objects[ o ].variants[ v ];
				var name = this.caseSensitive ? variant.className : variant.className.toLowerCase();
				if ( name == className )
				{
					this.type = 'class';
					this.module = extension;
					this.definition = extension.objects[ o ];
					this.className = variant.className;
					return this.definition;
				}
			}
		}
	}
	return false;
};
Information.prototype.checkProperty = function( lineTokens, currentObject )
{
	var self = this;
	var className = this.caseSensitive ? currentObject.className : currentObject.className.toLowerCase();
	this.module = null;

	var result;
	for ( lt = lineTokens.length - 1; lt >= 0; lt-- )
	{
		var lineTk = lineTokens[ lt ];	

		// In current object?
		if ( className )
		{
			if ( result = checkIt( currentObject, lineTk ) )
				return result;

			// Check in friend/derivative classes
			for ( var v = 0; v < 1; v++ )
			{
				var variant = currentObject.variants[ v ];

				// Check in friend classes
				for ( var f = 0; f < variant.friendWith.length; f++ )
				{
					var fName = variant.friendWith[ f ];
					var fClass = this.findClass( variant, fName );
					if ( result = checkIt( fClass, lineTk ) )
						return result;
				}
	
				// Check in derivative classes
				for ( var f = 0; f < variant.extendedBy.length; f++ )
				{
					var fName = variant.extendedBy[ f ];
					var fClass = this.findClass( variant, fName );
					if ( result = checkIt( fClass, lineTk ) )
						return result;
				}
			}
		}
		
		// Object within program itself?
		for ( var o in this.section.objects )
		{
			if ( result = checkIt( this.section.objects[ o ], lineTk ) )
			{
				return true;
			}
		}

		// Object from a module?
		for ( var e in this.options.modules )
		{
			var module = this.options.modules[ e ];
			for ( var o in module.objects )
			{
				if ( result = checkIt( module.objects[ o ], lineTk ) )
				{
					this.module = module;
					return result;
				}
			}
		}

		// An object from an extension?
		for ( var e in this.options.extensions )
		{
			var extension = this.options.extensions[ e ];
			for ( var o in extension.objects )
			{
				if ( result = checkIt( extension.objects[ o ], lineTk ) )
				{
					this.module = extension;
					return result;
				}
			}
		}
	}
	return false;

	function checkIt( thatObject, tk )
	{
		for ( var v = 0; v < thatObject.variants.length; v++ )
		{
			var variant = thatObject.variants[ v ];
			var syntax = variant.syntax;
			for ( var p = 0; p < syntax.length; p++ )
			{
				if ( tk.text == syntax[ p ].token )
				{
					if ( !this.caseSensitive || syntax[ p ].nameReal == tk.textReal )
					{
						self.type = 'property';
						self.definition = variant;
						self.property = syntax[ p ].name;
						self.propertyToken = syntax[ p ].token;
						self.text = syntax[ p ].nameReal;
						self.textLower = self.property.toLowerCase();
						self.returnType = syntax[ p ].type;
						self.position = tk.position;
						return variant;
					}
				}
			}
		}
		return false;
	}
};
Information.prototype.checkMethod = function( lineTokens, currentObject )
{
	var self = this;
	var className = currentObject ? ( this.caseSensitive ? currentObject.className : currentObject.className.toLowerCase() ) : null;
	this.module = null;

	var result;
	for ( lt = lineTokens.length - 1; lt >= 0; lt-- )
	{
		var lineTk = lineTokens[ lt ];	

		// In current object?
		if ( className )
		{
			if ( result = checkIt( currentObject, lineTk ) )
			{
				return result;
			}
		}

		// Object within program itself?
		for ( var o in this.section.objects )
		{
			if ( result = checkIt( this.section.objects[ o ], lineTk ) )
			{
				return result;
			}
		}

		// Object from a module?
		for ( var e in this.options.modules )
		{
			var module = this.options.modules[ e ];
			for ( var o in module.objects )
			{
				if ( result = checkIt( module.objects[ o ], lineTk ) )
				{
					this.module = module;
					return result;
				}
			}
		}

		// An object from an extension?
		for ( var e in this.options.extensions )
		{
			var extension = this.options.extensions[ e ];
			for ( var o in extension.objects )
			{
				if ( result = checkIt( extension.objects[ o ], lineTk ) )
				{
					this.module = extension;
					return result;
				}
			}
		}
	}
	return false;

	function checkIt( thatObject, tk )
	{
		var name = this.caseSensitive ? thatObject.className : thatObject.className.toLowerCase();
		if ( !className || ( className && name == className ) )
		{
			for ( var v = 0; v < thatObject.variants.length; v++ )
			{
				var variant = thatObject.variants[ v ];
				if ( variant.methods[ tk.text ] )
				{
					if ( !this.caseSensitive || variant.methods[ tk.text ].nameReal )
					{
						self.type = 'method';
						variant.inUse = true;
						self.definition = variant.methods[ tk.text ];
						self.text = self.definition.nameReal;
						self.textLower = self.text.toLowerCase();
						self.position = tk.position;
						return variant;
					}
				}
			}
		}
		return false;
	}
};

Information.prototype.getLineTokens = function( options )
{
	options = typeof options == 'undefined' ? {} : options;

	var lineTokens = [];
	var lineText = '';
	var linePlus = '';
	var lineReal = '';
	var linePlusReal = '';
	var c;
	this.module = null;
	var quit = false;
	var pp;
	this.skipSpaces();
	do
	{
		for ( pp = this.position; pp < this.lineEnd && !quit; pp++ )
		{
			c = this.charAt( pp ).toLowerCase();
			if ( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) || c == ' ' || c == '_' || c == '$' || c == '#' || c == '@' )
			{
				if ( c == ' ' )
				{
					if ( options.removeLastS && lineText.substr( lineText.length - 1, 1 ).toLowerCase() == 's' )
						lineText = lineText.substring( 0, lineText.length - 1 );
					lineTokens.push( { text: lineText, textReal: lineReal, textRealLower: lineReal.toLowerCase(), position: pp } );
					linePlus += token_replacement_char;
					linePlusReal += ' ';
				}
				// Exception for objects: allows variable@method.
				else if ( c == '@' ) 
				{
					lineText += linePlus + c;
					lineReal += linePlusReal + this.charAt( pp );
					linePlus = '';
					linePlusReal = '';
					quit = true;
				}
				else
				{
					lineText += linePlus + c;
					lineReal += linePlusReal + this.charAt( pp );
					linePlus = '';
					linePlusReal = '';
				}
				if ( c == '$' || c == '#' )
					quit = true;
			}
			else
			{
				pp--;
				quit = true
			}
		}
		if ( linePlus == '' )
		{
			if ( options.removeLastS && lineText.substr( lineText.length - 1, 1 ).toLowerCase() == 's' )
				lineText = lineText.substring( 0, lineText.length - 1 );
			lineTokens.push( { text: lineText, textReal: lineReal, textRealLower: lineReal.toLowerCase(), position: pp } );
		}
	} while ( pp < this.lineEnd && !quit )
	return lineTokens;
}
Information.prototype.getTokensFromText = function( text )
{
	var lineTokens = [];
	var lineText = '';
	var linePlus = '';
	var lineReal = '';
	var linePlusReal = '';
	var c;
	this.module = null;
	var quit = false;
	var pp;
	do
	{
		for ( pp = 0; pp < text.length && !quit; pp++ )
		{
			c = text.charAt( pp ).toLowerCase();
			if ( ( c >= 'a' && c <= 'z' ) || ( c >= '0' && c <= '9' ) || c == ' ' || c == '_' || c == '$' || c == '#' || c == '@' )
			{
				if ( c == ' ' )
				{
					lineTokens.push( { text: lineText, textReal: lineReal, textRealLower: lineReal.toLowerCase(), position: pp } );
					linePlus += token_replacement_char;
					linePlusReal += ' ';
				}
				// Exception for objects: allows variable@method.
				else if ( c == '@' ) 
				{
					lineText += linePlus + c;
					lineReal += linePlusReal + text.charAt( pp );
					linePlus = '';
					linePlusReal = '';
					quit = true;
				}
				else
				{
					lineText += linePlus + c;
					lineReal += linePlusReal + text.charAt( pp );
					linePlus = '';
					linePlusReal = '';
				}
			}
			else
			{
				pp--;
				quit = true
			}
		}
		if ( linePlus == '' )
		{
			lineTokens.push( { text: lineText, textReal: lineReal, textRealLower: lineReal.toLowerCase(), position: pp } );
		}
	} while ( pp < text.length && !quit )
	return lineTokens;
}

Information.prototype.setParameters = function( syntax, text, results )
{
	for ( var p = 0; p < syntax.length; p++ )
		text = UTILITIES.replaceParameter( text, '%' + syntax[ p ].nameReal, results[ p ] );
	text = UTILITIES.replaceParameter( text, ',undefined)', ')' );
	//text = UTILITIES.replaceParameter( text, '(undefined)', '()' );
	return text;
};
Information.prototype.skipRemark = function( tab )
{
	if ( this.text == '/*' )
	{
		while ( !this.endOfText )
		{
			this.extractToEndOfLine();
			if ( this.text.indexOf( '*/' ) >= 0 )
			{
				this.position = this.positionPrevious + this.text.indexOf( '*/' ) + 2;
				break;
			}
			this.nextLine( tab );
		}
	}
	else
	{
		this.extractToEndOfLine();
	}
};
Information.prototype.extractToEndOfLine = function( markEndOfLine )
{
	this.text = '';
	if ( !this.endOfText )
	{
		this.text = this.substring( this.position, this.lineEnd );
		this.position = this.lineEnd;
		if ( !markEndOfLine )
			this.endOfLine = true;
	}
	this.textLower = this.text.toLowerCase();
	return this.text;
};
Information.prototype.extractSource = function( start, end )
{
	return this.substring( start, end );
};
Information.prototype.extractNextChar = function()
{
	this.skipSpaces();
	if ( this.endOfLine )
		return '';

	this.text = this.charAt( this.position++ );
	this.textLower = this.text.toLowerCase();
	this.type = this.getCharacterType( this.text );
	return this.text;
};
Information.prototype.peekNextChar = function()
{
	var c = '';
	var save = this.position;
	var saveEnd = this.endOfLine;
	this.skipSpaces();
	if ( !this.endOfLine )
	{
		c = this.charAt( this.position );
	}
	this.endOfLine = saveEnd;
	this.position = save;
	return c;
};
Information.prototype.skipSpaces = function()
{
	if ( this.position >= this.lineEnd )
	{
		this.endOfLine = true;
	}
	else
	{
		while( !this.endOfLine )
		{
			var c = this.charCodeAt( this.position );
			if ( c == 32 || c == 9 )
				this.position++;
			else if ( c == 92 )		// "\\"
				this.nextLine();
			else if ( c == 10 || c == 13 )
				this.endOfLine = true;
			else
				break;
		}
	}
};
Information.prototype.checkEndOfLine = function()
{
	var position = this.position;
	while( !this.endOfLine )
	{
		var c = this.charCodeAt( position );
		if ( c == 32 || c == 9 )
			position++;
		else if ( c == 10 || c == 13 )
		{
			this.endOfLine = true;
			this.position = position;
		}
		else
			break;
	}
};
Information.prototype.extractString = function( tab )
{
	this.type = 'empty';
	this.skipSpaces();
	if ( this.endOfLine )
		return;

	this.text = '';
	var quote = this.charAt( this.position );
	var quoteEnd = ( quote == '“' ? '”' : quote );
	//if ( this.getCharacterType( quote, scan ) == 'quote' )
	{
		this.position++;
		while( this.position < this.lineEnd )
		{
			var c = this.charAt( this.position++ );
			if ( c == '\\' )
			{
				var nextLine = true;
				for ( var p = this.position; p < this.lineEnd; p++ )
				{
					var c2 = this.charAt( p );
					if ( c2 == 10 || c2 == 13 )
						break;
					if ( c2 != 32 && c2 != 9 )
					{
						nextLine = false;
						break;
					}
				}
				if ( nextLine )
					this.nextLine( tab );
				else
					this.text += '\\\\';
				continue;
			}
			else if ( c == quoteEnd )
			{
				this.type = 'string';
				this.returnType = '2';
				return this.text;
			}
			this.text += c;
		}
		this.throwError( { error: 'string_not_closed' } );
	}
	this.textLower = this.text.toLowerCase();
	return this.text;
};
Information.prototype.extractNumber = function()
{
	this.skipSpaces();
	if ( this.endOfLine )
		return;

	this.text = '';
	this.type = 'empty';
	var c = this.charAt( this.position );
	if ( c == '-' || c == '–' )
	{
		this.position++;
		this.skipSpaces();
		if ( this.endOfLine )
		this.throwError( { error: 'syntax_error' } );
		this.text += '-';
		c = this.charAt( this.position );
	}
	// TODO: handle exponantial numbers!
	if ( this.getCharacterType( c ) == 'number' )
	{
		this.text += c;
		this.position++;
		this.returnType = '0'
		this.numberType = '0'
		while( this.position < this.lineEnd )
		{
			c = this.charAt( this.position );
			if ( !( ( c >= '0' && c <= '9' ) || c == '.' ) )
				break;
			this.text += c;
			if ( c == '.' )
				this.numberType = '1';
			this.position++;
		}
		this.type = 'number';
	}
	return this.text;
};
Information.prototype.val = function( value )
{
	var base = 10;
	if ( value.substring( 0, 1 ) == '$' )
	{
		value = value.substring( 1 );
		base = 16;
	}
	if ( value.substring( 0, 1 ) == '%' )
	{
		value = value.substring( 1 );
		base = 2;
	}
	return parseInt( value, base );
};
Information.prototype.setNextWord = function( pos )
{
	this.position = typeof pos != 'undefined' ? pos : this.peekNextWordEnd;
	var line = this.lines[ this.currentLine ];
	this.lineDebug = line.include.source.substring( this.position - line.offset, line.end - line.offset );
	this.endOfLine = false;
};

Information.prototype.gotoNextInstruction = function()
{
	while( true )
	{
		this.extractNextWord();
		if ( this.type == 'remark' || this.endOfInstruction || this.endOfLine || this.endOfText || this.text == ':' )
			break;
	};
};
Information.prototype.addLine = function( code, isOnlyEnd, tabs )
{
	if ( !this.currentBlock )
		this.currentBlock = '';
	this.addSourceLine();
	if ( this.debug_addWatch != '' )
	{
		this.currentBlock += this.options.tabs + this.debug_addWatch + '\n';
		this.debug_addWatch = '';
	}
	if ( code != '' )
	{
		this.currentBlock += this.options.tabs + code + '\n';
		if ( !isOnlyEnd )
			this.linesAdded += 1;
	}
};
Information.prototype.addDebuggerLine = function( code, isOnlyEnd, tabs )
{
	if ( !this.currentDebuggerBlock )
		this.currentDebuggerBlock = '';
	if ( code != '' )
	{
		this.currentDebuggerBlock += this.options.tabs + code + '\n';
	}
};
Information.prototype.addSourceLine = function()
{
	if ( this.sourceLine )
	{
		var sourceLine = UTILITIES.trimString( this.sourceLine.text );
		if ( sourceLine.toLowerCase().indexOf( '// include' ) < 0 )
		{
			if ( this.sourceLine.line.include != this.previousSourceLineInclude )
			{
				this.previousSourceLineInclude = this.sourceLine.line.include;
				sourceLine = '// From source: ' + this.sourceLine.line.include.path;
				if ( this.currentBlock != '' )
					this.currentBlock += this.options.tabs + '\n';
			}
			this.currentBlock += this.options.tabs + sourceLine + '\n';
		}
		this.sourceLine = undefined;
	}
};
Information.prototype.getBlockPlus = function( number, plus )
{
	plus = ( typeof plus == 'undefined' ? 0 : plus );
	return ( this.options.directMode ? 'startBlock+' : '' ) + ( this.section.blockPlus[ number ] + plus );
};
Information.prototype.countTabs = function( line, position )
{
	var p, column;
	for ( p = line.start, column = 0; p < position; p++ )
	{
		if ( this.charAt( p ) == '\t' )
			column += this.options.tabWidth;
		else
			column++;
	}
	return column;
}
Information.prototype.nextBlock1 = function( force )
{
	if ( typeof this.section.blockAnchors[ this.position ] == 'undefined' )
		this.section.blockAnchors[ this.position ] = this.blockNumber;

	//if ( !force && this.addedBlock > 0 )
	//	return;
	if ( !force )
	{
		force = this.section.waiting || this.section.error || this.debugger;
		force |= ( this.position == this.positionLastBlock );
	}
	if ( force )
	{
		this.positionLastBlock = this.position;
		this.section.blockPlus[ this.blockNumber++ ] = 1;
		this.addedBlock++;
	}
};
Information.prototype.nextBlock2 = function( force, loopBlock )
{
	//if ( !force && this.addedBlock > 0 )
	//	return;

	var blockNumber = this.section.blockAnchors[ this.position ];
	if ( typeof blockNumber == 'undefined' )
	{
		for ( var p = this.position; p >= this.lineStart; p-- )
		{
			blockNumber = this.section.blockAnchors[ p ];
			if ( typeof blockNumber != 'undefined' )
				break;
		}
	}
	if ( typeof blockNumber == 'undefined' )
		blockNumber = 0;

	if ( this.debugger && this.currentInstructionInfo )	
	{
		// Find end of current instruction
		var line = this.lines[ this.currentLine ];
		var column = this.countTabs( line, this.position );
		if ( this.currentInstructionInfo.type == 'token' )
		{
			this.addDebuggerLine( 'if(command=="info")' );
			this.addDebuggerLine( '\treturn {type:"' + this.currentInstructionInfo.type + '",position:"' + this.currentInstructionInfo.include.number + ':' + this.currentInstructionInfo.line + ':' + this.currentInstructionInfo.column + ':' + column + '",name:"' + this.currentInstructionInfo.nameReal + '",token:"' + this.currentInstructionInfo.token.token + '"};' );	
		}
		else
		{
			this.addDebuggerLine( 'if(command=="info")' );
			this.addDebuggerLine( '\treturn {type:"' + this.currentInstructionInfo.type + '",position:"' + this.currentInstructionInfo.include.number + ':' + this.currentInstructionInfo.line + ':' + this.currentInstructionInfo.column + ':' + column + '",name:"' + this.currentInstructionInfo.nameReal + '"};' );	
		}
		if ( loopBlock )
		{
			this.addDebuggerLine( 'if(command=="loop")' );
			this.addDebuggerLine( '\treturn ' + loopBlock + ';' );
		}
		if ( this.parameterPositions.length )
		{
			this.addDebuggerLine( 'if(command=="getParams")' );
			var code = '\treturn[';
			for ( var p = 0; p < this.parameterPositions.length; p++ )
			{
				var param = this.parameterPositions[ p ];
				code += "{data:'" + JSON.stringify( param.data ) + "', value: function(aoz,vars){return " + param.code + "}},";
			}
			code += '];'
			this.addDebuggerLine( code );
			this.parameterPositions = [];
		}
		this.section.debuggerBlocks[ blockNumber ] = this.currentDebuggerBlock;
		this.currentDebuggerBlock = '';
	}
	if ( typeof this.section.blocks[ blockNumber ] == 'string' )
		this.section.blocks[ blockNumber ] += this.currentBlock;
	else
		this.section.blocks[ blockNumber ] = this.currentBlock;
	this.previousCurrentBlock = this.currentBlock;
	this.currentBlock = '';
	this.addSourceLine();
	this.options.label = false;
	this.addedBlock++;
};
Information.prototype.indent = function()
{
	this.options.tabs += '\t';
};
Information.prototype.unIndent = function()
{
	this.options.tabs = this.options.tabs.substring( 0, this.options.tabs.length - 1 );
};
Information.prototype.storeSourceReference = function()
{
	if ( this.options.addSourceReference )
	{
		// Skip spaces
		var c;
		var start = this.position;
		while ( ( c = this.charAt( start ) ) == ' ' || c == '\t' )
			start++

		// Poke into code
		var o = this.findLineAndColumn( start );
		this.sourcePos = 'aoz.sourcePos="' + o.include.number + ':' + o.line + ':' + o.column + '";';
		this.currentInstructionInfo = o;
	}
};
Information.prototype.updateSourceReference = function()
{
	if ( this.currentInstructionInfo )
	{
		this.currentInstructionInfo.type = this.type;
		this.currentInstructionInfo.nameReal = this.text;
		this.currentInstructionInfo.token = this.token;
	}
};
Information.prototype.addSourceReference = function()
{
	if ( ( this.debugger || this.options.addSourceReference ) && this.sourcePos != '' )
	{
		this.addLine( this.sourcePos );		
		this.sourcePos = '';
	}
};
Information.prototype.getCharacterType = function( c, scan )
{
	if ( !scan )
	{
		if ( c >= '0' && c <= '9' )
			type = 'number';
		else if ( c == ' ' || c == "\t" )
			type = 'space';
		else if ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' )
			type = 'letter';
		else if ( c == '"' || c == '“' )
			type = 'quote';
		else if ( c == "'" )
		{
			if ( this.options.basicRemarks )
				type = 'remark';
			else
				type = 'quote';
		}
		else if ( c == ':' )
			type = 'column';
		else if ( c == ';' )
			type = 'semicolumn';
		else if ( c == '-' || c == '–' )
			type = 'minus';
		else if ( c == '(' || c == ')' )
			type = 'bracket';
		else if ( c == '{' || c == '}' )
			type = 'accolade';
		else
			type = 'other';
	}
	else if ( scan == 'javascript' )
	{
		if ( c == '"' || c == "'" || c == '“' )
			type = 'quote';
		else if ( c == '{' || c == '}' )
			type = 'accolade';
		else if ( c == '#' )
			type = 'tag';
		else
			type = 'other';
	}
	else if ( scan == 'tagparameter' )
	{
		if ( c == '"' || c == "'" || c == '“' )
			type = 'quote';
		else if ( c == ' ' || c == "\t" )
			type = 'space';
		else if ( c >= '0' && c <= '9' )
			type = 'number';
		else
			type = 'other';
	}
	else if ( scan == 'tagname' )
	{
		if ( c == ' ' || c == "\t" )
			type = 'space';
		else if ( ( c >= '0' && c <= '9' ) || ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' ) )
			type = 'letter';
		else
			type = 'other';
	}
	else
	{
		this.throwError( { error: 'internal_error' }, true );
	}
	return type;
};
Information.prototype.getExpressionErrorParameter = function()
{
	var l = this.endOfExpression - this.startOfExpression;
	if ( l > 0 && l < 32 )
	{
		return this.substring( this.startOfExpression, this.endOfExpression );
	}
	return '';
}
Information.prototype.throwError = function( message, halt )
{
	var o = this.findLineAndColumn( message.position );
	message.line = o.line + 1;
	message.column = o.column + 1;
	message.file = o.include.path;

	if ( this.errorCallback )
		this.errorCallback( message );
	else
	{		
		MESSAGES.pushError( message );
		//MESSAGES.error( message.error, message.file, message.line, message.column, message.parameter, { outputToConsole: true } );
	}	
	if ( halt )
	{
		throw 'halt';
	}
};
Information.prototype.warning = function( warning, parameter )
{
	var o = this.findLineAndColumn();
	var message = { warning: warning, file: o.include.path, line: o.line + 1, column: o.column, parameter: parameter };
	if ( this.warningCallback )
		this.warningCallback( message );
	else
		MESSAGES.pushError( message );
};
Information.prototype.checkTypes = function( typeDestination, typeSource )
{
	typeDestination = typeof typeDestination == 'number' ? '' + typeDestination : typeDestination;
	typeSource = typeof typeSource == 'number' ? '' + typeSource : typeSource;
	switch ( typeDestination )
	{
		case '0':
		case '1':
		return ( typeSource == '0' || typeSource == '1' || typeSource == '?' );
		case '2':
			return ( typeSource == '2' || typeSource == '?' );
		case '3':
			return ( typeSource == '3' );
		case '?':
		return true;
	}
	return false;
}


///////////////////////////////////////////////////////////////////////
// Common syntax parser, passes 0, 1 and 2
///////////////////////////////////////////////////////////////////////
Information.prototype.parseSyntax0 = function( objectType )
{
	// Gather parameters
	var parameters = [];
	this.peekNextWord();
	if ( !this.peekEndOfInstruction )
	{
		if ( ( objectType != 'procedure' && this.text != ',' ) || ( objectType == 'procedure' && this.text != '[' ) )
			this.throwError( { error: 'syntax_error' } );
		this.setNextWord();

		while ( true )
		{
			this.peekNextWord();
			if ( objectType == 'procedure' && this.text == ']' )
				break;
			var parameter =
			{
				type: '0',
				name: '',
				nameReal: '',
				token: '',
				tokenCode: '',
				value: undefined,
				separator: '',
				class: '',
				definition: null,
				nameReal: '',
				newSyntax: false,
			};
		
			info = this.extractNextWord( 'instructionParameter' );
			parameter.newSyntax = info.newSyntax;
			parameter.type = info.type;
			parameter.value = info.value;
			parameter.name = info.name;
			parameter.nameReal = info.nameReal;
			parameter.token = info.token;
			parameter.tokenCode = info.tokenCode;
			parameter.arrayDefinition = info.arrayDefinition;

			this.peekNextWord();
			if ( this.text != ',' && this.textLower != 'to' )
			{
				parameter.separator = '%end%';
				parameters.push( parameter );
				break;
			}
			parameter.separator = this.textLower;

			this.setNextWord();
			parameters.push( parameter );
		}
	}

	// Check the parameter strings
	for ( var p = 0; p < parameters.length; p++ )
	{
		var parameter = parameters[ p ];
		if ( parameter.value == '(list)' )
		{
			for ( var pp = 0; pp < parameter.arrayDefinition.length; pp++ )
			{
				this.getDefaultValue( parameter.arrayDefinition[ pp ] );
			}
		}
		else
		{ 
			this.getDefaultValue( parameter );
		}
		/*
		else if ( parameter.value == '(array)' )
		{
		}
		else if ( parameter.value == '(object)' )
		{
		}
		else if ( parameter.value == '(any)' )
		{
		}
		else if ( parameter.value == '(index)' )
		{
		}
		*/
	}
	return parameters;
}
Information.prototype.getDefaultValue = function( parameter )
{
	if ( typeof parameter.value != 'undefined' )
	{
		var value = parameter.value.toLowerCase();
		if ( value != '(object)' 
			&& value != '(array)' 
			&& value != '(index)' 
			&& value != '(any)' 
			&&  value != '(list)' 
			&& value != '(varptr)' 
			&& value != '(color)' 
			&& value != '(expcode)' )
		{
			this.pushSource( parameter.value );
			var result = this.getExpression( EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO );
			this.popSource();
			if ( !result.constant )
				throw 'syntax_error';
			if ( !this.checkTypes( result.type, parameter.type ) )
				this.throwError( { error: 'type_mismatch', parameter: self.getExpressionErrorParameter() } );
			parameter.value = result.code;
		}
		else if ( value == '(object)' )
			parameter.value = 'undefined';
	}
	else
	{
		parameter.value = 'undefined';
	}
};
Information.prototype.parseSyntax1 = function( objectDefinition, options = {} )
{
	var save = this.position;

	// Gather the parameters
	var flags = typeof options.flags != 'undefined' ? options.flags : 0;
	this.peekNextWord();
	if ( !this.peekEndOfInstruction )
	{
		if ( objectDefinition.type == 'procedure' )
		{
			if ( this.text == '[' )
			{
				flags |= EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONSQUAREBRACKET;
				this.setNextWord();
			}
		}
		else
		{
			flags |= EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONCOLON | EXPFLAG_ENDONSEMICOLON | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO;
		}
	}
	var param = 0;
	var parameters = [];
	this.waitingFunctionCount = 0;
	options = typeof options == 'undefined' ? {} : options;
	var start = this.position;
	if ( flags )
	{
		if ( options.skipIndex )
		{
			this.compileExpression( flags );
			this.peekNextWord();
			if ( !this.peekEndOfInstruction )
			{
				this.setNextWord();
				if ( this.text != ',' )
					this.throwError( { error: 'syntax_error' } );
			}
		}
		if ( !this.peekEndOfInstruction )
		{
			var todo = true;
			this.peekNextWord();
			if ( objectDefinition.type == 'procedure' )
			{
				if ( this.text == ']' )
				{
					this.setNextWord();
					todo = false;
				}
			}
			else
			{
				if ( this.text == ')' )
				{
					this.setNextWord();
					todo = false;
				}
			}
			if ( todo )
			{
				while( true )
				{
					var exp = this.compileExpression( flags );
					parameters[ param++ ] = 
					{
						type: exp.type,
						newSyntax: exp.parameter,
						name: exp.parameterName,
						token: exp.parameterToken,
						isArray: exp.isArray,
						separator: undefined,
						list: false,
						startSource: exp.startSource,
						endSource: exp.endSource
					};
					this.peekNextWord();
					if ( objectDefinition.type == 'procedure' && this.text == ']' )
					{
						this.setNextWord();
						break;
					}
					if ( objectDefinition.type == 'method' && this.text == ')' )
					{
						this.setNextWord();
						break;
					}
					if ( this.peekEndOfInstruction || this.peekEndOfLine )
						break;
					parameters[ param - 1 ].separator = this.textLower;
					this.setNextWord();
				}
				parameters[ param - 1 ].separator = '%end%';
			}
		}
	}
	var info = this.findBestVariant( objectDefinition, parameters, { source: this.substring( start, this.position ) } );
	if ( info )
	{
		// Put the parameters in the list of global variables
		//for ( var v = 0; v < info.variant.syntax.length; v++ )
		//{
		//	var token = info.variant.syntax[ v ].token;
		//	info.variant.globals[ token ] = { name: info.variant.syntax[ v ].name, nameReal: info.variant.syntax[ v ].nameReal, token: token, tokenCode: info.variant.syntax[ v ].tokenCode };		// TOCHECK
		//}			
		info.variant.inUse = true;
		this.section.anchors[ save ] = { definition: info.variant, positions: info.positions, tags: info.variant.tags, addIndex: options.addIndex, variableTokens: objectDefinition.variableTokens, parameters: parameters };
		if ( !info.variant.codeInline || this.debugger || this.section.onError || info.variant.waiting || objectDefinition.type == 'procedure' || objectDefinition.type == 'method' )
			this.nextBlock1( true )
	}
};

Information.prototype.parseSyntax2 = function( anchor, options )
{
	var definition = anchor.definition;
	var syntaxParameters = definition.syntax;
	var variableTokens = anchor.variableTokens;
	options = typeof options == 'undefined' ? {} : options;

	var results = [];
	var constants = [];
	if ( options.addIndex )
	{
		syntaxParameters = UTILITIES.copyObject( syntaxParameters );
		syntaxParameters.splice( 0, 0, 
		{
			type: '?',
			name: 'index',
			token: 'Index',
			value: undefined
		} );
	}	
	var results = [];
	for ( var r = 0; r < syntaxParameters.length; r++ )
	{
		if ( syntaxParameters[ r ].value != '(array)' )
			results.push( undefMark );
		else
			results.push( [] );
	}

	// Gather the parameters
	var flags = typeof options.flags == 'undefined' ? 0 : options.flags;
	var param = 0;
	this.waitingFunctionCount = 0;
	this.peekNextWord();
	this.parameterPositions = [];
	if ( !this.peekEndOfInstruction )
	{
		if ( definition.type == 'procedure' )
		{
			if ( this.text == '[' )
			{
				flags |= EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONSQUAREBRACKET;
				this.setNextWord();
			}
		}
		else
		{
			flags |= EXPFLAG_HANDLENEWSYNTAX | EXPFLAG_ENDONCOLON | EXPFLAG_ENDONCOMMA | EXPFLAG_ENDONTO | EXPFLAG_ENDONSEMICOLON;
		}
	}
	var startCode = [];
	var endCode = [];
	var varptr = [];

	var todo = ( flags != 0 );
	this.peekNextWord();
	if ( definition.type == 'procedure' )
	{
		if ( this.text == ']' )
		{
			this.setNextWord();
			todo = false;
		}
	}
	else
	{
		if ( this.text == ')' )
		{
			this.setNextWord();
			todo = false;
		}
	}
	if ( todo && results.length )
	{

		if ( todo )
		{
			while ( true )
			{
				var paramFound;
				var start = this.position;
				var exp = this.compileExpression( flags );
				if ( !options.addIndex )
					paramFound = anchor.positions[ param ];
				else
					paramFound = ( param == 0 ? 0 : anchor.positions[ param - 1 ] + 1 );
				startCode[ paramFound ] = start;
				endCode[ paramFound ] = this.position;
				varptr[ paramFound ] = this.variableDefinition;
				//if ( UTILITIES.isArray( results[ paramFound ] ) )
				//	results[ paramFound ].push( exp.code );
				//else
				results[ paramFound ] = exp.code;
				constants[ paramFound ] = exp.constant;
				if ( this.debugger )
				{
					var o = this.findLineAndColumn( start );
					var oo = this.findLineAndColumn( this.position );
					var paramInfo =
					{
						data: 
						{
							start: o.column, 
							end: oo.column
						},
						code: exp.code
					};
					if ( syntaxParameters[ paramFound ].newSyntax )
					{
						paramInfo.data.type = syntaxParameters[ paramFound ].type;
						paramInfo.data.name = syntaxParameters[ paramFound ].nameReal;
						paramInfo.data.defaultValue = syntaxParameters[ paramFound ].value;
						paramInfo.data.class =  syntaxParameters[ paramFound ].class;
					}
					else
					{
						paramInfo.data.type = syntaxParameters[ paramFound ].type;
						paramInfo.data.name = 'parameter ' + ( paramFound + 1 );
					}
					this.parameterPositions.push( paramInfo );
				}
				this.peekNextWord();
				if ( definition.type == 'procedure' && this.text == ']' )
				{
					this.setNextWord();
					break;
				}
				if ( definition.type == 'method' && this.text == ')' )
				{
					this.setNextWord();
					break;
				}
				if ( this.peekEndOfInstruction || this.peekEndOfLine )
					break;
				this.setNextWord();
				param++;
			};
		}
	}
	var defaults = [];
	for ( var r = 0; r < results.length; r++ )
	{
		var result = syntaxParameters[ r ].value;
		/*if ( result == '(varptr)' )
		{
			var variable = varptr[ r ];			
			var code = '{';
			if ( ( variable.global || variable.shared ) && this.section.type != 'main' )
				code += 'root:true,';
			code += 'name:"' + variable.tokenCode + '"';
			if ( variable.isArray )
			{
				var start = results[ r ].indexOf( '[' );
				var end = results[ r ].lastIndexOf( ']' );
				code += ',dimensions:' + results[ r ].substring( start, end + 1 );				
			}
			results[ r ] = code + '}';
			defaults[ r ] = false;
		}
		else 
		*/
		if ( result == '(any)' )
		{
			if ( results[ r ] == undefMark )
			{
				results[ r ] = 'undefined';
				defaults[ r ] = true;
			}
		}
		else if ( results[ r ] == undefMark )
		{
			if ( typeof result != 'undefined' )
			{				
				if ( result == '(expcode)' )
				{
					results[ r - 1 ] = 'function(aoz,vars){return ' + results[ r - 1 ] + ';}';
					results[ r ] = '"' + BTOA( this.extractSource( startCode[ r - 1 ], endCode[ r - 1 ] ) ) + '"';
					defaults[ r ] = false;
				}
				else if ( result != '(index)' && result != '(object)' && result != '(varptr)' )
				{
					results[ r ] = result;
					defaults[ r ] = true;
				}
				else
				{
					results[ r ] = 'undefined';
					defaults[ r ] = true;
				}
			}			
			else
			{
				results[ r ] = 'undefined';
				defaults[ r ] = true;
			}
		}
	}
	this.addSourceReference();

	var argEnd = '';
	var code = typeof options.code == 'undefined' ? '' : options.code;
	if ( options.methodParent )
	{
		code += 'return{type:17,parent:' + options.methodParent + ',method:"' + definition.name +'",result:0,args:{';
	}
	else if ( definition.type == 'class' || ( !definition.codeInline && !definition.methodInLine ) )
	{
		if ( definition.type == 'procedure' )
			code += 'return{type:4,procedure:"' + definition.name + '",args:{';
		else if ( definition.type == 'method' )
		{
			code += 'return{type:17,method:"' + definition.name + '",';
			if ( options.methodCall )
			{	
				var name = 'instance:' + ( options.noQuotesOnName ? '' : '"' );
				name += ( options.isSuper ? '"super"' : options.name );
				name += options.noQuotesOnName ? '' : '"';
				code += name + ',class:"' + options.class + '",';
			}
			code += 'args:{';
		}
		else
		{
			code += 'return{type:10,instruction:"' + definition.name + '",';
			if ( options.objectCall )
			{
				code += 'instance:' + ( options.noQuotesOnName ? '' : '"' ) + options.name + ( options.noQuotesOnName ? '' : '"' ) + ',';
				/*code += 'extends:[';
				for ( var e = 0; e < definition.extendsList.length; e++ )
					code += '"' + definition.extendsList[ e ] + ( e < definition.extendsList.length - 1 ? '",': '"' );
				code += '],';
				*/
			}
			code += 'args:{';
		}
	}	
		if ( code != '' )
	{
		if ( options.methodParent )
			code += this.getArgumentsCode( syntaxParameters, results, defaults ) + argEnd + '}}';
		else
			code += this.getArgumentsCode( syntaxParameters, results, defaults ) + argEnd + '}}';
		if ( options.codeEnd )
			code += options.codeEnd;
		code += ';';
		definition.inUse = true;
		this.addLine( code );
	}
	else
	{
		// Compute parameters and arrays
		var newResults = [];
		for ( var p = 0; p < results.length; p++ )
		{
			var code = '';
			if ( !UTILITIES.isArray( results[ p ] ) )
				newResults[ p ] = results[ p ];
			else
			{
				newResults[ p ] = '[';
				for ( var r = 0; r < results[ p ].length; r++ )
				{
					newResults[ p ] += results[ p ][ r ];
					if ( r < results[ p ].length - 1 )
						newResults[ p ] += ',';
				}
				newResults[ p ] += ']';
			}
		}
	
		// Insert parameters in inline code...
		if ( definition.methodInLine )
		{
			var args = this.getArgumentsCode( syntaxParameters, results, defaults );
			var name = options.name;
			if ( options.nameIsObject )
				name += '.name';

			if ( this.section.type == 'procedure' )
				this.addLine( 'this.aoz.root.objects[' + name + ']["' + definition.name + '_m"].blocks[ 0 ].call(this.aoz.root.objects[' + name + '],aoz,{' + args  + '});' );
			else
				this.addLine( 'this.objects[' + name + ']["' + definition.name + '_m"].blocks[ 0 ].call(this.objects[' + name + '],aoz,{' + args  + '});' );
			this.unIndent();
		}
		else
		{
			this.unIndent();
			for ( var l = 0; l < definition.codeInline.length; l++ )
			{
				var text = this.setParameters( syntaxParameters, definition.codeInline[ l ], newResults );
				if ( variableTokens && this.variableTokenNames )
				{
					for ( var ll = 0; ll < variableTokens.length; ll++ )
					{
						if ( ll < this.variableTokenNames.length )
							text = UTILITIES.replaceParameter( text, '%' + variableTokens[ ll ], '"' + this.variableTokenNames[ ll ] + '"' );
						else
							text = UTILITIES.replaceParameter( text, '%' + variableTokens[ ll ], '""' );
					}	
				}
				this.addLine( text );
			}
		}
		this.indent();
		definition.inUse = true;
	}
	if ( definition.waiting || !definition.codeInline || this.debugger || this.section.onError || definition.type == 'procedure' || definition.type == 'method' )
		this.nextBlock2( true )

	// Add the tags
	if ( definition.tags && definition.tags[ 'addToFilesystem' ] )
	{
		for ( var file in definition.tags[ 'addToFilesystem' ] )
		{
			var OK = true;
			var token = file;
			var asset = '';
			var colon = token.indexOf( ':' );
			if ( colon > 0 )
			{
				var drive = token.substring( 0, colon + 1 );
				token = token.substring( colon + 1 );
				asset = drive;
			}
			if ( token.charAt( 0 ) == '%' )
			{
				OK = false;
				token = token.substring( 1 );
				for ( var ss = 0; ss < syntaxParameters.length; ss++ )
				{
					if ( syntaxParameters[ ss ].name == token )
					{
						if ( constants[ ss ] )
						{
							if ( results[ ss ] == undefMark )
								this.throwError( { error: 'tag_parameter_not_defined' } );
							else
							{
								if ( isNaN( results[ ss ] ) )
								{
									file = results[ ss ].substring( 1 );
									file = asset + results[ ss ].substring( 1 );
									file = file.substring( 0, file.length - 1 );
									OK = true;
								}
							}
						}
						break;
					}
				}
			}
			if ( OK )
			{
				var self = this;
				FILESYSTEM.addToFilesystem( file, this.options, function( response, data, extra )
				{
					if ( !response )
					{						
						for ( var d = 0; d < data.length; d++ )
						{
							var error = data[ d ];
							error.error == 'transpilation_cancelled'
							self.throwError( error, true );
						}
					}
				} );
			}
		}
	}
};
Information.prototype.getSourceText = function( accepted, refused, options )
{
	var text = '';
	var lastText = '';
	var count = 0;
	options = typeof options == 'undefined' ? {} : options;
	while ( this.position < this.lineEnd )
	{
		var c = this.charAt( this.position );
		var t = UTILITIES.getCharacterType( c );
		if ( count == 0 && options.notAtFirst )
		{
			for ( var a = 0; a < options.notAtFirst.length; a++ )
			{
				if ( c == options.notAtFirst[ a ] || t == options.notAtFirst[ a ] )
				{
					return text;
				}
			}
		}
		if ( options.skipOpen )
		{
			var openBracket, closeBracket;
			var quit  = false;
			for ( openBracket = 0; openBracket < options.skipOpen.length && !quit; openBracket++ )
			{
				if ( c == options.skipOpen[ openBracket ] )
				{
					var bracketCount = 1;
					closeBracket = options.skipClose[ openBracket ];
					openBracket = c;
					text += c;
					this.position++;
					while ( this.position < this.lineEnd )
					{
						c = this.charAt( this.position++ );
						text += c;
						if ( c == closeBracket )
						{
							bracketCount--;
							if ( bracketCount == 0 )
							{
								quit = true;
								break;
							}
						}
						if ( c == openBracket )
						{
							bracketCount++;
						}
					}
					if ( c != closeBracket )
						throw 'string_not_closed';
					continue;
				}
			}
			if ( quit )
				continue;
		}
		lastText += c;
		if ( lastText.length > 3 )
			lastText = lastText.substring( lastText.length - 3 );
		if ( lastText.length == 3 )
		{
			for ( a = 0; a < refused.length; a++ )
			{
				if ( lastText.toLowerCase() == refused[ a ] )
				{
					this.position -= 2;
					return text.substring( 0, text.length - 2 );
				}
			}
		}
		for ( a = 0; a < refused.length; a++ )
		{
			if ( c == refused[ a ] || t == refused[ a ] )
				return text;
			}
		var rejected = true;
		for ( a = 0; a < accepted.length; a++ )
		{
			if ( accepted[ a ] == 'any' || c == accepted[ a ] || t == accepted[ a ] )
			{
				rejected = false;
				text += c;
				break;
			}
		}
		if ( rejected )
			break;
		if ( a >= accepted.length )
			return text;
		this.position++;
		count++;
	}
	return text;
}


Information.prototype.getJavascript = function( options )
{
	var startPosition = this.position;
	var result = [];
	var javascript = 1;
	var code;
	var headerDone = false;
	this.functionToCall = null;
	this.waiting = false;
	var tab = 0;
	var tabStart = typeof options.tab != 'undefined' ? options.tab : 0;
	var bracketStart = UTILITIES.getSkipSpacePosition( UTILITIES.printLine( this.getCurrentLine() ), 0 );

	this.notImplemented = false;
	var plusTab = 1;
	while ( javascript && !this.endOfText )
	{
		code = '';
		this.skipSpaces();
		while ( javascript )
		{
			if ( typeof options.tab != 'undefined' && this.currentLine > this.indentation.length )
			{
				this.indentation.push( tab + tabStart );
				tab += plusTab;
				for ( var l = this.indentation.length + 1; l < this.currentLine; l++ )
					this.indentation.push( tab + tabStart );
				plusTab = 0;
			}

			this.extractNextWord( 'javascript' );
			if ( this.endOfLine )
				break;
			if ( this.type == 'remark' )
			{
				this.skipRemark();
				continue;
			}
			if ( this.type == 'tag' )
			{
				if ( this.getTag( options.tags, options.tab ) )
					continue;
				this.text = '#';
			}
			if ( this.text == '{' )
				javascript++;
			else if ( this.text == '}' )
				javascript--;
			if ( javascript > 0 )
				code += this.text;
		}
		if ( code != '' )
		{
			if ( !options.noHeader && !headerDone )
			{
				result.push( '\t// Javascript' );
				headerDone = true;
			}
			var pad = '';
			var spaces = UTILITIES.getSkipSpacePosition( UTILITIES.printLine( this.getCurrentLine() ), 0 ) - bracketStart;
			var nTabs = Math.floor( Math.max( spaces, 0 ) / this.options.tabWidth );
			var nSpaces = spaces - nTabs * this.options.tabWidth;
			for ( var s = 0; s < nTabs; s++ )
				pad += '\t';
			for ( var s = 0; s < nSpaces; s++ )
				pad += ' ';
			result.push( pad + code );
			tab = nTabs;
		}
		if ( javascript )
			this.nextLine( typeof options.tab != 'undefined' ? tab : undefined );
	}
	if ( headerDone )
		result.push( '\t// End Javascript' );
	if ( this.endOfText || javascript > 0 )
	{
		this.setPosition( startPosition );
		this.throwError( { error: 'javascript_section_not_closed' }, true );
	}
	return result;
};

Information.prototype.getTag = function( tags, tab )
{
	var self = this;
	var c = this.peekNextChar();
	if ( this.getCharacterType( c ) != 'letter' )
		return false;
	this.peekNextWord( 'tagname' );
	switch ( this.textLower )
	{
		// Preprocessor...
		// ------------------------------------------------------------------
		case 'if':
			this.setNextWord();
			this.insideTagCount++;
			this.extractNextWord( 'tagvariable');
			var name = this.text;
			var operator, operand;
			this.extractNextChar();
			if ( !( this.endOfLine || this.endOfText || this.type == 'remark' ) )
			{
				if ( this.text != '=' )
					this.throwError( { error: 'syntax_error' } );
				operator = true;
				this.extractNextWord( 'tagparameter' );
				if ( this.endOfLine || this.endOfText || this.type == 'remark' )
					this.throwError( { error: 'syntax_error' } );
				operand = this.result;
			}
			var result = false;
			var variable = this.options.preprocVariables[ name ];
			if ( variable )
			{
				result = true;
				if ( operator && variable.value != operand )
					result = false;
			}
			if ( !result )
			{
				skipCode( false, tab );
				if ( this.textLower != 'else' )
					this.insideTagCount--;
			}
			break;
		case 'ifdef':
			this.setNextWord();
			this.insideTagCount++;
			this.extractNextWord( 'tagvariable' );
			if ( typeof this.options.preprocVariables[ this.text ] == 'undefined' )
			{
				skipCode( false, tab );
				if ( this.textLower != 'else' )
					this.insideTagCount--;
			}
			break;
		case 'ifndef':
			this.setNextWord();
			this.insideTagCount++;
			this.extractNextWord( 'tagvariable' );
			if ( typeof this.options.preprocVariables[ this.text ] != 'undefined' )
			{
				skipCode( false, tab );
				if ( this.textLower != 'else' )
					this.insideTagCount--;
			}
			break;
		case 'else':
			this.setNextWord();
			// Must be inside a tag
			if ( this.insideTagCount == 0 )
			{
				this.pushError( 'syntax_error' );
				return;
			}
			skipCode( true, tab );
			this.insideTagCount--;
			break;
		case 'endif':
			this.setNextWord();
			// Must be inside a tag
			if ( this.insideTagCount == 0 )
			{
				this.pushError( 'syntax_error' );
				return;
			}
			this.insideTagCount--;
			break;
		case 'let':
			this.setNextWord();
			this.extractNextWord( 'tagvariable' );
			var name = this.text;
			this.extractNextChar();
			if ( this.text != '=' || this.endOfLine || this.endOfText || this.type == 'remark'  )
				this.throwError( { error: 'syntax_error' } );
			this.extractNextWord( 'tagparameter' );
			if ( this.endOfLine || this.endOfText || this.type == 'remark' )
				this.throwError( { error: 'syntax_error' } );
			var variable = this.options.preprocVariables[ name ];
			if ( !variable )
			{
				variable = { value: 0 };
				this.options.preprocVariables[ name ] = variable;
			}
			variable.value = this.result;
			break;


		// Other tags
		// ---------------------------------------------------------
		case 'debug':
			this.setNextWord();
			this.tagErrors = true;
			break;
		case 'errors':
			this.setNextWord();
			this.tagErrors = true;
			break;
		case 'notimplemented':
			this.setNextWord();
			this.warning( 'instruction_not_implemented' );
			break;
		case 'returns':
			this.setNextWord();
			this.tagReturns = getParameter( 'string' );
			break;
		case 'nodefaults':
			this.setNextWord();
			this.noDefaults = true;
			break;
		case 'waiting':
			this.setNextWord();
			this.waiting = true;
			break;
		case 'nobank':
			this.setNextWord();
			this.options.noBanks[ getParameter( 'string' ) ] = true;
			break;
		case 'need_module':
			this.setNextWord();
			this.needModules[ getParameter( 'string' ) ] = true;
			break;
		case 'need_extension':
			this.setNextWord();
			this.needExtensions[ getParameter( 'string' ) ] = true;
			break;
		case 'include_javascript':
			this.setNextWord();
			this.options.addOnPaths[ getParameter( 'string' ) ] = true;
			break;
		case 'include_javascript_folder':
			this.setNextWord();
			this.options.addOnFolders[ getParameter( 'string' ) ] = true;
			break;
		case 'need_css_file':
		case 'need_file':
		case 'need_javascript_file':
			this.setNextWord();
			this.options.needFiles[ getParameter( 'string' ) ] = true;
			break;
		case 'loadassetfile':
			this.setNextWord();
			this.options.loadFilesAfter[ getParameter( 'string' ) ] = true;
			break;
		case 'friendclass':
			this.setNextWord();
			this.section.friendClasses[ getParameter( 'string' ) ] = true;
			break;
		case 'novariableinit':
			this.setNextWord();
			tags.noVariableInit = getParameter( 'boolean' );
			break;
		case 'class':
			this.setNextWord();
			this.className = getParameter( 'string' );
			this.section.className = this.className;
			break;
		case 'need_server':
			this.setNextWord();
			this.options.needServer = true;
			break;
		case 'addtofilesystem':
			this.setNextWord();
			if ( tags )
			{
				if ( !tags.addToFilesystem )
					tags.addToFilesystem = {};
				tags.addToFilesystem[ getParameter( 'string' ) ] = true;
			}
			break;
		default:
			return false;
	}
	return true;

	function getParameter( type )
	{
		self.extractNextChar();
		if ( self.type != 'column' )
			self.throwError( { error: 'syntax_error' } );
		self.extractNextWord( 'tagparameter' );
		if ( self.type == 'number' && type == 'number' )
		{
			var value = parseInt( self.text );
			if ( !IsNan( value ) )
			return value;
		}
		else if ( self.type == 'string' && type == 'string' )
		{
		return self.text;
		}
		else if ( self.type == 'boolean' && type == 'boolean' )
		{
			return ( self.text.toLowerCase() == 'true' );
		}
		self.throwError( { error: 'syntax_error' } );
	}
	// Skip the code until #else or #endif
	function skipCode( checkElse, tab )
	{
		var count = 1;
		while ( count )
		{
			self.extractNextWord( 'javascript' );
			if ( self.endOfText )
			{
				self.pushError( 'tag_not_closed' );
				return;
			}
			else if ( self.endOfLine )
				self.nextLine( tab );
			else if ( self.remark )
				self.skipRemark( tab );
			else if ( self.type == 'tag' )
			{
				self.extractNextWord( 'tagname' );
				switch ( self.text )
				{
					case 'if':
					case 'ifdef':
					case 'ifndef':
						count++;
						break;
					case 'else':
						if ( checkElse && count == 1 )
						{
							self.pushError( 'tag_not_closed' );
							return;
						}
					case 'endif':
					case 'end if':
						count--;
						break;
					default:
						break;
				}
			}
		}
	}
};
