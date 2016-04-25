import path from 'path';
import child_process from 'child_process';

const exec = child_process.exec;

function execute(cmd, workingDirPath){
    return new Promise( (resolve, reject) => {
        try{
            let child = exec(cmd, {cwd: workingDirPath},
                (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(stdout);
                    }
                });
        } catch(e){
            reject(e);
        }
    });
}

export function installPackages(pkgNames, workingDirPath){
    let oldProgress;
    return getConfigVariable('progress', workingDirPath)
        .then(result => {
            oldProgress = result;
            return setConfigVariable('progress', 'false', workingDirPath);
        })
        .then(() => {
            return execute(`npm install ${pkgNames} -S -E`, workingDirPath);
        })
        .then(() => {
            return setConfigVariable('progress', oldProgress, workingDirPath);
        });
}

export function installDefault(workingDirPath){
    let oldProgress;
    return getConfigVariable('progress', workingDirPath)
        .then(result => {
            oldProgress = result;
            return setConfigVariable('progress', 'false', workingDirPath);
        })
        .then(() => {
            return execute(`npm install`, workingDirPath);
        })
        .then(() => {
            return setConfigVariable('progress', oldProgress, workingDirPath);
        });
}

export function getConfigVariable(varName, workingDirPath){
    return execute(`npm get ${varName}`, workingDirPath)
        .catch(err => {
            console.error(err);
            return undefined;
        });
}

export function setConfigVariable(varName, varValue, workingDirPath){
    return execute(`npm set ${varName}=${varValue}`, workingDirPath)
        .catch(err => {
            console.error(err);
            return undefined;
        });
}

export function getPackageAbsolutePath(packageName, workingDir){
    return execute(`node -p "require.resolve('${packageName}/package.json')"`, workingDir)
        .then(result => {
            return path.dirname(result);
        })
        .catch(err => {
            return undefined;
        });
}
