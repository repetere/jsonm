# JSONM
[![Coverage Status](https://coveralls.io/repos/github/repetere/jsonm/badge.svg?branch=main)](https://coveralls.io/github/repetere/jsonm?branch=main) [![Build, Test, Release](https://github.com/repetere/jsonm/actions/workflows/release.yml/badge.svg)](https://github.com/repetere/jsonm/actions/workflows/release.yml)

## Description

**JSONM** is a module that creates AI &amp; ML models with JSON using TypeScript & Tensorflow

### Declarative

The JSONM UMD comes with batteries included so you can use JSONM in the browser without transpilers or any additional setup/configuration. The JSONM UMD is ideal for JAMstack Applications.

### Intention

The idea behind JSONM is to enable rapid model development, and extremely complicated model development. JSONM attempts to automate the data pre-processing and feature engineering needed for most modeling tasks. 

Data Scientists who are more comfortable finely tuning hyperparameters and controlling pre-processing, scaling and normalization of datasets can also configure JSONM to meet specific model requirements.
## Installation

```sh
$ npm i @outsights/jsonm
```
### [Full Documentation](https://repetere.github.io/jsonm/)


<link id="viewx-style-style-0" rel="stylesheet" type="text/css" href="https://unpkg.com/highlight.js@9.18.1/styles/darkula.css">

---
### JSONM Manual
 - [Getting Started](https://repetere.github.io/jsonm/manual/getting-started/index.html)
 - [Training Models](https://repetere.github.io/jsonm/manual/declarative-json-models/index.html)
 - [Predictions with Models](https://repetere.github.io/jsonm/manual/imperative-models/index.html)
 - [Evaluating Models](https://repetere.github.io/jsonm/manual/imperative-models/index.html)
 - [Advanced Model Dataset](https://repetere.github.io/jsonm/manual/advanced-model-dataset/index.html)
 - [Loading and Saving Models](https://repetere.github.io/jsonm/manual/loading-and-saving-models/index.html)
 - [JSONM & JML Spec](https://repetere.github.io/jsonm/manual/spec/index.html)
 - [Examples](https://repetere.github.io/jsonm/manual/examples/index.html)
 - [Full API Docs](https://repetere.github.io/jsonm/)
---

### Basic Usage
```typescript
import { getModel } from '@outsights/jsonm';
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