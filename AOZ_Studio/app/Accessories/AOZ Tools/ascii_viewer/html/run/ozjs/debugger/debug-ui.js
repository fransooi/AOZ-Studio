class DebugUI
{
    constructor( module )
    {
        if( module == undefined || module == null )
        {
            throw "debugger_module_not_defined";
        }

        //
        // Debugger disabled if this program is opened under Atom (like AOZLink...)
        // or if its URL is not localhost
        //
        if( ( window.parent && window.parent.atom ) || ( window.location.href.indexOf( 'http://127.0.0.' ) != 0 && window.location.href.indexOf( 'http://localhost' ) != 0 && window.location.href.indexOf( 'file://' ) != 0 ) )
        {
            return;
        }

        //
        // Debugger Buttons mini bar (step by step, step in, one frame, slow motion, play )
        //
        this.debuggerBar = document.createElement( 'div' );
        this.debuggerBar.setAttribute( 'class', 'debuggerBar' );
        document.body.appendChild( this.debuggerBar );
/*
        this.debuggerToggleBar.setAttribute( 'class', 'debuggerToggleBar' );
        document.body.appendChild( this.debuggerToggleBar );
        var self = this;

        this.debuggerToggleBar.addEventListener( 'click', function( event )
        {
            event.preventDefault();
            if( self.debuggerBar.style.display == 'none' )
            {
                self.debuggerBar.style.display = 'block';
                self.debuggerToggleBar.setAttribute( 'class', 'toggleBar hide' );
                self.debuggerToggleBar.setAttribute( 'alt', 'Hide debugger commands' );
                self.debuggerToggleBar.setAttribute( 'title', 'Hide debugger commands' );
            }
            else
            {
                self.debuggerBar.style.display = 'none';
                self.debuggerToggleBar.setAttribute( 'class', 'toggleBar show' );
                self.debuggerToggleBar.setAttribute( 'alt', 'Show debugger commands' );
                self.debuggerToggleBar.setAttribute( 'title', 'Show debugger commands' );                                
            }
        }, false );
*/
        //
        // Command Buttons mini bar (stop, reload, toggle fullscreen...)
        //
        this.cmdBar = document.createElement( 'div' );
        this.cmdBar.setAttribute( 'class', 'cmdBar' );
        document.body.appendChild( this.cmdBar );

        this.toggleBar = document.createElement( 'div' );
        this.toggleBar.setAttribute( 'class', 'toggleBar hide' );
        document.body.appendChild( this.toggleBar );
        var self = this;

        this.toggleBar.addEventListener( 'click', function( event )
        {
            event.preventDefault();
            if( self.cmdBar.style.display == 'none' )
            {
                self.cmdBar.style.display = 'block';
                self.toggleBar.setAttribute( 'class', 'toggleBar hide' );
                self.toggleBar.setAttribute( 'alt', 'Hide viewer commands' );
                self.toggleBar.setAttribute( 'title', 'Hide viewer commands' );
            }
            else
            {
                self.cmdBar.style.display = 'none';
                self.toggleBar.setAttribute( 'class', 'toggleBar show' );
                self.toggleBar.setAttribute( 'alt', 'Show viewer commands' );
                self.toggleBar.setAttribute( 'title', 'Show viewer commands' );                                
            }
        }, false );

        this.root = module;
        this.root.aoz.orientation = 'landscape';
        this.manifest = this.root.aoz.manifest;

        this.buttons = 
        {
            stop: document.createElement( 'div' ),
            play: document.createElement( 'div' ),
            reload: document.createElement( 'div' ),
            rotate: document.createElement( 'div' ),
            fullscreen: document.createElement( 'div' ),
            chromium: document.createElement( 'div' ),
            debug: document.createElement( 'div' ),
            console: document.createElement( 'div' ),
        }
        this.buttons.play.setAttribute( 'class', 'cmdButton play_icon' );
        this.buttons.play.setAttribute( 'title', 'Replay the program' );
        this.buttons.play.setAttribute( 'alt', 'replay the program' );
        this.buttons.play.addEventListener( 'click', function( e ){ self.clickPlay( e ); } )
        this.buttons.play.style.display = 'none';

        this.buttons.debug.setAttribute( 'class', 'cmdButton debug_icon' );
        this.buttons.debug.setAttribute( 'title', 'AOZ Debugger' );
        this.buttons.debug.setAttribute( 'alt', 'AOZ Debugger' );
        this.buttons.debug.addEventListener( 'click', function( e ){ self.clickDebug( e ); } )
        
        this.buttons.fullscreen.setAttribute( 'class', 'cmdButton fullscreen_icon' );
        this.buttons.fullscreen.setAttribute( 'title', 'Toggle Fullscreen' );
        this.buttons.fullscreen.setAttribute( 'alt', 'Toggle Fullscreen' );
        this.buttons.fullscreen.addEventListener( 'click', function( e ){ self.clickFullscreen( e ); } )

        this.buttons.stop.setAttribute( 'class', 'cmdButton stop_icon' );
        this.buttons.stop.setAttribute( 'title', 'Stop program' );
        this.buttons.stop.setAttribute( 'alt', 'Stop program' );
        this.buttons.stop.addEventListener( 'click', function( e ){ self.clickStop( e ); } )

        this.buttons.reload.setAttribute( 'class', 'cmdButton reload_icon' );
        this.buttons.reload.setAttribute( 'title', 'Reload the program' );
        this.buttons.reload.setAttribute( 'alt', 'Reload the program' );
        this.buttons.reload.addEventListener( 'click', function( e ){ self.clickReload( e ); } )

        this.buttons.rotate.setAttribute( 'class', 'cmdButton rotate_icon' );
        this.buttons.rotate.setAttribute( 'title', 'Toggle the screen orientation' );
        this.buttons.rotate.setAttribute( 'alt', 'Toggle the screen orientation' );
        this.buttons.rotate.addEventListener( 'click', function( e ){ self.clickRotate( e ); } )

        this.buttons.chromium.setAttribute( 'class', 'cmdButton chromium_icon' );
        this.buttons.chromium.setAttribute( 'title', 'Javascript console' );
        this.buttons.chromium.setAttribute( 'alt', 'Javascript console' );
        this.buttons.chromium.addEventListener( 'click', function( e ){ self.clickChromium( e ); } )

        this.buttons.console.setAttribute( 'class', 'cmdButton console_icon' );
        this.buttons.console.setAttribute( 'title', 'Aoz console' );
        this.buttons.console.setAttribute( 'alt', 'Aoz console' );
        this.buttons.console.addEventListener( 'click', function( e ){ self.clickConsole( e ); } )

        this.cmdBar.appendChild( this.buttons.stop );
        this.cmdBar.appendChild( this.buttons.play );
        this.cmdBar.appendChild( this.buttons.reload );
        this.cmdBar.appendChild( this.buttons.rotate );
        this.cmdBar.appendChild( this.buttons.fullscreen );
        this.cmdBar.appendChild( this.buttons.chromium );
        this.cmdBar.appendChild( this.buttons.console );
        this.cmdBar.appendChild( this.buttons.debug );

        this.debuggerButtons = 
        {
            setup: document.createElement( 'div' ),
            //doBreak: document.createElement( 'div' ),
            stepIn: document.createElement( 'div' ),
            stepOver: document.createElement( 'div' ),
            skip: document.createElement( 'div' ),
            //stepEnd: document.createElement( 'div' ),
            stepSlow: document.createElement( 'div' ),
            runSlowMotion: document.createElement( 'div' ),
            runFullSpeed: document.createElement( 'div' ),
            help: document.createElement( 'div' ),
            debuggerTitle: document.createElement( 'div' ),
            spacer1: document.createElement( 'div' ),
            spacer2: document.createElement( 'div' ),
            spacer3: document.createElement( 'div' ),
        }

        this.debuggerButtons.spacer1.setAttribute( 'class', 'debuggerSpace spacer_icon' );
        this.debuggerButtons.spacer2.setAttribute( 'class', 'debuggerSpace spacer_icon' );
        this.debuggerButtons.spacer3.setAttribute( 'class', 'debuggerSpace spacer_icon' );

        this.debuggerButtons.setup.setAttribute( 'class', 'debuggerButton setup_icon' );
        this.debuggerButtons.setup.setAttribute( 'title', 'Debugger Setup' );
        this.debuggerButtons.setup.setAttribute( 'alt', 'Enter the configuration screen of Aoz Debugger' );
        this.debuggerButtons.setup.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'setup' } ); } );

        this.debuggerButtons.stepIn.setAttribute( 'class', 'debuggerButton stepin_icon' );
        this.debuggerButtons.stepIn.setAttribute( 'title', 'Step In (F9)' );
        this.debuggerButtons.stepIn.setAttribute( 'alt', 'Executes the next instruction (enters procedures) and stop at the next instruction' );
        this.debuggerButtons.stepIn.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'stepIn' } ); } );

        this.debuggerButtons.stepOver.setAttribute( 'class', 'debuggerButton stepover_icon' );
        this.debuggerButtons.stepOver.setAttribute( 'title', 'Step Over (F10)' );
        this.debuggerButtons.stepOver.setAttribute( 'alt', 'Run the program (even procedures) and stop at the next instruction' );
        this.debuggerButtons.stepOver.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'stepOver' } ); } );

        this.debuggerButtons.skip.setAttribute( 'class', 'debuggerButton skip_icon' );
        this.debuggerButtons.skip.setAttribute( 'title', 'Skip Next Instruction (F11)' );
        this.debuggerButtons.skip.setAttribute( 'alt', 'Avoid the next instruction (do not call it)' );
        this.debuggerButtons.skip.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'skip' } ); } );

        this.debuggerButtons.stepSlow.setAttribute( 'class', 'debuggerButton stepslow_icon' );
        this.debuggerButtons.stepSlow.setAttribute( 'title', 'Step slowly in the program' );
        this.debuggerButtons.stepSlow.setAttribute( 'alt', 'Call each instruction every 1/2 second' );
        this.debuggerButtons.stepSlow.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'stepSlow' } ); } );

        this.debuggerButtons.runSlowMotion.setAttribute( 'class', 'debuggerButton runslow_icon' );
        this.debuggerButtons.runSlowMotion.setAttribute( 'title', 'Run the program in slow motion' );
        this.debuggerButtons.runSlowMotion.setAttribute( 'alt', 'Run the program at one frame per second (change in debugger settings)' );
        this.debuggerButtons.runSlowMotion.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'runSlowMotion' } ); } );

        this.debuggerButtons.runFullSpeed.setAttribute( 'class', 'debuggerButton runfast_icon' );
        this.debuggerButtons.runFullSpeed.setAttribute( 'title', 'Run the program at full speed (F8)' );
        this.debuggerButtons.runFullSpeed.setAttribute( 'alt', 'Resume the execution of the program' );
        this.debuggerButtons.runFullSpeed.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'runFullSpeed' } ); } );

        this.debuggerButtons.help.setAttribute( 'class', 'debuggerButton help_icon' );
        this.debuggerButtons.help.setAttribute( 'title', 'Debugger Help' );
        this.debuggerButtons.help.setAttribute( 'alt', 'How to use the debugger' );
        this.debuggerButtons.help.addEventListener( 'click', function( e ){ self.root.clickUI( { self: this, ID$: 'help' } ); } );

        this.debuggerButtons.debuggerTitle.setAttribute( 'class', 'debuggerTitle' );
        this.debuggerButtons.debuggerTitle.setAttribute( 'left', 'debuggerTitle' );
        this.debuggerButtons.debuggerTitle.textContent = 'Aoz Debugger - Pause';

        //this.debuggerBar.appendChild( this.debuggerButtons.doBreak );
        //this.debuggerBar.appendChild( this.debuggerButtons.spacer );
        this.debuggerBar.appendChild( this.debuggerButtons.stepIn );
        this.debuggerBar.appendChild( this.debuggerButtons.stepOver );
        this.debuggerBar.appendChild( this.debuggerButtons.skip );
        this.debuggerBar.appendChild( this.debuggerButtons.stepSlow );
        this.debuggerBar.appendChild( this.debuggerButtons.spacer1 );
        this.debuggerBar.appendChild( this.debuggerButtons.runSlowMotion );
        this.debuggerBar.appendChild( this.debuggerButtons.runFullSpeed );
        this.debuggerBar.appendChild( this.debuggerButtons.spacer2 );
        this.debuggerBar.appendChild( this.debuggerButtons.setup );
        this.debuggerBar.appendChild( this.debuggerButtons.help );
        this.debuggerBar.appendChild( this.debuggerButtons.debuggerTitle );
        this.showDebuggerBar( false )
        
        this.view = "normal";
        this.refreshBar();
    }

    getDebuggerButton( name )
    {
        return this.debuggerButtons[ name ];
    }

    setDebuggerTitle( text )
    {
        this.debuggerButtons.debuggerTitle.textContent = text;
    }
    showDebuggerBar( onOff )
    {
        this.debuggerBarOn = onOff;
        if ( onOff )
        {
            this.debuggerBar.style.display = 'block'
        }
        else
        {
            this.debuggerBar.style.display = 'none'
        }
    }

    clickStop( e )
    {
        this.buttons.stop.style.display = 'none';        
        this.buttons.play.style.display = 'inline-block';
        this.root.aoz.break = true;      
    }

    clickPlay( e )
    {
        this.buttons.play.style.display = 'none';        
        this.buttons.stop.style.display = 'inline-block';
        this.clickReload( e ); 
    }

    clickReload( e )
    {
        var message = 
        {
            module: 'debugger',
            method: 'storeTempData',
            options: { data: { view: this.view } }
        }
        this.root.debugEvents.sendMessage( message )
        
        var self = this;
        setTimeout( function()
        {
            var message = 
            {
                module: 'debugger',
            method: 'reload',
            options: {}
        }
            self.root.debugEvents.sendMessage( message );    
        }, 500 );
    }

    reloadDebug( e )
    {
        var message = 
        {
            module: 'debugger',
            method: 'storeTempData',
            options: { data: { view: 'debug' } }
        }
        this.root.debugEvents.sendMessage( message )
        
        var self = this;
        setTimeout( function()
        {
            var message = 
            {
                module: 'debugger',
                method: 'reload',
                options: {}
            }
            self.root.debugEvents.sendMessage( message );    
        }, 500 );
    }

    toggleDevTools( e )
    {
        var message = 
        {
            module: 'debugger',
            method: 'openDevTools',
        }
        this.root.debugEvents.sendMessage( message )
    }

    clickRotate( e )
    {
    }

    clickFullscreen( e )
    {
        var message = 
        {
            module: 'debugger',
            method: 'toggleFullscreen',
            options: {}
        }

        this.root.debugEvents.socket.send( JSON.stringify( message ) );
    }

    clickChromium( e )
    {
        var message = 
        {
            module: 'debugger',
            method: 'openDevTools',
            options: {}
        }
        this.root.debugEvents.socket.send( JSON.stringify( message ) );       
    }

    clickConsole( e )
    {
        this.root.consoleOnOff();
    }

    clickDebug()
    {
        if( this.view == "normal" )
        {
            if ( this.root.aoz.break )
                this.reloadDebug();
            else
            {
            this.view = "debug";
			this.root.debugOn( { visible: true, mode: 'play' } );
            }
        }
        else
        {
            this.view = "normal"
			this.root.debugOff( {} );
        }
        this.updateView();
    }

    refreshBar()
    {
        this.cmdBar.style.zIndex = 5000;
        this.debuggerBar.style.zIndex = 5000;
        var self = this;
        setTimeout( function()
        {
            self.refreshBar();
        }, 1500 )
    }

    updateView()
    {
    }
}