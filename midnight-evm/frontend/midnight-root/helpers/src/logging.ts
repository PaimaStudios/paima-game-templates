export type Logger = {
  trace: <T extends unknown[]>(...args: T) => void;
  debug: <T extends unknown[]>(...args: T) => void;
  info: <T extends unknown[]>(...args: T) => void;
  warn: <T extends unknown[]>(...args: T) => void;
  error: <T extends unknown[]>(...args: T) => void;
};

export class ConsoleLogger implements Logger {
  trace<T extends unknown[]>(...args: T): void {
    return console.trace(...args);
  }
  debug<T extends unknown[]>(...args: T): void {
    return console.debug(...args);
  }
  info<T extends unknown[]>(...args: T): void {
    return console.info(...args);
  }
  warn<T extends unknown[]>(...args: T): void {
    return console.warn(...args);
  }
  error<T extends unknown[]>(...args: T): void {
    return console.error(...args);
  }
}

export const noopLogger: Logger = {
  trace(): void {
    return undefined;
  },
  debug(): void {
    return undefined;
  },
  info(): void {
    return undefined;
  },
  warn(): void {
    return undefined;
  },
  error(): void {
    return undefined;
  },
};
