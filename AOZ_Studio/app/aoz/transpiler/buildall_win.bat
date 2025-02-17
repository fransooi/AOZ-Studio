echo "Linux..."
pkg aoz.js --public-packages "btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t latest-linux -o transpiler-linux
pkg check.js --public-packages "node-fetch" -t latest-linux -o check-linux
echo "MacOS..."
pkg aoz.js --public-packages "btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t latest-macos -o transpiler-mac
pkg check.js --public-packages "node-fetch" -t latest-macos -o check-darwin
echo "Windows..."
pkg aoz.js --public-packages "btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t node14-win -o transpiler.exe
pkg check.js --public-packages "node-fetch" -t node14-win -o check-win32
echo "Done. Press enter"
pause
