pkg aoz.js --public-packages "checksum,child_process,btoa,chokidar,date-and-time,get-user-locale,hjson,lodash,md5,mkdirp,pngjs,read-ini-file,systeminformation,tmp" -t node14-win -o transpiler.exe
pkg check.js --public-packages "node-fetch" -t node14-win -o check-win32.exe
echo "Done. Press enter"
pause
