"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const json = require('../../config.json');
const colors = require('colors/safe');

const fail = util.result.fail;
const success = util.result.success;

const lingueeauto = {
    async queryAuto(page, word, selector){
        if(util.isCapitalized(word)){
            return {"result":fail,"reason":'capitalized'};
        }
        let url = '';
        if(json.env=='test'){
            url = `file:///home/element/tutorials/puppeteer/html/lingueeauto/${word}.html`;
        } else {
            url = `https://www.linguee.com.br/portugues-ingles/search?qe=${word}&source=&cw=1020&ch=268&as=shownOnStart`;
        }
        const response = await page.goto(url);
        const chain = response.request().redirectChain();
        if(chain.length==1){
            return {"result":fail,"reason":'redirect'};
        }
        try{
            await page.setDefaultTimeout(this.getTimeout());
            await page.setDefaultNavigationTimeout(this.getTimeout());
            await page.waitForSelector(selector);
        } catch (err) {
            return {"result":fail,"reason":'timeout'};
        }
        return {"result":success,"reason":'ok'};
    },
    getTimeout(){
        if(json.env=='test')
            return 500;
        else
            return 5000;
    }
}

const scraperObject = {
    async getContent(page, word, selector){
        let result = await lingueeauto.queryAuto(page, word, selector);
        if(result==fail){
            console.log(color.red('fail'));
            return '';
        }
        let html = await page.content();
        let content = util.getDom(html,selector);
        return content;
    },
    delay : async (ms) => new Promise(res => setTimeout(res, ms)),
    async scrape(browser){
        let words = files.loadInputFile();
        let page = await browser.newPage();
        files.initializeLog();
        files.initializeFile();
        let selector = '.autocompletion';
        for(let word of words){
            await this.delay(3000);
            console.log(word);
            let content = await this.getContent(page,word,selector);
            if(content==''){
                files.appendLog(word,fail,'nao encontrou');
                files.appendNewLineFile();
                continue;
            }
            
            let main = content.querySelector('.main_item');
            if(main==null){
                files.appendLog(word,fail,'sem main item');
                files.appendNewLineFile();
                continue;
            }
            if(main.textContent!=word){
                util.sleepFor(this.getSleep(3000));
                content = await this.getContent(page,word,selector);
                if(content==''){
                    files.appendLog(word,fail,'nao encontrou - 2a');
                    files.appendNewLineFile();
                    continue;
                }
                main = content.querySelector('.main_item');
                if(main==null){
                    files.appendLog(word,fail,'sem main item');
                    files.appendNewLineFile();
                    continue;
                }
                if(main.textContent!=word){
                    files.appendLog(word,fail,'palavra diferente');
                    files.appendNewLineFile();
                    continue;
                }
            }
            let lemmas = content.querySelectorAll('.autocompletion_item.isForeignTerm');
            files.appendFile(word+'\t');
            console.log('lemmas:'+lemmas.length);
            for(let l = 0; l < lemmas.length; l++){
                let rows = lemmas[l].querySelectorAll('.translation_row');
                console.log('rows:'+rows.length);
                for(let r = 0; r < rows.length; r++){
                    let text = util.replaceAll(rows[r].textContent,'\n',',');
                    text = util.replaceAll(text,' m ','');
                    text = util.replaceAll(text,' f ','');
                    text = util.replaceAll(text,' f​·','');
                    text = util.replaceAll(text,' m​·','');
                    text = util.replaceAll(text,' v​·','');
                    text = util.replaceAll(text,' adj​·','');
                    text = util.replaceAll(text,' adv​·','');
                    text = util.replaceAll(text,' v ','');
                    text = util.replaceAll(text,' adj ','');
                    text = util.replaceAll(text,' adv ','');
                    text = util.replaceAll(text,'     ','');
                    text = util.replaceAll(text,'    ','');
                    text = util.replaceAll(text,'   ','');
                    text = util.replaceAll(text,'  ','');
                    text = util.replaceAll(text,'​·',' ');
                    text = util.replaceAll(text,'​ f​,',' ,');
                    text = util.replaceAll(text,' m​,',' ,');
                    text = util.replaceAll(text,' pl​ f ',' ');
                    text = util.replaceAll(text,' pl m​ ',' ');
                    text = util.replaceAll(text,' pl ',' ');
                    text = util.replaceAll(text,' m/f ',' ');
                    text = text.trim();
                    console.log(text);
                    files.appendFile(text+",");
                }
            }
            files.appendNewLineFile();
        }
    },
    getSleep(seconds){
        if(json.env=='test')
            return 100;
        else {
            if(seconds!=null && seconds!=undefined){
                return seconds;
            }
            return 1000;
        }
    }
}

module.exports = scraperObject;