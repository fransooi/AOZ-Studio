# #*@***************************************************************************
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
# ***************************************************************************@*/
# @file
#
# The AOZ Companion Server
# By Francois Lionet
#
# Interface between Aoz Command and Python-driven robotics and APIs
#
# @author FL
# @date first pushed on 20/01/2022
#

import uuid
import asyncio
import websockets
import json

from api_bot import Api_Bot

# Active connections
server = None
connections = { }
initial = False

# reply = f"Data recieved as:  {data}!"
#


async def handle_message ( websocket, path ):
    async for message in websocket:
        error = False
        message = json.loads ( message )

        response = None
        parameters = message.get ( 'parameters' )
        if message[ 'command' ] == 'connect':
            if checkMagic ( parameters[ 'magic' ] ):
                connection = Connection ( parameters[ 'name' ] )
                connections[ connection.handle ] = connection
                response = connection.handleMessage ( message )
            else:
                response = {
                    'id': message[ 'id' ],
                    'responseTo': message[ 'connect' ],
                    'extra': message[ 'extra' ],
                    'response': False,
                    'error': 'bad_magic'
                }

        elif message[ 'command' ] == 'disconnect':
            if connections.get ( message[ 'handle' ] ) is None:
                response = {
                    'id': message[ 'id' ],
                    'handle': message[ 'handle' ],
                    'responseTo': message[ 'command' ],
                    'extra': message[ 'extra' ],
                    'response': False,
                    'error': 'connection_not_open'
                }
            else:
                response = connections[ message[ 'handle' ] ].close ( message )

        elif response is None:
            if connections.get ( message[ 'handle' ] ) is None:
                response = {
                    'id': message[ 'id' ],
                    'handle': message[ 'handle' ],
                    'responseTo': message[ 'command' ],
                    'extra': message[ 'extra' ],
                    'response': False,
                    'error': 'connection_not_open'
                }
            else:
                response = connections[ message[ 'handle' ] ].handleMessage ( message )

        await websocket.send ( json.dumps( response ) )

class Connection:
    def __init__ ( self, name ):
        self.name = name
        self.handle = getUniqueIdentifier ( name )
        self.connected = False
        self.key = "..."
        self.apis = { }

    def handleMessage ( self, message ):
        parameters = message[ "parameters" ]
        if message[ 'command' ] == 'connect':
            print ( 'Connecting to ' + parameters.get ( 'name' ) )
            return self.getResponse ( message, {
                'response': True,
                'key': self.key
            } )

        elif message[ 'command' ] == 'security':
            if self.checkSecurity ( parameters[ 'key' ] ):
                print ( 'Connected to' + self.name )
                return self.getResponse ( message, {
                    'response': True
                } )

        elif message[ 'command' ] == 'openAPI':
            apiName = parameters[ "name" ].lower ()
            if self.apis.get ( apiName ) is not None:
                print ( 'API already open ' + apiName )
                return self.getResponse ( message, {
                    'response': False,
                    'error': 'api_already_open',
                    'parameter': apiName
                } )

            if apiName == 'bot':
                print ( 'API Open ' + apiName )
                self.apis[ apiName ] = Api_Bot ( self )
                return self.getResponse ( message, {
                    'response': True,
                    'parameter': self.apis[ apiName ].init ()
                } )

            else:
                print ( 'API not defined ' + apiName )
                return self.getResponse ( message, {
                    'response': False,
                    'error': 'api_not_defined',
                    'parameter': apiName
                } )


        elif message[ 'command' ] == 'closeAPI':
            apiName = parameters[ "name" ]
            if self.apis.get ( apiName ) is None:
                print ( 'API not opened ' + apiName )
                return self.getResponse ( message, {
                    'response': False,
                    'error': 'api_not_opened'
                } )
            self.apis[ apiName ].close ()
            self.apis.pop ( apiName )
            print ( 'API closed ' + apiName )
            return self.getResponse ( message, {
                'response': True
            } )

        elif message[ 'command' ] == 'callAPI':
            apiName = parameters[ "name" ]
            if self.apis.get ( apiName ) is None:
                return self.getResponse ( message, {
                    'response': False,
                    'error': 'api_not_opened'
                } )

            lib = self.apis.get ( apiName ).functions
            text = parameters.get ( 'command' ).strip ()
            print ( text )

            # Cut the command in pieces
            parts = [ ]
            subText = ''
            p = 0
            isFunction = False
            while p < len ( text ):
                c = text[ p ]
                p += 1
                if c == ' ' or c == ',' or c == '(' or c == ')':
                    if c == '(':
                        isFunction = True
                    if subText != '':
                        parts.append ( subText )
                        subText = ''
                elif c == '"' or c == "'":
                    cc = c
                    while p < len ( text ):
                        c = text[ p ]
                        p += 1
                        if c == cc:
                            break
                        subText += c
                else:
                    subText += c
            if subText != '':
                parts.append ( subText )

            # Try the first two ones
            first = 1
            func = None
            command = ""
            if len ( parts ) > 1:
                command = parts[ 0 ].lower () + ' ' + parts[ 1 ].lower ()
                if isFunction:
                    command += '_f'
                func = lib.get ( command )
                if func is not None:
                    first = 2
            if func is None:
                command = parts[ 0 ].lower ()
                if isFunction:
                    command += '_f'
                func = lib.get ( command )
                if func is None:
                    return self.getResponse ( message, {
                        'response': False,
                        'error': 'unknown_command'
                    } )

            # Compute the parameters
            params = [ ]
            p = func.get ( 'p' )
            defaults = func.get ( 'd' )
            for n in range ( len ( p ) ):
                c = p[ n ]
                if n >= len ( parts ) - first:
                    params.append ( defaults[ n ] )
                else:
                    if c == '0':
                        params.append ( int ( parts[ first + n ] ) )
                    elif c == '1':
                        params.append ( float ( parts[ first + n ] ) )
                    else:
                        params.append ( parts[ first + n ] )
            try:
                response = self.apis[ apiName ].callAPI ( command, params )
            except BaseException as err:
                print ( f"Unexpected {err}, {type ( err )}" )
                return self.getResponse ( message, {
                    'response': False,
                    'error': 'server_crash',
                    'parameter': err
                } )
            return self.getResponse ( message, response )

    def close ( self, message ):
        for api in self.apis:
            self.apis[ api ].close ()
        self.apis = { }
        return self.getResponse ( message, {
            'response': True
        } )

    def getResponse ( self, message, response ):
        response[ 'id' ] = message[ 'id' ]
        response[ 'handle' ] = self.handle
        response[ 'responseTo' ] = message[ 'command' ]
        response[ 'extra' ] = message[ 'extra' ]
        return response

    def checkSecurity ( self, key ):
        if key == self.key:
            return True
        return False


def getUniqueIdentifier ( name ):
    return name + '-' + str ( uuid.uuid4 () )


def checkMagic ( magic ):
    return True

async def main():
    async with websockets.serve( handle_message, "localhost", 8765 ):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    print ( 'Aoz Studio Companion server' )
    print ( 'Waiting for connection...' )
    asyncio.run(main())
