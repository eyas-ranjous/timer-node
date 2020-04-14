# timer-node

[![build:?](https://travis-ci.org/node-work/timer-node.svg?branch=master)](https://travis-ci.org/node-work/timer-node) [![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A simple timer that enables recording ellapsed time and format the result.

# Table of Contents
* [Install](#install)
* [API](#api)
  * [require](#require)
  * [import](#import)
  * [Construction](#construction)
  * [.start()](#start)
  * [.stop()](#stop)
  * [.isRunning()](#isrunning)
  * [.seconds()](#seconds)
  * [.milliseconds()](#milliseconds)
  * [.microseconds()](#microseconds)
  * [.nanoseconds()](#nanoseconds)
  * [.format(template)](#format)
 * [Build](#build)
 * [License](#license)

## Install

```
npm install --save timer-node
```

## API

### require

```js
const Timer = require('timer-node');
```

### import

```js
import Timer from 'timer-node';
```

### Construction
```js
const timer = new Timer('test-timer');
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


### .isRunning()
checks if the timer is running and hasn't been stopped

```js
console.log(timer.isRunning()); // false
```

### .seconds()
return the seconds part in the recorded time

```js
console.log(timer.seconds()); // 4
```

### .milliseconds()
return the milliseconds part in the recorded time

```js
console.log(timer.milliseconds()); // 254
```

### .microseconds()
return the microseconds part in the recorded time

```js
console.log(timer.microseconds()); // 782
```

### .nanoseconds()
return the nanoseconds part in the recorded time

```js
console.log(timer.nanoseconds()); // 615
```

### .format(template)
formats the recorded time using a custom or default template. The function replaces the time fractions placeholders in a string. Placeholders are:

* `%lbl` for the timer label.
* `%s` for the seconds.
* `%ms` for the milliseconds.
* `%us` for the microseconds.
* `%ns` for the nanoseconds.

```js
// using the default template
console.log(timer.format()); // test-timer: 4 s, 254 ms, 782 us, 615 ns

// using a custom template
const custom = '%lbl [%s] s [%ms] ms';
console.log(timer.format(custom)); // test-timer [4] s [254] ms
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
The MIT License. Full License is [here](https://github.com/node-work/timer-node/blob/master/LICENSE)
