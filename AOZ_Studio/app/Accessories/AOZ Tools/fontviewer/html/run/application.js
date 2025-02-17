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
// Compiled with AOZ Transpiler Version 14.03 on the 20/02/2023-16:10:05
//
function Application( canvasId, args )
{
	this.root=this;
	this.parent=this;
	this.contextName='application';
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsImluZm9zIjp7ImFwcGxpY2F0aW9uTmFtZSI6Ik5hbWUgb2YgeW91ciBhcHBsaWNhdGlvbi4iLCJhdXRob3IiOiJCeSBZb3UiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAwLjAiLCJkYXRlIjoiQ3JlYXRlZCBvbiB0aGUgLi4uIiwiY29weXJpZ2h0IjoiKGMpIFlvdXIgQ29ycG9yYXRpb24gVW5saW1pdGVkIiwic3RhcnQiOiJtYWluLmFveiJ9LCJjb21waWxhdGlvbiI6eyJwbGF0Zm9ybSI6ImFveiIsImtleW1hcCI6ImFveiIsIm1hY2hpbmUiOiJtb2Rlcm4iLCJzcGVlZCI6ImZhc3QiLCJzeW50YXgiOiJlbmhhbmNlZCIsImVuZGlhbiI6ImJpZyIsIm5vV2FybmluZyI6W10sImRpc3BsYXlFbmRBbGVydCI6ZmFsc2UsImRpc3BsYXlFcnJvckFsZXJ0Ijp0cnVlLCJ1c2VMb2NhbFRhYnMiOnRydWUsImluY2x1ZGVQYXRocyI6W119LCJkaXNwbGF5Ijp7InR2U3RhbmRhcmQiOiJwYWwiLCJ3aWR0aCI6MTI4MCwiaGVpZ2h0Ijo3MjAsImJhY2tncm91bmQiOiJjb2xvciIsImJhY2tncm91bmRDb2xvciI6IiMwMDAwMDAiLCJib2R5QmFja2dyb3VuZENvbG9yIjoiIzAwMDAwMCIsImJvZHlCYWNrZ3JvdW5kSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL3N0YXJfbmlnaHQuanBlZyIsInNjYWxlWCI6MSwic2NhbGVZIjoxLCJzY3JlZW5TY2FsZSI6MSwiZnBzIjpmYWxzZSwiZnBzRm9udCI6IjEycHggVmVyZGFuYSIsImZwc0NvbG9yIjoiI0ZGRkYwMCIsImZwc1giOjEwLCJmcHNZIjoxNiwiZnVsbFBhZ2UiOnRydWUsImZ1bGxTY3JlZW4iOnRydWUsImtlZXBQcm9wb3J0aW9ucyI6dHJ1ZSwiZnVsbFNjcmVlbkljb24iOnRydWUsImZ1bGxTY3JlZW5JY29uWCI6LTM0LCJmdWxsU2NyZWVuSWNvblkiOjIsImZ1bGxTY3JlZW5JY29uSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL2Z1bGxfc2NyZWVuLnBuZyIsInNtYWxsU2NyZWVuSWNvbkltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9zbWFsbF9zY3JlZW4ucG5nIiwicmVuZGVyZXIiOiJjYW52YXMiLCJzbW9vdGhpbmciOnRydWV9LCJzcHJpdGVzIjp7ImNvbGxpc2lvbkJveGVkIjpmYWxzZSwiY29sbGlzaW9uUHJlY2lzaW9uIjoxLCJjb2xsaXNpb25BbHBoYVRocmVzaG9sZCI6MX0sInNvdW5kcyI6eyJtb2RlIjoiYW1pZ2EiLCJ2b2x1bWUiOjEsInByZWxvYWQiOnRydWUsIm51bWJlck9mU291bmRzVG9QcmVsb2FkIjo0LCJzb3VuZFBvb2xTaXplIjo0fSwiZ2FtZXBhZCI6eyJtYXBwaW5nIjp7InVwIjoiQXJyb3dVcCIsImRvd24iOiJBcnJvd0Rvd24iLCJsZWZ0IjoiQXJyb3dMZWZ0IiwicmlnaHQiOiJBcnJvd1JpZ2h0IiwiZmlyZSI6IlNwYWNlIn19LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6dHJ1ZSwid2FpdFNvdW5kcyI6MCwiY2xpY2tTb3VuZHMiOmZhbHNlfSwicmFpbmJvd3MiOnsibW9kZSI6InNsb3cifSwiZm9udHMiOnsibGlzdEZvbnRzIjoiUEMiLCJpbmNsdWRlIjpbIioud29mZiIsIioud29mZjIiLCIqLnR0ZiJdLCJhbWlnYSI6W10sImdvb2dsZSI6WyJhY2xvbmljYSIsImFjbWUiLCJhZGFtaW5hIiwiYWd1YWZpbmEgc2NyaXB0IiwiYWtyb25pbSIsImFsbGVydGEgc3RlbmNpbCIsImFubmllIHVzZSB5b3VyIHRlbGVzY29wZSIsImJhbG9vIiwiYm9uYm9uIiwiY2hlbHNlYSBtYXJrZXQiLCJjcmFmdHkgZ2lybHMiLCJjcmVlcHN0ZXIiLCJkYW1pb24iLCJkaXBsb21hdGEiLCJkb3JzYSIsImRyIHN1Z2l5YW1hIiwiZWFzdCBzZWEgZG9rZG8iLCJlYXRlciIsImVtaWx5cyBjYW5keSIsImV3ZXJ0IiwiZXhwbGV0dXMgc2FucyIsImZhc2NpbmF0ZSBpbmxpbmUiLCJmYXN0ZXIgb25lIiwiZmluZ2VyIHBhaW50IiwiZmxhbWVuY28iLCJmbGF2b3JzIiwiZm9udGRpbmVyIHN3YW5reSIsImZyYW5jb2lzIG9uZSIsImZyZWRlcmlja2EgdGhlIGdyZWF0IiwiZnJpam9sZSIsImdhbGluZG8iLCJnZW8iLCJnZW9zdGFyIiwiZ2VybWFuaWEgb25lIiwiZ3JhZHVhdGUiLCJncmlmZnkiLCJndWdpIiwiaGFuYWxlaSIsImhhbmFsZWkgZmlsbCIsImhlbm55IHBlbm55IiwiaG9tZW1hZGUgYXBwbGUiLCJpYm0gcGxleCBtb25vIiwiaXJpc2ggZ3JvdmVyIiwiam9sbHkgbG9kZ2VyIiwia2lyYW5nIGhhZXJhbmciLCJrcmFua3kiLCJsYWNxdWVyIiwibGFra2kgcmVkZHkiLCJsYXRvIiwibGVhZ3VlIHNjcmlwdCIsImxvdmUgeWEgbGlrZSBhIHNpc3RlciIsImx1Y2tpZXN0IGd1eSIsIm1hcmdhcmluZSIsIm1lZ3JpbSIsIm1ldGFsIG1hbmlhIiwibW9ub2ZldHQiLCJtb25vdG9uIiwibW91bnRhaW5zIG9mIGNocmlzdG1hcyIsIm15c3RlcnkgcXVlc3QiLCJuZXcgcm9ja2VyIiwibm9zaWZlciIsIm5vdmEgbW9ubyIsIm9wZW4gc2FucyIsIm92ZXJwYXNzIG1vbm8iLCJveHlnZW4gbW9ubyIsInBhbmdvbGluIiwicGFzc2VybyBvbmUiLCJwZXJtYW5lbnQgbWFya2VyIiwicGllZHJhIiwicGlyYXRhIG9uZSIsInBpeGVsdHlwZSIsInBsYXN0ZXIiLCJwb2lyZXQgb25lIiwicHJpbmNlc3Mgc29maWEiLCJwdCBtb25vIiwicmFjaW5nIHNhbnMgb25lIiwicmFra2FzIiwicmFsZXdheSIsInJhbGV3YXkgZG90cyIsInJlZCBoYXQgZGlzcGxheSIsInJlZCBoYXQgdGV4dCIsInJpZ2h0ZW91cyIsInJvYm90byIsInJvYm90byBtb25vIiwicm9ib3RvIHNsYWIiLCJyb2NrIHNhbHQiLCJyeWUiLCJzYWlyYSBzdGVuY2lsIG9uZSIsInNhbmNyZWVrIiwic2FyaW5hIiwic2Nob29sYmVsbCIsInNlYXdlZWQgc2NyaXB0Iiwic2hhcmUgdGVjaCBtb25vIiwic2hvanVtYXJ1Iiwic2lnbWFyIG9uZSIsInNpbmdsZSBkYXkiLCJzaXJpbiBzdGVuY2lsIiwic21va3VtIiwic25vd2J1cnN0IG9uZSIsInNvbnNpZSBvbmUiLCJzb3VyY2UgY29kZSBwcm8iLCJzcGFjZSBtb25vIiwic3BlY2lhbCBlbGl0ZSIsInNwaWN5IHJpY2UiLCJzdGFsaW5pc3Qgb25lIiwic3RhcmRvcyBzdGVuY2lsIiwic3VwZXJtZXJjYWRvIG9uZSIsInN3YW5reSBhbmQgbW9vIG1vbyIsInN5bmNvcGF0ZSIsInRleHQgbWUgb25lIiwidHJhZGUgd2luZHMiLCJ0cm9jY2hpIiwidWJ1bnR1IiwidWJ1bnR1IG1vbm8iLCJ1bHRyYSIsInVuY2lhbCBhbnRpcXVhIiwidW5kZXJkb2ciLCJ1bmlmcmFrdHVyY29vayIsInVuaWZyYWt0dXJtYWd1bnRpYSIsInZhc3Qgc2hhZG93IiwidnQzMjMiLCJ3YWxscG9ldCIsIndhcm5lcyIsIndpcmUgb25lIiwid29yayBzYW5zIiwieWF0cmEgb25lIiwieWVvbiBzdW5nIiwieWVzZXZhIG9uZSIsInpjb29sIGt1YWlsZSIsInpleWFkYSIsInppbGxhIHNsYWIiLCJ6aWxsYSBzbGFiIGhpZ2hsaWdodCJdfSwiZmlsZVN5c3RlbSI6eyJjYXNlU2Vuc2l0aXZlIjpmYWxzZX0sImRlZmF1bHQiOnsic2NyZWVuIjp7IngiOjAsInkiOjAsIndpZHRoIjoxMjgwLCJoZWlnaHQiOjcyMCwibnVtYmVyT2ZDb2xvcnMiOjMyLCJwaXhlbE1vZGUiOiJsb3dyZXMiLCJwYWxldHRlIjpbIiMwMDAwMDAiLCIjRkZGRkZGIiwiIzAwMDAwMCIsIiMyMjIyMjIiLCIjRkYwMDAwIiwiIzAwRkYwMCIsIiMwMDAwRkYiLCIjNjY2NjY2IiwiIzU1NTU1NSIsIiMzMzMzMzMiLCIjNzczMzMzIiwiIzMzNzczMyIsIiM3Nzc3MzMiLCIjMzMzMzc3IiwiIzc3MzM3NyIsIiMzMzc3NzciLCIjMDAwMDAwIiwiI0VFQ0M4OCIsIiNDQzY2MDAiLCIjRUVBQTAwIiwiIzIyNzdGRiIsIiM0NDk5REQiLCIjNTVBQUVFIiwiI0FBRERGRiIsIiNCQkRERkYiLCIjQ0NFRUZGIiwiI0ZGRkZGRiIsIiM0NDAwODgiLCIjQUEwMEVFIiwiI0VFMDBFRSIsIiNFRTAwODgiLCIjRUVFRUVFIl0sIndpbmRvdyI6eyJ4IjowLCJ5IjowLCJmb250V2lkdGgiOjE2LCJmb250SGVpZ2h0IjozMCwiYm9yZGVyIjowLCJwYXBlciI6MCwicGVuIjoxLCJiYWNrZ3JvdW5kIjoib3BhcXVlIiwiZm9udCI6eyJuYW1lIjoiSUJNIFBsZXggTW9ubyIsInR5cGUiOiJnb29nbGUiLCJoZWlnaHQiOjI2LjY1fSwiY3Vyc29ySW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL2N1cnNvcl9wYy5wbmciLCJjdXJzb3JDb2xvcnMiOlt7InIiOjY4LCJnIjo2OCwiYiI6MCwiYSI6MTI4fSx7InIiOjEzNiwiZyI6MTM2LCJiIjowLCJhIjoxMjh9LHsiciI6MTg3LCJnIjoxODcsImIiOjAsImEiOjEyOH0seyJyIjoyMjEsImciOjIyMSwiYiI6MCwiYSI6MTI4fSx7InIiOjIzOCwiZyI6MjM4LCJiIjowLCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjM0LCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjEzNiwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjoyMDQsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhIjoxMjh9LHsiciI6MTcwLCJnIjoxNzAsImIiOjI1NSwiYSI6MTI4fSx7InIiOjEzNiwiZyI6MTM2LCJiIjoyMDQsImEiOjEyOH0seyJyIjoxMDIsImciOjEwMiwiYiI6MTcwLCJhIjoxMjh9LHsiciI6MzQsImciOjM0LCJiIjoxMDIsImEiOjEyOH0seyJyIjowLCJnIjowLCJiIjo2OCwiYSI6MTI4fSx7InIiOjAsImciOjAsImIiOjE3LCJhIjoxMjh9LHsiciI6MCwiZyI6MCwiYiI6MCwiYSI6MTI4fV19fX19'));
	var options =
	{
		manifest: this.manifest,
		sources: JSON.parse(atob('W3sicGF0aCI6IkM6L0FPWl9TdHVkaW8vQU9aX1N0dWRpby9hcHAvQWNjZXNzb3JpZXMvQU9aIFRvb2xzL2ZvbnR2aWV3ZXIvbWFpbi5hb3oiLCJzb3VyY2UiOiIvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gR29vZ2xlIEZvbnQgVmlld2VyIC8vXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy8gIEJ5IERhdmUgQmFsZHdpblxyXG5cclxuLy8gVjEuMFx0LSBGZWJydWFyeSAyMDIwXHJcbi8vIFYxLjEgLSAzMC8xMi8yMDIwIC0gQWRkZWQgZ3JhZHVhdGVkIGZvbnQgc2l6ZSB0byBzaW5nbGUgZm9udCBwYWdlLCBhbmQgYWRkZWQgc29tZSBjb2xvdXIhIENvbW1lbnRlZCBvdXQgMyBmb250cyB0aGF0IHdlcmVuJ3QgZGlzcGxheWluZyBwcm9wZXJseSAtIDIgeCBMaWJyZSBCYXJjb2RlIDEyOCBhbmQgUHJlc3MgU3RhcnQgMlBcclxuXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgICAgXHJcblxyXG5udW1iZXJfb2ZfZm9udHMgPSBHZXQgRm9udCBOdW1iZXIoKVxyXG5TY3JlZW4gT3BlbiAwLCBzY3JlZW4gd2lkdGgsIHNjcmVlbiBoZWlnaHQsIDE2LCBMb3dyZXNcclxuU2V0IFRyYW5zcGFyZW50IDBcclxuQ3VycyBPZmZcclxuXHJcbnNlPS0xXHJcbmskID0gXCJcIlxyXG5kaXNfbnVtPS0xXHJcbmZvbnRfbnVtYmVyPTBcclxuSW5rIDZcclxuUmFuZ2U9MTgwXHJcbkJyaWdodD02MFxyXG5cclxuUmVwZWF0XHJcblxyXG4gICAgQ2xzIDBcclxuICAgIElmIHNlPTFcclxuXHQgICAgU2NyZWVuIFNrZXcgMCwxLC0xXHJcblx0ICAgIFNjcmVlbiBTY2FsZSAwLDAsMFxyXG4gICAgZW5kIGlmXHJcbiAgICBIb21lXHJcbiAgICB4ID0gU2NyZWVuIFdpZHRoIC8gMlxyXG4gICAgeSA9IDUwXHJcbiAgICBzaXplID0gNDBcclxuICAgIFNldCBGb250IDgxLCAyNVxyXG5cdGNvbG91ciA2LCQwMGEwYjBcclxuICAgIFRleHQgMTAsMjAsXCJTIC0gU2tldyBFZmZlY3RzIE9uL09mZlwiXHJcbiAgICBUZXh0IDEwLDUwLFwiTiAtIE5leHRcIlxyXG4gICAgVGV4dCAxMCw4MCxcIlAgLSBQcmV2aW91c1wiXHJcbiAgICBUZXh0IFNjcmVlbiBXaWR0aC0yNTAsMjAsXCJUIC0gVGVuIGF0IGEgVGltZVwiXHJcbiAgICBUZXh0IFNjcmVlbiBXaWR0aC0yNTAsNTAsXCJBIC0gU2hvdyBhbGxcIlxyXG4gICAgU2V0IEZvbnQgODEsc2l6ZVxyXG5cdElmIGRpc19udW09MVxyXG4gICAgXHRUZXh0IHgsIHksIFwiRm9udCBudW1iZXI6IFwiICsgU3RyJCggZm9udF9udW1iZXIgKStcIiB0b1wiK1N0ciQobWluKGZvbnRfbnVtYmVyKzksbnVtYmVyX29mX2ZvbnRzLTEpKSwgXCIjY2VudGVyXCJcclxuICAgIGVsc2VcclxuICAgIFx0VGV4dCB4LCB5LCBcIkZvbnQgbnVtYmVyOiBcIiArIFN0ciQoIGZvbnRfbnVtYmVyICksIFwiI2NlbnRlclwiXHJcbiAgICBlbmQgaWZcclxuICAgIHkgPSA4MFxyXG4gICAgc2l6ZSA9IDEwXHJcbiAgICBjb3VudD0wXHJcbiAgICBHb3N1YiBDbGVhbmZvbnRcclxuICAgIElmIGRpc19udW09LTFcclxuXHQgICAgRm9yIGNvdW50ID0gMCBUbyA4XHJcblx0XHRcdEdvc3ViIENoX2NvbFxyXG5cdCAgICAgICAgc2l6ZSA9IHNpemUgKyA1XHJcblx0ICAgICAgICBTZXQgRm9udCBmb250X251bWJlciwgc2l6ZSA6IFdhaXQgMC4wMDFcclxuXHQgICAgICAgIFRleHQgeCwgeSwgRiQrXCIgXCIrU3RyJChzaXplKStcIiAgXCIrVXBwZXIkKEYkKSwgXCIjY2VudGVyXCJcclxuXHQgICAgICAgIHkgPSB5ICsgc2l6ZSArIDhcclxuXHQgICAgTmV4dCBjb3VudFxyXG5cdCAgICB5PXkrMjBcclxuXHRcdEdvc3ViIENoX2NvbFxyXG5cdCAgICBUZXh0IHgseSxcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaXCIsXCIjY2VudGVyXCJcclxuXHQgICAgeT15K3NpemUrMThcclxuXHRcdEdvc3ViIENoX2NvbFxyXG5cdCAgICBUZXh0IHgseSxcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCIsXCIjY2VudGVyXCJcclxuXHQgICAgeT15K3NpemUrMThcclxuXHRcdEdvc3ViIENoX2NvbFxyXG5cdCAgICBUZXh0IHgseSxcIjEgMiAzIDQgNSA2IDcgOCA5IDAgXCIsXCIjY2VudGVyXCJcclxuXHQgICAgeT15K3NpemUrMThcclxuXHRcdEdvc3ViIENoX2NvbFxyXG5cdCAgICBUZXh0IHgseSxcIiEgICAkICUgJiAqICggKSAtICsgPSAsIC4gOiA7IEBcIixcIiNjZW50ZXJcIlxyXG4gICAgZW5kIGlmXHJcbiAgICBJZiBkaXNfbnVtPTFcclxuICAgICAgICB5PTE0MFxyXG4gICAgICAgIHNpemU9NTBcclxuICAgICAgICBGb3IgY291bnQgPSAwIHRvIDlcclxuICAgICAgICBFeGl0IElmIGZvbnRfbnVtYmVyK2NvdW50Pm51bWJlcl9vZl9mb250cy0xXHJcbiAgICAgICAgR29zdWIgQ2xlYW5mb250XHJcblx0XHRHb3N1YiBDaF9jb2xcclxuICAgICAgICBTZXQgRm9udCBmb250X251bWJlcitjb3VudCxzaXplIDogV2FpdCAwLjAwMVxyXG4gICAgICAgIFRleHQgeCwgeSwgRiQrXCIgXCIrU3RyJChmb250X251bWJlcitjb3VudCkrXCIgIFwiK1VwcGVyJChGJCksIFwiI2NlbnRlclwiXHJcbiAgICAgICAgeSA9IHkgKyBzaXplICsgOFxyXG4gICAgICAgIE5leHQgY291bnRcclxuICAgIGVuZCBJZlxyXG5cclxuICAgIC8vIENhbGwgU2NyZWVuIENoYW5nZSAoUmVzdG9yZSBDdXJyZW50IFNjcmVlbilcclxuICAgIElmIHNlPTFcclxuICAgICAgICBTY3JlZW5DaGFuZ2VbMCw1MCxSbmQoMiktMSxSbmQoMiktMV1cclxuICAgIEVuZCBpZlxyXG5cclxuICAgIFJlcGVhdFxyXG4gICAgICAgIFdhaXQgMC4wMVxyXG4gICAgICAgIGskID0gSW5rZXkkXHJcbiAgICBVbnRpbCBrJCAhPSBcIlwiXHJcblxyXG4gICAgaWYgayQ9XCJwXCJcclxuICAgICAgICBpZiBkaXNfbnVtPS0xXHJcbiAgICAgICAgICAgIEFkZCBmb250X251bWJlciwtMSA6IGZvbnRfbnVtYmVyID0gTWF4KCAxLCBmb250X251bWJlciApXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBBZGQgZm9udF9udW1iZXIsLTEwIDogZm9udF9udW1iZXIgPSBNYXgoIDEsIGZvbnRfbnVtYmVyIClcclxuICAgICAgICBlbmQgaWZcclxuICAgIEVuZCBpZlxyXG4gICAgaWYgayQ9XCJuXCJcclxuICAgICAgICBpZiBkaXNfbnVtPS0xXHJcbiAgICAgICAgICAgIEFkZCBmb250X251bWJlciwxIDogZm9udF9udW1iZXIgPSBNaW4oIG51bWJlcl9vZl9mb250cy0xLCBmb250X251bWJlciApXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBBZGQgZm9udF9udW1iZXIsMTAgOiBmb250X251bWJlciA9IE1pbiggbnVtYmVyX29mX2ZvbnRzLTEsIGZvbnRfbnVtYmVyXHJcbiAgICAgICAgZW5kIGlmXHJcbiAgICBFbmQgaWZcclxuXHJcbiAgICBpZiBrJD1cInRcIiB0aGVuIGRpc19udW09LWRpc19udW1cclxuXHJcbiAgICBJZiBrJD1cInNcIiB0aGVuIHNlPS1zZVxyXG5cclxuICAgIGlmIGskPVwiYVwiXHJcbiAgICAgICAgQ2xzIDBcclxuICAgICAgICBmb3IgeD0wIHRvIDRcclxuICAgICAgICBmb3IgeT0wIHRvIDI2XHJcblx0XHRHb3N1YiBDaF9jb2xcclxuICAgICAgICBJZiAoeCoyNykreTxudW1iZXJfb2ZfZm9udHNcclxuICAgICAgICAgICAgU2V0IEZvbnQgKHgqMjcpK3ksMjNcclxuICAgICAgICAgICAgRiQ9Rm9udCQoKHgqMjcpK3kpXHJcbiAgICAgICAgICAgIEw9TGVuKEYkKVxyXG4gICAgICAgICAgICBGb3IgTj0xIHRvIExcclxuICAgICAgICAgICAgICAgSWYgTWlkJChGJCxOLDEpPVwiKFwiIHRoZW4gRXhpdFxyXG4gICAgICAgICAgICBOZXh0IE5cclxuICAgICAgICAgICAgRiQ9TGVmdCQoRiQsTi0xKVxyXG4gICAgICAgICAgICBUZXh0IHgqMjY4LHkqMjYrMjYsRiRcclxuICAgICAgICBFbmQgaWZcclxuICAgICAgICBOZXh0IHlcclxuICAgICAgICBOZXh0IHhcclxuICAgICAgICBSZXBlYXRcclxuICAgICAgICBXYWl0IDAuMDAxXHJcbiAgICAgICAgayQgPSBJbmtleSRcclxuICAgICAgICBVbnRpbCBrJCAhPSBcIlwiXHJcbiAgICBlbmQgaWZcclxuXHJcbiAgICAvLyBDYWxsIFNjcmVlbiBDaGFuZ2UgKFJlbW92ZSBDdXJyZW50IFNjcmVlbilcclxuICAgIElmIHNlPTFcclxuICAgICAgICBTY3JlZW5DaGFuZ2VbMSw1MCxSbmQoMiktMSxSbmQoMiktMV1cclxuICAgIEVuZCBpZlxyXG5cclxuVW50aWwgayQgPSBcInFcIlxyXG5FbmRcclxuQ2hfY29sOlxyXG5cdHI9cm5kKFJhbmdlKStCcmlnaHRcclxuXHRnPXJuZChSYW5nZSkrQnJpZ2h0XHJcblx0Yj1ybmQoUmFuZ2UpK0JyaWdodFxyXG5cdGM9cmdiKHIsZyxiKVxyXG5cdGNvbG91ciA2LGNcclxuUmV0dXJuXHJcblxyXG4vLyBSZW1vdmUgZXZlcnl0aGluZyBidXQgdGhlIG5hbWUgZnJvbSB0aGUgRm9udCRcclxuQ2xlYW5mb250OlxyXG4gICAgRiQ9Rm9udCQoZm9udF9udW1iZXIrY291bnQpXHJcbiAgICBMPUxlbihGJClcclxuICAgIEZvciBOPTEgdG8gTFxyXG4gICAgICAgIElmIE1pZCQoRiQsTiwxKT1cIihcIiB0aGVuIEV4aXRcclxuICAgIE5leHQgTlxyXG4gICAgRiQ9TGVmdCQoRiQsTi0xKVxyXG5SZXR1cm5cclxuXHJcblByb2NlZHVyZSBTY3JlZW5DaGFuZ2VbVCxTLFhtLFltXVxyXG4gICAgSWYgVD0xXHJcbiAgICAgICAgU3Q9MCA6IEVuPTFcclxuICAgIEVsc2VcclxuICAgICAgICBTdD0xIDogRW49MFxyXG4gICAgRW5kIGlmXHJcbiAgICBTdHAjPShFbi1TdCkvU1xyXG4gICAgZm9yIGYjPVN0IHRvIEVuIHN0ZXAgU3RwI1xyXG4gICAgICAgIHdhaXQgMC4wMDFcclxuICAgICAgICBTY3JlZW4gU2tldyAwLFhtKmYjLFltKmYjXHJcbiAgICAgICAgSWYgWG09MSBhbmQgWW09MVxyXG4gICAgICAgICAgICBTY3JlZW4gU2NhbGUgMCwxLWYjKjIsMS1mIyoyXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBTY3JlZW4gU2NhbGUgMCwxLWYjLDEtZiNcclxuICAgICAgICBFbmQgaWZcclxuICAgIG5leHQgZiNcclxuICAgIFNjcmVlbiBTY2FsZSAwLFN0LFN0XHJcbiAgICBTY3JlZW4gU2tldyAwLDAsMFxyXG5FbmQgcHJvY1xyXG5cclxuXG5jbGFwZmluXG4iLCJudW1iZXIiOjAsInBhcmVudCI6bnVsbCwib2Zmc2V0TGluZXMiOjB9XQ==')),
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
	this.vars.number_of_fonts=0;
	this.vars.se=0;
	this.vars.k$="";
	this.vars.dis_num=0;
	this.vars.font_number=0;
	this.vars.Range=0;
	this.vars.Bright=0;
	this.vars.x=0;
	this.vars.y=0;
	this.vars.size=0;
	this.vars.count=0;
	this.vars.F$="";
	this.vars.L=0;
	this.vars.N=0;
	this.vars.r=0;
	this.vars.g=0;
	this.vars.b=0;
	this.vars.c=0;
	this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/Accessories/AOZ Tools/fontviewer/main.aoz
		aoz.sourcePos="0:12:0";
		vars.number_of_fonts=aoz.fp2Int(aoz.fonts.getNumberOfFonts());
		// Screen Open 0, screen width, screen height, 16, Lowres
		aoz.sourcePos="0:13:0";
		aoz.screenOpen(
		{
			index:0,
			width:aoz.currentScreen.dimension.width,
			height:aoz.currentScreen.dimension.height,
			depth:undefined,
			numberOfColors:16,
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
	this.blocks[1]=function(aoz,vars)
	{
		// Set Transparent 0
		aoz.sourcePos="0:14:0";
		aoz.currentScreen.setTransparent([0],true);
		// Curs Off
		aoz.sourcePos="0:15:0";
		aoz.currentScreen.currentTextWindow.setCursor(false);
		// se=-1
		aoz.sourcePos="0:17:0";
		vars.se=-1;
		// k$ = ""
		aoz.sourcePos="0:18:0";
		vars.k$="";
		// dis_num=-1
		aoz.sourcePos="0:19:0";
		vars.dis_num=-1;
		// font_number=0
		aoz.sourcePos="0:20:0";
		vars.font_number=0;
		// Ink 6
		aoz.sourcePos="0:21:0";
		aoz.currentScreen.setInk(6);
		// Range=180
		aoz.sourcePos="0:22:0";
		vars.Range=180;
		// Bright=60
		aoz.sourcePos="0:23:0";
		vars.Bright=60;
		// Repeat
		aoz.sourcePos="0:25:0";
	};
	this.blocks[2]=function(aoz,vars)
	{
		// Cls 0
		aoz.sourcePos="0:27:4";
		aoz.currentScreen.cls(0);
		// If se=1
		aoz.sourcePos="0:28:4";
		if(!((vars.se)==(1)))
			return{type:1,label:4};
	};
	this.blocks[3]=function(aoz,vars)
	{
		// Screen Skew 0,1,-1
		aoz.sourcePos="0:29:8";
		aoz.getScreen(0).setSkew({x:1,y:-1},'#update');
		// Screen Scale 0,0,0
		aoz.sourcePos="0:30:8";
		aoz.getScreen(0).setScale({x:0,y:0},'#update');
		// end if
		aoz.sourcePos="0:31:4";
	};
	this.blocks[4]=function(aoz,vars)
	{
		// Home
		aoz.sourcePos="0:32:4";
		aoz.currentScreen.currentTextWindow.home();
		// x = Screen Width / 2
		aoz.sourcePos="0:33:4";
		vars.x=aoz.fp2Int(aoz.checkNumber(aoz.currentScreen.dimension.width/2));
		// y = 50
		aoz.sourcePos="0:34:4";
		vars.y=50;
		// size = 40
		aoz.sourcePos="0:35:4";
		vars.size=40;
		// Set Font 81, 25
		aoz.sourcePos="0:36:4";
		return{type:12,waitThis:aoz.currentScreen,callFunction:"setFont",waitFunction:"setFont_wait",args:[81,25,undefined,undefined,undefined]};
	};
	this.blocks[5]=function(aoz,vars)
	{
		// colour 6,$00a0b0
		aoz.sourcePos="0:37:4";
		aoz.currentScreen.setColour(6,0x00A0B0);
		// Text 10,20,"S - Skew Effects On/Off"
		aoz.sourcePos="0:38:4";
		aoz.currentScreen.text({x:10,y:20},"S - Skew Effects On/Off",undefined, undefined);
		// Text 10,50,"N - Next"
		aoz.sourcePos="0:39:4";
		aoz.currentScreen.text({x:10,y:50},"N - Next",undefined, undefined);
		// Text 10,80,"P - Previous"
		aoz.sourcePos="0:40:4";
		aoz.currentScreen.text({x:10,y:80},"P - Previous",undefined, undefined);
		// Text Screen Width-250,20,"T - Ten at a Time"
		aoz.sourcePos="0:41:4";
		aoz.currentScreen.text({x:aoz.currentScreen.dimension.width-250,y:20},"T - Ten at a Time",undefined, undefined);
		// Text Screen Width-250,50,"A - Show all"
		aoz.sourcePos="0:42:4";
		aoz.currentScreen.text({x:aoz.currentScreen.dimension.width-250,y:50},"A - Show all",undefined, undefined);
		// Set Font 81,size
		aoz.sourcePos="0:43:4";
		return{type:12,waitThis:aoz.currentScreen,callFunction:"setFont",waitFunction:"setFont_wait",args:[81,vars.size,undefined,undefined,undefined]};
	};
	this.blocks[6]=function(aoz,vars)
	{
		// If dis_num=1
		aoz.sourcePos="0:44:4";
		if(!((vars.dis_num)==(1)))
			return{type:1,label:8};
	};
	this.blocks[7]=function(aoz,vars)
	{
		// Text x, y, "Font number: " + Str$( font_number )+" to"+Str$(min(font_number+9,number_of_fonts-1)), "#center"
		aoz.sourcePos="0:45:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"Font number: "+aoz.str$( vars.font_number)+" to"+aoz.str$( (vars.font_number+9<vars.number_of_fonts-1?vars.font_number+9:vars.number_of_fonts-1)),"#center", undefined);
		// else
		return{type:1,label:9};
	};
	this.blocks[8]=function(aoz,vars)
	{
		// Text x, y, "Font number: " + Str$( font_number ), "#center"
		aoz.sourcePos="0:47:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"Font number: "+aoz.str$( vars.font_number),"#center", undefined);
		// end if
		aoz.sourcePos="0:48:4";
	};
	this.blocks[9]=function(aoz,vars)
	{
		// y = 80
		aoz.sourcePos="0:49:4";
		vars.y=80;
		// size = 10
		aoz.sourcePos="0:50:4";
		vars.size=10;
		// count=0
		aoz.sourcePos="0:51:4";
		vars.count=0;
		// Gosub Cleanfont
		aoz.sourcePos="0:52:4";
		return{type:2,label:74,return:10};
	};
	this.blocks[10]=function(aoz,vars)
	{
		// If dis_num=-1
		aoz.sourcePos="0:53:4";
		if(!((vars.dis_num)==(-1)))
			return{type:1,label:21};
	};
	this.blocks[11]=function(aoz,vars)
	{
		// For count = 0 To 8
		aoz.sourcePos="0:54:8";
		vars.count=0;
	};
	this.blocks[12]=function(aoz,vars)
	{
		// Gosub Ch_col
		aoz.sourcePos="0:55:12";
		return{type:2,label:73,return:13};
	};
	this.blocks[13]=function(aoz,vars)
	{
		// size = size + 5
		aoz.sourcePos="0:56:12";
		vars.size=aoz.fp2Int(vars.size+5);
		// Set Font font_number, size : Wait 0.001
		aoz.sourcePos="0:57:12";
		return{type:12,waitThis:aoz.currentScreen,callFunction:"setFont",waitFunction:"setFont_wait",args:[vars.font_number,vars.size,undefined,undefined,undefined]};
	};
	this.blocks[14]=function(aoz,vars)
	{
		aoz.sourcePos="0:57:41";
		return{type:12,waitThis:aoz,callFunction:"wait",waitFunction:"wait_wait",args:[0.001]};
	};
	this.blocks[15]=function(aoz,vars)
	{
		// Text x, y, F$+" "+Str$(size)+"  "+Upper$(F$), "#center"
		aoz.sourcePos="0:58:12";
		aoz.currentScreen.text({x:vars.x,y:vars.y},vars.F$+" "+aoz.str$( vars.size)+"  "+(vars.F$).toUpperCase(),"#center", undefined);
		// y = y + size + 8
		aoz.sourcePos="0:59:12";
		vars.y=aoz.fp2Int(vars.y+vars.size+8);
		// Next count
		aoz.sourcePos="0:60:8";
		vars.count+=1;
		if(vars.count<=8)
			return{type:1,label:12};
	};
	this.blocks[16]=function(aoz,vars)
	{
		// y=y+20
		aoz.sourcePos="0:61:8";
		vars.y=aoz.fp2Int(vars.y+20);
		// Gosub Ch_col
		aoz.sourcePos="0:62:8";
		return{type:2,label:73,return:17};
	};
	this.blocks[17]=function(aoz,vars)
	{
		// Text x,y,"ABCDEFGHIJKLMNOPQRSTUVWXYZ","#center"
		aoz.sourcePos="0:63:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"ABCDEFGHIJKLMNOPQRSTUVWXYZ","#center", undefined);
		// y=y+size+18
		aoz.sourcePos="0:64:8";
		vars.y=aoz.fp2Int(vars.y+vars.size+18);
		// Gosub Ch_col
		aoz.sourcePos="0:65:8";
		return{type:2,label:73,return:18};
	};
	this.blocks[18]=function(aoz,vars)
	{
		// Text x,y,"abcdefghijklmnopqrstuvwxyz","#center"
		aoz.sourcePos="0:66:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"abcdefghijklmnopqrstuvwxyz","#center", undefined);
		// y=y+size+18
		aoz.sourcePos="0:67:8";
		vars.y=aoz.fp2Int(vars.y+vars.size+18);
		// Gosub Ch_col
		aoz.sourcePos="0:68:8";
		return{type:2,label:73,return:19};
	};
	this.blocks[19]=function(aoz,vars)
	{
		// Text x,y,"1 2 3 4 5 6 7 8 9 0 ","#center"
		aoz.sourcePos="0:69:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"1 2 3 4 5 6 7 8 9 0 ","#center", undefined);
		// y=y+size+18
		aoz.sourcePos="0:70:8";
		vars.y=aoz.fp2Int(vars.y+vars.size+18);
		// Gosub Ch_col
		aoz.sourcePos="0:71:8";
		return{type:2,label:73,return:20};
	};
	this.blocks[20]=function(aoz,vars)
	{
		// Text x,y,"! £ $ % & * ( ) - + = , . : ; @","#center"
		aoz.sourcePos="0:72:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},"! £ $ % & * ( ) - + = , . : ; @","#center", undefined);
		// end if
		aoz.sourcePos="0:73:4";
	};
	this.blocks[21]=function(aoz,vars)
	{
		// If dis_num=1
		aoz.sourcePos="0:74:4";
		if(!((vars.dis_num)==(1)))
			return{type:1,label:30};
	};
	this.blocks[22]=function(aoz,vars)
	{
		// y=140
		aoz.sourcePos="0:75:8";
		vars.y=140;
		// size=50
		aoz.sourcePos="0:76:8";
		vars.size=50;
		// For count = 0 to 9
		aoz.sourcePos="0:77:8";
		vars.count=0;
	};
	this.blocks[23]=function(aoz,vars)
	{
		// Exit If font_number+count>number_of_fonts-1
		aoz.sourcePos="0:78:8";
		if((vars.font_number+vars.count)>(vars.number_of_fonts-1))
			return{type:1,label:29};
	};
	this.blocks[24]=function(aoz,vars)
	{
		// Gosub Cleanfont
		aoz.sourcePos="0:79:8";
		return{type:2,label:74,return:25};
	};
	this.blocks[25]=function(aoz,vars)
	{
		// Gosub Ch_col
		aoz.sourcePos="0:80:8";
		return{type:2,label:73,return:26};
	};
	this.blocks[26]=function(aoz,vars)
	{
		// Set Font font_number+count,size : Wait 0.001
		aoz.sourcePos="0:81:8";
		return{type:12,waitThis:aoz.currentScreen,callFunction:"setFont",waitFunction:"setFont_wait",args:[vars.font_number+vars.count,vars.size,undefined,undefined,undefined]};
	};
	this.blocks[27]=function(aoz,vars)
	{
		aoz.sourcePos="0:81:42";
		return{type:12,waitThis:aoz,callFunction:"wait",waitFunction:"wait_wait",args:[0.001]};
	};
	this.blocks[28]=function(aoz,vars)
	{
		// Text x, y, F$+" "+Str$(font_number+count)+"  "+Upper$(F$), "#center"
		aoz.sourcePos="0:82:8";
		aoz.currentScreen.text({x:vars.x,y:vars.y},vars.F$+" "+aoz.str$( vars.font_number+vars.count)+"  "+(vars.F$).toUpperCase(),"#center", undefined);
		// y = y + size + 8
		aoz.sourcePos="0:83:8";
		vars.y=aoz.fp2Int(vars.y+vars.size+8);
		// Next count
		aoz.sourcePos="0:84:8";
		vars.count+=1;
		if(vars.count<=9)
			return{type:1,label:23};
	};
	this.blocks[29]=function(aoz,vars)
	{
		// end If
		aoz.sourcePos="0:85:4";
	};
	this.blocks[30]=function(aoz,vars)
	{
		// If se=1
		aoz.sourcePos="0:88:4";
		if(!((vars.se)==(1)))
			return{type:1,label:33};
	};
	this.blocks[31]=function(aoz,vars)
	{
		// ScreenChange[0,50,Rnd(2)-1,Rnd(2)-1]
		aoz.sourcePos="0:89:8";
		return{type:4,procedure:"screenchange",args:{T:0,S:50,Xm:aoz.rnd(2)-1,Ym:aoz.rnd(2)-1}};
	};
	this.blocks[32]=function(aoz,vars)
	{
		// End if
		aoz.sourcePos="0:90:4";
	};
	this.blocks[33]=function(aoz,vars)
	{
		// Repeat
		aoz.sourcePos="0:92:4";
	};
	this.blocks[34]=function(aoz,vars)
	{
		// Wait 0.01
		aoz.sourcePos="0:93:8";
		return{type:12,waitThis:aoz,callFunction:"wait",waitFunction:"wait_wait",args:[0.01]};
	};
	this.blocks[35]=function(aoz,vars)
	{
		// k$ = Inkey$
		aoz.sourcePos="0:94:8";
		vars.k$=aoz.inkey$();
		// Until k$ != ""
		aoz.sourcePos="0:95:4";
		if(!((vars.k$)!=("")))
			return{type:1,label:34};
	};
	this.blocks[36]=function(aoz,vars)
	{
		// if k$="p"
		aoz.sourcePos="0:97:4";
		if(!((vars.k$)==("p")))
			return{type:1,label:41};
	};
	this.blocks[37]=function(aoz,vars)
	{
		// if dis_num=-1
		aoz.sourcePos="0:98:8";
		if(!((vars.dis_num)==(-1)))
			return{type:1,label:39};
	};
	this.blocks[38]=function(aoz,vars)
	{
		// Add font_number,-1 : font_number = Max( 1, font_number )
		aoz.sourcePos="0:99:12";
		aoz.add(this,{name:"font_number",type:0},-1);
		aoz.sourcePos="0:99:33";
		vars.font_number=aoz.fp2Int((1>vars.font_number?1:vars.font_number));
		// else
		return{type:1,label:40};
	};
	this.blocks[39]=function(aoz,vars)
	{
		// Add font_number,-10 : font_number = Max( 1, font_number )
		aoz.sourcePos="0:101:12";
		aoz.add(this,{name:"font_number",type:0},-10);
		aoz.sourcePos="0:101:34";
		vars.font_number=aoz.fp2Int((1>vars.font_number?1:vars.font_number));
		// end if
		aoz.sourcePos="0:102:8";
	};
	this.blocks[40]=function(aoz,vars)
	{
		// End if
		aoz.sourcePos="0:103:4";
	};
	this.blocks[41]=function(aoz,vars)
	{
		// if k$="n"
		aoz.sourcePos="0:104:4";
		if(!((vars.k$)==("n")))
			return{type:1,label:46};
	};
	this.blocks[42]=function(aoz,vars)
	{
		// if dis_num=-1
		aoz.sourcePos="0:105:8";
		if(!((vars.dis_num)==(-1)))
			return{type:1,label:44};
	};
	this.blocks[43]=function(aoz,vars)
	{
		// Add font_number,1 : font_number = Min( number_of_fonts-1, font_number )
		aoz.sourcePos="0:106:12";
		aoz.add(this,{name:"font_number",type:0},1);
		aoz.sourcePos="0:106:32";
		vars.font_number=aoz.fp2Int((vars.number_of_fonts-1<vars.font_number?vars.number_of_fonts-1:vars.font_number));
		// else
		return{type:1,label:45};
	};
	this.blocks[44]=function(aoz,vars)
	{
		// Add font_number,10 : font_number = Min( number_of_fonts-1, font_number
		aoz.sourcePos="0:108:12";
		aoz.add(this,{name:"font_number",type:0},10);
		aoz.sourcePos="0:108:33";
		vars.font_number=aoz.fp2Int((vars.number_of_fonts-1<vars.font_number?vars.number_of_fonts-1:vars.font_number));
		// end if
		aoz.sourcePos="0:109:8";
	};
	this.blocks[45]=function(aoz,vars)
	{
		// End if
		aoz.sourcePos="0:110:4";
	};
	this.blocks[46]=function(aoz,vars)
	{
		// if k$="t" then dis_num=-dis_num
		aoz.sourcePos="0:112:4";
		if(!((vars.k$)==("t")))
			return{type:1,label:48};
	};
	this.blocks[47]=function(aoz,vars)
	{
		aoz.sourcePos="0:112:19";
		vars.dis_num=aoz.fp2Int(-vars.dis_num);
	};
	this.blocks[48]=function(aoz,vars)
	{
		// If k$="s" then se=-se
		aoz.sourcePos="0:114:4";
		if(!((vars.k$)==("s")))
			return{type:1,label:50};
	};
	this.blocks[49]=function(aoz,vars)
	{
		aoz.sourcePos="0:114:19";
		vars.se=aoz.fp2Int(-vars.se);
	};
	this.blocks[50]=function(aoz,vars)
	{
		// if k$="a"
		aoz.sourcePos="0:116:4";
		if(!((vars.k$)==("a")))
			return{type:1,label:68};
	};
	this.blocks[51]=function(aoz,vars)
	{
		// Cls 0
		aoz.sourcePos="0:117:8";
		aoz.currentScreen.cls(0);
		// for x=0 to 4
		aoz.sourcePos="0:118:8";
		vars.x=0;
	};
	this.blocks[52]=function(aoz,vars)
	{
		// for y=0 to 26
		aoz.sourcePos="0:119:8";
		vars.y=0;
	};
	this.blocks[53]=function(aoz,vars)
	{
		// Gosub Ch_col
		aoz.sourcePos="0:120:8";
		return{type:2,label:73,return:54};
	};
	this.blocks[54]=function(aoz,vars)
	{
		// If (x*27)+y<number_of_fonts
		aoz.sourcePos="0:121:8";
		if(!(((vars.x*27)+vars.y)<(vars.number_of_fonts)))
			return{type:1,label:62};
	};
	this.blocks[55]=function(aoz,vars)
	{
		// Set Font (x*27)+y,23
		aoz.sourcePos="0:122:12";
		return{type:12,waitThis:aoz.currentScreen,callFunction:"setFont",waitFunction:"setFont_wait",args:[(vars.x*27)+vars.y,23,undefined,undefined,undefined]};
	};
	this.blocks[56]=function(aoz,vars)
	{
		// F$=Font$((x*27)+y)
		aoz.sourcePos="0:123:12";
		vars.F$=aoz.fonts.getFont$((vars.x*27)+vars.y);
		// L=Len(F$)
		aoz.sourcePos="0:124:12";
		vars.L=aoz.fp2Int((vars.F$).length);
		// For N=1 to L
		aoz.sourcePos="0:125:12";
		vars.N=1;
	};
	this.blocks[57]=function(aoz,vars)
	{
		// If Mid$(F$,N,1)="(" then Exit
		aoz.sourcePos="0:126:15";
		if(!((this.aoz.getMid$(vars.F$,vars.N,1))==("(")))
			return{type:1,label:60};
	};
	this.blocks[58]=function(aoz,vars)
	{
		aoz.sourcePos="0:126:40";
		return{type:1,label:61};
	};
	this.blocks[59]=function(aoz,vars)
	{
	};
	this.blocks[60]=function(aoz,vars)
	{
		// Next N
		aoz.sourcePos="0:127:12";
		vars.N+=1;
		if(vars.N<=vars.L)
			return{type:1,label:57};
	};
	this.blocks[61]=function(aoz,vars)
	{
		// F$=Left$(F$,N-1)
		aoz.sourcePos="0:128:12";
		vars.F$=this.aoz.getLeft$(vars.F$,vars.N-1);
		// Text x*268,y*26+26,F$
		aoz.sourcePos="0:129:12";
		aoz.currentScreen.text({x:vars.x*268,y:vars.y*26+26},vars.F$,undefined, undefined);
		// End if
		aoz.sourcePos="0:130:8";
	};
	this.blocks[62]=function(aoz,vars)
	{
		// Next y
		aoz.sourcePos="0:131:8";
		vars.y+=1;
		if(vars.y<=26)
			return{type:1,label:53};
	};
	this.blocks[63]=function(aoz,vars)
	{
		// Next x
		aoz.sourcePos="0:132:8";
		vars.x+=1;
		if(vars.x<=4)
			return{type:1,label:52};
	};
	this.blocks[64]=function(aoz,vars)
	{
		// Repeat
		aoz.sourcePos="0:133:8";
	};
	this.blocks[65]=function(aoz,vars)
	{
		// Wait 0.001
		aoz.sourcePos="0:134:8";
		return{type:12,waitThis:aoz,callFunction:"wait",waitFunction:"wait_wait",args:[0.001]};
	};
	this.blocks[66]=function(aoz,vars)
	{
		// k$ = Inkey$
		aoz.sourcePos="0:135:8";
		vars.k$=aoz.inkey$();
		// Until k$ != ""
		aoz.sourcePos="0:136:8";
		if(!((vars.k$)!=("")))
			return{type:1,label:65};
	};
	this.blocks[67]=function(aoz,vars)
	{
		// end if
		aoz.sourcePos="0:137:4";
	};
	this.blocks[68]=function(aoz,vars)
	{
		// If se=1
		aoz.sourcePos="0:140:4";
		if(!((vars.se)==(1)))
			return{type:1,label:71};
	};
	this.blocks[69]=function(aoz,vars)
	{
		// ScreenChange[1,50,Rnd(2)-1,Rnd(2)-1]
		aoz.sourcePos="0:141:8";
		return{type:4,procedure:"screenchange",args:{T:1,S:50,Xm:aoz.rnd(2)-1,Ym:aoz.rnd(2)-1}};
	};
	this.blocks[70]=function(aoz,vars)
	{
		// End if
		aoz.sourcePos="0:142:4";
	};
	this.blocks[71]=function(aoz,vars)
	{
		// Until k$ = "q"
		aoz.sourcePos="0:144:0";
		if(!((vars.k$)==("q")))
			return{type:1,label:2};
	};
	this.blocks[72]=function(aoz,vars)
	{
		// End
		aoz.sourcePos="0:145:0";
		return{type:16}
	};
	this.blocks[73]=function(aoz,vars)
	{
		// r=rnd(Range)+Bright
		aoz.sourcePos="0:147:4";
		vars.r=aoz.fp2Int(aoz.rnd(vars.Range)+vars.Bright);
		// g=rnd(Range)+Bright
		aoz.sourcePos="0:148:4";
		vars.g=aoz.fp2Int(aoz.rnd(vars.Range)+vars.Bright);
		// b=rnd(Range)+Bright
		aoz.sourcePos="0:149:4";
		vars.b=aoz.fp2Int(aoz.rnd(vars.Range)+vars.Bright);
		// c=rgb(r,g,b)
		aoz.sourcePos="0:150:4";
		vars.c=aoz.fp2Int(aoz.utilities.getAOZRGB(vars.r,vars.g,vars.b));
		// colour 6,c
		aoz.sourcePos="0:151:4";
		aoz.currentScreen.setColour(6,vars.c);
		// Return
		aoz.sourcePos="0:152:0";
		return{type:3};
	};
	this.blocks[74]=function(aoz,vars)
	{
		// F$=Font$(font_number+count)
		aoz.sourcePos="0:156:4";
		vars.F$=aoz.fonts.getFont$(vars.font_number+vars.count);
		// L=Len(F$)
		aoz.sourcePos="0:157:4";
		vars.L=aoz.fp2Int((vars.F$).length);
		// For N=1 to L
		aoz.sourcePos="0:158:4";
		vars.N=1;
	};
	this.blocks[75]=function(aoz,vars)
	{
		// If Mid$(F$,N,1)="(" then Exit
		aoz.sourcePos="0:159:8";
		if(!((this.aoz.getMid$(vars.F$,vars.N,1))==("(")))
			return{type:1,label:78};
	};
	this.blocks[76]=function(aoz,vars)
	{
		aoz.sourcePos="0:159:33";
		return{type:1,label:79};
	};
	this.blocks[77]=function(aoz,vars)
	{
	};
	this.blocks[78]=function(aoz,vars)
	{
		// Next N
		aoz.sourcePos="0:160:4";
		vars.N+=1;
		if(vars.N<=vars.L)
			return{type:1,label:75};
	};
	this.blocks[79]=function(aoz,vars)
	{
		// F$=Left$(F$,N-1)
		aoz.sourcePos="0:161:4";
		vars.F$=this.aoz.getLeft$(vars.F$,vars.N-1);
		// Return
		aoz.sourcePos="0:162:0";
		return{type:3};
	};
	this.blocks[80]=function(aoz,vars)
	{
		return{type:0}
	};

	// Labels...
	this.labels=
	{
		ch_col:{dataPosition:0,labelBlock:73},
		cleanfont:{dataPosition:0,labelBlock:74}
	};
	this.p_screenchange=function(aoz,parent,args)
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
			// If T=1
			aoz.sourcePos="0:165:4";
			if(!((vars.T)==(1)))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// St=0 : En=1
			aoz.sourcePos="0:166:8";
			vars.St=0;
			aoz.sourcePos="0:166:15";
			vars.En=1;
			// Else
			return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// St=1 : En=0
			aoz.sourcePos="0:168:8";
			vars.St=1;
			aoz.sourcePos="0:168:15";
			vars.En=0;
			// End if
			aoz.sourcePos="0:169:4";
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Stp#=(En-St)/S
			aoz.sourcePos="0:170:4";
			vars.Stp_f=aoz.checkNumber((vars.En-vars.St)/vars.S);
			// for f#=St to En step Stp#
			aoz.sourcePos="0:171:4";
			vars.f_f=vars.St;
		};
		this.blocks[4]=function(aoz,vars)
		{
			// wait 0.001
			aoz.sourcePos="0:172:8";
			return{type:12,waitThis:aoz,callFunction:"wait",waitFunction:"wait_wait",args:[0.001]};
		};
		this.blocks[5]=function(aoz,vars)
		{
			// Screen Skew 0,Xm*f#,Ym*f#
			aoz.sourcePos="0:173:8";
			aoz.getScreen(0).setSkew({x:vars.Xm*vars.f_f,y:vars.Ym*vars.f_f},'#update');
			// If Xm=1 and Ym=1
			aoz.sourcePos="0:174:8";
			if(!(((vars.Xm)==(1))&&((vars.Ym)==(1))))
				return{type:1,label:7};
		};
		this.blocks[6]=function(aoz,vars)
		{
			// Screen Scale 0,1-f#*2,1-f#*2
			aoz.sourcePos="0:175:12";
			aoz.getScreen(0).setScale({x:1-vars.f_f*2,y:1-vars.f_f*2},'#update');
			// else
			return{type:1,label:8};
		};
		this.blocks[7]=function(aoz,vars)
		{
			// Screen Scale 0,1-f#,1-f#
			aoz.sourcePos="0:177:12";
			aoz.getScreen(0).setScale({x:1-vars.f_f,y:1-vars.f_f},'#update');
			// End if
			aoz.sourcePos="0:178:8";
		};
		this.blocks[8]=function(aoz,vars)
		{
			// next f#
			aoz.sourcePos="0:179:4";
			vars.f_f+=vars.Stp_f;
			if(vars.Stp_f>0?(vars.f_f<=vars.En):(vars.f_f>=vars.En))
				return{type:1,label:4};
		};
		this.blocks[9]=function(aoz,vars)
		{
			// Screen Scale 0,St,St
			aoz.sourcePos="0:180:4";
			aoz.getScreen(0).setScale({x:vars.St,y:vars.St},'#update');
			// Screen Skew 0,0,0
			aoz.sourcePos="0:181:4";
			aoz.getScreen(0).setSkew({x:0,y:0},'#update');
			// End proc
			return{type:0};
		};
	};
	this.aoz.run(this,0,args);
	this.aoz.v1_0_collisions=new v1_0_collisions(this.aoz,args);
	this.aoz.v1_0_colours=new v1_0_colours(this.aoz,args);
	this.aoz.v1_0_filesystem=new v1_0_filesystem(this.aoz,args);
	this.aoz.v1_0_fonts=new v1_0_fonts(this.aoz,args);
	this.aoz.v1_0_graphics=new v1_0_graphics(this.aoz,args);
	this.aoz.v1_0_keyboard_and_mouse=new v1_0_keyboard_and_mouse(this.aoz,args);
	this.aoz.v1_0_maths=new v1_0_maths(this.aoz,args);
	this.aoz.v1_0_screens=new v1_0_screens(this.aoz,args);
	this.aoz.v1_0_sprites=new v1_0_sprites(this.aoz,args);
	this.aoz.v1_0_strings=new v1_0_strings(this.aoz,args);
	this.aoz.v1_0_textwindows=new v1_0_textwindows(this.aoz,args);
	this.aoz.v1_0_time=new v1_0_time(this.aoz,args);
};
