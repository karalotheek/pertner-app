import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from "redux-logger";
import rootReducer from "@reducer/index";
import { composeWithDevTools } from "redux-devtools-extension";
import { MakeStore, HYDRATE, createWrapper, Context } from "next-redux-wrapper";


const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
        return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
}

const reducer = (state, action) => {
    if (action.type === HYDRATE) {
        const nextState = {
            ...state, // use previous state
            ...action.payload, // apply delta from hydration
        }
        if (state.store.storeData) nextState.store.storeData = state.store.storeData // preserve count value on client side navigation
        if (state.gender.gender) nextState.gender.gender = state.gender.gender // preserve count value on client side navigation
        return nextState
    } else {
        return rootReducer(state, action)
    }
}

// const initStore = () => {
//     return createStore(reducer, bindMiddleware([logger]))
// }

// export const wrapper = createWrapper(initStore)


export const makeStore = (context: Context) =>
    createStore(reducer, bindMiddleware([]));

export const wrapper = createWrapper(makeStore, { debug: true });
