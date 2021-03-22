export interface Time {
  d: number;
  h: number;
  m: number;
  s: number;
  ms: number;
}

export interface TimerOptions {
  label?: string;
  timestamp?: number;
}

export class Timer {
  constructor(options?: TimerOptions);
  isStarted(): boolean;
  isPaused(): boolean;
  isRunning(): boolean;
  isStopped(): boolean;
  start(): Timer;
  pause(): Timer;
  resume(): Timer;
  stop(): Timer;
  time(): Time;
  pauseTime(): Time;
  ms(): number;
  pauseMs(): number;
  pauseCount(): number;
  format(template?: string): string;
  clear(): Timer;
  static benchmark(fn: () => any): Timer;
}
