import * as ServerActions from './serverActions.js';
import * as DeskPageActions from './deskPageActions.js';
import * as ModalComponentGeneratorActions from './modalComponentGeneratorActions.js';
export const HANDLE_COMPILER_DONE = 'HANDLE_COMPILER_DONE';

export function handleCompilerMessage(stats){
    return (dispatch, getState) => {

        if(stats.status === 'start'){

            dispatch(ServerActions.waitServerResponse('compile'));

        } else if(stats.status === 'done') {

            const { modalComponentGenerator: { generatedComponentsCounter } } = getState();
            if(stats.errors && stats.errors.length > 0){
                stats.errors.forEach( error => {
                    dispatch(ServerActions.setServerMessage(error));
                });
            } else {
                // if something was generated hot loading is not working, so, reload entire page
                if(generatedComponentsCounter > 0){
                    dispatch(DeskPageActions.commandReloadPage());
                    dispatch(ModalComponentGeneratorActions.resetGeneratedCounter());
                }
                // get new tree, just in case if something was changed
                dispatch(
                    ServerActions.invoke('getComponentsTree', {},
                        [DeskPageActions.DATA_PROJECT_COMPONENTS_TREE]
                    )
                );
                // note stats of compilation
                dispatch({
                    type: HANDLE_COMPILER_DONE,
                    payload: { stats: stats }
                })

            }
            dispatch(ServerActions.receiveServerResponseSuccess('compile'));

        }


    }
}
