const scraperObject = {
    async scraper(browser, language, englishWord){
        url = 'https://context.reverso.net/translation/'+language+'/'+englishWord;
        let page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('.results');
        let twords = await page.$eval('.left-content #top-results #translations-content', words => {
            links = words.querySelectorAll('.translation')
            translations = []
            for (let i = 0; i < links.length; i++) {
                if(links[i]==undefined)
                    continue
                ini = links[i].outerHTML.indexOf('data-pos=')
                data = ''
                if(ini>0){
                    end = links[i].outerHTML.indexOf(']')
                    data = links[i].outerHTML.substring(ini+10,end+1)
                }
                if(translations.find(t => t.type==data)==undefined)
                    translations.push({type:data,value:links[i].textContent.trim()})
            }
            return translations
        })
        return twords
    }
}

module.exports = scraperObject;