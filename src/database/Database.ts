// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports


// Node native imports


// NPM package imports
import * as mongo from 'mongodb';

// Global declarations
let Client = mongo.MongoClient;


export default class Database {
    private dbHost: string
    private dbName: string;



    constructor(dbHost, dbName) {
        this.dbHost = dbHost;
        this.dbName = dbName;
    }

    connect() {
        let url = `mongodb://${this.dbHost}:27017/${this.dbName}`;
        Client.connect(url, function (err, db) {
            if (err) throw err;
        });
        console.log(`Connected to ${this.dbName}`);
    }

    getAll() {

    }

    // query(sql, args) {

    // }

    close() {
        // return new Promise((resolve, reject) => {
        //     this.db.end(err => {
        //         if (err)
        //             return reject(err);
        //         resolve();
        //     });
        // });
    }

    registerDiscord(discordID) {

    }

    addDiscordSubreddit(discordID) {

    }

    removeDiscordSubreddit(discordID) {

    }

    getDiscordSubreddits(discordID) {

    }

    getDiscordDataByDiscordID(discordID) {
        // Returns ALL data for the given discord
    }

    updateDiscordChannelID(discordID) {

    }

    getDiscordSubredditData(discordID) {

    }

    updateDiscordSubredditData(discordID) {

    }

}

