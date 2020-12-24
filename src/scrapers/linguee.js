"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');

const linguee = {
    async queryDictionary(page, word, selector){
        if(util.isCapitalized(word)){
            return {"result":util.result.fail,"reason":'capitalized'};
        }
        let url = `https://www.linguee.com.br/portugues-ingles/search?source=auto&query=${word}`;
        const response = await page.goto(url);
        const chain = response.request().redirectChain();
        if(chain.length==1){
            return {"result":util.result.fail,"reason":'redirect'};
        }
        try{
            await page.setDefaultTimeout(10000);
            await page.setDefaultNavigationTimeout(10000);
            await page.waitForSelector(selector);
        } catch (err) {
            return {"result":util.result.fail,"reason":'timeout'};
        }
        return {"result":util.result.success,"reason":'ok'};
    },
}

const scraperObject = {
    
    async scrape(browser, words){
        let page = await browser.newPage();
        files.initializeLog();
        files.initializeFile();
        let mainSelector = '#dictionary';
        for(let word of words){
            util.sleepFor(15000);
            console.log(word);
            let ret = await linguee.queryDictionary(page, word, mainSelector);
            if(ret.result==util.result.fail){
                console.log('%cfail:'+ret.reason, 'color:red');
                files.appendLog(word, util.result.fail, ret.reason);
                files.appendFile('\t\n');
                continue;
            }
            let translationList = [];
            let html = await page.content();
            let content = util.getDom(html,mainSelector);
            let lemmas = content.querySelectorAll('.lemma.featured');
            console.log('lemmas:'+lemmas.length);
            for(let l = 0; l < lemmas.length; l++){
                let term = lemmas[l].querySelector('.line.lemma_desc .tag_lemma a[class="dictLink"]');
                if(term.innerHTML.indexOf(word)>=0){
                    console.log('\x1b[36m%s\x1b[0m', 'Ok');;
                    let translations = lemmas[l].querySelectorAll('.lemma_content .translation_lines h3[class="translation_desc"] span[class="tag_trans"] a[class="dictLink featured"]');
                    console.log('\x1b[36m%s\x1b[0m', 'translations:'+translations.length);;
                    for(let t = 0; t < translations.length; t++){
                        console.log(translations[t].textContent);
                        translationList.push(translations[t].textContent);
                    }
                }
            }
            let uniqTranslations = array.uniq(translationList);
            console.log('\x1b[36m%s\x1b[0m', uniqTranslations.join(','));
            files.appendFile(uniqTranslations.join(',')+'\t\n');
        }
    }
}

module.exports = scraperObject;