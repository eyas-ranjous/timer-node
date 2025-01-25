/**
 * timer-node
 * @copyright 2021 Eyas Ranjous
 * @license MIT
 */

/**
 * A timestamp-based timer that can be started, paused, resumed, and stopped.
 * @class
 */
class Timer {
  /**
   * Creates a new Timer instance.
   * @constructor
   * @param {TimerOptions} [options={}] - Optional configuration for initializing the timer.
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

    const startTs = startTimestamp >= 0 && startTimestamp < Date.now()
      ? startTimestamp
      : undefined;

    const endTs = startTs >= 0 && endTimestamp > 0 && endTimestamp > startTs
      ? endTimestamp
      : undefined;

    const currentTs = currentStartTimestamp >= startTs
      && (!endTs || currentStartTimestamp < endTs)
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
   * Returns the label of this timer.
   * @returns {string}
   */
  getLabel() {
    return this._label;
  }

  /**
   * Checks if the timer has been started.
   * @returns {boolean}
   */
  isStarted() {
    return this._startTimestamp >= 0;
  }

  /**
   * Checks if the timer is currently paused.
   * @returns {boolean}
   */
  isPaused() {
    return this.isStarted() && this._currentStartTimestamp === undefined;
  }

  /**
   * Checks if the timer is stopped.
   * @returns {boolean}
   */
  isStopped() {
    return this._endTimestamp > 0;
  }

  /**
   * Checks if the timer is running (started but neither paused nor stopped).
   * @returns {boolean}
   */
  isRunning() {
    return this.isStarted() && !this.isPaused() && !this.isStopped();
  }

  /**
   * Starts (or restarts) the timer. If already running and not stopped, this does nothing.
   * @returns {Timer} The timer instance (for method chaining).
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
   * Pauses the timer if it's currently running.
   * @returns {Timer} The timer instance (for method chaining).
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
   * Resumes the timer if it's currently paused.
   * @returns {Timer} The timer instance (for method chaining).
   */
  resume() {
    if (!this.isPaused() || this.isStopped()) {
      return this;
    }

    this._currentStartTimestamp = Date.now();
    return this;
  }

  /**
   * Stops the timer if it's started (running or paused).
   * @returns {Timer} The timer instance (for method chaining).
   */
  stop() {
    if (!this.isStarted()) {
      return this;
    }

    this._endTimestamp = Date.now();
    return this;
  }

  /**
   * Returns the elapsed running time in milliseconds.
   * - If the timer is running, the return value increases over time.
   * - If the timer is paused or stopped, the value is frozen until resumed or restarted.
   * @returns {number}
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
   * Returns the paused duration in milliseconds.
   * - If the timer is paused, this value increases over time until resumed.
   * - If the timer is running, this returns the total accumulated pause time up to now.
   * @returns {number}
   */
  pauseMs() {
    if (!this.isStarted()) {
      return 0;
    }

    const endTimestamp = this._endTimestamp || Date.now();
    return (endTimestamp - this._startTimestamp) - this.ms();
  }

  /**
   * Converts a millisecond count into a time breakdown (days, hours, minutes, seconds, ms).
   * @private
   * @param {number} ms - The millisecond value to convert.
   * @returns {Time} An object containing { d, h, m, s, ms }.
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
   * Returns the elapsed running time as a time breakdown (days, hours, minutes, seconds, ms).
   * @returns {Time}
   */
  time() {
    return this._getTime(this.ms());
  }

  /**
   * Returns the total pause time as a time breakdown (days, hours, minutes, seconds, ms).
   * @returns {Time}
   */
  pauseTime() {
    return this._getTime(this.pauseMs());
  }

  /**
   * Returns how many times the timer has been paused.
   * @returns {number}
   */
  pauseCount() {
    return this._pauseCount;
  }

  /**
   * Returns the start timestamp (in ms) if the timer has been started, otherwise undefined.
   * @returns {number|undefined}
   */
  startedAt() {
    return this._startTimestamp;
  }

  /**
   * Returns the stop timestamp (in ms) if the timer has been stopped, otherwise undefined.
   * @returns {number|undefined}
   */
  stoppedAt() {
    return this._endTimestamp;
  }

  /**
   * Formats the elapsed running time using placeholders.
   * - %label: Timer label
   * - %ms:   Milliseconds
   * - %s:    Seconds
   * - %m:    Minutes
   * - %h:    Hours
   * - %d:    Days
   *
   * @param {string} [template='%label%d d, %h h, %m m, %s s, %ms ms']
   * @returns {string} - The formatted time string.
   */
  format(template = '%label%d d, %h h, %m m, %s s, %ms ms') {
    const t = this.time();
    return template
      .replace('%label', this._label ? `${this._label}: ` : '')
      .replace('%ms', t.ms)
      .replace('%s', t.s)
      .replace('%m', t.m)
      .replace('%h', t.h)
      .replace('%d', t.d);
  }

  /**
   * Clears the timer, resetting it to an unstarted state.
   * @returns {Timer} The timer instance (for method chaining).
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
   * Serializes the timer's current state to a JSON string.
   * @returns {string}
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
   * Deserializes a timer from a JSON string and returns a new Timer instance.
   * @static
   * @param {string} serializedTimer - The JSON string created by `timer.serialize()`.
   * @returns {Timer} A new Timer instance based on the serialized data.
   */
  static deserialize(serializedTimer) {
    return new Timer(JSON.parse(serializedTimer));
  }

  /**
   * Creates a Timer instance to measure the execution time of a synchronous function.
   * @static
   * @param {Function} fn - The function to benchmark.
   * @throws {Error} If `fn` is not a function.
   * @returns {Timer} A stopped Timer instance reflecting how long `fn` took to execute.
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
