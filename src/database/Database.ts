// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports


// Node native imports


// NPM package imports
import * as mysql from 'mysql';
import * as mongo from 'mongodb';
let Client = mongo.MongoClient;


// Global declarations


export default class Database {



    constructor(dbHost, dbName) {

    }

    connect() {
        var url = "mongodb://192.168.2.122:27017/memedb";
        Client.connect(url, function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        });
    }

    getAll() {
        // return new Promise((resolve, reject) => {
        //     let pre_query = new Date().getTime();
        //     let sql = 'SELECT * FROM discords';
        //     this.db.query(sql, function (err, result) {
        //         let post_query = new Date().getTime();
        //         let duration = (post_query - pre_query) / 1000;
        //         if (err) throw err;
        //         return resolve(result);
        //     });
        // });
    }

    query(sql, args) {

    }

    close() {
        // return new Promise((resolve, reject) => {
        //     this.db.end(err => {
        //         if (err)
        //             return reject(err);
        //         resolve();
        //     });
        // });
    }

    registerDiscord() {

    }

    addDiscordSubreddit() {

    }

    removeDiscordSubreddit() {

    }

    getDiscordSubreddits() {

    }

    getDiscordDataByDiscordID() {

    }

    updateDiscordChannelID() {

    }

    getDiscordSubredditData() {

    }

    updateDiscordSubredditData() {

    }

}

