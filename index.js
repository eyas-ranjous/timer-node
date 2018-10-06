module.exports = (label) => {
  const lbl = label || '';
  let running = false;
  let startTime = null;
  let endTime = null;

  const start = () => {
    if (!running) {
      startTime = process.hrtime();
      running = true;
    }
  };

  const stop = () => {
    if (running) {
      endTime = process.hrtime(startTime);
      running = false;
    }
  };

  const clear = () => {
    startTime = null;
    endTime = null;
    running = false;
  };

  const isRunning = () => running;

  const isStopped = () => endTime !== null;

  const seconds = () => (
    endTime !== null ? endTime[0] : null
  );

  const milliseconds = () => {
    if (endTime !== null) {
      return Math.floor(endTime[1] / 1e6);
    }
    return null;
  };

  const microseconds = () => {
    if (endTime !== null) {
      return Math.floor(endTime[1] / 1e3) % 1e3;
    }
    return null;
  };

  const nanoseconds = () => {
    if (endTime !== null) {
      return endTime[1] % 1e3;
    }
    return null;
  };

  const format = (f) => {
    if (endTime !== null) {
      const template = f || '%label: %s s, %ms ms, %us us, %ns ns';
      return template
        .replace('%label', lbl)
        .replace('%s', seconds())
        .replace('%ms', milliseconds())
        .replace('%us', microseconds())
        .replace('%ns', nanoseconds());
    }
    return null;
  };

  return {
    start,
    stop,
    clear,
    isRunning,
    isStopped,
    seconds,
    milliseconds,
    microseconds,
    nanoseconds,
    format
  };
};
