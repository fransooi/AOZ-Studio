import { UIPanel } from './libs/ui.js';

//import { MenubarAdd } from './Menubar.Add.js';
import { MenubarAddObjects } from './Menubar.AddObjects.js';
import { MenubarAddLights } from './Menubar.AddLights.js';
import { MenubarAddCameras } from './Menubar.AddCameras.js';
import { MenubarEdit } from './Menubar.Edit.js';
import { MenubarFile } from './Menubar.File.js';
//import { MenubarExamples } from './Menubar.Examples.js';
import { MenubarView } from './Menubar.View.js';
import { MenubarHelp } from './Menubar.Help.js';
//import { MenubarPlay } from './Menubar.Play.js';
import { MenubarStatus } from './Menubar.Status.js';

function Menubar( editor ) {

	const container = new UIPanel();
	container.setId( 'menubar' );

	container.add( new MenubarFile( editor ) );
	container.add( new MenubarEdit( editor ) );
	//	container.add( new MenubarAdd( editor ) );
	//	container.add( new MenubarPlay( editor ) );
	//	container.add( new MenubarExamples( editor ) );
	container.add( new MenubarAddObjects( editor ) );
	container.add( new MenubarAddLights( editor ) );
	container.add( new MenubarAddCameras( editor ) );
	container.add( new MenubarView( editor ) );
	container.add( new MenubarHelp( editor ) );

	container.add( new MenubarStatus( editor ) );

	return container;

}

export { Menubar };
