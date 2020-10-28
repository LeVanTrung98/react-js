import { applyMiddleware, combineReducers, createStore } from "redux";
import { HOME } from "../reduces/home";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
const MYSTORES = combineReducers({
    HOME
});

const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(
    MYSTORES,
    composeWithDevTools(
        applyMiddleware(thunk)
    )
);

export default store;