
import _ from 'lodash';

export function cleanModel(model){
    if(model.props && model.props['data-umyid']){
        model.props['data-umyid'] = undefined;
        delete model.props['data-umyid'];
    }
    _.forOwn(model.props, (value, prop) => {
        if(_.isObject(value) && value.type){
            cleanModel(value);
        }
    });
    if(model.children && model.children.length > 0){
        for(let i = 0; i < model.children.length; i++){
            cleanModel(model.children[i]);
        }
    }
}


export function getModelComponentMap(model, resultMap = {}){

    resultMap[model.type] = {};

    if(model.props){
        _.forOwn(model.props, (propValue, prop) => {
            if (_.isObject(propValue) && propValue.type) {
                getModelComponentMap(propValue, resultMap);
            }
        });
    }
    if(model.children && model.children.length > 0){
        for(let i = 0; i < model.children.length; i++){
            getModelComponentMap(model.children[i], resultMap);
        }
    }
    return resultMap;
}
