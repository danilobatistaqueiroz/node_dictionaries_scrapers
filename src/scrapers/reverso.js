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
        let startword = 0;
        if(startword==0){
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));

        for(let word of words) {
            count++;
            if (count < startword) {
                continue;
            }
            console.log(word);
            if(util.isCapitalized(word)){
                files.appendFile('\t');
                files.appendNewLineFile();
                continue;
            }
            let url = `https://context.reverso.net/translation/english-${json.language}/${word}`;
            await page.goto(url);
            await page.waitForSelector('.results');

            let translations = [];

            let html = await page.content();
            let content = util.getDom(html,'.left-content #top-results #translations-content');

            let datapos = 'data-pos=';
            let datafreq = 'data-freq=';
            if (content == null) {
                files.appendFile('\t');
                files.appendNewLineFile();
                continue;
            }
            
            let links = content.querySelectorAll('.translation');
            for (let i = 0; i < links.length; i++) {
                if(links[i]==undefined || links[i].textContent == '')
                    continue;
                let type = reverso.getTranslationField(links[i].outerHTML, datapos);
                let freq = reverso.getTranslationField(links[i].outerHTML, datafreq);
                translations.push({"type":type,"freq":parseInt(freq),"value":links[i].textContent.trim()})
            }

            translations.sort(function (a, b) {
                return parseInt(b.freq) - parseInt(a.freq);
            });

            if(translations.length > 0){
                // let bold = reverso.getBoldTerms(translations);
                // for(let b = 0; b < bold.length; b++){
                //     files.appendFile(`(${bold[b].freq})${bold[b].value},`);
                // }
                //files.appendFile('\t');
                for(let t = 0; t < translations.length; t++){
                    files.appendFile(`(${translations[t].freq})${translations[t].value},`);
                }
            } else {
                files.appendFile('\t');
            }
            files.appendNewLineFile();
        }
        let end = new Date()
        files.appendLog('', '', dateFormat(end, "h:MM:ss l"));
        files.appendLog('', '', 'total de palavras:' + count);
    }
}

module.exports = scraperObject;