const fs = require('fs');
module.exports = () => {
    try {
        const data = fs.readFileSync('5001-6000-thesaurus2.csv', 'UTF-8');
        const lines = data.split(/\r?\n/);
        return lines.map((line) => {
            t = line.indexOf('\t')
            return line.substring(0,t)
        });
    } catch (err) {
        console.error(err);
    }
}