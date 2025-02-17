
/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ transpiler
 *
 * List of tokens
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */

/**doc
@name:Globales AOZ Instructions
@description:All instructions globales for the AOZ programming.
@author:François Lionet
doc*/

module.exports.tokenTable =
[
	{ name: "Method", token: "method", params: [ "" ] },
	{ name: "End Method", token: "end method", params: [ "" ] },
	{ name: "Extends", token: "extends", params: [ "" ] },
	{ name: "FriendWith", token: "friendwith", params: [ "" ] },
	{ name: "Class", token: "class", params: [ "" ] },
	{ name: "End Class", token: "end class", params: [ "" ] },
	{ name: "Instruction", token: "instruction", params: [ "" ] },
	{ name: "End Instruction", token: "end instruction", params: [ "" ] },
	{ name: "Function", token: "function", params: [ "" ] },
	{ name: "End Function", token: "end function", params: [ "" ] },
	{ name: "Mod", token: "mod", params: [ ], compile: [] },
	{ name: "To", token: "to", params: [ ] },
	{ name: "Not", token: "not", params: [ ] },
	{ name: "Swap", token: "swap", params: [ 'I?,?'], compile: '#function handleSwap' },
	{ name: "Def Fn", token: "def fn", params: [ 'I' ], compile: '#function handleDefFn' },
	{ name: "Fn", token: "fn", params: [ "0" ], compile: '#function handleFn' },
	{ name: "Follow Off", token: "follow off", params: [ "I" ], compile: [ '' ] },
	{ name: "Follow", token: "follow", params: [ "I" ], compile: [ '' ] },
	{ name: "Resume Next", token: "resume next", params: [ ], compile: '#function handleResumeNext' },
	{ name: "Every On", token: "every on", params: [ "I" ], compile: [ 'this.aoz.everyOnOff(true)' ] },
	{ name: "Every Off", token: "every off", params: [ "I" ], compile: [ 'this.aoz.everyOnOff(false)' ] },
	{ name: "Super", token: "super", params: [ "I" ], compile: '#function handleSuper' },
	{ name: "As", token: "as", params: [ "I" ], compile: [ '' ] },
	{ name: "For", token: "for", params: [ ], compile: '#function handleFor' },
	{ name: "Next", token: "next", params: [ ], compile: '#function handleNext' },
	{ name: "Repeat", token: "repeat", params: [ ], compile: '#function handleRepeat' },
	{ name: "Until", token: "until", params: [ ], compile: '#function handleUntil' },
	{ name: "While", token: "while", params: [ ], compile: '#function handleWhile' },
	{ name: "Wend", token: "wend", params: [ ], compile: '#function handleWend' },
	{ name: "Do", token: "do", params: [ ], compile: '#function handleDo' },
	{ name: "Loop", token: "loop", params: [ ], compile: '#function handleLoop' },
	{ name: "Exit If", token: "exit if", params: [ ], compile: '#function handleExitIf' },
	{ name: "Exit", token: "exit", params: [ ], compile: '#function handleExit' },
	{ name: "Goto", token: "goto", params: [ ], compile: '#function handleGoto' },
	{ name: "Gosub", token: "gosub", params: [ ], compile: '#function handleGosub' },
	{ name: "If", token: "if", params: [ ], compile: '#function handleIf' },
	{ name: "Then", token: "then", params: [ ] },
	{ name: "Else If", token: "else if", params: [ ], compile: '#function handleElseIf' },
	{ name: "Else", token: "else", params: [ ], compile: '#function handleElse' },
	{ name: "End If", token: "end if", params: [ ], compile: '#function handleEndIf' },
	{ name: "On Error", token: "on error", params: [ ], compile: '#function handleOnError' },
	{ name: "On Break Proc", token: "on break proc", params: [ ] },
	{ name: "On Menu", token: "on menu", params: [ "I0" ] },
	{ name: "On", token: "on", params: [ ], compile: '#function handleOn' },
	{ name: "Resume Label", token: "resume label", params: [ ], compile: '#function handleResumeLabel' },
	{ name: "Resume", token: "resume", params: [ ], compile: '#function handleResume' },
	{ name: "Pop Proc", token: "pop proc", params: [ ], compile: '#function handlePopProc' },
	{ name: "Every", token: "every", params: [ "I" ], compile: '#function handleEvery' },
	{ name: "Step", token: "step", params: [ ] },
	{ name: "Return", token: "return", params: [ "I" ], compile: '#function handleReturn' },
	{ name: "Pop", token: "pop", params: [ "I" ], compile: '#function handlePop' },
	{ name: "Procedure", token: "procedure", params: [ ] },
	{ name: "Proc", token: "proc", params: [ ], compile: '#function handleProc' },
	{ name: "End Procedure",  token: "end procedure", params: [ ] },
	{ name: "End Proc", token: "end proc", params: [ ] },
	{ name: "Shared", token: "shared", params: [ ], compile: '#function handleShared' },
	{ name: "Global", token: "global", params: [ ], compile: '#function handleGlobal' },
	{ name: "Param#", token: "param#", params: [ "0" ], compile: [ 'this.procParam' ] },
	{ name: "Param$", token: "param$", params: [ "2" ], compile: [ 'this.procParam$' ] },
	{ name: "Param", token: "param", params: [ "0" ], compile: [ 'this.procParam' ] },
	{ name: "Error", token: "error", params: [ "I0" ], compile: [ 'this.aoz.doError(%$P1);' ], doError: true },
	{ name: "Data", token: "data", params: [ "I" ], compile: '#function handleData' },
	{ name: "Read", token: "read", params: [ "I" ], compile: '#function handleRead', doError: true },
	{ name: "Restore", token: "restore", params: [ "I" ], compile: '#function handleRestore', doError: true },
	{ name: "Print Using", token: "print using", params: [ "I" ], compile: '#function handlePrintUsing', doError: true },
	{ name: "Print", token: "print", params: [ "I" ], compile: '#function handlePrint', doError: true },
	{ name: "LPrint", token: "lprint", params: [ "I" ], compile: '#function handleLPrint' },
	{ name: "Input", token: "input", params: [ "I" ], compile: '#function handleInput', newBlock: true },
	{ name: "Line Input", token: "line input", params: [ "I" ], compile: '#function handleLineInput', newBlock: true },
	{ name: "Mid$", token: "mid$", params: [ "V2C,0,0", "V2C,0" ], compile: [ 'this.aoz.%$PVMid$(%$PP%$P1,%$P2,%$P3)%$P;', 'this.aoz.%$PVMid$(%$PP%$P1,%$P2)%$P;' ] },
	{ name: "Left$", token: "left$", params: [ "V2C,0" ], compile: [ 'this.aoz.%$PVLeft$(%$PP%$P1,%$P2)%$P;'] },
	{ name: "Right$", token: "right$", params: [ "V2C,0" ], compile: [ 'this.aoz.%$PVRight$(%$PP%$P1,%$P2)%$P;' ] },
	{ name: "Dim", token: "dim", params: [ "I" ], compile: '#function handleDim' },
	{ name: "Rem", token: "rem", params: [ ] },
	{ name: "Sort", token: "sort", params: [ "I0" ], compile: '#function handleSort', doError: true },
	{ name: "Match", token: "match", params: [ "03,3" ], compile: '#function handleMatch', doError: true },
	{ name: "Edit", token: "edit", params: [ "I" ], compile: '#function handleEdit',  },
	{ name: "Direct", token: "direct", params: [ "I" ], compile: '#function handleDirect' },
	{ name: "Default Palette", token: "default palette", params: [ "I" ], compile: '#function handleDefaultPalette' },
	{ name: "Palette", token: "palette", params: [ "I" ], compile: '#function handlePalette' },
	{ name: "Fade", token: "fade", params: [ "I" ], compile: '#function handleFade' },
	{ name: "Colour Back", token: "colour back", params: [ "I0" ], compile: '#function handleColourBack' },
	{ name: "Timer", token: "timer", params: [ "V" ], compile: [ 'this.aoz.%$PVTimer(%$PP)%$P;' ] },
	{ name: "Picture", token: "picture", params: [ "0" ], compile: [ '' ]  },
	{ name: "Polyline", token: "polyline", params: [ "I" ], compile: '#function handlePolyline', doError: true },
	{ name: "Polygon", token: "polygon", params: [ "I" ], compile: '#function handlePolygon', doError: true },
	{ name: "Filled Polygon", token: "filled polygon", params: [ "I" ], compile: '#function handleFilledPolygon', doError: true },
	{ name: "Save Variables", token: "save variables", params: [ "I" ], compile: '#function handleSaveVariables', doError: true },

	{ name: "Trap", token: "trap", params: [ "I" ], compile: [ '#function handleTrap' ] },
	{ name: "Include", token: "include", params: [ "I2" ], compile: [ '' ] },

	{ name: "Channel", token: "channel", params: [ "I" ], compile: '#function handleChannel', doError: true },
	{ name: "AmReg", token: "amreg", params: [ "V00", "V00,0" ], compile: [ 'this.aoz.amal.%$PVRegister(%$PP%$P1)%$P;', 'this.aoz.amal.%$PVRegister(%$PP%$P2,%$P1)%$P;' ] },
	{ name: "Rain", token: "rain", params: [ "V00,0" ], compile: [ 'this.aoz.moduleRainbows.%$PVRain(%$PP%$P1,%$P2)%$P;' ] },

	{ name: "Field", token: "field", params: [ "I" ], compile: '#function handleField', doError: true },
	{ name: "Dir$", token: "dir$", params: [ "V" ], compile: [ 'this.aoz.filesystem.%$PVDir$(%$PP)%$P;' ] },
	{ name: "This@", token: "this@", params: [ "V3" ], compile: [ 'this' ] },

	{ name: "Set Transparent", token: "set transparent", params: [ "I0" ], compile: '#function handleSetTransparent', doError: true },
	{ name: "Stop Transparent", token: "stop transparent", params: [ "I0" ], compile: '#function handleStopTransparent', doError: true },

	{ name: "Inc", token: "inc", params: [ "I" ], compile: '#function handleInc', doError: true },
	{ name: "Dec", token: "dec", params: [ "I" ], compile: '#function handleDec', doError: true },
	{ name: "Add", token: "add", params: [ "I" ], compile: '#function handleAdd', doError: true },
	{ name: "End", token: "end", params: [ "I" ], compile: '#function handleEnd', doError: true },
	{ name: "clapfin", token: "clapfin", params: [ "I" ], compile: '#function handleClapFin', doError: true },
	{ name: "VarPtr", token: "varptr", params: [ "0?" ], compile: '#function handleVarptr', doError: true },
	{ name: "Break If", token: "break if", params: [ "I" ], compile: '#function handleBreakIf', doError: true },
	{ name: "Console Log", token: "console log", params: [ "I" ], compile: '#function handleConsoleLog', doError: true },
	{ name: "Console Warn", token: "console warn", params: [ "I" ], compile: '#function handleConsoleWarn', doError: true },
	{ name: "Console Error", token: "console error", params: [ "I" ], compile: '#function handleConsoleError', doError: true },

	// TODO!
//	{ name: "", token: "colour", params: [ "V00" ], compile: [ 'this.aoz.currentScreen.%$PVColour(%$PP%$P1)%$P;' ] },
	{ name: "Wait Vbl", token: "wait vbl", params: [ "I" ], compile: [ 'return{type:8,instruction:"waitVbl",args:[]};' ], newBlock: true },
	{ name: "Wait Key", token: "wait key", params: [ "I" ], compile: [ 'return{type:8,instruction:"waitKey",args:[]};' ], newBlock: true },
	{ name: "Wait", token: "wait", params: [ "I0" ], compile: [ 'return{type:8,instruction:"wait",args:[%$P1]};' ], newBlock: true },
	{ name: "Stop", token: "stop", params: [ "I" ], compile: [ 'this.aoz.stop();' ] },
	{ name: "Debug", token: "debug", params: [ "I" ], compile: [ 'debugger;' ] },
	{ name: "Error", token: "error", params: [ "I0" ], compile: [ 'this.aoz.doError(%$P1);' ], doError: true },
	{ name: "Break Off", token: "break off", params: [ "I" ], compile: [ 'this.aoz.breakOn=false;' ] },
	{ name: "Break On", token: "break on", params: [ "I" ], compile: [ 'this.aoz.breakOn=true;' ] },
	{ name: "AReg", token: "areg", params: [ "V00" ], compile: [ 'this.aoz.%$PVFakeVariable(%$PP%$P1)%$P' ] },
	{ name: "DReg", token: "dreg", params: [ "V00" ], compile: [ 'this.aoz.%$PVFakeVariable(%$PP%$P1)%$P' ] },
	{ name: "VDialog", token: "vdialog", params: [ "V00,0" ], compile: [ 'this.aoz.%$PVFakeVariable(%$PP%$P1)%$P' ] },
	{ name: "VDialog$", token: "vdialog$", params: [ "V20,0" ], compile: [ 'this.aoz.%$PVFakeVariable$(%$PP%$P1)%$P' ] },
	//{ name: "Input$", token: "input$", params: [ "20", "20,0" ], compile: [ 'return{type:9,instruction:"input$",result:%$PN,args:[%$P1]};', 'return{type:9,instruction:"input$",result:%$PN,args:[%$P1,%$P2]};' ], waiting: true },
	{ name: "Key$", token: "key$", params: [ "V00" ], compile: [ 'this.aoz.%$PVKey$(%$PP%$P1)%$P;' ] },
	{ name: "X Mouse", token: "x mouse", params: [ "V0" ], compile: [ 'this.aoz.%$PVXMouse(%$PP)%$P;' ] },
	{ name: "Y Mouse", token: "y mouse", params: [ "V0" ], compile: [ 'this.aoz.%$PVYMouse(%$PP)%$P;' ] },
	{ name: "BSet", token: "bset", params: [ "I0,0" ], compile: '#function handleBset' },
	{ name: "BClr", token: "bclr", params: [ "I0,0" ], compile: '#function handleBclr' },
	{ name: "BChg", token: "bchg", params: [ "I0,0" ], compile: '#function handleBchg' },
	{ name: "BTst", token: "btst", params: [ "00,0" ], compile: [ '((%$P2&(1<<%$P1))!=0)' ] },
	{ name: "Ror", token: "ror", params: [ "I0,0" ], compile: '#function handleRor' },
	{ name: "Rol", token: "rol", params: [ "I0,0" ], compile: '#function handleRol' },

	{ name: "__cdebug", token: "__cdebug", params: [ "I0" ], compile: '#function handleCDebug' },
];
