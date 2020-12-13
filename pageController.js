const wordsInput = require('./words-input');
const wordsOutput = require('./words-output');
const pageScraper = require('./Reverso');
async function scrapeAll(browserInstance){
    let browser;
    language = 'spanish';
    try{
        browser = await browserInstance;
        words = wordsInput()
        allTranslations = ''
        counter = 0
        for(i = 0; i < words.length; i++) {
            englishWord = words[i]
            twords = await pageScraper.scraper(browser, 'english-'+language, englishWord)
            await twords.forEach(async w => {
                allTranslations += (w.value+',');
            });
            console.log(counter++);
            allTranslations += '\n'
        }
        wordsOutput(language, allTranslations)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)