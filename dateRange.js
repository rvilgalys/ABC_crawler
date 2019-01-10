

function dateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const array = new Array();
    let day = startDate;

    while (day <= endDate){
        array.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    return array;
}

module.exports = dateRange;