export default {
    getPeriod(year, month) {
        var endYear = year
        var endMonth = month
        if (month == 11) {
            endMonth = -1
            endYear = year + 1
        }
        const dateInit = new Date(year, month, 1, 0, 0, 0);
        const dateEnd = new Date(endYear, endMonth + 1, 1, 0, 0, 0);
        return { dateEnd, dateInit }
    }
}