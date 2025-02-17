/*@****************************************************************************
*
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
*
****************************************************************************@*/
//
// The UI Instruction
// By Phil Bell
// Version 0.99
// 02/07/2021
// (c) AOZ Studio 2021
//
// Compiled with AOZ Transpiler Version 14.03 on the %2
//

function v1_0_ui( aoz, args )
{
	this.aoz=aoz;
	this.parent=this;
	this.root=this;
	this.manifest=JSON.parse(atob('eyJ2ZXJzaW9uIjoiOSIsInZlcnNpb25Nb2R1bGUiOiIxIiwiaW5mb3MiOnsiYXBwbGljYXRpb25OYW1lIjoiVGhlIFVJIEluc3RydWN0aW9uIiwiYXV0aG9yIjoiQnkgUGhpbCBCZWxsIiwidmVyc2lvbiI6IlZlcnNpb24gMC45OSIsImRhdGUiOiIwMi8wNy8yMDIxIiwiY29weXJpZ2h0IjoiKGMpIEFPWiBTdHVkaW8gMjAyMSIsInN0YXJ0IjoidWkuYW96IiwibmFtZSI6InVpIn0sImNvbXBpbGF0aW9uIjp7Im5vV2FybmluZyI6WyJpbnN0cnVjdGlvbl9ub3RfaW1wbGVtZW50ZWQiXSwiZXJyb3JzIjp7ImVuIjpbXSwiZnIiOltdfSwiZGlzcGxheUVuZEFsZXJ0IjpmYWxzZSwidXNlQXNzZXRzUmVzb3VyY2VzIjpmYWxzZX0sImJvb3RTY3JlZW4iOnsiYWN0aXZlIjpmYWxzZSwid2FpdFNvdW5kcyI6ZmFsc2UsImNsaWNrU291bmRzIjpmYWxzZX0sImVycm9ycyI6e319'));
	this.vars=typeof args=='undefined'?{}:args;
	this.contextName='v1_0_ui';
	this.aoz[ "module" + "Ui" ]=this;
	this.aoz.finalWait++;
	

this.blocks=[];
	this.blocks[0]=function(aoz,vars)
	{
		// From source: C:/AOZ_Studio/AOZ_Studio/app/aoz/languages/v1_0/ui/ui.aoz
		aoz.sourcePos="0:32:0";
		// Javascript
			this.aoz.ui = this;
			this.elements = [];
			var self = this;
			window.addEventListener( 'resize', function(event) {
				self.resize( event );
			}, false );
			this.resize = function(event) {
				if( this.elements != undefined && this.elements.length > 0 ) {
					var wFits = window.innerWidth / this.aoz.manifest.display.width;
					var hFits = window.innerHeight / this.aoz.manifest.display.height;
					var minFits = wFits > hFits ? hFits : wFits;
					var width = this.aoz.manifest.display.width * minFits;
					var height = this.aoz.manifest.display.height * minFits;
					var x, y, elWidth, elHeight, elPadding, elFontSize, radio, slider;
					for (var i = 0; i < this.elements.length; i++) {
						x = parseInt(this.elements[i].getAttribute('data-x')) * (width / this.aoz.manifest.display.width ) + (window.innerWidth - width) / 2;
						y = parseInt(this.elements[i].getAttribute('data-y')) * (height / this.aoz.manifest.display.height ) + (window.innerHeight - height) / 2;
						elWidth = this.elements[i].getAttribute('data-width');
						if (elWidth) {
							  this.elements[i].style.width = parseInt(this.elements[i].getAttribute('data-width')) * minFits + 'px';
						}
						elHeight = this.elements[i].getAttribute('data-height');
						if (elHeight) {
							elHeight = parseInt(elHeight) * minFits;
							this.elements[i].style.height = elHeight + 'px';
						}
						this.elements[i].style.top = y + 'px';
						this.elements[i].style.left = x + 'px';
						elPadding = this.elements[i].getAttribute('data-padding');
						if (elPadding) {
							this.elements[i].style.padding = parseInt(elPadding) * minFits + 'px';
						}
						elFontSize = this.elements[i].getAttribute('data-font-size');
						if (elFontSize) {
							this.elements[i].style.fontSize = parseInt(elFontSize) * minFits + 'px';
						}
						radio = this.elements[i].getAttribute('data-radio');
						if (radio) {
							var opts = this.elements[i].querySelectorAll('.radio__container');
							if (opts) {
								for(var o = 0; o < opts.length; o++) {
									opts[o].style.setProperty("--margin-bottom", 8 * minFits + 'px');
									opts[o].style.setProperty("--width", parseInt(elFontSize)  * minFits + 'px');
									opts[o].style.setProperty("--height", parseInt(elFontSize)  * minFits + 'px');
								}
							}
						}
						slider = this.elements[i].getAttribute('data-slider');
						if (slider) {
							this.elements[i].style.setProperty("--width", 40  * minFits + 'px');
							this.elements[i].style.setProperty("--height", 40  * minFits + 'px');
							this.elements[i].style.setProperty("--margin-top", -13 * minFits + 'px');
							this.elements[i].style.setProperty("--track-height", 15 * minFits + 'px');
						}
					}
				}
			}
			this.addElement = function( args ) {
				switch ( args.type )
				{
					case 'button':
						return this.addButton( args );
					case 'textArea':
						return this.addTextArea( args );
					case 'popup':
						return this.showPopup( args );
					case 'progress':
						return this.addProgress( args );
					case 'radio':
						return this.addRadio( args );
					case 'textBlock':
						return this.addTextBlock( args );
					case 'colorPicker':
						return this.addColourPicker( args );
					case 'slider':
						return this.addSlider( args );
					case 'select':
						return this.addSelect( args );
					case 'checkBox':
						return this.addCheckBox( args );
					case 'textBox':
						return this.addTextBox( args );
					case 'iFrame':
						return this.addIFrame( args );
					case 'image':
						return this.addImage( args );
				}
				return null;
			}
			this.setPosition = function( args )
			{
				if ( typeof args.id != 'undefined' ) {
					var el =  document.getElementById(args.id);
					if (el) {
						el.style.top = args.y + 'px';
						el.style.left = args.x + 'px';
						el.setAttribute('data-x', parseInt(args.x));
						el.setAttribute('data-y', parseInt(args.y));
					}
				}
			}
			this.getProperty = function (id, propertyName) {
				if (id) {
					var el =  document.getElementById(id);
					if (el) {
						switch (propertyName.toLowerCase()) {
							case 'x':
								return parseInt(el.getAttribute('data-x'));
								break;
							case 'y':
								return parseInt(el.getAttribute('data-y'));
								break;
							case 'width':
								if (el.getAttribute('data-width')) {
									return parseInt(el.getAttribute('data-width'));
								} else {
									return 0;
								}
								break;
							case 'height':
								if (el.getAttribute('data-height')) {
									return parseInt(el.getAttribute('data-height'));
								} else {
									return 0;
								}
								break;
							case 'fontsize':
								if (el.getAttribute('data-font-size')) {
									return parseInt(el.getAttribute('data-font-size'));
								} else {
									return 0;
								}
								break;
							case 'padding':
								if (el.getAttribute('data-padding')) {
									return parseInt(el.getAttribute('data-padding'));
								} else {
									return 0;
								}
								break;
							case 'rows':
								if (el.getAttribute('rows')) {
									return parseInt(el.getAttribute('rows'));
								} else {
									return 0;
								}
								break;
							case 'min':
								var sl = el.getElementsByTagName('input');
								if (sl && sl.length > 0) {
									if (sl[0].getAttribute('min')) {
										return parseInt(sl[0].getAttribute('min'));
									}
								} else {
									if (el.getAttribute('min')) {
										return parseInt(el.getAttribute('min'));
									} else {
										return 0;
									}
								}
								break;
							case 'max':
								var sl = el.getElementsByTagName('input');
								if (sl && sl.length > 0) {
									if (sl[0].getAttribute('max')) {
										return parseInt(sl[0].getAttribute('max'));
									}
								} else {
									if (el.getAttribute('max')) {
										return parseInt(el.getAttribute('max'));
									} else {
										return 100;
									}
								}
								break;
							case 'step':
								var sl = el.getElementsByTagName('input');
								if (sl && sl.length > 0) {
									if (sl[0].getAttribute('step')) {
										return parseInt(sl[0].getAttribute('step'));
									}
								} else {
									if (el.getAttribute('step')) {
										return parseInt(el.getAttribute('step'));
									} else {
										return 1;
									}
								}
								break;
							case 'content':
								var content = el.getAttribute('content');
								if (content) {
									return content;
								} else {
									var type = el.getAttribute('type');
									if (type && type == 'button') {
										return '';
									} else {
										return el.innerHTML;
									}
								}
								break;
							case 'fontname':
								var s = el.style.fontFamily.replace(/^"(.*)"$/, '$1');
								return s;
								break;
							case 'placeholder':
								if (el.getAttribute('placeHolder')) {
									return el.getAttribute('placeHolder');
								} else {
									return '';
								}
								break;
							case 'tooltip':
								if (el.getAttribute('data-tooltip')) {
									return el.getAttribute('data-tooltip');
								} else {
									return '';
								}
								break;
							case 'tooltipplacement':
								if (el.getAttribute('data-tooltip-placement')) {
									return el.getAttribute('data-tooltip-placement');
								} else {
									return '';
								}
								break;
							case 'iconclass':
								if (el.getAttribute('data-icon-class')) {
									return el.getAttribute('data-icon-class');
								} else {
									return '';
								}
								break;
							case 'class':
								if (el.getAttribute('data-class')) {
									return el.getAttribute('data-class');
								} else {
									return '';
								}
								break;
							case 'group':
								if (el.getAttribute('data-group')) {
									return el.getAttribute('data-group');
								} else {
									return '';
								}
								break;
							case 'type':
								if (el.getAttribute('type')) {
									return el.getAttribute('type');
								} else {
									return '';
								}
								break;
							case 'onclick':
								if (el.getAttribute('data-onclick')) {
									return el.getAttribute('data-onclick');
								} else {
									return '';
								}
								break;
							case 'onchange':
								if (el.getAttribute('data-onchange')) {
									return el.getAttribute('data-onchange');
								} else {
									return '';
								}
								break;
							case 'items':
								if (el.getAttribute('data-items')) {
									return el.getAttribute('data-items');
								} else {
									return '';
								}
								break;
							case 'value':
								return this.getValue({ id: id });
								break;
							case 'src':
								var elf = el.getElementsByTagName('iframe');
								if (elf && elf.length > 0) {
									if (elf[0].getAttribute('src')) {
										return elf[0].getAttribute('src');
									} else {
										return '';
									}
								} else {
									if( el.hasAttribute( 'data-src' ) && el.hasAttribute( 'src' ) ){
										return el.getAttribute( 'src' );
									}
									return '';
								}
						}
					}
				}
			}
			this.updateId = function(id, newId) {
				if (id == newId) {
					return;
				}
				var el = document.getElementById(newId);
				if (el) {
					throw 'ui_updateId_newId_already_exists';
					return
				}
				el = document.getElementById(id);
				el.id = newId;
				var icon = el.getElementsByTagName('i');
				if (icon.length > 0) {
					icon[0].id = newId + '_icon';
				}
				if (el.getAttribute('data-radio')) {
					var children = el.getElementsByTagName('input');
					for(var i = 0; i< children.length;i++)
					{
						children[i].id = newId + '_option_' + children[i].value;
						children[i].setAttribute('name', newId);
					}
				}
			}
			this.makeRandom = function(lengthOfCode) {
				var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
				let text = '';
				for (var i = 0; i < lengthOfCode; i++) {
				  text += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				return text;
			  }
			this.clone = function(id, newId) {
				if (id) {
					var el =  document.getElementById(id);
					if (el) {
						var copy = el.cloneNode(true);
						copy.id = newId;
						copy.setAttribute('data-x', parseInt(el.getAttribute('data-x')) + 20);
						copy.setAttribute('data-y', parseInt(el.getAttribute('data-y')) + 20);
						var icon = copy.getElementsByTagName('i');
						if (icon.length > 0) {
							icon[0].id = newId + '_icon';
						}
						if (copy.getAttribute('data-bs-toggle')) {
							var tooltip = new bootstrap.Tooltip(copy);
						}
						if (copy.getAttribute('data-radio')) {
							var children = copy.getElementsByTagName('input');
							for(var i = 0; i< children.length;i++)
							{
								children[i].id = newId + '_option_' + children[i].value;
								children[i].setAttribute('name', newId);
							}
						}
						if (el.value && el.value != '') {
							copy.value = el.value;
						}
						document.body.appendChild(copy);
						this.elements.push(copy);
						this.resize();
					}
				}
			}
			this.delete = function(args) {
				var index, self = this;
				if (args.id) {
					this.removeElement(args.id);
				}
				var ids = [];
				for (i = 0; i < this.elements.length; i++) {
					ids.push( { id: this.elements[i].id, group: this.elements[i].getAttribute('data-group') });
				}
				if (args.group)	{
					for (i = 0; i < ids.length; i++) {
						if (ids[i].group == args.group) {
							this.removeElement(ids[i].id);
						}
					}
				}
				if (typeof args.id == 'undefined' && typeof args.group == 'undefined') {
					for (i = 0; i < ids.length; i++) {
						this.removeElement(ids[i].id);
					}
					this.elements = [];
				}
			}
			this.setFocus = function( id )
			{
				if( typeof id == 'undefined' )
				{
					throw 'ui_set_focus_argument_id_missing';
				}
				var el = document.getElementById(id);
				if (el) {
					el.focus();
				}
			}
			this.removeElement = function(id) {
				if (id) {
					var el =  document.getElementById(id);
					if (el) {
						var tooltip = el.getAttribute('aria-describedby');
						if (tooltip) {
							tooltip = document.getElementById(tooltip);
							if(tooltip) {
								tooltip.remove();
							}
						}
						el.parentNode.replaceChild(el.cloneNode(true), el);
						el = document.getElementById(id);
						el.parentNode.removeChild(el);
						var index = this.elements.findIndex(d => d.id === id);
						if (index >= 0) {
							this.elements.splice(index, 1);
						}
					}
				}
			}
			this.getValue = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_get_value_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_get_value_argument_id_missing';
				}
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					var radio = el.getAttribute('data-radio');
					if (radio) {
						var opts = el.getElementsByTagName('input');
						for(var i = 0; i < opts.length; i++) {
							if (opts[i].checked) {
								return opts[i].getAttribute('value');
							}
						}
						return '';
					} else {
						var slider = el.getAttribute('data-slider');
						if (slider) {
							var sl = el.getElementsByTagName('input');
							if (sl && sl.length > 0) {
								return sl[0].value;
							} else {
								return 0;
							}
						} else {
							var progress = el.getAttribute('data-progress');
							if (progress) {
								return el.getAttribute('data-pr-value');
							} else {
								var type = el.getAttribute('type');
								if (type == 'checkbox') {
									return el.checked.toString();
								} else {
									var content = el.getAttribute('data-content');
									if (content) {
										return el.innerHTML;
									} else {
										if (el && el.value != undefined) {
											return el.value;
										} else {
											return el.innerHTML;
										}
									}
								}
							}
						}
					}
				}
			}
			this.setAttribute = function(args) {
				if( args == undefined || args == null || args.length == 0)
					throw 'ui_set_attribute_arguments_missing';
				if( typeof args.id == 'undefined' )
					throw 'ui_set_attribute_arguments_missing';
				if( typeof args.prop == 'undefined' )
					throw 'ui_set_attribute_arguments_missing';
				if( typeof args.value == 'undefined' )
					throw 'ui_set_attribute_arguments_missing';
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					el.setAttribute(args.prop, args.value);
				}
			};
			this.setVisible = function(args) {
				if( args == undefined || args == null || args.length == 0)
					throw 'ui_set_attribute_arguments_missing';
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					if (el) {
					if (!args.visible) {
						this.hideTooltip(args);
					}
					el.style.display = args.visible ? 'block' : 'none';
				}
				}
				if (args.group) {
					for (i = 0; i < this.elements.length; i++) {
						var group = this.elements[i].getAttribute('data-group');
						if (group && group === args.group) {
							var el =  document.getElementById(this.elements[i].id);
							if (el) {
								if (!args.visible) {
									this.hideTooltip({ id: this.elements[i].id });
								}
								el.style.display = args.visible ? 'block' : 'none';
							}
						}
					}
				}
				if (!args.id && !args.group) {
					for (i = 0; i < this.elements.length; i++) {
						var el =  document.getElementById(this.elements[i].id);
						if (el) {
							if (!args.visible) {
								this.hideTooltip({ id: this.elements[i].id });
							}
							el.style.display = args.visible ? 'block' : 'none';
						}
					}
				}
			};
			this.setEnable = function(args) {
				if( args == undefined || args == null || args.length == 0)
					throw 'ui_set_attribute_arguments_missing';
				if( typeof args.id == 'undefined' )
					throw 'ui_set_attribute_id_arguments_missing';
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					if (!args.value) {
						el.setAttribute( 'disabled', '' );
						el.style.pointerEvents = 'none';
					}
					else
					{
						if( el.hasAttribute( 'disabled' ) )
						{
							el.removeAttribute( 'disabled' );
						}
						el.style.pointerEvents = 'auto';
					}
				}
			};
			this.hideTooltip = function (args) {
				if( args == undefined || args == null || args.length == 0)
					throw 'ui_hidetooltip_arguments_missing';
				if( typeof args.id == 'undefined' )
					throw 'ui_hidetooltip_id_arguments_missing';
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					if (el) {
						var tooltip =  bootstrap.Tooltip.getInstance(el);
						if (tooltip) {
							tooltip.hide();
						}
					}
				}
			}
			this.setValue = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_set_value_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_set_value_argument_id_missing';
				}
				if (args.id && args.id != '') {
					var el =  document.getElementById(args.id);
					var radio = el.getAttribute('data-radio');
					if (radio) {
						var children = el.getElementsByTagName('input');
						for(var i = 0; i< children.length;i++)
						{
							if (children[i].getAttribute('id') == el.id + '_option_' + args.value)
							{
								children[i].checked = true;
							}
						}
					} else {
						var slider = el.getAttribute('data-slider');
						if (slider) {
							var sl = el.getElementsByTagName('input');
							if (sl && sl.length > 0) {
								sl[0].value = parseInt(args.value);
							}
						} else {
							var progress = el.getAttribute('data-progress');
							if (progress) {
								var pr = el.querySelectorAll('.progress-bar')[0];
								if (pr) {
									pr.style = 'width: ' + args.value + '%';
									el.setAttribute('data-pr-value', args.value);
								}
							} else {
								var type = el.getAttribute('type');
								if (type == 'checkbox') {
									el.checked = false;
									if (args.value.toLowerCase() == 'true') {
										el.checked = true;
									}
								} else {
									if (type == 'number') {
										el.value = parseInt(args.value);
									} else {
										var content = el.getAttribute('data-content');
										if (content) {
											el.innerHTML = args.value;
										} else {
											if (el && el.value != undefined) {
												el.value = args.value
											} else {
												el.innerHTML = args.value;
											}
										}
									}
								}
							}
						}
					}
				}
			}
			this.addButton = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_button_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_button_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('button');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-group', '');
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('type', 'button');
					el.setAttribute('content', 'button');
					el.textContent = 'button';
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('data-class', args.class);
					el.setAttribute('class', args.class);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.content != 'undefined' && el.getAttribute('content') != args.content) {
					el.innerHTML = ''
					el.setAttribute('content', args.content);
					el.textContent = args.content;
					if (el.getAttribute('data-icon-class')) {
						var iel = document.createElement('i');
						iel.id = args.id + '_icon';
						iel.setAttribute('aria-hidden', 'true');
						if (el.textContent != '') {
							iel.setAttribute('style', 'margin-right: 5px');
						}
						iel.setAttribute('class', el.getAttribute('data-icon-class'));
						el.prepend(iel);
					}
				}
				if (typeof args.iconClass != 'undefined') {
					var children = el.getElementsByTagName('i');
					var iel;
					for(var i = 0; i< children.length;i++)
					{
						if (children[i].getAttribute('id') == args.id + '_icon')
						{
							 iel = children[i];
						}
					}
					if (!iel) {
						iel = document.createElement('i');
						iel.id = args.id + '_icon';
						iel.setAttribute('aria-hidden', 'true');
						if (el.textContent != '') {
							iel.setAttribute('style', 'margin-right: 5px');
						}
						el.prepend(iel);
					}
					if (args.iconClass == '') {
						el.removeAttribute('data-icon-class');
						iel.remove();
					} else {
						iel.setAttribute('class', args.iconClass);
						el.setAttribute('data-icon-class', args.iconClass);
					}
				}
				if (typeof args.tooltip != 'undefined') {
					if (args.tooltip == '') {
						var tooltip = bootstrap.Tooltip.getInstance(el);
						if (tooltip) tooltip.dispose();
						el.removeAttribute('data-tooltip');
					} else {
						el.setAttribute('data-bs-toggle', 'tooltip');
						el.setAttribute('title', args.tooltip);
						el.setAttribute('data-tooltip', args.tooltip);
						if (!el.getAttribute('data-bs-placement')) {
							el.setAttribute('data-bs-placement', 'auto');
							el.setAttribute('data-tooltip-placement', 'auto');
						}
						var tooltip = new bootstrap.Tooltip(el);
					}
				}
				if (typeof args.tooltipPlacement != 'undefined') {
					el.setAttribute('data-bs-placement', args.tooltipPlacement);
					el.setAttribute('data-tooltip-placement', args.tooltipPlacement);
					var tooltip = new bootstrap.Tooltip(el, {placement: args.tooltipPlacement});
				}
				if (typeof args.onClick != 'undefined' && el.getAttribute('data-onclick') != args.onClick) {
					if (el.getAttribute('data-onclick') != null) {
						el.removeEventListener("click", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onClick,
						{
								"ID$": el.id
						}
					);
				}
					el.setAttribute('data-onclick', args.onClick);
					el.addEventListener( 'click', el.handler, false);
				}
				this.resize()
			}
			this.addTextBox = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_textbox_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_textbox_argument_id_missing';
				}
				var handler = function (event) {
					event.preventDefault();
					if (this.getAttribute('type') && (this.getAttribute('type').toLowerCase() == 'number' || this.getAttribute('type').toLowerCase() == 'range')) {
						if (this.getAttribute('min')) {
							var min = parseInt(this.getAttribute('min'));
							if (parseInt(this.value) < min) {
								this.value = min;
							}
						}
						if (this.getAttribute('max')) {
							var max = parseInt(this.getAttribute('max'));
							if (parseInt(this.value) > max) {
								this.value = max;
							}
						}
					}
					var onChange = this.getAttribute('data-onchange');
					if (onChange) {
						aoz.runProcedure( onChange,
							{
								"ID$": this.id,
								"VALUE$": this.value
							}
						);
					}
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('input');
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 300);
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('data-group', '');
					el.setAttribute('id', args.id);
					el.setAttribute('autocomplete', 'none');
					el.setAttribute('keys-binding', 'yes' );
					el.addEventListener( 'input', handler, false);
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.min != 'undefined' && parseInt(el.getAttribute('min')) != args.min) {
					el.setAttribute('min', args.min);
				}
				if (typeof args.max != 'undefined' && parseInt(el.getAttribute('max')) != args.max) {
					el.setAttribute('max', args.max);
				}
				if (typeof args.step != 'undefined' && parseInt(el.getAttribute('step')) != args.max) {
					el.setAttribute('step', args.step);
				}
				if (typeof args.type != 'undefined' && el.getAttribute('type') != args.type) {
					el.setAttribute('type', args.type);
				}
				if (typeof args.value != 'undefined' && el.value != args.value) {
					if (el.getAttribute('type') && el.getAttribute('type').toLowerCase() == 'number') {
						el.value = parseInt(args.value);
					} else {
						el.value = args.value;
					}
				}
				if (typeof args.placeHolder != 'undefined' && el.getAttribute('placeHolder') != args.placeHolder) {
					el.setAttribute('placeholder', args.placeHolder)
				}
				if (typeof args.onChange != 'undefined' && el.getAttribute('data-onchange') != args.onChange) {
					el.setAttribute('data-onchange', args.onChange);
				}
				this.resize()
			}
			this.addTextArea = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_textarea_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_textarea_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('textarea');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 300);
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('data-group', '');
					el.setAttribute('rows', 2);
					el.setAttribute('keys-binding', 'yes' );
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.value != 'undefined' && el.value != args.value) {
					el.value = args.value;
				}
				if (typeof args.placeHolder != 'undefined' && el.getAttribute('placeHolder') != args.placeHolder) {
					el.setAttribute('placeholder', args.placeHolder)
				}
				if (typeof args.rows != 'undefined' && parseInt(el.getAttribute('rows')) != args.rows) {
					el.setAttribute('rows', args.rows);
				}
				this.resize()
			}
			this.addCheckBox = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_checkbox_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_checkbox_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('input');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 30);
					el.setAttribute('data-height', 30);
					el.setAttribute('data-group', '');
					el.setAttribute('type', 'checkbox');
					el.checked = false;
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.value != 'undefined') {
					el.checked = false;
					if (args.value.toLowerCase() == 'true') {
						el.checked = true;
					}
				}
				if (typeof args.onChange != 'undefined') {
					if (el.getAttribute('data-onchange') != null) {
						el.removeEventListener("change", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onChange,
						{
								"ID$": el.id,
							"VALUE$": this.checked.toString()
						}
					);
				}
					el.setAttribute('data-onchange', args.onChange);
					el.addEventListener( 'change', el.handler, false);
				}
				this.resize()
			}
			this.addSelect = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_select_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_select_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('select');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.style.backgroundSize = 'auto';
					el.style.backgroundPosition = 'right 2px center';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 300);
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('data-group', '');
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.items != 'undefined') {
					if (args.items == '') {
						el.removeAttribute('data-items');
						el.innerHTML = '';
					} else {
						el.setAttribute('data-items', args.items);
						var items = args.items.split(',');
						if (items) {
							var v = '';
							if (typeof args.value != 'undefined') {
								v = args.value;
							} else {
								v = this.getValue(args);
							}
							while (el.options.length > 0) {
								el.options.remove(0);
							}
							for(var i = 0; i < items.length; i++ )
							{
								var parts = items[i].split( ":" );
								var option = document.createElement('option');
								option.text = parts[1];
								option.value = parts[0];
								if (parts.length > 2) {
									option.style.fontFamily = parts[2];
								}
								el.options.add( option );
							}
							if (v == ''){
								el.options[0].selected = true;
							} else {
								this.setValue({ id: args.id, value: v})
							}
						}
					}
				}
				if (typeof args.value != 'undefined' && el.options.length > 0) {
					for(var i = 0; i < el.options.length; i++) {
						if (el.options[i].value == args.value) {
							el.options[i].selected = true;
						} else {
							el.options[i].selected = false;
						}
					}
				}
				if (typeof args.onChange != 'undefined') {
					if (el.getAttribute('data-onchange') != null) {
						el.removeEventListener("change", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onChange,
						{
								"ID$": el.id,
							"VALUE$": this.value
						}
					);
				}
					el.setAttribute('data-onchange', args.onChange);
					el.addEventListener( 'change', el.handler, false);
				}
				this.resize()
			}
			this.addSlider = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_slider_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_slider_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				var sl;
				var cls = 'slider__custom';
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 300);
					el.setAttribute('data-slider', 1);
					el.setAttribute('data-group', '');
					el.setAttribute('class', 'slider__custom');
					sl = document.createElement('input');
					sl.setAttribute('min', 0);
					sl.setAttribute('max', 100);
					sl.setAttribute('step', 1);
					sl.setAttribute('type', 'range');
					sl.value = 0;
					el.appendChild(sl);
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				sl = el.querySelectorAll('input');
				if (typeof args.min != 'undefined' && parseInt(el.getAttribute('min')) != args.min) {
					sl[0].setAttribute('min', args.min);
				}
				if (typeof args.max != 'undefined' && parseInt(el.getAttribute('max')) != args.max) {
					sl[0].setAttribute('max', args.max);
				}
				if (typeof args.step != 'undefined' && parseInt(el.getAttribute('step')) != args.step) {
					sl[0].setAttribute('step', args.step);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', cls + ' ' + args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.value != 'undefined' && el.value != args.value) {
					sl[0].value = parseInt(args.value);
				}
				if (typeof args.onChange != 'undefined') {
					if (el.getAttribute('data-onchange') != null) {
						sl[0].removeEventListener("input", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onChange,
						{
							"ID$": el.id,
							"VALUE": this.value,
							"VALUE$": this.value.toString()
						}
					);
				}
					el.setAttribute('data-onchange', args.onChange);
					sl[0].addEventListener( 'input', el.handler, false);
				}
				this.resize()
			}
			this.addColourPicker = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_colour_picker_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_colour_picker_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('input');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 40);
					el.setAttribute('data-height', 40);
					el.setAttribute('data-group', '');
					el.setAttribute('type', 'color');
					el.value = '#ffffff';
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.value != 'undefined' && el.value != args.value) {
					el.value = args.value;
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.onChange != 'undefined') {
					if (el.getAttribute('data-onchange') != null) {
						el.removeEventListener("input", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onChange,
						{
								"ID$": el.id,
							"VALUE$": this.value
						}
					);
				}
					el.setAttribute('data-onchange', args.onChange);
					el.addEventListener( 'input', el.handler, false);
				}
				this.resize()
			}
			this.sanitizeHTML = function(text) {
			  var element = document.createElement('div');
			  element.innerText = text;
			  return element.innerHTML;
			}
			this.addIFrame = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_iframe_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_iframe_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 400);
					el.setAttribute('data-height', 400);
					el.setAttribute('data-group', '');
					var elf = document.createElement('iframe');
					el.appendChild(elf);
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.src != 'undefined' && el.getAttribute('src') != args.src) {
					elf = el.getElementsByTagName('iframe');
					elf[0].setAttribute('class', 'iframe__responsive');
					elf[0].setAttribute('src', args.src);
					elf[0].setAttribute('name', Date.now().toString());
				}
				this.resize();
			}
			this.addImage = function( args ) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_image_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_image_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('img');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 160);
					el.setAttribute('data-height', 128);
					el.setAttribute('data-group', '');
					el.setAttribute('data-src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAaCAIAAABZ+cloAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpVJaROwg4pChdrIgKuIoVSyChdJWaNXB5NIvaGJIUlwcBdeCgx+LVQcXZ10dXAVB8APEzc1J0UVK/F9SaBHjwXE/3t173L0DhGaNqWbPOKBqlpFJJsR8YUUMvCKIAYQRRUxipp7KLuTgOb7u4ePrXZxneZ/7c4SVoskAn0g8y3TDIl4nnt60dM77xBFWkRTic+Ixgy5I/Mh12eU3zmWHBZ4ZMXKZOeIIsVjuYrmLWcVQiaeIo4qqUb6Qd1nhvMVZrdVZ+578haGitpzlOs0RJLGIFNIQIaOOKmqwEKdVI8VEhvYTHv5hx58ml0yuKhg55rEBFZLjB/+D392apckJNymUAHpfbPtjFAjsAq2GbX8f23brBPA/A1dax7/RBGY+SW90tOgR0L8NXFx3NHkPuNwBhp50yZAcyU9TKJWA9zP6pgIweAsEV93e2vs4fQBy1NXSDXBwCMTKlL3m8e6+7t7+PdPu7wepk3K9I4Jo0QAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB+UKEQ0nD2rqNG0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAACb0lEQVRIx8VWS08TURQ+d1oBUyIJDWLsQly4cMESN0bjwrgyDdHEpb/CH6CufSXVFRijiWKMRBKND2RhKIJ9maG2hVb6fsgwnc7Q18x0Zu51ISW19HFN2nhWc+/Md7+cc75vzkWX7dPT9ksnJ04AAAABQPWHFoEASZLU7m1T8LzwYm7BfP7s1LWrdkoMABTEAiGUHyPd0Bmb7Rj96f8YZGzMykB/A/WbAP4fAepRY8wt9qrbTGKe43MDxy+OnLpQF26PMkBEZ7Yeo2qYqPxu5Hl1O9zjEhG1hGrc/lIR4z0mQIcshLHsLwcs4/SKpMvANEAmrgNzGAANjZ8btk1S+AnWk7kbbz7dXXQWZbV7k8noaTxy26qppsFhGqMkBfHeVy8G4GRlKRC5MjXZXabENGgaOkJzelFWHctuXF8u/IznS5WeGU0z8JMVD6eoDdWCxWCksR+dCPJV5cEqO+sJqrrRsqvv2JCHLzTtfoilOanUnSApFm85fV5h98t2/tWPMGm2C3yPp+fD0ZbS+RgIk3oSTEtVsLmdm6usWNP3ABl+JZ5p5MiIxUcuFrWR5lIqmy1IrQkwoM9biTu+kIZJo8JnAtGosIcpK7WHy64axh3K+96/SQ4SaBi/ZDeebiYPugYDOLwhUVYNQp6teTNVuXP/nTkuxYt/+aCs6TOegE/YbYcRatqsL3hUk9d+5Wk09ta/cWbEYv6jLb4iO1z+eEXpjFkXS2I2TSnib1we5QUzAIoJ0n1PUNJ0qj8OoR0UCMCdypndae418RukT3MfmGgsYRDcp4kPpbIZuB3scqFRKy2K48DQaW46jKyQdPY3y604RoGcD/YAAAAASUVORK5CYII=' );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
					el.setAttribute( 'data-image', '' );
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.src != 'undefined' && el.getAttribute('data-src') != args.src) {
					el.setAttribute('data-src', args.src);
					el.setAttribute('src', args.src);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.image != 'undefined' && typeof args.image != '' && el.getAttribute('data-image') != args.image) {
					el.setAttribute('data-image', args.image);
					var src = this.aoz.banks.getImage( 'images', args.image ).canvas.toDataURL();
					el.setAttribute('src', src);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.tooltip != 'undefined') {
					if (args.tooltip == '') {
						var tooltip = bootstrap.Tooltip.getInstance(el);
						if (tooltip) tooltip.dispose();
						el.removeAttribute('data-tooltip');
					} else {
						el.setAttribute('data-bs-toggle', 'tooltip');
						el.setAttribute('title', args.tooltip);
						el.setAttribute('data-tooltip', args.tooltip);
						if (!el.getAttribute('data-bs-placement')) {
							el.setAttribute('data-bs-placement', 'auto');
							el.setAttribute('data-tooltip-placement', 'auto');
						}
						var tooltip = new bootstrap.Tooltip(el);
					}
				}
				if (typeof args.tooltipPlacement != 'undefined') {
					el.setAttribute('data-bs-placement', args.tooltipPlacement);
					el.setAttribute('data-tooltip-placement', args.tooltipPlacement);
					var tooltip = new bootstrap.Tooltip(el, {placement: args.tooltipPlacement});
				}
				if (typeof args.onClick != 'undefined' && el.getAttribute('data-onclick') != args.onClick) {
					if (el.getAttribute('data-onclick') != null) {
						el.removeEventListener("click", el.handler, false);
					}
					el.handler = function (event) {
					event.preventDefault();
					aoz.runProcedure( args.onClick,
						{
							"ID$": this.id
						}
					);
				}
					el.setAttribute('data-onclick', args.onClick);
					el.addEventListener( 'click', el.handler, false);
				}
				this.resize();
			}
			this.addTextBlock = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_text_block_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_text_block_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 400);
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('data-content', 1);
					el.setAttribute('data-group', '');
					el.innerHTML = 'TextBlock Content';
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
					el.style.overflowY = 'auto';
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.content != 'undefined' && el.innerHTML != args.content) {
					el.innerHTML = args.content;
				}
				this.resize()
			}
			this.addRadio = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_radio_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_add_radio_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('id', args.id);
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-font-size', 20);
					el.setAttribute('data-padding', 5);
					el.setAttribute('data-radio', 1);
					el.setAttribute('data-group', '');
					el.setAttribute('style', 'position: absolute;');
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.fontSize != 'undefined' && parseInt(el.getAttribute('data-font-size')) != args.fontSize) {
					el.setAttribute('data-font-size', args.fontSize);
				}
				if (typeof args.fontName != 'undefined' && el.style.fontFamily != args.fontName) {
					el.style.fontFamily = args.fontName;
				}
				if (typeof args.padding != 'undefined' && parseInt(el.getAttribute('data-padding')) != args.padding) {
					el.setAttribute('data-padding', args.padding);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					el.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
					var children = el.getElementsByTagName('span');
					for(var i = 0; i< children.length;i++)
					{
						children[i].setAttribute('class', 'radio__checkmark ' + args.class);
					}
				}
				if (typeof args.items != 'undefined') {
					if (args.items == '') {
						el.removeAttribute('data-items');
						el.innerHTML = '';
					} else {
						el.setAttribute('data-items', args.items);
						var v = '';
						if (typeof args.value != 'undefined') {
							v = args.value;
						} else {
							v = this.getValue(args);
						}
						var items = args.items.split(',');
						if (items) {
							el.textContent = '';
							el.setAttribute('content', '');
							for(var i = 0; i < items.length; i++ )
							{
								var parts = items[i].split( ":" );
								var label = document.createElement('label');
								label.setAttribute('class', 'radio__container');
								var radio = document.createElement('input');
								radio.setAttribute('type', 'radio');
								radio.setAttribute('name', args.id);
								radio.setAttribute('value', parts[0]);
								radio.setAttribute('id', args.id + '_option_' + parts[0]);
								radio.checked = false;
								if (v == parts[0]) {
									radio.checked = true;
								}
								label.appendChild(radio);
								var span = document.createElement('span');
								var cls = 'radio__checkmark';
								if (typeof args.class != 'undefined') {
									cls += ' ' + args.class;
								}
								span.setAttribute('class', cls);
								span.setAttribute('content', parts[1]);
								span.textContent = parts[1];
								if (parts.length > 2) {
									span.style.fontFamily = parts[2];
								}
								label.appendChild(span);
								el.appendChild(label);
							}
							if (v != ''){
								this.setValue({ id: args.id, value: v})
							}
						}
					}
				}
				if (typeof args.value != 'undefined') {
					var children = el.getElementsByTagName('input');
					for(var i = 0; i< children.length;i++)
					{
						if (children[i].getAttribute('id') == args.id + '_option_' + args.value)
						{
							 children[i].checked = true;
						}
					}
				}
				if (typeof args.onChange != 'undefined') {
					var opts = el.getElementsByTagName('input');
					if (el.getAttribute('data-onchange') != null) {
						for(var i = 0; i < opts.length; i++) {
							opts[i].removeEventListener("click", opts[i].handler);
						}
					}
					el.setAttribute('data-onchange', args.onChange);
					for(var i = 0; i < opts.length; i++) {
						opts[i].handler = function (event) {
					aoz.runProcedure( args.onChange,
						{
									"ID$": el.id,
							"VALUE$": this.value
						}
					);
				}
						opts[i].addEventListener( 'click', opts[i].handler);
					}
				}
				this.resize()
			}
			this.showPopup = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_show_popup_arguments_missing';
				}
				if( typeof args.id == 'undefined' )
				{
					throw 'ui_show_popup_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('class', 'position-absolute top-0 start-50 translate-middle-x p-3');
					el.setAttribute('style', 'z-index: 999999');
					el.setAttribute('id', args.id);
					document.body.appendChild(el);
					this.elements.push(el);
				}
				el.innerHTML = '';
				if (typeof args.placement != 'undefined') {
					switch (args.placement.toLowerCase()) {
						case 'bottom-right':
							el.setAttribute('class', 'position-fixed bottom-0 end-0 p-3');
							break;
						case 'bottom-left':
							el.setAttribute('class', 'position-fixed bottom-0 start-0 p-3');
							break;
						case 'top-left':
							el.setAttribute('class', 'position-fixed top-0 start-0 p-3');
							break;
						case 'top-right':
							el.setAttribute('class', 'position-fixed top-0 end-0 p-3');
							break;
						case 'top-center':
							el.setAttribute('class', 'position-absolute top-0 start-50 translate-middle-x p-3');
							break;
						case 'bottom-center':
							el.setAttribute('class', 'position-absolute bottom-0 start-50 translate-middle-x p-3');
							break;
						case 'center':
							el.setAttribute('class', 'position-absolute top-50 start-50 translate-middle');
							break;
						case 'left-center':
							el.setAttribute('class', 'position-absolute top-50 start-0 translate-middle-y p-3');
							break;
						case 'right-center':
							el.setAttribute('class', 'position-absolute top-50 end-0 translate-middle-y p-3');
							break;
					}
				}
				var toast = document.createElement('div');
				var toastClass = 'toast align-items-center border-0';
				if (typeof args.class != 'undefined') {
					toastClass += ' ' + args.class;
				}
				toast.setAttribute('class', toastClass);
				toast.setAttribute('role', 'alert');
				toast.setAttribute('aria-live', 'assertive');
				toast.setAttribute('aria-atomic', 'true');
				if (typeof args.delay != 'undefined') {
					toast.setAttribute('data-bs-delay', args.delay);
				}
				var header = document.createElement('div');
				header.setAttribute('class', 'd-flex');
				var button = document.createElement('button');
				button.setAttribute('type', 'button');
				button.setAttribute('class', 'btn-close me-2 m-auto');
				button.setAttribute('data-bs-dismiss', 'toast');
				button.setAttribute('aria-label', 'Close');
				var body = document.createElement('div');
				body.setAttribute('class', 'toast-body');
				if (typeof args.content == 'undefined') {
					body.innerHTML = 'Popup message...';
				} else {
					body.innerHTML = args.content;
				}
				el.appendChild(toast);
				header.appendChild(body);
				header.appendChild(button);
				toast.appendChild(header);
				var t = new bootstrap.Toast(toast);
				t.show();
			}
			this.addProgress = function(args) {
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_add_progress_arguments_missing';
				}
				if( typeof args.id == 'undefined')
				{
					throw 'ui_add_progress_argument_id_missing';
				}
				var el =  document.getElementById(args.id);
				if (!el) {
					el = document.createElement('div');
					el.setAttribute('id', args.id);
					el.style.position = 'absolute';
					el.setAttribute('data-x', 10);
					el.setAttribute('data-y', 10);
					el.setAttribute('data-width', 300);
					el.setAttribute('data-height', 20);
					el.setAttribute('data-progress', 1);
					el.setAttribute('data-pr-value', 0);
					el.setAttribute('class', 'progress')
					el.setAttribute('data-class', 'progress');
					el.setAttribute('data-group', '');
					document.body.appendChild(el);
					this.elements.push(el);
				}
				if (typeof args.x != 'undefined' && parseInt(el.getAttribute('data-x')) != args.x) {
					el.setAttribute('data-x', args.x);
				}
				if (typeof args.y != 'undefined' && parseInt(el.getAttribute('data-y')) != args.y) {
					el.setAttribute('data-y', args.y);
				}
				if (typeof args.width != 'undefined' && parseInt(el.getAttribute('data-width')) != args.width) {
					el.setAttribute('data-width', args.width);
				}
				if (typeof args.height != 'undefined' && parseInt(el.getAttribute('data-height')) != args.height) {
					el.setAttribute('data-height', args.height);
				}
				if (typeof args.group != 'undefined' && el.getAttribute('data-group') != args.group) {
					el.setAttribute('data-group', args.group);
				}
				var progress = el.querySelectorAll('.progress-bar')[0];
				if (!progress) {
					progress = document.createElement('div');
					progress.setAttribute('class', 'progress-bar');
					progress.setAttribute('role', 'progressbar');
					el.appendChild(progress);
				}
				if (typeof args.class != 'undefined' && el.getAttribute('class') != args.class) {
					progress.setAttribute('class', args.class);
					el.setAttribute('data-class', args.class);
				}
				if (typeof args.value != 'undefined') {
					progress.style = 'width: ' + args.value + '%';
					el.setAttribute('data-pr-value', args.value);
				}
				this.resize()
			}
			this.showModel = function(args) {
				var self = this;
				if( args == undefined || args == null || args.length == 0)
				{
					throw 'ui_show_model_arguments_missing';
				}
				var page = document.getElementById('aoz-full-page-container');
				if (page) this.removeElement('aoz-full-page-container');
				page = document.createElement('div');
				page.setAttribute('id', 'aoz-full-page-container');
				page.setAttribute('style', 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 999998; background: transparent;');
				document.body.appendChild(page);
				var model = document.createElement('div');
				model.setAttribute('id', 'aoz-model-container');
				model.setAttribute('class', 'modal fade');
				model.setAttribute('tabindex', '-1');
				model.setAttribute('aria-hidden', 'true');
				page.appendChild(model);
				var dialog = document.createElement('div');
				dialog.setAttribute('class', 'modal-dialog');
				var content = document.createElement('div');
				content.setAttribute('class', 'modal-content');
				var header = document.createElement('div');
				header.setAttribute('class', 'modal-header');
				var title = document.createElement('h5');
				title.setAttribute('class', 'modal-title');
				if (typeof args.title == 'undefined') {
					title.innerHTML = 'Confirm'
				} else {
					title.innerHTML = args.title;
				}
				var xButton = document.createElement('button');
				xButton.setAttribute('class', 'btn-close');
				xButton.setAttribute('data-bs-dismiss', 'modal');
				header.appendChild(title);
				header.appendChild(xButton);
				var body = document.createElement('div');
				body.setAttribute('class', 'modal-body');
				if (typeof args.content == 'undefined') {
					body.innerHTML = "Are you sure?"
				} else {
					if (args.content) {
						body.innerHTML = args.content;
					}
				}
				var input = null;
				if (args.inputType) {
					input = document.createElement('input');
					input.setAttribute('autocomplete', 'none');
					input.setAttribute('keys-binding', 'yes' );
					input.setAttribute('type', args.inputType);
					if (args.inputType == 'text') {
						if (typeof args.value == 'undefined') {
							input.value = '';
						} else {
							input.value = args.value;
						}
					} else {
						if (args.inputType == 'number') {
							if (typeof args.value == 'undefined') {
								input.value = 0;
							} else {
								input.value = parseInt(args.value);
							}
						}
					}
					body.appendChild(input);
				}
				var footer = document.createElement('div');
				footer.setAttribute('class', 'modal-footer');
				var closeButton = document.createElement('button');
				closeButton.setAttribute('class', 'btn btn-secondary');
				closeButton.setAttribute('data-bs-dismiss', 'modal');
				if (typeof args.closeButton != 'undefined') {
					closeButton.innerHTML = args.closeButton;
				} else {
					closeButton.innerHTML = 'Close';
				}
				var confirmButton = document.createElement('button');
				confirmButton.setAttribute('class', 'btn btn-success');
				if (typeof args.confirmButton != 'undefined') {
					confirmButton.innerHTML = args.confirmButton;
				} else {
					confirmButton.innerHTML = 'Confirm';
				}
				footer.appendChild(closeButton);
				footer.appendChild(confirmButton);
				content.appendChild(header);
				content.appendChild(body);
				content.appendChild(footer);
				dialog.appendChild(content);
				model.appendChild(dialog);
				var modelInstance = new bootstrap.Modal(model);
				model.addEventListener('hidden.bs.modal', function (event) {
					  self.removeElement('aoz-full-page-container');
				});
				confirmButton.addEventListener('click', function (event) {
					if (typeof args.onConfirm != 'undefined') {
						if (input) {
							if (input.getAttribute('type').toLowerCase() == 'number') {
								aoz.runProcedure( args.onConfirm,
									{
										"VALUE": parseInt(input.value)
									}
								);
							} else {
								aoz.runProcedure( args.onConfirm,
									{
										"VALUE$": input.value
									}
								);
							}
						} else {
							aoz.runProcedure( args.onConfirm );
						}
					}
					modelInstance.hide();
				});
				modelInstance.show();
			}
			this.select = function(id) {
				if( typeof id == 'undefined' )
				{
					throw 'ui_select_argument_id_missing';
				}
				var el =  document.getElementById(id);
				if (el) {
					if (el.select) {
						el.select();
					}
				}
			}
			// End Javascript
		return{type:0}
	};
	this.aoz.run(this,0,null);
};
