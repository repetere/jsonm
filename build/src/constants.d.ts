import * as ModelXDataTypes from '@modelx/data/src/DataSet';
import { DateTime, DateTimeJSOptions, DateObject } from 'luxon';
export declare enum Dimensions {
    YEARLY = "yearly",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    HOURLY = "hourly",
    DAILY = "daily",
    MINUTELY = "minutely",
    SECONDLY = "secondly"
}
export declare enum BooleanAnswer {
    UNKNOWN = -1,
    FALSE = 0,
    TRUE = 1
}
export interface ParsedDate extends DateObject {
    hour?: number;
    minute?: number;
    week?: number;
    ordinal_day?: number;
    days_in_month?: number;
    weekend?: boolean;
    quarter_hour?: number;
}
export declare type Entity = {
    [index: string]: any;
};
export declare type LuxonDateTimeAndFormat = {
    date: DateTime;
    format: string;
};
export declare function getLuxonDateTime(options: {
    time_zone?: string;
    dateObject: Date | string;
    dateFormat?: string;
}): LuxonDateTimeAndFormat;
export declare type TrainingProgressUpdate = {
    completion_percentage: number;
    loss: number;
    epoch: number;
    logs: {
        loss: number;
    };
    status: string;
    defaultLog?: boolean;
};
export declare function training_on_progress({ completion_percentage, loss, epoch, status, logs, defaultLog }: TrainingProgressUpdate): void;
export declare type TrainingProgressCallback = ({ completion_percentage, loss, epoch, status, logs }: TrainingProgressUpdate) => void;
export declare const mockDates: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    week: number;
    weekday: number;
    quarter_hour: number;
    oridinalday: number;
}[];
export declare function getPartialHour(minute: number): number;
export declare function getQuarterHour(parsedDate: ParsedDate): number;
export declare function getParsedDate(date: Date, options?: DateTimeJSOptions): ParsedDate;
export declare const prettyTimeStringOutputFormat = "ccc, dd LLL yyyy TTT";
export declare const timeProperty: {
    weekly: string;
    monthly: string;
    hourly: string;
    daily: string;
};
export declare const durationToDimensionProperty: {
    years: Dimensions;
    weeks: Dimensions;
    months: Dimensions;
    days: Dimensions;
    hours: Dimensions;
};
export declare const featureTimeProperty: {
    weekly: string;
    monthly: string;
    hourly: string;
    daily: string;
};
export declare const dateTimeProperty: {
    weekly: string;
    monthly: string;
    hourly: string;
    daily: string;
};
export declare const performanceValues: {
    monthly: number;
    weekly: number;
    daily: number;
    hourly: number;
};
export declare const ISOOptions: {
    includeOffset: boolean;
    suppressMilliseconds: boolean;
};
export declare const monthNumbers: number[];
export declare const weekNumbers: number[];
export declare const dayNumbers: number[];
export declare const quarterhourNumbers: number[];
export declare const ordinalDayNumbers: number[];
export declare const hourNumbers: number[];
export declare const minuteNumbers: number[];
export declare const secondNumbers: number[];
export declare const mockDateObject: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    week: number;
    weekday: number;
    quarter_hour: number;
    oridinalday: number;
};
export declare const dimensionDurations: string[];
export declare const flattenDelimiter = "+=+";
export declare function getOpenHour(options?: {}): BooleanAnswer;
export declare function getIsOutlier(this: {
    data: ModelXDataTypes.Data;
    datum: ModelXDataTypes.Datum;
}, { outlier_property, }?: {
    outlier_property?: string;
}): BooleanAnswer;
export declare function addMockDataToDataSet(DataSet: ModelXDataTypes.DataSet, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: ModelXDataTypes.Data;
    includeConstants?: boolean;
}): ModelXDataTypes.DataSet;
export declare function removeMockDataFromDataSet(DataSet: ModelXDataTypes.DataSet, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: ModelXDataTypes.Data;
    includeConstants?: boolean;
}): ModelXDataTypes.DataSet;
