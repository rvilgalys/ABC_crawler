const fetchABC = require('./fetchABCData');
const fs = require('fs-extra');
const dateRange = require('./dateRange');
const path = './data/';

// return mm/dd/yyyy -> YYYY-MM-DD
function dateToFilename(date){
    const day = new Date (date)
    return `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`;
}

async function writeDate(date) {
    const data = await fetchABC(date);

    try {
        const filename = path + dateToFilename(date) + '.json';
        await fs.writeJson(filename, data);
        console.log ('created new file at ' + filename);
    } catch(err) {
        console.log(err);
    }

}

async function readDate(date) {

    try {
        const filename = path + dateToFilename(date) + '.json';
        const data = fs.readJson(filename);
        console.log ('read from file at ' + filename);
        return data;
    } catch(err) {
        console.log(err);
        return err;
    }
}

async function saveLocalDates(start, end){
    const dates = dateRange(start, end);

    for(const date of dates) {
        const filename = path + dateToFilename(date) + '.json';
        if (!(await fs.exists(filename))) {
            await writeDate(date);
        }
        
    };
}

module.exports = {writeDate, readDate};

(async () => {
    saveLocalDates('1/1/2016', '10/25/2018');

})();