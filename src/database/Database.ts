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
        // Construct the mongoDB url using the passed arguments
        this.url = `mongodb://${this.dbHost}:27017/${this.dbName}`;

        // Create a mongoDB client to be used withing the class methods
        this.client = new mongo.MongoClient(this.url);
    }

    // This might not actually be needed
    connect() {
        return this.client.connect().then((mc) => {
            mc.db(this.dbName);
            console.log(`First connection to ${this.dbName} successful.`);
        })

    }

    healthCheck() {
        // Perform a health check, make sure connection is still good, check data pools/etc.
        // Check errors

    }

    getAll() {

    }

    registerDiscord(discordID: string) {
        return this.client.connect().then((mc) => {
            let initialData = {
                discordID: discordID, channelID: ""
            }
            let dbo = mc.db(this.dbName);
            dbo.collection('discords').insertOne(initialData).then((results) => {
                console.log(results)
            })

        })
    }

    addDiscordSubreddit(discordID: string, subRedditName: string) {

    }

    removeDiscordSubreddit(discordID: string, subRedditName: string) {

    }

    getDiscordSubreddits(discordID: string) {

    }


    updateDiscordChannelID(discordID: string, channelID: string) {

    }

    getDiscordSubredditDataByName(discordID: string, subRedditName: string) {

    }

    updateDiscordSubredditDataByName(discordID: string, subRedditName: string) {

    }

    checkIfDiscordExists(discordID: string) {
        return this.client.connect().then((mc) => {

            let dbo = mc.db(this.dbName);
            return dbo.collection('discords').findOne({ discordID: discordID }).then((results) => {
                return results;
            })

        })
    }


    // One time run functions


    createMainCollection() {
        // Note: Mongo doesn't actually create a table until data is entered into it
        // So this is just an example
        this.client.connect().then((mc) => {
            mc.db(this.dbName).createCollection('discords');
        });
    }

    // Only use this for resetting testing data
    dropCollection() {
        this.client.connect().then((mc) => {
            mc.db(this.dbName).dropCollection('discords').then((results) => {
                console.log(results);
            })
        })
    }

}

