"use strict"
var json = require('../../config.json');
var files = require('../files');
var util = require('../util');
const colors = require('colors/safe');
var dateFormat = require('dateformat');

const reverso = {
    getTranslationField (html, field) {
        let ini = html.indexOf(field);
        let fieldLength = field.length+1;
        let data = '';
        if(ini>0){
            let end = html.indexOf('" ',ini+fieldLength);
            data = html.substring(ini+fieldLength,end);
        }
        return data;
    },
}

const scraperObject = {
    async scrape(browser){
        let words = files.loadInputFile();
        let page = await browser.newPage();

        let count = 0;
        let startLine = parseInt(json.startLine);
        if(startLine==0){
            if(files.exists()) {
                files.appendLog('',util.result.fail,'arquivo existente!');
                return;
            }
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));

        for(let word of words) {
            console.log(word);
            count++;
            if (count < startLine) {
                continue;
            }
            if(util.isCapitalized(word)){
                files.appendFile('\t\n');
                continue;
            }
            
            await util.delay(500);

            let url = `https://context.reverso.net/translation/english-${json.language}/${word}`;
            try{
                await page.goto(url);
                await page.setDefaultTimeout(4000);
                await page.setDefaultNavigationTimeout(4000);
                await page.waitForSelector('.results');
            } catch (err) {
                files.appendFile('\t\n');
                continue;
            }

            let translations = [];

            await util.delay(500);

            let html = await page.content();
            let content = util.getDom(html,'.left-content #top-results #translations-content');

            await util.delay(500);
            
            let datapos = 'data-pos=';
            let datafreq = 'data-freq=';
            if (content == null) {
                files.appendFile('\t\n');
                continue;
            }
            
            await util.delay(1500);

            let links = content.querySelectorAll('.translation');
            for (let i = 0; i < links.length; i++) {
                if(links[i]==undefined || links[i].textContent == '')
                    continue;
                let type = reverso.getTranslationField(links[i].outerHTML, datapos);
                let freq = reverso.getTranslationField(links[i].outerHTML, datafreq);
                translations.push({"type":type,"freq":parseInt(freq),"value":links[i].textContent.trim()})
            }

            await util.delay(500);
            
            translations.sort(function (a, b) {
                return parseInt(b.freq) - parseInt(a.freq);
            });

            await util.delay(500);

            files.appendFile(`${word}\t`)
            if(translations.length > 0){
                for(let t = 0; t < translations.length; t++){
                    files.appendFile(`(${translations[t].freq})${translations[t].value},`);
                }
            } 
            await util.delay(1500);
            files.appendFile('\n');
        }
        let end = new Date()
        files.appendLog('', '', dateFormat(end, "h:MM:ss l"));
        files.appendLog('', '', 'total de palavras:' + count);
    }
}

module.exports = scraperObject;