import { TrainingProgressCallback } from '../constants';
import { getModel } from '../index';
import { JML, } from '../jsonm';
import { ModelTypes } from '../model';
import { toBeWithinRange, } from '../jest.test';
expect.extend({ toBeWithinRange });

import { setBackend } from '../tensorflow_singleton';
import {setScikit} from '../scikitjs_singleton';
import * as scikit from 'scikitjs';
import * as tf from '@tensorflow/tfjs-node';

setBackend(tf);
scikit.setBackend(tf);
setScikit(scikit);

describe('basic jsonm examples',()=>{
  it('should classify iris flowers',async()=>{
    const inputs = ['sepal_length_cm','sepal_width_cm','petal_length_cm','petal_width_cm', ];
    const outputs = [ 'plant',];
    const on_progress:TrainingProgressCallback = ({ completion_percentage, loss, epoch, status, logs, defaultLog, }) => { 
      // console.log({ completion_percentage, loss, epoch, status, logs, defaultLog, })
     }
    const exampleJSON: JML = {
      type: 'ai-classification' as ModelTypes,
      inputs,
      outputs,
      on_progress,
      dataset:{
        _data_csv:'https://raw.githubusercontent.com/repetere/modelx-model/master/src/test/mock/data/iris_data.csv'
      }
    }
    const IrisModel = await getModel(exampleJSON); 
    await IrisModel.trainModel()
    const predictions = await IrisModel.predictModel({ 
      prediction_inputs:[
        { sepal_length_cm: 5.1, sepal_width_cm: 3.5, petal_length_cm: 1.4, petal_width_cm: 0.2, },
        { sepal_length_cm: 5.9, sepal_width_cm: 3.0, petal_length_cm: 5.1, petal_width_cm: 1.8, },
      ],
      // includeEvaluation:false, 
      // includeInputs:true,
    });
    const predictionMap = predictions.map(prediction=>prediction.plant)
    expect(predictionMap).toMatchObject([ 'Iris-setosa', 'Iris-virginica' ])
  }, 20000);
  it('should predict portland house prices', async()=>{
    const inputs = ['sqft','bedrooms',];
    const outputs = [ 'price',];
    const on_progress:TrainingProgressCallback = ({ completion_percentage, loss, epoch, status, logs, defaultLog, }) => { 
      // console.log({ completion_percentage, loss, epoch, status, logs, defaultLog, })
     }
    const exampleJSON: JML = {
      type: 'ai-linear-regression' as ModelTypes,
      inputs,
      outputs,
      on_progress,
      dataset:{
        _data_csv:'https://raw.githubusercontent.com/repetere/modelx-model/master/src/test/mock/data/portland_housing_data.csv'
      }
    }
    const PortlanModel = await getModel(exampleJSON); 
    await PortlanModel.trainModel()
    const predictions = await PortlanModel.predictModel({ 
      prediction_inputs:[
        { sqft: 3890, bedrooms: 3, },
        { sqft: 1000, bedrooms: 1, },
      ],
    });
    const predictionMap = predictions.map(prediction=>parseInt(prediction.price))
    expect(predictionMap[0]).toBeWithinRange(570000, 600000)
    expect(predictionMap[1]).toBeWithinRange(250000, 280000)
    // expect(predictionMap).toMatchObject([ 'Iris-setosa', 'Iris-virginica' ])
  }, 20000);
  it('should forecast retail sales',async()=>{
    // https://raw.githubusercontent.com/repetere/sample-csv-data/main/examples/forecasts/kaggle-retaildataset/sales-data-1-1.csv
    const inputs = [
      'IsHoliday', 
      // 'sum_last_1_weekly_sales'
    ];
    const outputs = [ 'Weekly_Sales',];
    const on_progress:TrainingProgressCallback = ({ completion_percentage, loss, epoch, status, logs, defaultLog, }) => { 
      // console.log({ completion_percentage, loss, epoch, status, logs, defaultLog, })
     }
    const exampleJSON: JML = {
      type: 'forecast',
      inputs,
      outputs,
      on_progress,
      dataset:{
        _data_csv:'https://raw.githubusercontent.com/repetere/sample-csv-data/main/examples/forecasts/kaggle-retaildataset/sales-data-1-1.csv'
      },
      forecast_date_format:'dd/MM/yyyy',
      // model_options:{
      //   validate_training_data: true,
      //   retrain_forecast_model_with_predictions: true,
      //   use_next_value_functions_for_training_data: true,
      //   use_mock_dates_to_fit_trainning_data: true,
      //   use_preprocessing_on_trainning_data: true,
      //   training_feature_column_options: {
      //     year: ['onehot',],
      //     month: ['onehot',],
      //     day: ['onehot',],
      //   },
      //   training_data_filter_function:(datum, datumIndex)=>{
      //     // console.log({datum, datumIndex})
      //     return datumIndex>2
      //   },
      //   prediction_timeseries_date_format:'dd/MM/yyyy',
      //   prediction_timeseries_date_feature:'Date',
      //   prediction_inputs_next_value_functions:[
      //     {
      //       variable_name: 'sum_last_1_weekly_sales',
      //       function_body: 'return state.sumPreviousRows({property:"Weekly_Sales",rows:2})',
      //     }
      //   ]
      // }
    }
    const SalesForecastModel = await getModel(exampleJSON); 
    await SalesForecastModel.trainModel({use_next_value_functions_for_training_data: true,})
    // console.log(SalesForecastModel)    
    const predictions = await SalesForecastModel.predictModel({ 
      prediction_inputs:[
        // { Date:'05/08/2011', IsHoliday: false, },
        // { Date:'06/01/2012',act:16567.69,IsHoliday:false,},
        // { Date:'13/01/2012',act:16894.4,IsHoliday:true,},
        // { Date:'20/01/2012',act:18365.1,IsHoliday:false,},
        // { Date:'27/01/2012',act:18378.16,IsHoliday:false,},
        // { Date:'03/02/2012',act:23510.49,IsHoliday:false},
        { 
          Date:'02/11/2012',
          // act:27390.81,
          IsHoliday:false
        },
        { 
          Date:'09/11/2012',
          // act:27390.81,
          IsHoliday:false
        },
      ],
      includeEvaluation:false, 
      includeInputs:true,
    });
    // console.log('predictions',predictions.map(pred=>({
    //   Date:pred.Date,
    //   act:pred.act,
    //   Weekly_Sales:pred.Weekly_Sales,
    //   IsHoliday:pred.IsHoliday,
    // })))    
    // const predictionMap = predictions.map(prediction=>prediction.plant)
    // expect(predictionMap).toMatchObject([ 'Iris-setosa', 'Iris-virginica' ])
  }, 20000);
})
