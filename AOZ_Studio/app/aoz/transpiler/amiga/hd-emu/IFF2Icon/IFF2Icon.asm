DEBUGBOOL	=	0	(set to TRUE, if ya wanna DebugMode!)

;;	*****************************************************************
	*	Programm:	IFF2Icon				*
	*			(erzeugt Icon- aus IFF-File)		*
	*	Copyright:	Freeware © von Hanns Holger Rutz/Tro-	*
	*			picDesign				*
	*	History:	19.-30.04.1993	diese erste Version	*
	*			07.08.1993	removed a little bug	*
	*			31.08.1993	removed BODY-Read Bug	*
	*	Bugs:		PutDiskObject() keeps sum KiloBytes of	*
	*			memory, I don't know why...		*
	*			IFF-Loader: DEST-Chunk,Mask?		*
	*****************************************************************

;;-- Includes --

		incdir	'sys:asm/inc/'
		include	'dos/dosextens.i'
		include	'exec/memory.i'
		include	'intuition/intuition.i'
		include	'private/dos_lib.i'
		include	'private/icon_lib.i'
		include	'private/macros.i'
		include	'workbench/workbench.i'

;;-- Macros --

version		macro
		dc.b	'1.0b'
		endm

;;-- Konstanten --

		rsreset			;nowhere defined in da includes...
bmhd_W		rs.w	1		Bildbreite
bmhd_H		rs.w	1		Bildhöhe
bmhd_X		rs.w	1
bmhd_Y		rs.w	1
bmhd_Depth	rs.b	1		Tiefe
bmhd_Mask	rs.b	1
bmhd_Pack	rs.b	1		1 if ByteRunOne, 0 if none
bmhd_PAD	rs.b	1
bmhd_TColor	rs.w	1
bmhd_XAspect	rs.b	1
bmhd_YAspect	rs.b	1
bmhd_PicW	rs.w	1
bmhd_PicH	rs.w	1
bmhd_SIZEOF	rs.b	0

		rsreset
gl_DOSBase	rs.l	1
gl_IconBase	rs.l	1
gl_RDArgs	rs.l	1
gl_Return	rs.b	1
		rsword
gl_Result2	rs.l	1
gl_Process	rs.l	1

gl_Array	 rs.b	0	\
gl_aFrom	rs.l	1	 \
gl_aTo		rs.l	1	  \
gl_aDisk	rs.l	1	   \
gl_aDrawer	rs.l	1	    \
gl_aTool	rs.l	1	     \
gl_aProject	rs.l	1	     /
gl_aGarbage	rs.l	1	    /
gl_aComplement	rs.l	1	   /
gl_aBackFill	rs.l	1	  /
gl_aImage	rs.l	1	 /
gl_aPAD		rs.l	2	/

gl_RealName	rs.b	512+4		Name des IconFiles ohne evtl. '.info'
gl_DiskObject	rs.l	1		Icon-Struktur, die geschrieben wird
		rs.l	1		gl_FileInfo mußt be LONG-aligned :-(
gl_FileInfo	rs.b	fib_SIZEOF	intern (für _GetType)
gl_IconType	rs.b	1		WBDISK, WBTOOL etc.
		rsword
gl_VecList	 rs.b	0
gl_BMHD		rs.l	1	\	*AllocVec-Speicher für BMHD-Chunk
gl_BODY		rs.l	1	 \	*AllocVec-Speicher für BODY-Chunk
gl_Image1	rs.l	1	 /	*AllocVec-ImageStruktur		 <-\
gl_Image2	rs.l	1	/	*ImageStruktur (selected) AllocVec /
VecNum		=	3

gl_SIZEOF	rs.b	0

;;-- StartUp --

_Start		move.w	#gl_SIZEOF/2-1,d0
.ClearLoop	clr.w	-(sp)
		dbf	d0,.ClearLoop
		movea.l	sp,gl
		exec	a0
		movea.l	ThisTask(a0),gl_Process(gl)
		move.b	#RETURN_FAIL,gl_Return(gl)

		bsr.b	_OpenLibs
		beq.b	_CleanUp
		if DEBUGBOOL
			*move.b	#WBTOOL,gl_IconType(gl)
			moveq.l	#-1,d0
			move.l	d0,gl_aImage(gl)
			lea.l	.From(pc),a0
			move.l	a0,gl_aFrom(gl)
			lea.l	.To(pc),a0
			move.l	a0,gl_aTo(gl)
			lea.l	gl_RealName(gl),a1
.Loop			move.b	(a0)+,(a1)+
			bne.b	.Loop
			bra.b	_Main
.From			dc.b	'sys:Graphik/IFF/AADMagIcon.Hi4',0
.To			dc.b	'ram:t',0
			even
		else
			bsr.w	_GetArgs
			beq.b	_CleanUp
		endc

;;-- Hauptprogramm --

_Main		bsr.w	_GetIcon
		beq.b	.PrintError
		bsr.w	_PutIcon
		beq.b	.PrintError
		clr.b	gl_Return(gl)
		bra.b	.MainEnd

.PrintError	slib	DOS
		move.l	gl_Result2(gl),d1
		moveq.l	#0,d2
		fjsr	PrintFault		DOS-Fehlerbeschreibung ausgeben
.MainEnd

;;-- Aufräumen --

_CleanUp	bsr.w	_Free		DiskObject-Struktur etc. freigeben
		bsr.w	_FreeArgs
		bsr.w	_CloseLibs
		moveq.l	#0,d0
		move.b	gl_Return(gl),d0
		beq.b	.Exit
		movea.l	gl_Process(gl),a0
		move.l	gl_Result2(gl),pr_Result2(a0)
.Exit		lea.l	gl_SIZEOF(sp),sp
		rts

;;-- globaler Konstantenspeicher --

		dc.b	'$VER: IFF2Icon',$A0
		version
		dc.b	0
		even

;;-- Libraries öffnen --
;	Out:	cc=eq, wenn Fehler

_OpenLibs	push	d0/d1/a0/a1

		exec
		lea.l	.DOSName(pc),a1
		moveq.l	#36,d0
		fjsr	OpenLibrary
		move.l	d0,gl_DOSBase(gl)
		beq.b	.DOSError
		lea.l	.IconName(pc),a1
		moveq.l	#36,d0
		fjsr	OpenLibrary
		move.l	d0,gl_IconBase(gl)
		beq.b	.IconError

.Exit		pull	d0/d1/a0/a1
		rts

.DOSError
.Error		moveq.l	#ERROR_INVALID_RESIDENT_LIBRARY,d0
		move.l	d0,gl_Result2(gl)
		clr.b	d0				cc=eq
		bra.b	.Exit

.IconError	slib	DOS
		lea.l	.ErrorTxt(pc),a0
		move.l	a0,d1
		lea.l	.IconName(pc),a0
		move.l	a0,-(sp)
		move.l	sp,d2			'icon.library' = Argument
		fjsr	VPrintf
		addq.l	#4,sp
		bra.b	.Error

.DOSName	DOSNAME
.IconName	ICONNAME
.ErrorTxt	dc.b	"%s v36+ couldn't be opened!",$0a,0
		even

;;-- Libraries schließen --

_CloseLibs	push	d0/d1/a0/a1

		exec
		movea.l	gl_IconBase(gl),a1		Basis oder NULL
		fjsr	CloseLibrary
		movea.l	gl_DOSBase(gl),a1		Basis oder NULL
		fjsr	CloseLibrary

		pull	d0/d1/a0/a1
		rts

;;-- Shell-Argumente lesen/auswerten --
;	Out:	cc=eq, wenn Fehler

_GetArgs	push	d0/d1/a0-a2/lb

		slib	DOS
		lea.l	.Template(pc),a0
		move.l	a0,d1
		lea.l	gl_Array(gl),a0
		move.l	a0,d2
		moveq.l	#0,d3
		fjsr	ReadArgs			Argmente einlesen
		move.l	d0,gl_RDArgs(gl)
		beq.b	.Error

		lea.l	gl_aGarbage+4(gl),a0
		moveq.l	#WBGARBAGE,d0
.TypeLoop	tst.l	-(a0)
		bne.b	.TypeEnd
		subq.b	#1,d0				IconType berechnen
		bgt.b	.TypeLoop
		tst.l	gl_aTo(gl)
		beq.b	.TypeError	   ..weder IconFile noch Typ angegeben
.TypeEnd	move.b	d0,gl_IconType(gl)

		move.l	gl_aTo(gl),d0
		beq.b	.OkExit
		movea.l	d0,a0
		lea.l	gl_RealName(gl),a1
		move.l	a1,-(sp)
.NameLoop	move.b	(a0)+,(a1)+		IconNamen kopieren
		bne.b	.NameLoop
		subq.l	#6,a1
		cmpa.l	(sp)+,a1
		blt.b	.NameEnd		..weniger als 5 Buchstaben
		movea.l	a1,a0			a0 = *Eventuelles.InfoSuffix
		cmpi.b	#'.',(a1)+
		bne.b	.NameEnd		..kein '.' für '.info'
		move.l	#'ofni',d0
.NameLoop2	move.b	(a1)+,d1
		bset.l	#5,d1			LowerCase
		cmp.b	d1,d0
		bne.b	.NameEnd		..kein .info-Suffix
		lsr.l	#8,d0
		bne.b	.NameLoop2
		clr.b	(a0)			.info-Suffix entfernen
.NameEnd
.OkExit		moveq.l	#-1,d0			cc=ne

.Exit		pull	d0/d1/a0-a2/lb
		rts

;In: lb = *DOSBase

.Error		bsr.w	_GetIOErr
.PrintUsage	lea.l	-108(sp),sp
		move.l	sp,d1
		moveq.l	#108,d2
		fjsr	GetProgramName		Programm-Namen holen und
		lea.l	.Usage(pc),a0
		move.l	a0,d1
		move.l	sp,d2
		fjsr	VPrintf			..zusammen mit Usage ausgeben
		lea.l	108(sp),sp
		clr.b	d0			cc=eq
		bra.b	.Exit

.TypeError	moveq.l	#ERROR_REQUIRED_ARG_MISSING,d0
		move.l	d0,gl_Result2(gl)
		bra.b	.PrintUsage

.Template	dc.b	'FROM,TO/K,DISK/S,DRAWER/S,TOOL/S,PROJECT/S,GARBAGE/S,'
		dc.b	'COMPLEMENT/S,BACKFILL/S,IMAGE/S',0
.Usage		dc.b	'Usage:  IFF2Icon [<IFFFile>] [To <IconFile>] [<IconTy'
		dc.b	'pe>] [<HighlightType>]',$0a,$0a
		dc.b	'  IconType:       Disk|Drawer|Tool|Project|Garbage'
		dc.b	$0a
		dc.b	'  HightlightType: Complement|BackFill|Image',$0a,$0a
		dc.b	'  Specify <IconFile> and/or <IconType>!',$0a,0
		even

;;-- RDArgs zurückgeben --

_FreeArgs	push	d0/d1/a0/a1/lb

		slib	DOS
		move.l	gl_RDArgs(gl),d1
		beq.b	.Exit
		fjsr	FreeArgs

.Exit		pull	d0/d1/a0/a1/lb
		rts

;;-- IOError sichern --
;	Out:	d0.l = IOError, cc=d0.l

_GetIOErr	lpush	a0

		movea.l	gl_Process(gl),a0
		move.l	pr_Result2(a0),d0		IOError in d0
		move.l	d0,gl_Result2(gl)		..und sichern (cc)

		lpull	a0
		rts

;;-- IFFFile / DefaultIcon lesen --
;	Out:	cc=eq, wenn Fehler

_GetIcon	push	d0-d2/a0/a1/lb

		slib	Icon
		tst.l	gl_aTo(gl)
		beq.b	.TypeEnd
		bsr.w	_GetType		Typ anhand des Files ermitteln
		bne.b	.TypeCont		..kein Fehler
		move.b	gl_IconType(gl),d1	..Fehler, wichtig?
		beq.w	.TypeErr		..ja
		cmpi.b	#WBTOOL,d1
		beq.b	.TypeCont		..nein
		cmpi.b	#WBPROJECT,d1
		bne.w	.TypeErr		..ja
.TypeCont	tst.b	gl_IconType(gl)
		bne.b	.TypeEnd
		move.b	d0,gl_IconType(gl)
.TypeEnd
		tst.l	gl_aFrom(gl)
		beq.w	.GetDefault		..DefaultIcon laden (kein From)

.Get		bsr.w	_GetIFF			IFF-Graphik einlesen
		beq.w	.Exit			..Fehler
		suba.l	a0,a0
		fjsr	GetDiskObject		leere DiskObjectStruktur
		move.l	d0,gl_DiskObject(gl)	..besorgen
		beq.w	.GetErr
		movea.l	d0,a0
		move.l	#WB_DISKMAGIC<<16!WB_DISKVERSION,(a0)	..und füllen
		move.b	gl_IconType(gl),do_Type(a0)
		move.l	#NO_ICON_POSITION,d0
		move.l	d0,do_CurrentX(a0)
		move.l	d0,do_CurrentY(a0)
		cmpi.b	#WBTOOL,gl_IconType(gl)
		beq.b	.GetCont3			..kein Window
		cmpi.b	#WBPROJECT,gl_IconType(gl)
		beq.b	.GetCont3			..kein Window
		lea.l	.DrawerData(pc),a1
		move.l	a1,do_DrawerData(a0)		Windowdaten einfügen
.GetCont3
		move.l	#4096,do_StackSize(a0)
		movea.l	gl_Image1(gl),a1
		move.l	ig_Width(a1),do_Gadget+gg_Width(a0)
		move.b	#WB_DISKREVISION,do_Gadget+gg_UserData+3(a0)
		move.l	a1,do_Gadget+gg_GadgetRender(a0)
		moveq.l	#GADGIMAGE!GADGHCOMP,d0		Highlight: Complement
		tst.l	gl_aBackFill(gl)
		beq.b	.GetCont
		moveq.l	#GADGIMAGE!GADGHBOX,d0		Highlight: BackFill
.GetCont	tst.l	gl_aImage(gl)
		beq.b	.GetCont2
		moveq.l	#GADGIMAGE!GADGHIMAGE,d0	Highlight: Image
		move.l	gl_Image2(gl),do_Gadget+gg_SelectRender(A0)
.GetCont2	move.w	d0,do_Gadget+gg_Flags(a0)
		*moveq.l #-1,d0
		bra.b	.Exit

.GetDefault	moveq.l	#0,d0
		move.b	gl_IconType(gl),d0
		fjsr	GetDefDiskObject		DefaultIcon holen
		move.l	d0,gl_DiskObject(gl)
		beq.b	.GetDefErr			..Fehler

.Exit		pull	d0-d2/a0/a1/lb
		rts

.GetErr		bsr.w	_GetIOErr
		lea.l	.GetErrTxt(pc),a0
		bra.b	.PrintError

.GetDefErr	bsr.w	_GetIOErr
		lea.l	.DefErrTxt(pc),a0
		;||
;	In:	a0 = *Text

.PrintError	move.l	a0,d1
		slib	DOS
		fjsr	PutStr				Fehler ausgeben
		bra.b	.ErrorExit

.TypeErr	lea.l	.TypeErrTxt(pc),a0
		move.l	a0,d1
		lea.l	gl_RealName(gl),a0		From-Namen zusammen mit
		move.l	a0,-(sp)
		move.l	sp,d2
		slib	DOS
		fjsr	VPrintf				..Fehlertext ausgeben
		addq.l	#4,sp
.ErrorExit	clr.b	d0				cc=eq
		bra.b	.Exit

.DrawerData	dc.w	50,50,400,100
		dc.b	-1,-1
		dc.l	0
.f1		=	WFLG_SIZEGADGET!WFLG_DRAGBAR!WFLG_DEPTHGADGET
.f2		=	WFLG_CLOSEGADGET!WFLG_SIZEBRIGHT!WFLG_SIZEBBOTTOM
.f3		=	WFLG_SIMPLE_REFRESH!WFLG_REPORTMOUSE!WFLG_WBENCHWINDOW
		dc.l	.f1!.f2!.f3
		dc.l	0,0,0,0,0
		dc.w	90,40,-1,-1,WBENCHSCREEN
		dc.l	0,0
		dc.l	0
		dc.w	0

.TypeErrTxt	dc.b	"Couldn't get information on '%s'!",$0a,0
.DefErrTxt	dc.b	"Couldn't get the default Icon!",$0a,0
.GetErrTxt	dc.b	"Unable to create Icon!",$0a,0
		even

;;-- (Default-)Icon schreiben --
;	Out:	cc=eq, wenn Fehler

_PutIcon	push	d0/d1/a0/a1/lb

		slib	Icon
		tst.l	gl_aTo(gl)
		beq.b	.PutDefault		..DefaultIcon erzeugen

.Put		lea.l	gl_RealName(gl),a0
		movea.l	gl_DiskObject(gl),a1
		fjsr	PutDiskObject		Icon erzeugen
		tst.l	d0
		beq.b	.PutErr			..Fehler
		bra.b	.Exit

.PutDefault	movea.l	gl_DiskObject(gl),a0
		fjsr	PutDefDiskObject	DefaultIcon erzeugen
		tst.l	d0
		beq.b	.PutDefErr		..Fehler

.Exit		pull	d0/d1/a0/a1/lb
		rts

.PutDefErr	bsr.w	_GetIOErr
		lea.l	.DefErrTxt(pc),a0
		move.l	a0,d1
		slib	DOS
		fjsr	PutStr				Fehlertext ausgeben
		clr.b	d0				cc=eq
		bra.b	.Exit

.PutErr		bsr.w	_GetIOErr
		lea.l	gl_RealName(gl),a0		To-Namen zusammen mit
		move.l	a0,-(sp)
		lea.l	.ErrTxt(pc),a0
		move.l	a0,d1
		move.l	sp,d2
		slib	DOS
		fjsr	VPrintf				..Fehlertext ausgeben
		addq.l	#4,sp
		clr.b	d0				cc=eq
		bra.b	.Exit

.DefErrTxt	dc.b	"Couldn't create default Icon!",$0a,0
.ErrTxt		dc.b	"Couldn't create Icon for '%s'!",$0a,0
		even

;;-- DiskObject-Struktur etc. freigeben --

_Free		push	d0-d2/a0-a2/lb

		movea.l	gl_DiskObject(gl),d0
		beq.b	.ObjectEnd
		slib	Icon
		movea.l	d0,a0
		fjsr	FreeDiskObject		DiskObject freigeben,
						;bei nicht-default werden die
						;Images nicht freigeben
.ObjectEnd
		lea.l	gl_VecList(gl),a2
		moveq.l	#VecNum-1,d2
		exec
.VecLoop	movea.l	(a2)+,a1
		fjsr	FreeVec		BMHD, BODY, Images etc. freigeben
		dbf	d2,.VecLoop

		pull	d0-d2/a0-a2/lb
		rts

;;-- Filetypen ermitteln und gl_RealName ggf. ändern --
;	Out:	d0.b = IconType, cc=eq, wenn Fehler

_GetType	push	d0-d4/a0-a3/lb

		lea.l	gl_RealName(gl),a3
		move.l	a3,a0
.Icon		slib	Icon
		fjsr	GetDiskObject		Icon besorgen
		tst.l	d0
		beq.b	.File			..keins gefunden
		movea.l	d0,a0
		move.b	do_Type(a0),3(sp)	Typ des alten Icons übernehmen
		fjsr	FreeDiskObject
		bra.w	.OkExit

.File		slib	DOS
		move.l	a3,d1			*Name
		moveq.l	#ACCESS_READ,d2
		fjsr	Lock
		move.l	d0,d4
		beq.w	.Error			..konnte nicht gelockt werden
		move.l	d4,d1
		lea.l	gl_FileInfo(gl),a2
		move.l	a2,d2
		andi.b	#~3,d2			LONG-align
		movea.l	d2,a2			Fuck the DOS-Library!!!
		fjsr	Examine
		tst.w	d0
		beq.w	.ErrorUnLock		..konnte nicht examint werden
		tst.l	fib_DirEntryType(a2)
		blt.b	.CheckFile		..eine Datei => die überprüfen

.Dir		move.l	d4,d1
		lea.l	-512(sp),sp
		move.l	sp,d2
		move.l	#512,d3
		fjsr	NameFromLock	vollen Namen ermitteln (ohne assigns)
		movea.l	sp,a2
		lea.l	512(sp),sp
		tst.l	d0
		beq.b	.ErrorUnLock		..Fehler
		move.l	d4,d1
		fjsr	UnLock
.DirLoop	move.b	(a2)+,(a3)+		Namen kopieren
		bne.b	.DirLoop
		moveq.l	#WBDRAWER,d0
		move.l	d0,(sp)
		subq.l	#2,a3
		cmpi.b	#':',(a3)+
		bne.b	.OkExit			..Verzeichnis oder SoftLink

.Disk		moveq.l	#WBDISK,d0	
		move.l	d0,(sp)			..Boot-/Root-Directory (Disk)
		move.l	#'ksid',d0
.DiskLoop	move.b	d0,(a3)+		'disk' ranhängen
		lsr.l	#8,d0
		bne.b	.DiskLoop
		clr.b	(a3)			String abschließen
		bra.b	.OkExit

.CheckFile	move.l	d4,d1
		fjsr	OpenFromLock		Datei öffnen
		tst.l	d0
		beq.b	.ErrorUnLock		..Fehler
		move.l	d0,d4
		move.l	d4,d1
		clr.l	-(sp)
		move.l	sp,d2
		moveq.l	#4,d3
		fjsr	Read			4 Bytes zum Prüfen lesen
		move.l	(sp)+,d2
		cmp.l	d3,d0
		blt.b	.ErrorClose		..Fehler
		move.l	d4,d1
		fjsr	Close			Datei wieder schließen
		tst.w	d0
		beq.b	.Error			..Fehler
		moveq.l	#WBTOOL,d0
		move.l	d0,(sp)
		cmpi.l	#$03F3,d2		ist die Datei ausführbar?
		beq.b	.OkExit			..ja (Tool)
		moveq.l	#WBPROJECT,d0
		move.l	d0,(sp)			..nein (Project)

.OkExit		moveq.l	#-1,d0
.Exit		pull	d0-d4/a0-a3/lb
		rts

;die .Error-Routinene benötigen lb = *DOSBase!

.ErrorClose	bsr.w	_GetIOErr
		move.l	d4,d1
		fjsr	Close
		bra.b	.ErrorExit

.ErrorUnLock	bsr.w	_GetIOErr
		move.l	d4,d1
		fjsr	UnLock
		bra.b	.ErrorExit

.Error		bsr.w	_GetIOErr
.ErrorExit	clr.b	d0			cc=eq
		bra.b	.Exit

;;-- IFF-Graphik laden --
;	Out:	cc=eq, wenn Fehler

_GetIFF		push	d0-d6/a0-a2/lb

		lea.l	-12(sp),sp
		moveq.l	#%11,d6			;Bit0 cleared = BMHD read
						;Bit1 cleared = BODY read
		slib	DOS
		move.l	gl_aFrom(gl),d1
		move.l	#MODE_OLDFILE,d2
		fjsr	Open			IFF-Datei öffnen
		move.l	d0,d4
		beq.w	.OpenErr		..Fehler
		move.l	d4,d1
		move.l	sp,d2
		moveq.l	#12,d3
		fjsr	Read			Header lesen
		cmp.l	d3,d0
		blt.w	.ILBMErr		..Fehler
		cmpi.l	#'FORM',(sp)
		bne.w	.ILBMErr2		..kein "FORM"
		cmpi.l	#'ILBM',8(sp)
		bne.w	.ILBMErr2		..kein "ILBM"
		move.l	4(sp),d5		Länge des Files -8
		addq.l	#4,d5			..für eigene Ansprüche ändern

.ChunkLoop	tst.l	d6			nötige Chunx gelesen?
		beq.w	.FileOk			..ja
		subq.l	#8,d5
		ble.w	.MissErr		..nein, aber Ende der Datei
		move.l	d4,d1
		move.l	sp,d2
		moveq.l	#8,d3
		fjsr	Read			Chunkheader lesen
		cmp.l	d3,d0
		blt.w	.ReadErr		..Fehler
		sub.l	4(sp),d5
		btst.l	#0,d6			BMHD-Chunk schon gelesen?
		beq.b	.ChunkCont		..ja
		cmpi.l	#'BMHD',(sp)
		beq.b	.BMHD			..nein, dies ist einer
.ChunkCont
		btst.l	#1,d6			BODY-Chunk schon gelesen?
		beq.b	.ChunkCont2		..ja
		cmpi.l	#'BODY',(sp)
		beq.b	.BODY			..nein, dies ist einer
.ChunkCont2
		move.l	d4,d1
		move.l	4(sp),d2
		moveq.l	#OFFSET_CURRENT,d3
		fjsr	Seek			zum nächsten Chunk
		bsr.w	_GetIOErr
		beq.b	.ChunkLoop
		bra.w	.ReadErr		..Fehler

.BMHD		exec
		move.l	4(sp),d3
		move.l	d3,d0
		moveq.l	#MEMF_PUBLIC,d1
		fjsr	AllocVec		Speicher besorgen
		move.l	d0,gl_BMHD(gl)
		slib	DOS
		beq.w	.MemErr			..Fehler
		move.l	d0,d2
		move.l	d4,d1
		fjsr	Read			Daten einlesen
		bclr.l	#0,d6
		cmp.l	d3,d0
		beq.b	.ChunkLoop
		bra.w	.ReadErr		..Fehler

.BODY		exec
		move.l	4(sp),d3
	addq.l	#1,d3
	bclr.l	#0,d3
		move.l	d3,d0
		moveq.l	#MEMF_PUBLIC,d1
		fjsr	AllocVec		Speicher besorgen
		move.l	d0,gl_BODY(gl)
		slib	DOS
		beq.w	.MemErr			..Fehler
		move.l	d0,d2
		move.l	d4,d1
		fjsr	Read			Daten einlesen
		bclr.l	#1,d6
		cmp.l	d3,d0
		beq.w	.ChunkLoop
		bra.w	.ReadErr		..Fehler

.FileOk		move.l	d4,d1
		fjsr	Close			Fertig, Datei schließen
		tst.w	d0
		beq.w	.CloseErr		..Fehler
		exec
		move.l	gl_BMHD(gl),a2
		cmpi.b	#1,bmhd_Pack(a2)	PackTyp bekannt (ByteRun1)?
		bgt.w	.PackErr		..nein
		move.w	bmhd_W(a2),d0
		addi.w	#15,d0
		lsr.w	#4,d0
		add.w	d0,d0
		moveq.l	#0,d1
		move.b	bmhd_Depth(a2),d1
		mulu.w	d1,d0
		mulu.w	bmhd_H(a2),d0		d0.l = PictureSize
		moveq.l	#ig_SIZEOF,d1		..+Image-Structure-Size
		tst.l	gl_aImage(gl)
		beq.b	.ImageCont
		add.b	d1,d1		..nochmal, da es zwei Images sind
.ImageCont	add.l	d1,d0
		move.l	#MEMF_PUBLIC!MEMF_CLEAR,d1
		move.l	d0,-(sp)
		fjsr	AllocVec			Speicher besorgen
		move.l	(sp)+,d1
		move.l	d0,gl_Image1(gl)
		beq.w	.MemErr2			..Fehler
		tst.l	gl_aImage(gl)
		beq.b	.ImageCont2
		lsr.l	#1,d1
		add.l	d1,d0
		move.l	d0,gl_Image2(gl)		ggf. 2. ImageAdresse
		lsr.w	#1,bmhd_H(a2)		jedes Image hat eine vertikale
						;Hälfte
.ImageCont2
		movea.l	gl_Image1(gl),a0
		movea.l	gl_BODY(gl),a1
		bsr.w	.CreateImage			1. Image berechnen
		tst.l	gl_aImage(gl)
		beq.b	.ImageCont3
		movea.l	gl_Image2(gl),a0
		movea.l	d0,a1
		bsr.w	.CreateImage			ggf. 2. Image auch
.ImageCont3
		movea.l	a2,a1
		clr.l	gl_BMHD(gl)
		fjsr	FreeVec				BMHD freigeben
		movea.l	gl_BODY(gl),a1
		clr.l	gl_BODY(gl)
		fjsr	FreeVec				BODY freigeben
		moveq.l	#-1,d0

.Exit		lea.l	12(sp),sp
		pull	d0-d6/a0-a2/lb
		rts

;-- alle Error-Routinen außer .MemErr2 benötigen lb = *DOSBase! --

.ILBMErr	bsr.w	_GetIOErr
		bne.b	.ILBMCont			..DOS-Fehler
.ILBMErr2	move.l	#ERROR_OBJECT_WRONG_TYPE,gl_Result2(gl)
.ILBMCont	lea.l	.ILBMTxt(pc),a2
		;||
;	In:	a2 = *ErrorText, the routine closes da file

.PrintError	move.l	d4,d1
		fjsr	Close				Datei schließen
.PrintError2	move.l	a2,d1
		lea.l	gl_aFrom(gl),a0
		move.l	a0,d2
		fjsr	VPrintf				..und Text ausgeben
.ErrorExit	clr.b	d0				cc=eq
		bra.b	.Exit

.MissErr	moveq.l	#ERROR_REQUIRED_ARG_MISSING,d0
		move.l	d0,gl_Result2(gl)
		lea.l	.MissTxt(pc),a2
		bra.b	.PrintError

.CloseErr
.OpenErr	bsr.w	_GetIOErr
		lea.l	.InfoTxt(pc),a2
		bra.b	.PrintError2

.ReadErr	bsr.w	_GetIOErr
		lea.l	.ReadTxt(pc),a2
		bra.b	.PrintError

.MemErr		moveq.l	#ERROR_NO_FREE_STORE,d0
		move.l	d0,gl_Result2(gl)
		lea.l	.InfoTxt(pc),a2
		bra.b	.PrintError

.MemErr2	moveq.l	#ERROR_NO_FREE_STORE,d0
		move.l	d0,gl_Result2(gl)
		lea.l	.MemTxt(pc),a0
		move.l	a0,d1
		slib	DOS
		fjsr	PutStr				Text ausgeben
		bra.b	.ErrorExit

.PackErr	move.l	#ERROR_NOT_IMPLEMENTED,gl_Result2(gl)
		lea.l	.PackTxt(pc),a2
		bra.b	.PrintError2

;-- Image-Struktur ausfüllen --
;	In:	a0 = *ImageStruct (hinten dran Speicher für die Graphik)
;		a1 = *CurrentBODYAddress, a2 = *BMHD-Address
;	Out:	d0 = *NewBODYAddress
;	ACHTUNG: wenn gl_aImage ~= 0: bmhd_H durch 2 teilen!
;		 bmhd_Pack muß 0 oder 1 sein!

.CreateImage	push	d1-d7/a0-a3

		lea.l	ig_SIZEOF(a0),a3
		move.l	a3,ig_ImageData(a0)
		move.w	#$ff00,ig_PlanePick(a0)
		move.b	bmhd_Depth(a2),ig_Depth+1(a0)
		move.l	bmhd_W(a2),ig_Width(a0)

		move.w	bmhd_W(a2),d4
		addi.w	#15,d4
		lsr.w	#4,d4
		add.w	d4,d4			d4.w = LineSize
		move.w	bmhd_H(a2),d2		d2.w = LineNumba
		move.w	ig_Depth(a0),d7
		mulu.w	d2,d7
		subq.w	#1,d7
		mulu.w	d4,d7			d7.l = PlaneSize*Depth-LineSize
		subq.w	#1,d2			d2.w = LineNumba-1
		move.w	d2,d6
		mulu.w	d4,d6			d6.l = PlaneSize-LineSize

.LineLoop	moveq.l	#0,d3
		move.b	bmhd_Depth(a2),d3
		subq.b	#1,d3
.DepthLoop	move.w	d4,d5
.InLineLoop	moveq.l	#0,d0
		tst.b	bmhd_Pack(a2)		Bild gepackt?
		beq.b	.UnPacked		..nein
		move.b	(a1)+,d0		..ja, ein Byte lesen
		blt.b	.Crunch			..ByteRun: gecruncht

.NoCrunch	sub.w	d0,d5			übrige Bytes/Zeile korrigieren
.NCLoop		move.b	(a1)+,(a3)+		ungecrunchte Bytes kopieren
		dbf	d0,.NCLoop
		bra.b	.Cont

.Crunch		neg.b	d0
		sub.w	d0,d5			übrige Bytes/Zeile korrigieren
		move.b	(a1)+,d1
.CLoop		move.b	d1,(a3)+		gepackte Bytes kopieren
		dbf	d0,.CLoop
.Cont
		subq.w	#1,d5			Control-Byte abziehen
		bgt.b	.InLineLoop		..Zeile noch nicht zu Ende
.DepthEnd	add.l	d6,a3			nächste Bitplane
		dbf	d3,.DepthLoop
		sub.l	d7,a3			wieder zur 1. Bitplane, aber
						;jetzt die nächste Zeile
		dbf	d2,.LineLoop

		move.l	a1,d0			Returncode = *NeuerBODY
		pull	d1-d7/a0-a3
		rts

.UnPacked	subq.w	#1,d5
.UPLoop		move.b	(a1)+,(a3)+		Graphik direkt kopieren
		dbf	d5,.UPLoop
		bra.b	.DepthEnd		nächste Line der nächsten Plane

;IF BIT7 SET, CRUNCH=ON  -> NUMBER =-BYTE+1	<= ByteRun1-Algorithmus
;       ELSE, CRUNCH=OFF -> NUMBER = BYTE+1

.ILBMTxt	dc.b	"'%s': No IFF (FORM/ILBM) File!",$0a,0
.InfoTxt	dc.b	"Couldn't get information on '%s'!",$0a,0
.ReadTxt	dc.b	"'%s': Error while reading!",$0a,0
.MissTxt	dc.b	"'%s': BMHD- or BODY-Chunk missing!",$0a,0
.MemTxt		dc.b	"Can't create Icon-Images!",$0a,0
.PackTxt	dc.b	"'%s': Unknown pack-method!",$0a,0
