export function formatId(index) {
    const idNumber = (index + 1).toString().padStart(4, '0');
    return `LC${idNumber}`;
}