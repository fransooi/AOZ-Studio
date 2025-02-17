/*@****************************************************************************
*
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
*
****************************************************************************@*/
//
// The File System Instructions
// By Francois Lionet
// Version 0.99
// 13/12/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function v1_0_filesystem( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIEZpbGUgU3lzdGVtIEluc3RydWN0aW9ucyIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDAuOTkiLCJkYXRlIjoiMTMvMTIvMjAxOSIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTkiLCJzdGFydCI6ImZpbGVzeXN0ZW0uYW96IiwibmFtZSI6ImZpbGVzeXN0ZW0ifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbImluc3RydWN0aW9uX25vdF9pbXBsZW1lbnRlZCJdLCJlcnJvcnMiOnsiZW4iOltdLCJmciI6W119LCJkaXNwbGF5RW5kQWxlcnQiOmZhbHNlLCJ1c2VBc3NldHNSZXNvdXJjZXMiOmZhbHNlfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_filesystem';
	this.aoz[ "module" + "Filesystem" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/filesystem/filesystem.aoz
		aoz.sourcePos="0:40:0";
		// Javascript
			this.utilities = aoz.utilities;
			this.filterOut = '';
			this.filenameWidth = 30;
			this.data = [];
			this.openFiles = [];
			this.load_done = false;
			this.load_count = 0;
			this.error = null;
			this.errorParameter = '';
			this.nextLine = String.fromCharCode( 10 );
			this.load = function( args )
			{
				var path = args[ 0 ];
				var number = args[ 1 ];
				var extension = this.aoz.utilities.getFilenameExtension( path );
				if ( extension.toLowerCase() == 'abk' )
					return this.loadABK( args );
				if ( extension.toLowerCase() == 'abs' )
					throw 'instruction_not_implemented';
				var descriptor = this.aoz.filesystem.getFile( args[ 0 ], { mustExist: true } );
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.loadFile( descriptor, { responseType: 'binary' }, function( response, arrayBuffer, extra )
				{
					if ( response )
					{
					}
					self.load_done = true;
				} );
			};
			this.saveVariables = function( args )
			{
				var self = this;
				this.load_done = false;
				var path = args[ 0 ];
				var saveObject = [];
				for ( var v = 1; v < args.length; v++ )
				{
					var variable = args[ v ];
					var varObj;
					if ( !variable.dimensions || ( variable.dimensions && variable.dimensions.length > 0 ) )
					{
						varObj =
						{
							variable: variable,
							value: this.aoz.getVariable( variable )
						};
					}
					else
					{
						var varptr = this.aoz.getVarptr( variable );
						varObj =
						{
							variable: variable,
							dimensions: varptr[ variable.name ].dimensions,
							array: varptr[ variable.name ].array
						}
					}
					saveObject.push( varObj );
				}
				var text = 'AOZVars:' + JSON.stringify( saveObject );
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: true } );
				this.aoz.filesystem.saveFile( descriptor, text, { encoding: 'utf8' }, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = 'cannot_save_file';
						self.errorParameter = path;
					}
					self.load_done = true;
				} );
			};
			this.loadVariables = function( args )
			{
				var self = this;
				this.load_done = false;
				var path = args[ 0 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: true } );
				this.aoz.filesystem.loadFile( descriptor, { responseType: 'utf-8' }, function( response, data, extra )
				{
					self.load_done = true;
					if ( response )
					{
						if ( data.substring( 0, 8 ) == 'AOZVars:' )
						{
							var saveObject;
							try
							{
								saveObject = JSON.parse( data.substring( 8 ) );
							}
							catch( e )
							{}
							if ( saveObject )
							{
								for ( var v = 0; v < saveObject.length; v++ )
								{
									var variable = saveObject[ v ].variable;
									if ( !variable.dimensions || ( variable.dimensions && variable.dimensions.length > 0 ) )
									{
										self.aoz.setVariable( variable, saveObject[ v ].value )
									}
									else
									{
										var varptr = self.aoz.getVarptr( variable );
										varptr[ variable.name ].dimensions = saveObject[ v ].dimensions;
										varptr[ variable.name ].array = saveObject[ v ].array;
									}
								}
								return;
							}
						}
					}
					self.error = 'cannot_load_file';
					self.errorParameter = path;
				} );
			}
			this.loadText = function( args )
			{
				var self = this;
				this.load_done = false;
				var path = args[ 0 ];
				var variable = args[ 1 ];
				var varptr = this.aoz.getVarptr( variable )[ variable.name ];
				var tags = args[ 3 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: true } );
				this.aoz.filesystem.loadFile( descriptor, { responseType: 'utf-8' }, function( response, data, extra )
				{
					if ( response )
					{
						self.aoz.setVariable( variable, data );
					}
					else
					{
						self.error = 'cannot_load_file';
						self.errorParameter = path;
					}
					self.load_done = true;
				} );
			};
			this.saveText = function( args )
			{
				var self = this;
				var path = args[ 0 ];
				var text = args[ 1 ];
				var options = [];
				this.load_done = false;
				this.aoz.filesystem.saveFile( path, text, options, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = 'cannot_save_file';
						self.errorParameter = path;
					}
					self.load_done = true;
				} );
			};
			this.loadImage = function( args )
			{
				var self = this;
				this.load_done = false;
				var path = args[ 0 ];
				var number = args[ 1 ];
				var tags = args[ 2 ];
				var isIff = args[ 3 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: true } );
				var extension = this.aoz.utilities.getFilenameExtension( args[ 0 ] );
				if ( extension.toLowerCase() == 'iff' )
					isIff = true;
				if ( isIff )
				{
					this.aoz.filesystem.loadFile( descriptor, { responseType: 'binary' }, function( response, data, extra )
					{
						if ( response )
						{
							var iffCanvas = document.createElement( 'canvas' );
							iffCanvas.width = 16;
							iffCanvas.height = 16;
							try
							{
								var iff = new IffContainer( '', iffCanvas );
								iff.arrayBuffer = data;
								parseIffChunk( iff, 0, iff.arrayBuffer.byteLength );
								drawIffImage( iff );
								var screen = self.aoz.getScreenOrCreateOne( { index: number, width: iffCanvas.width, height: iffCanvas.height, numberOfColors: 32, pixelMode: 0 } );
								screen.pasteCanvas( iffCanvas, { x: 0, y: 0, width: typeof number == 'undefined' ? iffCanvas.width : undefined, height: typeof number == 'undefined' ? iffCanvas.height : undefined } );
							}
							catch ( e )
							{
								self.error = 'bad_iff_format';
								self.errorParameter = path;
							}
						}
						else
						{
							self.error = 'cannot_load_file';
							self.errorParameter = path;
						}
						self.load_done = true;
					}, number );
				}
				else
				{
					this.aoz.filesystem.loadFile( descriptor, { responseType: 'image' }, function( response, image, extra )
					{
						if ( response )
						{
							var screen = self.aoz.getScreenOrCreateOne( { index: number, width: image.width, height: image.height, numberOfColors: 32, pixelMode: 0 } );
							var horizontal = 'center';
							var vertical = 'middle';
							var resize = 'fit';
							if ( tags )
							{
								var temp;
								if ( ( temp = self.aoz.utilities.getTag( tags, [ 'left', 'center', 'right' ] ) ) != '' )
									horizontal = temp;
								if ( ( temp = self.aoz.utilities.getTag( tags, [ 'top', 'middle', 'bottom' ] ) ) != '' )
									vertical = temp;
								if ( ( temp = self.aoz.utilities.getTag( tags, [ 'fit', 'paste' ] ) ) != '' )
									resize = temp;
							}
							var ratio = 1;
							if ( resize == 'fit' )
							{
								var hRatio = screen.dimension.width / image.width;
								var vRatio = screen.dimension.height / image.height;
								ratio = Math.min ( hRatio, vRatio );
							}
							var x, y, width, height;
							switch ( horizontal )
							{
								case 'center':
									x = screen.dimension.width / 2 - image.width / 2 * ratio;
									break;
								case 'right':
									x = screen.dimension.width - image.width * ratio;
									break;
								default:
								case 'left':
									x = 0;
									break;
							}
							switch ( vertical )
							{
								case 'middle':
									y = screen.dimension.height / 2 - image.height / 2 * ratio;
									break;
								case 'bottom':
									y = screen.dimension.height - image.height * ratio;
									break;
								default:
								case 'top':
									y = 0;
									break;
							}
							screen.pasteCanvas( image, { x: x, y: y, width: image.width * ratio, height: image.height * ratio } );
						}
						else
						{
							self.error = 'cannot_load_file';
							self.errorParameter = path;
						}
						self.load_done = true;
					}, number );
				}
			};
			this.saveImage = function( args )
			{
				var self = this;
				this.load_done = false;
				var path = args[ 0 ];
				var index = args[ 1 ];
				var parameter = args[ 2 ];
				parameter = typeof parameter == 'undefined' ? 0.8 : parameter;
				if ( parameter < 0 || parameter > 1 )
					throw { error: 'illegal_function_call', parameter: parameter };
				var descriptor = this.aoz.filesystem.getFile( path, { } );
				var extension = this.aoz.utilities.getFilenameExtension( args[ 0 ] );
				var type;
				var screen = this.aoz.currentScreen;
				if ( typeof index != 'undefined' )
					screen = this.aoz.getScreen( index );
				var arrayBuffer;
				switch ( extension )
				{
					case 'png':
						type = 'image/png';
						var data = screen.canvas.toDataURL( type, parameter );
						data = data.substring( 22 );
						arrayBuffer = this.aoz.utilities.convertStringToArrayBuffer( data );
						break;
					case 'jpg':
					case 'jpeg':
						var encoder = new pttJPEG();
						var bw = new encoder.ByteWriter();
						var data = screen.context.getImageData( 0, 0, screen.canvas.width, screen.canvas.height );
						var inImage = new encoder.pttImage( data );
						encoder.encode( parameter * 100, inImage, bw );
						arrayBuffer = bw.getBuffer();
						break;
					case 'gif':
					default:
						throw 'image_format_not_supported';
				}
				this.aoz.filesystem.saveFile( descriptor, arrayBuffer, { encoding: null }, function( response, data, extra )
				{
					if ( !response )
						self.error = data;
					self.load_done = true;
				} );
			};
			this.load_wait = function()
			{
				if ( this.load_count == 0 )
				{
					if ( this.load_done == true )
					{
						if ( this.error )
							throw { error: this.error, parameter: this.errorParameter };
						return true;
					}
				}
				return false;
			};
			this.loadABK = function( args )
			{
				var path = args[ 0 ];
				var bankNumber = args[ 1 ];
				var tags = args[ 2 ];
				var self = this;
				this.loadIt( path, function( response, block, extra )
				{
					if ( response )
					{
						var convertedBank = self.convert_bank( 'bank', block , { convert: true });
						if ( convertedBank )
						{
							bankNumber = typeof bankNumber != 'undefined' ? bankNumber : convertedBank.number;
							self.aoz.banks.erase( bankNumber, true );
							switch ( convertedBank.type )
							{
								case 'images':
									bank = self.aoz.banks.reserve( bankNumber, convertedBank.type, 0, self.aoz.currentContextName );
									for ( var i = 0; i < convertedBank.data.images.length; i++ )
									{
										self.aoz.banks.insertImage( convertedBank.type, i + 1, undefined, undefined, tags, bankNumber, convertedBank.data.images[ i ], convertedBank.data.hotSpots[ i ] );
										bank.setHotSpot( i + 1, { x:convertedBank.data.hotSpots[ i ].x, y:convertedBank.data.hotSpots[ i ].y } );
									}
									bank.setPalette( convertedBank.data.palette );
									self.aoz.banks.updateBank( bank, bank.index, self.aoz.currentContextName );
									break;
								case 'samples':
									self.load_done = false;
									bank = self.aoz.banks.reserve( bankNumber, 'samples', convertedBank.data.length, self.aoz.currentContextName );
									var count = convertedBank.data.length;
									for ( var i = 0; i < convertedBank.data.length; i++ )
									{
										bank.addSound( i, 'sample_' + i, convertedBank.data[ i ].buffer, tags, function( response, data, extra )
										{
											count--;
											if ( count == 0 )
											{
												self.load_done = true;
											}
										} );
									}
									self.aoz.banks.updateBank( bank, bank.index, self.aoz.currentContextName );
									break;
								case 'tracker':
								case 'data':
								case 'work':
								default:
									bank = self.aoz.banks.reserve( bankNumber, convertedBank.type, convertedBank.data.length, self.aoz.currentContextName );
									bank.getElement( 1 ).copyFrom( 0, convertedBank.data, 0, convertedBank.data.length );
									self.aoz.banks.updateBank( bank, bank.index, self.aoz.currentContextName );
									break;
							}
						}
					}
				} );
			}
			this.loadIt = function( path, callback, extra )
			{
				var descriptor = this.aoz.filesystem.getFile( path );
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.loadFile( descriptor, { responseType: 'binary' }, function( response, arrayBuffer, extra )
				{
					var block;
					if ( response )
						block = new MemoryBlock( self.aoz, arrayBuffer, 'big' );
					else
					{
						self.error ='cannot_load_file';
						self.errorParameter = path;
					}
					callback( response, block, extra );
					self.load_done = true;
				}, extra );
			};
			this.save = function( args )
			{
				throw 'not_implemented';
			};
			this.saveBank = function( args )
			{
				throw 'not_implemented';
			};
			this.bLoad = function( args )
			{
				var path = args[ 0 ];
				var start = args[ 1 ];
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.loadBinary( path, start, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = path;
					}
					self.load_done = true;
				} );
			};
			this.bSave = function( args )
			{
				var startBlock = this.aoz.getMemoryBlockFromAddress( args[ 1 ] );
				var endBlock = this.aoz.getMemoryBlockFromAddress( args[ 2 ] );
				if ( startBlock != endBlock )
					throw { error: 'illegal_function_call', parameters: [ startBlock, endBlock ] };
				var self = this;
				this.load_done = false;
				var options = { start: args[ 1 ], end: args[ 2 ] };
				this.aoz.filesystem.saveBinary( args[ 0 ], options, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = args[ 0 ];
					}
					self.load_done = true;
				} );
			};
			this.bSaveLength = function( args )
			{
				if ( args[2] == 'full' )
				{
					var bank = args[1];
					args[2] = aoz.banks.getLength(bank);
					args[1] = aoz.banks.getStart(bank);
				}
				var self = this;
				this.load_done = false;
				var options = { start: args[ 1 ], length: args[ 2 ] };
				this.aoz.filesystem.saveBinary( args[ 0 ], options, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = args[ 0 ];
					}
					self.load_done = true;
				} );
			};
			this.rename = function( args )
			{
				this.load_done = false;
				var self = this;
				this.aoz.filesystem.rename( args[ 0 ], args[ 1 ], {}, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = args[ 0 ];
					}
					self.load_done = true;
				} );
			};
			this.kill = function( args )
			{
				this.load_done = false;
				var self = this;
				this.aoz.filesystem.kill( args[ 0 ], {}, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = args[ 0 ];
					}
					self.load_done = true;
				} );
			};
			this.mkDir = function( args )
			{
				this.load_done = false;
				var self = this;
				this.aoz.filesystem.mkDir( args[ 0 ], {}, function( response, data, extra )
				{
					if ( !response )
					{
						self.error = data;
						self.errorParameter = args[ 0 ];
					}
					self.load_done = true;
				} );
			};
			this.exist = function( args )
			{
				this.load_done = false;
				var self = this;
				this.aoz.filesystem.exist( args[ 0 ], {}, function( response, data, extra )
				{
					self.result = response;
					self.load_done = true;
				} );
			};
			this.dFree = function( args )
			{
				this.load_done = false;
				var self = this;
				this.aoz.filesystem.dFree( args[ 0 ], {}, function( response, data, extra )
				{
					if ( response )
						self.result = data;
					else
						self.error = data;
					self.load_done = true;
				} );
			};
			this.setInput = function( char1, char2 )
			{
				this.nextLine = String.fromCharCode( char1 );
				if ( typeof char2 != 'undefined' && char2 >= 0 )
					this.nextLine += String.fromCharCode( char2 );
			};
			this.openOut = function( args )
			{
				var port = args[ 0 ];
				var path = args[ 1 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: false, askForReplace: false } );
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( this.openFiles[ port ] )
					throw 'file_already_opened';
				this.openFiles[ port ] =
				{
					path: descriptor.path,
					file: '',
					in: false,
					out: true,
					random: false,
					pof: 0,
					modified: true
				};
				this.load_done = true;
			};
			this.openIn = function( args )
			{
				var port = args[ 0 ];
				var path = args[ 1 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: true, noErrors: true } );
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( this.openFiles[ port ] )
					throw 'file_already_opened';
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.loadFile( descriptor, { responseType: 'text' }, function( response, data, extra )
				{
					if ( response )
					{
						self.openFiles[ port ] =
						{
							path: descriptor.path,
							file: data,
							in: true,
							out: false,
							random: false,
							pof: 0,
							modified: false
						};
					}
					else
					{
						self.error = data;
						self.errorParameter = '';
					}
					self.load_done = true;
				} );
			};
			this.append = function( args )
			{
				var port = args[ 0 ];
				var path = args[ 1 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: false, noErrors:true } );
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( this.openFiles[ port ] )
					throw 'file_already_opened';
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.exist( descriptor.path, {}, function( response, data, extra )
				{
					if ( response )
					{
						self.aoz.filesystem.loadFile( descriptor, { responseType: 'text' }, function( response, data, extra )
						{
							if ( response )
							{
								self.openFiles[ port ] =
								{
									path: descriptor.path,
									file: data,
									in: false,
									out: true,
									random: false,
									pof: data.length,
									modified: false
								}
							}
							else
							{
								self.error = error;
								self.errorParameter = '';
							}
							self.load_done = true;
						} );
					}
					else
					{
						self.openFiles[ port ] =
						{
							path: descriptor.path,
							file: '',
							in: false,
							out: true,
							random: false,
							pof: 0,
							modified: true
						};
						self.load_done = true;
					}
				} );
			};
			this.print = function( port, text, newLine )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( !file.out )
					throw 'file_type_mismatch';
				if ( newLine )
					text += this.nextLine;
				file.file = file.file.substring( 0, file.pof ) + text + file.file.substring( file.pof + text.length );
				file.pof += text.length;
				file.modified = true;
				this.load_done = true;
			};
			this.input = function( port, variables, commas )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( !file.in )
					throw 'file_type_mismatch';
				for ( var v = 0; v < variables.length; v++ )
				{
					var variable = variables[ v ];
					if ( file.pof >= file.file.length )
						throw 'end_of_file';
					var posComma = -1;
					if ( commas )
						posComma = file.file.indexOf( ',', file.pof );
					posComma = posComma >= 0 ? posComma : file.file.length;
					var posNewLine = file.file.indexOf( this.nextLine, file.pof );
					posNewLine = posNewLine >= 0 ? posNewLine :  file.file.length;
					var delta = 0;
					if ( posComma < file.file.length )
						delta = 1;
					if ( posNewLine < file.file.length )
						delta = this.nextLine.length;
					var pos = posComma < posNewLine ? posComma : posNewLine;
					var text = file.file.substring( file.pof, pos );
					file.pof += text.length + delta;
					var value;
					if ( variable.type == 0 )
						value = parseInt( text );
					else if ( variable.type == 1 )
						value = parseFloat( text );
					else
						value = text;
					if ( variable.type != 2 && isNaN( value ) )
						value = 0;
					this.aoz.setVariable( variable, value );
				}
				this.load_done = true;
			};
			this.eof = function( port )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var result = this.openFiles[ port ].pof >= this.openFiles[ port ].file.length;
				return result;
			};
			this.lof = function( port )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( file.random )
					throw 'file_type_mismatch';
				var result = file.file.length;
				return result;
			};
			this.setPof = function( port, position )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( file.random )
					throw 'file_type_mismatch';
				if ( position < 0 || position > file.file.length )
					throw { error: 'illegal_function_call', parameter: position };
				file.pof = position;
			};
			this.getPof = function( port )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				if ( file.random )
					throw 'file_type_mismatch';
				return this.openFiles[ port ].pof;
			};
			this.close = function( args )
			{
				var port = args[ 0 ];
				var self = this;
				if ( typeof port != 'undefined' )
				{
					this.load_done = false;
					this.error = false;
					this.errorParameter = '';
					if ( port < 1 )
						throw { error: 'illegal_function_call', parameter: port };
					if ( !this.openFiles[ port ] )
						throw 'file_not_opened';
					var file = this.openFiles[ port ];
					if ( file.modified )
					{
						var descriptor = self.aoz.filesystem.getFile( file.path, { noErrors:true } );
						if ( descriptor.error )
							callback( false, descriptor.error, extra );
						this.aoz.filesystem.saveFile( descriptor, file.file, { encoding: 'utf8' }, function( response, data, extra )
						{
							if ( response )
								self.openFiles[ port ] = null;
							self.load_done = true;
						} );
					}
					else
					{
						this.openFiles[ port ] = null;
						this.load_done = true;
					}
				}
				else
				{
					var errors;
					this.load_done = true;
					this.load_count = this.openFiles.length;
					for ( var f = 0; f < this.openFiles.length; f++ )
					{
						var file = this.openFiles[ f ];
						if ( file && file.modified )
						{
							var descriptor = this.aoz.filesystem.getFile( file.path, { noErrors: true } );
							if ( descriptor.error )
							{
								this.error = descriptor.error;
								this.load_count--;
								continue;
							}
							this.aoz.filesystem.saveFile( descriptor, file.file, { encoding: 'utf8' }, function( response, data, extra )
							{
								self.openFiles[ extra ] = null;
								if ( !response )
									self.error = data;
								self.load_count--;
							}, f );
						}
						else
						{
							this.openFiles[ f ] = null;
							this.load_count--;
						}
					}
				}
			};
			this.openRandom = function( args )
			{
				var port = args[ 0 ];
				var path = args[ 1 ];
				var descriptor = this.aoz.filesystem.getFile( path, { mustExist: false, noErrors:true } );
				if ( descriptor.error )
					throw descriptor.error;
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( this.openFiles[ port ] )
					throw 'file_already_opened';
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.exist( descriptor.path, {}, function( response, data, extra )
				{
					if ( response )
					{
						self.aoz.filesystem.loadFile( descriptor, { responseType: 'text' }, function( response, data, extra )
						{
							if ( response )
							{
								self.openFiles[ port ] =
								{
									path: descriptor.path,
									file: data,
									in: false,
									out: false,
									random: true,
									pof: data.length,
									fields: [],
									variables: [],
									modified: false
								};
							}
							else
							{
								self.error = error;
								self.errorParameter = path;
							}
							self.load_done = true;
						} );
					}
					else
					{
						self.openFiles[ port ] =
						{
							path: descriptor.path,
							file: '',
							in: false,
							out: false,
							random: true,
							pof: 0,
							fields: [],
							variables: [],
							modified: true
						};
						self.load_done = true;
					}
				} );
			};
			this.field = function( port, variables, fields )
			{
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( !file.random )
					throw 'file_type_mismatch';
				file.variables = variables;
				file.fields = fields;
				file.fieldsLength = 0;
				for ( var f = 0; f < fields.length; f++ )
					file.fieldsLength += fields[ f ];
				this.load_done = true;
			};
			this.put = function( args )
			{
				var port = args[ 0 ];
				var field = args[ 1 ];
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( !file.random )
					throw 'file_type_mismatch';
				if ( typeof file.fieldsLength == 'undefined' )
					throw { error: 'illegal_function_call', parameter: '(fields not defined)' };
				if ( typeof field == 'undefined' )
					throw { error: 'illegal_function_call', parameter: '(fields not defined)' };
				field--;
				if ( field < 0 )
					throw { error: 'illegal_function_call', parameter: field };
				var fileNumberOfFields = file.file.length / file.fieldsLength;
				if ( Math.floor( file.file.length / file.fieldsLength ) != fileNumberOfFields )
					throw 'corrupted_file';
				var field$ = '';
				for ( var f = 0; f < file.fieldsLength; f++ )
					field$ += ' ';
				if ( fileNumberOfFields < field )
				{
					for ( var f = fileNumberOfFields; f < field; f++ )
						file.file += field$;
				}
				var pos = 0;
				for ( var v = 0; v < file.variables.length; v++ )
				{
					var text = this.aoz.getVariable( file.variables[ v ] ).substring( 0, file.fields[ v ] );
					field$ = field$.substring( 0, pos ) + text + field$.substring( pos + text.length );
					pos += file.fields[ v ];
				}
				file.file = file.file.substring( 0, field * file.fieldsLength ) + field$ + file.file.substring( ( field + 1 ) * file.fieldsLength );
				file.modified = true;
				this.load_done = true;
			};
			this.get = function( args )
			{
				var port = args[ 0 ];
				var field = args[ 1 ];
				if ( port < 1 )
					throw { error: 'illegal_function_call', parameter: port };
				if ( !this.openFiles[ port ] )
					throw 'file_not_opened';
				var file = this.openFiles[ port ];
				if ( !file.random )
					throw 'file_type_mismatch';
				if ( typeof file.fieldsLength == 'undefined' )
					throw { error: 'illegal_function_call', parameter: '(fields not defined)' };
				if ( typeof field == 'undefined' )
					throw { error: 'illegal_function_call', parameter: '(fields not defined)' };
				field--;
				if ( field < 0 )
					throw { error: 'illegal_function_call', parameter: field };
				var fileNumberOfFields = file.file.length / file.fieldsLength;
				if ( Math.floor( file.file.length / file.fieldsLength ) != fileNumberOfFields )
					throw 'corrupted_file';
				if ( field >= fileNumberOfFields )
					throw 'end_of_file';
				var pos = field * file.fieldsLength;
				for ( var v = 0; v < file.variables.length; v++ )
				{
					var text = file.file.substr( pos, file.fields[ v ] );
					this.aoz.setVariable( file.variables[ v ], text );
					pos += file.fields[ v ];
				}
				this.load_done = true;
			};
			this.fileLength = function( args )
			{
				var path = args[ 0 ];
				this.load_done = false;
				this.result = 0;
				var self = this;
				var descriptor = this.aoz.filesystem.getFile( path );
				this.aoz.filesystem.stat( path, {}, function( response, data, extra )
				{
					if ( response )
					{
						if ( !data.isFile )
							self.error = 'cannot_read_directory';
						self.result = data.size;
					}
					self.load_done = true;
				} );
			};
			this.dir = function( args )
			{
				var path = args[ 0 ];
				var descriptor = this.aoz.filesystem.getFile( path );
				this.load_done = false;
				var message = this.aoz.errors.getError( 'directory_of' ).message;
				message = this.utilities.replaceStringInText( message, '%1', descriptor.path );
				this.aoz.currentScreen.currentTextWindow.print( message, true );
				var self = this;
				this.aoz.filesystem.dirFirst( descriptor, {}, function( response, stat, extra )
				{
					if ( response )
					{
						if ( stat )
						{
							var line = self.getFileDescription( stat, true );
							self.aoz.currentScreen.currentTextWindow.print( line, true );
							do
							{
								self.aoz.filesystem.dirNext( {}, function( response, stat2, extra )
								{
									if ( stat2 )
									{
										var line = self.getFileDescription( stat2, true );
										self.aoz.currentScreen.currentTextWindow.print( line, true );
									}
									else
									{
										self.load_done = true;
									}
								} );
							} while( self.load_done == false );
						}
						else
						{
							self.load_done = true;
						}
					}
					else
					{
						self.error = data;
						self.errorParameter = '';
						self.load_done = true;
					}
				} );
			};
			this.getFileDescription = function( stat, format )
			{
				var line = typeof stat.name != 'undefined' ? stat.name : '';
				if ( format )
				{
					var filename = line.substring( 0, Math.min( this.filenameWidth, line.length ) );
					while( filename.length < this.filenameWidth )
						filename += ' ';
					if ( stat.isFile )
						line = '  ' + filename + stat.size;
					else
						line = '* ' + filename;
				}
				else
				{
					if ( !stat.isFile )
						line = '* ' + line;
				}
				return line;
			};
			this.filter = function( name, filter )
			{
				if ( filter == '' )
					return true;
				name = this.noCase ? name : name.toLowerCase();
				filter = this.noCase ? filter : filter.toLowerCase();
				var f = 0;
				for ( var n = 0; n < name.length; n++ )
				{
					var char = name.charAt( n );
					if ( char == '.' )
						break;
					var charFilter = filter.charAt( f );
					if ( charFilter == '*' )
					{
						n = name.indexOf( '.' ) >= 0 ? name.indexOf( '.' ) : name.length;
						break;
					}
					if ( charFilter != '?' )
					{
						if ( char != charFilter )
							return false;
					}
					f++;
				}
				if ( n == name.length )
					return true;
				f = filter.indexOf( '.' );
				if ( f < 0 )
					return false;
				for ( ++n, ++f; n < name.length; n++ )
				{
					var char = name.charAt( n );
					var charFilter = filter.charAt( f );
					if ( charFilter == '*' )
						return true;
					if ( charFilter != '?' )
					{
						if ( char != charFilter )
							return false;
					}
					f++;
				}
				return true;
			};
			this.dirFirst = function( args )
			{
				var path = args[ 0 ];
				var self = this;
				this.result = '';
				var descriptor = this.aoz.filesystem.getFile( path );
				this.aoz.filesystem.dirFirst( descriptor, {}, function( response, data, extra )
				{
					if ( response )
					{
						if ( data )
							self.result = self.getFileDescription( data );
					}
					else
					{
						self.error = data;
						self.errorParameter = '';
					}
					self.load_done = true;
				} );
			};
			this.dirNext = function( args )
			{
				var self = this;
				this.result = '';
				this.aoz.filesystem.dirNext( {}, function( response, data, extra )
				{
					if ( response )
					{
						if ( data )
							self.result = self.getFileDescription( data );
					}
					else
					{
						self.error = data;
						self.errorParameter = '';
					}
					self.load_done = true;
				} );
			};
			this.driveFirst = function( args )
			{
				var self = this;
				self.errorParameter = '';
				this.result = '';
				this.aoz.filesystem.driveFirst( {}, function( response, data, extra )
				{
					if ( response )
						self.result = ( !data ? '' : data );
					else
						self.error = data;
					self.load_done = true;
				} );
			};
			this.driveNext = function( args )
			{
				var self = this;
				self.errorParameter = '';
				this.result = '';
				this.aoz.filesystem.driveNext( {}, function( response, data, extra )
				{
					if ( response )
						self.result = ( !data ? '' : data );
					else
						self.error = data;
					self.load_done = true;
				} );
			};
			this.setDir = function( width, filterOut )
			{
				width = typeof width == 'undefined' ? 30 : width;
				if ( width <= 0 )
					throw { error: 'illegal_function_call', parameter: width };
				this.filenameWidth = width;
				if ( typeof filterOut != 'undefined' )
					this.filterOut = filterOut;
			};
			this.discInfo = function( args )
			{
				var self = this;
				self.errorParameter = '';
				this.aoz.filesystem.discInfo( args[ 0 ], {}, function( response, data, extra )
				{
					if ( response )
					{
						self.result = data;
					}
					else
					{
						self.error = data;
					}
					self.load_done = true;
				} );
			};
			this.fSel = function( args )
			{
				var path = args.path;
				var defaultFile = typeof args.default != 'undefined' ? args.default : '';
				var options = {};
				var descriptor = undefined;
				if ( path )
				{
					descriptor = this.aoz.filesystem.getFile( path );
					if ( descriptor.extension )
					{
						options.filters =
						[
							[ '*.' + descriptor.extension, descriptor.extension ]
						];
						descriptor.path = descriptor.path.substring( 0, descriptor.path.length - ( descriptor.extension.length + descriptor.filename.length ) );
						descriptor.filename = '';
						descriptor.extension = '';
					}
				}
				if ( !options.filters )
				{
					options.filters =
					[
						[ 'All Files', '*.*' ]
					];
				}
				if ( typeof args.type != 'undefined' )
				{
					options.type = args.type.toLowerCase();
					if ( options.type != 'load' && options.type != 'save' )
					{
						throw { error: 'illegal_function_call', parameter: options.type };
					}
				}
				else
					options.type = 'load';
				options.title = '';
				if ( args.title1 )
					options.title = args.title1;
				if ( args.title2 )
					options.title += ' ' + args.title2;
				var self = this;
				this.load_done = false;
				this.aoz.filesystem.openFileRequester( descriptor, options, function( response, data, extra )
				{
					if ( response )
						self.result = data;
					else
						self.result = defaultFile;
					self.load_done = true;
				} );
			};
			var ID_AMOS = 0x414D4F53;
			var ID_AmBs = 0x416D4273;
			var ID_AmBk = 0x416D426B;
			var ID_AmSp = 0x416D5370;
			var ID_AmIc = 0x416D4963;
			var IFF_ILBM_HEADER_LEN = 0xb0;
			var iff_ilbm_header =
			[
				'F', 'O', 'R', 'M',    	/* 00 FORM                        */
				0,   0,   0,   0,     	/* 04   form length               */
				'I', 'L', 'B', 'M',    	/* 08   ILBM                      */
				'B', 'M', 'H', 'D',    	/* 0c   BMHD                      */
				0,   0,   0,   20,    	/* 10     bmhd chunk length (20)  */
				0,   0,               	/* 14     width                   */
				0,   0,               	/* 16     height                  */
				0,   0,               	/* 18     x offset (0)            */
				0,   0,              	/* 1a     y offset (0)            */
				0,                    	/* 1c     number of bitplanes     */
				0,                    	/* 1d     masking (0)             */
				0,                    	/* 1e     compression (0)         */
				0,                    	/* 1e     reserved1 (0)           */
				0,   0,               	/* 20     transparent colour (0)  */
				1,                    	/* 22     x aspect (1)            */
				1,                    	/* 23     x aspect (1)            */
				0,   0,               	/* 24     page width              */
				0,   0,               	/* 26     page height             */
				'C', 'A', 'M', 'G',    	/* 28   CAMG                      */
				0,   0,   0,   4,     	/* 2c     camg chunk length (4)   */
				0,   0,   0,   0,     	/* 30     viewmode                */
				'G', 'R', 'A', 'B',    	/* 34   GRAB                      */
				0,   0,   0,   4,     	/* 38     grab chunk length (4)   */
				0,   0,               	/* 3C     x hotspot               */
				0,   0,               	/* 3E     y hotspot               */
				'C', 'M', 'A', 'P',    	/* 40   CMAP                      */
				0,   0,   0,   96    	/* 44     cmap chunk length (96)  */
			];
			var IFF_8SVX_HEADER_LEN = 0x30;
			var iff_8svx_header =
			[
				'F', 'O', 'R', 'M',    	/* 00 FORM                        */
				0,   0,   0,   0,     	/* 04   form length               */
				'8', 'S', 'V', 'X',    	/* 08   8SVX                      */
				'V', 'H', 'D', 'R',    	/* 0c   VHDR                      */
				0,   0,   0,   20,    	/* 10     vhdr chunk length (20)  */
				0,   0,   0,   0,     	/* 14     one-shot length         */
				0,   0,   0,   0,     	/* 18     repeat length (0)       */
				0,   0,   0,   0,     	/* 1c     average rate (0)        */
				0,   0,               	/* 20     frequency in hz         */
				1,                    	/* 22     number of octaves (1)   */
				0,                   	/* 23     compression mode (0)    */
				0,   1,   0,   0,     	/* 24     volume (0x10000)        */
				'B', 'O', 'D', 'Y',    	/* 28   BODY                      */
				0,   0,   0,   0      	/* 2c     body length             */
			];
			this.convert_amos = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var result;
				if ( block.length < 4 )
				{
					throw 'unknown_bank_format';
				}
				else
				{
					switch ( block.leek( 0 ) )
					{
					case ID_AMOS:
						result = this.convert_source( name, block, options );
						break;
					case ID_AmBs:
						result = this.convert_banks( name, block, options );
						break;
					case ID_AmBk:
					case ID_AmSp:
					case ID_AmIc:
						result = this.convert_bank( name, block, options );
						break;
					default:
						throw 'unknown_bank_format';
					}
				}
				return result;
			};
			this.convert_source = function( name, block, options )
			{
				var result;
				options = typeof options == 'undefined' ? { convert: true } : options;
				if ( block.length < 30 )
				{
					throw 'unknown_bank_format';
				}
				else 1
				{
					var src_len = block.leek( 16 ) + 20;
					var header = block.peek$( 0, 16 );
					if ( src_len < block.length )
					{
						var block_bank = new MemoryBlock( this.aoz, 2, 'big' );
						block_bank.setFromMemoryBlock( block, src_len );
						result = this.convert_banks( name, block_bank, options );
					}
				}
				return result;
			}
			function convert_banks( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				if ( block.length < 6)
				{
					throw 'unknown_bank_format';
				}
				else
				{
					var count = 0;
					var result = {};
					var num_banks = block.deek( 4 );
					var bank_pos = 6;
					while ( num_banks-- )
					{
						var bank_len = this.get_bank_length( block, bank_pos );
						var bank_num = this.get_bank_number( block, bank_pos );
						var bank_type = this.get_bank_type( block, bank_pos );
						var block_bank = new MemoryBlock( this.aoz, 2, 'big' );
						block_bank.setFromMemoryBlock( block, bank_pos, bank_pos + bank_len );
						if ( bank_num > 0)
						{
							var outname = "bank" + bank_num + ".abk";
							var bankResult = this.convert_bank( outname, block_bank, options );
							if ( bankResult )
								result[ count++ ] = bankResult;
						}
						bank_pos += bank_len;
					}
				}
				return result;
			}
			this.convert_bank = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var bank_length = this.get_bank_length( block );
				if ( !bank_length )
					return;
				var bank_num = this.get_bank_number( block );
				var id = block.leek( 0 );
				var result, type;
				switch ( id )
				{
					case ID_AmSp:
						type = 'images';
						result = this.convert_sprites( name, block, options );
						break;
					case ID_AmIc:
						type = 'icons';
						result = this.convert_sprites( name, block, options );
						break;
					case ID_AmBk:
						{
							var id2 = block.peek$( 12, 8 );
							if ( id2 == "img" )
							{
								type = 'pacpic';
								result = this.convert_pacpic( name, block, options );
							}
							else if ( id2 == "Samples " )
							{
								type = 'samples';
								result = this.convert_samples( name, block, options );
							}
							else if ( id2 == "Tracker " )
							{
								type = 'tracker';
								result = this.convert_tracker( name, block, options );
							}
							else
							{
								type = 'data';
								result = this.convert_data( name, block, options );
							}
						}
						break;
					default:
						throw 'unknown_bank_format';
				}
				return { type: type, number: bank_num, data: result };
			};
			this.convert_sprites = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var sprites = { images: [], palette: [], hotSpots: [] };
				var num_sprites = block.deek( 4 );
				var sp = 6;
				var pal = block.length - 64;
				for ( var i = 0; i < num_sprites; i++ )
				{
					var w, h, d, sp_len, ilbm_len, line, plane;
					var body;
					w = block.deek( sp + 0 ) * 2;
					h = block.deek( sp + 2 );
					d = block.deek( sp + 4 );
					sp_len = w * h * d;
					ilbm_len = IFF_ILBM_HEADER_LEN + sp_len;
					var ilbmBlock = new MemoryBlock( this.aoz, ilbm_len, 'big' );
					ilbmBlock.copyArray( 0, iff_ilbm_header, 'byte' );
					ilbmBlock.loke( 0x04, ilbm_len - 8 );
					ilbmBlock.doke( 0x14, w * 8 );  				/* width */
					ilbmBlock.doke( 0x16, h );      				/* height */
					ilbmBlock.poke( 0x1c, d & 0xFF );          		/* number of bitplanes */
					ilbmBlock.doke( 0x24, w * 8 );  				/* page width */
					ilbmBlock.doke( 0x26, h );      				/* page height */
					ilbmBlock.copyFrom( 0x3C, block, sp + 6, 4 ); 	/* x/y hotspot */
					ilbmBlock.poke$( 0xA8, "BODY" );
					ilbmBlock.loke( 0xAC, sp_len ); 				/* body length */
					sprites.hotSpots[ i ] = { x: block.deek( sp + 6, true ), y: block.deek( sp + 8, true ) };
					var color0;
					for ( var j = 0; j < 32; j++ )
					{
						var c = block.deek( pal + j * 2 );
						var r = ( (c >> 8) & 0xF ) * 0x11;
						var g = ( (c >> 4) & 0xF ) * 0x11;
						var b = ( (c     ) & 0xF ) * 0x11;
						ilbmBlock.poke( 0x48 + ( j * 3 ) + 0, r );
						ilbmBlock.poke( 0x48 + ( j * 3 ) + 1, g );
						ilbmBlock.poke( 0x48 + ( j * 3 ) + 2, b );
						sprites.palette[ j ] = this.aoz.utilities.getRGBAString( r, g, b, 255 );
						if ( j == 0 )
							color0 = { r: r, g: g, b: b };
					}
					var body = IFF_ILBM_HEADER_LEN;
					for ( var line = 0; line < h; line++ )
					{
						for ( var plane = 0; plane < d; plane++ )
						{
							ilbmBlock.copyFrom( body, block, sp + 10 + line * w + plane * w * h, w );
							body += w;
						}
					}
					if ( options.convert )
					{
						var iffCanvas = document.createElement( 'canvas' );
						iffCanvas.width = 8; 	//( w <= 0 ? 8 : w );
						iffCanvas.height = 8;	//( h <= 0 ? 8 : h );
						var iff = new IffContainer( '', iffCanvas );
						iff.arrayBuffer = ilbmBlock.buffer;
						parseIffChunk( iff, 0, ilbmBlock.buffer.byteLength );
						drawIffImage( iff );
						var context = iffCanvas.getContext( '2d' );
						this.aoz.utilities.remapBlock( context, [ color0 ], [ { r: 0, g: 0, b: 0, a: 0 } ], { x: 0, y: 0, width: iffCanvas.width, height: iffCanvas.height } );
						sprites.images[ i ] = iffCanvas;
					}
					else
					{
						sprites.images[ i ] = ilbmBlock;
					}
					sp += 10 + sp_len;
				}
				return sprites;
			}
			this.convert_pacpic = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var end = block.length;
				var s, pal, picdata, rledata, points, ilbm;
				var i, j, k, l, bplcon0, width, ilbm_width, lumps,
					lump_height, ilbm_height, bitplanes, ilbm_len, ilbm_line,
					rledata_offset, points_offset;
				if ( block.length < 24)
					return;
				i = block.leek( 20 );
				if ( block.length > 134 && (i == 0x12031990 || i == 0x00031990 || i == 0x12030090) )
				{
					bplcon0 = block.deek( 20 + 20 ); 		/* screen mode */
					pal = 20 + 26; 							/* palette */
					s = 110; 								/* picture header */
				}
				else if (block.length > 44 && (i == 0x06071963 || i == 0x06070063))
				{
					bplcon0 = block.deek( 20 + 14 ) << 12 | 0x200; 	/* guess BPLCON0 */
					pal = -1; 										/* no palette */
					s = 20; 										/* picture header */
				}
				else
				{
					throw 'unknown_picpac_header';
				}
				width 				= block.deek( s + 8 );
				lumps            	= block.deek( s + 10 );
				lump_height      	= block.deek( s + 12 );
				bitplanes        	= block.deek( s + 14 );
				rledata_offset   	= block.leek( s + 16 );
				points_offset    	= block.leek( s + 20 );
				if (rledata_offset > ( block.length - s) || points_offset > (block.length - s))
				{
					return;
				}
				ilbm_width = width;
				if (ilbm_width & 1)
					ilbm_width++;
				ilbm_line = ilbm_width * bitplanes;
				ilbm_height = lumps * lump_height;
				ilbm_len = IFF_ILBM_HEADER_LEN + ilbm_line * ilbm_height;
				var ilbmBlock = new MemoryBlock( this.aoz, ilbm_len, 'big' );
				var plane, rbit, rrbit, picbyte, rlebyte;
				ilbmBlock.copyArray( 0, iff_ilbm_header, 'byte' );
				ilbmBlock.loke( 0x04, ilbm_len - 8 );
				ilbmBlock.doke( 0x14, ilbm_width * 8 );  				/* width */
				ilbmBlock.doke( 0x16, ilbm_height );     				/* height */
				ilbmBlock.poke( 0x1c, bitplanes & 0xFF );          		 /* number of bitplanes */
				ilbmBlock.doke( 0x24, ilbm_width * 8 );		  			/* page width */
				ilbmBlock.doke( 0x26, ilbm_height );     				/* page height */
				ilbmBlock.loke( 0x30, bplcon0 );         				/* viewmode */
				ilbmBlock.poke$( 0xA8, "BODY" );
				ilbmBlock.loke( 0xAC, ilbm_len - IFF_ILBM_HEADER_LEN); 	/* body length */
				var palette = [];
				for ( var i = 0; i < 32; i++)
				{
					var c = ( pal >= 0 ) ? block.deek( pal + i*2 ) : (i & 0x0F) * 0x111;
					var r = ((c >> 8) & 0xF) * 0x11;
					var g = ((c >> 4) & 0xF) * 0x11;
					var b = ((c     ) & 0xF) * 0x11;
					ilbmBlock.poke( 0x48 + (i * 3) + 0, r );
					ilbmBlock.poke( 0x48 + (i * 3) + 1, g );
					ilbmBlock.poke( 0x48 + (i * 3) + 2, b );
					palette[ i ] = this.aoz.utilities.getRGBAString( r, g, b );
				}
				rbit = 7;
				rrbit = 6;
				picdata = block.peek( s + 24 );
				rledata = block.peek( s + rledata_offset );
				points  = block.peek( s + points_offset );
				picbyte = block.peek( picdata++ );
				rlebyte = block.peek( rledata++ );
				if ( block.peek( points ) & 0x80 )
					rlebyte = block.peek( rledata++ );
				plane = IFF_ILBM_HEADER_LEN;
				for (i = 0; i < bitplanes; i++)
				{
					var lump_start = plane;
					for (j = 0; j < lumps; j++)
					{
						var lump_offset = lump_start;
						for (k = 0; k < width; k++)
						{
							var d = lump_offset;
							for (l = 0; l < lump_height; l++)
							{
								if (rlebyte & (1 << rbit--))
								{
									picbyte = block.peek( picdata++ );
									if (picdata > end)
									{
										return;
									}
								}
								ilbmBlock.poke( d, picbyte );
								d += ilbm_line;
								if (rbit > 7)
								{
									rbit = 7;
									if (block.peek( points ) & (1 << rrbit--))
									{
										rlebyte = block.peek( rledata++ );
										if (rledata > end)
										{
											return;
										}
									}
									if (rrbit > 7)
									{
										rrbit = 7, points++;
										if (points > end)
										{
											return;
										}
									}
								}
							}
							lump_offset++;
						}
						lump_start += ilbm_line * lump_height;
					}
					plane += ilbm_width; 		/* ILBM interleaved bitplanes */
				}
				if ( options.convert )
				{
					var iff = new IffContainer();
					iff.arrayBuffer = arrayBuffer;
					parseIffChunk( iff, 0, ilbmBlock.buffer.byteLength );
					drawIffImage( iff );
					return { palette: palette, image: null /*loadIffBuffer( undefined, iff.canvas )*/ };
				}
				return ilbmBlock;
			};
			this.convert_samples = function( name, block, options )
			{
				options = typeof options == 'undefined' ? {} : options;
				var samples = [];
				var num_samples;
				if (block.length < 22)
					return;
				num_samples = block.deek( 20 );
				if (block.length < 22 + (num_samples * 4))
					return;
				for ( var i = 0; i < num_samples; i++)
				{
					var offset = block.leek( 22 + i*4 ) + 22;
					var freq, sam_len, svx_len;
					if (offset > block.length)
						return;
					name = block.peek$( offset, 6 );
					freq    = block.deek( offset + 8 );
					sam_len = block.leek( offset + 10 );
					{
						sam_len = (block.length - (offset + 14));
					}
					svx_len = IFF_8SVX_HEADER_LEN + sam_len;
					var svxBlock = new MemoryBlock( this.aoz, svx_len, 'big');
					svxBlock.copyArray(0, iff_8svx_header, 'byte');
					svxBlock.loke( 0x04, svx_len - 8);
					svxBlock.doke( 0x20, freq);
					svxBlock.loke( 0x2C, sam_len);
					svxBlock.copyFrom( 0x30, block, offset + 14, sam_len );
					if ( options.convert )
					{
						samples[ i ] = svxBlock;
					}
					else
					{
						samples[ i ] = svxBlock;
					}
				}
				return samples;
			};
			this.convert_tracker = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var mod_len = block.length - 20;
				var bank_block = new MemoryBlock( this.aoz, mod_len, 'big' );
				bank_block.copyFrom( 0, block, 20, mod_len );
				return bank_block;
			}
			this.convert_data = function( name, block, options )
			{
				options = typeof options == 'undefined' ? { convert: true } : options;
				var bank_len = block.length - 20;
				var bank_block = new MemoryBlock( this.aoz, bank_len, 'big' );
				bank_block.copyFrom( 0, block, 20, bank_len );
				return bank_block;
			}
			this.get_bank_length = function( block, offset )
			{
				offset = typeof offset == 'undefined' ? 0 : offset;
				if ( block.length  >= 6 && ( block.leek( offset + 0 ) == ID_AmSp || block.leek(offset + 0 ) == ID_AmIc ) )
				{
					var num_sprites = block.deek( offset + 4 );
					var pos = 6, w, h, d;
					while ( num_sprites-- )
					{
						if ( pos + 10 > block.length )
							return 0;
						w = block.deek( offset + pos ) * 2;
						h = block.deek( offset + pos + 2 );
						d = block.deek(	offset + pos + 4 );
						pos += 10 +  w * h * d;
					}
					pos += 64; /* include palette */
					return pos > block.length ? 0 : pos;
				}
				else if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk )
				{
					var bank_len = ( block.leek( offset + 8 ) & 0x0FFFFFFF ) + 20 - 8;
					return bank_len > block.length ? 0 : bank_len;
				}
				return 0;
			};
			this.get_bank_number = function( block, offset )
			{
				offset = typeof offset == 'undefined' ? 0 : offset;
				if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmSp )
				{
					return 1; /* Sprites always bank 1 */
				}
				if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmIc )
				{
					return 2; /* Icons always bank 2 */
				}
				if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk)
				{
					return block.deek( 4 );
				}
				return 0;
			};
			this.get_bank_type = function( block, offset )
			{
				offset = typeof offset == 'undefined' ? 0 : offset;
				if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmSp )
				{
					return "Sprites";
				}
				if ( block.length >= 6 && block.leek( offset + 0 ) == ID_AmIc )
				{
					return "Icons";
				}
				if ( block.length >= 20 && block.leek( offset + 0 ) == ID_AmBk )
				{
					var type = block.extractString( offset + 12, 8 );
					return utilities.trimString( type, { right: true } );
				}
				return null;
			};
			// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
