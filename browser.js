const puppeteer = require('puppeteer');

async function startBrowser () {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false, 
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

async function stopBrowser(browserInstance) {
    browser = await browserInstance;
    await browser.close();
}

module.exports = {
    startBrowser, stopBrowser
};