const jsdom = require("jsdom");
const util = {
    getDom(html,selector){
        const dom = new jsdom.JSDOM(html);
        let doc = dom.window.document;
        let content = doc.querySelector(selector);
        return content;
    },
    isCapitalized(word) {
        return word.charAt(0).toUpperCase() === word.charAt(0);
    },
    removeLastComma(str){
        if(str==undefined || str==null)
            return str;
        if(str.trim().slice(-1)==',') 
            return str.trim().slice(0,-1);
        else
            return str;
    },
    removeLastDot(str){
        if(str==undefined || str==null)
            return str;
        if(str.trim().slice(-1)=='.') 
            return str.trim().slice(0,-1);
        else
            return str;
    },
    result : {
        success: 'success', fail: 'fail'
    },
    async delay(ms) {new Promise(res => setTimeout(res, ms))},
    sleepFor( sleepDuration ){
        var now = new Date().getTime();
        while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
    },
    replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    },
}

module.exports = util;