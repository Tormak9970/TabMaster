import { PythonInterop } from "./PythonInterop";

export class LogController {
  /**
   * Logs a message to the plugin's log file and the frontend console.
   * @param message The message to log.
   */
	static log(...args: any[]) {
    console.log(
      `%c TabMaster %c INFO %c`,
      'background: #ff6d05; color: black;',
      'background: #1abc9c; color: black;',
      'background: transparent;',
      ...args
    );
    PythonInterop.log(args.join(" "));
  }

  /**
   * Logs a warning to the plugin's log file and the frontend console.
   */
	static warn(...args: any[]) {
    console.warn(
      `%c TabMaster %c WARNING %c`,
      'background: #ff6d05; color: black;',
      'background: #e3c907; color: black;',
      'background: transparent;',
      ...args
    );
    PythonInterop.warn(args.join(" "));
  }

  /**
   * Logs an error to the plugin's log file and the frontend console.
   */
	static error(...args: any[]) {
    console.error(
      `%c TabMaster %c ERROR %c`,
      'background: #ff6d05; color: black;',
      'background: #c70808; color: black;',
      'background: transparent;',
      ...args
    );
    PythonInterop.error(args.join(" "));
  }
}
