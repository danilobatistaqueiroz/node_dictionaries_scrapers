var json = require('../config.json');
const scraperObject = {
    async scrape(browser, words){
        let page = await browser.newPage();
        await page.exposeFunction('getTranslationField', async (html, field) => {
            let ini = html.indexOf(field)
            let fieldLength = field.length+1
            let data = ''
            if(ini>0){
                let end = html.indexOf('" ',ini+fieldLength)
                data = html.substring(ini+fieldLength,end)
            }
            return data;
        });
        let allTranslations = ''
        for(i = 0; i < words.length; i++) {
            let englishWord = words[i]
            console.log(englishWord)
            let url = `https://context.reverso.net/translation/english-${json.language}/${englishWord}`;
            await page.goto(url);
            await page.waitForSelector('.results');
            let twords
            try {
                twords = await page.$eval('.left-content #top-results #translations-content', async content => {
                    let translations = []
                    let datapos = 'data-pos='
                    let datafreq = 'data-freq='
                    let links = content.querySelectorAll('.translation')
                    for (let i = 0; i < links.length; i++) {
                        if(links[i]==undefined)
                            continue
                        let termType = await window.getTranslationField(links[i].outerHTML, datapos);
                        let freq = await window.getTranslationField(links[i].outerHTML, datafreq);
                        translations.push({type:termType,freq:parseInt(freq),value:links[i].textContent.trim()})
                    }
                    return translations
                })
                await twords.sort(function (a, b) {
                    return b.freq - a.freq;
                });
                await twords.forEach(async w => {
                    allTranslations += (`(${w.freq})${w.value},`);
                });
                allTranslations += '\t\n'
            } catch (err) {
                allTranslations += ', \t\n'
                console.log(err)
            }
        }
        return allTranslations;
    }
}

module.exports = scraperObject;