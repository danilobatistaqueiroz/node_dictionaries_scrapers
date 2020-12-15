const wordsInput = require('./words-input');
const wordsOutput = require('./words-output');
const scraper = require('./scraper');
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        words = wordsInput()
        allTranslations = await scraper.scrape(browser, words)
        wordsOutput(allTranslations)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)