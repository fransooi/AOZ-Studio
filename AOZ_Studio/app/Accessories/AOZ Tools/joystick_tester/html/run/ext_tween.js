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
// The Tween Extension
// By Francois Lionet
// Version 1.00
// 22/10/2022
// (c) AOZ Studio 2019-2022
//
// Compiled with AOZ Transpiler Version 14.03 on the 
//

function ext_tween( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25FeHRlbnNpb24iOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFR3ZWVuIEV4dGVuc2lvbiIsImF1dGhvciI6IkJ5IEZyYW5jb2lzIExpb25ldCIsInZlcnNpb24iOiJWZXJzaW9uIDEuMDAiLCJkYXRlIjoiMjIvMTAvMjAyMiIsImNvcHlyaWdodCI6IihjKSBBT1ogU3R1ZGlvIDIwMTktMjAyMiIsInN0YXJ0IjoidHdlZW4uYW96IiwibmFtZSI6InR3ZWVuIn0sImZvbnRzIjp7Imxpc3RGb250cyI6IlBDIiwiYW1pZ2EiOltdLCJnb29nbGUiOltdfSwiY29tcGlsYXRpb24iOnsibm9XYXJuaW5nIjpbXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiaW5jbHVkZVBhdGhzIjpbXX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='ext_tween';
	this.aoz[ "extension" + "Tween"]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/extensions/tween/tween.aoz
		aoz.sourcePos="0:30:0";
		// Javascript
		this.tweens = {};
		this.groupManual = new TWEEN.Group();
		this.groupTimer = new TWEEN.Group();
		this.groupTicks = new TWEEN.Group();
		var self = this;
		this.aoz.addExternalEventHandler( this, function( type, event )
		{
			if ( type == 'update' )
			{
				try
				{
					self.groupTimer.update( performance.now() );
					self.groupTicks.update( self.aoz.frameCounter );
				}
				catch ( e )
				{
					debugger;
				}
			}
			return event;
		} );
		this.tween = function( index, args )
		{
			var tween = this.tweens[ index ];
			var duration = args.duration;
			if ( !tween )
			{
				var group;
				switch ( args.group.toLowerCase() )
				{
					case 'manual':
						group = this.groupManual;
						break;
					case 'ticks':
						group = this.groupTicks;
						break;
					default:
					case 'timer':
						group = this.groupTimer;
						duration *= 1000;
						break;
				}
				tween = new TWEEN.Tween( { value: args.in }, group ).to( { value: args.out }, duration );
				this.tweens[ index ] = tween;
				tween.aozIndex = index;
				tween.easing( this.getEasing( args.easing, args.inOut ) );
			}
			if ( typeof args.yoyo != 'undefined' )
				tween.yoyo( args.yoyo )
			if ( typeof args.repeat != 'undefined' )
				tween.repeat( args.repeat )
			if ( typeof args.repeatDelay != 'undefined' )
				tween.repeatDelay( args.repeatDelay );
			if ( typeof args.chain != 'undefined' )
			{
				var chainTo = this.tweens[ args.chain ];
				if ( !chainTo )
					throw { error: 'tween_not_defined', parameter: args.chainTo };	
				tween.chain( chainTo );
			}
			var self = this;
			var extra = args.extra;
			if ( args.onUpdate )
			{
				var onUpdate = args.onUpdate;
				tween.onUpdate( function( value, elapsed )
				{
					if ( typeof args.onUpdate == 'string' )
						aoz.runProcedure( args.onUpdate, { name$: self.name, value: self.vars.Value_f } );
					else
					onUpdate( value, elapsed, extra );
				} );
			}
			if ( args.onComplete )
			{
				var onComplete = args.onComplete;
				var deleteAtEnd = args.deleteAtEnd;
				tween.onComplete( function( value, elapsed )
				{
					if ( typeof args.onComplete == 'string' )
						aoz.runProcedure( args.onComplete, { name$: self.name, value: self.vars.Value_f } );
					else
						args.onComplete( value, elapsed, extra );
					if ( deleteAtEnd )
						self.tweens[ index ] = null;
				} );
			}
			if ( args.onRepeat )
			{
				var onRepeat = args.onRepeat;
				tween.onRepeat( function( value, elapsed )
				{
					if ( typeof args.onRepeat == 'string' )
						aoz.runProcedure( args.onComplete, { name$: self.name, value: self.vars.Value_f } );
					else
						args.onRepeat( value, elapsed, extra );
				} );
			}
			var autoStart = true;
			args.autoStart = typeof args.autoStart != 'undefined' ? args.autoStart : true;
			if ( args.autoStart )
			{
				if ( tween._group == this.groupManual )
					tween.start( 0 );
				else if ( tween._group == this.groupTicks )
					tween.start( this.aoz.frameCounter );
				else
					tween.start();
			}
			return tween;
		}
		this.getEasing = function( type, inOut )
		{
			var easing;
			var classType = type.charAt( 0 ).toUpperCase() + type.substring( 1 ).toLowerCase();
			if ( !TWEEN.Easing[ classType ] )
				throw { error: 'easing_not_defined', parameter: type };
			easing = TWEEN.Easing[ classType ];
			if ( !easing.None )
			{
				switch ( inOut.toLowerCase() )
				{
					case 'in':
						inOut = 'In';
						break;
					case 'out':
						inOut = 'Out';
						break;
					case 'inout':
						inOut = 'InOut';
						break;
					default:
						throw { error: 'easing_not_defined', parameter: inOut };
				}
				easing = easing[ inOut ];
				if ( !easing )
					throw { error: 'easing_not_defined', parameter: args.type };	
			}
			else
			{
				easing = easing.None;
			}
			return easing;
		}
		this.getTween = function( index )
		{
			if ( !index )
				return this;
			if ( this.aoz.utilities.isObject( index ) )
				return index;
			var tween = this.tweens[ index ];
			if ( !tween )
				throw { error: 'tween_not_defined', parameter: index };	
			return tween;		
		}
		this.deleteTween = function( index )
		{
			var tween = this.getTween( index );
			this.tweens[ tween.aozIndex ] = null;
			tween._group.remove( tween );
		}
		this.start = function( index )
		{
			var tween = this.getTween( index );
			if ( tween._group == this.groupManual )
				tween.start( 0 );
			else if ( tween._group == this.groupTicks )
				tween.start( this.aoz.frameCounter );
			else
			tween.start();
		}
		this.stop = function( index )
		{
			var tween = this.getTween( index );
			tween.stop();
		}
		this.value = function( index )
		{
			var tween = this.getTween( index );
			return tween._object.value;
		}
		this.update = function( index, numberOfTimes )
		{
			var tween = this.getTween( index );
			if ( tween._group == this.groupManual )
			{
				for ( var count = 0; count <= numberOfTimes; count++ )
				{
					tween.update( count );
				}
			}
			else
			{
				throw { error: 'tween_not_manual', parameter: index };	
			}
		}
		// End Javascript
		return{type:0}
	};
	this.blocks[1]=function(aoz,vars)
	{
		return{type:0};
	};
	this.aoz.run(this,0,null);
};
