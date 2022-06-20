# timer-node

[![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A timestamp-based timer that enables recording elapsed time and formatting the result.

It does **NOT** use *setInterval*, *setTimeout* or *process*

\[**Start**\]---ms---\[**Pause**\]--pause ms--\[**Resume**\]---ms---\[**Pause**\]--pause ms--\[**Resume**\]---ms---\[**Stop**\]

<img src="https://user-images.githubusercontent.com/6517308/121813242-859a9700-cc6b-11eb-99c0-49e5bb63005b.jpg">

# Contents
* [Install](#install)
* [require](#require)
* [import](#import)
* [API](#api)
  * [constructor](#constructor)
  * [start](#start)
  * [isStarted](#isstarted)
  * [startedAt](#startedat)
  * [pause](#pause)
  * [isPaused](#ispaused)
  * [resume](#resume)
  * [isRunning](#isrunning)
  * [ms](#ms)
  * [time](#time)
  * [format](#format)
  * [pauseMs](#pauseMs)
  * [pauseCount](#pauseMs)
  * [pauseTime](#pauseTime)
  * [stop](#stop)
  * [isStopped](#isstopped)
  * [stoppedAt](#stoppedat)
  * [serialize](#serialize)
  * [getLabel](#getlabel)
  * [clear](#clear)
  * [Timer.deserialize](#timerdeserialize)
  * [Timer.benchmark](#timerbenchmarkfn)
 * [Build](#build)
 * [License](#license)

## Install

```
npm install --save timer-node
```

## require

```js
const { Timer } = require('timer-node');
```

## import

```js
import { Timer, Time, TimerOptions } from 'timer-node';
```

## API

### constructor

```js
const timer = new Timer({ label: 'test-timer' });
```

It's also possible to create the timer from a past timestamp.

```js
const timer = new Timer({
  label: 'test-timer',
  startTimestamp: 1563074001233 // 2019-07-14 03:13:21.233Z
});

console.log(timer.isStarted()); // true
console.log(timer.time()); // { d: 619, h: 16, m: 26, s: 11, ms: 207 }
```

### start
starts the timer.

```js
timer.start();
```

### isStarted
returns true if the timer is started.

```js
console.log(timer.isStarted()); // true
```

### startedAt
returns the starting timestamp.

```js
console.log(timer.startedAt()); // 1616535899945
```

### pause
pauses the timer and memoizes elapsed running time.

```js
timer.pause();
```

### isPaused
checks if the timer is paused.

```js
console.log(timer.isPaused()); // true
```

### resume
resumes the timer.

```js
timer.resume();
```

### isRunning
checks if the timer is started and not paused or stopped.

```js
timer.isRunning(); // true
```

### ms
returns the running duration in milliseconds. It can be measured while timer is running or when paused or stopped.

```js
// when timer is running, calling .ms() will dynamically calculate progressing milliseconds
console.log(timer.ms()); // 37606
console.log(timer.ms()); // 91843
console.log(timer.ms()); // 135377

// when timer is paused or stopped, .ms() will return the same value
console.log(timer.ms()); // 270754
console.log(timer.ms()); // 270754
```

### time
returns the running duration as an object of time fractions. It can be measured while timer is running or when stopped.

* `ms`: milliseconds
* `s`: seconds
* `m`: minutes
* `h`: hours
* `d`: days

```js
// when timer is running, calling .time() will dynamically calculate progressing time
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 7, ms: 921 }
console.log(timer.time()); // { d: 0, h: 0, m: 4, s: 44, ms: 321 }
console.log(timer.time()); // { d: 0, h: 3, m: 55, s: 12, ms: 910 }

// when timer is paused or stopped, .time() will return the same value
console.log(timer.time()); // { d: 0, h: 4, m: 5, s: 52, ms: 770 }
console.log(timer.time()); // { d: 0, h: 4, m: 5, s: 52, ms: 770 }
```

### format
formats the running duration using a custom or default template.

The function replaces time placeholders in a string. Placeholders are:

* `%label` for timer label.
* `%ms` for milliseconds.
* `%s` for seconds.
* `%m` for minutes.
* `%h` for hours.
* `%d` for days.

```js
// using the default template
console.log(timer.format()); // test-timer: 0 d, 1 h, 44 m, 23 s, 977 ms

// using a custom template
console.log(timer.format('%label [%s] seconds [%ms] ms')); // test-timer [4] seconds [254] ms
```

### pauseMs
returns the pause duration in milliseconds. It can be measured while timer is paused or when running.

```js
// when timer is paused, calling pauseMs will dynamically calculate progressing pause milliseconds
console.log(timer.pauseMs()); // 3878
console.log(timer.pauseMs()); // 5990
console.log(timer.pauseMs()); // 7997

// when timer is resumed, pauseMs will return the same previousely accomulated pauses
timer.stop();
console.log(timer.pauseMs()); // 97264
console.log(timer.pauseMs()); // 97264
```

### pauseTime
returns the pause duration as an object of time fractions. It can be measured while timer is paused or when running.

* `ms`: milliseconds
* `s`: seconds
* `m`: minutes
* `h`: hours
* `d`: days

```js
// when timer is paused, calling pauseMs will dynamically calculate progressing pause time
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 4, ms: 675 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 6, ms: 328 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 7, ms: 904 }

// when timer is resumed, pauseMs will return the same previousely accomulated pauses
timer.resume();
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 12, ms: 143 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 12, ms: 143 }
```

### pauseCount
returns the number of times the timer was paused.

```js
console.log(timer.pauseCount()); // 2
```

### stop
stops the timer. The timer can be started again by calling `.start()` which clears all recorded values.

```js
timer.stop();

console.log(timer.time()); // { d: 0, h: 0, m: 2, s: 44, ms: 453 }
console.log(timer.time()); // { d: 0, h: 0, m: 2, s: 44, ms: 453 }
```

### isStopped
checks if the timer has been stopped.

```js
console.log(timer.isStopped()); // true
```

### stoppedAt
returns the stop timestamp.

```js
console.log(timer.stoppedAt()); // undefined
timer.stop();
console.log(timer.stoppedAt()); // 1616535948456
```

### serialize
serializes the timer in its current state.

```js
console.log(timer.serialize());
// '{"startTimestamp":1616535216209,"currentStartTimestamp":1616535227790,"endTimestamp":1616535258945,"accumulatedMs":6249,"pauseCount":3,"label":"test"}'
```

### getLabel
returns the timer's label

```js
console.log(timer.getLabel()); // test-timer
```

### clear
clears the timer values. can be started again by calling `.start()`.

```js
timer.clear();
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 0, ms: 0 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 0, ms: 0 }
```

### Timer.deserialize
re-construct a timer from its serialized form.

```js
const timerStr = '{"startTimestamp":1616535216209,"currentStartTimestamp":1616535227790,"endTimestamp":1616535258945,"accumulatedMs":6249,"pauseCount":3,"label":"test"}';

const timer = Timer.deserialize(timerStr);

console.log(timer.isStopped()); // true
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 37, ms: 404 }
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
console.log(benchmark.time()); // { d: 0, h: 0, m: 0, s: 0, ms: 53 }
console.log(benchmark.format('%label: %ms ms')); // bound fn: 53 ms
```

## Build
```
grunt build
```

## License
The MIT License. Full License is [here](https://github.com/eyas-ranjous/timer-node/blob/master/LICENSE)
