import { ModelX, ModelTypes, EvaluateRegressionModel, EvaluateClassificationModel, } from './model';
import  { Dimensions, getIsOutlier, mockDates } from './constants';
import { DataSet, csv, } from '@jsonstack/data';
import { Faker, getData, getDatum, timeseriesSort, getMockClassification, getMockRegression, getMockTimeseries, } from './util';
import path from 'path';

import { setBackend } from './tensorflow_singleton';
import {setScikit} from './scikitjs_singleton';
import * as scikit from 'scikitjs';
import * as tf from '@tensorflow/tfjs-node';

setBackend(tf);
scikit.setBackend(tf);
setScikit(scikit);

describe('ModelX', () => {
  describe('async predictModel', () => {
    const timeseriesData = getMockTimeseries();
    it('should handle timeseries predictions', async () => {
      const { prediction_inputs, independent_variables, dependent_variables,timeseriesData:data, } = timeseriesData;
      const m1 = new ModelX({
        debug:false,
        model_type: ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        prediction_inputs,
        independent_variables,
        dependent_variables,
        training_options: {
          fit: {
            batchSize: data.length,
            epochs: 300,
          }
        },
        trainingData: data,
        next_value_functions: [
          {
            variable_name: 'type',
            function_body: 'return "withdrawal"',
          }
        ]
      });
      expect(m1.status.trained).toBe(false);
      const predictions = await m1.predictModel({ includeEvaluation: false, includeInputs: true });
      expect(m1.status.trained).toBe(true);
      expect(m1.Model.trained).toBe(true);
      // console.log({ predictions });

      // expect(predictions.length).toBe(prediction_inputs.length);
      // expect(predictions[0].input_1).toBe(prediction_inputs[0].input_1);
      // expect(predictions[0].output_1).toBeLessThanOrEqual(predictions[predictions.length - 1].output_1);
      // console.log('data.length',data.length)
    }, 15000);
  });
  //TODO: uncomment for speed
  /*
  describe('Multiple Regression Timeseries Predictions', () => {
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
        // 'Tickets',
        'Flights',
        'Stops',
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
      const timeseriesModelTest = new ModelX({
        debug:false,
        model_type:ModelTypes.TIMESERIES_REGRESSION_FORECAST,
        training_options: {
          fit: {
            epochs: 100,
            batchSize: 1,
          },
          // stateful: true,
          // features: 2,
          // lookBack: 3,
        },
        trainingData: airlineData,
        training_feature_column_options: airlinetrainning_feature_column_options,
        x_independent_features: independentVariables,
        y_dependent_labels: dependentVariables,
        // y_raw_dependent_labels:rawDependentVariables,
        
        prediction_timeseries_date_feature: 'Month',
        // prediction_timeseries_start_date: '1961-01',
        // prediction_timeseries_start_date: '1960-08',
        prediction_timeseries_start_date: '1960-01',
        // prediction_timeseries_end_date: '1960-12',
        prediction_timeseries_end_date: '1961-03',
        // prediction_timeseries_end_date: '1962-12',
        retrain_forecast_model_with_predictions:true,
        next_value_functions: [
          {
            variable_name: 'previous_3_stops',
            function_body: 'return state.sumPreviousRows({ property:"Stops", rows:3, })',
          },
        ],
      });
    
      const predictions = await timeseriesModelTest.predictModel({
        // cross_validate_training_data: false,
        // fixedModel:false,
        prediction_inputs: airline_prediction_inputs,
      });
      // console.log('predictions',predictions)
      expect(predictions).toBeInstanceOf(Array);
      expect(predictions.length).toBe(15);
      expect(predictions[0].previous_3_stops).toBe(11);
    }, 35000);
  });
  //TODO: uncomment for speed
  */
  //TODO: uncomment for speed
  /*
  describe('Multiple Variable LSTM Timeseries Predictions', () => {
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
        // 'Tickets',
        'Flights',
        'Stops',
      ];
      const dependentVariables = [
        'Passengers',
      ];
      const airlineColumns = [].concat(independentVariables, dependentVariables);
      const airlinetrainning_feature_column_options = airlineColumns
        .reduce((result, val) => {
          result[ val ] = ['scale', 'standard', ];
          return result;
        }, {});
      const airlineData = await csv.loadCSV(csvPath);
      
      const timeseriesModelTest = new ModelX({
        debug:false,

        model_type:ModelTypes.FORECAST,
        training_options: {
          fit: {
            epochs: 50,
            batchSize: 1,
          },
          // stateful: true,
          // features: 2,
          // lookBack: 3,
        },
        trainingData: airlineData,
        training_feature_column_options: airlinetrainning_feature_column_options,
        x_independent_features: independentVariables,
        y_dependent_labels: dependentVariables,
        // y_raw_dependent_labels:rawDependentVariables,
        // cross_validate_training_data: false,

        prediction_timeseries_date_feature: 'Month',
        // prediction_timeseries_start_date: '1961-01',
        // prediction_timeseries_start_date: '1960-08',
        prediction_timeseries_start_date: '1960-01',
        // prediction_timeseries_end_date: '1960-12',
        prediction_timeseries_end_date: '1961-03',
        // prediction_timeseries_end_date: '1962-12',
        next_value_functions: [
          {
            variable_name: 'previous_3_stops',
            function_body: 'return state.sumPreviousRows({ property:"Stops", rows:3, })',
          },
        ],
      });
    
      const predictions = await timeseriesModelTest.predictModel({
        retrain: true,
        // fixedModel:false,
        prediction_inputs: airline_prediction_inputs,
        
      });
      // console.log('predictions',predictions)
      expect(predictions).toBeInstanceOf(Array);
      expect(predictions.length).toBe(15);
      expect(predictions[0].previous_3_stops).toBe(11);
    },120000);
  });
  */
  //TODO: uncomment for speed
  describe('Multi-Variate Linear Regression', () => {
    it('should predict boston housing prices', async () => {
      const independentVariables = [
        'CRIM',
        'ZN',
        'INDUS',
        'CHAS',
        'NOX',
        'RM',
        'AGE',
        'DIS',
        'RAD',
        'TAX',
        'PTRATIO',
        'LSTAT',
        'B',
      ];
      const dependentVariables = [
        'MEDV',
      ];
    
      const bostonColumns = [].concat(independentVariables, dependentVariables);
      const bosonttrainning_feature_column_options = bostonColumns
        .reduce((result, val) => {
          result[val] = ['scale', 'standard',];
          return result;
        }, {});
      const csvPath = path.join(__dirname, '../manual/media/example/tensorflowcsv/boston_housing_data.csv');

      // console.log({ csvPath });
      // console.log({ bosonttrainning_feature_column_options });
      const bostonhousingData = await csv.loadCSV(csvPath);
      const regressionTestEnvParameters = {
      };
  
      const regressionModelTest = new ModelX({
        debug:false,
        model_type: ModelTypes.REGRESSION,
        training_options: {
          fit: {
            epochs: 100,
            batchSize: 5,
          },
        },
        trainingData: bostonhousingData,
        training_feature_column_options: bosonttrainning_feature_column_options,
        x_independent_features: independentVariables,
        y_dependent_labels: dependentVariables,
      });
      console.log('backend',regressionModelTest.Model.tf.getBackend())
      // await regressionModelTest.trainModel();
      // const modelEvaluation = await regressionModelTest.evaluateModel();
      const ranModel = await regressionModelTest.evaluateModel({
        // retrain: true,
      });
      // console.log('ranModel',ranModel);
      expect(typeof ranModel.MEDV).toBe('object');
      expect(ranModel.MEDV.rSquared).toBeGreaterThan(0.7);
      expect(ranModel.MEDV.adjustedRSquared).toBeGreaterThan(0.7);
      expect(ranModel.MEDV.standardError).toBeLessThan(10);
      expect(ranModel.MEDV.actuals.length).toBe(ranModel.MEDV.estimates.length);
      return (true);
    },120000);
  });
  
  describe('Deep Learning Classification', () => {
    it('should classify iris flows CLASSIFICATION', async () => {
      const independentVariables = [
        'sepal_length_cm',
        'sepal_width_cm',
        'petal_length_cm',
        'petal_width_cm',
      ];
      const dependentVariables = [
        'plant_Iris-setosa',
        'plant_Iris-versicolor',
        'plant_Iris-virginica',
      ];
      const rawDependentVariables = [
        'plant',
      ];
      const flowertrainning_feature_column_options = {
        plant: 'onehot',
      };
      const csvPath = path.join(__dirname, '../manual/media/example/tensorflowcsv/iris_data.csv');

      const irisData = await csv.loadCSV(csvPath);
      const classificationModelTest = new ModelX({
        debug:false,
        model_type: ModelTypes.CLASSIFICATION,
        training_options: {
          fit: {
            epochs: 300,
            batchSize: 20,
          },
        },
        trainingData: irisData,
        training_feature_column_options: flowertrainning_feature_column_options,
        x_independent_features: independentVariables,
        y_dependent_labels: dependentVariables,
        y_raw_dependent_labels: rawDependentVariables,
      });
      // await classificationModelTest.trainModel();
      // const modelEvaluation = await classificationModelTest.evaluateModel();
      const ClassificationEvaluation = await classificationModelTest.evaluateModel({
        // cross_validate_training_data: true,
      });
      // console.log('ClassificationEvaluation',ClassificationEvaluation);
      expect(ClassificationEvaluation.plant.accuracy).toBeGreaterThanOrEqual(0.5);
      expect(ClassificationEvaluation.plant.actuals.length).toBe(ClassificationEvaluation.plant.estimates.length);
      // return (true);
    },35000);
  });
});