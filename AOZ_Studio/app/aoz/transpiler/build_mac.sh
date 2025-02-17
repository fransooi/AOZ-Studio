node_modules/.bin/pkg aoz.js --public-packages "btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t latest-macos -o transpiler-mac
node_modules/.bin/pkg check.js --public-packages "node-fetch" -t latest-macos -o check-darwin
echo "Done. Press enter"
read
