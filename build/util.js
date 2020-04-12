// ts-node -O {\"module\":\"commonjs\"}  src/util.ts
import { getParsedDate, } from './constants';
import faker from 'faker';
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
