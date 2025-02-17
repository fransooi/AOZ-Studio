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
// HTML Instrutions Set For AOZ
// By Baptiste Bideaux
// Version 1.0
// 12/10/2020
// (c) AOZ Studio 2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_aozhtml( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiSFRNTCBJbnN0cnV0aW9ucyBTZXQgRm9yIEFPWiIsImF1dGhvciI6IkJ5IEJhcHRpc3RlIEJpZGVhdXgiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxLjAiLCJkYXRlIjoiMTIvMTAvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMjAiLCJzdGFydCI6ImFvemh0bWwuYW96IiwibmFtZSI6ImFvemh0bWwifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiaW5jbHVkZVBhdGhzIjpbXX0sImVycm9ycyI6e30sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX19'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_aozhtml';
	this.aoz[ "module" + "Aozhtml" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: D:/Programs/AOZ_Studio_SE/AOZ_Studio/app/aoz/languages/v1_0/aozhtml/aozhtml.aoz
		aoz.sourcePos="0:29:0";
		// Javascript
		aozhtml_initialize( this );
		// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
