/**
 * This is the core function for generating entropy
 *
 * @param len number of bytes of entropy to create
 * @returns {number} A pseduo random number between 0 and 1
 *
 */
export declare function prng(len?: number): number;
export declare function validate(param: string | number, type: string, defaultParam?: any): any;
/**
 *
 * @param n The number of random variates to create. Must be a positive integer
 * @param alpha
 * @param rate
 * @returns {Array} Random variates array
 */
export declare function rgamma(n: number, alpha: number, rate: any): any[];
/**
 *
 * @param {number} n The number of random variates to create. Must be a positive integer.
 * @param {number} alpha First shape parameter
 * @param {number} beta Second shape parameter
 * @param {number} loc Location or Non-centrality parameter
 */
export declare function rbeta(n: number, alpha?: number, beta?: number, loc?: number): any[];
declare const probability_distributions: {
    rbeta: typeof rbeta;
};
export default probability_distributions;
