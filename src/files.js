const json = require('../config.json');
const fs = require('fs');
const util = require('./util');
const colors = require('colors/safe');

const files = {
    loadInputFile(){
        try {
            const data = fs.readFileSync(`input/${json.fileName}.${json.fileExt}`, 'UTF-8');
            const lines = data.split(/\r?\n/);
            return lines.map((line) => {
                t = line.indexOf('\t');
                if(t<0){
                    t = line.length;
                }
                return line.substring(0,t)
            });
        } catch (err) {
            console.error(err);
        }
    },
    initializeLog(){
        fs.writeFile(`logs/${json.fileName}-${json.site}.log`,'', 'utf8',(err) => {if (err) throw err});
    },
    appendLog(word, result, message){
        if(result==util.result.fail)
            console.log(colors.red(message));
        else
            console.log(message);
        let data = word+'\t'+result+'\t'+message+'\n';
        fs.appendFile(`logs/${json.fileName}-${json.site}.log`,data, 'utf8',(err) => {if (err) throw err});
    },
    exists(){
        return fs.existsSync(`output/${json.fileName}-${json.site}.csv`);
    },
    initializeFile(){
        fs.writeFileSync(`output/${json.fileName}-${json.site}.csv`,'', 'utf8');
    },
    appendNewLineFile(){
        let data='\n';
        fs.appendFileSync(`output/${json.fileName}-${json.site}.csv`,data, 'utf8');
    },
    appendFile(translations){
        let data = translations;
        fs.appendFileSync(`output/${json.fileName}-${json.site}.csv`,data, 'utf8');
    }
}

module.exports = files;