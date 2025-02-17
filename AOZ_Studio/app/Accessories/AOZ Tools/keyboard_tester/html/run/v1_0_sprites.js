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
// The Sprites Instructions
// By Francois Lionet
// Version 0.99
// 30/01/2020
// (c) AOZ Studio 2019-2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_sprites( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFNwcml0ZXMgSW5zdHJ1Y3Rpb25zIiwiYXV0aG9yIjoiQnkgRnJhbmNvaXMgTGlvbmV0IiwidmVyc2lvbiI6IlZlcnNpb24gMC45OSIsImRhdGUiOiIzMC8wMS8yMDIwIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAxOS0yMDIwIiwic3RhcnQiOiJzcHJpdGVzLmFveiIsIm9iamVjdCI6IlNwcml0ZSIsIm5hbWUiOiJzcHJpdGVzIn0sImNvbXBpbGF0aW9uIjp7ImZvcmNlSW5jbHVkZSI6dHJ1ZSwibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_sprites';
	this.aoz[ "module" + "Sprites" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/sprites/sprites.aoz
		aoz.sourcePos="0:46:0";
		// Javascript
		this.aoz.sprites = this;
		this.contextName = this.aoz.currentContextName;
		this.context = new AOZContext( this.aoz, this.contextName, { sorted: true } );
		this.banks = this.aoz.banks;
		this.utilities = aoz.utilities;
		this.toUpdate = false;
		this.updateOn = true;
		this.priorityOn = false;
		this.priorityReverseOn = false;
		this.keys = {};
		this.gamepads = {};
		this.stage = undefined;
		this.canvas = undefined;
		createjs.RelativePlugin.install();
		createjs.MotionGuidePlugin.install();
		createjs.RotationPlugin.install();
		this.canvas = document.createElement( 'canvas' );
		this.canvas.setAttribute( 'id', 'cjsCanvas' );
		this.canvas.width = this.aoz.manifest.default.screen.width;
		this.canvas.height = this.aoz.manifest.default.screen.height;
		this.canvas.setAttribute( 'style', 'position: absolute; left: 0px; top: 0px; display: block; width: ' + this.aoz.currentScreen.vars.width + "px; height: " + this.aoz.currentScreen.vars.height + "px" );
		this.bobParams = {};
		this.stage = new createjs.Stage( "cjsCanvas" );
		createjs.Ticker.interval = 10;
		createjs.Ticker.framerate = 60;
		var self = this;
		this.gamepadHandler = function( event, connecting )
		{
			var gamepad = event.gamepad;
			if( connecting )
			{
				self.gamepads[ gamepad.index ] = gamepad;
			}
			else
			{
				delete self.gamepads[ gamepad.index ];
			}
		}
		window.addEventListener("gamepadconnected", function(e)
		{
			self.gamepadHandler( e, true );
		}, false );
		window.addEventListener("gamepaddisconnected", function(e)
		{
			self.gamepadHandler( e, false );
		}, false );
		this.sprite = function( index, position, image, tags, contextName )
		{
			var sprite = this.context.getElement( this.contextName, index );
			if ( !sprite )
			{
				sprite = new Sprite( this.aoz, this, tags );
				this.context.setElement( this.contextName, sprite, index );
			}
			sprite.set( position, image, '#update' );
		};
		this.destroy = function( index, contextName )
		{
			if ( typeof index == 'undefined' )
			{
				this.context.parseAll( this.contextName, function( sprite )
				{
					aoz.removeFromSynchro( sprite );
				} );
				this.context.deleteRange( this.contextName );
			}
			else
			{
				this.aoz.removeFromSynchro( this.context.getElement( this.contextName, index ) );
				this.context.deleteElement( this.contextName, index );
			}
			this.setModified();
		};
		this.shadowOff = function( index, contextName )
		{
			if ( typeof index == 'undefined' )
			{
				this.context.parseAll( this.contextName, function( sprite )
				{
					sprite.setShadow({color:null});
				} );
			}
			else
			{
				aoz.sprites.context.getElement( aoz.sprites.contextName,aoz.checkIndex(index),'sprite_not_defined' ).setShadow({color:null});
			}
			this.setModified();
		};
		this.setModified = function()
		{
			this.modified++;
			this.aoz.renderer.setModified();
		};
		this.get = function( index, contextName, errorMessage )
		{
			return this.context.getElement( this.contextName, index, errorMessage );
		};
		this.getNumber = function()
		{
			return this.context.getNumberOfElements( this.contextName );
		};
		this.getHighestIndex = function()
		{
			return this.context.getHighestElementIndex( this.contextName );
		};
		this.getLowestIndex = function()
		{
			return this.context.getLowestElementIndex( this.contextName );
		};
		this.update = function( force )
		{
			if ( force || ( this.updateOn && this.modified ) )
			{
				this.modified = 0;
				var done = false;
				this.context.parseAll( this.contextName, function( sprite )
				{
					done |= sprite.update( { force: force } );
				} );
				if ( done )
					this.sortPriority();
			}
		};
		this.sortPriority = function()
		{
			if ( this.priorityOn )
			{
				if ( this.priorityReverseOn )
				{
					this.context.sort( this.contextName, function( b1, b2 )
					{
						if ( b1.vars.y == b2.vars.y )
							return 0;
						return ( b1.vars.y > b2.vars.y ) ? -1 : 1;
					} );
				}
				else
				{
					this.context.sort( this.contextName, function( b1, b2 )
					{
						if ( b1.vars.y == b2.vars.y )
							return 0;
						return ( b1.vars.y < b2.vars.y ) ? -1 : 1;
					} );
				}
			}
		};
		this.updateBank = function( newBank, newBankIndex )
		{
			var update = false;
			this.context.parseAll( this.contextName, function( sprite )
			{
				update |= sprite.updateBank( newBank, newBankIndex, this.contextName );
			} );
			if ( update )
				this.setModified();
		};
		this.setUpdate = function( yes_no )
		{
			this.updateOn = yes_no;
		};
		this.setLimits = function( index, rectangle, contextName )
		{
			if ( typeof index != 'undefined' )
			{
				this.context.getElement( this.contextName, index, 'sprite_not_defined' ).setLimits( rectangle );
			}
			else
			{
				this.context.parseAll( this.contextName, function( sprite )
				{
					sprite.setLimits( rectangle );
				} );
			}
		};
		this.setPriority = function( on_off )
		{
			this.priorityOn = on_off;
			this.setModified();
		};
		this.setPriorityReverse = function( on_off )
		{
			this.priorityReverseOn  = on_off;
			this.setModified();
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
