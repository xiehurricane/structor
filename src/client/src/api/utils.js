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

export function fulfil(obj1, obj2) {
    if (_.isArray(obj2)) {
        if (!obj1 || obj1 == null) {
            obj1 = [];
            for (let i = 0; i < obj2.length; i++) {
                obj1.push(fulfil(null, obj2[i]));
            }
        }
    } else if (_.isObject(obj2)) {
        if (!obj1) {
            obj1 = {};
        }
        let items = Object.getOwnPropertyNames(obj2);
        for (let item = 0; item < items.length; item++) {
            obj1[items[item]] = fulfil(obj1[items[item]], obj2[items[item]]);
        }
    } else {
        if (obj1 == undefined) {
            obj1 = obj2;
        }
    }
    return obj1;
}

export function fulex(obj2) {
    let obj1 = null;
    if (_.isArray(obj2)) {
        obj1 = [];
        for (let i = 0; i < obj2.length; i++) {
            obj1.push(fulex(obj2[i]));
        }
    } else if (_.isObject(obj2)) {
        obj1 = {};
        for (let item in obj2) {
            if (obj2.hasOwnProperty(item)) {
                obj1[item] = fulex(obj2[item]);
            }
        }
    } else {
        obj1 = obj2;
    }
    return obj1;
}

export function delex(obj, path) {
    let pathArray = path.split('.');
    if (pathArray.length === 1 && obj[path] !== undefined) {
        delete obj[path];
    } else {
        let tempObj = obj;
        pathArray.map(function (step, index) {
            if (index === pathArray.length - 1 && tempObj[step] !== undefined) {
                delete tempObj[step];
            } else {
                tempObj = tempObj[step];
            }
        });
    }
    return obj;
}

export function cleanex(obj2) {
    let obj1 = null;
    let tempObj = null;
    if (_.isArray(obj2)) {
        obj1 = [];
        for (let i = 0; i < obj2.length; i++) {
            tempObj = cleanex(obj2[i]);
            if (_.isObject(tempObj)) {
                if (!_.isEmpty(tempObj)) {
                    obj1.push(tempObj);
                }
            } else {
                obj1.push(tempObj);
            }
        }
    } else if (_.isObject(obj2)) {
        obj1 = {};
        for (let item in obj2) {
            if (obj2.hasOwnProperty(item)) {
                tempObj = cleanex(obj2[item]);
                if (_.isObject(tempObj)) {
                    if (!_.isEmpty(tempObj)) {
                        obj1[item] = tempObj;
                    }
                } else {
                    obj1[item] = tempObj;
                }
            }
        }
    } else {
        if (_.isObject(obj2)) {
            if (!_.isEmpty(obj2)) {
                obj1 = obj2;
            }
        } else {
            obj1 = obj2;
        }
    }
    return obj1;
}

export function isVisible(element) {
    let invisibleParent = false;
    if ($(element).css("display") === "none") {
        invisibleParent = true;
    } else {
        $(element).parents().each(function (i, el) {
            if ($(el).css("display") === "none") {
                invisibleParent = true;
                return false;
            }
            return true;
        });
    }
    return !invisibleParent;
}

export function trimComponentName(label, width = 50){
    if(label.length > width){
        label = label.substr(0, width) + '...';
    }
    return label;
}

export function setupPropsUmyId(modelItem, force) {
    modelItem.props = modelItem.props || {};
    if (!force) {
        modelItem.props['data-umyid'] = modelItem.props['data-umyid'] || _.uniqueId();
    } else {
        modelItem.props['data-umyid'] = _.uniqueId();
    }
    _.forOwn(modelItem.props, (value, prop) => {
        if (_.isObject(value) && value.type) {
            setupPropsUmyId(value, force);
        }
    });
    if (modelItem.children && modelItem.children.length > 0) {
        for (let i = 0; i < modelItem.children.length; i++) {
            setupPropsUmyId(modelItem.children[i], force);
        }
    }
}

export function cleanPropsUmyId(modelItem) {
    if (modelItem.props && modelItem.props['data-umyid']) {
        modelItem.props['data-umyid'] = undefined;
        delete modelItem.props['data-umyid'];
    }
    _.forOwn(modelItem.props, (value, prop) => {
        if (_.isObject(value) && value.type) {
            cleanPropsUmyId(value);
        }
    });
    if (modelItem.children && modelItem.children.length > 0) {
        for (let i = 0; i < modelItem.children.length; i++) {
            cleanPropsUmyId(modelItem.children[i]);
        }
    }
}

export function deleteInvalidTypeItems(modelItem, test) {
    //_.forOwn(modelItem.props, function(value, prop){
    //    if(_.isObject(value) && value.type){
    //        this.cleanPropsUmyId(value);
    //    }
    //}, this);
    let localArray = [];
    if (modelItem.children && modelItem.children.length > 0) {
        for (let i = 0; i < modelItem.children.length; i++) {
            deleteInvalidTypeItems(modelItem.children[i], test);
            if (modelItem.children[i].type && test(modelItem.children[i].type)) {
                localArray.push(modelItem.children[i]);
            }
        }
    }
    modelItem.children = localArray;
}

export function _findByPropsUmyId(modelItem, umyId, visitorCallback, parentList) {

    let _parentList = [].concat(parentList);

    if (modelItem.props && modelItem.props['data-umyid'] === umyId) {
        return true;
    } else {
        if (modelItem.props) {
            _.forOwn(modelItem.props,
                function (propValue, prop) {
                    if (_.isObject(propValue) && propValue.type) {
                        _parentList.push(modelItem);
                        if (_findByPropsUmyId(propValue, umyId, visitorCallback, _parentList)) {
                            visitorCallback({
                                found: propValue,
                                foundProp: prop,
                                parent: modelItem,
                                index: 0,
                                parentList: _parentList
                            });
                        }
                    }
                }, this);
        }
        if (modelItem.children && modelItem.children.length > 0) {
            _parentList.push(modelItem);
            for (let i = 0; i < modelItem.children.length; i++) {
                if (_findByPropsUmyId(modelItem.children[i], umyId, visitorCallback, _parentList)) {
                    visitorCallback({
                        found: modelItem.children[i],
                        foundProp: '/!#child',
                        parent: modelItem,
                        index: i,
                        parentList: _parentList
                    });
                }
            }
        }
        return false;
    }
}

/**
 *
 * @param {object} model
 * @param {function} visitorCallback
 */
export function _traverseModel(model, visitorCallback) {
    if (model.props) {
        _.forOwn(model.props,
            function (propValue, prop) {
                if (_.isObject(propValue) && propValue.type) {
                    visitorCallback({
                        found: propValue,
                        foundProp: prop
                    });
                    _traverseModel(propValue, visitorCallback);
                }
            }, this);
    }
    if (model.children && model.children.length > 0) {
        for (let i = 0; i < model.children.length; i++) {
            visitorCallback({
                found: model.children[i],
                foundProp: '/!#child'
            });
            _traverseModel(model.children[i], visitorCallback);
        }
    }
}

/**
 *
 * @param {object} model
 * @param {string} umyId
 * @returns {object}
 */
export function findByUmyId(model, umyId) {
    let items = [];
    let searchResult = null;
    if(model.pages && model.pages.length > 0){
        model.pages.forEach( (page, index) => {
            _findByPropsUmyId(page, umyId, item => {
                item.pageIndex = index;
                items.push(item);
            });
        });
    } else {
        _findByPropsUmyId(model, umyId, function (item) {
            item.pageIndex = -1;
            items.push(item);
        });
    }
    if (items.length == 1) {
        searchResult = items[0];
    } else if (items.length > 1) {
        console.error('There are multiple components with the same id: ' + umyId);
    } else {
        // do nothing
        //console.error('Component with id: ' + umyId + ' was not found');
    }
    return searchResult;
}

/**
 *
 * @param model
 * @returns {{}}
 */
export function getFlatUmyIdModel(model) {
    let flatModel = {};
    _traverseModel(model, function (item) {
        if (item.found.props && item.found.props['data-umyid']) {
            flatModel[item.found.props['data-umyid']] = {};
        }
    });
    return flatModel;
}

/**
 *
 * @param srcUmyId
 * @param destUmyId
 * @param projectModel
 * @param modifyMode
 * @returns {*}
 */
export function pasteInModelFromUmyId(srcUmyId, destUmyId, projectModel, modifyMode) {
    //
    let srcSearchResult = findByUmyId(projectModel, srcUmyId);
    let searchResult = findByUmyId(projectModel, destUmyId);
    let resultUmyId = null;
    if (searchResult && srcSearchResult) {
        let clipboard = fulex(srcSearchResult.found);
        setupPropsUmyId(clipboard, true);
        resultUmyId = clipboard.props['data-umyid'];
        let modelItem = null;
        let modelIndex = null;
        switch (modifyMode) {
            case 'addBefore':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex, 0, clipboard);
                }
                break;
            case 'insertFirst':
                modelItem = searchResult.found;
                modelItem.children = modelItem.children || [];
                modelItem.children.splice(0, 0, clipboard);
                break;
            case 'insertLast':
                modelItem = searchResult.found;
                modelItem.children = modelItem.children || [];
                modelItem.children.push(clipboard);
                break;
            case 'addAfter':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex + 1, 0, clipboard);
                }
                break;
            case 'wrap':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    //console.log(JSON.stringify(modelItem, null, 4));
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    let buffer = modelItem.children.splice(modelIndex, 1, clipboard);
                    clipboard.children = clipboard.children || [];
                    if (buffer && buffer.length > 0) {
                        clipboard.children.push(buffer[0]);
                    }
                    //console.log(JSON.stringify(modelItem, null, 4));
                    //modelItem.children.splice(modelIndex, 0, clipboard);
                }
                break;
            case 'replace':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    //console.log(JSON.stringify(modelItem, null, 4));
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex, 1, clipboard);
                    //console.log(JSON.stringify(modelItem, null, 4));
                    //modelItem.children.splice(modelIndex, 0, clipboard);
                }
                break;
            default:
                break;
        }
        //
        srcSearchResult = null;
        clipboard = null;
        searchResult = null;
        modelItem = null;
    }
    return {
        projectModel: projectModel,
        selectedUmyId: resultUmyId
    };

}

/**
 *
 * @param clipboard
 * @param destUmyId
 * @param projectModel
 * @param modifyMode
 * @returns {*}
 */
export function pasteInModelFromClipboard(clipboard, destUmyId, projectModel, modifyMode) {

    let searchResult = findByUmyId(projectModel, destUmyId);
    let resultUmyId = null;

    if (searchResult) {
        let options = fulex(clipboard);
        setupPropsUmyId(options, true);
        resultUmyId = options.props['data-umyid'];
        let modelItem = null;
        let modelIndex = null;
        switch (modifyMode) {
            case 'addBefore':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex, 0, options);
                }
                break;
            case 'insertFirst':
                modelItem = searchResult.found;
                modelItem.children = modelItem.children || [];
                modelItem.children.splice(0, 0, options);
                break;
            case 'insertLast':
                modelItem = searchResult.found;
                modelItem.children = modelItem.children || [];
                modelItem.children.push(options);
                break;
            case 'addAfter':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex + 1, 0, options);
                }
                break;
            case 'wrap':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    //console.log(JSON.stringify(modelItem, null, 4));
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    let buffer = modelItem.children.splice(modelIndex, 1, options);
                    options.children = options.children || [];
                    if (buffer && buffer.length > 0) {
                        options.children.push(buffer[0]);
                    }
                    //console.log(JSON.stringify(modelItem, null, 4));
                    //modelItem.children.splice(modelIndex, 0, clipboard);
                }
                break;
            case 'replace':
                if (searchResult.foundProp === '/!#child') {
                    modelItem = searchResult.parent;
                    modelIndex = searchResult.index;
                    modelItem.children = modelItem.children || [];
                    modelItem.children.splice(modelIndex, 1, options);
                }
                break;
            default:
                break;
        }
        //
        options = null;
        searchResult = null;
        modelItem = null;
    }
    return {
        projectModel: projectModel,
        selectedUmyId: resultUmyId
    };
}

export function moveInModel(srcUmyId, destUmyId, projectModel, modifyMode) {
    if (srcUmyId && destUmyId && projectModel && modifyMode) {
        //
        let destSearchResult = null;
        let srcSearchResult = null;
        for (let i = 0; i < projectModel.pages.length; i++) {
            if (!destSearchResult) {
                destSearchResult = findByUmyId(projectModel.pages[i], destUmyId);
            }
            if (!srcSearchResult) {
                srcSearchResult = findByUmyId(projectModel.pages[i], srcUmyId);
            }
        }
        //
        if (destSearchResult && srcSearchResult) {
            let modelItem = null;
            let modelIndex = null;
            switch (modifyMode) {
                case 'addBefore':
                    if (destSearchResult.foundProp === '/!#child') {
                        modelItem = destSearchResult.parent;
                        modelIndex = destSearchResult.index;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        modelItem.children.splice(modelIndex, 0, srcSearchResult.found);
                    }
                    break;
                case 'insertFirst':
                    modelItem = destSearchResult.found;
                    modelItem.children = modelItem.children || [];
                    srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                    modelItem.children.splice(0, 0, srcSearchResult.found);
                    break;
                case 'insertLast':
                    modelItem = destSearchResult.found;
                    modelItem.children = modelItem.children || [];
                    srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                    modelItem.children.push(srcSearchResult.found);
                    break;
                case 'addAfter':
                    if (destSearchResult.foundProp === '/!#child') {
                        modelItem = destSearchResult.parent;
                        modelIndex = destSearchResult.index;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        modelItem.children.splice(modelIndex + 1, 0, srcSearchResult.found);
                    }
                    break;
                case 'wrap':
                    if (destSearchResult.foundProp === '/!#child') {
                        modelItem = destSearchResult.parent;
                        modelIndex = destSearchResult.index;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        // the same parent component, index is decremented
                        if (srcSearchResult.parent == modelItem && modelIndex > srcSearchResult.index) {
                            modelIndex--;
                        }
                        let buffer = modelItem.children.splice(modelIndex, 1, srcSearchResult.found);
                        srcSearchResult.found.children = srcSearchResult.found.children || [];
                        if (buffer && buffer.length > 0) {
                            srcSearchResult.found.children.push(buffer[0]);
                        }
                    }
                    break;
                case 'replace':
                    if (destSearchResult.foundProp === '/!#child') {
                        modelItem = destSearchResult.parent;
                        modelIndex = destSearchResult.index;
                        modelItem.children = modelItem.children || [];
                        srcSearchResult.parent.children.splice(srcSearchResult.index, 1);
                        // the same parent component, index is decremented
                        if (srcSearchResult.parent == modelItem && modelIndex > srcSearchResult.index) {
                            modelIndex--;
                        }
                        modelItem.children.splice(modelIndex, 1, srcSearchResult.found);
                    }
                    break;
                default:
                    break;
            }
            //
            destSearchResult = null;
            srcSearchResult = null;
            modelItem = null;
            modelIndex = null;
        }
        return projectModel;
    } else {
        throw new Error('Some parameters are not set');
    }
}

export function moveUpInModel(projectModel, umyId) {

    let searchResult = findByUmyId(projectModel, umyId);
    if (searchResult
        && searchResult.foundProp === '/!#child'
        && searchResult.parent
        && searchResult.parent.children
        && searchResult.index > 0) {
        //
        searchResult.parent.children.splice(searchResult.index, 1);
        searchResult.parent.children.splice(searchResult.index - 1, 0, searchResult.found);
    }

    return projectModel;
}

export function moveDownInModel(projectModel, umyId) {

    let searchResult = findByUmyId(projectModel, umyId);
    if (searchResult
        && searchResult.foundProp === '/!#child'
        && searchResult.parent
        && searchResult.parent.children
        && searchResult.index < searchResult.parent.children.length) {
        //
        searchResult.parent.children.splice(searchResult.index, 1);
        searchResult.parent.children.splice(searchResult.index + 1, 0, searchResult.found);
    }

    return projectModel;
}

export function deleteFromModel(projectModel, umyId) {
    let searchResult = null;
    let resultUmyId = umyId;
    for (let i = 0; i < projectModel.pages.length; i++) {
        if (!searchResult) {
            searchResult = findByUmyId(projectModel.pages[i], umyId);
            if (searchResult
                && searchResult.parent == projectModel.pages[i]
                && searchResult.parent.children
                && searchResult.parent.children.length == 1) {
                //
                console.error("Can't delete the last component on the page");
                return {
                    projectModel: projectModel,
                    selectedUmyId: resultUmyId
                };
            }
        }
    }

    if (searchResult && searchResult.parent && searchResult.index >= 0) {
        let newIndex = 0;
        if(searchResult.index > 0){
            newIndex = searchResult.index - 1;
        }
        if (searchResult.foundProp && searchResult.foundProp === '/!#child') {
            searchResult.parent.children.splice(searchResult.index, 1);
        }
        if(searchResult.parent.children.length > 0){
            resultUmyId = searchResult.parent.children[newIndex].props['data-umyid'];
        } else {
            resultUmyId = searchResult.parent.props['data-umyid'];
        }
    }
    return {
        projectModel: projectModel,
        selectedUmyId: resultUmyId
    };
}

export function mergeNodeOptionsIntoModel(options, projectModel, umyId){
    let searchResult = findByUmyId(projectModel, umyId);
    if(searchResult && searchResult.found){
        searchResult.found.props = searchResult.found.props || {};
        searchResult.found.props = _.merge({}, searchResult.found.props, options);
    }
    return projectModel;
}

export function addClassNameToNode(className, projectModel, umyId){
    let searchResult = findByUmyId(projectModel, umyId);
    if(searchResult && searchResult.found){
        if(searchResult.found.props){
            if(searchResult.found.props.className){
                if(searchResult.found.props.className.indexOf(className) < 0){
                    searchResult.found.props.className += ' ' + className;
                }
            } else {
                searchResult.found.props.className = className;
            }
        } else {
            searchResult.found.props = {
                className: className
            }
        }
    }
    return projectModel;
}

export function removeClassNameFromNode(className, projectModel, umyId){
    let searchResult = findByUmyId(projectModel, umyId);
    if(searchResult && searchResult.found){
        if(searchResult.found.props){
            if(searchResult.found.props.className){
                if(searchResult.found.props.className.indexOf(className) >= 0){
                    searchResult.found.props.className = searchResult.found.props.className.replace(className, '');
                }
            }
        }
    }
    return projectModel;
}


export function removeClassNamesFromModel(classNames, model) {
    if(model.props){
        if(model.props.className){
            if(_.isArray(classNames) && classNames.length > 0){
                classNames.forEach( className => {
                    if(model.props.className.indexOf(className) >= 0){
                        model.props.className = model.props.className.replace(className, '');
                    }
                });
            }
        }
    }
    if (model.children && model.children.length > 0) {
        for (let i = 0; i < model.children.length; i++) {
            removeClassNamesFromModel(classNames, model.children[i]);
        }
    }
}

