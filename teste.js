const so = {
    getDataPos(link){
        console.log('pos')
    },
    getField(link, fieldName){
        ini = link.indexOf(fieldName)
        fieldLength = fieldName.length+1
        data = ''
        if(ini>0){
            end = link.indexOf(']')
            data = link.substring(ini+fieldLength,end+1)
        }
        return data;
    },
    async scraper(browser, language, words){
        console.log(this.getField(`<a href="/translation/spanish-english/broma" class="translation ltr dict n" data-pos="[n]" data-pos-index="0" data-posgroup="1" data-freq="37" lang="es" title="<div class='nobold'>See examples translated by <em class='translation'>broma</em><br>Noun<br>(37 examples with alignment)</div>" id="ui-id-14">
        <div class="pos-mark">
            <span class="n" title="Noun"></span>
                </div>
        broma</a>`,'data-pos='))
    }
}

so.scraper(1,1,1)