const PATH = require( 'path' );
const FS = require( 'fs' );
const http = require('http');
const request = require( 'request' );
const { app } = require( 'electron' );
//const DecompressZip = require( 'decompress-zip' );
const INLY = require( 'inly' );
const TARGZ = require( 'targz' );

class AOZUpdater
{
	
	constructor()
	{
		this.url = atom.aozConfig.installInformation.updateUrl;
		this.tmHandler = undefined;
		
		//this.checkUpdate();
		this.img1 = document.createElement( 'img' );
		this.img1.src = atom.IMAGES.PROGRESS_BAR;
		
		this.img2 = document.createElement( 'img' );
		this.img2.src = atom.IMAGES.PROGRESS_BAR_FULL;
		
		this.canvas = document.createElement( 'canvas' );
		this.canvas.width = 160;
		this.canvas.height = 16;
		
		this.text = document.createElement( 'span' );
		this.text.setAttribute( 'class', 'update_text' );
		this.text.innerHTML = atom.aozLang.getTerm( 'updater:downloading' );
		document.body.appendChild( this.text );

		this.updateBarImg = document.createElement( 'img' );
		this.updateBarImg.setAttribute( 'class', 'update_bar' );
		this.updateBarImg.width = 160;
		this.updateBarImg.height = 16;
		document.body.appendChild( this.updateBarImg );

		this.purcent = 0;
		this.tmStart = Date.now();
		this.updateBar();
		this.processing = false;
		
		this.hideBar();
		this.checkUpdate();
	};
	
	checkUpdate()
	{
		if( this.tmHandler )
		{
			clearTimeout( this.tmHandler );
			this.tmHandler = undefined;
		}
		
		if( !atom.aozConfig.aoz_settings.autoupdate )
		{
			return;
		}
		
		var self = this;
		if( atom.updateNumber == undefined )
		{
			atom.updateNumber = 0;
		}
		
		http.get( this.url + '/update.php?action=check&number=' + atom.updateNumber + '&platform=' + process.platform + '&edu=' + ( ( atom.edu ) ? 'yes' : 'no' ), ( res ) =>
		{
			const { statusCode } = res;
			const contentType = res.headers[ 'content-type' ];
			
			let error;
			if( statusCode !== 200 )
			{
				error = new Error( 'Request Failed.\n' + statusCode );
			}
			else
			{
				if( !/^application\/json/.test( contentType ) )
				{
					error = new Error( 'Invalid content-type.\n' + contentType );
				}
			}	

			if( error )
			{
				res.resume();
				this.tmHandler = setTimeout( function()
				{
					self.checkUpdate();
				}, 15 * 60000 );				
				return;
			}

			res.setEncoding( 'utf8' );
			let rawData = '';
			res.on('data',( chunk ) => 
			{ 
				rawData += chunk;
			} );
			
			res.on( 'end', () =>
			{
				try
				{
					const json = JSON.parse( rawData );
					if( json.error != undefined )
					{
						if( json.error == '' )
						{
							atom.aozNotifier.show( atom.IMAGES.ICON_UPDATE, atom.aozLang.getTerm( 'updater:new-update-title' ),  atom.aozLang.getTerm( 'updater:new-update-message' ), function()
							{
								self.processing = true;
								self.purcent = 0;
								self.text.innerHTML = atom.aozLang.getTerm( 'updater:downloading' );
								self.showBar();
								self.updateBar();
								self.downloadDatas( json.data, json.restart );
							} );
						}
					}
				}
				catch( e )
				{
					console.error( e.message );
				}
			} );
				
		} ).on( 'error', ( e ) => 
		{
			//console.error( e.message );
		} );
		if( this.processing )
		{
			return;
		}
		
		this.tmHandler = setTimeout( function()
		{
			self.checkUpdate();
		}, 15 * 60000 );
		
	};

	downloadDatas( folder, restart )
	{
		var file_url = this.url + '/files/' + folder + '/datas.tar.gz'; 
		
		var received_bytes = 0;
		var total_bytes = 0;
		var self = this;
		
		var req = request(
		{
			method: 'GET',
			uri: file_url
		} );

		var out = FS.createWriteStream( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + 'datas.tar.gz' );
		req.pipe( out );

		req.on( 'response', function ( data ) {
			total_bytes = parseInt( data.headers[ 'content-length' ] );
		} );

		req.on( 'data', function( chunk ) {
			received_bytes += chunk.length;
			self.purcent = ( 100 / total_bytes ) * received_bytes;
		});

		req.on( 'end', function() {
			setTimeout( function()
			{
				self.processing = true;
				self.purcent = 0;
				self.text.innerHTML =  atom.aozLang.getTerm( 'updater:installing' );			
				self.updateDatas( restart );
			}, 2000 );
		} );		
	};
	
	updateDatas( restart )
	{
		var self = this;
		atom.currentModule = this;
		atom.currentModule.handle = function()
		{
			self.cleaning( restart )
		};
		
		if( FS.existsSync( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + 'datas.tar.gz' ) )
		{
			var target = atom.aozConfig.installInformation.commonPath;
			if( atom.updateNumber == '255' )
			{
				target = atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update';
			}				
			var untar = INLY( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + 'datas.tar.gz', target );
			untar.on( 'file', ( name ) => {
			} );

			untar.on( 'progress', ( purcent ) => {
				atom.currentModule.purcent = purcent;
			} );

			untar.on( 'error', ( error ) => {
				console.error( error );
				atom.currentModule.cleaning( restart );
			} );
			
			untar.on( 'end', () => {
				atom.currentModule.cleaning( restart );
			} );
		}
	};
	
	cleaning( restart )
	{
		atom.currentModule = undefined;

		this.text.innerHTML = atom.aozLang.getTerm( 'updater:finish' );
		this.hideBar();
		this.processing = false;

		atom.AOZIO.deleteFile( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + "datas.tar.gz" );	
		
		if( FS.existsSync( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/build' ) )
		{
			FS.rmdirSync( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/build', { recursive: true } )
		}

		if( FS.existsSync( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + "update_script.js" ) )
		{
			var updater = require( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + 'update_script' );
			if( updater && updater.execute )
			{
				updater.execute( function( error )
				{
					if( error )
					{
						atom.aozNotifier.show( atom.IMAGES.ICON_ERROR, atom.aozLang.getTerm( 'updater:error' ), atom.aozLang.getTerm( 'updater:error-message' ), function()
						{ 	
							self.hideBar();
							self.processing = false;
							self.checkUpdate();
						} );						
					};
					
					atom.AOZIO.deleteFile( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + 'aoz' + PATH.sep + 'update' + PATH.sep + "update_script.js" );
				
					if( restart )
					{
						atom.aozConfig.aoz_settings.releaseNotesAtStartup = true;
						atom.aozConfig.updateFiles();
						atom.aozNotifier.show( atom.IMAGES.ICON_RESTART, atom.aozLang.getTerm( 'updater:restart' ), atom.aozLang.getTerm( 'updater:restart-message' ), function()
						{ 	
							atom.restartApplication();
						}, false );
						
					}
					else
					{
						this.checkUpdate();	
						atom.aozNotifier( atom.IMAGES.ICON_INFO, atom.aozLang.getTerm( 'updater:aoz-updated' ) );
					}					
				} );
			}
		}
		else
		{
			
			if( restart )
			{
				atom.aozConfig.aoz_settings.releaseNotesAtStartup = true;
				atom.aozConfig.updateFiles();
				atom.aozNotifier.show( atom.IMAGES.ICON_RESTART, "AOZ Studio must be restarted.", "Click here to restart AOZ Studio IDE", function()
				{ 	
					atom.restartApplication();
				}, false );
				
			}
			else
			{
				this.checkUpdate();	
				atom.aozNotifier( atom.IMAGES.ICON_INFO, "AOZ Studio is updated!." );
			}	
		}		
	};
	
	showBar()
	{
		this.updateBarImg.style.display = 'block';
		this.text.style.display = 'block';
	};

	hideBar()
	{
		this.updateBarImg.style.display = 'none';
		this.text.style.display = 'none';
	};
	
	updateBar()
	{
		var tm = Date.now() - this.tmStart;
		if( tm > 500 )
		{
			if( this.purcent > 100 )
			{
				this.purcent = 100;
			}
			var ctx = this.canvas.getContext( '2d' );
			ctx.drawImage( this.img1, 0, 0, 473,81, 0, 0, 160, 16 );
			var w = ( 160 / 100 ) * ( Math.round( this.purcent ) );
			var w2 = ( 473 / 100 ) * ( Math.round( this.purcent ) );
			ctx.drawImage( this.img2, 0, 0, w2, 81, 0, 0, w, 16 );
			
			this.updateBarImg.src = this.canvas.toDataURL();
			this.tmStart = Date.now();
		}
		var self = this;
		
		setTimeout( function()
		{
			self.updateBar();
		}, 500 );
	}
	
};

module.exports = AOZUpdater;