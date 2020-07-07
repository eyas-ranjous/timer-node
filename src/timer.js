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
   * @public
   * starts the timer
   * @return {Timer}
   */
  start() {
    if (this._isRunning) return this;

    this._startTime = process.hrtime();
    this._isRunning = true;

    return this;
  }

  /**
   * @public
   * stops the timer
   * @return {Timer}
   */
  stop() {
    if (!this._isRunning) return this;

    this._endTime = process.hrtime(this._startTime);
    this._isRunning = false;

    return this;
  }

  /**
   * @public
   * clears the timer
   * @return {Timer}
   */
  clear() {
    this._isRunning = false;
    this._startTime = null;
    this._endTime = null;

    return this;
  }

  /**
   * @public
   * checks if the timer is running
   * @returns {boolean}
   */
  isRunning() {
    return this._isRunning;
  }

  /**
   * @public
   * calculate the nano-seconds part of the time
   * @returns {number}
   */
  nanoseconds() {
    if (this._endTime === null) return null;

    return this._endTime[1] % 1000;
  }

  /**
   * @public
   * calculate the micro-seconds part of the time
   * @returns {number}
   */
  microseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000) % 1000;
  }

  /**
   * @public
   * calculate the milli-seconds part of the time
   * @returns {number}
   */
  milliseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000000);
  }

  /**
   * @public
   * calculate the seconds part of the time
   * @returns {number}
   */
  seconds() {
    if (this._endTime === null) return null;

    return this._endTime[0];
  }

  /**
   * @public
   * formats the recorded time using a template
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
}

module.exports = Timer;
