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
// The Slider Extension
// By Francois Lionet
// Version 1
// 26/07/2021
// (c) AOZ Studio 2020 - Open Source
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function ext_slider( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFNsaWRlciBFeHRlbnNpb24iLCJhdXRob3IiOiJCeSBGcmFuY29pcyBMaW9uZXQiLCJ2ZXJzaW9uIjoiVmVyc2lvbiAxIiwiZGF0ZSI6IjI2LzA3LzIwMjEiLCJjb3B5cmlnaHQiOiIoYykgQU9aIFN0dWRpbyAyMDIwIC0gT3BlbiBTb3VyY2UiLCJzdGFydCI6InNsaWRlci5hb3oiLCJuYW1lIjoic2xpZGVyIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6W10sImVycm9ycyI6eyJlbiI6W10sImZyIjpbXX0sImluY2x1ZGVQYXRocyI6W119LCJib290U2NyZWVuIjp7ImFjdGl2ZSI6ZmFsc2UsIndhaXRTb3VuZHMiOmZhbHNlLCJjbGlja1NvdW5kcyI6ZmFsc2V9LCJlcnJvcnMiOnt9fQ=='));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_slider';
	this.aoz[ "extension" + "Slider"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:37:0";
		// Javascript
		this.sliderSettings =
		{
			ink1: 0,
			paper1: 0,
			outline1: 1,
			pattern1: 0,
			ink2: 1,
			paper2: 0,
			outline2: 1,
			pattern2: 0
		};
		this.drawSlider = function( args )
		{
			for ( var i in this.sliderSettings )
			{
				if ( typeof args[ i ] == 'undefined' )
					args[ i ] = this.sliderSettings[ i ];
			}
			args.id = undefined;
			new this.Slider( this.aoz, args );
		};
		this.setSlider = function ( args )
		{
			this.sliderSettings = args;
		};
		this.Slider = function( aoz, args )
		{
			this.aoz = aoz;
			this.vars = 
			{
				id: undefined,
				type: 'vertical',
				x: 100,
				y: 100, 
				width: 10,
				height: 100,
				maximum: 100,
				position: 0,
				size: 10,
				visible: true,
				ink1: 0,
				paper1: 0,
				outline1: 1,
				pattern1: 0,
				ink2: 1,
				paper2: 0,
				outline2: 1,
				pattern2: 0,
				enabled: true
			};
			for ( var i in args )
				this.vars[ i ] = args[ i ];
			if ( this.vars.position < 0 || this.vars.maximum < 0 || this.vars.size <= 0 )
				throw 'illegal_function_call';
			if ( this.vars.position > this.vars.maximum )
				throw 'illegal_function_call';
			this.vars.maximum = Math.floor( this.vars.maximum );
			this.vars.size = Math.floor( this.vars.size );
			this.screen = args.screen ? args.screen : this.aoz.currentScreen;
			this.draw();
			if ( typeof args.onChange != 'undefined' )
				this.aoz.addExternalEventHandler( this, this.eventCallback, this.vars.id, {}, 100 );
		};
		this.Slider.prototype.destroy = function()
		{
			if ( typeof this.vars.id != 'undefined' )
				this.aoz.removeExternalEventHandler( this.vars.id );
		};
		this.Slider.prototype.set_parameters = function( maximum, size )
		{
			this.vars.maximum = Math.floor( maximum );
			this.vars.size = Math.floor( size );
			this.draw();
		};
		this.Slider.prototype.set_maximum = function( value, noDraw )
		{
			if ( !this.mouseIsDown )
			{
				if ( value < 0 )
					throw { error: 'illegal_function_call', parameter: value };
				if ( this.vars.position > value )
					this.vars.position = Math.floor( value );
				this.vars.maximum = value;
				if ( !noDraw )
					this.draw();
			}
		};
		this.Slider.prototype.set_position = function( value, noDraw )
		{
			if ( !this.mouseIsDown )
			{
				if ( value < 0 )
					throw { error: 'illegal_function_call', parameter: value };
				if ( value > this.vars.maximum )
					value = this.vars.maximum;
				this.vars.position = Math.floor( value );
				if ( !noDraw ) 
					this.draw();
			}
		};
		this.Slider.prototype.set_size = function( value, noDraw )
		{
			if ( !this.mouseIsDown )
			{
				if ( value > this.vars.maximum )
					value = this.vars.maximum;
				this.vars.size = Math.floor( value );
				if ( !noDraw )
					this.draw();
			}
		};
		this.Slider.prototype.set_visible = function( onOff )
		{
			if ( onOff != this.vars.visible )
			{
				this.vars.visible = onOff;
				if ( onOff )
					this.draw();
			}
		};
		this.Slider.prototype.is_visible = function()
		{
			return this.vars.visible;
		};
		this.Slider.prototype.is_enabled = function()
		{
			return this.vars.enabled;
		};
		this.Slider.prototype.set_enabled = function( onOff )
		{
			if ( this.vars.enabled != onOff )
			{
				this.vars.enabled = onOff;
				this.mouseIsDown = false;
				this.mouseDown = false;
			}
		};
		this.Slider.prototype.set_rectangle = function( rectangle )
		{
			this.vars.x = typeof rectangle.x == 'undefined' ? this.vars.x : rectangle.x;
			this.vars.y = typeof rectangle.y == 'undefined' ? this.vars.y : rectangle.y;
			this.vars.width = typeof rectangle.width == 'undefined' ? this.vars.width : rectangle.width;
			this.vars.height = typeof rectangle.height == 'undefined' ? this.vars.height : rectangle.height;
		};
		this.Slider.prototype.eventCallback = function( type, event, extra )
		{
			if ( !this.vars.visible || !this.vars.enabled )
				return event;
			switch ( type )
			{
				case 'mousedown':
					if ( this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, this.vars ) )
					{
						this.mouseDown = true;
						type = 'test';
					}
					break;
				case 'mouseup':
					this.mouseDown = false;
					type = 'test';
					break;
				case 'mousemove':
					this.xMouse = ( event.aozInfo.x - this.screen.vars.x ) / this.screen.renderScale.x / this.screen.vars.scaleX + this.screen.vars.offsetX;
					this.yMouse = ( event.aozInfo.y - this.screen.vars.y ) / this.screen.renderScale.y / this.screen.vars.scaleY + this.screen.vars.offsetY;
					response = 'test';
					break;
			}
			if ( type == 'test' )
			{
				if ( this.mouseDown )
				{
					if ( !this.mouseIsDown )
					{
						this.mouseIsDown = true;
						this.xMouseStart = this.xMouse; 
						this.yMouseStart = this.yMouse; 
						this.positionStart = this.vars.position;
						this.dragging = false;
						this.inBox = this.aoz.utilities.pointInRect( this.xMouse, this.yMouse, this.boxRect );
					}
					if ( this.mouseIsDown )
					{
						var position;
						var computedWidth = this.vars.width;	// - this.vars.size * this.vars.width / this.vars.maximum;
						var computedHeight = this.vars.height - this.vars.size * this.vars.height / this.vars.maximum;
						if ( this.inBox )
						{
							position = this.positionStart;
							if ( !this.dragging )
							{
								if ( this.vars.type == 'vertical' )	
								{
									if ( Math.abs( this.yMouse - this.yMouseStart ) > 5 )
									{
										this.dragging = true;
										this.yMouseStart = this.yMouse; 
									}
								}
								else 
								{
									if ( Math.abs( this.xMouse - this.xMouseStart ) > 5 )
									{
										this.dragging = true;
										this.xMouseStart = this.xMouse; 
									}
								}
							}
							if ( this.dragging )
							{
								if ( this.vars.type == 'vertical' )
									position = ( this.yMouse - this.yMouseStart ) / computedHeight * this.vars.maximum + this.positionStart;
								else
									position = ( this.xMouse - this.xMouseStart ) / computedWidth * this.vars.maximum + this.positionStart;						
							}
						}
						else
						{
							position = this.vars.position;
							if ( this.vars.type == 'vertical' )
								position = ( this.yMouse - this.vars.y ) / computedHeight * this.vars.maximum;
							else
								position = ( this.xMouse - this.vars.x ) / computedHeight * this.vars.maximum;
						}
						position = Math.min( Math.max( Math.floor( position ), 0 ), this.vars.maximum - this.vars.size );
						if ( position != this.vars.position )
						{
							this.vars.position = position;
							this.draw();
							if ( this.vars.onChange )
								this.aoz.runProcedure( this.vars.onChange, { ID$: this.vars.id, POSITION: this.vars.position } );
							if ( this.vars.onChangeCallback )
								this.vars.onChangeCallback.call( this.vars.onChangeThis, { id: this.vars.id, position: this.vars.position } );
						}
					}
					return null;			// Stop event handling
				}
				else
				{
					this.mouseIsDown = false;
					var position;
					var computedWidth = this.vars.width; // - this.vars.size * this.vars.width / this.vars.maximum;
					var computedHeight = this.vars.height - this.vars.size * this.vars.height / this.vars.maximum;
					position = ( this.xMouse - this.vars.x ) / computedWidth * this.vars.maximum;						
				}
			};
			return event;
		};
		this.Slider.prototype.draw = function()
		{
			if ( this.vars.visible )
			{
				this.screen.setPaint( true );
				this.screen.setPattern( this.vars.pattern1 );
				this.screen.setInk( this.vars.paper1, this.vars.ink1, this.vars.outline1 );
				this.screen.bar( { x: this.vars.x, y: this.vars.y, width: this.vars.width, height: this.vars.height } );
				var sliderStart = this.vars.position / this.vars.maximum;
				var sliderEnd  = ( this.vars.position + this.vars.size ) / this.vars.maximum;
				this.screen.setPattern( this.vars.pattern2 );
				this.screen.setInk( this.vars.ink2, this.vars.ink2, this.vars.outline2 );
				if ( this.vars.type == 'vertical' )
					this.boxRect = { x: this.vars.x, y: this.vars.y + sliderStart * this.vars.height, width: this.vars.width, height: ( sliderEnd - sliderStart ) * this.vars.height };
				else
					this.boxRect = { x: this.vars.x + sliderStart * this.vars.width, y: this.vars.y, width: ( sliderEnd - sliderStart ) * this.vars.width, height: this.vars.height };
				this.screen.setClip( this.vars );
				this.screen.bar( this.boxRect );
				this.screen.clipOff();
			}
		};
		// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
