import crypto from 'crypto';
const exp = Math.exp;
const ln = Math.log;
const PI = Math.PI;
const pow = Math.pow;
/**
 * This is the core function for generating entropy
 *
 * @param len number of bytes of entropy to create
 * @returns {number} A pseduo random number between 0 and 1
 *
 */
export function prng(len) {
    if (len === undefined)
        len = 16;
    var entropy = crypto.randomBytes(len);
    var result = 0;
    for (var i = 0; i < len; i++) {
        result = result + Number(entropy[i]) / Math.pow(256, (i + 1));
    }
    return result;
}
export function validate(param, type, defaultParam) {
    if (param == null && defaultParam != null)
        return defaultParam;
    switch (type) {
        // Array of 1 item or more
        case "a":
            if (!Array.isArray(param) || !param.length)
                throw new Error("Expected an array of length 1 or greater");
            return param.slice(0);
        // Integer
        case "int":
            if (param !== Number(param))
                throw new Error("A required parameter is missing or not a number");
            if (param !== Math.round(param))
                throw new Error("Parameter must be a whole number");
            if (param === Infinity)
                throw new Error("Sent 'infinity' as a parameter");
            return param;
        // Natural number
        case "n":
            if (param === undefined)
                throw new Error("You must specify how many values you want");
            if (param !== Number(param))
                throw new Error("The number of values must be numeric");
            if (param !== Math.round(param))
                throw new Error("The number of values must be a whole number");
            if (param < 1)
                throw new Error("The number of values must be a whole number of 1 or greater");
            if (param === Infinity)
                throw new Error("The number of values cannot be infinite ;-)");
            return param;
        // Valid probability
        case "p":
            if (Number(param) !== param)
                throw new Error("Probability value is missing or not a number");
            if (param > 1)
                throw new Error("Probability values cannot be greater than 1");
            if (param < 0)
                throw new Error("Probability values cannot be less than 0");
            return param;
        // Positive numbers
        case "pos":
            if (Number(param) !== param)
                throw new Error("A required parameter is missing or not a number");
            if (param <= 0)
                throw new Error("Parameter must be greater than 0");
            if (param === Infinity)
                throw new Error("Sent 'infinity' as a parameter");
            return param;
        // Look for numbers (reals)
        case "r":
            if (Number(param) !== param)
                throw new Error("A required parameter is missing or not a number");
            if (param === Infinity)
                throw new Error("Sent 'infinity' as a parameter");
            return param;
        // Non negative real number
        case "nn":
            if (param !== Number(param))
                throw new Error("A required parameter is missing or not a number");
            if (param < 0)
                throw new Error("Parameter cannot be less than 0");
            if (param === Infinity)
                throw new Error("Sent 'infinity' as a parameter");
            return param;
        // Non negative whole number (integer)
        case "nni":
            if (param !== Number(param))
                throw new Error("A required parameter is missing or not a number");
            if (param !== Math.round(param))
                throw new Error("Parameter must be a whole number");
            if (param < 0)
                throw new Error("Parameter cannot be less than zero");
            if (param === Infinity)
                throw new Error("Sent 'infinity' as a parameter");
            return param;
        // Non-empty string
        case "str":
            if (param !== String(param))
                throw new Error("A required parameter is missing or not a string");
            if (param.length === 0)
                throw new Error("Parameter must be at least one character long");
            return param;
    }
}
/**
 *
 * @param n The number of random variates to create. Must be a positive integer
 * @param alpha
 * @param rate
 * @returns {Array} Random variates array
 */
export function rgamma(n, alpha, rate) {
    // Adapted from https://github.com/mvarshney/simjs-source/ & scipy
    n = validate(n, "n");
    alpha = validate(alpha, "nn");
    rate = validate(rate, "pos", 1);
    var LOG4 = ln(4.0);
    var SG_MAGICCONST = 1.0 + ln(4.5);
    var beta = 1 / rate;
    var toReturn = [];
    for (var i = 0; i < n; i++) {
        /* Based on Python 2.6 source code of random.py.
         */
        if (alpha > 1.0) {
            var ainv = Math.sqrt(2.0 * alpha - 1.0);
            var bbb = alpha - LOG4;
            var ccc = alpha + ainv;
            while (true) {
                var u1 = prng();
                if ((u1 < 1e-7) || (u > 0.9999999)) {
                    continue;
                }
                var u2 = 1.0 - prng();
                var v = ln(u1 / (1.0 - u1)) / ainv;
                var x = alpha * exp(v);
                var z = u1 * u1 * u2;
                var r = bbb + ccc * v - x;
                if ((r + SG_MAGICCONST - 4.5 * z >= 0.0) || (r >= ln(z))) {
                    var result = x * beta;
                    break;
                }
            }
        }
        else if (alpha == 1.0) {
            var u = prng();
            while (u <= 1e-7) {
                u = prng();
            }
            var result = -ln(u) * beta;
        }
        else {
            while (true) {
                var u = prng();
                var b = (Math.E + alpha) / Math.E;
                var p = b * u;
                if (p <= 1.0) {
                    var x = Math.pow(p, 1.0 / alpha);
                }
                else {
                    var x = -ln((b - p) / alpha);
                }
                var u1 = prng();
                if (p > 1.0) {
                    if (u1 <= Math.pow(x, (alpha - 1.0))) {
                        break;
                    }
                }
                else if (u1 <= exp(-x)) {
                    break;
                }
            }
            var result = x * beta;
        }
        toReturn[i] = result;
    }
    return toReturn;
}
/**
 *
 * @param {number} n The number of random variates to create. Must be a positive integer.
 * @param {number} alpha First shape parameter
 * @param {number} beta Second shape parameter
 * @param {number} loc Location or Non-centrality parameter
 */
export function rbeta(n, alpha = 1, beta = 1, loc = 0) {
    // Uses relationship with gamma to calculate
    const toReturn = [];
    for (var i = 0; i < n; i++) {
        var g1 = rgamma(1, alpha, 1)[0];
        var g2 = rgamma(1, beta, 1)[0];
        toReturn[i] = loc + g1 / (g1 + g2);
    }
    return toReturn;
}
const probability_distributions = {
    rbeta
};
export default probability_distributions;
