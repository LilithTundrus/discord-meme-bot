// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken, botPrefix } from './config';

// Node native imports

// NPM package imports
import * as Discord from 'discord.js';

// Global declarations
const client = new Discord.Client();
const prefix = botPrefix;


// Initiate the wrapper for getting reddit content here


// Set up the periodic check for new reddit posts here
setInterval(intervalFunc, 1500);

client.login(botToken);

client.on('ready', () => {
    console.log('Connected to Discord...');
});

client.on('message', async message => {
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with the bot prefix
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
    }
});

function intervalFunc() {
    console.log('Interval function reached');
}