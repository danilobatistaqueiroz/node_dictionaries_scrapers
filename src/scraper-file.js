"use strict"

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
    let fileName = dic+'words'
    console.log(`iniciando ${dic} ${fileName}`);
    json.fileName = fileName;
    json.site = dic;
    await eval(`(${dic})`).scrape(browser)
}