import { createStore, applyMiddleware } from 'redux';
import thunkMiddleWare from 'redux-thunk';
import rootReducer from '../reducers';
import middleware from '../middleware/middleware.js';

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleWare,
    middleware
)(createStore);

export default function configureStore(initialState) {
    return createStoreWithMiddleware(rootReducer, initialState);
}
