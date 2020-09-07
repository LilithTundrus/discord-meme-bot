// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports

// Node native imports
import * as fs from 'fs';

// NPM package imports

// Global declarations

// This isn't a very good logging class, but I also suck at
// using the big logging tools because they're a subject to learn on their own
// This will just be for use here after I read a bit more on actually good logging
export default class Logger {
    public logPath: string;
    private writeToFile: boolean;

    constructor(writeToFile?: string, logPath?: string) {
        // Don't bother checking the path being fed to this. Yeah blah blah
        // "Don't trust your inputs" but fuck you I'm not making enterprise software
        if (writeToFile && logPath) {
            this.logPath = logPath;
            this.writeToFile = true;
        }
    }

    debug(logMessage: string) {
        this.constructLogMessage(logMessage, 'DEBUG');
    }

    info(logMessage: string) {
        this.constructLogMessage(logMessage, 'INFO');
    }

    warn(logMessage: string) {
        this.constructLogMessage(logMessage, 'WARN');
    }

    error(logMessage: string) {
        this.constructLogMessage(logMessage, 'ERROR');
    }

    // Create the log message based on given inputs
    private constructLogMessage(initialMessage: string, logLevel: string) {
        initialMessage = `[${Date.now()}] ${logLevel}: ${initialMessage}`;
        if (this.writeToFile) {
            this.writeToLogFile(initialMessage);
        }
    }

    private writeToLogFile(logMessage: string) {
        fs.appendFileSync(this.logPath, logMessage);
    }
}
