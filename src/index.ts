// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix, redditFetchConfig, dbInfo, adminID } from './config';
import RedditFetchClient from './RedditFetchClient';
import Database from './database/Database';
import Middleware from './database/Middleware';
import Logger from './Logger';
import * as embeds from './embeds';

// Node native imports
// import * as fs from 'fs';

// NPM package imports
// Discord.js is an NPM package designed to help with creating Discord bots
import * as Discord from 'discord.js';
// Reddit API wrapper
import * as snoowrap from 'snoowrap';

// Global declarations
const client = new Discord.Client();
const prefix = botPrefix;

// Initiate the wrapper for getting reddit content here
const snoowrapInstance = new snoowrap.default({
    userAgent: redditFetchConfig.userAgent,
    clientId: redditFetchConfig.clientID,
    clientSecret: redditFetchConfig.clientSecret,
    username: redditFetchConfig.userName,
    password: redditFetchConfig.password,
});

// Create an instance of the logger class
let logger = new Logger();

// Initialize the database first since other classes need it
let db = new Database(dbInfo.dbHost, dbInfo.dbName);
// Set up the middleware to never have the bot fully in control of the database
let middleware = new Middleware(db);
let rfc = new RedditFetchClient(snoowrapInstance, middleware);

// Set up the periodic check for new reddit posts here
// setInterval(intervalFunc, 1500);

client.login(botToken);
logger.info('Attempting to log in to Discord');

client.on('ready', () => {
    logger.info('Connected to Discord');
    // First time connect, mostly just to check if the database is there
    middleware.connect();
    // TODO: Set up a rolling check on the database to make sure connection stays good
});

client.on('message', async (message) => {
    // It's good practice to ignore other bots. This also ensures the bot ignores itself
    if (message.author.bot) return;

    // Also good practice to ignore any messages that do not start with the bot prefix
    if (message.content.indexOf(prefix) !== 0) return;

    // Here, separate the 'command' name, and the 'arguments' for the command
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    logger.info(`Message event from ${message.author.id}: ${message.content}`);

    switch (command) {
        case 'meme':
            // This is where the meme command will be tested

            if (args.length == 0) {
                message.reply('Give me a subreddit name with !!meme you stupid slut');
            } else {
                rfc.getNewSubredditPostsBySubredditName(args[0])
                    .then((posts) => {
                        // posts.forEach((entry) => {
                        //     message.channel.send(entry.url)
                        // })
                        message.channel.send(posts[0].url);
                    })
                    .catch((err) => {
                        message.channel.send(`You fucking idiot, you cased ${err}`);
                    });
            }
            break;
        case 'clearchat':
            // Clear the chat setting for the given server
            // First check if the discord server is registered, then blank out the chat field
            message.channel.send('AAAAAAAA');
            break;

        case 'register':
            middleware.registerDiscordServer(message.guild.id).then((results) => {
                if (results == true) {
                    // Registration was completed
                    let msg =
                        'Got it, you now have an active discord ID, make sure to use the `!!setchat` command to set where to post things you add using the `!!add` command.';
                    message.channel.send(msg);
                } else if (results == false) {
                    // Server is already registered, let the user know
                    let msg =
                        'You are already set up with an active Discord ID. Use the `!!setchat` command to set where to post things you add using the `!!add` command.';
                    message.channel.send(msg);
                } else {
                    // An error was returned
                    let msg =
                        'Sorry, something went wrong. Try again later. I will DM the bot admin and let them know something went wrong.';
                    message.channel.send(msg);
                    // This may or may not work (it doesn't)
                    client.user.send(results, { reply: `${adminID}` });
                }
            });
            break;

        case 'help':
            // Display the help message
            message.channel.send(embeds.exampleEmbed);
            break;

        case 'setchat':
            // Check if discord server is registered

            // If it is, send a confirmation, else error out
            message.channel.send(
                'Ok, this is where images from subreddits you add with the `!!add` command will be posted'
            );
            break;

        case 'add':
            // Check if discord server is registered AND a chat selection has been set
            // If it is, send a confirmation, else error out
            // Also, make sure the subreddit string is valid
            break;

        case 'unsubscribe':
            // This should be a feature
            break;

        // Used for testing or maybe like a console menu?
        case 'admin':
            // Check for admin ID
            if (message.author.id !== adminID) {
                logger.warn(
                    `User with ID ${message.author.id} attempted to use the 'admin' command`
                );
                return message.reply('Access Denied');
            } else {
                logger.debug(`Received authorized 'admin' command with arguments: ${args}`);
                if (args.length == 0) {
                    (await client.users.fetch(adminID)).send(embeds.adminEmbed);
                } else {
                    return adminCommandParse(args[0]);
                }
            }
            break;
    }
});

function intervalFunc() {
    // this is where the fetchClient will use the middleware to refresh data/etc.
    logger.info('Interval function reached');
}

// This is for processing admin-type commands to manage the bot from the bot itself
async function adminCommandParse(arg: string) {
    if (arg == 'restart') {
        // Restart the bot
    } else if (arg == 'reset') {
        (await client.users.fetch(adminID)).send('Resetting the ENTIRE database...');
        middleware.dropCollection();
        (await client.users.fetch(adminID)).send('Done.');
    }
}
