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

    // This function might seem useless but the middleware should be the only thing being used
    connect() {
        return this.db.connect();
    }

    checkRegistration(discordID: string) {
        // Check if the server exists before adding it
        return this.db
            .checkIfDiscordExists(discordID)
            .then((results) => {
                if (results == null) {
                    // Discord is not already registered
                    return false;
                } else {
                    // Server is already registered
                    return true;
                }
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }

    // This function might seem useless but the middleware should be the only thing being used
    dropCollection() {
        return this.db.dropCollection();
    }

    // This will be needed for the interval function to iterate through each registered discord
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

    setServerChat(discordID: string, channelID: string) {
        return this.db
            .updateDiscordChannelID(discordID, channelID)
            .then((results) => {
                console.log(results);
            })
            .catch((err) => {});
    }

    // This is more of an unsubscribe message
    clearServerChat() {}

    addServerRedditInfo(discordID: string, subRedditName: string, initialDataSet: string[]) {
        return this.db.addDiscordSubreddit(discordID, subRedditName, initialDataSet);
    }

    removeServerRedditInfo() {}

    updateServerRedditInfoCache() {
        // This is where the 'last seen' posts get placed
    }

    getDiscordDataByID(discordID: string) {
        return this.db.checkIfDiscordExists(discordID).then((results) => {
            return results;
        });
    }
}
