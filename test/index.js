import { createStore, combineReducers, applyMiddleware } from 'redux';
import { reduxActionSpy, addSpy, removeSpy, SPY_ALL } from '../src/index';

const reducer = (state = {}, action) => {
    switch (action.type) {
        default:
            return state;
    };
};

const testAction = () => {
    return {
        type: 'TEST_ACTION',
    };
};
