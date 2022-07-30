# JSONM
[![Coverage Status](https://coveralls.io/repos/github/repetere/jsonm/badge.svg?branch=main)](https://coveralls.io/github/repetere/jsonm?branch=main) [![Build, Test, Release](https://github.com/repetere/jsonm/actions/workflows/release.yml/badge.svg)](https://github.com/repetere/jsonm/actions/workflows/release.yml)

## Description

**JSONM** is a module that creates Tensorflow models with JSON.

### Jump right in

JSONM is designed so software engineers and machine learning engineers can quickly build, train, save, and load Tensorflow based AI & ML Models. The JSONM Library includes a JSONM UMD module with batteries included so you can use JSONM in the browser without transpilers or any additional setup/configuration. The JSONM UMD is ideal for JAMstack Applications.

### Usage

The idea behind JSONM is to enable rapid model development. JSONM attempts to automate the data pre-processing and feature engineering needed for most modeling tasks. 

Data Scientists who are more comfortable finely tuning hyperparameters and controlling pre-processing, scaling and normalization of datasets can also configure JSONM to meet specific model requirements.

### What's included
JSONM currently supports the following models
- General purpose multivariate based predictions
- Multivariate linear regression based predictions
- General purpose multivariate classification based descriptions
- General purpose multivariate timeseries based forecasts
- General purpose content based recommendations *(coming soon)*
- General purpose cohort analysis *(coming soon)*
## Installation

```sh
$ npm i @jsonstack/jsonm
```

<link id="viewx-style-style-0" rel="stylesheet" type="text/css" href="https://unpkg.com/highlight.js@9.18.1/styles/darkula.css">

---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - Working With Data
   - [Data Fetching](https://repetere.github.io/jsonm/manual/data-fetching/index.html)
   - [Feature Engineering](https://repetere.github.io/jsonm/manual/feature-engineering/index.html)
 - Working With Models
   - [Model Training](https://repetere.github.io/jsonm/manual/model-training/index.html)
   - [Model Evaluation](https://repetere.github.io/jsonm/manual/model-evaluation/index.html)
   - [Model Predictions](https://repetere.github.io/jsonm/manual/model-predictions/index.html)
   - [Saving and Loading Models](https://repetere.github.io/jsonm/manual/saving-and-loading-models/index.html) 
 - [Advanced Topics](https://repetere.github.io/jsonm/manual/advanced-topics/index.html)
   - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
   - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
   - [Full API Docs](https://repetere.github.io/jsonm/)
---

### Basic Usage
```typescript
import * as tf from '@tensorflow/tfjs-node';
import { getModel, setBackend, } from '@jsonstack/jsonm';

//set tensorflow
scikit.setBackend(tf);
setBackend(tf);

//Iris Dataset e.g from https://raw.githubusercontent.com/repetere/modelx-model/master/src/test/mock/data/iris_data.csv
const type = 'ai-classification';
const dataset = [
  {
    "sepal_length_cm": 5.1,
    "sepal_width_cm": 3.5,
    "petal_length_cm": 1.4,
    "petal_width_cm": 0.2,
    "plant": "Iris-setosa",
  },
//  ...
  {
    "sepal_length_cm": 7.0,
    "sepal_width_cm": 3.2,
    "petal_length_cm": 4.7,
    "petal_width_cm": 1.4,
    "plant": "Iris-versicolor",
  },
  // ...
  {
    "sepal_length_cm": 5.9,
    "sepal_width_cm": 3.0,
    "petal_length_cm": 5.1,
    "petal_width_cm": 1.8,
    "plant": "virginica",
  }
]
const inputs = ['sepal_length_cm','sepal_width_cm','petal_length_cm','petal_width_cm', ];
const outputs = [ 'plant',];
const on_progress = ({ completion_percentage, loss, epoch, status, logs, defaultLog, }) => { 
  console.log({ completion_percentage, loss, epoch, status, logs, defaultLog, });
}
const IrisModel = await getModel({
  type,
  dataset,
  inputs,
  outputs,
  on_progress,
}); 
await IrisModel.trainModel()
const predictions = await IrisModel.predictModel({ 
  prediction_inputs:[
    { sepal_length_cm: 5.1, sepal_width_cm: 3.5, petal_length_cm: 1.4, petal_width_cm: 0.2, },
    { sepal_length_cm: 5.9, sepal_width_cm: 3.0, petal_length_cm: 5.1, petal_width_cm: 1.8, },
  ],
}); // => [ { plant:'Iris-setosa' }, { plant:'Iris-virginica' }, ]

```

## Example ##
<iframe width="100%" height="500" src="https://jsfiddle.net/yawetse/4ph1vwes/21/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

### Development

Note *Make sure you have typescript installed*

```sh
$ npm i -g typescript 
```

For generating documentation

```sh
$ npm run doc
```

### Notes

Check out [https://repetere.github.io/jsonm/](https://repetere.github.io/jsonm/) for the full jsonm Documentation

### Testing

```sh
$ npm test
```

### Contributing

Fork, write tests and create a pull request!

License

----

MIT