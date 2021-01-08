const colors = require('colors/safe');

let fullTexts = {};
let minTexts = {};

let fullHtml = {};
let minHtml = {};

reverso = '(8050)ace,(2000)free,(500)ox,(100)nothing,(5)great'
google = 'cast,(3)please,(2)free,(2)yes,(1)zero,(1)whats'
linguee = 'no,please,fight,yes,zero'
cambridge = 'no,please,free,yes,zero,ace'
deepl = 'worked problems'
yandex = 'yes'

reversoHTML = '';
googleHTML = '';
lingueeHTML = '';
cambridgeHTML = '';
deeplHTML = '';
yandexHTML = '';

let sites = ['Reverso','Google','Linguee','Cambridge','Deepl','Yandex'];



 
class SetTexts {
    configAllFullSpanText(){
        for(let site of sites) {
            fullTexts[site] = this.getSpanText(site);
        }
    }
    configAllMinSpanText(fullTexts){
        let wordsInManyDic = this._findInManyDic(fullTexts);
        for(let site of sites) {
            let fullText = fullTexts[site];
            const oSite = eval(`new ${site}()`);
            let minTextBold = oSite.bolders(this.getMinText(oSite, fullText));
            let minTextBoldReds = this.colorWordsInRed(oSite,wordsInManyDic,minTextBold)
            minTexts[site] = minTextBoldReds;
        }
    }
    _findInManyDic(fullTexts){
        let inManyDic = new WordsInManyDic(fullTexts);
        return inManyDic.getRedWords();
    }
    colorWordsInRed(oSite,wordsInManyDic,minTextBold){
        if(oSite.hasFrequency())
            return this.colorWordsInRedFrequency(wordsInManyDic,minTextBold);
        else
            return this.colorWordsInRedSimple(wordsInManyDic,minTextBold);
    }
    colorWordsInRedFrequency(wordsInManyDic,minTextBold){
        for(let word of wordsInManyDic){
            let wordRed = `<font color="#00f">${word}</font>`;
            if(this.wordIsBold(minTextBold,word))
                continue;
            minTextBold = minTextBold.replace(`)${word},` , `)${wordRed},`);
            if(wordIsLast(minTextBold, word)){
                minTextBold = minTextBold.replace(`)${word}` , `)${wordRed}`);
            }
        }
        return minTextBold;
    }
    wordIsBold(minTextBold,word){
        let w = minTextBold.indexOf(word);
        let lB = minTextBold.indexOf('<b>');
        let rB = minTextBold.indexOf('</b>');
        return (lB < w && rB > w);
    }
    colorWordsInRedSimple(wordsInManyDic,minTextBold){
        for(let word of wordsInManyDic){
            let wordRed = `<font color="#00f">${word}</font>`;
            minTextBold = minTextBold.replace(`,${word},` , `,${wordRed},`);
            if(wordIsLast(minTextBold, word)){
                minTextBold = minTextBold.replace(`,${word}` , `,${wordRed}`);
            } else if(wordIsFirst(minTextBold, word)){
                minTextBold = minTextBold.replace(`${word},` , `${wordRed},`);
            }
        }
        return minTextBold;
    }



    getSpanText(site){
        if(site=='Reverso') return reverso;
        if(site=='Google') return google;
        if(site=='Linguee') return linguee;
        if(site=='Cambridge') return cambridge;
        if(site=='Deepl') return deepl;
        if(site=='Yandex') return yandex;
    }
    setSpanText(site, text){
        if(site=='Reverso') reverso = text;
        if(site=='Google') google = text;
        if(site=='Linguee') linguee = text;
        if(site=='Cambridge') cambridge = text;
        if(site=='Deepl') deepl = text;
        if(site=='Yandex') yandex = text;
    }
    getSpanHtml(site, html){
        if(site=='Reverso') return reversoHTML;
        if(site=='Google') return googleHTML;
        if(site=='Linguee') return lingueeHTML;
        if(site=='Cambridge') return cambridgeHTML;
        if(site=='Deepl') return deeplHTML;
        if(site=='Yandex') return yandexHTML;
    }
    setSpanHtml(site, html){
        if(site=='Reverso') reversoHTML = html;
        if(site=='Google') googleHTML = html;
        if(site=='Linguee') lingueeHTML = html;
        if(site=='Cambridge') cambridgeHTML = html;
        if(site=='Deepl') deeplHTML = html;
        if(site=='Yandex') yandexHTML = html;
    }


    setAllSpanHtmls(){
        for(let site of sites) {
            this.setSpanHtml(site, minTexts[site]);
        }
    }

    getMinText(oSite, fullText) {
        if(oSite.hasMin()==false){
            return fullText;
        }
        let content = fullText;
        let comma1, comma2, comma3, comma4 = '';
        if (content != '') {
            comma1 = content.indexOf(',');
            if(comma1==-1) {
                comma1 = content.length;
            }
            comma2 = content.indexOf(',',comma1+1);
            if(comma2==-1) {
                comma2 = content.length;
            }
            comma3 = content.indexOf(',',comma2+1);
            if(comma3==-1) {
                comma3 = content.length;
            }
            comma4 = content.indexOf(',',comma3+1);
            if(comma4==-1) {
                comma4 = content.length;
            }
            content =  content.substring(0,comma4);
        }
        return content;
    }
}

class HighFrequency {
    constructor(site, minText) {
        this.minText = minText;
        this.site = site;
    }
    _getFrequencies(content) {
        let lRound=-1;
        let rRound=-1;
        let frequencies = [];
        while(true) {
            lRound = content.indexOf('(',lRound+1);
            rRound = content.indexOf(')',rRound+1);
            if(lRound == -1) {
                return frequencies;
            }
            let freq = content.substring(lRound+1,rRound);
            freq = parseInt(freq);
            frequencies.push(freq);
        }
    }
    _getMainFrequencies() {
        if (this.minText == '')
            return [];
        else
            return this._getFrequencies(this.minText);
    }
    higherFrequencies() {
        let frequencies = this._getMainFrequencies();
        return this.site._higherFrequencies(frequencies);
    }
}

class Reverso extends SetTexts {
    higherFrequencies(){
        let high = new HighFrequency(this);
        return high.higherFrequencies();
    }
    _higherFrequencies(frequencies) {
        let anterior = 0;
        let highers = [];
        for(let freq of frequencies){
            if( (anterior/3) > freq){
                return highers;
            }
            highers.push(freq);
            anterior = freq;
        }
        return highers;
    }
    bolders(rMinText){
        let high = new HighFrequency(this,rMinText);
        let freq = high.higherFrequencies();
        let i = -1;
        freq.forEach((f) => {
            i = rMinText.indexOf('('+f+')',i+1);
        });
        i = rMinText.indexOf(',',i);
        if(i==-1)
            i = rMinText.length;
        let bolds = rMinText.substring(0,i+1);
        let others = rMinText.substring(i+1,rMinText.length);
        return `<b>${bolds}</b>${others}`;
    }
    hasFrequency=()=>true
    hasMin=()=>true
}

class Google extends SetTexts {
    higherFrequencies(gMinText){
        let high = new HighFrequency(this,gMinText);
        return high.higherFrequencies();
    }
    _higherFrequencies(frequencies) {
        let highers = [];
        for(let freq of frequencies){
            if(freq==3)
                highers.push(freq);
        }
        return highers;
    }
    bolders(gMinText){
        let high = new HighFrequency(this,gMinText);
        let freq = high.higherFrequencies();
        let i = -1;
        freq.forEach(() => {
            i = gMinText.indexOf('(3)',i+1);
        });
        i = gMinText.indexOf(',',i);
        let bolds = gMinText.substring(0,i+1);
        let others = gMinText.substring(i+1,gMinText.length);
        return `<b>${bolds}</b>${others}`;
    }
    setSpanHtml(html){
        super.setSpanHtml(this.constructor.name,html);
    }
    setSpanText(txt){
        super.setSpanText(this.constructor.name,txt);
    }
    createMinButton(gFullHtml){
        let site = this.constructor.name;
        let bt = document.createElement('BUTTON');
        let id = 'bt'+site+'Min';
        bt.setAttribute('id',id);
        bt.innerText = '-';
        let div = document.getElementById('dv'+site).innerHTML;
        document.getElementById('dv'+site).innerHTML = div + bt.outerHTML;
        document.getElementById(id).style.display='inline';
        document.getElementById(id).addEventListener('click', (evt) => minimize(gFullHtml));
    }
    hasFrequency=()=>true
    hasMin=()=>true
}

function minimize(html){
    site = new Google();
    site.setSpanHtml(html);
}
function wordIsLast(text,word){
    return (text.substring(text.length-word.length,text.length)==word);
}
function wordIsFirst(text,word){
    return (text.substring(0,word.length)==word);
}

class Linguee extends SetTexts {
    getMinText = ()=>super.getMinText(this,this.getFullText())
    getFullText=()=>fullTexts[this.constructor.name]
    bolders=(linMinText)=>linMinText
    hasMin=()=>true
    hasFrequency=()=>false
}

class Cambridge { 
    bolders = (cMinText)=>cMinText
    hasMin = ()=>false
    hasFrequency=()=>false
}
class Deepl { 
    bolders = (dMinText)=>dMinText
    hasMin = ()=>false
    hasFrequency=()=>false
}
class Yandex { 
    bolders = (yMinText)=>yMinText
    hasMin = ()=>false
    hasFrequency=()=>false
}

class WordsInManyDic {
    constructor(fullTexts){
        this.fullTexts = fullTexts;
        this.sitesForSearch = ['Reverso', 'Google', 'Linguee', 'Cambridge'];
    }
    _convertStringToArray() {
        let wordsSites = {};
        for(let site in this.fullTexts) {
            wordsSites[site] = this.fullTexts[site].split(',');
        }
        return wordsSites;
    }
    getRedWords() {
        let wordsSites = this._convertStringToArray();
        let reds = [];
        for(let site of this.sitesForSearch){
            for(let wordFreq of wordsSites[site]){
                let word = wordFreq.replace(/\(\d*\)/,'');
                reds.push(this._compareWithOthers(wordsSites, site, word));
            }
        }
        reds = reds.filter(this.unique);
        reds = this.removeNulls(reds);
        return reds;
    }

    removeNulls(array){
        return array.filter(function(e){return e});
    }
    unique(value, index, self) {
        return self.indexOf(value) === index;
    }

    _compareWithOthers(wordsSites, site, word) {
        let counter = 0;
        for(let otherSite in wordsSites){
            if(otherSite != site) {
                for(let w of wordsSites[otherSite]){
                    w = w.replace(/\(\d*\)/,'');
                    if(w == word){
                        counter++;
                    }
                }
            }
        }
        if (counter >= 2)
            return word;
        else 
            return null;
    }
}
    

    function showPhrases() {
        document.getElementById('btPhrasesMax').style.display='none';
        document.getElementById('btPhrasesMin').style.display='inline';
        document.getElementById('dvPhrases').style.display='inline';
    }

    function hidePhrases() {
        document.getElementById('btPhrasesMax').style.display='inline';
        document.getElementById('btPhrasesMin').style.display='none';
        document.getElementById('dvPhrases').style.display='none';
    }

    function showBtPhrase() {
        let btPhrasesMax = document.getElementById('btPhrasesMax');
	    let enPhrases = document.getElementById('enPhrases');
	    let ptPhrases = document.getElementById('ptPhrases');
		if (enPhrases.innerText == '' && ptPhrases.innerText == '') {
			btPhrasesMax.style.display='none';
		}
    }

    function createMinButton(site){
        bt = document.createElement('BUTTON');
        id = 'bt'+site+'Min';
        bt.setAttribute('id',id);
        bt.innerText = '-';
        div = document.getElementById('dv'+site).innerHTML;
        document.getElementById('dv'+site).innerHTML = div + bt.outerHTML;
        document.getElementById(id).style.display='inline';
        document.getElementById(id).addEventListener('click', eval('(setMainText("'+site+'"))') );
    }
    
    function createMaxButton(site){
        bt = document.createElement('BUTTON');
        id = 'bt'+site+'Max';
        bt.setAttribute('id',id);
        bt.innerText = '+';
        div = document.getElementById('dv'+site).innerHTML;
        document.getElementById('dv'+site).innerHTML = bt.outerHTML + div;
        //click = `showFullText("${site}")`;
        document.getElementById(id).style.display='inline';
        //document.getElementById(id).addEventListener('click', eval(`(${click})`) );
    }

    function loadScripts () {

        let texts = new SetTexts();
        texts.configAllFullSpanText();
        texts.configAllMinSpanText(fullTexts);

        texts.setAllSpanHtmls();

    }

loadScripts();

console.log(minTexts);