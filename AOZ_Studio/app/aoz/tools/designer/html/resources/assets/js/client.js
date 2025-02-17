// *************************************************************************
// UI Designer Support Code
// Phil Bell
// July 2021
// *************************************************************************
var Client = function()
{
	this.screen_procs = [];

	// Undo/Redo commands
	this.commands = [];
	this.index = -1;
	this.class_picker_selected = [];

	if( window.parent && window.parent.atom )
	{
		this.atom = window.parent.atom;
		this.atom.aozDesigner.client = this;
		application.root.vars.IS_EDITOR_AVAILABLE = 1
	}
	// Scan the text editor to extract designer screens
	this.readEditorText();
};

Client.prototype.setClassPickerSelected = function(existing) {
	this.class_picker_selected = existing.toLowerCase().split(' ');
}

Client.prototype.getClassPickerSelected = function() {
	return this.class_picker_selected.join(' ').trim();
}

Client.prototype.classPickerIndexOf = function(check_class) {
	return this.class_picker_selected.indexOf(check_class);
}

Client.prototype.classPickerAdd = function(class_name) {
	if (this.class_picker_selected.indexOf(class_name) == -1) {
		this.class_picker_selected.push(class_name);
	}
}

Client.prototype.classPickerRemove = function(class_name) {
	var index = this.class_picker_selected.indexOf(class_name);
	if (index >= 0) {
		this.class_picker_selected.splice(index, 1);
	}
}

Client.prototype.resetUndoRedo = function() {
	this.commands = [];
	this.index = -1;
}

Client.prototype.updateAdornment = function(id) {
	var el = document.getElementById(id);
	if (el) {
		var rect = el.getBoundingClientRect();
		var height = rect.height;
		// Set adornment position and size
		window.application.adornment.style.top = (rect.top - 5) + 'px';
		window.application.adornment.style.left = (rect.left - 5) + 'px';
		window.application.adornment.style.width = (rect.width + 10) + 'px';
		window.application.adornment.style.display = 'block';
		window.application.adornment.setAttribute('data-control-id', id);

		// Add 10 pixels if UI Slider
		if (el.getAttribute('data-slider')) {
			height += 10;
		}
		window.application.adornment.style.height = (height + 10) + 'px';

	} else {
		application.hideAdornment();
	}
}

Client.prototype.addCommand = function(commandParam)
{
	// Add a command to the undo/redo system
	var command = this.commands[this.index];

	if (commandParam.commandName == 'propertyChange') {
		// Only add if value has changed
		if (commandParam.oldValue == commandParam.newValue) return;
		if (this.index >= 0) {
			// Update existing command if same propery value is changed
			if (command.commandParam.commandName == commandParam.commandName && command.commandParam.id == commandParam.id && command.commandParam.propertyName == commandParam.propertyName) {
				this.commands[this.index].commandParam.newValue = commandParam.newValue;
				return;
			}
		}
	}

	// Update the command array
	this.commands.splice(this.index + 1, this.commands.length - this.index);
	this.commands.push({
		commandParam
	});

	// Set the current index
	this.index = this.commands.length - 1;
}

Client.prototype.undo = function()
{
	// Get the current command
	var command = this.commands[this.index];
	if (!command) return;

	if (command.commandParam.commandName == 'move') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_x',
			  "VALUE$": command.commandParam.old_x.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_y',
			  "VALUE$": command.commandParam.old_y.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'resize_west') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_x',
			  "VALUE$": command.commandParam.old_x.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_width',
			  "VALUE$": command.commandParam.old_width.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'resize_north') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_y',
			  "VALUE$": command.commandParam.old_y.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_height',
			  "VALUE$": command.commandParam.old_height.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'propertyChange') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : command.commandParam.commandName,
			  "PROPERTY_NAME$": command.commandParam.propertyName,
			  "VALUE$": command.commandParam.oldValue.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'addComponent') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : command.commandParam.commandName,
			  "PROPERTY_NAME$": 'remove',
			  "VALUE$": ''
		  }
		);
	}

	if (command.commandParam.commandName == 'removeComponent') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : command.commandParam.commandName,
			  "PROPERTY_NAME$": 'add',
			  "VALUE$": command.commandParam.newValue
		  }
		);
	}

	this.index -= 1;
	return;
}

Client.prototype.redo = function()
{
	// Get the current command
	var command = this.commands[this.index + 1];
	if (!command) return;

	if (command.commandParam.commandName == 'move') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_x',
			  "VALUE$": command.commandParam.x.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_y',
			  "VALUE$": command.commandParam.y.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'resize_west') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_x',
			  "VALUE$": command.commandParam.x.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_width',
			  "VALUE$": command.commandParam.width.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'resize_north') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_y',
			  "VALUE$": command.commandParam.y.toString()
		  }
		);
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : 'propertyChange',
			  "PROPERTY_NAME$": 'property_height',
			  "VALUE$": command.commandParam.height.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'propertyChange') {
		if (command.commandParam.propertyName == 'property_id') {
			application.aoz.runProcedure('APPLY_UNDO_REDO',
			  {
				  "ID$": command.commandParam.oldValue.toString(),
				  "COMMAND_NAME$" : command.commandParam.commandName,
				  "PROPERTY_NAME$": command.commandParam.propertyName,
				  "VALUE$": command.commandParam.newValue.toString()
			  }
			);

		} else {
			application.aoz.runProcedure('APPLY_UNDO_REDO',
			  {
				  "ID$": command.commandParam.id,
				  "COMMAND_NAME$" : command.commandParam.commandName,
				  "PROPERTY_NAME$": command.commandParam.propertyName,
				  "VALUE$": command.commandParam.newValue.toString()
			  }
			);
		}
	}

	if (command.commandParam.commandName == 'addComponent') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : command.commandParam.commandName,
			  "PROPERTY_NAME$": 'add',
			  "VALUE$": command.commandParam.newValue.toString()
		  }
		);
	}

	if (command.commandParam.commandName == 'removeComponent') {
		application.aoz.runProcedure('APPLY_UNDO_REDO',
		  {
			  "ID$": command.commandParam.id,
			  "COMMAND_NAME$" : command.commandParam.commandName,
			  "PROPERTY_NAME$": 'remove',
			  "VALUE$": ''
		  }
		);
	}

	this.index += 1;
	return;
}

Client.prototype.updateProject = function(html, idx, iconsUsed, fontsUsed, clickEvents, changeEvents)
{
	if (this.editor) {
		// Strip out the html tags
		//html = this.htmlToText(html);
		html = html.replace(/<br>/g, '\n');
		html = html.replace(/&nbsp;/g, ' ');

		// Update the screen stored procedure code
		if (this.screen_procs.length == 0  || this.screen_procs.length < (idx + 1)) {
			// Add to the end of the code editor
			var code = this.editor.getText();
			code += html;
			this.editor.setText(code);
		} else {
			// Replace an existing procedure
			this.editor.setTextInBufferRange([[this.screen_procs[idx].start, 0], [this.screen_procs[idx].end, this.screen_procs[idx].endLength]], html);
		}

		var tags = [];
		var lineCount = this.editor.getLineCount();
		var lineText = '';
		var lastTagLine = 0;
		var found = false;
		var text = '';
		var events = [];

		// Find the last tag position
		for(var i = 0; i < lineCount; i++) {
			lineText = this.editor.lineTextForBufferRow(i).trim();
			if (lineText.indexOf('#') == 0) {
				tags.push(lineText.toLowerCase());
				lastTagLine = i+1;
			}
		}

		this.editor.setCursorScreenPosition([lastTagLine, 0]);

		// Add the required google font tags
		if (fontsUsed && fontsUsed != '') {
			var fontNames = fontsUsed.toLowerCase().split(',');

			for (var i = 0; i < fontNames.length; i++) {
				found = false;
				for (var t = 0; t < tags.length; t++) {
					if (tags[t].indexOf(fontNames[i]) >= 0) {
						found = true;
						break;
					}
				}
				if (found == false) {
					this.editor.insertText('#googleFont:"' + fontNames[i] + '"');
					this.editor.insertNewline();
				}
			}
		}

		// Add the bootstrap icon load asset
		if (iconsUsed == 1) {
			text = this.editor.getText().toLowerCase();
			if (text.indexOf('load asset "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"') < 0) {
				this.editor.insertNewline();
				this.editor.insertText('Load Asset "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"');
				this.editor.insertNewline();
			}
		}

		var eventText = '';

		if (clickEvents != '') {
			events = clickEvents.toLowerCase().split(',');
			text = this.editor.getText().toLowerCase();

			for (var i = 0; i < events.length; i++) {
				if (text.indexOf('procedure ' + events[i]) < 0) {
					eventText += '\nProcedure ' + events[i].toUpperCase() + '[ID$]\n';
					eventText += '    // Add your onClick$ code here\n';
					eventText += 'End Proc\n';
				}
			}
		}

		if (changeEvents != '') {
			events = changeEvents.toLowerCase().split(',');
			text = this.editor.getText().toLowerCase();

			for (var i = 0; i < events.length; i++) {
				if (text.indexOf('procedure ' + events[i]) < 0) {
					eventText += '\nProcedure ' + events[i].toUpperCase() + '[ID$, VALUE$]\n';
					eventText += '    // Add your onChange$ code here\n';
					eventText += 'End Proc\n';
				}
			}
		}

		// Update the editor text
		if (eventText != '') {
			text = this.editor.getText();
			text += eventText;
			this.editor.setText(text);
		}

		this.readEditorText();
	}
}

Client.prototype.readEditorText = function()
{
	if (this.atom) {
		// Extract the designer screen procedures from the editor text
		this.editor = this.atom.workspace.getActiveTextEditor();
		this.lineCount = this.editor.getLineCount();
		this.screen_procs = [];

		var lineText = '';
		var lineTextLower = ''
		var start, end, endLength, name;
		application.root.vars.CUSTOM_CSS_COUNT = 0;

		for(var i = 0; i < this.lineCount; i++) {
			lineText = this.editor.lineTextForBufferRow(i).trim();

			// Check for "Load Asset" instructions that load a .css file
			if (lineText.toLowerCase().indexOf("load asset") > -1) {
				var ins = lineText.toLowerCase().split('load asset');

				for (var t = 0; t < ins.length; t++) {
					var parts = ins[t].split('"');
					if (parts.length > 1) {
						// Extract the css file path
						var css = this.removeQuotes(parts[1]);

						if (css != '' && !css.toLowerCase().startsWith("http") && css.toLowerCase().endsWith("css")) {
							var path = this.editor.getPath();
							css = this.atom.AOZIO.getDirectoryString(path) + this.atom.sep + css;
							css = this.atom.AOZIO.cleanPath(css);
							application.root.vars.CUSTOM_CSS$_array.setValue([application.root.vars.CUSTOM_CSS_COUNT], css);
							application.root.vars.CUSTOM_CSS_COUNT++;
						}
					}
				}
			}

			// Check for the screen procedure comment
			if (lineText == '// ##*AOZUIDesignerGeneratedCode*##') {
				start = i;
				var components = [];
				i++;
				// Extract the procedure name (screen name)
				name = this.editor.lineTextForBufferRow(i).replace(/procedure/ig, ' ').trim();
				end = 0;
				i++;

				// Find the 'end proc'
				for(var e = i; e < this.lineCount; e++) {
					lineText = this.editor.lineTextForBufferRow(e).toLowerCase().trim();
					if (lineText == 'end proc' || lineText == 'end procedure') {
						end = e;
						endLength = lineText.length;
						break;
					}

					// add all the UI component instructions
					if (lineText.startsWith("ui ")) {
						components.push(this.editor.lineTextForBufferRow(e).trim());
					}
				}

				i = e;
				if (end > 0) {
					// store the info for each screen procedure (used in the updateProject)
					this.screen_procs.push({
						start,
						end,
						endLength,
						name,
						components,
						componentCount: components.length
					})
				}
			}
		}

		// Update the AOZ array variables
		for (var i = 0; i < this.screen_procs.length; i++) {
			application.root.vars.SCREEN_NAME$_array.setValue([i], this.screen_procs[i].name);
			application.root.vars.SCREEN_COMPONENT_COUNT_array.setValue([i], this.screen_procs[i].componentCount);

			for (var c = 0; c < this.screen_procs[i].components.length; c++) {
				application.root.vars.SCREEN_COMPONENT$_array.setValue([i,c], this.screen_procs[i].components[c]);
			}
		}

		application.root.vars.SCREEN_COUNT = this.screen_procs.length;
	}
}

Client.prototype.removeQuotes = function(value) {
	return value.replace(/"/g, '');
}

Client.prototype.replaceQuotes = function(value) {
	return value.replace(/"/g, '\'');
}

Client.prototype.copyToClipboard = function(text, stripHtml)
{
	if (stripHtml == true) {
		text = text.replace(/<br>/g, '\n');
		text = text.replace(/&nbsp;/g, ' ');
	}

	if (window.clipboardData && window.clipboardData.setData) {
		return window.clipboardData.setData("Text", text);

	}
	if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand("copy");
		}
		catch (ex) {
			return false;
		}
		finally {
			document.body.removeChild(textarea);
		}
	}
}

Client.prototype.getUserSettings = function()
{
	if (window.localStorage.getItem("AOZDesignerDefaults_Width")) {
		application.root.vars.SCRW = parseInt(window.localStorage.getItem("AOZDesignerDefaults_Width"));
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_Height")) {
		application.root.vars.SCRH = parseInt(window.localStorage.getItem("AOZDesignerDefaults_Height"));
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_GridSize")) {
		application.root.vars.GRID_SIZE = parseInt(window.localStorage.getItem("AOZDesignerDefaults_GridSize"));
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_BackgroundColor")) {
		application.root.vars.BACKGROUND_COLOR$ = window.localStorage.getItem("AOZDesignerDefaults_BackgroundColor");
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_ShowGrid")) {
		application.root.vars.SHOW_GRID$ = window.localStorage.getItem("AOZDesignerDefaults_ShowGrid");
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_FontName")) {
		application.root.vars.DEFAULT_FONT$ = window.localStorage.getItem("AOZDesignerDefaults_FontName");
	}
	if (window.localStorage.getItem("AOZDesignerDefaults_ShowMargins")) {
		application.root.vars.SHOW_MARGINS$ = window.localStorage.getItem("AOZDesignerDefaults_ShowMargins");
	}
}

Client.prototype.addDesignerComponentEvents = function(controlId)
{
	var el =  document.getElementById(controlId);

	el.addEventListener( 'mousedown', function(event) {

		// Select the component
		application.aoz.runProcedure( 'SELECT_CONTROL',
		  {
			  "ID$": this.id
		  }
		);

		event.preventDefault();
		event.stopPropagation();

		var shiftX = event.clientX - this.getBoundingClientRect().left;
		var shiftY = event.clientY - this.getBoundingClientRect().top;
		var width = this.getBoundingClientRect().width;
		var height = this.getBoundingClientRect().height;

		var that = this;
		var dragging = true;

		application.aoz.runProcedure( 'SELECT_CONTROL_MOVE',
		  {
			  "ID$": that.id,
			  "SHIFTX": shiftX / application.root.vars.MINFITS_f,
			  "SHIFTY": shiftY / application.root.vars.MINFITS_f,
			  "WIDTH": width,
			  "HEIGHT": height,
			  "DRAGSTATE$": 'start'
		  }
		);

		// Track the mouse movement
		function onMouseMove(event) {
			if (dragging == true && application.root.vars.SELECTED_ID$ != '') {
				application.aoz.runProcedure( 'SELECT_CONTROL_MOVE',
				  {
					  "ID$": that.id,
					  "SHIFTX": shiftX / application.root.vars.MINFITS_f,
					  "SHIFTY": shiftY / application.root.vars.MINFITS_f,
					  "WIDTH": width,
					  "HEIGHT": height,
					  "DRAGSTATE$": 'dragging'
				  }
				);

				// Update adornment position
				application.adornment.style.top = (that.getBoundingClientRect().top -5) + 'px';
				application.adornment.style.left = (that.getBoundingClientRect().left - 5) + 'px';
			}
		}

		// Drop the component
		function onMouseUp(event) {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
			dragging = false;
			application.aoz.runProcedure( 'SELECT_CONTROL_MOVE',
			  {
				  "ID$": that.id,
				  "SHIFTX": shiftX / application.root.vars.MINFITS_f,
				  "SHIFTY": shiftY / application.root.vars.MINFITS_f,
				  "WIDTH": width,
				  "HEIGHT": height,
				  "DRAGSTATE$": 'end'
			  }
			);
		}

		// Track mouse events
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);

	}, false);

	// Prevents the click event of a component from firing
	el.addEventListener("click", function(event) {
		 event.preventDefault();
	}, false);

	el.addEventListener("dblclick", function(event) {
		 event.preventDefault();
		 application.aoz.runProcedure( 'FORCE_SELECT_CONTROL',
 		  {
 			  "ID$": this.id
 		  }
 		);
	}, false);

	// Changes mouse pointer when hovering over a component
	el.addEventListener("mouseenter", function(event) {
		 event.preventDefault();
		 this.style.cursor = 'pointer';
	}, false);

	el.addEventListener("mouseleave", function(event) {
		 event.preventDefault();
		 this.style.cursor = 'default';
	}, false);
}

Client.prototype.onClose = function()
{
	if (this.atom) {
		// Ask user to confirm to close without saving changes
		if (application.root.vars.SCREEN_HAS_CHANGES == true) {
			application.aoz.runProcedure( 'CONFIRM_CLOSE', {  } );
			return false;
		} else {
			return true;
		}
	}
}

Client.prototype.close = function()
{
	// Called from the designer when confirmed to close without saving changes
	if (this.atom) {
		this.atom.aozDesigner.close();
	}
}

Client.prototype.initDesignerEvents = function()
{
	// Custom code to provide a component adornment for selection and resize
	var eResize = false;
	var sResize = false;
	var wResize = false;
	var nResize = false;

	document.addEventListener( 'mouseup', function(event) {
		if (eResize == true) {
			eResize = false;
			var offsetRight = application.adornment.clientWidth - (event.clientX - application.adornment.offsetLeft);
			application.aoz.runProcedure( 'RESIZE_EAST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetRight + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'end'
			  }
			);
		}

		if (wResize == true) {
			wResize = false;
			var offsetLeft = event.clientX - application.adornment.offsetLeft;
			application.aoz.runProcedure( 'RESIZE_WEST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetLeft + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'end'
			  }
			);
		}

		if (sResize == true) {
			sResize = false;
			var offsetBottom = application.adornment.clientHeight - (event.clientY - application.adornment.offsetTop);
			application.aoz.runProcedure( 'RESIZE_SOUTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetBottom + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'end'
			  }
			);
		}

		if (nResize == true) {
			nResize = false;
			var offsetTop = event.clientY - application.adornment.offsetTop;
			application.aoz.runProcedure( 'RESIZE_NORTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetTop + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'end'
			  }
			);
		}

	}, false);

	// Tracks the mouse position over the window
	var handleMousemove = (event) => {
		var info = application.aoz.renderingContext.getCoordinatesFromEvent( event );
		application.root.vars.MOUSE_XPOS = info.x;
		application.root.vars.MOUSE_YPOS = info.y;

		if (eResize == true && application.root.vars.SELECTED_ID$ != '') {
			var offsetRight = application.adornment.clientWidth - (event.clientX - application.adornment.offsetLeft);
			application.aoz.runProcedure( 'RESIZE_EAST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetRight + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'dragging'
			  }
			);
		}

		if (wResize == true && application.root.vars.SELECTED_ID$ != '') {
			var offsetLeft = event.clientX - application.adornment.offsetLeft;
			application.aoz.runProcedure( 'RESIZE_WEST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetLeft + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'dragging'
			  }
			);
		}

		if (sResize == true && application.root.vars.SELECTED_ID$ != '') {
			var offsetBottom = application.adornment.clientHeight - (event.clientY - application.adornment.offsetTop);
			application.aoz.runProcedure( 'RESIZE_SOUTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetBottom + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'dragging'
			  }
			);
		}

		if (nResize == true && application.root.vars.SELECTED_ID$ != '') {
			var offsetTop = event.clientY - application.adornment.offsetTop;
			application.aoz.runProcedure( 'RESIZE_NORTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetTop + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'dragging'
			  }
			);
		}
	};

	// When resizing the window, calculate scale and hide the component selector adornment
	var handleResize = (event) => {
		var wFits = window.innerWidth / application.aoz.manifest.display.width;
		var hFits = window.innerHeight / application.aoz.manifest.display.height;
		var minFits = wFits > hFits ? hFits : wFits;
		application.root.vars.MINFITS_f = minFits
		application.hideAdornment();
		application.aoz.ui.delete( { group: 'margin_labels' });
		application.aoz.currentScreen.cls();
		application.aoz.runProcedure( 'DisplayScreen');
	}

	// hide the component selector adornment
	application.hideAdornment = function (){
		[].forEach.call(document.querySelectorAll('.ui_adornment'),function(e){
		  e.style.display = 'none';
		});
	}

	// Listen for events
	document.addEventListener('mousemove', handleMousemove);
	window.addEventListener( 'resize', handleResize);

	handleResize();

	// Handler for the delete adornment icon click
	var handleDeleteIconClick = (event) => {
		application.hideAdornment();
		application.aoz.runProcedure( 'DELETE_CONTROL',
		  {
			  "ID$": application.adornment.getAttribute('data-control-id'),
			  "SKIP_UNDO": false
		  }
		);
	};

	// Handler for the duplicate adornment icon click
	var handleDuplicateIconClick = (event) => {
		application.aoz.runProcedure( 'DUPLICATE_CONTROL',
		  {
			  "ID$": application.adornment.getAttribute('data-control-id')
		  }
		);
	};

	// Handler for the center adornment icon click
	var handleCenterHorizontalIconClick = (event) => {
		application.aoz.runProcedure( 'CENTER_HORIZONTAL_CONTROL',
		  {
			  "ID$": application.adornment.getAttribute('data-control-id')
		  }
		);
	};

	// Handler for the center adornment icon click
	var handleCenterVerticalIconClick = (event) => {
		application.aoz.runProcedure( 'CENTER_VERTICAL_CONTROL',
		  {
			  "ID$": application.adornment.getAttribute('data-control-id')
		  }
		);
	};

	// Create the adornment for component selector
	var el = document.createElement('div');

	// east resize
	var rp = document.createElement('div')
	rp.setAttribute('class', 'ui_adornment_right ui_noselect');
	rp.addEventListener( 'mousedown', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-width')) {
			eResize = true;
			var offsetRight = application.adornment.clientWidth - (event.clientX - application.adornment.offsetLeft);
			application.aoz.runProcedure( 'RESIZE_EAST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetRight + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'start'
			  }
			);
		}

	}, false);
	rp.addEventListener( 'mouseover', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-width')) {
			this.style.cursor = "e-resize";
		} else {
			this.style.cursor = "default";
		}

	}, false);
	el.appendChild(rp);

	// west resize
	var lp = document.createElement('div')
	lp.setAttribute('class', 'ui_adornment_left ui_noselect');
	lp.addEventListener( 'mousedown', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-width')) {
			wResize = true;
			var offsetLeft = event.clientX - application.adornment.offsetLeft;
			application.aoz.runProcedure( 'RESIZE_WEST',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetLeft + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'start'
			  }
			);
		}

	}, false);
	lp.addEventListener( 'mouseover', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-width')) {
			this.style.cursor = "w-resize";
		} else {
			this.style.cursor = "default";
		}

	}, false);
	el.appendChild(lp);

	// south resize
	var bp = document.createElement('div');
	bp.setAttribute('class', 'ui_adornment_bottom ui_noselect');
	bp.addEventListener( 'mousedown', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-height')) {
			sResize = true;
			var offsetBottom = application.adornment.clientHeight - (event.clientY - application.adornment.offsetTop);
			application.aoz.runProcedure( 'RESIZE_SOUTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetBottom + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'start'
			  }
			);
		}

	}, false);
	bp.addEventListener( 'mouseover', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-height')) {
			this.style.cursor = "s-resize";
		} else {
			this.style.cursor = "default";
		}

	}, false);
	el.appendChild(bp);

	// north resize
	var up = document.createElement('div')
	up.setAttribute('class', 'ui_adornment_top ui_noselect');
	up.addEventListener( 'mousedown', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-height')) {
			nResize = true;
			var offsetTop = event.clientY - application.adornment.offsetTop;
			application.aoz.runProcedure( 'RESIZE_NORTH',
			  {
				  "ID$": application.adornment.getAttribute('data-control-id'),
				  "OFFSET": (offsetTop + 5) * application.root.vars.MINFITS_f,
				  "DRAGSTATE$": 'start'
			  }
			);
		}

	}, false);
	up.addEventListener( 'mouseover', function(event) {
		var el = document.getElementById(application.root.vars.SELECTED_ID$);
		if (el && el.getAttribute('data-height')) {
			this.style.cursor = "n-resize";
		} else {
			this.style.cursor = "default";
		}

	}, false);
	el.appendChild(up);

	// Delete icon
	var i = document.createElement('i');
	i.setAttribute('class', 'bi bi-trash-fill ui_adornment_delete text-danger');
	i.addEventListener( 'mousedown', handleDeleteIconClick);
	el.appendChild(i);

	// Duplicate icon
	i = document.createElement('i');
	i.setAttribute('class', 'bi bi-stickies-fill ui_adornment_duplicate text-primary');
	i.addEventListener( 'mousedown', handleDuplicateIconClick);
	el.appendChild(i);

	// Center icon
	i = document.createElement('i');
	i.setAttribute('class', 'bi bi-arrows-collapse ui_adornment_horizontal_center');
	i.addEventListener( 'mousedown', handleCenterHorizontalIconClick);
	el.appendChild(i);

	// Center icon
	i = document.createElement('i');
	i.setAttribute('class', 'bi bi-arrows-collapse ui_adornment_vertical_center');
	i.addEventListener( 'mousedown', handleCenterVerticalIconClick);
	el.appendChild(i);

	el.setAttribute('class', 'ui_adornment');
	el.style.display = 'none';

	application.adornment = el;
	document.body.appendChild(el);
}


var client = new Client();
