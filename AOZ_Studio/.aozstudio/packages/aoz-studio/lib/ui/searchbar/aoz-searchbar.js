class AOZSearchbar
{
	constructor()
	{
		this.input = document.createElement( 'input' );
		this.input.setAttribute( 'class', 'aoz-searchbar native-key-bindings' );
		this.input.setAttribute( 'style', 'background-image:url("' + atom.IMAGES.ICON_SEARCH + '"); font-style: italic; color: #888888' );
		this.input.value = atom.aozLang.getTerm( 'aoz-studio:search-rule' );
		this.input.setAttribute( 'data-user', 'first' );

		var self = this;
		this.input.addEventListener( 'focus', function( event )
		{
			if( self.input.getAttribute( 'data-user' ) == 'first' )
			{
				self.input.value = '';
				self.input.setAttribute( 'data-user', 'none' );
				self.input.setAttribute( 'style', 'background-image:url("' + atom.IMAGES.ICON_SEARCH + '"); font-style: normal; color: #000000' );
			}
		}, false );
		
		this.input.addEventListener( 'keypress', function( event )
		{
			
			if( event.key == "Enter" && self.input.value != '' )
			{
				if( atom.docTree )
				{
					event.preventDefault();
					self.search( self.input.value );
				}
			}
		}, false );

		var toolbar = document.getElementsByClassName ( 'tool-bar-top' );
		if( toolbar && toolbar.length > 0 )
		{
			toolbar[ 0 ].appendChild( this.input );
		}
		
	}
	
	search( value )
	{
		if( value )
		{
			var parts = value.split( ":" );
			if( parts )
			{
				switch( parts[ 0 ].trim().toLowerCase() )
				{
					case 'http':
					case 'https':
						atom.workspace.open( encodeURI( value ) );
						return;
						break;
				}
			}
			atom.docTree.open( value );
			//atom.docTree.searchDoc( value );
		}
	}
	
	
	searchWeb( value )
	{
		var url = '';
		switch( atom.aozConfig.aoz_settings.searchengine )
		{
			case 'no-engine':
				url = '';
				break;
				
			case 'google':
				url = "https://www.google.com/search?q=" + value + "&oq=" + value;
				break;
				
			case 'duckduckgo':
				url = "https://duckduckgo.com/?q=" + value + "&t=h_&ia=web";
				break;
			case 'bing':
				url = "https://www.bing.com/search?q=" + value;
				break;
			case 'ecosia':
				url = "https://www.ecosia.org/search?q=" + value;
				break;
				
			default:
				url = "https://www.ecosia.org/search?q=" + value;
				break;
		}
		
		if( url != '' )
		{
			atom.workspace.open( encodeURI( url ) );
		}
	}
};

module.exports = AOZSearchbar;