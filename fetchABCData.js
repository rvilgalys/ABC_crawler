const rp = require('request-promise');
const neatCsv = require('neat-csv');

// takes a JavaScript Date and fetches a new CSV from the ABC Server 

async function csvForDate(date) {

    const day = new Date(date);
    console.log(day);

    const cookie = rp.cookie(`ReportDate=${day.getMonth()+1}/${day.getDate()}/${day.getFullYear()}`);
    console.log(cookie);
    const jar = rp.jar();
    const url = 'https://abc.nc.gov/Boards/ExportData';


    jar.setCookie(cookie, url);

    return await rp.post({ url: url, jar: jar })
        .then(function (body) {
            return body;
        })
        .catch(function (err) {
            console.log(err);
        });

}

// returns cleaned json data from the ABC csv fetched for that date 

async function fetchABCData(date) {



    const csvData = await csvForDate(date);
    const jsData = await neatCsv(csvData);

    const cleanData = jsData.map((row) => {
        return ({
            ncid: row['NC Code'].match(/\d+/)[0],
            supplier: row['Supplier'],
            brand: row['Brand Name'],
            balance: row['Balance'],
            comments: row['Comments'],
            alloc: row['Allocation'],
            size: row['Size'],
            palletSize: row['Cases Per Pallet']
        })
    });
    return cleanData;
}

module.exports = fetchABCData;

