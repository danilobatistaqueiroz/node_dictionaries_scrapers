"use strict"
const json = require('../../config.json');
var array = require('lodash/array');
var files = require('../files');
var util = require('../util');
const colors = require('colors/safe');
var dateFormat = require('dateformat');

const happerCollins = {
    select(translations,content,word){
        let happer = content.querySelector('section[data-src="hc_mlt"]');
        if(happer!=null){
            this.queryHapper(translations,happer,word);
        }
    },
    queryHapper(translations,happer,word){
        let listH2 = happer.querySelectorAll('h2');
        for(let h = 0; h < listH2.length; h++){
            let h2 = listH2[h];
            if(h2.innerText==word){
                let translation = h2.querySelector('span[class="trans"][lang="pt"]').innerText;
                translations.push({"definition":'',"translated":translation});
            }
        }
    }
}

const kernermanDict = {
    kdict:'',
    word:'',
    select(translations,content,word){
        let kdict = content.querySelector('section[data-src="kdict"]');
        if(kdict!=null){
            this.queryKdict(translations,kdict,word);
        }
    },
    queryKdict(translations,kdict,word){
        this.kdict = kdict;
        this.word = word;
        for(let k = 0; k < this.kdict.childNodes.length; k++) {
            let child = this.kdict.childNodes[k];
            if(child.tagName == 'H2') {
                if(this.isTitleSameWord(child)==false){
                    k = this.searchForFlexions(k);
                    if(k==-1){
                        k = this.advanceToNextTitleSameWord(k);
                        if(k==-1){
                            break;
                        }
                    }
                }
            } else if(child.tagName == 'B') {
                let term = child.innerHTML.trim().replace('ˈ','');
                if(term!=this.word) {
                    k = this.advanceToNextTitleSameWord(k);
                    if(k==-1){
                        break;
                    }
                }
            } else if(child.tagName == 'DIV') {
                for(let a = 0; a < child.attributes.length; a++){
                    if(child.attributes[a].name=='class'){
                        if(child.attributes[a].value=='ds-single'){
                            this.queryDsSingle(translations,child);
                        } else if(child.attributes[a].value=='ds-list'){
                            this.queryDsList(translations,child);
                        }
                    }
                }
            }
        }
    },
    isTitleSameWord(child){
        let title = child.innerHTML.trim();
        if(title!=this.word) {
            title = util.replaceAll(title,'•','');
            title = util.replaceAll(title,'ˈ','');
            if(title!=this.word){
                if(child.textContent!=null && child.textContent!=undefined){
                    let title2 = child.textContent.slice(-1);
                    if(title2==this.word){
                        return true;
                    }
                }
                return false;
            }
        }
        return true;
    },
    isSpanPronunciation(child,name){
        if(name == 'SPAN'){
            let clas = child.className.toLowerCase();
            return clas == 'pron';
        }
        return false;
    },
    searchForFlexions(k){
        for(; k < this.kdict.childNodes.length; k++){
            let child = this.kdict.childNodes[k];
            let name = child.nodeName.toUpperCase();
            let spanPron = this.isSpanPronunciation(child,name);
            if(name == '#TEXT' || spanPron || name == 'I') {
                if(child.textContent.indexOf(this.word)>0){
                    return k;
                }
            }
        }
        return -1;
    },
    advanceToNextTitleSameWord(k){
        for(; k < this.kdict.childNodes.length; k++){
            let child = this.kdict.childNodes[k];
            if(child!=undefined){
                let name = child.nodeName.toUpperCase();
                if(name == 'H2' || name == 'B') {
                    if(this.isTitleSameWord(child)==true){
                        return k;
                    }
                }
            }
        }
        return -1;
    },
    queryDsList(translations,child){
        let contents = {};
        if(child.childNodes[0].tagName=='B'){
            let b = child.childNodes[0].innerHTML.trim().replace('.','');
            if(parseInt(b)===NaN){
                return;
            }
            contents = this.queryDsContent(child);
        }
        translations.push({"definition":contents.definition,"translated":contents.translated});
    },
    queryDsSingle(translations,child){
        let contents = this.queryDsContent(child);
        if(contents.translated==null) {
            return;
        }
        translations.push({"definition":contents.definition,"translated":contents.translated});
    },
    queryDsContent(child){
        let definition = '';
        for(let s = 0; s < child.childNodes.length; s++){
            let tag = child.childNodes[s].tagName;
            let name = child.childNodes[s].nodeName;
            if(name=='#text' || tag=='I'){
                definition += child.childNodes[s].textContent;
            } else if (tag=='SPAN'){
                break;
            }
        }
        definition = util.removeLastDot(definition);
        let transTerm = child.querySelector('span[class="trans"][lang="pt"]');
        let translated = '';
        if(transTerm!=null)
            translated = transTerm.textContent.trim();
        return {'definition':definition,'translated':translated};
    },
    findBsameWord(){
        this.kdict.querySelector();
        return position;
    },
}

const rHouse = {
    select(html,word){
        let house = util.getDom(html, 'section[data-src="rHouse"]');
        if(house!=null){
            return this.getPronun(house);
        }
        return '';
    },
    getPronun(house){
        let pron = house.querySelector('span[class="pron"]');
        if(pron!=null)
            return pron.textContent.trim();
        else
            return '';
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
                files.appendLog('',fail,'arquivo existente!');
                return;
            }
            files.initializeLog();
            files.initializeFile();
        }
        let ini = new Date()
        files.appendLog('','',dateFormat(ini, "h:MM:ss l"));

        for(let word of words) {
            console.log(word);
            if(util.isCapitalized(word)){
                files.appendFile('\n');
                continue;
            }
            let result = await this.queryDictionary(page, word);
            if(result==util.result.fail){
                console.log(colors.red('fail'));
                files.appendLog(word, util.result.fail);
                files.appendNewLineFile();
                continue;
            }
            let html = await page.content();
            let line = await this.queryTranslations(html, word);
            let pronunciation = rHouse.select(html,word);
            files.appendFile(line+pronunciation+'\t\n');
        }
    },
    async queryDictionary(page, word){
        let url = '';
        if(json.env=='test')
            url = `file:///home/element/tutorials/puppeteer/html/freedic/${word}.html`;
        else
            url = `https://www.thefreedictionary.com/${word}`;
        const response = await page.goto(url);
        try{
            await page.setDefaultTimeout(this.getTimeout());
            await page.setDefaultNavigationTimeout(this.getTimeout());
            await page.waitForSelector('#Translations');
            return util.result.success;
        } catch (err) {
            console.log(colors.red(err));
            return util.result.fail;
        }
    },
    async queryTranslations(html, word){
        let line = '';
        try {

            let content = util.getDom(html, '#Translations #translbody');

            let translations = [];
            this.querySimpleTrans(translations,content);

            kernermanDict.select(translations,content,word);
            happerCollins.select(translations,content,word);

            line = this.buildTranslationsLine(translations);
            
            return line;
        } catch (err) {
            console.log(err);
            return line;
        }
    },
    buildTranslationsLine(translations){
        let unified = this.reorganizingTranslations(translations);
        let alldefin = unified.definitions.join(',')+'\t';
        let alltrans = unified.translated.join(',')+'\t';
        return alldefin+alltrans;
    },
    reorganizingTranslations(translations){
        let definitions = [];
        let translated = [];
        translations.forEach(w => {
            definitions.push(w.definition);
            translated.push(w.translated);
            console.log(`${w.definition}:${w.translated}`);
        });
        definitions = array.uniq(definitions);
        definitions = this.removeEmptyItems(definitions);
        translated = array.uniq(translated);
        translated = this.removeEmptyItems(translated);
        return {definitions, translated};
    },
    querySimpleTrans(translations,content){
        let simple = content.querySelector('section[class="simpleTrans"] div[lang="pt"]');
        if(simple!=null){
            for(let c = 0; c < simple.childNodes.length; c++){
                translations.push({"definition":'',"translated":simple.childNodes[c].textContent});
            }
        }
    },
    removeEmptyItems(list){
        for(let i = 0; i < list.length; i++){
            let item = list[i];
            if(item==undefined || item==null || item==''){
                list.splice(i, 1);
            }
        }
        return list;
    },
    getTimeout(){
        if(json.env=='test')
            return 6000;
        else
            return 6000;
    }
}

module.exports = scraperObject;