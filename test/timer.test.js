const { expect } = require('chai');
const { Timer } = require('../src/timer');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Timer tests', () => {
  const timer = new Timer({ label: 'test-timer' });

  describe('unstarted timer', () => {
    it('.time() returns zeroed time when the timer is not started', () => {
      expect(timer.time()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
    });

    it('.format() returns zeroed time in formatted string when the timer is not started', () => {
      expect(timer.format()).to.equal(
        'test-timer: 0 d, 0 h, 0 m, 0 s, 0 ms'
      );
    });

    it('.stop() does nothing if the timer was never started', () => {
      timer.stop();
      expect(timer.time()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(false);
    });

    it('.pause() does nothing if the timer was never started', () => {
      timer.pause();
      expect(timer.time()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(false);
    });

    it('.resume() does nothing if the timer was never started', () => {
      timer.resume();
      expect(timer.time()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(false);
    });
  });

  describe('.start()', () => {
    it('should start the timer', () => {
      timer.start();
      expect(timer.isStarted()).to.equal(true);
      expect(timer.isRunning()).to.equal(true);
    });
  });

  describe('.ms()', () => {
    const timeout = 200;
    let ms1;
    let ms2;

    beforeEach((done) => {
      setTimeout(done, timeout);
    });

    it('gets elapsed milliseconds from the running timer', () => {
      ms1 = timer.ms();
      expect(ms1).to.be.above(timeout - 1);
    });

    it('gets elapsed milliseconds again from the running timer', () => {
      ms2 = timer.ms();
      expect(ms2).to.be.above(ms1);
    });
  });

  describe('.time()', () => {
    const timeout = 1000;

    beforeEach((done) => {
      setTimeout(done, timeout);
    });

    it('gets time fractions from the running timer', () => {
      const time = timer.time();
      expect(time.s).to.equal(1);
      expect(time.ms).to.be.above(0);
      expect(time.h).to.equal(0);
      expect(time.m).to.equal(0);
      expect(time.d).to.equal(0);
    });
  });

  describe('.pause()', () => {
    it('pauses the timer', (done) => {
      timer.pause();
      setTimeout(() => {
        expect(timer.isStopped()).to.equal(false);
        expect(timer.isStarted()).to.equal(true);
        expect(timer.isPaused()).to.equal(true);
        expect(timer.isRunning()).to.equal(false);
        done();
      }, 100);
    });
  });

  describe('.resume()', () => {
    it('resumes the timer', () => {
      timer.resume();
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(true);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(true);
    });
  });

  describe('.stop()', () => {
    it('stops the timer', () => {
      timer.stop();
      expect(timer.isStarted()).to.equal(true);
      expect(timer.isStopped()).to.equal(true);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(false);
    });
  });

  describe('.startedAt()', () => {
    it('gets the start timestamp', () => {
      expect(timer.startedAt()).to.be.above(0);
    });
  });

  describe('.stoppedAt()', () => {
    it('gets the stop timestamp', () => {
      expect(timer.stoppedAt()).to.be.above(timer.startedAt());
    });
  });

  describe('.pauseMs()', () => {
    it('gets the total paused milliseconds', () => {
      expect(timer.pauseMs()).to.be.above(0);
    });
  });

  describe('.pauseTime()', () => {
    it('gets the total pause time breakdown', () => {
      expect(timer.pauseTime().ms).to.be.above(0);
    });
  });

  describe('.pauseCount()', () => {
    it('gets the pause count', () => {
      expect(timer.pauseCount()).to.equal(1);
    });
  });

  describe('.format([template])', () => {
    it('formats time with the default template', () => {
      const time = timer.time();
      expect(timer.format()).to.equal(
        `test-timer: 0 d, 0 h, 0 m, ${time.s} s, ${time.ms} ms`
      );
    });

    it('formats time with a custom template', () => {
      const time = timer.time();
      expect(timer.format('%s s %ms ms')).to.equal(`${time.s} s ${time.ms} ms`);
    });
  });

  describe('.serialize()', () => {
    it('serializes the timer', () => {
      const timerObj = JSON.parse(timer.serialize());
      expect(timerObj.label).to.equal(timer.getLabel());
      expect(timerObj.pauseCount).to.equal(1);
      expect(timerObj.accumulatedMs).to.be.above(0);
      expect(timerObj.currentStartTimestamp).to.be.above(0);
      expect(timerObj.endTimestamp).to.be.above(0);
      expect(timerObj.startTimestamp).to.be.above(0);
    });
  });

  describe('.clear()', () => {
    it('clears the timer', () => {
      timer.clear();
      expect(timer.isStopped()).to.equal(false);
      expect(timer.isStarted()).to.equal(false);
      expect(timer.isPaused()).to.equal(false);
      expect(timer.isRunning()).to.equal(false);
      expect(timer.pauseMs()).to.equal(0);
      expect(timer.pauseCount()).to.equal(0);
      expect(timer.ms()).to.equal(0);
      expect(timer.time()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
      expect(timer.pauseTime()).to.deep.equal({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        ms: 0
      });
    });
  });

  describe('Timer.deserialize(serializedTimer)', () => {
    it('creates a timer from a serialized timer', () => {
      const newTimer = Timer.deserialize(timer.serialize());
      expect(newTimer.serialize()).to.deep.equal(timer.serialize());
    });

    it('creates a timer from a serialized timer keeping paused state', async () => {
      const newTimer = new Timer({ label: 'paused-timer-test' });
      newTimer.start();
      await sleep(100);
      newTimer.pause();

      const timerFromState = Timer.deserialize(newTimer.serialize());
      expect(timerFromState.serialize()).to.deep.equal(newTimer.serialize());
    });
  });

  describe('Timer.benchmark(fn)', () => {
    it('throws an error if input is not a function', () => {
      expect(() => Timer.benchmark('test')).to.throw(Error)
        .and.to.have.property('message', 'Timer.benchmark expects a function');
    });

    it('creates a benchmark for a function (bound)', () => {
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

  describe('loading timer from a past timestamp', () => {
    it('records elapsed time from a past timestamp', () => {
      const pastTimestamp = 1516363286993; // 2018-01-19 12:01:26.993
      const pastTimer = new Timer({
        label: 'past-timer',
        startTimestamp: pastTimestamp
      });

      expect(pastTimer.startedAt()).to.equal(pastTimestamp);
      expect(pastTimer.time().d).to.be.above(1150); // days since 2018
      expect(pastTimer.time().h).to.be.below(24);
      expect(pastTimer.time().m).to.be.below(60);
      expect(pastTimer.time().s).to.be.below(60);
      expect(pastTimer.time().ms).to.be.below(1000);
    });
  });
});
