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
        if( json.site == '5') {
            console.log('iniciando reverso');
            json.site = 'reverso';
            await reverso.scrape(browser);
            console.log('iniciando googletranslator');
            json.site = 'googletranslator';
            await googletranslator.scrape(browser);
            console.log('iniciando lingueeauto');
            json.site = 'lingueeauto';
            await lingueeauto.scrape(browser);
            console.log('iniciando howjsay');
            json.site = 'howjsay';
            await howjsay.scrape(browser);
            console.log('iniciando cambridge');
            json.site = 'cambridge';
            await cambridge.scrape(browser);
        } else {
            return eval(`(${json.site})`).scrape(browser);
        }
    }
}

module.exports = scraperObject;