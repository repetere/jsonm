// ts-node -O {\"module\":\"commonjs\"}  src/util.ts
import * as features from './features';
import { getParsedDate, } from './constants';
import faker from 'faker';
faker.seed(0);
export const Faker = { ...faker };
export function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
export function generateNumberRange(start, end) {
    return [start].reduce((result, val) => {
        for (let i = val; i < (end + 1); i++) {
            result.push(i);
        }
        return result;
    }, []);
}
export function getDatum(customDate, customTransation = {}) {
    const transaction = Faker.helpers.createTransaction();
    const { amount, late_payments = true, } = customTransation;
    transaction.amount = parseFloat(amount || transaction.amount);
    transaction.late_payments = late_payments;
    const date = customDate || Faker.date.between(new Date('2020-01-15'), new Date('2020-04-10'));
    const parsedDate = getParsedDate(date);
    return {
        ...transaction,
        ...parsedDate,
        date,
    };
}
export function getData(items) {
    return generateNumberRange(0, items - 1).map(() => getDatum());
}
export const timeseriesSort = (a, b) => a.date.valueOf() - b.date.valueOf();
export function getMockTimeseries() {
    const timeseriesData = [
        getDatum(new Date('2020-04-04T00:00:00.000Z'), { amount: 407, late_payments: true }),
        getDatum(new Date('2020-04-05T00:00:00.000Z'), { amount: 408, late_payments: true }),
        getDatum(new Date('2020-04-06T00:00:00.000Z'), { amount: 309, late_payments: false }),
        getDatum(new Date('2020-04-07T00:00:00.000Z'), { amount: 410, late_payments: true }),
        getDatum(new Date('2020-04-08T00:00:00.000Z'), { amount: 411, late_payments: true }),
        getDatum(new Date('2020-04-09T00:00:00.000Z'), { amount: 412, late_payments: true }),
        getDatum(new Date('2020-04-10T00:00:00.000Z'), { amount: 313, late_payments: false }),
        getDatum(new Date('2020-04-11T00:00:00.000Z'), { amount: 414, late_payments: true }),
        getDatum(new Date('2020-04-12T00:00:00.000Z'), { amount: 415, late_payments: true }),
        getDatum(new Date('2020-04-13T00:00:00.000Z'), { amount: 416, late_payments: true }),
        getDatum(new Date('2020-04-14T00:00:00.000Z'), { amount: 317, late_payments: false }),
        getDatum(new Date('2020-04-15T00:00:00.000Z'), { amount: 318, late_payments: false }),
        getDatum(new Date('2020-04-16T00:00:00.000Z'), { amount: 419, late_payments: true }),
        getDatum(new Date('2020-04-17T00:00:00.000Z'), { amount: 420, late_payments: true }),
        getDatum(new Date('2020-04-18T00:00:00.000Z'), { amount: 421, late_payments: true }),
        getDatum(new Date('2020-04-19T00:00:00.000Z'), { amount: 322, late_payments: false }),
        getDatum(new Date('2020-04-20T00:00:00.000Z'), { amount: 423, late_payments: true }),
        getDatum(new Date('2020-04-21T00:00:00.000Z'), { amount: 324, late_payments: false }),
        getDatum(new Date('2020-04-22T00:00:00.000Z'), { amount: 325, late_payments: false }),
        getDatum(new Date('2020-04-23T00:00:00.000Z'), { amount: 426, late_payments: true }),
    ].sort(timeseriesSort);
    const independent_variables = [
        // 'type',
        'late_payments',
        'month',
        'day'
    ];
    const dependent_variables = ['amount'];
    const input_independent_features = [
        {
            feature_field_name: 'late_payments',
            feature_field_type: features.AutoFeatureTypes.TEXT,
        },
        // {
        //   feature_field_name: 'type',
        //   feature_field_type: features.AutoFeatureTypes.TEXT,
        // },
        {
            feature_field_name: 'month',
            feature_field_type: features.AutoFeatureTypes.TEXT,
        },
        {
            feature_field_name: 'day',
            feature_field_type: features.AutoFeatureTypes.TEXT,
        },
    ];
    const prediction_inputs = [
        getDatum(new Date('2020-04-24T00:00:00.000Z'), { late_payments: false }),
        getDatum(new Date('2020-04-25T00:00:00.000Z'), { late_payments: false }),
        getDatum(new Date('2020-04-26T00:00:00.000Z'), { late_payments: true }),
    ];
    return {
        timeseriesData,
        independent_variables,
        dependent_variables,
        input_independent_features,
        prediction_inputs,
    };
}
export function getMockRegression() {
    const data = [
        { input_1: 1, input_2: 10, input_3: 100, ignored_1: 1, output_1: 1000, output_2: 10000, },
        { input_1: 2, input_2: 20, input_3: 200, ignored_1: 2, output_1: 2000, output_2: 20000, },
        { input_1: 3, input_2: 30, input_3: 300, ignored_1: 3, output_1: 3000, output_2: 30000, },
        { input_1: 4, input_2: 40, input_3: 400, ignored_1: 4, output_1: 4000, output_2: 40000, },
        { input_1: 5, input_2: 50, input_3: 500, ignored_1: 5, output_1: 5000, output_2: 50000, },
        { input_1: 6, input_2: 60, input_3: 600, ignored_1: 6, output_1: 6000, output_2: 60000, },
        { input_1: 7, input_2: 70, input_3: 700, ignored_1: 7, output_1: 7000, output_2: 70000, },
        { input_1: 8, input_2: 80, input_3: 800, ignored_1: 8, output_1: 8000, output_2: 80000, },
        { input_1: 9, input_2: 90, input_3: 900, ignored_1: 9, output_1: 9000, output_2: 90000, },
        { input_1: 11, input_2: 110, input_3: 1100, ignored_1: 11, output_1: 11000, output_2: 110000, },
        { input_1: 12, input_2: 120, input_3: 1200, ignored_1: 12, output_1: 12000, output_2: 120000, },
        { input_1: 13, input_2: 130, input_3: 1300, ignored_1: 13, output_1: 13000, output_2: 130000, },
        { input_1: 14, input_2: 140, input_3: 1400, ignored_1: 14, output_1: 14000, output_2: 140000, },
        { input_1: 15, input_2: 150, input_3: 1500, ignored_1: 15, output_1: 15000, output_2: 150000, },
        { input_1: 16, input_2: 160, input_3: 1600, ignored_1: 16, output_1: 16000, output_2: 160000, },
        { input_1: 17, input_2: 170, input_3: 1700, ignored_1: 17, output_1: 17000, output_2: 170000, },
        { input_1: 18, input_2: 180, input_3: 1800, ignored_1: 18, output_1: 18000, output_2: 180000, },
        { input_1: 19, input_2: 190, input_3: 1900, ignored_1: 19, output_1: 19000, output_2: 190000, },
    ];
    const independent_variables = [
        'input_1',
        'input_2',
        'input_3',
    ];
    const dependent_variables = [
        'output_1',
        'output_2',
    ];
    const prediction_inputs = [
        { input_1: 5, input_2: 50, input_3: 500, ignored_1: 5, },
        { input_1: 10, input_2: 100, input_3: 1000, ignored_1: 10, },
        { input_1: 15, input_2: 150, input_3: 1500, ignored_1: 15, },
        { input_1: 20, input_2: 200, input_3: 2000, ignored_1: 20, },
        { input_1: 40, input_2: 400, input_3: 4000, ignored_1: 40, },
    ];
    return {
        data,
        independent_variables,
        dependent_variables,
        prediction_inputs,
    };
}
export function getMockClassification() {
    const data = [
        { walking_noise_level: 2, primary_sound: 'yip', secondary_sound: 'growl', weight: 10, ear_style: 'pointy', animal: 'dog', },
        { walking_noise_level: 4, primary_sound: 'bark', secondary_sound: 'growl', weight: 25, ear_style: 'floppy', animal: 'dog', },
        { walking_noise_level: 1, primary_sound: 'meow', secondary_sound: 'pur', weight: 12, ear_style: 'pointy', animal: 'cat', },
        { walking_noise_level: 8, primary_sound: 'bark', secondary_sound: 'growl', weight: 50, ear_style: 'pointy', animal: 'dog', },
        { walking_noise_level: 2, primary_sound: 'meow', secondary_sound: 'growl', weight: 15, ear_style: 'pointy', animal: 'cat', },
        { walking_noise_level: 2, primary_sound: 'yip', secondary_sound: 'pur', weight: 15, ear_style: 'pointy', animal: 'cat', },
        { walking_noise_level: 2, primary_sound: 'meow', secondary_sound: 'pur', weight: 15, ear_style: 'pointy', animal: 'cat', },
        { walking_noise_level: 1, primary_sound: 'yip', secondary_sound: 'growl', weight: 25, ear_style: 'floppy', animal: 'dog', },
        { walking_noise_level: 2, primary_sound: 'pur', secondary_sound: 'growl', weight: 15, ear_style: 'pointy', animal: 'cat', },
    ];
    const prediction_inputs = [
        { walking_noise_level: 4, primary_sound: 'bark', secondary_sound: 'growl', weight: 25, ear_style: 'floppy', },
        { walking_noise_level: 1, primary_sound: 'meow', secondary_sound: 'pur', weight: 9, ear_style: 'pointy', },
    ];
    const independent_variables = [
        'walking_noise_level',
        'primary_sound',
        'secondary_sound',
        'weight',
        'ear_style',
    ];
    const dependent_variables = [
        'animal',
    ];
    return {
        data,
        independent_variables,
        dependent_variables,
        prediction_inputs,
    };
}
/*
describe('Single Value Timeseries Predictions', () => {
  it('should forecast the number of passengers', async () => {
    const csvPath = path.join(__dirname, '../manual/media/example/tensorflowcsv/airline-trips-sales.csv');

    const airline_prediction_inputs = [
      {
        Month: '1960-01',
        Flights: 47,
        Stops: 4,
        Tickets: 417,
      },
      {
        Month: '1960-02',
        Flights: 31,
        Stops: 3,
        Tickets: 391,
      },
      {
        Month: '1960-03',
        Flights: 49,
        Stops: 4,
        Tickets: 419,
      },
      {
        Month: '1960-04',
        Flights: 41,
        Stops: 4,
        Tickets: 461,
      },
      {
        Month: '1960-05',
        Flights: 42,
        Stops: 4,
        Tickets: 472,
      },
      {
        Month: '1960-06',
        Flights: 55,
        Stops: 5,
        Tickets: 535,
      },
      {
        Month: '1960-07',
        Flights: 62,
        Stops: 6,
        Tickets: 622,
      },///
      {
        Month: '1960-08',
        Flights: 66,
        Stops: 6,
        Tickets: 606,
      },
      {
        Month: '1960-09',
        Flights: 58,
        Stops: 5,
        Tickets: 508,
      },
      {
        Month: '1960-10',
        Flights: 41,
        Stops: 4,
        Tickets: 461,
      },
      {
        Month: '1960-11',
        Flights: 30,
        Stops: 3,
        Tickets: 390,
      },
      {
        Month: '1960-12',
        Flights: 42,
        Stops: 4,
        Tickets: 432,
      },
      {
        Month: '1961-01',
        Flights: 47,
        Stops: 4,
        Tickets: 427,
      },
      {
        Month: '1961-02',
        Flights: 41,
        Stops: 4,
        Tickets: 401,
      },
      {
        Month: '1961-03',
        Flights: 49,
        Stops: 4,
        Tickets: 429,
      },
    ];

    const independentVariables = [
      'Passengers',
    ];
    const dependentVariables = [
      'Passengers',
    ];
    const airlineColumns = [].concat(independentVariables, dependentVariables);
    const airlinetrainning_feature_column_options = airlineColumns
      .reduce((result, val) => {
        result[val] = ['scale', 'standard',];
        return result;
      }, {});
    const airlineData = await csv.loadCSV(csvPath);
    // console.log(airlineData.slice(100));
    const timeseriesTestEnvParameters = {
      modelDocument: {
        model_configuration: {
          model_type: 'ai-fast-forecast',
          // model_type:'ai-classification',
          model_category: 'timeseries',
        },
      },
      
    };
    const timeseriesModelTest = new ModelX({
      model_type:ModelTypes.FAST_FORECAST,
      training_options: {
        fit: {
          epochs: 50,
          batchSize: 1,
        },
        stateful: true,
        // lookBack: 3,
      },
      trainingData: airlineData,
      training_feature_column_options: airlinetrainning_feature_column_options,
      x_independent_features: independentVariables,
      y_dependent_labels: dependentVariables,
      prediction_timeseries_date_feature: 'Month',
      prediction_timeseries_start_date: '1960-01',
      prediction_timeseries_end_date: '1962-12',
      // y_raw_dependent_labels:rawDependentVariables,
    });

    const predictions = await timeseriesModelTest.predictModel({
      retrain: true,
      // cross_validate_training_data: false,
      // fixedModel: false,
      prediction_inputs: airline_prediction_inputs,
    });
    // console.log({ predictions });
    expect(predictions).toBeInstanceOf('array');
    expect(predictions.length).toBe(36);
  });
});
*/ 
