class Timer {
  constructor(label) {
    this._label = label || '';
    this._isRunning = false;
    this._startTime = null;
    this._endTime = null;
  }

  start() {
    if (this._isRunning) return;

    this._startTime = process.hrtime();
    this._isRunning = true;
  }

  stop() {
    if (!this._isRunning) return;

    this._endTime = process.hrtime(this._startTime);
    this._isRunning = false;
  }

  clear() {
    this._isRunning = false;
    this._startTime = null;
    this._endTime = null;
  }

  isRunning() {
    return this._isRunning;
  }

  nanoseconds() {
    if (this._endTime === null) return null;

    return this._endTime[1] % 1000;
  }

  microseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000) % 1000;
  }

  milliseconds() {
    if (this._endTime === null) return null;

    return Math.floor(this._endTime[1] / 1000000);
  }

  seconds() {
    if (this._endTime === null) return null;

    return this._endTime[0];
  }

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
