const ADD_SPY = '_reduxActionSpy/ADD_SPY';
const REMOVE_SPY = '_reduxActionSpy/REMOVE_SPY';
const SPY_ALL = '_reduxActionSpy/SPY_ALL';

const addSpy = (action, callBack) => {
    return {
        type: ADD_SPY,
        payload: {
            action,
            callBack,
        },
    };
};

const removeSpy = (action) => {
    return {
        type: REMOVE_SPY,
        payload: {
            action,
        },
    };
};

/**
 * Dispatches an action if the action being monitored is dispatched.
 * @param {String | [String]} action The action, or array of actions, to monitor.
 * @param {Function} callBack Action creator.
 */
const reduxActionSpy = () => {
    let watch = {};

    return store => next => action => {
        const monitorAction = (action) => {
            const monitor = watch[action];

            if (monitor) {
                monitor.callBack();
            };
        };

        const add = ({ action, callBack }) => {
            if (typeof callBack !== 'object') {
                return new Error('Expected options to be an object!')
            }
            if (typeof action !== 'string' && !(action instanceof Array)) {
                return new Error('Expected action to be a string or an array!');
            };
            if (typeof callBack !== 'object' && typeof callBack !== 'function') {
                return new Error('Expected callBack to be an object or a function that returns an object!');
            };

            const monitor = { action, callBack };

            const addAction = (action) => {
                if (typeof action !== 'string') {
                    return new Error('Expected action to be a string')
                }
                watch[action] = monitor
            };

            if (action instanceof Array) {
                action.forEach((a) => {
                    addAction(a)
                });
            } else {
                addAction(action)
            };

        };

        const remove = (action) => {
            let monitor = watch[action]
            if (monitor) {
                delete watch[action];
            };
        };

        if (action.type === REMOVE_SPY && action.payload.action) {
            if (action.payload.action instanceof Array) {
                action.payload.action.forEach((a) => {
                    remove(a)
                })
            } else {
                remove(action.payload.action)
            }
        }

        if (action.type === ADD_SPY && action.payload.action) {
            let { payload } = action
            add(action.payload)
        }

        monitorAction(action.type);
        monitorAction(SPY_ALL);

        return next(action);
    };
};

module.exports = {
    reduxActionSpy,
    addSpy,
    removeSpy,
    SPY_ALL
}
