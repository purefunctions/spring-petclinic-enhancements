import { applyMiddleware, compose, createStore, Store } from 'redux';

// Import the state interface and our combined reducers.
import { IRootState, reducers } from './store';

import reduxThunk from 'redux-thunk';


import logger from 'redux-logger';

const middlewareList = (process.env.NODE_ENV === 'development') ?
    [
        reduxThunk,
        logger
    ] :
    [
        reduxThunk,
    ];

export default function configureStore(
    // history: History,
): Store<IRootState> {

    // We'll create our store with the combined reducers and the initial Redux state that
    return createStore(
        reducers,
        compose(
            applyMiddleware(...middlewareList),
        )
    );
}
