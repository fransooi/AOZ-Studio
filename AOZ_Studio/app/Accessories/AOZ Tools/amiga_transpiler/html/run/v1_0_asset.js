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
// The Asset loader Instruction
// By Baptiste Bideaux
// Version 0.99
// 01/02/2020
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_asset( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIEFzc2V0IGxvYWRlciBJbnN0cnVjdGlvbiIsImF1dGhvciI6IkJ5IEJhcHRpc3RlIEJpZGVhdXgiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAwLjk5IiwiZGF0ZSI6IjAxLzAyLzIwMjAiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDE5Iiwic3RhcnQiOiJhc3NldC5hb3oiLCJuYW1lIjoiYXNzZXQifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_asset';
	this.aoz[ "module" + "Asset" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: D:/Programs/AOZ_Studio_SE/AOZ_Studio/app/aoz/languages/v1_0/asset/asset.aoz
		aoz.sourcePos="0:39:0";
		// Javascript
		this.aoz.ASSET = this;
		this.aoz.ASSET.utilities = aoz.utilities;
		this.aoz.ASSET.banks = aoz.banks;
		this.arrImages = undefined;
		this.arrAudios = undefined;
		this.arrAudioNames = undefined;
		this.arrVideos = undefined;
		this.arrSpriteSheet = undefined;
		this.arrScenes = undefined;
		this.arrJSON = undefined;
		this.arrHTML = undefined;
		this.arrFonts = undefined;
		this.timeoutHandle = null;
		this.timeOut = 60 * 1000;
		this.load_error = null;
		this.onLoadProcName = undefined;
		this.onErrorProcName = undefined;
			createjs.Sound.registerPlugins( [ createjs.WebAudioPlugin, createjs.HTMLAudioPlugin ] );
		this.load_done = true;
		this.loadAsset = function ( args )
		{
			var filename = args[ 0 ];
			var number = args[ 1 ];
			var directPath = args.length > 1 ? args[ 2 ] : false;
			var parts = filename.split(".");
			var ext = parts[ parts.length - 1 ];
			this.load_done = false;
			this.load_error = false;
			this.isHttp = false;
			if( filename.toLowerCase().indexOf( 'http' ) != 0 )
			{
				if ( !directPath )
				{
				var descriptor = this.aoz.filesystem.getFile( filename, { mustExist: true, asset: true } );
				filename = descriptor.path;
			}
			}
			else
			{
				this.isHttp = true;
			}
			var self = this;
			switch( ext.toLowerCase() )
			{
				case 'ttf':
				case 'woff':
				case 'woff2':
				case 'eot':
					if( self.arrFonts && self.arrFonts[ number ] )
					{
						this.load_done = true;
						return;
					}
					var cssFont = document.createElement( 'style' );
					cssFont.setAttribute( 'type', 'text/css' );
					cssCode = "@font-face {\r\n";
					cssCode += "font-family: '" + number + "';\r\n";
					if( ext.toLowerCase() == 'eot' )
					{
						cssCode += "src: url('" + filename + "?#iefix') format('embedded-opentype');\r\n"
					}
					if( ext.toLowerCase() == 'ttf' )
					{
						cssCode += "src: url('" + filename + "') format('truetype');\r\n"
					}
					if( ext.toLowerCase() == 'woff' )
					{
						cssCode += "src: url('" + filename + "') format('woff');\r\n"
					}
					if( ext.toLowerCase() == 'woff2' )
					{
						cssCode += "src: url('" + filename + "') format('woff2');\r\n"
					}
					cssCode += "}"
					cssFont.innerHTML = cssCode;
					document.body.appendChild( cssFont );
					if( self.arrFonts == undefined  )
					{
						self.arrFonts = {};
					}
					self.arrFonts[ number ] = number;
					application.aoz.fonts.fontInformations.push(
					{
						contextNames: 
						{
							application: true,
							ext_debugging: true
						},
						fonts:
						{
							index: number,
							name: number,
							type: 'google'
						},
						index: number,
						name: number,
						type: 'google'
					} );					
					this.load_done = true;				
					break;
				case 'mod':
				case 'xm':
					if( self.isHttp )
					{
						throw "http_not_supported_by_format";
					}
					this.aoz.extensionTracker.load( [ filename, number ] );
					this.aoz.extensionTracker.load_done = true;
					this.load_done = true;
					self.assetLoaded( filename );
					break;
				case 'htm':
				case 'html':
				case 'xhtml':
				case 'dhtml':
					var self = this;	
					if( self.isHttp )
					{
						throw "http_not_supported_by_format";
					}
					if( self.arrHTML && self.arrHTML[ 'html_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function()
					{
						if( this.readyState == 4 && this.status == 200 )
						{
							try
							{
								var html = this.responseText;
								if( self.arrHTML == undefined )
								{
									self.arrHTML = {};
								}
								self.arrHTML[ 'html_' + number ] = html;
								self.assetLoaded( filename );
								self.load_done = true;
							}
							catch( e )
							{
								self.assetError( filename, "Invalid HTML format.");
								throw 'html_wrong_format';
							}
						}
					};
					xhttp.open("GET", filename + '?update=' + Date.now(), true);
					xhttp.send()
					break;
				case 'js':
					var script = document.createElement( 'script' );
					script.setAttribute( 'type', 'text/javascript' );
					var self = this;
					if( self.isHttp )
					{
						script.setAttribute( 'src', filename );
						document.getElementsByTagName( "head" )[ 0 ].appendChild( script );
						self.assetLoaded( filename );
						self.load_done = true;
					}
					else
					{
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function()
						{
							if( this.readyState == 4 && this.status == 200 )
							{
								try
								{
									var js = this.responseText;
									script.innerHTML = js;
									document.body.appendChild( script );
									self.assetLoaded( filename );
									self.load_done = true;
								}
								catch( e )
								{
									self.assetError( filename, "Invalid HTML format.");
									throw 'html_wrong_format';
								}
							}
						};
						xhttp.open("GET", filename + '?update=' + Date.now(), true);
						xhttp.send();
					}
					break;
				case 'css':
					var link = document.createElement( 'link' );
					link.setAttribute( 'type', 'text/css' );
					link.setAttribute( 'rel', 'stylesheet' );
					link.setAttribute( 'href', filename + '?update=' + Date.now() );
					document.getElementsByTagName( "head" )[ 0 ].appendChild( link );
					this.load_done = true;
					self.assetLoaded( filename );
					break;
				case 'json':
				case 'sfx':
					var self = this;
					if( self.isHttp )
					{
						throw "http_not_supported_by_format";
					}
					if( self.arrJSON && self.arrJSON[ 'json_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function()
					{
						if( this.readyState == 4 && this.status == 200 )
						{
							self.load_done = true;
							try
							{
								json = JSON.parse( this.responseText );
								if( self.arrJSON == undefined )
								{
									self.arrJSON = {};
								}
								self.arrJSON[ 'json_' + number ] = json;
								if( self.aoz.JSON )
								{
									self.aoz.JSON.root = json;
								}
								self.assetLoaded( filename );
							}
							catch( e )
							{
								self.assetError( filename, "Invalid JSON format.");
								throw 'json_wrong_format';
							}
						}
					};
					xhttp.open("GET", filename + '?update=' + Date.now(), true);
					xhttp.send()
					break;
				case 'sprite':
					var self = this;
					if( self.isHttp )
					{
						throw "http_not_supported_by_format";
					}
					if( self.arrSpriteSheet && self.arrSpriteSheet[ 'spr_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var xhttp = new XMLHttpRequest();
					xhttp.onreadystatechange = function()
					{
						if( this.readyState == 4 && this.status == 200 )
						{
							self.load_done = true;
							try
							{
								json = JSON.parse( this.responseText );
								if( json.images )
								{
									var dirname = filename.match(/(.*)[\/\\]/)[1]||'';
									for( var i = 0; i < json.images.length; i++ )
									{
										console.log( json.images[ i ] );
										json.images[ i ] = dirname + "/" + json.images[ i ];
										console.log( json.images[ i ] );
									}
								}
								if( self.arrSpriteSheet == undefined )
								{
									self.arrSpriteSheet = {};
								}
								var spritesheet = new createjs.SpriteSheet( json );
								spritesheet.realFramerate = json.framerate;
								self.arrSpriteSheet[ 'spr_' + number ] = spritesheet;
								self.assetLoaded( filename );
							}
							catch( e )
							{
								self.assetError( filename, "Invalid Sprite Sheet format.");
								throw 'json_wrong_format';
							}
						}
					};
					xhttp.open("GET", filename + '?update=' + Date.now(), true);
					xhttp.send()
					break;
				case 'jpg':
				case 'jpeg':
				case 'png':
				case 'gif':
				case 'svg':
				case 'bmp':
					var self = this;			
					if( self.aoz.ASSET.arrImages && self.aoz.ASSET.arrImages[ 'image_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var image = new Image();
					image.onload = function()
					{
						if( self.aoz.ASSET.arrImages == undefined )
						{
							self.aoz.ASSET.arrImages = {};
						}
						self.aoz.ASSET.arrImages[ 'image_' + number ] = image;
						var ncanvas = document.createElement( 'canvas' );
						ncanvas.width = this.width;
						ncanvas.height = this.height;
						var nctx = ncanvas.getContext( '2d' );
						nctx.drawImage( this, 0, 0 );
						self.aoz.ASSET.banks.insertImage( 'images', number, undefined, undefined, self.aoz.currentContextName, undefined, ncanvas );
						self.load_done = true;
						self.assetLoaded( filename );
					}
					image.onerror = function()
					{
						self.load_error = 'file_not_found';
					}
					image.src = filename + '?update=' + Date.now();
					break;
				case 'iff':
				case 'ilbm':
					var self = this;
					if( self.isHttp )
					{
						throw "http_not_supported_by_format";
					}
					if( self.aoz.ASSET.arrImages && self.aoz.ASSET.arrImages[ 'image_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var iffCanvas = document.createElement( 'canvas' );
					iffCanvas.width = 320;
					iffCanvas.height = 256;
					var iff = new IffContainer( '', iffCanvas );
					var self = this;
					var xhr = new XMLHttpRequest();
					xhr.open( 'GET', filename + '?update=' + Date.now(), true );
					xhr.responseType = 'arraybuffer';
					onFinishedDelegate = function( iff )
					{
						if( self.aoz.ASSET.arrImages == undefined )
						{
							self.aoz.ASSET.arrImages = {};
						}
						self.aoz.ASSET.arrImages[ 'image_' + number ] = iff.canvas;
						self.aoz.ASSET.banks.insertImage( 'images', number, undefined, undefined, self.aoz.currentContextName, undefined, iff.canvas );
						self.load_done = true;
						self.assetLoaded( filename );
					};
					xhr.onload = function( event )
					{
						iff.arrayBuffer = xhr.response;
						if( iff.arrayBuffer && xhr.status < 400 )
						{
							parseIffChunk( iff, 0, iff.arrayBuffer.byteLength );
							drawIffImage( iff );
							if( iff.color_animations.length > 0 && animate )
							{
								iff.startColorCycling();
							}
							if( onFinishedDelegate )
							{
								switch( typeof onFinishedDelegate )
								{
									case 'function':
										onFinishedDelegate( iff );
										break;
									case 'string':
										eval( onFinishedDelegate );
										break;
								}
							}
						} else {
							self.assetError( filename, "Invalid IFF/ILBM format.");
							reportError( xhr, path, iff.canvas );
						}
					}
					xhr.send();
					break;
				case 'mp3':
				case 'wav':
				case 'ogg':
				case 'wma':
					var self = this;
					if( self.aoz.ASSET.arrAudios && self.aoz.ASSET.arrAudios[ 'audio_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					if( self.aoz.ASSET.arrAudios == undefined )
					{
						self.aoz.ASSET.arrAudios = {};
						self.aoz.ASSET.arrAudioNames = new Array();
					}
					var audio = new Audio( filename + '?update=' + Date.now() );
					audio.addEventListener( 'loadeddata', ( event ) => {
						self.aoz.ASSET.arrAudioNames.push( 'audio_' + number );
						self.aoz.ASSET.arrAudios[ 'audio_' + number ] =	audio;
						self.assetLoaded( filename );
						self.load_done = true;
					} )
					;
					audio.addEventListener( 'error', ( event ) => {
						self.assetError( filename, "Cannot load file.");
						self.load_error = { error: "cannot_load_file", parameter: filename };
					} );
					break;
				case 'mp4':
				case 'mpeg4':
				case 'avi':
				case 'wmv':
				case 'ogv':
				case 'webm':
					var self = this;
					if( self.aoz.ASSET.arrVideos && self.aoz.ASSET.arrVideos[ 'video_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					var video = document.createElement( 'video' );
					video.setAttribute( 'volume', '1.0' );
					video.setAttribute( 'preload', 'auto' );
					video.setAttribute( 'src', filename + '?update=' + Date.now() );
					if( this.aoz.ASSET.arrVideos == undefined )
					{
						this.aoz.ASSET.arrVideos = {};
					}
					video.oncanplay = function()
					{
						this.loaded = true;
						this.isPlaying = false;
						self.load_done = true;
						self.assetLoaded( filename );
						clearTimeout( self.timeoutHandle );
					};
					this.aoz.ASSET.arrVideos[ 'video_' + number ] = video;
					self.timeoutHandle = setTimeout( function()
					{
						self.assetError( filename, "Cannot load file.");
						self.load_error = 'file_not_found';
					}, self.timeOut );
					break;
				case 'obj':
				case 'fbx':
				case 'dae':
				case 'gltf':
				case 'aoz3d':
					var self = this;
					if( self.aoz.ASSET.arrScenes && self.aoz.ASSET.arrScenes[ 'scene_' + number ] )
					{
						self.assetLoaded( filename );
						self.load_done = true;
						return;							
					}
					if( this.aoz.ASSET.arrScenes == undefined )
					{
						this.aoz.ASSET.arrScenes = {};
					}
					if( ext == 'gltf' )
					{
						var loader = new THREE.GLTFLoader();
					}
					if( ext == 'obj' )
					{
						loader = new THREE.OBJLoader();
					}
					if( ext == 'fbx' )
					{
						loader = new THREE.FBXLoader();
					}
					if( ext == 'dae' )
					{
						loader = new THREE.ColladaLoader();
					}
					if( ext == 'aoz3d' )
					{
						loader = new THREE.ObjectLoader();
					}
					this.ext = ext;
					this.number = number;
					var self = this;
					loader.load( filename + '?update=' + Date.now(), function ( _model )
					{
						if( self.arrScenes == undefined )
						{
							self.arrScenes = {};
						}
						if( ext == 'aoz3d' )
						{
							self.arrScenes[ 'scene_' + number ] = _model;
							var xhr = new XMLHttpRequest();
							xhr.onload = function( progressEvent )
							{
								var json = JSON.parse( xhr.responseText );
								self.arrScenes[ 'scene_' + number ].aozEvents = json.object.aozEvents;							
							};
							var async = true;
							xhr.open( "GET", filename + '?update=' + Date.now(), async );
							xhr.send();
						}
						if( ext == 'gltf' || ext == 'dae' )
						{
							self.arrScenes[ 'scene_' + number ] = _model.scene;
						}
						if ( ext == 'obj' || ext == 'fbx' )
						{
							if( _model && _model.scene )
							{
								self.arrScenes[ 'scene_' + number ] = _model.scene;
							}
							else
							{
								var scene = new THREE.Scene();
								if( _model.children )
								{
									for( var c = 0; c < _model.children.length; c++ )
									{
										scene.add( _model.children[ c ] );
									}
								}
								else
								{
									scene.add( _model );
								}
								self.arrScenes[ 'scene_' + number ] = scene;
							}
						}
						if( _model.animations )
						{
							self.arrScenes[ 'scene_' + number ].animations = _model.animations;
							self.arrScenes[ 'scene_' + number ].mixer = undefined;
						}
						self.arrScenes[ 'scene_' + number ].ext = ext;
						self.load_done = true;
						self.assetLoaded( filename );
					}, undefined, function ( error )
					{
						self.assetError( filename, "Cannot load file.");
						self.load_done = true;
					});
					break;
			}
		}
		this.getAssetProperty = function( index, path )
		{
			if( this.aoz.ASSET && this.aoz.ASSET.arrJSON && this.aoz.ASSET.arrJSON[ 'json_' + index ] )
			{
				var value = eval( 'this.aoz.ASSET.arrJSON[ \'json_\' + index ].' + path );
				if( value == undefined )
				{
					return "";
				}
				return value;
			}
			throw 'json_index_not_opened';
		}
		this.assetLoaded = function( filename )
		{
			var self = this;
			if( this.onLoadProcName != undefined && this.onLoadProcName != '' )
			{
				self.aoz.runProcedure( self.onLoadProcName, { FILENAME$: filename } );
			}
		}
		this.assetError = function( path, message )
		{
			var self = this;
			if( this.onErrorProcName != undefined && this.onErrorProcName != '' )
			{
				self.aoz.runProcedure( self.onErrorProcName, { PATH$: path, MESSAGE$: message } );
			}
		}
		this.isAssetLoaded = function( index, type )
		{
			if( index == undefined || index == '' )
			{
				throw "asset_index_not_defined";
			}
			var result = false;
			switch( type.toLowerCase() )
			{
				case 'image':
					result = ( this.arrImages != undefined && this.arrImages[ 'image_' + index ] != undefined );
					break;
				case 'spritesheet':
					result = ( this.arrSpriteSheet != undefined && this.arrSpriteSheet[ 'spr_' + index ] != undefined );
					break;
				case 'audio':
					result = ( this.arrAudios != undefined && this.arrAudios[ 'audio_' + index ] != undefined );
					break;
				case 'video':
					result = ( this.arrVideos != undefined && this.arrVideos[ 'video_' + index ] != undefined );
					break;
				case '3d':
					result = ( this.arrScenes != undefined && this.arrScenes[ 'scene_' + index ] != undefined );
					break;
				case 'json':
					result = ( this.arrJSON != undefined && this.arrJSON[ 'json_' + index ] != undefined );
					break;
			}
			return result;
		}
		this.load_wait = function()
		{
			if ( this.load_error )
			{
				var error = this.load_error;
				this.load_error = null;
				throw error;
			}
			return this.load_done;
		};
		// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
