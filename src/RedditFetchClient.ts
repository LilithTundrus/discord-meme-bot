// Force ES6 strict mode on compiled JS
'use strict';

// Custom code imports
import { redditFetchConfig } from './config';
import Middleware from './database/Middleware';


// Node native imports


// NPM package imports
// Reddit API wrapper
import * as snoowrap from 'snoowrap';


export default class RedditFetchClient {
    private wrapper: snoowrap;
    private mw: Middleware;

    constructor(snoowrapperInstance: snoowrap, middleWare: Middleware) {
        this.wrapper = snoowrapperInstance;
        this.mw = middleWare;
    }

    test() {
        // Printing a list of the titles on the front page
        return this.wrapper.getHot().then((results) => {
            return results[0].url
        })
    }

    getNewSubredditPostsBySubredditName(subRedditName) {
        return this.wrapper.getSubreddit(subRedditName).getNew().then((posts) => {
            return posts;
        })
    }
}