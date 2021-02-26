# timer-node

[![build:?](https://travis-ci.org/eyas-ranjous/timer-node.svg?branch=master)](https://travis-ci.org/eyas-ranjous/timer-node) [![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A simple timer with pause/resume capability that enables recording elapsed time and format the result.

# Table of Contents
* [Install](#install)
* [API](#api)
  * [require](#require)
  * [import](#import)
  * [Construction](#construction)
  * [.start()](#start)
  * [.isStarted()](#isstarted)
  * [.pause()](#pause)
  * [.isPaused()](#pause)
  * [.resume()](#resume)
  * [.stop()](#stop)
  * [.isStopped()](#stop)
  * [.time()](#time)
  * [.format([template])](#format)
  * [.clear()](#clear)
  * [Timer.benchmark(fn)](#timerbenchmarkfn)
 * [Build](#build)
 * [License](#license)

## Install

```
npm install --save timer-node
```

## API

### require

```js
const { Timer } = require('timer-node');
```

### import

```js
import { Timer } from 'timer-node';
```

### Construction
```js
const timer = new Timer('test-timer');
```

### .start()
starts the timer. returns a timer reference.

```js
timer.start();
```

### .isStarted()
returns true if the timer is started. False if timer is not started or it's been stopped.

```js
console.log(timer.isStarted()); // true
```

### .pause()
Pause the timer and memoize the elapsed time. returns a timer reference.

```js
timer.pause();
```

### .isPaused()
returns true if the timer is paused. False if timer is not started or it's been resumed after a pause.

```js
console.log(timer.isPaused()); // true
```

### .resume()
Resume the timer. It creates a new starting point for the timer. returns a timer reference.

```js
timer.resume();
```

### .time()
return the elapsed time as an object. It can be called while the timer is running or when it is paused or stopped and will return the current recorded time plus the memoized pause times.

* `s`: seconds
* `ms`: milliseconds
* `us`: microseconds
* `ns`: nanoseconds

```js
console.log(timer.time()); // { s: 14, ms: 496, us: 303, ns: 508 }

console.log(timer.time()); // { s: 21, ms: 321, us: 487, ns: 783 }

console.log(timer.time()); // { s: 36, ms: 674, us: 616, ns: 145 }
```

### .stop()
stops the timer. returns a timer reference.

```js
timer.stop();

console.log(timer.time()); // { s: 85, ms: 39, us: 492, ns: 853 }
console.log(timer.time()); // { s: 85, ms: 39, us: 492, ns: 853 }
```

### .isStopped()
returns true if the timer is stopped. False otherwise.

```js
console.log(timer.isStopped()); // true
```

### .format(template)
formats the elapsed time using a custom or default template. The function replaces the time fractions placeholders in a string. Placeholders are:

* `%lbl` for timer label.
* `%s` for seconds.
* `%ms` for milliseconds.
* `%us` for microseconds.
* `%ns` for nanoseconds.

```js
// using the default template
console.log(timer.format()); // test-timer: 4 s, 254 ms, 782 us, 615 ns

// using a custom template
const custom = '%lbl [%s] s [%ms] ms';
console.log(timer.format(custom)); // test-timer [4] s [254] ms
```

### .clear()
clears the timer values. Can be started again to record new time. It also returns a timer reference.

```js
timer.clear();
console.log(timer.time()); // null
```

### Timer.benchmark(fn)
creates a benchmark timer for a function call.

```js
const fn = (a) => {
  let sum = 0;
  for (let i = 0; i < 10000000; i += 1) {
    sum += a * i;
  }
  return sum;
}

const benchmark = Timer.benchmark(fn.bind(fn, 5));
console.log(benchmark.milliseconds()); // 29
console.log(benchmark.format()); // bound fn: 0 s, 29 ms, 43 us, 882 ns
```

## Build
```
grunt build
```

## License
The MIT License. Full License is [here](https://github.com/eyas-ranjous/timer-node/blob/master/LICENSE)
