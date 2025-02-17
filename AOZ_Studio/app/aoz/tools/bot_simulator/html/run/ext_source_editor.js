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
// The Source Editor Extension
// By Francois Lionet
// Version 1
// 14/08/2021
// (c) AOZ Studio 2021 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_source_editor( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFNvdXJjZSBFZGl0b3IgRXh0ZW5zaW9uIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0IiwidmVyc2lvbiI6IlZlcnNpb24gMSIsImRhdGUiOiIxNC8wOC8yMDIxIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAyMSAtIE9wZW4gU291cmNlIiwic3RhcnQiOiJzb3VyY2VlZGl0b3IuYW96IiwibmFtZSI6InNvdXJjZWRpdG9yIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6WyJlZGl0b3JfYWxyZWFkeV9vcGVuZWQ6IEVkaXRvciBhbHJlYWR5IG9wZW5lZCAoaW5kZXg6ICUxKSIsImVkaXRvcl9ub3RfZm91bmQ6IEVkaXRvciBub3QgZm91bmQgKGluZGV4OiAlMSkiLCJjb25zb2xlX25vdF9mb3VuZDogQ29uc29sZSBub3QgZm91bmQgKGluZGV4OiAlMSkiLCJlZGl0b3Jfbm90X2NvbnNvbGU6IEVkaXRvciBpcyBub3QgYSBjb25zb2xlIChpbmRleDogJTEpIl0sImZyIjpbImVkaXRvcl9hbHJlYWR5X29wZW5lZDogTCIsImVkaXRldXIgZXN0IGRlamEgb3V2ZXJ0IChpbmRleDogJTEpJywiLCJlZGl0b3Jfbm90X2ZvdW5kOiBFZGl0ZXVyIG5vbiB0cm91dmUgKGluZGV4OiAlMSkiLCJjb25zb2xlX25vdF9mb3VuZDogQ29uc29sZSBub24gdHJvdXZlZSAoaW5kZXg6ICUxKSIsImVkaXRvcl9ub3RfY29uc29sZTogQ2V0IGVkaXRldXIgbiIsImVzdCBwYXMgdW5lIGNvbnNvbGUgKGluZGV4OiAlMSknLCJdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_source_editor';
	this.aoz[ "extension" + "Source_editor"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/source_editor/sourceeditor.aoz
		aoz.sourcePos="0:40:0";
		// Javascript
		this.editors = {};
		this.openEditor = function( args )
		{
			if ( this.editors[ args.index ] )
				throw { error: 'editor_already_opened', parameter: args.index };
			this.editors[ args.index ] = new this.SourceEditor( this.aoz, args );
			return this.editors[ args.index ];
		};
		this.closeEditor = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'editor_not_found', parameter: args.index };
			if ( this.editors[ args.index ].vars.console )
				throw { error: 'editor_not_found', parameter: args.index };
			this.editors[ args.index ].destroy();
			this.editors = this.aoz.utilities.cleanObject( this.editors, this.editors[ args.index ] );
		};
		this.getNumberOfLines = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'editor_not_found', parameter: args.index };
			return this.editors[ args.index ].getNumberOfLines();
		};
		this.findLine = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'editor_not_found', parameter: args.index };
			return this.editors[ args.index ].findLine( args );
		};
		this.getWord = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'editor_not_found', parameter: args.index };
			return this.editors[ args.index ].getWord( args );
		};
		this.getLine = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'editor_not_found', parameter: args.index };
			return this.editors[ args.index ].getLine( args );
		};
		this.closeConsole = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'console_not_found', parameter: args.index };
			if ( !this.editors[ args.index ].vars.console )
				throw { error: 'console_not_found', parameter: args.index };
			this.editors[ args.index ].destroy();
			this.editors = this.aoz.utilities.cleanObject( this.editors, this.editors[ args.index ] );
		};
		this.getLastCommand = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'console_not_found', parameter: args.index };
			if ( !this.editors[ args.index ].vars.console )
				throw { error: 'editor_not_console', parameter: args.index };
			return this.editors[ args.index ].getLastCommand();
		};
		this.printConsole = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'console_not_found', parameter: args.index };
			if ( !this.editors[ args.index ].vars.console )
				throw { error: 'editor_not_console', parameter: args.index };
			return this.editors[ args.index ].printConsoleLine( args );
		};
		this.nextConsoleLine = function( args )
		{
			if ( !this.editors[ args.index ] )
				throw { error: 'console_not_found', parameter: args.index };
			if ( !this.editors[ args.index ].vars.console )
				throw { error: 'editor_not_console', parameter: args.index };
			return this.editors[ args.index ].nextConsoleLine();
		};
		this.onChangeSliderV = function( args )
		{
			for ( var e in this.editors )
			{
				var editor = this.editors[ e ];
				if ( editor.sliderV.vars.id == args.ID$ )
				{
					editor.yPosition = args.POSITION;
					editor.sliderVPosition = args.POSITION;
					editor.draw();
					break;
				}
			}
		};
		this.onChangeSliderH = function( args )
		{
			for ( var e in this.editors )
			{
				var editor = this.editors[ e ];
				if ( editor.sliderH.vars.id == args.ID$ )
				{
					console.log( args.POSITION );
					editor.xPosition = args.POSITION;
					editor.sliderHPosition = args.POSITION;
					editor.draw();
					break;
				}
			}
		};
		this.SourceEditor = function( aoz, args )
		{
			this.aoz = aoz;
			this.editor = aoz.ext_source_editor;
			this.vars =
			{
				index: args.index,
				lineWidth: 0,
				lineHeight: 0,
				paper: typeof args.paper == 'undefined' ? 0 : args.paper,
				pen: typeof args.pen == 'undefined' ? 1 : args.pen,
				blockPaper: typeof args.blockPaper == 'undefined' ? 1 : args.blockPaper,
				blockPen: typeof args.blockPen == 'undefined' ? 0 : args.blockPen,
				writing: typeof args.writing == 'undefined' ? TextWindow.FLAG_NORMAL : args.writing,
				maxColumns: 256,
				tabWidth: 4,
				modal: false,
				cursorBorderH: 4,
				cursorBorderV: 1,
				recenterDX: 4,
				recenterDY: 4,
				sliderWidth: 16,
				sliderHeight: 16,
				readOnly: typeof args.readOnly == 'undefined' ? false : args.readOnly,
				paper1: typeof args.paper1 == 'undefined' ? 0 : args.paper1,
				ink1: typeof args.pen1 == 'undefined' ? 0 : args.pen1,
				outline1: typeof args.outline1 == 'undefined' ? 0 : args.outline1,
				pattern1:  typeof args.pattern1 == 'undefined' ? 0 : args.pattern1,
				paper2: typeof args.paper2 == 'undefined' ? 0 : args.paper2,
				ink2: typeof args.pen2 == 'undefined' ? 0 : args.pen2,
				outline2: typeof args.outline2 == 'undefined' ? 0 : args.outline2,
				pattern2: typeof args.pattern2 == 'undefined' ? 0 : args.pattern2,
				console: typeof args.console == 'undefined' ? false : args.console,
				consolePrompt: typeof args.prompt == 'undefined' ? '> ' : args.prompt,
				onCommand: args.onCommand
			};
			if ( typeof args.window == 'undefined' )
			{
				this.screen = this.aoz.currentScreen;
				this.window = this.screen.currentTextWindow;
			}
			else 
			{
				this.window = args.window;
				this.screen = this.window.screen;
			}
			this.fontWidth = this.window.fontWidth;
			this.fontHeight = this.window.fontHeight;
			this.lineWidth = this.window.lineWidth - Math.floor( this.vars.sliderWidth / this.fontWidth + 1 );
			this.lineHeight = this.window.lineHeight - Math.floor( this.vars.sliderHeight / this.fontHeight + 1 );
			this.rectangle = this.window.getRectangle();
			this.lines = [];
			this.blocks = [];
			this.xCursor = 0;
			this.yCursor = 0;
			this.window.forceCursor();
			this.focus = true;
			this.redrawAll = true;
			this.modified = true;
			this.cursOn = true;
			this.mouseIn = true;
			this.mouseInAoz = true;
			this.sliderVPosition = 0;
			this.sliderHPosition = 0;
			this.xPosition = 0;
			this.yPosition = 0;
			this.sliderV = new this.aoz.ext_slider.Slider( this.aoz, 
			{
				id: 'sourced_slider_v_' + this.vars.index,
				type: 'vertical',
				x: this.window.x + this.window.width * this.fontWidth - this.vars.sliderWidth,
				y: this.window.y,
				width: this.vars.sliderWidth,
				height: this.window.height * this.fontHeight - this.vars.sliderHeight,
				maximum: 0,
				position: 0,
				size: 1,
				onChange: 'ext_source_editor:onChangeSliderV',
				screen: this.screen,
				paper1: this.vars.paper1,
				pen1: this.vars.pen1,
				outline1: this.vars.outline1,
				pattern1: this.vars.pattern1,
				paper2: this.vars.paper2,
				pen2: this.vars.pen2,
				outline2: this.vars.outline2,
				pattern2: this.vars.pattern2,
			} );
			this.sliderH = new this.aoz.ext_slider.Slider( this.aoz, 
			{
				id: 'sourced_slider_h_' + this.vars.index,
				type: 'horizontal',
				x: this.window.x, 
				y: this.window.y + this.window.height * this.fontHeight - this.vars.sliderHeight,
				width: this.window.width * this.fontWidth - this.vars.sliderWidth,
				height: this.vars.sliderHeight,
				maximum: this.vars.maxColums,
				position: 0,
				size: this.lineWidth,
				onChange: 'ext_source_editor:onChangeSliderH',
				screen: this.screen,
				paper1: this.vars.paper1,
				pen1: this.vars.pen1,
				outline1: this.vars.outline1,
				pattern1: this.vars.pattern1,
				paper2: this.vars.paper2,
				pen2: this.vars.pen2,
				outline2: this.vars.outline2,
				pattern2: this.vars.pattern2,
			} );
			if ( !args.noEvents )
			{
				this.events = true;
				this.aoz.addExternalEventHandler( this, this.eventCallback, 'source_editor_' + this.vars.index, {}, 0 );
			}
			if ( !args.console )
			{
				if ( args.source )
					this.setSource( args.source );
			}
			else
			{
				this.commands = [];
				this.commandPosition = 0;
				this.yConsole = 0;
				this.vars.cursorBorderH = 0;
				this.vars.cursorBorderV = 0;
				this.vars.recenterDX = 1;
				this.vars.recenterDY = 1;
				this.insertLine( this.yCursor, 
				{
					text: this.vars.consolePrompt, 
					paper: String.fromCharCode( 48 + this.vars.paper ).repeat( this.vars.consolePrompt.length ),
					pen: String.fromCharCode( 48 + this.vars.pen ).repeat( this.vars.consolePrompt.length ),
					modified: true 
				} );
				this.xCursor = this.vars.consolePrompt.length;
				this.sliderH.set_visible( false );
			}
			this.lastCommand = '';
			this.draw();
		};
		this.SourceEditor.prototype.destroy = function()
		{
			if ( this.events )
			{
				this.events = false;
				this.aoz.removeExternalEventHandler( 'source_editor_' + this.vars.index );
				this.sliderH.destroy();
				this.sliderV.destroy();
			}
		}
		this.SourceEditor.prototype.setBlock = function( block )
		{
			for ( var b = 0; b < this.blocks.length; b++ )
			{
				if ( this.blocks[ b ].id == block.id )
				{
					this.blocks[ b ] = block; 
					return;
				}
			}
			this.blocks.push( block );
		};
		this.SourceEditor.prototype.deleteBlock = function( blockId )
		{
			var newBlocks = [];
			for ( var b = 0; b < this.blocks.length; b++ )
			{
				if ( this.blocks[ b ].id != blockId )
					newBlocks = this.blocks[ b ];
			}
			this.blocks = newBlocks;
		};
		this.SourceEditor.prototype.setSliderPositions = function()
		{
			this.sliderV.set_rectangle( 
			{
				x: this.window.x + this.window.width * this.fontWidth - this.vars.sliderWidth, 
				y: this.window.y,
				width: this.vars.sliderWidth, 
				height: this.window.height * this.fontHeight - this.vars.sliderHeight
			} );
			this.sliderH.set_rectangle( 
			{
				x: this.window.x, 
				y: this.window.y + this.window.height * this.fontHeight - this.vars.sliderHeight,
				width: this.window.width * this.fontWidth - this.vars.sliderWidth, 
				height: this.vars.sliderHeight
			} );
		};
		this.SourceEditor.prototype.isFocussed = function()
		{
			return this.focus;
		};
		this.SourceEditor.prototype.setFocus = function( onOff )
		{
			this.focus = onOff;
			if ( onOff )
			{
				this.window.forceCursor();
				this.window.cursorOn( true );
			}
			else
			{
				this.window.restoreCursor();
				this.window.cursorOff( true );
			}
		};
		this.SourceEditor.prototype.onResize = function( redraw )
		{
			this.lineWidth = this.window.lineWidth - Math.floor( this.vars.sliderWidth / this.fontWidth + 1 );
			this.lineHeight = this.window.lineHeight - Math.floor( this.vars.sliderHeight / this.fontHeight + 1 );
			this.setSliderPositions();
			this.redrawAll = true;
			if ( redraw )
				this.draw();
		};
		this.SourceEditor.prototype.onMove = function( redraw )
		{
			this.setSliderPositions();
			this.redrawAll = true;
			if ( redraw )
				this.draw();
		};
		this.SourceEditor.prototype.insertLine = function( y, line )
		{
			if ( typeof line == 'undefined' )
			{
				line = 
				{
					text: '',
					paper: '',
					pen: '',
					modified: true
				};
			}
			this.lines.splice( y, 0, line );
			this.redrawAll = true;
			return line;
		};
		this.SourceEditor.prototype.deleteLine = function( y )
		{
			this.lines.splice( y, 1 );
			this.redrawAll = true;
		};
		this.SourceEditor.prototype.getLineWords = function( l, separators )
		{
			function isSep( c, sep )
			{
				for ( var s = 0; s < sep.length; s++ )
				{
					if ( c == sep.charAt( s ) )
						return true;
				}
				return false;
			}
			this.words = []; 
			if ( this.lines )
			{
				var wrd = '';
				var line = this.lines[ l ].text;
				separators = typeof separators != 'undefined' ? separators : '\t ';
				for ( var p = 0; p < line.length; p++ )
				{
					var c = line.charAt( p );
					if ( !isSep( c, separators ) )
						wrd += c;
					else
					{
						if ( wrd.length > 0 )
						{
							this.words.push( wrd );
							wrd = '';
						}
					}
				}
				if ( wrd.length > 0 )
					this.words.push( wrd );
			}
			return this.words;	
		};
		this.SourceEditor.prototype.getLine = function( args )
		{
			if ( this.lines )
			{
				if ( typeof args.line == 'undefined' || args.line < 0 )
					throw { error: 'illegal_function_call', parameter: typeof args.line == 'undefined' ? '' : args.line };
				if ( args.line < this.lines.length )
					return this.lines[ args.line ].text;
				return '';
			}
		};
		this.SourceEditor.prototype.getWord = function( args )
		{
			if ( this.lines )
			{
				if ( typeof args.word == 'undefined' || args.word < 0 )
					throw { error: 'illegal_function_call', parameter: typeof args.word == 'undefined' ? '' : args.word };
				if ( typeof args.line == 'undefined' || args.line < 0 )
					throw { error: 'illegal_function_call', parameter: typeof args.line == 'undefined' ? '' : args.line };
				var words = this.getLineWords( args.line, args.separators );
				if ( args.word < words.length )
					return words[ args.word ];
				return '';
			}
		};
		this.SourceEditor.prototype.getNWords = function( args )
		{
			if ( this.lines )
			{
				if ( typeof args.word == 'undefined' || args.word < 0 )
					throw { error: 'illegal_function_call', parameter: typeof args.word == 'undefined' ? '' : args.word };
				if ( typeof args.line == 'undefined' || args.line < 0 )
					throw { error: 'illegal_function_call', parameter: typeof args.line == 'undefined' ? '' : args.line };
				var words = this.getLineWords( args.line, args.separators );
				return words.length;
			}
		};
		this.SourceEditor.prototype.findLine = function( args )
		{
			if ( this.lines )
			{
				var position = typeof args.position != 'undefined' ? args.position : 0;
				if ( position < 0 )
					throw { error: 'illegal_function_call', parameter: position };
				var found;
				if ( !args.backward )
				{
					for ( var l = position; l < this.lines.length; l++ )
					{
						var line = this.lines[ l ];
						if ( args.caseSensitive )
							found = line.text.indexOf( args.text );
						else
							found = line.text.toLowerCase().indexOf( args.text.toLowerCase() );
						if ( found >= 0 )
							return l;
					}
				}
				else
				{
					for ( var l = position; l >= 0; l-- )
					{
						var line = this.lines[ l ];
						if ( args.caseSensitive )
							found = line.text.indexOf( args.text );
						else
							found = line.text.toLowerCase().indexOf( args.text.toLowerCase() );
						if ( found >= 0 )
							return l;
					}
				}
			}
			return -1;
		};
		this.SourceEditor.prototype.importText = function( source )
		{
			var lines = [];
			var start = 0;
			var delta = 0;
			var crlf = false;
			var lfAtEnd = true;
			var end = source.indexOf( '\n', start );
			while ( end >= 0 )
			{
				delta = 0;
				if ( end - start > 0 && source.charAt( end - 1 ) == '\r' )			// Compensates CR/LF
				{
					delta = 1;
					crlf = true;
				}
				var text = source.substring( start, end - delta );
				var textSpace = '';
				var x = 0;
				for ( var p = 0; p < text.length; p++ )
				{
					var c = text.charAt( p );
					if ( c == '\t' )
					{
						var delta = Math.floor( ( x + this.vars.tabWidth ) / this.vars.tabWidth ) * this.vars.tabWidth - x;
						textSpace += ' '.repeat( delta );
						x += delta;
					}
					else
					{
						textSpace += c;
						x++;
					}
				}
				lines.push( 
				{
					text: textSpace,
					paper: String.fromCharCode( 48 + this.vars.paper ).repeat( textSpace.length ),
					pen: String.fromCharCode( 48 + this.vars.pen ).repeat( textSpace.length ),
					modified: false
				} );
				start = end + 1;
				end = source.indexOf( '\n', start );
			};
			if ( start < source.length )
			{
				lfAtEnd = false;
				var s = source.substring( start );
				lines.push( 
				{
					text: s,
					paper: String.fromCharCode( 48 + this.vars.paper ).repeat( s.length ),
					pen: String.fromCharCode( 48 + this.vars.pen ).repeat( s.length ),
					modified: true
				} );
			}
			return { lines: lines, crlf: crlf, lfAtEnd: lfAtEnd };
		};
		this.SourceEditor.prototype.getNumberOfLines = function()
		{
			if ( this.lines )
				return this.lines.length;
			return 0;
		};
		this.SourceEditor.prototype.clear = function()
		{
			this.lines = [];
			this.xCursor = 0;
			this.yCursor = 0;		
			this.xPosition = 0;
			this.yPosition = 0;
			this.modified = true;
		};
		this.SourceEditor.prototype.setSource = function( source )
		{
			var info = this.importText( source );
			this.lines = info.lines;
			this.crlf = info.crlf;
			this.xCursor = 0;
			this.yCursor = 0;		
			this.xPosition = 0;
			this.yPosition = 0;
			this.modified = true;
		};
		this.SourceEditor.prototype.startWordUnderMouse = function( options, callback, callThis )
		{
			this.wordUnderMouse = true;
			this.wordUnderBlock =
			{
				id: 'wordUnder',
				startLine: -1,
				startColumn: -1,
				endLine: -1,
				endColumn: -1,
				paper: options.paper,
				pen: options.pen
			}
			this.setBlock( this.wordUnderBlock );
			this.wordUnderCallback = callback;
			this.wordUnderCallThis = callThis;
		};
		this.SourceEditor.prototype.eventCallback = function( response, event, extra )
		{
			switch ( response )
			{
				case 'mouseleave':
					this.mouseInAoz = false;
					this.mouseIn = false;
					break;
				case 'mouseenter':
					this.mouseInAoz = true;
					break;
				case 'click':
				case 'dblclick':
					if ( this.mouseIn && this.mouseInAoz )
					{
						var key = ( 1 << event.button );
						this.handleMouseKeys( response, key );
					}
					break;
				case 'mousedown':
					if ( this.mouseIn && this.mouseInAoz )
					{
						this.mouseKeys |= ( 1 << event.button );
						this.handleMouseKeys( response, this.mouseKeys );
					}
					break;
				case 'mouseup':
					if ( this.mouseIn && this.mouseInAoz )
					{
						this.mouseKeys &= ~( 1 << event.button );
						this.handleMouseKeys( response, this.mouseKeys );
					}
					break;
				case 'mousemove':
					if ( this.mouseInAoz )
					{
						this.xMouse = ( event.aozInfo.x - this.screen.vars.x ) / this.screen.renderScale.x / this.screen.vars.scaleX + this.screen.vars.offsetX;
						this.yMouse = ( event.aozInfo.y - this.screen.vars.y ) / this.screen.renderScale.y / this.screen.vars.scaleY + this.screen.vars.offsetY;
						this.rectangle = this.window.getRectangle();
						if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, this.rectangle ) )
						{
							this.mouseIn = true;
							this.handleMouse( this.xMouse - this.window.x, this.yMouse - this.window.y );
						}
						else
						{
							this.mouseIn = false;
						}
					}
					break;
				case 'wheel':
					this.mouseWheel( event.aozDeltaY );				
					break;
				case 'keydown':
				case 'keyup':
					if ( this.focus )
					{
						this.handleKeys( response, event );
					}
					break;
			};
			return event;
		};
		this.SourceEditor.prototype.handleKeys = function( eventName, event )
		{
			var scrollX = 0;
			var scrollY = 0;
			var xCursor = this.xCursor
			if ( eventName == 'keydown' )
			{
				var ctrl = event.getModifierState( 'Control' );
				var alt = event.getModifierState( 'Alt' );
				switch ( event.code )
				{
					case 'ArrowUp':
						if ( !this.vars.console )
						{
							if ( !ctrl )
							{
								if ( this.yCursor > 0 )
								{
									this.yCursor--;
									if ( this.yCursor < this.yPosition )
									{
										this.yCursor++;
										if ( this.yPosition > 0 )
										{
											scrollY = -1;
										}
									}
								}
							}
							else
							{
								if ( this.yPosition > 0 )
								{
									scrollY = -1;
								}
							}
						}
						else
						{
							if ( this.commandPosition > 0 )
							{
								if ( this.commandPosition == this.commands.length )
								{
									this.commandSave = this.getCommand( false );
								}
								this.commandPosition--;
								this.replaceCommand( this.commands[ this.commandPosition ] );
							}
						}
						break;
					case 'ArrowDown':
						if ( !this.vars.console )
						{
							if ( !ctrl )
							{
								if ( this.yCursor < this.lines.length - 1 )
								{
									this.yCursor++;
									if ( this.yCursor >= this.yPosition + this.lineHeight )
									{
										this.yCursor--;
										if ( this.yPosition < this.lines.length - this.lineHeight )
										{
											scrollY = 1;
										}
									}
								}
							}
							else
							{
								if ( this.yPosition + this.lineHeight < this.lines.length - 1 )
								{
									scrollY = 1;
								}
							}
						}
						else
						{
							if ( this.commandPosition < this.commands.length )
							{
								this.commandPosition++;
								if ( this.commandPosition == this.commands.length )
								{
									this.replaceCommand( this.commandSave );
								}
								else
								{
									this.replaceCommand( this.commands[ this.commandPosition ] );						
								}
							}
						}
						break;
					case 'ArrowLeft':
						if ( !this.vars.console )
						{
							if ( !ctrl )
							{
								if ( this.xCursor > 0 )
								{
									this.xCursor--;
									if ( this.xCursor < this.xPosition )
									{
										this.xCursor++;
										if ( this.xPosition > 0 )
										{
											scrollX = -1;
										}
									}
								}
							}
							else
							{
								this.previousWord();
							}
						}
						else
						{
							if ( !ctrl )
							{
								if ( this.yCursor > this.yConsole )
								{
									this.xCursor--;
									if ( this.xCursor < 0 )
									{
										this.xCursor = this.lineWidth - 1;
										this.yCursor--;
									}
								}
								else if ( this.yCursor == this.yConsole )
								{
									if ( this.xCursor > this.vars.consolePrompt.length )
										this.xCursor--;
								}
								this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
							}
						}
						break;
					case 'ArrowRight':
						if ( !this.vars.console )
						{
							if ( !ctrl )
							{
								if ( this.xCursor < this.vars.maxColumns - this.lineWidth - 1 )
								{
									this.xCursor++;
									if ( this.xCursor >= this.xPosition + this.lineWidth )
									{
										this.xCursor--;
										if ( this.xPosition < this.vars.maxColumns - this.lineWidth )
										{
											scrollX = 1;
										}
									}
								}
							}
							else
							{
								this.nextWord();
							}
						}
						else
						{
							if ( !ctrl )
							{
								if ( this.xCursor < this.lines[ this.yCursor ].text.length )
								{
									this.xCursor++;
									if ( this.xCursor >= this.lineWidth )
									{
										this.xCursor = 0;
										this.yCursor++;
									}
								}
								this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
							}
						}
						break;
					case 'NumpadEnter':
					case 'Enter':
						if ( !this.vars.readOnly )
						{
							if ( !this.vars.console )
								this.splitLine();
							else
							{
								this.lastCommand = this.getCommand( true );
								this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
							}
						}
						break;
					case 'Home':
						if ( this.vars.console )
						{
							this.xCursor = this.vars.consolePrompt.length;
							this.yCursor = this.yConsole;
						}
						this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
						break;
					case 'End':
						if ( this.vars.console )
						{
							this.yCursor = this.lines.length - 1;						
							this.xCursor = this.lines[ this.yCursor ].text.length;
						}
						this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
						break;
					case 'Backspace':
						if ( !this.vars.readOnly )
							this.backspace();
						break;
					case 'Delete':
						if ( !this.vars.readOnly )
							this.delete();
						break;
					default:
						if ( event.key.length == 1 && !this.vars.readOnly )
						{
							this.insertText( event.key, this.vars.paper, this.vars.pen );
							this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
						}
						break;
				}
			}
			if ( scrollX || scrollY )
			{
				this.xPosition += scrollX;
				this.yPosition += scrollY;
				this.redrawAll = true;
			}
			this.draw();
		};
		this.SourceEditor.prototype.nextConsoleLine = function()
		{
			this.insertLine( this.lines.length );
			this.yConsole = this.lines.length - 1;
			this.lines[ this.yConsole ].text = this.vars.consolePrompt;
			this.lines[ this.yConsole ].paper = String.fromCharCode( 48 + this.vars.paper ).repeat( this.vars.consolePrompt.length );
			this.lines[ this.yConsole ].pen = String.fromCharCode( 48 + this.vars.pen ).repeat( this.vars.consolePrompt.length );
			this.xCursor = this.vars.consolePrompt.length;
			this.yCursor = this.yConsole;
			this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
			this.draw( true );
		};
		this.SourceEditor.prototype.printConsoleLine = function( args )
		{
			if ( !args.sameLine )
			{
				this.insertLine( this.lines.length );
				this.yConsole = this.lines.length - 1;
			}
			else
			{
				this.lines[ this.yConsole ].text = '';
				this.lines[ this.yConsole ].paper = '';
				this.lines[ this.yConsole ].pen = '';
			}
			args.paper = ( typeof args.paper == 'undefined' ? this.vars.paper : args.paper );
			args.pen = ( typeof args.pen == 'undefined' ? this.vars.pen : args.pen );
			this.xCursor = 0;
			this.yCursor = this.yConsole;
			this.insertText( args.text, args.paper, args.pen );
			this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
			this.draw( true );
		};
		this.SourceEditor.prototype.getLastCommand = function()
		{
			var command = this.lastCommand;
			this.lastCommand = '';
			return command;
		};
		this.SourceEditor.prototype.replaceCommand = function( command )
		{
			if ( this.yConsole < this.lines.length - 1 )
				this.lines.splice( this.yConsole + 1, this.lines.length - this.yConsole - 1 );
			this.yCursor = this.lines.length - 1;
			this.lines[ this.yCursor ].text = this.vars.consolePrompt;
			this.lines[ this.yConsole ].paper = String.fromCharCode( 48 + this.vars.paper ).repeat( this.vars.consolePrompt.length );
			this.lines[ this.yConsole ].pen = String.fromCharCode( 48 + this.vars.pen ).repeat( this.vars.consolePrompt.length );
			this.xCursor = this.vars.consolePrompt.length;
			this.insertText( command, this.vars.paper, this.vars.pen );
			this.yCursor = this.lines.length - 1;
			this.xCursor = this.lines[ this.yCursor ].text.length;
			this.setCursorPosition( this.xCursor, this.yCursor, { force: true, recenter: true } );
		};
		this.SourceEditor.prototype.getCommand = function( store )
		{
			var text = this.lines[ this.yConsole ].text.substring( this.vars.consolePrompt.length );
			for ( var y = this.yConsole + 1; y < this.lines.length; y++ )
				text += this.lines[ y ].text;
			if ( text != '' && store )
			{
				this.commands.push( text );
				this.commandPosition = this.commands.length;
				console.log( "Command: " + text );
			}
			return text;
		}
		this.SourceEditor.prototype.getCharacterType = function( c )
		{
			var type;
			if ( ( c >= '0' && c <= '9' ) || ( ( c >= 'a' && c <= 'z') || ( c >= 'A' && c <= 'Z' ) || c == '_' ) )
				type = 'letter';
			else if ( c == ' ' )
				type = 'space';
			else 
				type = 'other';
			return type;
		};
		this.SourceEditor.prototype.previousWord = function()
		{
			var xCursor = this.xCursor;
			var yCursor = this.yCursor;
			var text = this.lines[ yCursor ].text;
			if ( xCursor > text.length )
				xCursor = text.length;			
			else if ( xCursor > 0 )
			{
				xCursor--;			
				var type = this.getCharacterType( text.substring( xCursor, xCursor + 1 ) );
				for ( xCursor--; xCursor > 0; xCursor-- )
				{
					if ( this.getCharacterType( text.substring( xCursor, xCursor + 1 ) ) != type )
					{
						xCursor++;
						break;
					}
				}
			}
			this.setCursorPosition( xCursor, yCursor, { recenter: true } );
			this.modified = true;
			this.draw();
		};
		this.SourceEditor.prototype.nextWord = function()
		{
			var xCursor = this.xCursor;
			var yCursor = this.yCursor;
			var text = this.lines[ yCursor ].text;
			if ( xCursor < text.length )
			{
				var type = this.getCharacterType( text.substring( xCursor, xCursor + 1 ) );
				for ( xCursor++; xCursor <= text.length; xCursor++ )
				{
					if ( this.getCharacterType( text.substring( xCursor, xCursor + 1 ) ) != type )
						break;
				}
			}
			this.setCursorPosition( xCursor, yCursor, { recenter: true } );
			this.modified = true;
			this.draw();
		};
		this.SourceEditor.prototype.handleMouseKeys = function( eventName, key )
		{
			if ( eventName == 'mousedown' && key == 1 )
			{
				var xCursor = Math.floor( ( this.xMouse - this.window.x ) / this.fontWidth );
				var yCursor = Math.floor( ( this.yMouse - this.window.y ) / this.fontHeight );
				if ( xCursor >= 0 && xCursor < this.lineWidth && yCursor >= 0 && yCursor < this.lineHeight )
				{
					xCursor += this.xPosition;
					yCursor += this.yPosition;
					if ( yCursor < this.lines.length )
					{
						if ( this.vars.console )
						{
							if ( yCursor < this.yConsole )
								return;
							if ( yCursor == this.yConsole )
								xCursor = Math.max( xCursor, this.vars.consolePrompt.length );
							xCursor = Math.min( xCursor, this.lines[ yCursor ].text.length );
						}
						this.setCursorPosition( xCursor, yCursor, { recenter: true } );
						this.draw();
					}
				}
			}
		};
		this.SourceEditor.prototype.mouseWheel = function( delta )
		{
			if ( this.mouseIn )		
			{
				var yPosition = this.yPosition + Math.floor( delta );
				yPosition = Math.min( this.lines.length - this.lineHeight, Math.max( 0, yPosition ) );
				if ( yPosition >= 0 && yPosition != this.yPosition )
				{
					this.yPosition = yPosition;
					this.redrawAll = true;
					this.draw();
				}
			}
		};
		this.SourceEditor.prototype.handleMouse = function( xMouse, yMouse )
		{
			if ( this.wordUnderMouse )
			{
				var xCursor = Math.floor( xMouse / this.fontWidth );
				var yCursor = Math.floor( yMouse / this.fontHeight );
				if ( xCursor >= 0 && xCursor < this.lineWidth && yCursor >= 0 && yCursor < this.lineHeight )
				{
					xCursor += this.xPosition;
					yCursor += this.yPosition;
					if ( yCursor < this.lines.length )
					{
						var info = this.wordUnderCallback.call( this.wordUnderCallThis, this.lines[ yCursor ], xCursor, yCursor );
						if ( info )
						{
							this.wordUnderBlock.startLine = yCursor;
							this.wordUnderBlock.endLine = yCursor;
							this.wordUnderBlock.startColumn = info.start;
							this.wordUnderBlock.endColumn = info.end;
							this.wordUnderBlock.paper = typeof info.paper != 'undefined' ? info.paper : this.wordUnderBlock.paper;
							this.wordUnderBlock.pen = typeof info.pen != 'undefined' ? info.pen : this.wordUnderBlock.pen;
							this.setBlock( this.wordUnderBlock );
							return;
						}
					}
				}
				this.wordUnderBlock.startLine = -1;
				this.wordUnderBlock.endLine = -1;
				this.setBlock( this.wordUnderBlock );
				return;
			}
		};
		this.SourceEditor.prototype.delete = function()
		{
			var xCursor = this.xCursor;
			var yCursor = this.yCursor;
			if ( xCursor > this.lines[ yCursor ].text.length )
				xCursor = this.lines[ yCursor ].text.length;
			if ( xCursor == this.lines[ yCursor ].text.length )
			{
				if ( yCursor < this.lines.length - 1 )
				{
					this.lines[ yCursor ].text += this.lines[ yCursor + 1 ].text;
					this.lines[ yCursor ].paper += this.lines[ yCursor + 1 ].paper;
					this.lines[ yCursor ].pen += this.lines[ yCursor + 1 ].pen;
					this.deleteLine( yCursor + 1 );
					this.lines[ yCursor ].modified = true;
					this.modified = true;
				}
			}
			else
			{
				this.lines[ yCursor ].text = this.lines[ yCursor ].text.substring( 0, xCursor ) + this.lines[ yCursor ].text.substring( xCursor + 1 );
				this.lines[ yCursor ].paper = this.lines[ yCursor ].paper.substring( 0, xCursor ) + this.lines[ yCursor ].paper.substring( xCursor + 1 );
				this.lines[ yCursor ].pen = this.lines[ yCursor ].pen.substring( 0, xCursor ) + this.lines[ yCursor ].pen.substring( xCursor + 1 );
				this.lines[ yCursor ].modified = true;
				this.modified = true;
			}
			this.setCursorPosition( xCursor, yCursor, { recenter: true } );
			this.modified = true;
			this.draw();
		};
		this.SourceEditor.prototype.backspace = function()
		{
			var xCursor = this.xCursor;
			var yCursor = this.yCursor;
			if ( xCursor > this.lines[ yCursor ].text.length )
				xCursor = this.lines[ yCursor ].text.length;
			if ( this.vars.console )
			{
				if ( this.yCursor == this.yConsole && this.xCursor == this.vars.consolePrompt.length )
					return;
			}
			if ( xCursor == 0 )
			{
				if ( yCursor > 0 )
				{
					xCursor = this.getTextEnd( 0, this.lines[ yCursor - 1 ].text );
					this.lines[ yCursor - 1 ].text += this.lines[ yCursor ].text;
					this.lines[ yCursor - 1 ].paper += this.lines[ yCursor ].paper;
					this.lines[ yCursor - 1 ].pen += this.lines[ yCursor ].pen;
					this.deleteLine( yCursor-- );
					this.lines[ yCursor ].modified = true;				
				}
			}
			else
			{
				this.lines[ yCursor ].text = this.lines[ yCursor ].text.substring( 0, xCursor - 1 ) + this.lines[ yCursor ].text.substring( xCursor );
				this.lines[ yCursor ].paper = this.lines[ yCursor ].paper.substring( 0, xCursor - 1 ) + this.lines[ yCursor ].paper.substring( xCursor );
				this.lines[ yCursor ].pen = this.lines[ yCursor ].pen.substring( 0, xCursor - 1 ) + this.lines[ yCursor ].pen.substring( xCursor );
				this.lines[ yCursor ].modified = true;
				xCursor--;
			}
			this.setCursorPosition( xCursor, yCursor, { recenter: true } );
			this.modified = true;
			this.draw();
		};
		this.SourceEditor.prototype.splitLine = function()
		{
			var xCursor = this.xCursor;
			var yCursor = this.yCursor;
			if ( xCursor > this.lines[ yCursor ].text.length )
				xCursor = this.lines[ yCursor ].text.length;
			var end = this.lines[ yCursor ].text.substring( xCursor );
			this.lines[ yCursor ].text = this.lines[ yCursor ].text.substring( 0, xCursor );
			this.lines[ yCursor ].paper = this.lines[ yCursor ].paper.substring( 0, xCursor );
			this.lines[ yCursor ].pen = this.lines[ yCursor ].pen.substring( 0, xCursor );
			this.lines[ yCursor ].modified = true;
			this.insertLine( ++yCursor );
			this.lines[ yCursor ].text = end;
			this.lines[ this.yConsole ].paper = String.fromCharCode( 48 + this.vars.paper ).repeat( end.length );
			this.lines[ this.yConsole ].pen = String.fromCharCode( 48 + this.vars.pen ).repeat( end.length );
			xCursor = 0;
			this.setCursorPosition( xCursor, yCursor, { recenter: true } );
			this.modified = true;
			this.draw();
		};
		this.SourceEditor.prototype.insertText = function( text, paper, pen )
		{
			paper = ( typeof paper == 'undefined' ? this.vars.paper : paper );
			pen = ( typeof pen == 'undefined' ? this.vars.pen : pen );
			var x = this.xCursor;
			var y = this.yCursor;
			var xCursor = x;
			var yCursor = y;
			if ( xCursor > this.lines[ yCursor ].text.length )
			{
				x = this.lines[ yCursor ].text.length;
				xCursor = x;
			}
			var info = this.importText( text );
			if ( info.lines.length > 0 )
			{
				var line = this.lines[ y ];
				if ( info.lines.length == 1 && !info.lfAtEnd )
				{
					this.lines[ y ].text = line.text.substring( 0, x ) + info.lines[ 0 ].text + line.text.substring( x );
					this.lines[ y ].paper = line.paper.substring( 0, x ) + String.fromCharCode( 48 + paper ).repeat( info.lines[ 0 ].text.length ) + line.paper.substring( x );
					this.lines[ y ].pen = line.pen.substring( 0, x ) + String.fromCharCode( 48 + pen ).repeat( info.lines[ 0 ].text.length ) + line.pen.substring( x );
					this.lines[ y ].modified = true;
					xCursor++;
				}
				else
				{
					var right = line.text.substring( x );
					this.lines[ y ].text = line.text.substring( 0, x ) + info.lines[ 0 ].text;
					this.lines[ y ].paper = line.text.substring( 0, x ) + String.fromCharCode( 48 + paper ).repeat( info.lines[ 0 ].text.length );
					this.lines[ y ].pen = line.text.substring( 0, x ) + String.fromCharCode( 48 + pen ).repeat( info.lines[ 0 ].text.length );
					this.lines[ y ].modified = true;
					if ( info.lines.length > 1 )
					{
						for ( var l = 1; l < info.lines.length; l++ )
						{
							y++;
							yCursor++;
							this.insertLine( y, info.lines[ l ] );
						}
						xCursor = this.getTextEnd( 0, this.lines[ y - 1 ].text );
					}
					if ( info.lfAtEnd )
					{
						this.insertLine( ++y );
						xCursor = 0;
						yCursor++;
					}
					this.lines[ y ].text = right;
					this.lines[ y ].paper = String.fromCharCode( 48 + paper ).repeat( right.length );
					this.lines[ y ].pen = String.fromCharCode( 48 + pen ).repeat( right.length );
					this.lines[ y ].modified = true;
				}
				if ( this.vars.console )
				{
					var carry = '';
					var l = this.yConsole;
					y = l;
					do
					{
						while( this.lines[ y ].text.length > this.lineWidth )
						{
							carry = this.lines[ y ].text.substring( this.lineWidth );
							var s = this.lines[ y ].text.substring( 0, this.lineWidth );
							this.lines[ y ].text = s;
							this.lines[ y ].paper = String.fromCharCode( 48 + paper ).repeat( s.length );
							this.lines[ y ].pen = String.fromCharCode( 48 + pen ).repeat( s.length );
							if ( carry == '' )
								break;
							y++;
							this.insertLine( y );
							this.lines[ y ].text = carry;
							this.lines[ y ].paper = String.fromCharCode( 48 + paper ).repeat( carry.length );
							this.lines[ y ].pen = String.fromCharCode( 48 + pen ).repeat( carry.length );
							l++;
						}
						l++;
						y++;
					} while( l < this.lines.length )
					yCursor = this.lines.length - 1;
				}
				this.setCursorPosition( xCursor, yCursor, { recenter: true } );
				this.modified = true;
				this.draw();
			}
		}
		this.SourceEditor.prototype.getCursorPosition = function()
		{
			return { x: this.xCursor, y: this.yCursor };
		}
		this.SourceEditor.prototype.setCursorPosition = function( x, y, options )
		{
			if ( x != this.xCursor || y != this.yCursor || options.force )
			{
				if ( options.recenter )
				{
					var xLeft = this.xPosition + this.vars.cursorBorderH;
					var xRight = this.xPosition + this.lineWidth - this.vars.cursorBorderH;
					var yTop = this.yPosition + this.vars.cursorBorderV;
					var yBottom = this.yPosition + this.lineHeight - this.vars.cursorBorderV;
					if ( !this.vars.console && ( x != this.xCursor || options.force ) )
					{
						if ( x < xLeft )
						{
							while  ( x < xLeft && this.xPosition != 0 )
							{
								this.xPosition = Math.max( 0, this.xPosition - this.vars.recenterDX );
								xLeft = this.xPosition + this.vars.cursorBorderH;
							}
							this.redrawAll = true;
						}
						else if ( x >= xRight )
						{
							while  ( x >= xRight )
							{
								this.xPosition += this.vars.recenterDX;
								xRight = this.xPosition + this.lineWidth - this.vars.cursorBorderH;
							}
							this.redrawAll = true;
						}
					}
					if ( y != this.yCursor || options.force )
					{
						if ( y < yTop )
						{
							while  ( y < yTop && this.yPosition != 0 )
							{
								this.yPosition = Math.max( 0, this.yPosition - this.vars.recenterDY );
								yTop = this.yPosition + this.vars.cursorBorderV;
							}
							this.redrawAll = true;
						}
						else if ( y >= yBottom )
						{
							while  ( y >= yBottom )
							{
								this.yPosition += this.vars.recenterDY;
								yBottom = this.yPosition + this.lineHeight - this.vars.cursorBorderV;
							}
							this.redrawAll = true;
						}
					}
				}
				this.xCursor = x;
				this.yCursor = y;
				this.modified = true;
			}
		}
		this.SourceEditor.prototype.getTextEnd = function( x, text )
		{
			return x + text.length;
		}
		this.SourceEditor.prototype.getScreenRectangle = function( x, y )
		{
			var info = this.window.getScreenCoordinates( x - this.xPosition, y - this.yPosition );
			return { x: info.x, y: info.y };
		};
		this.SourceEditor.prototype.draw = function( force )
		{
			var paper, pen, writing;
			var previousPaper, previousPen, previousWriting;
			var self = this;
			function drawLine( line, y, yy, options )
			{
				var text = '';
				var xStart = 0;
				writing = typeof options.writing != 'undefined' ? options.writing : TextWindow.FLAG_NORMAL;
				self.window.clearLine( yy, self.vars.paper, self.vars.pen );
				for ( x = self.xPosition, xx = 0; x < line.text.length && xx < self.lineWidth; x++, xx++ )
				{
					var c = self.lines[ y ].text.charAt( x );
					var paper = self.lines[ y ].paper.charCodeAt( x ) - 48;
					var pen = self.lines[ y ].pen.charCodeAt( x ) - 48;
					for ( var b = 0; b < self.blocks.length; b++ )
					{
						var block = self.blocks[ b ];
						if ( y >= block.startLine && y <= block.endLine )
						{
							if ( block.startLine == block.endLine )
							{
								if ( x >= block.startColumn && x < block.endColumn )
								{
									paper = block.paper;
									pen = block.pen;
								}
							}
							else
							{
								if ( !( y == self.block.startLine && x < self.block.startColumn ) && !( y == self.blockEndLine && x >= self.block.endColumn ) ) 
								{
									paper = block.paper;
									pen = block.pen;
								}
							}
						}
					}
					if ( paper == previousPaper && pen == previousPen )
					{
						text += c;
					}
					else
					{
						if ( text != '' )
						{
							self.window.locate( { x: xStart, y: yy } );
							self.window.printLine( text, previousPaper, previousPen, previousWriting, false, false );
						}
						previousPaper = paper;
						previousPen = pen;
						text = c;
						xStart = xx;
					}
				}
				if ( text )
				{
					self.window.locate( { x: xStart, y: yy } );
					self.window.printLine( text, paper, pen, writing, false, false );
				}
				line.modified = false;
			};
			this.redrawAll = ( force ? true : this.redrawAll );
			if ( this.modified || this.redrawAll )
			{
				this.window.cursorOff();
				pen = this.vars.pen;
				paper = this.vars.paper;
				writing = this.vars.writing;
				previousPaper = paper;
				previousPen = pen;
				previousWriting = writing;
				if ( this.redrawAll )
				{
					this.window.setPaper( paper );
					this.window.setPen( pen );
					this.window.clw();
					var y, yy;
					for ( y = this.yPosition, yy = 0; y < this.lines.length && yy < this.lineHeight; y++, yy++ )
					{
						line = this.lines[ y ];
						drawLine( line, y, yy, { /*writing: TextWindow.FLAG_ONLYPEN*/ } );
					}
				}
				else
				{
					var y, yy;
					for ( y = this.yPosition, yy = 0; y < this.lines.length && yy < this.lineHeight; y++, yy++ )
					{
						line = this.lines[ y ];
						if ( line.modified )
						{
							drawLine( line, y, yy, {} );
						}
					}
				}
				this.window.cursorOn();
				if ( this.yPosition > 0 || this.lines.length > this.lineHeight )
				{
					this.sliderV.set_maximum( this.lines.length, true );
					this.sliderV.set_size( this.lineHeight, true );
					if ( this.yPosition != this.sliderVPosition )
					{
						this.sliderVPosition = this.yPosition;
						this.sliderV.set_position( this.yPosition, true );
					}
					this.sliderV.draw();
				}
				this.sliderH.set_maximum( this.vars.maxColumns, true );
				this.sliderH.set_size( this.lineWidth, true );
				if ( this.xPosition != this.sliderHPosition )
				{
					this.sliderHPosition = this.xPosition;
					this.sliderH.set_position( this.xPosition, true );
				}
				this.sliderH.draw();
				var x = this.xCursor - this.xPosition;
				var y = this.yCursor - this.yPosition;
				if ( x >= 0 && x < this.lineWidth && y >= 0 && y < this.lineHeight )
				{
					if ( !this.cursOn )
					{
						this.window.cursorOn();
						this.cursOn = true;
					}
					this.window.locate( { x: this.xCursor - this.xPosition, y: this.yCursor - this.yPosition } );
				}
				else
				{
					if ( this.cursOn )
					{
						this.window.cursorOff();
						this.cursOn = false;
					}
				}
				this.modified = false;
			}
			else
			{
				var x = this.xCursor - this.xPosition;
				var y = this.yCursor - this.yPosition;
				if ( x >= 0 && x < this.lineWidth && y >= 0 && y < this.lineHeight )
				{
					this.window.locate( { x: x, y: y } );
				}
			}
		};
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
