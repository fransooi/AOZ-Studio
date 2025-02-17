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
// The Screen Instructions
// By Francois Lionet
// Version 0.99
// 11/11/2019
// (c) AOZ Studio 2019
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function v1_0_screens( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFNjcmVlbiBJbnN0cnVjdGlvbnMiLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAwLjk5IiwiZGF0ZSI6IjExLzExLzIwMTkiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDE5Iiwic3RhcnQiOiJzY3JlZW5zLmFveiIsIm5hbWUiOiJzY3JlZW5zIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6WyJpbnN0cnVjdGlvbl9ub3RfaW1wbGVtZW50ZWQiXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiZGlzcGxheUVuZEFsZXJ0IjpmYWxzZSwidXNlQXNzZXRzUmVzb3VyY2VzIjpmYWxzZX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_screens';
	this.aoz[ "module" + "Screens" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:39:0";
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
