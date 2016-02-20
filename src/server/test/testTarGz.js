import FileManager from '../src/FileManager.js';

const fm = new FileManager();

const srcFilePath = '/Volumes/Development/projects/umyproto/structor-github/structor/empty/__app.tar.gz';
const destDirPath = '/Volumes/Development/projects/umyproto/structor-github/structor/empty/testTemp';

fm.repackTarGzOmitRootDir(srcFilePath).then( tempFilePath => {
    console.log(tempFilePath);
    return fm.unpackTar(tempFilePath, destDirPath).then( () => {
        console.log('Finished');
    });
}).catch( err => {
    console.error(JSON.stringify(err, null, 4));
});
