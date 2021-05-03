export interface Time {
  ms: number;
  s: number;
  m: number;
  h: number;
  d: number;
}

export interface TimerOptions {
  label?: string;
  startTimestamp?: number;
  currentStartTimestamp?: number;
  endTimestamp?: number;
  pauseCount?: number;
  accumulatedMs?: number;
}

export class Timer {
  constructor(options?: TimerOptions);
  getLabel(): string;
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
  serialize(): string;
  clear(): Timer;
  static deserialize(serializedTimer: string): Timer;
  static benchmark(fn: () => any): Timer;
}
