import {
  monthNumbers,
  weekNumbers,
  dayNumbers,
  quarterhourNumbers,
  ordinalDayNumbers,
  hourNumbers,
  minuteNumbers,
  secondNumbers,
  mockDates,
  getPartialHour,
  getQuarterHour,
  getParsedDate,
  getIsOutlier,
  getOpenHour,
  getLuxonDateTime,
  addMockDataToDataSet,
  removeMockDataFromDataSet,
  removeEvaluationData,
} from './constants';
import { Info, DateTime, } from 'luxon';
import { DataSet, } from '@modelx/data/src/index';
import { getDatum, getData, generateNumberRange,randomNumber, } from './util';


// console.log({ mockDates });
describe('util', () => {
  describe('randomNumber', () => {
    it('should generate a random number in range', () => { 
      const one_to_ten = randomNumber(1, 10);
      expect(one_to_ten).toBeLessThanOrEqual(10);
      expect(one_to_ten).toBeGreaterThanOrEqual(1);

    });
  });
});
describe('constants', () => {
  describe('generated date objects', () => {
    it('should include all month numbers', () => {
      const luxonMonths = Info.months('numeric').map(monthString => parseInt(monthString));
      expect(monthNumbers).toEqual(expect.arrayContaining(luxonMonths));
    });
    it('should include all week numbers', () => {
      expect(weekNumbers).toEqual(expect.arrayContaining(generateNumberRange(1,52)));
      // console.log({ weekNums,weekNumbers });
    });
    it('should include all oridinal day numbers', () => {
      const ordinals = generateNumberRange(1, 366);
      expect(ordinalDayNumbers).toEqual(expect.arrayContaining(ordinals));
    });
    it('should include all day numbers', () => {
      const days = generateNumberRange(1, 31);
      expect(dayNumbers).toEqual(expect.arrayContaining(days));
    });
    it('should include all quarter hour numbers', () => {
      const quarterHours = generateNumberRange(1, 96);
      expect(quarterhourNumbers).toEqual(expect.arrayContaining(quarterHours));
    });
    it('should include all hour numbers', () => {
      const hours = generateNumberRange(0, 23);
      expect(hourNumbers).toEqual(expect.arrayContaining(hours));
    });
    it('should include all minute numbers', () => {
      const minutes = generateNumberRange(0, 59);
      expect(minuteNumbers).toEqual(expect.arrayContaining(minutes));
    });
    it('should include all second numbers', () => {
      const seconds = generateNumberRange(0, 59);
      expect(secondNumbers).toEqual(expect.arrayContaining(seconds));
    });
    it('should include all mock dates', () => {
      expect(mockDates.length).toEqual(368);
    });
  });
  describe('getPartialHour', () => {
    it('should return the partial hour', () => {
      expect(getPartialHour(0)).toBe(1);
      expect(getPartialHour(10)).toBe(1);
      expect(getPartialHour(15)).toBe(2);
      expect(getPartialHour(16)).toBe(2);
      expect(getPartialHour(25)).toBe(2);
      expect(getPartialHour(29)).toBe(2);
      expect(getPartialHour(30)).toBe(3);
      expect(getPartialHour(31)).toBe(3);
      expect(getPartialHour(39)).toBe(3);
      expect(getPartialHour(44)).toBe(3);
      expect(getPartialHour(45)).toBe(4);
      expect(getPartialHour(48)).toBe(4);
      expect(getPartialHour(59)).toBe(4);
      expect(getPartialHour(60)).toBe(4);
    });
  });
  describe('getQuarterHour', () => {
    it('should return the quarter hour', () => {
      expect(getQuarterHour({hour:0,minute:0})).toBe(1);
      expect(getQuarterHour({hour:0,minute:1})).toBe(1);
      expect(getQuarterHour({hour:1,minute:1})).toBe(5);
      expect(getQuarterHour({hour:1,minute:59})).toBe(8);
      expect(() => {
        getQuarterHour({ hour: 1, });
      }).toThrowError('both hour and minute are required');
    });
  });
  describe('getParsedDate', () => {
    it('should return a parsed date object', () => {
      const pd = getParsedDate(new Date('2020-04-11T12:00'), {});
      // console.log({ pd })
      expect(pd.weekend).toBe(true);
    });
  });
  describe('getLuxonDateTime', () => {
    it('should return a Luxon.DateTime date and format js', () => {
      const options1 = { dateObject: new Date(), };
      const options2 = { dateObject: new Date(), dateFormat: 'js', };
      const options3 = { dateObject: new Date(), dateFormat: 'js', time_zone: 'America/Los_Angeles' };
      const df1 = getLuxonDateTime(options1);
      const df2 = getLuxonDateTime(options2);
      const df3 = getLuxonDateTime(options3);
      // expect(df1.date).toBe(expect.any(DateTime));

      // console.log({ df1: df1.date.toISO(), df2: df2.date.toISO(), df3: df3.date.toISO() });
      expect(df1.format).toBe('js');
      expect(df2.format).toBe('js');
      expect(df3.format).toBe('js');
      expect(df1.date).toBeInstanceOf(DateTime);
      expect(df2.date).toBeInstanceOf(DateTime);
      expect(df3.date).toBeInstanceOf(DateTime);
    });
    it('should return a Luxon.DateTime date and format iso', () => {
      const options1 = { dateObject: '2020-04-09T14:30', dateFormat: 'iso', };
      const options2 = { dateObject: new Date(), dateFormat: 'iso', time_zone: 'America/Los_Angeles' };
      const df1 = getLuxonDateTime(options1);
      const df2 = getLuxonDateTime(options2);
      // expect(df1.date).toBe(expect.any(DateTime));

      expect(df1.format).toBe('iso');
      expect(df2.format).toBe('js');
      expect(df1.date).toBeInstanceOf(DateTime);
      expect(df2.date).toBeInstanceOf(DateTime);
    });
    it('should return a Luxon.DateTime date from custom format', () => {
      const options1 = { dateObject: 'Aug 06 2020', dateFormat: 'LLL dd yyyy', };
      const options2 = { dateObject: 'Aug 06 2020', dateFormat: 'invalid', time_zone: 'America/Los_Angeles' };
      const df1 = getLuxonDateTime(options1);
      const df2 = getLuxonDateTime(options2);
      // expect(df1.date).toBe(expect.any(DateTime));

      // console.log({
      //   df1: df1.date,
      // });
      // console.log({
      //   df1: df1.date.toISO(),
      //   df2: df2.date.toISO(),
      // });
      expect(df1.format).toBe(options1.dateFormat);
      expect(df2.format).toBe(options2.dateFormat);
      expect(df1.date).toBeInstanceOf(DateTime);
      expect(df2.date).toBeInstanceOf(DateTime);
    });
  });
  
  describe('getOpenHour', () => {
    it('should return return 1 if opwn', () => {
      expect(getOpenHour.call({})).toBe(1);
    });
  });
  describe('getIsOutlier', () => {
    it('should return 0 if no data to test', () => {
      expect(getIsOutlier.call({})).toBe(0);
    });
    it('should return outliers', () => {
      const outlierData = [{ field: 12 }, { field: 14 }, { field: 51 }, { field: 12 }, { field: 10 }, { field: 9 }, { field: 16 },];//).testOutlier(51); // true
      expect(getIsOutlier.call({
        datum: { field: 51 },
        data:outlierData,
      }, {
        outlier_property:'field'
      })).toBe(1);
      expect(getIsOutlier.call({
        datum: { field: 12 },
        data:outlierData,
      }, {
        outlier_property:'field'
      })).toBe(-1);
      expect(getIsOutlier.call({
        datum: { field: 12 },
        data:outlierData,
      }, {
      })).toBe(0);
      
    });
  });
  describe('addMockDataToDataSet', () => {
    it('should add mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      // console.log({ mockDates });
      // console.log('pre',{ data, mockEncodedData, });
      const DS = new DataSet(data);
      const newDS = addMockDataToDataSet(DS, { mockEncodedData, includeConstants:false, });
      // console.log('post',{ data });
      // console.log('post DS data', { data: newDS.data, });
      expect(newDS.data.length).toBe(data.length + mockEncodedData.length);
    });
    it('should add mock dates as mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS_for_mock_dates = new DataSet(data);
      const newDS_with_mock_dates = addMockDataToDataSet(DS_for_mock_dates, { mockEncodedData, includeConstants:true, });
      expect(newDS_with_mock_dates.data.length).toBe(data.length + mockEncodedData.length + mockDates.length);
    })
  });
  describe('removeMockDataFromDataSet', () => {
    it('should remove mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      // console.log({ mockDates });
      // console.log('pre',{ data, mockEncodedData, });
      const DS = new DataSet(data.concat(mockEncodedData));
      const newDS = removeMockDataFromDataSet(DS, { mockEncodedData, includeConstants:false, });
      // console.log('post',{ data });
      // console.log('post DS data', { data: newDS.data, });
      expect(newDS.data.length).toBe(data.length);
    });
    it('should remove mock dates and mock data', () => {
      const data = getData(2);
      const mockEncodedData = getData(1);
      const DS_for_mock_dates = new DataSet(data.concat(mockEncodedData,mockDates));
      const newDS_with_mock_dates = removeMockDataFromDataSet(DS_for_mock_dates, { mockEncodedData, includeConstants:true, });
      expect(newDS_with_mock_dates.data.length).toBe(data.length);
    })
  });
  describe('removeEvaluationData', () => {
    it('should remove evaluation data', () => {
      const evaluation = {
        actuals: [[1]],
        estimates: [[1]],
        otherval: 'dummy',
      };
      removeEvaluationData(evaluation);
      expect(evaluation).not.toHaveProperty('actuals');
      expect(evaluation).not.toHaveProperty('estimates');
      expect(evaluation).toHaveProperty('otherval');
    });
  });
});
