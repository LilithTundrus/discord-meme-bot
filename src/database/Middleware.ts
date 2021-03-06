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

    getAllRedditData() {
        return this.db.getAllReddits();
    }

    getServerRedditData(discordID: string) {
        return this.db.getDiscordSubreddits(discordID);
    }

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
                // TODO: FIX
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

    checkIfSubredditExists(discordID, subRedditName) {
        return this.db.getSubredditByDiscordIDAndName(discordID, subRedditName);
    }

    addServerRedditInfo(
        discordID: string,
        channelID: string,
        subRedditName: string,
        initialDataSet: string[]
    ) {
        return this.db.addDiscordSubreddit(discordID, channelID, subRedditName, initialDataSet);
    }

    removeServerRedditInfo(discordID: string, subRedditName: string) {
        return this.db.removeDiscordSubreddit(discordID, subRedditName);
    }

    removeAllDiscordInfo(discordID: string) {
        return this.db.removeDiscordData(discordID);
    }

    removeAllRedditInfo(discordID: string) {
        return this.db.removeRedditData(discordID);
    }

    updateServerRedditInfoCache(discordID, redditName, newData) {
        // This is where the 'last seen' posts get placed
        return this.db.updateDiscordSubredditDataByName(discordID, redditName, newData);
    }

    getDiscordDataByID(discordID: string) {
        return this.db.checkIfDiscordExists(discordID).then((results) => {
            return results;
        });
    }

    setSubredditType(discordID, redditName, type: string) {
        return this.db.setSubredditType(discordID, redditName, type);
    }
}
