application.editorSDK.banks = 
{
    imagesBank: undefined,
    loadImagesBank: function( path )
    {
        if( !application.editorSDK.inEditor() )
        {
            throw ('This AOZ program should be executed in the editor only.' );
        }
        application.root.vars.IMAGES_COUNT = 0;
        application.root.vars.IMAGE_NAME$ = "";
        application.editorSDK.busy( true );
        window.parent.atom.editorSDK.banks.loadImagesBank( path, function( err, files, loaded, results )
        {
            if( err )
            {
                throw( 'Error during the images bank loading.' );
                application.editorSDK.busy( false );
            }
            if( files.length == loaded )
            {
                application.editorSDK.banks.imagesBank = results;
                application.root.vars.IMAGES_COUNT = application.editorSDK.banks.imagesBank.length;
                application.editorSDK.busy( false );
            }
        } );

    },

    getImageBank: function( index )
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
        var canvas = application.editorSDK.banks.imagesBank[ index - 1 ].image;
        var bank = application.aoz.banks.getBank( undefined, undefined, 'images' );
        var image = undefined;
        try
        {
            image = bank.getElement( 'sdk_loaded_image', application.aoz.currentContextName, undefined );
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

    getImageBankByName: function( name )
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
                application.editorSDK.banks.getImageBank( i + 1 );
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