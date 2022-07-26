import * as JSONStackData from '@jsonstack/data/src/DataSet';
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
export declare type TrainingProgressCallback = ({ completion_percentage, loss, epoch, status, logs }?: TrainingProgressUpdate) => void;
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
export declare function getLocalParsedDate({ date, time_zone, dimension, }: {
    date: Date;
    time_zone: string;
    dimension: Dimensions;
}): {
    year: number;
    month: import("luxon").MonthNumbers;
    day: import("luxon").DayNumbers;
    hour: import("luxon").HourNumbers;
    minute: import("luxon").SecondNumbers;
    second: import("luxon").SecondNumbers;
    days_in_month: import("luxon").PossibleDaysInMonth;
    ordinal_day: number;
    week: import("luxon").WeekNumbers;
    weekday: import("luxon").WeekdayNumbers;
    weekend: boolean;
    origin_time_zone: string;
    start_origin_date_string: string;
    start_gmt_date_string: string;
    end_origin_date_string: string;
    end_gmt_date_string: string;
};
export declare const prettyTimeStringOutputFormat = "ccc, dd LLL yyyy TTT";
export declare const timeProperty: {
    monthly: string;
    weekly: string;
    daily: string;
    hourly: string;
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
export declare const monthNumbers: any[];
export declare const weekNumbers: any[];
export declare const dayNumbers: any[];
export declare const quarterhourNumbers: any[];
export declare const ordinalDayNumbers: any[];
export declare const hourNumbers: any[];
export declare const minuteNumbers: any[];
export declare const secondNumbers: any[];
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
    data: JSONStackData.Data;
    datum: JSONStackData.Datum;
}, { outlier_property, }?: {
    outlier_property?: string;
}): BooleanAnswer;
export declare function addMockDataToDataSet(DataSet: JSONStackData.DataSet, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: JSONStackData.Data;
    includeConstants?: boolean;
}): JSONStackData.DataSet;
export declare function removeMockDataFromDataSet(DataSet: JSONStackData.DataSet, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: JSONStackData.Data;
    includeConstants?: boolean;
}): JSONStackData.DataSet;
export declare function removeEvaluationData(evaluation: JSONStackData.Datum): JSONStackData.Datum;
