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
 * The compiler
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 03/12/2018
 */

var fs = require( 'fs' );
var LOADASH = require( 'lodash' );
var PATH = require("path");
var BTOA = require( 'btoa' );
var utilities = require( './utilities' );
var filesystem = require( './filesystem' );
var tokens = require( './tokens' );
var messages = require( './messages' );
var INFO = require( './information' );
const { FSWatcher } = require('chokidar');

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
}

module.exports.init = function( info, options )
{
	return true;
};
module.exports.compile = function( info, options )
{
	options.information = info;
	info.break = false;
	options.main = true;
	options.resourcesSubpath = '';
	var code = '';

	// Load the library code
	var libraryPath = options.runtimePath + '/code.jstemplate';
	var library = options.fileLoader_run.getFile( libraryPath );

	// Header
	var header = utilities.extractCode( library, 'HEADER' );
	header = utilities.replaceStringInText( header, '%APPLICATIONNAME%', options.manifest.infos.applicationName );
	header = utilities.replaceStringInText( header, '%AUTHORNAME%', options.manifest.infos.author );
	header = utilities.replaceStringInText( header, '%VERSIONNUMBER%', options.manifest.infos.version );
	header = utilities.replaceStringInText( header, '%DATE%', options.manifest.infos.date );
	header = utilities.replaceStringInText( header, '%COPYRIGHT%', options.manifest.infos.copyright );
	header = utilities.replaceStringInText( header, 'DEVELOPPERMODE', options.developperMode );
	header = utilities.replaceStringInText( header, 'GOTODIRECTMODE', options.gotoDirectMode );
	var infos = messages.getMessage( 'compiled_with', [ options.version, utilities.getFormattedDate() ] );
	header = utilities.replaceStringInText( header, '%COMPILERINFOS%', infos );
	var newManifest = utilities.copyObject( options.manifest );
	newManifest.errors = {};
	header = utilities.replaceStringInText( header, 'SOURCELIST', BTOA( info.getSourceListJson() ) );
	code += header;

	// Compile base code
	zeroPass( info, options, options.caseSensitive );
	if ( messages.isErrors() )
		throw {};

	// First pass
	firstPass( undefined, undefined, info.rootSection, info, options, options.caseSensitive );
	if ( messages.isErrors() )
		throw {};

	// Second pass
	options.tabs = '\t\t';
	secondPass( undefined, undefined, info.rootSection, info, options, options.caseSensitive );
	if ( messages.isErrors() )
		throw {};

	// Compute the sub-elements
	var section = info.section;
	compileSection( info, section.procedures, options, options.caseSensitive );
	compileSection( info, section.instructions, options, options.caseSensitive );
	compileSection( info, section.functions, options, options.caseSensitive );
	compileSection( info, section.objects, options, options.caseSensitive );
	if ( messages.isErrors() )
		throw {};

	// Initialisation of the root variables
	// By default ALL variavbles at the root are initialized.
	var section = info.rootSection;
	var codeGlobals = '';
	for ( var v in section.variables )
	{
		var variable = section.variables[ v ];
		code += '\t' + variable.codeInit + ';\n';
		if ( variable.global )
		{
			var saveSection = info.section;
			info.section = section;
			info.variableInfo = variable;
			var vInfo = info.getVariable( false, INFO.GETVARIABLEFLAG_NOCODE );
			vInfo = utilities.copyObject( vInfo );
			vInfo.variable.classDefinition = null;
			vInfo.code = vInfo.variable.code;
			vInfo.variable.codeInit = '';
			switch ( vInfo.variable.type )
			{
				case '0':
					vInfo.variable.type = 'integer';
					break;
				case '1':				
					vInfo.variable.type = 'float';
					break;
				case '2':				
					vInfo.variable.type = 'string';
					break;
				case '3':				
					vInfo.variable.type = 'class';
					break;
			}
			codeGlobals += '\t\t' + variable.token + ":this.aoz.varPtr('" + JSON.stringify( vInfo ) + "'),\n";
			info.section = saveSection;
		}
	}
	if ( codeGlobals )
	{
		code += '\tthis.infoGlobals=\n\t{\t\n' + codeGlobals + '\t};\n';
	}

	// Create the block of code
	code += '\tthis.blocks=[];\n';
	code += createCodeBlocks( info, section, '\t' );
	if ( info.debugger )
	{
		// Insert cleaned definition
		var def =
		{
			type: 'main',
			main: true,
			nameReal: 'Application',
			//labels: section.labels,
			//tags: section.tags,
			//procedures:section.procedures,
			//instructions: section.,
			//functions:{},
			//methods:{},
			//objects:{},
			//syntaxes: [],
			//friendClasses: section.friendClasses,
			//defFunctions: {},
			//className: section.className
		};
		def = JSON.stringify( def );
		code += '\tthis.debuggerInfo=function(command)\n';
		code += '\t{\n';
		code += '\t\tif (command=="info")\n';
		code += "\t\t\treturn '" + def + "';\n";
		code += '\t};\n';
	

		code += '\tthis.debuggerBlocks=[];\n';
		code += createDebuggerCodeBlocks( info, section, '\t' );	
	}

	// Insert the data
	code += insertDatas( section );

	// Insert the labels
	code += insertLabels( section, '', info.caseSensitive );

	// Mark modules and extensions to load
	do
	{
		var done = false;
		for ( var m in options.modules )
		{
			var module = options.modules[ m ];
			module.inUse |= module.forceInclude;
			if ( module.inUse )
			{
				for ( var moduleNeeded in module.needModules )
				{
					for ( var moduleChecked in options.modules )
					{
						var moduleToFind = '_' + moduleNeeded.toLowerCase();
						var moduleToCheck = moduleChecked.toLowerCase();
						var pos = moduleToCheck.indexOf( moduleToFind );
						if ( pos >= 0 && pos == moduleToCheck.length - moduleToFind.length )
						{
							if ( !options.modules[ moduleChecked ].inUse )
							{
								options.modules[ moduleChecked ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
				for ( var extensionNeeded in module.needExtensions )
				{
					for ( var extensionChecked in options.extensions )
					{
						var extensionToFind = '_' + extensionNeeded.toLowerCase();
						var extensionToCheck = extensionChecked.toLowerCase();
						var pos = extensionToCheck.indexOf( extensionToFind );
						if ( pos >= 0 && pos == extensionToCheck.length - extensionToFind.length )
						{
							if ( !options.extensions[ extensionChecked ].inUse )
							{
								options.extensions[ extensionChecked ].inUse = true;
								done = true;
							}
						}
					}
				}
			}
		}
		for ( var e in options.extensions )
		{
			var extension = options.extensions[ e ];
			extension.inUse |= extension.forceInclude;
			if ( extension.inUse )
			{
				for ( var moduleNeeded in extension.needModules )
				{
					for ( var moduleChecked in options.modules )
					{
						var moduleToFind = '_' + moduleNeeded.toLowerCase();
						var moduleToCheck = moduleChecked.toLowerCase();
						var pos = moduleToCheck.indexOf( moduleToFind );
						if ( pos >= 0 && pos == moduleToCheck.length - moduleToFind.length )
						{
							if ( !options.modules[ moduleChecked ].inUse )
							{
								options.modules[ moduleChecked ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
				for ( var extensionNeeded in extension.needExtensions )
				{
					for ( var extensionChecked in options.extensions )
					{
						var extensionToFind = '_' + extensionNeeded.toLowerCase();
						var extensionToCheck = extensionChecked.toLowerCase();
						var pos = extensionToCheck.indexOf( extensionToFind );
						if ( pos >= 0 && pos == extensionToCheck.length - extensionToFind.length )
						{
							if ( !options.extensions[ extensionToCheck ].inUse )
							{
								options.extensions[ extensionToCheck ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
			}
		}
	} while( done );

	// Creation of all the sections
	code += getCreateSectionCode2( info, section.procedures, options );
	code += getCreateSectionCode2( info, section.instructions, options );
	code += getCreateSectionCode2( info, section.functions, options );
	code += getCreateSectionCode2( info, section.objects, options );

		// Debugger?
	if ( info.debugger )
	{
		code += "\tthis.aoz.debugger=true;\n";
	}
	
	// Initialize all modules
	code += '\tthis.aoz.run(this,0,args);\n';
	options.noDebugger = true;
	for ( var e in options.modules )
	{
		var module = options.modules[ e ];
		if ( module.inUse && module.objectSourcePath.length > 0 )
		{
			code += getCreateSectionCode2( info, module.objects, options );
			code += '\tthis.aoz.' + module.name + '=new ' + module.name + '(this.aoz,args);\n';
		}
	}
	// Initialize all extensions
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse && extension.objectSourcePath.length > 0 )
		{
			code += getCreateSectionCode2( info, extension.objects, options );
			code += '\tthis.aoz.' + extension.name + '=new ' + extension.name + '(this.aoz,args);\n';
		}
	}
	options.noDebugger = false;
	
	// Add source code
	if ( options.sendCrashReport )
	{
		code += "\n\
	this.aoz.crashInfo=\n\
	{\n\
		transpilerVersion:'" + options.version + "',\n\
		applicationName:'" + options.sourcePath + "',\n\
		manifest:'" + JSON.stringify( options.manifest ) + "',\n\
		code:'" + BTOA( source ) + "',\n\
		systemInformation:'" + BTOA(JSON.stringify( options.systemInformation )) + "'\n\
	};\n"
	}

	// End code
	var exit = utilities.extractCode( library, 'FOOTER' );
	code += exit;

	code = code .strReplace( '@key@', '' + options.iAjOkZ );
	//code = utilities.replaceStringInText( code, '@iAjOkZ@', '' + options.iAjOkZ );

	// Finished without errors!
	info.code = code;
	return info;
};

module.exports.compileCommand = function( info, options )
{
	options.main = true;
	options.directMode = true;
	options.includeSource = false;
	options.addSourceReference = false;
	options.information = info;
	info.break = false;
	options.main = true;
	var code = '';

	// Mark all variables and things that have already been created
	var section = info.rootSection;
	for ( var v in section.variables )
		section.variables[ v ].preCompiled = true;
	section.blocks = [];
	
	// Mark modules already loaded
	for ( var m in options.modules )
	{
		var module = options.modules[ m ];
		module.alreadyUsed = module.inUse;
		for ( var c in module.objects )
		{
			if ( module.objects[ c ] )
			{
				module.objects[ c ].alreadyUsed = module.objects[ c ].inUse;
			}
		}
	}
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		extension.alreadyUsed = extension.inUse;
		for ( var c in extension.objects )
		{
			if ( extension.objects[ c ] )
			{
				extension.objects[ c ].alreadyUsed = extension.objects[ c ].inUse;
			}
		}
	}

	// Compile base code
	zeroPass( info, options, false );
	if ( messages.isErrors() )
		throw {};
	
	// First pass!
	firstPass( undefined, undefined, info.rootSection, info, options, false );
	if ( messages.isErrors() )
		throw {};

	// Second pass!
	options.tabs = '\t\t';
	secondPass( undefined, undefined, info.rootSection, info, options, false );
	if ( messages.isErrors() )
		throw {};

	// Create a new source to be inserted in the main one
	//////////////////////////////////////////////////////
	var code = 'Application.%$NAME = function(aoz,parent,args,startBlock)\n{\n';
	code += '\tthis.aoz=aoz;\n';
	code += '\tthis.root=this;\n';
	code += '\tthis.className="directCommand";\n';
	code += '\tthis.parent=parent;\n';
	code += '\tthis.vars = {};\n';
	//code += '\tdebugger;\n';
	code += '\t\n';
	
	// Initialisation of the root variables if new
	var section = info.rootSection;
	for ( var v in section.variables )
	{
		var variable = section.variables[ v ];
		if ( !variable.preCompiled )
		{
			code += '\t' + variable.codeInit + ';\n';
		}
	}

	// New chunks after the last one...
	code += '\tthis.blocks=[];\n';
	for ( var b = 0; b < section.blocks.length; b++ )
	{
		code += '\tthis.blocks[' + b + ']=function(aoz,vars)\n';
		code += '\t{\n';
		code += section.blocks[ b ];
		code += '\t};\n';
	}
	code += '\tthis.blocks[' + b + ']=function(aoz,vars)\n';
	code += '\t{\n';
	code += '\t\treturn{type:16}';
	code += '\t};\n';

	// Create the instructions
	//for ( var p in info.instructions )
	//{
	//	var instruction = info.instructions[ p ];
	//	for ( var v = 0; v < instruction.variants.length; v++ )
	//	{
	//		var variant = instruction.variants[ v ];
	//		if ( variant.inUse && !variant.codeInline )
	//			code += '\tthis.i' + instruction.name + '=new ' + instruction.name + '(this.aoz,this);\n';
	//	}
	//}

	// Create the functions
	//for ( var p in info.functions )
	//{
	//	var func = info.functions[ p ];
	//	for ( var v = 0; v < func.variants.length; v++ )
	//	{
	//		var variant = func.variants[ v ];
	//		if ( variant.inUse && !variant.codeInline )
	//			code += '\tthis.f' + func.name + '=new ' + func.name + '(this.aoz,this);\n';
	//	}
	//}

	// Insert the data
	//code += insertDatas( section );

	// Insert the labels
	//code += insertLabels( section, '', info.caseSensitive );

	// Mark modules and extensions to load
	var modulesLoaded = {};
	var extensionsLoaded = {};
	do
	{
		var done = false;
		for ( var m in options.modules )
		{
			var module = options.modules[ m ];
			if ( module.inUse && !module.alreadyUsed )
			{
				for ( var moduleNeeded in module.needModules )
				{
					for ( var moduleChecked in options.modules )
					{
						var moduleToFind = '_' + moduleNeeded.toLowerCase();
						var moduleToCheck = moduleChecked.toLowerCase();
						var pos = moduleToCheck.indexOf( moduleToFind );
						if ( pos >= 0 && pos == moduleToCheck.length - moduleToFind.length )
						{
							if ( !options.modules[ moduleChecked ].inUse )
							{
								options.modules[ moduleChecked ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
				for ( var extensionNeeded in module.needExtensions )
				{
					for ( var extensionChecked in options.extensions )
					{
						var extensionToFind = '_' + extensionNeeded.toLowerCase();
						var extensionToCheck = extensionChecked.toLowerCase();
						var pos = extensionToCheck.indexOf( extensionToFind );
						if ( pos >= 0 && pos == extensionToCheck.length - extensionToFind.length )
						{
							if ( !options.extensions[ extensionChecked ].inUse )
							{
								options.extensions[ extensionChecked ].inUse = true;
								done = true;
							}
						}
					}
				}
			}
			if ( module.inUse )
			{
				for ( var o in module.objects )
				{
					var klass = module.objects[ o ];
					if ( klass.inUse && !klass.alreadyUsed )
					{
						for ( var v = 0; v < klass.variants.length; v++ )
						{
							if ( !modulesLoaded[ klass.variants[ v ].name ] )
							{
								options.beforeFunction = 'aoz.root.';
								code += insertSection( info, klass.variants[ v ], '\t', options );
								modulesLoaded[ klass.variants[ v ].name ] = true;
							}
						}
					}
				}
			}
		}
		for ( var e in options.extensions )
		{
			var extension = options.extensions[ e ];
			if ( extension.inUse && !extension.alreadyUsed )
			{
				for ( var moduleNeeded in extension.needModules )
				{
					for ( var moduleChecked in options.modules )
					{
						var moduleToFind = '_' + moduleNeeded.toLowerCase();
						var moduleToCheck = moduleChecked.toLowerCase();
						var pos = moduleToCheck.indexOf( moduleToFind );
						if ( pos >= 0 && pos == moduleToCheck.length - moduleToFind.length )
						{
							if ( !options.modules[ moduleChecked ].inUse )
							{
								options.modules[ moduleChecked ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
				for ( var extensionNeeded in extension.needExtensions )
				{
					for ( var extensionChecked in options.extensions )
					{
						var extensionToFind = '_' + extensionNeeded.toLowerCase();
						var extensionToCheck = extensionChecked.toLowerCase();
						var pos = extensionToCheck.indexOf( extensionToFind );
						if ( pos >= 0 && pos == extensionToCheck.length - extensionToFind.length )
						{
							if ( !options.extensions[ extensionToCheck ].inUse )
							{
								options.extensions[ extensionToCheck ].inUse = true;
								done = true;
								break;
							}
						}
					}
				}
			}
			if ( extension.inUse )
			{
				for ( var o in extension.objects )
				{
					var klass = extension.objects[ o ];
					if ( klass.inUse && !klass.alreadyUsed )
					{
						for ( var v = 0; v < klass.variants.length; v++ )
						{
							if ( !extensionsLoaded[ klass.variants[ v ].name ] )
							{
								options.beforeFunction = 'aoz.root.';
								code += insertSection( info, klass.variants[ v ], '\t', options );
								extensionsLoaded[ klass.variants[ v ].name ] = true;
							}
						}
					}
				}
			}
		}
	} while( done );

	// Initialize all modules
	function getBank( bank, number, domain )
	{
		//if ( bank.type == 'samples' && domain == 'application' )
		//{
		//	if ( !isInUse( 'sounds' ) )
		//		return "";
		//}
		switch ( bank.type )
		{
			case 'images':
			case 'icons':
				return "\tthis.aoz.banks.banks[ " + number + " ][ '" + domain + "' ] = new ImageBank( this.aoz, [" + bank.code + "], [" + bank.types + "], [ " + bank.palette + " ], { hotSpots: [" + bank.hotSpots + "], alpha: " + bank.alpha + ", domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
			case 'samples':
				return "\tthis.aoz.banks.banks[ " + number + " ][ '" + domain + "' ] = new SampleBank( this.aoz, [" + bank.code + "], [" + bank.types + "], { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
			case '3D':
				return "\tthis.aoz.banks.banks[ " + number + " ][ '" + domain + "' ] = new TDBank( this.aoz, [" + bank.code + "], [" + bank.types + "], { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
			default:
				return "\tthis.aoz.banks.banks[ " + number + " ][ '" + domain + "' ] = new DataBank( this.aoz, [" + bank.code + "], 0, { domain: '" + bank.type + "', type: '" + bank.type + "', path: '" + bank.path + "' } );\n";
		}
	}

	var plusCode = '';
	var toRun = [];
	var toLoad = [];
	var filesCode = undefined;
	for ( var m in options.modules )
	{
		var module = options.modules[ m ];
		if ( module.inUse && !module.alreadyUsed )
		{
			var file = utilities.loadFileIfExists( PATH.resolve( options.currentPath + '/' + module.objPath + '/run/object.js' ), { encoding: 'utf8' } );
			if ( file )
			{
				plusCode += file + '\n\n\n';
				toRun.push( module.name );
			}
			
			for ( var file in module.needFiles )
			{
				if ( module.needFiles[ file ] )
				{
					if ( !filesCode )
						filesCode = '[';
					var path = utilities.getDirectoryFromPath( file );
					if ( path.length )
					{
						if ( path.toLowerCase().indexOf( 'http://' ) < 0 && path.toLowerCase().indexOf( 'https://' ) < 0 )
						{
							filesCode += '"run/' + file + '",';
							options.fileSaver.createDirectories( options.destinationPath + '/run/' + path )
							options.fileSaver.copyFile( options.destinationPath + '/run/' + file, options.runtimePath + '/' + file, { fileLoader: options.fileLoader_runtime } );
						}
						else
						{
							filesCode += '"' + file + '",';
						}
					}
				}
			}

			// Add resources
			for ( var b in module.banks )
			{
				var bank = module.banks[ b ];
				code += getBank( bank, b, m );
				if ( bank.copyList && bank.copyList.length > 0 )
				{
					var destPath = options.objPath + '/resources/' + bank.path;
					for ( var i = 0; i < bank.copyList.length; i++ )
					{
						var filename = utilities.getFilenameAndExtension( bank.copyList[ i ].destination );
						bank.copyList[ i ].destination = destPath + '/' + filename;
					}
					options.fileSaver.equateFolderToList( destPath, bank.copyList, { unlock: true, recursive: false } );
				}			
			}
		}
	}
	// Initialize all extensions
	for ( var e in options.extensions )
	{
		var extension = options.extensions[ e ];
		if ( extension.inUse && !extension.alreadyUsed )
		{
			var file = utilities.loadFileIfExists( PATH.resolve( options.currentPath + '/' + extension.objPath + '/run/object.js' ), { encoding: 'utf8' } );
			if ( file )
			{
				toRun.push( extension.name );
				plusCode += file + '\n\n\n';
			}

			for ( var file in extension.needFiles )
			{
				if ( extension.needFiles[ file ] )
				{
					if ( !filesCode )
						filesCode = '[';
					var path = utilities.getDirectoryFromPath( file );
					if ( path.length )
					{
						if ( path.toLowerCase().indexOf( 'http://' ) < 0 && path.toLowerCase().indexOf( 'https://' ) < 0 )
						{
							filesCode += '"run/' + file + '",';
							options.fileSaver.createDirectories( options.destinationPath + '/run/' + path )
							options.fileSaver.copyFile( options.destinationPath + '/run/' + file, options.runtimePath + '/' + file, { fileLoader: options.fileLoader_runtime } );
						}
						else
						{
							filesCode += '"' + file + '",';
						}
					}
				}
			}

			// Add resources
			for ( var b in extension.banks )
			{
				var bank = extension.banks[ b ];
				code += getBank( bank, b, e );
				if ( bank.copyList && bank.copyList.length > 0 )
				{
					var destPath = options.objPath + '/resources/' + bank.path;
					for ( var i = 0; i < bank.copyList.length; i++ )
					{
						var filename = utilities.getFilenameAndExtension( bank.copyList[ i ].destination );
						bank.copyList[ i ].destination = destPath + '/' + filename;
					}
					options.fileSaver.equateFolderToList( destPath, bank.copyList, { unlock: true, recursive: false } );
				}			
			}			
		}
	}
	code = plusCode + code;
	if ( !filesCode )
	{
		for ( var r = 0; r < toRun.length; r++ )
			code +=  '\tthis.aoz.' + toRun[ r ] + '=new ' + toRun[ r ] + '(this.aoz,this);\n';
		code += '\tthis.aoz.tasks[ this.aoz.tasks.length - 1 ].paused = false;\n'
	}
	else
	{
		filesCode = filesCode.substring( 0, filesCode.length - 1 ) + ']';	// Get rid of last comma
		code += '\tvar self=this;\n';
		code += '\tthis.aoz.loadJavascript(' + filesCode + ',{},function(response,data,extra)\n';
		code += '\t{\n';
		code += '\t\tif (response)\n';
		code += '\t\t{\n';
		code += '\t\t\tvar previousTask = self.aoz.currentTask;\n';
		code += '\t\t\tself.aoz.setTask( self.aoz.tasks.length - 1 );\n';
		for ( var r = 0; r < toRun.length; r++ )
			code +=  '\t\t\tself.aoz.' + toRun[ r ] + '=new ' + toRun[ r ] + '(self.aoz,self);\n'
		code += '\t\t\tself.aoz.setTask( previousTask );\n';
		code += '\t\t}\n';
		code += '\t} );\t\n';
	}
	code += '\treturn this;\n}\n;';
	utilities.saveUTF8( 'C:\\Temp\\code.js', code );
	// Finished without errors!
	info.code = code;
	return info;
};

module.exports.compileModule = function( info, options )
{
	var code = '';
	options.main = false;
	options.resourcesSubpath = options.moduleName.toLowerCase();

	// Load the library code
	var libraryPath;
	if ( options.isExtension )
		libraryPath = options.runtimePath + '/code_extensions.jstemplate';
	else
		libraryPath = options.runtimePath + '/code_modules.jstemplate';
	var library = utilities.loadFile( libraryPath, { encoding: 'utf8' } );

	// Header
	var header = utilities.extractCode( library, 'HEADER' );
	header = utilities.replaceStringInText( header, 'MODULENAME', options.manifest.infos.applicationName );
	header = utilities.replaceStringInText( header, 'AUTHORNAME', options.manifest.infos.author );
	header = utilities.replaceStringInText( header, 'VERSIONNUMBER', options.manifest.infos.version );
	header = utilities.replaceStringInText( header, 'DATE', options.manifest.infos.date );
	header = utilities.replaceStringInText( header, 'COPYRIGHT', options.manifest.infos.copyright );
	var infos = messages.getMessage( 'compiled_with', options.version, utilities.getFormattedDate() );
	header = utilities.replaceStringInText( header, 'COMPILERINFOS', infos );
	var newManifest = utilities.copyObject( options.manifest );
	newManifest.errors = {};
	var manifestJson = JSON.stringify( newManifest );
	header = utilities.replaceStringInText( header, 'MANIFEST', BTOA( manifestJson ) );
	header = utilities.replaceStringInText( header, 'MODULE_NAME', options.moduleName );
	header = utilities.replaceStringInText( header, 'MODULE_SHORTNAME', options.shortName.substring( 0, 1 ).toUpperCase() + options.shortName.substring( 1 ) );
	var useSound = '';
	if ( options.useSounds )
		useSound = '\tthis.aoz.useSounds=true;\n'
	header = utilities.replaceStringInText( header, 'MODULE_USESOUNDS', useSound );
	code += header;

	// Compile base code
	zeroPass( info, options, true );
	if ( messages.isErrors() )
		throw {};

	// First pass!
	firstPass( undefined, undefined, info.rootSection, info, options, true );
	if ( messages.isErrors() )
		throw {};

	// Second pass!
	options.tabs = '\t\t';
	secondPass( undefined, undefined, info.rootSection, info, options, true );
	if ( messages.isErrors() )
		throw {};

	// Compute the procedures
	var linesAdded = info.linesAdded;
	var section = info.section;
	compileSection( info, section.procedures, options, true );
	compileSection( info, section.instructions, options, true );
	compileSection( info, section.functions, options, true );
	compileSection( info, section.objects, options, true );
	if ( messages.isErrors() )
		throw {};

	// Is there something to save?
	// TODOFL: check why it does not work 100%
	//if ( linesAdded > 0 )
	{
	// If pure javascript class
	if ( section.javascriptHeader.length > 0 )
	{
		for ( var l = 0; l < section.javascriptHeader.length; l++ )
			code += '\t' + section.javascriptHeader[ l ] + '\n';
	}

	// Initialisation of the root variables
	for ( var v in section.variables )
	{
		var variable = section.variables[ v ];
		if ( variable.isArray || variable.toSetDefault || ( !variable.isArray && !variable.defined ) )
		{
				code += '\t' + variable.codeInit + ';\n';
		}
	}

	// Insertion of the blocks of code
	code += 'this.blocks=[];\n';
	code += createCodeBlocks( info, section, '\t', true );
	if ( info.debugger )
	{
		code += 'this.debuggerBlocks=[];\n';
		code += createDebuggerCodeBlocks( info, section, '\t' );	
	}

	// Insert the data
	code += insertDatas( section );

	// Insert the labels
	code += insertLabels( section, '', info.caseSensitive );

	// Creation of all the sections
	code += getCreateSectionCode2( info, section.procedures, options );
	code += getCreateSectionCode2( info, section.instructions, options );
	code += getCreateSectionCode2( info, section.functions, options );
	code += getCreateSectionCode2( info, section.objects, options );
	
	// Create the instructions
	//code += getCreateSectionCode1( section.instructions, 'i' );
	//code += getCreateSectionCode1( section.functions, 'f' );
	
	// Finish the code
	var exit = utilities.extractCode( library, 'FOOTER' );
	code += exit;
	}
	/*
	else
	{
		code = '';
	}
	*/

	// Finished without errors!
	info.section = section;
	info.code = code;
	return info;
};

// Create the list of blocks of code
function createCodeBlocks( info, section, tabs, addAtEnd )
{
	var code = '';

	// Normal mode...
	for ( var b = 0; b < section.blocks.length; b++ )
	{
		code += tabs + 'this.blocks[' + b + ']=function(aoz,vars)\n'
		code += tabs + '{\n';
		code += section.blocks[ b ];
		code += tabs + '};\n';
	}
	if ( addAtEnd )
	{
		code += tabs + 'this.blocks[' + b + ']=function(aoz,vars)\n'
		code += tabs + '{\n';
		code += tabs + '\treturn{type:0};\n';
		code += tabs + '};\n';
	}
	return code;
}
// Create the list of blocks of code
function createDebuggerCodeBlocks( info, section, tabs )
{
	var code = '';

	// Debugger...
	if ( section.debuggerBlocks.length > 0 )
	{
		for ( var b = 0; b < section.blocks.length; b++ )
		{
			code += tabs + 'this.debuggerBlocks[' + b + ']=function(aoz,vars,command)\n';
			code += tabs + '{\n';
			code += section.debuggerBlocks[ b ];
			code += tabs + '};\n';
		}
	}
	return code;
}
function compileSection( info, sectionArray, options, caseSensitive )
{
	var saveTags = utilities.copyObject( info.tags );
	var saveRoot = info.rootSection;
	for ( var s in sectionArray )
	{
		var section = sectionArray[ s ];
		for ( var v = 0; v < section.variants.length; v++ )
		{
			var variant = section.variants[ v ];
			if ( section.type == 'class' )
				info.rootSection = variant;

			firstPass( variant.startPass, variant.endPass, variant, info, options, caseSensitive );
			if ( messages.isErrors() )
				break;

			info.indent();
			secondPass( variant.startPass, variant.endPass, variant, info, options, caseSensitive );
			if ( messages.isErrors() )
				break;

			if ( section.type == 'class' )
			{
				info.addLine( 'return{type:0}', true );
				info.nextBlock2( true );

				// Set all properties as Global
				for ( var v = 0; v < variant.syntax.length; v++ )
				{
					var token = variant.syntax[ v ].token;
					variant.globals[ token ] = variant.syntax[ v ]; // { variable: variant.syntax[ v ], name: variant.syntax[ v ].name, nameReal: variant.syntax[ v ].nameReal, token: token, tokenCode: variant.syntax[ v ].tokenCode };
					if ( !variant.variables[ token ] )
						throw 'internal_error'
					variant.variables[ token ].global = true;
				}
				compileSection( info, variant.procedures, options, caseSensitive );
				compileSection( info, variant.instructions, options, caseSensitive );
				compileSection( info, variant.functions, options, caseSensitive );
				for ( v in variant.methods )
				{
					var method = variant.methods[ v ];			
					if ( !method.alreadyCompiled )		
					{
						for ( var vv = 0; vv < method.variants.length; vv++ )
						{
							var subVariant = method.variants[ vv ];
							firstPass( subVariant.startPass, subVariant.endPass, subVariant, info, options, caseSensitive );
							if ( messages.isErrors() )
								break;
				
							info.indent();
							secondPass( subVariant.startPass, subVariant.endPass, subVariant, info, options, caseSensitive );
							if ( messages.isErrors() )
								break;
							info.unIndent();
						}
						method.alreadyCompiled = true;
					}
				}				
			}
			info.unIndent();
		}
		if ( messages.isErrors() )
			break;
	}
	info.rootSection = saveRoot;
	info.tags = saveTags;
};
/*
function getCreateSectionCode1( sectionArray )
{
	var code = '';
	for ( var s in sectionArray )
	{
		var section = sectionArray[ s ];
		for ( var v = 0; v < section.variants.length; v++ )
		{
			var variant = section.variants[ v ];
			if ( variant.inUse && !variant.codeInline )
				code += '\tthis.' + variant.prefix + section.name + '=new this.' + section.name + variant.postfix + '(this.aoz,this);\n';
		}
	}
	return code;
};
*/
function getCreateSectionCode2( info, sectionArray, options, tab, force )
{
	var code = '';
	tab = typeof tab == 'undefined' ? '\t' : tab;
	for ( var s in sectionArray )
	{
		var section = sectionArray[ s ];
		var inUse = section.inUse;
		for ( var v = 0; v < section.variants.length; v++ )
		{
			var variant = section.variants[ v ];
			inUse |= variant.inUse;
			if ( ( force || inUse ) && ( variant.type == 'class' || ( variant.type != 'class' && !variant.codeInline ) ) )
			{
				code += insertSection( info, variant, tab, options );
			}
		}
	}
	return code;
};

function insertLabels( section, tab, caseSensitive )
{
	tab  = typeof tab == 'undefined' ? '' : tab;

	var code = '';
	var l;
	var newCode = '';
	var done = false;
	var putAll = section.putAllLabels;
	if ( section.labels )
	{
		for ( l in section.labels )
		{
			var label = section.labels[ l ];
			if ( label.inUse || putAll )
			{
				if ( done )
				{
					newCode += ',\n';
				}
				newCode += '\t\t' + tab + ( caseSensitive ? label.nameReal : l ) + ':{';
				newCode += 'dataPosition:' + label.dataPosition + ',labelBlock:' + label.labelBlock + '}';
				done = true;
			}
		}
		if ( newCode != '' )
		{
			code += '\n\t' + tab + '// Labels...\n';
			code += '\t' + tab + 'this.labels=\n\t' + tab + '{\n';
			code += newCode;
			code += '\n\t' + tab + '};\n';
		}
	}
	return code;
};

function insertDatas( section, tab, caseSensitive )
{
	tab  = typeof tab == 'undefined' ? '' : tab;

	var code = '';
	if ( section.datas && section.datas.length )
	{
		code += '\t' + tab + '// Datas...\n';
		code += '\t' + tab + 'this.dataPosition=0;\n'
		code += '\t' + tab + 'this.datas=\n\t' + tab + '[\n';
		var line = '\t\t' + tab;
		for ( var d = 0; d < section.datas.length; d++ )
		{
			if ( line.length > 80 )
			{
				code += line + '\n';
				line = '\t\t' + tab;
			}
			line += section.datas[ d ];
			if ( d < section.datas.length - 1 )
				line += ',';
		}
		code += line + '\n\t' + tab + '];\n';
	}
	return code;
};

function insertSection( info, section, tab, options )
{
	tab  = typeof tab == 'undefined' ? '' : tab;

	var code = '';
	options.beforeFunction = typeof options.beforeFunction == 'undefined' ? '' : options.beforeFunction;
	code += tab + 'this.' + options.beforeFunction + section.prefix + section.name + '=function';
	options.beforeFunction = '';
	code += '(aoz,parent,args)\n' 
	code += tab + '{\n';
	code += tab + '\tthis.aoz=aoz;\n';
	code += tab + '\tthis.root=' + ( section.type == 'class' ? 'this' : 'parent.root' ) + ';\n';	
	code += tab + '\tthis.className="' + section.className + '";\n';
	code += tab + '\tthis.parent=parent;\n';
	if ( section.type != 'class' && section.type != 'method' )
		code += tab + '\tthis.vars={};\n';
	if ( section.type == 'procedure' )
	{
		code += tab + '\tthis.parent.procParam=0;\n' 
		code += tab + '\tthis.parent.procParam$="";\n' 
	}

	// Initialisation of the variables
	if ( section.type != 'method' && section.type != 'class' )		// TODOFL: extend to all entry of aoz-compatible function (?)
	{
		if ( !section.tags.noVariableInit )
		{
			for ( var v in section.variables )
			{
				var variable = section.variables[ v ];
				var doIt = true;
				if ( section.type == 'procedure' || section.type == 'method' || section.type == 'instruction' )
					doIt = !variable.global;
				if ( section.type == 'procedure' && variable.isParameter )
				{
					doIt = false;
					variable.toSetDefault = true;
				}
				if ( doIt )
				{
					if ( variable.isArray || variable.toSetDefault || ( !variable.isArray && !variable.defined ) )
					{
						code += '\t' + tab + variable.codeInit + ';\n';
					}
				}
			}
		}
		{
			code += '\
\t' + tab + 'for ( v in args )\n\
\t' + tab + '{\n\
\t\t' + tab + 'if ( typeof args[ v ] != "undefined" ) \n\
\t\t\t' + tab + 'this.vars[ v ] = args[v];\n\
\t' + tab + '}\n';
		}
	}
	if ( section.type == 'method' )
	{
		if ( section.methodInLine )
			code += '\t' + tab + 'this.inLine = true;\n';
	}
	if ( section.type == 'class' )
	{
		if ( section.codeInline )
			code += '\t' + tab + 'this.inLine = true;\n';
		// extendsList
		code += '\t' + tab + 'this.extendsList=[';
		for ( var e = 0; e < section.extendsList.length; e++ )
			code += '"' + section.extendsList[ e ] + ( e < section.extendsList.length - 1 ? '",': '"' );
		code += '];\n';

		// Create the list of default values
		if ( section.noDefaults )
			code += '\t' + tab + 'this.noDefaults=true;\n'
		code += '\t' + tab + 'this.defaults={\n';
		for ( var vv = 0; vv < section.syntax.length; vv++ )
		{
			var param = section.syntax[ vv ];
			if ( param.value != 'undefined' )
			{
				if ( param.value == '(array)' )
					code += '\t\t' + tab + param.tokenCode + ':[],\n';
				else if ( param.value == '(varptr)' )
					code += '\t\t' + tab + param.tokenCode + ':null,\n';
				else if ( param.value != '(index)' )
					code += '\t\t' + tab + param.tokenCode + ':' + param.value + ',\n';
			}
		}
		if ( code.charAt( code.length - 1 ) == ',' )
			code = code.substring( 0, code.length - 1 );
		code += '\t' + tab + '};\n';
		code += '\t' + tab + 'this.modified=false;\n';
		code += '\t' + tab + 'this.friends=[];\n';
	}
	// Insert the data
	code += insertDatas( section, tab, options.caseSensitive );

	// Insert the labels
	code += insertLabels( section, tab, options.caseSensitive );

	// Blocks of code
	code += tab + '\tthis.blocks=[];\n';
	code += createCodeBlocks( info, section, tab + '\t' );
	if ( info.debugger && !options.noDebugger )
	{
		// Insert cleaned definition
		var def =
		{
			type: section.type,
			main: section.main,
			nameReal: section.nameReal,
			//labels: section.labels,
			//tags: section.tags,
			//procedures:section.procedures,
			//instructions: section.,
			//functions:{},
			//methods:{},
			//objects:{},
			//syntaxes: [],
			friendClasses: section.friendClasses,
			//defFunctions: {},
			className: section.className
		};
		def = JSON.stringify( def );
		code += tab + '\tthis.debuggerInfo=function(command)\n';
		code += tab + '\t{\n';
		code += tab + '\t\tif (command=="info")\n';
		code += tab + "\t\t\treturn '" + def + "';\n";
		code += tab + '\t};\n';
	
		code += tab + '\tthis.debuggerBlocks=[];\n';
		code += createDebuggerCodeBlocks( info, section, tab + '\t' );	
	}

	// If object, add methods
	if ( section.type == 'class' )
	{
		// Insert the methods
		for ( m in section.methods )
		{
			var method = section.methods[ m ];				
			for ( var vv = 0; vv < method.variants.length; vv++ )
			{
				var variant = method.variants[ vv ];
				code += insertSection( info, variant, '\t\t', options );
			}
		}

		// Create the static version of the methods at start
		for ( m in section.methods )
		{
			var method = section.methods[ m ];				
			for ( var vv = 0; vv < method.variants.length; vv++ )
			{
				var variant = method.variants[ vv ];
				code += '\t' + tab + 'this.' + variant.name + '_m=new this.m_' + variant.name + '(aoz,this,{});\n';
			}
		}

		//code += getCreateSectionCode2( info, section.methods, options, tab + '\t', true );
		code += getCreateSectionCode2( info, section.procedures, options, tab + '\t' );
		code += getCreateSectionCode2( info, section.instructions, options, tab + '\t' );
		code += getCreateSectionCode2( info, section.functions, options, tab + '\t' );
	}	
	code += tab + '};\n';
	return code;
};


// Pass zero: cut the source in lines, spot the procedures
function zeroPass( info, options, caseSensitive )
{
	messages.print( messages.VERBOSE_DEV3, 'zero_pass' );

	// Section template
	var sectionTemplate =
	{
		type: 'main',
		main: true,
		start: 0,
		end: 0,
		blocks: [],
		className: 'root',
		debuggerBlocks: [],
		labels: {},
		pileIfs: [ null ],
		anchors: {},
		blockAnchors: {},
		pile:[ null ],
		start: 0,
		number: 0,
		datas: [],
		dataPosition: 0,
		globals: {},
		variables: {},
		tags: {},
		procedures:{},
		instructions: {},
		functions:{},
		methods:{},
		objects:{},
		syntaxes: [],
		friendClasses: {},
		defFunctions: {},
		classCount: 0,
		friendWith: [],
		extendedBy: []
	};

	if ( !options.directMode )
	{
		// Main section
		var section = utilities.copyObject( sectionTemplate );
		section.type = 'main';
		section.main = true;
		info.rootSection = section;
	}
	else
	{
		section = info.rootSection;
	}

	info.setOptions( options );
	info.setSection( section );
	info.setPass( undefined, undefined, 0, section, 0, caseSensitive );

	var procedureOpen = false;
	var instructionOpen = false;
	var functionOpen = false;
	var methodOpen = false;
	var objectOpen = false;
	var checkLabel = true;
	info.pass = 0;
	info.position = 0;
	info.positionPrevious = 0;
	info.currentLine = 0;
	info.debugger = options.debugging;
	info.indentation = [];
	info.__cDebugStop = false;

	var tab = 0;
	var plusTab = 0;
	var thenOnLine = 0;
	var lineIf, lineDo, lineFor, lineRepeat, lineWhile;
	while( !info.endOfText )
	{
		try
		{
			if ( options.indent && info.currentLine > info.indentation.length )
			{
				info.indentation.push( tab );
				tab += plusTab;
				for ( var l = info.indentation.length + 1; l < info.currentLine; l++ )
					info.indentation.push( tab );
				plusTab = 0;
				thenOnLine = 0;
			}

			// Next word...
			info.extractNextWord();

			// End of source?
			if ( info.endOfLine )
			{
				checkLabel = true;
				info.nextLine( tab );
				continue;
			}

			// Remark
			if ( info.type == 'remark' )
			{
				tab += plusTab;
				plusTab = 0;
				info.skipRemark( tab );
				continue;
			}

			// Skip Javascript code...
			if ( info.text == '{' )
			{
				tab += plusTab;
				plusTab = 0;
				info.getJavascript( { tags: section.tags, tab: tab } );
				continue;
			}

			// Tag?
			if ( info.type == 'tag' )
			{
				tab += plusTab;
				plusTab = 0;
				info.getTag( info.tags, tab );
				continue;
			}

			// Look for a label at start of line...
			if ( checkLabel && ( info.type == 'variable' || info.type == 'number' ) )
			{
				if ( ( info.type == 'variable' && info.charAt( info.position ) == ':' ) || info.type == 'number' )
				{
					info.position++;

					var labels;
					if ( procedureOpen )
						labels = procedureOpen;
					else if ( instructionOpen )
						labels = instructionOpen;
					else if ( functionOpen )
						labels = functionOpen;
					else if ( objectOpen )
						labels = objectOpen;
					else
						labels = info.section;
					if ( labels.labels[ info.textLower ] )
						info.throwError( { error: 'label_already_defined', parameter: info.text } );
					labels.labels[ info.textLower ] = { inUse: false, labelBlock: 0, dataPosition: 0, nameReal: info.text };
					if ( info.type == 'number' )
						labels.labels[ info.textLower ].inUse = true;
					continue;
				}
			}
			checkLabel = false;

			// Debugging
			if ( info.__cDebugStop )
				debugger;

			// Spot the beginning of procedures
			if ( info.type == 'token' )
			{
				switch ( info.token.token )
				{
					case 'procedure':
						if ( procedureOpen )
							info.throwError( { error: 'procedure_not_closed' }, true );
						if ( instructionOpen )
							info.throwError(  { error: 'syntax_error' }, true );
						if ( functionOpen )
							info.throwError(  { error: 'syntax_error' }, true );
						var parent = objectOpen ? objectOpen : info.rootSection;
						procedureOpen = addFunctionOrMethod( info, parent, 'procedure', sectionTemplate, tab );				
						checkLabel = true;
						plusTab++;
						break;

					case 'end proc':
					case 'end procedure':
						if ( !procedureOpen )
							info.throwError(  { error: 'procedure_not_opened' }, true );
						closeFunctionOrMethod( info, procedureOpen );
						procedureOpen = false;
						checkLabel = true;
						tab--;
						break;
					case 'instruction':
						if ( instructionOpen )
							info.throwError( { error: 'instruction_already_opened' }, true );
						if ( functionOpen )
							info.throwError( { error: 'function_not_closed' }, true );
						if ( procedureOpen )
							info.throwError( { error: 'procedure_not_closed' }, true );
						var parent = objectOpen ? objectOpen : info.rootSection;
						instructionOpen = addInstruction( info, parent, 'instruction', sectionTemplate, tab );				
						checkLabel = true;
						plusTab++;
						break;
					case 'end instruction':
						if ( !instructionOpen )
							info.throwError( { error: 'instruction_not_opened' }, true );
						closeObjectOrInstruction( info, instructionOpen );
						instructionOpen = false;
						checkLabel = true;
						tab--;
						break;

					case 'class':
						if ( functionOpen )
							info.throwError( { error: 'function_already_open' }, true );
						if ( instructionOpen )
							info.throwError( { error: 'instruction_not_closed' }, true );
						if ( procedureOpen )
							info.throwError( { error: 'procedure_not_closed' }, true );
						if ( objectOpen )
							info.throwError( { error: 'object_already_opened' }, true );
						var parent = objectOpen ? objectOpen : info.rootSection;
						objectOpen = addFunctionOrMethod( info, parent, 'class', sectionTemplate, tab );
						checkLabel = true;
						plusTab++;
						break;
					case 'end class':
						if ( !objectOpen )
							info.throwError( { error: 'object_not_opened' }, true );
						linkMethods( info, info.rootSection, objectOpen );
						closeFunctionOrMethod( info, objectOpen );
						objectOpen = false;
						checkLabel = true;
						tab--;
						break;

					case 'function':
						if ( functionOpen )
							info.throwError( { error: 'function_already_open' }, true );
						if ( instructionOpen )
							info.throwError( { error: 'instruction_not_closed' }, true );
						if ( procedureOpen )
							info.throwError( { error: 'procedure_not_closed' }, true );
						var parent = objectOpen ? objectOpen : info.rootSection;
						functionOpen = addFunctionOrMethod( info, parent, 'function', sectionTemplate, tab );
						checkLabel = true;
						plusTab++;
						break;
					case 'end function':
						if ( !functionOpen )
							info.throwError( { error: 'function_not_opened' }, true );
						closeFunctionOrMethod( info, functionOpen );
						functionOpen = false;
						checkLabel = true;
						tab--;
						break;

					case 'method':
						if ( !objectOpen )
							info.throwError( { error: 'methods_can_only_be_located_in_objects' }, true );
						if ( methodOpen )
							info.throwError( { error: 'method_already_opened' }, true );
						if ( procedureOpen )
							info.throwError( { error: 'procedure_not_closed' }, true );
						var parent = objectOpen ? objectOpen : info.rootSection;
						methodOpen = addFunctionOrMethod( info, parent, 'method', sectionTemplate, tab );
						checkLabel = true;
						plusTab++;
						break;
					case 'end method':
						if ( !methodOpen )
							info.throwError( { error: 'method_not_opened' }, true );
						closeFunctionOrMethod( info, methodOpen );
						methodOpen = false;
						checkLabel = true;
						tab--;
						break;

					case 'on error':
						if ( procedureOpen )
							procedureOpen.onError = true;
						else if ( instructionOpen )
							instructionOpen.onError = true;
						else if ( functionOpen )
							functionOpen.onError = true;
						else if ( objectOpen )
							objectOpen.onError = true;
						else if ( methodOpen )
							methodOpen.onError = true;
						else
							info.rootSection.onError = true;
						break;

					case 'then':
						plusTab--;
						thenOnLine++;
						break;

					case 'else':
					case 'else if':
						if ( thenOnLine )
							thenOnLine--;
						else
						{
							tab--;
							plusTab++;
						}
						break;

					case 'if':
						lineIf = info.currentLine;
						plusTab++;
						break;
					case 'repeat':
						lineRepeat = info.currentLine;
						plusTab++;
						break;
					case 'while':
						lineWhile = info.currentLine;
						plusTab++;
						break;
					case 'do':
						lineDo = info.currentLine;
						plusTab++;
						break;
					case 'for':
						lineFor = info.currentLine;
						plusTab++;
						break;
						
					case 'wend':
						if ( info.currentLine == lineWhile )
							plusTab--;
						else
							tab--;
						break;
					case 'loop':
						if ( info.currentLine == lineDo )
							plusTab--;
						else
							tab--;
						break;
					case 'until':
						if ( info.currentLine == lineRepeat )
							plusTab--;
						else
							tab--;
						break;
					case 'end if':
						if ( info.currentLine == lineIf )
							plusTab--;
						else
							tab--;
						break;
					case 'next':
						if ( info.currentLine == lineFor )
							plusTab--;
						else
							tab--;
						break;

					case "__cdebug":
						info.extractNextWord();
						if ( info.text == '0' )
						{
							info.__cDebugStop = true;
							debugger;
							break;
						}

					default:	
						if ( info.textLower == 'break' || info.textLower == 'break if' || info.textLower == 'debug' )
						{
							info.debugger = true;
							info.debugInstructionLine = info.currentLine;
						}
						break;
				}
			}
			else if ( info.textLower == 'break' || info.textLower == 'break if' || info.textLower == 'debug' )
			{
				info.debugger = true;
				info.debugInstructionLine = info.currentLine;
			}
		}
		catch( error )
		{
			if ( utilities.isObject( error ) )
			{
				var obj = info.findLineAndColumn( info.position );
				if ( error.stack )
				{
					var text = 'Pass: 0, crash at line ' + obj.line + ', column: ' + obj.column + '!\n' + error.message + '\n' + error.stack;
					messages.pushError( { compilerError: 'crash_error', file: options.currentSourcePath, parameter: text } );
				}
				else
				{
					info.throwError( error, true );
				}
			}
			return;
		}
	}

	// Check for errors...
	if ( functionOpen )
		info.throwError( { error: 'function_not_closed', position: functionOpen.position }, true );
	if ( instructionOpen )
		info.throwError( { error: 'instruction_not_closed', position: instructionOpen.position }, true );
	if ( procedureOpen )
		info.throwError( { error: 'procedure_not_closed', position: procedureOpen.position }, true );
	if ( objectOpen )
		info.throwError( { error: 'object_not_closed', position: objectOpen.position }, true );
	if ( methodOpen )
		info.throwError( { error: 'method_not_closed', position: methodOpen.position }, true );

	// indentation
	if ( options.indent )
	{
		var newIndentation = [];
		for ( var l = 0; l < info.lines.length; l++ )
		{
			if ( info.lines[ l ].include.parent == null )
				newIndentation.push( info.indentation[ l ] );
		}
		info.indentation = newIndentation;
	}
	if ( info.debugger )
	{
		if ( options.noDebugging )
			messages.pushError( { compilerError: 'no_debugging_instruction', file: options.currentSourcePath, parameter: info.debugInstructionLine } );
		for ( var e in options.extensions )
		{
			var extension = options.extensions[ e ];
			if ( extension.shortName == 'debugging' )
				extension.inUse = true;
		}
	}
	return info;
}
// First loop: procedures and their parameters, labels
function firstPass( start, end, section, info, options, caseSensitive )
{	
	var sectionName = 'application';
	if ( section.nameReal )
		sectionName = section.nameReal;
	messages.print( messages.VERBOSE_DEV3, 'first_pass', [ section.type, sectionName ] );

	info.setPass( start, end, 0, section, 1, caseSensitive );
	info.section.blockPlus = [];
	info.section.blockPlus[ 0 ] = 0;
	info.section.with = [];
	info.options = options;
	info.isObjectOriented = false;
	info.__cDebugStop = false;

	var previousPosition;
	var previousTokenProcCount = 0;
	while( !info.endOfText && !info.break )
	{
		try
		{
			//if ( info.currentLine == 353 )
			//	var toto = 2;

			// Manage If/Then
			for ( var p = info.section.pileIfs.length - 1; p > 0; p-- )
			{
				var ifs = info.section.pileIfs[ p ];
				if ( ifs && ifs.then )
				{
					info.nextBlock1( true );
					ifs.endIfBlock = info.blockNumber - ( info.debugger ? 1 : 0 );
					info.section.pileIfs.pop();
				}
			}

			var checkLabel = true;
			var quit = false;
			while( !quit )
			{
				// Next keyword
				previousTokenProcCount--;
				info.previousToken = info.token;
				previousPosition = info.position;
				info.extractNextWord( undefined, 
				{ 
					noObjects: false
				} );

				// A remark?
				if ( info.type == 'remark' )
				{
					info.skipRemark();
					continue;
				}

				// End of source?
				if ( info.endOfLine )
				{
					info.nextLine();
					info.section.withCurrent = [];
					info.section.withCurrentDefinition = [];
					break;
				}

				// Skip Javascript code...
				if ( info.text == '{' )
				{
					info.getJavascript( { tags: section.tags } );
					info.nextBlock1( info.section.type == 'method' && info.section.waiting );
					continue;
				}

				// We are in basic!
				info.isBasic = true;

				// Look for a label
				if ( checkLabel && ( info.type == 'variable' || info.type == 'number' ) )
				{
					if ( ( info.type == 'variable' && info.charAt( info.position ) == ':' ) || info.type == 'number' )
					{
						info.position++;
						if ( info.addedBlock == 0 )
							info.nextBlock1( true );
						var label = info.section.labels[ info.textLower ];
						if ( !label )
							info.throwError( { error: 'internal_error' }, true );
						if ( info.caseSensitive && label.nameReal != info.text )
							info.throwError( { error: 'internal_error' }, true );
						label.labelBlock = info.blockNumber;
						label.dataPosition = info.section.dataPosition;
						continue;
					}
				}
				checkLabel = false;

				// A global object?
				if ( info.type == 'globalObject' )
				{
					/*
					var module = info.module;

					// Look for method in the friend classes
					info.extractNextWord( 'wantMethod', { currentObject: module } );
							if ( info.type == 'method' )
					{
						info.parseSyntax1( info.definition, { skipIndex: true } );
						info.nextBlock1();
						continue;
						}
					else if ( info.type == 'property' && info.textLower == 'set' )
					{
						var type = info.returnType;

						// Index
						info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
						info.extractNextWord();
						if ( info.text != ',' )
							info.throwError( { error: 'syntax_error' } );

						// Value
						var exp2 = info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
						if ( !info.checkTypes( type, exp2.type ) )
							info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
						
						// TODO: check!	info.nextBlock1();
						continue;
					}
					*/
					// Back to a normal instruction
					info.setPosition( previousPosition );
					info.extractNextWord();
				}				

				// A GOTO embedded after THEN or ELSE?
				if ( info.type == 'number' && info.previousToken )
				{
					if ( info.previousToken.token == 'then' || info.previousToken.token == 'else' )
					{
						var label = info.section.labels[ info.textLower ];
						if ( label )
						{
							info.token = { name: "Goto", token: "goto", params: [ ], compile: '#function handleGoto' };
							info.type = 'token';
							info.position = previousPosition;
						}
					}
				}
				info.previousAddedBlock = info.addedBlock;
				info.addedBlock = 0;
				if ( info.__cDebugStop )
					debugger;
				switch ( info.type )
				{
					// A tag-> nothing to do!
					case 'tag':
						info.getTag();	
						break;

					// A instruction call
					case 'procedure':
					case 'instruction':
					case 'method':
						// If there is a bracket after, maybe object-orientation
						var definition = info.definition;
						if ( definition == null )
						{
							info.throwError( { error: 'procedure_not_found' }, true );
							break;
						}						
						info.parseSyntax1( definition );
						break;

					// A function
					case 'function':
						info.throwError( { error: 'syntax_error' } );
						break;

					// An extra-token?
					case 'extraToken':
						info.extraTokenFunction.call( this, info );
						break;

					// A method of an object, with with?
					case 'objectMethod':
						info.parseSyntax1( info.definition, { skipIndex: false, method: true } );
						break;
					
					// A property of an object, with with?
					case 'objectProperty':
						var type = info.returnType;
						info.extractNextWord();
						if ( info.text != '=' )
							info.throwError( { error: 'syntax_error' } );
						info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
						if ( !info.checkTypes( info.returnType, type ) )
							info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
						info.nextBlock1();
						break;			

					// A sub-class?
					case 'objectClass':
						info.section.withCurrent.push( info.className.toLowerCase() );
						info.section.withCurrentDefinition.push( info.className.toLowerCase() );
						info.extractNextWord();
						if ( info.text != '.' )
						{
							info.throwError( { error: 'syntax_error', parameter: info.text } );
							break;
						}
						while( true )
						{
							info.peekNextWord( 'wantObjectMethodProperty', { currentObject: info.section.withCurrentDefinition[ info.section.withCurrentDefinition.length - 1 ] } );
							if ( info.type != 'class' )
								break;

							info.setNextWord();
							info.section.withCurrent.push( info.textLower );
							info.section.withCurrentDefinition.push( info.textLower );

							// An index?
							info.peekNextWord();
							if ( info.text == '(' )
							{
								info.setNextWord();
								info.compileExpression( INFO.EXPFLAG_ENDONBRACKET );
								info.extractNextWord();
								if ( info.text != ')' )
									info.throwError( { error: 'syntax_error', parameter: info.text } );
								info.peekNextWord();									
							}
							info.peekNextWord();
							if ( info.text != '.' )
								break;
							info.setNextWord();
						}
						break;

					// An instruction?
					case 'token':
						var token = info.token;
						noScan = false;

						switch( token.token )
						{
							// Skip objects
							case 'class':
							case 'method':
							case 'procedure':
							case 'function':
							case 'instruction':
								var definition = info.anchors[ info.position ];
								info.setCurrentLine( definition.end + 1 );
								quit = true;
								break;

							case 'end class':
							case 'end instruction':
								break;

							case 'pop proc':
							case 'pop procedure':
								var end = info.peekNextWord();
								if ( info.text == '[' )
								{
									info.setPosition( end );
									info.waitingFunctionCount = 0;
									if ( !info.section.codeInlineReturn )
									{
										var exp = info.compileExpression( INFO.EXPFLAG_ENDONSQUAREBRACKET );
										info.section.returnType = exp.type;
									}
									else
									{
										info.extractNextWord();
										info.getJavascript( { tags: section.tags } );
									}
									info.extractNextWord();
									if ( info.text != ']' )
										info.throwError( { error: 'syntax_error', parameter: info.text } );
								}
								info.nextBlock1();
								quit = true;
								break;

							case 'end proc':
							case 'end procedure':
							case 'end function':
							case 'end method':
								var isProcedure = ( token.token == 'end proc' ||  token.token == 'end procedure' );
								var end = info.peekNextWord();
								if ( ( isProcedure && info.text == '[' ) || ( !isProcedure && info.text == '(' ) )
								{
									info.setPosition( end );
									info.waitingFunctionCount = 0;
									if ( !info.section.codeInlineReturn )
									{
										var exp = info.compileExpression( isProcedure ? INFO.EXPFLAG_ENDONSQUAREBRACKET : INFO.EXPFLAG_ENDONBRACKET );
										if ( isProcedure )
											info.section.returnType = exp.type;
									}
									else
									{
										info.extractNextWord();
										info.getJavascript( { tags: section.tags } );
									}
									info.extractNextWord();
									if ( ( isProcedure && info.text != ']' ) || ( !isProcedure && info.text != ')' ) )
										info.throwError( { error: 'syntax_error', parameter: info.text } );
								}
								if ( isProcedure )
									info.nextBlock1();
								quit = true;
								break;

							// On XXX goto/gosub/proc
							case 'on':
								var ons =
								{
									endBlock: info.blockNumber + 1
								};
								info.section.anchors[ info.position ] = ons;
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONGOTO | INFO.EXPFLAG_ENDONGOSUB | INFO.EXPFLAG_ENDONPROC );
								if ( info.returnType != '0' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								var type;
								if ( info.textLower == 'goto' || info.textLower == 'gosub' )
									type = 'label';
								else if ( info.textLower == 'proc' )
									type = 'procedure';
								if ( !type )
									info.throwError( { error: 'syntax_error' } );

								// Skip labels
								while( !info.endOfLine )
								{
									var type = info.checkLabelType();
									if ( type != 'label' && type != 'procedure' && type != 'expression' )
										info.throwError( { error: 'syntax_error' } );
									if ( type == 'label' )
									{
										if ( !info.section.labels[ info.textLower ] )
											info.throwError( { error: 'label_not_defined' }, true );
										if ( info.caseSensitive && info.text != info.section.labels[ info.textLower ].nameReal )
											info.throwError( { error: 'label_not_defined' }, true );
										info.section.labels[ info.textLower ].inUse = true;
									}
									info.extractLabel();
									var end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setPosition( end );
								}
								info.nextBlock1( true );
								break;

							// Every XXX gosub/proc
							case 'every':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONGOTO | INFO.EXPFLAG_ENDONGOSUB | INFO.EXPFLAG_ENDONPROC );
								if ( info.returnType != '0' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.textLower != 'gosub' && info.textLower != 'proc' )
									info.throwError( { error: 'syntax_error' } );

								// Skip labels
								var type = info.extractLabel();
								if ( type == 'label' )
								{
									if ( !info.section.labels[ info.textLower ] )
										info.throwError( { error: 'label_not_defined', parameter: info.text }, true );
									if ( info.caseSensitive && info.text != info.section.labels[ info.textLower ].nameReal )
										info.throwError( { error: 'label_not_defined', parameter: info.text }, true );
									info.section.labels[ info.textLower ].inUse = true;
								}
								info.nextBlock1( true );
								break;

							// Gosub
							case 'gosub':
								var loop =
								{
									type: 'gosub',
									startBlock: info.blockNumber + 1
								};
								info.section.anchors[ info.position ] = loop;
								var t = info.extractLabel();
								if ( t == 'label' )
								{
									if ( !info.section.labels[ info.textLower ] )
									{
										info.throwError( { error: 'label_not_defined', parameter: info.text }, true );
										break;
									}
									if ( info.caseSensitive && info.text != info.section.labels[ info.textLower ].nameReal )
									{
										info.throwError( { error: 'label_not_defined', parameter: info.text }, true );
										break;
									}
									info.section.labels[ info.textLower ].inUse = true;
								}
								else if ( t == 'procedure' )
								{
									info.throwError( { error: 'syntax_error' },  true );
								}
								info.nextBlock1( true );
								break;

							// Return
							case 'return':
								info.nextBlock1( true );
								break;

							case 'goto':
								for ( var p = info.section.pile.length - 1; p > 0; p-- )
								{
									var pile = info.section.pile[ p ];
									pile.gotos.push( { position: info.position, blockNumber: info.blockNumber } );
								}
								var t = info.extractLabel();
								if ( t == 'label' )
								{
									if ( !info.section.labels[ info.textLower ] )
									{
										info.throwError( { error: 'label_not_defined' }, true );
										break;
									}
									if ( info.caseSensitive && info.text != info.section.labels[ info.textLower ].nameReal )
									{
										info.throwError( { error: 'label_not_defined' }, true );
										break;
									}
									info.section.labels[ info.textLower ].inUse = true;
								}
								info.nextBlock1( true );
								break;

							// Pop
							case 'pop':
								info.nextBlock1( true );
								break;

							// Proc
							case 'proc':
								if ( info.options.manifest.compilation.platform.toLowerCase() == 'amiga' )
									previousTokenProcCount = 2;
								else
								{
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
									if ( !info.checkTypes( '2', info.returnType ) )
										info.throwError( { error: 'type_mismatch' } );
								}
								break;

							// If/Else/End If
							case 'if':
								var ifs =
								{
									position: info.position,
									endIfBlock: false,
									then: false,
									elseBlocks: [],
									elseCount: 0
								};
								info.section.anchors[ info.position ] = ifs;
								info.section.pileIfs.push( ifs );
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONTHEN | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
								end = info.peekNextWord();
								if ( info.textLower == 'then' )
								{
									ifs.then = true;
									info.setNextWord( end );
								}
								info.position++;
								info.nextBlock1( true );
								info.position--;
								break;
							case 'else':
								var ifs = info.section.pileIfs[ info.section.pileIfs.length - 1 ];
								if ( !ifs )
									info.throwError( { error: 'syntax_error' }, true );
								info.section.anchors[ info.position ] = ifs;
								ifs.elseBlocks.push( info.blockNumber + 1 );
								info.nextBlock1( true );
								break;
							case 'else if':
								var ifs = info.section.pileIfs[ info.section.pileIfs.length - 1 ];
								if ( !ifs )
									info.throwError( { error: 'syntax_error' }, true );
								info.section.anchors[ info.position ] = ifs;
								info.nextBlock1( true );
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_COMPARAISON | INFO.EXPFLAG_ENDONCOLON );
								if ( !info.checkTypes( '0', info.returnType ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								ifs.elseBlocks.push( info.blockNumber );
								info.nextBlock1( true );
								break;
							case 'end if':
								ifs = info.section.pileIfs.pop();
								if ( !ifs )
									info.throwError( { error: 'syntax_error' }, true );
								ifs.endIfBlock = info.blockNumber + ( info.debugger ? 0 : 1 );
								info.nextBlock1( true );
								break;

							// While / Wend
							case 'while':
								var loop =
								{
									position: info.position,
									type: 'while',
									startBlock: info.blockNumber + 1,
									endBlock: 0,
									gotos: []
								};
								info.section.anchors[ info.position ] = loop;
								info.section.pile.push( loop );
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_COMPARAISON | INFO.EXPFLAG_ENDONCOLON );
								info.nextBlock1( true );
								break;
							case 'wend':
								var loop = info.section.pile.pop();
								if ( !loop || loop.type != 'while' )
									info.throwError( { error: 'wend_without_while' }, true );
								loop.endBlock = info.blockNumber + 1;
								info.section.anchors[ info.position ] = loop;
								info.nextBlock1( true );
								break;


							// Repeat / Until
							case 'repeat':
								var loop =
								{
									position: info.position,
									type: 'repeat',
									startBlock: info.blockNumber + 1,
									endBlock: 0,
									gotos: []
								};
								info.section.anchors[ info.position ] = loop;
								info.section.pile.push( loop );
								info.nextBlock1( true );
								break;
							case 'until':
								var loop = info.section.pile.pop();
								if ( !loop || loop.type != 'repeat' )
									info.throwError( { error: 'until_without_repeat' }, true );
								loop.endBlock = info.blockNumber + 1;
								info.section.anchors[ info.position ] = loop;
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
								info.nextBlock1( true );
								break;

							// Do / Loop
							case 'do':
								var loop =
								{
									position: info.position,
									type: 'do',
									startBlock: info.blockNumber + 1,
									endBlock: 0,
									gotos: []
								};
								info.section.anchors[ info.position ] = loop;
								info.section.pile.push( loop );
								info.nextBlock1( true );
								break;
							case 'loop':
								var loop = info.section.pile.pop();
								if ( !loop || loop.type != 'do' )
									info.throwError( { error: 'loop_without_do' }, true );
								loop.endBlock = info.blockNumber + 1;
								info.section.anchors[ info.position ] = loop;
								info.nextBlock1( true );
								break;

							// Exit
							case 'exit':
							case 'exit if':
								if ( info.section.pile.length < 2 )
									info.throwError( { error: 'no_loop_to_exit' }, true );
								var loop =
								{
									type: 'exit',
									loops: []
								};
								for ( var l = 0; l < info.section.pile.length; l++ )
									loop.loops.push( info.section.pile[ l ] );
								info.section.anchors[ info.position ] = loop;
								if ( token.token == 'exit if' )
								{
									info.waitingFunctionCount = 0;
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
									info.peekNextWord();
									if ( info.text == ',' )
										info.setNextWord()
								}
								info.peekNextWord();
								if ( !info.peekEndOfInstruction )
								{
									if ( info.type != 'number' )
										info.throwError( { error: 'syntax_error' } );
									info.setNextWord();								
								}
								info.nextBlock1( true );
								break;

							// For/Next
							case 'for':
								var loop =
								{
									position: info.position,
									type: 'for',
									startBlock: info.blockNumber + 1,
									endBlock: 0,
									gotos: []
								};
								info.section.anchors[ info.position ] = loop;
								info.extractNextWord();
								if ( info.type != 'variable' )
									info.throwError( { error: 'syntax_error' } );
								var v = info.getVariable( 0, INFO.GETVARIABLEFLAG_SETVALUE );
								loop.variableToken = v.variable.token;
								loop.variableTokenCode = v.variable.tokenCode;
								loop.variableNameReal = v.variable.nameReal;
								loop.variableType = info.returnType;
								info.extractNextWord();
								if ( info.text != '=' )
									info.throwError( { error: 'syntax_error' }, true );
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONTO );
								info.extractNextWord();
								if ( info.textLower != 'to' )
									info.throwError( { error: 'syntax_error' }, true );
								info.compileExpression( INFO.EXPFLAG_ENDONSTEP | INFO.EXPFLAG_ENDONCOLON );
								end = info.peekNextWord();
								if ( info.textLower == 'step' )
								{
									info.setNextWord( end );
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
								}
								info.section.pile.push( loop );
								info.nextBlock1( true );
								break;
							case 'next':
								if ( info.section.pile.length == 0 )
									info.throwError( { error: 'next_without_for' }, true );
								var loop = info.section.pile.pop();
								if ( loop.type != 'for' )
									info.throwError( { error: 'next_without_for' }, true );
								info.section.anchors[ info.position ] = loop;
								end = info.peekNextWord();
								if ( info.type == 'variable' )
								{
									if ( info.variableInfo.token == loop.variableToken )
									{
										if ( !this.caseSensitive || info.variableInfo.nameReal == loop.variableNameReal )
											info.setNextWord( end );
										else 
											info.throwError( { error: 'next_without_for' }, true );
									}
									else
									{
										info.throwError( { error: 'next_without_for' }, true );
									}
								}
								loop.endBlock = info.blockNumber + 1;
								info.nextBlock1( true );
								break;

							// Save Variables
							case 'save variables':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONBRACKET );
								if ( info.returnType != '2' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ',' )
									info.throwError( { error: 'syntax_error' } );
								while( true )
								{
									info.extractNextWord();
									if ( info.type != 'variable' )
										break;
									info.getVariable( 0, INFO.GETVARIABLEFLAG_VARPTR );	
									info.extractNextWord();
									if ( info.text != ',' )
										break;
								}
								info.nextBlock1( true );								break;

							// Dim
							case 'dim':
								while(true)
								{
									info.extractNextWord();
									if ( info.type != 'variable' )
										break;
									var name = info.variableInfo.name;
									var token = info.variableInfo.token;
									var variable = info.section.variables[ token ];
									if ( variable && info.caseSensitive )
									{
										if ( variable.nameReal != name )
											variable = undefined;
									}
									if ( variable && !variable.nonDimensionned )
										info.throwError( { error: 'array_already_dimensionned' }, true );
									variable = info.newVariable( info.variableInfo );
									info.extractNextWord();
									if ( info.text != '(' )
										info.throwError( { error: 'syntax_error' }, true );
									variable.isArray = true;
									info.section.variables[ token ] = variable;
									info.waitingFunctionCount = 0;
									do
									{
										var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONBRACKET );
										if ( ( info.returnType == 2 && !info.constant ) ||
										     ( info.returnType == '?' && info.result != 'undefined' ) )
											info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
										variable.numberOfDimensions++;
										end = info.peekNextWord();
										if ( info.text == ')' )
										{
											info.setNextWord( end );
											break;
										}
										if ( info.text != ',' )
											info.throwError( { error: 'syntax_error' }, true );
										info.setNextWord( end );
									} while( true )
									info.nextBlock1();
									end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord( end );
									info.storeSourceReference();
								}
								break;

							// On error
							case 'on error':
								info.extractNextWord();
								if ( info.type != 'token' || ( info.type == 'token' && info.token.token != 'goto' && info.token.token != 'proc' ) )
									info.throwError( { error: 'syntax_error' }, true );
								info.extractNextWord();
								if ( info.type != 'variable' && info.type != 'procedure' && info.type != 'number' )
									info.throwError( { error: 'syntax_error' }, true );
								info.nextBlock1();
								break;

							case 'resume':
							case 'resume label':
								end = info.peekNextWord();
								if ( info.type == 'variable' || info.type == 'number' )
									info.setNextWord( end );
							case 'resume next':
								info.nextBlock1();
								break;

							case 'data':
								info.waitingFunctionCount = 0;
								while ( true )
								{
									info.section.dataPosition++;
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
									end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord( end );
								}
								break;
							case 'restore':
								var end = info.peekNextWord();
								if ( !info.peekEndOfInstruction )
								{
									var labelType = info.checkLabelType();
									if ( labelType == 'label' )
									{
										info.extractNextWord();
									}
									else if ( labelType = 'expression' )
									{
										info.section.saveLabels = true;
										info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOLON );
									}
								}
								info.nextBlock1();
								break;
							case 'read':
								while ( true )
								{
									info.extractNextWord();
									if ( info.type != 'variable' )
										info.throwError( { error: 'syntax_error' }, true );
									info.getVariable( 0, INFO.GETVARIABLEFLAG_READ | INFO.GETVARIABLEFLAG_SETVALUE );
									end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord( end );
								}
								info.nextBlock1();
								break;

							case 'lprint':
								end = info.peekNextWord();
								info.waitingFunctionCount = 0;
								while ( !info.peekEndOfInstruction )
								{
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON | INFO.EXPFLAG_ENDONCOMMA );
									end = info.peekNextWord();
									if ( info.text != ';' && info.text != ',' )
										break;
									info.setNextWord( end );
									end = info.peekNextWord();
								}
								info.nextBlock1();
								break;

							case 'print':
								end = info.peekNextWord();
								info.waitingFunctionCount = 0;
								if ( info.type == 'tag'  )
								{
									info.setPosition( end );
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
									if ( info.returnType != '0' )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									info.extractNextWord();
									if ( info.text != ',' )
										info.throwError( { error: 'syntax_error' }, true );
									while ( !info.endOfInstruction )
									{
										info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON );
										end = info.peekNextWord();
										if ( info.text != ',' )
											break;
										info.setNextWord();
										end = info.peekNextWord();
										info.endOfInstruction = info.peekEndOfInstruction;
									}
									if ( info.text == ';' )
										info.setNextWord( end );
									info.nextBlock1();
								}
								else
								{
									while ( !info.peekEndOfInstruction )
									{
										info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON | INFO.EXPFLAG_ENDONCOMMA );
										end = info.peekNextWord();
										if ( info.text != ';' && info.text != ',' )
											break;
										info.setNextWord( end );
										end = info.peekNextWord();
									}
									info.nextBlock1();
								}
								break;

							case 'console log':
							case 'console warn':
							case 'console error':
								end = info.peekNextWord();
								while ( !info.peekEndOfInstruction )
								{
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON | INFO.EXPFLAG_ENDONCOMMA );
									end = info.peekNextWord();
									if ( info.text != ';' && info.text != ',' )
										break;
									info.setNextWord( end );
									end = info.peekNextWord();
								}
								info.nextBlock1( true );
								break;

							case 'input':
							case 'line input':
								var start = info.position;
								var end = info.peekNextWord();
								if ( info.type == 'tag' )
								{
									info.setPosition( end );
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
									if ( info.returnType != '0' )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									info.extractNextWord();
								}
								else
								{
									var start = info.position;
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON );
									var e = info.peekNextWord();
									if ( info.text == ';' )
									{
										info.setPosition( e );
										if ( info.returnType != '2' )
											info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
										info.section.anchors[ start ] = { expressionFirst: true };
									}
									else
									{
										info.setPosition( start );
										info.section.anchors[ start ] = { expressionFirst: false };
									}
								}
								while ( true )
								{
									info.extractNextWord();
									if ( info.type != 'variable'  )
										info.throwError( { error: 'syntax_error' }, true );
									info.getVariable( 0, INFO.GETVARIABLE_SETVALUE | INFO.GETVARIABLE_INPUT );
									info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord();
								}
								if ( info.text == ';' )
									info.setNextWord();
								info.nextBlock1( true );
								break;

							case 'print using':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONSEMICOLON );
								if ( info.returnType != '2' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ';' )
									info.throwError( { error: 'syntax_error' }, true );
								while ( !info.endOfInstruction )
								{
									info.compileExpression( INFO.EXPFLAG_ENDONSEMICOLON | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
									end = info.peekNextWord();
									if ( info.text != ';' && info.text != ',' )
										break;
									info.setNextWord();
									end = info.peekNextWord();
									info.endOfInstruction = info.peekEndOfInstruction;
								}
								info.nextBlock1();
								break;

							case 'field':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
								if ( !info.checkTypes( '0', info.returnType ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ',' )
									info.throwError( { error: 'syntax_error' }, true );
								while( true )
								{
									info.compileExpression( INFO.EXPFLAG_ENDONAS );
									if ( !info.checkTypes( '0', info.returnType ) )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									info.extractNextWord();
									if ( info.textLower != 'as' )
										info.throwError( { error: 'syntax_error' }, true );
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
									if ( !info.checkTypes( '2', info.returnType ) )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord( end );
								}
								info.nextBlock1();
								break;

							case 'shared':
								if ( info.section.type == 'main' )
									info.throwError( { error: 'shared_error' }, true );
								while( true )
								{
									info.extractNextWord();
									if ( info.type != 'variable' )
										info.throwError( { error: 'syntax_error' } );
									var variable = info.getVariable( 2, INFO.GETVARIABLEFLAG_SHARED | INFO.GETVARIABLEFLAG_NOPARAMETERS );
									variable.variable.shared = true;
									variable.variable.global = true;
									info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord();
								}								
								break;

							case 'global':
								while(true)
								{
									info.extractNextWord();
									if ( info.type != 'variable' )
									{
										if ( info.type == 'procedure' )
											info.throwError( { error: 'name_conflict_between_variable_and_procedure', parameter: info.text }, true );
										else if ( info.type == 'string' )
										{
											info.section.globalFilter = info.text;
											for ( var v in info.section.variables )
											{
												if ( utilities.isWildCard( info.section.variables[ v ].nameReal, info.text ) )
													info.section.variables[ v ].global = true;
											}
											break;
										}
										else
										info.throwError( { error: 'syntax_error' }, true );
									}
									var variable = info.getVariable( 1, INFO.GETVARIABLEFLAG_GLOBAL | INFO.GETVARIABLEFLAG_NOPARAMETERS );
									variable.variable.global = true;
									if ( !info.rootSection.globals[ variable.variable.token ] )
										info.rootSection.globals[ variable.variable.token ] = variable.variable;
									info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord();
								}
								break;

							case 'rol':
							case 'ror':
								info.extractNextWord();
								if ( info.text != '.' )
									throw 'syntax_error';
								info.extractNextWord();
								if ( 'bwl'.indexOf( info.textLower ) < 0 )
									throw 'syntax_error';
								var e = info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_SKIPNEXTTOKEN );
								if ( e.type != '0' && e.type != '1' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ',' )
									info.throwError ( { error: 'syntax_error' } );
								info.extractNextWord();
								if ( info.type != 'variable' )
									info.throwError( { error: 'syntax_error' } );
								var v = info.getVariable( 1, INFO.GETVARIABLEFLAG_INPUT );
								if ( v.variable.type != '0' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.nextBlock1();
								break;

							case 'palette':
							case 'default palette':
								info.waitingFunctionCount = 0;
								while ( true )
								{
									var ret = info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_SKIPNEXTTOKEN  );
									if ( ( ret.end & ( INFO.EXPFLAG_ENDOFINSTRUCTION | INFO.EXPFLAG_ENDONCOLON ) ) != 0 )
										break;
									if ( ( ret.end & INFO.EXPFLAG_ENDONCOMMA ) == 0 )
									{
										info.throwError( { error: 'syntax_error', parameter: '' }, true );
										break;
									}
									info.extractNextWord();		// Skip comma
								}
								info.nextBlock1();
								break;

							case 'fade':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONTO | INFO.EXPFLAG_ENDONCOLON  );
								if ( !info.checkTypes( info.returnType, '0' ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.peekNextWord();
								if ( info.textLower == 'to' )
								{								
									info.setNextWord();
									info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
									if ( !info.checkTypes( info.returnType, '0' ) )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									info.peekNextWord();
									if ( info.textLower == ',' )
									{								
										info.setNextWord();
										info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
										if ( !info.checkTypes( info.returnType, '0' ) )
											info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									}
								}
								else
								{
									while ( true )
									{
										info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
										if ( !info.checkTypes( info.returnType, '0' ) )
											info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
										info.peekNextWord();
										if ( info.text != ',' )
											break;
										info.setNextWord();
									}
								}
								info.nextBlock1();
								break;
	
							case 'set transparent':
							case 'stop transparent':
								info.peekNextWord();
								if ( !info.peekEndOfInstruction )
								{							
								info.waitingFunctionCount = 0;
								while ( true )
								{
									var ret = info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_SKIPNEXTTOKEN  );
									if ( ( ret.end & INFO.EXPFLAG_ENDOFINSTRUCTION ) != 0 )
										break;
									if ( ( ret.end & INFO.EXPFLAG_ENDONCOMMA ) == 0 )
									{
										info.throwError( { error: 'syntax_error', parameter: '' }, true );
										break;
									}
									info.extractNextWord();		// Skip comma
								}
								}
								info.nextBlock1();
								break;

							case 'gamepad map buttons':
							case 'gamepad map axes':
							case 'gamepad map triggers':
								info.waitingFunctionCount = 0;
								info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
								if ( !info.checkTypes( '2', info.returnType ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ',' )
									info.throwError( { error: 'syntax_error', parameter: info.text }, true );
								while ( true )
								{
									info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
									if ( !info.checkTypes( '0', info.returnType ) )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									end = info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord( end );
								}
								info.nextBlock1();
								break;

							case 'def fn':
								info.extractNextWord();
								if ( info.type != 'variable' )
									info.throwError( { error: 'syntax_error', parameter: info.text }, true );
								var variableInfo = info.getVariableInfo( info.text, {} );
								var func = 
								{
									name: variableInfo.name,
									token: variableInfo.token,
									tokenCode: variableInfo.tokenCode,
									nameReal: variableInfo.nameReal,
									nameRealLower: variableInfo.nameReal.toLowerCase(),
									type: variableInfo.type,
									parameters: [],
									values: null
								};
								var end = info.peekNextWord();
								if ( info.text == '(' )
								{		
									info.setNextWord( end );							
									do
									{
										info.skipSpaces();
										info.extractNextWord();
										if ( info.type != 'variable' )
											info.throwError( { error: 'syntax_error', parameter: info.text }, true );
										var vInfo = info.getVariableInfo( info.text, {} );
										func.parameters.push( vInfo );
										info.extractNextWord();
										if ( info.text == ')' )
											break;
										if ( info.text != ',' )
											info.throwError( { error: 'syntax_error', parameter: info.text }, true );
									} while( true );
								}
								info.extractNextWord();
								if ( info.text != '=' )
									info.throwError( { error: 'syntax_error', parameter: info.text }, true );

								var code = '';
								while( true )
								{
									info.extractNextWord();
									if ( info.type == 'remark' || info.endOfInstruction || info.endOfLine || info.endOfText || info.text == ':' )
										break;
									
									var done = false;
									if ( info.type == 'variable' )
									{
										var vInfo = info.getVariableInfo( info.text, {} );
										for ( var p = 0; p < func.parameters.length; p++ )
										{
											if ( vInfo.token == func.parameters[ p ].token )
											{
												code += '%' + p + '%';
												done = true;
												break;
											}
										}
									}
									if ( !done )
									{ 
										if ( info.type == 'string' )
											code += '"' + info.text + '"';
										else
											code += info.text;
									}
								};
								func.code = code;
								func.end = info.position;							
								info.section.defFunctions[ variableInfo.token ] = func;
								break;
							
							case 'channel':
								info.compileExpression( INFO.EXPFLAG_ENDONTO );
								if ( !info.checkTypes( info.returnType, '0' ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.textLower != 'to' )
									info.throwError( { error: 'syntax_error', parameter: info.text }, true );
	
								info.skipSpaces();
								var c = info.charAt( info.position );
								if ( info.getCharacterType( c ) != 'letter' )
									info.throwError( { error: 'syntax_error', parameter: '' }, true );

								var lineTokens = info.getLineTokens();
								var type = lineTokens[ 0 ].text;
								if ( type != 'screen' && type != 'bob' && type != 'sprite' && type != 'actor' && type != 'rainbow' && type != 'channel' )
									info.throwError( { error: 'syntax_error', parameter: type } );
								info.setPosition( lineTokens[ 0 ].position );
								if ( lineTokens.length > 0 )
								{
									var pos = lineTokens[ 1 ].text.indexOf( '_' );
									if ( pos > 0 )
									{
										if ( info.getCharacterType( lineTokens[ 1 ].text.substring( 0, 1 ) ) == 'letter' )
										{
											type = lineTokens[ 1 ].text;
											info.setPosition( lineTokens[ 1 ].position );
										}
									}			
								}

								info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
								if ( !info.checkTypes( info.returnType, '0' ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.nextBlock1();
								break;

							case 'break if':
								info.waitingFunctionCount = 0;
								var start = info.position;
								info.compileExpression( INFO.EXPFLAG_COMPARAISON | INFO.EXPFLAG_ENDONBRACKET );
								if ( !info.checkTypes( info.returnType, '0' ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.nextBlock1();
								break;
							
							case 'clapfin':
							case 'end':
							case 'edit':
							case 'direct':
								info.nextBlock1( true );
								break;

							case 'trap':
								info.nextBlock1( true );
								continue;

							case 'inc':
							case 'dec':
								info.extractNextWord();
								if ( info.type != 'variable' )
									info.throwError( { error: 'syntax_error', parameter: info.text }, true );
								info.getVariable( 0, INFO.GETVARIABLEFLAG_INC );
								if ( info.returnType == '2' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.nextBlock1();
								break;

							case 'add':
								info.extractNextWord();
								if ( info.type != 'variable' )
									info.throwError( { error: 'syntax_error' }, true );
								info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT );
									if ( info.returnType == '2' )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								info.extractNextWord();
								if ( info.text != ',' )
									info.throwError( { error: 'syntax_error' }, true );
								info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
								if ( !info.checkTypes( '0', info.returnType ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								var end = info.peekNextWord();
								if ( info.text == ',' )
								{
									info.setNextWord( end );
									info.compileExpression( INFO.EXPFLAG_ENDONTO );
									if ( !info.checkTypes( '0', info.returnType ) )
										info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
									var start = info.result;
									info.extractNextWord();
									if ( info.textLower != 'to' )
										info.throwError( { error: 'syntax_error', parameter: info.text }, true );
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
								}
								info.nextBlock1();
								break;

							case 'include':
								info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
								if ( !info.checkTypes( '2', info.returnType ) )
									info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
								break;

							case "__cdebug":
								info.extractNextWord();
								if ( info.text == '1' )
								{
									info.__cDebugStop = true;
									debugger;
								}
								break;

							case 'super':
								if ( section.className != 'method' )
									info.throwError( { error: 'syntax_error', parameter: info.className } );
								pass1Object( info, section.parentSection, { isSuper: true } );
								break

							case 'polyline':
							case 'polygon':
							case 'filled polygon':
								end = info.peekNextWord();
								if ( info.textLower == 'to' )
									info.setNextWord( end );
							// Normal instruction. If On Error in the section, slow mode, one block per instruction.
							default:
								// If arrives on a bad token
								if ( token.params && token.params.length > 0 )
								{
									info.waitingFunctionCount = 0;
									// Reserved variable?
									if ( token.params[ 0 ].charAt( 0 ) == 'V' )
									{
										info.extractNextWord();
										if ( info.text == '(' )
										{
											while ( true )
											{
												info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONBRACKET | INFO.EXPFLAG_ENDONTO );
												info.extractNextWord();
												if ( info.text == ')' )
													break;
												if ( info.text != ',' && info.textLower != 'to' )
													info.throwError( { error: 'syntax_error', parameter: info.text }, true );
											}
											info.extractNextWord();
										}
										if ( info.text != '=' )
											info.throwError( { error: 'syntax_error', parameter: info.text } );
										info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
										info.nextBlock1();
										break;
									}
									else
									{
										// Normal token
										end = info.peekNextWord();
										while ( !info.peekEndOfInstruction )
										{
											info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONTO | INFO.EXPFLAG_ENDONCOLON );
											end = info.peekNextWord();
											if ( info.text != ',' && info.textLower != 'to' )
												break;
											info.setNextWord( end );
											end = info.peekNextWord();
										}
									}
								}
								else
								{
									info.throwError( { error: 'syntax_error', parameter: info.text } );
									info.gotoNextInstruction();
								}
								info.nextBlock1();
								break;
						}
						break;

					case 'variable':
						info.waitingFunctionCount = 0;
						var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_SETVALUE );
						var type = info.returnType;
						info.peekNextWord();
						if ( info.text != '=' )
						{
							if ( type != '3' )
								info.throwError( { error: previousTokenProcCount < 0 ? 'syntax_error' : 'procedure_not_found', parameter: '' }, true )
							if ( !variable.variable.classDefinition )
								info.throwError( { error: 'variable_should_be_initialized_to_class', parameter: variable.variable.nameReal } );
							position = info.position;
							end = info.peekNextWord( 'wantObjectMethodProperty2', { definition: variable.variable.classDefinition.definition, isSuper: false } );		
							if ( info.type == 'method' )			
							{
								info.setNextWord();
								definition = info.definition;
								info.extractNextWord();
								if ( info.text != '(' )
									info.throwError( { error: 'syntax_error' } );
								info.parseSyntax1( definition, { flags: INFO.EXPFLAG_ENDONBRACKET, isSuper: false } )
							}
							else if ( info.type == 'property' )
							{
								var definition = variable.variable.classDefinition.definition;
								var friendDefinition = info.findFriend( info.text, variable.variable.classDefinition.definition.friendsList, info.options.section );
								info.setNextWord();
								while( friendDefinition )
								{
									if ( friendDefinition )
										definition = friendDefinition;
									info.peekNextWord();
									if ( info.text == '=' )
										break;
									friendDefinition = info.findFriend( info.text, variable.variable.classDefinition.definition.friendsList, info.options.section );
									if ( !friendDefinition )
									{
										info.peekNextWord( 'wantObjectMethodProperty2', { definition: definition, isSuper: false } );
										if ( info.type != 'property' )
											info.throwError( { error: 'syntax_error' } );
										info.setNextWord();
										break;
									}
									info.setNextWord();
								}
								while( true )
								{
									info.extractNextWord();
									if ( info.text != '=' )
										info.throwError( { error: 'syntax_error' } );
									info.blockToAdd = false;
									info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
									info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord();
									info.extractNextWord( 'wantObjectMethodProperty2', { definition: definition, isSuper: false } );
									if ( info.type != 'property' )
										info.throwError( { error: 'syntax_error' } );
								};
							}
							else
							{
								var friendDefinition = info.findFriend( info.text, variable.variable.classDefinition.definition.friendsList );
								if ( !friendDefinition )
									info.throwError( { error: 'class_not_found', parameter:  info.text } );
								info.setNextWord();
							}
							if ( info.addedBlock == 0 )
								info.nextBlock1();
						}
						else
						{
							info.setNextWord();
							info.assignToVariable( variable, 0 );
							if ( info.addedBlock == 0 )
								info.nextBlock1();
						}
						break;
					
					case 'class':
						pass1Object( info, info.definition );
						break;

					default:
						if ( info.text != ':' )
							info.throwError( { error: 'syntax_error', parameter: '' }, true );
						info.section.withCurrent = [];
						info.section.withCurrentDefinition = [];
						break;
				}
			}
		}
		catch( error )
		{
			if ( utilities.isObject( error ) )
			{
				var obj = info.findLineAndColumn( info.position );
				if ( error.stack )
				{
					var text = 'Pass: 1, crash at line ' + obj.line + ', column: ' + obj.column + '!\n' + error.message + '\n' + error.stack;
					messages.pushError( { compilerError: 'crash_error', file: options.currentSourcePath, parameter: text } );
				}
				else
				{
					info.throwError( error, true );
				}
			}
			return null;
		}
	}

	if ( info.section.pile.length > 1 )
	{
		for ( var l = 1; l < info.section.pile.length; l++ )
		{
			var loop = info.section.pile[ l ];
			var o = info.findLineAndColumn( loop.position );
			switch( loop.type )
			{
				case 'for':
					messages.pushError( { error: 'for_without_next', file: options.currentSourcePath, line: o.line, column: o.column } );
					break;
				case 'while':
					messages.pushError( { error: 'while_without_wend', file: options.currentSourcePath, line: o.line, column: o.column } );
					break;
				case 'do':
					messages.pushError( { error: 'do_without_loop', file: options.currentSourcePath, line: o.line, column: o.column } );
					break;
				case 'repeat':
					messages.pushError( { error: 'repeat_without_until', file: options.currentSourcePath, line: o.line, column: o.column } );
					break;
			}
		}
	}
	if ( info.section.pileIfs.length > 1 )
	{
		// Check that there was not a If / Then on the last line...
		for ( var p = info.section.pileIfs.length - 1; p > 0; p-- )
		{
			var ifs = info.section.pileIfs[ p ];
			if ( ifs && ifs.then )
			{
				info.nextBlock1( true );
				ifs.endIfBlock = info.blockNumber;
				info.section.pileIfs.pop();
			}
		}

		// Still errors?
		for ( var l = 1; l < info.section.pileIfs.length; l++ )
		{
			var line = info.section.pileIfs[ l ];
			var o = info.findLineAndColumn( line.position );
			messages.pushError( { error: 'if_without_endif', file: options.currentSourcePath, line: o.line, column: o.column } );
		}
	}

	// If module, add one block (safety)
	info.nextBlock1( true );
	if ( options.isModule )
		info.nextBlock1( true );
/*
	var count = 0;
	for ( l = 0; l < info.section.blockPlus.length; l++ )
	{
		var plus = info.section.blockPlus[ l ];
		if ( typeof plus == 'undefined' )
			plus = 0;
		info.section.blockPlus[ l ] = count;
		count += plus
	}
	return info;

	function addBlock()
	{
		info.section.blockPlus[ info.blockNumber++ ] = 1;
		info.forceNew
	}
*/
}
function pass1Object( info, definition, opts )
{
	opts = typeof opts == 'undefined' ? {} : opts;

	// If first parameter is a string-> name
	var name = '';
	end = info.peekNextWord();
	if ( info.type == 'string' )
	{
		name = info.text;
		info.setPosition( end );
		info.peekNextWord();
		if ( info.text == ',' )
			info.setNextWord();								
	}

	// Look for the name of a method or a property
	position = info.position;
	end = info.peekNextWord( 'wantObjectMethodProperty2', { definition: definition, isSuper: opts.isSuper } );		
	if ( info.type == 'method' )			
	{
		definition = info.definition;
		if ( !name )
		{
			info.setPosition( end );
			end = info.peekNextWord();
			if ( info.type == 'string' )
			{
				name = info.text;
				info.setPosition( end );
				info.peekNextWord();
				if ( info.text == ',' )
					info.setNextWord();
				else if ( !info.endOfInstruction )
					info.throwError( { error: 'syntax_error', parameter: '' }, true );
			}
		}
		else
			info.setPosition( end );
		info.parseSyntax1( definition, { isSuper: opts.isSuper } )
	}
	else 
	{
		info.setPosition( position );
		info.parseSyntax1( definition, {} )
	}
	info.checkExtends( definition );
	if ( info.addedBlock == 0 )
		info.nextBlock1();
}
function pass2Object( info, definition, opts )
{
	opts = typeof opts == 'undefined' ? {} : opts;

	// If first parameter is a string-> name
	var name = ''; 					
	end = info.peekNextWord();
	if ( info.type == 'string' )
	{
		name = '"' + info.text + '"';
		info.setPosition( end );
		info.peekNextWord();
		if ( info.text == ',' )
			info.setNextWord();
	}

	// Look for the name of a method or a property
	var className = info.currentObject.name;
	var position = info.position;
	end = info.peekNextWord( 'wantObjectMethodProperty2', { definition: definition, isSuper: opts.isSuper } );		
	if ( info.type == 'method' )			
	{
		definition = info.definition;
		if ( !name )
		{
			info.setPosition( end );
			end = info.peekNextWord();
			if ( info.type == 'string' )
			{
				name = '"' + info.text + '"';
				info.setPosition( end );
				info.peekNextWord();
				if ( info.text == ',' )
					info.setNextWord();
				else if ( !info.endOfInstruction )
					info.throwError( { error: 'syntax_error', parameter: '' }, true );
			}
		}
		else
		{
			info.setPosition( end );
		}
		if ( !name )
			name = '"' + definition.nameReal + '_" + aoz.instanceCount++';
		info.parseSyntax2( info.section.anchors[ info.position ], { methodCall: true, name: name, noQuotesOnName: true, class: className, isSuper: opts.isSuper } );
	}
	else 
	{
		info.setPosition( position );

		// Create/Change the object
		if ( !name )
			name = '"' + definition.nameReal + '_" + aoz.instanceCount++';
		info.parseSyntax2( info.section.anchors[ info.position ], { objectCall: true, noQuotesOnName: true, name: name } );
	}
	if ( info.addedBlock == 0 )
		info.nextBlock1();
}

// Second pass!
function secondPass( start, end, section, info, options, caseSensitive )
{
	var sectionName = 'application';
	if ( section.nameReal )
		sectionName = section.nameReal;
	messages.print( messages.VERBOSE_DEV3, 'second_pass', [ section.type, sectionName ] );

	info.setPass( start, end, 0, section, 2, caseSensitive );
	info.section.javascriptHeader = [];
	info.currentBlock = '';
	info.flagThen = 0;
	info.debug_addWatch = '';
	info.options = options;

	// Generate code
	var previousPosition;
	var javascript = 0;
	var code = '';
	var previousSourceLine = '';
	info.section.instructionCount = 0;
	info.previousToken = null;
	info.__cDebugStop = false;
	while( !info.endOfText && !info.break )
	{
		try
		{
			// End of a if/then
			while ( info.flagThen )
			{
				info.nextBlock2( true );
				info.flagThen--;
			}
			var sourceLine = { text: '// ' + utilities.trimString( info.getCurrentLine() ), line: info.lines[ info.currentLine ] };

			var checkLabel = true;
			var quit = false;
			while( !quit )
			{
				// Store position in source
				info.skipSpaces();
				info.storeSourceReference();

				// Get next token
				info.previousToken = info.token;
				previousPosition = info.position;
				info.extractNextWord( undefined, 
				{ 
					noObjects: false
				} );

				// A remark?
				if ( info.type == 'remark' )
				{
					info.skipRemark();
					continue;
				}

				// End of source?
				if ( info.endOfLine )
				{
					info.nextLine();
					info.section.withCurrent = [];
					info.section.withCurrentDefinition = [];
					break;
				}

				// Insert Javascript code... eventually!
				if ( info.text == '{' )
				{
					info.addSourceReference();

					var javascript = info.getJavascript( { tags: section.tags } );

					// If NOT in an instruction or function with inline code, insert!
					if ( info.section.main )
					{
						info.unIndent();
						for ( var l = 0; l < javascript.length; l++ )
							info.addLine( javascript[ l ] );
						info.nextBlock2();
						info.indent();
						done = true;
					}
					else if ( ( info.section.type != 'instruction' && info.section.type != 'function' ) || !info.section.codeInline )
					{
						if ( info.isBasic )
						{
							info.unIndent();
							for ( var l = 0; l < javascript.length; l++ )
								info.addLine( javascript[ l ] );
							info.indent();
							done = true;
						}
						else
						{
							info.section.javascriptHeader = javascript;
							done = true;
						}
					}
					continue;
				}

				// We are in Basic!
				info.isBasic = true;
				info.updateSourceReference();

				// Include sourcecode
				if ( info.options.includeSource )
				{
					if ( sourceLine != previousSourceLine )
					{
					info.sourceLine = sourceLine;
						previousSourceLine = sourceLine;
					}
				}
				if ( info.options.debug_addWatch )
					info.debug_addWatch = info.options.debug_addWatch;
				info.section.instructionCount++;

				// Look for a label
				if ( checkLabel && ( info.type == 'variable' || info.type == 'number' ) )
				{
					if ( ( info.type == 'variable' && info.charAt( info.position ) == ':' ) || info.type == 'number' )
					{
						info.position++;
						if ( !info.section.labels[ info.textLower ] )
							info.throwError( { error: 'internal_error', parameter: '' }, true );
						if ( info.caseSensitive && info.section.labels[ info.textLower ].nameReal != info.text )							
							info.throwError( { error: 'internal_error', parameter: '' }, true );
						info.options.label = true;
						if ( info.addedBlock == 0 )
							info.nextBlock2( true );
						checkLabel = false;
						continue;
					}
				}
				checkLabel = false;

				if ( info.type == 'globalObject' )
				{
					/*
					var module = info.module;

					// Look for method in the friend classes
					info.extractNextWord( 'wantMethod', { currentObject: module } );
								if ( info.type == 'method' )
					{
						var anchor = info.section.anchors[ info.position ];
						info.parseSyntax2( anchor, { addIndex: true, methodParent: module } );
						if ( info.addBlock )
							info.nextBlock2();
						continue;
						}
					else if ( info.type == 'property' && info.textLower == 'set' )
					{
						var type = info.returnType;
						var property = info.property;
						var definition = info.definition;

						// Index
						info.waitingFunctionCount = 0;
						var exp1 = info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
						info.extractNextWord();

						// Value
						var exp2 = info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
						info.addLine( 'aoz.setObjectProperty(aoz.get' + module.objectName + '(' + exp1.code + '),"' + property + '",' + exp2.code + ');' );						
						continue;
							}
					*/
					// Back to a normal instruction
					info.setPosition( previousPosition );
					info.extractNextWord();
				}

				// A GOTO embedded after THEN or ELSE?
				if ( info.type == 'number' && info.previousToken )
				{
					if ( info.previousToken.token == 'then' || info.previousToken.token == 'else' )
					{
						var label = info.section.labels[ info.textLower ];
						if ( label )
						{
							info.token = { name: "Goto", token: "goto", params: [ ], compile: '#function handleGoto' };
							info.type = 'token';
							info.position = previousPosition;
						}
					}
				}
				info.addedBlock = 0;
				if ( info.__cDebugStop )
					debugger;
				switch ( info.type )
				{
					// A compilation tag?
					case 'tag':
						info.getTag( info.tags );
						break;

					// An procedure, instruction or method?
					case 'procedure':
					case 'instruction':
					case 'method':
						info.parseSyntax2( info.section.anchors[ info.position ] );
						break;

					// A function?
					case 'function':
						info.throwError( { error: 'syntax_error', parameter: info.getExpressionErrorParameter() }, true );

					// An extra-token?
					case 'extraToken':
						info.addLine( '' );
						info.extraTokenFunction.call( this, info, undefined, info.textLower );
						break;

					// A method of an object, with with?
					case 'objectMethod':
						info.parseSyntax2( info.section.anchors[ info.position ], { skipIndex: false, methodParent: info.getWith() } );
						break;
					
					// A property of an object, with with?
					case 'objectProperty':
						info.addLine( 'this.nextError="object_or_property_not_found"' );
						var t = info.text.substring( 0, 1 ).toLowerCase() + info.text.substring( 1 );
						code = info.getWith() + '.set_' + t + '(';
						info.extractNextWord();			// Skip '='
						var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOLUMN );
						code += exp.code + ',true);';
						info.addLine( code );
						info.addLine( 'this.nextError=null' );
						info.nextBlock2();
						break;

					// An object?
					case 'class':
						var definition = info.definition;
						pass2Object( info, definition, { isSuper: false } );
						break;

					// A sub-class?
					case 'objectClass':
						info.addLine( '' );
						info.section.withCurrent.push( info.className.toLowerCase() );
						info.section.withCurrentDefinition.push( info.className.toLowerCase() );
						info.extractNextWord();
						while( true )
						{
							info.peekNextWord( 'wantObjectMethodProperty', { currentObject: info.section.withCurrentDefinition[  info.section.withCurrentDefinition.length - 1 ] } );
							if ( info.type != 'class' )
								break;								
							info.setNextWord();

							// An index?
							info.peekNextWord();
							if ( info.text == '(' )
							{
								info.setNextWord();
								var exp = info.compileExpression( INFO.EXPFLAG_ENDONBRACKET );
								info.section.withCurrent.push( info.className + '.getObject(' + exp.code + ')' );
								info.section.withCurrentDefinition.push( info.className + '.getObject(' + exp.code + ')' );
								info.extractNextWord();
							}
							else
							{
								info.section.withCurrent.push( info.className );
								info.section.withCurrentDefinition.push( info.className );
							}
							info.peekNextWord();
							if ( info.text != '.' )
								break;
							info.setNextWord();
						}
						break;
						
					// A variable?
					case 'variable':
						info.addSourceReference();
						info.waitingFunctionCount = 0;
						var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_SETVALUE );
						var type = info.returnType;
						info.peekNextWord();
						if ( info.text != '=' )
						{
							if ( type != '3' )
								info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
							if ( !variable.variable.classDefinition )
								info.throwError( { error: 'variable_should_be_initialized_to_class', parameter: variable.variable.nameReal } );
							info.property = '';
							end = info.peekNextWord( 'wantObjectMethodProperty2', { definition: variable.variable.classDefinition.definition, isSuper: false } );		
							var token = info.property;
							if ( info.type == 'method' )			
							{
								info.setNextWord();
								info.extractNextWord();
								info.parseSyntax2( section.anchors[ info.position ], { flags: INFO.EXPFLAG_ENDONBRACKET, isSuper: false, methodCall: true, noQuotesOnName: true, name: variable.code, nameIsObject: true, class: variable.variable.classDefinition.definition.name } )
								if ( info.addedBlock == 0 )
									info.nextBlock2();
							}
							else if ( info.type == 'property' )
							{
								var definition = info.definition;
								var definitions = [ definition ];
								var friendDefinition = info.findFriend( info.text, variable.variable.classDefinition.definition.friendsList, info.options.section );
								info.setNextWord();
								while( friendDefinition )
								{
									if ( friendDefinition )
										definition = friendDefinition;
									info.peekNextWord();
									if ( info.text == '=' )
										break;
									friendDefinition = info.findFriend( info.text, variable.variable.classDefinition.definition.friendsList, info.options.section );
									if ( !friendDefinition )
									{
										info.peekNextWord( 'wantObjectMethodProperty2', { definition: definition, isSuper: false } );
										if ( info.type != 'property' )
											info.throwError( { error: 'syntax_error' } );
										definitions.push( info.definition );
										info.setNextWord();
										break;
									}
									definitions.push( definition );
									info.setNextWord();
								} 
								var codeVariable = variable.code;
								// Gros patch affreux. Pour la v2!
								var p = codeVariable.indexOf( '_array.setValue');
								if ( p >= 0 )
								{
									codeVariable = codeVariable.substring( 0, p ) + '_array.getValue' + codeVariable.substring( p + 15 );
									p = codeVariable.indexOf( ',%VALUE' );
									codeVariable = codeVariable.substring( 0, p ) + codeVariable.substring( p + 7 );
								}
								var addedModified = false;
								var viaUpdate = false;
								while( true )
								{
									info.extractNextWord();
									if ( info.text != '=' )
										info.throwError( { error: 'syntax_error' } );
									info.blockToAdd = false;
									var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
									for ( var d = 0; d < definitions.length; d++ )
									{
										var t = token;
										if ( d > 0 )
											t = definitions[ d ].tokenCode ? definitions[ d ].tokenCode : token;
										viaUpdate = definitions[ d ].methods ? definitions[ d ].methods[ 'update' ] != undefined : false;
										if ( viaUpdate )
										{
											if ( !addedModified )
											{
												info.addLine( 'var varsModified={};' );
												addedModified = true;
											}
											info.addLine( 'varsModified["' + t + '"]=' + exp.code + ';' );
										}
										else
										{
											info.addLine( codeVariable + '.vars.' + t + '=' + exp.code + ';' );
										}
									}
									info.peekNextWord();
									if ( info.text != ',' )
										break;
									info.setNextWord();
									info.extractNextWord( 'wantObjectMethodProperty2', { definition: variable.variable.classDefinition.definition, isSuper: false } );
									if ( info.type != 'property' )
										info.throwError( { error: 'syntax_error' } );
									definitions[ 0 ] = info.definition;
									token = info.property;
								};
								if ( viaUpdate )
									info.addLine( 'aoz.updateObject(' + codeVariable + ',varsModified);' );
								if ( info.addedBlock == 0 )
									info.nextBlock2();
							}
							else
							{
								var found = false;
								var friendsList = variable.variable.classDefinition.definition.friendsList;
								for ( var f = 0; f < friendsList.length; f++ )
								{
									if ( friendsList[ f ].toLowerCase() == info.textLower )
									{
										found = true;
										break;
									}
								}
								if ( !found )
									info.throwError( { error: 'class_not_found', parameter:  info.text } );
								info.setNextWord();
							}
						}
						else
						{
							info.setNextWord();
							var code = info.assignToVariable( variable, 0 );
							info.addLine( code );
							if ( info.addedBlock == 0 )
								info.nextBlock2();
						}
						break;

					// An instruction?
					case 'token':
						var token = info.token;
						switch ( token.token )
						{
							case 'function':
							case 'procedure':
							case 'instruction':
							case 'class':
							case 'method':
								var definition = info.anchors[ info.position ];
								info.setCurrentLine( definition.end + 1 );
								quit = true;
								break;

							case 'trap':
								info.addLine( 'this.trapPosition=this.position;' );
								info.nextBlock2( true );
								continue;

							case 'pop proc':
							case 'pop procedure':
								info.waitingFunctionCount = 0;
								end = info.peekNextWord();
								if ( info.text == '[' )
								{
									info.setNextWord( end );
									info.compileExpression( INFO.EXPFLAG_ENDONSQUAREBRACKET );
									var code;
									if ( info.returnType == '2' )
										code = 'this.parent.procParam$=';
									else
										code = 'this.parent.procParam=';
									info.addLine( code + info.result + ';' );
									info.addLine( 'this.parent.results[this.currentResult]=' + info.result + ';' );
									end = info.extractNextWord();
								}
								quit = true;
								info.addLine( 'return{type:0};' );
								info.nextBlock2( true );
								break;
		
							case 'end proc':
							case 'end procedure':
								info.waitingFunctionCount = 0;
								end = info.peekNextWord();
								if ( info.text == '[' )
								{
									info.setNextWord( end );
									info.compileExpression( INFO.EXPFLAG_ENDONSQUAREBRACKET );
									var code;
									if ( info.returnType == '2' )
										code = 'this.parent.procParam$=';
									else
										code = 'this.parent.procParam=';
									info.addLine( code + info.result + ';' );
									info.addLine( 'this.parent.results[this.currentResult]=' + info.result + ';' );
									end = info.extractNextWord();
								}
								quit = true;
								info.addLine( 'return{type:0};' );
								info.nextBlock2( true );
								break;

							// Do nothing
							case 'end class':
							case 'end instruction':
								specialCases.handleClapFin( info );
								break;								

							case 'end function':
							case 'end method':
								var definition = info.section.parent.anchors[ info.position ];
								info.extractNextWord();		// Skip bracket
								if ( info.text == '(' )
								{
									if ( definition.codeInlineReturn && token.token == 'end method' )
									{
										// Skip accolade
										info.extractNextWord();
	
										// Copy the content of the line
										var text = info.getJavascript( { tags: section.tags, noHeader: true, trim: true } )[ 0 ];
										for ( var p = 0; p < definition.syntax.length; p++ )
											text = utilities.replaceParameter( text, '%' + definition.syntax[ p ].name, definition.syntax[ p ].name );	
										text = utilities.replaceParameter( text, ',undefined)', ')' );
										if ( !definition.methodInLine )
										{
											info.addLine( 'var parent=this.parent;')
											info.addLine( 'while(parent)')
											info.addLine( '{' );
											info.addLine( '\tparent.results[this.currentResult]=' + text + ';' );
											info.addLine( '\tparent=parent.parent;')
											info.addLine( '}' );
											info.addLine( 'return{type:0}', true );
										}
										else
										{
											info.nextBlock2( true );
											info.addLine( 'return{type:0}', true ); 
										}
									}
									else
									{
										// Poke the result in current expression
										info.compileExpression( INFO.EXPFLAG_ENDONBRACKET );
										info.addLine( 'var parent=this.parent;')
										info.addLine( 'while(parent)')
										info.addLine( '{' );
										info.addLine( '\tparent.results[this.currentResult]=' + info.result + ';' );
										info.addLine( '\tparent=parent.parent;')
										info.addLine( '}' );
										info.addLine( 'return{type:0}', true );
										info.extractNextWord();			// Skip )
									}
								}
								else
								{
									info.addLine( 'return{type:0}', true );
								}
								info.nextBlock2( true );
								quit = true;
								break;

							case '__cdebug':
								info.extractNextWord();
								if ( info.text == '2' )
								{
									info.__cDebugStop = true;
									debugger;
								}
								break;

							default:
								// A normal token
								if ( typeof token.compile == 'undefined' )
									info.warning( 'instruction_not_implemented' );

								// Call the compilation
								if ( typeof token.compile == 'string' && token.compile.indexOf( '#function' ) == 0 )
								{
									var func = token.compile.substring( 10 );
									quit = specialCases[ func ]( info );
								}
								else
								{
									// Must be a normal instruction
									var isInstruction = false;
									var isVariable = false;
									var foundSyntax = '';
									for ( var t = 0; t < token.params.length; t++ )
									{
										if ( token.params[ t ].charAt( 0 ) == 'I' )
										{
											isInstruction = true;
											foundSyntax = 'I';
											break;
										}
										if ( token.params[ t ].charAt( 0 ) == 'V' )
										{
											isVariable = true;
											foundSyntax = 'V' + token.params[ t ].charAt( 1 );
											break;
										}
									}
									if ( !isInstruction && !isVariable )
										info.warning( 'instruction_not_implemented' );

									// Add line numbers
									info.addSourceReference();

									// Extract the parameters
									var params = 0, numberOfParams = 0;
									var isReservedVariable = 0;
									var parameters = [];
									var positions = [];
									end = info.peekNextWord();
									if ( info.text == '(' )
									{
										if ( isVariable )
											info.setNextWord( end );
									}
									else if ( isVariable )
									{
										info.peekEndOfInstruction = true;
									}
									if ( !info.peekEndOfInstruction )
									{
										while( true )
										{
											positions[ foundSyntax.length ] = info.position;
											info.compileExpression( ( isVariable ? INFO.EXPFLAG_ENDONBRACKET : 0 ) | INFO.EXPFLAG_ENDONTO | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
											parameters[ params ] = info.result;
											switch( info.returnType )
											{
												case '0':
												case '1':
													foundSyntax += '0';
													break;
												case '2':
													foundSyntax += '2';
													break;
												case '?':
													foundSyntax += '?';
													break;
											}

											end = info.peekNextWord();
											if ( info.peekEndOfInstruction )
											{
												numberOfParams = params + 1;
												break;
											}
											if ( info.text == ')' )
											{
												numberOfParams = params + 1;
												if ( !isVariable )
													info.throwError( { error: 'syntax_error' }, true );
												info.setNextWord( end );
												break;
											}
											if ( info.text.toLowerCase() == 'to' )
												foundSyntax += 't';
											else
												foundSyntax += ',';
											info.setNextWord( end );
											params++;
										}
									}
									var found = false;
									var paramNumber = 0;
									for ( var s = 0; s < token.params.length; s++ )
									{
										var syntax = token.params[ s ];
										if ( foundSyntax.length == syntax.length )
										{
											if ( foundSyntax == syntax )
											{
												found = true;
												break;
											}
											for ( var p = 1; p < foundSyntax.length; p++ )
											{
												if ( foundSyntax.charAt( p ) == '?' )
												{
													foundSyntax = syntax.substring( 0, p ) + syntax.charAt( p ) + syntax.substring( p + 1 );
												}
												else if ( syntax.charAt( p ) >= 'A' && syntax.charAt( p ) <= 'C' )
												{
													foundSyntax = foundSyntax.substring( 0, p ) + syntax.charAt( p ) + foundSyntax.substring( p + 1 );
													isReservedVariable = p;
												}
											}
											var paramNumber = 0;
											for ( var p = 1; p < syntax.length; p++ )
											{
												var foundChar = foundSyntax.charAt( p );
												var char = syntax.charAt( p );
												if ( foundChar != char )
												{
													if ( char == '3' )
													{
																parameters[ paramNumber ] = '(' + parameters[ paramNumber ] + ')*aoz.degreeRadian';
													}
													else if ( char != '?' )
													{
														if ( info.getCharacterType( char ) == 'number')
															info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
														else
															info.throwError( { error: 'syntax_error' }, true );
													}
												}
												if ( char == ',' || char == 't' )
													paramNumber++;
											}
											if ( p >= syntax.length )
											{
												found = true;
												break;
											}
										}
									}
									if ( !found )
										info.throwError( { error:  'syntax_error' }, true );

									// Generates the code
									var code = token.compile[ s ];
									if ( code != '' )
									{
										if ( isVariable )
										{
											info.extractNextWord();
											if ( info.text != '=' )
												info.throwError( { error: 'syntax_error' }, true );
											var type = token.token.indexOf( '$' ) >= 0 ? '2' : '0';
											info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONBRACKET | INFO.EXPFLAG_ENDONCOLON );
											if ( !info.checkTypes( type, info.returnType ) )
												info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
											if ( ! isReservedVariable )
											{
												code = utilities.replaceStringInText( code, '%$PV', 'set' );
												code = utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? info.result : info.result + ',' );
												code = utilities.replaceStringInText( code, '%$P;', ';' );
											}
											else
											{
												var save = info.position;
												var saveResult = info.result;
												info.setPosition( positions[ isReservedVariable ] );
												info.extractNextWord();
														var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT );
												info.position = save;
												code = utilities.replaceStringInText( code, '%$PV', 'set' );
														code = utilities.replaceStringInText( code, '%$P1', variable.code );
												code = utilities.replaceStringInText( code, '%$PP', numberOfParams == 0 ? saveResult : saveResult + ',' );
												code = utilities.replaceStringInText( code, '%$P;', ';' );
											}
										}
										for ( var p = numberOfParams - 1; p >= 0; p-- )
										{
											code = utilities.replaceStringInText( code, '%$P' + ( p + 1 ), parameters[ p ] );
										}
										info.addLine( code );
										info.nextBlock2();
									}
									break;
								}
								break;
						}
						break;

					default:
						break;
				}
			}
		}
		catch( error )
		{
			if ( utilities.isObject( error ) )
			{
				var obj = info.findLineAndColumn( info.position );
				if ( error.stack )
				{
					var text = 'Pass: 2, crash at line ' + obj.line + ', column: ' + obj.column + '!\n' + error.message + '\n' + error.stack;
					messages.pushError( { compilerError: 'crash_error', file: options.currentSourcePath, parameter: text } );
				}
				else
				{
					info.throwError( error, true );
				}
			}
			return;
		}
	}

	// Add the tags
	if ( info.tags[ 'addToFilesystem' ] )
	{
		for ( var file in info.tags[ 'addToFilesystem' ] )
		{
			if ( file.indexOf( '%' ) > 0 )
				info.throwError( { error: 'tag_parameter_must_be_constant' } );
			else
			{
				filesystem.addToFilesystem( file, options );
			}
		}
	}

	// Finish last block
	info.sourceLine = undefined;
	info.sourcePos = '';
	if ( info.currentBlock != '' )
		info.nextBlock2();

	// If module, add one block (safety)
	//if ( options.isModule )
	//{
	//	info.addLine( 'return{type:0}', true );
	//	info.nextBlock2();
	//}
};

function addInstruction( info, parentSection, objectType, sectionTemplate, tab )
{
	var startPosition = info.position;
	info.extractNextWord( 'wantFunctionDesignation' );
	if ( info.type != 'functionDesignation' )
		info.throwError( { error: 'syntax_error' }, true );
	var nameReal  = info.text;

	// Check the validity of the name
	if ( !( info.options.isModule || info.options.isExtension ) )
	{
		var error = info.checkVariableName( nameReal );
		if ( error )
			info.throwError( { error: 'object_name_conflict', parameter: [ error.type, error.name ] }, true );
	}

	// New Section!
	var objectOpen = utilities.copyObject( sectionTemplate )
	objectOpen.name = utilities.replaceSpacesByUnderscores( nameReal ).toLowerCase();
	objectOpen.type = objectType;
	objectOpen.parentSection = parentSection;
	var parentArray = parentSection[ objectType + 's' ];		// Thank you Javascript! :)
	objectOpen.number = parentArray.length;
	objectOpen.prefix = objectType.toLowerCase().substring( 0, 1 ) + '_';
	objectOpen.postfix = '_' + objectType.toLowerCase().substring( 0, 1 );
	objectOpen.startLine = info.currentLine;
	objectOpen.nameReal = nameReal;
	objectOpen.position = startPosition;
	var variableTokens = Array.from( info.variableTokens );

	// Get the unified syntax
	objectOpen.syntax = info.parseSyntax0( objectType );

	// Look for inline code on next lines
	info.nextLine( tab );
	objectOpen.startPass = info.currentLine;
	var end = info.peekNextWord();
	if ( info.text == '{' )
	{
		info.setNextWord( end );
		info.className = null;
		objectOpen.codeInline = info.getJavascript( { noHeader: true, trim: true, tags: objectOpen.tags } );
		objectOpen.waiting = info.waiting;
		objectOpen.noDefaults = info.noDefaults;
	}
	objectOpen.className = objectType;
	if ( !parentArray[ objectOpen.name ] )
	{
		parentArray[ objectOpen.name ] =
		{
			name: objectOpen.name,
			nameReal: nameReal,
			nameRealLower: nameReal.toLowerCase(),
			className: objectOpen.className,
			type: objectType,
			anchors: {},
			variants: [],
			parentSection: parentSection,
			variableTokens: variableTokens
		}
	}
	else
	{
		if ( !utilities.compareArrays( parentArray[ objectOpen.name ].variableTokens, variableTokens ) )
		{
			info.throwError( { error: 'syntax_error' }, true );
		}
	}
	objectOpen.parent = parentArray[ objectOpen.name ];
	objectOpen.parent.tags = objectOpen.tags;
	info.anchors[ startPosition ] = objectOpen;
	parentArray[ objectOpen.name ].anchors[ startPosition ] = objectOpen;
	parentArray[ objectOpen.name ].variants.push( objectOpen );
	return objectOpen;
};
function closeObjectOrInstruction( info, objectOpen )
{
	objectOpen.end = info.currentLine;
	objectOpen.endPass = info.currentLine + 1;
};

function addFunctionOrMethod( info, parentSection, functionType, sectionTemplate, tab )
{
	var startPosition = info.position;
	
	info.extractNextWord( 'wantFunctionDesignation' );
	if ( info.type != 'functionDesignation' )
		info.throwError( { error: 'syntax_error' }, true );
	var nameReal = info.text;
	var returnType = info.returnType;

	// Check the validity of the name
	if ( !( info.options.isModule || info.options.isExtension ) )
	{
		if ( functionType != 'method' )
		{
			var error = info.checkVariableName( nameReal );
			if ( error )
				info.throwError( { error: 'object_name_conflict', parameter: [ error.type, error.name ] }, true );
		}
	}

	// Look for "Extends"  or "FriendWith"
	var extendsList = [];
	var friendsList = [];
	if ( functionType == 'class' )
	{
		info.peekNextWord();
		if ( info.text == ',' )
		{
			var p = info.position;
			info.setNextWord();
			info.peekNextWord();
			if ( !( info.type == 'token' && info.token.token == 'extends' ) )
				info.setPosition( p );
		}
		var token = info.type == 'token' ? info.token.token : '';
		if ( token == 'extends' || token == 'friendwith' )
		{	
			do
			{
				info.setNextWord();
				info.extractNextWord(); 
				if ( token == 'extends' )
					extendsList.push( info.text );
				else
					friendsList.push( info.text );
				info.peekNextWord();
				if ( info.text == ',' )
				{
					var p = info.position;
					info.setNextWord();
					info.peekNextWord();
					token = info.type == 'token' ? info.token.token : '';
					if ( !( token == 'extends' || token == 'friendwith' ) )
					{
						info.setPosition( p );
						break;
					}
				}
			} while( !info.endOfLine )
		}
	}

	// New section!
	var functionOpen = utilities.copyObject( sectionTemplate );
	functionOpen.name = utilities.replaceSpacesByUnderscores( nameReal ).toLowerCase();
	functionOpen.nameReal = nameReal;
	functionOpen.type = functionType;
	functionOpen.parentSection = parentSection;
	var parentArray;
	if ( functionType == 'class' )
		parentArray = parentSection[ 'objects' ];			// Thank you Javascript also. :)
	else
		parentArray = parentSection[ functionType + 's' ];			// Thank you Javascript also. :)
	functionOpen.prefix = functionType.toLowerCase().substring( 0, 1 ) + '_';
	functionOpen.postfix = '_' + functionType.toLowerCase().substring( 0, 1 );
	functionOpen.startLine = info.currentLine;
	functionOpen.position = startPosition;
	var variableTokens = Array.from( info.variableTokens );

	// Get the unified syntax
	functionOpen.syntax = info.parseSyntax0( functionType );

	// Add the extendsList to the parameters
	if ( functionType == 'class' )
	{
		for ( var e = 0; e < extendsList.length; e++ )
		{
			var toExtend = extendsList[ e ];			
			var foundDefinition = info.findClass( parentSection, toExtend );			
			if ( foundDefinition )
			{
				for ( var v = 0; v < 1; v++ )	// FLTODO:
				{
					var foundVariant = foundDefinition.variants[ v ];
					var foundSyntax = foundVariant.syntax;
					for ( var pp = 0; pp < foundSyntax.length; pp++ )
					{
						for ( var ppp = 0; ppp < functionOpen.syntax.length; ppp++ )
						{
							if ( functionOpen.syntax[ ppp ].token == foundSyntax[ pp ].token )
								info.throwError( 'syntax_error' )
						}
						functionOpen.syntax.push( foundSyntax[ pp ] );
					}
				}		
				foundDefinition.inUse = true;
				var foundArray = [ foundDefinition ];
				while ( foundDefinition.extendsList && foundDefinition.extendsList.length > 0 )
				{
					foundDefinition = info.findClass( parentSection, foundDefinition.extendsList[ 0 ] );
					if ( foundDefinition )
					{
						foundDefinition.inUse = true;
						foundArray.push( foundDefinition );
					}
					else
						info.throwError( { error: 'class_not_found', parameter: toExtend }, true );
				}
				for ( var c = foundArray.length - 1; c >= 0; c-- )
				{
					foundDefinition = foundArray[ c ];
					if ( foundDefinition.friendsList )
					{
						for ( var f = 0; f < foundDefinition.friendsList.length; f++ )
						{
							var found = friendsList.find( function ( el )
							{
								return el == foundDefinition.friendsList[ f ];
							} );
							if ( !found )
								friendsList.push( foundDefinition.friendsList[ f ] );
						}
					}
				}
			}
			else
				info.throwError( { error: 'class_not_found', parameter: toExtend }, true );
		}

		for ( var e = 0; e < friendsList.length; e++ )
		{
			var friend = friendsList[ e ];			
			var foundDefinition = info.findClass( parentSection, friend );			
			if ( !foundDefinition )
				info.throwError( { error: 'class_not_found', parameter: friend } );
			for ( var v = 0; v < 1; v++ )	// FLTODO:
			{
				var foundVariant = foundDefinition.variants[ v ];
			}		
		}
	}

	// Create the parameter variables
	for ( var v = 0; v < functionOpen.syntax.length; v++ )
	{
		var parameter = functionOpen.syntax[ v ];
		var variable = info.newVariable( info.getVariableInfo( parameter.nameReal, { isArray: parameter.value == '(array)', isParameter: true } ), parameter.value == '(array)' );
		functionOpen.variables[ variable.token ] = variable;
	}

	// Look for inline code on next lines
	info.nextLine( tab );
	functionOpen.startPass = info.currentLine;
	var end = info.peekNextWord();
	if ( info.text == '{' )
	{
		if ( functionType != 'method' && functionType != 'procedure' )
		{
			info.setNextWord( end );
			info.tagReturns = '';
			info.className = null;
			functionOpen.codeInline = info.getJavascript( { noHeader: true, trim: true, tags: functionOpen.tags } );
			functionOpen.waiting = info.waiting;
			functionOpen.noDefaults = info.noDefaults;
			switch ( info.tagReturns )
			{
				case 'integer':
					returnType = '0';
					break;
				case 'float':
					returnType = '1';
					break;
				case 'string':
					returnType = '2';
					break;
				case 'class':
					returnType = '3';
					break;
				default:
				break;
			}
		}
		else
		{
			functionOpen.methodInLine = true;
		}
		functionOpen.className = info.className;
	}
	functionOpen.className = functionType == 'class' ? functionOpen.name : functionType;
	if ( functionType == 'class' )
	{
		returnType = '3';
		numberType = '3';
		functionOpen.extendsList = extendsList;
		functionOpen.friendsList = friendsList;
	}

	if ( !parentArray[ functionOpen.name ] )
	{
		parentArray[ functionOpen.name ] =
		{
			name: functionOpen.name,
			nameReal: nameReal,
			nameRealLower: nameReal.toLowerCase(),
			className: functionOpen.className,
			type: functionType,
			returnType: returnType,
			numberType: returnType,
			variants: [],
			anchors: {},
			parentSection: parentSection,
			returnsValue: false,
			variableTokens: variableTokens,
			extendsList: extendsList,
			friendsList: friendsList
		}
	}
	functionOpen.parent = parentArray[ functionOpen.name ];
	functionOpen.parent.tags = functionOpen.tags;
	functionOpen.returnType = returnType;
	functionOpen.inUse = ( functionType == 'procedure' );		// Force copy of all procedures
	info.anchors[ startPosition ] = functionOpen;
	parentArray[ functionOpen.name ].anchors[ startPosition ] = functionOpen;
	parentArray[ functionOpen.name ].variants.push( functionOpen );

	return functionOpen;
};
function linkMethods( info, parentSection, objectOpen )
{
	// Breanch derivative functions
	for ( var e = 0; e < objectOpen.extendsList.length; e++ )
	{
		var foundDefinition = info.findClass( parentSection, objectOpen.extendsList[ e ] );
		if ( foundDefinition )
		{
			var foundVariant = foundDefinition.variants[ 0 ];
			var foundMethods = foundVariant.methods;
			var methodsOpen = objectOpen.parent.variants[ 0 ].methods;
			for ( var p in foundMethods )
			{
				if ( !methodsOpen[ p ] )
					methodsOpen[ p ] = foundMethods[ p ];
			}
		}
	}
};
function closeFunctionOrMethod( info, functionOpen )
{
	functionOpen.end = info.currentLine;
	functionOpen.endPass = info.currentLine + 1;
	functionOpen.parent.anchors[ info.position ] = functionOpen;

	// Look for inline return code...
	var endChar;
			info.peekNextWord();
	functionOpen.returnsValue = false;
	if ( functionOpen.type == 'procedure'  )
	{
		if ( info.text == '[' )
		{
			functionOpen.returnsValue = true;
			endChar = ']';
		}
	}
	else if ( info.text == '(' )
	{
		functionOpen.returnsValue = true;
		endChar = ')';
	}
	if ( functionOpen.returnsValue )
	{
		info.setNextWord();
		info.peekNextWord();
		if ( info.text == '{' )
		{
			info.setNextWord();
			functionOpen.codeInlineReturn = info.getJavascript( { tags: info.section.tags, noHeader: true, trim: true } );
			info.extractNextWord();
			if ( info.text != endChar )
				throw 'syntax_error';
		}
		else
		{
			var c = info.text.substring( info.text.length - 1 );
			if ( c == '@' )
				functionOpen.returnType = '3';
			else if ( c == '$' )
				functionOpen.returnType = '2';
			else functionOpen.returnType = '0';
			info.getSourceText( [ 'any' ], [ endChar ], { skipOpen: [ '(', '"', "'" ], skipClose: [ ')', '"', "'" ] } );
			info.extractNextWord();
			if ( info.text != endChar )
				throw 'syntax_error';
		}
	}
};



///////////////////////////////////////////////////////////////////////////////
// Special cases for pass 2
///////////////////////////////////////////////////////////////////////////////
var specialCases = {};
specialCases.handleSuper = function( info )
{
	if ( info.section.className != 'method' )
		info.throwError( { error: 'syntax_error', parameter: info.className } );
	pass2Object( info, info.section.parentSection, { isSuper: true } );
};
specialCases.handleProc = function( info )
{
	if ( info.options.manifest.compilation.platform.toLowerCase() == 'amiga' )
	{
		info.extractNextWord();
		var anchor = info.section.anchors[ info.position ];
		info.parseSyntax2( anchor );
	}
	else
	{
		var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		info.addLine( 'aoz.runProcedure(' + exp.code + ',{},aoz.currentSection);' );
	}
};
specialCases.handleDefFn = function( info )
{
	info.extractNextWord();
	var variableInfo = info.getVariableInfo( info.text, {} );
	var func = info.section.defFunctions[ variableInfo.token ];
	info.setPosition( func.end );
};
specialCases.handleChannel = function( info )
{
	var objs = [ 'bob', 'sprite', 'screen', 'rainbow', 'actor' ];
	var funcs = [ 'display', 'offset', 'shadow', 'skew', 'size' ];

	info.compileExpression( INFO.EXPFLAG_ENDONTO );
	if ( !info.checkTypes( info.returnType, '0' ) )
		info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	var channel = info.result;

	info.extractNextWord();
	if ( info.textLower != 'to' )
		info.throwError( { error: 'syntax_error' }, true );

	// Get next tokens
	info.skipSpaces();
	var lineTokens = info.getLineTokens();
	var obj = lineTokens[ 0 ].text;
	var func = '';
	if ( lineTokens.length > 0 )
	{
		var pos = lineTokens[ 1 ].text.indexOf( '_' );
		func = lineTokens[ 1 ].text.substring( pos + 1 );
	}
	
	// Check object
	for ( var o = 0; o < objs.length; o++ )
	{
		if ( objs[ o ] == obj )
			break;
	}
	if ( o == objs.length )
		info.throwError( { error: 'syntax_error' }, true );
	info.setPosition( lineTokens[ 0 ].position );
	obj = obj.substring( 0, 1 ).toUpperCase() + obj.substring( 1 );

	// Check function
	if ( func != '' )
	{
		for ( var f = 0; f < funcs.length; f++ )
		{
			if ( funcs[ f ] == func )
				break;
		}
		if ( f == funcs.length )
			func = '';
		else
			info.setPosition( lineTokens[ 1 ].position );
	}
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
	var objectNumber = info.result;
	if ( info.returnType == '2' )
		objectNumber = '"' + objectNumber + '"';

	info.addLine( 'aoz.checkAnimationChannel(' + channel + ',undefined,' + objectNumber + ',"' + obj + '","' + func + '",true)' );
	info.nextBlock2();
};
specialCases.handleRol = function( info )
{
	info.extractNextWord();		// .
	info.extractNextWord();		// B/W/L
	specialCases.handleBitInstruction( info, 'aoz.rol' + info.text.toUpperCase() +'(%$P1,%$P2);' );
};
specialCases.handleRor = function( info )
{
	info.extractNextWord();		// .
	info.extractNextWord();		// B/W/L
	specialCases.handleBitInstruction( info, 'aoz.ror' + info.text.toUpperCase() +'(%$P1,%$P2);' );
};
specialCases.handleBset = function( info )
{
	specialCases.handleBitInstruction( info, 'aoz.bSet(%$P1,%$P2);' );
};
specialCases.handleBclr = function( info )
{
	specialCases.handleBitInstruction( info, 'aoz.bClr(%$P1,%$P2);' );
};
specialCases.handleBchg = function( info )
{
	specialCases.handleBitInstruction( info, 'aoz.bChg(%$P1,%$P2);' );
};
specialCases.handleBitInstruction = function( info, source )
{
	info.addSourceReference();

	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
	var shift = info.result;
	info.extractNextWord();
	info.extractNextWord();
	var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT );
	var source = utilities.replaceStringInText( source, '%$P1', variable.code );
	source = utilities.replaceStringInText( source, '%$P2', shift );
	info.addLine( source );
	info.nextBlock2();
};
specialCases.handleRotationInstruction = function( info, source )
{
	info.addSourceReference();

	info.extractNextWord();
	if ( info.type != 'variable' )
		info.throwError( { error: 'syntax_error' }, true );
	var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT );
	info.extractNextWord();
	if ( info.text != ',' )
	info.throwError( { error: 'syntax_error' }, true );
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
	if ( !info.checkTypes( '0', info.returnType ) )
	info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	var source = utilities.replaceStringInText( variable.code, '%$P1', variable );
	source = utilities.replaceStringInText( source, '%$P2', info.result );
	info.addLine( source );
	info.nextBlock2();
};
specialCases.handleColourBack = function( info )
{
	info.addSourceReference();

	end = info.peekNextWord();
	if ( info.text == '(' )
	{
		info.setNextWord( end );
		info.compileExpression( INFO.EXPFLAG_ENDONBRACKET );
		info.addLine( 'aoz.colourBack(' + info.result + ',false);' );
		info.extractNextWord();
	}
	else
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		info.addLine( 'aoz.colourBack(' + info.result + ',true);' );
	}
	info.nextBlock2();
};
specialCases.handleBreakIf = function( info )
{
	info.waitingFunctionCount = 0;
	var start = info.position;
	info.compileExpression( INFO.EXPFLAG_COMPARAISON | INFO.EXPFLAG_ENDONBRACKET );
	var source = info.extractSource( start, info.position );
	var code = 'aoz.ext_debugging.addBreak({section:aoz.currentSection,expression:function(aoz,vars){return ' + info.result + ';},source:"' + BTOA( source ) + '"});';
	info.addLine( code );
	info.nextBlock2( true );
};
specialCases.handleLineInput = function( info )
{
	this.handleInput( info, true );
};
specialCases.handleInput = function( info, isLineInput )
{
	info.addSourceReference();

	var port, code, printText = '""';
	var end = info.peekNextWord();
	if ( info.type != 'tag' )
	{
		var printText = 'undefined';
		info.waitingFunctionCount = 0;
		var posInfo = info.section.anchors[ info.position ];
		if ( posInfo.expressionFirst )
		{
			var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSEMICOLON );
				printText = exp.code;
			info.extractNextWord();
		}
		code = 'return{type:8,instruction:"input",args:{text:' + printText + ',variables:[';
	}
	else
	{
		info.setPosition( end );
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
		port = info.result;
		info.extractNextWord();
		code = '[';
	}
	while( true )
	{
		info.extractNextWord();
		code += info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT ).code;
		end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
		code += ',';
	}
	code += ']';
	if ( !port )
	{
		if ( info.text == ';' )
			code += ',newLine:false'
		else
			code += ',newLine:true'
		if ( isLineInput )
			code += ',isLineInput:true'
		code += '}};'
	}
	else
	{
		code = 'aoz.moduleFilesystem.input(' + port + ',' + code + ',' + ( isLineInput ? 'true' : 'false' ) + ');';
	}
	info.addLine( code );
	info.nextBlock2( true );
	return info;
};
specialCases.handleLineInputFrom = function( info )
{
	this.doInputFrom( info, 'aoz.moduleFilesystem.input(%$P1,%$P2,false);' );
};
specialCases.handleInputFrom = function( info )
{
	this.doInputFrom( info, 'aoz.moduleFilesystem.input(%$P1,%$P2,true);' );
};
specialCases.doInputFrom = function( info, code )
{
	info.addSourceReference();

	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
	var port = info.result;
	var variables = '[';
	info.extractNextWord();
	while( true )
	{
		info.extractNextWord();
		if ( info.type != 'variable' )
			info.throwError( { error: 'syntax_error' }, true );
		variables += info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT ).code;
		info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord();
		variables += ',';
	}
	variables += ']';
	code = utilities.replaceStringInText( code, '%$P1', port + '' );
	code = utilities.replaceStringInText( code, '%$P2', variables );
	info.addLine( code );
	info.nextBlock2( true );
};
specialCases.handleMapButtons = function( info )
{
	this.handleMap( info, 0 );
};
specialCases.handleMapAxes = function( info )
{
	this.handleMap( info, 16 );
};
specialCases.handleMapTriggers = function( info )
{
	this.handleMap( info, 32 );
};
specialCases.handleMap = function( info, delta )
{
	info.addSourceReference();

	var code = 'aoz.gamepadMap(';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
	if ( !info.checkTypes( '2', info.returnType ) )
		info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	code += info.result + ',[';
	info.extractNextWord();
	while ( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		code += info.result;
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
		code += ',';
	}
	code += '],' + delta + ');';
	info.addLine( code );
	info.nextBlock2();
}

specialCases.handleSetTransparent = function( info )
{
	this.doTransparent( info, 'true' );
}
specialCases.handleStopTransparent = function( info )
{
	this.doTransparent( info, 'false' );
}
specialCases.doTransparent = function( info, startStop )
{
	var args = '';

	info.addSourceReference();
	info.peekNextWord();
	if ( !info.peekEndOfInstruction )
	{
	info.waitingFunctionCount = 0;
	while ( true )
	{
		var flags = info.compileExpression( INFO.EXPFLAG_WANTNUMBER | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_SKIPNEXTTOKEN );
		args += info.result;
		if ( !( flags & INFO.EXPFLAG_ENDONCOMMA ) )
			break;
		args += ',';
	}
	}
	info.addLine( 'aoz.currentScreen.setTransparent([' + args + '],' + startStop + ');' );
	info.nextBlock2();
	return info;
}

specialCases.handleFade = function( info )
{
	info.addSourceReference();

	var code = 'aoz.currentScreen.fade({';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONTO | INFO.EXPFLAG_ENDONCOLON );
	if ( info.returnType == '2' )
		info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	code += 'index:' + info.result;
	info.peekNextWord();
	if ( info.textLower == 'to' )
	{
		info.setNextWord();
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		code += ',screen:' + info.result;
		info.extractnextWord();
		if ( info.text == ',' )
		{
			info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
			if ( info.returnType == '2' )
				info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
			code += ',mask:' + info.result;
		}			
	}
	else if ( !info.peekEndOfInstruction )
	{
		code += ',colors:['
		while ( true )
		{
			info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONTO | INFO.EXPFLAG_ENDONCOLON );
			if ( info.returnType == '2' )
				info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
			code += info.result;
			info.peekNextWord();
			if ( info.text != ',' )
				break;
			info.setNextWord();
			code += ',';
		}
		code += ']';
	}
	code += '});'
	info.addLine( code );
	info.nextBlock2();
	return info;
}
specialCases.handlePalette = function( info )
{
	info.addSourceReference();

	var args = '[';
	info.waitingFunctionCount = 0;
	while ( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		args += info.result;
		info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord();
		args += ',';
	}
	args += ']';
	var code = 'aoz.currentScreen.setPalette(' + args;
	if ( info.options.manifest.compilation.platform.toLowerCase() != 'amiga' )
		code += ',"#noremap"';
	code += ');';
	info.addLine( code );
	info.nextBlock2();
	return info;
}
specialCases.handleDefaultPalette = function( info )
{
	info.addSourceReference();

	var args = '[';
	info.waitingFunctionCount = 0;
	while ( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		args += info.result;
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
		args += ',';
	}
	args += ']';
	info.addLine( 'aoz.setDefaultPalette(' + args + ');' );
	info.nextBlock2();
	return info;
}
specialCases.handleAdd = function( info )
{
	info.addSourceReference();
	info.extractNextWord();
	if ( info.type != 'variable' )
		info.throwError( { error: 'syntax_error' }, true );
	info.waitingFunctionCount = 0;
	var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_ADD );

	info.extractNextWord();
	if ( info.text != ',' )
		info.throwError( { error: 'syntax_error' }, true );
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA );
	var plus = info.result;
	var end = info.peekNextWord();
	var code;
	if ( info.text == ',' )
	{
		info.setNextWord( end );
		info.compileExpression( INFO.EXPFLAG_ENDONTO );
		var start = info.result;
		info.extractNextWord();
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		code = 'aoz.add(this,' + variable.code + ',' +  plus + ',' + start + ',' + info.result + ');';
	}
	else
	{
		code = 'aoz.add(this,' + variable.code + ',' + plus + ');';
	}
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handleSort = function( info )
{
	info.addSourceReference();
	info.extractNextWord();
	info.waitingFunctionCount = 0;
	var code = info.getVariable( 0, INFO.GETVARIABLEFLAG_SORT ).code;
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handleInc = function( info )
{
	info.addSourceReference();
	info.extractNextWord();
	info.waitingFunctionCount = 0;
	var code = info.getVariable( 0, INFO.GETVARIABLEFLAG_INC ).code;
	info.addLine( code + ';' );
	info.nextBlock2();
};
specialCases.handleDec = function( info )
{
	info.addSourceReference();
	info.extractNextWord();
	info.waitingFunctionCount = 0;
	var code = info.getVariable( 0, INFO.GETVARIABLEFLAG_DEC ).code;
	info.addLine( code + ';' );
	info.nextBlock2();
};
specialCases.handlePolyline = function( info )
{
	info.addSourceReference();
	var code = '[';
	var end = info.peekNextWord();
	if ( info.textLower == 'to' )
	{
		code += 'undefined,undefined,';
		info.setNextWord( end );
	}
	info.waitingFunctionCount = 0;
	while ( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		end = info.peekNextWord();
		if ( info.text != ',' )
			info.throwError( { error: 'syntax_error' }, true );
		info.setNextWord( end );
		code += info.result;
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONTO );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		code += ',' + info.result;
		end = info.peekNextWord();
		if ( info.textLower != 'to' )
			break;
		info.setNextWord( end );
		code += ',';
	}

	code = 'aoz.currentScreen.polyline(' + code + ']);';
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handlePolygon = function( info )
{
	info.addSourceReference();

	var code = '[';
	var end = info.peekNextWord();
	if ( info.textLower == 'to' )
	{
		code += 'undefined,undefined,';
		info.setNextWord( end );
	}
	info.waitingFunctionCount = 0;
	while ( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		end = info.peekNextWord();
		if ( info.text != ',' )
			info.throwError( { error: 'syntax_error' }, true );
		info.setNextWord( end );
		code += info.result;
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONTO );
		if ( info.returnType == '2' )
			info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
		code += ',' + info.result;
		end = info.peekNextWord();
		if ( info.textLower != 'to' )
			break;
		info.setNextWord( end );
		code += ',';
	}
	code = 'aoz.currentScreen.polygon(' + code + ']);';
	info.addLine( code );
	info.nextBlock2();
	return info;
};
specialCases.handlePopProc = function( info )
{
	if ( info.section.type != 'procedure' )
		info.throwError( { error: 'procedure_not_opened' }, true );

	info.addSourceReference();

	var end = info.peekNextWord();
	if ( info.text == '[' )
	{
		info.setNextWord( end );
		info.waitingFunctionCount = 0;
		info.compileExpression( INFO.EXPFLAG_ENDONSQUAREBRACKET );
		var code;
		if ( info.returnType == '2' )
			code = 'this.parent.procParam$=';
		else
			code = 'this.parent.procParam=';
		info.addLine( code + info.result + ';' );
		info.extractNextWord();
		if ( info.text != ']' )
			info.throwError( { error: 'syntax_error' }, true );
	}
	info.addLine( 'return{type:0};' );
	info.nextBlock2();
	return true;
};
specialCases.handleSwap = function( info )
{
	info.addSourceReference();

	var code = 'var temp=';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
	info.extractNextWord();
	if ( info.text != ',' )
		info.throwError( { error: 'syntax_error' }, true );
	code += info.result + ';'
	var pos = info.result.indexOf( 'getValue' );
	if ( pos >= 0 )
	{
		code += info.result.substring( 0, pos ) + 'setValue(';
		pos = info.result.indexOf( '[' );
		var pos2 = info.result.indexOf( ']' );
		code += info.result.substring( pos, pos2 + 1 ) + ',';
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		code += info.result + ');'
	}
	else
	{
		code += info.result + '=';
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		code += info.result + ';'
	}
	var pos = info.result.indexOf( 'getValue' );
	if ( pos >= 0 )
	{
		code += info.result.substring( 0, pos ) + 'setValue(';
		pos = info.result.indexOf( '[' );
		var pos2 = info.result.indexOf( ']' );
		code += info.result.substring( pos, pos2 + 1 ) + ',';
		code += 'temp);'
	}
	else
	{
		code += info.result + '=temp;';
	}
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handleShared = function( info )
{
	info.addSourceReference();
	while(true)
	{
		info.extractNextWord();
		if ( info.type != 'variable' && info.type != 'string' )
			info.throwError( { error: 'syntax_error' }, true );
		info.peekNextWord();
		if ( info.text == '(' )
		{
			info.setNextWord();
			info.extractNextWord();
		}
		info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord();
	}
};
specialCases.handleGlobal = function( info )
{
	while(true)
	{
		info.extractNextWord();
		if ( info.type != 'variable' && info.type != 'string' )
			info.throwError( { error: 'syntax_error' }, true );
		info.peekNextWord();
		if ( info.text == '(' )
		{
			info.setNextWord();
			info.extractNextWord();
		}
		info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord();
	}
};
specialCases.handleData = function( info )
{
	info.waitingFunctionCount = 0;
	while( true )
	{
		var exp = info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
		if ( exp.constant )
			info.section.datas.push( info.result );
		else
			info.section.datas.push( 'function(aoz,vars){return ' + info.result + '}' );
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
	}
};
specialCases.handleRestore = function( info )
{
	info.addSourceReference();

	var code;
	var labelType = info.checkLabelType();
	if ( labelType == 'none' )
	{
		code = 'this.dataPosition=0;';
	}
	else if ( labelType == 'label' )
	{
		info.extractNextWord();
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_defined' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		code = 'this.dataPosition=' + label.dataPosition + ';';
	}
	else
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		code = 'var temp=this.labels[' + info.result + ']; if (temp) this.dataPosition=temp.dataPosition;  else throw "label_not_defined";';
	}
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handleRead = function( info )
{
	info.addSourceReference();

	var code;
	while ( true )
	{
		info.extractNextWord();
		variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_SETVALUE );
		code = info.assignToVariable( variable, 0, 'aoz.read(this,' + variable.variable.type + ')' ) + ';';
		info.addLine( code );
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
	}
	info.nextBlock2();
};
specialCases.handleOnError = function( info )
{
	info.addSourceReference();
	
	info.extractNextWord();
	if ( info.token.token == 'goto' )
	{
		info.extractNextWord();
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_found' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		info.addLine( 'this.onError=' + label.labelBlock + ';' );
	}
	else
	{
		info.extractNextWord();
		info.addLine( 'this.onError=aoz.root.p_' + info.text.toLowerCase() + ';' );
	}
	info.nextBlock2();
};
specialCases.handleResume = function( info )
{
	info.addSourceReference();

	var end =info.peekNextWord();
	if ( info.type == 'variable' || info.type == 'number' )
	{
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_found' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		info.addLine( 'return{type:5,label:' + label.labelBlock + '};' );
		info.setNextWord( end );
	}
	else
	{
		info.addLine( 'return{type:5};' );
	}
	info.nextBlock2();
};
specialCases.handleResumeLabel = function( info )
{
	info.addSourceReference();

	var end = info.peekNextWord();
	if ( info.type == 'variable' || info.type == 'number' )
	{
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_found' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		info.addLine( 'aoz.resumeLabel=' + label.labelBlock + ';' );
		info.setNextWord( end );
	}
	else
	{
		info.addLine( 'return{type:7};' );
	}
	info.nextBlock2();
};
specialCases.handleSaveVariables = function( info )
{
	info.addSourceReference();

	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONBRACKET );
	var code = 'return{type:12,waitThis:aoz.moduleFilesystem,callFunction:"saveVariables",waitFunction:"load_wait",args:[' + info.result + ',';
	info.extractNextWord();
	while( true )
	{
		info.extractNextWord();
		var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT | INFO.GETVARIABLEFLAG_VARPTR ); 
		code += variable.code + ',';
		info.extractNextWord();
		if ( info.text != ',' )
			break;
	}
	code = code.substring( 0, code.length - 1 ) + ']};';
	info.addLine( code );
	info.nextBlock2( true );
};
specialCases.handleDim = function( info )
{
	while( true )
	{
		info.extractNextWord();
		if ( info.type != 'variable' )
			info.throwError( { error: 'syntax_error' }, true );
		var name = info.variableInfo.name;
		var token = info.variableInfo.token;
		var variable = info.section.variables[ token ];
		if ( variable && info.caseSensitive )
		{
			if ( variable.nameReal != name )
				variable = undefined;
		}
		if ( typeof variable == 'undefined' )
			info.throwError( { error: 'syntax_error' }, true );
			
		var code;
		if ( ( variable.global || variable.shared ) && info.section.type != 'main' )
			code = 'this.root.vars.' + variable.tokenCode + '.dim([';
		else
			code ='vars.' + variable.tokenCode + '.dim([';

		info.extractNextWord();
		if ( info.text == '(' )
		{
			info.waitingFunctionCount = 0;
			for ( var d = 0; d < variable.numberOfDimensions; d++ )
			{
				info.compileExpression( ( d == variable.numberOfDimensions - 1 ) ? INFO.EXPFLAG_ENDONBRACKET : INFO.EXPFLAG_ENDONCOMMA );
				var end = info.peekNextWord();
				if ( info.text != ',' && info.text != ')' )
					info.throwError( { error: 'syntax_error' }, true );
				if ( d > 0 )
					code += ',';
				code += info.result;
				info.setNextWord( end );
			}
		}
		code += '],0);';
		info.addLine( code );
		info.nextBlock2();
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
	}
}
specialCases.handleResumeNext = function( info )
{
	info.addSourceReference();

	info.addLine( 'return{type:6};' );
	info.nextBlock2();
};
specialCases.handleOn = function( info )
{
	info.addSourceReference();

	var ons = info.section.anchors[ info.position ];
	var code = 'switch(';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONGOTO | INFO.EXPFLAG_ENDONGOSUB | INFO.EXPFLAG_ENDONPROC );
	if ( info.returnType != 0 )
		info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	code += info.result + ')';
	info.addLine( code );
	info.addLine( '{' );
	info.indent();

	info.extractNextWord();
	if ( info.type != 'token' )
		info.throwError( { error: 'syntax_error' }, true );
	var token = info.textLower;

	var count = info.options.manifest.compilation.platform.toLowerCase() != 'amiga' ? 0 : 1;
	while( true )
	{
		info.addLine( 'case ' + count + ':' );
		info.indent();
		switch ( token )
		{
			case 'goto':
				if ( info.checkLabelType() == 'label' )
				{
					info.extractNextWord();
					var label = info.section.labels[ info.textLower ];
					if ( !label )
						info.throwError( { error: 'label_not_defined' }, true );
					if ( info.caseSensitive && label.nameReal != info.text )
						info.throwError( { error: 'label_not_defined' } );
					info.addLine( 'return{type:1,label:' + label.labelBlock + '};' );
				}
				else
				{
					info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
					info.addLine( 'var temp=this.labels[' + info.result + ']; if(temp) return{type:1,label:temp.labelBlock}; else throw "label_not_defined";' );
				}
				break;
			case 'gosub':
				if ( info.checkLabelType() == 'label' )
				{
					info.extractNextWord();
					var label = info.section.labels[ info.textLower ];
					if ( !label )
						info.throwError( { error: 'label_not_defined' }, true );
					if ( info.caseSensitive && label.nameReal != info.text )
						info.throwError( { error: 'label_not_defined' } );
					info.addLine( 'return{type:2,label:' + label.labelBlock + ',return:' + ons.endBlock + '};' );
				}
				else
				{
					info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
					info.addLine( 'var temp=this.labels[' + info.result + ']; if(temp) return{type:2,label:temp.labelBlock,return:' + ons.endBlock + '}; else throw "label_not_defined";' );
				}
				break;
			case 'proc':
				if ( info.checkLabelType() != 'procedure' )
					info.throwError( { error: 'procedure_not_found' }, true );
				info.extractNextWord();
				info.addLine( 'return {type:4,procedure:"' + info.textLower + '",args:{}}' );
				break;
			default:
				info.throwError( { error: 'syntax_error' } );
		}
		info.unIndent();

		info.extractNextWord();
		if ( info.text != ',' )
			break;
		count++;
	};
	info.unIndent();
	info.addLine( '}' );
	info.nextBlock2( true );
};
specialCases.handleEvery = function( info )
{
	info.addSourceReference();

	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONGOSUB | INFO.EXPFLAG_ENDONPROC );
	if ( info.returnType != 0 )
		info.throwError( { error: 'type_mismatch', parameter: info.getExpressionErrorParameter() } );
	var interval = info.result;

	info.extractNextWord();
	if ( info.type != 'token' )
		info.throwError( { error: 'syntax_error' }, true );
	var token = info.token.token;

	switch ( token )
	{
		case 'gosub':
			if ( info.checkLabelType() == 'label' )
			{
				info.extractNextWord();
				var label = info.section.labels[ info.textLower ];
				if ( !label )
					info.throwError( { error: 'label_not_defined' }, true );
				if ( info.caseSensitive && label.nameReal != info.text )
					info.throwError( { error: 'label_not_defined' } );
				info.addLine( 'var temp={type:"gosub",label:' + label.labelBlock + '};' );
			}
			else
			{
				info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON );
				info.addLine( 'var temp=this.labels[' + info.result + ']; if(temp) temp={type:"gosub",label:temp.labelBlock}; else throw "label_not_defined";' );
			}
			break;
		case 'proc':
			if ( info.checkLabelType() != 'procedure' )
				info.throwError( { error: 'syntax_error' }, true );
			info.extractNextWord();
			info.addLine( 'var temp={type:"proc",procedure:"' + info.textLower + '",args:{}};' );
			break;
		default:
			info.throwError( { error: 'syntax_error' }, true );
	}
	info.addLine( 'aoz.every(' + interval +',temp);' );
	info.nextBlock2();
};
specialCases.handleReturn = function( info )
{
	info.addSourceReference();
	info.addLine( 'return{type:3};' );
	info.nextBlock2( true );
};
specialCases.handlePop = function( info )
{
	info.addSourceReference();
	info.addLine( 'return{type:13};' );
	info.nextBlock2( true );
};
specialCases.handleEnd = function( info )
{
	info.addSourceReference();
	info.addLine( 'return{type:16}' );
	info.nextBlock2( true );
};
specialCases.handleDirect = function( info )
{
	info.addSourceReference();
	info.addLine( 'return{type:19}' );
	info.nextBlock2( true );
};
specialCases.handleClapFin = function( info )
{
	info.sourceLine = undefined;
	info.sourcePos = undefined;
	info.addLine( 'return{type:0}', true );
	info.nextBlock2( true );
};
specialCases.handleEdit = function( info )
{
	info.addSourceReference();
	info.addLine( 'return{type:14}' );
	info.nextBlock2( true );
};
specialCases.handleExit = function( info )
{
	info.addSourceReference();

	var exit = info.section.anchors[ info.position ];
	var nLoops = 1;
	var end = info.peekNextWord();
	if ( info.type == 'number' )
	{
		nLoops = parseInt( info.text );
		if ( nLoops > exit.loops.length - 1 )
			info.throwError( { error: 'not_enough_loops_to_exit' } );
		info.setNextWord( end );
	}
	info.addLine( 'return{type:1,label:' + exit.loops[ exit.loops.length - nLoops ].endBlock + '};' );
	info.nextBlock2( true );
};
specialCases.handleExitIf = function( info )
{
	info.addSourceReference();

	var exit = info.section.anchors[ info.position ];
	var code = 'if(';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONCOLON |INFO.EXPFLAG_COMPARAISON );
	code += info.result + ')';
	info.addLine( code );
	info.indent();

	var nLoops = 1;
	info.peekNextWord();
	if ( info.text == ',' )
	{
		info.setNextWord();
		info.peekNextWord();
		nLoops = parseInt( info.text );
		if ( nLoops > exit.loops.length - 1 )
			info.throwError( { error: 'not_enough_loops_to_exit' } );
		info.setNextWord();
	}
	info.addLine( 'return{type:1,label:' + exit.loops[ exit.loops.length - nLoops ].endBlock + '};' );
	info.unIndent();
	info.nextBlock2( true );
};
specialCases.handleDo = function( info )
{
	info.addSourceReference();
	info.nextBlock2( true );
};
specialCases.handleLoop = function( info )
{
	info.addSourceReference();

	var loop = info.section.anchors[ info.position ];
	info.addLine( 'return{type:1,label:' + loop.startBlock + '};' );
	info.nextBlock2( true, loop.startBlock - 1 );
};
specialCases.handleRepeat = function( info )
{
	info.addSourceReference();
	info.nextBlock2( true );
};
specialCases.handleUntil = function( info )
{
	info.addSourceReference();

	var loop = info.section.anchors[ info.position ];
	var code = 'if(!(';
	info.waitingFunctionCount = 0;
	info.comparaison = true;
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
	info.comparaison = false;
	code += info.result + '))';
	info.addLine( code );
	info.indent();
	info.addLine( 'return{type:1,label:' + loop.startBlock + '};' );
	info.nextBlock2( true, loop.startBlock - 1 );
	info.unIndent();
};
specialCases.handleWhile = function( info )
{
	info.addSourceReference();

	var loop = info.section.anchors[ info.position ];
	info.waitingFunctionCount = 0;
	info.comparaison = true;
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
	info.comparaison = false;
	loop.codeTest = info.result;
	var code = 'if(!(';
	code += info.result + '))';
	info.addLine( code );
	info.indent();
	info.addLine( 'return{type:1,label:' + loop.endBlock + '};' );
	info.unIndent();
	info.nextBlock2( true );
};
specialCases.handleWend = function( info )
{
	info.addSourceReference();

	var loop = info.section.anchors[ info.position ];
	info.addLine( 'if(' + loop.codeTest + ')' )
	info.indent();
	info.addLine( 'return{type:1,label:' + loop.startBlock + '};' );
	info.unIndent();
	info.nextBlock2( true, loop.startBlock - 1 );
};
specialCases.handleFor = function( info )
{
	info.addSourceReference();

	var fr = info.section.anchors[ info.position ];
	info.extractNextWord();
	if ( info.type != 'variable' )
		info.throwError( { error: 'syntax_error' }, true );

	info.waitingFunctionCount = 0;
	var variable = info.getVariable( 0, INFO.GETVARIABLEFLAG_SETVALUE );
	info.extractNextWord();		// Skip '='
	code = info.assignToVariable( variable, INFO.EXPFLAG_ENDONTO );
	info.addLine( code );
	fr.variable = variable.code;
	fr.assignementCode = code;

	info.extractNextWord();
	if ( info.textLower != 'to' )
		info.throwError( { error: 'syntax_error' }, true );

	info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONSTEP );
	fr.end = info.result;

	var end = info.peekNextWord();
	if ( info.type == 'token' && info.token.token == 'step' )
	{
		info.setNextWord( end );
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		fr.step = info.result;
		fr.stepConstant = info.constant;
	}
	else
	{
		fr.step = '1';
		fr.stepConstant = true;
	}

	if ( info.options.checkForNextLoops )
	{
		info.addLine( 'if(' + fr.step + '==0) throw "loop_will_hang";' );
		info.addLine( 'if(' + fr.step + '>0&&(' + fr.assignementCode + '>' + fr.end  + ')) throw "reverse_for_loop_positive";' );
		info.addLine( 'if(' + fr.step + '<0&&(' + fr.assignementCode + '<' + fr.end  + ')) throw "forward_for_loop_negative";' );
	}
	info.nextBlock2( true );
};
specialCases.handleNext = function( info )
{
	info.addSourceReference();

	var fr = info.section.anchors[ info.position ];
	var end = info.peekNextWord();
	if ( info.type == 'variable' )
		info.setNextWord( end );
	info.addLine( fr.variable + '+=' + fr.step + ';' );

	var code;
	if ( fr.stepConstant )
	{
		var s = parseFloat( fr.step );
		if ( s > 0 )
			code = 'if(' + fr.variable + '<=' + fr.end + ')';
		else if ( s < 0 )
			code = 'if(' + fr.variable + '>=' + fr.end + ')';
		else
			info.warning( 'null_for_next_step' );
	}
	else
	{
		code = 'if(' + fr.step + '>0?(' + fr.variable + '<=' + fr.end + '):(' + fr.variable + '>=' + fr.end + '))';
	}
	info.addLine( code );
	info.indent();
	info.addLine( 'return{type:1,label:' + fr.startBlock + '};' );
	info.unIndent();
	info.nextBlock2( true, fr.startBlock - 1 );
};
specialCases.handleIf = function( info )
{
	info.addSourceReference();

	var ifs = info.section.anchors[ info.position ];
	if ( !ifs )
		info.throwError( { error: 'internal_error' }, true );
	var code = 'if(!(';
	info.waitingFunctionCount = 0;
	info.comparaison = true;
	info.compileExpression( INFO.EXPFLAG_ENDONTHEN | INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
	info.comparaison = false;

	code += info.result;
	info.addLine( code += '))' );
	info.indent();
	if ( ifs.elseBlocks.length )
		info.addLine( 'return{type:1,label:' + ifs.elseBlocks[ ifs.elseCount ] + '};', undefined, true );
	else
		info.addLine( 'return{type:1,label:' + ifs.endIfBlock + '};' );
	info.unIndent();
	var end = info.peekNextWord();
	if ( info.text.toLowerCase() == 'then' )
	{
		info.flagThen++;
		info.setNextWord( end );
	}
	info.position++;
	info.nextBlock2( true );
	info.position--;
};
specialCases.handleElse = function( info )
{
	var ifs = info.section.anchors[ info.position ];
	if ( !ifs )
		info.throwError( { error: 'internal_error' }, true );
	info.addLine( 'return{type:1,label:' + ifs.endIfBlock + '};' );
	info.nextBlock2( true );
};
specialCases.handleElseIf = function( info )
{
	info.addSourceReference();

	var ifs = info.section.anchors[ info.position ];
	if ( !ifs )
		info.throwError( { error: 'internal_error' }, true );
	info.addLine( 'return{type:1,label:' + ifs.endIfBlock + '};' );
	info.nextBlock2( true );

	var code = 'if(!(';
	info.waitingFunctionCount = 0;
	info.comparaison = true;
	info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_COMPARAISON );
	info.comparison = false;
	code += info.result + '))';
	info.addLine( code );
	info.indent();
	if ( ++ifs.elseCount < ifs.elseBlocks.length )
		info.addLine( 'return{type:1,label:' + ifs.elseBlocks[ ifs.elseCount ] + '};' );
	else
		info.addLine( 'return{type:1,label:' + ifs.endIfBlock + '};' );
	info.unIndent();
	info.nextBlock2( true );
};
specialCases.handleEndIf = function( info )
{
	info.addSourceReference();
	info.nextBlock2( true );
};
specialCases.handleGoto = function( info )
{
	info.addSourceReference();

	if ( info.checkLabelType() == 'label' )
	{
		info.extractNextWord();
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_defined' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		info.addLine( 'return{type:1,label:' + label.labelBlock + '};' );
	}
	else
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		info.addLine( 'var temp=this.labels[' + info.result + ']; if(temp) return{type:1,label:temp.labelBlock}; else throw "label_not_defined";' );
	}
	info.nextBlock2();
};
specialCases.handleGosub = function( info )
{
	info.addSourceReference();

	var gosub = info.section.anchors[ info.position ];
	if ( info.checkLabelType() == 'label' )
	{
		info.extractNextWord();
		var label = info.section.labels[ info.textLower ];
		if ( !label )
			info.throwError( { error: 'label_not_defined' }, true );
		if ( info.caseSensitive && label.nameReal != info.text )
			info.throwError( { error: 'label_not_defined' } );
		info.addLine( 'return{type:2,label:' + label.labelBlock + ',return:' + gosub.startBlock + '};' );
		info.nextBlock2( true, label.labelBlock );
	}
	else
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON );
		info.addLine( 'var temp=this.labels[' + info.result + ']; if(temp) return{type:2,label:temp.labelBlock,return:' + gosub.startBlock + '}; else throw "label_not_defined";' );
		info.nextBlock2( true );
	}
};
specialCases.handleField = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	var code = 'aoz.moduleFilesystem.field(';
	info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
	code += info.result + ',';
	info.extractNextWord();
	var variables = '';
	var lengths = '';
	while( true )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONAS );
		lengths += info.result;
		info.extractNextWord();		// As
		info.extractNextWord();		// Variable
		variables += info.getVariable( 0, INFO.GETVARIABLEFLAG_INPUT ).code;
		var end = info.peekNextWord();
		if ( info.text != ',' )
			break;
		info.setNextWord( end );
		lengths += ',';
		variables += ',';
	}
	code += '[' + variables + '],[' + lengths + ']);';
	info.addLine( code );
	info.nextBlock2();
};
specialCases.handlePrint = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	var end = info.peekNextWord();
	if ( info.type == 'tag' )
	{
		info.setPosition( end );
		info.compileExpression( INFO.EXPFLAG_ENDONCOMMA );
		info.extractNextWord();
		this.doHandlePrint( info, 'aoz.moduleFilesystem.print('+ info.result + ',%$P1,%$P2);' );
	}
	else
	{
		this.doHandlePrint( info, 'aoz.currentScreen.currentTextWindow.print(%$P1,%$P2);' );
	}
}
specialCases.handleConsoleLog = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	this.doHandlePrint( info, 'if (aoz.ext_debugging)\n \
			return aoz.ext_debugging.log( { text: %$P1, sameLine: %$P2, type: "log" } );\n \
		console.error(%$P1);\n', true );
}
specialCases.handleConsoleWarn = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	this.doHandlePrint( info, 'if (aoz.ext_debugging)\n \
			return aoz.ext_debugging.log( { text: %$P1, sameLine: %$P2, type: "warning" } );\n \
		console.error(%$P1);\n', true );
}
specialCases.handleConsoleError = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	this.doHandlePrint( info, 'if (aoz.ext_debugging)\n \
			return aoz.ext_debugging.log( { text: %$P1, sameLine: %$P2, type: "error" } );\n \
		console.error(%$P1);\n', true );
}
specialCases.handleLPrint = function( info )
{
	info.addSourceReference();
	info.waitingFunctionCount = 0;
	info.peekNextWord();
	this.doHandlePrint( info, 'aoz.lprint(%$P1,%$P2);' );
}
specialCases.doHandlePrint = function( info, code, endBlock )
{
	var newLine = true;
	var toPrint = '';
	var end = info.peekNextWord();
	var lastComma = false;
	if ( !info.peekEndOfInstruction )
	{
		info.endOfLine = false;
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONSEMICOLON );
		while( true )
		{
			lastComma = false;
			if ( info.returnType != 2 )
				toPrint += 'aoz.str$(' + info.result + ')';
			else
				toPrint += info.result;
			newLine = true;
			var end = info.peekNextWord();
			if ( info.text == ',' )
			{
				toPrint += '+"\\t"';
				lastComma = true;
			}
			else if ( info.text == ';' )
				newLine = false;
			else if ( info.peekEndOfInstruction )
				break;
			info.setNextWord( end );
			end = info.peekNextWord();
			if ( info.peekEndOfInstruction )
				break;
			toPrint += '+';
			info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONSEMICOLON );
		}
		if ( lastComma )
			newLine = false;
	}
	else
	{
		toPrint += '""';
	}
	code = utilities.replaceStringInText( code, '%$P1', toPrint );
	code = utilities.replaceStringInText( code, '%$P2', newLine ? 'true' : 'false' );
	info.addLine( code );
	info.nextBlock2( endBlock );
};
specialCases.handlePrintUsing = function( info )
{
	info.addSourceReference();

	var newLine = '.';
	var code = 'aoz.currentScreen.currentTextWindow.printUsing(';
	info.waitingFunctionCount = 0;
	info.compileExpression( INFO.EXPFLAG_ENDONSEMICOLON );
	code += info.result;
	info.extractNextWord();
	var end = info.peekNextWord();
	code += ',[';
	if ( !info.peekEndOfInstruction )
	{
		info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONSEMICOLON );
		while( true )
		{
			end = info.peekNextWord();
			code += info.result;
			if ( ( info.text != ',' && info.text != ';' ) || info.peekEndOfInstruction )
				break;
			var c = info.text;
			info.setNextWord( end );			
			info.peekNextWord();
			if ( info.peekEndOfInstruction )
			{
				if ( c == ',' || c == ';' )
					newLine = c;
				break;
			}
			code += ',';
			info.compileExpression( INFO.EXPFLAG_ENDONCOLON | INFO.EXPFLAG_ENDONCOMMA | INFO.EXPFLAG_ENDONSEMICOLON );
		}
	}
	code += '],"' + newLine + '");';
	info.addLine( code );
	info.nextBlock2();
};



//////////////////////////////////////////////////////////////////////////////////////////
