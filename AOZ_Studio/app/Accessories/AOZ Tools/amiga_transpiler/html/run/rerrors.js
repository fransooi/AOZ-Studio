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
* Licensed under the GNU General Public License v3.0.                          *
* More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
* And in the file AOZ_StudioCodeLicense.pdf.                                   *
*                                                                              *
*****************************************************************************@*/
/** @file
 *
 * AOZ Runtime
 *
 * Error messages
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 25/01/2018
 */

function Errors( aoz )
{
	this.aoz = aoz;
	this.language = 'en';	//this.aoz.utilities.getBrowserLanguage();

	// List of errors
	this.errors=
	{
		en:
		[
			"",
			"return_without_gosub:Return without gosub",
			"pop_without_gosub:Pop without gosub",
			"error_not_resumed:Error not resumed",
			"cant_resume_to_a_label:Can't resume to a label",
			"no_on_error_proc:No ON ERROR PROC before this instruction",
			"resume_label_not_defined:Resume label not defined",
			"resume_without_error:Resume without error",
			"error_procedure_must_resume:Error procedure must resume to end",
			"program_interrupted:Program interrupted",
			"procedure_not_closed:Procedure not closed",
			"out_of_variable_space:Out of variable space",
			"cannot_open_math_libraries:Cannot open math libraries",
			"out_of_stack_space:Out of stack space",
			"procedure_not_opened:Procedure not opened",
			"user_function_not_defined:User function not defined",
			"illegal_user_function_call:Illegal user function call",
			"illegal_direct_mode:Illegal direct mode",
			"procedure_not_found:Procedure not found",
			"instruction_not_implemented:Instruction not implemented",
			"division_by_zero:Division by zero",
			"string_too_long:String too long",
			"syntax_error:Syntax error",
			"illegal_function_call:Illegal function call: %P1 %P2 %P3",
			"out_of_memory:Out of memory",
			"address_error:Address error",
			"string_not_closed:String not closed",
			"non_dimensionned_array:Non dimensionned array",
			"array_already_dimensionned:Array already dimensionned",
			"overflow:Overflow",
			"bad_iff_format:Bad IFF format",
			"iff_compression_not_recognised:IFF compression not recognised",
			"cant_fit_picture:Can't fit picture in current screen",
			"out_of_data:Out of data",
			"type_mismatch:Type mismatch: %1",
			"bank_already_reserved:Bank already reserved",
			"bank_not_reserved:Bank not reserved",
			"fonts_not_examined:Fonts not examined",
			"menu_not_opened:Menu not opened",
			"menu_item_not_defined:Menu item not defined",
			"label_not_defined:Label not defined",
			"not_data_after_this_label:No data after this label",
			"procedure_already_defined:Procedure already defined",
			"next_without_for:Next without for",
			"font_not_available:Font not available",
			"until_without_repeat:Until without repeat",
			"block_not_defined:Block no defined",
			"screen_not_opened:Screen not opened",
			"illegal_screen_parameter:Illegal screen parameter",
			"illegal_number_of_colours:Illegal number of colours",
			"valid_screen_numbers:Valid screen numbers range from 0 to 7",
			"too_many_colours_in_flash:Too many colours in flash",
			"flash_declaration_error:Flash declaration error",
			"shift_declaration_error:Shift declaration error",
			"text_window_not_opened:Text window not opened",
			"text_window_already_opened:Text window already opened",
			"text_window_too_small:Text window too small",
			"text_window_too_large:Text window too large",
			"wend_without_while:Wend without while",
			"bordered_text_windows_not_on_edge:Bordered text windows not on edge of screen",
			"illegal_text_window_parameter:Illegal text window parameter: %1",
			"loop_without_do:Loop without do",
			"text_window_0_cant_be_closed:Text window 0 can't be closed",
			"this_windows_has_no_border:This window has not border",
			"no_loop_to_exit_from:No loop to exit from",
			"block_not_found:Block not found",
			"illegal_block_parameters:Illegal block parameters",
			"screens_cant_be_animated:Screens can't be animated",
			"bob_not_defined:Bob not defined",
			"screen_already_in_double_buffering:Screen already in double buffering",
			"cant_set_dual_playfield:Can't set dual playfield",
			"screen_not_in_dual_playfield:Screen not in dual playfield mode",
			"scrolling_not_defined:Scrolling not defined",
			"no_zones_defined:No zones defined",
			"icon_not_defined:Icon not defined",
			"rainbow_not_defined:Rainbow not defined",
			"copper_not_disabled:Copper not disabled",
			"copper_list_too_long:Copper list too long",
			"illegal_copper_parameter:Illegal copper parameter",
			"file_already_exists:File already exists",
			"directory_not_found:Directory not found",
			"file_not_found:File not found",
			"illegal_filename:Illegal filename",
			"disc_is_not_validated:Disc is not validated",
			"disc_is_write_protected:Disc is write protected",
			"directory_not_empty:Directory not empty",
			"device_not_available:Device not available",
			"for_without_next:For without next",
			"disc_full:Disc full",
			"file_is_write_protected_against_deletion:File is write protected against deletion",
			"file_is_write_protected:File is write protected",
			"file_is_protected_against_reading:File is protected against reading",
			"not_an_amigados_disc:Not an AmogaDOS disc",
			"no_disc_in_drive:No disc in drive",
			"io_error:I/O error",
			"file_format_not_recognised:File format not recognised",
			"file_already_opened:File already opened",
			"file_not_opened:File not opened",
			"file_type_mismatch:File type mismatch",
			"input_too_long:Input too long",
			"end_of_file:End of file",
			"disc_error:Disc error",
			"instruction_not_allowed_there:Instruction not allowed there",
			"illegal_number_of_dimensions:Illegal number of dimensions",
			"array_not_dimensionned:Array not dimensionned",
			"sprite_error:Sprite error",
			"function_not_implemented:Function not implemented",
			"syntax_error_in_animation_string:Syntax error in animation string",
			"next_without_for_in_animation_string:Next without for in animation string",
			"label_not_defined_in_animation_string:Label not defined in animation string",
			"jump_to_within_autotest:Jump to/within autotest in animation string",
			"autotest_already_opened:Autotest already opened",
			"instruction_only_valid_in_autotest:Instruction only valid in autotest",
			"animation_string_too_long:Animation string too long",
			"label_already_defined_in_animation_string:Label already defined in animation string",
			"illegal_instruction_during_autotest:Illegal instruction during autotest",
			"amal_bank_not_reserved:AMAL bank not reserved",
			"internal_error:Internal error",
			"unknown_error:Unknown error",
			"cannot_load_file:Cannot load file: '%1'",
			"interface_error_bad_syntax:Interface error: bad syntax",
			"interface_error_out_of_memory:Interface error: out of memory",
			"interface_error_label_defined_twice:Interface error: label defined twice",
			"interface_error_label_not_defined:Interface error: label not defined",
			"interface_error_channel_already_defined:Interface error: channel already defined",
			"interface_error_channel_not_defined:Interface error: channel not defined",
			"interface_error_screen_modified:Interface error: screen modified",
			"interface_error_variable_not_defined:Interface error: variable not defined",
			"interface_error_illegal_function_call:Interface error: illegal function call",
			"interface_error_type_mismatch:Interface error: type mismatch",
			"interface_error_buffer_too_small:Interface error: buffer too small",
			"interface_error_illegal_n_parameters:Interface error: illegal number of parameters",
			"if_without_endif:If without endif",
			"not_enough_loops_to_exit:Not enough loops to exit",
			"no_loop_to_exit:No loop to exit",
			"please_redo_from_start:Please redo from start ",
			"instruction_not_opened:Instruction not opened",
			"instruction_already_opened:Instruction already opened",
			"function_not_opened:Function not opened",
			"function already opened:Function already opened",
			"device_already_opened:Device already opened",
			"device_not_opened:Device not opened",
			"device_cannot_be_opened:Device cannot be opened",
			"command_not_supported_by_device:Command not supported by device",
			"device_error:Device errror",
			"serial_device_already_in_use:Serial device already in use",
			"",
			"invalid_baud_rate:Invalid baud rate",
			"out_of_memory_serial_device:Out of memory (serial device)",
			"bad_parameter:Bad parameter",
			"hardware_data_overrun:hardware data overrrun",
			"",
			"",
			"cannot_read_directory:Cannot read directory: ",
			"directory_of:Directory of %X",
			"timeout_error:Timeout error",
			"buffer_overflow:Buffer overflow",
			"no_data_set_ready:No data set ready",
			"do_without_loop:Do without loop",
			"break_detected:Break detected",
			"selected_unit_already_in_use:Selected unit already in use",
			"user_canceled_request:User canceled request",
			"printer_cannot_output_graphics:Printer cannot output graphics",
			"while_without_wend:While without wend",
			"illegal_print_dimensions:Illegal print dimensions",
			"corrupted_file:Corrupted file",
			"out_of_memory_printer_device:Out of memory (printer device)",
			"out_of_internal_memory_printer_device:Out of internal memory (printer device)",
			"library_already_opened:Library already opened",
			"library_not_opened:Library not opened",
			"cannot_open_library:Cannot open library",
			"parallel_device_already_opened:Parallel device already opened",
			"out_of_memory_parallel_device:Out of memory (parallel device)",
			"invalid_parallel_parameter:Invalid parallel parameter",
			"parallel_line_error:Parallel line error",
			"drive_not_found:Drive not found",
			"parallel_port_reset:Parallel port reset",
			"parallel_initialisation_error:Parallel initialisation error",
			"wave_not_defined:Wave not defined",
			"sample_not_defined:Sample not defined",
			"sample_bank_not_found:Sample bank not found",
			"256_characters_for_a_wave:256 characters for a wave",
			"wave_0_and_1_are_reserved:Wave 0 and 1 are reserved",
			"music_bank_not_found:Music bank not found",
			"music_not_defined:Music not defined",
			"cant_open_narrator:Can't open narrator",
			"not_a_tracker_module:Not a tracker module",
			"cannot_load_med_library:Cannot load med.library",
			"cannot_start_med_library:Cannot start med.library",
			"not_a_med_module:Not a med module",
			"at_line:at line: ",
			"at_column:column: ",
			"image_not_defined:Image not defined (%1)",
			"arexx_port_already_opened:Arexx port already opened",
			"arexx_library_not_found:Arexx library not found",
			"cannot_open_arexx_port:Cannot open Arexx port",
			"Arexx_port_not_opened:Arexx port not opened",
			"no_arexx_message_waiting:No Arexx message waiting",
			"arexx_message_not_answered_to:Arexx message not answered to",
			"arexx_device_not_interactive:Arexx device not interactive",
			"local_storage_not_available:Local storage not available",
			"sprite_not_defined:Sprite not defined",
			"fps_indicator:%1 FPS",
			"every_too_long:Every routine too long",
			"every_not_defined:Every not defined",
			"every_already_defined:Every already defined",
			"channel_not_opened:Animation channel not opened: %1",
			"global_variable_not_defined:Global array not defined",
			"function_not_available_in_true_color_mode:Function not available in non-paletted graphical mode",
			"context_not_defined:Property context not defined",
			"property_not_defined:Property not defined",
			"name_already_used:Name already used",
			"instruction_not_closed:Instruction not closed",
			"function_not_closed:Function not closed",
			"procedure_not_closed:Procedure not closed",
			"non_contiguous_instructions:Non contiguous instruction definition",
			"non_contiguous_functions:Non contiguous function definition",
			"javascript_section_not_closed:Javascript section not closed",
			"compiler_stuck_in_loop:Compiler stuck in loop",
			"tag_parameter_not_defined:Tag parameter is not defined",
			"tag_parameter_must_be_constant:Tag parameter must be a constant",
			"bank_type_mismatch:Bank type mismatch",
			"bank_other_datatypes:Bank number reserved for an other datatypes",
			"loop_will_hang:The loop will hang",
			"reverse_for_loop_positive:Reverse for loop has positive step",
			"forward_for_loop_negative:Forward for loop has negative step",
			"in_amal_string:in amal string at position %1",
			"amal_error:Error in AMAL string",
			"in_source:in file ",
			"channel_type_not_found:Animation channel type not found: %1",
			"platform_not_implemented:Platform not implemented: %1",
			"parameter_not_found:Parameter not found: %1",
			"cannot_wait_in_event_procedures:Waiting instructions are not allowed in event procedures",
			"method_not_found:Method not found",
			"procedure_not_found:Procedure not found",
			"object_or_property_not_found:Object or property not found",
			"tag_not_defined:Tag not defined",
			"endwith_without_with:End Width without With",
			"with_without_endwith:With without End With",
			"image_format_not_supported:Image format not supported",
			"filesystem_not_supported:File system not available",
			"color_not_found:Color not found",
			"please_enter_text:Please enter response...",
			"name_conflict_between_variable_and_procedure:Conflict between variable and procedure name %1",
			"transpilation_cancelled:Transpilation cancelled.",
			"array_index_out_of_bounds:Array index number %1 (value: %2) out of bounds (maximum:%3)",
			"label_already_defined:The label %1 is already defined.",
			"cannot_load_font:Cannot load font %1.",
			"shared_error:Shared cannot be used in main code.",
			"filter_not_defined:Filter %1 does not exist.",
			"variable_name_conflict:Variable name conflicts with %1 named %2",
			"object_name_conflict:Name conflicts with %1 named %2",
			"bank_element_not_defined:Object not found (%1)",
			"filesystem_initializing:Filesystem under initialization"
		],
		fr:
		[
			"",
			"return_without_gosub:Return sans gosub",
			"pop_without_gosub:Pop sans gosub",
			"error_not_resumed:Erreur sans Resume",
			"cant_resume_to_a_label:Impossible faire un Resume vers une étiquette",
			"no_on_error_proc:Pas de 'ON ERROR PROC' avant cette instruction",
			"resume_label_not_defined:Étiquette de Resume non définie",
			"resume_without_error:Resume sans erreur",
			"error_procedure_must_resume:La procédure d'erreur doit utiliser Resume avant de se terminer",
			"program_interrupted:Programme interrompu",
			"procedure_not_closed:Procédure non clôturée",
			"out_of_variable_space:Plus de mémoire pour les variables",
			"cannot_open_math_libraries:Impossible d'ouvrir les bibliothèques mathématiques",
			"out_of_stack_space:Hors de l'espace de pile",
			"procedure_not_opened:Procédure non ouverte",
			"user_function_not_defined:Fonction utilisateur non définie",
			"illegal_user_function_call:Appel de fonction utilisateur invalide",
			"illegal_direct_mode:Mode direct invalide",
			"procedure_not_found:Procédure non trouvée",
			"instruction_not_implemented:Instruction non implémentée",
			"division_by_zero:Division par zéro",
			"string_too_long:Chaîne trop longue",
			"syntax_error:Erreur de syntaxe",
			"illegal_function_call:Appel de fonction invalide %1 %2 %3",
			"out_of_memory:Mémoire insuffisante",
			"address_error:Erreur d'adresse",
			"string_not_closed:Chaîne non clôturée",
			"non_dimensionned_array:Tableau non dimensionné",
			"array_already_dimensionned:Tableau déjà dimensionné",
			"overflow:Débordement",
			"bad_iff_format:Mauvais format IFF",
			"iff_compression_not_recognised:Compression IFF non reconnue",
			"cant_fit_picture:Impossible d'adapter l'image à l'écran actuel",
			"out_of_data:Plus de données",
			"type_mismatch:Incompatibilité de type: %1",
			"bank_already_reserved:Banque déjà réservée",
			"bank_not_reserved:Banque non réservée",
			"fonts_not_examined:Polices non examinées",
			"menu_not_opened:Menu non ouvert",
			"menu_item_not_defined:Élément de menu non défini",
			"label_not_defined:Etiquette non définie",
			"not_data_after_this_label:Aucune donnée après cette étiquette",
			"procedure_already_defined:Procédure déjà définie",
			"next_without_for:Instruction Next sans For",
			"font_not_available:Police non disponible",
			"until_without_repeat:Instruction Until sans Repeat",
			"block_not_defined:Bloc non défini",
			"screen_not_opened:Écran non ouvert",
			"illegal_screen_parameter:Paramètre d'écran invalide",
			"illegal_number_of_colours:Nombre de couleurs invalide",
			"valid_screen_numbers:Les numéros d'écran valides vont de 0 à 7",
			"too_many_colours_in_flash:Trop de couleurspour flash",
			"flash_declaration_error:Erreur de déclaration Flash",
			"shift_declaration_error:Erreur de déclaration dans Shift",
			"text_window_not_opened:Fenêtre de texte non ouverte",
			"text_window_already_opened:Fenêtre de texte déjà ouverte",
			"text_window_too_small:Fenêtre de texte trop petite",
			"text_window_too_large:Fenêtre de texte trop grande",
			"wend_without_while:Passez du temps",
			"bordered_text_windows_not_on_edge:Fenêtres de texte avec bordure pas sur le bord de l'écran",
			"illegal_text_window_parameter:Paramètre de fenêtre de texte non conforme: %1",
			"loop_without_do:Instruction Loop sans Do",
			"text_window_0_cant_be_closed:La fenêtre de texte 0 ne peut pas être fermée",
			"this_windows_has_no_border:Cette fenêtre n'a pas de bordure",
			"no_loop_to_exit_from:Pas de boucle  à quitter",
			"block_not_found:Bloc introuvable",
			"illegal_block_parameters:Paramètres de bloc illégaux",
			"screens_cant_be_animated:Les écrans ne peuvent pas être animés",
			"bob_not_defined:Bob non défini",
			"screen_already_in_double_buffering:Écran déjà en double buffer",
			"cant_set_dual_playfield:Impossible de définir le dual playfield",
			"screen_not_in_dual_playfield:Écran non en mode dual playfield",
			"scrolling_not_defined:Scrolling non défini",
			"no_zones_defined:Aucune zone définie",
			"icon_not_defined:Icône non définie",
			"rainbow_not_defined:Rainbow non défini",
			"copper_not_disabled:Copper non désactivé",
			"copper_list_too_long:Copper_list non définie",
			"illegal_copper_parameter:Paramètre de Copper invalide",
			"file_already_exists:Le fichier existe déjà",
			"directory_not_found:Répertoire introuvable",
			"file_not_found:Fichier non trouvé",
			"illegal_filename:Nom de fichier invalide",
			"disc_is_not_validated:Le disque n'est pas validé",
			"disc_is_write_protected:Le disque est protégé en écriture",
			"directory_not_empty:Répertoire non vide",
			"device_not_available:Périphérique non disponible",
			"for_without_next:Instruction For Sans Next",
			"disc_full:Disque plein",
			"file_is_write_protected_against_deletion:Le fichier est protégé contre la suppression",
			"file_is_write_protected:Le fichier est protégé en écriture",
			"file_is_protected_against_reading:Le fichier est protégé contre la lecture",
			"not_an_amigados_disc:Pas un disque AmigaDOS",
			"no_disc_in_drive:Pas de disque dans le lecteur",
			"io_error:Erreur d'E/S",
			"file_format_not_recognised:Format de fichier non reconnu",
			"file_already_opened:Fichier déjà ouvert",
			"file_not_opened:Fichier non ouvert",
			"file_type_mismatch:Incohérence dans le type de fichier",
			"input_too_long:Entrée utilisateur trop longue",
			"end_of_file:Fin de fichier",
			"disc_error:Erreur de disque",
			"instruction_not_allowed_there:Instruction non autorisée ici",
			"illegal_number_of_dimensions:Nombre de dimensions invalide",
			"array_not_dimensionned:Tableau non dimensionné",
			"sprite_error:Erreur de sprite",
			"function_not_implemented:Fonction non implémentée",
			"syntax_error_in_animation_string:Erreur de syntaxe dans la chaîne d'animation",
			"next_without_for_in_animation_string:Next sans For dans la chaîne d'animation",
			"label_not_defined_in_animation_string:Label non défini dans la chaîne d'animation",
			"jump_to_within_autotest:Saut à/dans l'autotest dans la chaîne d'animation",
			"autotest_already_opened:Autotest déjà ouvert",
			"instruction_only_valid_in_autotest:Instruction valable uniquement en autotest",
			"animation_string_too_long:Chaîne texte d'animation trop longue",
			"label_already_defined_in_animation_string:Libellé déjà défini dans la chaîne d'animation",
			"illegal_instruction_during_autotest:Instruction invalide pendant l'autotest",
			"amal_bank_not_reserved:Banque AMAL non réservée",
			"internal_error:Erreur interne",
			"unknown_error:Erreur inconnue",
			"cannot_load_file:Impossible de charger le fichier: '%1'",
			"interface_error_bad_syntax:Erreur d'interface: mauvaise syntaxe",
			"interface_error_out_of_memory:Erreur d'interface: mémoire insuffisante",
			"interface_error_label_defined_twice:Erreur d'interface: étiquette définie deux fois",
			"interface_error_label_not_defined:Erreur d'interface: étiquette non définie",
			"interface_error_channel_already_defined:Erreur d'interface: canal déjà défini",
			"interface_error_channel_not_defined:Erreur d'interface: canal non défini",
			"interface_error_screen_modified:Erreur d'interface: écran modifié",
			"interface_error_variable_not_defined:Erreur d'interface: variable non définie",
			"interface_error_illegal_function_call:Erreur d'interface: appel de fonction invalide",
			"interface_error_type_mismatch:Erreur d'interface: incompatibilité de type",
			"interface_error_buffer_too_small:Erreur d'interface: tampon trop petit",
			"interface_error_illegal_n_parameters:Erreur d'interface: nombre de paramètres invalide",
			"if_without_endif:Instruction Si sans Endif",
			"not_enough_loops_to_exit:Pas assez de boucles Loop pour sortir",
			"no_loop_to_exit:Pas de boucle Loop pour sortir",
			"please_redo_from_start:Veuillez recommencer depuis le début",
			"instruction_not_opened:Instruction non ouverte",
			"instruction_already_opened:Instruction déjà ouverte",
			"function_not_opened:Fonction non ouverte",
			"function already opened:Fonction déjà ouverte",
			"device_already_opened:Périphérique déjà ouvert",
			"device_not_opened:Périphérique non ouvert",
			"device_cannot_be_opened:Impossible d'ouvrir le Périphérique",
			"command_not_supported_by_device:Commande non prise en charge par le Périphérique",
			"device_error:Erreur de périphérique",
			"serial_device_already_in_use:Périphérique série déjà utilisé",
			"repeat_without_until:Instruction Repeat sans Until",
			"invalid_baud_rate:Débit en bauds non valide",
			"out_of_memory_serial_device:Mémoire insuffisante (Périphérique série)",
			"bad_parameter:Mauvais paramètre",
			"hardware_data_overrun:Dépassement des données matérielles",
			"do_without_loop:Instruction Do sans Loop",
			"while_without_wend:Instruction While sans Wend",
			"cannot_read_directory:Impossible de lire le répertoire:",
			"directory_of:Répertoire de %X",
			"timeout_error:Erreur de temporisation",
			"buffer_overflow:Débordement de tampon (buffer_overflow)",
			"no_data_set_ready:Aucun ensemble de données (data_set) prêt",
			"do_without_loop:Instruction Do sans Loop",
			"break_detected:Break détecté",
			"selected_unit_already_in_use:Unité sélectionnée déjà utilisée",
			"user_canceled_request:L'utilisateur a annulé la demande",
			"printer_cannot_output_graphics:Le périphérique d'impression ne peut pas produire de graphiques",
			"while_without_wend:Instruction While sans Wend",
			"illegal_print_dimensions:Dimensions d'impression invalides",
			"corrupted_file:Fichier corrompu",
			"out_of_memory_printer_device:Mémoire insuffisante (périphérique d'impression)",
			"out_of_internal_memory_printer_device:Mémoire interne insuffisante (périphérique d'impression)",
			"library_already_opened:Bibliothèque déjà ouverte",
			"library_not_opened:Bibliothèque non ouverte",
			"cannot_open_library:Impossible d'ouvrir la bibliothèque",
			"parallel_device_already_opened:Port parallèle déjà ouvert",
			"out_of_memory_parallel_device:Mémoire insuffisante (port parallèle)",
			"invalid_parallel_parameter:Paramètre de port parallèle non valide",
			"parallel_line_error:Erreur de ligne de port parallèle",
			"drive_not_found:Lecteur introuvable",
			"parallel_port_reset:Réinitialisation du port parallèle",
			"parallel_initialisation_error:Erreur d'initialisation de port parallèle",
			"wave_not_defined:Wave non définie",
			"sample_not_defined:Son non défini",
			"sample_bank_not_found:Banque de sons introuvable",
			"256_characters_for_a_wave:256 caractères pour un son",
			"wave_0_and_1_are_reserved:Les sons 0 et 1 sont réservées",
			"music_bank_not_found:Banque de musique introuvable",
			"music_not_defined:Musique non définie",
			"cant_open_narrator:Impossible d'ouvrir le narrateur",
			"not_a_tracker_module:Pas un module Tracker",
			"cannot_load_med_library:Impossible de charger la librairie med",
			"cannot_start_med_library:Impossible de démarrer librairie med",
			"not_a_med_module:Pas un module med",
			"at_line:à la ligne: ",
			"at_column:à la colonne:",
			"image_not_defined:Image non définie (%1)",
			"arexx_port_already_opened:Le port Arexx est déjà ouvert",
			"arexx_library_not_found:Bibliothèque Arexx introuvable",
			"cannot_open_arexx_port:Impossible d'ouvrir le port Arexx",
			"Arexx_port_not_opened:Port Arexx non ouvert",
			"no_arexx_message_waiting:Aucun message Arexx en attente",
			"arexx_message_not_answered_to:Message Arexx sans réponse",
			"arexx_device_not_interactive:Le périphérique Arexx n'est pas interactif",
			"local_storage_not_available:Stockage local non disponible",
			"sprite_not_defined:Sprite non défini",
			"fps_indicator:%1 FPS",
			"every_too_long:Routine Every trop longue",
			"every_not_defined:Routine Every non définie",
			"every_already_defined:Routine Every déjà définie",
			"amal_channel_not_opened:Canal AMAL non ouvert",
			"global_variable_not_defined:Variable globale non défini",
			"function_not_available_in_true_color_mode:Fonction non disponible en mode 'true color'",
			"context_not_defined:Contexte de propriété non défini",
			"property_not_defined:Propriété non définie",
			"name_already_used:Nom déjà utilisé",
			"instruction_not_closed:Instruction non clôturée",
			"function_not_closed:Fonction non clôturée",
			"procedure_not_closed:Procédure non clôturée",
			"non_contiguous_instructions:Définition d'instruction non contiguë",
			"non_contiguous_functions:Définition de fonction non contiguë",
			"javascript_section_not_closed:Section Javascript non clôturée",
			"compiler_stuck_in_loop:Compilateur bloquée dans une boucle",
			"tag_parameter_not_defined:Le paramètre de balise n'est pas défini",
			"tag_parameter_must_be_constant:Le paramètre de tag doit être une constante",
			"bank_type_mismatch:Non-concordance de type de banque",
			"bank_other_datatypes:Numéro de banque réservé à un autre type de données",
			"loop_will_hang:La boucle va se bloquer",
			"reverse_for_loop_positive:L'inverse pour la boucle a un pas positif",
			"forward_for_loop_negative:La boucle en avant a un pas négatif",
			"in_amal_string:dans une chaîne amal à la position %1",
			"amal_error:Erreur dans la chaîne AMAL",
			"in_source:dans le fichier ",
			"channel_type_not_found:Type de canal d'animation non existant: %1",
			"parameter_not_found:Parametre non trouvé: %1",
			"cannot_wait_in_event_procedures:Les instructions longues ne sont pas autorisees dans une procedure evenement",
			"method_not_found:Methode non trouvee",
			"procedure_not_found:Procedure non trouvee",
			"object_or_property_not_found:Object or property not found",
			"tag_not_defined:Tag non defini",
			"endwith_without_with:End Width sans With associe",
			"with_without_endwith:With sans End With associe",
			"image_format_not_supported:Format d'image non supporte",
			"filesystem_not_supported:Systeme de fichier non supporte",
			"color_not_found:Couleur introuvable",
			"please_enter_text:Entrer la reponse...",
			"name_conflict_between_variable_and_procedure:Conflit de nom entre la variable %1 et le nom d'une procedure",
			"transpilation_cancelled:Transpilation interrompue.",
			"array_index_out_of_bounds:Parametre d'index numero %1 (valeur: %2) en dehors des limites (maximum: %3)",
			"label_already_defined:L'étiquette %1 est déjà définie.",
			"cannot_load_font:Impossible de charger la police %1.",
			"shared_error:L'instruction Shared ne peut pas etre utilise dans le code racine.",
			"filter_not_defined:Le filtre %1 n'existe pas.",
			"variable_name_conflict:Conflit de nom de variable avec %1 nommee %2",
			"object_name_conflict:Conflit de nom avec %1 nomme %2",
			"bank_element_not_defined:Objet non trouve (%1)",
			"filesystem_initializing:Systeme de fichier en cours d'initialisation"
		],
	};
};
Errors.prototype.getText = function( id, param )
{
	return this.getError( id, param );
};
Errors.prototype.getError = function( error, param )
{
	var self = this;
	var paramType = typeof param != 'undefined' ? typeof param : '';

	if ( typeof error == 'string' )
	{
		error =
		{
			error: error,
			parameter: paramType == 'string' ? param : undefined,
			parameters: paramType != 'string' ? param : undefined,
		};
	}

	// First in browser language
	if ( !error.stack )
	{
		var id = error.error + ':';
		var result = getError( this.errors[ this.language ], error );
		if ( result )
			return result;

		// Then in English
		if ( this.language != 'en' )
		{
			result = getError( this.errors[ 'en' ], error );
			if ( result )
				return result;
		}

		// Then any language (TODO: keep?)
		for ( var l in this.errors )
		{
			if ( l != this.language && l != 'en' )
			{
				result = getError( this.errors[ l ], error );
				if ( result )
					return result;
			}
		}
	}

	// Then just the message...
	return { number: -1, index: '', message: 'Message identifier not found ' + error.error };

	function getError( errorList, error )
	{
		if ( errorList )
		{
			var number = errorList.findIndex( function( element )
			{
				return element.indexOf( id ) == 0;
			})
			if ( number >= 0 )
			{
				var message = errorList[ number ].substring( id.length );
				if ( typeof error.parameter != 'undefined' )
					message = self.aoz.utilities.replaceStringInText( message, '%1', '' + error.parameter );
				else if ( error.parameters )
				{
					for ( var p = 0; p < error.parameters.length; p++ )
						message = self.aoz.utilities.replaceStringInText( message, '%' + ( p + 1 ), '' + error.parameters[ p ] );
				}
					
				// Clean the remaining %
				for ( var n = 0; n < 5; n++ )
					message = self.aoz.utilities.replaceStringInText( message, '%' + n, '' );
				return { number: number, index: id.substring( 0, id.length - 1 ), message: message };
			}
		}
		return undefined;
	}
};
Errors.prototype.getErrorFromNumber = function( number )
{
	var self = this;

	// Browser language
	var result = getError( this.errors[ this.language ], number )
	if ( result )
		return result;

	// English!
	if ( this.language != 'en' )
	{
		result = getError( this.errors[ 'en' ], number )
		if ( result )
			return result;
	}

	// Any language (TODO: keep?)
	for ( var l in this.errors )
	{
		if ( l != this.language && l != 'en' )
		{
			result = getError( this.errors[ l ], number );
			if ( result )
				return result;
		}
	}
	return { number: number, message: 'Message not found ' + number, index: '' };

	function getError( list, num )
	{
		if ( num < list.length )
		{
			var message = list[ num ];
			var pos = message.indexOf( ':' );
			if ( pos >= 0 )
			{
				return { number: num, message: message.substring( pos + 1 ), index: message.substring( 0, pos ) };
			}
		}
		return undefined;
	}
};
