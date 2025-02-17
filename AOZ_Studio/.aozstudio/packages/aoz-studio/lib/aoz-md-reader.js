class AOZMarkdownReader
{
	
	constructor(){};
	
	parse( data )
	{
		var html = '';
		var beginCode = false;
		if( data == undefined || data == null || data == '' )
		{
			return "";
		}
		var lines = data.split( "\r\n" );
		if( lines == undefined )
		{
			lines = data.split( "\r" );
		}
		
		if( lines == undefined )
		{
			lines = data.split( "\n" );
		}
		
		if( lines != undefined )
		{
			for( var l = 0; l < lines.length; l++ )
			{
				
				var line = lines[ l ].trim();
				
				if( line != '' )
				{
					if( line.substring( 0, 3 ) == "```" )
					{
						if( beginCode )
						{
							beginCode = false;
							html = html + "</ul>";
						}
						else
						{
							beginCode = true;
							html = html + "<ul class=\"md-code\">";
						}
						line = '';
					}
					
					if( line.substring( 0, 3 ) == "***" )
					{
						html = html + "<h3 class=\"md-title\">" + line.substring( 3, line.length - 3 ) + "</h3>";
						line = '';
					}
					
					if( line != '' )
					{
						if( beginCode )
						{
							html = html + "<li class=\"md-code-line\">" + line + "</li>"
						}
						else
						{
							line = line.replace(/\*\*(.*)\*\*/gim, '<b>$1</b>');
							line = line.replace(/\*(.*)\*/gim, '<i>$1</i>');
							line = line.replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />");
							line = line.replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>");
							html = html + "<p class=\"md-paragraph\">" + line + "</p>"
						}
						
					}
					
				}
			}
			return html;
		}
	}
};

module.exports = AOZMarkdownReader;