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
// Network Instructions
// By Baptiste Bideaux
// Version 0.99
// 20/03/2020
// (c) AOZ Studio 2019-2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_net( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiTmV0d29yayBJbnN0cnVjdGlvbnMiLCJhdXRob3IiOiJCeSBCYXB0aXN0ZSBCaWRlYXV4IiwidmVyc2lvbiI6IlZlcnNpb24gMC45OSIsImRhdGUiOiIyMC8wMy8yMDIwIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAxOS0yMDIwIiwic3RhcnQiOiJuZXQuYW96IiwibmFtZSI6Im5ldCJ9LCJjb21waWxhdGlvbiI6eyJub1dhcm5pbmciOltdLCJlcnJvcnMiOnsiZW4iOlsidXJsX21pc3Npbmc6XHRcdFx0XHRcdFx0XHRcdDx1cmw+IGFyZ3VtZW50IG5vdCBkZWZpbmVkIiwiYXJnc19taXNzaW5nOlx0XHRcdFx0XHRcdFx0XHQ8YXJncz4gYXJndW1lbnQgbm90IGRlZmluZWQiLCJpbmNvbXBsZXRlX2FyZ3M6XHRcdFx0XHRcdFx0ICAgIEluY29tcGxldGUgYXJndW1lbnRzIiwid3JvbmdfbWV0aG9kOlx0XHRcdFx0XHRcdFx0XHRXcm9uZyBtZXRob2QgdG8gc2VuZCB0aGUgcmVxdWVzdCIsIndyb25nX3Jlc3BvbnNlX3R5cGU6XHRcdFx0XHRcdFx0SW5jb3JyZWN0IHJlc3BvbnNlIHR5cGUgd2FpdGluZyIsInByb2NlZHVyZV9zdWNjZXNzX21pc3Npbmc6XHRcdFx0XHRcdFN1Y2Nlc3MgcHJvY2VkdXJlIG5hbWUgbWlzc2luZyIsInN1Y2Nlc3NfcHJvY2VkdXJlX25vdF9leGlzdHM6XHRcdFx0ICAgIFN1Y2Nlc3MgcHJvY2VkdXJlIG5vdCBmb3VuZCIsInByb2NlZHVyZV9lcnJvcl9taXNzaW5nOlx0XHRcdFx0XHRFcnJvciBwcm9jZWR1cmUgbmFtZSBtaXNzaW5nIiwiZXJyb3JfcHJvY2VkdXJlX25vdF9leGlzdHM6XHRcdFx0ICAgIEVycm9yIHByb2NlZHVyZSBub3QgZm91bmQiLCJyZXF1ZXN0X2ZhaWxlZDogICAgICAgICAgICAgXHRcdFx0ICAgIFRoZSByZXF1ZXN0IGhhcyBmYWlsZWQsIHN0YXR1czogJTEgKG1vcmUgaW5mbyBpbiBicm93c2VyIGNvbnNvbGUpIl0sImZyIjpbInVybF9taXNzaW5nOlx0XHRcdFx0XHRcdFx0XHRBcmd1bWVudCA8dXJsPiBub24gZOlmaW5pIiwiYXJnc19taXNzaW5nOlx0XHRcdFx0XHRcdFx0XHRBcmd1bWVudCA8YXJncz4gbm9uIGTpZmluaSIsImluY29tcGxldGVfYXJnczpcdFx0XHRcdFx0XHQgICAgQXJndW1lbnRzIGluY29tcGxldHMiLCJ3cm9uZ19tZXRob2Q6XHRcdFx0XHRcdFx0XHRcdE1hdXZhaXNlIG3pdGhvZGUgZCdlbnZvaSBkZSBsYSByZXF16nRlIiwid3JvbmdfcmVzcG9uc2VfdHlwZTpcdFx0XHRcdFx0XHRUeXBlIGRlIHJlc3BvbnNlIGluY29ycmVjdCIsInByb2NlZHVyZV9zdWNjZXNzX21pc3Npbmc6XHRcdFx0XHRcdE5vbSBkZSBsYSBwcm9j6WR1cmUgZGUgculjZXB0aW9uIGRlcyBkb25u6WVzIG5vbiBk6WZpbmllIiwic3VjY2Vzc19wcm9jZWR1cmVfbm90X2V4aXN0czpcdFx0XHQgICAgUHJvY+lkdXJlIGRlIHLpY2VwdGlvbiBkZXMgZG9ubullcyBpbnRyb3V2YWJsZSIsInByb2NlZHVyZV9lcnJvcl9taXNzaW5nOlx0XHRcdFx0XHROb20gZGUgbGEgcHJvY+lkdXJlIGVuIGNhcyBkJ2VycmV1ciBub24gZOlmaW5pZSIsImVycm9yX3Byb2NlZHVyZV9ub3RfZXhpc3RzOlx0XHRcdCAgICBQcm9j6WR1cmUgZW4gY2FzIGQnZXJyZXVyIGludHJvdXZhYmxlIiwicmVxdWVzdF9mYWlsZWQ6ICAgICAgICAgICAgIFx0XHRcdCAgICBMYSByZXF16nRlIGEg6WNob3XpLCBzdGF0dXM6ICUxIChwbHVzIGQnaW5mb3JtYXRpb24gZGFucyBsYSBjb25zb2xlIGR1IG5hdmlnYXRldXIpIl19LCJpbmNsdWRlUGF0aHMiOltdfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_net';
	this.aoz[ "extension" + "Net"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/net/net.aoz
		aoz.sourcePos="0:27:0";
		// Javascript
		this.aoz.NET = this;
		this.load_done = true;
		this.response = undefined;
		this.openUrl = function( url, frameId )
		{
			if(typeof (url) == 'undefined' || url == '')
			{
				throw "url_missing";
			}
			if(typeof (frameId) == 'undefined' || frameId == '')
			{
				franeId = "_blank";
			}
			if( frameId == '_self' || frameId == '_parent' || frameId == '_top' || frameId == '_blank')
			{
				window.open(url, frameId);
				return;
			}
		};
		this.callService = function( args )
		{
			if( typeof( args ) == 'undefined' )
				throw 'args_missing';
			var method = args.method;
			if( method == undefined )
				method = 'post';
			method = method.toLowerCase();	
			if( method != 'get' && method != 'post' && method != 'head' )
				throw 'wrong_method';
			var url = args.url;
			if( url === undefined )
				throw 'url_missing';
			var dateNow = 'foobar=' + Date.now();
			var params = args.parameters;
			if( params === undefined )
				params = '';
			if ( params != '' )
			{
				if ( params.substring( 0, 1 ) == '?' )
					params = params.substring( 1 );
				params = params + '&' + dateNow;
			}
			else
			{
				params = dateNow;
			}
			var contentType = args.contentType;
			if( contentType === undefined )
				contentType = 'application/x-www-form-urlencoded';
			var procSuccess = args.success;
			var procError = args.error;
			var async = args.asynchrone;
			this.load_done = async;
			this.load_error = null;
			this.response = undefined;
			var self = this;
			let xhr = new XMLHttpRequest();
			if( method == 'post' )
			{
				xhr.open( method, url + '?' + params, true );
				params = '';
			}
			else
			{
				xhr.open( method, url + '?' + params );
				params = '';
			}
			if ( contentType != '' )
			xhr.setRequestHeader( 'Content-Type', contentType );
			xhr.onload = function()
			{
				console.log( xhr.responseText );
				if ( xhr.status != 200 )
				{
					if( procError != undefined && procError != '' )
						self.aoz.runProcedure( procError, { status$: xhr.status, response$: xhr.responseText } );
					else
						self.load_error = { error: 'request_failed', parameter: "" + xhr.status };
				}
				else
				{
					self.response = xhr.response;
					if( procSuccess != undefined && procSuccess != '' )
						self.aoz.runProcedure( procSuccess, { status$: xhr.status, response$: xhr.responseText } );
					else 
						self.load_error = 'success_procedure_not_exists';
				}
				self.load_done = true;
			}
			xhr.onerror = function( error ) 
			{
				self.load_done = true;
				var status = xhr.status;
				var response = xhr.responseText;
				if ( status == 0 )
				{
					status = 508;
					response = 'Service not available';
				}
				if ( procError != undefined && procError != '' )
					self.aoz.runProcedure( procError, { status$: status, response$: response } );
				else
					self.load_error = { error: 'request_failed', parameter: "" + status };
			};		
			if( method != 'post' )
			{
				xhr.send();
			}
			else
			{
				xhr.send( params );
			}
		};
		this.loadHTML = function( args )
		{
			if( typeof( args ) == 'undefined' )
			{
				throw 'args_missing';
			}
			var url = args.url;
			if( url == undefined || url == '' )
			{
				throw 'url_missing';
			}
			params = args.parameters;
			if( params == undefined || params == '' )
			{
				params = '';
			}
			var self = this;
			let xhr = new XMLHttpRequest();
			xhr.open( 'get', 'resources/www/' + url + '?foobar=' + Date.now() + '&' + params );
			xhr.setRequestHeader( 'Content-Type', 'text/plain' );
			this.load_done = false;
			this.load_error = null;
			xhr.onload = function()
			{
				if ( xhr.status != 200 )
				{
					throw 'load_html_error';
				}
				else
				{
					var html = xhr.responseText.strReplace( "%ROOT%", "resources/www" );
					var html = html.strReplace( "%root%", "resources/www" );				
					document.body.innerHTML = html;
				}
				self.load_done = true;
			}
			xhr.onerror = function() {
				self.load_done = true;
				throw 'request_failed';
			};		
			xhr.send();	
		};
		this.load_wait = function()
		{
			if ( this.load_error )
				throw this.load_error;
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
