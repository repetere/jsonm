'use strict';
/*jshint expr: true*/
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const path = require('path');
const luxon = require('luxon');
const expect = require('chai').expect;
const { RepetereModel, } = require('../../../../lib/models/model_class');
const MS = require('modelscript/build/modelscript.cjs');
// const validMongoId = '5b1eca428d021f08885edbf5';
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

describe('models', function() {
  this.timeout(60000);
  describe('model_class Neural Network', () => {
    describe('Pre calculated trainning values', () => {
      const trainningData = [
        {
          input_1: 10,
          input_2: 20,
          input_3: 30,
          output_1: 100,
          output_2: 200,
        },
      ].reduce((result, datum) => {
        for (let i = 1; i <= 10; i++){
          result.push({
            input_1: 10 + (i * 10),
            input_2: 20 + (i * 10),
            input_3: 30 + (i * 10),
            output_1: 100 + (i * 10),
            output_2: 200 + (i * 10),
          });
        }
        return result;  
      }, []);
      const independentVariables = [
        // 'Tickets',
        'input_1',
        'input_2',
        'input_3',
        'previous_input_1',
        'previous2_input_1',
      ];
      const dependentVariables = [
        'output_1',
        'output_2',
      ];
      it('should calculate next value function values', async () => {
        const trainingTest = new RepetereModel({
          trainningData: trainningData,
          x_independent_features: independentVariables,
          y_dependent_labels: dependentVariables,
          next_value_functions: [
            {
              variable_name: 'previous_input_1',
              function_body: 'return state.sumPreviousRows({ property:"input_1", rows:1, })',
            },
            {
              variable_name: 'previous2_input_1',
              function_body: 'return state.sumPreviousRows({ property:"input_1", rows:2, })',
            },
          ],
        },
        {
          use_tensorflow_cplusplus: false,
        });
        const trainedModel = await trainingTest.trainModel({
          cross_validate_trainning_data: false,
          use_next_value_functions_for_training_data: true,
        });
        expect(trainedModel.DataSet.data[ 2 ].previous_input_1).to.eql(trainedModel.DataSet.data[ 1 ].input_1);
        expect(trainedModel.DataSet.data[ 2 ].previous2_input_1).to.eql(trainedModel.DataSet.data[ 1 ].input_1 + trainedModel.DataSet.data[ 0 ].input_1);
      });
      it('should filter trainning data', async () => {
        const trainingTest = new RepetereModel({
          trainningData: trainningData,
          x_independent_features: independentVariables,
          y_dependent_labels: dependentVariables,
          trainning_data_filter_function: `
          return datum.previous2_input_1>0 && datum.previous2_input_1<80`,
          next_value_functions: [
            {
              variable_name: 'previous_input_1',
              function_body: 'return state.sumPreviousRows({ property:"input_1", rows:1, })',
            },
            {
              variable_name: 'previous2_input_1',
              function_body: 'return state.sumPreviousRows({ property:"input_1", rows:2, })',
            },
          ],
        },
        {
          use_tensorflow_cplusplus: false,
        });
        const trainedModel = await trainingTest.trainModel({
          cross_validate_trainning_data: false,
          use_next_value_functions_for_training_data: true,
        });
        expect(trainedModel.DataSet.data.filter(d => d.previous2_input_1 <= 0)).to.have.lengthOf(0);
        expect(trainedModel.DataSet.data.filter(d => d.previous2_input_1 >= 80)).to.have.lengthOf(0);
      });
    });
    describe('Multiple Regression Timeseries Predictions', () => {
      it('should forecast the number of passengers', async () => {
        const csvPath = path.join(__dirname, '../../../mock/tensorflowcsv/airline-trips-sales.csv');
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
        const airlineData = await MS.csv.loadCSV(csvPath);
        const timeseriesTestEnvParameters = {
          modelDocument: {
            model_configuration: {
              model_type: 'ai-timeseries-regression-forecast',
              // model_type:'ai-classification',
              model_category: 'timeseries',
            },
          },
          trainning_options: {
            fit: {
              epochs: 100,
              batchSize: 1,
            },
            // stateful: true,
            // features: 2,
            // lookBack: 3,
          },
          trainningData: airlineData,
          trainning_feature_column_options: airlinetrainning_feature_column_options,
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
          next_value_functions: [
            {
              variable_name: 'previous_3_stops',
              function_body: 'return state.sumPreviousRows({ property:"Stops", rows:3, })',
            },
          ],
        };
        const timeseriesModelTest = new RepetereModel(timeseriesTestEnvParameters,
          {
            cross_validate_trainning_data: false,
            use_tensorflow_cplusplus: false,
          });
      
        const predictions = await timeseriesModelTest.predictModel({
          reevaluate: true,
          cross_validate_trainning_data: false,
          // fixedModel:false,
          prediction_inputs:airline_prediction_inputs,
        });
        // console.log('predictions',predictions)
        expect(predictions).to.be.an('array');
        expect(predictions).to.have.lengthOf(15);
        expect(predictions[0].previous_3_stops).to.eql(11);
        return (predictions);
      });
    });
    describe('Multiple Variable LSTM Timeseries Predictions', () => {
      it('should forecast the number of passengers', async () => {
        const csvPath = path.join(__dirname, '../../../mock/tensorflowcsv/airline-trips-sales.csv');
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
        const airlineData = await MS.csv.loadCSV(csvPath);
        const timeseriesTestEnvParameters = {
          modelDocument: {
            model_configuration: {
              model_type: 'ai-forecast',
              // model_type:'ai-classification',
              model_category: 'timeseries',
            },
          },
          trainning_options: {
            fit: {
              epochs: 50,
              batchSize: 1,
            },
            // stateful: true,
            // features: 2,
            // lookBack: 3,
          },
          trainningData: airlineData,
          trainning_feature_column_options: airlinetrainning_feature_column_options,
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
          next_value_functions: [
            {
              variable_name: 'previous_3_stops',
              function_body: 'return state.sumPreviousRows({ property:"Stops", rows:3, })',
            },
          ],
        };
        const timeseriesModelTest = new RepetereModel(timeseriesTestEnvParameters,
          {
            cross_validate_trainning_data: false,
            use_tensorflow_cplusplus: false,
          });
      
        const predictions = await timeseriesModelTest.predictModel({
          reevaluate: true,
          cross_validate_trainning_data: false,
          // fixedModel:false,
          prediction_inputs:airline_prediction_inputs,
        });
        // console.log('predictions',predictions)
        expect(predictions).to.be.an('array');
        expect(predictions).to.have.lengthOf(15);
        expect(predictions[0].previous_3_stops).to.eql(11);
        return (predictions);
      });
    });
    describe('Single Value Timeseries Predictions', () => {
      it('should forecast the number of passengers', async () => {
        const csvPath = path.join(__dirname, '../../../mock/tensorflowcsv/airline-trips-sales.csv');
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
            result[ val ] = ['scale', 'standard', ];
            return result;
          }, {});
        const airlineData = await MS.csv.loadCSV(csvPath);
        // console.log(airlineData.slice(100));
        const timeseriesTestEnvParameters = {
          modelDocument: {
            model_configuration: {
              model_type: 'ai-fast-forecast',
              // model_type:'ai-classification',
              model_category: 'timeseries',
            },
          },
          trainning_options: {
            fit: {
              epochs: 50,
              batchSize: 1,
            },
            stateful: true,
            // lookBack: 3,
          },
          trainningData: airlineData,
          trainning_feature_column_options: airlinetrainning_feature_column_options,
          x_independent_features: independentVariables,
          y_dependent_labels: dependentVariables,
          prediction_timeseries_date_feature: 'Month',
          prediction_timeseries_start_date:'1960-01',
          prediction_timeseries_end_date:'1962-12',
          // y_raw_dependent_labels:rawDependentVariables,
        };
        const timeseriesModelTest = new RepetereModel(timeseriesTestEnvParameters,
          {
            cross_validate_trainning_data: false,
            use_tensorflow_cplusplus: false,
          });
      
        const predictions = await timeseriesModelTest.predictModel({
          reevaluate: true,
          cross_validate_trainning_data: false,
          fixedModel:false,
          prediction_inputs:airline_prediction_inputs,
        });
        expect(predictions).to.be.an('array');
        expect(predictions).to.have.lengthOf(36);
        return (predictions);
      });
    });
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
            result[ val ] = ['scale', 'standard', ];
            return result;
          }, {});
        const csvPath = path.join(__dirname, '../../../mock/tensorflowcsv/boston_housing_data.csv');
        // console.log({ csvPath });
        // console.log({ bosonttrainning_feature_column_options });
        const bostonhousingData = await MS.csv.loadCSV(csvPath);
        const regressionTestEnvParameters = {
          modelDocument: {
            model_configuration: {
              model_type:'ai-regression',
              model_category:'regression',
            },
          },
          trainning_options: {
            fit: {
              epochs: 100,
              batchSize: 5,
            },
          },
          trainningData: bostonhousingData,
          trainning_feature_column_options: bosonttrainning_feature_column_options,
          x_independent_features:independentVariables,
          y_dependent_labels:dependentVariables,
        };
      
        const regressionModelTest = new RepetereModel(regressionTestEnvParameters,
          {
            cross_validate_trainning_data: true,
            use_tensorflow_cplusplus: false,
          });
        // await regressionModelTest.trainModel();
        // const modelEvaluation = await regressionModelTest.evaluateModel();
        const ranModel = await regressionModelTest.runModel({
          reevaluate: true,
        });
        // console.log(ranModel.evaluation.MEDV);
        expect(ranModel.evaluation.MEDV).to.be.an('object');
        expect(ranModel.evaluation.MEDV.rSquared).to.be.greaterThan(0.8);
        expect(ranModel.evaluation.MEDV.adjustedRSquared).to.be.greaterThan(0.8);
        expect(ranModel.evaluation.MEDV.standardError).to.be.lessThan(10);
        expect(ranModel.evaluation.MEDV.actuals.length).to.eql(ranModel.evaluation.MEDV.estimates.length);
        return (true);
      });
    });
    describe('Deep Learning Classification', () => {
      it('should classify iris flows', async () => { 
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
        const csvPath = path.join(__dirname, '../../../mock/tensorflowcsv/iris_data.csv');

        const irisData = await MS.csv.loadCSV(csvPath);
        const classificationTestEnvParameters = {
          modelDocument: {
            model_configuration: {
              model_type:'ai-classification',
              // model_type:'ai-classification',
              model_category:'classification',
            },
          },
          trainning_options: {
            fit: {
              epochs: 100,
              batchSize: 5,
            },
          },
          trainningData: irisData,
          trainning_feature_column_options: flowertrainning_feature_column_options,
          x_independent_features:independentVariables,
          y_dependent_labels:dependentVariables,
          y_raw_dependent_labels:rawDependentVariables,
        };
        const classificationModelTest = new RepetereModel(classificationTestEnvParameters,
          {
            use_tensorflow_cplusplus: false,            cross_validate_trainning_data: true,
          });
        // await classificationModelTest.trainModel();
        // const modelEvaluation = await classificationModelTest.evaluateModel();
        const ranModel = await classificationModelTest.runModel({
          reevaluate: true,
          cross_validate_trainning_data: true,
        });
        // console.log(ranModel.evaluation.plant);
        expect(ranModel.evaluation.plant).to.be.an('object');
        expect(ranModel.evaluation.plant.accuracy).to.be.greaterThan(0.8);
        expect(ranModel.evaluation.plant.actuals.length).to.eql(ranModel.evaluation.plant.estimates.length);
        return (true);
      });
    });
  });
});