const PATH = require( 'path' );
const FS = require( 'fs' );

function postUpdater()
{
    // Files to Remove
    var filesToRemove = [];
    var foldersToRemove = [];

    if( atom.aozConfig && atom.aozConfig.installInformation )
    {        
        /*
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/Accessories/AOZ Tools/bot-simulator.aozacclnk' );
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/Accessories/Graphics/Web Assets/2. Top 21 Best Game Assets websites - - - - - - - - - - - .aozacclnk' );

        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/languages/v1_0/sounds/resources/5.samples/1.bell.mp3' );
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/languages/v1_0/sounds/resources/5.samples/2.boom.mp3' );
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/languages/v1_0/sounds/resources/5.samples/3.shoot.mp3' );
        
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/informations.js' );
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/messages.js' );
        filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/utilities.js' );

//        foldersToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/AOZ Store/Tutorials/5. Game 3  (En)' );

        if( process.platform == 'win32' )
        {
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-linux' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-darwin' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler-linux' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler-mac' );
        }

        if( process.platform == 'darwin' )
        {
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-linux' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-win32.exe' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler-linux' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler.exe' );
        }

        if( process.platform == 'linux' )
        {
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-darwin' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/check-win32.exe' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler-mac' );
            filesToRemove.push( atom.aozConfig.installInformation.commonPath + '/app/aoz/transpiler/transpiler.exe' );
        }
        */
    }

    if( filesToRemove.length > 0 )
    {
        for( var f = 0; f < filesToRemove.length; f++ )
        {
            if( FS.existsSync( filesToRemove[ f ] ) )
            {
                FS.unlinkSync( filesToRemove[ f ] );
            }
        }
    }

    if( foldersToRemove.length > 0 )
    {
        for( var f = 0; f < foldersToRemove.length; f++ )
        {
            if( FS.existsSync( foldersToRemove[ f ] ) )
            {
                FS.rmdirSync( foldersToRemove[ f ], { recursive: true } );
            }
        }
    }

}
module.exports.postUpdater = postUpdater;
