// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix, redditFetchConfig, dbInfo } from './config';
import RedditFetchClient from './RedditFetchClient';
import Database from './database/Database';
import Middleware from './database/Middleware';

// Node native imports
import * as fs from 'fs';


// NPM package imports
// Discord.js is an NPM package designed to help with creating Discord bots
import * as Discord from 'discord.js';
// Reddit API wrapper
import * as snoowrap from 'snoowrap';

// Global declarations
const client = new Discord.Client();
const prefix = botPrefix;
// let reddiData = readRedditData();
// let parsedRedditData = parseRedditDataJSONFromString(reddiData);


// Initiate the wrapper for getting reddit content here
const snoowrapInstance = new snoowrap.default({
    userAgent: redditFetchConfig.userAgent,
    clientId: redditFetchConfig.clientID,
    clientSecret: redditFetchConfig.clientSecret,
    username: redditFetchConfig.userName,
    password: redditFetchConfig.password
});

// Initialize the database first since other classes need it
let db = new Database(dbInfo.dbHost, dbInfo.dbName);
let middleware = new Middleware(db);
let rfc = new RedditFetchClient(snoowrapInstance, middleware);

// Set up the periodic check for new reddit posts here
// setInterval(intervalFunc, 1500);

client.login(botToken);

client.on('ready', () => {
    console.log('Connected to Discord...');
    db.connect();
});

client.on('message', async message => {
    // It's good practice to ignore other bots. This also ensures the bot ignores itself
    if (message.author.bot) return;

    // Also good practice to ignore any messages that do not start with the bot prefix
    if (message.content.indexOf(prefix) !== 0) return;

    // Here, separate the 'command' name, and the 'arguments' for the command
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.author.id == '103294979455086592') {
        message.reply('Yeens not allowed');
        return;
    }

    switch (command) {
        case 'ping':
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m: any = await message.channel.send('AAAAAAAA');
            m.edit(`\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
            break;

        case 'meme':
            // This is where the meme command will be tested

            if (args.length == 0) {
                message.reply('Give me a subreddit name with !!meme you stupid slut')
            } else {
                rfc.getNewSubredditPostsBySubredditName(args[0]).then((posts) => {
                    // posts.forEach((entry) => {
                    //     message.channel.send(entry.url)
                    // })
                    message.channel.send(posts[0].url);
                }).catch((err) => {
                    message.channel.send(`You fucking idiot, you cased ${err}`);
                })
            }
            break;
        case 'clearchat':
            // Clear the chat setting for the given server
            message.channel.send('AAAAAAAA');
            break;

        case 'query':

            break;

        case 'register':
            message.channel.send('Got it, you now have an active discord ID, and can use !!add to subscribe to a subreddit')
            // here, use the db middleware to ass the discord to the database
            break;

        case 'help':
            // Display the help message
            message.channel.send('There is no help (yet).');
            break;

        case 'setchat':
            message.channel.send('Ok, this is where I will post my shit');

            break;

    }
});

function intervalFunc() {
    console.log('Interval function reached');
}

// /** Read the config file for the script/project
//  * @returns {string}
//  */
// function readRedditData(): string {
//     if (fs.existsSync('../redditData.json')) {
//         let rawData = fs.readFileSync('../redditData.json');
//         return rawData.toString();
//     } else {
//         console.log('Error: Could not find config file (../redditData.json)');
//         // Exit on this error, since the file is needed
//         return process.exit(1);
//     }
// }

// /** Parse the config JSON from the string from the `readConfigFile()` function
//  * @param {string} fileString
//  * @returns {object}
//  */
// function parseRedditDataJSONFromString(fileString: string) {
//     // Try to parse the contents
//     try {
//         return JSON.parse(fileString);
//     } catch (e) {
//         console.log('Could not parse JSON from given file string');
//         return process.exit(1);
//     }
// }