// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import Database from './Database';


// Node native imports


// NPM package imports


// Global declarations


export default class Middleware {
    private db: Database

    constructor(db: Database) {
        this.db = db;
    }

    getAllDiscords() {

    }

    checkIfServerExists() {

    }

    setServerChat() {

    }

    clearServerChat() {

    }

    addServerRedditInfo() {

    }

    removeServerRedditInfo() {

    }

    updateServerRedditInfoCache() {
        // This is where the 'last seen' posts get placed
    }


}