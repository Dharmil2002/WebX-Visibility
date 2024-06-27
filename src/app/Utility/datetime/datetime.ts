// Example usage:
export function getTimeInWord(timeDiff) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${days}d ${hours}h ${minutes}m`;
}
export function getFinancialYear(date: string | Date): string {
    const givenDate = new Date(date);
    const year = givenDate.getFullYear();
    const month = givenDate.getMonth();
    const day = givenDate.getDate();

    let startYear, endYear;

    if (month < 3 || (month === 3 && day < 1)) {
        startYear = year - 1;
        endYear = year;
    } else {
        startYear = year;
        endYear = year + 1;
    }

    const startYearShort = startYear.toString().slice(-2);
    const endYearShort = endYear.toString().slice(-2);
    const financialYear = startYearShort + endYearShort;

    return financialYear;
}