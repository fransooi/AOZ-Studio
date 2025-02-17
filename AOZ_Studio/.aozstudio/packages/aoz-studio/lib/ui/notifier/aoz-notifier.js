class AOZNotifier
{
	constructor()
	{
		// Notification classique
		this.layer = document.createElement( 'div' );
		this.layer.setAttribute( 'class', 'notifier_panel' );
		
		this.icon = document.createElement( 'img' );
		this.icon.setAttribute( 'class', 'notifier_icon' );
		this.layer.appendChild( this.icon );

		this.iconClose = document.createElement( 'img' );
		this.iconClose.src = atom.IMAGES.ICON_CLOSE2;	
		this.iconClose.setAttribute( 'class', 'notifier_close' );
		this.layer.appendChild( this.iconClose );
		
		var self = this;
		this.iconClose.addEventListener( 'click', function( event )
		{
			self.close();
		}, false );
		
		this.title = document.createElement( 'span' );
		this.title.setAttribute( 'class', 'notifier_title' );
		this.layer.appendChild( this.title );
		
		this.description = document.createElement( 'div' );
		this.description.setAttribute( 'class', 'notifier_description' );
		this.layer.appendChild( this.description );
		
		this.zoneClick = document.createElement( 'div' );
		this.zoneClick.setAttribute( 'class', 'notifier_click' );
		this.zoneClick.addEventListener( 'click', function( event )
		{
			self.close();
			if( self.callback )
			{
				self.callback.call( this );
			}
		}, false );
		this.layer.appendChild( this.zoneClick );
		
		this.callback = undefined;
		this.fromAOZViewer = false;
		document.body.appendChild( this.layer );

		// Notification à la "AMOS"
		this.layer2 = document.createElement( 'div' );
		this.layer2.setAttribute( 'class', 'notification_amos' );
		document.body.appendChild( this.layer2 );
		
		this.description2 = document.createElement( 'div' );
		this.description2.setAttribute( 'class', 'notification_amos_descr' );
		this.description2.innerHTML = "End of program";
		this.layer2.appendChild( this.description2 );
		
		this.amosControls = document.createElement( 'div' );
		this.amosControls.setAttribute( 'class', 'notification_amos_controls' );

		if( process.platform == 'win32' || process.platform == 'linux' )
		{
			this.amosControls.innerHTML = "&lt;ESCAPE&gt; Direct mode.";
		}

		if( process.platform == 'darwin' )
		{
			this.amosControls.innerHTML = "&lt;ESCAPE&gt; Direct mode.";
		}

		this.layer2.appendChild( this.amosControls );
		
	}
	
	show( icon, title, description, callback, close, fromAOZViewer, styleAmos )
	{
		this.fromAOZViewer = false;
		if( fromAOZViewer != undefined )
		{
			this.fromAOZViewer = fromAOZViewer;
		}

		if( styleAmos == undefined || styleAmos == false )
		{
			this.layer.style.width = '400px';
			
			if( icon == undefined || icon == '' )
			{
				icon = atom.ICONS.ICON_INFO;
			}

			if( title == undefined )
			{
				title = '';
			}
			
			if( description == undefined )
			{
				description = '';
			}
			
			if( close == undefined )
			{
				close = true;
			}
			
			if( !close )
			{
				//this.iconClose.style.display = 'none';
			}
			else
			{
				this.iconClose.style.display = 'block';
			}

			if( callback != undefined )
			{
				this.zoneClick.style.display = 'block';
			}
			else
			{
				this.zoneClick.style.display = 'none';
			}

			if( this.fromAOZViewer )
			{
				this.layer.style.width = '300px';
				setTimeout( function()
				{
					atom.aozNotifier.close();
				}, 5000 );
			}
			
			this.icon.src = icon;
			this.title.innerHTML = title;
			this.description.innerHTML = description;
			this.callback = callback;
			
			this.layer.style.display = 'block';

		}
		else
		{
			if( description == undefined || description == '' )
			{
				description = title;
			}
			this.description2.innerHTML = title + description;
			this.callback = callback;
			this.layer2.style.display = 'block';
			document.body.focus();
			this.layer2.focus();
		}
	}

	close()
	{
		this.fromAOZViewer = false;
		this.layer.style.display = 'none';
		this.layer2.style.display = 'none';
	}
}

module.exports = AOZNotifier;