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
   * @param {object} [options]
   * @return {Timer}
   */
  constructor(options = {}) {
    const {
      label,
      startTimestamp,
      endTimestamp,
      currentStartTimestamp,
      pauseCount,
      accumulatedMs
    } = options;

    const startTs = (startTimestamp >= 0 && startTimestamp < Date.now())
      ? startTimestamp
      : undefined;

    const endTs = (startTs >= 0 && endTimestamp > 0 && endTimestamp > startTs)
      ? endTimestamp
      : undefined;

    const currentTs = (currentStartTimestamp >= startTs
      && (!endTs || currentStartTimestamp < endTs))
      ? currentStartTimestamp
      : startTs;

    const isStarted = startTimestamp >= 0;
    const isRunning = currentStartTimestamp !== undefined;
    const wasPausedAtLeastOneTime = pauseCount > 0;
    const isPaused = isStarted && !isRunning && wasPausedAtLeastOneTime;

    this._label = label || '';
    this._startTimestamp = startTs;
    this._currentStartTimestamp = !isPaused ? currentTs : undefined;
    this._endTimestamp = endTs;
    this._pauseCount = pauseCount || 0;
    this._accumulatedMs = accumulatedMs || 0;
  }

  /**
   * @public
   * @return {string}
   */
  getLabel() {
    return this._label;
  }

  /**
   * @public
   * @return {boolean}
   */
  isStarted() {
    return this._startTimestamp >= 0;
  }

  /**
   * @public
   * @return {boolean}
   */
  isPaused() {
    return this.isStarted() && this._currentStartTimestamp === undefined;
  }

  /**
   * @public
   * @return {boolean}
   */
  isStopped() {
    return this._endTimestamp > 0;
  }

  /**
   * @public
   * @return {boolean}
   */
  isRunning() {
    return this.isStarted() && !this.isPaused() && !this.isStopped();
  }

  /**
   * Start the timer
   * @public
   * @return {Timer}
   */
  start() {
    if (this.isStarted() && !this.isStopped()) {
      return this;
    }

    this.clear();
    this._startTimestamp = Date.now();
    this._currentStartTimestamp = this._startTimestamp;
    return this;
  }

  /**
   * Pause the timer
   * @public
   * @return {Timer}
   */
  pause() {
    if (this.isPaused() || !this.isStarted() || this.isStopped()) {
      return this;
    }

    this._pauseCount += 1;
    this._accumulatedMs += Date.now() - this._currentStartTimestamp;
    this._currentStartTimestamp = undefined;
    return this;
  }

  /**
   * Resume the paused timer
   * @public
   * @return {Timer}
   */
  resume() {
    if (!this.isPaused() || this.isStopped()) {
      return this;
    }

    this._currentStartTimestamp = Date.now();
    return this;
  }

  /**
   * Stop the started timer
   * @public
   * @return {Timer}
   */
  stop() {
    if (!this.isStarted()) {
      return this;
    }

    this._endTimestamp = Date.now();
    return this;
  }

  /**
   * Returns the elapsed running time in milliseconds
   * @public
   * @return {number}
   */
  ms() {
    if (!this.isStarted()) {
      return 0;
    }

    if (this.isPaused()) {
      return this._accumulatedMs;
    }

    const endTimestamp = this._endTimestamp || Date.now();
    const currentMs = endTimestamp - this._currentStartTimestamp;
    return currentMs + this._accumulatedMs;
  }

  /**
   * Returns the total of milliseconds of pauses
   * @public
   * @return {number}
   */
  pauseMs() {
    if (!this.isStarted()) {
      return 0;
    }

    const endTimestamp = this._endTimestamp || Date.now();
    return (endTimestamp - this._startTimestamp) - this.ms();
  }

  /**
   * @private
   * @return {object}
   */
  _getTime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    return {
      ms: ms % 1000,
      s: s % 60,
      m: m % 60,
      h: h % 24,
      d
    };
  }

  /**
   * Returns the elapsed time as an object of time fractions
   * @public
   * @returns {object}
   */
  time() {
    return this._getTime(this.ms());
  }

  /**
   * Returns the paused time as an object of time fractions
   * @public
   * @returns {object}
   */
  pauseTime() {
    return this._getTime(this.pauseMs());
  }

  /**
   * Returns the number of pauses
   * @public
   * @returns {number}
   */
  pauseCount() {
    return this._pauseCount;
  }

  /**
   * Returns the start timestamp
   * @public
   * @returns {number}
   */
  startedAt() {
    return this._startTimestamp;
  }

  /**
   * Returns the stop timestamp
   * @public
   * @returns {number}
   */
  stoppedAt() {
    return this._endTimestamp;
  }

  /**
   * Format the recorded time using a template
   * @public
   * @param {string} template
   * @returns {string}
   */
  format(template = '%label%d d, %h h, %m m, %s s, %ms ms') {
    const time = this.time();
    return template
      .replace('%label', this._label ? `${this._label}: ` : '')
      .replace('%ms', time.ms)
      .replace('%s', time.s)
      .replace('%m', time.m)
      .replace('%h', time.h)
      .replace('%d', time.d);
  }

  /**
   * Clears the timer
   * @public
   * @return {Timer}
   */
  clear() {
    this._startTimestamp = undefined;
    this._currentStartTimestamp = undefined;
    this._endTimestamp = undefined;
    this._accumulatedMs = 0;
    this._pauseCount = 0;
    return this;
  }

  /**
   * Serialize the timer
   * @public
   * @return {string}
   */
  serialize() {
    return JSON.stringify({
      startTimestamp: this._startTimestamp,
      currentStartTimestamp: this._currentStartTimestamp,
      endTimestamp: this._endTimestamp,
      accumulatedMs: this._accumulatedMs,
      pauseCount: this._pauseCount,
      label: this._label
    });
  }

  /**
   * Deserialize the timer
   * @public
   * @param {string} serializedTime
   * @return {Timer}
   */
  static deserialize(serializedTime) {
    return new Timer(JSON.parse(serializedTime));
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

    const timer = new Timer({ label: fn.name }).start();
    fn();
    return timer.stop();
  }
}

exports.Timer = Timer;
