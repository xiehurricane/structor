var path = require('path');

var pa = 'root/dir1/dir2/dir3';

var obj = path.parse(pa);

console.log(JSON.stringify(obj, null, 4));

var str = pa.substr(pa.indexOf('/') + 1);

console.log(str);