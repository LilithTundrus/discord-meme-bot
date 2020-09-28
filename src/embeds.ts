// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports

// Node native imports

// NPM package imports
// Discord.js is an NPM package designed to help with creating Discord bots
import * as Discord from 'discord.js';

// Global declarations

const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Some title')
    .setURL('https://discord.js.org/')
    .setAuthor('Help', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
    .setDescription('Help')
    .setThumbnail('https://i.imgur.com/wSTFkRM.png')
    .addFields(
        { name: 'Regular field title', value: 'Help' },
        { name: '\u200B', value: '\u200B' },
        { name: 'Inline field title', value: 'Help', inline: true },
        { name: 'Inline field title', value: 'HelpHelpHelp', inline: true }
    )
    .addField('Inline field title', 'Help', true)
    .setImage('https://i.imgur.com/wSTFkRM.png')
    .setTimestamp()
    .setFooter('Help', 'https://i.imgur.com/wSTFkRM.png');

const adminEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Admin Console')
    .addField('Commands:', 'Reset \nRestart')
    .setTimestamp();

export { exampleEmbed, adminEmbed };
