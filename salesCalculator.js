const fileDB = require('./fileHelper');
const dateRange = require('./dateRange');


async function getSalesAll (start, end) {

    const startDate = new Date(start);
    const endDate = new Date(end);

    const dates = dateRange(startDate, endDate);

    let lastDate = startDate;
    let lastData = await fileDB.readDate(startDate);

    let salesData = lastData.map(row => ({ncid: row.ncid, sales : 0}) )
    

    for(let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        console.log(date);
        const todayData = await fileDB.readDate(date);
        for (row of salesData){
            const lastRow = lastData.find(r => r.ncid === row.ncid);
            const todayRow = todayData.find(r => r.ncid === row.ncid);
            if (!lastRow || !todayRow)
                continue;
            const balanceDiff = lastRow.balance - todayRow.balance;
            if (balanceDiff > 0){
                row.sales += balanceDiff;
            }
        };
        lastData = todayData;
    }

    return salesData;
}

(async () => {
    const data = await getSalesAll('10/1/2018', '10/25/2018');
    console.log(data.find(row => row.ncid === '66256'));
})();

