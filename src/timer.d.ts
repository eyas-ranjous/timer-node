export interface Time {
  s: number;
  ms: number;
  us: number;
  ns: number;
}

export class Timer {
  isStarted() : boolean;
  isPaused() : boolean;
  isResumed() : boolean;
  isStopped() : boolean;
  start() : Timer;
  pause() : Timer;
  resume() : Timer;
  stop() : Timer;
  time() : Time;
  format(template?: string) : string;
  clear () : Timer;
  static benchmark(fn: () => any) : Timer;
}
