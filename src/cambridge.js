var json = require('../config.json');
var array = require('lodash/array');
const scraperObject = {
    async scrape(browser, words){
        let page = await browser.newPage();
        let allTranslations = ''
        for(let i = 0; i < words.length; i++) {
            let englishWord = words[i]
            console.log(englishWord)
            let url = `https://dictionary.cambridge.org/dictionary/english-portuguese/${englishWord}`;
            await page.goto(url);
            await page.waitForSelector('.entry-body.dentry-body');
            let twords = {};
            try {
                twords = await page.$eval('.entry-body.dentry-body', async (content) => {
                    let entryBodies = content.querySelectorAll('.pr.entry-body__el');
                    let pronunciations = [];
                    let translations = [];
                    let audios = [];
                    for(let e = 0; e < entryBodies.length; e++){
                        let meanings = entryBodies[e].querySelectorAll('.sense-block.pr.dsense.dsense-noh');
                        for(let t = 0; t < meanings.length; t++){
                            meaning = meanings[t].querySelector('.trans.dtrans.dtrans-se');
                            translations.push(meaning.innerText.trim());
                        }
                        let divPronUS = entryBodies[e].querySelectorAll('.pron-info.dpron-info')[1];
                        let mp3 = divPronUS.querySelector('audio source[type="audio/mpeg"]').src;
                        audios.push(mp3);
                        divsIPA = divPronUS.querySelectorAll('.pron.dpron');
                        for(let p = 0; p < divsIPA.length; p++) {
                            pronunciations.push(divsIPA[p].innerHTML.trim());
                        }
                    }
                    return {translations,pronunciations,audios};
                });
                let lists = this.removeDuplications(twords);
                allTranslations += lists.uniqTranslations+'\t'+lists.uniqPronunciations+'\t\n';
            } catch (err) {
                allTranslations += ', \t\n';
                console.log(err)
            }
        }
        return allTranslations;
    },
    removeDuplications(twords){
        let uniqPronunciations = array.uniq(twords.pronunciations);
        let uniqTranslations = array.uniq(twords.translations);
        let uniqAudios = array.uniq(twords.audios);
        uniqTranslations = this.removeDuplicatedTranslatedTerms(uniqTranslations);
        console.log(uniqPronunciations);
        console.log(uniqTranslations);
        console.log(uniqAudios);
        return {uniqPronunciations, uniqTranslations, uniqAudios};
    },
    removeDuplicatedTranslatedTerms(uniqTranslations){
        uniqTranslations = this.transformCommaSeparatedTermsInItems(uniqTranslations);
        uniqTranslations = uniqTranslations.map(t => t.trim());
        return array.uniq(uniqTranslations);
    },
    transformCommaSeparatedTermsInItems(uniqTranslations){
        translations = uniqTranslations.toString();
        return translations.split(',');
    }
}

module.exports = scraperObject;