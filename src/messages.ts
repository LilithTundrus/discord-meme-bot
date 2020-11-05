// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports

// Node native imports

// NPM package imports

// Global declarations

// Variables used for storing message to keep things sort of modular
const useAServer = 'Sorry, please use this bot in a valid Discord server. Thanks!';

const successfulRegister =
    'Got it, you now have an active discord ID, you can use the `!!add` command to add a subreddits to a channel.';

const alreadyRegistered =
    'You are already set up with an active Discord ID. Use the `!!add` command to add subreddits to this channel.';

const registrationError =
    'Sorry, something went wrong. Try again later. I will DM the bot admin and let them know something went wrong.';

export { useAServer, successfulRegister, alreadyRegistered, registrationError };
