//
// Simple logging functions. Most calls (i.e., those on a separate line) are easy to
// comment out globally by replacing the pattern "^( )*zlog" with "$1 //zlog".
//

const trunc = (num: number, n = 0) => {
  const s = num.toString();
  const idx = s.indexOf('.');
  return s.slice(0, idx === -1 ? s.length : idx + n);
};

export const LogLevels = ["none", "info", "warn", "debug", "trace"] as const;
export type LogLevel = (typeof LogLevels)[number];

let logLevel = <LogLevel>localStorage.getItem("log_level") || "info";
//let logLevel = "debug";

const z_log = (level: number, ...msg: any[]): void => {
  if (level <= LogLevels.indexOf(logLevel)) {
    console.log(`[${LogLevels[level]}:${trunc(performance.now(), 4)}]`, ...msg);
  }
  if (level > 1 && logLevel === "trace") {
    console.trace();
  }
};

export const zlog = {
  logLevel: logLevel,
  logLevels: LogLevels,

  setLevel: (level: LogLevel): void => {
    logLevel = level;
    localStorage.setItem("log_level", level.toString());
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
