const forvo = require('./scrapers/forvo');
const json = require('../config.json');
const browserObject = require('./browser');
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

async function scrape(browser){
    json.site = 'forvo';
    await forvo.scrape(browser);
}
