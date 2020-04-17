'use strict';
/*jshint expr: true*/
import * as luxon from 'luxon';
import * as features from './features';
import * as ModelXData from '@modelx/data/src/index';

import { getDatum, getData, generateNumberRange,timeseriesSort, } from './util';
// const validMongoId = '5b1eca428d021f08885edbf5';
// chai.use(require('sinon-chai'));
// chai.use(require('chai-as-promised'));
describe('auto features', () => {
  const timeseriesData = [
    getDatum(new Date('2020-04-04T00:00:00.000Z'),{late_payments:true}),
    getDatum(new Date('2020-04-05T00:00:00.000Z'),{late_payments:true}),
    getDatum(new Date('2020-04-06T00:00:00.000Z'),{late_payments:false}),
    getDatum(new Date('2020-04-07T00:00:00.000Z'),{late_payments:true}),
    getDatum(new Date('2020-04-08T00:00:00.000Z'),{late_payments:false}),
    getDatum(new Date('2020-04-09T00:00:00.000Z'),{late_payments:false}),
    getDatum(new Date('2020-04-10T00:00:00.000Z'),{late_payments:true}),
    getDatum(new Date('2020-04-11T00:00:00.000Z'),{late_payments:true}),
  ].sort(timeseriesSort);
  // console.log({ timeseriesData });
  describe('getEncodedFeatures', () => {
    it('should return encoded features', () => { 
      const DS = new ModelXData.DataSet(timeseriesData);
      const independent_variables = ['type', 'late_payments', 'month','day'];
      const dependent_variables = ['amount'];
      const input_independent_features = [
        {
          feature_field_name: 'late_payments',
          feature_field_type: features.AutoFeatureTypes.TEXT,
        },
        {
          feature_field_name: 'type',
          feature_field_type: features.AutoFeatureTypes.TEXT,
        },
        {
          feature_field_name: 'month',
          feature_field_type: features.AutoFeatureTypes.TEXT,
        },
        {
          feature_field_name: 'day',
          feature_field_type: features.AutoFeatureTypes.TEXT,
        },
      ];
      const autoFeatures = features.autoAssignFeatureColumns({
        independent_variables,
        dependent_variables,
        input_independent_features,
        datum:timeseriesData[0]
      });

      DS.fitColumns(autoFeatures.preprocessing_feature_column_options);
      DS.fitColumns(autoFeatures.training_feature_column_options);
      const calculatedFeatures = features.getEncodedFeatures({ DataSet: DS, features: ['late_payments', ] });
      expect(calculatedFeatures).toMatchObject([
        'late_payments_true',
        'late_payments_false']);

      // console.log('autoFeatures.training_feature_column_options', autoFeatures.training_feature_column_options);
      // console.log('autoFeatures.preprocessing_feature_column_options', autoFeatures.preprocessing_feature_column_options);
      // console.log('DS', DS);
      // console.log('features.getEncodedFeatures({DataSet:DS})', );
      // // console.log({ autoFeatures,DS });
    });
  });
  describe('autoAssignFeatureColumns', () => {
    it('should create auto features from inputs and output', () => {
      const autoFeatures = features.autoAssignFeatureColumns({
        input_independent_features: [
          {
            feature_field_name: 'rise',
            feature_field_type: features.AutoFeatureTypes.NUMBER,
          },
          {
            feature_field_name: 'is_new',
            feature_field_type: features.AutoFeatureTypes.BOOLEAN,
          },
        ],
        output_dependent_features: [
          {
            feature_field_name: 'run',
            feature_field_type: features.AutoFeatureTypes.NUMBER,
          },
        ],
      });
      expect(autoFeatures.x_raw_independent_features).toMatchObject(['rise', 'is_new']);
      expect(autoFeatures.y_raw_dependent_labels).toMatchObject(['run']);
      expect(autoFeatures.preprocessing_feature_column_options).toMatchObject({ rise: ['median'], run: ['median'] });
      expect(autoFeatures.training_feature_column_options).toMatchObject({
        rise: ['scale', 'standard'],
        is_new: ['label', { binary: true }],
        run: ['scale', 'standard']
      });
      // console.log('autoFeatures.training_feature_column_options', autoFeatures.training_feature_column_options);
      // console.log('autoFeatures.preprocessing_feature_column_options', autoFeatures.preprocessing_feature_column_options);
    });
    it('should auto create features from datum', () => {
      const autoFeatures = features.autoAssignFeatureColumns({
        independent_variables: ['rise', 'is_new'],
        dependent_variables: ['run'],
        datum: {
          rise: 10,
          is_new: false,
          run:5,
        },
      });
      
      expect(autoFeatures.x_raw_independent_features).toMatchObject(['rise', 'is_new']);
      expect(autoFeatures.y_raw_dependent_labels).toMatchObject(['run']);
      expect(autoFeatures.preprocessing_feature_column_options).toMatchObject({ rise: ['median'], run: ['median'] });
      expect(autoFeatures.training_feature_column_options).toMatchObject({
        rise: ['scale', 'standard'],
        is_new: ['label', { binary: true }],
        run: ['scale', 'standard']
      });
    });
    it('should combine features from datum and auto features', () => {
      const autoFeatures = features.autoAssignFeatureColumns({
        input_independent_features: [
          {
            feature_field_name: 'desc_label',
            feature_field_type: features.AutoFeatureTypes.TEXT,
          },
        ],
        independent_variables: ['rise', 'is_new'],
        dependent_variables: ['run'],
        datum: {
          rise: 10,
          is_new: false,
          run: 5,
          desc_label:'success'
        },
      });
      
      expect(autoFeatures.x_raw_independent_features).toMatchObject(['rise', 'is_new', 'desc_label',]);
      expect(autoFeatures.y_raw_dependent_labels).toMatchObject(['run']);
      expect(autoFeatures.preprocessing_feature_column_options).toMatchObject({ rise: ['median'], run: ['median'] });
      expect(autoFeatures.training_feature_column_options).toMatchObject({
        rise: ['scale', 'standard'],
        is_new: ['label', { binary: true }],
        run: ['scale', 'standard'],
        desc_label: ['onehot'],
      });
    });
  });
});
describe('features', () => {
  describe('getUniqueYears', () => {
    it('should return range of months', () => {
      const y2014 = '2014-01-01';
      const y2018 = '2018-01-15';
      const y2020 = '2020-01-01';
      const time_zone = 'America/Los_Angeles';
      const time_zone_NYC = 'America/New_York';
      const test6years = features.getUniqueYears({ start: y2014, end: y2020, time_zone, });
      const testy2014 = luxon.DateTime.fromISO(y2014,{zone:time_zone}).toJSDate();
      const testy2020 = luxon.DateTime.fromISO(y2020, { zone:time_zone }).toJSDate();
      expect(test6years[ 0 ]).toEqual(testy2014);
      expect(test6years[ 6 ]).toEqual(testy2020);

      expect(features.getUniqueYears({ start: y2014, end: y2020, time_zone, })).toHaveLength(7);
      expect(features.getUniqueYears({ start: y2018, end: y2020, time_zone, })).toHaveLength(3);
      expect(features.getUniqueYears({ start: y2014, end: y2020, time_zone:time_zone_NYC, })).toHaveLength(7);
      expect(features.getUniqueYears({ start: y2014, end: y2014, time_zone:time_zone_NYC, })).toHaveLength(1);
      expect(features.getUniqueYears({ start: y2020, end: y2014, time_zone:time_zone_NYC, })).toHaveLength(1);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueYears.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueYears.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueMonths', () => {
    it('should return range of months', () => {
      const jan = '2018-01-01';
      const janMiddle = '2018-01-15';
      const jun = '2018-07-01';
      const time_zone = 'America/Los_Angeles';
      const time_zone_NYC = 'America/New_York';
      const test2018Months = features.getUniqueMonths({ start: jan, end: jun, time_zone, });
      const test2018firstMonth = luxon.DateTime.fromISO(jan,{zone:time_zone}).toJSDate();
      const test2018lastMonth = luxon.DateTime.fromISO(jun, { zone:time_zone }).toJSDate();
      expect(test2018Months[ 0 ]).toEqual(test2018firstMonth);
      expect(test2018Months[ 6 ]).toEqual(test2018lastMonth);

      expect(features.getUniqueMonths({ start: jan, end: jun, time_zone, })).toHaveLength(7);
      expect(features.getUniqueMonths({ start: janMiddle, end: jun, time_zone, })).toHaveLength(7);
      expect(features.getUniqueMonths({ start: jan, end: jun, time_zone:time_zone_NYC, })).toHaveLength(7);
      expect(features.getUniqueMonths({ start: jan, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
      expect(features.getUniqueMonths({ start: jun, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueMonths.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueMonths.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueWeeks', () => {
    const jan = '2018-01-01';
    const janEnd = '2018-01-31';
    const time_zone = 'America/Los_Angeles';
    // const time_zone_NYC = 'America/New_York';
    const weekdayMonday = 'monday';
    const weekdaySunday = 'sunday';
    it('should return range of weeks', () => {
      const jan2018Weeks = features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: weekdayMonday, });
      expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: weekdayMonday, })).toHaveLength(5);
      expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: weekdaySunday, })).toHaveLength(5);
      expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 1, })).toHaveLength(5);
      const jan2018firstWeek = luxon.DateTime.fromISO('2018-01-01',{zone:time_zone}).toJSDate();
      const jan2018lastWeek = luxon.DateTime.fromISO('2018-01-29', { zone:time_zone }).toJSDate();
      expect(jan2018Weeks[ 0 ]).toEqual(jan2018firstWeek);
      expect(jan2018Weeks[ 4 ]).toEqual(jan2018lastWeek);
    });
    it('should allow for both weekdays as strings and numbers', () => {
      expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 'monday', })).toMatchObject(
        features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 1, })
      );
    });
    it('should throw an error with an invalid weekday', () => {
      expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone, weekday:999 })).toThrowError(/Invalid weekday/);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueDays', () => {
    it('should return range of days', () => {
      const jan = '2018-01-01T08:32';
      const janMiddle = '2018-01-15';
      const janEnd = '2018-01-31T22:12';
      const jun = '2018-07-01';
      const time_zone = 'America/Los_Angeles';
      const time_zone_NYC = 'America/New_York';
      const test2018Days = features.getUniqueDays({ start: jan, end: janEnd, time_zone, });
      const test2018firstDay = luxon.DateTime.fromISO('2018-01-01T00:00',{zone:time_zone}).toJSDate();
      const test2018lastDay = luxon.DateTime.fromISO('2018-01-31T00:00', { zone:time_zone }).toJSDate();
      expect(test2018Days[ 0 ]).toEqual(test2018firstDay);
      expect(test2018Days[ 30 ]).toEqual(test2018lastDay);

      expect(features.getUniqueDays({ start: jan, end: janEnd, time_zone, })).toHaveLength(31);
      expect(features.getUniqueDays({ start: janMiddle, end: janEnd, time_zone, })).toHaveLength(17);
      expect(features.getUniqueDays({ start: jan, end: janEnd, time_zone:time_zone_NYC, })).toHaveLength(31);
      expect(features.getUniqueDays({ start: jan, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
      expect(features.getUniqueDays({ start: jun, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueDays.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueDays.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueHours', () => {
    it('should return range of hours', () => {
      const jan = '2018-01-01T01:32';
      const janEnd = '2018-01-02T00:12';
      const janStartDayTwo = '2018-01-13';
      const janEndDayTwo = '2018-01-15';
      const time_zone = 'America/Los_Angeles';
      const time_zone_NYC = 'America/New_York';
      const test2018Hours = features.getUniqueHours({ start: jan, end: janEnd, time_zone, });
      const test2018firstHour = luxon.DateTime.fromISO('2018-01-01T01:00', { zone: time_zone }).toJSDate();
      const test2018lastHour = luxon.DateTime.fromISO('2018-01-02T00:00', { zone: time_zone }).toJSDate();
      expect(test2018Hours[ 0 ]).toEqual(test2018firstHour);
      expect(test2018Hours[ 23 ]).toEqual(test2018lastHour);

      expect(features.getUniqueHours({ start: jan, end: janEnd, time_zone, })).toHaveLength(24);
      expect(features.getUniqueHours({ start: janStartDayTwo, end: janEndDayTwo, time_zone, })).toHaveLength(49);
      expect(features.getUniqueHours({ start: jan, end: janEnd, time_zone:time_zone_NYC, })).toHaveLength(24);
      expect(features.getUniqueHours({ start: jan, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
      expect(features.getUniqueHours({ start: janEnd, end: jan, time_zone:time_zone_NYC, })).toHaveLength(1);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueHours.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueHours.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueMinutes', () => {
    it('should return range of hours', () => {
      const jan = '2018-01-01T01:32';
      const janEnd = '2018-01-01T01:43';
      const time_zone = 'America/Los_Angeles';
      const time_zone_NYC = 'America/New_York';
      const test2018Minutes = features.getUniqueMinutes({ start: jan, end: janEnd, time_zone, });
      const test2018firstMinute = luxon.DateTime.fromISO('2018-01-01T01:32', { zone: time_zone }).toJSDate();
      const test20186thMinute = luxon.DateTime.fromISO('2018-01-01T01:37', { zone: time_zone }).toJSDate();
      expect(test2018Minutes[ 0 ]).toEqual(test2018firstMinute);
      expect(test2018Minutes[ 5 ]).toEqual(test20186thMinute);

      expect(features.getUniqueMinutes({ start: jan, end: janEnd, time_zone, })).toHaveLength(12);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueMinutes.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueMinutes.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getUniqueSeconds', () => {
    it('should return range of hours', () => {
      const jan = '2018-01-01T01:32:11';
      const janEnd = '2018-01-01T01:32:18';
      const time_zone = 'America/Los_Angeles';
      const test2018Seconds = features.getUniqueSeconds({ start: jan, end: janEnd, time_zone, });
      const test2018firstSecond = luxon.DateTime.fromISO('2018-01-01T01:32:11', { zone: time_zone }).toJSDate();
      const test20186thSecond = luxon.DateTime.fromISO('2018-01-01T01:32:16', { zone: time_zone }).toJSDate();
      expect(test2018Seconds[ 0 ]).toEqual(test2018firstSecond);
      expect(test2018Seconds[ 5 ]).toEqual(test20186thSecond);

      expect(features.getUniqueSeconds({ start: jan, end: janEnd, time_zone, })).toHaveLength(8);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getUniqueSeconds.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).toThrowError(/Date format is invalid/);
      expect(features.getUniqueSeconds.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
    });
  });
  describe('getEndDate', () => {
    const time_zone = 'America/Los_Angeles';
    const start_date = luxon.DateTime.fromISO('2018-03-15T00:00', { zone: time_zone }).toJSDate();
    it('should return end date', () => {
      const endMonthly = luxon.DateTime.fromISO('2018-04-15T00:00', { zone: time_zone }).toJSDate();
      const endWeekly = luxon.DateTime.fromISO('2018-03-22T00:00', { zone: time_zone }).toJSDate();
      const endDaily = luxon.DateTime.fromISO('2018-03-16T00:00', { zone: time_zone }).toJSDate();
      const endHourly = luxon.DateTime.fromISO('2018-03-15T01:00', { zone: time_zone }).toJSDate();

      expect(features.getEndDate({ start_date, time_zone, dimension: 'monthly' })).toMatchObject(endMonthly);
      expect(features.getEndDate({ start_date, time_zone, dimension: 'weekly' })).toMatchObject(endWeekly);
      expect(features.getEndDate({ start_date, time_zone, dimension: 'daily' })).toMatchObject(endDaily);
      expect(features.getEndDate({ start_date, time_zone, dimension: 'hourly' })).toMatchObject(endHourly);
    });
    it('should throw an error with an invalid timezone', () => {
      expect(features.getEndDate.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).toThrowError(/Missing required timezone/);
      expect(features.getEndDate.bind({}, {  time_zone, dimension:'monthly', })).toThrowError(/Date format or time_zone is invalid/);
      expect(features.getEndDate.bind({}, { start_date, time_zone,  })).toThrowError(/Invalid dimension/);
    });
  });
});