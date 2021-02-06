const { expect } = require('chai');
const { stub } = require('sinon');
const Timer = require('../src/timer');

describe('Timer tests', () => {
  const timer = new Timer('test-timer');

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
      expect(process.hrtime.callCount).to.equal(1);
      expect(timer.isRunning()).to.equal(true);
    });

    it('should not start the timer again if started', () => {
      timer.start();
      expect(process.hrtime.callCount).to.equal(1);
    });
  });

  describe('.stop()', () => {
    it('should stop the timer', () => {
      timer.stop();
      expect(timer.isRunning()).to.equal(false);
      expect(process.hrtime.callCount).to.equal(2);
    });

    it('should do nothing for unfinished timer', () => {
      timer.stop();
      expect(process.hrtime.callCount).to.equal(2);
    });
  });

  describe('.seconds()', () => {
    it('should get the seconds part of time', () => {
      expect(timer.seconds()).to.equal(19);
    });

    it('should return null for unfinished timer', () => {
      const unstartedTimer = new Timer('');
      expect(unstartedTimer.seconds()).to.equal(null);
    });
  });

  describe('.milliseconds()', () => {
    it('should get the milliseconds part of time', () => {
      expect(timer.milliseconds()).to.equal(674);
    });

    it('should return null for unfinished timer', () => {
      const unstartedTimer = new Timer('');
      expect(unstartedTimer.milliseconds()).to.equal(null);
    });
  });

  describe('.microseconds()', () => {
    it('should get the microseconds part of time', () => {
      expect(timer.microseconds()).to.equal(468);
    });

    it('should return null for unfinished timer', () => {
      const unstartedTimer = new Timer('');
      expect(unstartedTimer.microseconds()).to.equal(null);
    });
  });

  describe('.nanoseconds()', () => {
    it('should get the nanoseconds part of time', () => {
      expect(timer.nanoseconds()).to.equal(129);
    });

    it('should return null for unfinished timer', () => {
      const unstartedTimer = new Timer('');
      expect(unstartedTimer.nanoseconds()).to.equal(null);
    });
  });

  describe('.format([template])', () => {
    it('should format time with the default template', () => {
      expect(timer.stop().format()).to.equal(
        'test-timer: 19 s, 674 ms, 468 us, 129 ns'
      );
    });

    it('should format time with the custom template', () => {
      const template = '%lbl -> [%s] sec [%ms] ms [%us] us [%ns] ns';
      expect(timer.stop().format(template)).to.equal(
        'test-timer -> [19] sec [674] ms [468] us [129] ns'
      );
    });

    it('should return null for unfinished timer', () => {
      const unstartedTimer = new Timer('');
      expect(unstartedTimer.format()).to.equal(null);
    });
  });

  describe('.clear()', () => {
    it('should clear the timer', () => {
      timer.clear();
      expect(timer.seconds()).to.equal(null);

      expect(timer.clear().start().clear().format()).to.equal(null);
    });
  });

  describe('Timer.benchmark(fn)', () => {
    it('should creates a benchmark for a function bound', () => {
      const fn = (a) => {
        let sum = 0;
        for (let i = 0; i < 10000000; i += 1) {
          sum += a * i;
        }
        return sum;
      };
      const benchmark = Timer.benchmark(fn.bind(fn, 5));
      expect(benchmark.milliseconds()).to.be.above(0);
    });
  });
});
