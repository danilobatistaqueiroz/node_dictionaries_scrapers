"use strict"
const files = require('./files');
const scraper = require('./scraper');
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await scraper.scrape(browser)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)