// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports

// Node native imports

// NPM package imports
// Discord.js is an NPM package designed to help with creating Discord bots
import * as Discord from 'discord.js';

// Global declarations

const helpEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help Menu')
    // .setURL('https://discord.js.org/')
    // .setAuthor('Help', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('Available Commands:')
    // .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    .addField(
        'Register',
        'Register your discord with the bot, this needs to be done before you can use the `add` or `setchat` commands'
    )
    .addField('Unregister', 'Remove all data and registration for your server from the bot')
    .addField('Setchat', 'Set the chat for which the bot will post links to')
    .addField('Add', 'Add a subreddit by its name to your sub list')
    .addField('Remove', 'Remove a subreddit by its name from your sub list')
    .addField('Showsubs', 'Show all the subreddits your server is subscribed to')
    // .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    // .setFooter('Version', '0.0.1');

const adminEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Admin Console')
    .addField('Commands:', 'Reset \nRestart')
    .setTimestamp();

const redditEmbed = new Discord.MessageEmbed();

export { helpEmbed, adminEmbed };
