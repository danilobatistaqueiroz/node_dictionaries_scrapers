const wordsInput = require('./words-input');
const wordsOutput = require('./words-output');
const pageScraper = require('./Reverso');
async function scrapeAll(browserInstance){
    let browser;
    language = 'spanish';
    try{
        browser = await browserInstance;
        words = wordsInput()
        await pageScraper.scraper(browser, 'english-'+language, words)
        wordsOutput(language, allTranslations)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)