export const VendorTableData = [
    {
        vendor: 'V0034: A J Logistics',
        contractID: 'CT0001',
        contractStartDate: '10-Oct-23',
        contractEndDate: '16-Oct-23',
        status: "Active",
        expiringin: 0,
        product: "TO PAY",
    },
    {
        vendor: 'V0887: Mahesh Roadways',
        contractID: 'CT0002',
        contractStartDate: '10-Jan-23',
        contractEndDate: '16-Jan-23',
        status: "Active",
        expiringin: 0,
        product: "Air",
    },
    {
        vendor: 'V0987: Ganesh Transport',
        contractID: 'CT0003',
        contractStartDate: '10-Sep-23',
        contractEndDate: '16-Sep-23',
        status: "Expired",
        expiringin: 0,
        product: "Road",
    },
]
export const ContractTypeData = [
    {
        type: 'Long haul',
        typeName: 'Transportation- Express Route based',
        mode: 'Road',
    },
    {
        type: 'Long haul',
        typeName: 'Transportation- Long Haul full truck- route based',
        mode: 'Road',
    },
    {
        type: 'Long haul',
        typeName: 'Transportation- Long Haul lane based',
        mode: 'Road',
    },
    {
        type: 'Last Mile',
        typeName: 'Transportation- last mile delivery',
        mode: 'Road',
    },
    {
        type: 'Last Mile',
        typeName: 'Business Associate',
        mode: 'Road/ Air/ Rail',
    },
]
export const RouteBasedTableData = [
    {
        id:0,route: 'S00123: BHW-AMD-GGN', rateType: 'Flat', capacity: '20 Ton', rate: 55000, min: 0, max: 55000
    },
    {
        id:1,route: 'S00324: BLR-CHN-HYD', rateType: 'Per Ton', capacity: '32 Ton Mxl', rate: 2450, min: 0, max: 9999999
    }
]