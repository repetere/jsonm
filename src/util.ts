import * as ModelXDataTypes from '@modelx/data/src/DataSet';
// ts-node -O {\"module\":\"commonjs\"}  src/util.ts
import { getParsedDate, } from './constants';
import faker from 'faker';
export type Fake = {
  [index: string]: any;
}
export const Faker:Fake = {...faker};

export function randomNumber(min:number, max:number) {  
  return Math.random() * (max - min) + min; 
}
export function generateNumberRange(start: number, end: number): number[]{
  return [start].reduce((result:number[], val:number) => { 
    for (let i=val; i < (end+1); i++){
      result.push(i);
    }
    return result;
  }, []);
}
export function getDatum(customDate?: Date, customTransation: { amount?: number; late_payments?: boolean; } = {}) {
  const transaction = Faker.helpers.createTransaction();
  const { amount, late_payments = true, } = customTransation;
  transaction.amount = parseFloat(amount || transaction.amount);
  transaction.late_payments = late_payments;
  const date = customDate||Faker.date.between(new Date('2020-01-15'), new Date('2020-04-10'));
  const parsedDate = getParsedDate(date);
  return {
    ...transaction,
    ...parsedDate,
    date,
  }
}
export function getData(items: number) {
  return generateNumberRange(0, items-1).map(()=>getDatum());
}
export const timeseriesSort = (a:ModelXDataTypes.Datum, b:ModelXDataTypes.Datum) => a.date.valueOf() - b.date.valueOf();