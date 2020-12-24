const reverso = require('./scrapers/reverso');
const cambridge = require('./scrapers/cambridge');
const freedic = require('./scrapers/freedic');
const linguee = require('./scrapers/linguee');
const lingueeauto = require('./scrapers/lingueeauto');
const howjsay = require('./scrapers/howjsay');
const google = require('./scrapers/google');
const googletranslator = require('./scrapers/googletranslator');
const json = require('../config.json');

const scraperObject = {
    async scrape(browser){
        return eval(`(${json.site})`).scrape(browser);
    }
}

module.exports = scraperObject;