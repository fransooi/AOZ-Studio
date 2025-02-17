const fs = require('fs')
const {version} = require('../package.json')

function handleError(error) {
	if (error) {
		console.error(error)
		process.exit(1)
	}
}

fs.open('./src/Version.ts', 'w', (error, fd) => {
	handleError(error)
	fs.write(fd, [`const VERSION = '${version}'`, 'export default VERSION', ''].join('\n'), error => {
		handleError(error)
	})
})
