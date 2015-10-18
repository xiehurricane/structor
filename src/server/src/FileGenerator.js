
import _ from 'lodash';
import FileManager from './FileManager.js';
import * as formatter from './FileFormatter.js';

class FileGenerator {

    constructor(){
        this.fileManager = new FileManager();
    }

    generateFile(destFilePath, templateFilePath, templateData){

        return this.fileManager.readFile(templateFilePath)
            .then( templateFile => {
                const tpl = _.template(templateFile);
                let data = tpl(templateData);
                if(destFilePath.indexOf('.js', destFilePath.length - 3) !== -1 ||
                    destFilePath.indexOf('.jsx', destFilePath.length - 4) !== -1){
                    data = formatter.formatJsFile(data);
                }
                return data;

            }).then( data => {
                return this.fileManager.ensureFilePath(destFilePath).then(() => { return data; });
            }).then( data => {
                return this.fileManager.writeFile(destFilePath, data);
            });
    }
}

export default FileGenerator;
