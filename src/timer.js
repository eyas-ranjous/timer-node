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
   */
  constructor(options = {}) {
    const timestamp = (options.timestamp > 0 && options.timestamp < Date.now())
      ? options.timestamp
      : null;

    this._label = options.label || '';
    this._startTimestamp = timestamp;
    this._currentStartTimestamp = timestamp;
    this._endTimestamp = null;
    this._pauseCount = 0;
    this._pauseMs = 0;
  }

  /**
   * Get the ellapsed time in milliseconds of a started timer
   * @private
   * @return {object}
   */
  _getEllapsedTimeMs() {
    const endTimestamp = this.isStopped() ? this._endTimestamp : Date.now();
    const currentMs = endTimestamp - this._currentStartTimestamp;
    return currentMs + this._pauseMs;
  }

  /**
   * @public
   * @return {boolean}
   */
  isStarted() {
    return !!this._startTimestamp;
  }

  /**
   * @public
   * @return {boolean}
   */
  isPaused() {
    return this.isStarted() && this._currentStartTimestamp === null;
  }

  /**
   * @public
   * @return {boolean}
   */
  isStopped() {
    return !!this._endTimestamp;
  }

  /**
   * @public
   * @return {boolean}
   */
  isRunning() {
    return this.isStarted() && !this.isStopped();
  }

  /**
   * Start the timer
   * @public
   * @return {Timer}
   */
  start() {
    if (this.isStarted()) {
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
    if (!this.isStarted()) {
      return this;
    }

    this._pauseMs = this._getEllapsedTimeMs();
    this._pauseCount += 1;
    this._currentStartTimestamp = null;
    return this;
  }

  /**
   * Resume the timer
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
   * Stop the timer
   * @public
   * @return {Timer}
   */
  stop() {
    if (!this.isStarted()) {
      return this;
    }

    if (!this.isPaused()) {
      this._endTimestamp = Date.now();
    }

    return this;
  }

  /**
   * Returns the ellapsed time in milliseconds
   * @public
   * @return {number}
   */
  ms() {
    if (!this.isStarted() && !this.isStopped()) {
      return 0;
    }

    if (this.isPaused()) {
      return this._pauseMs;
    }

    return this._getEllapsedTimeMs();
  }

  /**
   * Returns the total of milliseconds of pauses
   * @public
   * @return {number}
   */
  pauseMs() {
    return this._pauseMs;
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
      d,
      h: h % 24,
      m: m % 60,
      s: s % 60,
      ms: ms % 1000
    };
  }

  /**
   * Returns the ellapsed time as an object of time fractions
   * @public
   * @returns {object}
   */
  time() {
    return this._getTime(this.ms());
  }

  /**
   * Returns the pauses time as an object of time fractions
   * @public
   * @returns {object}
   */
  pauseTime() {
    return this._getTime(this._pauseMs);
  }

  /**
   * Returns the number of times the timer was paused
   * @public
   * @returns {number}
   */
  pauseCount() {
    return this._pauseCount;
  }

  /**
   * Returns the timestamp of timer's start
   * @public
   * @returns {number}
   */
  startedAt() {
    return this._startTimestamp;
  }

  /**
   * Returns the timestamp of timer's end
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
      .replace('%d', time.d)
      .replace('%h', time.h)
      .replace('%m', time.m)
      .replace('%s', time.s)
      .replace('%ms', time.ms);
  }

  /**
   * Clears the timer
   * @public
   * @return {Timer}
   */
  clear() {
    this._startTimestamp = null;
    this._currentStartTimestamp = null;
    this._endTimestamp = null;
    this._pauseMs = 0;
    this._pauseCount = 0;
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

exports.Timer = Timer;
