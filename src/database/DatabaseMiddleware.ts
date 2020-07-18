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


    constructor(dbHost, dbName, dbUserName, dbPassword) {
        this.dbHost = dbHost;
        this.dbName = dbName;
        this.dbUserName = dbUserName;
        this.dbPassword = dbPassword;
    }

    connect() {
        let con = mysql.createConnection({
            host: this.dbHost,
            user: this.dbUserName,
            password: this.dbPassword,
            database: this.dbName
        });

        let msg;
        let pre_query = new Date().getTime();
        con.connect(function (err) {
            if (err) throw err;
            let post_query = new Date().getTime();
            let duration = (post_query - pre_query) / 1000;
            msg = `Connected to DB in ${duration} seconds`;
        });
        return msg;
    }
}

