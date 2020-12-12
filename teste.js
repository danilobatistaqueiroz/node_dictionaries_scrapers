links = `<a href="/translation/portuguese-english/transportar" class="translation ltr dict v" data-pos="[vv]" data-inflected="transporte}--{transportá-lo" data-pos-index="0" data-posgroup="1" data-freq="127" title="<div class='nobold'>See examples translated by <em class='translation'>transportar</em><br>Verb<br>(127 examples with alignment)</div>" lang="pt" id="ui-id-77">
<div class="pos-mark">
    <span class="v" title="Verb"></span>
        </div>
transportar</a>
`
    i = links.indexOf('data-pos=')
    j = links.indexOf(']')
    console.log(links.substring(i+10,j+1))
    