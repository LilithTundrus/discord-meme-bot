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

// What's left to do:
// TODO: Finish all commands to get them working:
//  - A better help command
//  - remove command, for removing subreddits
//  - showsubs command, for showing all of the subscribed subreddits (this should be an embed message)
// TODO: Get all database functions working
// TODO: Get all middleware functions working
// TODO: Clean up project and files
// TODO: Make sure logging is all set up and in place
// TODO: Have the admin command support features/diagnostics
// TODO: Make sure database connection is always good

// Initiate the wrapper for getting reddit content here
const snoowrapInstance = new snoowrap.default({
    userAgent: redditFetchConfig.userAgent,
    clientId: redditFetchConfig.clientID,
    clientSecret: redditFetchConfig.clientSecret,
    username: redditFetchConfig.userName,
    password: redditFetchConfig.password,
});

// Create an instance of the logger class
let logger = new Logger('Bot');

// Initialize the database first since other classes need it
let db = new Database(dbInfo.dbHost, dbInfo.dbName);
// Set up the middleware to never have the bot fully in control of the database
let middleware = new Middleware(db);
let rfc = new RedditFetchClient(snoowrapInstance, middleware);

// Set up the periodic check for new reddit posts here
setInterval(intervalFunc, 15000 * 4);

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
            return middleware.checkRegistration(message.guild.id).then((results) => {
                if (results == true) {
                    // Server is registered
                    message.channel.send(
                        'Ok, this is where images from subreddits you subscribe to with the `!!add` command will be posted'
                    );
                    return middleware.setServerChat(message.guild.id, message.channel.id);
                } else {
                    // Server needs to register
                    message.channel.send(
                        'You need to initialize your server with the `register` command first.'
                    );
                }
            });
            // If it is, send a confirmation, else error out
            break;

        case 'add':
            if (args.length !== 1) {
                return message.channel.send(
                    'Please give a subreddit to subscribe to with the `!!add` command\nExample: `!!add funny`'
                );
            }
            return addCommandHandler(args, message);
            break;

        case 'remove':
            break;

        case 'subs':
            // Show the user the current subreddits they're subscribed to
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

// This is for processing admin-type commands to manage the bot from the bot itself
async function adminCommandParse(arg: string) {
    if (arg == 'restart') {
        // Restart the bot
    } else if (arg == 'reset') {
        (await client.users.fetch(adminID)).send('Resetting the ENTIRE database...');
        middleware.dropCollection();
        (await client.users.fetch(adminID)).send('Done.');
    } else if (arg == 'get') {
        // This is used for testing
        return middleware.getAllDiscords().then((results) => {
            console.log(results);
            client.users.fetch(adminID).then((user) => {
                user.send(JSON.stringify(results, null, 2));
            });
        });
    } else if (arg == 'reddit') {
        // This is used for testing
        return middleware.getAllRedditData().then((results) => {
            console.log(results);
            client.users.fetch(adminID).then((user) => {
                user.send(JSON.stringify(results, null, 2));
            });
        });
    }
}

function addCommandHandler(args, message: Discord.Message) {
    // Check if discord server is registered AND a chat selection has been set
    // If it is, send a confirmation, else error out
    // Also, make sure the subreddit string is valid
    return middleware.checkRegistration(message.guild.id).then((results) => {
        if (results == true) {
            // Server is registered, now check for a defined chat for the bot
            return middleware.getDiscordDataByID(message.guild.id).then((results) => {
                // Make sure the channelID isn't blank
                console.log(results);

                if (results.channelID == '') {
                    message.channel.send(
                        'Make sure to tell me which chat to post images to with the `setchat` command'
                    );
                } else {
                    message.channel.send(`Checking if subreddit \`${args[0]}\` is valid...`);
                    return rfc
                        .getNewSubredditPostsBySubredditName(args[0])
                        .then((posts) => {
                            // TODO: Make sure the subreddit doesn't already exist
                            // Shove the last 50 posts into the DB entry for the subreddit
                            // console.log(posts);
                            let urls = posts.map((entry) => {
                                return entry.url;
                            });
                            message.channel.send(
                                `Ok, I added \`${args[0]}\`, you'll get new posts from there.`
                            );

                            return middleware.addServerRedditInfo(message.guild.id, args[0], urls);
                        })
                        .catch((err) => {
                            logger.error(err);
                            message.channel.send(
                                `It looks like I either can't find \`${args[0]}\` or the Reddit API is down.`
                            );
                        });
                }
            });
        } else {
            // Server needs to register
            message.channel.send(
                'You need to initialize your server with the `register` command first.'
            );
        }
    });
}

function intervalFunc() {
    // This is where the fetchClient will use the middleware to refresh data/etc.
    logger.debug('Interval function reached');

    // Set up a chain of promises to keep this synchronous
    let promiseChain = Promise.resolve();

    middleware.getAllDiscords().then((entries: any) => {
        if (entries.length < 1) {
            return logger.debug(`Database returned no entries...`);
        }
        entries.forEach((entry) => {
            // Check if there's subreddits and a channel to send to
            if (entry.channelID == '') {
                return logger.debug(`server ${entry.discordID} has no channel ID to send to`);
            }
            return middleware.getServerRedditData(entry.discordID).then((results) => {
                if (results.length < 1) {
                    return logger.debug(`server ${entry.discordID} has subbreddits to check`);
                } else {
                    results.forEach((reddit) => {
                        promiseChain = promiseChain.then(() => {
                            return subredditNewPostsCheck(entry, reddit);
                        });
                    });
                }
            });
        });
    });
    return promiseChain;
}

// TODO: This might need another promise chain to work correctly
function subredditNewPostsCheck(discord, reddit) {
    let lastSeenPosts = reddit.posts;

    // Set up a chain of promises to keep this synchronous
    let promiseChain = Promise.resolve();

    return rfc
        .getNewSubredditPostsBySubredditName(reddit.name)
        .then((posts) => {
            let urls = posts.map((entry) => {
                return entry.url;
            });

            urls.forEach((url) => {
                if (lastSeenPosts.includes(url)) {
                    // logger.debug(`Skipping post ${url}, already exists`);
                } else {
                    logger.debug(`NEW POST ${url}`);

                    let post = posts.find((entry) => {
                        return entry.url == url;
                    });
                    // Add the post to the DB list
                    // Construct the embed message:
                    // From WHAT SUBREDDIT
                    // WHO POSTED IT
                    // Current upvotes
                    // etc. etc.

                    // Craft the message:
                    // Results is defined as any because the Discord.js typings are wrong, this works fine
                    return client.channels.fetch(discord.channelID).then((results: any) => {
                        let msg = `New post from ${post.subreddit.name}: ${url}`;

                        return results.send(msg);
                    });
                }
            });

            return middleware.updateServerRedditInfoCache(discord.discordID, reddit.name, urls);
        })
        .then(() => {
            logger.debug(`Done with ${reddit.name}`);
        });
}
