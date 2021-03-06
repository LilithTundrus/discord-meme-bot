// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import Logger from '../Logger';

// Node native imports

// NPM package imports
import * as mongo from 'mongodb';

// Global declarations

// Create an instance of the logger class
let logger = new Logger('Database');

export default class Database {
    private dbHost: string;
    private dbName: string;
    private url: string;
    private client: mongo.MongoClient;

    constructor(dbHost, dbName) {
        this.dbHost = dbHost;
        this.dbName = dbName;
        // Construct the mongoDB url using the passed arguments
        this.url = `mongodb://${this.dbHost}:27017/${this.dbName}`;
        // Create a mongoDB client to be used withing the class methods
        this.client = new mongo.MongoClient(this.url, { loggerLevel: 'error' });
    }

    // This might not actually be needed?
    connect() {
        return this.client.connect().then((mc) => {
            mc.db(this.dbName);
            logger.info(`First connection to ${this.dbName} successful.`);
        });
    }

    healthCheck() {
        // Perform a health check, make sure connection is still good, check data pools/etc.
        // Check errors
    }

    getAll() {
        logger.info('Database received a request for ALL discords');
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .find({})
                .toArray()
                .then((results) => {
                    return results;
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    getAllReddits() {
        logger.info('Database received a request for ALL Reddits');
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .find({})
                .toArray()
                .then((results) => {
                    return results;
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    registerDiscord(discordID: string) {
        logger.info(`Database attempting to register discord server with ID ${discordID}`);
        return this.client.connect().then((mc) => {
            let initialData = {
                discordID: discordID,
                upvoteThreshold: 50,
            };
            let dbo = mc.db(this.dbName);
            dbo.collection('discords')
                .insertOne(initialData)
                .then((results) => {
                    logger.info(`Discord successfully registered: ${results}`);
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    addDiscordSubreddit(
        discordID: string,
        channelID,
        subRedditName: string,
        initialData: string[]
    ) {
        // Make sure the channel has already been set for putting out subreddit posts
        logger.info(`Checking for discord server with ${discordID} in database`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .findOne({ discordID: discordID })
                .then(() => {
                    let redditData = {
                        discordID: discordID,
                        channelID: channelID,
                        name: subRedditName,
                        posts: initialData,
                        updateType: 'hot'
                    };
                    return dbo.collection('reddits').insertOne(redditData);
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    getSubredditByDiscordIDAndName(discordID, subRedditName) {
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .find({ discordID: discordID, name: subRedditName })
                .toArray()
                .then((results) => {
                    return results;
                });
        });
    }

    setSubredditType(discordID, subRedditName, type: string) {
        logger.info(`Attempting to update reddit info ${subRedditName} for server ${discordID}`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .find({ discordID: discordID })
                .toArray()
                .then((results) => {
                    let object = results.find((entry) => {
                        return entry.name == subRedditName;
                    });
                    dbo.collection('reddits')
                        .updateOne({ _id: object._id }, { $set: { updateType: type } })
                        .then(() => {
                            logger.info(`Updated ${subRedditName} to type: ${type}`);
                        });
                });
        });
    }

    removeDiscordSubreddit(discordID: string, subRedditName: string) {
        logger.info(`Checking for discord server with ${discordID} in database`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .findOne({ discordID: discordID })
                .then((results) => {
                    let redditData = {
                        discordID: discordID,
                        name: subRedditName,
                    };
                    return dbo.collection('reddits').deleteOne(redditData);
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    getDiscordSubreddits(discordID: string) {
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .find({ discordID: discordID })
                .toArray()
                .then((results) => {
                    return results;
                });
        });
    }

    updateDiscordChannelID(discordID: string, channelID: string) {
        logger.info(
            `Attempting to update discord channel for server ${discordID} to channel ${channelID}`
        );
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .updateOne({ discordID: discordID }, { $set: { channelID: channelID } })
                .then((results) => {
                    logger.info(
                        `Updated discord ${discordID} channel to ${channelID} successfully`
                    );
                    return results;
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    getDiscordSubredditDataByName(discordID: string, subRedditName: string) {}

    updateDiscordSubredditDataByName(discordID: string, subRedditName: string, newData: string[]) {
        logger.info(`Attempting to update reddit info ${subRedditName} for server ${discordID}`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .find({ discordID: discordID })
                .toArray()
                .then((results) => {
                    let object = results.find((entry) => {
                        return entry.name == subRedditName;
                    });
                    dbo.collection('reddits')
                        .updateOne({ _id: object._id }, { $set: { posts: newData } })
                        .then(() => {
                            // logger.info(`Updated ${subRedditName} to new cached data: ${newData}`);
                        });
                });
        });
    }

    checkIfDiscordExists(discordID: string) {
        logger.info(`Checking for discord server with ${discordID} in database`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .findOne({ discordID: discordID })
                .then((results) => {
                    return results;
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }

    setUpvoteThreshold(discordID: string, upvoteThreshold: number) {}

    removeRedditData(discordID) {
        logger.warn(`Removing reddit data for discord ${discordID}`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('reddits')
                .deleteMany({ discordID: discordID })
                .then((results) => {
                    logger.info(`Removed reddit data for ${discordID}: ${results.deletedCount}`);
                });
        });
    }

    removeDiscordData(discordID) {
        logger.warn(`Removing discord data for discord ${discordID}`);
        return this.client.connect().then((mc) => {
            let dbo = mc.db(this.dbName);
            return dbo
                .collection('discords')
                .deleteOne({ discordID: discordID })
                .then((results) => {
                    logger.info(`Removed discord data for ${discordID}: ${results}`);
                });
        });
    }

    //#region One time run functions

    createMainCollection() {
        // NOTE: Mongo doesn't actually create a table until data is entered into it
        // So this is just an example
        this.client.connect().then((mc) => {
            logger.debug('Created main database. NOTE THIS DOES NOTHING UNTIL DATA IS ENTERED!!!');
            mc.db(this.dbName).createCollection('discords');
        });
    }

    createRedditCollection() {
        // NOTE: Mongo doesn't actually create a table until data is entered into it
        // So this is just an example
        this.client.connect().then((mc) => {
            logger.debug('Created main database. NOTE THIS DOES NOTHING UNTIL DATA IS ENTERED!!!');
            mc.db(this.dbName).createCollection('reddits');
        });
    }

    // Only use this for resetting testing data
    dropCollection() {
        logger.warn('Attempting to drop the main database');
        this.client.connect().then((mc) => {
            mc.db(this.dbName)
                .dropCollection('discords')
                .then((results) => {
                    logger.info('Dropped main table');
                    console.log(results);
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
        logger.warn('Attempting to drop the Reddit table');
        this.client.connect().then((mc) => {
            mc.db(this.dbName)
                .dropCollection('reddits')
                .then((results) => {
                    logger.info('Dropped Reddit table');
                    console.log(results);
                })
                .catch((err) => {
                    logger.error(err);
                });
        });
    }
}

//#endregion
