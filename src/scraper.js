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
        if( json.site == '3') {
            console.log('iniciando reverso ' + json.fileName);
            json.site = 'reverso';
            await reverso.scrape(browser);
            //console.log('iniciando googletranslator ' + json.fileName);
            //json.site = 'googletranslator';
            //await googletranslator.scrape(browser);
            //console.log('iniciando lingueeauto ' + json.fileName);
            //json.site = 'lingueeauto';
            //await lingueeauto.scrape(browser);
            console.log('iniciando howjsay ' + json.fileName);
            json.site = 'howjsay';
            await howjsay.scrape(browser);
            console.log('iniciando cambridge ' + json.fileName);
            json.site = 'cambridge';
            await cambridge.scrape(browser);
        } else if (json.site == '3x3'){
            let ini = 23001;
            let end = 24000;
            for(let i = 1; i <= 3; i++){
                ini+=1000;
                end+=1000;
                json.fileName = ini.toString()+'-'+end.toString();

                console.log('iniciando reverso ' + json.fileName);
                json.site = 'reverso';
                await reverso.scrape(browser);
                console.log('iniciando cambridge ' + json.fileName);
                json.site = 'cambridge';
                await cambridge.scrape(browser);
                console.log('iniciando howjsay ' + json.fileName);
                json.site = 'howjsay';
                await howjsay.scrape(browser);
            }
        } else {
            return eval(`(${json.site})`).scrape(browser);
        }
    }
}

module.exports = scraperObject;