// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports


// Node native imports


// NPM package imports
import * as mongo from 'mongodb';

// Global declarations


export default class Database {
    private dbHost: string
    private dbName: string;
    private url: string;
    private client: mongo.MongoClient;


    constructor(dbHost, dbName) {
        this.dbHost = dbHost;
        this.dbName = dbName;
        this.url = `mongodb://${this.dbHost}:27017/${this.dbName}`;

        this.client = new mongo.MongoClient(this.url);
    }

    connect() {
        this.client.connect().then((mc) => {
            mc.db(this.dbName)
            console.log(`First connection to ${this.dbName} successful.`);
        })

    }

    healthCheck() {
        // Perform a health check, make sure connection is still good, check data pools/etc.
        // Check errors

    }

    getAll() {

    }

    registerDiscord(discordID) {
        this.client.connect().then((mc) => {
            let testData = {
                discordID: "", channelID: ""
            }
            let dbo = mc.db(this.dbName);
            dbo.collection('discords').insertOne(testData).then((results) => {
                console.log(results)
            })

        })
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

    // One time run functions

    createMainTable() {
        // Note, Mongo doesn't actually create a table until data is entered into it
        // So this is just an example
        this.client.connect().then((mc) => {
            mc.db(this.dbName).createCollection('discords')
        })
    }
}

