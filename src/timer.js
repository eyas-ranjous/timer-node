/**
 * timer-node
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

/**
 * @class Timer
 */
class Timer {
  /**
   * Creates a new timer
   * @param {string} label
   */
  constructor(label) {
    this._label = label || '';
    this._isStarted = false;
    this._isStopped = false;
    this._isPaused = false;
    this._startTime = null;
    this._endTime = null;
    this._pausedTime = null;
  }

  /**
   * Adds two recorded times
   * @private
   * @return {object}
   */
  _sum(time1, time2) {
    const nsSum = time1.ns + time2.ns;
    const usSum = time1.us + time2.us + Math.floor(nsSum / 1000);
    const msSum = time1.ms + time2.ms + Math.floor(usSum / 1000);
    const sSum = time1.s + time2.s + Math.floor(msSum / 1000);

    return {
      s: sSum,
      ms: msSum % 1000,
      us: usSum % 1000,
      ns: nsSum % 1000
    };
  }

  /**
   * Get the ellapsed time of a started timer
   * @private
   * @return {object}
   */
  _getTime() {
    const endTime = this._isStopped
      ? this._endTime
      : process.hrtime(this._startTime);

    const currentTime = {
      s: endTime[0],
      ms: Math.floor(endTime[1] / 1000000),
      us: Math.floor(endTime[1] / 1000) % 1000,
      ns: endTime[1] % 1000
    };

    if (this._pausedTime === null) {
      return currentTime;
    }

    return this._sum(this._pausedTime, currentTime);
  }

  /**
   * @public
   * @return {boolean}
   */
  isStarted() {
    return this._isStarted;
  }

  /**
   * @public
   * @return {boolean}
   */
  isPaused() {
    return this._isPaused;
  }

  /**
   * @public
   * @return {boolean}
   */
  isStopped() {
    return this._isStopped;
  }

  /**
   * Start the timer
   * @public
   * @return {Timer}
   */
  start() {
    if (this._isStarted) {
      return this;
    }

    this.clear();
    this._startTime = process.hrtime();
    this._isStarted = true;
    return this;
  }

  /**
   * Pause the timer
   * @public
   * @return {Timer}
   */
  pause() {
    if (!this._isStarted) {
      return this;
    }

    this._pausedTime = this._getTime();
    this._startTime = null;
    this._isPaused = true;
    return this;
  }

  /**
   * Resume the timer
   * @public
   * @return {Timer}
   */
  resume() {
    if (!this._isPaused || this._isStopped) {
      return this;
    }

    this._startTime = process.hrtime();
    this._isPaused = false;
    return this;
  }

  /**
   * Stop the timer
   * @public
   * @return {Timer}
   */
  stop() {
    if (!this._isStarted) {
      return this;
    }

    if (!this._isPaused) {
      this._endTime = process.hrtime(this._startTime);
    }

    this._isStarted = false;
    this._isStopped = true;

    return this;
  }

  /**
   * Calculate the ellapsed time of the timer
   * @public
   * @returns {object}
   */
  time() {
    if (!this._isStarted && !this._isStopped) {
      return null;
    }

    if (this._isPaused) {
      return Object.assign({}, this._pausedTime);
    }

    return this._getTime();
  }

  /**
   * Format the recorded time using a template
   * @public
   * @param {string} template
   * @returns {string}
   */
  format(template = '%lbl: %s s, %ms ms, %us us, %ns ns') {
    if (!this._isStarted && !this._isStopped) {
      return null;
    }

    const time = this.time();
    return template
      .replace('%lbl', this._label)
      .replace('%s', time.s)
      .replace('%ms', time.ms)
      .replace('%us', time.us)
      .replace('%ns', time.ns);
  }

  /**
   * Clears the timer
   * @public
   * @return {Timer}
   */
  clear() {
    this._isStarted = false;
    this._isStopped = false;
    this._isPaused = false;
    this._startTime = null;
    this._endTime = null;
    this._pausedTime = null;

    return this;
  }

  /**
   * Creates a benchmark timer for a function call
   * @public
   * @static
   * @param {function} fn
   * @returns {Timer}
   */
  static benchmark(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Timer.benchmark expects a function');
    }

    const timer = new Timer(fn.name).start();
    fn();
    return timer.stop();
  }
}

module.exports = Timer;
