var fs = require('fs-extra');
var path = require('path');
var _ = require('lodash');

function traverseDirTree(tree, callback){
    if(tree){
        if(tree.dirs.length > 0){
            tree.dirs.forEach(function(dir){
                callback('dir', dir);
                traverseDirTree(dir, callback);
            });
        }
        if(tree.files.length > 0){
            tree.files.forEach(function(file){
                callback('file', file);
            });
        }
    }
}

function _readDir(result, start, callback, testFileNames) {

    // Use lstat to resolve symlink if we are passed a symlink
    fs.lstat(start, function( err, stat ) {
            if (err) {
                callback(err);
            }
            var total = 0,
                processed = 0;
            var isDir = function(dirPath, fileName) {
                var abspath = path.join(dirPath, fileName);
                fs.stat(abspath, function(err, stat) {
                    if(err){
                        callback(err);
                    }
                    if (stat && stat.isDirectory()) {
                        var dirNamePath = result.dirNamePath ? result.dirNamePath + '.' + fileName : fileName;
                        var resultDir = {dirName: fileName, dirNamePath: dirNamePath, dirPath: abspath, dirs:[], files: [] };
                        result.dirs.push(resultDir);
                        _readDir(resultDir, abspath, function(err) {
                            if(err){
                                callback(err);
                            }
                            if (++processed == total) {
                                callback();
                            }
                        }, testFileNames);
                    } else {
                        var isValid = testFileNames ? _.includes(testFileNames, fileName) : true;
                        if(isValid){
                            result.files.push({
                                fileName: fileName,
                                filePath: abspath
                            });
                        }
                        if (++processed == total) {
                            callback();
                        }
                    }
                });
            };
            if (stat && stat.isDirectory()) {
                fs.readdir(start, function(err, files) {
                    if(err){
                        callback(err);
                    }
                    total = files.length;
                    if (total === 0) {
                        callback();
                    }
                    files.sort(function(a, b){
                        if (a > b) {
                            return 1;
                        }
                        if (a < b) {
                            return -1;
                        }
                        return 0;
                    });
                    for (var x = 0, l = files.length; x < l; x++) {
                        isDir(start, files[x]);
                    }
                });
            } else {
                callback("Path: " + start + " is not a directory");
            }
        }
    )
}
function readDirectory(dirPath, testFileNames, stopOnFileDir){
    return new Promise( function(resolve, reject) {
        var result = {dirs: [], files:[]};
        _readDir(result, dirPath, function(err) {
            if(err){
                reject(err);
            } else {

                traverseDirTree(result, function(type, obj){
                    if(obj.files && obj.files.length > 0){
                        obj.dirs = [];
                    }
                });
                var catalogs = {};
                var allFiles = [];
                traverseDirTree(result, function(type, obj){
                    if(type === 'dir'){
                        if(obj.files && obj.files.length > 0){
                            allFiles = allFiles.concat(obj.files.reduce(function(result, i){ return result.concat(i.filePath); }, []));
                        }
                        var files = [];
                        traverseDirTree(obj, function(_type, innerObj){
                            if(_type === 'file'){
                                files.push(innerObj.filePath);
                            }
                        });
                        if(files.length > 0){
                            var innerCatalogs = [];
                            if(obj.dirs && obj.dirs.length > 0){
                                obj.dirs.forEach(function(dir){
                                    if(dir.dirs && dir.dirs.length > 0){
                                        innerCatalogs.push(dir.dirNamePath);
                                    }
                                });
                                catalogs[obj.dirNamePath] = {
                                    dirName: obj.dirName,
                                    catalogs: innerCatalogs,
                                    files: files
                                };
                            }
                        }
                    }
                });
                catalogs.allFiles = allFiles;
                resolve(catalogs);
            }
        }, testFileNames, stopOnFileDir);
    });
}



var dirPath = '/Volumes/Development/projects/structor/structor-github/structor/src/server/test/generators';

readDirectory(dirPath, ['generator.json'], true)
    .then(function(found){
        console.log(JSON.stringify(found, null, 4));
    })
    .catch(function(err){
        console.error(err);
    });