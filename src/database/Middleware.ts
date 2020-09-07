// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import Database from './Database';

// Node native imports

// NPM package imports

// Global declarations

// This class is for abstracting the database a bit more from the discord bot
export default class Middleware {
    private db: Database;

    constructor(db: Database) {
        this.db = db;
    }

    getAllDiscords() {
        return this.db.getAll();
    }

    // Function registerDiscordServer already handles this
    // checkIfServerExists() {

    // }

    registerDiscordServer(discordID: string) {
        // Check if the server exists before adding it
        return this.db
            .checkIfDiscordExists(discordID)
            .then((results) => {
                if (results == null) {
                    // Discord is not already registered
                    return this.db.registerDiscord(discordID).then((results) => {
                        return true;
                    });
                } else {
                    // Server is already registered
                    return false;
                }
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }

    setServerChat() {}

    clearServerChat() {}

    addServerRedditInfo() {}

    removeServerRedditInfo() {}

    updateServerRedditInfoCache() {
        // This is where the 'last seen' posts get placed
    }

    // dropCollection() {

    // }
}
