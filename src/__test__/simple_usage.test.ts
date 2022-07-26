import { TrainingProgressCallback } from '../constants';
import { getModel } from '../index';
import { JML, } from '../jsonm';
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
  it('should handle basic linear regressions', async()=>{
    const inputs = ['height',];
    const outputs = [ 'weight',];
    function on_progress({ completion_percentage, loss, epoch, status, logs, defaultLog, }) { 
    // console.log({ completion_percentage, loss, epoch, status, logs, defaultLog, })
    }
    const exampleJSON: JML = {
      type: 'regression',
      inputs,
      outputs,
      //@ts-ignore
      on_progress,
      dataset:[
        {height:61, weight:105},
        {height:62, weight:120},
        {height:63, weight:120},
        {height:65, weight:160},
        {height:65, weight:120},
        {height:68, weight:145},
        {height:69, weight:175},
        {height:70, weight:160},
        {height:72, weight:185},
        {height:75, weight:210},
      ]
    }
    const simpleModel = await getModel(exampleJSON); 
    await simpleModel.trainModel()
    const predictions = await simpleModel.predictModel( 
      [
        { height: 60, },
        { height: 71, },
        { height: 80, },
      ],
    );
    // console.log('predictions[0]',predictions[0])
    // console.log({predictions})
    // const predictionMap = predictions.map(prediction=>parseInt(prediction.price))
    expect(predictions[0].weight).toBeWithinRange(90, 110)
    expect(predictions[1].weight).toBeWithinRange(160, 180)
    expect(predictions[2].weight).toBeWithinRange(230, 250)
    // expect(predictionMap).toMatchObject([ 'Iris-setosa', 'Iris-virginica' ])

  }, 20000);
})
