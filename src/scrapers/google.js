"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const colors = require('colors/safe');
var dateFormat = require('dateformat');
var json = require('../../config.json');

const scraperObject = {
    async typeWord(page, word) {
        try{
            await page.$eval('textarea[class="er8xn"]', el => el.value = '');
            await page.keyboard.type(word);
            await page.waitForSelector('span[class="VIiyi"]');
        } catch (err) { 
            return 'fail';
        }
        return 'success';
    },
    async scrape(browser) {
        files.initialize();
        let words = files.loadInputFile();
        const page = await browser.newPage();
        let sourceLang = 'en', targetLang = 'pt';
        let count = 0;
        let startLine = parseInt(json.startLine);
        if(files.exists()) {
            let cntwords = files.getWordsInFile();
            if(cntwords <= 1){
                console.log(`arquivo ${files.outputFile} vazio!`);
            } else if(cntwords > 1){
                console.log(`arquivo ${files.outputFile} com ${cntwords} linhas!`);
                if(cntwords > 999)
                    return
                startLine = cntwords+1
            }
        }
        let cntWords = files.getWordsInFile();
        if ( (cntWords+1)!=startLine ){
            console.log(`linhas no arquivo:${cntWords}`);
            files.appendLog('',fail,'arquivo com numero de linhas incompativel ao informado!');
            return
        }

        if(startLine==0){
            files.initializeLog();
            files.initializeFile();
        }

        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));
        
        await page.goto(`https://translate.google.com/#view=home&op=translate&sl=${sourceLang}&tl=${targetLang}`);
        await page.focus('textarea[class="er8xn"]');

        let endLine = parseInt(json.endLine);
        for (let word of words) {

            await util.delay(2000);
            
            console.log(word);
            count++;
            if (count < startLine) {
                continue;
            }
            if(count > endLine) {
                break;
            }
            if(util.isCapitalized(word)){
                files.appendLog(word,'fail','capitalized');
                files.appendFile(word+'\t\n');
                continue;
            }
            if(word.length<=3){
                files.appendLog(word,'fail','tres ou menos');
                files.appendFile(word+'\t\n');
                continue;
            }

            let result = await this.typeWord(page, word);
            if (result == 'fail') {
                console.log(colors.red('nao encontrou traducao principal'));
                files.appendLog(word,'fail','nao encontrou traducao principal');
                files.appendFile(word+'\t\n');
                continue;
            }

            await util.delay(2000);

            let value = await page.$eval('textarea[class="er8xn"]', el => el.value);
            if(value!=word){
                result = await this.typeWord(page, word);
                if (result == 'fail') {
                    console.log(colors.red('nao encontrou traducao principal'));
                    files.appendLog(word,'fail','nao encontrou traducao principal');
                    files.appendFile(word+'\t\n');
                    continue;
                }
            } else {
                value = await page.$eval('textarea[class="er8xn"]', el => el.value);
                if(value!=word){
                    console.log(colors.red('nao encontrou'));
                    files.appendLog(word,'fail','nao encontrou');
                    files.appendFile(word+'\t\n');
                    continue;
                }
            }

            let mainTranslations = [];
            try{
                mainTranslations = await page.evaluate(() => {
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
            } catch (ex){
                console.log(colors.red(ex));
            }

            await util.delay(1000);

            let otherTranslations = [];
            try{
                otherTranslations = await page.evaluate(() => {
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
            } catch (ex){
                console.log(colors.red(ex));
            }

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

            await util.delay(2000);
        }
        let end = new Date()
        files.appendLog('', '', dateFormat(end, "h:MM:ss l"));
        files.appendLog('', '', 'total de palavras:' + count);
    }
}

module.exports = scraperObject;