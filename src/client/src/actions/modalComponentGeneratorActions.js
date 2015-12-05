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
import validator from 'validator';

import * as Utils from '../api/utils.js';
import * as UtilStore from '../api/utilStore.js';
import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';

export const SHOW_MODAL_COMPONENT_GENERATOR = 'SHOW_MODAL_COMPONENT_GENERATOR';
export const HIDE_MODAL_COMPONENT_GENERATOR = 'HIDE_MODAL_COMPONENT_GENERATOR';
export const COMPONENT_GENERATOR_START_STEP_0 = 'COMPONENT_GENERATOR_START_STEP_0';
export const COMPONENT_GENERATOR_SUBMIT_STEP_0 = 'COMPONENT_GENERATOR_SUBMIT_STEP_0';
export const COMPONENT_GENERATOR_START_STEP_1 = 'COMPONENT_GENERATOR_START_STEP_1';
export const COMPONENT_GENERATOR_SUBMIT_STEP_1 = 'COMPONENT_GENERATOR_SUBMIT_STEP_1';
export const COMPONENT_GENERATOR_START_STEP_2 = 'COMPONENT_GENERATOR_START_STEP_2';
export const COMPONENT_GENERATOR_SUBMIT_STEP_2 = 'COMPONENT_GENERATOR_SUBMIT_STEP_2';
export const COMPONENT_GENERATOR_START_STEP_3 = 'COMPONENT_GENERATOR_START_STEP_3';
export const COMPONENT_GENERATOR_SUBMIT_STEP_3 = 'COMPONENT_GENERATOR_SUBMIT_STEP_3';
export const COMPONENT_GENERATOR_RESET_GENERATED_COUNTER = 'COMPONENT_GENERATOR_RESET_GENERATED_COUNTER';

export function showModalComponentGenerator(){
    return {
        type: SHOW_MODAL_COMPONENT_GENERATOR
    }
}

export function hideModalComponentGenerator(){
    return {
        type: HIDE_MODAL_COMPONENT_GENERATOR
    }
}

export function startStep0(options){

    return (dispatch, getState) => {
        let { deskPage: { componentsTree } } = getState();
        dispatch({
            type: COMPONENT_GENERATOR_START_STEP_0,
            payload: { groupNames: _.keys(componentsTree) }
        });
    }

}

export function submitStep0(options){

    return (dispatch, getState) => {

        let errors = [];
        let { groupName: componentGroup, componentName }  = options;
        if(!componentGroup || componentGroup.length <= 0 || !validator.isAlphanumeric(componentGroup)){

            errors.push('Please enter alphanumeric value for group name');
        }
        if(!componentName || componentName.length <= 0 || !validator.isAlphanumeric(componentName)){
            errors.push('Please enter alphanumeric value for component name');
        }
        if(componentGroup === componentName){
            errors.push('Component name is equal to group name');
        }

        let { deskPage: { componentsTree } } = getState();
        var testComponent =  UtilStore.getComponentFromTree(componentsTree, componentName);
        if(testComponent.value){
            errors.push('There is already a component with name: ' + componentName);
        }

        if(errors.length > 0){
            errors.forEach( message => {
                dispatch(ServerActions.setServerMessage(message));
            });
        } else {
            // Component name must start from char in upper case
            var firstChar = componentName.charAt(0).toUpperCase();
            componentName = firstChar + componentName.substr(1);
            dispatch({
                type: COMPONENT_GENERATOR_SUBMIT_STEP_0, // store data for forms in case user steps back
                payload: {
                    groupName: componentGroup,
                    componentName: componentName
                }
            });
            dispatch(startStep1());
        }
    }
}

export function startStep1(){

    return (dispatch, getState) => {

        dispatch(
            ServerActions.invoke('getGeneratorList',
                {},
                [COMPONENT_GENERATOR_START_STEP_1]
            )
        );

    }
}

export function submitStep1(options){

    return (dispatch, getState) => {

        const { generatorName } = options;

        const state = getState();
        const { deskPage: { searchResult }, modalComponentGenerator: { groupName, componentName } } = state;
        let model = Utils.fulex(searchResult.found);
        Utils.cleanPropsUmyId(model);
        dispatch(
            ServerActions.invoke('getGenerationMetaInf',
                {
                    componentGroup: groupName,
                    componentName: componentName,
                    componentModel: model,
                    generatorName: generatorName
                },
                [COMPONENT_GENERATOR_START_STEP_2],
                { generatorName }
            )
        );
    }

}

export function startStep2(options){

    return {
        type: COMPONENT_GENERATOR_START_STEP_2,
        payload: {
        }
    }

}

export function submitStep2(options){

    return (dispatch, getState) => {
        try{
            const state = getState();
            const { deskPage: { searchResult }, modalComponentGenerator: { groupName, componentName, selectedGeneratorName } } = state;
            const metaModel = JSON.parse(options.metaModel);
            let model = Utils.fulex(searchResult.found);
            Utils.cleanPropsUmyId(model);

            dispatch(
                ServerActions.invoke('generateComponentCode',
                    {
                        componentGroup: groupName,
                        componentName: componentName,
                        componentModel: model,
                        generatorName: selectedGeneratorName,
                        meta: metaModel
                    },
                    [COMPONENT_GENERATOR_START_STEP_3],
                    {metaModel: options.metaModel}
                )
            );
        } catch(e){
            dispatch(ServerActions.setServerMessage('Error in parsing meta model: ' + e.message));
        }


        //dispatch({type: COMPONENT_GENERATOR_SUBMIT_STEP_2});

    }
}

export function startStep3(options){

    return {
        type: COMPONENT_GENERATOR_START_STEP_3
    }

}

export function submitStep3(options){

    return (dispatch, getState) => {

        const {
            deskPage: { searchResult },
            modalComponentGenerator: { componentName, componentSourceDataObject }
        } = getState();

        const isChildrenAcceptable = options.sourceCode.indexOf('this.props.children') >= 0;
        dispatch(
            ServerActions.invoke('commitComponentCode', componentSourceDataObject,
                [
                    DeskPageActions.REWRITE_MODEL_NODE,
                    HIDE_MODAL_COMPONENT_GENERATOR,
                    COMPONENT_GENERATOR_SUBMIT_STEP_3
                ],
                {
                    type: componentName,
                    children: isChildrenAcceptable ? null : [],
                    text: null
                }
            )
        );

    }
}

export function resetGeneratedCounter(){
    return {
        type: COMPONENT_GENERATOR_RESET_GENERATED_COUNTER
    }
}

