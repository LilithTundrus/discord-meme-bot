// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix, redditFetchConfig, dbInfo, adminID } from './config';
import * as messages from './messages';
import RedditFetchClient from './RedditFetchClient';
import Database from './database/Database';
import Middleware from './database/Middleware';
import Logger from './Logger';
import * as embeds from './embeds';

// Node native imports

// NPM package imports
// Discord.js is an NPM package designed to help with creating Discord bots
import * as Discord from 'discord.js';
// Reddit API wrapper
import * as snoowrap from 'snoowrap';

// Global declarations
const client = new Discord.Client();
const prefix = botPrefix;

// What's left to do:
// TODO: Clean up project and files
// TODO: Make sure logging is all set up and in place
// TODO: Have the admin command support features/diagnostics or at least a dashboard -- version numbers/etc.
// TODO: Set up a rolling check on the database to make sure connection stays good
// BIG TODO: Allow custom prefixes for bot commands
// TODO: Fix spelling and grammar (subReddit vs. subreddit)
// TODO: Add !!yoink to have the bot send a better info about the last post posted
// TODO:: add an option to switch from hot or new for getting new posts
// TODO: Get the help message to be better

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

// Set up the periodic check for new reddit posts here (1 minute)
setInterval(intervalFunc, 15000 * 4);

client.login(botToken);
logger.info('Attempting to log in to Discord...');

client.on('ready', () => {
    logger.info('Connected to Discord');
    // First time connect, mostly just to check if the database is there
    middleware.connect();

    // Set a custom activity status
    client.user.setActivity('Type !!help for help', {
        type: 'STREAMING',
        url: 'https://www.twitch.tv/monstercat',
    });
});

// TODO: I know this should be split out to not be so ugly
client.on('message', async (message) => {
    // It's good practice to ignore other bots. This also ensures the bot ignores itself
    if (message.author.bot) return;

    // Also good practice to ignore any messages that do not start with the bot prefix
    if (message.content.indexOf(prefix) !== 0) return;

    // Here, separate the 'command' name, and the 'arguments' for the command
    // Both of these are forced to lowerCase to prevent weird issues
    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Make sure message is NOT a DM, this is a server-only bot
    if (message.guild == null) {
        logger.info(`DM Message from ${message.author.id}: ${message.content}`);
        return message.reply(messages.useAServer);
    }

    logger.info(`Message event from ${message.author.id}: ${message.content}`);

    switch (command) {
        case 'register':
            middleware.registerDiscordServer(message.guild.id).then((results) => {
                if (results == true) {
                    // Registration was completed
                    message.channel.send(messages.successfulRegister);
                } else if (results == false) {
                    // Server is already registered, let the user know
                    message.channel.send(messages.alreadyRegistered);
                } else {
                    // An error was returned
                    message.channel.send(messages.registrationError);
                    client.users.fetch(adminID).then((user) => {
                        user.send(`Error on registration: ${results}`);
                    });
                    logger.error(results);
                }
            });
            break;

        case 'unregister':
            // Check if the discord server is registered at all first
            return middleware.checkRegistration(message.guild.id).then((results) => {
                if (results == true) {
                    // Server is registered
                    return middleware.removeAllDiscordInfo(message.guild.id).then(() => {
                        return middleware.removeAllRedditInfo(message.guild.id).then(() => {
                            message.channel.send(messages.successfulUnregister);
                        });
                    });
                } else {
                    // Server isn't registered
                    message.channel.send(messages.alreadyUnregistered);
                }
            });
            break;

        case 'help':
            // Display the help message
            message.channel.send(embeds.helpEmbed);
            break;

        case 'add':
            if (args.length !== 1) {
                return message.channel.send(messages.addArgsNeeded);
            }
            return addCommandHandler(args, message);
            break;

        case 'remove':
            if (args.length !== 1) {
                return message.channel.send(messages.removeArgsNeeded);
            }
            return middleware.removeServerRedditInfo(message.guild.id, args[0]).then(() => {
                return message.channel.send(
                    `Ok, I've removed ${args[0]} from your reddit subscription list`
                );
            });
            break;

        case 'showsubs':
            // TODO: have this show the channel name as well
            // Show the user the current subreddits they're subscribed to
            return middleware.getServerRedditData(message.guild.id).then((results) => {
                if (results.length < 1) {
                    message.channel.send(messages.showSubsNoSubscriptions);
                } else {
                    let subredditNames = results.map((entry) => {
                        return entry.name;
                    });

                    let subredditTypes = results.map((entry) => {
                        return entry.updateType;
                    });

                    let embed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setAuthor(client.user.username, client.user.avatarURL())
                        .setThumbnail(client.user.avatarURL())
                        .addField(
                            `Subscribed subreddits for ${message.guild.name}:`,
                            `${subredditNames.join('\n')}`
                        )
                        .addField(`Types:`, `${subredditTypes.join('\n')}`)
                        .setTimestamp();

                    message.channel.send(embed);
                }
            });
            break;

        case 'sethot':
            if (args.length !== 1) {
                return message.channel.send(messages.hotArgsNeeded);
            }
            return setHotHandler(args, message);
            break;

        case 'setnew':
            break;

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
            return middleware.checkIfSubredditExists(message.guild.id, args[0]).then((response) => {
                if (response.length < 1) {
                    // Subreddit is good to add
                    return middleware.getDiscordDataByID(message.guild.id).then((results) => {
                        message.channel.send(`Checking if subreddit \`${args[0]}\` is valid...`);
                        return rfc
                            .getNewSubredditPostsBySubredditName(args[0])
                            .then((posts) => {
                                // TODO: this seems to not be working??? (the check, this can return even with a bad reddit name)
                                // Shove the last 50 posts into the DB entry for the subreddit
                                let urls = posts.map((entry) => {
                                    return entry.url;
                                });
                                message.channel.send(
                                    `Ok, I added \`${args[0]}\`, you'll get new posts from there.`
                                );
                                return middleware.addServerRedditInfo(
                                    message.guild.id,
                                    message.channel.id,
                                    args[0],
                                    urls
                                );
                            })
                            .catch((err) => {
                                logger.error(err);
                                message.channel.send(
                                    `It looks like I either can't find \`${args[0]}\` or the Reddit API is down.`
                                );
                            });
                    });
                } else {
                    message.channel.send(
                        `It looks like you are already subscribed to ${args[0]}. To change the channel it is associated to, use the \`!!remove\` command.`
                    );
                }
            });
            // Server is registered, now check for a defined chat for the bot
        } else {
            // Server needs to register
            message.channel.send(messages.addArgsNeeded);
        }
    });
}

function setHotHandler(args, message: Discord.Message) {
    return middleware.checkRegistration(message.guild.id).then((results) => {
        if (results == true) {
            return middleware.checkIfSubredditExists(message.guild.id, args[0]).then((response) => {
                if (response.length < 1) {
                    message.channel.send(`It looks like you are are not subscribed to ${args[0]}.`);
                } else {
                    return middleware.setSubredditType(message.guild.id, args[0], 'hot');
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

function setNewHandler(args, message: Discord.Message) {}

// This is where the fetchClient will use the middleware to refresh data/etc.
function intervalFunc() {
    logger.info('Starting reddit check interval...');

    // Set up a chain of promises to keep this synchronous
    let promiseChain = Promise.resolve();

    middleware.getAllDiscords().then((entries: any) => {
        // Sanity checks first
        if (entries.length < 1) {
            return logger.debug(`Database returned no entries...`);
        }
        entries.forEach((entry) => {
            logger.info(`Starting checks for ${entry.discordID}`);
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

// TODO: This might be an awful way of going about this
function subredditNewPostsCheck(discord, reddit) {
    logger.info(`Checking subreddit ${reddit.name} for server ${discord.discordID}`);
    let lastSeenPosts = reddit.posts;

    // Set up a chain of promises to keep this synchronous
    let promiseChain = Promise.resolve();

    if (reddit.updateType == 'hot') {
    } else {
    }

    return rfc
        .getNewSubredditPostsBySubredditName(reddit.name)
        .then((posts) => {
            // Comparing the URLs is the safest way to compare new vs. old data
            let urls = posts.map((entry) => {
                return entry.url;
            });

            posts.forEach((post) => {
                promiseChain = promiseChain.then(() => {
                    if (lastSeenPosts.includes(post.url)) {
                        return;
                    } else {
                        logger.debug(`NEW POST ${post.url}`);
                        // Construct the embed message:

                        // Results is defined as any because the Discord.js typings are wrong, this works fine
                        return client.channels.fetch(reddit.channelID).then((results: any) => {
                            let msg = `New post from ${post.subreddit_name_prefixed} with ${post.ups} upvotes: ${post.url}`;
                            return results.send(msg);
                        });
                    }
                });
            });

            // After (hopefully) completing the chain of promises, update the database info for the subreddit
            return promiseChain.then(() => {
                return middleware.updateServerRedditInfoCache(discord.discordID, reddit.name, urls);
            });
        })
        .then(() => {
            logger.info(`Done with ${reddit.name} for ${discord.discordID}`);
        });
}
