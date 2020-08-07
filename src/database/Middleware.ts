// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import Database from './Database';


// Node native imports


// NPM package imports


// Global declarations


// This class is for abstracting the database a bit more from the discord bot
export default class Middleware {
    private db: Database

    constructor(db: Database) {
        this.db = db;
    }

    getAllDiscords() {
        return this.db.getAll();
    }

    checkIfServerExists() {

    }

    registerDiscordServer(discordID: string) {
        // Check if the server exists before adding it
        // let test =  this.db.getDiscordSubreddits(discordID);
        return this.db.registerDiscord(discordID);
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

    dropCollection() {

    }

}