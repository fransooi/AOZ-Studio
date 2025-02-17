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
// The Clipboard Extension
// By Francois Lionet and Dave Baldwin
// Version 1.00
// 09/01/2022
// (c) AOZ Studio 2019-2022
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_clipboard( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIENsaXBib2FyZCBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQgYW5kIERhdmUgQmFsZHdpbiIsInZlcnNpb24iOiJWZXJzaW9uIDEuMDAiLCJkYXRlIjoiMDkvMDEvMjAyMiIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTktMjAyMiIsInN0YXJ0IjoiY2xpcGJvYXJkLmFveiIsIm5hbWUiOiJjbGlwYm9hcmQifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_clipboard';
	this.aoz[ "extension" + "Clipboard"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:25:0";
		// Javascript
		this.copy = function( args )
		{
			if ( typeof args.data == 'string' )
			{
				if (window.clipboardData && window.clipboardData.setData) 
				{
					return window.clipboardData.setData( "Text", args.data );
				}
				else if ( document.queryCommandSupported && document.queryCommandSupported( "copy" ) )
				{
					var textarea = document.createElement( "textarea" );
					textarea.textContent = args.data;
					textarea.style.position = "fixed";
					document.body.appendChild(textarea);
					textarea.select();
					try 
					{
						return document.execCommand( "copy" );
					}
					catch (ex) 
					{
						return false;
					}
					finally 
					{
						document.body.removeChild( textarea );
					}
				}
			}
		}
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
