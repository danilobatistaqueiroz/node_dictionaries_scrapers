"use strict"
const fs = require('fs');
var util = require('../util');
const files = require('../files');
var json = require('../../config.json');
const scraperObject = {
    async loadInputFile(){
        try {
            const data = fs.readFileSync('../input/forvo-palavras.csv', 'UTF-8');
            const lines = data.split(/\r?\n/);
            return lines.map((line) => {
                let t = line.indexOf('\t');
                if(t<0){
                    t = line.length;
                }
                return line.substring(0,t)
            });
        } catch (err) {
            console.error(err);
        }
    },
    async scrape(browser) {

        let words = await this.loadInputFile();
        
        const page = await browser.newPage();

        for (let word of words) {

            await util.delay(4000);
            
            console.log(word);

            await page.tracing.start({ categories: ['devtools.timeline'], path: "../logs/tracing.json" });

            await page.goto(`https://forvo.com/search/${word}/pt/`);
            await page.waitForSelector('span[class="play  icon-size-l"]');
            await page.$eval('span[class="play  icon-size-l"]', el => el.click());

            let tracing = JSON.parse(await page.tracing.stop());
            tracing = JSON.stringify(tracing);
            let end = tracing.indexOf('.mp3');
            let ini = tracing.lastIndexOf('https:',end);
            let mp3 = tracing.substring(ini,end+4);
            fs.appendFileSync('../output/forvo.json', word+'\t'+mp3+'\n');
        }
    }
}
module.exports = scraperObject;