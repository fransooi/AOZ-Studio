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
// Name of your application.
// By You
// Version 0.0
// Created on the ...
// (c) Your Corporation Unlimited
//
// Compiled with AOZ Transpiler Version 14.03 on the 20/02/2023-16:10:10
//
function Application( canvasId, args )
{
	this.root=this;
	this.parent=this;
	this.contextName='application';
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsImluZm9zIjp7ImFwcGxpY2F0aW9uTmFtZSI6Ik5hbWUgb2YgeW91ciBhcHBsaWNhdGlvbi4iLCJhdXRob3IiOiJCeSBZb3UiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAwLjAiLCJkYXRlIjoiQ3JlYXRlZCBvbiB0aGUgLi4uIiwiY29weXJpZ2h0IjoiKGMpIFlvdXIgQ29ycG9yYXRpb24gVW5saW1pdGVkIiwic3RhcnQiOiJtYWluLmFveiJ9LCJjb21waWxhdGlvbiI6eyJwbGF0Zm9ybSI6ImFveiIsImtleW1hcCI6ImFveiIsIm1hY2hpbmUiOiJtb2Rlcm4iLCJzcGVlZCI6ImZhc3QiLCJzeW50YXgiOiJlbmhhbmNlZCIsImVuZGlhbiI6ImxpdHRsZSIsInN0cmluZ0Jhc2VJbmRleCI6MSwibm9XYXJuaW5nIjpbXSwiZGlzcGxheUVuZEFsZXJ0IjpmYWxzZSwiZGlzcGxheUVycm9yQWxlcnQiOnRydWUsInVzZUxvY2FsVGFicyI6dHJ1ZSwiaW5jbHVkZVBhdGhzIjpbXX0sImRpc3BsYXkiOnsidHZTdGFuZGFyZCI6InBhbCIsInJlZnJlc2hSYXRlIjo2MCwid2lkdGgiOjE0NDgsImhlaWdodCI6MTA4MCwiYmFja2dyb3VuZCI6ImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIjoiIzAwMDAwMCIsImJvZHlCYWNrZ3JvdW5kQ29sb3IiOiIjMDAwMDAwIiwiYm9keUJhY2tncm91bmRJbWFnZSI6Ii4vcnVudGltZS9yZXNvdXJjZXMvc3Rhcl9uaWdodC5qcGVnIiwic21vb3RoaW5nIjpmYWxzZSwic2NhbGVYIjoxLCJzY2FsZVkiOjEsInNjcmVlblNjYWxlIjoxLCJmcHMiOmZhbHNlLCJmcHNGb250IjoiMTJweCBWZXJkYW5hIiwiZnBzQ29sb3IiOiIjRkZGRjAwIiwiZnBzWCI6MTAsImZwc1kiOjE2LCJmdWxsUGFnZSI6dHJ1ZSwiZnVsbFNjcmVlbiI6dHJ1ZSwia2VlcFByb3BvcnRpb25zIjp0cnVlLCJmdWxsU2NyZWVuSWNvbiI6ZmFsc2UsImZ1bGxTY3JlZW5JY29uWCI6LTM0LCJmdWxsU2NyZWVuSWNvblkiOjIsImZ1bGxTY3JlZW5JY29uSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL2Z1bGxfc2NyZWVuLnBuZyIsInNtYWxsU2NyZWVuSWNvbkltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9zbWFsbF9zY3JlZW4ucG5nIiwicmVuZGVyZXIiOiJjYW52YXMifSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjowLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJjb2xsaXNpb25zIjp7Im1ldGhvZCI6ImZpbmUiLCJwcmVjaXNpb24iOjY0LCJhbHBoYVRocmVzaG9sZCI6MX0sInJhaW5ib3dzIjp7Im1vZGUiOiJzbG93In0sImZvbnRzIjp7Imxpc3RGb250cyI6IlBDIiwiYW1pZ2EiOltdLCJnb29nbGUiOlsicm9ib3RvIl19LCJzb3VuZHMiOnsibW9kZSI6ImFveiIsInZvbHVtZSI6MSwicHJlbG9hZCI6dHJ1ZSwic291bmRQb29sU2l6ZSI6MzJ9LCJnYW1lcGFkIjp7Im1hcHBpbmciOnsidXAiOiJBcnJvd1VwIiwiZG93biI6IkFycm93RG93biIsImxlZnQiOiJBcnJvd0xlZnQiLCJyaWdodCI6IkFycm93UmlnaHQiLCJmaXJlIjoiU3BhY2UifX0sImZpbGVTeXN0ZW0iOnsiY2FzZVNlbnNpdGl2ZSI6ZmFsc2V9LCJkZWZhdWx0Ijp7InNjcmVlbiI6eyJ4IjowLCJ5IjowLCJ3aWR0aCI6MTkyMCwiaGVpZ2h0IjoxMDgwLCJudW1iZXJPZkNvbG9ycyI6MzIsInBpeGVsTW9kZSI6Imxvd3JlcyIsInBhbGV0dGUiOlsiIzAwMDAwMCIsIiNGRkZGRkYiLCIjRDFEMUQxIiwiI0EyQTJBMiIsIiM3MzczNzMiLCIjNDQ0NDQ0IiwiI0ZGMDAwMCIsIiNEMTAwMDAiLCIjQTIwMDAwIiwiIzczMDAwMCIsIiM0NDAwMDAiLCIjMDBGRjAwIiwiIzAwRDEwMCIsIiMwMEEyMDAiLCIjMDA3MzAwIiwiIzAwNDQwMCIsIiNGRkZGMDAiLCIjRDFEMTAwIiwiI0EyQTIwMCIsIiM3MzczMDAiLCIjNDQ0NDAwIiwiI0ZGN0YwMCIsIiNFMjcxMDAiLCIjQzQ2MjAwIiwiI0E2NTMwMCIsIiM4ODQ0MDAiLCIjMDAwMEZGIiwiIzAwMDBEMSIsIiMwMDAwQTIiLCIjMDAwMDczIiwiIzAwMDA0NCIsIiMwMEZGRkYiLCIjMDBEMUQxIiwiIzAwQTJBMiIsIiMwMDczNzMiLCIjMDA0NDQ0IiwiI0ZGMDBGRiIsIiNEMTAwRDEiLCIjQTIwMEEyIiwiIzczMDA3MyIsIiM0NDAwNDQiLCIjRkZBMTAwIiwiI0ZGQjMxMiIsIiNGRkM2MjUiLCIjRkZEODM3IiwiI0ZGRUI0QSIsIiNGRkZFNUQiLCIjMDAyOTY1IiwiIzEyMzk3NSIsIiMyNDQ5ODUiLCIjMzY1OTk1IiwiIzQ4NjlBNSIsIiM1QTc5QjUiLCIjQkY3MTdGIiwiI0IyNjc3MyIsIiNBNDVENjYiLCIjOTc1MzU5IiwiIzg5NDk0QyIsIiM3QjNGM0YiLCIjODI1MkI0IiwiIzYyM0U4NyIsIiM0MTI5NUEiLCIjMjExNTJEIiwiIzAwMDAwMCJdLCJ3aW5kb3ciOnsieCI6MCwieSI6MCwid2lkdGgiOjgwLCJoZWlnaHQiOjI1LCJib3JkZXIiOjAsInBhcGVyIjowLCJwZW4iOjEsImJhY2tncm91bmQiOiJvcGFxdWUiLCJmb250Ijp7Im5hbWUiOiJJQk0gUGxleCBNb25vIiwidHlwZSI6Imdvb2dsZSIsImhlaWdodCI6NDB9LCJjdXJzb3JPbiI6ZmFsc2UsImN1cnNvckltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9jdXJzb3JfcGMucG5nIiwiY3Vyc29yQ29sb3JzIjpbeyJyIjo2OCwiZyI6NjgsImIiOjAsImEiOjEyOH0seyJyIjoxMzYsImciOjEzNiwiYiI6MCwiYSI6MTI4fSx7InIiOjE4NywiZyI6MTg3LCJiIjowLCJhIjoxMjh9LHsiciI6MjIxLCJnIjoyMjEsImIiOjAsImEiOjEyOH0seyJyIjoyMzgsImciOjIzOCwiYiI6MCwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjozNCwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjoxMzYsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MjA0LCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYSI6MTI4fSx7InIiOjE3MCwiZyI6MTcwLCJiIjoyNTUsImEiOjEyOH0seyJyIjoxMzYsImciOjEzNiwiYiI6MjA0LCJhIjoxMjh9LHsiciI6MTAyLCJnIjoxMDIsImIiOjE3MCwiYSI6MTI4fSx7InIiOjM0LCJnIjozNCwiYiI6MTAyLCJhIjoxMjh9LHsiciI6MCwiZyI6MCwiYiI6NjgsImEiOjEyOH0seyJyIjowLCJnIjowLCJiIjoxNywiYSI6MTI4fSx7InIiOjAsImciOjAsImIiOjAsImEiOjEyOH1dfX19fQ=='));
	var options =
	{
		manifest: this.manifest,
		sources: JSON.parse(atob('W3sicGF0aCI6IkM6L0FPWl9TdHVkaW8vQU9aX1N0dWRpby9hcHAvQWNjZXNzb3JpZXMvQU9aIFRvb2xzL2pveXN0aWNrX3Rlc3Rlci9qb3lzdGljay5hb3oiLCJzb3VyY2UiOiIgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbi8vIFlvdSdsbCBBTFNPIGhhdmUgdG8gY29tbWVudCB0aGUgI2Rpc3BsYXlXaWR0aCBsaW5lIGJlbG93IGZvciBpdCB0byB3b3JrIHByb3Blcmx5IGluIHRoZSBBbWlnYSBtYW5pZmVzdC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4nLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcclxuJyBHYW1lcGFkIFRlc3RlciAtIGJ5IEJyaWFuIEZsYW5hZ2FuIChha2EgaXNpbmc0amVzdXMpXHRcdFx0XHRcdFx0XHR8XHJcbidcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fFxyXG4nIFRlc3RzIEdhbWVwYWQoMCkgYnV0dG9ucywgYXhlcywgYW5kIGRpZ2l0YWwgZW11bGF0aW9uIFx0XHRcdFx0XHRcdHxcclxuJyBTaG93cyB1cCB0byAzOSBidXR0b25zIGFuZCAyMCBheGVzXHRcdFx0ICBcdFx0XHRcdFx0XHRcdFx0fFxyXG4nIENoYW5nZSB0aGUgbWFuaWZlc3QgYWJvdmUgdG8gc2VlIGluIEFtaWdhIG1vZGUuXHRcdFx0XHRcdFx0XHRcdHxcclxuJ1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR8XHJcbicgV29ya3MgY29uc2lzdGVudGx5IHdpdGggbW9zdCBicm93c2VycyBpbmNsdWRpbmcgQ2hyb21lLCBGaXJlZm94LCBTYWZhcmksXHRcdHxcclxuJyBPcGVyYSwgRWRnZSwgVml2YWxkaSwgQnJhdmUsIGFuZCBTZWFtb25rZXkuICBSZXN1bHRzIG1heSBiZSB1bmV4cGVjdGVkIHdoZW5cdHxcclxuJyB1c2VkIHdpdGggYnJvd2VycyBvciBnYW1lcGFkcyB3aXRoIHVudXN1YWwgY29uZmlndXJhdGlvbnMuXHRcdFx0XHRcdHxcclxuJ1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR8XHJcbicgU29tZSBicm93c2VycyByZXBvcnQgdGhlIHdyb25nIG51bWJlciBvZiBidXR0b25zIGFuZC9vciBheGVzLiAgVGhpcyBpcyBub3RcdHxcclxuJyB0aGUgZmF1bHQgb2YgQU9aLCBidXQgb2YgdGhlIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIEdhbWVwYWQgQVBJLiAgXHR8XHJcbicgQU9aIEF1dG9tYXRpY2FsbHkgYWRqdXN0cyBmb3IgdGhlIHByaW1hcnkgYXhlcycgZGlmZmVyZW5jZXMgb24gRmlyZWZveCBhbmRcdHxcclxuJyBTZWFtb25rZXkuICBGb3Igb3RoZXIgZGlmZmVyZW5jZXMsIHlvdSdsbCBuZWVkIHRvIGNvbXBlbnNhdGUgaW4geW91ciBjb2RlLlx0fFxyXG4nXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHxcclxuJyBNT1NUIGNvbnRyb2xsZXJzIC8gYnJvd3NlcnM6XHRcdFx0XHRGaXJlZm94L1NlYW1vbmtleTpcdFx0XHRcdFx0fFxyXG4nXHRBeGlzIDAgaXMgbGVmdCAmIHJpZ2h0XHRcdFx0XHRcdFx0QXhpcyAxIGlzIGxlZnQgJiByaWdodFx0XHRcdHxcclxuJ1x0QXhpcyAxIGlzIHVwICYgZG93blx0XHRcdFx0XHRcdFx0QXhpcyAyIGlzIHVwICYgZG93blx0XHRcdFx0fFxyXG4nXHRCdXR0b24gMCBpcyBGaXJlXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fFxyXG4nXHRCdXR0b24gMSBpcyBGaXJlMlx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHxcclxuJ1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR8XHJcbicgdjAuOTkgQ29ycmVjdGVkIGJ1dHRvbiAmIGF4aXMgbGFiZWxzIG5vdCBzaG93aW5nLiAgTWFkZSBjTnVtIEdsb2JhbC5cdFx0XHR8XHJcbictLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxyXG4gIC8vXHJcbiAvLyBTZXQgZ2xvYmFsc1xyXG4vL1xyXG5HbG9iYWwgR0lEJCwgR05hbWUkLCBWZW5kUHJvZCQsIGNoYXJIZWlnaHQjLCBCcm93c2VOYW1lJCwgVmVyc2lvbiQsIFZlbmRJRCQsIFByb2RJRCRcclxuR2xvYmFsIGJ1dHRvbnNQZXJSb3csIGJ1dHRvblJvd3MsIGF4ZXNQZXJSb3csIGF4aXNSb3dzLCBWZXJzaW9uJFxyXG5HbG9iYWwgVmVuZCQsUHJvZCQsTmFtZSQsY051bSAvLyBCSkYgTmV3IHZlcnNpb24gKGFkZGVkIGNOdW0gMS8xLzIzKVxyXG5cclxuVmVyc2lvbiQ9XCJ2MC45OVwiXHJcbmNOdW09MCAnIERlZmF1bHQgY29udHJvbGxlciBudW1iZXIgdG8gdGVzdCAoMCkgLSBtb3ZlZCB0aGlzIHVwIGhlcmUuICAxLzEvMjNcclxuXHJcbkdldEluZm9bY051bV0gJyBHZXQgR0lEJCwgVmVuZCQsIFByb2QkLCBOYW1lJFxyXG5cclxuR05hbWUkPVwiXCIgOiBWZW5kUHJvZCQ9XCJcIlxyXG5idXR0b25zUGVyUm93PTEzIDogYXhlc1BlclJvdz01IC8vIEhvdyBtYW55IHdpbGwgZml0IGluIGEgNDAgY29sdW1uIGxpbmUgd2lkdGg/ICgxMyw1KVxyXG5cclxuICAvL1xyXG4gLy8gU2V0IHBsYXRmb3JtIHNwZWNpZmljIHRoaW5nc1xyXG4vL1xyXG5JZiBNYW5pZmVzdCQ9XCJhbWlnYVwiXHJcblx0Y2hhckhlaWdodCMgPSBZIEdyYXBoaWMoMSkgJyA4cHhcclxuXHRjaGFyV2lkdGgjICA9IFggR3JhcGhpYygxKSAnIDhweFxyXG5cdC8vIEEgc3RhbmRhcmQgQW1pZ2EgMzIwIHggMjU2IChQQUwpIGRpc3BsYXkgaXMgNDAgY29scyB4IDMyIHJvd3Mgd2l0aCA4eDggcGl4ZWwgY2hhcnMuXHJcblx0U2NyZWVuIE9wZW4gMCwzMjQsMjU2LDMyLExvd3Jlc1xyXG5cdFBhbGV0dGUgJDAwMCwkRkZGLCQ3NzcsJEJCQiwkRjAwLCQwRjAsJDAwRiwkRkYwLCQwRkYsJEYwRlxyXG5FbHNlIC8vIFN0YW5kYXJkIEFPWiBzaXplID0gMjQgeCA0My4yIHBpeGVsc1xyXG5cdGNoYXJXaWR0aCMgPSBYIEdyYXBoaWMoMSkgICcgV2lkdGggb2YgMSBjaGFyXHJcblx0Y2hhckhlaWdodCMgPSBZIEdyYXBoaWMoMSkgJyBIZWlnaHQgb2YgMSBjaGFyXHJcblx0c2NyV2lkdGgjPTk2NiAnIDk2MCBweCBuZWVkZWQgZm9yIDQwIGNvbHVtbnNcclxuXHRzY3JIZWlnaHQjPTEzODMgJyA0My4yIHBpeGVsIGhlaWdodCAqIDMyIGxpbmVzID0gMTM4Mi40IChyb3VuZCB1cCkgV09SS1MhXHJcblx0SWYgc2NySGVpZ2h0IyA+IEludChzY3JIZWlnaHQjKSBUaGVuIHNjckhlaWdodCM9SW50KHNjckhlaWdodCMpKzEgJyBSb3VuZCB1cC5cclxuXHRTY3JlZW4gT3BlbiAwLHNjcldpZHRoIyxzY3JIZWlnaHQjLDMyLExvd3JlcyxsaW5lcz0zMlxyXG5cdFNjcmVlbiBTY2FsZSAxLjUsMC43OFxyXG5cdFBhbGV0dGUgJDAwMDAwMCwkRkZGRkZGLCQ3Nzc3NzcsJEJCQkJCQiwkRkYwMDAwLCQwMEZGMDAsJDAwMDBGRiwkRkZGRjAwLCQwMEZGRkYsJEZGMDBGRlxyXG5FbmQgSWZcclxuXHJcbkFjdGl2YXRlX0dQICcgSW5pdGlhbCBhY3RpdmF0aW9uIG9mIGdhbWVwYWQuXHJcbi8qXHJcblx0VG8gbWFrZSB5b3VyIGpveXN0aWNrIC8gZ2FtZXBhZCBtb3JlIHNlbnNpdGl2ZSwgc2V0IHRoZSB0aHJlc2hvbGQgc21hbGxlcjpcclxuXHRcdEdhbWVwYWQgVGhyZXNob2xkIDAuMSAvLyBDaGFuZ2UgMjAlIGRlZmF1bHQgdG8gMTAlXHJcblxyXG5cdFRvIG1ha2UgeW91ciBqb3lzdGljayAvIGdhbWVwYWQgbGVzcyBzZW5zaXRpdmUsIHNldCB0aGUgdGhyZXNob2xkIGxhcmdlcjpcclxuXHRcdEdhbWVwYWQgVGhyZXNob2xkIDAuMyAvLyBDaGFuZ2UgMjAlIGRlZmF1bHQgdG8gMzAlXHJcbiovXHJcblJlU3RhcnQ6XHJcblx0QnJvd3NlTmFtZSQ9QnJvd3NlciBOYW1lJCAnIENocm9tZVxyXG5cdEdldEluZm9bY051bV1cdC8vIFNldCBWZW5kJCwgUHJvZCQsIE5hbWUkLCBHSUQkXHJcblx0RHJhd1N0YXRpYyAvLyBSZWRyYXcgc3RhdGljIGRpc3BsYXkgZWxlbWVudHMgZm9yIEpveXN0aWNrLlxyXG4gIC8vXHJcbiAvLyBNYWluIFByb2dyYW0gTG9vcFxyXG4vL1xyXG5Eb1xyXG5cclxuXHRJZiBOb3QgR2FtZXBhZCBDb25uZWN0ZWQoY051bSlcdC8vIEhhbmRsZSBKb3lzdGljayBkaXNjb25uZWN0aW9uLlxyXG5cdFx0R2FtZXBhZF9EaXNjb25uZWN0ZWRcclxuXHRcdEdldEluZm9bY051bV1cclxuXHRcdEdhbWVwYWRfQ2hhbmdlZFxyXG5cdEVuZCBJZlxyXG5cclxuXHRJZiAoR0lEJCA8PiBHYW1lcGFkIE5hbWUkKGNOdW0pKSAvLyBIYW5kbGUgSm95c3RpY2sgY2hhbmdlZC5cclxuXHRcdEdldEluZm9bY051bV1cclxuXHRcdEdhbWVwYWRfQ2hhbmdlZFxyXG5cdEVuZCBJZlxyXG5cclxuXHRQZW4gN1xyXG5cdFVQPWpVcChjTnVtKVx0XHRcdFx0OiBET1dOPWpEb3duKGNOdW0pXHJcblx0TEVGVD1qTGVmdChjTnVtKVx0XHRcdDogUklHSFQ9alJpZ2h0KGNOdW0pXHJcblx0VVBMRUZUPWpVcExlZnQoY051bSlcdFx0OiBVUFJJR0hUPWpVcFJpZ2h0KGNOdW0pXHJcblx0RE9XTkxFRlQ9akRvd25MZWZ0KGNOdW0pXHQ6IERPV05SSUdIVD1qRG93blJpZ2h0KGNOdW0pXHJcblxyXG5cdExvY2F0ZSAyMyw0IDogU2hvd19CdXR0b25bVVBdXHJcblx0TG9jYXRlIDIzLDYgOiBTaG93X0J1dHRvbltET1dOXVxyXG5cdExvY2F0ZSAyMSw0IDogU2hvd19CdXR0b25bVVBMRUZUXVxyXG5cdExvY2F0ZSAyMSw1IDogU2hvd19CdXR0b25bTEVGVF1cclxuXHRMb2NhdGUgMjEsNiA6IFNob3dfQnV0dG9uW0RPV05MRUZUXVxyXG5cdExvY2F0ZSAyNSw0IDogU2hvd19CdXR0b25bVVBSSUdIVF1cclxuXHRMb2NhdGUgMjUsNSA6IFNob3dfQnV0dG9uW1JJR0hUXVxyXG5cdExvY2F0ZSAyNSw2IDogU2hvd19CdXR0b25bRE9XTlJJR0hUXVxyXG5cdCAgLy9cclxuXHQgLy8gVGVzdCBGaXJlIEJ1dHRvbnNcclxuXHQvL1xyXG5cdEZJPUZpcmUoY051bSkgOiBGSTI9R2FtZXBhZCBCdXR0b24oY051bSwxKSAnIEJ1dHRvbnMgMCBhbmQgMSBhcmUgdXN1YWxseSBGaXJlIGFuZCBGaXJlMlxyXG5cdFBlbiAyIDogTG9jYXRlIDcsNCA6IFNob3dfQnV0dG9uW0ZJXVxyXG5cdFx0XHRMb2NhdGUgNyw2IDogU2hvd19CdXR0b25bRkkyXVxyXG5cdCAgLy9cclxuXHQgLy8gVGVzdCBBbGwgQnV0dG9uc1xyXG5cdC8vXHJcblx0UGVuIDdcclxuXHRidXR0b25Sb3dzIyA9IEdhbWVwYWQgQnV0dG9ucyhjTnVtKS9idXR0b25zUGVyUm93XHJcblx0YnV0dG9uUm93cz1Sb3VuZFVwKEdhbWVwYWQgQnV0dG9ucyhjTnVtKS9idXR0b25zUGVyUm93KVxyXG5cclxuXHRQZW4gNDogTG9jYXRlIDEsOSA6IFByaW50IFwiQnV0dG9uczogXCI7IDogUGVuIDEgOiBQcmludCBVc2luZyBcIiMjXCI7R2FtZXBhZCBCdXR0b25zKDApIDogUGVuIDdcclxuXHRTaG93X0J1dHRvbl9MYWJlbHNbMV0gJyBPZmZzZXQgdmVydGljYWwgcG9zIGJ5IDFcclxuXHJcblx0Yz0wIDogcj0wXHJcblx0Rm9yIGJ0ID0gMCBUbyBHYW1lcGFkIEJ1dHRvbnMoY051bSktMVxyXG5cdFx0YyA9IGJ0IG1vZCBidXR0b25zUGVyUm93XHJcblx0XHRnYiA9IEdhbWVwYWQgQnV0dG9uKGNOdW0sYnQpXHJcblx0XHRMb2NhdGUgYyozKzEsMTArcioyKzEgOiBTaG93X0J1dHRvbltnYl1cclxuXHRcdElmIChidCBtb2QgYnV0dG9uc1BlclJvdykgPSAoYnV0dG9uc1BlclJvdy0xKSBUaGVuIEluYyByXHJcblx0TmV4dCBidFxyXG5cdCAgLy9cclxuXHQgLy8gVGVzdCBBeGVzXHJcblx0Ly9cclxuXHRheGlzUm93cyA9IFJvdW5kVXAoR2FtZXBhZCBBeGVzKGNOdW0pL2F4ZXNQZXJSb3cpXHJcblx0UGVuIDQ6IExvY2F0ZSAxLDE3IDogUHJpbnQgXCJBeGVzOiBcIjsgOiBQZW4gMSA6IFByaW50IFVzaW5nIFwiIyNcIjtHYW1lcGFkIEF4ZXMoY051bSkgOiBQZW4gN1xyXG5cdFNob3dfQXhpc19MYWJlbHNbNF1cclxuXHJcblx0cj0wIDogYz0wICcgcm93LCBjb2x1bW5cclxuXHRndCMgPSBHYW1lcGFkIFRocmVzaG9sZFxyXG5cdEZvciBheCA9IDAgVG8gR2FtZXBhZCBBeGVzKGNOdW0pLTEgJyBCSkYgLSBXQVMgR2FtZXBhZCBBeGVzKDApLTEnXHJcblx0XHRBeGlzIz1HYW1lcGFkIEF4aXMoY051bSxheClcclxuXHRcdElmIChBYnMoQXhpcyMpIDwgZ3QjKSBUaGVuIFBlbiAyIEVsc2UgUGVuIDdcclxuXHRcdGMgPSBheCBtb2QgYXhlc1BlclJvd1xyXG5cdFx0TG9jYXRlIGMqOCsxLDE1K3IqMis0IDogSWYgQXhpcyMgPiAtMiBUaGVuIFByaW50IFVzaW5nIFwiKyMuIyMjI1wiO0dhbWVwYWQgQXhpcyhjTnVtLGF4KVxyXG5cdFx0SWYgKGF4IG1vZCBheGVzUGVyUm93KT0oYXhlc1BlclJvdy0xKSBUaGVuIEluYyByXHJcblx0XHRXYWl0IFZibFxyXG5cdE5leHQgYXhcclxuXHRXYWl0IFZibFxyXG5cclxuXHRHZXRJbmZvW2NOdW1dXHJcblxyXG5cdFZlbmRQcm9kJD1cIlZlbmRvcjogXCIrVmVuZCQrXCIgUHJvZHVjdDogXCIrUHJvZCRcclxuXHRTaG93X0hlYWRlcltOYW1lJCxWZW5kUHJvZCRdXHJcblx0U2hvd19Gb290ZXJbQnJvd3NlTmFtZSRdXHJcblx0U2hvd19Ob3Rlc1xyXG4vKlxyXG5cdFRPIERPOlxyXG5cclxuXHRreSQ9SW5rZXkkXHJcblx0SWYga3kkPVwiWlwiIFRoZW4gJyBTZXQgQU9aIG1vZGUgJiByZXN0YXJ0IEFwcC5cclxuXHRJZiBreSQ9XCJBXCIgVGhlbiAnIFNldCBBbWlnYSBtb2RlICYgcmVzdGFydCBBcHAuXHJcblx0JyBBbHNvLCBhZGQgYW4gaW5wdXQgYm94IGZvciB0aGUgVGhyZXNoaG9sZCBzZXR0aW5nLlxyXG4qL1xyXG5Mb29wXHJcblxyXG5Hb1RvIFJlU3RhcnRcclxuXHJcblByb2NlZHVyZSBEcmF3U3RhdGljXHJcblx0ICAvL1xyXG5cdCAvLyBTaG93IGxhYmVscyBmb3Igam95c3RpY2sgZGlzcGxheS5cclxuXHQvL1xyXG5cdFBlbiA4XHJcblx0TG9jYXRlIDE0LDMgOiBQcmludCBcImpVcExlZnQgIGpVcCAgalVwUmlnaHRcIlxyXG5cdExvY2F0ZSAxMiw3OiBQcmludCBcImpEb3duTGVmdCBqRG93biBqRG93blJpZ2h0XCJcclxuXHRMb2NhdGUgMTYsNSA6IFByaW50IFwiakxlZnRcIlxyXG5cdExvY2F0ZSAyOCw1IDogUHJpbnQgXCJqUmlnaHRcIlxyXG5cdC8vIEZpcmUgbGFiZWxcclxuXHRMb2NhdGUgMSw0IDogUHJpbnQgXCJGaXJlOlwiXHJcblx0Ly8gR3JheSBzaW5jZSBGaXJlMiBpcyBub3QgYSBjb21tYW5kLlxyXG5cdFBlbiAyXHJcblx0TG9jYXRlIDEsNiA6IFByaW50IFwiRmlyZTI6XCJcclxuRW5kIFByb2NlZHVyZVxyXG5cclxuUHJvY2VkdXJlIEdhbWVwYWRfRGlzY29ubmVjdGVkXHJcblx0Q2xzIDAgOiBGbGFzaCBPZmYgOiBDdXJzIE9mZlxyXG5cdFBlbiAxIDogUGFwZXIgMFxyXG5cdEVkZ2VzXHJcblx0TG9jYXRlIDEsMSA6IENlbnRyZSBcIihHYW1lcGFkIERpc2Nvbm5lY3RlZClcIlxyXG5cdElmIChOb3QgR2FtZVBhZCBDb25uZWN0ZWQoY051bSkpXHJcblx0UmVwZWF0XHJcblx0VW50aWwgR2FtZVBhZCBDb25uZWN0ZWQoY051bSlcclxuXHRFbmQgSWZcclxuXHRMb2NhdGUgMSwxIDogUHJpbnQgU3BhY2UkKDM4KVxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgRWRnZXMgLy8gRHJhdyB2ZXJ0aWNhbCBsaW5lcyBkb3duIGxlZnQgJiByaWdodCBlZGdlcyBvZiBzY3JlZW4uXHJcblx0SSA9IEluayAnIFNhdmUgSW5rXHJcblx0SW5rIDJcclxuXHREcmF3IDAsMCBUbyAwLFNjcmVlbiBIZWlnaHQtMVxyXG5cdERyYXcgU2NyZWVuIFdpZHRoLTEsMCBUbyBTY3JlZW4gV2lkdGgtMSwgU2NyZWVuIEhlaWdodC0xXHJcblx0SW5rIEkgJyBSZXN0b3JlIElua1xyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgQWN0aXZhdGVfR1AgJyBHZXQgaW5pdGlhbCBjbGljayB0byBhY3RpdmF0ZSBnYW1lcGFkLlxyXG5cdENscyAwIDogRmxhc2ggT2ZmIDogQ3VycyBPZmZcclxuXHRQZW4gMSA6IFBhcGVyIDBcclxuXHRFZGdlc1xyXG5cdExvY2F0ZSAxLDEgOiBQcmludCBcIihDbGljayBidXR0b24gb24gY29udHJvbGxlciB0byBzdGFydC4pXCJcclxuXHRJZiAoTm90IEdhbWVQYWQgQ29ubmVjdGVkKDApKVxyXG5cdFx0UmVwZWF0XHJcblx0XHRVbnRpbCBHYW1lUGFkIENvbm5lY3RlZCgwKVxyXG5cdEVuZCBJZlxyXG5cdExvY2F0ZSAxLDEgOiBQcmludCBTcGFjZSQoMzgpXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcblByb2NlZHVyZSBTaG93X05vdGVzXHJcblx0cD1QZW4gJyBTYXZlIFBlblxyXG5cdFBlbiAyXHJcblx0aVN0YXJ0ID0gSW50KFNjcmVlbiBIZWlnaHQvY2hhckhlaWdodCMpLTZcclxuXHRMb2NhdGUgMSxpU3RhcnRcclxuXHRMb2NhdGUgMSxpU3RhcnRcdFx0OiBQcmludCBcIkF4aXMoLDApOi1sZWZ0LCArcmlnaHQgKCwxKTotdXAsICtkb3duXCJcclxuXHRMb2NhdGUgMSxpU3RhcnQrMVx0OiBQcmludCBcIkFcIjsgOiBQZW4gMSA6IFByaW50IFVzaW5nIFwiIyMjLiMjJVwiO0dhbWVwYWQgVGhyZXNob2xkKjEwMFxyXG5cdExvY2F0ZSAxMCxpU3RhcnQrMVx0OiBQZW4gOCA6IFByaW50IFwiR2FtZXBhZCBUaHJlc2hvbGRcIjsgOiBQZW4gMiA6IFByaW50IFwiIHdpbGwgdHJpZ2dlclwiXHJcblx0TG9jYXRlIDEsaVN0YXJ0KzJcdDogUHJpbnQgXCJ0aGUgZGlnaXRhbCBwYWQgZW11bGF0aW9uIGZ1bmN0aW9ucy5cIlxyXG5cdFBlbiBwICcgUmVzdG9yZSBQZW5cclxuRW5kIFByb2NcclxuXHJcblByb2NlZHVyZSBTaG93X0J1dHRvbltiXVxyXG5cdElmIGI9MCBUaGVuIFBlbiAyIEVsc2UgUGVuIDdcclxuXHRQcmludCBVc2luZyBcIi0jXCI7YlxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgU2hvd19CdXR0b25fTGFiZWxzW3lPZnNdXHJcblx0cD1QZW4gJyBTYXZlIFBlblxyXG5cdFBlbiA1XHJcblx0cj0wIDogYz0wXHJcblx0Rm9yIGJ0ID0gMCBUbyBHYW1lcGFkIEJ1dHRvbnMoY051bSktMVxyXG5cdFx0YyA9IGJ0IG1vZCBidXR0b25zUGVyUm93XHJcblx0XHRMb2NhdGUgYyozKzEsOStyKjIreU9mcyA6IFByaW50IFVzaW5nIFwiIyNcIjtidFxyXG5cdFx0SWYgKGJ0IG1vZCBidXR0b25zUGVyUm93KSA9IChidXR0b25zUGVyUm93LTEpIFRoZW4gSW5jIHJcclxuXHROZXh0IGJ0XHJcblx0UGVuIHAgLy8gUmVzdG9yZSBQZW5cclxuRW5kIFByb2NlZHVyZVxyXG5cclxuUHJvY2VkdXJlIFNob3dfQXhpc19MYWJlbHNbeU9mc11cclxuXHRwPVBlbiAnIFNhdmUgUGVuXHJcblx0UGVuIDVcclxuXHRyID0gMCA6IGMgPSAwXHJcblx0Rm9yIGF4ID0gMCBUbyBHYW1lcGFkIEF4ZXMoY051bSktMVxyXG5cdFx0YyA9IGF4IG1vZCBheGVzUGVyUm93XHJcblx0XHRMb2NhdGUgYyo3KzIsMTQrcioyK3lPZnMgOiBQcmludCBVc2luZyBcIiMjIyNcIjtheFxyXG5cdFx0SWYgKGF4IG1vZCBheGVzUGVyUm93KT0oYXhlc1BlclJvdy0xKSBUaGVuIEluYyByXHJcblx0TmV4dCBheFxyXG5cdFBlbiBwIC8vIFJlc3RvcmUgUGVuXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcblByb2NlZHVyZSBHYW1lcGFkX0NoYW5nZWRcclxuXHRDbHMgMCAnIFN0YXJ0IG92ZXIhXHJcblx0RWRnZXNcclxuXHRHTmFtZSQgPSBHSUQkIC8vID1HYW1lcGFkIE5hbWUkKClcclxuXHQgIC8vXHJcblx0IC8vIERlc2NyaWJlIEdhbWVQYWRcclxuXHQvL1xyXG5cdEdOYW1lJD1HYW1lcGFkIE5hbWUkKGNOdW0pIDogQnJvd3NlTmFtZSQgPSBCcm93c2VyIE5hbWUkXHJcblx0SWYgQnJvd3NlTmFtZSQ9XCJGaXJlZm94XCIgT3IgQnJvd3NlTmFtZSQ9XCJTZWFNb25rZXlcIiBPciBCcm93c2VOYW1lJD1cIlNhZmFyaVwiXHJcblx0XHRWRT1JbnN0cihHTmFtZSQsXCItXCIpIC8vIGVuZCBvZiBWZW5kb3IgSURcclxuXHRcdElmIFZFPjBcclxuXHRcdFx0VmVuZG9yJD1MZWZ0JChHTmFtZSQsVkUtMSlcclxuXHRcdFx0VGVtcCQ9UmlnaHQkKEdOYW1lJCxMZW4oR05hbWUkKS1WRSkgLy8gQkpGIERFQlVHISEhICsxIGFkZGVkXHJcblx0XHRcdFBSPUluc3RyKFRlbXAkLFwiLVwiKSAvLyBFbmQgb2YgUHJvZHVjdCBJRFxyXG5cdFx0XHRJZiBQUj4wXHJcblx0XHRcdFx0UHJvZHVjdCQ9TGVmdCQoVGVtcCQsUFItMSkgLy8gQkpGIERFQlVHISEhIC0xIGFkZGVkXHJcblx0XHRcdFx0R05hbWUkPVJpZ2h0JChHTmFtZSQsTGVuKEdOYW1lJCktTGVuKFZlbmRvciQpLUxlbihQcm9kdWN0JCktMilcclxuXHRcdFx0RWxzZVxyXG5cdFx0XHRcdFByb2R1Y3QkPVwiXCJcclxuXHRcdFx0XHRHTmFtZSQ9UmlnaHQkKEdOYW1lJCxMZW4oR05hbWUkKS1WRSlcclxuXHRcdFx0RW5kIElmXHJcblx0XHRFbHNlXHJcblx0XHRcdFZlbmRvciQ9XCJcIiA6IFByb2R1Y3QkPVwiXCJcclxuXHRcdEVuZCBJZlxyXG5cdFx0SWYgTGVuKFByb2R1Y3QkKSA8IDQgVGhlbiBQcm9kdWN0JD1TdHJpbmckKFwiMFwiLDQtTGVuKFByb2R1Y3QkKSkrUHJvZHVjdCRcclxuXHRcdElmIExlbihWZW5kb3IkKSA8IDQgVGhlbiBWZW5kb3IkPVN0cmluZyQoXCIwXCIsNC1MZW4oVmVuZG9yJCkpK1ZlbmRvciRcclxuXHRFbHNlIC8vIENocm9tZSBhbmQgZXZlcnlib2R5IGVsc2VcclxuXHRcdFZlbmRvciQ9XCJcIiA6IFByb2R1Y3QkPVwiXCJcclxuXHRcdFZlbmRQcm9kJD1SaWdodCQoR05hbWUkLExlbihHTmFtZSQpLUluc3RyKEdOYW1lJCxcIihcIikrMSlcclxuXHRcdElmIExlbihWZW5kUHJvZCQpPjNcclxuXHRcdFx0VlM9SW5zdHIoVmVuZFByb2QkLFwiOiBcIikgJyBTdGFydCBvZiBWZW5kb3IgSURcclxuXHRcdFx0VmVuZG9yJD1NaWQkKFZlbmRQcm9kJCxWUysyLDQpXHJcblx0XHRcdFZlbmRQcm9kJD1SaWdodCQoVmVuZFByb2QkLExlbihWZW5kUHJvZCQpLVZTLTYpXHJcblx0XHRcdFBTPUluc3RyKFZlbmRQcm9kJCxcIjogXCIpICcgU3RhcnQgb2YgUHJvZHVjdCBJRFxyXG5cdFx0XHRQcm9kdWN0JD1NaWQkKFZlbmRQcm9kJCxQUysyLDQpXHJcblx0XHRcdElmIExlbihHSUQkKT4wIFRoZW4gR05hbWUkPUxlZnQkKEdJRCQsSW5zdHIoR0lEJCxcIihcIiktMSkgRWxzZSBHTmFtZSQ9R0lEJFxyXG5cdFx0RWxzZVxyXG5cdFx0XHRWZW5kb3IkPVwiXCIgOiBQcm9kdWN0JD1cIlwiXHJcblx0XHRFbmQgSWZcclxuXHRFbmQgSWZcclxuXHRWZW5kUHJvZCQ9XCJWZW5kb3I6IFwiK1ZlbmRvciQrXCIgUHJvZHVjdDogXCIrUHJvZHVjdCRcclxuXHREcmF3U3RhdGljXHJcblx0U2hvd19IZWFkZXJbR05hbWUkLFZlbmRQcm9kJF1cclxuXHRTaG93X0Zvb3RlcltCcm93c2VOYW1lJF1cclxuXHRTaG93X05vdGVzXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcblByb2NlZHVyZSBTaG93X0hlYWRlcltHTmFtZSQsVmVuZFByb2QkXVxyXG5cdGk9SW5rIDogcD1QZW4gJyBTYXZlIFBlbiAmIElua1xyXG5cdCAgLy9cclxuXHQgLy8gQ2xlYXIgdGhlIGhlYWRpbmcgYXJlYS5cclxuXHQvL1xyXG5cdEluayAzICcgZGFyayBncmF5XHJcblx0QmFyIDEsMCBUbyBTY3JlZW4gV2lkdGgtMixjaGFySGVpZ2h0IyoyIC8vIENsZWFyIDFzdCAyIGxpbmVzXHJcblx0ICAvL1xyXG4gIFx0IC8vIFNob3cgaGVhZGluZyB3aXRoIGdhbWVwYWQgTmFtZSwgVmVuZG9yIElEICYgUHJvZHVjdCBJRFxyXG4gIFx0Ly9cclxuXHRQZW4gMyA6IFBhcGVyIDBcclxuXHRJbnZlcnNlIE9uXHJcblx0Ly8gVHJpbSB0cmFpbGluZyBzcGFjZXMgZnJvbSBuYW1lXHJcblx0c3RydD1MZW4oR05hbWUkKVxyXG5cdFdoaWxlIChzdHJ0PjApIEFuZCAoTWlkJChHTmFtZSQsc3RydCwxKT1cIiBcIilcclxuXHRcdERlYyBzdHJ0XHJcblx0V2VuZFxyXG5cdExvY2F0ZSAxLDAgOiBDZW50cmUgTGVmdCQoR05hbWUkLHN0cnQpXHJcblx0TG9jYXRlIDEsMSA6IENlbnRyZSBWZW5kUHJvZCRcclxuXHRJbmsgaSA6IFBlbiBwICcgUmVzdG9yZSBQZW4gJiBJbmtcclxuRW5kIFByb2NlZHVyZVxyXG5cclxuUHJvY2VkdXJlIFNob3dfRm9vdGVyW0Jyb3dzZU5hbWUkXVxyXG5cdGk9SW5rIDogcD1QZW4gJyBTYXZlIFBlbiAmIElua1xyXG5cdCAgLy9cclxuXHQgLy8gQ2xlYXIgdGhlIGZvb3RlciBhcmVhLlxyXG5cdC8vXHJcblx0SW5rIDMgOiBTSCA9IFNjcmVlbiBIZWlnaHQgOiBTVyA9IFNjcmVlbiBXaWR0aFxyXG5cdEJhciAxLFNILWNoYXJIZWlnaHQjIFRvIFNXLTIsU0gtY2hhckhlaWdodCMqM1xyXG5cdCAgLy9cclxuXHQgLy8gU2hvdyBmb290ZXIgd2l0aCBicm93ZXJzIG5hbWVcclxuXHQvL1xyXG5cdFBlbiAzICcgTGlnaHQgZ3JheVxyXG5cdEludmVyc2UgT25cclxuXHRMb2NhdGUgMSxJbnQoU0gvY2hhckhlaWdodCMpLTMgOiBDZW50cmUgXCJHYW1lcGFkL0pveXN0aWNrIFRlc3RlciBcIitWZXJzaW9uJFxyXG5cdExvY2F0ZSAxLEludChTSC9jaGFySGVpZ2h0IyktMiA6IENlbnRyZSBcIlNob3dzIHVwIHRvXCIrU3RyJChidXR0b25zUGVyUm93KjMpK1wiIGJ1dHRvbnMgJlwiK1N0ciQoYXhlc1BlclJvdyo0KStcIiBheGVzLlwiXHJcblx0SW52ZXJzZSBPZmYgOiBQZW4gOSAnIE1hZ2VudGFcclxuXHRMb2NhdGUgMCxJbnQoU0gvY2hhckhlaWdodCMpLTEgOiBQcmludCBcIkJyb3dzZXI6IFwiO0Jyb3dzZU5hbWUkO1xyXG5cdE1GJCA9IFwiTWFuaWZlc3Q6IFwiK01hbmlmZXN0JCAgIDogTG9jYXRlIDQwLUxlbihNRiQpLTEgOiBQcmludCBNRiQ7XHJcblx0SW5rIGkgOiBQZW4gcCAnIFJlc3RvcmUgUGVuICYgSW5rXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcbkZ1bmN0aW9uIFwiVmVuZG9ySUQkXCIsX25cclxuXHRWSUQkPVwiXCJcclxuXHRHJD1HYW1lcGFkIE5hbWUkKF9uKVxyXG5cdFZTPUluc3RyKEckLFwiVmVuZG9yOiBcIilcclxuXHRJZiBWUz4wIC8vIENocm9tZS9FZGdlL09wZXJhL0JyYXZlXHJcblx0XHRWUz1WUys4XHJcblx0XHRWRT1JbnN0cihHJCxcIiBcIixWUylcclxuXHRcdElmIFZFPjBcclxuXHRcdFx0VklEJD1NaWQkKEckLFZTLFZFLVZTKzEpXHJcblx0XHRFbHNlXHJcblx0XHRcdFZJRCQ9UmlnaHQkKEckLFZTKVxyXG5cdFx0RW5kIElmXHJcblx0RWxzZSAvLyBGaXJlZm94L1NlYU1vbmtleS9TYWZhcmlcclxuXHRcdFZFPUluc3RyKEckLFwiLVwiKVxyXG5cdFx0SWYgVkU+MFxyXG5cdFx0XHRWSUQkPUxlZnQkKEckLFZFLTEpXHJcblx0XHRFbHNlXHJcblx0XHRcdFZJRCQ9RyRcclxuXHRcdEVuZCBJZlxyXG5cdEVuZCBJZlxyXG5FbmQgRnVuY3Rpb24oVklEJClcclxuXHJcbkZ1bmN0aW9uIFwiUHJvZHVjdElEJFwiLF9uXHJcblx0UElEJD1cIlwiXHJcblx0RyQ9R2FtZXBhZCBOYW1lJChfbilcclxuXHRQUz1JbnN0cihHJCxcIlByb2R1Y3Q6IFwiKVxyXG5cdElmIFBTPjAgLy8gQ2hyb21lLEVkZ2UsQnJhdmUsT3BlcmFcclxuXHRcdFBTPVBTKzlcclxuXHRcdFBFPUluc3RyKEckLFwiKVwiKVxyXG5cdFx0SWYgUEU+MFxyXG5cdFx0XHRQSUQkPU1pZCQoRyQsUFMsTGVuKEckKS1QUylcclxuXHRcdEVsc2VcclxuXHRcdFx0UElEJD1SaWdodCQoRyQsTGVuKEckKS1QUylcclxuXHRcdEVuZCBJZlxyXG5cdEVsc2UgLy8gRmlyZWZveCxTZWFtb25rZXksU2FmYXJpXHJcblx0XHRQUz1JbnN0cihHJCxcIi1cIilcclxuXHRcdElmIFBTPjBcclxuXHRcdFx0UFM9UFMrMVxyXG5cdFx0XHRQRT1JbnN0cihHJCxcIi1cIixQUylcclxuXHRcdFx0SWYgUEU+MFxyXG5cdFx0XHRcdFBJRCQ9TWlkJChHJCxQUywoUEUtUFMpKVxyXG5cdFx0XHRFbHNlXHJcblx0XHRcdFx0UElEJD1SaWdodCQoRyQsUFMpXHJcblx0XHRcdEVuZCBJZlxyXG5cdFx0RWxzZVxyXG5cdFx0XHRQSUQkPUckXHJcblx0XHRFbmQgSWZcclxuXHRFbmQgSWZcclxuRW5kIEZ1bmN0aW9uKFBJRCQpXHJcblxyXG5GdW5jdGlvbiBHYW1lcGFkTmFtZSQsX25cclxuXHRnTmFtZSQ9XCJcIlxyXG5cdEckPUdhbWVwYWQgTmFtZSQoX24pXHJcblx0UFM9SW5zdHIoRyQsXCIgKFwiKVxyXG5cdElmIFBTID4gMFx0Ly8gQ2hyb21lLCBFZGdlLCBCcmF2ZSwgT3BlcmEsIFZpdmFsZGlcclxuXHRcdGdOYW1lJD1MZWZ0JChHJCxQUy0xKVxyXG5cdEVsc2UgLy8gRmlyZWZveCwgU2VhbW9ua2V5LCBTYWZhcmlcclxuXHRcdFZQRT1JbnN0cihHJCxcIi1cIilcclxuXHRcdElmIFZQRT4wXHJcblx0XHRcdFZQRT1JbnN0cihHJCxcIi1cIixWUEUrMSlcclxuXHRcdFx0SWYgVlBFPjBcclxuXHRcdFx0XHRnTmFtZSQ9UmlnaHQkKEckLExlbihHJCktVlBFKVxyXG5cdFx0XHRFbHNlXHJcblx0XHRcdFx0Z05hbWUkPUckXHJcblx0XHRcdEVuZCBJZlxyXG5cdFx0RWxzZVxyXG5cdFx0XHRnTmFtZSQ9RyRcclxuXHRcdEVuZCBJZlxyXG5cdEVuZCBJZlxyXG5FbmQgRnVuY3Rpb24oZ05hbWUkKVxyXG5cclxuRnVuY3Rpb24gXCJSb3VuZFVwXCIsIF9uIyAnIHJlLXdyb3RlIGZ1bmN0aW9uIHdpdGhvdXQgSmF2YVNjcmlwdCBjYWxsXHJcblx0aSA9IEludChfbiMpXHJcblx0cmVzdWx0Iz1pXHJcblx0SWYgX24jLWkgPiAwXHJcblx0XHRyZXN1bHQjPWkrMVxyXG5cdEVuZCBJZlxyXG5FbmQgRnVuY3Rpb24ocmVzdWx0IylcclxuXHJcbi8qXHJcbkZ1bmN0aW9uIFwiUm91bmRVcFwiLCBfbiMgLy8gVGhpcyB1c2VkIHRvIHdvcmssIGJ1dCBubyBtb3JlLlxyXG5FbmQgRnVuY3Rpb24gKCBJbnQoIHsgTWF0aC5jZWlsKHRoaXMudmFycy5fbl8pIH0gKSlcclxuKi9cclxuXHJcblByb2NlZHVyZSBHZXRJbmZvW2NdICcgU2V0IEdhbWVwYWQgSW5mbyBkeW5hbWljYWxseVxyXG4nIGMgPSBjb250cm9sbGVyIElELiAgQ2hhbmdlZCB2YXJpYWJsZSBuYW1lIHRvIGVuc3VyZSBubyBjb25mbGljdCAxLzEvMjAyM1xyXG5cdEdJRCQ9R2FtZXBhZCBOYW1lJChjKVxyXG5cdFZlbmQkID0gVmVuZG9ySUQkKGMpXHJcblx0UHJvZCQgPSBQcm9kdWN0SUQkKGMpXHJcblx0TmFtZSQgPSBHYW1lcGFkTmFtZSQoYylcclxuRW5kIFByb2NlZHVyZVxyXG5cbmNsYXBmaW5cbiIsIm51bWJlciI6MCwicGFyZW50IjpudWxsLCJvZmZzZXRMaW5lcyI6MH1d')),
		localTags: JSON.parse(atob('e30=')),
		globalTags: JSON.parse(atob('e30=')),
		developerMode: false,
		gotoDirectMode: false,
		useSounds: false,
		loadFilesAfter: JSON.parse(atob('W10='))
	};
	this.aoz=new AOZ(canvasId,options, 'iAjOkZ');
	this.vars = ( typeof args == 'undefined' ? {} : args );
	this.procParam$='';
	this.procParam=0;
	this.objects={};
	// Compiled program begins here
	// ----------------------------
	this.vars.GID$="";
	this.vars.GName$="";
	this.vars.VendProd$="";
	this.vars.charHeight_f=0.0;
	this.vars.BrowseName$="";
	this.vars.Version$="";
	this.vars.VendID$="";
	this.vars.ProdID$="";
	this.vars.buttonsPerRow=0;
	this.vars.buttonRows=0;
	this.vars.axesPerRow=0;
	this.vars.axisRows=0;
	this.vars.Vend$="";
	this.vars.Prod$="";
	this.vars.Name$="";
	this.vars.cNum=0;
	this.vars.charWidth_f=0.0;
	this.vars.scrWidth_f=0.0;
	this.vars.scrHeight_f=0.0;
	this.vars.UP=0;
	this.vars.DOWN=0;
	this.vars.LEFT=0;
	this.vars.RIGHT=0;
	this.vars.UPLEFT=0;
	this.vars.UPRIGHT=0;
	this.vars.DOWNLEFT=0;
	this.vars.DOWNRIGHT=0;
	this.vars.FI=0;
	this.vars.FI2=0;
	this.vars.buttonRows_f=0.0;
	this.vars.c=0;
	this.vars.r=0;
	this.vars.bt=0;
	this.vars.gb=0;
	this.vars.gt_f=0.0;
	this.vars.ax=0;
	this.vars.Axis_f=0.0;
	this.infoGlobals=
	{	
		gid$:this.aoz.varPtr('{"variable":{"name":"GID$","token":"gid$","tokenCode":"GID$","codeInit":"","nameReal":"GID$","nameRealLower":"gid$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":11,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		gname$:this.aoz.varPtr('{"variable":{"name":"GName$","token":"gname$","tokenCode":"GName$","codeInit":"","nameReal":"GName$","nameRealLower":"gname$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":12,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		vendprod$:this.aoz.varPtr('{"variable":{"name":"VendProd$","token":"vendprod$","tokenCode":"VendProd$","codeInit":"","nameReal":"VendProd$","nameRealLower":"vendprod$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":13,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		charheight_f:this.aoz.varPtr('{"variable":{"name":"charHeight_f","token":"charheight_f","tokenCode":"charHeight_f","codeInit":"","nameReal":"charHeight#","nameRealLower":"charheight#","type":"float","numberType":"1","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":14,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		browsename$:this.aoz.varPtr('{"variable":{"name":"BrowseName$","token":"browsename$","tokenCode":"BrowseName$","codeInit":"","nameReal":"BrowseName$","nameRealLower":"browsename$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":15,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		version$:this.aoz.varPtr('{"variable":{"name":"Version$","token":"version$","tokenCode":"Version$","codeInit":"","nameReal":"Version$","nameRealLower":"version$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":16,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		vendid$:this.aoz.varPtr('{"variable":{"name":"VendID$","token":"vendid$","tokenCode":"VendID$","codeInit":"","nameReal":"VendID$","nameRealLower":"vendid$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":false,"nonDimensionned":false,"index":17,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		prodid$:this.aoz.varPtr('{"variable":{"name":"ProdID$","token":"prodid$","tokenCode":"ProdID$","codeInit":"","nameReal":"ProdID$","nameRealLower":"prodid$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":false,"nonDimensionned":false,"index":18,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		buttonsperrow:this.aoz.varPtr('{"variable":{"name":"buttonsPerRow","token":"buttonsperrow","tokenCode":"buttonsPerRow","codeInit":"","nameReal":"buttonsPerRow","nameRealLower":"buttonsperrow","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":19,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		buttonrows:this.aoz.varPtr('{"variable":{"name":"buttonRows","token":"buttonrows","tokenCode":"buttonRows","codeInit":"","nameReal":"buttonRows","nameRealLower":"buttonrows","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":20,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		axesperrow:this.aoz.varPtr('{"variable":{"name":"axesPerRow","token":"axesperrow","tokenCode":"axesPerRow","codeInit":"","nameReal":"axesPerRow","nameRealLower":"axesperrow","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":21,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		axisrows:this.aoz.varPtr('{"variable":{"name":"axisRows","token":"axisrows","tokenCode":"axisRows","codeInit":"","nameReal":"axisRows","nameRealLower":"axisrows","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":22,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		vend$:this.aoz.varPtr('{"variable":{"name":"Vend$","token":"vend$","tokenCode":"Vend$","codeInit":"","nameReal":"Vend$","nameRealLower":"vend$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":23,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		prod$:this.aoz.varPtr('{"variable":{"name":"Prod$","token":"prod$","tokenCode":"Prod$","codeInit":"","nameReal":"Prod$","nameRealLower":"prod$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":24,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		name$:this.aoz.varPtr('{"variable":{"name":"Name$","token":"name$","tokenCode":"Name$","codeInit":"","nameReal":"Name$","nameRealLower":"name$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":25,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		cnum:this.aoz.varPtr('{"variable":{"name":"cNum","token":"cnum","tokenCode":"cNum","codeInit":"","nameReal":"cNum","nameRealLower":"cnum","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":26,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
	};
	this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/Accessories/AOZ Tools/joystick_tester/joystick.aoz
		aoz.sourcePos="0:38:0";
		vars.Version$="v0.99";
		// cNum=0 ' Default controller number to test (0) - moved this up here.  1/1/23
		aoz.sourcePos="0:39:0";
		vars.cNum=0;
		// GetInfo[cNum] ' Get GID$, Vend$, Prod$, Name$
		aoz.sourcePos="0:41:0";
		return{type:4,procedure:"getinfo",args:{c:vars.cNum}};
	};
	this.blocks[1]=function(aoz,vars)
	{
		// GName$="" : VendProd$=""
		aoz.sourcePos="0:43:0";
		vars.GName$="";
		aoz.sourcePos="0:43:12";
		vars.VendProd$="";
		// buttonsPerRow=13 : axesPerRow=5 // How many will fit in a 40 column line width? (13,5)
		aoz.sourcePos="0:44:0";
		vars.buttonsPerRow=13;
		aoz.sourcePos="0:44:19";
		vars.axesPerRow=5;
		// If Manifest$="amiga"
		aoz.sourcePos="0:49:0";
		if(!((aoz.manifest.compilation.platform  )==("amiga")))
			return{type:1,label:4};
	};
	this.blocks[2]=function(aoz,vars)
	{
		// charHeight# = Y Graphic(1) ' 8px
		aoz.sourcePos="0:50:4";
		vars.charHeight_f=aoz.currentScreen.currentTextWindow.yGraphic(1);
		// charWidth#  = X Graphic(1) ' 8px
		aoz.sourcePos="0:51:4";
		vars.charWidth_f=aoz.currentScreen.currentTextWindow.xGraphic(1);
		// Screen Open 0,324,256,32,Lowres
		aoz.sourcePos="0:53:4";
		aoz.screenOpen(
		{
			index:0,
			width:324,
			height:256,
			depth:undefined,
			numberOfColors:32,
			pixelMode:0,
			palette:undefined,
			lines:undefined,
			border:undefined,
			x:undefined,
			y:undefined,
			z:undefined,
			hotspotX:undefined,
			hotspotY:undefined,
			hotspotZ:undefined,
			offsetX:undefined,
			offsetY:undefined,
			offsetZ:undefined,
			skewX:undefined,
			skewY:undefined,
			skewZ:undefined,
			scaleX:undefined,
			scaleY:undefined,
			scaleZ:undefined,
			angle:undefined,
			alpha:undefined,
			visible:undefined,
			sceneID:undefined,
			gravity:undefined,
			skyType: undefined,
			sky: undefined,
			skyRed: undefined,
			skyGreen: undefined,
			skyBlue: undefined,
			skyColor: undefined,
			ambientColor: undefined,
			ambientIntensity: undefined,
			helpers: undefined,
			helperGrid: undefined,
			helperAxis: undefined,
			helperGround: undefined,
			helperPhysics: undefined,
			alwaysOnTop: undefined,
		}, undefined);
		return true;
	};
	this.blocks[3]=function(aoz,vars)
	{
		// Palette $000,$FFF,$777,$BBB,$F00,$0F0,$00F,$FF0,$0FF,$F0F
		aoz.sourcePos="0:54:4";
		aoz.currentScreen.setPalette([0x000,0xFFF,0x777,0xBBB,0xF00,0x0F0,0x00F,0xFF0,0x0FF,0xF0F],"#noremap");
		// Else // Standard AOZ size = 24 x 43.2 pixels
		return{type:1,label:8};
	};
	this.blocks[4]=function(aoz,vars)
	{
		// charWidth# = X Graphic(1)  ' Width of 1 char
		aoz.sourcePos="0:56:4";
		vars.charWidth_f=aoz.currentScreen.currentTextWindow.xGraphic(1);
		// charHeight# = Y Graphic(1) ' Height of 1 char
		aoz.sourcePos="0:57:4";
		vars.charHeight_f=aoz.currentScreen.currentTextWindow.yGraphic(1);
		// scrWidth#=966 ' 960 px needed for 40 columns
		aoz.sourcePos="0:58:4";
		vars.scrWidth_f=966;
		// scrHeight#=1383 ' 43.2 pixel height * 32 lines = 1382.4 (round up) WORKS!
		aoz.sourcePos="0:59:4";
		vars.scrHeight_f=1383;
		// If scrHeight# > Int(scrHeight#) Then scrHeight#=Int(scrHeight#)+1 ' Round up.
		aoz.sourcePos="0:60:4";
		if(!((vars.scrHeight_f)>(aoz.fp2Int(vars.scrHeight_f) )))
			return{type:1,label:6};
	};
	this.blocks[5]=function(aoz,vars)
	{
		aoz.sourcePos="0:60:41";
		vars.scrHeight_f=aoz.fp2Int(vars.scrHeight_f) +1;
	};
	this.blocks[6]=function(aoz,vars)
	{
		// Screen Open 0,scrWidth#,scrHeight#,32,Lowres,lines=32
		aoz.sourcePos="0:61:4";
		aoz.screenOpen(
		{
			index:0,
			width:vars.scrWidth_f,
			height:vars.scrHeight_f,
			depth:undefined,
			numberOfColors:32,
			pixelMode:0,
			palette:undefined,
			lines:32,
			border:undefined,
			x:undefined,
			y:undefined,
			z:undefined,
			hotspotX:undefined,
			hotspotY:undefined,
			hotspotZ:undefined,
			offsetX:undefined,
			offsetY:undefined,
			offsetZ:undefined,
			skewX:undefined,
			skewY:undefined,
			skewZ:undefined,
			scaleX:undefined,
			scaleY:undefined,
			scaleZ:undefined,
			angle:undefined,
			alpha:undefined,
			visible:undefined,
			sceneID:undefined,
			gravity:undefined,
			skyType: undefined,
			sky: undefined,
			skyRed: undefined,
			skyGreen: undefined,
			skyBlue: undefined,
			skyColor: undefined,
			ambientColor: undefined,
			ambientIntensity: undefined,
			helpers: undefined,
			helperGrid: undefined,
			helperAxis: undefined,
			helperGround: undefined,
			helperPhysics: undefined,
			alwaysOnTop: undefined,
		}, undefined);
		return true;
	};
	this.blocks[7]=function(aoz,vars)
	{
		// Screen Scale 1.5,0.78
		aoz.sourcePos="0:62:4";
		aoz.currentScreen.setScale({x:1.5,y:0.78},'#update');
		// Palette $000000,$FFFFFF,$777777,$BBBBBB,$FF0000,$00FF00,$0000FF,$FFFF00,$00FFFF,$FF00FF
		aoz.sourcePos="0:63:4";
		aoz.currentScreen.setPalette([0x000000,0xFFFFFF,0x777777,0xBBBBBB,0xFF0000,0x00FF00,0x0000FF,0xFFFF00,0x00FFFF,0xFF00FF],"#noremap");
		// End If
		aoz.sourcePos="0:64:0";
	};
	this.blocks[8]=function(aoz,vars)
	{
		// Activate_GP ' Initial activation of gamepad.
		aoz.sourcePos="0:66:0";
		return{type:4,procedure:"activate_gp",args:{}};
	};
	this.blocks[9]=function(aoz,vars)
	{
		// BrowseName$=Browser Name$ ' Chrome
		aoz.sourcePos="0:75:4";
			var UA=navigator.userAgent;
			var result = UA; // If unrecognized, return entire userAgent so user can write their own detection.
			 var ua=UA.toLowerCase();
			 isMSIE=			ua.indexOf('msie') >=0;		// Internet Explorer 8-10
			 isExplorer=		ua.indexOf('explorer') >=0;	// Internet Explorer 11
			 isEdge=			ua.indexOf(' edg\/') >= 0;
			 isFirefox=		ua.indexOf('firefox') >= 0;
			 isOpera=		ua.indexOf(' opr\/') >= 0;
			 isChromium=		ua.indexOf(' chromium') >=0;	// Windows, OS/X, Linux, Android
			 isMaxthon=		ua.indexOf(' maxthon') >=0;	// Maxthon SHOULD WE BLOCK IT, or at least WARN the user about it?!  (Major security issue!)
			 isChrome=		ua.indexOf('chrome') >= 0 && ua.indexOf(' opr\/') < 0 && ua.indexOf(' edg\/') < 0;
			 isSafari=		ua.indexOf('safari\/') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf(' opr\/') < 0;
			isSeamonkey=	ua.indexOf(' seamonkey') >=0;
			 isMidori=		ua.indexOf(' midori') >=0;
			 isKonquerer=	ua.indexOf(' konquerer') >=0;
			 isPaleMoon=		ua.indexOf(' palemoon') >=0;
			 isFalkon=		ua.indexOf(' falkon') >=0;
			 isW3M=			ua.indexOf('w3m') >=0;
			isOperaMini=	ua.indexOf(' opera mini') >=0;	// Android & Blackberry
			isUCBrowser=	ua.indexOf('ucbrowser') >=0;	// Android
			 if (isMSIE)			result='MSIE'; // 8-10
			 if (isExplorer)		result='Explorer'; // 11
			 if (isEdge)			result='Edge';
			 if (isFirefox)		result='Firefox';
			 if (isOpera)		result='Opera';
			 if (isChromium) 	result='Chromium';
			 if (isMaxthon)		result='Maxthon';
			 if (isSafari)		result='Safari';
			 if (isChrome)		result='Chrome';
			 if (isSeamonkey)	result='Seamonkey';
			 if (isMidori)		result='Midori';
			 if (isKonquerer)	result='Konquerer';
			 if (isPaleMoon)		result='Pale Moon';
			if (isFalkon)		result='Falkon';	
			 if (isW3M)			result='W3M';
			if (isUCBrowser)	result='UCBrowser';	// Android
			if (isOperaMini)	result='Opera Mini';	// Android & Blackberry
		vars.BrowseName$=result ;
		// GetInfo[cNum]	// Set Vend$, Prod$, Name$, GID$
		aoz.sourcePos="0:76:4";
		return{type:4,procedure:"getinfo",args:{c:vars.cNum}};
	};
	this.blocks[10]=function(aoz,vars)
	{
		// DrawStatic // Redraw static display elements for Joystick.
		aoz.sourcePos="0:77:4";
		return{type:4,procedure:"drawstatic",args:{}};
	};
	this.blocks[11]=function(aoz,vars)
	{
		// Do
		aoz.sourcePos="0:81:0";
	};
	this.blocks[12]=function(aoz,vars)
	{
		// If Not Gamepad Connected(cNum)	// Handle Joystick disconnection.
		aoz.sourcePos="0:83:4";
		if(!(!(aoz.gamepadConnected(vars.cNum) )))
			return{type:1,label:17};
	};
	this.blocks[13]=function(aoz,vars)
	{
		// Gamepad_Disconnected
		aoz.sourcePos="0:84:8";
		return{type:4,procedure:"gamepad_disconnected",args:{}};
	};
	this.blocks[14]=function(aoz,vars)
	{
		// GetInfo[cNum]
		aoz.sourcePos="0:85:8";
		return{type:4,procedure:"getinfo",args:{c:vars.cNum}};
	};
	this.blocks[15]=function(aoz,vars)
	{
		// Gamepad_Changed
		aoz.sourcePos="0:86:8";
		return{type:4,procedure:"gamepad_changed",args:{}};
	};
	this.blocks[16]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:87:4";
	};
	this.blocks[17]=function(aoz,vars)
	{
		// If (GID$ <> Gamepad Name$(cNum)) // Handle Joystick changed.
		aoz.sourcePos="0:89:4";
			result = aoz.gamepadName$(vars.cNum);
		if(!(((vars.GID$)!=(result ))))
			return{type:1,label:21};
	};
	this.blocks[18]=function(aoz,vars)
	{
		// GetInfo[cNum]
		aoz.sourcePos="0:90:8";
		return{type:4,procedure:"getinfo",args:{c:vars.cNum}};
	};
	this.blocks[19]=function(aoz,vars)
	{
		// Gamepad_Changed
		aoz.sourcePos="0:91:8";
		return{type:4,procedure:"gamepad_changed",args:{}};
	};
	this.blocks[20]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:92:4";
	};
	this.blocks[21]=function(aoz,vars)
	{
		// Pen 7
		aoz.sourcePos="0:94:4";
		aoz.currentScreen.currentTextWindow.setPen(7);
		// UP=jUp(cNum)				: DOWN=jDown(cNum)
		aoz.sourcePos="0:95:4";
		vars.UP=aoz.fp2Int(aoz.jUp(vars.cNum) );
		aoz.sourcePos="0:95:34";
		vars.DOWN=aoz.fp2Int(aoz.jDown(vars.cNum) );
		// LEFT=jLeft(cNum)			: RIGHT=jRight(cNum)
		aoz.sourcePos="0:96:4";
		vars.LEFT=aoz.fp2Int(aoz.jLeft(vars.cNum) );
		aoz.sourcePos="0:96:34";
		vars.RIGHT=aoz.fp2Int(aoz.jRight(vars.cNum) );
		// UPLEFT=jUpLeft(cNum)		: UPRIGHT=jUpRight(cNum)
		aoz.sourcePos="0:97:4";
		vars.UPLEFT=aoz.fp2Int(aoz.jUpLeft(vars.cNum) );
		aoz.sourcePos="0:97:34";
		vars.UPRIGHT=aoz.fp2Int(aoz.jUpRight(vars.cNum) );
		// DOWNLEFT=jDownLeft(cNum)	: DOWNRIGHT=jDownRight(cNum)
		aoz.sourcePos="0:98:4";
		vars.DOWNLEFT=aoz.fp2Int(aoz.jDownLeft(vars.cNum) );
		aoz.sourcePos="0:98:34";
		vars.DOWNRIGHT=aoz.fp2Int(aoz.jDownRight(vars.cNum) );
		// Locate 23,4 : Show_Button[UP]
		aoz.sourcePos="0:100:4";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:4});
		aoz.sourcePos="0:100:18";
		return{type:4,procedure:"show_button",args:{b:vars.UP}};
	};
	this.blocks[22]=function(aoz,vars)
	{
		// Locate 23,6 : Show_Button[DOWN]
		aoz.sourcePos="0:101:4";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:6});
		aoz.sourcePos="0:101:18";
		return{type:4,procedure:"show_button",args:{b:vars.DOWN}};
	};
	this.blocks[23]=function(aoz,vars)
	{
		// Locate 21,4 : Show_Button[UPLEFT]
		aoz.sourcePos="0:102:4";
		aoz.currentScreen.currentTextWindow.locate({x:21,y:4});
		aoz.sourcePos="0:102:18";
		return{type:4,procedure:"show_button",args:{b:vars.UPLEFT}};
	};
	this.blocks[24]=function(aoz,vars)
	{
		// Locate 21,5 : Show_Button[LEFT]
		aoz.sourcePos="0:103:4";
		aoz.currentScreen.currentTextWindow.locate({x:21,y:5});
		aoz.sourcePos="0:103:18";
		return{type:4,procedure:"show_button",args:{b:vars.LEFT}};
	};
	this.blocks[25]=function(aoz,vars)
	{
		// Locate 21,6 : Show_Button[DOWNLEFT]
		aoz.sourcePos="0:104:4";
		aoz.currentScreen.currentTextWindow.locate({x:21,y:6});
		aoz.sourcePos="0:104:18";
		return{type:4,procedure:"show_button",args:{b:vars.DOWNLEFT}};
	};
	this.blocks[26]=function(aoz,vars)
	{
		// Locate 25,4 : Show_Button[UPRIGHT]
		aoz.sourcePos="0:105:4";
		aoz.currentScreen.currentTextWindow.locate({x:25,y:4});
		aoz.sourcePos="0:105:18";
		return{type:4,procedure:"show_button",args:{b:vars.UPRIGHT}};
	};
	this.blocks[27]=function(aoz,vars)
	{
		// Locate 25,5 : Show_Button[RIGHT]
		aoz.sourcePos="0:106:4";
		aoz.currentScreen.currentTextWindow.locate({x:25,y:5});
		aoz.sourcePos="0:106:18";
		return{type:4,procedure:"show_button",args:{b:vars.RIGHT}};
	};
	this.blocks[28]=function(aoz,vars)
	{
		// Locate 25,6 : Show_Button[DOWNRIGHT]
		aoz.sourcePos="0:107:4";
		aoz.currentScreen.currentTextWindow.locate({x:25,y:6});
		aoz.sourcePos="0:107:18";
		return{type:4,procedure:"show_button",args:{b:vars.DOWNRIGHT}};
	};
	this.blocks[29]=function(aoz,vars)
	{
		// FI=Fire(cNum) : FI2=Gamepad Button(cNum,1) ' Buttons 0 and 1 are usually Fire and Fire2
		aoz.sourcePos="0:111:4";
		vars.FI=aoz.fp2Int(aoz.fire(vars.cNum) );
		aoz.sourcePos="0:111:20";
		vars.FI2=aoz.fp2Int(aoz.gamepadButton(vars.cNum, 1));
		// Pen 2 : Locate 7,4 : Show_Button[FI]
		aoz.sourcePos="0:112:4";
		aoz.currentScreen.currentTextWindow.setPen(2);
		aoz.sourcePos="0:112:12";
		aoz.currentScreen.currentTextWindow.locate({x:7,y:4});
		aoz.sourcePos="0:112:25";
		return{type:4,procedure:"show_button",args:{b:vars.FI}};
	};
	this.blocks[30]=function(aoz,vars)
	{
		// Locate 7,6 : Show_Button[FI2]
		aoz.sourcePos="0:113:12";
		aoz.currentScreen.currentTextWindow.locate({x:7,y:6});
		aoz.sourcePos="0:113:25";
		return{type:4,procedure:"show_button",args:{b:vars.FI2}};
	};
	this.blocks[31]=function(aoz,vars)
	{
		// Pen 7
		aoz.sourcePos="0:117:4";
		aoz.currentScreen.currentTextWindow.setPen(7);
		// buttonRows# = Gamepad Buttons(cNum)/buttonsPerRow
		aoz.sourcePos="0:118:4";
		vars.buttonRows_f=aoz.checkNumber(aoz.gamepadNumButtons(vars.cNum) /vars.buttonsPerRow);
		// buttonRows=RoundUp(Gamepad Buttons(cNum)/buttonsPerRow)
		aoz.sourcePos="0:119:4";
		return{type:11,instruction:"roundup",result:0,args:{_n_f:aoz.checkNumber(aoz.gamepadNumButtons(vars.cNum) /vars.buttonsPerRow)}};
	};
	this.blocks[32]=function(aoz,vars)
	{
		vars.buttonRows=aoz.fp2Int(this.results[0]);
		// Pen 4: Locate 1,9 : Print "Buttons: "; : Pen 1 : Print Using "##";Gamepad Buttons(0) : Pen 7
		aoz.sourcePos="0:121:4";
		aoz.currentScreen.currentTextWindow.setPen(4);
		aoz.sourcePos="0:121:11";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:9});
		aoz.sourcePos="0:121:24";
		aoz.currentScreen.currentTextWindow.print("Buttons: ",false);
		aoz.sourcePos="0:121:45";
		aoz.currentScreen.currentTextWindow.setPen(1);
		aoz.sourcePos="0:121:53";
		aoz.currentScreen.currentTextWindow.printUsing("##",[aoz.gamepadNumButtons(0) ],".");
		aoz.sourcePos="0:121:91";
		aoz.currentScreen.currentTextWindow.setPen(7);
		// Show_Button_Labels[1] ' Offset vertical pos by 1
		aoz.sourcePos="0:122:4";
		return{type:4,procedure:"show_button_labels",args:{yOfs:1}};
	};
	this.blocks[33]=function(aoz,vars)
	{
		// c=0 : r=0
		aoz.sourcePos="0:124:4";
		vars.c=0;
		aoz.sourcePos="0:124:10";
		vars.r=0;
		// For bt = 0 To Gamepad Buttons(cNum)-1
		aoz.sourcePos="0:125:4";
		vars.bt=0;
	};
	this.blocks[34]=function(aoz,vars)
	{
		// c = bt mod buttonsPerRow
		aoz.sourcePos="0:126:8";
		vars.c=aoz.fp2Int((vars.bt)%(vars.buttonsPerRow));
		// gb = Gamepad Button(cNum,bt)
		aoz.sourcePos="0:127:8";
		vars.gb=aoz.fp2Int(aoz.gamepadButton(vars.cNum, vars.bt));
		// Locate c*3+1,10+r*2+1 : Show_Button[gb]
		aoz.sourcePos="0:128:8";
		aoz.currentScreen.currentTextWindow.locate({x:vars.c*3+1,y:10+vars.r*2+1});
		aoz.sourcePos="0:128:32";
		return{type:4,procedure:"show_button",args:{b:vars.gb}};
	};
	this.blocks[35]=function(aoz,vars)
	{
		// If (bt mod buttonsPerRow) = (buttonsPerRow-1) Then Inc r
		aoz.sourcePos="0:129:8";
		if(!((((vars.bt)%(vars.buttonsPerRow)))==((vars.buttonsPerRow-1))))
			return{type:1,label:37};
	};
	this.blocks[36]=function(aoz,vars)
	{
		aoz.sourcePos="0:129:59";
		vars.r++;
	};
	this.blocks[37]=function(aoz,vars)
	{
		// Next bt
		aoz.sourcePos="0:130:4";
		vars.bt+=1;
		if(vars.bt<=aoz.gamepadNumButtons(vars.cNum) -1)
			return{type:1,label:34};
	};
	this.blocks[38]=function(aoz,vars)
	{
		// axisRows = RoundUp(Gamepad Axes(cNum)/axesPerRow)
		aoz.sourcePos="0:134:4";
		return{type:11,instruction:"roundup",result:0,args:{_n_f:aoz.checkNumber(aoz.gamepadNumAxes(vars.cNum) /vars.axesPerRow)}};
	};
	this.blocks[39]=function(aoz,vars)
	{
		vars.axisRows=aoz.fp2Int(this.results[0]);
		// Pen 4: Locate 1,17 : Print "Axes: "; : Pen 1 : Print Using "##";Gamepad Axes(cNum) : Pen 7
		aoz.sourcePos="0:135:4";
		aoz.currentScreen.currentTextWindow.setPen(4);
		aoz.sourcePos="0:135:11";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:17});
		aoz.sourcePos="0:135:25";
		aoz.currentScreen.currentTextWindow.print("Axes: ",false);
		aoz.sourcePos="0:135:43";
		aoz.currentScreen.currentTextWindow.setPen(1);
		aoz.sourcePos="0:135:51";
		aoz.currentScreen.currentTextWindow.printUsing("##",[aoz.gamepadNumAxes(vars.cNum) ],".");
		aoz.sourcePos="0:135:89";
		aoz.currentScreen.currentTextWindow.setPen(7);
		// Show_Axis_Labels[4]
		aoz.sourcePos="0:136:4";
		return{type:4,procedure:"show_axis_labels",args:{yOfs:4}};
	};
	this.blocks[40]=function(aoz,vars)
	{
		// r=0 : c=0 ' row, column
		aoz.sourcePos="0:138:4";
		vars.r=0;
		aoz.sourcePos="0:138:10";
		vars.c=0;
		// gt# = Gamepad Threshold
		aoz.sourcePos="0:139:4";
		vars.gt_f=aoz.gamepad_Threshold ;
		// For ax = 0 To Gamepad Axes(cNum)-1 ' BJF - WAS Gamepad Axes(0)-1'
		aoz.sourcePos="0:140:4";
		vars.ax=0;
	};
	this.blocks[41]=function(aoz,vars)
	{
		// Axis#=Gamepad Axis(cNum,ax)
		aoz.sourcePos="0:141:8";
		vars.Axis_f=aoz.gamepadAxis(vars.cNum, vars.ax) ;
		// If (Abs(Axis#) < gt#) Then Pen 2 Else Pen 7
		aoz.sourcePos="0:142:8";
		if(!(((Math.abs(vars.Axis_f))<(vars.gt_f))))
			return{type:1,label:43};
	};
	this.blocks[42]=function(aoz,vars)
	{
		aoz.sourcePos="0:142:35";
		aoz.currentScreen.currentTextWindow.setPen(2);
		return{type:1,label:44};
	};
	this.blocks[43]=function(aoz,vars)
	{
		aoz.sourcePos="0:142:46";
		aoz.currentScreen.currentTextWindow.setPen(7);
	};
	this.blocks[44]=function(aoz,vars)
	{
		// c = ax mod axesPerRow
		aoz.sourcePos="0:143:8";
		vars.c=aoz.fp2Int((vars.ax)%(vars.axesPerRow));
		// Locate c*8+1,15+r*2+4 : If Axis# > -2 Then Print Using "+#.####";Gamepad Axis(cNum,ax)
		aoz.sourcePos="0:144:8";
		aoz.currentScreen.currentTextWindow.locate({x:vars.c*8+1,y:15+vars.r*2+4});
		aoz.sourcePos="0:144:32";
		if(!((vars.Axis_f)>(-2)))
			return{type:1,label:46};
	};
	this.blocks[45]=function(aoz,vars)
	{
		aoz.sourcePos="0:144:51";
		aoz.currentScreen.currentTextWindow.printUsing("+#.####",[aoz.gamepadAxis(vars.cNum, vars.ax) ],".");
	};
	this.blocks[46]=function(aoz,vars)
	{
		// If (ax mod axesPerRow)=(axesPerRow-1) Then Inc r
		aoz.sourcePos="0:145:8";
		if(!((((vars.ax)%(vars.axesPerRow)))==((vars.axesPerRow-1))))
			return{type:1,label:48};
	};
	this.blocks[47]=function(aoz,vars)
	{
		aoz.sourcePos="0:145:51";
		vars.r++;
	};
	this.blocks[48]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:146:8";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[49]=function(aoz,vars)
	{
		// Next ax
		aoz.sourcePos="0:147:4";
		vars.ax+=1;
		if(vars.ax<=aoz.gamepadNumAxes(vars.cNum) -1)
			return{type:1,label:41};
	};
	this.blocks[50]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:148:4";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[51]=function(aoz,vars)
	{
		// GetInfo[cNum]
		aoz.sourcePos="0:150:4";
		return{type:4,procedure:"getinfo",args:{c:vars.cNum}};
	};
	this.blocks[52]=function(aoz,vars)
	{
		// VendProd$="Vendor: "+Vend$+" Product: "+Prod$
		aoz.sourcePos="0:152:4";
		vars.VendProd$="Vendor: "+vars.Vend$+" Product: "+vars.Prod$;
		// Show_Header[Name$,VendProd$]
		aoz.sourcePos="0:153:4";
		return{type:4,procedure:"show_header",args:{GName$:vars.Name$,VendProd$:vars.VendProd$}};
	};
	this.blocks[53]=function(aoz,vars)
	{
		// Show_Footer[BrowseName$]
		aoz.sourcePos="0:154:4";
		return{type:4,procedure:"show_footer",args:{BrowseName$:vars.BrowseName$}};
	};
	this.blocks[54]=function(aoz,vars)
	{
		// Show_Notes
		aoz.sourcePos="0:155:4";
		return{type:4,procedure:"show_notes",args:{}};
	};
	this.blocks[55]=function(aoz,vars)
	{
		// Loop
		aoz.sourcePos="0:164:0";
		return{type:1,label:12};
	};
	this.blocks[56]=function(aoz,vars)
	{
		// GoTo ReStart
		aoz.sourcePos="0:166:0";
		return{type:1,label:9};
	};
	this.blocks[57]=function(aoz,vars)
	{
		return{type:0}
	};

	// Labels...
	this.labels=
	{
		restart:{dataPosition:0,labelBlock:9}
	};
	this.p_drawstatic=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// Pen 8
			aoz.sourcePos="0:172:4";
			aoz.currentScreen.currentTextWindow.setPen(8);
			// Locate 14,3 : Print "jUpLeft  jUp  jUpRight"
			aoz.sourcePos="0:173:4";
			aoz.currentScreen.currentTextWindow.locate({x:14,y:3});
			aoz.sourcePos="0:173:18";
			aoz.currentScreen.currentTextWindow.print("jUpLeft  jUp  jUpRight",true);
			// Locate 12,7: Print "jDownLeft jDown jDownRight"
			aoz.sourcePos="0:174:4";
			aoz.currentScreen.currentTextWindow.locate({x:12,y:7});
			aoz.sourcePos="0:174:17";
			aoz.currentScreen.currentTextWindow.print("jDownLeft jDown jDownRight",true);
			// Locate 16,5 : Print "jLeft"
			aoz.sourcePos="0:175:4";
			aoz.currentScreen.currentTextWindow.locate({x:16,y:5});
			aoz.sourcePos="0:175:18";
			aoz.currentScreen.currentTextWindow.print("jLeft",true);
			// Locate 28,5 : Print "jRight"
			aoz.sourcePos="0:176:4";
			aoz.currentScreen.currentTextWindow.locate({x:28,y:5});
			aoz.sourcePos="0:176:18";
			aoz.currentScreen.currentTextWindow.print("jRight",true);
			// Locate 1,4 : Print "Fire:"
			aoz.sourcePos="0:178:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:4});
			aoz.sourcePos="0:178:17";
			aoz.currentScreen.currentTextWindow.print("Fire:",true);
			// Pen 2
			aoz.sourcePos="0:180:4";
			aoz.currentScreen.currentTextWindow.setPen(2);
			// Locate 1,6 : Print "Fire2:"
			aoz.sourcePos="0:181:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:6});
			aoz.sourcePos="0:181:17";
			aoz.currentScreen.currentTextWindow.print("Fire2:",true);
			// End Procedure
			return{type:0};
		};
	};
	this.p_gamepad_disconnected=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// Cls 0 : Flash Off : Curs Off
			aoz.sourcePos="0:185:4";
			aoz.currentScreen.cls(0);
			aoz.sourcePos="0:185:12";
			aoz.setFlash(false);
			aoz.sourcePos="0:185:24";
			aoz.currentScreen.currentTextWindow.setCursor(false);
			// Pen 1 : Paper 0
			aoz.sourcePos="0:186:4";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:186:12";
			aoz.currentScreen.currentTextWindow.setPaper(0);
			// Edges
			aoz.sourcePos="0:187:4";
			return{type:4,procedure:"edges",args:{}};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// Locate 1,1 : Centre "(Gamepad Disconnected)"
			aoz.sourcePos="0:188:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
			aoz.sourcePos="0:188:17";
			aoz.currentScreen.currentTextWindow.centre("(Gamepad Disconnected)");
			// If (Not GamePad Connected(cNum))
			aoz.sourcePos="0:189:4";
			if(!((!(aoz.gamepadConnected(this.root.vars.cNum) ))))
				return{type:1,label:5};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// Repeat
			aoz.sourcePos="0:190:4";
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Until GamePad Connected(cNum)
			aoz.sourcePos="0:191:4";
			if(!(aoz.gamepadConnected(this.root.vars.cNum) ))
				return{type:1,label:3};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:192:4";
		};
		this.blocks[5]=function(aoz,vars)
		{
			// Locate 1,1 : Print Space$(38)
			aoz.sourcePos="0:193:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
			aoz.sourcePos="0:193:17";
			aoz.currentScreen.currentTextWindow.print(aoz.space$(38),true);
			// End Procedure
			return{type:0};
		};
	};
	this.p_edges=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// I = Ink ' Save Ink
			aoz.sourcePos="0:197:4";
			vars.I=aoz.fp2Int(aoz.currentScreen.ink );
			// Ink 2
			aoz.sourcePos="0:198:4";
			aoz.currentScreen.setInk(2);
			// Draw 0,0 To 0,Screen Height-1
			aoz.sourcePos="0:199:4";
			aoz.currentScreen.draw({x1:0,y1:0,x2:0,y2:aoz.currentScreen.dimension.height-1});
			// Draw Screen Width-1,0 To Screen Width-1, Screen Height-1
			aoz.sourcePos="0:200:4";
			aoz.currentScreen.draw({x1:aoz.currentScreen.dimension.width-1,y1:0,x2:aoz.currentScreen.dimension.width-1,y2:aoz.currentScreen.dimension.height-1});
			// Ink I ' Restore Ink
			aoz.sourcePos="0:201:4";
			aoz.currentScreen.setInk(vars.I);
			// End Procedure
			return{type:0};
		};
	};
	this.p_activate_gp=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// Cls 0 : Flash Off : Curs Off
			aoz.sourcePos="0:205:4";
			aoz.currentScreen.cls(0);
			aoz.sourcePos="0:205:12";
			aoz.setFlash(false);
			aoz.sourcePos="0:205:24";
			aoz.currentScreen.currentTextWindow.setCursor(false);
			// Pen 1 : Paper 0
			aoz.sourcePos="0:206:4";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:206:12";
			aoz.currentScreen.currentTextWindow.setPaper(0);
			// Edges
			aoz.sourcePos="0:207:4";
			return{type:4,procedure:"edges",args:{}};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// Locate 1,1 : Print "(Click button on controller to start.)"
			aoz.sourcePos="0:208:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
			aoz.sourcePos="0:208:17";
			aoz.currentScreen.currentTextWindow.print("(Click button on controller to start.)",true);
			// If (Not GamePad Connected(0))
			aoz.sourcePos="0:209:4";
			if(!((!(aoz.gamepadConnected(0) ))))
				return{type:1,label:5};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// Repeat
			aoz.sourcePos="0:210:8";
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Until GamePad Connected(0)
			aoz.sourcePos="0:211:8";
			if(!(aoz.gamepadConnected(0) ))
				return{type:1,label:3};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:212:4";
		};
		this.blocks[5]=function(aoz,vars)
		{
			// Locate 1,1 : Print Space$(38)
			aoz.sourcePos="0:213:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
			aoz.sourcePos="0:213:17";
			aoz.currentScreen.currentTextWindow.print(aoz.space$(38),true);
			// End Procedure
			return{type:0};
		};
	};
	this.p_show_notes=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// p=Pen ' Save Pen
			aoz.sourcePos="0:217:4";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Pen 2
			aoz.sourcePos="0:218:4";
			aoz.currentScreen.currentTextWindow.setPen(2);
			// iStart = Int(Screen Height/charHeight#)-6
			aoz.sourcePos="0:219:4";
			vars.iStart=aoz.fp2Int(aoz.fp2Int(aoz.checkNumber(aoz.currentScreen.dimension.height/this.root.vars.charHeight_f)) -6);
			// Locate 1,iStart
			aoz.sourcePos="0:220:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:vars.iStart});
			// Locate 1,iStart		: Print "Axis(,0):-left, +right (,1):-up, +down"
			aoz.sourcePos="0:221:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:vars.iStart});
			aoz.sourcePos="0:221:29";
			aoz.currentScreen.currentTextWindow.print("Axis(,0):-left, +right (,1):-up, +down",true);
			// Locate 1,iStart+1	: Print "A"; : Pen 1 : Print Using "###.##%";Gamepad Threshold*100
			aoz.sourcePos="0:222:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:vars.iStart+1});
			aoz.sourcePos="0:222:27";
			aoz.currentScreen.currentTextWindow.print("A",false);
			aoz.sourcePos="0:222:40";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:222:48";
			aoz.currentScreen.currentTextWindow.printUsing("###.##%",[aoz.gamepad_Threshold *100],".");
			// Locate 10,iStart+1	: Pen 8 : Print "Gamepad Threshold"; : Pen 2 : Print " will trigger"
			aoz.sourcePos="0:223:4";
			aoz.currentScreen.currentTextWindow.locate({x:10,y:vars.iStart+1});
			aoz.sourcePos="0:223:28";
			aoz.currentScreen.currentTextWindow.setPen(8);
			aoz.sourcePos="0:223:36";
			aoz.currentScreen.currentTextWindow.print("Gamepad Threshold",false);
			aoz.sourcePos="0:223:65";
			aoz.currentScreen.currentTextWindow.setPen(2);
			aoz.sourcePos="0:223:73";
			aoz.currentScreen.currentTextWindow.print(" will trigger",true);
			// Locate 1,iStart+2	: Print "the digital pad emulation functions."
			aoz.sourcePos="0:224:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:vars.iStart+2});
			aoz.sourcePos="0:224:27";
			aoz.currentScreen.currentTextWindow.print("the digital pad emulation functions.",true);
			// Pen p ' Restore Pen
			aoz.sourcePos="0:225:4";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Proc
			return{type:0};
		};
	};
	this.p_show_button=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// If b=0 Then Pen 2 Else Pen 7
			aoz.sourcePos="0:229:4";
			if(!((vars.b)==(0)))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			aoz.sourcePos="0:229:16";
			aoz.currentScreen.currentTextWindow.setPen(2);
			return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:229:27";
			aoz.currentScreen.currentTextWindow.setPen(7);
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Print Using "-#";b
			aoz.sourcePos="0:230:4";
			aoz.currentScreen.currentTextWindow.printUsing("-#",[vars.b],".");
			// End Procedure
			return{type:0};
		};
	};
	this.p_show_button_labels=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// p=Pen ' Save Pen
			aoz.sourcePos="0:234:4";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Pen 5
			aoz.sourcePos="0:235:4";
			aoz.currentScreen.currentTextWindow.setPen(5);
			// r=0 : c=0
			aoz.sourcePos="0:236:4";
			vars.r=0;
			aoz.sourcePos="0:236:10";
			vars.c=0;
			// For bt = 0 To Gamepad Buttons(cNum)-1
			aoz.sourcePos="0:237:4";
			vars.bt=0;
		};
		this.blocks[1]=function(aoz,vars)
		{
			// c = bt mod buttonsPerRow
			aoz.sourcePos="0:238:8";
			vars.c=aoz.fp2Int((vars.bt)%(this.root.vars.buttonsPerRow));
			// Locate c*3+1,9+r*2+yOfs : Print Using "##";bt
			aoz.sourcePos="0:239:8";
			aoz.currentScreen.currentTextWindow.locate({x:vars.c*3+1,y:9+vars.r*2+vars.yOfs});
			aoz.sourcePos="0:239:34";
			aoz.currentScreen.currentTextWindow.printUsing("##",[vars.bt],".");
			// If (bt mod buttonsPerRow) = (buttonsPerRow-1) Then Inc r
			aoz.sourcePos="0:240:8";
			if(!((((vars.bt)%(this.root.vars.buttonsPerRow)))==((this.root.vars.buttonsPerRow-1))))
				return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:240:59";
			vars.r++;
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Next bt
			aoz.sourcePos="0:241:4";
			vars.bt+=1;
			if(vars.bt<=aoz.gamepadNumButtons(this.root.vars.cNum) -1)
				return{type:1,label:1};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// Pen p // Restore Pen
			aoz.sourcePos="0:242:4";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Procedure
			return{type:0};
		};
	};
	this.p_show_axis_labels=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// p=Pen ' Save Pen
			aoz.sourcePos="0:246:4";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Pen 5
			aoz.sourcePos="0:247:4";
			aoz.currentScreen.currentTextWindow.setPen(5);
			// r = 0 : c = 0
			aoz.sourcePos="0:248:4";
			vars.r=0;
			aoz.sourcePos="0:248:12";
			vars.c=0;
			// For ax = 0 To Gamepad Axes(cNum)-1
			aoz.sourcePos="0:249:4";
			vars.ax=0;
		};
		this.blocks[1]=function(aoz,vars)
		{
			// c = ax mod axesPerRow
			aoz.sourcePos="0:250:8";
			vars.c=aoz.fp2Int((vars.ax)%(this.root.vars.axesPerRow));
			// Locate c*7+2,14+r*2+yOfs : Print Using "####";ax
			aoz.sourcePos="0:251:8";
			aoz.currentScreen.currentTextWindow.locate({x:vars.c*7+2,y:14+vars.r*2+vars.yOfs});
			aoz.sourcePos="0:251:35";
			aoz.currentScreen.currentTextWindow.printUsing("####",[vars.ax],".");
			// If (ax mod axesPerRow)=(axesPerRow-1) Then Inc r
			aoz.sourcePos="0:252:8";
			if(!((((vars.ax)%(this.root.vars.axesPerRow)))==((this.root.vars.axesPerRow-1))))
				return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:252:51";
			vars.r++;
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Next ax
			aoz.sourcePos="0:253:4";
			vars.ax+=1;
			if(vars.ax<=aoz.gamepadNumAxes(this.root.vars.cNum) -1)
				return{type:1,label:1};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// Pen p // Restore Pen
			aoz.sourcePos="0:254:4";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Procedure
			return{type:0};
		};
	};
	this.p_gamepad_changed=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// Cls 0 ' Start over!
			aoz.sourcePos="0:258:4";
			aoz.currentScreen.cls(0);
			// Edges
			aoz.sourcePos="0:259:4";
			return{type:4,procedure:"edges",args:{}};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// GName$ = GID$ // =Gamepad Name$()
			aoz.sourcePos="0:260:4";
			this.root.vars.GName$=this.root.vars.GID$;
			// GName$=Gamepad Name$(cNum) : BrowseName$ = Browser Name$
			aoz.sourcePos="0:264:4";
				result = aoz.gamepadName$(this.root.vars.cNum);
			this.root.vars.GName$=result ;
			aoz.sourcePos="0:264:33";
				var UA=navigator.userAgent;
				var result = UA; // If unrecognized, return entire userAgent so user can write their own detection.
				 var ua=UA.toLowerCase();
				 isMSIE=			ua.indexOf('msie') >=0;		// Internet Explorer 8-10
				 isExplorer=		ua.indexOf('explorer') >=0;	// Internet Explorer 11
				 isEdge=			ua.indexOf(' edg\/') >= 0;
				 isFirefox=		ua.indexOf('firefox') >= 0;
				 isOpera=		ua.indexOf(' opr\/') >= 0;
				 isChromium=		ua.indexOf(' chromium') >=0;	// Windows, OS/X, Linux, Android
				 isMaxthon=		ua.indexOf(' maxthon') >=0;	// Maxthon SHOULD WE BLOCK IT, or at least WARN the user about it?!  (Major security issue!)
				 isChrome=		ua.indexOf('chrome') >= 0 && ua.indexOf(' opr\/') < 0 && ua.indexOf(' edg\/') < 0;
				 isSafari=		ua.indexOf('safari\/') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf(' opr\/') < 0;
				isSeamonkey=	ua.indexOf(' seamonkey') >=0;
				 isMidori=		ua.indexOf(' midori') >=0;
				 isKonquerer=	ua.indexOf(' konquerer') >=0;
				 isPaleMoon=		ua.indexOf(' palemoon') >=0;
				 isFalkon=		ua.indexOf(' falkon') >=0;
				 isW3M=			ua.indexOf('w3m') >=0;
				isOperaMini=	ua.indexOf(' opera mini') >=0;	// Android & Blackberry
				isUCBrowser=	ua.indexOf('ucbrowser') >=0;	// Android
				 if (isMSIE)			result='MSIE'; // 8-10
				 if (isExplorer)		result='Explorer'; // 11
				 if (isEdge)			result='Edge';
				 if (isFirefox)		result='Firefox';
				 if (isOpera)		result='Opera';
				 if (isChromium) 	result='Chromium';
				 if (isMaxthon)		result='Maxthon';
				 if (isSafari)		result='Safari';
				 if (isChrome)		result='Chrome';
				 if (isSeamonkey)	result='Seamonkey';
				 if (isMidori)		result='Midori';
				 if (isKonquerer)	result='Konquerer';
				 if (isPaleMoon)		result='Pale Moon';
				if (isFalkon)		result='Falkon';	
				 if (isW3M)			result='W3M';
				if (isUCBrowser)	result='UCBrowser';	// Android
				if (isOperaMini)	result='Opera Mini';	// Android & Blackberry
			this.root.vars.BrowseName$=result ;
			// If BrowseName$="Firefox" Or BrowseName$="SeaMonkey" Or BrowseName$="Safari"
			aoz.sourcePos="0:265:4";
			if(!(((this.root.vars.BrowseName$)==("Firefox"))||(((this.root.vars.BrowseName$)==("SeaMonkey"))||((this.root.vars.BrowseName$)==("Safari")))))
				return{type:1,label:13};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// VE=Instr(GName$,"-") // end of Vendor ID
			aoz.sourcePos="0:266:8";
			vars.VE=aoz.fp2Int(aoz.instr(this.root.vars.GName$,"-"));
			// If VE>0
			aoz.sourcePos="0:267:8";
			if(!((vars.VE)>(0)))
				return{type:1,label:7};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Vendor$=Left$(GName$,VE-1)
			aoz.sourcePos="0:268:12";
			vars.Vendor$=this.aoz.getLeft$(this.root.vars.GName$,vars.VE-1);
			// Temp$=Right$(GName$,Len(GName$)-VE) // BJF DEBUG!!! +1 added
			aoz.sourcePos="0:269:12";
			vars.Temp$=this.aoz.getRight$(this.root.vars.GName$,(this.root.vars.GName$).length-vars.VE);
			// PR=Instr(Temp$,"-") // End of Product ID
			aoz.sourcePos="0:270:12";
			vars.PR=aoz.fp2Int(aoz.instr(vars.Temp$,"-"));
			// If PR>0
			aoz.sourcePos="0:271:12";
			if(!((vars.PR)>(0)))
				return{type:1,label:5};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// Product$=Left$(Temp$,PR-1) // BJF DEBUG!!! -1 added
			aoz.sourcePos="0:272:16";
			vars.Product$=this.aoz.getLeft$(vars.Temp$,vars.PR-1);
			// GName$=Right$(GName$,Len(GName$)-Len(Vendor$)-Len(Product$)-2)
			aoz.sourcePos="0:273:16";
			this.root.vars.GName$=this.aoz.getRight$(this.root.vars.GName$,(this.root.vars.GName$).length-(vars.Vendor$).length-(vars.Product$).length-2);
			// Else
			return{type:1,label:6};
		};
		this.blocks[5]=function(aoz,vars)
		{
			// Product$=""
			aoz.sourcePos="0:275:16";
			vars.Product$="";
			// GName$=Right$(GName$,Len(GName$)-VE)
			aoz.sourcePos="0:276:16";
			this.root.vars.GName$=this.aoz.getRight$(this.root.vars.GName$,(this.root.vars.GName$).length-vars.VE);
			// End If
			aoz.sourcePos="0:277:12";
		};
		this.blocks[6]=function(aoz,vars)
		{
			// Else
			return{type:1,label:8};
		};
		this.blocks[7]=function(aoz,vars)
		{
			// Vendor$="" : Product$=""
			aoz.sourcePos="0:279:12";
			vars.Vendor$="";
			aoz.sourcePos="0:279:25";
			vars.Product$="";
			// End If
			aoz.sourcePos="0:280:8";
		};
		this.blocks[8]=function(aoz,vars)
		{
			// If Len(Product$) < 4 Then Product$=String$("0",4-Len(Product$))+Product$
			aoz.sourcePos="0:281:8";
			if(!(((vars.Product$).length)<(4)))
				return{type:1,label:10};
		};
		this.blocks[9]=function(aoz,vars)
		{
			aoz.sourcePos="0:281:34";
			vars.Product$=aoz.string$("0", 4-(vars.Product$).length)+vars.Product$;
		};
		this.blocks[10]=function(aoz,vars)
		{
			// If Len(Vendor$) < 4 Then Vendor$=String$("0",4-Len(Vendor$))+Vendor$
			aoz.sourcePos="0:282:8";
			if(!(((vars.Vendor$).length)<(4)))
				return{type:1,label:12};
		};
		this.blocks[11]=function(aoz,vars)
		{
			aoz.sourcePos="0:282:33";
			vars.Vendor$=aoz.string$("0", 4-(vars.Vendor$).length)+vars.Vendor$;
		};
		this.blocks[12]=function(aoz,vars)
		{
			// Else // Chrome and everybody else
			return{type:1,label:20};
		};
		this.blocks[13]=function(aoz,vars)
		{
			// Vendor$="" : Product$=""
			aoz.sourcePos="0:284:8";
			vars.Vendor$="";
			aoz.sourcePos="0:284:21";
			vars.Product$="";
			// VendProd$=Right$(GName$,Len(GName$)-Instr(GName$,"(")+1)
			aoz.sourcePos="0:285:8";
			this.root.vars.VendProd$=this.aoz.getRight$(this.root.vars.GName$,(this.root.vars.GName$).length-aoz.instr(this.root.vars.GName$,"(")+1);
			// If Len(VendProd$)>3
			aoz.sourcePos="0:286:8";
			if(!(((this.root.vars.VendProd$).length)>(3)))
				return{type:1,label:18};
		};
		this.blocks[14]=function(aoz,vars)
		{
			// VS=Instr(VendProd$,": ") ' Start of Vendor ID
			aoz.sourcePos="0:287:12";
			vars.VS=aoz.fp2Int(aoz.instr(this.root.vars.VendProd$,": "));
			// Vendor$=Mid$(VendProd$,VS+2,4)
			aoz.sourcePos="0:288:12";
			vars.Vendor$=this.aoz.getMid$(this.root.vars.VendProd$,vars.VS+2,4);
			// VendProd$=Right$(VendProd$,Len(VendProd$)-VS-6)
			aoz.sourcePos="0:289:12";
			this.root.vars.VendProd$=this.aoz.getRight$(this.root.vars.VendProd$,(this.root.vars.VendProd$).length-vars.VS-6);
			// PS=Instr(VendProd$,": ") ' Start of Product ID
			aoz.sourcePos="0:290:12";
			vars.PS=aoz.fp2Int(aoz.instr(this.root.vars.VendProd$,": "));
			// Product$=Mid$(VendProd$,PS+2,4)
			aoz.sourcePos="0:291:12";
			vars.Product$=this.aoz.getMid$(this.root.vars.VendProd$,vars.PS+2,4);
			// If Len(GID$)>0 Then GName$=Left$(GID$,Instr(GID$,"(")-1) Else GName$=GID$
			aoz.sourcePos="0:292:12";
			if(!(((this.root.vars.GID$).length)>(0)))
				return{type:1,label:16};
		};
		this.blocks[15]=function(aoz,vars)
		{
			aoz.sourcePos="0:292:32";
			this.root.vars.GName$=this.aoz.getLeft$(this.root.vars.GID$,aoz.instr(this.root.vars.GID$,"(")-1);
			return{type:1,label:17};
		};
		this.blocks[16]=function(aoz,vars)
		{
			aoz.sourcePos="0:292:74";
			this.root.vars.GName$=this.root.vars.GID$;
		};
		this.blocks[17]=function(aoz,vars)
		{
			// Else
			return{type:1,label:19};
		};
		this.blocks[18]=function(aoz,vars)
		{
			// Vendor$="" : Product$=""
			aoz.sourcePos="0:294:12";
			vars.Vendor$="";
			aoz.sourcePos="0:294:25";
			vars.Product$="";
			// End If
			aoz.sourcePos="0:295:8";
		};
		this.blocks[19]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:296:4";
		};
		this.blocks[20]=function(aoz,vars)
		{
			// VendProd$="Vendor: "+Vendor$+" Product: "+Product$
			aoz.sourcePos="0:297:4";
			this.root.vars.VendProd$="Vendor: "+vars.Vendor$+" Product: "+vars.Product$;
			// DrawStatic
			aoz.sourcePos="0:298:4";
			return{type:4,procedure:"drawstatic",args:{}};
		};
		this.blocks[21]=function(aoz,vars)
		{
			// Show_Header[GName$,VendProd$]
			aoz.sourcePos="0:299:4";
			return{type:4,procedure:"show_header",args:{GName$:this.root.vars.GName$,VendProd$:this.root.vars.VendProd$}};
		};
		this.blocks[22]=function(aoz,vars)
		{
			// Show_Footer[BrowseName$]
			aoz.sourcePos="0:300:4";
			return{type:4,procedure:"show_footer",args:{BrowseName$:this.root.vars.BrowseName$}};
		};
		this.blocks[23]=function(aoz,vars)
		{
			// Show_Notes
			aoz.sourcePos="0:301:4";
			return{type:4,procedure:"show_notes",args:{}};
		};
		this.blocks[24]=function(aoz,vars)
		{
			// End Procedure
			return{type:0};
		};
	};
	this.p_show_header=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// i=Ink : p=Pen ' Save Pen & Ink
			aoz.sourcePos="0:305:4";
			vars.i=aoz.fp2Int(aoz.currentScreen.ink );
			aoz.sourcePos="0:305:12";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Ink 3 ' dark gray
			aoz.sourcePos="0:309:4";
			aoz.currentScreen.setInk(3);
			// Bar 1,0 To Screen Width-2,charHeight#*2 // Clear 1st 2 lines
			aoz.sourcePos="0:310:4";
			aoz.currentScreen.box({x:1,y:0},true,{x2:aoz.currentScreen.dimension.width-2,y2:this.root.vars.charHeight_f*2});
			// Pen 3 : Paper 0
			aoz.sourcePos="0:314:4";
			aoz.currentScreen.currentTextWindow.setPen(3);
			aoz.sourcePos="0:314:12";
			aoz.currentScreen.currentTextWindow.setPaper(0);
			// Inverse On
			aoz.sourcePos="0:315:4";
			aoz.currentScreen.currentTextWindow.setInverse(true);
			// strt=Len(GName$)
			aoz.sourcePos="0:317:4";
			vars.strt=aoz.fp2Int((vars.GName$).length);
			// While (strt>0) And (Mid$(GName$,strt,1)=" ")
			aoz.sourcePos="0:318:4";
			if(!((((vars.strt)>(0)))&&((((this.aoz.getMid$(vars.GName$,vars.strt,1))==(" ")))!=0)))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// Dec strt
			aoz.sourcePos="0:319:8";
			vars.strt--;
			// Wend
			aoz.sourcePos="0:320:4";
			if((((vars.strt)>(0)))&&((((this.aoz.getMid$(vars.GName$,vars.strt,1))==(" ")))!=0))
				return{type:1,label:1};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// Locate 1,0 : Centre Left$(GName$,strt)
			aoz.sourcePos="0:321:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:0});
			aoz.sourcePos="0:321:17";
			aoz.currentScreen.currentTextWindow.centre(this.aoz.getLeft$(vars.GName$,vars.strt));
			// Locate 1,1 : Centre VendProd$
			aoz.sourcePos="0:322:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
			aoz.sourcePos="0:322:17";
			aoz.currentScreen.currentTextWindow.centre(vars.VendProd$);
			// Ink i : Pen p ' Restore Pen & Ink
			aoz.sourcePos="0:323:4";
			aoz.currentScreen.setInk(vars.i);
			aoz.sourcePos="0:323:12";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Procedure
			return{type:0};
		};
	};
	this.p_show_footer=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// i=Ink : p=Pen ' Save Pen & Ink
			aoz.sourcePos="0:327:4";
			vars.i=aoz.fp2Int(aoz.currentScreen.ink );
			aoz.sourcePos="0:327:12";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Ink 3 : SH = Screen Height : SW = Screen Width
			aoz.sourcePos="0:331:4";
			aoz.currentScreen.setInk(3);
			aoz.sourcePos="0:331:12";
			vars.SH=aoz.fp2Int(aoz.currentScreen.dimension.height);
			aoz.sourcePos="0:331:33";
			vars.SW=aoz.fp2Int(aoz.currentScreen.dimension.width);
			// Bar 1,SH-charHeight# To SW-2,SH-charHeight#*3
			aoz.sourcePos="0:332:4";
			aoz.currentScreen.box({x:1,y:vars.SH-this.root.vars.charHeight_f},true,{x2:vars.SW-2,y2:vars.SH-this.root.vars.charHeight_f*3});
			// Pen 3 ' Light gray
			aoz.sourcePos="0:336:4";
			aoz.currentScreen.currentTextWindow.setPen(3);
			// Inverse On
			aoz.sourcePos="0:337:4";
			aoz.currentScreen.currentTextWindow.setInverse(true);
			// Locate 1,Int(SH/charHeight#)-3 : Centre "Gamepad/Joystick Tester "+Version$
			aoz.sourcePos="0:338:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:aoz.fp2Int(aoz.checkNumber(vars.SH/this.root.vars.charHeight_f)) -3});
			aoz.sourcePos="0:338:37";
			aoz.currentScreen.currentTextWindow.centre("Gamepad/Joystick Tester "+this.root.vars.Version$);
			// Locate 1,Int(SH/charHeight#)-2 : Centre "Shows up to"+Str$(buttonsPerRow*3)+" buttons &"+Str$(axesPerRow*4)+" axes."
			aoz.sourcePos="0:339:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:aoz.fp2Int(aoz.checkNumber(vars.SH/this.root.vars.charHeight_f)) -2});
			aoz.sourcePos="0:339:37";
			aoz.currentScreen.currentTextWindow.centre("Shows up to"+aoz.str$( this.root.vars.buttonsPerRow*3)+" buttons &"+aoz.str$( this.root.vars.axesPerRow*4)+" axes.");
			// Inverse Off : Pen 9 ' Magenta
			aoz.sourcePos="0:340:4";
			aoz.currentScreen.currentTextWindow.setInverse(false);
			aoz.sourcePos="0:340:18";
			aoz.currentScreen.currentTextWindow.setPen(9);
			// Locate 0,Int(SH/charHeight#)-1 : Print "Browser: ";BrowseName$;
			aoz.sourcePos="0:341:4";
			aoz.currentScreen.currentTextWindow.locate({x:0,y:aoz.fp2Int(aoz.checkNumber(vars.SH/this.root.vars.charHeight_f)) -1});
			aoz.sourcePos="0:341:37";
			aoz.currentScreen.currentTextWindow.print("Browser: "+vars.BrowseName$,false);
			// MF$ = "Manifest: "+Manifest$   : Locate 40-Len(MF$)-1 : Print MF$;
			aoz.sourcePos="0:342:4";
			vars.MF$="Manifest: "+aoz.manifest.compilation.platform  ;
			aoz.sourcePos="0:342:37";
			aoz.currentScreen.currentTextWindow.locate({x:40-(vars.MF$).length-1,y:undefined});
			aoz.sourcePos="0:342:60";
			aoz.currentScreen.currentTextWindow.print(vars.MF$,false);
			// Ink i : Pen p ' Restore Pen & Ink
			aoz.sourcePos="0:343:4";
			aoz.currentScreen.setInk(vars.i);
			aoz.sourcePos="0:343:12";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Procedure
			return{type:0};
		};
	};
	this.p_getinfo=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="procedure";
		this.parent=parent;
		this.vars={};
		this.parent.procParam=0;
		this.parent.procParam$="";
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// GID$=Gamepad Name$(c)
			aoz.sourcePos="0:432:4";
				result = aoz.gamepadName$(vars.c);
			this.root.vars.GID$=result ;
			// Vend$ = VendorID$(c)
			aoz.sourcePos="0:433:4";
			return{type:11,instruction:"vendorid$",result:0,args:{_n:vars.c}};
		};
		this.blocks[1]=function(aoz,vars)
		{
			this.root.vars.Vend$=this.results[0];
			// Prod$ = ProductID$(c)
			aoz.sourcePos="0:434:4";
			return{type:11,instruction:"productid$",result:0,args:{_n:vars.c}};
		};
		this.blocks[2]=function(aoz,vars)
		{
			this.root.vars.Prod$=this.results[0];
			// Name$ = GamepadName$(c)
			aoz.sourcePos="0:435:4";
			return{type:11,instruction:"gamepadname$",result:0,args:{_n:vars.c}};
		};
		this.blocks[3]=function(aoz,vars)
		{
			this.root.vars.Name$=this.results[0];
			// End Procedure
			return{type:0};
		};
	};
	this.f_vendorid$=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="function";
		this.parent=parent;
		this.vars={};
		this.vars._n=0;
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// VID$=""
			aoz.sourcePos="0:347:4";
			vars.VID$="";
			// G$=Gamepad Name$(_n)
			aoz.sourcePos="0:348:4";
				result = aoz.gamepadName$(vars._n);
			vars.G$=result ;
			// VS=Instr(G$,"Vendor: ")
			aoz.sourcePos="0:349:4";
			vars.VS=aoz.fp2Int(aoz.instr(vars.G$,"Vendor: "));
			// If VS>0 // Chrome/Edge/Opera/Brave
			aoz.sourcePos="0:350:4";
			if(!((vars.VS)>(0)))
				return{type:1,label:5};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// VS=VS+8
			aoz.sourcePos="0:351:8";
			vars.VS=aoz.fp2Int(vars.VS+8);
			// VE=Instr(G$," ",VS)
			aoz.sourcePos="0:352:8";
			vars.VE=aoz.fp2Int(aoz.instr(vars.G$," ",vars.VS));
			// If VE>0
			aoz.sourcePos="0:353:8";
			if(!((vars.VE)>(0)))
				return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// VID$=Mid$(G$,VS,VE-VS+1)
			aoz.sourcePos="0:354:12";
			vars.VID$=this.aoz.getMid$(vars.G$,vars.VS,vars.VE-vars.VS+1);
			// Else
			return{type:1,label:4};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// VID$=Right$(G$,VS)
			aoz.sourcePos="0:356:12";
			vars.VID$=this.aoz.getRight$(vars.G$,vars.VS);
			// End If
			aoz.sourcePos="0:357:8";
		};
		this.blocks[4]=function(aoz,vars)
		{
			// Else // Firefox/SeaMonkey/Safari
			return{type:1,label:9};
		};
		this.blocks[5]=function(aoz,vars)
		{
			// VE=Instr(G$,"-")
			aoz.sourcePos="0:359:8";
			vars.VE=aoz.fp2Int(aoz.instr(vars.G$,"-"));
			// If VE>0
			aoz.sourcePos="0:360:8";
			if(!((vars.VE)>(0)))
				return{type:1,label:7};
		};
		this.blocks[6]=function(aoz,vars)
		{
			// VID$=Left$(G$,VE-1)
			aoz.sourcePos="0:361:12";
			vars.VID$=this.aoz.getLeft$(vars.G$,vars.VE-1);
			// Else
			return{type:1,label:8};
		};
		this.blocks[7]=function(aoz,vars)
		{
			// VID$=G$
			aoz.sourcePos="0:363:12";
			vars.VID$=vars.G$;
			// End If
			aoz.sourcePos="0:364:8";
		};
		this.blocks[8]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:365:4";
		};
		this.blocks[9]=function(aoz,vars)
		{
			// End Function(VID$)
			var parent=this.parent;
			while(parent)
			{
				parent.results[this.currentResult]=vars.VID$;
				parent=parent.parent;
			}
			return{type:0}
		};
	};
	this.f_productid$=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="function";
		this.parent=parent;
		this.vars={};
		this.vars._n=0;
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// PID$=""
			aoz.sourcePos="0:369:4";
			vars.PID$="";
			// G$=Gamepad Name$(_n)
			aoz.sourcePos="0:370:4";
				result = aoz.gamepadName$(vars._n);
			vars.G$=result ;
			// PS=Instr(G$,"Product: ")
			aoz.sourcePos="0:371:4";
			vars.PS=aoz.fp2Int(aoz.instr(vars.G$,"Product: "));
			// If PS>0 // Chrome,Edge,Brave,Opera
			aoz.sourcePos="0:372:4";
			if(!((vars.PS)>(0)))
				return{type:1,label:5};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// PS=PS+9
			aoz.sourcePos="0:373:8";
			vars.PS=aoz.fp2Int(vars.PS+9);
			// PE=Instr(G$,")")
			aoz.sourcePos="0:374:8";
			vars.PE=aoz.fp2Int(aoz.instr(vars.G$,")"));
			// If PE>0
			aoz.sourcePos="0:375:8";
			if(!((vars.PE)>(0)))
				return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// PID$=Mid$(G$,PS,Len(G$)-PS)
			aoz.sourcePos="0:376:12";
			vars.PID$=this.aoz.getMid$(vars.G$,vars.PS,(vars.G$).length-vars.PS);
			// Else
			return{type:1,label:4};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// PID$=Right$(G$,Len(G$)-PS)
			aoz.sourcePos="0:378:12";
			vars.PID$=this.aoz.getRight$(vars.G$,(vars.G$).length-vars.PS);
			// End If
			aoz.sourcePos="0:379:8";
		};
		this.blocks[4]=function(aoz,vars)
		{
			// Else // Firefox,Seamonkey,Safari
			return{type:1,label:12};
		};
		this.blocks[5]=function(aoz,vars)
		{
			// PS=Instr(G$,"-")
			aoz.sourcePos="0:381:8";
			vars.PS=aoz.fp2Int(aoz.instr(vars.G$,"-"));
			// If PS>0
			aoz.sourcePos="0:382:8";
			if(!((vars.PS)>(0)))
				return{type:1,label:10};
		};
		this.blocks[6]=function(aoz,vars)
		{
			// PS=PS+1
			aoz.sourcePos="0:383:12";
			vars.PS=aoz.fp2Int(vars.PS+1);
			// PE=Instr(G$,"-",PS)
			aoz.sourcePos="0:384:12";
			vars.PE=aoz.fp2Int(aoz.instr(vars.G$,"-",vars.PS));
			// If PE>0
			aoz.sourcePos="0:385:12";
			if(!((vars.PE)>(0)))
				return{type:1,label:8};
		};
		this.blocks[7]=function(aoz,vars)
		{
			// PID$=Mid$(G$,PS,(PE-PS))
			aoz.sourcePos="0:386:16";
			vars.PID$=this.aoz.getMid$(vars.G$,vars.PS,(vars.PE-vars.PS));
			// Else
			return{type:1,label:9};
		};
		this.blocks[8]=function(aoz,vars)
		{
			// PID$=Right$(G$,PS)
			aoz.sourcePos="0:388:16";
			vars.PID$=this.aoz.getRight$(vars.G$,vars.PS);
			// End If
			aoz.sourcePos="0:389:12";
		};
		this.blocks[9]=function(aoz,vars)
		{
			// Else
			return{type:1,label:11};
		};
		this.blocks[10]=function(aoz,vars)
		{
			// PID$=G$
			aoz.sourcePos="0:391:12";
			vars.PID$=vars.G$;
			// End If
			aoz.sourcePos="0:392:8";
		};
		this.blocks[11]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:393:4";
		};
		this.blocks[12]=function(aoz,vars)
		{
			// End Function(PID$)
			var parent=this.parent;
			while(parent)
			{
				parent.results[this.currentResult]=vars.PID$;
				parent=parent.parent;
			}
			return{type:0}
		};
	};
	this.f_gamepadname$=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="function";
		this.parent=parent;
		this.vars={};
		this.vars._n=0;
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// gName$=""
			aoz.sourcePos="0:397:4";
			this.root.vars.GName$="";
			// G$=Gamepad Name$(_n)
			aoz.sourcePos="0:398:4";
				result = aoz.gamepadName$(vars._n);
			vars.G$=result ;
			// PS=Instr(G$," (")
			aoz.sourcePos="0:399:4";
			vars.PS=aoz.fp2Int(aoz.instr(vars.G$," ("));
			// If PS > 0	// Chrome, Edge, Brave, Opera, Vivaldi
			aoz.sourcePos="0:400:4";
			if(!((vars.PS)>(0)))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// gName$=Left$(G$,PS-1)
			aoz.sourcePos="0:401:8";
			this.root.vars.GName$=this.aoz.getLeft$(vars.G$,vars.PS-1);
			// Else // Firefox, Seamonkey, Safari
			return{type:1,label:9};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// VPE=Instr(G$,"-")
			aoz.sourcePos="0:403:8";
			vars.VPE=aoz.fp2Int(aoz.instr(vars.G$,"-"));
			// If VPE>0
			aoz.sourcePos="0:404:8";
			if(!((vars.VPE)>(0)))
				return{type:1,label:7};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// VPE=Instr(G$,"-",VPE+1)
			aoz.sourcePos="0:405:12";
			vars.VPE=aoz.fp2Int(aoz.instr(vars.G$,"-",vars.VPE+1));
			// If VPE>0
			aoz.sourcePos="0:406:12";
			if(!((vars.VPE)>(0)))
				return{type:1,label:5};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// gName$=Right$(G$,Len(G$)-VPE)
			aoz.sourcePos="0:407:16";
			this.root.vars.GName$=this.aoz.getRight$(vars.G$,(vars.G$).length-vars.VPE);
			// Else
			return{type:1,label:6};
		};
		this.blocks[5]=function(aoz,vars)
		{
			// gName$=G$
			aoz.sourcePos="0:409:16";
			this.root.vars.GName$=vars.G$;
			// End If
			aoz.sourcePos="0:410:12";
		};
		this.blocks[6]=function(aoz,vars)
		{
			// Else
			return{type:1,label:8};
		};
		this.blocks[7]=function(aoz,vars)
		{
			// gName$=G$
			aoz.sourcePos="0:412:12";
			this.root.vars.GName$=vars.G$;
			// End If
			aoz.sourcePos="0:413:8";
		};
		this.blocks[8]=function(aoz,vars)
		{
			// End If
			aoz.sourcePos="0:414:4";
		};
		this.blocks[9]=function(aoz,vars)
		{
			// End Function(gName$)
			var parent=this.parent;
			while(parent)
			{
				parent.results[this.currentResult]=this.root.vars.GName$;
				parent=parent.parent;
			}
			return{type:0}
		};
	};
	this.f_roundup=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=parent.root;
		this.className="function";
		this.parent=parent;
		this.vars={};
		this.vars._n_f=0.0;
		for ( v in args )
		{
			if ( typeof args[ v ] != "undefined" ) 
				this.vars[ v ] = args[v];
		}
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			// i = Int(_n#)
			aoz.sourcePos="0:418:4";
			vars.i=aoz.fp2Int(aoz.fp2Int(vars._n_f) );
			// result#=i
			aoz.sourcePos="0:419:4";
			vars.result_f=vars.i;
			// If _n#-i > 0
			aoz.sourcePos="0:420:4";
			if(!((vars._n_f-vars.i)>(0)))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// result#=i+1
			aoz.sourcePos="0:421:8";
			vars.result_f=vars.i+1;
			// End If
			aoz.sourcePos="0:422:4";
		};
		this.blocks[2]=function(aoz,vars)
		{
			// End Function(result#)
			var parent=this.parent;
			while(parent)
			{
				parent.results[this.currentResult]=vars.result_f;
				parent=parent.parent;
			}
			return{type:0}
		};
	};
	this.aoz.run(this,0,args);
	this.aoz.v1_0_asset=new v1_0_asset(this.aoz,args);
	this.aoz.v1_0_collisions=new v1_0_collisions(this.aoz,args);
	this.aoz.v1_0_colours=new v1_0_colours(this.aoz,args);
	this.aoz.v1_0_controllers=new v1_0_controllers(this.aoz,args);
	this.aoz.v1_0_graphics=new v1_0_graphics(this.aoz,args);
	this.aoz.v1_0_maths=new v1_0_maths(this.aoz,args);
	this.aoz.v1_0_rainbows=new v1_0_rainbows(this.aoz,args);
	this.aoz.v1_0_screens=new v1_0_screens(this.aoz,args);
	this.aoz.v1_0_sprites=new v1_0_sprites(this.aoz,args);
	this.aoz.v1_0_strings=new v1_0_strings(this.aoz,args);
	this.aoz.v1_0_td=new v1_0_td(this.aoz,args);
	this.aoz.v1_0_textwindows=new v1_0_textwindows(this.aoz,args);
	this.c_movement=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="movement";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.defaults={
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2069:4";
			// Javascript
			console.log( "youpi!" )
			// End Javascript
			return{type:0}
			return{type:0}
		};
		this.m_friendupdate=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2073:4";
				// Javascript
				return 0;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.friendupdate_m=new this.m_friendupdate(aoz,this,{});
	};
	this.c_physics=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="physics";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.noDefaults=true;
		this.defaults={
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2421:4";
			return{type:0}
			return{type:0}
		};
		this.m_friendupdate=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2424:4";
				// Javascript
				return 0;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.friendupdate_m=new this.m_friendupdate(aoz,this,{});
	};
	this.c_tdobject=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="tdobject";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=[];
		this.noDefaults=true;
		this.defaults={
			X_f:0,
			Y_f:0,
			Z_f:0,
			AngleX_f:0,
			AngleY_f:0,
			AngleZ_f:0,
			ScaleX_f:1,
			ScaleY_f:1,
			ScaleZ_f:1,
			Scale_f:1,
			Visible:this.aoz.platformTrue,
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2626:4";
			// Javascript
			for ( var p in this.defaults )
			{
				if ( typeof vars[ p ] == 'undefined' )
					vars[ p ] = this.defaults[ p ];
			}
			this.updateList = 
			{
				X_f: function(args,v){args.position.x=v;},
				Y_f: function(args,v){args.position.y=v;},
				Z_f: function(args,v){args.position.z=v;},
				Position_c: function(args,v)
				{
					if (v.className!='vector')
						throw { error:'illegal_function_call', parameter: v.className };
					args.position.x=v.vars.X_f,
					args.position.y=v.vars.Y_f,
					args.position.z=v.vars.Z_f
				},
				Width_f: function(args,v){args.dimensions.x=v;},
				Height_f: function(args,v){args.dimensions.y=v;},
				Depth_f: function(args,v){args.dimensions.z=v;},
				AngleX_f: function(args,v){args.rotation.x=this.aoz.getAngle(v);},
				AngleY_f: function(args,v){args.rotation.y=this.aoz.getAngle(v);},
				AngleZ_f: function(args,v){args.rotation.z=this.aoz.getAngle(v);},
				Scale_f: function(args,v){args.scale={x:v,y:v,z:v};},
				ScaleX_f: function(args,v){args.scale.x=v;},
				ScaleY_f: function(args,v){args.scale.y=v;},
				ScaleZ_f: function(args,v){args.scale.z=v;},
				Movement: function(args,v)
				{
					if ( this.vars.Movement )
					{
						aoz.destroyFriend( this, this.vars.Movement );
					}
					this.vars.Movement = v;
					this.friends.push( v );
				},
				Physics: function(args,v)
				{
					if ( this.vars.Physics )
					{
						aoz.destroyFriend( this, this.vars.Physics );
					}
					this.vars.Physics = v;
					this.friends.push(v);
				},
				Joint: function(args,v)
				{
					if ( this.vars.Joint )
					{
						aoz.destroyFriend( this, this.vars.Joint );
					}
					this.vars.Joint = v;
					this.friends.push(v);
				}
			};
			this.updateArgs = 
			{
				position: {},
				rotation: {},
				dimensions: {},
				scale: {}
			};
			// End Javascript
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
			return{type:0}
		};
		this.m_attach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2698:4";
				// Javascript
				var aObject = aoz.getObject( vars.ToObject$ );
				if ( aObject.object3D.getObjectById( this.object3D.id ) )
					throw { error: 'object_already_children', parameter: aObject.object3D.name };
				aObject.object3D.attach( this.object3D );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_detach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2706:4";
				// Javascript
				if ( !this.object3D.parent )
					throw { error: 'object_no_parent', parameter: this.object3D.name };
				this.object3D.parent( this.object3D );		
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_position=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2713:4";
				// Javascript
				var aObject = aoz.getObject( vars.At );
				this.object3D.position.copy( aObject.object3D.position );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_rotation=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2719:4";
				// Javascript
				var aObject = aoz.getObject( vars.index );
				this.object3D.quaternion.copy( aObject.object3D.quaternion );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_lookat=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2725:4";
				// Javascript
				if ( vars.At$ )
				{
					var aObject = aoz.getObject( vars.At$ );
					this.object3D.lookAt( aObject.object3D.position );
				}
				else
				{
					this.object3D.lookAt( vars.X_f, vars.Y_f, vars.Z_f );
				}
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_update=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2739:4";
				// Javascript
				if ( !this.object3D )
					return 1;
				if ( this.varsModified )
				{
					if ( !this.args )
					{
						this.args = {};
						for ( var i in this.updateArgs )
							this.args[ i ] = this.updateArgs[ i ];
					}
					this.modified = false;
					for ( var variable in this.varsModified )
					{
						this.updateList[ variable ].call( this, this.args, this.varsModified[ variable ] );
						this.vars[ variable ] = this.varsModified[ variable ];
						this.modified = true;
					}
					this.varsModifiedFriends = this.varsModified;
					this.varsModified = null;			
				}
				if ( this.friends.length )
					this.aoz.updateFriends( this, this.friends, this.deltaTime );
				this.argsModified = this.args;
				this.args = null;
				return 1;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.attach_m=new this.m_attach(aoz,this,{});
		this.detach_m=new this.m_detach(aoz,this,{});
		this.set_position_m=new this.m_set_position(aoz,this,{});
		this.set_rotation_m=new this.m_set_rotation(aoz,this,{});
		this.lookat_m=new this.m_lookat(aoz,this,{});
		this.update_m=new this.m_update(aoz,this,{});
	};
	this.c_mesh=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="mesh";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=["TDObject"];
		this.noDefaults=true;
		this.defaults={
			Color:0xFFFFFF,
			RepeatX:1,
			RepeatY:1,
			CollisionGroup:1,
			CollisionMask:0xFFFFFFFF,
			CastShadow:false,
			ReceiveShadow:false,
			X_f:0,
			Y_f:0,
			Z_f:0,
			AngleX_f:0,
			AngleY_f:0,
			AngleZ_f:0,
			ScaleX_f:1,
			ScaleY_f:1,
			ScaleZ_f:1,
			Scale_f:1,
			Visible:this.aoz.platformTrue,
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:2778:4";
			// Javascript
			this.updateList.Image = function(args,v){args.image=v;};
			this.updateList.Texture = function(args,v){args.texture=v;};
			this.updateList.Material = function(args,v){args.material=v;};
			this.updateList.Visible = function(args,v){args.visible=v;};
			this.updateList.Color =  function(args,v){args.color=v;};
			this.updateList.RepeatX = function(args,v){args.repeatX=v;};
			this.updateList.RepeatY = function(args,v){args.repeatY=v;};
			this.updateList.CastShadow = function(args,v){args.castShadows=v;};
			this.updateList.ReceiveShadow = function(args,v){args.receiveShadows=v;};
			var self = this;
			if ( this.className == 'mesh' )
			{
				var result = aoz.currentScreen.screen3D.currentScene.mesh( this.name,
				{
					parent: vars.Parent,
					position: { x: vars.X_f, y: vars.Y_f, z: vars.Z_f },
					rotation: { x: aoz.getAngle(vars.AngleX_f), y: aoz.getAngle(vars.AngleY_f), z: aoz.getAngle(vars.AngleZ_f) },
					scale: typeof vars.Scale_f != 'undefined' ? { x: vars.Scale_f, y: vars.Scale_f, z: vars.Scale_f } : { x: vars.ScaleX_f, y: vars.ScaleY_f, z: vars.ScaleZ_f },
					image: vars.Image,
					texture: vars.Texture, 
					material: vars.Material,
					visible: vars.Visible,
					color: vars.Color, 
					repeatX: vars.RepeatX,
					repeatY: vars.RepeatY,
					collisionGroup: vars.CollisionGroup, 
					collisionMask: vars.CollisionMask,
					castShadow: vars.CastShadow,
					receiveShadow: vars.ReceiveShadow,
				}, function( response, data, extra )
				{
					if ( response )
					{
						self.mesh = data;
						self.object3D = data;
					}
				} );
				return result == false;
			}
			return false;
			// End Javascript
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
			return{type:0}
		};
		this.m_update=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2826:4";
				// Javascript
				this.childOf.update_m.blocks[ 0 ].call( this, aoz, vars );
				if ( this.modified && this.argsModified )
				{
					aoz.currentScreen.screen3D.currentScene.mesh( this.name, this.argsModified );
					this.modified = false;
				}
				return 1;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_attach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2698:4";
				// Javascript
				var aObject = aoz.getObject( vars.ToObject$ );
				if ( aObject.object3D.getObjectById( this.object3D.id ) )
					throw { error: 'object_already_children', parameter: aObject.object3D.name };
				aObject.object3D.attach( this.object3D );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_detach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2706:4";
				// Javascript
				if ( !this.object3D.parent )
					throw { error: 'object_no_parent', parameter: this.object3D.name };
				this.object3D.parent( this.object3D );		
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_position=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2713:4";
				// Javascript
				var aObject = aoz.getObject( vars.At );
				this.object3D.position.copy( aObject.object3D.position );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_rotation=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2719:4";
				// Javascript
				var aObject = aoz.getObject( vars.index );
				this.object3D.quaternion.copy( aObject.object3D.quaternion );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_lookat=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2725:4";
				// Javascript
				if ( vars.At$ )
				{
					var aObject = aoz.getObject( vars.At$ );
					this.object3D.lookAt( aObject.object3D.position );
				}
				else
				{
					this.object3D.lookAt( vars.X_f, vars.Y_f, vars.Z_f );
				}
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.update_m=new this.m_update(aoz,this,{});
		this.attach_m=new this.m_attach(aoz,this,{});
		this.detach_m=new this.m_detach(aoz,this,{});
		this.set_position_m=new this.m_set_position(aoz,this,{});
		this.set_rotation_m=new this.m_set_rotation(aoz,this,{});
		this.lookat_m=new this.m_lookat(aoz,this,{});
	};
	this.c_lines=function(aoz,parent,args)
	{
		this.aoz=aoz;
		this.root=this;
		this.className="lines";
		this.parent=parent;
		this.inLine = true;
		this.extendsList=["Mesh"];
		this.noDefaults=true;
		this.defaults={
			PointsX_f:null,
			PointsY_f:null,
			PointsZ_f:null,
			Colors:null,
			Loop:false,
			Color:0xFFFFFF,
			RepeatX:1,
			RepeatY:1,
			CollisionGroup:1,
			CollisionMask:0xFFFFFFFF,
			CastShadow:false,
			ReceiveShadow:false,
			X_f:0,
			Y_f:0,
			Z_f:0,
			AngleX_f:0,
			AngleY_f:0,
			AngleZ_f:0,
			ScaleX_f:1,
			ScaleY_f:1,
			ScaleZ_f:1,
			Scale_f:1,
			Visible:this.aoz.platformTrue,
		};
		this.modified=false;
		this.friends=[];
		this.blocks=[];
		this.blocks[0]=function(aoz,vars)
		{
			aoz.sourcePos="0:3121:4";
			// Javascript
			var self = this;
			if ( !vars.PointsX_f || !vars.PointsY_f || !vars.PointsZ_f )
				throw { error: 'syntax_error', parameter: 'missing parameters' };
			this.mesh = aoz.currentScreen.screen3D.currentScene.lines( this.name,
			{
				parent: vars.Parent,
				position: { x: vars.X_f, y: vars.Y_f, z: vars.Z_f },
				rotation: { x: aoz.getAngle(vars.AngleX_f), y: aoz.getAngle(vars.AngleY_f), z: aoz.getAngle(vars.AngleZ_f) },
				scale: typeof vars.Scale_f != 'undefined' ? { x: vars.Scale_f, y: vars.Scale_f, z: vars.Scale_f } : { x: vars.ScaleX_f, y: vars.ScaleY_f, z: vars.ScaleZ_f },
				image: vars.Image,
				texture: vars.Texture,
				material: vars.Material,
				visible: vars.Visible,
				color: vars.Color,
				repeatX: vars.RepeatX,
				repeatY: vars.RepeatY,
				collisionGroup: vars.CollisionGroup,
				collisionMask: vars.CollisionMask,
				pointsX: vars.PointsX_f.array,
				pointsY: vars.PointsY_f.array,
				pointsZ: vars.PointsZ_f.array,
				colors: vars.Colors ? vars.Colors.array : undefined,
				loop: vars.loop
			} );
			this.object3D = this.mesh;
			// End Javascript
		};
		this.blocks[1]=function(aoz,vars)
		{
			return{type:0}
			return{type:0}
		};
		this.m_update=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:3154:4";
				// Javascript
				this.childOf.childOf.update_m.blocks[ 0 ].call( this, aoz, vars );
				if ( this.modified )
				{
					aoz.currentScreen.screen3D.currentScene.line( this.name, this.argsModified );
					this.modified = false;
				}
				return 1;
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_attach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2698:4";
				// Javascript
				var aObject = aoz.getObject( vars.ToObject$ );
				if ( aObject.object3D.getObjectById( this.object3D.id ) )
					throw { error: 'object_already_children', parameter: aObject.object3D.name };
				aObject.object3D.attach( this.object3D );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_detach=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2706:4";
				// Javascript
				if ( !this.object3D.parent )
					throw { error: 'object_no_parent', parameter: this.object3D.name };
				this.object3D.parent( this.object3D );		
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_position=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2713:4";
				// Javascript
				var aObject = aoz.getObject( vars.At );
				this.object3D.position.copy( aObject.object3D.position );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_set_rotation=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2719:4";
				// Javascript
				var aObject = aoz.getObject( vars.index );
				this.object3D.quaternion.copy( aObject.object3D.quaternion );
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.m_lookat=function(aoz,parent,args)
		{
			this.aoz=aoz;
			this.root=parent.root;
			this.className="method";
			this.parent=parent;
			this.inLine = true;
			this.blocks=[];
			this.blocks[0]=function(aoz,vars)
			{
				aoz.sourcePos="0:2725:4";
				// Javascript
				if ( vars.At$ )
				{
					var aObject = aoz.getObject( vars.At$ );
					this.object3D.lookAt( aObject.object3D.position );
				}
				else
				{
					this.object3D.lookAt( vars.X_f, vars.Y_f, vars.Z_f );
				}
				// End Javascript
				// End Method
				return{type:0}
			};
		};
		this.update_m=new this.m_update(aoz,this,{});
		this.attach_m=new this.m_attach(aoz,this,{});
		this.detach_m=new this.m_detach(aoz,this,{});
		this.set_position_m=new this.m_set_position(aoz,this,{});
		this.set_rotation_m=new this.m_set_rotation(aoz,this,{});
		this.lookat_m=new this.m_lookat(aoz,this,{});
	};
	this.aoz.v1_0_three_d=new v1_0_three_d(this.aoz,args);
	this.aoz.v1_0_time=new v1_0_time(this.aoz,args);
	this.aoz.ext_browser=new ext_browser(this.aoz,args);
	this.aoz.ext_net=new ext_net(this.aoz,args);
	this.aoz.ext_tween=new ext_tween(this.aoz,args);
};
