"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const json = require('../../config.json');
const colors = require('colors/safe');
var dateFormat = require('dateformat');

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
        let queryResult = await lingueeauto.queryAuto(page, word, selector);
        if(queryResult.result==fail){
            console.log(colors.red('fail'));
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
        let count = 0;
        let startLine = parseInt(json.startLine);
        if(startLine==0){
            if(files.exists()) {
                files.appendLog('',fail,'arquivo existente!');
                return;
            }
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));
        let selector = '.autocompletion';
        for(let word of words){
            console.log(word);
            count++;
            if (count < startLine) {
                continue;
            }
            await this.delay(3000);
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