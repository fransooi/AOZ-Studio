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
// The Zone Instructions
// By Francois Lionet
// Version 0.99
// 12/04/2020
// (c) AOZ Studio 2019-2020
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function v1_0_zones( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFpvbmUgSW5zdHJ1Y3Rpb25zIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0IiwidmVyc2lvbiI6IlZlcnNpb24gMC45OSIsImRhdGUiOiIxMi8wNC8yMDIwIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAxOS0yMDIwIiwic3RhcnQiOiJ6b25lcy5hb3oiLCJuYW1lIjoiem9uZXMifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbImluc3RydWN0aW9uX25vdF9pbXBsZW1lbnRlZCJdLCJlcnJvcnMiOnsiZW4iOltdLCJmciI6W119LCJkaXNwbGF5RW5kQWxlcnQiOmZhbHNlLCJ1c2VBc3NldHNSZXNvdXJjZXMiOmZhbHNlfSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjpmYWxzZSwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiZXJyb3JzIjp7fX0='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_zones';
	this.aoz[ "module" + "Zones" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:40:0";
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
