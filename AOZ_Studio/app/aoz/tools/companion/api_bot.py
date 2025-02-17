#*@*****************************************************************************
#                                                                              *
#   █████╗  ██████╗ ███████╗    ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗  *
#  ██╔══██╗██╔═══██╗╚══███╔╝    ██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗ *
#  ███████║██║   ██║  ███╔╝     ███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║ *
#  ██╔══██║██║   ██║ ███╔╝      ╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║ *
#  ██║  ██║╚██████╔╝███████╗    ███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝ *
#  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝    ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝  *
#                                                                              *
# This file is part of AOZ Studio.                                             *
# Copyright (c) AOZ Studio. All rights reserved.                               *
#                                                                              *
# Licensed under the GNU General Public License v3.0.                          *
# More info at: https://choosealicense.com/licenses/gpl-3.0/                   *
# And in the file AOZ_StudioCodeLicense.pdf.                                   *
#                                                                              *
#****************************************************************************@*/
# @file
#
# The AOZ Companion Server
# By Francois Lionet
#
# Cyberpi API
#
# @author FL
# @date first pushed on 20/01/2022
#
# noinspection PyMethodMayBeStatic

import cyberpi

class Api_Bot:
	def __init__( self, connection ):
		self.connection = connection
		self.functions = {
			'audio play': 		{ 'f': self.play_audio, 		'p': '2', 		'd': [ 'hello' ] },
			'sound play': 		{ 'f': self.play_sound, 		'p': '012', 	'd': [ 33, 1, 'piano' ] },
			'drum play': 		{ 'f': self.play_drum, 			'p': '21', 		'd': [ 'crash-cymbal', 1 ] },
			'volume':			{ 'f': self.set_vol,			'p': '0',		'd': [ 100 ] },
			'volume_f':			{ 'f': self.get_vol,			'p': '',		'd': [ ] },
			'tempo_f':			{ 'f': self.get_tempo,			'p': '',		'd': [ ] },
			'tempo':			{ 'f': self.set_tempo,			'p': '0',		'd': [ 100 ] },
			'tone play':		{ 'f': self.play_tone,			'p': '01',		'd': [ 330, 1 ] },
			'record play':		{ 'f': self.play_record,		'p': '',		'd': [ ] },
			'record':			{ 'f': self.record,				'p': '',		'd': [ ] },
			'record stop':		{ 'f': self.stop_record,		'p': '',		'd': [ ] },
			'audio stop':		{ 'f': self.stop_audio,			'p': '',		'd': [ ] },
			'led on':			{ 'f': self.led_on,				'p': '0000',	'd': [ 255, 255, 255, 0 ] },
			'led off':			{ 'f': self.led_off,			'p': '0',		'd': [ 0 ] },
			'led play':			{ 'f': self.led_play,			'p': '2',		'd': [ 'rainbow' ] },
			'led show':			{ 'f': self.led_show,			'p': '2',		'd': [ 'w w w w w' ] },
			'led move':			{ 'f': self.led_move,			'p': '0',		'd': [ 1 ] },
			'led bright':		{ 'f': self.set_bri,			'p': '0',		'd': [ 100 ] },
			'led bright_f':		{ 'f': self.get_bri,			'p': '',		'd': [ ] },
			'rotation reset':	{ 'f': self.reset_rotation,		'p': '0',		'd': [ 0 ] },
			'gyro_f':			{ 'f': self.gyro,				'p': '0',		'd': [ 1 ] },
			'acc_f':			{ 'f': self.acc,				'p': '0',		'd': [ 1 ] },
			'yaw reset':		{ 'f': self.reset_yaw,			'p': '',		'd': [ '' ] },
			'yaw_f':			{ 'f': self.yaw,				'p': '',		'd': [ '' ] },
			'roll_f':			{ 'f': self.roll,				'p': '',		'd': [ '' ] },
			'pitch_f':			{ 'f': self.pitch,				'p': '',		'd': [ '' ] },
			'wave speed_f':		{ 'f': self.wavespeed,			'p': '',		'd': [ '' ] },
			'freefall_f':		{ 'f': self.freefall,			'p': '',		'd': [ '' ] },
			'wave_f':			{ 'f': self.wave,				'p': '2',		'd': [ 'up' ] },
			'shake_f':			{ 'f': self.shake,				'p': '',		'd': [ ] },
			'handstand_f':		{ 'f': self.handstand,			'p': '',		'd': [ ] },
			'stand_f':			{ 'f': self.stand,				'p': '',		'd': [ ] },
			'face_f':			{ 'f': self.face,				'p': '2',		'd': [ 'up' ] },
			'tilt_f':			{ 'f': self.tilt,				'p': '2',		'd': [ 'forward' ] },
			'language_f':		{ 'f': self.get_language,		'p': '',		'd': [ '' ] },
			'print':			{ 'f': self.prnt,				'p': '2',		'd': [ '' ] },
			'println':			{ 'f': self.prnt_ln,			'p': '2',		'd': [ '' ] },
			'label show':		{ 'f': self.show_label,			'p': '2000',	'd': [ '', 16, 0, 0 ] },
			'display rotate':	{ 'f': self.rotate_display,		'p': '0',		'd': [ 90 ] },
			'display clear':	{ 'f': self.clear_display,		'p': '',		'd': [ ] },
			'display off':		{ 'f': self.display_off,		'p': '',		'd': [ ] },
			'controller_f':		{ 'f': self.controller,			'p': '2',		'd': [ 'a' ] },
			'controller count_f':{ 'f': self.controller_count,	'p': '2',		'd': [ 'a' ] },
			'controller reset':	{ 'f': self.controller_reset,	'p': '2',		'd': [ 'a' ] },
			'brightness_f':		{ 'f': self.get_brightness,		'p': '',		'd': [ ] },
			'loudness_f':		{ 'f': self.get_loudness,		'p': '2',		'd': [ 'maximum' ] },
			'mac address_f':	{ 'f': self.get_mac_address,	'p': '',		'd': [ ] },
			'battery_f':		{ 'f': self.get_battery,		'p': '',		'd': [ ] },
			'botname_f':		{ 'f': self.get_name,			'p': '',		'd': [ ] },
			'botname':			{ 'f': self.set_name,			'p': '2',		'd': [ 'aoz' ] },
			'accelerometer_f':	{ 'f': self.get_accelerometer,	'p': '2',		'd': [ 'z' ] },
			'gyro_f':			{ 'f': self.get_gyro,			'p': '2',		'd': [ 'z' ] },

			'pin analog_f':			{ 'f': self.pin_analog_f,		'p': '0',		'd': [ 1 ] },
			'pin pwm':				{ 'f': self.pin_pwm,			'p': '000',		'd': [ 0, 1, 0 ] },
			'pin_f':				{ 'f': self.pin_read,			'p': '0',		'd': [ 1 ] },
			'pin':					{ 'f': self.pin_write,			'p': '00',		'd': [ 0, 0 ] },
			'strip brigh_f':		{ 'f': self.strip_get_brightness,'p': '0',		'd': [ 1 ] },
			'strip bright':			{ 'f': self.strip_set_brightness,'p': '00',		'd': [ 0, 0 ] },
			#'strip addbrightness':	{ 'f': self.strip_add_brightness,'p': '00',		'd': [ 0, 0 ] },
			'strip off':			{ 'f': self.strip_off,			'p': '00',		'd': [ 0, 0 ] },
			'strip move':			{ 'f': self.strip_move,			'p': '000',		'd': [ 1, 10, 0 ] },
			'strip show':			{ 'f': self.strip_show,			'p': '20',		'd': [ 'w', 0 ] },
			'strip on':				{ 'f': self.strip_on,			'p': '00010',	'd': [ 255, 255, 255, 0, 0 ] },
			'servo drive':			{ 'f': self.servo_drive,		'p': '1111',	'd': [ 0, -1, -1, -1 ] },
			'servo release':		{ 'f': self.servo_release,		'p': '0',		'd': [ 0 ] },
			'servo angle_f':		{ 'f': self.servo_get_angle,	'p': '0',		'd': [ 1 ] },
			'servo angle':			{ 'f': self.servo_set_angle,	'p': '10',		'd': [ 0, 0 ] },
			#'servo addangle':		{ 'f': self.servo_add_angle,	'p': '10',		'd': [ 0, 0 ] },
			'motor stop':			{ 'f': self.motor_stop,			'p': '2',		'd': [ 0 ] },
			'motor drive':			{ 'f': self.motor_drive,		'p': '11',		'd': [ 0, 0 ] },
			'motor speed':			{ 'f': self.set_motor_speed,	'p': '10',		'd': [ 0, 0 ] },
			'motor speed_f':		{ 'f': self.get_motor_speed,	'p': '0',		'd': [ 1 ] },
			'motor power':			{ 'f': self.set_motor_power,	'p': '10',		'd': [ 0, 0 ] },
			'motor power_f':		{ 'f': self.get_motor_power,	'p': '0',		'd': [ 1 ] },
			'wheel power_f':		{ 'f': self.get_wheel_power,	'p': '0',		'd': [ 1 ] },
			'wheel angle_f':		{ 'f': self.get_wheel_angle,	'p': '0',		'd': [ 1 ] },
			'wheel reset':			{ 'f': self.wheel_reset,		'p': '0',		'd': [ 0 ] },
			'wheel turn':			{ 'f': self.wheel_turn,			'p': '010',		'd': [ 90, 100, 0 ] },
			'wheel speed':			{ 'f': self.set_wheel_speed,	'p': '00',		'd': [ 100, 0 ] },
			'wheel speed_f':		{ 'f': self.get_wheel_speed,	'p': '0',		'd': [ 1 ] },
			'wheel power':			{ 'f': self.set_wheel_power,	'p': '00',		'd': [ 100, 0 ] },
			'wheel power_f':		{ 'f': self.get_wheel_power,	'p': '0',		'd': [ 1 ] },
			'wheel lock':			{ 'f': self.lock_wheel,			'p': '00',		'd': [ 0, 0 ] },
			'stop':					{ 'f': self.stop,				'p': '',		'd': [ ] },
			'speed':				{ 'f': self.set_speed,			'p': '11',		'd': [ 100, 'a' ] },
			'rotate':				{ 'f': self.rotate,				'p': '11',		'd': [ 90, 100 ] },
			'rotation_f':			{ 'f': self.rotation,			'p': '2',		'd': [ ''] },
			'go':					{ 'f': self.go,					'p': '11',		'd': [ 10, 100 ] },
			'turn':					{ 'f': self.turn,				'p': '201',		'd': [ 'right', 100, 1 ] },
			'move':					{ 'f': self.move,				'p': '01',		'd': [ 50, 0 ] },
		}

	def init( self ):
		cyberpi.audio.play( 'hello' )
		return {
			'information': 'MBot Aoz API',
			'firmware': cyberpi.get_firmware_version(),
			'battery': cyberpi.get_battery(),
			'name': cyberpi.get_name(),
			'language': cyberpi.get_language()
		}
	
	def close( self ):
		return 
	
	def callAPI( self, command, params ):
		func = self.functions.get( command )
		return func[ 'f' ]( params )


	# Cyberpi
	###############################################################
	
	def play_audio( self, params ):
		cyberpi.audio.play( params[ 0 ] )
		return {
			'response': True
		}

	def play_sound( self, params ):
		cyberpi.audio.play_music( params[ 0 ], params[ 1 ], params[ 2 ] )
		return {
			'response': True
		}

	def play_drum( self, params ):
		cyberpi.audio.play_drum( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def record( self, params ):
		cyberpi.audio.record()
		return {
			'response': True
		}

	def play_record( self, params ):
		cyberpi.audio.play_record()
		return {
			'response': True
		}

	def stop_record( self, params ):
		cyberpi.audio.stop_record()
		return {
			'response': True
		}
	def play_tone( self, params ):
		cyberpi.audio.play_tone( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def add_tempo( self, params ):
		cyberpi.audio.add_tempo( params[ 0 ] )
		return {
			'response': True
		}

	def set_tempo( self, params ):
		cyberpi.audio.set_tempo( params[ 0 ] )
		return {
			'response': True
		}

	def get_tempo( self, params ):		
		return {
			'response': True,
			'result': cyberpi.audio.get_tempo()
		}

	def get_vol( self, params ):		
		return {
			'response': True,
			'result': cyberpi.audio.get_vol()
		}

	def set_vol( self, params ):		
		cyberpi.audio.set_vol( params[ 0 ] )
		return {
			'response': True,
		}

	def stop_audio( self, params ):		
		cyberpi.audio.stop()
		return {
			'response': True,
		}

	def led_on( self, params ):		
		if params[ 3 ] <= 0:
			params[ 3 ] = 'all'
		cyberpi.led.on( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ] )
		return {
			'response': True,
		}

	def led_play( self, params ):		
		cyberpi.led.play( params[ 0 ] )
		return {
			'response': True,
		}

	def led_show( self, params ):		
		cyberpi.led.show( params[ 0 ] )
		return {
			'response': True,
		}

	def led_move( self, params ):		
		cyberpi.led.move( params[ 0 ] )
		return {
			'response': True,
		}

	def led_off( self, params ):		
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'			
		cyberpi.led.off( params[ 0 ] )
		return {
			'response': True,
		}

	def add_bri( self, params ):		
		cyberpi.led.add_bri( params[ 0 ] )
		return {
			'response': True,
		}

	def set_bri( self, params ):		
		cyberpi.led.set_bri( params[ 0 ] )
		return {
			'response': True,
		}

	def get_bri( self, params ):		
		return {
			'response': True,
			'result': cyberpi.led.get_bri()
		}

	def prnt( self, params ):		
		cyberpi.console.print( params[ 0 ] )
		return {
			'response': True,
		}

	def prnt_ln( self, params ):		
		cyberpi.console.println( params[ 0 ] )
		return {
			'response': True,
		}

	def show_label( self, params ):		
		cyberpi.display.show_label( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ] )
		return {
			'response': True,
		}

	def rotate_display( self, params ):		
		cyberpi.display.rotate_to( params[ 0 ] )
		return {
			'response': True,
		}

	def clear_display( self, params ):		
		cyberpi.display.clear()
		return {
			'response': True,
		}

	def display_off( self, params ):		
		cyberpi.display.off()
		return {
			'response': True,
		}

	def controller( self, params ):		
		return {
			'response': True,
			'result': cyberpi.controler.is_press( params[ 0 ] )
		}

	def controller_count( self, params ):		
		return {
			'response': True,
			'result': cyberpi.controler.get_count( params[ 0 ] )
		}

	def controller_reset( self, params ):		
		return {
			'response': True,
			'result': cyberpi.controler.reset_count( params[ 0 ] )
		}

	def get_brightness( self, params ):
		return {
			'response': True,
			'result': cyberpi.get_bri()
		}

	def get_loudness( self, params ):		
		return {
			'response': True,
			'result': cyberpi.get_loudness()
		}

	def get_timer( self, params ):		
		return {
			'response': True,
			'result': cyberpi.timer.get()
		}

	def reset_timer( self, params ):		
		cyberpi.timer.reset()
		return {
			'response': True
		}

	def get_mac_address( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_mac_address()
		}

	def get_battery( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_battery()
		}

	def get_name( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_name()
		}

	def set_name( self, params ):				
		cyberpi.set_name( params[ 0 ] )
		return {
			'response': True,
		}

	def get_language( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_name()
		}

	def tilt( self, params ):				
		if params[ 0 ] == 'forward':
			return {
				'response': True,
				'result': cyberpi.is_tiltforward()
			}
		elif params[ 0 ] == 'back':
			return {
				'response': True,
				'result': cyberpi.is_tiltback()
			}
		elif params[ 0 ] == 'left':
			return {
				'response': True,
				'result': cyberpi.is_tiltleft()
			}
		elif params[ 0 ] == 'right':
			return {
				'response': True,
				'result': cyberpi.is_tiltforward()
			}
		else:
			return {
				'response': False,
				'error': 'illegal_parameter'
			}

	def face( self, params ):				
		if params[ 0 ] == 'up':
			return {
				'response': True,
				'result': cyberpi.is_faceup()
			}
		elif params[ 0 ] == 'down':
			return {
				'response': True,
				'result': cyberpi.is_facedown()
			}
		else:
			return {
				'response': False,
				'error': 'illegal_parameter'
			}

	def stand( self, params ):				
		return {
			'response': True,
			'result': cyberpi.is_stand()
		}

	def handstand( self, params ):				
		return {
			'response': True,
			'result': cyberpi.is_handstand()
		}

	def shake( self, params ):			
		if cyberpi.is_shake():	
			return {
				'response': True,
				'result': cyberpi.get_shakeval()
			}
		else:
			return {
				'response': True,
				'result': 0
			}

	def wave( self, params ):				
		if params[ 0 ] == 'up':
			if cyberpi.is_waveup():
				return {
					'response': True,
					'result': cyberpi.get_wave_angle()
				}
			else:
				return {
					'response': True,
					'result': 0
				}
		elif params[ 0 ] == 'down':
			if cyberpi.is_wavedown():
				return {
					'response': True,
					'result': cyberpi.get_wave_angle()
				}
			else:
				return {
					'response': True,
					'result': 0
				}
		elif params[ 0 ] == 'left':
			if cyberpi.is_waveleft():
				return {
					'response': True,
					'result': cyberpi.get_wave_angle()
				}
			else:
				return {
					'response': True,
					'result': 0
				}
		elif params[ 0 ] == 'right':
			if cyberpi.is_waveright():
				return {
					'response': True,
					'result': cyberpi.get_wave_angle()
				}
			else:
				return {
					'response': True,
					'result': 0
				}
		else:
			return {
				'response': False,
				'error': 'illegal_parametrer'
			}

	def freefall( self, params ):				
		return {
			'response': True,
			'result': cyberpi.is_freefall()
		}
		
	def wavespeed( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_wave_speed()
		}
		
	def pitch( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_pitch()
		}
		
	def roll( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_roll()
		}
		
	def yaw( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_yaw()
		}
		
	def reset_yaw( self, params ):				
		cyberpi.reset_yaw()
		return {
			'response': True,
		}
		
	def acc( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_acc( params[ 0 ] )
		}
		
	def gyro( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_gyro( params[ 0 ] )
		}
		
	def rotation( self, params ):				
		return {
			'response': True,
			'result': cyberpi.get_rotation( params[ 0 ] )
		}
		
	def reset_rotation( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		cyberpi.reset_rotation( params[ 0 ] )		
		return {
			'response': True			
		}

	# mBot
	##############################################################
	def move( self, params ):
		if params[ 1 ] == 0:
			params[ 1 ] = 'null'
		cyberpi.mbot2.forward( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def go( self, params ):
		cyberpi.mbot2.straight( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def turn( self, params ):
		if params[ 0 ] == 'left':			
			cyberpi.mbot2.turn_left( params[ 1 ], params[ 2 ] )
		elif params[ 0 ] == 'right':			
			cyberpi.mbot2.turn_right( params[ 1 ], params[ 2 ] )
		else:
			return {
				'response': False,
				'error': 'illegal_parameter'
			}
		return {
			'response': True
		}

	def rotate( self, params ):
		cyberpi.mbot2.turn( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def set_speed( self, params ):
		if isinstance( params[ 1 ], str ):
			params[ 1 ] = params[ 0 ]
		cyberpi.mbot2.drive_speed( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def stop( self, params ):
		cyberpi.mbot2.EM_stop()
		return {
			'response': True
		}

	def set_wheel_power( self, params ):
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.EM_set_power( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def set_wheel_speed( self, params ):
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.EM_set_speed( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def wheel_turn( self, params ):
		if params[ 2 ] <= 0:
			params[ 2 ] = 'all'
		cyberpi.mbot2.EM_turn( params[ 0 ], params[ 1 ], params[ 2 ] )
		return {
			'response': True
		}

	def get_wheel_speed( self, params ):		
		return {
			'response': True,
			'result:': cyberpi.mbot2.EM_get_speed( params[ 0 ] )
		}

	def get_wheel_power( self, params ):		
		return {
			'response': True,
			'result:': cyberpi.mbot2.EM_get_power( params[ 0 ] )
		}

	def get_wheel_angle( self, params ):		
		return {
			'response': True,
			'result:': cyberpi.mbot2.EM_get_angle( params[ 0 ] )
		}

	def wheel_reset( self, params ):		
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		return {
			'response': True,
			'result:': cyberpi.mbot2.EM_reset_angle( params[ 0 ] )
		}

	def lock_wheel( self, params ):		
		if params[ 0 ] == 0:
			params[ 0 ] = False
		else:
			params[ 0 ] = True
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.EM_lock( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def set_motor_power( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.EM_set_power( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def get_motor_power( self, params ):				
		return {
			'response': True,
			'result': cyberpi.mbot2.EM_get_power( params[ 0 ] )
		}

	def set_motor_speed( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.EM_set_speed( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def get_motor_speed( self, params ):				
		return {
			'response': True,
			'result': cyberpi.mbot2.EM_get_speed( params[ 0 ] )
		}


	def motor_drive( self, params ):		
		cyberpi.mbot2.motor_drive( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def motor_stop( self, params ):		
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		cyberpi.mbot2.motor_drive( params[ 0 ] )
		return {
			'response': True
		}

	def servo_add_angle( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.servo_add( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def servo_set_angle( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.servo_set( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def servo_release( self, params ):		
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		cyberpi.mbot2.servo_release( params[ 0 ] )
		return {
			'response': True
		}

	def servo_drive( self, params ):		
		if params[ 1 ] < 0:
			params[ 1 ] = params[ 0 ]
		if params[ 2 ] < 0:
			params[ 2 ] = params[ 1 ]
		if params[ 3 ] < 0:
			params[ 3 ] = params[ 2 ]
		cyberpi.mbot2.servo_drive( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ] )
		return {
			'response': True
		}

	def servo_get_angle( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		return {
			'response': True,
			'result':cyberpi.mbot2.servo_get( params[ 0 ] )
		}

	def strip_on( self, params ):		
		if params[ 4 ] <= 0:
			params[ 4 ] = 'all'
		cyberpi.mbot2.led_on( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ], params[ 4 ] )
		return {
			'response': True
		}

	def strip_show( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.led_show( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def strip_move( self, params ):		
		if params[ 2 ] <= 0:
			params[ 2 ] = 'all'
		cyberpi.mbot2.led_move( params[ 0 ], params[ 1 ], params[ 2 ] )
		return {
			'response': True
		}

	def strip_off( self, params ):		
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.led_off( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def strip_add_brightness( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.led_add_bri( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def strip_set_brightness( self, params ):		
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.led_set_bri( params[ 0 ], params[ 1 ] )
		return {
			'response': True
		}

	def strip_get_brightness( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		return {
			'response': True,
			'result': cyberpi.mbot2.led_get_bri( params[ 0 ] )
		}

	def pin_write( self, params ):				
		if params[ 1 ] <= 0:
			params[ 1 ] = 'all'
		cyberpi.mbot2.write_digital( params[ 0 ], params[ 1 ] )
		return {
			'response': True			
		}

	def pin_read( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		return {
			'response': True,
			'result': cyberpi.mbot2.read_digital( params[ 0 ] )
		}

	def pin_pwm( self, params ):				
		if params[ 2 ] <= 0:
			params[ 2 ] = 'all'
		cyberpi.mbot2.set_pwm( params[ 0 ], params[ 1 ], params[ 2 ] )
		return {
			'response': True			
		}

	def pin_analog_f( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'all'
		return {
			'response': True,
			'result': cyberpi.mbot2.read_analog( params[ 0 ] )
		}

	def get_gyro( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'z'
		return {
			'response': True,
			'result': cyberpi.get_gyro( params[ 0 ] )
		}

	def get_accelerometer( self, params ):				
		if params[ 0 ] <= 0:
			params[ 0 ] = 'z'
		return {
			'response': True,
			'result': cyberpi.get_accelerometer( params[ 0 ] )
		}
