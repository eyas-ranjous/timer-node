# timer-node

[![build:?](https://travis-ci.org/eyas-ranjous/timer-node.svg?branch=master)](https://travis-ci.org/eyas-ranjous/timer-node) [![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node) [![npm](https://img.shields.io/badge/node-%3E=%206.0-blue.svg)](https://www.npmjs.com/package/timer-node)

A timestamp-based timer that enables recording elapsed time and formatting the result.

\[**Start**\]---ms---\[**Pause**\]--pause ms--\[**Resume**\]---ms---\[**Pause**\]--pause ms--\[**Resume**\]---ms---\[**Stop**\]

🔹 &nbsp; It does **NOT** use setInterval, setTimeout or process<br />
🔹 &nbsp; It works in **Javascript** and **Typescript**<br />
🔹 &nbsp; It works in **Nodejs** and **Reactjs**

# Table of Contents
* [Install](#install)
* [API](#api)
  * [require](#require)
  * [import](#import)
  * [new](#new)
  * [start](#start)
  * [isStarted](#isstarted)
  * [startedAt](#startedat)
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
  * [stoppedAt](#stoppedat)
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
```

It's also possible to create the timer from a past timestamp. In this case, the timer will be considered started at the past.

```js
const timer = new Timer({
  label: 'test-timer',
  startTimestamp: 1563074001233 // 2019-07-14 03:13:21.233Z
});
```

### start
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

### isStarted
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

### startedAt
returns the starting timestamp.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

```js
console.log(timer.startedAt()); // 1616535899945
```


### pause
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

### isPaused
returns true if the timer is paused.

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

### resume
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
returns the total milliseconds of elapsed running time. It can be measured while timer is running or when stopped.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

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
returns the elapsed running time as time fractions. It can be measured while timer is running or when stopped.

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
// when timer is running, calling .time() will dynamically calculate progressing time
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 7, ms: 921 }
console.log(timer.time()); // { d: 0, h: 0, m: 4, s: 44, ms: 321 }
console.log(timer.time()); // { d: 0, h: 3, m: 55, s: 12, ms: 910 }

// when timer is paused or stopped, .time() will return the same value
console.log(timer.time()); // { d: 0, h: 4, m: 5, s: 52, ms: 770 }
console.log(timer.time()); // { d: 0, h: 4, m: 5, s: 52, ms: 770 }
```

### format
formats the elapsed time using a custom or default template. The function replaces the time fractions placeholders in a string. Placeholders are:

<table>
  <tr>
    <th align="center">params</th>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">*template*: string</td>
    <td align="center">string</td>
  </tr>
</table>

Template:
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
returns the total milliseconds of paused time. It can be measured while timer is paused or when running.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

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
returns the pause time as time fractions. It can be measured while timer is paused or when running.

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
// when timer is paused, calling pauseMs will dynamically calculate progressing pause time
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 4, ms: 675 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 6, ms: 328 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 7, ms: 904 }

// when timer is resumed, pauseMs will return the same previousely accomulated pauses
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 12, ms: 143 }
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 12, ms: 143 }
```

### pauseCount
returns the number of times the timer was paused.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

```js
console.log(timer.pauseCount()); // 2
```

### stop
stops the timer. The timer can be started again by calling `.start()` which clears all recorded values.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
timer.stop();

console.log(timer.time()); // { d: 0, h: 0, m: 2, s: 44, ms: 453 }
console.log(timer.time()); // { d: 0, h: 0, m: 2, s: 44, ms: 453 }
```

### isStopped
checks if the timer has been stopped.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">boolean</td>
  </tr>
</table>

```js
console.log(timer.isStopped()); // true
```

### stoppedAt
returns the stop timestamp.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">number</td>
  </tr>
</table>

```js
console.log(timer.stoppedAt()); // undefined
timer.stop();
console.log(timer.stoppedAt()); // 1616535948456
```

### serialize
serializes the timer in its current state.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">string</td>
  </tr>
</table>

```js
console.log(timer.serialize());
// '{"startTimestamp":1616535216209,"currentStartTimestamp":1616535227790,"endTimestamp":1616535258945,"accumulatedMs":6249,"pauseCount":3,"label":"test"}'
```

### clear
clears the timer values. can be started again by calling `.start()`.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
timer.clear();
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 0, ms: 0 }
console.log(timer.pauseTime()); // { d: 0, h: 0, m: 0, s: 0, ms: 0 }
```

### Timer.deserialize
re-construct a timer from its serialized form.

<table>
  <tr>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">Timer</td>
  </tr>
</table>

```js
const timerStr = '{"startTimestamp":1616535216209,"currentStartTimestamp":1616535227790,"endTimestamp":1616535258945,"accumulatedMs":6249,"pauseCount":3,"label":"test"}';

const timer = Timer.deserialize(timerStr);

console.log(timer.isStopped()); // true
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 37, ms: 404 }
```

### Timer.benchmark(fn)
creates a benchmark timer for a function call.

<table>
  <tr>
    <th align="center">params</th>
    <th align="center">return</th>
  </tr>
  <tr>
    <td align="center">fn: function</td>
    <td align="center">Timer</td>
  </tr>
</table>

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
