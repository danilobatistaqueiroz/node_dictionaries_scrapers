"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const colors = require('colors/safe');
var dateFormat = require('dateformat');
var json = require('../../config.json');

const scraperObject = {
    async typeWord(page, word) {
        await page.$eval('textarea[class="er8xn"]', el => el.value = '');
        await page.keyboard.type(word);
        await page.waitForSelector('span[class="VIiyi"]');
    },
    async scrape(browser) {

        let words = files.loadInputFile();

        const page = await browser.newPage();

        let sourceLang = 'en', targetLang = 'pt';

        let count = 0;
        let startLine = parseInt(json.startLine);
        if(startLine==0){
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));
        
        await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`);
        await page.focus('textarea[class="er8xn"]');

        for (let word of words) {
            count++;
            if (count < startLine) {
                continue;
            }
            console.log(word);

            if(util.isCapitalized(word)){
                console.log(colors.red('capitalized'));
                files.appendLog(word,'fail','capitalized');
                files.appendFile(word+'\t\n');
                continue;
            }

            await this.typeWord(page, word);
            
            await this.delay(1000);

            let value = await page.$eval('textarea[class="er8xn"]', el => el.value);
            if(value!=word){
                this.typeWord(page, word);
            } else {
                value = await page.$eval('textarea[class="er8xn"]', el => el.value);
                if(value!=word){
                    console.log(colors.red('nao encontrou'));
                    files.appendLog(word,'fail','nao encontrou');
                    files.appendFile(word+'\t\n');
                    continue;
                }
            }

            const mainTranslations = await page.evaluate(() => {
                //let main = document.querySelectorAll('span[class="J0lOec"]');
                let main = document.querySelectorAll('.VIiyi');
                let sexs = document.querySelectorAll('.NlvNvf');
                list = [];
                let term;
                if(sexs != null && sexs.length==2) {
                    term = main[1];
                } else {
                    term = main[0];
                }
                if (term.childNodes[0].nodeName != '#text') {
                    let wordsTr = document.querySelectorAll('span[jsname="W297wb"]');
                    wordsTr.forEach((w) => {
                        list.push({"text":w.innerText,"frequency":undefined});
                    });
                } else {
                    list.push({"text":term.innerText,"frequency":undefined});
                }
                return list;
            });

            const otherTranslations = await page.evaluate(() => {
                let others = document.querySelectorAll('.KnIHac');
                let blocks = document.querySelectorAll('.YF3enc');
                list = [];
                for(let o = 0; o < others.length; o++) {
                    frequency = 0;
                    let block1 = blocks[o].childNodes[0];
                    let block2 = blocks[o].childNodes[1];
                    let block3 = blocks[o].childNodes[2];
                    let blockGray = 'fXx9Lc';
                    if (block1.classList[1] == blockGray) {
                        frequency = 0;
                    } else if (block2.classList[1] == blockGray) {
                        frequency = 1;
                    } else if (block3.classList[1] == blockGray) {
                        frequency = 2;
                    } else {
                        frequency = 3;
                    }
                    list.push({"text":others[o].textContent,"frequency":frequency});
                }
                return list;
            });

            if(otherTranslations.length==0 && mainTranslations.length==0){
                console.log(colors.red('nao encontrou tradução'));
                files.appendLog(word,'fail','nao encontrou tradução');
                files.appendFile(word+'\t\n');
                continue;
            }

            otherTranslations.sort((a,b) => b.frequency - a.frequency);

            let allTranslations = [];
            for(let m = 0; m < mainTranslations.length; m++) {
                let main = mainTranslations[m];
                for(let o = 0; o < otherTranslations.length; o++) {
                    let other = otherTranslations[o];
                    if(other.text.toLowerCase() == main.text.toLowerCase()) {
                        mainTranslations.splice(m,1);
                        m--;
                        break;
                    }
                }
            }

            mainTranslations.forEach((main) => allTranslations.push(main));
            otherTranslations.forEach((other) => allTranslations.push(other));
            allTranslations = array.uniq(allTranslations);

            let listText = [];
            for (let i = 0; i < allTranslations.length; i++) {
                if (allTranslations[i].frequency != undefined)
                    listText.push('(' + allTranslations[i].frequency + ')' + allTranslations[i].text.trim());
                else
                    listText.push(allTranslations[i].text.trim());
            }

            console.log(listText.join(','));
            files.appendFile(word+'\t'+listText.join(',') + '\n');

            await this.delay(2000);
        }
        let end = new Date()
        files.appendLog('', '', dateFormat(end, "h:MM:ss l"));
        files.appendLog('', '', 'total de palavras:' + count);
    },
    delay : async (ms) => new Promise(res => setTimeout(res, ms)),
}

module.exports = scraperObject;