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
        isSelected: false,
        type: 'Long Haul',
        typeName: 'Express Route Based',
        mode: 'Road',
    },
    {
        isSelected: false,
        type: 'Long Haul',
        typeName: 'Long Haul Full Truck- Route Based',
        mode: 'Road',
    },
    {
        isSelected: false,
        type: 'Long Haul',
        typeName: 'Long Haul Lane Based',
        mode: 'Road',
    },
    {
        isSelected: false,
        type: 'Last Mile',
        typeName: 'Last Mile Delivery',
        mode: 'Road',
    },
    {
        isSelected: false,
        type: 'Last Mile',
        typeName: 'Business Associate',
        mode: 'Road/ Air/ Rail',
    },
]
export const RouteBasedTableData = [
    {
        id: 0, route: 'S00123: BHW-AMD-GGN', rateType: 'Flat', capacity: '20 Ton', rate: 55000, min: 0, max: 55000, actions: ['Edit', 'Remove']
    },
    {
        id: 1, route: 'S00324: BLR-CHN-HYD', rateType: 'Per Ton', capacity: '32 Ton Mxl', rate: 2450, min: 0, max: 9999999, actions: ['Edit', 'Remove']
    }
]
export const LastMileData = [
    {
        id: 0, location: 'MUMB', rateType: 'Per KM', timeFrame: 'Per Month', capacity: '1 Ton', minCharge: 35000, committedKm: 3000,
        additionalKm: 12.5, maxCharges: 55000, actions: ['Edit', 'Remove']
    }
]
export const BusinessAssociates = [{
    id: 0, city: 'Bhiwandi', controlLocation: 'BHW', mode: 'Road', operation: 'Booking', rateType: '% of Freight', rate: 5.5, min: 100, max: 1000, actions: ['Edit', 'Remove']
}]