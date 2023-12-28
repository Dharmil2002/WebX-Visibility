export const VendorTableData = [
    {
        vendor: 'V0034: A J Logistics', billType: "Transaction Bill", billNo: "BEMUMB232400131", Date: '10/30/2023',
        billAmount: 65450, pendingAmount: 65450, Status: "Generated",
        actions: [
            'Approve Bill',
            'Bill Payment',
            'Hold Payment',
            'Unhold Payment',
            'Cancel Bill',
            'Modify'
        ]
    },
    {
        vendor: 'V000005:ABC TRANSPORT COMPANY', billType: "PO Bill", billNo: "BEMUMB232400132", Date: '10/28/2023',
        billAmount: 87650, pendingAmount: 87650, Status: "Approved",
        actions: [
            'Approve Bill',
            'Bill Payment',
            'Hold Payment',
            'Unhold Payment',
            'Cancel Bill',
            'Modify'
        ]
    },
    {
        vendor: 'V00001:AADARSH ROADWAYS', billType: "Transaction Bill", billNo: "BEMUMB232400133", Date: '10/26/2023',
        billAmount: 65450, pendingAmount: 65450, Status: "Partial Paid",
        actions: [
            'Approve Bill',
            'Bill Payment',
            'Hold Payment',
            'Unhold Payment',
            'Cancel Bill',
            'Modify'
        ]
    },
]
export const billType = [
    { value: "1", name: 'Transaction Bill' },
    { value: "2", name: 'PO Bill' },
]
export const status = [
    { value: "1", name: 'Awaiting Approval' },
    { value: "2", name: 'Approved' },
    { value: "3", name: 'Paid' },
    { value: "4", name: 'Partially Paid' },
    { value: "5", name: 'Payment On Hold' },
    { value: "6", name: 'Payment Un Held' },
    { value: "7", name: 'Cancelled' },
]
export const VendorBillPayment = [
    {
        billNo: "BEMUMB232400131", Date: '10/16/2023', billAmount: "124500.00", debitNote: "0.00", paid: "0.00", pending: "124500.00", payment: "124500.00"
    },
    {
        billNo: "BEMUMB232400132", Date: '10/18/2023', billAmount: "119800.00", debitNote: "0.00", paid: "0.00", pending: "119800.00", payment: "119800.00"
    },
    {
        billNo: "BEMUMB232400133", Date: '10/20/2023', billAmount: "87500.00", debitNote: "10000.00", paid: "0.00", pending: "7500.00", payment: "7500.00"
    },
]
export const PaymentSummary = [
    {
        paymentMethod: "Cheque", institute: "ICICI", ref: "667353", amt: "251800.00"
    }
]
export const OthrPaymentSummary = [
    {
        paymentMethod: "Bank Transfer", institute: "HDFC", ref: "RTGS83833939", amt: "3500"
    },
    {
        paymentMethod: "Fuel Card", institute: "IOCL", ref: "IOC003933", amt: "4000"
    },
    {
        paymentMethod: "Cash", institute: "Cash", ref: " ", amt: "0"
    },
]
export const DocumentGenerated = [
    {
        document: "Payment Voucher", docNo: "VRMUMB003340", date: "11/13/2023", v: "View | Print"
    }
]