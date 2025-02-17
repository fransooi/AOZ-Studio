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
// AOZ Link
// Baptiste Bideaux & Phil Bell
// 1.0.0
// 
// Copyright (c) 2020-2021 AOZ Studio
//
// Compiled with AOZ Transpiler Version 14.03 on the 20/02/2023-16:09:54
//
function Application( canvasId, args )
{
	this.root=this;
	this.parent=this;
	this.contextName='application';
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsImluZm9zIjp7InR5cGUiOiJwYyIsImFwcGxpY2F0aW9uTmFtZSI6IkFPWiBMaW5rIiwiYXV0aG9yIjoiQmFwdGlzdGUgQmlkZWF1eCAmIFBoaWwgQmVsbCIsInZlcnNpb24iOiIxLjAuMCIsImRhdGUiOiIiLCJjb3B5cmlnaHQiOiJDb3B5cmlnaHQgKGMpIDIwMjAtMjAyMSBBT1ogU3R1ZGlvIiwic3RhcnQiOiJBT1ogTGluay5hb3oiLCJ0ZW1wbGF0ZSI6InRlbXBsYXRlcy90ZW1wbGF0ZV9jcm9zcyJ9LCJjb21waWxhdGlvbiI6eyJwbGF0Zm9ybSI6ImFveiIsImtleW1hcCI6ImFveiIsIm1hY2hpbmUiOiJtb2Rlcm4iLCJzcGVlZCI6ImZhc3QiLCJzeW50YXgiOiJlbmhhbmNlZCIsImVuZGlhbiI6ImxpdHRsZSIsIm5vV2FybmluZyI6W10sImRpc3BsYXlFbmRBbGVydCI6ZmFsc2UsImRpc3BsYXlFcnJvckFsZXJ0Ijp0cnVlLCJ1c2VMb2NhbFRhYnMiOnRydWUsInVzZUFzc2V0c1Jlc291cmNlcyI6dHJ1ZSwiaW5jbHVkZVBhdGhzIjpbXX0sImRpc3BsYXkiOnsidHZTdGFuZGFyZCI6InBhbCIsInJlc29sdXRpb24iOiIzMjB4MjU2Iiwid2lkdGgiOjMyMCwiaGVpZ2h0IjoyNTYsImJhY2tncm91bmQiOiJjb2xvciIsImJhY2tncm91bmRDb2xvciI6IiMwMDAwMDAiLCJib2R5QmFja2dyb3VuZENvbG9yIjoiIzAwMDAwMCIsImJvZHlCYWNrZ3JvdW5kSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL3N0YXJfbmlnaHQuanBlZyIsInNjYWxlWCI6MSwic2NhbGVZIjoxLCJzY3JlZW5TY2FsZSI6MSwiZnBzIjpmYWxzZSwiZnBzRm9udCI6IjEycHggVmVyZGFuYSIsImZwc0NvbG9yIjoiI0ZGRkYwMCIsImZwc1giOjEwLCJmcHNZIjoxNiwiZnVsbFBhZ2UiOnRydWUsImZ1bGxTY3JlZW4iOnRydWUsImtlZXBQcm9wb3J0aW9ucyI6dHJ1ZSwiZnVsbFNjcmVlbkljb24iOmZhbHNlLCJmdWxsU2NyZWVuSWNvblgiOi0zNCwiZnVsbFNjcmVlbkljb25ZIjoyLCJmdWxsU2NyZWVuSWNvbkltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9mdWxsX3NjcmVlbi5wbmciLCJzbWFsbFNjcmVlbkljb25JbWFnZSI6Ii4vcnVudGltZS9yZXNvdXJjZXMvc21hbGxfc2NyZWVuLnBuZyIsInNtb290aGluZyI6dHJ1ZSwib3JpZW50YXRpb25fZGV0ZWN0aW9uIjoibGFuZHNjYXBlIiwicmVuZGVyZXIiOiJjYW52YXMifSwiYm9vdFNjcmVlbiI6eyJhY3RpdmUiOnRydWUsIndhaXRTb3VuZHMiOjAsImNsaWNrU291bmRzIjpmYWxzZX0sImNvbGxpc2lvbnMiOnsibWV0aG9kIjoiZmluZSIsInByZWNpc2lvbiI6NzUsImFscGhhVGhyZXNob2xkIjoxfSwicmFpbmJvd3MiOnsibW9kZSI6InNsb3cifSwiZm9udHMiOnsibGlzdEZvbnRzIjoiUEMiLCJhbWlnYSI6W10sImdvb2dsZSI6WyJyb2JvdG8iLCJSb2JvdG8gTW9ubyJdfSwic291bmRzIjp7Im1vZGUiOiJQQyIsInZvbHVtZSI6MSwicHJlbG9hZCI6dHJ1ZSwibnVtYmVyT2ZTb3VuZHNUb1ByZWxvYWQiOjMyLCJzb3VuZFBvb2xTaXplIjozMn0sImdhbWVwYWQiOnsibWFwcGluZyI6eyJ1cCI6IkFycm93VXAiLCJkb3duIjoiQXJyb3dEb3duIiwibGVmdCI6IkFycm93TGVmdCIsInJpZ2h0IjoiQXJyb3dSaWdodCIsImZpcmUiOiJTcGFjZSJ9fSwiZmlsZVN5c3RlbSI6eyJjYXNlU2Vuc2l0aXZlIjpmYWxzZX0sImRlZmF1bHQiOnsic2NyZWVuIjp7IngiOjAsInkiOjAsIndpZHRoIjozMjAsImhlaWdodCI6MjU2LCJudW1iZXJPZkNvbG9ycyI6NjQsInBpeGVsTW9kZSI6Imxvd3JlcyIsInBhbGV0dGUiOlsiIzAwMDAwMCIsIiNGRkZGRkYiLCIjRDFEMUQxIiwiI0EyQTJBMiIsIiM3MzczNzMiLCIjNDQ0NDQ0IiwiI0ZGMDAwMCIsIiNEMTAwMDAiLCIjQTIwMDAwIiwiIzczMDAwMCIsIiM0NDAwMDAiLCIjMDBGRjAwIiwiIzAwRDEwMCIsIiMwMEEyMDAiLCIjMDA3MzAwIiwiIzAwNDQwMCIsIiNGRkZGMDAiLCIjRDFEMTAwIiwiI0EyQTIwMCIsIiM3MzczMDAiLCIjNDQ0NDAwIiwiI0ZGN0YwMCIsIiNFMjcxMDAiLCIjQzQ2MjAwIiwiI0E2NTMwMCIsIiM4ODQ0MDAiLCIjMDAwMEZGIiwiIzAwMDBEMSIsIiMwMDAwQTIiLCIjMDAwMDczIiwiIzAwMDA0NCIsIiMwMEZGRkYiLCIjMDBEMUQxIiwiIzAwQTJBMiIsIiMwMDczNzMiLCIjMDA0NDQ0IiwiI0ZGMDBGRiIsIiNEMTAwRDEiLCIjQTIwMEEyIiwiIzczMDA3MyIsIiM0NDAwNDQiLCIjRkZBMTAwIiwiI0ZGQjMxMiIsIiNGRkM2MjUiLCIjRkZEODM3IiwiI0ZGRUI0QSIsIiNGRkZFNUQiLCIjMDAyOTY1IiwiIzEyMzk3NSIsIiMyNDQ5ODUiLCIjMzY1OTk1IiwiIzQ4NjlBNSIsIiM1QTc5QjUiLCIjQkY3MTdGIiwiI0IyNjc3MyIsIiNBNDVENjYiLCIjOTc1MzU5IiwiIzg5NDk0QyIsIiM3QjNGM0YiLCIjODI1MkI0IiwiIzYyM0U4NyIsIiM0MTI5NUEiLCIjMjExNTJEIiwiIzAwMDAwMCJdLCJ3aW5kb3ciOnsieCI6MCwieSI6MCwid2lkdGgiOjgwLCJoZWlnaHQiOjI1LCJib3JkZXIiOjAsInBhcGVyIjowLCJwZW4iOjEsImJhY2tncm91bmQiOiJvcGFxdWUiLCJmb250Ijp7Im5hbWUiOiJJQk0gUGxleCBNb25vIiwidHlwZSI6Imdvb2dsZSIsImhlaWdodCI6NX0sImN1cnNvck9uIjp0cnVlLCJjdXJzb3JJbWFnZSI6Ii4vcnVudGltZS9yZXNvdXJjZXMvY3Vyc29yX3BjLnBuZyIsImN1cnNvckNvbG9ycyI6W3siciI6NjgsImciOjY4LCJiIjowLCJhIjoxMjh9LHsiciI6MTM2LCJnIjoxMzYsImIiOjAsImEiOjEyOH0seyJyIjoxODcsImciOjE4NywiYiI6MCwiYSI6MTI4fSx7InIiOjIyMSwiZyI6MjIxLCJiIjowLCJhIjoxMjh9LHsiciI6MjM4LCJnIjoyMzgsImIiOjAsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MzQsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MTM2LCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjIwNCwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjoyNTUsImEiOjEyOH0seyJyIjoxNzAsImciOjE3MCwiYiI6MjU1LCJhIjoxMjh9LHsiciI6MTM2LCJnIjoxMzYsImIiOjIwNCwiYSI6MTI4fSx7InIiOjEwMiwiZyI6MTAyLCJiIjoxNzAsImEiOjEyOH0seyJyIjozNCwiZyI6MzQsImIiOjEwMiwiYSI6MTI4fSx7InIiOjAsImciOjAsImIiOjY4LCJhIjoxMjh9LHsiciI6MCwiZyI6MCwiYiI6MTcsImEiOjEyOH0seyJyIjowLCJnIjowLCJiIjowLCJhIjoxMjh9XX19fX0='));
	var options =
	{
		manifest: this.manifest,
		sources: JSON.parse(atob('W3sicGF0aCI6IkM6L0FPWl9TdHVkaW8vQU9aX1N0dWRpby9hcHAvYW96L3Rvb2xzL0FPWiBMaW5rL0FPWiBMaW5rLmFveiIsInNvdXJjZSI6Ii8vI3NwbGFzaFNjcmVlbjogRmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbkN1cnMgT2ZmIDogRmxhc2ggT2ZmXHJcblBhbGV0dGUgJDIwMjAyMCwgJGI4YjhiOCwgJDAwMDAwMCwgJGZmYWIwMCwgJDM1NTQ3MCwgJDA0OGZhZiwgJGZmZmZmZlxyXG5DbHMgMFxyXG5cclxuTG9hZCBBc3NldCBcImxvY2FsZS5qc29uXCIsIFwibG9jYWxlXCJcclxuTG9hZCBBc3NldCBcImpzL2NsaWVudC5qc1wiLCBcImNsaWVudFwiXHJcbkxvYWQgQXNzZXQgXCJqcy9wdWJsaXNoZXIuanNcIiwgXCJwdWJsaXNoZXJcIlxyXG5cclxuTG9hZCBBc3NldCBcImNzcy9mb250cy9hdmVuaXItbmV4dC9mb250LmNzc1wiLCBcImF2ZW5pcl9uZXh0XCJcclxuTG9hZCBBc3NldCBcImNzcy9mb250cy9icmFuZG9uX2dyb3Rlc3F1ZS9mb250LmNzc1wiLCBcImJyYW5kb25cIlxyXG5Mb2FkIEFzc2V0IFwiY3NzL2dsb2JhbC5jc3NcIiwgXCJnbG9iYWxcIlxyXG5cclxuTG9hZCBBc3NldCBcImh0bWwvYW5hbHl6ZS5odG1sXCIsIFwiYW5hbHl6ZVwiXHJcblxyXG5XaGlsZSBBc3NldCBMb2FkZWQoIFwibG9jYWxlXCIsIFwianNvblwiICkgPSBGYWxzZVxyXG5cdFdhaXQgVmJsXHJcbldlbmRcclxuXHJcblBSR19QQVRIJCA9IFwiXCIgOiBaSVBfUEFUSCQgPSBcIlwiIDogTEFORyQgPSBcImVuXCJcclxuRVRBUEUgPSAxIDogUkVTVUxUID0gMCA6IEVSUl9UWFQkID0gXCJcIlxyXG5BUFBfSUQkID0gXCJcIiA6IFVSTCQgPSBcIlwiXHJcbkdsb2JhbCBQUkdfUEFUSCQsIFpJUF9QQVRIJCwgTEFORyQsIFJFU1VMVCwgRVRBUEUsIEFQUF9JRCQsIEVSUl9UWFQkLCBVUkwkXHJcblxyXG5KUyBFeGVjdXRlIFwiY2xpZW50LmdldExhbmcoKVwiXHJcblxyXG5TaG93IEhUTUwgXCJhbmFseXplXCJcclxuSFRNTCBFbGVtZW50IFwiZG93bmxvYWRfYW5pbVwiLCBWaXNpYmxlID0gRmFsc2VcclxuSFRNTCBFbGVtZW50IFwidGV4dFBhbmVsMlwiLCBWaXNpYmxlID0gRmFsc2VcclxuSFRNTCBFbGVtZW50IFwiYnRuX2Nsb3NlXCIsIFZpc2libGUgPSBGYWxzZVxyXG5IVE1MIEVsZW1lbnQgXCJxcmNvZGVcIiwgVmlzaWJsZSA9IEZhbHNlXHJcbkpTIEV4ZWN1dGUgXCJwdWJsaXNoZXIuZ2V0U2V0dGluZ3MoKVwiXHJcblxyXG5Eb1xyXG5cclxuXHRJZiBSRVNVTFQgPSAxXHJcblx0XHRSRVNVTFQgPSAwXHJcblxyXG5cdFx0SWYgRVRBUEUgPSAzXHJcblx0XHRcdENscyAwXHJcblx0XHRcdEVUQVBFID0gNFxyXG5cdFx0XHRRUkNvZGUgQ3JlYXRlIFVSTCQsIDI1NSwgMzAwLCAzMDBcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwidGV4dFBhbmVsXCIsIENvbnRlbnQkID0gVFhUX0VUQVBFMyRcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwiZG93bmxvYWRfYW5pbVwiLCBWaXNpYmxlID0gRmFsc2VcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwicHJlcGFyZV9hbmltXCIsIFZpc2libGUgPSBGYWxzZVxyXG5cdFx0XHRIVE1MIEVsZW1lbnQgXCJxcmNvZGVcIiwgVmlzaWJsZSA9IFRydWVcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwidGV4dFBhbmVsMlwiLCBWaXNpYmxlID0gVHJ1ZVxyXG5cdFx0XHRIVE1MIEVsZW1lbnQgXCJidG5fY2xvc2VcIiwgVmlzaWJsZSA9IFRydWUsIE9uQ2xpY2skID0gXCJDTE9TRV9BUFBcIlxyXG5cdFx0XHRIVE1MIEVsZW1lbnQgXCJxcmNvZGVcIiwgU3R5bGUkPVwiYmFja2dyb3VuZC1pbWFnZTp1cmwoJ1wiICsgSW1hZ2UgRGF0YVVSTCQoIDI1NSApICsgXCInKVwiXHJcblx0XHRFbmQgSWZcclxuXHJcblx0XHRJZiBFVEFQRSA9IDJcclxuXHRcdFx0RVRBUEUgPSAzIDogQ2xzIDBcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwiZG93bmxvYWRfYW5pbVwiLCBWaXNpYmxlID0gVHJ1ZVxyXG5cdFx0XHRIVE1MIEVsZW1lbnQgXCJwcmVwYXJlX2FuaW1cIiwgVmlzaWJsZSA9IEZhbHNlXHJcblx0XHRcdEhUTUwgRWxlbWVudCBcInRleHRQYW5lbFwiLCBDb250ZW50JCA9IFRYVF9FVEFQRTIkXHJcblx0XHRcdEpTIEV4ZWN1dGUgXCJwdWJsaXNoZXIucHVibGlzaFBhY2thZ2VkQXBwbGljYXRpb24oKVwiXHJcblx0XHRFbmQgSWZcclxuXHJcblx0XHRJZiBFVEFQRSA9IDFcclxuXHRcdFx0RVRBUEUgPSAyIDogQ2xzIDBcclxuXHRcdFx0SFRNTCBFbGVtZW50IFwiZG93bmxvYWRfYW5pbVwiLCBWaXNpYmxlID0gVHJ1ZVxyXG5cdFx0XHRIVE1MIEVsZW1lbnQgXCJwcmVwYXJlX2FuaW1cIiwgVmlzaWJsZSA9IEZhbHNlXHJcblx0XHRcdEhUTUwgRWxlbWVudCBcInRleHRQYW5lbFwiLCBDb250ZW50JCA9IFRYVF9FVEFQRTIkXHJcblx0XHRcdEpTIEV4ZWN1dGUgXCJwdWJsaXNoZXIucHJlcGFyZUFwcGxpY2F0aW9uRm9yUHVibGlzaCgpXCJcclxuXHRcdEVuZCBJZlxyXG5cclxuXHRFbmQgSWZcclxuXHJcblx0SWYgRVRBUEUgPSA0XHJcblx0RW5kIElmXHJcblxyXG5cdElmIFJFU1VMVCA9IC0xXHJcblx0XHRKUyBFeGVjdXRlIFwiY2xpZW50LmNsb3NlKClcIiA6IEVuZFxyXG5cdEVuZCBJZlxyXG5cclxuXHRXYWl0IFZibFxyXG5Mb29wXHJcblxyXG5Qcm9jZWR1cmUgQ0xPU0VfQVBQWyBFVkVOVCQgXVxyXG5cdEpTIEV4ZWN1dGUgXCJwdWJsaXNoZXIub3BlblVSTEluQnJvd3NlcigpXCJcclxuXHRKUyBFeGVjdXRlIFwiY2xpZW50LmNsb3NlKClcIiA6IEVuZFxyXG5FbmQgUHJvY1xyXG5cbmNsYXBmaW5cbiIsIm51bWJlciI6MCwicGFyZW50IjpudWxsLCJvZmZzZXRMaW5lcyI6MH1d')),
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
	this.vars.PRG_PATH$="";
	this.vars.ZIP_PATH$="";
	this.vars.LANG$="";
	this.vars.ETAPE=0;
	this.vars.RESULT=0;
	this.vars.ERR_TXT$="";
	this.vars.APP_ID$="";
	this.vars.URL$="";
	this.vars.TXT_ETAPE3$="";
	this.vars.TXT_ETAPE2$="";
	this.infoGlobals=
	{	
		prg_path$:this.aoz.varPtr('{"variable":{"name":"PRG_PATH$","token":"prg_path$","tokenCode":"PRG_PATH$","codeInit":"","nameReal":"PRG_PATH$","nameRealLower":"prg_path$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":1,"classDefinition":null},"parameters":""}'),
		zip_path$:this.aoz.varPtr('{"variable":{"name":"ZIP_PATH$","token":"zip_path$","tokenCode":"ZIP_PATH$","codeInit":"","nameReal":"ZIP_PATH$","nameRealLower":"zip_path$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":2,"classDefinition":null},"parameters":""}'),
		lang$:this.aoz.varPtr('{"variable":{"name":"LANG$","token":"lang$","tokenCode":"LANG$","codeInit":"","nameReal":"LANG$","nameRealLower":"lang$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":3,"classDefinition":null},"parameters":""}'),
		etape:this.aoz.varPtr('{"variable":{"name":"ETAPE","token":"etape","tokenCode":"ETAPE","codeInit":"","nameReal":"ETAPE","nameRealLower":"etape","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":4,"classDefinition":null},"parameters":""}'),
		result:this.aoz.varPtr('{"variable":{"name":"RESULT","token":"result","tokenCode":"RESULT","codeInit":"","nameReal":"RESULT","nameRealLower":"result","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":5,"classDefinition":null},"parameters":""}'),
		err_txt$:this.aoz.varPtr('{"variable":{"name":"ERR_TXT$","token":"err_txt$","tokenCode":"ERR_TXT$","codeInit":"","nameReal":"ERR_TXT$","nameRealLower":"err_txt$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":6,"classDefinition":null},"parameters":""}'),
		app_id$:this.aoz.varPtr('{"variable":{"name":"APP_ID$","token":"app_id$","tokenCode":"APP_ID$","codeInit":"","nameReal":"APP_ID$","nameRealLower":"app_id$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":7,"classDefinition":null},"parameters":""}'),
		url$:this.aoz.varPtr('{"variable":{"name":"URL$","token":"url$","tokenCode":"URL$","codeInit":"","nameReal":"URL$","nameRealLower":"url$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":8,"classDefinition":null},"parameters":""}'),
	};
	this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/tools/AOZ Link/AOZ Link.aoz
		aoz.sourcePos="0:3:0";
		aoz.currentScreen.currentTextWindow.setCursor(false);
		aoz.sourcePos="0:3:11";
		aoz.setFlash(false);
		// Palette $202020, $b8b8b8, $000000, $ffab00, $355470, $048faf, $ffffff
		aoz.sourcePos="0:4:0";
		aoz.currentScreen.setPalette([0x202020,0xB8B8B8,0x000000,0xFFAB00,0x355470,0x048FAF,0xFFFFFF],"#noremap");
		// Cls 0
		aoz.sourcePos="0:5:0";
		aoz.currentScreen.cls(0);
		// Load Asset "locale.json", "locale"
		aoz.sourcePos="0:7:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["locale.json","locale",false]};
	};
	this.blocks[1]=function(aoz,vars)
	{
		// Load Asset "js/client.js", "client"
		aoz.sourcePos="0:8:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["js/client.js","client",false]};
	};
	this.blocks[2]=function(aoz,vars)
	{
		// Load Asset "js/publisher.js", "publisher"
		aoz.sourcePos="0:9:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["js/publisher.js","publisher",false]};
	};
	this.blocks[3]=function(aoz,vars)
	{
		// Load Asset "css/fonts/avenir-next/font.css", "avenir_next"
		aoz.sourcePos="0:11:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["css/fonts/avenir-next/font.css","avenir_next",false]};
	};
	this.blocks[4]=function(aoz,vars)
	{
		// Load Asset "css/fonts/brandon_grotesque/font.css", "brandon"
		aoz.sourcePos="0:12:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["css/fonts/brandon_grotesque/font.css","brandon",false]};
	};
	this.blocks[5]=function(aoz,vars)
	{
		// Load Asset "css/global.css", "global"
		aoz.sourcePos="0:13:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["css/global.css","global",false]};
	};
	this.blocks[6]=function(aoz,vars)
	{
		// Load Asset "html/analyze.html", "analyze"
		aoz.sourcePos="0:15:0";
		return{type:12,waitThis:this.aoz.ASSET,callFunction:"loadAsset", waitFunction:"load_wait", args:["html/analyze.html","analyze",false]};
	};
	this.blocks[7]=function(aoz,vars)
	{
		// While Asset Loaded( "locale", "json" ) = False
		aoz.sourcePos="0:17:0";
		if(!((aoz.ASSET.isAssetLoaded( "locale", "json" ) )==(false)))
			return{type:1,label:10};
	};
	this.blocks[8]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:18:4";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[9]=function(aoz,vars)
	{
		// Wend
		aoz.sourcePos="0:19:0";
		if((aoz.ASSET.isAssetLoaded( "locale", "json" ) )==(false))
			return{type:1,label:8};
	};
	this.blocks[10]=function(aoz,vars)
	{
		// PRG_PATH$ = "" : ZIP_PATH$ = "" : LANG$ = "en"
		aoz.sourcePos="0:21:0";
		vars.PRG_PATH$="";
		aoz.sourcePos="0:21:17";
		vars.ZIP_PATH$="";
		aoz.sourcePos="0:21:34";
		vars.LANG$="en";
		// ETAPE = 1 : RESULT = 0 : ERR_TXT$ = ""
		aoz.sourcePos="0:22:0";
		vars.ETAPE=1;
		aoz.sourcePos="0:22:12";
		vars.RESULT=0;
		aoz.sourcePos="0:22:25";
		vars.ERR_TXT$="";
		// APP_ID$ = "" : URL$ = ""
		aoz.sourcePos="0:23:0";
		vars.APP_ID$="";
		aoz.sourcePos="0:23:15";
		vars.URL$="";
		// JS Execute "client.getLang()"
		aoz.sourcePos="0:26:0";
		JS_Execute( "client.getLang()" );
		// Show HTML "analyze"
		aoz.sourcePos="0:28:0";
		Show_HTML( "analyze", this.aoz.platformTrue, "" );
		// HTML Element "download_anim", Visible = False
		aoz.sourcePos="0:29:0";
		HTML_Element(
		{
			index: "download_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "textPanel2", Visible = False
		aoz.sourcePos="0:30:0";
		HTML_Element(
		{
			index: "textPanel2",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "btn_close", Visible = False
		aoz.sourcePos="0:31:0";
		HTML_Element(
		{
			index: "btn_close",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "qrcode", Visible = False
		aoz.sourcePos="0:32:0";
		HTML_Element(
		{
			index: "qrcode",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// JS Execute "publisher.getSettings()"
		aoz.sourcePos="0:33:0";
		JS_Execute( "publisher.getSettings()" );
		// Do
		aoz.sourcePos="0:35:0";
	};
	this.blocks[11]=function(aoz,vars)
	{
		// If RESULT = 1
		aoz.sourcePos="0:37:4";
		if(!((vars.RESULT)==(1)))
			return{type:1,label:20};
	};
	this.blocks[12]=function(aoz,vars)
	{
		// RESULT = 0
		aoz.sourcePos="0:38:8";
		vars.RESULT=0;
		// If ETAPE = 3
		aoz.sourcePos="0:40:8";
		if(!((vars.ETAPE)==(3)))
			return{type:1,label:15};
	};
	this.blocks[13]=function(aoz,vars)
	{
		// Cls 0
		aoz.sourcePos="0:41:12";
		aoz.currentScreen.cls(0);
		// ETAPE = 4
		aoz.sourcePos="0:42:12";
		vars.ETAPE=4;
		// QRCode Create URL$, 255, 300, 300
		aoz.sourcePos="0:43:12";
		return{type:12,waitThis:aoz.qrcode,callFunction:"create", waitFunction:"load_wait", args:[ vars.URL$, 255, 300, 300 ]};	
		aoz.qrcode.create( vars.URL$, 255, 300, 300 );
	};
	this.blocks[14]=function(aoz,vars)
	{
		// HTML Element "textPanel", Content$ = TXT_ETAPE3$
		aoz.sourcePos="0:44:12";
		HTML_Element(
		{
			index: "textPanel",
			className: "",
			content: vars.TXT_ETAPE3$,
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "download_anim", Visible = False
		aoz.sourcePos="0:45:12";
		HTML_Element(
		{
			index: "download_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "prepare_anim", Visible = False
		aoz.sourcePos="0:46:12";
		HTML_Element(
		{
			index: "prepare_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "qrcode", Visible = True
		aoz.sourcePos="0:47:12";
		HTML_Element(
		{
			index: "qrcode",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "textPanel2", Visible = True
		aoz.sourcePos="0:48:12";
		HTML_Element(
		{
			index: "textPanel2",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "btn_close", Visible = True, OnClick$ = "CLOSE_APP"
		aoz.sourcePos="0:49:12";
		HTML_Element(
		{
			index: "btn_close",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "CLOSE_APP",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "qrcode", Style$="background-image:url('" + Image DataURL$( 255 ) + "')"
			var img = aoz.banks.getImage('images',255);
		aoz.sourcePos="0:50:12";
		HTML_Element(
		{
			index: "qrcode",
			className: "",
			content: "",
			style: "background-image:url('"+aoz.banks.utilities.getBase64Image( img.getCanvas( false, false ) )+"')",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// End If
		aoz.sourcePos="0:51:8";
	};
	this.blocks[15]=function(aoz,vars)
	{
		// If ETAPE = 2
		aoz.sourcePos="0:53:8";
		if(!((vars.ETAPE)==(2)))
			return{type:1,label:17};
	};
	this.blocks[16]=function(aoz,vars)
	{
		// ETAPE = 3 : Cls 0
		aoz.sourcePos="0:54:12";
		vars.ETAPE=3;
		aoz.sourcePos="0:54:24";
		aoz.currentScreen.cls(0);
		// HTML Element "download_anim", Visible = True
		aoz.sourcePos="0:55:12";
		HTML_Element(
		{
			index: "download_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "prepare_anim", Visible = False
		aoz.sourcePos="0:56:12";
		HTML_Element(
		{
			index: "prepare_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "textPanel", Content$ = TXT_ETAPE2$
		aoz.sourcePos="0:57:12";
		HTML_Element(
		{
			index: "textPanel",
			className: "",
			content: vars.TXT_ETAPE2$,
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// JS Execute "publisher.publishPackagedApplication()"
		aoz.sourcePos="0:58:12";
		JS_Execute( "publisher.publishPackagedApplication()" );
		// End If
		aoz.sourcePos="0:59:8";
	};
	this.blocks[17]=function(aoz,vars)
	{
		// If ETAPE = 1
		aoz.sourcePos="0:61:8";
		if(!((vars.ETAPE)==(1)))
			return{type:1,label:19};
	};
	this.blocks[18]=function(aoz,vars)
	{
		// ETAPE = 2 : Cls 0
		aoz.sourcePos="0:62:12";
		vars.ETAPE=2;
		aoz.sourcePos="0:62:24";
		aoz.currentScreen.cls(0);
		// HTML Element "download_anim", Visible = True
		aoz.sourcePos="0:63:12";
		HTML_Element(
		{
			index: "download_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "prepare_anim", Visible = False
		aoz.sourcePos="0:64:12";
		HTML_Element(
		{
			index: "prepare_anim",
			className: "",
			content: "",
			style: "",
			focus: this.aoz.platformTrue,
			visible: false,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// HTML Element "textPanel", Content$ = TXT_ETAPE2$
		aoz.sourcePos="0:65:12";
		HTML_Element(
		{
			index: "textPanel",
			className: "",
			content: vars.TXT_ETAPE2$,
			style: "",
			focus: this.aoz.platformTrue,
			visible: this.aoz.platformTrue,
			enable: this.aoz.platformTrue,
			value: "",
			source: "",
			checked: -255,
			onFocus: "",
			onBlur: "",
			onClick: "",
			onDoubleClick: "",
			onMouseDown: "",
			onMouseUp: "",
			onMouseMove: "",
			onMouseEnter: "",
			onMouseOver: "",
			onMouseOut: "",
			onKeyPress: "",
			onKeyDown: "",
			onKeyUp: "",
			position: "",
			left: -100101,
			right: -100101,
			top: -100101,
			bottom: -100101,
			zIndex: -1,
			width: -1,
			height: -1,
			startX: -100101,
			startY: -100101,
			endX: -100101,
			endY: -100101,
			duration: 1000
		} );
		// JS Execute "publisher.prepareApplicationForPublish()"
		aoz.sourcePos="0:66:12";
		JS_Execute( "publisher.prepareApplicationForPublish()" );
		// End If
		aoz.sourcePos="0:67:8";
	};
	this.blocks[19]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:69:4";
	};
	this.blocks[20]=function(aoz,vars)
	{
		// If ETAPE = 4
		aoz.sourcePos="0:71:4";
		if(!((vars.ETAPE)==(4)))
			return{type:1,label:22};
	};
	this.blocks[21]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:72:4";
	};
	this.blocks[22]=function(aoz,vars)
	{
		// If RESULT = -1
		aoz.sourcePos="0:74:4";
		if(!((vars.RESULT)==(-1)))
			return{type:1,label:25};
	};
	this.blocks[23]=function(aoz,vars)
	{
		// JS Execute "client.close()" : End
		aoz.sourcePos="0:75:8";
		JS_Execute( "client.close()" );
		aoz.sourcePos="0:75:38";
		return{type:16}
	};
	this.blocks[24]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:76:4";
	};
	this.blocks[25]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:78:4";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[26]=function(aoz,vars)
	{
		// Loop
		aoz.sourcePos="0:79:0";
		return{type:1,label:11};
	};
	this.blocks[27]=function(aoz,vars)
	{
		return{type:0}
	};
	this.p_close_app=function(aoz,parent,args)
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
			// JS Execute "publisher.openURLInBrowser()"
			aoz.sourcePos="0:82:4";
			JS_Execute( "publisher.openURLInBrowser()" );
			// JS Execute "client.close()" : End
			aoz.sourcePos="0:83:4";
			JS_Execute( "client.close()" );
			aoz.sourcePos="0:83:34";
			return{type:16}
		};
		this.blocks[1]=function(aoz,vars)
		{
			// End Proc
			return{type:0};
		};
	};
	this.aoz.run(this,0,args);
	this.aoz.v1_0_aozhtml=new v1_0_aozhtml(this.aoz,args);
	this.aoz.v1_0_asset=new v1_0_asset(this.aoz,args);
	this.aoz.v1_0_banks=new v1_0_banks(this.aoz,args);
	this.aoz.v1_0_collisions=new v1_0_collisions(this.aoz,args);
	this.aoz.v1_0_colours=new v1_0_colours(this.aoz,args);
	this.aoz.v1_0_graphics=new v1_0_graphics(this.aoz,args);
	this.aoz.v1_0_sprites=new v1_0_sprites(this.aoz,args);
	this.aoz.v1_0_td=new v1_0_td(this.aoz,args);
	this.aoz.v1_0_textwindows=new v1_0_textwindows(this.aoz,args);
	this.aoz.v1_0_time=new v1_0_time(this.aoz,args);
	this.aoz.ext_qrcode=new ext_qrcode(this.aoz,args);
};
