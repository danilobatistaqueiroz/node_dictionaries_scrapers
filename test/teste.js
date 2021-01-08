function removeLastCharIfCondition(text, charCondition){
    if(text!=undefined && text!=null && text!=''){
        text = text.trim();
        let lastChar = text.charAt(text.length-1);
        if(lastChar==charCondition){
            return text.slice(0,-1);
        }
    }
    return text;
}

let x = 'abcdedifialsdkfsdfslk,';

console.log(removeLastCharIfCondition(x,','));