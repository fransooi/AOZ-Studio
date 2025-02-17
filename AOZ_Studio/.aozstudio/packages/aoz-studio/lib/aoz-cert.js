const AOZIO = require('./aoz-io.js')
const FS    = require( 'fs' )

const DEBUG = false

let author_certificate = undefined

//const url_base = 'http://localhost/aoz-app'
const url_base = 'https://account.aoz.studio/app'

const urlAnd = ( url, get ) => url + ( url.includes( '?' ) ? '&' : '?' ) + get;

const postData = function( post )
{
	const pairs = []
	for ( const name in post ) {
		pairs.push( encodeURIComponent( name ) + '=' + encodeURIComponent( post[name] ) )
	}
	return pairs.join( '&' ).replace( '/%20/g', '+' )
}

const postForm = function( url, post, callback )
{
	if (DEBUG) console.log('cert.postForm fetch', url, postData(post))
	fetch( urlAnd( url, 'X' ), {
		body:    postData( post ),
		headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
		method:  'post'
	})
		.then(
			response => response.text()
		)
		.then( text => {
			text = text.trim()
			if (DEBUG) console.log('cert.postForm response', text)
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
			console.error( 'aoz account authenticate fetch error', error, url, post )
		})
}

module.exports = class Certificates
{

	getApplicationCertificate( path, then )
	{
		if (DEBUG) console.log('getApplicationCertificate', path)
		const settings_path  = AOZIO.getDirectoryString( path ) + '/settings'
		const cert_file_path = settings_path + '/' + 'cert.hjson'
		if ( FS.existsSync( cert_file_path ) ) {
			const buffer = FS.readFileSync( cert_file_path ).toString()
			const index1 = buffer.indexOf( "application: ") + 12
			const index2 = buffer.indexOf( "\n", index1 )
			then( buffer.substring( index1, index2 ).trim() )
			return
		}
		let application_name = AOZIO.cleanPath( path )
		application_name = application_name.substring( 0, application_name.lastIndexOf( '/' ) )
		application_name = application_name.substring( application_name.lastIndexOf( '/' ) + 1 )
		if (DEBUG) console.log('- application name', application_name)
		postForm(
			url_base + '/Aoz/Account/API/getAppCertificate',
			{ name: application_name, TOKEN: atom.aozConfig.aoz_settings.token },
			response =>
			{
				const text = response.text ? response.text.trim() : ''
				if (DEBUG) console.log('- application certificate response', response)
				if ( (!text.startsWith( 'CERT:[' ) || !text.endsWith( ']' )) && !response.cert )
				{
					then()
					return
				}
				if ( !FS.existsSync ( settings_path )) {
					FS.mkdirSync( settings_path )
				}
				const application_certificate = response.cert
					? response.cert
					: text.substring( 6, text.length - 1 )
				FS.writeFileSync( cert_file_path, 'application: ' + application_certificate + "\n" )
				if (DEBUG) console.log('> application_certificate =', application_certificate)
				then( application_certificate )
			}
		)
	}

	include( path, then )
	{
		const db_js = this.needed( path )
		if ( !db_js )
		{
			then()
			return
		}
		this.getApplicationCertificate( path, ( application_certificate = '' ) =>
		{
			let   buffer = FS.readFileSync(db_js).toString()
			const index0 = buffer.indexOf('this.manifest=')
			const index1 = buffer.indexOf(';', index0) + 1
			const index2 = buffer.indexOf("\n", index1)
			const code   = ''
				+ (
					application_certificate
						? "const pc=atob('" + btoa(application_certificate) + "');"
						: "const pc='';"
				)
				+ (
					author_certificate
						? "const tc=atob('" + btoa(author_certificate) + "');"
						: "const tc='';"
				)
			buffer = buffer.substring(0, index1) + code + buffer.substring(index2)
			FS.writeFileSync(db_js, buffer)
			if (DEBUG) console.log('  application certificate written', application_certificate)
			if (DEBUG) console.log('  author certificate written', author_certificate)

			if ( !author_certificate ) {
				then( 'Could not get your author certificate. Please connect to your AOZ account.' )
			}
			else if ( !application_certificate ) {
				then( 'Could not get your application certificate. Please contact the AOZ support.' )
			}
			else {
				then()
			}
		})
	}

	/**
	 * Look into your AOZ source code if it needs certificates
	 *
	 * @returns string if string is not empty : the full path to the account.js transpiled file
	 */
	needed( path )
	{
		try
		{
			const directory = AOZIO.getDirectoryString( path ) + '/html/run'
			const run_files = FS.readdirSync( directory )
			const db_files  = run_files.filter( file => file.match( /^v\d+_\d+_db\.js$/ ) )
			if ( db_files.length )
			{
				return directory + '/' + db_files[0]
			}
		}
		catch
		{
		}
		return ''
	}

	getAuthorCertificate()
	{
		return author_certificate
	}

	setAuthorCertificate( certificate )
	{
		if (DEBUG) console.log('setAuthorCertificate', certificate)
		author_certificate = certificate
	}

}
