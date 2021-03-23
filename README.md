# timer-node

[![build:?](https://travis-ci.org/eyas-ranjous/timer-node.svg?branch=master)](https://travis-ci.org/eyas-ranjous/timer-node) [![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A timestamp-based timer that enables recording elapsed time and formatting the result.

✅&nbsp; It does **NOT** use setInterval/setTimeout/process<br />
✅&nbsp; It works in **Javascript** & **Typescript**<br />
✅&nbsp; It works in **Nodejs** & **Reactjs**

# Table of Contents
* [Install](#install)
* [API](#api)
  * [require](#require)
  * [import](#import)
  * [new](#new)
  * [start](#start)
  * [isStarted](#isstarted)
  * [pause](#pause)
  * [isPaused](#ispaused)
  * [resume](#resume)
  * [ms](#ms)
  * [time](#time)
  * [format](#formattemplate)
  * [pauseMs](#pauseMs)
  * [pauseCount](#pauseMs)
  * [pauseTime](#pauseTime)
  * [stop](#stop)
  * [isStopped](#isstopped)
  * [serialize](#serialize)
  * [clear](#clear)
  * [Timer.deserialize](#deserialize)
  * [Timer.benchmark](#timerbenchmarkfn)
 * [Build](#build)
 * [License](#license)

## Install

```
npm install --save timer-node
```

## API

### require

#### JS

```js
const { Timer } = require('timer-node');
```

#### TS

```js
const { Timer, Time, TimerOptions } = require('timer-node');
```

### import

#### JS

```js
import { Timer } from 'timer-node';
```

#### TS

```js
import { Timer, Time, TimerOptions } from 'timer-node';
```

### new

<table>
  <tr>
    <th align="center">params</th>
  </tr>
  <tr>
    <td align="center">options: object (TimerOptions)</td>
  </tr>
</table>

```js
const timer = new Timer({ label: 'test-timer' });

// or from a past timestamp
const timer = new Timer({
  label: 'test-timer',
  startTimestamp: 1563074001233 // 2019-07-14 03:13:21.233Z
});
```

### .start
starts the timer.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
timer.start();
```

### .isStarted
returns true if the timer was started.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">boolean</td>
  </tr>
</table>


```js
console.log(timer.isStarted()); // true
```

### .pause
pauses the timer and memoizes elapsed running time.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
timer.pause();
```

### .isPaused
returns true if the timer is paused, false if timer is not started or it's been resumed after a pause.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">boolean</td>
  </tr>
</table>

```js
console.log(timer.isPaused()); // true
```

### .resume()
resumes the timer by creating a new starting timestamp.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
timer.resume();
```

### ms
returns the total milliseconds of elapsed time while timer is running or when stopped.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

```js
console.log(timer.ms()); // 37606
console.log(timer.ms()); // 91843
console.log(timer.ms()); // 135377
```

### .time
returns the elapsed time as an object of time fractions while timer is running or when stopped.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">object (Time)</td>
  </tr>
</table>

* `ms`: milliseconds
* `s`: seconds
* `m`: minutes
* `h`: hours
* `d`: days

```js
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 7, ms: 921 }
console.log(timer.time()); // { d: 0, h: 0, m: 4, s: 44, ms: 321 }
console.log(timer.time()); // { d: 0, h: 3, m: 55, s: 12, ms: 910 }
```

### .stop
stops the timer. The timer can be started again by calling `.start()` which clears recorded values. 

```js
timer.stop();

console.log(timer.time()); // { s: 85, ms: 39, us: 492, ns: 853 }
console.log(timer.time()); // { s: 85, ms: 39, us: 492, ns: 853 }
```

### .isStopped()
returns true if the timer is stopped, false otherwise.

```js
console.log(timer.isStopped()); // true
```

### .format([template])
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
clears the timer values. can be started again by calling `.start()`.

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
console.log(benchmark.time()); // { s: 0, ms: 53, us: 193, ns: 368 }
console.log(benchmark.format()); // bound fn: 0 s, 53 ms, 193 us, 368 ns
```

## Build
```
grunt build
```

## License
The MIT License. Full License is [here](https://github.com/eyas-ranjous/timer-node/blob/master/LICENSE)
