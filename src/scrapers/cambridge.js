"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const fs = require('fs');
const path = require('path');

const cambridge = {
    getFileName (str) {
        return str.substring(str.lastIndexOf('/')+1).replace(' ','');
    },
    downloadMp3(lists){
        const https = require('https');
        for(let a = 0; a < lists.audios.length; a++){
            let audio = path.join('https://dictionary.cambridge.org',lists.audios[a]);
            let fileName = this.getFileName(audio);
            const file = fs.createWriteStream(`output/mp3/cambridge-${fileName}`);
            const request = https.get(audio, function(response) {
                response.pipe(file);
            });
        }
    },
    setMp3Field(lists){
        for(let i = 0; i < lists.audios.length; i++){
            let mp3 = this.getFileName(lists.audios[i]);
            lists.audios[i] = `[sound:cambridge-${mp3}]`;
        }
        return lists;
    },
    removeDuplications(group){
        let pronunciations = array.uniq(group.pronunciations);
        let translations = array.uniq(group.translations);
        let audios = array.uniq(group.audios);
        let definitions = array.uniq(group.definitions);
        translations = this.removeDuplicatedTranslatedTerms(translations);
        console.log(pronunciations);
        console.log(translations);
        console.log(audios);
        console.log(definitions);
        return {pronunciations, translations, audios, definitions};
    },
    removeDuplicatedTranslatedTerms(translations){
        let splited = this.transformCommaSeparatedTermsInItems(translations);
        splited = splited.map(t => t.trim());
        return array.uniq(splited);
    },
    transformCommaSeparatedTermsInItems(translations){
        let str = translations.toString();
        return str.split(',');
    },
    async queryDictionary(page, word, selector){
        if(util.isCapitalized(word)){
            return util.result.fail;
        }
        let url = `https://dictionary.cambridge.org/dictionary/english-portuguese/${word}`;
        const response = await page.goto(url);
        const chain = response.request().redirectChain();
        if(chain.length==1){
            return util.result.fail;
        }
        try{
            await page.setDefaultTimeout(5000);
            await page.setDefaultNavigationTimeout(5000);
            await page.waitForSelector(selector);
        } catch (err) {
            return util.result.fail;
        }
        return util.result.success;
    },
}

const scraperObject = {
    async scrape(browser){
        let words = files.loadInputFile();
        let page = await browser.newPage();
        files.initializeLog();
        files.initializeFile();
        let mainSelector = '.entry-body.dentry-body';
        for(let word of words){
            console.log(word);
            let result = await cambridge.queryDictionary(page, word,mainSelector);
            if(result==util.result.fail){
                console.log('fail');
                files.appendLog(word, util.result.fail);
                files.appendFile('\t\t\t\n');
                continue;
            }
            let html = await page.content();
            let content = util.getDom(html,mainSelector);
            let entryBodies = content.querySelectorAll('.pr.entry-body__el');
            let pronunciations = [];
            let translations = [];
            let audios = [];
            let definitions = [];
            let divDefinitions = content.querySelectorAll('.def.ddef_d.db');
            for(let d = 0; d < divDefinitions.length; d++){
                definitions.push(divDefinitions[d].textContent+'. ');
            }
            for(let e = 0; e < entryBodies.length; e++){
                let blocks = entryBodies[e].querySelectorAll('.sense-block.pr.dsense.dsense-noh');
                if(blocks==null || blocks.length==0){
                    continue;
                }
                let meanings = content.querySelectorAll('.trans.dtrans.dtrans-se');
                console.log(meanings.length);
                for(let m = 0; m < meanings.length; m++){
                    console.log(m);
                    console.log(meanings[m].innerHTML);
                    console.log(meanings[m].textContent);
                    translations.push(meanings[m].textContent.trim());
                }
                let divPronUS = entryBodies[e].querySelectorAll('.pron-info.dpron-info')[1];
                if(divPronUS==null){
                    continue;
                }
                if(divPronUS.querySelector('audio')==null){
                    divPronUS = entryBodies[e].querySelectorAll('.pron-info.dpron-info')[2];
                    if(divPronUS==undefined)
                        continue;
                }
                let audioMp3 = divPronUS.querySelector('audio source[type="audio/mpeg"]');
                if(audioMp3!=null) {
                    let mp3 = audioMp3.src;
                    audios.push(mp3);
                }
                let divsIPA = divPronUS.querySelectorAll('.pron.dpron');
                for(let p = 0; p < divsIPA.length; p++) {
                    pronunciations.push(divsIPA[p].innerHTML.trim());
                }
            }
            let group = {translations,pronunciations,audios,definitions};
            let lists = cambridge.removeDuplications(group);
            cambridge.downloadMp3(lists);
            lists = cambridge.setMp3Field(lists);
            files.appendFile(`${lists.translations}\t${lists.pronunciations}\t${lists.audios}\t${lists.definitions}\n`);
        }
    },
}

module.exports = scraperObject;