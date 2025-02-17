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
// The QR Code Instructions Set
// By Baptiste Bideaux
// Version 1.0
// 17/10/2020
// (c) AOZ Studio 2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_qrcode( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFFSIENvZGUgSW5zdHJ1Y3Rpb25zIFNldCIsImF1dGhvciI6IkJ5IEJhcHRpc3RlIEJpZGVhdXgiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxLjAiLCJkYXRlIjoiMTcvMTAvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMjAiLCJzdGFydCI6InFyY29kZS5hb3oiLCJuYW1lIjoicXJjb2RlIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6W10sImZyIjpbXX0sImluY2x1ZGVQYXRocyI6W119LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJlcnJvcnMiOnt9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_qrcode';
	this.aoz[ "extension" + "Qrcode"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/qrcode/qrcode.aoz
		aoz.sourcePos="0:33:0";
		// Javascript
		this.aoz.qrcode = this;
		this.aoz.qrcode.utilities = aoz.utilities;
		this.aoz.qrcode.banks = aoz.banks;
		this.load_done = true;
		this.resultScan = "";
		this.scanEnabled = false;
		this.scanner = undefined;
		this.devices = undefined;
		this.options = 
		{
			cameraId: "user",
		};
		this.readerCamera = document.createElement( 'div' );
		this.readerCamera.setAttribute( 'id', 'reader' )
		document.body.appendChild( this.readerCamera );
		this.create = function( args )
		{
			var text = args[ 0 ];
			var numImage = args[ 1 ];
			var width = args[ 2 ];
			var height = args[ 3 ];
			if( text == undefined || text == null || text == '' )
			{
				throw 'qrcode_create_text_argument_missing';
			}
			if( numImage == undefined || numImage == null || isNaN( numImage ) )
			{
				throw 'qrcode_create_num_image_argument_missing';
			}
			if( width == undefined || width == null || isNaN( width ) )
			{
				throw 'qrcode_create_width_argument_missing';
			}
			if( height == undefined || height == null || isNaN( height ) )
			{
				throw 'qrcode_create_height_argument_missing';
			}
			this.load_done = false;
			var qr = qrcode( 0 , 'H' );
			qr.addData( text );
			qr.make();
			var canvas = document.createElement( 'canvas' );
			canvas.width = width;
			canvas.height = height;
			var img = document.createElement( 'img' );
			img.src = qr.createDataURL();
			var self = this;
			img.onload = function()
			{
				canvas.getContext( '2d' ).drawImage( this, 0, 0, width, height );
				self.aoz.qrcode.banks.insertImage( 'images', numImage, undefined, undefined, self.aoz.currentContextName, undefined, canvas );
				self.load_done = true;
			}
		};
		this.scan = function( value )
		{
			this.resultScan = "";
			this.scanEnabled = value;
			var self = this;
			Html5Qrcode.getCameras().then(devices => {
			  if( devices && devices.length ) {
				self.devices = devices;
			  }
			}).catch(err => {
			  throw 'qrcode_no_camera_available';
			});		
			if( this.scanner == undefined )
			{
				this.scanner = new Html5Qrcode( "reader" );
			}
			if( value )
			{
				const qrCodeSuccessCallback = message => 
				{
						console.log( message );
						if( self.scanEnabled )
						{
							self.resultScan = message;
						}
						this.scanner.stop();
						return;
				};
				this.scanner.start( { facingMode: { exact: this.options.cameraId } }, { fps: 10, qrbox: 250 }, qrCodeSuccessCallback );
			}
			else
			{
				if( this.scanner )
				{
					this.scanner.stop();
				}
			}
		};
		this.getResultScan = function()
		{
			if( this.resultScan && this.resultScan != "" )
			{
				var res = this.resultScan;
				this.resultScan = "";
				return res;
			}
			this.resultScan = "";
			return "";
		};
		this.getCamera = function( args )
		{
			try
			{
				var video = undefined;
				var elm = document.getElementById( 'reader' );
				if( elm  && elm.childNodes && elm.childNodes.length > 0 )
				{
					video = elm.childNodes[ 0 ];
				}
				if( video )
				{
					var image = document.createElement( 'canvas' );
					image.width = video.videoWidth;
					image.height = video.videoHeight;
					var ctx2 = image.getContext( '2d' );
					ctx2.drawImage( video, 0, 0 );
					ctx2.beginPath();
					ctx2.lineWidth = "6";
					ctx2.strokeStyle = "white";
					var size = video.videoWidth / 3;
					ctx2.rect( ( video.videoWidth - size ) / 2, ( video.videoHeight - size ) / 2, size, size );
					ctx2.stroke();
					var canvas = document.createElement( 'canvas' );
					canvas.width = args.width;
					canvas.height = args.height;
					var ctx = canvas.getContext( '2d' );
					ctx.drawImage( image, 0, 0, args.width, args.height );
					this.aoz.qrcode.banks.insertImage( 'images', args.image, undefined, undefined, this.aoz.currentContextName, undefined, canvas );
				}
			}
			catch( e )
			{
				console.log( e );
			}
		};
		this.load_wait = function()
		{
			return this.load_done;
		};
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
