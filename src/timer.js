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
    this._endTime = null;
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
   * Calculate the time parts of the timer
   * @public
   * @returns {object}
   */
  time() {
    if (this._startTime === null) return null;

    const endTime = this._isRunning
      ? process.hrtime(this._startTime)
      : this._endTime;

    return {
      s: endTime[0],
      ms: Math.floor(endTime[1] / 1000000),
      us: Math.floor(endTime[1] / 1000) % 1000,
      ns: endTime[1] % 1000
    };
  }

  /**
   * Formats the recorded time using a template
   * @public
   * @param {string} template
   * @returns {string}
   */
  format(template = '%lbl: %s s, %ms ms, %us us, %ns ns') {
    if (this._startTime === null) return null;

    const time = this.time();
    return template
      .replace('%lbl', this._label)
      .replace('%s', time.s)
      .replace('%ms', time.ms)
      .replace('%us', time.us)
      .replace('%ns', time.ns);
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
