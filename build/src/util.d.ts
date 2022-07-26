import * as JSONStackDataTypes from '@jsonstack/data/src/DataSet';
import * as features from './features';
export declare type Fake = {
    [index: string]: any;
};
export declare const Faker: Fake;
export declare function randomNumber(min: number, max: number): number;
export declare function generateNumberRange(start: number, end: number): number[];
export declare function getDatum(customDate?: Date, customTransation?: {
    amount?: number;
    late_payments?: boolean;
}): {
    date: any;
    hour?: number;
    minute?: number;
    week?: number;
    ordinal_day?: number;
    days_in_month?: number;
    weekend?: boolean;
    quarter_hour?: number;
    amount: any;
    late_payments: any;
};
export declare function getData(items: number): {
    date: any;
    hour?: number;
    minute?: number;
    week?: number;
    ordinal_day?: number;
    days_in_month?: number;
    weekend?: boolean;
    quarter_hour?: number;
    amount: any;
    late_payments: any;
}[];
export declare const timeseriesSort: (a: JSONStackDataTypes.Datum, b: JSONStackDataTypes.Datum) => number;
export declare function getMockTimeseries(): {
    timeseriesData: {
        date: any;
        hour?: number;
        minute?: number;
        week?: number;
        ordinal_day?: number;
        days_in_month?: number;
        weekend?: boolean;
        quarter_hour?: number;
        amount: any;
        late_payments: any;
    }[];
    independent_variables: string[];
    dependent_variables: string[];
    input_independent_features: {
        feature_field_name: string;
        feature_field_type: features.AutoFeatureTypes;
    }[];
    prediction_inputs: {
        date: any;
        hour?: number;
        minute?: number;
        week?: number;
        ordinal_day?: number;
        days_in_month?: number;
        weekend?: boolean;
        quarter_hour?: number;
        amount: any;
        late_payments: any;
    }[];
};
export declare function getMockRegression(): {
    data: {
        input_1: number;
        input_2: number;
        input_3: number;
        ignored_1: number;
        output_1: number;
        output_2: number;
    }[];
    independent_variables: string[];
    dependent_variables: string[];
    prediction_inputs: {
        input_1: number;
        input_2: number;
        input_3: number;
        ignored_1: number;
    }[];
};
export declare function getMockClassification(): {
    data: {
        walking_noise_level: number;
        primary_sound: string;
        secondary_sound: string;
        weight: number;
        ear_style: string;
        animal: string;
    }[];
    independent_variables: string[];
    dependent_variables: string[];
    prediction_inputs: {
        walking_noise_level: number;
        primary_sound: string;
        secondary_sound: string;
        weight: number;
        ear_style: string;
    }[];
};
export declare const dataset0: {
    num: number;
    some: string;
}[];
export declare const dataset1: {
    num: number;
    some1: string;
}[];
export declare const dataset2: {
    name: string;
    data: {
        num: number;
        some2: string;
    }[];
};
export declare const dataset3: {
    data: {
        num: number;
        some3: string;
    }[];
};
export declare const dataset4: {
    name: string;
    _data_promise: () => Promise<{
        num: number;
        some4: string;
    }[]>;
};
