import { TrainingProgressCallback } from '../constants';
import { getModel } from '../index';
import { JML } from '../jsonm';
import { ModelTypes } from '../model';
import { toBeWithinRange, } from '../jest.test';
expect.extend({ toBeWithinRange });

describe('basic jsonm classification',()=>{
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
})
