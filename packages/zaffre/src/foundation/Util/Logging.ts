
//
// Simple logging functions. Most calls (i.e., those on a separate line) are easy to
// comment out globally by replacing the pattern "^( )*zlog" with "$1 //zlog".
//

const logLevels = ["none", "info", "warn", "debug", "trace"];
let logLevel = 1;
const z_log = (level: number, ...msg: any[]): void => {
  if (level <= logLevel) {
    console.log(`[${logLevels[level]}:${performance.now()}]`, ...msg);
  }
  if (level > 1 && logLevel === 4) {
    console.trace();
  }
};

export const zlog = {
  setLevel: (level: number): void => {
    logLevel = level;
  },
  info: (...msg: any[]): void => {
    z_log(1, ...msg);
  },
  warn: (...msg: any[]): void => {
    z_log(2, ...msg);
  },
  debug: (...msg: any[]): void => {
    z_log(3, ...msg);
  },
  trace: (...msg: any[]): void => {
    z_log(4, ...msg);
  },
  error: (...msg: any[]): void => {
    console.log(`[error:${performance.now()}]`, ...msg);
    console.trace();
  },
};


