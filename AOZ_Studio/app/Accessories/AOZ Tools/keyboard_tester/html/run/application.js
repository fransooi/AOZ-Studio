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
// Compiled with AOZ Transpiler Version 14.03 on the 20/02/2023-16:10:08
//
function Application( canvasId, args )
{
	this.root=this;
	this.parent=this;
	this.contextName='application';
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsImluZm9zIjp7ImFwcGxpY2F0aW9uTmFtZSI6Ik5hbWUgb2YgeW91ciBhcHBsaWNhdGlvbi4iLCJhdXRob3IiOiJCeSBZb3UiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAwLjAiLCJkYXRlIjoiQ3JlYXRlZCBvbiB0aGUgLi4uIiwiY29weXJpZ2h0IjoiKGMpIFlvdXIgQ29ycG9yYXRpb24gVW5saW1pdGVkIiwic3RhcnQiOiJtYWluLmFveiJ9LCJjb21waWxhdGlvbiI6eyJwbGF0Zm9ybSI6ImFveiIsImtleW1hcCI6ImFveiIsIm1hY2hpbmUiOiJtb2Rlcm4iLCJzcGVlZCI6ImZhc3QiLCJzeW50YXgiOiJlbmhhbmNlZCIsImVuZGlhbiI6ImxpdHRsZSIsInN0cmluZ0Jhc2VJbmRleCI6MSwibm9XYXJuaW5nIjpbXSwiZGlzcGxheUVuZEFsZXJ0IjpmYWxzZSwiZGlzcGxheUVycm9yQWxlcnQiOnRydWUsInVzZUxvY2FsVGFicyI6dHJ1ZSwiaW5jbHVkZVBhdGhzIjpbXX0sImRpc3BsYXkiOnsidHZTdGFuZGFyZCI6InBhbCIsInJlZnJlc2hSYXRlIjo2MCwid2lkdGgiOjE5MjQsImhlaWdodCI6MTM4MywiYmFja2dyb3VuZCI6ImNvbG9yIiwiYmFja2dyb3VuZENvbG9yIjoiIzAwMDAwMCIsImJvZHlCYWNrZ3JvdW5kQ29sb3IiOiIjMDAwMDAwIiwiYm9keUJhY2tncm91bmRJbWFnZSI6Ii4vcnVudGltZS9yZXNvdXJjZXMvc3Rhcl9uaWdodC5qcGVnIiwic21vb3RoaW5nIjpmYWxzZSwic2NhbGVYIjoxLCJzY2FsZVkiOjEsInNjcmVlblNjYWxlIjoxLCJmcHMiOmZhbHNlLCJmcHNGb250IjoiMTJweCBWZXJkYW5hIiwiZnBzQ29sb3IiOiIjRkZGRjAwIiwiZnBzWCI6MTAsImZwc1kiOjE2LCJmdWxsUGFnZSI6dHJ1ZSwiZnVsbFNjcmVlbiI6dHJ1ZSwia2VlcFByb3BvcnRpb25zIjp0cnVlLCJmdWxsU2NyZWVuSWNvbiI6ZmFsc2UsImZ1bGxTY3JlZW5JY29uWCI6LTM0LCJmdWxsU2NyZWVuSWNvblkiOjIsImZ1bGxTY3JlZW5JY29uSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL2Z1bGxfc2NyZWVuLnBuZyIsInNtYWxsU2NyZWVuSWNvbkltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9zbWFsbF9zY3JlZW4ucG5nIiwicmVuZGVyZXIiOiJjYW52YXMifSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOmZhbHNlLCJ3YWl0U291bmRzIjowLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJjb2xsaXNpb25zIjp7Im1ldGhvZCI6ImZpbmUiLCJwcmVjaXNpb24iOjY0LCJhbHBoYVRocmVzaG9sZCI6MX0sInJhaW5ib3dzIjp7Im1vZGUiOiJzbG93In0sImZvbnRzIjp7Imxpc3RGb250cyI6IlBDIiwiYW1pZ2EiOltdLCJnb29nbGUiOlsicm9ib3RvIl19LCJzb3VuZHMiOnsibW9kZSI6ImFveiIsInZvbHVtZSI6MSwicHJlbG9hZCI6dHJ1ZSwic291bmRQb29sU2l6ZSI6MzJ9LCJnYW1lcGFkIjp7Im1hcHBpbmciOnsidXAiOiJBcnJvd1VwIiwiZG93biI6IkFycm93RG93biIsImxlZnQiOiJBcnJvd0xlZnQiLCJyaWdodCI6IkFycm93UmlnaHQiLCJmaXJlIjoiU3BhY2UifX0sImZpbGVTeXN0ZW0iOnsiY2FzZVNlbnNpdGl2ZSI6ZmFsc2V9LCJkZWZhdWx0Ijp7InNjcmVlbiI6eyJ4IjowLCJ5IjowLCJ3aWR0aCI6MTkyMCwiaGVpZ2h0IjoxMDgwLCJudW1iZXJPZkNvbG9ycyI6MzIsInBpeGVsTW9kZSI6Imxvd3JlcyIsInBhbGV0dGUiOlsiIzAwMDAwMCIsIiNGRkZGRkYiLCIjRDFEMUQxIiwiI0EyQTJBMiIsIiM3MzczNzMiLCIjNDQ0NDQ0IiwiI0ZGMDAwMCIsIiNEMTAwMDAiLCIjQTIwMDAwIiwiIzczMDAwMCIsIiM0NDAwMDAiLCIjMDBGRjAwIiwiIzAwRDEwMCIsIiMwMEEyMDAiLCIjMDA3MzAwIiwiIzAwNDQwMCIsIiNGRkZGMDAiLCIjRDFEMTAwIiwiI0EyQTIwMCIsIiM3MzczMDAiLCIjNDQ0NDAwIiwiI0ZGN0YwMCIsIiNFMjcxMDAiLCIjQzQ2MjAwIiwiI0E2NTMwMCIsIiM4ODQ0MDAiLCIjMDAwMEZGIiwiIzAwMDBEMSIsIiMwMDAwQTIiLCIjMDAwMDczIiwiIzAwMDA0NCIsIiMwMEZGRkYiLCIjMDBEMUQxIiwiIzAwQTJBMiIsIiMwMDczNzMiLCIjMDA0NDQ0IiwiI0ZGMDBGRiIsIiNEMTAwRDEiLCIjQTIwMEEyIiwiIzczMDA3MyIsIiM0NDAwNDQiLCIjRkZBMTAwIiwiI0ZGQjMxMiIsIiNGRkM2MjUiLCIjRkZEODM3IiwiI0ZGRUI0QSIsIiNGRkZFNUQiLCIjMDAyOTY1IiwiIzEyMzk3NSIsIiMyNDQ5ODUiLCIjMzY1OTk1IiwiIzQ4NjlBNSIsIiM1QTc5QjUiLCIjQkY3MTdGIiwiI0IyNjc3MyIsIiNBNDVENjYiLCIjOTc1MzU5IiwiIzg5NDk0QyIsIiM3QjNGM0YiLCIjODI1MkI0IiwiIzYyM0U4NyIsIiM0MTI5NUEiLCIjMjExNTJEIiwiIzAwMDAwMCJdLCJ3aW5kb3ciOnsieCI6MCwieSI6MCwid2lkdGgiOjgwLCJoZWlnaHQiOjI1LCJib3JkZXIiOjAsInBhcGVyIjowLCJwZW4iOjEsImJhY2tncm91bmQiOiJvcGFxdWUiLCJmb250Ijp7Im5hbWUiOiJJQk0gUGxleCBNb25vIiwidHlwZSI6Imdvb2dsZSIsImhlaWdodCI6NDB9LCJjdXJzb3JPbiI6ZmFsc2UsImN1cnNvckltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9jdXJzb3JfcGMucG5nIiwiY3Vyc29yQ29sb3JzIjpbeyJyIjo2OCwiZyI6NjgsImIiOjAsImEiOjEyOH0seyJyIjoxMzYsImciOjEzNiwiYiI6MCwiYSI6MTI4fSx7InIiOjE4NywiZyI6MTg3LCJiIjowLCJhIjoxMjh9LHsiciI6MjIxLCJnIjoyMjEsImIiOjAsImEiOjEyOH0seyJyIjoyMzgsImciOjIzOCwiYiI6MCwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjozNCwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjoxMzYsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MjA0LCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjI1NSwiYSI6MTI4fSx7InIiOjE3MCwiZyI6MTcwLCJiIjoyNTUsImEiOjEyOH0seyJyIjoxMzYsImciOjEzNiwiYiI6MjA0LCJhIjoxMjh9LHsiciI6MTAyLCJnIjoxMDIsImIiOjE3MCwiYSI6MTI4fSx7InIiOjM0LCJnIjozNCwiYiI6MTAyLCJhIjoxMjh9LHsiciI6MCwiZyI6MCwiYiI6NjgsImEiOjEyOH0seyJyIjowLCJnIjowLCJiIjoxNywiYSI6MTI4fSx7InIiOjAsImciOjAsImIiOjAsImEiOjEyOH1dfX19fQ=='));
	var options =
	{
		manifest: this.manifest,
		sources: JSON.parse(atob('W3sicGF0aCI6IkM6L0FPWl9TdHVkaW8vQU9aX1N0dWRpby9hcHAvQWNjZXNzb3JpZXMvQU9aIFRvb2xzL2tleWJvYXJkX3Rlc3Rlci9rZXlib2FyZC5hb3oiLCJzb3VyY2UiOiIgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5WZXJzaW9uJD1cInYwLjkyXCJcclxuXHJcbi8qXHJcblxyXG5cdEFPWiBLZXlib2FyZCB0ZXN0ZXIgLSBCcmlhbiBGbGFuYWdhbiwgQXVndXN0IDIwMjBcclxuXHRUZXN0cyBLZXkgU2F0ZShuKSwgS2V5IFNoaWZ0LCBTY2FuU2hpZnQsIElua2V5JCBmdW5jdGlvbnMuXHJcblxyXG4gICAgSW4gXCJhb3pcIiBtb2RlLCB5b3UgZ2V0IHNpbXVsYXRlZCBzY2FuIGNvZGVzIGZyb20gMCB0byAyNTUgZ2VuZXJhdGVkIGJ5IHRoZSBzdGFuZGFyZFxyXG5cdEphdmFTY3JpcHQgS2V5Ym9hcmQgQVBJLiAgSW4gXCJhbWlnYVwiIG1vZGUsIHlvdSBnZXQgc2ltdWxhdGVkIHNjYW4gY29kZXMgZnJvbSAwIHRvIDEyNyxcclxuXHRiYXNlZCBvbiB0aGUgcmVhbCBBbWlnYSBjb21wdXRlcnMnIHNjYW4gY29kZXMuICAoRm9yIGtleXMgbm90IG5vcm1hbGx5IGluIHRoZSBBbWlnYVxyXG5cdGtleW1hcCwgdGhlIG5ldyBrZXkgY29kZXMgaGF2ZSBiZWVuIGFkZGVkIHdoZW4gcG9zc2libGUuKVxyXG5cclxuKi9cclxuXHJcbiAgLy9cclxuIC8vIFBsYXRmb3JtLXNwZWNpZmljIHNldHVwXHJcbi8vXHJcbklmIE1hbmlmZXN0JCA9IFwiYW1pZ2FcIlxyXG5cdCAgICAgICAgICAgICAgICAgICBcclxuXHQgICAgICAgICAgICAgICAgICBcclxuXHRzY3JXaWR0aCM9MzI0IDogc2NySGVpZ2h0IyA9IDI1NlxyXG5cdFNjcmVlbiBPcGVuIDAsc2NyV2lkdGgjLHNjckhlaWdodCMsMzIsTG93cmVzXHJcblx0Y2hhcldpZHRoIyA9WCBHcmFwaGljKDEpIDogdGV4dENvbHMjID0gc2NyV2lkdGgjIC8gY2hhcldpZHRoI1xyXG5cdGNoYXJIZWlnaHQjPVkgR3JhcGhpYygxKSA6IHRleHRSb3dzIyA9IHNjckhlaWdodCMgLyBjaGFySGVpZ2h0I1xyXG5cdFBhbGV0dGUgMCwkRkZGLCQ3NzcsJEZGMCwkRjAwLCQwRkYsJDBGMFxyXG5cdGxlZnRTaGlmdCA9IDEgOiByaWdodFNoaWZ0PTJcclxuXHRsZWZ0Q3RybD04IHwgJDgwMDAgOiByaWdodEN0cmw9OCAvLyBib3RoIGhhdmUgdGhlIDggYml0IHNpbmNlIG9uIEFtaWdhIHRoZXJlIHdhcyBvbmx5IG9uZVxyXG5cdC8vIGNvbnRyb2wga2V5LlxyXG5cdGxlZnRBbHQ9JDEwIDogcmlnaHRhbHQ9JDIwIC8vIDE2LDMyICgzMiBpcyBjb3JyZWN0IGZvciBBbWlnYSlcclxuXHRsZWZ0TWV0YT0kNDAgOiByaWdodE1ldGE9JDgwIC8vIDY0LDEyOFxyXG5cdCcgbG9ja2FibGUgc2hpZnQgc3RhdGVzXHJcblx0Y2Fwc0xvY2s9JDRcclxuXHRudW1Mb2NrPSQyMDAgLy8gNTEyXHJcblx0c2Nyb2xsTG9jaz0kNDAwIC8vIDEwMjRcclxuXHRmdW5jTG9jaz0kODAwIC8vIDIwNDhcclxuXHRzZXBhcmF0b3JPZmZzZXQ9WSBHcmFwaGljKDYuNSkrMSAnIHdhcyBZIEdyYXBoaWMoNykrMVxyXG5FbHNlICAvLyBhb3ogbW9kZSBjaGFyIHNpemUgPSAyNCB4IDQzLjIgcGl4ZWxzXHJcblx0IC8vIHRleHQgY29scyA9IDk2MC8yNCA9IDQwIGNvbHVtbnNcclxuICAgIC8vIHRleHQgcm93cyA9IDEwMjQvMzIgPSAzMiBsaW5lc1xyXG4vL1x0UHJpbnQgXCJKdXN0IGVudGVyZWQgdGhlIEVMU0UuXCJcclxuLy9cdFdhaXQgS2V5XHJcblxyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcblx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcblx0c2NyV2lkdGgjPTk2NiA6IHNjckhlaWdodCM9MTM4MyAnIHNjckhlaWdodCMgPSAxMzgzXHJcblx0U2NyZWVuIE9wZW4gMCxzY3JXaWR0aCMqMixzY3JIZWlnaHQjLDgsTG93cmVzLGxpbmVzPTMyICcgMTM4MyBoaWdoLCA0My4yIHBpeGVsIGNoYXIgaGVpZ2h0LCAyNCBweCBjaGFyIHdpZHRoXHJcblx0Y2hhcldpZHRoIyA9WCBHcmFwaGljKDEpIDogdGV4dENvbHMjID0gc2NyV2lkdGgjIC8gY2hhcldpZHRoI1xyXG5cdGNoYXJIZWlnaHQjPVkgR3JhcGhpYygxKSA6IHRleHRSb3dzIyA9IHNjckhlaWdodCMgLyBjaGFySGVpZ2h0I1xyXG5cdFNjcmVlbiBTY2FsZSAyLDFcclxuXHRTY3JlZW4gRGlzcGxheSAwLDAsMCwsXHJcblx0UGFsZXR0ZSAwLCRGRkZGRkYsJDc3Nzc3NywkRkZGRjAwLCRGRjAwMDAsJDAwRkZGRiwkMDBGRjAwXHJcblx0bGVmdFNoaWZ0PTEgOiByaWdodFNoaWZ0PTJcclxuXHRsZWZ0Q3RybD00IDogcmlnaHRDdHJsPThcclxuXHRsZWZ0QWx0PSQxMCA6IHJpZ2h0QWx0PSQyMCAvLyAxNiwzMlxyXG5cdGxlZnRNZXRhPSQ0MCA6IHJpZ2h0TWV0YT0kODAgLy8gNjQsIDEyOFxyXG4nIGxvY2thYmxlIHNoaWZ0IHN0YXRlc1xyXG5cdGNhcHNMb2NrPSQxMDBcdC8vIDI1NlxyXG5cdG51bUxvY2s9JDIwMFx0Ly8gNTEyXHJcblx0c2Nyb2xsTG9jaz0kNDAwXHQvLyAxMDI0XHJcblx0ZnVuY0xvY2s9JDgwMFx0Ly8gMjA0OFxyXG5cdHNlcGFyYXRvck9mZnNldD1ZIEdyYXBoaWMoNi41KVxyXG5FbmQgSWZcclxuICAvL1xyXG4gLy8gTWFpbiBjb2RlIHN0YXJ0cyBoZXJlLlxyXG4vL1xyXG54T2ZzPTEgOiB5T2ZzPTVcclxuQ2xzIDAgOiAgUGFwZXIgMCA6IEN1cnMgT2ZmIDogRmxhc2ggT2ZmXHJcbkluayAxXHJcbiAgLy9cclxuIC8vIFdpbmRvdyBib3JkZXJzXHJcbi8vXHJcbklmIE1hbmlmZXN0JD1cImFvelwiXHJcblx0Qm94IDAsMCBUbyBTY3JlZW4gV2lkdGgtc2NyV2lkdGgjLTQsU2NyZWVuIEhlaWdodC0xIC8vIGJvcmRlciBhcm91bmQgd2luZG93XHJcbkVsc2VcclxuXHRCb3ggMCwwIFRvIFNjcmVlbiBXaWR0aCxTY3JlZW4gSGVpZ2h0LTEgJyBTY3JlZW4gV2lkdGgtc2NyV2lkdGgjLFNjcmVlbiBIZWlnaHQtMVxyXG5FbmQgSWZcclxuXHJcbkRyYXcgMCxTY3JlZW4gSGVpZ2h0IC0gc2VwYXJhdG9yT2Zmc2V0IFRvIFNjcmVlbiBXaWR0aC0xLFNjcmVlbiBIZWlnaHQgLSBzZXBhcmF0b3JPZmZzZXRcclxuICAvL1xyXG4gLy8gRml4ZWQgZGlzcGxheSBlbGVtZW50c1xyXG4vL1xyXG4nIEtleSBTdGF0ZShuKSBkaXNwbGF5XHJcbkxvY2F0ZSAxLDEgOiBQZW4gMSA6IFByaW50IFwiQU9aIEtleSBTdGF0ZS9LZXkgU2hpZnQgdGVzdCAoXCI7TGVmdCQobWFuaWZlc3QkLDcpO1wiKVwiXHJcbkxvY2F0ZSAxLDMgOiBQZW4gNSA6IFByaW50IFwiS2V5IFN0YXRlKG4pIFwiOyA6IFBlbiA2IDogUHJpbnQgXCInIG4gc2hvd24gaW4gaGV4IGJlbG93LlwiXHJcblxyXG4nIFdhcm5pbmchXHJcbndhcm5pbmdNc2ckPVwiQ2xpY2sgaW4gd2luZG93IGJlZm9yZSBwcmVzc2luZyBrZXlzIVwiXHJcbkxvY2F0ZSAxLDE3ICt5T2ZzOiBQZW4gNCA6IFByaW50IHdhcm5pbmdNc2ckXHJcblJlcGVhdFxyXG5VbnRpbCBNb3VzZSBLZXkgPD4gMFxyXG5Mb2NhdGUgMSwxNit5T2ZzIDogUGVuIDQgOiBQcmludCBTcGFjZSQoTGVuKHdhcm5pbmdNc2ckKSkgLy8gKzEgY29tcGVuc2F0ZXMgZm9yIHNwYWNlJCBidWdcclxuTG9jYXRlIDEsMTcreU9mcyA6IFByaW50IFwiRWRpdCBtYW5pZmVzdCB0YWcgdG8gc3dpdGNoIHBsYXRmb3JtLlwiXHJcbicgS2V5IFNoaWZ0IGRpc3BsYXkuJ1xyXG5cclxuUGVuIDJcclxuTG9jYXRlIDEsMTkreU9mcyA6IFByaW50IFZlcnNpb24kXHJcblBlbiA1XHJcbkxvY2F0ZSAxMiwxOCt5T2ZzIDogUHJpbnQgXCJLZXkgU2hpZnRcIlxyXG5Mb2NhdGUgMTIsMTkreU9mcyA6IFByaW50IFwiU2NhblNoaWZ0XCJcclxuUGVuIDFcclxuTG9jYXRlIDEsMjEreU9mcyA6IFByaW50IFwiICAgICAgTGZ0IFJpdFwiXHJcbkxvY2F0ZSAxLDIyK3lPZnMgOiBQcmludCBcIlNoaWZ0XCJcclxuTG9jYXRlIDEsMjMreU9mcyA6IFByaW50IFwiQ3RybFwiXHJcbkxvY2F0ZSAxLDI0K3lPZnMgOiBQcmludCBcIkFsdFwiXHJcbkxvY2F0ZSAxLDI1K3lPZnMgOiBQcmludCBcIk1ldGFcIlxyXG4nIGxvY2thYmxlIGtleXNcclxuTG9jYXRlIDE1LDIyK3lPZnMgOiBQcmludCBcIkNhcHNcIlxyXG5Mb2NhdGUgMTUsMjMreU9mcyA6IFByaW50IFwiU2Nyb2xsXCJcclxuTG9jYXRlIDE1LDI0K3lPZnMgOiBQcmludCBcIk51bVwiXHJcbkxvY2F0ZSAxNSwyNSt5T2ZzIDogUHJpbnQgXCJGdW5jXCJcclxuXHJcbi8qXHJcbldpbmQgT3BlbiAxLCAzMyt4T2ZzLDUsNiwxMiwwXHJcblByaW50IFwiVmlld1wiXHJcblNjcmVlbiAwXHJcbiovXHJcblxyXG5Mb2NhdGUgMzMreE9mcyw1IDogUHJpbnQgXCJWaWV3XCJcclxuTG9jYXRlIDMzK3hPZnMsNiA6IFByaW50IFwibXVsdGlcIlxyXG5Mb2NhdGUgMzMreE9mcyw3IDogUHJpbnQgXCJrZXlcIlxyXG5Mb2NhdGUgMzMreE9mcyw4IDogUHJpbnQgXCJwcmVzc1wiXHJcbkxvY2F0ZSAzMyt4T2ZzLDkgOiBQcmludCBcImNvbWJvc1wiXHJcbkxvY2F0ZSAzMyt4T2ZzLDEwIDogUHJpbnQgXCJpblwiXHJcbkxvY2F0ZSAzMyt4T2ZzLDExIDogUHJpbnQgXCJ0aGlzXCJcclxuTG9jYXRlIDMzK3hPZnMsMTIgOiBQcmludCBcInRhYmxlXCJcclxuTG9jYXRlIDMzK3hPZnMsMTQgOiBQcmludCBcIkhhcmQtXCJcclxuTG9jYXRlIDMzK3hPZnMsMTUgOiBQcmludCBcIndhcmVcIlxyXG5Mb2NhdGUgMzMreE9mcywxNiA6IFByaW50IFwiZGVwZW4tXCJcclxuTG9jYXRlIDMzK3hPZnMsMTcgOiBQcmludCBcImRlbnQuXCJcclxuXHJcbidcclxuUGVuIDVcclxuTG9jYXRlIDIzLDI3IDogUHJpbnQgXCJJbmtleSRcIlxyXG5Mb2NhdGUgMjMsMjggOiBQcmludCBcIlNjYW5Db2RlXCJcclxuTG9jYXRlIDIzLDI5IDogUHJpbnQgXCJLZXkgTmFtZSRcIlxyXG4gIC8vXHJcbiAvLyBNYWluIGNvZGVcclxuLy9cclxuU2NyZWVuIDAgOiBQZW4gMlxyXG5wcmV2U2hpZnQ9MFxyXG5wcmV2U1M9MFxyXG5LTiQ9XCJcIiA6IFNTPTAgOiBJSyQ9XCJcIlxyXG5vbGRLTiQ9XCJcIlxyXG5cclxuRG9cclxuXHRJSyQ9SW5rZXkkIDogU1M9U2NhblNoaWZ0IDogU0M9U2NhbkNvZGVcclxuXHRGb3Igcj0wIFRvIDE1XHJcblx0XHRGb3IgYz0wIFRvIDE1XHJcblx0XHRcdGxvY2F0ZSBjKjIreE9mcyxyK3lPZnNcclxuXHRcdFx0S1MgPSBLZXkgU3RhdGUocioxNitjKVxyXG5cdFx0XHRJZiBLUyBUaGVuIFBlbiAzIDogUHJpbnQgUmlnaHQkKEhleCQocioxNitjLDIpLDIpIEVsc2UgUGVuIDIgOiBQcmludCBcIiAwXCIgLy8gc2hvdyBoZXggb2Yga2V5ICBzdGF0ZVxyXG5cdFx0TmV4dCBjXHJcblx0TmV4dCByXHJcblxyXG5cdEtTSCA9IEtleSBTaGlmdFxyXG5cdElmICBLU0ggPD4gcHJldlNoaWZ0XHJcblx0XHRMb2NhdGUgMjMsMTgreU9mcyA6IFBlbiAzIDogIFByaW50IFJpZ2h0JChCaW4kKEtTSCwxNiksMTYpIDogcHJldlNoaWZ0ID0gS1NIXHJcblx0XHRTaG93Qml0WzgsMjIreU9mcyxLU0ggJiBsZWZ0U2hpZnRdIDogU2hvd0JpdFsxMiwyMit5T2ZzLEtTSCAmIHJpZ2h0U2hpZnRdICcgU2hpZnRzXHJcblx0XHRTaG93Qml0WzgsMjMreU9mcyxLU0ggJiBsZWZ0Q3RybF0gOiBTaG93Qml0WzEyLDIzK3lPZnMsS1NIICYgcmlnaHRDdHJsXSAnIEN0cmxzXHJcblx0XHRTaG93Qml0WzgsMjQreU9mcyxLU0ggJiBsZWZ0QWx0XSA6IFNob3dCaXRbMTIsMjQreU9mcyxLU0ggJiByaWdodEFsdF0gJyBBbHRzXHJcblx0XHRTaG93Qml0WzgsMjUreU9mcyxLU0ggJiBsZWZ0TWV0YV0gOiBTaG93Qml0WzEyLDI1K3lPZnMsS1NIICYgcmlnaHRNZXRhXSAnIE1ldGFzXHJcblx0XHQvLyBsb2NraW5nIGtleXNcclxuXHRcdFNob3dCaXRbMjEsMjIreU9mcyxLU0ggJiBjYXBzTG9ja11cclxuXHRcdFNob3dCaXRbMjEsMjMreU9mcyxLU0ggJiBzY3JvbGxMb2NrXVxyXG5cdFx0U2hvd0JpdFsyMSwyNCt5T2ZzLEtTSCAmIG51bUxvY2tdXHJcblx0XHRTaG93Qml0WzIxLDI1K3lPZnMsS1NIICYgZnVuY0xvY2tdXHJcblx0RW5kIElmXHJcblx0ICAvL1xyXG5cdCAvLyBKdXN0IHN0YXJ0ZWQgYWRkaW5nIHRoaXMgZm9yIElua2V5JFxyXG5cdC8vXHJcblx0S04kPUtleSBOYW1lJFxyXG5cdElmIElLJCA8PiBcIlwiIC8vIElua2V5JCBjaGFuZ2VkXHJcblx0XHRMb2NhdGUgMjMsMTkreU9mcyA6IFBlbiAzIDogUHJpbnQgUmlnaHQkKEJpbiQoU1MsMTYpLDE2KSA6IHByZXZTUyA9IFNTICcgU2NhblNoaWZ0IHNob3VsZCBvbmx5IGNoYW5nZSBvbiBJbmtleSRcclxuXHRcdExvY2F0ZSAzMCwyNyA6IFBlbiAzXHJcblx0XHRJZiBJSyQgPj0gXCIgXCIgQW5kIElLJCA8PSBDaHIkKDI1NSkgVGhlbiBQcmludCBJSyQ7IEVsc2UgUHJpbnQgXCIgXCI7IC8vIHNob3cgcHJpbnRhYmxlIGNoYXJhY3RlcnNcclxuXHRcdC8vIEVpdGhlciB3YXksIHNob3cgQVNDKElLJClcclxuXHRcdElmIElLJDw+Q2hyJCgwKVxyXG5cdFx0XHRQcmludCBcIiBcIjtIZXgkKEFzYyhJSyQpLDIpO1xyXG5cdFx0XHRQcmludCBVc2luZyBcIigjIyMpXCI7QXNjKElLJClcclxuXHRcdEVsc2VcclxuXHRcdFx0UHJpbnQgXCIgICAgICBcIlxyXG5cdFx0RW5kIElmXHJcblx0XHRMb2NhdGUgMjMsMjYgOiBtYXhMZW49MTYgOiBMJD1MZWZ0JChLTiQsbWF4TGVuKSA6IFByaW50IEwkO1NwYWNlJChtYXhMZW4tTGVuKEwkKSlcclxuXHRcdExvY2F0ZSAzMiwyOCA6IFByaW50IEhleCQoU0MsMik7IDogUHJpbnQgVXNpbmcgXCIoIyMjKVwiO1NDXHJcblx0RW5kIElmXHJcblx0SWYgKEtOJCA8PiBvbGRLTiQpIEFuZCAoS04kIDw+IFwiXCIpXHJcblx0XHRQZW4gMyA6IExvY2F0ZSAyMywzMCA6IG1heExlbj0xNiA6IEwkPUxlZnQkKEtOJCxtYXhMZW4pIDogUHJpbnQgTCQ7U3BhY2UkKG1heExlbi1MZW4oTCQpKVxyXG5cdFx0b2xkS04kPUtOJFxyXG5cdEVuZCBJZlxyXG5cdFdhaXQgVmJsXHJcbkxvb3BcclxuXHJcblByb2NlZHVyZSBTaG93Qml0W3gseSxzdGF0dXNdXHJcblx0TG9jYXRlIHgseSA6IElmIHN0YXR1cyBUaGVuIFByaW50IFwiWFwiIEVsc2UgUHJpbnQgXCIgXCJcclxuRW5kIFByb2NcclxuXG5jbGFwZmluXG4iLCJudW1iZXIiOjAsInBhcmVudCI6bnVsbCwib2Zmc2V0TGluZXMiOjB9XQ==')),
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
	this.vars.Version$="";
	this.vars.scrWidth_f=0.0;
	this.vars.scrHeight_f=0.0;
	this.vars.charWidth_f=0.0;
	this.vars.textCols_f=0.0;
	this.vars.charHeight_f=0.0;
	this.vars.textRows_f=0.0;
	this.vars.leftShift=0;
	this.vars.rightShift=0;
	this.vars.leftCtrl=0;
	this.vars.rightCtrl=0;
	this.vars.leftAlt=0;
	this.vars.rightalt=0;
	this.vars.leftMeta=0;
	this.vars.rightMeta=0;
	this.vars.capsLock=0;
	this.vars.numLock=0;
	this.vars.scrollLock=0;
	this.vars.funcLock=0;
	this.vars.separatorOffset=0;
	this.vars.xOfs=0;
	this.vars.yOfs=0;
	this.vars.warningMsg$="";
	this.vars.prevShift=0;
	this.vars.prevSS=0;
	this.vars.KN$="";
	this.vars.SS=0;
	this.vars.IK$="";
	this.vars.oldKN$="";
	this.vars.SC=0;
	this.vars.r=0;
	this.vars.c=0;
	this.vars.KS=0;
	this.vars.KSH=0;
	this.vars.maxLen=0;
	this.vars.L$="";
	this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/Accessories/AOZ Tools/keyboard_tester/keyboard.aoz
		aoz.sourcePos="0:2:0";
		vars.Version$="v0.92";
		// If Manifest$ = "amiga"
		aoz.sourcePos="0:19:0";
		if(!((aoz.manifest.compilation.platform  )==("amiga")))
			return{type:1,label:3};
	};
	this.blocks[1]=function(aoz,vars)
	{
		// scrWidth#=324 : scrHeight# = 256
		aoz.sourcePos="0:22:4";
		vars.scrWidth_f=324;
		aoz.sourcePos="0:22:20";
		vars.scrHeight_f=256;
		// Screen Open 0,scrWidth#,scrHeight#,32,Lowres
		aoz.sourcePos="0:23:4";
		aoz.screenOpen(
		{
			index:0,
			width:vars.scrWidth_f,
			height:vars.scrHeight_f,
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
	this.blocks[2]=function(aoz,vars)
	{
		// charWidth# =X Graphic(1) : textCols# = scrWidth# / charWidth#
		aoz.sourcePos="0:24:4";
		vars.charWidth_f=aoz.currentScreen.currentTextWindow.xGraphic(1);
		aoz.sourcePos="0:24:31";
		vars.textCols_f=aoz.checkNumber(vars.scrWidth_f/vars.charWidth_f);
		// charHeight#=Y Graphic(1) : textRows# = scrHeight# / charHeight#
		aoz.sourcePos="0:25:4";
		vars.charHeight_f=aoz.currentScreen.currentTextWindow.yGraphic(1);
		aoz.sourcePos="0:25:31";
		vars.textRows_f=aoz.checkNumber(vars.scrHeight_f/vars.charHeight_f);
		// Palette 0,$FFF,$777,$FF0,$F00,$0FF,$0F0
		aoz.sourcePos="0:26:4";
		aoz.currentScreen.setPalette([0,0xFFF,0x777,0xFF0,0xF00,0x0FF,0x0F0],"#noremap");
		// leftShift = 1 : rightShift=2
		aoz.sourcePos="0:27:4";
		vars.leftShift=1;
		aoz.sourcePos="0:27:20";
		vars.rightShift=2;
		// leftCtrl=8 | $8000 : rightCtrl=8 // both have the 8 bit since on Amiga there was only one
		aoz.sourcePos="0:28:4";
		vars.leftCtrl=aoz.fp2Int((8)|(0x8000));
		aoz.sourcePos="0:28:25";
		vars.rightCtrl=8;
		// leftAlt=$10 : rightalt=$20 // 16,32 (32 is correct for Amiga)
		aoz.sourcePos="0:30:4";
		vars.leftAlt=16;
		aoz.sourcePos="0:30:18";
		vars.rightalt=32;
		// leftMeta=$40 : rightMeta=$80 // 64,128
		aoz.sourcePos="0:31:4";
		vars.leftMeta=64;
		aoz.sourcePos="0:31:19";
		vars.rightMeta=128;
		// capsLock=$4
		aoz.sourcePos="0:33:4";
		vars.capsLock=4;
		// numLock=$200 // 512
		aoz.sourcePos="0:34:4";
		vars.numLock=512;
		// scrollLock=$400 // 1024
		aoz.sourcePos="0:35:4";
		vars.scrollLock=1024;
		// funcLock=$800 // 2048
		aoz.sourcePos="0:36:4";
		vars.funcLock=2048;
		// separatorOffset=Y Graphic(6.5)+1 ' was Y Graphic(7)+1
		aoz.sourcePos="0:37:4";
		vars.separatorOffset=aoz.fp2Int(aoz.currentScreen.currentTextWindow.yGraphic(6.5)+1);
		// Else  // aoz mode char size = 24 x 43.2 pixels
		return{type:1,label:5};
	};
	this.blocks[3]=function(aoz,vars)
	{
		// scrWidth#=966 : scrHeight#=1383 ' scrHeight# = 1383
		aoz.sourcePos="0:46:4";
		vars.scrWidth_f=966;
		aoz.sourcePos="0:46:20";
		vars.scrHeight_f=1383;
		// Screen Open 0,scrWidth#*2,scrHeight#,8,Lowres,lines=32 ' 1383 high, 43.2 pixel char height, 24 px char width
		aoz.sourcePos="0:47:4";
		aoz.screenOpen(
		{
			index:0,
			width:vars.scrWidth_f*2,
			height:vars.scrHeight_f,
			depth:undefined,
			numberOfColors:8,
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
	this.blocks[4]=function(aoz,vars)
	{
		// charWidth# =X Graphic(1) : textCols# = scrWidth# / charWidth#
		aoz.sourcePos="0:48:4";
		vars.charWidth_f=aoz.currentScreen.currentTextWindow.xGraphic(1);
		aoz.sourcePos="0:48:31";
		vars.textCols_f=aoz.checkNumber(vars.scrWidth_f/vars.charWidth_f);
		// charHeight#=Y Graphic(1) : textRows# = scrHeight# / charHeight#
		aoz.sourcePos="0:49:4";
		vars.charHeight_f=aoz.currentScreen.currentTextWindow.yGraphic(1);
		aoz.sourcePos="0:49:31";
		vars.textRows_f=aoz.checkNumber(vars.scrHeight_f/vars.charHeight_f);
		// Screen Scale 2,1
		aoz.sourcePos="0:50:4";
		aoz.currentScreen.setScale({x:2,y:1},'#update');
		// Screen Display 0,0,0,,
		aoz.sourcePos="0:51:4";
		aoz.getScreen(0).setPosition({x:0,y:0},'#update');
		aoz.getScreen(0).setSize({width:undefined,height:undefined},'#update');
		// Palette 0,$FFFFFF,$777777,$FFFF00,$FF0000,$00FFFF,$00FF00
		aoz.sourcePos="0:52:4";
		aoz.currentScreen.setPalette([0,0xFFFFFF,0x777777,0xFFFF00,0xFF0000,0x00FFFF,0x00FF00],"#noremap");
		// leftShift=1 : rightShift=2
		aoz.sourcePos="0:53:4";
		vars.leftShift=1;
		aoz.sourcePos="0:53:18";
		vars.rightShift=2;
		// leftCtrl=4 : rightCtrl=8
		aoz.sourcePos="0:54:4";
		vars.leftCtrl=4;
		aoz.sourcePos="0:54:17";
		vars.rightCtrl=8;
		// leftAlt=$10 : rightAlt=$20 // 16,32
		aoz.sourcePos="0:55:4";
		vars.leftAlt=16;
		aoz.sourcePos="0:55:18";
		vars.rightalt=32;
		// leftMeta=$40 : rightMeta=$80 // 64, 128
		aoz.sourcePos="0:56:4";
		vars.leftMeta=64;
		aoz.sourcePos="0:56:19";
		vars.rightMeta=128;
		// capsLock=$100	// 256
		aoz.sourcePos="0:58:4";
		vars.capsLock=256;
		// numLock=$200	// 512
		aoz.sourcePos="0:59:4";
		vars.numLock=512;
		// scrollLock=$400	// 1024
		aoz.sourcePos="0:60:4";
		vars.scrollLock=1024;
		// funcLock=$800	// 2048
		aoz.sourcePos="0:61:4";
		vars.funcLock=2048;
		// separatorOffset=Y Graphic(6.5)
		aoz.sourcePos="0:62:4";
		vars.separatorOffset=aoz.fp2Int(aoz.currentScreen.currentTextWindow.yGraphic(6.5));
		// End If
		aoz.sourcePos="0:63:0";
	};
	this.blocks[5]=function(aoz,vars)
	{
		// xOfs=1 : yOfs=5
		aoz.sourcePos="0:67:0";
		vars.xOfs=1;
		aoz.sourcePos="0:67:9";
		vars.yOfs=5;
		// Cls 0 :  Paper 0 : Curs Off : Flash Off
		aoz.sourcePos="0:68:0";
		aoz.currentScreen.cls(0);
		aoz.sourcePos="0:68:9";
		aoz.currentScreen.currentTextWindow.setPaper(0);
		aoz.sourcePos="0:68:19";
		aoz.currentScreen.currentTextWindow.setCursor(false);
		aoz.sourcePos="0:68:30";
		aoz.setFlash(false);
		// Ink 1
		aoz.sourcePos="0:69:0";
		aoz.currentScreen.setInk(1);
		// If Manifest$="aoz"
		aoz.sourcePos="0:73:0";
		if(!((aoz.manifest.compilation.platform  )==("aoz")))
			return{type:1,label:7};
	};
	this.blocks[6]=function(aoz,vars)
	{
		// Box 0,0 To Screen Width-scrWidth#-4,Screen Height-1 // border around window
		aoz.sourcePos="0:74:4";
		aoz.currentScreen.box({x:0,y:0},undefined,{x2:aoz.currentScreen.dimension.width-vars.scrWidth_f-4,y2:aoz.currentScreen.dimension.height-1});
		// Else
		return{type:1,label:8};
	};
	this.blocks[7]=function(aoz,vars)
	{
		// Box 0,0 To Screen Width,Screen Height-1 ' Screen Width-scrWidth#,Screen Height-1
		aoz.sourcePos="0:76:4";
		aoz.currentScreen.box({x:0,y:0},undefined,{x2:aoz.currentScreen.dimension.width,y2:aoz.currentScreen.dimension.height-1});
		// End If
		aoz.sourcePos="0:77:0";
	};
	this.blocks[8]=function(aoz,vars)
	{
		// Draw 0,Screen Height - separatorOffset To Screen Width-1,Screen Height - separatorOffset
		aoz.sourcePos="0:79:0";
		aoz.currentScreen.draw({x1:0,y1:aoz.currentScreen.dimension.height-vars.separatorOffset,x2:aoz.currentScreen.dimension.width-1,y2:aoz.currentScreen.dimension.height-vars.separatorOffset});
		// Locate 1,1 : Pen 1 : Print "AOZ Key State/Key Shift test (";Left$(manifest$,7);")"
		aoz.sourcePos="0:84:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
		aoz.sourcePos="0:84:13";
		aoz.currentScreen.currentTextWindow.setPen(1);
		aoz.sourcePos="0:84:21";
		aoz.currentScreen.currentTextWindow.print("AOZ Key State/Key Shift test ("+this.aoz.getLeft$(aoz.manifest.compilation.platform  ,7)+")",true);
		// Locate 1,3 : Pen 5 : Print "Key State(n) "; : Pen 6 : Print "' n shown in hex below."
		aoz.sourcePos="0:85:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:3});
		aoz.sourcePos="0:85:13";
		aoz.currentScreen.currentTextWindow.setPen(5);
		aoz.sourcePos="0:85:21";
		aoz.currentScreen.currentTextWindow.print("Key State(n) ",false);
		aoz.sourcePos="0:85:46";
		aoz.currentScreen.currentTextWindow.setPen(6);
		aoz.sourcePos="0:85:54";
		aoz.currentScreen.currentTextWindow.print("' n shown in hex below.",true);
		// warningMsg$="Click in window before pressing keys!"
		aoz.sourcePos="0:88:0";
		vars.warningMsg$="Click in window before pressing keys!";
		// Locate 1,17 +yOfs: Pen 4 : Print warningMsg$
		aoz.sourcePos="0:89:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:17+vars.yOfs});
		aoz.sourcePos="0:89:19";
		aoz.currentScreen.currentTextWindow.setPen(4);
		aoz.sourcePos="0:89:27";
		aoz.currentScreen.currentTextWindow.print(vars.warningMsg$,true);
		// Repeat
		aoz.sourcePos="0:90:0";
	};
	this.blocks[9]=function(aoz,vars)
	{
		// Until Mouse Key <> 0
		aoz.sourcePos="0:91:0";
		if(!((aoz.mouseButtons)!=(0)))
			return{type:1,label:9};
	};
	this.blocks[10]=function(aoz,vars)
	{
		// Locate 1,16+yOfs : Pen 4 : Print Space$(Len(warningMsg$)) // +1 compensates for space$ bug
		aoz.sourcePos="0:92:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:16+vars.yOfs});
		aoz.sourcePos="0:92:19";
		aoz.currentScreen.currentTextWindow.setPen(4);
		aoz.sourcePos="0:92:27";
		aoz.currentScreen.currentTextWindow.print(aoz.space$((vars.warningMsg$).length),true);
		// Locate 1,17+yOfs : Print "Edit manifest tag to switch platform."
		aoz.sourcePos="0:93:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:17+vars.yOfs});
		aoz.sourcePos="0:93:19";
		aoz.currentScreen.currentTextWindow.print("Edit manifest tag to switch platform.",true);
		// Pen 2
		aoz.sourcePos="0:96:0";
		aoz.currentScreen.currentTextWindow.setPen(2);
		// Locate 1,19+yOfs : Print Version$
		aoz.sourcePos="0:97:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:19+vars.yOfs});
		aoz.sourcePos="0:97:19";
		aoz.currentScreen.currentTextWindow.print(vars.Version$,true);
		// Pen 5
		aoz.sourcePos="0:98:0";
		aoz.currentScreen.currentTextWindow.setPen(5);
		// Locate 12,18+yOfs : Print "Key Shift"
		aoz.sourcePos="0:99:0";
		aoz.currentScreen.currentTextWindow.locate({x:12,y:18+vars.yOfs});
		aoz.sourcePos="0:99:20";
		aoz.currentScreen.currentTextWindow.print("Key Shift",true);
		// Locate 12,19+yOfs : Print "ScanShift"
		aoz.sourcePos="0:100:0";
		aoz.currentScreen.currentTextWindow.locate({x:12,y:19+vars.yOfs});
		aoz.sourcePos="0:100:20";
		aoz.currentScreen.currentTextWindow.print("ScanShift",true);
		// Pen 1
		aoz.sourcePos="0:101:0";
		aoz.currentScreen.currentTextWindow.setPen(1);
		// Locate 1,21+yOfs : Print "      Lft Rit"
		aoz.sourcePos="0:102:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:21+vars.yOfs});
		aoz.sourcePos="0:102:19";
		aoz.currentScreen.currentTextWindow.print("      Lft Rit",true);
		// Locate 1,22+yOfs : Print "Shift"
		aoz.sourcePos="0:103:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:22+vars.yOfs});
		aoz.sourcePos="0:103:19";
		aoz.currentScreen.currentTextWindow.print("Shift",true);
		// Locate 1,23+yOfs : Print "Ctrl"
		aoz.sourcePos="0:104:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:23+vars.yOfs});
		aoz.sourcePos="0:104:19";
		aoz.currentScreen.currentTextWindow.print("Ctrl",true);
		// Locate 1,24+yOfs : Print "Alt"
		aoz.sourcePos="0:105:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:24+vars.yOfs});
		aoz.sourcePos="0:105:19";
		aoz.currentScreen.currentTextWindow.print("Alt",true);
		// Locate 1,25+yOfs : Print "Meta"
		aoz.sourcePos="0:106:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:25+vars.yOfs});
		aoz.sourcePos="0:106:19";
		aoz.currentScreen.currentTextWindow.print("Meta",true);
		// Locate 15,22+yOfs : Print "Caps"
		aoz.sourcePos="0:108:0";
		aoz.currentScreen.currentTextWindow.locate({x:15,y:22+vars.yOfs});
		aoz.sourcePos="0:108:20";
		aoz.currentScreen.currentTextWindow.print("Caps",true);
		// Locate 15,23+yOfs : Print "Scroll"
		aoz.sourcePos="0:109:0";
		aoz.currentScreen.currentTextWindow.locate({x:15,y:23+vars.yOfs});
		aoz.sourcePos="0:109:20";
		aoz.currentScreen.currentTextWindow.print("Scroll",true);
		// Locate 15,24+yOfs : Print "Num"
		aoz.sourcePos="0:110:0";
		aoz.currentScreen.currentTextWindow.locate({x:15,y:24+vars.yOfs});
		aoz.sourcePos="0:110:20";
		aoz.currentScreen.currentTextWindow.print("Num",true);
		// Locate 15,25+yOfs : Print "Func"
		aoz.sourcePos="0:111:0";
		aoz.currentScreen.currentTextWindow.locate({x:15,y:25+vars.yOfs});
		aoz.sourcePos="0:111:20";
		aoz.currentScreen.currentTextWindow.print("Func",true);
		// Locate 33+xOfs,5 : Print "View"
		aoz.sourcePos="0:119:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:5});
		aoz.sourcePos="0:119:19";
		aoz.currentScreen.currentTextWindow.print("View",true);
		// Locate 33+xOfs,6 : Print "multi"
		aoz.sourcePos="0:120:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:6});
		aoz.sourcePos="0:120:19";
		aoz.currentScreen.currentTextWindow.print("multi",true);
		// Locate 33+xOfs,7 : Print "key"
		aoz.sourcePos="0:121:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:7});
		aoz.sourcePos="0:121:19";
		aoz.currentScreen.currentTextWindow.print("key",true);
		// Locate 33+xOfs,8 : Print "press"
		aoz.sourcePos="0:122:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:8});
		aoz.sourcePos="0:122:19";
		aoz.currentScreen.currentTextWindow.print("press",true);
		// Locate 33+xOfs,9 : Print "combos"
		aoz.sourcePos="0:123:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:9});
		aoz.sourcePos="0:123:19";
		aoz.currentScreen.currentTextWindow.print("combos",true);
		// Locate 33+xOfs,10 : Print "in"
		aoz.sourcePos="0:124:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:10});
		aoz.sourcePos="0:124:20";
		aoz.currentScreen.currentTextWindow.print("in",true);
		// Locate 33+xOfs,11 : Print "this"
		aoz.sourcePos="0:125:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:11});
		aoz.sourcePos="0:125:20";
		aoz.currentScreen.currentTextWindow.print("this",true);
		// Locate 33+xOfs,12 : Print "table"
		aoz.sourcePos="0:126:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:12});
		aoz.sourcePos="0:126:20";
		aoz.currentScreen.currentTextWindow.print("table",true);
		// Locate 33+xOfs,14 : Print "Hard-"
		aoz.sourcePos="0:127:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:14});
		aoz.sourcePos="0:127:20";
		aoz.currentScreen.currentTextWindow.print("Hard-",true);
		// Locate 33+xOfs,15 : Print "ware"
		aoz.sourcePos="0:128:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:15});
		aoz.sourcePos="0:128:20";
		aoz.currentScreen.currentTextWindow.print("ware",true);
		// Locate 33+xOfs,16 : Print "depen-"
		aoz.sourcePos="0:129:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:16});
		aoz.sourcePos="0:129:20";
		aoz.currentScreen.currentTextWindow.print("depen-",true);
		// Locate 33+xOfs,17 : Print "dent."
		aoz.sourcePos="0:130:0";
		aoz.currentScreen.currentTextWindow.locate({x:33+vars.xOfs,y:17});
		aoz.sourcePos="0:130:20";
		aoz.currentScreen.currentTextWindow.print("dent.",true);
		// Pen 5
		aoz.sourcePos="0:133:0";
		aoz.currentScreen.currentTextWindow.setPen(5);
		// Locate 23,27 : Print "Inkey$"
		aoz.sourcePos="0:134:0";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:27});
		aoz.sourcePos="0:134:15";
		aoz.currentScreen.currentTextWindow.print("Inkey$",true);
		// Locate 23,28 : Print "ScanCode"
		aoz.sourcePos="0:135:0";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:28});
		aoz.sourcePos="0:135:15";
		aoz.currentScreen.currentTextWindow.print("ScanCode",true);
		// Locate 23,29 : Print "Key Name$"
		aoz.sourcePos="0:136:0";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:29});
		aoz.sourcePos="0:136:15";
		aoz.currentScreen.currentTextWindow.print("Key Name$",true);
		// Screen 0 : Pen 2
		aoz.sourcePos="0:140:0";
		aoz.setScreen(0);
		aoz.sourcePos="0:140:11";
		aoz.currentScreen.currentTextWindow.setPen(2);
		// prevShift=0
		aoz.sourcePos="0:141:0";
		vars.prevShift=0;
		// prevSS=0
		aoz.sourcePos="0:142:0";
		vars.prevSS=0;
		// KN$="" : SS=0 : IK$=""
		aoz.sourcePos="0:143:0";
		vars.KN$="";
		aoz.sourcePos="0:143:9";
		vars.SS=0;
		aoz.sourcePos="0:143:16";
		vars.IK$="";
		// oldKN$=""
		aoz.sourcePos="0:144:0";
		vars.oldKN$="";
		// Do
		aoz.sourcePos="0:146:0";
	};
	this.blocks[11]=function(aoz,vars)
	{
		// IK$=Inkey$ : SS=ScanShift : SC=ScanCode
		aoz.sourcePos="0:147:4";
		vars.IK$=aoz.inkey$();
		aoz.sourcePos="0:147:17";
		vars.SS=aoz.fp2Int(aoz.getScanShift());
		aoz.sourcePos="0:147:32";
		vars.SC=aoz.fp2Int(aoz.getScanCode());
		// For r=0 To 15
		aoz.sourcePos="0:148:4";
		vars.r=0;
	};
	this.blocks[12]=function(aoz,vars)
	{
		// For c=0 To 15
		aoz.sourcePos="0:149:8";
		vars.c=0;
	};
	this.blocks[13]=function(aoz,vars)
	{
		// locate c*2+xOfs,r+yOfs
		aoz.sourcePos="0:150:12";
		aoz.currentScreen.currentTextWindow.locate({x:vars.c*2+vars.xOfs,y:vars.r+vars.yOfs});
		// KS = Key State(r*16+c)
		aoz.sourcePos="0:151:12";
		vars.KS=aoz.fp2Int(aoz.getKeyState(vars.r*16+vars.c));
		// If KS Then Pen 3 : Print Right$(Hex$(r*16+c,2),2) Else Pen 2 : Print " 0" // show hex of key  state
		aoz.sourcePos="0:152:12";
		if(!(vars.KS))
			return{type:1,label:15};
	};
	this.blocks[14]=function(aoz,vars)
	{
		aoz.sourcePos="0:152:23";
		aoz.currentScreen.currentTextWindow.setPen(3);
		aoz.sourcePos="0:152:31";
		aoz.currentScreen.currentTextWindow.print(this.aoz.getRight$(aoz.hex$(vars.r*16+vars.c,2),2),true);
		return{type:1,label:16};
	};
	this.blocks[15]=function(aoz,vars)
	{
		aoz.sourcePos="0:152:67";
		aoz.currentScreen.currentTextWindow.setPen(2);
		aoz.sourcePos="0:152:75";
		aoz.currentScreen.currentTextWindow.print(" 0",true);
	};
	this.blocks[16]=function(aoz,vars)
	{
		// Next c
		aoz.sourcePos="0:153:8";
		vars.c+=1;
		if(vars.c<=15)
			return{type:1,label:13};
	};
	this.blocks[17]=function(aoz,vars)
	{
		// Next r
		aoz.sourcePos="0:154:4";
		vars.r+=1;
		if(vars.r<=15)
			return{type:1,label:12};
	};
	this.blocks[18]=function(aoz,vars)
	{
		// KSH = Key Shift
		aoz.sourcePos="0:156:4";
		vars.KSH=aoz.fp2Int(aoz.getKeyShift());
		// If  KSH <> prevShift
		aoz.sourcePos="0:157:4";
		if(!((vars.KSH)!=(vars.prevShift)))
			return{type:1,label:32};
	};
	this.blocks[19]=function(aoz,vars)
	{
		// Locate 23,18+yOfs : Pen 3 :  Print Right$(Bin$(KSH,16),16) : prevShift = KSH
		aoz.sourcePos="0:158:8";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:18+vars.yOfs});
		aoz.sourcePos="0:158:28";
		aoz.currentScreen.currentTextWindow.setPen(3);
		aoz.sourcePos="0:158:37";
		aoz.currentScreen.currentTextWindow.print(this.aoz.getRight$(aoz.bin$(vars.KSH,16),16),true);
		aoz.sourcePos="0:158:69";
		vars.prevShift=aoz.fp2Int(vars.KSH);
		// ShowBit[8,22+yOfs,KSH & leftShift] : ShowBit[12,22+yOfs,KSH & rightShift] ' Shifts
		aoz.sourcePos="0:159:8";
		return{type:4,procedure:"showbit",args:{x:8,y:22+vars.yOfs,status:(vars.KSH)&(vars.leftShift)}};
	};
	this.blocks[20]=function(aoz,vars)
	{
		aoz.sourcePos="0:159:45";
		return{type:4,procedure:"showbit",args:{x:12,y:22+vars.yOfs,status:(vars.KSH)&(vars.rightShift)}};
	};
	this.blocks[21]=function(aoz,vars)
	{
		// ShowBit[8,23+yOfs,KSH & leftCtrl] : ShowBit[12,23+yOfs,KSH & rightCtrl] ' Ctrls
		aoz.sourcePos="0:160:8";
		return{type:4,procedure:"showbit",args:{x:8,y:23+vars.yOfs,status:(vars.KSH)&(vars.leftCtrl)}};
	};
	this.blocks[22]=function(aoz,vars)
	{
		aoz.sourcePos="0:160:44";
		return{type:4,procedure:"showbit",args:{x:12,y:23+vars.yOfs,status:(vars.KSH)&(vars.rightCtrl)}};
	};
	this.blocks[23]=function(aoz,vars)
	{
		// ShowBit[8,24+yOfs,KSH & leftAlt] : ShowBit[12,24+yOfs,KSH & rightAlt] ' Alts
		aoz.sourcePos="0:161:8";
		return{type:4,procedure:"showbit",args:{x:8,y:24+vars.yOfs,status:(vars.KSH)&(vars.leftAlt)}};
	};
	this.blocks[24]=function(aoz,vars)
	{
		aoz.sourcePos="0:161:43";
		return{type:4,procedure:"showbit",args:{x:12,y:24+vars.yOfs,status:(vars.KSH)&(vars.rightalt)}};
	};
	this.blocks[25]=function(aoz,vars)
	{
		// ShowBit[8,25+yOfs,KSH & leftMeta] : ShowBit[12,25+yOfs,KSH & rightMeta] ' Metas
		aoz.sourcePos="0:162:8";
		return{type:4,procedure:"showbit",args:{x:8,y:25+vars.yOfs,status:(vars.KSH)&(vars.leftMeta)}};
	};
	this.blocks[26]=function(aoz,vars)
	{
		aoz.sourcePos="0:162:44";
		return{type:4,procedure:"showbit",args:{x:12,y:25+vars.yOfs,status:(vars.KSH)&(vars.rightMeta)}};
	};
	this.blocks[27]=function(aoz,vars)
	{
		// ShowBit[21,22+yOfs,KSH & capsLock]
		aoz.sourcePos="0:164:8";
		return{type:4,procedure:"showbit",args:{x:21,y:22+vars.yOfs,status:(vars.KSH)&(vars.capsLock)}};
	};
	this.blocks[28]=function(aoz,vars)
	{
		// ShowBit[21,23+yOfs,KSH & scrollLock]
		aoz.sourcePos="0:165:8";
		return{type:4,procedure:"showbit",args:{x:21,y:23+vars.yOfs,status:(vars.KSH)&(vars.scrollLock)}};
	};
	this.blocks[29]=function(aoz,vars)
	{
		// ShowBit[21,24+yOfs,KSH & numLock]
		aoz.sourcePos="0:166:8";
		return{type:4,procedure:"showbit",args:{x:21,y:24+vars.yOfs,status:(vars.KSH)&(vars.numLock)}};
	};
	this.blocks[30]=function(aoz,vars)
	{
		// ShowBit[21,25+yOfs,KSH & funcLock]
		aoz.sourcePos="0:167:8";
		return{type:4,procedure:"showbit",args:{x:21,y:25+vars.yOfs,status:(vars.KSH)&(vars.funcLock)}};
	};
	this.blocks[31]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:168:4";
	};
	this.blocks[32]=function(aoz,vars)
	{
		// KN$=Key Name$
		aoz.sourcePos="0:172:4";
		vars.KN$=aoz.getKeyName();
		// If IK$ <> "" // Inkey$ changed
		aoz.sourcePos="0:173:4";
		if(!((vars.IK$)!=("")))
			return{type:1,label:40};
	};
	this.blocks[33]=function(aoz,vars)
	{
		// Locate 23,19+yOfs : Pen 3 : Print Right$(Bin$(SS,16),16) : prevSS = SS ' ScanShift should only change on Inkey$
		aoz.sourcePos="0:174:8";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:19+vars.yOfs});
		aoz.sourcePos="0:174:28";
		aoz.currentScreen.currentTextWindow.setPen(3);
		aoz.sourcePos="0:174:36";
		aoz.currentScreen.currentTextWindow.print(this.aoz.getRight$(aoz.bin$(vars.SS,16),16),true);
		aoz.sourcePos="0:174:67";
		vars.prevSS=aoz.fp2Int(vars.SS);
		// Locate 30,27 : Pen 3
		aoz.sourcePos="0:175:8";
		aoz.currentScreen.currentTextWindow.locate({x:30,y:27});
		aoz.sourcePos="0:175:23";
		aoz.currentScreen.currentTextWindow.setPen(3);
		// If IK$ >= " " And IK$ <= Chr$(255) Then Print IK$; Else Print " "; // show printable characters
		aoz.sourcePos="0:176:8";
		if(!(((vars.IK$)>=(" "))&&((vars.IK$)<=(String.fromCharCode(255)))))
			return{type:1,label:35};
	};
	this.blocks[34]=function(aoz,vars)
	{
		aoz.sourcePos="0:176:48";
		aoz.currentScreen.currentTextWindow.print(vars.IK$,false);
		return{type:1,label:36};
	};
	this.blocks[35]=function(aoz,vars)
	{
		aoz.sourcePos="0:176:64";
		aoz.currentScreen.currentTextWindow.print(" ",false);
	};
	this.blocks[36]=function(aoz,vars)
	{
		// If IK$<>Chr$(0)
		aoz.sourcePos="0:178:8";
		if(!((vars.IK$)!=(String.fromCharCode(0))))
			return{type:1,label:38};
	};
	this.blocks[37]=function(aoz,vars)
	{
		// Print " ";Hex$(Asc(IK$),2);
		aoz.sourcePos="0:179:12";
		aoz.currentScreen.currentTextWindow.print(" "+aoz.hex$(aoz.asc(vars.IK$),2),false);
		// Print Using "(###)";Asc(IK$)
		aoz.sourcePos="0:180:12";
		aoz.currentScreen.currentTextWindow.printUsing("(###)",[aoz.asc(vars.IK$)],".");
		// Else
		return{type:1,label:39};
	};
	this.blocks[38]=function(aoz,vars)
	{
		// Print "      "
		aoz.sourcePos="0:182:12";
		aoz.currentScreen.currentTextWindow.print("      ",true);
		// End If
		aoz.sourcePos="0:183:8";
	};
	this.blocks[39]=function(aoz,vars)
	{
		// Locate 23,26 : maxLen=16 : L$=Left$(KN$,maxLen) : Print L$;Space$(maxLen-Len(L$))
		aoz.sourcePos="0:184:8";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:26});
		aoz.sourcePos="0:184:23";
		vars.maxLen=16;
		aoz.sourcePos="0:184:35";
		vars.L$=this.aoz.getLeft$(vars.KN$,vars.maxLen);
		aoz.sourcePos="0:184:58";
		aoz.currentScreen.currentTextWindow.print(vars.L$+aoz.space$(vars.maxLen-(vars.L$).length),true);
		// Locate 32,28 : Print Hex$(SC,2); : Print Using "(###)";SC
		aoz.sourcePos="0:185:8";
		aoz.currentScreen.currentTextWindow.locate({x:32,y:28});
		aoz.sourcePos="0:185:23";
		aoz.currentScreen.currentTextWindow.print(aoz.hex$(vars.SC,2),false);
		aoz.sourcePos="0:185:43";
		aoz.currentScreen.currentTextWindow.printUsing("(###)",[vars.SC],".");
		// End If
		aoz.sourcePos="0:186:4";
	};
	this.blocks[40]=function(aoz,vars)
	{
		// If (KN$ <> oldKN$) And (KN$ <> "")
		aoz.sourcePos="0:187:4";
		if(!((((vars.KN$)!=(vars.oldKN$)))&&(((vars.KN$)!=("")))))
			return{type:1,label:42};
	};
	this.blocks[41]=function(aoz,vars)
	{
		// Pen 3 : Locate 23,30 : maxLen=16 : L$=Left$(KN$,maxLen) : Print L$;Space$(maxLen-Len(L$))
		aoz.sourcePos="0:188:8";
		aoz.currentScreen.currentTextWindow.setPen(3);
		aoz.sourcePos="0:188:16";
		aoz.currentScreen.currentTextWindow.locate({x:23,y:30});
		aoz.sourcePos="0:188:31";
		vars.maxLen=16;
		aoz.sourcePos="0:188:43";
		vars.L$=this.aoz.getLeft$(vars.KN$,vars.maxLen);
		aoz.sourcePos="0:188:66";
		aoz.currentScreen.currentTextWindow.print(vars.L$+aoz.space$(vars.maxLen-(vars.L$).length),true);
		// oldKN$=KN$
		aoz.sourcePos="0:189:8";
		vars.oldKN$=vars.KN$;
		// End If
		aoz.sourcePos="0:190:4";
	};
	this.blocks[42]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:191:4";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[43]=function(aoz,vars)
	{
		// Loop
		aoz.sourcePos="0:192:0";
		return{type:1,label:11};
	};
	this.blocks[44]=function(aoz,vars)
	{
		return{type:0}
	};
	this.p_showbit=function(aoz,parent,args)
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
			// Locate x,y : If status Then Print "X" Else Print " "
			aoz.sourcePos="0:195:4";
			aoz.currentScreen.currentTextWindow.locate({x:vars.x,y:vars.y});
			aoz.sourcePos="0:195:17";
			if(!(vars.status))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			aoz.sourcePos="0:195:32";
			aoz.currentScreen.currentTextWindow.print("X",true);
			return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:195:47";
			aoz.currentScreen.currentTextWindow.print(" ",true);
		};
		this.blocks[3]=function(aoz,vars)
		{
			// End Proc
			return{type:0};
		};
	};
	this.aoz.run(this,0,args);
	this.aoz.v1_0_asset=new v1_0_asset(this.aoz,args);
	this.aoz.v1_0_collisions=new v1_0_collisions(this.aoz,args);
	this.aoz.v1_0_colours=new v1_0_colours(this.aoz,args);
	this.aoz.v1_0_graphics=new v1_0_graphics(this.aoz,args);
	this.aoz.v1_0_keyboard_and_mouse=new v1_0_keyboard_and_mouse(this.aoz,args);
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
