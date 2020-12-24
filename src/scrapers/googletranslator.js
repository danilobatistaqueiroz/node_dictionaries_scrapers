var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const colors = require('colors/safe');
var dateFormat = require('dateformat');

const scraperObject = {
    delay : async (ms) => new Promise(res => setTimeout(res, ms)),
    async scrape(browser) {

        let words = files.loadInputFile();

        const page = await browser.newPage();

        let sourceLang = 'en', targetLang = 'pt';

        let count = 0;
        let startword = 625;
        if(startword==0){
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));
        
        await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`);
        await page.focus('textarea[class="er8xn"]');

        for (let word of words) {
            count++;
            if (count < startword) {
                continue;
            }
            console.log(word);

            if(util.isCapitalized(word)){
                console.log(colors.red('capitalized'));
                files.appendLog(word,'fail','capitalized');
                files.appendFile(word+'\t\n');
                continue;
            }

            await page.$eval('textarea[class="er8xn"]', el => el.value = '');
            await page.keyboard.type(word);
            await page.waitForSelector('span[class="VIiyi"]');
            
            await this.delay(1000);

            let value = await page.$eval('textarea[class="er8xn"]', el => el.value);
            if(value!=word){
                console.log(colors.red('nao encontrou'));
                files.appendLog(word,'fail','nao encontrou');
                files.appendFile(word+'\t\n');
                continue;
            }

            const mainTranslations = await page.evaluate(() => {
                let main = document.querySelectorAll('span[class="J0lOec"]');
                text = [];
                main.forEach((m) => {
                    let term = main.querySelector('.VIiyi');
                    let sex = main.querySelector('.NlvNvf');
                    if(sex !=null && sex.textContent=='feminino')
                        continue;
                    if (term.childNodes[0].nodeName != '#text') {
                        let list = document.querySelectorAll('span[jsname="W297wb"]');
                        list.forEach((l) => {
                            text.push(l.textContent);
                        });
                    } else {
                        text.push(term.textContent);
                    }
                });
                return text;
            });

            const otherTranslations = await page.evaluate(() => {
                let others = document.querySelectorAll('.KnIHac');
                let blocks = document.querySelectorAll('.YF3enc');
                list = [];
                for(let i = 0; i < others.length; i++) {
                    frequency = 0;
                    let block1 = blocks[i].childNodes[0];
                    let block2 = blocks[i].childNodes[1];
                    let block3 = blocks[i].childNodes[2];
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

            if(otherTranslations.length==0 || mainTranslations.length==0){
                console.log(colors.red('nao encontrou tradução'));
                files.appendLog(word,fail,'nao encontrou tradução');
                files.appendFile(word+'\t\n');
                continue;
            }

            otherTranslations.sort((a,b) => b.frequency - a.frequency);

            text = [];
            for(let m = 0; m < mainTranslations.length; m++) {
                otherTranslations.forEach((o) => {
                    if(o.substring(3).toLowerCase() == mainTranslations[m].toLowerCase()) {
                        console.log('slice:'+m);
                        mainTranslations.splice(m,1);
                        m--;
                    }
                });
            }
            mainTranslations.forEach((m) => text.push(m));
            otherTranslations.forEach((o) => text.push(o));
            text = array.uniq(text);

            console.log(text.join(','));
            files.appendFile(word+'\t'+text.join(',') + '\n');

            for (let i = 0; i < text.length; i++) {
                if (frequency[i] != undefined)
                    text[i] = '(' + frequency[i] + ')' + text[i].trim();
            }

            await this.delay(2000);
        }
        let end = new Date()
        files.appendLog('', '', dateFormat(end, "h:MM:ss l"));
        files.appendLog('', '', 'total de palavras:' + count);
    }
}

module.exports = scraperObject;