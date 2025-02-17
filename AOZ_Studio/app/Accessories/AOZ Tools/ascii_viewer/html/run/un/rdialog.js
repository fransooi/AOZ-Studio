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
 * AOZ Runtume
 *
 * Banks.
 *
 * @author BB (Baptiste Bideaux)
 * @date first pushed on 28/02/2018
 */
function Dialog( aoz )
{
	this.aoz = aoz;
	this.utilities = aoz.utilities;
	this.manifest = aoz.manifest;
    var self = this;

    this.blackMask = document.createElement( 'div' );
    this.blackMask.setAttribute( 'class', 'black-mask' );
    document.body.appendChild( this.blackMask );

    this.dialogPanel = document.createElement( 'div' );
    this.dialogPanel.setAttribute( 'class', 'dialog-panel' );
    
    this.dialogText = document.createElement( 'span' );
    this.dialogText.setAttribute( 'class', 'dialog-text' );
    
    this.dialogButton = document.createElement( 'button' );
    this.dialogButton.setAttribute( 'class', 'dialog-button' );
    this.dialogButton.innerHTML = 'OK';
    this.dialogButton.addEventListener( 'click', function( e )
    {
        e.preventDefault();
        self.hide();
    }, false)


    this.dialogPanel.appendChild( this.dialogText );
    this.dialogPanel.appendChild( this.dialogButton );
    document.body.appendChild( this.dialogPanel );

    this.show = function( type, message, file, line, column )
    {
        this.dialogText.innerHTML = message;
        this.blackMask.style.display = 'block';
        this.dialogPanel.setAttribute( 'class', 'dialog-panel dialog-' + type );       
        this.dialogPanel.style.display = 'block';

        var elm = document.getElementsByClassName( "cmdBar" );
        if( elm && elm.length > 0 )
        {
            elm[ 0 ].style.zIndex = 5000;
        }

        var elm = document.getElementsByClassName( "stop_icon" );
        if( elm && elm.length > 0 )
        {
            elm[ 0 ].style.display = 'none';
        }

        var elm = document.getElementsByClassName( "play_icon" );
        if( elm && elm.length > 0 )
        {
            elm[ 0 ].style.display = 'inline-block';
        }        
    }

    this.hide = function()
    {
        this.dialogText.innerHTML = '';
        this.blackMask.style.display = 'none';
        this.dialogPanel.setAttribute( 'class', 'dialog-panel' );       
        this.dialogPanel.style.display = 'none';
    }
}

