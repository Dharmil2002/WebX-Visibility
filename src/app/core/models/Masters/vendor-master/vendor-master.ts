export class VendorDetail {
    _id?: string; // Make this property optional by using '?'
    vendorCode: string = ''; // Set a default empty string value
    vendorName: string = '';
    vendorType: string = '';
    vendorAddress: string = '';
    vendorLocation: string[] = [];
    vendorPinCode: string = '';
    vendorCity: string = '';
    vendorState: string = '';
    vendorCountry: string = '';
    vendorPhoneNo: string = '';
    emailId: string = '';
    panNo: string = '';
    panCardScan: string = '';
    cinNumber: string = '';
    msmeNumber: string = '';
    msmeScan: string = '';
    vendorAdvance: number = 0; // Set a default value (e.g., 0)
    isActive: boolean = false; // Set a default value (e.g., false)
    isBlackListed: boolean = false; // Set a default value (e.g., false)
    entryDate: string = '';
    entryBy: any = ''; // Set a default value (e.g., null)
    updateBy: string = '';
}
