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
// The Time and Timer Instructions
// By Francois Lionet
// Version 0.99
// 12/04/2020
// (c) AOZ Studio 2019-2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_time( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFRpbWUgYW5kIFRpbWVyIEluc3RydWN0aW9ucyIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDAuOTkiLCJkYXRlIjoiMTIvMDQvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTktMjAyMCIsInN0YXJ0IjoidGltZS5hb3oiLCJuYW1lIjoidGltZSJ9LCJjb21waWxhdGlvbiI6eyJub1dhcm5pbmciOltdLCJlcnJvcnMiOnsiZW4iOltdLCJmciI6W119LCJpbmNsdWRlUGF0aHMiOltdfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_time';
	this.aoz[ "module" + "Time" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:39:0";
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
