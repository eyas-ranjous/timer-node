/**
 * timer-node
 * @copyright 2020 Eyas Ranjous <eyas.ranjous@gmail.com>
 * @license MIT
 */

/**
 * @class Timer
 */
class Timer {
  constructor(label) {
    this._label = label || '';
    this._isRunning = false;
    this._startTime = null;
    this._endTime = null;
  }

  /**
   * Starts the timer
   * @public
   * @return {Timer}
   */
  start() {
    if (this._isRunning) return this;

    this._startTime = process.hrtime();
    this._isRunning = true;

    return this;
  }

  /**
   * Stops the timer
   * @public
   * @return {Timer}
   */
  stop() {
    if (!this._isRunning) return this;

    this._endTime = process.hrtime(this._startTime);
    this._isRunning = false;

    return this;
  }

  /**
   * Clears the timer
   * @public
   * @return {Timer}
   */
  clear() {
    this._isRunning = false;
    this._startTime = null;
    this._endTime = null;

    return this;
  }

  /**
   * Checks if the timer is running
   * @public
   * @returns {boolean}
   */
  isRunning() {
    return this._isRunning;
  }

  /**
   * Calculate the nano-seconds part of the time
   * @public
   * @returns {number}
   */
  nanoseconds() {
    if (this._endTime === null) return null;

    return this._endTime[1] % 1000;
  }

  /**
   * Calculate the micro-seconds part of the time
   * @public
   * @returns {number}
   */
  microseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000) % 1000;
  }

  /**
   * Calculate the milli-seconds part of the time
   * @public
   * @returns {number}
   */
  milliseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000000);
  }

  /**
   * Calculate the seconds part of the time
   * @public
   * @returns {number}
   */
  seconds() {
    if (this._endTime === null) return null;

    return this._endTime[0];
  }

  /**
   * Formats the recorded time using a template
   * @public
   * @param {string} template
   * @returns {string}
   */
  format(template = '%lbl: %s s, %ms ms, %us us, %ns ns') {
    if (this._endTime === null) return null;

    return template
      .replace('%lbl', this._label)
      .replace('%s', this.seconds())
      .replace('%ms', this.milliseconds())
      .replace('%us', this.microseconds())
      .replace('%ns', this.nanoseconds());
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
      throw new Error('.benchmark expects a function');
    }
    const timer = new Timer(fn.name).start();
    fn();
    return timer.stop();
  }
}

module.exports = Timer;
