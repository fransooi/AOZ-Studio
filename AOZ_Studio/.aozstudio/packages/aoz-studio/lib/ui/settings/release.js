const PATH = require( 'path' );

var SettingsRelease = function( settings )
{
	this.settings = settings;
	this.panel = document.createElement( 'div' );
	this.panel.setAttribute( 'class', 'cat-panel' );
	
	this.item =
	{
		id: -1,		
		icon: atom.IMAGES.ICON_AOZ,
		title: atom.aozLang.getTerm( 'settings:release-notes' ),
		disabled: false
	};
};

SettingsRelease.prototype.install = function()
{
	var html = '<p style="text-align: center; padding-top: 32p;">';
	html += '<img src="' + atom.ICONS.LOGO_AOZ + '"></img>';
	html += '<div style="text-align:center; width: 100%; color: var( --second-dark-bg-grey );">&copy;2020-' + new Date().getFullYear() + ' AOZ Studio. All Rights Reserved</div>';
	html += '</p>';

	html += '<div class="release-note">';
	
	var fileNote = 'Change Log.md';
	if( atom.edu )
	{
		fileNote = 'education.md';
	}
	
	var data = atom.AOZIO.loadIfExist( atom.aozConfig.installInformation.commonPath + PATH.sep + 'app' + PATH.sep + fileNote );
	var lines = undefined;
	if( data )
	{
		var lines = data.split( "\r\n" );
		if( lines && lines.length == 1 )
		{
			lines = data.split( "\r" );
			if( lines && lines.length == 1 )
			{
				lines = data.split( "\n" );
			}
		}
		
		if( lines && lines.length > 0 )
		{
			var listOpened = false;
			var sublistOpened = false;
			var htmlOpened = false;
			
			for( var l = 0; l < lines.length; l++ )
			{
				var line = lines[ l ].trim();
				if( line.substring( 0, 5 ) == '@html' )
				{
					htmlOpened = !htmlOpened;
					line = '';
				}
				
				if( htmlOpened )
				{
					html = html + line;
					line = '';
				}
				
				if( line.substring( 0, 3 ) == '###' )
				{
					if( sublistOpened )
					{
						html = html + '</ul>';
						sublistOpened = false;
					}

					if( listOpened )
					{
						html = html + '</ul><br>';
						listOpened = false;
					}
					html = html + '<h3 style="color: var( --primary-dark-bg-orange ); font-weight: bold;">' + line.substring( 3, 1000 ) + '</h3>';
				}
				
				if( line.substring( 0, 3 ) == '* #' )
				{
					if( sublistOpened )
					{
						html = html + '</ul>';
						sublistOpened = false;
					}

					if( listOpened )
					{
						html = html + '</ul><br>';
						listOpened = false;
					}					
					html = html + '<strong style="color: var( --primary-dark-bg-cyan ); font-weight: bold;">' + line.substring( 3, 1000 ) + '</strong><br>';
				}

				if( line.substring( 0, 2 ) == '>>' )
				{
					if( sublistOpened )
					{
						html = html + '</ul>';
						sublistOpened = false;
					}

					if( listOpened )
					{
						html = html + '</ul><br>';
						listOpened = false;
					}
					html = html + '<h4 style="color: var( --primary-dark-bg-cyan ); font-weight: bold;">' + line.substring( 2, 1000 ) + '</h3>';
				}
				
				if( line.substring( 0, 2 ) == '- ' )
				{
					if( sublistOpened )
					{
						html = html + '</ul>';
						sublistOpened = false;
					}
					
					if( !listOpened )
					{
						html = html + '<ul style="list-style-type:disc">';
						listOpened = true;
					}
					html = html + '<li style="color: var( --second-dark-bg-grey );">' + line.substring( 2, 1000 ) + '</li>';
				}
				
				if( line.substring( 0, 2 ) == '	-' )
				{
					if( !sublistOpened )
					{
						html = html + '<ul style="list-style-type:circle">';
						sublistOpened = true;
					}
					html = html + '<li style="color: var( --second-dark-bg-grey );">' + line.substring( 2, 1000 ) + '</li>';
				}				
			}
		}
	}
	html = html + '</div>';
	this.panel.innerHTML = html; 	
	return;
};
module.exports = SettingsRelease;

