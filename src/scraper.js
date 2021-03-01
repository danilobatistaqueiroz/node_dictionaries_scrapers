const reverso = require('./scrapers/reverso');
const cambridge = require('./scrapers/cambridge');
const freedic = require('./scrapers/freedic');
const linguee = require('./scrapers/linguee');
const howjsay = require('./scrapers/howjsay');
const google = require('./scrapers/google');
const json = require('../config.json');

const scraperObject = {
    async scrape(browser){
        if( json.site == '1x'){
            let slash = json.fileName.indexOf('-')
            let ini = parseInt(json.fileName.substring(0,slash));
            let len = json.fileName.length;
            let end = parseInt(json.fileName.substring(slash+1,len));
            console.log(ini, end);
            for(let i = 1; i <= 40; i++){
                json.fileName = ini.toString()+'-'+end.toString();
                console.log('iniciando howjsay ' + json.fileName);
                json.site = 'howjsay';
                await howjsay.scrape(browser);
                ini+=1000;
                end+=1000;
                json.startLine = 0
                if(ini == 41000)
                    break;
                if(end == 41000)
                    end = 41284;
            }
        }
    }
}

module.exports = scraperObject;