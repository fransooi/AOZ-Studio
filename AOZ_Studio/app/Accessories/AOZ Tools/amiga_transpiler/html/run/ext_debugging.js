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
// The Debugging Extension
// By Francois Lionet
// Version 1
// 30/12/2020
// (c) AOZ Studio 2020 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function ext_debugging( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIERlYnVnZ2luZyBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxIiwiZGF0ZSI6IjMwLzEyLzIwMjAiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDIwIC0gT3BlbiBTb3VyY2UiLCJzdGFydCI6ImRlYnVnZ2luZy5hb3oiLCJuYW1lIjoiZGVidWdnaW5nIn0sImZvbnRzIjp7Imxpc3RGb250cyI6IlBDIiwiYW1pZ2EiOltdLCJnb29nbGUiOlsiSUJNIFBsZXggTW9ubyIsIlJvYm90byJdfSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbImVuZF9hcHA6IEVuZCBhcHBsaWNhdGlvbiIsInJlc3RhcnRfYXBwOiBSZXN0YXJ0IHRoZSBhcHBsaWNhdGlvbiIsInBhdXNlX2FwcDogRW50ZXIgZGVidWdnZXIgc3RlcC1ieS1zdGVwIG1vZGUiLCJzdGVwX2FwcDogUGVyZm9ybSBvbmUgbG9vcCBvZiBhcHBsaWNhdGlvbiIsInNsb3dfYXBwOiBQbGF5IGFwcGxpY2F0aW9uIGluIHNsb3ctbW90aW9uIiwicGxheV9hcHA6IFBsYXkgYXBwbGljYXRpb24gYXQgZnVsbCBzcGVlZCIsInN0ZXBfaW50bzogU3RlcCBpbnRvIChGOSkiLCJzdGVwX292ZXI6IFN0ZXAgb3ZlciAoRjEwKSIsInF1aXRfbWFzazogUXVpdCBtYXNrIGVkaXRpb24iLCJkYl9hcHBsaWNhdGlvbjogQXBwbGljYXRpb24iLCJkYl93YXRjaDogV2F0Y2giLCJkYl9jb25zb2xlOiBDb25zb2xlIiwiZGJfc291cmNlOiBTb3VyY2UgQ29kZSIsImRiX3ZhcmlhYmxlczogVmFyaWFibGVzIiwiZGJfc3RhY2s6IFN0YWNrIiwiZGJfc2V0dGluZ3M6IFNldHRpbmdzIiwiZGJfZW50ZXJ2YWx1ZTogQ2hhbmdlIHRoZSB2YWx1ZSBvZiAiLCJkYl92YWx1ZWJldHdlZW46IEVudGVyIGEgdmFsdWUgYmV0d2VlbiAwIGFuZCAlMSIsImRiX3Byb2NlZHVyZTogUHJvY2VkdXJlICIsImRiX2luc3RydWN0aW9uOiBJbnN0cnVjdGlvbiAiLCJkYl9mdW5jdGlvbjogRnVuY3Rpb24gIiwiZGJfbWV0aG9kOiBNZXRob2QgIiwiZGJfb2JqZWN0OiBPYmplY3QgIiwiZGJfdW5rbm93bjogVW5rbm93biAiLCJkYl9lbnRlcm51bWJlcjogRW50ZXIgYSBudW1iZXI6ICAiLCJkYl9lbnRlcnRleHQ6IEVudGVyIGEgc3RyaW5nOiAgIiwiZGJfcHJlZmVyZW5jZXM6IEFPWiBEZWJ1Z2dlciBQcmVmZXJlbmNlcyIsImRiX2ludGVyZmFjZXR5cGU6IEFwcGxpY2F0aW9uIHdpbmRvdzoiLCJkYl93ZGVmcG9zOiBXaW5kb3cgZGVmYXVsdCBwb3NpdGlvbjoiLCJkYl9jbG9zZTogT0siLCJkYl9jYW5jZWw6IENhbmNlbCIsImRiX3Jlc2V0V2luZG93czogUmVzZXQgd2luZG93cyIsImRiX3Jlc3RvcmVXaW5kb3dzOiBSZXN0b3JlIHdpbmRvd3MgYXQgc3RhcnR1cDoiLCJkYl90aXRsZXZpZXdlcjogQU9aIFZpZXdlciIsImRiX3RpdGxlZGVidWdnZXI6IEFveiBEZWJ1Z2dlciIsImRiX3RpdGxlcGF1c2U6IEFwcGxpY2F0aW9uIHBhdXNlZCIsImRiX3RpdGxlc3RlcHNsb3c6IFN0ZXBwaW5nIHNsb3ciLCJkYl90aXRsZXNsb3c6IFJ1bm5pbmcgc2xvdy1tb3Rpb24iLCJkYl90aXRsZXBsYXk6IEFwcGxpY2F0aW9uIHJ1bm5pbmciLCJkYl90aXRsZWVkaXRpbmdtYXNrOiBFZGl0aW5nIGNvbGxpc2lvbiBtYXNrIiwiZGJfZGlzcGxheU1hc2tzOiBEaXNwbGF5IGNvbGxpc2lvbiBtYXNrczoiLCJkYl9kaXNwbGF5TGFiZWxzOiBEaXNwbGF5IG9iamVjdCBpbmZvcm1hdGlvbjoiLCJkYl9kaXNwbGF5UnVsZXI6IERpc3BsYXkgcnVsZXI6IiwiZGJfZGlzcGxheUdyaWQ6IERpc3BsYXkgZ3JpZDoiLCJkYl9ncmlkV2lkdGg6IEdyaWQgd2lkdGg6IiwiZGJfZ3JpZEhlaWdodDogR3JpZCBoZWlnaHQ6IiwiZGJfZGlzcGxheUNyb3NzaGFpcjogRGlzcGxheSBjcm9zc2hhaXI6IiwiZGJfc2V0dGluZ3NsZWZ0cmlnaHQ6IDE6TGVmdCwyOlJpZ2h0IiwiZGJfYXBwbGljYXRpb25zbWFsbGJpZzogMTpTbWFsbCwyOkxhcmdlIiwiZGJfZm9udFdpZHRoOiBGb250IGhlaWdodCIsImRiX3Jlc2V0TWFzazogUmVzZXQgbWFzayIsImRiX2hlbHA6IEFPWiBEZWJ1Z2dlciBIZWxwIiwiZGJfZGlzcGxheURvYzogT3BlbiBtYWluIGRvY3VtZW50YXRpb24iXSwiZnIiOlsiZW5kX2FwcDogUXVpdHRlciBsJ2FwcGxpY2F0aW9uIiwicmVzdGFydF9hcHA6IFJlbGFuY2VyIGwnYXBwbGljYXRpb24iLCJwYXVzZV9hcHA6IEVudHJlciBkYW5zIGxlIG1vZGUgcGFzLWEtcGFzIiwic3RlcF9hcHA6IEV4ZWN1dGVyIHVuZSBib3VjbGUgZGUgbCdhcHBsaWNhdGlvbiIsInNsb3dfYXBwOiBMYW5jZXIgbCdhcHBsaWNhdGlvbiBhdSByYWxlbnRpIiwicGxheV9hcHA6IFJlbGFuY2VyIGwnYXBwbGljYXRpb24gYSBwbGVpbiB2aXRlc3NlIiwic3RlcF9pbnRvOiBQYXMgZW50cmFudCAoRjgpIiwic3RlcF9vdmVyOiBQYXMgcGFyIGF1IGRlc3N1cyAoRjkpIiwicXVpdF9tYXNrOiBRdWl0dGVyIGwnZWRpdGlvbiBkZSBtYXNxdWUiLCJkYl9hcHBsaWNhdGlvbjogQXBwbGljYXRpb24iLCJkYl93YXRjaDogV2F0Y2giLCJkYl9jb25zb2xlOiBDb25zb2xlIiwiZGJfc291cmNlOiBTb3VyY2UgQ29kZSIsImRiX3ZhcmlhYmxlczogVmFyaWFibGVzIiwiZGJfc3RhY2s6IFBpbGUiLCJkYl9zZXR0aW5nczogUHJlZmVyZW5jZXMiLCJkYl9lbnRlcnZhbHVlOiBDaGFuZ2VyIGxhIHZhbGV1ciBkZSAiLCJkYl92YWx1ZWJldHdlZW46IEVudHJleiB1bmUgdmFsZXVyIGNvbXByaXNlIGVudHJlIDAgZXQgJTEiLCJkYl9wcm9jZWR1cmU6IFByb2NlZHVyZSAiLCJkYl9pbnN0cnVjdGlvbjogSW5zdHJ1Y3Rpb24gIiwiZGJfZnVuY3Rpb246IEZ1bmN0aW9uICIsImRiX21ldGhvZDogTWV0aG9kZSAiLCJkYl9vYmplY3Q6IE9iamV0ICIsImRiX3Vua25vd246IEluY29ubnUgIiwiZGJfZW50ZXJudW1iZXI6IEVudHJleiB1biBjaGlmZnJlOiAgIiwiZGJfZW50ZXJ0ZXh0OiBFbnRyZXogdW5lIGxldHRyZTogICIsImRiX3ByZWZlcmVuY2VzOiBQcmVmZXJlbmNlcyBBb3ogRGVidWdnZXIiLCJkYl9pbnRlcmZhY2V0eXBlOiBGZW5ldHJlIEFwcGxpY2F0aW9uOiIsImRiX3NldHRpbmdzbGVmdHJpZ2h0OiAxOkdhdWNoZSwyOkRyb2l0ZSIsImRiX3dkZWZwb3M6IFBvc2l0aW9uIHBhciBkZWZhdXQgZGVzIGZlbmV0cmVzOiIsImRiX3Jlc2V0V2luZG93czogUmUtaW5pdGlhbGlzZXIgbGVzIGZlbmV0cmVzIiwiZGJfcmVzdG9yZVdpbmRvd3M6IFJlc3RvcmVyIGxlcyBmZW5ldHJlcyBhdSBsYW5jZW1lbnQ6IiwiZGJfY2xvc2U6IE9LIiwiZGJfY2FuY2VsOiBBbm51bGVyIiwiZGJfdGl0bGV2aWV3ZXI6IEFPWiBWaWV3ZXIiLCJkYl90aXRsZWRlYnVnZ2VyOiBBT1ogVmlld2VyIC0gRGVib2dnZXVyIEFjdGlmIiwiZGJfdGl0bGVwYXVzZTogQXBwbGljYXRpb24gZW4gcGF1c2UiLCJkYl90aXRsZXN0ZXBzbG93OiBQYXMgYSBwYXMgbGVudCIsImRiX3RpdGxlc2xvdzogQXBwbGljYXRpb24gYXUgcmFsZW50aSIsImRiX3RpdGxlcGxheTogQXBwbGljYXRpb24gZW4gZm9uY3Rpb25uZW1lbnQiLCJkYl90aXRsZWVkaXRpbmdtYXNrOiBFZGl0aW9uIGR1IG1hc3F1ZSBkZSBjb2xsaXNpb24iLCJkYl9kaXNwbGF5TWFza3M6IEFmZmljaGVyIG1hc3F1ZXMgZGUgY29sbGlzaW9uOiIsImRiX2Rpc3BsYXlMYWJlbHM6IEFmZmljaGVyIGluZm9ybWF0aW9uIG9iamV0czoiLCJkYl9kaXNwbGF5UnVsZXI6IEFmZmljaGVyIGxhIHJlZ2xlOiIsImRiX2Rpc3BsYXlHcmlkOiBBZmZpY2hlciBsYSBncmlsbGU6IiwiZGJfZ3JpZFdpZHRoOiBMYXJnZXVyIGdyaWxsZToiLCJkYl9ncmlkSGVpZ2h0OiBIYXV0ZXVyIGdyaWxsZToiLCJkYl9kaXNwbGF5Q3Jvc3NoYWlyOiBBZmZpY2hlciBsZSB2aXNldXI6IiwiZGJfZm9udFdpZHRoOiBIYXV0ZXVyIGRlIGxhIHBvbGljZSIsImRiX2FwcGxpY2F0aW9uc21hbGxiaWc6IDE6UGV0aXRlLDI6R3JhbmRlIiwiZGJfcmVzZXRNYXNrOiBSLkEuWi4gbWFzayIsImRiX2hlbHA6IEFpZGUgQU9aIERlYnVnZ2VyIiwiZGJfZGlzcGxheURvYzogQWZmaWNoZXIgbGEgZG9jdW1lbnRhdGlvbiJdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_debugging';
	this.aoz[ "extension" + "Debugging"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: D:/Programs/AOZ_Studio_SE/AOZ_Studio/app/aoz/extensions/debugging/debugging.aoz
		aoz.sourcePos="0:49:0";
		// Javascript
		console.log( "AOZ Debugging extension activated..." );
		this.debugger = this;
		this.isRoot = true;
		this.initialized = false;
		this.screen = null;
		this.blockEvents = true;
		this.width = 1920;
		this.height = 1080;
		this.sxRuler = 48;
		this.syRuler = 24;
		this.windows = [];
		this.mouseIn = true;
		this.mouseKeys = 0;
		this.mouseCaptured = false;
		this.xMouse = 0;
		this.yMouse = 0;
		this.cursor = 'auto';
		this.consoleLength = 100;
		this.stringScrollSpeed = Math.PI / 100;
		this.popupDelay = 20;
		this.hRatio = 1;
		this.vRatio = 1;
		this.editedMask = null;
		this.displayMode = 'aoz';		// 'aoz'
		this.lastActivated = 10;
		this.INK_NORMAL = 0;
		this.INK_ACTIVATED = 1;
		this.INK_DISACTIVATED = 2;
		this.INK_EXTRA = 3;
		this.stepSlowSpeed = 40;
		this.stepSlowBase = 0;
		this.stepSlowCounter = 0;
		this.sliderWidth = 20;
		this.debugEvents = this.aoz.getDebugEvents( this );
		this.debugUI = new DebugUI( this );
		var self = this;
		this.fontName = 'IBM Plex Mono';
		this.aoz.loadingMax++;
		this.aoz.fonts.getFont( this.fontName, 20, undefined, undefined, undefined, '', 'ext_debugging', function( response, data, extra )
		{
			self.aoz.loadingCount++;
			if ( !response )
				console.log( 'Cannot load debugger font.' );
		} );
		this.fontText = 'Roboto';
		this.aoz.loadingMax++;
		this.aoz.fonts.getFont( this.fontText, 20, undefined, undefined, undefined, '', 'ext_debugging', function( response, data, extra )
		{
			self.aoz.loadingCount++;
			if ( !response )
				console.log( 'Cannot load debugger font.' );
		} );
		this.imgArrowRight = new Image();
		this.imgArrowRight.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGzSURBVHhe7Zu9SsNQGIZbcQm5g15YJ1GvQhEcnLwOERfBwRvRwS1L81PikA6mJWnG+n4npw4ibXJKS7/j+yynhBK+5zlJlpDBLqxWq1GWZQ9Yf5jNZuV8Pr/Ez5H9m5+IYBzHz8b6D6qqusHiZwQR2yS/xtsIURTdtorb8S6CyJRlWRu7jngVASJjY9WTY41wYte9E4bhfV3XF8cYoRcigAfgi+yqC17cDiIwmUzejJEDjAAYATACYATACIARACMARgCMABgBMAJgBMAIgBEAIwBGAIwAGAF4EyFJkndj5AAjAEYAy+Xy3J5KL/BwjpDneYZF91UgiMQOV8LYnqYzB3sz1JNTu/4vsIOy+x/tZvZjOp0mWPTeAjK8q7yAh+CZPZU+MP+u8ldYdO6+DE55RyhPeYXI4JR3hPKUV4gMTnlHKE95hcjglHeE8pRXiAxOeUcoT3mFyOBxHL8aEwdUywsY3umbIeEY5Q/2ZqhpmusgCJ6Gw+GnPaQT2cHFYtGYLe2I+sv+N1EU3bVq2/FOXhChLg9CL+XXiNimCF7LrxHBNE0fjbGlKIqvqqqUfCA5GHwDiSJOifCTGkQAAAAASUVORK5CYII=';
		this.imgArrowDown = new Image();
		this.imgArrowDown.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIPSURBVHhe7Zo9TsNAEEbta3AWjoKAUyAhUXAURIdEwSFooaBLkx9HoUgKnCiEMsyzPZEgSvC/d808Kdr1end23pfWgWEYhmEYhmEY/5IwG3dst9sTGU7Tp+A5DMP3bO4luX3YOBgMbler1ZfME0aj0ZMMFPASeheHx0RGiOP4UxxvZPrTiYVMdo/xePwmg3ch0PNwOHxJJH4hrg8ypE5MDskrvoVAr4fklV0Ik8nkPl06ji8h0ONf8koURXccyI3rIdBbXnmlUADgagj0VFQeCgcAroVAL2XkIZjP5x/ZvBCuhEAPZeUXi0UcrNfri+y5MF2HwN1l5WG5XF4mRTabzVW6VJyuQuDOKvLyx1/LkPbNxKcQuKs2eYUFH0LgjtrlFV64HAK1G5NX2OBiCNRsXF5ho0shUKs1eYUDLoRAjdblFQ52GQJnO5NXKNBFCJzpXF6hUJshsNcZeYWCbYTAHufkFQo3GQLvZM9rsrkEjcorXNBECKw5L69wUZ0hMPdGXuHCOkLg5528wsVVQ/BWXqGBKiGUxQl5hUbaDMEpeYWG2gjBSXmFxpoMwWl5hQabCMELeYVG6wzBK3mFhusIwUt5hcarhOC1vIJAmRB6Ia8gUiSEXskrCOUJoZfyCmLHQui1vIKghHA2nU7HibUwm80iWTuXaevye5/JtUUm25vP8QzDMAzDMAzD8Ikg+Aa1v+fCqnk/ngAAAABJRU5ErkJggg==';
		var handle = setInterval( function()
		{
			if ( self.debugEvents.isConnected() )
			{
				clearInterval( handle );
				var message = 
				{
					module: 'debugger',
					method: 'getTempData'
				};
				self.debugEvents.sendMessage( message, function( response, extra )
				{
					if ( response && response.data && response.data.view == 'debug' )
					{
						self.debugUI.clickDebug();
					}
				} );
			}
		}, 10 );
		this.palette = 
		[ 
			0x000000, // 0
			0xc5c8c6, // 1
			0x010101, // 2
			0x775800, // 3
			0x00FF00, // 4
			0x0000FF, // 5
			0xFFFF00, // 6
			0xFF00FF, // 7
			0x00FFFF, // 8
			0x191B1D, // 9
			0x1D1F21, // 10
			0x17CA65, // 11
			0xFEAC00, // 12
			0xFFFFFF, // 13
			0x000000, // 14
			0x000000, // 16
			0x000000,	// 0- transparent
			0x000000,
			0x000000,
			0x000000,
			0x112D3C,	// 4- titleBar normal
			0x355470,	// 5- titleBar activated
			0x440000,	// 6- titleBar deactivated
			0x000000,	// 7- titleBar
			0x869296,	// 8- titleFont normal
			0xC5C8C6,	// 9- titleFont activated
			0x869296,	// 10- titleFont deactivated
			0x000000,	// 11- titleFont
			0x112D3C,	// 12- outRectangle normal
			0x355470,	// 13- outRectangle activated
			0x112D3C,	// 14- outRectangle deactivated
			0x000000,	// 15- outRectangle
			0x1D1F21,	// 16- inRectangle normal
			0x282A2E,	// 17- inRectangle activated
			0x1D1F21,	// 18- inRectangle deactivated
			0x000000,	// 19- inRectangle
			0x869296,	// 20- textFont normal
			0xC5C8C6,	// 21- textFont activated
			0x869296,	// 22- textFont deactivated
			0x912A2E,	// 23- textFont
			0xFFFFFF,	// 24- dragOutRectangle normal
			0xFFFFFF,	// 25- dragOutRectangle activated
			0xFF0000,	// 26- dragOutRectangle deactivated
			0xFFFFFF,	// 27- dragOutRectangle
			0x869296,	// 28- consoleFont normal
			0xC5C8C6,	// 29- consoleFont activated
			0x869296,	// 30- consoleFont deactivated
			0xFFFFFF,	// 31- consoleFont
			0x17CA65,	// 32- sourceFont normal
			0x1EFF7F,	// 33- sourceFont activated
			0x0F7F3E,	// 34- sourceFont deactivated
			0x912A2E,	// 35- sourceFont extra (hilighted paper)
			0x869296,	// 36- slider normal
			0xC5C8C6,	// 37- slider activated
			0x869296,	// 38- slider deactivated
			0xFFFFFF,	// 39- slider
			0x1D1F21,	// 40- sliderOutline normal
			0x912A2E,	// 41- sliderOutline activated
			0x1D1F21,	// 42- sliderOutline deactivated
			0xFFFFFF,	// 43- sliderOutline
			0xFFFF00,	// 44- bobMask normal
			0xFF8800,	// 45- bobMask activated
			0x1D1F21,	// 46- bobMask deactivated
			0xFFFFFF,	// 47- bobMask
			0x355470,	// 48- rulerBack normal
			0x355470,	// 49- rulerBack activated
			0x355470,	// 50- rulerBack deactivated
			0xFFFFFF,	// 51- rulerBack
			0xFFFF00,	// 52- ruler normal
			0x010101,	// 53- ruler activated
			0x010101,	// 54- ruler deactivated
			0xFFFFFF,	// 55- ruler
			0xFFFF00,	// 56- rulerPointer normal
			0xFFFF00,	// 57- rulerPointer activated
			0xFFFF00,	// 58- rulerPointer deactivated
			0xFFFFFF,	// 59- rulerPointer
			0x404040,	// 60- grid normal
			0xFFFFFF,	// 61- grid activated
			0x010101,	// 62- grid deactivated
			0xFFFFFF,	// 63- grid
			0x355470,	// 64- label normal
			0xC5C8C6,	// 65- label activated
			0x010101,	// 66- label deactivated
			0xFFFFFF,	// 67- label
			0xFFFFFF,	// 68- wordUnderMouse normal
			0xC5C8C6,	// 69- wordUnderMouse activated
			0x010101,	// 70- wordUnderMouse deactivated
			0x000000,	// 71- wordUnderMouse
			0x1EFF7F,	// 72- hint normal= outRectangle
			0x1EFF7F,	// 73- hint activated= inRectangle
			0x112D3C,	// 74- hint deactivated= text
			0x000000,	// 75- 
		];
		this.inks = 
		{
			titleBar: 4,
			titleFont: 8,
			outRectangle: 12,
			inRectangle: 16,
			textFont: 20,
			dragOutRectangle: 24,
			consoleFont: 28,
			sourceFont: 32,				
			slider: 36,
			sliderOutline: 40,
			bobMask: 44,
			rulerBack: 48,		
			ruler: 52,
			rulerPointer: 56,
			grid: 60,
			label: 64,
			wordUnderMouse: 68,
			hint: 72,
		}
		this.getInk = function( name, activated )
		{
			var index = this.inks[ name ];
			if ( typeof index != 'undefined' )
			{
				if ( index == 0 )
					return 0;
				return 16 + index + activated;
			}
			return 0;
		}
		var fontSize = 42;
		this.uiList =
		[
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_setup',
				className: 'setup',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_doBreak',
				className: 'doBreak',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_stepIn',
				className: 'stepIn',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_stepOver',
				className: 'stepOver',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_skip',
				className: 'skip',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn_stepEnd',
				className: 'stepEnd',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn-stepSlow',
				className: 'stepSlow',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn-runslowmotion',
				className: 'runSlowMotion',
				_visible: true
			},
			{
				_type: 'htmlbutton',
				_tags: '',
				id: 'btn-runfullspeed',
				className: 'runFullSpeed',
				_visible: true
			},
			{
				_type: 'slider',
				_tags: '#variables',
				id: 'variables_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 14,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#variables',
				id: 'variablesview_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 14,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#variables',
				id: 'instructionview_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 14,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#console',
				id: 'console_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 20,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#watch',
				id: 'watch_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 20,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#watch',
				id: 'pile_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 20,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
			{
				_type: 'slider',
				_tags: '#help',
				id: 'help_slider',
				type: 'vertical',
				x: 100,
				y: 100,
				width: 20,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				paper1: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink1: this.getInk( 'slider', this.INK_NORMAL ),
				outline1: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern1: 0,
				paper2: this.getInk( 'inRectangle', this.INK_NORMAL ),
				ink2: this.getInk( 'slider', this.INK_NORMAL ),
				outline2: this.getInk( 'sliderOutline', this.INK_NORMAL ),
				pattern2: 0,
				onChange: 'ext_debugging:onSliderChange',
			},
		];
		this.isDebugger = function()
		{
			return this.initialized && this.uiCreated;
		}
		this.debugOn = function( args )
		{
			if ( this.initialized && this.initializedConsole )
				this.debugOff( {} );
			return this.initialize( args );
		}
		this.debugOff = function( args )
		{
			if ( this.initialized )
			{
				this.saveConfig();
				this.winConfig = undefined;
				this.aoz.removeExternalEventHandler( 'debugger' );
				this.deleteUI();
				this.uiCreated = false;
				while ( this.windows.length > 0 )
					this.windows[ 0 ].destroy();
				this.screen.close();
				this.screen = undefined;
				this.aoz.onMessage(	{ command: 'stepInCodeOff' } );
				this.aoz.onMessage(	{ command: 'debuggerOff' } );
				this.vars = {};
				this.winConsole = undefined;
				this.winSource = undefined;
				this.winWatch = undefined;
				this.winStack = undefined;
				this.winVariables = undefined;
				this.winApplication = undefined;
				this.initialized = false;
				this.debugUI.showDebuggerBar( false );	
				this.aoz.ui.resize();
			}
		}
		this.consoleOnOff = function()
		{
			if ( this.initialized && !this.initializedConsole )
				this.debugOff( {} );
			var args = 
			{
				mode: 'play',
				openConsole: true,
				consoleOutput: 'debugger',
				visible: !this.initialized ? true : ( this.vars.visible ? false : true )
			};
			return this.initialize( args );		
		}
		this.consoleOn = function( args )
		{
			var newArgs = 
			{
				openConsole: true,
				visible: true,
				consoleOutput: typeof args.output == 'undefined' ? 'debugger' : args.output,
				mode: args.wait ? 'stepwait' : 'play'
			};
			return this.initialize( newArgs );		
		}
		this.consoleOff = function( args )
		{
			if ( this.initializedConsole )
			{
				this.debugOff();
				this.initializedConsole = false;
			}
		}
		this.breakInCode = function( args )
		{
			var self = this;
			if ( !this.initialized )
			{
				this.initialize( { visible: true, mode: 'stepwait' }, function( response, data, extra )
				{
					if ( response )
						self.aoz.stepInCode = true;
				} );
				return true;
			}
			this.aoz.stepInCode = true;
			return false;
		}
		this.log = function( args )
		{
			var self = this;
			if ( !this.initialized )
			{
				args.openConsole = true;
				args.visible = false;
				args.mode = 'play';
				this.initialize( args, function( response, data, extra )
				{
					if ( response )
					{
						self.aoz.loadingCount++;
						self.winConsole.log( args );
					}
				} );
				return true;
			}
			this.winConsole.log( args );
			return false;
		}
		this.saveConfig = function()
		{
			this.winConfig = 
			{
				windows: [],
				vars: this.vars,
				displayMode: this.displayMode
			};
			for ( var w = 0; w < this.windows.length; w++ )
			{
				var win = this.windows[ w ];
				this.winConfig.windows.push(
				{
					id: win.id,
					outRectangle: win.outRectangle,
					minimized: win.minimized,
					visible: win.visible
				} );
			}
			if ( this.debugger.debugEvents.isConnected() )
			{
				this.debugger.debugEvents.sendMessage(
				{
					module: 'debugger',
					method: 'saveUserConfig',
					options: { identifier: this.configId, data: JSON.stringify( this.winConfig ) }
				}, function( response, extra )
				{
				} );
			}
		}
		this.loadConfig = function( callback, extra )
		{
			if ( this.debugger.debugEvents.isConnected() )
			{
				this.debugEvents.sendMessage(
				{
					module: 'debugger',
					method: 'loadUserConfig',
					options: { identifier: this.configId }
				}, function( response, extra )
				{
					if ( !response.error )
					{
						try
						{
							self.winConfig = JSON.parse( response.data );
						}
						catch ( e )
						{}
						if ( self.winConfig )
						{
							for ( var p in self.winConfig.vars )
								self.vars[ p ] = self.winConfig.vars[ p ];
							self.displayMode = self.winConfig.displayMode;
							self.debugger.createAllWindows();
							self.debugger.resetWindowsPositions();
							self.setWindowPositionsFromConfig();
						}
						if ( callback )
							callback( true, {}, extra );
					}
				} );
			}
		}
		this.setWindowPositionsFromConfig = function()
		{
			for ( var wc = 0; wc < this.winConfig.windows.length; wc++ )
			{
				var config = this.winConfig.windows[ wc ];
				for ( var w = 0; w < this.windows.length; w++ )
				{
					var win = this.windows[ w ];
					if ( win.id == config.id )
					{
						win.visible = config.visible;
						win.minimized = config.minimized;
						win.setRectangle( config.outRectangle );
					}
				}
			}
		}
		this.setFontHeight = function( height, force )
		{
			if ( height != this.vars.fontHeight || force )
			{
				this.vars.fontHeight = height;
				this.vars.fontHeightTitle = height - 3;
				this.vars.fontHeightPopup = height;
				this.resetDisplay();
			}
		}
		this.addWatch = function( args )
		{
			var self = this;
			this.initialize( { visible: true, mode: 'play', isWatch: false }, function( response, data, extra )
			{
				if ( response )
				{
					self.winWatch.addWatch( args );
					self.winWatch.doWatch( args );
				}
			} );
		}
		this.addBreak = function( args )
		{
			var self = this;
			this.initialize( { visible: true, mode: 'play', isWatch: false }, function( response, data, extra )
			{
				if ( response )
					self.winWatch.addBreak( args );
			} );
		}
		this.doWatch = function()
		{
			if ( this.initialized && !this.initializedConsole )
				this.winWatch.doWatch();
		}
		this.resetDisplay = function()
		{
			if ( this.screen )
			{
				this.screen.close();
				this.screen = undefined;
				if ( this.winApplication )
				this.winApplication.destroy();
				if ( this.winSource )
				this.winSource.destroy();
				if ( this.winStack )
				this.winStack.destroy();
				if ( this.winVariables )
				this.winVariables.destroy();
				if ( this.winWatch )
				this.winWatch.destroy();
				if ( this.winConsole )
				this.winConsole.destroy();
			}
			this.screen = new Screen( this.aoz,  
			{
				x: 0,			
				y: 0,
				width: this.width, 
				height: this.height, 
				displayScale: 1, 
				index: "__debugging__", 
				numberOfColors: 128,
				windowFont: 
				{
					name: this.fontName, 
					height: this.vars.fontHeight,
					context: 'ext_debugging',
					widthChar: this.vars.fontHeight * 0.6,
					heightChar: this.vars.fontHeight + this.vars.fontHeight * 0.5,
				}
			}, "" );
			this.screenFontWidth = this.screen.currentTextWindow.fontWidth;
			this.screenFontHeight = this.screen.currentTextWindow.fontHeight;
			var useShortColors = this.aoz.useShortColors;
			this.aoz.useShortColors = false;
			this.screen.setPalette( this.palette, '#noremap' );
			this.aoz.useShortColors = useShortColors;
			this.screen.setTransparent( [ 0 ], false, true );
			this.screen.cls( 0 );
			this.screen.setWriting( 0x00 );
			this.screen.setAlwaysOnTop( true );
			this.screen.setAlpha( this.vars.alpha );
			this.createAllWindows( true );
			this.resetWindowsPositions();
		}
		this.initialize = function( args, callback, extra )
		{
			if ( !this.initialized && !this.initializing )
			{
				var config;
				this.initializing = true;
				this.initializedConsole = args.openConsole;
				this.vars = 
				{
					visible: 0,
					masks: false,
					screens: true,
					crosshair: true,
					collisions: false,
					rulers: true,
					grid: true,
					gridWidth: 32,
					gridHeight: 32,
					application: true,
					variables: true,
					console: true,
					watch: true,
					source: true,
					stack: true,
					winLinked: true,
					mode: '',
					alpha: 1,
					winRight: true,
					fontHeight: 18,
					consoleOutput: 'debugger'
				};
				var self = this;
				function doInit()
				{
					self.vars.visible = 0;
					self.vars.application = ( typeof args.application == 'undefined' ? self.vars.application : args.application );
					self.vars.masks = ( typeof args.masks == 'undefined' ? self.vars.masks : args.masks );
					self.vars.crosshair = ( typeof args.crosshair == 'undefined' ? self.vars.crosshair : args.crosshair );
					self.vars.screens = ( typeof args.screens == 'undefined' ? self.vars.screens : args.screens );
					self.vars.collisions = ( typeof args.collisions == 'undefined' ? self.vars.collisions : args.collisions );
					self.vars.rulers = ( typeof args.rulers == 'undefined' ? self.vars.rulers : args.rulers );
					self.vars.grid = ( typeof args.grid == 'undefined' ? self.vars.grid : args.grid );
					self.vars.gridWidth = ( typeof args.gridWidth == 'undefined' ? self.vars.gridWidth : args.gridWidth );
					self.vars.gridHeight = ( typeof args.gridHeight == 'undefined' ? self.vars.gridHeight : args.gridHeight );
					self.vars.variables = ( typeof args.variables == 'undefined' ? self.vars.variables : args.variables );
					self.vars.console = ( typeof args.console == 'undefined' ? self.vars.console : args.console );
					self.vars.watch = ( typeof args.watch == 'undefined' ? self.vars.watch : args.watch );
					self.vars.source = ( typeof args.source == 'undefined' ? self.vars.source : args.source );
					self.vars.stack = ( typeof args.stack == 'undefined' ? self.vars.stack : args.stack );
					self.vars.alpha = ( typeof args.alpha == 'undefined' ? self.vars.alpha : args.alpha );
					self.vars.winLinked = ( typeof args.winLinked == 'undefined' ? self.vars.winLinked : args.winLinked );
					self.vars.fontHeight = ( typeof args.fontHeight == 'undefined' ? self.vars.fontHeight : args.fontHeight );
					self.vars.consoleOutput = ( typeof args.consoleOutput == 'undefined' ? self.vars.consoleOutput : args.consoleOutput );
					self.displayMode = ( typeof args.displayMode == 'undefined' ? self.displayMode : args.displayMode );
					self.frameCounter = 1;
					self.frameCounterBase = 1;
					self.previousShowControls = false;
					self.showControls = false;
					self.renderingContext = self.aoz.renderingContext;
					self.renderingDisplay = self.aoz.renderingContext.display;
					self.renderingFilters = self.aoz.renderingContext.filters;
					self.renderingPlatform = self.aoz.renderingContext.platform;
					self.display =
					{
						tvStandard: "pal",
						refreshRate: 60,
						width: 1920,
						height: 1080,
						background: "color",
						backgroundColor: "#000000",
						scaleX: 1,
						scaleY: 1,
						smoothing: false,
						screenScale: 1,
						fps: false,
						fpsFont: "12px Verdana",
						fpsColor: "#FFFF00",
						fpsX: 10,
						fpsY: 16,
						fullPage: true,
						fullScreen: true,
						keepProportions: true,
						fullScreenIcon: false
					};
					self.filters = new self.aoz.utilities.DrawFilters( self.aoz, self.aoz.renderer );
					self.renderingContext.display = self.display;
					self.renderingContext.filters = self.filters;
					self.renderingContext.platform = 'aoz';
					self.renderingContext.resize( true, self.renderingContext.width, self.renderingContext.height );
					self.setFontHeight( self.vars.fontHeight, true );				
					self.aoz.addExternalEventHandler( self, self.eventCallback, 'debugger', {}, 0 );
					if ( self.winConfig )
						self.setWindowPositionsFromConfig();
					if ( args.mode )
					{
						if ( args.mode == 'keep' )
						{
							if ( self.vars.mode == '' )
								self.setMode( 'play' );
						}
						else
							self.setMode( args.mode );
					}
					if ( !self.uiCreated )
					{
						self.uiCreated = true;
						self.createUI( [ '#ui' ] );
					}
					self.setVisible( args.visible );
					self.initializing = false;
					self.initialized = true;
					if ( self.vars.mode == 'play' )
						self.activateWindow( self.winApplication );
				}
				this.configId = args.openConsole ? 'ConsoleSettings' : 'DebuggerSettings';
				if ( !this.winConfig )
				{
					this.aoz.loadingMax++;
					var handle = setInterval( function()
					{
						if ( self.debugger.debugEvents.isConnected() )
						{
							clearInterval( handle );
							self.debugger.debugEvents.sendMessage(
							{
								module: 'debugger',
								method: 'loadUserConfig',
								options: { identifier: self.configId }
							}, function( response, extra )
							{
								if ( !response.error )
								{
									try
									{
										self.winConfig = JSON.parse( response.data );
									}
									catch ( e )
									{}
									if ( self.winConfig )
									{
										for ( var p in self.winConfig.vars )
											self.vars[ p ] = self.winConfig.vars[ p ];
										self.displayMode = self.winConfig.displayMode;
										self.vars.mode = '';
									}
								}
								doInit();
								self.aoz.loadingCount++;
								if ( callback )
									callback( true, {}, extra );
							} );
						}
					}, 20 );
					return true;
				}
				else
				{
					for ( var p in this.winConfig.vars )
						this.vars[ p ] = this.winConfig.vars[ p ];
					this.displayMode = this.winConfig.displayMode;
					this.vars.mode = '';
					doInit();
				}
				if ( callback )
					callback( true, {}, extra );
				return false;
			};
			if ( typeof args.visible != 'undefined' )
				this.setVisible( args.visible );
			if ( callback )
				callback( true, {}, extra );
			return false;
		};
		this.createAllWindows = function( force )
		{
			if ( !this.winApplication || force )
			{
				if ( this.initializedConsole )
				{
					this.winApplication = this.addWindow( new this.ApplicationWindow( this.aoz,
					{
						id: 'win_application',
						x: 0,
						y: 0,
						width: this.screen.vars.width,
						height: this.screen.vars.height,
						borderH: 0,
						borderV: 0,
						inkOut: 1,
						inkIn: 1,
						inkFont: 2,
						paperIn: undefined,
						fontHeight: this.vars.fontHeight,
						visible: true,
						screen: this.screen,
						parent: this,
					} ) );
					this.winConsole = this.addWindow( new this.ConsoleWindow( this.aoz,
					{
						id: 'win_console',
						x: 0,
						y: this.screen.vars.height / 3 * 2,
						width: this.screen.vars.width / 3,
						height: this.screen.vars.height / 3,
						title: this.aoz.getMessage( 'db_console' ),
						noMinimize: true,
						borderH: 4,
						borderV: 4,
						inkOut: 1,
						inkIn: 1,
						inkFont: 2,
						paperIn: 9,
						nLines: 100,
						fontHeight: this.vars.fontHeight,
						visible: true,
						screen: this.screen,
						parent: this,
						topFront: true
					} ) );
				}
				else
				{
				var width = this.screen.vars.width * 0.33;
				var x = this.screen.vars.width - width;
				var height = this.screen.vars.height * 0.8;
				this.winApplication = this.addWindow( new this.ApplicationWindow( this.aoz,
				{
					id: 'win_application',
					x: 0,
					y: 0,
					width: this.screen.vars.width - width,
					height: height,
					title: this.aoz.getMessage( 'db_application' ),
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: undefined,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.application,
					screen: this.screen,
					parent: this,
				} ) );
				this.winStack = this.addWindow( new this.StackWindow( this.aoz,
				{
					id: 'win_stack',
					x: x,
					y: 0,
					width: width,
					height: this.screen.vars.height / 16,
					title: this.aoz.getMessage( 'db_stack' ),
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: 9,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.stack,
					screen: this.screen,
					parent: this
				} ) );
				this.winSource = this.addWindow( new this.SourceWindow( this.aoz,
				{
					id: 'win_source',
					x: x,
					y: this.winStack.outRectangle.y + this.winStack.outRectangle.height,
					width: width,
					height: this.screen.vars.height / 4,
					title: this.aoz.getMessage( 'db_source' ),
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: 9,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.source,
					screen: this.screen,
					parent: this
				} ) );
				this.winVariables = this.addWindow( new this.VariablesWindow( this.aoz,
				{
					id: 'win_variables',
					x: x,
					y: this.winSource.outRectangle.y + this.winSource.outRectangle.height,
					width: width,
					height: this.screen.vars.height / 4,
					title: this.aoz.getMessage( 'db_variables' ),
					borderIn: { left: 8, top: 4, right: 8, bottom: 4 },
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: 9,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.variables,
					screen: this.screen,
					parent: this
				} ) );
				this.winWatch = this.addWindow( new this.WatchWindow( this.aoz,
				{
					id: 'win_watch',
					x: x,
					y: this.winVariables.outRectangle.y + this.winVariables.outRectangle.height,
					width: width,
					height: this.screen.vars.height / 16,
					title: this.aoz.getMessage( 'db_watch' ),
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: 9,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.watch,
					screen: this.screen,
					parent: this
				} ) );
				this.winConsole = this.addWindow( new this.ConsoleWindow( this.aoz,
				{
					id: 'win_console',
					x: 0,
					y: height,
					width: this.screen.vars.width,
					height: this.screen.vars.height - height,
					title: this.aoz.getMessage( 'db_console' ),
					borderH: 4,
					borderV: 4,
					inkOut: 1,
					inkIn: 1,
					inkFont: 2,
					paperIn: 9,
					nLines: 100,
					fontHeight: this.vars.fontHeight,
					visible: this.vars.console,
					screen: this.screen,
					parent: this,
				} ) );
			}
				if ( this.initializedConsole )
				{
					this.winLinkedFirst = this.winApplication;
					this.winApplication.winPrevious = undefined;
					this.winApplication.winNext = this.winConsole;
					this.winConsole.winPrevious = this.winApplication;
					this.winConsole.winNext = undefined;
					this.winLinkedLast = this.winConsole;
				}
				else
				{
			if ( this.displayMode == 'chrome' )
			{
				this.winLinkedFirst = this.winApplication;
				this.winApplication.winPrevious = undefined;
				this.winApplication.winNext = this.winStack;
				this.winStack.winPrevious = this.winApplication;
				this.winStack.winNext = this.winSource;
				this.winSource.winPrevious = this.winStack;
				this.winSource.winNext = this.winVariables;
				this.winVariables.winPrevious = this.winSource;
				this.winVariables.winNext = this.winWatch;
				this.winWatch.winPrevious = this.winVariables;
				this.winWatch.winNext = this.winConsole;
				this.winConsole.winPrevious = this.winWatch;
				this.winConsole.winNext = undefined;
				this.winLinkedLast = this.winConsole;
				if ( this.vars.winRight )
				{
					this.winApplication.linkedRight = [ this.winStack, this.winSource, this.winVariables, this.winWatch ];
					this.winStack.linkedLeft = [ this.winApplication ];
					this.winSource.linkedLeft = [ this.winApplication ];
					this.winVariables.linkedLeft = [ this.winApplication ];
					this.winWatch.linkedLeft = [ this.winApplication ];
					this.winApplication.linkedLeft = [];
					this.winStack.linkedRight = [];
					this.winSource.linkedRight = [];
					this.winVariables.linkedRight = [];
					this.winWatch.linkedRight = [];
				}
				else
				{
					this.winApplication.linkedLeft = [ this.winStack, this.winSource, this.winVariables, this.winWatch ];
					this.winStack.linkedRight = [ this.winApplication ];
					this.winSource.linkedRight = [ this.winApplication ];
					this.winVariables.linkedRight = [ this.winApplication ];
					this.winWatch.linkedRight = [ this.winApplication ];
					this.winApplication.linkedRight = [];
					this.winStack.linkedLeft = [];
					this.winSource.linkedLeft = [];
					this.winVariables.linkedLeft = [];
					this.winWatch.linkedLeft = [];
				}
				this.winApplication.linkedBottom = [ this.winConsole ];
				this.winStack.linkedBottom = [ this.winSource ];
				this.winSource.linkedTop = [ this.winStack ];
				this.winSource.linkedBottom = [ this.winVariables ];
				this.winVariables.linkedTop = [ this.winSource ];
				this.winVariables.linkedBottom = [ this.winWatch ];
				this.winWatch.linkedTop = [ this.winVariables ];
				this.winWatch.linkedBottom = [ this.winConsole ];
				this.winConsole.linkedTop = [ this.winApplication, this.winWatch ];
			}
			else if ( this.displayMode == 'aoz' )
			{
				this.winLinkedFirst = this.winSource;
				this.winSource.winPrevious = undefined;
				this.winSource.winNext = this.winApplication;
				this.winApplication.winPrevious = this.winSource;
				this.winApplication.winNext = this.winStack;
				this.winStack.winPrevious = this.winApplication;
				this.winStack.winNext = this.winVariables;
				this.winVariables.winPrevious = this.winStack;
				this.winVariables.winNext = this.winWatch;
				this.winWatch.winPrevious = this.winVariables;
				this.winWatch.winNext = this.winConsole;
				this.winConsole.winPrevious = this.winWatch;
				this.winConsole.winNext = undefined;
				this.winLinkedLast = this.winConsole;
				if ( this.vars.winRight )
				{
					this.winSource.linkedRight = [ this.winApplication, this.winStack, this.winVariables, this.winWatch ];
					this.winSource.linkedLeft = [];
					this.winApplication.linkedLeft = [ this.winSource ];
					this.winApplication.linkedRight = [];
					this.winStack.linkedLeft = [ this.winSource ];
					this.winStack.linkedRight = [];
					this.winVariables.linkedLeft = [ this.winSource ];
					this.winVariables.linkedRight = [];
					this.winWatch.linkedLeft = [ this.winSource ];
					this.winWatch.linkedRight = [];
				}
				else
				{
					this.winSource.linkedLeft = [ this.winApplication, this.winStack, this.winVariables, this.winWatch ];
					this.winSource.linkedRight = [];
					this.winApplication.linkedRight = [ this.winSource ];
					this.winApplication.linkedLeft = [];
					this.winStack.linkedRight = [ this.winSource ];
					this.winStack.linkedLeft = [];
					this.winVariables.linkedRight = [ this.winSource ];
					this.winVariables.linkedLeft = [];
					this.winWatch.linkedRight = [ this.winSource ];
					this.winWatch.linkedLeft = [];
				}
				this.winSource.linkedTop = [];
				this.winSource.linkedBottom = [ this.winConsole ];
				this.winApplication.linkedTop = [];
				this.winApplication.linkedBottom = [ this.winStack ];
				this.winStack.linkedTop = [ this.winApplication ];
				this.winStack.linkedBottom = [ this.winVariables ];
				this.winVariables.linkedTop = [ this.winStack ];
				this.winVariables.linkedBottom = [ this.winWatch ];
				this.winWatch.linkedTop = [ this.winVariables ];
				this.winWatch.linkedBottom = [ this.winConsole ];
				this.winConsole.linkedTop = [ this.winSource, this.winWatch ];
				this.winConsole.linkedBottom = [];
			}
				}
			}
		}
		this.drawScreen = function()
		{
			if ( !this.initialized )
				return;
			if ( this.vars.visible )
			{
				this.screen.currentTextWindow.cursorOff();
				this.screen.setAlpha( this.vars.alpha );
				this.screen.cls( 0 );
				this.drawWindows();
				if ( this.dragOutRectangle )
				{
					this.screen.setInk( this.dragInk );
					this.screen.box( { x:this.dragOutRectangle.x, y: this.dragOutRectangle.y, width: this.dragOutRectangle.width - 1, height: this.dragOutRectangle.height - 1 } );
				}
				this.screen.currentTextWindow.cursorOn();
				if ( this.winConsole.activated )
					this.winConsole.window.cursorDraw();
			}
		};
		this.swapStepSlow = function()
		{
			if ( this.stepSlowBase != 0 )
			{
				this.stepSlowBase = 0;
				this.debugUI.setDebuggerTitle( self.aoz.getMessage( 'db_titlepause' ) );
			}
			else
			{
				this.stepSlowBase = this.stepSlowSpeed;
				this.debugUI.setDebuggerTitle( self.aoz.getMessage( 'db_titlestepslow' ) );
			}
		}
		this.update = function( automatic )
		{
			var self = this;
			function doUpdate( timestamp )
			{
				self.updateRequested = false;
				if ( self.initialized )
				{
					switch ( self.vars.mode )
					{
						case 'play':
						case 'slow':
							self.frameCounter--;
							if ( self.frameCounter <= 0 )
							{
								self.frameCounter = self.frameCounterBase;
								self.aoz.onMessage(	{ command: 'stepInCodeOff' } );
								self.aoz.updateOnce( 16.6666 );
							}
							break;
						case 'stepwait':
							if ( self.stepSlowBase )
							{
								self.stepSlowCounter--;
								if ( self.stepSlowCounter <= 0 )
								{
									self.stepSlowCounter = self.stepSlowBase;
									self.nextStepInCode = 1;							
								}
							}
							self.aoz.onMessage(	{ command: 'stepInCodeOn' } );
							self.aoz.updateOnce( 16.6666 );
							break;
					}
					self.lastActivated--;
					if ( self.vars.visible )
					{
						self.dragWindows();
						self.updateWindows();
						self.renderingContext.clearDisplay();
						self.drawScreen();
						self.renderingContext.drawScreen( self.screen );
						document.body.style.cursor = self.cursor;
						if ( !self.initializedConsole )
						{
						self.debugUI.showDebuggerBar( true );
						self.showControls = true;
					}
					}
					else
					{
						self.debugUI.showDebuggerBar( false );
						self.renderingContext.render( false );
					}
				}
				if ( self.updateAutomatic )
				{
					self.updateRequested = true;
					window.requestAnimationFrame( doUpdate );
				}
			};
			if ( automatic != this.updateAutomatic )
			{
				this.updateAutomatic = automatic;
				if ( automatic && !this.updateRequested )
				{
					this.updateRequested = true;
					window.requestAnimationFrame( doUpdate );
				}
			}
			if ( !automatic )
				this.aoz.updateOnce( 16.6666 );
		};
		this.eventCallback = function( type, event, extra )
		{
			if ( !this.vars.visible && this.vars.mode == 'play' )
			{
				if ( type == 'keydown' && event.code == 'Escape' )
				{
					this.setVisible( true );
					this.renderingContext.display = this.display;
					this.renderingContext.filters = this.filters;
					this.renderingContext.platform = 'aoz';
					this.renderingContext.resize( true, this.renderingContext.width, this.renderingContext.height );
					return null;
				}
			}
			var saveConfig = false;
			var win;
			switch ( type )
			{
				case 'mouseleave':
					this.mouseIn = false;
					break;
				case 'mouseenter':
					this.mouseIn = true;
					break;
				case 'click':
					if ( this.mouseIn && this.lastActivated < 0 )
					{
						win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
						if ( win && win.title && win.arrowRectangle )
						{
							if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, win.arrowRectangle ) )
							{
								this.swapWindowMinimized( win );
								break;
							}
						}
						win = this.getWindowAtPoint( this.xMouse, this.yMouse );
						if ( win )
							this.mouseWindows( type, event, win );
					}
					break;
				case 'dblclick':
					if ( this.mouseIn )
					{
						win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
						if ( win && win.title )
						{
							var rect = { x: win.outRectangle.x, y: win.outRectangle.y, width: win.outRectangle.width, height: win.fontHeight };
							if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, rect ) )
							{
								this.swapWindowMinimized( win );
								break;
							}
						}
						var win = this.getWindowAtPoint( this.xMouse, this.yMouse );
						if ( win )
							this.mouseWindows( type, event, win );
					};						
					break;
				case 'mousedown':
					if ( this.mouseIn )
					{
						this.mouseKeys |= ( 1 << event.button );
						win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
						if ( win )
						{
							if ( !win.activated )
							{
								this.activateWindow( win );
								break;
							}
						}
						else 
						{
							this.callAllWindows( function( win )
							{
								win.previousActivated = win.activated;
								win.activated = false;
							} );
						}
						this.mouseWindows( type, event, win );
					}
					break;
				case 'mouseup':
					if ( this.mouseIn )
					{
						this.mouseKeys &= ~( 1 << event.button );
						win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
						this.mouseWindows( type, event, win );
					}
					break;
				case 'mousemove':
					if ( this.mouseIn )
					{
						this.xMouse = event.aozInfo.x;
						this.yMouse = event.aozInfo.y;
						win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
						this.mouseWindows( type, event, win );
					}
					break;
				case 'wheel':
					var win = this.getWindowAtPoint( this.xMouse, this.yMouse );
					if ( this.mouseWheelWindows( Math.floor( event.aozDeltaY ), win ) )
						return null;
					break;
				case 'keydown':
					if ( event.code == 'Escape' )
					{
						this.setVisible( false );
						this.renderingContext.display = this.renderingDisplay;
						this.renderingContext.filters = this.renderingFilters;
						this.renderingContext.platform = this.renderingPlatform;
						this.renderingContext.resize( true, this.renderingContext.width, this.renderingContext.height );
						this.setMode( 'play' );
						return event;
					}
					if ( this.vars.visible && this.vars.mode == 'stepwait' )
					{
						if ( !this.winConsole.activated ) 
						{
						if ( event.code == 'NumpadEnter' )
						{
							this.vars.winRight = !this.vars.winRight;
							this.repositionWindows();
							saveConfig = true;
						}
						if ( event.code == 'KeyM' )
						{
							this.vars.masks = this.vars.masks ? false : true;
							saveConfig = true;
						}
						if ( event.code == 'KeyG' )
						{
							this.vars.grid = this.vars.grid ? false : true;
							saveConfig = true;
						}
						if ( event.code == 'KeyR' )
						{
							this.vars.rulers = this.vars.rulers ? false : true;
							saveConfig = true;
						}
							if ( event.code == 'Space' && this.vars.mode == 'stepwait' )
							{
								this.swapStepSlow();
							}
						}
						if ( event.code == 'F8' )
						{
							this.setVisible( true );
							if ( this.vars.mode == 'stepwait' )
							{
								this.setMode( 'play' );
							}
							else
							{
								this.setMode( 'stepwait' );
								this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
							}
						}
						if ( event.code == 'F9' && this.vars.mode == 'stepwait' )
						{
							this.nextStepInCode = 1;
						}
						if ( event.code == 'F10' && this.vars.mode == 'stepwait' )
						{
							if ( event.getModifierState( 'Shift' ) )
							{
								if ( this.currentSection.returns.length > 0 )
								{
									this.breakSection = this.currentSection;
									this.breakPosition = this.currentSection.returns[ this.currentSection.returns.length - 1 ];
									break;
								}
							}
							else
							{
								if ( this.currentInstructionInfo
									&& ( this.currentInstructionInfo.type == 'procedure'
									|| this.currentInstructionInfo.type == 'function'
										|| this.currentInstructionInfo.type == 'class'
									|| this.currentInstructionInfo.type == 'instruction'
									|| this.currentInstructionInfo.type == 'method'
									|| this.currentInstructionInfo.token == 'gosub' ) )
									this.nextStepInCode = 2;
								else
									this.nextStepInCode = 1;
							}
						}
						if ( event.code == 'F11' && this.vars.mode == 'stepwait' )
						{
							this.nextStepInCode = 3;
						}
						this.keyWindows( type, event );						
					}
					break;
				case 'keyup':
					if ( this.vars.visible )
						this.keyWindows( type, event );
					break;
			};
			if ( saveConfig )
				this.saveConfig();
			if ( this.winSource && type != 'update' )
			{
				var toCall = false;
				if ( this.winSource.activated )
				{
					toCall = true;
					if ( ( type == 'keydown' || type == 'keyup' ) && event.code != 'ArrowLeft' && event.code != 'ArrowRight' && event.code != 'ArrowUp' && event.code != 'ArrowDown' && event.code != 'Enter' )
						toCall = false;
				}
				else if ( type != 'keydown' && type != 'keyup' ) 
					toCall = true;
				if ( toCall )
				{
					if ( type == 'keydown' && event.code == 'Enter' )
						this.winSource.breakAtCursor();
					else
						this.winSource.editor.eventCallback( type, event, extra );
				}
			}
			if ( this.winConsole && this.winConsole.activated || ( !this.winConsole.activated && type != 'keydown' && type != 'keyup' ) )
					this.winConsole.console.eventCallback( type, event, extra );
			if ( this.winConsole && this.winConsole.activated && ( type == 'keydown' || type == 'keyup' ) )
				return null;
			if ( this.winApplication && this.vars.mode != 'stepwait' )
			{
				if ( this.winApplication.activated || this.initializedConsole )
			{
				if ( event.aozInfo )
				{
					event.aozInfo.fromDebugger = true;
					event.aozInfo.x = this.winApplication.xMouseApplication;
					event.aozInfo.y = this.winApplication.yMouseApplication;
				}
				}
				return event;
			}
			return null;
		};
		this.setMode = function( mode )
		{
			if ( mode != this.vars.mode )
			{
				this.previousShowControls = !this.showControls;
				if ( mode == 'slow' || mode == 'play' )
				{
					if ( this.stepSlowBase )
						this.swapStepSlow();
					if ( this.vars.mode != 'slow' && this.vars.mode != 'play' )
					{
						if ( typeof actor_pauseAnimations != 'undefined' )
							actor_pauseAnimations( false );
						this.aoz.onMessage( { command: 'debuggerOn' } );
						this.aoz.onMessage(	{ command: 'stepInCodeOff' } );
						this.activateWindow( this.winApplication );				
						if ( this.winSource )
						this.winSource.setInstruction( null );
						this.update( true );
					}
					if ( mode == 'play' )
					{
						this.frameCounterBase = 1;
						this.frameCounter = 1;
					}
				}
				else if ( mode == 'stepwait' )
				{
					if ( this.vars.mode != 'stepwait' )
					{
						if ( typeof actor_pauseAnimations != 'undefined' )
							actor_pauseAnimations( true );
						this.aoz.onMessage( { command: 'debuggerOn' } );
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
						this.update( true );
					}
				}
				var text = '';
				switch ( mode )
				{
					case 'stepwait':
						text = this.aoz.getMessage( 'db_titlepause' );
						break;
					case 'slow':
						text = this.aoz.getMessage( 'db_titleslow' );
						break;
					case 'play':
						text = this.aoz.getMessage( 'db_titleplay' );
						break;
				}
				this.debugUI.setDebuggerTitle( text );
				this.vars.mode = mode;
			}
		}
		this.clickUI = function( args )
		{
			switch ( args.ID$ )
			{
				case '':
					break;
				case 'setup':
					this.winApplication.editCollisionMaskEnd( true );
					this.displaySettings( true );
					break;
				case 'doBreak':
					this.setMode( 'stepwait' );
					this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
					break;
				case 'stepIn':
					if ( this.vars.mode == 'stepwait' && this.stepSlowBase == 0 )
					{
						this.nextStepInCode = 1;
					}
					else
					{
						if ( this.stepSlowBase != 0 )
							this.swapStepSlow();
						this.setMode( 'stepwait' );
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
					}
					break;
				case 'skip':
					if ( this.vars.mode == 'stepwait' && this.stepSlowBase == 0 )
					{
						this.nextStepInCode = 3;
					}
					else
					{
						if ( this.stepSlowBase != 0 )
							this.swapStepSlow();
						this.setMode( 'stepwait' );
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
					}
					break;
				case 'stepOver':
					if ( this.vars.mode == 'stepwait' && this.stepSlowBase == 0 )
					{
						if ( this.currentInstructionInfo &&
							( this.currentInstructionInfo.type == 'procedure'
							|| this.currentInstructionInfo.type == 'function'
							|| this.currentInstructionInfo.type == 'instruction'
							|| this.currentInstructionInfo.type == 'method'
							|| this.currentInstructionInfo.token == 'gosub' ) )
							this.nextStepInCode = 2;
						else
							this.nextStepInCode = 1;
					}
					else
					{
						if ( this.stepSlowBase != 0 )
							this.swapStepSlow();
						this.setMode( 'stepwait' );
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
					}
					break;
				case 'stepSlow':
					if ( this.vars.mode == 'stepwait' )
					{
						this.swapStepSlow();
					}
					else
					{
						this.setMode( 'stepwait' );
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
					}
					break;
				case 'runSlowMotion':
					this.setMode( 'slow' );
					this.frameCounterBase = 60;
					break;
				case 'runFullSpeed':
					this.setMode( 'play' );
					break;
				case 'help':
					this.displayHelp( true );
					break;
			}
		};
		this.uiClickSettings = function( args )
		{
			this.winSettings.uiClick( args );
		};
		this.uiClickMask = function( args )
		{
			this.winApplication.uiClickMask( args );
		};
		this.uiClickHelp = function( args )
		{
			this.winHelp.uiClick( args );
		};
		this.getDebuggerUIRectangle = function( element )
		{
			var info1 = this.renderingContext.getDocumentCoordPercentages( this.winApplication.workRectangle.x, this.winApplication.workRectangle.y, this.screen );
			var info2 = this.renderingContext.getDocumentSizePercentages( this.winApplication.workRectangle.width, this.winApplication.workRectangle.height, this.screen );
			return {
				x: info1.x,
				y: info1.y,
				width: info2.width,
				height: info2.height
			}
		};
		this.isDebuggerUI = function( element )
		{
			return ( this.initialized && this.vars.visible );
		}
		this.displaySettings = function( onOff )
		{
			if ( onOff )
			{
				if ( !this.winSettings )
				{
					var width = 1920 / 2.08;
					var height = 1080 / 1.5;
					this.winSettings = this.addWindow( new this.SettingsWindow( this.aoz,
					{
						id: 'win_settings',
						x: 1920 / 2 - width / 2 - 16,
						y: 100,
						width: width,
						height: height,
						title: this.aoz.getMessage( 'db_settings' ),
						borderH: 0,
						borderV: 0,
						inkOut: 1,
						inkIn: 1,
						inkFont: 2,
						paperIn: 9,
						fontHeight: this.vars.fontHeight,
						visible: true,
						topFront: true,
						screen: this.screen,
						parent: this
					} ) );
				}
			}
			else if ( this.winSettings )
			{
				this.winSettings.destroy();
				this.winSettings = undefined;
			}
		};
		this.displayHelp = function( onOff )
		{
			if ( onOff )
			{
				if ( !this.winHep )
				{
					var width = 1920 / 2;
					var height = 1080 / 1.2;
					this.winHelp = this.addWindow( new this.HelpWindow( this.aoz,
					{
						id: 'win_help',
						x: 1920 / 2 - width / 2 - 16,
						y: 1080 / 2 - height / 2,
						width: width,
						height: height,
						title: this.aoz.getMessage( 'db_help' ),
						borderH: 0,
						borderV: 0,
						inkOut: 1,
						inkIn: 1,
						inkFont: 2,
						paperIn: 9,
						fontHeight: this.vars.fontHeight,
						visible: true,
						topFront: true,
						screen: this.screen,
						parent: this
					} ) );
				}
			}
			else if ( this.winHelp )
			{
				this.winHelp.destroy();
				this.winHelp = undefined;
			}
		};
		this.enableSliders = function( onOff )
		{
			for ( var w = 0; w < this.uiList.length; w++ )
			{
				var element = this.uiList[ w ];
				if ( element._type == 'slider' && element.slider )
					element.slider.set_enabled( onOff );
			}
		};
		this.showUI = function( filters )
		{
			if ( filters )
			{
				filters = ( typeof filters == 'string' ? [ filters ] : filters );
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					for ( var f = 0; f < filters.length; f++ )
					{
						if ( element._tags.indexOf( filters[ f ] ) >= 0 )
						{
							if ( element._active && !element._visible )
							{
								if ( element.className )
								{
								}
								else
								{
									if ( element.slider )
										element.slider.set_visible( true );
									else
										this.aoz.ui.setVisible( { id: element.id, visible: true } );
								}
								element._visible = true;
							}
						}
					}
				}
			}
			else
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					if ( element._active && !element._visible )
					{
						if ( element.className )
						{
						}
						else
						{
							if ( element.slider )
								element.slider.set_visible( true );
							else
								this.aoz.ui.setVisible( { id: element.id, visible: true } );
						}
						element._visible = true;
					}
				}
			}
		};
		this.hideUI = function( filters )
		{
			if ( filters )
			{
				filters = ( typeof filters == 'string' ? [ filters ] : filters );
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					for ( var f = 0; f < filters.length; f++ )
					{
						if ( element._tags.indexOf( filters[ f ] ) >= 0 )
						{
							if ( element._active && element._visible )
							{
								if ( element.className )
								{
								}
								else
								{
									if ( element.slider )
										element.slider.set_visible( false );
									else
										this.aoz.ui.setVisible( { id: element.id, visible: false } );
								}
								element._visible = false;
							}
						}
					}
				}
			}
			else
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					if ( element._active && element._visible )
					{
						if ( element.className )
						{
						}
						else
						{
							if ( element.slider )
								element.slider.set_visible( false );
							else
								this.aoz.ui.setVisible( { id: element.id, visible: false } );
						}
						element._visible = false;
					}
				}
			}
		};
		this.createUI = function( filters )
		{
			if ( filters )
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					for ( var f = 0; f < filters.length; f++ )
					{
						if ( element._tags.indexOf( filters[ f ] ) >= 0 )
						{
							this.createUIElement( element );
						}
					}
				}
			}
			else
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					this.createUIElement( this.uiList[ e ] );
				}
			}
		};
		this.createUIElement = function( element )
		{
			if ( !element._active )
			{
				if ( element.className )
				{
					element._element = this.debugUI.getDebuggerButton( element.className );
					var visible = ( typeof element._visible  != 'undefined' ? element._visible : true );
					visible = ( visible ? 'inline-block' : 'none' );
					element._element.style.display = visible;
				}
				else
				{
					if ( typeof element._x != 'undefined' )
					{
						element.x = element._x * this.scaleX; 
						element.y = element._y * this.scaleY; 
						element.width = element._width * this.scaleX;
						element.height = element._height * this.scaleY;
						if ( element._fontSize )
						{
							element.fontSize = element._fontSize * ( this.scaleX + this.scaleY ) / 2;
						}
					}
					switch ( element._type )
					{
						case 'htmlbutton':
							element._element = this.debugUI.getDebuggerButton( element.className );
							break;
						case 'slider':
							element.screen = this.screen;
							element.slider = new this.aoz.ext_slider.Slider( this.aoz, element );
							break;
					}
				}
				element._active = true;
				element._visible = true;
			}
		};
		this.deleteUI = function( filters )
		{
			if ( filters )
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					for ( var f = 0; f < filters.length; f++ )
					{
						if ( element._tags.indexOf( filters[ f ] ) )
						{
							this.deleteUIElement( element );
						}
					}
				}
			}
			else
			{
				for ( var e = 0; e < this.uiList.length; e++ )
				{
					var element = this.uiList[ e ];
					this.deleteUIElement( element );
				}
			}
		};
		this.deleteUIElement = function( element )
		{
			if ( element._active )
			{
				if ( element.className )
				{
				}
				else
				{
					if ( element.slider )
					{
						element.slider.destroy();
						element.slider = null;
					}
					else
					{
						this.aoz.ui.delete( element );
					}
				}
				element._active = false;
				element._visible = false;
			}
		};
		this.setVisible = function( visible )
		{
			if ( visible != this.vars.visible )
			{
				this.vars.visible = visible ? 1 : 0;
				this.screen.setVisible( visible ? true : false );
				if ( visible )
					this.showUI( [ '#ui', '#variables', '#console', '#watch' ] );
				else
					this.hideUI( [ '#ui', '#variables', '#console', '#watch' ] );
			}
		};
		this.findUIElement = function( id )
		{
			for ( var u = 0; u < this.uiList.length; u++ )
			{
				var element = this.uiList[ u ];
				if ( element.id == id )
					return element;
			}
			return undefined;
		};
		this.prompt = function( args, callback, extra )
		{
			this.promptCallback = callback;
			this.promptExtra = extra;
			this.promptType = args.inputType;
			args.confirmButton = 'OK';
			args.closeButton = 'Cancel';
			args.onConfirm = 'ext_debugging:onPromptConfirm';
			if ( args.inputType == 'number' )
				args.content = this.aoz.getMessage( 'db_enternumber' );
			else
				args.content = this.aoz.getMessage( 'db_entertext' );
			this.aoz.ui.showModel( args );
		};
		this.onPromptConfirm = function( args )
		{
			if ( this.promptType == 'text' )
				this.promptCallback( true, args.VALUE$, this.promptExtra );
			else
				this.promptCallback( true, args.VALUE, this.promptExtra );
		};
		this.onSliderChange = function( args )
		{
			if ( args.ID$ == 'console_slider' )
				this.findWindow( 'win_console' ).setPosition( Math.floor( args.POSITION ) );
			else if ( args.ID$ == 'pile_slider' )
				this.findWindow( 'win_stack' ).position = Math.floor( args.POSITION );
			else if ( args.ID$ == 'variables_slider' )
				this.findWindow( 'win_variables' ).position = Math.floor( args.POSITION );
			else if ( args.ID$ == 'watch_slider' )
				this.findWindow( 'win_watch' ).position = Math.floor( args.POSITION );
			else if ( args.ID$ == 'help_slider' )
				this.findWindow( 'win_help' ).position = Math.floor( args.POSITION );
			else if ( args.ID$ == 'variablesview_slider' )
			{
				var win1 = this.findWindow( 'win_variables' );
				if ( win1 )
				{
					win2 = win2.findChild( 'win_variablespopup' );
					if ( win2 )
						win2.position = Math.floor( args.POSITION );
				}
			}
		};
		this.setWindowVisible = function( name, onOff )
		{
			if ( onOff != this.vars[ name ] )
			{
				this.vars[ name ] = onOff;
				var win = this.findWindow( name );
				if ( win )
					win.visible = onOff;
			}
		};
		this.textZone = function( win, position, text, align, hilighted )
		{
			var width = win.screen.textLength( text );
			var zone = { x: position.x, y: position.y, width: width, height: this.vars.fontHeight };
			var paper = hilighted ? this.getInk( 'textFont', this.INK_EXTRA ) : this.getInk( 'inRectangle', win.activated ? this.INK_ACTIVATED : this.INK_NORMAL );
			var pen = hilighted ? this.getInk( 'textFont', this.INK_ACTIVATED ) : this.getInk( 'textFont', win.activated ? this.INK_ACTIVATED : this.INK_NORMAL );
			win.screen.setInk( paper );
			win.screen.bar( zone );
			win.screen.setInk( pen );
			win.screen.text( position, text, align );
			return zone;
		};
		this.stepIn = function( section )
		{
			if ( !this.initialized )
				return false;
			this.currentSection = section;
			if ( section )
			{
			if ( this.nextStepInCode == 1 )
			{
				this.nextStepInCode = 0;
				return true;
			}
			if ( this.nextStepInCode == 2 )
			{
				if ( typeof actor_pauseAnimations != 'undefined' )
					actor_pauseAnimations( false );
				this.breakSection = this.currentSection;
				this.breakPosition = this.currentSection.position + 1;
				this.nextStepInCode = 0;
				return true;
			}
			if ( this.nextStepInCode == 3 )
			{
				if ( section )
				{
					if ( this.currentInstructionInfo.token != 'end proc'
						&& this.currentInstructionInfo.token != 'end procedure'
						&& this.currentInstructionInfo.token != 'end instruction'
						&& this.currentInstructionInfo.token != 'end function'
						&& this.currentInstructionInfo.token != 'end method'
						&& this.currentInstructionInfo.token != 'end class' )
						section.position++;
				}
				this.nextStepInCode = 0;
			}
				if ( this.breakSection && !( section == this.breakSection && section.position == this.breakPosition ) )
				return true;
			}
			this.breakSection = null;
			this.setMode( 'stepwait' );
			this.debugger.currentInstructionInfo = null;
			if ( section && section.debuggerBlocks && section.debuggerBlocks[ section.position ] )
			{
				if ( typeof actor_pauseAnimations != 'undefined' )
					actor_pauseAnimations( true );
				this.debugger.currentInstructionInfo = section.debuggerBlocks[ section.position ].call( section, this.aoz, section.vars, 'info' );
				if ( this.debugger.winSource )
					this.debugger.winSource.setInstruction( this.debugger.currentInstructionInfo );
				if ( this.debugger.winWatch )
					this.debugger.winStack.refresh( section );
				return false;
			}
			return true;
		};
		this.SourceWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.window = this.screen.windOpen( 1,
			{
				x: this.workRectangle.x,
				y: this.workRectangle.y,
				width: Math.floor( this.workRectangle.width / this.debugger.screenFontWidth ),
				height: Math.floor( this.workRectangle.height / this.debugger.screenFontHeight )
			},
			{
				paper: 0,
				pen: this.debugger.getInk( 'sourceFont', this.debugger.INK_NORMAL ),
				noAndX: true,
			}, '' );
			var argsEditor =
			{
				index: 'debugger',
				paper: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen: this.debugger.getInk( 'sourceFont', this.debugger.INK_NORMAL ),
				blockPaper: this.debugger.getInk( 'sourceFont', this.debugger.INK_EXTRA ),
				blockPen: this.debugger.getInk( 'sourceFont', this.debugger.INK_ACTIVATED ),
				screen: this.screen,
				window: this.window,
				readOnly: false,
				paper1: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen1: this.debugger.getInk( 'slider', this.debugger.INK_NORMAL ),
				outline1: this.debugger.getInk( 'sliderOutline', this.debugger.INK_NORMAL ),
				pattern1: 0,
				paper2: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen2: this.debugger.getInk( 'slider', this.debugger.INK_NORMAL ),
				outline2: this.debugger.getInk( 'sliderOutline', this.debugger.INK_NORMAL ),
				pattern2: 0,
				source: this.aoz.sources[ 0 ].source,
				noEvents: true
			};
			this.editor = aoz.ext_source_editor.openEditor( argsEditor );
			this.editorBlock = 
			{
				id: 'nextInstruction', 
				startLine: -1, 
				endLine: -1, 
				startColumn: -1, 
				endColumn: - 1,
				paper: this.debugger.getInk( 'sourceFont', this.debugger.INK_EXTRA ),
				pen: this.debugger.getInk( 'sourceFont', this.debugger.INK_ACTIVATED )
			};
			this.editor.setBlock( this.editorBlock );
			this.editor.startWordUnderMouse( 
			{
				paper: this.debugger.getInk( 'wordUnderMouse', this.debugger.INK_EXTRA ), 
				pen: this.debugger.getInk( 'wordUnderMouse', this.debugger.INK_NORMAL ) 
			}, this.validateWordUnderMouse, this );
			this.currentLine = 0;
			this.currentColumn = 0;
			this.flashSpeed = 25;
			this.flashCounter = this.flashSpeed;
			this.paramsInfo = undefined;
		};
		this.SourceWindow.prototype.destroy = function()
		{
			this.aoz.ext_source_editor.closeEditor( { index: 'debugger' } );
			this.debugger.destroyWindow.call( this );
		};
		this.SourceWindow.prototype.getBlockUnderCursor = function( section )
		{
			for ( var b = 0; b < section.debuggerBlocks.length; b++ )
			{
				var info = section.debuggerBlocks[ b ].call( section, this.aoz, section.vars, 'info' );
				if ( info && info.position )
				{
					info = info.position.split( ':' );
					var line = parseInt( info[ 1 ] );
					if ( line == this.editor.yCursor )
						return b;
				}
			}
			return -1;
		};
		this.SourceWindow.prototype.setInstruction = function( info )
		{
			if ( info )
			{
				var pos = info.position.split( ':' );
				var line = parseInt( pos[ 1 ] );
				var startColumn = parseInt( pos[ 2 ] );
				var endColumn = parseInt( pos[ 3 ] );
				if ( line != this.editorBlock.startLine || startColumn != this.editorBlock.startColumn || endColumn != this.editorBlock.endColumn )
				{
					this.editorBlock.startLine = line;
					this.editorBlock.startColumn = startColumn;
					this.editorBlock.endLine = line;
					this.editorBlock.endColumn = endColumn;
					this.editor.setBlock( this.editorBlock );
					this.editor.setCursorPosition( startColumn, line, { recenter: true } );
					this.debugger.winWatch.deleteParameters();
					this.paramsInfo = this.debugger.currentSection.debuggerBlocks[ this.debugger.currentSection.position ].call( this.debugger.currentSection, this.aoz, this.debugger.currentSection.vars, 'getParams' );				
					if ( this.paramsInfo )
					{
						var title = 'Instruction ' + info.name + ':';
						this.debugger.winWatch.addParameter(
						{
							section: null,
							source: title,
							expression: null
						} );
						this.debugger.winWatch.addParameter(
						{
							section: null,
							source: '-'.repeat( title.length ),
							expression: null
						} );
						for ( var p = 0; p < this.paramsInfo.length; p++ )
						{
							var param = this.paramsInfo[ p ];
							param.data = JSON.parse( param.data );
							this.debugger.winWatch.addParameter(
							{
								section: this.debugger.currentSection,
								source: '  ' + ( p + 1 ) + '- ' + param.data.name,
								expression: param.value
							} );
						}
					}
				}
			}
			else
			{
				this.editorBlock.startColumn = -1;
				this.editorBlock.endColumn = -1;
				this.editor.setBlock( this.editorBlock );
				this.debugger.winWatch.deleteParameters();
				this.paramsInfo = undefined;
			}
		}
		this.SourceWindow.prototype.isFocussed = function()
		{
			return this.editor.isFocussed();
		};
		this.SourceWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			if ( eventName == 'mousedown' )
			{
				if ( this.mouseIn )
					this.window.activate();
				else
					this.window.deactivate();		
				this.editor.vars.paper = this.mouseIn ? 10 : 9;
				this.editor.setFocus( this.mouseIn );
			}
			if ( eventName == 'dblclick' && this.activated )
			{
				this.breakAtCursor();
			}
		};
		this.SourceWindow.prototype.breakAtCursor = function()
		{
			if ( this.debugger.vars.mode == 'stepwait' && this.debugger.currentSection && this.debugger.currentSection.debuggerBlocks )
			{
				var cursor = this.editor.getCursorPosition();
				for ( var b = 0; b < this.debugger.currentSection.debuggerBlocks.length; b++ )
				{
					var block = this.debugger.currentSection.debuggerBlocks[ b ];
					var info = block.call( this.debugger.currentSection, this.aoz, this.debugger.currentSection.vars, 'info' );
					var pos = info.position.split( ':' );
					var line = parseInt( pos[ 1 ] );
					if ( line == cursor.y )
					{
						var startColumn = parseInt( pos[ 2 ] );
						var endColumn = parseInt( pos[ 3 ] );
						if ( cursor.x >= startColumn && cursor.x < endColumn )
						{
							this.debugger.breakSection = this.debugger.currentSection;
							this.debugger.breakPosition = b;
						}
					}
				}
			}
		}
		this.SourceWindow.prototype.validateRectangle = function( rectangle )
		{
			rectangle.x = typeof rectangle.x == 'undefined' ? this.workRectangle.x : rectangle.x;
			rectangle.y = typeof rectangle.y == 'undefined' ? this.workRectangle.y : rectangle.y;
			rectangle.width = typeof rectangle.width == 'undefined' ? this.workRectangle.width : rectangle.width;
			rectangle.height = typeof rectangle.height == 'undefined' ? this.workRectangle.height : rectangle.height;
			var w = Math.floor( rectangle.width / this.debugger.screenFontWidth );
			var h = Math.floor( rectangle.height / this.debugger.screenFontHeight );
			if ( w >= 16 && h >= 2 )
			{
				if ( this.window.setRectangle( { x: rectangle.x, y: rectangle.y, width: w , height: h }, { noMaskX: true, check: true } ) )
				{
					return { x: rectangle.x, y: rectangle.y, width: w * this.window.fontWidth, height: h * this.window.fontHeight };
				}
			}
			return null;
		};
		this.SourceWindow.prototype.setRectangle = function( rectangleOut, rectangleIn )
		{
			this.debugger.setRectangle.call( this, rectangleOut, rectangleIn );
			if ( !this.minimized )
			{
				var w = Math.floor( this.workRectangle.width / this.window.fontWidth );
				var h = Math.floor( this.workRectangle.height / this.window.fontHeight );
				this.window.setRectangle( { x: this.workRectangle.x, y: this.workRectangle.y, width: w , height: h }, { noMaskX: true, check: false } )
				this.editor.onResize( false );
			}
		};
		this.SourceWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( !this.minimized )
			{
				if ( this.editorBlock )
				{
					this.flashCounter--;
					if ( this.flashCounter == 0 )
					{
						this.editor.setBlock( { id: 'nextInstruction', startLine: -1, endLine: -1, startColumn: -1, endColumn: - 1, paper: 0, pen: 0 } );
					}
					else if ( this.flashCounter <= -this.flashSpeed )
					{
						this.editor.setBlock( this.editorBlock );
						this.flashCounter = this.flashSpeed;
					}
					this.editor.draw( true );
					this.window.cursorDraw();
				}
				this.drawChildren();
			}
		};
		this.SourceWindow.prototype.validateWordUnderMouse = function( line, xCursor, yCursor )
		{
			if ( this.debugger.currentSection && this.debugger.currentSection.debuggerBlocks )
			{
				for ( var b = 0; b < this.debugger.currentSection.debuggerBlocks.length; b++ )
				{
					var block = this.debugger.currentSection.debuggerBlocks[ b ];
					var info = block.call( this.debugger.currentSection, this.aoz, this.debugger.currentSection.vars, 'info' );
					var pos = info.position.split( ':' );
					var line = parseInt( pos[ 1 ] );
					if ( line == yCursor )
					{
						var startColumn = parseInt( pos[ 2 ] );
						var endColumn = parseInt( pos[ 3 ] );
						if ( xCursor > startColumn && xCursor < endColumn )
						{
							var paramsInfo = block.call( this.debugger.currentSection, this.aoz, this.debugger.currentSection.vars, 'getParams' );
							if ( paramsInfo )
							{
								for ( var p = 0; p < paramsInfo.length; p++ )
								{
									var param = paramsInfo[ p ];
									param.data = JSON.parse( param.data );
									if ( xCursor >= param.data.start && xCursor < param.data.end )
									{
										var identifier = yCursor + ':' + param.data.start + ':' + param.data.end;
										if ( this.windows.length == 0 )
											this.hintIdentifier = '';
										if ( identifier != this.hintIdentifier )
										{
											this.hintIdentifier = identifier;
											var text = '' + param.value.call( this.debugger.currentSection, this.aoz, this.debugger.currentSection.vars );
											if ( text.length > 30 )
												text = text.substring( 0 , 30 ) + '...';
											this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
											var width = this.screen.textLength( text ) + 16;	
											var coord1 = this.editor.getScreenRectangle( param.data.start, yCursor );
											var coord2 =  this.editor.getScreenRectangle( param.data.end, yCursor + 1 );
											this.addChild( new this.debugger.HintWindow( this.aoz,
											{
												id: 'win_hint',
												type: 'hint',
												checkRectangle: { x: coord1.x, y: coord1.y, width: coord2.x - coord1.x, height: coord2.y - coord1.y },
												position: '#right #top',
												timeout: 25,
												width: this.screen.vars.width / 10,
												borderH: 2,
												borderV: 2,
												inkOut: 1,
												inkIn: 1,
												paperIn: 11,
												inkFont: 1,
												fontHeight: this.debugger.vars.fontHeight,
												visible: true,
												screen: this.screen,
												text: text,
												parent: this
											} ), true );
										}
										return { start: param.data.start, end: param.data.end };
									}
								}
							}
						}
					}
				}
			}
			return null;
		}
		this.InstructionHint = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.value = args.value;
			this.parent = args.parent;
		};
		this.InstructionHint.prototype.draw = function()
		{
			this.drawWindow();
			this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
			var x = this.workRectangle.x;
			var y = this.workRectangle.y;
			this.screen.setInk( this.debugger.getInk( 'textFont', this.debugger.INK_ACTIVATED ) );
			var text = '' + line.value;
			this.screen.text( { x: x, y: y }, text, '#top #left' );		
		};
		this.ConsoleWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.window = this.screen.windOpen( 2,
			{
				x: this.workRectangle.x,
				y: this.workRectangle.y,
				width: Math.floor( this.workRectangle.width / this.debugger.screenFontWidth ) - 2,
				height: Math.floor( this.workRectangle.height / this.debugger.screenFontHeight )
			},
			{
				paper: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen: this.debugger.getInk( 'consoleFont', this.debugger.INK_NORMAL ),
				noAndX: true,
			}, '' );
			var argsEditor =
			{
				index: 'console',
				console: true,
				paper: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen: this.debugger.getInk( 'consoleFont', this.debugger.INK_NORMAL ),
				blockPaper: this.debugger.getInk( 'consoleFont', this.debugger.INK_EXTRA ),
				blockPen: this.debugger.getInk( 'consoleFont', this.debugger.INK_ACTIVATED ),
				screen: this.screen,
				window: this.window,
				readOnly: false,
				paper1: this.debugger.getInk( 'inRectangle', this.debugger.INK_NORMAL ),
				pen1: this.debugger.getInk( 'consoleFont', this.debugger.INK_NORMAL ),
				outline1: this.debugger.getInk( 'consoleFont', this.debugger.INK_NORMAL ),
				pattern1: 0,
				paper2: this.debugger.getInk( 'inRectangle', this.debugger.INK_ACTIVATED ),
				pen2: this.debugger.getInk( 'consoleFont', this.debugger.INK_ACTIVATED ),
				outline2: this.debugger.getInk( 'consoleFont', this.debugger.INK_ACTIVATED ),
				pattern2: 0,
				prompt: 'Aoz> ',
				noEvents: true
			};
			this.console = aoz.ext_source_editor.openEditor( argsEditor );
			this.activated = false;
			this.console.setFocus( this.activated );
			this.consoleSave = this.console;
		};
		this.ConsoleWindow.prototype.destroy = function()
		{
			this.aoz.ext_source_editor.closeConsole( { index: 'console' } );
			this.debugger.destroyWindow.call( this );
		};
		this.ConsoleWindow.prototype.log = function( args )
		{
			this.aoz.ext_source_editor.printConsole( { index: 'console', text: args.text, sameLine: typeof args.sameLine != 'undefined' ? args.sameLine : true } );
			if ( !args.wait )
				this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
			else
			{
				var self = this;
				setTimeout( function()
				{
					self.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
				}, 500 );
			}
		};
		this.ConsoleWindow.prototype.isFocussed = function()
		{
			return this.console.isFocussed();
		};
		this.ConsoleWindow.prototype.onUpdate = function()
		{
			if ( !this.debugger.initializedConsole )
			{
			if ( this.activated && !this.previousActivated && this.debugger.vars.mode != 'stepwait'  )
				this.debugger.setMode( 'stepwait' );
			}
			if ( this.debugger.initializedConsole )
			{
				var text = this.aoz.getMessage( 'db_console' ) + ' - ';
				switch ( this.debugger.vars.mode )
				{
					case 'stepwait':
						text += this.aoz.getMessage( 'db_titlepause' );
						break;
					case 'slow':
						text += this.aoz.getMessage( 'db_titleslow' );
						break;
					case 'play':
						text += this.aoz.getMessage( 'db_titleplay' );
						break;
				}
				this.title = text;
				if ( this.debugger.winApplication.activated )
				{
					this.activated = false;
					this.previousActivated = false; 
				}
			}
			if ( this.activated )
				this.console.setFocus( true );
			else
				this.console.setFocus( false );
			var command = this.console.getLastCommand();
			if ( command != '' )
			{
				var self = this;
				function inactivate()
				{
					self.activated = false;
					self.previousActivated = false; 
				}
				function activate()
				{
					self.activated = true;
					self.previousActivated = true; 
				}
				if ( !this.debugger.initializedConsole )
				{
				switch ( command.toLowerCase() )
				{
					case 'setup':
						this.debugger.editCollisionMaskEnd( true );
						this.debugger.displaySettings( true );
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						break;
					case 'run':
						this.debugger.setMode( 'play' );
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						return;
					case 'runslow':
						this.debugger.setMode( 'slow' );
						this.debugger.frameCounterBase = 60;
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						return;
					case 'step':
						this.debugger.nextStepInCode = 1;
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						return;
					case 'stepover':
						if ( this.debugger.currentInstructionInfo &&
							( this.debugger.currentInstructionInfo.type == 'procedure'
							|| this.debugger.currentInstructionInfo.type == 'function'
							|| this.debugger.currentInstructionInfo.type == 'instruction'
							|| this.debugger.currentInstructionInfo.type == 'method'
							|| this.debugger.currentInstructionInfo.token == 'gosub' ) )
							this.debugger.nextStepInCode = 2;
						else
							this.debugger.nextStepInCode = 1;
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						return;
					case 'stepout':
						inactivate();
						this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						return;
						case 'clear':
							this.console.clear();
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						case 'output':
							if ( this.debugger.vars.consoleOutput = 'debugger' )
								this.debugger.vars.consoleOutput = 'application';
							else
								this.debugger.vars.consoleOutput = 'debugger';
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
					default:
						break;
				}
				}
				else
				{
					switch ( command.toLowerCase() )
					{
						case 'setup':
							this.debugger.editCollisionMaskEnd( true );
							this.debugger.displaySettings( true );
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							break;
						case 'run':
							this.debugger.setMode( 'play' );
							this.debugger.activateWindow( this );
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						case 'runslow':
							this.debugger.setMode( 'slow' );
							this.debugger.frameCounterBase = 60;
							this.debugger.activateWindow( this );
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						case 'clear':
							this.console.clear();
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						case 'reset':
							this.console.clear();
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							this.debugger.resetWindowsPositions();
							this.debugger.saveConfig();
							return;
						case 'pause':
							this.debugger.setMode( 'stepwait' );
							this.debugger.activateWindow( this );
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						case 'output':
							if ( this.debugger.vars.consoleOutput = 'debugger' )
								this.debugger.vars.consoleOutput = 'application';
							else
								this.debugger.vars.consoleOutput = 'debugger';
							this.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
							return;
						default:
							break;
					}
				}
				if ( this.debugger.debugEvents.isConnected() )
				{
					command += '\n';
					this.debugger.debugEvents.sendMessage(
					{
						module: 'project',
						method: 'getTranspiledCommand',
						options: { value: command, tags: {} }
					}, function( response, extra )
					{
						if ( !response.error )
						{
							self.aoz.onMessage( { command: 'executeCommand', parameter: response.code } );
							if ( self.debugger.vars.consoleOutput != 'debugger' )
								self.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						}
						else
						{
							self.aoz.ext_source_editor.printConsole( { index: 'console', text: response.code } );
							self.aoz.ext_source_editor.nextConsoleLine( { index: 'console' } );
						}
					} );
				}
			}
		};
		this.ConsoleWindow.prototype.validateRectangle = function( rectangle )
		{
			rectangle.x = typeof rectangle.x == 'undefined' ? this.workRectangle.x : rectangle.x;
			rectangle.y = typeof rectangle.y == 'undefined' ? this.workRectangle.y : rectangle.y;
			rectangle.width = typeof rectangle.width == 'undefined' ? this.workRectangle.width : rectangle.width;
			rectangle.height = typeof rectangle.height == 'undefined' ? this.workRectangle.height : rectangle.height;
			var w = Math.floor( rectangle.width / this.window.fontWidth );
			var h = Math.floor( rectangle.height / this.window.fontHeight );
			if ( w >= 16 && h >= 2 )
			{
				if ( this.window.setRectangle( { x: rectangle.x, y: rectangle.y, width: w , height: h }, { noMaskX: true, check: true } ) )
				{
					return { x: rectangle.x, y: rectangle.y, width: w * this.window.fontWidth, height: h * this.window.fontHeight };
				}
			}
			return null;
		};
		this.ConsoleWindow.prototype.setRectangle = function( rectangleOut, rectangleIn )
		{
			this.debugger.setRectangle.call( this, rectangleOut, rectangleIn );
			var w = Math.floor( this.workRectangle.width / this.window.fontWidth );
			var h = Math.floor( this.workRectangle.height / this.window.fontHeight );
			if ( !this.minimized )
			{
				this.window.setRectangle( { x: this.workRectangle.x, y: this.workRectangle.y, width: w , height: h }, { noMaskX: true, check: false } )
				this.console.onResize( false );
			}
		};
		this.ConsoleWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( !this.minimized )
			{
				this.console.draw( true );
				this.window.cursorDraw();
			}
		};
		this.VariablesWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.position = 0;
			this.sections = [];
			this.displayList = [];
			this.currentLine = -1;
			this.popupCounter = 0;
			this.slider = this.debugger.findUIElement( 'variables_slider' );
		};
		this.VariablesWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			var self = this;
			function unlightAll()
			{
				for ( var v = 0; v < self.displayList.length; v++ )
				{
					var info = self.displayList[ v ];
					if ( info && typeof info != 'string' )
						info.hilighted = false;
				}
			};
			if ( this.debugger.mouseCaptured )
				return this.mouseChildren( eventName, event, winAbove );;
			var done = false;
			if ( this.mouseIn )
			{
				if ( this.xMouse < this.workRectangle.width - this.slider.width )
				{
					var line = Math.floor( this.yMouse / this.fontHeight );
					if ( line < this.lineCount && this.position + line < this.displayList.length )
					{
						if ( line != this.currentLine )
						{
							unlightAll();
							var info = this.displayList[ this.position + line ];
							if ( info && typeof info != 'string' )
							{
								info.hilighted = true;
								info.line = this.position + line;
								this.currentLine = this.position + line;
							}
						}
						done = true;
					}
				}
			}
			if ( !done )
			{
				unlightAll();
				this.currentLine = -1;
			}
			if ( eventName == 'click' )
			{
				if ( this.activated )
				{
					if ( this.currentLine >= 0 )
					{
						var info = this.displayList[ this.currentLine ];
						if ( info && typeof info != 'string' )
						{
							if ( info.type == 'string' )
							{
								this.debugger.prompt(
								{
									title: this.aoz.getMessage( 'db_entervalue' ) + info.name,
									value: info.value,
									inputType: 'text'
								},
								function( response, data, extra )
								{
									if ( response )
									{
										info.value = data;
										self.aoz.setVariable( { name: info.token }, data );
									}
								} );
							}
							else if ( info.type == 'number' )
							{
								this.debugger.prompt(
								{
									title: this.aoz.getMessage( 'db_entervalue' ) + info.name,
									value: info.value,
									inputType: 'number'
								},
								function( response, data, extra )
								{
									if ( response )
									{
										info.value = data;
										self.aoz.setVariable( { name: info.token }, data );
									}
								} );
							}
						}
					}
					return true;
				}
			}
			return this.mouseChildren( eventName, event, winAbove );
		};
		this.VariablesWindow.prototype.onMouseWheel = function( delta )
		{
			if ( this.displayList.length - this.numberOfLines > 0 )
			{
				this.position = Math.min( Math.max( this.position + delta, 0 ), this.displayList.length - this.numberOfLines );
				this.slider.slider.set_position( this.position, false );
				this.hilightAll( false );
				this.destroyChildren();
			}
		};
		this.VariablesWindow.prototype.hilightAll = function( onOff )
		{
			for ( var v = 0; v < this.displayList.length; v++ )
			{
				var info = this.displayList[ v ];
				if ( info && typeof info != 'string' )
					info.hilighted = onOff;
			}
		};
		this.VariablesWindow.prototype.onUpdate = function()
		{
			var self = this;
			var changed = false;
			function addVariable( name, value, section, variables )
			{
				var type;
				var token = name;
				if ( typeof value == 'number' || typeof value == 'string' || typeof value == 'boolean' )
					type = typeof value;
				if ( name.substring( name.length - 2 ) == '_f' )
				{
					name = name.substring( 0, name.length - 2 ) + '#';
					type = 'number';
				}
				else if ( name.substring( name.length - 6 ) == '_array' )
				{
					if ( !value.dimensions )
						return false;
					name = name.substring( 0, name.length - 6 );
					type = 'array';
				}
				else if ( name.substring( name.length - 7 ) == '_object' )
				{
					name = name.substring( 0, name.length - 7 ) + '@';
					type = 'object';
				}
				if ( !changed && variables[ name ] )
				{
					info = variables[ name ];
					if ( type == info.type && section == info.section )
					{
						if ( info.value != value )
						{
							info.value = value;
							info.modified = true;
						}
						return;
					}
					changed = true;
				}
				var info = {};
				variables[ name ] =
				{
					type: type,
					name: name,
					section: section,
					value: value,
					active: true,
					modified: true,
					token: token
				};
				return true;
			};
			for ( var s = 0; s < this.sections.length; s++ )
			{
				var sec = this.sections[ s ];
				for ( var v in sec.variables )
				{
					sec.variables[ v ].active = false;
					sec.variables[ v ].modified = false;
				}
			}
			var count = 0;
			for ( var s = 0; s <= this.aoz.sections.length; s++ )
			{
				var done = false;
				var section;
				if ( s < this.aoz.sections.length ) 
					section = this.aoz.sections[ s ];
				else 
					section = this.aoz.section;
				if ( section )
				{
					var sec = this.sections[ count ];
					if ( !sec || sec.section != section )
					{
						var info;
						if ( section.debuggerInfo )
						{
							info = section.debuggerInfo( 'info' );
							if ( info )
							{
								try
								{
									info = JSON.parse( info );
								}
								catch( e ) {};
							}
						}
						if ( !info )
							info = { type: 'Application', name: '', className: 'Application' };
						sec = 
						{
							section: section,
							type: info.type,
							name: info.nameReal,
							className: info.className,
							variables: {},
							variablesSorted: []
						};
						this.sections[ count ] = sec;
						changed = true;
					}
					for ( var v in section.vars )
					{
						if ( v.substring( 0, 2 ) != 'C_' )
						{
							addVariable( v, section.vars[ v ], section, sec.variables );
						}
					}
					count++;
				}
			}
			this.sections.length = count;
			if ( changed )
			{
				this.destroyChildren();
				for ( var s = 0; s < this.sections.length; s++ )
				{
					var sec = this.sections[ s ];
					sec.variablesSorted = [];
					for ( var v in sec.variables )
						sec.variablesSorted.push( sec.variables[ v ] );
					sec.variablesSorted.sort( function( a, b )
					{
						if ( a.name < b.name )
							return -1;
						if ( a.name > b.name )
							return 1;
						return 0;
					} );
				}
				this.displayList = [];
				for ( var s = this.sections.length - 1; s >= 0; s-- )
				{
					var sec = this.sections[ s ];
					var type;
					switch ( sec.type )
					{
						case 'procedure':
							type = 'Procedure: ';
							break;
						case 'function':
							type = 'Function: ';
							break;
						case 'instruction':
							type = 'Instruction: ';
							break;
						case 'method':
							type = 'Method: ';
							break;
						default:
							type = '';
							break;
					}
					this.displayList.push( '---> ' + type + sec.name );
					for ( var v in sec.variablesSorted )
					{
						this.displayList.push( sec.variablesSorted[ v ] );
					}
				}
			}
			for ( var v = 0; v < this.displayList.length; v++ )
			{
				var info = this.displayList[ v ];
				if ( info && typeof info != 'string' )
				{
					if ( info.scroll )
					{
						if ( info.hilighted )
						{
							info.scrollAngle += this.debugger.stringScrollSpeed;
							info.scrollPosition = Math.floor( ( 1 + Math.cos( info.scrollAngle ) ) / 2 * ( info.value.length - info.scrollWidth - 2 ) );
						}
						else
							info.scrollPosition = 0;
					}
					else
					{
						if ( info.hilighted && !(info.type == 'string' && info.value == '' ) )
						{
							var found = false;
							for ( var w = 0; w < this.windows.length; w++ )
							{
								if ( this.windows[ w ].infoPopup == info )
								{
									found = true;
									break;
								}
							}
							if ( !found )
							{
								this.popupCounter++;
								if ( this.popupCounter >= this.debugger.popupDelay )
								{
									this.popupCounter = 0;
									var width = 120;
									var height = this.fontHeight;
									if ( info.type == 'string' )
									{
										width = this.debugger.screenFontWidth * 40;
										height = this.fontHeight * 10;
									}
									if ( info.type == 'array' )
									{
										if ( info.value.dimensions )
										{
											width = this.debugger.screenFontWidth * 40;
											height = this.debugger.screenFontHeight * 10;
										}
										else
										{
											width = -1;
											height = -1;
										}
									}
									if ( width > 0 && height > 0 )
									{
										var win = this.addChild( new this.debugger.VariablePopupWindow( this.aoz,
										{
											id: 'win_variablespopup',
											type: 'popup',
											checkRectangle: { x: info.x, y: info.y, width: info.width, height: info.height },
											position: '#right #top',
											timeout: 25,
											width: width,
											height: height,
											width: width,
											height: height,
											borderH: 1,
											borderV: 1,
											borderIn: { left: 16, top: 16, right: 16, bottom: 16 },
											inkOut: 1,
											inkIn: 1,
											paperIn: 9,
											inkFont: 1,
											fontHeight: this.debugger.vars.fontHeightPopup,
											visible: true,
											screen: this.screen,
											info: info,
											parent: this
										} ), true );
										if ( win )
										{
											win.infoPopup = info;
											this.debugger.callAllWindows( function( w )
											{
												w.previousActivated = w.activated;
												w.activated = false;
											} );
											win.toFront();
											win.previousActivated = false;
											win.activated = true;
										}
									}
								}
							}
						}
					}
				}
			}
		};
		this.VariablesWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( this.minimized )
				return;
			this.numberOfLines = Math.floor( this.workRectangle.height / this.fontHeight );
			this.debugger.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
			var previousSection;
			if ( this.displayList.length )
			{
				this.screen.setInk( this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL ) );
				var x = this.workRectangle.x;
				var y = this.workRectangle.y;
				var n, l;
				for ( n = this.position, l = 0; n < this.displayList.length && l < this.numberOfLines; n++, l++ )
				{
					var info = this.displayList[ n ];
					if ( typeof info == 'string' )
					{
						this.screen.text( { x: x, y: y }, info, '#top #left' );
						y += this.fontHeight;
					}
					else if ( info )
						y = this.displayVariable( x, y, this.displayList[ n ], this.slider._active ? this.slider.width : 0 );
				}
				this.lineCount = l;
				if ( this.position > 0 || n < this.displayList.length )
				{
					if ( !this.slider._active )
					{
						this.slider.x = this.workRectangle.x + this.workRectangle.width - this.slider.width - 2;
						this.slider.y = this.workRectangle.y + 1;
						this.slider.height = this.workRectangle.height - 2;
						this.slider.maximum = this.displayList.length;
						this.slider.position = this.position;
						this.slider.size = this.numberOfLines;
						this.debugger.createUIElement( this.slider );
					}
				}
				else
				{
					if ( this.slider._active )
						this.debugger.deleteUIElement( this.slider );
				}
			}
			else
			{
				if ( this.slider._active )
					this.debugger.deleteUIElement( this.slider );
			}
			if ( this.slider._active && this.slider._visible )
			{
				this.slider.slider.set_rectangle( { x: this.workRectangle.x + this.workRectangle.width - this.slider.width - 2, y: this.workRectangle.y + 1, height: this.workRectangle.height - 2 } );
				this.slider.slider.draw();
			}
			this.drawChildren();
		};
		this.VariablesWindow.prototype.displayVariable = function( x, y, info, sliderWidth )
		{
			info.x = this.workRectangle.x;
			info.y = y;
			info.width = this.workRectangle.width - 16 - sliderWidth;
			info.height = this.fontHeight;
			var ink = this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
			if ( info.hilighted )
			{
				this.screen.setInk( this.debugger.getInk( 'textFont', this.debugger.INK_EXTRA ) );
				this.screen.bar( { x: info.x, y: info.y, width: info.width, height: this.fontHeight } );
				ink = this.debugger.getInk( 'textFont', this.debugger.INK_ACTIVATED );;
			}
			this.screen.setInk( ink );
			this.screen.text( { x: info.x, y: info.y }, info.name + ': ', '#top #left' );
			x = this.screen.grPosition.x;
			var widthVisible = info.width - ( this.screen.grPosition.x - info.x ) - 8;
			switch ( info.type )
			{
				case 'boolean':
					this.screen.text( { x: x, y: info.y }, '' + ( info.value ? 'True' : 'False' ), '#top #left' );
					break;
				case 'number':
					this.screen.text( { x: x, y: info.y }, '' + info.value, '#top #left' );
					break;
				case 'string':
					var t = '"' + info.value + '"';
					var widthText = this.screen.textLength( t );
					if ( widthText < widthVisible )
					{
						this.screen.text( { x: x, y: info.y }, t, '#top #left' );
						info.truncated = false;
					}
					else
					{
						for ( var p = Math.min( info.value.length - 1, 120 ); p > 0; p-- )
						{
							t = '"' + info.value.substring( 0, p ) + '..."';
							if ( this.screen.textLength( t ) < widthVisible )
								break;
						}
						this.screen.text( { x: x, y: info.y }, t, '#top #left' );
					}
					break;
				case 'array':
					info.height = this.fontHeight;
					var text = info.name + '(';
					for ( var d = 0; d < info.value.dimensions.length; d++ )
						text += ' ' + info.value.dimensions[ d ] + ',' ;
					text = text.substring( 0, text.length - 1 ) + ' )';
					this.screen.text( { x: x, y: info.y }, text, '#top #left' );
					break;
				case 'object':
					info.height = this.fontHeight;
					this.screen.text( { x: x, y: info.y }, info.name + ': Object', '#top #left' );
					break;
			}
			return y + info.height;
		};
		this.VariablePopupWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			if ( args.info.type == 'string' )
			{
				this.debugger.screen.setFont( [ this.debugger.fontName, this.fontHeightPopup ], {}, undefined, undefined, 'ext_debugging' );
				height = this.debugger.screen.formatText(
				[
					{
						text: args.info.value,
						x: this.workRectangle.x, 
						y: this.workRectangle.y,
						width: this.workRectangle.width, 
						tags: '#top #left'
					}
				] );
				if ( height < this.debugger.vars.fontHeightPopup * 2 )
				{
					this.windows = null;
					return false;
				}
				args.height = Math.min( height, this.debugger.screen.height ) + args.borderV * 2;
			}
			this.info = args.info;
			this.parent = args.parent;
			this.position = 0;
			this.slider = this.debugger.findUIElement( 'variablesview_slider' );
			this.dimensions = [];
			this.zoneValues = [];
			this.zoneHilighted = [];
			if ( this.info.type == 'array' && this.info.value.dimensions )
			{
				var arr = this.info.value;
				for ( var d = 0; d < arr.dimensions.length; d++ )
				{
					this.dimensions.push(
					{
						zone: { x: 0, y: 0, width: 0, height: 0 },
						zonePlus: { x: 0, y: 0, width: 0, height: 0 },
						zoneMinus: { x: 0, y: 0, width: 0, height: 0 },
						hilighted: 0,
						max: arr.dimensions[ d ],
						current: 0
					} );
				}
			}
		};
		this.VariablePopupWindow.prototype.draw = function()
		{
			this.drawWindow();
			this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
			this.screen.setInk( this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL ) );
			var height = 0;
			switch ( this.info.type )
			{
				case 'number':
					var hex = this.aoz.hex$( this.info.value, 8 );
					height = this.screen.formatText(
					[
						{
							text: '' + hex,
							x: this.workRectangle.x, y: this.workRectangle.y - this.position,
							width: this.workRectangle.width - this.slider.width, 
							height: this.workRectangle.height,
							clip: this.workRectangle,
							tags: '#center #middle'
						}
					] );
					break;
				case 'string':
					height = this.screen.formatText(
					[
						{
							text: this.info.value,
							x: this.workRectangle.x, y: this.workRectangle.y - this.position,
							width: this.workRectangle.width - this.slider.width, 
							height: this.workRectangle.height,
							clip: this.workRectangle,
							tags: '#top #left'
						}
					] );
					break;
				case 'object':
					break;
				case 'array':
					this.drawArray();
					break;
			}
			if ( ( this.position > 0 || height > this.workRectangle.height ) && !this.slider._active )
			{
				this.slider.x = this.workRectangle.x + this.workRectangle.width - this.slider.width - 2;
				this.slider.y = this.workRectangle.y + 1;
				this.slider.height = this.workRectangle.height - 2;
				this.slider.maximum = height;
				this.slider.position = this.position;
				this.slider.size = this.workRectangle.height;
				this.debugger.createUIElement( this.slider );
			}
			if ( this.slider._active && this.slider._visible )
			{
				this.slider.slider.set_rectangle( { x: this.workRectangle.x + this.workRectangle.width - this.slider.width - 2, y: this.workRectangle.y + 1, height: this.workRectangle.height - 2 } );
				this.slider.slider.draw();
			}
		};
		this.VariablePopupWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			var dimension;
			if ( eventName == 'mousemove' )
			{
				if ( this.mouseIn )
				{
					if ( this.info.type == 'array' )
					{
						for ( var z = 0; z < this.dimensions.length; z++ )
						{
							this.dimensions[ z ].hilighted = 0;
							this.zoneHilighted = -1;
							this.dimensionHilighted = null;
							if ( this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, this.dimensions[ z ].zone ) )
							{
								this.dimensionHilighted = this.dimensions[ z ];
								this.dimensions[ z ].hilighted = 1;
							}
							if ( this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, this.dimensions[ z ].zoneMinus ) )
							{
								this.dimensionHilighted = this.dimensions[ z ];
								this.dimensions[ z ].hilighted = 2;
							}
							if ( this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, this.dimensions[ z ].zonePlus ) )
							{
								this.dimensionHilighted = this.dimensions[ z ];
								this.dimensions[ z ].hilighted = 3;
							}
							for ( var zz = 0; zz < this.zoneValues.length; zz++ )
							{
								if ( this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, this.zoneValues[ zz ] ) )
								{
									this.zoneHilighted = zz;
								}
							}
						}
					}
				}
				return true;
			}
			if ( eventName == 'click' && this.mouseIn )
			{
				if ( this.dimensionHilighted )
				{
					switch ( this.dimensionHilighted.hilighted )
					{
						case 1:
							var text = this.aoz.getMessage( 'db_valuebetween', '' + this.dimensionHilighted.max );
							this.debugger.prompt( { title: text, value: this.dimensionHilighted.current, inputType: 'number' }, function( response, value, extra )
							{
								if ( response )
								{
									if ( value >= 0 && value < extra.max )
										extra.current = value;
								}
							}, this.dimensionHilighted );
							break;
						case 2:
							if ( this.dimensionHilighted.current > 0 )
								this.dimensionHilighted.current--;
							break;
						case 3:
							if ( this.dimensionHilighted.current < this.dimensionHilighted.max )
								this.dimensionHilighted.current++;
							break;
					}
				}
				else if ( this.zoneHilighted >= 0 && this.info.type == 'array' )
				{
					var dims = [];
					for ( var d = 0; d < this.dimensions.length; d++ )
						dims.push( this.dimensions[ d ].current );
					dims[ this.dimensions.length - 1 ] += this.zoneHilighted;
					var text = this.info.name + '(';
					for ( var d = 0; d < dims.length; d++ )
						text += ' ' + dims[ d ] + ',';
					text = this.aoz.getMessage( 'db_entervalue' ) + text.substring( 0, text.length - 1 ) + ' )';
					var value = this.info.value.getValue( dims );
					var self = this;
					if ( typeof value  == 'number' )
					{
						this.debugger.prompt(
						{
							title: text,
							value: value,
							inputType: 'number'
						},
						function( response, data, extra )
						{
							if ( response )
							{
								self.info.value.setValue( dims, data );
							}
						} );
					}
					else if ( typeof value == 'string' )
					{
						this.debugger.prompt(
						{
							title: text,
							value: value,
							inputType: 'text'
						},
						function( response, data, extra )
						{
							if ( response )
							{
								self.info.value.setValue( dims, data );
							}
						} );
					}
				}
				return true;
			}
			return this.mouseChildren( eventName, event, winAbove );
		};
		this.VariablePopupWindow.prototype.drawArray = function()
		{
			var x = this.workRectangle.x;
			var y = this.workRectangle.y;
			var text = '';
			for ( var z = 0; z < this.dimensions.length; z++ )
			{
				var dim = this.dimensions[ z ];
				text += dim.max;
				if ( z < this.dimensions.length - 1 )
					text += ', '
			}
			var text = this.info.name + '(';
			for ( var d = 0; d < this.info.value.dimensions.length; d++ )
				text += ' ' + this.info.value.dimensions[ d ] + ',' ;
			text = text.substring( 0, text.length - 1 ) + ' )';
			this.screen.text( { x: x + this.workRectangle.width / 2, y: y }, text, '#center #top' );
			text = 'Viewing: ';
			x = this.workRectangle.x;
			y += this.fontHeight;
			this.screen.setInk( this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL ) );
			this.screen.text( { x: x, y: y }, text, '#left #top' );
			x = this.screen.grPosition.x;
			for ( var z = 0; z < this.dimensions.length; z++ )
			{
				var dim = this.dimensions[ z ];
				dim.zone = this.debugger.textZone( this, { x: x, y: y }, ' ' + dim.current + ' ', '#left #top', dim.hilighted == 1 );
				dim.zoneMinus = this.debugger.textZone( this, { x: dim.zone.x + dim.zone.width, y: y }, ' - ', '#left #top', dim.hilighted == 2 );
				dim.zonePlus = this.debugger.textZone( this, { x: dim.zoneMinus.x + dim.zoneMinus.width, y: y }, ' + ', '#left #top', dim.hilighted == 3 );
				x = dim.zonePlus.x + dim.zonePlus.width + 8;
			}
			var lastDimension = this.dimensions[ this.dimensions.length - 1 ];
			var dims = [];
			for ( var d = 0; d < this.dimensions.length; d++ )
				dims.push( this.dimensions[ d ].current );
			var n = lastDimension.current;
			var count = 0;
			var type = typeof this.info.value.getValue( dims );
			y += this.fontHeight;
			this.zoneValues = [];
			while( n <= this.dimensions[ this.dimensions.length - 1 ].max && y + this.fontHeight < this.workRectangle.y + this.workRectangle.height )
			{
				var prefix = '';
				for ( var d = 0; d < this.dimensions.length; d++ )
				{
					var width = ( '' + this.dimensions[ d ].max ).length;
					var format = this.aoz.repeat$( '#', width );
					if ( d < this.dimensions.length - 1 )
						prefix += this.aoz.formatUsing( format, [ this.dimensions[ d ].current ] ) + '/' ;
					else
						prefix += this.aoz.formatUsing( format, [ n ] ) + ': ';
				}
				this.screen.setInk( this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL ) );
				var xLeft = this.workRectangle.x;
				this.screen.text( { x: xLeft, y: y }, prefix, '#top #left' );
				xStart = this.screen.grPosition.x;
				widthVisible = this.workRectangle.width - ( xStart - xLeft ) - 8;
				if ( type == 'string' )
				{
					dims[ this.dimensions.length - 1 ] = n;
					var text = '"' + this.info.value.getValue( dims ) + '"';
					if ( this.screen.textLength( text ) > widthVisible )
					{
						var t = this.info.value.getValue( dims );
						for ( var p = Math.min( t.length - 1, 120 ); p > 0; p-- )
						{
							text = '"' + t.substring( 0, p ) + '..."';
							if ( this.screen.textLength( text ) < widthVisible )
								break;
						}
					}
					this.zoneValues[ count ] = this.debugger.textZone( this, { x: xStart, y: y }, text, '#left #top', this.zoneHilighted == count );
					y += this.fontHeight;
					if ( this.zoneHilighted[ count ] )
					{
						this.addChild( new this.debugger.HintWindow( this.aoz,
						{
							id: 'win_hint',
							type: 'hint',
							checkRectangle: this.zoneValues[ count ],
							position: '#right #top',
							timeout: 25,
							width: 400,
							borderH: 0,
							borderV: 0,
							inkOut: 1,
							inkIn: 1,
							paperIn: 11,
							inkFont: 1,
							fontHeight: this.debugger.vars.fontHeight,
							visible: true,
							screen: this.screen,
							text: text,
							parent: this
						} ), true );
					}
					count++;
					n++;
				}
				else
				{
					x = xStart;
					while ( n <= this.dimensions[ this.dimensions.length - 1 ].max )
					{
						dims[ this.dimensions.length - 1 ] = n;
						var value = this.info.value.getValue( dims );
						if ( x + this.screen.textLength( ' ' + value + ' ' ) >= this.workRectangle.x + this.workRectangle.width )
						{
							y += this.fontHeight;
							break;
						}
						if ( typeof this.zoneValues[ count ] == 'undefined' )
							this.zoneValues[ count ] = false;
						this.zoneValues[ count ] = this.debugger.textZone( this, { x: x, y: y }, ' ' + value + ' ', '#left #top', this.zoneHilighted == count );
						x = this.screen.grPosition.x;
						count++;
						n++;
					}
				}
			}
		};
		this.HintWindow = function( aoz, args )
		{
			this.debugger = aoz.ext_debugging;
			var text = args.text;
			if ( args.screen.textLength( text ) > args.width )
			{
				var nChars = Math.floor( args.width / this.debugger.screenFontWidth );
				text = text.substring( 0, nChars - 3 ) + '...';
			}
			this.text = text;
			args.width = args.screen.textLength( this.text ) + args.borderH * 2 + 8;
			args.height = args.screen.formatText( [ { text: text, x: 10000, y: 10000, width: args.width, tags: '#top #left', codeFont: this.debugger.fontName, codeFontHeight: this.fontHeight } ] ) + args.borderV * 2;
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.parent = args.parent;
		};
		this.HintWindow.prototype.draw = function()
		{
			this.drawWindow();
			this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
			this.screen.setInk( this.debugger.getInk( 'hint', this.debugger.INK_DISACTIVATED ) );
			this.screen.formatText( [ { text: this.text, x: this.workRectangle.x, y: this.workRectangle.y, width: this.workRectangle.width, height: this.workRectangle.height, tags: '#top #left', clip: this.workRectangle, codeFont: this.debugger.fontName, codeFontHeight: this.fontHeight } ] );		
		};
		this.ApplicationWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.canvas = document.createElement( 'canvas' );
			this.context = this.canvas.getContext( '2d' );
			this.canvas.width = this.workRectangle.width;
			this.canvas.height = this.workRectangle.height;
			this.renderingContext = new RenderingContext2D( this.aoz, this.canvas, this.aoz.platform, this.debugger.renderingDisplay );
			this.renderingContext.filters = this.debugger.renderingFilters;
			this.renderingContext.resize( true, this.workRectangle.width, this.workRectangle.height );
			this.xMouseApplication = -10000;
			this.yMouseApplication = -10000;
			this.xZero = 0;
			this.yZero = 0;
		};
		this.ApplicationWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			while ( this.mouseIn )
			{
				if ( eventName == 'mousemove' )
				{
					this.xMouseApplication = ( this.xMouse + this.workRectangle.x - this.xZero ) / this.renderingContext.xRatioDisplay;
					this.yMouseApplication = ( this.yMouse + this.workRectangle.y - this.yZero ) / this.renderingContext.yRatioDisplay;
				}
				if ( !this.editedMask )
				{
					if ( this.debugger.vars.mode == 'stepwait' )
					{
						if ( eventName == 'dblclick' )
						{
							if ( this.objUnderMouse )
							{
								this.editCollisionMaskStart( this.objUnderMouse );
								break;
							}
							this.debugger.setMode( 'play' );					
							break;
						}
					}
				}
				else
					this.editCollisionMaskEventCallback( eventName, event );
				break;
			}
			return this.mouseChildren( eventName, event, winAbove );
		};
		this.ApplicationWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( !this.minimized )
			{
				this.renderingContext.resize( false, this.workRectangle.width, this.workRectangle.height );
				this.renderingContext.render( true, true );
				this.aoz.ui.resize();
				this.screen.pasteCanvas( this.canvas, this.workRectangle );
				this.scaleX = 1 / this.renderingContext.xRatioDisplay;
				this.scaleY = 1 / this.renderingContext.yRatioDisplay;
				this.xZero = ( this.renderingContext.xLeftDraw / this.renderingContext.xRatioDisplay - this.renderingContext.hardLeftX ) * this.renderingContext.xRatioDisplay + this.workRectangle.x;
				this.yZero = ( this.renderingContext.yTopDraw / this.renderingContext.yRatioDisplay - this.renderingContext.hardTopY ) * this.renderingContext.yRatioDisplay + this.workRectangle.y;
				if ( this.mouseIn )
				{
					var self = this;
					this.objUnderMouse = undefined;
					if ( !self.editedMask )
					{
						this.aoz.screensContext.parseSorted( undefined, function( screen1, screen2 )
						{
							if ( screen1.alwaysOnTop )
								return 1;
							if ( screen2.alwaysOnTop )
								return -1;
							if ( screen1.vars.z < screen2.vars.z )
								return -1;
							if ( screen1.vars.z > screen2.vars.z )
								return 1;
							if ( screen1.index < screen2.index )
								return -1;
							if ( screen1.index > screen2.index )
								return 1;
							return 0;
						},
						function( screen )
						{
							if ( screen == self.screen )
								return;
							screen.bobsContext.parseAll( undefined, function( bob )
							{
								if ( !bob.collisions.active )
								{
									bob.updateCollisionData( true );
									bob.collisions.active = true;
								}
								if ( bob.collisions.active )
								{
									var ink = self.debugger.getInk( 'bobMask', self.debugger.INK_NORMAL );
									if ( self.aoz.moduleCollisions.pointInObject( { x: self.xMouseApplication, y: self.yMouseApplication }, bob ) )
									{
										if ( !self.objUnderMouse )
										{
											self.objUnderMouse = bob;
											ink = self.debugger.getInk( 'bobMask', self.debugger.INK_ACTIVATED );
										}
									}
									if ( bob == self.objUnderMouse )
									{
										self.drawBobMask( bob, ink );
										self.drawBobLabel( bob, { x: self.debugger.xMouse, y: self.debugger.yMouse } );
									}
								}
							} );
						} );
						this.aoz.sprites.context.parseAll( undefined, function( sprite )
						{
							if ( !sprite.collisions.active )
							{
								sprite.updateCollisionData( true );
								sprite.collisions.active = true;
							}
							if ( !sprite.collisions.active )
							{
								var ink = self.debugger.getInk( 'bobMask', self.debugger.INK_NORMAL );
								if ( self.aoz.moduleCollisions.pointInObject( { x: self.xMouseApplication, y: self.yMouseApplication }, sprite ) )
								{
									if ( !self.objUnderMouse )
									{
										self.objUnderMouse = sprite;
										ink = self.debugger.getInk( 'bobMask', self.debugger.INK_ACTIVATED );
									}
								}
								if ( sprite == self.objUnderMouse )
								{
									self.drawBobMask( sprite, ink );
									self.drawBobLabel( sprite );
								}
							}
						} );
					}
					else
					{
						this.editCollisionMaskDraw();
					}
					if ( this.debugger.vars.rulers )
						this.drawRulers();
					if ( this.debugger.vars.crosshair )
						this.drawCrosshair();
					if ( this.debugger.vars.grid )
						this.drawGrid();
				}
			}
			return;
		};
		this.ApplicationWindow.prototype.drawBobMask = function( bob, ink, options )
		{
			ink = ( typeof ink == 'undefined' ? this.debugger.getInk( 'bobMask', this.debugger.INK_NORMAL ) : ink );
			if ( !bob.debugger )
				bob.debugger = {};
			if ( bob.imageObject )
			{
				bob.debugger.mask = bob.imageObject.getCollisionMask();
				bob.updateCollisionData();
				if ( bob.collisions )
				{
					this.screen.setLine( 0 );
					if ( !bob.vars.visible )
						this.screen.setLine( 0xAAAA );
					this.screen.setInk( ink );
					var scaleX = this.workRectangle.width / this.debugger.width * 1.33;
					var scaleY = this.workRectangle.height / this.debugger.height * 1.33;
					var coordinates = this.getBobCoordinates( bob ); 
					options = typeof options == 'undefined' ? { ink: ink, lineWidth: 1 } : options;
					var zoom = 
					{
						x: bob.screen ? bob.screen.vars.scaleX * bob.screen.renderScale.x * this.renderingContext.xRatioDisplay : this.renderingContext.xRatioDisplay,
						y: bob.screen ? bob.screen.vars.scaleY * bob.screen.renderScale.y * this.renderingContext.yRatioDisplay : this.renderingContext.yRatioDisplay 
					};
					this.aoz.moduleCollisions.drawMask( this.screen, bob, bob.debugger.mask, { x: coordinates.x, y: coordinates.y }, zoom, options );	
				}
			}
		};
		this.ApplicationWindow.prototype.getBobCoordinates = function( bob, bHotSpot )
		{
			bob.updateCollisionData();
			var scaleX = Math.abs( bob.vars.scaleX );
			var scaleY = Math.abs( bob.vars.scaleY );
			var hotSpotX = 0, hotSpotY = 0;
			if ( !bHotSpot )
			{
				if ( bob.vars.scaleX > 0 )
					hotSpotX = bob.imageObject.hotSpotX * scaleX;
				else 
					hotSpotX = ( bob.imageObject.width - bob.imageObject.hotSpotX ) * scaleX;
				if ( bob.vars.scaleY > 0 )
					hotSpotY = bob.imageObject.hotSpotY * scaleY;
				else 
					hotSpotY = ( bob.imageObject.height - bob.imageObject.hotSpotY ) * scaleY;
				if ( bob.vars.angle )
				{
					var rotation = this.aoz.utilities.rotate( hotSpotX, hotSpotY, 0, 0, bob.vars.angle );
					hotSpotX = rotation.x;
					hotSpotY = rotation.y;
				}
			}
			return this.getWindowCoordinates( bob.vars.x - hotSpotX, bob.vars.y - hotSpotY, bob.screen );
		}
		this.ApplicationWindow.prototype.getWindowCoordinates = function( x, y, screen )
		{
			var info = this.renderingContext.getDocumentCoordPercentages( x, y, screen );
			var result = 
			{
				x: info.x / 100 * this.workRectangle.width + this.workRectangle.x,
				y: info.y / 100 * this.workRectangle.height + this.workRectangle.y
			};
			return result;
		}
		this.ApplicationWindow.prototype.getWindowSize = function( width, height, screen )
		{
			var info = this.renderingContext.getDocumentSizePercentages( width, height, screen );
			var result = 
			{
				width: info.width / 100 * this.workRectangle.width,
				height: info.height / 100 * this.workRectangle.height
			};
			return result;
		}
		this.ApplicationWindow.prototype.drawBobLabel = function( bob, coordinates )
		{
			var scaleX = this.workRectangle.width / this.debugger.width;
			var scaleY = this.workRectangle.height / this.debugger.height;
			if ( !coordinates )
				coordinates = this.getBobCoordinates( bob, true );
			var text = '';
			if ( bob.className == 'bob' )
				text += 'Bob ';
			else
				text += 'Sprite ';
			if ( typeof bob.index == 'string' )
				text += bob.index + '\n\n';
			else
				text += bob.index + '\n\n';
			var fontHeight = this.debugger.vars.fontHeight * scaleX;
			this.screen.setFont( [ this.fontName, fontHeight ], {}, undefined, undefined, 'ext_debugging' );
			width = Math.min( this.screen.textLength( text ) + fontHeight, 200 );
			text += 'x: ' + Math.floor( bob.vars.x ) + '\n';		
			text += 'y: ' + Math.floor( bob.vars.y ) + '\n';
			text += 'i: ' + bob.vars.image;
			var xBorder = 8 * scaleX;
			var yBorder = 8 * scaleY;
			var height = this.screen.formatText( [ { text: text, x: coordinates.x, y: coordinates.y, width: width, tags: '#top #left', codeFont: this.fontName, codeFontHeight: fontHeight } ] );
			var rect = { x: coordinates.x - width - 2, y: coordinates.y - height - 2, width: width, height: height };
			var ink = this.debugger.getInk( 'label', this.debugger.INK_NORMAL );
			this.screen.setColorAlpha( [ ink ], [ 0.85 ] );
			this.screen.cls( ink, rect );
			this.screen.setColorAlpha( [ ink ], [ 1 ] );
			ink = this.debugger.getInk( 'label', this.debugger.INK_ACTIVATED );
			this.screen.setInk( ink );
			this.screen.setColorAlpha( [ ink ], [ 0.5 ] );
			this.screen.box( rect );
			this.screen.formatText( [ { text: text, x: rect.x + xBorder, y: rect.y + yBorder, width: rect.width, height: 100000, tags: '#top #left', codeFont: this.fontName, codeFontHeight: fontHeight } ] );
			this.screen.setColorAlpha( [ ink ], [ 1 ] );
		};
		this.ApplicationWindow.prototype.drawRulers = function()
		{
			var inkBack = this.debugger.getInk( 'rulerBack', this.debugger.INK_NORMAL );
			var inkFront = this.debugger.getInk( 'ruler', this.debugger.INK_NORMAL );
			this.screen.setColorAlpha( [ inkBack, inkFront ], [ 0.5, 0.5 ] );
			var scaleX = this.workRectangle.width / this.debugger.width * 1.33;
			var scaleY = this.workRectangle.height / this.debugger.height * 1.33;
			this.screen.cls( inkBack, { x: this.workRectangle.x, y: this.workRectangle.y, width: this.workRectangle.width, height: this.debugger.syRuler * scaleY } );
			this.screen.cls( inkBack, { x: this.workRectangle.x, y: this.workRectangle.y, width: this.debugger.sxRuler * scaleX, height: this.workRectangle.height } );
			this.screen.setInk( inkFront );
			var stepX, endX, stepY, endY;
			if ( this.renderingContext.platform == 'amiga' )
			{
				stepX = 50;
				stepY = 50;
				endX = this.renderingContext.hardWidth * 1.3;
				endY = this.renderingContext.hardHeight * 1.3;
			}
			else
			{
				stepX = 100;
				stepY = 100;
				endX = this.renderingContext.hardWidth * 1.3;
				endY = this.renderingContext.hardHeight * 1.3;
			}
			stepDisplay = stepX * this.renderingContext.xRatioDisplay / 2;
			this.screen.setFont( [ this.fontName, 18 * scaleY ], {}, undefined, undefined, 'ext_debugging' );
			for ( var x = 0; x <= endX; x += stepX )
			{
				var xx = this.xZero + ( x + this.renderingContext.hardLeftX ) * this.renderingContext.xRatioDisplay;
				if ( xx >= this.workRectangle.x && xx <= this.workRectangle.x + this.workRectangle.width )
				{
					this.screen.draw( { x1: xx, y1: this.workRectangle.y + this.debugger.syRuler * 0.66 * scaleY, x2: xx, y2: this.workRectangle.y + this.debugger.syRuler * scaleY } );
					this.screen.draw( { x1: xx + stepDisplay, y1: this.workRectangle.y + this.debugger.syRuler * scaleY * 0.77, x2: xx + stepDisplay, y2: this.workRectangle.y + this.debugger.syRuler * scaleY } );
					this.screen.text( { x: xx, y: this.workRectangle.y }, '' + ( x + this.renderingContext.hardLeftX ), '#center #top' );
				}
			}
			stepDisplay = stepY * this.renderingContext.yRatioDisplay / 2;
			this.screen.setFont( [ this.fontName, 18 * scaleX ], {}, undefined, undefined, 'ext_debugging' );
			for ( var y = 0; y < endY; y += stepY )
			{
				var yy = this.yZero + ( y + this.renderingContext.hardTopY ) * this.renderingContext.yRatioDisplay;
				if ( yy >= this.workRectangle.y && yy <= this.workRectangle.y + this.workRectangle.height )
				{
					this.screen.draw( { x1: this.workRectangle.x + this.debugger.sxRuler * 0.66 * scaleX, y1: yy, x2: this.workRectangle.x + this.debugger.sxRuler * scaleX, y2: yy } );
					this.screen.draw( { x1: this.workRectangle.x + this.debugger.sxRuler * 0.77 * scaleX, y1: yy + stepDisplay, x2: this.workRectangle.x + this.debugger.sxRuler * scaleX, y2: yy + stepDisplay } );
					this.screen.text( { x: this.workRectangle.x, y: yy }, '' + ( y + this.renderingContext.hardTopY ), '#left #middle' );
				}
			}
			this.screen.setColorAlpha( [ inkBack, inkFront ], [ 1, 1 ] );
		};
		this.ApplicationWindow.prototype.drawCrosshair = function()
		{
			if ( this.mouseIn )
			{
				var x = this.xMouse + this.workRectangle.x;
				var y = this.yMouse + this.workRectangle.y;
				var xCoord = ( x - this.xZero ) / this.renderingContext.xRatioDisplay;
				var yCoord = ( y - this.yZero ) / this.renderingContext.yRatioDisplay;
				var scaleX = this.workRectangle.width / this.debugger.width * 1.33;
				var scaleY = this.workRectangle.height / this.debugger.height * 1.33;
				this.screen.setInk( this.debugger.getInk( 'rulerPointer', this.debugger.INK_NORMAL ) );
				this.screen.draw( { x1: x, y1: this.workRectangle.y, x2: x, y2: this.workRectangle.y + this.workRectangle.height } );
				this.screen.draw( { x1: this.workRectangle.x, y1: y, x2: this.workRectangle.x + this.workRectangle.width, y2: y } );
				this.screen.text( { x: x + 3 * scaleX, y: y - 22 * scaleY }, 'x: ' + Math.floor( xCoord ) );
				this.screen.text( { x: x + 3 * scaleX, y: y - 4 * scaleY }, 'y: ' + Math.floor( yCoord ) );
			}
		}
		this.ApplicationWindow.prototype.drawGrid = function()
		{
			this.screen.setInk( this.debugger.getInk( 'grid', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL ) );
			for ( var x = 0; x < this.renderingContext.hardWidth * 1.3; x += this.debugger.vars.gridWidth )
			{
				var xx = this.xZero + x * this.renderingContext.xRatioDisplay;
				if ( xx > this.workRectangle.x && xx < this.workRectangle.x + this.workRectangle.width )
				{
					for ( var y = 0; y < this.renderingContext.hardHeight * 1.3; y += this.debugger.vars.gridHeight )
					{
						var yy = this.yZero + y * this.renderingContext.yRatioDisplay;
						if ( yy > this.workRectangle.y && yy < this.workRectangle.y + this.workRectangle.height )
						{
							this.screen.plot( { x: xx, y: yy } );
						}
					}
				}
			}
		};
		this.ApplicationWindow.prototype.editCollisionMaskStart = function( bob, ink )
		{
			this.editedMask = bob;
			this.objUnderMouse = undefined;
			this.maskModified = false;
			this.elements = [];
			var x = this.workRectangle.x + this.workRectangle.width - 312;
			var y = this.workRectangle.y + this.workRectangle.height - 64;
			this.elements.push( { type: 'button', id: "UIMask_resetMask", x: this.workRectangle.x + 32, y: y, width: 150, height: 64, renderingContext: 'debugger', fontSize: 18, content: this.aoz.getMessage( 'db_resetMask' ), onClick: "ext_debugging:uiClickMask" } );
			this.elements.push( { type: 'button', id: "UIMask_cancel", x: x, y: y, width: 150, height: 64, renderingContext: 'debugger', fontSize: 18, content: this.aoz.getMessage( 'db_cancel' ), onClick: "ext_debugging:uiClickMask" } );
			this.elements.push( { type: 'button', id: "UIMask_ok", x: x + 150, y: y, width: 150, height: 64, renderingContext: 'debugger', fontSize: 18, content: this.aoz.getMessage( 'db_close' ), onClick: "ext_debugging:uiClickMask" } );		
			for ( var e = 0; e < this.elements.length; e++ )
				this.aoz.ui.addElement( this.elements[ e ] );
			this.debugger.debugUI.setDebuggerTitle( self.aoz.getMessage( 'db_titleeditingmask' ) );			
		};
		this.ApplicationWindow.prototype.uiClickMask = function( args )
		{
			switch ( args.ID$ )
			{
				case 'UIMask_resetMask':
					this.editedMask.imageObject.collisionMask = null;
					var collisionMask = ImageBank.prototype.getCollisionMask.call( this.editedMask.imageObject );
					break;
				case 'UIMask_cancel':
					this.editCollisionMaskEnd( false );
					break;
				case 'UIMask_ok':
					this.editCollisionMaskEnd( true );
					break;
			}
		};
		this.ApplicationWindow.prototype.editCollisionMaskDraw = function()
		{
			if ( !this.maskDragOn )
			{
				this.currentHandle = -1;
				this.currentPolygon = undefined;
			}
			var ink1 = this.debugger.getInk( 'bobMask', this.debugger.INK_ACTIVATED );
			var ink2 = this.debugger.getInk( 'bobMask', this.debugger.INK_EXTRA );
			var options = { lineWidth: 2, ink: ink1 };
			var self = this;
			options.getHandleInk = function( polygon, number, rectangle )
			{
				if ( !self.maskDragOn )
				{
					if ( self.aoz.utilities.pointInRect( self.debugger.xMouse, self.debugger.yMouse, rectangle ) )
					{
						self.currentHandle = number;
						self.currentPolygon = polygon;
						return ink2;
					}
				}
				else if ( self.currentHandle == number && polygon == this.currentPolygon )
					return ink2;
				return ink1;
			};
			this.drawBobMask( this.editedMask, ink1, options )
		};
		this.ApplicationWindow.prototype.editCollisionMaskEventCallback = function( eventName, event )
		{
			if ( eventName == 'mousedown' )
			{
				if ( !this.maskDragOn && this.currentHandle >= 0 )
				{
					this.maskDragHandle = this.currentHandle;
					this.maskDragPolygon = this.currentPolygon;
					this.maskDragX = this.xMouseApplication;
					this.maskDragY = this.yMouseApplication;
					this.maskDragOn = true;
				}
			}
			else if ( eventName == 'mouseup' )
			{
				this.aoz.moduleCollisions.setHullFromPolygon( this.editedMask.debugger.mask, this.currentPolygon, this.currentHandle, this.editedMask.collisions.scaleX, this.editedMask.collisions.scaleY );
				this.maskDragOn = false;
			}
			else if ( eventName == 'mousemove' )
			{
				if ( this.maskDragOn )
				{
					if ( this.xMouseApplication != this.maskDragX || this.yMouseApplication != this.maskDragY )
					{
						this.maskDragPolygon.points[ this.maskDragHandle ].x += ( this.xMouseApplication - this.maskDragX );
						this.maskDragPolygon.points[ this.maskDragHandle ].y += ( this.yMouseApplication - this.maskDragY );
						this.maskDragX = this.xMouseApplication;
						this.maskDragY = this.yMouseApplication;
					}
				}
			}
		}
		this.ApplicationWindow.prototype.editCollisionMaskEnd = function( keep )
		{
			if ( this.editedMask )
			{
				if ( !keep )
				{
					this.editedMask.imageObject.collisionMask = null;
					ImageBank.prototype.getCollisionMask.call( this.editedMask.imageObject );
				}
				else
				{
					var message = 
					{
						module: 'debugger',
						method: 'saveCollisionMask',
						options: 
						{
							path: this.editedMask.imageObject.path,
							mask: JSON.stringify( this.editedMask.imageObject.collisionMask.hulls )
						}
					};
					self.debugEvents.sendMessage( message, function( response, extra )
					{
					} );
				}
				this.editedMask = undefined;
				for ( var e = 0; e < this.elements.length; e++ )
					this.aoz.ui.delete( { id: this.elements[ e ].id } );
				this.elements = [];
				this.debugger.debugUI.setDebuggerTitle( self.aoz.getMessage( 'db_titlepause' ) );			
			}
		};
		this.WatchWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.position = 0;
			this.lines = [];
			this.currentLine = -1;
			this.popupCounter = 0;
			this.alertSpeed = 50;
			this.vSlider = this.debugger.findUIElement( 'watch_slider' );
			this.vSlider.x = this.workRectangle.x + this.workRectangle.width - this.vSlider.width - 2;
			this.vSlider.y = this.workRectangle.y + 1;
			this.vSlider.height = this.workRectangle.height - 2;
			this.vSlider.maximum = 100;
			this.vSlider.position = 0;
			this.vSlider.size = 100;
			this.debugger.createUIElement( this.vSlider );
			this.vSlider.slider.set_enabled( false );
		};
		this.WatchWindow.prototype.onMouseWheel = function( delta )
		{
			if ( this.lines.length > this.numberOfLines )
			{
				this.position = Math.min( Math.max( this.position + delta, 0 ), this.lines.length - this.numberOfLines );
				this.vSlider.slider.set_position( this.position, false );
				this.destroyChildren();
			}
		};
		this.WatchWindow.prototype.deleteBreak = function( number )
		{
			this.currentLine = -1;
			this.lines.splice( number );
			this.position = Math.max( --this.position, 0 );
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.deleteWatch = function( number )
		{
			this.currentLine = -1;
			this.lines.splice( number );
			this.position = Math.max( --this.position, 0 );
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.deleteParameters = function()
		{
			var newLines = [];
			for ( var l = 0; l < this.lines.length; l++ )
			{
				if ( this.lines[ l ].type != 'parameter' )
					newLines.push( this.lines[ l ] );
				this.position = Math.max( --this.position, 0 );
			}
			this.currentLine = -1;
			this.lines = newLines;
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.addWatch = function( args )
		{
			var found = false;
			source = atob( args.source );
			for ( var l = 0; l < this.lines.length; l++ )
			{
				if ( this.lines[ l ].section == args.section && this.lines[ l ].source == source && this.lines[ l ].expression == args.expression && this.lines[ l ].type == 'watch' )
				{
					found = true;
					break;
				}
			}
			if ( !found )
				this.lines.push( { section: args.section, source: source, expression: args.expression, type: 'watch', alert: false, hilighted: false, alertCount: 0 } );
			this.currentLine = -1;
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.addParameter = function( args )
		{
			var found = false;
			for ( var l = 0; l < this.lines.length; l++ )
			{
				if ( this.lines[ l ].section == args.section && this.lines[ l ].source == args.source && this.lines[ l ].expression == args.expression && this.lines[ l ].type == 'parameter' )
				{
					found = true;
					break;
				}
			}
			if ( !found )
				this.lines.push( { section: args.section, source: args.source, expression: args.expression, type: 'parameter', alert: false, hilighted: false, alertCount: 0 } );
			this.currentLine = -1;
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.addBreak = function( args )
		{
			var found = false;
			source = atob( args.source );
			for ( var l = 0; l < this.lines.length; l++ )
			{
				if ( this.lines[ l ].section == args.section && this.lines[ l ].source == source && this.lines[ l ].expression == args.expression && this.lines[ l ].type == 'break' )
				{
					found = true;
					break;
				}
			}
			if ( !found )
				this.lines.push( { section: args.section, source: source, expression: args.expression, type: 'break', alert: false, hilighted: false, alertCount: 0 } );
			this.currentLine = -1;
			this.aoz.watchCode = this.lines.length > 0;
		};
		this.WatchWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			var self = this;
			function unlightAll()
			{
				for ( var v = 0; v < self.lines.length; v++ )
					self.lines[ v ].hilighted = false;
			};
			if ( this.debugger.mouseCaptured )
				return this.mouseChildren( eventName, event, winAbove );;
			if ( this.mouseIn )
			{
				if ( this.xMouse < this.workRectangle.width - this.vSlider.width )
				{
					var done = false;
					var line = Math.floor( this.yMouse / this.fontHeight );
					if ( line != this.currentLine )
					{
						unlightAll();
						if ( line >= 0 && this.position + line < this.lines.length )
						{
							var info = this.lines[ this.position + line ];
							info.hilighted = true;
							info.line = line;
							this.currentLine = line;
						}
						else
						{
							this.currentLine = -1;
						}
					}
				}
				if ( eventName == 'mousedown' )
				{
					if ( this.currentLine >= 0 )
					{
						this.deleteWatch( this.currentLine );					
					}
				}
			}
			return this.mouseChildren( eventName, event );
		};
		this.WatchWindow.prototype.doWatch = function()
		{
			for ( var v = 0; v < this.lines.length; v++ )
			{
				var line = this.lines[ v ];
				if ( line.section && line.expression )
					line.value = line.expression.call( line.section, this.aoz, line.section.vars );
				else
					line.value = '';
				if ( line.type == 'break' )
				{
					if ( line.value )
					{
						this.aoz.onMessage(	{ command: 'stepInCodeOn' } );
						line.alert = true;
					}
					else
					{
						line.alert = false;
					}
				}
			}
		};
		this.WatchWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( this.minimized )
				return;
			this.numberOfLines = Math.floor( this.workRectangle.height / this.fontHeight );
			if ( this.numberOfLines && this.lines.length > 0 )
			{
				var sliderWidth = ( this.vSlider.slider.is_visible() ? this.vSlider.width : 0 );
				this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
				this.screen.setPaint( false );
				var position = this.position;
				var y = this.workRectangle.y;
				for ( var l = 0; l < this.numberOfLines; l++ )
				{
					var line = this.lines[ position ];
					var paper = this.debugger.getInk( 'inRectangle', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
					var pen = this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
					if ( line.alert )
					{
						line.alertCount--;
						if ( line.alertCount < 0 )
						{
							paper = this.debugger.getInk( 'textFont', this.debugger.INK_EXTRA );;
						}
						if ( line.alertCount < -this.alertSpeed * 2 )
							line.alertCount = this.alertSpeed;
					}
					if ( line.hilighted )
					{
						var temp = paper;
						paper = pen;
						pen = temp;
					}
					this.screen.setInk( paper );
					this.screen.bar( { x: this.workRectangle.x, y: y, width: this.workRectangle.width, height: this.fontHeight } );
					this.screen.setInk( pen );
					var x = this.workRectangle.x;
					if ( line.type == 'break' )
					{
						this.screen.text( { x: this.workRectangle.x, y: y }, ' Break If', '#top #left' );
						x = this.screen.grPosition.x;
					}
					this.screen.text( { x: x, y: y }, line.source + ( line.expression ? ': ' : '' ), '#top #left' );
					this.screen.text( { x: this.screen.grPosition.x, y: y }, line.value, '#top #left' );
					y += this.fontHeight;
					position++;
					if ( position >= this.lines.length )
						break;
				}
			}
			if ( this.numberOfLines && this.lines.length > this.numberOfLines )
			{
				this.vSlider.slider.set_rectangle( { x: this.workRectangle.x + this.workRectangle.width - this.vSlider.width - 2, y: this.workRectangle.y + 1, width: this.vSlider.width, height: this.workRectangle.height - 2 } );
				this.vSlider.slider.set_parameters( this.lines.length, this.numberOfLines );
				this.vSlider.slider.set_visible( true );
				this.vSlider.slider.set_enabled( true );
			}
			else
			{
				this.vSlider.slider.set_visible( false );
				this.vSlider.slider.set_enabled( false );
			}
			this.vSlider.slider.draw();
			this.drawChildren();
		};
		this.StackWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.position = 0;
			this.lines = [];
			this.currentLine = -1;
			this.vSlider = this.debugger.findUIElement( 'pile_slider' );
			this.vSlider.x = this.workRectangle.x + this.workRectangle.width - this.vSlider.width - 2;
			this.vSlider.y = this.workRectangle.y + 1;
			this.vSlider.height = this.workRectangle.height - 2;
			this.vSlider.maximum = 100;
			this.vSlider.position = 0;
			this.vSlider.size = 100;
			this.debugger.createUIElement( this.vSlider );
			this.vSlider.slider.set_enabled( false );
		};
		this.StackWindow.prototype.onMouseWheel = function( delta )
		{
			if ( this.lines.length > this.numberOfLines )
			{
				this.position = Math.min( Math.max( this.position + delta, 0 ), this.lines.length - this.numberOfLines );
				this.vSlider.slider.set_position( this.position, false );
				this.destroyChildren();
			}
		};
		this.StackWindow.prototype.refresh = function( section )
		{
			var self = this;
			var count = 0;
			var newLines = [];
			function addSection( section )
			{
				for ( var r = section.returns.length - 1; r >= 0; r-- )
				{
					var text = 'Sub-routine...';
					try
					{
						var loopBlock = section.debuggerBlocks[ section.returns[ r ] - 1 ].call( section, self.aoz, section.vars, 'loop' );
						var info = section.debuggerBlocks[ loopBlock - 1 ].call( section, self.aoz, section.vars, 'info' );
						text = 'Sub-routine: ' + info.name;
					}
					catch( e )
					{
					}
					newLines.push( { text: text, hilighted: false } );
				}
				var info = section.debuggerInfo.call( section, 'info' );
				info = JSON.parse( info );
				var text = '';
				if ( info.type == 'main' )
					text += 'Application';
				else if ( info.type == 'procedure' )
					text += self.aoz.getMessage( 'db_procedure' ) + info.nameReal;
				else if ( info.type == 'instruction' )
					text += self.aoz.getMessage( 'db_instruction' ) + info.nameReal;
				else if ( info.type == 'function' )
					text += self.aoz.getMessage( 'db_function' ) + info.nameReal;
				else if ( info.type == 'method' )
					text += self.aoz.getMessage( 'db_method' ) + info.nameReal;
				else if ( info.type == 'object' )
					text += self.aoz.getMessage( 'db_object' ) + info.nameReal;
				else
					text += self.aoz.getMessage( 'db_unknown' ) + info.nameReal;
				newLines.push( { text: text, hilighted: false } );
			}
			addSection( section );
			for ( var s = this.aoz.sections.length - 1; s > 0; s-- )
			{
				if ( this.aoz.sections[ s ] )
				addSection( this.aoz.sections[ s ] );
			}
			if ( newLines.length == this.lines.length )
			{
				for ( var l = 0; l < newLines.length; l++ )
				{
					if ( newLines[ l ].text != this.lines[ l ].text )
					{
						this.lines = newLines;
						break;
					}
				}
			}
			else
			{
				this.lines = newLines;
			}
		};
		this.StackWindow.prototype.onMouse = function( eventName, event, winAbove )
		{
			var self = this;
			function unlightAll()
			{
				for ( var v = 0; v < self.lines.length; v++ )
					self.lines[ v ].hilighted = false;
			};
			if ( this.debugger.mouseCaptured )
				return this.mouseChildren( eventName, event, winAbove );;
			if ( this.mouseIn )
			{
				if ( this.xMouse < this.workRectangle.width - this.vSlider.width )
				{
					var done = false;
					var line = Math.floor( this.yMouse / this.fontHeight );
					if ( line != this.currentLine )
					{
						unlightAll();
						if ( line >= 0 && this.position + line < this.lines.length )
						{
							var info = this.lines[ this.position + line ];
							info.hilighted = true;
							info.line = line;
							this.currentLine = line;
						}
						else
						{
							this.currentLine = -1;
						}
					}
				}
			}
			return this.mouseChildren( eventName, event );
		};
		this.StackWindow.prototype.draw = function()
		{
			this.drawWindow();
			if ( this.minimized )
				return;
			this.numberOfLines = Math.floor( this.workRectangle.height / this.fontHeight );
			if ( this.numberOfLines && this.lines.length > 0 )
			{
				var sliderWidth = ( this.vSlider.slider.is_visible() ? this.vSlider.width : 0 );
				this.screen.setFont( [ this.debugger.fontName, this.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
				this.screen.setPaint( false );
				var position = this.position;
				var y = this.workRectangle.y;
				var count = this.lines.length - 1;
				for ( var l = 0; l < this.numberOfLines; l++ )
				{
					var line = this.lines[ position ];
					var paper = this.debugger.getInk( 'inRectangle', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
					var pen = this.debugger.getInk( 'textFont', this.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
					if ( line.hilighted )
					{
						paper = this.debugger.getInk( 'textFont', this.debugger.INK_EXTRA );
					}
					this.screen.setInk( paper );
					this.screen.bar( { x: this.workRectangle.x + 1, y: y, width: this.workRectangle.width - 2, height: this.fontHeight } );
					this.screen.setInk( pen );
					this.screen.text( { x: this.workRectangle.x + 1, y: y }, ' ' + count + ' - ' + line.text, '#top #left' );
					y += this.fontHeight;
					position++;
					count--;
					if ( position >= this.lines.length )
						break;
				}
			}
			if ( this.numberOfLines && this.lines.length > this.numberOfLines )
			{
				this.vSlider.slider.set_rectangle( { x: this.workRectangle.x + this.workRectangle.width - this.vSlider.width - 2, y: this.workRectangle.y + 1, width: this.vSlider.width, height: this.workRectangle.height - 2 } );
				this.vSlider.slider.set_parameters( this.lines.length, this.numberOfLines );
				this.vSlider.slider.set_visible( true );
				this.vSlider.slider.set_enabled( true );
			}
			else
			{
				this.vSlider.slider.set_visible( false );
				this.vSlider.slider.set_enabled( false );
			}
			this.vSlider.slider.draw();
			this.drawChildren();
		};
		this.SettingsWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.elements = [];
			this.debugger.saveConfig();
			var y = 10, deltaCheck = 12;
			this.elements.push( { type: 'textBlock', id: "UITextBlock0", x: 40, y: y, content: this.aoz.getMessage( 'db_preferences' ), class: "text-light" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock16", x: 40, y: y, content: this.aoz.getMessage( 'db_displayMasks' ), class: "text-light" } );
			this.elements.push( { type: 'checkBox', id: "UICheck_masks", x: 500, y: y + deltaCheck, width: 32, height: 32, value: this.debugger.vars.masks ? "true" : "false", class: "text-light", onChange: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock17", x: 40, y: y, content: this.aoz.getMessage( 'db_displayCrosshair' ), class: "text-light" } );
			this.elements.push( { type: 'checkBox', id: "UICheck_crosshair", x: 500, y: y + deltaCheck, width: 32, height: 32, value: this.debugger.vars.crosshair ? "true" : "false", class: "text-light", onChange: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock18", x: 40, y: y, content: this.aoz.getMessage( 'db_displayRuler' ), class: "text-light" } );
			this.elements.push( { type: 'checkBox', id: "UICheck_rulers", x: 500, y: y + deltaCheck, width: 32, height: 32, value: this.debugger.vars.rulers ? "true" : "false", class: "text-light", onChange: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock19", x: 40, y: y, content: this.aoz.getMessage( 'db_displayGrid' ), class: "text-light" } );
			this.elements.push( { type: 'checkBox', id: "UICheck_grid", x: 500, y: y + deltaCheck, width: 32, height: 32, value: this.debugger.vars.grid ? "true" : "false", class: "text-light", onChange: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock23", x: 40, y: y, content: this.aoz.getMessage( 'db_fontWidth' ), class: "text-light" } );
			this.elements.push( { type: 'textBox', id: "UIBox_fontHeight", x: 500, y: y, width: 64, height: 44, value: this.debugger.vars.fontHeight + "", onChange: "ext_debugging:uiClickSettings" } );
			this.elements.push( { type: 'button', id: "UIButton_minus", x: 640, y: y, width: 64, height: 44, content: '-', onClick: "ext_debugging:uiClickSettings" } );
			this.elements.push( { type: 'button', id: "UIButton_plus", x: 690, y: y, width: 64, height: 44, content: '+', onClick: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock21", x: 40, y: y, content: this.aoz.getMessage( 'db_gridWidth' ), class: "text-light" } );
			this.elements.push( { type: 'textBox', id: "UIText_gridWidth", x: 250, y: y, width: 64, height: 44, value: this.debugger.vars.gridWidth + "", onChange: "ext_debugging:uiClickSettings" } );
			this.elements.push( { type: 'textBlock', id: "UITextBlock22", x: 500, y: y, content: this.aoz.getMessage( 'db_gridHeight' ), class: "text-light" } );
			this.elements.push( { type: 'textBox', id: "UIText_gridHeight", x: 750, y: y, width: 64, height: 44, value: this.debugger.vars.gridHeight + "", onChange: "ext_debugging:uiClickSettings" } );
			y += 60;
			this.elements.push( { type: 'textBlock', id: "UITextBlock12", x: 40, y: y, content: this.aoz.getMessage( 'db_interfacetype' ), class: "text-light" } );
			this.elements.push( { type: 'radio', id: "UIRadio_interface", x: 500, y: y, value: this.debugger.displayMode == 'aoz' ? "1" : "2", class: "text-light", items: this.aoz.getMessage( 'db_applicationsmallbig' ), onChange: "ext_debugging:uiClickSettings" } );
			y += 96;
			this.elements.push( { type: 'textBlock', id: "UITextBlock15", x: 40, y: y, content: this.aoz.getMessage( 'db_wdefpos' ), class: "text-light" } );
			this.elements.push( { type: 'radio', id: "UIRadio_position", x: 500, y: y, value: this.debugger.vars.winRight ? "2" : "1", class: "text-light", items: this.aoz.getMessage( 'db_settingsleftright' ), onChange: "ext_debugging:uiClickSettings" } );
			y += 100;
			this.elements.push( { type: 'button', id: "UIButton_resetWindows", x: 300, y: y, width: 300, height: 64, content: this.aoz.getMessage( 'db_resetWindows' ), onClick: "ext_debugging:uiClickSettings" } );
			this.elements.push( { type: 'button', id: "UIButton_cancel", x: 40, y: y, width: 150, height: 64, content: this.aoz.getMessage( 'db_cancel' ), onClick: "ext_debugging:uiClickSettings" } );
			this.elements.push( { type: 'button', id: "UIButton_ok", x: 740, y: y, width: 150, height: 64, content: this.aoz.getMessage( 'db_close' ), onClick: "ext_debugging:uiClickSettings" } );
			for ( var e = 0; e < this.elements.length; e++ )
			{
				var element = this.aoz.utilities.copyObject( this.elements[ e ] );
				element.renderingContext = 'debugger';
				element.x = this.workRectangle.x + element.x;
				element.y = this.workRectangle.y + element.y;
				element.fontSize = 18; 
				this.aoz.ui.addElement( element );
			}
		};
		this.SettingsWindow.prototype.setRectangle = function( outRectangle, inRectangle )
		{
			this.debugger.setRectangle.call( this, outRectangle, inRectangle );
			for ( var e = 0; e < this.elements.length; e++ )
			{
				var element = this.aoz.utilities.copyObject( this.elements[ e ] );
				element.x += this.workRectangle.x;
				element.y += this.workRectangle.y;
				this.aoz.ui.setPosition( element );
			}
		};
		this.SettingsWindow.prototype.destroy = function( args )
		{
			for ( var e = 0; e < this.elements.length; e++ )
				this.aoz.ui.delete( { id: this.elements[ e ].id } );
			this.elements = [];
			this.debugger.destroyWindow.call( this );
		};
		this.SettingsWindow.prototype.uiClick = function( args )
		{
			switch ( args.ID$ )
			{
				case 'UIRadio_interface_option_1':
				case 'UIRadio_interface_option_2':
				case 'UIRadio_interface':
					this.debugger.displayMode = ( args.VALUE$ == "1" ? 'aoz' : 'chrome' );
					this.debugger.createAllWindows();
					this.debugger.resetWindowsPositions();
					break;
				case 'UIRadio_position_option_1':
				case 'UIRadio_position_option_2':
				case 'UIRadio_position':
					this.debugger.vars.winRight = ( args.VALUE$ == "1" ? false : true );
					this.debugger.createAllWindows();
					this.debugger.resetWindowsPositions();
					break;
				case 'UIButton_plus':
					if ( this.debugger.vars.fontHeight < 100 )
					{
						this.debugger.displaySettings( false );
						this.debugger.setFontHeight( this.debugger.vars.fontHeight + 1, true );
						this.debugger.displaySettings( true );
					}
					break;
				case 'UIButton_minus':
					if ( this.debugger.vars.fontHeight > 8 )
					{
						this.debugger.displaySettings( false );
						this.debugger.setFontHeight( this.debugger.vars.fontHeight - 1, true );
						this.debugger.displaySettings( true );
					}
					break;
				case 'UIBox_fontHeight':
					var value = parseInt( args.VALUE$ );
					if ( !isNaN( value ) && value > 8 && value < 100 )
					{
						this.debugger.displaySettings( false );
						this.debugger.setFontHeight( value, true );
						this.debugger.displaySettings( true );
					}
					break;
				case 'UICheck_masks':
					this.debugger.vars.masks = !this.debugger.vars.masks;
					break;
				case 'UICheck_crosshair':
					this.debugger.vars.crosshair = !this.debugger.vars.crosshair;
					break;
				case 'UICheck_rulers':
					this.debugger.vars.rulers = !this.debugger.vars.rulers;
					break;
				case 'UICheck_grid':
					this.debugger.vars.grid = !this.debugger.vars.grid;
					break;
				case 'UIText_gridWidth':
					var value = parseInt( args.VALUE$ );
					if ( !isNaN( value ) && value > 1 )
						this.debugger.vars.gridWidth = value;
					break;
				case 'UIText_gridHeight':
					var value = parseInt( args.VALUE$ );
					if ( !isNaN( value ) && value > 1 )
						this.debugger.vars.gridHeight = value;
					break;
				case 'UIButton_resetWindows':
					this.debugger.resetWindowsPositions();
					break;
				case 'UIButton_ok':			
					this.debugger.saveConfig();
					this.debugger.displaySettings( false );
					break;
				case 'UIButton_cancel':			
					this.debugger.displaySettings( false );
					this.debugger.loadConfig();
					break;
			}
		};
		this.SettingsWindow.prototype.draw = function()
		{
			this.drawWindow();
		};
		this.HelpWindow = function( aoz, args )
		{
			aoz.ext_debugging.turnIntoWindow.call( this, aoz, args );
			this.helpRectangle = { x: this.workRectangle.x + 16, y: this.workRectangle.y, width: this.workRectangle.width - 16 * 2 - this.debugger.sliderWidth, height: this.workRectangle.height - 100 };
			this.helpScreen = new Screen( this.aoz,
			{
				x: 0,			
				y: 0,
				width: this.helpRectangle.width, 
				height: 1080 * 4, 
				displayScale: 1, 
				index: "__help__", 
				numberOfColors: 128,
				windowFont: 
				{
					name: this.debugger.fontName, 
					height: this.debugger.vars.fontHeight,
					context: 'ext_debugging',
					widthChar: this.debugger.vars.fontHeight,
					heightChar: this.debugger.vars.fontHeight,
				},
			}, "" );
			this.helpScreen.setPalette( this.debugger.palette, '#noremap' );
			this.position = 0;
			this.slider = this.debugger.findUIElement( 'help_slider' );
			this.slider.x = this.helpRectangle.x + this.helpRectangle.width;
			this.slider.y = this.helpRectangle.y;
			this.slider.height = this.helpRectangle.height;
			this.slider.maximum = this.helpScreen.vars.height - this.helpRectangle.height;
			this.slider.position = 0;
			this.slider.size = this.helpRectangle.height;
			this.debugger.createUIElement( this.slider );
			var self = this;
			this.aoz.filesystem.loadFile( 'http://resources/ext_debugging/assets/help-us.md', { responseType: 'utf-8' }, function( response, data, extra )
			{
				self.text = data;
				self.helpScreen.cls( self.debugger.getInk( 'inRectangle', self.debugger.INK_ACTIVATED ) );
				self.helpScreen.setFont( [ self.debugger.fontText, self.debugger.vars.fontHeight ], {}, undefined, undefined, 'ext_debugging' );
				self.helpScreen.setInk( self.debugger.getInk( 'textFont', self.debugger.INK_ACTIVATED ) );
				self.helpScreen.formatText(
				[
					{
						text: self.text,
						x: 0, 
						y: 0,
						width: self.helpScreen.vars.width, 
						height: self.helpScreen.vars.height, 
						contextName: 'ext_debugging',
						tags: '#top #left #md',
						codeFont: self.debugger.fontName, 
						codeFontHeight: self.debugger.vars.fontHeight,
						callback: function( response, data, extra )
						{
							self.drawn = true;
						}
					}
				] );
			} );
			this.elements = [];
			var y = this.workRectangle.height - 74;
			this.elements.push( { type: 'button', id: "UIButton_ok", x: this.workRectangle.width - 150, y: y, width: 150, height: 64, content: this.aoz.getMessage( 'db_close' ), onClick: "ext_debugging:uiClickHelp" } );
			this.elements.push( { type: 'button', id: "UIButton_displayDoc", x: 32, y: y, width: 300, height: 64, content: this.aoz.getMessage( 'db_displayDoc' ), onClick: "ext_debugging:uiClickHelp" } );
			for ( var e = 0; e < this.elements.length; e++ )
			{
				var element = this.aoz.utilities.copyObject( this.elements[ e ] );
				element.renderingContext = 'debugger';
				element.x = this.workRectangle.x + element.x;
				element.y = this.workRectangle.y + element.y;
				element.fontSize = 18; 
				this.aoz.ui.addElement( element );
			}
		};
		this.HelpWindow.prototype.setRectangle = function( outRectangle, inRectangle )
		{
			this.debugger.setRectangle.call( this, outRectangle, inRectangle );
			for ( var e = 0; e < this.elements.length; e++ )
			{
				var element = this.aoz.utilities.copyObject( this.elements[ e ] );
				element.x += this.workRectangle.x;
				element.y += this.workRectangle.y;
				this.aoz.ui.setPosition( element );
			}
		};
		this.HelpWindow.prototype.onMouseWheel = function( delta )
		{
			this.position = Math.min( Math.max( this.position + delta * 16, 0 ), this.helpScreen.vars.height - this.helpRectangle.height );
			this.slider.slider.set_position( this.position, false );
		};
		this.HelpWindow.prototype.destroy = function( args )
		{
			for ( var e = 0; e < this.elements.length; e++ )
				this.aoz.ui.delete( { id: this.elements[ e ].id } );
			this.elements = [];
			this.debugger.destroyWindow.call( this );
		};
		this.HelpWindow.prototype.uiClick = function( args )
		{
			switch ( args.ID$ )
			{
				case 'UIButton_ok':			
					this.helpScreen.close();
					this.debugger.displayHelp( false );
					break;
				case 'UIButton_cancel':		
					this.helpScreen.close();	
					this.debugger.displayHelp( false );
					break;
			}
		};
		 this.HelpWindow.prototype.draw = function()
		{
			this.debugger.activateWindow( this );
			this.drawWindow();
			if ( this.drawn )
			{
				this.helpScreen.screenCopy( this.screen, { x: 0, y: this.position, width: this.helpRectangle.width, height: this.helpRectangle.height }, this.helpRectangle );
				this.slider.slider.set_rectangle( { x: this.helpRectangle.x + this.helpRectangle.width, y: this.helpRectangle.y, height: this.helpRectangle.height } );
				this.slider.slider.draw();
			}
		};
		this.turnIntoWindow = function( aoz, args )
		{
			this.aoz = aoz;
			this.debugger = aoz.ext_debugging;
			this.id = args.id;
			this.visible = args.visible;
			this.parent = args.parent;
			this.type = args.type;
			args.x = Math.floor( args.x );
			args.y = Math.floor( args.y );
			args.width = Math.floor( args.width );
			args.height = Math.floor( args.height );
			if ( this.type == 'popup' )
			{
				var x = args.checkRectangle.x;
				var y = args.checkRectangle.y;
				if ( args.position.indexOf( '#left' ) >= 0 )
					x -= args.width;
				else if ( args.position.indexOf( '#right' ) >= 0 )
					x = args.checkRectangle.x + args.checkRectangle.width - args.width;
				if ( args.position.indexOf( '#top' ) >= 0 )
					y -= args.height;
				else if ( args.position.indexOf( '#bottom' ) >= 0 )
					y = args.checkRectangle.y + args.checkRectangle.height;
				if ( x + args.width > args.screen.vars.width )
					x = args.screen.vars.width - args.width;
				if ( y + args.height > args.screen.vars.height )
					y = args.screen.vars.height - args.height;
				args.x = x;
				args.y = y;
			}
			else if ( this.type == 'hint' )
			{
				var x = args.checkRectangle.x;
				var y = args.checkRectangle.y;
				if ( typeof args.width == 'undefined' )
					args.width = args.screen.textLength( args.text ) + args.borderH * 2;
				if ( typeof args.height == 'undefined' )
					args.height = args.fontHeight + args.borderV * 2;
				if ( args.position.indexOf( '#left' ) >= 0 )
					x -= args.width;
				else if ( args.position.indexOf( '#right' ) >= 0 )
					x += args.checkRectangle.width;
				if ( args.position.indexOf( '#top' ) >= 0 )
					y -= args.height;
				else if ( args.position.indexOf( '#bottom' ) >= 0 )
					y += args.checkRectangle.height;
				if ( !args.parent )
				{
					if ( x + args.width > args.screen.vars.width )
						x = args.screen.vars.width - args.width;
					if ( y + args.height > args.screen.vars.height )
						y = args.screen.vars.height - args.height;
				}
				else
				{
					if ( x + args.width > args.parent.outRectangle.x + args.parent.outRectangle.width )
						x = args.parent.outRectangle.width - args.width;
					if ( y + args.height > args.parent.outRectangle.y + args.parent.outRectangle.height )
						y = args.parent.outRectangle.height - args.height;
				}
				args.x = x;
				args.y = y;
			}
			this.borderIn = typeof args.borderIn != 'undefined' ? args.borderIn : { left: 0, top: 0, right: 0, bottom: 0 };
			var inWidth = args.width - args.borderH * 2;
			var inHeight = args.height + ( args.title ? args.fontHeight : 0 ) - args.borderV * 2;
			var workWidth = inWidth - ( this.borderIn.left + this.borderIn.right );
			var workHeight = inHeight - ( this.borderIn.top + this.borderIn.bottom );
			if ( workWidth < 16 || workHeight < 8 )
				return false;
			this.outRectangle =
			{
				x: args.x,
				y: args.y,
				width: args.width,
				height: args.height
			};
			this.inRectangle =
			{
				x: args.x + args.borderH,
				y: args.y + ( args.title ? args.fontHeight : 0 ) + args.borderV,
				width: inWidth,
				height: inHeight
			};
			this.workRectangle =
			{
				x: this.inRectangle.x + this.borderIn.left,
				y: this.inRectangle.y + this.borderIn.top,
				width: workWidth,
				height: workHeight
			};
			this.checkRectangle = args.checkRectangle;
			this.minimized = false;
			this.timeout = args.timeout;
			this.destroyMe = args.timeout;
			this.borderH = args.borderH;
			this.borderV = args.borderV;
			this.title = args.title;
			this.inkOut = args.inkOut;
			this.inkIn = args.inkIn;
			this.paperIn = args.paperIn;
			this.alpha = args.alpha;
			this.inkFont = args.inkFont;
			this.fontHeight = args.fontHeight;
			this.topFront = args.topFront;
			this.screen = args.screen;
			this.noMinimize = args.noMinimize;
			this.showControls = false;
			this.windows = [];
			this.mode = '';
			this.linkedLeft = [];
			this.linkedRight = [];
			this.linkedTop = [];
			this.linkedBottom = [];
			this.drawWindow = this.debugger.drawWindow;
			this.addChild = this.debugger.addWindow;
			this.findChild = this.debugger.findWindow;
			this.drawChildren = this.debugger.drawWindows;
			this.destroyChildren = this.debugger.destroyChildren;
			this.mouseChildren = this.debugger.mouseWindows;
			this.keyChildren = this.debugger.keyWindows;
			this.mouseWheelChildren = this.debugger.mouseWheelWindows;
			this.updateChildren = this.debugger.updateWindows;
			this.toFront = this.debugger.windowToFront;
			if ( !this.setRectangle )
				this.setRectangle = this.debugger.setRectangle;
			if ( !this.destroy )
				this.destroy = this.debugger.destroyWindow;
		};
		this.setRectangle = function( rectangleOut, rectangleIn )
		{
			if ( rectangleOut )
			{
				rectangleOut.x = ( typeof rectangleOut.x == 'undefined' ? this.outRectangle.x : rectangleOut.x );
				rectangleOut.y = ( typeof rectangleOut.y == 'undefined' ? this.outRectangle.y : rectangleOut.y );
				rectangleOut.width = ( typeof rectangleOut.width == 'undefined' ? this.outRectangle.width : rectangleOut.width );
				rectangleOut.height = ( typeof rectangleOut.height == 'undefined' ? this.outRectangle.height : rectangleOut.height );
				this.outRectangle =
				{
					x: rectangleOut.x,
					y: rectangleOut.y,
					width: rectangleOut.width,
					height: rectangleOut.height
				};
				this.inRectangle =
				{
					x: rectangleOut.x + this.borderH,
					y: rectangleOut.y + ( this.title ? this.fontHeight : 0 ) + this.borderV,
					width: rectangleOut.width - this.borderH * 2,
					height: rectangleOut.height - ( this.title ? this.fontHeight : 0 ) - this.borderV * 2
				};
				this.workRectangle = 
				{
					x: this.inRectangle.x + this.borderIn.left,
					y: this.inRectangle.y + this.borderIn.top,
					width: this.inRectangle.width - ( this.borderIn.left + this.borderIn.right ),
					height: this.inRectangle.height - ( this.borderIn.top + this.borderIn.bottom ),
				}
			}
			if ( rectangleIn )
			{
				rectanglein.x = ( typeof rectangleIn.x == 'undefined' ? this.inRectangle.x : rectangleIn.x );
				rectangleIn.y = ( typeof rectangleIn.y == 'undefined' ? this.inRectangle.y : rectangleIn.y );
				rectangleIn.width = ( typeof rectangleIn.width == 'undefined' ? this.inRectangle.width : rectangleIn.width );
				rectangleIn.height = ( typeof rectangleIn.height == 'undefined' ? this.inRectangle.height : rectangleIn.height );
				this.outRectangle =
				{
					x: rectangleIn.x - this.borderH,
					y: rectangleIn.y - this.borderV * 2 - ( this.title ? this.fontHeight : 0 ),
					width: rectangleIn.width + this.borderH * 2,
					height: ( this.title ? this.fontHeight : 0 ) + rectangleIn.height + this.borderV * 2
				};
				this.inRectangle =
				{
					x: rectangleIn.x,
					y: rectangleIn.y,
					width: rectangleIn.width,
					height: rectangleIn.height
				};
				this.workRectangle = 
				{
					x: this.inRectangle.x + this.borderIn.left,
					y: this.inRectangle.y + this.borderIn.top,
					width: this.inRectangle.width - ( this.borderIn.left + this.borderIn.right ),
					height: this.inRectangle.height - ( this.borderIn.top + this.borderIn.bottom ),
				}
			}
		};
		this.addWindow = function( win, force )
		{
			if ( win.windows )		// Is it a real window?
			{
				if ( !force )
				{
					for ( var w = 0; w < this.windows.length; w++ )
					{
						if ( this.windows[ w ].id == win.id )
							break;
					}
					if ( w == this.windows.length )
					{
						this.windows.push( win );
						this.debugger.winToFront = win;
						return win;
					}
					return null;
				}
				this.windows.push( win );
				this.debugger.winToFront = win;
				return win;
			}
			return null;
		};
		this.destroyWindow = function( timeout )
		{
			if ( timeout )
			{
				var self = this;
				setTimeout( function()
				{
					if ( self.slider )
						self.debugger.deleteUIElement( self.slider );
					self.parent.windows = self.aoz.utilities.cleanArray( self.parent.windows, self );
				}, timeout );
				return;
			}
			if ( this.slider )
				this.debugger.deleteUIElement( this.slider );
			this.parent.windows = this.aoz.utilities.cleanArray( this.parent.windows, this );
		};
		this.destroyChildren = function()
		{
			var windows = this.aoz.utilities.copyArray( this.windows );
			for ( var w = 0; w < windows.length; w++ )
			{
				windows[ w ].destroy();
			}
		};
		this.findWindow = function( id )
		{
			for ( var w = 0; w < this.windows.length; w++ )
			{
				if ( this.windows[ w ].id == id )
					return this.windows[ w ];
			}
			return undefined;
		};
		this.drawWindow = function( win )
		{
			if ( typeof win == 'string' )
				win = this.debugger.findWindow( win );
			if ( typeof win == 'undefined' )
				win = this;
			if ( typeof win.alpha != 'undefined' )
				win.screen.setAlpha( win.alpha );
			win.screen.setPaint( false );
			if ( !win.minimized )
			{
				var ink1, ink2;
				if ( win.type != 'hint' )
				{
					ink1 = this.debugger.getInk( 'outRectangle', win.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
					ink2 = this.debugger.getInk( 'inRectangle', win.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
				}
				else
				{
					ink1 = this.debugger.getInk( 'hint', this.debugger.INK_NORMAL );
					ink2 = this.debugger.getInk( 'hint', this.debugger.INK_ACTIVATED );
				}
				if ( ink1 )
				{
					win.screen.setInk( ink1 );
					win.screen.bar( { x: win.outRectangle.x, y: win.outRectangle.y, width: win.outRectangle.width, height: win.outRectangle.height } );
				}
				if ( ink2 )
				{
					win.screen.setInk( ink2 );
					win.screen.bar( { x: win.inRectangle.x, y: win.inRectangle.y, width: win.inRectangle.width, height: win.inRectangle.height } );
				}
			}
			if ( win.title )
			{
				var ink = this.debugger.getInk( 'titleBar', win.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
				if ( ink )
				{
					win.screen.setInk( ink );
					win.screen.bar( { x: win.outRectangle.x, y: win.outRectangle.y, width: win.outRectangle.width - 1, height: win.fontHeight } );
				}
				ink = this.debugger.getInk( 'titleFont', win.activated ? this.debugger.INK_ACTIVATED : this.debugger.INK_NORMAL );
				if ( ink )
				{
					win.screen.setFont( [ win.debugger.fontName, this.debugger.vars.fontHeightTitle ], {}, undefined, undefined, 'ext_debugging' );
					win.screen.setInk( ink );
					win.screen.text( { x: win.outRectangle.x + 8, y: win.outRectangle.y + 3 }, win.title, '#left #top' );
				}
				if ( !this.noMinimize )
				{
				var img = win.minimized ? this.debugger.imgArrowRight : this.debugger.imgArrowDown;
				win.arrowRectangle = { x: win.outRectangle.x + win.outRectangle.width - win.fontHeight, y: win.outRectangle.y + win.fontHeight / 8, width: win.fontHeight / 2, height: win.fontHeight / 2 }
				win.screen.pasteCanvas( img, win.arrowRectangle );
			}
			}
		};
		this.drawWindows = function()
		{
			for ( var w = 0; w < this.windows.length; w++ )
			{
				var win = this.windows[ w ];
				if ( win.visible && !win.topFront )
					win.draw();
			}
			for ( var w = 0; w < this.windows.length; w++ )
			{
				var win = this.windows[ w ];
				if ( win.visible && win.topFront )
					win.draw();
			}
		};
		this.dragWindows = function()
		{
			var mode = '';
			var win = this.getWindowAtPoint( this.xMouse, this.yMouse, true );
			while ( !this.dragWin && win )
			{
				win.isSingle = ( win.linkedLeft.length + win.linkedRight.length + win.linkedTop.length + win.linkedBottom.length ) == 0;
				win.isStatic = win.isSingle && !win.title;
				var rect = { x: win.outRectangle.x, y: win.outRectangle.y, width: win.outRectangle.width, height: win.fontHeight };
				if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, rect ) )
				{
					if ( !win.isSingle )
					{
						mode = 'sizeTop';
						this.cursor = 's-resize';
						break;
					}
					else
					{
						mode = 'drag';
						this.cursor = 'resize';
						break;
					}
				}
				var rect = { x: win.outRectangle.x, y: win.outRectangle.y, width: win.inRectangle.x - win.outRectangle.x, height: win.outRectangle.height };
				if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, rect ) )
				{
					if ( win.linkedLeft.length > 0 || win.isSingle )
					{
						mode = 'sizeLeft';
						this.cursor = 'w-resize';
						break;
					}
				}
				var rect = { x: win.inRectangle.x + win.inRectangle.width, y: win.outRectangle.y, width: ( win.outRectangle.width - win.inRectangle.width ) / 2, height: win.outRectangle.height };
				if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, rect ) )
				{
					if ( win.linkedRight.length > 0 || win.isSingle  )
					{
						mode = 'sizeRight';
						this.cursor = 'e-resize';
						break;
					}
				}
				var rect = { x: win.outRectangle.x, y: win.outRectangle.y + win.outRectangle.height - win.borderV, width: win.outRectangle.width, height: win.borderV };
				if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, rect ) )
				{
					if ( win.linkedBottom.length > 0 || win.isSingle  )
					{
						mode = 'sizeBottom';
						this.cursor = 's-resize';
						break;
					}
				}
				this.cursor = 'auto';
				break;
			}
			if ( this.mouseKeys )
			{
				if ( !this.dragWin )
				{
					if ( mode != '' )
					{
						this.dragWin = win;
						this.dragMode = mode;
						this.todoDrag = null;
						this.mouseCaptured = true;
						this.enableSliders( false );
						this.dragXStart = this.xMouse;
						this.dragYStart = this.yMouse;
						this.dragOutRectangle = this.aoz.utilities.copyObject( win.outRectangle );
						this.dragRectangle = this.aoz.utilities.copyObject( win.outRectangle );
					}
					return;
				}
				else
				{
					var rect = this.aoz.utilities.copyObject( this.dragRectangle );
					var x = rect.x;
					var y = rect.y;
					switch ( this.dragMode )
					{
						case 'drag':
							rect.x = ( this.xMouse - this.dragXStart ) + this.dragRectangle.x;
							rect.y = ( this.yMouse - this.dragYStart ) + this.dragRectangle.y;
							break;
						case 'sizeTop':
							rect.y = ( this.yMouse - this.dragYStart ) + this.dragRectangle.y;
							rect.height += y - rect.y;
							break;
						case 'sizeLeft':
							rect.x = ( this.xMouse - this.dragXStart ) + this.dragRectangle.x;
							rect.width += x - rect.x;
							break;
						case 'sizeRight':
							rect.width = ( this.xMouse - this.dragXStart ) + this.dragRectangle.width;
							rect.width += x - rect.x;
							break;
						case 'sizeBottom':
							rect.height = ( this.yMouse - this.dragYStart ) + this.dragRectangle.height;
							rect.height += y - rect.y;
							break;
						default:
							break;
					}
					if ( rect.x != this.dragRectangle.x || rect.y != this.dragRectangle.y || rect.width != this.dragRectangle.width || rect.height != this.dragRectangle.height )
					{
						var error = false;
						switch ( this.dragMode )
						{
							case 'sizeTop':
								var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
								error |= this.linkWindowsPositions( false, this.dragWin, 0, deltaY, 0, -deltaY );
								break;
							case 'sizeBottom':
								var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
								error |= this.linkWindowsPositions( false, this.dragWin, 0, 0, 0, deltaY );
								break;
							case 'sizeRight':
								var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
								error |= this.linkWindowsPositions( false, this.dragWin, 0, 0, deltaX, 0 );
								break;
							case 'sizeLeft':
								var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
								error |= this.linkWindowsPositions( false, this.dragWin, deltaX, 0, 0, 0 );
								break;
							case 'drag':
								var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
								var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
								error |= this.linkWindowsPositions( false, this.dragWin, deltaX, deltaY, 0, 0 );
								break;
						}
						this.todoDrag = !error;
						this.dragOutRectangle = rect;
						this.dragInk = this.getInk( 'dragOutRectangle', this.todoDrag ? this.INK_NORMAL : this.INK_DEACTIVATED );
					}
				}
			}
			else
			{
				if ( this.todoDrag )
				{
					switch ( this.dragMode )
					{
						case 'sizeTop':
							var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
							this.linkWindowsPositions( true, this.dragWin, 0, deltaY, 0, -deltaY );
							break;
						case 'sizeBottom':
							var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
							this.linkWindowsPositions( true, this.dragWin, 0, 0, 0, deltaY );
							break;	
						case 'sizeRight':
							var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
							this.linkWindowsPositions( true, this.dragWin, 0, 0, deltaX, 0 );
							break;
						case 'sizeLeft':
							var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
							this.linkWindowsPositions( true, this.dragWin, deltaX, 0, 0, 0 );
							break;
						case 'drag':
							var deltaX = Math.floor( ( this.xMouse - this.dragXStart ) );
							var deltaY = Math.floor( ( this.yMouse - this.dragYStart ) );
							this.linkWindowsPositions( true, this.dragWin, deltaX, deltaY, 0, 0 );
							break;
					}
					this.todoDrag = false;
					this.saveConfig();
				}
				if ( this.dragWin )
				{
					this.dragMode = '';
					this.dragWin = undefined;
					this.dragOutRectangle = null;
					this.mouseCaptured = false;
					this.enableSliders( true );
				}
			}
		}
		this.updateWindows = function()
		{
			if ( this.windows.length )
			{
				var windows = this.aoz.utilities.copyArray( this.windows );
				for ( var w = 0; w < windows.length; w++ )
				{
					var win = windows[ w ];
					if ( win.debugger && ( win.type == 'hint' || win.type == 'popup' ) )
					{
						if ( win.checkRectangle && this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, win.checkRectangle ) )
							win.destroyMe = win.timeout;
						else if ( win.outRectangle && this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, win.outRectangle ) )
							win.destroyMe = win.timeout;
						win.destroyMe--;
						if ( win.destroyMe < 0 )
						{
							win.destroy();
						}
					}
				}
			}
			for ( var w = 0 ; w < this.windows.length; w++ )
			{
				var win = this.windows[ w ];
				if ( win.debugger && win.onUpdate )
				{
					win.xMouse = this.debugger.xMouse - win.workRectangle.x;
					win.yMouse = this.debugger.yMouse - win.workRectangle.y;
					win.onUpdate();
				}
				win.updateChildren();
			}
		}
		this.repositionWindows = function()
		{
			if ( !this.initializedConsole )
			{
			if ( this.displayMode == 'chrome' )
			{
					var width = this.winStack.outRectangle.width;
				var x, y = 0;
				if ( this.vars.winRight )
				{
					x = this.screen.vars.width - width;
					this.winApplication.setRectangle( { x: 0, y: y, width: this.screen.vars.width - width, height: this.screen.vars.height - this.winConsole.outRectangle.height } );
				}
				else
				{
					x = 0;
					this.winApplication.setRectangle( { x: width, y: 0, width: this.screen.vars.width - width, height: this.screen.vars.height - this.winConsole.outRectangle.height } );
				}
				y = 0;
				this.winStack.setRectangle( { x: x, y: y } )
				y += this.winStack.outRectangle.height;
				this.winSource.setRectangle( { x: x } )
				y += this.winSource.outRectangle.height;
				this.winVariables.setRectangle( { x: x } )
				y += this.winVariables.outRectangle.height;
				this.winWatch.setRectangle( { x: x, y: y } )
				y += this.winWatch.outRectangle.height;
				this.winConsole.setRectangle( { x: 0, y: y, width: this.screen.vars.width, height: this.winConsole.outRectangle.height } );
			}
			else if ( this.displayMode == 'aoz' )
			{
				var width = this.winLinkedFirst.outRectangle.width;
				var x, y = 0;
				if ( this.vars.winRight )
				{
					x = this.screen.vars.width - width;
					this.winSource.setRectangle( { x: 0, y: 0, width: this.screen.vars.width - width, height: this.screen.vars.height - this.winConsole.outRectangle.height } );
				}
				else
				{
					x = 0;
					this.winSource.setRectangle( { x: width, y: 0, width: this.screen.vars.width - width, height: this.screen.vars.height - this.winConsole.outRectangle.height } );
				}
				y = 0;
				this.winApplication.setRectangle( { x: x, y: y } )
				y += this.winApplication.outRectangle.height;
				this.winStack.setRectangle( { x: x, y: y } )
				y += this.winStack.outRectangle.height;
				this.winVariables.setRectangle( { x: x, y: y } )
				y += this.winVariables.outRectangle.height;
				this.winWatch.setRectangle( { x: x, y: y } )
				y += this.winWatch.outRectangle.height;
				this.winConsole.setRectangle( { x: 0, y: y, width: this.screen.vars.width, height: this.winConsole.outRectangle.height } );
			}
			}
		};
		this.activateWindow = function( winFront )
		{
			this.callAllWindows( function( win )
			{
				win.previousActivated = win.activated;
				win.activated = false;
			} );
			winFront.toFront();
			winFront.previousActivated = false;
			winFront.activated = true;
			this.lastActivated = 50;
		}
		this.resetWindowsPositions = function()
		{
			for ( var w = 0; w < this.windows.length; w++ )
			{
				var win = this.windows[ w ];
				win.visible = true;
				win.minimized = false;
			}
			if ( !this.initializedConsole )
			{
			if ( this.displayMode == 'chrome' )
			{
				var width = this.screen.vars.width * 0.33;
				var height = this.screen.vars.height * 0.8;
				var heightConsole = this.screen.vars.height * 0.2;
				var y = 0;
				var x = 0;
				if ( this.vars.winRight )
				{
					this.winApplication.setRectangle( { x: 0, y: y, width: this.screen.vars.width - width, height: this.screen.vars.height - heightConsole } );
					x = this.screen.vars.width - width;
				}
				else
				{
					this.winApplication.setRectangle( { x: width, y: y, width: this.screen.vars.width - width, height: this.screen.vars.height - heightConsole } );
				}
				this.winStack.setRectangle( { x: x, y: y, width: width, height: height / 10 } )
				y += this.winStack.outRectangle.height;
				this.winSource.setRectangle( { x: x, y: y, width: width, height: height / 2 } )
				y += this.winSource.outRectangle.height;
				this.winVariables.setRectangle( { x: x, y: y, width: width, height: height / 3 } )
				y += this.winVariables.outRectangle.height;
				this.winWatch.setRectangle( { x: x, y: y, width: width, height: ( this.screen.vars.height - heightConsole ) - y } )
				y += this.winWatch.outRectangle.height;
				this.winConsole.setRectangle( { x: 0, y: y, width: this.screen.vars.width, height: heightConsole } );
			}
			else if ( this.displayMode == 'aoz' )
			{
				var width = this.screen.vars.width * 0.33;
				var height = this.screen.vars.height * 0.8;
				var heightConsole = this.screen.vars.height * 0.2;
				var y = 0, x = 0;
				if ( this.vars.winRight )
				{
					this.winSource.setRectangle( { x: 0, y: y, width: this.screen.vars.width - width, height: this.screen.vars.height - heightConsole } );
					x = this.screen.vars.width - width;
				}
				else
				{
					this.winSource.setRectangle( { x: width, y: y, width: this.screen.vars.width - width, height: this.screen.vars.height - heightConsole } );
				}
				this.winApplication.setRectangle( { x: x, y: y, width: width, height: width * 9 / 16 } )
				y += this.winApplication.outRectangle.height;
				this.winStack.setRectangle( { x: x, y: y, width: width, height: height / 8 } )
				y += this.winStack.outRectangle.height;
				this.winVariables.setRectangle( { x: x, y: y, width: width, height: height / 3 } )
				y += this.winVariables.outRectangle.height;
				this.winWatch.setRectangle( { x: x, y: y, width: width, height: ( this.screen.vars.height - heightConsole ) - y } )
				y += this.winWatch.outRectangle.height;
				this.winConsole.setRectangle( { x: 0, y: y, width: this.screen.vars.width, height: heightConsole } );
			}
			}
			else
			{
				var width = this.screen.vars.width / 3;
				var height = this.screen.vars.height / 3;
				this.winConsole.setRectangle( { x: this.screen.vars.width - width, y: this.screen.vars.height - height, width: width, height: height } )
			}
		};
		this.swapWindowMinimized = function( winMoved )
		{
			if ( winMoved == this.winApplication && winMoved.linkedTop.length == 0 )
				return;
			if ( winMoved == this.winSource && winMoved.linkedTop.length == 0 )
				return;
			var toMove = false;
			if ( winMoved.linkedBottom.length == 0 || winMoved == this.winConsole )
				toMove = true;			
			else if ( winMoved.linkedTop.length == 0 )
				toMove = false;
			else
			{
				var win = winMoved.linkedBottom[ 0 ];
				while( true )
				{
					if ( win == this.winConsole )
					{
						toMove = true;
						break;
					}
					if ( win.linkedBottom.length == 0 )
					{
						toMove = true;
						break;
					}
					if ( win.minimized )
						win.minimized = false;
					break;
				}
			}
			var deltaY;
			winMoved.minimized = !winMoved.minimized;	
			if ( winMoved.minimized )
			{
				winMoved.previousHeight = winMoved.outRectangle.height;
				deltaY = -( winMoved.previousHeight - winMoved.fontHeight );
			}
			else
			{
				deltaY = winMoved.previousHeight - winMoved.fontHeight;
			}
			if ( toMove )
			{
				do
				{
					if ( !this.linkWindowsPositions( true, winMoved, 0, -deltaY, 0, deltaY ) )
						break;
					deltaY *= 0.9;
				} while( Math.abs( deltaY ) > winMoved.fontHeight + 8 )
			}
			else
			{
				do
				{
					if ( !this.linkWindowsPositions( true, winMoved, 0, 0, 0, deltaY ) )
						break;
					deltaY *= 0.9;
				} while( Math.abs( deltaY ) > winMoved.fontHeight + 8 )
			}
		};
		this.linkWindowsPositions = function( toSet, winMoved, deltaX = 0, deltaY = 0, deltaWidth = 0, deltaHeight = 0, caller = null )
		{
			var self = this;
			var error = false;
			var doWins = [];
			if ( !caller )
			{
				for ( var w = 0; w < this.windows.length; w++ )
				{
					this.windows[ w ].checkRectangleDone = false;
					this.windows[ w ].checkRectangle = null;
				}
			}
			if ( deltaX || deltaWidth )
			{
				if ( !winMoved.isSingle && winMoved.linkedRight.length == 0 && deltaWidth == 0 )
					deltaWidth = -deltaX;
				if ( winMoved.linkedTop.length )
				{
					if ( deltaX )
					{
						win = winMoved.linkedTop[ 0 ];
						if ( caller != win && win.outRectangle.x == winMoved.outRectangle.x )
							doWins.push( win );
					}
					else
					{
						win = winMoved.linkedTop[ winMoved.linkedTop.length - 1 ];
						if ( caller != win && win.outRectangle.width == winMoved.outRectangle.width )
							doWins.push( win );
					}
				}
				if ( winMoved.linkedBottom.length )			
				{
					if ( deltaX )
					{
						win = winMoved.linkedBottom[ 0 ];
						if ( caller != win && win.outRectangle.x == winMoved.outRectangle.x )
							doWins.push( win );
					}
					else
					{
						win = winMoved.linkedBottom[ winMoved.linkedBottom.length - 1 ];
						if ( caller != win && win.outRectangle.width == winMoved.outRectangle.width )
							doWins.push( win );
					}
				}
				for ( var w = 0; w < winMoved.linkedLeft.length; w++ )
				{
					var win = winMoved.linkedLeft[ w ];
					error |= setCheckRectangle( win, 0, 0, deltaX, 0 );
				}
				if ( deltaX + deltaWidth != 0 )
				{
					for ( var w = 0; w < winMoved.linkedRight.length; w++ )
					{
						var win = winMoved.linkedRight[ w ];
						error |= setCheckRectangle( win, deltaWidth, 0, -deltaWidth, 0 );
					}
				}
			}
			if ( deltaY || deltaHeight )
			{
				if ( !winMoved.isSingle && winMoved.linkedBottom.length == 0 && deltaHeight == 0 )
					deltaHeight = -deltaY;
				if ( winMoved.linkedLeft.length )
				{
					if ( deltaY )
					{
						win = winMoved.linkedLeft[ 0 ];
						if ( caller != win && win.outRectangle.y == winMoved.outRectangle.y )
							doWins.push( win );
					}
					else
					{
						win = winMoved.linkedLeft[ winMoved.linkedLeft.length - 1 ];
						if ( caller != win && win.outRectangle.y + win.outRectangle.height == winMoved.outRectangle.y + winMoved.outRectangle.height )
							doWins.push( win );
					}
				}
				if ( winMoved.linkedRight.length )			
				{
					if ( deltaY )
					{
						win = winMoved.linkedRight[ 0 ];
						if ( caller != win && win.outRectangle.y == winMoved.outRectangle.y )
							doWins.push( win );
					}
					else
					{
						win = winMoved.linkedRight[ winMoved.linkedRight.length - 1 ];
						if ( caller != win && win.outRectangle.y + win.outRectangle.height == winMoved.outRectangle.y + winMoved.outRectangle.height )
							doWins.push( win );
					}
				}
				if ( deltaY )
				{
					for ( var w = 0; w < winMoved.linkedTop.length; w++ )
					{
						var win = winMoved.linkedTop[ w ];
						if ( win.minimized )
							win = win.linkedTop[ 0 ];
						if ( win )
							error |= setCheckRectangle( win, 0, 0, 0, deltaY );
						else
							return true;
					}
				}
				if ( deltaY + deltaHeight != 0 )
				{
					for ( var w = 0; w < winMoved.linkedBottom.length; w++ )
					{
						var win = winMoved.linkedBottom[ w ];
						while ( win && win != this.winConsole )
						{
							if ( win.minimized )
								error |= setCheckRectangle( win, 0, deltaHeight, 0, 0 );
							else
							{
								error |= setCheckRectangle( win, 0, deltaHeight, 0, -deltaHeight );
								break;
							}
							win = win.linkedBottom[ 0 ];
						}
					}
				}
			}
			if ( error )
				return true;
			error |= setCheckRectangle( winMoved, deltaX, deltaY, deltaWidth, deltaHeight );
			if ( error )
				return true;
			if ( doWins.length > 0 )
			{
				for ( var w = 0 ; w < doWins.length; w++ )
				{
					var win = doWins[ w ];		
					if ( win )
					{
						for ( var ww = 0; ww < doWins.length; ww++ )
						{
							if ( win == doWins[ ww ] )
								doWins[ ww ] = null;
						}
						error |= this.linkWindowsPositions( false, win, deltaX, deltaY, deltaWidth, deltaHeight, winMoved );
					}
				}
			}
			if ( error )
				return true;	
			if ( toSet )
			{
				for ( var w = 0; w < this.windows.length; w++ )
				{
					win = this.windows[ w ];
					if ( win.checkRectangle )
						win.setRectangle( win.checkRectangle );
				}
			}
			return false;
			function setCheckRectangle( w, dX, dY, dWidth, dHeight)
			{
				if ( !w.checkRectangleDone )
				{
					w.checkRectangleDone = true;
					x = w.outRectangle.x + dX;
					if ( x < 0 )
						return true;
					y = w.outRectangle.y + dY;
					if ( y < 0 )
						return true;
					width = w.outRectangle.width + dWidth;
					if ( width < 16 )
						return true;
					if ( x + width > self.screen.vars.width )
						return true;
					height = w.outRectangle.height + dHeight;
					if ( w.minimized )
						height = w.fontHeight;
					if ( height < w.fontHeight )
						return true;
					if ( y + height > self.screen.vars.height )
						return true;
					if ( w.validateRectangle && !w.minimized )
					{
						var rectIn = 
						{
							x: x + w.borderH,
							y: y + ( w.title ? w.fontHeight : 0 ) + w.borderV,
							width: width - w.borderH * 2,
							height: height  - w.borderV * 2 - ( w.title ? w.fontHeight : 0 )
						};
						if ( !w.validateRectangle( rectIn ) )
							return true;
					}
					w.checkRectangle = { x: x, y: y, width: width, height: height };
				}
				return false;			
			}
		}
		this.mouseWheelWindows = function( delta, win )
		{
			if ( win && win.onMouseWheel )
			{
				win.onMouseWheel( delta );
				return true;
			}
			for ( var w = this.windows.length - 1; w >= 0; w-- )
			{
				var win = this.windows[ w ];
				if ( win.mouseWheelChildren( delta ) )
					return true;
				if ( win.mouseIn && win.onMouseWheel )
				{
					win.onMouseWheel( delta );
					return true;
				}
			}
			return false;
		};
		this.mouseWindows = function( eventName, event, winAbove )
		{
			if ( this.windows.length == 0 )
				return false;
			for ( var w = this.windows.length - 1; w >= 0; w-- )
			{
				var win = this.windows[ w ];
				if ( win.mouseChildren( eventName, event, winAbove ) )
					return true;
				if ( win.onMouse )
				{
					if ( win == winAbove )
					{
						win.mouseIn = true;
						win.xMouse = this.debugger.xMouse - win.workRectangle.x;
						win.yMouse = this.debugger.yMouse - win.workRectangle.y;
						if ( win.onMouse( eventName, event, winAbove ) )
							return true;
					}
					else
					{
						win.mouseIn = false;
						win.onMouse( eventName, event, null );
					}
				}
			}
			return false;
		};
		this.keyWindows = function( eventName, event, winAbove )
		{
			for ( var w = this.windows.length - 1; w >= 0; w-- )
			{
				var win = this.windows[ w ];
				if ( win.onKey && win.activated )
				{
					win.onKey( eventName, event );
				}
			}
		};
		this.findWindowUnderMouse = function( win )
		{
			for ( var w = 0; w < win.windows.length; w++ )
			{
				var thisWin = win.windows[ w ];
				if ( thisWin.windows.length )
				{
					var child = this.debugger.findWindowUnderMouse( thisWin );
					if ( child )
						return child;
				}
				if ( thisWin.visible && thisWin.workRectangle )
				{
					if ( this.aoz.utilities.pointInRect( this.debugger.xMouse, this.debugger.yMouse, thisWin.workRectangle ) )
						return thisWin;
				}
			}
			return undefined;
		};
		this.getWindowAtPoint = function( x, y, bRectangle )
		{
			if ( this.isRoot )
			{
				for ( var w = this.windows.length - 1 ; w >= 0 ; w-- )
				{
					var win = this.windows[ w ];
					if ( win.visible && win.topFront )
					{
						if ( this.aoz.utilities.pointInRect( x, y, bRectangle ? win.outRectangle : win.workRectangle ) )
							return win;
					}
				}
			}
			for ( var w = this.windows.length - 1 ; w >= 0 ; w-- )
			{
				var win = this.windows[ w ];
				if ( win.visible && !win.topFront )
				{
					if ( win.windows.length != 0 )
					{
						var ret = this.debugger.getWindowAtPoint.call( win, x, y, true );
						if ( ret )
							return ret;
					}
					if ( this.aoz.utilities.pointInRect( x, y, bRectangle ? win.outRectangle : win.workRectangle ) )
						return win;
				}
			}
			return null;
		};
		this.callAllWindows = function( callback, extra )
		{
			for ( var w = this.windows.length - 1 ; w >= 0 ; w-- )
			{
				var ret = this.debugger.callAllWindows.call( this.windows[ w ], callback, extra );
				if ( ret )
					return ret;
			}
			if ( !this.root )
				return callback( this, extra );
		};
		this.windowToFront = function()
		{
			var parent = this.parent;
			if ( parent )
			{
				for ( w = 0; w < parent.windows.length; w++ )
				{
					if ( parent.windows[ w ] == this )
						break;
				}
				parent.windows.splice( w, 1 );
				parent.windows.push( this );
				if ( parent.parent )
					this.debugger.windowToFront.call( parent );
			}
		};
		// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
