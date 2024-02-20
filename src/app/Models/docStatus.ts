export enum DocketStatus {
    Awaiting_Completion = 0,//Booked at {Orgin} on {BookingDate} and awaiting completion.
    Booked = 1,//Booked at {Orgin} on {BookingDate}.
    Awaiting_Loading = 2,//Loadingsheet generated ${lsNo} on ${lSDT} and awaiting loading at {cLOC}.
    Loaded = 3,//Manifest generated ${mfNo} on ${mFDT} and awaiting departure from ${cLOC}. 
    Departed = 4,//Departed from ${cLOC} to ${nextLoc} with THC {tHC} on ${depatureDate}.
    Arrived = 5,//Arrived at ${cLOC} on ${arrivalDate}.
    In_Transhipment_Stock = 6,//In stock at ${cLOC} and available for loadingsheet since ${scanDate}.
    In_Delivery_Stock = 7,//In stock at ${cLOC} and available for delivery since ${scanDate}.
    Awaiting_Delivery = 8,//DRS generated ${dRSNO} at ${cLOC} on ${dRSDT}.
    Out_For_Delivery = 9,//Out For Delivery with DRS ${dRSNO} from ${cLOC} since ${dRSDT}.
    Delivered = 10,//Delivered to ${receiverName} on ${deliveryDate}, reason : ${deliveryReason}
    Undelivered = 11,//Delivery attempted on ${aDT}, reason : ${reason} 
    Partial_Delivered = 12,//Partially delivered to ${receiverName} on ${deliveryDate}, reason : ${deliveryReason}
    Detained = 98,//Docket detained at ${cLOC} on ${Dt}
    Cancelled = 99//Docket cancelled on ${cNDT} by ${cNBY} , reason:${cNRES}
}

export enum DocketFinStatus {
    Pending = 0
}

export enum CustomerBillStatus {
    Generated = 1,
    Approved = 2,
    Submitted = 3,
    Partial_Collected = 4,
    Collected = 5,
    Cancelled = 9
}
export enum DocketEvents {
    QuickBooking = "EVN0001",
    Booking = "EVN0001",
    Loading_Sheet_Generation = "EVN0002",
    Menifest_Generation = "EVN0003",
    THC_Generation = "EVN0004",
    Departure = "EVN0005",
    Arrival = "EVN0006",
    DRS_Generation = "EVN0007",
    DRS_Upload = "EVN0008",
    Delivery_Update = "EVN0009",
    Arrival_Scan = "EVN0010",
};
export enum VehicleStatus {
    Available= 1,
    Awaiting_Loading= 2,
    Awaiting_Departure= 3,
    Departed= 4,
    Arrived= 5,
    Unloaded= 6
}

export function getEnumName(enumObj: any, value: string): string | null {
    let foundKey = null;
    Object.keys(enumObj).forEach(key => {
        if (enumObj[key] === value) {
            foundKey = key;
        }
    });
    return foundKey;
}
