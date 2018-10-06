# timer-node

[![build:?](https://travis-ci.org/js-shelf/timer-node.svg?branch=master)](https://travis-ci.org/js-shelf/timer-node) [![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A simple timer object that enables recording time and format the result.

## Install
```
npm install --save timer-node
```

## Usage

### Creation
```js
const timerFn = require('timer-node');
const timer = timerFn('test-timer');
```

### .start()
starts the timer

```js
timer.start();
```

### .stop()
stops the timer

```js
timer.stop();
```

### .seconds()
return the seconds part in the recorded timer

```js
console.log(timer.seconds()); // 4
```

### .milliseconds()
return the milliseconds part in the recorded timer

```js
console.log(timer.milliseconds()); // 254
```

### .microseconds()
return the microseconds part in the recorded timer

```js
console.log(timer.microseconds()); // 782
```

### .nanoseconds()
return the nanoseconds part in the recorded timer

```js
console.log(timer.nanoseconds()); // 615
```

### .isRunning()
checks if the timer is running and hasn't been stopped

```js
console.log(timer.isRunning()); // false
```

### .isStopped()
checks if the timer has been stopped

```js
console.log(timer.isStopped()); // true
```

### .format(template)
formats the recorded time using a custom or default template. The function replaces the time fractions placeholders in a string. Placeholders are:

* `%label` for the timer label.
* `%s` for the seconds.
* `%ms` for the milliseconds.
* `%us` for the microseconds.
* `%ns` for the nanoseconds.

```js
// using the default template
console.log(timer.format()); // test-timer: 4 s, 254 ms, 782 us, 615 ns

// using a custom template
const custom = '%label: [%s secs %ms ms]';
console.log(timer.format(custom)); // test-timer: [4 secs 254 ms]
```

### .clear()
clears the timer values. Can be started again to record new time.

```js
timer.clear();
console.log(timer.seconds()); // null
```

## Build
```
grunt build
```

## License
The MIT License. Full License is [here](https://github.com/js-shelf/timer-node/blob/master/LICENSE)
