import { PythonInterop } from "./PythonInterop";

export class LogController {
  /**
   * Logs a message to the plugin's log file and the frontend console.
   * @param message The message to log.
   * @param name Optional name for the log file.
   */
	static log(message: string, name="Core") {
		if (process.env.NODE_ENV === 'development') {
      console.log(
        `%c TabMaster %c ${name} %c`,
        'background: #16a085; color: black;',
        'background: #1abc9c; color: black;',
        'background: transparent;',
        message
      );
    }
    PythonInterop.log(message);
	}

  /**
   * Logs a warning to the plugin's log file and the frontend console.
   * @param message The message to log.
   * @param name Optional name for the log file.
   */
	static warn(message: string, name="Core") {
		if (process.env.NODE_ENV === 'development') {
      console.warn(
        `%c TabMaster %c ${name} %c`,
        'background: #16a085; color: black;',
        'background: #1abc9c; color: black;',
        'color: blue;',
        message
      );
    }
    PythonInterop.warn(message);
	}

  /**
   * Logs an error to the plugin's log file and the frontend console.
   * @param message The message to log.
   * @param name Optional name for the log file.
   */
	static error(message: string, name="Core") {
		if (process.env.NODE_ENV === 'development') {
      console.error(
        `%c TabMaster %c ${name} %c`,
        'background: #16a085; color: black;',
        'background: #FF0000;',
        'background: transparent;',
        message
      );
    }
    PythonInterop.error(message);
	}
}