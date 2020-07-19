// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports


// Node native imports


// NPM package imports
import * as mysql from 'mysql';


// Global declarations


export default class DatabaseMiddleware {
    public dbHost;
    public dbName;
    private dbUserName;
    private dbPassword;
    public db;


    constructor(dbHost, dbName, dbUserName, dbPassword) {
        this.dbHost = dbHost;
        this.dbName = dbName;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;

        this.db = mysql.createConnection({
            host: this.dbHost,
            user: this.dbUserName,
            password: this.dbPassword,
            database: this.dbName,
        });
    }

    connect() {
        let pre_query = new Date().getTime();
        return this.db.connect(function (err) {
            if (err) throw err;
            let post_query = new Date().getTime();
            let duration = (post_query - pre_query) / 1000;
            console.log(`Connected to DB in ${duration} seconds`);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            let pre_query = new Date().getTime();
            let sql = 'SHOW TABLES';
            this.db.query(sql, function (err, result) {
                let post_query = new Date().getTime();
                let duration = (post_query - pre_query) / 1000;
                if (err) throw err;
                return resolve(result);
            });
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                return resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

    registerDiscord() {

    }

    updateDiscordSubreddits() {

    }

    updateDiscordSubredditData() {

    }

    getDiscordDataByDiscordID() {

    }

    updateDiscordChannelID() {

    }

}

