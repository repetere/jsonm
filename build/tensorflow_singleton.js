let tf = null;
export function setBackend(tfInput) {
    tf = tfInput;
}
export function getBackend() {
    if (tf === null) {
        throw Error(`
============================
Howdy 👋👋. Looks like you are running @jsonstack/jsonm but you haven't set a Tensorflow backend. 
To do so, simply import (or require) your tensorflow library, and call setBackend like so,

import * as tf from '@tensorflow/tfjs';
import * as jsm from '@jsonstack/jsonm';
jsm.setBackend(tf);

That will let @jsonstack/jsonm know you wish to use a tensorflow library to perform your calculations.
============================
    `);
    }
    return tf;
}
export function createModelFitCallback(callbackFunctions) {
    const tf = getBackend();
    if (Array.isArray(callbackFunctions)) {
        return callbackFunctions;
    }
    else if (callbackFunctions) {
        return Object.keys(callbackFunctions).map((callbackFunctionName) => {
            return new tf.CustomCallback({ [callbackFunctionName]: callbackFunctions[callbackFunctionName] });
        });
    }
    else
        return [];
}
