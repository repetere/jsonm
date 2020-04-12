import * as ModelXDataTypes from '@modelx/data/src/DataSet';
export declare type Fake = {
    [index: string]: any;
};
export declare const Faker: Fake;
export declare function randomNumber(min: number, max: number): number;
export declare function generateNumberRange(start: number, end: number): number[];
export declare function getDatum(customDate?: Date, customTransation?: {
    amount?: number;
    late_payments?: boolean;
}): any;
export declare function getData(items: number): any[];
export declare const timeseriesSort: (a: ModelXDataTypes.Datum, b: ModelXDataTypes.Datum) => number;
