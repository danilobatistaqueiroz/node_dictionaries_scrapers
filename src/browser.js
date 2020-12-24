"use strict"
const puppeteer = require('puppeteer');
const json = require('../config.json');

async function startBrowser () {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: json.headless, 
            args: [
                `--disable-setuid-sandbox`,
                //`--proxy-server=socks5://127.0.0.1:9050`
            ],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

async function stopBrowser(browserInstance) {
    let browser = await browserInstance;
    await browser.close();
}

module.exports = {
    startBrowser, stopBrowser
};