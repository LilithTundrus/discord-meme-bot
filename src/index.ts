// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { botToken } from './config';

// Node native imports

// NPM package imports
import * as Discord from 'discord.js';

// Global declarations
const client = new Discord.Client();
const prefix = '!!';

client.login(botToken);

client.on('ready', () => {
    console.log('Connected to Discord...');
});