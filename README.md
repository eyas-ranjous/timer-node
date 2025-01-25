# timer-node

[![npm](https://img.shields.io/npm/v/timer-node.svg)](https://www.npmjs.com/package/timer-node)
[![npm](https://img.shields.io/npm/dm/timer-node.svg)](https://www.npmjs.com/package/timer-node)

A **lightweight** timestamp-based timer for measuring elapsed time in Node.js or the browser. This library **does not** rely on `setInterval`, `setTimeout`, or the event loop—rather, it calculates durations from system timestamps.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick Start (JavaScript)](#quick-start-javascript)
  - [TypeScript Support](#typescript-support)
  - [Basic Example](#basic-example)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [Start / Pause / Resume / Stop](#start--pause--resume--stop)
  - [Measuring Elapsed Time](#measuring-elapsed-time)
  - [Pause Information](#pause-information)
  - [Formatting](#formatting)
  - [Other Methods](#other-methods)
  - [Static Methods](#static-methods)
- [Build](#build)
- [License](#license)

## Features

- **Intuitive API** for starting, pausing, resuming, and stopping a timer.
- **Accurate elapsed-time calculation** (no event loops or `setInterval`).
- **Multiple states** (running, paused, stopped).
- **Formatting** for output (`%label`, `%d`, `%h`, `%m`, `%s`, `%ms`).
- **Serialization** and **deserialization** for saving and restoring timer state.
- **Benchmark function** to measure execution time of synchronous code.
- **Zero dependencies**.
- **Comes with TypeScript definitions** for out-of-the-box TS support.

## Installation

```bash
npm install --save timer-node
```

## Usage

### Quick Start (JavaScript)

```js
const { Timer } = require('timer-node');

const timer = new Timer({ label: 'my-timer' });
timer.start();

// Perform a task...

console.log(timer.ms());   // e.g., 250 (ms)
console.log(timer.time()); // { d: 0, h: 0, m: 0, s: 0, ms: 250 }
```

### TypeScript Support

```ts
import { Timer, TimerOptions, Time } from 'timer-node';

const options: TimerOptions = { label: 'ts-timer' };
const tsTimer = new Timer(options);

tsTimer.start();
// ...
console.log(tsTimer.time()); // Time object
```

### Basic Example

```js
const { Timer } = require('timer-node');

const timer = new Timer({ label: 'demo' });

timer.start();
// ... some asynchronous or synchronous operations ...

setTimeout(() => {
  timer.pause();
  console.log('Elapsed so far:', timer.ms(), 'milliseconds');

  timer.resume();
  setTimeout(() => {
    timer.stop();
    console.log('Final time:', timer.time());
  }, 1000);
}, 1000);
```

## API Reference

### Constructor

```ts
new Timer(options?: TimerOptions)
```
- **`label`** *(string, optional)*: A custom label for identification.
- **`startTimestamp`** *(number, optional)*: If you want to initialize from a past timestamp.
- **`endTimestamp`** *(number, optional)*: If you have a known stop time.
- **`currentStartTimestamp`** *(number, optional)*: If the timer is currently running, set the most recent resume time.
- **`pauseCount`** *(number, optional)*: Number of pauses so far.
- **`accumulatedMs`** *(number, optional)*: The milliseconds already counted before the current session.

### Start / Pause / Resume / Stop

- **`start()`**  
  Starts (or restarts) the timer. If the timer was already running, calling `start()` again reinitializes it by **clearing** previous data.
  
- **`pause()`**  
  Pauses the timer. Time accumulation stops until `resume()` is called.
  
- **`resume()`**  
  Resumes the timer if it was paused. Continues from the previously accumulated time.
  
- **`stop()`**  
  Permanently stops the timer. Once stopped, the time does not increase. You can still read the final value using `time()` or `ms()`.

### Measuring Elapsed Time

- **`ms()`**  
  Returns the total elapsed running time (in **milliseconds**). If the timer is paused or stopped, the value remains constant.  
  
- **`time()`**  
  Returns the elapsed time as an object of time fractions:
  ```ts
  {
    d: number;  // days
    h: number;  // hours
    m: number;  // minutes
    s: number;  // seconds
    ms: number; // remaining milliseconds
  }
  ```

### Pause Information

- **`pauseMs()`**  
  Returns the total paused duration (in milliseconds). If the timer is paused right now, this keeps increasing until resumed.

- **`pauseTime()`**  
  Returns the total paused duration as a time object (same format as `time()`).

- **`pauseCount()`**  
  Returns how many times the timer has been paused.

### Formatting

- **`format(template?: string)`**  
  Returns a string representation of the elapsed time.  
  Defaults to `'%label%d d, %h h, %m m, %s s, %ms ms'`.  
  - Placeholders:
    - **`%label`**: The timer label plus `': '` if present.
    - **`%d`**: Days
    - **`%h`**: Hours
    - **`%m`**: Minutes
    - **`%s`**: Seconds
    - **`%ms`**: Milliseconds

### Other Methods

- **`clear()`**  
  Resets the timer to an unstarted state (erases start/stop times, accumulated ms, etc.).

- **`isStarted()`**  
  Checks if the timer has been started at least once.

- **`isPaused()`**  
  Checks if the timer is currently paused.

- **`isRunning()`**  
  Checks if the timer is running (started, not paused, and not stopped).

- **`isStopped()`**  
  Checks if the timer is fully stopped.

- **`startedAt()`**  
  Returns the timestamp (in ms) when the timer started (or `undefined` if never started).

- **`stoppedAt()`**  
  Returns the timestamp (in ms) when the timer stopped (or `undefined` if never stopped).

- **`getLabel()`**  
  Returns the label assigned to the timer.

- **`serialize()`**  
  Returns a JSON string representing the timer’s current internal state. Useful for saving progress or transferring over a network.

### Static Methods

- **`Timer.deserialize(serializedTimer: string): Timer`**  
  Re-creates a timer from a JSON string created by `.serialize()`.  
  ```js
  const savedTimer = Timer.deserialize(timer.serialize());
  ```

- **`Timer.benchmark(fn: () => any): Timer`**  
  Creates a timer, immediately starts it, runs `fn()`, then stops.  
  Returns the stopped timer so you can check `.ms()`, `.time()`, etc.  
  Throws an error if `fn` is not a function.

## Build

To build the library yourself (for development or contributing):

```bash
npm install
npm run build
```

(Or use `grunt build` if that’s your primary task runner.)

## License

This project is licensed under the **MIT License**. The full license text is available in [LICENSE](https://github.com/eyas-ranjous/timer-node/blob/master/LICENSE).
`;

fs.writeFileSync('README.md', readmeContent);
console.log('README.md file created or updated successfully!');
