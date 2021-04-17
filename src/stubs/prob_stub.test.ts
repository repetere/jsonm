// import { default as PD, } from 'probability-distributions';
import {rbeta} from './prob_stub'

describe('probability_distributions',()=>{
  describe('rbeta',()=>{
    it('should calc rbeta',()=>{
      // let random_beta = PD.rbeta(10,0.5,3);
      let random_beta_two = rbeta(10,0.5,3);
      // console.log({random_beta,random_beta_two})
      expect(random_beta_two.length).toBe(10)
    })
  })
})