// Force ES6 strict mode on compiled JS
"use strict";

// Custom code imports

// Node native imports

// NPM package imports

// Global declarations

// This isn't a very good logging class, but I also suck at
// using the big logging tools because they're a subject to learn on their own
// This will just be for use here after I read a bit more on actually good logging
export default class Logger {
    public filePath: string;
    public logFileName: string;

    constructor() {}

    info() {}

    warn() {}

    error() {}

    private constructLogMessage() {
        // This function adds things like timestamps/etc.
    }

    private writeToFile() {}
}
