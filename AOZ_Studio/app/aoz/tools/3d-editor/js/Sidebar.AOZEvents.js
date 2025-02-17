import { UIPanel, UIBreak, UIText, UIButton, UIRow, UIInput } from './libs/ui.js';

import { SetAOZEventsValueCommand } from './commands/SetAOZEventsValueCommand.js';

function SidebarAOZEvents( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();
	container.setDisplay( 'none' );

	container.add( new UIText( strings.getKey( 'sidebar/aozevents' ) ).setTextTransform( 'uppercase' ) );

    const aozEvtContainer = new UIRow();
	container.add( aozEvtContainer );

    // onUpdate
    const aozEventOnUpdateRow = new UIRow();
	const aozEventOnUpdate = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnUpdate', aozEventOnUpdate.getValue() ) );

	} );
	aozEventOnUpdateRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onupdate' ) ).setWidth( '120px' ) );
	aozEventOnUpdateRow.add( aozEventOnUpdate );
	container.add( aozEventOnUpdateRow );

    // onMouseDown
    const aozEventOnMouseDownRow = new UIRow();
	const aozEventOnMouseDown = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnMouseDown', aozEventOnMouseDown.getValue() ) );

	} );
	aozEventOnMouseDownRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onmousedown' ) ).setWidth( '120px' ) );
	aozEventOnMouseDownRow.add( aozEventOnMouseDown );
	container.add( aozEventOnMouseDownRow );

    // onMouseUp
    const aozEventOnMouseUpRow = new UIRow();
	const aozEventOnMouseUp = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnMouseUp', aozEventOnMouseUp.getValue() ) );

	} );
	aozEventOnMouseUpRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onmouseup' ) ).setWidth( '120px' ) );
	aozEventOnMouseUpRow.add( aozEventOnMouseUp );
	container.add( aozEventOnMouseUpRow );

    // onMouseUp
    const aozEventOnMouseMoveRow = new UIRow();
	const aozEventOnMouseMove = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnMouseMove', aozEventOnMouseMove.getValue() ) );

	} );
	aozEventOnMouseMoveRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onmousemove' ) ).setWidth( '120px' ) );
	aozEventOnMouseMoveRow.add( aozEventOnMouseMove );
	container.add( aozEventOnMouseMoveRow );

    // onKeyDown
    const aozEventOnKeyDownRow = new UIRow();
	const aozEventOnKeyDown = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnKeyDown', aozEventOnKeyDown.getValue() ) );

	} );
	aozEventOnKeyDownRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onkeydown' ) ).setWidth( '120px' ) );
	aozEventOnKeyDownRow.add( aozEventOnKeyDown );
	container.add( aozEventOnKeyDownRow );

    // onKeyUp
    const aozEventOnKeyUpRow = new UIRow();
	const aozEventOnKeyUp = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetAOZEventsValueCommand( editor, editor.selected, 'OnKeyUp', aozEventOnKeyUp.getValue() ) );

	} );
	aozEventOnKeyUpRow.add( new UIText( strings.getKey( 'sidebar/aozevents/onkeyup' ) ).setWidth( '120px' ) );
	aozEventOnKeyUpRow.add( aozEventOnKeyUp );
	container.add( aozEventOnKeyUpRow );

	async function build() {

        const object = editor.selected;
		if ( object && object.type == 'Scene' ) {
            if( object.aozEvents )
            {
			    const events = object.aozEvents;
			    aozEventOnUpdate.setValue( events.OnUpdate );
			    aozEventOnMouseDown.setValue( events.OnMouseDown );
                aozEventOnMouseUp.setValue( events.OnMouseUp );
                aozEventOnMouseUp.setValue( events.OnMouseMove );				
			    aozEventOnKeyDown.setValue( events.OnKeyDown );
                aozEventOnKeyUp.setValue( events.OnKeyUp );
            }
            else
            {
			    aozEventOnUpdate.setValue( '' );                
			    aozEventOnMouseDown.setValue( '' );                
			    aozEventOnMouseUp.setValue( '' );  
			    aozEventOnMouseMove.setValue( '' ); 				              
			    aozEventOnKeyDown.setValue( '' );                
			    aozEventOnKeyUp.setValue( '' );                
            }
			container.setDisplay( 'block' );
        } else {

			container.setDisplay( 'none' );
		}
	}

	function update() {

		const object = editor.selected;

		if ( object !== null ) 
        {
            editor.execute( new SetValueCommand( editor, object, 'OnUpdate', aozEventOnUpdate.getValue() ) );
            editor.execute( new SetValueCommand( editor, object, 'OnMouseDown', aozEventOnMouseDown.getValue() ) );
            editor.execute( new SetValueCommand( editor, object, 'OnMouseUp', aozEventOnMouseUp.getValue() ) );
            editor.execute( new SetValueCommand( editor, object, 'OnMouseMove', aozEventOnMouseMove.getValue() ) );
            editor.execute( new SetValueCommand( editor, object, 'OnKeyDown', aozEventOnKeyDown.getValue() ) );
            editor.execute( new SetValueCommand( editor, object, 'OnKeyUp', aozEventOnKeyUp.getValue() ) );
        }
    }
	
    signals.objectSelected.add( function () {

		build();

	} );
	return container;

}

export { SidebarAOZEvents };
