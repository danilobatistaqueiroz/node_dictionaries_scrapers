//https://translate.google.com.br/?sl=en&tl=pt&text=expensive&op=translate


//document.querySelectorAll('.VIiyi')[1].innerText

//document.querySelectorAll('.kgnlhe')[2].innerText

//document.querySelectorAll('.YF3enc')[1].childNodes[2].classList

//document.querySelectorAll('.YF3enc')[3].childNodes[0].classList[1]

//childNodes sempre serao 3

//classList sempre serao 2

//frequency class full
//.ksE5nf.EiZ8Dd

//frequency low
//.ksE5nf.fXx9Lc

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

const google = {
    async waitTillHTMLRendered(page, timeout = 30000) {
        const checkDurationMsecs = 1000;
        const maxChecks = timeout / checkDurationMsecs;
        let lastHTMLSize = 0;
        let checkCounts = 1;
        let countStableSizeIterations = 0;
        const minStableSizeIterations = 3;
      
        while(checkCounts++ <= maxChecks){
          let html = await page.content();
          let currentHTMLSize = html.length; 
      
          let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
      
          console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
      
          if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
            countStableSizeIterations++;
          else 
            countStableSizeIterations = 0; //reset the counter
      
          if(countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
          }
      
          lastHTMLSize = currentHTMLSize;
          await page.waitFor(checkDurationMsecs);
        }  
      },
    async queryAuto(page, word, selector){
        if(util.isCapitalized(word)){
            return {"result":fail,"reason":'capitalized'};
        }
        let url = '';
        if(json.env=='test'){
            url = `file:///home/element/tutorials/puppeteer/html/google/${word}.html`;
        } else {
            url = `https://translate.google.com.br/?sl=en&tl=pt&text=${word}&op=translate`;
        }
        /*
        await page.goto(url, { waitUntil: 'load' });
        (async () => {
            await this.sleep(1500);
        })();
        await this.waitTillHTMLRendered(page);
        */
       await this.loadUrl(page,url);
        let html = await page.content();
        let content = util.getDom(html,selector);
        console.log(content.innerHTML);
        return {"result":success,"reason":'ok'};
    },
    loadUrl: async function (page, url) {
        try {
            await page.goto(url, {
                timeout: 20000,
                waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
            })
        } catch (error) {
            throw new Error("url " + url + " url not loaded -> " + error)
        }
    },
    sleep(millisecondsCount) {
        if (!millisecondsCount) {
            return;
        }
        return new Promise(resolve => setTimeout(resolve, millisecondsCount)).catch();
    },
    getTimeout(){
        if(json.env=='test')
            return 500;
        else
            return 10000;
    },
}

const scraperObject = {
    async getContent(page, word, selector){
        let result = await google.queryAuto(page, word, selector);
        if(result.result==fail){
            console.log(colors.red('fail:'+result.reason));
            return '';
        }
        util.sleepFor(this.getSleep());
        let html = await page.content();
        let content = util.getDom(html,selector);
        return content;
    },
    async scrape(browser){
        let words = files.loadInputFile();
        let page = await browser.newPage();
        await page.setDefaultTimeout(google.getTimeout());
        await page.setDefaultNavigationTimeout(google.getTimeout());
        let selector = '.VIiyi';
        let count = 0;
        let startword = 0
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
            console.log(word);
            let content = await this.getContent(page,word,selector);
            if(content == null || content==''){
                console.log(colors.red('nao encontrou'));
                files.appendLog(word,fail,'nao encontrou');
                files.appendFile(word+'\t');
                files.appendNewLineFile();
                continue;
            }
            files.appendFile(word+'\t');
            // let maintranslations = content.querySelectorAll('.VIiyi');
            // for(let m = 0; m < maintranslations.length; m++){
            //     files.appendFile(maintranslations[m].textContent+',');
            // }
            let sectranslations = content.querySelectorAll('.kgnlhe');
            let translations = [];
            for(let s = 0; s < sectranslations.length; s++){
                let frequency = sectranslations[s].querySelectorAll('.YF3enc');
                let blocks = 0;
                for(let f = 0; f < frequency; f++){
                    let block1 = frequency[f].childNodes[0].classList;
                    let block2 = frequency[f].childNodes[1].classList;
                    let block3 = frequency[f].childNodes[2].classList;
                    if(block1[1]=='EiZ8Dd') blocks++;
                    if(block2[1]=='EiZ8Dd') blocks++;
                    if(block3[1]=='EiZ8Dd') blocks++;
                }
                translations.push('('+blocks+')'+sectranslations[s].textContent);
            }
            files.appendFile(translations.join(',')+'\n');
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
            return 2000;
        }
    }
}

module.exports = scraperObject;