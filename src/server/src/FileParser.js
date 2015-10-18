
import _ from 'lodash';
import esprima from 'esprima-fb';

// Executes visitor on the object and its children (recursively).
export function traverse(object, visitor) {

    visitor(object);

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            let child = object[key];
            if (typeof child === 'object' && child !== null) {
                traverse(child, visitor);
            }
        }
    }
}

export function getFileAst(fileData){
    //console.log(fileData);
    let result = null;
    try{
        result = esprima.parse(fileData, {tolerant: true, range: true, comment: true});
    } catch(e){
        throw Error('Can not parse file, error: ' + e.message);
    }
    return result;
}

export function validateSourceCode(fileData){
    try{
        esprima.parse(fileData, { tolerant: true });
    } catch(e){
        throw Error('File is not valid, error: ' + e.message);
    }
}

