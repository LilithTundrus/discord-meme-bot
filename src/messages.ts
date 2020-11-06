// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports

// Node native imports

// NPM package imports

// Global declarations

// Variables used for storing message to keep things sort of modular
// Only messages that do not need variables are stored here.
// Short messages are also kept in the bot file
const useAServer = 'Sorry, please use this bot in a valid Discord server. Thanks!';

const successfulRegister =
    'Got it, you now have an active discord ID, you can use the `!!add` command to add a subreddits to a channel.';

const alreadyRegistered =
    'You are already set up with an active Discord ID. Use the `!!add` command to add subreddits to this channel.';

const registrationError =
    'Sorry, something went wrong. Try again later. I will DM the bot admin and let them know something went wrong.';

const successfulUnregister = 'This server has been unregistered with the bot!';

const alreadyUnregistered = 'Sorry, it looks like this server is not registered.';

const addArgsNeeded =
    'Please give a subreddit to subscribe to with the `!!add` command\nExample: `!!add funny`';

const addNeedToRegister = 'You need to initialize your server with the `register` command first.';

const removeArgsNeeded =
    'Please give a subreddit to unsubscribe to with the `!!remove` command\nExample: `!!remove funny`';

const showSubsNoSubscriptions =
    'It looks like this server had no subscribed subreddits. Add some with the `!!add` command!';

const hotArgsNeeded =
    'Please give a subreddit to switch to sorting by hot. Example: `!!sethot funny`';

export {
    useAServer,
    successfulRegister,
    alreadyRegistered,
    registrationError,
    successfulUnregister,
    alreadyUnregistered,
    addArgsNeeded,
    addNeedToRegister,
    removeArgsNeeded,
    showSubsNoSubscriptions,
    hotArgsNeeded,
};
