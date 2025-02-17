const AOZCert = require( '../../aoz-cert' );
const SystemAPI = require( '../../system-api' );
const { authenticateToken, authenticate, checkSerial, getAuthorCertificate, disconnect } = require( '../../licenceChecker.js' );

const DEBUG = false

//const url_base = 'http://localhost/aoz-app'
const url_base = 'https://account.aoz.studio/app'

const urlAnd = ( url, get ) => url + ( url.includes( '?' ) ? '&' : '?' ) + get;

const postData = function( post )
{
	const pairs = []
	for ( const name in post )
	{
		pairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( post[name] ) )
	}
	return pairs.join( '&' )
}

const postForm = function( url, post, callback )
{
	if (DEBUG) console.log('licence.postForm fetch', url, postData(post))
	fetch( urlAnd( url, 'X' ), {
		body:    postData( post ),
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
		method:  'post',
		timeout: 5000
	})
	.then( response => response.text() )
	.then( text => {
		text = text.trim()
		if (DEBUG) console.log('licence.postForm response', text)
		if ( text.startsWith( '{' ) && text.endsWith( '}' ) )
		{
			callback( JSON.parse(text) )
		}
		else if ( text.startsWith( 'OK:TOKEN:[' ) && text.endsWith( ']' ) )
		{
			const token = text.substring( 10, text.length - 1 )
			callback( { status: 'ok', token: token } )
		}
		else
		{
			callback( { status: 'NO', text: text } )
		}
	})
	.catch( error => {
		callback( { status: 'NO', text: error } )
		if (DEBUG) console.error( 'aoz account authenticate fetch error', error, url, post )
	})
}

const SettingsLicence = function( settings )
{
	this.settings = settings;
	this.panel = document.createElement( 'div' );
	this.panel.setAttribute( 'class', 'cat-panel' );

	this.item = 
	{
		id: -1,
		icon: atom.IMAGES.ICON_LICENCE,
		title: atom.aozLang.getTerm( 'settings:licence' ),//'Licence',
		disabled: false
	};

	this.token = atom.aozConfig.aoz_settings.token;
}

SettingsLicence.prototype.licenceTypes = {
	'AOZE':  'Education',
	'AOZF':  'Free',
	'AOZ1':  'Starter',
	'AOZ12': 'Gold',
	'AOZ24': 'Silver',
	'AOZI':  'VIP Edition'
}

SettingsLicence.prototype.updateUI = function( status )
{
	setTimeout( function()
	{
		if( document.getElementById( 'key-state' ) && document.getElementById( 'key-state' ) != null )
		{
			if( status == 'not-connected' )
			{
				document.getElementById( 'key-state' ).style.display = 'none';
				document.getElementById( 'serial' ).style.display = 'block';
				document.getElementById( 'btnLog' ).style.display = 'inline-block';
				document.getElementById( 'btnReg' ).style.display = 'inline-block';
				document.getElementById( 'btnPwd' ).style.display = 'inline-block';
				document.getElementById( 'btnActivate' ).style.display = 'none';
				document.getElementById( 'btnLogout' ).style.display = 'none';
				document.getElementById( 'fld_uid' ).disabled = false;
				document.getElementById( 'fld_password' ).disabled = false;
			}
			
			if( status == 'connected' )
			{
				document.getElementById( 'btnLog' ).style.display = 'none';
				document.getElementById( 'btnReg' ).style.display = 'none';
				document.getElementById( 'btnPwd' ).style.display = 'none';
				document.getElementById( 'btnActivate' ).style.display = 'inline-block';
				document.getElementById( 'btnLogout' ).style.display = 'inline-block';
				document.getElementById( 'fld_uid' ).disabled = true;
				document.getElementById( 'fld_password' ).disabled = true;
			}

			if( status == 'licence-invalid' )
			{
				document.getElementById( 'key-state' ).style.display = 'none';
				document.getElementById( 'serial' ).style.display = 'block';
			}
			
			if( status == 'licence-valid' )
			{
				document.getElementById( 'key-state' ).style.display = 'block';
				document.getElementById( 'btnActivate' ).style.display = "none";	
				document.getElementById( 'serial' ).style.display = 'none';
			}
		}
	}, 500 );	
}

SettingsLicence.prototype.addStatus = function( status, vars = {} )
{
	if (DEBUG) console.log('addStatus', status)
	this.updateUI( status );
	const translation = atom.aozLang.getTerm( 'settings:' + status )
	if ( ( this.panel.txtSta.innerHTML === '...' ) || !this.panel.txtSta.innerHTML )
	{
		this.setStatus( translation, vars )
		return
	}
	this.setStatus( this.panel.txtSta.innerHTML + "<br>" + translation, vars )
};

SettingsLicence.prototype.authenticate = function( login, password )
{
	var self = this;
	self.setStatus( '...' )
	atom.licenceType = 'AOZF';
	atom.tokenChecked = false;
	atom.serialChecked = false;
	atom.authCertChecked = false;
	new AOZCert().setAuthorCertificate( '');

	authenticate( login.trim(), password.trim(), function( response )
	{
		if (DEBUG) console.log('authenticate response', response)
		if ( response.status === 'ok' )
		{
			if (DEBUG) console.log('authenticate response', response)
			if ( ( response.status === 'ok' ) && response.token )
			{
				self.addStatus( 'connected' )
				self.token = response.token;
				atom.tokenChecked =true;
				getAuthorCertificate( self.token, response.sid, function( res )
				{
					if( res.status === 'ok' )
					{
						atom.authCertChecked = true;
						if (DEBUG) console.log('author certificate status = ' + res.status);
						new AOZCert().setAuthorCertificate( res.cert );
					}
					else
					{
						if (DEBUG) console.log('author certificate status = no-certificate');
						self.addStatus( 'no-certificate' );
					}
					
					checkSerial( self.token, self.panel.serial.input.value.trim(), response.sid, function( res )
					{
						if( res.status === 'ok' )
						{
							atom.licenceType = res.type;
							atom.serialChecked = true;
							self.addStatus( 'licence-valid', { type: self.licenceTypes[ res.type ] } );
						}
						else
						{
							self.addStatus( 'licence-invalid', { type: self.licenceTypes[ res.type ] } );
						}
					
					}, function( error )
					{
						self.addStatus( 'licence-invalid', { type: self.licenceTypes[ 'AOZF' ] } );
					} );
		
				} )
			}
			else
			{
				self.addStatus( 'not-connected' );
				self.token = '';
			}

			self.validation();	
		}	
	}, function( error )
	{
		self.setStatus( '' );
		self.addStatus( 'not-connected' );
		disconnect();
	} );

	/**
	postForm(
		url_base + '/ITRocks/Framework/User/authenticate',
		{ login: login, password: password, newToken: true },
		response => {
			if (DEBUG) console.log('authenticate response', response)
			if ( ( response.status === 'ok' ) && response.token )
			{
				this.addStatus( 'connected' )
				this.token = response.token
				this.checkSerial( self.token, this.panel.serial.input.value, response.sid )
				this.getAuthorCertificate( response.sid )
			}
			else
			{
				this.addStatus( 'not-connected' )
				this.token = ''
			}
			this.validation()
		}
	)
	*/
};

SettingsLicence.prototype.authenticateToken = function( token )
{
	var self = this;
	self.setStatus( '...' );
	atom.licenceType = 'AOZF';
	atom.tokenChecked = false;
	atom.serialChecked = false;
	atom.authCertChecked = false;

	authenticateToken( token, function( response )
	{
		if (DEBUG) console.log('authenticateToken response', response)
		if ( response.status === 'ok' )
		{
			self.addStatus( 'connected' );
			atom.tokenChecked  = true;
			getAuthorCertificate( token, response.sid, function( res )
			{
				if( res.status === 'ok' )
				{
					atom.authCertChecked = true;
					if (DEBUG) console.log('author certificate status = ' + res.status);
					new AOZCert().setAuthorCertificate( res.cert );
				}
				else
				{
					if (DEBUG) console.log('author certificate status = no-certificate')
					self.addStatus( 'no-certificate' );
				}

				checkSerial( token, self.panel.serial.input.value.trim(), response.sid, function( res )
				{
					if( res.status === 'ok' )
					{
						atom.licenceType = res.type;
						atom.serialChecked = true;
						self.addStatus( 'licence-valid', { type: self.licenceTypes[ res.type ] } )
					}
					else
					{
						self.addStatus( 'licence-invalid', { type: self.licenceTypes[ res.type ] } )
					}
				
				}, function( error )
				{
					self.addStatus( 'licence-invalid', { type: self.licenceTypes[ 'AOZF' ] } );
				} );
	
			} )
		}
		else
		{
			self.addStatus( 'not-connected' )
		}
	}, function( error )
	{
		self.addStatus( 'not-connected' );
	} );

	/**
	postForm(
		url_base,
		{ checkToken: true, TOKEN: token },
		response => {
			if (DEBUG) console.log('authenticateToken response', response)
			if ( response.status === 'ok' )
			{
				this.addStatus( 'connected' )
				this.checkSerial( token, this.panel.serial.input.value, response.sid )
				this.getAuthorCertificate( response.sid )
			}
			else
			{
				this.addStatus( 'not-connected' );
			}
		}
	)
	*/
}

/**
SettingsLicence.prototype.checkSerial = function( serial_number, sid )
{
	postForm(
		url_base + '/Aoz/Account/API/checkLicence?licence=' + serial_number + '&PHPSESSID=' + sid,
		{ TOKEN: this.token },
		response => {
			if (DEBUG) console.log('checkSerial:', response)
			if ( response.status === 'ok' )
			{
				this.addStatus( 'licence-valid', { type: this.licenceTypes[ response.type ] } )
			}
			else
			{
				this.addStatus( 'licence-invalid', { type: this.licenceTypes[ response.type ] } )
			}
		}
	)
}
*/

/**
SettingsLicence.prototype.forgotPassword = function( email, password )
{
	postForm(
		url_base + '/ITRocks/Framework/User/Password/reset',
		{ email: email, password: password, password2: password },
		() => {
			this.addStatus( 'check-reset-password-email' )
		}
	)
};

SettingsLicence.prototype.getAuthorCertificate = function( sid )
{
	if (DEBUG) console.log('getAuthorCertificate')
	postForm(
		url_base + '/Aoz/Account/API/getCertificate?PHPSESSID=' + sid,
		{ TOKEN: this.token },
		response => {
			if( response.text && response.text.trim )
			{
				const text = response.text ? response.text.trim() : ''
				if (DEBUG) console.log('getAuthorCertificate response', response)
				if (text.startsWith( 'CERT:[' ) && text.endsWith( ']' ))
				{
					if (DEBUG) console.log('author certificate status = ' + text.substring( 6, text.length - 1 ))
					new AOZCert().setAuthorCertificate( text.substring( 6, text.length - 1 ) )
				}
				else
				{
					if (DEBUG) console.log('author certificate status = no-certificate')
					this.addStatus( 'no-certificate' )
				}
			}
			else if (response.cert)
			{
				if (DEBUG) console.log('author certificate response =', response)
				new AOZCert().setAuthorCertificate( response.cert )
			}
			else
			{
				if (DEBUG) console.log('author certificate status = no-certificate')
				this.addStatus( 'no-certificate' )
			}
		}
	)
}
*/

SettingsLicence.prototype.install = function()
{
	this.panel.uid = this.settings.panels.createInputText(
		{
			id: 'uid',
			label: atom.aozLang.getTerm( 'settings:user-id' )//'User ID',
		}
	);
	this.panel.appendChild( this.panel.uid );

	this.panel.password = this.settings.panels.createInputPassword(
		{
			id: 'password',
			label: atom.aozLang.getTerm( 'settings:password' )//'Password',
		}
	);
	this.panel.appendChild( this.panel.password );
	this.panel.appendChild( this.settings.panels.createRowSeparator() );

	this.panel.serial = this.settings.panels.createInputText(
		{
			id: 'serial',
			label: atom.aozLang.getTerm( 'settings:serial-key' )//'Serial Key',
		}
	);
	this.panel.appendChild( this.panel.serial );

	this.panel.keyState = document.createElement( 'div' );
	this.panel.keyState.setAttribute( 'id', 'key-state' );
	this.panel.keyState.innerHTML = '<span>' +  atom.aozLang.getTerm( 'settings:licence-activated' ) + '</span>';
	this.panel.appendChild( this.panel.keyState );

	this.panel.btnLog = document.createElement( 'button' );
	this.panel.btnLog.setAttribute( 'class', 'aoz-button' );
	this.panel.btnLog.setAttribute( 'id', 'btnLog' );
	this.panel.btnLog.innerHTML = atom.aozLang.getTerm( 'aoz-studio:login-aoz-account' );//'Login an account';
	this.panel.appendChild( this.panel.btnLog );
	this.panel.btnLog.addEventListener( 'click', () =>
	{
		this.setStatus( '' )
		if ( this.submit() )
			this.authenticate( this.panel.uid.input.value, this.panel.password.input.value )
	}, false );


	this.panel.groupLinks = document.createElement( 'div' );
	this.panel.groupLinks.setAttribute( 'id', 'groupLinks' );
	this.panel.appendChild( this.panel.groupLinks );

	this.panel.btnReg = document.createElement( 'span' );
	this.panel.btnReg.setAttribute( 'class', 'aoz-link' );
	this.panel.btnReg.setAttribute( 'id', 'btnReg' );
	this.panel.btnReg.innerHTML = atom.aozLang.getTerm( 'aoz-studio:new-aoz-account' );//'Create an account';
	this.panel.groupLinks.appendChild( this.panel.btnReg );
	this.panel.btnReg.addEventListener( 'click', () =>
	{
		let url = 'https://shop.aoz.studio/checkout';
		if( atom.aozLang.lang !== 'fr' )
		{
			url += '-en';
		}
		SystemAPI.openURLInBrowser( url );
	}, false );

	this.panel.btnKey = document.createElement( 'span' );
	this.panel.btnKey.setAttribute( 'class', 'aoz-link' );
	this.panel.btnKey.setAttribute( 'id', 'btnReg' );
	this.panel.btnKey.innerHTML = atom.aozLang.getTerm( 'settings:licence-key-lost' );//'Licence key lost';
	this.panel.groupLinks.appendChild( this.panel.btnKey );
	this.panel.btnKey.addEventListener( 'click', () =>
	{
		SystemAPI.openURLInBrowser( 'https://account.aoz.studio' );
	}, false );

	this.panel.btnPwd = document.createElement( 'span' );
	this.panel.btnPwd.setAttribute( 'class', 'aoz-link' );
	this.panel.btnPwd.setAttribute( 'id', 'btnPwd' );
	this.panel.btnPwd.innerHTML = atom.aozLang.getTerm( 'settings:password-lost' );//'Lost Password';
	this.panel.groupLinks.appendChild( this.panel.btnPwd );
	this.panel.btnPwd.addEventListener( 'click', () =>
	{
		SystemAPI.openURLInBrowser( 'https://account.aoz.studio/app/ITRocks/Framework/User/Password/reset' )
	}, false )

	this.panel.btnActivate = document.createElement( 'button' );
	this.panel.btnActivate.setAttribute( 'class', 'aoz-button' );
	this.panel.btnActivate.setAttribute( 'id', 'btnActivate' );
	this.panel.btnActivate.innerHTML = atom.aozLang.getTerm( 'settings:activate-licence' );//'Activate';
	this.panel.appendChild( this.panel.btnActivate );
	this.panel.btnActivate.addEventListener( 'click', () =>
	{
		this.setStatus( '' );
		if ( this.submit() )
			this.authenticate( this.panel.uid.input.value, this.panel.password.input.value )
	}, false )

	this.panel.btnLogout = document.createElement( 'button' );
	this.panel.btnLogout.setAttribute( 'class', 'aoz-button' );
	this.panel.btnLogout.setAttribute( 'id', 'btnLogout' );
	this.panel.btnLogout.innerHTML = atom.aozLang.getTerm( 'settings:logout' );//'Activate';
	this.panel.appendChild( this.panel.btnLogout );
	this.panel.btnLogout.addEventListener( 'click', () =>
	{
		this.setStatus( '' );
		this.addStatus( 'not-connected' );
		disconnect();
	}, false )

	this.panel.uid.input.value      = atom.aozConfig.aoz_settings.uid ? atom.aozConfig.aoz_settings.uid : '';
	this.panel.password.input.value = ''; // never store password
	this.panel.serial.input.value   = atom.aozConfig.aoz_settings.serial ? atom.aozConfig.aoz_settings.serial : '';

	this.panel.appendChild( this.settings.panels.createRowSeparator() );

	this.panel.txtSta = document.createElement( 'div' );
	this.panel.txtSta.setAttribute( 'class', 'aoz-text' );
	this.panel.txtSta.setAttribute( 'id', 'txtSta' );
	this.panel.appendChild( this.panel.txtSta );

	new AOZCert().setAuthorCertificate(
		atom.aozConfig.aoz_settings.auth_cert ? atom.aozConfig.aoz_settings.auth_cert : ''
	)
};

SettingsLicence.prototype.isVisible = function(element)
{
	while (element && (element !== this.panel))
	{
		if (window.getComputedStyle(element).display === 'none')
		{
			return false
		}
		element = element.parentElement
	}
	return true
}

SettingsLicence.prototype.beforeShow = function()
{
	this.setStatus( '' );
	if( atom.aozConfig.aoz_settings.token && atom.aozConfig.aoz_settings.token.trim() != '' )
	{
		if( atom.tokenChecked == undefined || atom.tokenChecked == false )
		{
			this.authenticateToken( atom.aozConfig.aoz_settings.token );
		}
		else
		{
			if( atom.tokenChecked == true )
			{
				this.addStatus( 'connected' );
				if( atom.aozConfig.aoz_settings.serial && atom.aozConfig.aoz_settings.serial.trim() != '' )
				{
					if( atom.serialChecked == undefined || atom.serialChecked == false )
					{
						this.authenticateToken( atom.aozConfig.aoz_settings.token );
					}
					else
					{
						if( atom.serialChecked == true )
						{
							this.addStatus( 'licence-valid', { type: this.licenceTypes[ atom.licenceType ] } );
						}
					}
				}
				else
				{
					this.addStatus( 'licence-invalid', { type: this.licenceTypes[ 'AOZF' ] } );
				}
			}
		}
	}
	else
	{
		this.setStatus( '' );
		this.addStatus( 'not-connected' );
		this.addStatus( 'licence-invalid', { type: this.licenceTypes[ 'AOZF' ] } );
		disconnect();
	}
}

SettingsLicence.prototype.setStatus = function( status, vars = {} )
{
	if (DEBUG) console.log('setStatus', status)
	for (const name in vars) if (vars.hasOwnProperty(name))
	{
		status = status.replace(':' + name, vars[name])
	}
	this.panel.txtSta.innerHTML = status
};

SettingsLicence.prototype.submit = function()
{
	const values = {}
	for (const element of this.panel.querySelectorAll('input'))
	{
		if (!this.isVisible(element)) continue
		const input = element
		const name  = element.getAttribute('name')
		const value = values[name] = input.value
		let   code  = 0
		let   error = ''
		let   what
		if (name.includes('confirm') && (value !== values[what = name.slice(8)]))
		{
			[code, error] = [
				203 + ['fld_uid', 'fld_password'].indexOf(what),
				'The confirmation ' + what.slice(4).replace('uid', 'email') + ' does not match'
			]
		}
		else if ((name !== 'fld_serial') && !value.length)
		{
			[code, error] = [
				201 + ['fld_uid', 'fld_password'].indexOf(name),
				'The ' + name.slice(4).replace('uid', 'email') + ' is missing'
			]
		}
		else if ((name === 'fld_uid') && !value.match(/.+@.+\...+/))
		{
			[code, error] = [205, 'The email address is not valid']
		}
		else if ((name === 'fld_password') && (value.length < 4))
		{
			[code, error] = [206, 'The password is too small']
		}
		if (error)
		{
			input.focus()
			error = atom.aozLang.getTerm( 'settings:' + error )
			if (error.startsWith('*settings:')) error = error.slice(10)
			this.setStatus('<strong style="color:red;">' + error + '</strong>')
			return false
		}
	}
	return true
}

SettingsLicence.prototype.validation = function()
{
	atom.aozConfig.aoz_settings.auth_cert = new AOZCert().getAuthorCertificate()
	if( atom.serialChecked )
	{
		atom.aozConfig.aoz_settings.serial = this.panel.serial.input.value.trim()
	}

	if( atom.tokenChecked )
	{
		atom.aozConfig.aoz_settings.token     = this.token
	}

	if( this.panel.uid.input.value != atom.aozConfig.aoz_settings.uid )
	{
		atom.aozConfig.aoz_settings.uid       = this.panel.uid.input.value.trim();
	}
};

module.exports = SettingsLicence;
