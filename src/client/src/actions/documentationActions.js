export const SET_PROJECT_DOCUMENT = 'SET_PROJECT_DOCUMENT';
export const CHANGE_PROJECT_DOCUMENT = 'CHANGE_PROJECT_DOCUMENT';

export function changeProjectDocument(changedMarkdown){
    return {
        type: CHANGE_PROJECT_DOCUMENT,
        payload: { changedMarkdown: changedMarkdown }
    }
}