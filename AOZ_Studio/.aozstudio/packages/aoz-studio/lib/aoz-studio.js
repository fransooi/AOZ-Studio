'use babel';
const AOZView = require('./aoz-studio-view');
const PATH = require( 'path' );
const FS = require( 'fs' );
const REMOTE = require('electron').remote;
import { CompositeDisposable, Disposable } from 'atom';
import basicProvider from './basic-provider';
import aozProvider from './aoz-provider';

export default
{
	subscriptions: null,
	activate( state )
	{
		this.openerDisposable = atom.workspace.addOpener( function( uriToOpen )
		{
			var extension = PATH.extname( uriToOpen ).toLowerCase();

			if( extension === '.aozip' || extension === '.amos' ) 
			{
				var impMessage = '';
				if( extension == ".aozip" )
				{
					impMessage = 'import:aozip';
				}

				if( extension == ".amos" )
				{
					impMessage = 'import:amos';
				}

				atom.confirm( atom.aozLang.getTerm( impMessage ), false, function ( response )
				{
					if( response )
					{
						atom.AOZIO.openFile( uriToOpen, function( error, destPath )
						{
							if( error != 'no' )
							{
								return;
							}
							setTimeout( function()
							{
								atom.workspace.open( destPath );
							}, 1500 );
						} );
					}
				} );				
				return undefined;
			}

			if( extension === '.aozacclnk' )
			{
				atom.AOZAccessories.openAccessory( uriToOpen );
				return undefined;
			}
			return undefined;
		} );
				
		this.subscriptions = new CompositeDisposable
		(
			// Add an opener for our view.
			atom.workspace.addOpener( uri =>
			{
				if ( uri === 'atom://aoz-studio' )
				{
					return new AOZView();
				}
			} ),
			// Destroy any aoz studio view when the package is deactivated.
			new Disposable(() => 
			{
				atom.workspace.getPaneItems().forEach(item => 
				{
					if (item instanceof AOZView) {
						item.destroy();
					}
				});
			})			
		)

		// Open view
		atom.workspace.open( 'atom://aoz-studio',
		{
		} ).then( function()
		{
		} );
	},

	deactivate()
	{
	},

	// Providers for autocomplete
    getProvider() {
        return [basicProvider, aozProvider];
    }	
}