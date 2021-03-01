"use strict"

const reverso = require('./scrapers/reverso');
const cambridge = require('./scrapers/cambridge');
const howjsay = require('./scrapers/howjsay');
const google = require('./scrapers/google');

const json = require('../config.json');

const browserObject = require('./browser');

const files = require('./files');

let browserInstance = browserObject.startBrowser();

async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await scrape(browser)
    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}
scrapeAll(browserInstance).then(()=>{
    browserObject.stopBrowser(browserInstance);
});

var dic = process.argv.slice(2);

async function scrape(browser){
    let ini = 2001
    let end = 3000

    for(let i = 1; i <= 40; i++){
        let fileName = ini.toString()+'-'+end.toString();
        console.log(`iniciando ${dic} ${fileName}`);
        json.fileName = fileName;
        json.site = dic;
        await eval(`(${dic})`).scrape(browser)
        ini+=1000;
        end+=1000;
        if(ini == 41000)
            break;
        if(end == 41000)
            end = 41284;
    }

}