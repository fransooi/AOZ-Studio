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
// The Animation Intructions
// By Francois Lionet
// Version 0.99
// 27/05/2020
// (c) AOZ Studio 2020
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function v1_0_animations( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIEFuaW1hdGlvbiBJbnRydWN0aW9ucyIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDAuOTkiLCJkYXRlIjoiMjcvMDUvMjAyMCIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMjAiLCJzdGFydCI6ImFuaW1hdGlvbnMuYW96IiwibmFtZSI6ImFuaW1hdGlvbnMifSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_animations';
	this.aoz[ "module" + "Animations" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		aoz.sourcePos="0:33:0";
		// Javascript
		this.contextAnimations = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: false } );
		this.contextMovementsX = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: false } );
		this.contextMovementsY = new AOZContext( this.aoz, this.aoz.currentContextName, { sorted: false } );
		this.doSynchro = function( deltaTime )
		{
			this.contextAnimations.parseAll( this.aoz.currentContextName, function( animation )
			{
				if ( animation.state == 'on' && !animation.end )
					animation.update( deltaTime );
			} );
			this.contextMovementsX.parseAll( this.aoz.currentContextName, function( movement )
			{
				if ( movement.state == 'on' && !movement.end && !movement.paused && typeof movement.channelNumber != 'undefined' )
				{
					var info = movement.aoz.getAnimationChannel( movement.channelNumber );	
					if ( info )
					{
						var coordinate = info[ 'get_x' ].call( info.self );
						var newCoordinate = movement.update( coordinate );
						if ( newCoordinate != coordinate )
							info[ 'set_x' ].call( info.self, newCoordinate );
					}
				}
			} );
			this.contextMovementsY.parseAll( this.aoz.currentContextName, function( movement )
			{
				if ( movement.state == 'on' && !movement.end && !movement.paused && typeof movement.channelNumber != 'undefined' )
				{
					var info = movement.aoz.getAnimationChannel( movement.channelNumber );	
					if ( info )
					{
						var coordinate = info[ 'get_y' ].call( info.self );
						var newCoordinate = movement.update( coordinate );
						if ( newCoordinate != coordinate )
							info[ 'set_y' ].call( info.self, newCoordinate );
					}
				}
			} );
		};
		this.STOSAnimation = function( aoz, definition )
		{
			this.aoz = aoz;
			this.channelNumber = undefined;
			this.definition = definition;
			this.steps = [];
			this.loop = false;
			this.delayCount = -1;
			var count = 0;
			var image, delay, end;
			this.lineParser = new LineParser( this.aoz, definition, 'STOSanim' );
			do
			{
				if ( this.lineParser.extract( 'character', 'syntax_error_in_animation_string' ) != '(' )
					throw { error: 'syntax_error_in_animation_string', parameter: this.lineParser.getToEndOfLine() };
				image = this.lineParser.extract( 'integer', 'syntax_error_in_animation_string' );
				if ( this.lineParser.extract( 'character', 'syntax_error_in_animation_string' ) != ','  )
					throw { error: 'syntax_error_in_animation_string', parameter: this.lineParser.getToEndOfLine() };
				 delay = this.lineParser.extract( 'integer', 'syntax_error_in_animation_string' );
				if ( this.lineParser.extract( 'character', 'syntax_error_in_animation_string' ) != ')'  )
					throw { error: 'syntax_error_in_animation_string', parameter: this.lineParser.getToEndOfLine() };
				this.steps.push( { count: count++, image: image, delay: delay } );
				end = this.lineParser.get( 'character' );
			} while ( !this.lineParser.endOfLine && end == '(' );
			if ( end && end.toLowerCase() == 'l' )
				this.loop = true;
			this.currentStepNumber = 0;
			this.delayCount = -1;
			this.state = 'off';
		}
		this.STOSAnimation.prototype.setChannelNumber = function( number )
		{
			this.channelNumber = number;
		};
		this.STOSAnimation.prototype.update = function()
		{
			var toUpdate = false;
			if ( this.delayCount >= 0 )
			{
				if ( --this.delayCount == 0 )
				{
					if ( this.currentStepNumber < this.steps.length - 1 )
					{
						this.currentStepNumber++;
						this.image = this.steps[ this.currentStepNumber ].image;
						this.delayCount = this.steps[ this.currentStepNumber ].delay;
						toUpdate = true;
					}
					else
					{
						if ( this.loop )
						{
							this.currentStepNumber = 0;
							this.image = this.steps[ this.currentStepNumber ].image;
							this.delayCount = this.steps[ this.currentStepNumber ].delay;
							toUpdate = true;
						}
						else
						{
							this.delayCount = -1;
							this.setState( 'off' );
							this.end = true; 
						}
					}
				}
			}
			else
			{
				this.currentStepNumber = 0;
				this.image = this.steps[ 0 ].image;
				this.delayCount = this.steps[ 0 ].delay;
				toUpdate = true;
			}
			if ( toUpdate && typeof this.channelNumber != 'undefined' )
			{
				var info = this.aoz.getAnimationChannel( this.channelNumber );	
				if ( info )
				{
					info.set_image.call( info.self, this.image );
				}
			}
		}
		this.STOSAnimation.prototype.setState = function( state, frequency )
		{
			var self = this;
			this.updateDelay = Math.floor( 1000 / frequency );
			if ( state != this.state )
			{
			switch ( state.toLowerCase() )
			{
				case 'on':
					this.paused = false;
					break;
				case 'off':
					break;
				case 'pause':
						this.paused = true;
					break;
				case 'play':
						this.paused = false;
					break;
				case 'reset':
					this.delayCount = -1;
					this.setState( 'on', frequency );
					break;
				default:
					throw 'illegal_function_call';
			}
			this.state = state;
			}
		};
		this.STOSAnimation.prototype.getState = function()
		{
			return this.state;
		};
		this.STOSMovement = function( aoz, definition, dimension )
		{
			this.aoz = aoz;
			this.definition = definition;
			this.dimension = dimension.toLowerCase();
			this.steps = [];
			this.loop = false;
			this.delayCount = -1;
			this.stepCount = -1;
			this.channelNumber = undefined;
			var stepNumber = 0;
			var displacement, delay, count, end;
			this.lineParser = new LineParser( this.aoz, definition, 'STOSmove' );
			do
			{
				if ( this.lineParser.extract( 'character', 'syntax_error_in_movement_string' ) != '(' )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				delay = this.lineParser.extract( 'integer', 'syntax_error_in_movement_string' );
				if ( delay <= 0 )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				if ( this.lineParser.extract( 'character', 'syntax_error_in_movement_string' ) != ','  )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				displacement = this.lineParser.extract( 'integer', 'syntax_error_in_movement_string' );
				if ( this.lineParser.extract( 'character', 'syntax_error_in_movement_string' ) != ','  )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				count = this.lineParser.extract( 'integer', 'syntax_error_in_movement_string' );
				if ( count <= 0 )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				if ( this.lineParser.extract( 'character', 'syntax_error_in_movement_string' ) != ')'  )
					throw { error: 'syntax_error_in_movement_string', parameter: this.lineParser.getToEndOfLine() };
				this.steps.push( { stepNumber: stepNumber++, displacement: displacement, delay: delay, count: count } );
				end = this.lineParser.get( 'character' );
			} while ( !this.lineParser.endOfLine && end == '(' );
			if ( end && end.toLowerCase() == 'l' )
				this.loop = true;
			this.currentStepNumber = 0;
			this.delayCount = -1;
			this.state = 'off';
		}
		this.STOSMovement.prototype.setChannelNumber = function( number )
		{
			this.channelNumber = number;
		};
		this.STOSMovement.prototype.update = function( coordinate )
		{
			if ( this.delayCount >= 0 )
			{
				if ( --this.delayCount == 0 )
				{
					do
					{
						if ( --this.stepCount > 0 )
						{
							this.delayCount = this.steps[ this.currentStepNumber ].delay;
							coordinate += this.displacement;
						}
						else
						{
							this.currentStepNumber++;
							if ( this.currentStepNumber >= this.steps.length )
							{
								if ( this.loop )
									this.currentStepNumber = 0;
								else
								{
									this.end = true;
									this.setState( 'off' );
									this.delayCount = -1;
									break;
								}
							}
							this.stepCount = this.steps[ this.currentStepNumber ].count;
							this.delayCount = this.steps[ this.currentStepNumber ].delay;
							this.displacement = this.steps[ this.currentStepNumber ].displacement;
						}
					} while( false );
				}
			}
			else
			{
				this.currentMovementNumber = 0;
				this.stepCount = this.steps[ 0 ].count;
				this.delayCount = this.steps[ 0 ].delay;
				this.displacement = this.steps[ 0 ].displacement;
			}
			return coordinate;
		}
		this.STOSMovement.prototype.setState = function( state, frequency )
		{
			var self = this;
			this.updateDelay = Math.floor( 1000 / frequency );
			if ( this.state != state )
			{
			switch ( state.toLowerCase() )
			{
				case 'on':
					this.paused = false;
					break;
				case 'off':
					break;
				case 'pause':
						this.paused = true;
					break;
				case 'play':
						this.paused = false;
					break;
				default:
					throw 'illegal_function_call';
			}
			this.state = state;
			}
		};
		this.STOSMovement.prototype.getState = function()
		{
			return this.state;
		};
		this.anim = function( number, definition )
		{
			var currentAnimation = this.contextAnimations.getElement( this.aoz.currentContextName, number );
			if ( currentAnimation )
				currentAnimation.setState( 'off' );
			var newAnimation = new this.STOSAnimation( this.aoz, definition );
			this.contextAnimations.setElement( this.aoz.currentContextName, newAnimation, number, true );
			newAnimation.setChannelNumber( number );
			this.aoz.checkAnimationChannel( number, "animation", number, undefined, undefined, true );
		};
		this.setAnimState = function( state, number, frequency )
		{
			frequency = typeof frequency == 'undefined' ? 50 : frequency;
			if ( typeof number == 'undefined' )
			{
				if ( state == 'off' )
					this.contextAnimations.reset();
				else
				{
				this.contextAnimations.parseAll( this.aoz.currentContextName, function( stosAnim )
				{
					stosAnim.setState( state, frequency );
				} );
			}
			}
			else
			{
				if ( state == 'off' )
					this.contextAnimations.deleteElement( this.aoz.currentContextName, number );
			else
			{
				var anim = this.contextAnimations.getElement( this.aoz.currentContextName, number );
				anim.setState( state, frequency );
			}
			}
		};
		this.move = function( number, definitionX, definitionY )
		{
			if ( definitionX )
			{
				var moveX = new this.STOSMovement( this.aoz, definitionX, 'x' );
				this.contextMovementsX.setElement( this.aoz.currentContextName, moveX, number, true );
				moveX.setChannelNumber( number );	
			}
			if ( definitionY )
			{
				var moveY = new this.STOSMovement( this.aoz, definitionY, 'y' );
				this.contextMovementsY.setElement( this.aoz.currentContextName, moveY, number, true );
				moveY.setChannelNumber( number );
			}
		};
		this.moveX = function( number, definition )
		{
			var currentMovement = this.contextMovementsX.getElement( this.aoz.currentContextName, number );
			if ( currentMovement )
				currentMovement.setState( 'off' );
			var newMovement = new this.STOSMovement( this.aoz, definition, 'x' );
			this.contextMovementsX.setElement( this.aoz.currentContextName, newMovement, number, true );
			newMovement.setChannelNumber( number );
		};
		this.moveY = function( number, definition )
		{
			var currentMovement = this.contextMovementsY.getElement( this.aoz.currentContextName, number );
			if ( currentMovement )
				currentMovement.setState( 'off' );
			var newMovement = new this.STOSMovement( this.aoz, definition, 'y' );
			this.contextMovementsY.setElement( this.aoz.currentContextName, newMovement, number, true );
			newMovement.setChannelNumber( number );
		};
		this.moveOn = function( number )
		{
			if ( typeof number == 'undefined' )
			{
				var moving = false;
				this.contextMovementsX.parseAll( this.aoz.currentContextName, function( stosMove )
				{
					moving |= stosMove.end;
				} );
				this.contextMovementsY.parseAll( this.aoz.currentContextName, function( stosMove )
				{
					moving |= stosMove.end;
				} );
				return moving;
			}
			else
			{
				var moving = false;
				var moveX = this.contextMovementsX.getElement( this.aoz.currentContextName, number, frequency );
				if ( moveX )
					moving |= moveX.end;
				var moveY = this.contextMovementsY.getElement( this.aoz.currentContextName, number, frequency );
				if ( moveY )
					moving |= moveY.end;
				return moving;
			}
		};
		this.setMoveState = function( state, number, frequency )
		{
			frequency = typeof frequency == 'undefined' ? 50 : frequency;
			if ( typeof number == 'undefined' )
			{
				if ( state == 'off' )
				{
					this.contextMovementsX.reset();
					this.contextMovementsY.reset();
				}
				else
				{
				this.contextMovementsX.parseAll( this.aoz.currentContextName, function( stosMove )
				{
					stosMove.setState( state, frequency );
				} );
				this.contextMovementsY.parseAll( this.aoz.currentContextName, function( stosMove )
				{
					stosMove.setState( state, frequency );
				} );
			}
			}
			else
			{
				if ( state == 'off' )
				{
					this.contextMovementsX.deleteElement( this.aoz.currentContextName, number );
					this.contextMovementsY.deleteElement( this.aoz.currentContextName, number );
				}
			else
			{
				var moveX = this.contextMovementsX.getElement( this.aoz.currentContextName, number );
				if ( moveX )
					moveX.setState( state, frequency );
				var moveY = this.contextMovementsY.getElement( this.aoz.currentContextName, number );
				if ( moveY )
					moveY.setState( state, frequency );
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
