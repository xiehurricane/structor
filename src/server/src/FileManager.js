
/*
 * Copyright 2015 Alexander Pustovalov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import _ from 'lodash';
import fs from 'fs-extra';
import path from 'path';
import zlib from 'zlib';
import tar from 'tar-fs';
import tarStream from 'tar-stream';
import * as formatter from './FileFormatter.js';

class FileManager {

    traverse(entity){
        _.forOwn(entity, (value, prop) => {
            //console.log('Prop: ' + prop + 'Value: ' + value);
        });
    }

    ensureFilePath(filePath){
        return new Promise((resolve, reject) => {
            fs.ensureFile(filePath, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    ensureDirPath(dirPath){
        return new Promise((resolve, reject) => {
            fs.ensureDir(dirPath, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    readFile(filePath){
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
                if(err){
                    reject("Can't read file: " + filePath + ". Cause: " + err.message);
                } else {
                    resolve(data);
                }
            });
        });
    }

    writeFile(filePath, fileData, format){
        return new Promise((resolve, reject) => {
            if(!fileData){
                reject('File data is undefined. File path: ' + filePath);
            }
            if(format === true){
                try{
                    fileData = formatter.formatJsFile(fileData);
                } catch(e){
                    reject(e.message + '. File path: ' + filePath);
                }
            }
            fs.writeFile(filePath, fileData, {encoding: 'utf8'}, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    writeBinaryFile(filePath, fileData){
        return new Promise((resolve, reject) => {
            if(!fileData){
                reject('File data is undefined. File path: ' + filePath);
            }
            fs.writeFile(filePath, fileData, {encoding: null}, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    placeInPosition(filePath, options){
        return this.readFile(filePath)
            .then( data => {
                if(!data){
                    throw Error('Cannot place content into file. Cause: file is empty. File path: ' + filePath);
                }
                let dataArray = data.split('');
                let inDataArray = options.text.split('');
                let args = [options.position, 0];
                args = args.concat(inDataArray);
                Array.prototype.splice.apply(dataArray, args);
                return dataArray.join('');

            })
            .then( fileData => {
                return this.writeFile(filePath, fileData, options.format);
            });
    }

    copyFiles(options){
        return options.reduce(
            (sequence, valuePair) => {
                return sequence.then(() => {
                    return this.copyFile(valuePair.srcFilePath, valuePair.destFilePath);
                });
            },
            Promise.resolve()
        );
    }

    copyFile(srcFilePath, destFilePath, rewrite = true){
        return new Promise( (resolve, reject) => {
            fs.copy(srcFilePath, destFilePath, function(err){
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    _readDir(start, callback, testFileNames) {

        // Use lstat to resolve symlink if we are passed a symlink
        fs.lstat(start, ( err, stat ) => {
                if (err) {
                    callback(err);
                }
                let found = {dirs: [], files: []},
                    total = 0,
                    processed = 0;

                let isDir = (abspath, isValid) => {
                    fs.stat(abspath, (err, stat) => {
                        if (stat && stat.isDirectory()) {
                            if (isValid === true) {
                                found.dirs.push(abspath);
                            }
                            // If we found a directory, recurse!
                            this._readDir(abspath, (err, data) => {
                                found.dirs = found.dirs.concat(data.dirs);
                                found.files = found.files.concat(data.files);
                                if (++processed == total) {
                                    callback(null, found);
                                }
                            }, testFileNames);
                        } else {
                            if (isValid === true) {
                                found.files.push(abspath);
                            }
                            if (++processed == total) {
                                callback(null, found);
                            }
                        }
                    });
                };

                // Read through all the files in this directory
                if (stat && stat.isDirectory()) {
                    fs.readdir(start, (err, files) => {
                        total = files.length;
                        if (total === 0) {
                            callback(null, found);
                        }
                        for (let x = 0, l = files.length; x < l; x++) {
                            if(testFileNames){
                                isDir(path.join(start, files[x]), _.contains(testFileNames, files[x]));
                            } else {
                                isDir(path.join(start, files[x]), true);
                            }
                        }
                    });
                } else {
                    callback("Path: " + start + " is not a directory");
                }
            }
        )
    }

    readDirectory(dirPath, testFileNames = undefined){
        return new Promise( (resolve, reject) => {
            this._readDir(dirPath, (err, found) => {
                if(err){
                    reject(err);
                } else {
                    resolve(found);
                }
            }, testFileNames);
        });
    }

    readDirectoryFlat(dirPath){

        return new Promise( (resolve, reject) => {
            fs.lstat(dirPath, (err, stat) => {
                if (err) {
                    reject(err);
                }
                var found = {files: []},
                    total = 0;

                // Read through all the files in this directory
                if (stat && stat.isDirectory()) {
                    fs.readdir(dirPath, (err, files) => {
                        total = files.length;
                        if (total === 0) {
                            resolve(found);
                        }
                        for (var x = 0, l = files.length; x < l; x++) {
                            var absPath = path.join(dirPath, files[x]);
                            fs.stat(absPath, (function(_path, _name, _x){
                                return (err, stat) => {
                                    found.files.push({
                                        name: _name,
                                        path: _path,
                                        isDirectory: stat.isDirectory()
                                    });
                                    if(_x === total - 1){
                                        resolve(found);
                                    }
                                }
                            })(absPath, files[x], x));
                        }
                    });
                } else {
                    reject("path: " + dirPath + " is not a directory");
                }

            });
        });

    }

    checkDirIsEmpty(dirPath){
        return new Promise( (resolve, reject) => {
            fs.stat(dirPath, (err, stat) => {
                if(err){
                    reject('Can not read directory. ' + err);
                } else {
                    if (stat && stat.isDirectory()) {
                        fs.readdir(dirPath, (err, files) => {
                            var total = files.length;
                            if (total === 0) {
                                resolve();
                            } else {
                                reject(dirPath + ' is not empty');
                            }
                        });
                    } else {
                        reject(dirPath + ' is not a directory');
                    }
                }
            });
        });
    }

    readJson(filePath){
        return new Promise( (resolve, reject) => {
            fs.readJson(filePath, (err, packageObj) => {
                if(err){
                    reject(err);
                } else {
                    resolve(packageObj);
                }
            });
        });
    }

    writeJson(filePath, jsonObj){
        return new Promise( (resolve, reject) => {
            fs.writeJson(filePath, jsonObj, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    removeFile(filePath){
        return new Promise( (resolve, reject) => {
            fs.remove(filePath, err => {
                if(err){
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    unpackTarGz(srcFilePath, destDirPath){
        return new Promise( (resolve, reject) => {
            fs.createReadStream(srcFilePath)
                .pipe(zlib.createGunzip())
                .pipe(tar.extract(destDirPath, { dmode: '0666', fmode: '0666' })
                    .on('finish', () => { resolve(); }))
                    .on('error', err => { reject(err); });
        });
    }

    unpackTar(srcFilePath, destDirPath){
        return new Promise( (resolve, reject) => {
            fs.createReadStream(srcFilePath)
                .pipe(tar.extract(destDirPath, { dmode: '0666', fmode: '0666' })
                    .on('finish', () => { resolve(); }))
                    .on('error', err => { reject(err); });
        });
    }

    repackTarGzOmitRootDir(srcFilePath){
        return new Promise( (resolve, reject) => {
            let destFilePathTemp = srcFilePath + '_tmp';

            let pack = tarStream.pack();
            let extract = tarStream.extract();

            extract.on('entry', function(header, stream, callback) {
                header.name = header.name.substr(header.name.indexOf('/') + 1);
                if(header.name.length > 0){
                    stream.pipe(pack.entry(header, callback));
                } else {
                    stream.resume();
                    return callback();
                }
            });

            extract.on('finish', () => {
                pack.finalize();
                resolve(destFilePathTemp);
            });

            extract.on('error', err => {
                reject(err);
            });

            fs.createReadStream(srcFilePath)
                .pipe(zlib.createGunzip())
                .pipe(extract);

            let destFile = fs.createWriteStream(destFilePathTemp);
            pack.pipe(destFile);


        });
    }

    packTarGz(srcDirPath, destFilePath, entries){
        return new Promise( (resolve, reject) => {
            let destFile = fs.createWriteStream(destFilePath);
            tar.pack(srcDirPath, {entries: entries}).pipe(zlib.createGzip()).pipe(destFile)
                .on('finish', () => { resolve(); })
                .on('error', err => { reject(err); });
        });
    }



}

export default FileManager;