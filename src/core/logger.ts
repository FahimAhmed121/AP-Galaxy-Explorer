export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev = process.env.NODE_ENV !== 'production';

  info(message: string, ...args: any[]) {
    if (this.isDev) {
      console.log(`[AP-INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[AP-WARN] ${message}`, ...args);
  }

  error(message: string, error?: any) {
    console.error(`[AP-ERROR] ${message}`, error || '');
  }

  debug(message: string, ...args: any[]) {
    if (this.isDev) {
      console.debug(`[AP-DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
