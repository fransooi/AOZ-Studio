const PATH = require( 'path' );
const FS = require( 'fs' );
const OS = require( 'os' );

function getPlatform( options, cb, bySocket )
{
    try
	{
		var name = OS.platform();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetplatform',
					name: name
				}
			);
		}
		else
		{
			return name;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getPlatform = getPlatform;

function getVersion( options, cb, bySocket )
{
    try
	{
		var version = OS.version();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetversion',
					version: version
				}
			);
		}
		else
		{
			return version;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getVersion = getVersion;

function getType( options, cb, bySocket )
{
    try
	{
		var type = OS.type();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongettype',
					type: type
				}
			);
		}
		else
		{
			return type;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getType = getType;

function getRelease( options, cb, bySocket )
{
    try
	{
		var release = OS.release();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetrelease',
					release: release
				}
			);
		}
		else
		{
			return release;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getRelease = getRelease;

function getArch( options, cb, bySocket )
{
    try
	{
		var arch = OS.arch();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetarch',
					arch: arch
				}
			);
		}
		else
		{
			return arch;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getArch = getArch;

function getTotalMemory( options, cb, bySocket )
{
    try
	{
		var totalmem = OS.totalmem();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongettotalmemory',
					totalmem: totalmem
				}
			);
		}
		else
		{
			return totalmem;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getTotalMemory = getTotalMemory;

function getFreeMemory( options, cb, bySocket )
{
    try
	{
		var freemem = OS.freemem();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetfreememory',
					freemem: freemem
				}
			);
		}
		else
		{
			return freemem;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getFreeMemory = getFreeMemory;

function getHomeDir( options, cb, bySocket )
{
    try
	{
		var homeDir = OS.homedir();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongethomedir',
					homeDir: homeDir.strReplace( '\\', '/' )
				}
			);
		}
		else
		{
			return homeDir;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getHomeDir = getHomeDir;

function getTempDir( options, cb, bySocket )
{
    try
	{
		var tempDir = OS.tmpdir();
		if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongettempdir',
					tempDir: tempDir.strReplace( '\\', '/' )
				}
			);
		}
		else
		{
			return tempDir;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getTempDir = getTempDir;

function getCPU( options, cb, bySocket )
{
    try
	{
		var cpu = OS.cpus();
        var model = "";
        var speed = 0;
        if( cpu && cpu.length > 0 )
        {
            model = cpu[ 0 ].model;
            speed = cpu[ 0 ].speed;
        }
		
        if( bySocket )
		{
			cb( 
				{
					error: false,
					event: 'ongetcpu',
					model: model,
                    speed: speed
				}
			);
		}
		else
		{
			return homeDir;
		}
	}
	catch( e )
	{
		if( bySocket )
		{
			cb( 
			{ 
				error: true,
				message: e.message,
				event: 'onerror'
			} );
		}
		else
		{		
			return false;
		}
	}
}
exports.getCPU = getCPU;