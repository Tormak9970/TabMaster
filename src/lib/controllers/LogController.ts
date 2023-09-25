import { debounce } from '../Utils';
import { PythonInterop } from "./PythonInterop";

const errorToastLimit = 10;
export class LogController {
  /**
   * Error flag to check for showing a problem has occured in the QAM.
   */
  static errorFlag = false;

  /**
   * Counts of raised error massages
   */
  static errorCounts: {[message: string]: number} = {};

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

  /**
   * Throws a new error and logs it to the plugin's log file.
   */
	static throw(...args: any[]) {
    PythonInterop.error(args.join(" "));
    throw new Error([`%c TabMaster %c ERROR %c`, 'background: #ff6d05; color: black;', 'background: #c70808; color: black;', 'background: transparent;', ...args].join(' '));
  }

  /**
   * Logs error to backend, frontend, and toasts the error and sets the error flag to show in QAM.
   *
   * intended for patching/ ui errors but may be useful for other cases in the future.
   */
  static raiseError = debounce((...args: any[]) => {
    const msg = args.join(" ");
    PythonInterop.error(msg);
    LogController.error(...args);
    if (!LogController.errorCounts[msg]) LogController.errorCounts[msg] = 0;
    if (LogController.errorCounts[msg] <= errorToastLimit) PythonInterop.toast("TAB MASTER ERROR", msg);
    LogController.errorCounts[msg]++;
    LogController.errorFlag = true;
  }, 5000, true) as (...args: any[]) => void;
}
