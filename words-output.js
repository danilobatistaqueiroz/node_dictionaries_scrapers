const fs = require('fs');
module.exports = (language, words) => {
    try {
        fs.writeFileSync('5001-6000-reverso-'+language+'.csv', words, (err) => console.log(err));
    } catch (err) {
        console.error(err);
    }
}