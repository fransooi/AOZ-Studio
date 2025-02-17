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
 * List of messages FR
 *
 * Translated by Laurent Ongaro
 *
 * @author FL (Francois Lionet)
 * @date first pushed on 04/12/2018
 */

var messages = require("./messages");
texts =
[
  "empty:                                         					.",
  "title:															AOZ Transpiler Version %1<BR>(c) AOZ Studio 2019-2020<BR>https://aoz.studio<BR>-------------------------------------------------------------------------------",
  "developper_mode:													Mode developpeur: %1<BR>",
  "console:                                       					%1",
  "creating_directory:                            					Création du répertoire: %1<BR>",
  "compiled_with:                                 					Compilé avec AOZ Transpiler Version %1 le %2",
  "compilation_success:                           					Compilation réussie, durée: %1 secondes.<BR>",
  "compilation_failed:                            					Echec de la compilation, aucun code n'a été généré ...<BR>",
  "compiling:                                     					Transpilation de %1<BR>",
  "compiling_code:                                 					Creation du code...<BR>",
  "compiling_images:                              					Transpilation des images ...<BR>",
  "compiling_icons:                               					Transpilation des icônes ...<BR>",
  "compiling_sounds:                              					Transpilation des sons ...<BR>",
  "compiling_musics:                              					Transpilation des musiques ...<BR>",
  "compiling_fonts:                               					Transpilation des polices ...<BR>",
  "compiling_filesystem:                          					Transpilation du système de fichiers ...<BR>",
  "error:                                         					error",
  "warning:                                       					warning",
  "compilation_error:                             					Erreur de transpilation",
  "compilation_warning:                           					Avertissement du transpileur",
  "compiling_extension:                           					Transpilation de l'extension %1<BR>",
  "compiling_module:                              					Transpilation du module %1<BR>",
  "compiling_all_modules:											Verification de tous les modules...<BR>",
  "compiling_all_extensions:										Verification de toutes les extensions...<BR>",
  "removing_directory:                            					Suppression du répertoire: %1<BR>",
  "skip_line:                                     					<BR>",
  "filesaver_saving:                              					Filesaver sauve: %1<BR>",
  "filesaver_copying:                             					Filesaver copie: %1<BR>",
  "module_compiled_succesfully:                   					Module compilé avec succès: %1<BR>",
  "extension_compiled_successfully:               					Extension compilée avec succès: %1<BR>",
  "converting_code:                               					Conversion du code ...<BR>",
  "converting_banks:                              					Conversion des banques ...<BR>",
  "creating_manifest:                             					Création d'un manifeste ...<BR>",
  "conversion_succesfull:                         					Conversion réussie.<BR>",
  "converting:                                    					Conversion de %1 en %2<BR>",
  "extracting_bank:                               					Extraction de la banque #%1, longueur: %2<BR>",
  "checking_server:                               					Vérification de la présence d'un serveur Web local ...<BR>",
  "starting_server:                               					Démarrage du serveur web local<BR>",
  "copying_to_server:                             					Copie de fichiers sur le serveur Web local<BR>",
  "crash_error:                                   					Crash lors de la compilation: %1<BR>",
  "internal_error:                                					Erreur interne<BR>",
  "conversion_header:												//<BR>// %1 - Converti to AOZ le %2,<BR>//<BR>",
  "saving_system_information:                     					Enregistrement des informations système dans: %1<BR>",
  "updating_system_information:                   					Mise à jour des informations système ...<BR>",
  "cannot_load_ini:                               					Installation incorrecte d'AOZ: impossible de charger 'aoz.ini' (chemin: %1)<BR>",
  "readable_error:								  					Erreur: %1 en line %2, colonne %3, fichier %4<BR>",
  "readable_warning:							  					Avertissement: %1 en line %2, colonne %3, fichier %4<BR>",
  "starting_autotranslate:											Lancement du processus de traduction automatique vers:  %1<BR>",
  "autotranslate_complete:											Traduction automatique terminee, je parle maintenant votre langue... :)<BR>",
  "translation_failed:												Un probleme est survenu pendant la traduction.<BR>",
  "communication_failed:											Erreur de communication avec les services de traduction.<BR>",
  "copying_resources:												Copie des ressources...<BR>",
  "generating_index:												Generation de l'index...<BR>",
  "zero_pass:														Passe zero...<BR>",
  "first_pass:														Premiere passe, %1 %2...<BR>",
  "second_pass:														Seconde passe, %1 %2...<BR>",
  "copying_file:													Copie du fichier %1 vers %2<BR>",
  "loading_file:													Chargement du fichier %1 to %2<BR>",
  "getting_directory:												Exploration du repertoire %1<BR>",
  "copying_directory:												Copie du repertoire %1 vers %2<BR>",
  "deleting_file:													Destruction du fichier %1<BR>",
  "deleting_directory:												Destruction du repertoire %1<BR>",
  "saving_file:														Sauvegarde du fichier %1<BR>",
  "loading_json:													Changement du fichier JSON %1<BR>",
  "copying_unlock:													Copie et deblocage du fichier %1<BR>",
  "manifest_loaded:													Manifest charge %1<BR>",
  "warminit:														Initialisation du transpilateur...<BR>",
  "warminit_ok:														Initialisation du transpilateur OK...<BR>",
  "warminit_error:													Erreur lors de l'initialisation du transpilateur...<BR>",
  "fileloader_new:													Fileloader reset...<BR>",
  "filesaver_new:													Filesaver reset...<BR>",
  "reloading_sources:												Relopading runtime code...<BR>",
  "map_not_found:													Fichier map non trouve (chemin: %1)<BR>",
  "la_procedure:													la procedure",
  "l_objet:															l'objet",
  "l_instruction:													l'instruction",
  "la_fonction:														la fonction",
  "la_methode:														la methode",
  "le_token:														le token"
];

compilerErrors =
[
  	// Avertissement
  	'font_not_found:                      							Police introuvable: %1',
  	'garbage_found_in_folder:             							Fichiers inutiles trouvés dans le dossier: %1',
  	'font_not_supported:                  							Police non prise en charge: %1',
  	'file_at_root_of_filesystem:          							Fichier trouvé à la racine du dossier du système de fichiers (%1)',
  	'screen_not_multiple_of_font_size:    							Les dimensions écran par défaut ne sont pas un multiple des tailles des polices de la fenetre',
  	'missing_folder:                      							Dossier manquant: %1',
  	'missing_resources_folder:            							Dossier de ressources manquant',
  	'creating_directory:                  							Création du répertoire %1',
  	'cannot_set_permissions:              							Impossible de définir les autorisations (fichier: %1)',
  	'illegal_bank_element_filename:       							Nom de fichier élément de banque invalide (%1)',
  	'file_to_include:                     							Fichier à inclure: %1',
  	'copying_file_to_filesystem:          							Copie du fichier %1 dans le système de fichiers',
  	'duplicate_error_message:             							Message erreur en double: %1',
  	'out_of_unique_identifiers:           							Identifiants uniques non disponibles, préfixe: %1',
  	'should_wait:													Cette application utilise des sons, elle doit attendre une interaction utilisateur',

  	// Erreur
  	"illegal_tag_parameter:      									Paramètre de balise invalide %1",
  	"application_does_not_exist:      								L'application AOZ n'existe pas: %1",
  	"manifest_not_found:      										Manifeste d'application introuvable (%1)",
  	"cannot_delete_file:      										Impossible de supprimer le fichier: %1",
  	"cannot_delete_directory:      									Impossible de supprimer le répertoire: %1",
  	"illegal_manifest:      										Chemin du manifeste invalide: %1,  %2",
  	"extension_manifest_not_found:      							Manifeste d'extension introuvable (%1)",
  	"illegal_extension_manifest:      								Manifeste d'extension invalide: %1",
  	"illegal_module_manifest:      									Manifeste de module invalide",
  	"module_manifest_not_found:      								Manifeste de module introuvable (%1)",
  	"bad_version_of_manifest:      									Mauvaise version du manifeste (%1)",
  	"cannot_load_runtime_index:      								Impossible de charger l'index du runtime",
  	"cannot_write_file:      										Impossible d'écrire le fichier: %1",
  	"cannot_copy_file:      										Impossible de copier le fichier: %1",
  	"cannot_copy_directory:      									Impossible de copier le répertoire: %1",
  	"cannot_load_file:      										Impossible de charger le fichier: '%1'",
  	"cannot_save_file:      										Impossible de sauver le fichier: '%1'",
  	"include_before_everything:      								Include doit être situé avant toute autre instruction",
  	"conversion_error:      										La conversion a échoué.",
  	"file_not_found:      											Fichier introuvable: %1",
  	"directory_not_found:      										Répertoire introuvable: %1",
  	"command_not_supported:      									Commande non prise en charge: %1",
    "invalid_argument:                                              Argument invalid: %1",
  	"illegal_bank_element_filename:      							Nom de fichier de l’élément de banque non autorisé: %1",
  	"crash_error:      												Crash lors de la compilation: %1",
  	"compiler_stuck_in_loop:      									Compilateur bloqué dans la boucle",
  	"conversion_error:      										Erreur de conversion dans le fichier %1",
  	"unknown_bank_format:      										Format de banque inconnu",
  	"illegal_json_file:      										Format JSON incorrect dans le fichier %1",
  	"internal_error:      											Erreur interne",
  	"cannot_include_amos:      										Impossible d'inclure des applications AMOS dans cette version",
  	"illegal_error_message:      									Message d'erreur invalide: %1",
  	"transpiler_manifest_not_found:      							Manifeste de transcripteur introuvable",
  	"illegal_transpiler_manifest:      								Manifeste de transcripteur invalide",
  	"bad_version_of_transpiler_manifest:      						Mauvaise version du manifeste du transpileur",
	"font_already_added:											Police de caractere ajoutee deux fois: %1",
	"illegal_tag:													Illegal tag definition: %1",
	"local_tag_already_defined:										Local tag already defined: %1",
	"global_tag_already_defined:									Global tag already defined: %1",
	"objects_can_only_be_defined_in_main_application:				Les objets ne peuvent etre definis que dans l'application principale",
	"cannot_mix_new_and_old_syntax:									Impossible de melanger l'ancienne et la nouvelle syntaxe",
	"object_not_opened:												Objet non ouvert",
	"object_already_opened:											Objet deja ouvert",
	"method_not_opened:												Method non ouverte",
	"method_already_opened:											Method deja ouverte",
	"methods_can_only_be_located_in_objects:						Une methode ne peut se trouver que dans un objet",
	"indexes_must_be_defined:										Les index doivent etre definis",
	"file_is_not_an_aoz_application:								Le fichier n'est pas une application aoz",
	"file_is_not_an_aoz_module:										Le fichier n'est pas un module aoz",
	"file_is_not_an_aoz_extension:									Le fichier n'est pas une extension aoz",
	"no_debugging_instruction:										Instruction de debuggage trouvee a la ligne %1",
	"to_be_implemented:												Commande encore a implementer",
	"path_is_not_directory:											Le chemin doit etre un repertoire (%1)",
];

warnings = [
  	'variable_not_declared:                   						La variable "%P1" est utilisée sans être déclarée',
  	'instruction_not_implemented:             						Instruction non implémentée',
  	'null_for_next_step:                      						Le parametre Next est égal à zéro',
];

errors = [
  	"", // 0
  	"return_without_gosub:      									Return sans gosub", // 1
  	"pop_without_gosub:      										Pop sans gosub", // 2
  	"error_not_resumed:      										Erreur sans Resume", // 3
  	"cant_resume_to_a_label:      									Impossible faire un Resume vers une étiquette", // 4
  	"no_on_error_proc:      										Pas de 'ON ERROR PROC' avant cette instruction", // 5
  	"resume_label_not_defined:      								Étiquette de Resume non définie", // 6
  	"resume_without_error:      									Resume sans erreur", // 7
  	"error_procedure_must_resume:      								La procédure d'erreur doit utiliser Resume avant de se terminer", // 8
  	"program_interrupted:      										Programme interrompu", // 9
	"procedure_not_closed:      									Procédure non clôturée", // 10
  	"out_of_variable_space:      									Plus de mémoire pour les variables", // 11
  	"cannot_open_math_libraries:      								Impossible d'ouvrir les bibliothèques mathématiques", // 12
  	"out_of_stack_space:      										Hors de l'espace de pile", // 13
  	"procedure_not_opened:      									Procédure non ouverte", // 14
  	"user_function_not_defined:      								Fonction utilisateur non définie", // 15
  	"illegal_user_function_call:      								Appel de fonction utilisateur invalide", // 16
  	"illegal_direct_mode:      										Mode direct invalide", // 17
	"procedure_not_found:      										Procédure non trouvée", // 18
	"instruction_not_implemented:      								Instruction non implémentée", // 19
  	"division_by_zero:      										Division par zéro", // 20
  	"string_too_long:      											Chaîne trop longue", // 21
	"syntax_error:      											Erreur de syntaxe", // 22
	"illegal_function_call:      									Appel de fonction invalide %1 %2 %3", // 23
	"out_of_memory:      											Mémoire insuffisante", // 24
	"address_error:      											Erreur d'adresse", // 25
  	"string_not_closed:      										Chaîne non clôturée", // 26
  	"non_dimensionned_array:      									Tableau non dimensionné", // 27
  	"array_already_dimensionned:      								Tableau déjà dimensionné", // 28
  	"overflow:      												Débordement", // 29
  	"bad_iff_format:      											Mauvais format IFF", // 30
  	"iff_compression_not_recognised:      							Compression IFF non reconnue", // 31
  	"cant_fit_picture:      										Impossible d'adapter l'image à l'écran actuel", // 32
  	"out_of_data:      												Plus de données", // 33
  	"type_mismatch:      											Incompatibilité de type: %1", // 34
  	"bank_already_reserved:      									Banque déjà réservée", // 35
  	"bank_not_reserved:      										Banque non réservée", // 36
  	"fonts_not_examined:      										Polices non examinées", // 37
  	"menu_not_opened:      											Menu non ouvert", // 38
  	"menu_item_not_defined:      									Élément de menu non défini", // 39
  	"label_not_defined:      										Etiquette non définie", // 40
	"not_data_after_this_label:      								Aucune donnée après cette étiquette", // 41
  	"procedure_already_defined:      								Procédure déjà définie", // 42
  	"next_without_for:      										Instruction Next sans For", // 43
  	"font_not_available:      										Police non disponible", // 44
  	"until_without_repeat:      									Instruction Until sans Repeat", // 45
  	"block_not_defined:      										Bloc non défini", // 46
  	"screen_not_opened:      										Écran non ouvert", // 47
  	"illegal_screen_parameter:      								Paramètre d'écran invalide", // 48
  	"illegal_number_of_colours:      								Nombre de couleurs invalide", // 49
  	"valid_screen_numbers:      									Les numéros d'écran valides vont de 0 à 7", // 50
  	"too_many_colours_in_flash:      								Trop de couleurspour flash", // 51
  	"flash_declaration_error:      									Erreur de déclaration Flash", // 52
  	"shift_declaration_error:      									Erreur de déclaration dans Shift", // 53
  	"text_window_not_opened:      									Fenêtre de texte non ouverte", // 54
  	"text_window_already_opened:      								Fenêtre de texte déjà ouverte", // 55
  	"text_window_too_small:      									Fenêtre de texte trop petite", // 56
  	"text_window_too_large:      									Fenêtre de texte trop grande", // 57
  	"wend_without_while:      										Passez du temps", // 58
  	"bordered_text_windows_not_on_edge:      						Fenêtres de texte avec bordure pas sur le bord de l'écran", // 59
  	"illegal_text_window_parameter:      							Paramètre de fenêtre de texte non conforme: %1", // 60
  	"loop_without_do:      											Instruction Loop sans Do", // 61
  	"text_window_0_cant_be_closed:      							La fenêtre de texte 0 ne peut pas être fermée", // 62
  	"this_windows_has_no_border:      								Cette fenêtre n'a pas de bordure", // 63
  	"no_loop_to_exit_from:      									Pas de boucle  à quitter", // 64
  	"block_not_found:      											Bloc introuvable", // 65
  	"illegal_block_parameters:      								Paramètres de bloc illégaux", // 66
  	"screens_cant_be_animated:      								Les écrans ne peuvent pas être animés", // 67
	"bob_not_defined:      											Bob non défini", // 68
  	"screen_already_in_double_buffering:      						Écran déjà en double buffer", // 69
  	"cant_set_dual_playfield:      									Impossible de définir le dual playfield", // 70
  	"screen_not_in_dual_playfield:      							Écran non en mode dual playfield", // 71
  	"scrolling_not_defined:      									Scrolling non défini", // 72
  	"no_zones_defined:      										Aucune zone définie", // 73
  	"icon_not_defined:      										Icône non définie", // 74
	"rainbow_not_defined:      										Rainbow non défini", // 75
  	"copper_not_disabled:      										Copper non désactivé", // 76
  	"copper_list_too_long:      									Copper_list non définie", // 77
  	"illegal_copper_parameter:      								Paramètre de Copper invalide", // 78
  	"file_already_exists:      										Le fichier existe déjà", // 79
  	"directory_not_found:      										Répertoire introuvable", // 80
  	"file_not_found:      											Fichier non trouvé", // 81
  	"illegal_filename:      										Nom de fichier invalide", // 82
  	"disc_is_not_validated:      									Le disque n'est pas validé", // 83
  	"disc_is_write_protected:      									Le disque est protégé en écriture", // 84
  	"directory_not_empty:      										Répertoire non vide", // 85
  	"device_not_available:      									Périphérique non disponible", // 86
  	"for_without_next:      										Instruction For Sans Next", // 87
  	"disc_full:      												Disque plein", // 88
  	"file_is_write_protected_against_deletion:      				Le fichier est protégé contre la suppression", // 89
  	"file_is_write_protected:      									Le fichier est protégé en écriture", // 90
  	"file_is_protected_against_reading:      						Le fichier est protégé contre la lecture", // 91
  	"not_an_amigados_disc:      									Pas un disque AmigaDOS", // 92
  	"no_disc_in_drive:      										Pas de disque dans le lecteur", // 93
  	"io_error:      												Erreur d'E/S", // 94
  	"file_format_not_recognised:      								Format de fichier non reconnu", // 95
  	"file_already_opened:      										Fichier déjà ouvert", // 96
  	"file_not_opened:      											Fichier non ouvert", // 97
  	"file_type_mismatch:      										Incohérence dans le type de fichier", // 98
  	"input_too_long:      											Entrée utilisateur trop longue", // 99
  	"end_of_file:      												Fin de fichier", // 100
  	"disc_error:      												Erreur de disque", // 101
  	"instruction_not_allowed_there:      							Instruction non autorisée ici", // 102
  	"illegal_number_of_dimensions:      							Nombre de dimensions invalide", // 103
  	"array_not_dimensionned:      									Tableau non dimensionné", // 104
  	"sprite_error:      											Erreur de sprite", // 105
  	"function_not_implemented:      								Fonction non implémentée", // 106
  	"syntax_error_in_animation_string:      						Erreur de syntaxe dans la chaîne d'animation", // 107
  	"next_without_for_in_animation_string:      					Next sans For dans la chaîne d'animation", // 108
  	"label_not_defined_in_animation_string:      					Label non défini dans la chaîne d'animation", // 109
  	"jump_to_within_autotest:      									Saut à/dans l'autotest dans la chaîne d'animation", // 110
  	"autotest_already_opened:      									Autotest déjà ouvert", // 111
  	"instruction_only_valid_in_autotest:      						Instruction valable uniquement en autotest", // 112
  	"animation_string_too_long:      								Chaîne texte d'animation trop longue", // 113
  	"label_already_defined_in_animation_string:      				Libellé déjà défini dans la chaîne d'animation", // 114
  	"illegal_instruction_during_autotest:      						Instruction invalide pendant l'autotest", // 115
  	"amal_bank_not_reserved:      									Banque AMAL non réservée", // 116
	"internal_error:      											Erreur interne", // 117
  	"unknown_error:      											Erreur inconnue", // 118
  	"cannot_load_file:      										Impossible de charger le fichier: '%1'", // 119
  	"interface_error_bad_syntax:      								Erreur d'interface: mauvaise syntaxe", // 120
  	"interface_error_out_of_memory:      							Erreur d'interface: mémoire insuffisante", // 121
  	"interface_error_label_defined_twice:      						Erreur d'interface: étiquette définie deux fois", // 122
  	"interface_error_label_not_defined:      						Erreur d'interface: étiquette non définie", // 123
	"interface_error_channel_already_defined:      					Erreur d'interface: canal déjà défini", // 124
  	"interface_error_channel_not_defined:      						Erreur d'interface: canal non défini", // 125
  	"interface_error_screen_modified:      							Erreur d'interface: écran modifié", // 126
  	"interface_error_variable_not_defined:      					Erreur d'interface: variable non définie", // 127
  	"interface_error_illegal_function_call:      					Erreur d'interface: appel de fonction invalide", // 128
  	"interface_error_type_mismatch:      							Erreur d'interface: incompatibilité de type", // 129
  	"interface_error_buffer_too_small:      						Erreur d'interface: tampon trop petit", // 130
  	"interface_error_illegal_n_parameters:      					Erreur d'interface: nombre de paramètres invalide", // 131
  	"if_without_endif:      										Instruction Si sans Endif", // 132
  	"not_enough_loops_to_exit:      								Pas assez de boucles Loop pour sortir", // 133
  	"no_loop_to_exit:      											Pas de boucle Loop pour sortir", // 134
  	"please_redo_from_start:      									Veuillez recommencer depuis le début", // 135
  	"instruction_not_opened:      									Instruction non ouverte", // 136
  	"instruction_already_opened:      								Instruction déjà ouverte", // 137
  	"function_not_opened:      										Fonction non ouverte", // 138
	"function already opened:      									Fonction déjà ouverte", // 139
  	"device_already_opened:      									Périphérique déjà ouvert", // 140
  	"device_not_opened:      										Périphérique non ouvert", // 141
  	"device_cannot_be_opened:      									Impossible d'ouvrir le Périphérique", // 142
  	"command_not_supported_by_device:      							Commande non prise en charge par le Périphérique", // 143
  	"device_error:      											Erreur de périphérique", // 144
  	"serial_device_already_in_use:      							Périphérique série déjà utilisé", // 145
  	"repeat_without_until:      									Instruction Repeat sans Until", // 146
  	"invalid_baud_rate:      										Débit en bauds non valide", // 147
  	"out_of_memory_serial_device:      								Mémoire insuffisante (Périphérique série)", // 148
	"bad_parameter:      											Mauvais paramètre", // 149
  	"hardware_data_overrun:      									Dépassement des données matérielles", // 150
  	"do_without_loop:      											Instruction Do sans Loop", // 151
  	"while_without_wend:      										Instruction While sans Wend", // 152
  	"cannot_read_directory:      									Impossible de lire le répertoire:", // 153
  	"directory_of:      											Répertoire de %X", // 154
  	"timeout_error:      											Erreur de temporisation", // 155
	"buffer_overflow:      											Débordement de tampon (buffer_overflow)", // 156
  	"no_data_set_ready:      										Aucun ensemble de données (data_set) prêt", // 157
  	"do_without_loop:      											Instruction Do sans Loop", // 158
  	"break_detected:      											Break détecté", // 159
  	"selected_unit_already_in_use:      							Unité sélectionnée déjà utilisée", // 160
  	"user_canceled_request:      									L'utilisateur a annulé la demande", // 161
  	"printer_cannot_output_graphics:      							Le périphérique d'impression ne peut pas produire de graphiques", // 162
  	"while_without_wend:      										Instruction While sans Wend", // 163
  	"illegal_print_dimensions:      								Dimensions d'impression invalides", // 164
  	"corrupted_file:      											Fichier corrompu", // 165
  	"out_of_memory_printer_device:      							Mémoire insuffisante (périphérique d'impression)", // 166
  	"out_of_internal_memory_printer_device:      					Mémoire interne insuffisante (périphérique d'impression)", // 167
  	"library_already_opened:      									Bibliothèque déjà ouverte", // 168
  	"library_not_opened:      										Bibliothèque non ouverte", // 169
  	"cannot_open_library:      										Impossible d'ouvrir la bibliothèque", // 170
  	"parallel_device_already_opened:      							Port parallèle déjà ouvert", // 171
  	"out_of_memory_parallel_device:      							Mémoire insuffisante (port parallèle)", // 172
  	"invalid_parallel_parameter:      								Paramètre de port parallèle non valide", // 173
  	"parallel_line_error:      										Erreur de ligne de port parallèle", // 174
  	"drive_not_found:      											Lecteur introuvable", // 175
  	"parallel_port_reset:      										Réinitialisation du port parallèle", // 176
  	"parallel_initialisation_error:      							Erreur d'initialisation de port parallèle", // 177
  	"wave_not_defined:      										Wave non définie", // 178
  	"sample_not_defined:      										Son non défini", // 179
  	"sample_bank_not_found:      									Banque de sons introuvable", // 180
  	"256_characters_for_a_wave:      								256 caractères pour un son", // 181
  	"wave_0_and_1_are_reserved:      								Les sons 0 et 1 sont réservées", // 182
  	"music_bank_not_found:      									Banque de musique introuvable", // 183
  	"music_not_defined:      										Musique non définie", // 184
  	"cant_open_narrator:      										Impossible d'ouvrir le narrateur", // 185
  	"not_a_tracker_module:      									Pas un module Tracker", // 186
  	"cannot_load_med_library:      									Impossible de charger la librairie med", // 187
  	"cannot_start_med_library:      								Impossible de démarrer librairie med", // 188
  	"not_a_med_module:      										Pas un module med", // 189
  	"at_line:      													à la ligne: ", // 190
  	"at_column:    													à la colonne:", // 191
  	"image_not_defined:      										Image non définie (%1)", // 192
  	"arexx_port_already_opened:      								Le port Arexx est déjà ouvert", // 193
  	"arexx_library_not_found:      									Bibliothèque Arexx introuvable", // 194
  	"cannot_open_arexx_port:      									Impossible d'ouvrir le port Arexx", // 195
  	"Arexx_port_not_opened:      									Port Arexx non ouvert", // 196
  	"no_arexx_message_waiting:      								Aucun message Arexx en attente", // 197
  	"arexx_message_not_answered_to:      							Message Arexx sans réponse", // 198
  	"arexx_device_not_interactive:      							Le périphérique Arexx n'est pas interactif", // 199
  	"local_storage_not_available:      								Stockage local non disponible", // 200
  	"sprite_not_defined:      										Sprite non défini", // 201
  	"fps_indicator:      											%1 FPS", // 202
  	"every_too_long:      											Routine Every trop longue", // 203
  	"every_not_defined:      										Routine Every non définie", // 204
  	"every_already_defined:      									Routine Every déjà définie", // 205
  	"amal_channel_not_opened:      									Canal AMAL non ouvert", // 203
  	"global_variable_not_defined:      								Variable globale non défini", // 204
  	"function_not_available_in_true_color_mode:      				Fonction non disponible en mode 'true color'", // 205
  	"context_not_defined:      										Contexte de propriété non défini", // 206
	"property_not_defined:      									Propriété non définie", // 207
  	"name_already_used:      										Nom déjà utilisé", // 208
  	"instruction_not_closed:      									Instruction non clôturée", // 209
  	"function_not_closed:      										Fonction non clôturée", // 210
  	"procedure_not_closed:      									Procédure non clôturée", // 211
  	"non_contiguous_instructions:      								Définition d'instruction non contiguë", // 212
  	"non_contiguous_functions:      								Définition de fonction non contiguë", // 213
  	"javascript_section_not_closed:      							Section Javascript non clôturée", // 214
  	"compiler_stuck_in_loop:      									Compilateur bloquée dans une boucle", // 215
  	"tag_parameter_not_defined:      								Le paramètre de balise n'est pas défini", // 216
  	"tag_parameter_must_be_constant:      							Le paramètre de tag doit être une constante", // 217
  	"bank_type_mismatch:      										Non-concordance de type de banque", // 218
  	"bank_other_datatypes:      									Numéro de banque réservé à un autre type de données", // 220
  	"loop_will_hang:      											La boucle va se bloquer", // 221
  	"reverse_for_loop_positive:      								L'inverse pour la boucle a un pas positif", // 222
  	"forward_for_loop_negative:      								La boucle en avant a un pas négatif", // 223
  	"in_amal_string:      											dans une chaîne amal à la position %1", // 224
  	"amal_error:      												Erreur dans la chaîne AMAL", // 225
  	"in_source:      												dans le fichier ", // 226
  	"channel_type_not_found:		 								Type de canal d'animation non existant: %1",					// 227
	"parameter_not_found:											Parametre non trouvé: %1",						// 228
	"cannot_wait_in_event_procedures:								Les instructions longues ne sont pas autorisees dans une procedure evenement",		// 230
	"method_not_found:												Methode non trouvee",										// 231
	"procedure_not_found:											Procedure non trouvee",									// 232
	"object_or_property_not_found:									Object or property not found",							// 233
	"tag_not_defined:												Tag non defini",										// 234
	"endwith_without_with:											End Width sans With associe",								// 235
	"with_without_endwith:  										With sans End With associe", 								// 236
	"image_format_not_supported:									Format d'image non supporte",								// 237
	"filesystem_not_supported:										Systeme de fichier non supporte",								// 238
	"color_not_found:												Couleur introuvable",										// 239
	"please_enter_text:												Entrer la reponse...",								// 240
	"name_conflict_between_variable_and_procedure: 					Conflit de nom entre la variable %1 et le nom d'une procedure",	// 241	
	"transpilation_cancelled:										Transpilation interrompue.",								// 242
	"array_index_out_of_bounds:										Parametre d'index numero %1 (valeur: %2) en dehors des limites (maximum: %3)",	// 243
	"label_already_defined:										    L'étiquette %1 est déjà définie.",	// 244
	"cannot_load_font:												Impossible de charger la police %1.",				// 245
	"shared_error:													L'instruction Shared ne peut pas etre utilise dans le code racine.",				// 246
	"filter_not_defined:											Le filtre %1 n'existe pas.",								// 247
	"variable_name_conflict:										Conflit de nom de variable avec %1 nommee %2",				// 248
	"object_name_conflict:											Conflit de nom avec %1 nomme %2",						// 249
	"bank_element_not_defined:										Objet non trouve (%1)",									// 250
	"filesystem_initializing:										Systeme de fichier en cours d'initialisation",						// 251
	"object_variable_not_defined:									Les variables objet doivent etre initialisees (%1)",				// 252
	"application_complete:											Application terminée.",								// 253
];

messages.addLanguage
(
  	"fr",
  	texts,
  	errors,
  	warnings,
  	compilerErrors,
  	compilerErrors
);
