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
// Create JS Instrutions Set For AOZ
// By Baptiste Bideaux
// Version 1.0
// 12/10/2020
// (c) AOZ Studio 2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_actor( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiQ3JlYXRlIEpTIEluc3RydXRpb25zIFNldCBGb3IgQU9aIiwiYXV0aG9yIjoiQnkgQmFwdGlzdGUgQmlkZWF1eCIsInZlcnNpb24iOiJWZXJzaW9uIDEuMCIsImRhdGUiOiIxMi8xMC8yMDIwIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAyMCIsInN0YXJ0IjoiYWN0b3IuYW96IiwibmFtZSI6ImFjdG9yIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImluY2x1ZGVQYXRocyI6W119LCJlcnJvcnMiOnt9LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_actor';
	this.aoz[ "module" + "Actor" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: D:/Programs/AOZ_Studio_SE/AOZ_Studio/app/aoz/languages/v1_0/actor/actor.aoz
		aoz.sourcePos="0:44:0";
		// Javascript
		actor_initialize( this );
		// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
