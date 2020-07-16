// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix, redditFetchConfig } from './config';
import RedditFetchClient from './RedditFetchClient';


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
let reddiData = readRedditData();
let parsedRedditData = parseRedditDataJSONFromString(reddiData);


// Initiate the wrapper for getting reddit content here
const snoowrapInstance = new snoowrap.default({
    userAgent: redditFetchConfig.userAgent,
    clientId: redditFetchConfig.clientID,
    clientSecret: redditFetchConfig.clientSecret,
    username: redditFetchConfig.userName,
    password: redditFetchConfig.password
});

let rfc = new RedditFetchClient(snoowrapInstance, parsedRedditData);

// Set up the periodic check for new reddit posts here
setInterval(intervalFunc, 1500);

client.login(botToken);

client.on('ready', () => {
    console.log('Connected to Discord...');


});

client.on('message', async message => {
    // It's good practice to ignore other bots. This also ensures the bot ignores itself
    if (message.author.bot) return;

    // Also good practice to ignore any messages that do not start with the bot prefix
    if (message.content.indexOf(prefix) !== 0) return;

    // Here, separate the 'command' name, and the 'arguments' for the command
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping':
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m: any = await message.channel.send('AAAAAAAA');
            m.edit(`\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
            break;

        case 'meme':
        // This is where the meme command will be tested
        rfc.test().then((result) => {
            message.reply(result)
        });
    }
});

function intervalFunc() {
    console.log('Interval function reached');
}

/** Read the config file for the script/project
 * @returns {string}
 */
function readRedditData(): string {
    if (fs.existsSync('../redditData.json')) {
        let rawData = fs.readFileSync('../redditData.json');
        return rawData.toString();
    } else {
        console.log('Error: Could not find config file (../redditData.json)');
        // Exit on this error, since the file is needed
        return process.exit(1);
    }
}

/** Parse the config JSON from the string from the `readConfigFile()` function
 * @param {string} fileString
 * @returns {object}
 */
function parseRedditDataJSONFromString(fileString: string) {
    // Try to parse the contents
    try {
        return JSON.parse(fileString);
    } catch (e) {
        console.log('Could not parse JSON from given file string');
        return process.exit(1);
    }
}