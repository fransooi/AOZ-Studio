/*@*****************************************************************************
*                                                                              *
*   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
*  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
*  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
*  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
*  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
*                                                                              *
* This file is part of AOZ Studio.                                             *
* Copyright (c) AOZ Studio. All rights reserved.                               *
*                                                                              *
* This source should not be distributed.                                       *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Transpiler
 *
 * List of messages US
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */

var messages = require( './messages' );

texts =
[
	"empty:													.",
	"title:													AOZ Transpiler Version %1<BR>(c) AOZ Studio 2019-2022<BR>https://aoz.studio<BR>-------------------------------------------------------------------------------",
	"developper_mode:										Developper mode: %1<BR>",
	"console:												%1",
	"creating_directory:									Creating directory: %1",
	"compiled_with:											Compiled with AOZ Transpiler Version %1 on the %2",
	"compilation_success:									All tasks successful, duration: %1 seconds.",
	"compilation_failed:									Task failed, no code generated...",
	"compiling:												Transpiling %1",
	"compiling_code:										Generating code...",
	"compiling_images:										Transpiling images...",
	"compiling_icons:										Transpiling icons...",
	"compiling_sounds:										Transpiling sounds...",
	"compiling_musics:										Transpiling musics...",
	"compiling_fonts:										Transpiling fonts...",
	"compiling_filesystem:									Transpiling filesystem...",
	"error:													error",
	"warning:												warning",
	"compilation_error:										Transpiler error",
	"compilation_warning:									transpiler warning",
	"compiling_extension:									Transpiling extension %1<BR>",
	"compiling_module:										Transpiling module %1<BR>",
	"compiling_all_modules:									Checking all modules...<BR>",
	"compiling_all_extensions:								Checking all extensions...<BR>",
	"skipping_extension:									Skipping extension %1<BR>",
	"skipping_module:										Skipping module %1<BR>",
	"removing_directory:									Removing directory: %1<BR>",
	"cleaning_directory:									Cleaning directory: %1<BR>",
	"skip_line:												<BR>",
	"filesaver_saving:										Saving: %1<BR>",
	"filesaver_copying:										Copying: %1<BR>",
	"filesaver_open:										Filesaver opening: %1<BR>",
	"filesaver_close:										Filesaver closing: %1<BR>",
	"fileloader_open:										Fileloader opening: %1<BR>",
	"fileloader_close:										Fileloader closing: %1<BR>",
	"converting_code:										Converting code...<BR>",
    "converting_banks:										Converting banks...<BR>",
    "creating_manifest:										Creating manifest...<BR>",
    "conversion_succesfull:									Conversion succesfull.<BR>",
	"converting:											Converting %1 to %2<BR>",
	"extracting_bank:										Extracting bank #%1, length: %2<BR>",
	"checking_server:										Checking presence of local web-server...<BR>",
	"starting_server:										Starting local web-server (leave the window open to test the application)<BR>",
	"copying_to_server:										Copying files to local web-server<BR>",
	"crash_error:											Crash during compilation: %1<BR>",
	"internal_error:										Internal error<BR>",
	"conversion_header:										//<BR>// %1 - Converted to AOZ on the %2,<BR>//<BR>",
	"saving_system_information:								Saving system information to: %1<BR>",
	"updating_system_information:							Updating system information...<BR>",
	"cannot_load_ini:										Incorrect installation of AOZ: cannot load 'aoz.ini' (path: %1)<BR>",
	"readable_error:										Error: %1 at line %2, column %3, in file %4<BR>",
	"readable_warning:										Warning: %1 at line %2, column %3, in file %4<BR>",
	"including_file:										Including: %1<BR>",
	"starting_autotranslate:								Starting auto-translate process to: %1<BR>",
	"autotranslate_complete:								Auto-translate completed! I can now speak your langage. :)<BR>",
	"translation_failed:									A problem occured during the translation.<BR>",
	"communication_failed:									Communication with translation services reported an error.<BR>",
	"copying_resources:										Copying resources...<BR>",
	"generating_index:										Generating index...<BR>",
	"generating_index:										Generating index...<BR>",
	"zero_pass:												Zero pass...<BR>",
	"first_pass:											First pass, %1 %2...<BR>",
	"second_pass:											Second pass, %1 %2...<BR>",
	"loading_file:											Loading file %1<BR>",
	"copying_file:											Copying file %1 to %2<BR>",
	"deleting_file:											Deleting file %1<BR>",
	"deleting_directory:									Deleting directory %1<BR>",
	"creating_directory:									Creating directory: %1<BR>",
	"getting_directory:										Getting directory %1<BR>",
	"copying_directory:										Copying directory %1 to %2<BR>",
	"saving_file:											Saving file %1<BR>",
	"loading_json:											Loading JSON file %1<BR>",
	"copying_unlock:										Copying and unlocking file %1<BR>",
	"manifest_loaded:										Manifest loaded %1<BR>",
	"warminit:												Transpiler initialization...<BR>",
	"warminit_ok:											Transpiler initialized...<BR>",
	"warminit_error:										Error during transpiler initialization...<BR>",
	"fileloader_new:										Fileloader reset...<BR>",
	"filesaver_new:											Filesaver reset...<BR>",
	"reloading_sources:										Reloading runtime code...<BR>",
	"map_not_found:											Map file not found (%1)<BR>",
	"la_procedure:											the procedure",
	"l_objet:												the object",
	"l_instruction:											the instruction",
	"la_fonction:											the function",
	"la_methode:											the method",
	"le_token:												the token"
];

compilerErrors =
[
	// Warnings
	'font_not_found:										Font not found: %1',
	'garbage_found_in_folder:								Unnecessary files found in folder: %1',
	'font_not_supported:									Font not supported: %1',
	'file_at_root_of_filesystem:							File found at root of the filesystem folder (%1)',
	'screen_not_multiple_of_font_size:						Default screen dimensions are not a multiple of window font sizes',
	'missing_folder:										Missing folder: %1',
	'missing_resources_folder:								Missing resources folder',
	'creating_directory:									Creating directory %1',
	'cannot_set_permissions:								Cannot set permissions (file: %1)',
	'illegal_bank_element_filename:							Illegal bank element filename (%1)',
	'file_to_include:										File to include: %1',
	'copying_file_to_filesystem:							Copying file %1 to filesystem',
	'duplicate_error_message:								Duplicate error message: %1',
	'out_of_unique_identifiers:								Out of unique identifiers, prefix: %1',
	'should_wait:											The application uses sounds, it should wait for user interaction',

	// Errors
	"illegal_tag_parameter:									Illegal tag parameter %1",
	"application_does_not_exist:							AOZ application does not exist: %1",
	"manifest_not_found:									Application manifest not found (%1)",
	"cannot_delete_file:									Cannot delete file: %1",
	"cannot_delete_directory:								Cannot delete directory: %1",
	"illegal_manifest:										Illegal manifest path: %1\n%2\n",
	"extension_manifest_not_found:							Extension manifest not found (%1)",
	"illegal_extension_manifest:							Illegal extension manifest: %1",
	"illegal_module_manifest:								Illegal module manifest",
	"module_manifest_not_found:								Module manifest not found (%1)",
	"bad_version_of_manifest:								Bad version of manifest (%1)",
	"cannot_load_runtime_index:								Cannot load runtime index",
	"cannot_write_file:										Cannot write file: %1",
	"cannot_copy_file:										Cannot copy file: %1",
	"cannot_copy_directory:									Cannot copy directory: %1",
	"cannot_load_file:										Cannot load file: '%1'",
	"cannot_save_file:										Cannot save file: '%1'",
	"include_before_everything:								Include should be located before any other instruction",
	"conversion_error:										Conversion failed.",
    "file_not_found:										File not found: %1",
    "directory_not_found:									Directory not found: %1",
	"command_not_supported:									Command not supported: %1",
	"invalid_argument:                                      Invalid argument: %1",
	"illegal_bank_element_filename:							Illegal bank element filename: %1",
	"crash_error:											Crash during compilation: %1",
	"compiler_stuck_in_loop:								Compiler stuck in loop",
	"conversion_error:										Conversion error in file %1",
	"unknown_bank_format:									Unknown bank format",
	"illegal_json_file:										Incorrect JSON format in file %1",
	"internal_error:										Internal error",
	"cannot_include_amos:									Cannot include AMOS applications in this version",
	"illegal_error_message:									Illegal error message: %1",
	"transpiler_manifest_not_found:							Transpiler manifest not found",
	"illegal_transpiler_manifest:							Illegal transpiler manifest",
	"bad_version_of_transpiler_manifest:					Bad version of the transpiler manifest",
	"font_already_added:									Font added twice: %1",
	"illegal_tag:											Illegal tag definition: %1",
	"local_tag_already_defined:								Local tag already defined: %1",
	"global_tag_already_defined:							Global tag already defined: %1",
	"objects_can_only_be_defined_in_main_application:		Objects can obly be defined in main application",
	"cannot_mix_new_and_old_syntax:							Cannot mix new and old syntax",
	"object_not_opened:										Opject not opened",
	"method_not_opened:										Method not opened",
	"method_already_opened:									Method already opened",
	"methods_can_only_be_located_in_objects:				Methods can only be located within objects",
	"indexes_must_be_defined:								Indexes must be defined",
	"file_is_not_an_aoz_application:						File is not an aoz application",
	"file_is_not_an_aoz_module:								File is not an aoz module",
	"file_is_not_an_aoz_extension:							File is not an aoz extension",
	"no_debugging_instruction:								Debugging instruction found at line %1",
	"to_be_implemented:										Command to be implemented",
	"path_is_not_directory:									Path must be a directory (%1)",
];

warnings =
[
	'variable_not_declared:									Variable "%P1" used without been declared',
	'instruction_not_implemented:							Instruction not implemented',
	'null_for_next_step:									Step parameter is equal to zero',
];
errors =
[
    "",																									// 0
    "return_without_gosub:                      Return without gosub",                                  // 1
    "pop_without_gosub:                         Pop without gosub",                                     // 2
    "error_not_resumed:                         Error not resumed",                                     // 3
    "cant_resume_to_a_label:                    Can't resume to a label",                               // 4
    "no_on_error_proc:                          No ON ERROR PROC before this instruction",              // 5
    "resume_label_not_defined:                  Resume label not defined",                              // 6
    "resume_without_error:                      Resume without error",                                  // 7
    "error_procedure_must_resume:               Error procedure must resume to end",                    // 8
    "program_interrupted:                       Program interrupted",                                   // 9
    "procedure_not_closed:						Procedure not closed",									// 10
    "out_of_variable_space:                     Out of variable space",                                 // 11
    "cannot_open_math_libraries:                Cannot open math libraries",                            // 12
    "out_of_stack_space:                        Out of stack space",                                    // 13
    "procedure_not_opened:						Procedure not opened",                                  // 14
    "user_function_not_defined:                 User function not defined",                             // 15
    "illegal_user_function_call:                Illegal user function call",                            // 16
    "illegal_direct_mode:                       Illegal direct mode",                                   // 17
    "procedure_not_found:						Procedure not found",									// 18
    "instruction_not_implemented:				Instruction not implemented",							// 19
    "division_by_zero:                          Division by zero",                                      // 20
    "string_too_long:                           String too long",                                       // 21
    "syntax_error:                              Syntax error",                                          // 22
	"illegal_function_call:						Illegal function call: %P1 %P2 %P3",						// 23
	"out_of_memory:								Out of memory",											// 24
	"address_error:								Address error",											// 25
	"string_not_closed:							String not closed",										// 26
	"non_dimensionned_array:					Non dimensionned array",								// 27
	"array_already_dimensionned:				Array already dimensionned",							// 28
	"overflow:									Overflow",												// 29
	"bad_iff_format:							Bad IFF format",										// 30
	"iff_compression_not_recognised:			IFF compression not recognised",						// 31
	"cant_fit_picture:							Can't fit picture in current screen",					// 32
	"out_of_data:								Out of data", 											// 33
	"type_mismatch:								Type mismatch: %1",										// 34
	"bank_already_reserved:						Bank already reserved",									// 35
	"bank_not_reserved:							Bank not reserved",										// 36
	"fonts_not_examined:						Fonts not examined",									// 37
	"menu_not_opened:							Menu not opened",										// 38
	"menu_item_not_defined:						Menu item not defined",									// 39
	"label_not_defined:							Label not defined",										// 40
	"not_data_after_this_label:					No data after this label",								// 41
	"procedure_already_defined:					Procedure already defined",								// 42
	"next_without_for:							Next without for",										// 43
	"font_not_available:						Font not available",									// 44
	"until_without_repeat:						Until without repeat",									// 45
	"block_not_defined:							Block no defined",										// 46
	"screen_not_opened:							Screen not opened",										// 47
	"illegal_screen_parameter:					Illegal screen parameter",								// 48
	"illegal_number_of_colours:					Illegal number of colours",								// 49
	"valid_screen_numbers:						Valid screen numbers range from 0 to 7",				// 50
	"too_many_colours_in_flash:					Too many colours in flash",								// 51
	"flash_declaration_error:					Flash declaration error",								// 52
	"shift_declaration_error:					Shift declaration error",								// 53
	"text_window_not_opened:					Text window not opened",								// 54
	"text_window_already_opened:				Text window already opened",							// 55
	"text_window_too_small:						Text window too small",									// 56
	"text_window_too_large:						Text window too large",									// 57
	"wend_without_while:						Wend without while",									// 58
	"bordered_text_windows_not_on_edge:			Bordered text windows not on edge of screen",			// 59
	"illegal_text_window_parameter:				Illegal text window parameter: %1",						// 60
	"loop_without_do:							Loop without do",										// 61
	"text_window_0_cant_be_closed:				Text window 0 can't be closed",							// 62
	"this_windows_has_no_border:				This window has not border",							// 63
	"no_loop_to_exit_from:						No loop to exit from",									// 64
	"block_not_found:							Block not found",										// 65
	"illegal_block_parameters:					Illegal block parameters",								// 66
	"screens_cant_be_animated:					Screens can't be animated",								// 67
	"bob_not_defined:							Bob not defined",										// 68
	"screen_already_in_double_buffering:		Screen already in double buffering",					// 69
	"cant_set_dual_playfield:					Can't set dual playfield",								// 70
	"screen_not_in_dual_playfield:				Screen not in dual playfield mode", 					// 71
	"scrolling_not_defined:						Scrolling not defined",									// 72
	"no_zones_defined:							No zones defined",										// 73
	"icon_not_defined:							Icon not defined",										// 74
	"rainbow_not_defined:						Rainbow not defined",									// 75
	"copper_not_disabled:						Copper not disabled",									// 76
	"copper_list_too_long:						Copper list too long",									// 77
	"illegal_copper_parameter:					Illegal copper parameter",								// 78
	"file_already_exists:						File already exists",									// 79
	"directory_not_found:						Directory not found",									// 80
	"file_not_found:							File not found",										// 81
	"illegal_filename:							Illegal filename",										// 82
	"disc_is_not_validated:						Disc is not validated",									// 83
	"disc_is_write_protected:					Disc is write protected",								// 84
	"directory_not_empty:						Directory not empty",									// 85
	"device_not_available:						Device not available",									// 86
	"for_without_next:							For without next",										// 87
	"disc_full:									Disc full",												// 88
	"file_is_write_protected_against_deletion:	File is write protected against deletion",				// 89
	"file_is_write_protected:					File is write protected",								// 90
	"file_is_protected_against_reading:			File is protected against reading",						// 91
	"not_an_amigados_disc:						Not an AmogaDOS disc",									// 92
	"no_disc_in_drive:							No disc in drive",										// 93
	"io_error:									I/O error",												// 94
	"file_format_not_recognised:				File format not recognised",							// 95
	"file_already_opened:						File already opened",									// 96
	"file_not_opened:							File not opened",										// 97
	"file_type_mismatch:						File type mismatch",									// 98
	"input_too_long:							Input too long",										// 99
	"end_of_file:								End of file",											// 100
	"disc_error:								Disc error",											// 101
	"instruction_not_allowed_there:				Instruction not allowed there",							// 102
	"illegal_number_of_dimensions:				Illegal number of dimensions",							// 103
	"array_not_dimensionned:					Array not dimensionned",								// 104
	"sprite_error:								Sprite error",											// 105
    "function_not_implemented:					Function not implemented",								// 106
	"syntax_error_in_animation_string:			Syntax error in animation string",						// 107
	"next_without_for_in_animation_string:		Next without for in animation string",					// 108
	"label_not_defined_in_animation_string:		Label not defined in animation string",					// 109
	"jump_to_within_autotest:					Jump to/within autotest in animation string",			// 110
	"autotest_already_opened:					Autotest already opened",								// 111
	"instruction_only_valid_in_autotest:		Instruction only valid in autotest",					// 112
	"animation_string_too_long:					Animation string too long",								// 113
	"label_already_defined_in_animation_string:	Label already defined in animation string",				// 114
	"illegal_instruction_during_autotest:		Illegal instruction during autotest",					// 115
	"amal_bank_not_reserved:					AMAL bank not reserved",								// 116
	"internal_error:							Internal error",										// 117
	"unknown_error:								Unknown error",											// 118
	"cannot_load_file:							Cannot load file: '%1'",								// 119
	"interface_error_bad_syntax:				Interface error: bad syntax",							// 120
	"interface_error_out_of_memory:				Interface error: out of memory",						// 121
	"interface_error_label_defined_twice:		Interface error: label defined twice",					// 122
	"interface_error_label_not_defined:			Interface error: label not defined",					// 123
	"interface_error_channel_already_defined:	Interface error: channel already defined",				// 124
	"interface_error_channel_not_defined:		Interface error: channel not defined",					// 125
	"interface_error_screen_modified:			Interface error: screen modified",						// 126
	"interface_error_variable_not_defined:		Interface error: variable not defined",					// 127
	"interface_error_illegal_function_call:		Interface error: illegal function call",				// 128
	"interface_error_type_mismatch:				Interface error: type mismatch",						// 129
	"interface_error_buffer_too_small:			Interface error: buffer too small",						// 130
	"interface_error_illegal_n_parameters:		Interface error: illegal number of parameters",			// 131
	"if_without_endif:							If without endif",										// 132
	"not_enough_loops_to_exit:					Not enough loops to exit",								// 133
	"no_loop_to_exit:							No loop to exit",										// 134
	"please_redo_from_start:					Please redo from start ",								// 135
	"instruction_not_opened:					Instruction not opened",								// 136
	"instruction_already_opened:				Instruction already opened",							// 137
	"function_not_opened:						Function not opened",									// 138
	"function already opened:					Function already opened",								// 139
	"device_already_opened:						Device already opened",									// 140
	"device_not_opened:							Device not opened",										// 141
	"device_cannot_be_opened:					Device cannot be opened",								// 142
	"command_not_supported_by_device:			Command not supported by device",						// 143
	"device_error:								Device errror",											// 144
	"serial_device_already_in_use:				Serial device already in use",							// 145
	"repeat_without_until,						Repeat without until",									// 146
	"invalid_baud_rate:							Invalid baud rate",										// 147
	"out_of_memory_serial_device:				Out of memory (serial device)",							// 148
	"bad_parameter:								Bad parameter",											// 149
	"hardware_data_overrun:						hardware data overrrun",								// 150
	"do_without_loop							Do without loop",										// 151
	"while_without_wend							While without wend",									// 152
	"cannot_read_directory:						Cannot read directory: ",								// 153
	"directory_of:								Directory of %X",										// 154
	"timeout_error:								Timeout error",											// 155
	"buffer_overflow:							Buffer overflow",										// 156
	"no_data_set_ready:							No data set ready",										// 157
	"do_without_loop:							Do without loop",										// 158
	"break_detected:							Break detected",										// 159
	"selected_unit_already_in_use:				Selected unit already in use",							// 160
	"user_canceled_request:						User canceled request",									// 161
	"printer_cannot_output_graphics:			Printer cannot output graphics",						// 162
	"while_without_wend:						While without wend",									// 163
	"illegal_print_dimensions:					Illegal print dimensions",								// 164
	"corrupted_file:							Corrupted file",										// 165
	"out_of_memory_printer_device:				Out of memory (printer device)",						// 166
	"out_of_internal_memory_printer_device:		Out of internal memory (printer device)",				// 167
	"library_already_opened:					Library already opened",								// 168
	"library_not_opened:						Library not opened",									// 169
	"cannot_open_library:						Cannot open library",									// 170
	"parallel_device_already_opened:			Parallel device already opened",						// 171
	"out_of_memory_parallel_device:				Out of memory (parallel device)",						// 172
	"invalid_parallel_parameter:				Invalid parallel parameter",							// 173
	"parallel_line_error:						Parallel line error",									// 174
	"drive_not_found:							Drive not found",										// 175
	"parallel_port_reset:						Parallel port reset",									// 176
	"parallel_initialisation_error:				Parallel initialisation error",							// 177
	"wave_not_defined:							Wave not defined",										// 178
	"sample_not_defined:						Sample not defined",									// 179
	"sample_bank_not_found:						Sample bank not found",									// 180
	"256_characters_for_a_wave:					256 characters for a wave",								// 181
	"wave_0_and_1_are_reserved:					Wave 0 and 1 are reserved",								// 182
	"music_bank_not_found:						Music bank not found",									// 183
	"music_not_defined:							Music not defined",										// 184
	"cant_open_narrator:						Can't open narrator",									// 185
	"not_a_tracker_module:						Not a tracker module",									// 186
	"cannot_load_med_library:					Cannot load med.library",								// 187
	"cannot_start_med_library:					Cannot start med.library",								// 188
	"not_a_med_module:							Not a med module",										// 189
	"at_line:									at line: ",												// 190
	"at_column:									column: ",												// 191
	"image_not_defined:							Image not defined (%1)",								// 192
	"arexx_port_already_opened:					Arexx port already opened",								// 193
	"arexx_library_not_found:					Arexx library not found",								// 194
	"cannot_open_arexx_port:					Cannot open Arexx port",								// 195
	"Arexx_port_not_opened:						Arexx port not opened",									// 196
	"no_arexx_message_waiting:					No Arexx message waiting",								// 197
	"arexx_message_not_answered_to:				Arexx message not answered to",							// 198
	"arexx_device_not_interactive:				Arexx device not interactive",							// 199
	"local_storage_not_available:				Local storage not available",							// 200
	"sprite_not_defined:						Sprite not defined",									// 201
	"fps_indicator:								%1 FPS",												// 202
	"every_too_long:							Every routine too long",								// 203
	"every_not_defined:							Every not defined",										// 204
	"every_already_defined:						Every already defined",									// 205
	"channel_not_opened:					 	Animation channel not opened: %1",						// 203
	"global_variable_not_defined:				Global array not defined",								// 204
	"function_not_available_in_true_color_mode: Function not available in non-paletted graphical mode",	// 205
	"context_not_defined:						Property context not defined",							// 206
	"property_not_defined:						Property not defined",									// 207
	"name_already_used:							Name already used",										// 208
	"instruction_not_closed:					Instruction not closed",								// 209
	"function_not_closed:						Function not closed",									// 210
	"procedure_not_closed:						Procedure not closed",									// 211
	"non_contiguous_instructions:				Non contiguous instruction definition",					// 212
	"non_contiguous_functions:					Non contiguous function definition",					// 213
	"javascript_section_not_closed:				Javascript section not closed",							// 214
	"compiler_stuck_in_loop:					Compiler stuck in loop",								// 215
	"tag_parameter_not_defined:					Tag parameter is not defined",							// 216
	"tag_parameter_must_be_constant:			Tag parameter must be a constant",						// 217
	"bank_type_mismatch:						Bank type mismatch",									// 218
	"bank_other_datatypes:						Bank number reserved for an other datatypes",			// 220
	"loop_will_hang:							The loop will hang",									// 221
	"reverse_for_loop_positive:					Reverse for loop has positive step",					// 222
	"forward_for_loop_negative:					Forward for loop has negative step",					// 223
	"in_amal_string:							in amal string at position %1",							// 224
	"amal_error:								Error in AMAL string",									// 225
	"in_source:									in file ",												// 226
	"channel_type_not_found:				 	Animation channel type not found: %1",					// 227
	"platform_not_implemented:				 	Platform not implemented: %1",							// 228
	"parameter_not_found:						Parameter not found: %1",								// 229
	"cannot_wait_in_event_procedures:			Waiting instructions are not allowed in event procedures",		// 230
	"method_not_found:							Method not found",										// 231
	"procedure_not_found:						Procedure not found",									// 232
	"object_or_property_not_found:				Object or property not found",							// 233
	"tag_not_defined:							Tag not defined",										// 234
	"endwith_without_with:						End Width without With",								// 235
	"with_without_endwith:  					With without End With", 								// 236
	"image_format_not_supported:				Image format not supported",							// 237
	"filesystem_not_supported:					File system not available",								// 238
	"color_not_found:							Color not found",										// 239
	"please_enter_text:							Please enter response...",								// 240
	"name_conflict_between_variable_and_procedure: Conflict between variable and procedure name %1",	// 241	
	"transpilation_cancelled:					Transpilation cancelled.",								// 242
	"array_index_out_of_bounds:					Array index number %1 (value: %2) out of bounds (maximum:%3)",	// 243
	"label_already_defined:						The label %1 is already defined.",						// 244	
	"cannot_load_font:							Cannot load font %1.",									// 245
	"shared_error:								Shared cannot be used in main code.",					// 246
	"filter_not_defined:						Filter %1 does not exist.",								// 247
	"variable_name_conflict:					Variable name conflicts with %1 named %2",				// 248
	"object_name_conflict:						Name conflicts with %1 named %2",						// 249
	"bank_element_not_defined:					Object not found (%1)",									// 250
	"filesystem_initializing:					Filesystem under initialization",						// 251
	"object_variable_not_defined:				Object variable must be initialised (%1)",				// 252
	"application_complete:						Application complete.",									// 253
];

messages.addLanguage( 'en', texts, errors, warnings, compilerErrors, compilerErrors );
