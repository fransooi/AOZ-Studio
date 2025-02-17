import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
class SetAOZEventsValueCommand extends Command {

	constructor( editor, object, attributeName, newValue ) {

		super( editor );

		this.type = 'SetAOZEventsValueCommand';
		this.name = `Set AOZEvents.${attributeName}`;

		this.object = object;
		this.attributeName = attributeName;
		this.oldValue = '';
		if( object )
		{
			if( object.aozEvents && object.aozEvents[ attributeName ] )
			{
				this.oldValue = object.aozEvents[ attributeName ];
			}
		}
		this.newValue = newValue;

	}

	execute() 
    {
        if( this.object.aozEvents == undefined )
		{
			this.object.aozEvents = {};
		}

		if( this.object.aozEvents == undefined )
        {
            this.object.aozEvents = 
            {
                OnUpdate: '',
                OnMouseDown: '',
                OnMouseUp: '',
                OnMouseMove: '',				
                OnKeyDown: '',
                OnKeyDown: ''
            }
        }
		this.object.aozEvents[ this.attributeName ] = this.newValue;   
		//this.object.geometry[ this.attributeName ] = this.newValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.geometryChanged.dispatch();
		this.editor.signals.sceneGraphChanged.dispatch();

	}

	undo() 
    {

		this.object.aozEvents[ this.attributeName ] = this.oldValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.geometryChanged.dispatch();
		this.editor.signals.sceneGraphChanged.dispatch();

	}

	toJSON()
    {
		const output = super.toJSON( this );
		console.log( output );
		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;
	}

	fromJSON( json ) {

		super.fromJSON( json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

}

export { SetAOZEventsValueCommand };
