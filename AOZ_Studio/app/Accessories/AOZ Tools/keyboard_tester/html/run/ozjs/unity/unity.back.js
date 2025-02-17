var _unity_ext = undefined;
String.prototype.strReplace = function( strSearch, strReplace )
{
	var newStr = '';
	for( n = 0; n < this.length; n++ )
	{
		var part = this.substr( n, strSearch.length );
		if( part == strSearch )
		{
			newStr = newStr + strReplace;
			n = n + ( strSearch.length - 1 );
		}
		else
		{
			newStr = newStr + part.substr( 0, 1 );
		}
	}
	return newStr;
};

function unity_initialize( ext )
{

    var unityCSS = document.createElement( 'style' );
    var code = "body { padding: 0; margin: 0 }";
    code += "#unity-container { position: absolute; top:0; left:0}";
    code += "#unity-container.back { z-index: -1 }";
    code += "#unity-container.unity-mobile { width: 100%; height: 100% }"
    code += "#unity-canvas { background: #231F20}";
    code += ".unity-mobile #unity-canvas { width: 100%; height: 100% }";
    code += "#unity-loading-bar { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: none }";
    code += "#unity-logo { width: 154px; height: 130px; background: url('resources/unity/TemplateData/unity-logo-dark.png') no-repeat center }";
    code += "#unity-progress-bar-empty { width: 141px; height: 18px; margin-top: 10px; margin-left: 6.5px; background: url('resources/unity/TemplateData/progress-bar-empty-dark.png') no-repeat center }";
    code += "#unity-progress-bar-full { width: 0%; height: 18px; margin-top: 10px; background: url('resources/unity/TemplateData/progress-bar-full-dark.png') no-repeat center }";
    code += "#unity-footer { position: relative }";
    code += ".unity-mobile #unity-footer { display: none }";
    code += "#unity-webgl-logo { float:left; width: 204px; height: 38px; background: url('resources/unity/TemplateData/webgl-logo.png') no-repeat center }";
    code += "#unity-build-title { float: right; margin-right: 10px; line-height: 38px; font-family: arial; font-size: 18px }";
    code += "#unity-fullscreen-button { float: right; width: 38px; height: 38px; background: url('resources/unity/TemplateData/fullscreen-button.png') no-repeat center }";
    code += "#unity-warning { position: absolute; left: 50%; top: 5%; transform: translate(-50%); background: white; padding: 10px; display: none }";
    unityCSS.innerHTML = code;
    document.body.appendChild( unityCSS );
    
    ext.ucont = document.createElement( 'div' );
    ext.ucont.setAttribute( 'id', 'unity-container' );
    ext.ucont.setAttribute( 'class', 'unity-desktop' );
    ext.code = '<canvas id="unity-canvas" width=' + application.aoz.manifest.display.width + ' height=' + application.aoz.manifest.display.height + '></canvas>';
    ext.code += '<div id="unity-loading-bar"><div id="unity-logo"></div><div id="unity-progress-bar-empty"><div id="unity-progress-bar-full"></div></div></div>';
    ext.code += '<div id="unity-warning"></div><div id="unity-footer" style="display:none"><div id="unity-webgl-logo"></div><div id="unity-fullscreen-button"></div>';
    ext.code += '<div id="unity-build-title">' + application.aoz.manifest.infos.applicationName + '</div></div>';
    ext.ucont.innerHTML = ext.code;
    document.body.appendChild( ext.ucont );
    
    ext.uContainer = document.querySelector( "#unity-container" );
    ext.uCanvas = document.querySelector( "#unity-canvas" );
    ext.loadingBar = document.querySelector( "#unity-loading-bar" );
    ext.progressBarFull = document.querySelector( "#unity-progress-bar-full" );
    ext.fullscreenButton = document.querySelector( "#unity-fullscreen-button" );
    ext.warningBanner = document.querySelector( "#unity-warning" );
    var self = ext;
    window.addEventListener( 'resize', function( event )
    {
        event.preventDefault();
        unityResize();
    }, false );
    
    
    ext.buildUrl = "resources/unity/Build";
    ext.loaderUrl = ext.buildUrl + "/unity.loader.js";
    ext.config = {
        dataUrl: ext.buildUrl + "/unity.data",
        frameworkUrl: ext.buildUrl + "/unity.framework.js",
        codeUrl: ext.buildUrl + "/unity.wasm",
        streamingAssetsUrl: "StreamingAssets",
        companyName: application.aoz.manifest.infos.copyright,
        productName: application.aoz.manifest.infos.applicationName,
        productVersion: "0.1",
        showBanner: unityShowBanner,
    };

	window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	ext.utilities = application.aoz.utilities;
	ext.banks = application.aoz.banks;
	ext.connected = false;
	ext.aoz = undefined;
	ext.unityInstance = undefined;
	ext.handleResponse = undefined;
    ext._gameObjects = {};
    ext._callback = undefined;
    ext._object = undefined;    
	ext.response = undefined;
	ext.task_done = true;
	ext.task_error = undefined;
	ext.task_wait = function()
	{
		if( this.task_error )
		{
			var error = this.task_error;
			this.task_error = null;
			throw error;
		}

		if( this.task_done )
		{
			if( this.handleResponse )
			{
				application.aoz.runProcedure( this.handleResponse, { RESPONSE$: this.response } );
			}
		}
		return this.task_done;

    };

    ext.init = function( args )
	{
		this.task_done = false;
		this.task_error = undefined;
		this.handleResponse = undefined;
		this.response = undefined;

		this.uContainer.setAttribute( 'arg-front', ( args.front ) ? 1 : 0 );

		var aozCanvas = document.querySelector( "#AOZCanvas" );
		aozCanvas.setAttribute( 'style', 'position: absolute; top:0; left:0' );
		this.unityInstance = undefined;

        // By default Unity keeps WebGL canvas render target size matched with
        // the DOM size of the canvas element (scaled by window.devicePixelRatio)
        // Set this to false if you want to decouple this synchronization from
        // happening inside the engine, and you would instead like to size up
        // the canvas DOM size and WebGL render target sizes yourself.
        // config.matchWebGLToCanvasSize = false;

        if( /iPhone|iPad|iPod|Android/i.test( navigator.userAgent ) )
		{
			// Mobile device style: fill the whole browser client area with the game canvas:

			var meta = document.createElement( 'meta' );
			meta.name = 'viewport';
			meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
			document.getElementsByTagName( 'head' )[ 0 ].appendChild( meta );
			this.uContainer.className = "unity-mobile";
			this.uCanvas.className = "unity-mobile";

			// To lower canvas resolution on mobile devices to gain some
			// performance, uncomment the following line:
			// config.devicePixelRatio = 1;

			unityShowBanner( 'WebGL builds are not supported on mobile devices.' );
		}
		else
		{
			// Desktop style: Render the game canvas in a window that can be maximized to fullscreen:
			this.uCanvas.style.width = application.aoz.manifest.display.width + "px";
			this.uCanvas.style.height = application.aoz.manifest.display.height + "px";
		}
		unityResize();
		this.loadingBar.style.display = "block";

		var script = document.createElement("script");
		script.src = this.loaderUrl;
		this.uContainer.setAttribute( 'style', 'display: block' );
		var self = this;
		script.onload = () => {
			createUnityInstance( self.uCanvas, self.config, ( progress ) => {
				self.progressBarFull.style.width = 100 * progress + "%";
			} ).then( ( unityInstance ) => {
				_unity_ext.unityInstance = unityInstance;
				self.loadingBar.style.display = "none";
				if( self.uContainer.getAttribute( 'arg-front' ) == 0 )
				{
					setTimeout( function()
					{
						self.uContainer.setAttribute( 'class', 'unity-desktop back' );
						application.aoz.renderingContext.setBackgroundColor();
					}, 2000 );
				}
				self.fullscreenButton.onclick = () => {
					self.unityInstance.SetFullscreen( 1 );
				};
				self.response = "Unity initialized!";
				self.task_done = true;
			} ).catch( ( message ) => {
				self.response = "Error with Unity!";
				self.task_error = message;
				self.task_done = true;
			} );
		};
		document.body.appendChild( script );
	};

    ext.updateGameObject = function( options )
    {
        if( options )
        {
            this._object = undefined;
            this._callback = function()
            {
                this._callback = undefined;

                if( this._object && options )
                {
                    if( options.position.x == -0.000255 )
                    {
                        options.position.x = this._object.position.x;
                    }
                    else
                    {
                        this._object.position.x = options.position.x;                        
                    }

                    if( options.position.y == -0.000255 )
                    {
                        options.position.y = this._object.position.y;
                    }
                    else
                    {
                        this._object.position.y = options.position.y;                        
                    }

                    if( options.position.z == -0.000255 )
                    {
                        options.position.z = this._object.position.z;
                    }
                    else
                    {
                        this._object.position.z = options.position.z;                        
                    }

                    if( options.rotation.x == -0.000255 )
                    {
                        options.rotation.x =  this._object.rotation.x;
                    }
                    else
                    {
                        this._object.rotation.x = options.rotation.x;                        
                    }

                    if( options.rotation.y == -0.000255 )
                    {
                        options.rotation.y =  this._object.rotation.y;
                    }
                    else
                    {
                        this._object.rotation.y = options.rotation.y;                        
                    }

                    if( options.rotation.z == -0.000255 )
                    {
                        options.rotation.z =  this._object.rotation.z;
                    }
                    else
                    {
                        this._object.rotation.z = options.rotation.z;                        
                    }

                    if( options.scale.x == -0.000255 )
                    {
                        options.scale.x =  this._object.scale.x;
                    }
                    else
                    {
                        this._object.scale.x = options.scale.x;                        
                    }

                    if( options.scale.y == -0.000255 )
                    {
                        options.scale.y =  this._object.scale.y;
                    }

                    if( options.scale.z == -0.000255 )
                    {
                        options.scale.z =  this._object.scale.z;
                    }
                    else
                    {
                        this._object.scale.z = options.scale.z;                        
                    }

                    if( options.visible == -2 )
                    {
                        options.visible =  this._object.visible;
                    }                    
                    else
                    {
                        this._object.visible = options.visible;                        
                    }
                    
                    if( options.enabled == -2 )
                    {
                        options.enabled =  this._object.enabled;
                    }              
                    else
                    {
                        this._object.enabled = options.enabled;                        
                    }

                    this.unityInstance.SendMessage( options.name, "SetPosition", options.position.x + "," + options.position.y + "," + options.position.z  );                    
                    this.unityInstance.SendMessage( options.name, "SetRotation", options.rotation.x + "," + options.rotation.y + "," + options.rotation.z  );                    
                    this.unityInstance.SendMessage( options.name, "SetScale", options.scale.x + "," + options.scale.y + "," + options.scale.z  );                    
                    //this.unityInstance.SendMessage( options.name, "SetVisible", "" + options.visible  );                    
                    //this.unityInstance.SendMessage( options.name, "SetEnabled", "" + options.enabled  );
                    if( options.animation != "" )
                    {
                        this.unityInstance.SendMessage( options.name, "PlayAnim", options.animation  );
                    }

                    if( options.lookAt != '' )
                    { 
                        if( options.lookAt.indexOf( "," ) > -1 )
                        {                  
                            this.unityInstance.SendMessage( options.name, "SetLookAtVector3", options.lookAt  );
                        }
                        else
                        {
                            this.unityInstance.SendMessage( options.name, "SetLookAtGameObject", options.lookAt  );
                        }
                    }
                    this._gameObjects[ options.name ] = this._object;
                    this._object = undefined;
                }
            };
            this.unityInstance.SendMessage( options.name, "GetGameObject", "" );           
        };
    }
    
    ext.setCamera = function( cameraName )
    {
        this._callback = undefined;
        this.unityInstance.SendMessage( "AOZBridge", "SetCamera", cameraName );             
    }

    ext.getGameObjectInfos = function( name )
    {
        this._callback = undefined;
        this.unityInstance.SendMessage( name, "GetGameObject", "" );
    }

    ext.setScene = function( name )
    {
        this.unityInstance.SendMessage( "AOZBridge", "SetScene", name );
    }
    _unity_ext = ext;
}

//
// UTILITIES
//

function unityResize()
{
	if( _unity_ext.uCanvas )
	{
		_unity_ext.uCanvas.style.width = window.innerWidth + 'px';
		_unity_ext.uCanvas.style.height = window.innerHeight + 'px';
	}
}

function responseFromUnity( response )
{
    _unity_ext.handleResponse = undefined;
    _unity_ext.response = undefined;

    var json = JSON.parse( response );

    if( json.error )
    {
        throw json.message;
    }

    if( json.PROCNAME$ )
    {
        application.aoz.runProcedure( json.PROCNAME$, json );
        return;
    }

    if( json.script )
    {
        window[ json.script ]( json );
        return;
    }

}

function _computeObject( json )
{
    _unity_ext._object = 
    {
        name: json.name,
        position: 
        {
            x: parseFloat( json.x.strReplace( ",", "." ) ),
            y: parseFloat( json.y.strReplace( ",", "." ) ),
            z: parseFloat( json.z.strReplace( ",", "." ) )
        },

        rotation: 
        {
            x: parseFloat( json.rx.strReplace( ",", "." ) ),
            y: parseFloat( json.ry.strReplace( ",", "." ) ),
            z: parseFloat( json.rz.strReplace( ",", "." ) )
        },

        scale: 
        {
            x: parseFloat( json.sx.strReplace( ",", "." ) ),
            y: parseFloat( json.sy.strReplace( ",", "." ) ),
            z: parseFloat( json.sz.strReplace( ",", "." ) )
        },

        visible: json.visible,
        enabled: json.enabled
    };
    
    _unity_ext._gameObjects[ _unity_ext._object.name ] = _unity_ext._object;

    if( _unity_ext._callback )
    {
        _unity_ext._callback();
    }
}

//
// FOR UNITY ()
//
function unityShowBanner( msg, type )
{
	function updateBannerVisibility()
	{
		warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
	}
	var div = document.createElement( 'div' );
	div.innerHTML = msg;
	warningBanner.appendChild( div );
	if( type == 'error' ) div.style = 'background: red; padding: 10px;';
	else
	{
		if( type == 'warning' ) div.style = 'background: yellow; padding: 10px;';
		setTimeout( function()
		{
			warningBanner.removeChild(div);
			updateBannerVisibility();
		}, 5000);
	}
	updateBannerVisibility();
}
