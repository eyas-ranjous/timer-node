# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [5.0.9] - 2025-01-26

### Fixed
- documentation.


## [5.0.8] - 2025-01-25

### Fixed
- refactor & documentation.


## [5.0.7] - 2022-12-11

### Fixed
- Detecting if timer was paused when deserialized.

## [5.0.6] - 2022-06-19

### Fixed
- README.

## [5.0.5] - 2021-06-14

### Fixed
- README.

## [5.0.4] - 2021-05-03

### Fixed
- .format custom templates.

## [5.0.3] - 2021-04-17

### Fixed
- package.json

## [5.0.2] - 2021-03-25

### Fixed
- isRunning.
- README.


## [5.0.1] - 2021-03-24

### Fixed
- benchmark timer label.
- README.

## [5.0.0] - 2021-03-23

### Changed
- A new implementation of the timer based on timestamp.

## [4.1.0] - 2021-03-13

### Added
- typescript definitions for the timer.

## [4.0.0] - 2021-02-26

### Changed
- replace time funtions with a single `.time()` function.

### Added
`.time()` returns elapsed time as an object of time fractions.
`.pause()` to pause the timer.
`.resume()` to resume the timer.
`.isStarted()` check if timer is started.
`.isPaused()` check if timer is paused.
`.isStopped()` check if timer is stopped.

## [3.1.0] - 2021-02-06
### Added
- static function `.benchmark` to create a timer for a function call.

### Fixed
- README

## [3.0.0] - 2020-07-07
### Changed
- enable chaining from `.start()`, `.stop()` & `.clear()`.   

## [2.0.0] - 2020-04-14
### Changed
- new release.
