export async function addJobDetail(jobDetail, masterService) {
    const reqBody = {
        companyCode: localStorage.getItem('companyCode'),
        collectionName: "job_detail",
        data: jobDetail
    }
    const res = await masterService.masterMongoPost("generic/create", reqBody).toPromise();
    return res
}
// This function gets the next number, formats it, and updates localStorage.
export function getNextNumber() {
    // Get current number from localStorage
    let currentNum = parseInt(localStorage.getItem('sequenceNumber'));



    // If the number doesn't exist in localStorage, initialize to 1
    if (!currentNum) {
        currentNum = 1;
    } else {
        currentNum = currentNum + 1;
    }



    // Format the number with leading zeros
    const formattedNumber = currentNum.toString().padStart(4, '0');



    // Store the new number in localStorage
    localStorage.setItem('sequenceNumber', currentNum.toString());



    return formattedNumber;
}