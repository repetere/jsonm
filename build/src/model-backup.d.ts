declare const periodic: any;
declare const luxon: any;
declare const flatten: any;
declare const Promisie: any;
declare const scripts: any;
declare const MS: any;
declare const TS: any;
declare const ISOOptions: {
    includeOffset: boolean;
    suppressMilliseconds: boolean;
};
declare const ConfusionMatrix: any;
declare const logger: any;
declare let use_tensorflow_cplusplus: boolean;
declare const CONSTANTS: any;
declare const Outlier: any;
declare const performanceValues: any, prettyTimeStringOutputFormat: any, timeProperty: any, dateTimeProperty: any, featureTimeProperty: any, durationToDimensionProperty: any;
declare const dimensionDates: {
    monthly: any;
    weekly: any;
    daily: any;
    hourly: any;
};
declare const dimensionDurations: string[];
declare const flattenDelimiter = "+=+";
declare function addMockDataToDataSet(DataSet: any, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: never[] | undefined;
    includeConstants?: boolean | undefined;
}): any;
declare function removeMockDataToDataSet(DataSet: any, { mockEncodedData, includeConstants, }: {
    mockEncodedData?: never[] | undefined;
    includeConstants?: boolean | undefined;
}): any;
declare function removeEvaluationData(evaluation: any): any;
declare function isClosedOnDay(options: any): any;
declare function getOpenHour(options: any): number;
declare function getIsOutlier({ outlier_property, }: {
    outlier_property: any;
}): 1 | -1 | (() => number);
declare function sumPreviousRows(options: any): any;
declare function getLocalParsedDate(options: any): {
    year: any;
    month: any;
    day: any;
    hour: any;
    minute: any;
    second: any;
    days_in_month: any;
    ordinal_day: any;
    week: any;
    weekday: any;
    weekend: boolean;
    origin_time_zone: any;
    start_origin_date_string: any;
    start_gmt_date_string: any;
    end_origin_date_string: any;
    end_gmt_date_string: any;
};
declare class RepetereModel {
    static getModelMap(modelType: any): any;
    static getDateFunctionFromFormat(format: any): any;
    static getLuxonDateTime(options: any): {
        date: any;
        format: string;
    };
    constructor(parameters?: {}, options?: {});
    evaluateClassificationAccuracy(options?: {}): {
        accuracy: any;
        matrix: any;
        labels: any;
        actuals: any;
        estimates: any;
    };
    evaluateRegressionAccuracy(options?: {}): {
        standardError: any;
        rSquared: any;
        adjustedRSquared: any;
        actuals: any;
        estimates: any;
        meanForecastError: any;
        meanAbsoluteDeviation: any;
        trackingSignal: any;
        meanSquaredError: any;
        meanAbsolutePercentageError: any;
        accuracyPercentage: number;
        metric: string;
        reason: string;
        originalMeanAbsolutePercentageError: any;
    };
    getTimeseriesDimension(options: any): {
        dimension: any;
        dateFormat: any;
    };
    getForecastDates(options?: {}): any;
    getCrosstrainingData(options?: {}): {
        test: any;
        train: any;
    };
    setClosedPredictionValues({ dimension, is_location_open, date, predictionMatrix, }: {
        dimension: any;
        is_location_open: any;
        date?: string | undefined;
        predictionMatrix: any;
    }): any;
    addMockData({ use_mock_dates, }: {
        use_mock_dates?: boolean | undefined;
    }): void;
    removeMockData({ use_mock_dates, }: {
        use_mock_dates?: boolean | undefined;
    }): void;
    validatetrainingData({ cross_validate_trainning_data, inputMatrix, }: {
        cross_validate_trainning_data: any;
        inputMatrix: any;
    }): void;
    validateTimeseriesData(options?: {}): Promise<{
        forecastDates: any;
        forecastDateFirstDataSetDateIndex: any;
        lastOriginalForecastDate: any;
        raw_prediction_inputs: any;
        dimension: any;
        datasetDates: any;
    }>;
    checkTrainingStatus(options?: {}): Promise<boolean>;
    getDataSetProperties(options?: {}): Promise<void>;
    gettrainingData(options?: {}): Promise<void>;
    getPredictionData(options?: {}): Promise<any>;
    trainModel(options?: {}): Promise<this>;
    retrainTimeseriesModel(options?: {}): Promise<this>;
    evaluateModel(options?: {}): Promise<any>;
    timeseriesForecast(options?: {}): Promise<any[]>;
    predictModel(options?: {}): Promise<any>;
    runModel(options?: {}): Promise<{
        model: any;
        evaluation: any;
    }>;
}
