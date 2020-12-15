const reverso = require('./reverso');
const cambridge = require('./cambridge');
const json = require('../config.json');

const scraperObject = {
    async scrape(browser, words){
        return eval(`(${json.site})`).scrape(browser, words);
    }
}

module.exports = scraperObject;