'use strict';
/*jshint expr: true*/
import * as luxon from 'luxon';
import * as features from './features';
import chai from 'chai';
// import path from 'path';
const expect = chai.expect;
// const validMongoId = '5b1eca428d021f08885edbf5';
// chai.use(require('sinon-chai'));
// chai.use(require('chai-as-promised'));

describe('scripts', function() {
  describe('features', () => {
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
        expect(test2018Months[ 0 ]).to.eql(test2018firstMonth);
        expect(test2018Months[ 6 ]).to.eql(test2018lastMonth);

        expect(features.getUniqueMonths({ start: jan, end: jun, time_zone, })).to.have.lengthOf(7);
        expect(features.getUniqueMonths({ start: janMiddle, end: jun, time_zone, })).to.have.lengthOf(7);
        expect(features.getUniqueMonths({ start: jan, end: jun, time_zone:time_zone_NYC, })).to.have.lengthOf(7);
        expect(features.getUniqueMonths({ start: jan, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
        expect(features.getUniqueMonths({ start: jun, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
      });
      it('should throw an error with an invalid timezone', () => {
        expect(features.getUniqueMonths.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).to.throw(/Date format is invalid/);
        expect(features.getUniqueMonths.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).to.throw(/Missing required timezone/);
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
        expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: weekdayMonday, })).to.have.lengthOf(5);
        expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: weekdaySunday, })).to.have.lengthOf(5);
        expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 1, })).to.have.lengthOf(5);
        const jan2018firstWeek = luxon.DateTime.fromISO('2018-01-01',{zone:time_zone}).toJSDate();
        const jan2018lastWeek = luxon.DateTime.fromISO('2018-01-29', { zone:time_zone }).toJSDate();
        expect(jan2018Weeks[ 0 ]).to.eql(jan2018firstWeek);
        expect(jan2018Weeks[ 4 ]).to.eql(jan2018lastWeek);
      });
      it('should allow for both weekdays as strings and numbers', () => {
        expect(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 'monday', })).to.eql(features.getUniqueWeeks({ start: jan, end: janEnd, time_zone, weekday: 1, }));
      });
      it('should throw an error with an invalid weekday', () => {
        expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone, weekday:999 })).to.throw(/Invalid weekday/);
      });
      it('should throw an error with an invalid timezone', () => {
        expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).to.throw(/Date format is invalid/);
        expect(features.getUniqueWeeks.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).to.throw(/Missing required timezone/);
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
        expect(test2018Days[ 0 ]).to.eql(test2018firstDay);
        expect(test2018Days[ 30 ]).to.eql(test2018lastDay);

        expect(features.getUniqueDays({ start: jan, end: janEnd, time_zone, })).to.have.lengthOf(31);
        expect(features.getUniqueDays({ start: janMiddle, end: janEnd, time_zone, })).to.have.lengthOf(17);
        expect(features.getUniqueDays({ start: jan, end: janEnd, time_zone:time_zone_NYC, })).to.have.lengthOf(31);
        expect(features.getUniqueDays({ start: jan, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
        expect(features.getUniqueDays({ start: jun, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
      });
      it('should throw an error with an invalid timezone', () => {
        expect(features.getUniqueDays.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).to.throw(/Date format is invalid/);
        expect(features.getUniqueDays.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).to.throw(/Missing required timezone/);
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
        expect(test2018Hours[ 0 ]).to.eql(test2018firstHour);
        expect(test2018Hours[ 23 ]).to.eql(test2018lastHour);

        expect(features.getUniqueHours({ start: jan, end: janEnd, time_zone, })).to.have.lengthOf(24);
        expect(features.getUniqueHours({ start: janStartDayTwo, end: janEndDayTwo, time_zone, })).to.have.lengthOf(49);
        expect(features.getUniqueHours({ start: jan, end: janEnd, time_zone:time_zone_NYC, })).to.have.lengthOf(24);
        expect(features.getUniqueHours({ start: jan, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
        expect(features.getUniqueHours({ start: janEnd, end: jan, time_zone:time_zone_NYC, })).to.have.lengthOf(1);
      });
      it('should throw an error with an invalid timezone', () => {
        expect(features.getUniqueHours.bind({}, { start: '2018-01-01', end: '2018-03-01', time_zone: 'invalid', })).to.throw(/Date format is invalid/);
        expect(features.getUniqueHours.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).to.throw(/Missing required timezone/);
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

        expect(features.getEndDate({ start_date, time_zone, dimension: 'monthly' })).to.eql(endMonthly);
        expect(features.getEndDate({ start_date, time_zone, dimension: 'weekly' })).to.eql(endWeekly);
        expect(features.getEndDate({ start_date, time_zone, dimension: 'daily' })).to.eql(endDaily);
        expect(features.getEndDate({ start_date, time_zone, dimension: 'hourly' })).to.eql(endHourly);
      });
      it('should throw an error with an invalid timezone', () => {
        expect(features.getEndDate.bind({}, { start: '2018-01-01', end: '2018-03-01',  })).to.throw(/Missing required timezone/);
        expect(features.getEndDate.bind({}, {  time_zone, dimension:'monthly', })).to.throw(/Date format or time_zone is invalid/);
        expect(features.getEndDate.bind({}, { start_date, time_zone,  })).to.throw(/Invalid dimension/);
      });
    });
  });
});