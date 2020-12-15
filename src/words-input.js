const fs = require('fs');
var json = require('../config.json');
module.exports = () => {
    try {
        const data = fs.readFileSync(`input/${json.fileName}.${json.fileExt}`, 'UTF-8');
        const lines = data.split(/\r?\n/);
        return lines.map((line) => {
            t = line.indexOf('\t')
            return line.substring(0,t)
        });
    } catch (err) {
        console.error(err);
    }
}