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

  describe('none started timer', () => {
    it('.time() returns null', () => {
      expect(timer.time()).to.equal(null);
    });

    it('.format() returns null', () => {
      expect(timer.format()).to.equal(null);
    });

    it('.stop() does nothing', () => {
      timer.stop();
      expect(timer.time()).to.equal(null);
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
    });

    it('.pause() does nothing', () => {
      timer.pause();
      expect(timer.time()).to.equal(null);
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
    });

    it('.resume() does nothing', () => {
      timer.resume();
      expect(timer.time()).to.equal(null);
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
    });
  });

  describe('.start()', () => {
    it('should start the timer', () => {
      timer.start();
      expect(process.hrtime.callCount).to.equal(1);
    });

    it('should not start the timer again if started', () => {
      timer.start();
      expect(process.hrtime.callCount).to.equal(1);
      expect(timer.isStarted()).to.equal(true);
    });
  });

  describe('.time()', () => {
    it('get time fractions from the running timer', () => {
      expect(timer.time()).to.deep.equal({
        s: 19,
        ms: 674,
        us: 468,
        ns: 129
      });
    });

    it('returns null for none started timer', () => {
      const timer2 = new Timer();
      expect(timer2.time()).to.equal(null);
    });
  });

  describe('.pause()', () => {
    it('pause the timer', () => {
      timer.pause();
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(true);
      expect(timer.isPaused()).to.equal(true);
      expect(timer.time()).to.deep.equal({
        s: 19,
        ms: 674,
        us: 468,
        ns: 129
      });
    });
  });

  describe('.resume()', () => {
    it('resume the timer', () => {
      timer.resume();
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(true);
      expect(timer.isPaused()).to.equal(false);
    });
  });

  describe('.stop()', () => {
    it('should stop the timer', () => {
      timer.stop();
      expect(process.hrtime.callCount).to.equal(5);
      expect(timer.time()).to.deep.equal({
        s: 39,
        ms: 348,
        us: 936,
        ns: 258
      });
    });

    it('should do nothing for unfinished timer', () => {
      timer.stop();
      expect(process.hrtime.callCount).to.equal(5);
    });
  });

  describe('.format([template])', () => {
    it('should format time with the default template', () => {
      expect(timer.stop().format()).to.equal(
        'test-timer: 39 s, 348 ms, 936 us, 258 ns'
      );
    });

    it('should format time with the custom template', () => {
      const template = '%lbl -> [%s] sec [%ms] ms [%us] us [%ns] ns';
      expect(timer.stop().format(template)).to.equal(
        'test-timer -> [39] sec [348] ms [936] us [258] ns'
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
      expect(timer.time()).to.equal(null);

      expect(timer.clear().start().clear().format()).to.equal(null);
    });
  });

  describe('Timer.benchmark(fn)', () => {
    it('throw an error if input is not a function', () => {
      expect(() => Timer.benchmark('test')).to.throw(Error)
        .and.to.have.property('message', 'Timer.benchmark expects a function');
    });

    it('should creates a benchmark for a function bound', () => {
      const fn = (a) => {
        let sum = 0;
        for (let i = 0; i < 10000000; i += 1) {
          sum += a * i;
        }
        return sum;
      };
      const benchmark = Timer.benchmark(fn.bind(fn, 5));
      expect(benchmark.time().ms).to.be.above(0);
    });
  });
});
