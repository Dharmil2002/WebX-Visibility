export function getPrqNextNumber() {
    // Get the current number from localStorage
    let currentNum = parseInt(localStorage.getItem('sequenceNumber'));

    // If the number doesn't exist in localStorage, initialize it to 1
    if (!currentNum) {
        currentNum = 1;
    } else {
        currentNum = currentNum + 1;
    }

    // Format the number with leading zeros (e.g., 001, 002, ...)
    const formattedNumber = currentNum.toString().padStart(7, '0');

    // Store the new number in localStorage
    localStorage.setItem('sequenceNumber', currentNum.toString());

    // Return the formatted number
    return formattedNumber;
}