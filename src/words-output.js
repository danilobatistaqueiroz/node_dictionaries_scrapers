const fs = require('fs');
var json = require('../config.json');
module.exports = (words) => {
    try {
        fs.writeFileSync(`output/${json.fileName}-${json.site}-${json.language}.${json.fileExt}`, words, (err) => {
            console.log(err)
        });
    } catch (err) {
        console.error(err);
    }
}