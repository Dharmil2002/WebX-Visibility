export const VendorTableData = [
    {
        vendor: 'V0034: A J Logistics', billType: "Transaction Bill", billNo: "BEMUMB232400131", Date: '10/30/2023',
        billAmount: 65450, pendingAmount: 65450, Status: "Generated"
    },
    {
        vendor: 'V000005:ABC TRANSPORT COMPANY', billType: "PO Bill", billNo: "BEMUMB232400132", Date: '10/28/2023',
        billAmount: 87650, pendingAmount: 87650, Status: "Approved"
    },
    {
        vendor: 'V00001:AADARSH ROADWAYS', billType: "Transaction Bill", billNo: "BEMUMB232400133", Date: '10/26/2023',
        billAmount: 65450, pendingAmount: 65450, Status: "Partial Paid"
    },
]
export const billType = [
    { value: "1", name: 'Transaction Bill' },
    { value: "2", name: 'PO Bill' },
]
export const status = [
    { value: "1", name: 'Generated' },
    { value: "2", name: 'Approved' },
    { value: "3", name: 'Partial Paid' },
    { value: "4", name: 'On Hold' },
]