const { expect } = require('chai');
const { stub } = require('sinon');
const timerFn = require('./index');

describe('timer-node', () => {
  const timer = timerFn('test-timer');

  before(() => {
    stub(process, 'hrtime')
      .withArgs()
      .returns([274041, 181416161])
      .withArgs([274041, 181416161])
      .returns([19, 674468129]);
  });

  after(() => process.hrtime.restore());

  describe('.start()', () => {
    it('should start the timer', () => {
      timer.start();
      expect(timer.isRunning()).to.equal(true);
    });

    it('should not start the timer again if started', () => {
      timer.start();
      expect(timer.isRunning()).to.equal(true);
    });
  });

  describe('.stop()', () => {
    it('should stop the timer', () => {
      timer.stop();
      expect(timer.isRunning()).to.equal(false);
      expect(timer.isStopped()).to.equal(true);
    });

    it('should do nothing if timer is stopped', () => {
      timer.stop();
      expect(timer.isRunning()).to.equal(false);
    });
  });

  describe('.seconds()', () => {
    it('should get the seconds part of time', () => {
      expect(timer.seconds()).to.equal(19);
    });

    it('should return null if timer is not stopped', () => {
      const nullTimer = timerFn('test-timer');
      expect(nullTimer.seconds()).to.equal(null);
    });
  });

  describe('.milliseconds()', () => {
    it('should get the milliseconds part of time', () => {
      expect(timer.milliseconds()).to.equal(674);
    });

    it('should return null if timer is not stopped', () => {
      const nullTimer = timerFn('test-timer');
      expect(nullTimer.milliseconds()).to.equal(null);
    });
  });

  describe('.microseconds()', () => {
    it('should get the microseconds part of time', () => {
      expect(timer.microseconds()).to.equal(468);
    });

    it('should return null if timer is not stopped', () => {
      const nullTimer = timerFn('');
      expect(nullTimer.microseconds()).to.equal(null);
    });
  });

  describe('.nanoseconds()', () => {
    it('should get the nanoseconds part of time', () => {
      expect(timer.nanoseconds()).to.equal(129);
    });

    it('should return null if timer is not stopped', () => {
      const nullTimer = timerFn('');
      expect(nullTimer.nanoseconds()).to.equal(null);
    });
  });

  describe('.format()', () => {
    it('should format time with the default template', () => {
      expect(timer.format()).to.equal(
        'test-timer: 19 s, 674 ms, 468 us, 129 ns'
      );
    });

    it('should format time with the custom template', () => {
      expect(timer.format('%label [%s sec - %ms ms - %us micros - %ns nanos ]'))
        .to.equal('test-timer [19 sec - 674 ms - 468 micros - 129 nanos ]');
    });

    it('should return null if timer is not stopped', () => {
      const nullTimer = timerFn('');
      expect(nullTimer.format()).to.equal(null);
    });
  });

  describe('.reset()', () => {
    it('should reset the timer', () => {
      timer.reset();
      expect(timer.seconds()).to.equal(null);
    });
  });
});
