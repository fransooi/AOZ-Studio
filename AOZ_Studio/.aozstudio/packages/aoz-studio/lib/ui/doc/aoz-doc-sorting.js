var AOZDocSorting = 
{
	sorting:
	[ 
		{
			name: "General",
			chapter: 33
		},
		{
			name: "AOZ Debugger",
			chapter: 43
		},
		{
			name: "Variables",
			chapter: 38
		},
		{
			name: "String Manipulation",
			chapter: 32
		},
		{
			name: "Timer and Time",
			chapter: 36
		},
		{
			name: "Interval",
			chapter: 20
		},
		{
			name: "Mathematics",
			chapter: 22
		},
		{
			name: "System Informations",
			chapter: 59
		},
		{
			name: "Display and Renderer",
			chapter: 13
		},
		{
			name: "Screen",
			chapter: 28
		},
		{
			name: "Graphic Basics",
			chapter: 18
		},
		{
			name: "Colour Palette",
			chapter: 9
		},
		{
			name: "Fonts",
			chapter: 16
		},
		{
			name: "Texts",
			chapter: 35
		},
		{
			name: "Bank Management",
			chapter: 6
		},
		{
			name: "Asset",
			chapter: 5
		},
		{
			name: "Animate Actor",
			chapter: 0
		},
		{
			name: "Animate Bob",
			chapter: 7
		},
		{
			name: "Animate Sprite",
			chapter: 30
		},
		{
			name: "Collisions",
			chapter: 8
		},
		{
			name: "Zones Commands",
			chapter: 38
		},
		{
			name: "User Interfaces",
			chapter: 37
		},
		{
			name: "HTML content manipulation with AOZ",
			chapter: 4
		},
		{
			name: "Keyboard and Mouse",
			chapter: 21
		},
		{
			name: "Game Controllers",
			chapter: 10
		},
		{
			name: "Smartphones and Tablets",
			chapter: 50
		},
		{
			name: "Meta Audio Video",
			chapter: 14
		},
		{
			name: "Sound Samples",
			chapter: 29
		},
		{
			name: "Midi files",
			chapter: 49
		},
		{
			name: "Sound Speech",
			chapter: 58
		},
		{
			name: "Sound Track and Med musics",
			chapter: 60
		},
		{
			name: "Network",
			chapter: 51
		},
		{
			name: "WebSocket",
			chapter: 62
		},
		{
			name: "Files",
			chapter: 15
		},
		{
			name: "CSV Files",
			chapter: 42
		},
		{
			name: "JSON",
			chapter: 47
		},
		{
			name: "Player and Leaderboards",
			chapter: 27
		},
		{
			name: "QR Code",
			chapter: 52
		},
		{
			name: "Horizontal & vertical Slider",
			chapter: 56
		},
		{
			name: "AMOS Animation Language (AMAL)",
			chapter: 1
		},
		{
			name: "Amiga-specific Commands",
			chapter: 2
		},
		{
			name: "Xtra Amiga Memory",
			chapter: 23
		}

	],
	
	validChapters: function( json )
	{
		for( var s = 0; s < this.sorting.length; s++ )
		{
			if( this.sorting[ s ] && this.sorting[ s ].name )
			{
				for( var c = 0; c < json.chapters.length; c++ )
				{
					if( json.chapters[ c ].name == this.sorting[ s ].name )
					{
						this.sorting[ s ].chapter = c;
					}
				}
			}
		}
		return this.sorting;
	}
};

module.exports = AOZDocSorting;