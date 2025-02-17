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
// ASCII Unicode View Select accessory
// Brian Flanagan
// 1.0.0
// 
// Copyright (c)2021 Par Moi
//
// Compiled with AOZ Transpiler Version 14.03 on the 20/02/2023-16:10:13
//
function Application( canvasId, args )
{
	this.root=this;
	this.parent=this;
	this.contextName='application';
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsImluZm9zIjp7InR5cGUiOiJwYyIsImFwcGxpY2F0aW9uTmFtZSI6IkFTQ0lJIFVuaWNvZGUgVmlldyBTZWxlY3QgYWNjZXNzb3J5IiwiYXV0aG9yIjoiQnJpYW4gRmxhbmFnYW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJkYXRlIjoiIiwiY29weXJpZ2h0IjoiQ29weXJpZ2h0IChjKTIwMjEgUGFyIE1vaSIsInN0YXJ0IjoiYXNjaWktdmlld2VyLmFveiIsInRlbXBsYXRlIjoidGVtcGxhdGVzL3RlbXBsYXRlX2Nyb3NzIn0sImNvbXBpbGF0aW9uIjp7InBsYXRmb3JtIjoiYW96Iiwia2V5bWFwIjoiYW96IiwibWFjaGluZSI6Im1vZGVybiIsInNwZWVkIjoiZmFzdCIsInN5bnRheCI6ImVuaGFuY2VkIiwiZW5kaWFuIjoibGl0dGxlIiwibm9XYXJuaW5nIjpbXSwiZGlzcGxheUVuZEFsZXJ0IjpmYWxzZSwiZGlzcGxheUVycm9yQWxlcnQiOnRydWUsInVzZUxvY2FsVGFicyI6dHJ1ZSwidXNlQXNzZXRzUmVzb3VyY2VzIjp0cnVlLCJpbmNsdWRlUGF0aHMiOltdfSwiZGlzcGxheSI6eyJ0dlN0YW5kYXJkIjoicGFsIiwicmVmcmVzaFJhdGUiOjYwLCJyZXNvbHV0aW9uIjoiMTkyMHgxMDgwIiwid2lkdGgiOjg5MCwiaGVpZ2h0IjoxMDI0LCJiYWNrZ3JvdW5kIjoiY29sb3IiLCJiYWNrZ3JvdW5kQ29sb3IiOiIjMDAwMDAwIiwiYm9keUJhY2tncm91bmRDb2xvciI6IiMwMDAwMDAiLCJib2R5QmFja2dyb3VuZEltYWdlIjoiLi9ydW50aW1lL3Jlc291cmNlcy9zdGFyX25pZ2h0LmpwZWciLCJzY2FsZVgiOjEsInNjYWxlWSI6MSwic2NyZWVuU2NhbGUiOjEsImZwcyI6ZmFsc2UsImZwc0ZvbnQiOiIxMnB4IFZlcmRhbmEiLCJmcHNDb2xvciI6IiNGRkZGMDAiLCJmcHNYIjoxMCwiZnBzWSI6MTYsImZ1bGxQYWdlIjp0cnVlLCJmdWxsU2NyZWVuIjp0cnVlLCJrZWVwUHJvcG9ydGlvbnMiOnRydWUsImZ1bGxTY3JlZW5JY29uIjpmYWxzZSwiZnVsbFNjcmVlbkljb25YIjotMzQsImZ1bGxTY3JlZW5JY29uWSI6MiwiZnVsbFNjcmVlbkljb25JbWFnZSI6Ii4vcnVudGltZS9yZXNvdXJjZXMvZnVsbF9zY3JlZW4ucG5nIiwic21hbGxTY3JlZW5JY29uSW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL3NtYWxsX3NjcmVlbi5wbmciLCJzbW9vdGhpbmciOnRydWUsIm9yaWVudGF0aW9uX2RldGVjdGlvbiI6ImxhbmRzY2FwZSIsInJlbmRlcmVyIjoiY2FudmFzIn0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6MCwiY2xpY2tTb3VuZHMiOmZhbHNlfSwiY29sbGlzaW9ucyI6eyJtZXRob2QiOiJmaW5lIiwicHJlY2lzaW9uIjo3NSwiYWxwaGFUaHJlc2hvbGQiOjF9LCJyYWluYm93cyI6eyJtb2RlIjoic2xvdyJ9LCJmb250cyI6eyJsaXN0Rm9udHMiOiJQQyIsImFtaWdhIjpbXSwiZ29vZ2xlIjpbXX0sInNvdW5kcyI6eyJtb2RlIjoiUEMiLCJ2b2x1bWUiOjEsInByZWxvYWQiOnRydWUsIm51bWJlck9mU291bmRzVG9QcmVsb2FkIjozMiwic291bmRQb29sU2l6ZSI6MzJ9LCJnYW1lcGFkIjp7Im1hcHBpbmciOnsidXAiOiJBcnJvd1VwIiwiZG93biI6IkFycm93RG93biIsImxlZnQiOiJBcnJvd0xlZnQiLCJyaWdodCI6IkFycm93UmlnaHQiLCJmaXJlIjoiU3BhY2UifX0sImZpbGVTeXN0ZW0iOnsiY2FzZVNlbnNpdGl2ZSI6ZmFsc2V9LCJkZWZhdWx0Ijp7InNjcmVlbiI6eyJ4IjowLCJ5IjowLCJ3aWR0aCI6MTkyMCwiaGVpZ2h0IjoxMDgwLCJudW1iZXJPZkNvbG9ycyI6NjQsInBpeGVsTW9kZSI6Imxvd3JlcyIsInBhbGV0dGUiOlsiIzAwMDAwMCIsIiNGRkZGRkYiLCIjRDFEMUQxIiwiI0EyQTJBMiIsIiM3MzczNzMiLCIjNDQ0NDQ0IiwiI0ZGMDAwMCIsIiNEMTAwMDAiLCIjQTIwMDAwIiwiIzczMDAwMCIsIiM0NDAwMDAiLCIjMDBGRjAwIiwiIzAwRDEwMCIsIiMwMEEyMDAiLCIjMDA3MzAwIiwiIzAwNDQwMCIsIiNGRkZGMDAiLCIjRDFEMTAwIiwiI0EyQTIwMCIsIiM3MzczMDAiLCIjNDQ0NDAwIiwiI0ZGN0YwMCIsIiNFMjcxMDAiLCIjQzQ2MjAwIiwiI0E2NTMwMCIsIiM4ODQ0MDAiLCIjMDAwMEZGIiwiIzAwMDBEMSIsIiMwMDAwQTIiLCIjMDAwMDczIiwiIzAwMDA0NCIsIiMwMEZGRkYiLCIjMDBEMUQxIiwiIzAwQTJBMiIsIiMwMDczNzMiLCIjMDA0NDQ0IiwiI0ZGMDBGRiIsIiNEMTAwRDEiLCIjQTIwMEEyIiwiIzczMDA3MyIsIiM0NDAwNDQiLCIjRkZBMTAwIiwiI0ZGQjMxMiIsIiNGRkM2MjUiLCIjRkZEODM3IiwiI0ZGRUI0QSIsIiNGRkZFNUQiLCIjMDAyOTY1IiwiIzEyMzk3NSIsIiMyNDQ5ODUiLCIjMzY1OTk1IiwiIzQ4NjlBNSIsIiM1QTc5QjUiLCIjQkY3MTdGIiwiI0IyNjc3MyIsIiNBNDVENjYiLCIjOTc1MzU5IiwiIzg5NDk0QyIsIiM3QjNGM0YiLCIjODI1MkI0IiwiIzYyM0U4NyIsIiM0MTI5NUEiLCIjMjExNTJEIiwiIzAwMDAwMCJdLCJ3aW5kb3ciOnsieCI6MCwieSI6MCwid2lkdGgiOjgwLCJoZWlnaHQiOjI1LCJib3JkZXIiOjAsInBhcGVyIjowLCJwZW4iOjEsImJhY2tncm91bmQiOiJvcGFxdWUiLCJmb250Ijp7Im5hbWUiOiJJQk0gUGxleCBNb25vIiwidHlwZSI6Imdvb2dsZSIsImhlaWdodCI6MjR9LCJjdXJzb3JPbiI6dHJ1ZSwiY3Vyc29ySW1hZ2UiOiIuL3J1bnRpbWUvcmVzb3VyY2VzL2N1cnNvcl9wYy5wbmciLCJjdXJzb3JDb2xvcnMiOlt7InIiOjY4LCJnIjo2OCwiYiI6MCwiYSI6MTI4fSx7InIiOjEzNiwiZyI6MTM2LCJiIjowLCJhIjoxMjh9LHsiciI6MTg3LCJnIjoxODcsImIiOjAsImEiOjEyOH0seyJyIjoyMjEsImciOjIyMSwiYiI6MCwiYSI6MTI4fSx7InIiOjIzOCwiZyI6MjM4LCJiIjowLCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjM0LCJhIjoxMjh9LHsiciI6MjU1LCJnIjoyNTUsImIiOjEzNiwiYSI6MTI4fSx7InIiOjI1NSwiZyI6MjU1LCJiIjoyMDQsImEiOjEyOH0seyJyIjoyNTUsImciOjI1NSwiYiI6MjU1LCJhIjoxMjh9LHsiciI6MTcwLCJnIjoxNzAsImIiOjI1NSwiYSI6MTI4fSx7InIiOjEzNiwiZyI6MTM2LCJiIjoyMDQsImEiOjEyOH0seyJyIjoxMDIsImciOjEwMiwiYiI6MTcwLCJhIjoxMjh9LHsiciI6MzQsImciOjM0LCJiIjoxMDIsImEiOjEyOH0seyJyIjowLCJnIjowLCJiIjo2OCwiYSI6MTI4fSx7InIiOjAsImciOjAsImIiOjE3LCJhIjoxMjh9LHsiciI6MCwiZyI6MCwiYiI6MCwiYSI6MTI4fV19fX19'));
	var options =
	{
		manifest: this.manifest,
		sources: JSON.parse(atob('W3sicGF0aCI6IkM6L0FPWl9TdHVkaW8vQU9aX1N0dWRpby9hcHAvQWNjZXNzb3JpZXMvQU9aIFRvb2xzL2FzY2lpX3ZpZXdlci9hc2NpaS12aWV3ZXIuYW96Iiwic291cmNlIjoiICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICBcclxue1xyXG4gICAgd2luZG93LmNvcHlUb0NsaXBib2FyZCA9IGZ1bmN0aW9uICh0ZXh0KVxyXG5cdHtcclxuICAgICAgICBpZiAod2luZG93LmNsaXBib2FyZERhdGEgJiYgd2luZG93LmNsaXBib2FyZERhdGEuc2V0RGF0YSlcclxuXHRcdHtcdHJldHVybiB3aW5kb3cuY2xpcGJvYXJkRGF0YS5zZXREYXRhKFwiVGV4dFwiLCB0ZXh0KTtcdH1cclxuICAgICAgICBlbHNlIGlmIChkb2N1bWVudC5xdWVyeUNvbW1hbmRTdXBwb3J0ZWQgJiYgZG9jdW1lbnQucXVlcnlDb21tYW5kU3VwcG9ydGVkKFwiY29weVwiKSlcclxuXHRcdHtcclxuICAgICAgICAgICAgdmFyIHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpO1xyXG4gICAgICAgICAgICB0ZXh0YXJlYS50ZXh0Q29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRleHRhcmVhLnN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRleHRhcmVhKTtcclxuICAgICAgICAgICAgdGV4dGFyZWEuc2VsZWN0KCk7XHJcbiAgICAgICAgICAgIHRyeSBcdFx0e1x0cmV0dXJuIGRvY3VtZW50LmV4ZWNDb21tYW5kKFwiY29weVwiKTtcdH1cclxuICAgICAgICAgICAgY2F0Y2ggKGV4KVx0e1x0cmV0dXJuIGZhbHNlO1x0fVxyXG4gICAgICAgICAgICBmaW5hbGx5XHRcdHtcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGV4dGFyZWEpO1x0fVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuQ2xwJD1cIkNsaXBwZWQgc3R1ZmZcIlxyXG5MaT0yOFxyXG5TY3JlZW4gT3BlbiAwLDg5MCwxMDI0LDMyLExvd3JlcywgbGluZXM9TGkgJyB3YXMgODkwIHggMTAyNFxyXG5QYWxldHRlIDAsJEZGRkZGRiwkRkZGRjAwLCQwMEZGRkYsJDAwRkYwMCwkRkYwMDAwXHJcblZlciQ9XCJ2MC45MVwiXHJcbkN1cnMgT2ZmIDogQ2xzIDBcclxuY2hhcldpZHRoIz1YIEdyYXBoaWMoMSlcclxuY2hhckhlaWdodCM9WSBHcmFwaGljKDEpXHJcbiAgLy9cclxuIC8vIENyZWF0ZSB5ZWxsb3cgYm94IGZvciBjdXJzb3JcclxuLy9cclxuTGluZSBXaWR0aCAzXHJcbkluayAyIDogQm94IDAsMCBUbyBjaGFyV2lkdGgjKzEsY2hhckhlaWdodCMrMVxyXG5HZXQgQm9iIDEsMCwwIFRvIGNoYXJXaWR0aCMrMSxjaGFySGVpZ2h0IysxXHJcbkNscyAwXHJcbkJvYiAxLC1jaGFyV2lkdGgjLTEsLWNoYXJIZWlnaHQjLTEsMSAnIEluaXRpYWxseSBkcmF3IHRoZSBjdXJzb3IgKG9mZi1zY3JlZW4pXHJcbiAgICAgIC8vXHJcbiAgICAgLy8gQVNDSUkgLyBVbmljb2RlIFNlbGVjdG9yXHJcbiAgICAvLyBieSBCcmlhbiBGbGFuYWdhbiAoYWthOiBpc2luZzRqZXN1cylcclxuICAgLy8gXHRUaGFua3MgQERhdmUgQiBmb3IgdGhlIGNvcHlUb0NsaXBib2FyZCBKYXZhU2NyaXB0XHJcbiAgLy9cdFxyXG4gLy9cdHYwLjkxIC0gZGlzYWJsZWQgY29weVRvQ2xpcGJvYXJkIGZlYXR1cmUgdGVtcG9yYXJpbHlcclxuLy9cclxuR2xvYmFsIGN1cnNYb2ZzLGN1cnNZT2ZzLExpLGNoYXJXaWR0aCMsY2hhckhlaWdodCNcclxucHJldnBhZ2U9LTEgOiBwYWdlPTBcclxuY3Vyc1hvZnMgPSA3IDogY3Vyc1lPZnMgPSA0XHJcbmN1cnNYPTAgOiBjdXJzWT0wXHJcbmN1cnNWaXNpYmxlPXRydWVcclxuXHJcbkdsb2JhbCB1cExlZkFyciQsdXBBcnIkLHVwUmlnaHRBcnIkXHJcbkdsb2JhbCBsZWZ0QXJyJCxyaWdodEFyciRcclxuR2xvYmFsIGRvd25MZWZ0QXJyJCxkb3duQXJyJCxkb3duUmlnaHRBcnIkXHJcbkdsb2JhbCBwYWdlLGN1cnNYLGN1cnNYT2ZzLGN1cnNZLGN1cnNZT2ZzXHJcbkdsb2JhbCBjaGFyV2lkdGgjLGNoYXJIZWlnaHQjXHJcbkdsb2JhbCBjdXJzb3JWaXNpYmxlXHJcbiAgdXBMZWZ0QXJyJD1DaHIkKCQyMTk2KSA6ICAgdXBBcnIkPUNociQoJDIxOTEpIDogICB1cFJpZ2h0QXJyJD1DaHIkKCQyMTk3KVxyXG4gICAgbGVmdEFyciQ9Q2hyJCgkMjE5MCkgOiAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodEFyciQ9Q2hyJCgkMjE5MilcclxuZG93bkxlZnRBcnIkPUNociQoJDIxOTkpIDogZG93bkFyciQ9Q2hyJCgkMjE5MykgOiBkb3duUmlnaHRBcnIkPUNociQoJDIxOTgpXHJcblxyXG5JbmsgMVxyXG5Cb3ggMCwwIFRvIFNjcmVlbiBXaWR0aC0xLFNjcmVlbiBIZWlnaHQtMVxyXG5Mb2NhdGUgNywxIDogVW5kZXIgT246IFNoYWRvdyBPbiA6IFByaW50IFwiQU9aOiBBU0NJSS9Vbmljb2RlIFZpZXcvU2VsZWN0XCIgOiBVbmRlciBPZmYgOiBTaGFkb3cgT2ZmXHJcblxyXG5TaG93SGVhZGluZ3MgJyBTaG93IDAgLSBGIGNvbHVtbnMgKGluaXRpYWxseSlcclxuU2hvd0hlbHAgJyBTaG93IG5hdmlnYXRpb24ga2V5cyBhbmQgaGVscCB0ZXh0LlxyXG5TaG93Q2hhclswXVxyXG5cclxuTG9jYXRlIDEsMSA6IFByaW50IFZlciRcclxuJyBFdmVyeSAwLjUgR29zdWIgRmxhc2hDdXJzb3JcclxuJ1xyXG4nIE1vdXNlIFpvbmVzXHJcbidcclxuQ2hhclpvbmVzPTI1NlxyXG5Db2x1bW5ab25lcz0xNlxyXG5Sb3dab25lcz0xNlxyXG5BcnJvd1pvbmVzPTRcclxuUGFnZVpvbmVzPTIgJyBQYWdlVXAvRG5cclxuQ29weVpvbmVzPTIgJyBDb3B5IHRvIENociQoKSB0byBjbGlwYm9hcmRcclxuQWxsWm9uZXMgPSBDaGFyWm9uZXMrQ29sdW1uWm9uZXMrUm93Wm9uZXMrQXJyb3dab25lcytQYWdlWm9uZXMrQ29weVpvbmVzXHJcblJlc2VydmUgWm9uZSBBbGxab25lc1xyXG5TZXRab25lcyAnIENyZWF0ZSB6b25lcyB0byBjbGljayBvbiBlYWNoIGNoYXJcclxuXHJcbkRvXHJcblx0SWYgcGFnZSA8PiBwcmV2cGFnZVxyXG5cdFx0cHJldnBhZ2U9cGFnZVxyXG5cclxuXHRcdC8vIFdvcmsgYXJvdW5kIFByaW50IGJ1ZyAobm8gY2xpcHBpbmcpXHJcblx0XHRDbGVhckdyaWRcdFx0JyBFcmFzZSBlbnRpcmUgY2hhcmFjdGVyIGdyaWRcclxuXHRcdFNob3dIZWFkaW5nc1x0JyBSZS1kcmF3IGFsbCBoZWFkaW5ncyAoZXJhc2VzIGFydGlmYWN0cyBhYm92ZSB0b3Agcm93KVxyXG5cdFx0U2hvd0NoYXJbcGFnZSoyNTYrY3Vyc1kqMTYrY3Vyc1hdICcgUmUtaGlnaGxpZ2h0IHByb3BlciBjb2x1bW4gaGVhZGluZy5cclxuXHRcdC8vIEVuZCB3b3JrLWFyb3VuZFxyXG5cclxuXHRcdEZvciByb3cgPSAwIHRvIDE1XHJcblx0XHRcdElmIHJvdz1jdXJzWVxyXG5cdFx0XHRcdFNob3dSb3dJRFtyb3csdHJ1ZV1cclxuXHRcdFx0RWxzZVxyXG5cdFx0XHRcdFNob3dSb3dJRFtyb3csZmFsc2VdXHJcblx0XHRcdEVuZCBJZlxyXG5cclxuXHRcdFx0Rm9yIGNvbG09MCBUbyAxNVxyXG5cdCAgXHRcdFx0TG9jYXRlIGNvbG0qMis3LHJvdytjdXJzWU9mc1xyXG5cdCAgXHRcdFx0Y2hyID0gcGFnZSoyNTYrcm93KjE2K2NvbG1cclxuXHQgIFx0XHRcdElmIGNociA+MzFcclxuXHQgIFx0XHRcdFx0UHJpbnQgQ2hyJChjaHIpO1xyXG5cdCAgXHRcdFx0RWxzZVxyXG5cdCAgICBcdFx0XHRQcmludCBcIiBcIjtcclxuXHQgIFx0XHRcdEVuZCBJZlxyXG5cdFx0XHROZXh0IGNvbG1cclxuXHRcdFx0UHJpbnRcclxuXHRcdE5leHQgUm93XHJcblx0XHRMb2NhdGUgY3Vyc1gqMitjdXJzWE9mcyxDdXJzWStjdXJzWU9mc1xyXG5cdEVuZCBJZlxyXG5cclxuXHRJJD1JbmtleSQ6U0M9U2NhbmNvZGVcclxuXHQnXHJcblx0JyBTY2FuQ29kZSB2YWx1ZXM6XHJcblx0JyBQZ1VwOiAkMjEgUGdEbjogJDIyXHJcblx0JyBVcDogJDI2IERvd246ICQyOCBMZWZ0OiAkMjUgUmlnaHQ6ICQyN1xyXG5cdCdcclxuXHRJZiBJJCA8PiBcIlwiXHJcblx0XHQgIC8vXHJcblx0XHQgLy8gQ2hhbmdlIFBhZ2VcclxuXHRcdC8vXHJcblx0XHRJZiBTQz0kMjFcclxuXHRcdFx0RGVjIHBhZ2UgOiBJZiBwYWdlPDAgVGhlbiBwYWdlPTI1NVxyXG5cdFx0XHRTaG93Q2hhcltwYWdlKjI1NitjdXJzWSoxNitjdXJzWF1cclxuXHRcdEVuZCBJZlxyXG5cdFx0SWYgU0M9JDIyXHJcblx0XHRcdEluYyBwYWdlIDogSWYgcGFnZT4yNTUgVGhlbiBwYWdlPTBcclxuXHRcdFx0U2hvd0NoYXJbcGFnZSoyNTYrY3Vyc1kqMTYrY3Vyc1hdXHJcblx0XHRFbmQgSWZcclxuXHRcdCAgLy9cclxuXHRcdCAvLyBNb3ZlIEN1cnNvclxyXG5cdFx0Ly9cclxuXHRcdElmIFNDPSQyNlxyXG5cdFx0XHRTaG93Um93SURbY3Vyc1ksZmFsc2VdICcgcmVzZXQgcHJldmlvdXNcclxuXHRcdFx0RGVjIGN1cnNZIDogSWYgY3Vyc1k8MCBUaGVuIGN1cnNZPTE1XHJcblx0XHRcdFNob3dDaGFyW3BhZ2UqMjU2K2N1cnNZKjE2K2N1cnNYXVxyXG5cdFx0RW5kIElmXHJcblx0XHRJZiBTQz0kMjhcclxuXHRcdFx0U2hvd1Jvd0lEW2N1cnNZLGZhbHNlXSAnIHJlc2V0IHByZXZpb3VzXHJcblx0XHRcdEluYyBjdXJzWSA6IElmIGN1cnNZPjE1IFRoZW4gY3Vyc1k9MFxyXG5cdFx0XHRTaG93Q2hhcltwYWdlKjI1NitjdXJzWSoxNitjdXJzWF1cclxuXHRcdEVuZCBJZlxyXG5cdFx0SWYgU0M9JDI1XHJcblx0XHRcdFNob3dDb2xJRFtjdXJzWCxmYWxzZV0gJyByZXNldCBwcmV2aW91c1xyXG5cdFx0XHREZWMgY3Vyc1ggOiBJZiBjdXJzWDwwIFRoZW4gY3Vyc1g9MTVcclxuXHRcdFx0U2hvd0NoYXJbcGFnZSoyNTYrY3Vyc1kqMTYrY3Vyc1hdXHJcblx0XHRFbmQgSWZcclxuXHRcdElmIFNDPSQyN1xyXG5cdFx0XHRTaG93Q29sSURbY3Vyc1gsZmFsc2VdICcgcmVzZXQgcHJldmlvdXNcclxuXHRcdFx0SW5jIGN1cnNYIDogSWYgY3Vyc1g+MTUgVGhlbiBjdXJzWD0wXHJcblx0XHRcdFNob3dDaGFyW3BhZ2UqMjU2K2N1cnNZKjE2K2N1cnNYXVxyXG5cdFx0RW5kIElmXHJcblx0RW5kIElmXHJcbidcclxuJyBDaGVjayBmb3IgbW91c2UgY2xpY2tzXHJcbidcclxuXHRNWj1Nb3VzZSBab25lXHJcblx0TUs9TW91c2UgS2V5XHJcblx0SWYgTVogPjAgQW5kIE1aIDwgMjU3XHJcblx0XHRTaG93Um93SURbY3Vyc1ksZmFsc2VdICcgcmVzZXQgcHJldmlvdXNcclxuXHRcdFNob3dDb2xJRFtjdXJzWCxmYWxzZV0gJyByZXNldCBwcmV2aW91c1xyXG5cdFx0Y3Vyc1g9KE1aLTEpIE1vZCAxNlxyXG5cdFx0Y3Vyc1k9KE1aLTEpIC8gMTZcclxuXHRcdFNob3dDaGFyW3BhZ2UqMjU2K2N1cnNZKjE2K2N1cnNYXVxyXG5cdFx0SWYgTUs8PjBcclxuXHRcdFx0UmVwZWF0IFVudGlsIE1vdXNlIEtleSA9IDBcclxuJ1x0XHRcdENvcHlUb0NsaXBib2FyZFtcIkNociQoXCIrSGV4JChwYWdlKjI1NitNWi0xLDQpK1wiKVwiXVxyXG5cdFx0RW5kIElmXHJcblx0RW5kIElmXHJcblx0V2FpdCBWYmxcclxuTG9vcFxyXG5cclxuSGlkZUN1cnNvcjpcclxuXHRCb2IgMSwtY2hhcldpZHRoIy0yLC1jaGFySGVpZ2h0Iy0yXHJcblJldHVyblxyXG5cclxuRmxhc2hDdXJzb3I6XHJcblx0SWYgY3Vyc1Zpc2libGVcclxuXHRcdEJvYiBIaWRlIDFcclxuXHRFbHNlXHJcblx0XHRCb2IgU2hvdyAxXHJcblx0RW5kIElmXHJcblx0Y3Vyc1Zpc2libGUgPSBOb3QgY3Vyc1Zpc2libGVcclxuXHRFdmVyeSBPblxyXG5SZXR1cm5cclxuXHJcblByb2NlZHVyZSBDbGVhckdyaWRcclxuXHRpPUlua1xyXG5cdEluayAwXHJcblx0dXBMZWZ0WCM9Y2hhcldpZHRoIyo2XHJcblx0dXBMZWZ0WSM9Y2hhckhlaWdodCMqNFxyXG5cdGxvd1JpZ2h0WCM9Y2hhcldpZHRoIyooNiszMylcclxuXHRsb3dSaWdodFkjPWNoYXJIZWlnaHQjKig0KzE3KVxyXG5cdEJhciB1cExlZnRYIyx1cExlZnRZIyBUbyBsb3dSaWdodFgjLGxvd1JpZ2h0WSNcclxuXHRJbmsgaVxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG4nIFByb2NlZHVyZSBGbGFzaEN1cnNvclxyXG4nJ1x0SWYgY3Vyc1Zpc2libGUgVGhlbiBCb2IgSGlkZSAxIEVsc2UgQm9iIFNob3cgMVxyXG4nJ1x0Y3Vyc1Zpc2libGUgPSBOb3QgY3Vyc1Zpc2libGVcclxuJydcdEV2ZXJ5IE9uXHJcbidFbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgRml4Q2hhcltjaHJdXHJcbicgVGl4IGZvciBhcnRpZmFjdHMgb24gY2hhciBkaXNwbGF5IGF0IGJvdHRvbSBvZiBzY3JlZW5cclxuJyBkdWUgdG8gUHJpbnQgYnVnIChjbGlwcGluZyBub3Qgd29ya2luZykuXHJcblx0cD1QZW5cclxuXHRQZW4gNFxyXG5cdExvY2F0ZSAyLExpLTQgOiBQcmludCBcIiAgXCI7dXBBcnIkO1wiIFwiXHJcblx0TG9jYXRlIDIsTGktMyA6IFByaW50IGxlZnRBcnIkO1wiICAgXCI7cmlnaHRBcnIkXHJcblx0TG9jYXRlIDIsTGktMiA6IFByaW50IFwiICBcIjtkb3duQXJyJDtcIiBcIlxyXG5cdFBlbiAxXHJcblx0TG9jYXRlIDQsTGktMyA6IFByaW50IENociQoY2hyKVxyXG5cdFBlbiBwXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcblByb2NlZHVyZSBTaG93Q2hhcltjaHJdXHJcblx0Rml4Q2hhcltjaHJdICcgTGluZSBiZWxvdyBzaG91bGQgbm9ybWFsbHkgYmUgZmluZS4gIChTZWUgRml4Q2hhcilcclxuJ1x0TG9jYXRlIDQsTGktMyA6IFByaW50IENociQoY2hyKVxyXG5cdExvY2F0ZSA4LExpLTMgOiBQZW4gMyA6IFByaW50IFwiQ2hyJChcIjsgOiBQZW4gMiA6IFByaW50IEhleCQoY2hyLDQpOyA6IFBlbiAzIDogUHJpbnQgXCIpXCJcclxuXHRMb2NhdGUgOCxMaS0yIDogUGVuIDMgOiBQcmludCBcIkNociQoXCI7IDogUGVuIDIgOiBQcmludCBVc2luZyBcIiMjIyMjXCI7Y2hyOyA6IFBlbiAzIDogUHJpbnQgXCIpXCJcclxuXHRCb2IgMSxjdXJzWCoyKmNoYXJXaWR0aCMrY3Vyc1hPZnMqY2hhcldpZHRoIy0xLGN1cnNZKmNoYXJIZWlnaHQjK2N1cnNZT2ZzKmNoYXJIZWlnaHQjLTFcclxuXHRTaG93Um93SURbY3Vyc1ksdHJ1ZV1cclxuXHRTaG93Q29sSURbY3Vyc1gsdHJ1ZV1cclxuXHRQZW4gMVxyXG5cdExvY2F0ZSBjdXJzWCoyK2N1cnNYT2ZzLEN1cnNZK2N1cnNZT2ZzXHJcbkVuZCBQcm9jZWR1cmVcclxuXHJcblByb2NlZHVyZSBTaG93Um93SWRbcixpXVxyXG5cdFBlbiAyXHJcblx0SWYgaSBUaGVuIEludmVyc2UgT24gRWxzZSBJbnZlcnNlIE9mZlxyXG5cdExvY2F0ZSAxLHIrY3Vyc1lPZnMgOiBQcmludCBMZWZ0JChIZXgkKHBhZ2UqMjU2K3IqMTYsNCksNCk7XCJfXCIgOiBQZW4gMVx0OiBJbnZlcnNlIE9mZlxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgU2hvd0NvbElkW2MsaV1cclxuXHRQZW4gMlxyXG5cdElmIGkgVGhlbiBJbnZlcnNlIE9uIEVsc2UgSW52ZXJzZSBPZmZcclxuXHRMb2NhdGUgY3Vyc1gqMitjdXJzWE9mcyxjdXJzWU9mcy0xIDogUHJpbnQgUmlnaHQkKEhleCQoY3Vyc1gsMSksMSk7IDogUGVuIDEgOiBJbnZlcnNlIE9mZlxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgU2hvd0hlbHBcclxuXHRMb2NhdGUgMixMaS03IDogUGVuIDQgOiBQcmludCBcIkdyZWVuXCI7XHJcblx0ICBQZW4gMSA6IFByaW50IFwiIGluZGljYXRlcyBuYXZpZ2F0aW9uIGtleXMuXCJcclxuXHRMb2NhdGUgMixMaS02IDogUHJpbnQgXCJBcnJvdyBrZXlzIGNoYW5nZSBzZWxlY3RlZCBjaGFyLlwiXHJcblx0TG9jYXRlIDIsTGktNSA6IFByaW50IFwiT3IgY2xpY2sgbW91c2Ugb24gYSBjaGFyYWN0ZXIuXCJcclxuXHRQZW4gNFxyXG4gICAgTG9jYXRlIDIsTGktNCA6IFByaW50IFwiICBcIjt1cEFyciQ7XHJcblx0TG9jYXRlIDIsTGktMyA6IFByaW50IGxlZnRBcnIkO1wiICAgXCI7cmlnaHRBcnIkXHJcblx0TG9jYXRlIDIsTGktMiA6IFByaW50IFwiICBcIjtkb3duQXJyJDtcIiBcIlxyXG5cdFBlbiA0XHJcblx0TG9jYXRlIDIwLExpLTMgOiBQcmludCBcIlBnVXBcIjsgOiBQZW4gMSA6IFByaW50IFwiOiBQcmV2IFBhZ2VcIlxyXG5cdFBlbiA0XHJcblx0TG9jYXRlIDIwLExpLTIgOiBQcmludCBcIlBnRG5cIjsgOiBQZW4gMSA6IFByaW50IFwiOiBOZXh0IFBhZ2VcIjtcclxuRW5kIFByb2NlZHVyZVxyXG5cclxuUHJvY2VkdXJlIFNob3dIZWFkaW5nc1xyXG5cdFBlbiAyXHJcblx0TG9jYXRlIDEsY3Vyc1lPZnMtMVxyXG5cdFByaW50IFwiICAgICBcIjtcclxuXHRGb3IgaD0wIHRvIDE1XHJcblx0XHRQcmludCBVc2luZyBcIiB+XCI7UmlnaHQkKEhleCQoaCwxKSwxKTtcclxuXHROZXh0IGhcclxuXHRQZW4gMVxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgU2V0Wm9uZXNcclxuLy8gWm9uZXMgZm9yIGNoYXJhY3RlciB2aWV3L3NlbGVjdCBhcmVhXHJcblx0Rm9yIGM9MCBUbyAkRlxyXG5cdFx0Rm9yIGw9MCBUbyAkRlxyXG5cdFx0XHR4U3RhcnQ9KGN1cnNYT2ZzKmNoYXJXaWR0aCMpKyhjKjIpKmNoYXJXaWR0aCNcclxuXHRcdFx0eEVuZD0oY3Vyc1hPZnMqY2hhcldpZHRoIykrKGMqMikqY2hhcldpZHRoIytjaGFyV2lkdGgjLTFcclxuXHRcdFx0eVN0YXJ0PShjdXJzWU9mcypjaGFySGVpZ2h0IykrbCpjaGFySGVpZ2h0I1xyXG5cdFx0XHR5RW5kPShjdXJzWU9mcypjaGFySGVpZ2h0IykrbCpjaGFySGVpZ2h0IytjaGFySGVpZ2h0Iy0xXHJcblxyXG5cdFx0LyogVGhpcyB3YXMgdG8gdGVzdCB0aGUgYXJlYXMgYmVmb3JlIGNyZWF0aW5nIHRoZW0uXHJcblx0XHRcdERyYXcgeFN0YXJ0LHlTdGFydCBUbyB4RW5kLHlTdGFydFxyXG5cdFx0XHREcmF3IHhTdGFydCx5RW5kIFRvIHhFbmQseUVuZFxyXG5cdFx0XHREcmF3IHhTdGFydCx5U3RhcnQgVG8geFN0YXJ0LHlFbmRcclxuXHRcdFx0RHJhdyB4RW5kLHlTdGFydCBUbyB4RW5kLHlFbmRcclxuXHRcdCovXHJcblx0XHRcdHpvbmVJbmRleCA9IGMrbCoxNisxXHJcblx0XHRcdFNldCBab25lIHpvbmVJbmRleCx4U3RhcnQseVN0YXJ0IFRvIHhFbmQseUVuZFxyXG5cdFx0TmV4dCBsXHJcblx0TmV4dCBjXHJcblxyXG5FbmQgUHJvY2VkdXJlXHJcblxyXG5Qcm9jZWR1cmUgQ29weVRvQ2xpcGJvYXJkW2NscCRdXHJcblx0e1x0d2luZG93LmNvcHlUb0NsaXBib2FyZCh0aGlzLnZhcnMuY2xwJCk7XHR9XHJcbkVuZCBQcm9jZWR1cmVcclxuXG5jbGFwZmluXG4iLCJudW1iZXIiOjAsInBhcmVudCI6bnVsbCwib2Zmc2V0TGluZXMiOjB9XQ==')),
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
	this.vars.Clp$="";
	this.vars.Li=0;
	this.vars.Ver$="";
	this.vars.charWidth_f=0.0;
	this.vars.charHeight_f=0.0;
	this.vars.cursXofs=0;
	this.vars.cursYOfs=0;
	this.vars.prevpage=0;
	this.vars.page=0;
	this.vars.cursX=0;
	this.vars.cursY=0;
	this.vars.cursVisible=0;
	this.vars.upLefArr$="";
	this.vars.upArr$="";
	this.vars.upRightArr$="";
	this.vars.leftArr$="";
	this.vars.rightArr$="";
	this.vars.downLeftArr$="";
	this.vars.downArr$="";
	this.vars.downRightArr$="";
	this.vars.cursorVisible=0;
	this.vars.upLeftArr$="";
	this.vars.CharZones=0;
	this.vars.ColumnZones=0;
	this.vars.RowZones=0;
	this.vars.ArrowZones=0;
	this.vars.PageZones=0;
	this.vars.CopyZones=0;
	this.vars.AllZones=0;
	this.vars.row=0;
	this.vars.colm=0;
	this.vars.chr=0;
	this.vars.I$="";
	this.vars.SC=0;
	this.vars.MZ=0;
	this.vars.MK=0;
	this.infoGlobals=
	{	
		li:this.aoz.varPtr('{"variable":{"name":"Li","token":"li","tokenCode":"Li","codeInit":"","nameReal":"Li","nameRealLower":"li","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":8,"classDefinition":null},"parameters":""}'),
		charwidth_f:this.aoz.varPtr('{"variable":{"name":"charWidth_f","token":"charwidth_f","tokenCode":"charWidth_f","codeInit":"","nameReal":"charWidth#","nameRealLower":"charwidth#","type":"float","numberType":"1","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":10,"classDefinition":null},"parameters":""}'),
		charheight_f:this.aoz.varPtr('{"variable":{"name":"charHeight_f","token":"charheight_f","tokenCode":"charHeight_f","codeInit":"","nameReal":"charHeight#","nameRealLower":"charheight#","type":"float","numberType":"1","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":11,"classDefinition":null},"parameters":""}'),
		cursxofs:this.aoz.varPtr('{"variable":{"name":"cursXofs","token":"cursxofs","tokenCode":"cursXofs","codeInit":"","nameReal":"cursXofs","nameRealLower":"cursxofs","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":12,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		cursyofs:this.aoz.varPtr('{"variable":{"name":"cursYOfs","token":"cursyofs","tokenCode":"cursYOfs","codeInit":"","nameReal":"cursYOfs","nameRealLower":"cursyofs","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":13,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		page:this.aoz.varPtr('{"variable":{"name":"page","token":"page","tokenCode":"page","codeInit":"","nameReal":"page","nameRealLower":"page","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":15,"classDefinition":null},"parameters":""}'),
		cursx:this.aoz.varPtr('{"variable":{"name":"cursX","token":"cursx","tokenCode":"cursX","codeInit":"","nameReal":"cursX","nameRealLower":"cursx","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":16,"classDefinition":null},"parameters":""}'),
		cursy:this.aoz.varPtr('{"variable":{"name":"cursY","token":"cursy","tokenCode":"cursY","codeInit":"","nameReal":"cursY","nameRealLower":"cursy","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":17,"classDefinition":null},"parameters":""}'),
		uplefarr$:this.aoz.varPtr('{"variable":{"name":"upLefArr$","token":"uplefarr$","tokenCode":"upLefArr$","codeInit":"","nameReal":"upLefArr$","nameRealLower":"uplefarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":false,"nonDimensionned":false,"index":19,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		uparr$:this.aoz.varPtr('{"variable":{"name":"upArr$","token":"uparr$","tokenCode":"upArr$","codeInit":"","nameReal":"upArr$","nameRealLower":"uparr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":20,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		uprightarr$:this.aoz.varPtr('{"variable":{"name":"upRightArr$","token":"uprightarr$","tokenCode":"upRightArr$","codeInit":"","nameReal":"upRightArr$","nameRealLower":"uprightarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":21,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		leftarr$:this.aoz.varPtr('{"variable":{"name":"leftArr$","token":"leftarr$","tokenCode":"leftArr$","codeInit":"","nameReal":"leftArr$","nameRealLower":"leftarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":22,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		rightarr$:this.aoz.varPtr('{"variable":{"name":"rightArr$","token":"rightarr$","tokenCode":"rightArr$","codeInit":"","nameReal":"rightArr$","nameRealLower":"rightarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":23,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		downleftarr$:this.aoz.varPtr('{"variable":{"name":"downLeftArr$","token":"downleftarr$","tokenCode":"downLeftArr$","codeInit":"","nameReal":"downLeftArr$","nameRealLower":"downleftarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":24,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		downarr$:this.aoz.varPtr('{"variable":{"name":"downArr$","token":"downarr$","tokenCode":"downArr$","codeInit":"","nameReal":"downArr$","nameRealLower":"downarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":25,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		downrightarr$:this.aoz.varPtr('{"variable":{"name":"downRightArr$","token":"downrightarr$","tokenCode":"downRightArr$","codeInit":"","nameReal":"downRightArr$","nameRealLower":"downrightarr$","type":"string","numberType":"2","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":true,"nonDimensionned":false,"index":26,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
		cursorvisible:this.aoz.varPtr('{"variable":{"name":"cursorVisible","token":"cursorvisible","tokenCode":"cursorVisible","codeInit":"","nameReal":"cursorVisible","nameRealLower":"cursorvisible","type":"integer","numberType":"0","isArray":false,"isParameter":false,"global":true,"shared":false,"numberOfDimensions":0,"defined":false,"nonDimensionned":false,"index":27,"toSetDefault":true,"classDefinition":null},"parameters":""}'),
	};
	this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:3:0";
		// Javascript
		window.copyToClipboard = function (text)
		{
			if (window.clipboardData && window.clipboardData.setData)
			{	return window.clipboardData.setData("Text", text);	}
			else if (document.queryCommandSupported && document.queryCommandSupported("copy"))
			{
				var textarea = document.createElement("textarea");
				textarea.textContent = text;
				textarea.style.position = "fixed";
				document.body.appendChild(textarea);
				textarea.select();
				try 		{	return document.execCommand("copy");	}
				catch (ex)	{	return false;	}
				finally		{	document.body.removeChild(textarea);	}
			}
		}
		// End Javascript
		// From source: C:/AOZ_Studio/AOZ_Studio/app/Accessories/AOZ Tools/ascii_viewer/ascii-viewer.aoz
		aoz.sourcePos="0:22:0";
		vars.Clp$="Clipped stuff";
		// Li=28
		aoz.sourcePos="0:23:0";
		vars.Li=28;
		// Screen Open 0,890,1024,32,Lowres, lines=Li ' was 890 x 1024
		aoz.sourcePos="0:24:0";
		aoz.screenOpen(
		{
			index:0,
			width:890,
			height:1024,
			depth:undefined,
			numberOfColors:32,
			pixelMode:0,
			palette:undefined,
			lines:vars.Li,
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
		// Palette 0,$FFFFFF,$FFFF00,$00FFFF,$00FF00,$FF0000
		aoz.sourcePos="0:25:0";
		aoz.currentScreen.setPalette([0,0xFFFFFF,0xFFFF00,0x00FFFF,0x00FF00,0xFF0000],"#noremap");
		// Ver$="v0.91"
		aoz.sourcePos="0:26:0";
		vars.Ver$="v0.91";
		// Curs Off : Cls 0
		aoz.sourcePos="0:27:0";
		aoz.currentScreen.currentTextWindow.setCursor(false);
		aoz.sourcePos="0:27:11";
		aoz.currentScreen.cls(0);
		// charWidth#=X Graphic(1)
		aoz.sourcePos="0:28:0";
		vars.charWidth_f=aoz.currentScreen.currentTextWindow.xGraphic(1);
		// charHeight#=Y Graphic(1)
		aoz.sourcePos="0:29:0";
		vars.charHeight_f=aoz.currentScreen.currentTextWindow.yGraphic(1);
		// Line Width 3
		aoz.sourcePos="0:33:0";
		aoz.currentScreen.setLineWidth(3);
		// Ink 2 : Box 0,0 To charWidth#+1,charHeight#+1
		aoz.sourcePos="0:34:0";
		aoz.currentScreen.setInk(2);
		aoz.sourcePos="0:34:8";
		aoz.currentScreen.box({x:0,y:0},undefined,{x2:vars.charWidth_f+1,y2:vars.charHeight_f+1});
		// Get Bob 1,0,0 To charWidth#+1,charHeight#+1
		aoz.sourcePos="0:35:0";
		aoz.currentScreen.getImage('images',1,{x:0,y:0,x2:vars.charWidth_f+1,y2:vars.charHeight_f+1});
		// Cls 0
		aoz.sourcePos="0:36:0";
		aoz.currentScreen.cls(0);
		// Bob 1,-charWidth#-1,-charHeight#-1,1 ' Initially draw the cursor (off-screen)
		aoz.sourcePos="0:37:0";
		aoz.currentScreen.bob(1,{x:-vars.charWidth_f-1,y:-vars.charHeight_f-1},aoz.checkIndex(1));
		// prevpage=-1 : page=0
		aoz.sourcePos="0:46:0";
		vars.prevpage=-1;
		aoz.sourcePos="0:46:14";
		vars.page=0;
		// cursXofs = 7 : cursYOfs = 4
		aoz.sourcePos="0:47:0";
		vars.cursXofs=7;
		aoz.sourcePos="0:47:15";
		vars.cursYOfs=4;
		// cursX=0 : cursY=0
		aoz.sourcePos="0:48:0";
		vars.cursX=0;
		aoz.sourcePos="0:48:10";
		vars.cursY=0;
		// cursVisible=true
		aoz.sourcePos="0:49:0";
		vars.cursVisible=this.aoz.platformTrue;
		// upLeftArr$=Chr$($2196) :   upArr$=Chr$($2191) :   upRightArr$=Chr$($2197)
		aoz.sourcePos="0:57:2";
		vars.upLeftArr$=String.fromCharCode(0x2196);
		aoz.sourcePos="0:57:29";
		vars.upArr$=String.fromCharCode(0x2191);
		aoz.sourcePos="0:57:52";
		vars.upRightArr$=String.fromCharCode(0x2197);
		// leftArr$=Chr$($2190) :                            rightArr$=Chr$($2192)
		aoz.sourcePos="0:58:4";
		vars.leftArr$=String.fromCharCode(0x2190);
		aoz.sourcePos="0:58:54";
		vars.rightArr$=String.fromCharCode(0x2192);
		// downLeftArr$=Chr$($2199) : downArr$=Chr$($2193) : downRightArr$=Chr$($2198)
		aoz.sourcePos="0:59:0";
		vars.downLeftArr$=String.fromCharCode(0x2199);
		aoz.sourcePos="0:59:27";
		vars.downArr$=String.fromCharCode(0x2193);
		aoz.sourcePos="0:59:50";
		vars.downRightArr$=String.fromCharCode(0x2198);
		// Ink 1
		aoz.sourcePos="0:61:0";
		aoz.currentScreen.setInk(1);
		// Box 0,0 To Screen Width-1,Screen Height-1
		aoz.sourcePos="0:62:0";
		aoz.currentScreen.box({x:0,y:0},undefined,{x2:aoz.currentScreen.dimension.width-1,y2:aoz.currentScreen.dimension.height-1});
		// Locate 7,1 : Under On: Shadow On : Print "AOZ: ASCII/Unicode View/Select" : Under Off : Shadow Off
		aoz.sourcePos="0:63:0";
		aoz.currentScreen.currentTextWindow.locate({x:7,y:1});
		aoz.sourcePos="0:63:13";
		aoz.currentScreen.currentTextWindow.setUnder(true, undefined);
		aoz.sourcePos="0:63:23";
		aoz.currentScreen.currentTextWindow.setShadow(true);
		aoz.sourcePos="0:63:35";
		aoz.currentScreen.currentTextWindow.print("AOZ: ASCII/Unicode View/Select",true);
		aoz.sourcePos="0:63:76";
		aoz.currentScreen.currentTextWindow.setUnder(false);
		aoz.sourcePos="0:63:88";
		aoz.currentScreen.currentTextWindow.setShadow(false);
		// ShowHeadings ' Show 0 - F columns (initially)
		aoz.sourcePos="0:65:0";
		return{type:4,procedure:"showheadings",args:{}};
	};
	this.blocks[2]=function(aoz,vars)
	{
		// ShowHelp ' Show navigation keys and help text.
		aoz.sourcePos="0:66:0";
		return{type:4,procedure:"showhelp",args:{}};
	};
	this.blocks[3]=function(aoz,vars)
	{
		// ShowChar[0]
		aoz.sourcePos="0:67:0";
		return{type:4,procedure:"showchar",args:{chr:0}};
	};
	this.blocks[4]=function(aoz,vars)
	{
		// Locate 1,1 : Print Ver$
		aoz.sourcePos="0:69:0";
		aoz.currentScreen.currentTextWindow.locate({x:1,y:1});
		aoz.sourcePos="0:69:13";
		aoz.currentScreen.currentTextWindow.print(vars.Ver$,true);
		// CharZones=256
		aoz.sourcePos="0:74:0";
		vars.CharZones=256;
		// ColumnZones=16
		aoz.sourcePos="0:75:0";
		vars.ColumnZones=16;
		// RowZones=16
		aoz.sourcePos="0:76:0";
		vars.RowZones=16;
		// ArrowZones=4
		aoz.sourcePos="0:77:0";
		vars.ArrowZones=4;
		// PageZones=2 ' PageUp/Dn
		aoz.sourcePos="0:78:0";
		vars.PageZones=2;
		// CopyZones=2 ' Copy to Chr$() to clipboard
		aoz.sourcePos="0:79:0";
		vars.CopyZones=2;
		// AllZones = CharZones+ColumnZones+RowZones+ArrowZones+PageZones+CopyZones
		aoz.sourcePos="0:80:0";
		vars.AllZones=aoz.fp2Int(vars.CharZones+vars.ColumnZones+vars.RowZones+vars.ArrowZones+vars.PageZones+vars.CopyZones);
		// Reserve Zone AllZones
		aoz.sourcePos="0:81:0";
		aoz.currentScreen.reserveZone(vars.AllZones);
		// SetZones ' Create zones to click on each char
		aoz.sourcePos="0:82:0";
		return{type:4,procedure:"setzones",args:{}};
	};
	this.blocks[5]=function(aoz,vars)
	{
		// Do
		aoz.sourcePos="0:84:0";
	};
	this.blocks[6]=function(aoz,vars)
	{
		// If page <> prevpage
		aoz.sourcePos="0:85:4";
		if(!((vars.page)!=(vars.prevpage)))
			return{type:1,label:23};
	};
	this.blocks[7]=function(aoz,vars)
	{
		// prevpage=page
		aoz.sourcePos="0:86:8";
		vars.prevpage=aoz.fp2Int(vars.page);
		// ClearGrid		' Erase entire character grid
		aoz.sourcePos="0:89:8";
		return{type:4,procedure:"cleargrid",args:{}};
	};
	this.blocks[8]=function(aoz,vars)
	{
		// ShowHeadings	' Re-draw all headings (erases artifacts above top row)
		aoz.sourcePos="0:90:8";
		return{type:4,procedure:"showheadings",args:{}};
	};
	this.blocks[9]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX] ' Re-highlight proper column heading.
		aoz.sourcePos="0:91:8";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[10]=function(aoz,vars)
	{
		// For row = 0 to 15
		aoz.sourcePos="0:94:8";
		vars.row=0;
	};
	this.blocks[11]=function(aoz,vars)
	{
		// If row=cursY
		aoz.sourcePos="0:95:12";
		if(!((vars.row)==(vars.cursY)))
			return{type:1,label:14};
	};
	this.blocks[12]=function(aoz,vars)
	{
		// ShowRowID[row,true]
		aoz.sourcePos="0:96:16";
		return{type:4,procedure:"showrowid",args:{r:vars.row,i:this.aoz.platformTrue}};
	};
	this.blocks[13]=function(aoz,vars)
	{
		// Else
		return{type:1,label:16};
	};
	this.blocks[14]=function(aoz,vars)
	{
		// ShowRowID[row,false]
		aoz.sourcePos="0:98:16";
		return{type:4,procedure:"showrowid",args:{r:vars.row,i:false}};
	};
	this.blocks[15]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:99:12";
	};
	this.blocks[16]=function(aoz,vars)
	{
		// For colm=0 To 15
		aoz.sourcePos="0:101:12";
		vars.colm=0;
	};
	this.blocks[17]=function(aoz,vars)
	{
		// Locate colm*2+7,row+cursYOfs
		aoz.sourcePos="0:102:18";
		aoz.currentScreen.currentTextWindow.locate({x:vars.colm*2+7,y:vars.row+vars.cursYOfs});
		// chr = page*256+row*16+colm
		aoz.sourcePos="0:103:18";
		vars.chr=aoz.fp2Int(vars.page*256+vars.row*16+vars.colm);
		// If chr >31
		aoz.sourcePos="0:104:18";
		if(!((vars.chr)>(31)))
			return{type:1,label:19};
	};
	this.blocks[18]=function(aoz,vars)
	{
		// Print Chr$(chr);
		aoz.sourcePos="0:105:22";
		aoz.currentScreen.currentTextWindow.print(String.fromCharCode(vars.chr),false);
		// Else
		return{type:1,label:20};
	};
	this.blocks[19]=function(aoz,vars)
	{
		// Print " ";
		aoz.sourcePos="0:107:20";
		aoz.currentScreen.currentTextWindow.print(" ",false);
		// End If
		aoz.sourcePos="0:108:18";
	};
	this.blocks[20]=function(aoz,vars)
	{
		// Next colm
		aoz.sourcePos="0:109:12";
		vars.colm+=1;
		if(vars.colm<=15)
			return{type:1,label:17};
	};
	this.blocks[21]=function(aoz,vars)
	{
		// Print
		aoz.sourcePos="0:110:12";
		aoz.currentScreen.currentTextWindow.print("",true);
		// Next Row
		aoz.sourcePos="0:111:8";
		vars.row+=1;
		if(vars.row<=15)
			return{type:1,label:11};
	};
	this.blocks[22]=function(aoz,vars)
	{
		// Locate cursX*2+cursXOfs,CursY+cursYOfs
		aoz.sourcePos="0:112:8";
		aoz.currentScreen.currentTextWindow.locate({x:vars.cursX*2+vars.cursXofs,y:vars.cursY+vars.cursYOfs});
		// End If
		aoz.sourcePos="0:113:4";
	};
	this.blocks[23]=function(aoz,vars)
	{
		// I$=Inkey$:SC=Scancode
		aoz.sourcePos="0:115:4";
		vars.I$=aoz.inkey$();
		aoz.sourcePos="0:115:14";
		vars.SC=aoz.fp2Int(aoz.getScanCode());
		// If I$ <> ""
		aoz.sourcePos="0:121:4";
		if(!((vars.I$)!=("")))
			return{type:1,label:59};
	};
	this.blocks[24]=function(aoz,vars)
	{
		// If SC=$21
		aoz.sourcePos="0:125:8";
		if(!((vars.SC)==(0x21)))
			return{type:1,label:29};
	};
	this.blocks[25]=function(aoz,vars)
	{
		// Dec page : If page<0 Then page=255
		aoz.sourcePos="0:126:12";
		vars.page--;
		aoz.sourcePos="0:126:23";
		if(!((vars.page)<(0)))
			return{type:1,label:27};
	};
	this.blocks[26]=function(aoz,vars)
	{
		aoz.sourcePos="0:126:38";
		vars.page=255;
	};
	this.blocks[27]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:127:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[28]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:128:8";
	};
	this.blocks[29]=function(aoz,vars)
	{
		// If SC=$22
		aoz.sourcePos="0:129:8";
		if(!((vars.SC)==(0x22)))
			return{type:1,label:34};
	};
	this.blocks[30]=function(aoz,vars)
	{
		// Inc page : If page>255 Then page=0
		aoz.sourcePos="0:130:12";
		vars.page++;
		aoz.sourcePos="0:130:23";
		if(!((vars.page)>(255)))
			return{type:1,label:32};
	};
	this.blocks[31]=function(aoz,vars)
	{
		aoz.sourcePos="0:130:40";
		vars.page=0;
	};
	this.blocks[32]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:131:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[33]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:132:8";
	};
	this.blocks[34]=function(aoz,vars)
	{
		// If SC=$26
		aoz.sourcePos="0:136:8";
		if(!((vars.SC)==(0x26)))
			return{type:1,label:40};
	};
	this.blocks[35]=function(aoz,vars)
	{
		// ShowRowID[cursY,false] ' reset previous
		aoz.sourcePos="0:137:12";
		return{type:4,procedure:"showrowid",args:{r:vars.cursY,i:false}};
	};
	this.blocks[36]=function(aoz,vars)
	{
		// Dec cursY : If cursY<0 Then cursY=15
		aoz.sourcePos="0:138:12";
		vars.cursY--;
		aoz.sourcePos="0:138:24";
		if(!((vars.cursY)<(0)))
			return{type:1,label:38};
	};
	this.blocks[37]=function(aoz,vars)
	{
		aoz.sourcePos="0:138:40";
		vars.cursY=15;
	};
	this.blocks[38]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:139:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[39]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:140:8";
	};
	this.blocks[40]=function(aoz,vars)
	{
		// If SC=$28
		aoz.sourcePos="0:141:8";
		if(!((vars.SC)==(0x28)))
			return{type:1,label:46};
	};
	this.blocks[41]=function(aoz,vars)
	{
		// ShowRowID[cursY,false] ' reset previous
		aoz.sourcePos="0:142:12";
		return{type:4,procedure:"showrowid",args:{r:vars.cursY,i:false}};
	};
	this.blocks[42]=function(aoz,vars)
	{
		// Inc cursY : If cursY>15 Then cursY=0
		aoz.sourcePos="0:143:12";
		vars.cursY++;
		aoz.sourcePos="0:143:24";
		if(!((vars.cursY)>(15)))
			return{type:1,label:44};
	};
	this.blocks[43]=function(aoz,vars)
	{
		aoz.sourcePos="0:143:41";
		vars.cursY=0;
	};
	this.blocks[44]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:144:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[45]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:145:8";
	};
	this.blocks[46]=function(aoz,vars)
	{
		// If SC=$25
		aoz.sourcePos="0:146:8";
		if(!((vars.SC)==(0x25)))
			return{type:1,label:52};
	};
	this.blocks[47]=function(aoz,vars)
	{
		// ShowColID[cursX,false] ' reset previous
		aoz.sourcePos="0:147:12";
		return{type:4,procedure:"showcolid",args:{c:vars.cursX,i:false}};
	};
	this.blocks[48]=function(aoz,vars)
	{
		// Dec cursX : If cursX<0 Then cursX=15
		aoz.sourcePos="0:148:12";
		vars.cursX--;
		aoz.sourcePos="0:148:24";
		if(!((vars.cursX)<(0)))
			return{type:1,label:50};
	};
	this.blocks[49]=function(aoz,vars)
	{
		aoz.sourcePos="0:148:40";
		vars.cursX=15;
	};
	this.blocks[50]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:149:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[51]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:150:8";
	};
	this.blocks[52]=function(aoz,vars)
	{
		// If SC=$27
		aoz.sourcePos="0:151:8";
		if(!((vars.SC)==(0x27)))
			return{type:1,label:58};
	};
	this.blocks[53]=function(aoz,vars)
	{
		// ShowColID[cursX,false] ' reset previous
		aoz.sourcePos="0:152:12";
		return{type:4,procedure:"showcolid",args:{c:vars.cursX,i:false}};
	};
	this.blocks[54]=function(aoz,vars)
	{
		// Inc cursX : If cursX>15 Then cursX=0
		aoz.sourcePos="0:153:12";
		vars.cursX++;
		aoz.sourcePos="0:153:24";
		if(!((vars.cursX)>(15)))
			return{type:1,label:56};
	};
	this.blocks[55]=function(aoz,vars)
	{
		aoz.sourcePos="0:153:41";
		vars.cursX=0;
	};
	this.blocks[56]=function(aoz,vars)
	{
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:154:12";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[57]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:155:8";
	};
	this.blocks[58]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:156:4";
	};
	this.blocks[59]=function(aoz,vars)
	{
		// MZ=Mouse Zone
		aoz.sourcePos="0:160:4";
		vars.MZ=aoz.fp2Int(aoz.currentScreen.hZone2({x:aoz.xMouse,y:aoz.yMouse}));
		// MK=Mouse Key
		aoz.sourcePos="0:161:4";
		vars.MK=aoz.fp2Int(aoz.mouseButtons);
		// If MZ >0 And MZ < 257
		aoz.sourcePos="0:162:4";
		if(!(((vars.MZ)>(0))&&((vars.MZ)<(257))))
			return{type:1,label:68};
	};
	this.blocks[60]=function(aoz,vars)
	{
		// ShowRowID[cursY,false] ' reset previous
		aoz.sourcePos="0:163:8";
		return{type:4,procedure:"showrowid",args:{r:vars.cursY,i:false}};
	};
	this.blocks[61]=function(aoz,vars)
	{
		// ShowColID[cursX,false] ' reset previous
		aoz.sourcePos="0:164:8";
		return{type:4,procedure:"showcolid",args:{c:vars.cursX,i:false}};
	};
	this.blocks[62]=function(aoz,vars)
	{
		// cursX=(MZ-1) Mod 16
		aoz.sourcePos="0:165:8";
		vars.cursX=aoz.fp2Int(((vars.MZ-1))%(16));
		// cursY=(MZ-1) / 16
		aoz.sourcePos="0:166:8";
		vars.cursY=aoz.fp2Int(aoz.checkNumber((vars.MZ-1)/16));
		// ShowChar[page*256+cursY*16+cursX]
		aoz.sourcePos="0:167:8";
		return{type:4,procedure:"showchar",args:{chr:vars.page*256+vars.cursY*16+vars.cursX}};
	};
	this.blocks[63]=function(aoz,vars)
	{
		// If MK<>0
		aoz.sourcePos="0:168:8";
		if(!((vars.MK)!=(0)))
			return{type:1,label:67};
	};
	this.blocks[64]=function(aoz,vars)
	{
		// Repeat Until Mouse Key = 0
		aoz.sourcePos="0:169:12";
	};
	this.blocks[65]=function(aoz,vars)
	{
		aoz.sourcePos="0:169:19";
		if(!((aoz.mouseButtons)==(0)))
			return{type:1,label:65};
	};
	this.blocks[66]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:171:8";
	};
	this.blocks[67]=function(aoz,vars)
	{
		// End If
		aoz.sourcePos="0:172:4";
	};
	this.blocks[68]=function(aoz,vars)
	{
		// Wait Vbl
		aoz.sourcePos="0:173:4";
		aoz.waitVblExit = true;
		return{type:12,waitThis:aoz,callFunction:"waitVbl",waitFunction:"waitVbl_wait",args:[]};
	};
	this.blocks[69]=function(aoz,vars)
	{
		// Loop
		aoz.sourcePos="0:174:0";
		return{type:1,label:6};
	};
	this.blocks[70]=function(aoz,vars)
	{
		// Bob 1,-charWidth#-2,-charHeight#-2
		aoz.sourcePos="0:177:4";
		aoz.currentScreen.bob(1,{x:-vars.charWidth_f-2,y:-vars.charHeight_f-2},aoz.checkIndex(undefined));
		// Return
		aoz.sourcePos="0:178:0";
		return{type:3};
	};
	this.blocks[71]=function(aoz,vars)
	{
		// If cursVisible
		aoz.sourcePos="0:181:4";
		if(!(vars.cursVisible))
			return{type:1,label:73};
	};
	this.blocks[72]=function(aoz,vars)
	{
		// Bob Hide 1
		aoz.sourcePos="0:182:8";
		aoz.currentScreen.bobVisible(1,false,'#update');
		// Else
		return{type:1,label:74};
	};
	this.blocks[73]=function(aoz,vars)
	{
		// Bob Show 1
		aoz.sourcePos="0:184:8";
		aoz.currentScreen.bobVisible(1,true,'#update');
		// End If
		aoz.sourcePos="0:185:4";
	};
	this.blocks[74]=function(aoz,vars)
	{
		// cursVisible = Not cursVisible
		aoz.sourcePos="0:186:4";
		vars.cursVisible=aoz.fp2Int(!(vars.cursVisible));
		// Every On
		aoz.sourcePos="0:187:4";
		this.aoz.everyOnOff(true)
		// Return
		aoz.sourcePos="0:188:0";
		return{type:3};
	};
	this.blocks[75]=function(aoz,vars)
	{
		return{type:0}
	};
	this.p_cleargrid=function(aoz,parent,args)
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
			// i=Ink
			aoz.sourcePos="0:191:4";
			vars.i=aoz.fp2Int(aoz.currentScreen.ink );
			// Ink 0
			aoz.sourcePos="0:192:4";
			aoz.currentScreen.setInk(0);
			// upLeftX#=charWidth#*6
			aoz.sourcePos="0:193:4";
			vars.upLeftX_f=this.root.vars.charWidth_f*6;
			// upLeftY#=charHeight#*4
			aoz.sourcePos="0:194:4";
			vars.upLeftY_f=this.root.vars.charHeight_f*4;
			// lowRightX#=charWidth#*(6+33)
			aoz.sourcePos="0:195:4";
			vars.lowRightX_f=this.root.vars.charWidth_f*(6+33);
			// lowRightY#=charHeight#*(4+17)
			aoz.sourcePos="0:196:4";
			vars.lowRightY_f=this.root.vars.charHeight_f*(4+17);
			// Bar upLeftX#,upLeftY# To lowRightX#,lowRightY#
			aoz.sourcePos="0:197:4";
			aoz.currentScreen.box({x:vars.upLeftX_f,y:vars.upLeftY_f},true,{x2:vars.lowRightX_f,y2:vars.lowRightY_f});
			// Ink i
			aoz.sourcePos="0:198:4";
			aoz.currentScreen.setInk(vars.i);
			// End Procedure
			return{type:0};
		};
	};
	this.p_fixchar=function(aoz,parent,args)
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
			// p=Pen
			aoz.sourcePos="0:210:4";
			vars.p=aoz.fp2Int(aoz.currentScreen.currentTextWindow.pen );
			// Pen 4
			aoz.sourcePos="0:211:4";
			aoz.currentScreen.currentTextWindow.setPen(4);
			// Locate 2,Li-4 : Print "  ";upArr$;" "
			aoz.sourcePos="0:212:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-4});
			aoz.sourcePos="0:212:20";
			aoz.currentScreen.currentTextWindow.print("  "+this.root.vars.upArr$+" ",true);
			// Locate 2,Li-3 : Print leftArr$;"   ";rightArr$
			aoz.sourcePos="0:213:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-3});
			aoz.sourcePos="0:213:20";
			aoz.currentScreen.currentTextWindow.print(this.root.vars.leftArr$+"   "+this.root.vars.rightArr$,true);
			// Locate 2,Li-2 : Print "  ";downArr$;" "
			aoz.sourcePos="0:214:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-2});
			aoz.sourcePos="0:214:20";
			aoz.currentScreen.currentTextWindow.print("  "+this.root.vars.downArr$+" ",true);
			// Pen 1
			aoz.sourcePos="0:215:4";
			aoz.currentScreen.currentTextWindow.setPen(1);
			// Locate 4,Li-3 : Print Chr$(chr)
			aoz.sourcePos="0:216:4";
			aoz.currentScreen.currentTextWindow.locate({x:4,y:this.root.vars.Li-3});
			aoz.sourcePos="0:216:20";
			aoz.currentScreen.currentTextWindow.print(String.fromCharCode(vars.chr),true);
			// Pen p
			aoz.sourcePos="0:217:4";
			aoz.currentScreen.currentTextWindow.setPen(vars.p);
			// End Procedure
			return{type:0};
		};
	};
	this.p_showchar=function(aoz,parent,args)
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
			// FixChar[chr] ' Line below should normally be fine.  (See FixChar)
			aoz.sourcePos="0:221:4";
			return{type:4,procedure:"fixchar",args:{chr:vars.chr}};
		};
		this.blocks[1]=function(aoz,vars)
		{
			// Locate 8,Li-3 : Pen 3 : Print "Chr$("; : Pen 2 : Print Hex$(chr,4); : Pen 3 : Print ")"
			aoz.sourcePos="0:223:4";
			aoz.currentScreen.currentTextWindow.locate({x:8,y:this.root.vars.Li-3});
			aoz.sourcePos="0:223:20";
			aoz.currentScreen.currentTextWindow.setPen(3);
			aoz.sourcePos="0:223:28";
			aoz.currentScreen.currentTextWindow.print("Chr$(",false);
			aoz.sourcePos="0:223:45";
			aoz.currentScreen.currentTextWindow.setPen(2);
			aoz.sourcePos="0:223:53";
			aoz.currentScreen.currentTextWindow.print(aoz.hex$(vars.chr,4),false);
			aoz.sourcePos="0:223:74";
			aoz.currentScreen.currentTextWindow.setPen(3);
			aoz.sourcePos="0:223:82";
			aoz.currentScreen.currentTextWindow.print(")",true);
			// Locate 8,Li-2 : Pen 3 : Print "Chr$("; : Pen 2 : Print Using "#####";chr; : Pen 3 : Print ")"
			aoz.sourcePos="0:224:4";
			aoz.currentScreen.currentTextWindow.locate({x:8,y:this.root.vars.Li-2});
			aoz.sourcePos="0:224:20";
			aoz.currentScreen.currentTextWindow.setPen(3);
			aoz.sourcePos="0:224:28";
			aoz.currentScreen.currentTextWindow.print("Chr$(",false);
			aoz.sourcePos="0:224:45";
			aoz.currentScreen.currentTextWindow.setPen(2);
			aoz.sourcePos="0:224:53";
			aoz.currentScreen.currentTextWindow.printUsing("#####",[vars.chr],";");
			aoz.sourcePos="0:224:80";
			aoz.currentScreen.currentTextWindow.setPen(3);
			aoz.sourcePos="0:224:88";
			aoz.currentScreen.currentTextWindow.print(")",true);
			// Bob 1,cursX*2*charWidth#+cursXOfs*charWidth#-1,cursY*charHeight#+cursYOfs*charHeight#-1
			aoz.sourcePos="0:225:4";
			aoz.currentScreen.bob(1,{x:this.root.vars.cursX*2*this.root.vars.charWidth_f+this.root.vars.cursXofs*this.root.vars.charWidth_f-1,y:this.root.vars.cursY*this.root.vars.charHeight_f+this.root.vars.cursYOfs*this.root.vars.charHeight_f-1},aoz.checkIndex(undefined));
			// ShowRowID[cursY,true]
			aoz.sourcePos="0:226:4";
			return{type:4,procedure:"showrowid",args:{r:this.root.vars.cursY,i:this.aoz.platformTrue}};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// ShowColID[cursX,true]
			aoz.sourcePos="0:227:4";
			return{type:4,procedure:"showcolid",args:{c:this.root.vars.cursX,i:this.aoz.platformTrue}};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Pen 1
			aoz.sourcePos="0:228:4";
			aoz.currentScreen.currentTextWindow.setPen(1);
			// Locate cursX*2+cursXOfs,CursY+cursYOfs
			aoz.sourcePos="0:229:4";
			aoz.currentScreen.currentTextWindow.locate({x:this.root.vars.cursX*2+this.root.vars.cursXofs,y:this.root.vars.cursY+this.root.vars.cursYOfs});
			// End Procedure
			return{type:0};
		};
	};
	this.p_showrowid=function(aoz,parent,args)
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
			// Pen 2
			aoz.sourcePos="0:233:4";
			aoz.currentScreen.currentTextWindow.setPen(2);
			// If i Then Inverse On Else Inverse Off
			aoz.sourcePos="0:234:4";
			if(!(vars.i))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			aoz.sourcePos="0:234:14";
			aoz.currentScreen.currentTextWindow.setInverse(true);
			return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:234:30";
			aoz.currentScreen.currentTextWindow.setInverse(false);
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Locate 1,r+cursYOfs : Print Left$(Hex$(page*256+r*16,4),4);"_" : Pen 1	: Inverse Off
			aoz.sourcePos="0:235:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:vars.r+this.root.vars.cursYOfs});
			aoz.sourcePos="0:235:26";
			aoz.currentScreen.currentTextWindow.print(this.aoz.getLeft$(aoz.hex$(this.root.vars.page*256+vars.r*16,4),4)+"_",true);
			aoz.sourcePos="0:235:69";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:235:80";
			aoz.currentScreen.currentTextWindow.setInverse(false);
			// End Procedure
			return{type:0};
		};
	};
	this.p_showcolid=function(aoz,parent,args)
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
			// Pen 2
			aoz.sourcePos="0:239:4";
			aoz.currentScreen.currentTextWindow.setPen(2);
			// If i Then Inverse On Else Inverse Off
			aoz.sourcePos="0:240:4";
			if(!(vars.i))
				return{type:1,label:2};
		};
		this.blocks[1]=function(aoz,vars)
		{
			aoz.sourcePos="0:240:14";
			aoz.currentScreen.currentTextWindow.setInverse(true);
			return{type:1,label:3};
		};
		this.blocks[2]=function(aoz,vars)
		{
			aoz.sourcePos="0:240:30";
			aoz.currentScreen.currentTextWindow.setInverse(false);
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Locate cursX*2+cursXOfs,cursYOfs-1 : Print Right$(Hex$(cursX,1),1); : Pen 1 : Inverse Off
			aoz.sourcePos="0:241:4";
			aoz.currentScreen.currentTextWindow.locate({x:this.root.vars.cursX*2+this.root.vars.cursXofs,y:this.root.vars.cursYOfs-1});
			aoz.sourcePos="0:241:41";
			aoz.currentScreen.currentTextWindow.print(this.aoz.getRight$(aoz.hex$(this.root.vars.cursX,1),1),false);
			aoz.sourcePos="0:241:74";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:241:82";
			aoz.currentScreen.currentTextWindow.setInverse(false);
			// End Procedure
			return{type:0};
		};
	};
	this.p_showhelp=function(aoz,parent,args)
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
			// Locate 2,Li-7 : Pen 4 : Print "Green";
			aoz.sourcePos="0:245:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-7});
			aoz.sourcePos="0:245:20";
			aoz.currentScreen.currentTextWindow.setPen(4);
			aoz.sourcePos="0:245:28";
			aoz.currentScreen.currentTextWindow.print("Green",false);
			// Pen 1 : Print " indicates navigation keys."
			aoz.sourcePos="0:246:6";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:246:14";
			aoz.currentScreen.currentTextWindow.print(" indicates navigation keys.",true);
			// Locate 2,Li-6 : Print "Arrow keys change selected char."
			aoz.sourcePos="0:247:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-6});
			aoz.sourcePos="0:247:20";
			aoz.currentScreen.currentTextWindow.print("Arrow keys change selected char.",true);
			// Locate 2,Li-5 : Print "Or click mouse on a character."
			aoz.sourcePos="0:248:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-5});
			aoz.sourcePos="0:248:20";
			aoz.currentScreen.currentTextWindow.print("Or click mouse on a character.",true);
			// Pen 4
			aoz.sourcePos="0:249:4";
			aoz.currentScreen.currentTextWindow.setPen(4);
			// Locate 2,Li-4 : Print "  ";upArr$;
			aoz.sourcePos="0:250:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-4});
			aoz.sourcePos="0:250:20";
			aoz.currentScreen.currentTextWindow.print("  "+this.root.vars.upArr$,false);
			// Locate 2,Li-3 : Print leftArr$;"   ";rightArr$
			aoz.sourcePos="0:251:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-3});
			aoz.sourcePos="0:251:20";
			aoz.currentScreen.currentTextWindow.print(this.root.vars.leftArr$+"   "+this.root.vars.rightArr$,true);
			// Locate 2,Li-2 : Print "  ";downArr$;" "
			aoz.sourcePos="0:252:4";
			aoz.currentScreen.currentTextWindow.locate({x:2,y:this.root.vars.Li-2});
			aoz.sourcePos="0:252:20";
			aoz.currentScreen.currentTextWindow.print("  "+this.root.vars.downArr$+" ",true);
			// Pen 4
			aoz.sourcePos="0:253:4";
			aoz.currentScreen.currentTextWindow.setPen(4);
			// Locate 20,Li-3 : Print "PgUp"; : Pen 1 : Print ": Prev Page"
			aoz.sourcePos="0:254:4";
			aoz.currentScreen.currentTextWindow.locate({x:20,y:this.root.vars.Li-3});
			aoz.sourcePos="0:254:21";
			aoz.currentScreen.currentTextWindow.print("PgUp",false);
			aoz.sourcePos="0:254:37";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:254:45";
			aoz.currentScreen.currentTextWindow.print(": Prev Page",true);
			// Pen 4
			aoz.sourcePos="0:255:4";
			aoz.currentScreen.currentTextWindow.setPen(4);
			// Locate 20,Li-2 : Print "PgDn"; : Pen 1 : Print ": Next Page";
			aoz.sourcePos="0:256:4";
			aoz.currentScreen.currentTextWindow.locate({x:20,y:this.root.vars.Li-2});
			aoz.sourcePos="0:256:21";
			aoz.currentScreen.currentTextWindow.print("PgDn",false);
			aoz.sourcePos="0:256:37";
			aoz.currentScreen.currentTextWindow.setPen(1);
			aoz.sourcePos="0:256:45";
			aoz.currentScreen.currentTextWindow.print(": Next Page",false);
			// End Procedure
			return{type:0};
		};
	};
	this.p_showheadings=function(aoz,parent,args)
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
			// Pen 2
			aoz.sourcePos="0:260:4";
			aoz.currentScreen.currentTextWindow.setPen(2);
			// Locate 1,cursYOfs-1
			aoz.sourcePos="0:261:4";
			aoz.currentScreen.currentTextWindow.locate({x:1,y:this.root.vars.cursYOfs-1});
			// Print "     ";
			aoz.sourcePos="0:262:4";
			aoz.currentScreen.currentTextWindow.print("     ",false);
			// For h=0 to 15
			aoz.sourcePos="0:263:4";
			vars.h=0;
		};
		this.blocks[1]=function(aoz,vars)
		{
			// Print Using " ~";Right$(Hex$(h,1),1);
			aoz.sourcePos="0:264:8";
			aoz.currentScreen.currentTextWindow.printUsing(" ~",[this.aoz.getRight$(aoz.hex$(vars.h,1),1)],";");
			// Next h
			aoz.sourcePos="0:265:4";
			vars.h+=1;
			if(vars.h<=15)
				return{type:1,label:1};
		};
		this.blocks[2]=function(aoz,vars)
		{
			// Pen 1
			aoz.sourcePos="0:266:4";
			aoz.currentScreen.currentTextWindow.setPen(1);
			// End Procedure
			return{type:0};
		};
	};
	this.p_setzones=function(aoz,parent,args)
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
			// For c=0 To $F
			aoz.sourcePos="0:271:4";
			vars.c=0;
		};
		this.blocks[1]=function(aoz,vars)
		{
			// For l=0 To $F
			aoz.sourcePos="0:272:8";
			vars.l=0;
		};
		this.blocks[2]=function(aoz,vars)
		{
			// xStart=(cursXOfs*charWidth#)+(c*2)*charWidth#
			aoz.sourcePos="0:273:12";
			vars.xStart=aoz.fp2Int((this.root.vars.cursXofs*this.root.vars.charWidth_f)+(vars.c*2)*this.root.vars.charWidth_f);
			// xEnd=(cursXOfs*charWidth#)+(c*2)*charWidth#+charWidth#-1
			aoz.sourcePos="0:274:12";
			vars.xEnd=aoz.fp2Int((this.root.vars.cursXofs*this.root.vars.charWidth_f)+(vars.c*2)*this.root.vars.charWidth_f+this.root.vars.charWidth_f-1);
			// yStart=(cursYOfs*charHeight#)+l*charHeight#
			aoz.sourcePos="0:275:12";
			vars.yStart=aoz.fp2Int((this.root.vars.cursYOfs*this.root.vars.charHeight_f)+vars.l*this.root.vars.charHeight_f);
			// yEnd=(cursYOfs*charHeight#)+l*charHeight#+charHeight#-1
			aoz.sourcePos="0:276:12";
			vars.yEnd=aoz.fp2Int((this.root.vars.cursYOfs*this.root.vars.charHeight_f)+vars.l*this.root.vars.charHeight_f+this.root.vars.charHeight_f-1);
			// zoneIndex = c+l*16+1
			aoz.sourcePos="0:284:12";
			vars.zoneIndex=aoz.fp2Int(vars.c+vars.l*16+1);
			// Set Zone zoneIndex,xStart,yStart To xEnd,yEnd
			aoz.sourcePos="0:285:12";
			aoz.currentScreen.setZone(vars.zoneIndex,{x:vars.xStart,y:vars.yStart,x2:vars.xEnd,y2:vars.yEnd});
			// Next l
			aoz.sourcePos="0:286:8";
			vars.l+=1;
			if(vars.l<=0xF)
				return{type:1,label:2};
		};
		this.blocks[3]=function(aoz,vars)
		{
			// Next c
			aoz.sourcePos="0:287:4";
			vars.c+=1;
			if(vars.c<=0xF)
				return{type:1,label:1};
		};
		this.blocks[4]=function(aoz,vars)
		{
			// End Procedure
			return{type:0};
		};
	};
	this.p_copytoclipboard=function(aoz,parent,args)
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
			aoz.sourcePos="0:292:4";
			// Javascript
		window.copyToClipboard(this.vars.clp$);	
			// End Javascript
			// End Procedure
			return{type:0};
		};
	};
	this.aoz.run(this,0,args);
	this.aoz.v1_0_animations=new v1_0_animations(this.aoz,args);
	this.aoz.v1_0_asset=new v1_0_asset(this.aoz,args);
	this.aoz.v1_0_bobs=new v1_0_bobs(this.aoz,args);
	this.aoz.v1_0_collisions=new v1_0_collisions(this.aoz,args);
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
	this.aoz.v1_0_zones=new v1_0_zones(this.aoz,args);
	this.aoz.ext_tween=new ext_tween(this.aoz,args);
};
