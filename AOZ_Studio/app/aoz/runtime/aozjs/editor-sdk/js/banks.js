application.editorSDK.banks =
{
    imagesBank: undefined,
    loadImagesBank: function( path, procName )
    {
        application.editorSDK.busy( true );

        application.editorSDK.callRequest( 'banks', 'loadImagesBank', { path: path }, function( response )
        {
			console.log( response );
			if( response )
			{
				if( response.error )
	            {
					if( procName && procName != '' )
					{
						application.aoz.runProcedure( procName, { EVENT$: 'onerror', MESSAGE$: response.message } );
					}
	                application.editorSDK.busy( false );
	                return;
	            }

				if( response.files )
				{
					var size = 0;
					if( response.files.length == 0 )
					{
						size = 1
					}
					else
					{
						size = response.files.length;
					}

					application.editorSDK.banks.imagesBank = response.files;
					application.root.vars.BK_IMAGE_PATH$_array.dimensions[ 0 ] = size;
					application.root.vars.BK_IMAGE_PATH$_array.array = [];
					for( var r = 0; r < response.files.length; r++ )
					{
						application.root.vars.BK_IMAGE_PATH$_array.array.push( response.files[ r ].name );
					}
                    if( procName && procName != '' )
					    application.aoz.runProcedure( procName, { EVENT$: 'onload', NUM_FILES: response.files.length } );
				}
				application.editorSDK.busy( false );
			}
        } );
    },

    getImageBank: function( index, keep_name )
    {
		if( keep_name == undefined )
		{
			keep_name = false;
		}
		var sname = ( keep_name ) ? application.editorSDK.banks.imagesBank[ index - 1 ].name : 'sdk_loaded_image';

        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }

        if( application.editorSDK.banks.imagesBank == undefined || application.root.vars.IMAGES_COUNT == 0 )
        {
            throw( "No images bank loaded." );
        }

        if( index < 1 || index > application.root.vars.IMAGES_COUNT )
        {
            throw( "Image not loaded." );
        }

        application.editorSDK.busy( true );
        var canvas = document.createElement( 'canvas' );
        var ctx = canvas.getContext( '2d' );
        var img = document.createElement( 'img' );
        img.src = application.editorSDK.banks.imagesBank[ index - 1 ].data;
        ctx.drawImage( img, 0, 0 );

        var bank = application.aoz.banks.getBank( undefined, undefined, 'images' );
        var image = undefined;
        try
        {
            image = bank.getElement( sname, application.aoz.currentContextName, undefined );
        }
        catch( e )
        {
            image = undefined;
        }

        if ( image == undefined )
        {
            bank.add( 'sdk_loaded_image' );
        }
        bank.setElement( 'sdk_loaded_image', canvas );
        application.editorSDK.busy( false );
    },

    getImageBankByName: function( name, keep_name )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }

        if( application.editorSDK.banks.imagesBank == undefined || application.root.vars.IMAGES_COUNT == 0 )
        {
            throw( "No images bank loaded." );
        }

        if( index < 1 || index > application.root.vars.IMAGES_COUNT )
        {
            throw( "Image not loaded." );
        }

        application.editorSDK.busy( true );
        for( var i = 0; i < application.root.vars.IMAGES_COUNT; i++ )
        {
            if( application.editorSDK.banks.imagesBank[ i ].name == name )
            {
                application.editorSDK.banks.getImageBank( i + 1, keep_name );
                application.editorSDK.busy( false );
                return;
            }
        }

        application.editorSDK.busy( false );
        throw( "Image not loaded." );
    },

    getImageName: function( n )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }

        if( application.editorSDK.banks.imagesBank == undefined || application.root.vars.IMAGES_COUNT == 0 )
        {
            throw( "No images bank loaded." );
        }

        application.editorSDK.busy( true );
        application.root.vars.IMAGE_NAME$ = application.editorSDK.banks.imagesBank[ n - 1 ].name;
        application.editorSDK.busy( false );
    }
};
