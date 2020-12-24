"use strict"
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const json = require('../../config.json');
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');
var dateFormat = require('dateformat');

const fail = util.result.fail;
const success = util.result.success;

const howjsay = {
    async queryAuto(page, word, selector){
        if(util.isCapitalized(word)){
            return {"result":fail,"reason":'capitalized'};
        }
        let url = '';
        if(json.env=='test'){
            url = `file:///home/element/tutorials/puppeteer/html/howjsay/${word}.html`;
        } else {
            url = `https://howjsay.com/how-to-pronounce-${word}`;
        }
        const response = await page.goto(url);
        const chain = response.request().redirectChain();
        if(chain.length==1){
            return {"result":fail,"reason":'redirect'};
        }
        try{
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
            return 10000;
    },
    getFileName (str) {
        return str.substring(str.lastIndexOf('/')+1).replace(' ','');
    },
    downloadMp3(audio){
        const https = require('https');
        let fileName = this.getFileName(audio);
        const file = fs.createWriteStream(`output/mp3/howjsay-${fileName}`);
        const request = https.get(audio, function(response) {
            response.pipe(file);
        });
    },
    setMp3Field(audio){
        let mp3 = this.getFileName(audio);
        return `[sound:howjsay-${mp3}]`;
    },
}

const scraperObject = {
    async getContent(page, word, selector){
        let result = await howjsay.queryAuto(page, word, selector);
        if(result.result==fail){
            console.log(colors.red('fail:'+result.reason));
            return '';
        }
        let html = await page.content();
        let content = util.getDom(html,selector);
        return content;
    },
    async scrape(browser){
        let words = files.loadInputFile();
        let page = await browser.newPage();
        await page.setDefaultTimeout(howjsay.getTimeout());
        await page.setDefaultNavigationTimeout(howjsay.getTimeout());
        let selector = '.alphContain.list-grid';
        let count = 0;
        let startword = 648
        if(startword==0){
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));
        for(let word of words){
            count++;
            if(count < startword) {
                continue;
            }
            util.sleepFor(this.getSleep());
            console.log(word);
            let content = await this.getContent(page,word,selector);
            if(content == null || content==''){
                console.log(colors.red('nao encontrou'));
                files.appendLog(word,fail,'nao encontrou');
                files.appendFile(word+'\t');
                files.appendNewLineFile();
                continue;
            }
            let zero = content.querySelector('.zeroResult');
            if(zero!=null){
                console.log(colors.red('zero resultados'));
                files.appendLog(word,fail,'zero resultados');
                files.appendFile(word+'\t');
                files.appendNewLineFile();
                continue;
            }
            let namemp3 = content.querySelector('#loadEcho1').textContent.trim();
            console.log('mp3:'+namemp3);
            if(word!=namemp3){
                console.log(colors.red('mp3 diferente da palavra'));
                files.appendLog(word,fail,'mp3 diferente da palavra');
                files.appendFile(word+'\t');
                files.appendNewLineFile();
                continue;
            }
            let filemp3 = content.querySelector('source').src
            howjsay.downloadMp3(filemp3);
            let fieldsound = howjsay.setMp3Field(filemp3);
            files.appendFile(word+'\t'+fieldsound);
            files.appendNewLineFile();
        }
        let end = new Date()
        files.appendLog('','',dateFormat(end, "h:MM:ss l"));
        files.appendLog('','','total de palavras:'+count);
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