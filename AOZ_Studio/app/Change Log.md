# Change Log
--------------------------------------------------------------

FL-20022023
===========
- You can now get the length of an array with =Len( A() )
  if the array has more than one dimensions, you can get the length of 
  one dimension if you specify up to the dimension. 
  Example: Dim A$( 10, 20 ) : Print Len( A$( 5 ) ) will print 20..    
  Specially useful when you use automatic arrays...
  Dim A(): A( Rnd( 0, 100 ) ) = 10 : Print Len( A() )
- PROC now has two modes of functionning.
  In AMIGA mode-> as before, you need to state the real name of the procedure
  In AOZ mode-> proc accepts a STRING with the name of the procedure 
  and eventual parameters defined in the string (crashes for the moment, BB code)
  Proc "Toto"
  Proc "TOTO" +Str$( NUMBEROFTOTO )
  Proc "Toto[10,20]" (should work in a next version)
- A=Procedure[ ARRAY() ] used to return a type mismatch error

BB-17022023
===========
- Fix FontSize for Actor Text
- Actor Text default font updated
- Fix the copy from AOZ drives to AOZ project
- Add any fonts for Actor Text in the AOZ Drives
  - fnt_stencil_gold
  - fnt_stencil_silver
  - fnt_stencil_bronze
  - fnt_stencil_gold_silver_bronze
  - fnt_impact

BB-16022023
===========
- Fix Play Audio properties AudioLoop & Volume
- Fix the hotspot on the Actor
- New Behavior "tank" for the Actors
    Actor "ship", Image$="ship", Hotspot$="middle", behavior$="tank"
    or
    Actor "ship", Image$="ship", Hotspot$="middle", behavior$="tank:speed=10,rotation=10"
  
FL-16022023
===========
- New tag: #fullScreenIcon: true/false, forces the display of a discrete icon on the top-right of the application to switch from/to fullscreen.

BB-15022023
===========
- Fix Fullscreen Tag
- Fix Wait Input with TouchScreen
- Fix Collision and HotSpot of the Actor
- News instructions
  FullScreen On / FullScreen Off: Enables / Disables the fullscreen

- News functions. 
  = Zero$(integer, size): Returns a string from the value with "0" front.
  Example: 
    A$ = Zero$( 255, 6 ) // A$ = "000255"

  = Actor UserData$( <name/number> ): Returns the specific Actor data stored by the user.

- News Actor properties:
  - Text$: A string to display with the Actor
  - FontName$: Name of the Font Bitmap Image for the font to use
  - FontSize: Value in purcent of the font size (100% = 256px)
  - FontSpacing: Value in pixel of the horizontal spacing between each character. A negative value is allowed.
  - UserData$: Reserved for the user to store a specific data for this Actor.

- News Actor Animation instruction properties:
  - LoopMove: True/False. Plays the animation in loop
  - ReverseMove: True/False. Plays the animation with a "ping-pong" effect, in loop.

- News Play Audio instruction properties:
  - AudioLoop: True/False
  - Volume: Integer in %

FL-07022023
===========
- Console Log/Warn/Error now accept PRINT-like syntax

### VERSION 1.0, Feb 6, 2023... This one.
>>Update 39
===========
- Fix Actor Anim Frame()
- Console Warn crash
- Bigger font in Console
- Console Log / Console Warn / Console Error correction, output now to Aoz console or browser's console.
- Debugging of transpiler related to objects
- Harmonization of the parameters passed in the Actor events.
- Console Log, Console Warn and Console Error now log into the Aoz console when under the Aoz Viewer and in the Chrome console if running in the browser
- Console is now shown when using Console Log/Warn/Error
- Source Editor can now handle multicolor texts
- Call of procedure passing an array
- New Dictionaries Dim A( "" )
- Automatic arrays Dim A( , )
- Invisible crash when error in runtime
- Fix the OnMouse event name for "mouseclick" instead "click"
- new "Application Complete" message flashin in Aoz Viewer title when application is ended
- All animations and movement and procedure calls functional when application is complete.
- Non-unicode character in the application made it crash at runtime
- End of application now preserves the running animations/movements
- Random crash in Bot Simulator found! No more crashes.
- Bot Simulator: all LED animations implemented
- Bot Simulator: all Drum sounds working
- Bot Simulator: smooth arrival of the camera
- New =Car() object, that create a 3D car
- 3D Physics engine implementation progressing, replacement of OIMO with CANNON-ES, works much better
- Fix Actor Hotspot and limits
- Fix Actor Del Z bug. 
- Fix button index on OnMouseClick$ / OnMouseUp$ actor events
- Actor Del can delete a group of actors. 
- Fix Actor Col bug
- Add 2 commands : Smoothing ON / Smoothing Off (Turn On / Off the graphic antialiasing)
- The "InsertImages" property of the "Show HTML" & "HTML Code$" commands has "True" as a default value.
- Fix the Actor Hotspot
- Fix the Mouse Actor events
- Fix the Actor Del instruction
- Now, we can give many parameter to a called procedure by an event. Ex:
    
    MYVAR$ = "Toto"
    Actor "magic", Image$="magicfly", X=300, OnMouseClick$="_ON_CLICK" // Simple call
    Actor "magic2", Image$="magicfly", X=300, Y = 100, OnMouseClick$="_ON_CLICK[ N = 255 ]" // Call with "N" argument (value 255)
    Actor "magic3", Image$="magicfly", X=300, Y = 200, OnMouseClick$="_ON_CLICK[ V$ = MYVAR$ ]" // Call with "V$" argument (value of MYVAR$)
    Actor "magic4", Image$="magicfly", X=300, Y = 300, OnMouseClick$="_ON_CLICK[ S# = this.scalex ]" // Call with "S#" argument (value of the ScaleX Actor property)
    Actor "magic5", Image$="magicfly", X=300, Y = 400, OnMouseClick$="_ON_CLICK[ N = 128, V$= MYVAR$, S# = this.angle ]" // Call with multi arguments
    

    Procedure _ON_CLICK[ EVENT$, INDEX$, N, V$, S# ]
      Print EVENT$ + ": " + INDEX$ +", " + Str$( N ) + ", " + V$ + ", " + Str$( S# )
    End Procedure
- Screen Open, HelperAxis parameter did noty work
- Transpiler: correction of many bugs in object-orientation
- Transpiler/Runtime: implementation of multiple friend classes for one object and refresh system
- 3D: passage of all classes in derivative of TDObject (coordinates) / Mesh (textures, materials etc.)
- 3D: made CarMovement and TweenMovement work
- 3D: implementation of Physics friend classes and physic engine
- BUG #959: Boolean function results are not working on If statement.
- BUG #961: On Error Goto and On Error Proc are NOT working.
- BUG #962: If Errn$ is called, and errn is 0, it causes "Message not found undefined" to appear instead.
- BUG #967: KEYS: as a label will stop AOZ from working
- BUG #988: Indent (CONTROL-SHIFT-F3) working again
- BUG 998: Watch A() crashed + crash on two watch instruction in code
- BUG #1000: The Font$() command does not recognize the default font any more.
- CRASH when opening debugger or direct-mode console since last version
- BUG #1026: Load ABK files was crashing
- BUG #1050: TXT files in resources/filesystem folders were not compiled properly
- BUG #974: Problems with cursor, Curs On did not work, and in Amiga mode.
- BUGs On Error Goto / On Error Proc / Err$ / ErrN
  were crashing or not functionning correctly.
  
### VERSION 1.0, Jan 10, 2023... This one.
>>Update 38
===========
- Fix the spritesheet
- Fix errors messages in the runtime
- Fix a bug on the Wait Input command
- Clean the logs
- Update the Joystick Tester accessory (v0.99)

### VERSION 1.0, Jan 5, 2023.
>>Update 37
===========
- Fix the keyboard events on the input controls

>>Update 36
===========
- The displayed Documentation wasn't updated
- Accessories opens the developer tools

### VERSION 1.0, Jan 3, 2023...
>>Update 35
===========
- Fix Wait Input instruction.
- Fix the bug on the JLeft() statement
- Hide the Transpiler's Console messages and shows them if there is an error only.
- Now there is no more "End of program" message for "AOZ" type projects and the program remains alive.
  For the other program types, this remains unchanged. 

### VERSION 1.0, Dec 26, 2022...
>>Update 34
===========
- Clean Transpiler

>>Update 33
===========
- Remove Bot Simulator and GameShift accessories
- Remove Tutorials 4 & 5
- Change the Audio File Fo Boom, Shoot and Bell
- Add a cleaner POST Update

>>Update 32
===========
- Fix the resize event in the AOZ Viewer
- Fix the "NTSC/PAL" lines number in "amiga" mode
- Updates for ascii-viewer and Joystick tester
- Fix Transpiler
- Fix the Publish and the QR Code generator

>>Update 31
===========
- Fix Transpiler
- The copy of images from AOZ Drive to the AOZ project has been restored
- The copy takes into account the image sequences in the Actor Animation instruction
- The JS error when closing the AOZ Viewer (_aozHandle ) has been fixed


>>Update 30
===========
- Fix Transpiler
- The documentation online opens at the startup. (Option in the settings)
- Moves the "Activate" button on the licence panel


### Release 1.0.0 Beta 16, Dec 23, 2022...
>>Update 29
===========

- Fix Actor Collision Event
- Fix AOZ Link Path error
- Fix Bug #960
- Actor SpriteSheet using, retablished! 
- Actor Behavior instruction added
- Bot Simulator Logo
- Bot Simulator less bugs
- Bot Simulator title screen
- Screen Open: new parameter "AlwaysOnTop"
- New! Tween Movement class
- Fixes in Rainbows, Transpiler
- New background in bot simulator
- Change of the bot simulator interface layout
- Add the Actor Animation instruction to add an images sequence by code.
  Example:
  Actor Animation Anim$="run", Sequence$="1,2,3,4,L"
  Actor "magic", Image$=1, Anim$="run"
  Sequence$ value is a string with each image name or image number separated by a comma. The last value can by "L" to loop, "E" to end, "R" to reverse and loop. You can to set a delay between 2 images like this:

  Sequence$="1:1000,2,..."
  "1:1000" stops the anim to the image 1 during 1 sec before to continue.
  
  to stop an animation:
  Actor "Magic", AnimPlay=False
- New Lines object for 3D, to draw lines in the 3D space. Bot Simulator grid is an example of lines
- Light problem corrected, it is now possible to create light in a 3D scene, only the color needs to be defined before loading/creating the screen.
- A number of lights are created as a pool of available possible lights at start, all white.
- 3D Error messages now implemented
- Fix: "Parameter not found" error now displays the name of the paramater that was not found.
- NEW! Automatic arrays! Do not indicate the number of dimensions and the array will be automatic. Meaning that it will adapt it's length to the value your give to it, just like in Javascript.
  Example:
  Dim A$()
  A$( 1000 ) = "Hello!"
  Print A$
  You can mix automatic and non-automatic dimensions.
  Dim TOTO@( , 100 ) will make the first dimension automatic and the second one "manual".
  
  To come in tomorrow's version: PUSH/POP/SPLICE/LEN ...
-Added the "Exit App" instruction to quit an application and close the window 
- Added StartX/EndX, StartY/EndY and Duration properties to the HTML Element statement, to program a move of a DOM, from a point A to a point B.
- New Instruction Set for the Local/Session storage:
  * True|False=Local Exists( "key" ) / True|False=Session Exists( "key" ) : Returs True if a key exists, else False 
  * A$=Read Local$( "key" ) / A$=Read Session( "key" ) : Read a key and returns its value as string
  * A=Read Local( "key" ) / A=Read Session( "key" ) : Read a key and returns its value as integer
  * Write Local( "key", *Value$="string", *Value=Integer ) / Write Session( "key", *Value$="string", *Value=Integer ) : Write a value in a key.
  * Delete Local( "key" ) / Delete Session( "key" ) : Delete a key
  * Clear Local / Clear Session : Delete all keys
- Fix transpiler, all problems with properties and methods, inline or non inline, in flat or object-oriented syntax
- Bot Simulator: inactivation of the buttons when the bot is executing a command
- Bot Simulator: fix of the LED animation display
- Bot Simulator now 100% Aoz Basic without Javascript sections.
- Rewrite of transpiler block reference system-> much safer, less bugs in the future, works with objects
- Global variables are now added to the a global variable context giving enough information to get/change their values
- Fix two recent bugs in transpiler that caused several applications to crash
- If an instance of AOZ Studio is already open and a new instance is launched, a message appears and the new instance is destroyed.
- Fix Transpiler bug crash related to Class properties
- Implemented better Updated system for friend classes
- 3D: texture object now load textures from the 3D bank
- 3D: environement mapping to 360 textures
- Bot Simultator: new environment map 360
- Fix Transpiler bug: procedure variable are considered global (since 10 days)
- Fix transpiler bugs with properties
- Bot Simulator: Record button, recording of movements with joystick or keys
- Bot Simulator: console is now hidden at start with a button to open/close it
- Bot Simulator: Reset button now works
- Fix bug in "Sound Devices" function
- Fix in aoz-viewer.js: CONTROL-SHIFT=F" now opens Chrome debugger immediately in aoz-viewer
- New instruction to control multitasking in Aoz.
  Multi Off-> stops multitasking, for example in a Every procedure that changes the current screen
  Multi On-> restore multitasking
- UI module: added a "multiple" parameter to the UI Select instruction to be able to open lists instead of combo boxes
- Several fixes in transpiler
- Progress on Bot Simulator
  * recording of commands in a list with edit capabilities
  * playing / pausing the list
  * copy the list to clipboard
  * implementation of sounds, notes and musics in the emulator
  * bot simulator display can now be moved with the up and down keys
  * joystick and buttons of the Cyberpi
  * more to come!
- CONTROL-SHIFT-F2 now launches Aoz Viewer with Chrome debugger open before application starts
  (handy to debug!)_
- CONTROL-SHIFT-F4 now recompile all.
- Bot Simulator now plays all MBot sounds and notes
- Fix Browser extension, crash with Open URL
- Fix errors in Orientation for mobiles
- Fix bug in Bob Shadow, bob was not upted when instruction was repeated
- Fix Every, made it use another tasks, you can do Wait in Every now
- Fix Method call crash
- Fix bob label width in debugger/console if the image name was too long
- Fix bad transpiler error messages with Variable Not Defined
- Fixed transpiler all bad "Variable not defined" messages
- Update method of classes now work in non-inline, update system improved
- Fix many bugs in Every
- Made Update Method work for classes in both inline and BASIC
- Progress on Bot Simutator
- Icons banks are now renamed by the transpiler to "6.icons" and handled at that address automatically
- Crunchman Reloaded works as a consequence
- Fix console Prompt (vars "application"
- Fix Tranpiler and IDE Import AMOS-> you can now import AMOS applications into Aoz again. Some work still to do by BB, copyu the repertory into my_aoz_applications.
- Fix transpiler bugs related to classes
- Tween object completed, with automatic array filling, magic variables and other features
- Tween Demo added to Store/Demos
- NEW! Tween Class and commands, see demo
- Transpiler: when methods / functions have floating point parameters, you no longer need to put the # in the name of the parameter when calling the function/method
  Example:
  	Class Toto, Width# = 1.0
  		...
  	End Class
  Before: Toto@( Width = 1 ) returned a Syntax Error and you had to use "Width# = 1" in the call
  Now: You can use either "Width# = 1" OR "Width = 1" without the #
  The distinction between # and non floating point variable will slowly disappear from Aoz.
- Fix Transpiler: second level Include did not work
- For include, the transpiler now tries directory "aoz" (allowing you to refer inside tools for example)
- Every Proc now uses the new system of tasks, now instructions like Load or Set Font work inside
- Bot Simulator: Cyberpi display
- New Application "Robot" template
- Fix bad bug in transpiler related to classes
- Finished implementation of Camera in 3D
- New path possible for accessory links (.aozacc), #tools#, will be replaced by the path to aoz/tools
- Fix in Renderer, Aoz Screen was not displayed if 3D screen was open and console open.
- Fix crash in Filter Del
- Change of movement class system into real classes, simpler
- New CarMovement class 
- New BotMovement class, analyse commands and handle robot animations
- New Bot Simulator accessory, in progress
- New 3D movement classes
  * CarMovement-> done, others to come
- Debugging of transpiler / runtime for Virtual functions in classes
- Cleaning of the Joystick code in raoz.js
- Other bugs.
- Re-organized the "New Applications" panel by project category and added new templates.
- Template for Unity. The instructions are under development...
- Added the Amiga Transpiler as an accessory. Works with Windows for the moment.
- Bug in transpiler: {@ on the line immediately after a procedure made the transpiler believe the procedure was "inline" which procedures cannot be
- Several remaining bugs in filesystem since last major changes, all should work now.
- load_save example now works
- Ported modifications done at Dusseldorf, direct mode to work
- Replacing lost code in raoz.js since last merge (caused console to crash)
- Updated UI-Designer code to match modifications in renderer (was crashing)
- Fixed problem in renderer that made icons of the UI Designer not appear
- Transpiler now includes bank #2 as default "3D" bank. Icons still supported, yet not as default (no-one uses them anyway)
- 3D now works in direct mode, all source-loading problems when using the console solved. Ouf!
- Aoz-Viewer now remember if Chrome debugger was opened or not the last time it was closed
- Bug in transpiler: Javascript just before End If messed-up the transpiled application,
  Cybloc no longer repeat sounds! :)
- Bug in previous version: Screen Open halted the application when ran in the browser 
- Major update/cleaning of the filesystem
- No more crashes
- Extensions non included in the code now work in direct mode
- Debugger: bob/sprite/actor information labels are now displayed at the position of the mouse
- Correction of Actor crash
- Removed Workshop, AOZDebugger and console folders from aoz/tools
- Work in progress, correction of ATOM file system
- Change "Object" to "Class" everywhere
- Implemented inline methods 
- Implementation of direct mode and console, doc to come soon
- New Instructions
  Console On Wait = True, Output = "debugger"
  ... open the console, if Wait halts the application if not it carries on running,
      If Output$ = "debugger", Print output will be directed to the console, otherwise the application display
  Console Off
  Log STRING$ : outputs the string in the Aoz console, even if it is hidden: text will be revealed when console is open
- Made the "Direct Mode" icon of the IDE work
- Added a "Console" icon to Aoz-Viewer application tool bar (on the top-right)
- Correction of several bugs in debugger and runtime
- Implementation of the new Object-Oriented syntax in the transpiler
  ... doc and video to come soon
- Implementation of new 3D Instructions and 3D Screens, under progress, doc to come.


### Release 1.0.0 Beta 16, Nov 01, 2022.
>>Update 28
===========


### Release 1.0.0 Beta 16, Oct 01, 2022.
>>Update 27
===========

* #FIXES
- Messages popup ("End of program...") has been update. Now, it's located at the bottom of screen. 
- Debugging of the debugger
  + restauration of the console
  + resizing of windows used to crash
  + variable popups did not appear

### Release 1.0.0 Beta 16...
>>Update 26
===========
- Not deployed

### Release 1.0.0 Beta 16, July 13, 2022...
>>Update 25
===========

* #FIXES
- Formatting bugs in the transpiler
- Problem in LoadAsset since last version
- Fix automatic include of assets in project-sdk
- Many bugs removed from transpiler handling of objects and methods
- Better indentation of the produced code in application.js
- Sound in application made certain UI Controls (like checkboxes) inactive. Was due
  to a problem in the splash screen.
- Bug 899 : Move Off did not stop all movements
- Internal non visible crash at end of application preventing the display of the 
  "end of application" dialog
- Bug 900: Math errors were not reported
- Bug #901: AOZ variables transpiler/parsing error. $ is allowed inside a variable name.
- Bug #897: Sprite Anim - Anim on restarts old animations
- Bug #882: For loop fails if Step is set using hex or a binary constant
- Bug #873: Part of f5 help windows Covered
- Bug #869: Some commands in F5 Help cause a corrupted heading.
- Correction of a bad bug in procedure calling since implementation of "multitasking" for 
  event procedures, making some programs like UI Designer exit without reason or crash.
- Bug in setPattern, sometimes the pattern was set to NaN, making the debugger crash
- UI Designer - Changed the way OnClick & OnChange properties are sanitized - this is now done when the AOZ code is generated
- Math functions with illegal parameters (example SQR( -2 ) ) could return NaN as a value
  now it generates an "Illegal function call" error.
- Actor Del instruction fixed.
- Major problem in procedure calling since last version 
- Work on Rainbows
- Some other corrections
- Direct Mode supported by transpiler in executable mode
- Direct Mode: a "Boom" (or any sound command) crashed
- Procedure TOTO[] used to crash
- Calling a procedure with empty square brakets (ex: TOTO[] ) reported a syntax error
- Runtime now reports an error when using a waiting instruction such as Wait, Wait Vbl
  or Load... any instruction that waits for something in a procedure called by an 
  event, such as click on a button etc.
- Calling a procedure with missing parameters, for example a string, used to crash at
  runtime. Example:
  Procedure TOTO[ A$ ]
    Print A$
  End Proc
  TOTO[] ... used to crash because A$ was undefined. Now all parameters of procedures
  are set to default value-> it works when they are not contained in the call.
- Transpiler used to still save a file called "end" after each transpilation

* #IDE
- !! New build from the Atom sources v1.60 !!
- The SDK Editor is activated when AOZ Editor is launched and gives access to system features to local programs, such as:
	- Read/write to local disks
	- Download a file from the web
	- Extracting an archive
	- Execute a Shell command
	- ...

- Separate icon for AOZIP package creation 
- Mini bar of command buttons in the AOZ Viewer window for :
	- Enable/disable full screen
	- Show/hide the JS Console
	- Pause/Restart the program
	- Screen orientation (todo)
	- Display the AOZ debugger (todo)
- Storage of the position and size of the Aoz Viewer window in user's configuration
  ensuring that each application (including accessories) is re-opened with the same 
  position and dimensions
- Recompileall ( CONTROL-SHIFT-F2 ) was constantly compiling the current application
- Recompiled all Accessories
- AOZ Drives folder has been removed from the Project panel
- AOZ Viewer is executed in a real floating window, which can be placed on another screen.
  While the program is running, the editor remains usable. Icons appear in the editor toolbar
  editor's toolbar, allowing to open the JS console of AOZ Viewer, restart the program and
  display the program in full screen.
- The UI Demo accessory is at the top of the list of accessories.
- PDF Manuals have been removed of the documentation (F6)
- Fixed CONTROL-SHIFT-F2, Transpiler was generating an error that was not detected.
- Result of transpilation now displayed in Javascript console (makes it easier to debug)
- CONTROL-SHIFT-F3, auto-indentation repaired!

* #RUNTIME
- Setting things up so that the SDKs (like editor-sdk) are global and do nto have to be copied
  in each executable, which would make code maintenance a nightmare.
- New folder in transpiler: transpiler/includes ... the transpiler, if it cannot find a file
  to include will also look at the root of this folder. I have put editor-sdk includes there.
  The transpiler trys the following in that order, for Include "myfile.aozinc"
  1 ./myfile.aozinc
  2 transpiler/includes/myfile.aozinc
  3 then explores a list of path stored in the manifest of the application at this location:
  manifest.compilation.includePaths in the order of the list...
- Moved the Javascript part of the SDK in this new folder in runtime: runtime/aozjs/editor-sdk 
- Implementation of tasks in aoz runtime. Event procedures can now last as long
  as necessary and will run along the main application, sharing the variables.
  It is a small multitasking system with Aoz Procedures. Number of running 
  procedures is unlimited.
  In practice: Wait, Wait Vbl, Set Font etc. now work in event procedures.
  
* #NEW INSTRUCTIONS / FUNCTIONS
- Updated the resize() function in the UI Instructions to use the AOZCanvas parent client dimensions 
  when its parent is not the document.body element.
- Added windowOffsetX & windowOffsetY variables that can be used to apply an offset to all the component positions.
  Used in the new UI Designer to correctly position the UI Components in the splitter panel.
- New Tag in transpiler: #loadAssetFile: "path"
  When encountering this tag, the transpiler stores the filename in a list that is 
  transmitted to the runtime. When the program runs, AFTER all is initialized (all modules and 
  extensions), the Load Asset command is ran for every item on the list, and the item is loaded
  with the index being it's filename. This allows all the editor-sdk libraries to work.
- Gradients - Define gradients and use them in any drawing or text as a fill image.
  Linear Gradient x1, y1, x2, y2, color$
  Conic Gradient x, y, angle, color$
  Radial Gradient x1, y1, r1, x2, y2, r2, color$
  Gradient Off
  Linear Border Gradient x1, y1, x2, y2, color$
  Conic Border Gradient x, y, angle, color$
  Radial Border Gradient x1, y1, r1, x2, y2, r2, color$
  Border Gradient Off
- Line Dash - AOZ version of Set Line. Define line style in pixel sizes, and animate with Line Dash Offset
  Line Dash dash1, space1, dash2, space2, dash3, space3, dash4, space4, dash5, space5
  Line Dash Offset offset
- Borders - Take full control of borders around images and text
  Border On
  Border Off
  Border Filter filter, value
  Border Filter Del
  Border First
  Border After
  Border Image Fill index, scale
  Border Ink number
  Border Pattern number
- Image Fill - use any image from the image bank as a fully scalable fill image in any drawing or text
  Image Fill index, scale
- Squircle / Filled Squircle - Instructions for drawing rectangles with rounded corners
  Squircle x1, y1 to x2, y2, radius, fill
  Squircle x1, y1, width, height, radius, fill
  Filled Squircle x1, y1 to x2, y2, radius
  Filled Squircle x1, y1, wdith, height, radius
- Paint - Flood fill an area of the screen. Works by tracing perimeter of area, and filling entire area.
  Paint x, y, color, mode
  Paint x, y, color to border
- Screen Blend - Assign a Screen Blend value to any screen to control the way it is drawn over other screens. Experimental - functionality may change in the future.
  Screen Blend number
  =Line Width   - returns the current Line Width
  =Rnd ( floor, ceiling )   - returns random number between floor and ceiling ( not including ceiling)
  =Rnd ( floor to ceiling )   - returns random number between floor and ceiling ( including ceiling)
- Text x, y, text$, tags, maxwidth   - added maxwidth parameter - condenses any text to fit within maxwidth
- Set Pattern number, scale   - added image fill functionality using negative image numbers for amos compatibility,  and also added scale so old patterns can be scaled up for AOZ
- UI SelectText - New instruction to select all text of a given TextBox component
- Added group$ param to the UI Show & UI Hide - also both instructions now work without specifying the id$ and group$ params
- UI Instructions - Fixed code that removes event handlers - if the event proc name was changed in an AOZ program, the previous event was not being removed correctly
- Rainbows working using gradients, fast.
  Set Rainbow: Amiga compatible instruction, with extra parameters
     alpha$: a string with the same syntax defining the alpha channel
     calculation$: 
     - "default"= color calculation Amiga compatible
     - "sine"= color calculation using sines
     - "cosine"= color calculation using cosine     
  Rainbow: Amiga compatible rainbows
  Rainbow Del: Amiga compatible instruction
  Linear Rainbow index, x, y, width, height, offset, angle#
  Radial Rainbow index, x, y, offset, angle#, apperture#, x1, y1, ray1, x2, y2, ray2
  Conic Rainbow index, x, y, offset, angle#, apperture#, x1, y1, ray1, x2, y2, ray2
  =Rainbow Gradient$( index, offset, height ) : return a string containing the color stops compatible
   with the Screen gradient instructions. Rainbow does not need to be displayed for this
   function to work.

### Release 1.0.0 Beta 15, June 4, 2022...
>>Update 24
===========

* #FIXES
- AOZIP bug on Mac OS
- AMOS file Importation is back!
- transpiler now handles node or exe run without change in the code
- debugging of one-time load of all extensions and modules
- re-implementation of the Transpiler as a forked node process, with
  proper communication channel via node messages between the IDE and
  the transpiler, with many advantages:
  Works on macOS
  MUCH faster (on my machine, 4 seconds won on each transpilation)
  Direct mode works (cannot work with command line transpiler)
  Direct mode instant response
- Correction of a bug on macOS with Del Bob when bob does not exist
- Correction of a bug in Load CSS in the Dom object, it was waiting
  20 seconds(!) after loading
- Ascii Man Reloaded still had the debugging "three.js" renderer
- Crashes in "DIR" command (and other file system commands) when 
  accessing the machine's drives under ATOM
- Crash when doing LIST ZONES in Direct Mode window
- Fixed the extra new lines when doing DIR in direct mode
- Crash when opening the debugger (making it not appear)
- Removed the FPS indicator in the direct mode console
- Fixed a bug in STOS animations, crash if an animation was ended and
  a new one was started in the other direction
- renderer.setBackgroundColor now set the canvas to transparent if color
  is undefined
- Wildcards in Global instruction. Authorised widlcards: * and ?
  * -> validates the name till the end
  ? -> authorise any character
  any other letter -> must match.
  Note as for the normal version of the instruction, global with a 
  wildcard only has an effect of variables defined BEFORE the instruction.

  Examples:
  Global "*" -> makes all variables global
  Global "to?o" -> makes toao, tobo ... tozo global
  Global "toto*" -> makes all variables starting with "toto" global
- Major bug in Object implementation, thje code of the object was not copied in code
- F5 help did not work anymore
- Since a few version, once you transpiled an application that needed
  for example three.js, three.js was copied in further transpilation even
  if not used.
- FPS display was forced when developperMode, making it appear in console 
  or instant F5 help if you were developping in developper mode
- Cleanup of F5 help
  * removed "exemple" popup menu (examples are no longer distributed)
  * removed the green flash when moving the mouse
  * fixed history arrows
  * fixed Search icon
  * fixed "Open Chapter", now works
  * Enlarged font used for title
- Correction of a transpiler crash (hang) when a parameter was not found or with incorrect name
- Correction of a bug in transpiler for parameters with type (any)
- Crash in runtime at the end of an application ran from the debugger
- Crash in debugger due to modifications in SetPattern
- New Function in the source_editor extension
  Editor NLines( index ) : returns the number of lines in the current text
  Editor Getline$( index, line ) : returns a line from the source
  Editor Findline( index, text, backward, caseSensitive ) : scan the source and returns the number of a the line containting the given text. If not found returns -1
  Editor Getword$( index, word, line, separators$ ) : cut a line in words and returns the given one
  Editor Getnwords( index, line, separators$ ) : returns the number of words in a givne line
- FSel$ function debugging. 
  * it was returning before the file selector was close
  * new parameter type$, can be either "save" or "load" to open a LOAD or SAVE
    file selector.
- New tag "forceSplash", to be used from the IDE. If TRUE the splashscreen will be displayed always.
  I have set this tag to True when you PUBLISH the application.
  Removed code from raoz.js that forced the splashScreen when running in the browser, now it 
  reads the manifest.bootScreen.active choice, overridded by the #splashScreen tag.
  If the application has sounds and is ran in the browser, the splashScreen will be displayed,
  unless the manifest.bootScreen.waitSounds boolean is False, in this case the user will have
  to start the Audio Context within a mouse event.
- Corrected the list of apps to be re-compiled with CONTROL-SHIFT-F2 (accessories were the old ones)
- Changed Set Line Width to Set Line in UI Designer and keyboard tester
    
* #NEW INSTRUCTIONS / FUNCTIONS
- NEW Sfxr extension
  Interface of the Sfxr library, synthetiser of game Sound Effect, with instructions:
  * Sfx Play			// play a sound effect without fuss
  * Sfx Create			// create a new sound effect
  * Sfx Del				// Delete a sound effect
  * Sfx Mutate			// Slightly change the sound effect
  * Sfx To 				// Assign a sound effect to a voice
  * Sfx Set				// Set a property of a sound effect
  * =Sfx Json$			// Returns the JSON definition of a sound effect
  * =Sfx Get			// Return the value of one of its properties
  * =Sfx Get$			// Return the value of one of its string properties
  Extension documentation completed as well.
  
- NEW Actor properties:
  - OnMouseClick$="<AOZ procedure name>"
  - OnMouseDblClick$="<AOZ procedure name>"
  - OnMouseDown$="<AOZ procedure name>"
  - OnMouseUp$="<AOZ procedure name>"
  - OnMouseEnter$="<AOZ procedure name>"
  - OnMouseOut$="<AOZ procedure name>"
  - OnKeyDown$="<AOZ procedure name>"
  - OnKeyUp$="<AOZ procedure name>"
  - Video$="<name of the video loaded with Load Asset>"
  - VideoPlay=True|False (True by default)
  - VideoLoop=True|False (False by default)
            
    

### Release 1.0.0 Beta 14, May 20, 2022
>>Update 23
===========
IMPORTANT! This release is the last Beta before the Official version of AOZ Studio.

* #FIXES
- "Recompile All" removed
- "Previous error" / "Next error" removed
- Updates for the Transpiler : 
  - Error messages and warnings are functional again
  - The Transpiler is completely independent from the editor.
  - The Transpiler now runs "on demand".
  - The Transpiler can be used from the command line.

- debugger only displays the collision mask of objects that are involved in collisions
- better collision mask for very large images
- Load Asset can now load font files in TTF, EOF, WOFF/WOFF2 formats
- remaining developpment tag in Baox and Crunchman Reloaded (#renderer:"three")
- Play Audio played frequencies instead of sound
- Bob Actor collisions not working
- Stop Audio did not work for sounds from the sample bank
- STOS animations and movements were jerky in Aoz Viewer and slowed down or
  unsynchronize themselves with time.
- Several invisible crashes in console that was making it very slow
- Disabled the console in the back when running an application in Aoz Viewer to make
  the application run smoother
- Further debugging of the new sound engine

- UI Designer: Fixed the code that sanitizes the OnClick, OnChange and Name (ID) component property values
- UI Designer: Reference to application.aoz.renderer.canvas no longer valid
- UI Designer: Added "Show Margins" option in the settings panel
- UI Designer: Updated adornment to show margins
- UI Designer: Added center vertical and horizonal buttons to adornment

- New sound engine using WebAudio directly, with a lot less overhead in terms of 
  size. Also faster, safer and more powerful. Will make examples in the next days.

- Replaced Boom, Shoot and Bell sounds with HD Version
- Wrong display in three.js renderer in Amiga mode
- Transpiler crash when using Bob, Sprite or Actor instructions without a "Images" folder
  in the project
- Full Screen/On Off images were not found (since transpiler is autonomous)
- Acceleration of the transpiler in command-line mode

- Aoz Drive automatic file copy cleaned, now handles jpg, jpeg and svg in the search
- Transpiler version checking
  Starting now, the transpiler saves a small file "transpiler-version" containing the version number
  of the transpiler used for the previous transpilation. In case of version change (like today), 
  all html folders will be deleted at the first transpilation with the new version.
  This to avoid future problems of files not being replaced/erased etc.
- application.js header, missing date in entry remark
- removed forced splash screen if sounds under Aoz Viewer

- New optional three.js renderer, 90% working.
  I have implemented the possibility to change the default renderer used to diplsy the application.
  You now have a tag #renderer, which values can be "canvas" (the default renderer used if not specified, 
  nothing changes in the applications it is the same renderer as today), and "three" that uses the engine.

  The transpiler detects that tag and include automatically the file renderer_canvas.js or renderer_three.js
  depending on the choice.

  Screens, Bobs and Sprites are fully supported, with rotations and scale. Screens are displayed as a 
  plane with their canvas as a texture, I have not noticed slow-downs on my machine. Bobs and Sprites are 
  individual 3D planes, flying in between and over the screens. As for the normal renderer, bobs are clipped
  to the screen they belong to.

  Skew is not supported with this renderer (cannot see how I can make it in a simple way).

  Filters are supported in SCREENS, yet not in Bobs and Sprites. To come.
  Shadows are not yet supported but will be.

  On my laptop, I can display many more bobs than with the canvas renderer in my Infinite Ball demo,
  I went up to 6000 balls with a display of 20 FPS which is much better than with the canvas renderer.

  Some very tricky application like Crunchman reloaded and a few Amiga apps still have display problems,
  I will fix them in between working on other tasks.

  Please report bugs in your app on Discord!

- Sound debugged!
  * Worked on the splash screen that MUST be present to enable sounds in the application with a click.
    Now, if you have sounds in your application, the splash screen is always displayed even if you
	run it under the Aoz Viewer.
  * Made sure that the timeout does not apply in the splash screen when you have to click
  * Displayed a small line when you have sound in the bottom of the splash screen
    "Click to continue"
  * Corrected a bug in the sound engine, in Aoz mode Volume parameter is from 0 to 1 and not from 
    0 to 100 (the general volume was set at 0.01-> sounds could not be heard)
- Developper Mode
  When in developper mode, the transpiler reloads all sources from runtime/run before transpilation
  allowing one to work on the runtime itself without having to quit and relaunch Aoz.
- Cursor Off by default in new screens in Aoz manifest
- Bug in Amiga mode: PRINT was not done at the correct position
- Transpiler: support of compound functions with wildcard keywords
- New MBot extension
- Continuation of the work on the companion server

### Release 1.0.0 Beta 13, April 23, 2022...
>>Update 22
===========

* #FIXES
- When an AOZ or AOZIP file is opened from the file explorer, the folder is added to the project panel. NOTE! Files directly on the Desktop crashs the AOZ erditor. 
- Fix in the new path of the console.aoz application. Path was wrong, direct mode
  did not work
- Fixed Aoz Store automatic file copy not working since Transpiler was independant
- Made the automatic file addition work again
- Fix fonts bug on the code editor
- Cleaning and renaming of the fonts.The font folder is now 12MB instead of 90. Fonts are renamed with shortcuts	of the previous name to keep their size reasonable.
- Moving the apps of the editor (new application panel, aoz link, ui designer...) into the "tools' folder 
- The STOP/PLAY button did not work on AOZ Viewer
- Limit Bob now copes with undefined X or Y and only restricts the bobs in the 
  required direction.
- Transpiler insterface in the IDE now outputs the error and warnings in the ATOM
  debugger console
- RECOMPILE-ALL (Control-Shift-F2) now stores all the possible errors to eventually
  display them at the end of a un-succesfull recompilation
- RECOMPILE ALL had errors on Joystick tester and Keyboard tester. 
  joystick.aoz and keyboard.aoz renamed to main.aoz, they did not compile in recompileall. 
  You cannot have a aoz application with a name different that "main.aoz" 
  without a manifest (can be changed later).
- Correction of a bug since last version, On Goto / Gosub with list of numbers
  reported "Undefined Label"
- Crash in renderer when sprites were used
- Transpiler initialization: if an error occurs during the transpiler initialization
  the error is now reported in Aoz error window
- BUG 892 fixed (Bob / Sprite Move not working)
- BUG 887 fixed (Bob limit not working)
- BUG 879 fixed (gosub 10 * X)
- Restoration of the test of hotspot for limit bob
- Text Window font individual drawing: I put this feature back as it had disappeared.
Basically I draw now each character individually at the correct position. The display
of the text window is much clearer in all resolutions as it is not resized/copied 
any more.
 
* #IDE
- Add a Cancel button on the "BUILD & RUN" popup to cancel the Transpilation process.
- New syntax in instruction definition, CHANGEABLE tokens.
	Instruction Robot (action$) (qualifier$), param1$ ... other parameters
	{
		console.log( %action$, %qualifier$ )
	}
	End Instruction
	Rules: 
	* use brakets to define a changeable instruction name
	* only letters in names, must end by $
	* first parameter of such instruction MUST be a string (or no parameter)
	Allow any instruction starting with "robot" in two or three words, like
	Robot Stop "mBot"
	Robot Move Fast "mBot", 10
	Robot Speak Hight "Hello world"
- Icon info on the status bar when the transpiler working
- Modification of communication channel between transpiler and IDE to cope with 
  slow machines.
- Rewrite of the communication between the transpiler and the IDE to ensure
no testing loop remains when compiling and preventing the apparition of the
infamous "ATOM is not responding" message.

* #NEW INSTRUCTIONS / FUNCTIONS
- New instruction Sync Display, alias of Wait Vbl for better understanding.

### Release 1.0.0 Beta 13, March 16, 2022
>>Update 21
=======

* #FIXES
- Problem with animations 


### Release 1.0.0 Beta 13, March 15, 2022...
>>Update 20
=======

* #FIXES
- AOZ Link crash
- Problem with the AOZ Drive resources importation
- Patch to fix the speed issue (Thanks Dave B. :) )

* #IDE
- Updater updated :)

### Release 1.0.0 Beta 12, March 3, 2022
>>Update 19
=======

* #FIXES
- #waiting instructions
- Bob/Actor Collisions
- Actor Del + number
- Font error
- Debugger integration after F2
- Fonts loading
- No error when a procedure not exists
- Error reported the number of the line minus 1
- #transpile tag changed to #rebuild
- #IDETRANSPILEALL was not working
- tag interpretation
- #transpile never forced the transpilation of extensions
- crash when transpiling Amiga applications with fonts
- only include Google fonts in woff and Woff2 formats
- X Screen and Y Screen returned wrong results
- Bug 824, debugger rulers incorrect in Amiga mode
- Bug 874, Sprite Anim did not start without a Move on 
- Bug 859, True False not displayed properly in the debugger
- Bug 860, escape / return in IDE
- Bug 865, sound crash with voice 0 in Amiga mode
- Bug 839, AMAL program from manual did not work in Aoz.
- BUG: Input did not work in the debugger.
- BUG: Save Text used to crash
- Bug 878, Sprite move - Wrong Movement
- bug with Include
- crash when values of a tag were out of scope
- Bug 868,  wrong direction of mouse wheel scrollings
- Bug 876, move x / move y problem
- Bug 877, Move On problem
- Bug 878, Anim loop always
- Bug 865, one pixel image generate no collision
- Bug 861, Print Text Style crash
- bug in Voice$ Function.
- Documentation and examples for Text Windows.
- Text Styles command. Wrong name was used to call it.
- transpiler now reports an error when doing a Gosub LABEL and label is a procedure.
- Further correction of the previous bug, problems in expressions with procedures returning values.
- Any call of a procedure returning a value

* #IDE
- IMPORTANT! The "My AOZ Applications" folder has been removed to the root of the installation folder. Please, copy your projects of the old "My AOZ Applications" folder ( in your "Documents" folder) to the new.
- Transpiler error/warning doesn't show the good script on the error line.
- Horizontal Scrollbar in the code editor and treeview was hidden.   
- Restoration of application from Aoz Drive to Documents/My AOZ Applications
  as it used to be.
- All accessories work
- New! Clipboard object, allowing you to copy text to the machine's clipboard.
- Editor: implementation of the same keyboard shortcuts route between the IDE, the 
direct-mode and the application, as in AMOS. 
  Editor <ESCAPE> -> Direct mode <ESCAPE> -> Editor
  F2 <CONTROL-C> <ESCAPE> -> Direct mode
  F2 <CONTROL-C> <RETURN> -> Editor
- Transpiler can now output a log file when transpiling.
- debugger: the variable information popup did not appear for arrays
- debugger: local variables are now displayed in reverse order of the pile
							
* #RUNTIME
- Verification/restoration of the optimization of bob/sprite rendering.
- Rewrite of the text window Google font drawing, character by character
- Variable and object name checking
- Slight acceleration of the renderer for bobs
- FPS indicator now displayed properly 
- Set Alpha now works. Syntax changed to Set Alpha COLOR_INDEX, ALPHA#
- Procedures, Instructions, Functions, Objects, Methods NOT closed caused the transpiler 
- Cleaning of "recompile all".
- Changed the path to the accessories
- Correction of orthograph mistake in console
- No more double error messages in the console
- Transpiler welcome message (console) updated copyright to 2019-2022
- In developper mode, the verbosity of the transpiler is now automatically set to VERBOSE_DEV1
- Updated the accessories link with the proper path (links were broken)
- Removed the flashing line overlayed on the app canvas
- Added mainloop-min.js.map to the runtime/run folder
- Replaced the old accessories with the new ones
- Rewrite of the the loop control
- BIG cleaning of the fonts system.
- New property in the manifest fonts.include
- Roboto bug resolved!
- Solved all changes in files not detected by the transpiler problems
- Re-write of the transpiler file I/O system
- Accurate detection of modified files
- New logs in much better format with colors in console and various levels of verbosity
- Re-write of runtime loop speed stabilization system
- set string base index in all manifests to one

* #INSTRUCTIONS AND FUNCTIONS
- Paint: Fill a graphic zone with a color.
- New Function:    Text Height - Returns height of current graphical font on the current screen.
- New Instruction: Centre Text text$, how - Centers graphical text on the current scren using the current font and size.  Allows centering horizontally and/or vertically (using the how parameter).
- New Instruction: Text (with NO parameters) - Works like Print with no parameters, but for graphical text.

* #DOCUMENTATION
- Update the documentation
- Re-order the chapters

* #NEW ACCESSORIES/ DEMOS / GAMES / TUTORIALS
- ASCII Unicode Viewer
- UI Demo by Phil Bell (Example of using of the UI Instructions)
- Player Demo by Phil Bell (Example of using of the Leader Board Instructions)

### Release 1.0.0 Beta 11, November 17, 2021...
>>Update 18
=======

* #FIXES
- Bug: any call of a procedure returning a value (inside of an expression) created a shift in the transpiler table messing the If / Then / Loops statements located after it.
- Actor verticales limits
- Key Event from the AOZ Runtime locked the keyboard for the browser shortcuts and the input fields
- Now, the "Angle", "StartAngle" and "EndAngle" actor's properties must be given in degrees.
- Bug fix #857 - Various Print formatting bugs fixed, Shade, Italic etc.
- Optimize the Actor animations and collisions
- Bug Fix #121 and several other bugs in the Limit Bob instruction. Now works solely by resricting/relocating bob's position and not by clipping as it did before.
- Errors reports with parameters (like Illegal Function Call), used to display %1 when the value of the parameter was zero
- Transpiler no longer duplicates the original line of code in the transpiled Javascript if several instructions lay on the same line
- Exit If used to screw-up If / End If in the loop where it was located
- F5 Help restored to working conditions.
- Set Wave / Play Note: was playing sounds from the sound bank instead of the new created sounds
- Bug in Exit: in some circumstances, Exit made For / Next loops loop to the second instruction of the list.
- Fix the sprite animation with Actor.
- Bug: crash when ran in IDE for If Then without Else (Lo..al bug)
- Play Audio can to play the sounds from bank 
- Refresh frequency handling restored to previous version until bug is found!
- Bell now play fine even after setting a voice to waves
- Bell frequency parameter was not supported
- Bug Fix #847 - BSave saving incorrect number of bytes
- Sounds: Play nowe stops the sound at the end
- Sounds: new default envelope for Play
- Sounds: "Volume" instruction reported Illegal Function Call in Amiga mode
- Sounds: "Voice" instruction debugged
- Bug #846 - Bob index,number - not using gr coords - fixed
- Bug #845 - Play Audio - Fixed along with 21 other similar bugs in easy.aoz
- Bug #843 - Paste Bob rotation issue - Fixed. Rotation, Scale, and Alpha used in Paste Bob were being applied to current screen after use.
- Amiga sounds emulation corrected. Now each voice only plays one sample at a time, as on the Amiga In "aoz" mode the sound engine allows by default 32 sounds in the same voice, these sounds can be the same sample playing. This setting is available in the manifest, "sounds" section, "soundPoolSize", set to 1 for Amiga and 32 by default for aoz manifests.
- Volume instruction debugged, pay attention to the fact that the volume is based on 64
  for Amiga emulation and 1 for aoz manifest.
- Updated demo games and applications to cope with new sound engine:
  - Fireworks: changed "Volume 32" to "Volume 64"
  - Ascii Man reloaded: Volume
  - Crunchman reloaded: changed "Sam Play" to "Play Audio", the sounds being loaded with Load Asset.
  - Cyball: changed "Sam Play" to "Play Audio", the sounds being loaded with Load Asset.
  - Cybloc: changed "Sam Play" to "Play Audio", the sounds being loaded with Load Asset.
- Speech Demo: resized the text display window
- Unreported bug fixes in screens.js
  - Box function now pixel accurate with all syntax variations and parameter possibilities.
  - Clip function now pixel accurate with all syntax variations and parameter possibilities.
- Crash of application with no sounds due to reference to p5.js
- Fade instruction: used to report Syntax Error when transpiling
- Several rarely used Amiga Instructions like Sprite Priority or Close Editor implemented
- Non implemented Amiga instruction now compile with no effect on execution
- Autoback used to report an error if Double Buffer was not initialized
-  #833: feedback asked
-  #831: rejected
-  #830: resolved
-  #825: resolved
-  #822: feedback asked
-  #813: assigned to Baptiste
-  #760: resolved
-  #754: feedback asked
-  #737: resolved
-  #267: closed
-  #355: resolved
-  #827: feedback asked
-  #660: resolved
-  #663: resolved
-  #735: resolved
-  #358: resolved
- Assets: Checks if an asset has already been loaded before loading it.
- Actor: Fix the Spritesheet Animation
- AOZ Viewer: title now shows the current debugger status
- Debugger: Actor animations are now paused when debugger is in Pause
- Debugger: windows are now linked vertically
- Debugger: you can now click on the title bar of a window to minimize/unminimize it
- Debugger: window state (minimized and position) is remembered between sessions
- Debugger: new options in settings panel: "Restore window positions at startup" (checkbox) and "Reset window positions" (button)
- Debugger: bad sizing of the font in settings panel
- Debugger: cursor did not appear when you activated the Source or Console window
- Debugger: removal of the keyboard shortcuts to close/open a window (use minimize with the mouse)
- Debugger: crash when entering commands in the console window
- UI Designer: Updated the z-index to avoid conflicts with user css classes
- UI Designer: Added missing text box type (password) to available options in the properties
- Load Text: correction of crash since my last push
- Bug #821 resolved: Load Text, you can now load texts into arrays
- Debugger: correction of the display of bobs masks and labels on screens with variable resolutions
- Debugger: Escape did not remove all UI element from display
- Debugger: shortcut keys were still active with debugger hidden. Now only "Escape" remains active.
- Debugger: Debug On instruction has a new parameter "Labels=True / False" to indicate whether or not to display the bob/sprites information labels.
- Sprite Col instruction: using Sprite Col made the application crash
- Say instruction: using Say with a second parameter of 0 made the application end
- Collisions: the collision mask was missing one pixel on the right and bottom for smaller objects
- Bug #720: Max instruction provoked a type mismatch error with strings
- Debugger: buttons that cannot be used are now hidden, with a clear distinction between "step" and "play" mode
- Debugger: new clearer text for button popups
- Debugger: new positionning of the "Settings" button, in the bottom of the display
- Debugger: the debugger screen no longer disappears when you click "Restart application", and the debugger goes into step mode on the very first line of the restarted app.
- Bug #772: resolved
- Bug #826: resolved
- Bug #719: resolved
- Bug #825: resolved
- Bug #782: rejected
- UI Cls: Fixed issue where not all UI components were being deleted
- Fixed : Get Angle was returning angles from 0 to -180 clockwise from positive x-axis and 0 to 180 counterclockwise from positive x-axis. It now returns 0 to 360 degrees clockwise from positive x-axis.
- Fixed : Various graphics errors caused by system using float coordinates resulting in missing lines or pixels.
 
* #IDE
- Button Previous and Next added on the documentation (F6)
- improved search from the editor's search bar
- Add the UI Image component in the UI Designer
- New keyboard shortcut : ctrl+shift+F2 = Recompile All (in developer mode only)
- New AOZ Link Panel
- Partial Translation EN/FR/DE in the editor
- A folder selection field has been added in the New AOZ project panel.
- Toolbar icons can be grouped.
- Some icons in the toolbar have changed their design
- #803 Play Audio - resolved
- #810 Del Asset - resolved
- #826 List Bank - resolved
  
* #RUNTIME
- Now if your AOZ program has a "aoz" or "pc" type manifest, the default angle representation is in degrees. You can to set the default representation in radians with the "Radians" statement.  
- Splash Screen is disactivated by default when the AOZ Program is launched in the AOZ Viewer. It will be always displayed under the web browser or the webview, as long as a license has not been assigned to the user.
- New property in manifest.display: "refreshRate" that indicate the preferred refresh rate of the game. Aoz will compensate for faster displays by skipping frames, all manifests updated.
- Runtime speed is now stabilized with  higher precision time than before (perfromance timers).
- New tag #refreshRate: FPS, in which you iondicate the speed of the application. Calculation is not yet per
- Little change in "fast" compilation mode ensuring fewer browser freeze
- NEW SOUND ENGINE using p5.js! Instructions Implemented:

* #INSTRUCTIONS AND FUNCTIONS
- New Instruction - Shadow On - Turn on Text Shadow for 'Printed' text - use in conjuction with Text Shadow
- New Instruction - Shadow Off - Turn off Text Shadow for 'Printed' tex
- New Instruction - Outline On - Turn on Outline Font for 'Printed' text
- New Instruction - Outline Off - Turn off Outline Font for 'Printed' text
- New Optional Parameter - Shade On **intensity** - Apply an percentage intensity value to the current pen colour eg. 10 = 10% (dark), 90 = 90% (only slightly darker), 150 = 150% (50% brighter)
- New Function for Player : Player Engine$() - Returns the name of the engine that is in use/was initialised
- New Instructions for UI: UI Image (editable from UI Designer), UI Focus id$ (Sets the input focus to a given componentUI), UI Enable and UI Disable.
- Add Group$ property in the Actor instruction.
- = Set Interval( delay, procName$ ): Call a AOZ procedure all the <delay> milliseconds, and returns its ID
- Clean Interval id: Delete a process setted with the Set Interval function. The AOZ procedure associated will not called any more.
- = Image DataURL$( <index> ). Return a data URI containing a representation of an image in the Images bank.
- New Syntax for Bsave
  * BSave path$, bank number  // Save the binary contents of memory bank
- Implemented instruction: Sam Bank
- Improved Point function with new syntax
 * Point RGB x, y  -  returns 24 bit RGB colour value of the pixel at x,y coordinates
 * Point RGBA x, y  -  returns 32 bit RGBA colour value of the pixel at x,y coordinates
- Music INDEX / PATH
- Music Stop
- Music Off
- Play NOTE/NOTE$, Voice
- Play Off VOICE
- Voice INDEX
- Voice On INDEX
- Voice Off INDEX
- Set Wave INDEX, STRING$ / ARRAY#()
- Wave NUMBER To VOICE
- Del Wave INDEX
- Noise NUMBER To VOICE, TYPE$
- Sample NUMBER to VOICE
- Set Envel INDEX, NUMBER To DURATION, VOLUME
- =VuMeter( VOICE )
- Filter VOICE, TYPE$, delay#, decayRate#, reverse, frequency, resonance
  with TYPE$ = 	'reverb',	'lowpass',	'highpass',	'bandpass',	'lowshelf',	'highshelf',	'peaking',	'notch',	'allpass',	'distort'
- Filter Off VOICE
- Filter On VOICE
- Reverb VOICE, delay#, decayRate#
- Reverb Off VOICE
- Reverb On VOICE
- Distortion VOICE, delay#, decayRate#
- Distortion Off VOICE
- Distortion On VOICE 
- UI Designer: Added class picker function
- UI HideTooltip: New instruction to programmactically hide a button tooltip  
- New function: Odd (expression) - Returns true if variable or expression is an odd number.
- New function: Even (expression) - Returns true if variable or expression is an even number.
- New function: RGBA (red,green,blue,alpha) - Returns RGBA value.
- New Instruction - Curve with following syntaxes
  - Curve To cx1, cy1, cx2, cy2, radius  -  Arc To Line cx1,cy1,cx2,cy2 (the arc will join the line in the direction it is drawn)
  - Curve To x, y, cx, cy  -  Quadratic Curve To x,y with control point cx,cy
  - Curve To x, y, cx1, cy1, cx2, cy2  -  Bezier Curve To x,y through control points
  - Curve x, y, cx1, cy1, cx2, cy2, radius  -  Arc from x, y to line cx1,cy1, cx2, cy2
  - Curve x1, y1, cx, cy, x2, y2  -  Quadratic Curve from x1,y1 to x2,y2 via control point cx,cy
  - Curve x1, y1, cx1, cy1, cx2, cy2, x2, y2  -  Bezier Curve from x1,y1 to x2,y2 via control points cx1,cy1 and cx2,cy2
  
* #DOCUMENTATION
- Update of the documentation data model. Old way keeps available
- Update the documentation
- Re-order the chapters

--------------------------------------------------------------
### Release 1.0.0 Beta 10, September 19, 2021
>>Update 16

- Debugger: crash when displaying Bobs and Sprite in Amiga mode
- Roboto font: modified, some of the woof files did not load
- Transpiler: automatic file detection in the AOZ Drive did not check for the whole file name
- Runtime: cannot load font now reports a proper error message
- Crunchman reloaded: Added missing images in icon bank
- Crunchman reloaded: added Wait Vbl to main loop
- Hangman Tutorial 6: recentered the title image, removed #manifest:"pc"
- Hangman Tutorial 4: missing resources/images folder
- Crunchman reloaded: conversion of the manifest to real "amiga", recentering of the title screen, cleaning of base 0/1 conflicts in Mid$ in the app
- Compiler: bad bug in Timer that made all loops located after it crash when running in AOZViewer
- Debugger: crash when displaying pile
- Debugger: crash due to Dave's modification in draw
- Debugger: possible crash when images are not completely loaded
- Debugger: "Debug" changed back to "Debug On" ...
- "Dual Playfield" instruction did not work
- "Default" was only partly implemented
- "AMAL Off" with no parameters now completely removes all AMAL routines from memory
- Runtime: crash in Amiga mode as soon as you print something.
- The runtime now makes sure everything is loaded before starting, removing crashes like
  the crash if Curs Pen is used at the very beginning of the application.
- Debugger: crash when drawing bob or sprite collision masks
- Debugger: bob and sprite info labels now displayed correctly even if application is not 1920x1080
- Debugger: clean up of events and problems if you did F8/F9/F10 too quickly
- Debugger: crashed on Break If / Watch or Log
- Debugger: crashed if a Break/Watch/Break If instruction was at the start (debugger font was not loaded)
- Debugger: "Settings" button is now correctly positionned on the top-right when the windows are set on the left
- Flash On / Flash Off now start or stop the flashing of the cursor
- Bug 760: affected to BB
- Bug 766: affected to DaveB
- Bug 777: resolved
- Bug 790: resolved
- Bug 794: resolved
- Bug 806: resolved
- Bug 807: resolved
- Bug 808: resolved
- Bug 815: resolved
- Bug 816: resolved
- Bug 817: resolved
- Transpiler: calculation of source indentation.
- aoz-studio-view: new function indentCurrentSource, to be completed.
- Debugger, full support of Amiga mode
- Console, inserting text in the middle of a line positionned the cursor at the end of the line
- Console, support of HOME and END to move the cursor to the beginning or end of the current line
- Debugger, Source and Console crashed when moved (only since last version)
- Debugger, correction of several bugs in VariablePopupWindows when clicking
- Debugger, window border now change color when activated
- Debugger, better color for the next instruction display in source code window
- Debugger, implementation of commands in the console window when running under the Aoz Viewer
- The Panel of "the messages console" doesn't hide the code editor any more. The code editor is resized in height.
- The status bar is always displayed at bottom of screen.
- Change of "Debug On" instruction to "Debug"
- "Debug" instruction (previously Debug On) used to put the debugger in Step mode. It now leaves the application running.
- Implemented a protection so that you cannot publish an application that contains debugging information
  in both the transpiler and aoz-studio-view
- Application are now always compiled with debugging info when launched in the Aoz viewer
- Implementation of the "Debugger" button in Aoz Viewer: one click shows the debugger with the application still running,
  allowing you to see the chnage in the value and graphic elements in real time. You can press F8 or click on "Step" and the application
  will then freeze and the debugger go into "Step by step" mode.
  Another click on the "Debugging" button hides the debugger and removes it from memory, restoring the speed of the application.
- The debugger now displays fine in other application resultion thant 1920x1080 (example, Infinite Balls is 1280x720 ;)
  Amiga application debugging still to be done.
- Project Template: Now the PC and Mobile Project have the same template.
- UI
  - Debugging of all functions with 'undefined': they used to detect as "defined"
    parameter that were not defined
  - new function "addElement" that will call the proper "add" function depending on args.type
  - new function "setPosition" that set the position of an element
- On Error Goto crash since ages, corrected!
- X Graphic and Y Graphic reported NaN if no parameter was given.
  Now they use the position of the cursor instead.
- Implementation of "debugging info" functions for each block of code in application.js
  by the transpiler allowing the debugger to expand and provide real help and control
  over the code. System is to be expandable with "debugger extensions"
  at term with AI to help.
- Crash in transpiler error messages for Until without Repeat, Loop without Do and Wend without While
- Correction of a bug in transpiler creati8ng syntax errors on some instruction (new since last week)
- Correction of bugs in Source Editor extension
- Correction of bugs in Slider extension
- Debugger
  - new colors, matching Aoz IDE colors
  - various debugging, popups, sliders, resizing of windows
  - improvement of bob and sprite labels (display index)
  - better management of windows Z priority
  - transfer of all the in-code strings into the manifest, allowing translations
  - New Setting icon and panel to define the various component of the debugger display
  - New Press NUMPAD+ / NUMPAD- will increase/decrease the debugger alpha
  - New Press NUMBER ENTER will alternate the debugger windows on the left or on the right
  - Cleanup of Watch window display
  - Perfect integration of STEP / FRAME modes
  - Debugging of Variable Popup info window
  - Cleaning of slider problems
  - Cleaning of display of Watch and Console window
  - New "PILE" window, showing the pile of procedure calls
  - Better sizing of debugger buttons (they used to be very small)
  - New STEP INTO button (works)
  - New STEP OVER button (still to do)
  - Activation / Deactivation of the buttons depending on the mode
  - Cleaning of the popup windows, now they disappear without crashing
  - implementation of step by step in the code with F8
  - Integration of the two debugger mode: step / play-pause
  - cleaning of the windowing system
  - management of window Z priority
  - integration of the Source Code, showing the applicaiton's source
  - cleaning of the variable popup hints that were not closing properly

- Alternative 'Filled' syntax to all of the above eg. Filled Star x, y, radius1, radius2, sides, rotation
- Alias syntax to Disc - Filled Circle x, y, radius

- Unreported bug fixed in circle and disc where if radius was an expression containing Rnd, ellipses were drawn.
- Bug #812 Fixed - Alpha going negative near zero due to floating point error
Some code optimisation resulting in an average 5% speed increase when drawing shapes/lines.
- Optimization of the TextWindows drawing / backup process
- Debugger
  - debugging of windowing system, windows do not interfere anymore
  - window background truns to color when the mouse is over it

- Collision detection: correction of a crash at start of applications
- The parameters of an Instruction, when this one was written in Basic, where not properly transmitted
  - when display of all bobx or sprite is NOT activated, the debugger now show info on the object under the mouse
  - you can now change the value of variables by clicking on them
    that return TRUE if the coordinates lays in the graphical object (bob taken from the current)
  - variable window: display of long string in popup
  - display of arrays
  - buttons disappear when the mouse is over a window
  - popup display hex value for number variables
  - popup displays long strings, with slider
  - work in progress.
- raoz.js, a new function "formatUsing", extracted from the Print Using command is available
  to programmers: aoz.formatUsing( format, [ list of values ] )
  It returns a Javascript string formatted as Print Using would do.
  (using that for array display in the debugger).
- Debugging of collision detection
  - debugging of the generation of the polygons, they now are perfect
  - was not working when the same image was used with different scales in different objects (bobs, sprites)
  - new system of precision in the manifest indicating the number of pixels after which images are cut in rectangles for complex shapes
  - new method of collision detection in the manifest: "hull" that will only draw the hull around the image without attempting to cut it in rectangles.
    The Hull method will not work for concave images and is destined to be used with a physic engine when implemented.
- improvement of collision detection shape recognition to cope with images containing
  blank areas in the middle and non-convex shapes.
- re-writing of the debugger's window management system
- implementation of line hilight under the mouse in the debugger variables window
- Correction of a bug in = X Hard ... it was returning garbage.
- New system of collision detection, vector based and fast. It offers three detection modes:
  "fine", "circle" and "box". If circle, the ray of the test circle is the average between the
  width and the height of the object. The system (should ;) cope with sprites and bobs, rotated or not.
  If box and the object is rotated, the box is ALSO rotated offering better accuracy than the previous version.
  Skewing objects is not supported (extra load for the engine) and the collisions are detected for
  the original (non skewed) shape.

- Modifications in the manifest to cope with the new system of collisions,
  the section "Sprite and Bobs" being replaced with "Collisions"
 	// Collisions
	collisions:
	{
		method: "fine"					// Pixel-precision of the collisions, "box", "circle", "fine"
		precision: 75					  // for hull, will sample the bitmap
		alphaThreshold: 1				// Level of alpha for which a pixel is considered 'not transparent' and will generate a collision ( 0 being transparent and 255 being opaque)
	}
  All manifest in the project have been updated to "fine".
  If you have an application with a previous version of the manifest, it will not crash as I check and poke
  these value if they are not defined when the application starts, but it is recommended that you update the
  manifest by replacing the "sprites and Bobs" section by the one above.

- Modification of the calculation of the number of columns in the text window when creating a screen.
  Aoz now calculates the number of columns based on the updated height of the font. The only value
  that is kept from the manifest is the original geometry of the font (ratio width / height) and it is
  used for the calculation of the number of columns.
  Screen Open accepts on extra parameter, "lines". Defaut value is taken from the manifest, but you can specify
  your own value. Aoz now copes with extreme high number of lines, example 200 or 500, with an extra-small font,
  but it works!
- Due to approximation in calculations, the width of the font in text windows was not exactly matching
  the necessary width for pixel perfect positionment of the characters. Asa result, some characters
  were missing at end of line. This is corrected, an extra internal rendering stage makes sure the
  width is correct.
- Bug #729: Amiga erratic font height problem now fixed.
- Mouse Events on Actor
- Bug 801 fixed, number of lines in default window was incorrect
- Bug 797: fixed
- Bug 796: fixed
- Bug 795: fixed
- Bug 794: fixed
- Bug 788: fixed
- Bug 787: fixed
- Bug 780: all fixed
- =Disc Info$ used to crash with "application:" drive
- =Disc Info$ used to crash with ATOM filesystem
- =Dfree now works for application drive (returns the free space in browser local data space)
- =Dfree now works for ATOM filesystem
- Bug 773: fixed
- Bug 772: fixed
- "Move X" instruction made the application crash at runtime
- Bug 765: fixed
- Screen To Front and Screen To Back did not work anymore.
- Screen Clone now creates the extra screen in FRONT of the cloned scvreen, as in AMOS
- Bug 756: fixed
- Bug 752: fixed
- Bug 750: fixed
- Bug 749: fixed
- Bug 748: fixed
- Bug 746: fixed
- Bug 744: fixed
- Bug 743: fixed
- Bug 742: fixed
- Bug 739: fixed
- Bug 738: fixed
- The version of Cybal in the repository was missing one image and crashed with "Image not defined" error.
  Also corrected a problem of remaining red colour in some of the images.
- Added node module "check-disk-space" to aoz-studio package (to make DFree work)
- All examples up to i_68 tested and working
- AMAL now works
- Extension of the "Channel" instruction, you can now use Offset, Skew, Shadow as type of channel for all
  graphical objects... Example: Channel 1 To Bob Skew 1
- Debugging of BLoad
- "Dfree" used to crash
- Screen Open in Amiga mode debugged
- TextWindows in Amiga mode now use the proper AMOS colors at start
- Updated examples:
i_30 to i_42
- BUG: Screen Clone did not open the correct screen and later provoked "Screen not opened" errors
- BUG: Put Key did not work
- Updated examples:
i-11, i_12, i_13, i_14, i_15, i_18, i_18, i_19, i_20
- Correction of regression in aoz-config, the path to the tutorial graphics were not present in the config file.
Now also, an application in runtime can also access some of the directories of Aoz through simple drive names:
games: -> points to the AOZ Studio/app/AOZ Store/Games folder
demos: -> points to the AOZ Studio/app/AOZ Store/Demos folder
tutorials: -> points to the AOZ Studio/app/AOZ Store/Tutorials folder
utilities and others: -> points to the AOZ Studio/app/AOZ Store/Utilities and Others folder
documentation: -> points to the AOZ Studio/app/Manuals folder
- BUG: LOAD for memory banks crashed
- BUG: RESERVE a image bank crashed
- i_10: replace AMOS with AOZ
- i_9: added #displayWidth and #displayHeight tags
- Problem corrected: problems with the number of lines and columns in text windows.

Now the system works exactly as in AMOS.

  - when you create a screen with Screen Open, you can now ONLY specify the number of lines of the associated text window, I have removed the "column" parameter which made no sense.
  The default window (#0) will match the number of lines, and the number of columns will be calculated from the size of the font used to have this number of lines.
  With default manifest value, it does not change anything... but now, it works when you do for example: Screen Open 1, 1920, 1080, lines = 10
  LOCATE will _always_ work and there cannot be any displacement between the characters and their actual text coordinates...
  - when you create a new text window with Wind Open, it will use the font defined for window #0,the window that was created when creating the screen. The position of the window will now match exactly the one of the background window, font will be the same, as in AMOS.

Happy to have finally solved this problem that we had in the product since forever.

- updated CSV / ASCII token exporter to remove and list duplicates
- BUG-> INPUT ""; A$ used to mess display
- i_3 tutorial-> display bug corrected
- Icon Base-> was named "Free" in the doc

* #RUNTIME
- NEW! Debugger extension. In this version, 3 instructions.
	Debug On
	  console = True,
	  variables = True,
	  bobs = False,
	  sprites = False,
	  grid = False,
	  gridWidth = 32,
	  gridHeight = 32,
	  rulers = True,
	  screens = True,
	  collisions = False,
	  alpha# = 0.66
	  ... starts the debugger and halt the application. the parameters listed here reflect rthe defaulot values and
	  ar eused to display or not some sections of the debugger. For examples "variables" if set to true will force the display
	  of the application's variable window. Set it to false and it will not appear when the debugger shows.
	Debug Off
	  ... close the debugger if it was open
	Console EXPRESSION$
	  ... prints a text to the debugger console if the debugger is open.

	THINGS TO KNOW ABOUT THE DEBUGGER. Not a doc yet.
	- interface is obvious
	- use keyboard shortcuts to show/hide sections of the debugger.
	  - B -> show/hide bob information
	  - S -> show/hide sprite information
	  - C -> show/hide console
	  - C -> show/hide variables
	  - R -> show/hide ruler
	  - G -> show/hide grid

	Please note that the debugger in this version does not yet display array or objects.

* #DOCUMENTATION
- Updated with the new API
- Sorting the chapters of the documentation in the Tree

* #NEW DEMOS / GAMES / TUTORIALS
- UI Demo by Phil Bell (Example of using of the UI Instructions)
- Player Demo by Phil Bell (Example of using of the Leader Board Instructions)

* #NEW INSTRUCTIONS/FUNCTIONS
- New instruction: Save Variables PATH$, <LIST OF VARIABLES> saves the value of variables or arrays into a file
- New instruction: Load Variables PATH$ .. load the content of variables or arrays previously saved with Save Variables
- New instructions in the Source Editor extension:
  * Console Print INDEX, TEXT$ : output text to the console
  * Console Newline INDEX : prints a new line with the command prompt
  * Console Close INDEX : close an open console
- Draw Shadow offsetX, offsetY, blur, RGBA
- Draw Shadow Off
- Added rotation and fill parameters to Ellipse
- Added rotation parameter to Filled Ellipse
- Added fill parameter to Circle
- Added 'fill' parameter to Box, as with other shape drawing instructions, and also Filled Circle and Filled Box alternative syntax for Disc and Bar
- new "Watch" instruction
    Watch EXPRESSION , where EXPRESSION can be anything. The expression is then displayed in the degugger's Watch window and updated as the program goes along
- new "Break If EXPRESSION" instruction: the debugger will constantly evaluate the given expression and put the program on Pause is the result is true
- Text Mode mode$ - Set Text mode to "fill", "outline", or "border"
- Arc x, y, radius, angle1, angle2, rotation, fill, counterclockwise - Draws an Arc of a circle
- Ellipse Arc x, y, radius1, radius2, angle1, angle2, rotation, fill, counterclockwise - Draws an arc of an ellipse
- Segment x, y, radius1, radius2, radius3, angle1, angle2, rotation, fill, counterclockwise - Draws a segment of a circle or ellipse
- Star x, y, radius1, radius2, points, rotation, fill - Draws a star with specified number of points
- Shape x, y, radius1, radius2, sides, rotation, fill - Draws a regular polygon with specified number of sides
- Load Text PATH$, STRING$ : load a UTF-8 file firectly into a string variable
- Save Text PATH$, STRING$ : saves the content of a string variable as a UTF-8 text file
- Source Editor extension, providing for the moment one instruction:
  SE Open INDEX, SOURCE$, paper, pen, tabWidth
  ... open a fully functionnal source-code editor (fixed font width) in the current window of the current screen. This editor allows you to modifiy the text, and can cope with sources of any size. In this versions are implemented:
    - CTRL + Arrow cursor movements
    - Click on the surface to set the position of the cursort
    - MouseWheel
    - Sliders
    - Backspace
    - Enter
    - and of course, normal keys (only INSERT mode for the moment)
- new functions in collisions
    = Point Bob( index, x, y, )
    = Point Sprite( index, x, y, )
- Set Line Width width - Sets the line width for all line drawing operations
- Set Line Cap cap$ - Sets the line capping style, "round", "square" or "butt"
- Set Line Join join$ - Sets the line joining style,  "miter", "bevel" or "round"
- Bob Shadow Off instruction
- Sprite Shadow Off instruction
- Leader Board Instructions
- User Inteface Instructions
- Debug On / Off: Show the debugger
- New Instructions, as I had to program scroll bars for the debugger windows....
  - HSlider (same as AMOS)
  - VSlider (same as AMOS)
  - Set Slider (same as AMOS)
- New functions for text windows =Win Width, =Win Height
  These functions return the number of columns and lines of the current window in the current screen.

--------------------------------------------------------------
### Release 1.0.0 Beta 8, June 3, 2021

>>Update 15

- Mouse Events on Actor has been optimized
- Error messages fixed
- Degrees values can be used for Actor Rotation (if Degree is used in the code)
- RigidBody$ and Gravity parameters have been removed in Actor
- Actor Rotation() command has been renamed to Actor Angle()
- AMOS importation is available for MacOS now!
- Problem corrected: problems with the number of lines and columns in text windows.
- Sprite Shadow added - Syntax:  Sprite Shadow index, offsetX#, offsetY#, blur#, rgba
- Bob Shadow added -  Syntax:  Bob Shadow index, offsetX#, offsetY#, blur#, rgba
- updated CSV / ASCII token exporter to remove and list duplicates
- BUG-> INPUT ""; A$ used to mess display
- i_3 tutorial-> display bug corrected
- Icon Base-> was named "Free" in the doc

- Made F5 help work again,"See Also" work, "Copy to clipboard" work
- Fixed missing cariage return in Format Text when inserting code
- corrected a bug in file system application, preventing open out and append to work
- new function in aoz-api.js getTokenList to get the list of all tokens out of the documentation

getTokenList( options )
- options.chapter: name of a chapter to filter, or all chapters if empty
- options.instructions (bool): true-> will list the instructions
- options.functions (bool): true-> will list the function
- options.numbers (bool): true-> put the number of the token
- options.csv (bool): if false will list as ascii, if true will list as 3 columns csv

* #NEW METHOD IN IDE OBJECT
A$ = IDE@getTokenList$( chapter$ = "", instructions = True, functions = True, Numbers = True, Csv = False )

>>Update 14
* #FIXES
- "End of program" appears 2 times in the message of the bottom bar.
- Bug on Hrev and VRev of the Actor command has been fixed.
- Correction of Is Bob syntax (no longer IsBob)
- Bug #789: Volume Audio fails with expression.
- Bug #787: List Bank transpiles incorrectly.
- Bug #781: Bank Shrink fails.
- Bug #779: Cmove$ fails.
- Bug #775: Is Sprite not working and correction of function syntax.
- Bug #755: Creation of New App fails.
- Bug #751: Can't set Z position for Actor
- Bug #702: AOZIP file structure is messed up.
- Bug #701: The "Hello world!" program should NOT come up every time a new program is created.
- Bug #595: Create a New AOZ Application doesn't open the new app, does not open the Project tree at the position of the new program, the selected name is not used for the source, etc. (see details)

* #DOCUMENTATION
- Change the "Limited" term by the "Reserved" term in the pages.
- Updated with the new API
- Sorting the chapters of the documentation in the Tree

* #NEW INSTRUCTIONS/FUNCTIONS
- = Actor IsHRev( <index> ): Returns True or False
- = Actor IsVRev( <index> ): Returns True or False

>>Update 13
* #FIXES
- Fix Sprite Off (Thanks Dave ;) )

>>Update 12

* #FIXES
- Fix the toolbar and the minimap of the editor

>>Update 11

* #FIXES
- Fix a bug in Actor
- Screen Alpha fixed
- Sprites and Bobs Alpha fixed
- Text and Format Text instructions supports the breaklines with "<br>" or "\r".
- The error or "warning" message appears by passing the mouse over a highlighted line of code.
- The lines with errors and "warning" appear highlighted in the code.
- Get Bob kept the background of the screen.
- Fix New App && Publish
- Fix bug #757: Graphics cursor problem with text
- Fix bug #725: Sprite Off caussing internal error.
- Actors Collision fixed.
- The messages of the Transpiler in the console are a little more understandable.
- Some characters prevented a program from being launched.
- The animation was not updated in Actor.
- Palette by default for the applications "computers" and "smartphone" have been revised.
- HRev and VRev of the Actor command did not work.
- Auto$ property of actor wasn't updated.
- Limits of Actor fixed
- Sprite Height property of Actor fixed
- If a file already exists in the resources folder, it will not be replaced with a file of the same name by the AOZ Drive.
- Build and Publish of an empty code caused the editor to crash
- Blocked when Load Asset loaded a file that does not exist.
- #749 : Clear Key fixed.
- #734 : Load Asset can no longer find files on the AOZ Drive. Now makes AOZ freeze.
- #733 : Actor command can't find images in subfolders of AOZ Drive. (This used to work.)
- #707 : The help tab sometimes stays out after the pane is closed.
- #701 : The "Hello world!" program should NOT come up every time a new program is created.
- #684 : Only the arrow keys are taken into account with Control$="Keyboard" (for Actor)

* #IDE
- The files of the New Application panel and all the templates have been moved to the templates/newapp folder.
- A color picker has been added. Click on a color code in your code or place the cursor on a color made (CTRL + ALT + C), the palette panel opens. Choose your color, press RETURN, and the color code is integrated into your code. :)
- The bar displaying error messages when running the program under AOZ Viewer has been changed to AMOS Pro colors.

* #DOCUMENTATION
- Manuals updated

* #NEW INSTRUCTIONS/FUNCTIONS
- = Get Text Height( text$, width ): Returns the height of a text box.
- = Trim$ : Removes leading and trailing spaces from a string.
- New Actor property : OnMouse$. An Actor is sensitive to mouse actions and the TouchScreen
- New Actor property : Enable. True/False. If False, all controls, animations and collisions are disabled. (True by default)
- Sprite Alpha instruction added.
- Del All Actors : Removing of the all actors created.
- =Actor IsVisible( <index> ): Returns True if the Actor is visible.
- =Actor IsEnable( <index> ):  Returns True if the Actor is enabled.
- =Actor Image( <index> ):  Returns the number of image used by the Actor.
- =Actor Image$( <index> ):  Returns the name of image used by the Actor.
- =Actor Exists( <index> ):   Returns True if the Actor is exists.

* #NEW GAMES / TUTORIALS
- Poker : A game developed by Marcus.zone ;)
- Tutorials for Actor

* #NEW TAGS
- #userAssetsResources: The Load Asset statement is now set, by default, to the "resources/assets" folder, which will be created automatically when a new AOZ application is created. However, for programs created with previous versions of AOZ Studio, the tag #useAssetsResources can be set to False to allow Load Asset to load an external file from any folder. Please note! The official version of AOZ Studio will not offer this tag anymore.

### Release 1.0.0 Beta 7, April 21, 2021...

* #FIXES
- Direct Mode from toolbar
- Actor:
   - offsetX and offsetY parameters have been accelerated (by default) for "keyboard" and "joystick" controls.
   - keyboard controls fixed
- Fireworks Demo has been fixed.
- ASCII MAN reloaded updated
- The INPUT instruction can now be used on mobiles.
- The AOZ Viewer window now adapts to the display chosen for its program
- If an AOZ program is running in AOZ Viewer, and it is of the "mobile" type, a button to change the screen orientation is provided.
- AOZ Drive fixed.
- Resize of the AOZ Viewer
- New PDF Viewer added

* #IDE
- You can to play your audio files in the editor just by clicking on a compatible file (wav, mp3, ogg).
- As a tribute to AMOS, a surprise awaits you when you launch your program in the AOZ Viewer. ( Press CTRL+C or make a bug :) )

* #DOCUMENTATION
- Manuals updated

* #DRIVE/ ASSETS
- Re-order the assets of the AOZ Drive

* #NEW INSTRUCTIONS/FUNCTIONS
- Wait Click: Similar to the "Wait Key" instruction, but for the mouse and the touch-screen.
- Wait Input : Similar to the "Wait Key" or "Wait Click" instructions for the mouse, the touch-screen and keyboard.

* #TUTORIALS / DEMOS / GAME / UTILS
- IMPORTANT : Now these programs are placed into the "AOZ Store" folder. If you want to use one of these programs, now a copy will be created in your "My AOZ Applications" folder, in the "AOZ Inspirations" folder. All programs in the "AOZ Store" are no longer modifiable.
- A new demo is available in the Tutorials folder: MagicBird (in English & French)
- Cybloc by Phil Bel ( ;) )

### Release 1.0.0 Beta 6a, March 23, 2021...

* #FIXES
- Save in AOZIP
- Home and End shortcuts

* #DRIVE/ ASSETS
- Re-order the assets of the AOZ Drive

* #NEW INSTRUCTIONS/FUNCTIONS
- Actor Col Precision delay, precision : Setup of the precision of the pixel perfect collision

### Release 1.0.0 Beta 6, March 22, 2021...

* #IDE
- Dialog Box: Message scrollable now.
- Dialog Box: Classics icons added
- Dialog Box: Standard dialog box used in AOZ Viewer.
- Accessories: Natives applications removed for this moment.

* #NEW INSTRUCTIONS/FUNCTIONS
- Collision with Pixel Perfect added for the Actors object

### Release 1.0.0 Beta 5, March 17, 2021...
* #FIXES
- Actor Auto$ and Control$ properties did not work well on the mouse and keyboard
- A slowdown of the editor in the Beta 4 version was present after a long use.
- Instruction Say doesn't works

* #IDE
- Made from source code of Atom version 1.55
- Corrected editor font line height when font size is not 15px.

* #DOCUMENTATION
- Update of the documentation (PDF et embedded documentation)

* #NEW INSTRUCTIONS/FUNCTIONS
- Del Actor: Delete an Actor
- Reset Actor: Reset the properties of an actor
- OS Name$:  Returns string containing the client's OS name.
- Java Enabled:  Returns boolean indicating whether Java is enabled.

### Release 1.0.0 Beta 4, February 21, 2021
* #FIXES
- corrected a bug in Wind Open, it was always reporting "Window too big" if it had different width and height to the one of the screen
- corrected bugs in F5 help
- corrected a big problem in transpiler not exporting some files explaining why F5 help had so much problems on other people machines wuith fresh installations,
- fixed last problem of missing files located in HTML folders inside the aoz folder: as HTML folder are part of .gitignore, NEW files in those were not registered by GIT. Also explaining many of the problems we encountered. It think now everything is fixed on that side.

* #IDE
- The limitation of 80 launches has been removed.
- Displaying the license from the Settings panel
- New panel available to access all AOZ Studio documentation.
- The Load/Save dialog boxes have been replaced by the system dialog boxes.
- An automatic update is implemented in the IDE.
- It is possible to stop and restart a program in the AOZ Viewer with a STOP/PLAY button.
- A button is visible in the AOZ Viewer to access Direct Mode.
- Search bar added on the editor interface.
- Possibility to choose your search engine (Google, Bing, Ecovia...) from the settings panel.
- Suggestion panel (for the syntax) updated and completed.
- Auto-completion and auto-save can to be disactivated from the settings panel.
- Discord Panel removed (it's an accessory now)
- Notification panel added
- ACCESSORIES ARE BACK!!!
- FINALLY found the solution for the width/height of fonts in screens.
Changes in manifest: default.screen.window.fontWidth and default.screen.window.fontHeight replaced by
default.screen.window.width and default.screen.window.height which simply indicate the width and height
of the window in number of characters. Any font will do, if the font is too big characters will overlap or be too small
but ALL locate and printing will finally, be correct. OUF!
- All manifests in all applications, templates and examples updated accordingly
- All "Illegal Function Call" errors now indicate the faulty value
- All "Illegal Text Window Parameter" errors now indicate the faulty parameter
- After an error when running in the AOZ-viewer, clicking on OK in the error alert box returns youdirect to the editor cursopr located on the faulty line
- Correction of a bug in "Dom Element" instruction, was crashing the runtime
- Update of the core routines of Net extension Call Service instruction to make it more generic (added parameter "contentType"). More to come, this object is key to our future it must be as flexible as possible
- Correction of bugs in "Include"
- Complete re-write of the system of tags, to avoid problems with # within strings, or tags inside a remark etc.
- Correction of several bugs in the internal naming of variables and stadardization of the system: Now, variables in the Javascript have this format:
	Variable in Basic 	| 	Variable in Javascript
	A					|	vars.A
	A$					|	vars.A$
	A#					| 	vars.A_f
	A@					|	vars.A_o
	A( , )				|	vars.A_array
	A$					|	vars.A$_array
	A#					|	vars.A_f_array
	A@					|	vars.A_o_array
- Possible crash when an error occurs under AOZ-Viewer when the application tries to communicate with the IDE
- Added cariage return in error messages to make them more readable
- Added parameters to the Screen Open instructio n to make it as powerful as possible.
	Parameters (doc to come, "z" coordinates there = intentional system is ready for expansion to 3D):

	* index, width, height, numberOfColors, pixelMode
		-> the original instruction will still work.
	* columns, lines
		-> define number of lines and columns in the text window. Ommited= base on manifest + size of screen
	* x, y, z,
		-> display coordinates
	* hotspotX, hotspotY, hotspotZ,
		-> screen hotspot
	* skewX, skewY, skewZ,
		-> equivalent to Screen Skew
	* offsetX, offsetY, offsetZ,
		-> equivalent to Screen Offset
	* scaleX, scaleY, scaleZ,
		-> equivalent to Screen Scale
	* angle,
		-> equivalent to Screen Rotate
	* alpha,
		-> equivalent to Screen Alpha
	* visible
		-> Equivalent to Screen Show / Screen Hide
	* depth,
		-> for future expansion ;)
	* tags$
		-> for future expansion too, I have to explain how tags will work in the future, VERY powerful, "Tree Engine"-like system ;)

- complete re-factoring of the Tag handling routines in the transpiler. It now does a proper scan, skipping tags contained in remarks, string... the first steps to a real C-like pre-processor
- F5 help now initially displays in bottom right
- resized the CLOSE icon to match the height of the title bar of F5 help
- made "Search" work in F5 help, still a slight problem of font with with input in non-standard size text windows

* #DOCUMENTATION
-  Thanks to Laurant Weill and François Lionet for this fabulous work! ;)
- A complete documentation is available in a sliding panel (at right of screen).
- Point a keyword on your code, and press F5 to show a popup with its description, or F6 to open the documentation panel with the complete description on the keyword found.
- AOZ Studio User Guides available into the editor from the "Manuals" folder, or the Documentation Panel.

* #NEW INSTRUCTIONS/FUNCTIONS
- Actor: A complete instruction to manipulate and to animate your bobs in your AOZ program. Based on CreateJS (used by Adobe Animate), it's a powerful commands for your games ;)
- Include: It is possible to make an .aoz file inclusion!
- made Include work
- Assets collection provided with AOZ Studio and ready to use in your programs.
- Load Asset supports 2 others image formats : IFF/ILBM (from Amiga and Atari ST) and BMP.
- Load Asset can to load Spritesheet compatible with CreateJS.
- New "alpha#" parameter added to "Paste Bob", "Paste Sprite" and "Paste Image". Default value is 1 (opaque).
- re-factoring of the websocket extension, added missing "Is Connected" instruction, and "contentType$" parameter to Web Socket Open...

### Release 1.0.0 Beta 2 (B2), November 21, 2020.
* #IDE
- This Beta version is limited to 80 launches.
- The Settings panel now offers a "Miscellaneous" category where you will find some options for :
	- Enable/Disable auto-completion
	- Enable/Disable the Discord panel
	- Activate the "Developer Mode".
- The templates of the "NEW" panel now propose to activate/deactivate the text cursor (Curs On/Off)

* #NEW INSTRUCTIONS/FUNCTIONS
- QRCode Get Camera NIMAGE, WDTH, HEIGHT: Captures the camera image and stores it in the image bank at NIMAGE. The image can be used as a BOB.

* #GAMES & DEMOS
- QRCode_Reader_demo : A demo showing how to read a QRCode with its camera in AOZ.
- QRCode_Generator_demo : A demo showing how to create an image of QRCode with AOZ.

### Release 1.0.0 Beta 1 (B1), November 14, 2020.
* #FIXES:
- #543: Exit if mouse fails
- #542: On n Proc P1,P2,P3... now fails.  (used to work)
- #540: Colour command no longer works.
- #529: Border$ is messed up. It works in the Amiga manifest, but is really screwed up in the AOZ manifest.
- #523: Some operators require trailing space for no good reason if the second operand is Hex or Binary.
- #522: Procedures called by Touch On Change don't run properly
- #521: Sprite Show N causes internal error
- #516: In Beta RC3, Palette fails if parameters are omitted.
- #513: Every N Proc PROCNAME is broken in RC3.
- #463: Bob Rotate corrupting certain sums and displaying incorrectly.
- #399: Gosub and Goto using variable fails (integer or string)
- #397: Colour Back isn't working.
- #396: Load IFF distorts the images loaded. It also gets the background color wrong sometimes.
- #394: "if without endif" error causes new Atom editor window to open.
- #348: A user defined function cannot call another user-defined function. (Causes internal error or program freeze.)
- #560 Speech demo becomes unresponsive if you wait too long before you speak.
- #561 Speech demo crashes if speech recognition is not available.
- Bug removed: Bob Hide INDEX did not work

* #IDE
- WINDOWS / MACOS / LINUX : his Beta version is limited to 80 launches.
- Atom core has been updated with the version 1.53 ( Windows and Mac OS )
- Removed license verification.
- Added specific panels for creating new AOZ applications, loading and saving.
- Code Split features in the editor are available again
- Direct Mode: Direct coding from the AOZ Viewer.
- Inspector is integrated to the Direct Mode.

* #NEW INSTRUCTIONS/FUNCTIONS
- = Angle#( X1, Y1, X2, Y2 ) returning the angle of the line between the two points.
- = Distance#( X1, Y1, X2, Y2 ) returning the distance in pixels between two points.
- New "Bob Collide" instruction allowing you control which other bob the first bob collides with
  Bob Collide INDEX; "Player" : affects the identifier "Player" to the bob of the givent index:
- New "Bob Collide With" instruction, defining in with which bobs the given one collides.
  Bob Collide With INDEX, "Pleyer", Ennemy" indicates that this bob only collides witht he other bob defined
  as "Player" with the previous instruction. Thsi has for effect of greatly accelerating the
  collision detection process by avoiding unused collision checks.
- New "Sprite Collide" and "Sprite Collide With" instructions
- Implementation of Bob / Sprite Move On - Off - Freeze for the new movements
- Implementation of Bob / Sprite Anim On - Off - Freeze for the new movements
- Further debugging of the renderer (problems of bob scaling)
- =Exist( FILENAME ) was returning the wrong answer
- Definition of the object global keywords:\
  Add OBJECT: add a new object to an existing one
  Set index, OBJECT: set a new object at a position in the list
  Del index: delete an object from another
  Play
  Stop
  Pause
  On
  Off
  ... please wait for further documentation on object-orientation for more info,
  or watch the sourxce code of the movement demos in the Demos folder.
- Implementation of "Dot" syntax for object orientation
- New instructions "With" / "End With" allowing you to enter the context of an object and switch to object orientation
- Implementation of Property value change from Basic
- Implementation of Method callling from Basic
- QRCode Create TEXT$, NUMIMAGE, WIDTH, HEIGHT : Create a QRCode from TEXT$ and generate the image NUMIMAGE into the images bank with the size WIDTH x HEIGHT
- QRCode Scan CAMERAID$ : Set the camera available on the current device to scan a QR Code. By Default, the first camera found is used.
- QRCode Scan On/Off : Execute or Stop the reader of the QR Code with the selected camera.
- =QRCode Scan$ : Returns the text from the scanned QR Code.
- Speech Recognition Start/Stop : Start/Stop the Speech Recognition
- =Speech Recognition Allowed: Returns True if allowed
- =Speech Recognition Value$: Returns the text from the microphone
- =Speech Voices Count: Returns the number of synthetic voices availables on the current system
- Speech Voice NVOICE: Set the voice available on the current system to speak the text
- =Speech Synthesis Allowed: Returns True if allowed
- Speech Lang LANG$: Set the language of the Speech Synthetizer
- Speech Pitch PITCH#: Set the pitch of the Speech Synthetizer
- Speech Rate RATE#: Set the rate of the Speech Synthetizer
- Speech TEXT$: Set the text that will be spoken by the Speech Synthetizer.
- Set Bitmap Font: Set a bitmapped font from an image of the images bank
- Bitmap Text: Draw a Text on the current screen with a bitmapped font


* #RUNTIME
- New "Chase" Movement with full demo in "Demo" folder
- New "Circular" Movement with full demo in "Demo" folder
- New "Line" Movement
- New "Joystick" Movement
- New "Tank" Movement
- New "Mouse" Movement
- New "Wave" Movement
- New "Offset" Movement
- Refactoring of the compiled code: simpler, re-entrant
- Refactoring of the application's main loop, recursiviy and objects.
- Reduction of the number of Javascript files saved when building an application
- Debugging of error-trapping, On Error, resume, trap etc. They should now work!
- Compiler does not crash anymore after a syntax error within an expression
- Images in the Image bank are no longer remapped to have black transparent
- New file beside the image in the image bank, containing information about the images, "info.json"
	This file is a simple HJSON file. It contains information about the "Sprite Bank"
	{
		// First, the palette
		"palette":
		[
			"#AABBFF","#FF00FF","#00FFFF","#FFFF00",
			"#FF0077","#0077FF","#FF7700","#000000",
			"#555555","#333333","#773333","#337733",
			"#777733","#333377","#773377","#337777",
			"#000000","#EECC88","#CC6600","#EEAA00",
			"#2277FF","#4499DD","#55AAEE","#AADDFF",
			"#BBDDFF","#CCEEFF","#FFFFFF","#440088",
			"#AA00EE","#EE00EE","#EE0088","#EEEEEE"
		],
		// Then the hot-spots of each image
		"hotSpots":
		[
			{"x":24,"y":4},
			{"x":3,"y":3},
			{"x":24,"y":4},
			{"x":3,"y":3},
			{"x":24,"y":4}
		],
		// A flag, indicating if the images already have transparency
		// (will be false when importing an Amiga game)
		"alpha":false
	}
	Soon, I will a small utility in AOZ to set the hotpots and resize/zoom the images.
- Load "sprite_bank.abk" now loads the hot-spots of the images
- Hot Spots are now imported along with the game when importing an AMOS game


* #GAMES & DEMOS
- Correction of the examples affected by the correction of the direction of angles... Applications updated:
	* Many Snakes (problem in Input not respecting the syntax, not detected before)
	* Infinite Balls demo (inversion of rotation angles, bad tags "screenWidth" and "screenHeight" instead of "displayWidth" and "displayHeight", not detected before + remaning debugging code)
	* Text Effects Wheel 1 (inversion of angles)
	* Text Effects 2 (inversion of angles)
	* ASCII Man Reloaded V1.3 (inversion of angles)
	* Crunchman Reloaded (inversion of angles)
	* Cybenet (inversion of angles)
	* Flappy (inversion of angles)
	* Grave Robbers Tutorial (syntax error in one of the tags)
	* Gravity (inversion of angles)
-  Modification of "Text Wheel Demo 2" to cope with the new reserved keyword "angle#" (sorry guys, you may have to change the name of this variable of you use it!)

--------------------------------------------------------------
### Beta Release Candidate 3 (RC3), September 22, 2020
* #INSTALLATION
- MAC OS Release !
- THIS RELEASE IS USABLE UNTIL NOVEMBER 28, 2020. AFTER THIS DATE, YOU WILL NEED TO PURCHASE A LICENSE AND DOWNLOAD THE OFFICIAL VERSION.

* #FIXES
- Save the list of folders in the "project" panel.
- Saving the list of open files in the editor.
- Slowing down the editor
- Publish and Documentation Path error
- Editor Text Cursor that disappears
- Editor Text cursor not returning to the right place
- Bug #98: Sam Stop - internal error
- Bug #83: Sam Play not working
- Bug #284: Lost access to the download page on www.aoz.studio
- Bug #377: A simple duplicate folder into Ressouces freezes my PC.
- Bug : Add instruction made the application crash if the added value was float and the value to add to was integer
- Bug : Limit Mouse X1, Y1 To X2, Y2 blocked the mouse pointer vertically
- Bug : Rainbows with a height of 0 crashed the application
- Bug : Renderer: sprites stayed static and did not resize when the application window was resized
- Major debugging of AMAL, all 7 demos now work (but #5 that uses path stored in a bank, to be implemented)

* #NEW INSTRUCTIONS/FUNCTIONS:
- Gamepad Threshold t#	' Sets percentage of maximum to trigger the digital joystick functions (jUp/jDown, etc.) to t# (1.0 = 100%)
- =Gamepad Threshold	  ' returns percentage of maximum to trigger the digital joystick functions (jUp/jDown, etc.)  (1.0 = 100%)
- New token "End Procedure", equivalent to "End Proc"
- Function "Alpha" (to get the alpha value of a screen) has been renamed to "Screen Alpha"
- "New" is now a reserved keyword

* #TRANSPILER
- Cleanup of the transpiler, many bugs removed
- Implementation of name and default value for the parameters of every function or instruction
- Implementation of object-oriented syntax to make the way for new movement and animation functions (in next version)
- Generic support of both string and number indexes for everything that needs an index (bobs, sprites, images etc. ) For the moment, only for bobs.

* #RUNTIME
- Touch Screen is now simulated in AOZ Viewer with the mouse. Multi-touch is not supported.
- In developer mode, AOZ does not capture the browser keys anymore (like F12). To set the developer mode ON, edit the "user.hjson" file in your aoz/IDE folder.

* #IDE
- The Discord panel has been enlarged
- The "alert" and "confirm" dialog boxes have been redesigned.
- It is possible to load .aoz files from the LOAD icon on the toolbar.

* #UTILITIES & Others
- Joystick Tester has been updated by Brian Flanagan.

* #GAMES & DEMOS
- Cybenet by Phil Bell
- Cyball (Amiga) by Phil Bell
- Flappy by Phil Bell
- Crunchman Reloaded by Dave Baldwin

--------------------------------------------------------------
### Beta Release Candidate 2 (RC2), September 15, 2020

* #INSTALLATION
- Windows: Batch Scripts and PHP are no longer required to run the editor.

* #FIXES
- filesystem save / load corrected
- debugged channels and AMAL animations (can you test the examples in the manual and report the ones that do not work?)
- Get Bob, Get Sprite, Get Image new tag #opaque, will not generate any transparent color
- AMAL compiler went in forever loop with some syntax errors, example forgetting the comma after A instruction ( example: "A0(1,10)(2,10)" )
- Bug Min( "", "" ) and Max( "", "" ) reported type mismatch.
- WebSocket extension was always compiled in developer mode due to an error in the manifest (in an error message, structure 'ws://' was not converted to proper HJSON and crashed on loading, thus forcing a recompilation each time)
- Bug #253: Track Play doenst work on Google Chrome
- Bug #347: Function problem. The third time any user-defined function is called, AOZ will lock up.
- Bug #348: A user defined function cannot call another user-defined function. (Causes internal error or program freeze.)
- Bug #362: there is an error in AOZ Studio Lesson 2
- Bug #413: AOZ Hide now returns Internal Error at runtime.
- Bug #426: clw followed by colour number causes a Type Mismatch error
- Bug #430: MATCH command causes internal error.
- Bug #455: Input not allowing for null input by hitting return at start.
- Bug #460: PDF viewer isn't installed in AOZ!
- Bug #392: String variables are not returned properly from JavaScript. They cause a type mismatch.
- It is possible to delete a "root" folder from the "project" panel.

* #NEW INSTRUCTIONS / FUNCTIONS
- bsave "filename", start, length instruction added
- Bob Anim
- Bob Move
- Bob Move X
- Bob Move Y
- Bob Move Freeze
- Bob Move On
- Bob Move Off
- Sprite Anim
- Sprite Move
- Sprite Move X
- Sprite Move Y
- Sprite Move Freeze
- Sprite Move On
- Sprite Move Off
- Change Mouse CURSOR$: New signature with the name of the cursor in parameter
- Load Asset: JSON format support.
- =JSON Asset Property$ INDEX, PATH$: Returns the found value as a string ( ex.: A$ = JSON Asset Property$(1, "books[0].title") ).
- =JSON Asset Property INDEX, PATH$: Returns the value found as an integer ( ex.: N = JSON Asset Property(1, "books.length") ).
- JS Execute JSCODE$: Allow to execute JS script code from your AOZ Code.
- Zone On/Off NUMBER: Enable or disable a zone. It will be not detectable.
- =Zones Length : Return the number of zone for the current screen.
- =Zone Enabled( NUMBER ): Return True if the zone NUMBER is enabled, else False

- =jupLeft(p)           ' returns true if joystick on port p is up and left
- =jUpRight(p)		      ' returns true if joystick on port p is up and right
- =jDownLeft(p)		      ' returns true if joystick on port p is down and left
- =jDownRight(p)		    ' returns true if joystick on port p is down and right
- =Gamepad Buttons(p)	  ' returns the number of buttons on gamepad port p
- =Gamepad Axes(p)		  ' returns the number of axes on gamepad port p
- =Gamepad Name$(p)		  ' returns ID string for gampad on gamepad port p
- =Gamepad Vendor$(p)	  ' not done: Will return 4 digit hex code for Vendor ID
- =Gamepad Product$(p)	' not done: Will return 4 digit hex code for Product ID

* #MODIFIED FUNCTION:
- =Gamepad Axe(p,n)      ' RENAMED (corrected spelling - see below)
- =Gamepad Axis(p,n)     ' <-- New name  Returns value for analog axis n on port p

* #IDE
- Atom version has been updated. Now AOZ Studio use the version 1.51.
- Created the "transpiler" sub-folder in aoz-studio package and moved the transpiler there.
- Created the "ui" sub-folder in aoz-studio package and move the panels and other graphics there.
- A nice set of icons has been applied to the tree of the "Project" panel
- AOZ Studio launches faster and does not require a .BAT or PHP file anymore.
- The Discord panel has been added to the IDE.
- Some file extensions have been released: .js, .json, .hjson, .html/.htm, .xml, .txt...
- 2 news commands for the Inspector: "reload" to re-run the current program, "listbank" show the banks used by the current program.

* #RUNTIME
- Resize the star-night image in run/resources
- star_night image not copied anymore if the application is full screen or full page
- Get Bob, Get Sprite, Get Image new tag #rgbtrans:$RRGGBB, will use that color for transparency

* UTILITIES & Others
- Joystick Tester by Brian Flanagan.

* GAMES & DEMOS
- 2 Text Effects coded by Dave Baldwin.

--------------------------------------------------------------
### Beta Release Candidate 1 (RC1), August 26, 2020... this one

* #FIXES

* Hitting letter C in Amiga manifest exits the program.
* Inkey$ returning multi-character results for modifier keys.
* Keypad keys not all functioning properly.  Ins, Del, Home, End, PgUp, PgDn also...
* Enter key on keypad, doing space instead of return
* INPUT – internal error when you press Shift, Ctrl, or Alt.
* Found problem and fix for Tutorial #6.
* In an azerty configuration impossible to have the letter “M”
* When pressing a normal key in combination with modifiers, Key Shift is shifted to the left 1 bit (altering ALL the shift states).
* An alert message is displayed if an attempt is made to compile a file that is not AOZ-coded.
* The inspector is displayed in the AOZ Viewer.
* The semi-transparent mask remained displayed if the splashscreen is set to False.
* The link generated by the Publish feature is clickable again.
* Now, the folder "appicon" folder, containing the icons of the default application, is created in the resources folder of the application if it does not exist.
* X Mouse and Y Mouse are fixed in Amiga Mode (Thanks François!).
* Keyboard entries in AOZ Viewer conflicted with keyboard entries in the editor.
* Font has been fixed for the code editor

* #NEW TAGS

* #appTitle: Sets the title of your program, for the browser title bar and for shortcuts. (see Captain Max Score Game for an example)
* #useHardwareCoodinates: In Amiga Mode, if this value is False, the normal coordinates are used for the mouse, otherwise the Amiga\'s hardware coordinates are used by default.

* #NEW INSTRUCTIONS / FUNCTIONS

* =Orientation: Returns the orientation of the device. 0=Landscape, 1=Portrait
* =Orientable: New name of the previous instruction "Orientation Screen": Returns True if the device can be rotated.
* Touch On Change: Assign an AOZ procedure to the touch screen events.
* =Browser Version$: Returns version via appVersion
* =Browser Agent$: Returns full userAgent description.
* =Browser Ancestor$: Returns name of predecessor browser (i.e. Netscape)
* =Browser CodeName$: Returns code name of browser (i.e. Mozilla)
* =Browser Engine$: Returns main browser API (i.e. Gecko)
* =Browser Platform$: Returns OS related info. (i.e. MacIntel)
* =Browser Online: Returns boolean: True if connected online.

* #IDE

* The menu bar has been redesigned
* ATOM features have been removed
* The toolbar takes up the entire width of the screen.
* The link generated by the Publish feature is copied in the clipboard at the end of the process.
* Only the file extensions that can be used by AOZ Studio are visible in the "Project" panel.
* You can create a new application or import an application to any folder. This folder will be added automatically in the "Project" panel.
* The settings panel offers only monospace fonts to customize the code editor.

* # GAMES & DEMOS

* "Motion Device Demo" has been updated to use the "Touch On Change" instruction.
* The game "Captain Max Score" has been updated to use the "Touch On Change" instruction.

### Version 0.9.9.4-r2, August 17, 2020

* #FIXES

* If no key has been pressed, checking ScanCode returns undefined.
* Key Shift returns Caps Lock in the wrong bit position in the Amiga manifest.
* In the “aoz” manifest, the AOZ viewer is not centered horizontally.
* #manifest:"pc" works again. It's an alias of #manifest:"aoz" to keep the compatibility with the previous versions of AOZ Studio.
* Antialiasing is disactivated when #manifest:"amiga" is used
* X Mouse / Y Mouse returns the good coordinates
* AOZ Viewer sometimes appeared with a gray screen. This has been corrected.
* Panels like Settings or AOZ Viewer are resized when the main window is resized.
* Inkey$ detecting keypress when not pressed.
* Wait Key Amiga manifest mode has problems.
* Loading a Music bank locks up AOZ.
* Track Play doesn't work on Google Chrome.
* Compile error when directly calling a Procedure with more than 1 argument.
* For/Next with floating point step not executing the correct number of iterations.
* The Editor was taking a long time to start.

* #NEW TAGS

* #appTitle: Sets the title of your program, for the browser title bar and for shortcuts. (see Captain Max Score Game for an example)

* #NEW INSTRUCTIONS / FUNCTIONS

* =Pen: Returns the current color index used for the background on text operations.
* =Paper: Returns the current color index used for the background on text operations.
* =Ink: Returns the current color index used for graphic operations.
* =Manifest$: Returns platform name for selected manifest.("pc", "aoz" or "amiga")
* =Browser Name$: Returns name of client browser for most popular browsers. ("Chrome", "Firefox", "Opera", etc.)
* =Browser Language$: Returns language identifier in client browser. ("en-US", "en-BR", "fr-FR", "fr-CA", etc.)
* =Touch Screen: Returns True if the device has a touch screen.
* =Touch Count: Returns the number of fingers on the touch screen.
* =Touch X[index]: Returns the X position in pixel of the finger No. <index>.
* =Touch Y[index]: Returns the Y position in pixel of the finger No. <index>.
* =Touch State[index]: Returns the state of a touch on the screen. The returned value may be:
	- 1 = Start
	- 2 = Move
	- 3 = End
	If the touch not exists, -1 is returned.
* =Orientation Screen: Returns True if the device can be rotated.
* =Orientation X: Returns the angle of rotation on the X axis between -90 and 90 degrees.
* =Orientation Y: Returns the angle of rotation on the Y axis between -180 and 180 degrees.
* =Orientation Z: Returns the angle of rotation on the X axis between 0 and 360 degrees.
* =Accelerometer: Returns True if the device has an accelerometer.
* =Acceleration X: Returns the value of the accelerator on the X axis.
* =Acceleration Y: Returns the value of the accelerator on the Y axis.
* =Acceleration Z: Returns the value of the accelerator on the Z axis.
* =Gamepad Name$: Returns the name of the device

* # NEW UTILITY

* ScanCode Tester utility is available in the folder "Utilities & Others".

* #IDE

* A waiting message appears in the center of the editor displaying the current operation.
* The transpiler panel has been moved to the bottom of the editor and can be opened and closed.
* AOZ Viewer now offers a command system (Inpector) that allows to display information about the program (variables, display...)
* The "Show Transpiler Panel" parameter has been changed to "Hide Transpiler Panel after Compilation...".
* Importing AMOS programs is done through the application load function
* The error navigation arrows have been moved to the Transpiler panel.
* The "Utilities & Others" folder is installed in the project panel by default.

* #RUNTIME

* "appicon" folder is created in the "resources" folder to customize the icon of your application. (see Captain Max Score Game for an example)
* #fullScreen and #fullPage are True by default.
* On a mobile device, the "click to start" label on the splashscreen is replaced by "touch to start"
* The splashscreen adapts the size of the AOZ Studio logo on mobile devices.
* Support for touch screens and multi-touch. (compatible with the instructions X Mouse & Y Mouse)
* Support for acceloremeter.
* Support for orientation device.
* The touch screen automatically puts the application screen in fullscreen on mobile devices.

* # GAMES & DEMOS

* NEW DEMO: "Motion Device demo" is a touch screen example that shows how to use multi-touch with AOZ.
* NEW GAME: "Captain Max Score" developed in 10h under AOZ is that shows how to make a game for mobile.

### Version 0.9.9.4-r1

* #installation #windows

* *Windows version: Fix the bug on the first execution of the editor

* #ide

* Fix the good folder to create a new AOZ Application.
* Re-order the folders in the Project Panel (My AOZ Applications in first).

### Version 0.9.9.4-Test4

* #installation #windows

* *Windows version: Fix the bug on the first execution of the editor

* #ide

* Fix the bug of the transpiler on an empty code.
* The Transpiler panel is automatically displayed during a RUN command.
* The setting which allowed to hide the Transpiler panel has been removed from the Settings panel.
* The label named "My Applications folder" has been renamed in "My AOZ Applications folder"
* The documentation panel has been added with the message "Work in Progress, for next release.".

* #runtime

* Fix a bug on the Key State statement
* Fixes for keypad 0-9 & Delete key

### Version 0.9.9.4-Test3 ...

* #installation #windows

* *Windows version: Hide the window of the console
* Fixes issue with opening AOZ documentation.
* "My Applications" folder is renamed in "My AOZ Applications".

* Demos & Games

* Crunchman Reloaded game no longer compiles. The folder has been renamed to "OLD" for now, but the AOZ source code is still visible.

### Version 0.9.9.4-Test2

* #installation #windows

* Shortcut has been added for the "Manuals" folder.

* #ide

*  The home screen closes automatically after 3 seconds
*  The SAVE icon has been changed.
*  The tips of ATOM in background are disabled.
*  AMOS importation creates a folder without the AMOS extension.
*  The title of the AOZ-TV panel has been changed by "AOZ Transpiler".
*  Bug corrected when pressing the F5 key when there is no editor open.
*  The "AOZ Viewer" panel can be full page or centered on the screen by clicking a button on the title bar.
*  If no file is open when launching the IDE, a small AOZ file is then opened (Print "Hello World!")
*  The 2 demos which no longer worked which did not work have been removed from the installation
*  The alignment of the text boxes in the "Settings" panel has been corrected on the left
*  "Font Editor" has been fixed in "Editor Font" ;)
*  The "Release notes" has been added to the "Settings" panel.
*  Running AOZ programs forces the browser to reload the files and not those from the internet cache.
*  The "AOZ Resource Drive" folder has been added to the list of projects by default.
*  The AOZ website now opens in the browser and not in a tab. (Documentation)

### Version 0.9.9.4-Test


* #installation #windows

*  The "My Applications" folder is placed in the user's "Documents" folder and is no longer deleted when AOZ is uninstalled.
*  All instances of AOZ Studio are closed when exit.

* #ide

*  A splash screen has been added when opening the IDE.
*  The icons in the toolbar have been redesigned.
*  The command "Open in ATOM" has been replaced by "Open in AOZ Viewer".
*  The AOZ application now opens in a panel inside the IDE, and no longer in a tab.
*  The publish tool also opens in a panel inside the IDE, and no longer in a tab.
*  The transpiler panel is now scrollable.
*  The AOZTV frame has been removed and the command "Open in AOZ TV" is no longer available.
*  The "Games", "Demos", "Tutorials" and "My Applications" folders are installed by default in the projects panel.
*  Importing AMOS programs is working again.
*  A settings panel has been added. Some settings exist in the panel for a future version ("Account" & "Paths" ).

* #runtime

*  ScanCode and ScanShift have been fixed.
*  Val function now works with Hex and Binary.
*  KeyName$ fixed.
*  Deek function corrected.
*  X Text function corrected.
*  DisplayWidth function corrected.
*  Renderer has been fixed (window display)
*  The graphic rendering is now smoothed

* #MAPS

*  The original instructions have been restored.
*  BAOX works again !!

* #Elearning & SCORM API

*  New Instructions set to connect an AOZ application to SCORM API (1.2 and 2004 compatible).

### Version 0.9.9.3-Test-3a


* #installation #linux

  First version on Linux.

* #runtime #_inkey$

  Keyboard input finally corrected, Shift and control keys no longer return a string
  two keyboard modes, defined in the manifest or in tags.
  #keymap:"amiga"
  #keymap:"aoz"

  #keymap:"amiga" -> simulates to the missing keys the keyboard of an amiga.
  Scan Codes are the ones of the Amiga

  #keymap:"aoz" -> return all keys but control keys, a string with character 0
  when a function key is pressed, otherwise the key itself.
  Scan Codes are Javascript, taken out of the "which" event.

* #function #new #_key_name

  New function: Key Name$ that returns the Javascript name of the key, as "ArrowUp"
  in any keymap configuration, allowing easy testing. This keymap will always
  be valid as converted on other exportation platforms to come.

* #IDE

  Cleanup of messages display in aoz-studio-view

* #IDE

  Big debugging related to crashes du to bad THIS and SELF in aoz-studio-view.js

* #IDE

  Implementation of Developer Mode. In developer mode, all the messages of
  the transpiler are displayed, includign when you launch an accessory
  or when the application starts. I will add new data to the transpilation
  output so that it becomes a real added value for the derveloper.
  To swtich to developper mode, edit user.json in aoz/IDE and set the value to
  one. This switch will be included in the config page.

* #extension #JSON

  New JSON extension with instructions to load, read, create json strings
  and files.

* #extension #WebSocket

  New extension to connect and exchange messages with any WebSocket server,
  including the one of the AOZ-IDE.

* #extension #IDE

  New extension to connect an application to the WebSocket server of the IDE
  and send commands to it. This extension gives total control over the machine of
  the user, the application can open file-selectors from the browser, move the
  cursor etc.

* #AOZTV

  New "tv" application that handles the display in the upper-right panel, the AOZ-TV.
  It works by exchanging messages with the IDE through the "IDE" extension. This
  application is going to become the maion point of "easy-information" of the product.

* #AMAL #STOS #move #anim

  Implementation of STOS compatible animation commands.

* #AMAL

  Full-debugging of AMAL

* #animation

  Implementation of a flexible system of "Channels" to exchange information between
  nodes of different kinds. Channel act as translators, and adapt the dat from
  source to destination, and will be key to the safe extension of the system.

* #transpiler

  Massive acceleration of transpilation for non-developer users: if you do not touch the
  extensions or the modules, there is no need to scan them and look for changes in the code.
  therefore, in non-developer mode, the modules are transpiled when the product is first booted
  after a version change, and not anymore. You can still use the #cleanModules and #cleanExtensions
  tags to to force their re-transpilation.
  In developer mode, modules and extensions are scanned as before, adding some time
  to each transpilation.

 * #IDE

   New simple option in the IDE, PUBLISH. In a click, your application is packaged and sent
   to a store or to a server with FTP. This option is actually a real AOZ application
   for the interface, talking with the IDE though the IDE extension. In the future,
   it will work along with the #export tag and yet stay as automatic as possible.

* #IDE

  Integrated the Auto Complete package into the core aoz-studio atom integration package

* #IDE

  Added Auto Complete settings to the aoz-studio atom package

* #IDE

  Enable Auto Complete

* #IDE

  Set minimum Word Length

* #IDE

  Include Additional Suggestions (Variables, Labels etc)

* #IDE

  Integrated the AOZ Grammar package into the core aoz-studio atom integration package

* #IDE

  The Auto Complete suggestions & Grammar are updated by inspecting the AOZ
  source code files as part of the release build process

* #IDE

  Publish application feature

* #IDE

  Submit application to App Store (Work In Progress)

  ... and I forget many. MANY changes since version 0.9.8.1

### Version 0.9.8.1

* #transpiler #bug327

	Procedure call followed by a colon confused with a label even though there's a space between.

* #transpiler #bug320 #tags

	Tags are executed even when commented.

* #transpiler #bug286 #crash #fonts

	Font$ function causing internal error

* #transpiler #bug342 #tags

	Compilation error if a comment with a comma follows #manifest or #fullScreen

* #transpiler #feature #warnings

	Transpiler now indicates how to remove a warning in the warning itself

* #transpiler #feature #french

	All transpiler messages translated to French thanks to OlivierO! Messages will be in French if your machine is French. You can force English, or any other language (if it is implemented in AOZ of course), by changing the line "language" in the aoz/transpilermanifest.hjson file and removing the remark. IF a message is not found in the desired version (for example in certain extensions), it will revert to the english version of the message.

* #runtime #bug341 #keyboard #_inkey$

  Key repeat has stopped working on Inkey$

* #runtime #bug336 #amal #_amal_off #_amal_freeze

  Amal Off and Amal Freeze not working.

* #runtime #bug337 #crash #strings #_mid$ #right$ #_left$

  Mid$=, Right$=, Left$=, throwing Internal error when called from inside procedure

* #runtime #bug338 #sounds #_sam_stop

  Sam Stop has stopped working

* #runtime #bug335 #maths #_add

  Adding a floating point number to an integer turns integer variable to fp.

* #runtime #bug333 #sprites #bobs #_hrev #_vrev

  Hot Spot not flipped when using HREV/VREV

* #runtime #bug328 #errors #_trap #_err$ #_errtrap

	Trap causes compiler to crash AND open a new source code window! err$ and errtrap now report the correct values

* #runtime #bug325 #crash #procedures

	Functions with floating point results lock up AOZ. Also, Integer functions return floating point results!

* #runtime #bug324 #crash #display #_update_off
	Update Off causes Internal Error

* #runtime #bug322 #math
	True and false not always treated as numeric constants (UPDATED). Also, not all boolean expressions are parsed properly.

* #runtime #bug319

	Runtime error messages reverse the line number and column number

* #runtime #bug301

	Scaled bobs not always triggering collision detection

* #runtime #bug300 #amal #_amal

	AMAL causes error but works in AMOS

* #runtime #bug299 #display #screens #_dual_playfield

	Background screen on a Dual Playfield sits 100 pixels lower down the screen than it should.

* #runtime #bug292 #banks #tracker #_list_bank

	List Bank does not show Tracker banks..

* #ide #atom #feature

	Added Phil Bell's syntax coloring package... Thanks Phil! :) Will work on it for next version.

* #ide #atom #feature

	Added the complete list of instructions and functions in the Manuals/Instruction folder. Files are simple PDF for the moment, a real manual is on the way + intellisense etc.

---------------------------------------------------------

### Version 0.9.7

A lot of things cleared in this version. YEAH! :)
AMAL should work now, yet, the PLay instruction to play a path stored in an AMAL bank is not yet implemented, and the objects will not move...

* #runtime #bug #crash #amal #_chanan

  Chan() function Made the application crash.

* #runtime #bug #crash #amal #_amplay

  Amplay() function Made the application crash.

* #runtime #bug #crash #amal #_synchro #_ synchr_on #_synchro_off

  Synchro, Synchro On, Synchro Off made the application crash.

* #runtime #bug #crash #filesystem #banks #_load

  Data or Tracker banks made the runtime crash.

* #runtime #bug #crash #amal

  To many bugs corrected to mention. Re-write of the tokenizer to cope with string with no space, and
  many other problems corrected.

* #runtime #feature #amal

  Acceleration of loading of AMAL strings.

* #runtime #feature #amal

  AMAL program should run more regularly.

* #transpiler #feature #procedures #_param #_param$

  You can now call a procedure within an expression, such as:
  ```
  Print DO_CALCULATIONS[ 5 ] + 2
  ```
  and do not need the Param or Param$ functions anymore.

* #transpiler #feature #include

  Option has been rewritten to be recursive (includes file that include others).
  Runtime also copes with that in reporting the errors.

* #runtime #feature #keyboard #_=inkey$ #_=scancode

  Re-write of keyboard routines for system keys.
  In PC mode, =Inkey$ now returns the value returned by Javascript for system keys. A letter, or a string with the name of the key.

  * Alt
  * Control
  * Shift
  * CapsLock
  * NumLock
  * ArrowLeft
  * ArrowRight
  * ArrowUp
  * ArrowDown
  * Tab
  * Enter
  * Ins
  * Del
  * Home
  * End
  * PageUp
  * PageDown
  * F1 to F12
  * ScrollLock

  In Amiga mode, non-mapped keys return the Javascript equivalent, and mapped keys return the Amiga value. Values stay identical for the = ScanCode function.

* #runtime #bug #_input

  Backspace and Del did not work anymore in Input.

* #runtime #bobs #sprites #_scale_bob #_scale_sprite

  You can now use negative values in the Scale instructions, they will invert the image of the bob or sprite on screen.

* #runtime #display

  The rendrer does not anti-alias everythign anymore. (font and graphcis function are still, nothing can be done about that in PC mdoe, Amiga mode will be corrected soon).

* #transpiler #bug #crash

  Several crashing bugs removed from the transpiler. Cleanup of the code in relation with Instructions and Procedures.

* #runtime #bug #collisions #bobs #sprites #images #_hrev #_-_vrev

  Collisions now work HRev and VRev images.

* #transpiler #feature #images #-=hot_spot

  New function = Hot Spot( IMAGE, TYPE$ ) to get the position of the hot spot of an image in X and Y.
  Print "Hot spot X";Hot Spot( 1, 'x' )
  Print "Hot spot Y";Hot Spot( 1, 'y' )

* #transpiler #feature #bobs #_=is_bob

  New function = Is Bob( NUMBER ), returns TRUE if the bob exists, FALSE if not, without reporting errors.

* #transpiler #feature #sprites #_=is_sprite

  New function = Is Sprite( NUMBER ), returns TRUE if the sprite exists, FALSE if not, without reporting errors.

* #transpiler #feature #filesystem #tags #_load_image

  New tags for the Load Image instruction.
  #fit: will resize the image to fit the screen it is loaded into
  #paste: will not resize
  #left #center #right: horzintal alignement
  #top #middle #bottom: vertical alignement
  Example:
  ```
  Screen Open 0, 1920, 1080, 32, Lowres
  Cls 0
  Load Image "my_image.jpg", 0, "#fit #center #middle"
  ```
  Load and display an image centered on the screen on a black background.

* #runtime #bug #crash #bobs #_=sprite_col

  Sprite Col crashed the application.

### Version 0.9.6.4

I have temporary set the collision detection only to boxed. Scaled sprites and bobs were not working and it is late.
Yet, it now works with scaled or rotated bobs and sprites, also with screens in hires or lowres and does not crash anymore (zone calculation is finally correct).
So you can develop, just know that the precision of the collisions will be correct next week...

* #runtime #bug #crash #collisions #_bob_col #_bobsprite_col #_spritebob_col #_sprite_col
  Crash with rotated bobs or sprites.

* #runtime #bug #crash #sprites #_sprite_scale
  Sprite Scale Used to crash.

* #runtime #bug #crash #sprites
  Several reasons of crash with sprites.

* #runtime #bug
  All debugging code now automatically removed for release versions

* #runtime #bug #math #_fix
  When using Fix, you cannot have anymore -0.00...

* #transpiler #feature #tags #_ifdef #_ifndef #_else #_end_if #_let #_define
  The transpiler now supports C-like compilation options. Further doc and examples to come.
  #define VARIABLE (will set it's value to zero)
  #let VARIABLE = value or #left VARIABLE = "string"
  #if VARIABLE = value or #if VARIABLE = "string"
  #ifdef VARIABLE
  #ifndef VARIABLE
  #else
  #endif or #end if

  You can also use --define VARIABLE as a command line option of the transpiler.
  Note that you cannot do calculations in tags (and I will not implement it ;)

* #transpiler
  The transpiler now copes with applications that consists of only o0ne .aoz file, and does not force the creation of any resources folder. In this case, the HTML folder is created besides the application (not tested).

* #transpiler #feature #include
  You can now include aoz code directly from the AOZ Resources drive folder, with the drive "aoz:"
  ```
  Include "aoz:my_includes/my_code.aoz"
  ```
* #runtime #_true #_false
  TRUE and FALSE returned strings with the name 'true' and 'false' instead of the numerical values 1 and 0.










### Version 0.9.6.3

Bugs in yesterday's version, I was too tired to do a proper test at 22:30 yesterday... :|
Actually, as I was a bit stressed I did correct quite a few bugs in a couple of hours :) ... and annoying ones...

#### Runtime

* #runtime #bug #collisions #_bob_col #_bobsprite_col #_spritebob_col #_sprite_col
  You no longer get an "bob/sprite not defined" if you test a bob or sprite that does not exist.
* #runtime #bug #collisions #_bob_col #_bobsprite_col #_spritebob_col #_sprite_col
  Removed debugging code in the collision dettection routines thqat displayed the intersection between
  the objects on top of screen.
* #runtime #bug #crash #collisions
  The runtime crashed if you performed collision detections on bob and sprites with images obtained from a LOAD .abk... (worked if the images were in the resource folder of the application)...
* #runtime #bug #renderer #bobs
  Removed some debugging code that draw a gray bar behind every bob
* #runtime #bug #crash #sprites
  Cleaning and reasons to crash removed from the sprites code.
* #runtime #bug #banks #images
  Load of an image bank (#1) now loads the palette and the hotspots! (Y)
* #runtime #bug #screens #_ink
  I finally understood that the second parameter of the INK command is the color of the back of hte patterns and NOT the number of the pattern.
  The AMOSPro manual is very confusing about this and it was not clear to me.
* #runtime #bug #sounds #bell
  The RATE parameter of the BELL instruction now has an effect, as close as possible for the moment as the original, but do not expect the same exact pitch...
* #runtime #bug #crash #sprites #_sprite_off
  Sprite Off used to crash.
* #runtime #bug #crash #sprites #_sprite_priority
  Sprite Priority used to crash.
* #runtime #_limit_mouse
  Limit Mouse is now implemented.
* #runtime #fonts #amigafonts
  The size of the Amiga fonts in a screen are now correct.
* #runtime #bug #display #_autoback
  Autoback 1 does not prevent the draawing of the screen anymore.


### Version 0.9.6.2

Continuation of the global cleaning, still some work to do on collision detection...
Warning: rotated or skewed screens still do not work, please avoid.

#### Runtime

* #runtime #bug #loops #_for #_next
  For / Next loops are now restored to the standard in Basic, the loop is ALWAYS executed once...
* #runtime #feature #loops #_for #_next
  Warning messages in case of "For / Next loop not entered" have been clarified
* #runtime #bug #collisions #sprites #bobs
  Collision detection now works and is pixel precise.
  WARNING! In this version, collisions between Bobs and Sprites when Bobs are on a HIRES or LACED screen will be incorrect!
* #runtime #bug #fonts
  Amiga font size used to be too large.
* #runtime #bug #renderer #bobs
  Bobs were incorrectly drawn on a Hires or Laced screen
* #runtime #bug #crash #renderer #sprites
  Sprites made the runtime crash
* #runtime #bug #crash #amal
  Many crashes removed from AMAL
* #runtime #bug #crash #amal
  AMAL now reports errors in the string
* #runtime #bug #crash #amal
  AUtotest did not work...
* #runtime #bug #crash #amal #sprites
  AMAL channels assigned to a sprite used to crash

#### Transpiler

* #transpiler #feature
  You can now transpile directly a .aoz file without having a Resource folder. If you compile "my_application.aoz", the HTML will be put in a folder besides the aoz file named "my_application_html".
* #transpiler #bug #screens #_set_alpha
  The instruction made the transpiler generate an error.

### Version 0.9.6.1

Quick fix of several annoying bugs in this version. Sorry I had not time to fix AMAL! For next version.

#### Runtime

* #runtime #bug #bobs #sprites #images
  Hrev / Vrev / Not working (bug# 290)
* #runtime #bug #crash #collisions #_bob_col #_bobsprite_col #_spritebob_col #_sprite_col
  Crashed at runtime. (bug #20)(bug #263)
* #runtime #bug #crash #sprites #_sprite
  Used to crash. Bug #110
* #runtime #bug #crash #rainbows
  Crash if a rainbow was defined yet without having used the Set rainbow instruction (crash in the renderer). Bug #125
* #runtime #bug #strings #_mid$ #_left$ #_right$
  Crash when doing, in certain conditions, Right$( array, XXX ) = value. Bug #131
* #runtime #bug #amiga #pc #stos #amos #_for #_next
  In Amiga mode, the loop was not entered in case of "For X = 10 To 10"... now it runs once.
  In PC mode, follows the standard of today: in such case the loop is NOT entered.
  Bug #259 Bug #280

#### Transpiler

* #installer #bug #filesystem #defaultdrive
  The path to the default drive was not correct in Windows version. (bug #272)



---



### Version 0.9.6

A lot of cleaning of the installation, and the making of the Linux and macOS version to be released later today.

#### IDE

- #ide #vscode #bug
  Save aozip does not include the "html" folder anymore.

#### Runtime

- #runtime #bug #structure #_for #_next
  Loops like For X = 1 To 1 did not enter at all.



----------

### Version 0.9.5.1

A few major bugs made version 0.9.5 "not so great".

#### Transpiler

- #transpiler #bug #tags #_googleFonts
  Tags with string were improperly read, making other tags being skipped (Google Font tags not working problems).
- #transpiler #bug #structure #_for #_next
  For / Next loops stopped at loop n < end  value instead of <=

#### Runtime

- #runtime #bug #crash #screens #_bar
  Crash when using the second syntax with width and heigth

#### Installation

- #installation #tutorial
  New tutorials "Alpha Invaders 1" and "Alpha Invaders 2" by Paul Kitching
- #installation #demos
  New demo: "Fireworks" by Paul Kitching.
- #installation #defaultresources #filesystem
  The "Objects" folder (and any folder containing the word "obj")  were not copied in the installation



----------



### Version 0.9.5

A lot of changes in this version, the product is getting more refined, the mess is going away.

You will see new tags in this file. I am going to make a small utility (in AOZ of course), to display the change log in an interactive way, and allow searching for tags. This way, it will be very easy to find things when the list gets huge in a couple of years.

**Last minute note:**

If you have a Wait instruction inside of an application that runs in PC mode, you have to change the value of the parameter. To comply with standards, where time is expressed in seconds and not in 1/50th or 1/1000th of seconds, in PC mode, the parameter of the Wait instruction is from now on in SECONDS.

In PC mode, it was before expressed in 1/1000th of a second.

So basically-> divide all by 1000.

You can of course wait for less than one second, just use a floating point number, like this:

Wait 0.5 ... will wait for half a second.

etc.

#### Transpiler

- #transpiler #tags #debugger
  New tag: **checkForNextLoops**, will at runtime indicate if a for/next loop is susceptible to hang the browser (with a Step equal to zero), or been skipped (this one will be replaced by a 'runtime warning' in a future version). I will add more of this debugging help tags in the future.
- #transpiler #bug #crash #json
  Crash of the transpiler when the transpilermanifest.hjson file was not found.
- #transpiler #bug #filesystem
  Some files where not included with from the default filesystem folder.
- #transpiler #bug #filesystem
  Files present in extension resources / filesystem folder were not copied in the transpiled application.
- #transpiler #bug #tags #_basicRemarks
  In non "Basic Remarks" mode (tag "basicRemarks"), where ' are NOT tokenised as remarks, a " ' " within a remark of a Javascript section induced a "Stri9ng not closed" error.
- #transpiler #bug #_global #_shared
  Global did not mark the variables as "defined" and generated a "Variable not defined" warning message.
- #transpiler #bug #_operators
  The power operator "^" was not understood by the transpiler.
- #transpiler #bug #amos
  Extra resources folders were created for certain applications during import.
- #transpiler #bug #rainbows #_rain
  The Rain instruction was not recognised by the transpiler.
- #transpiler #bug #tags
  You can now have a remark after a tag on the same line. Yet, only one tag per line!

#### Runtime

- #runtime #bug #crash #runtime #rainbows #sounds
  The presence at the same time of a rainbow and sounds in the application made it crash.
- #runtime #bug #crash #runtime #amal #_channel
  Channel To Screen Display crashed.
- #runtime #feature #debugging #_for #_next #_step
  Implementation of a 'runtime--checking' system with a new tag "checkForNextLoops"
- #runtime #bug #crash #_bob_clear
  Made the application crash.
- #runtime #bug #rainbows #_rainbow_display
  The height of the rainbow was not properly calculated.
- #runtime #bug #crash #amal
  Many sources of crash removed in AMAL instructions and functions.
- #runtime #bug #mouse
  The coordinates of the mouse were "undefined" at the start of the application until the user moved the cursor over the display.
- #runtime #bug #time #_timer
  The timer instructions and functions did not work properly.
- #runtime #feature #time #_timer
  The "Timer" function now reports 'ticks' (1/50th of a second) in Amiga mode, and seconds (as a floating point number) in PC mode.
- #runtime #feature #time #_wait
  The "Wait" instruction now accepts 'ticks' (1/50th of a second) in Amiga mode, and seconds (as a floating point number) in PC mode.
- #runtime #bug #keyboard #_scan_code #_inkey$
  Conversion from Javascript to Amiga keyboard scan code is now correct. In Amiga mode, when you press on the key of a PC, it's scan-code is converted into it's Amiga equivalent. In PC mode, scan-codes report the actual Javascript keycode.
- #runtime #bug #display #_dual_playfield
  The Dual Playfield instruction inverted the front and back screen.
- #runtime #bug #mouse #screen #display @#_scin
  =ScIn() fuunction did not work.
- #runtime #bug #mouse #textwindows #_mouse_zone
  The zone instruction did not report the correct zones.
- #runtime #bug #crash #rainbows #amal #_channel
  The Channel To Rainbow instruction made the application crash.
- #runtime #bug #crash #banks #_bank_swap
  The Bank Swap instruction induced problems later in the banks of the application that lead to crashes.
- #runtime #bug #fonts #amiga #_baseline
  The baseline of the Amiga fonts was incorrectly calculated.
- #runtime #bug #display #screens #_cls
  The Cls instruction was using color 1 to clear the screens if no parameters were given in both Amiga and PC mode. It now uses 0 in PC mode.
- #runtime #bug #display #sprites
  Sprites were not displayed by the renderer.
- #runtime #feature #display
  In PC mode, the size of the font used to display the characters in the text window of the screen (with Print) has been reduced in size, and now the default window in PC mode is 80x25 characters.
- #runtime #bug #crash #sounds #_vumeter
  The VuMeter function made the application crash.

#### Language modules

- #new #module #html #dom
  New DOM instructions allowing you to display and manage HTML elements. Run the "WebSite" application located in the "Demos" folder for a demonstration. Documentation to come. This module will grow!
  Written by Baptiste Bideaux.

- #new #module #map

  New MAP instructions and functions allowing you to display in a simple manner complex game maps. Such maps can be created using external tools, or manually in the new "aozmap" file format. Look at the BOAX game example using this module, to be found in the "Games" folder.
  Written by Baptiste Bideaux.

- #update #module #tracker
  The Javascript library used to play Tracker files has been changed, it now uses "Bassoontracker", which provides better playing, more features, and understand more format. Documentation to come.

#### Extensions

- #extensions #new #arcgis
  New "Arcgis" extension, part of a personal project. Display data from the Internet, work in progress.

#### Installation

- #installation #feature
  The "AOZ Studio Application" folder has been re-organized with a new"Games" folder, a new "Tutorials" folder, and the "Examples" folder being moved inside.

- #installation #games #newgame
  BAOX -> reflection game and demonstration of the new Map language module.

- #installation #games #newgame
  BrickBasher -> simple Arkanoid clone

- #installation #games #newgame
  Gravity -> Space game based on Gravity principle. Very nice to play.

- #installation #games #newgame
  Jewels -> exported from the Amiga

- #installation #games #newgame
  Solitaire -> a game for you if you work in an office!

- #installation #games #newgame
  The Game of Life -> a simple, for the moment, yet fast and fun to watch version of the famous program. Watch the cells evolve at 50 FPS!

- #installation #tutorials #newtutorial
  AOZ Studio Lessons -> from 1 to 3, a new series of tutorial "to be read while coding", written by Laurant and Neil. Many more to come!

- #installation #tutorials
  The content of the "Examples" folder has been moved inside a "Fro0m AMOSPro Dics" folder.



### Version 0.9.4

A version that, I hope, begins the be really use-able.

#### Transpiler

* **Default Filesystem folder.**
  The transpiler now supports a default filesystem folder, located in the binary directory of AOZ Studio (located in <user name>\appdata\roaming\default resources\filesystem).
  Any folder located in the root of this directory represents a "possible" drive in the transpiled application. During transpilation, the transpiler locates the instruction that need a file, like "load", "load iff", "load image", "open", etc. If the parameter this instruction in the code is a constant string, then the path applied to the folders inside of the default filesystem directories, and if the file is located, it is included in the transpiled application.
  You will find in this folder in the current version the original AMOSPro discs, like the AMOSPro_Examples disc, meaning that all examples will work without you having to care about the files.



* **Manifest is gone!**
  The transpiler can now work without the presence of a manifest.hjson file inside of the application directory.

  - No manifest or tag: "PC" mode
  - A manifest file is present: it is loaded
  - A tag is present in the source code of the application,
    #manifest:"pc" or
    #manifest:"amiga"
    then the relevant manifest is loaded, from the AOZ Studio Beta/Default folder (in the binary folder of AOZ Studio)>



* **Tags in source code.**
  You can now use tags at the beginning of the source code, to quickly indicate compilation options and/or runtime options. List of tags:

  	#manifest:"pc" / "amiga" -> transpilation mode

  	#speed:"fast" / "safe" / "graphics" -> if your application hangs the browser in "fast", use "safe" (or put Wait Vbl in the main loop! ;)

  	#tvStandard:"PAL" / "NTSC" -> Amiga screen emulation

  	#displayWidth:NUMBER -> width of the canvas in the browser in pixels
  	#displayHeight:NUMBER -> height of the canvas in the browser in pixels

  	#fullPage:true / false -> full page mode at start of application

  	#fullScreen:true / false -> full screen mode at start of application

  	#keepProportions:true / false -> in full screen, use black side bars to keep proportions

  	#fps::true / false -> display FPS indicator

  	#googleFont:"font name" -> adds a font to the list of Google Fonts.

  	#amigaFont:"font name" -> add a font to the list of Amiga fonts.

  	#splashScreen:true / false -> display a splash screen at start of the transpiled application.

  	#splashWaitSounds:true / false -> if the application contains sounds and if a splash screen is used, then this splash screen will ask for the user to click to start the application, ensuring that the sounds can be heard in the browser.

  	#sendCrashReport:true / false -> automatically send a crash report to AOZMine bug report system if the runtime application crashes.

  	#rainbowMode:"fast" / "slow" -> in slow mode, rainbows are created by remapping the display canvas before display, and can slow down the application for large ones. In "fast" mode, a canvas is a screen, with less possible use (working on that).

  	#saveTo:PATH_TO_FOLDER -> indicates where to put the HTML folder

  	#clean:true / false -> erases the HTML folder of the application at start, enforcing its complete re-transpilation. Useful to remove garbage from the folder at the end of development.

  	#cleanExtensions:true / false -> erases the HTML folder of all extensions at start, enforcing their re-transpilation.

  	#cleanModules:true / false -> same option for language modules

  	#log:true / false -> forces the transpiler to log all output mode

  	#logTo:PATH -> path to the transpiler log

  	#basicRemarks:true / false -> true: allow ' as indicator of remarks, you cannot use it in strings. False, ' cannot be used as remark and you can have
  	A$ = 'a string "like this" with brackets in it, "as in Javascript"!'

  	#tabWidth:NUMBER -> width of the tabulation in the source code produced by the transpiler

  	#noWarning:"name_of_the_warning" -> allows to you remove the warnings generated by the transpiler. List of warnings:
  		'font_not_found'
  		'garbage_found_in_folder'
  		'font_not_supported'
  		'file_at_root_of_filesystem'
  		'screen_not_multiple_of_font_size'
  		'missing_folder'
  		'missing_resources_folder'
  		'creating_directory'
  		'cannot_set_permissions'
  		'illegal_bank_element_filename'
  		'file_to_include'
  		'transpiler_manifest_not_found'
  		'illegal_transpiler_manifest'
  		'bad_version_of_transpiler_manifest'
  		'copying_file_to_filesystem'
  		'variable_not_declared'
  		'instruction_not_implemented

* .HJSON system files are now hidden, located in a folder of the AOZ Studio Beta binary folder.



#### Bugs

List of bugs marked as "resolved" in this version. Please confirm by marking them as "closed" in the AOZMine system...

|                                                              |
| ------------------------------------------------------------ |
| Proc  CHANGE[M] fails to compile.                            |
| Right$()=, Left$()= and Mid$()=  Causing compiler to hang, leaving process running. |
| Rol.b  and Ror.b cause syntax errors.                        |
| filesystem Drive not found  errors                           |
| RAINBOW  only affecting the border                           |
| Min and Max doesn't work with  strings - Type mismatch error |
| Rainbow  commands cause Chrome, VSCode, and Windows to become unstable and  unresponsive. |
| Requst Wb and Request On cause  syntax errors.               |
| Get  Icon: Instruction not implemented.                      |
| Dir$ not used when opening files  that don't specify a drive/volume. |
| Field  statement fails on Random file.                       |
| Flash fails to compile with type  mismatch                   |
| Converter  is not converting Icon Bank correctly             |
| Rainbow Colours                                              |
| Calling  Shoot or Boom too quickly in succession causes Internal error |
| Fonts in 'Brown fox over lazy  dog" demo                     |
| Val  function only converts integer portion of string.       |
| Sam Play not working                                         |
| New AOZ  Application button creates an application with a bad manifest. |
| System variable 'Screen' not  working                        |
| Can't  get Bload to work.                                    |
| LOCATE not compatible with  manifest PC+Fullscreen           |
| Talk,  Say, and Mouth commands produce syntax errors.        |
| Get Fonts causes Internal error.                             |
| filesystem  Drive not found errors again.                    |
| Help_65 from the AmosPro  Examples : browser memory overflow |
| Help_16  : Illegal text window parameter at line: 90         |
| Sam Stop - internal error                                    |
| Sin,  Cos, Tan, HSin, HCos, HTan - Black screen              |
| Fast Free and Chip Free compile,  but return Internal errors. |
| Missing  ")" on line 103 of V1_0_Sprites.js                  |
| Splash screen                                                |
| Syntax  error and line number not reported                   |
| Clicking "New AOZ  Application" button fails.   (Previously worked.) |
| Wind size not working                                        |

#### Editor

* new "Load AOZ Application" and "Save AOZ Application" buttons, saving and loading an '.AOZIP" file with the folder of the application.
* many bugs corrected in the buttons, they should always work now
* "Import AMOS Application" now converts the icons properly







---

### Version 0.9.3.1

A lot of bugs removed in this version. I had to re-write the whole expression evaluation system in the transpiler, the code was not good enough. It is now a a sexy part of recursive code, and this has solved many problems. This explains the delay for this version (sorry guys, doing what I can! ;)

You will find all the examples converted in the "Examples" folder. Please note that I have only tested up to #25, do not waist time on testing and reporting bugs on them, I will see them tomorrow (the bugs!).

Altogether, this version should report a lot less compilation errors and runtime crashes. Finger crossed!

See you in the next one! Francois

#### Transpiler

* Cleanup of transpiler crashing: protection against endless loops, and proper error report
* X Mouse = INTEGER , Y Mouse = INTEGER not working, causing Syntax Error
* Rol.b and Ror.b cause syntax errors.
* Right$()=, Left$()= and Mid$()= Causing compiler to hang, leaving process running.
* Restore VARIABLE reports a syntax error
* Restore to  expression not implemented.
* Proc CHANGE[M] fails to compile.
* Print At fails when 2nd parameter omitted.
* Limit Bob causes the compiler to hang on the second pass.
* LABELS FOLLOWING PROCEDURES CAUSING INTERNAL ERROR AND CALL CAUSES SYNTAX
* If X Bob(1)>X Bob(2)
* if Amreg(13) < 0
* Gosub using variable fails
* filesystem Drive not found errors
* error subtract X Bob(1)-X Bob(2))
* Adding hex value to int SUM = 318+$8000,
* Labels as numbers did not work

#### Runtime

* Memorize X/Y - Remember X/Y did not work
* HScroll used to crash
* Get Palette crashed at runtime
* Labels located after a End Proc were not compiled
* Text Windows Writing crashed

* Wind Size not working.
* The demo program you made for my web Amos2 IDE does not work anymore
* Patterns have reversed colours
* Input command - missing ? when using a string
* Get Sprite returns Internal Error
* Get Palette 0 returns Internal error.
* Free returns undefined
* Default causes Internal Error
* Cursor commands broken (cdown$, etc)
* Centre command
* Can't use At more than once in a line.


### Version 0.9.2.6

Rainbows! :) ... and bugs. Please note that rainbows have two modes, 'slow' and 'fast'. Fast is only implemented now (only 1/4 left, for next version the code is nearly ready). In FAST mode, the rainbows are rendered in a hidden screen, and simply pasted before everything. Good for rainbows on color #0... 'Slow'  mode does a re recalculation of the colors and a remap. It will work for the next version.

But the programs using this instruction WILL compile. :)

Transpiler

* Bug#1 If Amreg( X ) used to report a syntax error when transpiling
* Bug#3: Restore VARIABLE reported a syntax error
* Bug#4 Right$() =, Left$() =, Mid$() = hanged the transpiler

Runtime

* Bug#2: Mouse Click did not report middle and right buttons



---

### Version 0.9.2.5

Big work on memory banks related to the system of contexts. Memory banks should now work. And some annoying bugs related to Global and Shared.

#### Transpiler

* Cleaning of transpiler error messages, all should be correct now

* The transpiler now only creates the necessary folders in the html/resources folder

* Complete cleaning of all bank management system

* Correction of importation of AMOS application, does not crash anymore, Crunchman is properly converted (still does not work in this version-> for tomorrow)

* You can also specify the number of a bank, in the resource directory, just prefix it with the number and a dot, and then the name of the bank...

  For example:

  ```
  resources
  	1.images
  	2.icons
  	5.samples
  	10.data
  	11.tracker
  	12.picpac
  ```

  This allows you to have several image banks, for example:

  ```
  resources
  	1.images (the main bank)
  	10.images (alternate bank)
  ```

  Please note that Bank Swap has not been worked on, it certainly does not work in this version

* The same system of naming is also available to the elements included in a bank. For example, in the image bank, you can now name the images...

  ```
  1.images
  	1.hello.png
  	2.ball.png
  5.samples
  	1.noise.wav
  	2.wind.wav
  	3.music.wav
  ```

  And now, you can do: (not completely checked, may still report type mismatch, corrected for next version).

  ```
  Bob 1, 100, 100, "ball"
  Bob 1, 100, 100, 2
  Sam Play "music"
  Sam Play 3
  ```

  If you do not name the file, then you will only be able to use their number. Same, if you only provide a name, you will only be able to use tit by its name...

#### Runtime

* Global now works correctly
* Shared now works as in the original AMOS
* Complete cleaning of all bank management system
* Reserve / Erase / List bank / Start( ) / Length() now work
* Poke Doke Loke Peek Deek Leek etc. now work

#### Demos

* New demo in the demo folder: Gravity



---

### Version 0.9.2.4

Many bugs removed. Thank you for your help.

#### Manifest

* new property: fileSystem.caseInsentitive ... indicates if the path within the application are sensitive to the case. If you use an old manifest, they will NOT be (emulates the Amiga).

#### Transpiler

* Print At( x, y ) + "hello" reported a type mismatch error
* Binary numbers used to report syntax error

#### Runtime

* Restore did not restore at the correct position
* Bob Off number used to crash
* Dir displayed the name of files wrong
* Dir used to crash if you had files in the local storage
* Paste Block / Paste CBlock now works from screen to screen
* The application used to start before the first font was loaded, hence a "Font not defined" error if the program did a "Text" immediately after the beginning
* File-system is not case-insensitive, as on the Amiga, or not.
* Wind Open used to crash
* Wind Move used to crash
* Windows with borders were improperly positioned
* And some more that I have forgotten...

#### Thank you

* Neil
* Paul
* Jean Pierre
* Rafal
* Sorry for the ones I forget.



-------

### Version 0.9.2.3

A lot of problems have been removed since version 0.9.2.1. Thank you for your patience. Please note that there is no version 0.9.2.2, to avoid confusion after a mistake on the web-site...

#### Transpiler

* X Screen( screen#, x ) / Y Screen( screen#, y ): parameter screen and coordinates used to be inverted

- Variables marked as 'Global' were not global anymore in a procedure called within another procedure
- The transpiler used to crash when working on an application where the "resources" folder was not defined. I now just generates a warning. (that bug was a cause of a lot of crashes in the demo and example folder).
- Missing brackets in expression could cause the transpiler to hang (and continuously eat memory)
- Error message on the same line at the same column are no longer repeated
- IF / THEN on the last line of a code, without carriage return, provoked a Syntax Error
- New compilation tag: #nobank:"bank_name". Include this tag in your code, and the content of the folder representing the memory bank will not be loaded automatically when the application styart,. The bank will be converted to readable offline format... Example of use of this tag in the "amosball" demo.
- All extensions and language modules are now recompiled automatically at each new version of the transpiler, to ensure they work with the new code. Do not be surprised if the very first compilation of an AOZ application takes a little more time.
- Many transpilation errors were incorrectly reported (missing message), and/or generated illegal operations and internal crashes.
- ON xxx GOTO / GOSUB / PROC reported a syntax error
- EVERY xxx PROC reported a syntax error
- RESTORE reported a syntax error
- PRINT #x, "string" reported a syntax error
- An IF / THEN on the last line of a source code, without carriage return generated a compilation error
- Using a array without Dim before used to generated many inconsistent errors, it now generates one single "Array not defined" error.
- Using string in complex comparison expression (for example in IF / END IF) used to generate Type Mismatch errors
- Command line transpiler: warnings are now reported in StdOut and not anymore in StdErr

#### Runtime

- Most of the file-system instructions caused a crash at runtime (Open In, Open Out, Dir, etc.)
- Clip with parameters used to generate a syntax error
- Gr Writing now has an effect, only XOR works for the moment.
- An error when loading a file or image could hand the browser
- "Reserve" memory banks used to crash (still, now code in bank management has not been tested, please wait for further testing)
- A text instruction on the default screen immediately after loading reported a "Font not loaded" error
- PLOT function now responds to GR WRITING xor settings. Yet, if you port an Amiga application, the result on screen will be different, due to how graphics are handle in Javascript. This will be corrected one I implement true Amiga emulation on the graphical side.
- The width of the lines for all line drawing functions was improperly set, and was too thin for screens that are internally scaled
- Text Windows crashed as soon as you were printing past the last bottom line
- CMove used to crash
- Border$ had no effect
- Paper and Pen colour were inverted when drawing Text Window borders

#### IDE

* "Build and Run" button now launches Chrome each time (it did not if the application was generating warnings)

#### Thank you!

Thank you to the following people for their help on this version:

- Paul Kitching
- ising4jesus
- Jason Wroe
- Neil John Yves
- David Baldwin
- Truls Osmundsen
- Tomas Stenstrom
- Alains Bauwens
- Gassman
- Richard Langley
- Neil Halliday
- Mike Carter
- Olivier Bori
- WilliamGolf18

Many thanks for your help... Please carry on testing!
