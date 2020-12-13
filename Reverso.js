const scraperObject = {
    getFields(html, field){
        ini = html.indexOf(field)
        fieldLength = field.length+1
        data = ''
        if(ini>0){
            end = html.indexOf(']')
            data = html.substring(ini+fieldLength,end+1)
        }
        return data;
    },
    async scraper(browser, language, words){
        let page = await browser.newPage();
        await page.exposeFunction('getField', (html, field) => {
            ini = html.indexOf(field)
            fieldLength = field.length+1
            data = ''
            if(ini>0){
                end = html.indexOf(']')
                data = html.substring(ini+fieldLength,end+1)
            }
            return data;
        });
        allTranslations = ''
        for(i = 0; i < words.length; i++) {
            englishWord = words[i]
            console.log(englishWord)
            url = 'https://context.reverso.net/translation/'+language+'/'+englishWord;
            await page.goto(url);
            await page.waitForSelector('.results');
            let twords
            try {
                twords = await page.$eval('.left-content #top-results #translations-content', content => {
                    let datapos = 'data-pos='
                    let datafreq = 'data-freq='
                    links = content.querySelectorAll('.translation')
                    translations = []
                    for (let i = 0; i < links.length; i++) {
                        if(links[i]==undefined)
                            continue
                        termType = getField(links[i].outerHTML, datapos);
                        freq = getField(links[i].outerHTML, datafreq)
                        translations.push({type:termType,freq:freq,value:links[i].textContent.trim()})
                    }
                    return translations
                })
                await twords.forEach(async w => {
                    allTranslations += (w.value+',');
                });
                allTranslations += '\n'
            } catch (err) {
                console.log(err)
            }
        }
    }
}

module.exports = scraperObject;