pkg aoz.js --public-packages "btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t latest-linux -o transpiler-linux
pkg check.js --public-packages "node-fetch" -t latest-linux -o check-linux
echo "Done. Press enter"
read
