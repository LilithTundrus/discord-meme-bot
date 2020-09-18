// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix, redditFetchConfig, dbInfo, adminID } from './config';
import RedditFetchClient from './RedditFetchClient';
import Database from './database/Database';
import Middleware from './database/Middleware';
import Logger from './Logger';

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
let middleware = new Middleware(db);
let rfc = new RedditFetchClient(snoowrapInstance, middleware);

// Set up the periodic check for new reddit posts here
// setInterval(intervalFunc, 1500);

client.login(botToken);
logger.info('Attempting to log in to Discord');

const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('Some description here')
    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    .addFields(
        { name: 'Regular field title', value: 'Some value here' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Some value here', inline: true },
        { name: 'Inline field title', value: 'Some value here', inline: true }
    )
    .addField('Inline field title', 'Some value here', true)
    .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

client.on('ready', () => {
    logger.info('Connected to Discord');
    // First time connect, mostly just to check if the database is there
    db.connect();
    // TODO: Set up a rolling check on the database to make sure connection stays good
});

// TODO: This needs to log every command processed
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
        case 'ping':
            // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
            // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
            const m: any = await message.channel.send('Waiting...');
            m.edit(`\nLatency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
            break;

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
                    // Server is already registered

                    // Let the user know
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
            message.channel.send(exampleEmbed);
            break;

        case 'setchat':
            // Check if discord server is registered
            // If it is, send a confirmation, else error out
            message.channel.send(
                'Ok, this is where images from subreddits you add with the `!!add` command'
            );
            break;

        case 'reset':
            message.channel.send(
                'Resetting the ENTIRE database...'
            );
            // Obviously this is only around for testing
            db.dropCollection();
            break;

        case 'add':
            // Check if discord server is registered AND a chat selection has been set
            // If it is, send a confirmation, else error out
            // Also, make sure the subreddit string is valid
            break;

        // Used for testing or maybe like a console menu?
        case 'admin':
            // Why does this need to be like this???
            (await client.users.fetch(adminID)).send('FUCK');
            break;
    }
});

function intervalFunc() {
    // this is where the fetchClient will use the middleware to refresh data/etc.
    logger.info('Interval function reached');
}
